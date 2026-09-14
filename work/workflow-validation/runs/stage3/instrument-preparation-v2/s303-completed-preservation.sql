-- Prepared replacement S3-03 case; not a cumulative Stage 3 acceptance run.
-- Requires the original s3_setup helper, frozen DDL, and business operations
-- in a disposable schema. See README.md before integrating into a new snapshot.
\set ON_ERROR_STOP on
BEGIN;
-- S3-03
SELECT s3_setup('S3-03'); SELECT clock_timestamp() report_db_clock \gset s303_
SELECT 'S3-03 report input' observation,'req-stage3-completed' request_id,'eq-stage3-known' equipment_id,'reporter-stage3' reported_by,:'s303_report_db_clock' reported_at,'Stage 3 completed request' description;
SELECT report_equipment_fault('req-stage3-completed','eq-stage3-known','reporter-stage3',:'s303_report_db_clock'::timestamptz,'Stage 3 completed request'); SELECT 'S3-03 report accepted' outcome;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT count(*) AS request_count FROM maintenance_request;
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-completed' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s303_report_db_clock'::timestamptz AND description='Stage 3 completed request' AND status='open' AND scheduled_for IS NULL AND completed_at IS NULL)=1 AND (SELECT count(*) FROM maintenance_request)=1 THEN 1 ELSE 0 END s303_report_gate;
SELECT clock_timestamp() schedule_db_before \gset s303_
SELECT (:'s303_schedule_db_before'::timestamptz + interval '48 hours') scheduled_for \gset s303_
SELECT 'S3-03 schedule input' observation,'stage2-coordinator-fixture' actor,'maintenance_coordinator' authorization,'req-stage3-completed' request_id,:'s303_scheduled_for' scheduled_for;
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage3-completed',:'s303_scheduled_for'::timestamptz); SELECT clock_timestamp() schedule_db_after \gset s303_
SELECT 1/CASE WHEN :'s303_scheduled_for'::timestamptz > :'s303_schedule_db_after'::timestamptz THEN 1 ELSE 0 END s303_schedule_future_gate;
SELECT 'S3-03 schedule clock' observation,:'s303_schedule_db_before' db_before,:'s303_schedule_db_after' db_after;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT count(*) AS request_count FROM maintenance_request;
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-completed' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s303_report_db_clock'::timestamptz AND description='Stage 3 completed request' AND status='scheduled' AND scheduled_for=:'s303_scheduled_for'::timestamptz AND completed_at IS NULL)=1 AND (SELECT count(*) FROM maintenance_request)=1 THEN 1 ELSE 0 END s303_scheduled_gate;
SELECT clock_timestamp() completion_db_before \gset s303_
SELECT 1/CASE WHEN :'s303_completion_db_before'::timestamptz < :'s303_scheduled_for'::timestamptz THEN 1 ELSE 0 END s303_early_before_gate;
SELECT 'S3-03 complete input' observation,'stage2-technician-fixture' actor,'technician' authorization,'req-stage3-completed' request_id;
SELECT complete_maintenance('stage2-technician-fixture','req-stage3-completed'); SELECT clock_timestamp() completion_db_after \gset s303_
SELECT 1/CASE WHEN :'s303_completion_db_after'::timestamptz < :'s303_scheduled_for'::timestamptz THEN 1 ELSE 0 END s303_early_after_gate;
SELECT 'S3-03 completion clock' observation,:'s303_completion_db_before' db_before,:'s303_completion_db_after' db_after;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-completed' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s303_report_db_clock'::timestamptz AND description='Stage 3 completed request' AND status='completed' AND scheduled_for=:'s303_scheduled_for'::timestamptz AND completed_at BETWEEN :'s303_completion_db_before'::timestamptz AND :'s303_completion_db_after'::timestamptz AND completed_at>=reported_at AND completed_at<scheduled_for)=1 AND (SELECT count(*) FROM maintenance_request)=1 THEN 1 ELSE 0 END s303_completion_gate;
SELECT count(*) AS request_count FROM maintenance_request;
CREATE TEMP TABLE s303_pre_closure ON COMMIT DROP AS
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT 'S3-03 exact pre-closure row' observation,* FROM s303_pre_closure;
SELECT 'S3-03 closure input' observation,'stage3-safety-inspector-fixture' actor,'safety_inspector' authorization,'eq-stage3-known' equipment_id;
SELECT record_safety_closure('stage3-safety-inspector-fixture','eq-stage3-known'); SELECT 'S3-03 closure accepted' outcome;
SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage3-completed';
SELECT equipment_id,status FROM equipment WHERE equipment_id='eq-stage3-known'; SELECT count(*) AS request_count FROM maintenance_request WHERE equipment_id='eq-stage3-known';
SELECT 1/CASE WHEN (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage3-completed' AND equipment_id='eq-stage3-known' AND reported_by='reporter-stage3' AND reported_at=:'s303_report_db_clock'::timestamptz AND description='Stage 3 completed request' AND status='completed' AND scheduled_for=:'s303_scheduled_for'::timestamptz AND completed_at BETWEEN :'s303_completion_db_before'::timestamptz AND :'s303_completion_db_after'::timestamptz AND completed_at>=reported_at)=1 AND (SELECT count(*) FROM equipment WHERE equipment_id='eq-stage3-known' AND status='safety_closed')=1 AND (SELECT count(*) FROM maintenance_request WHERE equipment_id='eq-stage3-known')=1 THEN 1 ELSE 0 END s303_gate;

-- Preserve every field, including the exact completion instant, not only its bracket.
DO $$ BEGIN
  IF (SELECT count(*) FROM s303_pre_closure) <> 1
     OR (SELECT count(*) FROM maintenance_request) <> 1
     OR EXISTS (SELECT * FROM s303_pre_closure EXCEPT SELECT * FROM maintenance_request)
     OR EXISTS (SELECT * FROM maintenance_request EXCEPT SELECT * FROM s303_pre_closure)
  THEN RAISE EXCEPTION 'S3-03 closure changed completed request'; END IF;
END $$;
COMMIT;
