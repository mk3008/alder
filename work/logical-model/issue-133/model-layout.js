import {layoutPlan} from './shared-layout.js';
// Display ownership only. Every other FK remains a visible cross-reference.
export const primaryPairs=[
 ['request','draft'],['request','current'],['current','decision'],
 ['request','submission'],['submission','items'],['submission','target'],
 ['target','closure'],['target','receipt'],['receipt','lines'],
 ['items','cancel'],['draft','draftitems'],['prep','output']
];
export function modelLayout(entities,links,measure){
 const primary=links.filter(([a,b])=>primaryPairs.some(([x,y])=>x===a&&y===b));
 const parent=new Map(entities.map(e=>[e[0],e[0]]));
 const find=id=>{while(parent.get(id)!==id)id=parent.get(id);return id;};
 for(const [a,b,n]of primary)if(!n.includes('N'))parent.set(find(b),find(a));
 const groups=new Map();for(const e of entities){const id=find(e[0]);if(!groups.has(id))groups.set(id,[]);groups.get(id).push(e);}
 const groupEdges=primary.filter(e=>e[2].includes('N')).map(([a,b])=>({kind:'input',from:find(a),to:find(b),label:''}));
 const common=layoutPlan({version:1,nodes:[...groups.keys()].map(id=>({id,name:id,type:'object',scope:true})),relations:groupEdges});
 const ordered=[...groups.keys()].sort((a,b)=>common.positions[a][1]-common.positions[b][1]||common.positions[a][0]-common.positions[b][0]);
 const wrap=(text,width,size)=>{const out=[];let line='';for(const c of text){if(line&&measure(line+c,size)>width){out.push(line);line=c;}else line+=c;}if(line)out.push(line);return out;};
 const boxes=new Map();let y=16,maxX=0;
 for(const id of ordered){
  const members=groups.get(id),incoming=primary.find(([a,b,n])=>n.includes('N')&&find(b)===id);
  let x=incoming?boxes.get(incoming[0]).x+64:24+common.positions[id][0]-40;
  const pending=new Set(members.map(e=>e[0])),sorted=[];
  while(pending.size){const next=members.find(e=>pending.has(e[0])&&!primary.some(([a,b,n])=>b===e[0]&&!n.includes('N')&&pending.has(a)));if(!next)throw Error('cyclic display ownership');sorted.push(next);pending.delete(next[0]);}
  let rowHeight=0;
  for(const e of sorted){const [key,name,fields,activity,who]=e,w=280,lines=fields.flatMap(f=>wrap(f,w-20,13)),meta=[...wrap(activity,w-20,11),...wrap(who,w-20,11)],h=35+lines.length*19+10+meta.length*16+12;
   boxes.set(key,{x,y,w,h,lines,meta,group:id});rowHeight=Math.max(rowHeight,h);maxX=Math.max(maxX,x+w);x+=w+72;}
  for(const e of sorted)boxes.get(e[0]).rowBottom=y+rowHeight;
  y+=rowHeight+62;
 }
 const labelSlots=new Map();
 const routes=links.map(([from,to,n],i)=>{const a=boxes.get(from),b=boxes.get(to),main=primaryPairs.some(([x,y])=>x===from&&y===to);
  if(main&&a.group===b.group)return{from,to,n,main,d:'M'+(a.x+a.w)+' '+(a.y+20)+'H'+b.x,labelX:(a.x+a.w+b.x)/2,labelY:a.y+11};
  const top=Math.min(a.y,b.y),bottom=Math.max(a.rowBottom,b.rowBottom),right=Math.max(...[...boxes.values()].filter(c=>c.y>=top&&c.y<=bottom).map(c=>c.x+c.w))+28+i*10;
  const labelSlot=labelSlots.get(to)||0;labelSlots.set(to,labelSlot+1);
  return{from,to,n,main,d:'M'+(a.x+a.w/2)+' '+(a.y+a.h)+'V'+(a.rowBottom+20)+'H'+right+'V'+(b.y-18)+'H'+(b.x+b.w/2)+'V'+b.y,labelX:b.x+90+labelSlot*80,labelY:b.y-25-labelSlot*18};
 });
 return{boxes,routes,width:maxX+230,height:y,common,groups};
}
