import{L as qs,D as Gr,G as Jr,W as _r,P as Kr,l as gt,X as Ws,C as Xr,n as Zr,S as An,o as zs,p as Us,q as $s,M as Fs,s as Vs,t as Bs,u as Ri,g as Di,r as di,d as Hs,U as Gs,b as wo,v as Ni,w as Yr,x as Js,y as _s,z as li,A as Qr,m as Pi,B as ea,E as Ks,F as ta,j as na,H as cs,I as oa,T as ia,J as sa,K as ra,R as aa,N as ca,O as da,Q as la,V as ua,Y as fa,_ as pa,Z as ds,k as ma,i as ha,h as ba,f as ga,a as ya,$ as va,a0 as wa,a1 as Xs,a2 as ka,a3 as Ia,e as Sa}from"./canvas-toolbar-DqdCGnfW.js";const xa={subsystems:{full:"サブシステム",icon:Kr},business:{full:"業務設計",icon:_r},states:{full:"状態遷移",icon:Jr},concept:{full:"データ構造",icon:Gr},tests:{full:"テスト仕様",icon:qs}};function ui(e,t,n){const o=xa[t],i=document.createElement("span"),s=document.createElement("span"),c=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(gt(o.icon,{"aria-hidden":"true","stroke-width":1.8})),c.className="view-tab-name",c.textContent=n,i.append(s,c),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function fi(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(gt(Ws,{"aria-hidden":"true","stroke-width":1.8})),t}function Aa(e){const t=gt(e?Xr:Zr,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Ea(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,c=Math.max(0,Math.min(n,s+o*i));c!==s&&(e.scrollLeft=c,t.preventDefault())},{passive:!1})}function Oa(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const Ca=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function ls(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=Ca,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const c=gt(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&c.classList.add(s),t.querySelector(o)?.append(c)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",zs),n(".layout-lock",Us,"lock-closed"),n(".layout-lock",$s,"lock-open"),n(".zoom-out",Fs),n(".zoom-in",Vs)}function us(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))t.querySelector("svg")||t.append(gt(An,{"aria-hidden":"true","stroke-width":1.8}))}function ja({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(d=>["",d.name+(d.responsibleSubsystemId&&d.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(r=>r.id===d.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),o=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(d=>[d.conceptId,{name:d.name,note:d.description,fields:d.fields.map(r=>["",r]),sources:d.sources,sourceActivities:d.sourceActivityIds}])),relations:a.graph.edges.map(d=>[d.fromConceptId,d.toConceptId,d.fromLabel,d.toLabel,d.kind])})),i=a=>o.find(d=>d.id===a),s=(a,d)=>{const r=Object.fromEntries(a.nodes.map(m=>[m.id,{...d[m.conceptId],name:m.name,note:m.description,sources:m.sources,conceptId:m.conceptId,subsystemId:m.subsystemId,fields:m.fields.map(g=>["",g.name])}])),u=e.subsystems.filter(m=>a.nodes.some(g=>g.subsystemId===m.id)).map(m=>({id:m.id,name:m.name})),f=a.handoffIds.map(m=>e.handoffs.find(g=>g.id===m)).map(m=>({id:m.id,from:m.fromSubsystemId,to:m.toSubsystemId,label:m.information,returning:m.flowDirection==="return"}));return{ids:a.nodes.map(m=>m.id),tables:r,edges:a.edges.map(m=>[m.fromViewId,m.toViewId,m.fromLabel,m.toLabel,m.kind]),regions:u,handoffs:f}};return{tables:t,edges:n,groups:o,findGroup:i,graph:a=>{const d=i(a);if(!d)throw Error("Unknown review group: "+a);const r=e.reviewGroups.find(m=>m.id===a),u=r.graph.subsystemViews;if(u)return s(u,d.concepts);const f=Object.keys(t).filter(m=>Object.hasOwn(d.concepts,m));return{ids:f,tables:d.concepts,edges:d.relations.filter(([m,g])=>f.includes(m)&&f.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function Ge(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Ma(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",o.append(gt(An,{"aria-hidden":"true","stroke-width":1.8})),Ge(o,"span",t),o.onclick=n,e.append(o),o}function La(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Ra(e,t,n,o=()=>{},i=()=>{},s=[]){const c=n.contentFor(t.id);if(e.replaceChildren(),!c)return;Ge(e,"p",c.description).className="review-description",Ge(e,"h3","レビュアー"),Ge(e,"p",c.reviewer.role).className="review-owner",Ge(e,"h3","関連業務");const l=document.createElement("ul");l.className="review-related-activities";for(const a of c.relatedActivities){const d=document.createElement("li"),r=s.find(f=>f.id===a.id&&f.name===a.name),u=Ma(d,a.name,()=>{r&&i(r.id)});u.disabled=!r,u.setAttribute("aria-label",a.name+"を業務タブで開く"),u.querySelector("svg")?.setAttribute("data-icon","square-arrow-out-up-right"),u.append(u.querySelector("svg")),l.append(d)}e.append(l),Ge(e,"h3","情報の構造");for(const a of c.structureStatements){const d=document.createElement("section");d.className="review-structure",d.dataset.structure=a.id,Ge(d,"h4",a.title),Ge(d,"p",a.description),e.append(d)}Ge(e,"h3","できること");for(const a of c.capabilities){const d=document.createElement("section");d.className="review-capability",d.dataset.capability=a.id,Ge(d,"h4",a.title),Ge(d,"p",a.description);for(const r of a.samples){const u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=r.id,u.textContent="サンプル："+r.name,u.onclick=()=>o(r.id),d.append(u)}e.append(d)}Ge(e,"h3","できないこと（業務上のルール）");for(const a of c.limitations){const d=document.createElement("section");d.className="review-limitation",Ge(d,"h4",a.title),Ge(d,"p",a.description),Ge(d,"h5","理由"),Ge(d,"p",a.reason),e.append(d)}}function Gt(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function Da({model:e,business:t}){const n=c=>c.kind==="group"?e.subsystems.find(l=>l.id===c.id):e.handoffs.find(l=>l.id===c.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(c){const l=n(c);return l?l.activityIds.map(a=>t.activities.find(d=>d.id===a)).filter(Boolean):[]}function s(c,l){if(c.replaceChildren(),l.kind==="group"){const u=e.subsystems.find(m=>m.id===l.id);if(!u)return"";Gt(c,"p",u.purpose),Gt(c,"h3","扱う情報");const f=c.ownerDocument.createElement("ul");for(const m of u.information)Gt(f,"li",m);return c.append(f),Gt(c,"h3","まとまりの理由"),Gt(c,"p",u.reason),u.name}const a=e.handoffs.find(u=>u.id===l.id);if(!a)return"";Gt(c,"p",a.description),Gt(c,"h3","出元と受取先");const d=e.subsystems.find(u=>u.id===a.fromSubsystemId),r=e.subsystems.find(u=>u.id===a.toSubsystemId);return Gt(c,"p",`${d.name} → ${r.name}`),a.information}return{sections:o,activities:i,describe:s}}function Na(e,t,n){const o=document.createElement("div");o.className="concept-drawer-resize",o.tabIndex=0,o.setAttribute("role","separator"),o.setAttribute("aria-orientation","vertical"),o.setAttribute("aria-label","補足情報の幅"),e.prepend(o);let i=440;try{const l=Number(sessionStorage.getItem(n));Number.isFinite(l)&&l>=280&&(i=l)}catch{}const s=()=>{let l=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(l-=a.offsetWidth),Math.max(280,Math.min(1e3,l-(innerWidth>800?240:16)))},c=(l,a=!1)=>{if(i=Math.max(280,Math.min(s(),l)),e.style.setProperty("--concept-drawer-width",i+"px"),o.setAttribute("aria-valuemin","280"),o.setAttribute("aria-valuemax",String(s())),o.setAttribute("aria-valuenow",String(Math.round(i))),a)try{sessionStorage.setItem(n,String(i))}catch{}};if(o.onkeydown=l=>{["ArrowLeft","ArrowRight","Home","End"].includes(l.key)&&(l.preventDefault(),c(l.key==="Home"?280:l.key==="End"?s():i+(l.key==="ArrowLeft"?40:-40),!0))},o.onpointerdown=l=>{if(l.button!==0)return;l.preventDefault();const a=l.clientX,d=i;o.setPointerCapture(l.pointerId),o.classList.add("resizing"),o.onpointermove=r=>c(d+a-r.clientX),o.onpointerup=()=>{o.onpointermove=null,o.onpointerup=null,o.onpointercancel=null,o.classList.remove("resizing"),c(i,!0)},o.onpointercancel=o.onpointerup},typeof ResizeObserver<"u"){const l=new ResizeObserver(()=>c(i));l.observe(t);const a=t.querySelector("#design-explorer");a&&l.observe(a)}window.addEventListener("resize",()=>c(i)),c(i)}const Pa="http://www.w3.org/2000/svg",St=(e,t,n={})=>{const o=e.createElementNS(Pa,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function Ta(e,{model:t,business:n},o,i,s){const c=t.reviewGroups,l=t.subsystems,a=t.presentation.landscapeRelationships.map(v=>{const P=c.find(k=>k.id===v.from),V=c.find(k=>k.id===v.to);if(!P||!V||P.subsystemId!==V.subsystemId||!t.presentation.reviewBoundaries.some(k=>k.from===v.from&&k.to===v.to))throw Error("Unknown overview relationship: "+v.from+" -> "+v.to);return v}),d=t.handoffs.map(v=>{if(!["forward","return"].includes(v.flowDirection))throw Error("Unknown overview handoff direction: "+v.id);return{id:v.id,from:v.fromSubsystemId,to:v.toSubsystemId,label:v.information,returning:v.flowDirection==="return"}});if(new Set(d.map(v=>v.id)).size!==d.length)throw Error("Duplicate overview handoff");for(const v of d)if(!l.some(P=>P.id===v.from)||!l.some(P=>P.id===v.to)||v.from===v.to||!v.label.trim())throw Error("Unknown overview handoff: "+v.id);for(const v of c){if(!l.some(P=>P.id===v.subsystemId))throw Error("Unknown overview subsystem: "+v.id);if(!n.roles?.some(P=>P.id===v.reviewer.roleId))throw Error("Unknown overview reviewer: "+v.id)}const r=l.flatMap(v=>c.filter(P=>P.subsystemId===v.id)),u=new Map;let f=0;for(const[v,P]of l.entries())for(const V of r.filter(k=>k.subsystemId===P.id))u.set(V.id,[80+f*170,100+f*120+v*64]),f++;const m=Ri(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let p,h,S=!1;try{const v=JSON.parse(localStorage.getItem(g)||"null"),P=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),V=!v&&P?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,k=v??V;if(k){S=!0,typeof k.zoom=="number"&&Number.isFinite(k.zoom)&&(m.zoom=Math.max(.25,Math.min(2.5,k.zoom))),Array.isArray(k.scroll)&&k.scroll.length===2&&k.scroll.every(M=>typeof M=="number"&&Number.isFinite(M))&&(m.scroll=k.scroll),typeof k.locked=="boolean"&&(m.locked=k.locked);for(const[M,W]of Object.entries(k.positions??{}))c.some(J=>J.id===M)&&Array.isArray(W)&&W.length===2&&W.every(J=>typeof J=="number"&&Number.isFinite(J))&&m.positions.set(M,[W[0],W[1]])}const C=k?.selection,T=C?.kind==="node"?t.concepts.find(M=>M.id===C.id)?.subsystemId:C?.id,R=C?.kind==="node"?"group":C?.kind;typeof T=="string"&&(R==="model"&&c.some(M=>M.id===T)||R==="group"&&l.some(M=>M.id===T)||R==="connection"&&d.some(M=>M.id===T))&&(h={kind:R,id:T}),h?.kind==="model"&&(m.selected=h.id)}catch{}const L=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:m.zoom,scroll:m.scroll,locked:m.locked,positions:Object.fromEntries(m.positions),selection:h}))}catch{}},w=v=>{h=v,m.selected=v.kind==="model"?v.id:void 0;const P=p?.querySelector(".diagram-world>svg");P&&E(P),L(),s()},E=v=>{const P=wo(a,m.selected),V=wo(d,h?.kind==="group"?h.id:void 0);for(const k of c){const C=v.querySelector(`[data-node="${k.id}"]`);C?.setAttribute("class","node graph-shape state-shape"+P.nodeClasses(k.id)),C?.setAttribute("aria-pressed",String(m.selected===k.id))}for(const k of l){const C=v.querySelector(`[data-subsystem="${k.id}"]`);C?.setAttribute("class","subsystem-overview-group"+V.nodeClasses(k.id)),C?.querySelector("button")?.setAttribute("aria-pressed",String(h?.kind==="group"&&h.id===k.id))}for(const k of a){const C=v.querySelector(`[data-overview-from="${k.from}"][data-overview-to="${k.to}"]`);C?.setAttribute("class","edge"+(P.related(k)?" review-related":"")),C?.setAttribute("marker-end",`url(#overview-${P.related(k)?"related-arrow":"arrow"})`)}for(const k of d){const C=V.related(k)||h?.kind==="connection"&&h.id===k.id,T=v.querySelector(`[data-handoff-id="${k.id}"]`);T?.setAttribute("class","edge"+(k.returning?" exception":"")+(C?" review-related":"")),T?.setAttribute("marker-end",`url(#overview-${C?"related-arrow":"arrow"})`),v.querySelector(`[data-handoff-label="${k.id}"]`)?.classList.toggle("review-related",!!C)}v.querySelectorAll("[data-exception-paint]").forEach(k=>k.remove());for(const k of Array.from(v.querySelectorAll("[data-handoff-id].exception")))Ni(v,k,{path:k.getAttribute("d")},{"data-overview-return-paint":k.getAttribute("data-handoff-id")})};return p=Bs(e,v=>{const P=r.map(R=>{const M=v.positions.get(R.id)??u.get(R.id);return{id:R.id,x:M[0],y:M[1],width:300,height:86}}),V=St(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});V.append(Di("overview-"));let k=0,C=0;const T=[];for(const R of l){const M=P.filter(he=>c.find(A=>A.id===he.id)?.subsystemId===R.id);if(!M.length)continue;const W=Math.min(...M.map(he=>he.x))-30,J=Math.min(...M.map(he=>he.y))-48,ee=Math.max(...M.map(he=>he.x+he.width))-W+30,ae=Math.max(...M.map(he=>he.y+he.height))-J+30;T.push({id:R.id,x:W,y:J,width:ee,height:ae});const te=St(e,"g",{"data-subsystem":R.id,"aria-label":R.name}),le=St(e,"rect",{x:W,y:J,width:ee,height:ae,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});le.addEventListener("click",()=>w({kind:"group",id:R.id})),te.append(le);const Te=St(e,"foreignObject",{class:"subsystem-overview-region-heading",x:W+8,y:J+3,width:ee-16,height:36}),je=e.createElement("button");je.type="button",je.className="subsystem-overview-region-title",je.setAttribute("aria-label",R.name+"を選択"),je.textContent=R.name,je.onclick=()=>w({kind:"group",id:R.id}),Te.append(je),te.append(Te),V.append(te),k=Math.max(k,W+ee+40),C=Math.max(C,J+ae+40)}for(const[R,M]of d.entries()){if(!T.some(te=>te.id===M.from)||!T.some(te=>te.id===M.to))throw Error("Missing overview handoff region: "+M.id);const W=Math.max(30,M.label.length*12),J=di({from:M.from,to:M.to,nodes:T,index:R,kind:"input",matrix:{returning:M.returning,captionLane:0},labelWidth:W,labelHeight:18}),ee=St(e,"path",{d:J.path,class:"edge"+(M.returning?" exception":""),"data-handoff-id":M.id,"data-from-subsystem":M.from,"data-to-subsystem":M.to,"data-flow-direction":M.returning?"return":"forward","marker-end":"url(#overview-arrow)"});V.append(ee);const ae=St(e,"text",{x:J.label[0]-W/2,y:J.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":M.id});ae.textContent=M.label,ae.addEventListener("pointerdown",te=>te.stopPropagation()),ae.addEventListener("pointerup",te=>te.stopPropagation()),ae.addEventListener("click",()=>w({kind:"connection",id:M.id})),ae.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),w({kind:"connection",id:M.id}))}),V.append(ae),k=Math.max(k,J.bounds.right+40,J.label[0]+W/2+30),C=Math.max(C,J.bounds.bottom+40,J.label[1]+30)}for(const[R,M]of a.entries()){const W=di({from:M.from,to:M.to,nodes:P,index:R,kind:"input",labelWidth:0,labelHeight:0}),J=St(e,"path",{d:W.path,class:"edge","data-overview-from":M.from,"data-overview-to":M.to,"marker-end":"url(#overview-arrow)"});V.append(J),k=Math.max(k,W.bounds.right+40),C=Math.max(C,W.bounds.bottom+40)}for(const R of P){const M=c.find(A=>A.id===R.id),W=n.roles.find(A=>A.id===M.reviewer.roleId),J=St(e,"g",{role:"button",tabindex:0,"aria-label":M.title+"を選択","aria-pressed":"false","data-node":R.id,"data-review-group":R.id,"data-subsystem-id":M.subsystemId,class:"node graph-shape state-shape"}),ee=Hs(e,R);ee.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),J.append(ee,St(e,"rect",{x:R.x,y:R.y,width:R.width,height:R.height,rx:8,class:"state-diagram-node"}));const te=St(e,"foreignObject",{x:R.x,y:R.y,width:R.width,height:R.height}),le=e.createElement("div");le.className="subsystem-overview-card";const Te=e.createElement("span");Te.className="subsystem-overview-role-icon",Te.style.setProperty("--role-color",W.color),Te.setAttribute("aria-hidden","true"),Te.append(e.importNode(gt(Gs,{"aria-hidden":"true","stroke-width":1.8}),!0));const je=e.createElement("span");je.className="subsystem-overview-labels";for(const[A,D,U]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",M.title],["small","subsystem-overview-role",W.name]]){const Q=e.createElement(A);Q.className=D,Q.textContent=U,je.append(Q)}const he=e.createElement("button");he.type="button",he.className="subsystem-overview-open",he.setAttribute("aria-label",M.title+"の詳細タブを開く"),he.title="詳細タブを開く",he.append(e.importNode(gt(An,{"aria-hidden":"true","stroke-width":1.8}),!0)),he.onpointerdown=A=>A.stopPropagation(),he.onpointerup=A=>A.stopPropagation(),he.onclick=A=>{A.stopPropagation(),i(M.id)},le.append(Te,je,he),te.append(le),J.append(te),J.addEventListener("click",()=>w({kind:"model",id:R.id})),J.addEventListener("keydown",A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),w({kind:"model",id:R.id}))}),V.append(J)}return V.setAttribute("viewBox",`0 0 ${k} ${C}`),E(V),V},m,L),p.classList.add("subsystem-overview-canvas"),p.addEventListener("click",L),p.addEventListener("pointerup",()=>queueMicrotask(L)),p.querySelector(".diagram-viewport")?.addEventListener("scroll",L),S||e.defaultView?.requestAnimationFrame?.(()=>{const v=p.querySelector(".diagram-viewport"),P=p.querySelector(".zoom-out");if(v.clientWidth){for(let V=0;V<8;V++){v.scrollLeft=0,v.scrollTop=0;const k=v.getBoundingClientRect().right;if(Array.from(p.querySelectorAll("[data-handoff-label]")).every(C=>C.getBoundingClientRect().right<=k))break;P.click()}m.scroll=[v.scrollLeft,v.scrollTop],L()}}),{root:p,selected:()=>m.selected,selection:()=>h,restore:()=>{const v=()=>{const P=p.querySelector(".diagram-viewport");P.scrollLeft=m.scroll[0],P.scrollTop=m.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(v):v()}}}function qa(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(c=>c.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function Wa({model:e,business:t}){const n=g=>{const p=t.activities.find(h=>h.id===g);if(!p)throw Error("Unknown activity: "+g);return p},o=g=>{const p=t.roles?.find(h=>h.id===g);if(!p)throw Error("Unknown role: "+g);return p.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(p=>{const h=n(p);return{id:h.id,name:h.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(p=>({...p,samples:p.samples.map(qa)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(p=>p.id===g),c=(g,p)=>s(g)?.capabilities.find(h=>h.samples.some(S=>S.id===p)),l=i.flatMap(g=>g.capabilities.flatMap(p=>p.samples.map(h=>({...h,group:g.id})))),a=["yellow","cyan","green","blue","purple","orange"];function d(g,p,h){let S=h.get(p);if(S||(S=a[h.size]??`extra-${h.size}`,h.set(p,S)),g.dataset.sampleKey=p,g.dataset.keyTone=S,g.className="data-example-key",S.startsWith("extra-")){const L=(Number(S.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${L} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${L} 24% 25%)`)}}const r=g=>l.filter(p=>p.group===g),u=(g,p)=>r(g).find(h=>h.id===p);function f(g,p,h){const S=g.ownerDocument.createElement(p);return S.textContent=h,g.append(S),S}function m(g,p,h,S,L){const w=g.ownerDocument,E=u(p.id,h);if(!E)throw Error("Unknown data example: "+h);g.replaceChildren(),g.dataset.dataExample=h;const O=new Map;e.presentation.sampleCaption&&(f(g,"p",e.presentation.sampleCaption).className="data-example-caption");const v=s(p.id)?.capabilities??[],P=L?.capabilityId?v.filter(R=>R.id===L.capabilityId):v;if(L?.capabilityId&&!P.some(R=>R.samples.some(M=>M.id===h)))throw Error("Sample does not belong to capability: "+h);const V=c(p.id,h);g.dataset.capability=V.id;const k=()=>{f(g,"h2",L?.heading?.trim()||V.title),L?.renderSpecification?L.renderSpecification(g):f(g,"p",V.description).className="data-example-capability"};L?.capabilityId&&!L.hideCapability&&k();const C=w.createElement("label");C.className="data-example-picker",f(C,"span","場面");const T=w.createElement("select");T.setAttribute("aria-label","データ例の場面");for(const R of P){let M=T;if(!L?.capabilityId){const W=w.createElement("optgroup");W.label=R.title,T.append(W),M=W}for(const W of R.samples){if(L?.sampleIds&&!L.sampleIds.includes(W.id))continue;const J=w.createElement("option");J.value=W.id,J.textContent=W.name,M.append(J)}}if(T.value=h,T.onchange=()=>S(T.value),C.append(T),(!L?.hideSinglePicker||T.options.length>1)&&g.append(C),!L?.capabilityId&&!L?.hideCapability&&k(),f(g,"h3",E.name).className="data-example-scene",L?.collapseScenario&&E.when){const R=w.createElement("details");R.className="data-example-context",f(R,"summary","場面の背景"),f(R,"p",E.when).className="data-example-when",g.append(R)}else f(g,"p",E.when).className="data-example-when";f(g,"p",E.meaning).className="data-example-meaning";for(const R of E.blocks){const M=w.createElement("section");M.className="data-example-block",M.dataset.exampleCard=R.card,f(M,"h3",p.concepts[R.card].name);const W=w.createElement("div");W.className="data-example-table",W.tabIndex=0,W.setAttribute("role","region"),W.setAttribute("aria-label",p.concepts[R.card].name+"のデータ表");const J=w.createElement("table");J.setAttribute("aria-label",p.concepts[R.card].name+"のデータ例");const ee=w.createElement("caption");ee.textContent=p.concepts[R.card].name+"に入る情報",J.append(ee);const ae=w.createElement("thead"),te=w.createElement("tr");for(const Te of R.columns)f(te,"th",Te).setAttribute("scope","col");ae.append(te),J.append(ae);const le=w.createElement("tbody");for(const[Te,je]of R.rows.entries()){const he=w.createElement("tr");for(const[A,D]of je.entries()){const U=f(he,"td",String(D)),Q=R.keyIds[Te][A];Q&&(d(U,Q,O),U.title=R.columns[A]+"："+D)}le.append(he)}J.append(le),W.append(J),M.append(W),R.rows.length||f(M,"p",R.empty??"データはありません。"),g.append(M)}E.note&&(f(g,"p",E.note).className="data-example-note")}return{reviewContents:i,dataExamples:l,contentFor:s,capabilityFor:c,examplesFor:r,findDataExample:u,renderDataExample:m}}function za(e,t){const n=document.createElement("nav");n.className="right-drawer-tabs",n.setAttribute("role","tablist"),n.setAttribute("aria-label",e);for(const o of t){const i=document.createElement("button");i.type="button",i.id=o.id,i.textContent=o.label,i.setAttribute("role","tab"),i.setAttribute("aria-selected",String(o.selected)),i.tabIndex=o.selected?0:-1,i.onclick=o.select,n.append(i)}return n.onkeydown=o=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(o.key))return;const i=Array.from(n.querySelectorAll("button[role=tab]")),s=i.indexOf(o.target);if(s<0||!i.length)return;const c=o.key==="Home"?0:o.key==="End"?i.length-1:(s+(o.key==="ArrowRight"?1:-1)+i.length)%i.length;o.preventDefault();const l=i[c].id;i[c].click(),document.getElementById(l)?.focus({preventScroll:!0})},n}function Ti(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function Ua(e,t,n){return Ti(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function $a(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function En(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const c=(l,a)=>{for(const d of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(d.startsWith("**")&&d.endsWith("**")){const r=document.createElement("strong");r.textContent=d.slice(2,-2),l.append(r)}else if(d.startsWith("`")&&d.endsWith("`")){const r=document.createElement("code");r.textContent=d.slice(1,-1),l.append(r)}else l.append(document.createTextNode(d))};for(const l of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(l);if(a&&!o){o=a[1],s=void 0;const f=document.createElement("pre");i=document.createElement("code"),f.append(i),n.append(f);continue}if(a&&a[1][0]===o[0]&&a[1].length>=o.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(l+`
`));continue}if(!l.trim()){s=void 0;continue}const d=/^(#{1,6}) (.*)$/.exec(l),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(l);if(r){s||(s=document.createElement(/^\s*\d/.test(l)?"ol":"ul"),n.append(s));const f=document.createElement("li");c(f,r[1]),s.append(f);continue}s=void 0;const u=document.createElement(d?"h"+d[1].length:"p");c(u,d?d[2]:l),n.append(u)}return t&&n.querySelector("h1")?.remove(),n}const we={type:"string"},F={type:"string",minLength:1,pattern:"\\S"},z={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Yt=e=>({anyOf:[e,{type:"null"}]}),H=e=>({type:"array",items:e}),Z=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Fa=e=>({$ref:"#/$defs/"+e}),wn=H({anyOf:[Z({kind:{enum:["text"]},value:we}),Z({kind:{enum:["reference"]},targetId:z,label:we}),Z({kind:{enum:["link"]},uri:F,label:we})]}),fs=Z({id:z,name:F,scope:{type:"boolean"}}).properties,Va=Z({id:z,kind:{enum:["input","output","business-exception","object-exception"]},fromId:z,toId:z,label:F}),Ba=Z({id:z,sourceId:z,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:H(z),unresolvedTargets:H(F),summary:F,content:F}),pi=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:F,title:F,preface:we,scope:we,objects:H(Z({...fs,icon:F,information:H(F)})),activities:H(Z({...fs,why:F,when:F,who:F,where:F,procedure:F,exception:Yt(F),result:F,problem:Yt(F),painLevel:Yt({enum:["Low","Medium","High"]})})),relations:H(Va),findings:H(Ba)}),Ha=Z({id:z,name:F,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Zs=Z({...pi.properties,schemaVersion:{enum:["0.2"]},roles:H(Ha),activities:H(Z({...pi.properties.activities.items.properties,roleId:Yt(z)}))}),Ga=Z({...Zs.properties,schemaVersion:{enum:["0.3"]},exceptions:H(Z({id:z,activityId:z,name:F,description:we}))}),Ja=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,wn])),_a=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:F,title:F,basedOn:Z({documentId:z,revision:F,verification:{enum:["unverified"]}}),intro:wn,index:H(Z({activityId:z,purpose:we,connections:we,checkIds:H(z)})),sections:H(Z({id:z,activityId:Yt(z),title:F,preamble:wn})),guarantees:H(Z({id:z,sectionId:z,title:F,blocks:H({anyOf:[Z({kind:{enum:["prose"]},content:wn}),Z({kind:{enum:["example"]},exampleId:z})]})})),examples:H(Z({id:z,guaranteeId:z,columns:H(F),rows:H(H(wn))})),items:H(Z({id:z,checkId:z,title:F,detailSummary:we,sectionId:z,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:Z(Ja,[])})),notes:H(Z({id:z,title:F,content:wn}))}),qi=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:F,title:F,basedOn:Z({documentId:z,revision:F,verification:{enum:["unverified"]}}),objectId:z,states:H(Z({id:z,name:F})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:F,transitions:H(Z({id:z,sourceId:F,fromId:F,activityId:z,event:Yt(F),exception:Yt(F),condition:F,toId:F,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:F,note:F}))}),ps=Object.fromEntries(Object.entries({...qi.properties.transitions.items.properties,exceptionId:Yt(z)}).filter(([e])=>e!=="exception")),Ka=Z({...qi.properties,schemaVersion:{enum:["0.2"]},transitions:H(Z({...ps,conditionLabel:F},Object.keys(ps)))}),Wi=Z({documentId:z,revision:F,targetType:F,targetId:z,section:F}),Xa=Z({id:z,name:F,responsibilityStatus:F,responsibleSubsystemId:z},["id","name"]),Za=Z({id:z,name:F,subsystemId:z,information:H(Xa),reason:we,description:we,businessObjectIds:H(z),activityLinks:H(Z({activityId:z,uses:H(F)})),sourceRefs:H(Wi),reviewState:F}),Ya=Z({id:z,fromConceptId:z,toConceptId:z,fromPerTarget:F,toPerSource:F,condition:we,reviewState:F,sourceRefs:H(Wi),fromLabel:F,toLabel:F,kind:{enum:["down","reference"]}}),Qa=Z({id:z,name:F,purpose:we,information:H(F),reason:we,activityIds:H(z),reviewState:F}),ec=Z({id:z,fromSubsystemId:z,toSubsystemId:z,information:F,description:we,activityIds:H(z),flowDirection:{enum:["forward","return"]},reviewState:F}),tc=Z({columnId:z,value:{anyOf:[we,{type:"number"}]},linkId:F},["columnId","value"]),nc=Z({card:z,columns:H(Z({id:z,name:F,informationId:z})),rows:H(Z({id:z,cells:H(tc)})),empty:we},["card","columns","rows"]),mi=Z({id:z,name:F,when:we,meaning:we,blocks:H(nc),note:we},["id","name","when","meaning","blocks"]),hi=Z({id:z,title:F,description:we,meta:{},samples:H(mi)}),oc=Z({...mi.properties,checkIds:{...H(z),minItems:1,uniqueItems:!0}},[...mi.required,"checkIds"]),ic=Z({decisionExampleIds:H(z),decisionCheckIds:H(z),resultCheckIds:H(z),sampleIds:H(z)}),sc=Z({...hi.properties,samples:H(oc),testSpecification:ic},[...Object.keys(hi.properties)]),rc=Z({id:z,title:F,description:we,reason:we,meta:{}}),ac=Z({conceptId:z,name:F,fields:H(F),description:we,sources:H(F),sourceActivityIds:H(z)}),cc=Z({id:z,fromConceptId:z,toConceptId:z,relationIds:H(z),scope:we,fromLabel:F,toLabel:F,kind:{enum:["down","reference"]}}),dc=Z({id:z,conceptId:z,subsystemId:z,name:F,description:we,sources:H(F),fields:H(Z({name:F,informationId:z}))}),lc=Z({id:z,fromViewId:z,toViewId:z,relationIds:H(z),fromLabel:F,toLabel:F,kind:{enum:["down","reference"]}}),Ys=Z({nodes:H(dc),edges:H(lc),handoffIds:H(z)}),Qs=Z({id:z,subsystemId:z,title:F,description:we,reviewer:Z({roleId:z}),relatedActivityIds:H(z),graph:Z({conceptIds:H(z),nodes:H(ac),edges:H(cc),subsystemViews:Ys},["conceptIds","nodes","edges"]),structureStatements:H(Z({id:z,title:F,description:we,sampleIds:H(z),sourceRefs:H(Wi)})),capabilities:H(hi),limitations:H(rc),meta:Z({questions:H(F),hypotheses:{}},["questions"])}),uc=Z({...Qs.properties,capabilities:H(sc)}),er=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:F,basedOn:Z({documentId:z,revision:F,verification:{enum:["unverified"]}}),relatedStates:H(Z({documentId:z,revision:F,verification:{enum:["unverified"]}})),subsystems:H(Qa),concepts:H(Za),relations:H(Ya),handoffs:H(ec),reviewGroups:H(Qs),benefits:H(F),considerations:H(F),reviewPoints:H(F),meta:{},presentation:Z({activityViews:{},creatorActivityIds:{},sampleCaption:we,subsystemViews:Ys,landscapeRelationships:H(Z({from:z,to:z})),reviewBoundaries:H(Z({from:z,to:z,label:we,promise:we}))},["landscapeRelationships","reviewBoundaries"])}),fc=Z({...er.properties,schemaVersion:{enum:["0.2"]},reviewGroups:H(uc)}),co=(e,t)=>Z({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:F,documents:H({anyOf:t.map(Fa)}),sources:H(Z({documentId:z,revision:F,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:we})),externalDocuments:H(Z({id:z,kind:{enum:["businessDesign"]},revision:F,activities:H(Z({id:z,name:F}))})),diagnostics:H(F)}),ms={anyOf:[co("0.1",["businessDesign","checkItems"]),co("0.2",["businessDesign","checkItems","stateTransition"]),co("0.3",["businessDesignRoles","checkItems","stateTransition"]),co("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:pi,businessDesignRoles:Zs,businessDesignStructured:Ga,checkItems:_a,stateTransition:qi,stateTransitionStructured:Ka,conceptModel:er,checkedConceptModel:fc}},q=(e,t)=>{if(!e)throw Error(t)};function tr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const c=e[t++];if(c==='"')return JSON.parse(e.slice(s,t));c==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{q(s<=64,"JSON depth limit"),n();const c=e[t];if(c==='"'){o();return}if(c==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),q(e[t]==='"',"JSON object key required");const d=o();q(!a.has(d),"Duplicate JSON key: "+d),a.add(d),n(),q(e[t++]===":","JSON colon required"),i(s+1),n();const r=e[t++];if(r==="}")return;q(r===",","JSON comma required")}throw Error("Truncated object")}if(c==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const a=e[t++];if(a==="]")return;q(a===",","JSON array comma required")}throw Error("Truncated array")}const l=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;q(t>l,"JSON value required"),JSON.parse(e.slice(l,t))};return i(),n(),q(t===e.length,"Trailing JSON content"),JSON.parse(e)}function kn(e,t=ms,n="$"){if(t.$ref)return kn(e,ms.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{kn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&q(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;q(o===t.type,"Invalid type at "+n)}if(t.minLength&&q(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&q(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])q(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))q(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),kn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>kn(o,t.items,n+"["+i+"]"))}function pc(e){const t=new Map,n=new Map,o=new Map,i=(s,c,l)=>{q(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,c.id),o.set(s.id,l)};for(const s of e.documents){i(s,s,"document");for(const[c,l]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const a of s[c]??[])i(a,s,l)}for(const s of e.externalDocuments){i(s,s,"document");for(const c of s.activities)i(c,s,"activity")}return{map:t,owner:n,types:o}}function bi(e){return kn(e),nr(e)}function Vn(e,t){const n=new Set(e.items.map(c=>c.id)),o=new Set,i=e.guarantees.find(c=>c.id===t.guaranteeId),s=c=>{if(Array.isArray(c)){for(const l of c)s(l);return}if(c&&typeof c=="object"){c.kind==="reference"&&n.has(c.targetId)&&o.add(c.targetId);for(const l of Object.values(c))l&&typeof l=="object"&&s(l)}};s(t.rows);for(const c of i?.blocks??[])c.kind==="prose"&&s(c.content);for(const c of e.items)(c.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&o.add(c.id);return[...o]}function nr(e,{allowUnresolvedFindings:t=!1}={}){q(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=pc(e),s=[...e.diagnostics],c=new Set;for(const f of e.sources)if(f.uri){const m=new URL(f.uri);q(m.protocol==="https:"&&!m.username&&!m.password,"Unsafe source URI")}const l=(f,m,g)=>(q(n.has(f),"Dangling reference: "+f),m&&q(i.get(f)===m,"Reference type mismatch: "+f),g&&q(o.get(f)===g,"Cross-document mismatch: "+f),n.get(f)),a=f=>f?.some(m=>m.kind==="text"?m.value.trim().length>0:!0),d=(f,m)=>{for(const g of f)if(g.kind==="reference"&&(l(g.targetId,null,m),q(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const p=new URL(g.uri);q(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const f of e.documents)if(q(e.formatVersion!=="0.1"||f.kind!=="stateTransition","State documents require formatVersion 0.2"),f.kind==="businessDesign"){q(f.activities.length>0,"Activity required");const m=[...f.objects,...f.activities].map(h=>h.name);q(new Set(m).size===m.length,"Duplicate visible name"),q(m.every(h=>h===h.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(S=>h.includes(S))),"Invalid Graph-visible name");for(const h of f.objects)q(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h.icon),"Invalid icon");if(["0.2","0.3"].includes(f.schemaVersion)){q(new Set(f.roles.map(h=>h.name)).size===f.roles.length,"Duplicate Role name"),q(f.roles.every(h=>h.name===h.name.trim()&&!/[\r\n]/.test(h.name)),"Invalid Role name");for(const h of f.activities)h.roleId!==null?l(h.roleId,"role",f.id):c.add("Role未確定: "+h.id+" — "+h.who)}for(const h of f.activities)q(h.problem===null==(h.painLevel===null),"Problem/Pain pair mismatch");for(const h of f.exceptions??[])l(h.activityId,"activity",f.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const h of f.relations){l(h.fromId,g[h.kind][0],f.id),l(h.toId,g[h.kind][1],f.id);const S=JSON.stringify([h.kind,h.fromId,h.toId,h.label]);q(!p.has(S),"Duplicate relation"),p.add(S)}q(new Set(f.findings.map(h=>h.sourceId)).size===f.findings.length,"Duplicate Finding source ID");for(const h of f.findings){q(h.scope==="items"?h.targetIds.length+h.unresolvedTargets.length>0:!h.targetIds.length&&!h.unresolvedTargets.length,"Finding scope mismatch"),q(new Set(h.targetIds).size===h.targetIds.length,"Duplicate Finding target");for(const S of h.targetIds)l(S,null,f.id),q(["object","activity"].includes(i.get(S)),"Invalid Finding target");h.unresolvedTargets.length&&(q(t,"Unresolved Finding target: "+h.sourceId),s.push("Finding参照未決: "+h.sourceId))}}else if(f.kind==="stateTransition"){const m=l(f.basedOn.documentId,"document");q(m.kind==="businessDesign"&&m.objects,"State source must be an in-package BD"),q(m.revision===f.basedOn.revision,"Stale State source revision"),l(f.objectId,"object",m.id),q(!e.documents.some(p=>p!==f&&p.kind==="stateTransition"&&p.objectId===f.objectId),"Duplicate Object state declaration"),q(f.states.length>0&&new Set(f.states.map(p=>p.name)).size===f.states.length,"Duplicate/empty state names"),q(f.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),q(f.transitions.length<=1e3,"State transition row budget"),q(new Set(f.transitions.map(p=>p.sourceId)).size===f.transitions.length,"Duplicate transition source ID");const g=new Map;for(const p of f.transitions){p.fromId!=="@new"&&l(p.fromId,"state",f.id),["@unknown","@none"].includes(p.toId)||l(p.toId,"state",f.id);const h=l(p.activityId,"activity",m.id),S=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(q(!g.has(S),"Duplicate state transition condition: "+g.get(S)+" / "+p.sourceId),g.set(S,p.sourceId),e.formatVersion==="0.4")if(q(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const L=l(p.exceptionId,"exception",m.id);q(L.activityId===h.id,"Exception Activity mismatch")}else p.path==="exception"&&q(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else q(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);q(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),q(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),q(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),q(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+f.id)}else if(f.kind==="conceptModel"){const m=l(f.basedOn.documentId,"document");q(m.kind==="businessDesign"&&m.revision===f.basedOn.revision,"Concept source must be the matching in-package BD revision"),q(!e.documents.some(k=>k!==f&&k.kind==="conceptModel"&&k.basedOn.documentId===m.id),"Duplicate Concept model for Business Design");const g=(k,C)=>{const T=new Map;for(const R of k)q(!T.has(R.id),"Duplicate "+C+" ID: "+R.id),T.set(R.id,R);return T},p=g(f.subsystems,"subsystem"),h=g(f.concepts,"concept"),S=g(f.relations,"concept relation"),L=g(f.reviewGroups,"review group"),w=g(f.handoffs,"handoff"),E=g(f.concepts.flatMap(k=>k.information),"concept information"),O=(k,C,T)=>(q(k.has(C),"Unknown "+T+": "+C),k.get(C)),v=k=>l(k,"activity",m.id),P=k=>{const C=l(k.documentId,"document");q(C.revision===k.revision,"Stale Concept source revision");const T=C.id===m.id,R=C.kind==="stateTransition"&&C.basedOn.documentId===m.id&&f.relatedStates.some(M=>M.documentId===C.id&&M.revision===C.revision);q(T||R,"Concept source must refer to its Business Design or a declared State"),l(k.targetId,k.targetType,C.id)};for(const k of f.relatedStates){const C=l(k.documentId,"document");q(C.kind==="stateTransition"&&C.revision===k.revision&&C.basedOn.documentId===m.id,"Invalid Concept state reference")}for(const k of f.subsystems)for(const C of k.activityIds)v(C);for(const k of f.concepts){O(p,k.subsystemId,"subsystem");for(const C of k.information)C.responsibleSubsystemId&&O(p,C.responsibleSubsystemId,"responsible subsystem");for(const C of k.businessObjectIds)l(C,"object",m.id);for(const C of k.activityLinks)v(C.activityId);for(const C of k.sourceRefs)P(C)}for(const k of f.relations){O(h,k.fromConceptId,"concept"),O(h,k.toConceptId,"concept");for(const C of k.sourceRefs)P(C)}for(const k of f.handoffs){O(p,k.fromSubsystemId,"subsystem"),O(p,k.toSubsystemId,"subsystem"),q(k.fromSubsystemId!==k.toSubsystemId,"Handoff must cross subsystem boundary");for(const C of k.activityIds)v(C)}const V=(k,C)=>{const T=g(k.nodes,"subsystem view"),R=g(k.edges,"subsystem view edge");for(const W of T.values()){O(C,W.conceptId,"view concept"),O(p,W.subsystemId,"subsystem");const J=O(h,W.conceptId,"concept");for(const ee of W.fields)q(J.information.some(ae=>ae.id===ee.informationId),"Unknown information for subsystem view: "+ee.informationId)}for(const W of R.values()){const J=O(T,W.fromViewId,"subsystem view"),ee=O(T,W.toViewId,"subsystem view");q(J.subsystemId===ee.subsystemId,"View relationship crosses subsystem boundary"),q(W.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ae=J.conceptId;for(const te of W.relationIds){const le=O(S,te,"concept relation");q(le.fromConceptId===ae,"Subsystem view relation path is disconnected: "+te),ae=le.toConceptId}q(ae===ee.conceptId,"Subsystem view relation target differs")}q(new Set(k.handoffIds).size===k.handoffIds.length,"Duplicate subsystem view handoff");const M=new Set([...T.values()].map(W=>W.subsystemId));for(const W of k.handoffIds){const J=O(w,W,"handoff");q(M.has(J.fromSubsystemId)&&M.has(J.toSubsystemId),"Missing subsystem view handoff region: "+W)}};f.presentation.subsystemViews&&V(f.presentation.subsystemViews,h);for(const k of f.reviewGroups){O(p,k.subsystemId,"subsystem"),l(k.reviewer.roleId,"role",m.id);for(const M of k.relatedActivityIds)v(M);const C=g(k.graph.nodes.map(M=>({...M,id:M.conceptId})),"view concept");q(new Set(k.graph.conceptIds).size===k.graph.conceptIds.length&&k.graph.conceptIds.length===C.size&&k.graph.conceptIds.every(M=>C.has(M)),"View concepts and nodes differ");for(const M of k.graph.nodes){O(h,M.conceptId,"concept");for(const W of M.sourceActivityIds)v(W)}g(k.graph.edges,"view edge");for(const M of k.graph.edges){O(C,M.fromConceptId,"view concept"),O(C,M.toConceptId,"view concept");for(const W of M.relationIds)O(S,W,"concept relation")}k.graph.subsystemViews&&V(k.graph.subsystemViews,C);const T=g(k.capabilities,"capability"),R=g(k.capabilities.flatMap(M=>M.samples),"sample");g(k.limitations,"limitation"),g(k.structureStatements,"structure statement");for(const M of k.structureStatements){for(const W of M.sampleIds)O(R,W,"sample");for(const W of M.sourceRefs)P(W)}for(const M of T.values())if(M.testSpecification){const W=M.testSpecification;for(const[ee,ae]of Object.entries(W))q(new Set(ae).size===ae.length,"Duplicate function specification reference: "+ee);const J=(ee,ae)=>{const te=l(ee,ae),le=l(o.get(ee),"document");return q(le.kind==="checkItems"&&le.basedOn.documentId===m.id&&le.basedOn.revision===m.revision,"Function Check source mismatch: "+ee),{value:te,doc:le}};for(const ee of[...W.decisionCheckIds,...W.resultCheckIds])J(ee,"check");for(const ee of W.decisionExampleIds){const{value:ae,doc:te}=J(ee,"example"),le=Vn(te,ae);q(le.length>0,"Function decision table needs a Check: "+ee),q(le.every(Te=>W.decisionCheckIds.includes(Te)),"Function decision table Check is not assigned: "+ee)}for(const ee of W.sampleIds){const ae=M.samples.find(te=>te.id===ee);q(ae,"Function result sample belongs to another capability: "+ee),q(ae.checkIds.some(te=>W.resultCheckIds.includes(te)),"Function result sample needs a result Check: "+ee),q(ae.checkIds.every(te=>W.resultCheckIds.includes(te)||W.decisionCheckIds.includes(te)),"Function result sample Check is not assigned: "+ee)}}for(const M of T.values())for(const W of M.samples){if(f.schemaVersion==="0.2"){q(W.checkIds.length>0,"Sample needs a Check: "+W.id),q(new Set(W.checkIds).size===W.checkIds.length,"Duplicate sample Check: "+W.id);for(const J of W.checkIds){l(J,"check");const ee=l(o.get(J),"document");q(ee.kind==="checkItems"&&ee.basedOn.documentId===m.id&&ee.basedOn.revision===m.revision,"Sample Check source mismatch: "+J)}}for(const J of W.blocks){O(C,J.card,"view concept");const ee=g(J.columns,"sample column");for(const ae of J.columns)O(E,ae.informationId,"concept information");g(J.rows,"sample row");for(const ae of J.rows){const te=new Set;for(const le of ae.cells)O(ee,le.columnId,"sample column"),q(!te.has(le.columnId),"Duplicate sample cell: "+le.columnId),te.add(le.columnId);q(te.size===ee.size,"Sample row does not match columns")}}}}for(const k of f.presentation.landscapeRelationships){const C=O(L,k.from,"review group"),T=O(L,k.to,"review group");q(C.subsystemId===T.subsystemId,"Internal relationship crosses subsystem boundary")}for(const k of f.presentation.reviewBoundaries)O(L,k.from,"review group"),O(L,k.to,"review group");s.push("概念モデルの業務意味は未確認: "+f.id)}else{const m=l(f.basedOn.documentId,"document");q(m.kind==="businessDesign","Check source is not BD"),q(m.revision===f.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+f.id),q(new Set(f.items.map(p=>p.checkId)).size===f.items.length,"Duplicate Check ID");const g=new Set;for(const p of f.index){l(p.activityId,"activity",m.id),q(!g.has(p.activityId),"Duplicate Activity index"),g.add(p.activityId),q(new Set(p.checkIds).size===p.checkIds.length,"Duplicate Check binding");for(const h of p.checkIds)l(h,"check",f.id)}q(new Set(f.sections.map(p=>p.activityId??p.title)).size===f.sections.length,"Duplicate Activity section");for(const p of f.sections)p.activityId!==null&&(l(p.activityId,"activity",m.id),q(g.has(p.activityId),"Section missing from index")),d(p.preamble,f.id);for(const p of f.guarantees){q(p.blocks.some(h=>h.kind==="prose"&&a(h.content)),"General guarantee prose required"),l(p.sectionId,"section",f.id);for(const h of p.blocks)if(h.kind==="prose")d(h.content,f.id);else{const S=l(h.exampleId,"example",f.id);q(S.guaranteeId===p.id,"Example owner mismatch")}}for(const p of f.examples){l(p.guaranteeId,"guarantee",f.id),q(p.columns.length>0,"Example columns required");for(const h of p.rows){q(h.length===p.columns.length,"Example column mismatch");for(const S of h)d(S,f.id)}}for(const p of f.items){const h=l(p.sectionId,"section",f.id);q(h.activityId===null?!f.index.some(S=>S.checkIds.includes(p.id)):f.index.some(S=>S.activityId===h.activityId&&S.checkIds.includes(p.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),q(a(p.fields.guarantee)||a(p.fields.condition)&&a(p.fields.expectedResult),"Check guarantee required");for(const S of Object.values(p.fields))d(S,f.id);q(h.activityId===null||f.index.some(S=>S.checkIds.includes(p.id)),"Unbound Check")}for(const p of f.notes)d(p.content,f.id);d(f.intro,f.id)}const r=e.diagnostics.filter(f=>f.startsWith("Role未確定:"));q(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const f of r)q(c.delete(f),"Unresolved Who requires a diagnostic matching a current unresolved Activity");q(c.size===0,"Unresolved Who requires a diagnostic");const u=new Set;for(const f of e.sources){l(f.documentId,"document");const m=f.documentId+"@"+f.revision;q(!u.has(m),"Duplicate source descriptor"),u.add(m)}for(const f of e.externalDocuments)q(e.sources.some(m=>m.documentId===f.id&&m.revision===f.revision),"External source revision missing"),q(f.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+f.id);return{diagnostics:s,entities:n.size}}const Y=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function ni(e,t,n){n!=null&&e.append(Y("h3",t),En(n))}function mc(e,t,n){if(t===null)return;const o=En(t),i=c=>String(c??"").replace(/\s+/g,""),s=new Set(n.map(c=>i(En(`**${c.name}** — ${c.description}`).textContent)));for(const c of Array.from(o.querySelectorAll("li")))s.has(i(c.textContent))&&c.remove();for(const c of Array.from(o.querySelectorAll("ul,ol")))c.children.length||c.remove();o.textContent?.trim()&&e.append(Y("h3","Exception"),o)}const hc={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function bc(e,t){const n=Y("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(l=>l.id===t),c=i.activities.find(l=>l.id===t);if(s){ni(n,"Scope",String(s.scope)),n.append(Y("h3","Information"));const l=Y("ul");for(const a of s.information)l.append(Y("li",a));n.append(l)}else if(c){const l=i.exceptions?.filter(d=>d.activityId===c.id)??[];for(const[d,r]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Exception","exception"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]])r==="exception"?mc(n,c.exception,l):ni(n,d,r==="who"?Ti(e,c.id)?.name??c.who:c[r]===null?null:String(c[r]));for(const d of l)n.append(Y("h3","Exception · "+d.name)),ni(n,"説明",d.description);const a=new Map([...i.objects,...i.activities].map(d=>[d.id,d.name]));for(const[d,r]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const u=i.relations.filter(f=>f.kind===d&&(f.fromId===t||f.toId===t));if(u.length){n.append(Y("h3",r));for(const f of u)n.append(Y("p",`${a.get(f.fromId)} → ${a.get(f.toId)} — ${f.label}`))}}}else n.append(Y("p","項目を選択すると業務内容を表示します。"));return n}class Zn{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Y("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(En(i.value));continue}if(i.kind==="text"){const a=Y("span",i.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(i.kind==="link"){t.append(Y("span",`${i.label} (${i.uri})`));continue}const s=Y("details"),c=Y("summary",i.label||i.targetId);s.append(c),t.append(s);let l=!1;s.addEventListener("toggle",()=>{if(!s.open||l)return;if(l=!0,o.has(i.targetId)){s.append(Y("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(Y("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(o).add(i.targetId),d=this.doc,r=d.guarantees.find(p=>p.id===i.targetId),u=d.examples.find(p=>p.id===i.targetId),f=d.items.find(p=>p.id===i.targetId),m=d.sections.find(p=>p.id===i.targetId),g=d.notes.find(p=>p.id===i.targetId);if(r){s.append(Y("h4",r.title));for(const p of r.blocks){if(!this.take(s))break;p.kind==="prose"?this.runs(s,p.content,a):this.example(s,p.exampleId,a)}}else if(u)this.example(s,u.id,a);else if(f){s.append(Y("p",`${f.checkId} · ${f.title}`+(this.requester?"":` · ${f.reviewState}`))),this.requester&&(f.reviewState==="要確認"||f.reviewState==="要修正")&&s.append(Y("p","確認が必要です。"));const p=this.requester?Object.fromEntries(Object.entries(f.fields).filter(([h])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(h))):f.fields;this.fields(s,p,a)}else m?(s.append(Y("h4",m.title)),this.runs(s,m.preamble,a)):g?(s.append(Y("h4",g.title)),this.runs(s,g.content,a)):i.targetId===d.id&&(s.append(Y("h4",d.title)),this.runs(s,d.intro,a))})}}fields(t,n,o,i=!1){for(const[s,c]of Object.entries(n)){if(!this.take(t))break;if(t.append(Y("h4",hc[s]??s)),s==="guarantee"&&i){const l=new Set;for(const a of c){const d=a.kind==="reference"?this.doc.guarantees.find(u=>u.id===a.targetId):void 0;if(!d){this.runs(t,[a],o);continue}if(l.has(d.id))continue;l.add(d.id);const r=new Set(o).add(d.id);for(const u of d.blocks){if(!this.take(t))break;u.kind==="prose"?this.runs(t,u.content,r):this.example(t,u.exampleId,r)}}}else this.runs(t,c,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(u=>u.id===n);if(!Vn(this.doc,s).length)return;const c=Y("table"),l=i?s.columns.indexOf("結果"):-1,a=l>0&&s.columns.at(-1)==="Check ID";if(a){const u=Y("colgroup");u.span=l,c.append(u);for(let h=l;h<s.columns.length;h++)c.append(Y("colgroup"));const f=Y("thead"),m=Y("tr"),g=Y("th","条件");g.colSpan=l,g.scope="colgroup",m.append(g);for(let h=l;h<s.columns.length;h++){const S=Y("th",s.columns[h]);S.rowSpan=2,S.scope="col",h===l?S.className="decision-result":s.columns[h]==="備考"&&(S.className="decision-notes"),m.append(S)}const p=Y("tr");for(const h of s.columns.slice(0,l)){const S=Y("th",h);S.scope="col",p.append(S)}f.append(m,p),c.append(f)}else{const u=Y("tr");for(const f of s.columns){if(!this.take(t))break;u.append(Y("th",f))}c.append(u)}const d=a?Y("tbody"):c;for(const u of s.rows){if(!this.take(t))break;const f=Y("tr");for(const[m,g]of u.entries()){if(!this.take(t))break;const p=Y("td");if(a&&m===l?p.className="decision-result":a&&s.columns[m]==="備考"&&(p.className="decision-notes"),i)for(const h of g){const S=h.kind==="reference"?this.doc.items.find(L=>L.id===h.targetId):void 0;S?p.append(Y("span",S.checkId)):this.runs(p,[h],o)}else this.runs(p,g,o);f.append(p)}d.append(f)}a&&c.append(d);const r=Y("div");r.className="json-example",r.append(c),t.append(r)}}function hs(e,t,n=e.model.checks,o=new Set,i=new Set){const s=Y("section");s.className="check-content json-checks";const c=e.model.business,l=n.filter(d=>d.basedOn.documentId===c.id);let a=!1;for(const d of l){const r=new Zn(d),u=d.index.filter(p=>p.activityId===t),f=new Set(d.index.flatMap(p=>p.checkIds)),m=(t?[...new Set(u.flatMap(p=>p.checkIds))]:d.items.filter(p=>!f.has(p.id)).map(p=>p.id)).filter(p=>!o.has(p)),g=d.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of g){(p.preamble.length||d.guarantees.some(h=>h.sectionId===p.id&&!i.has(h.id)))&&(a=!0),r.runs(s,p.preamble);for(const h of d.guarantees.filter(S=>S.sectionId===p.id&&!i.has(S.id)))r.runs(s,[{kind:"reference",targetId:h.id,label:h.title}])}for(const p of m){const h=d.items.find(w=>w.id===p);if(!h)continue;a=!0;const S=Y("section");S.className="check-item",S.dataset.checkId=h.checkId,S.dataset.elementId=h.id,S.append(Y("h3",h.checkId+" · "+h.title)),(h.reviewState==="要確認"||h.reviewState==="要修正")&&S.append(Y("p","確認が必要です。"));const L=Object.fromEntries(Object.entries(h.fields).filter(([w])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(w)));r.fields(S,L,new Set([h.id])),s.append(S)}if(!t)for(const p of d.notes)a=!0,r.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}return a||s.append(Y("p","この業務のテスト仕様はありません。")),s}function gc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const c of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new Zn(c);for(const a of c.items.filter(d=>s.has(d.id))){const d=Y("section");d.className="check-item",d.dataset.checkId=a.checkId,d.dataset.elementId=a.id,d.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&d.append(Y("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(a.fields).filter(([u])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(u)));l.fields(d,r,new Set([a.id]),!0),o.append(d)}}return o}function yc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const c of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=c.examples.find(u=>u.id===s);if(!l||!Vn(c,l).length)continue;const a=new Zn(c,!0),d=c.guarantees.find(u=>u.id===l.guaranteeId),r=Y("section");r.dataset.decisionExample=s;for(const u of d?.blocks??[])u.kind==="prose"&&a.runs(r,u.content,new Set([d.id]));a.example(r,s,new Set([s]),!0),o.append(r)}return o}function vc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const c of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new Zn(c,!0);for(const a of c.items.filter(d=>s.has(d.id))){const d=Y("section");d.className="check-item",d.dataset.checkId=a.checkId,d.dataset.elementId=a.id,d.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&d.append(Y("p","確認が必要です。")),a.fields.condition?.length&&(d.append(Y("h4","条件")),l.runs(d,a.fields.condition,new Set([a.id])));const r=Object.fromEntries(Object.entries(a.fields).filter(([u])=>["expectedResult","guarantee","question","alternatives"].includes(u)));if(Object.keys(r).length){const u=Y("details");u.append(Y("summary","期待結果")),l.fields(u,r,new Set([a.id]),!0),d.append(u)}o.append(d)}}return o}function wc(e,t,n=e.model.checks,o=new Set){const i=Y("section");i.className="check-content json-checks result-checks";const s=e.model.business,c=new Set(t);for(const l of n.filter(a=>a.basedOn.documentId===s.id&&a.basedOn.revision===s.revision)){const a=new Zn(l,!0),d=l.items.filter(r=>c.has(r.id)&&o.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);d.length&&i.append(Y("p",d.map(r=>r.checkId).join("、")));for(const r of l.items.filter(u=>c.has(u.id))){if(d.includes(r))continue;const u=Y("section");u.className="check-item",u.dataset.checkId=r.checkId,u.dataset.elementId=r.id,u.append(Y("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&u.append(Y("p","確認が必要です。"));const f=Object.fromEntries(Object.entries(r.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));a.fields(u,f,new Set([r.id]),!0);const m=Y("details"),g=Y("summary","Check の詳細");m.append(g,Y("p",r.title)),r.fields.condition?.length&&a.runs(m,r.fields.condition,new Set([r.id])),u.append(m),i.append(u)}}return i}const bs=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function kc(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),o=[],i=new Set,s=new Set,c=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),l=(r,u)=>c.some(f=>f.items.some(m=>m.id===r)&&(!u||f.index.some(m=>m.activityId===u&&m.checkIds.includes(r)))),a=(r,u,f,m)=>{const g=u.testSpecification,p=(g?.decisionCheckIds??[]).filter(v=>l(v,f)),h=(g?.resultCheckIds??[]).filter(v=>l(v,f)),S=(g?.decisionExampleIds??[]).filter(v=>c.some(P=>{const V=P.examples.find(C=>C.id===v),k=V?Vn(P,V):[];return k.length>0&&k.every(C=>l(C,f))})),L=u.samples.filter(v=>(!g||g.sampleIds.includes(v.id))&&v.checkIds?.length&&(g?v.checkIds.every(P=>l(P,f)):v.checkIds.some(P=>l(P,f)))),w=S.flatMap(v=>c.flatMap(P=>{const V=P.examples.find(k=>k.id===v);return V?Vn(P,V).filter(k=>l(k,f)):[]})),E=[...new Set([...p,...h,...w,...L.flatMap(v=>(v.checkIds??[]).filter(P=>l(P,f)))])];if(!E.length)return;const O=`fn:${f??"_"}:${r}:${u.id}`;s.has(O)||(s.add(O),o.push({key:O,activityId:f,groupId:r,capability:u,name:m,samples:L,checkIds:E,decisionCheckIds:p,resultCheckIds:h,decisionExampleIds:S}))},d=e.model.presentation.activityViews;if(Array.isArray(d)){for(const r of d)if(!(!bs(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const u of r.testSpecificationFunctions){if(!bs(u)||typeof u.groupId!="string"||typeof u.capabilityId!="string")continue;const f=e.model.reviewGroups.find(g=>g.id===u.groupId),m=f?.capabilities.find(g=>g.id===u.capabilityId);!f||!m||(i.add(JSON.stringify([f.id,m.id])),a(f.id,m,r.activityId,typeof u.name=="string"&&u.name.trim()?u.name.trim():m.title))}}for(const r of e.model.reviewGroups)for(const u of r.capabilities)i.has(JSON.stringify([r.id,u.id]))||a(r.id,u,void 0,u.title);return o}const yn=["landscape","overview"];function Ic(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const c=document.createElement("aside");c.id="design-explorer",c.setAttribute("aria-label","設計ナビゲーション"),c.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const l=document.createElement("div");l.className="shell-center",s.append(c,l),l.append(o,n);const a=document.createElement("div");a.className="shell-open-tabs",i.before(a),a.append(i),Ea(a);const d=document.createElement("nav");d.className="concept-tabs",d.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(d);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),a.append(r);const u=document.createElement("nav");u.className="spec-tabs",u.setAttribute("aria-label","開いているテスト仕様"),a.append(u);const f=document.createElement("section");f.id="concept-workspace",f.hidden=!0,f.setAttribute("aria-label","データ構造"),f.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-child-tabs" hidden></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要"></article><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',l.append(f);const m=document.createElement("section");m.id="states-workspace",m.hidden=!0,m.setAttribute("aria-label","状態遷移"),m.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',l.append(m);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',l.append(g);const p=document.createElement("section");p.id="empty-workspace",p.hidden=!0,p.innerHTML="<p>左の一覧から図を開いてください。</p>",l.append(p);const h=n.querySelector("#node-list-drawer");c.append(h);const S=e.querySelector("#node-list-toggle"),L=e.querySelector("#drawer"),w=c.querySelector("input"),E=c.querySelector("nav"),O=f.querySelector("iframe"),v=f.querySelector(".concept-related"),P=m.querySelector("article"),V="alder-explorer-v1:"+location.pathname,k=location.protocol==="file:"||location.origin==="null"?"*":location.origin,C=window.__alderConceptHtml;let T,R,M,W,J={},ee=[],ae=[...yn],te=new Map,le=new Map,Te=new Map,je=new Map;const he=b=>Te.get(b)??b,A=b=>je.get(b)??b,D=b=>R?.findGroup(te.get(b??"")),U=b=>M?.contentFor(te.get(b)??""),Q=(b,I)=>M?.findDataExample(te.get(b)??"",I),ue=b=>M?.examplesFor(te.get(b)??"")??[],Me=b=>yn.includes(b)?"全体図":U(b)?.title??D(b)?.name??J[le.get(b)??""]?.name,fe=()=>{const b=t.business(),I=b.design?.model;return I?[...I.checks,...b.relatedChecks??[]].filter(j=>j.basedOn.documentId===I.business.id):[]},ge=()=>kc(T,fe()),ie=b=>ge().find(I=>I.key===(b.startsWith("decision:")?b.slice(9):b)),Le=b=>ge().filter(I=>I.name===b.name).length>1?b.name+"（"+(t.business().activities.find(I=>I.id===b.activityId)?.name??"その他")+"）":b.name,qe=b=>fe().some(I=>I.index.some(j=>j.activityId===b)||I.sections.some(j=>j.activityId===b)),We=b=>new Set(ge().filter(I=>I.activityId===b).flatMap(I=>I.checkIds)),zt=b=>{const I=new Set(ge().filter(j=>j.activityId===b).flatMap(j=>j.decisionExampleIds));return new Set(fe().flatMap(j=>j.examples.filter(N=>I.has(N.id)).map(N=>N.guaranteeId)))},nn=b=>{const I=We(b),j=zt(b);return fe().some(N=>N.index.some(G=>G.activityId===b&&G.checkIds.some(X=>!I.has(X)))||N.sections.some(G=>G.activityId===b&&(G.preamble.length>0||N.guarantees.some(X=>X.sectionId===G.id&&!j.has(X.id)))))},on=()=>fe().some(b=>b.items.some(I=>!b.index.some(j=>j.checkIds.includes(I.id)))||b.sections.some(I=>I.activityId===null)||b.notes.length>0),Tr=b=>{const I=ie(b);return I?I.capability.testSpecification?Le(I)+"・"+(b.startsWith("decision:")?"可否":"結果"):I.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(j=>j.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(j=>j.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},to=n.querySelector("#formattedMarkdownDrawer");to&&s.append(to),s.append(v),Na(v,s,V+":drawer-width");let no=!1;const yt=t.rightDrawer??{isOpen:()=>no,setOpen:b=>{no=b}};let se="business",De=!1,Ke=[],B="overview",Xe=[],it="",st=[],Ee="@overview",pn,jt=innerWidth>800,oo=!1,io=!0,rt=!1,Pn;const vt=new Map,wt=new Map([["overview",O]]),at=new Map,mn=new Map,hn=new Map,Pe=new Map,Ut=new Map,ft=new Set,$e=new Set,sn=new Set,Ze=new Map;let ye;try{if(ye=JSON.parse(sessionStorage.getItem(V)||"null"),ye){if(rt=ye.overviewClosed===!0,Pn=typeof ye.documentKey=="string"?ye.documentKey:void 0,jt=typeof ye.left=="boolean"?ye.left:jt,Array.isArray(ye.expanded)){$e.clear();for(const b of ye.expanded)typeof b=="string"&&$e.add(b)}Xe=Array.isArray(ye.states)?ye.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof ye.rightOpen=="boolean"?no=ye.rightOpen:typeof ye.right?.["concept:"+ye.active]=="boolean"&&(no=ye.right["concept:"+ye.active]))}}catch{}function qr(){if(!(!ye||Pn!==t.business().key||!De)){for(const b of Array.isArray(ye.overviewModes)?ye.overviewModes:[])D(b)&&ft.add(b);for(const[b,I]of Object.entries(ye.lastExamples??ye.examples??{}))typeof I=="string"&&Q(b,I)&&Ut.set(b,I);for(const[b,I]of Object.entries(ye.examples??{}))typeof I=="string"&&Q(b,I)&&Pe.set(b,I);for(const[b,I]of Object.entries(ye.selected??{}))typeof I=="string"&&ee.includes(I)&&at.set(b,I);Ke=[...new Set((Array.isArray(ye.concepts)?ye.concepts:[]).filter(b=>typeof b=="string"&&ae.includes(b)))],B=Ke.includes(ye.active)?ye.active:"landscape"}}let $t;const Ve=()=>{try{sessionStorage.setItem(V,JSON.stringify({documentKey:pn,overviewClosed:rt,selected:Object.fromEntries(at),examples:Object.fromEntries(Pe),lastExamples:Object.fromEntries(Ut),overviewModes:[...ft],left:jt,expandedVersion:4,expanded:[...$e],concepts:Ke,active:B,states:Xe,specs:st,activeSpec:Ee,specExamples:Object.fromEntries(vt),...t.rightDrawer?{}:{rightOpen:yt.isOpen()}}))}catch{}},Ft=()=>{se==="concept"&&Ze.set("drawer:"+B,v.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&yt.isOpen()&&ft.has(B)&&Ze.set("review-overview:"+B,v.querySelector(".data-review-overview").scrollTop),se==="concept"&&Pe.has(B)&&Ze.set("example:"+B+":"+Pe.get(B),v.querySelector(".data-examples-panel").scrollTop),se==="states"&&it&&Ze.set("state:"+it,P.scrollTop),se==="tests"&&Ze.set("tests:"+Ee,g.querySelector(".test-spec-page").scrollTop),se==="concept"&&B==="landscape"&&Ze.set("concept:landscape",f.querySelector(".concept-review-landscape").scrollTop)};function He(b=!0){if(oo)return;const I=new URL(location.href);if(I.searchParams.set("view",se),I.searchParams.delete("concept"),I.searchParams.delete("dataExample"),I.searchParams.delete("dataView"),se==="concept"&&yt.isOpen()&&ft.has(B)?I.searchParams.set("dataView","overview"):se==="concept"&&D(B)&&!Pe.has(B)&&I.searchParams.set("dataView","structure"),se==="concept"&&yt.isOpen()&&Pe.has(B)&&I.searchParams.set("dataExample",Pe.get(B)),se==="tests"&&vt.has(Ee)&&I.searchParams.set("dataExample",vt.get(Ee)),I.searchParams.delete("state"),I.searchParams.delete("activity"),I.searchParams.delete("object"),I.searchParams.delete("spec"),se==="concept"&&I.searchParams.set("concept",B),se==="states"&&it&&I.searchParams.set("state",it),se==="tests"&&I.searchParams.set("spec",Ee),se==="business"){const j=t.business(),N=j.views?.find(G=>G.key===j.viewKey);N?.activity?I.searchParams.set("activity",N.activity):N?.object&&I.searchParams.set("object",N.object)}I.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",I)}function Ce(b,I,j){const N=document.createElement(I);return N.textContent=j,b.append(N),N}function ct(b){b!==se&&(se==="business"?t.capture():Ft(),se=b),n.hidden=se!=="business",f.hidden=se!=="concept",m.hidden=se!=="states",g.hidden=se!=="tests",p.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),kt(),dt()}function rn(b,I=!0){De&&(b==="subsystems"&&(b="landscape"),ae.includes(b)&&(Ft(),Ke.includes(b)||Ke.push(b),B=b,ct("concept"),Yo(),pt(),Ve(),I&&He()))}function Wr(){Ft(),Pe.delete(B),ft.add(B),Yo(),Ve(),He()}function _o(b,I=!0){b&&!Q(B,b)||(Ft(),ft.delete(B),b?(Pe.set(B,b),Ut.set(B,b)):Pe.delete(B),yt.setOpen(!0),Yo(),Ve(),He(),I&&v.querySelector(".data-example-picker select")?.focus({preventScroll:!0}))}function Tn(b,I=!0){t.business().states?.some(j=>j.id===b)&&(Ft(),Xe.includes(b)||Xe.push(b),it=b,ct("states"),Br(),pt(),Ve(),I&&He())}function Ko(b){return b.startsWith("decision:")&&ie(b)&&!ie(b)?.capability.testSpecification?ie(b).key:ie(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&qe(b.slice(7))||b.startsWith("remaining:")&&nn(b.slice(10))?b:t.business().activities.some(I=>I.id===b)?ge().find(I=>I.activityId===b)?.key??(qe(b)?"checks:"+b:"@overview"):"@overview"}function an(b,I=!0){const j=t.business();if(!j.design?.model||!j.key)return;b=Ko(b),se==="tests"&&b!==Ee&&Ft(),st.includes(b)||st.push(b),Ee=b;const N=ie(b);oo||(N?.capability.testSpecification?$e.add("tests-function-"+N.key):N?.activityId?$e.add("tests-activity-"+N.activityId):b.startsWith("checks:")?$e.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?$e.add("tests-activity-"+b.slice(10)):N&&$e.add("tests-other")),ct("tests"),Xo(),pt(),dt(),Ve(),I&&He()}function Xo(){const b=t.business().design;if(!b?.model)return;const I=g.querySelector(".test-spec-page"),j=ie(Ee);if(j){const N=document.createElement("section");N.className="test-spec-sample";const G=R?.findGroup(j.groupId),X=j.samples.find(de=>de.id===vt.get(Ee))??j.samples[0],_=!!j.capability.testSpecification,re=Ee.startsWith("decision:");if(_)if(Ce(N,"h2",j.name),Ce(N,"h3",re?"可否判定":"処理結果"),re)j.decisionExampleIds.length?N.append(yc(b,j.decisionExampleIds,fe())):j.decisionCheckIds.length?N.append(vc(b,j.decisionCheckIds,fe())):Ce(N,"p","可否条件の記載はありません。");else{const de=G&&X&&M?new Set(j.samples.flatMap(Se=>Se.checkIds??[])):new Set;if(N.append(wc(b,j.resultCheckIds,fe(),de)),G&&X&&M){Ce(N,"h3","データ例");const Se=(X.checkIds??[]).filter(Oe=>j.decisionCheckIds.includes(Oe)&&!j.resultCheckIds.includes(Oe));if(Se.length){const Oe=document.createElement("p");Oe.className="data-example-decision-links",Ce(Oe,"span","関連する可否条件：");for(const Vt of Se){const nt=fe().flatMap(gn=>gn.items).find(gn=>gn.id===Vt);if(!nt)continue;const Bt=document.createElement("button");Bt.type="button",Bt.textContent=nt.checkId,Bt.setAttribute("aria-label",nt.checkId+" の可否条件を開く"),Bt.onclick=()=>an("decision:"+j.key),Oe.append(Bt)}N.append(Oe)}const Re=document.createElement("div");Re.className="data-examples-panel test-spec-examples",N.append(Re),M.renderDataExample(Re,G,X.id,Oe=>{Ze.set("tests:"+Ee,I.scrollTop),vt.set(Ee,Oe),Xo(),Ve(),He(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:j.capability.id,sampleIds:j.samples.map(Oe=>Oe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(G&&X&&M){const de=document.createElement("div");de.className="data-examples-panel test-spec-examples",N.append(de),M.renderDataExample(de,G,X.id,Se=>{Ze.set("tests:"+Ee,I.scrollTop),vt.set(Ee,Se),Xo(),Ve(),He(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:j.capability.id,heading:j.name,sampleIds:j.samples.map(Se=>Se.id),renderSpecification:Se=>Se.append(gc(b,X.checkIds??[],fe()))})}I.replaceChildren(N)}else if(Ee==="@overview")I.replaceChildren(),Ce(I,"p","左のメニューからテスト仕様を選択してください。");else if(Ee.startsWith("remaining:")){const N=Ee.slice(10);I.replaceChildren(hs(b,N,fe(),We(N),zt(N)))}else I.replaceChildren(hs(b,Ee.startsWith("checks:")?Ee.slice(7):void 0,fe()));I.scrollTop=Ze.get("tests:"+Ee)??0}function so(b){b||(rt=!1),ct("business"),b?t.openActivity(b):(rt=!1,t.openOverview()),dt(),pt(),He()}function zr(b){ct("business"),t.openObject(b),dt(),pt(),He()}function Ur(b,I){Ce(b,"h3",D(B)?"関連する業務":"作成する業務");const j=t.business(),N=D(B),G=T?.model.concepts.find(_=>_.id===I),X=N?.concepts[I]?.sourceActivities??N?.activities??G?.activityLinks.filter(_=>_.uses.includes("生成")).map(_=>_.activityId)??[];for(const _ of X){const re=j.activities.find(Se=>Se.id===_);if(!re)continue;const de=document.createElement("button");de.className="shell-evidence",Ce(de,"span",re.name),de.append(gt(An,{"aria-hidden":"true","stroke-width":1.8,"data-icon":"square-arrow-out-up-right"})),de.title=re.name+"を業務タブで開く",de.setAttribute("aria-label",de.title),de.onclick=()=>so(re.id),b.append(de)}}function Zo(b){const I=D(b);return I?R?.graph(I.id):b==="overview"?R?.overviewGraph():void 0}function is(b){const I=mn.get(B),j=I?Zo(B)?.tables[I]:void 0;return j?.conceptId===b?j:void 0}function $r(b,I){const j=is(I)??D(B)?.concepts[I]??{...J[I],sources:void 0};b.replaceChildren(),Ce(b,"p",j.note),Ce(b,"h3","持つ情報");const N=document.createElement("ul");for(const[,G]of j.fields)Ce(N,"li",G);if(b.append(N),j.sources?.length){Ce(b,"h3","情報の出所・対象時点");const G=document.createElement("ul");for(const X of j.sources)Ce(G,"li",X);b.append(G)}Ur(b,I)}function ro(){const b=v.querySelector(".concept-related-content");v.querySelector(".concept-selection").hidden=!!D(B)&&!at.has(B)&&!hn.has(B),v.querySelector(".concept-selection>h2").hidden=!D(B);const I=hn.get(B);if(I&&W){const X=W.describe(b,{kind:"group",id:I});v.querySelector(".shell-heading strong").textContent=X,v.setAttribute("aria-label",X);return}if(B==="landscape"&&$t){const X=$t.selection();b.replaceChildren();let _="サブシステムの情報";if(X?.kind==="group"||X?.kind==="connection"){_=W.describe(b,X);const re=W.activities(X);if(re.length){Ce(b,"h3","関連業務");for(const de of re){const Se=t.business().activities.find(Oe=>Oe.id===de.id&&Oe.name===de.name),Re=document.createElement("button");Re.type="button",Re.className="shell-evidence",Ce(Re,"span",de.name),Re.append(gt(An,{"aria-hidden":"true","stroke-width":1.8})),Re.setAttribute("aria-label",de.name+"を業務タブで開く"),Re.disabled=!Se,Re.onclick=()=>{Se&&so(Se.id)},b.append(Re)}}}else if(X?.kind==="model"){const re=U(he(X.id));re&&(_=re.title,Ce(b,"h3","レビュアー"),Ce(b,"p",re.reviewer.role))}else Ce(b,"p","サブシステムや概念モデル、受渡しを選ぶと情報を確認できます。");for(const[re,de]of W.sections){const Se=document.createElement("details"),Re=document.createElement("summary"),Oe=document.createElement("ul");Re.textContent=re;for(const Vt of de)Ce(Oe,"li",Vt);Se.append(Re,Oe),b.append(Se)}v.querySelector(".shell-heading strong").textContent=_,v.setAttribute("aria-label",_);return}const j=at.get(B),N=D(B),G=De&&j?is(j)?.name??N?.concepts[j]?.name??J[j].name:N?.name??"データ構造の情報";v.querySelector(".shell-heading strong").textContent=G,v.setAttribute("aria-label",G),De&&j?$r(b,j):(b.replaceChildren(),N||Ce(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function ss(b){b.onload=()=>{rs(),b.contentDocument&&(ls(b.contentDocument),us(b.contentDocument));const I=b.dataset.conceptView??"overview";if(!R||!T)return;const j=D(I),N=j?R.graph(j.id):I==="overview"?R.overviewGraph():{ids:ee,edges:R.edges,tables:J};b.contentWindow?.postMessage({type:"alder-concept-data",graph:N,focus:le.get(I),viewKey:I,documentKey:pn??T.model.id},k);const G=at.get(I);G&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:G},k)}}ss(O),O.dataset.conceptView="overview";function Fr(){v.querySelector(".concept-page-details").hidden=!0,v.querySelector(".concept-child-tabs").hidden=!0;const b=v.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const I=v.querySelector(".data-examples-panel");I.hidden=!0,I.replaceChildren(),delete I.dataset.dataExample,$t?.root.remove(),$t=void 0;for(const[j,N]of wt)j!=="overview"&&(N.remove(),wt.delete(j));O.removeAttribute("src"),O.removeAttribute("srcdoc"),at.clear(),mn.clear(),hn.clear()}function Yo(){f.setAttribute("aria-label",B==="landscape"||D(B)?"サブシステム":"データ構造"),f.querySelector(".concept-empty").hidden=De;const b=f.querySelector(".concept-review-landscape"),I=D(B),j=v.querySelector(".concept-page-details"),N=v.querySelector(".data-review-overview"),G=v.querySelector(".data-examples-panel"),X=v.querySelector(".concept-child-tabs");if(j.hidden=!De||!I,X.hidden=!De||!I||ue(B).length===0,N.hidden=!De||!I||Pe.has(B),G.hidden=!De||!I||!Pe.has(B),De&&I){Ra(N,I,M,de=>_o(de),de=>so(de),t.business().activities);const re=Pe.get(B)??Ut.get(B)??ue(B)[0]?.id;re?X.replaceChildren(za("概念モデルの補足",[{id:"concept-drawer-overview",label:"概要",selected:!Pe.has(B),select:Wr},{id:"concept-drawer-examples",label:"データ例",selected:Pe.has(B),select:()=>_o(re,!1)}])):X.replaceChildren(),re&&M.renderDataExample(G,I,re,de=>_o(de)),N.scrollTop=Ze.get("review-overview:"+B)??0,G.scrollTop=Ze.get("example:"+B+":"+re)??0}if(b.hidden=!De||!yn.includes(B),De&&yn.includes(B)&&(B==="landscape"&&!$t&&($t=Ta(document,T,pn??T.model.id,re=>rn(he(re)),()=>{ro(),kt()})),La(b,$t?.root,B==="overview"?"graph":"overview"),B==="landscape"&&$t?.restore()),De&&B!=="landscape"&&!wt.has(B)){const re=document.createElement("iframe");re.className="concept-frame",re.dataset.conceptView=B,re.title=I?I.name+"のデータ構造":J[le.get(B)].name+"と隣接する概念",re.hidden=!0,wt.set(B,re);const de=le.get(B);de&&at.set(B,at.get(B)??de),ss(re),f.querySelector(".concept-main").append(re)}for(const[re,de]of wt)de.hidden=!De||re!==B,De&&re===B&&!de.hasAttribute("src")&&!de.hasAttribute("srcdoc")&&(C?de.srcdoc=C:de.src=new URL("concept.html?view=overview"+(D(re)?"&group="+encodeURIComponent(D(re).id):re==="overview"?"":"&focus="+encodeURIComponent(le.get(re))),document.baseURI).href);const _=at.get(B);_&&wt.get(B)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:_},k),ro(),kt(),v.querySelector(".concept-drawer-body").scrollTop=Ze.get("drawer:"+B)??0}function bn(){const b=t.business(),I=b.views?.find(j=>j.activity!==void 0||j.object!==void 0||!rt);I?(ct("business"),t.activateView(I.key)):Ke.length?rn(Ke.at(-1),!1):Xe.length?Tn(Xe.at(-1),!1):st.length?an(st.at(-1),!1):ct("empty")}function Vr(){if(rt=!0,se==="business"){const b=t.business().views?.find(I=>I.key===t.business().viewKey);!b?.activity&&!b?.object&&bn()}pt(),dt(),Ve(),He(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function Br(){P.replaceChildren();const b=t.business().states?.find(j=>j.id===it);if(!b)return;const I=t.statePanel(b.id);I?P.append(I):Ce(P,"p","この対象の状態遷移は未定義です。"),P.scrollTop=Ze.get("state:"+it)??0}let Qo="";function pt(){for(const N of Array.from(i.querySelectorAll(".tab"))){const G=t.business().views?.find(_=>_.key===N.dataset.key);N.hidden=rt&&G?.activity===void 0&&G?.object===void 0;const X=!N.hidden&&se==="business"&&N.dataset.key===t.business().viewKey;N.classList.toggle("active",X),N.querySelector("button")?.setAttribute("aria-current",String(X))}const b=(N,G,X)=>{N.replaceChildren();for(const _ of G){const re=X==="concept"?Me(_):t.business().states?.find(nt=>nt.id===_)?.name??_,de=se===X&&_===(X==="concept"?B:it),Se=document.createElement("div");Se.className="tab"+(de?" active":"");const Re=X==="concept"&&(_==="landscape"||D(_))?"subsystems":X;Se.dataset.viewKind=Re;const Oe=document.createElement("button");Oe.id=(X==="concept"?"concept-tab-":"state-tab-")+_,ui(Oe,Re,re),Oe.setAttribute("aria-current",String(de)),Oe.onclick=()=>X==="concept"?rn(_):Tn(_),Se.append(Oe);const Vt=fi((Re==="subsystems"?"サブシステム：":X==="concept"?"データ構造：":"状態遷移：")+re+"のタブを閉じる");Vt.onclick=()=>{Ft(),X==="concept"?(Ke=Ke.filter(nt=>nt!==_),_!=="overview"&&(wt.get(_)?.remove(),wt.delete(_)),at.delete(_),mn.delete(_),hn.delete(_),Pe.delete(_),Ut.delete(_),ft.delete(_),se===X&&B===_&&(Ke.length?rn(Ke.at(-1),!1):bn())):(Xe=Xe.filter(nt=>nt!==_),se===X&&it===_&&(Xe.length?Tn(Xe.at(-1),!1):bn())),pt(),dt(),Ve(),He(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Se.append(Vt),N.append(Se)}};b(d,Ke,"concept"),b(r,Xe,"states"),u.replaceChildren();for(const N of st){const G=Tr(N),X=document.createElement("div");X.className="tab"+(se==="tests"&&N===Ee?" active":""),X.dataset.viewKind="tests";const _=document.createElement("button");_.id="spec-tab-"+N,ui(_,"tests",G),_.setAttribute("aria-current",String(se==="tests"&&N===Ee)),_.onclick=()=>an(N);const re=fi("テスト仕様："+G+"のタブを閉じる");re.onclick=()=>{st=st.filter(de=>de!==N),se==="tests"&&Ee===N&&(st.length?an(st.at(-1),!1):bn()),pt(),dt(),Ve(),He()},X.append(_,re),u.append(X)}const I=a.querySelector(".tab.active:not([hidden])"),j=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+B:se==="states"?"states:"+it:se==="tests"?"tests:"+Ee:"";I?(j!==Qo&&Oa(a,I),Qo=j):Qo=""}function Hr(){innerWidth<=800&&ao(!1)}function dt(){const b=E.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,I=E.scrollTop,j=t.business(),N=w.value.trim().toLocaleLowerCase();E.replaceChildren();const G=($,Ie,Ye)=>({kind:"item",id:$,name:Ie,key:Ye}),X=($,Ie,Ye)=>({kind:"group",id:$,name:Ie,children:Ye}),_=ge(),re=$=>G($.key,$.name,"tests:"+$.key),de=_.filter($=>$.capability.testSpecification),Se=_.filter($=>!$.capability.testSpecification),Re=de.map($=>X("tests-function-"+$.key,Le($),[G("decision:"+$.key,"可否判定","tests:decision:"+$.key),G($.key,"処理結果","tests:"+$.key)]));for(const $ of j.activities){const Ie=Se.filter(_e=>_e.activityId===$.id).map(re),Ye=(We($.id).size?"remaining:":"checks:")+$.id;nn($.id)&&Ie.push(G(Ye,"その他","tests:"+Ye)),Ie.length&&Re.push(X("tests-activity-"+$.id,$.name,Ie))}const Oe=Se.filter($=>!$.activityId);Oe.length&&Re.push(X("tests-other","その他",Oe.map(re))),on()&&Re.push(G("@unassigned","未割当","tests:@unassigned"));const Vt=[{id:"business",label:"業務設計",items:[G("overview","全体図","business:overview"),X("business-activity","Activity",j.activities.map($=>G($.id,$.name,"business:"+$.id))),X("business-object","Object",(j.objects??[]).map($=>G($.id,$.name,"object:"+$.id)))]},{id:"states",label:"状態遷移",items:(j.states??[]).map($=>G($.id,$.name,"states:"+$.id))},{id:"subsystems",label:"サブシステム",items:T?.model.subsystems.length?[G("landscape","全体図","concept:landscape"),...T.model.subsystems.map($=>X("subsystem-"+$.id,$.name.replace(/サブシステム$/,""),T.model.reviewGroups.filter(Ie=>Ie.subsystemId===$.id).map(Ie=>G(he(Ie.id),Ie.title,"concept:"+he(Ie.id)))))]:[]},{id:"concept",label:"データ構造",items:De&&ee.length?[G("overview","全体図","concept:overview"),X("concept-relations","概念",ee.map($=>G(A($),J[$].name,"concept:"+A($))))]:[]},{id:"tests",label:"テスト仕様",items:j.design?.model&&(_.length||fe().length)?Re:[]}];let nt=0;const Bt=($,Ie,Ye)=>{const _e=document.createElement("button");_e.className="explorer-item"+(Ye?" explorer-item-nested":""),_e.dataset.explorerKey=$.key,_e.textContent=$.name;const Be=j.views?.find(ze=>ze.key===j.viewKey);return se===(Ie.id==="subsystems"?"concept":Ie.id)&&(["concept","subsystems"].includes(Ie.id)?$.id===B:Ie.id==="states"?$.id===it:Ie.id==="tests"?$.id===Ee:$.key.startsWith("object:")?Be?.object===$.id:$.id==="overview"?!rt&&Be?.activity===void 0&&Be?.object===void 0:Be?.activity===$.id)&&_e.setAttribute("aria-current","page"),_e.disabled=Ie.id==="business"&&!j.key,_e.onclick=()=>{h.hidden||t.closeLegacyList(),Ie.id==="business"?$.key.startsWith("object:")?zr($.id):so($.id==="overview"?void 0:$.id):Ie.id==="concept"||Ie.id==="subsystems"?rn($.id):Ie.id==="tests"?an($.id):Tn($.id),Hr()},_e},gn=($,Ie,Ye,_e=!1)=>{const Be=document.createElement("button"),It=N?!sn.has($):$e.has($);return Be.className=(Ye?"explorer-subparent":"explorer-parent")+(_e?" explorer-pending":""),Be.dataset.explorerKey="group:"+$,Ce(Be,"span",Ie).className="explorer-parent-label",_e?(Be.disabled=!0,Be):(Be.setAttribute("aria-expanded",String(It)),Be.setAttribute("aria-controls","explorer-"+$),Be.append(Aa(It)),Be.onclick=()=>{N?sn.has($)?sn.delete($):sn.add($):($e.has($)?$e.delete($):$e.add($),Ve()),dt()},Be)};for(const $ of Vt){const Ie=$.items.flatMap(ze=>{if(ze.kind==="item")return!N||($.label+" "+ze.name).toLocaleLowerCase().includes(N)?[ze]:[];const Ht=N?ze.children.filter(ti=>($.label+" "+ze.name+" "+ti.name).toLocaleLowerCase().includes(N)):ze.children;return!N||Ht.length?[{...ze,children:Ht}]:[]});if(N&&!Ie.length)continue;const Ye=$.id!=="business"&&!$.items.length,_e=document.createElement("section"),Be=gn($.id,$.label,!1,Ye),It=document.createElement("div");It.id="explorer-"+$.id,It.hidden=Ye||(N?sn.has($.id):!$e.has($.id));for(const ze of Ie){if(ze.kind==="item"){It.append(Bt(ze,$,0)),nt++;continue}const Ht=document.createElement("div");Ht.id="explorer-"+ze.id,Ht.hidden=N?sn.has(ze.id):!$e.has(ze.id),It.append(gn(ze.id,ze.name,!0),Ht);for(const ti of ze.children)Ht.append(Bt(ti,$,1)),nt++;!ze.children.length&&!N&&(Ce(Ht,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ie.length&&!Ye&&(Ce(It,"p","項目がありません。").className="explorer-empty"),_e.append(Be,It),E.append(_e)}N&&!nt&&(Ce(E,"p","該当する項目はありません。").className="explorer-empty"),E.scrollTop=I,b&&Array.from(E.querySelectorAll("[data-explorer-key]")).find($=>$.dataset.explorerKey===b)?.focus({preventScroll:!0})}function ao(b){jt=b,kt(),Ve(),(b?c.querySelector(".shell-heading button"):S).focus({preventScroll:!0})}S.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),ao(!jt)},!0),c.querySelector(".shell-heading button").onclick=()=>ao(!1),w.oninput=()=>{sn.clear(),dt()},c.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&h.hidden&&(b.preventDefault(),b.stopPropagation(),ao(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&E.contains(document.activeElement)){const I=Array.from(E.querySelectorAll("button")).filter(G=>!G.disabled&&!G.closest("[hidden]")),j=I.indexOf(document.activeElement),N=I[j+(b.key==="ArrowDown"?1:-1)];N&&(b.preventDefault(),N.focus())}}),L.addEventListener("click",b=>{se!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),se==="concept"&&(yt.setOpen(!yt.isOpen()),kt(),Ve(),He(!1)))},!0),v.querySelector(".shell-heading button").onclick=()=>{yt.setOpen(!1),kt(),Ve(),He(!1),L.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const I=Array.from(wt).find(([,N])=>b.source===N.contentWindow);if(!I)return;if(b.data?.type==="alder-concept-rendered"){I[1].contentDocument&&(ls(I[1].contentDocument),us(I[1].contentDocument));return}if(se!=="concept"||I[0]!==B)return;const j=D(B);if(b.data?.type==="alder-concept-subsystem"){if(!Zo(B)?.regions.some(N=>N.id===b.data.id))return;at.delete(B),mn.delete(B),hn.set(B,b.data.id),ro(),kt(),Ve();return}if(!(!ee.includes(b.data?.id)||j&&!j.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){rn(A(b.data.id));return}b.data.type==="alder-concept-select"&&(hn.delete(B),at.set(B,b.data.id),(typeof b.data.viewId=="string"?Zo(B)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?mn.set(B,b.data.viewId):mn.delete(B),innerWidth<=800&&(jt=!1),ro(),kt(),Ve())}});function rs(){const b=getComputedStyle(document.documentElement);for(const I of wt.values()){const j=I.contentDocument?.documentElement;if(j){j.dataset.theme=document.documentElement.dataset.theme??"light";for(const N of["--bg","--panel","--fg","--line","--subtle","--select"])j.style.setProperty(N,b.getPropertyValue(N))}}}function kt(){!h.hidden&&se==="business"&&(jt=!0),c.hidden=!jt,S.disabled=!1,S.setAttribute("aria-controls","design-explorer"),S.setAttribute("aria-label","ナビゲーションを開閉"),S.setAttribute("aria-expanded",String(jt));const b=yt.isReady?.()??!0;v.hidden=se!=="concept"||!De||!b||!yt.isOpen(),to&&se!=="business"&&(to.hidden=!0),se==="concept"?(L.disabled=!De||!b,L.setAttribute("aria-controls","concept-related-panel"),L.setAttribute("aria-label","データ構造の情報を開閉"),L.setAttribute("aria-expanded",String(!v.hidden))):se==="business"?L.setAttribute("aria-controls","formattedMarkdownDrawer"):(se==="states"||se==="tests"||se==="empty")&&(L.disabled=!0,L.setAttribute("aria-expanded","false"));const I=o.querySelector("#document-actions");I&&(I.hidden=se!=="business");const j=o.querySelector("#document-actions-toggle");j&&se!=="business"&&(j.hidden=!0),rs(),ei()}function ei(){const b=o.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(ei);b.observe(o),b.observe(e.querySelector("header"))}window.addEventListener("resize",ei);function as(){Ft(),oo=!0;try{const b=new URL(location.href).searchParams;if(De||(ft.clear(),Pe.clear(),Ut.clear(),Ke=[],B="overview",O.removeAttribute("src"),O.removeAttribute("srcdoc")),b.get("view")==="concept"){const I=De&&ae.includes(b.get("concept")??"")?b.get("concept"):"landscape",j=b.get("dataExample");De&&D(I)&&b.get("dataView")==="overview"&&!Q(I,j)?(ft.add(I),Pe.delete(I)):(ft.delete(I),De&&Q(I,j)?(Pe.set(I,j),Ut.set(I,j)):Pe.delete(I)),rn(I,!1)}else if(b.get("view")==="states")t.business().states?.some(I=>I.id===b.get("state"))?Tn(b.get("state"),!1):bn();else if(b.get("view")==="tests"){const I=Ko(b.get("spec")??"@overview"),j=b.get("dataExample"),N=ie(I);N&&j&&N.samples.some(G=>G.id===j)?vt.set(I,j):N&&vt.delete(I),an(I,!1)}else if(b.get("view")==="empty")ct("empty");else if(ct("business"),t.business().key){const I=b.get("activity"),j=b.get("object"),N=t.business(),G=N.views?.find(X=>X.key===N.viewKey);I&&N.activities.some(X=>X.id===I)?G?.activity!==I&&t.openActivity(I):j&&N.objects?.some(X=>X.id===j)?G?.object!==j&&t.openObject(j):(rt=!1,(!G||G.activity!==void 0||G.object!==void 0)&&t.openOverview())}pt(),dt()}finally{oo=!1}}return window.addEventListener("popstate",as),{closeBusinessOverview:Vr,reopenBusinessOverview(){rt=!1},activateBusiness(){ct("business")},businessActivated(){ct("business"),pt(),dt(),He()},syncChrome:kt,openRelatedChecks(b){$e.add("tests"),an(b&&qe(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),I=b.concept,j=!!(pn&&b.key!==pn||io&&Pn&&b.key&&b.key!==Pn),N=T?.model!==I?.model||T?.business!==I?.business;if((j||N&&T)&&(g.querySelector(".test-spec-page").replaceChildren(),rt=!1,Ke=[],Xe=[],st=[],B="overview",it="",Ee="@overview",vt.clear(),Ze.clear(),ft.clear(),Pe.clear(),Ut.clear(),Fr(),se!=="business"&&ct("business"),j&&!io&&He(!1)),N){T=I,R=I?ja(I):void 0,M=I?Wa(I):void 0,W=I?Da(I):void 0,De=!!I,J=R?.tables??{},ee=Object.keys(J);const G=R?.groups.map(_=>_.id)??[],X=new Set([...yn,"subsystems"]);if(Te=new Map(G.map(_=>[_,X.has(_)||ee.includes(_)?"group:"+_:_])),je=new Map(ee.map(_=>[_,X.has(_)||G.includes(_)?"concept:"+_:_])),te=new Map([...Te].map(([_,re])=>[re,_])),le=new Map([...je].map(([_,re])=>[re,_])),ae=[...yn,...te.keys(),...le.keys()],Array.isArray(ye?.expanded)&&ye.expandedVersion!==4){$e.add("subsystems"),$e.add("concept-relations");for(const _ of I?.model.subsystems??[])$e.add("subsystem-"+_.id)}}if(pn=b.key,Xe=Xe.filter(G=>b.states?.some(X=>X.id===G)),se==="business"&&rt&&b.views?.find(G=>G.key===b.viewKey)?.activity===void 0&&b.views?.find(G=>G.key===b.viewKey)?.object===void 0&&bn(),io&&b.key){if(qr(),Pn===b.key){Array.isArray(ye?.specs)&&(st=[...new Set(ye.specs.filter(G=>typeof G=="string").map(G=>Ko(G)))]);for(const[G,X]of Object.entries(ye?.specExamples??{})){const _=ie(G);typeof X=="string"&&_?.capability.samples.some(re=>re.id===X)&&vt.set(G,X)}}io=!1,as()}dt(),pt(),kt(),j&&Ve()}}}class gi{tabs=new WeakMap;router;constructor(t=di){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const c=JSON.stringify([o.map(f=>[f.id,f.width,f.height]),i.map(f=>[f.kind,f.from,f.to,f.label]),s]),l=this.tabs.get(t),a=!l||l.design!==n||l.structure!==c,d=new Set(o.filter(f=>{const m=l?.nodes.get(f.id);return!m||m.x!==f.x||m.y!==f.y}).map(f=>f.id)),r=new Set(o.map(f=>f.id)),u=a?new Array(i.length):l.routes.slice();if(i.forEach((f,m)=>{!a&&!d.has(f.from)&&!d.has(f.to)||(u[m]=r.has(f.from)&&r.has(f.to)?this.router({from:f.from,to:f.to,index:m,nodes:o,kind:f.kind,matrix:s?.[m],labels:s?.[m]?[]:[...u.flatMap((g,p)=>g&&p<m?[{id:String(p),x:g.label[0]-Math.max(30,i[p].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[p].label.length*12),height:18}]:[])],wires:s?.[m]?[]:u.flatMap((g,p)=>g&&p<m?[g.points]:[]),labelWidth:Math.max(30,f.label.length*12),labelHeight:18}):void 0)}),s){const f=[],m=new Map,g=u.map((p,h)=>h).sort((p,h)=>Number(s[p].returning)-Number(s[h].returning));for(const p of g){const h=u[p];if(!h)continue;const S=o.find(v=>v.id===i[p].from),L=Math.max(30,i[p].label.length*12),w=s[p].returning?[Math.max(...h.points.map(v=>v[0]))+8+L/2,h.points[0][1]]:[S.x+S.width*.125+8+L/2,Yr(S.y+S.height,s[p].captionLane*Js)+9],E=_s(i[p],p,s[p]),O=m.get(E)??li(w,L,18,o,f);(O[0]!==h.label[0]||O[1]!==h.label[1])&&(u[p]={...h,label:O}),m.has(E)||(m.set(E,O),f.push({id:String(p),x:O[0]-L/2,y:O[1]-9,width:L,height:18}))}}return this.tabs.set(t,{design:n,structure:c,nodes:new Map(o.map(f=>[f.id,{...f}])),routes:u}),u}}function Sc(e,t,n,o){const i=(u,f,m)=>(f[0]-u[0])*(m[1]-u[1])-(f[1]-u[1])*(m[0]-u[0]),s=i(e,t,n),c=i(e,t,o),l=i(n,o,e),a=i(n,o,t),d=1e-6;if(s*c<-d&&l*a<-d)return!0;if(Math.max(Math.abs(s),Math.abs(c),Math.abs(l),Math.abs(a))>d)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],o[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],o[r]))>.1}function xc(e,t,n,o,i=[]){const s=e.x+e.width,c=24,l=e.y+e.height,a=s-8-(2*(n.count-n.index)-1)*c,d=t.filter(L=>L.id!==e.id);let r;for(const L of[0,-24,24,-48,48,-72,72])for(const w of[0,16,32,64,128,256]){const E=[a+L,l],O=[E[0]+c,l];if(E[0]<e.x+8||O[0]>s-8)continue;const v=l+n.depth+w,P=Math.min(12,(O[0]-E[0])/2,(v-l)/2),V=[E];let k=`M${E}`;const C=W=>{k+=` L${W}`,V.push(W)},T=(W,J)=>{const ee=V.at(-1);k+=` Q${W} ${J}`;for(let ae=1;ae<=4;ae++){const te=ae/4,le=1-te;V.push([le*le*ee[0]+2*le*te*W[0]+te*te*J[0],le*le*ee[1]+2*le*te*W[1]+te*te*J[1]])}};C([E[0],v-P]),T([E[0],v],[E[0]+P,v]),C([O[0]-P,v]),T([O[0],v],[O[0],v-P]),C(O);const R=Qr(V,d,.3),M=i.filter(W=>V.slice(1).some((J,ee)=>W.slice(1).some((ae,te)=>Sc(V[ee],J,W[te],ae)))).length;if((!r||R<r.collisions||R===r.collisions&&M<r.wireCollisions)&&(r={path:k,points:V,collisions:R,wireCollisions:M,low:v,extra:w,shift:L}),R===0&&M===0)break}const{path:u,points:f,collisions:m,wireCollisions:g,low:p,extra:h,shift:S}=r;return{path:u,points:f,label:[Math.max(s+8,n.labelLeft)+o/2,p],bounds:{right:Math.max(...f.map(L=>L[0])),bottom:Math.max(...f.map(L=>L[1]))},collisions:m+g,rerouted:h>0||S!==0,fallback:m+g>0}}function Ac(e,t=Ri()){const n="http://www.w3.org/2000/svg",o=(A,D={})=>{const U=document.createElementNS(n,A);for(const[Q,ue]of Object.entries(D))U.setAttribute(Q,ue);return U},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(A=>[A]),c=[...new Set(["@new",...e.states,...s.map(A=>A[0].to)])],l={nodes:c.map(A=>({id:A,type:"business",name:i[A]??A,scope:!0})),relations:s.map(([A])=>({kind:A.path==="exception"?"business-exception":"input",from:A.from,to:A.to,label:A.id+"："+A.activity+"："+A.condition}))},a=Pi(l,c),d=A=>{const D=Array.from(A);return Array.from({length:Math.ceil(D.length/28)},(U,Q)=>D.slice(Q*28,(Q+1)*28).join(""))},r=s.map(([A])=>({from:A.from,activity:A.activity,rows:[A],lines:[],lineRows:[],offset:0,width:0,height:0})),u=new Map;for(const[A,D]of r.entries()){const U=D.rows[0],Q=e.transitions.filter(ie=>ie.from===U.from&&(ie.activityId??ie.activity)===(U.activityId??U.activity)&&ie.path===U.path&&(U.path!=="exception"||(ie.exception??"例外名未定義")===(U.exception??"例外名未定義"))),ue=Q.map(ie=>(ie.conditionLabel??ie.condition).trim().replace(/\s+/g," ")),Me=new Set(ue).size===Q.length?U.conditionLabel??U.condition:U.condition,ge=[U.path==="exception"?"例外："+(U.exception??"例外名未定義"):"",...Q.length>1?[Me]:[]].filter(Boolean).join("：");D.lines=d(D.activity+(ge?"（"+ge+"）":"")),D.lineRows=D.lines.map(()=>D.rows),D.width=Math.max(...D.lines.map(ie=>Array.from(ie).length*14)),D.height=D.lines.length*18,a.wires[A].returning||(D.offset=u.has(D.from)?u.get(D.from)+8:0,u.set(D.from,D.offset+D.height))}const f=new Map;s.forEach(([A],D)=>{if(A.from===A.to){const U=f.get(A.from)??new Map,Q=U.get(A.path)??[];Q.push(D),U.set(A.path,Q),f.set(A.from,U)}});const m=new Map,g=new Map;for(const[A,D]of f){let U=0;const Q=[...D.values()];Q.forEach((Me,fe)=>{for(const ge of[...Me].reverse())m.set(ge,{leader:Me[0],index:fe,count:Q.length,depth:0,offset:U}),U+=r[ge].height+8});const ue=24+Math.max(0,U-8)+8;g.set(A,ue);for(const Me of Q)for(const fe of Me)m.get(fe).depth=ue}const p=A=>44,h=c.slice().sort((A,D)=>a.positions[A][1]-a.positions[D][1]);let S=Math.max(40,...r.map((A,D)=>a.wires[D].returning&&A.from===h[0]?16+A.height/2-44*(a.wires[D].fromPort??.5):40));const L=new Map;for(const A of h){const D=p(),U=(u.get(A)??0)+(g.get(A)??0);L.set(A,S),S+=ea(D,U)}const w=c.map(A=>({id:A,x:t.positions.get(A)?.[0]??a.positions[A][0],y:t.positions.get(A)?.[1]??L.get(A),width:Math.max(104,Array.from(i[A]??A).length*14+32,16+Math.max(0,2*(f.get(A)?.size??0)-1)*24),height:p()})),E=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),O=o("title");O.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常、破線は例外。"+(c.includes("@none")?"作成なしはこの操作の処理結果。":"")+(c.includes("@unknown")?"未決は設計課題。":""),E.append(O),E.append(Di("state-transition-"));const v=new Map,P=[],V=[];let k=t.selected;const C=A=>{k=A,t.selected=A;const D=wo(e.transitions,k);for(const[U,Q]of v)Q.setAttribute("class","node graph-shape state-shape"+D.nodeClasses(U)),Q.setAttribute("aria-pressed",String(U===k));P.forEach(({element:U,rows:Q})=>{U.setAttribute("class","edge"+(Q[0].path==="exception"?" exception":"")+D.labelClasses(Q)),U.setAttribute("marker-end","url(#state-transition-"+(Q.some(D.related)?"related-arrow":"arrow")+")")});for(const U of V)U.element.setAttribute("class","state-caption-line"+D.labelClasses(U.rows));E.querySelectorAll("[data-exception-paint]").forEach(U=>U.remove());for(const{element:U}of P)U.classList.contains("exception")&&Ni(E,U,{path:U.getAttribute("d")},{"data-transitions":U.getAttribute("data-transitions")});E.querySelectorAll(".state-diagram-edge-label").forEach(U=>E.append(U))};E.addEventListener("click",A=>{A.target===E&&C()}),E.addEventListener("keydown",A=>{A.key==="Escape"&&(A.preventDefault(),C())});const T=a.wires.map((A,D)=>({...A,captionLane:(r[D].offset+(g.get(r[D].from)??0))/Js})),R=l.relations.map((A,D)=>({...A,label:String(D).padEnd(Math.ceil(r[D].width/12),"x")})),M=[...m].map(([A,D])=>{const U=w.find(ue=>ue.id===s[A][0].from),Q=r[A];return{x:U.x+U.width+8,y:U.y+U.height+24+D.offset,width:Q.width,height:Q.height}});let W=new gi().update({},e,w,R,T);for(let A=0;A<=M.length;A++){let D=!1,U=0;if(W.forEach((Q,ue)=>{if(!Q||m.has(ue)||!T[ue].returning)return;let Me=0;for(const fe of M)for(let ge=1;ge<Q.points.length;ge++){const ie=Q.points[ge-1],Le=Q.points[ge];if(Math.abs(ie[0]-Le[0])>1e-7||Math.abs(ie[1]-Le[1])<2)continue;const qe=ie[0];if(qe<fe.x-4||qe>fe.x+fe.width+4||Math.max(ie[1],Le[1])<fe.y-4||Math.min(ie[1],Le[1])>fe.y+fe.height+4)continue;const We=fe.x+fe.width+12-qe;We>0&&(Me=Math.max(Me,We))}Me&&(T[ue]={...T[ue],returnLane:(T[ue].returnLane??0)+Math.ceil(Me/16)+U++},D=!0)}),!D)break;W=new gi().update({},e,w,R,T)}const J=W.flatMap((A,D)=>A&&!m.has(D)?[A.points]:[]),ee=new Map,ae=W.map((A,D)=>{const U=m.get(D);if(!U)return A;const Q=s[D][0].from,ue=w.find(We=>We.id===Q),Me=W.flatMap((We,zt)=>We&&!m.has(zt)?[We.points]:[]),fe=Math.max(30,R[D].label.length*12),ge=r[D];let ie=ee.get(U.leader);ie||(ie=xc(ue,w,{...U,labelLeft:ue.x+ue.width+8},fe,J),ee.set(U.leader,ie),J.push(ie.points));const Le=Me.flatMap((We,zt)=>We.slice(1).map((nn,on)=>({id:`${zt}:${on}`,x:Math.min(We[on][0],nn[0])-2,y:Math.min(We[on][1],nn[1])-2,width:Math.abs(We[on][0]-nn[0])+4,height:Math.abs(We[on][1]-nn[1])+4}))),qe=li([ue.x+ue.width+8+ge.width/2,ue.y+ue.height+24+U.offset+ge.height/2],ge.width,ge.height,[...w,...Le]);return{...ie,label:[qe[0]-ge.width/2+fe/2,qe[1]]}}),te=new Array(s.length),le=[],Te=s.map((A,D)=>D).sort((A,D)=>Number(T[A].returning)-Number(T[D].returning));for(const A of Te){const D=ae[A],U=r[A],Q=Math.max(30,R[A].label.length*12);let ue=[D.label[0]-Q/2+U.width/2,D.label[1]+(T[A].returning?0:U.height/2-9)];const Me=w.find(ie=>ie.id===s[A][0].from),fe=w.find(ie=>ie.id===s[A][0].to);if(!m.has(A)&&T[A].returning&&fe&&fe.y>Me.y){const ie=D.points.slice(1).map((Le,qe)=>[D.points[qe],Le]).filter(([Le,qe])=>Math.abs(Le[0]-qe[0])<.01&&qe[1]-Le[1]>24).sort(([Le,qe],[We,zt])=>zt[1]-We[1]-(qe[1]-Le[1]))[0];if(ie){const[Le,qe]=ie;ue=[Le[0]+8+U.width/2,Le[1]+Math.min(24+U.height/2,(qe[1]-Le[1])/2)]}}const ge=li(ue,U.width,U.height,w,le);te[A]=ge,le.push({id:String(A),x:ge[0]-U.width/2,y:ge[1]-U.height/2,width:U.width,height:U.height})}let je=Math.max(...w.map(A=>A.x+A.width))+40,he=Math.max(...w.map(A=>A.y+A.height))+40;s.forEach((A,D)=>{const U=m.get(D);if(U&&U.leader!==D)return;const Q=U?s.flatMap((ie,Le)=>m.get(Le)?.leader===D?ie:[]):A,ue=Q[0],Me=ae[D],fe=o("path",{d:Me.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":Q.map(ie=>ie.id).join(" ")});ue.path==="exception"&&(fe.classList.add("exception"),fe.setAttribute("stroke-dasharray","6 5"));const ge=o("title");ge.textContent=Q.map(ie=>`${ie.id} ${ie.activity} / ${ie.path==="normal"?"通常":ie.exception??"例外名未定義"}：${ie.condition}`).join(" / "),fe.append(ge),E.append(fe),P.push({element:fe,rows:Q}),je=Math.max(je,Me.bounds.right+40),he=Math.max(he,Me.bounds.bottom+40)});for(const[A,D]of r.entries()){const U=te[A],Q=U[0]-D.width/2,ue=U[1]-D.height/2+14;E.append(o("rect",{x:String(Q),y:String(ue-14),width:String(D.width),height:String(D.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const Me=o("text",{x:String(Q),y:String(ue),class:"state-diagram-edge-label","data-activity":D.activity,"data-transition-id":D.rows[0].id,"aria-label":D.lines.join("")});D.lines.forEach((fe,ge)=>{const ie=o("tspan",{x:String(Q),dy:ge?"18":"0","font-size":"14","font-weight":"600"});ie.textContent=fe,ie.setAttribute("data-transitions",D.lineRows[ge].map(Le=>Le.id).join(" ")),V.push({element:ie,rows:D.lineRows[ge]}),Me.append(ie)}),E.append(Me),je=Math.max(je,Q+D.width+24),he=Math.max(he,ue+D.height+24)}for(const A of w){const D=A.id.startsWith("@"),U=o("g",{role:"button",tabindex:"0","aria-label":i[A.id]??A.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":A.id,"data-node":A.id});U.append(Hs(document,A,D)),U.append(o("rect",{x:String(A.x),y:String(A.y),width:String(A.width),height:String(A.height),rx:D?"20":"8",class:D?"state-diagram-node state-note":"state-diagram-node"}));const Q=o("text",{x:String(A.x+A.width/2),y:String(A.y+A.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(Q.textContent=i[A.id]??A.id,U.append(Q),D&&A.id!=="@new"){const ue=o("text",{x:String(A.x+A.width/2),y:String(A.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});ue.textContent=A.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",U.append(ue)}U.addEventListener("click",()=>C(A.id)),U.addEventListener("keydown",ue=>{(ue.key==="Enter"||ue.key===" ")&&(ue.preventDefault(),C(A.id))}),v.set(A.id,U),E.append(U)}return C(t.selected),E.setAttribute("viewBox",`0 0 ${je} ${he}`),E.style.minWidth=`${je}px`,E}const gs=new WeakMap;function Ec(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(p=>p.id===t&&p.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(p,h,S=i)=>{const L=document.createElement(p);return L.textContent=h,S.append(L),L};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const c=o.model;for(const p of c.transitions){if(!e.graph.nodes.some(h=>h.id===p.activity&&h.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(p.exceptionId){const h=e.model?.business.exceptions?.find(S=>S.id===p.exceptionId);if(!h||h.activityId!==p.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const l=gs.get(e)??new Map;gs.set(e,l);const a=l.get(t)??Ri();l.set(t,a);const d={...c,transitions:c.transitions.map(p=>({...p,activityId:p.activity,activity:e.graph.nodes.find(h=>h.id===p.activity)?.name??p.activity}))};i.append(Bs(document,p=>Ac(d,p),a));const r=p=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[p]??p,u={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},f=document.createElement("details");s("summary",`操作の詳細（${c.transitions.length}）`,f);const m=document.createElement("ol");f.append(m),i.append(f);for(const p of c.transitions){const h=document.createElement("li");h.dataset.transition=p.id,s("h3",`${p.id} · ${r(p.from)} → ${r(p.to)}`,h),p.path==="exception"&&s("p","例外名："+(p.exception??"未定義"),h),s("p",`${u[p.effect]} · ${p.path==="normal"?"正常":"例外"}`,h);const S=e.graph.nodes.find(L=>L.id===p.activity&&L.type==="business");if(S){const L=document.createElement("button");L.type="button",L.textContent=S.name,L.onclick=()=>n(S.id),h.append(L)}else s("p","要確認：根拠Activityが見つかりません — "+p.activity,h);s("p","条件："+p.condition,h),s("p",p.note,h),s("p","根拠："+p.evidence,h),m.append(h)}c.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",c.source,g),i.append(g),i}const ys=64,Oc=96,Cc=260,vs=40,jc=4;function Mc(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:c,forwardRelations:l,feedbackRelations:a,exceptionRelations:d}=ta(e,t),r=c.map(O=>O.length),u=o.map(()=>0),f=o.flatMap((O,v)=>r[v]===0?[v]:[]);for(let O=0;O<f.length;O++)for(const v of s[f[O]])u[v]=Math.max(u[v],u[f[O]]+1),--r[v]===0&&f.push(v);const m=Array.from({length:u.reduce((O,v)=>Math.max(O,v),0)+1},()=>[]);o.forEach((O,v)=>m[u[v]].push(v));const g=o.map(()=>0),p=O=>O.forEach((v,P)=>g[v]=P);m.forEach(p);for(let O=0;O<jc;O++){const v=O%2?[...m].reverse():m;for(const P of v){const V=new Map(P.map(k=>{const C=O%2?s[k]:c[k];return[k,C.length?C.reduce((T,R)=>T+g[R],0)/C.length:g[k]]}));P.sort((k,C)=>V.get(k)-V.get(C)||k-C),p(P)}}const h=m[0].filter(O=>o[O].type==="object"&&i[O].length===0&&s[O].length>0);if(n&&h.length>1){const O=new Set(h),v=m[0].filter(P=>!O.has(P));m.splice(0,1,...h.map((P,V)=>V===0?[...v,P]:[P]))}const S=Object.create(null),L=o.map(()=>0),w=[],E=Math.ceil(Cc/ys)-1;for(let O=0;O<m.length;O++){const v=new Map;for(const k of w)for(const C of k)v.set(C,C+1);const P=k=>{let C=k;for(;v.has(C);)C=v.get(C);let T=k;for(;v.has(T);){const R=v.get(T);v.set(T,C),T=R}return C},V=[];for(const k of m[O]){let C=O;for(const R of c[k])C=Math.max(C,L[R]+1);const T=P(C);L[k]=T,v.set(T,T+1),V.push(T),S[o[k].id]=[vs+O*ys,vs+T*Oc]}w.push(V),w.length>E&&w.shift()}return{positions:S,forwardRelations:l,feedbackRelations:a,exceptionRelations:d}}function Lc(e,t){return Ks(e)?Pi(e,t).positions:Mc(e,t).positions}const ws=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function or(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>ws(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=ws(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function ir(e){const t=or(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,c])=>[o.get(s),c])))}}function sr(e){const t=ir(e);return t.restore(Lc(t.graph,t.order))}function Rc(e){const t=ir(e),n=Pi(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function rr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Dc(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(c=>c.handle!==void 0):s.tabs.some(c=>c.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,c){if(Object.is(s,c))return!0;if(!s||!c||typeof s!="object"||typeof c!="object"||o.has(s)||o.has(c))return!1;const l=m=>Array.isArray(m)||Object.getPrototypeOf(m)===null||Object.getPrototypeOf(m)?.constructor?.name==="Object";if(!l(s)||!l(c)||Array.isArray(s)!==Array.isArray(c)||Array.isArray(s)&&s.length!==c.length)return!1;o.add(s),o.add(c);const a=s,d=c,r=Object.keys(a),u=Object.keys(d),f=r.length===u.length&&r.every(m=>Object.hasOwn(d,m)&&i(a[m],d[m]));return o.delete(s),o.delete(c),f}return i(e,t)}function Rn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,c]of Object.entries(e.positions))n.has(s)&&(o[s]=[...c]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=sr(t),c=Object.values(o);for(const l of i){const a=[...s[l.id]];for(;c.some(d=>Math.abs(d[0]-a[0])<280&&Math.abs(d[1]-a[1])<88);)a[1]+=180;o[l.id]=a,c.push(a)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function ar(){return new Promise((e,t)=>{const n=indexedDB.open(rr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class zi extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let ko;function cr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Nc(e){const t=ko;if(t===void 0)throw Error("Session has not been loaded");const n=await ar();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),c=s.objectStore("session"),l=c.get("generation"),a=c.get("current"),d=c.get("readonly-legacy");let r,u;d.onsuccess=()=>{try{const f=cr(l.result);if(Dc(a.result,e)){u=f;return}if(f!==t)throw new zi;if(u=t+1,!Number.isSafeInteger(u))throw Error("Session generation exhausted");d.result===void 0&&Tc(a.result)&&c.put(a.result,"readonly-legacy"),c.put(e,"current"),c.put(u,"generation")}catch(f){r=f,s.abort()}},s.oncomplete=()=>{ko=u,o()},s.onerror=()=>i(r??s.error??Error("Session save failed")),s.onabort=()=>i(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Pc(){ko=void 0;const e=await ar();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),c=i.get("generation");o.oncomplete=()=>{try{ko=cr(c.result),t(s.result)}catch(l){n(l)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function Tc(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const ks=new WeakMap;function qc(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let o=ks.get(e);o||(o=new Map,ks.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),c=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),l=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&c.has(r.to)||r.to===t&&c.has(r.from))),a=new Set([t,...l.flatMap(r=>[r.from,r.to])]),d={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>a.has(r.id)),relations:l},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>a.has(r))};return o.set(t,d),d}const Is=new WeakMap;function Wc(e,t){if(!e.graph.nodes.find(u=>u.id===t&&u.type==="object"))throw Error("Unknown Object: "+t);let o=Is.get(e);o||(o=new Map,Is.set(e,o));const i=t,s=o.get(i);if(s)return s;const c=new Set(e.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),l=new Set(e.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),a=e.graph.relations.filter(u=>u.kind==="input"&&u.from===t&&l.has(u.to)||u.kind==="output"&&u.to===t&&l.has(u.from)||u.kind==="object-exception"&&(u.from===t&&c.has(u.to)||u.to===t&&c.has(u.from))),d=new Set([t,...a.flatMap(u=>[u.from,u.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(u=>d.has(u.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)).filter(u=>d.has(u))};return o.set(i,r),r}const dr=new WeakMap;function Pt(e){return dr.get(e)}const lr=["design","checks","source","draft","edited","handle"];function zc(e){return{key:e.key,name:e.name,...Object.fromEntries(lr.map(t=>[t,e[t]]))}}function xt(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:c,viewInset:l,canvasOrigin:a,scroll:d,zoom:r}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:c,viewInset:l,canvasOrigin:a,scroll:d,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Mo(e,t){const n=t;dr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of lr)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function Io(e){return e.activity}function So(e){return e.object}function Bn(e){return e.activity??e.object}function Lo(e){return e.object===void 0?qc(e.design,e.activity):Wc(e.design,e.object)}function Ro(e){const t=Lo(e),n=Rn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function Qt(e,t=[],n,o){const i=n??(e.tabs[0]?zc(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?xt(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(f=>{const m=Mo(i,f);return Object.assign(f,xt(Ro(m))),m}):[],{dark:c,drawer:l,width:a,preferWrite:d,nodeDrawer:r,sampleLayout:u}=e;return{dark:c,drawer:l,width:a,preferWrite:d,nodeDrawer:r,sampleLayout:u,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(f=>f.source?.kind==="url").map(f=>({url:f.source.url,name:f.name}))].filter((f,m,g)=>g.findIndex(p=>p.url===f.url)===m),legacyViews:e.legacyViews,active:s.some(f=>f.key===e.active)?e.active:s[0]?.key}}function Ui(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(xt),recovery:n}}function lo(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function Uc(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!Gc(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const r of i.views)lo(r)}const{format:s,views:c,document:l,recovery:a,...d}=e;for(const r of c)lo(r);for(const r of a)lo(r);if(!!l!=!!c.length||new Set(c.map(r=>r.key)).size!==c.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(f=>f.group!==void 0&&typeof f.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(f=>f.group===void 0).length!==1))throw Error("Invalid legacy views");const r=o.views[0],u=r?{...r}:void 0;return u&&delete u.group,Qt({...d,tabs:[],active:u?.key,legacyViews:{documentKey:l?.key,views:structuredClone(o.views),active:o.active}},a,l,u?[u]:[])}if(c.length&&(c[0].activity!==void 0||c[0].object!==void 0||c.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(c.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==c.filter(r=>r.activity!==void 0).length||new Set(c.filter(r=>r.object!==void 0).map(r=>r.object)).size!==c.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(l&&c.some(r=>r.activity!==void 0&&!l.design.graph.nodes.some(u=>u.type==="business"&&u.id===r.activity)))throw Error("Unknown saved Activity");if(l&&c.some(r=>r.object!==void 0&&!l.design.graph.nodes.some(u=>u.type==="object"&&u.id===r.object)))throw Error("Unknown saved Object");return Qt({...d,tabs:[]},a,l,c)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)lo(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return Qt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function $c(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return Qt({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function Fc(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),c=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),l=e.tabs.filter(a=>(a.activity===void 0||s.has(a.activity))&&(a.object===void 0||c.has(a.object))).map(xt);return Qt(e,e.recovery,i,l)}function Vc(e,t){const n=e.tabs.find(i=>Io(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=Mo(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,xt(Ro(o))),e.tabs.push(o),e.active=o.key,o}function Bc(e,t){const n=e.tabs.find(i=>So(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=Mo(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,xt(Ro(o))),e.tabs.push(o),e.active=o.key,o}function Hc(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return xt(i?Ro(Mo(e.document,{...xt(o),...xt(i)})):o)});return Qt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Gc(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Do(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=l=>l instanceof HTMLButtonElement&&l.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(l=>!l.hidden&&!o(l));for(const l of Array.from(t.querySelectorAll("button,a[href]")))l.setAttribute("role","menuitem");const s=(l=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),l&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},c=(l=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),d=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(d.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(d.bottom+4,innerHeight-t.offsetHeight-8))+"px",(l?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?c():s(!0),e.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),c(l.key==="ArrowUp"))},t.addEventListener("keydown",l=>{const a=l,d=i(),r=d.indexOf(document.activeElement);let u;a.key==="ArrowDown"&&(u=(r+1)%d.length),a.key==="ArrowUp"&&(u=(r+d.length-1)%d.length),a.key==="Home"&&(u=0),a.key==="End"&&(u=d.length-1),u!==void 0&&(a.preventDefault(),d[u]?.focus())}),t.addEventListener("click",l=>{const a=l.target.closest("button,a[href]");!t.hidden&&a&&!o(a)&&s(!0)},!0),document.addEventListener("keydown",l=>{!t.hidden&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{!t.hidden&&!t.contains(l.target)&&!e.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{!t.hidden&&!t.contains(l.target)&&l.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const Jc=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),_c={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function Kc(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=w=>i.slice(w.line+1,o.find(E=>E.line>w.line&&E.level<=w.level)?.line??i.length).join(`
`).trim(),c=new Map(o.filter(w=>w.level===3&&t.some(E=>E.title===w.title)).map(w=>[w.title,w])),l=w=>{const E=t.find(O=>O.title===w.title);return E?"legacy-check:"+E.id:w.level===1?"legacy-check-document":"legacy-heading:"+w.line},a=new Map,d=(w,E)=>{a.has(w)?a.get(w)!==E&&a.set(w,void 0):a.set(w,E)};for(const w of o){const E=l(w);d(Jc(w.title),E);const O=t.find(v=>v.title===w.title);O&&d(O.id.toLowerCase(),E)}for(const[w,E]of i.entries()){const O=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(E);if(O){const v=o.find(P=>P.line>w);v&&d(O[1].toLowerCase(),l(v))}}const r=w=>{w=w.replace(/<a\s+id=[^>]+><\/a>/g,"");const E=[];let O=0;for(const v of w.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){v.index>O&&E.push({kind:"markdown",value:w.slice(O,v.index)});let P=v[2].slice(1);try{P=decodeURIComponent(P)}catch{}const V=v[2].startsWith("#")?a.get(P.toLowerCase()):void 0;E.push(V?{kind:"reference",targetId:V,label:v[1]}:{kind:"link",uri:v[2],label:v[1]}),O=v.index+v[0].length}return O<w.length&&E.push({kind:"markdown",value:w.slice(O)}),E},u=[],f=[],m=[],g=new Map;for(const w of o.filter(E=>E.level===2)){if(w.title==="業務一覧")continue;const E=l(w),O=o.find(v=>v.line>w.line)?.line??i.length;u.push({id:E,activityId:Object.hasOwn(n,w.title)?w.title:null,title:w.title,preamble:r(i.slice(w.line+1,O).join(`
`).trim())}),g.set(w.title,E)}const p="legacy-unassigned",h=w=>{const E=o.filter(O=>O.line<w.line&&O.level===2).at(-1);return E?g.get(E.title):void 0},S=t.map(w=>{const E=c.get(w.title),O=h(E)??p,v=Object.create(null),P=[];let V={name:"補足",value:""},k="";for(const T of w.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const R=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(T);R&&(k?R[1][0]===k[0]&&R[1].length>=k.length&&!R[2].trim()&&(k=""):k=R[1]);const M=k?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(T);M?(V.value.trim()&&P.push(V),V={name:M[1],value:M[2]}):V.value+=`
`+T}V.value.trim()&&P.push(V);let C="";for(const T of P)if(T.name==="人間レビュー状態"){C=T.value.split(`
`)[0].trim();const R=T.value.split(`
`).slice(1).join(`
`).trim();R&&(v.補足=[...v.補足??[],...r(R)])}else{const R=_c[T.name]??T.name;v[R]=[...v[R]??[],...r(T.value.trim())]}return{id:"legacy-check:"+w.id,checkId:w.id,title:w.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:C,sectionId:O,detailSummary:[...w.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(T=>T[1]).join(`
`),fields:v}});S.some(w=>w.sectionId===p)&&u.push({id:p,activityId:null,title:"未割当",preamble:[]});for(const w of o.filter(E=>E.level===3&&!c.has(E.title))){const E=h(w);E?f.push({id:l(w),sectionId:E,title:w.title,blocks:[{kind:"prose",content:r(s(w))}]}):m.push({id:l(w),title:w.title,content:r(s(w))})}const L=o.find(w=>w.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(w=>w.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(i.slice(/^# /.test(i[0])?1:0,L).join(`
`)),sections:u,items:S,index:Object.entries(n).map(([w,E])=>{const O=i.find(v=>v.startsWith("|")&&v.includes("["+w+"]"))?.split("|").slice(1,-1)??[];return{activityId:w,purpose:O[1]?.trim()??"",connections:O[2]?.trim()??"",checkIds:E.map(v=>"legacy-check:"+v)}}),guarantees:f,examples:[],notes:m}}function oi(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[c,...l]=s;return!c||!l.length||!["main","master"].includes(c)&&!/^[a-f0-9]{40}$/i.test(c)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${l.join("/")}`,ref:c}}catch{return}}function yi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function Xc(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((u,f)=>{const m=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(u);if(m){i?m[1][0]===i[0]&&m[1].length>=i.length&&!m[2].trim()&&(i=""):i=m[1];return}if(!i){t.add(f);const g=/^(#{1,6}) (.+)$/.exec(u);g&&o.push({line:f,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(u=>u.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(u.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const c=new Set,l=s.map(u=>{const f=o.find(p=>p.line>u.line&&p.level<=3)?.line??n.length,m=u.title.split(/\s/)[0];if(c.has(m))throw Error("Check IDが重複しています: "+m);c.add(m);const g=n.slice(u.line+1,f).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const p of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+p+"[：:]\\s*\\S","m").test(g))throw Error(m+" の"+p+"が見つかりません。");return{id:m,title:u.title,body:g,activities:[]}}),a=Object.create(null);let d=!1;for(const[u,f]of n.entries()){if(!t.has(u)||(/^## /.test(f)&&(d=/^## 業務一覧\s*$/.test(f)),!d||!/^\|/.test(f)))continue;const m=f.split("|").slice(1,-1);if(m.length!==4)continue;const g=yi(m[0])[0]?.label;if(!g)continue;if(Object.hasOwn(a,g))throw Error("業務一覧のActivityが重複しています: "+g);const p=yi(m[3]);if(p.some(S=>S.url.toLowerCase()!=="#"+S.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const h=p.map(S=>S.label);if(!h.length||h.some(S=>!c.has(S)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);a[g]=[...new Set(h)];for(const S of l)h.includes(S.id)&&S.activities.push(g)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=o.find(u=>u.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:l,index:a,model:Kc(e,l,a,o)}}function Hn(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Gn(e,t){const n=new Set(t.design.graph.nodes.filter(d=>d.type==="business").map(d=>d.name)),o=Object.keys(e.index).filter(d=>!n.has(d)),i=Object.keys(e.index).filter(d=>n.has(d)),s=(d,r)=>({state:d,reason:r,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const c=e.intro.split(`
`).filter(d=>/原典|^[-*] Source[：:]|Business Design/i.test(d)).join(`
`),l=yi(c).map(d=>oi(d.url)).filter(d=>d!==void 0),a=t.source?.kind==="url"?oi(t.source.url):t.source?.kind==="sample"?oi("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&l.length&&l.some(d=>d.document!==a.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!a||!l.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||l.some(d=>d.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Ss=new WeakMap;function On(e){let t=Ss.get(e);return t||(t=Xc(e.markdown),Ss.set(e,t)),t}const ii=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function uo(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function Zc(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function Yc(e){if(!e.checks)return[];const t=On(e.checks),n=Gn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===Hn(e)?[t.model]:[]}function Qc(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&uo(i,"関連Checkを読み込み・保存しています…"),t.error){const l=document.createElement("p");l.className="check-warning",l.setAttribute("role","alert"),l.textContent=t.error,i.append(l)}let s,c=!1;if(e.checks){s=On(e.checks);const l=Gn(s,e);if(c=l.state==="matched"||l.state==="unverified"&&e.checks.confirmedFor===Hn(e),!c&&(uo(i,"現在のBDとの対応を再確認してください。"+l.reason),l.state==="unverified")){const a=ii("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,i.append(a)}}if(t.candidate){const l=t.candidate,a=On(l),d=Gn(a,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",uo(r,"一致未確認: "+l.name+" — "+d.reason),uo(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const u=document.createElement("details"),f=document.createElement("summary");f.textContent="原典参照・業務別インデックス・Check本文を確認",u.append(f,Zc(a.markdown)),r.append(u);const m=ii("対応を確認して表示する",()=>n.confirm(l));m.id="check-confirm",m.disabled=d.state==="mismatch"||n.disabled||t.busy===!0;const g=ii("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(m,g),i.append(r)}return i.childNodes.length&&o.append(i),o}function ed(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const r of i){const u=document.createElement("span");u.className="document-action-label",u.textContent=r.getAttribute("aria-label"),r.append(u)}let s=!1;const c=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),r&&!o.hidden&&o.focus({preventScroll:!0})},l=()=>i.filter(r=>!r.hidden&&!r.disabled),a=()=>{const r=e.dataset.actionsMode,u=document.activeElement;e.dataset.actionsMode="inline";const m=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+m,p=i.some(h=>!h.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=p?"menu":"inline",o.hidden=!p,(!p||r!==e.dataset.actionsMode)&&(c(),p&&n.contains(u)?o.focus({preventScroll:!0}):!p&&u===o&&l()[0]?.focus({preventScroll:!0}))},d=(r=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const u=l();(r?u.at(-1):u[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?c(!0):d(),o.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),d(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const u=l(),f=u.indexOf(document.activeElement);let m;r.key==="ArrowDown"&&(m=(f+1)%u.length),r.key==="ArrowUp"&&(m=(f+u.length-1)%u.length),r.key==="Home"&&(m=0),r.key==="End"&&(m=u.length-1),m!==void 0&&(r.preventDefault(),u[m]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),c(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!o.contains(r.target)&&c()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==o&&c()}),n.addEventListener("click",r=>{const u=r.target.closest("button");s&&u&&!u.disabled&&c(!0)},!0),c(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:c}}function td(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,c=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),l=n.reduce((d,r)=>d+r.getBoundingClientRect().width,0)+s*n.length+c,a=l+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",a>e.clientWidth),e.classList.toggle("header-icons-only",l>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const qn="http://www.w3.org/2000/svg",nd="http://www.w3.org/1999/xhtml",fo=24,xs=8192,od=16e6,id=8e6,sd=4e3,rd=1e6,vi="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function ad(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),o=Math.max(o,r.x+r.width),i=Math.max(i,r.y+r.height);const s=Math.floor(t)-fo,c=Math.floor(n)-fo,l=Math.ceil(o)-s+fo,a=Math.ceil(i)-c+fo,d=Math.min(2,xs/l,xs/a,Math.sqrt(od/(l*a)));if(d<1)throw Error(vi);return{bounds:{x:s,y:c,width:l,height:a},width:Math.floor(l*d),height:Math.floor(a*d),scale:d}}const cd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function As(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const c=o[s],l=getComputedStyle(i);c.removeAttribute("style");for(const a of cd){const d=l.getPropertyValue(a);d&&!/url\s*\(/i.test(d)&&c.style.setProperty(a,d)}for(const a of Array.from(c.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&c.removeAttribute(a.name)}),t}function dd(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>sd||(e.textContent?.length??0)+(t.textContent?.length??0)>rd)throw Error(vi);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(p=>({x:parseFloat(p.style.left),y:parseFloat(p.style.top),width:p.offsetWidth,height:p.offsetHeight}));for(const p of o)for(const h of Array.from(p.querySelectorAll(".finding-badges")))i.push({x:parseFloat(p.style.left)+p.clientLeft+h.offsetLeft,y:parseFloat(p.style.top)+p.clientTop+h.offsetTop,width:h.offsetWidth,height:h.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,c=Array.from(t.children).map(As),l=c.filter(p=>p.matches(".edge,.edge-label"));if(l.length){const p=s.createElementNS(qn,"svg");p.setAttribute("viewBox","0 0 1 1"),p.setAttribute("width","1"),p.setAttribute("height","1"),p.setAttribute("aria-hidden","true"),p.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",p.append(...l),s.body.append(p);try{for(const h of l){const S=h.getBBox();i.push({x:S.x-12,y:S.y-12,width:S.width+24,height:S.height+24})}}finally{p.remove()}}const a=ad(i),d=s.createElementNS(qn,"svg");d.setAttribute("width",String(a.width)),d.setAttribute("height",String(a.height)),d.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const r=s.createElementNS(qn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),d.append(r);const u=s.createElementNS(qn,"g");u.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const p of c)u.append(p);d.append(u);const f=s.createElementNS(qn,"foreignObject");f.setAttribute("width",String(a.bounds.width)),f.setAttribute("height",String(a.bounds.height));const m=s.createElementNS(nd,"div");m.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const p of o){const h=As(p);h.querySelector(".activity-open,.object-open")?.remove(),h.style.left=parseFloat(p.style.left)-a.bounds.x+"px",h.style.top=parseFloat(p.style.top)-a.bounds.y+"px",m.append(h)}f.append(m),d.append(f);const g=new XMLSerializer().serializeToString(d);if(new TextEncoder().encode(g).length>id)throw Error(vi);return{svg:g,...a}}function ld(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ur(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const c=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(c),i()},n.onerror=()=>{clearTimeout(c),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const c=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(l=>{clearTimeout(c),l?i(l):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(l){clearTimeout(c),s(l)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function ud(e,t){const n=await ur(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=ld(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function fd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ur(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function fr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:pd(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function pd(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const c of o)i=Math.imul(i^c.codePointAt(0),16777619)>>>0,s=Math.imul(s^c.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function pr(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return q(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function md(e){q(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),kn(e),bi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=fr(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=pr(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return bi(t),t}const ce=(e,t)=>{if(!e)throw new Error(t)},Wn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),si=e=>!!e&&typeof e=="object"&&!Array.isArray(e),po=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),mr=e=>Wn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function hd(e){ce(si(e),"Graph must be an object");const t=e;ce(po(t,["version","nodes","relations"])||po(t,["version","nodes","relations","scope"]),"Invalid graph fields"),ce(t.version===1,"Unsupported graph version"),"scope"in t&&ce(Wn(t.scope),"Invalid scope"),ce(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),ce(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){ce(si(s),"Node must be an object");const c=s;ce(c.type==="business"||c.type==="object","Invalid node type");const l=c.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];c.type==="business"&&("problem"in c||"pain_level"in c)&&(l.push("problem","pain_level"),ce(["Low","Medium","High"].includes(String(c.pain_level)),"Invalid Pain level")),ce(po(c,l),"Invalid node fields"),ce(Object.entries(c).every(([d,r])=>d==="scope"||d==="information"||Wn(r)),"Empty node text"),ce(typeof c.scope=="boolean","Invalid node scope"),ce(mr(c.name)&&c.id===c.name,"Node ID must equal visible name"),ce(!n.has(c.id),"Duplicate node ID"),c.type==="object"&&(ce(typeof c.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.icon),"Invalid Lucide icon"),ce(Array.isArray(c.information)&&c.information.every(Wn),"Invalid information")),n.set(c.id,c.type)}ce([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){ce(si(s),"Relation must be an object");const c=s;ce(po(c,["kind","from","to","label"])&&Object.values(c).every(Wn),"Invalid relation fields");const l=o[c.kind];ce(Array.isArray(l)&&n.has(c.from)&&n.has(c.to)&&n.get(c.from)===l[0]&&n.get(c.to)===l[1],"Invalid relation endpoints");const a=JSON.stringify([c.kind,c.from,c.to,c.label]);ce(!i.has(a),"Duplicate relation"),i.add(a)}}function Kt(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function zn(e){const t=[];let n="";return Kt(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),ce(!n,"Unclosed code fence"),t}function wi(e,t,n,o=[]){const i=Kt(e),s=zn(e),c=Object.create(null);return ce(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([l,a],d)=>{ce(t.includes(a)&&!(a in c),n+": unsupported/duplicate "+a),c[a]=i.slice(l+1,s[d+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ce(c[a]||o.includes(a),n+": empty "+a)}),ce(s.map(l=>l[1]).join("|")===t.join("|"),n+": invalid field order"),c}const Es=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function bd(e){const t=Kt(e),n=zn(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return ce(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],c)=>{const l=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);ce(l,"Invalid Finding ID");const a=l[1];ce(!o.has(a),"Duplicate Finding ID"),o.add(a);const d=wi(t.slice(i+1,n[c+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);ce(["question","correction"].includes(d["### Kind"]),"Invalid Finding Kind"),ce(["open","resolved"].includes(d["### Status"]),"Invalid Finding Status"),ce(["items","document","unassigned"].includes(d["### Scope"]),"Invalid Finding Scope");const r=d["### Targets"]==="(none)"?[]:Kt(d["### Targets"]).filter(u=>u.trim()).map(u=>(ce(u.startsWith("- ")&&mr(u.slice(2)),"Invalid Finding target"),u.slice(2)));return ce(new Set(r).size===r.length,"Duplicate Finding target"),ce(d["### Scope"]==="items"?r.length>0:d["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:d["### Kind"],status:d["### Status"],scope:d["### Scope"],targets:r,summary:d["### Summary"],content:d["### Content"],unresolvedTargets:[]}})}function gd(e,t){ce(!e.includes("<!--"),"HTML comments are unsupported");const n=Kt(e),o=zn(e).filter(f=>f[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;ce(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const c={version:1,nodes:[],relations:[]},l=Object.create(null),a=new Set;o.slice(1).forEach(([f,m],g)=>{const p=o[g+2]?.[0]??n.length,h=n.slice(f+1,p).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(ce(h,"Empty section "+m),m==="# Findings"){ce(!a.has(m),"Duplicate Findings"),a.add(m),s=bd(h);return}if(["# Scope","# Graph exceptions"].includes(m)){ce(!a.has(m),"Duplicate "+m),a.add(m),m==="# Scope"?(ce(!zn(h).length,"Scope must be prose"),c.scope=h):Kt(h).filter(V=>V.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(V=>{const k=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(V);ce(k,"Invalid exception"),c.relations.push({kind:k[1],from:k[2],to:k[3],label:k[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const S=i.exec(m);ce(S,"Unsupported heading "+m);const L=S[1],w=S[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");l[w]=n.slice(f,p).join(`
`);const E=V=>zn(h).some(k=>k[1]===V);if(L==="Object"){const V=["## Scope","## Icon"];E("## Information")&&V.push("## Information");const k=wi(h,V,w);ce(["true","false"].includes(k["## Scope"]),"Invalid Scope");const C=Kt(k["## Information"]??"").filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(T=>(ce(/^- \S.*$/.test(T),"Invalid Information"),T.slice(2)));c.nodes.push({id:w,type:"object",name:w,scope:k["## Scope"]==="true",icon:k["## Icon"]==="(generic icon)"?"box":k["## Icon"],information:C});return}const O=["## Scope","## Why","## When"];E("## Exception When")&&O.push("## Exception When"),O.push("## Who","## Where","## How","### Input","### Procedure"),E("### Exception")&&O.push("### Exception"),O.push("### Output","## Result"),(E("## Problem")||E("## Pain level"))&&O.push("## Problem","## Pain level");const v=wi(h,O,w,["## How"]);ce(!v["## How"],"How must only contain fields"),ce(["true","false"].includes(v["## Scope"]),"Invalid Scope"),t?.activity?.(w,v);const P={id:w,type:"business",name:w,scope:v["## Scope"]==="true",why:v["## Why"],when:v["## When"],who:v["## Who"],where:v["## Where"],result:v["## Result"]};"## Problem"in v&&(P.problem=v["## Problem"],P.pain_level=v["## Pain level"]),c.nodes.push(P);for(const[V,k]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(V in v)||k!=="business-exception"&&v[V]==="(none)"||Kt(v[V]).filter(C=>C.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(C=>{const T=/^- (.+?) — (\S.*)$/.exec(C);ce(T,"Invalid relation in "+w),c.relations.push({kind:k,from:k==="output"?w:T[1],to:k==="output"?T[1]:w,label:T[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const d=c.nodes.filter(f=>f.type==="business").map(f=>f.id);hd(c),c.nodes.sort((f,m)=>Es(f.id,m.id)),c.relations.sort((f,m)=>{for(const g of["kind","from","to","label"]){const p=Es(f[g],m[g]);if(p)return p}return 0});const r=new Set(c.nodes.map(f=>f.id));for(const f of s)f.unresolvedTargets=f.targets.filter(m=>!r.has(m));return{graph:c,sections:l,markdown:e,activityOrder:d,findings:s}}const yd=["id","from","activity","condition","to","effect","path","evidence","note"],Ue=(e,t)=>{if(!e)throw Error(t)},mo=e=>typeof e=="string"&&!!e.trim();function vd(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Ue(n,"state-meta と遷移表が必要です");const o=tr(n[1]);Ue(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),Ue(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Ue(o.object===t,"対象Objectが一致しません"),Ue(Array.isArray(o.states)&&o.states.length>0&&o.states.every(d=>mo(d)&&!d.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),Ue(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&mo(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=d=>(Ue(d.startsWith("|")&&d.endsWith("|"),"表の行が不正です"),d.slice(1,-1).split("|").map(r=>r.trim())),c=s(i[0]);Ue([yd,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(d=>c.join("|")===d.join("|")),"表の列名が不正です"),Ue(s(i[1]).length===c.length&&s(i[1]).every(d=>/^-+$/.test(d)),"表の区切りが不正です"),Ue(i.length<=1002,"遷移は1000行以内にしてください");const l=new Set,a=i.slice(2).map(d=>{const r=s(d);Ue(r.length===c.length&&r.every(mo),"表の列数・空欄が不正です");const u=Object.fromEntries(c.map((f,m)=>[f,r[m]]));return Ue(/^T[0-9]+$/.test(u.id)&&!l.has(u.id),"遷移IDが不正または重複しています"),l.add(u.id),Ue([...o.states,"@new"].includes(u.from)&&[...o.states,"@unknown","@none"].includes(u.to),"未登録の状態が参照されています"),Ue(["change","unchanged","no-create","constraint"].includes(u.effect)&&["normal","exception"].includes(u.path),"効果・経路の指定が不正です"),c.includes("exception")&&Ue(u.path==="normal"?u.exception==="-":mo(u.exception)&&u.exception!=="-","通常は例外名なし、例外は名前が必要です"),Ue(u.effect!=="unchanged"||u.from===u.to,"状態不変の元と先が一致しません"),Ue(u.effect!=="change"||!u.to.startsWith("@")&&u.from!==u.to,"状態変更の遷移先が不正です"),Ue(u.effect!=="no-create"||u.from==="@new"&&u.to==="@none","不成立の元と先が不正です"),Ue(u.effect!=="constraint"||u.to==="@unknown","未決の制約は遷移先未決としてください"),u});return{model:{...o,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Os=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function wd(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let c=0;c<o.length;c++){const l=o[c];if(!s&&/^# Object /.test(l)?n=l.slice(9):!s&&/^# /.test(l)&&(n=null),!s&&l==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let d="";for(c++;c<o.length;c++){const u=o[c];if(!d&&/^#{1,2} /.test(u)){c--;break}a.push(u),d=Os(u,d)}const r=vd(a.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}i.push(l),s=Os(l,s)}if(new Set(t.map(c=>c.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function kd(e){const t=/^## State Transitions$/m.test(e)?wd(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=gd(t.markdown,{activity:(a,d)=>i.set(a,d),document:(a,d)=>{n=a,o=d}}),c={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(s.activityOrder??[]).map(a=>{const d=s.graph.nodes.find(u=>u.id===a),r=i.get(a);return{id:a,name:d.name,scope:d.scope,why:String(d.why),when:String(d.when),who:String(d.who),where:String(d.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(d.result),problem:d.problem===void 0?null:String(d.problem),painLevel:d.pain_level===void 0?null:String(d.pain_level)}}),relations:s.graph.relations.map((a,d)=>({id:"legacy-relation-"+d,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(s.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(d=>s.graph.nodes.some(r=>r.id===d))}))};c.exceptions=fr(c);const l=t.declarations.map((a,d)=>({id:"legacy-state-"+d,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:c.id,revision:c.revision,verification:"unverified"},objectId:a.object,states:a.states.map(r=>({id:r,name:r})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:pr(c,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:c,checks:[],states:l,diagnostics:[]}}}function Id({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const n=nr({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(n.diagnostics)]};const o=e.business,i=[...o.objects,...o.activities],s=a=>o.roles?.find(d=>d.id===a.roleId)?.name??a.who,c=[...o.objects.map(a=>({...a,type:"object"})),...o.activities.map(a=>({id:a.id,type:"business",name:a.name,scope:a.scope,why:a.why,when:a.when,who:s(a),where:a.where,result:a.result,...a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel}}))],l=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(a=>a.basedOn.documentId===o.id).map(a=>{const d=new Map(a.states.map(u=>[u.id,u.name])),r={object:i.find(u=>u.id===a.objectId).name,states:a.states.map(u=>u.name),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(u=>({id:u.sourceId,from:d.get(u.fromId)??u.fromId,to:d.get(u.toId)??u.toId,activity:u.activityId,...u.event?{event:u.event}:{},...u.exceptionId?{exceptionId:u.exceptionId,exception:o.exceptions?.find(f=>f.id===u.exceptionId)?.name}:{},condition:u.condition,...u.conditionLabel?{conditionLabel:u.conditionLabel}:{},effect:u.effect,path:u.path,evidence:u.evidence,note:u.note}))};return[a.objectId,{model:r}]})));return{graph:or({version:1,...o.scope?{scope:o.scope}:{},nodes:c,relations:o.relations.map(a=>({kind:a.kind,from:a.fromId,to:a.toId,label:a.label}))}),sections:Object.fromEntries(c.map(a=>[a.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:o.activities.map(a=>a.id),objectStateTransitions:l,findings:o.findings.map(a=>({...a,displayId:a.sourceId,targets:[...a.targetIds,...a.unresolvedTargets],targetNames:[...a.targetIds,...a.unresolvedTargets].map(d=>i.find(r=>r.id===d)?.name??d)}))}}const hr=8*1024*1024;function br(e){return/^\s*[\[{]/.test(e)}function gr(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Cs(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");gr(e);const n=bi(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Sd(e){if(!br(e))return kd(e);if(new TextEncoder().encode(e).byteLength>hr)throw Error("ローカルJSONは8MiB以内にしてください。");const t=tr(e.replace(/^\uFEFF/,""));if(gr(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=Cs(md(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const o=n.data.business;o.schemaVersion="0.1",delete o.roles;for(const i of o.activities)delete i.roleId;n.data.diagnostics=n.data.diagnostics.filter(i=>!i.startsWith("Role未確定:"))}return n}return Cs(t,e)}function fn(e){return Id(Sd(e))}async function xd(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>hr)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!br(n))throw Error("JSONファイルの本文を確認してください。");return fn(n)}const Ad=(e,t)=>$i(e,t,!1);async function $i(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const c=setTimeout(s,3e4);try{const l=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!l.ok)throw Error("URL取得に失敗しました（HTTP "+l.status+"）。");const a=l.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const d=2*1024*1024;if(Number(l.headers.get("content-length"))>d)throw Error("本文は2MiB以内にしてください。");const r=l.body?.getReader();if(!r)throw Error("本文を読み取れません。");let u=0,f="";const m=new TextDecoder;try{for(;;){const{done:g,value:p}=await r.read();if(g)break;if(u+=p.length,u>d){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}f+=m.decode(p,{stream:!0})}f+=m.decode()}finally{r.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(f))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(f))throw Error("HTMLページは読み込めません。");return f}catch(l){const a=i.signal.aborted;throw s(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):l instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):l}finally{clearTimeout(c),t?.removeEventListener("abort",s)}}const xo=xd;async function No(e,t){return fn(await $i(e,t))}function Ed(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return fn(e)}const Po=e=>e==="question"?"要確認":"要修正";function Od(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${Po(o)} ${i}`)}return n}function Cd(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Po(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(En(e.content)),t}function jd(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Md(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${Po(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function Ld(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const c=document.createElement("label");c.className="finding-filter";const l=document.createElement("input");l.type="checkbox",l.checked=t,l.onchange=()=>n(l.checked),c.append(l,document.createTextNode("解消済みも表示")),s.append(c);const a=(r,u,f)=>{const m=document.createElement("button");m.className="node-navigate finding-index-row",m.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=u;const p=document.createElement("span");return p.textContent=f,m.append(g,p),m.onclick=()=>o(r),m},d=e.graph.nodes.filter(r=>(!i||r.id===i)&&typeof r.problem=="string");if(d.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const u of d)s.append(a({type:"problem",id:u.id},`${u.name}（${String(u.pain_level)}）`,String(u.problem)))}for(const[r,u]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const f=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!f.length)continue;const m=document.createElement("h3");m.textContent=`${u}（${f.length}件）`,s.append(m);for(const g of f)s.append(a({type:"finding",id:g.id},`${Po(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function Rd(e){const t=sr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,c)=>s===i[c]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...na(),viewInset:[40,0],canvasOrigin:void 0}}function Dd(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function Fi(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Nd(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Fi(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Pd(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Fi(t)),n.href}function Td(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Fi(t)}const Vi=`# Alderを使った設計業務 — Business Design

この文書は、Alderを使って業務を設計し、必要に応じて業務改善を検討し、検査項目を作成して後続の開発へ引き渡す利用業務を記述する。引き渡し前後の画面・システム設計、実装、検証と結果統合は、責任範囲外の業務との受け渡しとして記述する。Alderそのものの研究・保守・リリースは含まない。業務上の意図の唯一の正本（SSOT）はBusiness Designであり、コード、テスト、Check Item、Decision Record、生成されたGraph JSONはその代わりにならない。この文書は依頼者による業務上の意味のレビューを待つ草案であり、exportやテストの成功は承認を意味しない。

Business Designは依頼者との合意に使う文書である。本文は依頼者が実際に使用する言語で書き、依頼者自身が内容を理解し、誤りを指摘し、合意できることを前提とする。今回の本文は日本語とする。ヘッダーやセクション名は英語でもよい。

各Activityは責務を示しており、必ず順番に実行する工程ではない。1人が複数の役割を担ってもよい。**Whoはその業務を行うロール**を表し、同じ役割には同じ短い名称を使う。AIや人間への割り当て、支援者、確認者の分担はProcedureに記す。一方、\`依頼者\` Objectは、担当者が意図を受け取ったり、質問や結果を返したりする外部の相手を表す。同じ人が両方に関わる場合も、この2つの役割は区別する。

既存の運用規則の参照元は、[導入ガイド](../../docs/adoption.md)、[業務改善レビュー](../../docs/optimization-review.md)、[レビュー知識 v0.3](../../docs/phase2/review-knowledge-v0.3.md)、[Checkの追跡関係](../../docs/check-item-traceability.md)、[任意のDrift試行](../../docs/traceability-drift/study.md)である。見出しの業務名・Object名と、Input / Outputに書いたObject名から接続を読み取る。人間がヒアリング結果をまとめ、単独でも読み書き・保守できる文書とし、AIも同じ表面上の情報を編集して協業する。IconはAIが提案しても、人間が変更してもよい。非表示のIDや機械専用の注釈は管理しない。生成JSONは手で編集しない。Input / OutputはObjectと業務の間で実際に受け渡す情報を表し、一般的な参照資料の一覧にはしない。業務要件の問題による業務間の差し戻しは、発生側のHow / Exceptionと、再開側のException Whenまたは末尾の例外フローで表す。Graphの関係は再開側で一度だけ記述する。

\`Alder: 検査項目設計ナレッジ\` の現行内容は[検査項目の作成・レビュー手順](../../docs/adoption.md#draft-and-review-check-items-required)と[追跡関係](../../docs/check-item-traceability.md)にある。

検査項目のレビュー状態は期待結果の意味を人間が確認したかを表す。Objectに保持する「Testによる検証根拠の不足」は意味の未決とは異なり、実装後の別のAlderフォローアップで既存・新規Testの根拠を確認して保守する情報である。実装への引き渡し時点に、新規Testとの対応やTest evidenceの確定を要求しない。

外部の画面設計資料、システム要件書、検証結果は製品側が管理する。文書名は情報のまとまりを表し、専用ファイルや新しい台帳を要求しない。既存のIssue / PRや資料への参照で受け渡してもよい。検証結果はAlder実装レビュー、画面検証、システム要件・品質検証ごとの出所と証拠を区別して保持する。GUIを持たない製品では画面設計・画面検証を理由付きで非適用にできる。非適用は合格や未実施と区別する。

# Scope

この文書は、Alder利用者が業務設計を作成・合意し、現在の業務にProblem / Painがあれば任意で改善を検討し、合意済みの業務設計書と検査項目を後続の開発へ引き渡すまでを対象とする。設計・改善・実現と検証は一つのBusiness Designを業務上の正本として共有する。業務改善レビューは正常に成立している業務に対する任意の業務であり、設計の失敗や例外による差し戻しではない。改善候補を採用するのは依頼者・責任者であり、採用時には業務設計を改訂・再合意してから検査項目や実装を更新する。未承認の候補は現在の業務設計書に含めない。標準設計業務は合意済み業務設計書と検査項目の引き渡しで完了する。

画面設計、システム全体の要件・品質条件を整理するシステム設計、実装、実装後のAlder実装レビュー・製品検証・検証結果の統合は、前後の受け渡しを示すScope外の業務である。Alder実装レビューはAlderの開発ループで必須だが、この標準設計業務の境界には含めない。画面設計、SRの作成・妥当性・完全性の確認、UIや性能・安全性・運用等の実検証は製品側の責務であり、Alderレビューが代行・保証するものではない。検証結果の統合は報告と証拠の整理までを扱い、製品の採否・リリースを判断しない。Scope外であることは、製品に必要な作業を省略してよいという意味ではない。

同期漏れ検査は疑いが生じたときだけ使う任意の診断として独立させる。Business Graph JSONは外部ツール向けの任意の中間投影形式で、標準Activityや依頼者への成果物ではない。Alderという手法自体の研究、ガイド改訂の採否、PR・Release、製品の採否判断・デプロイの手順は記述しない。Activity Scopeのtrueは標準設計業務とその任意の診断、falseは受け渡しを示す範囲外の業務を表す。Object Scopeのtrueはこの業務境界内で成立・管理する成果物またはAlderが提供する知識・照合情報、falseは依頼者や範囲外の業務が成立・管理するObjectを表す。Input / Outputの向きだけで内外を決めない。

# Object 依頼者

## Scope

false

## Icon

users

## Information

- システム要件
- フィードバック・レビュー結果
- 業務上の判断・承認

# Object 業務設計書

## Scope

true

## Icon

file-text

## Information

- 業務範囲・目的
- 業務手順・入出力
- 業務間の相関・例外
- 現在の業務で経験されるProblem / Pain（ある場合）
- 期待結果・未決事項

# Object システム要件書

## Scope

false

## Icon

file-text

## Information

- 技術要件
- インフラ・開発言語・アーキテクチャ・フレームワーク
- 保守・性能・セキュリティ・運用等の適用要件と検証条件
- 要件の出所・版・適用範囲・担当責任者・未決事項
- 画面設計・画面検証の適用有無と非適用の理由

# Object 画面設計資料

## Scope

false

## Icon

panels-top-left

## Information

- 画面Reference（画面要件・部品・操作・表示状態）
- 画面チェックリスト・検証条件
- 対象版・適用範囲・確認結果・未決事項

# Object Alder: 業務相関ナレッジ

## Scope

true

## Icon

book-open

## Information

- 状態遷移・前後業務の確認観点

# Object Alder: 業務ナレッジ

## Scope

true

## Icon

book-open

## Information

- 業務手順・条件・考慮事項の確認観点
- Problem起点の改善レビューの観点

# Object Alder: 検査項目設計ナレッジ

## Scope

true

## Icon

book-open

## Information

- 検査項目の導出・レビュー観点
- IDと追跡関係の保守観点

# Object 判断記録

## Scope

true

## Icon

notebook-pen

## Information

- 判断内容・理由
- 残る制約・未決事項

# Object 検査項目

## Scope

true

## Icon

list-checks

## Information

- 期待結果・レビュー状態
- Business DesignとTestの対応
- Testによる検証根拠の不足

# Object コード

## Scope

false

## Icon

file-code

## Information

- 実装された振る舞い
- 変更内容
- 実装対象版・実行可能な成果物への参照

# Object テスト

## Scope

false

## Icon

flask-conical

## Information

- 実行可能な検証ケース・アサーション
- 検証対象と期待結果

# Object 検証結果

## Scope

false

## Icon

clipboard-check

## Information

- 検証元（Alder実装レビュー・画面検証・システム要件／品質検証）と担当責任者
- 実装・設計・要件の対象版と検証範囲
- 検査根拠・実行条件・観測結果・証拠への参照
- 合格・不合格・未実施・未決の区別と残る未検証範囲
- 非適用の理由・判断者

# Object 統合検証結果

## Scope

false

## Icon

files

## Information

- 対象版・要件・各検証結果への参照と対応
- 検証元ごとの結論・根拠・未検証範囲・非適用の理由
- 版や結論の不一致・未決事項・担当責任者

# Object 同期照合情報

## Scope

true

## Icon

fingerprint

## Information

- 原文・Check・Testの照合基準
- 検出されたTestの識別情報

# Object 同期漏れの候補

## Scope

true

## Icon

scan-search

## Information

- 古い関係・欠落の候補
- 再確認の理由

# Activity 業務設計

## Scope

true

## Why

業務上の意味と保証の合意

## When

目的・変更要求・現在業務のProblem / Painの記録依頼を受領したとき、または改善候補の採用判断を受けたとき

## Exception When

- 検査項目の設計 — 検査項目レビューで業務上の意味・条件・保証の修正や未決事項の解消が必要と判明したとき
- 実装 — 未決定の業務上の意味が見つかったとき

## Who

業務設計者

## Where

規定なし

## How

### Input

- 依頼者 — システム要件 / 現場で認識されたProblem・Pain / レビュー結果 / 改善候補の採用判断
- 業務設計書 — 現行業務要件 / 期待結果 / 未決事項 / Problem / Pain
- Alder: 業務相関ナレッジ — 状態遷移・前後業務の確認観点
- Alder: 業務ナレッジ — 業務手順・条件・考慮事項の確認観点

### Procedure

1. 業務設計者は依頼者からシステム要件、現場で認識されたProblem / Pain、または改善候補の採用判断を受け取る。更新時には業務設計書の現行業務要件・期待結果・未決事項とProblem / Painを確認する。変更が手段や新フローだけで提示され、背景を知ると案の採否が変わり得る場合は、草案化の前に必要な背景を依頼者へ確認する。会話や業務設計書にある背景と確定決定は聞き直さず、検討案か決定事項かも不明な場合だけ短く確認する。既知の範囲は未決事項を区別して進め、5W1H + Input / Output / Resultの形式で業務設計書の業務要件と期待結果を作成・更新する。現在の業務が成立していても困っていることがあれば、その具体的なProblemと相対的なPain levelを依頼者と確認して業務設計書へ記録する。未決の業務仕様とは区別し、改善のためにProblemを捏造しない。本文は依頼者が実際に使用する言語で書き、スコープ、業務手順、業務相関を整理する。AIは草案作成を支援できるが、責任を持つ人間の業務設計者が意味を確認する。
2. 業務設計者はAlder: 業務相関ナレッジを使って業務相関をレビューし、状態遷移と前後業務の確認結果を業務設計書へ反映して未決事項を整理する。
3. 業務設計者はAlder: 業務ナレッジを使って業務手順・条件・考慮事項をレビューし、確認結果を業務設計書へ反映して未決事項を整理する。
4. 改善候補が採用された場合、業務設計者は採用判断に基づく業務上の意味と残るProblem / Painを業務設計書に反映する。採用されない候補は現在の業務要件として記載しない。業務設計者は依頼者へ業務設計案と確認事項を伝えてレビューを依頼する。依頼者からレビュー結果を受け取り、未決事項について必要な判断も確認して、業務設計書と未決事項を更新する。
5. 依頼者や責任者の判断で未決事項が解消された時点で、確定した重要な判断と結果を判断記録（Decision Record）へ残す。どの未決事項を誰が判断し、何が確定したかを記録する。業務上の意味は業務設計書にも反映し、判断記録だけを正本の代わりにしない。
6. 業務設計書と未決事項が依頼者と合意できる状態になるまで、必要なレビューと修正を繰り返す。確認済みの内容と未決事項を区別し、将来のあらゆる方針の確定は求めない。

### Output

- 業務設計書 — 業務要件 / 期待結果 / 未決事項 / Problem / Pain
- 判断記録 — 判断内容 / 結果
- 依頼者 — 業務設計案 / レビュー依頼 / 確認事項

## Result

業務上の意味・手順・業務相関と、記録したProblem / Painが依頼者と確認・合意され、検査項目の設計または任意の業務改善レビューを開始できる。

# Activity 業務改善レビュー

## Scope

true

## Why

現在の業務上の困りごとに対する改善余地の検討

## When

合意済みの業務設計書に具体的なProblem / Painがあり、改善検討を依頼されたとき

## Who

業務設計者

## Where

規定なし

## How

### Input

- 業務設計書 — 現在の業務上の意味 / Problem / Pain
- 依頼者 — 改善検討の依頼 / 記録済みProblemの補足
- Alder: 業務ナレッジ — Problem起点の改善レビューの観点

### Procedure

1. 業務設計者は依頼者から改善検討の依頼と記録済みProblemの補足を受け、合意済み業務設計書に記録されたProblem / Painと維持すべき業務上の意味を確認する。新たな困りごとは先に業務設計で記録・確認し、未決の業務仕様と混同しない。
2. 業務設計者はAlder: 業務ナレッジの改善レビューの観点を使い、AIの提案支援を受けてProblemに関係する範囲で少数の代替業務案を検討する。Scopeと業務変更のDifficulty、期待する効果、前提と未確認事項を区別する。採用案が0件でもよい。
3. 業務設計者は依頼者へ改善候補と比較根拠、採用前に確認すべき事項を伝える。候補の採否は依頼者・責任者が判断する。このレビューでは業務設計書を変更しない。採用判断を受けた場合だけ、業務設計へ通常の情報の受け渡しとして渡し、業務設計書の更新・再合意を行う。候補の評価は現在の業務上の事実として扱わない。

### Output

- 依頼者 — 改善候補 / 比較根拠 / 確認事項

## Result

業務上の困りごとに対する候補と前提が依頼者に示され、採否を判断できる。採用時には業務設計書の更新・再合意へ進める。

# Activity 検査項目の設計

## Scope

true

## Why

期待結果と検証範囲の確認

## When

業務設計書の合意完了

## Who

業務設計者

## Where

規定なし

## How

### Input

- 業務設計書 — 業務要件 / 期待結果
- 検査項目 — 現行項目 / ID / レビュー状態 / 既存対応関係
- Alder: 検査項目設計ナレッジ — 検査項目の導出・レビュー・追跡関係の確認観点
- 依頼者 — 検査項目レビュー結果

### Procedure

業務設計者は、Alder: 検査項目設計ナレッジを使い、AIの草案・更新支援を受けて検査項目を整え、依頼者と期待結果を確認する。

1. 業務設計者は、業務設計書全体の業務要件・期待結果とAlder: 検査項目設計ナレッジを確認し、AIの草案作成支援を受けて検査項目の初版または更新案を作る。更新時は既存の検査項目を読み、ID、レビュー状態、業務設計書や既存Testとの対応を確認する。
2. 業務設計者は依頼者へ検査項目案の期待結果と確認事項を説明し、レビューを依頼する。
3. 業務設計者は依頼者から検査項目レビュー結果を受け取る。修正要求や確認結果もこの結果として扱う。
4. 業務設計者はAIの更新支援を受けて、検査項目自体の修正で解消できるレビュー結果を反映する。既存IDと業務設計書・既存Testとの追跡関係を保ち、レビュー状態（未レビュー / 要確認 / 確認済み / 要修正）を更新する。直接編集した場合も対応関係を確認する。
5. 業務設計者は依頼者と合意できるまで説明、レビュー、更新を繰り返す。確認済みの期待結果と未確認の候補を区別し、検査項目を実装へ渡す。

### Exception

- 検査項目レビューで業務上の意味・条件・保証の修正や未決事項が判明したときは、検査項目側で決めずに業務設計へ戻す。業務設計書が修正・合意された後、その内容から検査項目を更新し、レビューを再開する。

### Output

- 検査項目 — 期待結果 / レビュー状態 / 業務設計書との対応
- 依頼者 — 検査項目案 / レビュー依頼 / 確認事項

## Result

検査すべき期待結果が依頼者と合意され、実装へ引き渡せる。

# Activity システム設計

## Scope

false

## Why

業務上の意図を実現するシステム要件と技術手段の整理

## When

技術検討の依頼

## Who

システム開発者

## Where

規定なし

## How

### Input

- 業務設計書 — 業務要件
- 依頼者 — 製品全体の要求 / 既存の技術・運用上の制約

### Procedure

1. システム開発者は業務設計書の業務要件と依頼者から受け取る製品全体の要求・既存制約を基に、適用するシステム要件（SR）を整理する。保守・性能・セキュリティ・運用等の必要な品質条件と、対象環境・確認方法・判定根拠となる検証条件をシステム要件書へまとめる。SRの作成・妥当性・完全性の確認は製品側が担う。
2. システム開発者は必要な技術手段を検討し、インフラ・開発言語・アーキテクチャ・フレームワーク等の現在の技術条件を同じシステム要件書へ記録する。GUIの有無も確認し、画面を持たないバッチ・CLI等では画面設計・画面検証の非適用理由を残す。技術検討の詳細はAlderでは規定しない。
3. 要件の出所・版・適用範囲と担当責任者を残し、確定した条件と未決事項を分けて実装へ渡す。未提示・未決の要件を「要件なし」と扱わず、影響する作業と確認先を明らかにする。業務上の意味は業務設計書を正本とし、SRで上書きしない。

### Output

- システム要件書 — 適用SR / 技術要件 / 品質の検証条件 / 画面設計・検証の適用有無 / 未決事項と担当責任者

## Result

システム全体の適用要件と検証条件、残る未決事項が区別され、画面設計・実装・製品検証へ引き渡せる。

# Activity 画面設計

## Scope

false

## Why

利用者が業務を行える画面と確認条件の具体化

## When

GUIを備える実装範囲の業務要件・確認済み検査項目と、適用SRの提供状況が示されたとき

## Who

画面設計者

## Where

製品が対象とする画面の利用環境

## How

### Input

- 業務設計書 — 業務手順 / 入出力 / 利用環境
- 検査項目 — 確認済みの業務上の期待結果
- システム要件書 — 画面に関係する適用SR / 技術条件
- 依頼者 — 画面要件 / 画面案の確認結果

### Procedure

1. 画面設計者は業務設計書、確認済み検査項目、システム要件書と依頼者の画面要件を読み、対象範囲の画面・部品・操作・表示状態を画面Referenceとして画面設計資料へまとめる。同じ資料に画面チェックリストと実際の画面で確かめる検証条件を整理する。
2. 画面設計者は画面案と確認事項を依頼者へ示し、確認結果を反映する。対象版・適用範囲・確認結果と未決事項を区別して実装へ渡す。SR等の未提供・未決がある場合は、それに依存する範囲と確認先を明らかにし、影響しない範囲は進める。画面設計資料で業務上の意味や確認済みの期待結果を変更しない。

### Output

- 画面設計資料 — 画面Reference / 画面チェックリスト・検証条件 / 確認結果と未決事項
- 依頼者 — 画面案 / 確認事項

## Result

実装する画面と検証時に確かめる条件が整理され、実装・画面検証へ引き渡せる。

# Activity 実装

## Scope

false

## Why

意図した業務の実現

## When

確認済み検査項目の実装依頼と、対象範囲の適用SR・GUI画面設計資料の提供状況を受領したとき

## Who

システム開発者

## Where

規定なし

## How

### Input

- 業務設計書 — 業務要件
- システム要件書 — 適用SR / 技術要件 / 品質の検証条件 / 未決事項
- 画面設計資料 — GUI対象範囲の画面Reference / 画面チェックリスト・検証条件 / 未決事項
- 検査項目 — 確認済み期待結果
- コード — 既存の実装
- テスト — 既存のテスト

### Procedure

1. システム開発者は業務設計書の業務要件と検査項目の確認済み期待結果、システム要件書の適用SR・技術要件・検証条件を受け取る。GUIの対象範囲では画面設計資料の画面Referenceと画面チェックリスト・検証条件も受け取り、既存のコードとテストを踏まえて、コードと実行可能なテストを作成・更新する。
2. 使用した設計・要件の版と実装対象版を特定できるようにし、実行可能な成果物への参照をコードとともに渡す。入力の未提供・未決がある場合は、影響範囲・進められない作業・確認先を明らかにし、影響しない範囲は進める。外部の画面・SR・検証結果を業務設計書や確認済み期待結果の代わりにしない。

### Exception

- 実装中に未決定の業務上の意味が明らかになったときは、コードやテストで方針を決めず、具体的な問いを業務設計へ戻す。

### Output

- コード — 実装結果 / 対象版 / 実行可能な成果物への参照
- テスト — 実行可能な検証

## Result

合意済みの業務要件と検査項目を受けた実装が用意され、製品側の検証へ進める。

# Activity Alder実装レビュー

## Scope

false

## Why

業務上の意味と提供済みSRに対する実装適合・検証根拠の確認

## When

実装・テストと比較対象の設計・要件の版が示されたとき

## Who

実装レビュー担当者

## Where

規定なし

## How

### Input

- 業務設計書 — 合意済み業務要件 / 期待結果
- 検査項目 — 確認済み期待結果 / レビュー状態 / Testとの対応
- 判断記録 — 文書化された判断と理由
- システム要件書 — 提供済みSRの出所・版・適用範囲 / 未決事項
- コード — 対象版の実装
- テスト — 対象版の検証ケース・アサーション
- 検証結果 — 利用可能な製品検証の実行結果・証拠

### Procedure

1. 実装レビュー担当者は、実装時の作業履歴を共有しない別のAIまたは新しいコンテキストで、業務設計書、検査項目、判断記録、提供済みのシステム要件書を読み、対象版のコード・テストと利用可能な検証結果を照合する。レビュー中は設計・実装・対応記録を変更しない。
2. 業務上の期待結果とTestの検証内容、変更範囲に適用するSRへの適合を確認し、根拠・不一致・未決の業務判断・不足する証拠を検証結果へ記録する。SRの未提示・未読・非適用を区別し、非適用には理由を残す。レビューはSRの妥当性・完全性や、未実施のUI・性能・安全性・運用試験の成功を保証しない。

### Output

- 検証結果 — Alder実装レビューの対象版・範囲 / 適合所見・根拠 / 未決事項・検証不足

## Result

実装の適合所見と確認できない範囲が区別され、製品検証の結果と合わせて整理できる。

# Activity 製品検証

## Scope

false

## Why

実際の製品が画面・システム要件と品質条件を満たすかの確認

## When

検証対象版の実装と適用する検証条件が用意されたとき

## Who

検証担当者

## Where

適用する画面・システム要件の検証環境

## How

### Input

- コード — 検証対象版の実装 / 実行可能な成果物への参照
- テスト — 実行可能な検証ケース・期待結果
- システム要件書 — 適用SR / 品質の検証条件 / 画面検証の適用有無 / 未決事項
- 画面設計資料 — GUI対象範囲の画面Reference / 画面チェックリスト・検証条件

### Procedure

1. 検証担当者はコードの対象版・成果物とテストを受け取り、システム要件書の適用範囲と検証条件に沿ってテストや性能・安全性・運用等の検証を実施する。GUIの対象範囲では、実際の画面を操作して画面設計資料のReference・チェックリストと照合する。方法・環境・必要な試験の選択は製品側が担う。
2. 画面検証とSR・品質検証を区別し、対象版・条件・観測結果・証拠への参照・担当責任者を検証結果へ残す。合格・不合格、実施できなかった範囲、条件が未決の範囲を分け、非GUI製品の画面検証はシステム要件書の非適用理由を引き継ぐ。自動テストの成功だけから、実際には観測していない画面・品質条件の合格を推定しない。

### Output

- 検証結果 — 画面検証とSR・品質検証それぞれの対象版・範囲・担当責任者 / 観測結果・証拠 / 未実施・未決・非適用

## Result

実検証で確認できた条件と残る未検証範囲が明らかになり、Alder実装レビューの所見と合わせて整理できる。

# Activity 検証結果の統合

## Scope

false

## Why

製品の採否判断に必要な検証範囲・根拠・残課題の明確化

## When

対象版の各検証結果、または未実施・未決の状態が示されたとき

## Who

検証担当者

## Where

規定なし

## How

### Input

- コード — 実装対象版 / 実行可能な成果物への参照
- 業務設計書 — 比較対象の業務要件と版
- 検査項目 — 確認済み期待結果と版
- システム要件書 — 適用SR・検証条件と版 / 非適用の理由 / 未決事項と担当責任者
- 画面設計資料 — GUI対象範囲の画面Reference・検証条件と版
- 検証結果 — Alder実装レビュー・画面検証・SR品質検証それぞれの結果 / 根拠 / 未検証範囲・未決事項

### Procedure

1. 検証担当者はコードの対象版に対し、業務設計書・検査項目・システム要件書とGUI対象範囲の画面設計資料の版・適用範囲を確認する。検証結果に含まれる各報告の検査根拠・対象版・範囲を照合する。
2. 検証元ごとに合格・不合格・未実施・未決と非適用を区別し、元の所見と分類を保ったまま、根拠への参照、版や結論の不一致、残る未検証範囲と担当責任者を統合検証結果へまとめる。対象版や条件が変わった範囲は再検証が必要と示し、過去の結果を現行版の合格根拠にしない。未提供の結果や責任者不明もそのまま明示し、全体合格に読み替えない。結果全文のコピーや専用の報告書は要求しない。
3. 依頼者へ統合検証結果と残る確認事項を渡す。統合では業務設計書・確認済み期待結果や原報告を上書きせず、製品として受け入れるか、何を修正・保留するかは人間が別に判断する。統合の完了は採用・merge・releaseの承認ではない。

### Output

- 統合検証結果 — 対象版と各検証の対応 / 根拠への参照 / 不一致・未検証・未決事項・担当責任者
- 依頼者 — 統合検証結果への参照 / 残る確認事項

## Result

確認できた範囲と残課題が検証元・対象版に沿って整理され、人間が製品の採否や追加対応を判断できる。

# Activity 同期漏れ検査

## Scope

true

## Why

原文・検査項目・テストの同期漏れの検出

## When

業務設計書・検査項目・テストの対応関係に同期漏れの疑いが生じたとき

## Who

システム開発者

## Where

規定なし

## How

### Input

- 業務設計書 — 現行原文項目
- 検査項目 — 現在のCheck本文
- 同期照合情報 — 原文・Check・Testの照合基準 / Test ID
- テスト — 期待結果 / アサーション

### Procedure

システム開発者は、通常工程で維持される追跡関係の同期漏れが疑われる部分を任意に診断し、再確認候補を検出する。試行用のフィクスチャまたはプロダクト用アダプターで読み取り専用の検出器を実行し、文章の更新状態と業務上の正しさを区別する。

1. システム開発者は業務設計書の現行原文項目、検査項目のCheck本文、同期照合情報のpinとTest IDを照合し、人間のレビュー状態を変更せずに更新状態と参照の不一致を算出する。
2. 古くなった関係や欠落した関係を理由とともに再確認の候補として記録する。不具合として自動分類しない。
3. 影響するCheckを原文と照合する。Check本文の変更と原文の再確認を区別して同期照合情報を更新する。
4. 変更したCheckの期待結果をテストの期待結果・アサーションと照合する。照合を完了した関係だけpinを更新し、検査結果と残る再確認候補をまとめる。

### Output

- 同期漏れの候補 — 再確認候補 / 理由
- 同期照合情報 — 照合済みの基準値

## Result

疑いのある対応関係の照合状態と再確認候補が明らかになり、影響する検査項目を再確認できる。
`,qd=`{
  "format": "alder-document-package",
  "formatVersion": "0.4",
  "revision": "alder-design-package-1",
  "documents": [
    {
      "id": "alder-design",
      "schemaVersion": "0.3",
      "kind": "businessDesign",
      "revision": "alder-design-1",
      "title": "Alderを使った設計業務 — Business Design",
      "preface": "この文書は、Alderを使って業務を設計し、必要に応じて業務改善を検討し、検査項目を作成して後続の開発へ引き渡す利用業務を記述する。引き渡し前後の画面・システム設計、実装、検証と結果統合は、責任範囲外の業務との受け渡しとして記述する。Alderそのものの研究・保守・リリースは含まない。業務上の意図の唯一の正本（SSOT）はBusiness Designであり、コード、テスト、Check Item、Decision Record、生成されたGraph JSONはその代わりにならない。この文書は依頼者による業務上の意味のレビューを待つ草案であり、exportやテストの成功は承認を意味しない。\\n\\nBusiness Designは依頼者との合意に使う文書である。本文は依頼者が実際に使用する言語で書き、依頼者自身が内容を理解し、誤りを指摘し、合意できることを前提とする。今回の本文は日本語とする。ヘッダーやセクション名は英語でもよい。\\n\\n各Activityは責務を示しており、必ず順番に実行する工程ではない。1人が複数の役割を担ってもよい。**Whoはその業務を行うロール**を表し、同じ役割には同じ短い名称を使う。AIや人間への割り当て、支援者、確認者の分担はProcedureに記す。一方、\`依頼者\` Objectは、担当者が意図を受け取ったり、質問や結果を返したりする外部の相手を表す。同じ人が両方に関わる場合も、この2つの役割は区別する。\\n\\n既存の運用規則の参照元は、[導入ガイド](../../docs/adoption.md)、[業務改善レビュー](../../docs/optimization-review.md)、[レビュー知識 v0.3](../../docs/phase2/review-knowledge-v0.3.md)、[Checkの追跡関係](../../docs/check-item-traceability.md)、[任意のDrift試行](../../docs/traceability-drift/study.md)である。Activity・Objectと、そのInput / Outputの参照から接続を読み取る。業務設計書と検査項目は一つのJSONに保持し、ID・参照・版はPluginが管理する。人間はViewerで業務の内容を確認し、AIに作成・更新を依頼する。Iconは提案や指示により変更できる。Input / OutputはObjectと業務の間で実際に受け渡す情報を表し、一般的な参照資料の一覧にはしない。業務要件の問題による業務間の差し戻しは、発生側のHow / Exceptionと、再開側のException Whenまたは末尾の例外フローで表す。Graphの関係は再開側で一度だけ記述する。\\n\\n\`Alder: 検査項目設計ナレッジ\` の現行内容は[検査項目の作成・レビュー手順](../../docs/adoption.md#draft-and-review-check-items-required)と[追跡関係](../../docs/check-item-traceability.md)にある。\\n\\n検査項目のレビュー状態は期待結果の意味を人間が確認したかを表す。Objectに保持する「Testによる検証根拠の不足」は意味の未決とは異なり、実装後の別のAlderフォローアップで既存・新規Testの根拠を確認して保守する情報である。実装への引き渡し時点に、新規Testとの対応やTest evidenceの確定を要求しない。\\n\\n外部の画面設計資料、システム要件書、検証結果は製品側が管理する。文書名は情報のまとまりを表し、専用ファイルや新しい台帳を要求しない。既存のIssue / PRや資料への参照で受け渡してもよい。検証結果はAlder実装レビュー、画面検証、システム要件・品質検証ごとの出所と証拠を区別して保持する。GUIを持たない製品では画面設計・画面検証を理由付きで非適用にできる。非適用は合格や未実施と区別する。",
      "scope": "この文書は、Alder利用者が業務設計を作成・合意し、現在の業務にProblem / Painがあれば任意で改善を検討し、合意済みの業務設計書と検査項目を後続の開発へ引き渡すまでを対象とする。設計・改善・実現と検証は一つのBusiness Designを業務上の正本として共有する。業務改善レビューは正常に成立している業務に対する任意の業務であり、設計の失敗や例外による差し戻しではない。改善候補を採用するのは依頼者・責任者であり、採用時には業務設計を改訂・再合意してから検査項目や実装を更新する。未承認の候補は現在の業務設計書に含めない。標準設計業務は合意済み業務設計書と検査項目の引き渡しで完了する。\\n\\n画面設計、システム全体の要件・品質条件を整理するシステム設計、実装、実装後のAlder実装レビュー・製品検証・検証結果の統合は、前後の受け渡しを示すScope外の業務である。Alder実装レビューはAlderの開発ループで必須だが、この標準設計業務の境界には含めない。画面設計、SRの作成・妥当性・完全性の確認、UIや性能・安全性・運用等の実検証は製品側の責務であり、Alderレビューが代行・保証するものではない。検証結果の統合は報告と証拠の整理までを扱い、製品の採否・リリースを判断しない。Scope外であることは、製品に必要な作業を省略してよいという意味ではない。\\n\\n同期漏れ検査は疑いが生じたときだけ使う任意の診断として独立させる。Business Graph JSONは外部ツール向けの任意の中間投影形式で、標準Activityや依頼者への成果物ではない。Alderという手法自体の研究、ガイド改訂の採否、PR・Release、製品の採否判断・デプロイの手順は記述しない。Activity Scopeのtrueは標準設計業務とその任意の診断、falseは受け渡しを示す範囲外の業務を表す。Object Scopeのtrueはこの業務境界内で成立・管理する成果物またはAlderが提供する知識・照合情報、falseは依頼者や範囲外の業務が成立・管理するObjectを表す。Input / Outputの向きだけで内外を決めない。",
      "objects": [
        {
          "id": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "name": "依頼者",
          "scope": false,
          "icon": "users",
          "information": [
            "システム要件",
            "フィードバック・レビュー結果",
            "業務上の判断・承認"
          ]
        },
        {
          "id": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "name": "業務設計書",
          "scope": true,
          "icon": "file-text",
          "information": [
            "業務範囲・目的",
            "業務手順・入出力",
            "業務間の相関・例外",
            "現在の業務で経験されるProblem / Pain（ある場合）",
            "期待結果・未決事項"
          ]
        },
        {
          "id": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "name": "システム要件書",
          "scope": false,
          "icon": "file-text",
          "information": [
            "技術要件",
            "インフラ・開発言語・アーキテクチャ・フレームワーク",
            "保守・性能・セキュリティ・運用等の適用要件と検証条件",
            "要件の出所・版・適用範囲・担当責任者・未決事項",
            "画面設計・画面検証の適用有無と非適用の理由"
          ]
        },
        {
          "id": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "name": "画面設計資料",
          "scope": false,
          "icon": "panels-top-left",
          "information": [
            "画面Reference（画面要件・部品・操作・表示状態）",
            "画面チェックリスト・検証条件",
            "対象版・適用範囲・確認結果・未決事項"
          ]
        },
        {
          "id": "8923acfa-5c39-5207-b14b-3aa42260f010",
          "name": "Alder: 業務相関ナレッジ",
          "scope": true,
          "icon": "book-open",
          "information": [
            "状態遷移・前後業務の確認観点"
          ]
        },
        {
          "id": "dfe4f16e-dc2c-579c-a3f6-b498dfa04bda",
          "name": "Alder: 業務ナレッジ",
          "scope": true,
          "icon": "book-open",
          "information": [
            "業務手順・条件・考慮事項の確認観点",
            "Problem起点の改善レビューの観点"
          ]
        },
        {
          "id": "31027247-2568-5a9a-b6ed-22efb0c9e0d8",
          "name": "Alder: 検査項目設計ナレッジ",
          "scope": true,
          "icon": "book-open",
          "information": [
            "検査項目の導出・レビュー観点",
            "IDと追跡関係の保守観点"
          ]
        },
        {
          "id": "9cac475b-2725-5274-8724-02b909bc50d1",
          "name": "判断記録",
          "scope": true,
          "icon": "notebook-pen",
          "information": [
            "判断内容・理由",
            "残る制約・未決事項"
          ]
        },
        {
          "id": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "name": "検査項目",
          "scope": true,
          "icon": "list-checks",
          "information": [
            "期待結果・レビュー状態",
            "Business DesignとTestの対応",
            "Testによる検証根拠の不足"
          ]
        },
        {
          "id": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "name": "コード",
          "scope": false,
          "icon": "file-code",
          "information": [
            "実装された振る舞い",
            "変更内容",
            "実装対象版・実行可能な成果物への参照"
          ]
        },
        {
          "id": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "name": "テスト",
          "scope": false,
          "icon": "flask-conical",
          "information": [
            "実行可能な検証ケース・アサーション",
            "検証対象と期待結果"
          ]
        },
        {
          "id": "b468672a-c472-5407-8656-5202cbdfc19f",
          "name": "検証結果",
          "scope": false,
          "icon": "clipboard-check",
          "information": [
            "検証元（Alder実装レビュー・画面検証・システム要件／品質検証）と担当責任者",
            "実装・設計・要件の対象版と検証範囲",
            "検査根拠・実行条件・観測結果・証拠への参照",
            "合格・不合格・未実施・未決の区別と残る未検証範囲",
            "非適用の理由・判断者"
          ]
        },
        {
          "id": "4657b60d-dd29-5ecd-88a7-594fdcf3befd",
          "name": "統合検証結果",
          "scope": false,
          "icon": "files",
          "information": [
            "対象版・要件・各検証結果への参照と対応",
            "検証元ごとの結論・根拠・未検証範囲・非適用の理由",
            "版や結論の不一致・未決事項・担当責任者"
          ]
        },
        {
          "id": "a03a2276-7aa5-596c-8f18-5510afae5fbe",
          "name": "同期照合情報",
          "scope": true,
          "icon": "fingerprint",
          "information": [
            "原文・Check・Testの照合基準",
            "検出されたTestの識別情報"
          ]
        },
        {
          "id": "69c0151d-4d7a-5b1c-a5a9-65e63eeedd3b",
          "name": "同期漏れの候補",
          "scope": true,
          "icon": "scan-search",
          "information": [
            "古い関係・欠落の候補",
            "再確認の理由"
          ]
        }
      ],
      "activities": [
        {
          "id": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "name": "業務設計",
          "scope": true,
          "why": "業務上の意味と保証の合意",
          "when": "目的・変更要求・現在業務のProblem / Painの記録依頼を受領したとき、または改善候補の採用判断を受けたとき",
          "who": "業務設計者",
          "where": "規定なし",
          "procedure": "1. 業務設計者は依頼者からシステム要件、現場で認識されたProblem / Pain、または改善候補の採用判断を受け取る。更新時には業務設計書の現行業務要件・期待結果・未決事項とProblem / Painを確認する。変更が手段や新フローだけで提示され、背景を知ると案の採否が変わり得る場合は、草案化の前に必要な背景を依頼者へ確認する。会話や業務設計書にある背景と確定決定は聞き直さず、検討案か決定事項かも不明な場合だけ短く確認する。既知の範囲は未決事項を区別して進め、5W1H + Input / Output / Resultの形式で業務要件と期待結果を整理し、Pluginに依頼して業務設計書のJSONを作成・更新する。現在の業務が成立していても困っていることがあれば、その具体的なProblemと相対的なPain levelを依頼者と確認して業務設計書へ記録する。未決の業務仕様とは区別し、改善のためにProblemを捏造しない。本文は依頼者が実際に使用する言語で書き、スコープ、業務手順、業務相関を整理する。AIは草案作成を支援できるが、責任を持つ人間の業務設計者が意味を確認する。\\n2. 業務設計者はAlder: 業務相関ナレッジを使って業務相関をレビューし、状態遷移と前後業務の確認結果を業務設計書へ反映して未決事項を整理する。\\n3. 業務設計者はAlder: 業務ナレッジを使って業務手順・条件・考慮事項をレビューし、確認結果を業務設計書へ反映して未決事項を整理する。\\n4. 改善候補が採用された場合、業務設計者は採用判断に基づく業務上の意味と残るProblem / Painを業務設計書に反映する。採用されない候補は現在の業務要件として記載しない。業務設計者は依頼者へ業務設計案と確認事項を伝えてレビューを依頼する。依頼者からレビュー結果を受け取り、未決事項について必要な判断も確認して、業務設計書と未決事項を更新する。\\n5. 依頼者や責任者の判断で未決事項が解消された時点で、確定した重要な判断と結果を判断記録（Decision Record）へ残す。どの未決事項を誰が判断し、何が確定したかを記録する。業務上の意味は業務設計書にも反映し、判断記録だけを正本の代わりにしない。\\n6. 業務設計書と未決事項が依頼者と合意できる状態になるまで、必要なレビューと修正を繰り返す。確認済みの内容と未決事項を区別し、将来のあらゆる方針の確定は求めない。",
          "exception": null,
          "result": "業務上の意味・手順・業務相関と、記録したProblem / Painが依頼者と確認・合意され、検査項目の設計または任意の業務改善レビューを開始できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-285a6c5b4bca97f50fdc0951c4e888d5"
        },
        {
          "id": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "name": "業務改善レビュー",
          "scope": true,
          "why": "現在の業務上の困りごとに対する改善余地の検討",
          "when": "合意済みの業務設計書に具体的なProblem / Painがあり、改善検討を依頼されたとき",
          "who": "業務設計者",
          "where": "規定なし",
          "procedure": "1. 業務設計者は依頼者から改善検討の依頼と記録済みProblemの補足を受け、合意済み業務設計書に記録されたProblem / Painと維持すべき業務上の意味を確認する。新たな困りごとは先に業務設計で記録・確認し、未決の業務仕様と混同しない。\\n2. 業務設計者はAlder: 業務ナレッジの改善レビューの観点を使い、AIの提案支援を受けてProblemに関係する範囲で少数の代替業務案を検討する。Scopeと業務変更のDifficulty、期待する効果、前提と未確認事項を区別する。採用案が0件でもよい。\\n3. 業務設計者は依頼者へ改善候補と比較根拠、採用前に確認すべき事項を伝える。候補の採否は依頼者・責任者が判断する。このレビューでは業務設計書を変更しない。採用判断を受けた場合だけ、業務設計へ通常の情報の受け渡しとして渡し、業務設計書の更新・再合意を行う。候補の評価は現在の業務上の事実として扱わない。",
          "exception": null,
          "result": "業務上の困りごとに対する候補と前提が依頼者に示され、採否を判断できる。採用時には業務設計書の更新・再合意へ進める。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-285a6c5b4bca97f50fdc0951c4e888d5"
        },
        {
          "id": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "name": "検査項目の設計",
          "scope": true,
          "why": "期待結果と検証範囲の確認",
          "when": "業務設計書の合意完了",
          "who": "業務設計者",
          "where": "規定なし",
          "procedure": "業務設計者は、Alder: 検査項目設計ナレッジを使い、AIの草案・更新支援を受けて検査項目を整え、依頼者と期待結果を確認する。\\n\\n1. 業務設計者は、業務設計書全体の業務要件・期待結果とAlder: 検査項目設計ナレッジを確認し、AIの草案作成支援を受けて検査項目の初版または更新案を作る。更新時は既存の検査項目を読み、ID、レビュー状態、業務設計書や既存Testとの対応を確認する。\\n2. 業務設計者は依頼者へ検査項目案の期待結果と確認事項を説明し、レビューを依頼する。\\n3. 業務設計者は依頼者から検査項目レビュー結果を受け取る。修正要求や確認結果もこの結果として扱う。\\n4. 業務設計者はAIの更新支援を受けて、検査項目自体の修正で解消できるレビュー結果を反映する。既存IDと業務設計書・既存Testとの追跡関係を保ち、レビュー状態（未レビュー / 要確認 / 確認済み / 要修正）を更新する。更新後も対応関係を確認する。\\n5. 業務設計者は依頼者と合意できるまで説明、レビュー、更新を繰り返す。確認済みの期待結果と未確認の候補を区別し、検査項目を実装へ渡す。",
          "exception": "- 検査項目レビューで業務上の意味・条件・保証の修正や未決事項が判明したときは、検査項目側で決めずに業務設計へ戻す。業務設計書が修正・合意された後、その内容から検査項目を更新し、レビューを再開する。",
          "result": "検査すべき期待結果が依頼者と合意され、実装へ引き渡せる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-285a6c5b4bca97f50fdc0951c4e888d5"
        },
        {
          "id": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "name": "システム設計",
          "scope": false,
          "why": "業務上の意図を実現するシステム要件と技術手段の整理",
          "when": "技術検討の依頼",
          "who": "システム開発者",
          "where": "規定なし",
          "procedure": "1. システム開発者は業務設計書の業務要件と依頼者から受け取る製品全体の要求・既存制約を基に、適用するシステム要件（SR）を整理する。保守・性能・セキュリティ・運用等の必要な品質条件と、対象環境・確認方法・判定根拠となる検証条件をシステム要件書へまとめる。SRの作成・妥当性・完全性の確認は製品側が担う。\\n2. システム開発者は必要な技術手段を検討し、インフラ・開発言語・アーキテクチャ・フレームワーク等の現在の技術条件を同じシステム要件書へ記録する。GUIの有無も確認し、画面を持たないバッチ・CLI等では画面設計・画面検証の非適用理由を残す。技術検討の詳細はAlderでは規定しない。\\n3. 要件の出所・版・適用範囲と担当責任者を残し、確定した条件と未決事項を分けて実装へ渡す。未提示・未決の要件を「要件なし」と扱わず、影響する作業と確認先を明らかにする。業務上の意味は業務設計書を正本とし、SRで上書きしない。",
          "exception": null,
          "result": "システム全体の適用要件と検証条件、残る未決事項が区別され、画面設計・実装・製品検証へ引き渡せる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-89dad1594c2b0a2a5abc007054500e7b"
        },
        {
          "id": "23427931-db9c-5b16-a397-3fafd429d989",
          "name": "画面設計",
          "scope": false,
          "why": "利用者が業務を行える画面と確認条件の具体化",
          "when": "GUIを備える実装範囲の業務要件・確認済み検査項目と、適用SRの提供状況が示されたとき",
          "who": "画面設計者",
          "where": "製品が対象とする画面の利用環境",
          "procedure": "1. 画面設計者は業務設計書、確認済み検査項目、システム要件書と依頼者の画面要件を読み、対象範囲の画面・部品・操作・表示状態を画面Referenceとして画面設計資料へまとめる。同じ資料に画面チェックリストと実際の画面で確かめる検証条件を整理する。\\n2. 画面設計者は画面案と確認事項を依頼者へ示し、確認結果を反映する。対象版・適用範囲・確認結果と未決事項を区別して実装へ渡す。SR等の未提供・未決がある場合は、それに依存する範囲と確認先を明らかにし、影響しない範囲は進める。画面設計資料で業務上の意味や確認済みの期待結果を変更しない。",
          "exception": null,
          "result": "実装する画面と検証時に確かめる条件が整理され、実装・画面検証へ引き渡せる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-3534f43eafb8de2f57a7de0b5d561eab"
        },
        {
          "id": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "name": "実装",
          "scope": false,
          "why": "意図した業務の実現",
          "when": "確認済み検査項目の実装依頼と、対象範囲の適用SR・GUI画面設計資料の提供状況を受領したとき",
          "who": "システム開発者",
          "where": "規定なし",
          "procedure": "1. システム開発者は業務設計書の業務要件と検査項目の確認済み期待結果、システム要件書の適用SR・技術要件・検証条件を受け取る。GUIの対象範囲では画面設計資料の画面Referenceと画面チェックリスト・検証条件も受け取り、既存のコードとテストを踏まえて、コードと実行可能なテストを作成・更新する。\\n2. 使用した設計・要件の版と実装対象版を特定できるようにし、実行可能な成果物への参照をコードとともに渡す。入力の未提供・未決がある場合は、影響範囲・進められない作業・確認先を明らかにし、影響しない範囲は進める。外部の画面・SR・検証結果を業務設計書や確認済み期待結果の代わりにしない。",
          "exception": "- 実装中に未決定の業務上の意味が明らかになったときは、コードやテストで方針を決めず、具体的な問いを業務設計へ戻す。",
          "result": "合意済みの業務要件と検査項目を受けた実装が用意され、製品側の検証へ進める。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-89dad1594c2b0a2a5abc007054500e7b"
        },
        {
          "id": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "name": "Alder実装レビュー",
          "scope": false,
          "why": "業務上の意味と提供済みSRに対する実装適合・検証根拠の確認",
          "when": "実装・テストと比較対象の設計・要件の版が示されたとき",
          "who": "実装レビュー担当者",
          "where": "規定なし",
          "procedure": "1. 実装レビュー担当者は、実装時の作業履歴を共有しない別のAIまたは新しいコンテキストで、業務設計書、検査項目、判断記録、提供済みのシステム要件書を読み、対象版のコード・テストと利用可能な検証結果を照合する。レビュー中は設計・実装・対応記録を変更しない。\\n2. 業務上の期待結果とTestの検証内容、変更範囲に適用するSRへの適合を確認し、根拠・不一致・未決の業務判断・不足する証拠を検証結果へ記録する。SRの未提示・未読・非適用を区別し、非適用には理由を残す。レビューはSRの妥当性・完全性や、未実施のUI・性能・安全性・運用試験の成功を保証しない。",
          "exception": null,
          "result": "実装の適合所見と確認できない範囲が区別され、製品検証の結果と合わせて整理できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-38ef110c089e72658c209a855a988c09"
        },
        {
          "id": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "name": "製品検証",
          "scope": false,
          "why": "実際の製品が画面・システム要件と品質条件を満たすかの確認",
          "when": "検証対象版の実装と適用する検証条件が用意されたとき",
          "who": "検証担当者",
          "where": "適用する画面・システム要件の検証環境",
          "procedure": "1. 検証担当者はコードの対象版・成果物とテストを受け取り、システム要件書の適用範囲と検証条件に沿ってテストや性能・安全性・運用等の検証を実施する。GUIの対象範囲では、実際の画面を操作して画面設計資料のReference・チェックリストと照合する。方法・環境・必要な試験の選択は製品側が担う。\\n2. 画面検証とSR・品質検証を区別し、対象版・条件・観測結果・証拠への参照・担当責任者を検証結果へ残す。合格・不合格、実施できなかった範囲、条件が未決の範囲を分け、非GUI製品の画面検証はシステム要件書の非適用理由を引き継ぐ。自動テストの成功だけから、実際には観測していない画面・品質条件の合格を推定しない。",
          "exception": null,
          "result": "実検証で確認できた条件と残る未検証範囲が明らかになり、Alder実装レビューの所見と合わせて整理できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-4e820e9cd09f1bb95e4b58302c415d4e"
        },
        {
          "id": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "name": "検証結果の統合",
          "scope": false,
          "why": "製品の採否判断に必要な検証範囲・根拠・残課題の明確化",
          "when": "対象版の各検証結果、または未実施・未決の状態が示されたとき",
          "who": "検証担当者",
          "where": "規定なし",
          "procedure": "1. 検証担当者はコードの対象版に対し、業務設計書・検査項目・システム要件書とGUI対象範囲の画面設計資料の版・適用範囲を確認する。検証結果に含まれる各報告の検査根拠・対象版・範囲を照合する。\\n2. 検証元ごとに合格・不合格・未実施・未決と非適用を区別し、元の所見と分類を保ったまま、根拠への参照、版や結論の不一致、残る未検証範囲と担当責任者を統合検証結果へまとめる。対象版や条件が変わった範囲は再検証が必要と示し、過去の結果を現行版の合格根拠にしない。未提供の結果や責任者不明もそのまま明示し、全体合格に読み替えない。結果全文のコピーや専用の報告書は要求しない。\\n3. 依頼者へ統合検証結果と残る確認事項を渡す。統合では業務設計書・確認済み期待結果や原報告を上書きせず、製品として受け入れるか、何を修正・保留するかは人間が別に判断する。統合の完了は採用・merge・releaseの承認ではない。",
          "exception": null,
          "result": "確認できた範囲と残課題が検証元・対象版に沿って整理され、人間が製品の採否や追加対応を判断できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-4e820e9cd09f1bb95e4b58302c415d4e"
        },
        {
          "id": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "name": "同期漏れ検査",
          "scope": true,
          "why": "原文・検査項目・テストの同期漏れの検出",
          "when": "業務設計書・検査項目・テストの対応関係に同期漏れの疑いが生じたとき",
          "who": "システム開発者",
          "where": "規定なし",
          "procedure": "システム開発者は、通常工程で維持される追跡関係の同期漏れが疑われる部分を任意に診断し、再確認候補を検出する。試行用のフィクスチャまたはプロダクト用アダプターで読み取り専用の検出器を実行し、文章の更新状態と業務上の正しさを区別する。\\n\\n1. システム開発者は業務設計書の現行原文項目、検査項目のCheck本文、同期照合情報のpinとTest IDを照合し、人間のレビュー状態を変更せずに更新状態と参照の不一致を算出する。\\n2. 古くなった関係や欠落した関係を理由とともに再確認の候補として記録する。不具合として自動分類しない。\\n3. 影響するCheckを原文と照合する。Check本文の変更と原文の再確認を区別して同期照合情報を更新する。\\n4. 変更したCheckの期待結果をテストの期待結果・アサーションと照合する。照合を完了した関係だけpinを更新し、検査結果と残る再確認候補をまとめる。",
          "exception": null,
          "result": "疑いのある対応関係の照合状態と再確認候補が明らかになり、影響する検査項目を再確認できる。",
          "problem": null,
          "painLevel": null,
          "roleId": "role-89dad1594c2b0a2a5abc007054500e7b"
        }
      ],
      "relations": [
        {
          "id": "cd62ec7a-e8c9-55e8-b6cd-161930fac417",
          "kind": "business-exception",
          "fromId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "未決定の業務上の意味が見つかったとき"
        },
        {
          "id": "105ab071-170e-5772-917d-c01e005733f6",
          "kind": "business-exception",
          "fromId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "検査項目レビューで業務上の意味・条件・保証の修正や未決事項の解消が必要と判明したとき"
        },
        {
          "id": "4d51f2aa-a417-5596-81d5-e45b7acbd998",
          "kind": "input",
          "fromId": "31027247-2568-5a9a-b6ed-22efb0c9e0d8",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "検査項目の導出・レビュー・追跡関係の確認観点"
        },
        {
          "id": "f41e96b8-8b98-577a-aa97-54d0e6eb3cb8",
          "kind": "input",
          "fromId": "dfe4f16e-dc2c-579c-a3f6-b498dfa04bda",
          "toId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "label": "Problem起点の改善レビューの観点"
        },
        {
          "id": "43bea2d1-eea9-511d-a303-dcd2a9adbab3",
          "kind": "input",
          "fromId": "dfe4f16e-dc2c-579c-a3f6-b498dfa04bda",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "業務手順・条件・考慮事項の確認観点"
        },
        {
          "id": "6c4268c2-536d-5524-8918-37e906c2b763",
          "kind": "input",
          "fromId": "8923acfa-5c39-5207-b14b-3aa42260f010",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "状態遷移・前後業務の確認観点"
        },
        {
          "id": "21946fc1-7d74-5d67-83cc-755308974338",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "対象版の実装"
        },
        {
          "id": "07332462-0e8e-579b-816b-d14c9aad5753",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "既存の実装"
        },
        {
          "id": "2919ef13-37d6-5cd3-955f-080ca8a987df",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "実装対象版 / 実行可能な成果物への参照"
        },
        {
          "id": "f631da10-b421-5e28-a6e8-44afa8c1d757",
          "kind": "input",
          "fromId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "検証対象版の実装 / 実行可能な成果物への参照"
        },
        {
          "id": "9f33e8f9-5bc5-5ea8-92c0-01636dae87f6",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "提供済みSRの出所・版・適用範囲 / 未決事項"
        },
        {
          "id": "34658dd0-846d-53af-8ba1-3fc6c12ec21b",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "適用SR / 技術要件 / 品質の検証条件 / 未決事項"
        },
        {
          "id": "986e955f-3f70-57cc-ba2c-f0dc91c2ac6a",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "適用SR・検証条件と版 / 非適用の理由 / 未決事項と担当責任者"
        },
        {
          "id": "ade4ec7f-08f4-5f60-95e8-d40215086668",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "画面に関係する適用SR / 技術条件"
        },
        {
          "id": "0d3b983c-334f-5b12-b4ee-e5b7948cfa3b",
          "kind": "input",
          "fromId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "適用SR / 品質の検証条件 / 画面検証の適用有無 / 未決事項"
        },
        {
          "id": "d6cfe062-02eb-54bf-96c3-e61f1ebaca9d",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "対象版の検証ケース・アサーション"
        },
        {
          "id": "258ab72a-46ba-551d-bd2e-06e13974ad46",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "期待結果 / アサーション"
        },
        {
          "id": "839cd44f-e189-57dc-a0cc-bd03d468de94",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "既存のテスト"
        },
        {
          "id": "f1f6b117-1ede-5b6b-92be-6aa962651bb6",
          "kind": "input",
          "fromId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "実行可能な検証ケース・期待結果"
        },
        {
          "id": "9d9856a5-a95e-5375-9c7e-907d517cd55b",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "label": "製品全体の要求 / 既存の技術・運用上の制約"
        },
        {
          "id": "4fccf499-ded2-572f-b894-864cb5ee43a0",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "検査項目レビュー結果"
        },
        {
          "id": "672c60f6-e2cd-5d35-8b07-10ec4352ffbd",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "label": "改善検討の依頼 / 記録済みProblemの補足"
        },
        {
          "id": "53be3f0b-d858-5afc-8d34-559c239a041f",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "システム要件 / 現場で認識されたProblem・Pain / レビュー結果 / 改善候補の採用判断"
        },
        {
          "id": "bad78f03-703a-5d09-8b48-a1142c7a206b",
          "kind": "input",
          "fromId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "画面要件 / 画面案の確認結果"
        },
        {
          "id": "1c6cfe35-f2d5-53fd-bd4a-ffb21dd57881",
          "kind": "input",
          "fromId": "9cac475b-2725-5274-8724-02b909bc50d1",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "文書化された判断と理由"
        },
        {
          "id": "13e84091-0494-5b46-a015-47548177a457",
          "kind": "input",
          "fromId": "a03a2276-7aa5-596c-8f18-5510afae5fbe",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "原文・Check・Testの照合基準 / Test ID"
        },
        {
          "id": "e558474d-d3d9-5633-860d-28587639e5bf",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "確認済み期待結果 / レビュー状態 / Testとの対応"
        },
        {
          "id": "d2da3b29-cd0d-5473-9ac6-86839ab80b2f",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "現在のCheck本文"
        },
        {
          "id": "eafad302-2b75-5c48-8b97-7a503e3e31de",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "確認済み期待結果"
        },
        {
          "id": "614d17a0-7d0e-593f-b473-8a4ed922de8e",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "現行項目 / ID / レビュー状態 / 既存対応関係"
        },
        {
          "id": "f55d291e-f921-5f81-90ce-5cfaff1abc49",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "確認済み期待結果と版"
        },
        {
          "id": "e255ccdf-764a-5dd5-b042-2515cca54953",
          "kind": "input",
          "fromId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "確認済みの業務上の期待結果"
        },
        {
          "id": "593150b2-f023-598e-8165-ba49ccc28f08",
          "kind": "input",
          "fromId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "利用可能な製品検証の実行結果・証拠"
        },
        {
          "id": "2cd4c0b4-9792-5501-9937-7213ecfaac44",
          "kind": "input",
          "fromId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "Alder実装レビュー・画面検証・SR品質検証それぞれの結果 / 根拠 / 未検証範囲・未決事項"
        },
        {
          "id": "e4c24ed1-9274-5b7b-8c24-76c760578b4d",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "label": "合意済み業務要件 / 期待結果"
        },
        {
          "id": "27bf750b-09ec-5fc0-bca8-1cb07562c68b",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "label": "業務要件"
        },
        {
          "id": "ddca5fe2-8fd9-52da-8a45-27f05ccf6ece",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "label": "現行原文項目"
        },
        {
          "id": "1002a697-54f6-54c4-9182-486d32c7d0e8",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "業務要件"
        },
        {
          "id": "ea5b5479-1b4d-5596-8006-ddc708bd3638",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "label": "業務要件 / 期待結果"
        },
        {
          "id": "f5d7a501-e285-598b-9e60-3c6d8764cc36",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "比較対象の業務要件と版"
        },
        {
          "id": "668a401c-0902-5727-98c7-da2294e2db51",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "label": "現在の業務上の意味 / Problem / Pain"
        },
        {
          "id": "39f85562-d739-558f-8188-c9894d68b9fc",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "label": "現行業務要件 / 期待結果 / 未決事項 / Problem / Pain"
        },
        {
          "id": "ca0b6795-7e33-5ba7-aa7d-428b2cd4d574",
          "kind": "input",
          "fromId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "toId": "23427931-db9c-5b16-a397-3fafd429d989",
          "label": "業務手順 / 入出力 / 利用環境"
        },
        {
          "id": "6f5ee272-c33d-5674-88bc-94dba406a9d6",
          "kind": "input",
          "fromId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "toId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "label": "GUI対象範囲の画面Reference / 画面チェックリスト・検証条件 / 未決事項"
        },
        {
          "id": "a2cabc7f-3699-5269-9e78-61852b209db6",
          "kind": "input",
          "fromId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "toId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "label": "GUI対象範囲の画面Reference・検証条件と版"
        },
        {
          "id": "ec4aa7bf-cc7c-578c-863c-bb1df56ab8c9",
          "kind": "input",
          "fromId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "toId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "label": "GUI対象範囲の画面Reference / 画面チェックリスト・検証条件"
        },
        {
          "id": "af5b38fb-c38f-58ba-adae-7c5eb2133024",
          "kind": "output",
          "fromId": "4dd37a39-2ec4-5603-b449-0146b3e62666",
          "toId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "label": "Alder実装レビューの対象版・範囲 / 適合所見・根拠 / 未決事項・検証不足"
        },
        {
          "id": "8fe12318-d835-5c69-aef4-0182a3b8e2e5",
          "kind": "output",
          "fromId": "d8de0d5e-3176-57ac-96a1-961b96142ce3",
          "toId": "23ac6e89-538d-5edb-85d0-a174ee1a345b",
          "label": "適用SR / 技術要件 / 品質の検証条件 / 画面設計・検証の適用有無 / 未決事項と担当責任者"
        },
        {
          "id": "53213646-87f7-5ef0-926b-d5c2ac7112e7",
          "kind": "output",
          "fromId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "toId": "69c0151d-4d7a-5b1c-a5a9-65e63eeedd3b",
          "label": "再確認候補 / 理由"
        },
        {
          "id": "c50959aa-315f-5c11-b94e-9058da8f5a46",
          "kind": "output",
          "fromId": "8f445083-4105-59a0-a638-0e9f004a8df6",
          "toId": "a03a2276-7aa5-596c-8f18-5510afae5fbe",
          "label": "照合済みの基準値"
        },
        {
          "id": "55ab9ee8-7b66-5d56-9764-a6359edec01b",
          "kind": "output",
          "fromId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "toId": "90d61e0f-35f9-5092-87b5-37939127b09f",
          "label": "実装結果 / 対象版 / 実行可能な成果物への参照"
        },
        {
          "id": "df344126-2a13-5c40-a280-784f5fe04430",
          "kind": "output",
          "fromId": "fe5c8b48-78fe-5ea5-8508-94189e5bc13c",
          "toId": "ace541a0-d4a2-59bc-9ade-f14968016a30",
          "label": "実行可能な検証"
        },
        {
          "id": "f3f1faad-4bb1-593c-ac96-054b99e7fc93",
          "kind": "output",
          "fromId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "検査項目案 / レビュー依頼 / 確認事項"
        },
        {
          "id": "bce45cb0-7586-53fb-bbc8-ae9b2eeb7970",
          "kind": "output",
          "fromId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "toId": "8525f788-c124-5bb3-85bf-d5c561dc98de",
          "label": "期待結果 / レビュー状態 / 業務設計書との対応"
        },
        {
          "id": "f1d629c5-5d3c-519e-9a3e-0c22cb4ca056",
          "kind": "output",
          "fromId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "統合検証結果への参照 / 残る確認事項"
        },
        {
          "id": "f131aab9-364e-50ad-9509-e3cd86361819",
          "kind": "output",
          "fromId": "0d71de72-5f86-5928-a13a-d06130cb51c5",
          "toId": "4657b60d-dd29-5ecd-88a7-594fdcf3befd",
          "label": "対象版と各検証の対応 / 根拠への参照 / 不一致・未検証・未決事項・担当責任者"
        },
        {
          "id": "366b91d0-4098-58eb-8fb0-b75ec8b3408d",
          "kind": "output",
          "fromId": "cb68420b-c2c3-5d91-9a95-612e42d456e7",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "改善候補 / 比較根拠 / 確認事項"
        },
        {
          "id": "3d23fa3a-d500-5aa0-91a0-faf5d764e6b1",
          "kind": "output",
          "fromId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "業務設計案 / レビュー依頼 / 確認事項"
        },
        {
          "id": "fe5aba58-cd0a-5c1f-b57f-9ac16353c1d1",
          "kind": "output",
          "fromId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "toId": "9cac475b-2725-5274-8724-02b909bc50d1",
          "label": "判断内容 / 結果"
        },
        {
          "id": "196e86f5-34a4-5204-8da5-0b09eb039006",
          "kind": "output",
          "fromId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "toId": "d051718c-efe6-5963-82e1-aa36c6f91b3d",
          "label": "業務要件 / 期待結果 / 未決事項 / Problem / Pain"
        },
        {
          "id": "84604925-bb55-5dcd-a57f-c6a62b586518",
          "kind": "output",
          "fromId": "23427931-db9c-5b16-a397-3fafd429d989",
          "toId": "c309e18c-479c-5534-92f5-02c420ba3fac",
          "label": "画面案 / 確認事項"
        },
        {
          "id": "94172be1-d015-5c55-a097-5ada2bdc474a",
          "kind": "output",
          "fromId": "23427931-db9c-5b16-a397-3fafd429d989",
          "toId": "2b16611b-d83b-5586-af1a-80f81519f9f5",
          "label": "画面Reference / 画面チェックリスト・検証条件 / 確認結果と未決事項"
        },
        {
          "id": "5e4198a8-2f3f-5588-830a-384fb0dc5ee2",
          "kind": "output",
          "fromId": "34f8bfd4-8c01-5929-9b78-2cd67f7aa5de",
          "toId": "b468672a-c472-5407-8656-5202cbdfc19f",
          "label": "画面検証とSR・品質検証それぞれの対象版・範囲・担当責任者 / 観測結果・証拠 / 未実施・未決・非適用"
        }
      ],
      "findings": [],
      "roles": [
        {
          "id": "role-285a6c5b4bca97f50fdc0951c4e888d5",
          "name": "業務設計者",
          "color": "#8b5cf6"
        },
        {
          "id": "role-89dad1594c2b0a2a5abc007054500e7b",
          "name": "システム開発者",
          "color": "#2563eb"
        },
        {
          "id": "role-3534f43eafb8de2f57a7de0b5d561eab",
          "name": "画面設計者",
          "color": "#2563eb"
        },
        {
          "id": "role-38ef110c089e72658c209a855a988c09",
          "name": "実装レビュー担当者",
          "color": "#8b5cf6"
        },
        {
          "id": "role-4e820e9cd09f1bb95e4b58302c415d4e",
          "name": "検証担当者",
          "color": "#2563eb"
        }
      ],
      "exceptions": []
    },
    {
      "id": "alder-sample-checks",
      "schemaVersion": "0.1",
      "kind": "checkItems",
      "revision": "alder-sample-checks-1",
      "title": "Alderのチェックリストサンプル",
      "basedOn": {
        "documentId": "alder-design",
        "revision": "alder-design-1",
        "verification": "unverified"
      },
      "intro": [
        {
          "kind": "text",
          "value": "原典は"
        },
        {
          "kind": "link",
          "uri": "https://github.com/mk3008/alder/blob/main/business-design/alder/business-design.json",
          "label": "Alderを使った設計業務"
        },
        {
          "kind": "text",
          "value": "です。表示を試すための2項目で、業務全体のチェックリストではありません。"
        }
      ],
      "index": [
        {
          "activityId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "purpose": "業務上の意味と保証の合意",
          "connections": "合意した業務設計書を検査項目の設計へ渡す",
          "checkIds": [
            "eb5df2d7-973b-542f-93ce-d3ce844b6d53"
          ]
        },
        {
          "activityId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "purpose": "期待結果と検証範囲の確認",
          "connections": "合意した検査項目を実装へ渡す",
          "checkIds": [
            "4c8a249a-d4af-5a9c-9061-0c964400fbfd"
          ]
        }
      ],
      "sections": [
        {
          "id": "96ea9b3c-7e86-5811-bbde-26976169489a",
          "activityId": "29871eb8-5c38-5151-8b76-e05db78efbfe",
          "title": "業務設計",
          "preamble": []
        },
        {
          "id": "f2ad6238-b8e0-570d-a942-6e3843073243",
          "activityId": "f89bfa4e-19b0-5803-8536-4f74fb9d7ffd",
          "title": "検査項目の設計",
          "preamble": []
        }
      ],
      "guarantees": [],
      "examples": [],
      "items": [
        {
          "id": "eb5df2d7-973b-542f-93ce-d3ce844b6d53",
          "checkId": "SAMPLE-01",
          "detailSummary": "SAMPLE-01 の根拠・関連業務・テスト証拠",
          "title": "合意した業務設計から次の設計を開始できる",
          "sectionId": "96ea9b3c-7e86-5811-bbde-26976169489a",
          "reviewState": "未レビュー",
          "fields": {
            "condition": [
              {
                "kind": "text",
                "value": "業務上の意味・手順・業務相関と、記録したProblem / Painを依頼者と確認・合意する。"
              }
            ],
            "expectedResult": [
              {
                "kind": "text",
                "value": "検査項目の設計または任意の業務改善レビューを開始できる。"
              }
            ],
            "evidence": [
              {
                "kind": "text",
                "value": "原典「Activity 業務設計」のResult。"
              }
            ],
            "related": [
              {
                "kind": "text",
                "value": "検査項目の設計。"
              }
            ],
            "testEvidence": [
              {
                "kind": "text",
                "value": "業務上の期待結果に対応する自動テスト証拠は未収集。"
              }
            ]
          }
        },
        {
          "id": "4c8a249a-d4af-5a9c-9061-0c964400fbfd",
          "checkId": "SAMPLE-02",
          "detailSummary": "SAMPLE-02 の根拠・関連業務・テスト証拠",
          "title": "合意した検査項目を実装へ渡せる",
          "sectionId": "f2ad6238-b8e0-570d-a942-6e3843073243",
          "reviewState": "未レビュー",
          "fields": {
            "condition": [
              {
                "kind": "text",
                "value": "合意した業務設計書に基づいて検査項目を整え、検査すべき期待結果を依頼者と確認・合意する。"
              }
            ],
            "expectedResult": [
              {
                "kind": "text",
                "value": "検査項目を実装へ引き渡せる。"
              }
            ],
            "evidence": [
              {
                "kind": "text",
                "value": "原典「Activity 検査項目の設計」のProcedure 5とResult。"
              }
            ],
            "related": [
              {
                "kind": "text",
                "value": "実装。"
              }
            ],
            "testEvidence": [
              {
                "kind": "text",
                "value": "業務上の期待結果に対応する自動テスト証拠は未収集。"
              }
            ]
          }
        }
      ],
      "notes": []
    }
  ],
  "sources": [
    {
      "documentId": "alder-design",
      "revision": "alder-design-1",
      "sha256": "64701618618bd565fb540647cf15c06e20d3f3f6fc45dc8b64244c01e3910aa5",
      "uri": "https://github.com/mk3008/alder/blob/304e7d4e82fe7087193012511a437a3c726ce7c2/business-design/alder/README.md"
    },
    {
      "documentId": "alder-sample-checks",
      "revision": "alder-sample-checks-1",
      "sha256": "9901011b7b673d9a3ad2749ecdb0d93621cfbd180f0c43324ea9d76f6994c909",
      "uri": ""
    }
  ],
  "externalDocuments": [],
  "diagnostics": [
    "旧JSON 0.3 の互換入力由来。業務意味・承認は未評価"
  ]
}
`;function Wd(e,t){const n=new Set(t.graph.nodes.map(f=>f.id)),o=new Map;for(const f of t.graph.nodes)o.set(f.name,o.has(f.name)?void 0:f.id);const i=f=>n.has(f)?f:o.get(f),s=Object.create(null);for(const[f,m]of Object.entries(e.positions)){const g=i(f);g&&(s[g]=m)}const{scroll:c,zoom:l,viewInset:a,canvasOrigin:d,showExceptions:r,selectedEdgesOnly:u}=e;return{positions:s,scroll:c,zoom:l,viewInset:a,canvasOrigin:d,showExceptions:r,selectedEdgesOnly:u,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(f=>{const m=i(f);return m?[m]:[]}))]}}}const zd=`# Alderのチェックリストサンプル

原典は[Alderを使った設計業務](https://github.com/mk3008/alder/blob/main/business-design/alder/README.md)です。表示を試すための2項目で、業務全体のチェックリストではありません。

## 業務一覧

| 業務（Activity） | 目的 | 業務設計に記載された接続 | チェック項目 |
| --- | --- | --- | --- |
| [業務設計](#activity-design) | 業務上の意味と保証の合意 | 合意した業務設計書を検査項目の設計へ渡す | [SAMPLE-01](#sample-01) |
| [検査項目の設計](#activity-checks) | 期待結果と検証範囲の確認 | 合意した検査項目を実装へ渡す | [SAMPLE-02](#sample-02) |

<a id="activity-design"></a>

## 業務設計

<a id="sample-01"></a>

### SAMPLE-01 — 合意した業務設計から次の設計を開始できる

- 条件：業務上の意味・手順・業務相関と、記録したProblem / Painを依頼者と確認・合意する。
- 期待結果：検査項目の設計または任意の業務改善レビューを開始できる。
- 人間レビュー状態：未レビュー

<details>
<summary>SAMPLE-01 の根拠・関連業務・テスト証拠</summary>

- 根拠：原典「Activity 業務設計」のResult。
- 関連業務：検査項目の設計。
- テスト証拠：業務上の期待結果に対応する自動テスト証拠は未収集。

</details>

<a id="activity-checks"></a>

## 検査項目の設計

<a id="sample-02"></a>

### SAMPLE-02 — 合意した検査項目を実装へ渡せる

- 条件：合意した業務設計書に基づいて検査項目を整え、検査すべき期待結果を依頼者と確認・合意する。
- 期待結果：検査項目を実装へ引き渡せる。
- 人間レビュー状態：未レビュー

<details>
<summary>SAMPLE-02 の根拠・関連業務・テスト証拠</summary>

- 根拠：原典「Activity 検査項目の設計」のProcedure 5とResult。
- 関連業務：実装。
- テスト証拠：業務上の期待結果に対応する自動テスト証拠は未収集。

</details>
`;function Ud(e,t,n,o,i=()=>!0,s=()=>{}){const c=e.ownerDocument,l=c.defaultView;let a,d=0,r=0,u=!1,f=null,m="";const g=new Map,p=()=>{a!==void 0&&(l.clearTimeout(a),d=Math.max(0,d-(Date.now()-r)),a=void 0)},h=(w=!1)=>{if(w&&!i())return;p(),g.delete(m);const E=[...g].at(-1);if(E){L(E[1],"error",E[0]);return}const O=e.contains(c.activeElement);e.hidden=!0,t.textContent="",s(),O&&(f?.isConnected?f:o).focus({preventScroll:!0})},S=()=>{e.hidden||e.dataset.kind==="error"||u||c.hidden||e.contains(c.activeElement)||(p(),r=Date.now(),a=l.setTimeout(h,d))};e.addEventListener("pointerenter",()=>{u=!0,p()}),e.addEventListener("pointerleave",()=>{u=!1,S()}),e.addEventListener("focusin",w=>{const E=w.relatedTarget;E&&!e.contains(E)&&(f=E),p()}),e.addEventListener("focusout",()=>l.setTimeout(S,0)),e.addEventListener("keydown",w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),h(!0))}),c.addEventListener("visibilitychange",()=>c.hidden?p():S()),n.onclick=()=>h(!0);const L=(w,E,O)=>{p(),e.contains(c.activeElement)||(f=c.activeElement),m=O,e.dataset.kind=E,e.dataset.key=O,t.setAttribute("role",E==="error"?"alert":"status"),t.setAttribute("aria-live",E==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=w,s(),d=E==="warning"?8e3:5e3,S()};return(w,E="success",O="operation")=>{E==="error"&&w?(g.delete(O),g.set(O,w)):g.delete(O);const v=[...g].at(-1);if(v){if(!e.hidden&&t.textContent===v[1]&&m===v[0])return;L(v[1],"error",v[0]);return}if(!w){m===O&&h();return}!e.hidden&&t.textContent===w&&e.dataset.kind===E||L(w,E,O)}}const js=qd,ut=document.querySelector("#app");ut.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Fe;const y=e=>document.getElementById(e),In=rr(location.pathname);In.version&&(y("preview-badge").hidden=!1,y("preview-badge").textContent=`確認用 · ${In.version}`,y("preview-badge").title=`PR #${In.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const Cn=e=>gt(e,{"stroke-width":1.8,"aria-hidden":"true"}),Yn=document.createElement("div");Yn.id="source-menu";Yn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';ut.append(Yn);const To=document.createElement("div");To.id="checks-menu";To.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';ut.append(To);const ln=document.createElement("section");ln.id="check-followup";ln.hidden=!0;ln.setAttribute("aria-labelledby","check-followup-title");ln.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(ln);const qo=document.createElement("div");qo.id="check-followup-menu";qo.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';ut.append(qo);const At=document.createElement("input");At.type="file";At.id="check-file";At.accept=".md,.markdown,text/markdown,text/plain";At.hidden=!0;ut.append(At);const Wt=document.createElement("section");Wt.id="check-url-dialog";Wt.hidden=!0;Wt.setAttribute("role","dialog");Wt.setAttribute("aria-labelledby","check-url-title");Wt.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';ut.append(Wt);const Wo=document.createElement("div");Wo.id="help-menu";Wo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${In.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${In.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${In.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;ut.append(Wo);Do(y("help-menu-toggle"),Wo);const Un=document.createElement("div");Un.id="url-history";Yn.append(Un);function $d(){if(Un.replaceChildren(),!x.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",Un.append(e);for(const t of x.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=ne||Ae||oe,n.onclick=()=>{Fd(t.url)},Un.append(n)}}async function Fd(e){if(!(ne||Ae||oe)){if(x.document?.source?.kind==="url"&&x.document.source.url===e){me(),Fe?.reopenBusinessOverview(),x.active=x.tabs[0].key,ke(),eo();return}Ae=!0,ke();try{const t=await No(e),n=Rn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await Qn(n)}catch(t){t instanceof Ln||Ne("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ae=!1,ke()}}}const Vd=Do(y("open-menu-toggle"),Yn),Bd=Do(y("open-checks"),To,()=>{const e=K();y("check-open-sample").hidden=!e||!_i(e),y("check-close").disabled=!e?.checks}),yr=Do(y("check-followup-open"),qo,()=>{y("check-followup-sample").hidden=!K()||!_i(K())});for(const[e,t]of[["open-menu-toggle",cs],["open",cs],["open-url",oa],["open-text",ia],["view-markdown",sa],["open-checks",qs],["share-source",ra],["refresh",aa],["help-menu-toggle",ca],["drawer",da],["node-list-toggle",la],["node-list-close",Ws],["display-settings-toggle",zs],["reset-layout",ua],["save-image",fa],["copy-image",pa],["out",Fs],["in",Vs]])y(e).prepend(Cn(t));td(document.querySelector("header"));const ki=ed(document.querySelector(".tab-strip"));let x={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},mt=!0,Rt=!1,ne=!0,jn=!1,cn=!1,Ae=!1,Ms=Promise.resolve(),Xt,pe,ht=0,oe=!1,$n=!1,Sn=0,Ao=0,xn=!1,Bi=!1,Ii=!1,Ls=!1;const Si=new Set,Dt=new Set,Eo=new Set;function vr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Eo){const o=[...x.document?[x.document]:[],...x.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&Eo.delete(n)}}const K=()=>x.tabs.find(e=>e.key===x.active),un=e=>Pt(e)?.key??e.key,Tt=e=>x.document?.key===un(e);let xi="";const Hd=Ud(y("status"),y("status-text"),y("status-close"),y("viewport"));function Ne(e,t="success",n="operation"){if(n==="storage"){if(xi===e)return;xi=e}Hd(e,t,n)}function Hi(){Ne("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Gi(){Ne("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ct(){ne||(ht++,Je())}function Gd(e){e.preventDefault(),e.returnValue=!0}function Je(){const e=ht>Sn||Ao>0||!1||oe||Eo.size>0||Ii||xn||cn,t=!ne&&e;t!==Ls&&(Ls=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Gd));const n=ne?"restoring":jn?"protected":cn?"conflict":xn?"error":Ii||Eo.size>0?"draft":Ao>0||oe?"saving":ht>Sn?"dirty":Bi?"saved":"unchanged";ut.dataset.saveState!==n&&(ut.dataset.saveState=n),jn?Hi():cn?Gi():xn?Ne("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):Ne("","success","storage"),Uo()}function Ji(e){xn=!0,xi=""}function zo(){if(jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(cn)throw new zi}async function Jd(e){zo();try{await Nc(e)}catch(t){throw t instanceof zi&&(cn=!0,clearTimeout(Xt),Xt=void 0,Gi()),t}}function wr(e,t){Ao++,Si.add(t),Je();const n=Ms.catch(()=>{}).then(()=>Jd(e)).then(()=>{Sn=Math.max(Sn,t),Bi=!0,vr(e),Sn===ht&&(xn=!1)},o=>{throw Ji(),o}).finally(()=>{Ao--,Si.delete(t),Je()});return Ms=n.catch(()=>{}),n}function be(e=180,t=!0){if(ne)return;if(t&&ht++,clearTimeout(Xt),Xt=void 0,jn){Hi(),Je();return}if(cn){Gi(),Je();return}if(oe||Si.has(ht)||!t&&ht<=Sn&&!xn){Je();return}const n=()=>{Xt=void 0;let o;try{o=structuredClone(Ui(x))}catch{Ji(),Je();return}wr(o,ht).catch(()=>Je())};e===0?n():Xt=window.setTimeout(n,e),Je()}async function _d(e){if(ne||pe||oe||!x.tabs.includes(e))return;if(Bn(e)===void 0){Fe?.closeBusinessOverview();return}ot.cancel(),me();const t=x.active===e.key,n={...x,tabs:x.tabs.filter(o=>o!==e),active:t?x.tabs[0]?.key:x.active};try{await Vo(()=>n,()=>{x=n}),t&&ut.dataset.workspaceArea==="business"&&Fe?.businessActivated()}catch{Je()}}function et(){y("drawer").setAttribute("aria-label","業務内容開閉"),y("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!K(),t=e&&x.drawer,n=e&&!!x.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Rt=!1),Uo(),y("layout-lock").replaceChildren(Cn(mt?Us:$s)),y("layout-lock").setAttribute("aria-pressed",String(mt)),y("layout-lock").title=mt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",y("layout-lock").toggleAttribute("disabled",ne),y("viewport").dataset.layoutLocked=String(mt),y("prefer-write").checked=x.preferWrite===!0,y("prefer-write").disabled=ne,y("show-exceptions").checked=K()?.showExceptions!==!1,y("show-exceptions").disabled=ne||oe||!K()||pe===K(),y("selected-edges-only").checked=K()?.selectedEdgesOnly===!0,y("selected-edges-only").disabled=ne||oe||!K()||pe===K(),document.documentElement.dataset.theme=x.dark?"dark":"light",y("theme").replaceChildren(Cn(x.dark?va:wa)),y("formattedMarkdownDrawer").hidden=!t,y("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(x.width,innerWidth*.65))+"px",y("drawer").setAttribute("aria-expanded",String(t)),y("drawer").toggleAttribute("disabled",ne||!e),y("node-list-drawer").hidden=!n||tt().mode!=="findings",y("node-list-toggle").setAttribute("aria-expanded",String(n)),y("node-list-toggle").toggleAttribute("disabled",ne||!e),Fe?.syncChrome()}function Ai(){for(const e of["save-image","copy-image"]){const t=y(e);t.hidden=!K(),t.disabled=$n||ne||!K()||pe===K(),t.setAttribute("aria-busy",String($n))}}function Uo(){Ai(),document.querySelector(".toolbar").dataset.settingsOpen=String(Rt),y("display-options").hidden=!Rt,y("reset-layout").disabled=ne||Ae||oe||!1||!K()||Dt.has(x.document?.key??"")||jn||cn;const e=y("display-settings-toggle"),t=Rt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Rt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ne||oe||!K()||pe===K()}function kr(e,t=!1){const n=K();ne||oe||!n||pe===n||e===Rt||(e&&(Mn.delete(Pt(n)?.key??n.key),$o()),ot.cancel(),xe=void 0,me(),Rt=e,Uo(),Ot(n),!e&&(t||y("display-options").contains(document.activeElement))&&y("display-settings-toggle").focus({preventScroll:!0}))}async function Ir(e){const t=K();if(!($n||ne||!t||pe===t)){$n=!0,Ai();try{const n=dd(y("nodes"),y("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await fd(n),Ne("グラフ全体のPNGをコピーしました。")):await ud(n,(Pt(t)?.name??t.name)+(Bn(t)?" - "+Bn(t):""))}catch(n){Ne((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{$n=!1,Ai()}}}y("save-image").onclick=()=>Ir(!1);y("copy-image").onclick=()=>Ir(!0);y("display-settings-toggle").onclick=()=>kr(!Rt);y("reset-layout").onclick=()=>{const e=K();if(ne||Ae||oe||pe||!e||Dt.has(un(e)))return;try{zo()}catch{Je();return}ot.cancel(),_t.cancel(),xe=void 0,me();const t={...e,design:Lo(e)},n=Rd(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Cr.invalidate(e),ke(),n!==t&&be()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Rt&&y("source-dialog").hidden&&(e.preventDefault(),kr(!1,!0))});function me(e=!0){const t=K();if(!t)return!1;const n=[y("viewport").scrollLeft,y("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Ct(),be(180,!1)),o}function Sr(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function Ei(){Vd.close(),Bd.close(),yr.close(),ki.close(),Sr(Kd),ki.update()}function Kd(){const e=y("tabs");e.replaceChildren(),x.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===x.active?" active":""),n.draggable=Bn(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Io(t)!==void 0&&(n.dataset.activity=Io(t)),So(t)!==void 0&&(n.dataset.object=So(t));const o=document.createElement("button");ui(o,"business",t.name),o.setAttribute("aria-current",String(t.key===x.active)),o.disabled=oe,o.onclick=async()=>{if(oe||bt&&bt!==t.key&&!await Ho())return;const s=me()||x.active!==t.key;Fe?.activateBusiness(),x.active=t.key,ke(),Fe?.businessActivated(),be(180,s)};const i=fi("業務設計："+t.name+"を閉じる");i.disabled=oe,i.onclick=()=>_d(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),oe)return;const c=x.tabs.findIndex(a=>a.key===s.dataTransfer?.getData("text/plain")),l=x.tabs.indexOf(t);if(c>0&&l>0&&c!==l){const[a]=x.tabs.splice(c,1);x.tabs.splice(l,0,a),Ei(),be()}},n.onkeydown=s=>{if(!oe&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const c=x.tabs.indexOf(t),l=c+(s.key==="ArrowLeft"?-1:1);c>0&&l>0&&l<x.tabs.length&&([x.tabs[c],x.tabs[l]]=[x.tabs[l],x.tabs[c]],Ei(),be())}},e.append(n)})}const Rs=new Map,Mn=new Set;function $o(){const e=K(),t=!!e&&e.design.sourceFormat!=="json"&&Mn.has(Pt(e)?.key??e.key)&&!e.checks;t||(yr.close(),ln.contains(document.activeElement)&&y("viewport").focus({preventScroll:!0})),ln.hidden=!t;for(const n of["check-followup-open","check-followup-later"])y(n).disabled=ne||Ae||oe||!1||!e||en(e).busy===!0}y("check-followup-later").onclick=()=>{const e=K();e&&Mn.delete(Pt(e)?.key??e.key),$o()};let Oi;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])y("check-followup-"+e).onclick=()=>{Oi=y("check-followup-open"),y(t).click(),Oi=void 0};function _i(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Vi}function en(e){const t=Pt(e)?.key??e.key;let n=Rs.get(t);return n||(n={},Rs.set(t,n)),n}async function Ki(e,t){if(!Tt(e))throw Error("原本文書が切り替わりました。");const n=Qt(x,x.recovery,{...x.document,checks:t},Ui(x).views);await Vo(()=>n,()=>{x=n,t&&Mn.delete(Pt(e)?.key??e.key)})}async function xr(e,t){const n=en(e);if(e.design.sourceFormat==="json"||n.busy||oe||ne||pe===e)return;const o=Hn(e);n.busy=!0,n.error=void 0,n.candidate=void 0,qt();try{const i=await t();if(!Tt(e))return;if(o!==Hn(x.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=On(i),c=Gn(s,x.tabs[0]);if(c.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+c.reason);c.state==="unverified"?n.candidate=i:(await Ki(e,i),n.candidate=void 0,Fe?.openRelatedChecks(K()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,Ne(n.error,"error")}finally{n.busy=!1,qt()}}async function Ar(e,t){const n=en(e);if(n.busy||oe||!Tt(e))return;const o=Gn(On(t),x.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,qt();return}n.busy=!0,n.error=void 0;try{await Ki(e,{...t,confirmedFor:Hn(x.tabs[0])}),n.candidate=void 0,Fe?.openRelatedChecks(K()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,qt()}}function qt(){$o();const e=K(),t=y("detail"),n=e?en(e):void 0,o=e?e.key+":"+(e.selected??""):"";y("open-checks").disabled=ne||oe||pe===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const c=e.design.graph.nodes.find(u=>u.id===e.selected),l=Qc(e,n,{disabled:ne||oe||pe===e,redraw:qt,confirm:u=>{Ar(e,u)}}),a=document.createElement("div");a.className="right-drawer-heading";const d=$a(c?.name??"業務設計");if(c){const u=c.type==="business"?Er(String(c.who),c.id):Xs(c);u.classList.add("drawer-node-icon"),d.prepend(u)}a.append(d);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{y("drawer").click(),y("drawer").focus({preventScroll:!0})},a.append(r),t.append(a),l.hasChildNodes()&&t.append(l),c){const u=Md(e.design,c.id,Xi);u.hasChildNodes()&&t.append(u)}t.append(bc(e.design,c?.id)),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Ds=new Map,tt=()=>{const e=x.active??"";let t=Ds.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Ds.set(e,t)),t};function Xi(e){if(!K())return;const t=tt();t.mode="findings",t.finding=e,x.nodeDrawer=!0,innerWidth<=800&&(x.drawer=!1),et(),lt(),y("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),be()}function Xd(e){const t=K();if(!t)return;const n=tt();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){Xi(o[0]);return}x.nodeDrawer=!0,innerWidth<=800&&(x.drawer=!1),et(),lt(),y("drawer-mode-findings").focus({preventScroll:!0}),be()}function Zd(e,t){const n=tt().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(l=>l.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(l=>l.id===n.id&&typeof l.problem=="string"):void 0;if(!o&&!i)return tt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{tt().finding=void 0,lt(),y("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(Cd(o));else{const l=document.createElement("h2");l.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(l,En(String(i.problem)))}const c=o?.targets??[i.id];if(c.length){const l=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",l.append(a);for(const d of c){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=d;const u=e.design.graph.nodes.some(m=>m.id===d),f=e.hiddenNodes?.includes(d);r.disabled=!u||!!f,r.textContent=(e.design.graph.nodes.find(m=>m.id===d)?.name??d)+(u?f?"（非表示）":"":"（参照先なし）"),r.onclick=()=>go(d,!0),l.append(r)}t.append(l)}return!0}function Er(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&K()?.design.model?.business.roles?Ti(K().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(Cn(Gs)),o}function Fo(e,t=!0){ne||!K()||(ot.cancel(),me(),x.nodeDrawer=e,e&&tt().mode==="findings"&&innerWidth<=800&&(x.drawer=!1),et(),e&&K()?.selected&&Dn(K().selected),lt(),t&&y(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),be())}function Dn(e){const t=K(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=tt();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(Ua(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(y("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function Yd(e,t){const n=K();if(!n||ne||oe||pe===n)return;ot.cancel(),xe=void 0,me();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],tn(),be()}function go(e,t=!1){let n=K();if(n&&!Lo(n).graph.nodes.some(u=>u.id===e)&&(me(),Fe?.reopenBusinessOverview(),x.active=x.tabs[0].key,n=K(),ke()),!n||n.hiddenNodes?.includes(e)||pe===n)return;t||(tt().finding=void 0);const o=y("node-list").contains(document.activeElement);ot.cancel(),xe=void 0,me(),n.selected=e,Dn(e),et(),tn();const i=y("viewport"),s=i.getBoundingClientRect(),c=y("formattedMarkdownDrawer").getBoundingClientRect(),l=x.drawer&&c.left>s.left&&c.left<s.right?c.left:s.right,a=Math.max(1,Math.min(i.clientWidth,l-s.left-i.clientLeft)),d=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-d/2],Ot(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],me(),o){const u=t?"[data-finding-target]":"[data-list-node]",f=Array.from(y("node-list").querySelectorAll(u)).find(m=>(t?m.dataset.findingTarget:m.dataset.listNode)===e);(t?f:f?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}be()}function lt(){const e=K(),t=tt(),n=y("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=y("drawer-modes");s.replaceChildren();for(const g of["findings"]){const p=document.createElement("button");p.id="drawer-mode-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.mode===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.mode===g?0:-1,p.textContent=`指摘（${e?jd(e.design):0}）`;const h=()=>{t.mode=g,lt(),y("drawer-mode-"+g).focus({preventScroll:!0})};p.onclick=h,p.onkeydown=S=>{["ArrowLeft","ArrowRight","Home","End"].includes(S.key)&&(S.preventDefault(),p.focus({preventScroll:!0}))},s.append(p)}for(const g of[y("node-categories"),y("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const c=y("node-list-search");c.value=t.search,c.disabled=!e||ne;const l=y("node-categories");l.replaceChildren();for(const[g,p]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const h=document.createElement("button");h.dataset.category=g,h.id="node-category-"+g,h.setAttribute("role","tab"),h.setAttribute("aria-selected",String(t.category===g)),h.setAttribute("aria-controls","node-list"),h.tabIndex=t.category===g?0:-1,h.textContent=p,h.onclick=()=>{t.category=g,lt(),y("node-category-"+g).focus({preventScroll:!0})},h.onkeydown=S=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(S.key))return;S.preventDefault();const L=["activity","object","role"],w=L.indexOf(g);t.category=S.key==="Home"?"activity":S.key==="End"?"role":L[(w+(S.key==="ArrowRight"?1:2))%3],lt(),y("node-category-"+t.category).focus({preventScroll:!0})},l.append(h)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),d=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=d.filter(g=>!a.has(g.id)).length,u=y("scope-outside"),f=r===d.length?"true":r===0?"false":"mixed";u.setAttribute("aria-pressed",f),u.setAttribute("aria-label",f==="true"?"スコープ外を非表示":"スコープ外を表示"),u.replaceChildren(Cn(f==="false"?ka:Ia)),u.disabled=!d.length||ne||pe===e;const m=y("show-outside");if(m.checked=f==="true",m.indeterminate=f==="mixed",m.setAttribute("aria-checked",f),m.disabled=u.disabled,y("scope-count").textContent=f==="mixed"?`${r}/${d.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(Zd(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(h=>h.id===t.filterNode)?.name??t.filterNode)+"の指摘";const p=document.createElement("button");p.className="node-navigate finding-all",p.textContent="すべての指摘",p.onclick=()=>{t.filterNode=void 0,lt(),y("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,p)}n.append(Ld(e.design,t.resolved,g=>{t.resolved=g,lt(),n.querySelector("input")?.focus({preventScroll:!0})},Xi,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}y("node-list-toggle").onclick=()=>Fo(!x.nodeDrawer);y("node-list-close").onclick=()=>Fo(!1);y("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Fo(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!y("node-list-drawer").hidden&&y("source-dialog").hidden&&(e.preventDefault(),Fo(!1))});y("node-list-search").oninput=()=>{tt().search=y("node-list-search").value,lt()};function Or(){const e=K();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);Yd(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}y("scope-outside").onclick=Or;y("show-outside").onchange=Or;const Qd="http://www.w3.org/2000/svg",ri=e=>document.createElementNS(Qd,e),Cr=new gi,Ns=new WeakMap;function el(e){if(!Ks(e.graph))return;let t=Ns.get(e);return t||(t=Rc(e),Ns.set(e,t)),t.wires}function tl(e,t,n){Ni(y("edges"),e,t,{"data-relation":String(n)})}let Jn=()=>{},Lt=[0,0],Jt=[0,0];function nl(){const e=y("node-list-drawer");return y("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function ol(){const e=y("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Ot(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(u=>u[0])),Math.min(0,...o.map(u=>u[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],Jt[0]):0,i[1]<0||n[1]>0?Math.min(i[1],Jt[1]):0],{growth:c,origin:l}=ya(n,s,e.zoom),a=c.some(Boolean);a&&(e.canvasOrigin=l,e.scroll=[e.scroll[0]+c[0],e.scroll[1]+c[1]],Ct(),be(180,!1));const d=Math.ceil(Math.max(1400,Lt[0],(nl()+e.scroll[0])/e.zoom-t[0]*2-l[0],...o.map(u=>u[0]+340))),r=Math.max(850,Lt[1],Math.max(Lt[1],...o.map(u=>u[1]+68))+ol()/e.zoom-t[1],(y("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-l[1],...o.map(u=>u[1]+220));y("canvas").style.width=(d+l[0]+t[0]*2)*e.zoom+"px",y("canvas").style.height=(r+l[1]+t[1]*2)*e.zoom+"px",y("nodes").style.left=(l[0]+t[0])*e.zoom+"px",y("nodes").style.top=(l[1]+t[1])*e.zoom+"px",y("edges").style.left=t[0]*e.zoom+"px",y("edges").style.top=t[1]*e.zoom+"px",y("nodes").style.width=d+"px",y("nodes").style.height=r+"px",y("nodes").style.transform=`scale(${e.zoom})`,y("edges").setAttribute("viewBox",`${-l[0]} ${-l[1]} ${d+l[0]} ${r+l[1]}`),y("edges").style.width=(d+l[0])*e.zoom+"px",y("edges").style.height=(r+l[1])*e.zoom+"px",a&&(y("viewport").scrollLeft=e.scroll[0],y("viewport").scrollTop=e.scroll[1]),y("zoom").textContent=Math.round(e.zoom*100)+"%"}function tn(){Sr(il)}function il(){Uo(),_t.cancel(),Jn=()=>{},Lt=[0,0],Jt=[0,0];const e=K();if(y("nodes").replaceChildren(),y("edges").replaceChildren(),y("empty").hidden=!!e,y("canvas").hidden=!e,!e){y("viewport").scrollLeft=0,y("viewport").scrollTop=0,qt(),lt();return}const t=Lo(e),n=t.graph.nodes,o=n.filter(r=>!e.hiddenNodes?.includes(r.id)),i=new Set(o.map(r=>r.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,c=e.positions,l=wo(t.graph.relations,s);Ot(e),y("edges").append(Di());const a=Dd(t.graph.relations,x.preferWrite===!0),d=()=>{const r=n.flatMap(h=>{const S=c[h.id];return S?[{id:h.id,x:S[0],y:S[1],width:260,height:68}]:[]}),u=el(t),f=Cr.update(e,t,r,t.graph.relations,u),m=new Map;for(Lt=[0,0],Jt=[0,0];y("edges").childNodes.length>1;)y("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(h=>[h.id,h.name]));t.graph.relations.forEach((h,S)=>{if(a.has(S))return;const L=f[S];if(!L||(Lt[0]=Math.max(Lt[0],L.bounds.right+20,L.label[0]+Math.max(30,h.label.length*12)/2+12),Lt[1]=Math.max(Lt[1],L.bounds.bottom+20,L.label[1]+22),Jt[0]=Math.min(Jt[0],...L.points.map(V=>V[0]-20),L.label[0]-Math.max(30,h.label.length*12)/2-12),Jt[1]=Math.min(Jt[1],...L.points.map(V=>V[1]-20),L.label[1]-22),e.selectedEdgesOnly===!0&&l.muted(h)||!i.has(h.from)||!i.has(h.to)||e.showExceptions===!1&&(h.kind==="business-exception"||h.kind==="object-exception")))return;const w=ri("path");w.setAttribute("d",L.path),w.dataset.relation=String(S),w.dataset.collisions=String(L.collisions),w.dataset.rerouted=String(L.rerouted),w.dataset.fallback=String(L.fallback),w.setAttribute("marker-end","url(#arrow)"),w.classList.add("edge"),h.kind.endsWith("exception")&&w.classList.add("exception"),l.related(h)&&(w.classList.add("review-related"),w.setAttribute("marker-end","url(#related-arrow)")),l.muted(h)&&w.classList.add("muted");const E=ri("title");E.textContent=(g.get(h.from)??h.from)+" → "+(g.get(h.to)??h.to)+": "+h.label,w.append(E),y("edges").append(w),h.kind.endsWith("exception")&&tl(w,L,S);const O=_s(h,S,u?.[S]),v=m.get(O);if(v){v.dataset.relations+=" "+S,l.related(h)&&(v.classList.add("review-related"),v.classList.remove("muted"));return}const P=ri("text");m.set(O,P),P.dataset.relations=String(S),P.setAttribute("x",String(L.label[0]-Math.max(30,h.label.length*12)/2)),P.setAttribute("y",String(L.label[1])),P.setAttribute("text-anchor","start"),P.classList.add("edge-label"),P.setAttribute("dominant-baseline","middle"),P.dataset.relation=String(S),l.related(h)&&P.classList.add("review-related"),l.muted(h)&&P.classList.add("muted"),P.textContent=h.label,y("edges").append(P)});const p=y("edges");for(const h of[...Array.from(p.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(p.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(p.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(p.querySelectorAll(".edge-label.review-related"))])p.append(h);Ot(e)};Jn=d,d(),o.forEach(r=>{const u=document.createElement("div");u.setAttribute("role","group"),u.className="node "+r.type+(r.scope?"":" outside")+l.nodeClasses(r.id),u.dataset.node=r.id,r.type==="business"&&(u.dataset.activity=r.id),u.style.left=c[r.id][0]+"px",u.style.top=c[r.id][1]+"px",r.type==="business"?u.append(Er(String(r.who),r.id)):u.append(Xs(r));const f=document.createElement("span");f.className="node-text";const m=document.createElement("span");m.className="review-kind",m.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),f.append(m);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,f.append(g),r.type==="business"){const w=document.createElement("small");w.textContent=String(r.who),f.append(w)}if(u.append(f),Sa(r.id,Bn(e))){const w=document.createElement("button");w.type="button",w.className=r.type==="business"?"activity-open":"object-open",w.setAttribute("aria-label",r.name+"の詳細タブを開く"),w.title="詳細タブを開く",w.append(Cn(An)),w.onpointerdown=E=>E.stopPropagation(),w.onpointerup=E=>E.stopPropagation(),w.onclick=E=>{E.stopPropagation(),r.type==="business"?Ci(r.id):jr(r.id),Fe?.businessActivated()},u.append(w)}u.title=r.name+(r.type==="business"?" — "+String(r.who):""),u.setAttribute("aria-label",u.title+(r.id===s?"（選択中）":""));const p=Od(e.design,r);if(p.length){const w=document.createElement("button");w.type="button",w.className="finding-badges",w.textContent=p.join(" · "),w.setAttribute("aria-label",r.name+"の指摘を開く"),w.onpointerdown=E=>E.stopPropagation(),w.onpointerup=E=>E.stopPropagation(),w.onclick=E=>{E.stopPropagation(),Xd(r.id)},u.append(w),u.setAttribute("aria-label",u.getAttribute("aria-label")+" · "+p.join("、"))}let h;const S=u;S.onpointerdown=w=>{w.button!==0||pe===e||mt||(w.stopPropagation(),S.setPointerCapture(w.pointerId),h=w.pointerId,_t.begin(r.id,[w.clientX,w.clientY]))},S.onpointermove=w=>{h===void 0||w.pointerId!==void 0&&w.pointerId!==h||!u.isConnected||pe===e||_t.move([w.clientX,w.clientY])},S.onpointerup=w=>{if(h===void 0||h!==w.pointerId||(h=void 0,!u.isConnected||pe===e))return;const E=_t.end();S.hasPointerCapture?.(w.pointerId)&&S.releasePointerCapture(w.pointerId),E&&(E.moved||(tt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Ct()),Dn(r.id)),me(),tn(),be(180,!1))};const L=w=>{h===void 0||h!==w.pointerId||(h=void 0,u.isConnected&&(_t.cancel(),me(),be(180,!1)))};S.onpointercancel=L,S.onlostpointercapture=L,y("nodes").append(u)}),y("zoom").textContent=Math.round(e.zoom*100)+"%",qt(),lt()}function Ci(e){ne||oe||pe||(me(),Vc(x,e),ke(),be(),y("viewport").focus({preventScroll:!0}))}function jr(e){ne||oe||pe||(me(),Bc(x,e),ke(),be(),y("viewport").focus({preventScroll:!0}))}function ke(){document.title=x.document?x.document.name+" · Alder Viewer":"Alder Viewer",ot.cancel(),xe=void 0,et(),Ei(),tn();const e=K();e&&(y("viewport").scrollLeft=e.scroll[0],y("viewport").scrollTop=e.scroll[1]),y("refresh").toggleAttribute("disabled",ne||oe||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Dt.has(un(e))),y("refresh").hidden=!e,y("view-markdown").toggleAttribute("disabled",ne||Ae||oe||!1||!e||Dt.has(un(e))),y("view-markdown").hidden=!e,y("open-checks").hidden=!e||e.design.sourceFormat==="json",y("open-checks").toggleAttribute("disabled",ne||Ae||oe||!1||!e||!!(e&&en(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])y(t).toggleAttribute("disabled",ne||Ae||oe);y("open-sample").setAttribute("aria-disabled",String(ne||Ae||oe)),y("open-sample").tabIndex=ne||Ae||oe?-1:0,y("theme").toggleAttribute("disabled",ne),Xn(),$o(),$d(),Jo(),Fe?.syncDocument()}async function Qn(e){const t=x.document,n=$c(x,e);return t?(await Vo(()=>n,()=>{x=n,Mn.add(Pt(x.tabs[0])?.key??x.tabs[0].key)}),!0):(me(),x=n,Mn.add(Pt(x.tabs[0])?.key??x.tabs[0].key),ke(),be(),!0)}async function Mr(e,t){if(bt&&!await Ho())return;const n=await xo(e),o=K();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await _n(o,n,t))return;Fe?.reopenBusinessOverview(),x.active=x.tabs[0].key,ke(),be();return}const i=Rn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await Qn(i)}y("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])y("guide-"+e).onclick=()=>y(e).click();y("open-sample").onpointerdown=e=>e.stopPropagation();y("open-sample").onclick=async e=>{if(e.preventDefault(),!(ne||Ae||oe))try{if(x.document?.source?.kind==="sample"&&x.document.design.markdown===js){me(),Fe?.reopenBusinessOverview(),x.active=x.tabs[0].key,ke(),y("viewport").focus({preventScroll:!0});return}const t=fn(js),n=x.document?.source?.kind==="sample"&&x.document.design.markdown===Vi?x.tabs[0]:void 0;n&&me();const o=n??x.sampleLayout,i=o?Wd(o,t):{},s=Rn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await Qn(s)&&y("viewport").focus({preventScroll:!0})}catch(t){Ne("サンプルを開けません: "+t.message,"error")}};y("open").onclick=async()=>{if(!(ne||Ae||oe)){Ae=!0,ke();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Mr(await n.getFile(),n)}else y("fallback").click()}catch(e){e.name!=="AbortError"&&Ne("開けません: "+e.message,"error")}finally{Ae=!1,ke()}}};y("fallback").onchange=async()=>{const e=y("fallback");if(!(ne||Ae||oe)){Ae=!0,ke();try{for(const t of Array.from(e.files??[]))await Mr(t)}catch(t){Ne("開けません: "+t.message,"error")}e.value="",Ae=!1,ke()}};class Ln extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function Vo(e,t){if(oe||pe)throw Error("表示を切り替えています。完了後に再試行してください。");try{zo()}catch(i){throw new Ln(i)}me(),clearTimeout(Xt),Xt=void 0,oe=!0,ht++;const n=ht;ke(),Je();let o=!1;try{const i=structuredClone(Ui(e()));await wr(i,n);const s=x;t(),x!==s&&(x=Hc(x,s)),Qe==="view"&&bt&&!x.tabs.some(c=>c.key===bt)&&(bt=x.tabs[0]?.key),vr(i),o=!0}catch(i){throw Ji(),new Ln(i)}finally{oe=!1,ke(),Je(),o&&ht!==n&&be(0,!1)}}async function _n(e,t,n=e.handle,o=!1){if(!Tt(e)||e.design!==x.document?.design)return!1;const i=Fc(x,t,n,o);return await Vo(()=>i,()=>{x=i}),dn=void 0,Jo(),Ne(""),!0}async function Ps(e){if(!Tt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await _n(e,await xo(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const c=i.files?.[0];c&&await _n(e,await xo(c)),s()}catch(c){i.remove(),o(c)}},i.click()})}y("refresh").onclick=async()=>{const e=K();if(ne||oe||pe||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Dt.has(un(e)))return;bt===e.key&&Co();const t=un(e);Dt.add(t),ke();try{if(e.source?.kind==="url"){const o=await No(e.source.url);await _n(e,o);return}if(!e.handle){await Ps(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Tt(e))return;if(n!=="granted"){Ne("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Ps(e);return}await _n(e,await xo(await e.handle.getFile()))}catch(n){Tt(e)&&n.name!=="AbortError"&&!(n instanceof Ln)&&Ne("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Dt.delete(t),ke()}};let Qe="text",bt,Nt=!1,Zt=0,Oo,ji=null;const Et=()=>y("source-text"),Kn=()=>y("source-url");function Zi(){Ii=!y("source-dialog").hidden&&Qe!=="view"&&(Qe==="text"?Et().value:Kn().value)!=="",Je()}Kn().addEventListener("input",Zi);function Xn(){Mi();const e=Qe==="view",t=Nt||oe;Et().disabled=t,Et().readOnly=e,y("source-dialog").dataset.mode=Qe,y("source-submit").hidden=e,y("source-submit").textContent="表示",y("source-submit").disabled=t||e,y("source-cancel").disabled=oe||t&&Qe!=="url",y("source-cancel").textContent=e?"閉じる":"キャンセル",Zi(),queueMicrotask(Dr)}function Yi(e,t){if(!(ne||Ae||oe||t&&Dt.has(un(t)))){Oo?.abort(),Zt++,Qe=e,bt=t?.key,Nt=!1,ji=document.activeElement,y("source-dialog").hidden=!1,y("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${x.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])y(n).hidden=e!=="url";for(const n of["text-label","source-text"])y(n).hidden=e==="url";y("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Et().value=t.design.markdown:e==="text"&&(Et().value=Bo),Xn(),(e==="url"?Kn():Et()).focus()}}let Bo="",ho;function sl(){if(ji?.isConnected&&ji.focus({preventScroll:!0}),ho!==void 0&&cancelAnimationFrame(ho),Qe!=="view")return;const e=Zt;ho=requestAnimationFrame(()=>{if(ho=void 0,e!==Zt||!y("source-dialog").hidden)return;const t=window.visualViewport,n=ut.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Co(){Zt++,Oo?.abort(),Nt=!1,bt=void 0,y("source-dialog").hidden=!0,Xn(),sl()}async function Ho(){return oe?!1:(Qe==="text"&&(Bo=Et().value),Co(),!0)}function Lr(){return Ho()}Et().oninput=()=>{Qe==="text"&&(Bo=Et().value,Zi())};let yo=!1;function Rr(){return ne||Ae||Nt||oe||pe?"読込が終わってから共有してください。":Nd(K())}function Mi(){const e=Rr(),t=y("share-source");t.hidden=!K(),t.setAttribute("aria-disabled",String(yo||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}y("share-source").onclick=async()=>{if(yo)return;const e=Rr();if(e){Ne(e,"warning");return}const t=K();if(t.source?.kind!=="url")return;const n=t.source.url,o=Pd(location.href,n);yo=!0,Mi();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),Ne("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{Ne("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{yo=!1,Mi()}};let Mt,vn=0,Ts=0,Fn;function Dr(){if(ne||Ae||Nt||pe||oe||Mt||Fn===void 0)return;const e=Fn;Fn=void 0,Qi(e)}async function Qi(e=location.hash){const t=e;if(ne)return;const n=++Ts;if(!/^#source(?:=|$)/.test(t)){Fn=void 0,Mt&&!oe&&(Mt.abort(),Mt=void 0,vn++,Ae=!1,ke());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),oe){Fn=t;return}if(Nt||Ae&&!Mt){Ne("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++vn;Mt?.abort();try{const i=Td(t);zo();const s=x.tabs.find(d=>d.source?.kind==="url"&&d.source.url===i),c=s;if(c){if(bt&&bt!==c.key&&!await Ho()||o!==vn||n!==Ts)return;const d=me()||x.active!==c.key;x.active=c.key,ke(),be(180,d),Ne("開いている共有元のタブを選択しました。表示内容は保持しています。"),eo();return}Mt=new AbortController,Ae=!0,ke();const l=await No(i,Mt.signal);if(o!==vn)return;const a=Rn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:l,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},l);if(!await Qn(a))return;Ne("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===vn&&!(i instanceof Ln)&&Ne("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===vn&&(Mt=void 0,Ae=!1,ke(),Dr())}}window.addEventListener("hashchange",()=>{Qi().then(()=>{x.document?.key===Li&&eo()})});function es(e){x.drawer=!0,et(),qt()}async function rl(e){const t=en(e);if(!(e.design.sourceFormat==="json"||t.busy||oe||ne||pe===e)){t.busy=!0;try{await Ki(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,qt()}}}let jo;At.onchange=()=>{const e=At.files?.[0],t=jo??K();jo=void 0,At.value="",!(!e||!t||!Tt(t))&&(es(),xr(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};At.oncancel=()=>{jo=void 0};y("check-open").onclick=()=>{jo=K(),At.click()};let ts,vo=null;function ns(){Wt.hidden=!0,ts=void 0,(vo&&!vo.closest("[hidden]")?vo:y("open-checks").getBoundingClientRect().width?y("open-checks"):y("document-actions-toggle")).focus({preventScroll:!0})}y("check-open-url").onclick=()=>{const e=K();e&&(vo=Oi??document.activeElement,ts=e,y("check-url").value=en(e).url??"",Wt.hidden=!1,y("check-url").focus())};y("check-url-cancel").onclick=ns;Wt.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),ns())};y("check-url-form").onsubmit=e=>{e.preventDefault();const t=ts;if(!t||!Tt(t))return;const n=y("check-url").value.trim();en(t).url=n,ns(),es(),xr(t,async()=>({name:n,url:n,markdown:await Ad(n)}))};y("check-open-sample").onclick=()=>{const e=K();!e||!_i(e)||(es(),Ar(e,{name:"チェックリストのサンプル",markdown:zd}))};y("check-close").onclick=()=>{const e=K();e&&rl(e)};y("open-sample-menu").onclick=()=>{y("open-sample").click()};y("view-markdown").onclick=()=>{const e=K();e&&Yi("view",e)};y("open-url").onclick=()=>Yi("url");y("open-text").onclick=()=>Yi("text");y("source-cancel").onclick=()=>Lr();y("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Lr())};y("source-submit").onclick=async()=>{if(Nt||oe||Qe==="view"&&pe||y("source-dialog").hidden||Qe==="view")return;Nt=!0,Xn();const e=++Zt,t=Qe;Oo=new AbortController;try{const n=Qe==="url"?new URL(Kn().value.trim()).href:Kn().value.trim();if(t==="url"&&x.document?.source?.kind==="url"&&x.document.source.url===n){Fe?.reopenBusinessOverview(),x.active=x.tabs[0].key,Co(),ke(),eo();return}const o=t==="url"?await No(n,Oo.signal):Ed(Et().value),i=o.markdown;if(e!==Zt)return;const s=Rn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await Qn(s))return;Ne(""),t==="text"&&(Bo=i),Co()}catch(n){e===Zt&&!(n instanceof Ln)&&Ne("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===Zt&&(Nt=!1,Xn())}};y("layout-lock").onclick=()=>{ne||(ot.cancel(),xe=void 0,me(),mt=!mt,et(),tn())};y("selected-edges-only").onchange=()=>{const e=K();!e||ne||oe||pe===e||(ot.cancel(),xe=void 0,me(),e.selectedEdgesOnly=y("selected-edges-only").checked,Jn(),be())};y("show-exceptions").onchange=()=>{const e=K();!e||ne||oe||pe===e||(ot.cancel(),xe=void 0,me(),e.showExceptions=y("show-exceptions").checked,Jn(),be())};y("prefer-write").onchange=()=>{ne||(me(),x.preferWrite=y("prefer-write").checked,tn(),be())};y("theme").onclick=()=>{ne||(x.dark=!x.dark,et(),be())};y("drawer").onclick=()=>{ne||!K()||(me(),x.drawer=!x.drawer,ke(),be())};for(const[e,t]of[["in",ds],["out",1/ds]])y(e).onclick=()=>{const n=K();if(n&&pe!==n){const o=me(),i=ma({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,ke(),be(180,s)}};const ve=y("viewport");function Nr(e,t){const n=K();if(!n||oe||pe===n)return;me();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Ct();const i=Array.from(y("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),Jn()}const _t=ga({read:()=>{const e=K();return e&&!oe&&e!==pe&&!mt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>K()?.positions[e],connected:e=>Array.from(y("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=ve.getBoundingClientRect(),t=e.left+ve.clientLeft,n=e.top+ve.clientTop,o={left:t,top:n,right:t+ve.clientWidth,bottom:n+ve.clientHeight};for(const[s,c]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const l=y(s),a=l.getBoundingClientRect();l.hidden||a.bottom<=n||a.top>=o.bottom||(c==="right"&&a.left>o.left&&a.left<o.right&&(o.right=a.left),c==="left"&&a.right>o.left&&a.right<o.right&&(o.left=a.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:Nr,pan:e=>{const t=K();if(!t||t===pe||mt)return;me();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Ot(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],me(),Ct()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),ot=ha(ve,{nodeDrag:_t,read:()=>{const e=K();return e&&!oe&&pe!==e?{key:e.key,zoom:e.zoom,locked:mt,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},position:e=>K()?.positions[e],change:e=>{const t=K();if(!t||oe||pe===t)return;const n=t.scroll;let o=!1;e.node&&Nr(e.node.id,e.node.position),e.selected&&(tt().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Dn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?tn():e.zoom!==void 0&&Ot(t),e.scroll&&(ve.scrollLeft=e.scroll[0],ve.scrollTop=e.scroll[1]),me(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ct()},finish:()=>{const e=K();e&&Ot(e),me(),be(180,!1)}}),os=()=>{ot.cancel(),xe=void 0,me(),be(0,!1)};window.addEventListener("blur",os);window.addEventListener("pagehide",os);document.addEventListener("visibilitychange",()=>{document.hidden&&os()});ve.onscroll=()=>{me()};let xe;ba(ve,{read:()=>{const e=K();return e&&!ne&&!oe&&e!==pe?{zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},change:e=>{const t=K();!t||oe||t===pe||(ot.cancel(),_t.cancel(),xe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Ot(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],me(!1),Ct(),be(180,!1))}});ve.onpointerdown=e=>{const t=K(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||oe||t===pe||n&&!mt||(xe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[ve.scrollLeft,ve.scrollTop],node:n,moved:!1},ve.setPointerCapture(e.pointerId))};ve.onpointermove=e=>{if(xe&&xe.pointer===e.pointerId&&xe.key===K()?.key&&K()!==pe){const t=e.clientX-xe.x,n=e.clientY-xe.y;Math.hypot(t,n)>3&&(xe.moved=!0),ve.scrollLeft=xe.scroll[0]-t,ve.scrollTop=xe.scroll[1]-n,me()}};ve.onpointerup=e=>{if(!xe||xe.pointer!==e.pointerId)return;const t=K(),n=xe;xe=void 0,ve.hasPointerCapture?.(e.pointerId)&&ve.releasePointerCapture(e.pointerId),t&&t!==pe&&n.key===t.key&&!n.moved&&n.node&&(tt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ct()),Dn(n.node),tn()),me(),be(180,!1)};ve.onpointercancel=()=>{xe=void 0};ve.addEventListener("lostpointercapture",e=>{e.target===ve&&xe?.pointer===e.pointerId&&(xe=void 0)});let Go=!1;y("resize").onpointerdown=e=>{ne||(Go=!0,y("resize").setPointerCapture(e.pointerId))};y("resize").onpointermove=e=>{if(Go){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==x.width&&(x.width=t,Ct()),et()}};y("resize").onpointerup=()=>{Go=!1,be(180,!1)};y("resize").onpointercancel=()=>{Go=!1,be(180,!1)};y("resize").onkeydown=e=>{if(!ne&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,x.width+(e.key==="ArrowLeft"?20:-20)));t!==x.width&&(x.width=t,Ct()),et(),be(180,!1)}};window.addEventListener("resize",()=>{et();const e=K();e&&Ot(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=K();t&&Ot(t)});e.observe(y("viewport")),e.observe(document.querySelector(".toolbar"))}function bo(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=fn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");On(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Nn=document.createElement("section");Nn.id="source-update-notice";Nn.className="info-bar";Nn.hidden=!0;Nn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Nn);let dn;const Pr=new Set;let ai=0,Li,ci;function Jo(){const e=x.document;Nn.hidden=!dn||dn.key!==e?.key||dn.baseline!==e.design.markdown||Pr.has(e.key),y("source-update-refresh").disabled=ne||Ae||oe||!!(e&&Dt.has(e.key))}y("source-update-close").onclick=()=>{dn&&Pr.add(dn.key),Jo()};y("source-update-refresh").onclick=()=>{y("refresh").click()};async function eo(){const e=x.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(ci===t)return;ci=t;const n=++ai,o=e.key,i=e.source.url,s=e.design.markdown;try{const c=await $i(i);if(n!==ai||x.document?.key!==o||x.document.design.markdown!==s||x.document.source?.kind!=="url"||x.document.source.url!==i)return;fn(c),dn=c.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,Jo()}catch{}finally{n===ai&&(ci=void 0)}}Fe=Ic(ut,{rightDrawer:{isOpen:()=>x.drawer,isReady:()=>!ne,setOpen:e=>{ne||(x.drawer=e,et(),be())}},capture:()=>{me(),ot.cancel(),xe=void 0},business:()=>({key:x.document?.key,design:x.document?.design,relatedChecks:x.tabs[0]?Yc(x.tabs[0]):[],viewKey:K()?.key,views:x.tabs.map(e=>({key:e.key,name:e.name,activity:Io(e),object:So(e)})),activities:x.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:x.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:x.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!x.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=x.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Ci(e),go(e)},openObject:e=>{jr(e),go(e)},openOverview:()=>{x.tabs[0]&&(me(),Fe?.reopenBusinessOverview(),x.active=x.tabs[0].key,ke(),be())},activateView:e=>{x.tabs.some(t=>t.key===e)&&(me(),x.active=e,ke(),be())},statePanel:e=>x.document?Ec(x.document.design,e,t=>{Fe?.activateBusiness(),Ci(t),go(t),Fe?.businessActivated()}):void 0,closeLegacyList:()=>{x.nodeDrawer=!1,et()},refresh:()=>{et(),ki.update()}});const al=x;ke();Je();Pc().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const d of t.recovery??[])bo(d);if(t.document){const d={...t.document};bo(d),t.document.design=d.design,t.document.checks=d.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const d of t.tabs)bo(d)}const n=Uc(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(d=>({...d,name:n.document.name,design:d.design,checks:d.checks,source:d.source,draft:d.draft,edited:d.edited,handle:d.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const d of o.tabs)bo(d);if(new Set(o.tabs.map(d=>d.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const d of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!d||!d.positions||typeof d.positions!="object"||Array.isArray(d.positions)||d.selectedEdgesOnly!==void 0&&typeof d.selectedEdgesOnly!="boolean"||d.showExceptions!==void 0&&typeof d.showExceptions!="boolean"||d.hiddenNodes!==void 0&&(!Array.isArray(d.hiddenNodes)||!d.hiddenNodes.every(r=>typeof r=="string"))||d.viewInset!==void 0&&(!Array.isArray(d.viewInset)||d.viewInset.length!==2||!d.viewInset.every(r=>Number.isFinite(r)&&r>=0))||d.canvasOrigin!==void 0&&(!Array.isArray(d.canvasOrigin)||d.canvasOrigin.length!==2||!d.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(d.scroll)||d.scroll.length!==2||!d.scroll.every(Number.isFinite)||!Number.isFinite(d.zoom)||d.zoom<.25||d.zoom>2.5||!Object.values(d.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:c,...l}=o,a=d=>({...d,hiddenNodes:d.hiddenNodes??(o.scopeOutside==="hide"?d.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});x=Qt({...l,tabs:o.tabs.map(a)},n.recovery,n.document,o.tabs.map(d=>{const{design:r,checks:u,source:f,draft:m,edited:g,handle:p,name:h,...S}=a(d);return S})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(x.sampleLayout={...o.sampleLayout,hiddenNodes:fn(Vi).graph.nodes.filter(d=>!d.scope).map(d=>d.id)}),x.tabs.some(d=>d.key===x.active)||(x.active=x.tabs[0]?.key),K()?.selected&&Dn(K().selected),Li=x.document?.key,ke(),Bi=!0}).catch(()=>{x=al,jn=!0,Hi()}).finally(()=>{ne=!1,ke(),Je(),Qi().then(()=>{x.document?.key===Li&&eo()})});
