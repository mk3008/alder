import {openExplorerGroup} from './explorer-browser.mjs';

/** Follow the visible navigation instead of using the retired business drawer tabs. */
export async function showTestChecks(page,activityId){
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
 await openExplorerGroup(page,'tests');
 if(activityId){
  const group=page.locator('[data-explorer-key='+JSON.stringify('group:tests-activity-'+activityId)+']');
  if(await group.getAttribute('aria-expanded')==='false')await group.click();
 }
 await page.locator('[data-explorer-key='+JSON.stringify(activityId?'tests:checks:'+activityId:'tests:@unassigned')+']').click();
}
export async function showBusinessOverview(page){
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
 await openExplorerGroup(page,'business');
 await page.locator('[data-explorer-key="business:overview"]').click();
}
