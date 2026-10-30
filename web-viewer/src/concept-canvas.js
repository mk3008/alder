import {canOpenDetail} from './detail-navigation.ts';

import {conceptDiagram} from './concept-layout.js';
import {graphFocus} from './graph-focus.ts';
import {cardSurface} from './diagram-canvas.ts';
import {cameraZoom,initialCamera,ZOOM_FACTOR,cameraOrigin} from './graph-camera.ts';
import './graph-presentation.css';
import './canvas-toolbar.css';
import {conceptNeighborhood} from './concept-neighborhood.js';
import {createNodeDrag} from './node-drag.ts';
import {clampZoom,installTouchGestures} from './touch-gestures.ts';
const messageOrigin=location.origin==='null'?'*':location.origin;
let initialized=false;
window.addEventListener('message',event=>{
 if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='alder-concept-data'||initialized)return;
 initialized=true;mountConceptCanvas(event.data);
});
function mountConceptCanvas({graph,focus,documentKey,viewKey}){
const tables=graph.tables,edges=graph.edges,focusId=focus;
const overviewStage={id:'overview',title:'データ構造',ids:graph.ids,edges,rules:[],change:''};
if(focusId&&Object.hasOwn(tables,focusId))Object.assign(overviewStage,conceptNeighborhood(graph.ids,edges,focusId));
const stages=[overviewStage];
const NS='http://www.w3.org/2000/svg',storageKey='alder-concept-canvas-v9:'+location.pathname+':'+encodeURIComponent(documentKey)+':'+encodeURIComponent(viewKey??'overview');
const measureContext=document.createElement('canvas').getContext('2d');
function measure(text,size=14){measureContext.font=size+'px "Segoe UI","Noto Sans JP",sans-serif';return measureContext.measureText(text).width;}
function svgNode(tag,attrs={},text){const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;return n;}
let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch{}
const sizes=new Map(Object.entries(tables).map(([id,t])=>[id,{w:Math.ceil(Math.max(220,measure(t.name,15)+64,...t.fields.map(([,n])=>measure(n)+24))),h:44+t.fields.length*25}]));
const states=[];
function save(s){if(s.stage.id!=='overview')return;try{localStorage.setItem(storageKey,JSON.stringify({positions:Object.fromEntries(s.positions),zoom:s.zoom,locked:s.locked}));}catch{}}
function layoutCanvas(s){
 const zoom=s.stage.id==='overview'?s.zoom:1;
 const minimum=[Math.min(0,...[...s.boxes.values()].map(b=>b.x)),Math.min(0,...[...s.boxes.values()].map(b=>b.y))],{origin,growth}=cameraOrigin(s.origin??[0,0],minimum,zoom);s.origin=origin;
 s.svg.setAttribute('viewBox',`${-origin[0]} ${-origin[1]} ${s.width+origin[0]} ${s.height+origin[1]}`);s.svg.style.width=(s.width+origin[0])+'px';s.svg.style.height=(s.height+origin[1])+'px';s.svg.style.transform=`scale(${zoom})`;s.svg.style.transformOrigin='0 0';
 s.world.style.width=Math.ceil(Math.max((s.width+origin[0])*zoom,s.host.clientWidth+160))+'px';s.world.style.height=Math.ceil(Math.max((s.height+origin[1])*zoom,s.host.clientHeight)+160)+'px';
 if(growth.some(Boolean))s.host.scrollTo(s.host.scrollLeft+growth[0],s.host.scrollTop+growth[1]);
 if(s.stage.id!=='overview'){s.world.style.width=s.width+'px';s.world.style.height=s.height+'px';s.host.style.height=s.height+2+'px';}
 s.zoomLabel.textContent=Math.round(zoom*100)+'%';s.lockButton.setAttribute('aria-label','配置ロック');s.lockButton.title=s.locked?'配置をロック中。項目の上から図をスクロールできます。':'配置ロックを解除中。項目をドラッグして配置を変更できます。';s.lockButton.setAttribute('aria-pressed',String(s.locked));
 s.host.dataset.layoutLocked=String(s.locked);
}
function draw(s){
 const {boxes,routing}=conceptDiagram(s.stage.ids,s.stage.edges,sizes,s.positions);s.boxes=boxes;s.svg.replaceChildren();
 const wires=svgNode('g',{class:'concept-relations'});s.svg.append(wires);
 const focus=graphFocus(routing.routes,s.selected),related=new Set(routing.routes.filter(focus.related).map(r=>r.id));
 s.width=Math.max(260,routing.width,...[...boxes.values()].map(b=>b.x+b.w+24));s.height=Math.max(180,routing.height,...[...boxes.values()].map(b=>b.y+b.h+24));s.svg.setAttribute('viewBox',`0 0 ${s.width} ${s.height}`);
 for(const r of routing.routes){const p=svgNode('path',{class:'wire'+(related.has(r.id)?' review-related':'')+(r.unrouted?' unresolved':''),d:r.d,'data-from':r.from,'data-to':r.to,'data-edge':r.id,'data-from-cardinality':r.fromCount,'data-to-cardinality':r.toCount,'data-unrouted':r.unrouted,role:'img','aria-label':tables[r.from].name+'1件に対して'+tables[r.to].name+r.toCount+'件／'+tables[r.to].name+'1件に対して'+tables[r.from].name+r.fromCount+'件'});wires.append(p);for(const port of r.ports)wires.append(svgNode('circle',{class:'concept-port'+(related.has(r.id)?' review-related':''),cx:port.p.x,cy:port.p.y,r:2.5,fill:'#7f969f','data-edge':r.id,'data-port-table':port.table,'pointer-events':'none'}));}
 for(const l of routing.labels){wires.append(svgNode('text',{class:'endpoint-count'+(related.has(l.edge)?' review-related':''),'data-edge':l.edge,'data-table':l.table,x:l.x,y:l.y,'text-anchor':l.anchor,'pointer-events':'none'},l.count));}
 s.warning.textContent=routing.routes.some(r=>r.unrouted)||routing.labels.some(l=>l.conflict)?'接続線または件数表示を確保できない配置です。概念間を広げてください。':'';
 for(const[id,b]of boxes){const t=tables[id],g=svgNode('g',{class:'node graph-shape table'+(s.stage.id==='overview'?' read':'')+focus.nodeClasses(id),'data-node':id,'data-table':id,role:'group','aria-label':t.name});
 const surface=cardSurface(s.svg.ownerDocument,b);surface.firstElementChild.classList.add('concept-card-surface');g.append(surface);
 const body=svgNode('g',{class:'concept-select',tabindex:0,role:'button','aria-label':t.name+'を選択','aria-pressed':String(s.selected===id)});g.append(body);
 body.append(svgNode('rect',{x:b.x,y:b.y,width:b.w,height:b.h,rx:5}));body.append(svgNode('text',{class:'name',x:b.x+12,y:b.y+23},t.name));
 t.fields.forEach(([,name],i)=>body.append(svgNode('text',{x:b.x+12,y:b.y+56+i*25},name)));
 g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();navigateDetail(s,id);}else if(s.stage.id==='overview'&&!s.locked&&e.altKey&&e.key.startsWith('Arrow')){e.preventDefault();const d=e.shiftKey?50:10;changeNode(s,id,[b.x+(e.key==='ArrowLeft'?-d:e.key==='ArrowRight'?d:0),b.y+(e.key==='ArrowUp'?-d:e.key==='ArrowDown'?d:0)]);s.svg.querySelector(`[data-node="${id}"] .concept-select`)?.focus();save(s);}};
 if(canOpenDetail(id,focusId)){const command=svgNode('foreignObject',{x:b.x+b.w-35,y:b.y+1,width:34,height:34});const button=document.createElement('button');button.type='button';button.className='concept-open-action';button.dataset.conceptOpen=id;button.setAttribute('aria-label',t.name+'と隣接する概念を別タブで開く');button.title='隣接する概念を別タブで開く';button.onclick=e=>{e.stopPropagation();parent.postMessage({type:'alder-concept-open',id},messageOrigin);};button.onkeydown=e=>e.stopPropagation();command.append(button);g.append(command);}s.svg.append(g);
 }
 layoutCanvas(s);parent.postMessage({type:'alder-concept-rendered'},messageOrigin);
}
function changeNode(s,id,p){s.positions.set(id,{x:p[0],y:p[1]});draw(s);}
function activeStage(){return 'overview';}
function capture(focus){return{page:[scrollX,scrollY],focus,views:states.map(s=>({id:s.stage.id,scroll:[s.host.scrollLeft,s.host.scrollTop],zoom:s.zoom,locked:s.locked,selected:s.selected}))};}
function applyLocation(){
 const active=activeStage();for(const s of states)s.section.hidden=s.stage.id!==active;
 document.querySelector('h1').textContent=active==='overview'?'概念モデルの全体図':'Activityごとに、扱う情報を見る';
 const previous=history.state?.conceptView;
 if(previous){for(const v of previous.views){const s=states.find(s=>s.stage.id===v.id);if(!s)continue;s.zoom=v.zoom;s.locked=v.locked;s.selected=v.selected;draw(s);s.host.scrollTo(...v.scroll);}
 requestAnimationFrame(()=>{window.scrollTo(...previous.page);const f=previous.focus;if(f)states.find(s=>s.stage.id===f.stage)?.svg.querySelector(`[data-node="${f.id}"]`)?.focus({preventScroll:true});});
 }else if(location.hash.startsWith('#concept-'))requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'}));
 else window.scrollTo(0,0);
 document.querySelectorAll('nav a').forEach(a=>{a.removeAttribute('aria-current');const u=new URL(a.href);if((u.searchParams.get('activity')||'overview')===active)a.setAttribute('aria-current','page');});
 document.querySelectorAll('.section-back').forEach(b=>b.hidden=!history.state?.conceptFrom);
}
function navigateDetail(s,id){s.selected=id;draw(s);save(s);parent.postMessage({type:'alder-concept-select',id},messageOrigin);s.svg.querySelector(`[data-node="${id}"] .concept-select`)?.focus({preventScroll:true});}

