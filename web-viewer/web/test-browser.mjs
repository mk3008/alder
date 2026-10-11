// Real Chromium smoke checks against the built app. Synthetic/public input only.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:960}});
const errors=[],external=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4173/'))external.push(request.url());});
const checks=[];
try {
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await page.locator('#fallback').setInputFiles({name:'sample.md',mimeType:'text/markdown',buffer:readFileSync('web/authorities/business-design.md')});
  await page.locator('.node').first().waitFor();
  assert.ok(await page.locator('.node').count()>0);
  assert.equal(await page.locator('.node[tabindex],button.node').count(),0);
  await page.locator('#open').focus();
  for(let i=0;i<30;i++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.classList.contains('node'))),false);}
  checks.push('file-input opens public fixture; Tab skips graph shapes');
  const first=page.locator('.node').first(),id=await first.getAttribute('data-node');
  await first.click();
  assert.equal(await page.locator('.node.selected').getAttribute('data-node'),id);
  assert.equal(await page.evaluate(()=>Boolean(document.activeElement?.classList.contains('node'))),false);
  const before=await first.boundingBox();
  await page.keyboard.press('Shift+ArrowRight');
  assert.deepEqual(await first.boundingBox(),before);
  await page.mouse.move(before.x+60,before.y+30);await page.mouse.down();await page.mouse.move(before.x+140,before.y+90,{steps:5});await page.mouse.up();
  const after=await first.boundingBox();assert.ok(after.x>before.x+60);assert.ok(after.y>before.y+40);
  checks.push('pointer selects and drags; keyboard does not move shapes');
  for(const theme of ['dark','light']){
    await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    const badges=await page.locator('.who-badge').evaluateAll(nodes=>nodes.map(n=>({background:getComputedStyle(n).backgroundColor,stroke:getComputedStyle(n.querySelector('svg')).color,width:n.getBoundingClientRect().width})));
    assert.ok(badges.length>0);assert.ok(badges.every(n=>n.stroke==='rgb(255, 255, 255)'&&n.width===28));
    assert.equal(await page.locator('.node.object .who-badge').count(),0);
  }
  checks.push('light/dark keep white person lines and 28px role circles');
  await page.locator('#open-text').click();await page.locator('#source-text').fill('# invalid');await page.locator('#source-submit').click();
  await page.locator('#status-text').filter({hasText:'表示できません'}).waitFor();assert.ok(await page.locator('.node').count()>0);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#source-dialog').isVisible(),false);
  await page.locator('#status-close').click();
  await page.waitForTimeout(300);await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await page.locator('.node.selected').getAttribute('data-node'),id);
  assert.deepEqual(await page.locator('.node').first().boundingBox(),after);
  checks.push('invalid text keeps previous graph; Escape closes; reload restores selection/position');
  assert.deepEqual(external,[]);
  // One real anonymous CORS fetch from the existing public fixture source.
  const source='https://raw.githubusercontent.com/mk3008/alder/aa950a7c29366e33c281803b086c3e00c9769933/business-design/alder/README.md';
  await page.locator('#open-url').click();await page.locator('#source-url').fill(source);await page.locator('#source-submit').click();
  await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden,{},{timeout:45000});
  assert.equal(await page.locator('.tab').count(),2);assert.deepEqual(external,[source]);
  await page.waitForTimeout(300);external.length=0;await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  assert.equal(await page.locator('.tab').count(),2);assert.deepEqual(external,[]);
  checks.push('real public HTTPS/CORS read succeeds; restore does not refetch');
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({browser:browser.version(),checks,passed:checks.length,pageErrors:errors,limits:['OS picker grants/revocation and process restart not tested','mobile and touch not tested']},null,2));
} finally {await browser.close();}
