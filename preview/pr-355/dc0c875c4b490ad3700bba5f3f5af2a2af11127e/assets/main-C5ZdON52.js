import{L as Lr,D as sc,G as rc,W as ac,P as cc,l as Kn,X as Nr,C as dc,n as lc,S as Pr,o as Tr,p as qr,M as $r,q as Wr,s as zr,t as ls,g as us,r as To,d as Ur,b as Ui,u as ps,U as Vr,v as uc,w as Fr,x as Br,y as qo,z as pc,m as fs,A as fc,B as Gr,E as mc,j as hc,F as Zs,H as bc,T as gc,I as yc,J as vc,R as wc,K as kc,N as Ic,O as Sc,Q as xc,V as Ac,Y as Ec,Z as Ys,k as Oc,i as jc,h as Dc,f as Cc,a as Mc,_ as Rc,$ as Lc,a0 as Hr,a1 as Nc,a2 as Pc,a3 as Tc,a4 as qc,e as $c}from"./canvas-toolbar-DBjSxaGB.js";const Wc={subsystems:{full:"サブシステム",icon:cc},business:{full:"業務設計",icon:ac},states:{full:"状態遷移",icon:rc},concept:{full:"データ構造",icon:sc},tests:{full:"テスト仕様",icon:Lr}};function $o(e,t,n){const i=Wc[t],o=document.createElement("span"),r=document.createElement("span"),s=document.createElement("span");o.className="view-tab-label",r.className="view-tab-kind",r.setAttribute("aria-hidden","true"),r.append(Kn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),s.className="view-tab-name",s.textContent=n,o.append(r,s),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function Wo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Kn(Nr,{"aria-hidden":"true","stroke-width":1.8})),t}function zc(e){const t=Kn(e?dc:lc,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Uc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,r=e.scrollLeft,s=Math.max(0,Math.min(n,r+i*o));s!==r&&(e.scrollLeft=s,t.preventDefault())},{passive:!1})}function Vc(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const Fc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Qs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=Fc,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,r)=>{const s=Kn(o,{"stroke-width":1.8,"aria-hidden":"true"});r&&s.classList.add(r),t.querySelector(i)?.append(s)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Pr),n(".layout-lock",Tr,"lock-closed"),n(".layout-lock",qr,"lock-open"),n(".zoom-out",$r),n(".zoom-in",Wr)}function er(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Bc({model:e}){const t=e.meta&&typeof e.meta=="object"?e.meta:{},n=Array.isArray(t.fieldMappings)?t.fieldMappings.filter(m=>!!m&&typeof m=="object"&&typeof m.informationId=="string"&&typeof m.physicalName=="string"&&Array.isArray(m.relationIds)&&m.relationIds.every(p=>typeof p=="string")):[],i=new Map(n.map(m=>[m.informationId,m])),o=new Map(e.concepts.map(m=>[m.id,m])),r=(m,p,h)=>{const x=o.get(m)?.information.find(w=>h?w.id===h:w.name===p),v=x&&i.get(x.id);if(!v)return["",p];const k=[v.physicalName,p,x.id,v.valueType==="array"?"array":""];return v.valueType==="array"&&v.nullable===!0&&k.push("nullable"),k},s=(m,p)=>{const h=[];for(const x of m)for(const v of[x.from,x.to]){const k=p[v],w=k?.conceptId??v,A=o.get(w);if(A)for(const E of A.information){const O=i.get(E.id);O&&O.relationIds.some($=>x.relationIds.includes($)&&e.relations.some(D=>D.id===$&&(D.fromConceptId===w||D.toConceptId===w)))&&h.push({from:x.from,to:x.to,owner:v,informationId:E.id})}}return h},a=Object.fromEntries(e.concepts.map(m=>[m.id,{name:m.name,note:m.description,fields:m.information.map(p=>r(m.id,p.name+(p.responsibleSubsystemId&&p.responsibleSubsystemId!==m.subsystemId?"（担当："+e.subsystems.find(h=>h.id===p.responsibleSubsystemId).name+"）":""),p.id))}])),c=e.relations.map(m=>[m.fromConceptId,m.toConceptId,m.fromLabel,m.toLabel,m.kind]),l=e.reviewGroups.map(m=>({id:m.id,name:m.title,purpose:m.description,activities:m.relatedActivityIds,concepts:Object.fromEntries(m.graph.nodes.map(p=>[p.conceptId,{name:p.name,note:p.description,fields:p.fields.map(h=>r(p.conceptId,h)),sources:p.sources,sourceActivities:p.sourceActivityIds}])),relations:m.graph.edges.map(p=>[p.fromConceptId,p.toConceptId,p.fromLabel,p.toLabel,p.kind])})),d=m=>l.find(p=>p.id===m),f=(m,p)=>{const h=Object.fromEntries(m.nodes.map(k=>[k.id,{...p[k.conceptId],name:k.name,note:k.description,sources:k.sources,conceptId:k.conceptId,subsystemId:k.subsystemId,fields:k.fields.map(w=>r(k.conceptId,w.name,w.informationId))}])),x=e.subsystems.filter(k=>m.nodes.some(w=>w.subsystemId===k.id)).map(k=>({id:k.id,name:k.name})),v=m.handoffIds.map(k=>e.handoffs.find(w=>w.id===k)).map(k=>({id:k.id,from:k.fromSubsystemId,to:k.toSubsystemId,label:k.information,returning:k.flowDirection==="return"}));return{ids:m.nodes.map(k=>k.id),tables:h,edges:m.edges.map(k=>[k.fromViewId,k.toViewId,k.fromLabel,k.toLabel,k.kind]),regions:x,handoffs:v,fieldLinks:s(m.edges.map(k=>({from:k.fromViewId,to:k.toViewId,relationIds:k.relationIds})),h)}},g=s(e.relations.map(m=>({from:m.fromConceptId,to:m.toConceptId,relationIds:[m.id]})),a);return{tables:a,edges:c,groups:l,findGroup:d,graph:m=>{const p=d(m);if(!p)throw Error("Unknown review group: "+m);const h=e.reviewGroups.find(k=>k.id===m),x=h.graph.subsystemViews;if(x)return f(x,p.concepts);const v=Object.keys(a).filter(k=>Object.hasOwn(p.concepts,k));return{ids:v,tables:p.concepts,edges:p.relations.filter(([k,w])=>v.includes(k)&&v.includes(w)),regions:[],handoffs:[],fieldLinks:s(h.graph.edges.map(k=>({from:k.fromConceptId,to:k.toConceptId,relationIds:k.relationIds})),p.concepts)}},overviewGraph:()=>e.presentation.subsystemViews?f(e.presentation.subsystemViews,a):{ids:Object.keys(a),tables:a,edges:c,regions:[],handoffs:[],fieldLinks:g},fieldLinks:g}}function dt(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Gc(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",dt(i,"span",t),i.onclick=n,e.append(i),i}function Hc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Jc(e,t,n,i=()=>{},o=()=>{},r=[]){const s=n.contentFor(t.id);if(e.replaceChildren(),!s)return;dt(e,"p",s.description).className="review-description",dt(e,"h3","Activity");const a=document.createElement("ul");a.className="review-related-activities";for(const c of s.relatedActivities){const l=document.createElement("li"),d=r.find(g=>g.id===c.id&&g.name===c.name),f=Gc(l,c.name,()=>{d&&o(d.id)});f.disabled=!d,f.setAttribute("aria-label",c.name+"を業務タブで開く"),a.append(l)}e.append(a),dt(e,"h3","情報の構造");for(const c of s.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=c.id,dt(l,"h4",c.title),dt(l,"p",c.description),e.append(l)}dt(e,"h3","できること");for(const c of s.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=c.id,dt(l,"h4",c.title),dt(l,"p",c.description);for(const d of c.samples){const f=i(c.id,d.id),g=document.createElement("button");g.className="review-sample-link",g.type="button",g.dataset.sample=d.id,g.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+d.name,f?g.onclick=f.open:(g.disabled=!0,g.title="対応するテスト仕様へのリンクがありません"),l.append(g)}e.append(l)}dt(e,"h3","できないこと（業務上のルール）");for(const c of s.limitations){const l=document.createElement("section");l.className="review-limitation",dt(l,"h4",c.title),dt(l,"p",c.description),dt(l,"h5","理由"),dt(l,"p",c.reason),e.append(l)}}function un(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function _c({model:e,business:t}){const n=s=>s.kind==="group"?e.subsystems.find(a=>a.id===s.id):e.handoffs.find(a=>a.id===s.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(s){const a=n(s);return a?a.activityIds.map(c=>t.activities.find(l=>l.id===c)).filter(Boolean):[]}function r(s,a){if(s.replaceChildren(),a.kind==="group"){const f=e.subsystems.find(u=>u.id===a.id);if(!f)return"";un(s,"p",f.purpose),un(s,"h3","扱う情報");const g=s.ownerDocument.createElement("ul");for(const u of f.information)un(g,"li",u);return s.append(g),un(s,"h3","まとまりの理由"),un(s,"p",f.reason),f.name}const c=e.handoffs.find(f=>f.id===a.id);if(!c)return"";un(s,"p",c.description),un(s,"h3","出元と受取先");const l=e.subsystems.find(f=>f.id===c.fromSubsystemId),d=e.subsystems.find(f=>f.id===c.toSubsystemId);return un(s,"p",`${l.name} → ${d.name}`),c.information}return{sections:i,activities:o,describe:r}}function tr(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const a=Number(sessionStorage.getItem(n));Number.isFinite(a)&&a>=280&&(o=a)}catch{}const r=()=>{let a=t.clientWidth||innerWidth;const c=t.querySelector("#design-explorer");return innerWidth>800&&c&&!c.hidden&&(a-=c.offsetWidth),Math.max(280,Math.min(1e3,a-(innerWidth>800?240:16)))},s=(a,c=!1)=>{if(o=Math.max(280,Math.min(r(),a)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(r())),i.setAttribute("aria-valuenow",String(Math.round(o))),c)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=a=>{["ArrowLeft","ArrowRight","Home","End"].includes(a.key)&&(a.preventDefault(),s(a.key==="Home"?280:a.key==="End"?r():o+(a.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=a=>{if(a.button!==0)return;a.preventDefault();const c=a.clientX,l=o;i.setPointerCapture(a.pointerId),i.classList.add("resizing"),i.onpointermove=d=>s(l+c-d.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),s(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const a=new ResizeObserver(()=>s(o));a.observe(t);const c=t.querySelector("#design-explorer");c&&a.observe(c)}window.addEventListener("resize",()=>s(o)),s(o)}const Kc=260,Xc=68,Zc="http://www.w3.org/2000/svg",zt=(e,t,n={})=>{const i=e.createElementNS(Zc,t);for(const[o,r]of Object.entries(n))i.setAttribute(o,String(r));return i};function Yc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Kn(Vr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Qc(e,{model:t,business:n},i,o,r){const s=t.reviewGroups,a=t.subsystems,c=t.presentation.landscapeRelationships.map(w=>{const A=s.find(O=>O.id===w.from),E=s.find(O=>O.id===w.to);if(!A||!E||A.subsystemId!==E.subsystemId||!t.presentation.reviewBoundaries.some(O=>O.from===w.from&&O.to===w.to))throw Error("Unknown overview relationship: "+w.from+" -> "+w.to);return w}),l=t.handoffs.map(w=>{if(!["forward","return"].includes(w.flowDirection))throw Error("Unknown overview handoff direction: "+w.id);return{id:w.id,from:w.fromSubsystemId,to:w.toSubsystemId,label:w.information,returning:w.flowDirection==="return"}});if(new Set(l.map(w=>w.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const w of l)if(!a.some(A=>A.id===w.from)||!a.some(A=>A.id===w.to)||w.from===w.to||!w.label.trim())throw Error("Unknown overview handoff: "+w.id);for(const w of s){if(!a.some(A=>A.id===w.subsystemId))throw Error("Unknown overview subsystem: "+w.id);if(!n.roles?.some(A=>A.id===w.reviewer.roleId))throw Error("Unknown overview reviewer: "+w.id)}const d=a.flatMap(w=>s.filter(A=>A.subsystemId===w.id)),f=new Map;let g=0;for(const[w,A]of a.entries())for(const E of d.filter(O=>O.subsystemId===A.id))f.set(E.id,[80+g*170,100+g*120+w*64]),g++;const u=ls(),b="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,p;try{const w=JSON.parse(localStorage.getItem(b)||"null"),A=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),E=!w&&A?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,O=w??E;if(O){typeof O.zoom=="number"&&Number.isFinite(O.zoom)&&(u.zoom=Math.max(.25,Math.min(2.5,O.zoom))),Array.isArray(O.scroll)&&O.scroll.length===2&&O.scroll.every(N=>typeof N=="number"&&Number.isFinite(N))&&(u.scroll=O.scroll),typeof O.locked=="boolean"&&(u.locked=O.locked);for(const[N,Y]of Object.entries(O.positions??{}))s.some(W=>W.id===N)&&Array.isArray(Y)&&Y.length===2&&Y.every(W=>typeof W=="number"&&Number.isFinite(W))&&u.positions.set(N,[Y[0],Y[1]])}const $=O?.selection,D=$?.kind==="node"?t.concepts.find(N=>N.id===$.id)?.subsystemId:$?.id,L=$?.kind==="node"?"group":$?.kind;typeof D=="string"&&(L==="model"&&s.some(N=>N.id===D)||L==="group"&&a.some(N=>N.id===D)||L==="connection"&&l.some(N=>N.id===D))&&(p={kind:L,id:D}),p?.kind==="model"&&(u.selected=p.id)}catch{}const h=()=>{try{localStorage.setItem(b,JSON.stringify({zoom:u.zoom,scroll:u.scroll,locked:u.locked,positions:Object.fromEntries(u.positions),selection:p}))}catch{}},x=w=>{if(!w&&!p)return;p=w,u.selected=w?.kind==="model"?w.id:void 0;const A=m?.querySelector(".diagram-world>svg");A&&v(A),h()},v=w=>{const A=Ui(c,u.selected),E=Ui(l,p?.kind==="group"?p.id:void 0);for(const O of s){const $=w.querySelector(`[data-node="${O.id}"]`);$?.setAttribute("class","node graph-shape state-shape"+A.nodeClasses(O.id)),$?.setAttribute("aria-pressed",String(u.selected===O.id))}for(const O of a){const $=w.querySelector(`[data-subsystem="${O.id}"]`);$?.setAttribute("class","subsystem-overview-group"+E.nodeClasses(O.id)),$?.querySelector("button")?.setAttribute("aria-pressed",String(p?.kind==="group"&&p.id===O.id))}for(const O of c){const $=w.querySelector(`[data-overview-from="${O.from}"][data-overview-to="${O.to}"]`);$?.setAttribute("class","edge"+(A.related(O)?" review-related":"")),$?.setAttribute("marker-end",`url(#overview-${A.related(O)?"related-arrow":"arrow"})`)}for(const O of l){const $=E.related(O)||p?.kind==="connection"&&p.id===O.id,D=w.querySelector(`[data-handoff-id="${O.id}"]`);D?.setAttribute("class","edge"+(O.returning?" exception":"")+($?" review-related":"")),D?.setAttribute("marker-end",`url(#overview-${$?"related-arrow":"arrow"})`),w.querySelector(`[data-handoff-label="${O.id}"]`)?.classList.toggle("review-related",!!$)}w.querySelectorAll("[data-exception-paint]").forEach(O=>O.remove());for(const O of Array.from(w.querySelectorAll("[data-handoff-id].exception")))ps(w,O,{path:O.getAttribute("d")},{"data-overview-return-paint":O.getAttribute("data-handoff-id")})};return m=zr(e,w=>{const A=d.map(L=>{const N=w.positions.get(L.id)??f.get(L.id);return{id:L.id,x:N[0],y:N[1],width:Kc,height:Xc}}),E=zt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});E.append(us("overview-"));let O=0,$=0;const D=[];for(const L of a){const N=A.filter(pe=>s.find(Se=>Se.id===pe.id)?.subsystemId===L.id);if(!N.length)continue;const Y=Math.min(...N.map(pe=>pe.x))-30,W=Math.min(...N.map(pe=>pe.y))-48,Z=Math.max(...N.map(pe=>pe.x+pe.width))-Y+30,Q=Math.max(...N.map(pe=>pe.y+pe.height))-W+30;D.push({id:L.id,x:Y,y:W,width:Z,height:Q});const H=zt(e,"g",{"data-subsystem":L.id,"aria-label":L.name}),oe=zt(e,"rect",{x:Y,y:W,width:Z,height:Q,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});oe.addEventListener("click",()=>x({kind:"group",id:L.id})),H.append(oe);const ue=zt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:Y+8,y:W+3,width:Z-16,height:36}),be=e.createElement("button");be.type="button",be.className="subsystem-overview-region-title",be.setAttribute("aria-label",L.name+"を選択"),be.textContent=L.name,be.onclick=()=>x({kind:"group",id:L.id}),ue.append(be),H.append(ue),E.append(H),O=Math.max(O,Y+Z+40),$=Math.max($,W+Q+40)}for(const[L,N]of l.entries()){if(!D.some(H=>H.id===N.from)||!D.some(H=>H.id===N.to))throw Error("Missing overview handoff region: "+N.id);const Y=Math.max(30,N.label.length*12),W=To({from:N.from,to:N.to,nodes:D,index:L,kind:"input",matrix:{returning:N.returning,captionLane:0},labelWidth:Y,labelHeight:18}),Z=zt(e,"path",{d:W.path,class:"edge"+(N.returning?" exception":""),"data-handoff-id":N.id,"data-from-subsystem":N.from,"data-to-subsystem":N.to,"data-flow-direction":N.returning?"return":"forward","marker-end":"url(#overview-arrow)"});E.append(Z);const Q=zt(e,"text",{x:W.label[0]-Y/2,y:W.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":N.id});Q.textContent=N.label,Q.addEventListener("pointerdown",H=>H.stopPropagation()),Q.addEventListener("pointerup",H=>H.stopPropagation()),Q.addEventListener("click",()=>x({kind:"connection",id:N.id})),Q.addEventListener("keydown",H=>{(H.key==="Enter"||H.key===" ")&&(H.preventDefault(),x({kind:"connection",id:N.id}))}),E.append(Q),O=Math.max(O,W.bounds.right+40,W.label[0]+Y/2+30),$=Math.max($,W.bounds.bottom+40,W.label[1]+30)}for(const[L,N]of c.entries()){const Y=To({from:N.from,to:N.to,nodes:A,index:L,kind:"input",labelWidth:0,labelHeight:0}),W=zt(e,"path",{d:Y.path,class:"edge","data-overview-from":N.from,"data-overview-to":N.to,"marker-end":"url(#overview-arrow)"});E.append(W),O=Math.max(O,Y.bounds.right+40),$=Math.max($,Y.bounds.bottom+40)}for(const L of A){const N=s.find(Se=>Se.id===L.id),Y=n.roles.find(Se=>Se.id===N.reviewer.roleId),W=zt(e,"g",{role:"button",tabindex:0,"aria-label":N.title+"を選択","aria-pressed":"false","data-node":L.id,"data-review-group":L.id,"data-subsystem-id":N.subsystemId,class:"node graph-shape state-shape"}),Z=Ur(e,L);Z.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),W.append(Z,zt(e,"rect",{x:L.x,y:L.y,width:L.width,height:L.height,rx:8,class:"state-diagram-node"}));const H=zt(e,"foreignObject",{x:L.x,y:L.y,width:L.width,height:L.height}),oe=e.createElement("div");oe.className="subsystem-overview-card";const ue=Yc(e,Y.color),be=e.createElement("span");be.className="subsystem-overview-labels",be.title=N.title+" — "+Y.name;for(const[Se,q,B]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",N.title],["small","subsystem-overview-role",Y.name]]){const _=e.createElement(Se);_.className=q,_.textContent=B,be.append(_)}const pe=e.createElement("button");pe.type="button",pe.className="subsystem-overview-open",pe.setAttribute("aria-label",N.title+"の詳細タブを開く"),pe.title="詳細タブを開く",pe.textContent="開く",pe.onpointerdown=Se=>Se.stopPropagation(),pe.onpointerup=Se=>Se.stopPropagation(),pe.onclick=Se=>{Se.stopPropagation(),o(N.id)},oe.append(ue,be,pe),H.append(oe),W.append(H),W.addEventListener("click",()=>x({kind:"model",id:L.id})),W.addEventListener("keydown",Se=>{(Se.key==="Enter"||Se.key===" ")&&(Se.preventDefault(),x({kind:"model",id:L.id}))}),E.append(W)}return E.setAttribute("viewBox",`0 0 ${O} ${$}`),v(E),E},u,h,()=>x(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",h),m.addEventListener("pointerup",()=>queueMicrotask(h)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",h),{root:m,selected:()=>u.selected,selection:()=>p,restore:()=>{const w=()=>{const A=m.querySelector(".diagram-viewport");A.scrollLeft=u.scroll[0],A.scrollTop=u.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(w):w()}}}function ed(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const r=i.cells.find(s=>s.columnId===o.id);if(!r)throw Error("Missing sample cell: "+o.id);return r}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function td({model:e,business:t}){const n=b=>{const m=t.activities.find(p=>p.id===b);if(!m)throw Error("Unknown activity: "+b);return m},i=b=>{const m=t.roles?.find(p=>p.id===b);if(!m)throw Error("Unknown role: "+b);return m.name},o=e.reviewGroups.map(b=>({id:b.id,title:b.title,description:b.description,reviewer:{role:i(b.reviewer.roleId)},relatedActivities:b.relatedActivityIds.map(m=>{const p=n(m);return{id:p.id,name:p.name}}),structureStatements:b.structureStatements,capabilities:b.capabilities.map(m=>({...m,samples:m.samples.map(ed)})),limitations:b.limitations,meta:{questions:b.meta.questions}})),r=b=>o.find(m=>m.id===b),s=(b,m)=>r(b)?.capabilities.find(p=>p.samples.some(h=>h.id===m)),a=o.flatMap(b=>b.capabilities.flatMap(m=>m.samples.map(p=>({...p,group:b.id})))),c=["yellow","cyan","green","blue","purple","orange"];function l(b,m,p){let h=p.get(m);if(h||(h=c[p.size]??`extra-${p.size}`,p.set(m,h)),b.dataset.sampleKey=m,b.dataset.keyTone=h,b.className="data-example-key",h.startsWith("extra-")){const x=(Number(h.slice(6))*137.508%360).toFixed(2);b.style.setProperty("--sample-key-extra-light",`hsl(${x} 26% 78%)`),b.style.setProperty("--sample-key-extra-dark",`hsl(${x} 24% 25%)`)}}const d=b=>a.filter(m=>m.group===b),f=(b,m)=>d(b).find(p=>p.id===m);function g(b,m,p){const h=b.ownerDocument.createElement(m);return h.textContent=p,b.append(h),h}function u(b,m,p,h,x){const v=b.ownerDocument,k=f(m.id,p);if(!k)throw Error("Unknown data example: "+p);b.replaceChildren(),b.dataset.dataExample=p;const w=new Map;e.presentation.sampleCaption&&(g(b,"p",e.presentation.sampleCaption).className="data-example-caption");const A=r(m.id)?.capabilities??[],E=x?.capabilityId?A.filter(N=>N.id===x.capabilityId):A;if(x?.capabilityId&&!E.some(N=>N.samples.some(Y=>Y.id===p)))throw Error("Sample does not belong to capability: "+p);const O=s(m.id,p);b.dataset.capability=O.id;const $=()=>{g(b,"h2",x?.heading?.trim()||O.title),x?.renderSpecification?x.renderSpecification(b):g(b,"p",O.description).className="data-example-capability"};x?.capabilityId&&!x.hideCapability&&$();const D=v.createElement("label");D.className="data-example-picker",g(D,"span","場面");const L=v.createElement("select");L.setAttribute("aria-label","データ例の場面");for(const N of E){let Y=L;if(!x?.capabilityId){const W=v.createElement("optgroup");W.label=N.title,L.append(W),Y=W}for(const W of N.samples){if(x?.sampleIds&&!x.sampleIds.includes(W.id))continue;const Z=v.createElement("option");Z.value=W.id,Z.textContent=W.name,Y.append(Z)}}if(L.value=p,L.onchange=()=>h(L.value),D.append(L),(!x?.hideSinglePicker||L.options.length>1)&&b.append(D),!x?.capabilityId&&!x?.hideCapability&&$(),g(b,"h3",k.name).className="data-example-scene",x?.collapseScenario&&k.when){const N=v.createElement("details");N.className="data-example-context",g(N,"summary","場面の背景"),g(N,"p",k.when).className="data-example-when",b.append(N)}else g(b,"p",k.when).className="data-example-when";g(b,"p",k.meaning).className="data-example-meaning";for(const N of k.blocks){const Y=v.createElement("section");Y.className="data-example-block",Y.dataset.exampleCard=N.card,g(Y,"h3",m.concepts[N.card].name);const W=v.createElement("div");W.className="data-example-table",W.tabIndex=0,W.setAttribute("role","region"),W.setAttribute("aria-label",m.concepts[N.card].name+"のデータ表");const Z=v.createElement("table");Z.setAttribute("aria-label",m.concepts[N.card].name+"のデータ例");const Q=v.createElement("caption");Q.textContent=m.concepts[N.card].name+"に入る情報",Z.append(Q);const H=v.createElement("thead"),oe=v.createElement("tr");for(const be of N.columns)g(oe,"th",be).setAttribute("scope","col");H.append(oe),Z.append(H);const ue=v.createElement("tbody");for(const[be,pe]of N.rows.entries()){const Se=v.createElement("tr");for(const[q,B]of pe.entries()){const _=g(Se,"td",String(B)),ge=N.keyIds[be][q];ge&&(l(_,ge,w),_.title=N.columns[q]+"："+B)}ue.append(Se)}Z.append(ue),W.append(Z),Y.append(W),N.rows.length||g(Y,"p",N.empty??"データはありません。"),b.append(Y)}k.note&&(g(b,"p",k.note).className="data-example-note")}return{reviewContents:o,dataExamples:a,contentFor:r,capabilityFor:s,examplesFor:d,findDataExample:f,renderDataExample:u}}function ms(e,t){const n=e.model?.business,i=n?.activities.find(r=>r.id===t);if(!i||"performers"in i)return;const o=typeof i.who=="object"&&i.who?.kind==="role"?i.who.roleId:"roleId"in i?i.roleId:void 0;return o?n?.roles?.find(r=>r.id===o):void 0}function nd(e,t,n){const i=e.model?.business.activities.find(o=>o.id===t);return i&&"who"in i&&typeof i.who=="object"&&i.who&&(i.who.kind==="system"||i.who.kind==="scheduler")?i.who.kind+":"+i.who.name:ms(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function id(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function et(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,r;const s=(a,c)=>{for(const l of c.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const d=document.createElement("strong");d.textContent=l.slice(2,-2),a.append(d)}else if(l.startsWith("`")&&l.endsWith("`")){const d=document.createElement("code");d.textContent=l.slice(1,-1),a.append(d)}else a.append(document.createTextNode(l))};for(const a of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(a);if(c&&!i){i=c[1],r=void 0;const g=document.createElement("pre");o=document.createElement("code"),g.append(o),n.append(g);continue}if(c&&c[1][0]===i[0]&&c[1].length>=i.length&&!c[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",r=void 0;continue}if(i){o.append(document.createTextNode(a+`
`));continue}if(!a.trim()){r=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(a),d=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(a);if(d){r||(r=document.createElement(/^\s*\d/.test(a)?"ol":"ul"),n.append(r));const g=document.createElement("li");s(g,d[1]),r.append(g);continue}r=void 0;const f=document.createElement(l?"h"+l[1].length:"p");s(f,l?l[2]:a),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}function zo(e,t,n){if(t.performers===null)return"未決";const i=n===void 0?t.performers:n===null?t.performers.length===1?t.performers:[]:t.performers.filter(o=>n.includes(o.objectId));return i.length?i.map(o=>{const r=e.objects.find(a=>a.id===o.objectId).name,s=o.roleIds.map(a=>e.roles.find(c=>c.id===a).name);return s.length?`${r}（旧Role：${s.join("・")}）`:r}).join("、"):"未決"}function En(e,t){if("performers"in t)return"未決";if(typeof t.who=="string")return e.roles?.find(i=>"roleId"in t&&i.id===t.roleId)?.name??t.who;const n=t.who;return n?n.kind==="role"?e.roles?.find(i=>i.id===n.roleId)?.name??"未決":n.name:"未決"}function Jr(e,t){return t.dataId!==void 0?e.data?.find(n=>n.id===t.dataId)?.name??"未決":t.label??""}function od(e){const t=[];for(const n of e.activities){if(!("performers"in n))continue;const i=(l,d,f,g)=>t.push({id:`viewer:${l}:${n.id}`,displayId:"構造の要確認（表示のみ）",kind:d,status:"open",scope:"items",targets:[n.id],targetNames:[n.name],summary:f,content:g,unresolvedTargets:[]}),o=n.performers??[],r=new Set(o.flatMap(l=>l.roleIds)),s=[...o.length>1?["複数の担当Object"]:[],...r.size>1?["複数Role"]:[]];i("who",s.length?"correction":"question",s.length?`旧形式に${s.join("と")}があります。`:"Whoは未決です。",`旧形式の担当情報：${zo(e,n)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityの単一のWhoを、Role・システム・スケジューラーを含めて確認してください。入力や出力の相手からは決められません。`);const a=n.procedure.steps.filter(l=>l.performerObjectIds===null&&n.performers?.length!==1),c=n.procedure.steps.filter(l=>l.performerObjectIds!==null&&(l.performerObjectIds.length!==o.length||l.performerObjectIds.some(d=>!o.some(f=>f.objectId===d))));(a.length||c.length)&&i("steps",c.length?"correction":"question",c.length?"旧形式の手順の担当情報が異なります。":"旧形式の担当情報が未決の手順があります。",[a.length?`旧形式の担当情報が未決：${a.map(l=>l.text).join("、")}。`:"",c.length?`Activityと異なる旧形式の担当情報：${c.map(l=>l.text).join("、")}。責任境界が変わる場合はActivityの分割を検討してください。`:""].join(""))}return t}const ot=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n},nr=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]),ir=(e,t,n)=>e.slice(0,n+1).every((i,o)=>nr(i)===nr(t[o]));function _r(e,t){return e.kind!=="value"?e.kind==="else"?"それ以外":e.kind==="any"?"不問":"未決":typeof e.value=="boolean"?e.value?t.trueLabel??"true":t.falseLabel??"false":String(e.value)+(typeof e.value=="number"?t.unit??"":"")+{is:"",eq:"",gte:"以上",lte:"以下",gt:"超",lt:"未満"}[e.operator]}function sd(e){return e.rows.map((t,n)=>e.axes.map((i,o)=>{if(n>0&&ir(e.rows[n-1].conditions,t.conditions,o))return 0;let r=1;for(;n+r<e.rows.length&&ir(t.conditions,e.rows[n+r].conditions,o);)r++;return r}))}function hs(e,t){const n=ot("div");n.dataset.businessDecisionScroll="",n.tabIndex=0,n.setAttribute("role","region"),n.setAttribute("aria-label",e.title);const i=ot("table");i.dataset.businessDecisionTable="";const o=ot("thead"),r=ot("tr"),s=ot("th","条件");s.colSpan=e.axes.length,s.scope="colgroup",r.append(s);for(const f of["結果","Check"]){const g=ot("th",f);g.rowSpan=2,g.scope="col",f==="結果"&&(g.dataset.decisionResult=""),r.append(g)}o.append(r);const a=ot("tr");for(const f of e.axes){const g=ot("th",f.name);g.scope="col",a.append(g)}o.append(a),i.append(o);const c=ot("tbody"),l=sd(e);let d=!1;for(const[f,g]of e.rows.entries()){const u=ot("tr");u.dataset.decisionRow=g.id,g.conditions.forEach((p,h)=>{const x=l[f][h];if(!x)return;const v=ot("td",_r(p,e.axes[h]));x>1&&(v.rowSpan=x),u.append(v)});const b=ot("td",g.result.text??"未決");b.dataset.decisionResult="",b.dataset.resultKind=g.result.kind,u.append(b);const m=g.checkRefs.map(p=>{const h=t.flatMap(x=>x.items).find(x=>x.id===p.checkId);return p.coverage==="partial"&&(d=!0),(h?.checkId??p.checkId)+(p.coverage==="partial"?"*":"")});u.append(ot("td",m.join("、")||"—")),c.append(u)}if(i.append(c),n.append(i),d){const f=ot("p","*：この業務で扱う範囲のみ");f.className="decision-footnote",n.append(f)}return n}function bs(e,t,n){return[...new Set(e.rows.flatMap(o=>o.result.exceptionIds))].flatMap(o=>{const r=t.exceptions?.find(c=>c.id===o);if(!r)return[];const s=n.flatMap(c=>c.items).filter(c=>Object.values(c.fields).some(l=>l.some(d=>d.kind==="reference"&&d.targetId===o))).map(c=>c.checkId),a=ot("p",r.description+(s.length?" （"+[...new Set(s)].join("、")+"）":""));return a.className="decision-exception",[a]})}const xe={type:"string"},U={type:"string",minLength:1,pattern:"\\S"},T={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Ie=e=>({anyOf:[e,{type:"null"}]}),F=e=>({type:"array",items:e}),z=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),rd=e=>({$ref:"#/$defs/"+e}),Wn=F({anyOf:[z({kind:{enum:["text"]},value:xe}),z({kind:{enum:["reference"]},targetId:T,label:xe}),z({kind:{enum:["link"]},uri:U,label:xe})]}),Vi=z({id:T,name:U,scope:{type:"boolean"}}).properties,gs=z({id:T,kind:{enum:["input","output","business-exception","object-exception"]},fromId:T,toId:T,label:U}),ad=z({id:T,sourceId:T,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:F(T),unresolvedTargets:F(U),summary:U,content:U}),Uo=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:U,title:U,preface:xe,scope:xe,objects:F(z({...Vi,icon:U,information:F(U)})),activities:F(z({...Vi,why:U,when:U,who:U,where:U,procedure:U,exception:Ie(U),result:U,problem:Ie(U),painLevel:Ie({enum:["Low","Medium","High"]})})),relations:F(gs),findings:F(ad)}),cd=z({id:T,name:U,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Kr=z({...Uo.properties,schemaVersion:{enum:["0.2"]},roles:F(cd),activities:F(z({...Uo.properties.activities.items.properties,roleId:Ie(T)}))}),eo=z({...Kr.properties,schemaVersion:{enum:["0.3"]},exceptions:F(z({id:T,activityId:T,name:U,description:xe}))}),lt=e=>({...F(e),minItems:1}),Xr=z({id:T,name:U,description:xe}),ys={anyOf:[z({kind:{enum:["before"]},beforeId:T,afterId:T}),z({kind:{enum:["interchangeable"]},stepIds:{...F(T),minItems:2}})]},Zr=Object.fromEntries(Object.entries(eo.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),dd=z({objectId:T,roleIds:F(T)}),ld=z({id:T,text:U,obligation:{enum:["required","optional"]},appliesWhen:Ie(U),performerObjectIds:Ie(lt(T))}),Yr=z({id:T,name:U,items:lt(z({informationId:T,condition:Ie(U)}))}),ud=z({...eo.properties,schemaVersion:{enum:["0.4"]},objects:F(z({...Vi,icon:U,information:F(Xr)})),activities:lt(z({...Zr,performers:Ie(lt(dd)),procedure:z({steps:lt(ld),orderRules:F(ys)}),results:lt(z({id:T,text:U}))})),data:F(Yr),relations:F({anyOf:[z({id:T,kind:{enum:["input","output"]},fromId:T,toId:T,dataId:T}),z({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),pd={anyOf:[z({kind:{enum:["role"]},roleId:T}),z({kind:{enum:["system","scheduler"]},name:U}),{type:"null"}]},fd={anyOf:[z({kind:{enum:["interaction"]},phase:Ie({enum:["request","response","not-applicable"]}),direction:{enum:["input","output"]},objectId:T,dataIds:Ie(F(T)),relationId:Ie(T),pairedStepId:Ie(T)}),z({kind:{enum:["internal"]}}),z({kind:{enum:["unresolved"]}})]},or={anyOf:[z({kind:{enum:["who"]}}),z({kind:{enum:["object"]},objectId:T})]},md=z({from:Ie(or),to:Ie(or)}),Vo=z({id:T,action:U,method:Ie(U),whatDataIds:Ie(F(T)),legacyText:U,obligation:{enum:["required","optional"]},appliesWhen:Ie(U),effect:Ie({enum:["create","read","update","delete","not-applicable","undecided"]}),exchange:fd,parties:md},["id","action","method","whatDataIds","obligation","appliesWhen","effect","exchange"]),hd=z({trigger:Ie(U),onInterrupt:Ie(U),outcome:Ie({enum:["resume","continue","end"]}),resumeCondition:Ie(U),resumeAction:Ie(U),interruptedAtStepId:Ie(T),resumeAtStepId:Ie(T),retainedDataIds:Ie(F(T))}),bd=z({id:T,activityId:T,name:U,description:xe,continuity:hd},["id","activityId","name","description"]),sr={...Vi,scope:Ie({type:"boolean"})},Fo=z({...eo.properties,schemaVersion:{enum:["0.5"]},objects:F(z({...sr,icon:U,information:F(Xr)})),activities:lt(z({...Zr,...sr,who:pd,procedure:z({steps:lt(Vo),orderRules:F(ys)}),results:lt(z({id:T,text:U}))})),exceptions:F(bd),data:F(Yr),relations:F({anyOf:[z({id:T,kind:{enum:["input","output"]},fromId:T,toId:T}),z({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),gd={anyOf:[U,{type:"number"},{type:"boolean"}]},yd={anyOf:[z({axisId:T,kind:{enum:["value"]},operator:{enum:["is","eq","gte","lte","gt","lt"]},value:gd}),...["else","any","undecided"].map(e=>z({axisId:T,kind:{enum:[e]}}))]},vd=z({id:T,name:U,dataIds:F(T),unit:xe,trueLabel:U,falseLabel:U},["id","name","dataIds"]),wd=z({kind:{enum:["accepted","error","value","undecided"]},text:Ie(U),dataIds:F(T),exceptionIds:F(T)}),kd=z({id:T,conditions:lt(yd),result:wd,checkRefs:F(z({checkId:T,coverage:{enum:["full","partial"]}}))}),vs=z({decisionId:T,rowId:T}),Id=z({id:T,title:U,kind:{enum:["authorization","validation","algorithm"]},note:Ie(U),appliesWhen:Ie(vs),axes:lt(vd),rows:lt(kd)}),Sd=z({stepId:T,whenDecision:Ie(vs)}),xd=z({...Vo.properties,decisionIds:F(T),whenDecision:Ie(vs),dependsOn:Ie(F(Sd))},[...Vo.required,"decisionIds","whenDecision"]),Ad=z({...Fo.properties,schemaVersion:{enum:["0.6"]},activities:lt(z({...Fo.properties.activities.items.properties,procedure:z({steps:lt(xd),orderRules:F(ys)}),decisions:F(Id)}))}),Ed=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Wn])),Od=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:U,title:U,basedOn:z({documentId:T,revision:U,verification:{enum:["unverified"]}}),intro:Wn,index:F(z({activityId:T,purpose:xe,connections:xe,checkIds:F(T)})),sections:F(z({id:T,activityId:Ie(T),title:U,preamble:Wn})),guarantees:F(z({id:T,sectionId:T,title:U,blocks:F({anyOf:[z({kind:{enum:["prose"]},content:Wn}),z({kind:{enum:["example"]},exampleId:T})]})})),examples:F(z({id:T,guaranteeId:T,columns:F(U),rows:F(F(Wn))})),items:F(z({id:T,checkId:T,title:U,detailSummary:xe,sectionId:T,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:z(Ed,[])})),notes:F(z({id:T,title:U,content:Wn}))}),ws=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:U,title:U,basedOn:z({documentId:T,revision:U,verification:{enum:["unverified"]}}),objectId:T,states:F(z({id:T,name:U})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:U,transitions:F(z({id:T,sourceId:U,fromId:U,activityId:T,event:Ie(U),exception:Ie(U),condition:U,toId:U,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:U,note:U}))}),rr=Object.fromEntries(Object.entries({...ws.properties.transitions.items.properties,exceptionId:Ie(T)}).filter(([e])=>e!=="exception")),jd=z({...ws.properties,schemaVersion:{enum:["0.2"]},transitions:F(z({...rr,conditionLabel:U},Object.keys(rr)))}),ks=z({documentId:T,revision:U,targetType:U,targetId:T,section:U}),Dd=z({id:T,name:U,responsibilityStatus:U,responsibleSubsystemId:T},["id","name"]),Cd=z({id:T,name:U,subsystemId:T,information:F(Dd),reason:xe,description:xe,businessObjectIds:F(T),activityLinks:F(z({activityId:T,uses:F(U)})),sourceRefs:F(ks),reviewState:U}),Md=z({id:T,fromConceptId:T,toConceptId:T,fromPerTarget:U,toPerSource:U,condition:xe,reviewState:U,sourceRefs:F(ks),fromLabel:U,toLabel:U,kind:{enum:["down","reference"]}}),Rd=z({id:T,name:U,purpose:xe,information:F(U),reason:xe,activityIds:F(T),reviewState:U}),Ld=z({id:T,fromSubsystemId:T,toSubsystemId:T,information:U,description:xe,activityIds:F(T),flowDirection:{enum:["forward","return"]},reviewState:U}),Nd=z({columnId:T,value:{anyOf:[xe,{type:"number"}]},linkId:U},["columnId","value"]),Pd=z({card:T,columns:F(z({id:T,name:U,informationId:T})),rows:F(z({id:T,cells:F(Nd)})),empty:xe},["card","columns","rows"]),Bo=z({id:T,name:U,when:xe,meaning:xe,blocks:F(Pd),note:xe},["id","name","when","meaning","blocks"]),Go=z({id:T,title:U,description:xe,meta:{},samples:F(Bo)}),Td=z({...Bo.properties,checkIds:{...F(T),minItems:1,uniqueItems:!0}},[...Bo.required,"checkIds"]),qd=z({decisionExampleIds:F(T),decisionCheckIds:F(T),resultCheckIds:F(T),sampleIds:F(T)}),$d=z({...Go.properties,samples:F(Td),testSpecification:qd},[...Object.keys(Go.properties)]),Wd=z({id:T,title:U,description:xe,reason:xe,meta:{}}),zd=z({conceptId:T,name:U,fields:F(U),description:xe,sources:F(U),sourceActivityIds:F(T)}),Ud=z({id:T,fromConceptId:T,toConceptId:T,relationIds:F(T),scope:xe,fromLabel:U,toLabel:U,kind:{enum:["down","reference"]}}),Vd=z({id:T,conceptId:T,subsystemId:T,name:U,description:xe,sources:F(U),fields:F(z({name:U,informationId:T}))}),Fd=z({id:T,fromViewId:T,toViewId:T,relationIds:F(T),fromLabel:U,toLabel:U,kind:{enum:["down","reference"]}}),Qr=z({nodes:F(Vd),edges:F(Fd),handoffIds:F(T)}),ea=z({id:T,subsystemId:T,title:U,description:xe,reviewer:z({roleId:T}),relatedActivityIds:F(T),graph:z({conceptIds:F(T),nodes:F(zd),edges:F(Ud),subsystemViews:Qr},["conceptIds","nodes","edges"]),structureStatements:F(z({id:T,title:U,description:xe,sampleIds:F(T),sourceRefs:F(ks)})),capabilities:F(Go),limitations:F(Wd),meta:z({questions:F(U),hypotheses:{}},["questions"])}),Bd=z({...ea.properties,capabilities:F($d)}),ta=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:U,basedOn:z({documentId:T,revision:U,verification:{enum:["unverified"]}}),relatedStates:F(z({documentId:T,revision:U,verification:{enum:["unverified"]}})),subsystems:F(Rd),concepts:F(Cd),relations:F(Md),handoffs:F(Ld),reviewGroups:F(ea),benefits:F(U),considerations:F(U),reviewPoints:F(U),meta:{},presentation:z({activityViews:{},creatorActivityIds:{},sampleCaption:xe,subsystemViews:Qr,landscapeRelationships:F(z({from:T,to:T})),reviewBoundaries:F(z({from:T,to:T,label:xe,promise:xe}))},["landscapeRelationships","reviewBoundaries"])}),Gd=z({...ta.properties,schemaVersion:{enum:["0.2"]},reviewGroups:F(Bd)}),An=(e,t)=>z({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:U,documents:F({anyOf:t.map(rd)}),sources:F(z({documentId:T,revision:U,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:xe})),externalDocuments:F(z({id:T,kind:{enum:["businessDesign"]},revision:U,activities:F(z({id:T,name:U}))})),diagnostics:F(U)}),di={anyOf:[An("0.1",["businessDesign","checkItems"]),An("0.2",["businessDesign","checkItems","stateTransition"]),An("0.3",["businessDesignRoles","checkItems","stateTransition"]),An("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.5",["oldStructuredBusinessDesign","checkItems","stateTransitionStructured"]),An("0.6",["procedureBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.7",["decisionBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Uo,businessDesignRoles:Kr,businessDesignStructured:eo,oldStructuredBusinessDesign:ud,procedureBusinessDesign:Fo,decisionBusinessDesign:Ad,checkItems:Od,stateTransition:ws,stateTransitionStructured:jd,conceptModel:ta,checkedConceptModel:Gd}},nt=(e,t)=>P(new Set(e).size===e.length,t),Dn=(e,t)=>P(e.length>0,t),ar=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]);function na(e,t){if(!t.whenDecision||t.dependsOn!=null)return null;const n=e.procedure.steps.filter(i=>i.decisionIds?.includes(t.whenDecision.decisionId));return n.length===1&&e.procedure.steps.indexOf(n[0])>e.procedure.steps.indexOf(t)?n[0]:null}function Hd(e,t){const n=e.procedure.steps,i=n.map(l=>l.id),o=new Map(i.map(l=>[l,[]])),r=new Set,s=new Set,a=[];Dn(n,"Procedure requires a Step: "+e.id);for(const l of e.procedure.orderRules)if(l.kind==="before"){t(l.beforeId,"step",e.id),t(l.afterId,"step",e.id),P(l.beforeId!==l.afterId,"Self Step order");const d=JSON.stringify([l.beforeId,l.afterId]);P(!r.has(d),"Duplicate Step order"),r.add(d),P(i.indexOf(l.beforeId)<i.indexOf(l.afterId),"Standard Step order contradicts before constraint"),o.get(l.beforeId).push(l.afterId)}else{P(l.stepIds.length>=2,"Interchangeable group requires two Steps"),nt(l.stepIds,"Duplicate interchangeable Step");for(const f of l.stepIds)t(f,"step",e.id);const d=JSON.stringify([...l.stepIds].sort());P(!s.has(d),"Duplicate interchangeable group"),s.add(d),a.push(l.stepIds)}for(const l of n)if(Array.isArray(l.dependsOn)){nt(l.dependsOn.map(d=>JSON.stringify([d.stepId,d.whenDecision?.decisionId??null,d.whenDecision?.rowId??null])),"Duplicate Step prerequisite: "+l.id);for(const d of l.dependsOn){const f=d.stepId;t(f,"step",e.id),P(f!==l.id,"Self Step prerequisite: "+l.id),P(i.indexOf(f)<i.indexOf(l.id),"Standard Step order contradicts prerequisite: "+f+" -> "+l.id),o.get(f).push(l.id)}}const c=(l,d)=>{const f=[l],g=new Set;for(;f.length;){const u=f.pop();if(!g.has(u)){g.add(u);for(const b of o.get(u)){if(b===d)return!0;f.push(b)}}}return!1};for(const l of i)P(!c(l,l),"Step order cycle");for(const l of a)for(const d of l)for(const f of l)d!==f&&P(!c(d,f),"Interchangeable Steps conflict with before constraint")}function ia(e,t,n){const i=(o,r,s)=>{const a=n(o,r,e.id);return s&&P(t.parent.get(o)===s,"Structure owner mismatch: "+o),a};nt(e.roles.map(o=>o.name),"Duplicate Role name"),P(e.roles.every(o=>o.name===o.name.trim()&&!/[\r\n]/.test(o.name)),"Invalid Role name"),nt(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){P(o.name===o.name.trim(),"Data name whitespace"),Dn(o.items,"Data requires Information: "+o.id),nt(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities)Dn(o.results,"Activity requires Result: "+o.id),Hd(o,i);return i}function Jd(e,t,n,i,o){for(const r of e.activities){const s=a=>{const c=i(a.decisionId,"decision",r.id);return i(a.rowId,"decision-row",c.id),c};for(const a of r.procedure.steps){nt(a.decisionIds,"Duplicate Step decision");for(const l of a.decisionIds)i(l,"decision",r.id);a.whenDecision&&s(a.whenDecision);const c=na(r,a);c&&o.push("判定表を参照する手順が後方: "+a.id+" / "+c.id+"（前提を確認）");for(const l of a.dependsOn??[]){const d=l.stepId,f=r.procedure.steps.find(b=>b.id===d);l.whenDecision&&s(l.whenDecision);const g=b=>b&&f.whenDecision&&b.decisionId===f.whenDecision.decisionId&&b.rowId===f.whenDecision.rowId,u=f.whenDecision&&!g(a.whenDecision)&&!g(l.whenDecision);(f.obligation==="optional"||f.appliesWhen||u)&&o.push("前提手順の実施条件を確認: "+a.id+" <- "+d)}}for(const a of r.decisions){Dn(a.axes,"Decision requires a condition axis: "+a.id),Dn(a.rows,"Decision requires a row: "+a.id),a.appliesWhen&&(s(a.appliesWhen),P(a.appliesWhen.decisionId!==a.id,"Decision cannot depend on itself: "+a.id));for(const c of a.axes){nt(c.dataIds,"Duplicate decision axis Data");for(const l of c.dataIds)i(l,"data");P(c.trueLabel===void 0==(c.falseLabel===void 0),"Boolean labels must be paired: "+c.id)}for(const[c,l]of a.rows.entries()){P(l.conditions.length===a.axes.length,"Decision row must cover every axis: "+l.id);for(const[d,f]of l.conditions.entries())if(P(f.axisId===a.axes[d].id,"Decision condition axis/order mismatch: "+l.id),f.kind==="value"&&["gte","lte","gt","lt"].includes(f.operator)&&P(typeof f.value=="number","Ordered comparison requires a number: "+l.id),f.kind==="undecided"&&P(l.result.kind==="undecided","Undecided condition cannot assert an outcome: "+l.id),f.kind==="else"){const g=JSON.stringify(l.conditions.slice(0,d).map(ar));P(a.rows.slice(0,c).some(u=>JSON.stringify(u.conditions.slice(0,d).map(ar))===g&&u.conditions[d]?.kind==="value"),"Else needs an earlier branch in the same context: "+l.id)}P(l.result.kind==="undecided"||l.result.text!==null,"Known decision result needs a description: "+l.id),l.result.kind==="undecided"&&o.push("業務判断未決: "+l.id),nt(l.result.dataIds,"Duplicate decision result Data");for(const d of l.result.dataIds)i(d,"data");nt(l.result.exceptionIds,"Duplicate decision exception");for(const d of l.result.exceptionIds){const f=i(d,"exception");P(f.activityId===r.id,"Decision exception Activity mismatch: "+d)}nt(l.checkRefs.map(d=>d.checkId),"Duplicate decision Check");for(const d of l.checkRefs){n(d.checkId,"check");const f=t.map.get(t.owner.get(d.checkId));P(f?.kind==="checkItems"&&f.basedOn.documentId===e.id&&f.basedOn.revision===e.revision,"Decision Check source mismatch: "+d.checkId),P(f.index.some(g=>g.activityId===r.id&&g.checkIds.includes(d.checkId)),"Decision Check Activity mismatch: "+d.checkId)}}}for(const a of r.decisions){const c=new Set;let l=a;for(;l.appliesWhen;)P(!c.has(l.id),"Decision dependency cycle: "+a.id),c.add(l.id),l=s(l.appliesWhen)}}}function _d(e,t,n){const i=ia(e,t,n);for(const o of e.activities){if(o.performers!==null){Dn(o.performers,"Empty performers"),nt(o.performers.map(s=>s.objectId),"Duplicate performer");for(const s of o.performers){i(s.objectId,"object"),nt(s.roleIds,"Duplicate performer Role");for(const a of s.roleIds)i(a,"role")}}let r=o.performers===null;for(const s of o.procedure.steps)if(s.performerObjectIds!==null){Dn(s.performerObjectIds,"Empty Step performers"),nt(s.performerObjectIds,"Duplicate Step performer");for(const a of s.performerObjectIds)P(o.performers?.some(c=>c.objectId===a),"Step performer outside Activity assignment: "+a)}else o.performers?.length!==1&&(r=!0);r&&P(e.findings.some(s=>s.status==="open"&&s.scope==="items"&&s.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id)}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const a of r.items)i(a.informationId,"information",s)}}function Kd(e,t,n,i){const o=ia(e,t,n),r=new Map(e.activities.flatMap(s=>s.procedure.steps.map(a=>[a.id,{activity:s,step:a}])));e.schemaVersion==="0.6"&&Jd(e,t,n,o,i);for(const s of e.exceptions){const a=s.continuity;if(a){for(const c of[a.interruptedAtStepId,a.resumeAtStepId])c!==null&&o(c,"step",s.activityId);if(a.retainedDataIds!==null){nt(a.retainedDataIds,"Duplicate retained Data");for(const c of a.retainedDataIds)o(c,"data")}}}for(const s of e.objects)s.scope===null&&i.push("Scope未確定: "+s.id);for(const s of e.activities){s.scope===null&&i.push("Scope未確定: "+s.id),s.who===null?i.push("Who未確定: "+s.id):s.who.kind==="role"&&o(s.who.roleId,"role");for(const a of s.procedure.steps){if(a.parties)for(const l of[a.parties.from,a.parties.to])l?.kind==="object"&&o(l.objectId,"object");if(a.whatDataIds===null)i.push("対象Data未確定: "+a.id);else{nt(a.whatDataIds,"Duplicate Step target Data");for(const l of a.whatDataIds)o(l,"data")}const c=a.exchange;if(c.kind==="unresolved"){i.push("やり取り未確定: "+a.id);continue}if(c.kind!=="internal"){if(o(c.objectId,"object"),c.phase===null&&i.push("Request/Response未確定: "+a.id),c.dataIds===null)i.push("Data未確定: "+a.id);else{nt(c.dataIds,"Duplicate Step Data");for(const l of c.dataIds)o(l,"data")}if(c.relationId!==null){const l=o(c.relationId,"relation"),d=c.direction==="input";P(l.kind===c.direction&&l.fromId===(d?c.objectId:s.id)&&l.toId===(d?s.id:c.objectId),"Step relation direction/endpoint mismatch: "+a.id)}if(c.pairedStepId!==null){const l=r.get(c.pairedStepId);P(l&&l.activity.id===s.id&&l.step.id!==a.id,"Invalid paired Step: "+a.id);const d=l.step.exchange;P(d.kind==="interaction"&&["request","response"].includes(c.phase)&&["request","response"].includes(d.phase)&&d.phase!==c.phase&&d.direction!==c.direction&&d.objectId===c.objectId,"Request/Response mismatch: "+a.id)}}}}}function Xd(e){const t=new Map(e.data.map(o=>[o.id,o])),n=new Map,i=[];for(const o of e.activities)for(const r of o.procedure.steps){const s=r.exchange,a=new Map,c=(b,m)=>{let p=a.get(b);if(!p){const h=t.get(b);P(h,"Unknown Data during projection: "+b),p={id:h.id,name:h.name,uses:[]},a.set(b,p)}p.uses.includes(m)||p.uses.push(m)};for(const b of r.whatDataIds??[])c(b,"target");if(s.kind==="interaction")for(const b of s.dataIds??[])c(b,"transferred");const l={activityId:o.id,stepId:r.id,action:r.action,method:r.method,data:[...a.values()],targetDataUndecided:r.whatDataIds===null,obligation:r.obligation,appliesWhen:r.appliesWhen,effect:r.effect,...r.parties?{parties:r.parties}:{}};if(s.kind!=="interaction"){i.push({...l,kind:s.kind,from:s.kind==="internal"?{kind:"who",activityId:o.id}:null,to:null});continue}const d={kind:"who",activityId:o.id},f={kind:"object",objectId:s.objectId};i.push({...l,kind:s.kind,from:s.direction==="output"?d:f,to:s.direction==="output"?f:d,objectId:s.objectId,direction:s.direction,phase:s.phase,dataIds:s.dataIds,relationId:s.relationId,pairedStepId:s.pairedStepId});const g=JSON.stringify([o.id,s.objectId,s.direction]);n.has(g)||n.set(g,{activityId:o.id,objectId:s.objectId,direction:s.direction,stepIds:[],relationIds:[],data:[]});const u=n.get(g);u.stepIds.push(r.id),s.relationId!==null&&!u.relationIds.includes(s.relationId)&&u.relationIds.push(s.relationId),s.dataIds===null&&(u.transferUndecided=!0);for(const b of s.dataIds??[])if(!u.data.some(m=>m.id===b)){const m=t.get(b);P(m,"Unknown Data during projection: "+b),u.data.push({id:m.id,name:m.name})}}return{rows:i,edges:[...n.values()].map(o=>({...o,label:o.data.map(r=>r.name).join(" / ")}))}}const P=(e,t)=>{if(!e)throw Error(t)};function oa(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const r=t++;for(;t<e.length;){const s=e[t++];if(s==='"')return JSON.parse(e.slice(r,t));s==="\\"&&t++}throw Error("Unclosed JSON string")},o=(r=0)=>{P(r<=64,"JSON depth limit"),n();const s=e[t];if(s==='"'){i();return}if(s==="{"){t++,n();const c=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),P(e[t]==='"',"JSON object key required");const l=i();P(!c.has(l),"Duplicate JSON key: "+l),c.add(l),n(),P(e[t++]===":","JSON colon required"),o(r+1),n();const d=e[t++];if(d==="}")return;P(d===",","JSON comma required")}throw Error("Truncated object")}if(s==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(r+1),n();const c=e[t++];if(c==="]")return;P(c===",","JSON array comma required")}throw Error("Truncated array")}const a=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;P(t>a,"JSON value required"),JSON.parse(e.slice(a,t))};return o(),n(),P(t===e.length,"Trailing JSON content"),JSON.parse(e)}function mn(e,t=di,n="$"){if(t.$ref)return mn(e,di.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{mn(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&P(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;P(i===t.type,"Invalid type at "+n)}if(t.minLength&&P(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&P(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])P(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))P(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),mn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>mn(i,t.items,n+"["+o+"]"))}function Zd(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,a,c,l=a.id)=>{P(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,a.id),i.set(s.id,c),o.set(s.id,l)};for(const s of e.documents){r(s,s,"document",null);for(const[a,c]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of s[a]??[])r(l,s,c);if(s.kind==="businessDesign"&&["0.4","0.5","0.6"].includes(s.schemaVersion)){for(const a of s.objects)for(const c of a.information)r(c,s,"information",a.id);for(const a of s.activities){for(const c of a.procedure.steps)r(c,s,"step",a.id);for(const c of a.results)r(c,s,"result",a.id);for(const c of a.decisions??[]){r(c,s,"decision",a.id);for(const l of c.axes)r(l,s,"decision-axis",c.id);for(const l of c.rows)r(l,s,"decision-row",c.id)}}for(const a of s.data)r(a,s,"data")}}for(const s of e.externalDocuments){r(s,s,"document");for(const a of s.activities)r(a,s,"activity")}return{map:t,owner:n,types:i,parent:o}}function Fi(e){return mn(e),sa(e)}function Gn(e,t){const n=new Set(e.items.map(s=>s.id)),i=new Set,o=e.guarantees.find(s=>s.id===t.guaranteeId),r=s=>{if(Array.isArray(s)){for(const a of s)r(a);return}if(s&&typeof s=="object"){s.kind==="reference"&&n.has(s.targetId)&&i.add(s.targetId);for(const a of Object.values(s))a&&typeof a=="object"&&r(a)}};r(t.rows);for(const s of o?.blocks??[])s.kind==="prose"&&r(s.content);for(const s of e.items)(s.fields.guarantee??[]).some(c=>c.kind==="reference"&&(c.targetId===t.id||c.targetId===t.guaranteeId))&&i.add(s.id);return[...i]}function sa(e,{allowUnresolvedFindings:t=!1}={}){P(e.documents.length>0,"Document required");const n=Zd(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],a=new Set;for(const u of e.sources)if(u.uri){const b=new URL(u.uri);P(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const c=(u,b,m)=>(P(i.has(u),"Dangling reference: "+u),b&&P(r.get(u)===b,"Reference type mismatch: "+u),m&&P(o.get(u)===m,"Cross-document mismatch: "+u),i.get(u)),l=u=>u?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),d=(u,b)=>{for(const m of u){if(m.kind==="reference"){const p=r.get(m.targetId);if(p==="decision-row"||p==="exception"){P(e.formatVersion==="0.7","Business rich references require formatVersion 0.7");const h=i.get(b),x=c(m.targetId,p),v=p==="exception"?x.activityId:n.parent.get(n.parent.get(m.targetId));P(h?.kind==="checkItems"&&h.basedOn.documentId===o.get(m.targetId),"Business reference must use the Check source Business Design"),P(h.index.some(k=>k.activityId===v),"Business reference Activity is absent from Check index")}else c(m.targetId,null,b),P(["document","section","guarantee","example","check","note"].includes(p),"Invalid rich reference target")}if(m.kind==="link"){const p=new URL(m.uri);P(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}}};for(const u of e.documents)if(P(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){P(u.activities.length>0,"Activity required");const b=[...u.objects,...u.activities].map(h=>h.name);P(new Set(b).size===b.length,"Duplicate visible name"),P(b.every(h=>h===h.trim()&&!(["0.4","0.5","0.6","0.7"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>h.includes(x))),"Invalid Graph-visible name");for(const h of u.objects)P(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){P(new Set(u.roles.map(h=>h.name)).size===u.roles.length,"Duplicate Role name"),P(u.roles.every(h=>h.name===h.name.trim()&&!/[\r\n]/.test(h.name)),"Invalid Role name");for(const h of u.activities)h.roleId!==null?c(h.roleId,"role",u.id):a.add("Role未確定: "+h.id+" — "+h.who)}for(const h of u.activities)P(h.problem===null==(h.painLevel===null),"Problem/Pain pair mismatch");for(const h of u.exceptions??[])c(h.activityId,"activity",u.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const h of u.relations){c(h.fromId,m[h.kind][0],u.id),c(h.toId,m[h.kind][1],u.id);const x=JSON.stringify([h.kind,h.fromId,h.toId,["0.5","0.6"].includes(u.schemaVersion)?h.id:h.dataId??h.label]);P(!p.has(x),"Duplicate relation"),p.add(x)}u.schemaVersion==="0.4"&&_d(u,n,c),["0.5","0.6"].includes(u.schemaVersion)&&Kd(u,n,c,s),P(new Set(u.findings.map(h=>h.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const h of u.findings){P(h.scope==="items"?h.targetIds.length+h.unresolvedTargets.length>0:!h.targetIds.length&&!h.unresolvedTargets.length,"Finding scope mismatch"),P(new Set(h.targetIds).size===h.targetIds.length,"Duplicate Finding target");for(const x of h.targetIds)c(x,null,u.id),P(["object","activity"].includes(r.get(x)),"Invalid Finding target");h.unresolvedTargets.length&&(P(t,"Unresolved Finding target: "+h.sourceId),s.push("Finding参照未決: "+h.sourceId))}}else if(u.kind==="stateTransition"){const b=c(u.basedOn.documentId,"document");P(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),P(b.revision===u.basedOn.revision,"Stale State source revision"),c(u.objectId,"object",b.id),P(!e.documents.some(p=>p!==u&&p.kind==="stateTransition"&&p.objectId===u.objectId),"Duplicate Object state declaration"),P(u.states.length>0&&new Set(u.states.map(p=>p.name)).size===u.states.length,"Duplicate/empty state names"),P(u.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),P(u.transitions.length<=1e3,"State transition row budget"),P(new Set(u.transitions.map(p=>p.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const m=new Map;for(const p of u.transitions){p.fromId!=="@new"&&c(p.fromId,"state",u.id),["@unknown","@none"].includes(p.toId)||c(p.toId,"state",u.id);const h=c(p.activityId,"activity",b.id),x=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(P(!m.has(x),"Duplicate state transition condition: "+m.get(x)+" / "+p.sourceId),m.set(x,p.sourceId),["0.4","0.5","0.6","0.7"].includes(e.formatVersion))if(P(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const v=c(p.exceptionId,"exception",b.id);P(v.activityId===h.id,"Exception Activity mismatch")}else p.path==="exception"&&P(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else P(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);P(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),P(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),P(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),P(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const b=c(u.basedOn.documentId,"document");P(b.kind==="businessDesign"&&b.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),P(!e.documents.some(D=>D!==u&&D.kind==="conceptModel"&&D.basedOn.documentId===b.id),"Duplicate Concept model for Business Design");const m=(D,L)=>{const N=new Map;for(const Y of D)P(!N.has(Y.id),"Duplicate "+L+" ID: "+Y.id),N.set(Y.id,Y);return N},p=m(u.subsystems,"subsystem"),h=m(u.concepts,"concept"),x=m(u.relations,"concept relation"),v=m(u.reviewGroups,"review group"),k=m(u.handoffs,"handoff"),w=m(u.concepts.flatMap(D=>D.information),"concept information"),A=(D,L,N)=>(P(D.has(L),"Unknown "+N+": "+L),D.get(L)),E=D=>c(D,"activity",b.id),O=D=>{const L=c(D.documentId,"document");P(L.revision===D.revision,"Stale Concept source revision");const N=L.id===b.id,Y=L.kind==="stateTransition"&&L.basedOn.documentId===b.id&&u.relatedStates.some(W=>W.documentId===L.id&&W.revision===L.revision);P(N||Y,"Concept source must refer to its Business Design or a declared State"),c(D.targetId,D.targetType,L.id)};for(const D of u.relatedStates){const L=c(D.documentId,"document");P(L.kind==="stateTransition"&&L.revision===D.revision&&L.basedOn.documentId===b.id,"Invalid Concept state reference")}for(const D of u.subsystems)for(const L of D.activityIds)E(L);for(const D of u.concepts){A(p,D.subsystemId,"subsystem");for(const L of D.information)L.responsibleSubsystemId&&A(p,L.responsibleSubsystemId,"responsible subsystem");for(const L of D.businessObjectIds)c(L,"object",b.id);for(const L of D.activityLinks)E(L.activityId);for(const L of D.sourceRefs)O(L)}for(const D of u.relations){A(h,D.fromConceptId,"concept"),A(h,D.toConceptId,"concept");for(const L of D.sourceRefs)O(L)}for(const D of u.handoffs){A(p,D.fromSubsystemId,"subsystem"),A(p,D.toSubsystemId,"subsystem"),P(D.fromSubsystemId!==D.toSubsystemId,"Handoff must cross subsystem boundary");for(const L of D.activityIds)E(L)}const $=(D,L)=>{const N=m(D.nodes,"subsystem view"),Y=m(D.edges,"subsystem view edge");for(const Z of N.values()){A(L,Z.conceptId,"view concept"),A(p,Z.subsystemId,"subsystem");const Q=A(h,Z.conceptId,"concept");for(const H of Z.fields)P(Q.information.some(oe=>oe.id===H.informationId),"Unknown information for subsystem view: "+H.informationId)}for(const Z of Y.values()){const Q=A(N,Z.fromViewId,"subsystem view"),H=A(N,Z.toViewId,"subsystem view");P(Q.subsystemId===H.subsystemId,"View relationship crosses subsystem boundary"),P(Z.relationIds.length>0,"Subsystem view relationship needs a concept relation");let oe=Q.conceptId;for(const ue of Z.relationIds){const be=A(x,ue,"concept relation");P(be.fromConceptId===oe,"Subsystem view relation path is disconnected: "+ue),oe=be.toConceptId}P(oe===H.conceptId,"Subsystem view relation target differs")}P(new Set(D.handoffIds).size===D.handoffIds.length,"Duplicate subsystem view handoff");const W=new Set([...N.values()].map(Z=>Z.subsystemId));for(const Z of D.handoffIds){const Q=A(k,Z,"handoff");P(W.has(Q.fromSubsystemId)&&W.has(Q.toSubsystemId),"Missing subsystem view handoff region: "+Z)}};u.presentation.subsystemViews&&$(u.presentation.subsystemViews,h);for(const D of u.reviewGroups){A(p,D.subsystemId,"subsystem"),c(D.reviewer.roleId,"role",b.id);for(const W of D.relatedActivityIds)E(W);const L=m(D.graph.nodes.map(W=>({...W,id:W.conceptId})),"view concept");P(new Set(D.graph.conceptIds).size===D.graph.conceptIds.length&&D.graph.conceptIds.length===L.size&&D.graph.conceptIds.every(W=>L.has(W)),"View concepts and nodes differ");for(const W of D.graph.nodes){A(h,W.conceptId,"concept");for(const Z of W.sourceActivityIds)E(Z)}m(D.graph.edges,"view edge");for(const W of D.graph.edges){A(L,W.fromConceptId,"view concept"),A(L,W.toConceptId,"view concept");for(const Z of W.relationIds)A(x,Z,"concept relation")}D.graph.subsystemViews&&$(D.graph.subsystemViews,L);const N=m(D.capabilities,"capability"),Y=m(D.capabilities.flatMap(W=>W.samples),"sample");m(D.limitations,"limitation"),m(D.structureStatements,"structure statement");for(const W of D.structureStatements){for(const Z of W.sampleIds)A(Y,Z,"sample");for(const Z of W.sourceRefs)O(Z)}for(const W of N.values())if(W.testSpecification){const Z=W.testSpecification;for(const[H,oe]of Object.entries(Z))P(new Set(oe).size===oe.length,"Duplicate function specification reference: "+H);const Q=(H,oe)=>{const ue=c(H,oe),be=c(o.get(H),"document");return P(be.kind==="checkItems"&&be.basedOn.documentId===b.id&&be.basedOn.revision===b.revision,"Function Check source mismatch: "+H),{value:ue,doc:be}};for(const H of[...Z.decisionCheckIds,...Z.resultCheckIds])Q(H,"check");for(const H of Z.decisionExampleIds){const{value:oe,doc:ue}=Q(H,"example"),be=Gn(ue,oe);P(be.length>0,"Function decision table needs a Check: "+H),P(be.every(pe=>Z.decisionCheckIds.includes(pe)),"Function decision table Check is not assigned: "+H)}for(const H of Z.sampleIds){const oe=W.samples.find(ue=>ue.id===H);P(oe,"Function result sample belongs to another capability: "+H),P(oe.checkIds.some(ue=>Z.resultCheckIds.includes(ue)),"Function result sample needs a result Check: "+H),P(oe.checkIds.every(ue=>Z.resultCheckIds.includes(ue)||Z.decisionCheckIds.includes(ue)),"Function result sample Check is not assigned: "+H)}}for(const W of N.values())for(const Z of W.samples){if(u.schemaVersion==="0.2"){P(Z.checkIds.length>0,"Sample needs a Check: "+Z.id),P(new Set(Z.checkIds).size===Z.checkIds.length,"Duplicate sample Check: "+Z.id);for(const Q of Z.checkIds){c(Q,"check");const H=c(o.get(Q),"document");P(H.kind==="checkItems"&&H.basedOn.documentId===b.id&&H.basedOn.revision===b.revision,"Sample Check source mismatch: "+Q)}}for(const Q of Z.blocks){A(L,Q.card,"view concept");const H=m(Q.columns,"sample column");for(const oe of Q.columns)A(w,oe.informationId,"concept information");m(Q.rows,"sample row");for(const oe of Q.rows){const ue=new Set;for(const be of oe.cells)A(H,be.columnId,"sample column"),P(!ue.has(be.columnId),"Duplicate sample cell: "+be.columnId),ue.add(be.columnId);P(ue.size===H.size,"Sample row does not match columns")}}}}for(const D of u.presentation.landscapeRelationships){const L=A(v,D.from,"review group"),N=A(v,D.to,"review group");P(L.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const D of u.presentation.reviewBoundaries)A(v,D.from,"review group"),A(v,D.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const b=c(u.basedOn.documentId,"document");P(b.kind==="businessDesign","Check source is not BD"),P(b.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),P(new Set(u.items.map(h=>h.checkId)).size===u.items.length,"Duplicate Check ID");const m=new Set;for(const h of u.index){c(h.activityId,"activity",b.id),P(!m.has(h.activityId),"Duplicate Activity index"),m.add(h.activityId),P(new Set(h.checkIds).size===h.checkIds.length,"Duplicate Check binding");for(const x of h.checkIds)c(x,"check",u.id)}P(new Set(u.sections.map(h=>h.activityId??h.title)).size===u.sections.length,"Duplicate Activity section");for(const h of u.sections)h.activityId!==null&&(c(h.activityId,"activity",b.id),P(m.has(h.activityId),"Section missing from index")),d(h.preamble,u.id);const p=new Set(e.documents.filter(h=>h.kind==="conceptModel"&&h.basedOn.documentId===b.id&&h.basedOn.revision===b.revision).flatMap(h=>h.reviewGroups.flatMap(x=>x.capabilities.flatMap(v=>v.testSpecification?.decisionExampleIds??[]))));for(const h of u.guarantees){const x=h.blocks.length>0&&h.blocks.every(v=>v.kind==="example"&&p.has(v.exampleId)&&u.examples.some(k=>k.id===v.exampleId&&k.guaranteeId===h.id&&Gn(u,k).length>0));P(h.blocks.some(v=>v.kind==="prose"&&l(v.content))||x,"General guarantee prose required"),c(h.sectionId,"section",u.id);for(const v of h.blocks)if(v.kind==="prose")d(v.content,u.id);else{const k=c(v.exampleId,"example",u.id);P(k.guaranteeId===h.id,"Example owner mismatch")}}for(const h of u.examples){c(h.guaranteeId,"guarantee",u.id),P(h.columns.length>0,"Example columns required");for(const x of h.rows){P(x.length===h.columns.length,"Example column mismatch");for(const v of x)d(v,u.id)}}for(const h of u.items){const x=c(h.sectionId,"section",u.id);P(x.activityId===null?!u.index.some(v=>v.checkIds.includes(h.id)):u.index.some(v=>v.activityId===x.activityId&&v.checkIds.includes(h.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),P(l(h.fields.guarantee)||l(h.fields.condition)&&l(h.fields.expectedResult),"Check guarantee required");for(const v of Object.values(h.fields)){d(v,u.id);for(const k of v)k.kind==="reference"&&(r.get(k.targetId)==="decision-row"&&P(i.get(k.targetId).checkRefs.some(w=>w.checkId===h.id),"Check and decision row must explicitly correspond: "+h.id),r.get(k.targetId)==="exception"&&P(u.index.some(w=>w.activityId===i.get(k.targetId).activityId&&w.checkIds.includes(h.id)),"Check and exception Activity mismatch: "+h.id))}P(x.activityId===null||u.index.some(v=>v.checkIds.includes(h.id)),"Unbound Check")}for(const h of u.notes)d(h.content,u.id);d(u.intro,u.id)}const f=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));P(new Set(f).size===f.length,"Duplicate unresolved Role diagnostic");for(const u of f)P(a.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");P(a.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const u of e.sources){c(u.documentId,"document");const b=u.documentId+"@"+u.revision;P(!g.has(b),"Duplicate source descriptor"),g.add(b)}for(const u of e.externalDocuments)P(e.sources.some(b=>b.documentId===u.id&&b.revision===u.revision),"External source revision missing"),P(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:i.size}}const M=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Qe(e,t,n){if(n==null)return;const i=et(n);return e.append(M("h3",t),i),i}function ra(e,t){const n=M("ul");for(const i of[...new Set(t)]){const o=e.data?.find(r=>r.id===i);if(o)for(const r of o.items){const s=e.objects.flatMap(d=>d.information).find(d=>typeof d!="string"&&d.id===r.informationId);if(!s||typeof s=="string")continue;const a=s.name===o.name?"":s.name,c=r.condition?`条件：${r.condition}`:"";if(!a&&!c&&!s.description)continue;const l=M("li",[a,c].filter(Boolean).join(" — "));s.description&&l.append(et(s.description)),n.append(l)}}return n}function qi(e,t){if(t===null)return M("span","未決");if(!t.length)return M("span","なし");const n=M("ul");n.className="procedure-data-list";for(const i of t){const o=e.data?.find(a=>a.id===i),r=M("li",o?.name??"未決"),s=ra(e,[i]);if(s.children.length){const a=M("details"),c=M("summary","詳細");a.className="procedure-data-details",a.append(c,s),r.append(a)}n.append(r)}return n}function Yd(e,t){if(e===null)return;const n=et(e),i=r=>String(r??"").replace(/\s+/g,""),o=new Set(t.map(r=>i(et(`**${r.name}** — ${r.description}`).textContent)));for(const r of Array.from(n.querySelectorAll("li")))o.has(i(r.textContent))&&r.remove();for(const r of Array.from(n.querySelectorAll("ul,ol")))r.children.length||r.remove();return n.textContent?.trim()?n:void 0}const Qd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function el(e,t,n){const i=new Map,o=new Set,r=new Set(n.map(a=>a.id)),s=e.model.business;for(const a of e.model.concepts??[]){if(a.basedOn.documentId!==s.id||a.basedOn.revision!==s.revision)continue;const c=a.presentation.activityViews;if(Array.isArray(c)){for(const l of c)if(!(!l||typeof l!="object"||Array.isArray(l)||l.activityId!==t||!Array.isArray(l.businessVariations)))for(const d of l.businessVariations){if(!d||typeof d!="object"||Array.isArray(d)||typeof d.exceptionId!="string"||!r.has(d.exceptionId)||d.kind!=="alternative"&&d.kind!=="exception"||o.has(d.exceptionId))continue;const f=i.get(d.exceptionId);f&&f!==d.kind?(i.delete(d.exceptionId),o.add(d.exceptionId)):i.set(d.exceptionId,d.kind)}}}return i}function tl(e,t,n){const i=t.model.business,o=t.model.checks,r=n.decisions??[],s=new Map,a=k=>r.findIndex(w=>w.id===k)+1,c=(k,w)=>{const A=M("button",`（※${a(k)}）`);return A.type="button",A.className="business-decision-link",A.onclick=()=>{const E=s.get(k),O=w?Array.from(E?.querySelectorAll("tr")??[]).find($=>$.dataset.decisionRow===w):void 0;(O??E)?.scrollIntoView({behavior:"smooth",block:O?"center":"start"})},A},l=(k,w,A)=>{if(!k||!w)return"未決";const E=w.result.text??"未決";if(!A)return E;const O=w.conditions.map(($,D)=>`${k.axes[D].name}：${_r($,k.axes[D])}`).join("、");return`${E}（${k.rows.indexOf(w)+1}行目：${O}）`},d=k=>k?k.kind==="who"?En(i,n):i.objects.find(w=>w.id===k.objectId)?.name??"未決":"未決",f=(k,w)=>k===null||w===null?k===w:k.length===w.length&&k.every((A,E)=>A===w[E]),g=k=>k?.length===1&&!ra(i,k).children.length?M("span",i.data?.find(w=>w.id===k[0])?.name??"未決"):qi(i,k);e.append(M("h3","Procedure"));const u=M("p","表は左右にスクロールできます。無印の手順は必須です。");u.className="procedure-scroll-hint",e.append(u);const b=M("div");b.dataset.procedureScroll="",b.tabIndex=0,b.setAttribute("role","region"),b.setAttribute("aria-label","手順表");const m=M("table");m.dataset.procedureTable="",m.dataset.businessDecisions="";const p=M("thead"),h=M("tr");for(const k of["From","To","Data","Action"]){const w=M("th",k);w.scope="col",h.append(w)}p.append(h),m.append(p);const x=M("tbody"),v=k=>{const w=n.procedure.steps.findIndex(E=>E.id===k),A=n.procedure.steps[w];return n.procedure.steps.filter(E=>E.action===A.action).length>1?`${A.action}（${w+1}行目）`:A.action};for(const[k,w]of n.procedure.steps.entries()){const A=M("tr");A.dataset.stepId=w.id;const E=w.exchange,O=En(i,n),$=E.kind==="interaction"?i.objects.find(H=>H.id===E.objectId)?.name??"未決":null,D=E.kind==="interaction"?E.direction==="input"?$:O:E.kind==="internal"?O:"未決",L=E.kind==="interaction"?E.direction==="input"?O:$:E.kind==="internal"?"—":"未決";A.append(M("td",D),M("td",L));const N=M("td");E.kind!=="interaction"||f(w.whatDataIds,E.dataIds)?N.append(g(w.whatDataIds)):N.append(M("span","対象："),g(w.whatDataIds),M("span","受渡し："),g(E.dataIds)),A.append(N);const Y=M("td",w.action);for(const H of w.decisionIds??[])Y.append(c(H));na(n,w)&&Y.append(M("small","判定表を参照する手順が後方です。前提を確認"));const W=[],Z=w.obligation==="optional";let Q;if(w.method&&W.push(`方法：${w.method}`),w.appliesWhen&&W.push(`適用条件：${w.appliesWhen}`),w.effect&&W.push(`操作効果：${w.effect}`),w.whenDecision){const H=r.find(pe=>pe.id===w.whenDecision.decisionId),oe=H?.rows.find(pe=>pe.id===w.whenDecision.rowId),ue=n.procedure.steps.slice(0,k).some(pe=>pe.decisionIds?.includes(H?.id??""));H?.kind==="validation"&&oe?.result.kind==="accepted"&&H.rows.some(pe=>pe.result.kind==="error")&&H.rows.every(pe=>pe===oe||pe.result.kind==="error")&&ue||(W.push(`判定条件：${H?.title??"未決"} / ${l(H,oe,!0)}`),Q=w.whenDecision)}if(w.parties){const H=d(w.parties.from),oe=d(w.parties.to);(H!==D||oe!==L)&&W.push(`操作主体と対象：${H} → ${oe}`)}if(E.kind==="interaction"?(E.phase===null?W.push("Request/Response：未決"):E.phase!=="not-applicable"&&W.push(E.phase==="request"?"Request":"Response"),E.pairedStepId&&W.push(`対応：手順${n.procedure.steps.findIndex(H=>H.id===E.pairedStepId)+1}`)):E.kind==="unresolved"&&W.push("やり取り：未決"),W.length){const H=M("details"),oe=M("summary",Z?"詳細（任意）":"詳細"),ue=M("small",W.join(" · "));Q&&ue.append(c(Q.decisionId,Q.rowId)),H.className="procedure-original",H.append(oe,ue),Y.append(H)}else Z&&Y.append(M("small","（任意）"));if(w.legacyText){const H=M("details");H.className="procedure-original",H.append(M("summary","元の手順"),et(w.legacyText)),Y.append(H)}A.append(Y),x.append(A)}if(m.append(x),b.append(m),e.append(b),n.procedure.orderRules.length){e.append(M("h3","手順の順序制約"));const k=M("ul");for(const w of n.procedure.orderRules)k.append(M("li",w.kind==="before"?`${v(w.beforeId)} → ${v(w.afterId)}`:`${w.stepIds.map(v).join("・")}は入替可能`));e.append(k)}for(const k of r){const w=M("section");if(w.dataset.businessDecision=k.id,s.set(k.id,w),w.append(M("h3",`${k.title}（※${a(k.id)}）`)),k.appliesWhen){const A=r.find(D=>D.id===k.appliesWhen.decisionId),E=A?.rows.find(D=>D.id===k.appliesWhen.rowId),O=!!E&&!!A&&A.rows.filter(D=>D.result.text===E.result.text).length>1,$=M("p",`適用条件：${A?.title??"未決"} — ${l(A,E,O)}`);$.append(c(k.appliesWhen.decisionId,k.appliesWhen.rowId)),k.note&&$.append(document.createTextNode(" · "+k.note)),w.append($)}else k.note&&w.append(M("p",k.note));w.append(M("p","上から順に判定し、最初に当てはまる行を見ます。"),hs(k,o),...bs(k,i,o)),e.append(w)}}function nl(e,t,n){const i=M("article");i.className="markdown json-detail";const o=e.model,r=o.business,s=r.objects.find(c=>c.id===t),a=r.activities.find(c=>c.id===t);if(s){Qe(i,"Scope",s.scope===null?"未決":String(s.scope)),i.append(M("h3","Information"));const c=M("ul");for(const l of s.information){const d=M("li",typeof l=="string"?l:l.name);typeof l!="string"&&l.description&&d.append(et(l.description)),c.append(d)}i.append(c)}else if(a){const c=r.exceptions?.filter(u=>u.activityId===a.id)??[];if("performers"in a){Qe(i,"Scope",String(a.scope)),Qe(i,"Why",a.why),Qe(i,"When",a.when),Qe(i,"Who",En(r,a)),Qe(i,"旧形式の担当情報",zo(r,a)),a.performers?.length===1&&a.procedure.steps.some(p=>p.performerObjectIds===null)&&i.append(M("p","旧形式では、指定のない手順は旧形式の担当情報を継承します。")),Qe(i,"Where",a.where);const u=(e.findings??[]).filter(p=>p.id.startsWith("viewer:")&&p.targets.includes(a.id));for(const p of u){const h=M("p",p.summary+" ");h.className="finding-reference-warning",h.dataset.structureIssue=p.id;const x=M("button","構造の要確認を開く");x.type="button",x.className="node-navigate",x.onclick=()=>n?.(p.id),h.append(x),i.append(h)}i.append(M("h3","Procedure"));const b=M("ol");for(const p of a.procedure.steps){const h=M("li");h.append(et(p.text));const x=a.performers?.length===1&&(p.performerObjectIds===null||p.performerObjectIds.length===1&&p.performerObjectIds[0]===a.performers[0].objectId),v=[p.obligation==="required"?"必須":"任意",...p.appliesWhen?[`適用条件：${p.appliesWhen}`]:[],...x?[]:[`旧形式の担当：${zo(r,a,p.performerObjectIds)}`]];h.append(M("p",v.join(" · "))),b.append(h)}if(i.append(b),a.procedure.orderRules.length){i.append(M("h3","手順の順序制約"));const p=M("ul"),h=x=>String(a.procedure.steps.findIndex(v=>v.id===x)+1);for(const x of a.procedure.orderRules)p.append(M("li",x.kind==="before"?`手順${h(x.beforeId)} → 手順${h(x.afterId)}`:`手順${x.stepIds.map(h).join("・")}は入替可能`));i.append(p)}i.append(M("h3","Result"));const m=M("ul");m.dataset.businessResult="",m.dataset.resultScope="activity";for(const p of a.results){const h=M("li");h.append(et(p.text)),m.append(h)}i.append(m),Qe(i,"Problem",a.problem),Qe(i,"Pain level",a.painLevel)}else if(typeof a.who!="string"){const u=a;if(Qe(i,"Scope",u.scope===null?"未決":String(u.scope)),Qe(i,"Why",u.why),Qe(i,"When",u.when),Qe(i,"Who",En(r,u)),Qe(i,"Where",u.where),o.formatVersion==="0.7")tl(i,e,u);else{i.append(M("h3","Procedure"));const m=M("table");m.dataset.procedureTable="";const p=M("thead"),h=M("tr");for(const A of["Step","From","To","Data","Action"]){const E=M("th",A);E.scope="col",h.append(E)}p.append(h),m.append(p);const x=M("tbody"),v=A=>A?A.kind==="who"?En(r,u):r.objects.find(E=>E.id===A.objectId)?.name??"未決":"未決";for(const[A,E]of u.procedure.steps.entries()){const O=M("tr");O.dataset.stepId=E.id;const $=E.parties,D=(Q,H)=>Q===null||H===null?Q===H:Q.length===H.length&&Q.every((oe,ue)=>oe===H[ue]),L=$?v($.from):E.exchange.kind==="internal"?En(r,u):"未決",N=$?v($.to):E.exchange.kind==="internal"?"—":"未決";for(const Q of[String(A+1),L,N])O.append(M("td",Q));const Y=M("td");E.exchange.kind!=="interaction"||D(E.whatDataIds,E.exchange.dataIds)?Y.append(qi(r,E.whatDataIds)):Y.append(M("span","対象："),qi(r,E.whatDataIds),M("span","受渡し："),qi(r,E.exchange.dataIds)),O.append(Y);const W=M("td",E.action),Z=[...E.obligation==="optional"?["任意"]:[],...E.method?[`方法：${E.method}`]:[],...E.appliesWhen?[`適用条件：${E.appliesWhen}`]:[],...E.effect?[`操作効果：${E.effect}`]:[]];if(E.exchange.kind==="interaction"){const Q=E.exchange,H=r.objects.find(Se=>Se.id===Q.objectId)?.name??"未決",oe=E.parties,ue=oe?.from?.kind==="who"&&oe.to?.kind==="object"&&oe.to.objectId===Q.objectId,be=oe?.from?.kind==="object"&&oe.from.objectId===Q.objectId&&oe.to?.kind==="who";if(!(Q.direction==="output"?ue:be)){const Se=Q.direction==="input"?"Input":"Output";Z.push(`受渡し：${ue||be?"":H+" / "}${Se}`)}Q.phase===null?Z.push("Request/Response：未決"):Q.phase!=="not-applicable"&&Z.push(Q.phase==="request"?"Request":"Response"),Q.pairedStepId&&Z.push(`対応：手順${u.procedure.steps.findIndex(Se=>Se.id===Q.pairedStepId)+1}`)}else E.exchange.kind==="unresolved"&&Z.push("やり取り：未決");if(Z.length&&W.append(M("small",Z.join(" · "))),E.legacyText){const Q=M("details");Q.className="procedure-original",Q.append(M("summary","元の手順"),et(E.legacyText)),W.append(Q)}O.append(W),x.append(O)}m.append(x);const k=M("p","表は左右にスクロールできます。無印の手順は必須です。");k.className="procedure-scroll-hint";const w=M("div");if(w.dataset.procedureScroll="",w.tabIndex=0,w.setAttribute("role","region"),w.setAttribute("aria-label","手順表"),w.append(m),i.append(k,w),u.procedure.orderRules.length){i.append(M("h3","手順の順序制約"));const A=M("ul"),E=O=>String(u.procedure.steps.findIndex($=>$.id===O)+1);for(const O of u.procedure.orderRules)A.append(M("li",O.kind==="before"?`手順${E(O.beforeId)} → 手順${E(O.afterId)}`:`手順${O.stepIds.map(E).join("・")}は入替可能`));i.append(A)}}i.append(M("h3","Result"));const b=M("ul");b.dataset.businessResult="",b.dataset.resultScope="activity";for(const m of u.results){const p=M("li");p.append(et(m.text)),b.append(p)}i.append(b),Qe(i,"Problem",u.problem),Qe(i,"Pain level",u.painLevel)}else{const u=a;for(const[b,m]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const p=Qe(i,b,m==="who"?ms(e,u.id)?.name??u.who:u[m]===null?null:String(u[m]));m==="result"&&p&&(p.dataset.businessResult="")}}const l=Yd("exception"in a?a.exception:null,c),d=el(e,a.id,c),f=(u,b,m)=>{if(!b.length&&!m)return;const p=M("section");p.dataset.businessVariations="",p.append(M("h3",u)),m&&p.append(m);for(const h of b){const x=et(h.description);x.dataset.businessException=h.id,p.append(M("h4",h.name),x);const v=h.continuity;if(v){const k=M("dl"),w=O=>O&&typeof a.procedure!="string"?`手順${a.procedure.steps.findIndex($=>$.id===O)+1}`:"未決",A=O=>O===null?"未決":O.map($=>r.data?.find(D=>D.id===$)?.name??"未決").join("、")||"なし",E=[["発生条件",v.trigger??"未決"]];(v.onInterrupt!==null||v.outcome==="resume"||v.outcome===null)&&E.push(["中断時の扱い",v.onInterrupt??"未決"]),E.push(["その後",v.outcome==="resume"?"再開":v.outcome==="continue"?"そのまま続行":v.outcome==="end"?"終了":"未決"]),(v.outcome==="resume"||v.outcome===null||v.resumeCondition!==null||v.resumeAction!==null)&&E.push(["再開条件",v.resumeCondition??"未決"],["再開方法",v.resumeAction??"未決"]),v.interruptedAtStepId&&E.push(["中断した手順",w(v.interruptedAtStepId)]),v.resumeAtStepId&&E.push(["再開する手順",w(v.resumeAtStepId)]),(v.retainedDataIds!==null||v.outcome==="resume")&&E.push(["保持するData",A(v.retainedDataIds)]);for(const[O,$]of E)k.append(M("dt",O),M("dd",$));p.append(k)}}i.append(p)};["0.6","0.7"].includes(o.formatVersion)?f("Exception",c,l):d.size?(f("例外",c.filter(u=>d.get(u.id)==="exception")),f("別ルート",c.filter(u=>d.get(u.id)==="alternative")),f("通常以外の扱い",c.filter(u=>!d.has(u.id)),l)):f("通常以外の扱い",c,l);const g=new Map([...r.objects,...r.activities].map(u=>[u.id,u.name]));if(["0.6","0.7"].includes(o.formatVersion))for(const[u,b]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=e.graph.relations.filter(h=>h.kind===u&&(h.from===t||h.to===t));if(!m.length)continue;i.append(M("h3",b));const p=M("ul");for(const h of m){const v=`${u==="business-exception"?`${g.get(h.from)} → ${g.get(h.to)}`:g.get(u==="input"?h.from:h.to)} — ${h.label||"未決"}`;if(u==="business-exception"){i.append(M("p",v));continue}p.append(M("li",v))}u!=="business-exception"&&i.append(p)}else for(const[u,b]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=r.relations.filter(h=>h.kind===u&&(h.fromId===t||h.toId===t));if(!m.length)continue;i.append(M("h3",b));const p=M("ul");for(const h of m){const x=u==="business-exception"?`${g.get(h.fromId)} → ${g.get(h.toId)}`:g.get(u==="input"?h.fromId:h.toId),v=Jr(r,h),k=`${x} — ${v||"未決"}`;if(u==="business-exception"){i.append(M("p",k));continue}const w=M("li",k);if("dataId"in h){const A=r.data.find(O=>O.id===h.dataId),E=M("ul");for(const O of A.items){const $=r.objects.flatMap(L=>L.information).find(L=>typeof L!="string"&&L.id===O.informationId);if(!$||typeof $=="string")continue;const D=M("li",$.name+(O.condition?`（条件：${O.condition}）`:""));$.description&&D.append(et($.description)),E.append(D)}w.append(E)}p.append(w)}u!=="business-exception"&&i.append(p)}}else i.append(M("p","項目を選択すると業務内容を表示します。"));return i}function aa(e,t){return e.model?.formatVersion!=="0.7"?[]:e.model.business.activities.flatMap(n=>"decisions"in n?n.decisions??[]:[]).filter(n=>n.rows.some(i=>i.checkRefs.some(o=>o.checkId===t)))}function to(e,t,n){const i=new Set(Object.values(n.fields).flat().filter(o=>o.kind==="reference").map(o=>o.targetId));for(const o of aa(t,n.id)){if(o.rows.some(a=>i.has(a.id)))continue;const r=M("details");r.dataset.linkedBusinessDecision=o.id,r.append(M("summary",`${o.title}（業務判断）`));let s=!1;r.addEventListener("toggle",()=>{!r.open||s||(s=!0,r.append(hs(o,t.model.checks),...bs(o,t.model.business,t.model.checks)))}),e.append(r)}}class yi{remaining=5e3;warned=!1;doc;design;requester;constructor(t,n,i=!1){this.doc=t,this.design=n,this.requester=i}take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(M("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(et(o.value));continue}if(o.kind==="text"){const c=M("span",o.value);c.style.whiteSpace="pre-wrap",t.append(c);continue}if(o.kind==="link"){t.append(M("span",`${o.label} (${o.uri})`));continue}const r=M("details"),s=M("summary",o.label||o.targetId);r.append(s),t.append(r);let a=!1;r.addEventListener("toggle",()=>{if(!r.open||a)return;if(a=!0,i.has(o.targetId)){r.append(M("p","循環参照："+o.targetId));return}if(i.size>=16){r.append(M("p","参照の深さの上限です。続きは原文で確認してください。"));return}const c=new Set(i).add(o.targetId),l=this.doc,d=l.guarantees.find(m=>m.id===o.targetId),f=l.examples.find(m=>m.id===o.targetId),g=l.items.find(m=>m.id===o.targetId),u=l.sections.find(m=>m.id===o.targetId),b=l.notes.find(m=>m.id===o.targetId);if(d){r.append(M("h4",d.title));for(const m of d.blocks){if(!this.take(r))break;m.kind==="prose"?this.runs(r,m.content,c):this.example(r,m.exampleId,c)}}else if(f)this.example(r,f.id,c);else if(g){r.append(M("p",`${g.checkId} · ${g.title}`+(this.requester?"":` · ${g.reviewState}`))),this.requester&&(g.reviewState==="要確認"||g.reviewState==="要修正")&&r.append(M("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(g.fields).filter(([p])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(p))):g.fields;this.fields(r,m,c)}else if(u)r.append(M("h4",u.title)),this.runs(r,u.preamble,c);else if(b)r.append(M("h4",b.title)),this.runs(r,b.content,c);else if(o.targetId===l.id)r.append(M("h4",l.title)),this.runs(r,l.intro,c);else if(this.design.model?.formatVersion==="0.7"){const m=this.design.model.business,p=m.activities.flatMap(x=>"decisions"in x?x.decisions??[]:[]).find(x=>x.rows.some(v=>v.id===o.targetId)),h=m.exceptions?.find(x=>x.id===o.targetId);p?r.append(M("h4",p.title),hs(p,this.design.model.checks),...bs(p,m,this.design.model.checks)):h&&r.append(M("h4",h.name),et(h.description))}})}}fields(t,n,i,o=!1){for(const[r,s]of Object.entries(n)){if(!this.take(t))break;if(t.append(M("h4",Qd[r]??r)),r==="guarantee"&&o){const a=new Set;for(const c of s){const l=c.kind==="reference"?this.doc.guarantees.find(f=>f.id===c.targetId):void 0;if(!l){this.runs(t,[c],i);continue}if(a.has(l.id))continue;a.add(l.id);const d=new Set(i).add(l.id);for(const f of l.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,d):this.example(t,f.exampleId,d)}}}else this.runs(t,s,i)}}example(t,n,i,o=!1){const r=this.doc.examples.find(f=>f.id===n);if(!Gn(this.doc,r).length)return;const s=M("table"),a=o?r.columns.indexOf("結果"):-1,c=a>0&&r.columns.at(-1)==="Check ID";if(c){const f=M("colgroup");f.span=a,s.append(f);for(let p=a;p<r.columns.length;p++)s.append(M("colgroup"));const g=M("thead"),u=M("tr"),b=M("th","条件");b.colSpan=a,b.scope="colgroup",u.append(b);for(let p=a;p<r.columns.length;p++){const h=M("th",r.columns[p]);h.rowSpan=2,h.scope="col",p===a?h.className="decision-result":r.columns[p]==="備考"&&(h.className="decision-notes"),u.append(h)}const m=M("tr");for(const p of r.columns.slice(0,a)){const h=M("th",p);h.scope="col",m.append(h)}g.append(u,m),s.append(g)}else{const f=M("tr");for(const g of r.columns){if(!this.take(t))break;f.append(M("th",g))}s.append(f)}const l=c?M("tbody"):s;for(const f of r.rows){if(!this.take(t))break;const g=M("tr");for(const[u,b]of f.entries()){if(!this.take(t))break;const m=M("td");if(c&&u===a?m.className="decision-result":c&&r.columns[u]==="備考"&&(m.className="decision-notes"),o)for(const p of b){const h=p.kind==="reference"?this.doc.items.find(x=>x.id===p.targetId):void 0;h?m.append(M("span",h.checkId)):this.runs(m,[p],i)}else this.runs(m,b,i);g.append(m)}l.append(g)}c&&s.append(l);const d=M("div");d.className="json-example",d.append(s),t.append(d)}}function cr(e,t,n=e.model.checks,i=new Set,o=new Set){const r=M("section");r.className="check-content json-checks";const s=e.model.business,a=n.filter(l=>l.basedOn.documentId===s.id);let c=!1;for(const l of a){const d=new yi(l,e),f=l.index.filter(m=>m.activityId===t),g=new Set(l.index.flatMap(m=>m.checkIds)),u=(t?[...new Set(f.flatMap(m=>m.checkIds))]:l.items.filter(m=>!g.has(m.id)).map(m=>m.id)).filter(m=>!i.has(m)),b=l.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of b){(m.preamble.length||l.guarantees.some(p=>p.sectionId===m.id&&!o.has(p.id)))&&(c=!0),d.runs(r,m.preamble);for(const p of l.guarantees.filter(h=>h.sectionId===m.id&&!o.has(h.id)))d.runs(r,[{kind:"reference",targetId:p.id,label:p.title}])}for(const m of u){const p=l.items.find(v=>v.id===m);if(!p)continue;c=!0;const h=M("section");h.className="check-item",h.dataset.checkId=p.checkId,h.dataset.elementId=p.id,h.append(M("h3",p.checkId+" · "+p.title)),(p.reviewState==="要確認"||p.reviewState==="要修正")&&h.append(M("p","確認が必要です。"));const x=Object.fromEntries(Object.entries(p.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));d.fields(h,x,new Set([p.id])),to(h,e,p),r.append(h)}if(!t)for(const m of l.notes)c=!0,d.runs(r,[{kind:"reference",targetId:m.id,label:m.title}])}return c||r.append(M("p","この業務のテスト仕様はありません。")),r}function il(e,t,n=e.model.checks){const i=M("section");i.className="check-content json-checks sample-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(a=>a.basedOn.documentId===o.id&&a.basedOn.revision===o.revision)){const a=new yi(s,e);for(const c of s.items.filter(l=>r.has(l.id))){const l=M("section");l.className="check-item",l.dataset.checkId=c.checkId,l.dataset.elementId=c.id,l.append(M("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&l.append(M("p","確認が必要です。"));const d=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));a.fields(l,d,new Set([c.id]),!0),to(l,e,c),i.append(l)}}return i}const ol=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function sl(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(ol,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function rl(e,t,n=e.model.checks){const i=M("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const r of t)for(const s of n.filter(a=>a.basedOn.documentId===o.id&&a.basedOn.revision===o.revision)){const a=s.examples.find(b=>b.id===r);if(!a||!Gn(s,a).length)continue;const c=new yi(s,e,!0),l=s.guarantees.find(b=>b.id===a.guaranteeId),d=M("section");d.dataset.decisionExample=r;for(const b of l?.blocks??[])b.kind==="prose"&&c.runs(d,sl(b.content),new Set([l.id]));a.rows.length>1&&d.append(M("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=a.columns.indexOf("結果"),g=f>0?f:a.columns.length;a.rows.some(b=>b.slice(0,g).some(m=>m.some(p=>p.kind==="text"&&/^\s*[-‐]\s*$/.test(p.value))))&&d.append(M("p","‐＝値不問。")),c.example(d,r,new Set([r]),!0),i.append(d)}return i}function al(e,t,n=e.model.checks){const i=M("section");i.className="check-content json-checks decision-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(a=>a.basedOn.documentId===o.id&&a.basedOn.revision===o.revision)){const a=new yi(s,e,!0);for(const c of s.items.filter(l=>r.has(l.id))){const l=M("section");l.className="check-item",l.dataset.checkId=c.checkId,l.dataset.elementId=c.id,l.append(M("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&l.append(M("p","確認が必要です。")),c.fields.condition?.length&&(l.append(M("h4","条件")),a.runs(l,c.fields.condition,new Set([c.id])));const d=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(d).length){const f=M("details");f.append(M("summary","期待結果")),a.fields(f,d,new Set([c.id]),!0),l.append(f)}to(l,e,c),i.append(l)}}return i}function cl(e,t,n=e.model.checks,i=new Set){const o=M("section");o.className="check-content json-checks result-checks";const r=e.model.business,s=new Set(t);for(const a of n.filter(c=>c.basedOn.documentId===r.id&&c.basedOn.revision===r.revision)){const c=new yi(a,e,!0),l=a.items.filter(d=>s.has(d.id)&&i.has(d.id)&&d.reviewState!=="要確認"&&d.reviewState!=="要修正"&&!d.fields.question?.length&&!d.fields.alternatives?.length&&!aa(e,d.id).length);l.length&&o.append(M("p",l.map(d=>d.checkId).join("、")));for(const d of a.items.filter(f=>s.has(f.id))){if(l.includes(d))continue;const f=M("section");f.className="check-item",f.dataset.checkId=d.checkId,f.dataset.elementId=d.id,f.append(M("h3",d.checkId)),(d.reviewState==="要確認"||d.reviewState==="要修正")&&f.append(M("p","確認が必要です。"));const g=Object.fromEntries(Object.entries(d.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));c.fields(f,g,new Set([d.id]),!0);const u=M("details"),b=M("summary","Check の詳細");u.append(b,M("p",d.title)),d.fields.condition?.length&&c.runs(u,d.fields.condition,new Set([d.id])),f.append(u),to(f,e,d),o.append(f)}}return o}const Do=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function dl(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(d=>d.id)),i=[],o=new Set,r=new Set,s=t.filter(d=>d.basedOn.documentId===e.business.id&&d.basedOn.revision===e.business.revision),a=(d,f)=>s.some(g=>g.items.some(u=>u.id===d)&&(!f||g.index.some(u=>u.activityId===f&&u.checkIds.includes(d)))),c=(d,f,g,u,b=[])=>{const m=f.testSpecification,p=(m?.decisionCheckIds??[]).filter(E=>a(E,g)),h=(m?.resultCheckIds??[]).filter(E=>a(E,g)),x=(m?.decisionExampleIds??[]).filter(E=>s.some(O=>{const $=O.examples.find(L=>L.id===E),D=$?Gn(O,$):[];return D.length>0&&D.every(L=>a(L,g))})),v=f.samples.filter(E=>(!m||m.sampleIds.includes(E.id))&&E.checkIds?.length&&(m?E.checkIds.every(O=>a(O,g)):E.checkIds.some(O=>a(O,g)))),k=x.flatMap(E=>s.flatMap(O=>{const $=O.examples.find(D=>D.id===E);return $?Gn(O,$).filter(D=>a(D,g)):[]})),w=[...new Set([...p,...h,...k,...v.flatMap(E=>(E.checkIds??[]).filter(O=>a(O,g)))])];if(!w.length)return;const A=`fn:${g??"_"}:${d}:${f.id}`;r.has(A)||(r.add(A),i.push({key:A,activityId:g,groupId:d,capability:f,name:u,samples:v,checkIds:w,decisionCheckIds:p,resultCheckIds:h,decisionExampleIds:x,decisionTableCheckIds:[...new Set(k)],businessSections:b}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const d of l)if(!(!Do(d)||typeof d.activityId!="string"||!n.has(d.activityId)||!Array.isArray(d.testSpecificationFunctions)))for(const f of d.testSpecificationFunctions){if(!Do(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const g=e.model.reviewGroups.find(m=>m.id===f.groupId),u=g?.capabilities.find(m=>m.id===f.capabilityId);if(!g||!u)continue;o.add(JSON.stringify([g.id,u.id]));const b=[];if(Array.isArray(f.businessSections))for(const m of f.businessSections){if(!Do(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(h=>h.id===m.exceptionId&&h.activityId===d.activityId)))continue;const p=[...new Set(m.pages.filter(h=>h==="decision"||h==="result"))];p.length&&b.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:p})}c(g.id,u,d.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():u.title,b)}}for(const d of e.model.reviewGroups)for(const f of d.capabilities)o.has(JSON.stringify([d.id,f.id]))||c(d.id,f,void 0,f.title);return i}function dr(e,t,n,i){const o=e.filter(s=>s.groupId===t&&s.capability.id===n),r=o.find(s=>s.samples.some(a=>a.id===i));if(r)return{kind:"sample",key:r.key,sampleId:i};for(const s of o){if(!s.capability.testSpecification)continue;const a=s.capability.samples.find(l=>l.id===i),c=s.decisionExampleIds.length?s.decisionTableCheckIds:s.decisionCheckIds;if(a?.checkIds?.some(l=>c.includes(l)))return{kind:"decision",key:"decision:"+s.key}}}const Tn=["landscape","overview"];function ll(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const r=document.createElement("div");r.className="shell-workbench",n.before(r);const s=document.createElement("aside");s.id="design-explorer",s.setAttribute("aria-label","設計ナビゲーション"),s.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const a=document.createElement("div");a.className="shell-center",r.append(s,a),a.append(i,n);const c=document.createElement("div");c.className="shell-open-tabs",o.before(c),c.append(o),Uc(c);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),c.append(l);const d=document.createElement("nav");d.className="state-tabs",d.setAttribute("aria-label","開いている状態遷移"),c.append(d);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),c.append(f);const g=document.createElement("section");g.id="concept-workspace",g.hidden=!0,g.setAttribute("aria-label","データ構造"),g.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',a.append(g);const u=document.createElement("section");u.id="states-workspace",u.hidden=!0,u.setAttribute("aria-label","状態遷移"),u.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',a.append(u);const b=document.createElement("section");b.id="tests-workspace",b.hidden=!0,b.setAttribute("aria-label","テスト仕様"),b.innerHTML='<main class="test-spec-page"></main>',a.append(b);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const p=document.createElement("section");p.id="empty-workspace",p.hidden=!0,p.innerHTML="<p>左の一覧から図を開いてください。</p>",a.append(p);const h=n.querySelector("#node-list-drawer");s.append(h);const x=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),k=s.querySelector("input"),w=s.querySelector("nav"),A=g.querySelector("iframe"),E=g.querySelector(".concept-related"),O=u.querySelector("article"),$="alder-explorer-v1:"+location.pathname,D=location.protocol==="file:"||location.origin==="null"?"*":location.origin,L=window.__alderConceptHtml;let N,Y,W,Z,Q={},H=[],oe=[...Tn],ue=new Map,be=new Map,pe=new Map,Se=new Map;const q=y=>pe.get(y)??y,B=y=>Se.get(y)??y,_=y=>Y?.findGroup(ue.get(y??"")),ge=y=>W?.contentFor(ue.get(y)??""),ie=(y,I)=>W?.findDataExample(ue.get(y)??"",I),De=y=>W?.examplesFor(ue.get(y)??"")??[],Pe=y=>Tn.includes(y)?"全体図":ge(y)?.title??_(y)?.name??Q[be.get(y)??""]?.name,ke=()=>{const y=t.business(),I=y.design?.model;return I?[...I.checks,...y.relatedChecks??[]].filter(R=>R.basedOn.documentId===I.business.id):[]},ce=()=>dl(N,ke()),Ee=y=>ce().find(I=>I.key===(y.startsWith("decision:")?y.slice(9):y)),Ve=y=>ce().filter(I=>I.name===y.name).length>1?y.name+"（"+(t.business().activities.find(I=>I.id===y.activityId)?.name??"その他")+"）":y.name,Ge=y=>ke().some(I=>I.index.some(R=>R.activityId===y)||I.sections.some(R=>R.activityId===y)),Jt=y=>new Set(ce().filter(I=>I.activityId===y).flatMap(I=>I.checkIds)),wn=y=>{const I=new Set(ce().filter(R=>R.activityId===y).flatMap(R=>R.decisionExampleIds));return new Set(ke().flatMap(R=>R.examples.filter(j=>I.has(j.id)).map(j=>j.guaranteeId)))},an=y=>{const I=Jt(y),R=wn(y);return ke().some(j=>j.index.some(V=>V.activityId===y&&V.checkIds.some(X=>!I.has(X)))||j.sections.some(V=>V.activityId===y&&(V.preamble.length>0||j.guarantees.some(X=>X.sectionId===V.id&&!R.has(X.id)))))},Ga=()=>ke().some(y=>y.items.some(I=>!y.index.some(R=>R.checkIds.includes(I.id)))||y.sections.some(I=>I.activityId===null)||y.notes.length>0),Ha=y=>{const I=Ee(y);return I?I.capability.testSpecification?Ve(I)+"・"+(y.startsWith("decision:")?"可否":"結果"):I.name:(y==="@unassigned"?"未割当":y.startsWith("remaining:")?t.business().activities.find(R=>R.id===y.slice(10))?.name:y.startsWith("checks:")?t.business().activities.find(R=>R.id===y.slice(7))?.name:y==="@overview"?"テスト仕様":void 0)??y},xi=n.querySelector("#formattedMarkdownDrawer");xi&&r.append(xi),r.append(E,m),tr(E,r,$+":drawer-width"),tr(m,r,$+":test-drawer-width");let Ai=!1;const gt=t.rightDrawer??{isOpen:()=>Ai,setOpen:y=>{Ai=y}};let se="business",We=!1,st=[],K="overview",rt=[],yt="",vt=[],Te="@overview",Ln,_t=innerWidth>800,Ei=!1,Oi=!0,wt=!1,Qn;const kt=new Map,Ot=new Map([["overview",A]]),mt=new Map,kn=new Map,In=new Map,ze=new Map,cn=new Map,jt=new Set,Ke=new Set,Sn=new Set,Xe=new Map;let Oe;try{if(Oe=JSON.parse(sessionStorage.getItem($)||"null"),Oe){if(wt=Oe.overviewClosed===!0,Qn=typeof Oe.documentKey=="string"?Oe.documentKey:void 0,_t=typeof Oe.left=="boolean"?Oe.left:_t,Array.isArray(Oe.expanded)){Ke.clear();for(const y of Oe.expanded)typeof y=="string"&&Ke.add(y)}rt=Array.isArray(Oe.states)?Oe.states.filter(y=>typeof y=="string"):[],t.rightDrawer||(typeof Oe.rightOpen=="boolean"?Ai=Oe.rightOpen:typeof Oe.right?.["concept:"+Oe.active]=="boolean"&&(Ai=Oe.right["concept:"+Oe.active]))}}catch{}function Ja(){if(!(!Oe||Qn!==t.business().key||!We)){for(const y of Array.isArray(Oe.overviewModes)?Oe.overviewModes:[])_(y)&&jt.add(y);for(const[y,I]of Object.entries(Oe.lastExamples??Oe.examples??{}))typeof I=="string"&&ie(y,I)&&cn.set(y,I);for(const[y,I]of Object.entries(Oe.examples??{}))typeof I=="string"&&ie(y,I)&&ze.set(y,I);for(const[y,I]of Object.entries(Oe.selected??{}))typeof I=="string"&&H.includes(I)&&mt.set(y,I);st=[...new Set((Array.isArray(Oe.concepts)?Oe.concepts:[]).filter(y=>typeof y=="string"&&oe.includes(y)))],K=st.includes(Oe.active)?Oe.active:"landscape"}}let xn;const He=()=>{try{sessionStorage.setItem($,JSON.stringify({documentKey:Ln,overviewClosed:wt,selected:Object.fromEntries(mt),examples:Object.fromEntries(ze),lastExamples:Object.fromEntries(cn),overviewModes:[...jt],left:_t,expandedVersion:4,expanded:[...Ke],concepts:st,active:K,states:rt,specs:vt,activeSpec:Te,specExamples:Object.fromEntries(kt),...t.rightDrawer?{}:{rightOpen:gt.isOpen()}}))}catch{}},dn=()=>{se==="concept"&&Xe.set("drawer:"+K,E.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&gt.isOpen()&&jt.has(K)&&Xe.set("review-overview:"+K,E.querySelector(".data-review-overview").scrollTop),se==="concept"&&ze.has(K)&&Xe.set("example:"+K+":"+ze.get(K),E.querySelector(".data-examples-panel").scrollTop),se==="states"&&yt&&Xe.set("state:"+yt,O.scrollTop),se==="tests"&&Xe.set("tests:"+Te,b.querySelector(".test-spec-page").scrollTop),se==="concept"&&K==="landscape"&&Xe.set("concept:landscape",g.querySelector(".concept-review-landscape").scrollTop)};function Ze(y=!0){if(Ei)return;const I=new URL(location.href);if(I.searchParams.set("view",se),I.searchParams.delete("concept"),I.searchParams.delete("dataExample"),I.searchParams.delete("dataView"),se==="concept"&&gt.isOpen()&&jt.has(K)?I.searchParams.set("dataView","overview"):se==="concept"&&_(K)&&!ze.has(K)&&I.searchParams.set("dataView","structure"),se==="concept"&&gt.isOpen()&&ze.has(K)&&I.searchParams.set("dataExample",ze.get(K)),se==="tests"&&kt.has(Te)&&I.searchParams.set("dataExample",kt.get(Te)),I.searchParams.delete("state"),I.searchParams.delete("activity"),I.searchParams.delete("object"),I.searchParams.delete("spec"),se==="concept"&&I.searchParams.set("concept",K),se==="states"&&yt&&I.searchParams.set("state",yt),se==="tests"&&I.searchParams.set("spec",Te),se==="business"){const R=t.business(),j=R.views?.find(V=>V.key===R.viewKey);j?.activity?I.searchParams.set("activity",j.activity):j?.object&&I.searchParams.set("object",j.object)}I.href!==location.href&&history[y?"pushState":"replaceState"]({alderShell:!0},"",I)}function Re(y,I,R){const j=document.createElement(I);return j.textContent=R,y.append(j),j}function It(y){y!==se&&(se==="business"?t.capture():dn(),se=y),n.hidden=se!=="business",g.hidden=se!=="concept",u.hidden=se!=="states",b.hidden=se!=="tests",p.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),Ct(),St()}function Tt(y,I=!0){We&&(y==="subsystems"&&(y="landscape"),oe.includes(y)&&(dn(),st.includes(y)||st.push(y),K=y,It("concept"),Ao(),Dt(),He(),I&&Ze()))}function _a(){dn(),ze.delete(K),jt.add(K),Ao(),E.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer-overview:"+K)??0,He(),Ze()}function Ka(y,I=!0){if(y&&!ie(K,y))return;const R=!ze.has(K),j=E.querySelector(".concept-drawer-body");R&&Xe.set("drawer-overview:"+K,j.scrollTop),dn(),jt.delete(K),y?(ze.set(K,y),cn.set(K,y)):ze.delete(K),gt.setOpen(!0),Ao(),R&&(j.scrollTop=0),He(),Ze(),I&&E.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}E.querySelector(".concept-example-back").onclick=()=>{_a(),E.querySelector(".data-review-overview").focus({preventScroll:!0})};function Nn(y,I=!0){t.business().states?.some(R=>R.id===y)&&(dn(),rt.includes(y)||rt.push(y),yt=y,It("states"),ic(),Dt(),He(),I&&Ze())}function vo(y){return y.startsWith("decision:")&&Ee(y)&&!Ee(y)?.capability.testSpecification?Ee(y).key:Ee(y)||y==="@overview"||y==="@unassigned"||y.startsWith("checks:")&&Ge(y.slice(7))||y.startsWith("remaining:")&&an(y.slice(10))?y:t.business().activities.some(I=>I.id===y)?ce().find(I=>I.activityId===y)?.key??(Ge(y)?"checks:"+y:"@overview"):"@overview"}function qt(y,I=!0){const R=t.business();if(!R.design?.model||!R.key)return;y=vo(y),se==="tests"&&y!==Te&&dn(),vt.includes(y)||vt.push(y),Te=y;const j=Ee(y);Ei||(j?.capability.testSpecification?Ke.add("tests-function-"+j.key):j?.activityId?Ke.add("tests-activity-"+j.activityId):y.startsWith("checks:")?Ke.add("tests-activity-"+y.slice(7)):y.startsWith("remaining:")?Ke.add("tests-activity-"+y.slice(10)):j&&Ke.add("tests-other")),It("tests"),wo(),Dt(),St(),He(),I&&Ze()}function wo(){const y=t.business().design;if(!y?.model)return;const I=b.querySelector(".test-spec-page"),R=Ee(Te);if(R){const j=document.createElement("section");j.className="test-spec-sample";const V=Y?.findGroup(R.groupId),X=R.samples.find(fe=>fe.id===kt.get(Te))??R.samples[0],G=!!R.capability.testSpecification,ee=Te.startsWith("decision:");if(G)if(Re(j,"h2",R.name),Re(j,"h3",ee?"可否判定":"処理結果"),ee)R.decisionExampleIds.length?j.append(rl(y,R.decisionExampleIds,ke())):R.decisionCheckIds.length?j.append(al(y,R.decisionCheckIds,ke())):Re(j,"p","可否条件の記載はありません。");else{const fe=V&&X&&W?new Set(R.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(j.append(cl(y,R.resultCheckIds,ke(),fe)),V&&X&&W){Re(j,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",j.append(Le),W.renderDataExample(Le,V,X.id,Fe=>{Xe.set("tests:"+Te,I.scrollTop),kt.set(Te,Fe),wo(),He(),Ze(),b.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:R.capability.id,sampleIds:R.samples.map(Fe=>Fe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(V&&X&&W){const fe=document.createElement("div");fe.className="data-examples-panel test-spec-examples",j.append(fe),W.renderDataExample(fe,V,X.id,Le=>{Xe.set("tests:"+Te,I.scrollTop),kt.set(Te,Le),wo(),He(),Ze(),b.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:R.capability.id,heading:R.name,sampleIds:R.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(il(y,X.checkIds??[],ke()))})}I.replaceChildren(j)}else if(Te==="@overview")I.replaceChildren(),Re(I,"p","左のメニューからテスト仕様を選択してください。");else if(Te.startsWith("remaining:")){const j=Te.slice(10);I.replaceChildren(cr(y,j,ke(),Jt(j),wn(j)))}else I.replaceChildren(cr(y,Te.startsWith("checks:")?Te.slice(7):void 0,ke()));Ya(R),I.scrollTop=Xe.get("tests:"+Te)??0}function ei(y){y||(wt=!1),It("business"),y?t.openActivity(y):(wt=!1,t.openOverview()),St(),Dt(),Ze()}function Xa(y){It("business"),t.openObject(y),St(),Dt(),Ze()}function Vs(y){const I=t.business(),R=I.design?.model;return R?[...new Set(R.states.filter(j=>j.objectId===y&&j.basedOn.documentId===R.business.id&&j.basedOn.revision===R.business.revision).flatMap(j=>j.transitions.map(V=>V.activityId)))]:[...new Set((I.design?.objectStateTransitions?.[y]?.model?.transitions??[]).flatMap(j=>j.activityId?[j.activityId]:[]))]}function Fs(y){return(t.business().states??[]).filter(I=>Vs(I.id).includes(y))}function Bs(y){const I=t.business(),R=I.design?.model,j=N?.model.concepts.find(V=>V.id===y);return!R||!N||!j?[]:(I.states??[]).filter(V=>j.businessObjectIds.includes(V.id)&&R.states.some(X=>X.objectId===V.id&&X.basedOn.documentId===R.business.id&&X.basedOn.revision===R.business.revision&&N.model.relatedStates.some(G=>G.documentId===X.id&&G.revision===X.revision)))}function ko(y,I,R="状態遷移"){if(!I.length)return;const j=document.createElement("section");j.className="shell-related-links",Re(j,"h3",R);for(const V of I){const X=Kt(j,V.name,()=>Nn(V.id));X.dataset.relatedState=V.id}y.append(j)}function Gs(y){const I=N?.model.reviewGroups.find(j=>j.id===y.groupId);if(!I)return[];const R=new Set(I.graph.nodes.map(j=>j.conceptId));return[...new Set(y.samples.flatMap(j=>j.blocks.map(V=>V.card)))].filter(j=>R.has(j)&&N?.model.concepts.some(V=>V.id===j))}function Kt(y,I,R){const j=document.createElement("button");return j.type="button",j.className="shell-evidence",Re(j,"span",I),j.onclick=R,y.append(j),j}function Io(y,I){const R=I.filter(V=>V.capability.testSpecification);if(!R.length)return;const j=document.createElement("section");j.className="shell-test-links",Re(j,"h3","テスト仕様書");for(const V of R)for(const[X,G]of[["decision:","可否判定"],["","処理結果"]]){const ee=X+V.key,fe=Kt(j,Ve(V)+"・"+G,()=>qt(ee));fe.dataset.relatedSpec=ee}y.append(j)}function Za(y,I){const R=ce().filter(ee=>ee.activityId===I&&ee.capability.testSpecification),j=N?.model.presentation.activityViews,V=Array.isArray(j)?j.find(ee=>ee&&typeof ee=="object"&&ee.activityId===I):void 0,X=Array.isArray(V?.uncreatedTestSections)?V.uncreatedTestSections:[],G=y.querySelectorAll("[data-business-result],[data-business-exception]");for(const ee of Array.from(G)){const fe=ee.dataset.businessException,Le=fe?"exception":"result",Fe=fe??"result",Be=R.flatMap(at=>at.businessSections.filter($t=>$t.kind===Le&&(Le==="result"||$t.exceptionId===fe)).flatMap($t=>$t.pages.filter(J=>J==="decision"?at.decisionCheckIds.length||at.decisionExampleIds.length:at.resultCheckIds.length||at.samples.length).map(J=>({target:at,page:J})))),Mt=document.createElement("section");Mt.className="shell-section-links",Mt.setAttribute("aria-label","テスト仕様書"),ee.dataset.resultScope==="activity"&&Re(Mt,"p",(Be.length?"Activity全体との対応です。":"")+"各Resultとの対応は未確認です。");const ht=new Set;for(const{target:at,page:$t}of Be){const J=($t==="decision"?"decision:":"")+at.key;if(ht.has(J))continue;ht.add(J);const Ce=Kt(Mt,Ve(at)+"・"+($t==="decision"?"可否判定":"処理結果"),()=>qt(J));Ce.dataset.relatedSpec=J}if(!ht.size){const at=Re(Mt,"p",X.includes(Fe)?"テスト仕様書未作成":"テスト仕様書との対応未確認");at.className="shell-spec-warning"}ee.after(Mt)}Io(y,R.filter(ee=>!ee.businessSections.length))}function Ya(y){const I=m.querySelector(".spec-related-content");if(I.replaceChildren(),!y?.capability.testSpecification)return;const R=t.business().activities.find(X=>X.id===y.activityId),j=Y?.findGroup(y.groupId);if(R){Re(I,"h3","Activity");const X=Kt(I,R.name,()=>ei(R.id));X.dataset.relatedActivity=R.id}if(j){Re(I,"h3","概念モデル");const X=Kt(I,j.name,()=>Tt(q(j.id)));X.dataset.relatedGroup=j.id}const V=Gs(y);if(V.length){Re(I,"h3","概念");for(const X of V){const G=N.model.concepts.find(fe=>fe.id===X),ee=Kt(I,G.name,()=>Tt(B(X)));ee.dataset.relatedConcept=X}}y.activityId&&ko(I,Fs(y.activityId),"状態遷移（同じ Activity）")}function Qa(y,I){Re(y,"h3","Activity");const R=t.business(),j=_(K),V=N?.model.concepts.find(G=>G.id===I),X=j?.concepts[I]?.sourceActivities??j?.activities??V?.activityLinks.filter(G=>G.uses.includes("生成")).map(G=>G.activityId)??[];for(const G of X){const ee=R.activities.find(Le=>Le.id===G);if(!ee)continue;const fe=document.createElement("button");fe.className="shell-evidence",Re(fe,"span",ee.name),fe.title=ee.name+"を業務タブで開く",fe.setAttribute("aria-label",fe.title),fe.onclick=()=>ei(ee.id),y.append(fe)}}function So(y){const I=_(y);return I?Y?.graph(I.id):y==="overview"?Y?.overviewGraph():void 0}function Hs(y){const I=kn.get(K),R=I?So(K)?.tables[I]:void 0;return R?.conceptId===y?R:void 0}function ec(y,I){const R=Hs(I)??_(K)?.concepts[I]??{...Q[I],sources:void 0};y.replaceChildren(),Re(y,"p",R.note),Re(y,"h3","持つ情報");const j=document.createElement("ul");for(const[V,X,,G,ee]of R.fields)Re(j,"li",X+(V?"（"+V+(G==="array"?"・配列":"")+(ee==="nullable"?"・未決可":"")+"）":""));if(y.append(j),R.sources?.length){Re(y,"h3","情報の出所・対象時点");const V=document.createElement("ul");for(const X of R.sources)Re(V,"li",X);y.append(V)}Qa(y,I),Io(y,ce().filter(V=>Gs(V).includes(I))),ko(y,Bs(I))}function xo(y){const I=E.querySelector(".shell-heading strong");I.textContent=y,E.setAttribute("aria-label",y)}function Js(y=!1){_(K)&&(mt.delete(K),kn.delete(K),In.delete(K),y||Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},D),ji(),Ct(),E.querySelector(".concept-drawer-body").scrollTop=0,He())}E.querySelector(".concept-selection-clear").onclick=()=>{Js(),ze.has(K)?E.querySelector(".concept-example-back").focus({preventScroll:!0}):E.querySelector(".data-review-overview").focus({preventScroll:!0})};function ji(){const y=E.querySelector(".concept-related-content");E.querySelector(".concept-selection").hidden=!!_(K)&&!mt.has(K)&&!In.has(K),E.querySelector(".concept-selection>h2").hidden=!_(K),E.querySelector(".concept-selection-clear").hidden=!_(K);const I=In.get(K);if(I&&Z){const X=Z.describe(y,{kind:"group",id:I});xo(X);return}if(K==="landscape"&&xn){y.replaceChildren();for(const[X,G]of Z.sections){Re(y,"h3",X);const ee=document.createElement("ul");for(const fe of G)Re(ee,"li",fe);y.append(ee)}xo("サブシステムの情報");return}const R=mt.get(K),j=_(K),V=We&&R?Hs(R)?.name??j?.concepts[R]?.name??Q[R].name:j?.name??"データ構造の情報";xo(V),We&&R?ec(y,R):(y.replaceChildren(),j||Re(y,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function _s(y){y.onload=()=>{Ks(),y.contentDocument&&(Qs(y.contentDocument),er(y.contentDocument));const I=y.dataset.conceptView??"overview";if(!Y||!N)return;const R=_(I),j=R?Y.graph(R.id):I==="overview"?Y.overviewGraph():{ids:H,edges:Y.edges,tables:Q,fieldLinks:Y.fieldLinks};y.contentWindow?.postMessage({type:"alder-concept-data",graph:j,focus:be.get(I),viewKey:I,documentKey:Ln??N.model.id,clearSelectionOnBackground:!!R},D);const V=mt.get(I);V&&y.contentWindow?.postMessage({type:"alder-concept-highlight",id:V},D)}}_s(A),A.dataset.conceptView="overview";function tc(){E.querySelector(".concept-page-details").hidden=!0,E.querySelector(".concept-example-back").hidden=!0;const y=E.querySelector(".data-review-overview");y.hidden=!0,y.replaceChildren();const I=E.querySelector(".data-examples-panel");I.hidden=!0,I.replaceChildren(),delete I.dataset.dataExample,xn?.root.remove(),xn=void 0;for(const[R,j]of Ot)R!=="overview"&&(j.remove(),Ot.delete(R));A.removeAttribute("src"),A.removeAttribute("srcdoc"),mt.clear(),kn.clear(),In.clear()}function Ao(){g.setAttribute("aria-label",K==="landscape"||_(K)?"サブシステム":"データ構造"),g.querySelector(".concept-empty").hidden=We;const y=g.querySelector(".concept-review-landscape"),I=_(K),R=E.querySelector(".concept-page-details"),j=E.querySelector(".data-review-overview"),V=E.querySelector(".data-examples-panel");if(R.hidden=!We||!I,j.hidden=!We||!I||ze.has(K),V.hidden=!We||!I||!ze.has(K),E.querySelector(".concept-example-back").hidden=V.hidden,We&&I){const G=ce();Jc(j,I,W,(fe,Le)=>{const Fe=dr(G,I.id,fe,Le);if(Fe)return{kind:Fe.kind,open:()=>{const Be=dr(ce(),I.id,fe,Le);Be&&(Be.sampleId?kt.set(Be.key,Be.sampleId):kt.delete(Be.key),qt(Be.key))}}},fe=>ei(fe),t.business().activities),Io(j,G.filter(fe=>fe.groupId===I.id));const ee=ze.get(K)??cn.get(K)??De(K)[0]?.id;ee&&W.renderDataExample(V,I,ee,fe=>Ka(fe)),j.scrollTop=Xe.get("review-overview:"+K)??0,V.scrollTop=Xe.get("example:"+K+":"+ee)??0}if(y.hidden=!We||!Tn.includes(K),We&&Tn.includes(K)&&(K==="landscape"&&!xn&&(xn=Qc(document,N,Ln??N.model.id,G=>Tt(q(G)))),Hc(y,xn?.root,K==="overview"?"graph":"overview"),K==="landscape"&&xn?.restore()),We&&K!=="landscape"&&!Ot.has(K)){const G=document.createElement("iframe");G.className="concept-frame",G.dataset.conceptView=K,G.title=I?I.name+"のデータ構造":Q[be.get(K)].name+"と隣接する概念",G.hidden=!0,Ot.set(K,G);const ee=be.get(K);ee&&mt.set(K,mt.get(K)??ee),_s(G),g.querySelector(".concept-main").append(G)}for(const[G,ee]of Ot)ee.hidden=!We||G!==K,We&&G===K&&!ee.hasAttribute("src")&&!ee.hasAttribute("srcdoc")&&(L?ee.srcdoc=L:ee.src=new URL("concept.html?view=overview"+(_(G)?"&group="+encodeURIComponent(_(G).id):G==="overview"?"":"&focus="+encodeURIComponent(be.get(G))),document.baseURI).href);const X=mt.get(K);X&&Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:X},D),ji(),Ct(),E.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer:"+K)??0}function Pn(){const y=t.business(),I=y.views?.find(R=>R.activity!==void 0||R.object!==void 0||!wt);I?(It("business"),t.activateView(I.key)):st.length?Tt(st.at(-1),!1):rt.length?Nn(rt.at(-1),!1):vt.length?qt(vt.at(-1),!1):It("empty")}function nc(){if(wt=!0,se==="business"){const y=t.business().views?.find(I=>I.key===t.business().viewKey);!y?.activity&&!y?.object&&Pn()}Dt(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function ic(){O.replaceChildren();const y=t.business().states?.find(ee=>ee.id===yt);if(!y)return;const I=t.statePanel(y.id);I?O.append(I):Re(O,"p","この対象の状態遷移は未定義です。");const R=m.querySelector(".spec-related-content");R.replaceChildren();const j=Vs(y.id),V=t.business().activities.filter(ee=>j.includes(ee.id));if(V.length){Re(R,"h3","Activity");for(const ee of V){const fe=Kt(R,ee.name,()=>ei(ee.id));fe.dataset.relatedActivity=ee.id}}const X=N?.model.concepts.filter(ee=>Bs(ee.id).some(fe=>fe.id===y.id))??[];if(X.length){Re(R,"h3","概念");for(const ee of X){const fe=Kt(R,ee.name,()=>Tt(B(ee.id)));fe.dataset.relatedConcept=ee.id}}const G=ce().filter(ee=>ee.activityId&&j.includes(ee.activityId)&&ee.capability.testSpecification);if(G.length){Re(R,"h3","Activity に関連するテスト仕様書");for(const ee of G)for(const[fe,Le]of[["decision:","可否判定"],["","処理結果"]]){const Fe=fe+ee.key,Be=Kt(R,Ve(ee)+"・"+Le,()=>qt(Fe));Be.dataset.relatedSpec=Fe}}O.scrollTop=Xe.get("state:"+yt)??0}let Eo="";function Dt(){for(const j of Array.from(o.querySelectorAll(".tab"))){const V=t.business().views?.find(G=>G.key===j.dataset.key);j.hidden=wt&&V?.activity===void 0&&V?.object===void 0;const X=!j.hidden&&se==="business"&&j.dataset.key===t.business().viewKey;j.classList.toggle("active",X),j.querySelector("button")?.setAttribute("aria-current",String(X))}const y=(j,V,X)=>{j.replaceChildren();for(const G of V){const ee=X==="concept"?Pe(G):t.business().states?.find(ht=>ht.id===G)?.name??G,fe=se===X&&G===(X==="concept"?K:yt),Le=document.createElement("div");Le.className="tab"+(fe?" active":"");const Fe=X==="concept"&&(G==="landscape"||_(G))?"subsystems":X;Le.dataset.viewKind=Fe;const Be=document.createElement("button");Be.id=(X==="concept"?"concept-tab-":"state-tab-")+G,$o(Be,Fe,ee),Be.setAttribute("aria-current",String(fe)),Be.onclick=()=>X==="concept"?Tt(G):Nn(G),Le.append(Be);const Mt=Wo((Fe==="subsystems"?"サブシステム：":X==="concept"?"データ構造：":"状態遷移：")+ee+"のタブを閉じる");Mt.onclick=()=>{dn(),X==="concept"?(st=st.filter(ht=>ht!==G),G!=="overview"&&(Ot.get(G)?.remove(),Ot.delete(G)),mt.delete(G),kn.delete(G),In.delete(G),ze.delete(G),cn.delete(G),jt.delete(G),se===X&&K===G&&(st.length?Tt(st.at(-1),!1):Pn())):(rt=rt.filter(ht=>ht!==G),se===X&&yt===G&&(rt.length?Nn(rt.at(-1),!1):Pn())),Dt(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(Mt),j.append(Le)}};y(l,st,"concept"),y(d,rt,"states"),f.replaceChildren();for(const j of vt){const V=Ha(j),X=document.createElement("div");X.className="tab"+(se==="tests"&&j===Te?" active":""),X.dataset.viewKind="tests";const G=document.createElement("button");G.id="spec-tab-"+j,$o(G,"tests",V),G.setAttribute("aria-current",String(se==="tests"&&j===Te)),G.onclick=()=>qt(j);const ee=Wo("テスト仕様："+V+"のタブを閉じる");ee.onclick=()=>{vt=vt.filter(fe=>fe!==j),se==="tests"&&Te===j&&(vt.length?qt(vt.at(-1),!1):Pn()),Dt(),St(),He(),Ze()},X.append(G,ee),f.append(X)}const I=c.querySelector(".tab.active:not([hidden])"),R=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+K:se==="states"?"states:"+yt:se==="tests"?"tests:"+Te:"";I?(R!==Eo&&Vc(c,I),Eo=R):Eo=""}function oc(){innerWidth<=800&&Di(!1)}function St(){const y=w.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,I=w.scrollTop,R=t.business(),j=k.value.trim().toLocaleLowerCase();w.replaceChildren();const V=(J,Ce,ct)=>({kind:"item",id:J,name:Ce,key:ct}),X=(J,Ce,ct)=>({kind:"group",id:J,name:Ce,children:ct}),G=ce(),ee=J=>V(J.key,J.name,"tests:"+J.key),fe=G.filter(J=>J.capability.testSpecification),Le=G.filter(J=>!J.capability.testSpecification),Fe=fe.map(J=>X("tests-function-"+J.key,Ve(J),[V("decision:"+J.key,"可否判定","tests:decision:"+J.key),V(J.key,"処理結果","tests:"+J.key)]));for(const J of R.activities){const Ce=Le.filter(it=>it.activityId===J.id).map(ee),ct=(Jt(J.id).size?"remaining:":"checks:")+J.id;an(J.id)&&Ce.push(V(ct,"その他","tests:"+ct)),Ce.length&&Fe.push(X("tests-activity-"+J.id,J.name,Ce))}const Be=Le.filter(J=>!J.activityId);Be.length&&Fe.push(X("tests-other","その他",Be.map(ee))),Ga()&&Fe.push(V("@unassigned","未割当","tests:@unassigned"));const Mt=[{id:"business",label:"業務設計",items:[V("overview","全体図","business:overview"),X("business-activity","Activity",R.activities.map(J=>V(J.id,J.name,"business:"+J.id))),X("business-object","Object",(R.objects??[]).map(J=>V(J.id,J.name,"object:"+J.id)))]},{id:"states",label:"状態遷移",items:(R.states??[]).map(J=>V(J.id,J.name,"states:"+J.id))},{id:"subsystems",label:"サブシステム",items:N?.model.subsystems.length?[V("landscape","全体図","concept:landscape"),...N.model.subsystems.map(J=>X("subsystem-"+J.id,J.name.replace(/サブシステム$/,""),N.model.reviewGroups.filter(Ce=>Ce.subsystemId===J.id).map(Ce=>V(q(Ce.id),Ce.title,"concept:"+q(Ce.id)))))]:[]},{id:"concept",label:"データ構造",items:We&&H.length?[V("overview","全体図","concept:overview"),X("concept-relations","概念",H.map(J=>V(B(J),Q[J].name,"concept:"+B(J))))]:[]},{id:"tests",label:"テスト仕様",items:R.design?.model&&(G.length||ke().length)?Fe:[]}];let ht=0;const at=(J,Ce,ct)=>{const it=document.createElement("button");it.className="explorer-item"+(ct?" explorer-item-nested":""),it.dataset.explorerKey=J.key,it.textContent=J.name;const Ye=R.views?.find(Je=>Je.key===R.viewKey);return se===(Ce.id==="subsystems"?"concept":Ce.id)&&(["concept","subsystems"].includes(Ce.id)?J.id===K:Ce.id==="states"?J.id===yt:Ce.id==="tests"?J.id===Te:J.key.startsWith("object:")?Ye?.object===J.id:J.id==="overview"?!wt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===J.id)&&it.setAttribute("aria-current","page"),it.disabled=Ce.id==="business"&&!R.key,it.onclick=()=>{h.hidden||t.closeLegacyList(),Ce.id==="business"?J.key.startsWith("object:")?Xa(J.id):ei(J.id==="overview"?void 0:J.id):Ce.id==="concept"||Ce.id==="subsystems"?Tt(J.id):Ce.id==="tests"?qt(J.id):Nn(J.id),oc()},it},$t=(J,Ce,ct,it=!1)=>{const Ye=document.createElement("button"),Wt=j?!Sn.has(J):Ke.has(J);return Ye.className=(ct?"explorer-subparent":"explorer-parent")+(it?" explorer-pending":""),Ye.dataset.explorerKey="group:"+J,Re(Ye,"span",Ce).className="explorer-parent-label",it?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(Wt)),Ye.setAttribute("aria-controls","explorer-"+J),Ye.append(zc(Wt)),Ye.onclick=()=>{j?Sn.has(J)?Sn.delete(J):Sn.add(J):(Ke.has(J)?Ke.delete(J):Ke.add(J),He()),St()},Ye)};for(const J of Mt){const Ce=J.items.flatMap(Je=>{if(Je.kind==="item")return!j||(J.label+" "+Je.name).toLocaleLowerCase().includes(j)?[Je]:[];const ln=j?Je.children.filter(jo=>(J.label+" "+Je.name+" "+jo.name).toLocaleLowerCase().includes(j)):Je.children;return!j||ln.length?[{...Je,children:ln}]:[]});if(j&&!Ce.length)continue;const ct=J.id!=="business"&&!J.items.length,it=document.createElement("section"),Ye=$t(J.id,J.label,!1,ct),Wt=document.createElement("div");Wt.id="explorer-"+J.id,Wt.hidden=ct||(j?Sn.has(J.id):!Ke.has(J.id));for(const Je of Ce){if(Je.kind==="item"){Wt.append(at(Je,J,0)),ht++;continue}const ln=document.createElement("div");ln.id="explorer-"+Je.id,ln.hidden=j?Sn.has(Je.id):!Ke.has(Je.id),Wt.append($t(Je.id,Je.name,!0),ln);for(const jo of Je.children)ln.append(at(jo,J,1)),ht++;!Je.children.length&&!j&&(Re(ln,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ce.length&&!ct&&(Re(Wt,"p","項目がありません。").className="explorer-empty"),it.append(Ye,Wt),w.append(it)}j&&!ht&&(Re(w,"p","該当する項目はありません。").className="explorer-empty"),w.scrollTop=I,y&&Array.from(w.querySelectorAll("[data-explorer-key]")).find(J=>J.dataset.explorerKey===y)?.focus({preventScroll:!0})}function Di(y){_t=y,Ct(),He(),(y?s.querySelector(".shell-heading button"):x).focus({preventScroll:!0})}x.addEventListener("click",y=>{y.preventDefault(),y.stopImmediatePropagation(),Di(!_t)},!0),s.querySelector(".shell-heading button").onclick=()=>Di(!1),k.oninput=()=>{Sn.clear(),St()},s.addEventListener("keydown",y=>{if(y.key==="Escape"&&!y.defaultPrevented&&h.hidden&&(y.preventDefault(),y.stopPropagation(),Di(!1)),(y.key==="ArrowDown"||y.key==="ArrowUp")&&w.contains(document.activeElement)){const I=Array.from(w.querySelectorAll("button")).filter(V=>!V.disabled&&!V.closest("[hidden]")),R=I.indexOf(document.activeElement),j=I[R+(y.key==="ArrowDown"?1:-1)];j&&(y.preventDefault(),j.focus())}}),v.addEventListener("click",y=>{se!=="business"&&(y.preventDefault(),y.stopImmediatePropagation(),(se==="concept"||se==="states"||se==="tests"&&Ee(Te)?.capability.testSpecification)&&(gt.setOpen(!gt.isOpen()),Ct(),He(),Ze(!1)))},!0),E.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Ct(),He(),Ze(!1),v.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Ct(),He(),Ze(!1),v.focus({preventScroll:!0})},window.addEventListener("message",y=>{if(y.origin!==location.origin&&!(location.protocol==="file:"&&y.origin==="null"))return;const I=Array.from(Ot).find(([,j])=>y.source===j.contentWindow);if(!I)return;if(y.data?.type==="alder-concept-rendered"){I[1].contentDocument&&(Qs(I[1].contentDocument),er(I[1].contentDocument));return}if(se!=="concept"||I[0]!==K)return;const R=_(K);if(y.data?.type==="alder-concept-clear-selection"){R&&Js(!0);return}if(y.data?.type==="alder-concept-subsystem"){if(!So(K)?.regions.some(j=>j.id===y.data.id))return;mt.delete(K),kn.delete(K),In.set(K,y.data.id),ji(),Ct(),He();return}if(!(!H.includes(y.data?.id)||R&&!R.concepts[y.data?.id])){if(y.data.type==="alder-concept-open"){Tt(B(y.data.id));return}y.data.type==="alder-concept-select"&&(In.delete(K),mt.set(K,y.data.id),(typeof y.data.viewId=="string"?So(K)?.tables[y.data.viewId]:void 0)?.conceptId===y.data.id?kn.set(K,y.data.viewId):kn.delete(K),innerWidth<=800&&(_t=!1),ji(),Ct(),He())}});function Ks(){const y=getComputedStyle(document.documentElement);for(const I of Ot.values()){const R=I.contentDocument?.documentElement;if(R){R.dataset.theme=document.documentElement.dataset.theme??"light";for(const j of["--bg","--panel","--fg","--line","--subtle","--select"])R.style.setProperty(j,y.getPropertyValue(j))}}}function Ct(){!h.hidden&&se==="business"&&(_t=!0),s.hidden=!_t,x.disabled=!1,x.setAttribute("aria-controls","design-explorer"),x.setAttribute("aria-label","ナビゲーションを開閉"),x.setAttribute("aria-expanded",String(_t));const y=gt.isReady?.()??!0;E.hidden=se!=="concept"||!We||!y||!gt.isOpen();const I=!!Ee(Te)?.capability.testSpecification;m.hidden=!(se==="states"||se==="tests"&&I)||!y||!gt.isOpen(),xi&&se!=="business"&&(xi.hidden=!0),se==="concept"?(v.disabled=!We||!y,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!E.hidden))):se==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):se==="states"||se==="tests"&&I?(v.disabled=!y,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!m.hidden))):(se==="tests"||se==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const R=i.querySelector("#document-actions");R&&(R.hidden=se!=="business");const j=i.querySelector("#document-actions-toggle");j&&se!=="business"&&(j.hidden=!0),Ks(),Oo()}function Oo(){const y=i.getBoundingClientRect().bottom;y>0&&e.style.setProperty("--shell-content-top",y+"px")}if(typeof ResizeObserver<"u"){const y=new ResizeObserver(Oo);y.observe(i),y.observe(e.querySelector("header"))}window.addEventListener("resize",Oo);function Xs(){dn(),Ei=!0;try{const y=new URL(location.href).searchParams;if(se==="concept"&&y.get("view")==="concept"&&y.get("concept")===K&&!ze.has(K)&&ie(K,y.get("dataExample"))&&Xe.set("drawer-overview:"+K,E.querySelector(".concept-drawer-body").scrollTop),We||(jt.clear(),ze.clear(),cn.clear(),st=[],K="overview",A.removeAttribute("src"),A.removeAttribute("srcdoc")),y.get("view")==="concept"){const I=We&&oe.includes(y.get("concept")??"")?y.get("concept"):"landscape",R=y.get("dataExample");We&&_(I)&&y.get("dataView")==="overview"&&!ie(I,R)?(jt.add(I),ze.delete(I)):(jt.delete(I),We&&ie(I,R)?(ze.set(I,R),cn.set(I,R)):ze.delete(I)),Tt(I,!1)}else if(y.get("view")==="states")t.business().states?.some(I=>I.id===y.get("state"))?Nn(y.get("state"),!1):Pn();else if(y.get("view")==="tests"){const I=vo(y.get("spec")??"@overview"),R=y.get("dataExample"),j=Ee(I);j&&R&&j.samples.some(V=>V.id===R)?kt.set(I,R):j&&kt.delete(I),qt(I,!1)}else if(y.get("view")==="empty")It("empty");else if(It("business"),t.business().key){const I=y.get("activity"),R=y.get("object"),j=t.business(),V=j.views?.find(X=>X.key===j.viewKey);I&&j.activities.some(X=>X.id===I)?V?.activity!==I&&t.openActivity(I):R&&j.objects?.some(X=>X.id===R)?V?.object!==R&&t.openObject(R):(wt=!1,(!V||V.activity!==void 0||V.object!==void 0)&&t.openOverview())}Dt(),St()}finally{Ei=!1}}return window.addEventListener("popstate",Xs),{closeBusinessOverview:nc,reopenBusinessOverview(){wt=!1},activateBusiness(){It("business")},businessActivated(){It("business"),Dt(),St(),Ze()},syncChrome:Ct,appendActivityTestLinks(y,I){Za(y,I),ko(y,Fs(I))},openRelatedChecks(y){Ke.add("tests"),qt(y&&Ge(y)?"checks:"+y:"@overview")},syncDocument(){const y=t.business(),I=y.concept,R=!!(Ln&&y.key!==Ln||Oi&&Qn&&y.key&&y.key!==Qn),j=N?.model!==I?.model||N?.business!==I?.business;if((R||j&&N)&&(b.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),E.querySelector(".concept-related-content").replaceChildren(),wt=!1,st=[],rt=[],vt=[],K="overview",yt="",Te="@overview",kt.clear(),Xe.clear(),jt.clear(),ze.clear(),cn.clear(),tc(),se!=="business"&&It("business"),R&&!Oi&&Ze(!1)),j){N=I,Y=I?Bc(I):void 0,W=I?td(I):void 0,Z=I?_c(I):void 0,We=!!I,Q=Y?.tables??{},H=Object.keys(Q);const V=Y?.groups.map(G=>G.id)??[],X=new Set([...Tn,"subsystems"]);if(pe=new Map(V.map(G=>[G,X.has(G)||H.includes(G)?"group:"+G:G])),Se=new Map(H.map(G=>[G,X.has(G)||V.includes(G)?"concept:"+G:G])),ue=new Map([...pe].map(([G,ee])=>[ee,G])),be=new Map([...Se].map(([G,ee])=>[ee,G])),oe=[...Tn,...ue.keys(),...be.keys()],Array.isArray(Oe?.expanded)&&Oe.expandedVersion!==4){Ke.add("subsystems"),Ke.add("concept-relations");for(const G of I?.model.subsystems??[])Ke.add("subsystem-"+G.id)}}if(Ln=y.key,rt=rt.filter(V=>y.states?.some(X=>X.id===V)),se==="business"&&wt&&y.views?.find(V=>V.key===y.viewKey)?.activity===void 0&&y.views?.find(V=>V.key===y.viewKey)?.object===void 0&&Pn(),Oi&&y.key){if(Ja(),Qn===y.key){Array.isArray(Oe?.specs)&&(vt=[...new Set(Oe.specs.filter(V=>typeof V=="string").map(V=>vo(V)))]);for(const[V,X]of Object.entries(Oe?.specExamples??{})){const G=Ee(V);typeof X=="string"&&G?.capability.samples.some(ee=>ee.id===X)&&kt.set(V,X)}}Oi=!1,Xs()}St(),Dt(),Ct(),R&&He()}}}class Ho{tabs=new WeakMap;router;constructor(t=To){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,r){const s=JSON.stringify([i.map(g=>[g.id,g.width,g.height]),o.map(g=>[g.kind,g.from,g.to,g.label]),r]),a=this.tabs.get(t),c=!a||a.design!==n||a.structure!==s,l=new Set(i.filter(g=>{const u=a?.nodes.get(g.id);return!u||u.x!==g.x||u.y!==g.y}).map(g=>g.id)),d=new Set(i.map(g=>g.id)),f=c?new Array(o.length):a.routes.slice();if(o.forEach((g,u)=>{!c&&!l.has(g.from)&&!l.has(g.to)||(f[u]=d.has(g.from)&&d.has(g.to)?this.router({from:g.from,to:g.to,index:u,nodes:i,kind:g.kind,matrix:r?.[u],labels:r?.[u]?[]:[...f.flatMap((b,m)=>b&&m<u?[{id:String(m),x:b.label[0]-Math.max(30,o[m].label.length*12)/2,y:b.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:r?.[u]?[]:f.flatMap((b,m)=>b&&m<u?[b.points]:[]),labelWidth:Math.max(30,g.label.length*12),labelHeight:18}):void 0)}),r){const g=[],u=new Map,b=f.map((m,p)=>p).sort((m,p)=>Number(r[m].returning)-Number(r[p].returning));for(const m of b){const p=f[m];if(!p)continue;const h=i.find(A=>A.id===o[m].from),x=Math.max(30,o[m].label.length*12),v=r[m].returning?[Math.max(...p.points.map(A=>A[0]))+8+x/2,p.points[0][1]]:[h.x+h.width*.125+8+x/2,uc(h.y+h.height,r[m].captionLane*Fr)+9],k=Br(o[m],m,r[m]),w=u.get(k)??qo(v,x,18,i,g);(w[0]!==p.label[0]||w[1]!==p.label[1])&&(f[m]={...p,label:w}),u.has(k)||(u.set(k,w),g.push({id:String(m),x:w[0]-x/2,y:w[1]-9,width:x,height:18}))}}return this.tabs.set(t,{design:n,structure:s,nodes:new Map(i.map(g=>[g.id,{...g}])),routes:f}),f}}function ul(e,t,n,i){const o=(f,g,u)=>(g[0]-f[0])*(u[1]-f[1])-(g[1]-f[1])*(u[0]-f[0]),r=o(e,t,n),s=o(e,t,i),a=o(n,i,e),c=o(n,i,t),l=1e-6;if(r*s<-l&&a*c<-l)return!0;if(Math.max(Math.abs(r),Math.abs(s),Math.abs(a),Math.abs(c))>l)return!1;const d=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[d],t[d]),Math.max(n[d],i[d]))-Math.max(Math.min(e[d],t[d]),Math.min(n[d],i[d]))>.1}function pl(e,t,n,i,o=[]){const r=e.x+e.width,s=24,a=e.y+e.height,c=r-8-(2*(n.count-n.index)-1)*s,l=t.filter(x=>x.id!==e.id);let d;for(const x of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const k=[c+x,a],w=[k[0]+s,a];if(k[0]<e.x+8||w[0]>r-8)continue;const A=a+n.depth+v,E=Math.min(12,(w[0]-k[0])/2,(A-a)/2),O=[k];let $=`M${k}`;const D=W=>{$+=` L${W}`,O.push(W)},L=(W,Z)=>{const Q=O.at(-1);$+=` Q${W} ${Z}`;for(let H=1;H<=4;H++){const oe=H/4,ue=1-oe;O.push([ue*ue*Q[0]+2*ue*oe*W[0]+oe*oe*Z[0],ue*ue*Q[1]+2*ue*oe*W[1]+oe*oe*Z[1]])}};D([k[0],A-E]),L([k[0],A],[k[0]+E,A]),D([w[0]-E,A]),L([w[0],A],[w[0],A-E]),D(w);const N=pc(O,l,.3),Y=o.filter(W=>O.slice(1).some((Z,Q)=>W.slice(1).some((H,oe)=>ul(O[Q],Z,W[oe],H)))).length;if((!d||N<d.collisions||N===d.collisions&&Y<d.wireCollisions)&&(d={path:$,points:O,collisions:N,wireCollisions:Y,low:A,extra:v,shift:x}),N===0&&Y===0)break}const{path:f,points:g,collisions:u,wireCollisions:b,low:m,extra:p,shift:h}=d;return{path:f,points:g,label:[Math.max(r+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...g.map(x=>x[0])),bottom:Math.max(...g.map(x=>x[1]))},collisions:u+b,rerouted:p>0||h!==0,fallback:u+b>0}}function fl(e,t=ls()){const n="http://www.w3.org/2000/svg",i=(q,B={})=>{const _=document.createElementNS(n,q);for(const[ge,ie]of Object.entries(B))_.setAttribute(ge,ie);return _},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},r=e.transitions.map(q=>[q]),s=[...new Set(["@new",...e.states,...r.map(q=>q[0].to)])],a={nodes:s.map(q=>({id:q,type:"business",name:o[q]??q,scope:!0})),relations:r.map(([q])=>({kind:q.path==="exception"?"business-exception":"input",from:q.from,to:q.to,label:q.id+"："+q.activity+"："+q.condition}))},c=fs(a,s),l=q=>{const B=Array.from(q);return Array.from({length:Math.ceil(B.length/28)},(_,ge)=>B.slice(ge*28,(ge+1)*28).join(""))},d=r.map(([q])=>({from:q.from,activity:q.activity,rows:[q],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[q,B]of d.entries()){const _=B.rows[0],ge=e.transitions.filter(ce=>ce.from===_.from&&(ce.activityId??ce.activity)===(_.activityId??_.activity)&&ce.path===_.path&&(_.path!=="exception"||(ce.exception??"例外名未定義")===(_.exception??"例外名未定義"))),ie=ge.map(ce=>(ce.conditionLabel??ce.condition).trim().replace(/\s+/g," ")),De=new Set(ie).size===ge.length?_.conditionLabel??_.condition:_.condition,ke=[_.path==="exception"?"例外："+(_.exception??"例外名未定義"):"",...ge.length>1||_.path==="normal"&&_.conditionLabel?[De]:[]].filter(Boolean).join("：");B.lines=l(B.activity+(ke?"（"+ke+"）":"")),B.lineRows=B.lines.map(()=>B.rows),B.width=Math.max(...B.lines.map(ce=>Array.from(ce).length*14)),B.height=B.lines.length*18,c.wires[q].returning||(B.offset=f.has(B.from)?f.get(B.from)+8:0,f.set(B.from,B.offset+B.height))}const g=new Map;r.forEach(([q],B)=>{if(q.from===q.to){const _=g.get(q.from)??[];_.push(B),g.set(q.from,_)}});const u=new Map,b=new Map;for(const[q,B]of g){let _=0;for(const ie of[...B].reverse())u.set(ie,{leader:B[0],index:0,count:1,depth:0,offset:_}),_+=d[ie].height+8;const ge=24+Math.max(0,_-8)+8;b.set(q,ge);for(const ie of B)u.get(ie).depth=ge}const m=q=>44,p=s.slice().sort((q,B)=>c.positions[q][1]-c.positions[B][1]);let h=Math.max(40,...d.map((q,B)=>c.wires[B].returning&&q.from===p[0]?16+q.height/2-44*(c.wires[B].fromPort??.5):40));const x=new Map;for(const q of p){const B=m(),_=(f.get(q)??0)+(b.get(q)??0);x.set(q,h),h+=fc(B,_)}const v=s.map(q=>({id:q,x:t.positions.get(q)?.[0]??c.positions[q][0],y:t.positions.get(q)?.[1]??x.get(q),width:Math.max(104,Array.from(o[q]??q).length*14+32),height:m()})),k=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),w=i("title");w.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(s.includes("@none")?"作成なしはこの操作の処理結果。":"")+(s.includes("@unknown")?"未決は設計課題。":""),k.append(w),k.append(us("state-transition-"));const A=new Map,E=[],O=[];let $=t.selected;const D=q=>{$=q,t.selected=q;const B=Ui(e.transitions,$);for(const[ie,De]of A)De.setAttribute("class","node graph-shape state-shape"+B.nodeClasses(ie)),De.setAttribute("aria-pressed",String(ie===$));E.forEach(({element:ie,rows:De})=>{const Pe=De[0].from===De[0].to;ie.setAttribute("class","edge"+(Pe?" state-self-loop":De[0].path==="exception"?" exception":"")+B.labelClasses(De)),ie.setAttribute("marker-end","url(#state-transition-"+(De.some(B.related)?"related-arrow":"arrow")+")")});for(const ie of O)ie.element.setAttribute("class","state-caption-line"+B.labelClasses(ie.rows));k.querySelectorAll("[data-exception-paint]").forEach(ie=>ie.remove());const _=Array.from(k.children).find(ie=>ie.matches(".state-diagram-edge-label,[data-state]"))??null,ge=[...E].sort((ie,De)=>Number(ie.rows.some(B.related))-Number(De.rows.some(B.related)));for(const{element:ie}of ge)if(k.insertBefore(ie,_),ie.classList.contains("exception")||ie.classList.contains("state-self-loop")){const De=k.children.length;ps(k,ie,{path:ie.getAttribute("d")},{"data-transitions":ie.getAttribute("data-transitions")});for(const Pe of Array.from(k.children).slice(De))k.insertBefore(Pe,_)}k.querySelectorAll(".state-diagram-edge-label").forEach(ie=>k.append(ie))};k.addEventListener("click",q=>{q.target===k&&D()}),k.addEventListener("keydown",q=>{q.key==="Escape"&&(q.preventDefault(),D())});const L=c.wires.map((q,B)=>({...q,captionLane:(d[B].offset+(b.get(d[B].from)??0))/Fr})),N=a.relations.map((q,B)=>({...q,label:String(B).padEnd(Math.ceil(d[B].width/12),"x")})),Y=[...u].map(([q,B])=>{const _=v.find(ie=>ie.id===r[q][0].from),ge=d[q];return{x:_.x+_.width+8,y:_.y+_.height+24+B.offset,width:ge.width,height:ge.height}});let W=new Ho().update({},e,v,N,L);for(let q=0;q<=Y.length;q++){let B=!1,_=0;if(W.forEach((ge,ie)=>{if(!ge||u.has(ie)||!L[ie].returning)return;let De=0;for(const Pe of Y)for(let ke=1;ke<ge.points.length;ke++){const ce=ge.points[ke-1],Ee=ge.points[ke];if(Math.abs(ce[0]-Ee[0])>1e-7||Math.abs(ce[1]-Ee[1])<2)continue;const Ve=ce[0];if(Ve<Pe.x-4||Ve>Pe.x+Pe.width+4||Math.max(ce[1],Ee[1])<Pe.y-4||Math.min(ce[1],Ee[1])>Pe.y+Pe.height+4)continue;const Ge=Pe.x+Pe.width+12-Ve;Ge>0&&(De=Math.max(De,Ge))}De&&(L[ie]={...L[ie],returnLane:(L[ie].returnLane??0)+Math.ceil(De/16)+_++},B=!0)}),!B)break;W=new Ho().update({},e,v,N,L)}const Z=W.flatMap((q,B)=>q&&!u.has(B)?[q.points]:[]),Q=new Map,H=W.map((q,B)=>{const _=u.get(B);if(!_)return q;const ge=r[B][0].from,ie=v.find(Ge=>Ge.id===ge),De=W.flatMap((Ge,Jt)=>Ge&&!u.has(Jt)?[Ge.points]:[]),Pe=Math.max(30,N[B].label.length*12),ke=d[B];let ce=Q.get(_.leader);ce||(ce=pl(ie,v,{..._,labelLeft:ie.x+ie.width+8},Pe,Z),Q.set(_.leader,ce),Z.push(ce.points));const Ee=De.flatMap((Ge,Jt)=>Ge.slice(1).map((wn,an)=>({id:`${Jt}:${an}`,x:Math.min(Ge[an][0],wn[0])-2,y:Math.min(Ge[an][1],wn[1])-2,width:Math.abs(Ge[an][0]-wn[0])+4,height:Math.abs(Ge[an][1]-wn[1])+4}))),Ve=qo([ie.x+ie.width+8+ke.width/2,ie.y+ie.height+24+_.offset+ke.height/2],ke.width,ke.height,[...v,...Ee]);return{...ce,label:[Ve[0]-ke.width/2+Pe/2,Ve[1]]}}),oe=new Array(r.length),ue=[],be=r.map((q,B)=>B).sort((q,B)=>Number(L[q].returning)-Number(L[B].returning));for(const q of be){const B=H[q],_=d[q],ge=Math.max(30,N[q].label.length*12);let ie=[B.label[0]-ge/2+_.width/2,B.label[1]+(L[q].returning?0:_.height/2-9)];const De=v.find(ce=>ce.id===r[q][0].from),Pe=v.find(ce=>ce.id===r[q][0].to);if(!u.has(q)&&L[q].returning&&Pe&&Pe.y>De.y){const ce=B.points.slice(1).map((Ee,Ve)=>[B.points[Ve],Ee]).filter(([Ee,Ve])=>Math.abs(Ee[0]-Ve[0])<.01&&Ve[1]-Ee[1]>24).sort(([Ee,Ve],[Ge,Jt])=>Jt[1]-Ge[1]-(Ve[1]-Ee[1]))[0];if(ce){const[Ee,Ve]=ce;ie=[Ee[0]+8+_.width/2,Ee[1]+Math.min(24+_.height/2,(Ve[1]-Ee[1])/2)]}}const ke=qo(ie,_.width,_.height,v,ue);oe[q]=ke,ue.push({id:String(q),x:ke[0]-_.width/2,y:ke[1]-_.height/2,width:_.width,height:_.height})}let pe=Math.max(...v.map(q=>q.x+q.width))+40,Se=Math.max(...v.map(q=>q.y+q.height))+40;r.forEach((q,B)=>{const _=u.get(B);if(_&&_.leader!==B)return;const ge=_?r.flatMap((ce,Ee)=>u.get(Ee)?.leader===B?ce:[]):q,ie=ge[0],De=H[B],Pe=i("path",{d:De.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":ge.map(ce=>ce.id).join(" ")});(_||ie.path==="exception")&&Pe.setAttribute("stroke-dasharray","6 5");const ke=i("title");ke.textContent=ge.map(ce=>`${ce.id} ${ce.activity} / ${ce.path==="normal"?"通常":"例外："+(ce.exception??"例外名未定義")}：${ce.condition}`).join(" / "),Pe.append(ke),k.append(Pe),E.push({element:Pe,rows:ge}),pe=Math.max(pe,De.bounds.right+40),Se=Math.max(Se,De.bounds.bottom+40)});for(const[q,B]of d.entries()){const _=oe[q],ge=_[0]-B.width/2,ie=_[1]-B.height/2+14;k.append(i("rect",{x:String(ge),y:String(ie-14),width:String(B.width),height:String(B.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const De=i("text",{x:String(ge),y:String(ie),class:"state-diagram-edge-label","data-activity":B.activity,"data-transition-id":B.rows[0].id,"aria-label":B.lines.join("")});B.lines.forEach((Pe,ke)=>{const ce=i("tspan",{x:String(ge),dy:ke?"18":"0","font-size":"14","font-weight":"600"});ce.textContent=Pe,ce.setAttribute("data-transitions",B.lineRows[ke].map(Ee=>Ee.id).join(" ")),O.push({element:ce,rows:B.lineRows[ke]}),De.append(ce)}),k.append(De),pe=Math.max(pe,ge+B.width+24),Se=Math.max(Se,ie+B.height+24)}for(const q of v){const B=q.id.startsWith("@"),_=i("g",{role:"button",tabindex:"0","aria-label":o[q.id]??q.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":q.id,"data-node":q.id});_.append(Ur(document,q,B)),_.append(i("rect",{x:String(q.x),y:String(q.y),width:String(q.width),height:String(q.height),rx:B?"20":"8",class:B?"state-diagram-node state-note":"state-diagram-node"}));const ge=i("text",{x:String(q.x+q.width/2),y:String(q.y+q.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(ge.textContent=o[q.id]??q.id,_.append(ge),B&&q.id!=="@new"){const ie=i("text",{x:String(q.x+q.width/2),y:String(q.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});ie.textContent=q.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",_.append(ie)}_.addEventListener("click",()=>D(q.id)),_.addEventListener("keydown",ie=>{(ie.key==="Enter"||ie.key===" ")&&(ie.preventDefault(),D(q.id))}),A.set(q.id,_),k.append(_)}return D(t.selected),k.setAttribute("viewBox",`0 0 ${pe} ${Se}`),k.style.minWidth=`${pe}px`,k}const lr=new WeakMap;function ml(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const r=(m,p,h=o)=>{const x=document.createElement(m);return x.textContent=p,h.append(x),x};if(i.error)return r("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const s=i.model;for(const m of s.transitions){if(!e.graph.nodes.some(p=>p.id===m.activity&&p.type==="business"))return r("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const p=e.model?.business.exceptions?.find(h=>h.id===m.exceptionId);if(!p||p.activityId!==m.activity)return r("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const a=lr.get(e)??new Map;lr.set(e,a);const c=a.get(t)??ls();a.set(t,c);const l={...s,transitions:s.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(p=>p.id===m.activity)?.name??m.activity}))};o.append(zr(document,m=>fl(l,m),c));const d=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},g=document.createElement("details");r("summary",`操作の詳細（${s.transitions.length}）`,g);const u=document.createElement("ol");g.append(u),o.append(g);for(const m of s.transitions){const p=document.createElement("li");p.dataset.transition=m.id,r("h3",`${m.id} · ${d(m.from)} → ${d(m.to)}`,p),m.path==="exception"&&r("p","例外名："+(m.exception??"未定義"),p),r("p",`${f[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,p);const h=e.graph.nodes.find(x=>x.id===m.activity&&x.type==="business");if(h){const x=document.createElement("button");x.type="button",x.textContent=h.name,x.onclick=()=>n(h.id),p.append(x)}else r("p","要確認：根拠Activityが見つかりません — "+m.activity,p);r("p","条件："+m.condition,p),r("p",m.note,p),r("p","根拠："+m.evidence,p),u.append(p)}s.transitions.length||r("p","明示された操作はありません。");const b=document.createElement("details");return r("summary","宣言の出典",b),r("p",s.source,b),o.append(b),o}const ur=64,hl=96,bl=260,pr=40,gl=4;function yl(e,t,n=!0){const{nodes:i,previous:o,children:r,parents:s,forwardRelations:a,feedbackRelations:c,exceptionRelations:l}=mc(e,t),d=s.map(w=>w.length),f=i.map(()=>0),g=i.flatMap((w,A)=>d[A]===0?[A]:[]);for(let w=0;w<g.length;w++)for(const A of r[g[w]])f[A]=Math.max(f[A],f[g[w]]+1),--d[A]===0&&g.push(A);const u=Array.from({length:f.reduce((w,A)=>Math.max(w,A),0)+1},()=>[]);i.forEach((w,A)=>u[f[A]].push(A));const b=i.map(()=>0),m=w=>w.forEach((A,E)=>b[A]=E);u.forEach(m);for(let w=0;w<gl;w++){const A=w%2?[...u].reverse():u;for(const E of A){const O=new Map(E.map($=>{const D=w%2?r[$]:s[$];return[$,D.length?D.reduce((L,N)=>L+b[N],0)/D.length:b[$]]}));E.sort(($,D)=>O.get($)-O.get(D)||$-D),m(E)}}const p=u[0].filter(w=>i[w].type==="object"&&o[w].length===0&&r[w].length>0);if(n&&p.length>1){const w=new Set(p),A=u[0].filter(E=>!w.has(E));u.splice(0,1,...p.map((E,O)=>O===0?[...A,E]:[E]))}const h=Object.create(null),x=i.map(()=>0),v=[],k=Math.ceil(bl/ur)-1;for(let w=0;w<u.length;w++){const A=new Map;for(const $ of v)for(const D of $)A.set(D,D+1);const E=$=>{let D=$;for(;A.has(D);)D=A.get(D);let L=$;for(;A.has(L);){const N=A.get(L);A.set(L,D),L=N}return D},O=[];for(const $ of u[w]){let D=w;for(const N of s[$])D=Math.max(D,x[N]+1);const L=E(D);x[$]=L,A.set(L,L+1),O.push(L),h[i[$].id]=[pr+w*ur,pr+L*hl]}v.push(O),v.length>k&&v.shift()}return{positions:h,forwardRelations:a,feedbackRelations:c,exceptionRelations:l}}function vl(e,t){return Gr(e)?fs(e,t).positions:yl(e,t).positions}const fr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function ca(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>fr(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const r=fr(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(r)return r}return 0})}}function da(e){const t=ca(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([r,s])=>[i.get(r),s])))}}function la(e){const t=da(e);return t.restore(vl(t.graph,t.order))}function wl(e){const t=da(e),n=fs(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function ua(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function kl(e,t){if(!e)return!1;const n=r=>"format"in r?!!r.document?.handle||r.recovery.some(s=>s.handle!==void 0):r.tabs.some(s=>s.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(r,s){if(Object.is(r,s))return!0;if(!r||!s||typeof r!="object"||typeof s!="object"||i.has(r)||i.has(s))return!1;const a=u=>Array.isArray(u)||Object.getPrototypeOf(u)===null||Object.getPrototypeOf(u)?.constructor?.name==="Object";if(!a(r)||!a(s)||Array.isArray(r)!==Array.isArray(s)||Array.isArray(r)&&r.length!==s.length)return!1;i.add(r),i.add(s);const c=r,l=s,d=Object.keys(c),f=Object.keys(l),g=d.length===f.length&&d.every(u=>Object.hasOwn(l,u)&&o(c[u],l[u]));return i.delete(r),i.delete(s),g}return o(e,t)}function Xn(e,t){const n=new Set(t.graph.nodes.map(r=>r.id)),i=Object.create(null);for(const[r,s]of Object.entries(e.positions))n.has(r)&&(i[r]=[...s]);const o=t.graph.nodes.filter(r=>!i[r.id]);if(o.length){const r=la(t),s=Object.values(i);for(const a of o){const c=[...r[a.id]];for(;s.some(l=>Math.abs(l[0]-c[0])<280&&Math.abs(l[1]-c[1])<88);)c[1]+=180;i[a.id]=c,s.push(c)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(r=>n.has(r)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function pa(){return new Promise((e,t)=>{const n=indexedDB.open(ua(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class Is extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Bi;function fa(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Il(e){const t=Bi;if(t===void 0)throw Error("Session has not been loaded");const n=await pa();try{await new Promise((i,o)=>{const r=n.transaction("session","readwrite"),s=r.objectStore("session"),a=s.get("generation"),c=s.get("current"),l=s.get("readonly-legacy");let d,f;l.onsuccess=()=>{try{const g=fa(a.result);if(kl(c.result,e)){f=g;return}if(g!==t)throw new Is;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");l.result===void 0&&xl(c.result)&&s.put(c.result,"readonly-legacy"),s.put(e,"current"),s.put(f,"generation")}catch(g){d=g,r.abort()}},r.oncomplete=()=>{Bi=f,i()},r.onerror=()=>o(d??r.error??Error("Session save failed")),r.onabort=()=>o(d??r.error??Error("Session save aborted"))})}finally{n.close()}}async function Sl(){Bi=void 0;const e=await pa();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),r=o.get("current"),s=o.get("generation");i.oncomplete=()=>{try{Bi=fa(s.result),t(r.result)}catch(a){n(a)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function xl(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const mr=new WeakMap;function Al(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(d=>d.id===t&&d.type==="business"))throw Error("Unknown Activity: "+t);let i=mr.get(e);i||(i=new Map,mr.set(e,i));const o=i.get(t);if(o)return o;const r=new Set(e.graph.nodes.filter(d=>d.type==="object").map(d=>d.id)),s=new Set(e.graph.nodes.filter(d=>d.type==="business").map(d=>d.id)),a=e.graph.relations.filter(d=>d.kind==="input"&&d.to===t&&r.has(d.from)||d.kind==="output"&&d.from===t&&r.has(d.to)||d.kind==="business-exception"&&(d.from===t&&s.has(d.to)||d.to===t&&s.has(d.from))),c=new Set([t,...a.flatMap(d=>[d.from,d.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(d=>c.has(d.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(d=>d.type==="business").map(d=>d.id)).filter(d=>c.has(d))};return i.set(t,l),l}const hr=new WeakMap;function El(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let i=hr.get(e);i||(i=new Map,hr.set(e,i));const o=t,r=i.get(o);if(r)return r;const s=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),a=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),c=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&a.has(f.to)||f.kind==="output"&&f.to===t&&a.has(f.from)||f.kind==="object-exception"&&(f.from===t&&s.has(f.to)||f.to===t&&s.has(f.from))),l=new Set([t,...c.flatMap(f=>[f.from,f.to])]),d={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>l.has(f.id)),relations:c},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>l.has(f))};return i.set(o,d),d}const ma=new WeakMap;function tn(e){return ma.get(e)}const ha=["design","checks","source","draft","edited","handle"];function Ol(e){return{key:e.key,name:e.name,...Object.fromEntries(ha.map(t=>[t,e[t]]))}}function Ut(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:a,canvasOrigin:c,scroll:l,zoom:d}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:a,canvasOrigin:c,scroll:l,zoom:d,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function no(e,t){const n=t;ma.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of ha)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Gi(e){return e.activity}function Hi(e){return e.object}function li(e){return e.activity??e.object}function io(e){return e.object===void 0?Al(e.design,e.activity):El(e.design,e.object)}function oo(e){const t=io(e),n=Xn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function Vt(e,t=[],n,i){const o=n??(e.tabs[0]?Ol(e.tabs[0]):void 0),r=o?(i??[e.tabs[0]?Ut(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(g=>{const u=no(o,g);return Object.assign(g,Ut(oo(u))),u}):[],{dark:s,drawer:a,width:c,preferWrite:l,nodeDrawer:d,sampleLayout:f}=e;return{dark:s,drawer:a,width:c,preferWrite:l,nodeDrawer:d,sampleLayout:f,document:o,tabs:r,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(g=>g.source?.kind==="url").map(g=>({url:g.source.url,name:g.name}))].filter((g,u,b)=>b.findIndex(m=>m.url===g.url)===u),legacyViews:e.legacyViews,active:r.some(g=>g.key===e.active)?e.active:r[0]?.key}}function Ss(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Ut),recovery:n}}function Ci(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function jl(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!Nl(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const d of o.views)Ci(d)}const{format:r,views:s,document:a,recovery:c,...l}=e;for(const d of s)Ci(d);for(const d of c)Ci(d);if(!!a!=!!s.length||new Set(s.map(d=>d.key)).size!==s.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(g=>g.group!==void 0&&typeof g.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(g=>g.group===void 0).length!==1))throw Error("Invalid legacy views");const d=i.views[0],f=d?{...d}:void 0;return f&&delete f.group,Vt({...l,tabs:[],active:f?.key,legacyViews:{documentKey:a?.key,views:structuredClone(i.views),active:i.active}},c,a,f?[f]:[])}if(s.length&&(s[0].activity!==void 0||s[0].object!==void 0||s.filter(d=>d.activity===void 0&&d.object===void 0).length!==1)||new Set(s.filter(d=>d.activity!==void 0).map(d=>d.activity)).size!==s.filter(d=>d.activity!==void 0).length||new Set(s.filter(d=>d.object!==void 0).map(d=>d.object)).size!==s.filter(d=>d.object!==void 0).length)throw Error("Invalid workspace views");if(a&&s.some(d=>d.activity!==void 0&&!a.design.graph.nodes.some(f=>f.type==="business"&&f.id===d.activity)))throw Error("Unknown saved Activity");if(a&&s.some(d=>d.object!==void 0&&!a.design.graph.nodes.some(f=>f.type==="object"&&f.id===d.object)))throw Error("Unknown saved Object");return Vt({...l,tabs:[]},c,a,s)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)Ci(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return Vt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Dl(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return Vt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function Cl(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},r=new Set(t.graph.nodes.filter(c=>c.type==="business").map(c=>c.id)),s=new Set(t.graph.nodes.filter(c=>c.type==="object").map(c=>c.id)),a=e.tabs.filter(c=>(c.activity===void 0||r.has(c.activity))&&(c.object===void 0||s.has(c.object))).map(Ut);return Vt(e,e.recovery,o,a)}function Ml(e,t){const n=e.tabs.find(o=>Gi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=no(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Rl(e,t){const n=e.tabs.find(o=>Hi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=no(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Ll(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(r=>r.key===i.key);return Ut(o?oo(no(e.document,{...Ut(i),...Ut(o)})):i)});return Vt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Nl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function so(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=a=>a instanceof HTMLButtonElement&&a.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(a=>!a.hidden&&!i(a));for(const a of Array.from(t.querySelectorAll("button,a[href]")))a.setAttribute("role","menuitem");const r=(a=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),a&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},s=(a=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const c=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=c.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(a?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?s():r(!0),e.onkeydown=a=>{(a.key==="ArrowDown"||a.key==="ArrowUp")&&(a.preventDefault(),s(a.key==="ArrowUp"))},t.addEventListener("keydown",a=>{const c=a,l=o(),d=l.indexOf(document.activeElement);let f;c.key==="ArrowDown"&&(f=(d+1)%l.length),c.key==="ArrowUp"&&(f=(d+l.length-1)%l.length),c.key==="Home"&&(f=0),c.key==="End"&&(f=l.length-1),f!==void 0&&(c.preventDefault(),l[f]?.focus())}),t.addEventListener("click",a=>{const c=a.target.closest("button,a[href]");!t.hidden&&c&&!i(c)&&r(!0)},!0),document.addEventListener("keydown",a=>{!t.hidden&&a.key==="Escape"&&(a.preventDefault(),a.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",a=>{!t.hidden&&!t.contains(a.target)&&!e.contains(a.target)&&r()}),document.addEventListener("focusin",a=>{!t.hidden&&!t.contains(a.target)&&a.target!==e&&r()}),window.addEventListener("resize",()=>r()),{close:r}}const Pl=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Tl={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function ql(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),r=v=>o.slice(v.line+1,i.find(k=>k.line>v.line&&k.level<=v.level)?.line??o.length).join(`
`).trim(),s=new Map(i.filter(v=>v.level===3&&t.some(k=>k.title===v.title)).map(v=>[v.title,v])),a=v=>{const k=t.find(w=>w.title===v.title);return k?"legacy-check:"+k.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},c=new Map,l=(v,k)=>{c.has(v)?c.get(v)!==k&&c.set(v,void 0):c.set(v,k)};for(const v of i){const k=a(v);l(Pl(v.title),k);const w=t.find(A=>A.title===v.title);w&&l(w.id.toLowerCase(),k)}for(const[v,k]of o.entries()){const w=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(k);if(w){const A=i.find(E=>E.line>v);A&&l(w[1].toLowerCase(),a(A))}}const d=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const k=[];let w=0;for(const A of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){A.index>w&&k.push({kind:"markdown",value:v.slice(w,A.index)});let E=A[2].slice(1);try{E=decodeURIComponent(E)}catch{}const O=A[2].startsWith("#")?c.get(E.toLowerCase()):void 0;k.push(O?{kind:"reference",targetId:O,label:A[1]}:{kind:"link",uri:A[2],label:A[1]}),w=A.index+A[0].length}return w<v.length&&k.push({kind:"markdown",value:v.slice(w)}),k},f=[],g=[],u=[],b=new Map;for(const v of i.filter(k=>k.level===2)){if(v.title==="業務一覧")continue;const k=a(v),w=i.find(A=>A.line>v.line)?.line??o.length;f.push({id:k,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:d(o.slice(v.line+1,w).join(`
`).trim())}),b.set(v.title,k)}const m="legacy-unassigned",p=v=>{const k=i.filter(w=>w.line<v.line&&w.level===2).at(-1);return k?b.get(k.title):void 0},h=t.map(v=>{const k=s.get(v.title),w=p(k)??m,A=Object.create(null),E=[];let O={name:"補足",value:""},$="";for(const L of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const N=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(L);N&&($?N[1][0]===$[0]&&N[1].length>=$.length&&!N[2].trim()&&($=""):$=N[1]);const Y=$?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(L);Y?(O.value.trim()&&E.push(O),O={name:Y[1],value:Y[2]}):O.value+=`
`+L}O.value.trim()&&E.push(O);let D="";for(const L of E)if(L.name==="人間レビュー状態"){D=L.value.split(`
`)[0].trim();const N=L.value.split(`
`).slice(1).join(`
`).trim();N&&(A.補足=[...A.補足??[],...d(N)])}else{const N=Tl[L.name]??L.name;A[N]=[...A[N]??[],...d(L.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:D,sectionId:w,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(L=>L[1]).join(`
`),fields:A}});h.some(v=>v.sectionId===m)&&f.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const v of i.filter(k=>k.level===3&&!s.has(k.title))){const k=p(v);k?g.push({id:a(v),sectionId:k,title:v.title,blocks:[{kind:"prose",content:d(r(v))}]}):u.push({id:a(v),title:v.title,content:d(r(v))})}const x=i.find(v=>v.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:d(o.slice(/^# /.test(o[0])?1:0,x).join(`
`)),sections:f,items:h,index:Object.entries(n).map(([v,k])=>{const w=o.find(A=>A.startsWith("|")&&A.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:w[1]?.trim()??"",connections:w[2]?.trim()??"",checkIds:k.map(A=>"legacy-check:"+A)}}),guarantees:g,examples:[],notes:u}}function Co(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...r]=n;if(!i||!o)return;r[0]==="refs"&&["heads","tags"].includes(r[1])&&r.splice(0,2);const[s,...a]=r;return!s||!a.length||!["main","master"].includes(s)&&!/^[a-f0-9]{40}$/i.test(s)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${a.join("/")}`,ref:s}}catch{return}}function Jo(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function $l(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((f,g)=>{const u=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(u){o?u[1][0]===o[0]&&u[1].length>=o.length&&!u[2].trim()&&(o=""):o=u[1];return}if(!o){t.add(g);const b=/^(#{1,6}) (.+)$/.exec(f);b&&i.push({line:g,level:b[1].length,title:b[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const r=i.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!r.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const s=new Set,a=r.map(f=>{const g=i.find(m=>m.line>f.line&&m.level<=3)?.line??n.length,u=f.title.split(/\s/)[0];if(s.has(u))throw Error("Check IDが重複しています: "+u);s.add(u);const b=n.slice(f.line+1,g).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(b))throw Error(u+" の"+m+"が見つかりません。");return{id:u,title:f.title,body:b,activities:[]}}),c=Object.create(null);let l=!1;for(const[f,g]of n.entries()){if(!t.has(f)||(/^## /.test(g)&&(l=/^## 業務一覧\s*$/.test(g)),!l||!/^\|/.test(g)))continue;const u=g.split("|").slice(1,-1);if(u.length!==4)continue;const b=Jo(u[0])[0]?.label;if(!b)continue;if(Object.hasOwn(c,b))throw Error("業務一覧のActivityが重複しています: "+b);const m=Jo(u[3]);if(m.some(h=>h.url.toLowerCase()!=="#"+h.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+b);const p=m.map(h=>h.label);if(!p.length||p.some(h=>!s.has(h)))throw Error("業務一覧のCheck ID参照を確認できません: "+b);c[b]=[...new Set(p)];for(const h of a)p.includes(h.id)&&h.activities.push(b)}if(!Object.keys(c).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const d=i.find(f=>f.level===2)?.line??r[0].line;return{markdown:e,intro:n.slice(0,d).join(`
`),items:a,index:c,model:ql(e,a,c,i)}}function ui(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function pi(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),i=Object.keys(e.index).filter(l=>!n.has(l)),o=Object.keys(e.index).filter(l=>n.has(l)),r=(l,d)=>({state:l,reason:d,unknown:i});if(!o.length)return r("mismatch","業務一覧に、この業務設計書のActivityがありません。");const s=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),a=Jo(s).map(l=>Co(l.url)).filter(l=>l!==void 0),c=t.source?.kind==="url"?Co(t.source.url):t.source?.kind==="sample"?Co("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return c&&a.length&&a.some(l=>l.document!==c.document)?r("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?r("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!c||!a.length?r("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||a.some(l=>l.ref!==c.ref)||!/^[a-f0-9]{40}$/i.test(c.ref)?r("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):r("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const br=new WeakMap;function Hn(e){let t=br.get(e);return t||(t=$l(e.markdown),br.set(e,t)),t}const Mo=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Mi(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function Wl(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function zl(e){if(!e.checks)return[];const t=Hn(e.checks),n=pi(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===ui(e)?[t.model]:[]}function Ul(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&Mi(o,"関連Checkを読み込み・保存しています…"),t.error){const a=document.createElement("p");a.className="check-warning",a.setAttribute("role","alert"),a.textContent=t.error,o.append(a)}let r,s=!1;if(e.checks){r=Hn(e.checks);const a=pi(r,e);if(s=a.state==="matched"||a.state==="unverified"&&e.checks.confirmedFor===ui(e),!s&&(Mi(o,"現在のBDとの対応を再確認してください。"+a.reason),a.state==="unverified")){const c=Mo("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));c.disabled=n.disabled||t.busy===!0,o.append(c)}}if(t.candidate){const a=t.candidate,c=Hn(a),l=pi(c,e),d=document.createElement("section");d.className="check-candidate",d.id="check-candidate",Mi(d,"一致未確認: "+a.name+" — "+l.reason),Mi(d,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),g=document.createElement("summary");g.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(g,Wl(c.markdown)),d.append(f);const u=Mo("対応を確認して表示する",()=>n.confirm(a));u.id="check-confirm",u.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const b=Mo("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});b.disabled=n.disabled||t.busy===!0,d.append(u,b),o.append(d)}return o.childNodes.length&&i.append(o),i}function Vl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const d of o){const f=document.createElement("span");f.className="document-action-label",f.textContent=d.getAttribute("aria-label"),d.append(f)}let r=!1;const s=(d=!1)=>{r=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),d&&!i.hidden&&i.focus({preventScroll:!0})},a=()=>o.filter(d=>!d.hidden&&!d.disabled),c=()=>{const d=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const u=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,b=n.getBoundingClientRect().width+u,m=o.some(p=>!p.hidden)&&e.clientWidth>0&&b>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||d!==e.dataset.actionsMode)&&(s(),m&&n.contains(f)?i.focus({preventScroll:!0}):!m&&f===i&&a()[0]?.focus({preventScroll:!0}))},l=(d=!1)=>{if(i.hidden)return;r=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const f=a();(d?f.at(-1):f[0])?.focus({preventScroll:!0})};return i.onclick=()=>r?s(!0):l(),i.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),l(d.key==="ArrowUp"))},n.addEventListener("keydown",d=>{if(!r)return;const f=a(),g=f.indexOf(document.activeElement);let u;d.key==="ArrowDown"&&(u=(g+1)%f.length),d.key==="ArrowUp"&&(u=(g+f.length-1)%f.length),d.key==="Home"&&(u=0),d.key==="End"&&(u=f.length-1),u!==void 0&&(d.preventDefault(),f[u]?.focus())}),document.addEventListener("keydown",d=>{r&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{r&&!n.contains(d.target)&&!i.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{r&&!n.contains(d.target)&&d.target!==i&&s()}),n.addEventListener("click",d=>{const f=d.target.closest("button");r&&f&&!f.disabled&&s(!0)},!0),s(),c(),window.addEventListener("resize",c),typeof ResizeObserver<"u"&&new ResizeObserver(c).observe(e),new MutationObserver(c).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(c),document.fonts?.addEventListener("loadingdone",c),{update:c,close:s}}function Fl(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),r=parseFloat(o.columnGap)||0,s=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),a=n.reduce((l,d)=>l+d.getBoundingClientRect().width,0)+r*n.length+s,c=a+t.getBoundingClientRect().width+r;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&c>e.clientWidth),e.classList.toggle("header-icons-only",a>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(r=>o.observe(r))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const ti="http://www.w3.org/2000/svg",Bl="http://www.w3.org/1999/xhtml",Ri=24,gr=8192,Gl=16e6,Hl=8e6,Jl=4e3,_l=1e6,_o="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Kl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(d=>![d.x,d.y,d.width,d.height].every(Number.isFinite)||d.width<0||d.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const d of e)t=Math.min(t,d.x),n=Math.min(n,d.y),i=Math.max(i,d.x+d.width),o=Math.max(o,d.y+d.height);const r=Math.floor(t)-Ri,s=Math.floor(n)-Ri,a=Math.ceil(i)-r+Ri,c=Math.ceil(o)-s+Ri,l=Math.min(2,gr/a,gr/c,Math.sqrt(Gl/(a*c)));if(l<1)throw Error(_o);return{bounds:{x:r,y:s,width:a,height:c},width:Math.floor(a*l),height:Math.floor(c*l),scale:l}}const Xl="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function yr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,r)=>{const s=i[r],a=getComputedStyle(o);s.removeAttribute("style");for(const c of Xl){const l=a.getPropertyValue(c);l&&!/url\s*\(/i.test(l)&&s.style.setProperty(c,l)}for(const c of Array.from(s.attributes))(c.name.startsWith("data-")||c.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(c.name))&&s.removeAttribute(c.name)}),t}function Zl(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Jl||(e.textContent?.length??0)+(t.textContent?.length??0)>_l)throw Error(_o);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const p of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+p.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+p.offsetTop,width:p.offsetWidth,height:p.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const r=e.ownerDocument,s=Array.from(t.children).map(yr),a=s.filter(m=>m.matches(".edge,.edge-label"));if(a.length){const m=r.createElementNS(ti,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...a),r.body.append(m);try{for(const p of a){const h=p.getBBox();o.push({x:h.x-12,y:h.y-12,width:h.width+24,height:h.height+24})}}finally{m.remove()}}const c=Kl(o),l=r.createElementNS(ti,"svg");l.setAttribute("width",String(c.width)),l.setAttribute("height",String(c.height)),l.setAttribute("viewBox",`0 0 ${c.bounds.width} ${c.bounds.height}`);const d=r.createElementNS(ti,"rect");d.setAttribute("width","100%"),d.setAttribute("height","100%"),d.setAttribute("fill",n),l.append(d);const f=r.createElementNS(ti,"g");f.setAttribute("transform",`translate(${-c.bounds.x} ${-c.bounds.y})`);for(const m of s)f.append(m);l.append(f);const g=r.createElementNS(ti,"foreignObject");g.setAttribute("width",String(c.bounds.width)),g.setAttribute("height",String(c.bounds.height));const u=r.createElementNS(Bl,"div");u.style.cssText=`position:relative;width:${c.bounds.width}px;height:${c.bounds.height}px;`;for(const m of i){const p=yr(m);p.querySelector(".activity-open,.object-open")?.remove(),p.style.left=parseFloat(m.style.left)-c.bounds.x+"px",p.style.top=parseFloat(m.style.top)-c.bounds.y+"px",u.append(p)}g.append(u),l.append(g);const b=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(b).length>Hl)throw Error(_o);return{svg:b,...c}}function Yl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ba(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,r)=>{const s=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",r(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(s),o()},n.onerror=()=>{clearTimeout(s),r(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,r)=>{const s=window.setTimeout(()=>r(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(a=>{clearTimeout(s),a?o(a):r(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(a){clearTimeout(s),r(a)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Ql(e,t){const n=await ba(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Yl(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function eu(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ba(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ga(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:tu(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function tu(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,r=2246822507;for(const s of i)o=Math.imul(o^s.codePointAt(0),16777619)>>>0,r=Math.imul(r^s.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+r.toString(16).padStart(8,"0")}function ya(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return P(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function va(e){P(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),mn(e),Fi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=ga(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=ya(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Fi(t),t}const vr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),nu={anyOf:di.anyOf},iu={type:"string",pattern:"^[A-Za-z0-9_-]+$"},ou={type:"string",minLength:1,pattern:"\\S"},su={$schema:"https://json-schema.org/draft/2020-12/schema",...vr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:vr({id:iu,name:ou,package:nu})}}),$defs:di.$defs};function ru(e){try{mn(e,su)}catch(n){if(Array.isArray(e?.plans))for(const i of e.plans)try{mn(i?.package,di)}catch(o){throw Error("Plan "+(i?.id??"<missing>")+" (formatVersion "+String(i?.package?.formatVersion)+"): "+o.message,{cause:o})}throw n}P(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){P(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),P(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Fi(n.package),["0.1","0.2","0.3"].includes(n.package.formatVersion)&&va(n.package)}catch(i){throw Error("Plan "+n.id+" (formatVersion "+n.package.formatVersion+"): "+i.message,{cause:i})}}return{valid:!0,plans:e.plans.map(({id:n,name:i})=>({id:n,name:i}))}}const he=(e,t)=>{if(!e)throw new Error(t)},ii=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Ro=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Li=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),wa=e=>ii(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function au(e){he(Ro(e),"Graph must be an object");const t=e;he(Li(t,["version","nodes","relations"])||Li(t,["version","nodes","relations","scope"]),"Invalid graph fields"),he(t.version===1,"Unsupported graph version"),"scope"in t&&he(ii(t.scope),"Invalid scope"),he(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),he(Array.isArray(t.relations),"Relations required");const n=new Map;for(const r of t.nodes){he(Ro(r),"Node must be an object");const s=r;he(s.type==="business"||s.type==="object","Invalid node type");const a=s.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];s.type==="business"&&("problem"in s||"pain_level"in s)&&(a.push("problem","pain_level"),he(["Low","Medium","High"].includes(String(s.pain_level)),"Invalid Pain level")),he(Li(s,a),"Invalid node fields"),he(Object.entries(s).every(([l,d])=>l==="scope"||l==="information"||ii(d)),"Empty node text"),he(typeof s.scope=="boolean","Invalid node scope"),he(wa(s.name)&&s.id===s.name,"Node ID must equal visible name"),he(!n.has(s.id),"Duplicate node ID"),s.type==="object"&&(he(typeof s.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.icon),"Invalid Lucide icon"),he(Array.isArray(s.information)&&s.information.every(ii),"Invalid information")),n.set(s.id,s.type)}he([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const r of t.relations){he(Ro(r),"Relation must be an object");const s=r;he(Li(s,["kind","from","to","label"])&&Object.values(s).every(ii),"Invalid relation fields");const a=i[s.kind];he(Array.isArray(a)&&n.has(s.from)&&n.has(s.to)&&n.get(s.from)===a[0]&&n.get(s.to)===a[1],"Invalid relation endpoints");const c=JSON.stringify([s.kind,s.from,s.to,s.label]);he(!o.has(c),"Duplicate relation"),o.add(c)}}function hn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function si(e){const t=[];let n="";return hn(e).forEach((i,o)=>{const r=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(r){n?r[1][0]===n[0]&&r[1].length>=n.length&&!r[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=r[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),he(!n,"Unclosed code fence"),t}function Ko(e,t,n,i=[]){const o=hn(e),r=si(e),s=Object.create(null);return he(r.length&&!o.slice(0,r[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),r.forEach(([a,c],l)=>{he(t.includes(c)&&!(c in s),n+": unsupported/duplicate "+c),s[c]=o.slice(a+1,r[l+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),he(s[c]||i.includes(c),n+": empty "+c)}),he(r.map(a=>a[1]).join("|")===t.join("|"),n+": invalid field order"),s}const wr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function cu(e){const t=hn(e),n=si(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return he(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,r],s)=>{const a=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(r);he(a,"Invalid Finding ID");const c=a[1];he(!i.has(c),"Duplicate Finding ID"),i.add(c);const l=Ko(t.slice(o+1,n[s+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+c);he(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),he(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),he(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const d=l["### Targets"]==="(none)"?[]:hn(l["### Targets"]).filter(f=>f.trim()).map(f=>(he(f.startsWith("- ")&&wa(f.slice(2)),"Invalid Finding target"),f.slice(2)));return he(new Set(d).size===d.length,"Duplicate Finding target"),he(l["### Scope"]==="items"?d.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:c,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:d,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function du(e,t){he(!e.includes("<!--"),"HTML comments are unsupported");const n=hn(e),i=si(e).filter(g=>g[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;he(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let r=[];const s={version:1,nodes:[],relations:[]},a=Object.create(null),c=new Set;i.slice(1).forEach(([g,u],b)=>{const m=i[b+2]?.[0]??n.length,p=n.slice(g+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(he(p,"Empty section "+u),u==="# Findings"){he(!c.has(u),"Duplicate Findings"),c.add(u),r=cu(p);return}if(["# Scope","# Graph exceptions"].includes(u)){he(!c.has(u),"Duplicate "+u),c.add(u),u==="# Scope"?(he(!si(p).length,"Scope must be prose"),s.scope=p):hn(p).filter(O=>O.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(O=>{const $=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(O);he($,"Invalid exception"),s.relations.push({kind:$[1],from:$[2],to:$[3],label:$[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const h=o.exec(u);he(h,"Unsupported heading "+u);const x=h[1],v=h[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");a[v]=n.slice(g,m).join(`
`);const k=O=>si(p).some($=>$[1]===O);if(x==="Object"){const O=["## Scope","## Icon"];k("## Information")&&O.push("## Information");const $=Ko(p,O,v);he(["true","false"].includes($["## Scope"]),"Invalid Scope");const D=hn($["## Information"]??"").filter(L=>L.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(L=>(he(/^- \S.*$/.test(L),"Invalid Information"),L.slice(2)));s.nodes.push({id:v,type:"object",name:v,scope:$["## Scope"]==="true",icon:$["## Icon"]==="(generic icon)"?"box":$["## Icon"],information:D});return}const w=["## Scope","## Why","## When"];k("## Exception When")&&w.push("## Exception When"),w.push("## Who","## Where","## How","### Input","### Procedure"),k("### Exception")&&w.push("### Exception"),w.push("### Output","## Result"),(k("## Problem")||k("## Pain level"))&&w.push("## Problem","## Pain level");const A=Ko(p,w,v,["## How"]);he(!A["## How"],"How must only contain fields"),he(["true","false"].includes(A["## Scope"]),"Invalid Scope"),t?.activity?.(v,A);const E={id:v,type:"business",name:v,scope:A["## Scope"]==="true",why:A["## Why"],when:A["## When"],who:A["## Who"],where:A["## Where"],result:A["## Result"]};"## Problem"in A&&(E.problem=A["## Problem"],E.pain_level=A["## Pain level"]),s.nodes.push(E);for(const[O,$]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(O in A)||$!=="business-exception"&&A[O]==="(none)"||hn(A[O]).filter(D=>D.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(D=>{const L=/^- (.+?) — (\S.*)$/.exec(D);he(L,"Invalid relation in "+v),s.relations.push({kind:$,from:$==="output"?v:L[1],to:$==="output"?L[1]:v,label:L[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=s.nodes.filter(g=>g.type==="business").map(g=>g.id);au(s),s.nodes.sort((g,u)=>wr(g.id,u.id)),s.relations.sort((g,u)=>{for(const b of["kind","from","to","label"]){const m=wr(g[b],u[b]);if(m)return m}return 0});const d=new Set(s.nodes.map(g=>g.id));for(const g of r)g.unresolvedTargets=g.targets.filter(u=>!d.has(u));return{graph:s,sections:a,markdown:e,activityOrder:l,findings:r}}const lu=["id","from","activity","condition","to","effect","path","evidence","note"],_e=(e,t)=>{if(!e)throw Error(t)},Ni=e=>typeof e=="string"&&!!e.trim();function uu(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());_e(n,"state-meta と遷移表が必要です");const i=oa(n[1]);_e(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),_e(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),_e(i.object===t,"対象Objectが一致しません"),_e(Array.isArray(i.states)&&i.states.length>0&&i.states.every(l=>Ni(l)&&!l.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),_e(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&Ni(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),r=l=>(_e(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(d=>d.trim())),s=r(o[0]);_e([lu,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>s.join("|")===l.join("|")),"表の列名が不正です"),_e(r(o[1]).length===s.length&&r(o[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),_e(o.length<=1002,"遷移は1000行以内にしてください");const a=new Set,c=o.slice(2).map(l=>{const d=r(l);_e(d.length===s.length&&d.every(Ni),"表の列数・空欄が不正です");const f=Object.fromEntries(s.map((g,u)=>[g,d[u]]));return _e(/^T[0-9]+$/.test(f.id)&&!a.has(f.id),"遷移IDが不正または重複しています"),a.add(f.id),_e([...i.states,"@new"].includes(f.from)&&[...i.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),_e(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),s.includes("exception")&&_e(f.path==="normal"?f.exception==="-":Ni(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),_e(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),_e(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),_e(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),_e(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...i,transitions:c}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const kr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function pu(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let r="";for(let s=0;s<i.length;s++){const a=i[s];if(!r&&/^# Object /.test(a)?n=a.slice(9):!r&&/^# /.test(a)&&(n=null),!r&&a==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const c=[];let l="";for(s++;s<i.length;s++){const f=i[s];if(!l&&/^#{1,2} /.test(f)){s--;break}c.push(f),l=kr(f,l)}const d=uu(c.join(`
`),n);if(d.error)throw Error(d.error);t.push(d.model);continue}o.push(a),r=kr(a,r)}if(new Set(t.map(s=>s.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function fu(e){const t=/^## State Transitions$/m.test(e)?pu(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,r=du(t.markdown,{activity:(c,l)=>o.set(c,l),document:(c,l)=>{n=c,i=l}}),s={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:r.graph.scope??"",objects:r.graph.nodes.filter(c=>c.type==="object").map(c=>({id:c.id,name:c.name,scope:c.scope,icon:String(c.icon),information:c.information})),activities:(r.activityOrder??[]).map(c=>{const l=r.graph.nodes.find(f=>f.id===c),d=o.get(c);return{id:c,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:d["### Procedure"],exception:d["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:r.graph.relations.map((c,l)=>({id:"legacy-relation-"+l,kind:c.kind,fromId:c.from,toId:c.to,label:c.label})),findings:(r.findings??[]).map(c=>({...c,sourceId:c.id,targetIds:c.targets.filter(l=>r.graph.nodes.some(d=>d.id===l))}))};s.exceptions=ga(s);const a=t.declarations.map((c,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:s.id,revision:s.revision,verification:"unverified"},objectId:c.object,states:c.states.map(d=>({id:d,name:d})),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(d=>({id:d.id,sourceId:d.id,fromId:d.from,toId:d.to,activityId:d.activity,exceptionId:ya(s,d.activity,d.exception),event:d.event??null,condition:d.condition,effect:d.effect,path:d.path,evidence:d.evidence,note:d.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:s,checks:[],states:a,diagnostics:[]}}}const Nt={type:"string"},de={type:"string",minLength:1,pattern:"\\S"},le={type:"string",pattern:"^[A-Za-z0-9_-]+$"},At=e=>({anyOf:[e,{type:"null"}]}),ve=e=>({type:"array",items:e}),me=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),mu=e=>({$ref:"#/$defs/"+e}),zn=ve({anyOf:[me({kind:{enum:["text"]},value:Nt}),me({kind:{enum:["reference"]},targetId:le,label:Nt}),me({kind:{enum:["link"]},uri:de,label:Nt})]}),Xo=me({id:le,name:de,scope:{type:"boolean"}}).properties,ka=me({id:le,kind:{enum:["input","output","business-exception","object-exception"]},fromId:le,toId:le,label:de}),hu=me({id:le,sourceId:le,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:ve(le),unresolvedTargets:ve(de),summary:de,content:de}),Zo=me({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:de,title:de,preface:Nt,scope:Nt,objects:ve(me({...Xo,icon:de,information:ve(de)})),activities:ve(me({...Xo,why:de,when:de,who:de,where:de,procedure:de,exception:At(de),result:de,problem:At(de),painLevel:At({enum:["Low","Medium","High"]})})),relations:ve(ka),findings:ve(hu)}),bu=me({id:le,name:de,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Ia=me({...Zo.properties,schemaVersion:{enum:["0.2"]},roles:ve(bu),activities:ve(me({...Zo.properties.activities.items.properties,roleId:At(le)}))}),xs=me({...Ia.properties,schemaVersion:{enum:["0.3"]},exceptions:ve(me({id:le,activityId:le,name:de,description:Nt}))}),Un=e=>({...ve(e),minItems:1}),gu=me({id:le,name:de,description:Nt}),yu=me({objectId:le,roleIds:ve(le)}),vu=me({id:le,text:de,obligation:{enum:["required","optional"]},appliesWhen:At(de),performerObjectIds:At(Un(le))}),wu={anyOf:[me({kind:{enum:["before"]},beforeId:le,afterId:le}),me({kind:{enum:["interchangeable"]},stepIds:{...ve(le),minItems:2}})]},ku=Object.fromEntries(Object.entries(xs.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),Iu=me({...xs.properties,schemaVersion:{enum:["0.4"]},objects:ve(me({...Xo,icon:de,information:ve(gu)})),activities:Un(me({...ku,performers:At(Un(yu)),procedure:me({steps:Un(vu),orderRules:ve(wu)}),results:Un(me({id:le,text:de}))})),data:ve(me({id:le,name:de,items:Un(me({informationId:le,condition:At(de)}))})),relations:ve({anyOf:[me({id:le,kind:{enum:["input","output"]},fromId:le,toId:le,dataId:le}),me({...ka.properties,kind:{enum:["business-exception","object-exception"]}})]})}),Su=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,zn])),xu=me({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:de,title:de,basedOn:me({documentId:le,revision:de,verification:{enum:["unverified"]}}),intro:zn,index:ve(me({activityId:le,purpose:Nt,connections:Nt,checkIds:ve(le)})),sections:ve(me({id:le,activityId:At(le),title:de,preamble:zn})),guarantees:ve(me({id:le,sectionId:le,title:de,blocks:ve({anyOf:[me({kind:{enum:["prose"]},content:zn}),me({kind:{enum:["example"]},exampleId:le})]})})),examples:ve(me({id:le,guaranteeId:le,columns:ve(de),rows:ve(ve(zn))})),items:ve(me({id:le,checkId:le,title:de,detailSummary:Nt,sectionId:le,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:me(Su,[])})),notes:ve(me({id:le,title:de,content:zn}))}),As=me({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:de,title:de,basedOn:me({documentId:le,revision:de,verification:{enum:["unverified"]}}),objectId:le,states:ve(me({id:le,name:de})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:de,transitions:ve(me({id:le,sourceId:de,fromId:de,activityId:le,event:At(de),exception:At(de),condition:de,toId:de,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:de,note:de}))}),Ir=Object.fromEntries(Object.entries({...As.properties.transitions.items.properties,exceptionId:At(le)}).filter(([e])=>e!=="exception")),Au=me({...As.properties,schemaVersion:{enum:["0.2"]},transitions:ve(me({...Ir,conditionLabel:de},Object.keys(Ir)))}),ni=(e,t)=>me({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:de,documents:ve({anyOf:t.map(mu)}),sources:ve(me({documentId:le,revision:de,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Nt})),externalDocuments:ve(me({id:le,kind:{enum:["businessDesign"]},revision:de,activities:ve(me({id:le,name:de}))})),diagnostics:ve(de)}),Sr={anyOf:[ni("0.1",["businessDesign","checkItems"]),ni("0.2",["businessDesign","checkItems","stateTransition"]),ni("0.3",["businessDesignRoles","checkItems","stateTransition"]),ni("0.4",["businessDesignStructured","checkItems","stateTransitionStructured"]),ni("0.5",["businessDesignD2","checkItems","stateTransitionStructured"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Zo,businessDesignRoles:Ia,businessDesignStructured:xs,businessDesignD2:Iu,checkItems:xu,stateTransition:As,stateTransitionStructured:Au}},qn=(e,t)=>te(new Set(e).size===e.length,t);function Eu(e,t,n){const i=(o,r,s)=>{const a=n(o,r,e.id);return s&&te(t.parent.get(o)===s,"Structure owner mismatch: "+o),a};qn(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){te(o.name===o.name.trim(),"Data name whitespace"),qn(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities){if(o.performers!==null){qn(o.performers.map(g=>g.objectId),"Duplicate performer");for(const g of o.performers){i(g.objectId,"object"),qn(g.roleIds,"Duplicate performer Role");for(const u of g.roleIds)i(u,"role")}}let r=o.performers===null;for(const g of o.procedure.steps)if(g.performerObjectIds!==null){qn(g.performerObjectIds,"Duplicate Step performer");for(const u of g.performerObjectIds)te(o.performers?.some(b=>b.objectId===u),"Step performer outside Activity assignment: "+u)}else o.performers?.length!==1&&(r=!0);r&&te(e.findings.some(g=>g.status==="open"&&g.scope==="items"&&g.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id);const s=o.procedure.steps.map(g=>g.id),a=new Map(s.map(g=>[g,[]])),c=new Set,l=[];for(const g of o.procedure.orderRules)if(g.kind==="before"){i(g.beforeId,"step",o.id),i(g.afterId,"step",o.id),te(g.beforeId!==g.afterId,"Self Step order");const u=JSON.stringify([g.beforeId,g.afterId]);te(!c.has(u),"Duplicate Step order"),c.add(u),a.get(g.beforeId).push(g.afterId),te(s.indexOf(g.beforeId)<s.indexOf(g.afterId),"Standard Step order contradicts before constraint")}else{qn(g.stepIds,"Duplicate interchangeable Step");for(const u of g.stepIds)i(u,"step",o.id);l.push(g.stepIds)}const d=(g,u)=>{const b=[g],m=new Set;for(;b.length;){const p=b.pop();if(!m.has(p)){m.add(p);for(const h of a.get(p)){if(h===u)return!0;b.push(h)}}}return!1};for(const g of s)te(!d(g,g),"Step order cycle");const f=new Set;for(const g of l){const u=JSON.stringify([...g].sort());te(!f.has(u),"Duplicate interchangeable group"),f.add(u);for(const b of g)for(const m of g)b!==m&&te(!d(b,m),"Interchangeable Steps conflict with before constraint")}}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const a of r.items)i(a.informationId,"information",s)}}const te=(e,t)=>{if(!e)throw Error(t)};function oi(e,t=Sr,n="$"){if(t.$ref)return oi(e,Sr.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{oi(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&te(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;te(i===t.type,"Invalid type at "+n)}if(t.minLength&&te(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&te(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])te(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))te(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),oi(e[i],t.properties[i],n+"."+i)}t.type==="array"&&(t.minItems!==void 0&&te(e.length>=t.minItems,"Too few items at "+n),e.forEach((i,o)=>oi(i,t.items,n+"["+o+"]")))}function Ou(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,a,c,l=a.id)=>{te(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,a.id),i.set(s.id,c),o.set(s.id,l)};for(const s of e.documents){r(s,s,"document");for(const[a,c]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of s[a]??[])r(l,s,c)}for(const s of e.externalDocuments){r(s,s,"document");for(const a of s.activities)r(a,s,"activity")}for(const s of e.documents.filter(a=>a.kind==="businessDesign"&&a.schemaVersion==="0.4")){for(const a of s.objects)for(const c of a.information)r(c,s,"information",a.id);for(const a of s.activities){for(const c of a.procedure.steps)r(c,s,"step",a.id);for(const c of a.results)r(c,s,"result",a.id)}for(const a of s.data)r(a,s,"data")}return{map:t,owner:n,types:i,parent:o}}function ju(e){return oi(e),Sa(e)}function Sa(e,{allowUnresolvedFindings:t=!1}={}){te(e.documents.length>0,"Document required");const n=Ou(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],a=new Set;for(const u of e.sources)if(u.uri){const b=new URL(u.uri);te(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const c=(u,b,m)=>(te(i.has(u),"Dangling reference: "+u),b&&te(r.get(u)===b,"Reference type mismatch: "+u),m&&te(o.get(u)===m,"Cross-document mismatch: "+u),i.get(u)),l=u=>u?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),d=(u,b)=>{for(const m of u)if(m.kind==="reference"&&(c(m.targetId,null,b),te(["document","section","guarantee","example","check","note"].includes(r.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const p=new URL(m.uri);te(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const u of e.documents)if(te(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){te(u.activities.length>0,"Activity required");const b=[...u.objects,...u.activities].map(h=>h.name);te(new Set(b).size===b.length,"Duplicate visible name"),te(b.every(h=>h===h.trim()&&!(["0.4","0.5"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>h.includes(x))),"Invalid Graph-visible name");for(const h of u.objects)te(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h.icon),"Invalid icon");if(["0.2","0.3","0.4"].includes(u.schemaVersion)&&(te(new Set(u.roles.map(h=>h.name)).size===u.roles.length,"Duplicate Role name"),te(u.roles.every(h=>h.name===h.name.trim()&&!/[\r\n]/.test(h.name)),"Invalid Role name"),u.schemaVersion!=="0.4"))for(const h of u.activities)h.roleId!==null?c(h.roleId,"role",u.id):a.add("Role未確定: "+h.id+" — "+h.who);for(const h of u.activities)te(h.problem===null==(h.painLevel===null),"Problem/Pain pair mismatch");for(const h of u.exceptions??[])c(h.activityId,"activity",u.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;u.schemaVersion==="0.4"&&Eu(u,n,c);for(const h of u.relations){c(h.fromId,m[h.kind][0],u.id),c(h.toId,m[h.kind][1],u.id);const x=JSON.stringify([h.kind,h.fromId,h.toId,h.dataId??h.label]);te(!p.has(x),"Duplicate relation"),p.add(x)}te(new Set(u.findings.map(h=>h.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const h of u.findings){te(h.scope==="items"?h.targetIds.length+h.unresolvedTargets.length>0:!h.targetIds.length&&!h.unresolvedTargets.length,"Finding scope mismatch"),te(new Set(h.targetIds).size===h.targetIds.length,"Duplicate Finding target");for(const x of h.targetIds)c(x,null,u.id),te(["object","activity"].includes(r.get(x)),"Invalid Finding target");h.unresolvedTargets.length&&(te(t,"Unresolved Finding target: "+h.sourceId),s.push("Finding参照未決: "+h.sourceId))}}else if(u.kind==="stateTransition"){const b=c(u.basedOn.documentId,"document");te(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),te(b.revision===u.basedOn.revision,"Stale State source revision"),c(u.objectId,"object",b.id),te(!e.documents.some(p=>p!==u&&p.kind==="stateTransition"&&p.objectId===u.objectId),"Duplicate Object state declaration"),te(u.states.length>0&&new Set(u.states.map(p=>p.name)).size===u.states.length,"Duplicate/empty state names"),te(u.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),te(u.transitions.length<=1e3,"State transition row budget"),te(new Set(u.transitions.map(p=>p.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const m=new Map;for(const p of u.transitions){p.fromId!=="@new"&&c(p.fromId,"state",u.id),["@unknown","@none"].includes(p.toId)||c(p.toId,"state",u.id);const h=c(p.activityId,"activity",b.id);if(e.formatVersion!=="0.5"){const x=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);te(!m.has(x),"Duplicate state transition condition: "+m.get(x)+" / "+p.sourceId),m.set(x,p.sourceId)}if(["0.4","0.5"].includes(e.formatVersion))if(te(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const x=c(p.exceptionId,"exception",b.id);te(x.activityId===h.id,"Exception Activity mismatch")}else p.path==="exception"&&te(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else te(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);te(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),te(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),te(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),te(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else{const b=c(u.basedOn.documentId,"document");te(b.kind==="businessDesign","Check source is not BD"),te(b.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),te(new Set(u.items.map(p=>p.checkId)).size===u.items.length,"Duplicate Check ID");const m=new Set;for(const p of u.index){c(p.activityId,"activity",b.id),te(!m.has(p.activityId),"Duplicate Activity index"),m.add(p.activityId),te(new Set(p.checkIds).size===p.checkIds.length,"Duplicate Check binding");for(const h of p.checkIds)c(h,"check",u.id)}te(new Set(u.sections.map(p=>p.activityId??p.title)).size===u.sections.length,"Duplicate Activity section");for(const p of u.sections)p.activityId!==null&&(c(p.activityId,"activity",b.id),te(m.has(p.activityId),"Section missing from index")),d(p.preamble,u.id);for(const p of u.guarantees){te(p.blocks.some(h=>h.kind==="prose"&&l(h.content)),"General guarantee prose required"),c(p.sectionId,"section",u.id);for(const h of p.blocks)if(h.kind==="prose")d(h.content,u.id);else{const x=c(h.exampleId,"example",u.id);te(x.guaranteeId===p.id,"Example owner mismatch")}}for(const p of u.examples){c(p.guaranteeId,"guarantee",u.id),te(p.columns.length>0,"Example columns required");for(const h of p.rows){te(h.length===p.columns.length,"Example column mismatch");for(const x of h)d(x,u.id)}}for(const p of u.items){const h=c(p.sectionId,"section",u.id);te(h.activityId===null?!u.index.some(x=>x.checkIds.includes(p.id)):u.index.some(x=>x.activityId===h.activityId&&x.checkIds.includes(p.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),te(l(p.fields.guarantee)||l(p.fields.condition)&&l(p.fields.expectedResult),"Check guarantee required");for(const x of Object.values(p.fields))d(x,u.id);te(h.activityId===null||u.index.some(x=>x.checkIds.includes(p.id)),"Unbound Check")}for(const p of u.notes)d(p.content,u.id);d(u.intro,u.id)}const f=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));te(new Set(f).size===f.length,"Duplicate unresolved Role diagnostic");for(const u of f)te(a.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");te(a.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const u of e.sources){c(u.documentId,"document");const b=u.documentId+"@"+u.revision;te(!g.has(b),"Duplicate source descriptor"),g.add(b)}for(const u of e.externalDocuments)te(e.sources.some(b=>b.documentId===u.id&&b.revision===u.revision),"External source revision missing"),te(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:i.size}}function Du({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=(e.formatVersion==="0.5"?Sa:sa)({formatVersion:["0.5","0.6","0.7"].includes(e.formatVersion)?e.formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const r=e.business,s=[...r.objects,...r.activities],a=[...r.objects.map(f=>({...f,information:f.information.map(g=>typeof g=="string"?g:g.name),type:"object"})),...r.activities.map(f=>({id:f.id,type:"business",name:f.name,scope:f.scope,why:f.why,when:f.when,who:En(r,f),where:f.where,result:"results"in f?f.results.map(g=>g.text).join(`
`):f.result,...f.problem===null?{}:{problem:f.problem,pain_level:f.painLevel}}))],c=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(f=>f.basedOn.documentId===r.id).map(f=>{const g=new Map(f.states.map(b=>[b.id,b.name])),u={object:s.find(b=>b.id===f.objectId).name,states:f.states.map(b=>b.name),start:f.start,terminal:f.terminal,completeness:f.completeness,source:f.source,transitions:f.transitions.map(b=>({id:b.sourceId,from:g.get(b.fromId)??b.fromId,to:g.get(b.toId)??b.toId,activity:b.activityId,...b.event?{event:b.event}:{},...b.exceptionId?{exceptionId:b.exceptionId,exception:r.exceptions?.find(m=>m.id===b.exceptionId)?.name}:{},condition:b.condition,...b.conditionLabel?{conditionLabel:b.conditionLabel}:{},effect:b.effect,path:b.path,evidence:b.evidence,note:b.note}))};return[f.objectId,{model:u}]}))),l=r.relations.map(f=>({kind:f.kind,from:f.fromId,to:f.toId,label:Jr(r,f)})),d=["0.6","0.7"].includes(e.formatVersion)?(()=>{const g=Xd(r).edges.map(u=>({kind:u.direction,from:u.direction==="input"?u.objectId:u.activityId,to:u.direction==="input"?u.activityId:u.objectId,label:u.label||(u.transferUndecided?"未決":"")}));for(const u of l)g.some(b=>b.kind===u.kind&&b.from===u.from&&b.to===u.to)||g.push(u);return g})():l;return{graph:ca({version:1,...r.scope?{scope:r.scope}:{},nodes:a,relations:d}),sections:Object.fromEntries(a.map(f=>[f.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:r.activities.map(f=>f.id),objectStateTransitions:c,findings:[...r.findings.map(f=>({...f,displayId:f.sourceId,targets:[...f.targetIds,...f.unresolvedTargets],targetNames:[...f.targetIds,...f.unresolvedTargets].map(g=>s.find(u=>u.id===g)?.name??g)})),...od(r)]}}const xa=8*1024*1024;function Aa(e){return/^\s*[\[{]/.test(e)}function Yo(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function xr(e,t){if(!e||!["0.4","0.5","0.6","0.7"].includes(e.formatVersion))throw Error("JSON専用経路はformatVersion 0.4、旧候補0.5または候補0.6・0.7が必要です（旧形式は互換入力adapter）。");Yo(e);const n=e.formatVersion==="0.5"?ju(e):Fi(e),i=e.documents.filter(r=>r.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(r=>r.kind==="checkItems"),states:e.documents.filter(r=>r.kind==="stateTransition"),concepts:e.documents.filter(r=>r.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Cu(e,t){if(!Aa(e)){if(t!==void 0)throw Error("案を含まない文書です。");return fu(e)}if(new TextEncoder().encode(e).byteLength>xa)throw Error("ローカルJSONは8MiB以内にしてください。");let n=oa(e.replace(/^\uFEFF/,""));Yo(n);let i;if(n?.format==="alder-named-plans"){ru(n);for(const s of n.plans)if(Yo(s.package),s.package.documents.filter(a=>a.kind==="businessDesign").length!==1)throw Error("業務案 "+s.id+" にはBusiness Designが1件必要です。");const o=t??n.plans[0].id,r=n.plans.find(s=>s.id===o);if(!r)throw Error("指定した業務案がありません: "+o);i={selected:o,choices:n.plans.map(({id:s,name:a})=>({id:s,name:a}))},n=r.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const o=xr(va(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const r=o.data.business;r.schemaVersion="0.1",delete r.roles;for(const s of r.activities)"roleId"in s&&delete s.roleId;o.data.diagnostics=o.data.diagnostics.filter(s=>!s.startsWith("Role未確定:"))}return{...o,...i?{namedPlans:i}:{}}}return{...xr(n,e),...i?{namedPlans:i}:{}}}function sn(e,t){return Du(Cu(e,t))}async function Mu(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>xa)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Aa(n))throw Error("JSONファイルの本文を確認してください。");return sn(n)}const Ru=(e,t)=>Es(e,t,!1);async function Es(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,r=()=>o.abort();t?.addEventListener("abort",r,{once:!0}),t?.aborted&&r();const s=setTimeout(r,3e4);try{const a=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!a.ok)throw Error("URL取得に失敗しました（HTTP "+a.status+"）。");const c=a.headers.get("content-type")?.toLowerCase()??"";if(c.includes("html")||!n&&c.includes("json")||c.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(a.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const d=a.body?.getReader();if(!d)throw Error("本文を読み取れません。");let f=0,g="";const u=new TextDecoder;try{for(;;){const{done:b,value:m}=await d.read();if(b)break;if(f+=m.length,f>l){try{d.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}g+=u.decode(m,{stream:!0})}g+=u.decode()}finally{d.releaseLock()}if(n&&c.includes("json")&&!/^\s*[\[{]/.test(g))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(g))throw Error("HTMLページは読み込めません。");return g}catch(a){const c=o.signal.aborted;throw r(),c?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):a instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):a}finally{clearTimeout(s),t?.removeEventListener("abort",r)}}const Ji=Mu;async function ro(e,t){return sn(await Es(e,t))}function Lu(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return sn(e)}const ao=e=>e==="question"?"要確認":"要修正";function Nu(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(r=>r.status==="open"&&r.kind===i&&r.targets.includes(t.id)).length;o&&n.push(`${ao(i)} ${o}`)}return n}function Pu(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ao(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const r=document.createElement("p");r.className="finding-reference-warning",r.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(r)}return t.append(et(e.content)),t}function Tu(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function qu(e,t,n,i=!1){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const r of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t)&&(!i||!s.id.startsWith("viewer:")))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=r.id,s.textContent=`${ao(r.kind)} · ${r.displayId??r.id}　${r.summary}`,s.onclick=()=>n({type:"finding",id:r.id}),o.append(s)}return o}function $u(e,t,n,i,o){const r=document.createElement("section");r.className="findings-index";const s=document.createElement("label");s.className="finding-filter";const a=document.createElement("input");a.type="checkbox",a.checked=t,a.onchange=()=>n(a.checked),s.append(a,document.createTextNode("解消済みも表示")),r.append(s);const c=(d,f,g)=>{const u=document.createElement("button");u.className="node-navigate finding-index-row",u.dataset.findingKey=d.type+":"+d.id;const b=document.createElement("strong");b.textContent=f;const m=document.createElement("span");return m.textContent=g,u.append(b,m),u.onclick=()=>i(d),u},l=e.graph.nodes.filter(d=>(!o||d.id===o)&&typeof d.problem=="string");if(l.length){const d=document.createElement("h3");d.textContent="困りごと",r.append(d);for(const f of l)r.append(c({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[d,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const g=(e.findings??[]).filter(b=>(!o||b.targets.includes(o))&&(t||b.status==="open")&&(d==="broken"?b.unresolvedTargets.length>0:b.scope===d&&!b.unresolvedTargets.length));if(!g.length)continue;const u=document.createElement("h3");u.textContent=`${f}（${g.length}件）`,r.append(u);for(const b of g)r.append(c({type:"finding",id:b.id},`${ao(b.kind)} · ${b.displayId??b.id}${b.status==="resolved"?" · 解消済み":""}`,b.summary))}if(r.childElementCount===1){const d=document.createElement("p");d.textContent="表示する指摘はありません。",r.append(d)}return r}function Wu(e){const t=la(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((r,s)=>r===o[s]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...hc(),viewInset:[40,0],canvasOrigin:void 0}}function zu(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,r)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(r)}),n}function Os(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Uu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Os(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Vu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Os(t)),n.href}function Fu(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Os(t)}const js=`# Alderを使った設計業務 — Business Design

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
`,Bu=`{
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
`;function Gu(e,t){const n=new Set(t.graph.nodes.map(g=>g.id)),i=new Map;for(const g of t.graph.nodes)i.set(g.name,i.has(g.name)?void 0:g.id);const o=g=>n.has(g)?g:i.get(g),r=Object.create(null);for(const[g,u]of Object.entries(e.positions)){const b=o(g);b&&(r[b]=u)}const{scroll:s,zoom:a,viewInset:c,canvasOrigin:l,showExceptions:d,selectedEdgesOnly:f}=e;return{positions:r,scroll:s,zoom:a,viewInset:c,canvasOrigin:l,showExceptions:d,selectedEdgesOnly:f,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(g=>{const u=o(g);return u?[u]:[]}))]}}}const Hu=`# Alderのチェックリストサンプル

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
`;function Ju(e,t,n,i,o=()=>!0,r=()=>{}){const s=e.ownerDocument,a=s.defaultView;let c,l=0,d=0,f=!1,g=null,u="";const b=new Map,m=()=>{c!==void 0&&(a.clearTimeout(c),l=Math.max(0,l-(Date.now()-d)),c=void 0)},p=(v=!1)=>{if(v&&!o())return;m(),b.delete(u);const k=[...b].at(-1);if(k){x(k[1],"error",k[0]);return}const w=e.contains(s.activeElement);e.hidden=!0,t.textContent="",r(),w&&(g?.isConnected?g:i).focus({preventScroll:!0})},h=()=>{e.hidden||e.dataset.kind==="error"||f||s.hidden||e.contains(s.activeElement)||(m(),d=Date.now(),c=a.setTimeout(p,l))};e.addEventListener("pointerenter",()=>{f=!0,m()}),e.addEventListener("pointerleave",()=>{f=!1,h()}),e.addEventListener("focusin",v=>{const k=v.relatedTarget;k&&!e.contains(k)&&(g=k),m()}),e.addEventListener("focusout",()=>a.setTimeout(h,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),p(!0))}),s.addEventListener("visibilitychange",()=>s.hidden?m():h()),n.onclick=()=>p(!0);const x=(v,k,w)=>{m(),e.contains(s.activeElement)||(g=s.activeElement),u=w,e.dataset.kind=k,e.dataset.key=w,t.setAttribute("role",k==="error"?"alert":"status"),t.setAttribute("aria-live",k==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,r(),l=k==="warning"?8e3:5e3,h()};return(v,k="success",w="operation")=>{k==="error"&&v?(b.delete(w),b.set(w,v)):b.delete(w);const A=[...b].at(-1);if(A){if(!e.hidden&&t.textContent===A[1]&&u===A[0])return;x(A[1],"error",A[0]);return}if(!v){u===w&&p();return}!e.hidden&&t.textContent===v&&e.dataset.kind===k||x(v,k,w)}}const Ar=Bu,Et=document.querySelector("#app");Et.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const S=e=>document.getElementById(e),Vn=ua(location.pathname);Vn.version&&(S("preview-badge").hidden=!1,S("preview-badge").textContent=`確認用 · ${Vn.version}`,S("preview-badge").title=`PR #${Vn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const fi=e=>Kn(e,{"stroke-width":1.8,"aria-hidden":"true"}),vi=document.createElement("div");vi.id="source-menu";vi.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';Et.append(vi);const co=document.createElement("div");co.id="checks-menu";co.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';Et.append(co);const Cn=document.createElement("section");Cn.id="check-followup";Cn.hidden=!0;Cn.setAttribute("aria-labelledby","check-followup-title");Cn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(Cn);const lo=document.createElement("div");lo.id="check-followup-menu";lo.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';Et.append(lo);const Ft=document.createElement("input");Ft.type="file";Ft.id="check-file";Ft.accept=".md,.markdown,text/markdown,text/plain";Ft.hidden=!0;Et.append(Ft);const rn=document.createElement("section");rn.id="check-url-dialog";rn.hidden=!0;rn.setAttribute("role","dialog");rn.setAttribute("aria-labelledby","check-url-title");rn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';Et.append(rn);const uo=document.createElement("div");uo.id="help-menu";uo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;Et.append(uo);so(S("help-menu-toggle"),uo);const ri=document.createElement("div");ri.id="url-history";vi.append(ri);function _u(){if(ri.replaceChildren(),!C.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",ri.append(e);for(const t of C.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=re||Ne||ae,n.onclick=()=>{Ku(t.url)},ri.append(n)}}async function Ku(e){if(!(re||Ne||ae)){if(C.document?.source?.kind==="url"&&C.document.source.url===e){we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),Si();return}Ne=!0,Me();try{const t=await ro(e),n=Xn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await wi(n)}catch(t){t instanceof Rn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ne=!1,Me()}}}const Xu=so(S("open-menu-toggle"),vi),Zu=so(S("open-checks"),co,()=>{const e=ne();S("check-open-sample").hidden=!e||!Ls(e),S("check-close").disabled=!e?.checks}),Ea=so(S("check-followup-open"),lo,()=>{S("check-followup-sample").hidden=!ne()||!Ls(ne())});for(const[e,t]of[["open-menu-toggle",Zs],["open",Zs],["open-url",bc],["open-text",gc],["view-markdown",yc],["open-checks",Lr],["share-source",vc],["refresh",wc],["help-menu-toggle",kc],["drawer",Ic],["node-list-toggle",Sc],["node-list-close",Nr],["display-settings-toggle",Pr],["reset-layout",xc],["save-image",Ac],["copy-image",Ec],["out",$r],["in",Wr]])S(e).prepend(fi(t));Fl(document.querySelector("header"));const Qo=Vl(document.querySelector(".tab-strip"));let C={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Rt=!0,Yt=!1,re=!0,Jn=!1,On=!1,Ne=!1,Er=Promise.resolve(),bn,ye,Lt=0,ae=!1,ai=!1,Fn=0,_i=0,Bn=!1,Ds=!1,es=!1,Or=!1;const ts=new Set,Qt=new Set,Ki=new Set;function Oa(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ki){const i=[...C.document?[C.document]:[],...C.recovery].find(r=>r.key===n),o=t.find(r=>r.key===n&&r.draft===i?.draft);i&&o&&Ki.delete(n)}}const ne=()=>C.tabs.find(e=>e.key===C.active),Mn=e=>tn(e)?.key??e.key,nn=e=>C.document?.key===Mn(e);let ns="";const Yu=Ju(S("status"),S("status-text"),S("status-close"),S("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(ns===e)return;ns=e}Yu(e,t,n)}function Cs(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Ms(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ht(){re||(Lt++,tt())}function Qu(e){e.preventDefault(),e.returnValue=!0}function tt(){const e=Lt>Fn||_i>0||!1||ae||Ki.size>0||es||Bn||On,t=!re&&e;t!==Or&&(Or=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Qu));const n=re?"restoring":Jn?"protected":On?"conflict":Bn?"error":es||Ki.size>0?"draft":_i>0||ae?"saving":Lt>Fn?"dirty":Ds?"saved":"unchanged";Et.dataset.saveState!==n&&(Et.dataset.saveState=n),Jn?Cs():On?Ms():Bn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),fo()}function Rs(e){Bn=!0,ns=""}function po(){if(Jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(On)throw new Is}async function ep(e){po();try{await Il(e)}catch(t){throw t instanceof Is&&(On=!0,clearTimeout(bn),bn=void 0,Ms()),t}}function ja(e,t){_i++,ts.add(t),tt();const n=Er.catch(()=>{}).then(()=>ep(e)).then(()=>{Fn=Math.max(Fn,t),Ds=!0,Oa(e),Fn===Lt&&(Bn=!1)},i=>{throw Rs(),i}).finally(()=>{_i--,ts.delete(t),tt()});return Er=n.catch(()=>{}),n}function Ae(e=180,t=!0){if(re)return;if(t&&Lt++,clearTimeout(bn),bn=void 0,Jn){Cs(),tt();return}if(On){Ms(),tt();return}if(ae||ts.has(Lt)||!t&&Lt<=Fn&&!Bn){tt();return}const n=()=>{bn=void 0;let i;try{i=structuredClone(Ss(C))}catch{Rs(),tt();return}ja(i,Lt).catch(()=>tt())};e===0?n():bn=window.setTimeout(n,e),tt()}async function tp(e){if(re||ye||ae||!C.tabs.includes(e))return;if(li(e)===void 0){Ue?.closeBusinessOverview();return}bt.cancel(),we();const t=C.active===e.key,n={...C,tabs:C.tabs.filter(i=>i!==e),active:t?C.tabs[0]?.key:C.active};try{await ki(()=>n,()=>{C=n}),t&&Et.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{tt()}}function pt(){S("drawer").setAttribute("aria-label","業務内容開閉"),S("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!ne(),t=e&&C.drawer,n=e&&!!C.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Yt=!1),fo(),S("layout-lock").replaceChildren(fi(Rt?Tr:qr)),S("layout-lock").setAttribute("aria-pressed",String(Rt)),S("layout-lock").title=Rt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",S("layout-lock").toggleAttribute("disabled",re),S("viewport").dataset.layoutLocked=String(Rt),S("prefer-write").checked=C.preferWrite===!0,S("prefer-write").disabled=re,S("show-exceptions").checked=ne()?.showExceptions!==!1,S("show-exceptions").disabled=re||ae||!ne()||ye===ne(),S("selected-edges-only").checked=ne()?.selectedEdgesOnly===!0,S("selected-edges-only").disabled=re||ae||!ne()||ye===ne(),document.documentElement.dataset.theme=C.dark?"dark":"light",S("theme").replaceChildren(fi(C.dark?Rc:Lc)),S("formattedMarkdownDrawer").hidden=!t,S("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(C.width,innerWidth*.65))+"px",S("drawer").setAttribute("aria-expanded",String(t)),S("drawer").toggleAttribute("disabled",re||!e),S("node-list-drawer").hidden=!n||ft().mode!=="findings",S("node-list-toggle").setAttribute("aria-expanded",String(n)),S("node-list-toggle").toggleAttribute("disabled",re||!e),Ue?.syncChrome()}function is(){for(const e of["save-image","copy-image"]){const t=S(e);t.hidden=!ne(),t.disabled=ai||re||!ne()||ye===ne(),t.setAttribute("aria-busy",String(ai))}}function fo(){is(),document.querySelector(".toolbar").dataset.settingsOpen=String(Yt),S("display-options").hidden=!Yt,S("reset-layout").disabled=re||Ne||ae||!1||!ne()||Qt.has(C.document?.key??"")||Jn||On;const e=S("display-settings-toggle"),t=Yt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Yt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=re||ae||!ne()||ye===ne()}function Da(e,t=!1){const n=ne();re||ae||!n||ye===n||e===Yt||(e&&(_n.delete(tn(n)?.key??n.key),mo()),bt.cancel(),qe=void 0,we(),Yt=e,fo(),Gt(n),!e&&(t||S("display-options").contains(document.activeElement))&&S("display-settings-toggle").focus({preventScroll:!0}))}async function Ca(e){const t=ne();if(!(ai||re||!t||ye===t)){ai=!0,is();try{const n=Zl(S("nodes"),S("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await eu(n),$e("グラフ全体のPNGをコピーしました。")):await Ql(n,(tn(t)?.name??t.name)+(li(t)?" - "+li(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{ai=!1,is()}}}S("save-image").onclick=()=>Ca(!1);S("copy-image").onclick=()=>Ca(!0);S("display-settings-toggle").onclick=()=>Da(!Yt);S("reset-layout").onclick=()=>{const e=ne();if(re||Ne||ae||ye||!e||Qt.has(Mn(e)))return;try{po()}catch{tt();return}bt.cancel(),fn.cancel(),qe=void 0,we();const t={...e,design:io(e)},n=Wu(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Ta.invalidate(e),Me(),n!==t&&Ae()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Yt&&S("source-dialog").hidden&&(e.preventDefault(),Da(!1,!0))});function we(e=!0){const t=ne();if(!t)return!1;const n=[S("viewport").scrollLeft,S("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Ht(),Ae(180,!1)),i}function Ma(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function os(){Xu.close(),Zu.close(),Ea.close(),Qo.close(),Ma(np),Qo.update()}function np(){const e=S("tabs");e.replaceChildren(),C.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===C.active?" active":""),n.draggable=li(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Gi(t)!==void 0&&(n.dataset.activity=Gi(t)),Hi(t)!==void 0&&(n.dataset.object=Hi(t));const i=document.createElement("button");$o(i,"business",t.name),i.setAttribute("aria-current",String(t.key===C.active)),i.disabled=ae,i.onclick=async()=>{if(ae||Pt&&Pt!==t.key&&!await Ii())return;const r=we()||C.active!==t.key;Ue?.activateBusiness(),C.active=t.key,Me(),Ue?.businessActivated(),Ae(180,r)};const o=Wo("業務設計："+t.name+"を閉じる");o.disabled=ae,o.onclick=()=>tp(t),n.append(i,o),n.ondragstart=r=>r.dataTransfer?.setData("text/plain",t.key),n.ondragover=r=>r.preventDefault(),n.ondrop=r=>{if(r.preventDefault(),ae)return;const s=C.tabs.findIndex(c=>c.key===r.dataTransfer?.getData("text/plain")),a=C.tabs.indexOf(t);if(s>0&&a>0&&s!==a){const[c]=C.tabs.splice(s,1);C.tabs.splice(a,0,c),os(),Ae()}},n.onkeydown=r=>{if(!ae&&r.altKey&&(r.key==="ArrowLeft"||r.key==="ArrowRight")){r.preventDefault();const s=C.tabs.indexOf(t),a=s+(r.key==="ArrowLeft"?-1:1);s>0&&a>0&&a<C.tabs.length&&([C.tabs[s],C.tabs[a]]=[C.tabs[a],C.tabs[s]],os(),Ae())}},e.append(n)})}const jr=new Map,_n=new Set;function mo(){const e=ne(),t=!!e&&e.design.sourceFormat!=="json"&&_n.has(tn(e)?.key??e.key)&&!e.checks;t||(Ea.close(),Cn.contains(document.activeElement)&&S("viewport").focus({preventScroll:!0})),Cn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])S(n).disabled=re||Ne||ae||!1||!e||yn(e).busy===!0}S("check-followup-later").onclick=()=>{const e=ne();e&&_n.delete(tn(e)?.key??e.key),mo()};let ss;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])S("check-followup-"+e).onclick=()=>{ss=S("check-followup-open"),S(t).click(),ss=void 0};function Ls(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===js}function yn(e){const t=tn(e)?.key??e.key;let n=jr.get(t);return n||(n={},jr.set(t,n)),n}async function Ns(e,t){if(!nn(e))throw Error("原本文書が切り替わりました。");const n=Vt(C,C.recovery,{...C.document,checks:t},Ss(C).views);await ki(()=>n,()=>{C=n,t&&_n.delete(tn(e)?.key??e.key)})}async function Ra(e,t){const n=yn(e);if(e.design.sourceFormat==="json"||n.busy||ae||re||ye===e)return;const i=ui(e);n.busy=!0,n.error=void 0,n.candidate=void 0,on();try{const o=await t();if(!nn(e))return;if(i!==ui(C.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const r=Hn(o),s=pi(r,C.tabs[0]);if(s.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+s.reason);s.state==="unverified"?n.candidate=o:(await Ns(e,o),n.candidate=void 0,Ue?.openRelatedChecks(ne()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,$e(n.error,"error")}finally{n.busy=!1,on()}}async function La(e,t){const n=yn(e);if(n.busy||ae||!nn(e))return;const i=pi(Hn(t),C.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,on();return}n.busy=!0,n.error=void 0;try{await Ns(e,{...t,confirmedFor:ui(C.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(ne()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,on()}}function on(){mo();const e=ne(),t=S("detail"),n=e?yn(e):void 0,i=e?e.key+":"+(e.selected??""):"";S("open-checks").disabled=re||ae||ye===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,r=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const s=e.design.graph.nodes.find(f=>f.id===e.selected),a=Ul(e,n,{disabled:re||ae||ye===e,redraw:on,confirm:f=>{La(e,f)}}),c=document.createElement("div");c.className="right-drawer-heading";const l=id(s?.name??"業務設計");if(s){const f=s.type==="business"?Na(String(s.who),s.id):Hr(s);f.classList.add("drawer-node-icon"),l.prepend(f)}c.append(l);const d=document.createElement("button");if(d.type="button",d.id="business-drawer-close",d.setAttribute("aria-label","右ドロワーを閉じる"),d.textContent="×",d.onclick=()=>{S("drawer").click(),S("drawer").focus({preventScroll:!0})},c.append(d),t.append(c),a.hasChildNodes()&&t.append(a),s){const f=qu(e.design,s.id,Xi,s.type==="business");f.hasChildNodes()&&t.append(f)}t.append(nl(e.design,s?.id,f=>Xi({type:"finding",id:f}))),s?.type==="business"&&Ue?.appendActivityTestLinks(t,s.id),t.scrollTop=r,o&&document.getElementById(o)?.focus({preventScroll:!0})}const Dr=new Map,ft=()=>{const e=C.active??"";let t=Dr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Dr.set(e,t)),t};function Xi(e){if(!ne())return;const t=ft();t.mode="findings",t.finding=e,C.nodeDrawer=!0,innerWidth<=800&&(C.drawer=!1),pt(),xt(),S("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Ae()}function ip(e){const t=ne();if(!t)return;const n=ft();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){Xi(i[0]);return}C.nodeDrawer=!0,innerWidth<=800&&(C.drawer=!1),pt(),xt(),S("drawer-mode-findings").focus({preventScroll:!0}),Ae()}function op(e,t){const n=ft().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(a=>a.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(a=>a.id===n.id&&typeof a.problem=="string"):void 0;if(!i&&!o)return ft().finding=void 0,!1;const r=document.createElement("button");if(r.className="node-navigate finding-back",r.textContent="← 指摘一覧に戻る",r.onclick=()=>{ft().finding=void 0,xt(),S("drawer-mode-findings").focus({preventScroll:!0})},t.append(r),i)t.append(Pu(i));else{const a=document.createElement("h2");a.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(a,et(String(o.problem)))}const s=i?.targets??[o.id];if(s.length){const a=document.createElement("section"),c=document.createElement("h3");c.textContent="関連項目へ移動",a.append(c);for(const l of s){const d=document.createElement("button");d.className="node-navigate finding-target-link",d.dataset.findingTarget=l;const f=e.design.graph.nodes.some(u=>u.id===l),g=e.hiddenNodes?.includes(l);d.disabled=!f||!!g,d.textContent=(e.design.graph.nodes.find(u=>u.id===l)?.name??l)+(f?g?"（非表示）":"":"（参照先なし）"),d.onclick=()=>$i(l,!0),a.append(d)}t.append(a)}return!0}function Na(e,t){let n=0;for(const s of e)n=n*31+s.codePointAt(0)>>>0;const i=document.createElement("span");i.className="who-badge",i.style.setProperty("--role-color",(t&&ne()?.design.model?.business.roles?ms(ne().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true");const o=ne()?.design.model?.business.activities.find(s=>s.id===t),r=o&&"who"in o&&typeof o.who=="object"?o.who?.kind:void 0;return i.append(fi(r==="system"?Nc:r==="scheduler"?Pc:Vr)),i}function ho(e,t=!0){re||!ne()||(bt.cancel(),we(),C.nodeDrawer=e,e&&ft().mode==="findings"&&innerWidth<=800&&(C.drawer=!1),pt(),e&&ne()?.selected&&Zn(ne().selected),xt(),t&&S(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Ae())}function Zn(e){const t=ne(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=ft();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(nd(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(S("node-list").querySelectorAll("[data-list-node]")).find(r=>r.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function sp(e,t){const n=ne();if(!n||re||ae||ye===n)return;bt.cancel(),qe=void 0,we();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],vn(),Ae()}function $i(e,t=!1){let n=ne();if(n&&!io(n).graph.nodes.some(f=>f.id===e)&&(we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,n=ne(),Me()),!n||n.hiddenNodes?.includes(e)||ye===n)return;t||(ft().finding=void 0);const i=S("node-list").contains(document.activeElement);bt.cancel(),qe=void 0,we(),n.selected=e,Zn(e),pt(),vn();const o=S("viewport"),r=o.getBoundingClientRect(),s=S("formattedMarkdownDrawer").getBoundingClientRect(),a=C.drawer&&s.left>r.left&&s.left<r.right?s.left:r.right,c=Math.max(1,Math.min(o.clientWidth,a-r.left-o.clientLeft)),l=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const d=n.positions[e];if(n.scroll=[(d[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-c/2,(d[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],Gt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],we(),i){const f=t?"[data-finding-target]":"[data-list-node]",g=Array.from(S("node-list").querySelectorAll(f)).find(u=>(t?u.dataset.findingTarget:u.dataset.listNode)===e);(t?g:g?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Ae()}function xt(){const e=ne(),t=ft(),n=S("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const r=S("drawer-modes");r.replaceChildren();for(const b of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+b,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===b)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===b?0:-1,m.textContent=`指摘（${e?Tu(e.design):0}）`;const p=()=>{t.mode=b,xt(),S("drawer-mode-"+b).focus({preventScroll:!0})};m.onclick=p,m.onkeydown=h=>{["ArrowLeft","ArrowRight","Home","End"].includes(h.key)&&(h.preventDefault(),m.focus({preventScroll:!0}))},r.append(m)}for(const b of[S("node-categories"),S("node-list-search"),document.querySelector(".scope-bulk")])b.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const s=S("node-list-search");s.value=t.search,s.disabled=!e||re;const a=S("node-categories");a.replaceChildren();for(const[b,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const p=document.createElement("button");p.dataset.category=b,p.id="node-category-"+b,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.category===b)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.category===b?0:-1,p.textContent=m,p.onclick=()=>{t.category=b,xt(),S("node-category-"+b).focus({preventScroll:!0})},p.onkeydown=h=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(h.key))return;h.preventDefault();const x=["activity","object","role"],v=x.indexOf(b);t.category=h.key==="Home"?"activity":h.key==="End"?"role":x[(v+(h.key==="ArrowRight"?1:2))%3],xt(),S("node-category-"+t.category).focus({preventScroll:!0})},a.append(p)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const c=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(b=>b.scope===!1)??[],d=l.filter(b=>!c.has(b.id)).length,f=S("scope-outside"),g=d===l.length?"true":d===0?"false":"mixed";f.setAttribute("aria-pressed",g),f.setAttribute("aria-label",g==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(fi(g==="false"?Tc:qc)),f.disabled=!l.length||re||ye===e;const u=S("show-outside");if(u.checked=g==="true",u.indeterminate=g==="mixed",u.setAttribute("aria-checked",g),u.disabled=f.disabled,S("scope-count").textContent=g==="mixed"?`${d}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(op(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const b=document.createElement("p");b.textContent=(e.design.graph.nodes.find(p=>p.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,xt(),S("drawer-mode-findings").focus({preventScroll:!0})},n.append(b,m)}n.append($u(e.design,t.resolved,b=>{t.resolved=b,xt(),n.querySelector("input")?.focus({preventScroll:!0})},Xi,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}S("node-list-toggle").onclick=()=>ho(!C.nodeDrawer);S("node-list-close").onclick=()=>ho(!1);S("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),ho(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!S("node-list-drawer").hidden&&S("source-dialog").hidden&&(e.preventDefault(),ho(!1))});S("node-list-search").oninput=()=>{ft().search=S("node-list-search").value,xt()};function Pa(){const e=ne();if(e){const t=e.design.graph.nodes.filter(n=>n.scope===!1);sp(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}S("scope-outside").onclick=Pa;S("show-outside").onchange=Pa;const rp="http://www.w3.org/2000/svg",Lo=e=>document.createElementNS(rp,e),Ta=new Ho,Cr=new WeakMap;function ap(e){if(!Gr(e.graph))return;let t=Cr.get(e);return t||(t=wl(e),Cr.set(e,t)),t.wires}function cp(e,t,n){ps(S("edges"),e,t,{"data-relation":String(n)})}let mi=()=>{},Zt=[0,0],pn=[0,0];function dp(){const e=S("node-list-drawer");return S("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function lp(){const e=S("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Gt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(f=>f[0])),Math.min(0,...i.map(f=>f[1]))],r=[o[0]<0||n[0]>0?Math.min(o[0],pn[0]):0,o[1]<0||n[1]>0?Math.min(o[1],pn[1]):0],{growth:s,origin:a}=Mc(n,r,e.zoom),c=s.some(Boolean);c&&(e.canvasOrigin=a,e.scroll=[e.scroll[0]+s[0],e.scroll[1]+s[1]],Ht(),Ae(180,!1));const l=Math.ceil(Math.max(1400,Zt[0],(dp()+e.scroll[0])/e.zoom-t[0]*2-a[0],...i.map(f=>f[0]+340))),d=Math.max(850,Zt[1],Math.max(Zt[1],...i.map(f=>f[1]+68))+lp()/e.zoom-t[1],(S("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-a[1],...i.map(f=>f[1]+220));S("canvas").style.width=(l+a[0]+t[0]*2)*e.zoom+"px",S("canvas").style.height=(d+a[1]+t[1]*2)*e.zoom+"px",S("nodes").style.left=(a[0]+t[0])*e.zoom+"px",S("nodes").style.top=(a[1]+t[1])*e.zoom+"px",S("edges").style.left=t[0]*e.zoom+"px",S("edges").style.top=t[1]*e.zoom+"px",S("nodes").style.width=l+"px",S("nodes").style.height=d+"px",S("nodes").style.transform=`scale(${e.zoom})`,S("edges").setAttribute("viewBox",`${-a[0]} ${-a[1]} ${l+a[0]} ${d+a[1]}`),S("edges").style.width=(l+a[0])*e.zoom+"px",S("edges").style.height=(d+a[1])*e.zoom+"px",c&&(S("viewport").scrollLeft=e.scroll[0],S("viewport").scrollTop=e.scroll[1]),S("zoom").textContent=Math.round(e.zoom*100)+"%"}function vn(){Ma(up)}function up(){fo(),fn.cancel(),mi=()=>{},Zt=[0,0],pn=[0,0];const e=ne();if(S("nodes").replaceChildren(),S("edges").replaceChildren(),S("empty").hidden=!!e,S("canvas").hidden=!e,!e){S("viewport").scrollLeft=0,S("viewport").scrollTop=0,on(),xt();return}const t=io(e),n=t.graph.nodes,i=n.filter(d=>!e.hiddenNodes?.includes(d.id)),o=new Set(i.map(d=>d.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const r=e.selected,s=e.positions,a=Ui(t.graph.relations,r);Gt(e),S("edges").append(us());const c=zu(t.graph.relations,C.preferWrite===!0),l=()=>{const d=n.flatMap(p=>{const h=s[p.id];return h?[{id:p.id,x:h[0],y:h[1],width:260,height:68}]:[]}),f=ap(t),g=Ta.update(e,t,d,t.graph.relations,f),u=new Map;for(Zt=[0,0],pn=[0,0];S("edges").childNodes.length>1;)S("edges").lastChild.remove();const b=new Map(e.design.graph.nodes.map(p=>[p.id,p.name]));t.graph.relations.forEach((p,h)=>{if(c.has(h))return;const x=g[h];if(!x||(Zt[0]=Math.max(Zt[0],x.bounds.right+20,x.label[0]+Math.max(30,p.label.length*12)/2+12),Zt[1]=Math.max(Zt[1],x.bounds.bottom+20,x.label[1]+22),pn[0]=Math.min(pn[0],...x.points.map(O=>O[0]-20),x.label[0]-Math.max(30,p.label.length*12)/2-12),pn[1]=Math.min(pn[1],...x.points.map(O=>O[1]-20),x.label[1]-22),e.selectedEdgesOnly===!0&&a.muted(p)||!o.has(p.from)||!o.has(p.to)||e.showExceptions===!1&&(p.kind==="business-exception"||p.kind==="object-exception")))return;const v=Lo("path");v.setAttribute("d",x.path),v.dataset.relation=String(h),v.dataset.collisions=String(x.collisions),v.dataset.rerouted=String(x.rerouted),v.dataset.fallback=String(x.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),p.kind.endsWith("exception")&&v.classList.add("exception"),a.related(p)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),a.muted(p)&&v.classList.add("muted");const k=Lo("title");k.textContent=(b.get(p.from)??p.from)+" → "+(b.get(p.to)??p.to)+": "+p.label,v.append(k),S("edges").append(v),p.kind.endsWith("exception")&&cp(v,x,h);const w=Br(p,h,f?.[h]),A=u.get(w);if(A){A.dataset.relations+=" "+h,a.related(p)&&(A.classList.add("review-related"),A.classList.remove("muted"));return}const E=Lo("text");u.set(w,E),E.dataset.relations=String(h),E.setAttribute("x",String(x.label[0]-Math.max(30,p.label.length*12)/2)),E.setAttribute("y",String(x.label[1])),E.setAttribute("text-anchor","start"),E.classList.add("edge-label"),E.setAttribute("dominant-baseline","middle"),E.dataset.relation=String(h),a.related(p)&&E.classList.add("review-related"),a.muted(p)&&E.classList.add("muted"),E.textContent=p.label,S("edges").append(E)});const m=S("edges");for(const p of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(p);Gt(e)};mi=l,l(),i.forEach(d=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+d.type+(d.scope===!1?" outside":d.scope===null?" scope-undecided":"")+a.nodeClasses(d.id),f.dataset.node=d.id,d.type==="business"&&(f.dataset.activity=d.id),f.style.left=s[d.id][0]+"px",f.style.top=s[d.id][1]+"px",d.type==="business"?f.append(Na(String(d.who),d.id)):f.append(Hr(d));const g=document.createElement("span");g.className="node-text";const u=document.createElement("span");u.className="review-kind",u.textContent=(d.type==="business"?"Activity":"Object")+(d.scope===null?" · 範囲未決":d.scope?" · 範囲内":" · 範囲外"),g.append(u);const b=document.createElement("span");if(b.className="node-name",b.textContent=d.name,g.append(b),d.type==="business"){const v=document.createElement("small");v.textContent=String(d.who),g.append(v)}if(f.append(g),$c(d.id,li(e))){const v=document.createElement("button");v.type="button",v.className=d.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",d.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=k=>k.stopPropagation(),v.onpointerup=k=>k.stopPropagation(),v.onclick=k=>{k.stopPropagation(),d.type==="business"?rs(d.id):qa(d.id),Ue?.businessActivated()},f.append(v)}f.title=d.name+(d.type==="business"?" — "+String(d.who):""),f.setAttribute("aria-label",f.title+(d.id===r?"（選択中）":""));const m=Nu(e.design,d);if(m.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=m.join(" · "),v.setAttribute("aria-label",d.name+"の指摘を開く"),v.onpointerdown=k=>k.stopPropagation(),v.onpointerup=k=>k.stopPropagation(),v.onclick=k=>{k.stopPropagation(),ip(d.id)},f.append(v),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+m.join("、"))}let p;const h=f;h.onpointerdown=v=>{v.button!==0||ye===e||Rt||(v.stopPropagation(),h.setPointerCapture(v.pointerId),p=v.pointerId,fn.begin(d.id,[v.clientX,v.clientY]))},h.onpointermove=v=>{p===void 0||v.pointerId!==void 0&&v.pointerId!==p||!f.isConnected||ye===e||fn.move([v.clientX,v.clientY])},h.onpointerup=v=>{if(p===void 0||p!==v.pointerId||(p=void 0,!f.isConnected||ye===e))return;const k=fn.end();h.hasPointerCapture?.(v.pointerId)&&h.releasePointerCapture(v.pointerId),k&&(k.moved||(ft().finding=void 0,e.selected!==d.id&&(e.selected=d.id,Ht()),Zn(d.id)),we(),vn(),Ae(180,!1))};const x=v=>{p===void 0||p!==v.pointerId||(p=void 0,f.isConnected&&(fn.cancel(),we(),Ae(180,!1)))};h.onpointercancel=x,h.onlostpointercapture=x,S("nodes").append(f)}),S("zoom").textContent=Math.round(e.zoom*100)+"%",on(),xt()}function rs(e){re||ae||ye||(we(),Ml(C,e),Me(),Ae(),S("viewport").focus({preventScroll:!0}))}function qa(e){re||ae||ye||(we(),Rl(C,e),Me(),Ae(),S("viewport").focus({preventScroll:!0}))}function Me(){$a(),document.title=C.document?C.document.name+" · Alder Viewer":"Alder Viewer",bt.cancel(),qe=void 0,pt(),os(),vn();const e=ne();e&&(S("viewport").scrollLeft=e.scroll[0],S("viewport").scrollTop=e.scroll[1]),S("refresh").toggleAttribute("disabled",re||ae||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e))),S("refresh").hidden=!e,S("view-markdown").toggleAttribute("disabled",re||Ne||ae||!1||!e||Qt.has(Mn(e))),S("view-markdown").hidden=!e,S("open-checks").hidden=!e||e.design.sourceFormat==="json",S("open-checks").toggleAttribute("disabled",re||Ne||ae||!1||!e||!!(e&&yn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])S(t).toggleAttribute("disabled",re||Ne||ae);S("open-sample").setAttribute("aria-disabled",String(re||Ne||ae)),S("open-sample").tabIndex=re||Ne||ae?-1:0,S("theme").toggleAttribute("disabled",re),gi(),mo(),_u(),yo(),Ue?.syncDocument()}function $a(){const e=S("header-title"),t=C.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{pp(n.value)},e.append(n));const i=Array.from(n.options).map(o=>[o.value,o.textContent]);JSON.stringify(i)!==JSON.stringify(t.choices.map(({id:o,name:r})=>[o,r]))&&n.replaceChildren(...t.choices.map(({id:o,name:r})=>{const s=document.createElement("option");return s.value=o,s.textContent=r,s})),n.value=t.selected,n.title=t.choices.find(o=>o.id===t.selected)?.name??"",n.disabled=re||Ne||ae||!1}async function pp(e){const t=C.document;if(!t?.design.namedPlans||re||Ne||ae||ye||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),i=document.activeElement===n;try{if(!S("source-dialog").hidden&&!await Ii()){$a();return}const o=sn(t.design.markdown,e),r=crypto.randomUUID(),s=Vt({...C,tabs:[],active:r},C.recovery,{...t,design:o},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await ki(()=>s,()=>{C=s}),Ue?.reopenBusinessOverview(),Ue?.activateBusiness(),Ue?.businessActivated(),$e("")}catch(o){Me(),o instanceof Rn||$e("案を切り替えられません: "+o.message,"error")}finally{i&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function wi(e){const t=C.document,n=Dl(C,e);return t?(await ki(()=>n,()=>{C=n,_n.add(tn(C.tabs[0])?.key??C.tabs[0].key)}),!0):(we(),C=n,_n.add(tn(C.tabs[0])?.key??C.tabs[0].key),Me(),Ae(),!0)}async function Wa(e,t){if(Pt&&!await Ii())return;const n=await Ji(e),i=ne();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await hi(i,n,t))return;Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),Ae();return}const o=Xn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await wi(o)}S("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])S("guide-"+e).onclick=()=>S(e).click();S("open-sample").onpointerdown=e=>e.stopPropagation();S("open-sample").onclick=async e=>{if(e.preventDefault(),!(re||Ne||ae))try{if(C.document?.source?.kind==="sample"&&C.document.design.markdown===Ar){we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),S("viewport").focus({preventScroll:!0});return}const t=sn(Ar),n=C.document?.source?.kind==="sample"&&C.document.design.markdown===js?C.tabs[0]:void 0;n&&we();const i=n??C.sampleLayout,o=i?Gu(i,t):{},r=Xn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await wi(r)&&S("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};S("open").onclick=async()=>{if(!(re||Ne||ae)){Ne=!0,Me();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Wa(await n.getFile(),n)}else S("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Ne=!1,Me()}}};S("fallback").onchange=async()=>{const e=S("fallback");if(!(re||Ne||ae)){Ne=!0,Me();try{for(const t of Array.from(e.files??[]))await Wa(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Ne=!1,Me()}};class Rn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function ki(e,t){if(ae||ye)throw Error("表示を切り替えています。完了後に再試行してください。");try{po()}catch(o){throw new Rn(o)}we(),clearTimeout(bn),bn=void 0,ae=!0,Lt++;const n=Lt;Me(),tt();let i=!1;try{const o=structuredClone(Ss(e()));await ja(o,n);const r=C;t(),C!==r&&(C=Ll(C,r)),ut==="view"&&Pt&&!C.tabs.some(s=>s.key===Pt)&&(Pt=C.tabs[0]?.key),Oa(o),i=!0}catch(o){throw Rs(),new Rn(o)}finally{ae=!1,Me(),tt(),i&&Lt!==n&&Ae(0,!1)}}async function hi(e,t,n=e.handle,i=!1){if(!nn(e)||e.design!==C.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=sn(t.markdown,e.design.namedPlans.selected));const o=!!e.design.namedPlans!=!!t.namedPlans,r=crypto.randomUUID(),s=C.document,a=o&&s?Vt({...C,tabs:[],active:r},C.recovery,{...s,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):Cl(C,t,n,i);return await ki(()=>a,()=>{C=a}),jn=void 0,yo(),$e(""),!0}async function Mr(e){if(!nn(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await hi(e,await Ji(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const r=()=>{o.remove(),n()};o.oncancel=r,o.onchange=async()=>{try{const s=o.files?.[0];s&&await hi(e,await Ji(s)),r()}catch(s){o.remove(),i(s)}},o.click()})}S("refresh").onclick=async()=>{const e=ne();if(re||ae||ye||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e)))return;Pt===e.key&&Yi();const t=Mn(e);Qt.add(t),Me();try{if(e.source?.kind==="url"){const i=await ro(e.source.url);await hi(e,i);return}if(!e.handle){await Mr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!nn(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Mr(e);return}await hi(e,await Ji(await e.handle.getFile()))}catch(n){nn(e)&&n.name!=="AbortError"&&!(n instanceof Rn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Qt.delete(t),Me()}};let ut="text",Pt,en=!1,gn=0,Zi,as=null;const Bt=()=>S("source-text"),bi=()=>S("source-url");function Ps(){es=!S("source-dialog").hidden&&ut!=="view"&&(ut==="text"?Bt().value:bi().value)!=="",tt()}bi().addEventListener("input",Ps);function gi(){cs();const e=ut==="view",t=en||ae;Bt().disabled=t,Bt().readOnly=e,S("source-dialog").dataset.mode=ut,S("source-submit").hidden=e,S("source-submit").textContent="表示",S("source-submit").disabled=t||e,S("source-cancel").disabled=ae||t&&ut!=="url",S("source-cancel").textContent=e?"閉じる":"キャンセル",Ps(),queueMicrotask(Va)}function Ts(e,t){if(!(re||Ne||ae||t&&Qt.has(Mn(t)))){Zi?.abort(),gn++,ut=e,Pt=t?.key,en=!1,as=document.activeElement,S("source-dialog").hidden=!1,S("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${C.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])S(n).hidden=e!=="url";for(const n of["text-label","source-text"])S(n).hidden=e==="url";S("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Bt().value=t.design.markdown:e==="text"&&(Bt().value=bo),gi(),(e==="url"?bi():Bt()).focus()}}let bo="",Pi;function fp(){if(as?.isConnected&&as.focus({preventScroll:!0}),Pi!==void 0&&cancelAnimationFrame(Pi),ut!=="view")return;const e=gn;Pi=requestAnimationFrame(()=>{if(Pi=void 0,e!==gn||!S("source-dialog").hidden)return;const t=window.visualViewport,n=Et.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Yi(){gn++,Zi?.abort(),en=!1,Pt=void 0,S("source-dialog").hidden=!0,gi(),fp()}async function Ii(){return ae?!1:(ut==="text"&&(bo=Bt().value),Yi(),!0)}function za(){return Ii()}Bt().oninput=()=>{ut==="text"&&(bo=Bt().value,Ps())};let Wi=!1;function Ua(){return re||Ne||en||ae||ye?"読込が終わってから共有してください。":Uu(ne())}function cs(){const e=Ua(),t=S("share-source");t.hidden=!ne(),t.setAttribute("aria-disabled",String(Wi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}S("share-source").onclick=async()=>{if(Wi)return;const e=Ua();if(e){$e(e,"warning");return}const t=ne();if(t.source?.kind!=="url")return;const n=t.source.url,i=Vu(location.href,n);Wi=!0,cs();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Wi=!1,cs()}};let Xt,$n=0,Rr=0,ci;function Va(){if(re||Ne||en||ye||ae||Xt||ci===void 0)return;const e=ci;ci=void 0,qs(e)}async function qs(e=location.hash){const t=e;if(re)return;const n=++Rr;if(!/^#source(?:=|$)/.test(t)){ci=void 0,Xt&&!ae&&(Xt.abort(),Xt=void 0,$n++,Ne=!1,Me());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),ae){ci=t;return}if(en||Ne&&!Xt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++$n;Xt?.abort();try{const o=Fu(t);po();const r=C.tabs.find(l=>l.source?.kind==="url"&&l.source.url===o),s=r;if(s){if(Pt&&Pt!==s.key&&!await Ii()||i!==$n||n!==Rr)return;const l=we()||C.active!==s.key;C.active=s.key,Me(),Ae(180,l),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),Si();return}Xt=new AbortController,Ne=!0,Me();const a=await ro(o,Xt.signal);if(i!==$n)return;const c=Xn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:a,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},a);if(!await wi(c))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===$n&&!(o instanceof Rn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===$n&&(Xt=void 0,Ne=!1,Me(),Va())}}window.addEventListener("hashchange",()=>{qs().then(()=>{C.document?.key===ds&&Si()})});function $s(e){C.drawer=!0,pt(),on()}async function mp(e){const t=yn(e);if(!(e.design.sourceFormat==="json"||t.busy||ae||re||ye===e)){t.busy=!0;try{await Ns(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,on()}}}let Qi;Ft.onchange=()=>{const e=Ft.files?.[0],t=Qi??ne();Qi=void 0,Ft.value="",!(!e||!t||!nn(t))&&($s(),Ra(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ft.oncancel=()=>{Qi=void 0};S("check-open").onclick=()=>{Qi=ne(),Ft.click()};let Ws,zi=null;function zs(){rn.hidden=!0,Ws=void 0,(zi&&!zi.closest("[hidden]")?zi:S("open-checks").getBoundingClientRect().width?S("open-checks"):S("document-actions-toggle")).focus({preventScroll:!0})}S("check-open-url").onclick=()=>{const e=ne();e&&(zi=ss??document.activeElement,Ws=e,S("check-url").value=yn(e).url??"",rn.hidden=!1,S("check-url").focus())};S("check-url-cancel").onclick=zs;rn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),zs())};S("check-url-form").onsubmit=e=>{e.preventDefault();const t=Ws;if(!t||!nn(t))return;const n=S("check-url").value.trim();yn(t).url=n,zs(),$s(),Ra(t,async()=>({name:n,url:n,markdown:await Ru(n)}))};S("check-open-sample").onclick=()=>{const e=ne();!e||!Ls(e)||($s(),La(e,{name:"チェックリストのサンプル",markdown:Hu}))};S("check-close").onclick=()=>{const e=ne();e&&mp(e)};S("open-sample-menu").onclick=()=>{S("open-sample").click()};S("view-markdown").onclick=()=>{const e=ne();e&&Ts("view",e)};S("open-url").onclick=()=>Ts("url");S("open-text").onclick=()=>Ts("text");S("source-cancel").onclick=()=>za();S("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),za())};S("source-submit").onclick=async()=>{if(en||ae||ut==="view"&&ye||S("source-dialog").hidden||ut==="view")return;en=!0,gi();const e=++gn,t=ut;Zi=new AbortController;try{const n=ut==="url"?new URL(bi().value.trim()).href:bi().value.trim();if(t==="url"&&C.document?.source?.kind==="url"&&C.document.source.url===n){Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Yi(),Me(),Si();return}const i=t==="url"?await ro(n,Zi.signal):Lu(Bt().value),o=i.markdown;if(e!==gn)return;const r=Xn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await wi(r))return;$e(""),t==="text"&&(bo=o),Yi()}catch(n){e===gn&&!(n instanceof Rn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===gn&&(en=!1,gi())}};S("layout-lock").onclick=()=>{re||(bt.cancel(),qe=void 0,we(),Rt=!Rt,pt(),vn())};S("selected-edges-only").onchange=()=>{const e=ne();!e||re||ae||ye===e||(bt.cancel(),qe=void 0,we(),e.selectedEdgesOnly=S("selected-edges-only").checked,mi(),Ae())};S("show-exceptions").onchange=()=>{const e=ne();!e||re||ae||ye===e||(bt.cancel(),qe=void 0,we(),e.showExceptions=S("show-exceptions").checked,mi(),Ae())};S("prefer-write").onchange=()=>{re||(we(),C.preferWrite=S("prefer-write").checked,vn(),Ae())};S("theme").onclick=()=>{re||(C.dark=!C.dark,pt(),Ae())};S("drawer").onclick=()=>{re||!ne()||(we(),C.drawer=!C.drawer,Me(),Ae())};for(const[e,t]of[["in",Ys],["out",1/Ys]])S(e).onclick=()=>{const n=ne();if(n&&ye!==n){const i=we(),o=Oc({zoom:n.zoom,scroll:n.scroll},t).zoom,r=i||o!==n.zoom;n.zoom=o,Me(),Ae(180,r)}};const je=S("viewport");function Fa(e,t){const n=ne();if(!n||ae||ye===n)return;we();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Ht();const o=Array.from(S("nodes").children).find(r=>r.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),mi()}const fn=Cc({read:()=>{const e=ne();return e&&!ae&&e!==ye&&!Rt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>ne()?.positions[e],connected:e=>Array.from(S("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=je.getBoundingClientRect(),t=e.left+je.clientLeft,n=e.top+je.clientTop,i={left:t,top:n,right:t+je.clientWidth,bottom:n+je.clientHeight};for(const[r,s]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const a=S(r),c=a.getBoundingClientRect();a.hidden||c.bottom<=n||c.top>=i.bottom||(s==="right"&&c.left>i.left&&c.left<i.right&&(i.right=c.left),s==="left"&&c.right>i.left&&c.right<i.right&&(i.left=c.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:Fa,pan:e=>{const t=ne();if(!t||t===ye||Rt)return;we();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],we(),Ht()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),bt=jc(je,{nodeDrag:fn,read:()=>{const e=ne();return e&&!ae&&ye!==e?{key:e.key,zoom:e.zoom,locked:Rt,scroll:[je.scrollLeft,je.scrollTop]}:void 0},position:e=>ne()?.positions[e],change:e=>{const t=ne();if(!t||ae||ye===t)return;const n=t.scroll;let i=!1;e.node&&Fa(e.node.id,e.node.position),e.selected&&(ft().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Zn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?vn():e.zoom!==void 0&&Gt(t),e.scroll&&(je.scrollLeft=e.scroll[0],je.scrollTop=e.scroll[1]),we(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ht()},finish:()=>{const e=ne();e&&Gt(e),we(),Ae(180,!1)}}),Us=()=>{bt.cancel(),qe=void 0,we(),Ae(0,!1)};window.addEventListener("blur",Us);window.addEventListener("pagehide",Us);document.addEventListener("visibilitychange",()=>{document.hidden&&Us()});je.onscroll=()=>{we()};let qe;Dc(je,{read:()=>{const e=ne();return e&&!re&&!ae&&e!==ye?{zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop]}:void 0},change:e=>{const t=ne();!t||ae||t===ye||(bt.cancel(),fn.cancel(),qe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],we(!1),Ht(),Ae(180,!1))}});je.onpointerdown=e=>{const t=ne(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||ae||t===ye||n&&!Rt||(qe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[je.scrollLeft,je.scrollTop],node:n,moved:!1},je.setPointerCapture(e.pointerId))};je.onpointermove=e=>{if(qe&&qe.pointer===e.pointerId&&qe.key===ne()?.key&&ne()!==ye){const t=e.clientX-qe.x,n=e.clientY-qe.y;Math.hypot(t,n)>3&&(qe.moved=!0),je.scrollLeft=qe.scroll[0]-t,je.scrollTop=qe.scroll[1]-n,we()}};je.onpointerup=e=>{if(!qe||qe.pointer!==e.pointerId)return;const t=ne(),n=qe;qe=void 0,je.hasPointerCapture?.(e.pointerId)&&je.releasePointerCapture(e.pointerId),t&&t!==ye&&n.key===t.key&&!n.moved&&n.node&&(ft().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ht()),Zn(n.node),vn()),we(),Ae(180,!1)};je.onpointercancel=()=>{qe=void 0};je.addEventListener("lostpointercapture",e=>{e.target===je&&qe?.pointer===e.pointerId&&(qe=void 0)});let go=!1;S("resize").onpointerdown=e=>{re||(go=!0,S("resize").setPointerCapture(e.pointerId))};S("resize").onpointermove=e=>{if(go){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==C.width&&(C.width=t,Ht()),pt()}};S("resize").onpointerup=()=>{go=!1,Ae(180,!1)};S("resize").onpointercancel=()=>{go=!1,Ae(180,!1)};S("resize").onkeydown=e=>{if(!re&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,C.width+(e.key==="ArrowLeft"?20:-20)));t!==C.width&&(C.width=t,Ht()),pt(),Ae(180,!1)}};window.addEventListener("resize",()=>{pt();const e=ne();e&&Gt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=ne();t&&Gt(t)});e.observe(S("viewport")),e.observe(document.querySelector(".toolbar"))}function Ti(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=sn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Hn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Yn=document.createElement("section");Yn.id="source-update-notice";Yn.className="info-bar";Yn.hidden=!0;Yn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Yn);let jn;const Ba=new Set;let No=0,ds,Po;function yo(){const e=C.document;Yn.hidden=!jn||jn.key!==e?.key||jn.baseline!==e.design.markdown||Ba.has(e.key),S("source-update-refresh").disabled=re||Ne||ae||!!(e&&Qt.has(e.key))}S("source-update-close").onclick=()=>{jn&&Ba.add(jn.key),yo()};S("source-update-refresh").onclick=()=>{S("refresh").click()};async function Si(){const e=C.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Po===t)return;Po=t;const n=++No,i=e.key,o=e.source.url,r=e.design.markdown;try{const s=await Es(o);if(n!==No||C.document?.key!==i||C.document.design.markdown!==r||C.document.source?.kind!=="url"||C.document.source.url!==o)return;sn(s),jn=s.replace(/\r\n?/g,`
`)!==r.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:r}:void 0,yo()}catch{}finally{n===No&&(Po=void 0)}}Ue=ll(Et,{rightDrawer:{isOpen:()=>C.drawer,isReady:()=>!re,setOpen:e=>{re||(C.drawer=e,pt(),Ae())}},capture:()=>{we(),bt.cancel(),qe=void 0},business:()=>({key:C.document?.design.namedPlans?JSON.stringify([C.document.key,C.document.design.namedPlans.selected]):C.document?.key,design:C.document?.design,relatedChecks:C.tabs[0]?zl(C.tabs[0]):[],viewKey:ne()?.key,views:C.tabs.map(e=>({key:e.key,name:e.name,activity:Gi(e),object:Hi(e)})),activities:C.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:C.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:C.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!C.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=C.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{rs(e),$i(e)},openObject:e=>{qa(e),$i(e)},openOverview:()=>{C.tabs[0]&&(we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),Ae())},activateView:e=>{C.tabs.some(t=>t.key===e)&&(we(),C.active=e,Me(),Ae())},statePanel:e=>C.document?ml(C.document.design,e,t=>{Ue?.activateBusiness(),rs(t),$i(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{C.nodeDrawer=!1,pt()},refresh:()=>{pt(),Qo.update()}});const hp=C;Me();tt();Sl().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])Ti(l);if(t.document){const l={...t.document};Ti(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)Ti(l)}const n=jl(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const l of i.tabs)Ti(l);if(new Set(i.tabs.map(l=>l.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(d=>typeof d=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(d=>Number.isFinite(d)&&d>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(d=>Number.isFinite(d)&&d>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(d=>Array.isArray(d)&&d.length===2&&d.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:r,scopeOutside:s,...a}=i,c=l=>({...l,hiddenNodes:l.hiddenNodes??(i.scopeOutside==="hide"?l.design.graph.nodes.filter(d=>d.scope===!1).map(d=>d.id):[])});C=Vt({...a,tabs:i.tabs.map(c)},n.recovery,n.document,i.tabs.map(l=>{const{design:d,checks:f,source:g,draft:u,edited:b,handle:m,name:p,...h}=c(l);return h})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(C.sampleLayout={...i.sampleLayout,hiddenNodes:sn(js).graph.nodes.filter(l=>l.scope===!1).map(l=>l.id)}),C.tabs.some(l=>l.key===C.active)||(C.active=C.tabs[0]?.key),ne()?.selected&&Zn(ne().selected),ds=C.document?.key,Me(),Ds=!0}).catch(()=>{C=hp,Jn=!0,Cs()}).finally(()=>{re=!1,Me(),tt(),qs().then(()=>{C.document?.key===ds&&Si()})});
