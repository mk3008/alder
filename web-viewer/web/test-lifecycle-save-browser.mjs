// Local isolated Chromium contexts and synthetic documents only.
// Native reload/navigation are tested; abrupt OS termination is not guaranteed.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {waitForExactRead,readSessionInPage} from './wait-saved-viewer.mjs';
const markdown=`# Synthetic lifecycle\n\n# Activity Synthetic task\n\n## Scope\ntrue\n\n## Why\nVerify persistence.\n\n## When\nDuring isolated tests.\n\n## Who\nSynthetic operator\n\n## Where\nLocal test\n\n## How\n\n### Input\n(none)\n\n### Procedure\n1. Preserve this document.\n\n### Output\n(none)\n\n## Result\nDocument retained.\n`;
export async function verifyLifecycleSave(browser,{url='http://127.0.0.1:4173/',expectLoss=false}={}){
 const results=[];
 for(const committed of [true,false])for(const kind of ['reload','navigation'])for(let run=1;run<=(committed?1:3);run++){
  const context=await browser.newContext();
  try{
   const page=await context.newPage();let beforeUnloadPrompts=0;
   // This diagnostic explicitly chooses to leave, even if unsaved-work protection
   // warns. Dismissing/remaining and clean departures are tested in save-state.
   page.on('dialog',async dialog=>{assert.equal(dialog.type(),'beforeunload');beforeUnloadPrompts++;await dialog.accept();});
   page.setDefaultTimeout(5000);page.setDefaultNavigationTimeout(10000);await page.goto(url);await page.waitForFunction(()=>!document.getElementById('open-text').disabled);
   // Native storage must have committed the empty baseline before this case.
   await page.locator('#theme').click();
   await waitForExactRead(()=>page.evaluate(readSessionInPage),{dark:true,tabs:0},{project:value=>({dark:value?.dark,tabs:value?.tabs?.length})});
   await page.locator('#open-text').click();await page.locator('#source-text').fill(markdown);
   // Committed reload is a correctness gate. Immediate departure only observes
   // best-effort durability: navigation may end the asynchronous IDB operation.
   if(committed){await page.locator('#source-submit').click();await waitForExactRead(()=>page.evaluate(readSessionInPage),markdown,{project:value=>value?.tabs?.[0]?.design?.markdown});}
   // In immediate cases, submit and leave before the 180ms debounce.
   await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.evaluate(async ({kind,committed})=>{if(!committed)await document.getElementById('source-submit').onclick();if(kind==='reload')location.reload();else location.href='about:blank';},{kind,committed})]);
   if(kind==='navigation')await page.goto(url);await page.waitForFunction(()=>!document.getElementById('open-text').disabled);
   const observation=await page.evaluate(()=>({tabs:document.querySelectorAll('.tab').length,text:document.getElementById('detail').textContent,status:document.getElementById('status-text').textContent}));
   const retained=observation.tabs===1&&observation.text.includes('Synthetic lifecycle');results.push({kind,run,committed,retained,tabs:observation.tabs,status:observation.status,beforeUnloadPrompts,confirmationPolicy:'accept and leave'});
  }finally{await context.close();}
 }
 const result={browser:browser.version(),model:'isolated local Chromium, native reload/navigation',expectLoss,results,immediateDeparture:{retained:results.filter(r=>!r.committed&&r.retained).length,lost:results.filter(r=>!r.committed&&!r.retained).length,guaranteed:false}};console.log('LIFECYCLE_SAVE '+JSON.stringify(result));
 assert.ok(results.filter(r=>r.committed).every(r=>r.retained),'committed document should survive reload/navigation');
 if(expectLoss)assert.ok(results.some(r=>!r.committed&&!r.retained),'baseline diagnostic should observe immediate-departure loss');
 return result;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const {createRequire}=await import('node:module'),require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
 try{await verifyLifecycleSave(browser,{url:process.env.VIEWER_URL||'http://127.0.0.1:4173/',expectLoss:process.env.EXPECT_LOSS==='1'});}finally{await browser.close();}
}
