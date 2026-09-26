-- Cumulative Stage 2 v2 acceptance.  It executes in one psql session, which
-- makes every clock sample an observation from the operation's own session.
\set ON_ERROR_STOP on
SET TIME ZONE 'UTC';
\pset format unaligned
\pset null 'NULL'
CREATE OR REPLACE FUNCTION s2_setup(c text) RETURNS void LANGUAGE plpgsql AS $$ BEGIN
 TRUNCATE maintenance_request; INSERT INTO equipment(equipment_id,status) VALUES ('eq-stage1-known','available'),('eq-stage1-other','available') ON CONFLICT(equipment_id) DO UPDATE SET status=EXCLUDED.status;
 IF (SELECT count(*) FROM maintenance_request)<>0 THEN RAISE EXCEPTION '% setup failed',c; END IF; END $$;
CREATE OR REPLACE FUNCTION s2_report(r text,t timestamptz) RETURNS void LANGUAGE plpgsql AS $$ BEGIN PERFORM report_equipment_fault(r,'eq-stage1-known','reporter-stage1',t,'Hydraulic pressure warning observed'); END $$;
CREATE OR REPLACE FUNCTION s2_reject_schedule(a text,r text,s timestamptz) RETURNS void LANGUAGE plpgsql AS $$ BEGIN PERFORM schedule_maintenance(a,r,s); RAISE EXCEPTION 'unexpected schedule acceptance'; EXCEPTION WHEN OTHERS THEN IF SQLERRM='unexpected schedule acceptance' THEN RAISE; END IF; END $$;
CREATE OR REPLACE FUNCTION s2_reject_complete(a text,r text) RETURNS void LANGUAGE plpgsql AS $$ BEGIN PERFORM complete_maintenance(a,r); RAISE EXCEPTION 'unexpected completion acceptance'; EXCEPTION WHEN OTHERS THEN IF SQLERRM='unexpected completion acceptance' THEN RAISE; END IF; END $$;
CREATE OR REPLACE FUNCTION s2_same(c text,r text) RETURNS void LANGUAGE plpgsql AS $$ BEGIN
 IF (SELECT count(*) FROM s2_pre_call)<>1 OR (SELECT count(*) FROM maintenance_request)<>1 OR (SELECT count(*) FROM maintenance_request m JOIN s2_pre_call p ON m.request_id IS NOT DISTINCT FROM p.request_id AND m.equipment_id IS NOT DISTINCT FROM p.equipment_id AND m.reported_by IS NOT DISTINCT FROM p.reported_by AND m.reported_at IS NOT DISTINCT FROM p.reported_at AND m.description IS NOT DISTINCT FROM p.description AND m.status IS NOT DISTINCT FROM p.status AND m.scheduled_for IS NOT DISTINCT FROM p.scheduled_for AND m.completed_at IS NOT DISTINCT FROM p.completed_at WHERE m.request_id=r)<>1 THEN RAISE EXCEPTION '% rejected call mutated request',c; END IF; END $$;
CREATE OR REPLACE FUNCTION s2_clock(c text,r text,b timestamptz,a timestamptz) RETURNS void LANGUAGE plpgsql AS $$ BEGIN IF (SELECT completed_at BETWEEN b AND a FROM maintenance_request WHERE request_id=r) IS NOT TRUE THEN RAISE EXCEPTION '% DB clock gate failed',c; END IF; END $$;
CREATE OR REPLACE FUNCTION s2_state(c text,r text,st text,s timestamptz,rep timestamptz,completed boolean) RETURNS void LANGUAGE plpgsql AS $$ BEGIN IF (SELECT count(*) FROM maintenance_request WHERE request_id=r AND equipment_id='eq-stage1-known' AND reported_by='reporter-stage1' AND reported_at=rep AND description='Hydraulic pressure warning observed' AND status=st AND scheduled_for IS NOT DISTINCT FROM s AND CASE WHEN completed THEN completed_at IS NOT NULL ELSE completed_at IS NULL END)<>1 OR (SELECT count(*) FROM maintenance_request)<>1 THEN RAISE EXCEPTION '% row/count gate failed',c; END IF; END $$;
SELECT 'authorization_fixture' observation,actor_evidence,role_name FROM stage2_authorization_fixture ORDER BY role_name;

