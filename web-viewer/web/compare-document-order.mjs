// Deterministic geometry comparison, not browser screenshots or measured glyphs.
import {readFileSync,writeFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {routeEdge as newRoute} from '../src/routing.ts';
const design=parseDesign(readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8')),graph=design.graph;
const nodes=graph.nodes,edges=graph.relations,index=new Map(nodes.map((n,i)=>[n.id,i]));
const links=edges.map(e=>[index.get(e.from),index.get(e.to)]);
const unique=[...new Map(links.map(([a,b])=>[a<b?a+','+b:b+','+a,[a,b]])).values()];
const oldPlacement=initialPositions(graph),placement=initialPositions(graph,design.activityOrder),candidate=nodes.map(n=>placement[n.id]);
const previous=nodes.map(n=>oldPlacement[n.id]);
const crossing=(a,b,c,d)=>{const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);return o(a,b,c)*o(a,b,d)<-1e-6&&o(c,d,a)*o(c,d,b)<-1e-6;};
const boxesOverlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
export function metric(p,route){const ns=nodes.map((n,i)=>({id:n.id,x:p[i][0],y:p[i][1],width:260,height:68}));const rs=edges.map((e,i)=>route({...e,nodes:ns,index:i,labelWidth:Math.max(30,e.label.length*12),labelHeight:18}));let crosses=0,pairs=0;rs.forEach((r,i)=>rs.slice(i+1).forEach((s,j0)=>{const j=j0+i+1;if(links[i].some(v=>links[j].includes(v)))return;let c=0;for(let a=1;a<r.points.length;a++)for(let b=1;b<s.points.length;b++)c+=crossing(r.points[a-1],r.points[a],s.points[b-1],s.points[b]);crosses+=c;pairs+=c>0;}));const lbs=rs.map((r,i)=>({x:r.label[0]-Math.max(30,edges[i].label.length*12)/2,y:r.label[1]-9,width:Math.max(30,edges[i].label.length*12),height:18}));return {nodeOverlaps:ns.reduce((s,a,i)=>s+ns.slice(i+1).filter(b=>boxesOverlap(a,b)).length,0),edgeCrossings:crosses,edgeCrossingPairs:pairs,edgeNodeCollisions:rs.reduce((s,r)=>s+r.collisions,0),routedLength:Math.round(rs.reduce((s,r)=>s+r.points.slice(1).reduce((q,v,i)=>q+Math.hypot(v[0]-r.points[i][0],v[1]-r.points[i][1]),0),0)),reroutedEdges:rs.filter(r=>r.rerouted).length,fallbacks:rs.filter(r=>r.fallback).length,labelNodeOverlaps:lbs.reduce((s,a)=>s+ns.filter(b=>boxesOverlap(a,b)).length,0),labelLabelOverlaps:lbs.reduce((s,a,i)=>s+lbs.slice(i+1).filter(b=>boxesOverlap(a,b)).length,0),centerDistance:Math.round(unique.reduce((s,[a,b])=>s+Math.hypot(p[a][0]-p[b][0],p[a][1]-p[b][1]),0))};}
const inversions=p=>design.activityOrder.reduce((sum,id,i)=>sum+design.activityOrder.slice(i+1).filter(other=>p[index.get(other)][1]<p[index.get(id)][1]).length,0);
const variants={};for(const [name,p] of [['previous',previous],['documentOrder',candidate]])variants[name]={...metric(p,newRoute),activityVerticalInversions:inversions(p),activities:design.activityOrder.map(id=>({id,position:p[index.get(id)]}))};console.log(JSON.stringify(variants,null,2));
writeFileSync(new URL('./evidence/document-order-20261012/comparison.json',import.meta.url),JSON.stringify(variants,null,2)+'\n');
writeFileSync(new URL('./evidence/document-order-20261012/sample-layout.json',import.meta.url),JSON.stringify(placement,null,2)+'\n');
