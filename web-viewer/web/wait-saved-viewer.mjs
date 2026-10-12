// Read only after the transaction completes. A stale/mismatched snapshot stays
// false and fails the bounded wait; it never changes expected state or storage.
export function savedViewerMatches({expected}){
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session','readonly'),get=tx.objectStore('session').get('current');let result=false;
   get.onsuccess=()=>{const s=get.result,t=s?.tabs?.find(t=>t.key===s.active);if(!t)return;const p=t.positions,want=expected.positions;const positions=!!p&&Object.keys(p).length===Object.keys(want).length&&Object.entries(want).every(([id,point])=>Array.isArray(p[id])&&p[id].length===2&&p[id].every((v,i)=>v===point[i]));const hidden=[...(t.hiddenNodes??[])].sort(),wantHidden=[...expected.hiddenNodes].sort();if(positions&&JSON.stringify(hidden)===JSON.stringify(wantHidden)&&(t.selected??null)===expected.selected&&t.zoom===expected.zoom&&s.dark===expected.dark&&s.preferWrite===expected.preferWrite)result=s;};
   tx.oncomplete=()=>{db.close();resolve(result);};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??Error('Saved state read failed'));};
  };
 });
}
export async function waitSavedViewer(page,expected){const handle=await page.waitForFunction(savedViewerMatches,{expected},{timeout:5000,polling:50});try{return await handle.jsonValue();}finally{await handle.dispose();}}
