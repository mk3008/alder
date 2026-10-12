import {deploymentContext} from './deployment.ts';
import type {Design} from './graph';
export type Point=[number,number];
export type Tab={key:string;name:string;design:Design;positions:Record<string,Point>;selected?:string;scroll:Point;zoom:number;source?:{kind:'url';url:string}|{kind:'text'}|{kind:'sample'};handle?:FileSystemFileHandle};
export type Session={tabs:Tab[];active?:string;dark:boolean;drawer:boolean;width:number;preferWrite?:boolean;hideOutside?:boolean};
export function reconcile(tab:Tab,design:Design):Tab{
  const ids=new Set(design.graph.nodes.map(n=>n.id)),positions:Record<string,Point>=Object.create(null);
  for(const [id,p] of Object.entries(tab.positions))if(ids.has(id))positions[id]=[...p];
  const occupied=Object.values(positions);
  for(const n of design.graph.nodes)if(!positions[n.id]){
    let i=0,p:Point;
    do{p=[40+(i%4)*320,40+Math.floor(i/4)*140];i++;}while(occupied.some(q=>Math.abs(q[0]-p[0])<280&&Math.abs(q[1]-p[1])<88));
    positions[n.id]=p;occupied.push(p);
  }
  return {...tab,design,positions,selected:tab.selected&&ids.has(tab.selected)?tab.selected:undefined};
}
function db():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const r=indexedDB.open(deploymentContext(globalThis.location?.pathname??'/').database,1);r.onupgradeneeded=()=>r.result.createObjectStore('session');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function saveSession(value:Session):Promise<void>{const d=await db();try{await new Promise<void>((resolve,reject)=>{const t=d.transaction('session','readwrite');t.objectStore('session').put(value,'current');t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);});}finally{d.close();}}
export async function loadSession():Promise<Session|undefined>{const d=await db();try{return await new Promise<Session|undefined>((resolve,reject)=>{const r=d.transaction('session').objectStore('session').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}finally{d.close();}}
