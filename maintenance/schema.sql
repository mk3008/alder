BEGIN IMMEDIATE;
CREATE TABLE IF NOT EXISTS equipment (
  equipment_id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(equipment_id)) > 0),
  status TEXT NOT NULL CHECK (status IN ('available', 'safety_closed'))
);
CREATE TABLE IF NOT EXISTS maintenance_request (
  request_id TEXT PRIMARY KEY NOT NULL,
  equipment_id TEXT NOT NULL REFERENCES equipment(equipment_id),
  reported_by TEXT NOT NULL CHECK (length(trim(reported_by)) > 0),
  reported_at TEXT NOT NULL,
  description TEXT NOT NULL CHECK (length(trim(description)) > 0),
  status TEXT NOT NULL CHECK (status IN ('open', 'scheduled', 'completed')),
  scheduled_for TEXT,
  completed_at TEXT,
  CHECK (
    (status = 'open' AND scheduled_for IS NULL AND completed_at IS NULL) OR
    (status = 'scheduled' AND scheduled_for IS NOT NULL AND completed_at IS NULL) OR
    (status = 'completed' AND scheduled_for IS NOT NULL AND completed_at IS NOT NULL AND completed_at >= reported_at)
  )
);
CREATE INDEX IF NOT EXISTS request_equipment_status ON maintenance_request(equipment_id, status);
COMMIT;
