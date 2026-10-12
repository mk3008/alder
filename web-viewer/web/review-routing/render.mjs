// Static facsimile of main.ts's unselected graph renderer, not a live-app capture.
import {icons,UserRound,Box} from 'lucide';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attrs=value=>Object.entries(value).map(([k,v])=>`${k}="${escape(v)}"`).join(' ');
function iconSVG(icon){return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icon.map(([tag,values])=>`<${tag} ${attrs(values)}></${tag}>`).join('')}</svg>`;}
function nodeHTML(n){
  let image;
  if(n.type==='business'){
    let hash=0;for(const c of String(n.who))hash=(hash*31+c.codePointAt(0))>>>0;
    const color=['#8b5cf6','#2563eb','#c2410c','#008576','#be185d'][hash%5];
    image=`<span class="who-badge" style="--role-color:${color}" aria-hidden="true">${iconSVG(UserRound)}</span>`;
  }else{
    const key=String(n.icon??'file-question').split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join('');
    image=iconSVG(icons[key]??Box);
  }
  return `<div role="group" class="node ${n.type}${n.scope?'':' outside'}" data-node="${escape(n.id)}" style="left:${n.x}px;top:${n.y}px">${image}<span class="node-text"><span class="review-kind">${n.type==='business'?'Activity':'Object'} · ${n.scope?'範囲内':'範囲外'}</span><span class="node-name">${escape(n.name)}</span>${n.type==='business'?`<small>${escape(n.who)}</small>`:''}</span></div>`;
}
function sceneHTML(scene,plan,index){
  const marker=`arrow-${plan.id}-${index}`;
  const paths=scene.edges.map(e=>`<path class="edge${e.kind.endsWith('exception')?' exception':''}" data-relation="${e.index}" data-kind="${e.kind}" data-collisions="${e.route.collisions}" data-fallback="${e.route.fallback}" d="${escape(e.route.path)}" marker-end="url(#${marker})"><title>${escape(e.from+' → '+e.to+': '+e.label)}</title></path>`).join('');
  const labels=scene.edges.map(e=>`<text class="edge-label" data-relation="${e.index}" x="${e.route.label[0]}" y="${e.route.label[1]}" text-anchor="middle" dominant-baseline="middle">${escape(e.label)}</text>`).join('');
  return `<div class="review-crop" style="width:${plan.panelWidth}px;height:${plan.panelHeight}px" data-crop="${escape(JSON.stringify(plan.crop))}" data-scale="${plan.scale}"><div class="review-world" style="transform:matrix(${plan.scale},0,0,${plan.scale},${-plan.crop.x*plan.scale},${-plan.crop.y*plan.scale})"><svg class="review-edges" xmlns="http://www.w3.org/2000/svg" width="5200" height="3000" viewBox="0 0 5200 3000"><defs><marker id="${marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" class="arrow"></path></marker></defs>${paths}${labels}</svg><div class="review-nodes">${scene.nodes.map(nodeHTML).join('')}</div></div></div>`;
}
export function renderReviewHTML(model,plan){
  return `<!doctype html><html lang="ja" data-theme="light"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; font-src 'none'; img-src 'none'"><title>${escape(plan.heading)}</title><style>${model.productCSS}</style><style>
  html,body{margin:0;width:${plan.width}px;height:${plan.height}px;overflow:hidden;background:var(--bg);font-family:Inter,"Segoe UI","Noto Sans JP","Noto Sans CJK JP",sans-serif}
  .review-sheet{box-sizing:border-box;width:${plan.width}px;height:${plan.height}px;padding:12px;overflow:hidden}
  .review-heading{font-size:15px;font-weight:700;line-height:20px;height:20px;margin:0;white-space:nowrap}
  .review-note{font-size:10px;line-height:15px;height:30px;margin:0;padding-top:3px;max-width:100%}
  .review-panel{margin:0;padding:0;height:${28+plan.panelHeight}px}
  .review-panel-title{font-size:12px;line-height:28px;height:28px;font-weight:650;white-space:nowrap;margin:0}
  .review-crop{position:relative;overflow:hidden;background:var(--bg);outline:1px solid var(--subtle)}
  .review-world{position:absolute;left:0;top:0;width:5200px;height:3000px;transform-origin:0 0}
  .review-edges,.review-nodes{position:absolute;left:0;top:0;overflow:visible}
  .review-nodes{width:5200px;height:3000px;pointer-events:none}
  .node{pointer-events:none}
  </style></head><body><div class="review-sheet" data-review-only="true" data-image="${plan.id}"><h1 class="review-heading">${escape(plan.heading)}</h1><p class="review-note">${escape(plan.note)}</p>${plan.panels.map(({scene,title},i)=>`<section class="review-panel" data-scene="${scene.id}" data-router="${scene.router}"><h2 class="review-panel-title">${escape(title)}</h2>${sceneHTML(scene,plan,i)}</section>`).join('')}</div></body></html>`;
}
