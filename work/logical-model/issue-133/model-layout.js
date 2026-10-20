import {layoutPlan} from './shared-layout.js';
// Display ownership only. Every other FK remains a visible cross-reference.
export const primaryPairs=[
 ['request','draft'],['request','current'],['current','decision'],
 ['request','submission'],['submission','items'],['submission','target'],
 ['target','closure'],['target','receipt'],['receipt','lines'],
 ['items','cancel'],['draft','draftitems'],['prep','output']
];
export function modelLayout(entities,links,measure,manualPositions=new Map()){
 const primary=links.filter(([a,b])=>primaryPairs.some(([x,y])=>x===a&&y===b));
 const parent=new Map(entities.map(e=>[e[0],e[0]]));
 const find=id=>{while(parent.get(id)!==id)id=parent.get(id);return id;};
 for(const [a,b,n]of primary)if(!n.includes('N'))parent.set(find(b),find(a));
 const groups=new Map();for(const e of entities){const id=find(e[0]);if(!groups.has(id))groups.set(id,[]);groups.get(id).push(e);}
 const groupEdges=primary.filter(e=>e[2].includes('N')).map(([a,b])=>({kind:'input',from:find(a),to:find(b),label:''}));
 const common=layoutPlan({version:1,nodes:[...groups.keys()].map(id=>({id,name:id,type:'object',scope:true})),relations:groupEdges});
 const ordered=[...groups.keys()].sort((a,b)=>common.positions[a][1]-common.positions[b][1]||common.positions[a][0]-common.positions[b][0]);
 const boxes=new Map();let y=40,maxX=0,nextX=24;
 for(const id of ordered){
  const members=groups.get(id),incoming=primary.find(([a,b,n])=>n.includes('N')&&find(b)===id);
  let x=Math.max(nextX,incoming?boxes.get(incoming[0]).x+64:24+common.positions[id][0]-40);
  const pending=new Set(members.map(e=>e[0])),sorted=[];
  while(pending.size){const next=members.find(e=>pending.has(e[0])&&!primary.some(([a,b,n])=>b===e[0]&&!n.includes('N')&&pending.has(a)));if(!next)throw Error('cyclic display ownership');sorted.push(next);pending.delete(next[0]);}
  let rowHeight=0;
  for(const e of sorted){const [key,name,fields,activity,who]=e,w=Math.ceil(Math.max(160,measure(name,14)+20,...fields.map(f=>measure(f,13)+20),measure(activity,11)+20,measure(who,11)+20)),lines=[...fields],meta=[activity,who],h=35+lines.length*19+10+meta.length*16+12;
   boxes.set(key,{x,y,w,h,lines,meta,group:id});rowHeight=Math.max(rowHeight,h);maxX=Math.max(maxX,x+w);x+=w+72;}
  for(const e of sorted)boxes.get(e[0]).rowBottom=y+rowHeight;
  nextX=x;
  y+=rowHeight+70;
 }
 for(const [id,position] of manualPositions){const box=boxes.get(id);if(!box)continue;box.x=Math.max(24,position.x);box.y=Math.max(40,position.y);box.rowBottom=box.y+box.h;maxX=Math.max(maxX,box.x+box.w);y=Math.max(y,box.y+box.h+70);}
 const labelSlots=new Map();
 const routes=links.map(([from,to,n],i)=>{const a=boxes.get(from),b=boxes.get(to),main=primaryPairs.some(([x,y])=>x===from&&y===to);
  if(manualPositions.has(from)||manualPositions.has(to)){
   let sx,sy,tx,ty,d;
   if(b.x>=a.x+a.w+30){sx=a.x+a.w;sy=a.y+a.h/2;tx=b.x;ty=b.y+b.h/2;const mid=(sx+tx)/2;d='M'+sx+' '+sy+'H'+mid+'V'+ty+'H'+tx;}
   else if(a.x>=b.x+b.w+30){sx=a.x;sy=a.y+a.h/2;tx=b.x+b.w;ty=b.y+b.h/2;const mid=(sx+tx)/2;d='M'+sx+' '+sy+'H'+mid+'V'+ty+'H'+tx;}
   else if(b.y>=a.y+a.h+30){sx=a.x+a.w/2;sy=a.y+a.h;tx=b.x+b.w/2;ty=b.y;const mid=(sy+ty)/2;d='M'+sx+' '+sy+'V'+mid+'H'+tx+'V'+ty;}
   else {sx=a.x+a.w/2;sy=a.y;tx=b.x+b.w/2;ty=b.y+b.h;const mid=(sy+ty)/2;d='M'+sx+' '+sy+'V'+mid+'H'+tx+'V'+ty;}
   return{from,to,n,main,d,labelX:(sx+tx)/2,labelY:(sy+ty)/2-7};
  }
  if(main&&a.group===b.group){const skipped=[...boxes.values()].some(c=>c!==a&&c!==b&&c.group===a.group&&c.x>a.x&&c.x<b.x);return{from,to,n,main,d:skipped?'M'+(a.x+a.w)+' '+(a.y+20)+'H'+(a.x+a.w+18)+'V'+(a.y-20)+'H'+(b.x-18)+'V'+(b.y+20)+'H'+b.x:'M'+(a.x+a.w)+' '+(a.y+20)+'H'+b.x,labelX:(a.x+a.w+b.x)/2,labelY:skipped?a.y-25:a.y+11};}
  if(main)return{from,to,n,main,d:'M'+(a.x+14)+' '+(a.y+a.h)+'V'+(a.rowBottom+22)+'H'+(b.x+14)+'V'+b.y,labelX:b.x+50,labelY:b.y-25};
  const top=Math.min(a.y,b.y),bottom=Math.max(a.rowBottom,b.rowBottom),right=Math.max(...[...boxes.values()].filter(c=>c.y>=top&&c.y<=bottom).map(c=>c.x+c.w))+28+i*10;
  const labelSlot=labelSlots.get(to)||0;labelSlots.set(to,labelSlot+1);
  return{from,to,n,main,d:'M'+(a.x+a.w/2)+' '+(a.y+a.h)+'V'+(a.rowBottom+20)+'H'+right+'V'+(b.y-18)+'H'+(b.x+b.w/2)+'V'+b.y,labelX:b.x+90+labelSlot*80,labelY:b.y-25-labelSlot*18};
 });
 return{boxes,routes,width:maxX+230,height:y,common,groups};
}
