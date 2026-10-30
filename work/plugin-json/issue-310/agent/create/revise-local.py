import json,pathlib,subprocess
out=pathlib.Path('/workspace/scratch/96ea68a3b906/phase-b-agent/output/create')
runtime=pathlib.Path('/workspace/scratch/96ea68a3b906/phase-b-agent/installed/plugins/alder/skills/alder-manage-json-documents/scripts/document_storage')
pkg=json.loads((out/'business-design.json').read_text()); bd=pkg['documents'][0]
pkg['revision']='package-2';bd['revision']='bd-2'; a=bd['activities'][0]
a['procedure']['steps'][0]['text']='受付スタッフが利用者から受け取った希望日と連絡先を案内台帳に登録する。'
a['procedure']['steps'][2]['text']='案内システムが案内台帳から来訪日と連絡先を読み戻し、利用者へ通知する。'
ledger=bd['objects'][3]; inf={x['name']:x['id'] for x in ledger['information']}
shared=bd['data'][1]; shared['name']='案内台帳の来訪案内';shared['items']=[dict(informationId=inf['来訪日'],condition=None),dict(informationId=inf['連絡先'],condition=None)]
dh='0969ff0d-324b-4715-b628-872117bf45e3';rh='071e3549-3965-45b8-8156-b09a268218b0'
bd['data'].append(dict(id=dh,name='案内台帳への希望記録',items=[dict(informationId=inf['希望日'],condition=None),dict(informationId=inf['希望詳細'],condition='希望詳細が届いている場合')]))
bd['relations'].append(dict(id=rh,kind='output',fromId=a['id'],toId=ledger['id'],dataId=dh))
(out/'candidate.json').write_text(json.dumps(pkg,ensure_ascii=False,indent=2)+'\n')
(out/'revision-operation.json').write_text(json.dumps(dict(expectedSha256='35c6a6dd0236f32cbab2b92c1afb5147d601896ac0b22ca46c3385816dccf1d4',expectedRevision='package-1'),indent=2)+'\n')
log=json.loads((out/'operations.json').read_text())
for args in [ ['node',str(runtime/'cli.mjs'),'validate',str(out/'candidate.json')], ['node',str(runtime/'author-cli.mjs'),'commit',str(out/'business-design.json'),str(out/'candidate.json'),str(out/'revision-operation.json')],['node',str(runtime/'author-cli.mjs'),'inspect',str(out/'business-design.json')],['node',str(runtime/'cli.mjs'),'validate',str(out/'business-design.json')]]:
 p=subprocess.run(args,text=True,capture_output=True);entry=dict(command=args,exitCode=p.returncode,stdout=p.stdout,stderr=p.stderr);log.append(entry);(out/'operations.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n');print(json.dumps(entry,ensure_ascii=False))
 if p.returncode:raise SystemExit(p.returncode)
