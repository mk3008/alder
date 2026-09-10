-- Cumulative addition; Stage 1 v3, Stage 2 v4 and Stage 3 v2 ran unchanged first.
\set ON_ERROR_STOP on
SET TIME ZONE 'UTC';
\pset format unaligned
\pset null 'NULL'
SELECT 'Stage 4 inspector authority' observation,* FROM stage3_authorization_fixture;
SELECT 'Stage 4 maintenance authority' observation,* FROM stage2_authorization_fixture;

CREATE FUNCTION s4_setup(c text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  TRUNCATE maintenance_request;
  INSERT INTO equipment VALUES ('eq-stage4-known','available')
  ON CONFLICT(equipment_id) DO UPDATE SET status='available';
  RAISE NOTICE 'case %',c;
END $$;
CREATE FUNCTION s4_equipment(expected text,n integer) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage4-known' AND status=expected)<>1
     OR (SELECT count(*) FROM maintenance_request)<>n
  THEN RAISE EXCEPTION 'S4 equipment/count gate failed'; END IF;
END $$;
CREATE FUNCTION s4_state(expected text,reported timestamptz,scheduled timestamptz)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage4-open'
      AND equipment_id='eq-stage4-known' AND reported_by='reporter-stage4'
      AND reported_at=reported AND description='Stage 4 reported fault'
      AND status=expected AND scheduled_for IS NOT DISTINCT FROM scheduled
      AND completed_at IS NULL)<>1 OR (SELECT count(*) FROM maintenance_request)<>1
  THEN RAISE EXCEPTION 'S4 complete row gate failed'; END IF;
END $$;
CREATE FUNCTION s4_same() RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM s4_pre_call)<>1 OR (SELECT count(*) FROM maintenance_request)<>1
     OR EXISTS (SELECT * FROM s4_pre_call EXCEPT SELECT * FROM maintenance_request)
     OR EXISTS (SELECT * FROM maintenance_request EXCEPT SELECT * FROM s4_pre_call)
  THEN RAISE EXCEPTION 'S4 request changed unexpectedly'; END IF;
END $$;
CREATE FUNCTION s4_reject_clear(actor text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM clear_safety_closure(actor,'eq-stage4-known');
  RAISE EXCEPTION 'unexpected clear acceptance';
EXCEPTION WHEN OTHERS THEN IF SQLERRM='unexpected clear acceptance' THEN RAISE; END IF;
END $$;

-- S4-01
BEGIN;
SELECT s4_setup('S4-01');
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',0);
SELECT 'S4-01 close input' observation,'stage3-safety-inspector-fixture' actor,'eq-stage4-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage4-known');
SELECT 'S4-01 close accepted' outcome;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT s4_equipment('safety_closed',0);
SELECT 'S4-01 clear input' observation,'stage3-safety-inspector-fixture' actor,'eq-stage4-known' equipment_id;
SELECT clear_safety_closure('stage3-safety-inspector-fixture','eq-stage4-known');
SELECT 'S4-01 clear accepted' outcome;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',0);
COMMIT;

