// Open a collapsed explorer section through the same control as the user.
export async function openExplorerGroup(page,id){
 const group=page.locator(`[data-explorer-key=${JSON.stringify('group:'+id)}]`);
 if(await group.getAttribute('aria-expanded')==='false')await group.click();
}
