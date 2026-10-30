import {exceptionSegments} from './exception-paint.ts';
import {createElement,icons,Box,UserRound} from 'lucide';
import type {GraphNode} from './graph';
/** Same Lucide image resolver for graph cards and Object drawer headings. */
export function graphNodeIcon(node:GraphNode){
 const key=String(node.icon??'file-question').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('') as keyof typeof icons;
 return createElement(node.type==='business'?UserRound:icons[key]??Box,{'stroke-width':1.8,'aria-hidden':'true'});
}
/** Shared arrow dimensions and normal/selected paint classes in both graphs. */
export function graphMarkers(prefix=''){
 const ns='http://www.w3.org/2000/svg',defs=document.createElementNS(ns,'defs');
 for(const selected of [false,true]){
  const marker=document.createElementNS(ns,'marker');
  for(const [k,v]of Object.entries({id:prefix+(selected?'related-arrow':'arrow'),viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'7',markerHeight:'7',orient:'auto'}))marker.setAttribute(k,v);
  const arrow=document.createElementNS(ns,'path');arrow.setAttribute('d','M0 0L10 5L0 10Z');arrow.classList.add('arrow');if(selected)arrow.classList.add('review-related-arrow');marker.append(arrow);defs.append(marker);
 }
 return defs;
}

/** Coordinate-phased exception paint shared by business and state diagrams. */
export function paintGraphException(root:Element,path:SVGElement,route:{path:string},attrs:Record<string,string>={}){
 path.style.strokeOpacity='0';
 for(const segment of exceptionSegments(route.path)){
  const paint=root.ownerDocument.createElementNS('http://www.w3.org/2000/svg','path');paint.setAttribute('d',segment.path);paint.setAttribute('data-exception-paint','');
  for(const[k,v]of Object.entries(attrs))paint.setAttribute(k,v);
  paint.setAttribute('class','edge-paint'+(path.classList.contains('review-related')?' review-related':'')+(path.classList.contains('muted')?' muted':''));
  paint.setAttribute('stroke-dasharray',segment.offset===undefined?'none':'6 5');if(segment.offset!==undefined)paint.setAttribute('stroke-dashoffset',String(segment.offset));root.append(paint);
 }
}
