-- Enable RLS on email_sequences table
-- This table is accessed exclusively via server-side API routes using the service role key,
-- which bypasses RLS. Enabling RLS without public policies blocks any direct client access.

ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;

-- No public policies needed — all access goes through service role (API routes),
-- which bypasses RLS automatically.
