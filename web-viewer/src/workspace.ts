import {reconcile,type Tab,type Session} from './session.ts';
import {activityDesign} from './activities.ts';
export type DocumentState=Pick<Tab,'key'|'name'|'design'|'checks'|'source'|'draft'|'edited'|'handle'>;
export type ViewState=Omit<Tab,keyof DocumentState>&{key:string;activity?:string};
export type URLVisit={url:string;name:string};
export type WorkspaceSnapshot=Omit<Session,'tabs'>&{urlHistory?:URLVisit[];format:3;document?:DocumentState;views:ViewState[];recovery:Tab[];legacyViews?:{documentKey?:string;views:unknown[];active?:string}};
/** Live tabs expose the current document through non-enumerable accessors.
 * The stored format contains one document and document-free views only. */
export type Workspace=Session&{urlHistory?:URLVisit[];document?:DocumentState;recovery:Tab[];legacyViews?:{documentKey?:string;views:unknown[];active?:string}};
const documents=new WeakMap<Tab,DocumentState>();
export function documentForView(tab:Tab){return documents.get(tab);}
const documentFields=['design','checks','source','draft','edited','handle'] as const;
export function documentOf(tab:Tab):DocumentState{return {key:tab.key,name:tab.name,...Object.fromEntries(documentFields.map(k=>[k,tab[k]]))} as DocumentState;}
function viewOf(tab:Tab):ViewState{const {key,positions,selected,hiddenNodes,showExceptions,selectedEdgesOnly,viewInset,canvasOrigin,scroll,zoom}=tab;return {key,positions,selected,hiddenNodes,showExceptions,selectedEdgesOnly,viewInset,canvasOrigin,scroll,zoom,...('activity' in tab?{activity:(tab as Tab&{activity?:string}).activity}:{})};}
export function bindView(doc:DocumentState,view:ViewState):Tab{
 const tab=view as unknown as Tab;documents.set(tab,doc);
 Object.defineProperty(tab,'name',{configurable:true,get:()=>view.activity===undefined?'全体図':doc.design.graph.nodes.find(n=>n.id===view.activity)?.name??view.activity});
 for(const field of documentFields)Object.defineProperty(tab,field,{configurable:true,get:()=>doc[field],set:value=>{(doc as Record<string,unknown>)[field]=value;}});
 return tab;
}
export function viewActivity(tab:Tab){return (tab as Tab&{activity?:string}).activity;}
export function viewDesign(tab:Tab){return activityDesign(tab.design,viewActivity(tab));}
function reconcileView(tab:Tab){
 const design=viewDesign(tab),result=reconcile({...tab},design);
 // Keep source visibility IDs when reconciling a projected detail.
 if(tab.hiddenNodes!==undefined){const valid=new Set([...tab.design.graph.nodes,...design.graph.nodes].map(n=>n.id));result.hiddenNodes=tab.hiddenNodes.filter(id=>valid.has(id));}
 return result;
}
export function createWorkspace(base:Session,recovery:Tab[]=[],doc?:DocumentState,views?:ViewState[]):Workspace{
 const document=doc??(base.tabs[0]?documentOf(base.tabs[0]):undefined);
 const tabs=document?(views??[base.tabs[0]?viewOf(base.tabs[0]):{key:document.key,positions:{},scroll:[0,0],zoom:1}]).map(v=>{
  const tab=bindView(document,v);Object.assign(v,viewOf(reconcileView(tab)));return tab;
 }):[];
 const {dark,drawer,width,preferWrite,nodeDrawer,sampleLayout}=base;return {dark,drawer,width,preferWrite,nodeDrawer,sampleLayout,document,tabs,recovery,urlHistory:(base as Workspace).urlHistory??[...(document?.source?.kind==='url'?[{url:document.source.url,name:document.name}]:[]),...recovery.filter(t=>t.source?.kind==='url').map(t=>({url:(t.source as {kind:'url';url:string}).url,name:t.name}))].filter((v,i,all)=>all.findIndex(x=>x.url===v.url)===i),legacyViews:(base as Workspace).legacyViews,active:tabs.some(t=>t.key===base.active)?base.active:tabs[0]?.key};
}
export function snapshotWorkspace(state:Workspace):WorkspaceSnapshot{const {document,recovery,tabs,...rest}=state;return {...rest,format:3,document,views:tabs.map(viewOf),recovery};}
function validateView(view:ViewState){
 const point=(p:unknown,nonnegative=false)=>Array.isArray(p)&&p.length===2&&p.every(v=>typeof v==='number'&&Number.isFinite(v)&&(!nonnegative||v>=0));
 if(!view||typeof view.key!=='string'||!view.key||!view.positions||typeof view.positions!=='object'||Array.isArray(view.positions)||!Object.values(view.positions).every(p=>point(p))||!point(view.scroll)||!Number.isFinite(view.zoom)||view.zoom<.25||view.zoom>2.5||(view.selected!==undefined&&typeof view.selected!=='string')||(view.activity!==undefined&&typeof view.activity!=='string')||(view.hiddenNodes!==undefined&&(!Array.isArray(view.hiddenNodes)||!view.hiddenNodes.every(id=>typeof id==='string')))||(view.showExceptions!==undefined&&typeof view.showExceptions!=='boolean')||(view.selectedEdgesOnly!==undefined&&typeof view.selectedEdgesOnly!=='boolean')||(view.viewInset!==undefined&&!point(view.viewInset,true))||(view.canvasOrigin!==undefined&&!point(view.canvasOrigin,true)))throw Error('Invalid saved view');
}
export function restoreWorkspace(saved:Session|WorkspaceSnapshot):Workspace{
 const visits=(saved as Workspace).urlHistory;
 if(visits!==undefined&&(!Array.isArray(visits)||visits.some(v=>!v||typeof v.name!=='string'||typeof v.url!=='string'||!validVisitURL(v.url))||new Set(visits.map(v=>v.url)).size!==visits.length))throw Error('Invalid URL history');
 if('format' in saved){
  const raw=saved as unknown as {format:number;views:(ViewState&{group?:string})[];document?:DocumentState;recovery:Tab[];active?:string};
  if(![2,3].includes(raw.format)||!Array.isArray(raw.views)||!Array.isArray(raw.recovery))throw Error('Invalid workspace');
  const backup=(saved as WorkspaceSnapshot).legacyViews;if(backup){if(!Array.isArray(backup.views)||(backup.active!==undefined&&typeof backup.active!=='string')||(backup.documentKey!==undefined&&typeof backup.documentKey!=='string'))throw Error('Invalid legacy backup');for(const v of backup.views)validateView(v as ViewState);}
  const {format:_format,views,document,recovery,...rest}=saved;for(const v of views)validateView(v);for(const t of recovery)validateView(t);
  if(!!document!==!!views.length||new Set(views.map(v=>v.key)).size!==views.length)throw Error('Invalid workspace views');
  if(raw.format===2){
   if(raw.views.some(v=>v.group!==undefined&&typeof v.group!=='string'))throw Error('Invalid legacy Group');
   if(raw.views.length&&(raw.views[0].group!==undefined||raw.views.filter(v=>v.group===undefined).length!==1))throw Error('Invalid legacy views');
   const overview=raw.views[0];const clean=overview?{...overview}:undefined;if(clean)delete clean.group;
   return createWorkspace({...rest,tabs:[],active:clean?.key,recovery,legacyViews:{documentKey:document?.key,views:structuredClone(raw.views),active:raw.active}} as Workspace,recovery,document,clean?[clean]:[]);
  }
  if(views.length&&(views[0].activity!==undefined||views.filter(v=>v.activity===undefined).length!==1)||new Set(views.filter(v=>v.activity!==undefined).map(v=>v.activity)).size!==views.filter(v=>v.activity!==undefined).length)throw Error('Invalid workspace views');
  if(document&&views.some(v=>v.activity!==undefined&&!document.design.graph.nodes.some(n=>n.type==='business'&&n.id===v.activity)))throw Error('Unknown saved Activity');
  return createWorkspace({...rest,tabs:[]},recovery,document,views);
 }
 if(!Array.isArray(saved.tabs)||new Set(saved.tabs.map(t=>t.key)).size!==saved.tabs.length)throw Error('Invalid legacy session');for(const t of saved.tabs)validateView(t);
 const selected=saved.tabs.find(t=>t.key===saved.active)??saved.tabs[0];
 // Keep every old document, including unapplied drafts, checks and file handles.
 return createWorkspace({...saved,tabs:selected?[selected]:[]},saved.tabs.length>1?[...saved.tabs]:[]);
}
export function replaceWorkspace(state:Workspace,tab:Tab):Workspace{
 const url=tab.source?.kind==='url'?tab.source.url:undefined;
 const urlHistory=url?[{url,name:tab.name},...(state.urlHistory??[]).filter(v=>v.url!==url)]:state.urlHistory;
 // Legacy documents remain protected; new visits never create body generations.
 return createWorkspace({...state,urlHistory,tabs:[tab],active:tab.key},state.recovery);
}
export function updateWorkspace(state:Workspace,design:Tab['design'],handle=state.document?.handle,edited=false):Workspace{
 if(!state.document)return state;
 const doc={...state.document,design,handle,edited,draft:undefined},activities=new Set(design.graph.nodes.filter(n=>n.type==='business').map(n=>n.id));
 const views=state.tabs.filter(t=>viewActivity(t)===undefined||activities.has(viewActivity(t)!)).map(viewOf);
 return createWorkspace(state,state.recovery,doc,views);
}
export function openActivity(state:Workspace,id:string):Tab{
 const existing=state.tabs.find(t=>viewActivity(t)===id);if(existing){state.active=existing.key;return existing;}
 if(!state.document||!state.document.design.graph.nodes.some(n=>n.type==='business'&&n.id===id))throw Error('Unknown Activity');
 const tab=bindView(state.document,{key:crypto.randomUUID(),activity:id,selected:id,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});Object.assign(tab,viewOf(reconcileView(tab)));state.tabs.push(tab);state.active=tab.key;return tab;
}

/** A durable document update must not roll back UI edits made during its write. */
export function mergeLiveWorkspace(next:Workspace,live:Workspace):Workspace{
 const views=next.tabs.map(tab=>{const previous=live.tabs.find(t=>t.key===tab.key);return previous?viewOf(reconcileView(bindView(next.document!,{...viewOf(tab),...viewOf(previous)}))):viewOf(tab);});
 return createWorkspace({...next,dark:live.dark,drawer:live.drawer,nodeDrawer:live.nodeDrawer,width:live.width,preferWrite:live.preferWrite,active:next.tabs.some(t=>t.key===live.active)?live.active:next.active},next.recovery,next.document,views);
}

function validVisitURL(value:string){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}}
