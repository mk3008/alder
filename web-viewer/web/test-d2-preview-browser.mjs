import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const base=process.env.VIEWER_URL||'http://127.0.0.1:4173/';const evidence='web/evidence/json-document';await mkdir(evidence,{recursive:true});
try{
 await page.goto(new URL('d2.html?case=molkkyCross',base).href);await page.locator('.d2-cross').waitFor();await page.screenshot({path:evidence+'/d2-molkky-after.png'});
 const beforeIds=await page.locator('[data-node]').evaluateAll(nodes=>nodes.map(n=>n.dataset.node).sort());await page.getByRole('button',{name:'0.4表現',exact:true}).click();await page.screenshot({path:evidence+'/d2-molkky-before.png'});assert.deepEqual(await page.locator('[data-node]').evaluateAll(nodes=>nodes.map(n=>n.dataset.node).sort()),beforeIds);
 await page.getByRole('button',{name:'D2構造案',exact:true}).click();await page.locator('.d2-cross button').filter({hasText:'m-reset'}).click();await page.locator('[data-step-id="m-reset"][data-focused="true"]').waitFor();
 await page.getByLabel('比較する業務例').selectOption('mixed');assert.match(await page.locator('[data-step-id="mix-check"]').innerText(),/受付システム/);await page.screenshot({path:evidence+'/d2-actors.png'});
 await page.getByLabel('比較する業務例').selectOption('photo');assert.match(await page.locator('.d2-detail').innerText(),/写真がある場合/);await page.screenshot({path:evidence+'/d2-photo.png'});
 await page.getByLabel('比較する業務例').selectOption('synthetic');assert.equal(await page.locator('[data-relation-id="s-output"] [data-information-id]').count(),2);
 await page.getByLabel('比較する業務例').selectOption('molkky');assert.equal(await page.locator('[data-result-id]').count(),2);await page.screenshot({path:evidence+'/d2-result-conditions.png'});
 await page.getByRole('button',{name:'配色を切り替える'}).click();await page.screenshot({path:evidence+'/d2-dark.png'});await page.setViewportSize({width:393,height:852});await page.screenshot({path:evidence+'/d2-mobile.png'});
 assert.equal(await page.evaluate(()=>document.querySelectorAll('textarea,input[type=file],[contenteditable=true]').length),0);assert.deepEqual(errors,[]);await writeFile(evidence+'/d2-observations.json',JSON.stringify({source:'d2-examples.json',readOnly:true,modes:['before','d2'],caseCount:5,errors,humanReview:'pending'},null,2));
}finally{await browser.close();}
