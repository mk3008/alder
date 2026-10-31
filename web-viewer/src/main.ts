import {canOpenDetail} from './detail-navigation.ts';
import {cameraZoom,ZOOM_FACTOR,cameraOrigin} from './graph-camera';
import {graphFocus} from './graph-focus';
import {graphMarkers,paintGraphException} from './graph-visuals';
import {installViewerShell} from './viewer-shell';
import {viewTabLabel,viewTabClose} from './view-tab';
import {stateTransitionPanel} from './state-transitions';
import './state-transitions.css';
import {activityRole,roleGroupKey} from './roles';
import {captionKey,isMatrixGraph,type MatrixPlan,type MatrixWire} from './matrix-layout.ts';
import {matrixPlanForDesign} from './json-layout.ts';
import {createWorkspace,documentForView,mergeLiveWorkspace,snapshotWorkspace,restoreWorkspace,replaceWorkspace,updateWorkspace,openActivity,openObject,viewDesign,viewActivity,viewObject,viewTarget,type Workspace,type WorkspaceSnapshot} from './workspace';
import {installDropdown} from './dropdown';
import {readRelatedChecks,checkCompatibility,confirmationKey,type RelatedChecks} from './check-items';
import {checkView,type CheckViewState} from './check-view';
import {installDocumentActions} from './document-actions';
import {installHeaderTitleFit} from './header-layout';
import {snapshotGraph,saveGraphPng,copyGraphPng} from './graph-png';
import {clampZoom,installTouchGestures} from './touch-gestures';
import {deploymentContext} from './deployment';
import {createElement,icons,UserRound,FolderOpen,PanelRight,Moon,Sun,RefreshCw,Plus,Minus,X,Box,FileText,FolderSymlink,Text,LockKeyhole,LockKeyholeOpen,PanelLeft,Eye,EyeOff,ChevronDown,ChevronRight,Settings,Share2,RotateCcw,ImageDown,ClipboardCopy,ListChecks,CircleQuestionMark} from 'lucide';
import {parseDocument as parseDesign} from './document-input';
import {loadDocumentFile,loadDocumentURL,loadDocumentText} from './document-loader';
import {businessDetail} from './document-view';
import {formattedMarkdown,detailHeading} from './markdown';
import {nodeFindingLabels,findingsIndex,findingsCount,findingCard,type FindingSelection} from './findings';
import {reconcile,saveSession,loadSession,SessionConflictError,type Session,type Tab,type Point} from './session';
import {RouteCache} from './route-cache';
import {createNodeDrag} from './node-drag';
import {resetLayout} from './layout-reset';
import {hiddenReadIndexes} from './edge-visibility';
import {fetchDocumentSource,fetchMarkdown} from './source';
import {sourceSharingReason,createSourceShareLink,readSharedSource} from './sharing';
import './style.css';
import './canvas-toolbar.css';
import './viewer-shell.css';
import legacySampleMarkdown from '../../business-design/alder/README.md?raw';
import sampleRaw from '../../business-design/alder/business-design.json?raw';
import {sampleLayoutForDesign} from './sample-layout.ts';
import sampleChecksMarkdown from './samples/alder-checks.md?raw';
import {createSnackbar} from './snackbar';
const sampleJSON=typeof sampleRaw==='string'?sampleRaw:JSON.stringify(sampleRaw,null,2)+'\n';
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>`;
let shell:ReturnType<typeof installViewerShell>|undefined;
const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const deployment=deploymentContext(location.pathname);if(deployment.version){$('preview-badge').hidden=false;$('preview-badge').textContent=`確認用 · ${deployment.version}`;$('preview-badge').title=`PR #${deployment.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`;}
const icon=(v:Parameters<typeof createElement>[0])=>createElement(v,{'stroke-width':1.8,'aria-hidden':'true'});
const sourceMenu=document.createElement('div');sourceMenu.id='source-menu';sourceMenu.innerHTML=`<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>`;app.append(sourceMenu);
const checksMenu=document.createElement('div');checksMenu.id='checks-menu';checksMenu.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';app.append(checksMenu);
const checkFollowup=document.createElement('section');checkFollowup.id='check-followup';checkFollowup.hidden=true;checkFollowup.setAttribute('aria-labelledby','check-followup-title');checkFollowup.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector('.workspace')!.before(checkFollowup);
const followupMenu=document.createElement('div');followupMenu.id='check-followup-menu';followupMenu.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';app.append(followupMenu);
const checkInput=document.createElement('input');checkInput.type='file';checkInput.id='check-file';checkInput.accept='.md,.markdown,text/markdown,text/plain';checkInput.hidden=true;app.append(checkInput);
const checkURLDialog=document.createElement('section');checkURLDialog.id='check-url-dialog';checkURLDialog.hidden=true;checkURLDialog.setAttribute('role','dialog');checkURLDialog.setAttribute('aria-labelledby','check-url-title');checkURLDialog.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';app.append(checkURLDialog);
const helpMenu=document.createElement('div');helpMenu.id='help-menu';helpMenu.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${deployment.version??'main'}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${deployment.version??'main'}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${deployment.version??'main'}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;app.append(helpMenu);installDropdown($<HTMLButtonElement>('help-menu-toggle'),helpMenu);
const urlHistoryList=document.createElement('div');urlHistoryList.id='url-history';sourceMenu.append(urlHistoryList);
function urlHistoryChrome(){
 urlHistoryList.replaceChildren();if(!state.urlHistory?.length)return;
 const title=document.createElement('strong');title.textContent='URL閲覧履歴';urlHistoryList.append(title);
 for(const visit of state.urlHistory){const button=document.createElement('button');button.type='button';button.setAttribute('role','menuitem');button.textContent=visit.name;const address=document.createElement('small');address.textContent=visit.url;button.append(address);button.title=visit.url;button.disabled=restoring||opening||documentSaving;button.onclick=()=>void openHistoryURL(visit.url);urlHistoryList.append(button);}
}
async function openHistoryURL(url:string){
 if(restoring||opening||documentSaving)return;
 if(state.document?.source?.kind==='url'&&state.document.source.url===url){capture();shell?.reopenBusinessOverview();state.active=state.tabs[0].key;render();void checkSourceUpdate();return;}
 opening=true;render();try{const design=await loadDocumentURL(url);const tab=reconcile({key:crypto.randomUUID(),name:new URL(url).pathname.split('/').pop()||'URLのMarkdown',source:{kind:'url',url},design,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},design);await openDocument(tab);}catch(e){if(!(e instanceof DocumentSaveError))status('履歴のURLを開けません。現在の表示は保持しています: '+(e as Error).message,'error');}finally{opening=false;render();}
}
const sourceDropdown=installDropdown($<HTMLButtonElement>('open-menu-toggle'),sourceMenu);
const checksDropdown=installDropdown($<HTMLButtonElement>('open-checks'),checksMenu,()=>{const t=current();$('check-open-sample').hidden=!t||!isSample(t);$<HTMLButtonElement>('check-close').disabled=!t?.checks;});
const followupDropdown=installDropdown($<HTMLButtonElement>('check-followup-open'),followupMenu,()=>{$('check-followup-sample').hidden=!current()||!isSample(current()!);});
for(const [id,value] of [['open-menu-toggle',FolderOpen],['open',FolderOpen],['open-url',FolderSymlink],['open-text',Text],['view-markdown',FileText],['open-checks',ListChecks],['share-source',Share2],['refresh',RefreshCw],['help-menu-toggle',CircleQuestionMark],['drawer',PanelRight],['node-list-toggle',PanelLeft],['node-list-close',X],['display-settings-toggle',Settings],['reset-layout',RotateCcw],['save-image',ImageDown],['copy-image',ClipboardCopy],['out',Minus],['in',Plus]] as const)$(id).prepend(icon(value));
installHeaderTitleFit(document.querySelector('header')!);
const documentActions=installDocumentActions(document.querySelector('.tab-strip')!);
let state:Workspace={tabs:[],recovery:[],dark:false,drawer:true,width:380,preferWrite:false,nodeDrawer:false},layoutLocked=true,displaySettingsOpen=false,restoring=true,restoreFailed=false,saveConflict=false,opening=false,saving=Promise.resolve(),timer:number|undefined,closing:Tab|undefined,revision=0,documentSaving=false;
let exportingImage=false;
let savedRevision=0,pendingWrites=0,saveFailed=false,savedOnce=false,draftDirty=false,leaveWarning=false;
// Repeated lifecycle/no-op events must not commit the same revision twice.
const queuedRevisions=new Set<number>();
const updating=new Set<string>(),unsavedDrafts=new Set<string>();
function acknowledgeDrafts(snapshot:Session|WorkspaceSnapshot){
 const stored='format' in snapshot?[...(snapshot.document?[snapshot.document]:[]),...snapshot.recovery]:snapshot.tabs;
 for(const key of unsavedDrafts){const live=[...(state.document?[state.document]:[]),...state.recovery].find(d=>d.key===key),saved=stored.find(d=>d.key===key&&d.draft===live?.draft);if(live&&saved)unsavedDrafts.delete(key);}
}
const current=()=>state.tabs.find(t=>t.key===state.active);
const documentKey=(t:Tab)=>documentForView(t)?.key??t.key;
const isCurrentDocument=(t:Tab)=>state.document?.key===documentKey(t);
let storageMessage='';
const notify=createSnackbar($('status'),$('status-text'),$<HTMLButtonElement>('status-close'),$('viewport'));
// Recomputing save chrome must not move an unchanged storage error ahead of a newer input error.
function status(message:string,kind:'success'|'warning'|'error'='success',key:'operation'|'storage'='operation'){if(key==='storage'){if(storageMessage===message)return;storageMessage=message;}notify(message,kind,key);}
function protectedStorage(){status('前回の表示を復元できません。再読み込みして、もう一度お試しください。','error','storage');}
function conflictedStorage(){status('別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。','error','storage');}
function markChanged(){if(!restoring){revision++;saveStateChrome();}}
function beforeUnsavedLeave(event:BeforeUnloadEvent){event.preventDefault();event.returnValue=true;}
function saveStateChrome(){
  const unsaved=revision>savedRevision||pendingWrites>0||!!closing||documentSaving||unsavedDrafts.size>0||draftDirty||saveFailed||saveConflict;
  const warning=!restoring&&unsaved;
  if(warning!==leaveWarning){leaveWarning=warning;window[warning?'addEventListener':'removeEventListener']('beforeunload',beforeUnsavedLeave);}
  const mode=restoring?'restoring':restoreFailed?'protected':saveConflict?'conflict':saveFailed?'error':draftDirty||unsavedDrafts.size>0?'draft':pendingWrites>0||documentSaving?'saving':revision>savedRevision?'dirty':savedOnce?'saved':'unchanged';
  if(app.dataset.saveState!==mode)app.dataset.saveState=mode;
  if(restoreFailed)protectedStorage();
  else if(saveConflict)conflictedStorage();
  else if(saveFailed)status('表示を次回に引き継げません。この画面では引き続き閲覧できます。','error','storage');
  else status('','success','storage');
  displaySettingsChrome();
}
function saveFailure(_error:unknown){saveFailed=true;storageMessage="";}

