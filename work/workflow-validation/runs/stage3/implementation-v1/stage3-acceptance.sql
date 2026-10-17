-- Cumulative Stage 1--3 addition. Stage 1 v3 and Stage 2 v4 run unchanged first.
\set ON_ERROR_STOP on
SET TIME ZONE 'UTC';
\pset format unaligned
\pset null 'NULL'

CREATE OR REPLACE FUNCTION s3_setup(c text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  TRUNCATE maintenance_request;
  INSERT INTO equipment(equipment_id,status) VALUES ('eq-stage3-known','available')
    ON CONFLICT(equipment_id) DO UPDATE SET status=EXCLUDED.status;
  IF (SELECT count(*) FROM maintenance_request) <> 0
     OR (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known' AND status='available') <> 1 THEN
    RAISE EXCEPTION '% setup failed', c;
  END IF;
END $$;
CREATE OR REPLACE FUNCTION s3_reject_schedule(a text,r text,s timestamptz) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM schedule_maintenance(a,r,s); RAISE EXCEPTION 'unexpected schedule acceptance';
EXCEPTION WHEN OTHERS THEN IF SQLERRM='unexpected schedule acceptance' THEN RAISE; END IF;
END $$;
CREATE OR REPLACE FUNCTION s3_reject_closure(a text,e text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM record_safety_closure(a,e); RAISE EXCEPTION 'unexpected closure acceptance';
EXCEPTION WHEN OTHERS THEN IF SQLERRM='unexpected closure acceptance' THEN RAISE; END IF;
END $$;

SELECT 'stage3_authorization_fixture' observation,actor_evidence,role_name FROM stage3_authorization_fixture;

-- S3-01
SELECT s3_setup('S3-01');
SELECT 'S3-01 closure input' observation,'stage3-safety-inspector-fixture' actor,'safety_inspector' authorization,'eq-stage3-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage3-known');
SELECT 'S3-01 accepted' outcome;
SELECT equipment_id,status FROM equipment WHERE equipment_id='eq-stage3-known';
SELECT count(*) AS equipment_count FROM equipment WHERE equipment_id='eq-stage3-known';
SELECT count(*) AS request_count FROM maintenance_request WHERE equipment_id='eq-stage3-known';
DO $$ BEGIN
  IF (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known' AND status='safety_closed') <> 1
     OR (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known') <> 1
     OR (SELECT count(*) FROM maintenance_request WHERE equipment_id='eq-stage3-known') <> 0 THEN RAISE EXCEPTION 'S3-01 failed'; END IF;
END $$;

-- S3-02
SELECT s3_setup('S3-02'); SELECT clock_timestamp() report_db_clock \gset s302_
SELECT 'S3-02 report input' observation,'req-stage3-open' request_id,'eq-stage3-known' equipment_id,'reporter-stage3' reported_by,:'s302_report_db_clock' reported_at,'Stage 3 open request' description;
SELECT report_equipment_fault('req-stage3-open','eq-stage3-known','reporter-stage3',:'s302_report_db_clock'::timestamptz,'Stage 3 open request');
SELECT 'S3-02 report accepted' outcome;
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-open' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s302_report_db_clock'::timestamptz AND description='Stage 3 open request' AND status='open' AND scheduled_for IS NULL AND completed_at IS NULL)=1 AND (SELECT count(*) FROM maintenance_request WHERE equipment_id='eq-stage3-known')=1 THEN 1 ELSE 0 END s302_report_gate;
SELECT 'S3-02 closure input' observation,'stage3-safety-inspector-fixture' actor,'safety_inspector' authorization,'eq-stage3-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage3-known'); SELECT 'S3-02 closure accepted' outcome;
SELECT clock_timestamp() schedule_db_before \gset s302_
SELECT (:'s302_schedule_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s302_
SELECT 'S3-02 schedule input' observation,'stage2-coordinator-fixture' actor,'maintenance_coordinator' authorization,'req-stage3-open' request_id,:'s302_scheduled_for' scheduled_for;
SELECT s3_reject_schedule('stage2-coordinator-fixture','req-stage3-open',:'s302_scheduled_for'::timestamptz); SELECT 'S3-02 rejected' outcome;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-open';
SELECT equipment_id,status FROM equipment WHERE equipment_id='eq-stage3-known'; SELECT count(*) AS request_count FROM maintenance_request WHERE equipment_id='eq-stage3-known';
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-open' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s302_report_db_clock'::timestamptz AND description='Stage 3 open request' AND status='open' AND scheduled_for IS NULL AND completed_at IS NULL)=1 AND (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known' AND status='safety_closed')=1 AND (SELECT count(*) FROM maintenance_request WHERE equipment_id='eq-stage3-known')=1 THEN 1 ELSE 0 END s302_gate;

-- S3-03
SELECT s3_setup('S3-03'); SELECT clock_timestamp() report_db_clock \gset s303_
SELECT 'S3-03 report input' observation,'req-stage3-completed' request_id,'eq-stage3-known' equipment_id,'reporter-stage3' reported_by,:'s303_report_db_clock' reported_at,'Stage 3 completed request' description;
SELECT report_equipment_fault('req-stage3-completed','eq-stage3-known','reporter-stage3',:'s303_report_db_clock'::timestamptz,'Stage 3 completed request'); SELECT 'S3-03 report accepted' outcome;
SELECT clock_timestamp() schedule_db_before \gset s303_
SELECT (:'s303_schedule_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s303_
SELECT 'S3-03 schedule input' observation,'stage2-coordinator-fixture' actor,'maintenance_coordinator' authorization,'req-stage3-completed' request_id,:'s303_scheduled_for' scheduled_for;
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage3-completed',:'s303_scheduled_for'::timestamptz); SELECT clock_timestamp() schedule_db_after \gset s303_
SELECT 1/CASE WHEN :'s303_scheduled_for'::timestamptz > :'s303_schedule_db_after'::timestamptz THEN 1 ELSE 0 END s303_schedule_future_gate;
SELECT clock_timestamp() completion_db_before \gset s303_
SELECT 'S3-03 complete input' observation,'stage2-technician-fixture' actor,'technician' authorization,'req-stage3-completed' request_id;
SELECT complete_maintenance('stage2-technician-fixture','req-stage3-completed'); SELECT clock_timestamp() completion_db_after \gset s303_
SELECT 'S3-03 completion clock' observation,:'s303_completion_db_before' db_before,:'s303_completion_db_after' db_after;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-completed' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s303_report_db_clock'::timestamptz AND description='Stage 3 completed request' AND status='completed' AND scheduled_for=:'s303_scheduled_for'::timestamptz AND completed_at BETWEEN :'s303_completion_db_before'::timestamptz AND :'s303_completion_db_after'::timestamptz AND completed_at>=reported_at)=1 THEN 1 ELSE 0 END s303_completion_gate;
SELECT 'S3-03 closure input' observation,'stage3-safety-inspector-fixture' actor,'safety_inspector' authorization,'eq-stage3-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage3-known'); SELECT 'S3-03 closure accepted' outcome;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT equipment_id,status FROM equipment WHERE equipment_id='eq-stage3-known'; SELECT count(*) AS request_count FROM maintenance_request WHERE equipment_id='eq-stage3-known';
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-completed' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s303_report_db_clock'::timestamptz AND description='Stage 3 completed request' AND status='completed' AND scheduled_for=:'s303_scheduled_for'::timestamptz AND completed_at BETWEEN :'s303_completion_db_before'::timestamptz AND :'s303_completion_db_after'::timestamptz AND completed_at>=reported_at)=1 AND (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known' AND status='safety_closed')=1 AND (SELECT count(*) FROM maintenance_request WHERE equipment_id='eq-stage3-known')=1 THEN 1 ELSE 0 END s303_gate;

-- Authority-negative coverage
SELECT s3_setup('S3-authority-negative');
SELECT 'S3-authority-negative closure input' observation,'stage2-coordinator-fixture' actor,'not safety_inspector' authorization,'eq-stage3-known' equipment_id;
SELECT s3_reject_closure('stage2-coordinator-fixture','eq-stage3-known'); SELECT 'S3-authority-negative rejected' outcome;
SELECT equipment_id,status FROM equipment WHERE equipment_id='eq-stage3-known'; SELECT count(*) AS request_count FROM maintenance_request WHERE equipment_id='eq-stage3-known';
DO $$ BEGIN IF (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known' AND status='available')<>1 OR (SELECT count(*) FROM maintenance_request WHERE equipment_id='eq-stage3-known')<>0 THEN RAISE EXCEPTION 'S3 authority-negative failed'; END IF; END $$;
SELECT 'STAGE3_CUMULATIVE_ACCEPTANCE_PASS' result,current_database() database_name,current_schema() schema_name;
