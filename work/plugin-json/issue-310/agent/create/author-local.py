import json, pathlib, subprocess, hashlib
base=pathlib.Path('/workspace/scratch/96ea68a3b906/phase-b-agent')
out=base/'output/create'; plugin=base/'installed/plugins/alder'; runtime=plugin/'skills/alder-manage-json-documents/scripts/document_storage'
ids='b8a1e7e8-1b0e-4f17-88c8-f89b538d5b13 3d88996a-b412-4bdd-9353-f86055fe61f2 8a8a553f-0021-4741-a529-8568bfc1eb83 a49bfe1d-2848-4a68-bb80-9ecadd44c107 f6b26bcf-5cd0-4915-aedf-a506190dfb9c 3512aaef-752e-4ad0-b3fe-0cbbffe2738a eab11053-53fe-40f7-a1e7-ad3e96b206e7 6325ea3b-e3de-46a9-aecd-bda3c4fe1e87 b014deeb-0c80-4a42-8e5c-dbb6de66aacb a4e29b88-25f6-41ca-890f-26adcc1572b0 81f97d83-eb82-4856-b948-80f8c5091065 83ece4fb-8ae0-4621-b669-0669bd1e834b 054e4ddc-647f-4fde-92a8-d11bf247c296 739b4803-7ec4-4176-aca0-522ea9c65b78 9b64e4c6-0275-4a13-8c16-f3ef9a9c3550 79289579-0a13-491c-9b9f-c80116a7d821 0b08d343-bb58-4c3c-986c-6f818de43f18 2a4d6355-2b58-40d6-a6e4-4dea5122da90 e091d686-2744-40f6-9dad-1d68160404a2 80d0aec8-c1a0-46b7-b515-c5eeb0236638 5b40fbc5-f825-4de9-aa77-bbcb0dad6d28 48e44877-f965-4ef7-852f-ae92c3eba257 614a6e82-87bf-4248-81a3-c413b8d6e3cb 141ad0fb-f68e-43d8-b686-f528b5e9d2e4 18b23cd6-51cd-4c18-93b5-3dfe5cbbddbf b6ff5b69-0460-4cd6-ba18-a1e8a5d5eb2c 83e5e2d8-2c8f-4f50-8d15-de7f99b1107e 2e2495cc-c371-4484-9fd0-f85d67debc4a 15e53042-5f2b-4dbe-b035-8be4605d1ad0 64a0a44b-8a01-4ba7-9887-6dafab7e1f7a'.split()
D,U,S,Y,L,R1,R2,UH,UC,UD,UV,LH,LC,LD,LV,A,T1,T2,T3,V1,V2,DU,DL,DN,IU,OL,IL,OU,E,F=ids
fields=['希望日','連絡先','希望詳細','来訪日']
def info(vals): return [dict(id=i,name=n,description=('この業務では希望日と同じ日を案内する。' if n=='来訪日' else '')) for i,n in zip(vals,fields)]
def obj(i,n,scope,information): return dict(id=i,name=n,scope=scope,icon={'利用者':'user','受付スタッフ':'user-round','案内システム':'monitor','案内台帳':'book-open'}[n],information=information)
def step(i,text,actor,condition=None): return dict(id=i,text=text,obligation='required',appliesWhen=condition,performerObjectIds=[actor])
def data(i,n,vals): return dict(id=i,name=n,items=[dict(informationId=x,condition=c) for x,c in vals])
def rel(i,k,f,t,d): return dict(id=i,kind=k,fromId=f,toId=t,dataId=d)
bd=dict(id=D,schemaVersion='0.4',kind='businessDesign',revision='bd-1',title='来訪案内の業務設計書',preface='草案・人間レビュー待ち。架空の業務のヒアリングを整理したものであり、業務上の合意を示さない。未確認事項は対象ActivityのFindingに残す。',scope='来訪依頼を受けて案内を記録し、利用者へ知らせる仕事までを対象とする。来訪当日の応対は対象外。',objects=[obj(U,'利用者',False,info([UH,UC,UD,UV])),obj(S,'受付スタッフ',False,[]),obj(Y,'案内システム',False,[]),obj(L,'案内台帳',True,info([LH,LC,LD,LV]))],roles=[dict(id=R1,name='受付担当',color='#8b5cf6'),dict(id=R2,name='連絡担当',color='#2563eb')],activities=[dict(id=A,name='来訪案内を登録する',scope=True,why='利用者が来訪予定を把握できるようにするため。',when='利用者から希望日と連絡先を受け取ったとき。',where='受付画面',problem=None,painLevel=None,performers=[dict(objectId=S,roleIds=[R1,R2]),dict(objectId=Y,roleIds=[])],procedure=dict(steps=[step(T1,'受付スタッフが利用者から受け取った希望日と連絡先を案内台帳に登録する。来訪日は希望日と同じ日として記録する。',S),step(T2,'受付スタッフが利用者から届いている希望詳細も案内台帳に記録する。',S,'希望詳細が届いている場合'),step(T3,'案内システムが案内台帳から登録した案内情報を読み戻し、来訪日と連絡先を利用者へ通知する。',Y)],orderRules=[dict(kind='before',beforeId=T1,afterId=T3)]),results=[dict(id=V1,text='正常終了時、案内台帳に来訪日と連絡先が記録されている。'),dict(id=V2,text='正常終了時、利用者に来訪日と連絡先が通知されている。')])],data=[data(DU,'利用者からの来訪希望',[(UH,None),(UC,None),(UD,'希望詳細が届いている場合')]),data(DL,'案内台帳の案内情報',[(LH,None),(LC,None),(LD,'希望詳細が届いている場合'),(LV,None)]),data(DN,'利用者への来訪案内',[(UV,None),(UC,None)])],relations=[rel(IU,'input',U,A,DU),rel(OL,'output',A,L,DL),rel(IL,'input',L,A,DL),rel(OU,'output',A,U,DN)],exceptions=[dict(id=E,activityId=A,name='通知失敗',description='利用者への通知に失敗した場合の扱いは未決。通知失敗時に正常結果が確定したことにはしない。')],findings=[dict(id=F,sourceId='F01',kind='question',status='open',scope='items',targetIds=[A],unresolvedTargets=[],summary='通知失敗時の扱いは未決',content='ヒアリングに「通知失敗時の扱いは未決」と明示されている。通知に失敗した場合の継続・終了、担当、再通知の要否や、台帳に残す状態は未決として保持する。正常結果を確定したことにしない。')])
pkg=dict(format='alder-document-package',formatVersion='0.5',revision='package-1',documents=[bd],sources=[],externalDocuments=[],diagnostics=[])
(out/'candidate.json').write_text(json.dumps(pkg,ensure_ascii=False,indent=2)+'\n')
(out/'operation.json').write_text('{}\n')
log=json.loads((out/'operations.json').read_text()) if (out/'operations.json').exists() else []
def run(args):
 p=subprocess.run(args,text=True,capture_output=True)
 log.append(dict(command=args,exitCode=p.returncode,stdout=p.stdout,stderr=p.stderr))
 (out/'operations.json').write_text(json.dumps(log,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(log[-1],ensure_ascii=False))
 if p.returncode: raise SystemExit(p.returncode)
run(['node',str(runtime/'author-cli.mjs'),'runtime'])
run(['node',str(runtime/'cli.mjs'),'validate',str(out/'candidate.json')])
run(['node',str(runtime/'author-cli.mjs'),'create',str(out/'candidate.json'),str(out/'business-design.json'),str(out/'operation.json')])
run(['node',str(runtime/'author-cli.mjs'),'inspect',str(out/'business-design.json')])
run(['node',str(runtime/'cli.mjs'),'validate',str(out/'business-design.json')])
print('Saved sha256',hashlib.sha256((out/'business-design.json').read_bytes()).hexdigest())
