"""Exercise release-script effects against a fake GitHub API; never publish."""
from pathlib import Path
import json
import os
import subprocess
import sys
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / '.github/workflows/plugin-release-tag.yml'


class PluginReleaseTest(unittest.TestCase):
    def test_release_is_validated_and_main_only(self):
        source = WORKFLOW.read_text()
        self.assertIn("if: (github.event_name == 'push' || github.event_name == 'workflow_dispatch') && github.ref == 'refs/heads/main'", source)
        self.assertIn('needs: validate', source)
        self.assertIn('contents: read', source.split('jobs:')[0])
        self.assertIn("needs.validate.outputs.release_043 == 'true'", source)
        validate, release = source.split('  release:\n', 1)
        self.assertNotIn('contents: write', validate)
        self.assertEqual(source.count('contents: write'), 1)
        self.assertIn('contents: write', release)
        self.assertIn('fetch-depth: 0', validate)
        self.assertIn('tools.test_export_plugin_references tools.test_plugin_references', validate)
        self.assertEqual(source.count('persist-credentials: false'), 2)
        self.assertIn('group: alder-plugin-release-v0.4.3', release)
        self.assertIn('cancel-in-progress: false', release)
        self.assertIn("push:\n    branches: [main]\n    paths:\n      - '.github/workflows/plugin-release-tag.yml'", source)

    def test_only_043_inputs_authorize_publication(self):
        block = WORKFLOW.read_text().split('      - name: Validate release inputs\n', 1)[1]
        code = textwrap.dedent(block.split("python3 - <<'PY'\n", 1)[1].split('\n          PY', 1)[0])
        cases = [('0.4.3', '# Alder Plugin 0.4.3', 'true'),
                 ('0.4.3', '# Alder Plugin 0.4.3 — Patch', 'true'),
                 ('0.4.4', None, 'false'), ('0.4.2', None, 'false'),
                 ('0.4.1', None, 'false'), ('0.4.30', None, 'false'),
                 ('1.0.0', None, 'false'),
                 ('0.4.3', '# Alder Plugin 0.4.30', None),
                 ('0.4.3', '# Alder Plugin 0.4.2', None),
                 ('0.4.3', None, None), ('0.4.3-rc.1', None, None),
                 ('not-a-version', None, None)]
        for version, title, expected in cases:
            with self.subTest(version=version, title=title), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                (root / 'plugins/alder').mkdir(parents=True)
                (root / 'plugins/alder/plugin.json').write_text(json.dumps({'version': version}))
                for i in range(10):
                    folder = root / f'plugins/alder/skills/skill-{i}'
                    folder.mkdir(parents=True)
                    (folder / 'SKILL.md').write_text('fixture\n')
                (root / '.agents/plugins').mkdir(parents=True)
                (root / '.agents/plugins/marketplace.json').write_text(json.dumps({
                    'plugins': [{'source': {'path': './plugins/alder'}}]}))
                if title is not None:
                    (root / 'docs').mkdir()
                    (root / 'docs/plugin-release-notes-v0.4.3.md').write_text(title + '\n')
                output = root / 'output'
                result = subprocess.run([sys.executable, '-c', code], cwd=root,
                    env={**os.environ, 'GITHUB_OUTPUT': str(output)}, capture_output=True, text=True)
                if expected is None:
                    self.assertNotEqual(result.returncode, 0)
                    self.assertFalse(output.exists())
                else:
                    self.assertEqual(result.returncode, 0, result.stderr)
                    self.assertEqual(output.read_text(), f'release_043={expected}\n')

    def test_release_script_preserves_tags_and_bounds_writes(self):
        script = textwrap.dedent(WORKFLOW.read_text().split('          script: |\n', 1)[1])
        harness = r'''
const assert = require('node:assert/strict');
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const run = new AsyncFunction('require', 'context', 'github', 'core', SCRIPT);
const missing = () => {const e = new Error('missing'); e.status=404; throw e;};
let states = 0;
async function scenario(opts={}) {
  states++;
  const calls=[]; const reads=[]; const sha='a'.repeat(40);
  const req = (name) => name==='node:fs' ? {
    readFileSync: (path) => {
      if (path === 'plugins/alder/plugin.json') return JSON.stringify({version:opts.version || '0.4.3'});
      assert.equal(path, 'docs/plugin-release-notes-v0.4.3.md');
      return opts.notes || '# Alder Plugin 0.4.3 — Test\nSafe notes.';
    }
  } : require(name);
  const github={rest:{repos:{
    getReleaseByTag:async (args) => {
      reads.push(args); assert.equal(args.tag, 'plugin-v0.4.3');
      if(opts.readFail) throw Error('network');
      return opts.released ? {data:{html_url:'release',draft:opts.draft || false,prerelease:opts.prerelease || false,tag_name:opts.wrongTag ? 'other' : 'plugin-v0.4.3'}} : missing();
    },
    createRelease:async (args)=>{calls.push(args);if(opts.fail)throw Error('network');return {data:{html_url:'new-release'}};}
  },git:{
    getRef:async (args)=> {reads.push(args);assert.equal(args.ref,'tags/plugin-v0.4.3');return opts.ref ? {data:{object:opts.ref}} : missing();},
    getTag:async (args)=> {reads.push(args);return {data:{object:opts.tagObject || {type:'commit',sha}}};}
  }}};
  const context={repo:{owner:'o',repo:'r'},sha,eventName:'push',ref:'refs/heads/main',...opts.context};
  let error=null;try{await run(req,context,github,{info:()=>{}});}catch(e){error=e;}
  return {calls,reads,error,sha};
}
(async()=>{
 let r=await scenario();assert.equal(r.error,null);assert.equal(r.calls.length,1);
 assert.deepEqual(r.calls[0],{owner:'o',repo:'r',target_commitish:r.sha,tag_name:'plugin-v0.4.3',name:'Alder Plugin 0.4.3 — Test',body:'# Alder Plugin 0.4.3 — Test\nSafe notes.',draft:false,prerelease:false,make_latest:'false'});
 r=await scenario({context:{eventName:'workflow_dispatch'}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 r=await scenario({released:true,ref:{type:'commit',sha:'a'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,0);
 r=await scenario({released:true,ref:{type:'tag',sha:'c'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,0);
 for (const opts of [
   {released:true},
   {released:true,ref:{type:'commit',sha:'b'.repeat(40)}},
   {released:true,draft:true,ref:{type:'commit',sha:'a'.repeat(40)}},
   {released:true,prerelease:true,ref:{type:'commit',sha:'a'.repeat(40)}},
   {released:true,wrongTag:true,ref:{type:'commit',sha:'a'.repeat(40)}},
   {ref:{type:'commit',sha:'b'.repeat(40)}},
   {ref:{type:'tree',sha:'a'.repeat(40)}},
   {ref:{type:'tag',sha:'c'.repeat(40)},tagObject:{type:'commit',sha:'b'.repeat(40)}},
   {notes:'# Alder Plugin 0.4.30'},
   {notes:'# Alder Plugin 0.4.2'},
   {readFail:true}
 ]) {r=await scenario(opts);assert(r.error);assert.equal(r.calls.length,0);}
 r=await scenario({ref:{type:'commit',sha:'a'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 r=await scenario({ref:{type:'tag',sha:'c'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 for (const version of ['0.4.1','0.4.2','0.4.4','0.4.30','1.0.0','0.4.3-rc.1']) {
   r=await scenario({version});assert(r.error);assert.equal(r.calls.length,0);assert.equal(r.reads.length,0);
 }
 for (const context of [{eventName:'pull_request'}, {eventName:'schedule'}, {eventName:'push',ref:'refs/heads/release/plugin-0.4.3'}, {eventName:'workflow_dispatch',ref:'refs/heads/topic'}, {ref:'refs/tags/plugin-v0.4.3'}]) {
   r=await scenario({context});assert(r.error);assert.equal(r.calls.length,0);assert.equal(r.reads.length,0);
 }
 r=await scenario({fail:true});assert(r.error);assert.equal(r.calls.length,1);
 console.log(`${states} mocked release states passed; only createRelease can mutate`);
})().catch(e=>{console.error(e);process.exit(1);});
'''
        result = subprocess.run(['node', '-e', harness.replace('SCRIPT', json.dumps(script), 1)], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('29 mocked release states passed', result.stdout)


if __name__ == '__main__':
    unittest.main()
