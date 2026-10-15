import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseDesign,validateGraph,findingsFromSource} from '../src/graph.ts';

const file=new URL('../../tools/fixtures/design-findings/example.md',import.meta.url);
const raw=readFileSync(file,'utf8'), design=parseDesign(raw), old=parseDesign(raw.split('# Findings')[0]);
assert.deepEqual(design.graph,old.graph);assert.equal(design.findings.length,4);
assert.deepEqual(design.findings[0].targets,['受付情報','依頼を受け付ける']);
assert.deepEqual(design.findings[1].unresolvedTargets,['名前が変更された項目']);
assert.deepEqual(old.findings,[]);
assert.throws(()=>validateGraph({...design.graph,findings:design.findings}));
for(const c of JSON.parse(readFileSync(new URL('../../tools/fixtures/design-findings/invalid.json',import.meta.url),'utf8')))assert.throws(()=>parseDesign(raw.replace(c.from,c.to)),c.name);
assert.throws(()=>parseDesign(raw+'\n# Findings\n'+raw.split('# Findings')[1]));
const py=spawnSync('python3',['-c',"import json,sys;sys.path.insert(0,sys.argv[1]);from export import parse_document;print(json.dumps(parse_document(sys.stdin.read()),ensure_ascii=False))",fileURLToPath(new URL('../../tools/business_graph',import.meta.url))],{input:raw,encoding:'utf8'});
assert.equal(py.status,0,py.stderr);assert.deepEqual(JSON.parse(py.stdout),{graph:design.graph,findings:design.findings});
// Exact Unicode references: no case folding or guessed name repair.
assert.deepEqual(parseDesign(raw.replace('- 名前が変更された項目','- 受付情報別名')).findings[1].unresolvedTargets,['受付情報別名']);
console.log('findings parser parity and invalid contracts passed');

// Historical saved graphs need no reparsing when annotations are absent.
assert.deepEqual(findingsFromSource('legacy text with an unclosed fence\n```',new Set()),[]);
assert.deepEqual(findingsFromSource(raw,new Set(['受付情報']))[0].unresolvedTargets,['依頼を受け付ける']);
assert.deepEqual(findingsFromSource('```\n# Findings\n```',new Set()),[]);
