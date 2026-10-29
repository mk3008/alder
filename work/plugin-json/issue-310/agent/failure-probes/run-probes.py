import pathlib,json,hashlib,shutil,copy,subprocess
b=pathlib.Path('/workspace/scratch/96ea68a3b906/phase-b-agent');o=b/'output/failure-probes';cli=b/'final-installed/plugins/alder/skills/alder-manage-json-documents/scripts/document_storage/author-cli.mjs';source=b/'output/update/business-design.json'
def sha(x):return hashlib.sha256(x.read_bytes()).hexdigest()
def snap(d):return {'files':{x.name:sha(x) for x in sorted(d.iterdir()) if x.is_file()},'locks':[x.name for x in sorted(d.glob('*.alder-lock'))],'temps':[x.name for x in sorted(d.glob('.alder-json-*'))]}
protected={str(x):sha(x) for folder in ['create','update'] for x in (b/'output'/folder).iterdir() if x.is_file()}
results=[]
for name in ['malformed-json','external-lock','stale-hash','existing-create-target']:
 d=o/name;d.mkdir();target=d/'target.json';candidate=d/'candidate.json';op=d/'operation.json';shutil.copyfile(source,target)
 x=json.loads(target.read_text());x['revision']='probe-package-4';x['documents'][0]['revision']='probe-bd-4'
 candidate.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')
 operation=dict(expectedSha256=sha(target),expectedRevision='package-3')
 if name=='malformed-json':candidate.write_text('{"format": ')
 if name=='external-lock':pathlib.Path(str(target)+'.alder-lock').write_text('Disposable external-lock sentinel; not owned by CLI.\n')
 if name=='stale-hash':operation['expectedSha256']='0'*64
 if name=='existing-create-target':operation={}
 op.write_text(json.dumps(operation,indent=2)+'\n')
 command=['node',str(cli),'create',str(candidate),str(target),str(op)] if name=='existing-create-target' else ['node',str(cli),'commit',str(target),str(candidate),str(op)]
 before=snap(d);q=subprocess.run(command,text=True,capture_output=True);after=snap(d)
 v={'case':name,'command':command,'exitCode':q.returncode,'stdout':q.stdout,'stderr':q.stderr,'before':before,'after':after,'targetUnchanged':before['files']['target.json']==after['files']['target.json'],'candidateUnchanged':before['files']['candidate.json']==after['files']['candidate.json'],'externalLockPreserved':before['locks']==after['locks'] and all(before['files'][f]==after['files'][f] for f in before['locks']),'noResidualTemp':not after['temps']}
 results.append(v);(o/'operations.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v[k] for k in ['case','exitCode','stderr','targetUnchanged','candidateUnchanged','externalLockPreserved','noResidualTemp']},ensure_ascii=False))
 assert q.returncode==2 and v['targetUnchanged'] and v['candidateUnchanged'] and v['externalLockPreserved'] and v['noResidualTemp']
assert all(sha(pathlib.Path(f))==h for f,h in protected.items())
e={'scope':'Bounded actual CLI failure probes against disposable copies only; no pytest/unittest inference.','runtime':str(cli),'source':{'path':str(source),'sha256':sha(source)},'cases':results,'protectedFilesUnchanged':True,'protectedFileHashes':protected,'failureType':'Runtime rejections actually observed in all four probe cases; distinct from prior Agent refusal before rebase/Check saves.','externalLockState':'Test-created external-lock sentinel retained unchanged in disposable external-lock case directory. All other cases have no lock after the operation. All cases have no .alder-json temporary files after the operation.','agreement':'No BD approval or Check feedback fabricated. Candidates contain only BD revision metadata change, with no Check/State.'}
(o/'evidence.json').write_text(json.dumps(e,ensure_ascii=False,indent=2)+'\n')
