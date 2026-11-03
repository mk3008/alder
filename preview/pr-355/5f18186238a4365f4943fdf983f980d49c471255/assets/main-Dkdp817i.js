import{L as Lr,D as sc,G as rc,W as ac,P as cc,l as Kn,X as Nr,C as dc,n as lc,S as Pr,o as Tr,p as qr,M as $r,q as Wr,s as zr,t as ls,g as us,r as To,d as Ur,b as Ui,u as ps,U as Vr,v as uc,w as Fr,x as Br,y as qo,z as pc,m as fs,A as fc,B as Gr,E as mc,j as hc,F as Zs,H as bc,T as gc,I as yc,J as vc,R as wc,K as kc,N as Ic,O as Sc,Q as xc,V as Ac,Y as Ec,Z as Ys,k as Oc,i as jc,h as Dc,f as Cc,a as Mc,_ as Rc,$ as Lc,a0 as Hr,a1 as Nc,a2 as Pc,a3 as Tc,a4 as qc,e as $c}from"./canvas-toolbar-DBjSxaGB.js";const Wc={subsystems:{full:"サブシステム",icon:cc},business:{full:"業務設計",icon:ac},states:{full:"状態遷移",icon:rc},concept:{full:"データ構造",icon:sc},tests:{full:"テスト仕様",icon:Lr}};function $o(e,t,n){const i=Wc[t],o=document.createElement("span"),r=document.createElement("span"),s=document.createElement("span");o.className="view-tab-label",r.className="view-tab-kind",r.setAttribute("aria-hidden","true"),r.append(Kn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),s.className="view-tab-name",s.textContent=n,o.append(r,s),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function Wo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Kn(Nr,{"aria-hidden":"true","stroke-width":1.8})),t}function zc(e){const t=Kn(e?dc:lc,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Uc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,r=e.scrollLeft,s=Math.max(0,Math.min(n,r+i*o));s!==r&&(e.scrollLeft=s,t.preventDefault())},{passive:!1})}function Vc(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const Fc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Qs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=Fc,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,r)=>{const s=Kn(o,{"stroke-width":1.8,"aria-hidden":"true"});r&&s.classList.add(r),t.querySelector(i)?.append(s)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Pr),n(".layout-lock",Tr,"lock-closed"),n(".layout-lock",qr,"lock-open"),n(".zoom-out",$r),n(".zoom-in",Wr)}function er(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Bc({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(u=>u.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),i=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(u=>["",u]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:a.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),o=a=>i.find(l=>l.id===a),r=(a,l)=>{const u=Object.fromEntries(a.nodes.map(c=>[c.id,{...l[c.conceptId],name:c.name,note:c.description,sources:c.sources,conceptId:c.conceptId,subsystemId:c.subsystemId,fields:c.fields.map(h=>["",h.name])}])),p=e.subsystems.filter(c=>a.nodes.some(h=>h.subsystemId===c.id)).map(c=>({id:c.id,name:c.name})),g=a.handoffIds.map(c=>e.handoffs.find(h=>h.id===c)).map(c=>({id:c.id,from:c.fromSubsystemId,to:c.toSubsystemId,label:c.information,returning:c.flowDirection==="return"}));return{ids:a.nodes.map(c=>c.id),tables:u,edges:a.edges.map(c=>[c.fromViewId,c.toViewId,c.fromLabel,c.toLabel,c.kind]),regions:p,handoffs:g}};return{tables:t,edges:n,groups:i,findGroup:o,graph:a=>{const l=o(a);if(!l)throw Error("Unknown review group: "+a);const u=e.reviewGroups.find(c=>c.id===a),p=u.graph.subsystemViews;if(p)return r(p,l.concepts);const g=Object.keys(t).filter(c=>Object.hasOwn(l.concepts,c));return{ids:g,tables:l.concepts,edges:l.relations.filter(([c,h])=>g.includes(c)&&g.includes(h)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?r(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function dt(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Gc(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",dt(i,"span",t),i.onclick=n,e.append(i),i}function Hc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Jc(e,t,n,i=()=>{},o=()=>{},r=[]){const s=n.contentFor(t.id);if(e.replaceChildren(),!s)return;dt(e,"p",s.description).className="review-description",dt(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of s.relatedActivities){const l=document.createElement("li"),u=r.find(g=>g.id===a.id&&g.name===a.name),p=Gc(l,a.name,()=>{u&&o(u.id)});p.disabled=!u,p.setAttribute("aria-label",a.name+"を業務タブで開く"),d.append(l)}e.append(d),dt(e,"h3","情報の構造");for(const a of s.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=a.id,dt(l,"h4",a.title),dt(l,"p",a.description),e.append(l)}dt(e,"h3","できること");for(const a of s.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=a.id,dt(l,"h4",a.title),dt(l,"p",a.description);for(const u of a.samples){const p=i(a.id,u.id),g=document.createElement("button");g.className="review-sample-link",g.type="button",g.dataset.sample=u.id,g.textContent=(p?.kind==="decision"?"可否判定：":"サンプル：")+u.name,p?g.onclick=p.open:(g.disabled=!0,g.title="対応するテスト仕様へのリンクがありません"),l.append(g)}e.append(l)}dt(e,"h3","できないこと（業務上のルール）");for(const a of s.limitations){const l=document.createElement("section");l.className="review-limitation",dt(l,"h4",a.title),dt(l,"p",a.description),dt(l,"h5","理由"),dt(l,"p",a.reason),e.append(l)}}function un(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function _c({model:e,business:t}){const n=s=>s.kind==="group"?e.subsystems.find(d=>d.id===s.id):e.handoffs.find(d=>d.id===s.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(s){const d=n(s);return d?d.activityIds.map(a=>t.activities.find(l=>l.id===a)).filter(Boolean):[]}function r(s,d){if(s.replaceChildren(),d.kind==="group"){const p=e.subsystems.find(c=>c.id===d.id);if(!p)return"";un(s,"p",p.purpose),un(s,"h3","扱う情報");const g=s.ownerDocument.createElement("ul");for(const c of p.information)un(g,"li",c);return s.append(g),un(s,"h3","まとまりの理由"),un(s,"p",p.reason),p.name}const a=e.handoffs.find(p=>p.id===d.id);if(!a)return"";un(s,"p",a.description),un(s,"h3","出元と受取先");const l=e.subsystems.find(p=>p.id===a.fromSubsystemId),u=e.subsystems.find(p=>p.id===a.toSubsystemId);return un(s,"p",`${l.name} → ${u.name}`),a.information}return{sections:i,activities:o,describe:r}}function tr(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const r=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},s=(d,a=!1)=>{if(o=Math.max(280,Math.min(r(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(r())),i.setAttribute("aria-valuenow",String(Math.round(o))),a)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),s(d.key==="Home"?280:d.key==="End"?r():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,l=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=u=>s(l+a-u.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),s(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>s(o));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>s(o)),s(o)}const Kc=260,Xc=68,Zc="http://www.w3.org/2000/svg",zt=(e,t,n={})=>{const i=e.createElementNS(Zc,t);for(const[o,r]of Object.entries(n))i.setAttribute(o,String(r));return i};function Yc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Kn(Vr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Qc(e,{model:t,business:n},i,o,r){const s=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(k=>{const w=s.find(E=>E.id===k.from),A=s.find(E=>E.id===k.to);if(!w||!A||w.subsystemId!==A.subsystemId||!t.presentation.reviewBoundaries.some(E=>E.from===k.from&&E.to===k.to))throw Error("Unknown overview relationship: "+k.from+" -> "+k.to);return k}),l=t.handoffs.map(k=>{if(!["forward","return"].includes(k.flowDirection))throw Error("Unknown overview handoff direction: "+k.id);return{id:k.id,from:k.fromSubsystemId,to:k.toSubsystemId,label:k.information,returning:k.flowDirection==="return"}});if(new Set(l.map(k=>k.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const k of l)if(!d.some(w=>w.id===k.from)||!d.some(w=>w.id===k.to)||k.from===k.to||!k.label.trim())throw Error("Unknown overview handoff: "+k.id);for(const k of s){if(!d.some(w=>w.id===k.subsystemId))throw Error("Unknown overview subsystem: "+k.id);if(!n.roles?.some(w=>w.id===k.reviewer.roleId))throw Error("Unknown overview reviewer: "+k.id)}const u=d.flatMap(k=>s.filter(w=>w.subsystemId===k.id)),p=new Map;let g=0;for(const[k,w]of d.entries())for(const A of u.filter(E=>E.subsystemId===w.id))p.set(A.id,[80+g*170,100+g*120+k*64]),g++;const c=ls(),h="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,f;try{const k=JSON.parse(localStorage.getItem(h)||"null"),w=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),A=!k&&w?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,E=k??A;if(E){typeof E.zoom=="number"&&Number.isFinite(E.zoom)&&(c.zoom=Math.max(.25,Math.min(2.5,E.zoom))),Array.isArray(E.scroll)&&E.scroll.length===2&&E.scroll.every(N=>typeof N=="number"&&Number.isFinite(N))&&(c.scroll=E.scroll),typeof E.locked=="boolean"&&(c.locked=E.locked);for(const[N,Q]of Object.entries(E.positions??{}))s.some(U=>U.id===N)&&Array.isArray(Q)&&Q.length===2&&Q.every(U=>typeof U=="number"&&Number.isFinite(U))&&c.positions.set(N,[Q[0],Q[1]])}const $=E?.selection,L=$?.kind==="node"?t.concepts.find(N=>N.id===$.id)?.subsystemId:$?.id,j=$?.kind==="node"?"group":$?.kind;typeof L=="string"&&(j==="model"&&s.some(N=>N.id===L)||j==="group"&&d.some(N=>N.id===L)||j==="connection"&&l.some(N=>N.id===L))&&(f={kind:j,id:L}),f?.kind==="model"&&(c.selected=f.id)}catch{}const b=()=>{try{localStorage.setItem(h,JSON.stringify({zoom:c.zoom,scroll:c.scroll,locked:c.locked,positions:Object.fromEntries(c.positions),selection:f}))}catch{}},x=k=>{if(!k&&!f)return;f=k,c.selected=k?.kind==="model"?k.id:void 0;const w=m?.querySelector(".diagram-world>svg");w&&v(w),b()},v=k=>{const w=Ui(a,c.selected),A=Ui(l,f?.kind==="group"?f.id:void 0);for(const E of s){const $=k.querySelector(`[data-node="${E.id}"]`);$?.setAttribute("class","node graph-shape state-shape"+w.nodeClasses(E.id)),$?.setAttribute("aria-pressed",String(c.selected===E.id))}for(const E of d){const $=k.querySelector(`[data-subsystem="${E.id}"]`);$?.setAttribute("class","subsystem-overview-group"+A.nodeClasses(E.id)),$?.querySelector("button")?.setAttribute("aria-pressed",String(f?.kind==="group"&&f.id===E.id))}for(const E of a){const $=k.querySelector(`[data-overview-from="${E.from}"][data-overview-to="${E.to}"]`);$?.setAttribute("class","edge"+(w.related(E)?" review-related":"")),$?.setAttribute("marker-end",`url(#overview-${w.related(E)?"related-arrow":"arrow"})`)}for(const E of l){const $=A.related(E)||f?.kind==="connection"&&f.id===E.id,L=k.querySelector(`[data-handoff-id="${E.id}"]`);L?.setAttribute("class","edge"+(E.returning?" exception":"")+($?" review-related":"")),L?.setAttribute("marker-end",`url(#overview-${$?"related-arrow":"arrow"})`),k.querySelector(`[data-handoff-label="${E.id}"]`)?.classList.toggle("review-related",!!$)}k.querySelectorAll("[data-exception-paint]").forEach(E=>E.remove());for(const E of Array.from(k.querySelectorAll("[data-handoff-id].exception")))ps(k,E,{path:E.getAttribute("d")},{"data-overview-return-paint":E.getAttribute("data-handoff-id")})};return m=zr(e,k=>{const w=u.map(j=>{const N=k.positions.get(j.id)??p.get(j.id);return{id:j.id,x:N[0],y:N[1],width:Kc,height:Xc}}),A=zt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});A.append(us("overview-"));let E=0,$=0;const L=[];for(const j of d){const N=w.filter(ye=>s.find(pe=>pe.id===ye.id)?.subsystemId===j.id);if(!N.length)continue;const Q=Math.min(...N.map(ye=>ye.x))-30,U=Math.min(...N.map(ye=>ye.y))-48,_=Math.max(...N.map(ye=>ye.x+ye.width))-Q+30,ee=Math.max(...N.map(ye=>ye.y+ye.height))-U+30;L.push({id:j.id,x:Q,y:U,width:_,height:ee});const Y=zt(e,"g",{"data-subsystem":j.id,"aria-label":j.name}),Z=zt(e,"rect",{x:Q,y:U,width:_,height:ee,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});Z.addEventListener("click",()=>x({kind:"group",id:j.id})),Y.append(Z);const ce=zt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:Q+8,y:U+3,width:_-16,height:36}),ue=e.createElement("button");ue.type="button",ue.className="subsystem-overview-region-title",ue.setAttribute("aria-label",j.name+"を選択"),ue.textContent=j.name,ue.onclick=()=>x({kind:"group",id:j.id}),ce.append(ue),Y.append(ce),A.append(Y),E=Math.max(E,Q+_+40),$=Math.max($,U+ee+40)}for(const[j,N]of l.entries()){if(!L.some(Y=>Y.id===N.from)||!L.some(Y=>Y.id===N.to))throw Error("Missing overview handoff region: "+N.id);const Q=Math.max(30,N.label.length*12),U=To({from:N.from,to:N.to,nodes:L,index:j,kind:"input",matrix:{returning:N.returning,captionLane:0},labelWidth:Q,labelHeight:18}),_=zt(e,"path",{d:U.path,class:"edge"+(N.returning?" exception":""),"data-handoff-id":N.id,"data-from-subsystem":N.from,"data-to-subsystem":N.to,"data-flow-direction":N.returning?"return":"forward","marker-end":"url(#overview-arrow)"});A.append(_);const ee=zt(e,"text",{x:U.label[0]-Q/2,y:U.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":N.id});ee.textContent=N.label,ee.addEventListener("pointerdown",Y=>Y.stopPropagation()),ee.addEventListener("pointerup",Y=>Y.stopPropagation()),ee.addEventListener("click",()=>x({kind:"connection",id:N.id})),ee.addEventListener("keydown",Y=>{(Y.key==="Enter"||Y.key===" ")&&(Y.preventDefault(),x({kind:"connection",id:N.id}))}),A.append(ee),E=Math.max(E,U.bounds.right+40,U.label[0]+Q/2+30),$=Math.max($,U.bounds.bottom+40,U.label[1]+30)}for(const[j,N]of a.entries()){const Q=To({from:N.from,to:N.to,nodes:w,index:j,kind:"input",labelWidth:0,labelHeight:0}),U=zt(e,"path",{d:Q.path,class:"edge","data-overview-from":N.from,"data-overview-to":N.to,"marker-end":"url(#overview-arrow)"});A.append(U),E=Math.max(E,Q.bounds.right+40),$=Math.max($,Q.bounds.bottom+40)}for(const j of w){const N=s.find(pe=>pe.id===j.id),Q=n.roles.find(pe=>pe.id===N.reviewer.roleId),U=zt(e,"g",{role:"button",tabindex:0,"aria-label":N.title+"を選択","aria-pressed":"false","data-node":j.id,"data-review-group":j.id,"data-subsystem-id":N.subsystemId,class:"node graph-shape state-shape"}),_=Ur(e,j);_.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),U.append(_,zt(e,"rect",{x:j.x,y:j.y,width:j.width,height:j.height,rx:8,class:"state-diagram-node"}));const Y=zt(e,"foreignObject",{x:j.x,y:j.y,width:j.width,height:j.height}),Z=e.createElement("div");Z.className="subsystem-overview-card";const ce=Yc(e,Q.color),ue=e.createElement("span");ue.className="subsystem-overview-labels",ue.title=N.title+" — "+Q.name;for(const[pe,q,B]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",N.title],["small","subsystem-overview-role",Q.name]]){const G=e.createElement(pe);G.className=q,G.textContent=B,ue.append(G)}const ye=e.createElement("button");ye.type="button",ye.className="subsystem-overview-open",ye.setAttribute("aria-label",N.title+"の詳細タブを開く"),ye.title="詳細タブを開く",ye.textContent="開く",ye.onpointerdown=pe=>pe.stopPropagation(),ye.onpointerup=pe=>pe.stopPropagation(),ye.onclick=pe=>{pe.stopPropagation(),o(N.id)},Z.append(ce,ue,ye),Y.append(Z),U.append(Y),U.addEventListener("click",()=>x({kind:"model",id:j.id})),U.addEventListener("keydown",pe=>{(pe.key==="Enter"||pe.key===" ")&&(pe.preventDefault(),x({kind:"model",id:j.id}))}),A.append(U)}return A.setAttribute("viewBox",`0 0 ${E} ${$}`),v(A),A},c,b,()=>x(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",b),m.addEventListener("pointerup",()=>queueMicrotask(b)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",b),{root:m,selected:()=>c.selected,selection:()=>f,restore:()=>{const k=()=>{const w=m.querySelector(".diagram-viewport");w.scrollLeft=c.scroll[0],w.scrollTop=c.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(k):k()}}}function ed(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const r=i.cells.find(s=>s.columnId===o.id);if(!r)throw Error("Missing sample cell: "+o.id);return r}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function td({model:e,business:t}){const n=h=>{const m=t.activities.find(f=>f.id===h);if(!m)throw Error("Unknown activity: "+h);return m},i=h=>{const m=t.roles?.find(f=>f.id===h);if(!m)throw Error("Unknown role: "+h);return m.name},o=e.reviewGroups.map(h=>({id:h.id,title:h.title,description:h.description,reviewer:{role:i(h.reviewer.roleId)},relatedActivities:h.relatedActivityIds.map(m=>{const f=n(m);return{id:f.id,name:f.name}}),structureStatements:h.structureStatements,capabilities:h.capabilities.map(m=>({...m,samples:m.samples.map(ed)})),limitations:h.limitations,meta:{questions:h.meta.questions}})),r=h=>o.find(m=>m.id===h),s=(h,m)=>r(h)?.capabilities.find(f=>f.samples.some(b=>b.id===m)),d=o.flatMap(h=>h.capabilities.flatMap(m=>m.samples.map(f=>({...f,group:h.id})))),a=["yellow","cyan","green","blue","purple","orange"];function l(h,m,f){let b=f.get(m);if(b||(b=a[f.size]??`extra-${f.size}`,f.set(m,b)),h.dataset.sampleKey=m,h.dataset.keyTone=b,h.className="data-example-key",b.startsWith("extra-")){const x=(Number(b.slice(6))*137.508%360).toFixed(2);h.style.setProperty("--sample-key-extra-light",`hsl(${x} 26% 78%)`),h.style.setProperty("--sample-key-extra-dark",`hsl(${x} 24% 25%)`)}}const u=h=>d.filter(m=>m.group===h),p=(h,m)=>u(h).find(f=>f.id===m);function g(h,m,f){const b=h.ownerDocument.createElement(m);return b.textContent=f,h.append(b),b}function c(h,m,f,b,x){const v=h.ownerDocument,D=p(m.id,f);if(!D)throw Error("Unknown data example: "+f);h.replaceChildren(),h.dataset.dataExample=f;const k=new Map;e.presentation.sampleCaption&&(g(h,"p",e.presentation.sampleCaption).className="data-example-caption");const w=r(m.id)?.capabilities??[],A=x?.capabilityId?w.filter(N=>N.id===x.capabilityId):w;if(x?.capabilityId&&!A.some(N=>N.samples.some(Q=>Q.id===f)))throw Error("Sample does not belong to capability: "+f);const E=s(m.id,f);h.dataset.capability=E.id;const $=()=>{g(h,"h2",x?.heading?.trim()||E.title),x?.renderSpecification?x.renderSpecification(h):g(h,"p",E.description).className="data-example-capability"};x?.capabilityId&&!x.hideCapability&&$();const L=v.createElement("label");L.className="data-example-picker",g(L,"span","場面");const j=v.createElement("select");j.setAttribute("aria-label","データ例の場面");for(const N of A){let Q=j;if(!x?.capabilityId){const U=v.createElement("optgroup");U.label=N.title,j.append(U),Q=U}for(const U of N.samples){if(x?.sampleIds&&!x.sampleIds.includes(U.id))continue;const _=v.createElement("option");_.value=U.id,_.textContent=U.name,Q.append(_)}}if(j.value=f,j.onchange=()=>b(j.value),L.append(j),(!x?.hideSinglePicker||j.options.length>1)&&h.append(L),!x?.capabilityId&&!x?.hideCapability&&$(),g(h,"h3",D.name).className="data-example-scene",x?.collapseScenario&&D.when){const N=v.createElement("details");N.className="data-example-context",g(N,"summary","場面の背景"),g(N,"p",D.when).className="data-example-when",h.append(N)}else g(h,"p",D.when).className="data-example-when";g(h,"p",D.meaning).className="data-example-meaning";for(const N of D.blocks){const Q=v.createElement("section");Q.className="data-example-block",Q.dataset.exampleCard=N.card,g(Q,"h3",m.concepts[N.card].name);const U=v.createElement("div");U.className="data-example-table",U.tabIndex=0,U.setAttribute("role","region"),U.setAttribute("aria-label",m.concepts[N.card].name+"のデータ表");const _=v.createElement("table");_.setAttribute("aria-label",m.concepts[N.card].name+"のデータ例");const ee=v.createElement("caption");ee.textContent=m.concepts[N.card].name+"に入る情報",_.append(ee);const Y=v.createElement("thead"),Z=v.createElement("tr");for(const ue of N.columns)g(Z,"th",ue).setAttribute("scope","col");Y.append(Z),_.append(Y);const ce=v.createElement("tbody");for(const[ue,ye]of N.rows.entries()){const pe=v.createElement("tr");for(const[q,B]of ye.entries()){const G=g(pe,"td",String(B)),ge=N.keyIds[ue][q];ge&&(l(G,ge,k),G.title=N.columns[q]+"："+B)}ce.append(pe)}_.append(ce),U.append(_),Q.append(U),N.rows.length||g(Q,"p",N.empty??"データはありません。"),h.append(Q)}D.note&&(g(h,"p",D.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:r,capabilityFor:s,examplesFor:u,findDataExample:p,renderDataExample:c}}function ms(e,t){const n=e.model?.business,i=n?.activities.find(r=>r.id===t);if(!i||"performers"in i)return;const o=typeof i.who=="object"&&i.who?.kind==="role"?i.who.roleId:"roleId"in i?i.roleId:void 0;return o?n?.roles?.find(r=>r.id===o):void 0}function nd(e,t,n){const i=e.model?.business.activities.find(o=>o.id===t);return i&&"who"in i&&typeof i.who=="object"&&i.who&&(i.who.kind==="system"||i.who.kind==="scheduler")?i.who.kind+":"+i.who.name:ms(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function id(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function et(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,r;const s=(d,a)=>{for(const l of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const u=document.createElement("strong");u.textContent=l.slice(2,-2),d.append(u)}else if(l.startsWith("`")&&l.endsWith("`")){const u=document.createElement("code");u.textContent=l.slice(1,-1),d.append(u)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!i){i=a[1],r=void 0;const g=document.createElement("pre");o=document.createElement("code"),g.append(o),n.append(g);continue}if(a&&a[1][0]===i[0]&&a[1].length>=i.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",r=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){r=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),u=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(u){r||(r=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(r));const g=document.createElement("li");s(g,u[1]),r.append(g);continue}r=void 0;const p=document.createElement(l?"h"+l[1].length:"p");s(p,l?l[2]:d),n.append(p)}return t&&n.querySelector("h1")?.remove(),n}function zo(e,t,n){if(t.performers===null)return"未決";const i=n===void 0?t.performers:n===null?t.performers.length===1?t.performers:[]:t.performers.filter(o=>n.includes(o.objectId));return i.length?i.map(o=>{const r=e.objects.find(d=>d.id===o.objectId).name,s=o.roleIds.map(d=>e.roles.find(a=>a.id===d).name);return s.length?`${r}（旧Role：${s.join("・")}）`:r}).join("、"):"未決"}function En(e,t){if("performers"in t)return"未決";if(typeof t.who=="string")return e.roles?.find(i=>"roleId"in t&&i.id===t.roleId)?.name??t.who;const n=t.who;return n?n.kind==="role"?e.roles?.find(i=>i.id===n.roleId)?.name??"未決":n.name:"未決"}function Jr(e,t){return t.dataId!==void 0?e.data?.find(n=>n.id===t.dataId)?.name??"未決":t.label??""}function od(e){const t=[];for(const n of e.activities){if(!("performers"in n))continue;const i=(l,u,p,g)=>t.push({id:`viewer:${l}:${n.id}`,displayId:"構造の要確認（表示のみ）",kind:u,status:"open",scope:"items",targets:[n.id],targetNames:[n.name],summary:p,content:g,unresolvedTargets:[]}),o=n.performers??[],r=new Set(o.flatMap(l=>l.roleIds)),s=[...o.length>1?["複数の担当Object"]:[],...r.size>1?["複数Role"]:[]];i("who",s.length?"correction":"question",s.length?`旧形式に${s.join("と")}があります。`:"Whoは未決です。",`旧形式の担当情報：${zo(e,n)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityの単一のWhoを、Role・システム・スケジューラーを含めて確認してください。入力や出力の相手からは決められません。`);const d=n.procedure.steps.filter(l=>l.performerObjectIds===null&&n.performers?.length!==1),a=n.procedure.steps.filter(l=>l.performerObjectIds!==null&&(l.performerObjectIds.length!==o.length||l.performerObjectIds.some(u=>!o.some(p=>p.objectId===u))));(d.length||a.length)&&i("steps",a.length?"correction":"question",a.length?"旧形式の手順の担当情報が異なります。":"旧形式の担当情報が未決の手順があります。",[d.length?`旧形式の担当情報が未決：${d.map(l=>l.text).join("、")}。`:"",a.length?`Activityと異なる旧形式の担当情報：${a.map(l=>l.text).join("、")}。責任境界が変わる場合はActivityの分割を検討してください。`:""].join(""))}return t}const ot=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n},nr=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]),ir=(e,t,n)=>e.slice(0,n+1).every((i,o)=>nr(i)===nr(t[o]));function _r(e,t){return e.kind!=="value"?e.kind==="else"?"それ以外":e.kind==="any"?"不問":"未決":typeof e.value=="boolean"?e.value?t.trueLabel??"true":t.falseLabel??"false":String(e.value)+(typeof e.value=="number"?t.unit??"":"")+{is:"",eq:"",gte:"以上",lte:"以下",gt:"超",lt:"未満"}[e.operator]}function sd(e){return e.rows.map((t,n)=>e.axes.map((i,o)=>{if(n>0&&ir(e.rows[n-1].conditions,t.conditions,o))return 0;let r=1;for(;n+r<e.rows.length&&ir(t.conditions,e.rows[n+r].conditions,o);)r++;return r}))}function hs(e,t){const n=ot("div");n.dataset.businessDecisionScroll="",n.tabIndex=0,n.setAttribute("role","region"),n.setAttribute("aria-label",e.title);const i=ot("table");i.dataset.businessDecisionTable="";const o=ot("thead"),r=ot("tr"),s=ot("th","条件");s.colSpan=e.axes.length,s.scope="colgroup",r.append(s);for(const p of["結果","Check"]){const g=ot("th",p);g.rowSpan=2,g.scope="col",p==="結果"&&(g.dataset.decisionResult=""),r.append(g)}o.append(r);const d=ot("tr");for(const p of e.axes){const g=ot("th",p.name);g.scope="col",d.append(g)}o.append(d),i.append(o);const a=ot("tbody"),l=sd(e);let u=!1;for(const[p,g]of e.rows.entries()){const c=ot("tr");c.dataset.decisionRow=g.id,g.conditions.forEach((f,b)=>{const x=l[p][b];if(!x)return;const v=ot("td",_r(f,e.axes[b]));x>1&&(v.rowSpan=x),c.append(v)});const h=ot("td",g.result.text??"未決");h.dataset.decisionResult="",h.dataset.resultKind=g.result.kind,c.append(h);const m=g.checkRefs.map(f=>{const b=t.flatMap(x=>x.items).find(x=>x.id===f.checkId);return f.coverage==="partial"&&(u=!0),(b?.checkId??f.checkId)+(f.coverage==="partial"?"*":"")});c.append(ot("td",m.join("、")||"—")),a.append(c)}if(i.append(a),n.append(i),u){const p=ot("p","*：この業務で扱う範囲のみ");p.className="decision-footnote",n.append(p)}return n}function bs(e,t,n){return[...new Set(e.rows.flatMap(o=>o.result.exceptionIds))].flatMap(o=>{const r=t.exceptions?.find(a=>a.id===o);if(!r)return[];const s=n.flatMap(a=>a.items).filter(a=>Object.values(a.fields).some(l=>l.some(u=>u.kind==="reference"&&u.targetId===o))).map(a=>a.checkId),d=ot("p",r.description+(s.length?" （"+[...new Set(s)].join("、")+"）":""));return d.className="decision-exception",[d]})}const xe={type:"string"},z={type:"string",minLength:1,pattern:"\\S"},T={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Se=e=>({anyOf:[e,{type:"null"}]}),F=e=>({type:"array",items:e}),W=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),rd=e=>({$ref:"#/$defs/"+e}),Wn=F({anyOf:[W({kind:{enum:["text"]},value:xe}),W({kind:{enum:["reference"]},targetId:T,label:xe}),W({kind:{enum:["link"]},uri:z,label:xe})]}),Vi=W({id:T,name:z,scope:{type:"boolean"}}).properties,gs=W({id:T,kind:{enum:["input","output","business-exception","object-exception"]},fromId:T,toId:T,label:z}),ad=W({id:T,sourceId:T,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:F(T),unresolvedTargets:F(z),summary:z,content:z}),Uo=W({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:z,title:z,preface:xe,scope:xe,objects:F(W({...Vi,icon:z,information:F(z)})),activities:F(W({...Vi,why:z,when:z,who:z,where:z,procedure:z,exception:Se(z),result:z,problem:Se(z),painLevel:Se({enum:["Low","Medium","High"]})})),relations:F(gs),findings:F(ad)}),cd=W({id:T,name:z,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Kr=W({...Uo.properties,schemaVersion:{enum:["0.2"]},roles:F(cd),activities:F(W({...Uo.properties.activities.items.properties,roleId:Se(T)}))}),eo=W({...Kr.properties,schemaVersion:{enum:["0.3"]},exceptions:F(W({id:T,activityId:T,name:z,description:xe}))}),lt=e=>({...F(e),minItems:1}),Xr=W({id:T,name:z,description:xe}),ys={anyOf:[W({kind:{enum:["before"]},beforeId:T,afterId:T}),W({kind:{enum:["interchangeable"]},stepIds:{...F(T),minItems:2}})]},Zr=Object.fromEntries(Object.entries(eo.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),dd=W({objectId:T,roleIds:F(T)}),ld=W({id:T,text:z,obligation:{enum:["required","optional"]},appliesWhen:Se(z),performerObjectIds:Se(lt(T))}),Yr=W({id:T,name:z,items:lt(W({informationId:T,condition:Se(z)}))}),ud=W({...eo.properties,schemaVersion:{enum:["0.4"]},objects:F(W({...Vi,icon:z,information:F(Xr)})),activities:lt(W({...Zr,performers:Se(lt(dd)),procedure:W({steps:lt(ld),orderRules:F(ys)}),results:lt(W({id:T,text:z}))})),data:F(Yr),relations:F({anyOf:[W({id:T,kind:{enum:["input","output"]},fromId:T,toId:T,dataId:T}),W({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),pd={anyOf:[W({kind:{enum:["role"]},roleId:T}),W({kind:{enum:["system","scheduler"]},name:z}),{type:"null"}]},fd={anyOf:[W({kind:{enum:["interaction"]},phase:Se({enum:["request","response","not-applicable"]}),direction:{enum:["input","output"]},objectId:T,dataIds:Se(F(T)),relationId:Se(T),pairedStepId:Se(T)}),W({kind:{enum:["internal"]}}),W({kind:{enum:["unresolved"]}})]},or={anyOf:[W({kind:{enum:["who"]}}),W({kind:{enum:["object"]},objectId:T})]},md=W({from:Se(or),to:Se(or)}),Vo=W({id:T,action:z,method:Se(z),whatDataIds:Se(F(T)),legacyText:z,obligation:{enum:["required","optional"]},appliesWhen:Se(z),effect:Se({enum:["create","read","update","delete","not-applicable","undecided"]}),exchange:fd,parties:md},["id","action","method","whatDataIds","obligation","appliesWhen","effect","exchange"]),hd=W({trigger:Se(z),onInterrupt:Se(z),outcome:Se({enum:["resume","continue","end"]}),resumeCondition:Se(z),resumeAction:Se(z),interruptedAtStepId:Se(T),resumeAtStepId:Se(T),retainedDataIds:Se(F(T))}),bd=W({id:T,activityId:T,name:z,description:xe,continuity:hd},["id","activityId","name","description"]),sr={...Vi,scope:Se({type:"boolean"})},Fo=W({...eo.properties,schemaVersion:{enum:["0.5"]},objects:F(W({...sr,icon:z,information:F(Xr)})),activities:lt(W({...Zr,...sr,who:pd,procedure:W({steps:lt(Vo),orderRules:F(ys)}),results:lt(W({id:T,text:z}))})),exceptions:F(bd),data:F(Yr),relations:F({anyOf:[W({id:T,kind:{enum:["input","output"]},fromId:T,toId:T}),W({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),gd={anyOf:[z,{type:"number"},{type:"boolean"}]},yd={anyOf:[W({axisId:T,kind:{enum:["value"]},operator:{enum:["is","eq","gte","lte","gt","lt"]},value:gd}),...["else","any","undecided"].map(e=>W({axisId:T,kind:{enum:[e]}}))]},vd=W({id:T,name:z,dataIds:F(T),unit:xe,trueLabel:z,falseLabel:z},["id","name","dataIds"]),wd=W({kind:{enum:["accepted","error","value","undecided"]},text:Se(z),dataIds:F(T),exceptionIds:F(T)}),kd=W({id:T,conditions:lt(yd),result:wd,checkRefs:F(W({checkId:T,coverage:{enum:["full","partial"]}}))}),vs=W({decisionId:T,rowId:T}),Id=W({id:T,title:z,kind:{enum:["authorization","validation","algorithm"]},note:Se(z),appliesWhen:Se(vs),axes:lt(vd),rows:lt(kd)}),Sd=W({stepId:T,whenDecision:Se(vs)}),xd=W({...Vo.properties,decisionIds:F(T),whenDecision:Se(vs),dependsOn:Se(F(Sd))},[...Vo.required,"decisionIds","whenDecision"]),Ad=W({...Fo.properties,schemaVersion:{enum:["0.6"]},activities:lt(W({...Fo.properties.activities.items.properties,procedure:W({steps:lt(xd),orderRules:F(ys)}),decisions:F(Id)}))}),Ed=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Wn])),Od=W({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:z,title:z,basedOn:W({documentId:T,revision:z,verification:{enum:["unverified"]}}),intro:Wn,index:F(W({activityId:T,purpose:xe,connections:xe,checkIds:F(T)})),sections:F(W({id:T,activityId:Se(T),title:z,preamble:Wn})),guarantees:F(W({id:T,sectionId:T,title:z,blocks:F({anyOf:[W({kind:{enum:["prose"]},content:Wn}),W({kind:{enum:["example"]},exampleId:T})]})})),examples:F(W({id:T,guaranteeId:T,columns:F(z),rows:F(F(Wn))})),items:F(W({id:T,checkId:T,title:z,detailSummary:xe,sectionId:T,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:W(Ed,[])})),notes:F(W({id:T,title:z,content:Wn}))}),ws=W({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:z,title:z,basedOn:W({documentId:T,revision:z,verification:{enum:["unverified"]}}),objectId:T,states:F(W({id:T,name:z})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:z,transitions:F(W({id:T,sourceId:z,fromId:z,activityId:T,event:Se(z),exception:Se(z),condition:z,toId:z,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:z,note:z}))}),rr=Object.fromEntries(Object.entries({...ws.properties.transitions.items.properties,exceptionId:Se(T)}).filter(([e])=>e!=="exception")),jd=W({...ws.properties,schemaVersion:{enum:["0.2"]},transitions:F(W({...rr,conditionLabel:z},Object.keys(rr)))}),ks=W({documentId:T,revision:z,targetType:z,targetId:T,section:z}),Dd=W({id:T,name:z,responsibilityStatus:z,responsibleSubsystemId:T},["id","name"]),Cd=W({id:T,name:z,subsystemId:T,information:F(Dd),reason:xe,description:xe,businessObjectIds:F(T),activityLinks:F(W({activityId:T,uses:F(z)})),sourceRefs:F(ks),reviewState:z}),Md=W({id:T,fromConceptId:T,toConceptId:T,fromPerTarget:z,toPerSource:z,condition:xe,reviewState:z,sourceRefs:F(ks),fromLabel:z,toLabel:z,kind:{enum:["down","reference"]}}),Rd=W({id:T,name:z,purpose:xe,information:F(z),reason:xe,activityIds:F(T),reviewState:z}),Ld=W({id:T,fromSubsystemId:T,toSubsystemId:T,information:z,description:xe,activityIds:F(T),flowDirection:{enum:["forward","return"]},reviewState:z}),Nd=W({columnId:T,value:{anyOf:[xe,{type:"number"}]},linkId:z},["columnId","value"]),Pd=W({card:T,columns:F(W({id:T,name:z,informationId:T})),rows:F(W({id:T,cells:F(Nd)})),empty:xe},["card","columns","rows"]),Bo=W({id:T,name:z,when:xe,meaning:xe,blocks:F(Pd),note:xe},["id","name","when","meaning","blocks"]),Go=W({id:T,title:z,description:xe,meta:{},samples:F(Bo)}),Td=W({...Bo.properties,checkIds:{...F(T),minItems:1,uniqueItems:!0}},[...Bo.required,"checkIds"]),qd=W({decisionExampleIds:F(T),decisionCheckIds:F(T),resultCheckIds:F(T),sampleIds:F(T)}),$d=W({...Go.properties,samples:F(Td),testSpecification:qd},[...Object.keys(Go.properties)]),Wd=W({id:T,title:z,description:xe,reason:xe,meta:{}}),zd=W({conceptId:T,name:z,fields:F(z),description:xe,sources:F(z),sourceActivityIds:F(T)}),Ud=W({id:T,fromConceptId:T,toConceptId:T,relationIds:F(T),scope:xe,fromLabel:z,toLabel:z,kind:{enum:["down","reference"]}}),Vd=W({id:T,conceptId:T,subsystemId:T,name:z,description:xe,sources:F(z),fields:F(W({name:z,informationId:T}))}),Fd=W({id:T,fromViewId:T,toViewId:T,relationIds:F(T),fromLabel:z,toLabel:z,kind:{enum:["down","reference"]}}),Qr=W({nodes:F(Vd),edges:F(Fd),handoffIds:F(T)}),ea=W({id:T,subsystemId:T,title:z,description:xe,reviewer:W({roleId:T}),relatedActivityIds:F(T),graph:W({conceptIds:F(T),nodes:F(zd),edges:F(Ud),subsystemViews:Qr},["conceptIds","nodes","edges"]),structureStatements:F(W({id:T,title:z,description:xe,sampleIds:F(T),sourceRefs:F(ks)})),capabilities:F(Go),limitations:F(Wd),meta:W({questions:F(z),hypotheses:{}},["questions"])}),Bd=W({...ea.properties,capabilities:F($d)}),ta=W({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:z,basedOn:W({documentId:T,revision:z,verification:{enum:["unverified"]}}),relatedStates:F(W({documentId:T,revision:z,verification:{enum:["unverified"]}})),subsystems:F(Rd),concepts:F(Cd),relations:F(Md),handoffs:F(Ld),reviewGroups:F(ea),benefits:F(z),considerations:F(z),reviewPoints:F(z),meta:{},presentation:W({activityViews:{},creatorActivityIds:{},sampleCaption:xe,subsystemViews:Qr,landscapeRelationships:F(W({from:T,to:T})),reviewBoundaries:F(W({from:T,to:T,label:xe,promise:xe}))},["landscapeRelationships","reviewBoundaries"])}),Gd=W({...ta.properties,schemaVersion:{enum:["0.2"]},reviewGroups:F(Bd)}),An=(e,t)=>W({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:z,documents:F({anyOf:t.map(rd)}),sources:F(W({documentId:T,revision:z,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:xe})),externalDocuments:F(W({id:T,kind:{enum:["businessDesign"]},revision:z,activities:F(W({id:T,name:z}))})),diagnostics:F(z)}),di={anyOf:[An("0.1",["businessDesign","checkItems"]),An("0.2",["businessDesign","checkItems","stateTransition"]),An("0.3",["businessDesignRoles","checkItems","stateTransition"]),An("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.5",["oldStructuredBusinessDesign","checkItems","stateTransitionStructured"]),An("0.6",["procedureBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.7",["decisionBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Uo,businessDesignRoles:Kr,businessDesignStructured:eo,oldStructuredBusinessDesign:ud,procedureBusinessDesign:Fo,decisionBusinessDesign:Ad,checkItems:Od,stateTransition:ws,stateTransitionStructured:jd,conceptModel:ta,checkedConceptModel:Gd}},nt=(e,t)=>P(new Set(e).size===e.length,t),Dn=(e,t)=>P(e.length>0,t),ar=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]);function na(e,t){if(!t.whenDecision||t.dependsOn!=null)return null;const n=e.procedure.steps.filter(i=>i.decisionIds?.includes(t.whenDecision.decisionId));return n.length===1&&e.procedure.steps.indexOf(n[0])>e.procedure.steps.indexOf(t)?n[0]:null}function Hd(e,t){const n=e.procedure.steps,i=n.map(l=>l.id),o=new Map(i.map(l=>[l,[]])),r=new Set,s=new Set,d=[];Dn(n,"Procedure requires a Step: "+e.id);for(const l of e.procedure.orderRules)if(l.kind==="before"){t(l.beforeId,"step",e.id),t(l.afterId,"step",e.id),P(l.beforeId!==l.afterId,"Self Step order");const u=JSON.stringify([l.beforeId,l.afterId]);P(!r.has(u),"Duplicate Step order"),r.add(u),P(i.indexOf(l.beforeId)<i.indexOf(l.afterId),"Standard Step order contradicts before constraint"),o.get(l.beforeId).push(l.afterId)}else{P(l.stepIds.length>=2,"Interchangeable group requires two Steps"),nt(l.stepIds,"Duplicate interchangeable Step");for(const p of l.stepIds)t(p,"step",e.id);const u=JSON.stringify([...l.stepIds].sort());P(!s.has(u),"Duplicate interchangeable group"),s.add(u),d.push(l.stepIds)}for(const l of n)if(Array.isArray(l.dependsOn)){nt(l.dependsOn.map(u=>JSON.stringify([u.stepId,u.whenDecision?.decisionId??null,u.whenDecision?.rowId??null])),"Duplicate Step prerequisite: "+l.id);for(const u of l.dependsOn){const p=u.stepId;t(p,"step",e.id),P(p!==l.id,"Self Step prerequisite: "+l.id),P(i.indexOf(p)<i.indexOf(l.id),"Standard Step order contradicts prerequisite: "+p+" -> "+l.id),o.get(p).push(l.id)}}const a=(l,u)=>{const p=[l],g=new Set;for(;p.length;){const c=p.pop();if(!g.has(c)){g.add(c);for(const h of o.get(c)){if(h===u)return!0;p.push(h)}}}return!1};for(const l of i)P(!a(l,l),"Step order cycle");for(const l of d)for(const u of l)for(const p of l)u!==p&&P(!a(u,p),"Interchangeable Steps conflict with before constraint")}function ia(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&P(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};nt(e.roles.map(o=>o.name),"Duplicate Role name"),P(e.roles.every(o=>o.name===o.name.trim()&&!/[\r\n]/.test(o.name)),"Invalid Role name"),nt(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){P(o.name===o.name.trim(),"Data name whitespace"),Dn(o.items,"Data requires Information: "+o.id),nt(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities)Dn(o.results,"Activity requires Result: "+o.id),Hd(o,i);return i}function Jd(e,t,n,i,o){for(const r of e.activities){const s=d=>{const a=i(d.decisionId,"decision",r.id);return i(d.rowId,"decision-row",a.id),a};for(const d of r.procedure.steps){nt(d.decisionIds,"Duplicate Step decision");for(const l of d.decisionIds)i(l,"decision",r.id);d.whenDecision&&s(d.whenDecision);const a=na(r,d);a&&o.push("判定表を参照する手順が後方: "+d.id+" / "+a.id+"（前提を確認）");for(const l of d.dependsOn??[]){const u=l.stepId,p=r.procedure.steps.find(h=>h.id===u);l.whenDecision&&s(l.whenDecision);const g=h=>h&&p.whenDecision&&h.decisionId===p.whenDecision.decisionId&&h.rowId===p.whenDecision.rowId,c=p.whenDecision&&!g(d.whenDecision)&&!g(l.whenDecision);(p.obligation==="optional"||p.appliesWhen||c)&&o.push("前提手順の実施条件を確認: "+d.id+" <- "+u)}}for(const d of r.decisions){Dn(d.axes,"Decision requires a condition axis: "+d.id),Dn(d.rows,"Decision requires a row: "+d.id),d.appliesWhen&&(s(d.appliesWhen),P(d.appliesWhen.decisionId!==d.id,"Decision cannot depend on itself: "+d.id));for(const a of d.axes){nt(a.dataIds,"Duplicate decision axis Data");for(const l of a.dataIds)i(l,"data");P(a.trueLabel===void 0==(a.falseLabel===void 0),"Boolean labels must be paired: "+a.id)}for(const[a,l]of d.rows.entries()){P(l.conditions.length===d.axes.length,"Decision row must cover every axis: "+l.id);for(const[u,p]of l.conditions.entries())if(P(p.axisId===d.axes[u].id,"Decision condition axis/order mismatch: "+l.id),p.kind==="value"&&["gte","lte","gt","lt"].includes(p.operator)&&P(typeof p.value=="number","Ordered comparison requires a number: "+l.id),p.kind==="undecided"&&P(l.result.kind==="undecided","Undecided condition cannot assert an outcome: "+l.id),p.kind==="else"){const g=JSON.stringify(l.conditions.slice(0,u).map(ar));P(d.rows.slice(0,a).some(c=>JSON.stringify(c.conditions.slice(0,u).map(ar))===g&&c.conditions[u]?.kind==="value"),"Else needs an earlier branch in the same context: "+l.id)}P(l.result.kind==="undecided"||l.result.text!==null,"Known decision result needs a description: "+l.id),l.result.kind==="undecided"&&o.push("業務判断未決: "+l.id),nt(l.result.dataIds,"Duplicate decision result Data");for(const u of l.result.dataIds)i(u,"data");nt(l.result.exceptionIds,"Duplicate decision exception");for(const u of l.result.exceptionIds){const p=i(u,"exception");P(p.activityId===r.id,"Decision exception Activity mismatch: "+u)}nt(l.checkRefs.map(u=>u.checkId),"Duplicate decision Check");for(const u of l.checkRefs){n(u.checkId,"check");const p=t.map.get(t.owner.get(u.checkId));P(p?.kind==="checkItems"&&p.basedOn.documentId===e.id&&p.basedOn.revision===e.revision,"Decision Check source mismatch: "+u.checkId),P(p.index.some(g=>g.activityId===r.id&&g.checkIds.includes(u.checkId)),"Decision Check Activity mismatch: "+u.checkId)}}}for(const d of r.decisions){const a=new Set;let l=d;for(;l.appliesWhen;)P(!a.has(l.id),"Decision dependency cycle: "+d.id),a.add(l.id),l=s(l.appliesWhen)}}}function _d(e,t,n){const i=ia(e,t,n);for(const o of e.activities){if(o.performers!==null){Dn(o.performers,"Empty performers"),nt(o.performers.map(s=>s.objectId),"Duplicate performer");for(const s of o.performers){i(s.objectId,"object"),nt(s.roleIds,"Duplicate performer Role");for(const d of s.roleIds)i(d,"role")}}let r=o.performers===null;for(const s of o.procedure.steps)if(s.performerObjectIds!==null){Dn(s.performerObjectIds,"Empty Step performers"),nt(s.performerObjectIds,"Duplicate Step performer");for(const d of s.performerObjectIds)P(o.performers?.some(a=>a.objectId===d),"Step performer outside Activity assignment: "+d)}else o.performers?.length!==1&&(r=!0);r&&P(e.findings.some(s=>s.status==="open"&&s.scope==="items"&&s.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id)}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}function Kd(e,t,n,i){const o=ia(e,t,n),r=new Map(e.activities.flatMap(s=>s.procedure.steps.map(d=>[d.id,{activity:s,step:d}])));e.schemaVersion==="0.6"&&Jd(e,t,n,o,i);for(const s of e.exceptions){const d=s.continuity;if(d){for(const a of[d.interruptedAtStepId,d.resumeAtStepId])a!==null&&o(a,"step",s.activityId);if(d.retainedDataIds!==null){nt(d.retainedDataIds,"Duplicate retained Data");for(const a of d.retainedDataIds)o(a,"data")}}}for(const s of e.objects)s.scope===null&&i.push("Scope未確定: "+s.id);for(const s of e.activities){s.scope===null&&i.push("Scope未確定: "+s.id),s.who===null?i.push("Who未確定: "+s.id):s.who.kind==="role"&&o(s.who.roleId,"role");for(const d of s.procedure.steps){if(d.parties)for(const l of[d.parties.from,d.parties.to])l?.kind==="object"&&o(l.objectId,"object");if(d.whatDataIds===null)i.push("対象Data未確定: "+d.id);else{nt(d.whatDataIds,"Duplicate Step target Data");for(const l of d.whatDataIds)o(l,"data")}const a=d.exchange;if(a.kind==="unresolved"){i.push("やり取り未確定: "+d.id);continue}if(a.kind!=="internal"){if(o(a.objectId,"object"),a.phase===null&&i.push("Request/Response未確定: "+d.id),a.dataIds===null)i.push("Data未確定: "+d.id);else{nt(a.dataIds,"Duplicate Step Data");for(const l of a.dataIds)o(l,"data")}if(a.relationId!==null){const l=o(a.relationId,"relation"),u=a.direction==="input";P(l.kind===a.direction&&l.fromId===(u?a.objectId:s.id)&&l.toId===(u?s.id:a.objectId),"Step relation direction/endpoint mismatch: "+d.id)}if(a.pairedStepId!==null){const l=r.get(a.pairedStepId);P(l&&l.activity.id===s.id&&l.step.id!==d.id,"Invalid paired Step: "+d.id);const u=l.step.exchange;P(u.kind==="interaction"&&["request","response"].includes(a.phase)&&["request","response"].includes(u.phase)&&u.phase!==a.phase&&u.direction!==a.direction&&u.objectId===a.objectId,"Request/Response mismatch: "+d.id)}}}}}function Xd(e){const t=new Map(e.data.map(o=>[o.id,o])),n=new Map,i=[];for(const o of e.activities)for(const r of o.procedure.steps){const s=r.exchange,d=new Map,a=(h,m)=>{let f=d.get(h);if(!f){const b=t.get(h);P(b,"Unknown Data during projection: "+h),f={id:b.id,name:b.name,uses:[]},d.set(h,f)}f.uses.includes(m)||f.uses.push(m)};for(const h of r.whatDataIds??[])a(h,"target");if(s.kind==="interaction")for(const h of s.dataIds??[])a(h,"transferred");const l={activityId:o.id,stepId:r.id,action:r.action,method:r.method,data:[...d.values()],targetDataUndecided:r.whatDataIds===null,obligation:r.obligation,appliesWhen:r.appliesWhen,effect:r.effect,...r.parties?{parties:r.parties}:{}};if(s.kind!=="interaction"){i.push({...l,kind:s.kind,from:s.kind==="internal"?{kind:"who",activityId:o.id}:null,to:null});continue}const u={kind:"who",activityId:o.id},p={kind:"object",objectId:s.objectId};i.push({...l,kind:s.kind,from:s.direction==="output"?u:p,to:s.direction==="output"?p:u,objectId:s.objectId,direction:s.direction,phase:s.phase,dataIds:s.dataIds,relationId:s.relationId,pairedStepId:s.pairedStepId});const g=JSON.stringify([o.id,s.objectId,s.direction]);n.has(g)||n.set(g,{activityId:o.id,objectId:s.objectId,direction:s.direction,stepIds:[],relationIds:[],data:[]});const c=n.get(g);c.stepIds.push(r.id),s.relationId!==null&&!c.relationIds.includes(s.relationId)&&c.relationIds.push(s.relationId),s.dataIds===null&&(c.transferUndecided=!0);for(const h of s.dataIds??[])if(!c.data.some(m=>m.id===h)){const m=t.get(h);P(m,"Unknown Data during projection: "+h),c.data.push({id:m.id,name:m.name})}}return{rows:i,edges:[...n.values()].map(o=>({...o,label:o.data.map(r=>r.name).join(" / ")}))}}const P=(e,t)=>{if(!e)throw Error(t)};function oa(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const r=t++;for(;t<e.length;){const s=e[t++];if(s==='"')return JSON.parse(e.slice(r,t));s==="\\"&&t++}throw Error("Unclosed JSON string")},o=(r=0)=>{P(r<=64,"JSON depth limit"),n();const s=e[t];if(s==='"'){i();return}if(s==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),P(e[t]==='"',"JSON object key required");const l=i();P(!a.has(l),"Duplicate JSON key: "+l),a.add(l),n(),P(e[t++]===":","JSON colon required"),o(r+1),n();const u=e[t++];if(u==="}")return;P(u===",","JSON comma required")}throw Error("Truncated object")}if(s==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(r+1),n();const a=e[t++];if(a==="]")return;P(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;P(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),P(t===e.length,"Trailing JSON content"),JSON.parse(e)}function mn(e,t=di,n="$"){if(t.$ref)return mn(e,di.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{mn(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&P(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;P(i===t.type,"Invalid type at "+n)}if(t.minLength&&P(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&P(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])P(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))P(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),mn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>mn(i,t.items,n+"["+o+"]"))}function Zd(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,a,l=d.id)=>{P(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,a),o.set(s.id,l)};for(const s of e.documents){r(s,s,"document",null);for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of s[d]??[])r(l,s,a);if(s.kind==="businessDesign"&&["0.4","0.5","0.6"].includes(s.schemaVersion)){for(const d of s.objects)for(const a of d.information)r(a,s,"information",d.id);for(const d of s.activities){for(const a of d.procedure.steps)r(a,s,"step",d.id);for(const a of d.results)r(a,s,"result",d.id);for(const a of d.decisions??[]){r(a,s,"decision",d.id);for(const l of a.axes)r(l,s,"decision-axis",a.id);for(const l of a.rows)r(l,s,"decision-row",a.id)}}for(const d of s.data)r(d,s,"data")}}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}return{map:t,owner:n,types:i,parent:o}}function Fi(e){return mn(e),sa(e)}function Gn(e,t){const n=new Set(e.items.map(s=>s.id)),i=new Set,o=e.guarantees.find(s=>s.id===t.guaranteeId),r=s=>{if(Array.isArray(s)){for(const d of s)r(d);return}if(s&&typeof s=="object"){s.kind==="reference"&&n.has(s.targetId)&&i.add(s.targetId);for(const d of Object.values(s))d&&typeof d=="object"&&r(d)}};r(t.rows);for(const s of o?.blocks??[])s.kind==="prose"&&r(s.content);for(const s of e.items)(s.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&i.add(s.id);return[...i]}function sa(e,{allowUnresolvedFindings:t=!1}={}){P(e.documents.length>0,"Document required");const n=Zd(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const c of e.sources)if(c.uri){const h=new URL(c.uri);P(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const a=(c,h,m)=>(P(i.has(c),"Dangling reference: "+c),h&&P(r.get(c)===h,"Reference type mismatch: "+c),m&&P(o.get(c)===m,"Cross-document mismatch: "+c),i.get(c)),l=c=>c?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),u=(c,h)=>{for(const m of c){if(m.kind==="reference"){const f=r.get(m.targetId);if(f==="decision-row"||f==="exception"){P(e.formatVersion==="0.7","Business rich references require formatVersion 0.7");const b=i.get(h),x=a(m.targetId,f),v=f==="exception"?x.activityId:n.parent.get(n.parent.get(m.targetId));P(b?.kind==="checkItems"&&b.basedOn.documentId===o.get(m.targetId),"Business reference must use the Check source Business Design"),P(b.index.some(D=>D.activityId===v),"Business reference Activity is absent from Check index")}else a(m.targetId,null,h),P(["document","section","guarantee","example","check","note"].includes(f),"Invalid rich reference target")}if(m.kind==="link"){const f=new URL(m.uri);P(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}}};for(const c of e.documents)if(P(e.formatVersion!=="0.1"||c.kind!=="stateTransition","State documents require formatVersion 0.2"),c.kind==="businessDesign"){P(c.activities.length>0,"Activity required");const h=[...c.objects,...c.activities].map(b=>b.name);P(new Set(h).size===h.length,"Duplicate visible name"),P(h.every(b=>b===b.trim()&&!(["0.4","0.5","0.6","0.7"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>b.includes(x))),"Invalid Graph-visible name");for(const b of c.objects)P(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3"].includes(c.schemaVersion)){P(new Set(c.roles.map(b=>b.name)).size===c.roles.length,"Duplicate Role name"),P(c.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name");for(const b of c.activities)b.roleId!==null?a(b.roleId,"role",c.id):d.add("Role未確定: "+b.id+" — "+b.who)}for(const b of c.activities)P(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of c.exceptions??[])a(b.activityId,"activity",c.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;for(const b of c.relations){a(b.fromId,m[b.kind][0],c.id),a(b.toId,m[b.kind][1],c.id);const x=JSON.stringify([b.kind,b.fromId,b.toId,["0.5","0.6"].includes(c.schemaVersion)?b.id:b.dataId??b.label]);P(!f.has(x),"Duplicate relation"),f.add(x)}c.schemaVersion==="0.4"&&_d(c,n,a),["0.5","0.6"].includes(c.schemaVersion)&&Kd(c,n,a,s),P(new Set(c.findings.map(b=>b.sourceId)).size===c.findings.length,"Duplicate Finding source ID");for(const b of c.findings){P(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),P(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const x of b.targetIds)a(x,null,c.id),P(["object","activity"].includes(r.get(x)),"Invalid Finding target");b.unresolvedTargets.length&&(P(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(c.kind==="stateTransition"){const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),P(h.revision===c.basedOn.revision,"Stale State source revision"),a(c.objectId,"object",h.id),P(!e.documents.some(f=>f!==c&&f.kind==="stateTransition"&&f.objectId===c.objectId),"Duplicate Object state declaration"),P(c.states.length>0&&new Set(c.states.map(f=>f.name)).size===c.states.length,"Duplicate/empty state names"),P(c.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),P(c.transitions.length<=1e3,"State transition row budget"),P(new Set(c.transitions.map(f=>f.sourceId)).size===c.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of c.transitions){f.fromId!=="@new"&&a(f.fromId,"state",c.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",c.id);const b=a(f.activityId,"activity",h.id),x=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);if(P(!m.has(x),"Duplicate state transition condition: "+m.get(x)+" / "+f.sourceId),m.set(x,f.sourceId),["0.4","0.5","0.6","0.7"].includes(e.formatVersion))if(P(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const v=a(f.exceptionId,"exception",h.id);P(v.activityId===b.id,"Exception Activity mismatch")}else f.path==="exception"&&P(s.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else P(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);P(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),P(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),P(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),P(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+c.id)}else if(c.kind==="conceptModel"){const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign"&&h.revision===c.basedOn.revision,"Concept source must be the matching in-package BD revision"),P(!e.documents.some(L=>L!==c&&L.kind==="conceptModel"&&L.basedOn.documentId===h.id),"Duplicate Concept model for Business Design");const m=(L,j)=>{const N=new Map;for(const Q of L)P(!N.has(Q.id),"Duplicate "+j+" ID: "+Q.id),N.set(Q.id,Q);return N},f=m(c.subsystems,"subsystem"),b=m(c.concepts,"concept"),x=m(c.relations,"concept relation"),v=m(c.reviewGroups,"review group"),D=m(c.handoffs,"handoff"),k=m(c.concepts.flatMap(L=>L.information),"concept information"),w=(L,j,N)=>(P(L.has(j),"Unknown "+N+": "+j),L.get(j)),A=L=>a(L,"activity",h.id),E=L=>{const j=a(L.documentId,"document");P(j.revision===L.revision,"Stale Concept source revision");const N=j.id===h.id,Q=j.kind==="stateTransition"&&j.basedOn.documentId===h.id&&c.relatedStates.some(U=>U.documentId===j.id&&U.revision===j.revision);P(N||Q,"Concept source must refer to its Business Design or a declared State"),a(L.targetId,L.targetType,j.id)};for(const L of c.relatedStates){const j=a(L.documentId,"document");P(j.kind==="stateTransition"&&j.revision===L.revision&&j.basedOn.documentId===h.id,"Invalid Concept state reference")}for(const L of c.subsystems)for(const j of L.activityIds)A(j);for(const L of c.concepts){w(f,L.subsystemId,"subsystem");for(const j of L.information)j.responsibleSubsystemId&&w(f,j.responsibleSubsystemId,"responsible subsystem");for(const j of L.businessObjectIds)a(j,"object",h.id);for(const j of L.activityLinks)A(j.activityId);for(const j of L.sourceRefs)E(j)}for(const L of c.relations){w(b,L.fromConceptId,"concept"),w(b,L.toConceptId,"concept");for(const j of L.sourceRefs)E(j)}for(const L of c.handoffs){w(f,L.fromSubsystemId,"subsystem"),w(f,L.toSubsystemId,"subsystem"),P(L.fromSubsystemId!==L.toSubsystemId,"Handoff must cross subsystem boundary");for(const j of L.activityIds)A(j)}const $=(L,j)=>{const N=m(L.nodes,"subsystem view"),Q=m(L.edges,"subsystem view edge");for(const _ of N.values()){w(j,_.conceptId,"view concept"),w(f,_.subsystemId,"subsystem");const ee=w(b,_.conceptId,"concept");for(const Y of _.fields)P(ee.information.some(Z=>Z.id===Y.informationId),"Unknown information for subsystem view: "+Y.informationId)}for(const _ of Q.values()){const ee=w(N,_.fromViewId,"subsystem view"),Y=w(N,_.toViewId,"subsystem view");P(ee.subsystemId===Y.subsystemId,"View relationship crosses subsystem boundary"),P(_.relationIds.length>0,"Subsystem view relationship needs a concept relation");let Z=ee.conceptId;for(const ce of _.relationIds){const ue=w(x,ce,"concept relation");P(ue.fromConceptId===Z,"Subsystem view relation path is disconnected: "+ce),Z=ue.toConceptId}P(Z===Y.conceptId,"Subsystem view relation target differs")}P(new Set(L.handoffIds).size===L.handoffIds.length,"Duplicate subsystem view handoff");const U=new Set([...N.values()].map(_=>_.subsystemId));for(const _ of L.handoffIds){const ee=w(D,_,"handoff");P(U.has(ee.fromSubsystemId)&&U.has(ee.toSubsystemId),"Missing subsystem view handoff region: "+_)}};c.presentation.subsystemViews&&$(c.presentation.subsystemViews,b);for(const L of c.reviewGroups){w(f,L.subsystemId,"subsystem"),a(L.reviewer.roleId,"role",h.id);for(const U of L.relatedActivityIds)A(U);const j=m(L.graph.nodes.map(U=>({...U,id:U.conceptId})),"view concept");P(new Set(L.graph.conceptIds).size===L.graph.conceptIds.length&&L.graph.conceptIds.length===j.size&&L.graph.conceptIds.every(U=>j.has(U)),"View concepts and nodes differ");for(const U of L.graph.nodes){w(b,U.conceptId,"concept");for(const _ of U.sourceActivityIds)A(_)}m(L.graph.edges,"view edge");for(const U of L.graph.edges){w(j,U.fromConceptId,"view concept"),w(j,U.toConceptId,"view concept");for(const _ of U.relationIds)w(x,_,"concept relation")}L.graph.subsystemViews&&$(L.graph.subsystemViews,j);const N=m(L.capabilities,"capability"),Q=m(L.capabilities.flatMap(U=>U.samples),"sample");m(L.limitations,"limitation"),m(L.structureStatements,"structure statement");for(const U of L.structureStatements){for(const _ of U.sampleIds)w(Q,_,"sample");for(const _ of U.sourceRefs)E(_)}for(const U of N.values())if(U.testSpecification){const _=U.testSpecification;for(const[Y,Z]of Object.entries(_))P(new Set(Z).size===Z.length,"Duplicate function specification reference: "+Y);const ee=(Y,Z)=>{const ce=a(Y,Z),ue=a(o.get(Y),"document");return P(ue.kind==="checkItems"&&ue.basedOn.documentId===h.id&&ue.basedOn.revision===h.revision,"Function Check source mismatch: "+Y),{value:ce,doc:ue}};for(const Y of[..._.decisionCheckIds,..._.resultCheckIds])ee(Y,"check");for(const Y of _.decisionExampleIds){const{value:Z,doc:ce}=ee(Y,"example"),ue=Gn(ce,Z);P(ue.length>0,"Function decision table needs a Check: "+Y),P(ue.every(ye=>_.decisionCheckIds.includes(ye)),"Function decision table Check is not assigned: "+Y)}for(const Y of _.sampleIds){const Z=U.samples.find(ce=>ce.id===Y);P(Z,"Function result sample belongs to another capability: "+Y),P(Z.checkIds.some(ce=>_.resultCheckIds.includes(ce)),"Function result sample needs a result Check: "+Y),P(Z.checkIds.every(ce=>_.resultCheckIds.includes(ce)||_.decisionCheckIds.includes(ce)),"Function result sample Check is not assigned: "+Y)}}for(const U of N.values())for(const _ of U.samples){if(c.schemaVersion==="0.2"){P(_.checkIds.length>0,"Sample needs a Check: "+_.id),P(new Set(_.checkIds).size===_.checkIds.length,"Duplicate sample Check: "+_.id);for(const ee of _.checkIds){a(ee,"check");const Y=a(o.get(ee),"document");P(Y.kind==="checkItems"&&Y.basedOn.documentId===h.id&&Y.basedOn.revision===h.revision,"Sample Check source mismatch: "+ee)}}for(const ee of _.blocks){w(j,ee.card,"view concept");const Y=m(ee.columns,"sample column");for(const Z of ee.columns)w(k,Z.informationId,"concept information");m(ee.rows,"sample row");for(const Z of ee.rows){const ce=new Set;for(const ue of Z.cells)w(Y,ue.columnId,"sample column"),P(!ce.has(ue.columnId),"Duplicate sample cell: "+ue.columnId),ce.add(ue.columnId);P(ce.size===Y.size,"Sample row does not match columns")}}}}for(const L of c.presentation.landscapeRelationships){const j=w(v,L.from,"review group"),N=w(v,L.to,"review group");P(j.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const L of c.presentation.reviewBoundaries)w(v,L.from,"review group"),w(v,L.to,"review group");s.push("概念モデルの業務意味は未確認: "+c.id)}else{const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign","Check source is not BD"),P(h.revision===c.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+c.id),P(new Set(c.items.map(b=>b.checkId)).size===c.items.length,"Duplicate Check ID");const m=new Set;for(const b of c.index){a(b.activityId,"activity",h.id),P(!m.has(b.activityId),"Duplicate Activity index"),m.add(b.activityId),P(new Set(b.checkIds).size===b.checkIds.length,"Duplicate Check binding");for(const x of b.checkIds)a(x,"check",c.id)}P(new Set(c.sections.map(b=>b.activityId??b.title)).size===c.sections.length,"Duplicate Activity section");for(const b of c.sections)b.activityId!==null&&(a(b.activityId,"activity",h.id),P(m.has(b.activityId),"Section missing from index")),u(b.preamble,c.id);const f=new Set(e.documents.filter(b=>b.kind==="conceptModel"&&b.basedOn.documentId===h.id&&b.basedOn.revision===h.revision).flatMap(b=>b.reviewGroups.flatMap(x=>x.capabilities.flatMap(v=>v.testSpecification?.decisionExampleIds??[]))));for(const b of c.guarantees){const x=b.blocks.length>0&&b.blocks.every(v=>v.kind==="example"&&f.has(v.exampleId)&&c.examples.some(D=>D.id===v.exampleId&&D.guaranteeId===b.id&&Gn(c,D).length>0));P(b.blocks.some(v=>v.kind==="prose"&&l(v.content))||x,"General guarantee prose required"),a(b.sectionId,"section",c.id);for(const v of b.blocks)if(v.kind==="prose")u(v.content,c.id);else{const D=a(v.exampleId,"example",c.id);P(D.guaranteeId===b.id,"Example owner mismatch")}}for(const b of c.examples){a(b.guaranteeId,"guarantee",c.id),P(b.columns.length>0,"Example columns required");for(const x of b.rows){P(x.length===b.columns.length,"Example column mismatch");for(const v of x)u(v,c.id)}}for(const b of c.items){const x=a(b.sectionId,"section",c.id);P(x.activityId===null?!c.index.some(v=>v.checkIds.includes(b.id)):c.index.some(v=>v.activityId===x.activityId&&v.checkIds.includes(b.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),P(l(b.fields.guarantee)||l(b.fields.condition)&&l(b.fields.expectedResult),"Check guarantee required");for(const v of Object.values(b.fields)){u(v,c.id);for(const D of v)D.kind==="reference"&&(r.get(D.targetId)==="decision-row"&&P(i.get(D.targetId).checkRefs.some(k=>k.checkId===b.id),"Check and decision row must explicitly correspond: "+b.id),r.get(D.targetId)==="exception"&&P(c.index.some(k=>k.activityId===i.get(D.targetId).activityId&&k.checkIds.includes(b.id)),"Check and exception Activity mismatch: "+b.id))}P(x.activityId===null||c.index.some(v=>v.checkIds.includes(b.id)),"Unbound Check")}for(const b of c.notes)u(b.content,c.id);u(c.intro,c.id)}const p=e.diagnostics.filter(c=>c.startsWith("Role未確定:"));P(new Set(p).size===p.length,"Duplicate unresolved Role diagnostic");for(const c of p)P(d.delete(c),"Unresolved Who requires a diagnostic matching a current unresolved Activity");P(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const c of e.sources){a(c.documentId,"document");const h=c.documentId+"@"+c.revision;P(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const c of e.externalDocuments)P(e.sources.some(h=>h.documentId===c.id&&h.revision===c.revision),"External source revision missing"),P(c.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+c.id);return{diagnostics:s,entities:i.size}}const C=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Qe(e,t,n){if(n==null)return;const i=et(n);return e.append(C("h3",t),i),i}function ra(e,t){const n=C("ul");for(const i of[...new Set(t)]){const o=e.data?.find(r=>r.id===i);if(o)for(const r of o.items){const s=e.objects.flatMap(u=>u.information).find(u=>typeof u!="string"&&u.id===r.informationId);if(!s||typeof s=="string")continue;const d=s.name===o.name?"":s.name,a=r.condition?`条件：${r.condition}`:"";if(!d&&!a&&!s.description)continue;const l=C("li",[d,a].filter(Boolean).join(" — "));s.description&&l.append(et(s.description)),n.append(l)}}return n}function qi(e,t){if(t===null)return C("span","未決");if(!t.length)return C("span","なし");const n=C("ul");n.className="procedure-data-list";for(const i of t){const o=e.data?.find(d=>d.id===i),r=C("li",o?.name??"未決"),s=ra(e,[i]);if(s.children.length){const d=C("details"),a=C("summary","詳細");d.className="procedure-data-details",d.append(a,s),r.append(d)}n.append(r)}return n}function Yd(e,t){if(e===null)return;const n=et(e),i=r=>String(r??"").replace(/\s+/g,""),o=new Set(t.map(r=>i(et(`**${r.name}** — ${r.description}`).textContent)));for(const r of Array.from(n.querySelectorAll("li")))o.has(i(r.textContent))&&r.remove();for(const r of Array.from(n.querySelectorAll("ul,ol")))r.children.length||r.remove();return n.textContent?.trim()?n:void 0}const Qd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function el(e,t,n){const i=new Map,o=new Set,r=new Set(n.map(d=>d.id)),s=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==s.id||d.basedOn.revision!==s.revision)continue;const a=d.presentation.activityViews;if(Array.isArray(a)){for(const l of a)if(!(!l||typeof l!="object"||Array.isArray(l)||l.activityId!==t||!Array.isArray(l.businessVariations)))for(const u of l.businessVariations){if(!u||typeof u!="object"||Array.isArray(u)||typeof u.exceptionId!="string"||!r.has(u.exceptionId)||u.kind!=="alternative"&&u.kind!=="exception"||o.has(u.exceptionId))continue;const p=i.get(u.exceptionId);p&&p!==u.kind?(i.delete(u.exceptionId),o.add(u.exceptionId)):i.set(u.exceptionId,u.kind)}}}return i}function tl(e,t,n){const i=t.model.business,o=t.model.checks,r=n.decisions??[],s=new Map,d=k=>r.findIndex(w=>w.id===k)+1,a=(k,w)=>{const A=C("button",`（※${d(k)}）`);return A.type="button",A.className="business-decision-link",A.onclick=()=>{const E=s.get(k),$=w?Array.from(E?.querySelectorAll("tr")??[]).find(L=>L.dataset.decisionRow===w):void 0;($??E)?.scrollIntoView({behavior:"smooth",block:$?"center":"start"})},A},l=(k,w,A)=>{if(!k||!w)return"未決";const E=w.result.text??"未決";if(!A)return E;const $=w.conditions.map((L,j)=>`${k.axes[j].name}：${_r(L,k.axes[j])}`).join("、");return`${E}（${k.rows.indexOf(w)+1}行目：${$}）`},u=k=>k?k.kind==="who"?En(i,n):i.objects.find(w=>w.id===k.objectId)?.name??"未決":"未決",p=(k,w)=>k===null||w===null?k===w:k.length===w.length&&k.every((A,E)=>A===w[E]),g=k=>k?.length===1&&!ra(i,k).children.length?C("span",i.data?.find(w=>w.id===k[0])?.name??"未決"):qi(i,k);e.append(C("h3","Procedure"));const c=C("p","表は左右にスクロールできます。無印の手順は必須です。");n.procedure.steps.some(k=>k.dependsOn===void 0)&&c.append(" 前提が未確認の手順があります。"),c.className="procedure-scroll-hint",e.append(c);const h=C("div");h.dataset.procedureScroll="",h.tabIndex=0,h.setAttribute("role","region"),h.setAttribute("aria-label","手順表");const m=C("table");m.dataset.procedureTable="",m.dataset.businessDecisions="";const f=C("thead"),b=C("tr");for(const k of["From","To","Data","Action"]){const w=C("th",k);w.scope="col",b.append(w)}f.append(b),m.append(f);const x=C("tbody"),v=new Map,D=k=>{const w=n.procedure.steps.findIndex(E=>E.id===k),A=n.procedure.steps[w];return n.procedure.steps.filter(E=>E.action===A.action).length>1?`${A.action}（${w+1}行目）`:A.action};for(const[k,w]of n.procedure.steps.entries()){const A=C("tr");A.dataset.stepId=w.id,v.set(w.id,A);const E=w.exchange,$=En(i,n),L=E.kind==="interaction"?i.objects.find(Z=>Z.id===E.objectId)?.name??"未決":null,j=E.kind==="interaction"?E.direction==="input"?L:$:E.kind==="internal"?$:"未決",N=E.kind==="interaction"?E.direction==="input"?$:L:E.kind==="internal"?"—":"未決";A.append(C("td",j),C("td",N));const Q=C("td");E.kind!=="interaction"||p(w.whatDataIds,E.dataIds)?Q.append(g(w.whatDataIds)):Q.append(C("span","対象："),g(w.whatDataIds),C("span","受渡し："),g(E.dataIds)),A.append(Q);const U=C("td",w.action);for(const Z of w.decisionIds??[])U.append(a(Z));if(w.dependsOn===null)U.append(C("small","前提：未確認"));else if(w.dependsOn?.length){const Z=C("small","前提：");for(const[ce,ue]of w.dependsOn.entries()){const ye=ue.stepId;ce&&Z.append("、");const pe=C("button",D(ye));if(pe.type="button",pe.className="business-decision-link",pe.setAttribute("aria-label",`前提の手順「${D(ye)}」に移動`),pe.onclick=()=>v.get(ye)?.scrollIntoView({behavior:"smooth",block:"center"}),Z.append(pe),ue.whenDecision){const q=ue.whenDecision,B=r.find(te=>te.id===q.decisionId),G=B?.rows.find(te=>te.id===q.rowId),ge=B?.rows.filter(te=>te.result.text===G?.result.text).length!==1;Z.append(document.createTextNode(`（${l(B,G,ge)}）`),a(q.decisionId,q.rowId))}}U.append(Z)}na(n,w)&&U.append(C("small","判定表を参照する手順が後方です。前提を確認"));const _=[],ee=w.obligation==="optional";let Y;if(w.method&&_.push(`方法：${w.method}`),w.appliesWhen&&_.push(`適用条件：${w.appliesWhen}`),w.effect&&_.push(`操作効果：${w.effect}`),w.whenDecision){const Z=r.find(pe=>pe.id===w.whenDecision.decisionId),ce=Z?.rows.find(pe=>pe.id===w.whenDecision.rowId),ue=n.procedure.steps.slice(0,k).some(pe=>pe.decisionIds?.includes(Z?.id??""));Z?.kind==="validation"&&ce?.result.kind==="accepted"&&Z.rows.some(pe=>pe.result.kind==="error")&&Z.rows.every(pe=>pe===ce||pe.result.kind==="error")&&ue||(_.push(`判定条件：${Z?.title??"未決"} / ${l(Z,ce,!0)}`),Y=w.whenDecision)}if(w.parties){const Z=u(w.parties.from),ce=u(w.parties.to);(Z!==j||ce!==N)&&_.push(`操作主体と対象：${Z} → ${ce}`)}if(E.kind==="interaction"?(E.phase===null?_.push("Request/Response：未決"):E.phase!=="not-applicable"&&_.push(E.phase==="request"?"Request":"Response"),E.pairedStepId&&_.push(`対応：手順${n.procedure.steps.findIndex(Z=>Z.id===E.pairedStepId)+1}`)):E.kind==="unresolved"&&_.push("やり取り：未決"),_.length){const Z=C("details"),ce=C("summary",ee?"詳細（任意）":"詳細"),ue=C("small",_.join(" · "));Y&&ue.append(a(Y.decisionId,Y.rowId)),Z.className="procedure-original",Z.append(ce,ue),U.append(Z)}else ee&&U.append(C("small","（任意）"));if(w.legacyText){const Z=C("details");Z.className="procedure-original",Z.append(C("summary","元の手順"),et(w.legacyText)),U.append(Z)}A.append(U),x.append(A)}if(m.append(x),h.append(m),e.append(h),n.procedure.orderRules.length){e.append(C("h3","手順の順序制約"));const k=C("ul");for(const w of n.procedure.orderRules)k.append(C("li",w.kind==="before"?`${D(w.beforeId)} → ${D(w.afterId)}`:`${w.stepIds.map(D).join("・")}は入替可能`));e.append(k)}for(const k of r){const w=C("section");if(w.dataset.businessDecision=k.id,s.set(k.id,w),w.append(C("h3",`${k.title}（※${d(k.id)}）`)),k.appliesWhen){const A=r.find(j=>j.id===k.appliesWhen.decisionId),E=A?.rows.find(j=>j.id===k.appliesWhen.rowId),$=!!E&&!!A&&A.rows.filter(j=>j.result.text===E.result.text).length>1,L=C("p",`適用条件：${A?.title??"未決"} — ${l(A,E,$)}`);L.append(a(k.appliesWhen.decisionId,k.appliesWhen.rowId)),k.note&&L.append(document.createTextNode(" · "+k.note)),w.append(L)}else k.note&&w.append(C("p",k.note));w.append(C("p","上から順に判定し、最初に当てはまる行を見ます。"),hs(k,o),...bs(k,i,o)),e.append(w)}}function nl(e,t,n){const i=C("article");i.className="markdown json-detail";const o=e.model,r=o.business,s=r.objects.find(a=>a.id===t),d=r.activities.find(a=>a.id===t);if(s){Qe(i,"Scope",s.scope===null?"未決":String(s.scope)),i.append(C("h3","Information"));const a=C("ul");for(const l of s.information){const u=C("li",typeof l=="string"?l:l.name);typeof l!="string"&&l.description&&u.append(et(l.description)),a.append(u)}i.append(a)}else if(d){const a=r.exceptions?.filter(c=>c.activityId===d.id)??[];if("performers"in d){Qe(i,"Scope",String(d.scope)),Qe(i,"Why",d.why),Qe(i,"When",d.when),Qe(i,"Who",En(r,d)),Qe(i,"旧形式の担当情報",zo(r,d)),d.performers?.length===1&&d.procedure.steps.some(f=>f.performerObjectIds===null)&&i.append(C("p","旧形式では、指定のない手順は旧形式の担当情報を継承します。")),Qe(i,"Where",d.where);const c=(e.findings??[]).filter(f=>f.id.startsWith("viewer:")&&f.targets.includes(d.id));for(const f of c){const b=C("p",f.summary+" ");b.className="finding-reference-warning",b.dataset.structureIssue=f.id;const x=C("button","構造の要確認を開く");x.type="button",x.className="node-navigate",x.onclick=()=>n?.(f.id),b.append(x),i.append(b)}i.append(C("h3","Procedure"));const h=C("ol");for(const f of d.procedure.steps){const b=C("li");b.append(et(f.text));const x=d.performers?.length===1&&(f.performerObjectIds===null||f.performerObjectIds.length===1&&f.performerObjectIds[0]===d.performers[0].objectId),v=[f.obligation==="required"?"必須":"任意",...f.appliesWhen?[`適用条件：${f.appliesWhen}`]:[],...x?[]:[`旧形式の担当：${zo(r,d,f.performerObjectIds)}`]];b.append(C("p",v.join(" · "))),h.append(b)}if(i.append(h),d.procedure.orderRules.length){i.append(C("h3","手順の順序制約"));const f=C("ul"),b=x=>String(d.procedure.steps.findIndex(v=>v.id===x)+1);for(const x of d.procedure.orderRules)f.append(C("li",x.kind==="before"?`手順${b(x.beforeId)} → 手順${b(x.afterId)}`:`手順${x.stepIds.map(b).join("・")}は入替可能`));i.append(f)}i.append(C("h3","Result"));const m=C("ul");m.dataset.businessResult="",m.dataset.resultScope="activity";for(const f of d.results){const b=C("li");b.append(et(f.text)),m.append(b)}i.append(m),Qe(i,"Problem",d.problem),Qe(i,"Pain level",d.painLevel)}else if(typeof d.who!="string"){const c=d;if(Qe(i,"Scope",c.scope===null?"未決":String(c.scope)),Qe(i,"Why",c.why),Qe(i,"When",c.when),Qe(i,"Who",En(r,c)),Qe(i,"Where",c.where),o.formatVersion==="0.7")tl(i,e,c);else{i.append(C("h3","Procedure"));const m=C("table");m.dataset.procedureTable="";const f=C("thead"),b=C("tr");for(const w of["Step","From","To","Data","Action"]){const A=C("th",w);A.scope="col",b.append(A)}f.append(b),m.append(f);const x=C("tbody"),v=w=>w?w.kind==="who"?En(r,c):r.objects.find(A=>A.id===w.objectId)?.name??"未決":"未決";for(const[w,A]of c.procedure.steps.entries()){const E=C("tr");E.dataset.stepId=A.id;const $=A.parties,L=(ee,Y)=>ee===null||Y===null?ee===Y:ee.length===Y.length&&ee.every((Z,ce)=>Z===Y[ce]),j=$?v($.from):A.exchange.kind==="internal"?En(r,c):"未決",N=$?v($.to):A.exchange.kind==="internal"?"—":"未決";for(const ee of[String(w+1),j,N])E.append(C("td",ee));const Q=C("td");A.exchange.kind!=="interaction"||L(A.whatDataIds,A.exchange.dataIds)?Q.append(qi(r,A.whatDataIds)):Q.append(C("span","対象："),qi(r,A.whatDataIds),C("span","受渡し："),qi(r,A.exchange.dataIds)),E.append(Q);const U=C("td",A.action),_=[...A.obligation==="optional"?["任意"]:[],...A.method?[`方法：${A.method}`]:[],...A.appliesWhen?[`適用条件：${A.appliesWhen}`]:[],...A.effect?[`操作効果：${A.effect}`]:[]];if(A.exchange.kind==="interaction"){const ee=A.exchange,Y=r.objects.find(pe=>pe.id===ee.objectId)?.name??"未決",Z=A.parties,ce=Z?.from?.kind==="who"&&Z.to?.kind==="object"&&Z.to.objectId===ee.objectId,ue=Z?.from?.kind==="object"&&Z.from.objectId===ee.objectId&&Z.to?.kind==="who";if(!(ee.direction==="output"?ce:ue)){const pe=ee.direction==="input"?"Input":"Output";_.push(`受渡し：${ce||ue?"":Y+" / "}${pe}`)}ee.phase===null?_.push("Request/Response：未決"):ee.phase!=="not-applicable"&&_.push(ee.phase==="request"?"Request":"Response"),ee.pairedStepId&&_.push(`対応：手順${c.procedure.steps.findIndex(pe=>pe.id===ee.pairedStepId)+1}`)}else A.exchange.kind==="unresolved"&&_.push("やり取り：未決");if(_.length&&U.append(C("small",_.join(" · "))),A.legacyText){const ee=C("details");ee.className="procedure-original",ee.append(C("summary","元の手順"),et(A.legacyText)),U.append(ee)}E.append(U),x.append(E)}m.append(x);const D=C("p","表は左右にスクロールできます。無印の手順は必須です。");D.className="procedure-scroll-hint";const k=C("div");if(k.dataset.procedureScroll="",k.tabIndex=0,k.setAttribute("role","region"),k.setAttribute("aria-label","手順表"),k.append(m),i.append(D,k),c.procedure.orderRules.length){i.append(C("h3","手順の順序制約"));const w=C("ul"),A=E=>String(c.procedure.steps.findIndex($=>$.id===E)+1);for(const E of c.procedure.orderRules)w.append(C("li",E.kind==="before"?`手順${A(E.beforeId)} → 手順${A(E.afterId)}`:`手順${E.stepIds.map(A).join("・")}は入替可能`));i.append(w)}}i.append(C("h3","Result"));const h=C("ul");h.dataset.businessResult="",h.dataset.resultScope="activity";for(const m of c.results){const f=C("li");f.append(et(m.text)),h.append(f)}i.append(h),Qe(i,"Problem",c.problem),Qe(i,"Pain level",c.painLevel)}else{const c=d;for(const[h,m]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const f=Qe(i,h,m==="who"?ms(e,c.id)?.name??c.who:c[m]===null?null:String(c[m]));m==="result"&&f&&(f.dataset.businessResult="")}}const l=Yd("exception"in d?d.exception:null,a),u=el(e,d.id,a),p=(c,h,m)=>{if(!h.length&&!m)return;const f=C("section");f.dataset.businessVariations="",f.append(C("h3",c)),m&&f.append(m);for(const b of h){const x=et(b.description);x.dataset.businessException=b.id,f.append(C("h4",b.name),x);const v=b.continuity;if(v){const D=C("dl"),k=E=>E&&typeof d.procedure!="string"?`手順${d.procedure.steps.findIndex($=>$.id===E)+1}`:"未決",w=E=>E===null?"未決":E.map($=>r.data?.find(L=>L.id===$)?.name??"未決").join("、")||"なし",A=[["発生条件",v.trigger??"未決"]];(v.onInterrupt!==null||v.outcome==="resume"||v.outcome===null)&&A.push(["中断時の扱い",v.onInterrupt??"未決"]),A.push(["その後",v.outcome==="resume"?"再開":v.outcome==="continue"?"そのまま続行":v.outcome==="end"?"終了":"未決"]),(v.outcome==="resume"||v.outcome===null||v.resumeCondition!==null||v.resumeAction!==null)&&A.push(["再開条件",v.resumeCondition??"未決"],["再開方法",v.resumeAction??"未決"]),v.interruptedAtStepId&&A.push(["中断した手順",k(v.interruptedAtStepId)]),v.resumeAtStepId&&A.push(["再開する手順",k(v.resumeAtStepId)]),(v.retainedDataIds!==null||v.outcome==="resume")&&A.push(["保持するData",w(v.retainedDataIds)]);for(const[E,$]of A)D.append(C("dt",E),C("dd",$));f.append(D)}}i.append(f)};["0.6","0.7"].includes(o.formatVersion)?p("Exception",a,l):u.size?(p("例外",a.filter(c=>u.get(c.id)==="exception")),p("別ルート",a.filter(c=>u.get(c.id)==="alternative")),p("通常以外の扱い",a.filter(c=>!u.has(c.id)),l)):p("通常以外の扱い",a,l);const g=new Map([...r.objects,...r.activities].map(c=>[c.id,c.name]));if(["0.6","0.7"].includes(o.formatVersion))for(const[c,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=e.graph.relations.filter(b=>b.kind===c&&(b.from===t||b.to===t));if(!m.length)continue;i.append(C("h3",h));const f=C("ul");for(const b of m){const v=`${c==="business-exception"?`${g.get(b.from)} → ${g.get(b.to)}`:g.get(c==="input"?b.from:b.to)} — ${b.label||"未決"}`;if(c==="business-exception"){i.append(C("p",v));continue}f.append(C("li",v))}c!=="business-exception"&&i.append(f)}else for(const[c,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=r.relations.filter(b=>b.kind===c&&(b.fromId===t||b.toId===t));if(!m.length)continue;i.append(C("h3",h));const f=C("ul");for(const b of m){const x=c==="business-exception"?`${g.get(b.fromId)} → ${g.get(b.toId)}`:g.get(c==="input"?b.fromId:b.toId),v=Jr(r,b),D=`${x} — ${v||"未決"}`;if(c==="business-exception"){i.append(C("p",D));continue}const k=C("li",D);if("dataId"in b){const w=r.data.find(E=>E.id===b.dataId),A=C("ul");for(const E of w.items){const $=r.objects.flatMap(j=>j.information).find(j=>typeof j!="string"&&j.id===E.informationId);if(!$||typeof $=="string")continue;const L=C("li",$.name+(E.condition?`（条件：${E.condition}）`:""));$.description&&L.append(et($.description)),A.append(L)}k.append(A)}f.append(k)}c!=="business-exception"&&i.append(f)}}else i.append(C("p","項目を選択すると業務内容を表示します。"));return i}function aa(e,t){return e.model?.formatVersion!=="0.7"?[]:e.model.business.activities.flatMap(n=>"decisions"in n?n.decisions??[]:[]).filter(n=>n.rows.some(i=>i.checkRefs.some(o=>o.checkId===t)))}function to(e,t,n){const i=new Set(Object.values(n.fields).flat().filter(o=>o.kind==="reference").map(o=>o.targetId));for(const o of aa(t,n.id)){if(o.rows.some(d=>i.has(d.id)))continue;const r=C("details");r.dataset.linkedBusinessDecision=o.id,r.append(C("summary",`${o.title}（業務判断）`));let s=!1;r.addEventListener("toggle",()=>{!r.open||s||(s=!0,r.append(hs(o,t.model.checks),...bs(o,t.model.business,t.model.checks)))}),e.append(r)}}class yi{remaining=5e3;warned=!1;doc;design;requester;constructor(t,n,i=!1){this.doc=t,this.design=n,this.requester=i}take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(C("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(et(o.value));continue}if(o.kind==="text"){const a=C("span",o.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(o.kind==="link"){t.append(C("span",`${o.label} (${o.uri})`));continue}const r=C("details"),s=C("summary",o.label||o.targetId);r.append(s),t.append(r);let d=!1;r.addEventListener("toggle",()=>{if(!r.open||d)return;if(d=!0,i.has(o.targetId)){r.append(C("p","循環参照："+o.targetId));return}if(i.size>=16){r.append(C("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(i).add(o.targetId),l=this.doc,u=l.guarantees.find(m=>m.id===o.targetId),p=l.examples.find(m=>m.id===o.targetId),g=l.items.find(m=>m.id===o.targetId),c=l.sections.find(m=>m.id===o.targetId),h=l.notes.find(m=>m.id===o.targetId);if(u){r.append(C("h4",u.title));for(const m of u.blocks){if(!this.take(r))break;m.kind==="prose"?this.runs(r,m.content,a):this.example(r,m.exampleId,a)}}else if(p)this.example(r,p.id,a);else if(g){r.append(C("p",`${g.checkId} · ${g.title}`+(this.requester?"":` · ${g.reviewState}`))),this.requester&&(g.reviewState==="要確認"||g.reviewState==="要修正")&&r.append(C("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(g.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f))):g.fields;this.fields(r,m,a)}else if(c)r.append(C("h4",c.title)),this.runs(r,c.preamble,a);else if(h)r.append(C("h4",h.title)),this.runs(r,h.content,a);else if(o.targetId===l.id)r.append(C("h4",l.title)),this.runs(r,l.intro,a);else if(this.design.model?.formatVersion==="0.7"){const m=this.design.model.business,f=m.activities.flatMap(x=>"decisions"in x?x.decisions??[]:[]).find(x=>x.rows.some(v=>v.id===o.targetId)),b=m.exceptions?.find(x=>x.id===o.targetId);f?r.append(C("h4",f.title),hs(f,this.design.model.checks),...bs(f,m,this.design.model.checks)):b&&r.append(C("h4",b.name),et(b.description))}})}}fields(t,n,i,o=!1){for(const[r,s]of Object.entries(n)){if(!this.take(t))break;if(t.append(C("h4",Qd[r]??r)),r==="guarantee"&&o){const d=new Set;for(const a of s){const l=a.kind==="reference"?this.doc.guarantees.find(p=>p.id===a.targetId):void 0;if(!l){this.runs(t,[a],i);continue}if(d.has(l.id))continue;d.add(l.id);const u=new Set(i).add(l.id);for(const p of l.blocks){if(!this.take(t))break;p.kind==="prose"?this.runs(t,p.content,u):this.example(t,p.exampleId,u)}}}else this.runs(t,s,i)}}example(t,n,i,o=!1){const r=this.doc.examples.find(p=>p.id===n);if(!Gn(this.doc,r).length)return;const s=C("table"),d=o?r.columns.indexOf("結果"):-1,a=d>0&&r.columns.at(-1)==="Check ID";if(a){const p=C("colgroup");p.span=d,s.append(p);for(let f=d;f<r.columns.length;f++)s.append(C("colgroup"));const g=C("thead"),c=C("tr"),h=C("th","条件");h.colSpan=d,h.scope="colgroup",c.append(h);for(let f=d;f<r.columns.length;f++){const b=C("th",r.columns[f]);b.rowSpan=2,b.scope="col",f===d?b.className="decision-result":r.columns[f]==="備考"&&(b.className="decision-notes"),c.append(b)}const m=C("tr");for(const f of r.columns.slice(0,d)){const b=C("th",f);b.scope="col",m.append(b)}g.append(c,m),s.append(g)}else{const p=C("tr");for(const g of r.columns){if(!this.take(t))break;p.append(C("th",g))}s.append(p)}const l=a?C("tbody"):s;for(const p of r.rows){if(!this.take(t))break;const g=C("tr");for(const[c,h]of p.entries()){if(!this.take(t))break;const m=C("td");if(a&&c===d?m.className="decision-result":a&&r.columns[c]==="備考"&&(m.className="decision-notes"),o)for(const f of h){const b=f.kind==="reference"?this.doc.items.find(x=>x.id===f.targetId):void 0;b?m.append(C("span",b.checkId)):this.runs(m,[f],i)}else this.runs(m,h,i);g.append(m)}l.append(g)}a&&s.append(l);const u=C("div");u.className="json-example",u.append(s),t.append(u)}}function cr(e,t,n=e.model.checks,i=new Set,o=new Set){const r=C("section");r.className="check-content json-checks";const s=e.model.business,d=n.filter(l=>l.basedOn.documentId===s.id);let a=!1;for(const l of d){const u=new yi(l,e),p=l.index.filter(m=>m.activityId===t),g=new Set(l.index.flatMap(m=>m.checkIds)),c=(t?[...new Set(p.flatMap(m=>m.checkIds))]:l.items.filter(m=>!g.has(m.id)).map(m=>m.id)).filter(m=>!i.has(m)),h=l.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of h){(m.preamble.length||l.guarantees.some(f=>f.sectionId===m.id&&!o.has(f.id)))&&(a=!0),u.runs(r,m.preamble);for(const f of l.guarantees.filter(b=>b.sectionId===m.id&&!o.has(b.id)))u.runs(r,[{kind:"reference",targetId:f.id,label:f.title}])}for(const m of c){const f=l.items.find(v=>v.id===m);if(!f)continue;a=!0;const b=C("section");b.className="check-item",b.dataset.checkId=f.checkId,b.dataset.elementId=f.id,b.append(C("h3",f.checkId+" · "+f.title)),(f.reviewState==="要確認"||f.reviewState==="要修正")&&b.append(C("p","確認が必要です。"));const x=Object.fromEntries(Object.entries(f.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));u.fields(b,x,new Set([f.id])),to(b,e,f),r.append(b)}if(!t)for(const m of l.notes)a=!0,u.runs(r,[{kind:"reference",targetId:m.id,label:m.title}])}return a||r.append(C("p","この業務のテスト仕様はありません。")),r}function il(e,t,n=e.model.checks){const i=C("section");i.className="check-content json-checks sample-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new yi(s,e);for(const a of s.items.filter(l=>r.has(l.id))){const l=C("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(C("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(C("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(a.fields).filter(([p])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(p)));d.fields(l,u,new Set([a.id]),!0),to(l,e,a),i.append(l)}}return i}const ol=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function sl(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(ol,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function rl(e,t,n=e.model.checks){const i=C("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const r of t)for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=s.examples.find(h=>h.id===r);if(!d||!Gn(s,d).length)continue;const a=new yi(s,e,!0),l=s.guarantees.find(h=>h.id===d.guaranteeId),u=C("section");u.dataset.decisionExample=r;for(const h of l?.blocks??[])h.kind==="prose"&&a.runs(u,sl(h.content),new Set([l.id]));d.rows.length>1&&u.append(C("p","上から順に判定し、最初に当てはまる行を見ます。"));const p=d.columns.indexOf("結果"),g=p>0?p:d.columns.length;d.rows.some(h=>h.slice(0,g).some(m=>m.some(f=>f.kind==="text"&&/^\s*[-‐]\s*$/.test(f.value))))&&u.append(C("p","‐＝値不問。")),a.example(u,r,new Set([r]),!0),i.append(u)}return i}function al(e,t,n=e.model.checks){const i=C("section");i.className="check-content json-checks decision-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new yi(s,e,!0);for(const a of s.items.filter(l=>r.has(l.id))){const l=C("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(C("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(C("p","確認が必要です。")),a.fields.condition?.length&&(l.append(C("h4","条件")),d.runs(l,a.fields.condition,new Set([a.id])));const u=Object.fromEntries(Object.entries(a.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));if(Object.keys(u).length){const p=C("details");p.append(C("summary","期待結果")),d.fields(p,u,new Set([a.id]),!0),l.append(p)}to(l,e,a),i.append(l)}}return i}function cl(e,t,n=e.model.checks,i=new Set){const o=C("section");o.className="check-content json-checks result-checks";const r=e.model.business,s=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===r.id&&a.basedOn.revision===r.revision)){const a=new yi(d,e,!0),l=d.items.filter(u=>s.has(u.id)&&i.has(u.id)&&u.reviewState!=="要確認"&&u.reviewState!=="要修正"&&!u.fields.question?.length&&!u.fields.alternatives?.length&&!aa(e,u.id).length);l.length&&o.append(C("p",l.map(u=>u.checkId).join("、")));for(const u of d.items.filter(p=>s.has(p.id))){if(l.includes(u))continue;const p=C("section");p.className="check-item",p.dataset.checkId=u.checkId,p.dataset.elementId=u.id,p.append(C("h3",u.checkId)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&p.append(C("p","確認が必要です。"));const g=Object.fromEntries(Object.entries(u.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));a.fields(p,g,new Set([u.id]),!0);const c=C("details"),h=C("summary","Check の詳細");c.append(h,C("p",u.title)),u.fields.condition?.length&&a.runs(c,u.fields.condition,new Set([u.id])),p.append(c),to(p,e,u),o.append(p)}}return o}const Do=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function dl(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(u=>u.id)),i=[],o=new Set,r=new Set,s=t.filter(u=>u.basedOn.documentId===e.business.id&&u.basedOn.revision===e.business.revision),d=(u,p)=>s.some(g=>g.items.some(c=>c.id===u)&&(!p||g.index.some(c=>c.activityId===p&&c.checkIds.includes(u)))),a=(u,p,g,c,h=[])=>{const m=p.testSpecification,f=(m?.decisionCheckIds??[]).filter(A=>d(A,g)),b=(m?.resultCheckIds??[]).filter(A=>d(A,g)),x=(m?.decisionExampleIds??[]).filter(A=>s.some(E=>{const $=E.examples.find(j=>j.id===A),L=$?Gn(E,$):[];return L.length>0&&L.every(j=>d(j,g))})),v=p.samples.filter(A=>(!m||m.sampleIds.includes(A.id))&&A.checkIds?.length&&(m?A.checkIds.every(E=>d(E,g)):A.checkIds.some(E=>d(E,g)))),D=x.flatMap(A=>s.flatMap(E=>{const $=E.examples.find(L=>L.id===A);return $?Gn(E,$).filter(L=>d(L,g)):[]})),k=[...new Set([...f,...b,...D,...v.flatMap(A=>(A.checkIds??[]).filter(E=>d(E,g)))])];if(!k.length)return;const w=`fn:${g??"_"}:${u}:${p.id}`;r.has(w)||(r.add(w),i.push({key:w,activityId:g,groupId:u,capability:p,name:c,samples:v,checkIds:k,decisionCheckIds:f,resultCheckIds:b,decisionExampleIds:x,decisionTableCheckIds:[...new Set(D)],businessSections:h}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const u of l)if(!(!Do(u)||typeof u.activityId!="string"||!n.has(u.activityId)||!Array.isArray(u.testSpecificationFunctions)))for(const p of u.testSpecificationFunctions){if(!Do(p)||typeof p.groupId!="string"||typeof p.capabilityId!="string")continue;const g=e.model.reviewGroups.find(m=>m.id===p.groupId),c=g?.capabilities.find(m=>m.id===p.capabilityId);if(!g||!c)continue;o.add(JSON.stringify([g.id,c.id]));const h=[];if(Array.isArray(p.businessSections))for(const m of p.businessSections){if(!Do(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(b=>b.id===m.exceptionId&&b.activityId===u.activityId)))continue;const f=[...new Set(m.pages.filter(b=>b==="decision"||b==="result"))];f.length&&h.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:f})}a(g.id,c,u.activityId,typeof p.name=="string"&&p.name.trim()?p.name.trim():c.title,h)}}for(const u of e.model.reviewGroups)for(const p of u.capabilities)o.has(JSON.stringify([u.id,p.id]))||a(u.id,p,void 0,p.title);return i}function dr(e,t,n,i){const o=e.filter(s=>s.groupId===t&&s.capability.id===n),r=o.find(s=>s.samples.some(d=>d.id===i));if(r)return{kind:"sample",key:r.key,sampleId:i};for(const s of o){if(!s.capability.testSpecification)continue;const d=s.capability.samples.find(l=>l.id===i),a=s.decisionExampleIds.length?s.decisionTableCheckIds:s.decisionCheckIds;if(d?.checkIds?.some(l=>a.includes(l)))return{kind:"decision",key:"decision:"+s.key}}}const Tn=["landscape","overview"];function ll(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const r=document.createElement("div");r.className="shell-workbench",n.before(r);const s=document.createElement("aside");s.id="design-explorer",s.setAttribute("aria-label","設計ナビゲーション"),s.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",r.append(s,d),d.append(i,n);const a=document.createElement("div");a.className="shell-open-tabs",o.before(a),a.append(o),Uc(a);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(l);const u=document.createElement("nav");u.className="state-tabs",u.setAttribute("aria-label","開いている状態遷移"),a.append(u);const p=document.createElement("nav");p.className="spec-tabs",p.setAttribute("aria-label","開いているテスト仕様"),a.append(p);const g=document.createElement("section");g.id="concept-workspace",g.hidden=!0,g.setAttribute("aria-label","データ構造"),g.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(g);const c=document.createElement("section");c.id="states-workspace",c.hidden=!0,c.setAttribute("aria-label","状態遷移"),c.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(c);const h=document.createElement("section");h.id="tests-workspace",h.hidden=!0,h.setAttribute("aria-label","テスト仕様"),h.innerHTML='<main class="test-spec-page"></main>',d.append(h);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const f=document.createElement("section");f.id="empty-workspace",f.hidden=!0,f.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(f);const b=n.querySelector("#node-list-drawer");s.append(b);const x=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),D=s.querySelector("input"),k=s.querySelector("nav"),w=g.querySelector("iframe"),A=g.querySelector(".concept-related"),E=c.querySelector("article"),$="alder-explorer-v1:"+location.pathname,L=location.protocol==="file:"||location.origin==="null"?"*":location.origin,j=window.__alderConceptHtml;let N,Q,U,_,ee={},Y=[],Z=[...Tn],ce=new Map,ue=new Map,ye=new Map,pe=new Map;const q=y=>ye.get(y)??y,B=y=>pe.get(y)??y,G=y=>Q?.findGroup(ce.get(y??"")),ge=y=>U?.contentFor(ce.get(y)??""),te=(y,I)=>U?.findDataExample(ce.get(y)??"",I),De=y=>U?.examplesFor(ce.get(y)??"")??[],Pe=y=>Tn.includes(y)?"全体図":ge(y)?.title??G(y)?.name??ee[ue.get(y)??""]?.name,Ie=()=>{const y=t.business(),I=y.design?.model;return I?[...I.checks,...y.relatedChecks??[]].filter(R=>R.basedOn.documentId===I.business.id):[]},de=()=>dl(N,Ie()),Ee=y=>de().find(I=>I.key===(y.startsWith("decision:")?y.slice(9):y)),Ve=y=>de().filter(I=>I.name===y.name).length>1?y.name+"（"+(t.business().activities.find(I=>I.id===y.activityId)?.name??"その他")+"）":y.name,Ge=y=>Ie().some(I=>I.index.some(R=>R.activityId===y)||I.sections.some(R=>R.activityId===y)),Jt=y=>new Set(de().filter(I=>I.activityId===y).flatMap(I=>I.checkIds)),wn=y=>{const I=new Set(de().filter(R=>R.activityId===y).flatMap(R=>R.decisionExampleIds));return new Set(Ie().flatMap(R=>R.examples.filter(O=>I.has(O.id)).map(O=>O.guaranteeId)))},an=y=>{const I=Jt(y),R=wn(y);return Ie().some(O=>O.index.some(V=>V.activityId===y&&V.checkIds.some(X=>!I.has(X)))||O.sections.some(V=>V.activityId===y&&(V.preamble.length>0||O.guarantees.some(X=>X.sectionId===V.id&&!R.has(X.id)))))},Ga=()=>Ie().some(y=>y.items.some(I=>!y.index.some(R=>R.checkIds.includes(I.id)))||y.sections.some(I=>I.activityId===null)||y.notes.length>0),Ha=y=>{const I=Ee(y);return I?I.capability.testSpecification?Ve(I)+"・"+(y.startsWith("decision:")?"可否":"結果"):I.name:(y==="@unassigned"?"未割当":y.startsWith("remaining:")?t.business().activities.find(R=>R.id===y.slice(10))?.name:y.startsWith("checks:")?t.business().activities.find(R=>R.id===y.slice(7))?.name:y==="@overview"?"テスト仕様":void 0)??y},xi=n.querySelector("#formattedMarkdownDrawer");xi&&r.append(xi),r.append(A,m),tr(A,r,$+":drawer-width"),tr(m,r,$+":test-drawer-width");let Ai=!1;const gt=t.rightDrawer??{isOpen:()=>Ai,setOpen:y=>{Ai=y}};let se="business",We=!1,st=[],K="overview",rt=[],yt="",vt=[],Te="@overview",Ln,_t=innerWidth>800,Ei=!1,Oi=!0,wt=!1,Qn;const kt=new Map,Ot=new Map([["overview",w]]),mt=new Map,kn=new Map,In=new Map,ze=new Map,cn=new Map,jt=new Set,Ke=new Set,Sn=new Set,Xe=new Map;let Oe;try{if(Oe=JSON.parse(sessionStorage.getItem($)||"null"),Oe){if(wt=Oe.overviewClosed===!0,Qn=typeof Oe.documentKey=="string"?Oe.documentKey:void 0,_t=typeof Oe.left=="boolean"?Oe.left:_t,Array.isArray(Oe.expanded)){Ke.clear();for(const y of Oe.expanded)typeof y=="string"&&Ke.add(y)}rt=Array.isArray(Oe.states)?Oe.states.filter(y=>typeof y=="string"):[],t.rightDrawer||(typeof Oe.rightOpen=="boolean"?Ai=Oe.rightOpen:typeof Oe.right?.["concept:"+Oe.active]=="boolean"&&(Ai=Oe.right["concept:"+Oe.active]))}}catch{}function Ja(){if(!(!Oe||Qn!==t.business().key||!We)){for(const y of Array.isArray(Oe.overviewModes)?Oe.overviewModes:[])G(y)&&jt.add(y);for(const[y,I]of Object.entries(Oe.lastExamples??Oe.examples??{}))typeof I=="string"&&te(y,I)&&cn.set(y,I);for(const[y,I]of Object.entries(Oe.examples??{}))typeof I=="string"&&te(y,I)&&ze.set(y,I);for(const[y,I]of Object.entries(Oe.selected??{}))typeof I=="string"&&Y.includes(I)&&mt.set(y,I);st=[...new Set((Array.isArray(Oe.concepts)?Oe.concepts:[]).filter(y=>typeof y=="string"&&Z.includes(y)))],K=st.includes(Oe.active)?Oe.active:"landscape"}}let xn;const He=()=>{try{sessionStorage.setItem($,JSON.stringify({documentKey:Ln,overviewClosed:wt,selected:Object.fromEntries(mt),examples:Object.fromEntries(ze),lastExamples:Object.fromEntries(cn),overviewModes:[...jt],left:_t,expandedVersion:4,expanded:[...Ke],concepts:st,active:K,states:rt,specs:vt,activeSpec:Te,specExamples:Object.fromEntries(kt),...t.rightDrawer?{}:{rightOpen:gt.isOpen()}}))}catch{}},dn=()=>{se==="concept"&&Xe.set("drawer:"+K,A.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&gt.isOpen()&&jt.has(K)&&Xe.set("review-overview:"+K,A.querySelector(".data-review-overview").scrollTop),se==="concept"&&ze.has(K)&&Xe.set("example:"+K+":"+ze.get(K),A.querySelector(".data-examples-panel").scrollTop),se==="states"&&yt&&Xe.set("state:"+yt,E.scrollTop),se==="tests"&&Xe.set("tests:"+Te,h.querySelector(".test-spec-page").scrollTop),se==="concept"&&K==="landscape"&&Xe.set("concept:landscape",g.querySelector(".concept-review-landscape").scrollTop)};function Ze(y=!0){if(Ei)return;const I=new URL(location.href);if(I.searchParams.set("view",se),I.searchParams.delete("concept"),I.searchParams.delete("dataExample"),I.searchParams.delete("dataView"),se==="concept"&&gt.isOpen()&&jt.has(K)?I.searchParams.set("dataView","overview"):se==="concept"&&G(K)&&!ze.has(K)&&I.searchParams.set("dataView","structure"),se==="concept"&&gt.isOpen()&&ze.has(K)&&I.searchParams.set("dataExample",ze.get(K)),se==="tests"&&kt.has(Te)&&I.searchParams.set("dataExample",kt.get(Te)),I.searchParams.delete("state"),I.searchParams.delete("activity"),I.searchParams.delete("object"),I.searchParams.delete("spec"),se==="concept"&&I.searchParams.set("concept",K),se==="states"&&yt&&I.searchParams.set("state",yt),se==="tests"&&I.searchParams.set("spec",Te),se==="business"){const R=t.business(),O=R.views?.find(V=>V.key===R.viewKey);O?.activity?I.searchParams.set("activity",O.activity):O?.object&&I.searchParams.set("object",O.object)}I.href!==location.href&&history[y?"pushState":"replaceState"]({alderShell:!0},"",I)}function Re(y,I,R){const O=document.createElement(I);return O.textContent=R,y.append(O),O}function It(y){y!==se&&(se==="business"?t.capture():dn(),se=y),n.hidden=se!=="business",g.hidden=se!=="concept",c.hidden=se!=="states",h.hidden=se!=="tests",f.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),Ct(),St()}function Tt(y,I=!0){We&&(y==="subsystems"&&(y="landscape"),Z.includes(y)&&(dn(),st.includes(y)||st.push(y),K=y,It("concept"),Ao(),Dt(),He(),I&&Ze()))}function _a(){dn(),ze.delete(K),jt.add(K),Ao(),A.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer-overview:"+K)??0,He(),Ze()}function Ka(y,I=!0){if(y&&!te(K,y))return;const R=!ze.has(K),O=A.querySelector(".concept-drawer-body");R&&Xe.set("drawer-overview:"+K,O.scrollTop),dn(),jt.delete(K),y?(ze.set(K,y),cn.set(K,y)):ze.delete(K),gt.setOpen(!0),Ao(),R&&(O.scrollTop=0),He(),Ze(),I&&A.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}A.querySelector(".concept-example-back").onclick=()=>{_a(),A.querySelector(".data-review-overview").focus({preventScroll:!0})};function Nn(y,I=!0){t.business().states?.some(R=>R.id===y)&&(dn(),rt.includes(y)||rt.push(y),yt=y,It("states"),ic(),Dt(),He(),I&&Ze())}function vo(y){return y.startsWith("decision:")&&Ee(y)&&!Ee(y)?.capability.testSpecification?Ee(y).key:Ee(y)||y==="@overview"||y==="@unassigned"||y.startsWith("checks:")&&Ge(y.slice(7))||y.startsWith("remaining:")&&an(y.slice(10))?y:t.business().activities.some(I=>I.id===y)?de().find(I=>I.activityId===y)?.key??(Ge(y)?"checks:"+y:"@overview"):"@overview"}function qt(y,I=!0){const R=t.business();if(!R.design?.model||!R.key)return;y=vo(y),se==="tests"&&y!==Te&&dn(),vt.includes(y)||vt.push(y),Te=y;const O=Ee(y);Ei||(O?.capability.testSpecification?Ke.add("tests-function-"+O.key):O?.activityId?Ke.add("tests-activity-"+O.activityId):y.startsWith("checks:")?Ke.add("tests-activity-"+y.slice(7)):y.startsWith("remaining:")?Ke.add("tests-activity-"+y.slice(10)):O&&Ke.add("tests-other")),It("tests"),wo(),Dt(),St(),He(),I&&Ze()}function wo(){const y=t.business().design;if(!y?.model)return;const I=h.querySelector(".test-spec-page"),R=Ee(Te);if(R){const O=document.createElement("section");O.className="test-spec-sample";const V=Q?.findGroup(R.groupId),X=R.samples.find(me=>me.id===kt.get(Te))??R.samples[0],H=!!R.capability.testSpecification,ne=Te.startsWith("decision:");if(H)if(Re(O,"h2",R.name),Re(O,"h3",ne?"可否判定":"処理結果"),ne)R.decisionExampleIds.length?O.append(rl(y,R.decisionExampleIds,Ie())):R.decisionCheckIds.length?O.append(al(y,R.decisionCheckIds,Ie())):Re(O,"p","可否条件の記載はありません。");else{const me=V&&X&&U?new Set(R.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(O.append(cl(y,R.resultCheckIds,Ie(),me)),V&&X&&U){Re(O,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",O.append(Le),U.renderDataExample(Le,V,X.id,Fe=>{Xe.set("tests:"+Te,I.scrollTop),kt.set(Te,Fe),wo(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:R.capability.id,sampleIds:R.samples.map(Fe=>Fe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(V&&X&&U){const me=document.createElement("div");me.className="data-examples-panel test-spec-examples",O.append(me),U.renderDataExample(me,V,X.id,Le=>{Xe.set("tests:"+Te,I.scrollTop),kt.set(Te,Le),wo(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:R.capability.id,heading:R.name,sampleIds:R.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(il(y,X.checkIds??[],Ie()))})}I.replaceChildren(O)}else if(Te==="@overview")I.replaceChildren(),Re(I,"p","左のメニューからテスト仕様を選択してください。");else if(Te.startsWith("remaining:")){const O=Te.slice(10);I.replaceChildren(cr(y,O,Ie(),Jt(O),wn(O)))}else I.replaceChildren(cr(y,Te.startsWith("checks:")?Te.slice(7):void 0,Ie()));Ya(R),I.scrollTop=Xe.get("tests:"+Te)??0}function ei(y){y||(wt=!1),It("business"),y?t.openActivity(y):(wt=!1,t.openOverview()),St(),Dt(),Ze()}function Xa(y){It("business"),t.openObject(y),St(),Dt(),Ze()}function Vs(y){const I=t.business(),R=I.design?.model;return R?[...new Set(R.states.filter(O=>O.objectId===y&&O.basedOn.documentId===R.business.id&&O.basedOn.revision===R.business.revision).flatMap(O=>O.transitions.map(V=>V.activityId)))]:[...new Set((I.design?.objectStateTransitions?.[y]?.model?.transitions??[]).flatMap(O=>O.activityId?[O.activityId]:[]))]}function Fs(y){return(t.business().states??[]).filter(I=>Vs(I.id).includes(y))}function Bs(y){const I=t.business(),R=I.design?.model,O=N?.model.concepts.find(V=>V.id===y);return!R||!N||!O?[]:(I.states??[]).filter(V=>O.businessObjectIds.includes(V.id)&&R.states.some(X=>X.objectId===V.id&&X.basedOn.documentId===R.business.id&&X.basedOn.revision===R.business.revision&&N.model.relatedStates.some(H=>H.documentId===X.id&&H.revision===X.revision)))}function ko(y,I,R="状態遷移"){if(!I.length)return;const O=document.createElement("section");O.className="shell-related-links",Re(O,"h3",R);for(const V of I){const X=Kt(O,V.name,()=>Nn(V.id));X.dataset.relatedState=V.id}y.append(O)}function Gs(y){const I=N?.model.reviewGroups.find(O=>O.id===y.groupId);if(!I)return[];const R=new Set(I.graph.nodes.map(O=>O.conceptId));return[...new Set(y.samples.flatMap(O=>O.blocks.map(V=>V.card)))].filter(O=>R.has(O)&&N?.model.concepts.some(V=>V.id===O))}function Kt(y,I,R){const O=document.createElement("button");return O.type="button",O.className="shell-evidence",Re(O,"span",I),O.onclick=R,y.append(O),O}function Io(y,I){const R=I.filter(V=>V.capability.testSpecification);if(!R.length)return;const O=document.createElement("section");O.className="shell-test-links",Re(O,"h3","テスト仕様書");for(const V of R)for(const[X,H]of[["decision:","可否判定"],["","処理結果"]]){const ne=X+V.key,me=Kt(O,Ve(V)+"・"+H,()=>qt(ne));me.dataset.relatedSpec=ne}y.append(O)}function Za(y,I){const R=de().filter(ne=>ne.activityId===I&&ne.capability.testSpecification),O=N?.model.presentation.activityViews,V=Array.isArray(O)?O.find(ne=>ne&&typeof ne=="object"&&ne.activityId===I):void 0,X=Array.isArray(V?.uncreatedTestSections)?V.uncreatedTestSections:[],H=y.querySelectorAll("[data-business-result],[data-business-exception]");for(const ne of Array.from(H)){const me=ne.dataset.businessException,Le=me?"exception":"result",Fe=me??"result",Be=R.flatMap(at=>at.businessSections.filter($t=>$t.kind===Le&&(Le==="result"||$t.exceptionId===me)).flatMap($t=>$t.pages.filter(J=>J==="decision"?at.decisionCheckIds.length||at.decisionExampleIds.length:at.resultCheckIds.length||at.samples.length).map(J=>({target:at,page:J})))),Mt=document.createElement("section");Mt.className="shell-section-links",Mt.setAttribute("aria-label","テスト仕様書"),ne.dataset.resultScope==="activity"&&Re(Mt,"p",(Be.length?"Activity全体との対応です。":"")+"各Resultとの対応は未確認です。");const ht=new Set;for(const{target:at,page:$t}of Be){const J=($t==="decision"?"decision:":"")+at.key;if(ht.has(J))continue;ht.add(J);const Ce=Kt(Mt,Ve(at)+"・"+($t==="decision"?"可否判定":"処理結果"),()=>qt(J));Ce.dataset.relatedSpec=J}if(!ht.size){const at=Re(Mt,"p",X.includes(Fe)?"テスト仕様書未作成":"テスト仕様書との対応未確認");at.className="shell-spec-warning"}ne.after(Mt)}Io(y,R.filter(ne=>!ne.businessSections.length))}function Ya(y){const I=m.querySelector(".spec-related-content");if(I.replaceChildren(),!y?.capability.testSpecification)return;const R=t.business().activities.find(X=>X.id===y.activityId),O=Q?.findGroup(y.groupId);if(R){Re(I,"h3","Activity");const X=Kt(I,R.name,()=>ei(R.id));X.dataset.relatedActivity=R.id}if(O){Re(I,"h3","概念モデル");const X=Kt(I,O.name,()=>Tt(q(O.id)));X.dataset.relatedGroup=O.id}const V=Gs(y);if(V.length){Re(I,"h3","概念");for(const X of V){const H=N.model.concepts.find(me=>me.id===X),ne=Kt(I,H.name,()=>Tt(B(X)));ne.dataset.relatedConcept=X}}y.activityId&&ko(I,Fs(y.activityId),"状態遷移（同じ Activity）")}function Qa(y,I){Re(y,"h3","Activity");const R=t.business(),O=G(K),V=N?.model.concepts.find(H=>H.id===I),X=O?.concepts[I]?.sourceActivities??O?.activities??V?.activityLinks.filter(H=>H.uses.includes("生成")).map(H=>H.activityId)??[];for(const H of X){const ne=R.activities.find(Le=>Le.id===H);if(!ne)continue;const me=document.createElement("button");me.className="shell-evidence",Re(me,"span",ne.name),me.title=ne.name+"を業務タブで開く",me.setAttribute("aria-label",me.title),me.onclick=()=>ei(ne.id),y.append(me)}}function So(y){const I=G(y);return I?Q?.graph(I.id):y==="overview"?Q?.overviewGraph():void 0}function Hs(y){const I=kn.get(K),R=I?So(K)?.tables[I]:void 0;return R?.conceptId===y?R:void 0}function ec(y,I){const R=Hs(I)??G(K)?.concepts[I]??{...ee[I],sources:void 0};y.replaceChildren(),Re(y,"p",R.note),Re(y,"h3","持つ情報");const O=document.createElement("ul");for(const[,V]of R.fields)Re(O,"li",V);if(y.append(O),R.sources?.length){Re(y,"h3","情報の出所・対象時点");const V=document.createElement("ul");for(const X of R.sources)Re(V,"li",X);y.append(V)}Qa(y,I),Io(y,de().filter(V=>Gs(V).includes(I))),ko(y,Bs(I))}function xo(y){const I=A.querySelector(".shell-heading strong");I.textContent=y,A.setAttribute("aria-label",y)}function Js(y=!1){G(K)&&(mt.delete(K),kn.delete(K),In.delete(K),y||Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},L),ji(),Ct(),A.querySelector(".concept-drawer-body").scrollTop=0,He())}A.querySelector(".concept-selection-clear").onclick=()=>{Js(),ze.has(K)?A.querySelector(".concept-example-back").focus({preventScroll:!0}):A.querySelector(".data-review-overview").focus({preventScroll:!0})};function ji(){const y=A.querySelector(".concept-related-content");A.querySelector(".concept-selection").hidden=!!G(K)&&!mt.has(K)&&!In.has(K),A.querySelector(".concept-selection>h2").hidden=!G(K),A.querySelector(".concept-selection-clear").hidden=!G(K);const I=In.get(K);if(I&&_){const X=_.describe(y,{kind:"group",id:I});xo(X);return}if(K==="landscape"&&xn){y.replaceChildren();for(const[X,H]of _.sections){Re(y,"h3",X);const ne=document.createElement("ul");for(const me of H)Re(ne,"li",me);y.append(ne)}xo("サブシステムの情報");return}const R=mt.get(K),O=G(K),V=We&&R?Hs(R)?.name??O?.concepts[R]?.name??ee[R].name:O?.name??"データ構造の情報";xo(V),We&&R?ec(y,R):(y.replaceChildren(),O||Re(y,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function _s(y){y.onload=()=>{Ks(),y.contentDocument&&(Qs(y.contentDocument),er(y.contentDocument));const I=y.dataset.conceptView??"overview";if(!Q||!N)return;const R=G(I),O=R?Q.graph(R.id):I==="overview"?Q.overviewGraph():{ids:Y,edges:Q.edges,tables:ee};y.contentWindow?.postMessage({type:"alder-concept-data",graph:O,focus:ue.get(I),viewKey:I,documentKey:Ln??N.model.id,clearSelectionOnBackground:!!R},L);const V=mt.get(I);V&&y.contentWindow?.postMessage({type:"alder-concept-highlight",id:V},L)}}_s(w),w.dataset.conceptView="overview";function tc(){A.querySelector(".concept-page-details").hidden=!0,A.querySelector(".concept-example-back").hidden=!0;const y=A.querySelector(".data-review-overview");y.hidden=!0,y.replaceChildren();const I=A.querySelector(".data-examples-panel");I.hidden=!0,I.replaceChildren(),delete I.dataset.dataExample,xn?.root.remove(),xn=void 0;for(const[R,O]of Ot)R!=="overview"&&(O.remove(),Ot.delete(R));w.removeAttribute("src"),w.removeAttribute("srcdoc"),mt.clear(),kn.clear(),In.clear()}function Ao(){g.setAttribute("aria-label",K==="landscape"||G(K)?"サブシステム":"データ構造"),g.querySelector(".concept-empty").hidden=We;const y=g.querySelector(".concept-review-landscape"),I=G(K),R=A.querySelector(".concept-page-details"),O=A.querySelector(".data-review-overview"),V=A.querySelector(".data-examples-panel");if(R.hidden=!We||!I,O.hidden=!We||!I||ze.has(K),V.hidden=!We||!I||!ze.has(K),A.querySelector(".concept-example-back").hidden=V.hidden,We&&I){const H=de();Jc(O,I,U,(me,Le)=>{const Fe=dr(H,I.id,me,Le);if(Fe)return{kind:Fe.kind,open:()=>{const Be=dr(de(),I.id,me,Le);Be&&(Be.sampleId?kt.set(Be.key,Be.sampleId):kt.delete(Be.key),qt(Be.key))}}},me=>ei(me),t.business().activities),Io(O,H.filter(me=>me.groupId===I.id));const ne=ze.get(K)??cn.get(K)??De(K)[0]?.id;ne&&U.renderDataExample(V,I,ne,me=>Ka(me)),O.scrollTop=Xe.get("review-overview:"+K)??0,V.scrollTop=Xe.get("example:"+K+":"+ne)??0}if(y.hidden=!We||!Tn.includes(K),We&&Tn.includes(K)&&(K==="landscape"&&!xn&&(xn=Qc(document,N,Ln??N.model.id,H=>Tt(q(H)))),Hc(y,xn?.root,K==="overview"?"graph":"overview"),K==="landscape"&&xn?.restore()),We&&K!=="landscape"&&!Ot.has(K)){const H=document.createElement("iframe");H.className="concept-frame",H.dataset.conceptView=K,H.title=I?I.name+"のデータ構造":ee[ue.get(K)].name+"と隣接する概念",H.hidden=!0,Ot.set(K,H);const ne=ue.get(K);ne&&mt.set(K,mt.get(K)??ne),_s(H),g.querySelector(".concept-main").append(H)}for(const[H,ne]of Ot)ne.hidden=!We||H!==K,We&&H===K&&!ne.hasAttribute("src")&&!ne.hasAttribute("srcdoc")&&(j?ne.srcdoc=j:ne.src=new URL("concept.html?view=overview"+(G(H)?"&group="+encodeURIComponent(G(H).id):H==="overview"?"":"&focus="+encodeURIComponent(ue.get(H))),document.baseURI).href);const X=mt.get(K);X&&Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:X},L),ji(),Ct(),A.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer:"+K)??0}function Pn(){const y=t.business(),I=y.views?.find(R=>R.activity!==void 0||R.object!==void 0||!wt);I?(It("business"),t.activateView(I.key)):st.length?Tt(st.at(-1),!1):rt.length?Nn(rt.at(-1),!1):vt.length?qt(vt.at(-1),!1):It("empty")}function nc(){if(wt=!0,se==="business"){const y=t.business().views?.find(I=>I.key===t.business().viewKey);!y?.activity&&!y?.object&&Pn()}Dt(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function ic(){E.replaceChildren();const y=t.business().states?.find(ne=>ne.id===yt);if(!y)return;const I=t.statePanel(y.id);I?E.append(I):Re(E,"p","この対象の状態遷移は未定義です。");const R=m.querySelector(".spec-related-content");R.replaceChildren();const O=Vs(y.id),V=t.business().activities.filter(ne=>O.includes(ne.id));if(V.length){Re(R,"h3","Activity");for(const ne of V){const me=Kt(R,ne.name,()=>ei(ne.id));me.dataset.relatedActivity=ne.id}}const X=N?.model.concepts.filter(ne=>Bs(ne.id).some(me=>me.id===y.id))??[];if(X.length){Re(R,"h3","概念");for(const ne of X){const me=Kt(R,ne.name,()=>Tt(B(ne.id)));me.dataset.relatedConcept=ne.id}}const H=de().filter(ne=>ne.activityId&&O.includes(ne.activityId)&&ne.capability.testSpecification);if(H.length){Re(R,"h3","Activity に関連するテスト仕様書");for(const ne of H)for(const[me,Le]of[["decision:","可否判定"],["","処理結果"]]){const Fe=me+ne.key,Be=Kt(R,Ve(ne)+"・"+Le,()=>qt(Fe));Be.dataset.relatedSpec=Fe}}E.scrollTop=Xe.get("state:"+yt)??0}let Eo="";function Dt(){for(const O of Array.from(o.querySelectorAll(".tab"))){const V=t.business().views?.find(H=>H.key===O.dataset.key);O.hidden=wt&&V?.activity===void 0&&V?.object===void 0;const X=!O.hidden&&se==="business"&&O.dataset.key===t.business().viewKey;O.classList.toggle("active",X),O.querySelector("button")?.setAttribute("aria-current",String(X))}const y=(O,V,X)=>{O.replaceChildren();for(const H of V){const ne=X==="concept"?Pe(H):t.business().states?.find(ht=>ht.id===H)?.name??H,me=se===X&&H===(X==="concept"?K:yt),Le=document.createElement("div");Le.className="tab"+(me?" active":"");const Fe=X==="concept"&&(H==="landscape"||G(H))?"subsystems":X;Le.dataset.viewKind=Fe;const Be=document.createElement("button");Be.id=(X==="concept"?"concept-tab-":"state-tab-")+H,$o(Be,Fe,ne),Be.setAttribute("aria-current",String(me)),Be.onclick=()=>X==="concept"?Tt(H):Nn(H),Le.append(Be);const Mt=Wo((Fe==="subsystems"?"サブシステム：":X==="concept"?"データ構造：":"状態遷移：")+ne+"のタブを閉じる");Mt.onclick=()=>{dn(),X==="concept"?(st=st.filter(ht=>ht!==H),H!=="overview"&&(Ot.get(H)?.remove(),Ot.delete(H)),mt.delete(H),kn.delete(H),In.delete(H),ze.delete(H),cn.delete(H),jt.delete(H),se===X&&K===H&&(st.length?Tt(st.at(-1),!1):Pn())):(rt=rt.filter(ht=>ht!==H),se===X&&yt===H&&(rt.length?Nn(rt.at(-1),!1):Pn())),Dt(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(Mt),O.append(Le)}};y(l,st,"concept"),y(u,rt,"states"),p.replaceChildren();for(const O of vt){const V=Ha(O),X=document.createElement("div");X.className="tab"+(se==="tests"&&O===Te?" active":""),X.dataset.viewKind="tests";const H=document.createElement("button");H.id="spec-tab-"+O,$o(H,"tests",V),H.setAttribute("aria-current",String(se==="tests"&&O===Te)),H.onclick=()=>qt(O);const ne=Wo("テスト仕様："+V+"のタブを閉じる");ne.onclick=()=>{vt=vt.filter(me=>me!==O),se==="tests"&&Te===O&&(vt.length?qt(vt.at(-1),!1):Pn()),Dt(),St(),He(),Ze()},X.append(H,ne),p.append(X)}const I=a.querySelector(".tab.active:not([hidden])"),R=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+K:se==="states"?"states:"+yt:se==="tests"?"tests:"+Te:"";I?(R!==Eo&&Vc(a,I),Eo=R):Eo=""}function oc(){innerWidth<=800&&Di(!1)}function St(){const y=k.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,I=k.scrollTop,R=t.business(),O=D.value.trim().toLocaleLowerCase();k.replaceChildren();const V=(J,Ce,ct)=>({kind:"item",id:J,name:Ce,key:ct}),X=(J,Ce,ct)=>({kind:"group",id:J,name:Ce,children:ct}),H=de(),ne=J=>V(J.key,J.name,"tests:"+J.key),me=H.filter(J=>J.capability.testSpecification),Le=H.filter(J=>!J.capability.testSpecification),Fe=me.map(J=>X("tests-function-"+J.key,Ve(J),[V("decision:"+J.key,"可否判定","tests:decision:"+J.key),V(J.key,"処理結果","tests:"+J.key)]));for(const J of R.activities){const Ce=Le.filter(it=>it.activityId===J.id).map(ne),ct=(Jt(J.id).size?"remaining:":"checks:")+J.id;an(J.id)&&Ce.push(V(ct,"その他","tests:"+ct)),Ce.length&&Fe.push(X("tests-activity-"+J.id,J.name,Ce))}const Be=Le.filter(J=>!J.activityId);Be.length&&Fe.push(X("tests-other","その他",Be.map(ne))),Ga()&&Fe.push(V("@unassigned","未割当","tests:@unassigned"));const Mt=[{id:"business",label:"業務設計",items:[V("overview","全体図","business:overview"),X("business-activity","Activity",R.activities.map(J=>V(J.id,J.name,"business:"+J.id))),X("business-object","Object",(R.objects??[]).map(J=>V(J.id,J.name,"object:"+J.id)))]},{id:"states",label:"状態遷移",items:(R.states??[]).map(J=>V(J.id,J.name,"states:"+J.id))},{id:"subsystems",label:"サブシステム",items:N?.model.subsystems.length?[V("landscape","全体図","concept:landscape"),...N.model.subsystems.map(J=>X("subsystem-"+J.id,J.name.replace(/サブシステム$/,""),N.model.reviewGroups.filter(Ce=>Ce.subsystemId===J.id).map(Ce=>V(q(Ce.id),Ce.title,"concept:"+q(Ce.id)))))]:[]},{id:"concept",label:"データ構造",items:We&&Y.length?[V("overview","全体図","concept:overview"),X("concept-relations","概念",Y.map(J=>V(B(J),ee[J].name,"concept:"+B(J))))]:[]},{id:"tests",label:"テスト仕様",items:R.design?.model&&(H.length||Ie().length)?Fe:[]}];let ht=0;const at=(J,Ce,ct)=>{const it=document.createElement("button");it.className="explorer-item"+(ct?" explorer-item-nested":""),it.dataset.explorerKey=J.key,it.textContent=J.name;const Ye=R.views?.find(Je=>Je.key===R.viewKey);return se===(Ce.id==="subsystems"?"concept":Ce.id)&&(["concept","subsystems"].includes(Ce.id)?J.id===K:Ce.id==="states"?J.id===yt:Ce.id==="tests"?J.id===Te:J.key.startsWith("object:")?Ye?.object===J.id:J.id==="overview"?!wt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===J.id)&&it.setAttribute("aria-current","page"),it.disabled=Ce.id==="business"&&!R.key,it.onclick=()=>{b.hidden||t.closeLegacyList(),Ce.id==="business"?J.key.startsWith("object:")?Xa(J.id):ei(J.id==="overview"?void 0:J.id):Ce.id==="concept"||Ce.id==="subsystems"?Tt(J.id):Ce.id==="tests"?qt(J.id):Nn(J.id),oc()},it},$t=(J,Ce,ct,it=!1)=>{const Ye=document.createElement("button"),Wt=O?!Sn.has(J):Ke.has(J);return Ye.className=(ct?"explorer-subparent":"explorer-parent")+(it?" explorer-pending":""),Ye.dataset.explorerKey="group:"+J,Re(Ye,"span",Ce).className="explorer-parent-label",it?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(Wt)),Ye.setAttribute("aria-controls","explorer-"+J),Ye.append(zc(Wt)),Ye.onclick=()=>{O?Sn.has(J)?Sn.delete(J):Sn.add(J):(Ke.has(J)?Ke.delete(J):Ke.add(J),He()),St()},Ye)};for(const J of Mt){const Ce=J.items.flatMap(Je=>{if(Je.kind==="item")return!O||(J.label+" "+Je.name).toLocaleLowerCase().includes(O)?[Je]:[];const ln=O?Je.children.filter(jo=>(J.label+" "+Je.name+" "+jo.name).toLocaleLowerCase().includes(O)):Je.children;return!O||ln.length?[{...Je,children:ln}]:[]});if(O&&!Ce.length)continue;const ct=J.id!=="business"&&!J.items.length,it=document.createElement("section"),Ye=$t(J.id,J.label,!1,ct),Wt=document.createElement("div");Wt.id="explorer-"+J.id,Wt.hidden=ct||(O?Sn.has(J.id):!Ke.has(J.id));for(const Je of Ce){if(Je.kind==="item"){Wt.append(at(Je,J,0)),ht++;continue}const ln=document.createElement("div");ln.id="explorer-"+Je.id,ln.hidden=O?Sn.has(Je.id):!Ke.has(Je.id),Wt.append($t(Je.id,Je.name,!0),ln);for(const jo of Je.children)ln.append(at(jo,J,1)),ht++;!Je.children.length&&!O&&(Re(ln,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ce.length&&!ct&&(Re(Wt,"p","項目がありません。").className="explorer-empty"),it.append(Ye,Wt),k.append(it)}O&&!ht&&(Re(k,"p","該当する項目はありません。").className="explorer-empty"),k.scrollTop=I,y&&Array.from(k.querySelectorAll("[data-explorer-key]")).find(J=>J.dataset.explorerKey===y)?.focus({preventScroll:!0})}function Di(y){_t=y,Ct(),He(),(y?s.querySelector(".shell-heading button"):x).focus({preventScroll:!0})}x.addEventListener("click",y=>{y.preventDefault(),y.stopImmediatePropagation(),Di(!_t)},!0),s.querySelector(".shell-heading button").onclick=()=>Di(!1),D.oninput=()=>{Sn.clear(),St()},s.addEventListener("keydown",y=>{if(y.key==="Escape"&&!y.defaultPrevented&&b.hidden&&(y.preventDefault(),y.stopPropagation(),Di(!1)),(y.key==="ArrowDown"||y.key==="ArrowUp")&&k.contains(document.activeElement)){const I=Array.from(k.querySelectorAll("button")).filter(V=>!V.disabled&&!V.closest("[hidden]")),R=I.indexOf(document.activeElement),O=I[R+(y.key==="ArrowDown"?1:-1)];O&&(y.preventDefault(),O.focus())}}),v.addEventListener("click",y=>{se!=="business"&&(y.preventDefault(),y.stopImmediatePropagation(),(se==="concept"||se==="states"||se==="tests"&&Ee(Te)?.capability.testSpecification)&&(gt.setOpen(!gt.isOpen()),Ct(),He(),Ze(!1)))},!0),A.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Ct(),He(),Ze(!1),v.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Ct(),He(),Ze(!1),v.focus({preventScroll:!0})},window.addEventListener("message",y=>{if(y.origin!==location.origin&&!(location.protocol==="file:"&&y.origin==="null"))return;const I=Array.from(Ot).find(([,O])=>y.source===O.contentWindow);if(!I)return;if(y.data?.type==="alder-concept-rendered"){I[1].contentDocument&&(Qs(I[1].contentDocument),er(I[1].contentDocument));return}if(se!=="concept"||I[0]!==K)return;const R=G(K);if(y.data?.type==="alder-concept-clear-selection"){R&&Js(!0);return}if(y.data?.type==="alder-concept-subsystem"){if(!So(K)?.regions.some(O=>O.id===y.data.id))return;mt.delete(K),kn.delete(K),In.set(K,y.data.id),ji(),Ct(),He();return}if(!(!Y.includes(y.data?.id)||R&&!R.concepts[y.data?.id])){if(y.data.type==="alder-concept-open"){Tt(B(y.data.id));return}y.data.type==="alder-concept-select"&&(In.delete(K),mt.set(K,y.data.id),(typeof y.data.viewId=="string"?So(K)?.tables[y.data.viewId]:void 0)?.conceptId===y.data.id?kn.set(K,y.data.viewId):kn.delete(K),innerWidth<=800&&(_t=!1),ji(),Ct(),He())}});function Ks(){const y=getComputedStyle(document.documentElement);for(const I of Ot.values()){const R=I.contentDocument?.documentElement;if(R){R.dataset.theme=document.documentElement.dataset.theme??"light";for(const O of["--bg","--panel","--fg","--line","--subtle","--select"])R.style.setProperty(O,y.getPropertyValue(O))}}}function Ct(){!b.hidden&&se==="business"&&(_t=!0),s.hidden=!_t,x.disabled=!1,x.setAttribute("aria-controls","design-explorer"),x.setAttribute("aria-label","ナビゲーションを開閉"),x.setAttribute("aria-expanded",String(_t));const y=gt.isReady?.()??!0;A.hidden=se!=="concept"||!We||!y||!gt.isOpen();const I=!!Ee(Te)?.capability.testSpecification;m.hidden=!(se==="states"||se==="tests"&&I)||!y||!gt.isOpen(),xi&&se!=="business"&&(xi.hidden=!0),se==="concept"?(v.disabled=!We||!y,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!A.hidden))):se==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):se==="states"||se==="tests"&&I?(v.disabled=!y,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!m.hidden))):(se==="tests"||se==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const R=i.querySelector("#document-actions");R&&(R.hidden=se!=="business");const O=i.querySelector("#document-actions-toggle");O&&se!=="business"&&(O.hidden=!0),Ks(),Oo()}function Oo(){const y=i.getBoundingClientRect().bottom;y>0&&e.style.setProperty("--shell-content-top",y+"px")}if(typeof ResizeObserver<"u"){const y=new ResizeObserver(Oo);y.observe(i),y.observe(e.querySelector("header"))}window.addEventListener("resize",Oo);function Xs(){dn(),Ei=!0;try{const y=new URL(location.href).searchParams;if(se==="concept"&&y.get("view")==="concept"&&y.get("concept")===K&&!ze.has(K)&&te(K,y.get("dataExample"))&&Xe.set("drawer-overview:"+K,A.querySelector(".concept-drawer-body").scrollTop),We||(jt.clear(),ze.clear(),cn.clear(),st=[],K="overview",w.removeAttribute("src"),w.removeAttribute("srcdoc")),y.get("view")==="concept"){const I=We&&Z.includes(y.get("concept")??"")?y.get("concept"):"landscape",R=y.get("dataExample");We&&G(I)&&y.get("dataView")==="overview"&&!te(I,R)?(jt.add(I),ze.delete(I)):(jt.delete(I),We&&te(I,R)?(ze.set(I,R),cn.set(I,R)):ze.delete(I)),Tt(I,!1)}else if(y.get("view")==="states")t.business().states?.some(I=>I.id===y.get("state"))?Nn(y.get("state"),!1):Pn();else if(y.get("view")==="tests"){const I=vo(y.get("spec")??"@overview"),R=y.get("dataExample"),O=Ee(I);O&&R&&O.samples.some(V=>V.id===R)?kt.set(I,R):O&&kt.delete(I),qt(I,!1)}else if(y.get("view")==="empty")It("empty");else if(It("business"),t.business().key){const I=y.get("activity"),R=y.get("object"),O=t.business(),V=O.views?.find(X=>X.key===O.viewKey);I&&O.activities.some(X=>X.id===I)?V?.activity!==I&&t.openActivity(I):R&&O.objects?.some(X=>X.id===R)?V?.object!==R&&t.openObject(R):(wt=!1,(!V||V.activity!==void 0||V.object!==void 0)&&t.openOverview())}Dt(),St()}finally{Ei=!1}}return window.addEventListener("popstate",Xs),{closeBusinessOverview:nc,reopenBusinessOverview(){wt=!1},activateBusiness(){It("business")},businessActivated(){It("business"),Dt(),St(),Ze()},syncChrome:Ct,appendActivityTestLinks(y,I){Za(y,I),ko(y,Fs(I))},openRelatedChecks(y){Ke.add("tests"),qt(y&&Ge(y)?"checks:"+y:"@overview")},syncDocument(){const y=t.business(),I=y.concept,R=!!(Ln&&y.key!==Ln||Oi&&Qn&&y.key&&y.key!==Qn),O=N?.model!==I?.model||N?.business!==I?.business;if((R||O&&N)&&(h.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),A.querySelector(".concept-related-content").replaceChildren(),wt=!1,st=[],rt=[],vt=[],K="overview",yt="",Te="@overview",kt.clear(),Xe.clear(),jt.clear(),ze.clear(),cn.clear(),tc(),se!=="business"&&It("business"),R&&!Oi&&Ze(!1)),O){N=I,Q=I?Bc(I):void 0,U=I?td(I):void 0,_=I?_c(I):void 0,We=!!I,ee=Q?.tables??{},Y=Object.keys(ee);const V=Q?.groups.map(H=>H.id)??[],X=new Set([...Tn,"subsystems"]);if(ye=new Map(V.map(H=>[H,X.has(H)||Y.includes(H)?"group:"+H:H])),pe=new Map(Y.map(H=>[H,X.has(H)||V.includes(H)?"concept:"+H:H])),ce=new Map([...ye].map(([H,ne])=>[ne,H])),ue=new Map([...pe].map(([H,ne])=>[ne,H])),Z=[...Tn,...ce.keys(),...ue.keys()],Array.isArray(Oe?.expanded)&&Oe.expandedVersion!==4){Ke.add("subsystems"),Ke.add("concept-relations");for(const H of I?.model.subsystems??[])Ke.add("subsystem-"+H.id)}}if(Ln=y.key,rt=rt.filter(V=>y.states?.some(X=>X.id===V)),se==="business"&&wt&&y.views?.find(V=>V.key===y.viewKey)?.activity===void 0&&y.views?.find(V=>V.key===y.viewKey)?.object===void 0&&Pn(),Oi&&y.key){if(Ja(),Qn===y.key){Array.isArray(Oe?.specs)&&(vt=[...new Set(Oe.specs.filter(V=>typeof V=="string").map(V=>vo(V)))]);for(const[V,X]of Object.entries(Oe?.specExamples??{})){const H=Ee(V);typeof X=="string"&&H?.capability.samples.some(ne=>ne.id===X)&&kt.set(V,X)}}Oi=!1,Xs()}St(),Dt(),Ct(),R&&He()}}}class Ho{tabs=new WeakMap;router;constructor(t=To){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,r){const s=JSON.stringify([i.map(g=>[g.id,g.width,g.height]),o.map(g=>[g.kind,g.from,g.to,g.label]),r]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==s,l=new Set(i.filter(g=>{const c=d?.nodes.get(g.id);return!c||c.x!==g.x||c.y!==g.y}).map(g=>g.id)),u=new Set(i.map(g=>g.id)),p=a?new Array(o.length):d.routes.slice();if(o.forEach((g,c)=>{!a&&!l.has(g.from)&&!l.has(g.to)||(p[c]=u.has(g.from)&&u.has(g.to)?this.router({from:g.from,to:g.to,index:c,nodes:i,kind:g.kind,matrix:r?.[c],labels:r?.[c]?[]:[...p.flatMap((h,m)=>h&&m<c?[{id:String(m),x:h.label[0]-Math.max(30,o[m].label.length*12)/2,y:h.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:r?.[c]?[]:p.flatMap((h,m)=>h&&m<c?[h.points]:[]),labelWidth:Math.max(30,g.label.length*12),labelHeight:18}):void 0)}),r){const g=[],c=new Map,h=p.map((m,f)=>f).sort((m,f)=>Number(r[m].returning)-Number(r[f].returning));for(const m of h){const f=p[m];if(!f)continue;const b=i.find(w=>w.id===o[m].from),x=Math.max(30,o[m].label.length*12),v=r[m].returning?[Math.max(...f.points.map(w=>w[0]))+8+x/2,f.points[0][1]]:[b.x+b.width*.125+8+x/2,uc(b.y+b.height,r[m].captionLane*Fr)+9],D=Br(o[m],m,r[m]),k=c.get(D)??qo(v,x,18,i,g);(k[0]!==f.label[0]||k[1]!==f.label[1])&&(p[m]={...f,label:k}),c.has(D)||(c.set(D,k),g.push({id:String(m),x:k[0]-x/2,y:k[1]-9,width:x,height:18}))}}return this.tabs.set(t,{design:n,structure:s,nodes:new Map(i.map(g=>[g.id,{...g}])),routes:p}),p}}function ul(e,t,n,i){const o=(p,g,c)=>(g[0]-p[0])*(c[1]-p[1])-(g[1]-p[1])*(c[0]-p[0]),r=o(e,t,n),s=o(e,t,i),d=o(n,i,e),a=o(n,i,t),l=1e-6;if(r*s<-l&&d*a<-l)return!0;if(Math.max(Math.abs(r),Math.abs(s),Math.abs(d),Math.abs(a))>l)return!1;const u=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[u],t[u]),Math.max(n[u],i[u]))-Math.max(Math.min(e[u],t[u]),Math.min(n[u],i[u]))>.1}function pl(e,t,n,i,o=[]){const r=e.x+e.width,s=24,d=e.y+e.height,a=r-8-(2*(n.count-n.index)-1)*s,l=t.filter(x=>x.id!==e.id);let u;for(const x of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const D=[a+x,d],k=[D[0]+s,d];if(D[0]<e.x+8||k[0]>r-8)continue;const w=d+n.depth+v,A=Math.min(12,(k[0]-D[0])/2,(w-d)/2),E=[D];let $=`M${D}`;const L=U=>{$+=` L${U}`,E.push(U)},j=(U,_)=>{const ee=E.at(-1);$+=` Q${U} ${_}`;for(let Y=1;Y<=4;Y++){const Z=Y/4,ce=1-Z;E.push([ce*ce*ee[0]+2*ce*Z*U[0]+Z*Z*_[0],ce*ce*ee[1]+2*ce*Z*U[1]+Z*Z*_[1]])}};L([D[0],w-A]),j([D[0],w],[D[0]+A,w]),L([k[0]-A,w]),j([k[0],w],[k[0],w-A]),L(k);const N=pc(E,l,.3),Q=o.filter(U=>E.slice(1).some((_,ee)=>U.slice(1).some((Y,Z)=>ul(E[ee],_,U[Z],Y)))).length;if((!u||N<u.collisions||N===u.collisions&&Q<u.wireCollisions)&&(u={path:$,points:E,collisions:N,wireCollisions:Q,low:w,extra:v,shift:x}),N===0&&Q===0)break}const{path:p,points:g,collisions:c,wireCollisions:h,low:m,extra:f,shift:b}=u;return{path:p,points:g,label:[Math.max(r+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...g.map(x=>x[0])),bottom:Math.max(...g.map(x=>x[1]))},collisions:c+h,rerouted:f>0||b!==0,fallback:c+h>0}}function fl(e,t=ls()){const n="http://www.w3.org/2000/svg",i=(q,B={})=>{const G=document.createElementNS(n,q);for(const[ge,te]of Object.entries(B))G.setAttribute(ge,te);return G},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},r=e.transitions.map(q=>[q]),s=[...new Set(["@new",...e.states,...r.map(q=>q[0].to)])],d={nodes:s.map(q=>({id:q,type:"business",name:o[q]??q,scope:!0})),relations:r.map(([q])=>({kind:q.path==="exception"?"business-exception":"input",from:q.from,to:q.to,label:q.id+"："+q.activity+"："+q.condition}))},a=fs(d,s),l=q=>{const B=Array.from(q);return Array.from({length:Math.ceil(B.length/28)},(G,ge)=>B.slice(ge*28,(ge+1)*28).join(""))},u=r.map(([q])=>({from:q.from,activity:q.activity,rows:[q],lines:[],lineRows:[],offset:0,width:0,height:0})),p=new Map;for(const[q,B]of u.entries()){const G=B.rows[0],ge=e.transitions.filter(de=>de.from===G.from&&(de.activityId??de.activity)===(G.activityId??G.activity)&&de.path===G.path&&(G.path!=="exception"||(de.exception??"例外名未定義")===(G.exception??"例外名未定義"))),te=ge.map(de=>(de.conditionLabel??de.condition).trim().replace(/\s+/g," ")),De=new Set(te).size===ge.length?G.conditionLabel??G.condition:G.condition,Ie=[G.path==="exception"?"例外："+(G.exception??"例外名未定義"):"",...ge.length>1||G.path==="normal"&&G.conditionLabel?[De]:[]].filter(Boolean).join("：");B.lines=l(B.activity+(Ie?"（"+Ie+"）":"")),B.lineRows=B.lines.map(()=>B.rows),B.width=Math.max(...B.lines.map(de=>Array.from(de).length*14)),B.height=B.lines.length*18,a.wires[q].returning||(B.offset=p.has(B.from)?p.get(B.from)+8:0,p.set(B.from,B.offset+B.height))}const g=new Map;r.forEach(([q],B)=>{if(q.from===q.to){const G=g.get(q.from)??[];G.push(B),g.set(q.from,G)}});const c=new Map,h=new Map;for(const[q,B]of g){let G=0;for(const te of[...B].reverse())c.set(te,{leader:B[0],index:0,count:1,depth:0,offset:G}),G+=u[te].height+8;const ge=24+Math.max(0,G-8)+8;h.set(q,ge);for(const te of B)c.get(te).depth=ge}const m=q=>44,f=s.slice().sort((q,B)=>a.positions[q][1]-a.positions[B][1]);let b=Math.max(40,...u.map((q,B)=>a.wires[B].returning&&q.from===f[0]?16+q.height/2-44*(a.wires[B].fromPort??.5):40));const x=new Map;for(const q of f){const B=m(),G=(p.get(q)??0)+(h.get(q)??0);x.set(q,b),b+=fc(B,G)}const v=s.map(q=>({id:q,x:t.positions.get(q)?.[0]??a.positions[q][0],y:t.positions.get(q)?.[1]??x.get(q),width:Math.max(104,Array.from(o[q]??q).length*14+32),height:m()})),D=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),k=i("title");k.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(s.includes("@none")?"作成なしはこの操作の処理結果。":"")+(s.includes("@unknown")?"未決は設計課題。":""),D.append(k),D.append(us("state-transition-"));const w=new Map,A=[],E=[];let $=t.selected;const L=q=>{$=q,t.selected=q;const B=Ui(e.transitions,$);for(const[te,De]of w)De.setAttribute("class","node graph-shape state-shape"+B.nodeClasses(te)),De.setAttribute("aria-pressed",String(te===$));A.forEach(({element:te,rows:De})=>{const Pe=De[0].from===De[0].to;te.setAttribute("class","edge"+(Pe?" state-self-loop":De[0].path==="exception"?" exception":"")+B.labelClasses(De)),te.setAttribute("marker-end","url(#state-transition-"+(De.some(B.related)?"related-arrow":"arrow")+")")});for(const te of E)te.element.setAttribute("class","state-caption-line"+B.labelClasses(te.rows));D.querySelectorAll("[data-exception-paint]").forEach(te=>te.remove());const G=Array.from(D.children).find(te=>te.matches(".state-diagram-edge-label,[data-state]"))??null,ge=[...A].sort((te,De)=>Number(te.rows.some(B.related))-Number(De.rows.some(B.related)));for(const{element:te}of ge)if(D.insertBefore(te,G),te.classList.contains("exception")||te.classList.contains("state-self-loop")){const De=D.children.length;ps(D,te,{path:te.getAttribute("d")},{"data-transitions":te.getAttribute("data-transitions")});for(const Pe of Array.from(D.children).slice(De))D.insertBefore(Pe,G)}D.querySelectorAll(".state-diagram-edge-label").forEach(te=>D.append(te))};D.addEventListener("click",q=>{q.target===D&&L()}),D.addEventListener("keydown",q=>{q.key==="Escape"&&(q.preventDefault(),L())});const j=a.wires.map((q,B)=>({...q,captionLane:(u[B].offset+(h.get(u[B].from)??0))/Fr})),N=d.relations.map((q,B)=>({...q,label:String(B).padEnd(Math.ceil(u[B].width/12),"x")})),Q=[...c].map(([q,B])=>{const G=v.find(te=>te.id===r[q][0].from),ge=u[q];return{x:G.x+G.width+8,y:G.y+G.height+24+B.offset,width:ge.width,height:ge.height}});let U=new Ho().update({},e,v,N,j);for(let q=0;q<=Q.length;q++){let B=!1,G=0;if(U.forEach((ge,te)=>{if(!ge||c.has(te)||!j[te].returning)return;let De=0;for(const Pe of Q)for(let Ie=1;Ie<ge.points.length;Ie++){const de=ge.points[Ie-1],Ee=ge.points[Ie];if(Math.abs(de[0]-Ee[0])>1e-7||Math.abs(de[1]-Ee[1])<2)continue;const Ve=de[0];if(Ve<Pe.x-4||Ve>Pe.x+Pe.width+4||Math.max(de[1],Ee[1])<Pe.y-4||Math.min(de[1],Ee[1])>Pe.y+Pe.height+4)continue;const Ge=Pe.x+Pe.width+12-Ve;Ge>0&&(De=Math.max(De,Ge))}De&&(j[te]={...j[te],returnLane:(j[te].returnLane??0)+Math.ceil(De/16)+G++},B=!0)}),!B)break;U=new Ho().update({},e,v,N,j)}const _=U.flatMap((q,B)=>q&&!c.has(B)?[q.points]:[]),ee=new Map,Y=U.map((q,B)=>{const G=c.get(B);if(!G)return q;const ge=r[B][0].from,te=v.find(Ge=>Ge.id===ge),De=U.flatMap((Ge,Jt)=>Ge&&!c.has(Jt)?[Ge.points]:[]),Pe=Math.max(30,N[B].label.length*12),Ie=u[B];let de=ee.get(G.leader);de||(de=pl(te,v,{...G,labelLeft:te.x+te.width+8},Pe,_),ee.set(G.leader,de),_.push(de.points));const Ee=De.flatMap((Ge,Jt)=>Ge.slice(1).map((wn,an)=>({id:`${Jt}:${an}`,x:Math.min(Ge[an][0],wn[0])-2,y:Math.min(Ge[an][1],wn[1])-2,width:Math.abs(Ge[an][0]-wn[0])+4,height:Math.abs(Ge[an][1]-wn[1])+4}))),Ve=qo([te.x+te.width+8+Ie.width/2,te.y+te.height+24+G.offset+Ie.height/2],Ie.width,Ie.height,[...v,...Ee]);return{...de,label:[Ve[0]-Ie.width/2+Pe/2,Ve[1]]}}),Z=new Array(r.length),ce=[],ue=r.map((q,B)=>B).sort((q,B)=>Number(j[q].returning)-Number(j[B].returning));for(const q of ue){const B=Y[q],G=u[q],ge=Math.max(30,N[q].label.length*12);let te=[B.label[0]-ge/2+G.width/2,B.label[1]+(j[q].returning?0:G.height/2-9)];const De=v.find(de=>de.id===r[q][0].from),Pe=v.find(de=>de.id===r[q][0].to);if(!c.has(q)&&j[q].returning&&Pe&&Pe.y>De.y){const de=B.points.slice(1).map((Ee,Ve)=>[B.points[Ve],Ee]).filter(([Ee,Ve])=>Math.abs(Ee[0]-Ve[0])<.01&&Ve[1]-Ee[1]>24).sort(([Ee,Ve],[Ge,Jt])=>Jt[1]-Ge[1]-(Ve[1]-Ee[1]))[0];if(de){const[Ee,Ve]=de;te=[Ee[0]+8+G.width/2,Ee[1]+Math.min(24+G.height/2,(Ve[1]-Ee[1])/2)]}}const Ie=qo(te,G.width,G.height,v,ce);Z[q]=Ie,ce.push({id:String(q),x:Ie[0]-G.width/2,y:Ie[1]-G.height/2,width:G.width,height:G.height})}let ye=Math.max(...v.map(q=>q.x+q.width))+40,pe=Math.max(...v.map(q=>q.y+q.height))+40;r.forEach((q,B)=>{const G=c.get(B);if(G&&G.leader!==B)return;const ge=G?r.flatMap((de,Ee)=>c.get(Ee)?.leader===B?de:[]):q,te=ge[0],De=Y[B],Pe=i("path",{d:De.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":ge.map(de=>de.id).join(" ")});(G||te.path==="exception")&&Pe.setAttribute("stroke-dasharray","6 5");const Ie=i("title");Ie.textContent=ge.map(de=>`${de.id} ${de.activity} / ${de.path==="normal"?"通常":"例外："+(de.exception??"例外名未定義")}：${de.condition}`).join(" / "),Pe.append(Ie),D.append(Pe),A.push({element:Pe,rows:ge}),ye=Math.max(ye,De.bounds.right+40),pe=Math.max(pe,De.bounds.bottom+40)});for(const[q,B]of u.entries()){const G=Z[q],ge=G[0]-B.width/2,te=G[1]-B.height/2+14;D.append(i("rect",{x:String(ge),y:String(te-14),width:String(B.width),height:String(B.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const De=i("text",{x:String(ge),y:String(te),class:"state-diagram-edge-label","data-activity":B.activity,"data-transition-id":B.rows[0].id,"aria-label":B.lines.join("")});B.lines.forEach((Pe,Ie)=>{const de=i("tspan",{x:String(ge),dy:Ie?"18":"0","font-size":"14","font-weight":"600"});de.textContent=Pe,de.setAttribute("data-transitions",B.lineRows[Ie].map(Ee=>Ee.id).join(" ")),E.push({element:de,rows:B.lineRows[Ie]}),De.append(de)}),D.append(De),ye=Math.max(ye,ge+B.width+24),pe=Math.max(pe,te+B.height+24)}for(const q of v){const B=q.id.startsWith("@"),G=i("g",{role:"button",tabindex:"0","aria-label":o[q.id]??q.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":q.id,"data-node":q.id});G.append(Ur(document,q,B)),G.append(i("rect",{x:String(q.x),y:String(q.y),width:String(q.width),height:String(q.height),rx:B?"20":"8",class:B?"state-diagram-node state-note":"state-diagram-node"}));const ge=i("text",{x:String(q.x+q.width/2),y:String(q.y+q.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(ge.textContent=o[q.id]??q.id,G.append(ge),B&&q.id!=="@new"){const te=i("text",{x:String(q.x+q.width/2),y:String(q.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});te.textContent=q.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",G.append(te)}G.addEventListener("click",()=>L(q.id)),G.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),L(q.id))}),w.set(q.id,G),D.append(G)}return L(t.selected),D.setAttribute("viewBox",`0 0 ${ye} ${pe}`),D.style.minWidth=`${ye}px`,D}const lr=new WeakMap;function ml(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const r=(m,f,b=o)=>{const x=document.createElement(m);return x.textContent=f,b.append(x),x};if(i.error)return r("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const s=i.model;for(const m of s.transitions){if(!e.graph.nodes.some(f=>f.id===m.activity&&f.type==="business"))return r("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const f=e.model?.business.exceptions?.find(b=>b.id===m.exceptionId);if(!f||f.activityId!==m.activity)return r("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=lr.get(e)??new Map;lr.set(e,d);const a=d.get(t)??ls();d.set(t,a);const l={...s,transitions:s.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(f=>f.id===m.activity)?.name??m.activity}))};o.append(zr(document,m=>fl(l,m),a));const u=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,p={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},g=document.createElement("details");r("summary",`操作の詳細（${s.transitions.length}）`,g);const c=document.createElement("ol");g.append(c),o.append(g);for(const m of s.transitions){const f=document.createElement("li");f.dataset.transition=m.id,r("h3",`${m.id} · ${u(m.from)} → ${u(m.to)}`,f),m.path==="exception"&&r("p","例外名："+(m.exception??"未定義"),f),r("p",`${p[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,f);const b=e.graph.nodes.find(x=>x.id===m.activity&&x.type==="business");if(b){const x=document.createElement("button");x.type="button",x.textContent=b.name,x.onclick=()=>n(b.id),f.append(x)}else r("p","要確認：根拠Activityが見つかりません — "+m.activity,f);r("p","条件："+m.condition,f),r("p",m.note,f),r("p","根拠："+m.evidence,f),c.append(f)}s.transitions.length||r("p","明示された操作はありません。");const h=document.createElement("details");return r("summary","宣言の出典",h),r("p",s.source,h),o.append(h),o}const ur=64,hl=96,bl=260,pr=40,gl=4;function yl(e,t,n=!0){const{nodes:i,previous:o,children:r,parents:s,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}=mc(e,t),u=s.map(k=>k.length),p=i.map(()=>0),g=i.flatMap((k,w)=>u[w]===0?[w]:[]);for(let k=0;k<g.length;k++)for(const w of r[g[k]])p[w]=Math.max(p[w],p[g[k]]+1),--u[w]===0&&g.push(w);const c=Array.from({length:p.reduce((k,w)=>Math.max(k,w),0)+1},()=>[]);i.forEach((k,w)=>c[p[w]].push(w));const h=i.map(()=>0),m=k=>k.forEach((w,A)=>h[w]=A);c.forEach(m);for(let k=0;k<gl;k++){const w=k%2?[...c].reverse():c;for(const A of w){const E=new Map(A.map($=>{const L=k%2?r[$]:s[$];return[$,L.length?L.reduce((j,N)=>j+h[N],0)/L.length:h[$]]}));A.sort(($,L)=>E.get($)-E.get(L)||$-L),m(A)}}const f=c[0].filter(k=>i[k].type==="object"&&o[k].length===0&&r[k].length>0);if(n&&f.length>1){const k=new Set(f),w=c[0].filter(A=>!k.has(A));c.splice(0,1,...f.map((A,E)=>E===0?[...w,A]:[A]))}const b=Object.create(null),x=i.map(()=>0),v=[],D=Math.ceil(bl/ur)-1;for(let k=0;k<c.length;k++){const w=new Map;for(const $ of v)for(const L of $)w.set(L,L+1);const A=$=>{let L=$;for(;w.has(L);)L=w.get(L);let j=$;for(;w.has(j);){const N=w.get(j);w.set(j,L),j=N}return L},E=[];for(const $ of c[k]){let L=k;for(const N of s[$])L=Math.max(L,x[N]+1);const j=A(L);x[$]=j,w.set(j,j+1),E.push(j),b[i[$].id]=[pr+k*ur,pr+j*hl]}v.push(E),v.length>D&&v.shift()}return{positions:b,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}}function vl(e,t){return Gr(e)?fs(e,t).positions:yl(e,t).positions}const fr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function ca(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>fr(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const r=fr(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(r)return r}return 0})}}function da(e){const t=ca(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([r,s])=>[i.get(r),s])))}}function la(e){const t=da(e);return t.restore(vl(t.graph,t.order))}function wl(e){const t=da(e),n=fs(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function ua(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function kl(e,t){if(!e)return!1;const n=r=>"format"in r?!!r.document?.handle||r.recovery.some(s=>s.handle!==void 0):r.tabs.some(s=>s.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(r,s){if(Object.is(r,s))return!0;if(!r||!s||typeof r!="object"||typeof s!="object"||i.has(r)||i.has(s))return!1;const d=c=>Array.isArray(c)||Object.getPrototypeOf(c)===null||Object.getPrototypeOf(c)?.constructor?.name==="Object";if(!d(r)||!d(s)||Array.isArray(r)!==Array.isArray(s)||Array.isArray(r)&&r.length!==s.length)return!1;i.add(r),i.add(s);const a=r,l=s,u=Object.keys(a),p=Object.keys(l),g=u.length===p.length&&u.every(c=>Object.hasOwn(l,c)&&o(a[c],l[c]));return i.delete(r),i.delete(s),g}return o(e,t)}function Xn(e,t){const n=new Set(t.graph.nodes.map(r=>r.id)),i=Object.create(null);for(const[r,s]of Object.entries(e.positions))n.has(r)&&(i[r]=[...s]);const o=t.graph.nodes.filter(r=>!i[r.id]);if(o.length){const r=la(t),s=Object.values(i);for(const d of o){const a=[...r[d.id]];for(;s.some(l=>Math.abs(l[0]-a[0])<280&&Math.abs(l[1]-a[1])<88);)a[1]+=180;i[d.id]=a,s.push(a)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(r=>n.has(r)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function pa(){return new Promise((e,t)=>{const n=indexedDB.open(ua(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class Is extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Bi;function fa(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Il(e){const t=Bi;if(t===void 0)throw Error("Session has not been loaded");const n=await pa();try{await new Promise((i,o)=>{const r=n.transaction("session","readwrite"),s=r.objectStore("session"),d=s.get("generation"),a=s.get("current"),l=s.get("readonly-legacy");let u,p;l.onsuccess=()=>{try{const g=fa(d.result);if(kl(a.result,e)){p=g;return}if(g!==t)throw new Is;if(p=t+1,!Number.isSafeInteger(p))throw Error("Session generation exhausted");l.result===void 0&&xl(a.result)&&s.put(a.result,"readonly-legacy"),s.put(e,"current"),s.put(p,"generation")}catch(g){u=g,r.abort()}},r.oncomplete=()=>{Bi=p,i()},r.onerror=()=>o(u??r.error??Error("Session save failed")),r.onabort=()=>o(u??r.error??Error("Session save aborted"))})}finally{n.close()}}async function Sl(){Bi=void 0;const e=await pa();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),r=o.get("current"),s=o.get("generation");i.oncomplete=()=>{try{Bi=fa(s.result),t(r.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function xl(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const mr=new WeakMap;function Al(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(u=>u.id===t&&u.type==="business"))throw Error("Unknown Activity: "+t);let i=mr.get(e);i||(i=new Map,mr.set(e,i));const o=i.get(t);if(o)return o;const r=new Set(e.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),s=new Set(e.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),d=e.graph.relations.filter(u=>u.kind==="input"&&u.to===t&&r.has(u.from)||u.kind==="output"&&u.from===t&&r.has(u.to)||u.kind==="business-exception"&&(u.from===t&&s.has(u.to)||u.to===t&&s.has(u.from))),a=new Set([t,...d.flatMap(u=>[u.from,u.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(u=>a.has(u.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)).filter(u=>a.has(u))};return i.set(t,l),l}const hr=new WeakMap;function El(e,t){if(!e.graph.nodes.find(p=>p.id===t&&p.type==="object"))throw Error("Unknown Object: "+t);let i=hr.get(e);i||(i=new Map,hr.set(e,i));const o=t,r=i.get(o);if(r)return r;const s=new Set(e.graph.nodes.filter(p=>p.type==="object").map(p=>p.id)),d=new Set(e.graph.nodes.filter(p=>p.type==="business").map(p=>p.id)),a=e.graph.relations.filter(p=>p.kind==="input"&&p.from===t&&d.has(p.to)||p.kind==="output"&&p.to===t&&d.has(p.from)||p.kind==="object-exception"&&(p.from===t&&s.has(p.to)||p.to===t&&s.has(p.from))),l=new Set([t,...a.flatMap(p=>[p.from,p.to])]),u={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(p=>l.has(p.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(p=>p.type==="business").map(p=>p.id)).filter(p=>l.has(p))};return i.set(o,u),u}const ma=new WeakMap;function tn(e){return ma.get(e)}const ha=["design","checks","source","draft","edited","handle"];function Ol(e){return{key:e.key,name:e.name,...Object.fromEntries(ha.map(t=>[t,e[t]]))}}function Ut(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:a,scroll:l,zoom:u}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:a,scroll:l,zoom:u,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function no(e,t){const n=t;ma.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of ha)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Gi(e){return e.activity}function Hi(e){return e.object}function li(e){return e.activity??e.object}function io(e){return e.object===void 0?Al(e.design,e.activity):El(e.design,e.object)}function oo(e){const t=io(e),n=Xn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function Vt(e,t=[],n,i){const o=n??(e.tabs[0]?Ol(e.tabs[0]):void 0),r=o?(i??[e.tabs[0]?Ut(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(g=>{const c=no(o,g);return Object.assign(g,Ut(oo(c))),c}):[],{dark:s,drawer:d,width:a,preferWrite:l,nodeDrawer:u,sampleLayout:p}=e;return{dark:s,drawer:d,width:a,preferWrite:l,nodeDrawer:u,sampleLayout:p,document:o,tabs:r,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(g=>g.source?.kind==="url").map(g=>({url:g.source.url,name:g.name}))].filter((g,c,h)=>h.findIndex(m=>m.url===g.url)===c),legacyViews:e.legacyViews,active:r.some(g=>g.key===e.active)?e.active:r[0]?.key}}function Ss(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Ut),recovery:n}}function Ci(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function jl(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!Nl(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const u of o.views)Ci(u)}const{format:r,views:s,document:d,recovery:a,...l}=e;for(const u of s)Ci(u);for(const u of a)Ci(u);if(!!d!=!!s.length||new Set(s.map(u=>u.key)).size!==s.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(g=>g.group!==void 0&&typeof g.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(g=>g.group===void 0).length!==1))throw Error("Invalid legacy views");const u=i.views[0],p=u?{...u}:void 0;return p&&delete p.group,Vt({...l,tabs:[],active:p?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},a,d,p?[p]:[])}if(s.length&&(s[0].activity!==void 0||s[0].object!==void 0||s.filter(u=>u.activity===void 0&&u.object===void 0).length!==1)||new Set(s.filter(u=>u.activity!==void 0).map(u=>u.activity)).size!==s.filter(u=>u.activity!==void 0).length||new Set(s.filter(u=>u.object!==void 0).map(u=>u.object)).size!==s.filter(u=>u.object!==void 0).length)throw Error("Invalid workspace views");if(d&&s.some(u=>u.activity!==void 0&&!d.design.graph.nodes.some(p=>p.type==="business"&&p.id===u.activity)))throw Error("Unknown saved Activity");if(d&&s.some(u=>u.object!==void 0&&!d.design.graph.nodes.some(p=>p.type==="object"&&p.id===u.object)))throw Error("Unknown saved Object");return Vt({...l,tabs:[]},a,d,s)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)Ci(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return Vt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Dl(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return Vt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function Cl(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},r=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),s=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||r.has(a.activity))&&(a.object===void 0||s.has(a.object))).map(Ut);return Vt(e,e.recovery,o,d)}function Ml(e,t){const n=e.tabs.find(o=>Gi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=no(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Rl(e,t){const n=e.tabs.find(o=>Hi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=no(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Ll(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(r=>r.key===i.key);return Ut(o?oo(no(e.document,{...Ut(i),...Ut(o)})):i)});return Vt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Nl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function so(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const r=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},s=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?s():r(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),s(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,l=o(),u=l.indexOf(document.activeElement);let p;a.key==="ArrowDown"&&(p=(u+1)%l.length),a.key==="ArrowUp"&&(p=(u+l.length-1)%l.length),a.key==="Home"&&(p=0),a.key==="End"&&(p=l.length-1),p!==void 0&&(a.preventDefault(),l[p]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!i(a)&&r(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&r()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&r()}),window.addEventListener("resize",()=>r()),{close:r}}const Pl=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Tl={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function ql(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),r=v=>o.slice(v.line+1,i.find(D=>D.line>v.line&&D.level<=v.level)?.line??o.length).join(`
`).trim(),s=new Map(i.filter(v=>v.level===3&&t.some(D=>D.title===v.title)).map(v=>[v.title,v])),d=v=>{const D=t.find(k=>k.title===v.title);return D?"legacy-check:"+D.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},a=new Map,l=(v,D)=>{a.has(v)?a.get(v)!==D&&a.set(v,void 0):a.set(v,D)};for(const v of i){const D=d(v);l(Pl(v.title),D);const k=t.find(w=>w.title===v.title);k&&l(k.id.toLowerCase(),D)}for(const[v,D]of o.entries()){const k=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(D);if(k){const w=i.find(A=>A.line>v);w&&l(k[1].toLowerCase(),d(w))}}const u=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const D=[];let k=0;for(const w of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){w.index>k&&D.push({kind:"markdown",value:v.slice(k,w.index)});let A=w[2].slice(1);try{A=decodeURIComponent(A)}catch{}const E=w[2].startsWith("#")?a.get(A.toLowerCase()):void 0;D.push(E?{kind:"reference",targetId:E,label:w[1]}:{kind:"link",uri:w[2],label:w[1]}),k=w.index+w[0].length}return k<v.length&&D.push({kind:"markdown",value:v.slice(k)}),D},p=[],g=[],c=[],h=new Map;for(const v of i.filter(D=>D.level===2)){if(v.title==="業務一覧")continue;const D=d(v),k=i.find(w=>w.line>v.line)?.line??o.length;p.push({id:D,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:u(o.slice(v.line+1,k).join(`
`).trim())}),h.set(v.title,D)}const m="legacy-unassigned",f=v=>{const D=i.filter(k=>k.line<v.line&&k.level===2).at(-1);return D?h.get(D.title):void 0},b=t.map(v=>{const D=s.get(v.title),k=f(D)??m,w=Object.create(null),A=[];let E={name:"補足",value:""},$="";for(const j of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const N=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(j);N&&($?N[1][0]===$[0]&&N[1].length>=$.length&&!N[2].trim()&&($=""):$=N[1]);const Q=$?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(j);Q?(E.value.trim()&&A.push(E),E={name:Q[1],value:Q[2]}):E.value+=`
`+j}E.value.trim()&&A.push(E);let L="";for(const j of A)if(j.name==="人間レビュー状態"){L=j.value.split(`
`)[0].trim();const N=j.value.split(`
`).slice(1).join(`
`).trim();N&&(w.補足=[...w.補足??[],...u(N)])}else{const N=Tl[j.name]??j.name;w[N]=[...w[N]??[],...u(j.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:L,sectionId:k,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(j=>j[1]).join(`
`),fields:w}});b.some(v=>v.sectionId===m)&&p.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const v of i.filter(D=>D.level===3&&!s.has(D.title))){const D=f(v);D?g.push({id:d(v),sectionId:D,title:v.title,blocks:[{kind:"prose",content:u(r(v))}]}):c.push({id:d(v),title:v.title,content:u(r(v))})}const x=i.find(v=>v.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:u(o.slice(/^# /.test(o[0])?1:0,x).join(`
`)),sections:p,items:b,index:Object.entries(n).map(([v,D])=>{const k=o.find(w=>w.startsWith("|")&&w.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:k[1]?.trim()??"",connections:k[2]?.trim()??"",checkIds:D.map(w=>"legacy-check:"+w)}}),guarantees:g,examples:[],notes:c}}function Co(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...r]=n;if(!i||!o)return;r[0]==="refs"&&["heads","tags"].includes(r[1])&&r.splice(0,2);const[s,...d]=r;return!s||!d.length||!["main","master"].includes(s)&&!/^[a-f0-9]{40}$/i.test(s)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:s}}catch{return}}function Jo(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function $l(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((p,g)=>{const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(p);if(c){o?c[1][0]===o[0]&&c[1].length>=o.length&&!c[2].trim()&&(o=""):o=c[1];return}if(!o){t.add(g);const h=/^(#{1,6}) (.+)$/.exec(p);h&&i.push({line:g,level:h[1].length,title:h[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const r=i.filter(p=>p.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(p.title));if(!r.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const s=new Set,d=r.map(p=>{const g=i.find(m=>m.line>p.line&&m.level<=3)?.line??n.length,c=p.title.split(/\s/)[0];if(s.has(c))throw Error("Check IDが重複しています: "+c);s.add(c);const h=n.slice(p.line+1,g).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(h))throw Error(c+" の"+m+"が見つかりません。");return{id:c,title:p.title,body:h,activities:[]}}),a=Object.create(null);let l=!1;for(const[p,g]of n.entries()){if(!t.has(p)||(/^## /.test(g)&&(l=/^## 業務一覧\s*$/.test(g)),!l||!/^\|/.test(g)))continue;const c=g.split("|").slice(1,-1);if(c.length!==4)continue;const h=Jo(c[0])[0]?.label;if(!h)continue;if(Object.hasOwn(a,h))throw Error("業務一覧のActivityが重複しています: "+h);const m=Jo(c[3]);if(m.some(b=>b.url.toLowerCase()!=="#"+b.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+h);const f=m.map(b=>b.label);if(!f.length||f.some(b=>!s.has(b)))throw Error("業務一覧のCheck ID参照を確認できません: "+h);a[h]=[...new Set(f)];for(const b of d)f.includes(b.id)&&b.activities.push(h)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const u=i.find(p=>p.level===2)?.line??r[0].line;return{markdown:e,intro:n.slice(0,u).join(`
`),items:d,index:a,model:ql(e,d,a,i)}}function ui(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function pi(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),i=Object.keys(e.index).filter(l=>!n.has(l)),o=Object.keys(e.index).filter(l=>n.has(l)),r=(l,u)=>({state:l,reason:u,unknown:i});if(!o.length)return r("mismatch","業務一覧に、この業務設計書のActivityがありません。");const s=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=Jo(s).map(l=>Co(l.url)).filter(l=>l!==void 0),a=t.source?.kind==="url"?Co(t.source.url):t.source?.kind==="sample"?Co("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(l=>l.document!==a.document)?r("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?r("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!a||!d.length?r("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?r("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):r("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const br=new WeakMap;function Hn(e){let t=br.get(e);return t||(t=$l(e.markdown),br.set(e,t)),t}const Mo=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Mi(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function Wl(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function zl(e){if(!e.checks)return[];const t=Hn(e.checks),n=pi(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===ui(e)?[t.model]:[]}function Ul(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&Mi(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let r,s=!1;if(e.checks){r=Hn(e.checks);const d=pi(r,e);if(s=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===ui(e),!s&&(Mi(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=Mo("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,o.append(a)}}if(t.candidate){const d=t.candidate,a=Hn(d),l=pi(a,e),u=document.createElement("section");u.className="check-candidate",u.id="check-candidate",Mi(u,"一致未確認: "+d.name+" — "+l.reason),Mi(u,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const p=document.createElement("details"),g=document.createElement("summary");g.textContent="原典参照・業務別インデックス・Check本文を確認",p.append(g,Wl(a.markdown)),u.append(p);const c=Mo("対応を確認して表示する",()=>n.confirm(d));c.id="check-confirm",c.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const h=Mo("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});h.disabled=n.disabled||t.busy===!0,u.append(c,h),o.append(u)}return o.childNodes.length&&i.append(o),i}function Vl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const u of o){const p=document.createElement("span");p.className="document-action-label",p.textContent=u.getAttribute("aria-label"),u.append(p)}let r=!1;const s=(u=!1)=>{r=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),u&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(u=>!u.hidden&&!u.disabled),a=()=>{const u=e.dataset.actionsMode,p=document.activeElement;e.dataset.actionsMode="inline";const c=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,h=n.getBoundingClientRect().width+c,m=o.some(f=>!f.hidden)&&e.clientWidth>0&&h>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||u!==e.dataset.actionsMode)&&(s(),m&&n.contains(p)?i.focus({preventScroll:!0}):!m&&p===i&&d()[0]?.focus({preventScroll:!0}))},l=(u=!1)=>{if(i.hidden)return;r=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const p=d();(u?p.at(-1):p[0])?.focus({preventScroll:!0})};return i.onclick=()=>r?s(!0):l(),i.onkeydown=u=>{(u.key==="ArrowDown"||u.key==="ArrowUp")&&(u.preventDefault(),l(u.key==="ArrowUp"))},n.addEventListener("keydown",u=>{if(!r)return;const p=d(),g=p.indexOf(document.activeElement);let c;u.key==="ArrowDown"&&(c=(g+1)%p.length),u.key==="ArrowUp"&&(c=(g+p.length-1)%p.length),u.key==="Home"&&(c=0),u.key==="End"&&(c=p.length-1),c!==void 0&&(u.preventDefault(),p[c]?.focus())}),document.addEventListener("keydown",u=>{r&&u.key==="Escape"&&(u.preventDefault(),u.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",u=>{r&&!n.contains(u.target)&&!i.contains(u.target)&&s()}),document.addEventListener("focusin",u=>{r&&!n.contains(u.target)&&u.target!==i&&s()}),n.addEventListener("click",u=>{const p=u.target.closest("button");r&&p&&!p.disabled&&s(!0)},!0),s(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:s}}function Fl(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),r=parseFloat(o.columnGap)||0,s=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((l,u)=>l+u.getBoundingClientRect().width,0)+r*n.length+s,a=d+t.getBoundingClientRect().width+r;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(r=>o.observe(r))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const ti="http://www.w3.org/2000/svg",Bl="http://www.w3.org/1999/xhtml",Ri=24,gr=8192,Gl=16e6,Hl=8e6,Jl=4e3,_l=1e6,_o="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Kl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(u=>![u.x,u.y,u.width,u.height].every(Number.isFinite)||u.width<0||u.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const u of e)t=Math.min(t,u.x),n=Math.min(n,u.y),i=Math.max(i,u.x+u.width),o=Math.max(o,u.y+u.height);const r=Math.floor(t)-Ri,s=Math.floor(n)-Ri,d=Math.ceil(i)-r+Ri,a=Math.ceil(o)-s+Ri,l=Math.min(2,gr/d,gr/a,Math.sqrt(Gl/(d*a)));if(l<1)throw Error(_o);return{bounds:{x:r,y:s,width:d,height:a},width:Math.floor(d*l),height:Math.floor(a*l),scale:l}}const Xl="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function yr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,r)=>{const s=i[r],d=getComputedStyle(o);s.removeAttribute("style");for(const a of Xl){const l=d.getPropertyValue(a);l&&!/url\s*\(/i.test(l)&&s.style.setProperty(a,l)}for(const a of Array.from(s.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&s.removeAttribute(a.name)}),t}function Zl(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Jl||(e.textContent?.length??0)+(t.textContent?.length??0)>_l)throw Error(_o);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const f of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+f.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+f.offsetTop,width:f.offsetWidth,height:f.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const r=e.ownerDocument,s=Array.from(t.children).map(yr),d=s.filter(m=>m.matches(".edge,.edge-label"));if(d.length){const m=r.createElementNS(ti,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...d),r.body.append(m);try{for(const f of d){const b=f.getBBox();o.push({x:b.x-12,y:b.y-12,width:b.width+24,height:b.height+24})}}finally{m.remove()}}const a=Kl(o),l=r.createElementNS(ti,"svg");l.setAttribute("width",String(a.width)),l.setAttribute("height",String(a.height)),l.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const u=r.createElementNS(ti,"rect");u.setAttribute("width","100%"),u.setAttribute("height","100%"),u.setAttribute("fill",n),l.append(u);const p=r.createElementNS(ti,"g");p.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const m of s)p.append(m);l.append(p);const g=r.createElementNS(ti,"foreignObject");g.setAttribute("width",String(a.bounds.width)),g.setAttribute("height",String(a.bounds.height));const c=r.createElementNS(Bl,"div");c.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const m of i){const f=yr(m);f.querySelector(".activity-open,.object-open")?.remove(),f.style.left=parseFloat(m.style.left)-a.bounds.x+"px",f.style.top=parseFloat(m.style.top)-a.bounds.y+"px",c.append(f)}g.append(c),l.append(g);const h=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(h).length>Hl)throw Error(_o);return{svg:h,...a}}function Yl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ba(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,r)=>{const s=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",r(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(s),o()},n.onerror=()=>{clearTimeout(s),r(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,r)=>{const s=window.setTimeout(()=>r(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(s),d?o(d):r(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(s),r(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Ql(e,t){const n=await ba(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Yl(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function eu(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ba(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ga(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:tu(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function tu(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,r=2246822507;for(const s of i)o=Math.imul(o^s.codePointAt(0),16777619)>>>0,r=Math.imul(r^s.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+r.toString(16).padStart(8,"0")}function ya(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return P(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function va(e){P(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),mn(e),Fi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=ga(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=ya(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Fi(t),t}const vr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),nu={anyOf:di.anyOf},iu={type:"string",pattern:"^[A-Za-z0-9_-]+$"},ou={type:"string",minLength:1,pattern:"\\S"},su={$schema:"https://json-schema.org/draft/2020-12/schema",...vr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:vr({id:iu,name:ou,package:nu})}}),$defs:di.$defs};function ru(e){try{mn(e,su)}catch(n){if(Array.isArray(e?.plans))for(const i of e.plans)try{mn(i?.package,di)}catch(o){throw Error("Plan "+(i?.id??"<missing>")+" (formatVersion "+String(i?.package?.formatVersion)+"): "+o.message,{cause:o})}throw n}P(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){P(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),P(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Fi(n.package),["0.1","0.2","0.3"].includes(n.package.formatVersion)&&va(n.package)}catch(i){throw Error("Plan "+n.id+" (formatVersion "+n.package.formatVersion+"): "+i.message,{cause:i})}}return{valid:!0,plans:e.plans.map(({id:n,name:i})=>({id:n,name:i}))}}const be=(e,t)=>{if(!e)throw new Error(t)},ii=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Ro=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Li=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),wa=e=>ii(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function au(e){be(Ro(e),"Graph must be an object");const t=e;be(Li(t,["version","nodes","relations"])||Li(t,["version","nodes","relations","scope"]),"Invalid graph fields"),be(t.version===1,"Unsupported graph version"),"scope"in t&&be(ii(t.scope),"Invalid scope"),be(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),be(Array.isArray(t.relations),"Relations required");const n=new Map;for(const r of t.nodes){be(Ro(r),"Node must be an object");const s=r;be(s.type==="business"||s.type==="object","Invalid node type");const d=s.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];s.type==="business"&&("problem"in s||"pain_level"in s)&&(d.push("problem","pain_level"),be(["Low","Medium","High"].includes(String(s.pain_level)),"Invalid Pain level")),be(Li(s,d),"Invalid node fields"),be(Object.entries(s).every(([l,u])=>l==="scope"||l==="information"||ii(u)),"Empty node text"),be(typeof s.scope=="boolean","Invalid node scope"),be(wa(s.name)&&s.id===s.name,"Node ID must equal visible name"),be(!n.has(s.id),"Duplicate node ID"),s.type==="object"&&(be(typeof s.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.icon),"Invalid Lucide icon"),be(Array.isArray(s.information)&&s.information.every(ii),"Invalid information")),n.set(s.id,s.type)}be([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const r of t.relations){be(Ro(r),"Relation must be an object");const s=r;be(Li(s,["kind","from","to","label"])&&Object.values(s).every(ii),"Invalid relation fields");const d=i[s.kind];be(Array.isArray(d)&&n.has(s.from)&&n.has(s.to)&&n.get(s.from)===d[0]&&n.get(s.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([s.kind,s.from,s.to,s.label]);be(!o.has(a),"Duplicate relation"),o.add(a)}}function hn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function si(e){const t=[];let n="";return hn(e).forEach((i,o)=>{const r=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(r){n?r[1][0]===n[0]&&r[1].length>=n.length&&!r[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=r[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),be(!n,"Unclosed code fence"),t}function Ko(e,t,n,i=[]){const o=hn(e),r=si(e),s=Object.create(null);return be(r.length&&!o.slice(0,r[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),r.forEach(([d,a],l)=>{be(t.includes(a)&&!(a in s),n+": unsupported/duplicate "+a),s[a]=o.slice(d+1,r[l+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),be(s[a]||i.includes(a),n+": empty "+a)}),be(r.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),s}const wr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function cu(e){const t=hn(e),n=si(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return be(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,r],s)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(r);be(d,"Invalid Finding ID");const a=d[1];be(!i.has(a),"Duplicate Finding ID"),i.add(a);const l=Ko(t.slice(o+1,n[s+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);be(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),be(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),be(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const u=l["### Targets"]==="(none)"?[]:hn(l["### Targets"]).filter(p=>p.trim()).map(p=>(be(p.startsWith("- ")&&wa(p.slice(2)),"Invalid Finding target"),p.slice(2)));return be(new Set(u).size===u.length,"Duplicate Finding target"),be(l["### Scope"]==="items"?u.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:u,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function du(e,t){be(!e.includes("<!--"),"HTML comments are unsupported");const n=hn(e),i=si(e).filter(g=>g[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;be(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let r=[];const s={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;i.slice(1).forEach(([g,c],h)=>{const m=i[h+2]?.[0]??n.length,f=n.slice(g+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(be(f,"Empty section "+c),c==="# Findings"){be(!a.has(c),"Duplicate Findings"),a.add(c),r=cu(f);return}if(["# Scope","# Graph exceptions"].includes(c)){be(!a.has(c),"Duplicate "+c),a.add(c),c==="# Scope"?(be(!si(f).length,"Scope must be prose"),s.scope=f):hn(f).filter(E=>E.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(E=>{const $=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(E);be($,"Invalid exception"),s.relations.push({kind:$[1],from:$[2],to:$[3],label:$[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const b=o.exec(c);be(b,"Unsupported heading "+c);const x=b[1],v=b[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[v]=n.slice(g,m).join(`
`);const D=E=>si(f).some($=>$[1]===E);if(x==="Object"){const E=["## Scope","## Icon"];D("## Information")&&E.push("## Information");const $=Ko(f,E,v);be(["true","false"].includes($["## Scope"]),"Invalid Scope");const L=hn($["## Information"]??"").filter(j=>j.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(j=>(be(/^- \S.*$/.test(j),"Invalid Information"),j.slice(2)));s.nodes.push({id:v,type:"object",name:v,scope:$["## Scope"]==="true",icon:$["## Icon"]==="(generic icon)"?"box":$["## Icon"],information:L});return}const k=["## Scope","## Why","## When"];D("## Exception When")&&k.push("## Exception When"),k.push("## Who","## Where","## How","### Input","### Procedure"),D("### Exception")&&k.push("### Exception"),k.push("### Output","## Result"),(D("## Problem")||D("## Pain level"))&&k.push("## Problem","## Pain level");const w=Ko(f,k,v,["## How"]);be(!w["## How"],"How must only contain fields"),be(["true","false"].includes(w["## Scope"]),"Invalid Scope"),t?.activity?.(v,w);const A={id:v,type:"business",name:v,scope:w["## Scope"]==="true",why:w["## Why"],when:w["## When"],who:w["## Who"],where:w["## Where"],result:w["## Result"]};"## Problem"in w&&(A.problem=w["## Problem"],A.pain_level=w["## Pain level"]),s.nodes.push(A);for(const[E,$]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(E in w)||$!=="business-exception"&&w[E]==="(none)"||hn(w[E]).filter(L=>L.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(L=>{const j=/^- (.+?) — (\S.*)$/.exec(L);be(j,"Invalid relation in "+v),s.relations.push({kind:$,from:$==="output"?v:j[1],to:$==="output"?j[1]:v,label:j[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=s.nodes.filter(g=>g.type==="business").map(g=>g.id);au(s),s.nodes.sort((g,c)=>wr(g.id,c.id)),s.relations.sort((g,c)=>{for(const h of["kind","from","to","label"]){const m=wr(g[h],c[h]);if(m)return m}return 0});const u=new Set(s.nodes.map(g=>g.id));for(const g of r)g.unresolvedTargets=g.targets.filter(c=>!u.has(c));return{graph:s,sections:d,markdown:e,activityOrder:l,findings:r}}const lu=["id","from","activity","condition","to","effect","path","evidence","note"],_e=(e,t)=>{if(!e)throw Error(t)},Ni=e=>typeof e=="string"&&!!e.trim();function uu(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());_e(n,"state-meta と遷移表が必要です");const i=oa(n[1]);_e(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),_e(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),_e(i.object===t,"対象Objectが一致しません"),_e(Array.isArray(i.states)&&i.states.length>0&&i.states.every(l=>Ni(l)&&!l.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),_e(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&Ni(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),r=l=>(_e(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(u=>u.trim())),s=r(o[0]);_e([lu,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>s.join("|")===l.join("|")),"表の列名が不正です"),_e(r(o[1]).length===s.length&&r(o[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),_e(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=o.slice(2).map(l=>{const u=r(l);_e(u.length===s.length&&u.every(Ni),"表の列数・空欄が不正です");const p=Object.fromEntries(s.map((g,c)=>[g,u[c]]));return _e(/^T[0-9]+$/.test(p.id)&&!d.has(p.id),"遷移IDが不正または重複しています"),d.add(p.id),_e([...i.states,"@new"].includes(p.from)&&[...i.states,"@unknown","@none"].includes(p.to),"未登録の状態が参照されています"),_e(["change","unchanged","no-create","constraint"].includes(p.effect)&&["normal","exception"].includes(p.path),"効果・経路の指定が不正です"),s.includes("exception")&&_e(p.path==="normal"?p.exception==="-":Ni(p.exception)&&p.exception!=="-","通常は例外名なし、例外は名前が必要です"),_e(p.effect!=="unchanged"||p.from===p.to,"状態不変の元と先が一致しません"),_e(p.effect!=="change"||!p.to.startsWith("@")&&p.from!==p.to,"状態変更の遷移先が不正です"),_e(p.effect!=="no-create"||p.from==="@new"&&p.to==="@none","不成立の元と先が不正です"),_e(p.effect!=="constraint"||p.to==="@unknown","未決の制約は遷移先未決としてください"),p});return{model:{...i,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const kr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function pu(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let r="";for(let s=0;s<i.length;s++){const d=i[s];if(!r&&/^# Object /.test(d)?n=d.slice(9):!r&&/^# /.test(d)&&(n=null),!r&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let l="";for(s++;s<i.length;s++){const p=i[s];if(!l&&/^#{1,2} /.test(p)){s--;break}a.push(p),l=kr(p,l)}const u=uu(a.join(`
`),n);if(u.error)throw Error(u.error);t.push(u.model);continue}o.push(d),r=kr(d,r)}if(new Set(t.map(s=>s.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function fu(e){const t=/^## State Transitions$/m.test(e)?pu(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,r=du(t.markdown,{activity:(a,l)=>o.set(a,l),document:(a,l)=>{n=a,i=l}}),s={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:r.graph.scope??"",objects:r.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(r.activityOrder??[]).map(a=>{const l=r.graph.nodes.find(p=>p.id===a),u=o.get(a);return{id:a,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:u["### Procedure"],exception:u["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:r.graph.relations.map((a,l)=>({id:"legacy-relation-"+l,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(r.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(l=>r.graph.nodes.some(u=>u.id===l))}))};s.exceptions=ga(s);const d=t.declarations.map((a,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:s.id,revision:s.revision,verification:"unverified"},objectId:a.object,states:a.states.map(u=>({id:u,name:u})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(u=>({id:u.id,sourceId:u.id,fromId:u.from,toId:u.to,activityId:u.activity,exceptionId:ya(s,u.activity,u.exception),event:u.event??null,condition:u.condition,effect:u.effect,path:u.path,evidence:u.evidence,note:u.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:s,checks:[],states:d,diagnostics:[]}}}const Nt={type:"string"},le={type:"string",minLength:1,pattern:"\\S"},fe={type:"string",pattern:"^[A-Za-z0-9_-]+$"},At=e=>({anyOf:[e,{type:"null"}]}),we=e=>({type:"array",items:e}),he=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),mu=e=>({$ref:"#/$defs/"+e}),zn=we({anyOf:[he({kind:{enum:["text"]},value:Nt}),he({kind:{enum:["reference"]},targetId:fe,label:Nt}),he({kind:{enum:["link"]},uri:le,label:Nt})]}),Xo=he({id:fe,name:le,scope:{type:"boolean"}}).properties,ka=he({id:fe,kind:{enum:["input","output","business-exception","object-exception"]},fromId:fe,toId:fe,label:le}),hu=he({id:fe,sourceId:fe,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:we(fe),unresolvedTargets:we(le),summary:le,content:le}),Zo=he({id:fe,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:le,title:le,preface:Nt,scope:Nt,objects:we(he({...Xo,icon:le,information:we(le)})),activities:we(he({...Xo,why:le,when:le,who:le,where:le,procedure:le,exception:At(le),result:le,problem:At(le),painLevel:At({enum:["Low","Medium","High"]})})),relations:we(ka),findings:we(hu)}),bu=he({id:fe,name:le,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Ia=he({...Zo.properties,schemaVersion:{enum:["0.2"]},roles:we(bu),activities:we(he({...Zo.properties.activities.items.properties,roleId:At(fe)}))}),xs=he({...Ia.properties,schemaVersion:{enum:["0.3"]},exceptions:we(he({id:fe,activityId:fe,name:le,description:Nt}))}),Un=e=>({...we(e),minItems:1}),gu=he({id:fe,name:le,description:Nt}),yu=he({objectId:fe,roleIds:we(fe)}),vu=he({id:fe,text:le,obligation:{enum:["required","optional"]},appliesWhen:At(le),performerObjectIds:At(Un(fe))}),wu={anyOf:[he({kind:{enum:["before"]},beforeId:fe,afterId:fe}),he({kind:{enum:["interchangeable"]},stepIds:{...we(fe),minItems:2}})]},ku=Object.fromEntries(Object.entries(xs.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),Iu=he({...xs.properties,schemaVersion:{enum:["0.4"]},objects:we(he({...Xo,icon:le,information:we(gu)})),activities:Un(he({...ku,performers:At(Un(yu)),procedure:he({steps:Un(vu),orderRules:we(wu)}),results:Un(he({id:fe,text:le}))})),data:we(he({id:fe,name:le,items:Un(he({informationId:fe,condition:At(le)}))})),relations:we({anyOf:[he({id:fe,kind:{enum:["input","output"]},fromId:fe,toId:fe,dataId:fe}),he({...ka.properties,kind:{enum:["business-exception","object-exception"]}})]})}),Su=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,zn])),xu=he({id:fe,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:le,title:le,basedOn:he({documentId:fe,revision:le,verification:{enum:["unverified"]}}),intro:zn,index:we(he({activityId:fe,purpose:Nt,connections:Nt,checkIds:we(fe)})),sections:we(he({id:fe,activityId:At(fe),title:le,preamble:zn})),guarantees:we(he({id:fe,sectionId:fe,title:le,blocks:we({anyOf:[he({kind:{enum:["prose"]},content:zn}),he({kind:{enum:["example"]},exampleId:fe})]})})),examples:we(he({id:fe,guaranteeId:fe,columns:we(le),rows:we(we(zn))})),items:we(he({id:fe,checkId:fe,title:le,detailSummary:Nt,sectionId:fe,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:he(Su,[])})),notes:we(he({id:fe,title:le,content:zn}))}),As=he({id:fe,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:le,title:le,basedOn:he({documentId:fe,revision:le,verification:{enum:["unverified"]}}),objectId:fe,states:we(he({id:fe,name:le})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:le,transitions:we(he({id:fe,sourceId:le,fromId:le,activityId:fe,event:At(le),exception:At(le),condition:le,toId:le,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:le,note:le}))}),Ir=Object.fromEntries(Object.entries({...As.properties.transitions.items.properties,exceptionId:At(fe)}).filter(([e])=>e!=="exception")),Au=he({...As.properties,schemaVersion:{enum:["0.2"]},transitions:we(he({...Ir,conditionLabel:le},Object.keys(Ir)))}),ni=(e,t)=>he({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:le,documents:we({anyOf:t.map(mu)}),sources:we(he({documentId:fe,revision:le,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Nt})),externalDocuments:we(he({id:fe,kind:{enum:["businessDesign"]},revision:le,activities:we(he({id:fe,name:le}))})),diagnostics:we(le)}),Sr={anyOf:[ni("0.1",["businessDesign","checkItems"]),ni("0.2",["businessDesign","checkItems","stateTransition"]),ni("0.3",["businessDesignRoles","checkItems","stateTransition"]),ni("0.4",["businessDesignStructured","checkItems","stateTransitionStructured"]),ni("0.5",["businessDesignD2","checkItems","stateTransitionStructured"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Zo,businessDesignRoles:Ia,businessDesignStructured:xs,businessDesignD2:Iu,checkItems:xu,stateTransition:As,stateTransitionStructured:Au}},qn=(e,t)=>ie(new Set(e).size===e.length,t);function Eu(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&ie(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};qn(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){ie(o.name===o.name.trim(),"Data name whitespace"),qn(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities){if(o.performers!==null){qn(o.performers.map(g=>g.objectId),"Duplicate performer");for(const g of o.performers){i(g.objectId,"object"),qn(g.roleIds,"Duplicate performer Role");for(const c of g.roleIds)i(c,"role")}}let r=o.performers===null;for(const g of o.procedure.steps)if(g.performerObjectIds!==null){qn(g.performerObjectIds,"Duplicate Step performer");for(const c of g.performerObjectIds)ie(o.performers?.some(h=>h.objectId===c),"Step performer outside Activity assignment: "+c)}else o.performers?.length!==1&&(r=!0);r&&ie(e.findings.some(g=>g.status==="open"&&g.scope==="items"&&g.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id);const s=o.procedure.steps.map(g=>g.id),d=new Map(s.map(g=>[g,[]])),a=new Set,l=[];for(const g of o.procedure.orderRules)if(g.kind==="before"){i(g.beforeId,"step",o.id),i(g.afterId,"step",o.id),ie(g.beforeId!==g.afterId,"Self Step order");const c=JSON.stringify([g.beforeId,g.afterId]);ie(!a.has(c),"Duplicate Step order"),a.add(c),d.get(g.beforeId).push(g.afterId),ie(s.indexOf(g.beforeId)<s.indexOf(g.afterId),"Standard Step order contradicts before constraint")}else{qn(g.stepIds,"Duplicate interchangeable Step");for(const c of g.stepIds)i(c,"step",o.id);l.push(g.stepIds)}const u=(g,c)=>{const h=[g],m=new Set;for(;h.length;){const f=h.pop();if(!m.has(f)){m.add(f);for(const b of d.get(f)){if(b===c)return!0;h.push(b)}}}return!1};for(const g of s)ie(!u(g,g),"Step order cycle");const p=new Set;for(const g of l){const c=JSON.stringify([...g].sort());ie(!p.has(c),"Duplicate interchangeable group"),p.add(c);for(const h of g)for(const m of g)h!==m&&ie(!u(h,m),"Interchangeable Steps conflict with before constraint")}}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}const ie=(e,t)=>{if(!e)throw Error(t)};function oi(e,t=Sr,n="$"){if(t.$ref)return oi(e,Sr.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{oi(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&ie(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;ie(i===t.type,"Invalid type at "+n)}if(t.minLength&&ie(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&ie(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])ie(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))ie(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),oi(e[i],t.properties[i],n+"."+i)}t.type==="array"&&(t.minItems!==void 0&&ie(e.length>=t.minItems,"Too few items at "+n),e.forEach((i,o)=>oi(i,t.items,n+"["+o+"]")))}function Ou(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,a,l=d.id)=>{ie(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,a),o.set(s.id,l)};for(const s of e.documents){r(s,s,"document");for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of s[d]??[])r(l,s,a)}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}for(const s of e.documents.filter(d=>d.kind==="businessDesign"&&d.schemaVersion==="0.4")){for(const d of s.objects)for(const a of d.information)r(a,s,"information",d.id);for(const d of s.activities){for(const a of d.procedure.steps)r(a,s,"step",d.id);for(const a of d.results)r(a,s,"result",d.id)}for(const d of s.data)r(d,s,"data")}return{map:t,owner:n,types:i,parent:o}}function ju(e){return oi(e),Sa(e)}function Sa(e,{allowUnresolvedFindings:t=!1}={}){ie(e.documents.length>0,"Document required");const n=Ou(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const c of e.sources)if(c.uri){const h=new URL(c.uri);ie(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const a=(c,h,m)=>(ie(i.has(c),"Dangling reference: "+c),h&&ie(r.get(c)===h,"Reference type mismatch: "+c),m&&ie(o.get(c)===m,"Cross-document mismatch: "+c),i.get(c)),l=c=>c?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),u=(c,h)=>{for(const m of c)if(m.kind==="reference"&&(a(m.targetId,null,h),ie(["document","section","guarantee","example","check","note"].includes(r.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const f=new URL(m.uri);ie(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}};for(const c of e.documents)if(ie(e.formatVersion!=="0.1"||c.kind!=="stateTransition","State documents require formatVersion 0.2"),c.kind==="businessDesign"){ie(c.activities.length>0,"Activity required");const h=[...c.objects,...c.activities].map(b=>b.name);ie(new Set(h).size===h.length,"Duplicate visible name"),ie(h.every(b=>b===b.trim()&&!(["0.4","0.5"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>b.includes(x))),"Invalid Graph-visible name");for(const b of c.objects)ie(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3","0.4"].includes(c.schemaVersion)&&(ie(new Set(c.roles.map(b=>b.name)).size===c.roles.length,"Duplicate Role name"),ie(c.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name"),c.schemaVersion!=="0.4"))for(const b of c.activities)b.roleId!==null?a(b.roleId,"role",c.id):d.add("Role未確定: "+b.id+" — "+b.who);for(const b of c.activities)ie(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of c.exceptions??[])a(b.activityId,"activity",c.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;c.schemaVersion==="0.4"&&Eu(c,n,a);for(const b of c.relations){a(b.fromId,m[b.kind][0],c.id),a(b.toId,m[b.kind][1],c.id);const x=JSON.stringify([b.kind,b.fromId,b.toId,b.dataId??b.label]);ie(!f.has(x),"Duplicate relation"),f.add(x)}ie(new Set(c.findings.map(b=>b.sourceId)).size===c.findings.length,"Duplicate Finding source ID");for(const b of c.findings){ie(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),ie(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const x of b.targetIds)a(x,null,c.id),ie(["object","activity"].includes(r.get(x)),"Invalid Finding target");b.unresolvedTargets.length&&(ie(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(c.kind==="stateTransition"){const h=a(c.basedOn.documentId,"document");ie(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),ie(h.revision===c.basedOn.revision,"Stale State source revision"),a(c.objectId,"object",h.id),ie(!e.documents.some(f=>f!==c&&f.kind==="stateTransition"&&f.objectId===c.objectId),"Duplicate Object state declaration"),ie(c.states.length>0&&new Set(c.states.map(f=>f.name)).size===c.states.length,"Duplicate/empty state names"),ie(c.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),ie(c.transitions.length<=1e3,"State transition row budget"),ie(new Set(c.transitions.map(f=>f.sourceId)).size===c.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of c.transitions){f.fromId!=="@new"&&a(f.fromId,"state",c.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",c.id);const b=a(f.activityId,"activity",h.id);if(e.formatVersion!=="0.5"){const x=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);ie(!m.has(x),"Duplicate state transition condition: "+m.get(x)+" / "+f.sourceId),m.set(x,f.sourceId)}if(["0.4","0.5"].includes(e.formatVersion))if(ie(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const x=a(f.exceptionId,"exception",h.id);ie(x.activityId===b.id,"Exception Activity mismatch")}else f.path==="exception"&&ie(s.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else ie(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);ie(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),ie(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),ie(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),ie(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+c.id)}else{const h=a(c.basedOn.documentId,"document");ie(h.kind==="businessDesign","Check source is not BD"),ie(h.revision===c.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+c.id),ie(new Set(c.items.map(f=>f.checkId)).size===c.items.length,"Duplicate Check ID");const m=new Set;for(const f of c.index){a(f.activityId,"activity",h.id),ie(!m.has(f.activityId),"Duplicate Activity index"),m.add(f.activityId),ie(new Set(f.checkIds).size===f.checkIds.length,"Duplicate Check binding");for(const b of f.checkIds)a(b,"check",c.id)}ie(new Set(c.sections.map(f=>f.activityId??f.title)).size===c.sections.length,"Duplicate Activity section");for(const f of c.sections)f.activityId!==null&&(a(f.activityId,"activity",h.id),ie(m.has(f.activityId),"Section missing from index")),u(f.preamble,c.id);for(const f of c.guarantees){ie(f.blocks.some(b=>b.kind==="prose"&&l(b.content)),"General guarantee prose required"),a(f.sectionId,"section",c.id);for(const b of f.blocks)if(b.kind==="prose")u(b.content,c.id);else{const x=a(b.exampleId,"example",c.id);ie(x.guaranteeId===f.id,"Example owner mismatch")}}for(const f of c.examples){a(f.guaranteeId,"guarantee",c.id),ie(f.columns.length>0,"Example columns required");for(const b of f.rows){ie(b.length===f.columns.length,"Example column mismatch");for(const x of b)u(x,c.id)}}for(const f of c.items){const b=a(f.sectionId,"section",c.id);ie(b.activityId===null?!c.index.some(x=>x.checkIds.includes(f.id)):c.index.some(x=>x.activityId===b.activityId&&x.checkIds.includes(f.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),ie(l(f.fields.guarantee)||l(f.fields.condition)&&l(f.fields.expectedResult),"Check guarantee required");for(const x of Object.values(f.fields))u(x,c.id);ie(b.activityId===null||c.index.some(x=>x.checkIds.includes(f.id)),"Unbound Check")}for(const f of c.notes)u(f.content,c.id);u(c.intro,c.id)}const p=e.diagnostics.filter(c=>c.startsWith("Role未確定:"));ie(new Set(p).size===p.length,"Duplicate unresolved Role diagnostic");for(const c of p)ie(d.delete(c),"Unresolved Who requires a diagnostic matching a current unresolved Activity");ie(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const c of e.sources){a(c.documentId,"document");const h=c.documentId+"@"+c.revision;ie(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const c of e.externalDocuments)ie(e.sources.some(h=>h.documentId===c.id&&h.revision===c.revision),"External source revision missing"),ie(c.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+c.id);return{diagnostics:s,entities:i.size}}function Du({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=(e.formatVersion==="0.5"?Sa:sa)({formatVersion:["0.5","0.6","0.7"].includes(e.formatVersion)?e.formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const r=e.business,s=[...r.objects,...r.activities],d=[...r.objects.map(p=>({...p,information:p.information.map(g=>typeof g=="string"?g:g.name),type:"object"})),...r.activities.map(p=>({id:p.id,type:"business",name:p.name,scope:p.scope,why:p.why,when:p.when,who:En(r,p),where:p.where,result:"results"in p?p.results.map(g=>g.text).join(`
`):p.result,...p.problem===null?{}:{problem:p.problem,pain_level:p.painLevel}}))],a=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(p=>p.basedOn.documentId===r.id).map(p=>{const g=new Map(p.states.map(h=>[h.id,h.name])),c={object:s.find(h=>h.id===p.objectId).name,states:p.states.map(h=>h.name),start:p.start,terminal:p.terminal,completeness:p.completeness,source:p.source,transitions:p.transitions.map(h=>({id:h.sourceId,from:g.get(h.fromId)??h.fromId,to:g.get(h.toId)??h.toId,activity:h.activityId,...h.event?{event:h.event}:{},...h.exceptionId?{exceptionId:h.exceptionId,exception:r.exceptions?.find(m=>m.id===h.exceptionId)?.name}:{},condition:h.condition,...h.conditionLabel?{conditionLabel:h.conditionLabel}:{},effect:h.effect,path:h.path,evidence:h.evidence,note:h.note}))};return[p.objectId,{model:c}]}))),l=r.relations.map(p=>({kind:p.kind,from:p.fromId,to:p.toId,label:Jr(r,p)})),u=["0.6","0.7"].includes(e.formatVersion)?(()=>{const g=Xd(r).edges.map(c=>({kind:c.direction,from:c.direction==="input"?c.objectId:c.activityId,to:c.direction==="input"?c.activityId:c.objectId,label:c.label||(c.transferUndecided?"未決":"")}));for(const c of l)g.some(h=>h.kind===c.kind&&h.from===c.from&&h.to===c.to)||g.push(c);return g})():l;return{graph:ca({version:1,...r.scope?{scope:r.scope}:{},nodes:d,relations:u}),sections:Object.fromEntries(d.map(p=>[p.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:r.activities.map(p=>p.id),objectStateTransitions:a,findings:[...r.findings.map(p=>({...p,displayId:p.sourceId,targets:[...p.targetIds,...p.unresolvedTargets],targetNames:[...p.targetIds,...p.unresolvedTargets].map(g=>s.find(c=>c.id===g)?.name??g)})),...od(r)]}}const xa=8*1024*1024;function Aa(e){return/^\s*[\[{]/.test(e)}function Yo(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function xr(e,t){if(!e||!["0.4","0.5","0.6","0.7"].includes(e.formatVersion))throw Error("JSON専用経路はformatVersion 0.4、旧候補0.5または候補0.6・0.7が必要です（旧形式は互換入力adapter）。");Yo(e);const n=e.formatVersion==="0.5"?ju(e):Fi(e),i=e.documents.filter(r=>r.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(r=>r.kind==="checkItems"),states:e.documents.filter(r=>r.kind==="stateTransition"),concepts:e.documents.filter(r=>r.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Cu(e,t){if(!Aa(e)){if(t!==void 0)throw Error("案を含まない文書です。");return fu(e)}if(new TextEncoder().encode(e).byteLength>xa)throw Error("ローカルJSONは8MiB以内にしてください。");let n=oa(e.replace(/^\uFEFF/,""));Yo(n);let i;if(n?.format==="alder-named-plans"){ru(n);for(const s of n.plans)if(Yo(s.package),s.package.documents.filter(d=>d.kind==="businessDesign").length!==1)throw Error("業務案 "+s.id+" にはBusiness Designが1件必要です。");const o=t??n.plans[0].id,r=n.plans.find(s=>s.id===o);if(!r)throw Error("指定した業務案がありません: "+o);i={selected:o,choices:n.plans.map(({id:s,name:d})=>({id:s,name:d}))},n=r.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const o=xr(va(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const r=o.data.business;r.schemaVersion="0.1",delete r.roles;for(const s of r.activities)"roleId"in s&&delete s.roleId;o.data.diagnostics=o.data.diagnostics.filter(s=>!s.startsWith("Role未確定:"))}return{...o,...i?{namedPlans:i}:{}}}return{...xr(n,e),...i?{namedPlans:i}:{}}}function sn(e,t){return Du(Cu(e,t))}async function Mu(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>xa)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Aa(n))throw Error("JSONファイルの本文を確認してください。");return sn(n)}const Ru=(e,t)=>Es(e,t,!1);async function Es(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,r=()=>o.abort();t?.addEventListener("abort",r,{once:!0}),t?.aborted&&r();const s=setTimeout(r,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const u=d.body?.getReader();if(!u)throw Error("本文を読み取れません。");let p=0,g="";const c=new TextDecoder;try{for(;;){const{done:h,value:m}=await u.read();if(h)break;if(p+=m.length,p>l){try{u.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}g+=c.decode(m,{stream:!0})}g+=c.decode()}finally{u.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(g))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(g))throw Error("HTMLページは読み込めません。");return g}catch(d){const a=o.signal.aborted;throw r(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(s),t?.removeEventListener("abort",r)}}const Ji=Mu;async function ro(e,t){return sn(await Es(e,t))}function Lu(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return sn(e)}const ao=e=>e==="question"?"要確認":"要修正";function Nu(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(r=>r.status==="open"&&r.kind===i&&r.targets.includes(t.id)).length;o&&n.push(`${ao(i)} ${o}`)}return n}function Pu(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ao(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const r=document.createElement("p");r.className="finding-reference-warning",r.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(r)}return t.append(et(e.content)),t}function Tu(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function qu(e,t,n,i=!1){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const r of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t)&&(!i||!s.id.startsWith("viewer:")))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=r.id,s.textContent=`${ao(r.kind)} · ${r.displayId??r.id}　${r.summary}`,s.onclick=()=>n({type:"finding",id:r.id}),o.append(s)}return o}function $u(e,t,n,i,o){const r=document.createElement("section");r.className="findings-index";const s=document.createElement("label");s.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),s.append(d,document.createTextNode("解消済みも表示")),r.append(s);const a=(u,p,g)=>{const c=document.createElement("button");c.className="node-navigate finding-index-row",c.dataset.findingKey=u.type+":"+u.id;const h=document.createElement("strong");h.textContent=p;const m=document.createElement("span");return m.textContent=g,c.append(h,m),c.onclick=()=>i(u),c},l=e.graph.nodes.filter(u=>(!o||u.id===o)&&typeof u.problem=="string");if(l.length){const u=document.createElement("h3");u.textContent="困りごと",r.append(u);for(const p of l)r.append(a({type:"problem",id:p.id},`${p.name}（${String(p.pain_level)}）`,String(p.problem)))}for(const[u,p]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const g=(e.findings??[]).filter(h=>(!o||h.targets.includes(o))&&(t||h.status==="open")&&(u==="broken"?h.unresolvedTargets.length>0:h.scope===u&&!h.unresolvedTargets.length));if(!g.length)continue;const c=document.createElement("h3");c.textContent=`${p}（${g.length}件）`,r.append(c);for(const h of g)r.append(a({type:"finding",id:h.id},`${ao(h.kind)} · ${h.displayId??h.id}${h.status==="resolved"?" · 解消済み":""}`,h.summary))}if(r.childElementCount===1){const u=document.createElement("p");u.textContent="表示する指摘はありません。",r.append(u)}return r}function Wu(e){const t=la(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((r,s)=>r===o[s]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...hc(),viewInset:[40,0],canvasOrigin:void 0}}function zu(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,r)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(r)}),n}function Os(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Uu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Os(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Vu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Os(t)),n.href}function Fu(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Os(t)}const js=`# Alderを使った設計業務 — Business Design

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
`;function Gu(e,t){const n=new Set(t.graph.nodes.map(g=>g.id)),i=new Map;for(const g of t.graph.nodes)i.set(g.name,i.has(g.name)?void 0:g.id);const o=g=>n.has(g)?g:i.get(g),r=Object.create(null);for(const[g,c]of Object.entries(e.positions)){const h=o(g);h&&(r[h]=c)}const{scroll:s,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:u,selectedEdgesOnly:p}=e;return{positions:r,scroll:s,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:u,selectedEdgesOnly:p,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(g=>{const c=o(g);return c?[c]:[]}))]}}}const Hu=`# Alderのチェックリストサンプル

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
`;function Ju(e,t,n,i,o=()=>!0,r=()=>{}){const s=e.ownerDocument,d=s.defaultView;let a,l=0,u=0,p=!1,g=null,c="";const h=new Map,m=()=>{a!==void 0&&(d.clearTimeout(a),l=Math.max(0,l-(Date.now()-u)),a=void 0)},f=(v=!1)=>{if(v&&!o())return;m(),h.delete(c);const D=[...h].at(-1);if(D){x(D[1],"error",D[0]);return}const k=e.contains(s.activeElement);e.hidden=!0,t.textContent="",r(),k&&(g?.isConnected?g:i).focus({preventScroll:!0})},b=()=>{e.hidden||e.dataset.kind==="error"||p||s.hidden||e.contains(s.activeElement)||(m(),u=Date.now(),a=d.setTimeout(f,l))};e.addEventListener("pointerenter",()=>{p=!0,m()}),e.addEventListener("pointerleave",()=>{p=!1,b()}),e.addEventListener("focusin",v=>{const D=v.relatedTarget;D&&!e.contains(D)&&(g=D),m()}),e.addEventListener("focusout",()=>d.setTimeout(b,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),f(!0))}),s.addEventListener("visibilitychange",()=>s.hidden?m():b()),n.onclick=()=>f(!0);const x=(v,D,k)=>{m(),e.contains(s.activeElement)||(g=s.activeElement),c=k,e.dataset.kind=D,e.dataset.key=k,t.setAttribute("role",D==="error"?"alert":"status"),t.setAttribute("aria-live",D==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,r(),l=D==="warning"?8e3:5e3,b()};return(v,D="success",k="operation")=>{D==="error"&&v?(h.delete(k),h.set(k,v)):h.delete(k);const w=[...h].at(-1);if(w){if(!e.hidden&&t.textContent===w[1]&&c===w[0])return;x(w[1],"error",w[0]);return}if(!v){c===k&&f();return}!e.hidden&&t.textContent===v&&e.dataset.kind===D||x(v,D,k)}}const Ar=Bu,Et=document.querySelector("#app");Et.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const S=e=>document.getElementById(e),Vn=ua(location.pathname);Vn.version&&(S("preview-badge").hidden=!1,S("preview-badge").textContent=`確認用 · ${Vn.version}`,S("preview-badge").title=`PR #${Vn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const fi=e=>Kn(e,{"stroke-width":1.8,"aria-hidden":"true"}),vi=document.createElement("div");vi.id="source-menu";vi.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';Et.append(vi);const co=document.createElement("div");co.id="checks-menu";co.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';Et.append(co);const Cn=document.createElement("section");Cn.id="check-followup";Cn.hidden=!0;Cn.setAttribute("aria-labelledby","check-followup-title");Cn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(Cn);const lo=document.createElement("div");lo.id="check-followup-menu";lo.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';Et.append(lo);const Ft=document.createElement("input");Ft.type="file";Ft.id="check-file";Ft.accept=".md,.markdown,text/markdown,text/plain";Ft.hidden=!0;Et.append(Ft);const rn=document.createElement("section");rn.id="check-url-dialog";rn.hidden=!0;rn.setAttribute("role","dialog");rn.setAttribute("aria-labelledby","check-url-title");rn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';Et.append(rn);const uo=document.createElement("div");uo.id="help-menu";uo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;Et.append(uo);so(S("help-menu-toggle"),uo);const ri=document.createElement("div");ri.id="url-history";vi.append(ri);function _u(){if(ri.replaceChildren(),!M.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",ri.append(e);for(const t of M.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=re||Ne||ae,n.onclick=()=>{Ku(t.url)},ri.append(n)}}async function Ku(e){if(!(re||Ne||ae)){if(M.document?.source?.kind==="url"&&M.document.source.url===e){ke(),Ue?.reopenBusinessOverview(),M.active=M.tabs[0].key,Me(),Si();return}Ne=!0,Me();try{const t=await ro(e),n=Xn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await wi(n)}catch(t){t instanceof Rn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ne=!1,Me()}}}const Xu=so(S("open-menu-toggle"),vi),Zu=so(S("open-checks"),co,()=>{const e=oe();S("check-open-sample").hidden=!e||!Ls(e),S("check-close").disabled=!e?.checks}),Ea=so(S("check-followup-open"),lo,()=>{S("check-followup-sample").hidden=!oe()||!Ls(oe())});for(const[e,t]of[["open-menu-toggle",Zs],["open",Zs],["open-url",bc],["open-text",gc],["view-markdown",yc],["open-checks",Lr],["share-source",vc],["refresh",wc],["help-menu-toggle",kc],["drawer",Ic],["node-list-toggle",Sc],["node-list-close",Nr],["display-settings-toggle",Pr],["reset-layout",xc],["save-image",Ac],["copy-image",Ec],["out",$r],["in",Wr]])S(e).prepend(fi(t));Fl(document.querySelector("header"));const Qo=Vl(document.querySelector(".tab-strip"));let M={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Rt=!0,Yt=!1,re=!0,Jn=!1,On=!1,Ne=!1,Er=Promise.resolve(),bn,ve,Lt=0,ae=!1,ai=!1,Fn=0,_i=0,Bn=!1,Ds=!1,es=!1,Or=!1;const ts=new Set,Qt=new Set,Ki=new Set;function Oa(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ki){const i=[...M.document?[M.document]:[],...M.recovery].find(r=>r.key===n),o=t.find(r=>r.key===n&&r.draft===i?.draft);i&&o&&Ki.delete(n)}}const oe=()=>M.tabs.find(e=>e.key===M.active),Mn=e=>tn(e)?.key??e.key,nn=e=>M.document?.key===Mn(e);let ns="";const Yu=Ju(S("status"),S("status-text"),S("status-close"),S("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(ns===e)return;ns=e}Yu(e,t,n)}function Cs(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Ms(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ht(){re||(Lt++,tt())}function Qu(e){e.preventDefault(),e.returnValue=!0}function tt(){const e=Lt>Fn||_i>0||!1||ae||Ki.size>0||es||Bn||On,t=!re&&e;t!==Or&&(Or=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Qu));const n=re?"restoring":Jn?"protected":On?"conflict":Bn?"error":es||Ki.size>0?"draft":_i>0||ae?"saving":Lt>Fn?"dirty":Ds?"saved":"unchanged";Et.dataset.saveState!==n&&(Et.dataset.saveState=n),Jn?Cs():On?Ms():Bn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),fo()}function Rs(e){Bn=!0,ns=""}function po(){if(Jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(On)throw new Is}async function ep(e){po();try{await Il(e)}catch(t){throw t instanceof Is&&(On=!0,clearTimeout(bn),bn=void 0,Ms()),t}}function ja(e,t){_i++,ts.add(t),tt();const n=Er.catch(()=>{}).then(()=>ep(e)).then(()=>{Fn=Math.max(Fn,t),Ds=!0,Oa(e),Fn===Lt&&(Bn=!1)},i=>{throw Rs(),i}).finally(()=>{_i--,ts.delete(t),tt()});return Er=n.catch(()=>{}),n}function Ae(e=180,t=!0){if(re)return;if(t&&Lt++,clearTimeout(bn),bn=void 0,Jn){Cs(),tt();return}if(On){Ms(),tt();return}if(ae||ts.has(Lt)||!t&&Lt<=Fn&&!Bn){tt();return}const n=()=>{bn=void 0;let i;try{i=structuredClone(Ss(M))}catch{Rs(),tt();return}ja(i,Lt).catch(()=>tt())};e===0?n():bn=window.setTimeout(n,e),tt()}async function tp(e){if(re||ve||ae||!M.tabs.includes(e))return;if(li(e)===void 0){Ue?.closeBusinessOverview();return}bt.cancel(),ke();const t=M.active===e.key,n={...M,tabs:M.tabs.filter(i=>i!==e),active:t?M.tabs[0]?.key:M.active};try{await ki(()=>n,()=>{M=n}),t&&Et.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{tt()}}function pt(){S("drawer").setAttribute("aria-label","業務内容開閉"),S("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!oe(),t=e&&M.drawer,n=e&&!!M.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Yt=!1),fo(),S("layout-lock").replaceChildren(fi(Rt?Tr:qr)),S("layout-lock").setAttribute("aria-pressed",String(Rt)),S("layout-lock").title=Rt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",S("layout-lock").toggleAttribute("disabled",re),S("viewport").dataset.layoutLocked=String(Rt),S("prefer-write").checked=M.preferWrite===!0,S("prefer-write").disabled=re,S("show-exceptions").checked=oe()?.showExceptions!==!1,S("show-exceptions").disabled=re||ae||!oe()||ve===oe(),S("selected-edges-only").checked=oe()?.selectedEdgesOnly===!0,S("selected-edges-only").disabled=re||ae||!oe()||ve===oe(),document.documentElement.dataset.theme=M.dark?"dark":"light",S("theme").replaceChildren(fi(M.dark?Rc:Lc)),S("formattedMarkdownDrawer").hidden=!t,S("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(M.width,innerWidth*.65))+"px",S("drawer").setAttribute("aria-expanded",String(t)),S("drawer").toggleAttribute("disabled",re||!e),S("node-list-drawer").hidden=!n||ft().mode!=="findings",S("node-list-toggle").setAttribute("aria-expanded",String(n)),S("node-list-toggle").toggleAttribute("disabled",re||!e),Ue?.syncChrome()}function is(){for(const e of["save-image","copy-image"]){const t=S(e);t.hidden=!oe(),t.disabled=ai||re||!oe()||ve===oe(),t.setAttribute("aria-busy",String(ai))}}function fo(){is(),document.querySelector(".toolbar").dataset.settingsOpen=String(Yt),S("display-options").hidden=!Yt,S("reset-layout").disabled=re||Ne||ae||!1||!oe()||Qt.has(M.document?.key??"")||Jn||On;const e=S("display-settings-toggle"),t=Yt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Yt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=re||ae||!oe()||ve===oe()}function Da(e,t=!1){const n=oe();re||ae||!n||ve===n||e===Yt||(e&&(_n.delete(tn(n)?.key??n.key),mo()),bt.cancel(),qe=void 0,ke(),Yt=e,fo(),Gt(n),!e&&(t||S("display-options").contains(document.activeElement))&&S("display-settings-toggle").focus({preventScroll:!0}))}async function Ca(e){const t=oe();if(!(ai||re||!t||ve===t)){ai=!0,is();try{const n=Zl(S("nodes"),S("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await eu(n),$e("グラフ全体のPNGをコピーしました。")):await Ql(n,(tn(t)?.name??t.name)+(li(t)?" - "+li(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{ai=!1,is()}}}S("save-image").onclick=()=>Ca(!1);S("copy-image").onclick=()=>Ca(!0);S("display-settings-toggle").onclick=()=>Da(!Yt);S("reset-layout").onclick=()=>{const e=oe();if(re||Ne||ae||ve||!e||Qt.has(Mn(e)))return;try{po()}catch{tt();return}bt.cancel(),fn.cancel(),qe=void 0,ke();const t={...e,design:io(e)},n=Wu(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Ta.invalidate(e),Me(),n!==t&&Ae()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Yt&&S("source-dialog").hidden&&(e.preventDefault(),Da(!1,!0))});function ke(e=!0){const t=oe();if(!t)return!1;const n=[S("viewport").scrollLeft,S("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Ht(),Ae(180,!1)),i}function Ma(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function os(){Xu.close(),Zu.close(),Ea.close(),Qo.close(),Ma(np),Qo.update()}function np(){const e=S("tabs");e.replaceChildren(),M.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===M.active?" active":""),n.draggable=li(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Gi(t)!==void 0&&(n.dataset.activity=Gi(t)),Hi(t)!==void 0&&(n.dataset.object=Hi(t));const i=document.createElement("button");$o(i,"business",t.name),i.setAttribute("aria-current",String(t.key===M.active)),i.disabled=ae,i.onclick=async()=>{if(ae||Pt&&Pt!==t.key&&!await Ii())return;const r=ke()||M.active!==t.key;Ue?.activateBusiness(),M.active=t.key,Me(),Ue?.businessActivated(),Ae(180,r)};const o=Wo("業務設計："+t.name+"を閉じる");o.disabled=ae,o.onclick=()=>tp(t),n.append(i,o),n.ondragstart=r=>r.dataTransfer?.setData("text/plain",t.key),n.ondragover=r=>r.preventDefault(),n.ondrop=r=>{if(r.preventDefault(),ae)return;const s=M.tabs.findIndex(a=>a.key===r.dataTransfer?.getData("text/plain")),d=M.tabs.indexOf(t);if(s>0&&d>0&&s!==d){const[a]=M.tabs.splice(s,1);M.tabs.splice(d,0,a),os(),Ae()}},n.onkeydown=r=>{if(!ae&&r.altKey&&(r.key==="ArrowLeft"||r.key==="ArrowRight")){r.preventDefault();const s=M.tabs.indexOf(t),d=s+(r.key==="ArrowLeft"?-1:1);s>0&&d>0&&d<M.tabs.length&&([M.tabs[s],M.tabs[d]]=[M.tabs[d],M.tabs[s]],os(),Ae())}},e.append(n)})}const jr=new Map,_n=new Set;function mo(){const e=oe(),t=!!e&&e.design.sourceFormat!=="json"&&_n.has(tn(e)?.key??e.key)&&!e.checks;t||(Ea.close(),Cn.contains(document.activeElement)&&S("viewport").focus({preventScroll:!0})),Cn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])S(n).disabled=re||Ne||ae||!1||!e||yn(e).busy===!0}S("check-followup-later").onclick=()=>{const e=oe();e&&_n.delete(tn(e)?.key??e.key),mo()};let ss;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])S("check-followup-"+e).onclick=()=>{ss=S("check-followup-open"),S(t).click(),ss=void 0};function Ls(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===js}function yn(e){const t=tn(e)?.key??e.key;let n=jr.get(t);return n||(n={},jr.set(t,n)),n}async function Ns(e,t){if(!nn(e))throw Error("原本文書が切り替わりました。");const n=Vt(M,M.recovery,{...M.document,checks:t},Ss(M).views);await ki(()=>n,()=>{M=n,t&&_n.delete(tn(e)?.key??e.key)})}async function Ra(e,t){const n=yn(e);if(e.design.sourceFormat==="json"||n.busy||ae||re||ve===e)return;const i=ui(e);n.busy=!0,n.error=void 0,n.candidate=void 0,on();try{const o=await t();if(!nn(e))return;if(i!==ui(M.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const r=Hn(o),s=pi(r,M.tabs[0]);if(s.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+s.reason);s.state==="unverified"?n.candidate=o:(await Ns(e,o),n.candidate=void 0,Ue?.openRelatedChecks(oe()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,$e(n.error,"error")}finally{n.busy=!1,on()}}async function La(e,t){const n=yn(e);if(n.busy||ae||!nn(e))return;const i=pi(Hn(t),M.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,on();return}n.busy=!0,n.error=void 0;try{await Ns(e,{...t,confirmedFor:ui(M.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(oe()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,on()}}function on(){mo();const e=oe(),t=S("detail"),n=e?yn(e):void 0,i=e?e.key+":"+(e.selected??""):"";S("open-checks").disabled=re||ae||ve===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,r=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const s=e.design.graph.nodes.find(p=>p.id===e.selected),d=Ul(e,n,{disabled:re||ae||ve===e,redraw:on,confirm:p=>{La(e,p)}}),a=document.createElement("div");a.className="right-drawer-heading";const l=id(s?.name??"業務設計");if(s){const p=s.type==="business"?Na(String(s.who),s.id):Hr(s);p.classList.add("drawer-node-icon"),l.prepend(p)}a.append(l);const u=document.createElement("button");if(u.type="button",u.id="business-drawer-close",u.setAttribute("aria-label","右ドロワーを閉じる"),u.textContent="×",u.onclick=()=>{S("drawer").click(),S("drawer").focus({preventScroll:!0})},a.append(u),t.append(a),d.hasChildNodes()&&t.append(d),s){const p=qu(e.design,s.id,Xi,s.type==="business");p.hasChildNodes()&&t.append(p)}t.append(nl(e.design,s?.id,p=>Xi({type:"finding",id:p}))),s?.type==="business"&&Ue?.appendActivityTestLinks(t,s.id),t.scrollTop=r,o&&document.getElementById(o)?.focus({preventScroll:!0})}const Dr=new Map,ft=()=>{const e=M.active??"";let t=Dr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Dr.set(e,t)),t};function Xi(e){if(!oe())return;const t=ft();t.mode="findings",t.finding=e,M.nodeDrawer=!0,innerWidth<=800&&(M.drawer=!1),pt(),xt(),S("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Ae()}function ip(e){const t=oe();if(!t)return;const n=ft();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){Xi(i[0]);return}M.nodeDrawer=!0,innerWidth<=800&&(M.drawer=!1),pt(),xt(),S("drawer-mode-findings").focus({preventScroll:!0}),Ae()}function op(e,t){const n=ft().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return ft().finding=void 0,!1;const r=document.createElement("button");if(r.className="node-navigate finding-back",r.textContent="← 指摘一覧に戻る",r.onclick=()=>{ft().finding=void 0,xt(),S("drawer-mode-findings").focus({preventScroll:!0})},t.append(r),i)t.append(Pu(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,et(String(o.problem)))}const s=i?.targets??[o.id];if(s.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const l of s){const u=document.createElement("button");u.className="node-navigate finding-target-link",u.dataset.findingTarget=l;const p=e.design.graph.nodes.some(c=>c.id===l),g=e.hiddenNodes?.includes(l);u.disabled=!p||!!g,u.textContent=(e.design.graph.nodes.find(c=>c.id===l)?.name??l)+(p?g?"（非表示）":"":"（参照先なし）"),u.onclick=()=>$i(l,!0),d.append(u)}t.append(d)}return!0}function Na(e,t){let n=0;for(const s of e)n=n*31+s.codePointAt(0)>>>0;const i=document.createElement("span");i.className="who-badge",i.style.setProperty("--role-color",(t&&oe()?.design.model?.business.roles?ms(oe().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true");const o=oe()?.design.model?.business.activities.find(s=>s.id===t),r=o&&"who"in o&&typeof o.who=="object"?o.who?.kind:void 0;return i.append(fi(r==="system"?Nc:r==="scheduler"?Pc:Vr)),i}function ho(e,t=!0){re||!oe()||(bt.cancel(),ke(),M.nodeDrawer=e,e&&ft().mode==="findings"&&innerWidth<=800&&(M.drawer=!1),pt(),e&&oe()?.selected&&Zn(oe().selected),xt(),t&&S(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Ae())}function Zn(e){const t=oe(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=ft();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(nd(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(S("node-list").querySelectorAll("[data-list-node]")).find(r=>r.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function sp(e,t){const n=oe();if(!n||re||ae||ve===n)return;bt.cancel(),qe=void 0,ke();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],vn(),Ae()}function $i(e,t=!1){let n=oe();if(n&&!io(n).graph.nodes.some(p=>p.id===e)&&(ke(),Ue?.reopenBusinessOverview(),M.active=M.tabs[0].key,n=oe(),Me()),!n||n.hiddenNodes?.includes(e)||ve===n)return;t||(ft().finding=void 0);const i=S("node-list").contains(document.activeElement);bt.cancel(),qe=void 0,ke(),n.selected=e,Zn(e),pt(),vn();const o=S("viewport"),r=o.getBoundingClientRect(),s=S("formattedMarkdownDrawer").getBoundingClientRect(),d=M.drawer&&s.left>r.left&&s.left<r.right?s.left:r.right,a=Math.max(1,Math.min(o.clientWidth,d-r.left-o.clientLeft)),l=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const u=n.positions[e];if(n.scroll=[(u[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(u[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],Gt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],ke(),i){const p=t?"[data-finding-target]":"[data-list-node]",g=Array.from(S("node-list").querySelectorAll(p)).find(c=>(t?c.dataset.findingTarget:c.dataset.listNode)===e);(t?g:g?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Ae()}function xt(){const e=oe(),t=ft(),n=S("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const r=S("drawer-modes");r.replaceChildren();for(const h of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+h,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===h)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===h?0:-1,m.textContent=`指摘（${e?Tu(e.design):0}）`;const f=()=>{t.mode=h,xt(),S("drawer-mode-"+h).focus({preventScroll:!0})};m.onclick=f,m.onkeydown=b=>{["ArrowLeft","ArrowRight","Home","End"].includes(b.key)&&(b.preventDefault(),m.focus({preventScroll:!0}))},r.append(m)}for(const h of[S("node-categories"),S("node-list-search"),document.querySelector(".scope-bulk")])h.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const s=S("node-list-search");s.value=t.search,s.disabled=!e||re;const d=S("node-categories");d.replaceChildren();for(const[h,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const f=document.createElement("button");f.dataset.category=h,f.id="node-category-"+h,f.setAttribute("role","tab"),f.setAttribute("aria-selected",String(t.category===h)),f.setAttribute("aria-controls","node-list"),f.tabIndex=t.category===h?0:-1,f.textContent=m,f.onclick=()=>{t.category=h,xt(),S("node-category-"+h).focus({preventScroll:!0})},f.onkeydown=b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;b.preventDefault();const x=["activity","object","role"],v=x.indexOf(h);t.category=b.key==="Home"?"activity":b.key==="End"?"role":x[(v+(b.key==="ArrowRight"?1:2))%3],xt(),S("node-category-"+t.category).focus({preventScroll:!0})},d.append(f)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(h=>h.scope===!1)??[],u=l.filter(h=>!a.has(h.id)).length,p=S("scope-outside"),g=u===l.length?"true":u===0?"false":"mixed";p.setAttribute("aria-pressed",g),p.setAttribute("aria-label",g==="true"?"スコープ外を非表示":"スコープ外を表示"),p.replaceChildren(fi(g==="false"?Tc:qc)),p.disabled=!l.length||re||ve===e;const c=S("show-outside");if(c.checked=g==="true",c.indeterminate=g==="mixed",c.setAttribute("aria-checked",g),c.disabled=p.disabled,S("scope-count").textContent=g==="mixed"?`${u}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(op(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const h=document.createElement("p");h.textContent=(e.design.graph.nodes.find(f=>f.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,xt(),S("drawer-mode-findings").focus({preventScroll:!0})},n.append(h,m)}n.append($u(e.design,t.resolved,h=>{t.resolved=h,xt(),n.querySelector("input")?.focus({preventScroll:!0})},Xi,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}S("node-list-toggle").onclick=()=>ho(!M.nodeDrawer);S("node-list-close").onclick=()=>ho(!1);S("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),ho(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!S("node-list-drawer").hidden&&S("source-dialog").hidden&&(e.preventDefault(),ho(!1))});S("node-list-search").oninput=()=>{ft().search=S("node-list-search").value,xt()};function Pa(){const e=oe();if(e){const t=e.design.graph.nodes.filter(n=>n.scope===!1);sp(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}S("scope-outside").onclick=Pa;S("show-outside").onchange=Pa;const rp="http://www.w3.org/2000/svg",Lo=e=>document.createElementNS(rp,e),Ta=new Ho,Cr=new WeakMap;function ap(e){if(!Gr(e.graph))return;let t=Cr.get(e);return t||(t=wl(e),Cr.set(e,t)),t.wires}function cp(e,t,n){ps(S("edges"),e,t,{"data-relation":String(n)})}let mi=()=>{},Zt=[0,0],pn=[0,0];function dp(){const e=S("node-list-drawer");return S("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function lp(){const e=S("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Gt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(p=>p[0])),Math.min(0,...i.map(p=>p[1]))],r=[o[0]<0||n[0]>0?Math.min(o[0],pn[0]):0,o[1]<0||n[1]>0?Math.min(o[1],pn[1]):0],{growth:s,origin:d}=Mc(n,r,e.zoom),a=s.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+s[0],e.scroll[1]+s[1]],Ht(),Ae(180,!1));const l=Math.ceil(Math.max(1400,Zt[0],(dp()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(p=>p[0]+340))),u=Math.max(850,Zt[1],Math.max(Zt[1],...i.map(p=>p[1]+68))+lp()/e.zoom-t[1],(S("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(p=>p[1]+220));S("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",S("canvas").style.height=(u+d[1]+t[1]*2)*e.zoom+"px",S("nodes").style.left=(d[0]+t[0])*e.zoom+"px",S("nodes").style.top=(d[1]+t[1])*e.zoom+"px",S("edges").style.left=t[0]*e.zoom+"px",S("edges").style.top=t[1]*e.zoom+"px",S("nodes").style.width=l+"px",S("nodes").style.height=u+"px",S("nodes").style.transform=`scale(${e.zoom})`,S("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${u+d[1]}`),S("edges").style.width=(l+d[0])*e.zoom+"px",S("edges").style.height=(u+d[1])*e.zoom+"px",a&&(S("viewport").scrollLeft=e.scroll[0],S("viewport").scrollTop=e.scroll[1]),S("zoom").textContent=Math.round(e.zoom*100)+"%"}function vn(){Ma(up)}function up(){fo(),fn.cancel(),mi=()=>{},Zt=[0,0],pn=[0,0];const e=oe();if(S("nodes").replaceChildren(),S("edges").replaceChildren(),S("empty").hidden=!!e,S("canvas").hidden=!e,!e){S("viewport").scrollLeft=0,S("viewport").scrollTop=0,on(),xt();return}const t=io(e),n=t.graph.nodes,i=n.filter(u=>!e.hiddenNodes?.includes(u.id)),o=new Set(i.map(u=>u.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const r=e.selected,s=e.positions,d=Ui(t.graph.relations,r);Gt(e),S("edges").append(us());const a=zu(t.graph.relations,M.preferWrite===!0),l=()=>{const u=n.flatMap(f=>{const b=s[f.id];return b?[{id:f.id,x:b[0],y:b[1],width:260,height:68}]:[]}),p=ap(t),g=Ta.update(e,t,u,t.graph.relations,p),c=new Map;for(Zt=[0,0],pn=[0,0];S("edges").childNodes.length>1;)S("edges").lastChild.remove();const h=new Map(e.design.graph.nodes.map(f=>[f.id,f.name]));t.graph.relations.forEach((f,b)=>{if(a.has(b))return;const x=g[b];if(!x||(Zt[0]=Math.max(Zt[0],x.bounds.right+20,x.label[0]+Math.max(30,f.label.length*12)/2+12),Zt[1]=Math.max(Zt[1],x.bounds.bottom+20,x.label[1]+22),pn[0]=Math.min(pn[0],...x.points.map(E=>E[0]-20),x.label[0]-Math.max(30,f.label.length*12)/2-12),pn[1]=Math.min(pn[1],...x.points.map(E=>E[1]-20),x.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(f)||!o.has(f.from)||!o.has(f.to)||e.showExceptions===!1&&(f.kind==="business-exception"||f.kind==="object-exception")))return;const v=Lo("path");v.setAttribute("d",x.path),v.dataset.relation=String(b),v.dataset.collisions=String(x.collisions),v.dataset.rerouted=String(x.rerouted),v.dataset.fallback=String(x.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),f.kind.endsWith("exception")&&v.classList.add("exception"),d.related(f)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),d.muted(f)&&v.classList.add("muted");const D=Lo("title");D.textContent=(h.get(f.from)??f.from)+" → "+(h.get(f.to)??f.to)+": "+f.label,v.append(D),S("edges").append(v),f.kind.endsWith("exception")&&cp(v,x,b);const k=Br(f,b,p?.[b]),w=c.get(k);if(w){w.dataset.relations+=" "+b,d.related(f)&&(w.classList.add("review-related"),w.classList.remove("muted"));return}const A=Lo("text");c.set(k,A),A.dataset.relations=String(b),A.setAttribute("x",String(x.label[0]-Math.max(30,f.label.length*12)/2)),A.setAttribute("y",String(x.label[1])),A.setAttribute("text-anchor","start"),A.classList.add("edge-label"),A.setAttribute("dominant-baseline","middle"),A.dataset.relation=String(b),d.related(f)&&A.classList.add("review-related"),d.muted(f)&&A.classList.add("muted"),A.textContent=f.label,S("edges").append(A)});const m=S("edges");for(const f of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(f);Gt(e)};mi=l,l(),i.forEach(u=>{const p=document.createElement("div");p.setAttribute("role","group"),p.className="node "+u.type+(u.scope===!1?" outside":u.scope===null?" scope-undecided":"")+d.nodeClasses(u.id),p.dataset.node=u.id,u.type==="business"&&(p.dataset.activity=u.id),p.style.left=s[u.id][0]+"px",p.style.top=s[u.id][1]+"px",u.type==="business"?p.append(Na(String(u.who),u.id)):p.append(Hr(u));const g=document.createElement("span");g.className="node-text";const c=document.createElement("span");c.className="review-kind",c.textContent=(u.type==="business"?"Activity":"Object")+(u.scope===null?" · 範囲未決":u.scope?" · 範囲内":" · 範囲外"),g.append(c);const h=document.createElement("span");if(h.className="node-name",h.textContent=u.name,g.append(h),u.type==="business"){const v=document.createElement("small");v.textContent=String(u.who),g.append(v)}if(p.append(g),$c(u.id,li(e))){const v=document.createElement("button");v.type="button",v.className=u.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",u.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=D=>D.stopPropagation(),v.onpointerup=D=>D.stopPropagation(),v.onclick=D=>{D.stopPropagation(),u.type==="business"?rs(u.id):qa(u.id),Ue?.businessActivated()},p.append(v)}p.title=u.name+(u.type==="business"?" — "+String(u.who):""),p.setAttribute("aria-label",p.title+(u.id===r?"（選択中）":""));const m=Nu(e.design,u);if(m.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=m.join(" · "),v.setAttribute("aria-label",u.name+"の指摘を開く"),v.onpointerdown=D=>D.stopPropagation(),v.onpointerup=D=>D.stopPropagation(),v.onclick=D=>{D.stopPropagation(),ip(u.id)},p.append(v),p.setAttribute("aria-label",p.getAttribute("aria-label")+" · "+m.join("、"))}let f;const b=p;b.onpointerdown=v=>{v.button!==0||ve===e||Rt||(v.stopPropagation(),b.setPointerCapture(v.pointerId),f=v.pointerId,fn.begin(u.id,[v.clientX,v.clientY]))},b.onpointermove=v=>{f===void 0||v.pointerId!==void 0&&v.pointerId!==f||!p.isConnected||ve===e||fn.move([v.clientX,v.clientY])},b.onpointerup=v=>{if(f===void 0||f!==v.pointerId||(f=void 0,!p.isConnected||ve===e))return;const D=fn.end();b.hasPointerCapture?.(v.pointerId)&&b.releasePointerCapture(v.pointerId),D&&(D.moved||(ft().finding=void 0,e.selected!==u.id&&(e.selected=u.id,Ht()),Zn(u.id)),ke(),vn(),Ae(180,!1))};const x=v=>{f===void 0||f!==v.pointerId||(f=void 0,p.isConnected&&(fn.cancel(),ke(),Ae(180,!1)))};b.onpointercancel=x,b.onlostpointercapture=x,S("nodes").append(p)}),S("zoom").textContent=Math.round(e.zoom*100)+"%",on(),xt()}function rs(e){re||ae||ve||(ke(),Ml(M,e),Me(),Ae(),S("viewport").focus({preventScroll:!0}))}function qa(e){re||ae||ve||(ke(),Rl(M,e),Me(),Ae(),S("viewport").focus({preventScroll:!0}))}function Me(){$a(),document.title=M.document?M.document.name+" · Alder Viewer":"Alder Viewer",bt.cancel(),qe=void 0,pt(),os(),vn();const e=oe();e&&(S("viewport").scrollLeft=e.scroll[0],S("viewport").scrollTop=e.scroll[1]),S("refresh").toggleAttribute("disabled",re||ae||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e))),S("refresh").hidden=!e,S("view-markdown").toggleAttribute("disabled",re||Ne||ae||!1||!e||Qt.has(Mn(e))),S("view-markdown").hidden=!e,S("open-checks").hidden=!e||e.design.sourceFormat==="json",S("open-checks").toggleAttribute("disabled",re||Ne||ae||!1||!e||!!(e&&yn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])S(t).toggleAttribute("disabled",re||Ne||ae);S("open-sample").setAttribute("aria-disabled",String(re||Ne||ae)),S("open-sample").tabIndex=re||Ne||ae?-1:0,S("theme").toggleAttribute("disabled",re),gi(),mo(),_u(),yo(),Ue?.syncDocument()}function $a(){const e=S("header-title"),t=M.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{pp(n.value)},e.append(n));const i=Array.from(n.options).map(o=>[o.value,o.textContent]);JSON.stringify(i)!==JSON.stringify(t.choices.map(({id:o,name:r})=>[o,r]))&&n.replaceChildren(...t.choices.map(({id:o,name:r})=>{const s=document.createElement("option");return s.value=o,s.textContent=r,s})),n.value=t.selected,n.title=t.choices.find(o=>o.id===t.selected)?.name??"",n.disabled=re||Ne||ae||!1}async function pp(e){const t=M.document;if(!t?.design.namedPlans||re||Ne||ae||ve||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),i=document.activeElement===n;try{if(!S("source-dialog").hidden&&!await Ii()){$a();return}const o=sn(t.design.markdown,e),r=crypto.randomUUID(),s=Vt({...M,tabs:[],active:r},M.recovery,{...t,design:o},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await ki(()=>s,()=>{M=s}),Ue?.reopenBusinessOverview(),Ue?.activateBusiness(),Ue?.businessActivated(),$e("")}catch(o){Me(),o instanceof Rn||$e("案を切り替えられません: "+o.message,"error")}finally{i&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function wi(e){const t=M.document,n=Dl(M,e);return t?(await ki(()=>n,()=>{M=n,_n.add(tn(M.tabs[0])?.key??M.tabs[0].key)}),!0):(ke(),M=n,_n.add(tn(M.tabs[0])?.key??M.tabs[0].key),Me(),Ae(),!0)}async function Wa(e,t){if(Pt&&!await Ii())return;const n=await Ji(e),i=oe();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await hi(i,n,t))return;Ue?.reopenBusinessOverview(),M.active=M.tabs[0].key,Me(),Ae();return}const o=Xn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await wi(o)}S("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])S("guide-"+e).onclick=()=>S(e).click();S("open-sample").onpointerdown=e=>e.stopPropagation();S("open-sample").onclick=async e=>{if(e.preventDefault(),!(re||Ne||ae))try{if(M.document?.source?.kind==="sample"&&M.document.design.markdown===Ar){ke(),Ue?.reopenBusinessOverview(),M.active=M.tabs[0].key,Me(),S("viewport").focus({preventScroll:!0});return}const t=sn(Ar),n=M.document?.source?.kind==="sample"&&M.document.design.markdown===js?M.tabs[0]:void 0;n&&ke();const i=n??M.sampleLayout,o=i?Gu(i,t):{},r=Xn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await wi(r)&&S("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};S("open").onclick=async()=>{if(!(re||Ne||ae)){Ne=!0,Me();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Wa(await n.getFile(),n)}else S("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Ne=!1,Me()}}};S("fallback").onchange=async()=>{const e=S("fallback");if(!(re||Ne||ae)){Ne=!0,Me();try{for(const t of Array.from(e.files??[]))await Wa(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Ne=!1,Me()}};class Rn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function ki(e,t){if(ae||ve)throw Error("表示を切り替えています。完了後に再試行してください。");try{po()}catch(o){throw new Rn(o)}ke(),clearTimeout(bn),bn=void 0,ae=!0,Lt++;const n=Lt;Me(),tt();let i=!1;try{const o=structuredClone(Ss(e()));await ja(o,n);const r=M;t(),M!==r&&(M=Ll(M,r)),ut==="view"&&Pt&&!M.tabs.some(s=>s.key===Pt)&&(Pt=M.tabs[0]?.key),Oa(o),i=!0}catch(o){throw Rs(),new Rn(o)}finally{ae=!1,Me(),tt(),i&&Lt!==n&&Ae(0,!1)}}async function hi(e,t,n=e.handle,i=!1){if(!nn(e)||e.design!==M.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=sn(t.markdown,e.design.namedPlans.selected));const o=!!e.design.namedPlans!=!!t.namedPlans,r=crypto.randomUUID(),s=M.document,d=o&&s?Vt({...M,tabs:[],active:r},M.recovery,{...s,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):Cl(M,t,n,i);return await ki(()=>d,()=>{M=d}),jn=void 0,yo(),$e(""),!0}async function Mr(e){if(!nn(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await hi(e,await Ji(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const r=()=>{o.remove(),n()};o.oncancel=r,o.onchange=async()=>{try{const s=o.files?.[0];s&&await hi(e,await Ji(s)),r()}catch(s){o.remove(),i(s)}},o.click()})}S("refresh").onclick=async()=>{const e=oe();if(re||ae||ve||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e)))return;Pt===e.key&&Yi();const t=Mn(e);Qt.add(t),Me();try{if(e.source?.kind==="url"){const i=await ro(e.source.url);await hi(e,i);return}if(!e.handle){await Mr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!nn(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Mr(e);return}await hi(e,await Ji(await e.handle.getFile()))}catch(n){nn(e)&&n.name!=="AbortError"&&!(n instanceof Rn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Qt.delete(t),Me()}};let ut="text",Pt,en=!1,gn=0,Zi,as=null;const Bt=()=>S("source-text"),bi=()=>S("source-url");function Ps(){es=!S("source-dialog").hidden&&ut!=="view"&&(ut==="text"?Bt().value:bi().value)!=="",tt()}bi().addEventListener("input",Ps);function gi(){cs();const e=ut==="view",t=en||ae;Bt().disabled=t,Bt().readOnly=e,S("source-dialog").dataset.mode=ut,S("source-submit").hidden=e,S("source-submit").textContent="表示",S("source-submit").disabled=t||e,S("source-cancel").disabled=ae||t&&ut!=="url",S("source-cancel").textContent=e?"閉じる":"キャンセル",Ps(),queueMicrotask(Va)}function Ts(e,t){if(!(re||Ne||ae||t&&Qt.has(Mn(t)))){Zi?.abort(),gn++,ut=e,Pt=t?.key,en=!1,as=document.activeElement,S("source-dialog").hidden=!1,S("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${M.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])S(n).hidden=e!=="url";for(const n of["text-label","source-text"])S(n).hidden=e==="url";S("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Bt().value=t.design.markdown:e==="text"&&(Bt().value=bo),gi(),(e==="url"?bi():Bt()).focus()}}let bo="",Pi;function fp(){if(as?.isConnected&&as.focus({preventScroll:!0}),Pi!==void 0&&cancelAnimationFrame(Pi),ut!=="view")return;const e=gn;Pi=requestAnimationFrame(()=>{if(Pi=void 0,e!==gn||!S("source-dialog").hidden)return;const t=window.visualViewport,n=Et.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Yi(){gn++,Zi?.abort(),en=!1,Pt=void 0,S("source-dialog").hidden=!0,gi(),fp()}async function Ii(){return ae?!1:(ut==="text"&&(bo=Bt().value),Yi(),!0)}function za(){return Ii()}Bt().oninput=()=>{ut==="text"&&(bo=Bt().value,Ps())};let Wi=!1;function Ua(){return re||Ne||en||ae||ve?"読込が終わってから共有してください。":Uu(oe())}function cs(){const e=Ua(),t=S("share-source");t.hidden=!oe(),t.setAttribute("aria-disabled",String(Wi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}S("share-source").onclick=async()=>{if(Wi)return;const e=Ua();if(e){$e(e,"warning");return}const t=oe();if(t.source?.kind!=="url")return;const n=t.source.url,i=Vu(location.href,n);Wi=!0,cs();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Wi=!1,cs()}};let Xt,$n=0,Rr=0,ci;function Va(){if(re||Ne||en||ve||ae||Xt||ci===void 0)return;const e=ci;ci=void 0,qs(e)}async function qs(e=location.hash){const t=e;if(re)return;const n=++Rr;if(!/^#source(?:=|$)/.test(t)){ci=void 0,Xt&&!ae&&(Xt.abort(),Xt=void 0,$n++,Ne=!1,Me());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),ae){ci=t;return}if(en||Ne&&!Xt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++$n;Xt?.abort();try{const o=Fu(t);po();const r=M.tabs.find(l=>l.source?.kind==="url"&&l.source.url===o),s=r;if(s){if(Pt&&Pt!==s.key&&!await Ii()||i!==$n||n!==Rr)return;const l=ke()||M.active!==s.key;M.active=s.key,Me(),Ae(180,l),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),Si();return}Xt=new AbortController,Ne=!0,Me();const d=await ro(o,Xt.signal);if(i!==$n)return;const a=Xn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await wi(a))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===$n&&!(o instanceof Rn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===$n&&(Xt=void 0,Ne=!1,Me(),Va())}}window.addEventListener("hashchange",()=>{qs().then(()=>{M.document?.key===ds&&Si()})});function $s(e){M.drawer=!0,pt(),on()}async function mp(e){const t=yn(e);if(!(e.design.sourceFormat==="json"||t.busy||ae||re||ve===e)){t.busy=!0;try{await Ns(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,on()}}}let Qi;Ft.onchange=()=>{const e=Ft.files?.[0],t=Qi??oe();Qi=void 0,Ft.value="",!(!e||!t||!nn(t))&&($s(),Ra(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ft.oncancel=()=>{Qi=void 0};S("check-open").onclick=()=>{Qi=oe(),Ft.click()};let Ws,zi=null;function zs(){rn.hidden=!0,Ws=void 0,(zi&&!zi.closest("[hidden]")?zi:S("open-checks").getBoundingClientRect().width?S("open-checks"):S("document-actions-toggle")).focus({preventScroll:!0})}S("check-open-url").onclick=()=>{const e=oe();e&&(zi=ss??document.activeElement,Ws=e,S("check-url").value=yn(e).url??"",rn.hidden=!1,S("check-url").focus())};S("check-url-cancel").onclick=zs;rn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),zs())};S("check-url-form").onsubmit=e=>{e.preventDefault();const t=Ws;if(!t||!nn(t))return;const n=S("check-url").value.trim();yn(t).url=n,zs(),$s(),Ra(t,async()=>({name:n,url:n,markdown:await Ru(n)}))};S("check-open-sample").onclick=()=>{const e=oe();!e||!Ls(e)||($s(),La(e,{name:"チェックリストのサンプル",markdown:Hu}))};S("check-close").onclick=()=>{const e=oe();e&&mp(e)};S("open-sample-menu").onclick=()=>{S("open-sample").click()};S("view-markdown").onclick=()=>{const e=oe();e&&Ts("view",e)};S("open-url").onclick=()=>Ts("url");S("open-text").onclick=()=>Ts("text");S("source-cancel").onclick=()=>za();S("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),za())};S("source-submit").onclick=async()=>{if(en||ae||ut==="view"&&ve||S("source-dialog").hidden||ut==="view")return;en=!0,gi();const e=++gn,t=ut;Zi=new AbortController;try{const n=ut==="url"?new URL(bi().value.trim()).href:bi().value.trim();if(t==="url"&&M.document?.source?.kind==="url"&&M.document.source.url===n){Ue?.reopenBusinessOverview(),M.active=M.tabs[0].key,Yi(),Me(),Si();return}const i=t==="url"?await ro(n,Zi.signal):Lu(Bt().value),o=i.markdown;if(e!==gn)return;const r=Xn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await wi(r))return;$e(""),t==="text"&&(bo=o),Yi()}catch(n){e===gn&&!(n instanceof Rn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===gn&&(en=!1,gi())}};S("layout-lock").onclick=()=>{re||(bt.cancel(),qe=void 0,ke(),Rt=!Rt,pt(),vn())};S("selected-edges-only").onchange=()=>{const e=oe();!e||re||ae||ve===e||(bt.cancel(),qe=void 0,ke(),e.selectedEdgesOnly=S("selected-edges-only").checked,mi(),Ae())};S("show-exceptions").onchange=()=>{const e=oe();!e||re||ae||ve===e||(bt.cancel(),qe=void 0,ke(),e.showExceptions=S("show-exceptions").checked,mi(),Ae())};S("prefer-write").onchange=()=>{re||(ke(),M.preferWrite=S("prefer-write").checked,vn(),Ae())};S("theme").onclick=()=>{re||(M.dark=!M.dark,pt(),Ae())};S("drawer").onclick=()=>{re||!oe()||(ke(),M.drawer=!M.drawer,Me(),Ae())};for(const[e,t]of[["in",Ys],["out",1/Ys]])S(e).onclick=()=>{const n=oe();if(n&&ve!==n){const i=ke(),o=Oc({zoom:n.zoom,scroll:n.scroll},t).zoom,r=i||o!==n.zoom;n.zoom=o,Me(),Ae(180,r)}};const je=S("viewport");function Fa(e,t){const n=oe();if(!n||ae||ve===n)return;ke();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Ht();const o=Array.from(S("nodes").children).find(r=>r.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),mi()}const fn=Cc({read:()=>{const e=oe();return e&&!ae&&e!==ve&&!Rt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>oe()?.positions[e],connected:e=>Array.from(S("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=je.getBoundingClientRect(),t=e.left+je.clientLeft,n=e.top+je.clientTop,i={left:t,top:n,right:t+je.clientWidth,bottom:n+je.clientHeight};for(const[r,s]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=S(r),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=i.bottom||(s==="right"&&a.left>i.left&&a.left<i.right&&(i.right=a.left),s==="left"&&a.right>i.left&&a.right<i.right&&(i.left=a.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:Fa,pan:e=>{const t=oe();if(!t||t===ve||Rt)return;ke();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],ke(),Ht()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),bt=jc(je,{nodeDrag:fn,read:()=>{const e=oe();return e&&!ae&&ve!==e?{key:e.key,zoom:e.zoom,locked:Rt,scroll:[je.scrollLeft,je.scrollTop]}:void 0},position:e=>oe()?.positions[e],change:e=>{const t=oe();if(!t||ae||ve===t)return;const n=t.scroll;let i=!1;e.node&&Fa(e.node.id,e.node.position),e.selected&&(ft().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Zn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?vn():e.zoom!==void 0&&Gt(t),e.scroll&&(je.scrollLeft=e.scroll[0],je.scrollTop=e.scroll[1]),ke(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ht()},finish:()=>{const e=oe();e&&Gt(e),ke(),Ae(180,!1)}}),Us=()=>{bt.cancel(),qe=void 0,ke(),Ae(0,!1)};window.addEventListener("blur",Us);window.addEventListener("pagehide",Us);document.addEventListener("visibilitychange",()=>{document.hidden&&Us()});je.onscroll=()=>{ke()};let qe;Dc(je,{read:()=>{const e=oe();return e&&!re&&!ae&&e!==ve?{zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop]}:void 0},change:e=>{const t=oe();!t||ae||t===ve||(bt.cancel(),fn.cancel(),qe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],ke(!1),Ht(),Ae(180,!1))}});je.onpointerdown=e=>{const t=oe(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||ae||t===ve||n&&!Rt||(qe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[je.scrollLeft,je.scrollTop],node:n,moved:!1},je.setPointerCapture(e.pointerId))};je.onpointermove=e=>{if(qe&&qe.pointer===e.pointerId&&qe.key===oe()?.key&&oe()!==ve){const t=e.clientX-qe.x,n=e.clientY-qe.y;Math.hypot(t,n)>3&&(qe.moved=!0),je.scrollLeft=qe.scroll[0]-t,je.scrollTop=qe.scroll[1]-n,ke()}};je.onpointerup=e=>{if(!qe||qe.pointer!==e.pointerId)return;const t=oe(),n=qe;qe=void 0,je.hasPointerCapture?.(e.pointerId)&&je.releasePointerCapture(e.pointerId),t&&t!==ve&&n.key===t.key&&!n.moved&&n.node&&(ft().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ht()),Zn(n.node),vn()),ke(),Ae(180,!1)};je.onpointercancel=()=>{qe=void 0};je.addEventListener("lostpointercapture",e=>{e.target===je&&qe?.pointer===e.pointerId&&(qe=void 0)});let go=!1;S("resize").onpointerdown=e=>{re||(go=!0,S("resize").setPointerCapture(e.pointerId))};S("resize").onpointermove=e=>{if(go){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==M.width&&(M.width=t,Ht()),pt()}};S("resize").onpointerup=()=>{go=!1,Ae(180,!1)};S("resize").onpointercancel=()=>{go=!1,Ae(180,!1)};S("resize").onkeydown=e=>{if(!re&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,M.width+(e.key==="ArrowLeft"?20:-20)));t!==M.width&&(M.width=t,Ht()),pt(),Ae(180,!1)}};window.addEventListener("resize",()=>{pt();const e=oe();e&&Gt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=oe();t&&Gt(t)});e.observe(S("viewport")),e.observe(document.querySelector(".toolbar"))}function Ti(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=sn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Hn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Yn=document.createElement("section");Yn.id="source-update-notice";Yn.className="info-bar";Yn.hidden=!0;Yn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Yn);let jn;const Ba=new Set;let No=0,ds,Po;function yo(){const e=M.document;Yn.hidden=!jn||jn.key!==e?.key||jn.baseline!==e.design.markdown||Ba.has(e.key),S("source-update-refresh").disabled=re||Ne||ae||!!(e&&Qt.has(e.key))}S("source-update-close").onclick=()=>{jn&&Ba.add(jn.key),yo()};S("source-update-refresh").onclick=()=>{S("refresh").click()};async function Si(){const e=M.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Po===t)return;Po=t;const n=++No,i=e.key,o=e.source.url,r=e.design.markdown;try{const s=await Es(o);if(n!==No||M.document?.key!==i||M.document.design.markdown!==r||M.document.source?.kind!=="url"||M.document.source.url!==o)return;sn(s),jn=s.replace(/\r\n?/g,`
`)!==r.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:r}:void 0,yo()}catch{}finally{n===No&&(Po=void 0)}}Ue=ll(Et,{rightDrawer:{isOpen:()=>M.drawer,isReady:()=>!re,setOpen:e=>{re||(M.drawer=e,pt(),Ae())}},capture:()=>{ke(),bt.cancel(),qe=void 0},business:()=>({key:M.document?.design.namedPlans?JSON.stringify([M.document.key,M.document.design.namedPlans.selected]):M.document?.key,design:M.document?.design,relatedChecks:M.tabs[0]?zl(M.tabs[0]):[],viewKey:oe()?.key,views:M.tabs.map(e=>({key:e.key,name:e.name,activity:Gi(e),object:Hi(e)})),activities:M.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:M.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:M.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!M.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=M.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{rs(e),$i(e)},openObject:e=>{qa(e),$i(e)},openOverview:()=>{M.tabs[0]&&(ke(),Ue?.reopenBusinessOverview(),M.active=M.tabs[0].key,Me(),Ae())},activateView:e=>{M.tabs.some(t=>t.key===e)&&(ke(),M.active=e,Me(),Ae())},statePanel:e=>M.document?ml(M.document.design,e,t=>{Ue?.activateBusiness(),rs(t),$i(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{M.nodeDrawer=!1,pt()},refresh:()=>{pt(),Qo.update()}});const hp=M;Me();tt();Sl().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])Ti(l);if(t.document){const l={...t.document};Ti(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)Ti(l)}const n=jl(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const l of i.tabs)Ti(l);if(new Set(i.tabs.map(l=>l.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(u=>typeof u=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(u=>Number.isFinite(u)&&u>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(u=>Number.isFinite(u)&&u>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(u=>Array.isArray(u)&&u.length===2&&u.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:r,scopeOutside:s,...d}=i,a=l=>({...l,hiddenNodes:l.hiddenNodes??(i.scopeOutside==="hide"?l.design.graph.nodes.filter(u=>u.scope===!1).map(u=>u.id):[])});M=Vt({...d,tabs:i.tabs.map(a)},n.recovery,n.document,i.tabs.map(l=>{const{design:u,checks:p,source:g,draft:c,edited:h,handle:m,name:f,...b}=a(l);return b})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(M.sampleLayout={...i.sampleLayout,hiddenNodes:sn(js).graph.nodes.filter(l=>l.scope===!1).map(l=>l.id)}),M.tabs.some(l=>l.key===M.active)||(M.active=M.tabs[0]?.key),oe()?.selected&&Zn(oe().selected),ds=M.document?.key,Me(),Ds=!0}).catch(()=>{M=hp,Jn=!0,Cs()}).finally(()=>{re=!1,Me(),tt(),qs().then(()=>{M.document?.key===ds&&Si()})});
