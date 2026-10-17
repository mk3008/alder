import {readFileSync} from 'node:fs';
import {readSessionInPage} from './wait-saved-viewer.mjs';
// Historical no-Group sample for fixed geometry/routing regressions. Import via
// the public input, then seed its historical sample identity only while the app
// is disposed. The ordinary restore path reads the fixture; no product hooks.
const markdown=readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8');
export async function useUngroupedSample(page){
 const saved=await page.evaluate(readSessionInPage);
 if(saved?.tabs?.[0]?.design?.markdown===markdown)return;
 await page.locator('#open-menu-toggle').click();await page.locator('#open-text').click();
 await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();
 await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden&&document.querySelector('#app').dataset.saveState==='saved');
 // The mobile Markdown drawer can cover the toolbar. Keep its initial state
 // while using the same unobstructed settings controls as an ordinary reader.
 const drawerOpen=await page.locator('#formattedMarkdownDrawer').isVisible();
 if(drawerOpen)await page.locator('#drawer').click();
 await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.locator('#display-settings-toggle').click();
 if(drawerOpen)await page.locator('#drawer').click();
 await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
 await page.goto('http://127.0.0.1:4173/LICENSE.txt');
 await page.evaluate(()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('alder-web-viewer',1);
  request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
   get.onsuccess=()=>{const s=get.result;if(s.format>=2)s.document.source={kind:'sample'};else s.tabs[0].source={kind:'sample'};store.put(s,'current');};
   tx.oncomplete=()=>{db.close();resolve();};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error);};
  };
 }));
 await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
}
