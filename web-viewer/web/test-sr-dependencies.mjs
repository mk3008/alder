import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {parseDesign,validateGraph,objectSRDependenciesFromSource} from '../src/graph.ts';
import {dependencyDetails} from '../src/sr-dependencies.ts';
import {activityDesign} from '../src/activities.ts';
const raw=readFileSync('../tools/fixtures/sr-dependencies/purchase-request.md','utf8'),legacy=raw.replace(/## SR Dependencies\n\n- [^\n]+\n\n/g,''),d=parseDesign(raw),old=parseDesign(legacy);
assert.deepEqual(d.graph,old.graph);assert.deepEqual(d.findings,old.findings);assert.equal(old.objectSRDependencies,undefined);assert.deepEqual(d.objectMedia,old.objectMedia);
assert.deepEqual(Object.keys(d.objectSRDependencies).sort(),['基幹システム','認証基盤']);
for(const id of ['認証基盤','基幹システム']){const detail=dependencyDetails(d,id);assert.equal(detail.verification.status,'unmatched');assert.ok(detail.activities.length>1);assert.ok(detail.information.length);assert.equal(activityDesign(d,'備品購入を申請する').objectSRDependencies,d.objectSRDependencies);assert.ok(dependencyDetails(activityDesign(d,'備品購入を申請する'),id).activities.some(a=>a.id==='備品購入を申請する'));}
for(const id of ['申請者','承認者','購買担当者','購入申請','購入用CSV'])assert.equal(dependencyDetails(d,id),undefined);
assert.equal(objectSRDependenciesFromSource(legacy,new Set()),undefined);assert.equal(objectSRDependenciesFromSource('```\n## SR Dependencies\n```',new Set()),undefined);
assert.deepEqual(Object.keys(objectSRDependenciesFromSource(raw,new Set(['認証基盤']))),['認証基盤']);
const py=spawnSync('python3',['-c',"import json,sys;sys.path.insert(0,'../tools/business_graph');from export import parse_document;print(json.dumps(parse_document(sys.stdin.read()),ensure_ascii=False))"],{input:raw,encoding:'utf8'});assert.equal(py.status,0,py.stderr);assert.deepEqual(JSON.parse(py.stdout),{graph:d.graph,findings:d.findings,objectMedia:{...d.objectMedia},objectSRDependencies:{...d.objectSRDependencies}});
const contract=d.objectSRDependencies['認証基盤'][0];for(const bad of ['',contract,'- '+contract+'\n- '+contract,'- '+contract+'\ncontinued','- '+contract+'\n\n## SR Dependencies\n\n- duplicate']){const input=raw.replace('- '+contract,bad);assert.throws(()=>parseDesign(input));const result=spawnSync('python3',['-c',"import sys;sys.path.insert(0,'../tools/business_graph');from export import parse_document;parse_document(sys.stdin.read())"],{input,encoding:'utf8'});assert.notEqual(result.status,0);}
assert.throws(()=>parseDesign(raw.replace('## Who\n','## SR Dependencies\n\n- contract\n\n## Who\n')));assert.throws(()=>validateGraph({...d.graph,nodes:d.graph.nodes.map(n=>({...n,srDependencies:[]}))}));
const special=parseDesign(raw.replaceAll('認証基盤','__proto__'));assert.ok(special.objectSRDependencies.__proto__.length);assert.equal(Object.getPrototypeOf(special.objectSRDependencies),null);
console.log('Explicit SR dependencies: Python/TS parity, strict Graph, legacy, activity links, media, Findings and unmatched status passed');
