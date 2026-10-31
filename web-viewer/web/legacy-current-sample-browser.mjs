import {readFileSync} from 'node:fs';

// Exercise existing sample sessions and their separate Check attachment.
const markdown=readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8');
export async function useLegacyCurrentSample(page){
 await page.locator('#open-menu-toggle').click();await page.locator('#open-text').click();
 await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();
 await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden&&document.querySelector('#app').dataset.saveState==='saved');
 await page.goto('http://127.0.0.1:4173/LICENSE.txt');
 await page.evaluate(()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
   get.onsuccess=()=>{const s=get.result;if(s.format>=2)s.document.source={kind:'sample'};else s.tabs[0].source={kind:'sample'};store.put(s,'current');};
   tx.oncomplete=()=>{db.close();resolve();};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error);};
  };
 }));
 await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
}
