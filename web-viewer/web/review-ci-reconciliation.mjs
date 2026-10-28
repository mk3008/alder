// Read-only checks against the independently committed CI reconciliation items.
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const path='verification/ci-reconciliation.check-items.json';
const expected='710d773f243244d7e27b8f934fe3182f6f465135d0cbaf84d5046727a44371ed';
const hash=()=>createHash('sha256').update(readFileSync(path)).digest('hex');
assert.equal(hash(),expected,'the independent CI Check Items changed');
const authority=JSON.parse(readFileSync(path,'utf8'));
const evidence={
 'CI-RECONCILE-001':['web/test-findings-dom.mjs','web/test-node-drawer.mjs','web/test-scope-shortcut.mjs'],
 'CI-RECONCILE-002':['web/test-close.mjs','web/test-empty-state.mjs'],
 'CI-RECONCILE-003':['web/test-shared-layout.mjs','web/test-routing.mjs','web/test-node-edge-drag.mjs'],
 'CI-RECONCILE-004':['web/test-json-native.mjs','web/review-routing/preflight.mjs'],
 'CI-RECONCILE-005':['web/test-browser-selection.mjs']
};
assert.equal(authority.format,'viewer-verification/1');assert.deepEqual(new Set(authority.checks.map(item=>item.id)),new Set(Object.keys(evidence)));
for(const item of authority.checks)for(const key of ['condition','guarantee','reason','source','verification'])assert.ok(item[key]?.trim(),`${item.id} lacks ${key}`);
const scripts=JSON.parse(readFileSync('package.json','utf8')).scripts,tests=Object.values(scripts).join('\n');
for(const file of new Set(Object.values(evidence).flat())){
 assert.ok(existsSync(file),`${file} is missing`);assert.ok(tests.includes(file),`${file} is no longer registered`);
 const run=spawnSync(process.execPath,['--experimental-strip-types',file],{encoding:'utf8',timeout:120000});
 assert.equal(run.status,0,`${file} failed: ${run.error??''}\n${run.stdout}\n${run.stderr}`);
}
const planRun=spawnSync(process.execPath,['web/test-browser.mjs','--list'],{encoding:'utf8'});assert.equal(planRun.status,0,planRun.stderr);
const selected=new Set(JSON.parse(planRun.stdout).browserPlan.selected);
const previous='conceptInitial viewerShell jsonRoles jsonStates jsonLayout sharedCaptions jsonDocuments jsonBoundaries jsonOfflinePreview activityWorkspace relatedChecks findings documentActions graphPng saveState sessionConcurrency saveConflictNoop lifecycleSave markdownEditor editorViewport sourceSharing headerControls gettingStarted toolbarSettings layoutReset drawerOpeningFocus savedStatePreflight emptyState returnRoutes initialLeftMargin nodeEdgeDrag bottomClearance touchZoom routeCache previewIsolation layoutLock documentOrder facingRoutes nodeDrawer tabStrip scopeOption labelLayout edgeOption exceptionOption scopeShortcut scopeGeometry:fixed-drawer scopeGeometry:drawer-only scopeGeometry:combined legacySmoke'.split(' ');
for(const name of previous)assert.ok(selected.has(name),`original browser case ${name} was removed`);
assert.ok(selected.has('tabScroll'),'new real-browser tab scrolling case missing');assert.equal(hash(),expected,'authority changed during verification');
console.log(JSON.stringify({authority:path,sha256:expected,results:authority.checks.map(item=>({id:item.id,evidence:evidence[item.id],status:item.id==='CI-RECONCILE-005'?'partial: full CI and browser result still required':'pass'})),browserCases:previous.length+1},null,2));