function zoomBy(s,factor){s.touch?.cancel();s.drag?.cancel();const next=cameraZoom({zoom:s.zoom,scroll:[s.host.scrollLeft,s.host.scrollTop]},factor);s.zoom=next.zoom;layoutCanvas(s);s.host.scrollTo(...next.scroll);save(s);}
function installCanvas(s){
 const host=s.host;let pointer,pan;
 s.drag=createNodeDrag({read:()=>!s.locked?{key:s.stage.id,zoom:s.zoom,scroll:[host.scrollLeft,host.scrollTop],offset:s.origin??[0,0]}:undefined,position:id=>{const b=s.boxes.get(id);return b&&[b.x,b.y];},connected:id=>!!s.svg.querySelector(`[data-node="${id}"]`),bounds:()=>{const r=host.getBoundingClientRect();return{left:r.left+host.clientLeft,top:r.top+host.clientTop,right:r.left+host.clientLeft+host.clientWidth,bottom:r.top+host.clientTop+host.clientHeight};},change:(id,p)=>changeNode(s,id,p),pan:d=>{host.scrollLeft+=d[0];host.scrollTop+=d[1];},requestFrame:cb=>requestAnimationFrame(cb),cancelFrame:id=>cancelAnimationFrame(id)});
 s.touch=installTouchGestures(host,{nodeDrag:s.drag,read:()=>({key:s.stage.id,zoom:s.zoom,locked:s.locked,scroll:[host.scrollLeft,host.scrollTop]}),position:id=>{const b=s.boxes.get(id);return b&&[b.x,b.y];},change:v=>{if(v.node)changeNode(s,v.node.id,v.node.position);if(v.zoom!==undefined){s.zoom=v.zoom;layoutCanvas(s);}if(v.scroll)host.scrollTo(...v.scroll);if(v.selected)navigateDetail(s,v.selected);},finish:()=>save(s)});
 host.onpointerdown=e=>{if(e.pointerType==='touch'||e.button!==0||e.target.closest('button'))return;const r=host.getBoundingClientRect();if(e.clientX>=r.left+host.clientLeft+host.clientWidth||e.clientY>=r.top+host.clientTop+host.clientHeight)return;
 const id=e.target.closest('.node')?.dataset.node;e.preventDefault();pointer=e.pointerId;host.setPointerCapture(pointer);if(id&&!s.locked){s.drag.begin(id,[e.clientX,e.clientY]);pan=undefined;}else pan={x:e.clientX,y:e.clientY,scroll:[host.scrollLeft,host.scrollTop],id,moved:false};};
 host.onpointermove=e=>{if(pointer!==e.pointerId)return;if(pan){const dx=e.clientX-pan.x,dy=e.clientY-pan.y;if(Math.hypot(dx,dy)>3)pan.moved=true;host.scrollTo(pan.scroll[0]-dx,pan.scroll[1]-dy);}else s.drag.move([e.clientX,e.clientY]);};
 host.onpointerup=e=>{if(pointer!==e.pointerId)return;pointer=undefined;const p=pan;pan=undefined;const result=s.drag.end();if(host.hasPointerCapture(e.pointerId))host.releasePointerCapture(e.pointerId);save(s);if(p?.id&&!p.moved)navigateDetail(s,p.id);else if(result&&!result.moved)navigateDetail(s,result.id);};
 host.onpointercancel=()=>{pointer=undefined;pan=undefined;s.drag.cancel();};host.addEventListener('lostpointercapture',e=>{if(e.target===host){pointer=undefined;pan=undefined;s.drag.cancel();}});
 const bar=s.section.querySelector('.graph-toolbar'),gear=bar.querySelector('.graph-settings-toggle'),panel=bar.querySelector('.concept-display-options');
 const settings=open=>{panel.hidden=!open;bar.dataset.settingsOpen=String(open);gear.setAttribute('aria-expanded',String(open));gear.setAttribute('aria-label',open?'表示設定を閉じる':'表示設定を開く');};gear.onclick=()=>settings(panel.hidden);
 bar.querySelector('.reset-layout').onclick=()=>{s.touch.cancel();s.drag.cancel();s.positions.clear();s.origin=[0,0];s.zoom=initialCamera().zoom;draw(s);host.scrollTo(...initialCamera().scroll);save(s);settings(false);gear.focus();};
 document.addEventListener('pointerdown',e=>{if(!bar.contains(e.target))settings(false);});bar.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();settings(false);gear.focus();}});
 s.lockButton.onclick=()=>{s.touch.cancel();s.drag.cancel();s.locked=!s.locked;layoutCanvas(s);save(s);};
 s.section.querySelector('.zoom-in').onclick=()=>zoomBy(s,ZOOM_FACTOR);s.section.querySelector('.zoom-out').onclick=()=>zoomBy(s,1/ZOOM_FACTOR);

}
for(const stage of stages.filter(s=>s.id==='overview')){
 const section=document.createElement('section');section.className='stage';section.id=stage.id;section.innerHTML=`<div class="stage-top"><h2>${stage.title}</h2><button class="section-back" hidden>図へ戻る</button></div><div class="graph-toolbar canvas-controls" data-settings-open="false" ${stage.id==='overview'?'':'hidden'}><button class="graph-settings-toggle" aria-label="表示設定を開く" title="表示設定を開く" aria-controls="concept-display-options" aria-expanded="false"></button><div class="concept-display-options" id="concept-display-options" hidden><button class="reset-layout">レイアウトを初期値に戻す</button></div><button class="layout-lock canvas-lock" aria-label="配置ロック" aria-pressed="false"></button><button class="zoom-out" aria-label="縮小" title="縮小"></button><span class="zoom-value canvas-zoom">100%</span><button class="zoom-in" aria-label="拡大" title="拡大"></button></div><p class="routing-warning" role="status"></p><div class="canvas ${stage.id==='overview'?'overview-canvas':'local-canvas'}" tabindex="0" aria-label="${stage.title}のデータ構造図"><div class="world"><svg role="group" aria-label="${stage.title}のデータと関係"></svg></div></div><div class="concept-details"></div><section class="activity-rules"><h3>この図の条件・未決</h3>${stage.rules.map(r=>'<p>'+r+'</p>').join('')}<p>${stage.change}</p></section>`;
 document.getElementById('stages').append(section);const s={stage,section,host:section.querySelector('.canvas'),world:section.querySelector('.world'),svg:section.querySelector('svg'),warning:section.querySelector('.routing-warning'),zoomLabel:section.querySelector('.zoom-value'),lockButton:section.querySelector('.layout-lock'),positions:new Map(),zoom:1,locked:false,selected:focusId||null};
 if(stage.id==='overview'){for(const[id,p]of Object.entries(saved.positions||{}))if(stage.ids.includes(id)&&Number.isFinite(p?.x)&&Number.isFinite(p?.y))s.positions.set(id,p);s.zoom=clampZoom(Number.isFinite(saved.zoom)?saved.zoom:1);s.locked=saved.locked!==false;}

 s.section.querySelector('.section-back').onclick=()=>history.back();states.push(s);draw(s);if(stage.id==='overview')installCanvas(s);else{s.svg.onclick=e=>{const id=e.target.closest('.node')?.dataset.node;if(id)navigateDetail(s,id);};}
}

window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent||e.data?.type!=='alder-concept-highlight')return;const id=e.data.id;if(!Object.hasOwn(tables,id))return;for(const s of states)if(s.stage.ids.includes(id)&&s.selected!==id){s.selected=id;draw(s);}});
window.addEventListener('popstate',applyLocation);window.addEventListener('resize',()=>states.forEach(layoutCanvas));
window.addEventListener('blur',()=>states.forEach(s=>{s.touch?.cancel();s.drag?.cancel();save(s);}));
applyLocation();


}
