import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const file=name=>path.join(here,name);
const origin='http://127.0.0.1:8765';
const base=origin+'/work/storage-json/issue-270/';
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE||'playwright');
const summary={status:'incomplete',head:process.env.REVIEW_HEAD||process.env.GITHUB_SHA||null,
  browser:null,origin,cases:[],pageErrors:[],requests:[],measurements:null,
  limitations:['Standalone PoC bounds list to 100 and graph to five nodes; not production Viewer performance',
    'Headless Linux Chrome only; no real Android/iOS or low-memory hardware',
    'Loopback HTTP/CORS, not external HTTPS or authenticated URLs']};
let browser,context,page,cors;
const mark=(name,result,detail={})=>{
  summary.cases.push({name,result,...detail});
  console.log(result.toUpperCase()+' '+name);
};
const test=async(name,fn)=>{
  const t=Date.now();
  try{await fn();mark(name,'passed',{durationMs:Date.now()-t});}
  catch(e){mark(name,'failed',{durationMs:Date.now()-t,error:String(e?.stack||e)});throw e;}
};
const metrics=async type=>page.evaluate(type=>{
  try{return JSON.parse(document.querySelector('#metrics').textContent).metrics.filter(v=>v.type===type);}
  catch{return [];}
},type);
const act=async(type,fn)=>{
  const before=(await metrics(type)).length;
  await fn();
  await page.waitForFunction(({type,before})=>{
    try{return JSON.parse(document.querySelector('#metrics').textContent).metrics.filter(v=>v.type===type).length>before;}
    catch{return false;}
  },{type,before},{timeout:45000});
  return (await metrics(type)).at(-1);
};
const local=name=>act('load',()=>page.locator('#file').setInputFiles(file(name)));
const readUrl=url=>act('load',async()=>{
  await page.locator('#url').fill(url);
  await page.locator('#url-load').click();
});
const title=()=>page.locator('#title').textContent();

