// Public purchase fixture only. Rebuild the pinned pre-change product and
// capture both real apps at identical viewport/theme/zoom via normal controls.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,extname} from 'node:path';
import {createServer} from 'node:http';
import {matrixPlan} from '../src/matrix-layout.ts';
import {activityDesign} from '../src/activities.ts';
import {parseDesign} from '../src/graph.ts';
import {assertCompactStaircase} from './test-document-order-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='6809092184c98eef8ef1920ff6b8a8e7745bf8a1',scratch=mkdtempSync(join(tmpdir(),'alder-caption-255-'));
const destination='web/evidence/wiring';mkdirSync(destination,{recursive:true});
const sourceRevision='db332a57848df5368e09fe1cf50aa7c7faf5fb5c';
try{execFileSync('git',['cat-file','-e',sourceRevision],{stdio:'pipe'});}catch{execFileSync('git',['fetch','--depth=1','origin',sourceRevision],{stdio:'pipe'});}
const source=execFileSync('git',['show',sourceRevision+':business-design/purchase-request/README.md'],{encoding:'utf8'}),servers=[];
const fixtures=[{name:'purchase',source,focus:'備品購入を申請する',detail:'購入申請を承認する',badges:true},{name:'alder',source:readFileSync('../business-design/alder/README.md','utf8'),focus:'業務設計',detail:'業務設計',badges:false}];
let browser;
async function serve(root,port){
 const server=createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),file=resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.txt':'text/plain'})[extname(file)]||'application/octet-stream');res.end(readFileSync(file));
 }catch{res.writeHead(404).end();}});
 await new Promise(r=>server.listen(port,'127.0.0.1',r));servers.push(server);return `http://127.0.0.1:${port}/`;
}
try{
 try{execFileSync('git',['cat-file','-e',base],{stdio:'pipe'});}catch{execFileSync('git',['fetch','--depth=1','origin',base],{stdio:'pipe'});}
 const archive=execFileSync('git',['archive',base,'web-viewer','business-design/alder','LICENSE'],{cwd:resolve('..'),maxBuffer:100*1024*1024});
 execFileSync('tar',['-x','-C',scratch],{input:archive});
 symlinkSync(resolve('node_modules'),join(scratch,'web-viewer/node_modules'),'dir');
 execFileSync('npm',['run','build'],{cwd:join(scratch,'web-viewer'),stdio:'pipe'});
 const urls={before:await serve(join(scratch,'web-viewer/dist'),4181),after:await serve(resolve('dist'),4182)};
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
 const evidence=[];
 for(const fixture of fixtures)for(const width of [393,1280])for(const [version,url]of Object.entries(urls)){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'ja-JP'}),page=await context.newPage();
  try{
   await page.goto(url);await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await openSourceAction(page,'open-text');await page.locator('#source-text').fill(fixture.source);await page.locator('#source-submit').click();
   await page.locator(`.node[data-node="${fixture.name==='purchase'?'申請者':'Alder: 業務ナレッジ'}"]`).waitFor();
   if(await page.locator('#check-followup-later').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('html').getAttribute('data-theme')!=='light')await page.locator('#theme').click();
   for(const view of ['overview','detail']){
    if(view==='detail')await page.locator(`.node[data-node="${fixture.detail}"] .activity-open`).press('Enter');
    const focus=view==='overview'?fixture.focus:fixture.detail;
    await page.locator(`.node[data-node="${focus}"]`).click();
    if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    while(parseInt(await page.locator('#zoom').textContent())>53)await page.locator('#out').click();
    await page.locator('#viewport').evaluate(v=>{v.scrollLeft=0;v.scrollTop=0;});
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
    const measured=await page.evaluate(()=>{
     const cards=[...document.querySelectorAll('.node')].map(n=>({id:n.dataset.node,x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:n.offsetWidth,height:n.offsetHeight,who:n.querySelector('small')?.textContent,roleColor:n.querySelector('.who-badge')?getComputedStyle(n.querySelector('.who-badge')).backgroundColor:undefined}));
     const labels=[...document.querySelectorAll('.edge-label')].map(n=>{const b=n.getBBox();return {index:+n.dataset.relation,text:n.textContent,anchor:+n.getAttribute('x'),y:+n.getAttribute('y'),x:b.x,top:b.y,width:b.width,height:b.height};});
     const badges=[...document.querySelectorAll('.finding-badges')].map(n=>{const b=n.getBoundingClientRect();return {x:b.x,top:b.y,width:b.width,height:b.height};});
     const glyphs=[...document.querySelectorAll('.edge-label')].map(n=>{const b=n.getBoundingClientRect();return {x:b.x,top:b.y,width:b.width,height:b.height};});
     return {cards,labels,badges,glyphs,zoom:document.querySelector('#zoom').textContent};
    });
    if(version==='after'){
     const d=activityDesign(parseDesign(fixture.source),view==='overview'?undefined:fixture.detail),plan=matrixPlan(d.graph,d.activityOrder,view==='overview'?undefined:fixture.detail);
     for(const l of measured.labels){const r=d.graph.relations[l.index],n=measured.cards.find(n=>n.id===r.from);assert.equal(l.text,r.label);if(!plan.wires[l.index].returning){assert.equal(l.anchor,n.x+40.5,'normal captions share the native source indent');assert.equal(l.y,n.y+82+22*plan.wires[l.index].captionLane,'normal captions stack vertically');}}
     const expected={'申請者':'rgb(139, 92, 246)','承認者':'rgb(194, 65, 12)','購買担当者':'rgb(0, 133, 118)'};
     if(fixture.name==='purchase')for(const n of measured.cards.filter(n=>n.who))assert.equal(n.roleColor,expected[n.who],'shared role colors in real overview/detail');
     if(view==='overview')assertCompactStaircase(Object.fromEntries(measured.cards.map(n=>[n.id,[n.x,n.y]])),parseDesign(fixture.source));
     const overlaps=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.top<b.top+b.height&&b.top<a.top+a.height;
     if(fixture.badges)assert.ok(measured.badges.length>0,'approved Findings visible');for(const l of measured.glyphs)for(const b of measured.badges)assert.equal(overlaps(l,b),false,'native captions do not overlap badges');
     for(const [i,l]of measured.labels.entries()){
      for(const n of measured.cards)assert.equal(overlaps(l,{...n,top:n.y}),false,'native glyph/card separation');
      for(const other of measured.labels.slice(i+1))assert.equal(overlaps(l,other),false,'native glyph separation');
     }
    }
    const path=`${destination}/real-${fixture.name}-${version}-${view}-${width}.png`;
    await page.screenshot({path});evidence.push({fixture:fixture.name,version,width,view,path,...measured});
   }
  }finally{await context.close();}
 }
 writeFileSync(`${destination}/source-captions-255.json`,JSON.stringify({base,sourceRevision,source:process.env.REVIEW_HEAD||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),evidence},null,2));
 console.log(JSON.stringify({purchaseCaptionComparison:{base,captures:evidence.map(({fixture,version,width,view,path,zoom})=>({fixture,version,width,view,path,zoom}))}}));
}finally{await browser?.close();for(const s of servers)await new Promise(r=>s.close(r));rmSync(scratch,{recursive:true,force:true});}
