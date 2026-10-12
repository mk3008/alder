// Real rendered geometry; select nodes by their type/scope, never their list order.
import assert from 'node:assert/strict';
export async function verifyLabelLayout(browser) {
  const page=await browser.newPage({viewport:{width:393,height:852}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try {
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForFunction(()=>!document.querySelector('#open').disabled);
    await page.locator('#drawer').click();
    await page.locator('#open-sample').click();
    const graph=await page.locator('.edge').evaluateAll(nodes=>nodes.map(n=>[n.dataset.relation,n.getAttribute('d')]));
    const positions=await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>[n.dataset.node,n.style.left,n.style.top]));
    const results=[];
    for(const theme of ['light','dark']) {
      if(await page.locator('html').getAttribute('data-theme')!==theme) await page.locator('#theme').click();
      for(const zoom of ['100%','40%']) {
        if(zoom==='40%')for(let i=0;i<5;i++)await page.locator('#out').click();
        assert.equal(await page.locator('#zoom').textContent(),zoom);
        const rows=await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>{
          const r=n.getBoundingClientRect(),scale=r.width/260;
          const relative=el=>{const b=el.getBoundingClientRect();return {x:(b.x-r.x)/scale,y:(b.y-r.y)/scale,w:b.width/scale,h:b.height/scale};};
          const name=n.querySelector('.node-name'),role=n.querySelector('small'),icon=n.firstElementChild;
          return {id:n.dataset.node,type:n.classList.contains('business')?'Activity':'Object',outside:n.classList.contains('outside'),kind:relative(n.querySelector('.review-kind')),name:relative(name),role:role&&relative(role),icon:relative(icon),width:r.width/scale,height:r.height/scale,ellipsis:getComputedStyle(name).textOverflow,nowrap:getComputedStyle(name).whiteSpace,bg:getComputedStyle(n).backgroundColor,border:getComputedStyle(n).borderColor,who:role?getComputedStyle(icon).backgroundColor:null,stroke:role?getComputedStyle(icon.querySelector('svg')).color:null};
        }));
        assert.ok(rows.some(n=>n.type==='Activity')&&rows.some(n=>n.type==='Object'));
        for(const type of ['Activity','Object'])for(const outside of [false,true])assert.ok(rows.some(n=>n.type===type&&n.outside===outside),`${type} Scope ${outside?'outside':'inside'} fixture`);
        const baseline=rows.find(n=>n.type==='Activity');
        for(const n of rows) {
          for(const label of ['kind','name'])for(const axis of ['x','y'])assert.ok(Math.abs(n[label][axis]-baseline[label][axis])<0.02,`${n.id} ${label}.${axis}`);
          assert.ok(Math.abs(n.height-68)<0.02);assert.ok(Math.abs(n.width-260)<0.02);
          const colors=theme==='light'?(n.outside?(n.type==='Object'?['rgb(233, 238, 235)','rgb(168, 184, 176)']:['rgb(233, 237, 242)','rgb(166, 178, 193)']):(n.type==='Object'?['rgb(228, 244, 235)','rgb(121, 188, 161)']:['rgb(231, 240, 255)','rgb(117, 163, 229)'])):(n.outside?(n.type==='Object'?['rgb(48, 60, 54)','rgb(116, 135, 123)']:['rgb(48, 57, 65)','rgb(113, 128, 141)']):(n.type==='Object'?['rgb(29, 65, 55)','rgb(83, 143, 120)']:['rgb(32, 59, 88)','rgb(86, 132, 183)']));
          assert.deepEqual([n.bg,n.border],colors);
          assert.equal(n.ellipsis,'ellipsis');assert.equal(n.nowrap,'nowrap');
          if(n.role){assert.ok(n.role.y>n.name.y+n.name.h);assert.ok(Math.abs(n.icon.w-28)<0.02);assert.equal(n.stroke,'rgb(255, 255, 255)');}
          else {assert.ok(Math.abs(n.icon.w-23)<0.02);assert.ok(n.height-(n.name.y+n.name.h)>12);}
        }
        results.push({theme,zoom,nodes:rows.length,kind:baseline.kind,name:baseline.name});
        // Stress the same rendered nodes without changing the application's graph data.
        const original=await page.locator('.node-name').allTextContents();
        await page.locator('.node-name').evaluateAll(nodes=>nodes.forEach(n=>n.textContent='非常に長い業務名とObject名の省略表示を検証するための名前'.repeat(4)));
        assert.ok(await page.locator('.node-name').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth>n.clientWidth&&getComputedStyle(n).textOverflow==='ellipsis')));
        await page.locator('.node-name').evaluateAll((nodes,names)=>nodes.forEach((n,i)=>n.textContent=names[i]),original);
        if(process.env.LABEL_SCREENSHOT_DIR)await page.screenshot({path:`${process.env.LABEL_SCREENSHOT_DIR}/${theme}-${zoom}.png`});
        if(zoom==='40%')for(let i=0;i<5;i++)await page.locator('#in').click();
      }
    }
    assert.deepEqual(await page.locator('.node').evaluateAll(nodes=>nodes.map(n=>[n.dataset.node,n.style.left,n.style.top])),positions);
    // Zoom redraws scale SVG coordinates; at restored 100% the paths and labels are identical.
    assert.deepEqual(await page.locator('.edge').evaluateAll(nodes=>nodes.map(n=>[n.dataset.relation,n.getAttribute('d')])),graph);
    for(const width of [393,320]){
      await page.setViewportSize({width,height:852});
      const toolbar=await page.locator('.toolbar').boundingBox();
      assert.ok(toolbar.x>=0&&toolbar.x+toolbar.width<=width,'display option and zoom fit narrow viewport');
      assert.ok(toolbar.height<=66,'two options remain compact beside zoom controls');
    }
    assert.deepEqual(errors,[]);
    return results;
  } finally {await page.close();}
}
