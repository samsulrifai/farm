BEGIN;

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE CHECK (username = lower(username)),
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('Owner', 'Admin', 'Pekerja')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMIT;
-- ponytail: single-tenant user table. Add farm_id before multi-farm access.
