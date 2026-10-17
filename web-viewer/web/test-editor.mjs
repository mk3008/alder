// The removed editor contract is replaced by readonly/raw-view and source/history contracts.
import assert from 'node:assert/strict';
import {boot,open,text,saved,record,body,changed,source,pause,until} from './readonly-fixture.mjs';
const windows=[];const make=async opts=>{const e=await boot(opts);windows.push(e);return e;};
try{
 const first=await make();await open(first);const initial=await record(first.db);first.$('view-markdown').click();assert.equal(first.$('source-text').readOnly,true);assert.equal(first.$('source-text').value,body);assert.equal(first.$('source-submit').hidden,true);assert.equal(first.$('edit-markdown'),null);assert.equal(first.$('source-close-dialog'),null);assert.equal(first.$('document-recovery'),null);
 first.$('source-text').value=changed;first.$('source-text').dispatchEvent(new first.w.Event('input'));await first.$('source-submit').onclick();await first.$('source-cancel').onclick();assert.deepEqual(await record(first.db),initial,'scripted input/submit cannot mutate a readonly document');first.$('view-markdown').click();assert.equal(first.$('source-text').value,body);await first.$('source-cancel').onclick();
 for(const [kind,fetch] of [['same',async()=>new Response(body)],['changed',async()=>new Response(changed)],['offline',async()=>{throw new TypeError('offline');}],['invalid',async()=>new Response('# invalid')],['html',async()=>new Response('<html>error</html>',{headers:{'content-type':'text/html'}})]]){
  const e=await make({value:initial,fetch});await until(()=>e.requests.length===1);await pause(60);assert.equal(e.$('source-update-notice').hidden,kind!=='changed',kind);assert.deepEqual(await record(e.db),initial);assert.equal(e.$('nodes').querySelector('[data-node="業務設計"]')!==null,true);assert.equal(e.requests[0][1].cache,'no-store');assert.equal(e.requests[0][1].credentials,'omit');
  if(kind==='changed'){
   e.$('source-update-close').click();assert.equal(e.$('source-update-notice').hidden,true);e.$('theme').click();await saved(e);assert.equal(e.$('source-update-notice').hidden,true);e.$('theme').click();await saved(e);
   const again=await make({db:e.db,fetch});await until(()=>!again.$('source-update-notice').hidden);again.$('source-update-refresh').click();await until(()=>again.$('nodes').querySelector('[data-node="業務設計改名"]'));await saved(again);assert.equal(again.$('source-update-notice').hidden,true);assert.equal((await record(again.db)).document.design.markdown,changed);
   // Put the original back for independent startup cases.
   const restore=await make({db:e.db});await restore.$('refresh').onclick();await saved(restore);
  }
 }
 const h=await make();await open(h);await open(h);await open(h,'https://readonly.test/other/design.md');await text(h);await h.$('open-sample').onclick({preventDefault(){}});await saved(h);let snap=await record(h.db);assert.equal(snap.recovery.length,0);assert.deepEqual(snap.urlHistory,[{url:'https://readonly.test/other/design.md',name:'design.md'},{url:source,name:'design.md'}]);assert.ok(snap.urlHistory.every(v=>Object.keys(v).sort().join(',')==='name,url'));assert.deepEqual([...h.$('url-history').querySelectorAll('small')].map(n=>n.textContent),snap.urlHistory.map(v=>v.url),'same basename sources have visible URL labels');
 await h.$('url-history').querySelectorAll('button')[1].onclick();await saved(h);snap=await record(h.db);assert.equal(snap.document.source.url,source);assert.equal(snap.urlHistory.length,2);assert.equal(snap.urlHistory[0].url,source);assert.equal(snap.recovery.length,0);
 h.w.fetch=async()=>{throw Error('offline');};const before=await record(h.db),graph=h.$('nodes').innerHTML;await h.$('url-history').querySelectorAll('button')[1].onclick();assert.equal(h.$('nodes').innerHTML,graph);assert.deepEqual(await record(h.db),before);await h.$('refresh').onclick();assert.equal(h.$('nodes').innerHTML,graph);assert.deepEqual(await record(h.db),before);
 // A late startup response cannot notify about a document the user already replaced.
 let release;const late=await make({db:h.db,fetch:()=>new Promise(resolve=>release=resolve)});await until(()=>!!release);await text(late);release(new Response(changed));await pause(50);assert.equal(late.$('source-update-notice').hidden,true);assert.equal((await record(late.db)).document.source.kind,'text');
 // No URL traffic is introduced for samples, files or pasted text.
 const nonurl=await make();await text(nonurl);const restored=await make({db:nonurl.db});await pause(30);assert.equal(restored.requests.length,0);assert.equal(restored.$('legacy-notice').hidden,true);
 console.log('readonly raw view; startup same/changed/offline/invalid/HTML; dismissal/restart; explicit refresh; URL-only deduplicated history; failure and late-result protection passed');
}finally{windows.forEach(e=>e.close());}