function ensureWritable(){if(restoreFailed)throw Error('前回の表示を復元できません。再読み込みして、もう一度お試しください。');if(saveConflict)throw new SessionConflictError();}
async function writeSnapshot(snapshot:Session|WorkspaceSnapshot){ensureWritable();try{await saveSession(snapshot);}catch(error){if(error instanceof SessionConflictError){saveConflict=true;clearTimeout(timer);timer=undefined;conflictedStorage();}throw error;}}
function queueSnapshot(snapshot:Session|WorkspaceSnapshot,version:number){
  pendingWrites++;queuedRevisions.add(version);saveStateChrome();
  const write=saving.catch(()=>{}).then(()=>writeSnapshot(snapshot)).then(()=>{
    savedRevision=Math.max(savedRevision,version);savedOnce=true;acknowledgeDrafts(snapshot);
    if(savedRevision===revision){saveFailed=false;}
  },error=>{saveFailure(error);throw error;}).finally(()=>{pendingWrites--;queuedRevisions.delete(version);saveStateChrome();});
  saving=write.catch(()=>{});return write;
}
function persist(delay=180,changed=true){
  if(restoring)return;if(changed)revision++;clearTimeout(timer);timer=undefined;
  if(restoreFailed){protectedStorage();saveStateChrome();return;}if(saveConflict){conflictedStorage();saveStateChrome();return;}
  if(closing||documentSaving||queuedRevisions.has(revision)||(!changed&&revision<=savedRevision&&!saveFailed)){saveStateChrome();return;}
  const write=()=>{timer=undefined;let snapshot:WorkspaceSnapshot;try{snapshot=structuredClone(snapshotWorkspace(state));}catch(error){saveFailure(error);saveStateChrome();return;}
    void queueSnapshot(snapshot,revision).catch(()=>saveStateChrome());};
  // Lifecycle flushing starts queued work now, but does not invent a new edit.
  if(delay===0)write();else timer=window.setTimeout(write,delay);
  saveStateChrome();
}
async function closeTab(t:Tab){
 if(restoring||closing||documentSaving||!state.tabs.includes(t))return;
 if(viewTarget(t)===undefined){shell?.closeBusinessOverview();return;}
 touch.cancel();capture();
 const wasActive=state.active===t.key,next={...state,tabs:state.tabs.filter(x=>x!==t),active:wasActive?state.tabs[0]?.key:state.active};
 try{await saveDocument(()=>next,()=>{state=next;});if(wasActive&&app.dataset.workspaceArea==='business')shell?.businessActivated();}catch{saveStateChrome();}
}
// Empty presentation hides graph-only controls without changing drawer preferences.
function chrome(){$('drawer').setAttribute('aria-label','業務内容開閉');$('formattedMarkdownDrawer').setAttribute('aria-label','選択項目の業務内容');const hasTab=!!current(),drawerOpen=hasTab&&state.drawer,listOpen=hasTab&&!!state.nodeDrawer;document.querySelector<HTMLElement>('.toolbar')!.hidden=!hasTab;if(!hasTab)displaySettingsOpen=false;displaySettingsChrome();$('layout-lock').replaceChildren(icon(layoutLocked?LockKeyhole:LockKeyholeOpen));$('layout-lock').setAttribute('aria-pressed',String(layoutLocked));$('layout-lock').title=layoutLocked?'配置をロック中。項目の上から図をスクロールできます。':'配置を調整中。項目をドラッグして移動できます。';$('layout-lock').toggleAttribute('disabled',restoring);$('viewport').dataset.layoutLocked=String(layoutLocked);$<HTMLInputElement>('prefer-write').checked=state.preferWrite===true;$<HTMLInputElement>('prefer-write').disabled=restoring;$<HTMLInputElement>('show-exceptions').checked=current()?.showExceptions!==false;$<HTMLInputElement>('show-exceptions').disabled=restoring||documentSaving||!current()||closing===current();$<HTMLInputElement>('selected-edges-only').checked=current()?.selectedEdgesOnly===true;$<HTMLInputElement>('selected-edges-only').disabled=restoring||documentSaving||!current()||closing===current();document.documentElement.dataset.theme=state.dark?'dark':'light';$('theme').replaceChildren(icon(state.dark?Sun:Moon));$('formattedMarkdownDrawer').hidden=!drawerOpen;$('formattedMarkdownDrawer').style.width=Math.max(260,Math.min(state.width,innerWidth*.65))+'px';$('drawer').setAttribute('aria-expanded',String(drawerOpen));$('drawer').toggleAttribute('disabled',restoring||!hasTab);$('node-list-drawer').hidden=!listOpen||listView().mode!=='findings';$('node-list-toggle').setAttribute('aria-expanded',String(listOpen));$('node-list-toggle').toggleAttribute('disabled',restoring||!hasTab);shell?.syncChrome();}
// Keep expansion ephemeral: it never changes graph data or stored preferences.
function imageExportChrome(){for(const id of ['save-image','copy-image']){const button=$<HTMLButtonElement>(id);button.hidden=!current();button.disabled=exportingImage||restoring||!current()||closing===current();button.setAttribute('aria-busy',String(exportingImage));}}
function displaySettingsChrome(){
  imageExportChrome();
  document.querySelector<HTMLElement>('.toolbar')!.dataset.settingsOpen=String(displaySettingsOpen);
  $('display-options').hidden=!displaySettingsOpen;
  $<HTMLButtonElement>('reset-layout').disabled=restoring||opening||documentSaving||!!closing||!current()||updating.has(state.document?.key??'')||restoreFailed||saveConflict;
  const button=$<HTMLButtonElement>('display-settings-toggle'),base=displaySettingsOpen?'表示設定を閉じる':'表示設定を開く',label=base;
  button.setAttribute('aria-expanded',String(displaySettingsOpen));button.setAttribute('aria-label',label);button.title=label;button.disabled=restoring||documentSaving||!current()||closing===current();
}
function setDisplaySettings(open:boolean,focus=false){
  const t=current();if(restoring||documentSaving||!t||closing===t||open===displaySettingsOpen)return;
  // Yield the temporary onboarding space when graph settings are requested.
  if(open){checkFollowups.delete(documentForView(t)?.key??t.key);followupChrome();}
  touch.cancel();pan=undefined;capture();displaySettingsOpen=open;displaySettingsChrome();layoutCanvas(t);
  if(!open&&(focus||$('display-options').contains(document.activeElement)))$('display-settings-toggle').focus({preventScroll:true});
}
async function exportGraphImage(copy:boolean){
  const t=current();if(exportingImage||restoring||!t||closing===t)return;
  exportingImage=true;imageExportChrome();
  try{
    const image=snapshotGraph($('nodes'),$('edges') as unknown as SVGSVGElement,getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
    if(copy){await copyGraphPng(image);status('グラフ全体のPNGをコピーしました。');}else await saveGraphPng(image,(documentForView(t)?.name??t.name)+(viewTarget(t)?' - '+viewTarget(t):''));
  }catch(error){status((copy?'画像をコピーできません: ':'画像を保存できません: ')+(error as Error).message,'error');}
  finally{exportingImage=false;imageExportChrome();}
}
$('save-image').onclick=()=>exportGraphImage(false);
$('copy-image').onclick=()=>exportGraphImage(true);
$('display-settings-toggle').onclick=()=>setDisplaySettings(!displaySettingsOpen);
$('reset-layout').onclick=()=>{
  const t=current();if(restoring||opening||documentSaving||closing||!t||updating.has(documentKey(t)))return;
  try{ensureWritable();}catch{saveStateChrome();return;}
  // Stop every gesture before replacing positions so late pointer events cannot
  // move the reset graph. The layout lock itself remains the user's choice.
  touch.cancel();nodeDrag.cancel();pan=undefined;capture();
  const resetInput={...t,design:viewDesign(t)},next=resetLayout(resetInput);if(next!==resetInput){t.positions=next.positions;t.scroll=next.scroll;t.zoom=next.zoom;t.viewInset=next.viewInset;t.canvasOrigin=next.canvasOrigin;}
  // Even initial coordinates can retain routes computed during an earlier drag.
  routeCache.invalidate(t);render();if(next!==resetInput)persist();
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&displaySettingsOpen&&$('source-dialog').hidden){e.preventDefault();setDisplaySettings(false,true);}});
// Capture may precede the native scroll event (for example a toolbar click).
function capture(track=true){const t=current();if(!t)return false;const scroll:Point=[$('viewport').scrollLeft,$('viewport').scrollTop],changed=t.scroll[0]!==scroll[0]||t.scroll[1]!==scroll[1];t.scroll=scroll;if(changed&&track){markChanged();persist(180,false);}return changed;}
function retainFocus(update:()=>void){
  const active=document.activeElement as HTMLElement|null;
  const tab=active?.closest<HTMLElement>('.tab')?.dataset.key;
  const close=active?.classList.contains('close');
  update();
  if(tab)Array.from(document.querySelectorAll<HTMLElement>('.tab')).find(e=>e.dataset.key===tab)?.querySelector<HTMLElement>(close?'.close':'button')?.focus({preventScroll:true});
}
function renderTabs(){sourceDropdown.close();checksDropdown.close();followupDropdown.close();documentActions.close();retainFocus(buildTabs);documentActions.update();}
function buildTabs(){const root=$('tabs');root.replaceChildren();state.tabs.forEach(t=>{const wrap=document.createElement('div');wrap.className='tab'+(t.key===state.active?' active':'');wrap.draggable=viewTarget(t)!==undefined;wrap.dataset.key=t.key;wrap.dataset.viewKind='business';if(viewActivity(t)!==undefined)wrap.dataset.activity=viewActivity(t)!;if(viewObject(t)!==undefined)wrap.dataset.object=viewObject(t)!;const b=document.createElement('button');viewTabLabel(b,'business',t.name);b.setAttribute('aria-current',String(t.key===state.active));b.disabled=documentSaving;b.onclick=async()=>{if(documentSaving)return;if(sourceTarget&&sourceTarget!==t.key&&!await closeSource())return;const changed=capture()||state.active!==t.key;shell?.activateBusiness();state.active=t.key;render();shell?.businessActivated();persist(180,changed);};const close=viewTabClose('業務設計：'+t.name+'を閉じる');close.disabled=!!closing||documentSaving;close.onclick=()=>closeTab(t);wrap.append(b,close);wrap.ondragstart=e=>e.dataTransfer?.setData('text/plain',t.key);wrap.ondragover=e=>e.preventDefault();wrap.ondrop=e=>{e.preventDefault();if(documentSaving)return;const from=state.tabs.findIndex(x=>x.key===e.dataTransfer?.getData('text/plain')),to=state.tabs.indexOf(t);if(from>0&&to>0&&from!==to){const [m]=state.tabs.splice(from,1);state.tabs.splice(to,0,m);renderTabs();persist();}};wrap.onkeydown=e=>{if(documentSaving)return;if(e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();const i=state.tabs.indexOf(t),j=i+(e.key==='ArrowLeft'?-1:1);if(i>0&&j>0&&j<state.tabs.length){[state.tabs[i],state.tabs[j]]=[state.tabs[j],state.tabs[i]];renderTabs();persist();}}};root.append(wrap);});}
const checkViews=new Map<string,CheckViewState>();
// Read-time guidance is deliberately transient: restoring a session never re-offers it.
const checkFollowups=new Set<string>();
function followupChrome(){
  const t=current(),visible=!!t&&t.design.sourceFormat!=='json'&&checkFollowups.has(documentForView(t)?.key??t.key)&&!t.checks;
  if(!visible){followupDropdown.close();if(checkFollowup.contains(document.activeElement))$('viewport').focus({preventScroll:true});}
  checkFollowup.hidden=!visible;
  for(const id of ['check-followup-open','check-followup-later'])$<HTMLButtonElement>(id).disabled=restoring||opening||documentSaving||!!closing||!t||checkState(t).busy===true;
}
$('check-followup-later').onclick=()=>{const t=current();if(t)checkFollowups.delete(documentForView(t)?.key??t.key);followupChrome();};
let nextCheckOpener:HTMLElement|undefined;
for(const [from,to] of [['file','check-open'],['url','check-open-url'],['sample','check-open-sample']])$('check-followup-'+from).onclick=()=>{nextCheckOpener=$('check-followup-open');$(to).click();nextCheckOpener=undefined;};
function isSample(t:Tab){return t.source?.kind==='sample'&&!t.edited&&t.design.markdown===legacySampleMarkdown;}
function checkState(t:Tab){const key=documentForView(t)?.key??t.key;let v=checkViews.get(key);if(!v){v={mode:'business'};checkViews.set(key,v);}return v;}
async function saveChecks(t:Tab,checks:RelatedChecks|undefined){
  if(!isCurrentDocument(t))throw Error('原本文書が切り替わりました。');

  const next=createWorkspace(state,state.recovery,{...state.document!,checks},snapshotWorkspace(state).views);await saveDocument(()=>next,()=>{state=next;if(checks)checkFollowups.delete(documentForView(t)?.key??t.key);});
}
async function readChecks(t:Tab,read:()=>Promise<RelatedChecks>){
  const v=checkState(t);if(t.design.sourceFormat==='json'||v.busy||documentSaving||restoring||closing===t)return;
  const original=confirmationKey(t);v.busy=true;v.error=undefined;v.candidate=undefined;detail();
  try{
    const checks=await read();if(!isCurrentDocument(t))return;
    if(original!==confirmationKey(state.tabs[0]))throw Error('読込中にBDが更新されました。関連Checkを再指定してください。');
    const doc=readRelatedChecks(checks),match=checkCompatibility(doc,state.tabs[0]);
    if(match.state==='mismatch')throw Error('この業務設計書に対応するCheck Itemとは確認できません。'+match.reason);
    if(match.state==='unverified'){v.candidate=checks;v.mode='checks';}
    else{await saveChecks(t,checks);v.candidate=undefined;v.mode='checks';}
  }catch(e){v.error='関連Checkを読み込めません。現在の関連付けとBDは保持しています: '+(e as Error).message;status(v.error,'error');}
  finally{v.busy=false;detail();}
}
async function confirmChecks(t:Tab,candidate:RelatedChecks){
  const v=checkState(t);if(v.busy||documentSaving)return;
  if(!isCurrentDocument(t))return;const match=checkCompatibility(readRelatedChecks(candidate),state.tabs[0]);if(match.state==='mismatch'){v.error=match.reason;detail();return;}
  v.busy=true;v.error=undefined;
  try{await saveChecks(t,{...candidate,confirmedFor:confirmationKey(state.tabs[0])});v.candidate=undefined;v.mode='checks';}
  catch(e){v.error='関連Checkを開けません: '+(e as Error).message;}
  finally{v.busy=false;detail();}
}
function detail(){
  followupChrome();
  const t=current(),root=$('detail'),view=t?checkState(t):undefined,key=t?t.key+':'+(t.selected??'')+':'+view!.mode:'';
  $<HTMLButtonElement>('open-checks').disabled=restoring||documentSaving||closing===t||!t||view?.busy===true;
  const focus=root.contains(document.activeElement)?(document.activeElement as HTMLElement)?.id:undefined;
  const scroll=root.dataset.contentKey===key?root.scrollTop:0;root.replaceChildren();root.dataset.contentKey=key;if(!t)return;
  const n=t.design.graph.nodes.find(n=>n.id===t.selected);
  const panel=checkView(t,view!,{disabled:restoring||documentSaving||closing===t,redraw:detail,confirm:candidate=>{void confirmChecks(t,candidate);}});
  const heading=document.createElement('div');heading.className='right-drawer-heading';heading.append(detailHeading(n?.name??'業務設計'));const close=document.createElement('button');close.type='button';close.id='business-drawer-close';close.setAttribute('aria-label','右ドロワーを閉じる');close.textContent='×';close.onclick=()=>{$('drawer').click();$('drawer').focus({preventScroll:true});};heading.append(close);
  root.append(heading,panel.controls,panel.content??businessDetail(t.design,n?.id));root.scrollTop=scroll;if(focus)document.getElementById(focus)?.focus({preventScroll:true});
}
type Category='activity'|'object'|'role';
const listViews=new Map<string,{category:Category;search:string;collapsed:Set<string>;mode:'items'|'findings';resolved:boolean;finding?:FindingSelection;filterNode?:string}>();
const listView=()=>{const key=state.active??'';let value=listViews.get(key);if(!value){value={category:'activity',search:'',collapsed:new Set(),mode:'items',resolved:false};listViews.set(key,value);}return value;};
function openFinding(selection:FindingSelection){if(!current())return;const view=listView();view.mode='findings';view.finding=selection;state.nodeDrawer=true;if(innerWidth<=800)state.drawer=false;chrome();renderNodeList();$('node-list').querySelector<HTMLElement>('.finding-back')?.focus({preventScroll:true});persist();}
function openNodeFindings(id:string){const t=current();if(!t)return;const view=listView();view.mode='findings';view.filterNode=id;view.finding=undefined;const options:FindingSelection[]=(t.design.findings??[]).filter(f=>f.status==='open'&&f.targets.includes(id)).map(f=>({type:'finding',id:f.id}));if(t.design.graph.nodes.some(n=>n.id===id&&typeof n.problem==='string'))options.unshift({type:'problem',id});if(options.length===1){openFinding(options[0]);return;}state.nodeDrawer=true;if(innerWidth<=800)state.drawer=false;chrome();renderNodeList();$('drawer-mode-findings').focus({preventScroll:true});persist();}

