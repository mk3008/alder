import {clampZoom,installTouchGestures} from './touch-gestures';
import {deploymentContext} from './deployment';
import {createElement,icons,UserRound,FolderOpen,PanelRight,Moon,Sun,RefreshCw,Plus,Minus,X,Box,FileText,FolderSymlink,Text,LockKeyhole,LockKeyholeOpen,PanelLeft,Eye,EyeOff,ChevronDown,ChevronRight,Settings,Share2,RotateCcw} from 'lucide';
import {parseDesign,validateGraph,findingsFromSource} from './graph';
import {formattedMarkdown} from './markdown';
import {nodeFindingLabels,findingsPanel} from './findings';
import {reconcile,saveSession,loadSession,SessionConflictError,type Session,type Tab,type Point} from './session';
import {RouteCache} from './route-cache';
import {createNodeDrag} from './node-drag';
import {resetLayout} from './layout-reset';
import {hiddenReadIndexes} from './edge-visibility';
import {fetchMarkdown} from './source';
import {sourceSharingReason,createSourceShareLink,readSharedSource} from './sharing';
import './style.css';
import sampleMarkdown from '../../business-design/alder/README.md?raw';
import {createSnackbar} from './snackbar';
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="refresh" aria-label="更新" title="更新">更新</button><button id="theme" aria-label="テーマ切替"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="開いているファイル"></nav><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="edit-markdown" aria-label="原文を見る／編集する" title="原文を見る／編集する"><span class="editor-caption">原文を見る／編集する</span></button></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span><div id="save-actions" hidden><div class="save-buttons"><button id="save-retry">保存を再試行</button><button id="save-download">表示中の本文をファイルに保存</button><button id="save-draft-download">入力中の本文をファイルに保存</button><button id="save-reload">未保存の変更を破棄して読み直す</button></div><p id="save-help">保存するのはMarkdown本文だけです。図の配置や開いたタブは含みません。「ファイルを開く」で読み込めますが、入力途中の本文は修正が必要な場合があります。複数の文書がある場合は、タブごとに保存してください。</p><p id="save-draft-note" hidden>入力中のURLは、入力欄からコピーして控えてください。</p><p id="save-reload-warning" hidden>読み直すと、この画面の未保存の本文・入力・図の配置は失われます。必要な本文を先にファイルへ保存してください。</p><p id="save-download-error" role="alert" hidden></p><label id="save-rescue-label" for="save-rescue-text" hidden>コピーする本文</label><textarea id="save-rescue-text" readonly hidden></textarea></div></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、Markdown形式）を開くと、業務のつながりを図で確認できます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、Markdownの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSのMarkdown本文URL</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design Markdown</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><dialog id="source-close-dialog" aria-labelledby="source-close-message"><p id="source-close-message">グラフには反映されません。編集内容は保持されます。閉じますか？</p><div class="source-close-actions"><button id="source-close-confirm">閉じる</button><button id="source-close-continue" autofocus>編集を続ける</button></div></dialog><input id="fallback" type="file" accept=".md,.markdown,text/markdown,text/plain" multiple hidden>`;
const $=<T extends HTMLElement>(id:string)=>document.getElementById(id) as T;
const findingsButton=document.createElement('button');findingsButton.id='findings-toggle';findingsButton.type='button';findingsButton.className='graph-action';findingsButton.textContent='指摘一覧';document.querySelector('.graph-actions')!.append(findingsButton);
const findingsDialog=document.createElement('dialog');findingsDialog.id='findings-dialog';findingsDialog.setAttribute('aria-label','指摘一覧');document.body.append(findingsDialog);
findingsButton.onclick=()=>{const t=current();if(!t)return;findingsDialog.replaceChildren();const close=document.createElement('button');close.textContent='閉じる';close.onclick=()=>findingsDialog.close();findingsDialog.append(close,findingsPanel(t.design));findingsDialog.showModal();};
const deployment=deploymentContext(location.pathname);if(deployment.version){$('preview-badge').hidden=false;$('preview-badge').textContent=`確認用 · ${deployment.version}`;$('preview-badge').title=`PR #${deployment.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`;}
const icon=(v:Parameters<typeof createElement>[0])=>createElement(v,{'stroke-width':1.8,'aria-hidden':'true'});
for(const [id,value] of [['open',FolderOpen],['open-url',FolderSymlink],['open-text',Text],['edit-markdown',FileText],['share-source',Share2],['refresh',RefreshCw],['drawer',PanelRight],['node-list-toggle',PanelLeft],['node-list-close',X],['display-settings-toggle',Settings],['reset-layout',RotateCcw],['out',Minus],['in',Plus]] as const)$(id).prepend(icon(value));
let state:Session={tabs:[],dark:false,drawer:true,width:380,preferWrite:false,nodeDrawer:false},layoutLocked=true,displaySettingsOpen=false,restoring=true,restoreFailed=false,saveConflict=false,opening=false,saving=Promise.resolve(),timer:number|undefined,closing:Tab|undefined,revision=0,documentSaving=false;
let savedRevision=0,pendingWrites=0,saveFailed=false,savedOnce=false,draftDirty=false,leaveWarning=false,quotaFailed=false,closeFailed=false;
// Repeated lifecycle/no-op events must not commit the same revision twice.
const queuedRevisions=new Set<number>();
const updating=new WeakSet<Tab>(),unsavedDrafts=new Set<string>();
function acknowledgeDrafts(snapshot:Session){for(const key of unsavedDrafts){const live=state.tabs.find(t=>t.key===key),stored=snapshot.tabs.find(t=>t.key===key);if(live&&stored&&live.draft===stored.draft)unsavedDrafts.delete(key);}}
const current=()=>state.tabs.find(t=>t.key===state.active);
let storageMessage='';
const notify=createSnackbar($('status'),$('status-text'),$<HTMLButtonElement>('status-close'),$('viewport'),()=>$('status').dataset.key!=='storage',recoveryChrome);
// Recomputing save chrome must not move an unchanged storage error ahead of a newer input error.
function status(message:string,kind:'success'|'warning'|'error'='success',key:'operation'|'storage'='operation'){if(key==='storage'){if(storageMessage===message){recoveryChrome();return;}storageMessage=message;}notify(message,kind,key);recoveryChrome();}
function protectedStorage(){status('前回の表示を復元できません。元の保存内容を保護するため、この画面の変更は保存しません。新しく入力した本文を退避してから、再読み込みで復元を再試行できます。','error','storage');}
function conflictedStorage(){status('別の画面（ブラウザーのタブやウィンドウ）で、本文または表示設定が先に保存されました。上書きを防ぐため、この画面の変更は保存していません。本文・入力途中の編集・図の配置は、この画面を閉じるまで残っています。必要な本文をファイルに保存するかコピーしてから、再読み込みしてください。','error','storage');}
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
  else if(saveFailed)status((closeFailed?'保存できないため、タブを閉じませんでした。':'')+(quotaFailed?'保存容量が足りず保存できません。本文を退避してから、保存容量やブラウザーの設定を確認してください。':'表示状態を保存できません。本文と図の配置はこの画面に残っています。保存を再試行するか、本文をファイルに退避してください。'),'error','storage');
  else status('','success','storage');
  displaySettingsChrome();
}
function recoveryChrome(){
  const visible=!$('status').hidden&&$('status').dataset.key==='storage';
  $('save-actions').hidden=!visible;$('status').classList.toggle('has-save-actions',visible);$('status-close').hidden=visible;
  if(!visible){for(const id of ['save-download-error','save-rescue-label','save-rescue-text'])$(id).hidden=true;return;}
  const retry=$<HTMLButtonElement>('save-retry');retry.hidden=restoreFailed||saveConflict;retry.disabled=pendingWrites>0||documentSaving||!!closing;
  const retryLabel=retry.disabled?'保存を再試行中…':'保存を再試行';if(retry.textContent!==retryLabel)retry.textContent=retryLabel;
  $('save-download').hidden=!current();
  const dialogOpen=!$('source-dialog').hidden;
  const draftDownload=$('save-draft-download');draftDownload.hidden=rescueDraft()===undefined;
  const draftLabel=dialogOpen&&sourceMode==='text'?'入力中の本文をファイルに保存':'図に未反映の本文をファイルに保存';if(draftDownload.textContent!==draftLabel)draftDownload.textContent=draftLabel;
  $('save-draft-note').hidden=!dialogOpen||sourceMode!=='url'||!sourceURL().value;
  $('save-reload').hidden=!restoreFailed&&!saveConflict;$('save-reload-warning').hidden=$('save-reload').hidden;
}
function saveFailure(error:unknown){saveFailed=true;quotaFailed=(error as {name?:unknown}|null)?.name==='QuotaExceededError';closeFailed=!!closing;}
function rescueName(name:string){const clean=Array.from(name.normalize('NFKC').replace(/\.(?:md|markdown)$/i,'').replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,'_').replace(/^\.+|[.\s]+$/g,'')).slice(0,80).join('');return 'alder-'+(clean||'document')+'.md';}
function downloadMarkdown(raw:string,name:string){
  let url:string|undefined,link:HTMLAnchorElement|undefined;
  try{url=URL.createObjectURL(new Blob([raw],{type:'text/markdown;charset=utf-8'}));link=document.createElement('a');link.href=url;link.download=rescueName(name);link.hidden=true;document.body.append(link);link.click();for(const id of ['save-download-error','save-rescue-label','save-rescue-text'])$(id).hidden=true;}
  catch{const error=$('save-download-error');error.textContent='本文ファイルを作れませんでした。下の本文を選択してコピーし、別のテキストファイルに保存してください。';error.hidden=false;$('save-rescue-label').hidden=false;const field=$<HTMLTextAreaElement>('save-rescue-text');field.value=raw;field.hidden=false;field.focus();field.select();}
  finally{link?.remove();if(url){const value=url;window.setTimeout(()=>URL.revokeObjectURL(value),1500);}}
}
$('save-retry').onclick=()=>{if(!saveFailed||restoreFailed||saveConflict||pendingWrites||documentSaving||closing)return;rememberEditorInput();capture();persist(0,false);};
$('save-download').onclick=()=>{const tab=current();if(tab)downloadMarkdown(tab.design.markdown,tab.name);};
function rescueDraft(){if(!$('source-dialog').hidden&&sourceMode==='text')return sourceText().value||undefined;if(!$('source-dialog').hidden&&sourceMode==='edit')return sourceText().value;return current()?.draft;}
$('save-draft-download').onclick=()=>{const raw=rescueDraft();if(raw!==undefined)downloadMarkdown(raw,((sourceMode==='edit'&&!$('source-dialog').hidden?editingTab():current())?.name??'input')+'-draft');};
$('save-reload').onclick=()=>{if(restoreFailed||saveConflict)location.reload();};

