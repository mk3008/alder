-- Stage 3 business operation. This acceptance-only fixture demonstrates the
-- explicitly required safety-inspector authority; it is not an identity model.
CREATE TABLE stage3_authorization_fixture (
  actor_evidence TEXT PRIMARY KEY,
  role_name TEXT NOT NULL CHECK (role_name = 'safety_inspector')
);

INSERT INTO stage3_authorization_fixture (actor_evidence, role_name) VALUES
  ('stage3-safety-inspector-fixture', 'safety_inspector');

CREATE FUNCTION record_safety_closure(
  p_actor_evidence TEXT,
  p_equipment_id TEXT
) RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM stage3_authorization_fixture
    WHERE actor_evidence = p_actor_evidence
      AND role_name = 'safety_inspector'
  ) THEN
    RAISE EXCEPTION 'actor is not an authorized safety inspector'
      USING ERRCODE = '42501';
  END IF;

  UPDATE equipment
     SET status = 'safety_closed'
   WHERE equipment_id = p_equipment_id;

  RETURN p_equipment_id;
END;
$$;
