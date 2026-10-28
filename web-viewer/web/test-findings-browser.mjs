import {openSourceAction} from './source-menu-browser.mjs';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
import {assertToolbarLayout} from './test-toolbar-layout.mjs';
import {positionGraphNode,selectGraphNode} from './graph-selection-browser.mjs';

const markdown=readFileSync(new URL('../../tools/fixtures/design-findings/example.md',import.meta.url),'utf8');
export async function verifyFindings(browser){
  const results=[];mkdirSync('web/evidence/design-findings-96',{recursive:true});
  for(const width of [320,393,1280])results.push(await withToolbarPage(browser,{width,height:800},async(page,errors)=>{
    await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open-text').disabled);
    await openSourceAction(page,'open-text');await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();
    await page.waitForSelector('.node');await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden);
    if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    assert.equal(await page.locator('#display-settings-toggle').getAttribute('data-finding-count'),null);assert.equal(await page.locator('#findings-toggle').count(),0);
    assert.equal(await page.locator('.finding-badges').count(),2);
    const geometry=await page.locator('.node').evaluateAll(cards=>cards.map(card=>{
      const badge=card.querySelector('.finding-badges'),c=card.getBoundingClientRect(),b=badge?.getBoundingClientRect(),style=getComputedStyle(card);
      const overlaps=b&&Array.from(card.querySelectorAll('.review-kind,.node-name,.node-text small,.who-badge,svg')).some(e=>{const r=e.getBoundingClientRect();return b.left<r.right&&b.right>r.left&&b.top<r.bottom&&b.bottom>r.top;});
      return {width:card.offsetWidth,height:card.offsetHeight,font:style.fontSize,padding:style.padding,radius:style.borderRadius,badge:b&&{above:b.top<c.top,right:b.right<=c.right,upperHalf:b.bottom<c.top+c.height/2,overlaps}};
    }));
    for(const card of geometry){assert.equal(card.width,260);assert.equal(card.height,68);assert.equal(card.font,'13px');assert.equal(card.padding,'9px 12px');assert.equal(card.radius,'8px');if(card.badge){assert.ok(card.badge.above&&card.badge.right&&card.badge.upperHalf);assert.equal(card.badge.overlaps,false);}}
    // Observe the real PNG raster input without replacing the native encoder.
    await page.evaluate(()=>{const d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{...d,set(value){if(String(value).startsWith('data:image/svg+xml'))window.findingExportSvg=decodeURIComponent(String(value).split(',').slice(1).join(','));d.set.call(this,value);}});});
    await ensureDocumentActions(page);const download=page.waitForEvent('download');await page.locator('#save-image').click();await download;
    const exported=await page.evaluate(()=>{const doc=new DOMParser().parseFromString(window.findingExportSvg,'image/svg+xml'),height=+doc.querySelector('foreignObject').getAttribute('height');return Array.from(doc.querySelectorAll('.finding-badges')).map(b=>({top:b.style.top,right:b.style.right,y:parseFloat(b.parentElement.style.top)+parseFloat(b.style.top),height}));});
    assert.equal(exported.length,2);for(const b of exported){assert.equal(b.top,'-9px');assert.equal(b.right,'4px');assert.ok(b.y>=0&&b.y+18<=b.height);}
    await assertToolbarLayout(page,{open:false});
    await page.locator('#display-settings-toggle').click();await assertToolbarLayout(page,{open:true});
    await page.screenshot({path:`web/evidence/design-findings-96/graph-${width}.png`});
    await page.locator('#display-settings-toggle').click();
    // Findings are opened from a graph badge in the current explorer.
    await positionGraphNode(page,'受付情報');
    await page.locator('.node[data-node="受付情報"] .finding-badges').press('Enter');
    await page.locator('.finding-back').click();await page.locator('.finding-all').click();
    assert.equal(await page.locator('#drawer-mode-findings').getAttribute('aria-selected'),'true');
    assert.match(await page.locator('#drawer-mode-findings').textContent(),/4/);
    for(const key of ['ArrowLeft','ArrowRight','Home','End']){await page.locator('#drawer-mode-findings').press(key);assert.equal(await page.locator('#drawer-mode-findings').getAttribute('aria-selected'),'true');assert.equal(await page.locator('#drawer-mode-findings').evaluate(e=>document.activeElement===e),true);}
    const panel=page.locator('#node-list');
    assert.equal(await panel.locator('[data-finding-key="finding:F01"]').count(),1);
    assert.match(await panel.textContent(),/関連先未設定/);assert.match(await panel.textContent(),/参照先不一致/);
    assert.match(await panel.textContent(),/困りごと/);const problem=panel.locator('[data-finding-key^="problem:"]').first();await problem.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#node-list-drawer').isVisible(),true);await page.locator('.finding-back').click();assert.match(await panel.textContent(),/要確認/);assert.match(await panel.textContent(),/要修正/);
    assert.equal(await panel.locator('[data-finding-key="finding:F04"]').count(),0);
    await panel.locator('input[type=checkbox]').check();assert.equal(await panel.locator('[data-finding-key="finding:F04"]').count(),1);
    assert.equal(await panel.locator('img,script').count(),0);
    const bounds=await page.locator('#node-list-drawer').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+.5);
    assert.ok(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    await page.screenshot({path:`web/evidence/design-findings-96/list-${width}.png`});
    assert.match(await panel.textContent(),/文書全体/);
    await panel.locator('[data-finding-key="finding:F04"]').click();assert.match(await page.locator('#node-list').textContent(),/解消済み/);await page.locator('.finding-back').click();
    await panel.locator('[data-finding-key="finding:F02"]').click();assert.equal(await page.locator('#node-list [data-finding-target]').isDisabled(),true);assert.equal(await page.locator('#node-list img').count(),0);await page.locator('.finding-back').click();
    await panel.locator('[data-finding-key="finding:F01"]').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#node-list [data-finding-id="F01"]').count(),1);
    assert.equal(await page.locator('#node-list [data-finding-target]').count(),2);
    assert.equal(await page.locator('#node-list img,#node-list script').count(),0);
    assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);
    await page.locator('#node-list [data-finding-target="受付情報"]').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false,'related target preserves closed right drawer');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('data-finding-target')),'受付情報','keyboard focus stays on related target');
    assert.equal(await page.locator('#node-list-drawer').isVisible(),true,'left drawer stays open after selection');
    await page.locator('#drawer').click();assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),true);
    await page.locator('#node-list [data-finding-target="依頼を受け付ける"]').focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),true,'related target preserves open right drawer');assert.match(await page.locator('#detail').textContent(),/依頼を受け付ける/);
    await page.locator('#drawer').click();assert.equal(await page.locator('#node-list-drawer').isVisible(),true,'left drawer stays open after selection');
    await page.locator('#node-list [data-finding-target="受付情報"]').click();
    assert.equal(await page.locator('.node.selected').getAttribute('data-node'),'受付情報');assert.match(await page.locator('#detail').textContent(),/受付情報/);assert.equal(await page.locator('#detail .finding-card').count(),0);assert.equal(await page.locator('#node-list-drawer').isVisible(),true,'left drawer stays open after selection');
    assert.equal(await page.locator('#node-list [data-finding-id="F01"]').count(),1);
    await page.locator('.finding-back').click();
    await panel.locator('[data-finding-key="finding:F03"]').click();
    assert.match(await page.locator('#node-list').textContent(),/関連先：未設定/);
    assert.equal(await page.locator('#node-list [data-finding-target]').count(),0);
    await page.locator('.finding-back').click();
    await page.locator('#node-list-close').click();
    // The graph is the current route for selecting an item without opening a tab.
    await selectGraphNode(page,'依頼を受け付ける');
    await page.locator('#drawer').evaluate(e=>{if(e.getAttribute('aria-expanded')!=='true')e.click();});
    assert.match(await page.locator('#detail').textContent(),/依頼を受け付ける/);assert.equal(await page.locator('#detail .finding-card').count(),0);
    if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();
    // Badge selection enters the left index without replacing the right source.
    await positionGraphNode(page,'受付情報');const badge=page.locator('.node[data-node="受付情報"] .finding-badges');await badge.focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#node-list-drawer').isVisible(),true);assert.equal(await page.locator('#node-list [data-finding-id="F01"]').count(),1);assert.equal(await page.locator('#detail .finding-card').count(),0);
    const leftDetail=await page.locator('#node-list').boundingBox();assert.ok(leftDetail.x>=0&&leftDetail.x+leftDetail.width<=width+.5);assert.ok(await page.locator('#node-list').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
    const flat=await page.locator('#node-list').evaluate(root=>{
      const props=e=>{const s=getComputedStyle(e);return {border:s.borderWidth,padding:s.padding,font:s.fontSize,line:s.lineHeight,radius:s.borderRadius,minHeight:s.minHeight};};
      const probe=document.createElement('button');probe.className='node-navigate';root.append(probe);const base=props(probe);probe.remove();
      return {base,buttons:[...root.querySelectorAll('.finding-back,.finding-target-link')].map(props),card:props(root.querySelector('.finding-card')),interactiveCard:root.querySelector('.finding-card').matches('button,[tabindex]')};
    });
    for(const button of flat.buttons){assert.equal(button.border,'0px');assert.equal(button.padding,flat.base.padding);assert.equal(button.font,flat.base.font);assert.equal(button.line,flat.base.line);assert.equal(button.minHeight,'44px');}
    assert.equal(flat.card.border,'0px');assert.equal(flat.card.radius,'0px');assert.equal(flat.interactiveCard,false);
    await page.screenshot({path:`web/evidence/design-findings-96/detail-${width}.png`});
    await page.locator('.finding-back').click();assert.equal(await page.locator('.finding-all').count(),1);await page.locator('.finding-all').click();assert.match(await page.locator('#node-list').textContent(),/関連先未設定/);
    assert.equal(await page.locator('.node button button').count(),0);
    assert.deepEqual(errors,[]);return {width,uniqueSharedFinding:true,unassignedVisible:true,inertContent:true};
  }));return results;
}
