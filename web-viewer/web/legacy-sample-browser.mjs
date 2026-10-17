import {readFileSync} from 'node:fs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
// Explicit no-Group sample for fixed geometry/routing regressions. Editing the
// ordinary sample through the real editor keeps the production bundle intact.
const markdown=readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8');
export async function useUngroupedSample(page){
 await page.locator('#open-menu-toggle').click();await page.locator('#open-text').click();
 await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();
 await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden&&document.querySelector('#app').dataset.saveState==='saved');
 // The mobile Markdown drawer can cover the toolbar. Keep its initial state
 // while using the same unobstructed settings controls as an ordinary reader.
 const drawerOpen=await page.locator('#formattedMarkdownDrawer').isVisible();
 if(drawerOpen)await page.locator('#drawer').click();
 await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.locator('#display-settings-toggle').click();
 if(drawerOpen)await page.locator('#drawer').click();
 await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
}
