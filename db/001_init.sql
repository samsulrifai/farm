CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

CREATE TABLE flocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  strain text NOT NULL,
  started_on date NOT NULL,
  initial_hens integer NOT NULL CHECK (initial_hens > 0),
  target_hd numeric(5,2) NOT NULL CHECK (target_hd > 0 AND target_hd <= 100),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE production_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id uuid NOT NULL REFERENCES flocks(id),
  recorded_on date NOT NULL,
  total_eggs integer NOT NULL CHECK (total_eggs >= 0),
  cracked_eggs integer NOT NULL DEFAULT 0 CHECK (cracked_eggs >= 0 AND cracked_eggs <= total_eggs),
  feed_kg numeric(10,2) NOT NULL DEFAULT 0 CHECK (feed_kg >= 0),
  deaths integer NOT NULL DEFAULT 0 CHECK (deaths >= 0),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (flock_id, recorded_on)
);

CREATE TABLE feed_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moved_on date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('Masuk', 'Keluar')),
  quantity_kg numeric(10,2) NOT NULL CHECK (quantity_kg > 0),
  unit_cost numeric(14,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sold_on date NOT NULL,
  customer text NOT NULL,
  unit text NOT NULL CHECK (unit IN ('tray', 'butir', 'kg')),
  quantity numeric(10,2) NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  due_on date,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  paid_on date NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spent_on date NOT NULL,
  category text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id uuid NOT NULL REFERENCES flocks(id),
  recorded_on date NOT NULL,
  kind text NOT NULL CHECK (kind IN ('Vaksin', 'Obat', 'Gejala', 'Karantina')),
  detail text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  next_on date,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('create', 'update', 'archive', 'delete')),
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX production_entries_recorded_on_idx ON production_entries(recorded_on);
CREATE INDEX feed_movements_moved_on_idx ON feed_movements(moved_on);
CREATE INDEX sales_sold_on_idx ON sales(sold_on);
CREATE INDEX expenses_spent_on_idx ON expenses(spent_on);
CREATE INDEX health_records_flock_on_idx ON health_records(flock_id, recorded_on DESC);
CREATE INDEX audit_log_entity_idx ON audit_log(entity, entity_id, created_at DESC);

COMMIT;
-- ponytail: one farm/tenant. Add farm_id plus authorization before multi-farm deployment.
