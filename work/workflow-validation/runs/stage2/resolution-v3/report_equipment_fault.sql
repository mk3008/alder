-- Stage 1 business operation. Validation uses PostgreSQL POSIX [[:space:]]
-- under the database collation/locale; it does not normalize stored text.
CREATE FUNCTION report_equipment_fault(
  p_request_id TEXT,
  p_equipment_id TEXT,
  p_reported_by TEXT,
  p_reported_at TIMESTAMPTZ,
  p_description TEXT
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF p_description ~ '^[[:space:]]*$' THEN
    RAISE EXCEPTION 'description must be nonblank'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM equipment WHERE equipment_id = p_equipment_id) THEN
    RAISE EXCEPTION 'equipment does not exist'
      USING ERRCODE = '23503';
  END IF;

  INSERT INTO maintenance_request (
    request_id, equipment_id, reported_by, reported_at, description, status,
    scheduled_for, completed_at
  ) VALUES (
    p_request_id, p_equipment_id, p_reported_by, p_reported_at, p_description,
    'open', NULL, NULL
  );

  RETURN p_request_id;
END;
$$;
