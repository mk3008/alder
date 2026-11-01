import {readRelatedChecks,checkCompatibility,confirmationKey,type RelatedChecks,type CheckDocument} from './check-items';
import type {Tab} from './session';
import type {Check} from './json-document';
export type CheckViewState={candidate?:RelatedChecks;busy?:boolean;error?:string;url?:string};
const button=(label:string,fn:()=>void)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;};
function paragraph(root:HTMLElement,text:string){const p=document.createElement('p');p.textContent=text;root.append(p);}
function originalMarkdown(source:string){const pre=document.createElement('pre');pre.className='check-source';pre.textContent=source;return pre;}
/** The legacy adapter contributes only a Check whose source has been confirmed. */
export function availableRelatedChecks(tab:Tab):Check[]{
  if(!tab.checks)return [];
  const doc=readRelatedChecks(tab.checks),match=checkCompatibility(doc,tab);
  return match.state==='matched'||(match.state==='unverified'&&tab.checks.confirmedFor===confirmationKey(tab))?[doc.model]:[];
}
export function checkView(tab:Tab,view:CheckViewState,actions:{confirm:(candidate:RelatedChecks)=>void;redraw:()=>void;disabled:boolean}):HTMLElement{
  const root=document.createElement('section');root.className='check-controls';root.setAttribute('aria-label','関連Check');
  const notices=document.createElement('section');notices.className='check-notices';
  if(view.busy)paragraph(notices,'関連Checkを読み込み・保存しています…');
  if(view.error){const error=document.createElement('p');error.className='check-warning';error.setAttribute('role','alert');error.textContent=view.error;notices.append(error);}
  let doc:CheckDocument|undefined,usable=false;
  if(tab.checks){
    doc=readRelatedChecks(tab.checks);const match=checkCompatibility(doc,tab);
    usable=match.state==='matched'||(match.state==='unverified'&&tab.checks.confirmedFor===confirmationKey(tab));
    if(!usable){paragraph(notices,'現在のBDとの対応を再確認してください。'+match.reason);if(match.state==='unverified'){const confirm=button('現在のBDとの対応を確認して表示する',()=>actions.confirm(tab.checks!));confirm.disabled=actions.disabled||view.busy===true;notices.append(confirm);}}
  }
  if(view.candidate){
    const candidate=view.candidate,parsed=readRelatedChecks(candidate),match=checkCompatibility(parsed,tab);
    const panel=document.createElement('section');panel.className='check-candidate';panel.id='check-candidate';
    paragraph(panel,'一致未確認: '+candidate.name+' — '+match.reason);
    paragraph(panel,'関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。');
    const evidence=document.createElement('details'),summary=document.createElement('summary');summary.textContent='原典参照・業務別インデックス・Check本文を確認';evidence.append(summary,originalMarkdown(parsed.markdown));panel.append(evidence);
    const confirm=button('対応を確認して表示する',()=>actions.confirm(candidate));confirm.id='check-confirm';confirm.disabled=match.state==='mismatch'||actions.disabled||view.busy===true;
    const cancel=button('この読込を取り消す',()=>{view.candidate=undefined;actions.redraw();});cancel.disabled=actions.disabled||view.busy===true;panel.append(confirm,cancel);notices.append(panel);
  }
  if(notices.childNodes.length)root.append(notices);
  return root;
}
