CREATE TABLE equipment (
  equipment_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('available', 'safety_closed'))
);

CREATE TABLE maintenance_request (
  request_id TEXT PRIMARY KEY,
  equipment_id TEXT NOT NULL REFERENCES equipment(equipment_id),
  reported_by TEXT NOT NULL,
  reported_at TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'scheduled', 'completed')),
  scheduled_for TIMESTAMPTZ NULL,
  completed_at TIMESTAMPTZ NULL
);
