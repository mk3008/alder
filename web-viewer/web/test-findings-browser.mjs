import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {assertToolbarLayout} from './test-toolbar-layout.mjs';

const markdown=readFileSync(new URL('../../tools/fixtures/design-findings/example.md',import.meta.url),'utf8');
export async function verifyFindings(browser){
  const results=[];mkdirSync('web/evidence/design-findings-96',{recursive:true});
  for(const width of [320,393,1280])results.push(await withToolbarPage(browser,{width,height:800},async(page,errors)=>{
    await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open-text').disabled);
    await page.locator('#open-text').click();await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();
    await page.waitForSelector('.node');
    assert.equal(await page.locator('#display-settings-toggle').getAttribute('data-finding-count'),'4');
    assert.equal(await page.locator('.finding-badges').count(),2);
    await assertToolbarLayout(page,{open:false});
    await page.locator('#display-settings-toggle').click();await assertToolbarLayout(page,{open:true});
    await page.screenshot({path:`web/evidence/design-findings-96/graph-${width}.png`});
    await page.locator('#findings-toggle').click();
    assert.equal(await page.locator('#findings-dialog').evaluate(e=>e.open),true);
    const panel=page.locator('#findings-dialog');
    assert.equal(await panel.locator('[data-finding-id="F01"]').count(),1);
    assert.match(await panel.textContent(),/関連先未設定/);assert.match(await panel.textContent(),/参照先不一致/);
    assert.match(await panel.textContent(),/困りごと/);assert.match(await panel.textContent(),/要確認/);assert.match(await panel.textContent(),/要修正/);
    assert.equal(await panel.locator('[data-finding-id="F04"]').count(),0);
    await panel.locator('input[type=checkbox]').check();assert.equal(await panel.locator('[data-finding-id="F04"]').count(),1);
    assert.equal(await panel.locator('img,script').count(),0);
    const bounds=await panel.boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+.5);
    assert.ok(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    await page.screenshot({path:`web/evidence/design-findings-96/list-${width}.png`});
    await page.keyboard.press('Escape');assert.equal(await panel.evaluate(e=>e.open),false);
    await page.locator('#display-settings-toggle').click();
    // The existing accessible item list remains the keyboard selection route.
    await page.locator('#node-list-toggle').click();
    const row=page.locator('#node-list button').filter({hasText:'依頼を受け付ける'}).first();
    await row.focus();await page.keyboard.press('Enter');
    await page.locator('#drawer').evaluate(e=>{if(e.getAttribute('aria-expanded')!=='true')e.click();});
    assert.match(await page.locator('#detail').textContent(),/この項目の指摘/);
    assert.equal(await page.locator('#detail [data-finding-id="F01"]').count(),1);
    assert.equal(await page.locator('.node button button').count(),0);
    assert.deepEqual(errors,[]);return {width,uniqueSharedFinding:true,unassignedVisible:true,inertContent:true};
  }));return results;
}
