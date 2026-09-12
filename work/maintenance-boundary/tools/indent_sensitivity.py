"""Post-hoc diagnostic: strip indentation and blank/standalone comment lines.
Not a JavaScript semantic diff, not the prespecified main metric.
"""
import difflib,json
from pathlib import Path
from measure import ROOT,files,kind
rows=[]
for arm in 'ABCD':
 previous={};cumulative=0
 for stage in ['S0','S1']:
  current={name:[line.strip() for line in lines if line.strip() and not line.lstrip().startswith('//')] for name,lines in files(ROOT/f'runs/{arm}/{stage}/source').items() if kind(name)=='production'}
  churn=0
  for name in previous.keys()|current.keys():
   for tag,a,b,c,d in difflib.SequenceMatcher(a=previous.get(name,[]),b=current.get(name,[]),autojunk=False).get_opcodes():
    if tag!='equal':churn+=(b-a)+(d-c)
  cumulative+=churn;rows.append({'arm':arm,'stage':stage,'churn':churn,'cumulative':cumulative});previous=current
print(json.dumps({'status':'post hoc diagnostic after observing C indentation churn; does not replace main metric','algorithm':'strip each line, omit blank and standalone // comments, then per-file SequenceMatcher autojunk=False','rows':rows},indent=2))
