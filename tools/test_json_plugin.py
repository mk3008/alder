"""Isolated installed-bundle checks, not model routing or business approval evidence."""
import hashlib,json,os,re,shutil,subprocess,tempfile,unittest
from pathlib import Path
from tools.export_plugin_references import export_plan
ROOT=Path(__file__).resolve().parents[1]
PLUGIN=ROOT/'plugins/alder'
NAME='alder-manage-json-documents'

class JSONPluginTest(unittest.TestCase):
    def structured_sample(self):
        cases=json.loads((ROOT/'tools/document_storage/examples/d2-cases.json').read_text())
        bd=next(c['candidate']['business'] for c in cases if c['caseId']=='mixed')
        for activity in bd['activities']:
            activity['results']=[{'id':r['id'],'text':(r['condition']+'、' if r['condition'] else '')+r['text']} for r in activity['results']]
        return {'format':'alder-document-package','formatVersion':'0.5','revision':'p1','documents':[bd],'sources':[],'externalDocuments':[],'diagnostics':[]}

    def test_structured_runtime_and_non_destructive_failures_in_isolated_bundle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed)
            scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda script,*args:subprocess.run(['node',str(scripts/script),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
            candidate=root/'candidate.json';target=root/'design.json';op=root/'op.json'
            pkg=self.structured_sample();candidate.write_text(json.dumps(pkg));op.write_text('{}')
            self.assertEqual(run('author-cli.mjs','create',candidate,target,op).returncode,0)
            self.assertEqual(run('cli.mjs','validate',target).returncode,0)
            before=target.read_bytes();info=json.loads(run('author-cli.mjs','inspect',target).stdout)
            self.assertEqual(info['sha256'],hashlib.sha256(before).hexdigest())
            self.assertEqual(run('author-cli.mjs','create',candidate,target,op).returncode,2)
            self.assertEqual(target.read_bytes(),before)
            pkg['revision']='p2';pkg['documents'][0]['revision']+='-2';pkg['documents'][0]['activities'][0]['why']='連絡先を案内するため。'
            candidate.write_text(json.dumps(pkg));op.write_text(json.dumps({'expectedRevision':info['revision'],'expectedSha256':info['sha256']}))
            lock=Path(str(target)+'.alder-lock');lock.write_text('external lock')
            self.assertEqual(run('author-cli.mjs','commit',target,candidate,op).returncode,2)
            self.assertEqual(lock.read_text(),'external lock');self.assertEqual(target.read_bytes(),before);lock.unlink()
            self.assertEqual(run('author-cli.mjs','commit',target,candidate,op).returncode,0)
            before=target.read_bytes();info=json.loads(run('author-cli.mjs','inspect',target).stdout)
            self.assertEqual(run('author-cli.mjs','commit',target,candidate,op).returncode,2) # stale CAS
            self.assertEqual(target.read_bytes(),before)
            for bad in ['unknown-field','invalid-reference','removed-id','malformed']:
                next_pkg=json.loads(before);next_pkg['revision']='p3';next_pkg['documents'][0]['revision']+='-3'
                activity=next_pkg['documents'][0]['activities'][0]
                if bad=='unknown-field':activity['results'][0]['condition']='unapproved field'
                if bad=='invalid-reference':activity['performers'][0]['objectId']='missing'
                if bad=='removed-id':activity['results'].pop()
                candidate.write_text('{bad' if bad=='malformed' else json.dumps(next_pkg))
                op.write_text(json.dumps({'expectedRevision':info['revision'],'expectedSha256':info['sha256']}))
                r=run('author-cli.mjs','commit',target,candidate,op)
                self.assertEqual(r.returncode,2,(bad,r.stderr));self.assertEqual(target.read_bytes(),before)
                self.assertFalse(lock.exists());self.assertEqual(list(root.glob('.alder-json-*')),[])

    def test_structured_check_gate_and_state_rebase_guard_in_isolated_bundle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed)
            scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda *args:subprocess.run(['node',str(scripts/'author-cli.mjs'),*map(str,args)],cwd=root,capture_output=True,text=True)
            candidate=root/'candidate.json';target=root/'design.json';op=root/'op.json'
            pkg=self.structured_sample();candidate.write_text(json.dumps(pkg));op.write_text('{}')
            self.assertEqual(run('create',candidate,target,op).returncode,0)
            before=target.read_bytes();info=json.loads(run('inspect',target).stdout);bd=pkg['documents'][0];a=bd['activities'][0];based={'documentId':bd['id'],'revision':bd['revision'],'verification':'unverified'}
            pkg['documents'].append({'id':'check-doc','kind':'checkItems','schemaVersion':'0.1','revision':'c1','title':'合成Check','basedOn':based.copy(),'intro':[],'index':[{'activityId':a['id'],'purpose':'','connections':'','checkIds':['check-one']}],'sections':[{'id':'check-section','activityId':a['id'],'title':'案内','preamble':[]}],'guarantees':[],'examples':[],'items':[{'id':'check-one','checkId':'CI-001','title':'案内が記録される','detailSummary':'','sectionId':'check-section','reviewState':'未レビュー','fields':{'guarantee':[{'kind':'text','value':'案内が記録される'}]}}],'notes':[]})
            pkg['documents'].append({'id':'state-doc','kind':'stateTransition','schemaVersion':'0.2','revision':'s1','title':'合成状態','basedOn':based.copy(),'objectId':bd['objects'][0]['id'],'states':[{'id':'guided','name':'案内済み'}],'start':'@new','terminal':'@unknown','completeness':'partial','source':'synthetic fixture, not business agreement','transitions':[{'id':'transition-one','sourceId':'T1','fromId':'@new','toId':'guided','activityId':a['id'],'event':None,'exceptionId':None,'condition':'案内を記録','effect':'change','path':'normal','evidence':'合成入力','note':'部分定義'}]})
            pkg['revision']='p2';candidate.write_text(json.dumps(pkg));operation={'expectedRevision':info['revision'],'expectedSha256':info['sha256']};op.write_text(json.dumps(operation))
            r=run('commit',target,candidate,op);self.assertEqual(r.returncode,2,r.stderr);self.assertIn('Human Business Design',r.stderr);self.assertEqual(target.read_bytes(),before)
            operation['bdConfirmations']=[{'documentId':bd['id'],'revision':bd['revision'],'evidence':{'source':'synthetic fixture only','quote':'模擬合意。実運用承認ではない'}}];op.write_text(json.dumps(operation));self.assertEqual(run('commit',target,candidate,op).returncode,0)
            before=target.read_bytes();info=json.loads(run('inspect',target).stdout)
            for kind in ['checkItems','stateTransition','both']:
                altered=json.loads(before);altered['revision']='p3';new_bd=json.loads(json.dumps(altered['documents'][0]));new_bd['id']='new-bd';new_bd['revision']+='-new'
                # Rebase both to a changed BD revision; for single cases omit the other document from the seed.
                seed=json.loads(before)
                if kind!='both':seed['documents']=[d for d in seed['documents'] if d['kind'] in ['businessDesign',kind]]
                target.write_text(json.dumps(seed));seed_bytes=target.read_bytes();seed_info=json.loads(run('inspect',target).stdout)
                altered=json.loads(seed_bytes);altered['revision']='p3';altered['documents'][0]['revision']+='-new';altered['documents'][0]['activities'][0]['why']+='改訂。'
                for d in altered['documents'][1:]:d['revision']+='-new';d['basedOn']['revision']=altered['documents'][0]['revision']
                candidate.write_text(json.dumps(altered));op.write_text(json.dumps({'expectedRevision':seed_info['revision'],'expectedSha256':seed_info['sha256'],'bdConfirmations':[{'documentId':bd['id'],'revision':altered['documents'][0]['revision'],'evidence':{'source':'synthetic only','quote':'模擬BD合意'}}]}))
                r=run('commit',target,candidate,op);self.assertEqual(r.returncode,2,r.stderr);self.assertIn('source cannot be rebased',r.stderr);self.assertEqual(target.read_bytes(),seed_bytes)
                self.assertFalse(Path(str(target)+'.alder-lock').exists());self.assertEqual(list(root.glob('.alder-json-*')),[])

    def test_new_artifact_default_and_explicit_legacy_update_instructions(self):
        # Distribution contract only; actual model routing needs a forward run.
        for name in ['alder-draft-business-design', 'alder-draft-check-items']:
            text=(PLUGIN/'skills'/name/'SKILL.md').read_text()
            self.assertIn('For new artifacts without a selected existing format, default to typed JSON',text)
            self.assertIn('../alder-manage-json-documents/SKILL.md',text)
            self.assertIn('existing Markdown artifact for revision',text)
            self.assertIn('do not migrate it without an explicit request',text)
            self.assertNotIn('Otherwise keep the Markdown procedure below',text)
        checks=(PLUGIN/'skills/alder-draft-check-items/SKILL.md').read_text()
        self.assertIn('obtain an explicit one-way conversion request first',checks)
        self.assertIn('Review-only and Interface-only',checks)
        guide=(ROOT/'docs/plugin-json-authoring.ja.md').read_text()
        self.assertIn('新規で形式指定がなければJSONを既定',guide)
        self.assertNotIn('新規で形式指定がなければ既存Markdown経路を維持',guide)

    def test_published_bundle_matches_source_bytes_and_paths(self):
        for p,data in export_plan(ROOT,[NAME]).items():
            self.assertEqual((ROOT/p).read_bytes(),data,str(p))
        skill=PLUGIN/'skills'/NAME
        self.assertEqual((skill/'LICENSE').read_bytes(),(ROOT/'LICENSE').read_bytes())
        for textfile in [skill/'SKILL.md']:
            for link in re.findall(r'\]\(([^)]+)\)',textfile.read_text()):
                if '://' not in link:
                    target=(textfile.parent/link.split('#')[0]).resolve()
                    self.assertTrue(target.is_relative_to(PLUGIN.resolve()),link)
                    self.assertTrue(target.is_file(),link)
        for name in ['alder-draft-business-design','alder-review-business-design','alder-draft-check-items','alder-review-implementation','alder-follow-up-review']:
            text=(PLUGIN/'skills'/name/'SKILL.md').read_text()
            self.assertIn('../alder-manage-json-documents/SKILL.md',text)
            self.assertIn('Markdown',text)

    def test_runtime_and_conversion_without_repository(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed)
            scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda script,*args:subprocess.run(['node',str(scripts/script),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'PYTHONPATH':''})
            r=run('author-cli.mjs','runtime');self.assertEqual(r.returncode,0,r.stderr);self.assertTrue(json.loads(r.stdout)['markdownConversion'])
            md=root/'source.md';original=(ROOT/'business-design/purchase-request/README.md').read_bytes();md.write_bytes(original)
            req=root/'request.json';req.write_text(json.dumps({'revision':'p1','sources':[{'path':'source.md','documentId':'bd','kind':'businessDesign','revision':'r1'}]}))
            out=root/'design.json';r=run('cli.mjs','convert',req,out);self.assertEqual(r.returncode,0,r.stderr);self.assertEqual(md.read_bytes(),original)
            self.assertEqual(run('cli.mjs','validate',out).returncode,0)
            pkg=json.loads(out.read_text());self.assertNotIn('archives',pkg)
            md.write_text(original.decode().replace('## Icon','## Medium'));bad=root/'bad.json';self.assertEqual(run('cli.mjs','convert',req,bad).returncode,2);self.assertFalse(bad.exists())
            md.write_bytes(original)
            # Existing Check source mismatch must remain rejected in the bundle.
            check=root/'check.md';check.write_bytes((ROOT/'work/check-item-examples/meaning-validation-20261018/purchase/final.md').read_bytes())
            data=json.loads(req.read_text());data['sources'][0]['uri']='https://github.com/mk3008/alder/blob/'+'f'*40+'/business-design/purchase-request/README.md'
            data['sources'].append({'path':'check.md','documentId':'check','kind':'checkItems','revision':'c1','basedOn':{'documentId':'bd','revision':'r1'}});req.write_text(json.dumps(data))
            self.assertEqual(run('cli.mjs','convert',req,root/'mismatch.json').returncode,2)
            self.assertFalse((root/'mismatch.json').exists())

    def test_direct_authoring_and_check_gate_in_installed_bundle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed);scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda *args:subprocess.run(['node',str(scripts/'author-cli.mjs'),*map(str,args)],cwd=root,capture_output=True,text=True)
            fixtures=ROOT/'work/plugin-json/issue-273/snapshots';candidate=root/'candidate.json';target=root/'design.json';op=root/'operation.json'
            candidate.write_bytes((fixtures/'01-direct-bd.json').read_bytes());op.write_text('{}');r=run('create',candidate,target,op);self.assertEqual(r.returncode,0,r.stderr)
            before=target.read_bytes();inspect=json.loads(run('inspect',target).stdout);candidate.write_bytes((fixtures/'03-direct-checks.json').read_bytes());op.write_text(json.dumps({'expectedRevision':inspect['revision'],'expectedSha256':inspect['sha256']}))
            r=run('commit',target,candidate,op);self.assertEqual(r.returncode,2,r.stderr);self.assertIn('Human Business Design',r.stderr);self.assertEqual(before,target.read_bytes())
            # Read-only validation and inspect do not write the canonical file.
            self.assertEqual(run('inspect',target).returncode,0);self.assertEqual(before,target.read_bytes())

    def test_state_authoring_without_python_in_isolated_bundle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed);scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda *args:subprocess.run(['node',str(scripts/'author-cli.mjs'),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
            candidate=root/'candidate.json';target=root/'states.json';op=root/'op.json';pkg=json.loads((ROOT/'work/json-state/issue-275/purchase.json').read_text());candidate.write_text(json.dumps(pkg));op.write_text('{}')
            r=run('create',candidate,target,op);self.assertEqual(r.returncode,0,r.stderr)
            inspected=json.loads(run('inspect',target).stdout);before=target.read_bytes();state=pkg['documents'][1]['states'][0];state['name']='名前変更後';pkg['documents'][1]['revision']='states-2';pkg['revision']='package-2';candidate.write_text(json.dumps(pkg));op.write_text(json.dumps({'expectedRevision':inspected['revision'],'expectedSha256':inspected['sha256']}))
            r=run('commit',target,candidate,op);self.assertEqual(r.returncode,0,r.stderr);saved=json.loads(target.read_text());self.assertEqual(saved['documents'][1]['states'][0]['id'],state['id']);self.assertEqual(len(saved['documents'][1]['transitions']),13)
            before=target.read_bytes();inspected=json.loads(run('inspect',target).stdout);pkg['documents'][1]['transitions'][0]['activityId']='unknown';pkg['revision']='package-3';candidate.write_text(json.dumps(pkg));op.write_text(json.dumps({'expectedRevision':inspected['revision'],'expectedSha256':inspected['sha256']}));self.assertEqual(run('commit',target,candidate,op).returncode,2);self.assertEqual(target.read_bytes(),before)

    def test_roles_migration_without_repository_or_python(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed);scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda *args:subprocess.run(['node',str(scripts/'author-cli.mjs'),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
            legacy=json.loads((ROOT/'work/json-state/issue-275/purchase.json').read_text());source=root/'old.json';source.write_text(json.dumps(legacy));before=source.read_bytes();candidate=root/'new-candidate.json';request=root/'revisions.json';request.write_text(json.dumps({'expectedRevision':legacy['revision'],'revision':'roles-1','documentRevisions':{d['id']:{'expected':d['revision'],'next':d['revision']+'-role-1'} for d in legacy['documents']}}))
            r=run('prepare-role-upgrade',source,candidate,request);self.assertEqual(r.returncode,0,r.stderr);self.assertEqual(source.read_bytes(),before);new=json.loads(candidate.read_text());self.assertEqual(new['formatVersion'],'0.3');self.assertTrue(new['documents'][0]['roles'])
            # Migration does not bypass the normal file/revision guard.
            original=json.loads(run('inspect',source).stdout);op=root/'operation.json';op.write_text(json.dumps({'expectedRevision':original['revision'],'expectedSha256':original['sha256']}));self.assertEqual(run('commit',source,candidate,op).returncode,2);self.assertEqual(source.read_bytes(),before)
            data=json.loads(op.read_text());data['migration']='roles-0.3';op.write_text(json.dumps(data));r=run('commit',source,candidate,op);self.assertEqual(r.returncode,0,r.stderr);role=new['documents'][0]['roles'][0];role['name']='担当ロール改名';new['revision']='roles-2';new['documents'][0]['revision']='bd-role-2';new['documents'][1]['revision']='states-role-2';new['documents'][1]['basedOn']['revision']='bd-role-2';candidate.write_text(json.dumps(new));inspected=json.loads(run('inspect',source).stdout);op.write_text(json.dumps({'expectedRevision':inspected['revision'],'expectedSha256':inspected['sha256']}));r=run('commit',source,candidate,op);self.assertEqual(r.returncode,0,r.stderr);saved=json.loads(source.read_text());self.assertEqual(saved['documents'][0]['roles'][0],role);self.assertEqual(saved['documents'][1]['transitions'],legacy['documents'][1]['transitions'])


    def test_native_json_works_when_legacy_modules_are_absent(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed);scripts=installed/'skills'/NAME/'scripts/document_storage'
            for name in ['legacy-json.mjs','convert.mjs','markdown.py','state-declaration.mjs','state-storage.mjs']:
                (scripts/name).unlink()
            run=lambda script,*args:subprocess.run(['node',str(scripts/script),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
            candidate=root/'candidate.json';target=root/'native.json';op=root/'operation.json'
            pkg=json.loads((ROOT/'work/viewer-json/issue-274/json-native/independent.json').read_text());candidate.write_text(json.dumps(pkg));op.write_text('{}')
            r=run('author-cli.mjs','create',candidate,target,op);self.assertEqual(r.returncode,0,r.stderr)
            info=json.loads(run('author-cli.mjs','inspect',target).stdout);pkg['revision']='p2';pkg['documents'][0]['revision']='b2';pkg['documents'][0]['exceptions'][0]['name']='改名後';pkg['documents'][0]['exceptions'][0]['description']='- **偽の名前** — 説明';pkg['documents'][1]['revision']='s2';pkg['documents'][1]['basedOn']['revision']='b2'
            candidate.write_text(json.dumps(pkg));op.write_text(json.dumps({'expectedRevision':info['revision'],'expectedSha256':info['sha256']}))
            r=run('author-cli.mjs','commit',target,candidate,op);self.assertEqual(r.returncode,0,r.stderr)
            self.assertEqual(json.loads(target.read_text())['documents'][1]['transitions'][1]['exceptionId'],'exception-receive');self.assertEqual(run('cli.mjs','validate',target).returncode,0)

if __name__ == "__main__": unittest.main()
