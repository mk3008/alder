// Documentation-only checks and SVG generation. No application or DB writes.
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {routeER,sharedRun} from '../../logical-model/issue-133/er-routing.js';
const root=fileURLToPath(new URL('.',import.meta.url));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const diagrams=[
 {id:'application',title:'申請・版・品目',boxes:[
 ['request','購入申請',24,28,['継続する要求','現在の対象版・判断']],
 ['version','購入申請版',104,28+104+36,['版の識別・未確定／確定','購入理由・見積根拠','提出日時（確定時）']],
 ['item','申請品目',184,28+104+36+130+36,['版内の品目の識別','品名・希望単価・依頼数量','購入しない数量（準備後）']]],
 edges:[['request','version','1','1..N','down'],['version','item','1','1..N','down']]},
 {id:'preparation',title:'準備番号でまとめる申請',boxes:[
 ['preparation','購入準備',24,28,['準備番号・固定された対象群','書き出し日時の情報']],
 ['request','購入申請',104,168,['準備所属（準備前はなし）','準備対象の確定版']]],
 edges:[['preparation','request','0..1','1..N','down']]},
 {id:'receipt',title:'各回の入庫と品目別の内訳',boxes:[
 ['request','購入申請',24,28,['準備済みの要求','終結結果（全品目待ち0）']],
 ['receipt','入庫回',104,168,['各回の識別','対象申請']],
 ['line','入庫内訳',184,308,['回内の識別・元の品目','今回入庫数量']],
 ['item','申請品目',540,308,['準備対象版の元品目','依頼数量・購入しない数量']]],
 edges:[['request','receipt','1','0..N','down'],['receipt','line','1','1..N','down'],['item','line','1','0..N','reference']]}
];
mkdirSync(root+'diagrams',{recursive:true});
const report=[];
for(const d of diagrams){
 const boxes=new Map(d.boxes.map(([id,name,x,y,fields])=>[id,{id,name,x,y,w:260,h:52+fields.length*26,fields}]));
 // Use measured concept heights, not a fixed pitch; each lower box has 36px gap.
 for(const [a,b,,,kind] of d.edges)if(kind==='down'){const p=boxes.get(a),c=boxes.get(b);c.y=p.y+p.h+36;}
 const result=routeER(boxes,d.edges);
 assert(result.routes.every(r=>!r.unrouted),d.id+' has unresolved edge');
 for(let i=0;i<result.routes.length;i++)for(let j=i+1;j<result.routes.length;j++)for(const a of result.routes[i].segments)for(const b of result.routes[j].segments)assert(!sharedRun(a.a,a.b,b.a,b.b),d.id+' shared line');
 for(let i=0;i<result.labels.length;i++)for(let j=i+1;j<result.labels.length;j++){let a=result.labels[i],b=result.labels[j];assert(!(a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top),d.id+' count overlap');}
 const width=Math.max(result.width,...[...boxes.values()].map(b=>b.x+b.w+24)),height=Math.max(result.height,...[...boxes.values()].map(b=>b.y+b.h+24));
 const svg=[`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(d.title)}</title><rect width="100%" height="100%" fill="#fff"/><g font-family="sans-serif" fill="#263b39">`];
 for(const r of result.routes)svg.push(`<path d="${r.d}" fill="none" stroke="#fff" stroke-width="6"/><path d="${r.d}" fill="none" stroke="#617b78" stroke-width="1.5"/>`);
 for(const b of boxes.values()){
 svg.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="5" fill="#fff" stroke="#649186"/><path d="M${b.x+1} ${b.y+1}h${b.w-2}v35h-${b.w-2}Z" fill="#e1efe9"/><text x="${b.x+12}" y="${b.y+25}" font-size="17" font-weight="bold">${esc(b.name)}</text>`);
 b.fields.forEach((f,i)=>svg.push(`<text x="${b.x+12}" y="${b.y+59+i*26}" font-size="15">${esc(f)}</text>`));}
 for(const l of result.labels)svg.push(`<rect x="${l.left}" y="${l.top}" width="${l.w}" height="${l.h}" fill="#fff"/><text x="${l.x}" y="${l.y}" text-anchor="${l.anchor}" font-size="14">${esc(l.count)}</text>`);
 svg.push('</g></svg>');writeFileSync(root+'diagrams/'+d.id+'.svg',svg.join('\n'));
 report.push({diagram:d.id,concepts:boxes.size,relations:d.edges.length,endpointCounts:result.labels.length,unrouted:0,sharedRuns:0,countOverlaps:0});
}
// Model arithmetic examples: fixtures are integers; the business precision is undecided.
const resultFor=(qs,rs,cs)=>{assert.equal(qs.length,rs.length);assert.equal(qs.length,cs.length);assert(qs.length);const ws=qs.map((q,i)=>q-rs[i]-cs[i]);if(rs.some(x=>x<0)||cs.some(x=>x<0)||ws.some(x=>x<0))return 'invalid';if(ws.some(x=>x>0))return 'working';return rs.every(x=>x===0)?'no-purchase':cs.every(x=>x===0)?'all-received':'mixed';};
const cases=[
 [[10],[5],[0],'working'],[[10],[8],[0],'working'],[[10],[5],[5],'mixed'],[[10],[0],[10],'no-purchase'],[[10],[10],[0],'all-received'],[[10],[8],[3],'invalid'],[[10,10],[12,8],[0,0],'invalid'],[[3,2],[3,0],[0,2],'mixed'],[[3,2],[3,1],[0,0],'working']
];for(const [q,r,c,want]of cases)assert.equal(resultFor(q,r,c),want);
let partitions=0;for(let q=1;q<=12;q++)for(let r=0;r<=q;r++)for(let c=0;c<=q-r;c++){const w=q-r-c;const result=resultFor([q],[r],[c]);assert.equal(result==='working',w>0);assert.notEqual(result,'invalid');partitions++;}
const allDocs=['README.md','model.ja.md','activities.ja.md','review.ja.md','comparison-and-learning.ja.md'];
for(const name of allDocs){const s=readFileSync(root+name,'utf8');assert(!s.includes('undefined'));for(const m of s.matchAll(/\]\(([^)]+)\)/g)){if(!/^(https?:|#)/.test(m[1]))readFileSync(root+m[1].split('#')[0]);}}
const evidence={diagrams:report,quantityExamples:cases.length,legalIntegerPartitions:partitions,scope:'Documentation model arithmetic and SVG/link checks only; no runtime, DDL, concurrency or idempotency implementation verified.'};
writeFileSync(root+'validation.json',JSON.stringify(evidence,null,2)+'\n');console.log(JSON.stringify(evidence,null,2));
