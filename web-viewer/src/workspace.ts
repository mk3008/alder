import {reconcile,type Tab,type Session} from './session.ts';
import {groupDesign,parseGroups} from './groups.ts';
export type DocumentState=Pick<Tab,'key'|'name'|'design'|'checks'|'source'|'draft'|'edited'|'handle'>;
export type ViewState=Omit<Tab,keyof DocumentState>&{key:string;group?:string};
export type WorkspaceSnapshot=Omit<Session,'tabs'>&{format:2;document?:DocumentState;views:ViewState[];recovery:Tab[]};
/** Live tabs expose the current document through non-enumerable accessors.
 * The stored format contains one document and document-free views only. */
export type Workspace=Session&{document?:DocumentState;recovery:Tab[]};
const documents=new WeakMap<Tab,DocumentState>();
export function documentForView(tab:Tab){return documents.get(tab);}
const documentFields=['design','checks','source','draft','edited','handle'] as const;
export function documentOf(tab:Tab):DocumentState{return {key:tab.key,name:tab.name,...Object.fromEntries(documentFields.map(k=>[k,tab[k]]))} as DocumentState;}
function viewOf(tab:Tab):ViewState{const {key,positions,selected,hiddenNodes,showExceptions,selectedEdgesOnly,viewInset,canvasOrigin,scroll,zoom}=tab;return {key,positions,selected,hiddenNodes,showExceptions,selectedEdgesOnly,viewInset,canvasOrigin,scroll,zoom,...('group' in tab?{group:(tab as Tab&{group?:string}).group}:{})};}
export function bindView(doc:DocumentState,view:ViewState):Tab{
 const tab=view as unknown as Tab;documents.set(tab,doc);
 Object.defineProperty(tab,'name',{configurable:true,get:()=>view.group??'全体図'});
 for(const field of documentFields)Object.defineProperty(tab,field,{configurable:true,get:()=>doc[field],set:value=>{(doc as Record<string,unknown>)[field]=value;}});
 return tab;
}
export function viewGroup(tab:Tab){return (tab as Tab&{group?:string}).group;}
export function viewDesign(tab:Tab){return groupDesign(tab.design,viewGroup(tab));}
function reconcileView(tab:Tab){
 const design=viewDesign(tab),result=reconcile({...tab},design);
 // Overview visibility is stored in source Activity IDs so aggregate Groups
 // follow their members. Reconciliation must not drop those hidden members.
 if(tab.hiddenNodes!==undefined){const valid=new Set([...tab.design.graph.nodes,...design.graph.nodes].map(n=>n.id));result.hiddenNodes=tab.hiddenNodes.filter(id=>valid.has(id));}
 return result;
}
export function createWorkspace(base:Session,recovery:Tab[]=[],doc?:DocumentState,views?:ViewState[]):Workspace{
 const document=doc??(base.tabs[0]?documentOf(base.tabs[0]):undefined);
 const tabs=document?(views??[base.tabs[0]?viewOf(base.tabs[0]):{key:document.key,positions:{},scroll:[0,0],zoom:1}]).map(v=>{
  const tab=bindView(document,v);Object.assign(v,viewOf(reconcileView(tab)));return tab;
 }):[];
 const {dark,drawer,width,preferWrite,nodeDrawer,sampleLayout}=base;return {dark,drawer,width,preferWrite,nodeDrawer,sampleLayout,document,tabs,recovery,active:tabs.some(t=>t.key===base.active)?base.active:tabs[0]?.key};
}
export function snapshotWorkspace(state:Workspace):WorkspaceSnapshot{const {document,recovery,tabs,...rest}=state;return {...rest,format:2,document,views:tabs.map(viewOf),recovery};}
function validateView(view:ViewState){
 const point=(p:unknown,nonnegative=false)=>Array.isArray(p)&&p.length===2&&p.every(v=>typeof v==='number'&&Number.isFinite(v)&&(!nonnegative||v>=0));
 if(!view||typeof view.key!=='string'||!view.key||!view.positions||typeof view.positions!=='object'||Array.isArray(view.positions)||!Object.values(view.positions).every(p=>point(p))||!point(view.scroll)||!Number.isFinite(view.zoom)||view.zoom<.25||view.zoom>2.5||(view.selected!==undefined&&typeof view.selected!=='string')||(view.group!==undefined&&typeof view.group!=='string')||(view.hiddenNodes!==undefined&&(!Array.isArray(view.hiddenNodes)||!view.hiddenNodes.every(id=>typeof id==='string')))||(view.showExceptions!==undefined&&typeof view.showExceptions!=='boolean')||(view.selectedEdgesOnly!==undefined&&typeof view.selectedEdgesOnly!=='boolean')||(view.viewInset!==undefined&&!point(view.viewInset,true))||(view.canvasOrigin!==undefined&&!point(view.canvasOrigin,true)))throw Error('Invalid saved view');
}
export function restoreWorkspace(saved:Session|WorkspaceSnapshot):Workspace{
 if('format' in saved){if(saved.format!==2||!Array.isArray(saved.views)||!Array.isArray(saved.recovery))throw Error('Invalid workspace');const {format:_format,views,document,recovery,...rest}=saved;for(const v of views)validateView(v);for(const t of recovery)validateView(t);if(!!document!==!!views.length||views.length&&(views[0].group!==undefined||views.filter(v=>v.group===undefined).length!==1)||new Set(views.map(v=>v.key)).size!==views.length||new Set(views.filter(v=>v.group!==undefined).map(v=>v.group)).size!==views.filter(v=>v.group!==undefined).length)throw Error('Invalid workspace views');if(document){const names=new Set(parseGroups(document.design.markdown,document.design).map(g=>g.name));if(views.some(v=>v.group!==undefined&&!names.has(v.group)))throw Error('Unknown saved Group');}return createWorkspace({...rest,tabs:[]},recovery,document,views);}
 if(!Array.isArray(saved.tabs)||new Set(saved.tabs.map(t=>t.key)).size!==saved.tabs.length)throw Error('Invalid legacy session');for(const t of saved.tabs)validateView(t);
 const selected=saved.tabs.find(t=>t.key===saved.active)??saved.tabs[0];
 // Keep every old document, including unapplied drafts, checks and file handles.
 return createWorkspace({...saved,tabs:selected?[selected]:[]},saved.tabs.length>1?[...saved.tabs]:[]);
}
export function replaceWorkspace(state:Workspace,tab:Tab):Workspace{
 const previous=state.document;
 const recovery=previous?[...state.recovery,{...state.tabs.find(t=>viewGroup(t)===undefined)!,...previous}]:state.recovery;
 return createWorkspace({...state,tabs:[tab],active:tab.key},recovery);
}
export function updateWorkspace(state:Workspace,design:Tab['design'],handle=state.document?.handle,edited=false):Workspace{
 if(!state.document)return state;
 const doc={...state.document,design,handle,edited,draft:undefined},groups=new Set(parseGroups(design.markdown,design).map(g=>g.name));
 const views=state.tabs.filter(t=>viewGroup(t)===undefined||groups.has(viewGroup(t)!)).map(viewOf);
 return createWorkspace(state,state.recovery,doc,views);
}
export function openGroup(state:Workspace,name:string):Tab{
 const existing=state.tabs.find(t=>viewGroup(t)===name);if(existing){state.active=existing.key;return existing;}
 if(!state.document||!parseGroups(state.document.design.markdown,state.document.design).some(g=>g.name===name))throw Error('Unknown Group');
 const tab=bindView(state.document,{key:crypto.randomUUID(),group:name,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});Object.assign(tab,viewOf(reconcileView(tab)));state.tabs.push(tab);state.active=tab.key;return tab;
}

/** A durable document update must not roll back UI edits made during its write. */
export function mergeLiveWorkspace(next:Workspace,live:Workspace):Workspace{
 const views=next.tabs.map(tab=>{const previous=live.tabs.find(t=>t.key===tab.key);return previous?viewOf(reconcileView(bindView(next.document!,{...viewOf(tab),...viewOf(previous)}))):viewOf(tab);});
 return createWorkspace({...next,dark:live.dark,drawer:live.drawer,nodeDrawer:live.nodeDrawer,width:live.width,preferWrite:live.preferWrite,active:next.tabs.some(t=>t.key===live.active)?live.active:next.active},next.recovery,next.document,views);
}
