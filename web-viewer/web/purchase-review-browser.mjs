import {readFileSync} from 'node:fs';

// Use the public file input: localhost is not an allowed shared-source URL.
export async function loadPurchaseReview(page){
 const source=readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json');
 await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
 await page.locator('#fallback').setInputFiles({name:'purchase-v2-beta.json',mimeType:'application/json',buffer:source});
 await page.waitForFunction(()=>document.querySelectorAll('#explorer-business-activity .explorer-item').length>0);
 if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
 await page.locator('[data-explorer-key="concept:landscape"]').click();await page.locator('.concept-empty button').click();
 await page.locator('.subsystem-overview-graph').waitFor();
}
