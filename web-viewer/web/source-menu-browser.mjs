// Keep browser flows on the visible source dropdown, including keyboard tests.
export async function openSourceAction(page,id){
 if(!await page.locator('#source-menu').isVisible())await page.locator('#open-menu-toggle').click();
 await page.locator('#'+id).click();
}