-- S2-01
SELECT s2_setup('S2-01'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); SELECT clock_timestamp() db_before \gset s201_
SELECT (:'s201_db_before'::timestamptz+interval '48 hours') scheduled \gset s201_
SELECT 'S2-01 input' observation,'stage2-coordinator-fixture' actor,:'s201_scheduled' scheduled_for; SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage2-base',:'s201_scheduled'::timestamptz); SELECT clock_timestamp() db_after \gset s201_
SELECT 'S2-01 clock' observation,:'s201_db_before' db_before,:'s201_db_after' db_after; SELECT 1 / CASE WHEN :'s201_scheduled'::timestamptz > :'s201_db_after'::timestamptz THEN 1 ELSE 0 END AS s201_future_gate; SELECT 'S2-01 row' observation,* FROM maintenance_request; SELECT s2_state('S2-01','req-stage2-base','scheduled',:'s201_scheduled'::timestamptz,'2030-01-15T10:30:00Z',false);
-- S2-02
SELECT s2_setup('S2-02'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); SELECT clock_timestamp()+interval '48 hours' scheduled \gset s202_
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage2-base',:'s202_scheduled'::timestamptz); SELECT 'S2-02 pre' observation,* FROM maintenance_request; SELECT clock_timestamp() db_before \gset s202_
SELECT 'S2-02 input' observation,'stage2-technician-fixture' actor; SELECT complete_maintenance('stage2-technician-fixture','req-stage2-base'); SELECT clock_timestamp() db_after \gset s202_
SELECT 'S2-02 clock' observation,:'s202_db_before' db_before,:'s202_db_after' db_after; SELECT 'S2-02 row' observation,* FROM maintenance_request; SELECT s2_state('S2-02','req-stage2-base','completed',:'s202_scheduled'::timestamptz,'2030-01-15T10:30:00Z',true); SELECT s2_clock('S2-02','req-stage2-base',:'s202_db_before'::timestamptz,:'s202_db_after'::timestamptz);
-- S2-03 full-row non-mutation
SELECT s2_setup('S2-03'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); BEGIN; CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage2-base'; SELECT 'S2-03 pre' observation,* FROM s2_pre_call; SELECT clock_timestamp() db_before; SELECT s2_reject_complete('stage2-technician-fixture','req-stage2-base'); SELECT clock_timestamp() db_after; SELECT s2_same('S2-03','req-stage2-base'); SELECT 'S2-03 after' observation,* FROM maintenance_request; COMMIT;
-- S2-04 full-row non-mutation after a clock-bracketed completion
SELECT s2_setup('S2-04'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); SELECT clock_timestamp()+interval '48 hours' scheduled \gset s204_
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage2-base',:'s204_scheduled'::timestamptz); SELECT clock_timestamp() db_before \gset s204c_
SELECT complete_maintenance('stage2-technician-fixture','req-stage2-base'); SELECT clock_timestamp() db_after \gset s204c_
SELECT s2_clock('S2-04 completion','req-stage2-base',:'s204c_db_before'::timestamptz,:'s204c_db_after'::timestamptz); BEGIN; CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage2-base'; SELECT clock_timestamp()+interval '72 hours' retry \gset s204_
SELECT s2_reject_schedule('stage2-coordinator-fixture','req-stage2-base',:'s204_retry'::timestamptz); SELECT s2_same('S2-04','req-stage2-base'); SELECT 'S2-04 after' observation,* FROM maintenance_request; COMMIT;
-- S2-05 / S2-06 / S2-07
SELECT s2_setup('S2-05'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); SELECT clock_timestamp()-interval '48 hours' past \gset s205_
BEGIN; CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage2-base'; SELECT s2_reject_schedule('stage2-coordinator-fixture','req-stage2-base',:'s205_past'::timestamptz); SELECT s2_same('S2-05','req-stage2-base'); COMMIT;
SELECT s2_setup('S2-06'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); SELECT clock_timestamp()+interval '48 hours' scheduled \gset s206_
BEGIN; CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage2-base'; SELECT s2_reject_schedule('reporter-stage1','req-stage2-base',:'s206_scheduled'::timestamptz); SELECT s2_same('S2-06','req-stage2-base'); COMMIT;
SELECT s2_setup('S2-07'); SELECT s2_report('req-stage2-base','2030-01-15T10:30:00Z'); SELECT clock_timestamp()+interval '48 hours' scheduled \gset s207_
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage2-base',:'s207_scheduled'::timestamptz); BEGIN; CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage2-base'; SELECT s2_reject_complete('reporter-stage1','req-stage2-base'); SELECT s2_same('S2-07','req-stage2-base'); COMMIT;
-- S2-08 / S2-09 no implicit creation
SELECT s2_setup('S2-08'); SELECT clock_timestamp()+interval '48 hours' scheduled \gset s208_
SELECT clock_timestamp() db_before; SELECT s2_reject_schedule('stage2-coordinator-fixture','req-stage2-missing',:'s208_scheduled'::timestamptz); SELECT clock_timestamp() db_after; SELECT 'S2-08 counts' observation,count(*) total,count(*) FILTER (WHERE request_id='req-stage2-missing') attempted_id FROM maintenance_request; DO $$BEGIN IF (SELECT count(*) FROM maintenance_request)<>0 THEN RAISE EXCEPTION 'S2-08 failed'; END IF; END$$;
SELECT s2_setup('S2-09'); SELECT clock_timestamp() db_before; SELECT s2_reject_complete('stage2-technician-fixture','req-stage2-missing'); SELECT clock_timestamp() db_after; SELECT 'S2-09 counts' observation,count(*) total,count(*) FILTER (WHERE request_id='req-stage2-missing') attempted_id FROM maintenance_request; DO $$BEGIN IF (SELECT count(*) FROM maintenance_request)<>0 THEN RAISE EXCEPTION 'S2-09 failed'; END IF; END$$;
-- S2-10 early completion remains valid.
SELECT s2_setup('S2-10'); SELECT clock_timestamp() report_clock_before \gset s210_
SELECT (:'s210_report_clock_before'::timestamptz+interval '24 hours') reported \gset s210_
SELECT s2_report('req-stage2-10',:'s210_reported'::timestamptz); SELECT clock_timestamp() schedule_db_before \gset s210_
SELECT GREATEST(:'s210_reported'::timestamptz,:'s210_schedule_db_before'::timestamptz)+interval '48 hours' scheduled \gset s210_
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage2-10',:'s210_scheduled'::timestamptz); SELECT clock_timestamp() schedule_db_after \gset s210_
SELECT 1 / CASE WHEN :'s210_scheduled'::timestamptz > :'s210_schedule_db_after'::timestamptz THEN 1 ELSE 0 END AS s210_schedule_gate; SELECT clock_timestamp() db_before \gset s210c_
SELECT complete_maintenance('stage2-technician-fixture','req-stage2-10'); SELECT clock_timestamp() db_after \gset s210c_
SELECT 'S2-10 row' observation,* FROM maintenance_request; SELECT s2_clock('S2-10','req-stage2-10',:'s210c_db_before'::timestamptz,:'s210c_db_after'::timestamptz); DO $$BEGIN IF (SELECT completed_at>=reported_at AND completed_at<scheduled_for FROM maintenance_request WHERE request_id='req-stage2-10') IS NOT TRUE THEN RAISE EXCEPTION 'S2-10 early gate failed'; END IF; END$$;
-- S2-11 DB time before reported_at rejects with full-row equality.
SELECT s2_setup('S2-11'); SELECT clock_timestamp() report_clock_before \gset s211_
SELECT (:'s211_report_clock_before'::timestamptz+interval '24 hours') reported \gset s211_
SELECT s2_report('req-stage2-11',:'s211_reported'::timestamptz); SELECT clock_timestamp() schedule_db_before \gset s211_
SELECT GREATEST(:'s211_reported'::timestamptz,:'s211_schedule_db_before'::timestamptz)+interval '48 hours' scheduled \gset s211_
SELECT schedule_maintenance('stage2-coordinator-fixture','req-stage2-11',:'s211_scheduled'::timestamptz); SELECT clock_timestamp() schedule_db_after \gset s211_
SELECT 1 / CASE WHEN :'s211_scheduled'::timestamptz > :'s211_schedule_db_after'::timestamptz AND clock_timestamp() < :'s211_reported'::timestamptz THEN 1 ELSE 0 END AS s211_fixture_gate; BEGIN; CREATE TEMP TABLE s2_pre_call ON COMMIT DROP AS SELECT request_id,equipment_id,reported_by,reported_at,description,status,scheduled_for,completed_at FROM maintenance_request WHERE request_id='req-stage2-11'; SELECT clock_timestamp() db_before \gset s211c_
SELECT s2_reject_complete('stage2-technician-fixture','req-stage2-11'); SELECT clock_timestamp() db_after \gset s211c_
SELECT s2_same('S2-11','req-stage2-11'); SELECT 'S2-11 row' observation,* FROM maintenance_request; COMMIT;
SELECT 'STAGE2_CUMULATIVE_ACCEPTANCE_PASS' result,current_database() database_name,current_schema() schema_name;
