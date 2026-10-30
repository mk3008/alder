import assert from 'node:assert/strict';

// On narrow screens the user must dismiss overlay drawers before using the canvas.
export async function closeCanvasOverlays(page){
 if(await page.evaluate(()=>innerWidth>800))return;
 if(await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
}

// Always use the accessible control. In particular, never force a hidden
// checkbox click or invoke a browser DOM click to bypass pointer hit testing.
export async function setDisplaySettings(page,open){
 const toggle=page.locator('#display-settings-toggle'),panel=page.locator('#display-options');
 const expected=String(open),expanded=await toggle.getAttribute('aria-expanded');
 assert.ok(expanded==='true'||expanded==='false','settings gear exposes its expansion state');
 assert.equal(await toggle.getAttribute('aria-controls'),'display-options');
 if(expanded!==expected)await toggle.click();
 assert.equal(await toggle.getAttribute('aria-expanded'),expected);
 assert.equal(await page.locator('.toolbar').getAttribute('data-settings-open'),expected);
 assert.equal(await panel.isVisible(),open);
 // Layout and ResizeObserver callbacks must settle before a caller captures
// graph-camera geometry or compares a subsequent filter-only update.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
}
export const openDisplaySettings=page=>setDisplaySettings(page,true);
export const closeDisplaySettings=page=>setDisplaySettings(page,false);

// JSDOM cannot establish native hit testing, but should still follow the same
// gear-first interaction path rather than silently activate hidden inputs.
export function openDisplaySettingsDOM(document){
 const toggle=document.querySelector('#display-settings-toggle'),panel=document.querySelector('#display-options');
 assert.ok(toggle&&panel,'settings gear and panel exist');
 assert.equal(toggle.disabled,false,'settings gear is enabled for the open document');
 assert.equal(document.querySelector('.toolbar').hidden,false,'toolbar is shown');
 const expanded=toggle.getAttribute('aria-expanded');
 assert.ok(expanded==='true'||expanded==='false','settings gear exposes its expansion state');
 assert.equal(toggle.getAttribute('aria-controls'),'display-options');
 if(expanded==='false')toggle.click();
 assert.equal(toggle.getAttribute('aria-expanded'),'true');
 assert.equal(panel.hidden,false);
 assert.equal(document.querySelector('.toolbar').dataset.settingsOpen,'true');
}
