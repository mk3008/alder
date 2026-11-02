"""Isolated installed-bundle checks, not model routing or business approval evidence."""
import hashlib,json,os,re,shutil,subprocess,tempfile,unittest
from pathlib import Path
from tools.export_plugin_references import export_plan
ROOT=Path(__file__).resolve().parents[1]
PLUGIN=ROOT/'plugins/alder'
NAME='alder-manage-json-documents'

class JSONPluginTest(unittest.TestCase):
    def test_named_plans_in_isolated_installed_bundle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed);scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda *args:subprocess.run(['node',str(scripts/'named-plans-cli.mjs'),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
            fixtures=ROOT/'work/plugin-json/issue-273/snapshots';source=root/'source.json';candidate=root/'candidate.json';target=root/'plans.json';op=root/'operation.json';extracted=root/'extracted.json'
            source.write_bytes((fixtures/'01-direct-bd.json').read_bytes());candidate.write_bytes((fixtures/'02-add-rename.json').read_bytes());source_before=source.read_bytes()
            created=run('create',target,'current','現行案',source,'improved','改善案',source,'alternative','別案',source);self.assertEqual(created.returncode,0,created.stderr)
            if os.name!='nt': target.chmod(0o644)
            info=json.loads(run('inspect',target).stdout);self.assertEqual([p['id'] for p in info['plans']],['current','improved','alternative'])
            self.assertEqual(run('extract',target,'current',extracted).returncode,0);self.assertEqual(json.loads(extracted.read_text()),json.loads(source.read_text()))
            before=json.loads(target.read_text());op.write_text(json.dumps({'expectedSha256':info['sha256'],'expectedRevision':info['plans'][0]['revision']}))
            if os.name!='nt':
                saved=target.read_bytes();preload=root/'fail-chmod.mjs';preload.write_text("import fs from 'node:fs';fs.chmodSync=()=>{throw Error('synthetic chmod failure');};\n")
                failed=subprocess.run(['node','--import',str(preload),str(scripts/'named-plans-cli.mjs'),'commit',str(target),'current',str(candidate),str(op)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
                self.assertEqual(failed.returncode,2,failed.stderr);self.assertIn('synthetic chmod failure',failed.stderr);self.assertEqual(target.read_bytes(),saved);self.assertEqual(target.stat().st_mode&0o7777,0o644)
                self.assertFalse((root/'plans.json.alder-lock').exists());self.assertFalse(list(root.glob('.alder-plans-*')))
            committed=run('commit',target,'current',candidate,op);self.assertEqual(committed.returncode,0,committed.stderr)
            if os.name!='nt': self.assertEqual(target.stat().st_mode&0o7777,0o644)
            after=json.loads(target.read_text());self.assertEqual(after['plans'][1:],before['plans'][1:]);self.assertEqual(source.read_bytes(),source_before)
            saved=target.read_bytes();self.assertEqual(run('commit',target,'current',candidate,op).returncode,2);self.assertEqual(target.read_bytes(),saved)

    def test_named_plan_check_confirmation_uses_existing_human_guards(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);installed=root/'alder';shutil.copytree(PLUGIN,installed);scripts=installed/'skills'/NAME/'scripts/document_storage'
            run=lambda script,*args:subprocess.run(['node',str(scripts/script),*map(str,args)],cwd=root,capture_output=True,text=True,env={**os.environ,'ALDER_PYTHON':'/no-python'})
            source=root/'source.json';source.write_bytes((ROOT/'work/plugin-json/issue-273/snapshots/03-direct-checks.json').read_bytes());original=source.read_bytes()
            target=root/'plans.json';extracted=root/'selected.json';candidate=root/'candidate.json';op=root/'operation.json'
            created=run('named-plans-cli.mjs','create',target,'current','現行案',source,'improved','改善案',source,'alternative','提案A',source);self.assertEqual(created.returncode,0,created.stderr)
            if os.name!='nt': target.chmod(0o644)
            info=json.loads(run('named-plans-cli.mjs','inspect',target).stdout);self.assertEqual(run('named-plans-cli.mjs','extract',target,'improved',extracted).returncode,0)
            inspected=run('author-cli.mjs','inspect',extracted);self.assertEqual(inspected.returncode,0,inspected.stderr);single=json.loads(inspected.stdout)
            before=json.loads(target.read_text());updated=json.loads(extracted.read_text());updated['revision']='package-4';checks=next(d for d in updated['documents'] if d['kind']=='checkItems');checks['revision']='checks-2'
            item=next(i for i in checks['items'] if i['checkId']=='CI-001');item['reviewState']='確認済み';candidate.write_text(json.dumps(updated,ensure_ascii=False))
            request={'expectedSha256':info['sha256'],'expectedRevision':single['revision']};op.write_text(json.dumps(request));saved=target.read_bytes()
            denied=run('named-plans-cli.mjs','commit',target,'improved',candidate,op);self.assertEqual(denied.returncode,2);self.assertIn('Human Business Design',denied.stderr);self.assertEqual(target.read_bytes(),saved)
            if os.name!='nt': self.assertEqual(target.stat().st_mode&0o7777,0o644)
            bd=next(d for d in updated['documents'] if d['kind']=='businessDesign');bd_receipt={'source':'fixture:synthetic-user','quote':'業務設計 bd-2 の内容を確認しました。'}
            request['bdConfirmations']=[{'documentId':bd['id'],'revision':bd['revision'],'evidence':bd_receipt}];op.write_text(json.dumps(request))
            denied=run('named-plans-cli.mjs','commit',target,'improved',candidate,op);self.assertEqual(denied.returncode,2);self.assertIn('Human review state',denied.stderr);self.assertEqual(target.read_bytes(),saved)
            if os.name!='nt': self.assertEqual(target.stat().st_mode&0o7777,0o644)
            meaning=next(c['meaningSha256'] for c in single['checks'] if c['id']==item['id']);check_receipt={'source':'fixture:synthetic-user','quote':'CI-001「受付内容が対象の台帳へ記録される」の条件と期待結果を確認しました。'}
            request['humanDecisions']=[{'id':item['id'],'state':'確認済み','meaningSha256':meaning,'evidence':check_receipt}];op.write_text(json.dumps(request))
            committed=run('named-plans-cli.mjs','commit',target,'improved',candidate,op);self.assertEqual(committed.returncode,0,committed.stderr)
            if os.name!='nt': self.assertEqual(target.stat().st_mode&0o7777,0o644)
            after=json.loads(target.read_text());self.assertEqual(after['plans'][1]['package'],updated);self.assertEqual(after['plans'][0],before['plans'][0]);self.assertEqual(after['plans'][2],before['plans'][2]);self.assertEqual(source.read_bytes(),original)

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
