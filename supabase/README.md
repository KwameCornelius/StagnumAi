# Supabase migrations

SQL migrations for the Stagnum Supabase project (`losxbihilofdaxxoudwz`).

## Layout

```
supabase/
  migrations/
    <UTC timestamp>_<name>.sql
```

Each file is **idempotent** — rerunning it must be a no-op. Use
`CREATE OR REPLACE`, `DROP ... IF EXISTS`, `ON CONFLICT DO NOTHING`, etc.

## Applying

We're not yet using the Supabase CLI for push/pull, so apply manually:

1. Open the [SQL Editor](https://supabase.com/dashboard/project/losxbihilofdaxxoudwz/sql/new).
2. Paste the migration's contents and run it.
3. Re-run the security advisor to confirm fixes:
   [Database Linter](https://supabase.com/dashboard/project/losxbihilofdaxxoudwz/database/linter).

When we adopt the CLI (recommended), `supabase db push` will apply pending
migrations from this directory in filename order.

## Conventions

- Filename: `YYYYMMDDHHMMSS_short_name.sql` (UTC).
- One concern per migration. Don't bundle unrelated changes.
- Add a header comment explaining **what** the migration fixes and **why**.
- Don't `DROP` schema objects without `IF EXISTS`.
- Never put data fixes and schema changes in the same migration.
