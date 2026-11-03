import {openExplorerGroup} from './explorer-browser.mjs';

/** Follow the visible navigation instead of using the retired business drawer tabs. */
export async function showTestChecks(page,activityId){
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
 await openExplorerGroup(page,'tests');
 const item=activityId?page.locator('[data-explorer-key='+JSON.stringify('tests:activity:'+activityId)+']'):page.locator('#explorer-tests .explorer-item').first();
 await item.click();
 if(!activityId)await page.locator('.activity-test-unassigned > summary').click();
 if(await page.evaluate(()=>innerWidth<=800)&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
}
export async function showBusinessOverview(page){
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
 await openExplorerGroup(page,'business');
 await page.locator('[data-explorer-key="business:overview"]').click();
 if(await page.evaluate(()=>innerWidth<=800)&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
}
