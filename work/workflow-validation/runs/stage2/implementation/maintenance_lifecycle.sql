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
     AND status = 'open';

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
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM stage2_authorization_fixture
    WHERE actor_evidence = p_actor_evidence
      AND role_name = 'technician'
  ) THEN
    RAISE EXCEPTION 'actor is not an authorized technician'
      USING ERRCODE = '42501';
  END IF;

  UPDATE maintenance_request
     SET status = 'completed', completed_at = clock_timestamp()
   WHERE request_id = p_request_id
     AND status = 'scheduled';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'request is not a scheduled request'
      USING ERRCODE = '22023';
  END IF;

  RETURN p_request_id;
END;
$$;
