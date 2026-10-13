import {initialPositions} from './layout.ts';
import {deploymentContext} from './deployment.ts';
import type {Design} from './graph';
export type Point=[number,number];
/** Camera-only padding/origin in world units. Stored node coordinates never change. */
export type Tab={key:string;name:string;design:Design;positions:Record<string,Point>;selected?:string;hiddenNodes?:string[];showExceptions?:boolean;selectedEdgesOnly?:boolean;viewInset?:Point;canvasOrigin?:Point;scroll:Point;zoom:number;source?:{kind:'url';url:string}|{kind:'text'}|{kind:'sample'};handle?:FileSystemFileHandle};
export type SampleLayout=Pick<Tab,'positions'|'selected'|'scroll'|'zoom'|'hiddenNodes'|'showExceptions'|'selectedEdgesOnly'|'viewInset'|'canvasOrigin'>;
export type ScopeOutside='show'|'hide';
export type Session={sampleLayout?:SampleLayout;tabs:Tab[];active?:string;dark:boolean;drawer:boolean;nodeDrawer?:boolean;width:number;preferWrite?:boolean};
export function reconcile(tab:Tab,design:Design):Tab{
  const ids=new Set(design.graph.nodes.map(n=>n.id)),positions:Record<string,Point>=Object.create(null);
  for(const [id,p] of Object.entries(tab.positions))if(ids.has(id))positions[id]=[...p];
  const missing=design.graph.nodes.filter(n=>!positions[n.id]);
  if(missing.length){
    const initial=initialPositions(design.graph,design.activityOrder),occupied=Object.values(positions);
    for(const n of missing){
      const p:Point=[...initial[n.id]];
      // Only new cards move. Retained user coordinates are never normalized or
      // re-optimized, including deliberately overlapping manually placed cards.
      while(occupied.some(q=>Math.abs(q[0]-p[0])<280&&Math.abs(q[1]-p[1])<88))p[1]+=180;
      positions[n.id]=p;occupied.push(p);
    }
  }
  return {...tab,design,positions,hiddenNodes:tab.hiddenNodes?.filter(id=>ids.has(id)),selected:tab.selected&&ids.has(tab.selected)?tab.selected:undefined};
}
function db():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(deploymentContext(globalThis.location?.pathname??'/').database,1);r.onupgradeneeded=()=>r.result.createObjectStore('session');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
/** A stale window must keep its in-memory work without replacing newer storage. */
export class SessionConflictError extends Error{constructor(){super('Session was saved by another window');this.name='SessionConflictError';}}
let generation:number|undefined;
function savedGeneration(value:unknown):number{if(value===undefined)return 0;if(typeof value!=='number'||!Number.isSafeInteger(value)||value<0)throw Error('Invalid session generation');return value;}
export async function saveSession(value:Session):Promise<void>{
  // Loading establishes which committed snapshot this window is editing.
  const expected=generation;if(expected===undefined)throw Error('Session has not been loaded');
  const d=await db();try{await new Promise<void>((resolve,reject)=>{
    const t=d.transaction('session','readwrite'),store=t.objectStore('session'),read=store.get('generation');
    let failure:unknown,next:number;
    read.onsuccess=()=>{try{
      if(savedGeneration(read.result)!==expected)throw new SessionConflictError();
      next=expected+1;if(!Number.isSafeInteger(next))throw Error('Session generation exhausted');
      // The comparison and both writes share one serialized readwrite transaction.
      store.put(value,'current');store.put(next,'generation');
    }catch(error){failure=error;t.abort();}};
    t.oncomplete=()=>{generation=next;resolve();};
    // Aborted requests can bubble an error before the transaction has an error.
    t.onerror=()=>reject(failure??t.error??Error('Session save failed'));t.onabort=()=>reject(failure??t.error??Error('Session save aborted'));
  });}finally{d.close();}
}
/** Read-only compatibility shape; removed display modes never enter live Session. */
type StoredSession=Session&{scopeOutside?:ScopeOutside|'dim';dimOutside?:boolean;hideOutside?:boolean};
export async function loadSession():Promise<StoredSession|undefined>{
  generation=undefined;
  const d=await db();try{return await new Promise<StoredSession|undefined>((resolve,reject)=>{
    const t=d.transaction('session'),store=t.objectStore('session'),read=store.get('current'),version=store.get('generation');
    // Both values come from the same committed snapshot; legacy records stay untouched.
    t.oncomplete=()=>{try{generation=savedGeneration(version.result);resolve(read.result);}catch(error){reject(error);}};
    t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error??Error('Session load aborted'));
  });}finally{d.close();}
}
