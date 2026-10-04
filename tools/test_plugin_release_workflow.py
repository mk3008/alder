"""Exercise release-script effects against a fake GitHub API; never publish."""
from pathlib import Path
import json
import subprocess
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / '.github/workflows/plugin-release-tag.yml'


class PluginReleaseTest(unittest.TestCase):
    def test_release_is_validated_and_main_only(self):
        source = WORKFLOW.read_text()
        self.assertIn("if: github.event_name != 'pull_request' && github.ref == 'refs/heads/main'", source)
        self.assertIn('needs: validate', source)
        self.assertIn('contents: read', source.split('jobs:')[0])

    def test_release_script_preserves_tags_and_bounds_writes(self):
        script = textwrap.dedent(WORKFLOW.read_text().split('          script: |\n', 1)[1])
        harness = r'''
const assert = require('node:assert/strict');
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const run = new AsyncFunction('require', 'context', 'github', 'core', SCRIPT);
const missing = () => {const e = new Error('missing'); e.status=404; throw e;};
async function scenario(opts={}) {
  const calls=[]; const sha='a'.repeat(40);
  const req = (name) => name==='node:fs' ? {
    readFileSync: (path) => path.endsWith('plugin.json') ? JSON.stringify({version:opts.version || '0.4.0'}) : '# Alder Plugin 0.4.0 — Test\nSafe notes.'
  } : require(name);
  const github={rest:{repos:{
    getReleaseByTag:async () => opts.released ? {data:{html_url:'release',draft:opts.draft || false}} : missing(),
    createRelease:async (args)=>{calls.push(args);if(opts.fail)throw Error('network');return {data:{html_url:'new-release'}};}
  },git:{
    getRef:async ()=> opts.ref ? {data:{object:opts.ref}} : missing(),
    getTag:async ()=>({data:{object:{type:'commit',sha}}})
  }}};
  let error=null;try{await run(req,{repo:{owner:'o',repo:'r'},sha},github,{info:()=>{}});}catch(e){error=e;}
  return {calls,error,sha};
}
(async()=>{
 let r=await scenario();assert.equal(r.error,null);assert.equal(r.calls.length,1);
 assert.equal(r.calls[0].target_commitish,r.sha);assert.equal(r.calls[0].tag_name,'plugin-v0.4.0');assert.equal(r.calls[0].draft,false);assert.equal(r.calls[0].make_latest,'false');
 r=await scenario({released:true,ref:{type:'commit',sha:'a'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,0);
 r=await scenario({released:true});assert(r.error);assert.equal(r.calls.length,0);
 r=await scenario({released:true,ref:{type:'commit',sha:'b'.repeat(40)}});assert(r.error);assert.equal(r.calls.length,0);
 r=await scenario({released:true,draft:true,ref:{type:'commit',sha:'a'.repeat(40)}});assert(r.error);assert.equal(r.calls.length,0);
 r=await scenario({ref:{type:'commit',sha:'b'.repeat(40)}});assert(r.error);assert.equal(r.calls.length,0);
 r=await scenario({ref:{type:'commit',sha:'a'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 r=await scenario({ref:{type:'tag',sha:'c'.repeat(40)}});assert.equal(r.error,null);assert.equal(r.calls.length,1);
 r=await scenario({version:'0.4.1'});assert(r.error);assert.equal(r.calls.length,0);
 r=await scenario({fail:true});assert(r.error);assert.equal(r.calls.length,1);
 console.log('10 mocked release states passed; only createRelease can mutate');
})().catch(e=>{console.error(e);process.exit(1);});
'''
        result = subprocess.run(['node', '-e', harness.replace('SCRIPT', json.dumps(script), 1)], cwd=ROOT, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('10 mocked release states passed', result.stdout)


if __name__ == '__main__':
    unittest.main()
