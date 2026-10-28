// Center a card through the current graph viewport, not the retired item-list UI.
export async function positionGraphNode(page,id){
 if(await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
 const reopen=await page.evaluate(()=>innerWidth<=800)&&await page.locator('#formattedMarkdownDrawer').isVisible();if(reopen)await page.locator('#drawer').click();
 const node=page.locator(`.node[data-node=${JSON.stringify(id)}]`);
 await node.scrollIntoViewIfNeeded();await node.evaluate(element=>{const v=document.querySelector('#viewport'),a=element.getBoundingClientRect(),b=v.getBoundingClientRect();v.scrollBy(a.left+a.width/2-(b.left+b.width/2),a.top+a.height/2-(b.top+b.height/2));});
 return {node,reopen};
}
export async function selectGraphNode(page,id){
 const {node,reopen}=await positionGraphNode(page,id);await node.click({position:{x:60,y:30}});
 if(reopen)await page.locator('#drawer').click();
}
