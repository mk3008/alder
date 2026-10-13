import {clampZoom,installTouchGestures} from './touch-gestures';
import {deploymentContext} from './deployment';
import {createElement,icons,UserRound,FolderOpen,PanelRight,Moon,Sun,RefreshCw,Plus,Minus,X,Box,FileText,FolderSymlink,Text,LockKeyhole,LockKeyholeOpen,PanelLeft,Eye,EyeOff,ChevronDown,ChevronRight,Settings} from 'lucide';
import {parseDesign,validateGraph} from './graph';
import {formattedMarkdown} from './markdown';
import {reconcile,saveSession,loadSession,type Session,type Tab,type Point} from './session';
import {RouteCache} from './route-cache';
import {createNodeDrag} from './node-drag';
import {hiddenReadIndexes} from './edge-visibility';
import {fetchMarkdown} from './source';
import './style.css';
import sampleMarkdown from '../../business-design/alder/README.md?raw';
import {createSnackbar} from './snackbar';
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="refresh" aria-label="更新" title="更新">更新</button><button id="theme" aria-label="テーマ切替"></button><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="開いているファイル"></nav><button id="edit-markdown" aria-label="原文を見る／編集する" title="原文を見る／編集する"><span class="editor-caption">原文を見る／編集する</span></button></div><section id="status" class="info-bar" hidden><span id="status-text" role="status" aria-live="polite"></span><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><p>Business Design Markdownを開いてください。</p><a id="open-sample" href="#alder-sample">サンプルを開く</a></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSのMarkdown本文URL</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design Markdown</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-state" role="status" hidden></p><p id="source-help"></p><div class="source-actions"><button id="source-edit" hidden>編集する</button><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,text/markdown,text/plain" multiple hidden>`;
const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const deployment=deploymentContext(location.pathname);if(deployment.version){$('preview-badge').hidden=false;$('preview-badge').textContent=`確認用 · ${deployment.version}`;$('preview-badge').title=`PR #${deployment.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`;}
const icon=(v:Parameters<typeof createElement>[0])=>createElement(v,{'stroke-width':1.8,'aria-hidden':'true'});
for(const [id,value] of [['open',FolderOpen],['open-url',FolderSymlink],['open-text',Text],['edit-markdown',FileText],['refresh',RefreshCw],['drawer',PanelRight],['node-list-toggle',PanelLeft],['node-list-close',X],['display-settings-toggle',Settings],['out',Minus],['in',Plus]] as const)$(id).prepend(icon(value));
let state:Session={tabs:[],dark:false,drawer:true,width:380,preferWrite:false,nodeDrawer:false},layoutLocked=true,displaySettingsOpen=false,restoring=true,opening=false,saving=Promise.resolve(),timer:number|undefined,closing:Tab|undefined,revision=0,documentSaving=false;
const updating=new WeakSet<Tab>(),unsavedDrafts=new Set<string>();
function acknowledgeDrafts(snapshot:Session){for(const key of unsavedDrafts){const live=state.tabs.find(t=>t.key===key),stored=snapshot.tabs.find(t=>t.key===key);if(live&&stored&&live.draft===stored.draft)unsavedDrafts.delete(key);}}
window.addEventListener('beforeunload',e=>{if(unsavedDrafts.size||documentSaving){e.preventDefault();e.returnValue='';}});
const current=()=>state.tabs.find(t=>t.key===state.active);
const status=createSnackbar($('status'),$('status-text'),$<HTMLButtonElement>('status-close'),$('viewport'));
function persist(delay=180){if(restoring)return;revision++;clearTimeout(timer);if(closing||documentSaving)return;timer=window.setTimeout(()=>{let snapshot:Session;try{snapshot=structuredClone(state);}catch{status('表示状態を保存できません。','error','storage');return;}saving=saving.catch(()=>{}).then(()=>saveSession(snapshot)).then(()=>acknowledgeDrafts(snapshot)).catch(()=>status('表示状態を保存できません。ブラウザーの保存設定を確認してください。','error','storage'));},delay);}
async function closeTab(t:Tab){
  if(restoring||closing||documentSaving||!state.tabs.includes(t))return;
  rememberEditorInput();if(t.draft!==undefined&&!window.confirm('図に反映していない編集を破棄して、このタブを閉じますか？'))return;
  if(sourceTarget===t.key)hideSource();
  touch.cancel();capture();clearTimeout(timer);closing=t;renderTabs();displaySettingsChrome();sourceChrome(!sourceText().readOnly);
  const version=revision;
  try{
    const projected:Session={...state,tabs:state.tabs.filter(x=>x!==t),active:state.active===t.key?state.tabs.find(x=>x!==t)?.key:state.active};
    if(t.source?.kind==='sample')projected.sampleLayout={positions:t.positions,selected:t.selected,scroll:t.scroll,zoom:t.zoom,hiddenNodes:t.hiddenNodes,showExceptions:t.showExceptions,selectedEdgesOnly:t.selectedEdgesOnly,viewInset:t.viewInset,canvasOrigin:t.canvasOrigin};
    const snapshot=structuredClone(projected),write=saving.catch(()=>{}).then(()=>saveSession(snapshot));
    saving=write.catch(()=>{});await write;
    state.tabs=state.tabs.filter(x=>x!==t);if(state.active===t.key)state.active=state.tabs[0]?.key;
    if(t.source?.kind==='sample')state.sampleLayout=snapshot.sampleLayout;
    unsavedDrafts.delete(t.key);closing=undefined;render();
    if(version!==revision)persist(0);
  }catch{closing=undefined;renderTabs();displaySettingsChrome();sourceChrome(!sourceText().readOnly);status('表示状態を保存できないため、タブを閉じませんでした。ブラウザーの保存設定を確認してください。','error','storage');}
}
// Empty presentation hides graph-only controls without changing drawer preferences.
function chrome(){const hasTab=!!current(),drawerOpen=hasTab&&state.drawer,listOpen=hasTab&&!!state.nodeDrawer;document.querySelector<HTMLElement>('.toolbar')!.hidden=!hasTab;if(!hasTab)displaySettingsOpen=false;displaySettingsChrome();$('layout-lock').replaceChildren(icon(layoutLocked?LockKeyhole:LockKeyholeOpen));$('layout-lock').setAttribute('aria-pressed',String(layoutLocked));$('layout-lock').title=layoutLocked?'配置をロック中。項目の上から図をスクロールできます。':'配置を調整中。項目をドラッグして移動できます。';$('layout-lock').toggleAttribute('disabled',restoring);$('viewport').dataset.layoutLocked=String(layoutLocked);$<HTMLInputElement>('prefer-write').checked=state.preferWrite===true;$<HTMLInputElement>('prefer-write').disabled=restoring;$<HTMLInputElement>('show-exceptions').checked=current()?.showExceptions!==false;$<HTMLInputElement>('show-exceptions').disabled=restoring||!current()||closing===current();$<HTMLInputElement>('selected-edges-only').checked=current()?.selectedEdgesOnly===true;$<HTMLInputElement>('selected-edges-only').disabled=restoring||!current()||closing===current();document.documentElement.dataset.theme=state.dark?'dark':'light';$('theme').replaceChildren(icon(state.dark?Sun:Moon));$('formattedMarkdownDrawer').hidden=!drawerOpen;$('formattedMarkdownDrawer').style.width=Math.max(260,Math.min(state.width,innerWidth*.65))+'px';$('drawer').setAttribute('aria-expanded',String(drawerOpen));$('drawer').toggleAttribute('disabled',restoring||!hasTab);$('node-list-drawer').hidden=!listOpen;$('node-list-toggle').setAttribute('aria-expanded',String(listOpen));$('node-list-toggle').toggleAttribute('disabled',restoring||!hasTab);}
// Keep expansion ephemeral: it never changes graph data or stored preferences.
function displaySettingsChrome(){
  document.querySelector<HTMLElement>('.toolbar')!.dataset.settingsOpen=String(displaySettingsOpen);
  $('display-options').hidden=!displaySettingsOpen;
  const button=$<HTMLButtonElement>('display-settings-toggle'),label=displaySettingsOpen?'表示設定を閉じる':'表示設定を開く';
  button.setAttribute('aria-expanded',String(displaySettingsOpen));button.setAttribute('aria-label',label);button.title=label;button.disabled=restoring||!current()||closing===current();
}
function setDisplaySettings(open:boolean,focus=false){
  const t=current();if(restoring||!t||closing===t||open===displaySettingsOpen)return;
  touch.cancel();pan=undefined;capture();displaySettingsOpen=open;displaySettingsChrome();layoutCanvas(t);
  if(!open&&(focus||$('display-options').contains(document.activeElement)))$('display-settings-toggle').focus({preventScroll:true});
}
$('display-settings-toggle').onclick=()=>setDisplaySettings(!displaySettingsOpen);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&displaySettingsOpen&&$('source-dialog').hidden){e.preventDefault();setDisplaySettings(false,true);}});
function capture(){const t=current();if(t)t.scroll=[$('viewport').scrollLeft,$('viewport').scrollTop];}
function retainFocus(update:()=>void){
  const active=document.activeElement as HTMLElement|null;
  const tab=active?.closest<HTMLElement>('.tab')?.dataset.key;
  const close=active?.classList.contains('close');
  update();
  if(tab)Array.from(document.querySelectorAll<HTMLElement>('.tab')).find(e=>e.dataset.key===tab)?.querySelector<HTMLElement>(close?'.close':'button')?.focus({preventScroll:true});
}
function renderTabs(){retainFocus(buildTabs);}
function buildTabs(){const root=$('tabs');root.replaceChildren();state.tabs.forEach(t=>{const wrap=document.createElement('div');wrap.className='tab'+(t.key===state.active?' active':'');wrap.draggable=true;wrap.dataset.key=t.key;const b=document.createElement('button');b.textContent=t.name;b.title=t.name;b.prepend(icon(FileText));b.setAttribute('aria-current',String(t.key===state.active));b.disabled=documentSaving;b.onclick=async()=>{if(documentSaving)return;if(sourceTarget&&sourceTarget!==t.key&&!await closeSource())return;capture();state.active=t.key;render();persist();};const close=document.createElement('button');close.className='close';close.setAttribute('aria-label',t.name+'を閉じる');close.append(icon(X));close.disabled=!!closing||documentSaving;close.onclick=()=>closeTab(t);wrap.append(b,close);wrap.ondragstart=e=>e.dataTransfer?.setData('text/plain',t.key);wrap.ondragover=e=>e.preventDefault();wrap.ondrop=e=>{e.preventDefault();if(documentSaving)return;const from=state.tabs.findIndex(x=>x.key===e.dataTransfer?.getData('text/plain')),to=state.tabs.indexOf(t);if(from>=0){const [m]=state.tabs.splice(from,1);state.tabs.splice(to,0,m);renderTabs();persist();}};wrap.onkeydown=e=>{if(documentSaving)return;if(e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();const i=state.tabs.indexOf(t),j=i+(e.key==='ArrowLeft'?-1:1);if(j>=0&&j<state.tabs.length){[state.tabs[i],state.tabs[j]]=[state.tabs[j],state.tabs[i]];renderTabs();persist();}}};root.append(wrap);});}
function detail(){const t=current(),root=$('detail'),key=t?t.key+':'+(t.selected??''):'';const scroll=root.dataset.contentKey===key?root.scrollTop:0;root.replaceChildren();root.dataset.contentKey=key;if(!t)return;const n=t.design.graph.nodes.find(n=>n.id===t.selected);root.append(formattedMarkdown(n?t.design.sections[n.id]:t.design.markdown));root.scrollTop=scroll;}
type Category='activity'|'object'|'role';
const listViews=new Map<string,{category:Category;search:string;collapsed:Set<string>}>();
const listView=()=>{const key=state.active??'';let value=listViews.get(key);if(!value){value={category:'activity',search:'',collapsed:new Set()};listViews.set(key,value);}return value;};
function roleBadge(who:string){let hash=0;for(const c of who)hash=(hash*31+c.codePointAt(0)!)>>>0;const badge=document.createElement('span');badge.className='who-badge';badge.style.setProperty('--role-color',['#8b5cf6','#2563eb','#c2410c','#008576','#be185d'][hash%5]);badge.setAttribute('aria-hidden','true');badge.append(icon(UserRound));return badge;}
function setNodeDrawer(open:boolean,focus=true){if(restoring||!current())return;touch.cancel();capture();state.nodeDrawer=open;chrome();if(open&&current()?.selected)revealListNode(current()!.selected!);renderNodeList();if(focus)(open?$('node-list-close'):$('node-list-toggle')).focus({preventScroll:true});persist();}
function revealListNode(id:string){const t=current(),n=t?.design.graph.nodes.find(n=>n.id===id);if(!n)return;const view=listView();if(view.category!=='role'||n.type!=='business')view.category=n.type==='business'?'activity':'object';view.collapsed.delete(String(n.who));if(!n.name.toLocaleLowerCase().includes(view.search.toLocaleLowerCase()))view.search='';requestAnimationFrame(()=>{const row=Array.from($('node-list').querySelectorAll<HTMLElement>('[data-list-node]')).find(e=>e.dataset.listNode===id);row?.scrollIntoView?.({block:'nearest',inline:'nearest'});});}
function changeVisibility(ids:string[],visible:boolean){const t=current();if(!t||restoring||closing===t)return;touch.cancel();pan=undefined;capture();const hidden=new Set(t.hiddenNodes??[]);for(const id of ids)visible?hidden.delete(id):hidden.add(id);t.hiddenNodes=[...hidden];graph();persist();}
function navigateNode(id:string){const t=current();if(!t||t.hiddenNodes?.includes(id)||closing===t)return;touch.cancel();pan=undefined;capture();t.selected=id;revealListNode(id);if(innerWidth<=800)state.nodeDrawer=false;chrome();graph();const viewport=$('viewport'),rect=viewport.getBoundingClientRect(),right=$('formattedMarkdownDrawer').getBoundingClientRect();const visibleRight=state.drawer&&right.left>rect.left&&right.left<rect.right?right.left:rect.right;const visibleWidth=Math.max(1,Math.min(viewport.clientWidth,visibleRight-rect.left-viewport.clientLeft)),visibleHeight=viewport.clientHeight;t.viewInset=[viewport.clientWidth/(2*t.zoom),viewport.clientHeight/(2*t.zoom)];const p=t.positions[id];t.scroll=[(p[0]+130+t.viewInset[0]+(t.canvasOrigin?.[0]??0))*t.zoom-visibleWidth/2,(p[1]+34+t.viewInset[1]+(t.canvasOrigin?.[1]??0))*t.zoom-visibleHeight/2];layoutCanvas(t);viewport.scrollLeft=t.scroll[0];viewport.scrollTop=t.scroll[1];capture();if(innerWidth<=800)$('node-list-toggle').focus({preventScroll:true});persist();}
function renderNodeList(){
 const t=current(),view=listView(),root=$('node-list'),listScroll=root.scrollTop,active=document.activeElement as HTMLElement|null,focusedID=active?.closest<HTMLElement>('[data-list-node]')?.dataset.listNode,focusedEye=active?.hasAttribute('data-node-visibility'),focusedRole=active?.dataset.role;
 const search=$<HTMLInputElement>('node-list-search');search.value=view.search;search.disabled=!t||restoring;
 const categories=$('node-categories');categories.replaceChildren();for(const [category,label] of [['activity','Activity'],['object','Object'],['role','ロール']] as const){const button=document.createElement('button');button.dataset.category=category;button.id='node-category-'+category;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(view.category===category));button.setAttribute('aria-controls','node-list');button.tabIndex=view.category===category?0:-1;button.textContent=label;button.onclick=()=>{view.category=category;renderNodeList();$('node-category-'+category).focus({preventScroll:true});};button.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const keys:Category[]=['activity','object','role'],index=keys.indexOf(category);view.category=e.key==='Home'?'activity':e.key==='End'?'role':keys[(index+(e.key==='ArrowRight'?1:2))%3];renderNodeList();$('node-category-'+view.category).focus({preventScroll:true});};categories.append(button);}
 root.setAttribute('aria-labelledby','node-category-'+view.category);root.replaceChildren();const hidden=new Set(t?.hiddenNodes??[]),outside=t?.design.graph.nodes.filter(n=>!n.scope)??[],count=outside.filter(n=>!hidden.has(n.id)).length,bulk=$<HTMLButtonElement>('scope-outside');const pressed=count===outside.length?'true':count===0?'false':'mixed';bulk.setAttribute('aria-pressed',pressed);bulk.setAttribute('aria-label',pressed==='true'?'スコープ外を非表示':'スコープ外を表示');bulk.replaceChildren(icon(pressed==='false'?EyeOff:Eye));bulk.disabled=!outside.length||restoring||closing===t;const scopeShortcut=$<HTMLInputElement>('show-outside');scopeShortcut.checked=pressed==='true';scopeShortcut.indeterminate=pressed==='mixed';scopeShortcut.setAttribute('aria-checked',pressed);scopeShortcut.disabled=bulk.disabled;$('scope-count').textContent=pressed==='mixed'?`${count}/${outside.length} 表示`:'';
 if(!t){root.textContent='文書を開くと項目が表示されます。';return;}
 const nodes=t.design.graph.nodes.filter(n=>n.name.toLocaleLowerCase().includes(view.search.toLocaleLowerCase()));
 const row=(n:typeof nodes[number])=>{const wrap=document.createElement('div');wrap.className='node-list-row'+(n.id===t.selected?' list-selected':'');wrap.dataset.listNode=n.id;const visible=!hidden.has(n.id);wrap.dataset.visible=String(visible);const eye=document.createElement('button');eye.className='node-eye';eye.dataset.nodeVisibility=n.id;eye.setAttribute('aria-label',n.name+(visible?'を非表示':'を表示'));eye.setAttribute('aria-pressed',String(visible));eye.append(icon(visible?Eye:EyeOff));eye.onclick=()=>changeVisibility([n.id],!visible);const name=document.createElement('button');name.className='node-navigate';name.textContent=n.name;name.title=visible?n.name+'へ移動':n.name+'（非表示）';name.setAttribute('aria-disabled',String(!visible));name.setAttribute('aria-current',String(n.id===t.selected));name.onclick=()=>navigateNode(n.id);wrap.append(eye,name);return wrap;};
 if(view.category==='role'){const groups=new Map<string,typeof nodes>();for(const n of nodes.filter(n=>n.type==='business')){const who=String(n.who);groups.set(who,[...(groups.get(who)??[]),n]);}let index=0;for(const [who,children] of groups){const group=document.createElement('section');group.className='role-group';const header=document.createElement('button');header.className='role-heading';header.dataset.role=who;header.setAttribute('aria-expanded',String(!view.collapsed.has(who)));header.append(roleBadge(who));const label=document.createElement('span');label.textContent=who;header.append(label,icon(view.collapsed.has(who)?ChevronRight:ChevronDown));const list=document.createElement('div');list.id='node-role-group-'+index++;list.className='role-children';list.hidden=view.collapsed.has(who);header.setAttribute('aria-controls',list.id);header.onclick=()=>{view.collapsed.has(who)?view.collapsed.delete(who):view.collapsed.add(who);renderNodeList();};for(const n of children)list.append(row(n));group.append(header,list);root.append(group);}}
 else for(const n of nodes.filter(n=>view.category==='activity'?n.type==='business':n.type==='object'))root.append(row(n));
 if(!root.children.length)root.textContent='該当する項目はありません。';
 root.scrollTop=listScroll;
 if(focusedID)Array.from(root.querySelectorAll<HTMLElement>('[data-list-node]')).find(e=>e.dataset.listNode===focusedID)?.querySelector<HTMLElement>(focusedEye?'.node-eye':'.node-navigate')?.focus({preventScroll:true});if(focusedRole)Array.from(root.querySelectorAll<HTMLElement>('[data-role]')).find(e=>e.dataset.role===focusedRole)?.focus({preventScroll:true});
}
$('node-list-toggle').onclick=()=>setNodeDrawer(!state.nodeDrawer);$('node-list-close').onclick=()=>setNodeDrawer(false);
$('node-list-drawer').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();setNodeDrawer(false);}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&!$('node-list-drawer').hidden&&$('source-dialog').hidden){e.preventDefault();setNodeDrawer(false);}});
$('node-list-search').oninput=()=>{listView().search=$<HTMLInputElement>('node-list-search').value;renderNodeList();};
function toggleScopeOutside(){const t=current();if(t){const outside=t.design.graph.nodes.filter(n=>!n.scope);changeVisibility(outside.map(n=>n.id),outside.some(n=>t.hiddenNodes?.includes(n.id)));}}
$('scope-outside').onclick=toggleScopeOutside;
$<HTMLInputElement>('show-outside').onchange=toggleScopeOutside;

