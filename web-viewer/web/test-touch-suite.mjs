// Controlled failure-path checks only; does not execute Chromium or product UI.
import assert from 'node:assert/strict';
import {verifyTouchZoom} from './test-touch-browser.mjs';
const log=console.log,error=console.error;console.log=()=>{};console.error=()=>{};
try{
 let attempts=0;
 const setup=await verifyTouchZoom({version:()=> 'controlled model',newContext:async()=>{attempts++;throw Error('controlled setup failure');}});
 assert.equal(attempts,3);assert.equal(setup.ok,false);assert.equal(setup.results.length,10);
 assert.equal(setup.results.filter(r=>r.status==='failed').length,3);assert.equal(setup.results.filter(r=>r.status==='blocked').length,7);
 assert.match(setup.results.at(-2).error,/controlled setup failure/,'independent Drawer case still attempted');
 const scoped=await verifyTouchZoom({version:()=> 'controlled model',newContext:async()=>{throw Error('controlled setup failure');}},{nativeScrollDiagnostics:false});assert.equal(scoped.results.filter(r=>r.status==='not-run').length,2);assert.equal(scoped.ok,false,'omitted known diagnostics never hide a required failure');
 attempts=0;let closes=0;
 const teardown=await verifyTouchZoom({version:()=> 'controlled model',newContext:async()=>{attempts++;return {newPage:async()=>{throw Error('controlled page failure');},close:async()=>{closes++;throw Error('controlled close failure');}};}});
 assert.equal(attempts,3);assert.equal(closes,3);assert.equal(teardown.ok,false);assert.equal(teardown.results.length,10);
 for(const r of teardown.results.filter(r=>r.status==='failed')){assert.match(r.error,/controlled page failure/);assert.match(r.teardownError,/controlled close failure/);}
}finally{console.log=log;console.error=error;}
console.log(JSON.stringify({model:'controlled harness setup/teardown failure; no browser',checks:['setup failure retained and later independent case attempted','teardown failure retained without aborting remaining case collection'],passed:2},null,2));
