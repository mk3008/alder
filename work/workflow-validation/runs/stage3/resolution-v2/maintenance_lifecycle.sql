-- Stage 2 business operations.  The authorization rows are an acceptance-only
-- fixture: they demonstrate the two explicitly authorized actors without
-- defining a broader identity or role-management policy.
CREATE TABLE stage2_authorization_fixture (
  actor_evidence TEXT PRIMARY KEY,
  role_name TEXT NOT NULL CHECK (role_name IN ('maintenance_coordinator', 'technician'))
);

INSERT INTO stage2_authorization_fixture (actor_evidence, role_name) VALUES
  ('stage2-coordinator-fixture', 'maintenance_coordinator'),
  ('stage2-technician-fixture', 'technician');

CREATE FUNCTION schedule_maintenance(
  p_actor_evidence TEXT,
  p_request_id TEXT,
  p_scheduled_for TIMESTAMPTZ
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM stage2_authorization_fixture
    WHERE actor_evidence = p_actor_evidence
      AND role_name = 'maintenance_coordinator'
  ) THEN
    RAISE EXCEPTION 'actor is not an authorized maintenance coordinator'
      USING ERRCODE = '42501';
  END IF;

  IF p_scheduled_for <= clock_timestamp() THEN
    RAISE EXCEPTION 'scheduled time must be future'
      USING ERRCODE = '22023';
  END IF;

  UPDATE maintenance_request
     SET status = 'scheduled', scheduled_for = p_scheduled_for
   WHERE request_id = p_request_id
     AND status = 'open'
     AND EXISTS (
       SELECT 1
       FROM equipment
       WHERE equipment.equipment_id = maintenance_request.equipment_id
         AND equipment.status <> 'safety_closed'
     );

  IF NOT FOUND THEN
    RAISE EXCEPTION 'request is not an open request'
      USING ERRCODE = '22023';
  END IF;

  RETURN p_request_id;
END;
$$;

CREATE FUNCTION complete_maintenance(
  p_actor_evidence TEXT,
  p_request_id TEXT
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_completed_at TIMESTAMPTZ;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM stage2_authorization_fixture
    WHERE actor_evidence = p_actor_evidence
      AND role_name = 'technician'
  ) THEN
    RAISE EXCEPTION 'actor is not an authorized technician'
      USING ERRCODE = '42501';
  END IF;

  -- Capture once: this is both the chronology decision and the stored fact
  -- for this completion operation. A schedule is intentionally not a lower
  -- bound; only the decided report/completion chronology is enforced.
  v_completed_at := clock_timestamp();

  UPDATE maintenance_request
     SET status = 'completed', completed_at = v_completed_at
   WHERE request_id = p_request_id
     AND status = 'scheduled'
     AND reported_at <= v_completed_at;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'request is not a completable scheduled request'
      USING ERRCODE = '22023';
  END IF;

  RETURN p_request_id;
END;
$$;
