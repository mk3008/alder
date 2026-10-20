import type {Design} from './graph';
export type Transition={id:string;from:string;activity:string;condition:string;to:string;effect:string;path:string;evidence:string;note:string};
export type StateModel={object:string;states:string[];start:string;terminal:string;completeness:string;source:string;transitions:Transition[]};
export type StateDeclaration={model:StateModel;error?:never}|{error:string;model?:never};
const fields=['id','from','activity','condition','to','effect','path','evidence','note'];
const check=(ok:unknown,message:string):void=>{if(!ok)throw Error(message);};
const isText=(v:unknown):v is string=>typeof v==='string'&&!!v.trim();
/** Experimental table declaration only. No prose extraction or condition evaluation. */
export function parseStateDeclaration(body:string,object:string):StateDeclaration{
 try{
  const match=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(body.trim());
  check(match,'state-meta と遷移表が必要です');const meta=JSON.parse(match![1]);
  check(meta&&typeof meta==='object'&&!Array.isArray(meta),'メタ情報が不正です');
  check(Object.keys(meta).sort().join('|')===['object','states','start','terminal','completeness','source'].sort().join('|'),'メタ情報の項目が不正です');
  check(meta.object===object,'対象Objectが一致しません');
  check(Array.isArray(meta.states)&&meta.states.length>0&&meta.states.every((s:unknown)=>isText(s)&&!s.startsWith('@'))&&new Set(meta.states).size===meta.states.length,'状態一覧が不正です');
  check(meta.start==='@new'&&meta.terminal==='@unknown'&&meta.completeness==='partial'&&isText(meta.source),'開始・終端・部分定義の宣言が不正です');
  const ls=match![2].trim().split(/\r?\n/),cells=(line:string)=>{check(line.startsWith('|')&&line.endsWith('|'),'表の行が不正です');return line.slice(1,-1).split('|').map(v=>v.trim());};
  check(cells(ls[0]).join('|')===fields.join('|'),'表の列名が不正です');
  check(cells(ls[1]).length===fields.length&&cells(ls[1]).every(s=>/^-+$/.test(s)),'表の区切りが不正です');
  check(ls.length<=1002,'遷移は1000行以内にしてください');
  const ids=new Set<string>();
  const transitions=ls.slice(2).map(line=>{
   const values=cells(line);check(values.length===fields.length&&values.every(isText),'表の列数・空欄が不正です');
   const r=Object.fromEntries(fields.map((key,i)=>[key,values[i]])) as Transition;
   check(/^T[0-9]+$/.test(r.id)&&!ids.has(r.id),'遷移IDが不正または重複しています');ids.add(r.id);
   check([...meta.states,'@new'].includes(r.from)&&[...meta.states,'@unknown','@none'].includes(r.to),'未登録の状態が参照されています');
   check(['change','unchanged','no-create','constraint'].includes(r.effect)&&['normal','exception'].includes(r.path),'効果・経路の指定が不正です');
   check(r.effect!=='unchanged'||r.from===r.to,'状態不変の元と先が一致しません');
   check(r.effect!=='change'||(!r.to.startsWith('@')&&r.from!==r.to),'状態変更の遷移先が不正です');
   check(r.effect!=='no-create'||(r.from==='@new'&&r.to==='@none'),'不成立の元と先が不正です');
   check(r.effect!=='constraint'||r.to==='@unknown','未決の制約は遷移先未決としてください');return r;
  });return {model:{...meta,transitions}};
 }catch(error){return {error:error instanceof Error?error.message:'状態遷移の宣言が不正です'};}
}
export function stateTransitionPanel(design:Design,id:string,navigate:(id:string)=>void):HTMLElement|undefined{
 const declaration=design.objectStateTransitions?.[id];if(!declaration||!design.graph.nodes.some(n=>n.id===id&&n.type==='object'))return;
 const root=document.createElement('section');root.className='state-transition-panel';root.setAttribute('aria-label','状態遷移');
 const text=(tag:string,value:string,parent:HTMLElement=root)=>{const e=document.createElement(tag);e.textContent=value;parent.append(e);return e;};
 text('h2','状態遷移');
 if(declaration.error){text('p','状態遷移を表示できません：'+declaration.error).setAttribute('role','status');return root;}
 const model=declaration.model!;
 text('p','部分定義：未記載の操作は未決です。終端は未決です。');
 text('p','状態：'+model.states.join(' / '));
 text('p','開始候補：記録作成前（保存状態ではありません）。');
 const label=(value:string)=>({'@new':'記録作成前','@none':'作成不成立','@unknown':'遷移先未決'}[value]??value);
 const effects:Record<string,string>={change:'状態変更',unchanged:'状態不変','no-create':'作成しない',constraint:'結果の制約・遷移先未決'};
 const list=document.createElement('ol');root.append(list);
 for(const row of model.transitions){
  const li=document.createElement('li');li.dataset.transition=row.id;
  text('h3',`${row.id} · ${label(row.from)} → ${label(row.to)}`,li);
  text('p',`${effects[row.effect]} · ${row.path==='normal'?'正常':'例外'}`,li);
  const activity=design.graph.nodes.find(n=>n.id===row.activity&&n.type==='business');
  if(activity){const b=document.createElement('button');b.type='button';b.textContent=activity.name;b.onclick=()=>navigate(activity.id);li.append(b);}
  else text('p','要確認：根拠Activityが見つかりません — '+row.activity,li);
  text('p','条件：'+row.condition,li);text('p',row.note,li);text('p','根拠：'+row.evidence,li);list.append(li);
 }
 if(!model.transitions.length)text('p','明示された操作はありません。');
 const provenance=document.createElement('details');text('summary','宣言の出典',provenance);text('p',model.source,provenance);root.append(provenance);
 return root;
}
