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
    def test_release_is_validated_and_explicit_main_only(self):
        source = WORKFLOW.read_text()
        self.assertIn("if: github.event_name == 'workflow_dispatch' && github.ref == 'refs/heads/main'", source)
        self.assertIn('needs: validate', source)
        self.assertIn('contents: read', source.split('jobs:')[0])
        validate, release = source.split('  release:\n', 1)
        self.assertNotIn('contents: write', validate)
        self.assertEqual(source.count('contents: write'), 1)
        self.assertIn('contents: write', release)
        self.assertIn('fetch-depth: 0', validate)
        self.assertIn('tools.test_export_plugin_references tools.test_plugin_references', validate)
        self.assertEqual(source.count('persist-credentials: false'), 2)
        self.assertIn('group: alder-product-release', release)
        self.assertIn('cancel-in-progress: false', release)
        self.assertNotIn('  push:', source)
        self.assertFalse((ROOT / '.github/workflows/release.yml').exists())
        self.assertIn('--approved-version "$APPROVED_VERSION" --approved-revision "$APPROVED_REVISION"', source)
        self.assertNotIn('${{ inputs.', source.split('run: python3 tools/validate_release.py')[1].split('\n', 1)[0])

    def test_candidate_inputs_fail_closed(self):
        from tools.validate_release import validate
        sha = 'a' * 40
        cases = [
            ('0.4.4', '# Alder 0.4.4', '0.4.4', sha, True),
            ('0.4.4', '# Alder 0.4.4 — Patch', '0.4.4', sha, True),
            ('0.5.0', '# Alder 0.5.0', '0.5.0', sha, True),
            ('1.0.0', '# Alder 1.0.0', '1.0.0', sha, True),
            ('0.4.3', '# Alder 0.4.3', '0.4.3', sha, False),
            ('0.1.0', '# Alder 0.1.0', '0.1.0', sha, False),
            ('0.4.4', '# Alder 0.4.40', '0.4.4', sha, False),
            ('0.4.4', '# Alder Plugin 0.4.4', '0.4.4', sha, False),
            ('0.4.4', '# Alder 0.4.4', '0.4.5', sha, False),
            ('0.4.4', '# Alder 0.4.4', '0.4.4', 'b' * 40, False),
            ('0.4.4', '# Alder 0.4.4', '0.4.4', 'main', False),
            ('0.4.4-rc.1', '# Alder 0.4.4-rc.1', '0.4.4-rc.1', sha, False),
            ('00.4.4', '# Alder 00.4.4', '00.4.4', sha, False),
            ('not-a-version', None, 'not-a-version', sha, False),
            ('0.4.4', None, '0.4.4', sha, False),
        ]
        for version, title, approved, revision, succeeds in cases:
            with self.subTest(version=version, title=title, approved=approved, revision=revision), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                (root / '.agents/plugins').mkdir(parents=True)
                (root / '.agents/plugins/marketplace.json').write_text(json.dumps({
                    'plugins': [{'source': {'path': './plugins/alder'}}]}))
                if title is not None:
                    (root / 'docs').mkdir()
                    (root / f'docs/release-notes-v{version}.md').write_text(title + '\n\nSubstantive changes.\n')
                if succeeds:
                    self.assertEqual(validate(root, version, sha, approved, revision), version)
                else:
                    with self.assertRaises((ValueError, FileNotFoundError)):
                        validate(root, version, sha, approved, revision)

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
      if (path === 'plugins/alder/plugin.json') return JSON.stringify({version:opts.version || '0.4.4'});
      assert.equal(path, `docs/release-notes-v${opts.version || '0.4.4'}.md`);
      return opts.notes || '# Alder 0.4.4 — Test\nSafe notes.';
    }
  } : require(name);
  const github={rest:{repos:{
    getReleaseByTag:async (args) => {
      reads.push(args); assert.equal(args.tag, 'plugin-v0.4.4');
      if(opts.readFail) throw Error('network');
      return opts.released ? {data:{html_url:'release',draft:opts.draft || false,prerelease:opts.prerelease || false,tag_name:opts.wrongTag ? 'other' : 'plugin-v0.4.4'}} : missing();
    },
    createRelease:async (args)=>{calls.push(args);if(opts.fail)throw Error('network');return {data:{html_url:'new-release'}};}
  },git:{
    getRef:async (args)=> {reads.push(args);assert.equal(args.ref,'tags/plugin-v0.4.4');return opts.ref ? {data:{object:opts.ref}} : missing();},
    getTag:async (args)=> {reads.push(args);return {data:{object:opts.tagObject || {type:'commit',sha}}};}
  }}};
  const context={repo:{owner:'o',repo:'r'},sha,eventName:'workflow_dispatch',ref:'refs/heads/main',payload:{inputs:{version:'0.4.4',revision:sha,...opts.inputs}},...opts.context};
  let error=null;try{await run(req,context,github,{info:()=>{}});}catch(e){error=e;}
  return {calls,reads,error,sha};
}
(async()=>{
 let r=await scenario();assert.equal(r.error,null);assert.equal(r.calls.length,1);
 assert.deepEqual(r.calls[0],{owner:'o',repo:'r',target_commitish:r.sha,tag_name:'plugin-v0.4.4',name:'Alder 0.4.4 — Test',body:'# Alder 0.4.4 — Test\nSafe notes.',draft:false,prerelease:false,make_latest:'true'});
 r=await scenario({context:{eventName:'push'}});assert(r.error);assert.equal(r.calls.length,0);
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
   {notes:'# Alder 0.4.40'},
   {notes:'# Alder 0.4.3'},
   {notes:'# Alder 0.4.4'},
   {inputs:{version:'0.4.3'}},
   {inputs:{revision:'b'.repeat(40)}},
   {inputs:{revision:'main'}},
   {readFail:true}
 ]) {r=await scenario(opts);assert(r.error);assert.equal(r.calls.length,0);}
 r=await scenario({ref:{type:'commit',sha:'a'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 r=await scenario({ref:{type:'tag',sha:'c'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 for (const version of ['0.4.1','0.4.2','0.4.3','0.4.30','1.0.0','0.4.4-rc.1','00.4.4']) {
   r=await scenario({version});assert(r.error);assert.equal(r.calls.length,0);assert.equal(r.reads.length,0);
 }
 for (const context of [{eventName:'pull_request'}, {eventName:'schedule'}, {eventName:'push',ref:'refs/heads/release/plugin-0.4.3'}, {eventName:'workflow_dispatch',ref:'refs/heads/topic'}, {ref:'refs/tags/plugin-v0.4.4'}]) {
   r=await scenario({context});assert(r.error);assert.equal(r.calls.length,0);assert.equal(r.reads.length,0);
 }
 r=await scenario({fail:true});assert(r.error);assert.equal(r.calls.length,1);
 console.log(`${states} mocked release states passed; only createRelease can mutate`);
})().catch(e=>{console.error(e);process.exit(1);});
'''
        result = subprocess.run(['node', '-e', harness.replace('SCRIPT', json.dumps(script), 1)], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('mocked release states passed; only createRelease can mutate', result.stdout)


if __name__ == '__main__':
    unittest.main()