function renderFindingDetail(t:Tab,root:HTMLElement):boolean{
 const selected=listView().finding;if(!selected)return false;
 const finding=selected.type==='finding'?t.design.findings?.find(f=>f.id===selected.id):undefined,node=selected.type==='problem'?t.design.graph.nodes.find(n=>n.id===selected.id&&typeof n.problem==='string'):undefined;
 if(!finding&&!node){listView().finding=undefined;return false;}
 const back=document.createElement('button');back.className='node-navigate finding-back';back.textContent='← 指摘一覧に戻る';back.onclick=()=>{listView().finding=undefined;renderNodeList();$('drawer-mode-findings').focus({preventScroll:true});};root.append(back);
 if(finding)root.append(findingCard(finding));else{const h=document.createElement('h2');h.textContent=`困りごと · ${node!.name}（${String(node!.pain_level)}）`;root.append(h,formattedMarkdown(String(node!.problem)));}
 const targets=finding?.targets??[node!.id];if(targets.length){const group=document.createElement('section');const h=document.createElement('h3');h.textContent='関連項目へ移動';group.append(h);for(const id of targets){const button=document.createElement('button');button.className='node-navigate finding-target-link';button.dataset.findingTarget=id;const exists=t.design.graph.nodes.some(n=>n.id===id),hidden=t.hiddenNodes?.includes(id);button.disabled=!exists||!!hidden;button.textContent=(t.design.graph.nodes.find(n=>n.id===id)?.name??id)+(!exists?'（参照先なし）':hidden?'（非表示）':'');button.onclick=()=>navigateNode(id,true);group.append(button);}root.append(group);}return true;
}
function roleBadge(who:string,id?:string){let hash=0;for(const c of who)hash=(hash*31+c.codePointAt(0)!)>>>0;const badge=document.createElement('span');badge.className='who-badge';badge.style.setProperty('--role-color',(id&&current()?.design.model?.business.roles?(activityRole(current()!.design,id)?.color??'var(--line)'):undefined)??['#8b5cf6','#2563eb','#c2410c','#008576','#be185d'][hash%5]);badge.setAttribute('aria-hidden','true');badge.append(icon(UserRound));return badge;}
function setNodeDrawer(open:boolean,focus=true){if(restoring||!current())return;touch.cancel();capture();state.nodeDrawer=open;if(open&&listView().mode==='findings'&&innerWidth<=800)state.drawer=false;chrome();if(open&&current()?.selected)revealListNode(current()!.selected!);renderNodeList();if(focus)(open?$('node-list-close'):$('node-list-toggle')).focus({preventScroll:true});persist();}
function revealListNode(id:string){const t=current(),n=t?.design.graph.nodes.find(n=>n.id===id);if(!n)return;const view=listView();if(view.category!=='role'||n.type!=='business')view.category=n.type==='business'?'activity':'object';view.collapsed.delete(roleGroupKey(t!.design,n.id,String(n.who)));if(!n.name.toLocaleLowerCase().includes(view.search.toLocaleLowerCase()))view.search='';requestAnimationFrame(()=>{const row=Array.from($('node-list').querySelectorAll<HTMLElement>('[data-list-node]')).find(e=>e.dataset.listNode===id);row?.scrollIntoView?.({block:'nearest',inline:'nearest'});});}
function changeVisibility(ids:string[],visible:boolean){const t=current();if(!t||restoring||documentSaving||closing===t)return;touch.cancel();pan=undefined;capture();const hidden=new Set(t.hiddenNodes??[]);for(const id of ids)visible?hidden.delete(id):hidden.add(id);t.hiddenNodes=[...hidden];graph();persist();}
function navigateNode(id:string,keepFinding=false){let t=current();if(t&&!viewDesign(t).graph.nodes.some(n=>n.id===id)){capture();shell?.reopenBusinessOverview();state.active=state.tabs[0].key;t=current();render();}if(!t||t.hiddenNodes?.includes(id)||closing===t)return;if(!keepFinding)listView().finding=undefined;const focusInList=$('node-list').contains(document.activeElement);touch.cancel();pan=undefined;capture();t.selected=id;revealListNode(id);chrome();graph();const viewport=$('viewport'),rect=viewport.getBoundingClientRect(),right=$('formattedMarkdownDrawer').getBoundingClientRect();const visibleRight=state.drawer&&right.left>rect.left&&right.left<rect.right?right.left:rect.right;const visibleWidth=Math.max(1,Math.min(viewport.clientWidth,visibleRight-rect.left-viewport.clientLeft)),visibleHeight=viewport.clientHeight;t.viewInset=[viewport.clientWidth/(2*t.zoom),viewport.clientHeight/(2*t.zoom)];const p=t.positions[id];t.scroll=[(p[0]+130+t.viewInset[0]+(t.canvasOrigin?.[0]??0))*t.zoom-visibleWidth/2,(p[1]+34+t.viewInset[1]+(t.canvasOrigin?.[1]??0))*t.zoom-visibleHeight/2];layoutCanvas(t);viewport.scrollLeft=t.scroll[0];viewport.scrollTop=t.scroll[1];capture();if(focusInList){const selector=keepFinding?'[data-finding-target]':'[data-list-node]';const target=Array.from($('node-list').querySelectorAll<HTMLElement>(selector)).find(e=>(keepFinding?e.dataset.findingTarget:e.dataset.listNode)===id);(keepFinding?target:target?.querySelector<HTMLElement>('.node-navigate'))?.focus({preventScroll:true});}persist();}
function renderNodeList(){
 const t=current(),view=listView(),root=$('node-list'),listScroll=root.scrollTop,active=document.activeElement as HTMLElement|null,focusedID=active?.closest<HTMLElement>('[data-list-node]')?.dataset.listNode,focusedEye=active?.hasAttribute('data-node-visibility'),focusedRole=active?.dataset.role;
 const modes=$('drawer-modes');modes.replaceChildren();
 for(const mode of ['findings'] as const){const button=document.createElement('button');button.id='drawer-mode-'+mode;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(view.mode===mode));button.setAttribute('aria-controls','node-list');button.tabIndex=view.mode===mode?0:-1;button.textContent=`指摘（${t?findingsCount(t.design):0}）`;const choose=()=>{view.mode=mode;renderNodeList();$('drawer-mode-'+mode).focus({preventScroll:true});};button.onclick=choose;button.onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();button.focus({preventScroll:true});}};modes.append(button);}
 for(const control of [$('node-categories'),$('node-list-search'),document.querySelector<HTMLElement>('.scope-bulk')!])control.hidden=view.mode==='findings';

 root.setAttribute('aria-label',view.category==='activity'?'Activity一覧':view.category==='object'?'Object一覧':'ロール一覧');
 const search=$<HTMLInputElement>('node-list-search');search.value=view.search;search.disabled=!t||restoring;
 const categories=$('node-categories');categories.replaceChildren();for(const [category,label] of [['activity','Activity'],['object','Object'],['role','ロール']] as const){const button=document.createElement('button');button.dataset.category=category;button.id='node-category-'+category;button.setAttribute('role','tab');button.setAttribute('aria-selected',String(view.category===category));button.setAttribute('aria-controls','node-list');button.tabIndex=view.category===category?0:-1;button.textContent=label;button.onclick=()=>{view.category=category;renderNodeList();$('node-category-'+category).focus({preventScroll:true});};button.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const keys:Category[]=['activity','object','role'],index=keys.indexOf(category);view.category=e.key==='Home'?'activity':e.key==='End'?'role':keys[(index+(e.key==='ArrowRight'?1:2))%3];renderNodeList();$('node-category-'+view.category).focus({preventScroll:true});};categories.append(button);}
 root.setAttribute('aria-labelledby','node-category-'+view.category);root.replaceChildren();const hidden=new Set(t?.hiddenNodes??[]),outside=t?.design.graph.nodes.filter(n=>!n.scope)??[],count=outside.filter(n=>!hidden.has(n.id)).length,bulk=$<HTMLButtonElement>('scope-outside');const pressed=count===outside.length?'true':count===0?'false':'mixed';bulk.setAttribute('aria-pressed',pressed);bulk.setAttribute('aria-label',pressed==='true'?'スコープ外を非表示':'スコープ外を表示');bulk.replaceChildren(icon(pressed==='false'?EyeOff:Eye));bulk.disabled=!outside.length||restoring||closing===t;const scopeShortcut=$<HTMLInputElement>('show-outside');scopeShortcut.checked=pressed==='true';scopeShortcut.indeterminate=pressed==='mixed';scopeShortcut.setAttribute('aria-checked',pressed);scopeShortcut.disabled=bulk.disabled;$('scope-count').textContent=pressed==='mixed'?`${count}/${outside.length} 表示`:'';
 if(view.mode==='findings'){root.setAttribute('aria-labelledby','drawer-mode-findings');root.setAttribute('aria-label','指摘一覧');root.replaceChildren();if(t){if(renderFindingDetail(t,root)){root.setAttribute('aria-label','指摘詳細');root.scrollTop=listScroll;return;}if(view.filterNode){const caption=document.createElement('p');caption.textContent=(t.design.graph.nodes.find(n=>n.id===view.filterNode)?.name??view.filterNode)+'の指摘';const all=document.createElement('button');all.className='node-navigate finding-all';all.textContent='すべての指摘';all.onclick=()=>{view.filterNode=undefined;renderNodeList();$('drawer-mode-findings').focus({preventScroll:true});};root.append(caption,all);}root.append(findingsIndex(t.design,view.resolved,show=>{view.resolved=show;renderNodeList();root.querySelector<HTMLInputElement>('input')?.focus({preventScroll:true});},openFinding,view.filterNode));}root.scrollTop=listScroll;return;}
 if(!t){root.textContent='文書を開くと項目が表示されます。';return;}
 root.textContent='グラフの指摘から対象を選択してください。';
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
const matrixPlans=new WeakMap<object,MatrixPlan>();
function viewMatrix(projected:Tab['design']):MatrixWire[]|undefined{
 if(!isMatrixGraph(projected.graph))return;
 let plan=matrixPlans.get(projected);
 if(!plan){plan=matrixPlanForDesign(projected);matrixPlans.set(projected,plan);}
 return plan.wires;
}
/** Paint short runs directly: no offscreen mask surfaces on long graphs.
 * The original edge retains native geometry, title and arrow. Only its stroke
 * is transparent; coordinate-phased runs supply the visible stroke.
 */
