import {verifyActivityWorkspace} from './test-activity-workspace-browser.mjs';
import {verifyJSONDocuments} from './test-json-document-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import {verifyRelatedChecks} from './test-check-items-browser.mjs';
import {verifyFindings} from './test-findings-browser.mjs';
import {verifyDocumentActions} from './test-document-actions-browser.mjs';
import {verifyGraphPng} from './test-graph-png-browser.mjs';
import {verifyLayoutReset} from './test-layout-reset-browser.mjs';
import {verifyGettingStarted} from './test-getting-started-browser.mjs';
import {verifyEditorViewport} from './test-editor-viewport-browser.mjs';
import {verifySourceSharing} from './test-source-sharing-browser.mjs';
import {verifySaveState} from './test-save-state-browser.mjs';
import {verifySessionConcurrency} from './test-session-concurrency-browser.mjs';
import {verifySaveConflictNoop} from './test-save-conflict-noop-browser.mjs';
import {verifyLifecycleSave} from './test-lifecycle-save-browser.mjs';
import {verifyMarkdownEditor} from './test-editor-browser.mjs';
import {verifyToolbarSettings} from './test-toolbar-settings-browser.mjs';
import {verifyInitialLeftMargin} from './test-initial-left-margin-browser.mjs';
import {verifyReturnRoutes} from './test-return-route-browser.mjs';
import {verifyEmptyState} from './test-empty-state-browser.mjs';
import {verifyNodeEdgeDrag} from './test-node-edge-drag-browser.mjs';
import {verifyRouteCache} from './test-route-cache-browser.mjs';
import {verifyScopeShortcut} from './test-scope-shortcut-browser.mjs';
import {verifyExceptionOption} from './test-exception-browser.mjs';
import {verifyHeaderControls} from './test-header-controls-browser.mjs';
import {verifyBottomClearance} from './test-bottom-clearance-browser.mjs';
import {diagnoseScopeGeometry} from './diagnose-scope-geometry.mjs';
import {verifySavedStatePreflight} from './test-saved-state-browser.mjs';
import {parseBrowserCaseArgs,selectBrowserCases,runBrowserCases} from './browser-cases.mjs';
import {verifyNodeDrawer,verifyDrawerOpeningFocus} from './test-node-drawer-browser.mjs';
import {verifyTabStrip} from './test-tab-strip-browser.mjs';
import {setScope} from './scope-control.mjs';
// Real Chromium smoke checks against the built app. Synthetic/public input only.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {verifyFacingRoutes} from './test-facing-routes-browser.mjs';
import {verifyDocumentOrder} from './test-document-order-browser.mjs';
import {verifyLayoutLock} from './test-controls-browser.mjs';
import {verifyTouchZoom} from './test-touch-browser.mjs';
import {verifyLabelLayout} from './test-label-layout.mjs';
import {verifyPreviewIsolation} from './test-preview-browser.mjs';
import {verifyScopeOption} from './test-scope-browser.mjs';
import {verifyEdgeOption} from './test-edge-browser.mjs';
const options=parseBrowserCaseArgs(process.argv.slice(2));
let browser,page;
const errors=[],external=[],checks=[];
const cases=[
   {name:'jsonDocuments',run:()=>verifyJSONDocuments(browser)},
   {name:'activityWorkspace',run:()=>verifyActivityWorkspace(browser)},
   {name:'relatedChecks',run:()=>verifyRelatedChecks(browser)},
   {name:'findings',run:()=>verifyFindings(browser)},
   {name:'documentActions',run:()=>verifyDocumentActions(browser)},
   {name:'graphPng',run:()=>verifyGraphPng(browser)},
   {name:'saveState',run:()=>verifySaveState(browser)},
   {name:'sessionConcurrency',run:()=>verifySessionConcurrency(browser)},
   {name:'saveConflictNoop',run:()=>verifySaveConflictNoop(browser)},
   {name:'lifecycleSave',run:()=>verifyLifecycleSave(browser)},
   {name:'markdownEditor',run:()=>verifyMarkdownEditor(browser)},
   {name:'editorViewport',run:()=>verifyEditorViewport(browser)},
   {name:'sourceSharing',run:()=>verifySourceSharing(browser)},
   {name:'headerControls',run:()=>verifyHeaderControls(browser)},
   {name:'gettingStarted',run:()=>verifyGettingStarted(browser)},
   {name:'toolbarSettings',run:()=>verifyToolbarSettings(browser)},
   {name:'layoutReset',run:()=>verifyLayoutReset(browser)},
   {name:'drawerOpeningFocus',run:()=>verifyDrawerOpeningFocus(browser)},
   {name:'savedStatePreflight',run:()=>verifySavedStatePreflight(browser)},
   {name:'emptyState',run:()=>verifyEmptyState(browser)},
   {name:'returnRoutes',run:()=>verifyReturnRoutes(browser)},
   {name:'initialLeftMargin',run:()=>verifyInitialLeftMargin(browser)},
   {name:'nodeEdgeDrag',run:()=>verifyNodeEdgeDrag(browser)},
   {name:'bottomClearance',run:()=>verifyBottomClearance(browser)},
   {name:'touchZoom',run:async()=>{const result=await verifyTouchZoom(browser,{nativeScrollDiagnostics:false});assert.ok(result.ok,'Touch suite contains failed or blocked cases; see per-case diagnostics');return result;}},
   ...[['routeCache',verifyRouteCache],['previewIsolation',verifyPreviewIsolation],['layoutLock',verifyLayoutLock],['documentOrder',verifyDocumentOrder],['facingRoutes',verifyFacingRoutes],['nodeDrawer',verifyNodeDrawer],['tabStrip',verifyTabStrip],['scopeOption',verifyScopeOption],['labelLayout',verifyLabelLayout],['edgeOption',verifyEdgeOption],['exceptionOption',verifyExceptionOption],['scopeShortcut',verifyScopeShortcut]].map(([name,verify])=>({name,run:()=>verify(browser)})),
   ...['fixed-drawer','drawer-only','combined'].map(mode=>({name:'scopeGeometry:'+mode,run:()=>diagnoseScopeGeometry(browser,mode)})),
   {name:'legacySmoke',run:async()=>{
  page.on('dialog',async dialog=>{errors.push('Unexpected dialog: '+dialog.type());await dialog.dismiss();});
  const clean=p=>p.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const sample=await browser.newPage({viewport:{width:1280,height:960}}),sampleRequests=[],sampleErrors=[];
  sample.on('request',r=>sampleRequests.push(r.url()));sample.on('pageerror',e=>sampleErrors.push(e.message));sample.on('dialog',async dialog=>{sampleErrors.push('Unexpected dialog: '+dialog.type());await dialog.dismiss();});
  await sample.goto('http://127.0.0.1:4173/');await sample.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await sample.locator('#open-sample').textContent(),'サンプルを開く');
  const historyLength=await sample.evaluate(()=>history.length),startURL=sample.url();sampleRequests.length=0;
  await sample.locator('#open-sample').focus();await sample.keyboard.press('Enter');await sample.locator('#check-followup-later').click();
  assert.equal(await sample.locator('.tab').count(),1);assert.equal(await sample.locator('.node').count(),25);assert.equal(await sample.locator('.edge').count(),63);
  assert.equal(await sample.locator('#status').isVisible(),false);assert.equal(await sample.locator('#empty').isVisible(),false);
  await sample.evaluate(()=>{document.querySelector('#open-sample').click();document.querySelector('#open-sample').click();});assert.equal(await sample.locator('.tab').count(),1);
  assert.equal(sample.url(),startURL);assert.equal(await sample.evaluate(()=>history.length),historyLength);
  const sampleFirst=sample.locator('.node').first(),sampleId=await sampleFirst.getAttribute('data-node');await sampleFirst.click();
  assert.equal(await sample.locator('.node.selected').getAttribute('data-node'),sampleId);
  const sampleSource=readFileSync('../business-design/alder/README.md','utf8');
  const sampleHeading=sampleSource.split('\n').find(line=>line===`# Object ${sampleId}`||line===`# Activity ${sampleId}`);
  assert.ok(sampleHeading,'Selected node must have a canonical source section');
  assert.equal(await sample.locator('#detail h1').textContent(),sampleId);
  const sampleSection=sampleSource.slice(sampleSource.indexOf(sampleHeading)).split('\n# ')[0];
  const sampleItems=sampleSection.split('\n').filter(line=>line.startsWith('- ')).map(line=>line.slice(2));
  assert.ok(sampleItems.length>0);for(const item of sampleItems)assert.ok((await sample.locator('#detail').textContent()).includes(item));
  await sample.locator('#layout-lock').click();const sampleBefore=await sampleFirst.boundingBox();await sample.mouse.move(sampleBefore.x+70,sampleBefore.y+30);await sample.mouse.down();await sample.mouse.move(sampleBefore.x+110,sampleBefore.y+50,{steps:4});await sample.mouse.up();
  const sampleAfter=await sampleFirst.boundingBox();assert.ok(sampleAfter.x>sampleBefore.x+30);
  await sample.locator('#theme').click();assert.equal(await sample.locator('#refresh').isVisible(),true);assert.equal(await sample.locator('#refresh').isDisabled(),true);await sample.locator('#refresh').evaluate(button=>button.click());assert.equal(await sample.locator('.tab').count(),1);
  assert.equal(await sample.locator('#status').isVisible(),false);await clean(sample);assert.deepEqual(sampleRequests,[]);
  await clean(sample);await sample.reload();await sample.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await sample.locator('.node').count(),25);assert.equal(await sample.locator('html').getAttribute('data-theme'),'dark');assert.equal(await sample.locator('.node.selected').getAttribute('data-node'),sampleId);assert.deepEqual(await sample.locator('.node').first().boundingBox(),sampleAfter);assert.equal(await sample.locator('#status').isVisible(),false);
  assert.ok(sampleRequests.every(url=>url.startsWith('http://127.0.0.1:4173/')));
  assert.equal(await sample.locator('.close').isVisible(),false);assert.equal(await sample.locator('#empty').isVisible(),false);await openSourceAction(sample,'open-sample-menu');if(await sample.locator('#check-followup').isVisible())await sample.locator('#check-followup-later').click();assert.equal(await sample.locator('.node').count(),25);assert.equal(await sample.locator('.tab').count(),1);
  assert.deepEqual(await sample.locator('.node').first().boundingBox(),sampleAfter);
  const sampleLayout=()=>sample.locator('.node').evaluateAll(nodes=>nodes.map(n=>[n.dataset.node,n.style.left,n.style.top]));
  await sample.locator('#out').click();await sample.locator('#viewport').evaluate(e=>{e.scrollLeft=100;e.scrollTop=40;});await sample.waitForTimeout(250);
  const retainedSampleLayout=await sampleLayout(),retainedSampleView=await sample.locator('#viewport').evaluate(e=>[e.scrollLeft,e.scrollTop]),retainedSampleZoom=await sample.locator('#zoom').textContent();
  assert.ok(retainedSampleView[0]>0);
  assert.equal(await sample.locator('.close').isVisible(),false);await clean(sample);await sample.reload();await sample.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await sample.locator('.tab').count(),1);assert.equal(await sample.locator('#empty').isVisible(),false);
  await openSourceAction(sample,'open-sample-menu');if(await sample.locator('#check-followup').isVisible())await sample.locator('#check-followup-later').click();assert.deepEqual(await sampleLayout(),retainedSampleLayout);assert.equal(await sample.locator('#zoom').textContent(),retainedSampleZoom);assert.deepEqual(await sample.locator('#viewport').evaluate(e=>[e.scrollLeft,e.scrollTop]),retainedSampleView);assert.equal(await sample.locator('.node.selected').getAttribute('data-node'),sampleId);
  await setScope(sample,'hide');assert.equal(await sample.locator('.node').count(),12);assert.equal(await sample.locator('.close').isVisible(),false);await clean(sample);await sample.reload();await sample.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await sample.locator('.tab').count(),1);await openSourceAction(sample,'open-sample-menu');if(await sample.locator('#check-followup').isVisible())await sample.locator('#check-followup-later').click();assert.equal(await sample.locator('.node').count(),12);await setScope(sample,'show');assert.deepEqual(await sampleLayout(),retainedSampleLayout);
  assert.deepEqual(sampleErrors,[]);await sample.close();checks.push('bundled sample: keyboard/pointer open, repeat, 25 nodes/63 relations, no history/network, selection/drag/theme, disabled refresh/reload, close/reopen exact coordinates, closed-tab reload/open, hidden-node positions');
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await page.locator('#fallback').setInputFiles({name:'sample.md',mimeType:'text/markdown',buffer:readFileSync('web/authorities/business-design.md')});
  await page.locator('.node').first().waitFor();await page.locator('#check-followup-later').click();
  assert.ok(await page.locator('.node').count()>0);
  assert.equal(await page.locator('.node[tabindex],button.node').count(),0);
  await page.locator('#open-menu-toggle').focus();
  for(let i=0;i<30;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.classList.contains('node'))),false);}
  checks.push('file-input opens public fixture; Tab skips graph shapes');
  const first=page.locator('.node').first(),id=await first.getAttribute('data-node');
  await first.click();
  assert.equal(await page.locator('.node.selected').getAttribute('data-node'),id);
  assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.classList.contains('node'))),false);
  const before=await first.boundingBox();
  await page.keyboard.press('Shift+ArrowRight');
  assert.deepEqual(await first.boundingBox(),before);
  await page.locator('#layout-lock').click();await page.mouse.move(before.x+60,before.y+30);await page.mouse.down();await page.mouse.move(before.x+140,before.y+90,{steps:5});await page.mouse.up();
  const after=await first.boundingBox();assert.ok(after.x>before.x+60);assert.ok(after.y>before.y+40);
  checks.push('pointer selects and drags; keyboard does not move shapes');
  for(const theme of ['dark','light']){
    await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    const badges=await page.locator('.who-badge').evaluateAll(nodes=>nodes.map(n=>({background:getComputedStyle(n).backgroundColor,stroke:getComputedStyle(n.querySelector('svg')).color,width:n.getBoundingClientRect().width})));
    assert.ok(badges.length>0);assert.ok(badges.every(n=>n.stroke==='rgb(255, 255, 255)'&&n.width===28));
    assert.equal(await page.locator('.node.object .who-badge').count(),0);
  }
  checks.push('light/dark keep white person lines and 28px role circles');
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill('# invalid');await page.locator('#source-submit').click();
  await page.locator('#status-text').filter({hasText:'表示できません'}).waitFor();assert.ok(await page.locator('.node').count()>0);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#source-dialog').isVisible(),false);
  await page.locator('#status-close').click();
  await clean(page);await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await page.locator('.node.selected').getAttribute('data-node'),id);
  assert.deepEqual(await page.locator('.node').first().boundingBox(),after);
  checks.push('invalid text keeps previous graph; Escape closes; reload restores selection/position');
  assert.deepEqual(external,[]);
  // One real anonymous CORS fetch from the existing public fixture source.
  const source='https://raw.githubusercontent.com/mk3008/alder/aa950a7c29366e33c281803b086c3e00c9769933/business-design/alder/README.md';
  await openSourceAction(page,'open-url');await page.locator('#source-url').fill(source);await page.locator('#source-submit').click();
  await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden,{},{timeout:45000});
  assert.equal(await page.locator('.tab').count(),1);assert.deepEqual(external,[source]);
  await clean(page);external.length=0;const startupRead=page.waitForRequest(r=>r.url()===source);await page.reload();await startupRead;await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await page.locator('.tab').count(),1);assert.deepEqual(external,[source]);
  checks.push('real public HTTPS/CORS read succeeds; restore checks the source without replacing it');
  // The existing public source is also read from only the copied link in fresh storage.
  // Capture clipboard boundary only; real OS clipboard permission is not asserted.
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{globalThis.__publicSourceShare=value;}}});});
  await page.locator('#share-source').click();await page.waitForFunction(()=>!!globalThis.__publicSourceShare);
  const shared=await page.evaluate(()=>globalThis.__publicSourceShare),expectedNodes=await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>[n.dataset.node,n.textContent]));
  assert.equal(shared,'http://127.0.0.1:4173/#source='+encodeURIComponent(source));
  const recipientContext=await browser.newContext(),recipient=await recipientContext.newPage(),recipientReads=[],recipientErrors=[];
  recipient.on('request',r=>{if(r.url()===source)recipientReads.push({url:r.url(),method:r.method(),headers:r.headers()});});recipient.on('pageerror',e=>recipientErrors.push(e.message));
  try{
   await recipient.goto(shared);await recipient.waitForFunction(()=>document.querySelectorAll('.tab').length===1,{},{timeout:45000});await clean(recipient);
   assert.deepEqual(await recipient.locator('.node').evaluateAll(nodes=>nodes.map(n=>[n.dataset.node,n.textContent])),expectedNodes);
   assert.equal(new URL(recipient.url()).hash,'');assert.equal(recipientReads.length,1);assert.equal(recipientReads[0].method,'GET');assert.equal(recipientReads[0].headers.cookie??'','');assert.equal(recipientReads[0].headers.referer??'','');
   const startupRead=recipient.waitForRequest(r=>r.url()===source);await recipient.reload();await startupRead;await recipient.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await recipient.locator('.tab').count(),1);assert.equal(recipientReads.length,2);assert.deepEqual(recipientErrors,[]);
   checks.push('copied source-only link loads matching Graph via real public HTTPS/CORS in independent context; consumed-link reload performs one startup update check');
  }finally{await recipientContext.close();}

  assert.deepEqual(errors,[]);
  return {browser:browser.version(),checks,passed:checks.length,pageErrors:errors,limits:['OS picker grants/revocation and process restart not tested','touch uses Chrome CDP emulation; physical Android and mobile browser chrome not tested']};
   }}
  ];
const selected=selectBrowserCases(cases,options.names);
if(options.list){
 console.log(JSON.stringify({browserPlan:{scope:selected.length===cases.length?'full':'targeted',available:cases.length,selected:selected.map(c=>c.name)}}));
}else{
 const require=createRequire(import.meta.url);
 const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome',headless:true});
 try{
  page=await browser.newPage({viewport:{width:1280,height:960}});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4173/'))external.push(request.url());});
  await runBrowserCases(selected,console.log,{available:cases.length});
 }finally{await browser.close();}
}