function ensureWritable(){if(restoreFailed)throw Error('前回の保存内容を保護しています。本文を退避してから読み直してください。');if(saveConflict)throw new SessionConflictError();}
async function writeSnapshot(snapshot:Session){ensureWritable();try{await saveSession(snapshot);}catch(error){if(error instanceof SessionConflictError){saveConflict=true;clearTimeout(timer);timer=undefined;conflictedStorage();}throw error;}}
function queueSnapshot(snapshot:Session,version:number){
  pendingWrites++;queuedRevisions.add(version);saveStateChrome();
  const write=saving.catch(()=>{}).then(()=>writeSnapshot(snapshot)).then(()=>{
    savedRevision=Math.max(savedRevision,version);savedOnce=true;acknowledgeDrafts(snapshot);
    if(savedRevision===revision){saveFailed=false;quotaFailed=false;closeFailed=false;}
  },error=>{saveFailure(error);throw error;}).finally(()=>{pendingWrites--;queuedRevisions.delete(version);saveStateChrome();});
  saving=write.catch(()=>{});return write;
}
function persist(delay=180,changed=true){
  if(restoring)return;if(changed)revision++;clearTimeout(timer);timer=undefined;
  if(restoreFailed){protectedStorage();saveStateChrome();return;}if(saveConflict){conflictedStorage();saveStateChrome();return;}
  if(closing||documentSaving||queuedRevisions.has(revision)||(!changed&&revision<=savedRevision&&!saveFailed)){saveStateChrome();return;}
  const write=()=>{timer=undefined;let snapshot:Session;try{snapshot=structuredClone(state);}catch(error){saveFailure(error);saveStateChrome();return;}
    void queueSnapshot(snapshot,revision).catch(()=>saveStateChrome());};
  // Lifecycle flushing starts queued work now, but does not invent a new edit.
  if(delay===0)write();else timer=window.setTimeout(write,delay);
  saveStateChrome();
}
async function closeTab(t:Tab){
  if(restoring||closing||documentSaving||!state.tabs.includes(t))return;
  rememberEditorInput();
  if(restoreFailed){protectedStorage();return;}if(saveConflict){conflictedStorage();return;}
  if(t.draft!==undefined&&!window.confirm('図に反映していない編集を破棄して、このタブを閉じますか？'))return;
  if(sourceTarget===t.key)hideSource();
  touch.cancel();capture();clearTimeout(timer);timer=undefined;closing=t;revision++;renderTabs();displaySettingsChrome();sourceChrome();saveStateChrome();
  const version=revision;
  try{
    const projected:Session={...state,tabs:state.tabs.filter(x=>x!==t),active:state.active===t.key?state.tabs.find(x=>x!==t)?.key:state.active};
    if(t.source?.kind==='sample')projected.sampleLayout={positions:t.positions,selected:t.selected,scroll:t.scroll,zoom:t.zoom,hiddenNodes:t.hiddenNodes,showExceptions:t.showExceptions,selectedEdgesOnly:t.selectedEdgesOnly,viewInset:t.viewInset,canvasOrigin:t.canvasOrigin};
    const snapshot=structuredClone(projected);await queueSnapshot(snapshot,version);
    state.tabs=state.tabs.filter(x=>x!==t);if(state.active===t.key)state.active=state.tabs[0]?.key;
    if(t.source?.kind==='sample')state.sampleLayout=snapshot.sampleLayout;
    unsavedDrafts.delete(t.key);closing=undefined;render();saveStateChrome();
    if(version!==revision)persist(0,false);
  }catch(error){saveFailure(error);closing=undefined;render();saveStateChrome();if(error instanceof SessionConflictError)return;persist(180,false);}
}
// Empty presentation hides graph-only controls without changing drawer preferences.
function chrome(){const hasTab=!!current(),drawerOpen=hasTab&&state.drawer,listOpen=hasTab&&!!state.nodeDrawer;document.querySelector<HTMLElement>('.toolbar')!.hidden=!hasTab;if(!hasTab)displaySettingsOpen=false;displaySettingsChrome();$('layout-lock').replaceChildren(icon(layoutLocked?LockKeyhole:LockKeyholeOpen));$('layout-lock').setAttribute('aria-pressed',String(layoutLocked));$('layout-lock').title=layoutLocked?'配置をロック中。項目の上から図をスクロールできます。':'配置を調整中。項目をドラッグして移動できます。';$('layout-lock').toggleAttribute('disabled',restoring);$('viewport').dataset.layoutLocked=String(layoutLocked);$<HTMLInputElement>('prefer-write').checked=state.preferWrite===true;$<HTMLInputElement>('prefer-write').disabled=restoring;$<HTMLInputElement>('show-exceptions').checked=current()?.showExceptions!==false;$<HTMLInputElement>('show-exceptions').disabled=restoring||!current()||closing===current();$<HTMLInputElement>('selected-edges-only').checked=current()?.selectedEdgesOnly===true;$<HTMLInputElement>('selected-edges-only').disabled=restoring||!current()||closing===current();document.documentElement.dataset.theme=state.dark?'dark':'light';$('theme').replaceChildren(icon(state.dark?Sun:Moon));$('formattedMarkdownDrawer').hidden=!drawerOpen;$('formattedMarkdownDrawer').style.width=Math.max(260,Math.min(state.width,innerWidth*.65))+'px';$('drawer').setAttribute('aria-expanded',String(drawerOpen));$('drawer').toggleAttribute('disabled',restoring||!hasTab);$('node-list-drawer').hidden=!listOpen;$('node-list-toggle').setAttribute('aria-expanded',String(listOpen));$('node-list-toggle').toggleAttribute('disabled',restoring||!hasTab);}
// Keep expansion ephemeral: it never changes graph data or stored preferences.
function displaySettingsChrome(){
  document.querySelector<HTMLElement>('.toolbar')!.dataset.settingsOpen=String(displaySettingsOpen);
  $('display-options').hidden=!displaySettingsOpen;
  $<HTMLButtonElement>('reset-layout').disabled=restoring||opening||documentSaving||!!closing||!current()||updating.has(current()!)||restoreFailed||saveConflict;
  const button=$<HTMLButtonElement>('display-settings-toggle'),base=displaySettingsOpen?'表示設定を閉じる':'表示設定を開く',label=base+(button.dataset.findingCount?' · 指摘 '+button.dataset.findingCount+'件':'');
  button.setAttribute('aria-expanded',String(displaySettingsOpen));button.setAttribute('aria-label',label);button.title=label;button.disabled=restoring||!current()||closing===current();
}
function setDisplaySettings(open:boolean,focus=false){
  const t=current();if(restoring||!t||closing===t||open===displaySettingsOpen)return;
  touch.cancel();pan=undefined;capture();displaySettingsOpen=open;displaySettingsChrome();layoutCanvas(t);
  if(!open&&(focus||$('display-options').contains(document.activeElement)))$('display-settings-toggle').focus({preventScroll:true});
}
$('display-settings-toggle').onclick=()=>setDisplaySettings(!displaySettingsOpen);
$('reset-layout').onclick=()=>{
  const t=current();if(restoring||opening||documentSaving||closing||!t||updating.has(t))return;
  try{ensureWritable();}catch{saveStateChrome();return;}
  // Stop every gesture before replacing positions so late pointer events cannot
  // move the reset graph. The layout lock itself remains the user's choice.
  touch.cancel();nodeDrag.cancel();pan=undefined;capture();
  const next=resetLayout(t);if(next!==t)Object.assign(t,next);
  // Even initial coordinates can retain routes computed during an earlier drag.
  routeCache.invalidate(t);render();if(next!==t)persist();
};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.defaultPrevented&&displaySettingsOpen&&!findingsDialog.open&&$('source-dialog').hidden){e.preventDefault();setDisplaySettings(false,true);}});
// Capture may precede the native scroll event (for example a toolbar click).
function capture(track=true){const t=current();if(!t)return false;const scroll:Point=[$('viewport').scrollLeft,$('viewport').scrollTop],changed=t.scroll[0]!==scroll[0]||t.scroll[1]!==scroll[1];t.scroll=scroll;if(changed&&track){markChanged();persist(180,false);}return changed;}
function retainFocus(update:()=>void){
  const active=document.activeElement as HTMLElement|null;
  const tab=active?.closest<HTMLElement>('.tab')?.dataset.key;
  const close=active?.classList.contains('close');
  update();
  if(tab)Array.from(document.querySelectorAll<HTMLElement>('.tab')).find(e=>e.dataset.key===tab)?.querySelector<HTMLElement>(close?'.close':'button')?.focus({preventScroll:true});
}
function renderTabs(){retainFocus(buildTabs);}
function buildTabs(){const root=$('tabs');root.replaceChildren();state.tabs.forEach(t=>{const wrap=document.createElement('div');wrap.className='tab'+(t.key===state.active?' active':'');wrap.draggable=true;wrap.dataset.key=t.key;const b=document.createElement('button');b.textContent=t.name;b.title=t.name;b.prepend(icon(FileText));b.setAttribute('aria-current',String(t.key===state.active));b.disabled=documentSaving;b.onclick=async()=>{if(documentSaving)return;if(sourceTarget&&sourceTarget!==t.key&&!await closeSource())return;const changed=capture()||state.active!==t.key;state.active=t.key;render();persist(180,changed);};const close=document.createElement('button');close.className='close';close.setAttribute('aria-label',t.name+'を閉じる');close.append(icon(X));close.disabled=!!closing||documentSaving;close.onclick=()=>closeTab(t);wrap.append(b,close);wrap.ondragstart=e=>e.dataTransfer?.setData('text/plain',t.key);wrap.ondragover=e=>e.preventDefault();wrap.ondrop=e=>{e.preventDefault();if(documentSaving)return;const from=state.tabs.findIndex(x=>x.key===e.dataTransfer?.getData('text/plain')),to=state.tabs.indexOf(t);if(from>=0&&from!==to){const [m]=state.tabs.splice(from,1);state.tabs.splice(to,0,m);renderTabs();persist();}};wrap.onkeydown=e=>{if(documentSaving)return;if(e.altKey&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();const i=state.tabs.indexOf(t),j=i+(e.key==='ArrowLeft'?-1:1);if(j>=0&&j<state.tabs.length){[state.tabs[i],state.tabs[j]]=[state.tabs[j],state.tabs[i]];renderTabs();persist();}}};root.append(wrap);});}
function detail(){const t=current(),root=$('detail'),key=t?t.key+':'+(t.selected??''):'';const scroll=root.dataset.contentKey===key?root.scrollTop:0;root.replaceChildren();root.dataset.contentKey=key;if(!t)return;const n=t.design.graph.nodes.find(n=>n.id===t.selected);if(n&&(nodeFindingLabels(t.design,n).length||(t.design.findings??[]).some(f=>f.targets.includes(n.id))))root.append(findingsPanel(t.design,n.id));root.append(formattedMarkdown(n?t.design.sections[n.id]:t.design.markdown));root.scrollTop=scroll;}
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
  if(shifted){t.canvasOrigin=origin;t.scroll=[t.scroll[0]+growth[0],t.scroll[1]+growth[1]];markChanged();persist(180,false);}
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
function buildGraph(){const active=current();const issueCount=(active?.design.findings??[]).filter(f=>f.status==='open').length+(active?.design.graph.nodes.filter(n=>typeof n.problem==='string').length??0);findingsButton.textContent=`指摘一覧 ${issueCount}`;findingsButton.hidden=!active;findingsButton.disabled=restoring;const settings=$('display-settings-toggle');settings.dataset.findingCount=issueCount?String(issueCount):'';displaySettingsChrome();nodeDrag.cancel();redrawEdges=()=>{};edgeExtent=[0,0];edgeMinimum=[0,0];const t=current();$('nodes').replaceChildren();$('edges').replaceChildren();$('empty').hidden=!!t;$('canvas').hidden=!t;if(!t){
  // The last tab was captured and saved before this presentation-only reset.
  // Remove the old world's scroll extent without changing its saved camera.
  $('viewport').scrollLeft=0;$('viewport').scrollTop=0;detail();renderNodeList();return;
}const allNodes=t.design.graph.nodes,nodes=allNodes.filter(n=>!t.hiddenNodes?.includes(n.id)),visibleIDs=new Set(nodes.map(n=>n.id));if(t.selected&&!visibleIDs.has(t.selected))t.selected=undefined;const selected=t.selected,positions=t.positions,neighbors=new Set<string>(selected?[selected]:[]);if(selected)t.design.graph.relations.filter(r=>r.from===selected||r.to===selected).forEach(r=>{neighbors.add(r.from);neighbors.add(r.to);});
  layoutCanvas(t);
  const defs=svg('defs'),marker=svg('marker');for(const [k,v] of Object.entries({id:'arrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto'}))marker.setAttribute(k,v);const arrow=svg('path');arrow.setAttribute('d','M0 0L10 5L0 10Z');arrow.classList.add('arrow');marker.append(arrow);defs.append(marker);const related=marker.cloneNode(true) as SVGElement;related.id='related-arrow';related.querySelector('path')!.classList.add('review-related-arrow');defs.append(related);$('edges').append(defs);

  const hiddenReads=hiddenReadIndexes(t.design.graph.relations,state.preferWrite===true);
  const drawEdges=()=>{const boxes=allNodes.flatMap(n=>{const p=positions[n.id];return p?[{id:n.id,x:p[0],y:p[1],width:260,height:68}]:[];}),routes=routeCache.update(t,t.design,boxes,t.design.graph.relations);edgeExtent=[0,0];edgeMinimum=[0,0];while($('edges').childNodes.length>1)$('edges').lastChild!.remove();
  t.design.graph.relations.forEach((r,i)=>{if(hiddenReads.has(i))return;const route=routes[i];if(!route)return;edgeExtent[0]=Math.max(edgeExtent[0],route.bounds.right+20,route.label[0]+Math.max(30,r.label.length*12)/2+12);edgeExtent[1]=Math.max(edgeExtent[1],route.bounds.bottom+20,route.label[1]+22);edgeMinimum[0]=Math.min(edgeMinimum[0],...route.points.map(p=>p[0]-20),route.label[0]-Math.max(30,r.label.length*12)/2-12);edgeMinimum[1]=Math.min(edgeMinimum[1],...route.points.map(p=>p[1]-20),route.label[1]-22);if((t.selectedEdgesOnly===true&&selected&&r.from!==selected&&r.to!==selected)||!visibleIDs.has(r.from)||!visibleIDs.has(r.to)||(t.showExceptions===false&&(r.kind==='business-exception'||r.kind==='object-exception')))return;const path=svg('path');path.setAttribute('d',route.path);path.dataset.relation=String(i);path.dataset.collisions=String(route.collisions);path.dataset.rerouted=String(route.rerouted);path.dataset.fallback=String(route.fallback);path.setAttribute('marker-end','url(#arrow)');path.classList.add('edge');if(r.kind.endsWith('exception'))path.classList.add('exception');if(selected&&(r.from===selected||r.to===selected)){path.classList.add('review-related');path.setAttribute('marker-end','url(#related-arrow)');}if(selected&&r.from!==selected&&r.to!==selected)path.classList.add('muted');const title=svg('title');title.textContent=r.from+' → '+r.to+': '+r.label;path.append(title);$('edges').append(path);const label=svg('text');label.setAttribute('x',String(route.label[0]));label.setAttribute('y',String(route.label[1]));label.setAttribute('text-anchor','middle');label.classList.add('edge-label');label.setAttribute('dominant-baseline','middle');label.dataset.relation=String(i);if(selected&&(r.from===selected||r.to===selected))label.classList.add('review-related');if(selected&&r.from!==selected&&r.to!==selected)label.classList.add('muted');label.textContent=r.label;$('edges').append(label);});const root=$('edges');for(const e of [...Array.from(root.querySelectorAll('.edge:not(.review-related)')),...Array.from(root.querySelectorAll('.edge.review-related')),...Array.from(root.querySelectorAll('.edge-label'))])root.append(e);layoutCanvas(t);};redrawEdges=drawEdges;drawEdges();
  nodes.forEach(n=>{const b=document.createElement('div');b.setAttribute('role','group');b.className='node '+n.type+(n.scope?'':' outside')+(n.id===selected?' selected':'')+(selected&&!neighbors.has(n.id)?' muted':'')+(selected&&n.id!==selected&&neighbors.has(n.id)?' review-neighbor':'');b.dataset.node=n.id;b.style.left=positions[n.id][0]+'px';b.style.top=positions[n.id][1]+'px';const key=String(n.icon??'file-question').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('') as keyof typeof icons;const image=icon(n.type==='business'?UserRound:icons[key]??Box);if(n.type==='business')b.append(roleBadge(String(n.who)));else b.append(image);const text=document.createElement('span');text.className='node-text';const kind=document.createElement('span');kind.className='review-kind';kind.textContent=(n.type==='business'?'Activity':'Object')+(n.scope?' · 範囲内':' · 範囲外');text.append(kind);const name=document.createElement('span');name.className='node-name';name.textContent=n.name;text.append(name);if(n.type==='business'){const who=document.createElement('small');who.textContent=String(n.who);text.append(who);}b.append(text);b.title=n.name+(n.type==='business'?' — '+String(n.who):'');b.setAttribute('aria-label',b.title+(n.id===selected?'（選択中）':''));const labels=nodeFindingLabels(t.design,n);if(labels.length){const badges=document.createElement('span');badges.className='finding-badges';badges.textContent=labels.join(' · ');b.append(badges);b.setAttribute('aria-label',b.getAttribute('aria-label')+' · '+labels.join('、'));}let pointer:number|undefined;
    b.onpointerdown=e=>{if(e.button!==0||closing===t||layoutLocked)return;e.stopPropagation();b.setPointerCapture(e.pointerId);pointer=e.pointerId;nodeDrag.begin(n.id,[e.clientX,e.clientY]);};
    b.onpointermove=e=>{if(pointer===undefined||(e.pointerId!==undefined&&e.pointerId!==pointer)||!b.isConnected||closing===t)return;nodeDrag.move([e.clientX,e.clientY]);};
    b.onpointerup=e=>{if(pointer===undefined||pointer!==e.pointerId)return;pointer=undefined;if(!b.isConnected||closing===t)return;const drag=nodeDrag.end();if(b.hasPointerCapture?.(e.pointerId))b.releasePointerCapture(e.pointerId);if(!drag)return;if(!drag.moved){if(t.selected!==n.id){t.selected=n.id;markChanged();}revealListNode(n.id);}capture();graph();persist(180,false);};
    const cancel=(e:PointerEvent)=>{if(pointer===undefined||pointer!==e.pointerId)return;pointer=undefined;if(!b.isConnected)return;nodeDrag.cancel();capture();persist(180,false);};
    b.onpointercancel=cancel;b.onlostpointercapture=cancel;$('nodes').append(b);});$('zoom').textContent=Math.round(t.zoom*100)+'%';detail();renderNodeList();
}
function render(){touch.cancel();pan=undefined;chrome();renderTabs();graph();const t=current();if(t){$('viewport').scrollLeft=t.scroll[0];$('viewport').scrollTop=t.scroll[1];}$('refresh').toggleAttribute('disabled',restoring||documentSaving||!!closing||!t||t.source?.kind==='text'||updating.has(t));$('edit-markdown').toggleAttribute('disabled',restoring||opening||documentSaving||!!closing||!t||updating.has(t));$('edit-markdown').hidden=!t;for(const id of ['open','open-url','open-text','guide-open','guide-open-url','guide-open-text'])$(id).toggleAttribute('disabled',restoring||opening||documentSaving);$('open-sample').setAttribute('aria-disabled',String(restoring||opening||documentSaving));$('open-sample').tabIndex=restoring||opening||documentSaving?-1:0;$('theme').toggleAttribute('disabled',restoring);sourceChrome();}
// New documents start with extra camera padding on the left. Reconcile and
// restored tabs keep their existing camera, including an absent legacy inset.
type PickerWindow=Window & {showOpenFilePicker?: (options:unknown)=>Promise<FileSystemFileHandle[]>};
async function addFile(file:File,handle?:FileSystemFileHandle){if(sourceTarget&&!await closeSource())return;const design=parseDesign(await file.text());let existing:Tab|undefined;if(handle){for(const t of state.tabs)if(t.handle&&await t.handle.isSameEntry(handle)){existing=t;break;}}if(existing){const changed=capture()||state.active!==existing.key;state.active=existing.key;render();persist(180,changed);return;}const tab=reconcile({key:crypto.randomUUID(),name:file.name,design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0],handle},design);capture();const index=state.tabs.findIndex(t=>t.key===state.active);state.tabs.splice(index+1,0,tab);state.active=tab.key;render();persist();status('');}
$('empty').onpointerdown=e=>e.stopPropagation();
for(const id of ['open','open-url','open-text'])$('guide-'+id).onclick=()=>$(id).click();
$('open-sample').onpointerdown=e=>e.stopPropagation();
$('open-sample').onclick=e=>{e.preventDefault();if(restoring||opening||documentSaving)return;try{let tab=state.tabs.find(t=>t.source?.kind==='sample');if(!tab){const design=parseDesign(sampleMarkdown);tab=reconcile({key:crypto.randomUUID(),name:'Alderを使った設計業務',source:{kind:'sample'},design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:state.sampleLayout?undefined:[40,0],...state.sampleLayout},design);const index=state.tabs.findIndex(t=>t.key===state.active);state.tabs.splice(index+1,0,tab);}capture();state.active=tab.key;render();persist();status('');$('viewport').focus({preventScroll:true});}catch(e){status('サンプルを開けません: '+(e as Error).message,'error');}};
$('open').onclick=async()=>{if(restoring||opening||documentSaving)return;opening=true;render();try{const picker=(window as PickerWindow).showOpenFilePicker;if(picker){const handles=await picker({multiple:true,types:[{description:'Business Design Markdown',accept:{'text/markdown':['.md','.markdown']}}]});for(const h of handles)await addFile(await h.getFile(),h);}else $('fallback').click();}catch(e){if((e as Error).name!=='AbortError')status('開けません: '+(e as Error).message,'error');}finally{opening=false;render();}};
($('fallback') as HTMLInputElement).onchange=async()=>{const input=$('fallback') as HTMLInputElement;if(restoring||opening||documentSaving)return;opening=true;render();try{for(const f of Array.from(input.files??[]))await addFile(f);}catch(e){status('開けません: '+(e as Error).message,'error');}input.value='';opening=false;render();};
// Save a replacement before changing the displayed Graph. A failed transaction
// leaves the old design and the per-tab draft available for an explicit retry.
class DocumentSaveError extends Error{constructor(error:unknown){super(error instanceof Error?error.message:'表示状態を保存できません。');this.name='DocumentSaveError';}}
async function saveDocument(project:()=>Session,commit:()=>void){
  if(documentSaving||closing)throw Error('表示状態を保存しています。完了後に再試行してください。');
  try{ensureWritable();}catch(error){throw new DocumentSaveError(error);}capture();clearTimeout(timer);timer=undefined;documentSaving=true;revision++;const version=revision;render();saveStateChrome();let saved=false;
  try{
    const snapshot=structuredClone(project());await queueSnapshot(snapshot,version);
    commit();acknowledgeDrafts(snapshot);saved=true;
  }catch(error){saveFailure(error);throw new DocumentSaveError(error);}
  finally{documentSaving=false;render();saveStateChrome();if(saved&&revision!==version)persist(0,false);}
}
async function replace(t:Tab,d:ReturnType<typeof parseDesign>,handle=t.handle,edited=false){
  if(!state.tabs.includes(t)||closing===t)return false;
  await saveDocument(()=>({...state,tabs:state.tabs.map(x=>x===t?reconcile({...t,handle,edited,draft:undefined},d):x)}),()=>{
    // Keep identity and any camera/selection changes made while storage settled.
    Object.assign(t,reconcile({...t,handle,edited,draft:undefined},d));
  });
  status('');return true;
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
  }catch(e){if(state.tabs.includes(t)&&(e as Error).name!=='AbortError'&&!(e instanceof DocumentSaveError))status('更新失敗。編集と旧表示を保持しています: '+(e as Error).message,'error');}
  finally{updating.delete(t);render();}
};
type SourceMode='url'|'text'|'edit';
let sourceMode:SourceMode='text',sourceTarget:string|undefined,sourceBusy=false,sourceToken=0,sourceAbort:AbortController|undefined,sourceOpener:HTMLElement|null=null;
const sourceText=()=>($('source-text') as HTMLTextAreaElement),sourceURL=()=>($('source-url') as HTMLInputElement);
function updateSourceDirty(){draftDirty=!$('source-dialog').hidden&&sourceMode!=='edit'&&(sourceMode==='text'?sourceText().value:sourceURL().value)!=='';saveStateChrome();}
sourceURL().addEventListener('input',updateSourceDirty);
const editingTab=()=>state.tabs.find(t=>t.key===sourceTarget);
function rememberEditorInput(){
  const t=editingTab();if(sourceMode!=='edit'||$('source-dialog').hidden||!t||documentSaving||closing)return;
  const value=sourceText().value,draft=value===t.design.markdown.replace(/\r\n?/g,'\n')?undefined:value;
  if(t.draft!==draft){t.draft=draft;unsavedDrafts.add(t.key);persist();}sourceChrome();
}
// Textareas normalize line endings; opening CRLF source alone is not an edit.
function editorChanged(){const t=editingTab();return !!t&&sourceText().value!==t.design.markdown.replace(/\r\n?/g,'\n');}
function sourceChrome(){
  sharingChrome();
  const edit=sourceMode==='edit',busy=sourceBusy||documentSaving||(edit&&!!closing);sourceText().disabled=busy;
  $('source-dialog').dataset.mode=sourceMode;
  $('source-submit').textContent=edit?'反映する':'表示';
  $<HTMLButtonElement>('source-submit').disabled=busy||(edit&&!editorChanged());$<HTMLButtonElement>('source-cancel').disabled=edit&&busy;
  $('source-cancel').textContent=edit?'閉じる':'キャンセル';
  updateSourceDirty();queueMicrotask(drainSharedSource);
}
function showSource(mode:SourceMode,target?:Tab){
  if(restoring||opening||documentSaving||(target&&(updating.has(target)||!!closing)))return;
  rememberEditorInput();sourceAbort?.abort();sourceToken++;sourceMode=mode;sourceTarget=target?.key;sourceBusy=false;sourceOpener=document.activeElement as HTMLElement;
  $('source-dialog').hidden=false;$('source-title').textContent=target?`Markdown原文 · ${target.name}`:mode==='url'?'URLを開く':'テキストを入力';
  for(const id of ['url-label','source-url'])$(id).hidden=mode!=='url';for(const id of ['text-label','source-text'])$(id).hidden=mode==='url';
  $('source-help').textContent=mode==='url'?'匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。復元時には自動取得しません。':mode==='edit'?'元ファイルやURLは書き換えません。':'入力本文はこのブラウザーに保存します。作成後は「原文を見る／編集する」から編集できます。外部送信しません。';
  if(target)sourceText().value=target.draft??target.design.markdown;
  else if(mode==='text')sourceText().value=newTextDraft;
  sourceChrome();(mode==='url'?sourceURL():sourceText()).focus();
}
let newTextDraft='';
let headerRevealFrame:number|undefined;
function restoreSourceOpener(){
  if(sourceOpener?.isConnected)sourceOpener.focus({preventScroll:true});
  if(headerRevealFrame!==undefined)cancelAnimationFrame(headerRevealFrame);
  if(sourceMode!=='edit')return;
  const token=sourceToken;
  headerRevealFrame=requestAnimationFrame(()=>{
    headerRevealFrame=undefined;
    if(token!==sourceToken||!$('source-dialog').hidden||$<HTMLDialogElement>('source-close-dialog').open)return;
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
  rememberEditorInput();const t=editingTab();
  if(sourceMode==='edit'&&t&&(t.draft!==undefined||unsavedDrafts.has(t.key))){
    sourceBusy=true;sourceChrome();
    try{await saveDocument(()=>state,()=>{});}
    catch{saveStateChrome();return false;}
    finally{sourceBusy=false;sourceChrome();}
  }
  if(sourceMode==='text')newTextDraft=sourceText().value;hideSource();return true;
}
// Fit only an off-screen confirmation once when it opens. Do not chase user pan.
function placeSourceClosePrompt(dialog:HTMLDialogElement){
  const viewport=window.visualViewport;
  if(!viewport||viewport.width<=0||viewport.height<=0)return;
  const rect=dialog.getBoundingClientRect(),left=viewport.offsetLeft,top=viewport.offsetTop;
  if(rect.width<=0||rect.height<=0||rect.left>=left&&rect.right<=left+viewport.width&&rect.top>=top&&rect.bottom<=top+viewport.height)return;
  const gap=Math.min(8,viewport.width/4,viewport.height/4);
  dialog.style.margin='0';dialog.style.inset='auto';
  dialog.style.width=Math.min(rect.width,viewport.width-gap*2)+'px';
  dialog.style.maxHeight=(viewport.height-gap*2)+'px';
  const fitted=dialog.getBoundingClientRect();
  dialog.style.left=(left+Math.max(gap,(viewport.width-fitted.width)/2))+'px';
  dialog.style.top=(top+Math.max(gap,(viewport.height-fitted.height)/2))+'px';
}
function clearSourceClosePlacement(dialog:HTMLDialogElement){
  for(const property of ['margin','margin-top','margin-right','margin-bottom','margin-left','inset','right','bottom','width','max-height','left','top'])dialog.style.removeProperty(property);
}
// Explicit Close/Escape asks before hiding changed text; switching tabs still saves quietly.
let sourceClosePrompt:Promise<boolean>|undefined;
function requestCloseSource():Promise<boolean>{
  if(sourceClosePrompt)return sourceClosePrompt;
  if(documentSaving||(sourceMode==='edit'&&sourceBusy))return Promise.resolve(false);
  if(sourceMode!=='edit'||$('source-dialog').hidden||!editorChanged())return closeSource();
  rememberEditorInput();
  const dialog=$<HTMLDialogElement>('source-close-dialog'),confirm=$<HTMLButtonElement>('source-close-confirm'),keep=$<HTMLButtonElement>('source-close-continue');
  const target=sourceTarget,text=sourceText(),selection=[text.selectionStart,text.selectionEnd,text.selectionDirection] as const;
  sourceClosePrompt=new Promise(resolve=>{
    let settling=false;
    const finish=async(accepted:boolean)=>{
      if(settling)return;settling=true;confirm.disabled=keep.disabled=true;
      const closed=accepted&&sourceMode==='edit'&&sourceTarget===target?await closeSource():false;
      dialog.close();clearSourceClosePlacement(dialog);sourceClosePrompt=undefined;confirm.disabled=keep.disabled=false;
      if(closed){restoreSourceOpener();}
      else if(!$('source-dialog').hidden){text.focus({preventScroll:true});text.setSelectionRange(...selection);}
      resolve(closed);
    };
    confirm.onclick=()=>finish(true);keep.onclick=()=>finish(false);
    dialog.oncancel=e=>{e.preventDefault();void finish(false);};
    dialog.showModal();placeSourceClosePrompt(dialog);keep.focus({preventScroll:true});
  });
  return sourceClosePrompt;
}
sourceText().oninput=()=>{if(sourceMode==='edit')rememberEditorInput();else if(sourceMode==='text'){newTextDraft=sourceText().value;updateSourceDirty();}};
let copyingSource=false;
function sharingReason(){
  if(restoring||opening||sourceBusy||documentSaving||closing)return '読込・保存が終わってから共有してください。';
  return sourceSharingReason(current());
}
function sharingChrome(){
  const reason=sharingReason(),button=$('share-source');button.hidden=!current();
  button.setAttribute('aria-disabled',String(copyingSource||!!reason));
  button.title=reason??'取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。';
}
$('share-source').onclick=async()=>{
  if(copyingSource)return;
  rememberEditorInput();const reason=sharingReason();if(reason){status(reason,'warning');return;}
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
  if(closing||sourceBusy||(opening&&!sharedSourceAbort)){status('読込・保存が終わってから共有リンクを開き直してください。','warning');return;}
  const token=++sharedSourceToken;sharedSourceAbort?.abort();
  try{
    const url=readSharedSource(hash)!;
    ensureWritable();rememberEditorInput();
    const existing=state.tabs.find(t=>t.source?.kind==='url'&&t.source.url===url);
    if(existing){
      // Revisit selects the saved document, including local edits and its view.
      // Only explicit Refresh may replace it with the source's current content.
      if(sourceTarget&&sourceTarget!==existing.key&&!(await (sourceClosePrompt??closeSource())))return;
      if(token!==sharedSourceToken||navigation!==sharedSourceNavigation)return;
      const changed=capture()||state.active!==existing.key;
      state.active=existing.key;render();persist(180,changed);
      status('開いている共有元のタブを選択しました。保存内容と編集は保持しています。');
      return;
    }
    sharedSourceAbort=new AbortController();opening=true;render();
    const design=parseDesign(await fetchMarkdown(url,sharedSourceAbort.signal));
    if(token!==sharedSourceToken)return;
    const tab=reconcile({key:crypto.randomUUID(),name:new URL(url).pathname.split('/').pop()||'URLのMarkdown',source:{kind:'url',url},design,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},design);
    await saveDocument(()=>({...state,tabs:[...state.tabs,tab],active:tab.key}),()=>{state.tabs.push(tab);state.active=tab.key;});
    status('共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: '+url);
  }catch(error){if(token===sharedSourceToken&&!(error instanceof DocumentSaveError))status('共有リンクを開けません。既存の表示は保持しています: '+(error as Error).message,'error');}
  finally{if(token===sharedSourceToken){sharedSourceAbort=undefined;opening=false;render();drainSharedSource();}}
}
window.addEventListener('hashchange',()=>{void openSharedSource();});
$('edit-markdown').onclick=()=>{const t=current();if(t)showSource('edit',t);};
$('open-url').onclick=()=>showSource('url');$('open-text').onclick=()=>showSource('text');$('source-cancel').onclick=()=>requestCloseSource();
$('source-dialog').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();void requestCloseSource();}};
$('source-submit').onclick=async()=>{
  if(sourceBusy||documentSaving||(sourceMode==='edit'&&closing)||$('source-dialog').hidden||(sourceMode==='edit'&&!editorChanged()))return;
  rememberEditorInput();sourceBusy=true;sourceChrome();const token=++sourceToken,target=editingTab(),mode=sourceMode;sourceAbort=new AbortController();
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
  }catch(e){if(token===sourceToken&&!(e instanceof DocumentSaveError))status('表示できません。入力と旧表示を保持しています: '+(e as Error).message,'error');}
  finally{if(token===sourceToken){sourceBusy=false;sourceChrome();}}
};
$('layout-lock').onclick=()=>{if(restoring)return;touch.cancel();pan=undefined;capture();layoutLocked=!layoutLocked;chrome();graph();};
$<HTMLInputElement>('selected-edges-only').onchange=()=>{const t=current();if(!t||restoring||closing===t)return;touch.cancel();pan=undefined;capture();t.selectedEdgesOnly=$<HTMLInputElement>('selected-edges-only').checked;redrawEdges();persist();};
$<HTMLInputElement>('show-exceptions').onchange=()=>{const t=current();if(!t||restoring||closing===t)return;touch.cancel();pan=undefined;capture();t.showExceptions=$<HTMLInputElement>('show-exceptions').checked;redrawEdges();persist();};
$<HTMLInputElement>('prefer-write').onchange=()=>{if(restoring)return;capture();state.preferWrite=$<HTMLInputElement>('prefer-write').checked;graph();persist();};
$('theme').onclick=()=>{if(restoring)return;state.dark=!state.dark;chrome();persist();};$('drawer').onclick=()=>{if(restoring||!current())return;capture();state.drawer=!state.drawer;render();persist();};for(const [id,factor] of [['in',1.2],['out',1/1.2]] as const)$(id).onclick=()=>{const t=current();if(t&&closing!==t){const captured=capture(),zoom=clampZoom(t.zoom*factor),changed=captured||zoom!==t.zoom;t.zoom=zoom;render();persist(180,changed);}};
const viewport=$('viewport');
function changeDraggedNode(id:string,position:Point){
  const t=current();if(!t||closing===t)return;capture();const previous=t.positions[id];t.positions[id]=position;if(previous?.[0]!==position[0]||previous?.[1]!==position[1])markChanged();
  const node=Array.from($('nodes').children).find(n=>(n as HTMLElement).dataset.node===id) as HTMLElement|undefined;
  if(node){node.style.left=position[0]+'px';node.style.top=position[1]+'px';}
  redrawEdges();
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
    t.scroll=[Math.max(0,desired[0]+growth[0]),Math.max(0,desired[1]+growth[1])];layoutCanvas(t);viewport.scrollLeft=t.scroll[0];viewport.scrollTop=t.scroll[1];capture();markChanged();
  },
  requestFrame:callback=>requestAnimationFrame(callback),cancelFrame:id=>cancelAnimationFrame(id)
});
const touch=installTouchGestures(viewport,{
  nodeDrag,
  read:()=>{const t=current();return t&&closing!==t?{key:t.key,zoom:t.zoom,locked:layoutLocked,scroll:[viewport.scrollLeft,viewport.scrollTop]}:undefined;},
  position:id=>current()?.positions[id],
  change:value=>{const t=current();if(!t||closing===t)return;const beforeScroll=t.scroll;let changed=false;
    if(value.node)changeDraggedNode(value.node.id,value.node.position);
    if(value.selected){changed=changed||t.selected!==value.selected;t.selected=value.selected;revealListNode(value.selected);}
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
viewport.onpointerdown=e=>{const t=current(),node=(e.target as HTMLElement).closest<HTMLElement>('.node')?.dataset.node;if(e.button!==0||!t||t===closing||(node&&!layoutLocked))return;pan={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[viewport.scrollLeft,viewport.scrollTop],node,moved:false};viewport.setPointerCapture(e.pointerId);};
viewport.onpointermove=e=>{if(pan&&pan.pointer===e.pointerId&&pan.key===current()?.key&&current()!==closing){const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)>3)pan.moved=true;viewport.scrollLeft=pan.scroll[0]-dx;viewport.scrollTop=pan.scroll[1]-dy;capture();}};
viewport.onpointerup=e=>{if(!pan||pan.pointer!==e.pointerId)return;const t=current(),p=pan;pan=undefined;if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);if(t&&t!==closing&&p.key===t.key&&!p.moved&&p.node){if(t.selected!==p.node){t.selected=p.node;markChanged();}revealListNode(p.node);graph();}capture();persist(180,false);};
viewport.onpointercancel=()=>{pan=undefined;};
viewport.addEventListener('lostpointercapture',e=>{if(e.target===viewport&&pan?.pointer===e.pointerId)pan=undefined;});
let resizing=false;$('resize').onpointerdown=e=>{if(restoring)return;resizing=true;$('resize').setPointerCapture(e.pointerId);};$('resize').onpointermove=e=>{if(resizing){const width=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));if(width!==state.width){state.width=width;markChanged();}chrome();}};$('resize').onpointerup=()=>{resizing=false;persist(180,false);};$('resize').onpointercancel=()=>{resizing=false;persist(180,false);};$('resize').onkeydown=e=>{if(restoring)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const width=Math.max(260,Math.min(innerWidth*.65,state.width+(e.key==='ArrowLeft'?20:-20)));if(width!==state.width){state.width=width;markChanged();}chrome();persist(180,false);}};window.addEventListener('resize',()=>{chrome();const t=current();if(t)layoutCanvas(t);});
// Viewport resize and wrapped toolbar labels can change the required tail.
// Recompute from current content, never from a historical maximum; keep pan.
if(typeof ResizeObserver!=='undefined'){const canvasResize=new ResizeObserver(()=>{const t=current();if(t)layoutCanvas(t);});canvasResize.observe($('viewport'));canvasResize.observe(document.querySelector<HTMLElement>('.toolbar')!);}
// Validate all fields consumed by rendering before adopting a stored tab.
function validateRestoredTab(t:Tab){
  if(!t||typeof t.key!=='string'||!t.key||typeof t.name!=='string'||!t.design||typeof t.design.markdown!=='string'||!t.design.sections||typeof t.design.sections!=='object'||Array.isArray(t.design.sections)||(t.selected!==undefined&&typeof t.selected!=='string'))throw Error('Invalid saved document');
  validateGraph(t.design.graph);
  // Recompute annotations from the source, never trust stored derived metadata.
  t.design.findings=findingsFromSource(t.design.markdown,new Set(t.design.graph.nodes.map(n=>n.id)));
  if((t.draft!==undefined&&typeof t.draft!=='string')||(t.edited!==undefined&&typeof t.edited!=='boolean'))throw Error('Invalid editor state');
  if(!t.design.graph.nodes.every(n=>Object.hasOwn(t.design.sections,n.id)&&typeof t.design.sections[n.id]==='string')||(t.design.activityOrder!==undefined&&(!Array.isArray(t.design.activityOrder)||!t.design.activityOrder.every(id=>typeof id==='string'))))throw Error('Invalid saved sections');
  if(t.source!==undefined&&(!t.source||!['text','sample','url'].includes(t.source.kind)||(t.source.kind==='url'&&typeof t.source.url!=='string')))throw Error('Invalid saved source');
}
const initialState=state;
render();saveStateChrome();loadSession().then(saved=>{if(saved===undefined)return;if(!Array.isArray(saved.tabs)||typeof saved.dark!=='boolean'||typeof saved.drawer!=='boolean'||(saved.preferWrite!==undefined&&typeof saved.preferWrite!=='boolean')||(saved.scopeOutside!==undefined&&!['show','dim','hide'].includes(saved.scopeOutside))||(saved.dimOutside!==undefined&&typeof saved.dimOutside!=='boolean')||(saved.hideOutside!==undefined&&typeof saved.hideOutside!=='boolean')||!Number.isFinite(saved.width))throw Error('Invalid session');for(const t of saved.tabs)validateRestoredTab(t);if(new Set(saved.tabs.map(t=>t.key)).size!==saved.tabs.length||(saved.active!==undefined&&typeof saved.active!=='string'))throw Error('Invalid saved tab keys');if(saved.nodeDrawer!==undefined&&typeof saved.nodeDrawer!=='boolean')throw Error('Invalid drawer');for(const t of [...saved.tabs,...(saved.sampleLayout===undefined?[]:[saved.sampleLayout])]){if(!t||!t.positions||typeof t.positions!=='object'||Array.isArray(t.positions)||(t.selectedEdgesOnly!==undefined&&typeof t.selectedEdgesOnly!=='boolean')||(t.showExceptions!==undefined&&typeof t.showExceptions!=='boolean')||(t.hiddenNodes!==undefined&&(!Array.isArray(t.hiddenNodes)||!t.hiddenNodes.every(id=>typeof id==='string')))||(t.viewInset!==undefined&&(!Array.isArray(t.viewInset)||t.viewInset.length!==2||!t.viewInset.every(v=>Number.isFinite(v)&&v>=0)))||(t.canvasOrigin!==undefined&&(!Array.isArray(t.canvasOrigin)||t.canvasOrigin.length!==2||!t.canvasOrigin.every(v=>Number.isFinite(v)&&v>=0)))||!Array.isArray(t.scroll)||t.scroll.length!==2||!t.scroll.every(Number.isFinite)||!Number.isFinite(t.zoom)||t.zoom<.25||t.zoom>2.5||!Object.values(t.positions).every(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)))throw Error('Invalid layout');}// Removed dim preferences migrate to show so previously visible nodes stay visible.
const {dimOutside:_dimOutside,hideOutside:_hideOutside,scopeOutside:_scopeOutside,...restored}=saved;
const migrate=(t:Tab)=>({...t,hiddenNodes:t.hiddenNodes??(saved.scopeOutside==='hide'?t.design.graph.nodes.filter(n=>!n.scope).map(n=>n.id):[])});state={...restored,tabs:saved.tabs.map(t=>reconcile(migrate(t),t.design))};if(saved.sampleLayout&&saved.sampleLayout.hiddenNodes===undefined&&saved.scopeOutside==='hide')state.sampleLayout={...saved.sampleLayout,hiddenNodes:parseDesign(sampleMarkdown).graph.nodes.filter(n=>!n.scope).map(n=>n.id)};if(!state.tabs.some(t=>t.key===state.active))state.active=state.tabs[0]?.key;if(current()?.selected)revealListNode(current()!.selected!);render();if(state.tabs.some(t=>t.source?.kind!=='text'&&t.source?.kind!=='sample'))status('保存時の内容です。最新の取得元は「更新」で確認できます。','warning');savedOnce=true;}).catch(()=>{state=initialState;restoreFailed=true;protectedStorage();}).finally(()=>{restoring=false;render();saveStateChrome();void openSharedSource();});
