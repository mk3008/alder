import {createElement,Settings,LockKeyhole,LockKeyholeOpen,Minus,Plus} from 'lucide';
import {installTouchGestures} from './touch-gestures';
import {createNodeDrag} from './node-drag';
import {cameraZoom,initialCamera,ZOOM_FACTOR,type GraphCamera} from './graph-camera';
import type {Point} from './session';
const ns='http://www.w3.org/2000/svg';
/** HTML borders and shadows are painted identically to business cards. */
export function cardSurface(doc:Document,b:{x:number;y:number;w?:number;h?:number;width?:number;height?:number},note=false){
 const w=b.w??b.width!,h=b.h??b.height!,fo=doc.createElementNS(ns,'foreignObject');
 for(const[k,v]of Object.entries({class:'concept-selection-glow',x:b.x-32,y:b.y-32,width:w+64,height:h+64,'aria-hidden':'true','pointer-events':'none'}))fo.setAttribute(k,String(v));
 const surface=doc.createElement('div');surface.className='graph-card-surface';surface.style.width=w+'px';surface.style.height=h+'px';
 if(note){surface.style.borderRadius='20px';surface.style.setProperty('--graph-object-fill','var(--graph-note-fill,#e9edf2)');surface.style.setProperty('--graph-object-border','var(--graph-note-border,#a6b2c1)');}
 fo.append(surface);return fo;
}
export type DiagramView=GraphCamera&{positions:Map<string,Point>;selected?:string;locked:boolean};
export function newDiagramView():DiagramView{return {...initialCamera(),positions:new Map(),locked:true};}
/** Host adapter for SVG content; camera/gestures and toolbar follow business policy. */
export function diagramCanvas(doc:Document,render:(view:DiagramView)=>SVGSVGElement,view:DiagramView){
 const root=doc.createElement('div');root.className='diagram-canvas';
 root.innerHTML='<div class="canvas-controls" data-settings-open="false"><button class="graph-settings-toggle" aria-label="表示設定を開く" aria-expanded="false"></button><div class="concept-display-options" hidden><button class="reset-layout">レイアウトを初期値に戻す</button></div><button class="canvas-lock" aria-label="配置ロック"></button><button class="zoom-out" aria-label="縮小"></button><span class="canvas-zoom"></span><button class="zoom-in" aria-label="拡大"></button></div><div class="diagram-viewport" tabindex="0"><div class="diagram-world"></div></div>';
 const host=root.querySelector<HTMLElement>('.diagram-viewport')!,world=root.querySelector<HTMLElement>('.diagram-world')!,bar=root.querySelector<HTMLElement>('.canvas-controls')!;
 const button=(s:string)=>bar.querySelector<HTMLButtonElement>(s)!,gear=button('.graph-settings-toggle'),panel=bar.querySelector<HTMLElement>('.concept-display-options')!,lock=button('.canvas-lock');
 for(const[s,i,c]of [['.graph-settings-toggle',Settings,''],['.canvas-lock',LockKeyhole,'lock-closed'],['.canvas-lock',LockKeyholeOpen,'lock-open'],['.zoom-out',Minus,''],['.zoom-in',Plus,'']] as const){const icon=createElement(i,{'stroke-width':1.8,'aria-hidden':'true'});if(c)icon.classList.add(c);button(s).append(doc.importNode(icon,true));}
 let svg:SVGSVGElement,width=0,height=0;
 const layout=()=>{svg.style.width=width+'px';svg.style.height=height+'px';svg.style.minWidth='0';svg.style.transform=`scale(${view.zoom})`;svg.style.transformOrigin='0 0';world.style.width=Math.ceil(Math.max(1400,width+80,host.clientWidth/view.zoom)*view.zoom)+'px';world.style.height=Math.ceil(Math.max(850,height+120,host.clientHeight/view.zoom)*view.zoom)+'px';bar.querySelector('.canvas-zoom')!.textContent=Math.round(view.zoom*100)+'%';lock.setAttribute('aria-pressed',String(view.locked));};
 const draw=()=>{svg=render(view);world.replaceChildren(svg);const box=svg.getAttribute('viewBox')!.split(/\s+/).map(Number);width=box[2];height=box[3];layout();};
 const select=(id:string)=>{const el=svg.querySelector<SVGGElement>(`[data-node="${CSS.escape(id)}"]`);el?.dispatchEvent(new (doc.defaultView!.MouseEvent)('click',{bubbles:true}));};
 const nodePosition=(id:string):Point|undefined=>{const rect=svg.querySelector(`[data-node="${CSS.escape(id)}"] .state-diagram-node`);return rect?[Number(rect.getAttribute('x')),Number(rect.getAttribute('y'))]:undefined;};
 const drag=createNodeDrag({read:()=>view.locked?undefined:{key:'diagram',zoom:view.zoom,scroll:[host.scrollLeft,host.scrollTop],offset:[0,0]},position:nodePosition,connected:id=>!!nodePosition(id),bounds:()=>{const r=host.getBoundingClientRect();return{left:r.left,top:r.top,right:r.left+host.clientWidth,bottom:r.top+host.clientHeight};},change:(id,p)=>{view.positions.set(id,p);draw();},pan:d=>{host.scrollLeft+=d[0];host.scrollTop+=d[1];},requestFrame:cb=>doc.defaultView!.requestAnimationFrame(cb),cancelFrame:id=>doc.defaultView!.cancelAnimationFrame(id)});
 const touch=installTouchGestures(host,{nodeDrag:drag,read:()=>({key:'diagram',zoom:view.zoom,locked:view.locked,scroll:[host.scrollLeft,host.scrollTop]}),position:nodePosition,change:v=>{if(v.node){view.positions.set(v.node.id,v.node.position);draw();}if(v.zoom!==undefined){view.zoom=v.zoom;layout();}if(v.scroll){host.scrollLeft=v.scroll[0];host.scrollTop=v.scroll[1];}if(v.selected)select(v.selected);},finish:()=>{view.scroll=[host.scrollLeft,host.scrollTop];}});
 let pan:{pointer:number;x:number;y:number;scroll:Point;id?:string;moved:boolean}|undefined,pointer:number|undefined;
 host.onpointerdown=e=>{if(e.pointerType==='touch'||e.button!==0)return;const id=(e.target as Element).closest<HTMLElement>('[data-node]')?.dataset.node;pointer=e.pointerId;host.setPointerCapture(pointer);if(id&&!view.locked){e.preventDefault();drag.begin(id,[e.clientX,e.clientY]);}else pan={pointer,x:e.clientX,y:e.clientY,scroll:[host.scrollLeft,host.scrollTop],id,moved:false};};
 host.onpointermove=e=>{if(pointer!==e.pointerId)return;if(pan){if(Math.hypot(e.clientX-pan.x,e.clientY-pan.y)>3)pan.moved=true;host.scrollLeft=pan.scroll[0]-(e.clientX-pan.x);host.scrollTop=pan.scroll[1]-(e.clientY-pan.y);}else drag.move([e.clientX,e.clientY]);};
 host.onpointerup=e=>{if(pointer!==e.pointerId)return;pointer=undefined;const previousPan=pan;pan=undefined;const result=drag.end();if(previousPan?.id&&!previousPan.moved)select(previousPan.id);else if(result&&!result.moved)select(result.id);if(host.hasPointerCapture(e.pointerId))host.releasePointerCapture(e.pointerId);};
 host.onpointercancel=()=>{pointer=undefined;pan=undefined;drag.cancel();};
 host.onscroll=()=>{view.scroll=[host.scrollLeft,host.scrollTop];};
 const settings=(open:boolean)=>{panel.hidden=!open;gear.setAttribute('aria-expanded',String(open));bar.dataset.settingsOpen=String(open);};gear.onclick=()=>settings(panel.hidden);bar.onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();settings(false);gear.focus();}};
 lock.onclick=()=>{touch.cancel();drag.cancel();view.locked=!view.locked;layout();};
 for(const[s,factor]of [['.zoom-in',ZOOM_FACTOR],['.zoom-out',1/ZOOM_FACTOR]] as const)button(s).onclick=()=>{touch.cancel();drag.cancel();Object.assign(view,cameraZoom({zoom:view.zoom,scroll:[host.scrollLeft,host.scrollTop]},factor));layout();host.scrollLeft=view.scroll[0];host.scrollTop=view.scroll[1];};
 button('.reset-layout').onclick=()=>{touch.cancel();drag.cancel();view.positions.clear();Object.assign(view,initialCamera());draw();host.scrollLeft=0;host.scrollTop=0;};
 draw();doc.defaultView?.requestAnimationFrame?.(()=>{host.scrollLeft=view.scroll[0];host.scrollTop=view.scroll[1];});return root;
}
