// Read model for document-retention regressions. These are documents, not graph
// tabs: the actual tab strip must still contain exactly one overall view here.
export function documentControls(w){
 const overall=w.document.querySelector('.tab:not([data-group])');
 const all=[...w.document.querySelectorAll('#recovery-documents [data-document-key]')];
 if(overall)all.push(overall);
 const latest=new Map();for(const e of all)latest.set(e.dataset.documentKey??e.dataset.key,e);
 const order=w.__testDocumentOrder??=[];for(const key of latest.keys())if(!order.includes(key))order.push(key);
 return [...latest].sort((a,b)=>order.indexOf(a[0])-order.indexOf(b[0])).map(([key,e])=>{e.dataset.key=key;return e;});
}
/** Serialized into each isolated test page; original storage is never mutated. */
export function readDocumentRecord(database='alder-web-viewer'){
 return new Promise((resolve,reject)=>{const request=indexedDB.open(database,1);request.onupgradeneeded=()=>request.result.createObjectStore('session');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session'),store=tx.objectStore('session'),read=store.get('current'),generation=store.get('generation');tx.oncomplete=()=>{db.close();let current=read.result;
 if(current?.format===2){const {format:_format,document,views,recovery,...settings}=current;const list=[...recovery];if(document)list.push({...document,...views.find(v=>v.group===undefined)});const latest=new Map(list.map(d=>[d.key,{...d,hiddenNodes:d.hiddenNodes??[]}]));const order=globalThis.__testDocumentOrder??=[];for(const key of latest.keys())if(!order.includes(key))order.push(key);current={...settings,documents:[...latest.values()].sort((a,b)=>order.indexOf(a.key)-order.indexOf(b.key))};}
 else if(current){const {tabs,...settings}=current;current={...settings,documents:tabs};}
 resolve({current,generation:generation.result});};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??Error('Read aborted'));};};});
}
/** Explicit Group fixture; does not change any Activity, Object or I/O. */
export function withTestGroups(markdown,groups){
 const start=markdown.indexOf('\n# ',markdown.indexOf('\n'));
 if(start<0)throw Error('Fixture needs source entities');
 const preamble=markdown.slice(0,start).replace(/\n## Groups[\s\S]*$/,'');
 return preamble+'\n\n## Groups\n\n'+groups.map(([name,activities])=>'### Group '+name+'\n\n'+activities.map(id=>'- Activity '+id).join('\n')).join('\n\n')+'\n'+markdown.slice(start);
}
