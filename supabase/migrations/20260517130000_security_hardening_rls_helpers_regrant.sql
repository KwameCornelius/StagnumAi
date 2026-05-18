-- Corrective follow-up to 20260517120000_security_hardening.sql
--
-- That migration revoked EXECUTE on current_org_ids() and has_org_role()
-- from authenticated, on the assumption that RLS policy evaluation doesn't
-- need the REST EXECUTE grant. That assumption was wrong: PostgreSQL
-- enforces function EXECUTE privileges during RLS evaluation regardless
-- of where the call originates, and both helpers are called from RLS
-- policies on most public tables. Revoking broke ALL signed-in reads
-- (any authenticated SELECT returned "permission denied for function
-- current_org_ids").
--
-- Re-grant EXECUTE on these two helpers to authenticated. The linter
-- warning 0029_authenticated_security_definer_function_executable will
-- return for them, but that is the intended Supabase pattern for helper
-- SECURITY DEFINER functions used by RLS (Supabase's own auth.uid() and
-- auth.role() are the same shape). We accept this as a known exception.
--
-- What stays revoked:
--   * public.handle_new_user()           — trigger-only on auth.users;
--                                          never legitimately called via REST.
--   * anon role on BOTH helpers           — unauthenticated callers have
--                                          no reason to invoke them.
--   * public.handle_new_organization()   — trigger-only on organizations.

GRANT EXECUTE ON FUNCTION public.current_org_ids()           TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, text[])  TO authenticated;
