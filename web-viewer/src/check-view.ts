import {formattedMarkdown} from './markdown';
import {parseChecks,checkCompatibility,confirmationKey,type RelatedChecks,type CheckDocument} from './check-items';
import type {Tab} from './session';
export type CheckViewState={mode:'business'|'checks';candidate?:RelatedChecks;busy?:boolean;error?:string;url?:string};
const button=(label:string,fn:()=>void)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b;};
function paragraph(root:HTMLElement,text:string){const p=document.createElement('p');p.textContent=text;root.append(p);}
function originalMarkdown(source:string){const pre=document.createElement('pre');pre.className='check-source';pre.textContent=source;return pre;}
function renderBody(root:HTMLElement,body:string){
  // Interpret only disclosure wrappers; source HTML remains inert.
  const pattern=/<details>\s*<summary>([^<]*)<\/summary>([\s\S]*?)<\/details>/g;let end=0;
  for(const m of body.matchAll(pattern)){root.append(formattedMarkdown(body.slice(end,m.index)));const d=document.createElement('details'),s=document.createElement('summary');s.textContent=m[1];d.append(s,formattedMarkdown(m[2]));root.append(d);end=m.index!+m[0].length;}
  root.append(formattedMarkdown(body.slice(end)));
}
export function checkView(tab:Tab,view:CheckViewState,actions:{file:(file:File)=>void;url:(url:string)=>void;confirm:(candidate:RelatedChecks)=>void;remove:()=>void;redraw:()=>void;disabled:boolean;sample?:()=>void}):{controls:HTMLElement;content?:HTMLElement}{
  const root=document.createElement('section');root.className='check-controls';root.setAttribute('aria-label','関連Check');
  const management=document.createElement('section');management.className='check-management check-controls';
  const controls=document.createElement('fieldset');controls.className='empty-guide check-guide';controls.disabled=actions.disabled||view.busy===true;management.append(controls);
  const title=document.createElement('h2');title.textContent='チェックリストを開くには';controls.append(title);
  paragraph(controls,'この業務設計書に対応するチェックリスト（Check Items、Markdown形式）を開くと、選択したActivityの関連項目を確認できます。ファイル、URLから開き方を選べます。');
  const entries=document.createElement('div');entries.className='empty-actions';controls.append(entries);
  const file=document.createElement('input');file.type='file';file.accept='.md,.markdown,text/markdown,text/plain';file.id='check-file';file.hidden=true;
  file.onchange=()=>{const f=file.files?.[0];file.value='';if(f)actions.file(f);};
  const open=button('ファイルを開く',()=>file.click());open.id='check-open';open.setAttribute('aria-label','関連Checkのファイルを開く');entries.append(open);controls.append(file);
  const form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('input');form.id='check-url-form';form.hidden=true;input.type='url';input.id='check-url';input.required=true;input.placeholder='https://…/checks.md';input.value=view.url??'';input.oninput=()=>view.url=input.value;label.htmlFor=input.id;label.textContent='匿名取得できるHTTPSのMarkdown本文URL';
  const submit=document.createElement('button');submit.type='submit';submit.textContent='Checkを読み込む';submit.id='check-url-submit';form.onsubmit=e=>{e.preventDefault();actions.url(input.value.trim());};form.append(label,input,submit);controls.append(form);
  const openURL=button('URLを開く',()=>{form.hidden=!form.hidden;openURL.setAttribute('aria-expanded',String(!form.hidden));if(!form.hidden)input.focus();});openURL.id='check-open-url';openURL.setAttribute('aria-expanded','false');openURL.setAttribute('aria-controls',form.id);entries.append(openURL);
  if(actions.sample){const note=document.createElement('p');note.textContent='サンプルのチェックリストで、表示を試してみてください。';const sample=document.createElement('a');sample.id='check-open-sample';sample.href='#check-sample';sample.textContent='チェックリストのサンプルを開く';sample.setAttribute('aria-disabled',String(actions.disabled||view.busy===true));sample.onclick=e=>{e.preventDefault();if(!actions.disabled&&!view.busy)actions.sample!();};note.append(document.createElement('br'),sample);controls.append(note);}
  if(view.busy)paragraph(management,'関連Checkを読み込み・保存しています…');
  if(view.error){const error=document.createElement('p');error.className='check-warning';error.setAttribute('role','alert');error.textContent=view.error;management.append(error);}
  let doc:CheckDocument|undefined,usable=false;
  if(tab.checks){
    paragraph(management,'読込済み: '+tab.checks.name);doc=parseChecks(tab.checks.markdown);const match=checkCompatibility(doc,tab);
    usable=match.state==='matched'||(match.state==='unverified'&&tab.checks.confirmedFor===confirmationKey(tab));
    paragraph(management,usable?(match.state==='matched'?match.reason:'一致未確認・利用者が表示を選択しました。'+match.reason):'現在のBDとの対応を再確認してください。'+match.reason);
    if(!usable&&match.state==='unverified')controls.append(button('現在のBDとの対応を確認して表示する',()=>actions.confirm(tab.checks!)));
    controls.append(button('関連Checkを解除',actions.remove));
  }
  if(view.candidate){
    const candidate=view.candidate,parsed=parseChecks(candidate.markdown),match=checkCompatibility(parsed,tab);
    const panel=document.createElement('section');panel.className='check-candidate';panel.id='check-candidate';
    paragraph(panel,'一致未確認: '+candidate.name+' — '+match.reason);
    paragraph(panel,'関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。');
    const evidence=document.createElement('details'),summary=document.createElement('summary');summary.textContent='原典参照・業務別インデックス・Check本文を確認';evidence.append(summary,originalMarkdown(parsed.markdown));panel.append(evidence);
    const confirm=button('対応を確認して表示する',()=>actions.confirm(candidate));confirm.id='check-confirm';confirm.disabled=match.state==='mismatch'||actions.disabled||view.busy===true;
    const cancel=button('この読込を取り消す',()=>{view.candidate=undefined;actions.redraw();});cancel.disabled=actions.disabled||view.busy===true;panel.append(confirm,cancel);management.append(panel);
  }
  const nav=document.createElement('div');nav.className='check-modes';nav.setAttribute('role','group');nav.setAttribute('aria-label','右Drawerの表示');
  for(const [mode,label] of [['business','業務内容'],['checks','チェック項目']] as const){const b=button(label,()=>{view.mode=mode;actions.redraw();});b.id='detail-mode-'+mode;b.setAttribute('aria-pressed',String(view.mode===mode));nav.append(b);}root.append(nav);
  if(view.mode==='business')return {controls:root};
  const content=document.createElement('section');content.className='check-content';
  if(!doc||!usable){content.append(management);return {controls:root,content};}
  const selected=tab.design.graph.nodes.find(n=>n.id===tab.selected);
  if(selected?.type!=='business')paragraph(content,'Activityを選択すると、業務別のCheck Itemsが表示されます。');
  else{
    const ids=doc.index[selected.name]??[];
    if(!ids.length)paragraph(content,'このActivityに対応するCheckは業務一覧に記載されていません。');
    for(const id of ids){const item=doc.items.find(i=>i.id===id)!;const section=document.createElement('section');section.className='check-item';section.dataset.checkId=id;const h=document.createElement('h3');h.textContent=item.title;section.append(h);renderBody(section,item.body);content.append(section);}
  }
  const names=new Set(tab.design.graph.nodes.filter(n=>n.type==='business').map(n=>n.name)),unknown=Object.keys(doc.index).filter(n=>!names.has(n)),unassigned=doc.items.filter(i=>!i.activities.length);
  if(unknown.length||unassigned.length)paragraph(content,'対応先不明: '+[...unknown,...unassigned.map(i=>i.id)].join('、'));
  const full=document.createElement('details'),fullSummary=document.createElement('summary');fullSummary.textContent='業務別インデックスとCheck原文全文';full.append(fullSummary,originalMarkdown(doc.markdown));content.append(full);
  const manage=document.createElement('details'),manageSummary=document.createElement('summary');manage.id='check-manage';manageSummary.textContent='チェックリストを再指定・解除する';manage.open=Boolean(view.busy||view.error||view.candidate);manage.append(manageSummary,management);content.append(manage);
  return {controls:root,content};
}
