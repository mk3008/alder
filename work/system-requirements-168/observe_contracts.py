"""Coordinator characterization oracle, not an input to review agents.
Success means the known fixture behavior was observed, NOT SR compliance.
Only stdlib, synthetic data and in-memory SQLite are used.
"""
import json
from pathlib import Path
import sqlite3
import sys
sys.path.insert(0, str(Path(__file__).parent / 'fixtures/common'))
from implementation import *

out = {}
logs=[]
case01_accept({'id':'c1','request_id':'r1','email':'synthetic@example.invalid'}, logs.append)
event=json.loads(logs[0])
out['case01']={'persisted_keys':sorted(event), 'SR1_conforms':set(event)<= {'event','request_id'}}
code, data=case02_read({'session':'valid','tenant_id':'tenant-b'}, {'id':'c2','tenant_id':'tenant-b','subject':'Other'}, PlatformIdentity())
out['case02']={'forged_header_response':code, 'business_authority_and_SR2_conform':code==403}
response=case03_response({'id':'c1'})
out['case03']={'response':response, 'SR3_conforms':response.get('id')==response['case_id']}
db=sqlite3.connect(':memory:')
db.executescript("CREATE TABLE cases (id TEXT PRIMARY KEY, legacy_title TEXT); INSERT INTO cases VALUES ('c1','Help');")
db.executescript(CASE04_UP)
try:
    db.execute('SELECT id, legacy_title FROM cases').fetchall(); old_reader=True
except sqlite3.OperationalError as e:
    old_reader=False; old_error=str(e)
new_rows=db.execute('SELECT id, subject FROM cases').fetchall()
db.executescript(CASE04_DOWN)
restored=db.execute('SELECT id, legacy_title FROM cases').fetchall()
out['case04']={'old_reader_after_up':old_reader,'old_reader_error':old_error,'new_reader_rows':new_rows,'down_restores_old_rows':restored==[('c1','Help')], 'SR4_coexistence_conforms':old_reader}
out['case05']={'planned_downtime_conforms':CASE05_DEPLOY['estimated_unavailable_minutes']<=15,'stated_restore_duration_conforms':CASE05_DEPLOY['validated_restore_minutes']<=30,'restore_point_interval_conforms':CASE05_DEPLOY['snapshot_interval_minutes']<=10,'production_observed':False}
out['case06']={'unchanged_behavior':all(case06_subject(s)==s.strip() for s in ['', '  Help  ', '\tHello\n'])}
assert not out['case01']['SR1_conforms']
assert not out['case02']['business_authority_and_SR2_conform']
assert not out['case03']['SR3_conforms']
assert not out['case04']['SR4_coexistence_conforms'] and out['case04']['down_restores_old_rows']
assert out['case05']['planned_downtime_conforms'] and out['case05']['stated_restore_duration_conforms'] and not out['case05']['restore_point_interval_conforms']
assert out['case06']['unchanged_behavior']
print(json.dumps(out,ensure_ascii=False,indent=2))
