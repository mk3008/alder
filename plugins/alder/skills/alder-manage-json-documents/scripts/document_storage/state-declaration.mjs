// Grammar copied from PR #265, fixed 7bb51e91; explicit declarations only.
import {parseStrict} from './core.mjs';
const fields=['id','from','activity','condition','to','effect','path','evidence','note'];
const check=(ok,message)=>{if(!ok)throw Error(message);};
const isText=(v)=>typeof v==='string'&&!!v.trim();
/** Experimental table declaration only. No prose extraction or condition evaluation. */
export function parseStateDeclaration(body,object){
 try{
  const match=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(body.trim());
  check(match,'state-meta と遷移表が必要です');const meta=parseStrict(match[1]);
  check(meta&&typeof meta==='object'&&!Array.isArray(meta),'メタ情報が不正です');
  check(Object.keys(meta).sort().join('|')===['object','states','start','terminal','completeness','source'].sort().join('|'),'メタ情報の項目が不正です');
  check(meta.object===object,'対象Objectが一致しません');
  check(Array.isArray(meta.states)&&meta.states.length>0&&meta.states.every((s)=>isText(s)&&!s.startsWith('@'))&&new Set(meta.states).size===meta.states.length,'状態一覧が不正です');
  check(meta.start==='@new'&&meta.terminal==='@unknown'&&meta.completeness==='partial'&&isText(meta.source),'開始・終端・部分定義の宣言が不正です');
  const ls=match[2].trim().split(/\r?\n/),cells=(line)=>{check(line.startsWith('|')&&line.endsWith('|'),'表の行が不正です');return line.slice(1,-1).split('|').map(v=>v.trim());};
  const columns=cells(ls[0]);check([fields,['id','from','activity','event','condition','to','effect','path','evidence','note'],['id','from','activity','exception','condition','to','effect','path','evidence','note']].some(keys=>columns.join('|')===keys.join('|')),'表の列名が不正です');
  check(cells(ls[1]).length===columns.length&&cells(ls[1]).every(s=>/^-+$/.test(s)),'表の区切りが不正です');
  check(ls.length<=1002,'遷移は1000行以内にしてください');
  const ids=new Set();
  const transitions=ls.slice(2).map(line=>{
   const values=cells(line);check(values.length===columns.length&&values.every(isText),'表の列数・空欄が不正です');
   const r=Object.fromEntries(columns.map((key,i)=>[key,values[i]]));
   check(/^T[0-9]+$/.test(r.id)&&!ids.has(r.id),'遷移IDが不正または重複しています');ids.add(r.id);
   check([...meta.states,'@new'].includes(r.from)&&[...meta.states,'@unknown','@none'].includes(r.to),'未登録の状態が参照されています');
   check(['change','unchanged','no-create','constraint'].includes(r.effect)&&['normal','exception'].includes(r.path),'効果・経路の指定が不正です');
   if(columns.includes('exception'))check(r.path==='normal'?r.exception==='-':isText(r.exception)&&r.exception!=='-','通常は例外名なし、例外は名前が必要です');
   check(r.effect!=='unchanged'||r.from===r.to,'状態不変の元と先が一致しません');
   check(r.effect!=='change'||(!r.to.startsWith('@')&&r.from!==r.to),'状態変更の遷移先が不正です');
   check(r.effect!=='no-create'||(r.from==='@new'&&r.to==='@none'),'不成立の元と先が不正です');
   check(r.effect!=='constraint'||r.to==='@unknown','未決の制約は遷移先未決としてください');return r;
  });return {model:{...meta,transitions}};
 }catch(error){return {error:error instanceof Error?error.message:'状態遷移の宣言が不正です'};}
}

/** Extract only an Object's explicit State Transitions section; never parse prose. */
export function extractStateDeclarations(source){
 const declarations=[];let object=null;const lines=source.split(/\r?\n/),kept=[];let fence='';
 for(let i=0;i<lines.length;i++){
  const line=lines[i];if(!fence&&/^# Object /.test(line))object=line.slice(9);else if(!fence&&/^# /.test(line))object=null;
  if(!fence&&line==='## State Transitions'){
   if(!object)throw Error('State Transitions must belong to an Object');const body=[];let inner='';
   for(i++;i<lines.length;i++){const l=lines[i],f=/^```/.test(l);if(!inner&&/^#{1,2} /.test(l)){i--;break;}body.push(l);if(f)inner=inner?'':'```';}
   const result=parseStateDeclaration(body.join('\n'),object);if(result.error)throw Error(result.error);declarations.push(result.model);continue;
  }
  kept.push(line);if(/^```/.test(line))fence=fence?'':'```';
 }
 if(new Set(declarations.map(d=>d.object)).size!==declarations.length)throw Error('Duplicate Object state declaration');
 return {markdown:kept.join('\n'),declarations};
}