function paintException(path:SVGElement,route:import('./routing.ts').EdgeRoute,index:number){paintGraphException($('edges'),path,route,{'data-relation':String(index)});}

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
  const {growth,origin}=cameraOrigin(previous,minimum,t.zoom),shifted=growth.some(Boolean);
  // Integer screen-pixel additions avoid native scroll rounding causing a jump.
  if(shifted){t.canvasOrigin=origin;t.scroll=[t.scroll[0]+growth[0],t.scroll[1]+growth[1]];markChanged();persist(180,false);}
  const width=Math.ceil(Math.max(1400,edgeExtent[0],(cameraViewportWidth()+t.scroll[0])/t.zoom-inset[0]*2-origin[0],...positions.map(p=>p[0]+340)));
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
function buildGraph(){displaySettingsChrome();nodeDrag.cancel();redrawEdges=()=>{};edgeExtent=[0,0];edgeMinimum=[0,0];const t=current();$('nodes').replaceChildren();$('edges').replaceChildren();$('empty').hidden=!!t;$('canvas').hidden=!t;if(!t){
  // The last tab was captured and saved before this presentation-only reset.
  // Remove the old world's scroll extent without changing its saved camera.
  $('viewport').scrollLeft=0;$('viewport').scrollTop=0;detail();renderNodeList();return;
}const projected=viewDesign(t),allNodes=projected.graph.nodes,nodes=allNodes.filter(n=>!t.hiddenNodes?.includes(n.id)),visibleIDs=new Set(nodes.map(n=>n.id));if(t.selected&&!visibleIDs.has(t.selected))t.selected=undefined;const selected=t.selected,positions=t.positions,focus=graphFocus(projected.graph.relations,selected);
  layoutCanvas(t);
  $('edges').append(graphMarkers());

  const hiddenReads=hiddenReadIndexes(projected.graph.relations,state.preferWrite===true);
  const drawEdges=()=>{const boxes=allNodes.flatMap(n=>{const p=positions[n.id];return p?[{id:n.id,x:p[0],y:p[1],width:260,height:68}]:[];}),matrix=viewMatrix(projected),routes=routeCache.update(t,projected,boxes,projected.graph.relations,matrix),captions=new Map<string,SVGElement>();edgeExtent=[0,0];edgeMinimum=[0,0];while($('edges').childNodes.length>1)$('edges').lastChild!.remove();
  const displayNames=new Map(t.design.graph.nodes.map(n=>[n.id,n.name]));projected.graph.relations.forEach((r,i)=>{if(hiddenReads.has(i))return;const route=routes[i];if(!route)return;edgeExtent[0]=Math.max(edgeExtent[0],route.bounds.right+20,route.label[0]+Math.max(30,r.label.length*12)/2+12);edgeExtent[1]=Math.max(edgeExtent[1],route.bounds.bottom+20,route.label[1]+22);edgeMinimum[0]=Math.min(edgeMinimum[0],...route.points.map(p=>p[0]-20),route.label[0]-Math.max(30,r.label.length*12)/2-12);edgeMinimum[1]=Math.min(edgeMinimum[1],...route.points.map(p=>p[1]-20),route.label[1]-22);if((t.selectedEdgesOnly===true&&focus.muted(r))||!visibleIDs.has(r.from)||!visibleIDs.has(r.to)||(t.showExceptions===false&&(r.kind==='business-exception'||r.kind==='object-exception')))return;const path=svg('path');path.setAttribute('d',route.path);path.dataset.relation=String(i);path.dataset.collisions=String(route.collisions);path.dataset.rerouted=String(route.rerouted);path.dataset.fallback=String(route.fallback);path.setAttribute('marker-end','url(#arrow)');path.classList.add('edge');if(r.kind.endsWith('exception'))path.classList.add('exception');if(focus.related(r)){path.classList.add('review-related');path.setAttribute('marker-end','url(#related-arrow)');}if(focus.muted(r))path.classList.add('muted');const title=svg('title');title.textContent=(displayNames.get(r.from)??r.from)+' → '+(displayNames.get(r.to)??r.to)+': '+r.label;path.append(title);$('edges').append(path);if(r.kind.endsWith('exception'))paintException(path,route,i);const key=captionKey(r,i,matrix?.[i]),shared=captions.get(key);if(shared){shared.dataset.relations+=' '+i;if(focus.related(r)){shared.classList.add('review-related');shared.classList.remove('muted');}return;}const label=svg('text');captions.set(key,label);label.dataset.relations=String(i);label.setAttribute('x',String(route.label[0]-Math.max(30,r.label.length*12)/2));label.setAttribute('y',String(route.label[1]));label.setAttribute('text-anchor','start');label.classList.add('edge-label');label.setAttribute('dominant-baseline','middle');label.dataset.relation=String(i);if(focus.related(r))label.classList.add('review-related');if(focus.muted(r))label.classList.add('muted');label.textContent=r.label;$('edges').append(label);});const root=$('edges');for(const e of [...Array.from(root.querySelectorAll('.edge:not(.review-related),.edge-paint:not(.review-related)')),...Array.from(root.querySelectorAll('.edge-label:not(.review-related)')),...Array.from(root.querySelectorAll('.edge.review-related,.edge-paint.review-related')),...Array.from(root.querySelectorAll('.edge-label.review-related'))])root.append(e);layoutCanvas(t);};redrawEdges=drawEdges;drawEdges();
  nodes.forEach(n=>{const b=document.createElement('div');b.setAttribute('role','group');b.className='node '+n.type+(n.scope?'':' outside')+focus.nodeClasses(n.id);b.dataset.node=n.id;if(n.type==='business')b.dataset.activity=n.id;b.style.left=positions[n.id][0]+'px';b.style.top=positions[n.id][1]+'px';const key=String(n.icon??'file-question').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('') as keyof typeof icons;const image=icon(n.type==='business'?UserRound:icons[key]??Box);if(n.type==='business')b.append(roleBadge(String(n.who),n.id));else b.append(image);const text=document.createElement('span');text.className='node-text';const kind=document.createElement('span');kind.className='review-kind';kind.textContent=(n.type==='business'?'Activity':'Object')+(n.scope?' · 範囲内':' · 範囲外');text.append(kind);const name=document.createElement('span');name.className='node-name';name.textContent=n.name;text.append(name);if(n.type==='business'){const who=document.createElement('small');who.textContent=String(n.who);text.append(who);}b.append(text);if(canOpenDetail(n.id,viewTarget(t))){const open=document.createElement('button');open.type='button';open.className=n.type==='business'?'activity-open':'object-open';open.setAttribute('aria-label',n.name+'の詳細タブを開く');open.title='詳細タブを開く';open.append(icon(icons.SquareArrowOutUpRight));open.onpointerdown=e=>e.stopPropagation();open.onpointerup=e=>e.stopPropagation();open.onclick=e=>{e.stopPropagation();if(n.type==='business')activateActivity(n.id);else activateObject(n.id);shell?.businessActivated();};b.append(open);}b.title=n.name+(n.type==='business'?' — '+String(n.who):'');b.setAttribute('aria-label',b.title+(n.id===selected?'（選択中）':''));const labels=nodeFindingLabels(t.design,n);if(labels.length){const badges=document.createElement('button');badges.type='button';badges.className='finding-badges';badges.textContent=labels.join(' · ');badges.setAttribute('aria-label',n.name+'の指摘を開く');badges.onpointerdown=e=>e.stopPropagation();badges.onpointerup=e=>e.stopPropagation();badges.onclick=e=>{e.stopPropagation();openNodeFindings(n.id);};b.append(badges);b.setAttribute('aria-label',b.getAttribute('aria-label')+' · '+labels.join('、'));}let pointer:number|undefined;
    const dragTarget=b;
    dragTarget.onpointerdown=e=>{if(e.button!==0||closing===t||layoutLocked)return;e.stopPropagation();dragTarget.setPointerCapture(e.pointerId);pointer=e.pointerId;nodeDrag.begin(n.id,[e.clientX,e.clientY]);};
    dragTarget.onpointermove=e=>{if(pointer===undefined||(e.pointerId!==undefined&&e.pointerId!==pointer)||!b.isConnected||closing===t)return;nodeDrag.move([e.clientX,e.clientY]);};
    dragTarget.onpointerup=e=>{if(pointer===undefined||pointer!==e.pointerId)return;pointer=undefined;if(!b.isConnected||closing===t)return;const drag=nodeDrag.end();if(dragTarget.hasPointerCapture?.(e.pointerId))dragTarget.releasePointerCapture(e.pointerId);if(!drag)return;if(!drag.moved){listView().finding=undefined;if(t.selected!==n.id){t.selected=n.id;markChanged();}revealListNode(n.id);}capture();graph();persist(180,false);};
    const cancel=(e:PointerEvent)=>{if(pointer===undefined||pointer!==e.pointerId)return;pointer=undefined;if(!b.isConnected)return;nodeDrag.cancel();capture();persist(180,false);};
    dragTarget.onpointercancel=cancel;dragTarget.onlostpointercapture=cancel;$('nodes').append(b);});$('zoom').textContent=Math.round(t.zoom*100)+'%';detail();renderNodeList();
}
function activateActivity(name:string){if(restoring||documentSaving||closing)return;capture();openActivity(state,name);render();persist();$('viewport').focus({preventScroll:true});}
function activateObject(id:string){if(restoring||documentSaving||closing)return;capture();openObject(state,id);render();persist();$('viewport').focus({preventScroll:true});}
function render(){document.title=state.document?state.document.name+' · Alder Viewer':'Alder Viewer';touch.cancel();pan=undefined;chrome();renderTabs();graph();const t=current();if(t){$('viewport').scrollLeft=t.scroll[0];$('viewport').scrollTop=t.scroll[1];}$('refresh').toggleAttribute('disabled',restoring||documentSaving||!!closing||!t||t.source?.kind==='text'||t.source?.kind==='sample'||updating.has(documentKey(t)));$('refresh').hidden=!t;$('view-markdown').toggleAttribute('disabled',restoring||opening||documentSaving||!!closing||!t||updating.has(documentKey(t)));$('view-markdown').hidden=!t;$('open-checks').hidden=!t||t.design.sourceFormat==='json';$('open-checks').toggleAttribute('disabled',restoring||opening||documentSaving||!!closing||!t||!!(t&&checkState(t).busy));for(const id of ['open-menu-toggle','open-sample-menu','open','open-url','open-text','guide-open','guide-open-url','guide-open-text'])$(id).toggleAttribute('disabled',restoring||opening||documentSaving);$('open-sample').setAttribute('aria-disabled',String(restoring||opening||documentSaving));$('open-sample').tabIndex=restoring||opening||documentSaving?-1:0;$('theme').toggleAttribute('disabled',restoring);sourceChrome();followupChrome();urlHistoryChrome();updateNoticeChrome();shell?.syncDocument();}
// New documents start with extra camera padding on the left. Reconcile and
// restored tabs keep their existing camera, including an absent legacy inset.
type PickerWindow=Window & {showOpenFilePicker?: (options:unknown)=>Promise<FileSystemFileHandle[]>};
async function openDocument(tab:Tab){
 const previous=state.document;
 const next=replaceWorkspace(state,tab);if(!previous){capture();state=next;checkFollowups.add(documentForView(state.tabs[0])?.key??state.tabs[0].key);render();persist();return true;}await saveDocument(()=>next,()=>{state=next;checkFollowups.add(documentForView(state.tabs[0])?.key??state.tabs[0].key);});return true;
}
async function addFile(file:File,handle?:FileSystemFileHandle){if(sourceTarget&&!await closeSource())return;const design=await loadDocumentFile(file);const existing=current();if(handle&&existing?.handle&&await existing.handle.isSameEntry(handle)){shell?.reopenBusinessOverview();state.active=state.tabs[0].key;render();persist();return;}const tab=reconcile({key:crypto.randomUUID(),name:file.name,design,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle},design);await openDocument(tab);}
$('empty').onpointerdown=e=>e.stopPropagation();
for(const id of ['open','open-url','open-text'])$('guide-'+id).onclick=()=>$(id).click();
$('open-sample').onpointerdown=e=>e.stopPropagation();
$('open-sample').onclick=async e=>{e.preventDefault();if(restoring||opening||documentSaving)return;try{
 if(state.document?.source?.kind==='sample'&&state.document.design.markdown===sampleJSON){capture();shell?.reopenBusinessOverview();state.active=state.tabs[0].key;render();$('viewport').focus({preventScroll:true});return;}
 const design=parseDesign(sampleJSON),previous=state.document?.source?.kind==='sample'&&state.document.design.markdown===legacySampleMarkdown?state.tabs[0]:undefined;
 if(previous)capture();
 const saved=previous??state.sampleLayout,cached=saved?sampleLayoutForDesign(saved,design):{};
 const tab=reconcile({key:crypto.randomUUID(),name:'Alderを使った設計業務',source:{kind:'sample'},design,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...cached},design);
 if(await openDocument(tab))$('viewport').focus({preventScroll:true});
}catch(e){status('サンプルを開けません: '+(e as Error).message,'error');}};
$('open').onclick=async()=>{if(restoring||opening||documentSaving)return;opening=true;render();try{const picker=(window as PickerWindow).showOpenFilePicker;if(picker){const handles=await picker({multiple:false,types:[{description:'Alder Business Design',accept:{'text/markdown':['.md','.markdown'],'application/json':['.json']}}]});for(const h of handles)await addFile(await h.getFile(),h);}else $('fallback').click();}catch(e){if((e as Error).name!=='AbortError')status('開けません: '+(e as Error).message,'error');}finally{opening=false;render();}};
($('fallback') as HTMLInputElement).onchange=async()=>{const input=$('fallback') as HTMLInputElement;if(restoring||opening||documentSaving)return;opening=true;render();try{for(const f of Array.from(input.files??[]))await addFile(f);}catch(e){status('開けません: '+(e as Error).message,'error');}input.value='';opening=false;render();};
// Save a replacement before changing the displayed Graph. A failed transaction
// leaves the old design and the per-tab draft available for an explicit retry.
class DocumentSaveError extends Error{constructor(error:unknown){super(error instanceof Error?error.message:'表示を切り替えられません。');this.name='DocumentSaveError';}}
async function saveDocument(project:()=>Workspace,commit:()=>void){
  if(documentSaving||closing)throw Error('表示を切り替えています。完了後に再試行してください。');
  try{ensureWritable();}catch(error){throw new DocumentSaveError(error);}capture();clearTimeout(timer);timer=undefined;documentSaving=true;revision++;const version=revision;render();saveStateChrome();let saved=false;
  try{
    const snapshot=structuredClone(snapshotWorkspace(project()));await queueSnapshot(snapshot,version);
    const live=state;commit();if(state!==live)state=mergeLiveWorkspace(state,live);if(sourceMode==='view'&&sourceTarget&&!state.tabs.some(t=>t.key===sourceTarget))sourceTarget=state.tabs[0]?.key;acknowledgeDrafts(snapshot);saved=true;
  }catch(error){saveFailure(error);throw new DocumentSaveError(error);}
  finally{documentSaving=false;render();saveStateChrome();if(saved&&revision!==version)persist(0,false);}
}
async function replace(t:Tab,d:ReturnType<typeof parseDesign>,handle=t.handle,edited=false){
 if(!isCurrentDocument(t)||t.design!==state.document?.design)return false;
 const next=updateWorkspace(state,d,handle,edited);
 await saveDocument(()=>next,()=>{state=next;});updateCandidate=undefined;updateNoticeChrome();status('');return true;
}
async function reselect(t:Tab){
  if(!isCurrentDocument(t))return;
  const picker=(window as PickerWindow).showOpenFilePicker;
  if(picker){const [h]=await picker({multiple:false});if(h)await replace(t,await loadDocumentFile(await h.getFile()),h);}
  else await new Promise<void>((resolve,reject)=>{
    const input=document.createElement('input');input.type='file';input.accept='.md,.markdown,.json';input.hidden=true;document.body.append(input);
    const done=()=>{input.remove();resolve();};input.oncancel=done;
    input.onchange=async()=>{try{const f=input.files?.[0];if(f)await replace(t,await loadDocumentFile(f));done();}catch(e){input.remove();reject(e);}};input.click();
  });
}
type PermissionHandle=FileSystemFileHandle & {queryPermission:(o:{mode:'read'})=>Promise<PermissionState>};
$('refresh').onclick=async()=>{
  const t=current();if(restoring||documentSaving||closing||!t||t.source?.kind==='text'||t.source?.kind==='sample'||updating.has(documentKey(t)))return;

  if(sourceTarget===t.key)hideSource();const updatingDocument=documentKey(t);updating.add(updatingDocument);render();
  try{
    if(t.source?.kind==='url'){const d=await loadDocumentURL(t.source.url);await replace(t,d);return;}
    if(!t.handle){await reselect(t);return;}
    const permission=await (t.handle as PermissionHandle).queryPermission({mode:'read'});
    if(!isCurrentDocument(t))return;
    if(permission!=='granted'){status('読取権限がありません。同じMarkdownを再選択してください。','warning');await reselect(t);return;}
    await replace(t,await loadDocumentFile(await t.handle.getFile()));
  }catch(e){if(isCurrentDocument(t)&&(e as Error).name!=='AbortError'&&!(e instanceof DocumentSaveError))status('更新失敗。旧表示を保持しています: '+(e as Error).message,'error');}
  finally{updating.delete(updatingDocument);render();}
};
type SourceMode='url'|'text'|'view';
let sourceMode:SourceMode='text',sourceTarget:string|undefined,sourceBusy=false,sourceToken=0,sourceAbort:AbortController|undefined,sourceOpener:HTMLElement|null=null;
const sourceText=()=>($('source-text') as HTMLTextAreaElement),sourceURL=()=>($('source-url') as HTMLInputElement);
function updateSourceDirty(){draftDirty=!$('source-dialog').hidden&&sourceMode!=='view'&&(sourceMode==='text'?sourceText().value:sourceURL().value)!=='';saveStateChrome();}
sourceURL().addEventListener('input',updateSourceDirty);
function sourceChrome(){
  sharingChrome();
  const view=sourceMode==='view',busy=sourceBusy||documentSaving;sourceText().disabled=busy;sourceText().readOnly=view;
  $('source-dialog').dataset.mode=sourceMode;
  $('source-submit').hidden=view;$('source-submit').textContent='表示';
  $<HTMLButtonElement>('source-submit').disabled=busy||view;$<HTMLButtonElement>('source-cancel').disabled=documentSaving||(busy&&sourceMode!=='url');
  $('source-cancel').textContent=view?'閉じる':'キャンセル';
  updateSourceDirty();queueMicrotask(drainSharedSource);
}
function showSource(mode:SourceMode,target?:Tab){
  if(restoring||opening||documentSaving||(target&&(updating.has(documentKey(target))||!!closing)))return;
  sourceAbort?.abort();sourceToken++;sourceMode=mode;sourceTarget=target?.key;sourceBusy=false;sourceOpener=document.activeElement as HTMLElement;
  $('source-dialog').hidden=false;$('source-title').textContent=target?`${target.design.sourceFormat==='json'?'JSON':'Markdown'}原文 · ${state.document?.name??target.name}`:mode==='url'?'URLを開く':'テキストを入力';
  for(const id of ['url-label','source-url'])$(id).hidden=mode!=='url';for(const id of ['text-label','source-text'])$(id).hidden=mode==='url';
  $('source-help').textContent=mode==='url'?'匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。':mode==='view'?'元ファイルやURLは書き換えません。':'閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。';
  if(target)sourceText().value=target.design.markdown;
  else if(mode==='text')sourceText().value=newTextDraft;
  sourceChrome();(mode==='url'?sourceURL():sourceText()).focus();
}
let newTextDraft='';
let headerRevealFrame:number|undefined;
function restoreSourceOpener(){
  if(sourceOpener?.isConnected)sourceOpener.focus({preventScroll:true});
  if(headerRevealFrame!==undefined)cancelAnimationFrame(headerRevealFrame);
  if(sourceMode!=='view')return;
  const token=sourceToken;
  headerRevealFrame=requestAnimationFrame(()=>{
    headerRevealFrame=undefined;
    if(token!==sourceToken||!$('source-dialog').hidden)return;
    const viewport=window.visualViewport,header=app.querySelector('header')!,rect=header.getBoundingClientRect();
    // A pinched page can remain panned below the header after the modal closes.
    // Reveal only a fully hidden header; leave browser scale and graph camera alone.
    if(viewport&&viewport.height>0&&rect.height>0&&rect.bottom<=viewport.offsetTop)
      header.scrollIntoView({block:'start',inline:'nearest',behavior:'instant'});
  });
}
function hideSource(){sourceToken++;sourceAbort?.abort();sourceBusy=false;sourceTarget=undefined;$('source-dialog').hidden=true;sourceChrome();restoreSourceOpener();}
async function closeSource(){
 if(documentSaving)return false;
 if(sourceMode==='text')newTextDraft=sourceText().value;hideSource();return true;
}
function requestCloseSource(){return closeSource();}
sourceText().oninput=()=>{if(sourceMode==='text'){newTextDraft=sourceText().value;updateSourceDirty();}};
let copyingSource=false;
function sharingReason(){
  if(restoring||opening||sourceBusy||documentSaving||closing)return '読込が終わってから共有してください。';
  return sourceSharingReason(current());
}
function sharingChrome(){
  const reason=sharingReason(),button=$('share-source');button.hidden=!current();
  button.setAttribute('aria-disabled',String(copyingSource||!!reason));
  button.title=reason??'取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。';
}
$('share-source').onclick=async()=>{
  if(copyingSource)return;
  const reason=sharingReason();if(reason){status(reason,'warning');return;}
  const tab=current()!;if(tab.source?.kind!=='url')return;
  const source=tab.source.url,link=createSourceShareLink(location.href,source);copyingSource=true;sharingChrome();
  try{if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');await navigator.clipboard.writeText(link);status('共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: '+source);}
  catch{status('共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。','error');}
  finally{copyingSource=false;sharingChrome();}
};
let sharedSourceAbort:AbortController|undefined,sharedSourceToken=0,sharedSourceNavigation=0,pendingSharedHash:string|undefined;
function drainSharedSource(){if(restoring||opening||sourceBusy||closing||documentSaving||sharedSourceAbort||pendingSharedHash===undefined)return;const hash=pendingSharedHash;pendingSharedHash=undefined;void openSharedSource(hash);}
async function openSharedSource(requestedHash=location.hash){
  // A different explicit navigation supersedes a fetch, but never interrupts a save.
  const hash=requestedHash;if(restoring)return;
  // Expire a prompt-waiting selection without interrupting an atomic save.
  const navigation=++sharedSourceNavigation;
  if(!/^#source(?:=|$)/.test(hash)){pendingSharedHash=undefined;if(sharedSourceAbort&&!documentSaving){sharedSourceAbort.abort();sharedSourceAbort=undefined;sharedSourceToken++;opening=false;render();}return;}
  if(location.hash===hash)history.replaceState(history.state,'',location.pathname+location.search);
  if(documentSaving){pendingSharedHash=hash;return;}
  if(closing||sourceBusy||(opening&&!sharedSourceAbort)){status('読込が終わってから共有リンクを開き直してください。','warning');return;}
  const token=++sharedSourceToken;sharedSourceAbort?.abort();
  try{
    const url=readSharedSource(hash)!;
    ensureWritable();
    const live=state.tabs.find(t=>t.source?.kind==='url'&&t.source.url===url),existing=live;
    if(existing){
      // Revisit selects the saved document, including local edits and its view.
      // Only explicit Refresh may replace it with the source's current content.
      if(sourceTarget&&sourceTarget!==existing.key&&!(await closeSource()))return;
      if(token!==sharedSourceToken||navigation!==sharedSourceNavigation)return;
      const changed=capture()||state.active!==existing.key;
      state.active=existing.key;render();persist(180,changed);
      status('開いている共有元のタブを選択しました。表示内容は保持しています。');
      void checkSourceUpdate();return;
    }
    sharedSourceAbort=new AbortController();opening=true;render();
    const design=await loadDocumentURL(url,sharedSourceAbort.signal);
    if(token!==sharedSourceToken)return;
    const tab=reconcile({key:crypto.randomUUID(),name:new URL(url).pathname.split('/').pop()||'URLのMarkdown',source:{kind:'url',url},design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},design);
    if(!await openDocument(tab))return;
    status('共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: '+url);
  }catch(error){if(token===sharedSourceToken&&!(error instanceof DocumentSaveError))status('共有リンクを開けません。既存の表示は保持しています: '+(error as Error).message,'error');}
  finally{if(token===sharedSourceToken){sharedSourceAbort=undefined;opening=false;render();drainSharedSource();}}
}
window.addEventListener('hashchange',()=>{void openSharedSource().then(()=>{if(state.document?.key===restoredDocumentKey)void checkSourceUpdate();});});
function revealChecks(t:Tab){checkState(t).mode='checks';state.drawer=true;chrome();detail();}
async function closeChecks(t:Tab){const v=checkState(t);if(t.design.sourceFormat==='json'||v.busy||documentSaving||restoring||closing===t)return;v.busy=true;try{await saveChecks(t,undefined);v.candidate=undefined;v.error=undefined;v.url=undefined;}catch(e){v.error=(e as Error).message;}finally{v.busy=false;detail();}}
let checkFileTarget:Tab|undefined;
checkInput.onchange=()=>{const f=checkInput.files?.[0],t=checkFileTarget??current();checkFileTarget=undefined;checkInput.value='';if(!f||!t||!isCurrentDocument(t))return;revealChecks(t);void readChecks(t,async()=>{if(f.size>2*1024*1024)throw Error('本文は2MiB以内にしてください。');return {name:f.name,markdown:await f.text()};});};
checkInput.oncancel=()=>{checkFileTarget=undefined;};
$('check-open').onclick=()=>{checkFileTarget=current();checkInput.click();};
let checkURLTarget:Tab|undefined,checkURLOpener:HTMLElement|null=null;
function closeCheckURL(){checkURLDialog.hidden=true;checkURLTarget=undefined;(checkURLOpener&&!checkURLOpener.closest('[hidden]')?checkURLOpener:$('open-checks').getBoundingClientRect().width?$('open-checks'):$('document-actions-toggle')).focus({preventScroll:true});}
$('check-open-url').onclick=()=>{const t=current();if(!t)return;checkURLOpener=nextCheckOpener??document.activeElement as HTMLElement;checkURLTarget=t;$<HTMLInputElement>('check-url').value=checkState(t).url??'';checkURLDialog.hidden=false;$('check-url').focus();};
$('check-url-cancel').onclick=closeCheckURL;checkURLDialog.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeCheckURL();}};
$<HTMLFormElement>('check-url-form').onsubmit=e=>{e.preventDefault();const t=checkURLTarget;if(!t||!isCurrentDocument(t))return;const url=$<HTMLInputElement>('check-url').value.trim();checkState(t).url=url;closeCheckURL();revealChecks(t);void readChecks(t,async()=>({name:url,url,markdown:await fetchMarkdown(url)}));};
$('check-open-sample').onclick=()=>{const t=current();if(!t||!isSample(t))return;revealChecks(t);void confirmChecks(t,{name:'チェックリストのサンプル',markdown:sampleChecksMarkdown});};
$('check-close').onclick=()=>{const t=current();if(t)void closeChecks(t);};
$('open-sample-menu').onclick=()=>{$('open-sample').click();};
$('view-markdown').onclick=()=>{const t=current();if(t)showSource('view',t);};
$('open-url').onclick=()=>showSource('url');$('open-text').onclick=()=>showSource('text');$('source-cancel').onclick=()=>requestCloseSource();
$('source-dialog').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();void requestCloseSource();}};
$('source-submit').onclick=async()=>{
  if(sourceBusy||documentSaving||(sourceMode==='view'&&closing)||$('source-dialog').hidden||sourceMode==='view')return;
  sourceBusy=true;sourceChrome();const token=++sourceToken,mode=sourceMode;sourceAbort=new AbortController();
  try{
    const url=sourceMode==='url'?new URL(sourceURL().value.trim()).href:sourceURL().value.trim();
    if(mode==='url'&&state.document?.source?.kind==='url'&&state.document.source.url===url){shell?.reopenBusinessOverview();state.active=state.tabs[0].key;hideSource();render();void checkSourceUpdate();return;}
    const design=mode==='url'?await loadDocumentURL(url,sourceAbort.signal):loadDocumentText(sourceText().value);
    const raw=design.markdown;if(token!==sourceToken)return;
    const tab=reconcile({key:crypto.randomUUID(),name:mode==='text'?(design.sourceFormat==='json'?'入力したJSON':'入力したMarkdown'):new URL(url).pathname.split('/').pop()||'URLのMarkdown',source:mode==='text'?{kind:'text'}:{kind:'url',url},design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},design);
    if(!await openDocument(tab))return;status('');if(mode==='text')newTextDraft=raw;
    hideSource();
  }catch(e){if(token===sourceToken&&!(e instanceof DocumentSaveError))status('表示できません。入力と旧表示を保持しています: '+(e as Error).message,'error');}
  finally{if(token===sourceToken){sourceBusy=false;sourceChrome();}}
};
$('layout-lock').onclick=()=>{if(restoring)return;touch.cancel();pan=undefined;capture();layoutLocked=!layoutLocked;chrome();graph();};
$<HTMLInputElement>('selected-edges-only').onchange=()=>{const t=current();if(!t||restoring||documentSaving||closing===t)return;touch.cancel();pan=undefined;capture();t.selectedEdgesOnly=$<HTMLInputElement>('selected-edges-only').checked;redrawEdges();persist();};
$<HTMLInputElement>('show-exceptions').onchange=()=>{const t=current();if(!t||restoring||documentSaving||closing===t)return;touch.cancel();pan=undefined;capture();t.showExceptions=$<HTMLInputElement>('show-exceptions').checked;redrawEdges();persist();};
$<HTMLInputElement>('prefer-write').onchange=()=>{if(restoring)return;capture();state.preferWrite=$<HTMLInputElement>('prefer-write').checked;graph();persist();};
$('theme').onclick=()=>{if(restoring)return;state.dark=!state.dark;chrome();persist();};$('drawer').onclick=()=>{if(restoring||!current())return;capture();state.drawer=!state.drawer;render();persist();};for(const [id,factor] of [['in',ZOOM_FACTOR],['out',1/ZOOM_FACTOR]] as const)$(id).onclick=()=>{const t=current();if(t&&closing!==t){const captured=capture(),zoom=cameraZoom({zoom:t.zoom,scroll:t.scroll},factor).zoom,changed=captured||zoom!==t.zoom;t.zoom=zoom;render();persist(180,changed);}};
const viewport=$('viewport');
function changeDraggedNode(id:string,position:Point){
  const t=current();if(!t||documentSaving||closing===t)return;capture();const previous=t.positions[id];t.positions[id]=position;if(previous?.[0]!==position[0]||previous?.[1]!==position[1])markChanged();
  const node=Array.from($('nodes').children).find(n=>(n as HTMLElement).dataset.node===id) as HTMLElement|undefined;
  if(node){node.style.left=position[0]+'px';node.style.top=position[1]+'px';}
  redrawEdges();
}
const nodeDrag=createNodeDrag({
  read:()=>{const t=current();return t&&!documentSaving&&t!==closing&&!layoutLocked&&!document.hidden?{key:t.key,zoom:t.zoom,scroll:[viewport.scrollLeft,viewport.scrollTop],offset:[(t.canvasOrigin?.[0]??0)+(t.viewInset?.[0]??0),(t.canvasOrigin?.[1]??0)+(t.viewInset?.[1]??0)]}:undefined;},
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
    t.scroll=[Math.max(0,desired[0]+growth[0]),Math.max(0,desired[1]+growth[1])];layoutCanvas(t);viewport.scrollLeft=t.scroll[0];viewport.scrollTop=t.scroll[1];capture();markChanged();
  },
  requestFrame:callback=>requestAnimationFrame(callback),cancelFrame:id=>cancelAnimationFrame(id)
});
const touch=installTouchGestures(viewport,{
  nodeDrag,
  read:()=>{const t=current();return t&&!documentSaving&&closing!==t?{key:t.key,zoom:t.zoom,locked:layoutLocked,scroll:[viewport.scrollLeft,viewport.scrollTop]}:undefined;},
  position:id=>current()?.positions[id],
  change:value=>{const t=current();if(!t||documentSaving||closing===t)return;const beforeScroll=t.scroll;let changed=false;
    if(value.node)changeDraggedNode(value.node.id,value.node.position);
    if(value.selected){listView().finding=undefined;changed=changed||t.selected!==value.selected;t.selected=value.selected;revealListNode(value.selected);}
    if(value.zoom!==undefined){changed=changed||t.zoom!==value.zoom;t.zoom=value.zoom;}
    if(value.scroll)t.scroll=value.scroll;
    if(value.selected)graph();
    else if(value.zoom!==undefined)layoutCanvas(t);
    if(value.scroll){viewport.scrollLeft=value.scroll[0];viewport.scrollTop=value.scroll[1];}
    // Requested touch scroll can be clamped; compare the final visible camera.
    capture(false);if(changed||beforeScroll[0]!==t.scroll[0]||beforeScroll[1]!==t.scroll[1])markChanged();
  },
  finish:()=>{const t=current();if(t)layoutCanvas(t);capture();persist(180,false);}
});
const cancelInteractions=()=>{touch.cancel();pan=undefined;capture();persist(0,false);};
window.addEventListener('blur',cancelInteractions);
window.addEventListener('pagehide',cancelInteractions);
document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelInteractions();});
viewport.onscroll=()=>{capture();};
let pan:{key:string;pointer:number;x:number;y:number;scroll:Point;node?:string;moved:boolean}|undefined;
viewport.onpointerdown=e=>{const t=current(),node=(e.target as HTMLElement).closest<HTMLElement>('.node')?.dataset.node;if(e.button!==0||!t||documentSaving||t===closing||(node&&!layoutLocked))return;pan={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[viewport.scrollLeft,viewport.scrollTop],node,moved:false};viewport.setPointerCapture(e.pointerId);};
viewport.onpointermove=e=>{if(pan&&pan.pointer===e.pointerId&&pan.key===current()?.key&&current()!==closing){const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)>3)pan.moved=true;viewport.scrollLeft=pan.scroll[0]-dx;viewport.scrollTop=pan.scroll[1]-dy;capture();}};
viewport.onpointerup=e=>{if(!pan||pan.pointer!==e.pointerId)return;const t=current(),p=pan;pan=undefined;if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);if(t&&t!==closing&&p.key===t.key&&!p.moved&&p.node){listView().finding=undefined;if(t.selected!==p.node){t.selected=p.node;markChanged();}revealListNode(p.node);graph();}capture();persist(180,false);};
viewport.onpointercancel=()=>{pan=undefined;};
viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport&&pan?.pointer===e.pointerId)pan=undefined;});
let resizing=false;$('resize').onpointerdown=e=>{if(restoring)return;resizing=true;$('resize').setPointerCapture(e.pointerId);};$('resize').onpointermove=e=>{if(resizing){const width=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));if(width!==state.width){state.width=width;markChanged();}chrome();}};$('resize').onpointerup=()=>{resizing=false;persist(180,false);};$('resize').onpointercancel=()=>{resizing=false;persist(180,false);};$('resize').onkeydown=e=>{if(restoring)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const width=Math.max(260,Math.min(innerWidth*.65,state.width+(e.key==='ArrowLeft'?20:-20)));if(width!==state.width){state.width=width;markChanged();}chrome();persist(180,false);}};window.addEventListener('resize',()=>{chrome();const t=current();if(t)layoutCanvas(t);});
// Viewport resize and wrapped toolbar labels can change the required tail.
// Recompute from current content, never from a historical maximum; keep pan.
if(typeof ResizeObserver!=='undefined'){const canvasResize=new ResizeObserver(()=>{const t=current();if(t)layoutCanvas(t);});canvasResize.observe($('viewport'));canvasResize.observe(document.querySelector<HTMLElement>('.toolbar')!);}
// Validate all fields consumed by rendering before adopting a stored tab.
function validateRestoredTab(t:Tab){
  if(!t||typeof t.key!=='string'||!t.key||typeof t.name!=='string'||typeof t.design?.markdown!=='string'||(t.selected!==undefined&&typeof t.selected!=='string'))throw Error('Invalid saved document');
  if(t.design.sourceFormat!==undefined&&t.design.sourceFormat!=='json')throw Error('Unknown saved source format');
  // All derived business data, including legacy MD, is rebuilt from original source.
  t.design=parseDesign(t.design.markdown);
  if(t.design.sourceFormat==='json')t.checks=undefined; // Embedded Check sources cannot inherit an old MD attachment.
  if(t.checks!==undefined){if(!t.checks||typeof t.checks.markdown!=='string'||typeof t.checks.name!=='string'||(t.checks.url!==undefined&&typeof t.checks.url!=='string')||(t.checks.confirmedFor!==undefined&&typeof t.checks.confirmedFor!=='string'))throw Error('Invalid related Check');readRelatedChecks(t.checks);}
  if((t.draft!==undefined&&typeof t.draft!=='string')||(t.edited!==undefined&&typeof t.edited!=='boolean'))throw Error('Invalid editor state');
  if(t.source!==undefined&&(!t.source||!['text','sample','url'].includes(t.source.kind)||(t.source.kind==='url'&&typeof t.source.url!=='string')))throw Error('Invalid saved source');
}
const updateNotice=document.createElement('section');updateNotice.id='source-update-notice';updateNotice.className='info-bar';updateNotice.hidden=true;
updateNotice.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector('.workspace')!.before(updateNotice);
let updateCandidate:{key:string;url:string;baseline:string}|undefined;
const dismissedUpdates=new Set<string>();let updateCheckToken=0,restoredDocumentKey:string|undefined,updateCheckPending:string|undefined;
function updateNoticeChrome(){const t=state.document;updateNotice.hidden=!updateCandidate||updateCandidate.key!==t?.key||updateCandidate.baseline!==t.design.markdown||dismissedUpdates.has(t.key);$<HTMLButtonElement>('source-update-refresh').disabled=restoring||opening||documentSaving||!!(t&&updating.has(t.key));}
$('source-update-close').onclick=()=>{if(updateCandidate)dismissedUpdates.add(updateCandidate.key);updateNoticeChrome();};
$('source-update-refresh').onclick=()=>{$('refresh').click();};
async function checkSourceUpdate(){
 const doc=state.document;if(doc?.source?.kind!=='url')return;const checkKey=doc.key+'\0'+doc.design.markdown;if(updateCheckPending===checkKey)return;updateCheckPending=checkKey;const token=++updateCheckToken,key=doc.key,url=doc.source.url,baseline=doc.design.markdown;
 try{const raw=await fetchDocumentSource(url);if(token!==updateCheckToken||state.document?.key!==key||state.document.design.markdown!==baseline||state.document.source?.kind!=='url'||state.document.source.url!==url)return;
  // Compare actual bodies, normalizing only Markdown line endings. Invalid responses never become update claims.
  parseDesign(raw);updateCandidate=raw.replace(/\r\n?/g,'\n')!==baseline.replace(/\r\n?/g,'\n')?{key,url,baseline}:undefined;updateNoticeChrome();
 }catch{/* Unknown is not a confirmed update. The cached graph stays available. */}
 finally{if(token===updateCheckToken)updateCheckPending=undefined;}
}
shell=installViewerShell(app,{rightDrawer:{isOpen:()=>state.drawer,isReady:()=>!restoring,setOpen:open=>{if(restoring)return;state.drawer=open;chrome();persist();}},capture:()=>{capture();touch.cancel();pan=undefined;},business:()=>({key:state.document?.key,design:state.document?.design,viewKey:current()?.key,views:state.tabs.map(t=>({key:t.key,name:t.name,activity:viewActivity(t),object:viewObject(t)})),activities:state.document?.design.graph.nodes.filter(n=>n.type==='business').map(n=>({id:n.id,name:n.name}))??[],objects:state.document?.design.graph.nodes.filter(n=>n.type==='object').map(n=>({id:n.id,name:n.name}))??[],states:state.document?.design.graph.nodes.filter(n=>n.type==='object'&&!!state.document?.design.objectStateTransitions?.[n.id]).map(n=>({id:n.id,name:n.name}))??[],concept:(()=>{const data=state.document?.design.model,model=data?.concepts?.find(item=>item.basedOn.documentId===data.business.id);return data&&model?{business:data.business,model}:undefined;})()}),openActivity:id=>{activateActivity(id);navigateNode(id);},openObject:id=>{activateObject(id);navigateNode(id);},openOverview:()=>{if(state.tabs[0]){capture();shell?.reopenBusinessOverview();state.active=state.tabs[0].key;render();persist();}},activateView:key=>{if(state.tabs.some(t=>t.key===key)){capture();state.active=key;render();persist();}},statePanel:id=>state.document?stateTransitionPanel(state.document.design,id,target=>{shell?.activateBusiness();activateActivity(target);navigateNode(target);shell?.businessActivated();}):undefined,closeLegacyList:()=>{state.nodeDrawer=false;chrome();},refresh:()=>{chrome();documentActions.update();}});
const initialState=state;
render();saveStateChrome();loadSession().then(value=>{if(value===undefined)return;const raw=value as Session|WorkspaceSnapshot;if('format' in raw){for(const t of raw.recovery??[])validateRestoredTab(t);if(raw.document){const checked={...raw.document,positions:{},scroll:[0,0] as Point,zoom:1};validateRestoredTab(checked);raw.document.design=checked.design;raw.document.checks=checked.checks;}}else{if(!Array.isArray(raw.tabs))throw Error('Invalid session');for(const t of raw.tabs)validateRestoredTab(t);}const workspace=restoreWorkspace(raw);const saved={...value,legacyViews:workspace.legacyViews,tabs:workspace.tabs.map(t=>({...t,name:workspace.document!.name,design:t.design,checks:t.checks,source:t.source,draft:t.draft,edited:t.edited,handle:t.handle}))};if(!Array.isArray(saved.tabs)||typeof saved.dark!=='boolean'||typeof saved.drawer!=='boolean'||(saved.preferWrite!==undefined&&typeof saved.preferWrite!=='boolean')||(saved.scopeOutside!==undefined&&!['show','dim','hide'].includes(saved.scopeOutside))||(saved.dimOutside!==undefined&&typeof saved.dimOutside!=='boolean')||(saved.hideOutside!==undefined&&typeof saved.hideOutside!=='boolean')||!Number.isFinite(saved.width))throw Error('Invalid session');for(const t of saved.tabs)validateRestoredTab(t);if(new Set(saved.tabs.map(t=>t.key)).size!==saved.tabs.length||(saved.active!==undefined&&typeof saved.active!=='string'))throw Error('Invalid saved tab keys');if(saved.nodeDrawer!==undefined&&typeof saved.nodeDrawer!=='boolean')throw Error('Invalid drawer');for(const t of [...saved.tabs,...(saved.sampleLayout===undefined?[]:[saved.sampleLayout])]){if(!t||!t.positions||typeof t.positions!=='object'||Array.isArray(t.positions)||(t.selectedEdgesOnly!==undefined&&typeof t.selectedEdgesOnly!=='boolean')||(t.showExceptions!==undefined&&typeof t.showExceptions!=='boolean')||(t.hiddenNodes!==undefined&&(!Array.isArray(t.hiddenNodes)||!t.hiddenNodes.every(id=>typeof id==='string')))||(t.viewInset!==undefined&&(!Array.isArray(t.viewInset)||t.viewInset.length!==2||!t.viewInset.every(v=>Number.isFinite(v)&&v>=0)))||(t.canvasOrigin!==undefined&&(!Array.isArray(t.canvasOrigin)||t.canvasOrigin.length!==2||!t.canvasOrigin.every(v=>Number.isFinite(v)&&v>=0)))||!Array.isArray(t.scroll)||t.scroll.length!==2||!t.scroll.every(Number.isFinite)||!Number.isFinite(t.zoom)||t.zoom<.25||t.zoom>2.5||!Object.values(t.positions).every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))throw Error('Invalid layout');}// Removed dim preferences migrate to show so previously visible nodes stay visible.
const {dimOutside:_dimOutside,hideOutside:_hideOutside,scopeOutside:_scopeOutside,...restored}=saved;
const migrate=(t:Tab)=>({...t,hiddenNodes:t.hiddenNodes??(saved.scopeOutside==='hide'?t.design.graph.nodes.filter(n=>!n.scope).map(n=>n.id):[])});state=createWorkspace({...restored,tabs:saved.tabs.map(migrate)},workspace.recovery,workspace.document,saved.tabs.map(t=>{const {design:_design,checks:_checks,source:_source,draft:_draft,edited:_edited,handle:_handle,name:_name,...v}=migrate(t);return v;}));if(saved.sampleLayout&&saved.sampleLayout.hiddenNodes===undefined&&saved.scopeOutside==='hide')state.sampleLayout={...saved.sampleLayout,hiddenNodes:parseDesign(legacySampleMarkdown).graph.nodes.filter(n=>!n.scope).map(n=>n.id)};if(!state.tabs.some(t=>t.key===state.active))state.active=state.tabs[0]?.key;if(current()?.selected)revealListNode(current()!.selected!);restoredDocumentKey=state.document?.key;render();savedOnce=true;}).catch(()=>{state=initialState;restoreFailed=true;protectedStorage();}).finally(()=>{restoring=false;render();saveStateChrome();void openSharedSource().then(()=>{if(state.document?.key===restoredDocumentKey)void checkSourceUpdate();});});
