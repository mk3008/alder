"""Isolated installed-bundle checks, not model routing or business approval evidence."""
import hashlib,json,os,re,shutil,subprocess,tempfile,unittest
from pathlib import Path
from tools.export_plugin_references import export_plan
ROOT=Path(__file__).resolve().parents[1]
PLUGIN=ROOT/'plugins/alder'
NAME='alder-manage-json-documents'

class JSONPluginTest(unittest.TestCase):
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

if __name__=='__main__':unittest.main()
