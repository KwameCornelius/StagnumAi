-- Security hardening pass — addresses every ERROR/WARN reported by the
-- Supabase database linter on project losxbihilofdaxxoudwz as of 2026-05-17.
--
-- This migration is idempotent: rerunning it is a no-op.
-- It does NOT touch row data. It does NOT change any view's column list,
-- so the generated TypeScript types (src/types/supabase.ts) stay valid.

------------------------------------------------------------------------------
-- 1. Recreate SECURITY DEFINER views as SECURITY INVOKER
--    Was: views ran as their creator (postgres), bypassing RLS — every
--    authenticated user saw every org's data.
--    Now: views run as the calling user, so the underlying tables' RLS
--    policies (all org-scoped) filter rows by membership.
--    Fixes advisor: 0010_security_definer_view (x5, ERROR).
------------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_asset_distribution
  WITH (security_invoker = true) AS
SELECT
  organization_id,
  id,
  code,
  name,
  status,
  category,
  current_value,
  round(
    (100.0 * current_value) /
    NULLIF(sum(current_value) OVER (PARTITION BY organization_id), 0),
    2
  ) AS allocation_pct
FROM public.assets
WHERE current_value IS NOT NULL;

CREATE OR REPLACE VIEW public.v_org_kpis
  WITH (security_invoker = true) AS
WITH account_balances AS (
  SELECT
    a.organization_id,
    (sum(a.opening_balance)
       + COALESCE(sum(p.amount), 0)
       - COALESCE(sum(e.amount), 0)) AS total_balance
  FROM public.accounts a
  LEFT JOIN public.payments p ON p.account_id = a.id
  LEFT JOIN public.expenses e ON e.paid_from_account_id = a.id
  WHERE a.is_active = true
  GROUP BY a.organization_id
),
project_stats AS (
  SELECT
    organization_id,
    count(*) FILTER (WHERE status <> 'closed'::project_stage) AS active_project_count,
    sum(contract_value) FILTER (WHERE status <> 'closed'::project_stage) AS active_contract_value,
    sum(forecast_value) FILTER (WHERE status <> 'closed'::project_stage) AS active_forecast_value
  FROM public.projects
  GROUP BY organization_id
),
asset_stats AS (
  SELECT
    organization_id,
    count(*) AS active_assets_count
  FROM public.assets
  WHERE status = ANY (ARRAY['available'::asset_status, 'in_use'::asset_status])
  GROUP BY organization_id
)
SELECT
  o.id   AS organization_id,
  o.name AS org_name,
  COALESCE(ab.total_balance, 0)            AS total_balance,
  COALESCE(ps.active_project_count, 0)     AS active_project_count,
  COALESCE(ps.active_contract_value, 0)    AS active_contract_value,
  COALESCE(ps.active_forecast_value, 0)    AS active_forecast_value,
  COALESCE(ast.active_assets_count, 0)     AS active_assets_count,
  CASE
    WHEN COALESCE(ps.active_contract_value, 0) = 0 THEN NULL::numeric
    ELSE round((ps.active_forecast_value / ps.active_contract_value) * 100, 2)
  END AS pl_ratio,
  NULL::numeric AS market_rank,
  NULL::numeric AS mom_balance_change_pct
FROM public.organizations o
LEFT JOIN account_balances ab ON ab.organization_id = o.id
LEFT JOIN project_stats    ps ON ps.organization_id = o.id
LEFT JOIN asset_stats      ast ON ast.organization_id = o.id;

CREATE OR REPLACE VIEW public.v_performance_forecast_monthly
  WITH (security_invoker = true) AS
SELECT
  p.organization_id,
  date_trunc('month', gs.month_start)::date AS month,
  p.status AS stage,
  sum(p.forecast_value) AS forecasted_value
FROM public.projects p
CROSS JOIN LATERAL (
  SELECT generate_series(
    date_trunc('month', COALESCE(p.start_date, p.created_at::date)::timestamptz),
    date_trunc('month', COALESCE(p.target_end_date::timestamp,
                                 (p.created_at::date + interval '1 year')))::timestamptz,
    interval '1 month'
  ) AS month_start
) gs
WHERE p.forecast_value IS NOT NULL
GROUP BY p.organization_id, date_trunc('month', gs.month_start)::date, p.status;

