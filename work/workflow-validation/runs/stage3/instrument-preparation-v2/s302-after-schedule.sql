-- Prepared instrument fragment, not a frozen S3-02 policy or standalone case.
-- Insert immediately after the future S3-02 schedule attempt, before printing
-- its outcome. Its request lifecycle expectation still requires HB-WV-S3-01.
SELECT clock_timestamp() schedule_db_after \gset s302_
SELECT 'S3-02 schedule clock' observation,
       :'s302_schedule_db_before' db_before, :'s302_schedule_db_after' db_after;
SELECT 1 / CASE WHEN
  :'s302_scheduled_for'::timestamptz > :'s302_schedule_db_after'::timestamptz
THEN 1 ELSE 0 END s302_schedule_future_gate;