-- S4-02
BEGIN;
SELECT s4_setup('S4-02');
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',0);
SELECT clock_timestamp() reported \gset s4_
SELECT 'S4-02 report input' observation,'req-stage4-open' request_id,'eq-stage4-known' equipment_id,'reporter-stage4' reported_by,:'s4_reported' reported_at,'Stage 4 reported fault' description;
SELECT report_equipment_fault('req-stage4-open','eq-stage4-known','reporter-stage4',:'s4_reported'::timestamptz,'Stage 4 reported fault');
SELECT 'S4-02 report accepted' outcome;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_state('open',:'s4_reported'::timestamptz,NULL);
CREATE TEMP TABLE s4_pre_call ON COMMIT DROP AS SELECT * FROM maintenance_request;
SELECT 'S4-02 exact pre-closure' observation,* FROM s4_pre_call;
SELECT 'S4-02 close input' observation,'stage3-safety-inspector-fixture' actor,'eq-stage4-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage4-known');
SELECT 'S4-02 close accepted' outcome;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('safety_closed',1);
SELECT s4_same();
SELECT 'pre schedule' observation;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT clock_timestamp() db_before \gset s4_
SELECT (:'s4_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s4_
SELECT 'S4-02 schedule input' observation,'stage2-coordinator-fixture' actor,'req-stage4-open' request_id,:'s4_scheduled_for' scheduled_for;
SELECT s3_reject_schedule('stage2-coordinator-fixture','req-stage4-open',:'s4_scheduled_for'::timestamptz);
SELECT clock_timestamp() db_after \gset s4_
SELECT 'S4-02 schedule rejected' outcome;
SELECT 'S4-02 schedule clock' observation,:'s4_db_before' db_before,:'s4_db_after' db_after;
SELECT 1/CASE WHEN :'s4_scheduled_for'::timestamptz > :'s4_db_after'::timestamptz THEN 1 ELSE 0 END s4_future_gate;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('safety_closed',1);
SELECT s4_same();
SELECT 'S4-02 clear input' observation,'stage3-safety-inspector-fixture' actor,'eq-stage4-known' equipment_id;
SELECT clear_safety_closure('stage3-safety-inspector-fixture','eq-stage4-known');
SELECT 'S4-02 clear accepted' outcome;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',1);
SELECT s4_same();
SELECT 'pre schedule' observation;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT clock_timestamp() db_before \gset s4_
SELECT (:'s4_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s4_
SELECT 'S4-02 schedule input' observation,'reporter-stage4' actor,'req-stage4-open' request_id,:'s4_scheduled_for' scheduled_for;
SELECT s3_reject_schedule('reporter-stage4','req-stage4-open',:'s4_scheduled_for'::timestamptz);
SELECT clock_timestamp() db_after \gset s4_
SELECT 'S4-02 schedule rejected' outcome;
SELECT 'S4-02 schedule clock' observation,:'s4_db_before' db_before,:'s4_db_after' db_after;
SELECT 1/CASE WHEN :'s4_scheduled_for'::timestamptz > :'s4_db_after'::timestamptz THEN 1 ELSE 0 END s4_future_gate;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',1);
SELECT s4_same();
SELECT 'pre schedule' observation;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT clock_timestamp() db_before \gset s4_
SELECT (:'s4_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s4_
SELECT 'S4-02 schedule input' observation,'stage2-coordinator-fixture' actor,'req-stage4-open' request_id,:'s4_scheduled_for' scheduled_for;
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage4-open',:'s4_scheduled_for'::timestamptz);
SELECT clock_timestamp() db_after \gset s4_
SELECT 'S4-02 schedule accepted' outcome;
SELECT 'S4-02 schedule clock' observation,:'s4_db_before' db_before,:'s4_db_after' db_after;
SELECT 1/CASE WHEN :'s4_scheduled_for'::timestamptz > :'s4_db_after'::timestamptz THEN 1 ELSE 0 END s4_future_gate;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',1);
SELECT s4_state('scheduled',:'s4_reported'::timestamptz,:'s4_scheduled_for'::timestamptz);
COMMIT;

-- S4-03
BEGIN;
SELECT s4_setup('S4-03');
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('available',0);
SELECT clock_timestamp() reported \gset s4_
SELECT 'S4-03 report input' observation,'req-stage4-open' request_id,'eq-stage4-known' equipment_id,'reporter-stage4' reported_by,:'s4_reported' reported_at,'Stage 4 reported fault' description;
SELECT report_equipment_fault('req-stage4-open','eq-stage4-known','reporter-stage4',:'s4_reported'::timestamptz,'Stage 4 reported fault');
SELECT 'S4-03 report accepted' outcome;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_state('open',:'s4_reported'::timestamptz,NULL);
CREATE TEMP TABLE s4_pre_call ON COMMIT DROP AS SELECT * FROM maintenance_request;
SELECT 'S4-03 exact pre-closure' observation,* FROM s4_pre_call;
SELECT 'S4-03 close input' observation,'stage3-safety-inspector-fixture' actor,'eq-stage4-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage4-known');
SELECT 'S4-03 close accepted' outcome;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('safety_closed',1);
SELECT s4_same();
SELECT 'S4-03 clear input' observation,'stage2-coordinator-fixture' actor,'eq-stage4-known' equipment_id;
SELECT s4_reject_clear('stage2-coordinator-fixture');
SELECT 'S4-03 clear rejected' outcome;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('safety_closed',1);
SELECT s4_same();
SELECT 'pre schedule' observation;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT clock_timestamp() db_before \gset s4_
SELECT (:'s4_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s4_
SELECT 'S4-03 schedule input' observation,'stage2-coordinator-fixture' actor,'req-stage4-open' request_id,:'s4_scheduled_for' scheduled_for;
SELECT s3_reject_schedule('stage2-coordinator-fixture','req-stage4-open',:'s4_scheduled_for'::timestamptz);
SELECT clock_timestamp() db_after \gset s4_
SELECT 'S4-03 schedule rejected' outcome;
SELECT 'S4-03 schedule clock' observation,:'s4_db_before' db_before,:'s4_db_after' db_after;
SELECT 1/CASE WHEN :'s4_scheduled_for'::timestamptz > :'s4_db_after'::timestamptz THEN 1 ELSE 0 END s4_future_gate;
SELECT * FROM maintenance_request;
SELECT * FROM equipment WHERE equipment_id='eq-stage4-known';
SELECT count(*) request_count FROM maintenance_request;
SELECT s4_equipment('safety_closed',1);
SELECT s4_same();
COMMIT;
SELECT 'STAGE4_CUMULATIVE_ACCEPTANCE_PASS' result,current_database() database_name,current_schema() schema_name;
