import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
const raw=readFileSync(new URL('../../tools/fixtures/object-medium/example.md',import.meta.url),'utf8');
export async function verifyObjectMedium(browser){
 mkdirSync('web/evidence/object-medium',{recursive:true});
 const results=[];
 for(const width of [320,393,1280])results.push(await withToolbarPage(browser,{width,height:900},async(page,errors)=>{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open-text').disabled);
  const open=async source=>{await openSourceAction(page,'open-text');await page.locator('#source-text').fill(source);await page.locator('#source-submit').click();await page.waitForSelector('.node');await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden);if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();};
  await open(raw.replace(/## Medium\n\n[^\n]+\n/g,''));
  const before=await page.locator('.node').evaluateAll(ns=>ns.map(n=>({id:n.dataset.node,left:n.style.left,top:n.style.top,width:n.offsetWidth,height:n.offsetHeight})));
  assert.equal(await page.locator('.object-medium').count(),0);await page.screenshot({path:`web/evidence/object-medium/before-${width}.png`});
  // A new source is opened in its own workspace, with identical graph geometry.
  await open(raw);
  const after=await page.locator('.node').evaluateAll(ns=>ns.map(n=>({id:n.dataset.node,left:n.style.left,top:n.style.top,width:n.offsetWidth,height:n.offsetHeight})));
  assert.deepEqual(after,before);
  assert.equal(await page.locator('.object-medium').count(),2);
  const geometry=await page.locator('.object-medium').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect(),name=e.parentElement.querySelector('.node-name').getBoundingClientRect(),node=e.closest('.node').getBoundingClientRect(),who=document.querySelector('.business small');return {font:getComputedStyle(e).fontSize,whoFont:getComputedStyle(who).fontSize,line:getComputedStyle(e).lineHeight,whoLine:getComputedStyle(who).lineHeight,below:r.top>=name.bottom,inside:r.bottom<=node.bottom,ellipsis:getComputedStyle(e).textOverflow,title:e.title,text:e.textContent};}));
  for(const g of geometry){assert.equal(g.font,g.whoFont);assert.equal(g.line,g.whoLine);assert.ok(g.below&&g.inside);assert.equal(g.ellipsis,'ellipsis');assert.equal(g.title,g.text);}
  assert.match(await page.locator('[data-node="外部台帳"]').getAttribute('aria-label'),/shared.employee_roles/);
  await page.screenshot({path:`web/evidence/object-medium/after-${width}.png`});
  await page.locator('.activity-open').click();await page.waitForFunction(()=>document.querySelectorAll('.object-medium').length===2);
  await page.screenshot({path:`web/evidence/object-medium/detail-${width}.png`});
  await page.evaluate(()=>{const d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{...d,set(value){if(String(value).startsWith('data:image/svg+xml'))window.mediumExportSvg=decodeURIComponent(String(value).split(',').slice(1).join(','));d.set.call(this,value);}});});
  await ensureDocumentActions(page);const download=page.waitForEvent('download');await page.locator('#save-image').click();await download;
  const png=await page.evaluate(()=>{const d=new DOMParser().parseFromString(window.mediumExportSvg,'image/svg+xml');return Array.from(d.querySelectorAll('.object-medium')).map(e=>e.textContent);});assert.deepEqual(png,['PDF','データベース / shared.employee_roles_authority_limits_2026']);
  await page.reload();await page.waitForSelector('.object-medium');assert.equal(await page.locator('[data-node="受付情報"] .object-medium').textContent(),'PDF');
  assert.deepEqual(errors,[]);return {width,geometryUnchanged:true,media:geometry,png,restore:true};
 }));return results;
}