const svgNS='http://www.w3.org/2000/svg',svg=(name:string)=>document.createElementNS(svgNS,name);
const routeCache=new RouteCache();
let redrawEdges=()=>{},edgeExtent:Point=[0,0],edgeMinimum:Point=[0,0];
// Reserve the desktop list's occupied width so a redraw while it is open
// cannot clamp the camera when it closes. Overlay lists consume no width.
function cameraViewportWidth(){const drawer=$('node-list-drawer');return $('viewport').clientWidth+(!drawer.hidden&&getComputedStyle(drawer).position!=='absolute'&&getComputedStyle(drawer).position!=='fixed'?drawer.offsetWidth:0);}
// Toolbar dimensions stay in screen pixels when the graph zoom changes.
function bottomCameraReserve(){const viewport=$('viewport'),v=viewport.getBoundingClientRect(),bar=document.querySelector<HTMLElement>('.toolbar')!.getBoundingClientRect();return (bar.height?Math.max(0,v.top+viewport.clientTop+viewport.clientHeight-bar.top):0)+12;}
function layoutCanvas(t:Tab){
  const inset=t.viewInset??[0,0],previous=t.canvasOrigin??[0,0],positions=Object.values(t.positions);
  const nodeMinimum:Point=[Math.min(0,...positions.map(p=>p[0])),Math.min(0,...positions.map(p=>p[1]))];
  // Existing positive layouts keep their original camera, including historical
  // best-effort routes near zero. Signed cards opt their axis into expansion.
  const minimum:Point=[nodeMinimum[0]<0||previous[0]>0?Math.min(nodeMinimum[0],edgeMinimum[0]):0,nodeMinimum[1]<0||previous[1]>0?Math.min(nodeMinimum[1],edgeMinimum[1]):0];
  // Grow only the camera's negative reserve. Compensating scroll keeps every
  // untouched card/path at the same screen position when the origin expands.
  const growth:Point=[Math.ceil(Math.max(0,(minimum[0]<0?24-minimum[0]:0)-previous[0])*t.zoom),Math.ceil(Math.max(0,(minimum[1]<0?24-minimum[1]:0)-previous[1])*t.zoom)];
  const origin:Point=[previous[0]+growth[0]/t.zoom,previous[1]+growth[1]/t.zoom],shifted=growth.some(Boolean);
  // Integer screen-pixel additions avoid native scroll rounding causing a jump.
  if(shifted){t.canvasOrigin=origin;t.scroll=[t.scroll[0]+growth[0],t.scroll[1]+growth[1]];}
  const width=Math.max(1400,edgeExtent[0],(cameraViewportWidth()+t.scroll[0])/t.zoom-inset[0]*2-origin[0],...positions.map(p=>p[0]+340));
  const height=Math.max(850,edgeExtent[1],Math.max(edgeExtent[1],...positions.map(p=>p[1]+68))+bottomCameraReserve()/t.zoom-inset[1],($('viewport').clientHeight+t.scroll[1])/t.zoom-inset[1]*2-origin[1],...positions.map(p=>p[1]+220));
  $('canvas').style.width=(width+origin[0]+inset[0]*2)*t.zoom+'px';$('canvas').style.height=(height+origin[1]+inset[1]*2)*t.zoom+'px';
  $('nodes').style.left=(origin[0]+inset[0])*t.zoom+'px';$('nodes').style.top=(origin[1]+inset[1])*t.zoom+'px';
  $('edges').style.left=inset[0]*t.zoom+'px';$('edges').style.top=inset[1]*t.zoom+'px';
  $('nodes').style.width=width+'px';$('nodes').style.height=height+'px';$('nodes').style.transform=`scale(${t.zoom})`;
  $('edges').setAttribute('viewBox',`${-origin[0]} ${-origin[1]} ${width+origin[0]} ${height+origin[1]}`);
  $('edges').style.width=(width+origin[0])*t.zoom+'px';$('edges').style.height=(height+origin[1])*t.zoom+'px';
  if(shifted){$('viewport').scrollLeft=t.scroll[0];$('viewport').scrollTop=t.scroll[1];}
  $('zoom').textContent=Math.round(t.zoom*100)+'%';
}
function graph(){retainFocus(buildGraph);}
function buildGraph(){nodeDrag.cancel();redrawEdges=()=>{};edgeExtent=[0,0];edgeMinimum=[0,0];const t=current();$('nodes').replaceChildren();$('edges').replaceChildren();$('empty').hidden=!!t;$('canvas').hidden=!t;if(!t){
  // The last tab was captured and saved before this presentation-only reset.
  // Remove the old world's scroll extent without changing its saved camera.
  $('viewport').scrollLeft=0;$('viewport').scrollTop=0;detail();renderNodeList();return;
}const allNodes=t.design.graph.nodes,nodes=allNodes.filter(n=>!t.hiddenNodes?.includes(n.id)),visibleIDs=new Set(nodes.map(n=>n.id));if(t.selected&&!visibleIDs.has(t.selected))t.selected=undefined;const selected=t.selected,positions=t.positions,neighbors=new Set<string>(selected?[selected]:[]);if(selected)t.design.graph.relations.filter(r=>r.from===selected||r.to===selected).forEach(r=>{neighbors.add(r.from);neighbors.add(r.to);});
  layoutCanvas(t);
  const defs=svg('defs'),marker=svg('marker');for(const [k,v] of Object.entries({id:'arrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto'}))marker.setAttribute(k,v);const arrow=svg('path');arrow.setAttribute('d','M0 0L10 5L0 10Z');arrow.classList.add('arrow');marker.append(arrow);defs.append(marker);const related=marker.cloneNode(true) as SVGElement;related.id='related-arrow';related.querySelector('path')!.classList.add('review-related-arrow');defs.append(related);$('edges').append(defs);

  const hiddenReads=hiddenReadIndexes(t.design.graph.relations,state.preferWrite===true);
  const drawEdges=()=>{const boxes=allNodes.flatMap(n=>{const p=positions[n.id];return p?[{id:n.id,x:p[0],y:p[1],width:260,height:68}]:[];}),routes=routeCache.update(t,t.design,boxes,t.design.graph.relations);edgeExtent=[0,0];edgeMinimum=[0,0];while($('edges').childNodes.length>1)$('edges').lastChild!.remove();
  t.design.graph.relations.forEach((r,i)=>{if(hiddenReads.has(i))return;const route=routes[i];if(!route)return;edgeExtent[0]=Math.max(edgeExtent[0],route.bounds.right+20,route.label[0]+Math.max(30,r.label.length*12)/2+12);edgeExtent[1]=Math.max(edgeExtent[1],route.bounds.bottom+20,route.label[1]+22);edgeMinimum[0]=Math.min(edgeMinimum[0],...route.points.map(p=>p[0]-20),route.label[0]-Math.max(30,r.label.length*12)/2-12);edgeMinimum[1]=Math.min(edgeMinimum[1],...route.points.map(p=>p[1]-20),route.label[1]-22);if((t.selectedEdgesOnly===true&&selected&&r.from!==selected&&r.to!==selected)||!visibleIDs.has(r.from)||!visibleIDs.has(r.to)||(t.showExceptions===false&&(r.kind==='business-exception'||r.kind==='object-exception')))return;const path=svg('path');path.setAttribute('d',route.path);path.dataset.relation=String(i);path.dataset.collisions=String(route.collisions);path.dataset.rerouted=String(route.rerouted);path.dataset.fallback=String(route.fallback);path.setAttribute('marker-end','url(#arrow)');path.classList.add('edge');if(r.kind.endsWith('exception'))path.classList.add('exception');if(selected&&(r.from===selected||r.to===selected)){path.classList.add('review-related');path.setAttribute('marker-end','url(#related-arrow)');}if(selected&&r.from!==selected&&r.to!==selected)path.classList.add('muted');const title=svg('title');title.textContent=r.from+' → '+r.to+': '+r.label;path.append(title);$('edges').append(path);const label=svg('text');label.setAttribute('x',String(route.label[0]));label.setAttribute('y',String(route.label[1]));label.setAttribute('text-anchor','middle');label.classList.add('edge-label');label.setAttribute('dominant-baseline','middle');label.dataset.relation=String(i);if(selected&&(r.from===selected||r.to===selected))label.classList.add('review-related');if(selected&&r.from!==selected&&r.to!==selected)label.classList.add('muted');label.textContent=r.label;$('edges').append(label);});const root=$('edges');for(const e of [...Array.from(root.querySelectorAll('.edge:not(.review-related)')),...Array.from(root.querySelectorAll('.edge.review-related')),...Array.from(root.querySelectorAll('.edge-label'))])root.append(e);layoutCanvas(t);};redrawEdges=drawEdges;drawEdges();
  nodes.forEach(n=>{const b=document.createElement('div');b.setAttribute('role','group');b.className='node '+n.type+(n.scope?'':' outside')+(n.id===selected?' selected':'')+(selected&&!neighbors.has(n.id)?' muted':'')+(selected&&n.id!==selected&&neighbors.has(n.id)?' review-neighbor':'');b.dataset.node=n.id;b.style.left=positions[n.id][0]+'px';b.style.top=positions[n.id][1]+'px';const key=String(n.icon??'file-question').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('') as keyof typeof icons;const image=icon(n.type==='business'?UserRound:icons[key]??Box);if(n.type==='business')b.append(roleBadge(String(n.who)));else b.append(image);const text=document.createElement('span');text.className='node-text';const kind=document.createElement('span');kind.className='review-kind';kind.textContent=(n.type==='business'?'Activity':'Object')+(n.scope?' · 範囲内':' · 範囲外');text.append(kind);const name=document.createElement('span');name.className='node-name';name.textContent=n.name;text.append(name);if(n.type==='business'){const who=document.createElement('small');who.textContent=String(n.who);text.append(who);}b.append(text);b.title=n.name+(n.type==='business'?' — '+String(n.who):'');b.setAttribute('aria-label',b.title+(n.id===selected?'（選択中）':''));let pointer:number|undefined;
    b.onpointerdown=e=>{if(e.button!==0||closing===t||layoutLocked)return;e.stopPropagation();b.setPointerCapture(e.pointerId);pointer=e.pointerId;nodeDrag.begin(n.id,[e.clientX,e.clientY]);};
    b.onpointermove=e=>{if(pointer===undefined||(e.pointerId!==undefined&&e.pointerId!==pointer)||!b.isConnected||closing===t)return;nodeDrag.move([e.clientX,e.clientY]);};
    b.onpointerup=e=>{if(pointer===undefined||pointer!==e.pointerId)return;pointer=undefined;if(!b.isConnected||closing===t)return;const drag=nodeDrag.end();if(b.hasPointerCapture?.(e.pointerId))b.releasePointerCapture(e.pointerId);if(!drag)return;if(!drag.moved){t.selected=n.id;revealListNode(n.id);}capture();graph();persist();};
    const cancel=(e:PointerEvent)=>{if(pointer===undefined||pointer!==e.pointerId)return;pointer=undefined;if(!b.isConnected)return;nodeDrag.cancel();capture();persist();};
    b.onpointercancel=cancel;b.onlostpointercapture=cancel;$('nodes').append(b);});$('zoom').textContent=Math.round(t.zoom*100)+'%';detail();renderNodeList();
}
function render(){touch.cancel();pan=undefined;chrome();renderTabs();graph();const t=current();if(t){$('viewport').scrollLeft=t.scroll[0];$('viewport').scrollTop=t.scroll[1];}$('refresh').toggleAttribute('disabled',restoring||documentSaving||!!closing||!t||t.source?.kind==='text'||updating.has(t));$('edit-markdown').toggleAttribute('disabled',restoring||opening||documentSaving||!!closing||!t||updating.has(t));$('edit-markdown').hidden=!t;for(const id of ['open','open-url','open-text'])$(id).toggleAttribute('disabled',restoring||opening||documentSaving);$('open-sample').setAttribute('aria-disabled',String(restoring||opening||documentSaving));$('open-sample').tabIndex=restoring||opening||documentSaving?-1:0;$('theme').toggleAttribute('disabled',restoring);sourceChrome(!sourceText().readOnly);}
// New documents start with extra camera padding on the left. Reconcile and
// restored tabs keep their existing camera, including an absent legacy inset.
type PickerWindow=Window & {showOpenFilePicker?: (options:unknown)=>Promise<FileSystemFileHandle[]>};
async function addFile(file:File,handle?:FileSystemFileHandle){if(sourceTarget&&!await closeSource())return;const design=parseDesign(await file.text());let existing:Tab|undefined;if(handle){for(const t of state.tabs)if(t.handle&&await t.handle.isSameEntry(handle)){existing=t;break;}}if(existing){capture();state.active=existing.key;render();persist();return;}const tab=reconcile({key:crypto.randomUUID(),name:file.name,design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0],handle},design);capture();const index=state.tabs.findIndex(t=>t.key===state.active);state.tabs.splice(index+1,0,tab);state.active=tab.key;render();persist();status('');}
$('open-sample').onpointerdown=e=>e.stopPropagation();
$('open-sample').onclick=e=>{e.preventDefault();if(restoring||opening||documentSaving)return;try{let tab=state.tabs.find(t=>t.source?.kind==='sample');if(!tab){const design=parseDesign(sampleMarkdown);tab=reconcile({key:crypto.randomUUID(),name:'Alderを使った設計業務',source:{kind:'sample'},design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:state.sampleLayout?undefined:[40,0],...state.sampleLayout},design);const index=state.tabs.findIndex(t=>t.key===state.active);state.tabs.splice(index+1,0,tab);}capture();state.active=tab.key;render();persist();status('');$('viewport').focus({preventScroll:true});}catch(e){status('サンプルを開けません: '+(e as Error).message,'error');}};
$('open').onclick=async()=>{if(restoring||opening||documentSaving)return;opening=true;render();try{const picker=(window as PickerWindow).showOpenFilePicker;if(picker){const handles=await picker({multiple:true,types:[{description:'Business Design Markdown',accept:{'text/markdown':['.md','.markdown']}}]});for(const h of handles)await addFile(await h.getFile(),h);}else $('fallback').click();}catch(e){if((e as Error).name!=='AbortError')status('開けません: '+(e as Error).message,'error');}finally{opening=false;render();}};
($('fallback') as HTMLInputElement).onchange=async()=>{const input=$('fallback') as HTMLInputElement;if(restoring||opening||documentSaving)return;opening=true;render();try{for(const f of Array.from(input.files??[]))await addFile(f);}catch(e){status('開けません: '+(e as Error).message,'error');}input.value='';opening=false;render();};
// Save a replacement before changing the displayed Graph. A failed transaction
// leaves the old design and the per-tab draft available for an explicit retry.
async function saveDocument(project:()=>Session,commit:()=>void){
  if(documentSaving||closing)throw Error('表示状態を保存しています。完了後に再試行してください。');
  capture();clearTimeout(timer);documentSaving=true;const version=revision;render();let saved=false;
  try{
    const snapshot=structuredClone(project()),write=saving.catch(()=>{}).then(()=>saveSession(snapshot));
    saving=write.catch(()=>{});await write;commit();acknowledgeDrafts(snapshot);saved=true;
  }finally{documentSaving=false;render();if(saved&&revision!==version)persist(0);}
}
async function replace(t:Tab,d:ReturnType<typeof parseDesign>,handle=t.handle,edited=false){
  if(!state.tabs.includes(t)||closing===t)return false;
  await saveDocument(()=>({...state,tabs:state.tabs.map(x=>x===t?reconcile({...t,handle,edited,draft:undefined},d):x)}),()=>{
    // Keep identity and any camera/selection changes made while storage settled.
    Object.assign(t,reconcile({...t,handle,edited,draft:undefined},d));
  });
  status(edited?'編集を保存し、図に反映しました。':'更新しました。');return true;
}
async function reselect(t:Tab){
  if(!state.tabs.includes(t)||closing===t)return;
  const picker=(window as PickerWindow).showOpenFilePicker;
  if(picker){const [h]=await picker({multiple:false});if(h)await replace(t,parseDesign(await (await h.getFile()).text()),h);}
  else await new Promise<void>((resolve,reject)=>{
    const input=document.createElement('input');input.type='file';input.accept='.md,.markdown';input.hidden=true;document.body.append(input);
    const done=()=>{input.remove();resolve();};input.oncancel=done;
    input.onchange=async()=>{try{const f=input.files?.[0];if(f)await replace(t,parseDesign(await f.text()));done();}catch(e){input.remove();reject(e);}};input.click();
  });
}
type PermissionHandle=FileSystemFileHandle & {queryPermission:(o:{mode:'read'})=>Promise<PermissionState>};
$('refresh').onclick=async()=>{
  const t=current();if(restoring||documentSaving||closing||!t||t.source?.kind==='text'||updating.has(t))return;
  rememberEditorInput();
  if((t.edited||t.draft!==undefined)&&!window.confirm('ブラウザー内の編集を破棄し、取得元のMarkdownで更新しますか？取得や保存に失敗した場合は編集を保持します。'))return;
  if(sourceTarget===t.key)hideSource();updating.add(t);render();
  try{
    if(t.source?.kind==='sample'){await replace(t,parseDesign(sampleMarkdown));return;}
    if(t.source?.kind==='url'){const d=parseDesign(await fetchMarkdown(t.source.url));await replace(t,d);return;}
    if(!t.handle){await reselect(t);return;}
    const permission=await (t.handle as PermissionHandle).queryPermission({mode:'read'});
    if(!state.tabs.includes(t)||closing===t)return;
    if(permission!=='granted'){status('読取権限がありません。同じMarkdownを再選択してください。','warning');await reselect(t);return;}
    await replace(t,parseDesign(await (await t.handle.getFile()).text()));
  }catch(e){if(state.tabs.includes(t)&&(e as Error).name!=='AbortError')status('更新失敗。編集と旧表示を保持しています: '+(e as Error).message,'error');}
  finally{updating.delete(t);render();}
};
type SourceMode='url'|'text'|'edit';
let sourceMode:SourceMode='text',sourceTarget:string|undefined,sourceBusy=false,sourceToken=0,sourceAbort:AbortController|undefined,sourceOpener:HTMLElement|null=null;
const sourceText=()=>($('source-text') as HTMLTextAreaElement),sourceURL=()=>($('source-url') as HTMLInputElement);
const editingTab=()=>state.tabs.find(t=>t.key===sourceTarget);
function rememberEditorInput(){
  const t=editingTab();if(sourceMode!=='edit'||$('source-dialog').hidden||!t||sourceText().readOnly||documentSaving||closing)return;
  const value=sourceText().value,draft=value===t.design.markdown?undefined:value;
  if(t.draft!==draft){t.draft=draft;unsavedDrafts.add(t.key);persist();}editorState();
}
function editorState(){$('source-state').hidden=sourceMode!=='edit';$('source-state').textContent=editingTab()?.draft!==undefined?'図に未反映の編集があります。':'図に反映済みの原文です。';}
function sourceChrome(editing=false){
  editorState();
  const edit=sourceMode==='edit',busy=sourceBusy||documentSaving||(edit&&!!closing);sourceText().readOnly=edit&&!editing;sourceText().disabled=busy;
  $('source-edit').hidden=!edit;$('source-edit').textContent=editing?'原文を確認':'編集する';
  $<HTMLButtonElement>('source-edit').disabled=busy;
  $('source-submit').hidden=edit&&!editing;$('source-submit').textContent=edit?'図に反映':'表示';
  $<HTMLButtonElement>('source-submit').disabled=busy;$<HTMLButtonElement>('source-cancel').disabled=edit&&busy;
  $('source-cancel').textContent=edit?'閉じる':'キャンセル';
}
function showSource(mode:SourceMode,target?:Tab){
  if(restoring||opening||documentSaving||(target&&(updating.has(target)||!!closing)))return;
  rememberEditorInput();sourceAbort?.abort();sourceToken++;sourceMode=mode;sourceTarget=target?.key;sourceBusy=false;sourceOpener=document.activeElement as HTMLElement;
  $('source-dialog').hidden=false;$('source-title').textContent=target?`Markdown原文 · ${target.name}`:mode==='url'?'URLを開く':'テキストを入力';
  for(const id of ['url-label','source-url'])$(id).hidden=mode!=='url';for(const id of ['text-label','source-text'])$(id).hidden=mode==='url';
  $('source-help').textContent=mode==='url'?'匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。復元時には自動取得しません。':mode==='edit'?'元ファイルやURLは書き換えません。未反映の編集はこのタブに保持します。「図に反映」で保存と再解析を行います。':'入力本文はこのブラウザーに保存します。作成後は「原文を見る／編集する」から編集できます。外部送信しません。';
  if(target)sourceText().value=target.draft??target.design.markdown;
  else if(mode==='text')sourceText().value=newTextDraft;
  sourceChrome();(mode==='url'?sourceURL():sourceText()).focus();
}
let newTextDraft='';
function hideSource(){sourceToken++;sourceAbort?.abort();sourceBusy=false;sourceTarget=undefined;$('source-dialog').hidden=true;sourceChrome();if(sourceOpener?.isConnected)sourceOpener.focus({preventScroll:true});}
async function closeSource(){
  if(documentSaving)return false;
  rememberEditorInput();const t=editingTab();
  if(sourceMode==='edit'&&t&&(t.draft!==undefined||unsavedDrafts.has(t.key))){
    sourceBusy=true;sourceChrome(true);
    try{await saveDocument(()=>state,()=>{});}
    catch{status('編集を保存できません。本文を保持しています。保存設定を確認してから閉じてください。','error','storage');return false;}
    finally{sourceBusy=false;sourceChrome(true);}
  }
  if(sourceMode==='text')newTextDraft=sourceText().value;hideSource();return true;
}
sourceText().oninput=()=>{if(sourceMode==='edit')rememberEditorInput();else if(sourceMode==='text')newTextDraft=sourceText().value;};
$('source-edit').onclick=()=>{if(sourceBusy||documentSaving||closing)return;rememberEditorInput();sourceChrome(sourceText().readOnly);sourceText().focus();};
$('edit-markdown').onclick=()=>{const t=current();if(t)showSource('edit',t);};
$('open-url').onclick=()=>showSource('url');$('open-text').onclick=()=>showSource('text');$('source-cancel').onclick=()=>closeSource();
$('source-dialog').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();void closeSource();}};
$('source-submit').onclick=async()=>{
  if(sourceBusy||documentSaving||(sourceMode==='edit'&&closing)||$('source-dialog').hidden||(sourceMode==='edit'&&sourceText().readOnly))return;
  rememberEditorInput();sourceBusy=true;sourceChrome(true);const token=++sourceToken,target=editingTab(),mode=sourceMode;sourceAbort=new AbortController();
  try{
    const url=sourceURL().value.trim(),raw=mode==='url'?await fetchMarkdown(url,sourceAbort.signal):sourceText().value;
    if(new TextEncoder().encode(raw).byteLength>2*1024*1024)throw Error('本文は2MiB以内にしてください。');
    const design=parseDesign(raw);if(token!==sourceToken)return;
    if(mode==='edit'){
      if(!target||!state.tabs.includes(target)||closing===target){status('編集対象のタブは閉じる操作中か、閉じられました。入力は保持しています。','warning');return;}
      await replace(target,design,target.handle,target.edited===true||raw!==target.design.markdown);
    }else{
      const tab=reconcile({key:crypto.randomUUID(),name:mode==='text'?'入力したMarkdown':new URL(url).pathname.split('/').pop()||'URLのMarkdown',source:mode==='text'?{kind:'text'}:{kind:'url',url},design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},design);
      capture();const i=state.tabs.findIndex(t=>t.key===state.active);state.tabs.splice(i+1,0,tab);state.active=tab.key;render();persist();status('');if(mode==='text')newTextDraft=raw;
    }
    hideSource();
  }catch(e){if(token===sourceToken)status('表示できません。入力と旧表示を保持しています: '+(e as Error).message,'error');}
  finally{if(token===sourceToken){sourceBusy=false;sourceChrome(true);}}
};
$('layout-lock').onclick=()=>{if(restoring)return;touch.cancel();pan=undefined;capture();layoutLocked=!layoutLocked;chrome();graph();};
$<HTMLInputElement>('selected-edges-only').onchange=()=>{const t=current();if(!t||restoring||closing===t)return;touch.cancel();pan=undefined;capture();t.selectedEdgesOnly=$<HTMLInputElement>('selected-edges-only').checked;redrawEdges();persist();};
$<HTMLInputElement>('show-exceptions').onchange=()=>{const t=current();if(!t||restoring||closing===t)return;touch.cancel();pan=undefined;capture();t.showExceptions=$<HTMLInputElement>('show-exceptions').checked;redrawEdges();persist();};
$<HTMLInputElement>('prefer-write').onchange=()=>{if(restoring)return;capture();state.preferWrite=$<HTMLInputElement>('prefer-write').checked;graph();persist();};
$('theme').onclick=()=>{if(restoring)return;state.dark=!state.dark;chrome();persist();};$('drawer').onclick=()=>{if(restoring||!current())return;capture();state.drawer=!state.drawer;render();persist();};for(const [id,factor] of [['in',1.2],['out',1/1.2]] as const)$(id).onclick=()=>{const t=current();if(t&&closing!==t){capture();t.zoom=clampZoom(t.zoom*factor);render();persist();}};
const viewport=$('viewport');
function changeDraggedNode(id:string,position:Point){
  const t=current();if(!t||closing===t)return;capture();t.positions[id]=position;
  const node=Array.from($('nodes').children).find(n=>(n as HTMLElement).dataset.node===id) as HTMLElement|undefined;
  if(node){node.style.left=position[0]+'px';node.style.top=position[1]+'px';}
  redrawEdges();if(closing)revision++;
}
const nodeDrag=createNodeDrag({
  read:()=>{const t=current();return t&&t!==closing&&!layoutLocked&&!document.hidden?{key:t.key,zoom:t.zoom,scroll:[viewport.scrollLeft,viewport.scrollTop],offset:[(t.canvasOrigin?.[0]??0)+(t.viewInset?.[0]??0),(t.canvasOrigin?.[1]??0)+(t.viewInset?.[1]??0)]}:undefined;},
  position:id=>current()?.positions[id],
  connected:id=>Array.from($('nodes').children).some(n=>(n as HTMLElement).dataset.node===id),
  bounds:()=>{
    const rect=viewport.getBoundingClientRect(),left=rect.left+viewport.clientLeft,top=rect.top+viewport.clientTop;
    const bounds={left,top,right:left+viewport.clientWidth,bottom:top+viewport.clientHeight};
    for(const [id,side] of [['formattedMarkdownDrawer','right'],['node-list-drawer','left']] as const){
      const drawer=$(id),r=drawer.getBoundingClientRect();if(drawer.hidden||r.bottom<=top||r.top>=bounds.bottom)continue;
      if(side==='right'&&r.left>bounds.left&&r.left<bounds.right)bounds.right=r.left;
      if(side==='left'&&r.right>bounds.left&&r.right<bounds.right)bounds.left=r.right;
    }
    const bar=document.querySelector<HTMLElement>('.toolbar')!.getBoundingClientRect();
    if(bar.height&&bar.top<bounds.bottom&&bar.bottom>bounds.top)bounds.bottom=Math.max(bounds.top,bar.top-12);
    return bounds;
  },
  change:changeDraggedNode,
  pan:delta=>{
    const t=current();if(!t||t===closing||layoutLocked)return;capture();
    const desired:Point=[t.scroll[0]+delta[0],t.scroll[1]+delta[1]],origin=t.canvasOrigin??[0,0];
    const growth:Point=[Math.ceil(Math.max(0,-desired[0])),Math.ceil(Math.max(0,-desired[1]))];
    if(growth.some(Boolean))t.canvasOrigin=[origin[0]+growth[0]/t.zoom,origin[1]+growth[1]/t.zoom];
    t.scroll=[Math.max(0,desired[0]+growth[0]),Math.max(0,desired[1]+growth[1])];layoutCanvas(t);viewport.scrollLeft=t.scroll[0];viewport.scrollTop=t.scroll[1];capture();
  },
  requestFrame:callback=>requestAnimationFrame(callback),cancelFrame:id=>cancelAnimationFrame(id)
});
const touch=installTouchGestures(viewport,{
  nodeDrag,
  read:()=>{const t=current();return t&&closing!==t?{key:t.key,zoom:t.zoom,locked:layoutLocked,scroll:[viewport.scrollLeft,viewport.scrollTop]}:undefined;},
  position:id=>current()?.positions[id],
  change:value=>{const t=current();if(!t||closing===t)return;
    if(value.node)changeDraggedNode(value.node.id,value.node.position);
    if(value.selected){t.selected=value.selected;revealListNode(value.selected);}
    if(value.zoom!==undefined)t.zoom=value.zoom;
    if(value.scroll)t.scroll=value.scroll;
    if(value.selected)graph();
    else if(value.zoom!==undefined)layoutCanvas(t);
    if(value.scroll){viewport.scrollLeft=value.scroll[0];viewport.scrollTop=value.scroll[1];}
    capture();if(closing)revision++;
  },
  finish:()=>{const t=current();if(t)layoutCanvas(t);capture();persist();}
});
const cancelInteractions=()=>{touch.cancel();pan=undefined;capture();persist();};
window.addEventListener('blur',cancelInteractions);
window.addEventListener('pagehide',cancelInteractions);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelInteractions();});
viewport.onscroll=()=>{capture();persist();};
let pan:{key:string;pointer:number;x:number;y:number;scroll:Point;node?:string;moved:boolean}|undefined;
viewport.onpointerdown=e=>{const t=current(),node=(e.target as HTMLElement).closest<HTMLElement>('.node')?.dataset.node;if(e.button!==0||!t||t===closing||(node&&!layoutLocked))return;pan={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[viewport.scrollLeft,viewport.scrollTop],node,moved:false};viewport.setPointerCapture(e.pointerId);};
viewport.onpointermove=e=>{if(pan&&pan.pointer===e.pointerId&&pan.key===current()?.key&&current()!==closing){const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)>3)pan.moved=true;viewport.scrollLeft=pan.scroll[0]-dx;viewport.scrollTop=pan.scroll[1]-dy;}};
viewport.onpointerup=e=>{if(!pan||pan.pointer!==e.pointerId)return;const t=current(),p=pan;pan=undefined;if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);if(t&&t!==closing&&p.key===t.key&&!p.moved&&p.node){t.selected=p.node;revealListNode(p.node);graph();}capture();persist();};
viewport.onpointercancel=()=>{pan=undefined;};
viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport&&pan?.pointer===e.pointerId)pan=undefined;});
let resizing=false;$('resize').onpointerdown=e=>{if(restoring)return;resizing=true;$('resize').setPointerCapture(e.pointerId);};$('resize').onpointermove=e=>{if(resizing){state.width=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));chrome();}};$('resize').onpointerup=()=>{resizing=false;persist();};$('resize').onpointercancel=()=>{resizing=false;persist();};$('resize').onkeydown=e=>{if(restoring)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();state.width+=e.key==='ArrowLeft'?20:-20;state.width=Math.max(260,Math.min(innerWidth*.65,state.width));chrome();persist();}};window.addEventListener('resize',()=>{chrome();const t=current();if(t)layoutCanvas(t);});
// Viewport resize and wrapped toolbar labels can change the required tail.
// Recompute from current content, never from a historical maximum; keep pan.
if(typeof ResizeObserver!=='undefined'){const canvasResize=new ResizeObserver(()=>{const t=current();if(t)layoutCanvas(t);});canvasResize.observe($('viewport'));canvasResize.observe(document.querySelector<HTMLElement>('.toolbar')!);}
render();loadSession().then(saved=>{if(!saved)return;if(!Array.isArray(saved.tabs)||typeof saved.dark!=='boolean'||typeof saved.drawer!=='boolean'||(saved.preferWrite!==undefined&&typeof saved.preferWrite!=='boolean')||(saved.scopeOutside!==undefined&&!['show','dim','hide'].includes(saved.scopeOutside))||(saved.dimOutside!==undefined&&typeof saved.dimOutside!=='boolean')||(saved.hideOutside!==undefined&&typeof saved.hideOutside!=='boolean')||!Number.isFinite(saved.width))throw Error('Invalid session');for(const t of saved.tabs){validateGraph(t.design.graph);if((t.draft!==undefined&&typeof t.draft!=='string')||(t.edited!==undefined&&typeof t.edited!=='boolean'))throw Error('Invalid editor state');}if(saved.nodeDrawer!==undefined&&typeof saved.nodeDrawer!=='boolean')throw Error('Invalid drawer');for(const t of [...saved.tabs,...(saved.sampleLayout===undefined?[]:[saved.sampleLayout])]){if((t.selectedEdgesOnly!==undefined&&typeof t.selectedEdgesOnly!=='boolean')||(t.showExceptions!==undefined&&typeof t.showExceptions!=='boolean')||(t.hiddenNodes!==undefined&&(!Array.isArray(t.hiddenNodes)||!t.hiddenNodes.every(id=>typeof id==='string')))||(t.viewInset!==undefined&&(!Array.isArray(t.viewInset)||t.viewInset.length!==2||!t.viewInset.every(v=>Number.isFinite(v)&&v>=0)))||(t.canvasOrigin!==undefined&&(!Array.isArray(t.canvasOrigin)||t.canvasOrigin.length!==2||!t.canvasOrigin.every(v=>Number.isFinite(v)&&v>=0)))||!Array.isArray(t.scroll)||!t.scroll.every(Number.isFinite)||!Number.isFinite(t.zoom)||t.zoom<.25||t.zoom>2.5||!Object.values(t.positions).every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))throw Error('Invalid layout');}// Removed dim preferences migrate to show so previously visible nodes stay visible.
const {dimOutside:_dimOutside,hideOutside:_hideOutside,scopeOutside:_scopeOutside,...restored}=saved;
const migrate=(t:Tab)=>({...t,hiddenNodes:t.hiddenNodes??(saved.scopeOutside==='hide'?t.design.graph.nodes.filter(n=>!n.scope).map(n=>n.id):[])});state={...restored,tabs:saved.tabs.map(t=>reconcile(migrate(t),t.design))};if(saved.sampleLayout&&saved.sampleLayout.hiddenNodes===undefined&&saved.scopeOutside==='hide')state.sampleLayout={...saved.sampleLayout,hiddenNodes:parseDesign(sampleMarkdown).graph.nodes.filter(n=>!n.scope).map(n=>n.id)};if(!state.tabs.some(t=>t.key===state.active))state.active=state.tabs[0]?.key;if(current()?.selected)revealListNode(current()!.selected!);render();if(state.tabs.some(t=>t.source?.kind!=='text'&&t.source?.kind!=='sample'))status('保存時の内容です。最新の取得元は「更新」で確認できます。','warning');}).catch(()=>status('前回の表示を復元できません。Markdownを開き直してください。','error')).finally(()=>{restoring=false;render();});
