import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseBrowserCaseArgs,selectBrowserCases,runBrowserCases} from './browser-cases.mjs';
const calls=[],cases=['first','second','third'].map(name=>({name,run:()=>{calls.push(name);if(name==='second')throw Error('retained failure');return name;}}));
assert.deepEqual(parseBrowserCaseArgs([]),{list:false,names:null});
assert.deepEqual(parseBrowserCaseArgs(['--cases',' third,first ','--list']),{list:true,names:['third','first']});
for(const args of [['--cases'],['--cases',''],['--cases','first,'],['--cases','--list'],['--cases','first','--cases','third'],['--case','first'],['extra']])assert.throws(()=>parseBrowserCaseArgs(args));
assert.equal(selectBrowserCases(cases),cases);
assert.deepEqual(selectBrowserCases(cases,['third','first','first']).map(c=>c.name),['first','third']);
for(const names of [[],['typo'],['first','typo'],['']])assert.throws(()=>selectBrowserCases(cases,names));
assert.throws(()=>selectBrowserCases([cases[0],cases[0]]),/Duplicate/);
let reports=[];
await runBrowserCases(selectBrowserCases(cases,['third','first']),s=>reports.push(JSON.parse(s)),{available:3});
assert.deepEqual(calls,['first','third']);
const summary=reports.at(-1).browserSummary;
assert.equal(summary.scope,'targeted');assert.equal(summary.available,3);assert.equal(summary.total,2);assert.equal(summary.failed,0);assert.deepEqual(summary.selected,['first','third']);assert.ok(summary.durationMs>=0);assert.ok(reports[0].browserCase.durationMs>=0);
calls.length=0;reports=[];
await assert.rejects(runBrowserCases(cases,s=>reports.push(JSON.parse(s))),error=>error instanceof AggregateError&&error.results.length===3&&error.errors.length===1&&error.results[2].status==='passed');
assert.deepEqual(calls,['first','second','third']);assert.equal(reports.at(-1).browserSummary.scope,'full');
reports=[];await assert.rejects(runBrowserCases(selectBrowserCases(cases,['second']),s=>reports.push(JSON.parse(s)),{available:3}),AggregateError);assert.equal(reports.at(-1).browserSummary.failed,1);
// Validate the real CLI/registry before loading Playwright or launching Chrome.
const runner=fileURLToPath(new URL('./test-browser.mjs',import.meta.url));
const invoke=args=>spawnSync(process.execPath,[runner,...args],{encoding:'utf8',env:{...process.env,PLAYWRIGHT_MODULE:'/missing-browser-driver'}});
const full=invoke(['--list']);assert.equal(full.status,0,full.stderr);
const plan=JSON.parse(full.stdout).browserPlan;assert.equal(plan.scope,'full');assert.equal(plan.available,52);assert.equal(new Set(plan.selected).size,52);assert.ok(plan.selected.includes('json05'));assert.ok(plan.selected.includes('subsystemOverview'));assert.ok(plan.selected.includes('tabScroll'));assert.ok(plan.selected.includes('sharedCaptions'));assert.ok(plan.selected.includes('viewerShell'));assert.ok(plan.selected.includes('conceptInitial'));
const targeted=invoke(['--list','--cases','headerControls,relatedChecks']);assert.equal(targeted.status,0,targeted.stderr);assert.deepEqual(JSON.parse(targeted.stdout).browserPlan.selected,['relatedChecks','headerControls']);
for(const args of [['--cases','typo'],['--cases','headerControls,typo'],['--cases',''],['--unknown']]){const result=invoke(args);assert.notEqual(result.status,0);assert.doesNotMatch(result.stderr,/Cannot find module/);}
console.log('Browser selection: strict CLI, actual 52-case registry, targeted/full evidence, timings and retained failure/continuation passed.');
