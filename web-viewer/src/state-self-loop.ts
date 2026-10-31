import {routeCollisionCount,type EdgeRoute,type RouteNode} from './routing.ts';
import type {Point} from './session';

export type StateSelfLoop={index:number;count:number;rise:number;labelLeft:number};

function intersectsWire(a:Point,b:Point,c:Point,d:Point):boolean{
 const cross=(p:Point,q:Point,r:Point)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
 const p=cross(a,b,c),q=cross(a,b,d),r=cross(c,d,a),s=cross(c,d,b),epsilon=1e-6;
 if(p*q< -epsilon&&r*s< -epsilon)return true;
 if(Math.max(Math.abs(p),Math.abs(q),Math.abs(r),Math.abs(s))>epsilon)return false;
 const axis=Math.abs(b[0]-a[0])>=Math.abs(b[1]-a[1])?0:1;
 return Math.min(Math.max(a[axis],b[axis]),Math.max(c[axis],d[axis]))-Math.max(Math.min(a[axis],b[axis]),Math.min(c[axis],d[axis]))>.1;
}

/** State-only shape; shared routing and label-placement contracts stay intact. */
export function stateSelfLoopRoute(source:RouteNode,nodes:readonly RouteNode[],loop:StateSelfLoop,labelWidth:number,wires:readonly (readonly Point[])[]=[]):EdgeRoute{
 const right=source.x+source.width,step=24;
 const a:Point=[right-8-(loop.count-1-loop.index)*step,source.y],b:Point=[right-8-(loop.count+loop.index)*step,source.y];
 const obstacles=nodes.filter(n=>n.id!==source.id);
 let best:{path:string;points:Point[];collisions:number;wireCollisions:number;top:number;extra:number}|undefined;
 for(const extra of [0,16,32,64,128,256]){
  const top=source.y-loop.rise-extra,radius=Math.min(12,(a[0]-b[0])/2,(source.y-top)/2);
  const points:Point[]=[a];let path=`M${a}`;
  const line=(p:Point)=>{path+=` L${p}`;points.push(p);};
  const corner=(control:Point,end:Point)=>{const start=points.at(-1)!;path+=` Q${control} ${end}`;for(let i=1;i<=4;i++){const t=i/4,s=1-t;points.push([s*s*start[0]+2*s*t*control[0]+t*t*end[0],s*s*start[1]+2*s*t*control[1]+t*t*end[1]]);}};
  line([a[0],top+radius]);corner([a[0],top],[a[0]-radius,top]);
  line([b[0]+radius,top]);corner([b[0],top],[b[0],top+radius]);line(b);
  const collisions=routeCollisionCount(points,obstacles,.3);
  const wireCollisions=wires.filter(w=>points.slice(1).some((p,i)=>w.slice(1).some((v,j)=>intersectsWire(points[i],p,w[j],v)))).length;
  if(!best||collisions<best.collisions||(collisions===best.collisions&&wireCollisions<best.wireCollisions))best={path,points,collisions,wireCollisions,top,extra};
  if(collisions===0&&wireCollisions===0)break;
 }
 const {path,points,collisions,wireCollisions,top,extra}=best!;
 return {path,points,label:[Math.max(right+8,loop.labelLeft)+labelWidth/2,top],bounds:{right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))},collisions:collisions+wireCollisions,rerouted:extra>0,fallback:collisions+wireCollisions>0};
}
