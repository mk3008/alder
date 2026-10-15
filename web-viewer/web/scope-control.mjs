// Exercise the actual drawer button without changing the surrounding graph viewport.
export async function setScope(page,mode){
 const toggle=page.locator('#node-list-toggle'),drawer=page.locator('#node-list-drawer'),bulk=page.locator('#scope-outside');
 const desired=mode==='show'?'true':'false';if(await bulk.getAttribute('aria-pressed')===desired)return;
 const opened=await drawer.isVisible();if(!opened)await toggle.click();
 if(await bulk.getAttribute('aria-pressed')!==desired){await bulk.click();if(await bulk.getAttribute('aria-pressed')!==desired)await bulk.click();}
 if(!opened)await page.locator('#node-list-close').click();
}
