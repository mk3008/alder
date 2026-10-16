import {readFileSync} from 'node:fs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
// Explicit no-Group sample for fixed geometry/routing regressions. Editing the
// ordinary sample through the real editor keeps the production bundle intact.
const markdown=readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8');
export async function useUngroupedSample(page){
 await ensureDocumentActions(page);await page.locator('#edit-markdown').click();
 if(await page.locator('#source-text').inputValue()===markdown){await page.locator('#source-cancel').click();return;}
 await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();
 await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden&&document.querySelector('#app').dataset.saveState==='saved');
 await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.locator('#display-settings-toggle').click();
 await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
}
