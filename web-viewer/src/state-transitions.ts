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
/** Visual prototype: explicit edges only; no lifecycle or condition inference. */
function stateDiagram(model:StateModel):SVGSVGElement{
 const ns='http://www.w3.org/2000/svg',make=(name:string,attrs:Record<string,string>={})=>{const e=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const height=model.states.length*110+150,svg=make('svg',{viewBox:`0 0 320 ${height}`,role:'img','aria-label':model.object+'の状態遷移図',class:'state-diagram'}) as SVGSVGElement;
 const title=make('title');title.textContent=model.object+'：明示された状態遷移。破線の先は保存状態が未決。';svg.append(title);
 const defs=make('defs'),marker=make('marker',{id:'state-transition-arrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto-start-reverse'});marker.append(make('path',{d:'M0 0 L10 5 L0 10 Z',fill:'currentColor'}));defs.append(marker);svg.append(defs);
 const points=new Map<string,[number,number]>();points.set('@new',[125,24]);model.states.forEach((state,i)=>points.set(state,[125,110+i*110]));
 points.set('@none',[263,110]);points.set('@unknown',[263,height-40]);
 const labels:Record<string,string>={'@new':'開始候補','@none':'作成不成立','@unknown':'遷移先未決'};
 const groups=new Map<string,Transition[]>();for(const row of model.transitions){const key=JSON.stringify([row.from,row.to,row.effect,row.activity]);groups.set(key,[...(groups.get(key)??[]),row]);}
 let index=0;for(const rows of groups.values()){
  const row=rows[0],[x1,y1]=points.get(row.from)!,[x2,y2]=points.get(row.to)!,start=row.from==='@new'?10:22;
  let d:string,lx:number,ly:number;
  if(x1===x2&&y2>y1&&y2-y1<=110){d=`M${x1},${y1+start} V${y2-22}`;lx=x1+8;ly=(y1+y2)/2;}
  else if(row.to==='@unknown'||row.to==='@none'){const lane=193+(index%3)*4,source=row.from==='@new'?x1+10:x1+60;d=`M${source},${y1} H${lane} V${y2} H${x2-48}`;lx=source+3;ly=y1-8;}
  else{const lane=12+(index%3)*14;d=`M${x1-(row.from==='@new'?10:60)},${y1} H${lane} V${y2} H${x2-60}`;lx=lane+3;ly=(y1+y2)/2;}
  const path=make('path',{d,fill:'none',stroke:'currentColor','stroke-width':'1.8','marker-end':'url(#state-transition-arrow)'});if(row.to==='@unknown')path.setAttribute('stroke-dasharray','5 4');
  const description=make('title');description.textContent=rows.map(r=>`${r.id} ${r.activity}：${r.condition}`).join(' / ');path.append(description);svg.append(path);
  const caption=make('text',{x:String(lx),y:String(ly),class:'state-diagram-edge-label'});caption.textContent=rows.map(r=>r.id).join('/');svg.append(caption);index++;
 }
 for(const [state,[x,y]] of points){
  if(state==='@new')svg.append(make('circle',{cx:String(x),cy:String(y),r:'8',class:'state-diagram-start'}));
  else{const special=state.startsWith('@'),w=special?96:120;svg.append(make('rect',{x:String(x-w/2),y:String(y-22),width:String(w),height:'44',rx:special?'4':'12',class:special?'state-diagram-node undecided':'state-diagram-node'}));}
  const label=make('text',{x:String(x),y:String(state==='@new'?y+29:y+5),'text-anchor':'middle',class:'state-diagram-node-label'});label.textContent=labels[state]??state;svg.append(label);
 }
 return svg;
}
export function stateTransitionPanel(design:Design,id:string,navigate:(id:string)=>void):HTMLElement|undefined{
 const declaration=design.objectStateTransitions?.[id];if(!declaration||!design.graph.nodes.some(n=>n.id===id&&n.type==='object'))return;
 const root=document.createElement('section');root.className='state-transition-panel';root.setAttribute('aria-label','状態遷移');
 const text=(tag:string,value:string,parent:HTMLElement=root)=>{const e=document.createElement(tag);e.textContent=value;parent.append(e);return e;};
 text('h2','状態遷移図');
 if(declaration.error){text('p','状態遷移を表示できません：'+declaration.error).setAttribute('role','status');return root;}
 const model=declaration.model!;
 text('p','部分定義：未記載の操作は未決です。終端は未決です。');
 root.append(stateDiagram(model));
 text('p','破線：遷移先未決。作成不成立・未決は保存状態ではありません。');
 const label=(value:string)=>({'@new':'記録作成前','@none':'作成不成立','@unknown':'遷移先未決'}[value]??value);
 const effects:Record<string,string>={change:'状態変更',unchanged:'状態不変','no-create':'作成しない',constraint:'結果の制約・遷移先未決'};
 const details=document.createElement('details');text('summary',`操作の詳細（${model.transitions.length}）`,details);const list=document.createElement('ol');details.append(list);root.append(details);
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
