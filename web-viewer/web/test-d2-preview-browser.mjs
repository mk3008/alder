import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const base=process.env.VIEWER_URL||'http://127.0.0.1:4173/';const evidence='web/evidence/json-document';await mkdir(evidence,{recursive:true});
const fixture=JSON.parse(await (await import('node:fs/promises')).readFile('public/d2-examples.json','utf8'));
const {selectGraphNode}=await import('./graph-selection-browser.mjs');
const first=id=>fixture.cases.find(c=>c.id===id).candidate.business.activities[0].id;
const choose=async id=>{await selectGraphNode(page,id);await page.locator('#detail h3').first().waitFor();};
const example=async id=>{await page.getByLabel('比較する業務例').selectOption(id);await page.getByRole('button',{name:'D2構造案',exact:true}).waitFor();await choose(first(id));};
try{
 await page.goto(new URL('d2.html?case=molkkyCross',base).href);await page.locator('.node').first().waitFor();await choose(first('molkkyCross'));
 assert.equal(await page.locator('header strong').textContent(),'Alder Viewer');assert.equal(await page.locator('#design-explorer').count(),1);assert.equal(await page.locator('#formattedMarkdownDrawer').count(),1);assert.equal(await page.locator('.d2-workspace').count(),0);
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.screenshot({path:evidence+'/d2-molkky-after.png'});
 const beforeIds=await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>n.dataset.node).sort());await page.getByRole('button',{name:'0.4表現',exact:true}).click();await page.getByRole('button',{name:'0.4表現',exact:true}).isEnabled();await page.screenshot({path:evidence+'/d2-molkky-before.png'});
 const ordinary=await browser.newPage({viewport:{width:1440,height:1000}});await ordinary.goto(base);await ordinary.locator('#open-menu-toggle:not([disabled])').waitFor();await ordinary.locator('#fallback').setInputFiles({name:'comparison.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture.cases[0].before))});await ordinary.locator('.node').first().waitFor();await ordinary.screenshot({path:evidence+'/d2-existing-viewer.png'});for(const selector of ['header','#design-explorer','.tab-strip','#formattedMarkdownDrawer','.node.business']){const style=async p=>p.locator(selector).first().evaluate(e=>{const s=getComputedStyle(e);return {font:s.fontFamily,radius:s.borderRadius,display:s.display,position:s.position};});assert.deepEqual(await style(page),await style(ordinary),selector);}await ordinary.close();
assert.deepEqual(await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>n.dataset.node).sort()),beforeIds);
 await page.getByRole('button',{name:'D2構造案',exact:true}).click();await page.locator('.d2-ref[data-step-ref="m-record-save"]').click();await page.locator('[data-step-id="m-record-save"][data-focused="true"]').waitFor();assert.match(await page.locator('#tabs .active').innerText(),/倒れた番号を記録する/);assert.doesNotMatch(await page.locator('#detail').innerText(),/m-record-save|m-record-enter|実行主体と分担は未確認です/);
 await example('mixed');assert.match(await page.locator('[data-step-id="mix-check"]').innerText(),/受付システム/);await page.screenshot({path:evidence+'/d2-actors.png'});
 await example('photo');assert.match(await page.locator('#detail').innerText(),/写真がある場合/);await page.screenshot({path:evidence+'/d2-photo.png'});
 await example('synthetic');assert.equal(await page.locator('[data-relation-id="s-output"] [data-information-id]').count(),2);
 await example('molkky');assert.equal(await page.locator('[data-result-id]').count(),2);await page.screenshot({path:evidence+'/d2-result-conditions.png'});
 const zoom=await page.locator('#zoom').textContent();await page.locator('#in').click();assert.notEqual(await page.locator('#zoom').textContent(),zoom);await page.locator('#drawer').click();assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);await page.locator('#drawer').click();
 await page.locator('#theme').click();await page.screenshot({path:evidence+'/d2-dark.png'});await page.setViewportSize({width:393,height:852});await page.screenshot({path:evidence+'/d2-mobile.png'});
 assert.deepEqual(await page.evaluate(async()=>await indexedDB.databases()),[]);assert.deepEqual(errors,[]);await writeFile(evidence+'/d2-observations.json',JSON.stringify({source:'d2-examples.json',sharedMain:true,directCandidateGraph:true,readOnly:true,modes:['before','d2'],caseCount:5,errors,humanReview:'pending'},null,2));
}finally{await browser.close();}
