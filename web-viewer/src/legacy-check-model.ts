import type {Check,Run} from './json-document';
import type {CheckItem} from './check-items';
type Mark={line:number;level:number;title:string};
const slug=(s:string)=>s.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,'').replace(/ /g,'-');
const labels:Record<string,string>={'種別':'classification','分類':'classification','条件':'condition','期待結果':'expectedResult','条件・期待結果':'guarantee','根拠':'evidence','導出分類':'derivation','関連業務':'related','テスト証拠':'testEvidence','確認事項':'question','選択肢と影響':'alternatives','AI確度':'confidence'};
/** Frozen MD compatibility adapter. All content feeds the shared rich Check renderer. */
export function legacyCheckModel(source:string,items:CheckItem[],index:Record<string,string[]>,marks:Mark[]):Check{
 const lines=source.replace(/\r\n?/g,'\n').split('\n'),body=(m:Mark)=>lines.slice(m.line+1,marks.find(h=>h.line>m.line&&h.level<=m.level)?.line??lines.length).join('\n').trim();
 const itemMarks=new Map(marks.filter(m=>m.level===3&&items.some(i=>i.title===m.title)).map(m=>[m.title,m]));
 const anchors=new Map<string,string>();for(const m of marks){const item=items.find(i=>i.title===m.title);anchors.set(slug(m.title),item?'legacy-check:'+item.id:m.level===1?'legacy-check-document':'legacy-heading:'+m.line);if(item)anchors.set(item.id.toLowerCase(),'legacy-check:'+item.id);}
 for(const [i,line]of lines.entries()){const a=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(line);if(a){const next=marks.find(m=>m.line>i);if(next)anchors.set(a[1].toLowerCase(),anchors.get(slug(next.title))!);}}
 const runs=(text:string):Run[]=>{const out:Run[]=[];let end=0;for(const m of text.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){if(m.index!>end)out.push({kind:'markdown',value:text.slice(end,m.index)});let fragment=m[2].slice(1);try{fragment=decodeURIComponent(fragment);}catch{}const target=m[2].startsWith('#')?anchors.get(fragment.toLowerCase()):undefined;out.push(target?{kind:'reference',targetId:target,label:m[1]}:{kind:'link',uri:m[2],label:m[1]});end=m.index!+m[0].length;}if(end<text.length)out.push({kind:'markdown',value:text.slice(end)});return out;};
 const sections:Check['sections']=[],guarantees:Check['guarantees']=[],notes:Check['notes']=[],sectionIDs=new Map<string,string>();
 for(const m of marks.filter(m=>m.level===2)){
  if(m.title==='業務一覧')continue;
  const id=anchors.get(slug(m.title))!,next=marks.find(h=>h.line>m.line)?.line??lines.length;
  sections.push({id,activityId:Object.hasOwn(index,m.title)?m.title:null,title:m.title,preamble:runs(lines.slice(m.line+1,next).join('\n').trim())});sectionIDs.set(m.title,id);
 }
 const fallback='legacy-unassigned',sectionFor=(m:Mark)=>{const parent=marks.filter(h=>h.line<m.line&&h.level===2).at(-1);return parent?sectionIDs.get(parent.title):undefined;};
 const projected=items.map(item=>{
  const m=itemMarks.get(item.title)!,sectionId=sectionFor(m)??fallback,fields:Record<string,Run[]>=Object.create(null),chunks:{name:string;value:string}[]=[];let current={name:'補足',value:''},fence='';
  for(const line of item.body.split('\n')){
   const f=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length&&!f[2].trim())fence='';}
   const field=!fence?/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(line):null;
   if(field){if(current.value.trim())chunks.push(current);current={name:field[1],value:field[2]};}else current.value+='\n'+line;
  }if(current.value.trim())chunks.push(current);
  let reviewState='';for(const c of chunks){if(c.name==='人間レビュー状態'){reviewState=c.value.split('\n')[0].trim();const rest=c.value.split('\n').slice(1).join('\n').trim();if(rest)fields['補足']=[...(fields['補足']??[]),...runs(rest)];}else{const key=labels[c.name]??c.name;fields[key]=[...(fields[key]??[]),...runs(c.value.trim())];}}
  return {id:'legacy-check:'+item.id,checkId:item.id,title:item.title.replace(/^[^\s]+\s+[—–-]\s+/,''),reviewState,sectionId,detailSummary:'',fields};
 });
 if(projected.some(i=>i.sectionId===fallback))sections.push({id:fallback,activityId:null,title:'未割当',preamble:[]});
 for(const m of marks.filter(m=>m.level===3&&!itemMarks.has(m.title))){const sectionId=sectionFor(m);if(sectionId)guarantees.push({id:anchors.get(slug(m.title))!,sectionId,title:m.title,blocks:[{kind:'prose',content:runs(body(m))}]});else notes.push({id:anchors.get(slug(m.title))!,title:m.title,content:runs(body(m))});}
 const first=marks.find(m=>m.level===2)?.line??lines.length;
 return {id:'legacy-check-document',kind:'checkItems',revision:'unversioned',title:marks.find(m=>m.level===1)?.title??'Check Item',basedOn:{documentId:'legacy-business-design',revision:'unversioned',verification:'unverified'},intro:runs(lines.slice(/^# /.test(lines[0])?1:0,first).join('\n')),sections,items:projected,
  index:Object.entries(index).map(([activityId,ids])=>{const row=lines.find(l=>l.startsWith('|')&&l.includes('['+activityId+']'))?.split('|').slice(1,-1)??[];return {activityId,purpose:row[1]?.trim()??'',connections:row[2]?.trim()??'',checkIds:ids.map(id=>'legacy-check:'+id)};}),guarantees,examples:[],notes};
}
