import {initialPositions} from './layout.ts';
import {deploymentContext} from './deployment.ts';
import type {Design} from './graph';
export type Point=[number,number];
export type Tab={key:string;name:string;design:Design;positions:Record<string,Point>;selected?:string;scroll:Point;zoom:number;source?:{kind:'url';url:string}|{kind:'text'}|{kind:'sample'};handle?:FileSystemFileHandle};
export type SampleLayout=Pick<Tab,'positions'|'selected'|'scroll'|'zoom'>;
export type Session={sampleLayout?:SampleLayout;tabs:Tab[];active?:string;dark:boolean;drawer:boolean;width:number;preferWrite?:boolean;dimOutside?:boolean;/** Legacy preference, migrated on restore. */hideOutside?:boolean};
export function reconcile(tab:Tab,design:Design):Tab{
  const ids=new Set(design.graph.nodes.map(n=>n.id)),positions:Record<string,Point>=Object.create(null);
  for(const [id,p] of Object.entries(tab.positions))if(ids.has(id))positions[id]=[...p];
  const missing=design.graph.nodes.filter(n=>!positions[n.id]);
  if(missing.length){
    const initial=initialPositions(design.graph),occupied=Object.values(positions);
    for(const n of missing){
      const p:Point=[...initial[n.id]];
      // Only new cards move. Retained user coordinates are never normalized or
      // re-optimized, including deliberately overlapping manually placed cards.
      while(occupied.some(q=>Math.abs(q[0]-p[0])<280&&Math.abs(q[1]-p[1])<88))p[1]+=180;
      positions[n.id]=p;occupied.push(p);
    }
  }
  return {...tab,design,positions,selected:tab.selected&&ids.has(tab.selected)?tab.selected:undefined};
}
function db():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(deploymentContext(globalThis.location?.pathname??'/').database,1);r.onupgradeneeded=()=>r.result.createObjectStore('session');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function saveSession(value:Session):Promise<void>{const d=await db();try{await new Promise<void>((resolve,reject)=>{const t=d.transaction('session','readwrite');t.objectStore('session').put(value,'current');t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error??Error('Session save aborted'));});}finally{d.close();}}
export async function loadSession():Promise<Session|undefined>{const d=await db();try{return await new Promise<Session|undefined>((resolve,reject)=>{const r=d.transaction('session').objectStore('session').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{d.close();}}
