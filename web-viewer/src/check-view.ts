import {formattedMarkdown} from './markdown';
import {parseChecks,checkCompatibility,confirmationKey,type RelatedChecks,type CheckDocument} from './check-items';
import type {Tab} from './session';
export type CheckViewState={mode:'business'|'checks';candidate?:RelatedChecks;busy?:boolean;error?:string;url?:string};
const button=(label:string,fn:()=>void)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;};
function paragraph(root:HTMLElement,text:string){const p=document.createElement('p');p.textContent=text;root.append(p);}
function originalMarkdown(source:string){const pre=document.createElement('pre');pre.className='check-source';pre.textContent=source;return pre;}
function renderBody(root:HTMLElement,body:string){
  // Supplemental disclosures stay in the original text available through the toolbar.
  const pattern=/<details>\s*<summary>([^<]*)<\/summary>([\s\S]*?)<\/details>/g;let end=0;
  for(const m of body.matchAll(pattern)){root.append(formattedMarkdown(body.slice(end,m.index)));end=m.index!+m[0].length;}
  root.append(formattedMarkdown(body.slice(end)));
}
export function checkView(tab:Tab,view:CheckViewState,actions:{confirm:(candidate:RelatedChecks)=>void;redraw:()=>void;disabled:boolean}):{controls:HTMLElement;content?:HTMLElement}{
  const root=document.createElement('section');root.className='check-controls';root.setAttribute('aria-label','関連Check');
  const notices=document.createElement('section');notices.className='check-notices';
  if(view.busy)paragraph(notices,'関連Checkを読み込み・保存しています…');
  if(view.error){const error=document.createElement('p');error.className='check-warning';error.setAttribute('role','alert');error.textContent=view.error;notices.append(error);}
  let doc:CheckDocument|undefined,usable=false;
  if(tab.checks){
    doc=parseChecks(tab.checks.markdown);const match=checkCompatibility(doc,tab);
    usable=match.state==='matched'||(match.state==='unverified'&&tab.checks.confirmedFor===confirmationKey(tab));
    if(!usable){paragraph(notices,'現在のBDとの対応を再確認してください。'+match.reason);if(match.state==='unverified'){const confirm=button('現在のBDとの対応を確認して表示する',()=>actions.confirm(tab.checks!));confirm.disabled=actions.disabled||view.busy===true;notices.append(confirm);}}
  }
  if(view.candidate){
    const candidate=view.candidate,parsed=parseChecks(candidate.markdown),match=checkCompatibility(parsed,tab);
    const panel=document.createElement('section');panel.className='check-candidate';panel.id='check-candidate';
    paragraph(panel,'一致未確認: '+candidate.name+' — '+match.reason);
    paragraph(panel,'関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。');
    const evidence=document.createElement('details'),summary=document.createElement('summary');summary.textContent='原典参照・業務別インデックス・Check本文を確認';evidence.append(summary,originalMarkdown(parsed.markdown));panel.append(evidence);
    const confirm=button('対応を確認して表示する',()=>actions.confirm(candidate));confirm.id='check-confirm';confirm.disabled=match.state==='mismatch'||actions.disabled||view.busy===true;
    const cancel=button('この読込を取り消す',()=>{view.candidate=undefined;actions.redraw();});cancel.disabled=actions.disabled||view.busy===true;panel.append(confirm,cancel);notices.append(panel);
  }
  const nav=document.createElement('div');nav.className='check-modes';nav.setAttribute('role','group');nav.setAttribute('aria-label','右Drawerの表示');
  for(const [mode,label] of [['business','業務内容'],['checks','チェック項目']] as const){const b=button(label,()=>{view.mode=mode;actions.redraw();});b.id='detail-mode-'+mode;b.setAttribute('aria-pressed',String(view.mode===mode));nav.append(b);}root.append(nav);
  if(view.mode==='business')return {controls:root};
  const content=document.createElement('section');content.className='check-content';
  if(notices.childNodes.length)content.append(notices);
  if(!doc||!usable){if(!notices.childNodes.length)paragraph(content,'チェックリストが開かれていません。');return {controls:root,content};}
  const selected=tab.design.graph.nodes.find(n=>n.id===tab.selected);
  if(!selected)paragraph(content,'図の業務やObjectを選択してください');
  else if(selected.type!=='business')paragraph(content,'このObjectに対応するCheckは業務一覧に記載されていません。');
  else{
    const ids=doc.index[selected.name]??[];
    if(!ids.length)paragraph(content,'このActivityに対応するCheckは業務一覧に記載されていません。');
    for(const id of ids){const item=doc.items.find(i=>i.id===id)!;const section=document.createElement('section');section.className='check-item';section.dataset.checkId=id;const h=document.createElement('h3');h.textContent=item.title;section.append(h);renderBody(section,item.body);content.append(section);}
  }
  const names=new Set(tab.design.graph.nodes.filter(n=>n.type==='business').map(n=>n.name)),unknown=Object.keys(doc.index).filter(n=>!names.has(n)),unassigned=doc.items.filter(i=>!i.activities.length);
  if(unknown.length||unassigned.length)paragraph(content,'対応先不明: '+[...unknown,...unassigned.map(i=>i.id)].join('、'));
  return {controls:root,content};
}