try{
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
  summary.browser=browser.version();
  context=await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:900}});
  page=await context.newPage();
  page.on('pageerror',e=>summary.pageErrors.push(e.message));
  page.on('request',r=>summary.requests.push({method:r.method(),url:r.url()}));
  await page.goto(base+'index.html',{waitUntil:'load'});

  await test('embedded sample and typed BD/Check views',async()=>{
    assert.equal((await act('load',()=>page.locator('#sample').click())).route,'text');
    assert.match(await page.locator('#summary').textContent(),/5 Activity \/ 7 Object \/ 4 Findings/);
    assert.equal(await page.locator('#graph rect').count(),5);
    const checkId=await page.locator('#document-select').evaluate(e=>[...e.options].find(o=>o.textContent.includes('checkItems'))?.value);
    assert.ok(checkId);
    await page.locator('#document-select').selectOption(checkId);
    assert.match(await page.locator('#summary').textContent(),/6 Check \/ 4 保証 \/ 4 比較表/);
    await page.locator('#view-select').selectOption('guarantees');
    assert.equal(await page.locator('#entities button').count(),4);
    await page.locator('#view-select').selectOption('examples');
    assert.equal(await page.locator('#entities button').count(),4);
    const bdId=await page.locator('#document-select').evaluate(e=>e.options[0].value);
    await page.locator('#document-select').selectOption(bdId);
    await page.locator('#view-select').selectOption('activities');
  });

  await test('over-2-MiB local File, no upload, bounded rendering',async()=>{
    const nonGetBefore=summary.requests.filter(r=>r.method!=='GET').length;
    const m=await local('.generated/activities-1000.json');
    assert.equal(m.route,'file');
    assert.ok(m.bytes>2*1024*1024);
    assert.match(await page.locator('#summary').textContent(),/1000 Activity/);
    assert.equal(await page.locator('#entities button').count(),100);
    assert.equal(summary.requests.filter(r=>r.method!=='GET').length,nonGetBefore);
  });

  await test('local File remains available with URL 2 MiB simulation enabled',async()=>{
    await page.locator('#legacy-limit').check();
    assert.ok((await local('.generated/activities-1000.json')).bytes>2*1024*1024);
  });

  await test('local 17 MiB file exceeds PoC budget; last display survives',async()=>{
    const previous=await title();
    const e=await act('error',()=>page.locator('#file').setInputFiles(file('.generated/over-budget.json')));
    assert.match(e.message,/PoC byte budget exceeded before file\.text/);
    assert.equal(await title(),previous);
  });

  await test('over-2-MiB URL load without legacy 2 MiB limit',async()=>{
    await page.locator('#legacy-limit').uncheck();
    const m=await readUrl(base+'.generated/activities-1000.json');
    assert.equal(m.route,'url');
    assert.ok(m.bytes>2*1024*1024);
    assert.match(await page.locator('#summary').textContent(),/1000 Activity/);
  });

  await test('URL legacy 2 MiB limit refuses and preserves display',async()=>{
    await page.locator('#legacy-limit').check();
    const previous=await title();
    const e=await act('error',()=>page.locator('#url-load').click());
    assert.match(e.message,/Content-Length limit|2MiB/);
    assert.equal(await title(),previous);
    await page.locator('#legacy-limit').uncheck();
  });

  const fixture=fs.readFileSync(file('.generated/activities-5.json'));
  cors=http.createServer((req,res)=>{
    if(!['/allowed.json','/denied.json','/slow.json'].includes(req.url)){res.writeHead(404).end();return;}
    if(req.url==='/allowed.json')res.setHeader('Access-Control-Allow-Origin',origin);
    res.setHeader('Content-Type','application/json');
    res.setHeader('Content-Length',fixture.length);
    res.setHeader('Cache-Control','no-store');
    if(req.url==='/slow.json'){setTimeout(()=>res.end(fixture),4000);return;}
    res.end(fixture);
  });
  await new Promise((ok,fail)=>{cors.once('error',fail);cors.listen(0,'127.0.0.1',ok);});
  const extra='http://127.0.0.1:'+cors.address().port;

  await test('real browser cross-origin CORS allow/deny',async()=>{
    assert.equal((await readUrl(extra+'/allowed.json')).route,'url');
    const previous=await title();
    const e=await act('error',async()=>{
      await page.locator('#url').fill(extra+'/denied.json');
      await page.locator('#url-load').click();
    });
    assert.match(e.message,/fetch|network|CORS/i);
    assert.equal(await title(),previous);
  });

  await test('pasted text above 2 MiB legacy cap is refused',async()=>{
    await page.locator('#legacy-limit').check();
    const previous=await title();
    await page.locator('#input').evaluate(e=>{
      const pkg=JSON.parse(document.querySelector('#sample-data').textContent);
      pkg.documents[0].activities[0].why='x'.repeat(2*1024*1024);
      e.value=JSON.stringify(pkg);
    });
    const e=await act('error',()=>page.locator('#load-text').click());
    assert.match(e.message,/2MiB/);
    assert.equal(await title(),previous);
    await page.locator('#legacy-limit').uncheck();
  });

  await test('IndexedDB saves large file and restores after reload',async()=>{
    assert.ok((await local('.generated/activities-1000.json')).bytes>2*1024*1024);
    const saved=await act('save-db',()=>page.locator('#save-db').click());
    assert.ok(saved.bytes>2*1024*1024);
    await page.reload({waitUntil:'load'});
    assert.equal(await title(),'文書');
    const m=await act('load',()=>page.locator('#restore').click());
    assert.equal(m.route,'restore');
    assert.ok(m.bytes>2*1024*1024);
    assert.match(await page.locator('#summary').textContent(),/1000 Activity/);
  });

  await test('download preserves typed ID and document membership',async()=>{
    const [download]=await Promise.all([
      page.waitForEvent('download',{timeout:20000}),
      page.locator('#download').click()
    ]);
    assert.equal(download.suggestedFilename(),'alder-270.json');
    const exported=JSON.parse(fs.readFileSync(await download.path(),'utf8'));
    const source=JSON.parse(fs.readFileSync(file('.generated/activities-1000.json'),'utf8'));
    assert.deepEqual(exported.documents.map(x=>x.id),source.documents.map(x=>x.id));
    assert.deepEqual(exported.documents[0].activities.map(x=>x.id),source.documents[0].activities.map(x=>x.id));
    assert.equal(exported.documents[0].activities.length,1000);
    assert.equal(exported.formatVersion,'0.3-poc');
    assert.ok(!Object.hasOwn(exported,'archives'));
    assert.equal(exported.documents.length,2);
    assert.ok(exported.externalDocuments.every(d=>Object.keys(d).sort().join(',')==='activities,id,kind,revision'));
    assert.deepEqual(exported,source);
  });

  await test('bad version, duplicate ID, stale Check and malformed JSON keep drawing',async()=>{
    const previous=await title();
    const row=await act('failure-tests',()=>page.locator('#failure-tests').click());
    assert.equal(row.cases.length,3);
    assert.ok(row.cases.every(x=>x.rejected&&x.displayPreserved));
    assert.equal(await title(),previous);
    const e=await act('error',async()=>{
      await page.locator('#input').fill('{broken');
      await page.locator('#load-text').click();
    });
    assert.ok(e.message);
    assert.equal(await title(),previous);
  });

  await test('in-flight URL cancellation retains last display',async()=>{
    const previous=await title();
    const slow=extra+'/slow.json';
    await page.locator('#url').fill(slow);
    const pending=page.waitForRequest(r=>r.url()===slow,{timeout:10000});
    await page.locator('#url-load').click();
    await pending;
    await act('cancel',()=>page.locator('#cancel').click());
    assert.match(await page.locator('#status').textContent(),/中止しました/);
    assert.equal(await title(),previous);
    await page.waitForTimeout(250);
    assert.equal(await title(),previous);
  });

  await test('old BD and Check Markdown parser remain operational',async()=>{
    await page.locator('#legacy-file').setInputFiles(file('fixtures/legacy.md'));
    await page.waitForFunction(()=>document.querySelector('#legacy-result').textContent.includes('Graph v1'),null,{timeout:15000});
    assert.match(await page.locator('#legacy-result').textContent(),/旧MD読込成功/);
    await act('load',()=>page.locator('#sample').click());
    await page.locator('#checks-file').setInputFiles(path.join(here,'../../../docs/examples/purchase-check-review.ja.md'));
    await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('現行Check parser成功'),null,{timeout:15000});
  });

  assert.ok(summary.requests.every(r=>r.method==='GET'),'unexpected upload / non-GET request');
  assert.deepEqual(summary.pageErrors,[],'uncaught browser error');
  summary.measurements=await page.locator('#metrics').evaluate(e=>JSON.parse(e.textContent));
  summary.heapSnapshot=await page.evaluate(()=>performance.memory?
    {usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize}:null);
  summary.status='passed';
}catch(e){
  summary.status='failed';
  summary.failure=String(e?.stack||e);
  process.exitCode=1;
}finally{
  fs.mkdirSync(file('.generated'),{recursive:true});
  if(page)try{await page.screenshot({path:file('.generated/browser-ci.png'),fullPage:true,timeout:15000});}
  catch(e){summary.screenshotError=String(e);}
  if(page&&!summary.measurements)try{summary.measurements=await page.locator('#metrics').evaluate(e=>JSON.parse(e.textContent));}catch{}
  fs.writeFileSync(file('.generated/browser-ci-results.json'),JSON.stringify(summary,null,2)+'\n');
  if(cors)await new Promise(ok=>cors.close(ok));
  if(context)await context.close();
  if(browser)await browser.close();
  console.log(JSON.stringify({status:summary.status,browser:summary.browser,
    cases:summary.cases.length,passed:summary.cases.filter(x=>x.result==='passed').length,
    failure:summary.failure||null}));
}
