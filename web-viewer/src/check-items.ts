import type {Tab} from './session';
export type CheckItem={id:string;title:string;body:string;activities:string[]};
export type CheckDocument={markdown:string;intro:string;items:CheckItem[];index:Record<string,string[]>};
export type RelatedChecks={markdown:string;name:string;url?:string;confirmedFor?:string};
/** Identity and revision are separate: a pinned historical link is not a different document. */
export function githubDocument(value:string){
  try{
    const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)return;
    let parts=u.pathname.split('/').filter(Boolean).map(decodeURIComponent);
    if(u.hostname==='github.com'){if(parts[2]!=='blob')return;parts.splice(2,1);}
    else if(u.hostname!=='raw.githubusercontent.com')return;
    const [owner,repo,...tail]=parts;if(!owner||!repo)return;
    if(tail[0]==='refs'&&['heads','tags'].includes(tail[1]))tail.splice(0,2);
    const [ref,...path]=tail;if(!ref||!path.length)return;
    if(!['main','master'].includes(ref)&&!(/^[a-f0-9]{40}$/i.test(ref)))return;
    return {document:`${owner.toLowerCase()}/${repo.toLowerCase()}/${path.join('/')}`,ref};
  }catch{return;}
}
function links(text:string){return [...text.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(m=>({label:m[0].slice(1,m[0].indexOf(']')),url:m[1]}));}
export function parseChecks(markdown:string):CheckDocument{
  if(new TextEncoder().encode(markdown).byteLength>2*1024*1024)throw Error('Check本文は2MiB以内にしてください。');
  const visibleLines=new Set<number>();
  const lines=markdown.replace(/\r\n?/g,'\n').split('\n'),marks:{line:number;level:number;title:string}[]=[];let fence='';
  lines.forEach((line,i)=>{const f=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);if(f){if(!fence)fence=f[1];else if(f[1][0]===fence[0]&&f[1].length>=fence.length&&!f[2].trim())fence='';return;}if(!fence){visibleLines.add(i);const h=/^(#{1,6}) (.+)$/.exec(line);if(h)marks.push({line:i,level:h[1].length,title:h[2]});}});
  if(fence)throw Error('Check Markdownのコードブロックが閉じていません。');
  const starts=marks.filter(m=>m.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(m.title));
  if(!starts.length)throw Error('Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。');
  const seen=new Set<string>(),items=starts.map(m=>{
    const end=marks.find(h=>h.line>m.line&&h.level<=3)?.line??lines.length,id=m.title.split(/\s/)[0];
    if(seen.has(id))throw Error('Check IDが重複しています: '+id);seen.add(id);
    const body=lines.slice(m.line+1,end).join('\n').replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,'').trim();
    for(const field of ['条件','期待結果','人間レビュー状態'])if(!new RegExp('^[-*] '+field+'[：:]\\s*\\S','m').test(body))throw Error(id+' の'+field+'が見つかりません。');
    return {id,title:m.title,body,activities:[] as string[]};
  });
  const index:Record<string,string[]>=Object.create(null);
  // Only the explicit business index creates associations. Mentions in prose never do.
  let inIndex=false;
  for(const [lineNumber,line] of lines.entries()){if(!visibleLines.has(lineNumber))continue;if(/^## /.test(line))inIndex=/^## 業務一覧\s*$/.test(line);if(!inIndex||!/^\|/.test(line))continue;
    const cells=line.split('|').slice(1,-1);if(cells.length!==4)continue;const activity=links(cells[0])[0]?.label;if(!activity)continue;
    if(Object.hasOwn(index,activity))throw Error('業務一覧のActivityが重複しています: '+activity);
    const entries=links(cells[3]);if(entries.some(l=>l.url.toLowerCase()!=='#'+l.label.toLowerCase()))throw Error('Check IDのリンク先が一致しません: '+activity);
    const ids=entries.map(l=>l.label);if(!ids.length||ids.some(id=>!seen.has(id)))throw Error('業務一覧のCheck ID参照を確認できません: '+activity);
    index[activity]=[...new Set(ids)];for(const item of items)if(ids.includes(item.id))item.activities.push(activity);
  }
  if(!Object.keys(index).length)throw Error('業務一覧のActivityとCheck IDの対応を確認できません。');
  const firstH2=marks.find(m=>m.level===2)?.line??starts[0].line;
  return {markdown,intro:lines.slice(0,firstH2).join('\n'),items,index};
}
export function confirmationKey(tab:Tab){return JSON.stringify([tab.design.markdown,tab.source?.kind==='url'?tab.source.url:null,tab.edited===true]);}
export function checkCompatibility(doc:CheckDocument,tab:Tab):{state:'matched'|'unverified'|'mismatch';reason:string;unknown:string[]}{
  const names=new Set(tab.design.graph.nodes.filter(n=>n.type==='business').map(n=>n.name));
  const unknown=Object.keys(doc.index).filter(name=>!names.has(name));
  const overlap=Object.keys(doc.index).filter(name=>names.has(name));
  const result=(state:'matched'|'unverified'|'mismatch',reason:string)=>({state,reason,unknown});
  if(!overlap.length)return result('mismatch','業務一覧に、この業務設計書のActivityがありません。');
  const sourceLines=doc.intro.split('\n').filter(line=>/原典|^[-*] Source[：:]|Business Design/i.test(line)).join('\n');
  const references=links(sourceLines).map(l=>githubDocument(l.url)).filter(v=>v!==undefined);
  const current=tab.source?.kind==='url'?githubDocument(tab.source.url):tab.source?.kind==='sample'?githubDocument('https://github.com/mk3008/alder/blob/main/business-design/alder/README.md'):undefined;
  if(current&&references.length&&references.some(r=>r.document!==current.document))return result('mismatch','Checkの原典参照が、開いている業務設計書と異なります。');
  if(unknown.length)return result('unverified','業務一覧に対応先不明のActivityがあります: '+unknown.join('、'));
  if(!current||!references.length)return result('unverified','文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。');
  if(tab.edited||references.some(r=>r.ref!==current.ref)||!/^[a-f0-9]{40}$/i.test(current.ref))return result('unverified','原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。');
  return result('matched','原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。');
}