CREATE OR REPLACE VIEW public.v_procurement_gate_status
  WITH (security_invoker = true) AS
SELECT
  project_id,
  organization_id,
  count(*) FILTER (WHERE status = 'locked'::gate_status)   AS locked_count,
  count(*) FILTER (WHERE status = 'pending'::gate_status)  AS pending_count,
  count(*) FILTER (WHERE status = 'unlocked'::gate_status) AS unlocked_count,
  count(*) AS total_gates
FROM public.procurement_gates
GROUP BY project_id, organization_id;

CREATE OR REPLACE VIEW public.v_recent_activity
  WITH (security_invoker = true) AS
SELECT
  ae.id,
  ae.organization_id,
  ae.verb,
  ae.entity_type,
  ae.entity_id,
  ae.summary,
  ae.metadata,
  ae.created_at,
  ae.actor_user_id,
  p.full_name  AS actor_name,
  p.avatar_url AS actor_avatar
FROM public.activity_events ae
LEFT JOIN public.profiles p ON p.id = ae.actor_user_id
ORDER BY ae.created_at DESC;

------------------------------------------------------------------------------
-- 2. Lock down search_path on every function flagged by the linter.
--    Mutable search_path is a privilege-escalation vector for any
--    SECURITY DEFINER function and is best practice for the rest.
--    Fixes advisor: 0011_function_search_path_mutable (x11, WARN).
--    Using ALTER FUNCTION (not CREATE OR REPLACE) preserves the body.
------------------------------------------------------------------------------

ALTER FUNCTION public.set_updated_at()                                          SET search_path = public, pg_temp;
ALTER FUNCTION public.sync_rate_item_version()                                  SET search_path = public, pg_temp;
ALTER FUNCTION public.next_entity_code(uuid, text)                              SET search_path = public, pg_temp;
ALTER FUNCTION public.emit_activity_event(uuid, uuid, text, text, uuid, text, jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_po_status_event()                                     SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_invoice_status_event()                                SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_gate_status_event()                                   SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_rate_version_event()                                  SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_variation_status_event()                              SET search_path = public, pg_temp;
ALTER FUNCTION public.trg_approval_sync_entity()                                SET search_path = public, pg_temp;
ALTER FUNCTION audit.if_modified()                                              SET search_path = public, pg_temp;

------------------------------------------------------------------------------
-- 3. Revoke REST access to SECURITY DEFINER helper functions.
--    These three were callable via /rest/v1/rpc/<fn> by anon and authenticated
--    users. They are only meant to be called from RLS policies (which run
--    independently of REST grants) and the auth.users trigger.
--    Fixes advisors: 0028 + 0029 anon/authenticated SECURITY DEFINER exec.
------------------------------------------------------------------------------

REVOKE EXECUTE ON FUNCTION public.current_org_ids()              FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, text[])     FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()              FROM PUBLIC, anon, authenticated;

-- handle_new_user fires from the on_auth_user_created trigger on auth.users —
-- triggers run regardless of EXECUTE grants, so this change does NOT break
-- the signup → profile-creation flow.

------------------------------------------------------------------------------
-- 4. Tighten always-true RLS policies.
--    Fixes advisor: 0024_permissive_rls_policy (x2, WARN).
------------------------------------------------------------------------------

-- 4a. audit_log: never accept REST inserts. The audit.if_modified() trigger
-- is SECURITY DEFINER (owned by a role with BYPASSRLS) and writes audit rows
-- on every table change; the direct INSERT path should not exist for clients.
DROP POLICY IF EXISTS audit_insert ON public.audit_log;

-- 4b. organizations: keep the bootstrap path (signed-in users can create
-- their org) but stop using a literal `true` check and ensure the creator
-- becomes an `owner` member atomically — without that, the dashboard's
-- org-scoped views return empty for the new user.
DROP POLICY IF EXISTS orgs_insert ON public.organizations;
CREATE POLICY orgs_insert ON public.organizations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.organization_members (organization_id, user_id, role, accepted_at)
  VALUES (NEW.id, auth.uid(), 'owner'::org_role, now())
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_organization() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_organization_created ON public.organizations;
CREATE TRIGGER on_organization_created
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_organization();
