// Public purchase fixture only. Rebuild the pinned pre-change product and
// capture both real apps at identical viewport/theme/zoom via normal controls.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,extname} from 'node:path';
import {createServer} from 'node:http';
import {openSourceAction} from './source-menu-browser.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='f9a9708e4b9b2992f5572ab4c34cf00c24a7953e',scratch=mkdtempSync(join(tmpdir(),'alder-caption-255-'));
const destination='web/evidence/wiring';mkdirSync(destination,{recursive:true});
const source=readFileSync('../business-design/purchase-request/README.md','utf8'),servers=[];
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
 const archive=execFileSync('git',['archive',base,'web-viewer','business-design/alder','LICENSE'],{maxBuffer:100*1024*1024});
 execFileSync('tar',['-x','-C',scratch],{input:archive});
 symlinkSync(resolve('node_modules'),join(scratch,'web-viewer/node_modules'),'dir');
 execFileSync('npm',['run','build'],{cwd:join(scratch,'web-viewer'),stdio:'pipe'});
 const urls={before:await serve(join(scratch,'web-viewer/dist'),4181),after:await serve(resolve('dist'),4182)};
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
 const evidence=[];
 for(const width of [393,1280])for(const [version,url]of Object.entries(urls)){
  const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'ja-JP'}),page=await context.newPage();
  try{
   await page.goto(url);await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await openSourceAction(page,'open-text');await page.locator('#source-text').fill(source);await page.locator('#source-submit').click();
   await page.locator('.node[data-node="申請者"]').waitFor();
   if(await page.locator('#check-followup-later').isVisible())await page.locator('#check-followup-later').click();
   await page.locator('#theme').click();
   for(const view of ['overview','approval']){
    if(view==='approval')await page.locator('.node[data-node="購入申請を承認する"] .activity-open').press('Enter');
    const focus=view==='overview'?'備品購入を申請する':'購入申請を承認する';
    await page.locator(`.node[data-node="${focus}"]`).click();
    if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    while(parseInt(await page.locator('#zoom').textContent())>53)await page.locator('#out').click();
    await page.locator('#viewport').evaluate(v=>{v.scrollLeft=0;v.scrollTop=0;});
    await page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
    const measured=await page.evaluate(()=>{
     const cards=[...document.querySelectorAll('.node')].map(n=>({id:n.dataset.node,x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:n.offsetWidth,height:n.offsetHeight}));
     const labels=[...document.querySelectorAll('.edge-label')].map(n=>{const b=n.getBBox();return {index:+n.dataset.relation,text:n.textContent,y:+n.getAttribute('y'),x:b.x,top:b.y,width:b.width,height:b.height};});
     return {cards,labels,zoom:document.querySelector('#zoom').textContent};
    });
    if(version==='after'){
     assert.deepEqual(measured.cards.map(n=>n.y).sort((a,b)=>a-b),Array.from({length:measured.cards.length},(_,i)=>40+96*i));
     const overlaps=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.top<b.top+b.height&&b.top<a.top+a.height;
     for(const [i,l]of measured.labels.entries()){
      for(const n of measured.cards)assert.equal(overlaps(l,{...n,top:n.y}),false,'native glyph/card separation');
      for(const other of measured.labels.slice(i+1))assert.equal(overlaps(l,other),false,'native glyph separation');
     }
    }
    const path=`${destination}/real-purchase-${version}-${view}-${width}.png`;
    await page.screenshot({path});evidence.push({version,width,view,path,...measured});
   }
  }finally{await context.close();}
 }
 writeFileSync(`${destination}/source-captions-255.json`,JSON.stringify({base,source:process.env.REVIEW_HEAD||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),evidence},null,2));
 console.log(JSON.stringify({purchaseCaptionComparison:{base,captures:evidence.map(({version,width,view,path,zoom})=>({version,width,view,path,zoom}))}}));
}finally{await browser?.close();for(const s of servers)await new Promise(r=>s.close(r));rmSync(scratch,{recursive:true,force:true});}
