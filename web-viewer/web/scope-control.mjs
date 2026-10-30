// Exercise the current display-settings control without changing the graph viewport.
export async function setScope(page,mode){
 const toggle=page.locator('#display-settings-toggle'),options=page.locator('#display-options'),scope=page.locator('#show-outside'),desired=mode==='show';
 const state=()=>scope.evaluate(input=>({checked:input.checked,mixed:input.indeterminate}));
 if((await state()).checked===desired&&!(await state()).mixed)return;
 const narrow=await page.evaluate(()=>innerWidth<=800),left=narrow&&await page.locator('#design-explorer').isVisible(),right=narrow&&await page.locator('#formattedMarkdownDrawer').isVisible();
 if(left)await page.locator('#design-explorer .shell-heading button').click();if(right)await page.locator('#drawer').click();
 try{const opened=await options.isVisible();if(!opened)await toggle.click();
  for(let attempt=0;attempt<2;attempt++){const current=await state();if(current.checked===desired&&!current.mixed)break;await scope.click();}
  const actual=await state();if(actual.checked!==desired||actual.mixed)throw Error('Could not set outside-scope visibility to '+mode);
  if(!opened)await toggle.click();
 }finally{if(right)await page.locator('#drawer').click();if(left)await page.locator('#node-list-toggle').click();}
}
