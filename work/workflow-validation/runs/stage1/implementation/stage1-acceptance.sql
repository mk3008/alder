-- Executable assertions for the frozen Stage 1 acceptance instrument contract.
SET TIME ZONE 'UTC';

INSERT INTO equipment (equipment_id, status)
VALUES ('eq-stage1-known', 'available'), ('eq-stage1-other', 'available');

DO $$
DECLARE actual_count INTEGER;
BEGIN
  SELECT count(*) INTO actual_count FROM maintenance_request;
  IF actual_count <> 0 THEN
    RAISE EXCEPTION 'setup requires an empty maintenance_request relation';
  END IF;
END;
$$;

-- S1-01: known equipment is accepted and creates the exact open row.
SELECT report_equipment_fault(
  'req-stage1-01', 'eq-stage1-known', 'reporter-stage1',
  '2030-01-15T10:30:00Z', 'Hydraulic pressure warning observed'
);

DO $$
DECLARE row_count INTEGER;
BEGIN
  SELECT count(*) INTO row_count
  FROM maintenance_request
  WHERE request_id = 'req-stage1-01'
    AND equipment_id = 'eq-stage1-known'
    AND reported_by = 'reporter-stage1'
    AND reported_at = '2030-01-15T10:30:00Z'::timestamptz
    AND description = 'Hydraulic pressure warning observed'
    AND status = 'open'
    AND scheduled_for IS NULL
    AND completed_at IS NULL;
  IF row_count <> 1 OR (SELECT count(*) FROM maintenance_request) <> 1 THEN
    RAISE EXCEPTION 'S1-01 postcondition failed';
  END IF;
END;
$$;

TRUNCATE maintenance_request;

-- S1-02: unknown equipment is rejected and creates no row.
DO $$
BEGIN
  PERFORM report_equipment_fault(
    'req-stage1-02', 'eq-stage1-unknown', 'reporter-stage1',
    '2030-01-15T10:31:00Z', 'Unknown asset probe'
  );
  RAISE EXCEPTION 'S1-02 was accepted unexpectedly';
EXCEPTION WHEN foreign_key_violation THEN
  NULL;
END;
$$;

DO $$
BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE equipment_id = 'eq-stage1-unknown') <> 0
     OR (SELECT count(*) FROM maintenance_request WHERE request_id = 'req-stage1-02') <> 0
     OR (SELECT count(*) FROM maintenance_request) <> 0 THEN
    RAISE EXCEPTION 'S1-02 no-creation postcondition failed';
  END IF;
END;
$$;

-- S1-03: an empty description is rejected and creates no row.
DO $$
BEGIN
  PERFORM report_equipment_fault(
    'req-stage1-03', 'eq-stage1-known', 'reporter-stage1',
    '2030-01-15T10:32:00Z', ''
  );
  RAISE EXCEPTION 'S1-03 was accepted unexpectedly';
EXCEPTION WHEN invalid_parameter_value THEN
  NULL;
END;
$$;

DO $$
BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE request_id = 'req-stage1-03') <> 0
     OR (SELECT count(*) FROM maintenance_request) <> 0 THEN
    RAISE EXCEPTION 'S1-03 no-creation postcondition failed';
  END IF;
END;
$$;

-- S1-04: a second similar request is accepted in the same fixture.
SELECT report_equipment_fault(
  'req-stage1-01', 'eq-stage1-known', 'reporter-stage1',
  '2030-01-15T10:30:00Z', 'Hydraulic pressure warning observed'
);
SELECT report_equipment_fault(
  'req-stage1-04', 'eq-stage1-known', 'reporter-stage1',
  '2030-01-15T10:33:00Z', 'Hydraulic pressure warning observed'
);

DO $$
DECLARE row_count INTEGER;
BEGIN
  SELECT count(*) INTO row_count
  FROM maintenance_request
  WHERE request_id IN ('req-stage1-01', 'req-stage1-04')
    AND equipment_id = 'eq-stage1-known'
    AND reported_by = 'reporter-stage1'
    AND description = 'Hydraulic pressure warning observed'
    AND status = 'open';
  IF row_count <> 2
     OR (SELECT count(DISTINCT reported_at) FROM maintenance_request
         WHERE request_id IN ('req-stage1-01', 'req-stage1-04')) <> 2 THEN
    RAISE EXCEPTION 'S1-04 postcondition failed';
  END IF;
END;
$$;

SELECT 'STAGE1_ACCEPTANCE_PASS' AS result, current_database() AS database_name,
       current_schema() AS schema_name;
