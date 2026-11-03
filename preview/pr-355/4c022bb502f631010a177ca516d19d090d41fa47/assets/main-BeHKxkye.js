import{L as Rr,D as oc,G as sc,W as rc,P as ac,l as Kn,X as Lr,C as cc,n as dc,S as Nr,o as Pr,p as Tr,M as qr,q as $r,s as Wr,t as ls,g as us,r as To,d as zr,b as Ui,u as ps,U as Ur,v as lc,w as Vr,x as Fr,y as qo,z as uc,m as fs,A as pc,B as Br,E as fc,j as mc,F as Xs,H as hc,T as bc,I as gc,J as yc,R as vc,K as wc,N as kc,O as Ic,Q as Sc,V as xc,Y as Ac,Z as Zs,k as Ec,i as Oc,h as jc,f as Cc,a as Dc,_ as Mc,$ as Rc,a0 as Gr,a1 as Lc,a2 as Nc,a3 as Pc,a4 as Tc,e as qc}from"./canvas-toolbar-DBjSxaGB.js";const $c={subsystems:{full:"サブシステム",icon:ac},business:{full:"業務設計",icon:rc},states:{full:"状態遷移",icon:sc},concept:{full:"データ構造",icon:oc},tests:{full:"テスト仕様",icon:Rr}};function $o(e,t,n){const i=$c[t],o=document.createElement("span"),r=document.createElement("span"),s=document.createElement("span");o.className="view-tab-label",r.className="view-tab-kind",r.setAttribute("aria-hidden","true"),r.append(Kn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),s.className="view-tab-name",s.textContent=n,o.append(r,s),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function Wo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Kn(Lr,{"aria-hidden":"true","stroke-width":1.8})),t}function Wc(e){const t=Kn(e?cc:dc,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function zc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,r=e.scrollLeft,s=Math.max(0,Math.min(n,r+i*o));s!==r&&(e.scrollLeft=s,t.preventDefault())},{passive:!1})}function Uc(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const Vc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Ys(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=Vc,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,r)=>{const s=Kn(o,{"stroke-width":1.8,"aria-hidden":"true"});r&&s.classList.add(r),t.querySelector(i)?.append(s)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Nr),n(".layout-lock",Pr,"lock-closed"),n(".layout-lock",Tr,"lock-open"),n(".zoom-out",qr),n(".zoom-in",$r)}function Qs(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Fc({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(u=>["",u.name+(u.responsibleSubsystemId&&u.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(l=>l.id===u.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),i=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(u=>[u.conceptId,{name:u.name,note:u.description,fields:u.fields.map(l=>["",l]),sources:u.sources,sourceActivities:u.sourceActivityIds}])),relations:a.graph.edges.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind])})),o=a=>i.find(u=>u.id===a),r=(a,u)=>{const l=Object.fromEntries(a.nodes.map(c=>[c.id,{...u[c.conceptId],name:c.name,note:c.description,sources:c.sources,conceptId:c.conceptId,subsystemId:c.subsystemId,fields:c.fields.map(h=>["",h.name])}])),p=e.subsystems.filter(c=>a.nodes.some(h=>h.subsystemId===c.id)).map(c=>({id:c.id,name:c.name})),g=a.handoffIds.map(c=>e.handoffs.find(h=>h.id===c)).map(c=>({id:c.id,from:c.fromSubsystemId,to:c.toSubsystemId,label:c.information,returning:c.flowDirection==="return"}));return{ids:a.nodes.map(c=>c.id),tables:l,edges:a.edges.map(c=>[c.fromViewId,c.toViewId,c.fromLabel,c.toLabel,c.kind]),regions:p,handoffs:g}};return{tables:t,edges:n,groups:i,findGroup:o,graph:a=>{const u=o(a);if(!u)throw Error("Unknown review group: "+a);const l=e.reviewGroups.find(c=>c.id===a),p=l.graph.subsystemViews;if(p)return r(p,u.concepts);const g=Object.keys(t).filter(c=>Object.hasOwn(u.concepts,c));return{ids:g,tables:u.concepts,edges:u.relations.filter(([c,h])=>g.includes(c)&&g.includes(h)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?r(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function dt(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Bc(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",dt(i,"span",t),i.onclick=n,e.append(i),i}function Gc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Hc(e,t,n,i=()=>{},o=()=>{},r=[]){const s=n.contentFor(t.id);if(e.replaceChildren(),!s)return;dt(e,"p",s.description).className="review-description",dt(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of s.relatedActivities){const u=document.createElement("li"),l=r.find(g=>g.id===a.id&&g.name===a.name),p=Bc(u,a.name,()=>{l&&o(l.id)});p.disabled=!l,p.setAttribute("aria-label",a.name+"を業務タブで開く"),d.append(u)}e.append(d),dt(e,"h3","情報の構造");for(const a of s.structureStatements){const u=document.createElement("section");u.className="review-structure",u.dataset.structure=a.id,dt(u,"h4",a.title),dt(u,"p",a.description),e.append(u)}dt(e,"h3","できること");for(const a of s.capabilities){const u=document.createElement("section");u.className="review-capability",u.dataset.capability=a.id,dt(u,"h4",a.title),dt(u,"p",a.description);for(const l of a.samples){const p=i(a.id,l.id),g=document.createElement("button");g.className="review-sample-link",g.type="button",g.dataset.sample=l.id,g.textContent=(p?.kind==="decision"?"可否判定：":"サンプル：")+l.name,p?g.onclick=p.open:(g.disabled=!0,g.title="対応するテスト仕様へのリンクがありません"),u.append(g)}e.append(u)}dt(e,"h3","できないこと（業務上のルール）");for(const a of s.limitations){const u=document.createElement("section");u.className="review-limitation",dt(u,"h4",a.title),dt(u,"p",a.description),dt(u,"h5","理由"),dt(u,"p",a.reason),e.append(u)}}function un(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function Jc({model:e,business:t}){const n=s=>s.kind==="group"?e.subsystems.find(d=>d.id===s.id):e.handoffs.find(d=>d.id===s.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(s){const d=n(s);return d?d.activityIds.map(a=>t.activities.find(u=>u.id===a)).filter(Boolean):[]}function r(s,d){if(s.replaceChildren(),d.kind==="group"){const p=e.subsystems.find(c=>c.id===d.id);if(!p)return"";un(s,"p",p.purpose),un(s,"h3","扱う情報");const g=s.ownerDocument.createElement("ul");for(const c of p.information)un(g,"li",c);return s.append(g),un(s,"h3","まとまりの理由"),un(s,"p",p.reason),p.name}const a=e.handoffs.find(p=>p.id===d.id);if(!a)return"";un(s,"p",a.description),un(s,"h3","出元と受取先");const u=e.subsystems.find(p=>p.id===a.fromSubsystemId),l=e.subsystems.find(p=>p.id===a.toSubsystemId);return un(s,"p",`${u.name} → ${l.name}`),a.information}return{sections:i,activities:o,describe:r}}function er(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const r=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},s=(d,a=!1)=>{if(o=Math.max(280,Math.min(r(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(r())),i.setAttribute("aria-valuenow",String(Math.round(o))),a)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),s(d.key==="Home"?280:d.key==="End"?r():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,u=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=l=>s(u+a-l.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),s(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>s(o));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>s(o)),s(o)}const _c=260,Kc=68,Xc="http://www.w3.org/2000/svg",zt=(e,t,n={})=>{const i=e.createElementNS(Xc,t);for(const[o,r]of Object.entries(n))i.setAttribute(o,String(r));return i};function Zc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Kn(Ur,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Yc(e,{model:t,business:n},i,o,r){const s=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(x=>{const I=s.find(j=>j.id===x.from),E=s.find(j=>j.id===x.to);if(!I||!E||I.subsystemId!==E.subsystemId||!t.presentation.reviewBoundaries.some(j=>j.from===x.from&&j.to===x.to))throw Error("Unknown overview relationship: "+x.from+" -> "+x.to);return x}),u=t.handoffs.map(x=>{if(!["forward","return"].includes(x.flowDirection))throw Error("Unknown overview handoff direction: "+x.id);return{id:x.id,from:x.fromSubsystemId,to:x.toSubsystemId,label:x.information,returning:x.flowDirection==="return"}});if(new Set(u.map(x=>x.id)).size!==u.length)throw Error("Duplicate overview handoff");for(const x of u)if(!d.some(I=>I.id===x.from)||!d.some(I=>I.id===x.to)||x.from===x.to||!x.label.trim())throw Error("Unknown overview handoff: "+x.id);for(const x of s){if(!d.some(I=>I.id===x.subsystemId))throw Error("Unknown overview subsystem: "+x.id);if(!n.roles?.some(I=>I.id===x.reviewer.roleId))throw Error("Unknown overview reviewer: "+x.id)}const l=d.flatMap(x=>s.filter(I=>I.subsystemId===x.id)),p=new Map;let g=0;for(const[x,I]of d.entries())for(const E of l.filter(j=>j.subsystemId===I.id))p.set(E.id,[80+g*170,100+g*120+x*64]),g++;const c=ls(),h="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,f;try{const x=JSON.parse(localStorage.getItem(h)||"null"),I=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),E=!x&&I?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,j=x??E;if(j){typeof j.zoom=="number"&&Number.isFinite(j.zoom)&&(c.zoom=Math.max(.25,Math.min(2.5,j.zoom))),Array.isArray(j.scroll)&&j.scroll.length===2&&j.scroll.every(L=>typeof L=="number"&&Number.isFinite(L))&&(c.scroll=j.scroll),typeof j.locked=="boolean"&&(c.locked=j.locked);for(const[L,Y]of Object.entries(j.positions??{}))s.some(V=>V.id===L)&&Array.isArray(Y)&&Y.length===2&&Y.every(V=>typeof V=="number"&&Number.isFinite(V))&&c.positions.set(L,[Y[0],Y[1]])}const $=j?.selection,N=$?.kind==="node"?t.concepts.find(L=>L.id===$.id)?.subsystemId:$?.id,R=$?.kind==="node"?"group":$?.kind;typeof N=="string"&&(R==="model"&&s.some(L=>L.id===N)||R==="group"&&d.some(L=>L.id===N)||R==="connection"&&u.some(L=>L.id===N))&&(f={kind:R,id:N}),f?.kind==="model"&&(c.selected=f.id)}catch{}const b=()=>{try{localStorage.setItem(h,JSON.stringify({zoom:c.zoom,scroll:c.scroll,locked:c.locked,positions:Object.fromEntries(c.positions),selection:f}))}catch{}},A=x=>{if(!x&&!f)return;f=x,c.selected=x?.kind==="model"?x.id:void 0;const I=m?.querySelector(".diagram-world>svg");I&&y(I),b()},y=x=>{const I=Ui(a,c.selected),E=Ui(u,f?.kind==="group"?f.id:void 0);for(const j of s){const $=x.querySelector(`[data-node="${j.id}"]`);$?.setAttribute("class","node graph-shape state-shape"+I.nodeClasses(j.id)),$?.setAttribute("aria-pressed",String(c.selected===j.id))}for(const j of d){const $=x.querySelector(`[data-subsystem="${j.id}"]`);$?.setAttribute("class","subsystem-overview-group"+E.nodeClasses(j.id)),$?.querySelector("button")?.setAttribute("aria-pressed",String(f?.kind==="group"&&f.id===j.id))}for(const j of a){const $=x.querySelector(`[data-overview-from="${j.from}"][data-overview-to="${j.to}"]`);$?.setAttribute("class","edge"+(I.related(j)?" review-related":"")),$?.setAttribute("marker-end",`url(#overview-${I.related(j)?"related-arrow":"arrow"})`)}for(const j of u){const $=E.related(j)||f?.kind==="connection"&&f.id===j.id,N=x.querySelector(`[data-handoff-id="${j.id}"]`);N?.setAttribute("class","edge"+(j.returning?" exception":"")+($?" review-related":"")),N?.setAttribute("marker-end",`url(#overview-${$?"related-arrow":"arrow"})`),x.querySelector(`[data-handoff-label="${j.id}"]`)?.classList.toggle("review-related",!!$)}x.querySelectorAll("[data-exception-paint]").forEach(j=>j.remove());for(const j of Array.from(x.querySelectorAll("[data-handoff-id].exception")))ps(x,j,{path:j.getAttribute("d")},{"data-overview-return-paint":j.getAttribute("data-handoff-id")})};return m=Wr(e,x=>{const I=l.map(R=>{const L=x.positions.get(R.id)??p.get(R.id);return{id:R.id,x:L[0],y:L[1],width:_c,height:Kc}}),E=zt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});E.append(us("overview-"));let j=0,$=0;const N=[];for(const R of d){const L=I.filter(ye=>s.find(Ie=>Ie.id===ye.id)?.subsystemId===R.id);if(!L.length)continue;const Y=Math.min(...L.map(ye=>ye.x))-30,V=Math.min(...L.map(ye=>ye.y))-48,Z=Math.max(...L.map(ye=>ye.x+ye.width))-Y+30,H=Math.max(...L.map(ye=>ye.y+ye.height))-V+30;N.push({id:R.id,x:Y,y:V,width:Z,height:H});const Q=zt(e,"g",{"data-subsystem":R.id,"aria-label":R.name}),oe=zt(e,"rect",{x:Y,y:V,width:Z,height:H,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});oe.addEventListener("click",()=>A({kind:"group",id:R.id})),Q.append(oe);const me=zt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:Y+8,y:V+3,width:Z-16,height:36}),de=e.createElement("button");de.type="button",de.className="subsystem-overview-region-title",de.setAttribute("aria-label",R.name+"を選択"),de.textContent=R.name,de.onclick=()=>A({kind:"group",id:R.id}),me.append(de),Q.append(me),E.append(Q),j=Math.max(j,Y+Z+40),$=Math.max($,V+H+40)}for(const[R,L]of u.entries()){if(!N.some(Q=>Q.id===L.from)||!N.some(Q=>Q.id===L.to))throw Error("Missing overview handoff region: "+L.id);const Y=Math.max(30,L.label.length*12),V=To({from:L.from,to:L.to,nodes:N,index:R,kind:"input",matrix:{returning:L.returning,captionLane:0},labelWidth:Y,labelHeight:18}),Z=zt(e,"path",{d:V.path,class:"edge"+(L.returning?" exception":""),"data-handoff-id":L.id,"data-from-subsystem":L.from,"data-to-subsystem":L.to,"data-flow-direction":L.returning?"return":"forward","marker-end":"url(#overview-arrow)"});E.append(Z);const H=zt(e,"text",{x:V.label[0]-Y/2,y:V.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":L.id});H.textContent=L.label,H.addEventListener("pointerdown",Q=>Q.stopPropagation()),H.addEventListener("pointerup",Q=>Q.stopPropagation()),H.addEventListener("click",()=>A({kind:"connection",id:L.id})),H.addEventListener("keydown",Q=>{(Q.key==="Enter"||Q.key===" ")&&(Q.preventDefault(),A({kind:"connection",id:L.id}))}),E.append(H),j=Math.max(j,V.bounds.right+40,V.label[0]+Y/2+30),$=Math.max($,V.bounds.bottom+40,V.label[1]+30)}for(const[R,L]of a.entries()){const Y=To({from:L.from,to:L.to,nodes:I,index:R,kind:"input",labelWidth:0,labelHeight:0}),V=zt(e,"path",{d:Y.path,class:"edge","data-overview-from":L.from,"data-overview-to":L.to,"marker-end":"url(#overview-arrow)"});E.append(V),j=Math.max(j,Y.bounds.right+40),$=Math.max($,Y.bounds.bottom+40)}for(const R of I){const L=s.find(Ie=>Ie.id===R.id),Y=n.roles.find(Ie=>Ie.id===L.reviewer.roleId),V=zt(e,"g",{role:"button",tabindex:0,"aria-label":L.title+"を選択","aria-pressed":"false","data-node":R.id,"data-review-group":R.id,"data-subsystem-id":L.subsystemId,class:"node graph-shape state-shape"}),Z=zr(e,R);Z.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),V.append(Z,zt(e,"rect",{x:R.x,y:R.y,width:R.width,height:R.height,rx:8,class:"state-diagram-node"}));const Q=zt(e,"foreignObject",{x:R.x,y:R.y,width:R.width,height:R.height}),oe=e.createElement("div");oe.className="subsystem-overview-card";const me=Zc(e,Y.color),de=e.createElement("span");de.className="subsystem-overview-labels",de.title=L.title+" — "+Y.name;for(const[Ie,q,B]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",L.title],["small","subsystem-overview-role",Y.name]]){const _=e.createElement(Ie);_.className=q,_.textContent=B,de.append(_)}const ye=e.createElement("button");ye.type="button",ye.className="subsystem-overview-open",ye.setAttribute("aria-label",L.title+"の詳細タブを開く"),ye.title="詳細タブを開く",ye.textContent="開く",ye.onpointerdown=Ie=>Ie.stopPropagation(),ye.onpointerup=Ie=>Ie.stopPropagation(),ye.onclick=Ie=>{Ie.stopPropagation(),o(L.id)},oe.append(me,de,ye),Q.append(oe),V.append(Q),V.addEventListener("click",()=>A({kind:"model",id:R.id})),V.addEventListener("keydown",Ie=>{(Ie.key==="Enter"||Ie.key===" ")&&(Ie.preventDefault(),A({kind:"model",id:R.id}))}),E.append(V)}return E.setAttribute("viewBox",`0 0 ${j} ${$}`),y(E),E},c,b,()=>A(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",b),m.addEventListener("pointerup",()=>queueMicrotask(b)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",b),{root:m,selected:()=>c.selected,selection:()=>f,restore:()=>{const x=()=>{const I=m.querySelector(".diagram-viewport");I.scrollLeft=c.scroll[0],I.scrollTop=c.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(x):x()}}}function Qc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const r=i.cells.find(s=>s.columnId===o.id);if(!r)throw Error("Missing sample cell: "+o.id);return r}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function ed({model:e,business:t}){const n=h=>{const m=t.activities.find(f=>f.id===h);if(!m)throw Error("Unknown activity: "+h);return m},i=h=>{const m=t.roles?.find(f=>f.id===h);if(!m)throw Error("Unknown role: "+h);return m.name},o=e.reviewGroups.map(h=>({id:h.id,title:h.title,description:h.description,reviewer:{role:i(h.reviewer.roleId)},relatedActivities:h.relatedActivityIds.map(m=>{const f=n(m);return{id:f.id,name:f.name}}),structureStatements:h.structureStatements,capabilities:h.capabilities.map(m=>({...m,samples:m.samples.map(Qc)})),limitations:h.limitations,meta:{questions:h.meta.questions}})),r=h=>o.find(m=>m.id===h),s=(h,m)=>r(h)?.capabilities.find(f=>f.samples.some(b=>b.id===m)),d=o.flatMap(h=>h.capabilities.flatMap(m=>m.samples.map(f=>({...f,group:h.id})))),a=["yellow","cyan","green","blue","purple","orange"];function u(h,m,f){let b=f.get(m);if(b||(b=a[f.size]??`extra-${f.size}`,f.set(m,b)),h.dataset.sampleKey=m,h.dataset.keyTone=b,h.className="data-example-key",b.startsWith("extra-")){const A=(Number(b.slice(6))*137.508%360).toFixed(2);h.style.setProperty("--sample-key-extra-light",`hsl(${A} 26% 78%)`),h.style.setProperty("--sample-key-extra-dark",`hsl(${A} 24% 25%)`)}}const l=h=>d.filter(m=>m.group===h),p=(h,m)=>l(h).find(f=>f.id===m);function g(h,m,f){const b=h.ownerDocument.createElement(m);return b.textContent=f,h.append(b),b}function c(h,m,f,b,A){const y=h.ownerDocument,S=p(m.id,f);if(!S)throw Error("Unknown data example: "+f);h.replaceChildren(),h.dataset.dataExample=f;const x=new Map;e.presentation.sampleCaption&&(g(h,"p",e.presentation.sampleCaption).className="data-example-caption");const I=r(m.id)?.capabilities??[],E=A?.capabilityId?I.filter(L=>L.id===A.capabilityId):I;if(A?.capabilityId&&!E.some(L=>L.samples.some(Y=>Y.id===f)))throw Error("Sample does not belong to capability: "+f);const j=s(m.id,f);h.dataset.capability=j.id;const $=()=>{g(h,"h2",A?.heading?.trim()||j.title),A?.renderSpecification?A.renderSpecification(h):g(h,"p",j.description).className="data-example-capability"};A?.capabilityId&&!A.hideCapability&&$();const N=y.createElement("label");N.className="data-example-picker",g(N,"span","場面");const R=y.createElement("select");R.setAttribute("aria-label","データ例の場面");for(const L of E){let Y=R;if(!A?.capabilityId){const V=y.createElement("optgroup");V.label=L.title,R.append(V),Y=V}for(const V of L.samples){if(A?.sampleIds&&!A.sampleIds.includes(V.id))continue;const Z=y.createElement("option");Z.value=V.id,Z.textContent=V.name,Y.append(Z)}}if(R.value=f,R.onchange=()=>b(R.value),N.append(R),(!A?.hideSinglePicker||R.options.length>1)&&h.append(N),!A?.capabilityId&&!A?.hideCapability&&$(),g(h,"h3",S.name).className="data-example-scene",A?.collapseScenario&&S.when){const L=y.createElement("details");L.className="data-example-context",g(L,"summary","場面の背景"),g(L,"p",S.when).className="data-example-when",h.append(L)}else g(h,"p",S.when).className="data-example-when";g(h,"p",S.meaning).className="data-example-meaning";for(const L of S.blocks){const Y=y.createElement("section");Y.className="data-example-block",Y.dataset.exampleCard=L.card,g(Y,"h3",m.concepts[L.card].name);const V=y.createElement("div");V.className="data-example-table",V.tabIndex=0,V.setAttribute("role","region"),V.setAttribute("aria-label",m.concepts[L.card].name+"のデータ表");const Z=y.createElement("table");Z.setAttribute("aria-label",m.concepts[L.card].name+"のデータ例");const H=y.createElement("caption");H.textContent=m.concepts[L.card].name+"に入る情報",Z.append(H);const Q=y.createElement("thead"),oe=y.createElement("tr");for(const de of L.columns)g(oe,"th",de).setAttribute("scope","col");Q.append(oe),Z.append(Q);const me=y.createElement("tbody");for(const[de,ye]of L.rows.entries()){const Ie=y.createElement("tr");for(const[q,B]of ye.entries()){const _=g(Ie,"td",String(B)),be=L.keyIds[de][q];be&&(u(_,be,x),_.title=L.columns[q]+"："+B)}me.append(Ie)}Z.append(me),V.append(Z),Y.append(V),L.rows.length||g(Y,"p",L.empty??"データはありません。"),h.append(Y)}S.note&&(g(h,"p",S.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:r,capabilityFor:s,examplesFor:l,findDataExample:p,renderDataExample:c}}function ms(e,t){const n=e.model?.business,i=n?.activities.find(r=>r.id===t);if(!i||"performers"in i)return;const o=typeof i.who=="object"&&i.who?.kind==="role"?i.who.roleId:"roleId"in i?i.roleId:void 0;return o?n?.roles?.find(r=>r.id===o):void 0}function td(e,t,n){const i=e.model?.business.activities.find(o=>o.id===t);return i&&"who"in i&&typeof i.who=="object"&&i.who&&(i.who.kind==="system"||i.who.kind==="scheduler")?i.who.kind+":"+i.who.name:ms(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function nd(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function et(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,r;const s=(d,a)=>{for(const u of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(u.startsWith("**")&&u.endsWith("**")){const l=document.createElement("strong");l.textContent=u.slice(2,-2),d.append(l)}else if(u.startsWith("`")&&u.endsWith("`")){const l=document.createElement("code");l.textContent=u.slice(1,-1),d.append(l)}else d.append(document.createTextNode(u))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!i){i=a[1],r=void 0;const g=document.createElement("pre");o=document.createElement("code"),g.append(o),n.append(g);continue}if(a&&a[1][0]===i[0]&&a[1].length>=i.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",r=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){r=void 0;continue}const u=/^(#{1,6}) (.*)$/.exec(d),l=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(l){r||(r=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(r));const g=document.createElement("li");s(g,l[1]),r.append(g);continue}r=void 0;const p=document.createElement(u?"h"+u[1].length:"p");s(p,u?u[2]:d),n.append(p)}return t&&n.querySelector("h1")?.remove(),n}function zo(e,t,n){if(t.performers===null)return"未決";const i=n===void 0?t.performers:n===null?t.performers.length===1?t.performers:[]:t.performers.filter(o=>n.includes(o.objectId));return i.length?i.map(o=>{const r=e.objects.find(d=>d.id===o.objectId).name,s=o.roleIds.map(d=>e.roles.find(a=>a.id===d).name);return s.length?`${r}（旧Role：${s.join("・")}）`:r}).join("、"):"未決"}function En(e,t){if("performers"in t)return"未決";if(typeof t.who=="string")return e.roles?.find(i=>"roleId"in t&&i.id===t.roleId)?.name??t.who;const n=t.who;return n?n.kind==="role"?e.roles?.find(i=>i.id===n.roleId)?.name??"未決":n.name:"未決"}function Hr(e,t){return t.dataId!==void 0?e.data?.find(n=>n.id===t.dataId)?.name??"未決":t.label??""}function id(e){const t=[];for(const n of e.activities){if(!("performers"in n))continue;const i=(u,l,p,g)=>t.push({id:`viewer:${u}:${n.id}`,displayId:"構造の要確認（表示のみ）",kind:l,status:"open",scope:"items",targets:[n.id],targetNames:[n.name],summary:p,content:g,unresolvedTargets:[]}),o=n.performers??[],r=new Set(o.flatMap(u=>u.roleIds)),s=[...o.length>1?["複数の担当Object"]:[],...r.size>1?["複数Role"]:[]];i("who",s.length?"correction":"question",s.length?`旧形式に${s.join("と")}があります。`:"Whoは未決です。",`旧形式の担当情報：${zo(e,n)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityの単一のWhoを、Role・システム・スケジューラーを含めて確認してください。入力や出力の相手からは決められません。`);const d=n.procedure.steps.filter(u=>u.performerObjectIds===null&&n.performers?.length!==1),a=n.procedure.steps.filter(u=>u.performerObjectIds!==null&&(u.performerObjectIds.length!==o.length||u.performerObjectIds.some(l=>!o.some(p=>p.objectId===l))));(d.length||a.length)&&i("steps",a.length?"correction":"question",a.length?"旧形式の手順の担当情報が異なります。":"旧形式の担当情報が未決の手順があります。",[d.length?`旧形式の担当情報が未決：${d.map(u=>u.text).join("、")}。`:"",a.length?`Activityと異なる旧形式の担当情報：${a.map(u=>u.text).join("、")}。責任境界が変わる場合はActivityの分割を検討してください。`:""].join(""))}return t}const it=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n},tr=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]),nr=(e,t,n)=>e.slice(0,n+1).every((i,o)=>tr(i)===tr(t[o]));function Jr(e,t){return e.kind!=="value"?e.kind==="else"?"それ以外":e.kind==="any"?"不問":"未決":typeof e.value=="boolean"?e.value?t.trueLabel??"true":t.falseLabel??"false":String(e.value)+(typeof e.value=="number"?t.unit??"":"")+{is:"",eq:"",gte:"以上",lte:"以下",gt:"超",lt:"未満"}[e.operator]}function od(e){return e.rows.map((t,n)=>e.axes.map((i,o)=>{if(n>0&&nr(e.rows[n-1].conditions,t.conditions,o))return 0;let r=1;for(;n+r<e.rows.length&&nr(t.conditions,e.rows[n+r].conditions,o);)r++;return r}))}function hs(e,t){const n=it("div");n.dataset.businessDecisionScroll="",n.tabIndex=0,n.setAttribute("role","region"),n.setAttribute("aria-label",e.title);const i=it("table");i.dataset.businessDecisionTable="";const o=it("thead"),r=it("tr"),s=it("th","条件");s.colSpan=e.axes.length,s.scope="colgroup",r.append(s);for(const p of["結果","Check"]){const g=it("th",p);g.rowSpan=2,g.scope="col",p==="結果"&&(g.dataset.decisionResult=""),r.append(g)}o.append(r);const d=it("tr");for(const p of e.axes){const g=it("th",p.name);g.scope="col",d.append(g)}o.append(d),i.append(o);const a=it("tbody"),u=od(e);let l=!1;for(const[p,g]of e.rows.entries()){const c=it("tr");c.dataset.decisionRow=g.id,g.conditions.forEach((f,b)=>{const A=u[p][b];if(!A)return;const y=it("td",Jr(f,e.axes[b]));A>1&&(y.rowSpan=A),c.append(y)});const h=it("td",g.result.text??"未決");h.dataset.decisionResult="",h.dataset.resultKind=g.result.kind,c.append(h);const m=g.checkRefs.map(f=>{const b=t.flatMap(A=>A.items).find(A=>A.id===f.checkId);return f.coverage==="partial"&&(l=!0),(b?.checkId??f.checkId)+(f.coverage==="partial"?"*":"")});c.append(it("td",m.join("、")||"—")),a.append(c)}if(i.append(a),n.append(i),l){const p=it("p","*：この業務で扱う範囲のみ");p.className="decision-footnote",n.append(p)}return n}function bs(e,t,n){return[...new Set(e.rows.flatMap(o=>o.result.exceptionIds))].flatMap(o=>{const r=t.exceptions?.find(a=>a.id===o);if(!r)return[];const s=n.flatMap(a=>a.items).filter(a=>Object.values(a.fields).some(u=>u.some(l=>l.kind==="reference"&&l.targetId===o))).map(a=>a.checkId),d=it("p",r.description+(s.length?" （"+[...new Set(s)].join("、")+"）":""));return d.className="decision-exception",[d]})}const xe={type:"string"},W={type:"string",minLength:1,pattern:"\\S"},T={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Se=e=>({anyOf:[e,{type:"null"}]}),F=e=>({type:"array",items:e}),z=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),sd=e=>({$ref:"#/$defs/"+e}),Wn=F({anyOf:[z({kind:{enum:["text"]},value:xe}),z({kind:{enum:["reference"]},targetId:T,label:xe}),z({kind:{enum:["link"]},uri:W,label:xe})]}),Vi=z({id:T,name:W,scope:{type:"boolean"}}).properties,gs=z({id:T,kind:{enum:["input","output","business-exception","object-exception"]},fromId:T,toId:T,label:W}),rd=z({id:T,sourceId:T,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:F(T),unresolvedTargets:F(W),summary:W,content:W}),Uo=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:W,title:W,preface:xe,scope:xe,objects:F(z({...Vi,icon:W,information:F(W)})),activities:F(z({...Vi,why:W,when:W,who:W,where:W,procedure:W,exception:Se(W),result:W,problem:Se(W),painLevel:Se({enum:["Low","Medium","High"]})})),relations:F(gs),findings:F(rd)}),ad=z({id:T,name:W,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),_r=z({...Uo.properties,schemaVersion:{enum:["0.2"]},roles:F(ad),activities:F(z({...Uo.properties.activities.items.properties,roleId:Se(T)}))}),eo=z({..._r.properties,schemaVersion:{enum:["0.3"]},exceptions:F(z({id:T,activityId:T,name:W,description:xe}))}),lt=e=>({...F(e),minItems:1}),Kr=z({id:T,name:W,description:xe}),ys={anyOf:[z({kind:{enum:["before"]},beforeId:T,afterId:T}),z({kind:{enum:["interchangeable"]},stepIds:{...F(T),minItems:2}})]},Xr=Object.fromEntries(Object.entries(eo.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),cd=z({objectId:T,roleIds:F(T)}),dd=z({id:T,text:W,obligation:{enum:["required","optional"]},appliesWhen:Se(W),performerObjectIds:Se(lt(T))}),Zr=z({id:T,name:W,items:lt(z({informationId:T,condition:Se(W)}))}),ld=z({...eo.properties,schemaVersion:{enum:["0.4"]},objects:F(z({...Vi,icon:W,information:F(Kr)})),activities:lt(z({...Xr,performers:Se(lt(cd)),procedure:z({steps:lt(dd),orderRules:F(ys)}),results:lt(z({id:T,text:W}))})),data:F(Zr),relations:F({anyOf:[z({id:T,kind:{enum:["input","output"]},fromId:T,toId:T,dataId:T}),z({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),ud={anyOf:[z({kind:{enum:["role"]},roleId:T}),z({kind:{enum:["system","scheduler"]},name:W}),{type:"null"}]},pd={anyOf:[z({kind:{enum:["interaction"]},phase:Se({enum:["request","response","not-applicable"]}),direction:{enum:["input","output"]},objectId:T,dataIds:Se(F(T)),relationId:Se(T),pairedStepId:Se(T)}),z({kind:{enum:["internal"]}}),z({kind:{enum:["unresolved"]}})]},ir={anyOf:[z({kind:{enum:["who"]}}),z({kind:{enum:["object"]},objectId:T})]},fd=z({from:Se(ir),to:Se(ir)}),Vo=z({id:T,action:W,method:Se(W),whatDataIds:Se(F(T)),legacyText:W,obligation:{enum:["required","optional"]},appliesWhen:Se(W),effect:Se({enum:["create","read","update","delete","not-applicable","undecided"]}),exchange:pd,parties:fd},["id","action","method","whatDataIds","obligation","appliesWhen","effect","exchange"]),md=z({trigger:Se(W),onInterrupt:Se(W),outcome:Se({enum:["resume","continue","end"]}),resumeCondition:Se(W),resumeAction:Se(W),interruptedAtStepId:Se(T),resumeAtStepId:Se(T),retainedDataIds:Se(F(T))}),hd=z({id:T,activityId:T,name:W,description:xe,continuity:md},["id","activityId","name","description"]),or={...Vi,scope:Se({type:"boolean"})},Fo=z({...eo.properties,schemaVersion:{enum:["0.5"]},objects:F(z({...or,icon:W,information:F(Kr)})),activities:lt(z({...Xr,...or,who:ud,procedure:z({steps:lt(Vo),orderRules:F(ys)}),results:lt(z({id:T,text:W}))})),exceptions:F(hd),data:F(Zr),relations:F({anyOf:[z({id:T,kind:{enum:["input","output"]},fromId:T,toId:T}),z({...gs.properties,kind:{enum:["business-exception","object-exception"]}})]})}),bd={anyOf:[W,{type:"number"},{type:"boolean"}]},gd={anyOf:[z({axisId:T,kind:{enum:["value"]},operator:{enum:["is","eq","gte","lte","gt","lt"]},value:bd}),...["else","any","undecided"].map(e=>z({axisId:T,kind:{enum:[e]}}))]},yd=z({id:T,name:W,dataIds:F(T),unit:xe,trueLabel:W,falseLabel:W},["id","name","dataIds"]),vd=z({kind:{enum:["accepted","error","value","undecided"]},text:Se(W),dataIds:F(T),exceptionIds:F(T)}),wd=z({id:T,conditions:lt(gd),result:vd,checkRefs:F(z({checkId:T,coverage:{enum:["full","partial"]}}))}),Yr=z({decisionId:T,rowId:T}),kd=z({id:T,title:W,kind:{enum:["authorization","validation","algorithm"]},note:Se(W),appliesWhen:Se(Yr),axes:lt(yd),rows:lt(wd)}),Id=z({...Vo.properties,decisionIds:F(T),whenDecision:Se(Yr)},[...Vo.required,"decisionIds","whenDecision"]),Sd=z({...Fo.properties,schemaVersion:{enum:["0.6"]},activities:lt(z({...Fo.properties.activities.items.properties,procedure:z({steps:lt(Id),orderRules:F(ys)}),decisions:F(kd)}))}),xd=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Wn])),Ad=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:W,title:W,basedOn:z({documentId:T,revision:W,verification:{enum:["unverified"]}}),intro:Wn,index:F(z({activityId:T,purpose:xe,connections:xe,checkIds:F(T)})),sections:F(z({id:T,activityId:Se(T),title:W,preamble:Wn})),guarantees:F(z({id:T,sectionId:T,title:W,blocks:F({anyOf:[z({kind:{enum:["prose"]},content:Wn}),z({kind:{enum:["example"]},exampleId:T})]})})),examples:F(z({id:T,guaranteeId:T,columns:F(W),rows:F(F(Wn))})),items:F(z({id:T,checkId:T,title:W,detailSummary:xe,sectionId:T,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:z(xd,[])})),notes:F(z({id:T,title:W,content:Wn}))}),vs=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:W,title:W,basedOn:z({documentId:T,revision:W,verification:{enum:["unverified"]}}),objectId:T,states:F(z({id:T,name:W})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:W,transitions:F(z({id:T,sourceId:W,fromId:W,activityId:T,event:Se(W),exception:Se(W),condition:W,toId:W,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:W,note:W}))}),sr=Object.fromEntries(Object.entries({...vs.properties.transitions.items.properties,exceptionId:Se(T)}).filter(([e])=>e!=="exception")),Ed=z({...vs.properties,schemaVersion:{enum:["0.2"]},transitions:F(z({...sr,conditionLabel:W},Object.keys(sr)))}),ws=z({documentId:T,revision:W,targetType:W,targetId:T,section:W}),Od=z({id:T,name:W,responsibilityStatus:W,responsibleSubsystemId:T},["id","name"]),jd=z({id:T,name:W,subsystemId:T,information:F(Od),reason:xe,description:xe,businessObjectIds:F(T),activityLinks:F(z({activityId:T,uses:F(W)})),sourceRefs:F(ws),reviewState:W}),Cd=z({id:T,fromConceptId:T,toConceptId:T,fromPerTarget:W,toPerSource:W,condition:xe,reviewState:W,sourceRefs:F(ws),fromLabel:W,toLabel:W,kind:{enum:["down","reference"]}}),Dd=z({id:T,name:W,purpose:xe,information:F(W),reason:xe,activityIds:F(T),reviewState:W}),Md=z({id:T,fromSubsystemId:T,toSubsystemId:T,information:W,description:xe,activityIds:F(T),flowDirection:{enum:["forward","return"]},reviewState:W}),Rd=z({columnId:T,value:{anyOf:[xe,{type:"number"}]},linkId:W},["columnId","value"]),Ld=z({card:T,columns:F(z({id:T,name:W,informationId:T})),rows:F(z({id:T,cells:F(Rd)})),empty:xe},["card","columns","rows"]),Bo=z({id:T,name:W,when:xe,meaning:xe,blocks:F(Ld),note:xe},["id","name","when","meaning","blocks"]),Go=z({id:T,title:W,description:xe,meta:{},samples:F(Bo)}),Nd=z({...Bo.properties,checkIds:{...F(T),minItems:1,uniqueItems:!0}},[...Bo.required,"checkIds"]),Pd=z({decisionExampleIds:F(T),decisionCheckIds:F(T),resultCheckIds:F(T),sampleIds:F(T)}),Td=z({...Go.properties,samples:F(Nd),testSpecification:Pd},[...Object.keys(Go.properties)]),qd=z({id:T,title:W,description:xe,reason:xe,meta:{}}),$d=z({conceptId:T,name:W,fields:F(W),description:xe,sources:F(W),sourceActivityIds:F(T)}),Wd=z({id:T,fromConceptId:T,toConceptId:T,relationIds:F(T),scope:xe,fromLabel:W,toLabel:W,kind:{enum:["down","reference"]}}),zd=z({id:T,conceptId:T,subsystemId:T,name:W,description:xe,sources:F(W),fields:F(z({name:W,informationId:T}))}),Ud=z({id:T,fromViewId:T,toViewId:T,relationIds:F(T),fromLabel:W,toLabel:W,kind:{enum:["down","reference"]}}),Qr=z({nodes:F(zd),edges:F(Ud),handoffIds:F(T)}),ea=z({id:T,subsystemId:T,title:W,description:xe,reviewer:z({roleId:T}),relatedActivityIds:F(T),graph:z({conceptIds:F(T),nodes:F($d),edges:F(Wd),subsystemViews:Qr},["conceptIds","nodes","edges"]),structureStatements:F(z({id:T,title:W,description:xe,sampleIds:F(T),sourceRefs:F(ws)})),capabilities:F(Go),limitations:F(qd),meta:z({questions:F(W),hypotheses:{}},["questions"])}),Vd=z({...ea.properties,capabilities:F(Td)}),ta=z({id:T,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:W,basedOn:z({documentId:T,revision:W,verification:{enum:["unverified"]}}),relatedStates:F(z({documentId:T,revision:W,verification:{enum:["unverified"]}})),subsystems:F(Dd),concepts:F(jd),relations:F(Cd),handoffs:F(Md),reviewGroups:F(ea),benefits:F(W),considerations:F(W),reviewPoints:F(W),meta:{},presentation:z({activityViews:{},creatorActivityIds:{},sampleCaption:xe,subsystemViews:Qr,landscapeRelationships:F(z({from:T,to:T})),reviewBoundaries:F(z({from:T,to:T,label:xe,promise:xe}))},["landscapeRelationships","reviewBoundaries"])}),Fd=z({...ta.properties,schemaVersion:{enum:["0.2"]},reviewGroups:F(Vd)}),An=(e,t)=>z({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:W,documents:F({anyOf:t.map(sd)}),sources:F(z({documentId:T,revision:W,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:xe})),externalDocuments:F(z({id:T,kind:{enum:["businessDesign"]},revision:W,activities:F(z({id:T,name:W}))})),diagnostics:F(W)}),di={anyOf:[An("0.1",["businessDesign","checkItems"]),An("0.2",["businessDesign","checkItems","stateTransition"]),An("0.3",["businessDesignRoles","checkItems","stateTransition"]),An("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.5",["oldStructuredBusinessDesign","checkItems","stateTransitionStructured"]),An("0.6",["procedureBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),An("0.7",["decisionBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Uo,businessDesignRoles:_r,businessDesignStructured:eo,oldStructuredBusinessDesign:ld,procedureBusinessDesign:Fo,decisionBusinessDesign:Sd,checkItems:Ad,stateTransition:vs,stateTransitionStructured:Ed,conceptModel:ta,checkedConceptModel:Fd}},ot=(e,t)=>P(new Set(e).size===e.length,t),Cn=(e,t)=>P(e.length>0,t),rr=e=>JSON.stringify(e.kind==="value"?[e.axisId,e.kind,e.operator,e.value]:[e.axisId,e.kind]);function Bd(e,t){const n=e.procedure.steps,i=n.map(u=>u.id),o=new Map(i.map(u=>[u,[]])),r=new Set,s=new Set,d=[];Cn(n,"Procedure requires a Step: "+e.id);for(const u of e.procedure.orderRules)if(u.kind==="before"){t(u.beforeId,"step",e.id),t(u.afterId,"step",e.id),P(u.beforeId!==u.afterId,"Self Step order");const l=JSON.stringify([u.beforeId,u.afterId]);P(!r.has(l),"Duplicate Step order"),r.add(l),P(i.indexOf(u.beforeId)<i.indexOf(u.afterId),"Standard Step order contradicts before constraint"),o.get(u.beforeId).push(u.afterId)}else{P(u.stepIds.length>=2,"Interchangeable group requires two Steps"),ot(u.stepIds,"Duplicate interchangeable Step");for(const p of u.stepIds)t(p,"step",e.id);const l=JSON.stringify([...u.stepIds].sort());P(!s.has(l),"Duplicate interchangeable group"),s.add(l),d.push(u.stepIds)}const a=(u,l)=>{const p=[u],g=new Set;for(;p.length;){const c=p.pop();if(!g.has(c)){g.add(c);for(const h of o.get(c)){if(h===l)return!0;p.push(h)}}}return!1};for(const u of i)P(!a(u,u),"Step order cycle");for(const u of d)for(const l of u)for(const p of u)l!==p&&P(!a(l,p),"Interchangeable Steps conflict with before constraint")}function na(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&P(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};ot(e.roles.map(o=>o.name),"Duplicate Role name"),P(e.roles.every(o=>o.name===o.name.trim()&&!/[\r\n]/.test(o.name)),"Invalid Role name"),ot(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){P(o.name===o.name.trim(),"Data name whitespace"),Cn(o.items,"Data requires Information: "+o.id),ot(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities)Cn(o.results,"Activity requires Result: "+o.id),Bd(o,i);return i}function Gd(e,t,n,i,o){for(const r of e.activities){const s=d=>{const a=i(d.decisionId,"decision",r.id);return i(d.rowId,"decision-row",a.id),a};for(const d of r.procedure.steps){ot(d.decisionIds,"Duplicate Step decision");for(const a of d.decisionIds)i(a,"decision",r.id);d.whenDecision&&s(d.whenDecision)}for(const d of r.decisions){Cn(d.axes,"Decision requires a condition axis: "+d.id),Cn(d.rows,"Decision requires a row: "+d.id),d.appliesWhen&&(s(d.appliesWhen),P(d.appliesWhen.decisionId!==d.id,"Decision cannot depend on itself: "+d.id));for(const a of d.axes){ot(a.dataIds,"Duplicate decision axis Data");for(const u of a.dataIds)i(u,"data");P(a.trueLabel===void 0==(a.falseLabel===void 0),"Boolean labels must be paired: "+a.id)}for(const[a,u]of d.rows.entries()){P(u.conditions.length===d.axes.length,"Decision row must cover every axis: "+u.id);for(const[l,p]of u.conditions.entries())if(P(p.axisId===d.axes[l].id,"Decision condition axis/order mismatch: "+u.id),p.kind==="value"&&["gte","lte","gt","lt"].includes(p.operator)&&P(typeof p.value=="number","Ordered comparison requires a number: "+u.id),p.kind==="undecided"&&P(u.result.kind==="undecided","Undecided condition cannot assert an outcome: "+u.id),p.kind==="else"){const g=JSON.stringify(u.conditions.slice(0,l).map(rr));P(d.rows.slice(0,a).some(c=>JSON.stringify(c.conditions.slice(0,l).map(rr))===g&&c.conditions[l]?.kind==="value"),"Else needs an earlier branch in the same context: "+u.id)}P(u.result.kind==="undecided"||u.result.text!==null,"Known decision result needs a description: "+u.id),u.result.kind==="undecided"&&o.push("業務判断未決: "+u.id),ot(u.result.dataIds,"Duplicate decision result Data");for(const l of u.result.dataIds)i(l,"data");ot(u.result.exceptionIds,"Duplicate decision exception");for(const l of u.result.exceptionIds){const p=i(l,"exception");P(p.activityId===r.id,"Decision exception Activity mismatch: "+l)}ot(u.checkRefs.map(l=>l.checkId),"Duplicate decision Check");for(const l of u.checkRefs){n(l.checkId,"check");const p=t.map.get(t.owner.get(l.checkId));P(p?.kind==="checkItems"&&p.basedOn.documentId===e.id&&p.basedOn.revision===e.revision,"Decision Check source mismatch: "+l.checkId),P(p.index.some(g=>g.activityId===r.id&&g.checkIds.includes(l.checkId)),"Decision Check Activity mismatch: "+l.checkId)}}}for(const d of r.decisions){const a=new Set;let u=d;for(;u.appliesWhen;)P(!a.has(u.id),"Decision dependency cycle: "+d.id),a.add(u.id),u=s(u.appliesWhen)}}}function Hd(e,t,n){const i=na(e,t,n);for(const o of e.activities){if(o.performers!==null){Cn(o.performers,"Empty performers"),ot(o.performers.map(s=>s.objectId),"Duplicate performer");for(const s of o.performers){i(s.objectId,"object"),ot(s.roleIds,"Duplicate performer Role");for(const d of s.roleIds)i(d,"role")}}let r=o.performers===null;for(const s of o.procedure.steps)if(s.performerObjectIds!==null){Cn(s.performerObjectIds,"Empty Step performers"),ot(s.performerObjectIds,"Duplicate Step performer");for(const d of s.performerObjectIds)P(o.performers?.some(a=>a.objectId===d),"Step performer outside Activity assignment: "+d)}else o.performers?.length!==1&&(r=!0);r&&P(e.findings.some(s=>s.status==="open"&&s.scope==="items"&&s.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id)}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}function Jd(e,t,n,i){const o=na(e,t,n),r=new Map(e.activities.flatMap(s=>s.procedure.steps.map(d=>[d.id,{activity:s,step:d}])));e.schemaVersion==="0.6"&&Gd(e,t,n,o,i);for(const s of e.exceptions){const d=s.continuity;if(d){for(const a of[d.interruptedAtStepId,d.resumeAtStepId])a!==null&&o(a,"step",s.activityId);if(d.retainedDataIds!==null){ot(d.retainedDataIds,"Duplicate retained Data");for(const a of d.retainedDataIds)o(a,"data")}}}for(const s of e.objects)s.scope===null&&i.push("Scope未確定: "+s.id);for(const s of e.activities){s.scope===null&&i.push("Scope未確定: "+s.id),s.who===null?i.push("Who未確定: "+s.id):s.who.kind==="role"&&o(s.who.roleId,"role");for(const d of s.procedure.steps){if(d.parties)for(const u of[d.parties.from,d.parties.to])u?.kind==="object"&&o(u.objectId,"object");if(d.whatDataIds===null)i.push("対象Data未確定: "+d.id);else{ot(d.whatDataIds,"Duplicate Step target Data");for(const u of d.whatDataIds)o(u,"data")}const a=d.exchange;if(a.kind==="unresolved"){i.push("やり取り未確定: "+d.id);continue}if(a.kind!=="internal"){if(o(a.objectId,"object"),a.phase===null&&i.push("Request/Response未確定: "+d.id),a.dataIds===null)i.push("Data未確定: "+d.id);else{ot(a.dataIds,"Duplicate Step Data");for(const u of a.dataIds)o(u,"data")}if(a.relationId!==null){const u=o(a.relationId,"relation"),l=a.direction==="input";P(u.kind===a.direction&&u.fromId===(l?a.objectId:s.id)&&u.toId===(l?s.id:a.objectId),"Step relation direction/endpoint mismatch: "+d.id)}if(a.pairedStepId!==null){const u=r.get(a.pairedStepId);P(u&&u.activity.id===s.id&&u.step.id!==d.id,"Invalid paired Step: "+d.id);const l=u.step.exchange;P(l.kind==="interaction"&&["request","response"].includes(a.phase)&&["request","response"].includes(l.phase)&&l.phase!==a.phase&&l.direction!==a.direction&&l.objectId===a.objectId,"Request/Response mismatch: "+d.id)}}}}}function _d(e){const t=new Map(e.data.map(o=>[o.id,o])),n=new Map,i=[];for(const o of e.activities)for(const r of o.procedure.steps){const s=r.exchange,d=new Map,a=(h,m)=>{let f=d.get(h);if(!f){const b=t.get(h);P(b,"Unknown Data during projection: "+h),f={id:b.id,name:b.name,uses:[]},d.set(h,f)}f.uses.includes(m)||f.uses.push(m)};for(const h of r.whatDataIds??[])a(h,"target");if(s.kind==="interaction")for(const h of s.dataIds??[])a(h,"transferred");const u={activityId:o.id,stepId:r.id,action:r.action,method:r.method,data:[...d.values()],targetDataUndecided:r.whatDataIds===null,obligation:r.obligation,appliesWhen:r.appliesWhen,effect:r.effect,...r.parties?{parties:r.parties}:{}};if(s.kind!=="interaction"){i.push({...u,kind:s.kind,from:s.kind==="internal"?{kind:"who",activityId:o.id}:null,to:null});continue}const l={kind:"who",activityId:o.id},p={kind:"object",objectId:s.objectId};i.push({...u,kind:s.kind,from:s.direction==="output"?l:p,to:s.direction==="output"?p:l,objectId:s.objectId,direction:s.direction,phase:s.phase,dataIds:s.dataIds,relationId:s.relationId,pairedStepId:s.pairedStepId});const g=JSON.stringify([o.id,s.objectId,s.direction]);n.has(g)||n.set(g,{activityId:o.id,objectId:s.objectId,direction:s.direction,stepIds:[],relationIds:[],data:[]});const c=n.get(g);c.stepIds.push(r.id),s.relationId!==null&&!c.relationIds.includes(s.relationId)&&c.relationIds.push(s.relationId),s.dataIds===null&&(c.transferUndecided=!0);for(const h of s.dataIds??[])if(!c.data.some(m=>m.id===h)){const m=t.get(h);P(m,"Unknown Data during projection: "+h),c.data.push({id:m.id,name:m.name})}}return{rows:i,edges:[...n.values()].map(o=>({...o,label:o.data.map(r=>r.name).join(" / ")}))}}const P=(e,t)=>{if(!e)throw Error(t)};function ia(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const r=t++;for(;t<e.length;){const s=e[t++];if(s==='"')return JSON.parse(e.slice(r,t));s==="\\"&&t++}throw Error("Unclosed JSON string")},o=(r=0)=>{P(r<=64,"JSON depth limit"),n();const s=e[t];if(s==='"'){i();return}if(s==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),P(e[t]==='"',"JSON object key required");const u=i();P(!a.has(u),"Duplicate JSON key: "+u),a.add(u),n(),P(e[t++]===":","JSON colon required"),o(r+1),n();const l=e[t++];if(l==="}")return;P(l===",","JSON comma required")}throw Error("Truncated object")}if(s==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(r+1),n();const a=e[t++];if(a==="]")return;P(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;P(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),P(t===e.length,"Trailing JSON content"),JSON.parse(e)}function mn(e,t=di,n="$"){if(t.$ref)return mn(e,di.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{mn(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&P(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;P(i===t.type,"Invalid type at "+n)}if(t.minLength&&P(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&P(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])P(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))P(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),mn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>mn(i,t.items,n+"["+o+"]"))}function Kd(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,a,u=d.id)=>{P(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,a),o.set(s.id,u)};for(const s of e.documents){r(s,s,"document",null);for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[d]??[])r(u,s,a);if(s.kind==="businessDesign"&&["0.4","0.5","0.6"].includes(s.schemaVersion)){for(const d of s.objects)for(const a of d.information)r(a,s,"information",d.id);for(const d of s.activities){for(const a of d.procedure.steps)r(a,s,"step",d.id);for(const a of d.results)r(a,s,"result",d.id);for(const a of d.decisions??[]){r(a,s,"decision",d.id);for(const u of a.axes)r(u,s,"decision-axis",a.id);for(const u of a.rows)r(u,s,"decision-row",a.id)}}for(const d of s.data)r(d,s,"data")}}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}return{map:t,owner:n,types:i,parent:o}}function Fi(e){return mn(e),oa(e)}function Gn(e,t){const n=new Set(e.items.map(s=>s.id)),i=new Set,o=e.guarantees.find(s=>s.id===t.guaranteeId),r=s=>{if(Array.isArray(s)){for(const d of s)r(d);return}if(s&&typeof s=="object"){s.kind==="reference"&&n.has(s.targetId)&&i.add(s.targetId);for(const d of Object.values(s))d&&typeof d=="object"&&r(d)}};r(t.rows);for(const s of o?.blocks??[])s.kind==="prose"&&r(s.content);for(const s of e.items)(s.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&i.add(s.id);return[...i]}function oa(e,{allowUnresolvedFindings:t=!1}={}){P(e.documents.length>0,"Document required");const n=Kd(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const c of e.sources)if(c.uri){const h=new URL(c.uri);P(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const a=(c,h,m)=>(P(i.has(c),"Dangling reference: "+c),h&&P(r.get(c)===h,"Reference type mismatch: "+c),m&&P(o.get(c)===m,"Cross-document mismatch: "+c),i.get(c)),u=c=>c?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),l=(c,h)=>{for(const m of c){if(m.kind==="reference"){const f=r.get(m.targetId);if(f==="decision-row"||f==="exception"){P(e.formatVersion==="0.7","Business rich references require formatVersion 0.7");const b=i.get(h),A=a(m.targetId,f),y=f==="exception"?A.activityId:n.parent.get(n.parent.get(m.targetId));P(b?.kind==="checkItems"&&b.basedOn.documentId===o.get(m.targetId),"Business reference must use the Check source Business Design"),P(b.index.some(S=>S.activityId===y),"Business reference Activity is absent from Check index")}else a(m.targetId,null,h),P(["document","section","guarantee","example","check","note"].includes(f),"Invalid rich reference target")}if(m.kind==="link"){const f=new URL(m.uri);P(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}}};for(const c of e.documents)if(P(e.formatVersion!=="0.1"||c.kind!=="stateTransition","State documents require formatVersion 0.2"),c.kind==="businessDesign"){P(c.activities.length>0,"Activity required");const h=[...c.objects,...c.activities].map(b=>b.name);P(new Set(h).size===h.length,"Duplicate visible name"),P(h.every(b=>b===b.trim()&&!(["0.4","0.5","0.6","0.7"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(A=>b.includes(A))),"Invalid Graph-visible name");for(const b of c.objects)P(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3"].includes(c.schemaVersion)){P(new Set(c.roles.map(b=>b.name)).size===c.roles.length,"Duplicate Role name"),P(c.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name");for(const b of c.activities)b.roleId!==null?a(b.roleId,"role",c.id):d.add("Role未確定: "+b.id+" — "+b.who)}for(const b of c.activities)P(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of c.exceptions??[])a(b.activityId,"activity",c.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;for(const b of c.relations){a(b.fromId,m[b.kind][0],c.id),a(b.toId,m[b.kind][1],c.id);const A=JSON.stringify([b.kind,b.fromId,b.toId,["0.5","0.6"].includes(c.schemaVersion)?b.id:b.dataId??b.label]);P(!f.has(A),"Duplicate relation"),f.add(A)}c.schemaVersion==="0.4"&&Hd(c,n,a),["0.5","0.6"].includes(c.schemaVersion)&&Jd(c,n,a,s),P(new Set(c.findings.map(b=>b.sourceId)).size===c.findings.length,"Duplicate Finding source ID");for(const b of c.findings){P(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),P(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const A of b.targetIds)a(A,null,c.id),P(["object","activity"].includes(r.get(A)),"Invalid Finding target");b.unresolvedTargets.length&&(P(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(c.kind==="stateTransition"){const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),P(h.revision===c.basedOn.revision,"Stale State source revision"),a(c.objectId,"object",h.id),P(!e.documents.some(f=>f!==c&&f.kind==="stateTransition"&&f.objectId===c.objectId),"Duplicate Object state declaration"),P(c.states.length>0&&new Set(c.states.map(f=>f.name)).size===c.states.length,"Duplicate/empty state names"),P(c.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),P(c.transitions.length<=1e3,"State transition row budget"),P(new Set(c.transitions.map(f=>f.sourceId)).size===c.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of c.transitions){f.fromId!=="@new"&&a(f.fromId,"state",c.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",c.id);const b=a(f.activityId,"activity",h.id),A=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);if(P(!m.has(A),"Duplicate state transition condition: "+m.get(A)+" / "+f.sourceId),m.set(A,f.sourceId),["0.4","0.5","0.6","0.7"].includes(e.formatVersion))if(P(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const y=a(f.exceptionId,"exception",h.id);P(y.activityId===b.id,"Exception Activity mismatch")}else f.path==="exception"&&P(s.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else P(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);P(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),P(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),P(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),P(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+c.id)}else if(c.kind==="conceptModel"){const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign"&&h.revision===c.basedOn.revision,"Concept source must be the matching in-package BD revision"),P(!e.documents.some(N=>N!==c&&N.kind==="conceptModel"&&N.basedOn.documentId===h.id),"Duplicate Concept model for Business Design");const m=(N,R)=>{const L=new Map;for(const Y of N)P(!L.has(Y.id),"Duplicate "+R+" ID: "+Y.id),L.set(Y.id,Y);return L},f=m(c.subsystems,"subsystem"),b=m(c.concepts,"concept"),A=m(c.relations,"concept relation"),y=m(c.reviewGroups,"review group"),S=m(c.handoffs,"handoff"),x=m(c.concepts.flatMap(N=>N.information),"concept information"),I=(N,R,L)=>(P(N.has(R),"Unknown "+L+": "+R),N.get(R)),E=N=>a(N,"activity",h.id),j=N=>{const R=a(N.documentId,"document");P(R.revision===N.revision,"Stale Concept source revision");const L=R.id===h.id,Y=R.kind==="stateTransition"&&R.basedOn.documentId===h.id&&c.relatedStates.some(V=>V.documentId===R.id&&V.revision===R.revision);P(L||Y,"Concept source must refer to its Business Design or a declared State"),a(N.targetId,N.targetType,R.id)};for(const N of c.relatedStates){const R=a(N.documentId,"document");P(R.kind==="stateTransition"&&R.revision===N.revision&&R.basedOn.documentId===h.id,"Invalid Concept state reference")}for(const N of c.subsystems)for(const R of N.activityIds)E(R);for(const N of c.concepts){I(f,N.subsystemId,"subsystem");for(const R of N.information)R.responsibleSubsystemId&&I(f,R.responsibleSubsystemId,"responsible subsystem");for(const R of N.businessObjectIds)a(R,"object",h.id);for(const R of N.activityLinks)E(R.activityId);for(const R of N.sourceRefs)j(R)}for(const N of c.relations){I(b,N.fromConceptId,"concept"),I(b,N.toConceptId,"concept");for(const R of N.sourceRefs)j(R)}for(const N of c.handoffs){I(f,N.fromSubsystemId,"subsystem"),I(f,N.toSubsystemId,"subsystem"),P(N.fromSubsystemId!==N.toSubsystemId,"Handoff must cross subsystem boundary");for(const R of N.activityIds)E(R)}const $=(N,R)=>{const L=m(N.nodes,"subsystem view"),Y=m(N.edges,"subsystem view edge");for(const Z of L.values()){I(R,Z.conceptId,"view concept"),I(f,Z.subsystemId,"subsystem");const H=I(b,Z.conceptId,"concept");for(const Q of Z.fields)P(H.information.some(oe=>oe.id===Q.informationId),"Unknown information for subsystem view: "+Q.informationId)}for(const Z of Y.values()){const H=I(L,Z.fromViewId,"subsystem view"),Q=I(L,Z.toViewId,"subsystem view");P(H.subsystemId===Q.subsystemId,"View relationship crosses subsystem boundary"),P(Z.relationIds.length>0,"Subsystem view relationship needs a concept relation");let oe=H.conceptId;for(const me of Z.relationIds){const de=I(A,me,"concept relation");P(de.fromConceptId===oe,"Subsystem view relation path is disconnected: "+me),oe=de.toConceptId}P(oe===Q.conceptId,"Subsystem view relation target differs")}P(new Set(N.handoffIds).size===N.handoffIds.length,"Duplicate subsystem view handoff");const V=new Set([...L.values()].map(Z=>Z.subsystemId));for(const Z of N.handoffIds){const H=I(S,Z,"handoff");P(V.has(H.fromSubsystemId)&&V.has(H.toSubsystemId),"Missing subsystem view handoff region: "+Z)}};c.presentation.subsystemViews&&$(c.presentation.subsystemViews,b);for(const N of c.reviewGroups){I(f,N.subsystemId,"subsystem"),a(N.reviewer.roleId,"role",h.id);for(const V of N.relatedActivityIds)E(V);const R=m(N.graph.nodes.map(V=>({...V,id:V.conceptId})),"view concept");P(new Set(N.graph.conceptIds).size===N.graph.conceptIds.length&&N.graph.conceptIds.length===R.size&&N.graph.conceptIds.every(V=>R.has(V)),"View concepts and nodes differ");for(const V of N.graph.nodes){I(b,V.conceptId,"concept");for(const Z of V.sourceActivityIds)E(Z)}m(N.graph.edges,"view edge");for(const V of N.graph.edges){I(R,V.fromConceptId,"view concept"),I(R,V.toConceptId,"view concept");for(const Z of V.relationIds)I(A,Z,"concept relation")}N.graph.subsystemViews&&$(N.graph.subsystemViews,R);const L=m(N.capabilities,"capability"),Y=m(N.capabilities.flatMap(V=>V.samples),"sample");m(N.limitations,"limitation"),m(N.structureStatements,"structure statement");for(const V of N.structureStatements){for(const Z of V.sampleIds)I(Y,Z,"sample");for(const Z of V.sourceRefs)j(Z)}for(const V of L.values())if(V.testSpecification){const Z=V.testSpecification;for(const[Q,oe]of Object.entries(Z))P(new Set(oe).size===oe.length,"Duplicate function specification reference: "+Q);const H=(Q,oe)=>{const me=a(Q,oe),de=a(o.get(Q),"document");return P(de.kind==="checkItems"&&de.basedOn.documentId===h.id&&de.basedOn.revision===h.revision,"Function Check source mismatch: "+Q),{value:me,doc:de}};for(const Q of[...Z.decisionCheckIds,...Z.resultCheckIds])H(Q,"check");for(const Q of Z.decisionExampleIds){const{value:oe,doc:me}=H(Q,"example"),de=Gn(me,oe);P(de.length>0,"Function decision table needs a Check: "+Q),P(de.every(ye=>Z.decisionCheckIds.includes(ye)),"Function decision table Check is not assigned: "+Q)}for(const Q of Z.sampleIds){const oe=V.samples.find(me=>me.id===Q);P(oe,"Function result sample belongs to another capability: "+Q),P(oe.checkIds.some(me=>Z.resultCheckIds.includes(me)),"Function result sample needs a result Check: "+Q),P(oe.checkIds.every(me=>Z.resultCheckIds.includes(me)||Z.decisionCheckIds.includes(me)),"Function result sample Check is not assigned: "+Q)}}for(const V of L.values())for(const Z of V.samples){if(c.schemaVersion==="0.2"){P(Z.checkIds.length>0,"Sample needs a Check: "+Z.id),P(new Set(Z.checkIds).size===Z.checkIds.length,"Duplicate sample Check: "+Z.id);for(const H of Z.checkIds){a(H,"check");const Q=a(o.get(H),"document");P(Q.kind==="checkItems"&&Q.basedOn.documentId===h.id&&Q.basedOn.revision===h.revision,"Sample Check source mismatch: "+H)}}for(const H of Z.blocks){I(R,H.card,"view concept");const Q=m(H.columns,"sample column");for(const oe of H.columns)I(x,oe.informationId,"concept information");m(H.rows,"sample row");for(const oe of H.rows){const me=new Set;for(const de of oe.cells)I(Q,de.columnId,"sample column"),P(!me.has(de.columnId),"Duplicate sample cell: "+de.columnId),me.add(de.columnId);P(me.size===Q.size,"Sample row does not match columns")}}}}for(const N of c.presentation.landscapeRelationships){const R=I(y,N.from,"review group"),L=I(y,N.to,"review group");P(R.subsystemId===L.subsystemId,"Internal relationship crosses subsystem boundary")}for(const N of c.presentation.reviewBoundaries)I(y,N.from,"review group"),I(y,N.to,"review group");s.push("概念モデルの業務意味は未確認: "+c.id)}else{const h=a(c.basedOn.documentId,"document");P(h.kind==="businessDesign","Check source is not BD"),P(h.revision===c.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+c.id),P(new Set(c.items.map(b=>b.checkId)).size===c.items.length,"Duplicate Check ID");const m=new Set;for(const b of c.index){a(b.activityId,"activity",h.id),P(!m.has(b.activityId),"Duplicate Activity index"),m.add(b.activityId),P(new Set(b.checkIds).size===b.checkIds.length,"Duplicate Check binding");for(const A of b.checkIds)a(A,"check",c.id)}P(new Set(c.sections.map(b=>b.activityId??b.title)).size===c.sections.length,"Duplicate Activity section");for(const b of c.sections)b.activityId!==null&&(a(b.activityId,"activity",h.id),P(m.has(b.activityId),"Section missing from index")),l(b.preamble,c.id);const f=new Set(e.documents.filter(b=>b.kind==="conceptModel"&&b.basedOn.documentId===h.id&&b.basedOn.revision===h.revision).flatMap(b=>b.reviewGroups.flatMap(A=>A.capabilities.flatMap(y=>y.testSpecification?.decisionExampleIds??[]))));for(const b of c.guarantees){const A=b.blocks.length>0&&b.blocks.every(y=>y.kind==="example"&&f.has(y.exampleId)&&c.examples.some(S=>S.id===y.exampleId&&S.guaranteeId===b.id&&Gn(c,S).length>0));P(b.blocks.some(y=>y.kind==="prose"&&u(y.content))||A,"General guarantee prose required"),a(b.sectionId,"section",c.id);for(const y of b.blocks)if(y.kind==="prose")l(y.content,c.id);else{const S=a(y.exampleId,"example",c.id);P(S.guaranteeId===b.id,"Example owner mismatch")}}for(const b of c.examples){a(b.guaranteeId,"guarantee",c.id),P(b.columns.length>0,"Example columns required");for(const A of b.rows){P(A.length===b.columns.length,"Example column mismatch");for(const y of A)l(y,c.id)}}for(const b of c.items){const A=a(b.sectionId,"section",c.id);P(A.activityId===null?!c.index.some(y=>y.checkIds.includes(b.id)):c.index.some(y=>y.activityId===A.activityId&&y.checkIds.includes(b.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),P(u(b.fields.guarantee)||u(b.fields.condition)&&u(b.fields.expectedResult),"Check guarantee required");for(const y of Object.values(b.fields)){l(y,c.id);for(const S of y)S.kind==="reference"&&(r.get(S.targetId)==="decision-row"&&P(i.get(S.targetId).checkRefs.some(x=>x.checkId===b.id),"Check and decision row must explicitly correspond: "+b.id),r.get(S.targetId)==="exception"&&P(c.index.some(x=>x.activityId===i.get(S.targetId).activityId&&x.checkIds.includes(b.id)),"Check and exception Activity mismatch: "+b.id))}P(A.activityId===null||c.index.some(y=>y.checkIds.includes(b.id)),"Unbound Check")}for(const b of c.notes)l(b.content,c.id);l(c.intro,c.id)}const p=e.diagnostics.filter(c=>c.startsWith("Role未確定:"));P(new Set(p).size===p.length,"Duplicate unresolved Role diagnostic");for(const c of p)P(d.delete(c),"Unresolved Who requires a diagnostic matching a current unresolved Activity");P(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const c of e.sources){a(c.documentId,"document");const h=c.documentId+"@"+c.revision;P(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const c of e.externalDocuments)P(e.sources.some(h=>h.documentId===c.id&&h.revision===c.revision),"External source revision missing"),P(c.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+c.id);return{diagnostics:s,entities:i.size}}const D=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Qe(e,t,n){if(n==null)return;const i=et(n);return e.append(D("h3",t),i),i}function sa(e,t){const n=D("ul");for(const i of[...new Set(t)]){const o=e.data?.find(r=>r.id===i);if(o)for(const r of o.items){const s=e.objects.flatMap(l=>l.information).find(l=>typeof l!="string"&&l.id===r.informationId);if(!s||typeof s=="string")continue;const d=s.name===o.name?"":s.name,a=r.condition?`条件：${r.condition}`:"";if(!d&&!a&&!s.description)continue;const u=D("li",[d,a].filter(Boolean).join(" — "));s.description&&u.append(et(s.description)),n.append(u)}}return n}function qi(e,t){if(t===null)return D("span","未決");if(!t.length)return D("span","なし");const n=D("ul");n.className="procedure-data-list";for(const i of t){const o=e.data?.find(d=>d.id===i),r=D("li",o?.name??"未決"),s=sa(e,[i]);if(s.children.length){const d=D("details"),a=D("summary","詳細");d.className="procedure-data-details",d.append(a,s),r.append(d)}n.append(r)}return n}function Xd(e,t){if(e===null)return;const n=et(e),i=r=>String(r??"").replace(/\s+/g,""),o=new Set(t.map(r=>i(et(`**${r.name}** — ${r.description}`).textContent)));for(const r of Array.from(n.querySelectorAll("li")))o.has(i(r.textContent))&&r.remove();for(const r of Array.from(n.querySelectorAll("ul,ol")))r.children.length||r.remove();return n.textContent?.trim()?n:void 0}const Zd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Yd(e,t,n){const i=new Map,o=new Set,r=new Set(n.map(d=>d.id)),s=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==s.id||d.basedOn.revision!==s.revision)continue;const a=d.presentation.activityViews;if(Array.isArray(a)){for(const u of a)if(!(!u||typeof u!="object"||Array.isArray(u)||u.activityId!==t||!Array.isArray(u.businessVariations)))for(const l of u.businessVariations){if(!l||typeof l!="object"||Array.isArray(l)||typeof l.exceptionId!="string"||!r.has(l.exceptionId)||l.kind!=="alternative"&&l.kind!=="exception"||o.has(l.exceptionId))continue;const p=i.get(l.exceptionId);p&&p!==l.kind?(i.delete(l.exceptionId),o.add(l.exceptionId)):i.set(l.exceptionId,l.kind)}}}return i}function Qd(e,t,n){const i=t.model.business,o=t.model.checks,r=n.decisions??[],s=new Map,d=y=>r.findIndex(S=>S.id===y)+1,a=(y,S)=>{const x=D("button",`（※${d(y)}）`);return x.type="button",x.className="business-decision-link",x.onclick=()=>{const I=s.get(y);((S?Array.from(I?.querySelectorAll("tr")??[]).find(j=>j.dataset.decisionRow===S):void 0)??I)?.scrollIntoView({behavior:"smooth",block:"start"})},x},u=(y,S,x)=>{if(!y||!S)return"未決";const I=S.result.text??"未決";if(!x)return I;const E=S.conditions.map((j,$)=>`${y.axes[$].name}：${Jr(j,y.axes[$])}`).join("、");return`${I}（${y.rows.indexOf(S)+1}行目：${E}）`},l=y=>y?y.kind==="who"?En(i,n):i.objects.find(S=>S.id===y.objectId)?.name??"未決":"未決",p=(y,S)=>y===null||S===null?y===S:y.length===S.length&&y.every((x,I)=>x===S[I]),g=y=>y?.length===1&&!sa(i,y).children.length?D("span",i.data?.find(S=>S.id===y[0])?.name??"未決"):qi(i,y);e.append(D("h3","Procedure"));const c=D("p","表は左右にスクロールできます。無印の手順は必須です。");c.className="procedure-scroll-hint",e.append(c);const h=D("div");h.dataset.procedureScroll="",h.tabIndex=0,h.setAttribute("role","region"),h.setAttribute("aria-label","手順表");const m=D("table");m.dataset.procedureTable="",m.dataset.businessDecisions="";const f=D("thead"),b=D("tr");for(const y of["From","To","Data","Action"]){const S=D("th",y);S.scope="col",b.append(S)}f.append(b),m.append(f);const A=D("tbody");for(const[y,S]of n.procedure.steps.entries()){const x=D("tr");x.dataset.stepId=S.id;const I=S.exchange,E=En(i,n),j=I.kind==="interaction"?i.objects.find(H=>H.id===I.objectId)?.name??"未決":null,$=I.kind==="interaction"?I.direction==="input"?j:E:I.kind==="internal"?E:"未決",N=I.kind==="interaction"?I.direction==="input"?E:j:I.kind==="internal"?"—":"未決";x.append(D("td",$),D("td",N));const R=D("td");I.kind!=="interaction"||p(S.whatDataIds,I.dataIds)?R.append(g(S.whatDataIds)):R.append(D("span","対象："),g(S.whatDataIds),D("span","受渡し："),g(I.dataIds)),x.append(R);const L=D("td",S.action);for(const H of S.decisionIds??[])L.append(a(H));const Y=[],V=S.obligation==="optional";let Z;if(S.method&&Y.push(`方法：${S.method}`),S.appliesWhen&&Y.push(`適用条件：${S.appliesWhen}`),S.effect&&Y.push(`操作効果：${S.effect}`),S.whenDecision){const H=r.find(de=>de.id===S.whenDecision.decisionId),Q=H?.rows.find(de=>de.id===S.whenDecision.rowId),oe=n.procedure.steps.slice(0,y).some(de=>de.decisionIds?.includes(H?.id??""));H?.kind==="validation"&&Q?.result.kind==="accepted"&&H.rows.some(de=>de.result.kind==="error")&&H.rows.every(de=>de===Q||de.result.kind==="error")&&oe||(Y.push(`判定条件：${H?.title??"未決"} / ${u(H,Q,!0)}`),Z=S.whenDecision)}if(S.parties){const H=l(S.parties.from),Q=l(S.parties.to);(H!==$||Q!==N)&&Y.push(`操作主体と対象：${H} → ${Q}`)}if(I.kind==="interaction"?(I.phase===null?Y.push("Request/Response：未決"):I.phase!=="not-applicable"&&Y.push(I.phase==="request"?"Request":"Response"),I.pairedStepId&&Y.push(`対応：手順${n.procedure.steps.findIndex(H=>H.id===I.pairedStepId)+1}`)):I.kind==="unresolved"&&Y.push("やり取り：未決"),Y.length){const H=D("details"),Q=D("summary",V?"詳細（任意）":"詳細"),oe=D("small",Y.join(" · "));Z&&oe.append(a(Z.decisionId,Z.rowId)),H.className="procedure-original",H.append(Q,oe),L.append(H)}else V&&L.append(D("small","（任意）"));if(S.legacyText){const H=D("details");H.className="procedure-original",H.append(D("summary","元の手順"),et(S.legacyText)),L.append(H)}x.append(L),A.append(x)}if(m.append(A),h.append(m),e.append(h),n.procedure.orderRules.length){e.append(D("h3","手順の順序制約"));const y=D("ul"),S=x=>String(n.procedure.steps.findIndex(I=>I.id===x)+1);for(const x of n.procedure.orderRules)y.append(D("li",x.kind==="before"?`手順${S(x.beforeId)} → 手順${S(x.afterId)}`:`手順${x.stepIds.map(S).join("・")}は入替可能`));e.append(y)}for(const y of r){const S=D("section");if(S.dataset.businessDecision=y.id,s.set(y.id,S),S.append(D("h3",`${y.title}（※${d(y.id)}）`)),y.appliesWhen){const x=r.find($=>$.id===y.appliesWhen.decisionId),I=x?.rows.find($=>$.id===y.appliesWhen.rowId),E=!!I&&!!x&&x.rows.filter($=>$.result.text===I.result.text).length>1,j=D("p",`適用条件：${x?.title??"未決"} — ${u(x,I,E)}`);j.append(a(y.appliesWhen.decisionId,y.appliesWhen.rowId)),y.note&&j.append(document.createTextNode(" · "+y.note)),S.append(j)}else y.note&&S.append(D("p",y.note));S.append(D("p","上から順に判定し、最初に当てはまる行を見ます。"),hs(y,o),...bs(y,i,o)),e.append(S)}}function el(e,t,n){const i=D("article");i.className="markdown json-detail";const o=e.model,r=o.business,s=r.objects.find(a=>a.id===t),d=r.activities.find(a=>a.id===t);if(s){Qe(i,"Scope",s.scope===null?"未決":String(s.scope)),i.append(D("h3","Information"));const a=D("ul");for(const u of s.information){const l=D("li",typeof u=="string"?u:u.name);typeof u!="string"&&u.description&&l.append(et(u.description)),a.append(l)}i.append(a)}else if(d){const a=r.exceptions?.filter(c=>c.activityId===d.id)??[];if("performers"in d){Qe(i,"Scope",String(d.scope)),Qe(i,"Why",d.why),Qe(i,"When",d.when),Qe(i,"Who",En(r,d)),Qe(i,"旧形式の担当情報",zo(r,d)),d.performers?.length===1&&d.procedure.steps.some(f=>f.performerObjectIds===null)&&i.append(D("p","旧形式では、指定のない手順は旧形式の担当情報を継承します。")),Qe(i,"Where",d.where);const c=(e.findings??[]).filter(f=>f.id.startsWith("viewer:")&&f.targets.includes(d.id));for(const f of c){const b=D("p",f.summary+" ");b.className="finding-reference-warning",b.dataset.structureIssue=f.id;const A=D("button","構造の要確認を開く");A.type="button",A.className="node-navigate",A.onclick=()=>n?.(f.id),b.append(A),i.append(b)}i.append(D("h3","Procedure"));const h=D("ol");for(const f of d.procedure.steps){const b=D("li");b.append(et(f.text));const A=d.performers?.length===1&&(f.performerObjectIds===null||f.performerObjectIds.length===1&&f.performerObjectIds[0]===d.performers[0].objectId),y=[f.obligation==="required"?"必須":"任意",...f.appliesWhen?[`適用条件：${f.appliesWhen}`]:[],...A?[]:[`旧形式の担当：${zo(r,d,f.performerObjectIds)}`]];b.append(D("p",y.join(" · "))),h.append(b)}if(i.append(h),d.procedure.orderRules.length){i.append(D("h3","手順の順序制約"));const f=D("ul"),b=A=>String(d.procedure.steps.findIndex(y=>y.id===A)+1);for(const A of d.procedure.orderRules)f.append(D("li",A.kind==="before"?`手順${b(A.beforeId)} → 手順${b(A.afterId)}`:`手順${A.stepIds.map(b).join("・")}は入替可能`));i.append(f)}i.append(D("h3","Result"));const m=D("ul");m.dataset.businessResult="",m.dataset.resultScope="activity";for(const f of d.results){const b=D("li");b.append(et(f.text)),m.append(b)}i.append(m),Qe(i,"Problem",d.problem),Qe(i,"Pain level",d.painLevel)}else if(typeof d.who!="string"){const c=d;if(Qe(i,"Scope",c.scope===null?"未決":String(c.scope)),Qe(i,"Why",c.why),Qe(i,"When",c.when),Qe(i,"Who",En(r,c)),Qe(i,"Where",c.where),o.formatVersion==="0.7")Qd(i,e,c);else{i.append(D("h3","Procedure"));const m=D("table");m.dataset.procedureTable="";const f=D("thead"),b=D("tr");for(const I of["Step","From","To","Data","Action"]){const E=D("th",I);E.scope="col",b.append(E)}f.append(b),m.append(f);const A=D("tbody"),y=I=>I?I.kind==="who"?En(r,c):r.objects.find(E=>E.id===I.objectId)?.name??"未決":"未決";for(const[I,E]of c.procedure.steps.entries()){const j=D("tr");j.dataset.stepId=E.id;const $=E.parties,N=(H,Q)=>H===null||Q===null?H===Q:H.length===Q.length&&H.every((oe,me)=>oe===Q[me]),R=$?y($.from):E.exchange.kind==="internal"?En(r,c):"未決",L=$?y($.to):E.exchange.kind==="internal"?"—":"未決";for(const H of[String(I+1),R,L])j.append(D("td",H));const Y=D("td");E.exchange.kind!=="interaction"||N(E.whatDataIds,E.exchange.dataIds)?Y.append(qi(r,E.whatDataIds)):Y.append(D("span","対象："),qi(r,E.whatDataIds),D("span","受渡し："),qi(r,E.exchange.dataIds)),j.append(Y);const V=D("td",E.action),Z=[...E.obligation==="optional"?["任意"]:[],...E.method?[`方法：${E.method}`]:[],...E.appliesWhen?[`適用条件：${E.appliesWhen}`]:[],...E.effect?[`操作効果：${E.effect}`]:[]];if(E.exchange.kind==="interaction"){const H=E.exchange,Q=r.objects.find(Ie=>Ie.id===H.objectId)?.name??"未決",oe=E.parties,me=oe?.from?.kind==="who"&&oe.to?.kind==="object"&&oe.to.objectId===H.objectId,de=oe?.from?.kind==="object"&&oe.from.objectId===H.objectId&&oe.to?.kind==="who";if(!(H.direction==="output"?me:de)){const Ie=H.direction==="input"?"Input":"Output";Z.push(`受渡し：${me||de?"":Q+" / "}${Ie}`)}H.phase===null?Z.push("Request/Response：未決"):H.phase!=="not-applicable"&&Z.push(H.phase==="request"?"Request":"Response"),H.pairedStepId&&Z.push(`対応：手順${c.procedure.steps.findIndex(Ie=>Ie.id===H.pairedStepId)+1}`)}else E.exchange.kind==="unresolved"&&Z.push("やり取り：未決");if(Z.length&&V.append(D("small",Z.join(" · "))),E.legacyText){const H=D("details");H.className="procedure-original",H.append(D("summary","元の手順"),et(E.legacyText)),V.append(H)}j.append(V),A.append(j)}m.append(A);const S=D("p","表は左右にスクロールできます。無印の手順は必須です。");S.className="procedure-scroll-hint";const x=D("div");if(x.dataset.procedureScroll="",x.tabIndex=0,x.setAttribute("role","region"),x.setAttribute("aria-label","手順表"),x.append(m),i.append(S,x),c.procedure.orderRules.length){i.append(D("h3","手順の順序制約"));const I=D("ul"),E=j=>String(c.procedure.steps.findIndex($=>$.id===j)+1);for(const j of c.procedure.orderRules)I.append(D("li",j.kind==="before"?`手順${E(j.beforeId)} → 手順${E(j.afterId)}`:`手順${j.stepIds.map(E).join("・")}は入替可能`));i.append(I)}}i.append(D("h3","Result"));const h=D("ul");h.dataset.businessResult="",h.dataset.resultScope="activity";for(const m of c.results){const f=D("li");f.append(et(m.text)),h.append(f)}i.append(h),Qe(i,"Problem",c.problem),Qe(i,"Pain level",c.painLevel)}else{const c=d;for(const[h,m]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const f=Qe(i,h,m==="who"?ms(e,c.id)?.name??c.who:c[m]===null?null:String(c[m]));m==="result"&&f&&(f.dataset.businessResult="")}}const u=Xd("exception"in d?d.exception:null,a),l=Yd(e,d.id,a),p=(c,h,m)=>{if(!h.length&&!m)return;const f=D("section");f.dataset.businessVariations="",f.append(D("h3",c)),m&&f.append(m);for(const b of h){const A=et(b.description);A.dataset.businessException=b.id,f.append(D("h4",b.name),A);const y=b.continuity;if(y){const S=D("dl"),x=j=>j&&typeof d.procedure!="string"?`手順${d.procedure.steps.findIndex($=>$.id===j)+1}`:"未決",I=j=>j===null?"未決":j.map($=>r.data?.find(N=>N.id===$)?.name??"未決").join("、")||"なし",E=[["発生条件",y.trigger??"未決"]];(y.onInterrupt!==null||y.outcome==="resume"||y.outcome===null)&&E.push(["中断時の扱い",y.onInterrupt??"未決"]),E.push(["その後",y.outcome==="resume"?"再開":y.outcome==="continue"?"そのまま続行":y.outcome==="end"?"終了":"未決"]),(y.outcome==="resume"||y.outcome===null||y.resumeCondition!==null||y.resumeAction!==null)&&E.push(["再開条件",y.resumeCondition??"未決"],["再開方法",y.resumeAction??"未決"]),y.interruptedAtStepId&&E.push(["中断した手順",x(y.interruptedAtStepId)]),y.resumeAtStepId&&E.push(["再開する手順",x(y.resumeAtStepId)]),(y.retainedDataIds!==null||y.outcome==="resume")&&E.push(["保持するData",I(y.retainedDataIds)]);for(const[j,$]of E)S.append(D("dt",j),D("dd",$));f.append(S)}}i.append(f)};["0.6","0.7"].includes(o.formatVersion)?p("Exception",a,u):l.size?(p("例外",a.filter(c=>l.get(c.id)==="exception")),p("別ルート",a.filter(c=>l.get(c.id)==="alternative")),p("通常以外の扱い",a.filter(c=>!l.has(c.id)),u)):p("通常以外の扱い",a,u);const g=new Map([...r.objects,...r.activities].map(c=>[c.id,c.name]));if(["0.6","0.7"].includes(o.formatVersion))for(const[c,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=e.graph.relations.filter(b=>b.kind===c&&(b.from===t||b.to===t));if(!m.length)continue;i.append(D("h3",h));const f=D("ul");for(const b of m){const y=`${c==="business-exception"?`${g.get(b.from)} → ${g.get(b.to)}`:g.get(c==="input"?b.from:b.to)} — ${b.label||"未決"}`;if(c==="business-exception"){i.append(D("p",y));continue}f.append(D("li",y))}c!=="business-exception"&&i.append(f)}else for(const[c,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=r.relations.filter(b=>b.kind===c&&(b.fromId===t||b.toId===t));if(!m.length)continue;i.append(D("h3",h));const f=D("ul");for(const b of m){const A=c==="business-exception"?`${g.get(b.fromId)} → ${g.get(b.toId)}`:g.get(c==="input"?b.fromId:b.toId),y=Hr(r,b),S=`${A} — ${y||"未決"}`;if(c==="business-exception"){i.append(D("p",S));continue}const x=D("li",S);if("dataId"in b){const I=r.data.find(j=>j.id===b.dataId),E=D("ul");for(const j of I.items){const $=r.objects.flatMap(R=>R.information).find(R=>typeof R!="string"&&R.id===j.informationId);if(!$||typeof $=="string")continue;const N=D("li",$.name+(j.condition?`（条件：${j.condition}）`:""));$.description&&N.append(et($.description)),E.append(N)}x.append(E)}f.append(x)}c!=="business-exception"&&i.append(f)}}else i.append(D("p","項目を選択すると業務内容を表示します。"));return i}function ra(e,t){return e.model?.formatVersion!=="0.7"?[]:e.model.business.activities.flatMap(n=>"decisions"in n?n.decisions??[]:[]).filter(n=>n.rows.some(i=>i.checkRefs.some(o=>o.checkId===t)))}function to(e,t,n){const i=new Set(Object.values(n.fields).flat().filter(o=>o.kind==="reference").map(o=>o.targetId));for(const o of ra(t,n.id)){if(o.rows.some(d=>i.has(d.id)))continue;const r=D("details");r.dataset.linkedBusinessDecision=o.id,r.append(D("summary",`${o.title}（業務判断）`));let s=!1;r.addEventListener("toggle",()=>{!r.open||s||(s=!0,r.append(hs(o,t.model.checks),...bs(o,t.model.business,t.model.checks)))}),e.append(r)}}class yi{remaining=5e3;warned=!1;doc;design;requester;constructor(t,n,i=!1){this.doc=t,this.design=n,this.requester=i}take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(D("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(et(o.value));continue}if(o.kind==="text"){const a=D("span",o.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(o.kind==="link"){t.append(D("span",`${o.label} (${o.uri})`));continue}const r=D("details"),s=D("summary",o.label||o.targetId);r.append(s),t.append(r);let d=!1;r.addEventListener("toggle",()=>{if(!r.open||d)return;if(d=!0,i.has(o.targetId)){r.append(D("p","循環参照："+o.targetId));return}if(i.size>=16){r.append(D("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(i).add(o.targetId),u=this.doc,l=u.guarantees.find(m=>m.id===o.targetId),p=u.examples.find(m=>m.id===o.targetId),g=u.items.find(m=>m.id===o.targetId),c=u.sections.find(m=>m.id===o.targetId),h=u.notes.find(m=>m.id===o.targetId);if(l){r.append(D("h4",l.title));for(const m of l.blocks){if(!this.take(r))break;m.kind==="prose"?this.runs(r,m.content,a):this.example(r,m.exampleId,a)}}else if(p)this.example(r,p.id,a);else if(g){r.append(D("p",`${g.checkId} · ${g.title}`+(this.requester?"":` · ${g.reviewState}`))),this.requester&&(g.reviewState==="要確認"||g.reviewState==="要修正")&&r.append(D("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(g.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f))):g.fields;this.fields(r,m,a)}else if(c)r.append(D("h4",c.title)),this.runs(r,c.preamble,a);else if(h)r.append(D("h4",h.title)),this.runs(r,h.content,a);else if(o.targetId===u.id)r.append(D("h4",u.title)),this.runs(r,u.intro,a);else if(this.design.model?.formatVersion==="0.7"){const m=this.design.model.business,f=m.activities.flatMap(A=>"decisions"in A?A.decisions??[]:[]).find(A=>A.rows.some(y=>y.id===o.targetId)),b=m.exceptions?.find(A=>A.id===o.targetId);f?r.append(D("h4",f.title),hs(f,this.design.model.checks),...bs(f,m,this.design.model.checks)):b&&r.append(D("h4",b.name),et(b.description))}})}}fields(t,n,i,o=!1){for(const[r,s]of Object.entries(n)){if(!this.take(t))break;if(t.append(D("h4",Zd[r]??r)),r==="guarantee"&&o){const d=new Set;for(const a of s){const u=a.kind==="reference"?this.doc.guarantees.find(p=>p.id===a.targetId):void 0;if(!u){this.runs(t,[a],i);continue}if(d.has(u.id))continue;d.add(u.id);const l=new Set(i).add(u.id);for(const p of u.blocks){if(!this.take(t))break;p.kind==="prose"?this.runs(t,p.content,l):this.example(t,p.exampleId,l)}}}else this.runs(t,s,i)}}example(t,n,i,o=!1){const r=this.doc.examples.find(p=>p.id===n);if(!Gn(this.doc,r).length)return;const s=D("table"),d=o?r.columns.indexOf("結果"):-1,a=d>0&&r.columns.at(-1)==="Check ID";if(a){const p=D("colgroup");p.span=d,s.append(p);for(let f=d;f<r.columns.length;f++)s.append(D("colgroup"));const g=D("thead"),c=D("tr"),h=D("th","条件");h.colSpan=d,h.scope="colgroup",c.append(h);for(let f=d;f<r.columns.length;f++){const b=D("th",r.columns[f]);b.rowSpan=2,b.scope="col",f===d?b.className="decision-result":r.columns[f]==="備考"&&(b.className="decision-notes"),c.append(b)}const m=D("tr");for(const f of r.columns.slice(0,d)){const b=D("th",f);b.scope="col",m.append(b)}g.append(c,m),s.append(g)}else{const p=D("tr");for(const g of r.columns){if(!this.take(t))break;p.append(D("th",g))}s.append(p)}const u=a?D("tbody"):s;for(const p of r.rows){if(!this.take(t))break;const g=D("tr");for(const[c,h]of p.entries()){if(!this.take(t))break;const m=D("td");if(a&&c===d?m.className="decision-result":a&&r.columns[c]==="備考"&&(m.className="decision-notes"),o)for(const f of h){const b=f.kind==="reference"?this.doc.items.find(A=>A.id===f.targetId):void 0;b?m.append(D("span",b.checkId)):this.runs(m,[f],i)}else this.runs(m,h,i);g.append(m)}u.append(g)}a&&s.append(u);const l=D("div");l.className="json-example",l.append(s),t.append(l)}}function ar(e,t,n=e.model.checks,i=new Set,o=new Set){const r=D("section");r.className="check-content json-checks";const s=e.model.business,d=n.filter(u=>u.basedOn.documentId===s.id);let a=!1;for(const u of d){const l=new yi(u,e),p=u.index.filter(m=>m.activityId===t),g=new Set(u.index.flatMap(m=>m.checkIds)),c=(t?[...new Set(p.flatMap(m=>m.checkIds))]:u.items.filter(m=>!g.has(m.id)).map(m=>m.id)).filter(m=>!i.has(m)),h=u.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of h){(m.preamble.length||u.guarantees.some(f=>f.sectionId===m.id&&!o.has(f.id)))&&(a=!0),l.runs(r,m.preamble);for(const f of u.guarantees.filter(b=>b.sectionId===m.id&&!o.has(b.id)))l.runs(r,[{kind:"reference",targetId:f.id,label:f.title}])}for(const m of c){const f=u.items.find(y=>y.id===m);if(!f)continue;a=!0;const b=D("section");b.className="check-item",b.dataset.checkId=f.checkId,b.dataset.elementId=f.id,b.append(D("h3",f.checkId+" · "+f.title)),(f.reviewState==="要確認"||f.reviewState==="要修正")&&b.append(D("p","確認が必要です。"));const A=Object.fromEntries(Object.entries(f.fields).filter(([y])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(y)));l.fields(b,A,new Set([f.id])),to(b,e,f),r.append(b)}if(!t)for(const m of u.notes)a=!0,l.runs(r,[{kind:"reference",targetId:m.id,label:m.title}])}return a||r.append(D("p","この業務のテスト仕様はありません。")),r}function tl(e,t,n=e.model.checks){const i=D("section");i.className="check-content json-checks sample-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new yi(s,e);for(const a of s.items.filter(u=>r.has(u.id))){const u=D("section");u.className="check-item",u.dataset.checkId=a.checkId,u.dataset.elementId=a.id,u.append(D("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&u.append(D("p","確認が必要です。"));const l=Object.fromEntries(Object.entries(a.fields).filter(([p])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(p)));d.fields(u,l,new Set([a.id]),!0),to(u,e,a),i.append(u)}}return i}const nl=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function il(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(nl,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function ol(e,t,n=e.model.checks){const i=D("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const r of t)for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=s.examples.find(h=>h.id===r);if(!d||!Gn(s,d).length)continue;const a=new yi(s,e,!0),u=s.guarantees.find(h=>h.id===d.guaranteeId),l=D("section");l.dataset.decisionExample=r;for(const h of u?.blocks??[])h.kind==="prose"&&a.runs(l,il(h.content),new Set([u.id]));d.rows.length>1&&l.append(D("p","上から順に判定し、最初に当てはまる行を見ます。"));const p=d.columns.indexOf("結果"),g=p>0?p:d.columns.length;d.rows.some(h=>h.slice(0,g).some(m=>m.some(f=>f.kind==="text"&&/^\s*[-‐]\s*$/.test(f.value))))&&l.append(D("p","‐＝値不問。")),a.example(l,r,new Set([r]),!0),i.append(l)}return i}function sl(e,t,n=e.model.checks){const i=D("section");i.className="check-content json-checks decision-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new yi(s,e,!0);for(const a of s.items.filter(u=>r.has(u.id))){const u=D("section");u.className="check-item",u.dataset.checkId=a.checkId,u.dataset.elementId=a.id,u.append(D("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&u.append(D("p","確認が必要です。")),a.fields.condition?.length&&(u.append(D("h4","条件")),d.runs(u,a.fields.condition,new Set([a.id])));const l=Object.fromEntries(Object.entries(a.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));if(Object.keys(l).length){const p=D("details");p.append(D("summary","期待結果")),d.fields(p,l,new Set([a.id]),!0),u.append(p)}to(u,e,a),i.append(u)}}return i}function rl(e,t,n=e.model.checks,i=new Set){const o=D("section");o.className="check-content json-checks result-checks";const r=e.model.business,s=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===r.id&&a.basedOn.revision===r.revision)){const a=new yi(d,e,!0),u=d.items.filter(l=>s.has(l.id)&&i.has(l.id)&&l.reviewState!=="要確認"&&l.reviewState!=="要修正"&&!l.fields.question?.length&&!l.fields.alternatives?.length&&!ra(e,l.id).length);u.length&&o.append(D("p",u.map(l=>l.checkId).join("、")));for(const l of d.items.filter(p=>s.has(p.id))){if(u.includes(l))continue;const p=D("section");p.className="check-item",p.dataset.checkId=l.checkId,p.dataset.elementId=l.id,p.append(D("h3",l.checkId)),(l.reviewState==="要確認"||l.reviewState==="要修正")&&p.append(D("p","確認が必要です。"));const g=Object.fromEntries(Object.entries(l.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));a.fields(p,g,new Set([l.id]),!0);const c=D("details"),h=D("summary","Check の詳細");c.append(h,D("p",l.title)),l.fields.condition?.length&&a.runs(c,l.fields.condition,new Set([l.id])),p.append(c),to(p,e,l),o.append(p)}}return o}const Co=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function al(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(l=>l.id)),i=[],o=new Set,r=new Set,s=t.filter(l=>l.basedOn.documentId===e.business.id&&l.basedOn.revision===e.business.revision),d=(l,p)=>s.some(g=>g.items.some(c=>c.id===l)&&(!p||g.index.some(c=>c.activityId===p&&c.checkIds.includes(l)))),a=(l,p,g,c,h=[])=>{const m=p.testSpecification,f=(m?.decisionCheckIds??[]).filter(E=>d(E,g)),b=(m?.resultCheckIds??[]).filter(E=>d(E,g)),A=(m?.decisionExampleIds??[]).filter(E=>s.some(j=>{const $=j.examples.find(R=>R.id===E),N=$?Gn(j,$):[];return N.length>0&&N.every(R=>d(R,g))})),y=p.samples.filter(E=>(!m||m.sampleIds.includes(E.id))&&E.checkIds?.length&&(m?E.checkIds.every(j=>d(j,g)):E.checkIds.some(j=>d(j,g)))),S=A.flatMap(E=>s.flatMap(j=>{const $=j.examples.find(N=>N.id===E);return $?Gn(j,$).filter(N=>d(N,g)):[]})),x=[...new Set([...f,...b,...S,...y.flatMap(E=>(E.checkIds??[]).filter(j=>d(j,g)))])];if(!x.length)return;const I=`fn:${g??"_"}:${l}:${p.id}`;r.has(I)||(r.add(I),i.push({key:I,activityId:g,groupId:l,capability:p,name:c,samples:y,checkIds:x,decisionCheckIds:f,resultCheckIds:b,decisionExampleIds:A,decisionTableCheckIds:[...new Set(S)],businessSections:h}))},u=e.model.presentation.activityViews;if(Array.isArray(u)){for(const l of u)if(!(!Co(l)||typeof l.activityId!="string"||!n.has(l.activityId)||!Array.isArray(l.testSpecificationFunctions)))for(const p of l.testSpecificationFunctions){if(!Co(p)||typeof p.groupId!="string"||typeof p.capabilityId!="string")continue;const g=e.model.reviewGroups.find(m=>m.id===p.groupId),c=g?.capabilities.find(m=>m.id===p.capabilityId);if(!g||!c)continue;o.add(JSON.stringify([g.id,c.id]));const h=[];if(Array.isArray(p.businessSections))for(const m of p.businessSections){if(!Co(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(b=>b.id===m.exceptionId&&b.activityId===l.activityId)))continue;const f=[...new Set(m.pages.filter(b=>b==="decision"||b==="result"))];f.length&&h.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:f})}a(g.id,c,l.activityId,typeof p.name=="string"&&p.name.trim()?p.name.trim():c.title,h)}}for(const l of e.model.reviewGroups)for(const p of l.capabilities)o.has(JSON.stringify([l.id,p.id]))||a(l.id,p,void 0,p.title);return i}function cr(e,t,n,i){const o=e.filter(s=>s.groupId===t&&s.capability.id===n),r=o.find(s=>s.samples.some(d=>d.id===i));if(r)return{kind:"sample",key:r.key,sampleId:i};for(const s of o){if(!s.capability.testSpecification)continue;const d=s.capability.samples.find(u=>u.id===i),a=s.decisionExampleIds.length?s.decisionTableCheckIds:s.decisionCheckIds;if(d?.checkIds?.some(u=>a.includes(u)))return{kind:"decision",key:"decision:"+s.key}}}const Tn=["landscape","overview"];function cl(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const r=document.createElement("div");r.className="shell-workbench",n.before(r);const s=document.createElement("aside");s.id="design-explorer",s.setAttribute("aria-label","設計ナビゲーション"),s.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",r.append(s,d),d.append(i,n);const a=document.createElement("div");a.className="shell-open-tabs",o.before(a),a.append(o),zc(a);const u=document.createElement("nav");u.className="concept-tabs",u.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(u);const l=document.createElement("nav");l.className="state-tabs",l.setAttribute("aria-label","開いている状態遷移"),a.append(l);const p=document.createElement("nav");p.className="spec-tabs",p.setAttribute("aria-label","開いているテスト仕様"),a.append(p);const g=document.createElement("section");g.id="concept-workspace",g.hidden=!0,g.setAttribute("aria-label","データ構造"),g.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(g);const c=document.createElement("section");c.id="states-workspace",c.hidden=!0,c.setAttribute("aria-label","状態遷移"),c.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(c);const h=document.createElement("section");h.id="tests-workspace",h.hidden=!0,h.setAttribute("aria-label","テスト仕様"),h.innerHTML='<main class="test-spec-page"></main>',d.append(h);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const f=document.createElement("section");f.id="empty-workspace",f.hidden=!0,f.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(f);const b=n.querySelector("#node-list-drawer");s.append(b);const A=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),S=s.querySelector("input"),x=s.querySelector("nav"),I=g.querySelector("iframe"),E=g.querySelector(".concept-related"),j=c.querySelector("article"),$="alder-explorer-v1:"+location.pathname,N=location.protocol==="file:"||location.origin==="null"?"*":location.origin,R=window.__alderConceptHtml;let L,Y,V,Z,H={},Q=[],oe=[...Tn],me=new Map,de=new Map,ye=new Map,Ie=new Map;const q=v=>ye.get(v)??v,B=v=>Ie.get(v)??v,_=v=>Y?.findGroup(me.get(v??"")),be=v=>V?.contentFor(me.get(v)??""),ie=(v,w)=>V?.findDataExample(me.get(v)??"",w),Ce=v=>V?.examplesFor(me.get(v)??"")??[],Pe=v=>Tn.includes(v)?"全体図":be(v)?.title??_(v)?.name??H[de.get(v)??""]?.name,ke=()=>{const v=t.business(),w=v.design?.model;return w?[...w.checks,...v.relatedChecks??[]].filter(M=>M.basedOn.documentId===w.business.id):[]},ce=()=>al(L,ke()),Ee=v=>ce().find(w=>w.key===(v.startsWith("decision:")?v.slice(9):v)),Ve=v=>ce().filter(w=>w.name===v.name).length>1?v.name+"（"+(t.business().activities.find(w=>w.id===v.activityId)?.name??"その他")+"）":v.name,Ge=v=>ke().some(w=>w.index.some(M=>M.activityId===v)||w.sections.some(M=>M.activityId===v)),Jt=v=>new Set(ce().filter(w=>w.activityId===v).flatMap(w=>w.checkIds)),wn=v=>{const w=new Set(ce().filter(M=>M.activityId===v).flatMap(M=>M.decisionExampleIds));return new Set(ke().flatMap(M=>M.examples.filter(O=>w.has(O.id)).map(O=>O.guaranteeId)))},an=v=>{const w=Jt(v),M=wn(v);return ke().some(O=>O.index.some(U=>U.activityId===v&&U.checkIds.some(X=>!w.has(X)))||O.sections.some(U=>U.activityId===v&&(U.preamble.length>0||O.guarantees.some(X=>X.sectionId===U.id&&!M.has(X.id)))))},Ba=()=>ke().some(v=>v.items.some(w=>!v.index.some(M=>M.checkIds.includes(w.id)))||v.sections.some(w=>w.activityId===null)||v.notes.length>0),Ga=v=>{const w=Ee(v);return w?w.capability.testSpecification?Ve(w)+"・"+(v.startsWith("decision:")?"可否":"結果"):w.name:(v==="@unassigned"?"未割当":v.startsWith("remaining:")?t.business().activities.find(M=>M.id===v.slice(10))?.name:v.startsWith("checks:")?t.business().activities.find(M=>M.id===v.slice(7))?.name:v==="@overview"?"テスト仕様":void 0)??v},xi=n.querySelector("#formattedMarkdownDrawer");xi&&r.append(xi),r.append(E,m),er(E,r,$+":drawer-width"),er(m,r,$+":test-drawer-width");let Ai=!1;const gt=t.rightDrawer??{isOpen:()=>Ai,setOpen:v=>{Ai=v}};let se="business",We=!1,st=[],K="overview",rt=[],yt="",vt=[],Te="@overview",Ln,_t=innerWidth>800,Ei=!1,Oi=!0,wt=!1,Qn;const kt=new Map,Ot=new Map([["overview",I]]),mt=new Map,kn=new Map,In=new Map,ze=new Map,cn=new Map,jt=new Set,Ke=new Set,Sn=new Set,Xe=new Map;let Oe;try{if(Oe=JSON.parse(sessionStorage.getItem($)||"null"),Oe){if(wt=Oe.overviewClosed===!0,Qn=typeof Oe.documentKey=="string"?Oe.documentKey:void 0,_t=typeof Oe.left=="boolean"?Oe.left:_t,Array.isArray(Oe.expanded)){Ke.clear();for(const v of Oe.expanded)typeof v=="string"&&Ke.add(v)}rt=Array.isArray(Oe.states)?Oe.states.filter(v=>typeof v=="string"):[],t.rightDrawer||(typeof Oe.rightOpen=="boolean"?Ai=Oe.rightOpen:typeof Oe.right?.["concept:"+Oe.active]=="boolean"&&(Ai=Oe.right["concept:"+Oe.active]))}}catch{}function Ha(){if(!(!Oe||Qn!==t.business().key||!We)){for(const v of Array.isArray(Oe.overviewModes)?Oe.overviewModes:[])_(v)&&jt.add(v);for(const[v,w]of Object.entries(Oe.lastExamples??Oe.examples??{}))typeof w=="string"&&ie(v,w)&&cn.set(v,w);for(const[v,w]of Object.entries(Oe.examples??{}))typeof w=="string"&&ie(v,w)&&ze.set(v,w);for(const[v,w]of Object.entries(Oe.selected??{}))typeof w=="string"&&Q.includes(w)&&mt.set(v,w);st=[...new Set((Array.isArray(Oe.concepts)?Oe.concepts:[]).filter(v=>typeof v=="string"&&oe.includes(v)))],K=st.includes(Oe.active)?Oe.active:"landscape"}}let xn;const He=()=>{try{sessionStorage.setItem($,JSON.stringify({documentKey:Ln,overviewClosed:wt,selected:Object.fromEntries(mt),examples:Object.fromEntries(ze),lastExamples:Object.fromEntries(cn),overviewModes:[...jt],left:_t,expandedVersion:4,expanded:[...Ke],concepts:st,active:K,states:rt,specs:vt,activeSpec:Te,specExamples:Object.fromEntries(kt),...t.rightDrawer?{}:{rightOpen:gt.isOpen()}}))}catch{}},dn=()=>{se==="concept"&&Xe.set("drawer:"+K,E.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&gt.isOpen()&&jt.has(K)&&Xe.set("review-overview:"+K,E.querySelector(".data-review-overview").scrollTop),se==="concept"&&ze.has(K)&&Xe.set("example:"+K+":"+ze.get(K),E.querySelector(".data-examples-panel").scrollTop),se==="states"&&yt&&Xe.set("state:"+yt,j.scrollTop),se==="tests"&&Xe.set("tests:"+Te,h.querySelector(".test-spec-page").scrollTop),se==="concept"&&K==="landscape"&&Xe.set("concept:landscape",g.querySelector(".concept-review-landscape").scrollTop)};function Ze(v=!0){if(Ei)return;const w=new URL(location.href);if(w.searchParams.set("view",se),w.searchParams.delete("concept"),w.searchParams.delete("dataExample"),w.searchParams.delete("dataView"),se==="concept"&&gt.isOpen()&&jt.has(K)?w.searchParams.set("dataView","overview"):se==="concept"&&_(K)&&!ze.has(K)&&w.searchParams.set("dataView","structure"),se==="concept"&&gt.isOpen()&&ze.has(K)&&w.searchParams.set("dataExample",ze.get(K)),se==="tests"&&kt.has(Te)&&w.searchParams.set("dataExample",kt.get(Te)),w.searchParams.delete("state"),w.searchParams.delete("activity"),w.searchParams.delete("object"),w.searchParams.delete("spec"),se==="concept"&&w.searchParams.set("concept",K),se==="states"&&yt&&w.searchParams.set("state",yt),se==="tests"&&w.searchParams.set("spec",Te),se==="business"){const M=t.business(),O=M.views?.find(U=>U.key===M.viewKey);O?.activity?w.searchParams.set("activity",O.activity):O?.object&&w.searchParams.set("object",O.object)}w.href!==location.href&&history[v?"pushState":"replaceState"]({alderShell:!0},"",w)}function Re(v,w,M){const O=document.createElement(w);return O.textContent=M,v.append(O),O}function It(v){v!==se&&(se==="business"?t.capture():dn(),se=v),n.hidden=se!=="business",g.hidden=se!=="concept",c.hidden=se!=="states",h.hidden=se!=="tests",f.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),Dt(),St()}function Tt(v,w=!0){We&&(v==="subsystems"&&(v="landscape"),oe.includes(v)&&(dn(),st.includes(v)||st.push(v),K=v,It("concept"),Ao(),Ct(),He(),w&&Ze()))}function Ja(){dn(),ze.delete(K),jt.add(K),Ao(),E.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer-overview:"+K)??0,He(),Ze()}function _a(v,w=!0){if(v&&!ie(K,v))return;const M=!ze.has(K),O=E.querySelector(".concept-drawer-body");M&&Xe.set("drawer-overview:"+K,O.scrollTop),dn(),jt.delete(K),v?(ze.set(K,v),cn.set(K,v)):ze.delete(K),gt.setOpen(!0),Ao(),M&&(O.scrollTop=0),He(),Ze(),w&&E.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}E.querySelector(".concept-example-back").onclick=()=>{Ja(),E.querySelector(".data-review-overview").focus({preventScroll:!0})};function Nn(v,w=!0){t.business().states?.some(M=>M.id===v)&&(dn(),rt.includes(v)||rt.push(v),yt=v,It("states"),nc(),Ct(),He(),w&&Ze())}function vo(v){return v.startsWith("decision:")&&Ee(v)&&!Ee(v)?.capability.testSpecification?Ee(v).key:Ee(v)||v==="@overview"||v==="@unassigned"||v.startsWith("checks:")&&Ge(v.slice(7))||v.startsWith("remaining:")&&an(v.slice(10))?v:t.business().activities.some(w=>w.id===v)?ce().find(w=>w.activityId===v)?.key??(Ge(v)?"checks:"+v:"@overview"):"@overview"}function qt(v,w=!0){const M=t.business();if(!M.design?.model||!M.key)return;v=vo(v),se==="tests"&&v!==Te&&dn(),vt.includes(v)||vt.push(v),Te=v;const O=Ee(v);Ei||(O?.capability.testSpecification?Ke.add("tests-function-"+O.key):O?.activityId?Ke.add("tests-activity-"+O.activityId):v.startsWith("checks:")?Ke.add("tests-activity-"+v.slice(7)):v.startsWith("remaining:")?Ke.add("tests-activity-"+v.slice(10)):O&&Ke.add("tests-other")),It("tests"),wo(),Ct(),St(),He(),w&&Ze()}function wo(){const v=t.business().design;if(!v?.model)return;const w=h.querySelector(".test-spec-page"),M=Ee(Te);if(M){const O=document.createElement("section");O.className="test-spec-sample";const U=Y?.findGroup(M.groupId),X=M.samples.find(pe=>pe.id===kt.get(Te))??M.samples[0],G=!!M.capability.testSpecification,ee=Te.startsWith("decision:");if(G)if(Re(O,"h2",M.name),Re(O,"h3",ee?"可否判定":"処理結果"),ee)M.decisionExampleIds.length?O.append(ol(v,M.decisionExampleIds,ke())):M.decisionCheckIds.length?O.append(sl(v,M.decisionCheckIds,ke())):Re(O,"p","可否条件の記載はありません。");else{const pe=U&&X&&V?new Set(M.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(O.append(rl(v,M.resultCheckIds,ke(),pe)),U&&X&&V){Re(O,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",O.append(Le),V.renderDataExample(Le,U,X.id,Fe=>{Xe.set("tests:"+Te,w.scrollTop),kt.set(Te,Fe),wo(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:M.capability.id,sampleIds:M.samples.map(Fe=>Fe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(U&&X&&V){const pe=document.createElement("div");pe.className="data-examples-panel test-spec-examples",O.append(pe),V.renderDataExample(pe,U,X.id,Le=>{Xe.set("tests:"+Te,w.scrollTop),kt.set(Te,Le),wo(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:M.capability.id,heading:M.name,sampleIds:M.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(tl(v,X.checkIds??[],ke()))})}w.replaceChildren(O)}else if(Te==="@overview")w.replaceChildren(),Re(w,"p","左のメニューからテスト仕様を選択してください。");else if(Te.startsWith("remaining:")){const O=Te.slice(10);w.replaceChildren(ar(v,O,ke(),Jt(O),wn(O)))}else w.replaceChildren(ar(v,Te.startsWith("checks:")?Te.slice(7):void 0,ke()));Za(M),w.scrollTop=Xe.get("tests:"+Te)??0}function ei(v){v||(wt=!1),It("business"),v?t.openActivity(v):(wt=!1,t.openOverview()),St(),Ct(),Ze()}function Ka(v){It("business"),t.openObject(v),St(),Ct(),Ze()}function Us(v){const w=t.business(),M=w.design?.model;return M?[...new Set(M.states.filter(O=>O.objectId===v&&O.basedOn.documentId===M.business.id&&O.basedOn.revision===M.business.revision).flatMap(O=>O.transitions.map(U=>U.activityId)))]:[...new Set((w.design?.objectStateTransitions?.[v]?.model?.transitions??[]).flatMap(O=>O.activityId?[O.activityId]:[]))]}function Vs(v){return(t.business().states??[]).filter(w=>Us(w.id).includes(v))}function Fs(v){const w=t.business(),M=w.design?.model,O=L?.model.concepts.find(U=>U.id===v);return!M||!L||!O?[]:(w.states??[]).filter(U=>O.businessObjectIds.includes(U.id)&&M.states.some(X=>X.objectId===U.id&&X.basedOn.documentId===M.business.id&&X.basedOn.revision===M.business.revision&&L.model.relatedStates.some(G=>G.documentId===X.id&&G.revision===X.revision)))}function ko(v,w,M="状態遷移"){if(!w.length)return;const O=document.createElement("section");O.className="shell-related-links",Re(O,"h3",M);for(const U of w){const X=Kt(O,U.name,()=>Nn(U.id));X.dataset.relatedState=U.id}v.append(O)}function Bs(v){const w=L?.model.reviewGroups.find(O=>O.id===v.groupId);if(!w)return[];const M=new Set(w.graph.nodes.map(O=>O.conceptId));return[...new Set(v.samples.flatMap(O=>O.blocks.map(U=>U.card)))].filter(O=>M.has(O)&&L?.model.concepts.some(U=>U.id===O))}function Kt(v,w,M){const O=document.createElement("button");return O.type="button",O.className="shell-evidence",Re(O,"span",w),O.onclick=M,v.append(O),O}function Io(v,w){const M=w.filter(U=>U.capability.testSpecification);if(!M.length)return;const O=document.createElement("section");O.className="shell-test-links",Re(O,"h3","テスト仕様書");for(const U of M)for(const[X,G]of[["decision:","可否判定"],["","処理結果"]]){const ee=X+U.key,pe=Kt(O,Ve(U)+"・"+G,()=>qt(ee));pe.dataset.relatedSpec=ee}v.append(O)}function Xa(v,w){const M=ce().filter(ee=>ee.activityId===w&&ee.capability.testSpecification),O=L?.model.presentation.activityViews,U=Array.isArray(O)?O.find(ee=>ee&&typeof ee=="object"&&ee.activityId===w):void 0,X=Array.isArray(U?.uncreatedTestSections)?U.uncreatedTestSections:[],G=v.querySelectorAll("[data-business-result],[data-business-exception]");for(const ee of Array.from(G)){const pe=ee.dataset.businessException,Le=pe?"exception":"result",Fe=pe??"result",Be=M.flatMap(at=>at.businessSections.filter($t=>$t.kind===Le&&(Le==="result"||$t.exceptionId===pe)).flatMap($t=>$t.pages.filter(J=>J==="decision"?at.decisionCheckIds.length||at.decisionExampleIds.length:at.resultCheckIds.length||at.samples.length).map(J=>({target:at,page:J})))),Mt=document.createElement("section");Mt.className="shell-section-links",Mt.setAttribute("aria-label","テスト仕様書"),ee.dataset.resultScope==="activity"&&Re(Mt,"p",(Be.length?"Activity全体との対応です。":"")+"各Resultとの対応は未確認です。");const ht=new Set;for(const{target:at,page:$t}of Be){const J=($t==="decision"?"decision:":"")+at.key;if(ht.has(J))continue;ht.add(J);const De=Kt(Mt,Ve(at)+"・"+($t==="decision"?"可否判定":"処理結果"),()=>qt(J));De.dataset.relatedSpec=J}if(!ht.size){const at=Re(Mt,"p",X.includes(Fe)?"テスト仕様書未作成":"テスト仕様書との対応未確認");at.className="shell-spec-warning"}ee.after(Mt)}Io(v,M.filter(ee=>!ee.businessSections.length))}function Za(v){const w=m.querySelector(".spec-related-content");if(w.replaceChildren(),!v?.capability.testSpecification)return;const M=t.business().activities.find(X=>X.id===v.activityId),O=Y?.findGroup(v.groupId);if(M){Re(w,"h3","Activity");const X=Kt(w,M.name,()=>ei(M.id));X.dataset.relatedActivity=M.id}if(O){Re(w,"h3","概念モデル");const X=Kt(w,O.name,()=>Tt(q(O.id)));X.dataset.relatedGroup=O.id}const U=Bs(v);if(U.length){Re(w,"h3","概念");for(const X of U){const G=L.model.concepts.find(pe=>pe.id===X),ee=Kt(w,G.name,()=>Tt(B(X)));ee.dataset.relatedConcept=X}}v.activityId&&ko(w,Vs(v.activityId),"状態遷移（同じ Activity）")}function Ya(v,w){Re(v,"h3","Activity");const M=t.business(),O=_(K),U=L?.model.concepts.find(G=>G.id===w),X=O?.concepts[w]?.sourceActivities??O?.activities??U?.activityLinks.filter(G=>G.uses.includes("生成")).map(G=>G.activityId)??[];for(const G of X){const ee=M.activities.find(Le=>Le.id===G);if(!ee)continue;const pe=document.createElement("button");pe.className="shell-evidence",Re(pe,"span",ee.name),pe.title=ee.name+"を業務タブで開く",pe.setAttribute("aria-label",pe.title),pe.onclick=()=>ei(ee.id),v.append(pe)}}function So(v){const w=_(v);return w?Y?.graph(w.id):v==="overview"?Y?.overviewGraph():void 0}function Gs(v){const w=kn.get(K),M=w?So(K)?.tables[w]:void 0;return M?.conceptId===v?M:void 0}function Qa(v,w){const M=Gs(w)??_(K)?.concepts[w]??{...H[w],sources:void 0};v.replaceChildren(),Re(v,"p",M.note),Re(v,"h3","持つ情報");const O=document.createElement("ul");for(const[,U]of M.fields)Re(O,"li",U);if(v.append(O),M.sources?.length){Re(v,"h3","情報の出所・対象時点");const U=document.createElement("ul");for(const X of M.sources)Re(U,"li",X);v.append(U)}Ya(v,w),Io(v,ce().filter(U=>Bs(U).includes(w))),ko(v,Fs(w))}function xo(v){const w=E.querySelector(".shell-heading strong");w.textContent=v,E.setAttribute("aria-label",v)}function Hs(v=!1){_(K)&&(mt.delete(K),kn.delete(K),In.delete(K),v||Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},N),ji(),Dt(),E.querySelector(".concept-drawer-body").scrollTop=0,He())}E.querySelector(".concept-selection-clear").onclick=()=>{Hs(),ze.has(K)?E.querySelector(".concept-example-back").focus({preventScroll:!0}):E.querySelector(".data-review-overview").focus({preventScroll:!0})};function ji(){const v=E.querySelector(".concept-related-content");E.querySelector(".concept-selection").hidden=!!_(K)&&!mt.has(K)&&!In.has(K),E.querySelector(".concept-selection>h2").hidden=!_(K),E.querySelector(".concept-selection-clear").hidden=!_(K);const w=In.get(K);if(w&&Z){const X=Z.describe(v,{kind:"group",id:w});xo(X);return}if(K==="landscape"&&xn){v.replaceChildren();for(const[X,G]of Z.sections){Re(v,"h3",X);const ee=document.createElement("ul");for(const pe of G)Re(ee,"li",pe);v.append(ee)}xo("サブシステムの情報");return}const M=mt.get(K),O=_(K),U=We&&M?Gs(M)?.name??O?.concepts[M]?.name??H[M].name:O?.name??"データ構造の情報";xo(U),We&&M?Qa(v,M):(v.replaceChildren(),O||Re(v,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function Js(v){v.onload=()=>{_s(),v.contentDocument&&(Ys(v.contentDocument),Qs(v.contentDocument));const w=v.dataset.conceptView??"overview";if(!Y||!L)return;const M=_(w),O=M?Y.graph(M.id):w==="overview"?Y.overviewGraph():{ids:Q,edges:Y.edges,tables:H};v.contentWindow?.postMessage({type:"alder-concept-data",graph:O,focus:de.get(w),viewKey:w,documentKey:Ln??L.model.id,clearSelectionOnBackground:!!M},N);const U=mt.get(w);U&&v.contentWindow?.postMessage({type:"alder-concept-highlight",id:U},N)}}Js(I),I.dataset.conceptView="overview";function ec(){E.querySelector(".concept-page-details").hidden=!0,E.querySelector(".concept-example-back").hidden=!0;const v=E.querySelector(".data-review-overview");v.hidden=!0,v.replaceChildren();const w=E.querySelector(".data-examples-panel");w.hidden=!0,w.replaceChildren(),delete w.dataset.dataExample,xn?.root.remove(),xn=void 0;for(const[M,O]of Ot)M!=="overview"&&(O.remove(),Ot.delete(M));I.removeAttribute("src"),I.removeAttribute("srcdoc"),mt.clear(),kn.clear(),In.clear()}function Ao(){g.setAttribute("aria-label",K==="landscape"||_(K)?"サブシステム":"データ構造"),g.querySelector(".concept-empty").hidden=We;const v=g.querySelector(".concept-review-landscape"),w=_(K),M=E.querySelector(".concept-page-details"),O=E.querySelector(".data-review-overview"),U=E.querySelector(".data-examples-panel");if(M.hidden=!We||!w,O.hidden=!We||!w||ze.has(K),U.hidden=!We||!w||!ze.has(K),E.querySelector(".concept-example-back").hidden=U.hidden,We&&w){const G=ce();Hc(O,w,V,(pe,Le)=>{const Fe=cr(G,w.id,pe,Le);if(Fe)return{kind:Fe.kind,open:()=>{const Be=cr(ce(),w.id,pe,Le);Be&&(Be.sampleId?kt.set(Be.key,Be.sampleId):kt.delete(Be.key),qt(Be.key))}}},pe=>ei(pe),t.business().activities),Io(O,G.filter(pe=>pe.groupId===w.id));const ee=ze.get(K)??cn.get(K)??Ce(K)[0]?.id;ee&&V.renderDataExample(U,w,ee,pe=>_a(pe)),O.scrollTop=Xe.get("review-overview:"+K)??0,U.scrollTop=Xe.get("example:"+K+":"+ee)??0}if(v.hidden=!We||!Tn.includes(K),We&&Tn.includes(K)&&(K==="landscape"&&!xn&&(xn=Yc(document,L,Ln??L.model.id,G=>Tt(q(G)))),Gc(v,xn?.root,K==="overview"?"graph":"overview"),K==="landscape"&&xn?.restore()),We&&K!=="landscape"&&!Ot.has(K)){const G=document.createElement("iframe");G.className="concept-frame",G.dataset.conceptView=K,G.title=w?w.name+"のデータ構造":H[de.get(K)].name+"と隣接する概念",G.hidden=!0,Ot.set(K,G);const ee=de.get(K);ee&&mt.set(K,mt.get(K)??ee),Js(G),g.querySelector(".concept-main").append(G)}for(const[G,ee]of Ot)ee.hidden=!We||G!==K,We&&G===K&&!ee.hasAttribute("src")&&!ee.hasAttribute("srcdoc")&&(R?ee.srcdoc=R:ee.src=new URL("concept.html?view=overview"+(_(G)?"&group="+encodeURIComponent(_(G).id):G==="overview"?"":"&focus="+encodeURIComponent(de.get(G))),document.baseURI).href);const X=mt.get(K);X&&Ot.get(K)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:X},N),ji(),Dt(),E.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer:"+K)??0}function Pn(){const v=t.business(),w=v.views?.find(M=>M.activity!==void 0||M.object!==void 0||!wt);w?(It("business"),t.activateView(w.key)):st.length?Tt(st.at(-1),!1):rt.length?Nn(rt.at(-1),!1):vt.length?qt(vt.at(-1),!1):It("empty")}function tc(){if(wt=!0,se==="business"){const v=t.business().views?.find(w=>w.key===t.business().viewKey);!v?.activity&&!v?.object&&Pn()}Ct(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function nc(){j.replaceChildren();const v=t.business().states?.find(ee=>ee.id===yt);if(!v)return;const w=t.statePanel(v.id);w?j.append(w):Re(j,"p","この対象の状態遷移は未定義です。");const M=m.querySelector(".spec-related-content");M.replaceChildren();const O=Us(v.id),U=t.business().activities.filter(ee=>O.includes(ee.id));if(U.length){Re(M,"h3","Activity");for(const ee of U){const pe=Kt(M,ee.name,()=>ei(ee.id));pe.dataset.relatedActivity=ee.id}}const X=L?.model.concepts.filter(ee=>Fs(ee.id).some(pe=>pe.id===v.id))??[];if(X.length){Re(M,"h3","概念");for(const ee of X){const pe=Kt(M,ee.name,()=>Tt(B(ee.id)));pe.dataset.relatedConcept=ee.id}}const G=ce().filter(ee=>ee.activityId&&O.includes(ee.activityId)&&ee.capability.testSpecification);if(G.length){Re(M,"h3","Activity に関連するテスト仕様書");for(const ee of G)for(const[pe,Le]of[["decision:","可否判定"],["","処理結果"]]){const Fe=pe+ee.key,Be=Kt(M,Ve(ee)+"・"+Le,()=>qt(Fe));Be.dataset.relatedSpec=Fe}}j.scrollTop=Xe.get("state:"+yt)??0}let Eo="";function Ct(){for(const O of Array.from(o.querySelectorAll(".tab"))){const U=t.business().views?.find(G=>G.key===O.dataset.key);O.hidden=wt&&U?.activity===void 0&&U?.object===void 0;const X=!O.hidden&&se==="business"&&O.dataset.key===t.business().viewKey;O.classList.toggle("active",X),O.querySelector("button")?.setAttribute("aria-current",String(X))}const v=(O,U,X)=>{O.replaceChildren();for(const G of U){const ee=X==="concept"?Pe(G):t.business().states?.find(ht=>ht.id===G)?.name??G,pe=se===X&&G===(X==="concept"?K:yt),Le=document.createElement("div");Le.className="tab"+(pe?" active":"");const Fe=X==="concept"&&(G==="landscape"||_(G))?"subsystems":X;Le.dataset.viewKind=Fe;const Be=document.createElement("button");Be.id=(X==="concept"?"concept-tab-":"state-tab-")+G,$o(Be,Fe,ee),Be.setAttribute("aria-current",String(pe)),Be.onclick=()=>X==="concept"?Tt(G):Nn(G),Le.append(Be);const Mt=Wo((Fe==="subsystems"?"サブシステム：":X==="concept"?"データ構造：":"状態遷移：")+ee+"のタブを閉じる");Mt.onclick=()=>{dn(),X==="concept"?(st=st.filter(ht=>ht!==G),G!=="overview"&&(Ot.get(G)?.remove(),Ot.delete(G)),mt.delete(G),kn.delete(G),In.delete(G),ze.delete(G),cn.delete(G),jt.delete(G),se===X&&K===G&&(st.length?Tt(st.at(-1),!1):Pn())):(rt=rt.filter(ht=>ht!==G),se===X&&yt===G&&(rt.length?Nn(rt.at(-1),!1):Pn())),Ct(),St(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(Mt),O.append(Le)}};v(u,st,"concept"),v(l,rt,"states"),p.replaceChildren();for(const O of vt){const U=Ga(O),X=document.createElement("div");X.className="tab"+(se==="tests"&&O===Te?" active":""),X.dataset.viewKind="tests";const G=document.createElement("button");G.id="spec-tab-"+O,$o(G,"tests",U),G.setAttribute("aria-current",String(se==="tests"&&O===Te)),G.onclick=()=>qt(O);const ee=Wo("テスト仕様："+U+"のタブを閉じる");ee.onclick=()=>{vt=vt.filter(pe=>pe!==O),se==="tests"&&Te===O&&(vt.length?qt(vt.at(-1),!1):Pn()),Ct(),St(),He(),Ze()},X.append(G,ee),p.append(X)}const w=a.querySelector(".tab.active:not([hidden])"),M=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+K:se==="states"?"states:"+yt:se==="tests"?"tests:"+Te:"";w?(M!==Eo&&Uc(a,w),Eo=M):Eo=""}function ic(){innerWidth<=800&&Ci(!1)}function St(){const v=x.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,w=x.scrollTop,M=t.business(),O=S.value.trim().toLocaleLowerCase();x.replaceChildren();const U=(J,De,ct)=>({kind:"item",id:J,name:De,key:ct}),X=(J,De,ct)=>({kind:"group",id:J,name:De,children:ct}),G=ce(),ee=J=>U(J.key,J.name,"tests:"+J.key),pe=G.filter(J=>J.capability.testSpecification),Le=G.filter(J=>!J.capability.testSpecification),Fe=pe.map(J=>X("tests-function-"+J.key,Ve(J),[U("decision:"+J.key,"可否判定","tests:decision:"+J.key),U(J.key,"処理結果","tests:"+J.key)]));for(const J of M.activities){const De=Le.filter(nt=>nt.activityId===J.id).map(ee),ct=(Jt(J.id).size?"remaining:":"checks:")+J.id;an(J.id)&&De.push(U(ct,"その他","tests:"+ct)),De.length&&Fe.push(X("tests-activity-"+J.id,J.name,De))}const Be=Le.filter(J=>!J.activityId);Be.length&&Fe.push(X("tests-other","その他",Be.map(ee))),Ba()&&Fe.push(U("@unassigned","未割当","tests:@unassigned"));const Mt=[{id:"business",label:"業務設計",items:[U("overview","全体図","business:overview"),X("business-activity","Activity",M.activities.map(J=>U(J.id,J.name,"business:"+J.id))),X("business-object","Object",(M.objects??[]).map(J=>U(J.id,J.name,"object:"+J.id)))]},{id:"states",label:"状態遷移",items:(M.states??[]).map(J=>U(J.id,J.name,"states:"+J.id))},{id:"subsystems",label:"サブシステム",items:L?.model.subsystems.length?[U("landscape","全体図","concept:landscape"),...L.model.subsystems.map(J=>X("subsystem-"+J.id,J.name.replace(/サブシステム$/,""),L.model.reviewGroups.filter(De=>De.subsystemId===J.id).map(De=>U(q(De.id),De.title,"concept:"+q(De.id)))))]:[]},{id:"concept",label:"データ構造",items:We&&Q.length?[U("overview","全体図","concept:overview"),X("concept-relations","概念",Q.map(J=>U(B(J),H[J].name,"concept:"+B(J))))]:[]},{id:"tests",label:"テスト仕様",items:M.design?.model&&(G.length||ke().length)?Fe:[]}];let ht=0;const at=(J,De,ct)=>{const nt=document.createElement("button");nt.className="explorer-item"+(ct?" explorer-item-nested":""),nt.dataset.explorerKey=J.key,nt.textContent=J.name;const Ye=M.views?.find(Je=>Je.key===M.viewKey);return se===(De.id==="subsystems"?"concept":De.id)&&(["concept","subsystems"].includes(De.id)?J.id===K:De.id==="states"?J.id===yt:De.id==="tests"?J.id===Te:J.key.startsWith("object:")?Ye?.object===J.id:J.id==="overview"?!wt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===J.id)&&nt.setAttribute("aria-current","page"),nt.disabled=De.id==="business"&&!M.key,nt.onclick=()=>{b.hidden||t.closeLegacyList(),De.id==="business"?J.key.startsWith("object:")?Ka(J.id):ei(J.id==="overview"?void 0:J.id):De.id==="concept"||De.id==="subsystems"?Tt(J.id):De.id==="tests"?qt(J.id):Nn(J.id),ic()},nt},$t=(J,De,ct,nt=!1)=>{const Ye=document.createElement("button"),Wt=O?!Sn.has(J):Ke.has(J);return Ye.className=(ct?"explorer-subparent":"explorer-parent")+(nt?" explorer-pending":""),Ye.dataset.explorerKey="group:"+J,Re(Ye,"span",De).className="explorer-parent-label",nt?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(Wt)),Ye.setAttribute("aria-controls","explorer-"+J),Ye.append(Wc(Wt)),Ye.onclick=()=>{O?Sn.has(J)?Sn.delete(J):Sn.add(J):(Ke.has(J)?Ke.delete(J):Ke.add(J),He()),St()},Ye)};for(const J of Mt){const De=J.items.flatMap(Je=>{if(Je.kind==="item")return!O||(J.label+" "+Je.name).toLocaleLowerCase().includes(O)?[Je]:[];const ln=O?Je.children.filter(jo=>(J.label+" "+Je.name+" "+jo.name).toLocaleLowerCase().includes(O)):Je.children;return!O||ln.length?[{...Je,children:ln}]:[]});if(O&&!De.length)continue;const ct=J.id!=="business"&&!J.items.length,nt=document.createElement("section"),Ye=$t(J.id,J.label,!1,ct),Wt=document.createElement("div");Wt.id="explorer-"+J.id,Wt.hidden=ct||(O?Sn.has(J.id):!Ke.has(J.id));for(const Je of De){if(Je.kind==="item"){Wt.append(at(Je,J,0)),ht++;continue}const ln=document.createElement("div");ln.id="explorer-"+Je.id,ln.hidden=O?Sn.has(Je.id):!Ke.has(Je.id),Wt.append($t(Je.id,Je.name,!0),ln);for(const jo of Je.children)ln.append(at(jo,J,1)),ht++;!Je.children.length&&!O&&(Re(ln,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!De.length&&!ct&&(Re(Wt,"p","項目がありません。").className="explorer-empty"),nt.append(Ye,Wt),x.append(nt)}O&&!ht&&(Re(x,"p","該当する項目はありません。").className="explorer-empty"),x.scrollTop=w,v&&Array.from(x.querySelectorAll("[data-explorer-key]")).find(J=>J.dataset.explorerKey===v)?.focus({preventScroll:!0})}function Ci(v){_t=v,Dt(),He(),(v?s.querySelector(".shell-heading button"):A).focus({preventScroll:!0})}A.addEventListener("click",v=>{v.preventDefault(),v.stopImmediatePropagation(),Ci(!_t)},!0),s.querySelector(".shell-heading button").onclick=()=>Ci(!1),S.oninput=()=>{Sn.clear(),St()},s.addEventListener("keydown",v=>{if(v.key==="Escape"&&!v.defaultPrevented&&b.hidden&&(v.preventDefault(),v.stopPropagation(),Ci(!1)),(v.key==="ArrowDown"||v.key==="ArrowUp")&&x.contains(document.activeElement)){const w=Array.from(x.querySelectorAll("button")).filter(U=>!U.disabled&&!U.closest("[hidden]")),M=w.indexOf(document.activeElement),O=w[M+(v.key==="ArrowDown"?1:-1)];O&&(v.preventDefault(),O.focus())}}),y.addEventListener("click",v=>{se!=="business"&&(v.preventDefault(),v.stopImmediatePropagation(),(se==="concept"||se==="states"||se==="tests"&&Ee(Te)?.capability.testSpecification)&&(gt.setOpen(!gt.isOpen()),Dt(),He(),Ze(!1)))},!0),E.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Dt(),He(),Ze(!1),y.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Dt(),He(),Ze(!1),y.focus({preventScroll:!0})},window.addEventListener("message",v=>{if(v.origin!==location.origin&&!(location.protocol==="file:"&&v.origin==="null"))return;const w=Array.from(Ot).find(([,O])=>v.source===O.contentWindow);if(!w)return;if(v.data?.type==="alder-concept-rendered"){w[1].contentDocument&&(Ys(w[1].contentDocument),Qs(w[1].contentDocument));return}if(se!=="concept"||w[0]!==K)return;const M=_(K);if(v.data?.type==="alder-concept-clear-selection"){M&&Hs(!0);return}if(v.data?.type==="alder-concept-subsystem"){if(!So(K)?.regions.some(O=>O.id===v.data.id))return;mt.delete(K),kn.delete(K),In.set(K,v.data.id),ji(),Dt(),He();return}if(!(!Q.includes(v.data?.id)||M&&!M.concepts[v.data?.id])){if(v.data.type==="alder-concept-open"){Tt(B(v.data.id));return}v.data.type==="alder-concept-select"&&(In.delete(K),mt.set(K,v.data.id),(typeof v.data.viewId=="string"?So(K)?.tables[v.data.viewId]:void 0)?.conceptId===v.data.id?kn.set(K,v.data.viewId):kn.delete(K),innerWidth<=800&&(_t=!1),ji(),Dt(),He())}});function _s(){const v=getComputedStyle(document.documentElement);for(const w of Ot.values()){const M=w.contentDocument?.documentElement;if(M){M.dataset.theme=document.documentElement.dataset.theme??"light";for(const O of["--bg","--panel","--fg","--line","--subtle","--select"])M.style.setProperty(O,v.getPropertyValue(O))}}}function Dt(){!b.hidden&&se==="business"&&(_t=!0),s.hidden=!_t,A.disabled=!1,A.setAttribute("aria-controls","design-explorer"),A.setAttribute("aria-label","ナビゲーションを開閉"),A.setAttribute("aria-expanded",String(_t));const v=gt.isReady?.()??!0;E.hidden=se!=="concept"||!We||!v||!gt.isOpen();const w=!!Ee(Te)?.capability.testSpecification;m.hidden=!(se==="states"||se==="tests"&&w)||!v||!gt.isOpen(),xi&&se!=="business"&&(xi.hidden=!0),se==="concept"?(y.disabled=!We||!v,y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉"),y.setAttribute("aria-expanded",String(!E.hidden))):se==="business"?y.setAttribute("aria-controls","formattedMarkdownDrawer"):se==="states"||se==="tests"&&w?(y.disabled=!v,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!m.hidden))):(se==="tests"||se==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const M=i.querySelector("#document-actions");M&&(M.hidden=se!=="business");const O=i.querySelector("#document-actions-toggle");O&&se!=="business"&&(O.hidden=!0),_s(),Oo()}function Oo(){const v=i.getBoundingClientRect().bottom;v>0&&e.style.setProperty("--shell-content-top",v+"px")}if(typeof ResizeObserver<"u"){const v=new ResizeObserver(Oo);v.observe(i),v.observe(e.querySelector("header"))}window.addEventListener("resize",Oo);function Ks(){dn(),Ei=!0;try{const v=new URL(location.href).searchParams;if(se==="concept"&&v.get("view")==="concept"&&v.get("concept")===K&&!ze.has(K)&&ie(K,v.get("dataExample"))&&Xe.set("drawer-overview:"+K,E.querySelector(".concept-drawer-body").scrollTop),We||(jt.clear(),ze.clear(),cn.clear(),st=[],K="overview",I.removeAttribute("src"),I.removeAttribute("srcdoc")),v.get("view")==="concept"){const w=We&&oe.includes(v.get("concept")??"")?v.get("concept"):"landscape",M=v.get("dataExample");We&&_(w)&&v.get("dataView")==="overview"&&!ie(w,M)?(jt.add(w),ze.delete(w)):(jt.delete(w),We&&ie(w,M)?(ze.set(w,M),cn.set(w,M)):ze.delete(w)),Tt(w,!1)}else if(v.get("view")==="states")t.business().states?.some(w=>w.id===v.get("state"))?Nn(v.get("state"),!1):Pn();else if(v.get("view")==="tests"){const w=vo(v.get("spec")??"@overview"),M=v.get("dataExample"),O=Ee(w);O&&M&&O.samples.some(U=>U.id===M)?kt.set(w,M):O&&kt.delete(w),qt(w,!1)}else if(v.get("view")==="empty")It("empty");else if(It("business"),t.business().key){const w=v.get("activity"),M=v.get("object"),O=t.business(),U=O.views?.find(X=>X.key===O.viewKey);w&&O.activities.some(X=>X.id===w)?U?.activity!==w&&t.openActivity(w):M&&O.objects?.some(X=>X.id===M)?U?.object!==M&&t.openObject(M):(wt=!1,(!U||U.activity!==void 0||U.object!==void 0)&&t.openOverview())}Ct(),St()}finally{Ei=!1}}return window.addEventListener("popstate",Ks),{closeBusinessOverview:tc,reopenBusinessOverview(){wt=!1},activateBusiness(){It("business")},businessActivated(){It("business"),Ct(),St(),Ze()},syncChrome:Dt,appendActivityTestLinks(v,w){Xa(v,w),ko(v,Vs(w))},openRelatedChecks(v){Ke.add("tests"),qt(v&&Ge(v)?"checks:"+v:"@overview")},syncDocument(){const v=t.business(),w=v.concept,M=!!(Ln&&v.key!==Ln||Oi&&Qn&&v.key&&v.key!==Qn),O=L?.model!==w?.model||L?.business!==w?.business;if((M||O&&L)&&(h.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),E.querySelector(".concept-related-content").replaceChildren(),wt=!1,st=[],rt=[],vt=[],K="overview",yt="",Te="@overview",kt.clear(),Xe.clear(),jt.clear(),ze.clear(),cn.clear(),ec(),se!=="business"&&It("business"),M&&!Oi&&Ze(!1)),O){L=w,Y=w?Fc(w):void 0,V=w?ed(w):void 0,Z=w?Jc(w):void 0,We=!!w,H=Y?.tables??{},Q=Object.keys(H);const U=Y?.groups.map(G=>G.id)??[],X=new Set([...Tn,"subsystems"]);if(ye=new Map(U.map(G=>[G,X.has(G)||Q.includes(G)?"group:"+G:G])),Ie=new Map(Q.map(G=>[G,X.has(G)||U.includes(G)?"concept:"+G:G])),me=new Map([...ye].map(([G,ee])=>[ee,G])),de=new Map([...Ie].map(([G,ee])=>[ee,G])),oe=[...Tn,...me.keys(),...de.keys()],Array.isArray(Oe?.expanded)&&Oe.expandedVersion!==4){Ke.add("subsystems"),Ke.add("concept-relations");for(const G of w?.model.subsystems??[])Ke.add("subsystem-"+G.id)}}if(Ln=v.key,rt=rt.filter(U=>v.states?.some(X=>X.id===U)),se==="business"&&wt&&v.views?.find(U=>U.key===v.viewKey)?.activity===void 0&&v.views?.find(U=>U.key===v.viewKey)?.object===void 0&&Pn(),Oi&&v.key){if(Ha(),Qn===v.key){Array.isArray(Oe?.specs)&&(vt=[...new Set(Oe.specs.filter(U=>typeof U=="string").map(U=>vo(U)))]);for(const[U,X]of Object.entries(Oe?.specExamples??{})){const G=Ee(U);typeof X=="string"&&G?.capability.samples.some(ee=>ee.id===X)&&kt.set(U,X)}}Oi=!1,Ks()}St(),Ct(),Dt(),M&&He()}}}class Ho{tabs=new WeakMap;router;constructor(t=To){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,r){const s=JSON.stringify([i.map(g=>[g.id,g.width,g.height]),o.map(g=>[g.kind,g.from,g.to,g.label]),r]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==s,u=new Set(i.filter(g=>{const c=d?.nodes.get(g.id);return!c||c.x!==g.x||c.y!==g.y}).map(g=>g.id)),l=new Set(i.map(g=>g.id)),p=a?new Array(o.length):d.routes.slice();if(o.forEach((g,c)=>{!a&&!u.has(g.from)&&!u.has(g.to)||(p[c]=l.has(g.from)&&l.has(g.to)?this.router({from:g.from,to:g.to,index:c,nodes:i,kind:g.kind,matrix:r?.[c],labels:r?.[c]?[]:[...p.flatMap((h,m)=>h&&m<c?[{id:String(m),x:h.label[0]-Math.max(30,o[m].label.length*12)/2,y:h.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:r?.[c]?[]:p.flatMap((h,m)=>h&&m<c?[h.points]:[]),labelWidth:Math.max(30,g.label.length*12),labelHeight:18}):void 0)}),r){const g=[],c=new Map,h=p.map((m,f)=>f).sort((m,f)=>Number(r[m].returning)-Number(r[f].returning));for(const m of h){const f=p[m];if(!f)continue;const b=i.find(I=>I.id===o[m].from),A=Math.max(30,o[m].label.length*12),y=r[m].returning?[Math.max(...f.points.map(I=>I[0]))+8+A/2,f.points[0][1]]:[b.x+b.width*.125+8+A/2,lc(b.y+b.height,r[m].captionLane*Vr)+9],S=Fr(o[m],m,r[m]),x=c.get(S)??qo(y,A,18,i,g);(x[0]!==f.label[0]||x[1]!==f.label[1])&&(p[m]={...f,label:x}),c.has(S)||(c.set(S,x),g.push({id:String(m),x:x[0]-A/2,y:x[1]-9,width:A,height:18}))}}return this.tabs.set(t,{design:n,structure:s,nodes:new Map(i.map(g=>[g.id,{...g}])),routes:p}),p}}function dl(e,t,n,i){const o=(p,g,c)=>(g[0]-p[0])*(c[1]-p[1])-(g[1]-p[1])*(c[0]-p[0]),r=o(e,t,n),s=o(e,t,i),d=o(n,i,e),a=o(n,i,t),u=1e-6;if(r*s<-u&&d*a<-u)return!0;if(Math.max(Math.abs(r),Math.abs(s),Math.abs(d),Math.abs(a))>u)return!1;const l=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[l],t[l]),Math.max(n[l],i[l]))-Math.max(Math.min(e[l],t[l]),Math.min(n[l],i[l]))>.1}function ll(e,t,n,i,o=[]){const r=e.x+e.width,s=24,d=e.y+e.height,a=r-8-(2*(n.count-n.index)-1)*s,u=t.filter(A=>A.id!==e.id);let l;for(const A of[0,-24,24,-48,48,-72,72])for(const y of[0,16,32,64,128,256]){const S=[a+A,d],x=[S[0]+s,d];if(S[0]<e.x+8||x[0]>r-8)continue;const I=d+n.depth+y,E=Math.min(12,(x[0]-S[0])/2,(I-d)/2),j=[S];let $=`M${S}`;const N=V=>{$+=` L${V}`,j.push(V)},R=(V,Z)=>{const H=j.at(-1);$+=` Q${V} ${Z}`;for(let Q=1;Q<=4;Q++){const oe=Q/4,me=1-oe;j.push([me*me*H[0]+2*me*oe*V[0]+oe*oe*Z[0],me*me*H[1]+2*me*oe*V[1]+oe*oe*Z[1]])}};N([S[0],I-E]),R([S[0],I],[S[0]+E,I]),N([x[0]-E,I]),R([x[0],I],[x[0],I-E]),N(x);const L=uc(j,u,.3),Y=o.filter(V=>j.slice(1).some((Z,H)=>V.slice(1).some((Q,oe)=>dl(j[H],Z,V[oe],Q)))).length;if((!l||L<l.collisions||L===l.collisions&&Y<l.wireCollisions)&&(l={path:$,points:j,collisions:L,wireCollisions:Y,low:I,extra:y,shift:A}),L===0&&Y===0)break}const{path:p,points:g,collisions:c,wireCollisions:h,low:m,extra:f,shift:b}=l;return{path:p,points:g,label:[Math.max(r+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...g.map(A=>A[0])),bottom:Math.max(...g.map(A=>A[1]))},collisions:c+h,rerouted:f>0||b!==0,fallback:c+h>0}}function ul(e,t=ls()){const n="http://www.w3.org/2000/svg",i=(q,B={})=>{const _=document.createElementNS(n,q);for(const[be,ie]of Object.entries(B))_.setAttribute(be,ie);return _},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},r=e.transitions.map(q=>[q]),s=[...new Set(["@new",...e.states,...r.map(q=>q[0].to)])],d={nodes:s.map(q=>({id:q,type:"business",name:o[q]??q,scope:!0})),relations:r.map(([q])=>({kind:q.path==="exception"?"business-exception":"input",from:q.from,to:q.to,label:q.id+"："+q.activity+"："+q.condition}))},a=fs(d,s),u=q=>{const B=Array.from(q);return Array.from({length:Math.ceil(B.length/28)},(_,be)=>B.slice(be*28,(be+1)*28).join(""))},l=r.map(([q])=>({from:q.from,activity:q.activity,rows:[q],lines:[],lineRows:[],offset:0,width:0,height:0})),p=new Map;for(const[q,B]of l.entries()){const _=B.rows[0],be=e.transitions.filter(ce=>ce.from===_.from&&(ce.activityId??ce.activity)===(_.activityId??_.activity)&&ce.path===_.path&&(_.path!=="exception"||(ce.exception??"例外名未定義")===(_.exception??"例外名未定義"))),ie=be.map(ce=>(ce.conditionLabel??ce.condition).trim().replace(/\s+/g," ")),Ce=new Set(ie).size===be.length?_.conditionLabel??_.condition:_.condition,ke=[_.path==="exception"?"例外："+(_.exception??"例外名未定義"):"",...be.length>1||_.path==="normal"&&_.conditionLabel?[Ce]:[]].filter(Boolean).join("：");B.lines=u(B.activity+(ke?"（"+ke+"）":"")),B.lineRows=B.lines.map(()=>B.rows),B.width=Math.max(...B.lines.map(ce=>Array.from(ce).length*14)),B.height=B.lines.length*18,a.wires[q].returning||(B.offset=p.has(B.from)?p.get(B.from)+8:0,p.set(B.from,B.offset+B.height))}const g=new Map;r.forEach(([q],B)=>{if(q.from===q.to){const _=g.get(q.from)??[];_.push(B),g.set(q.from,_)}});const c=new Map,h=new Map;for(const[q,B]of g){let _=0;for(const ie of[...B].reverse())c.set(ie,{leader:B[0],index:0,count:1,depth:0,offset:_}),_+=l[ie].height+8;const be=24+Math.max(0,_-8)+8;h.set(q,be);for(const ie of B)c.get(ie).depth=be}const m=q=>44,f=s.slice().sort((q,B)=>a.positions[q][1]-a.positions[B][1]);let b=Math.max(40,...l.map((q,B)=>a.wires[B].returning&&q.from===f[0]?16+q.height/2-44*(a.wires[B].fromPort??.5):40));const A=new Map;for(const q of f){const B=m(),_=(p.get(q)??0)+(h.get(q)??0);A.set(q,b),b+=pc(B,_)}const y=s.map(q=>({id:q,x:t.positions.get(q)?.[0]??a.positions[q][0],y:t.positions.get(q)?.[1]??A.get(q),width:Math.max(104,Array.from(o[q]??q).length*14+32),height:m()})),S=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),x=i("title");x.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(s.includes("@none")?"作成なしはこの操作の処理結果。":"")+(s.includes("@unknown")?"未決は設計課題。":""),S.append(x),S.append(us("state-transition-"));const I=new Map,E=[],j=[];let $=t.selected;const N=q=>{$=q,t.selected=q;const B=Ui(e.transitions,$);for(const[ie,Ce]of I)Ce.setAttribute("class","node graph-shape state-shape"+B.nodeClasses(ie)),Ce.setAttribute("aria-pressed",String(ie===$));E.forEach(({element:ie,rows:Ce})=>{const Pe=Ce[0].from===Ce[0].to;ie.setAttribute("class","edge"+(Pe?" state-self-loop":Ce[0].path==="exception"?" exception":"")+B.labelClasses(Ce)),ie.setAttribute("marker-end","url(#state-transition-"+(Ce.some(B.related)?"related-arrow":"arrow")+")")});for(const ie of j)ie.element.setAttribute("class","state-caption-line"+B.labelClasses(ie.rows));S.querySelectorAll("[data-exception-paint]").forEach(ie=>ie.remove());const _=Array.from(S.children).find(ie=>ie.matches(".state-diagram-edge-label,[data-state]"))??null,be=[...E].sort((ie,Ce)=>Number(ie.rows.some(B.related))-Number(Ce.rows.some(B.related)));for(const{element:ie}of be)if(S.insertBefore(ie,_),ie.classList.contains("exception")||ie.classList.contains("state-self-loop")){const Ce=S.children.length;ps(S,ie,{path:ie.getAttribute("d")},{"data-transitions":ie.getAttribute("data-transitions")});for(const Pe of Array.from(S.children).slice(Ce))S.insertBefore(Pe,_)}S.querySelectorAll(".state-diagram-edge-label").forEach(ie=>S.append(ie))};S.addEventListener("click",q=>{q.target===S&&N()}),S.addEventListener("keydown",q=>{q.key==="Escape"&&(q.preventDefault(),N())});const R=a.wires.map((q,B)=>({...q,captionLane:(l[B].offset+(h.get(l[B].from)??0))/Vr})),L=d.relations.map((q,B)=>({...q,label:String(B).padEnd(Math.ceil(l[B].width/12),"x")})),Y=[...c].map(([q,B])=>{const _=y.find(ie=>ie.id===r[q][0].from),be=l[q];return{x:_.x+_.width+8,y:_.y+_.height+24+B.offset,width:be.width,height:be.height}});let V=new Ho().update({},e,y,L,R);for(let q=0;q<=Y.length;q++){let B=!1,_=0;if(V.forEach((be,ie)=>{if(!be||c.has(ie)||!R[ie].returning)return;let Ce=0;for(const Pe of Y)for(let ke=1;ke<be.points.length;ke++){const ce=be.points[ke-1],Ee=be.points[ke];if(Math.abs(ce[0]-Ee[0])>1e-7||Math.abs(ce[1]-Ee[1])<2)continue;const Ve=ce[0];if(Ve<Pe.x-4||Ve>Pe.x+Pe.width+4||Math.max(ce[1],Ee[1])<Pe.y-4||Math.min(ce[1],Ee[1])>Pe.y+Pe.height+4)continue;const Ge=Pe.x+Pe.width+12-Ve;Ge>0&&(Ce=Math.max(Ce,Ge))}Ce&&(R[ie]={...R[ie],returnLane:(R[ie].returnLane??0)+Math.ceil(Ce/16)+_++},B=!0)}),!B)break;V=new Ho().update({},e,y,L,R)}const Z=V.flatMap((q,B)=>q&&!c.has(B)?[q.points]:[]),H=new Map,Q=V.map((q,B)=>{const _=c.get(B);if(!_)return q;const be=r[B][0].from,ie=y.find(Ge=>Ge.id===be),Ce=V.flatMap((Ge,Jt)=>Ge&&!c.has(Jt)?[Ge.points]:[]),Pe=Math.max(30,L[B].label.length*12),ke=l[B];let ce=H.get(_.leader);ce||(ce=ll(ie,y,{..._,labelLeft:ie.x+ie.width+8},Pe,Z),H.set(_.leader,ce),Z.push(ce.points));const Ee=Ce.flatMap((Ge,Jt)=>Ge.slice(1).map((wn,an)=>({id:`${Jt}:${an}`,x:Math.min(Ge[an][0],wn[0])-2,y:Math.min(Ge[an][1],wn[1])-2,width:Math.abs(Ge[an][0]-wn[0])+4,height:Math.abs(Ge[an][1]-wn[1])+4}))),Ve=qo([ie.x+ie.width+8+ke.width/2,ie.y+ie.height+24+_.offset+ke.height/2],ke.width,ke.height,[...y,...Ee]);return{...ce,label:[Ve[0]-ke.width/2+Pe/2,Ve[1]]}}),oe=new Array(r.length),me=[],de=r.map((q,B)=>B).sort((q,B)=>Number(R[q].returning)-Number(R[B].returning));for(const q of de){const B=Q[q],_=l[q],be=Math.max(30,L[q].label.length*12);let ie=[B.label[0]-be/2+_.width/2,B.label[1]+(R[q].returning?0:_.height/2-9)];const Ce=y.find(ce=>ce.id===r[q][0].from),Pe=y.find(ce=>ce.id===r[q][0].to);if(!c.has(q)&&R[q].returning&&Pe&&Pe.y>Ce.y){const ce=B.points.slice(1).map((Ee,Ve)=>[B.points[Ve],Ee]).filter(([Ee,Ve])=>Math.abs(Ee[0]-Ve[0])<.01&&Ve[1]-Ee[1]>24).sort(([Ee,Ve],[Ge,Jt])=>Jt[1]-Ge[1]-(Ve[1]-Ee[1]))[0];if(ce){const[Ee,Ve]=ce;ie=[Ee[0]+8+_.width/2,Ee[1]+Math.min(24+_.height/2,(Ve[1]-Ee[1])/2)]}}const ke=qo(ie,_.width,_.height,y,me);oe[q]=ke,me.push({id:String(q),x:ke[0]-_.width/2,y:ke[1]-_.height/2,width:_.width,height:_.height})}let ye=Math.max(...y.map(q=>q.x+q.width))+40,Ie=Math.max(...y.map(q=>q.y+q.height))+40;r.forEach((q,B)=>{const _=c.get(B);if(_&&_.leader!==B)return;const be=_?r.flatMap((ce,Ee)=>c.get(Ee)?.leader===B?ce:[]):q,ie=be[0],Ce=Q[B],Pe=i("path",{d:Ce.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":be.map(ce=>ce.id).join(" ")});(_||ie.path==="exception")&&Pe.setAttribute("stroke-dasharray","6 5");const ke=i("title");ke.textContent=be.map(ce=>`${ce.id} ${ce.activity} / ${ce.path==="normal"?"通常":"例外："+(ce.exception??"例外名未定義")}：${ce.condition}`).join(" / "),Pe.append(ke),S.append(Pe),E.push({element:Pe,rows:be}),ye=Math.max(ye,Ce.bounds.right+40),Ie=Math.max(Ie,Ce.bounds.bottom+40)});for(const[q,B]of l.entries()){const _=oe[q],be=_[0]-B.width/2,ie=_[1]-B.height/2+14;S.append(i("rect",{x:String(be),y:String(ie-14),width:String(B.width),height:String(B.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const Ce=i("text",{x:String(be),y:String(ie),class:"state-diagram-edge-label","data-activity":B.activity,"data-transition-id":B.rows[0].id,"aria-label":B.lines.join("")});B.lines.forEach((Pe,ke)=>{const ce=i("tspan",{x:String(be),dy:ke?"18":"0","font-size":"14","font-weight":"600"});ce.textContent=Pe,ce.setAttribute("data-transitions",B.lineRows[ke].map(Ee=>Ee.id).join(" ")),j.push({element:ce,rows:B.lineRows[ke]}),Ce.append(ce)}),S.append(Ce),ye=Math.max(ye,be+B.width+24),Ie=Math.max(Ie,ie+B.height+24)}for(const q of y){const B=q.id.startsWith("@"),_=i("g",{role:"button",tabindex:"0","aria-label":o[q.id]??q.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":q.id,"data-node":q.id});_.append(zr(document,q,B)),_.append(i("rect",{x:String(q.x),y:String(q.y),width:String(q.width),height:String(q.height),rx:B?"20":"8",class:B?"state-diagram-node state-note":"state-diagram-node"}));const be=i("text",{x:String(q.x+q.width/2),y:String(q.y+q.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(be.textContent=o[q.id]??q.id,_.append(be),B&&q.id!=="@new"){const ie=i("text",{x:String(q.x+q.width/2),y:String(q.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});ie.textContent=q.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",_.append(ie)}_.addEventListener("click",()=>N(q.id)),_.addEventListener("keydown",ie=>{(ie.key==="Enter"||ie.key===" ")&&(ie.preventDefault(),N(q.id))}),I.set(q.id,_),S.append(_)}return N(t.selected),S.setAttribute("viewBox",`0 0 ${ye} ${Ie}`),S.style.minWidth=`${ye}px`,S}const dr=new WeakMap;function pl(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const r=(m,f,b=o)=>{const A=document.createElement(m);return A.textContent=f,b.append(A),A};if(i.error)return r("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const s=i.model;for(const m of s.transitions){if(!e.graph.nodes.some(f=>f.id===m.activity&&f.type==="business"))return r("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const f=e.model?.business.exceptions?.find(b=>b.id===m.exceptionId);if(!f||f.activityId!==m.activity)return r("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=dr.get(e)??new Map;dr.set(e,d);const a=d.get(t)??ls();d.set(t,a);const u={...s,transitions:s.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(f=>f.id===m.activity)?.name??m.activity}))};o.append(Wr(document,m=>ul(u,m),a));const l=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,p={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},g=document.createElement("details");r("summary",`操作の詳細（${s.transitions.length}）`,g);const c=document.createElement("ol");g.append(c),o.append(g);for(const m of s.transitions){const f=document.createElement("li");f.dataset.transition=m.id,r("h3",`${m.id} · ${l(m.from)} → ${l(m.to)}`,f),m.path==="exception"&&r("p","例外名："+(m.exception??"未定義"),f),r("p",`${p[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,f);const b=e.graph.nodes.find(A=>A.id===m.activity&&A.type==="business");if(b){const A=document.createElement("button");A.type="button",A.textContent=b.name,A.onclick=()=>n(b.id),f.append(A)}else r("p","要確認：根拠Activityが見つかりません — "+m.activity,f);r("p","条件："+m.condition,f),r("p",m.note,f),r("p","根拠："+m.evidence,f),c.append(f)}s.transitions.length||r("p","明示された操作はありません。");const h=document.createElement("details");return r("summary","宣言の出典",h),r("p",s.source,h),o.append(h),o}const lr=64,fl=96,ml=260,ur=40,hl=4;function bl(e,t,n=!0){const{nodes:i,previous:o,children:r,parents:s,forwardRelations:d,feedbackRelations:a,exceptionRelations:u}=fc(e,t),l=s.map(x=>x.length),p=i.map(()=>0),g=i.flatMap((x,I)=>l[I]===0?[I]:[]);for(let x=0;x<g.length;x++)for(const I of r[g[x]])p[I]=Math.max(p[I],p[g[x]]+1),--l[I]===0&&g.push(I);const c=Array.from({length:p.reduce((x,I)=>Math.max(x,I),0)+1},()=>[]);i.forEach((x,I)=>c[p[I]].push(I));const h=i.map(()=>0),m=x=>x.forEach((I,E)=>h[I]=E);c.forEach(m);for(let x=0;x<hl;x++){const I=x%2?[...c].reverse():c;for(const E of I){const j=new Map(E.map($=>{const N=x%2?r[$]:s[$];return[$,N.length?N.reduce((R,L)=>R+h[L],0)/N.length:h[$]]}));E.sort(($,N)=>j.get($)-j.get(N)||$-N),m(E)}}const f=c[0].filter(x=>i[x].type==="object"&&o[x].length===0&&r[x].length>0);if(n&&f.length>1){const x=new Set(f),I=c[0].filter(E=>!x.has(E));c.splice(0,1,...f.map((E,j)=>j===0?[...I,E]:[E]))}const b=Object.create(null),A=i.map(()=>0),y=[],S=Math.ceil(ml/lr)-1;for(let x=0;x<c.length;x++){const I=new Map;for(const $ of y)for(const N of $)I.set(N,N+1);const E=$=>{let N=$;for(;I.has(N);)N=I.get(N);let R=$;for(;I.has(R);){const L=I.get(R);I.set(R,N),R=L}return N},j=[];for(const $ of c[x]){let N=x;for(const L of s[$])N=Math.max(N,A[L]+1);const R=E(N);A[$]=R,I.set(R,R+1),j.push(R),b[i[$].id]=[ur+x*lr,ur+R*fl]}y.push(j),y.length>S&&y.shift()}return{positions:b,forwardRelations:d,feedbackRelations:a,exceptionRelations:u}}function gl(e,t){return Br(e)?fs(e,t).positions:bl(e,t).positions}const pr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function aa(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>pr(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const r=pr(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(r)return r}return 0})}}function ca(e){const t=aa(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([r,s])=>[i.get(r),s])))}}function da(e){const t=ca(e);return t.restore(gl(t.graph,t.order))}function yl(e){const t=ca(e),n=fs(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function la(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function vl(e,t){if(!e)return!1;const n=r=>"format"in r?!!r.document?.handle||r.recovery.some(s=>s.handle!==void 0):r.tabs.some(s=>s.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(r,s){if(Object.is(r,s))return!0;if(!r||!s||typeof r!="object"||typeof s!="object"||i.has(r)||i.has(s))return!1;const d=c=>Array.isArray(c)||Object.getPrototypeOf(c)===null||Object.getPrototypeOf(c)?.constructor?.name==="Object";if(!d(r)||!d(s)||Array.isArray(r)!==Array.isArray(s)||Array.isArray(r)&&r.length!==s.length)return!1;i.add(r),i.add(s);const a=r,u=s,l=Object.keys(a),p=Object.keys(u),g=l.length===p.length&&l.every(c=>Object.hasOwn(u,c)&&o(a[c],u[c]));return i.delete(r),i.delete(s),g}return o(e,t)}function Xn(e,t){const n=new Set(t.graph.nodes.map(r=>r.id)),i=Object.create(null);for(const[r,s]of Object.entries(e.positions))n.has(r)&&(i[r]=[...s]);const o=t.graph.nodes.filter(r=>!i[r.id]);if(o.length){const r=da(t),s=Object.values(i);for(const d of o){const a=[...r[d.id]];for(;s.some(u=>Math.abs(u[0]-a[0])<280&&Math.abs(u[1]-a[1])<88);)a[1]+=180;i[d.id]=a,s.push(a)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(r=>n.has(r)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function ua(){return new Promise((e,t)=>{const n=indexedDB.open(la(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class ks extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Bi;function pa(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function wl(e){const t=Bi;if(t===void 0)throw Error("Session has not been loaded");const n=await ua();try{await new Promise((i,o)=>{const r=n.transaction("session","readwrite"),s=r.objectStore("session"),d=s.get("generation"),a=s.get("current"),u=s.get("readonly-legacy");let l,p;u.onsuccess=()=>{try{const g=pa(d.result);if(vl(a.result,e)){p=g;return}if(g!==t)throw new ks;if(p=t+1,!Number.isSafeInteger(p))throw Error("Session generation exhausted");u.result===void 0&&Il(a.result)&&s.put(a.result,"readonly-legacy"),s.put(e,"current"),s.put(p,"generation")}catch(g){l=g,r.abort()}},r.oncomplete=()=>{Bi=p,i()},r.onerror=()=>o(l??r.error??Error("Session save failed")),r.onabort=()=>o(l??r.error??Error("Session save aborted"))})}finally{n.close()}}async function kl(){Bi=void 0;const e=await ua();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),r=o.get("current"),s=o.get("generation");i.oncomplete=()=>{try{Bi=pa(s.result),t(r.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function Il(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const fr=new WeakMap;function Sl(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(l=>l.id===t&&l.type==="business"))throw Error("Unknown Activity: "+t);let i=fr.get(e);i||(i=new Map,fr.set(e,i));const o=i.get(t);if(o)return o;const r=new Set(e.graph.nodes.filter(l=>l.type==="object").map(l=>l.id)),s=new Set(e.graph.nodes.filter(l=>l.type==="business").map(l=>l.id)),d=e.graph.relations.filter(l=>l.kind==="input"&&l.to===t&&r.has(l.from)||l.kind==="output"&&l.from===t&&r.has(l.to)||l.kind==="business-exception"&&(l.from===t&&s.has(l.to)||l.to===t&&s.has(l.from))),a=new Set([t,...d.flatMap(l=>[l.from,l.to])]),u={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(l=>a.has(l.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(l=>l.type==="business").map(l=>l.id)).filter(l=>a.has(l))};return i.set(t,u),u}const mr=new WeakMap;function xl(e,t){if(!e.graph.nodes.find(p=>p.id===t&&p.type==="object"))throw Error("Unknown Object: "+t);let i=mr.get(e);i||(i=new Map,mr.set(e,i));const o=t,r=i.get(o);if(r)return r;const s=new Set(e.graph.nodes.filter(p=>p.type==="object").map(p=>p.id)),d=new Set(e.graph.nodes.filter(p=>p.type==="business").map(p=>p.id)),a=e.graph.relations.filter(p=>p.kind==="input"&&p.from===t&&d.has(p.to)||p.kind==="output"&&p.to===t&&d.has(p.from)||p.kind==="object-exception"&&(p.from===t&&s.has(p.to)||p.to===t&&s.has(p.from))),u=new Set([t,...a.flatMap(p=>[p.from,p.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(p=>u.has(p.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(p=>p.type==="business").map(p=>p.id)).filter(p=>u.has(p))};return i.set(o,l),l}const fa=new WeakMap;function tn(e){return fa.get(e)}const ma=["design","checks","source","draft","edited","handle"];function Al(e){return{key:e.key,name:e.name,...Object.fromEntries(ma.map(t=>[t,e[t]]))}}function Ut(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:a,scroll:u,zoom:l}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:a,scroll:u,zoom:l,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function no(e,t){const n=t;fa.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of ma)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Gi(e){return e.activity}function Hi(e){return e.object}function li(e){return e.activity??e.object}function io(e){return e.object===void 0?Sl(e.design,e.activity):xl(e.design,e.object)}function oo(e){const t=io(e),n=Xn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function Vt(e,t=[],n,i){const o=n??(e.tabs[0]?Al(e.tabs[0]):void 0),r=o?(i??[e.tabs[0]?Ut(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(g=>{const c=no(o,g);return Object.assign(g,Ut(oo(c))),c}):[],{dark:s,drawer:d,width:a,preferWrite:u,nodeDrawer:l,sampleLayout:p}=e;return{dark:s,drawer:d,width:a,preferWrite:u,nodeDrawer:l,sampleLayout:p,document:o,tabs:r,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(g=>g.source?.kind==="url").map(g=>({url:g.source.url,name:g.name}))].filter((g,c,h)=>h.findIndex(m=>m.url===g.url)===c),legacyViews:e.legacyViews,active:r.some(g=>g.key===e.active)?e.active:r[0]?.key}}function Is(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Ut),recovery:n}}function Di(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function El(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!Rl(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const l of o.views)Di(l)}const{format:r,views:s,document:d,recovery:a,...u}=e;for(const l of s)Di(l);for(const l of a)Di(l);if(!!d!=!!s.length||new Set(s.map(l=>l.key)).size!==s.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(g=>g.group!==void 0&&typeof g.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(g=>g.group===void 0).length!==1))throw Error("Invalid legacy views");const l=i.views[0],p=l?{...l}:void 0;return p&&delete p.group,Vt({...u,tabs:[],active:p?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},a,d,p?[p]:[])}if(s.length&&(s[0].activity!==void 0||s[0].object!==void 0||s.filter(l=>l.activity===void 0&&l.object===void 0).length!==1)||new Set(s.filter(l=>l.activity!==void 0).map(l=>l.activity)).size!==s.filter(l=>l.activity!==void 0).length||new Set(s.filter(l=>l.object!==void 0).map(l=>l.object)).size!==s.filter(l=>l.object!==void 0).length)throw Error("Invalid workspace views");if(d&&s.some(l=>l.activity!==void 0&&!d.design.graph.nodes.some(p=>p.type==="business"&&p.id===l.activity)))throw Error("Unknown saved Activity");if(d&&s.some(l=>l.object!==void 0&&!d.design.graph.nodes.some(p=>p.type==="object"&&p.id===l.object)))throw Error("Unknown saved Object");return Vt({...u,tabs:[]},a,d,s)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)Di(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return Vt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Ol(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return Vt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function jl(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},r=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),s=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||r.has(a.activity))&&(a.object===void 0||s.has(a.object))).map(Ut);return Vt(e,e.recovery,o,d)}function Cl(e,t){const n=e.tabs.find(o=>Gi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=no(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Dl(e,t){const n=e.tabs.find(o=>Hi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=no(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ut(oo(i))),e.tabs.push(i),e.active=i.key,i}function Ml(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(r=>r.key===i.key);return Ut(o?oo(no(e.document,{...Ut(i),...Ut(o)})):i)});return Vt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Rl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function so(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const r=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},s=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),u=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(u.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(u.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?s():r(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),s(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,u=o(),l=u.indexOf(document.activeElement);let p;a.key==="ArrowDown"&&(p=(l+1)%u.length),a.key==="ArrowUp"&&(p=(l+u.length-1)%u.length),a.key==="Home"&&(p=0),a.key==="End"&&(p=u.length-1),p!==void 0&&(a.preventDefault(),u[p]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!i(a)&&r(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&r()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&r()}),window.addEventListener("resize",()=>r()),{close:r}}const Ll=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Nl={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function Pl(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),r=y=>o.slice(y.line+1,i.find(S=>S.line>y.line&&S.level<=y.level)?.line??o.length).join(`
`).trim(),s=new Map(i.filter(y=>y.level===3&&t.some(S=>S.title===y.title)).map(y=>[y.title,y])),d=y=>{const S=t.find(x=>x.title===y.title);return S?"legacy-check:"+S.id:y.level===1?"legacy-check-document":"legacy-heading:"+y.line},a=new Map,u=(y,S)=>{a.has(y)?a.get(y)!==S&&a.set(y,void 0):a.set(y,S)};for(const y of i){const S=d(y);u(Ll(y.title),S);const x=t.find(I=>I.title===y.title);x&&u(x.id.toLowerCase(),S)}for(const[y,S]of o.entries()){const x=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(S);if(x){const I=i.find(E=>E.line>y);I&&u(x[1].toLowerCase(),d(I))}}const l=y=>{y=y.replace(/<a\s+id=[^>]+><\/a>/g,"");const S=[];let x=0;for(const I of y.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){I.index>x&&S.push({kind:"markdown",value:y.slice(x,I.index)});let E=I[2].slice(1);try{E=decodeURIComponent(E)}catch{}const j=I[2].startsWith("#")?a.get(E.toLowerCase()):void 0;S.push(j?{kind:"reference",targetId:j,label:I[1]}:{kind:"link",uri:I[2],label:I[1]}),x=I.index+I[0].length}return x<y.length&&S.push({kind:"markdown",value:y.slice(x)}),S},p=[],g=[],c=[],h=new Map;for(const y of i.filter(S=>S.level===2)){if(y.title==="業務一覧")continue;const S=d(y),x=i.find(I=>I.line>y.line)?.line??o.length;p.push({id:S,activityId:Object.hasOwn(n,y.title)?y.title:null,title:y.title,preamble:l(o.slice(y.line+1,x).join(`
`).trim())}),h.set(y.title,S)}const m="legacy-unassigned",f=y=>{const S=i.filter(x=>x.line<y.line&&x.level===2).at(-1);return S?h.get(S.title):void 0},b=t.map(y=>{const S=s.get(y.title),x=f(S)??m,I=Object.create(null),E=[];let j={name:"補足",value:""},$="";for(const R of y.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const L=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(R);L&&($?L[1][0]===$[0]&&L[1].length>=$.length&&!L[2].trim()&&($=""):$=L[1]);const Y=$?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(R);Y?(j.value.trim()&&E.push(j),j={name:Y[1],value:Y[2]}):j.value+=`
`+R}j.value.trim()&&E.push(j);let N="";for(const R of E)if(R.name==="人間レビュー状態"){N=R.value.split(`
`)[0].trim();const L=R.value.split(`
`).slice(1).join(`
`).trim();L&&(I.補足=[...I.補足??[],...l(L)])}else{const L=Nl[R.name]??R.name;I[L]=[...I[L]??[],...l(R.value.trim())]}return{id:"legacy-check:"+y.id,checkId:y.id,title:y.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:N,sectionId:x,detailSummary:[...y.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(R=>R[1]).join(`
`),fields:I}});b.some(y=>y.sectionId===m)&&p.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const y of i.filter(S=>S.level===3&&!s.has(S.title))){const S=f(y);S?g.push({id:d(y),sectionId:S,title:y.title,blocks:[{kind:"prose",content:l(r(y))}]}):c.push({id:d(y),title:y.title,content:l(r(y))})}const A=i.find(y=>y.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(y=>y.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:l(o.slice(/^# /.test(o[0])?1:0,A).join(`
`)),sections:p,items:b,index:Object.entries(n).map(([y,S])=>{const x=o.find(I=>I.startsWith("|")&&I.includes("["+y+"]"))?.split("|").slice(1,-1)??[];return{activityId:y,purpose:x[1]?.trim()??"",connections:x[2]?.trim()??"",checkIds:S.map(I=>"legacy-check:"+I)}}),guarantees:g,examples:[],notes:c}}function Do(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...r]=n;if(!i||!o)return;r[0]==="refs"&&["heads","tags"].includes(r[1])&&r.splice(0,2);const[s,...d]=r;return!s||!d.length||!["main","master"].includes(s)&&!/^[a-f0-9]{40}$/i.test(s)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:s}}catch{return}}function Jo(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function Tl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((p,g)=>{const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(p);if(c){o?c[1][0]===o[0]&&c[1].length>=o.length&&!c[2].trim()&&(o=""):o=c[1];return}if(!o){t.add(g);const h=/^(#{1,6}) (.+)$/.exec(p);h&&i.push({line:g,level:h[1].length,title:h[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const r=i.filter(p=>p.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(p.title));if(!r.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const s=new Set,d=r.map(p=>{const g=i.find(m=>m.line>p.line&&m.level<=3)?.line??n.length,c=p.title.split(/\s/)[0];if(s.has(c))throw Error("Check IDが重複しています: "+c);s.add(c);const h=n.slice(p.line+1,g).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(h))throw Error(c+" の"+m+"が見つかりません。");return{id:c,title:p.title,body:h,activities:[]}}),a=Object.create(null);let u=!1;for(const[p,g]of n.entries()){if(!t.has(p)||(/^## /.test(g)&&(u=/^## 業務一覧\s*$/.test(g)),!u||!/^\|/.test(g)))continue;const c=g.split("|").slice(1,-1);if(c.length!==4)continue;const h=Jo(c[0])[0]?.label;if(!h)continue;if(Object.hasOwn(a,h))throw Error("業務一覧のActivityが重複しています: "+h);const m=Jo(c[3]);if(m.some(b=>b.url.toLowerCase()!=="#"+b.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+h);const f=m.map(b=>b.label);if(!f.length||f.some(b=>!s.has(b)))throw Error("業務一覧のCheck ID参照を確認できません: "+h);a[h]=[...new Set(f)];for(const b of d)f.includes(b.id)&&b.activities.push(h)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const l=i.find(p=>p.level===2)?.line??r[0].line;return{markdown:e,intro:n.slice(0,l).join(`
`),items:d,index:a,model:Pl(e,d,a,i)}}function ui(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function pi(e,t){const n=new Set(t.design.graph.nodes.filter(u=>u.type==="business").map(u=>u.name)),i=Object.keys(e.index).filter(u=>!n.has(u)),o=Object.keys(e.index).filter(u=>n.has(u)),r=(u,l)=>({state:u,reason:l,unknown:i});if(!o.length)return r("mismatch","業務一覧に、この業務設計書のActivityがありません。");const s=e.intro.split(`
`).filter(u=>/原典|^[-*] Source[：:]|Business Design/i.test(u)).join(`
`),d=Jo(s).map(u=>Do(u.url)).filter(u=>u!==void 0),a=t.source?.kind==="url"?Do(t.source.url):t.source?.kind==="sample"?Do("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(u=>u.document!==a.document)?r("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?r("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!a||!d.length?r("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(u=>u.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?r("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):r("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const hr=new WeakMap;function Hn(e){let t=hr.get(e);return t||(t=Tl(e.markdown),hr.set(e,t)),t}const Mo=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Mi(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function ql(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function $l(e){if(!e.checks)return[];const t=Hn(e.checks),n=pi(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===ui(e)?[t.model]:[]}function Wl(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&Mi(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let r,s=!1;if(e.checks){r=Hn(e.checks);const d=pi(r,e);if(s=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===ui(e),!s&&(Mi(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=Mo("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,o.append(a)}}if(t.candidate){const d=t.candidate,a=Hn(d),u=pi(a,e),l=document.createElement("section");l.className="check-candidate",l.id="check-candidate",Mi(l,"一致未確認: "+d.name+" — "+u.reason),Mi(l,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const p=document.createElement("details"),g=document.createElement("summary");g.textContent="原典参照・業務別インデックス・Check本文を確認",p.append(g,ql(a.markdown)),l.append(p);const c=Mo("対応を確認して表示する",()=>n.confirm(d));c.id="check-confirm",c.disabled=u.state==="mismatch"||n.disabled||t.busy===!0;const h=Mo("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});h.disabled=n.disabled||t.busy===!0,l.append(c,h),o.append(l)}return o.childNodes.length&&i.append(o),i}function zl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const l of o){const p=document.createElement("span");p.className="document-action-label",p.textContent=l.getAttribute("aria-label"),l.append(p)}let r=!1;const s=(l=!1)=>{r=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),l&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(l=>!l.hidden&&!l.disabled),a=()=>{const l=e.dataset.actionsMode,p=document.activeElement;e.dataset.actionsMode="inline";const c=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,h=n.getBoundingClientRect().width+c,m=o.some(f=>!f.hidden)&&e.clientWidth>0&&h>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||l!==e.dataset.actionsMode)&&(s(),m&&n.contains(p)?i.focus({preventScroll:!0}):!m&&p===i&&d()[0]?.focus({preventScroll:!0}))},u=(l=!1)=>{if(i.hidden)return;r=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const p=d();(l?p.at(-1):p[0])?.focus({preventScroll:!0})};return i.onclick=()=>r?s(!0):u(),i.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),u(l.key==="ArrowUp"))},n.addEventListener("keydown",l=>{if(!r)return;const p=d(),g=p.indexOf(document.activeElement);let c;l.key==="ArrowDown"&&(c=(g+1)%p.length),l.key==="ArrowUp"&&(c=(g+p.length-1)%p.length),l.key==="Home"&&(c=0),l.key==="End"&&(c=p.length-1),c!==void 0&&(l.preventDefault(),p[c]?.focus())}),document.addEventListener("keydown",l=>{r&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{r&&!n.contains(l.target)&&!i.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{r&&!n.contains(l.target)&&l.target!==i&&s()}),n.addEventListener("click",l=>{const p=l.target.closest("button");r&&p&&!p.disabled&&s(!0)},!0),s(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:s}}function Ul(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),r=parseFloat(o.columnGap)||0,s=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((u,l)=>u+l.getBoundingClientRect().width,0)+r*n.length+s,a=d+t.getBoundingClientRect().width+r;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(r=>o.observe(r))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const ti="http://www.w3.org/2000/svg",Vl="http://www.w3.org/1999/xhtml",Ri=24,br=8192,Fl=16e6,Bl=8e6,Gl=4e3,Hl=1e6,_o="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Jl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(l=>![l.x,l.y,l.width,l.height].every(Number.isFinite)||l.width<0||l.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const l of e)t=Math.min(t,l.x),n=Math.min(n,l.y),i=Math.max(i,l.x+l.width),o=Math.max(o,l.y+l.height);const r=Math.floor(t)-Ri,s=Math.floor(n)-Ri,d=Math.ceil(i)-r+Ri,a=Math.ceil(o)-s+Ri,u=Math.min(2,br/d,br/a,Math.sqrt(Fl/(d*a)));if(u<1)throw Error(_o);return{bounds:{x:r,y:s,width:d,height:a},width:Math.floor(d*u),height:Math.floor(a*u),scale:u}}const _l="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function gr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,r)=>{const s=i[r],d=getComputedStyle(o);s.removeAttribute("style");for(const a of _l){const u=d.getPropertyValue(a);u&&!/url\s*\(/i.test(u)&&s.style.setProperty(a,u)}for(const a of Array.from(s.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&s.removeAttribute(a.name)}),t}function Kl(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Gl||(e.textContent?.length??0)+(t.textContent?.length??0)>Hl)throw Error(_o);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const f of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+f.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+f.offsetTop,width:f.offsetWidth,height:f.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const r=e.ownerDocument,s=Array.from(t.children).map(gr),d=s.filter(m=>m.matches(".edge,.edge-label"));if(d.length){const m=r.createElementNS(ti,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...d),r.body.append(m);try{for(const f of d){const b=f.getBBox();o.push({x:b.x-12,y:b.y-12,width:b.width+24,height:b.height+24})}}finally{m.remove()}}const a=Jl(o),u=r.createElementNS(ti,"svg");u.setAttribute("width",String(a.width)),u.setAttribute("height",String(a.height)),u.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const l=r.createElementNS(ti,"rect");l.setAttribute("width","100%"),l.setAttribute("height","100%"),l.setAttribute("fill",n),u.append(l);const p=r.createElementNS(ti,"g");p.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const m of s)p.append(m);u.append(p);const g=r.createElementNS(ti,"foreignObject");g.setAttribute("width",String(a.bounds.width)),g.setAttribute("height",String(a.bounds.height));const c=r.createElementNS(Vl,"div");c.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const m of i){const f=gr(m);f.querySelector(".activity-open,.object-open")?.remove(),f.style.left=parseFloat(m.style.left)-a.bounds.x+"px",f.style.top=parseFloat(m.style.top)-a.bounds.y+"px",c.append(f)}g.append(c),u.append(g);const h=new XMLSerializer().serializeToString(u);if(new TextEncoder().encode(h).length>Bl)throw Error(_o);return{svg:h,...a}}function Xl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ha(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,r)=>{const s=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",r(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(s),o()},n.onerror=()=>{clearTimeout(s),r(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,r)=>{const s=window.setTimeout(()=>r(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(s),d?o(d):r(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(s),r(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Zl(e,t){const n=await ha(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Xl(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function Yl(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ha(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ba(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:Ql(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Ql(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,r=2246822507;for(const s of i)o=Math.imul(o^s.codePointAt(0),16777619)>>>0,r=Math.imul(r^s.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+r.toString(16).padStart(8,"0")}function ga(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return P(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function ya(e){P(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),mn(e),Fi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=ba(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=ga(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Fi(t),t}const yr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),eu={anyOf:di.anyOf},tu={type:"string",pattern:"^[A-Za-z0-9_-]+$"},nu={type:"string",minLength:1,pattern:"\\S"},iu={$schema:"https://json-schema.org/draft/2020-12/schema",...yr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:yr({id:tu,name:nu,package:eu})}}),$defs:di.$defs};function ou(e){try{mn(e,iu)}catch(n){if(Array.isArray(e?.plans))for(const i of e.plans)try{mn(i?.package,di)}catch(o){throw Error("Plan "+(i?.id??"<missing>")+" (formatVersion "+String(i?.package?.formatVersion)+"): "+o.message,{cause:o})}throw n}P(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){P(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),P(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Fi(n.package),["0.1","0.2","0.3"].includes(n.package.formatVersion)&&ya(n.package)}catch(i){throw Error("Plan "+n.id+" (formatVersion "+n.package.formatVersion+"): "+i.message,{cause:i})}}return{valid:!0,plans:e.plans.map(({id:n,name:i})=>({id:n,name:i}))}}const he=(e,t)=>{if(!e)throw new Error(t)},ii=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Ro=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Li=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),va=e=>ii(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function su(e){he(Ro(e),"Graph must be an object");const t=e;he(Li(t,["version","nodes","relations"])||Li(t,["version","nodes","relations","scope"]),"Invalid graph fields"),he(t.version===1,"Unsupported graph version"),"scope"in t&&he(ii(t.scope),"Invalid scope"),he(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),he(Array.isArray(t.relations),"Relations required");const n=new Map;for(const r of t.nodes){he(Ro(r),"Node must be an object");const s=r;he(s.type==="business"||s.type==="object","Invalid node type");const d=s.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];s.type==="business"&&("problem"in s||"pain_level"in s)&&(d.push("problem","pain_level"),he(["Low","Medium","High"].includes(String(s.pain_level)),"Invalid Pain level")),he(Li(s,d),"Invalid node fields"),he(Object.entries(s).every(([u,l])=>u==="scope"||u==="information"||ii(l)),"Empty node text"),he(typeof s.scope=="boolean","Invalid node scope"),he(va(s.name)&&s.id===s.name,"Node ID must equal visible name"),he(!n.has(s.id),"Duplicate node ID"),s.type==="object"&&(he(typeof s.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.icon),"Invalid Lucide icon"),he(Array.isArray(s.information)&&s.information.every(ii),"Invalid information")),n.set(s.id,s.type)}he([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const r of t.relations){he(Ro(r),"Relation must be an object");const s=r;he(Li(s,["kind","from","to","label"])&&Object.values(s).every(ii),"Invalid relation fields");const d=i[s.kind];he(Array.isArray(d)&&n.has(s.from)&&n.has(s.to)&&n.get(s.from)===d[0]&&n.get(s.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([s.kind,s.from,s.to,s.label]);he(!o.has(a),"Duplicate relation"),o.add(a)}}function hn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function si(e){const t=[];let n="";return hn(e).forEach((i,o)=>{const r=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(r){n?r[1][0]===n[0]&&r[1].length>=n.length&&!r[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=r[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),he(!n,"Unclosed code fence"),t}function Ko(e,t,n,i=[]){const o=hn(e),r=si(e),s=Object.create(null);return he(r.length&&!o.slice(0,r[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),r.forEach(([d,a],u)=>{he(t.includes(a)&&!(a in s),n+": unsupported/duplicate "+a),s[a]=o.slice(d+1,r[u+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),he(s[a]||i.includes(a),n+": empty "+a)}),he(r.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),s}const vr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function ru(e){const t=hn(e),n=si(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return he(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,r],s)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(r);he(d,"Invalid Finding ID");const a=d[1];he(!i.has(a),"Duplicate Finding ID"),i.add(a);const u=Ko(t.slice(o+1,n[s+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);he(["question","correction"].includes(u["### Kind"]),"Invalid Finding Kind"),he(["open","resolved"].includes(u["### Status"]),"Invalid Finding Status"),he(["items","document","unassigned"].includes(u["### Scope"]),"Invalid Finding Scope");const l=u["### Targets"]==="(none)"?[]:hn(u["### Targets"]).filter(p=>p.trim()).map(p=>(he(p.startsWith("- ")&&va(p.slice(2)),"Invalid Finding target"),p.slice(2)));return he(new Set(l).size===l.length,"Duplicate Finding target"),he(u["### Scope"]==="items"?l.length>0:u["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:u["### Kind"],status:u["### Status"],scope:u["### Scope"],targets:l,summary:u["### Summary"],content:u["### Content"],unresolvedTargets:[]}})}function au(e,t){he(!e.includes("<!--"),"HTML comments are unsupported");const n=hn(e),i=si(e).filter(g=>g[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;he(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let r=[];const s={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;i.slice(1).forEach(([g,c],h)=>{const m=i[h+2]?.[0]??n.length,f=n.slice(g+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(he(f,"Empty section "+c),c==="# Findings"){he(!a.has(c),"Duplicate Findings"),a.add(c),r=ru(f);return}if(["# Scope","# Graph exceptions"].includes(c)){he(!a.has(c),"Duplicate "+c),a.add(c),c==="# Scope"?(he(!si(f).length,"Scope must be prose"),s.scope=f):hn(f).filter(j=>j.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(j=>{const $=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(j);he($,"Invalid exception"),s.relations.push({kind:$[1],from:$[2],to:$[3],label:$[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const b=o.exec(c);he(b,"Unsupported heading "+c);const A=b[1],y=b[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[y]=n.slice(g,m).join(`
`);const S=j=>si(f).some($=>$[1]===j);if(A==="Object"){const j=["## Scope","## Icon"];S("## Information")&&j.push("## Information");const $=Ko(f,j,y);he(["true","false"].includes($["## Scope"]),"Invalid Scope");const N=hn($["## Information"]??"").filter(R=>R.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(R=>(he(/^- \S.*$/.test(R),"Invalid Information"),R.slice(2)));s.nodes.push({id:y,type:"object",name:y,scope:$["## Scope"]==="true",icon:$["## Icon"]==="(generic icon)"?"box":$["## Icon"],information:N});return}const x=["## Scope","## Why","## When"];S("## Exception When")&&x.push("## Exception When"),x.push("## Who","## Where","## How","### Input","### Procedure"),S("### Exception")&&x.push("### Exception"),x.push("### Output","## Result"),(S("## Problem")||S("## Pain level"))&&x.push("## Problem","## Pain level");const I=Ko(f,x,y,["## How"]);he(!I["## How"],"How must only contain fields"),he(["true","false"].includes(I["## Scope"]),"Invalid Scope"),t?.activity?.(y,I);const E={id:y,type:"business",name:y,scope:I["## Scope"]==="true",why:I["## Why"],when:I["## When"],who:I["## Who"],where:I["## Where"],result:I["## Result"]};"## Problem"in I&&(E.problem=I["## Problem"],E.pain_level=I["## Pain level"]),s.nodes.push(E);for(const[j,$]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(j in I)||$!=="business-exception"&&I[j]==="(none)"||hn(I[j]).filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(N=>{const R=/^- (.+?) — (\S.*)$/.exec(N);he(R,"Invalid relation in "+y),s.relations.push({kind:$,from:$==="output"?y:R[1],to:$==="output"?R[1]:y,label:R[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const u=s.nodes.filter(g=>g.type==="business").map(g=>g.id);su(s),s.nodes.sort((g,c)=>vr(g.id,c.id)),s.relations.sort((g,c)=>{for(const h of["kind","from","to","label"]){const m=vr(g[h],c[h]);if(m)return m}return 0});const l=new Set(s.nodes.map(g=>g.id));for(const g of r)g.unresolvedTargets=g.targets.filter(c=>!l.has(c));return{graph:s,sections:d,markdown:e,activityOrder:u,findings:r}}const cu=["id","from","activity","condition","to","effect","path","evidence","note"],_e=(e,t)=>{if(!e)throw Error(t)},Ni=e=>typeof e=="string"&&!!e.trim();function du(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());_e(n,"state-meta と遷移表が必要です");const i=ia(n[1]);_e(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),_e(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),_e(i.object===t,"対象Objectが一致しません"),_e(Array.isArray(i.states)&&i.states.length>0&&i.states.every(u=>Ni(u)&&!u.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),_e(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&Ni(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),r=u=>(_e(u.startsWith("|")&&u.endsWith("|"),"表の行が不正です"),u.slice(1,-1).split("|").map(l=>l.trim())),s=r(o[0]);_e([cu,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(u=>s.join("|")===u.join("|")),"表の列名が不正です"),_e(r(o[1]).length===s.length&&r(o[1]).every(u=>/^-+$/.test(u)),"表の区切りが不正です"),_e(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=o.slice(2).map(u=>{const l=r(u);_e(l.length===s.length&&l.every(Ni),"表の列数・空欄が不正です");const p=Object.fromEntries(s.map((g,c)=>[g,l[c]]));return _e(/^T[0-9]+$/.test(p.id)&&!d.has(p.id),"遷移IDが不正または重複しています"),d.add(p.id),_e([...i.states,"@new"].includes(p.from)&&[...i.states,"@unknown","@none"].includes(p.to),"未登録の状態が参照されています"),_e(["change","unchanged","no-create","constraint"].includes(p.effect)&&["normal","exception"].includes(p.path),"効果・経路の指定が不正です"),s.includes("exception")&&_e(p.path==="normal"?p.exception==="-":Ni(p.exception)&&p.exception!=="-","通常は例外名なし、例外は名前が必要です"),_e(p.effect!=="unchanged"||p.from===p.to,"状態不変の元と先が一致しません"),_e(p.effect!=="change"||!p.to.startsWith("@")&&p.from!==p.to,"状態変更の遷移先が不正です"),_e(p.effect!=="no-create"||p.from==="@new"&&p.to==="@none","不成立の元と先が不正です"),_e(p.effect!=="constraint"||p.to==="@unknown","未決の制約は遷移先未決としてください"),p});return{model:{...i,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const wr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function lu(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let r="";for(let s=0;s<i.length;s++){const d=i[s];if(!r&&/^# Object /.test(d)?n=d.slice(9):!r&&/^# /.test(d)&&(n=null),!r&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let u="";for(s++;s<i.length;s++){const p=i[s];if(!u&&/^#{1,2} /.test(p)){s--;break}a.push(p),u=wr(p,u)}const l=du(a.join(`
`),n);if(l.error)throw Error(l.error);t.push(l.model);continue}o.push(d),r=wr(d,r)}if(new Set(t.map(s=>s.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function uu(e){const t=/^## State Transitions$/m.test(e)?lu(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,r=au(t.markdown,{activity:(a,u)=>o.set(a,u),document:(a,u)=>{n=a,i=u}}),s={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:r.graph.scope??"",objects:r.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(r.activityOrder??[]).map(a=>{const u=r.graph.nodes.find(p=>p.id===a),l=o.get(a);return{id:a,name:u.name,scope:u.scope,why:String(u.why),when:String(u.when),who:String(u.who),where:String(u.where),procedure:l["### Procedure"],exception:l["### Exception"]??null,result:String(u.result),problem:u.problem===void 0?null:String(u.problem),painLevel:u.pain_level===void 0?null:String(u.pain_level)}}),relations:r.graph.relations.map((a,u)=>({id:"legacy-relation-"+u,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(r.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(u=>r.graph.nodes.some(l=>l.id===u))}))};s.exceptions=ba(s);const d=t.declarations.map((a,u)=>({id:"legacy-state-"+u,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:s.id,revision:s.revision,verification:"unverified"},objectId:a.object,states:a.states.map(l=>({id:l,name:l})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(l=>({id:l.id,sourceId:l.id,fromId:l.from,toId:l.to,activityId:l.activity,exceptionId:ga(s,l.activity,l.exception),event:l.event??null,condition:l.condition,effect:l.effect,path:l.path,evidence:l.evidence,note:l.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:s,checks:[],states:d,diagnostics:[]}}}const Nt={type:"string"},le={type:"string",minLength:1,pattern:"\\S"},ue={type:"string",pattern:"^[A-Za-z0-9_-]+$"},At=e=>({anyOf:[e,{type:"null"}]}),ve=e=>({type:"array",items:e}),fe=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),pu=e=>({$ref:"#/$defs/"+e}),zn=ve({anyOf:[fe({kind:{enum:["text"]},value:Nt}),fe({kind:{enum:["reference"]},targetId:ue,label:Nt}),fe({kind:{enum:["link"]},uri:le,label:Nt})]}),Xo=fe({id:ue,name:le,scope:{type:"boolean"}}).properties,wa=fe({id:ue,kind:{enum:["input","output","business-exception","object-exception"]},fromId:ue,toId:ue,label:le}),fu=fe({id:ue,sourceId:ue,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:ve(ue),unresolvedTargets:ve(le),summary:le,content:le}),Zo=fe({id:ue,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:le,title:le,preface:Nt,scope:Nt,objects:ve(fe({...Xo,icon:le,information:ve(le)})),activities:ve(fe({...Xo,why:le,when:le,who:le,where:le,procedure:le,exception:At(le),result:le,problem:At(le),painLevel:At({enum:["Low","Medium","High"]})})),relations:ve(wa),findings:ve(fu)}),mu=fe({id:ue,name:le,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),ka=fe({...Zo.properties,schemaVersion:{enum:["0.2"]},roles:ve(mu),activities:ve(fe({...Zo.properties.activities.items.properties,roleId:At(ue)}))}),Ss=fe({...ka.properties,schemaVersion:{enum:["0.3"]},exceptions:ve(fe({id:ue,activityId:ue,name:le,description:Nt}))}),Un=e=>({...ve(e),minItems:1}),hu=fe({id:ue,name:le,description:Nt}),bu=fe({objectId:ue,roleIds:ve(ue)}),gu=fe({id:ue,text:le,obligation:{enum:["required","optional"]},appliesWhen:At(le),performerObjectIds:At(Un(ue))}),yu={anyOf:[fe({kind:{enum:["before"]},beforeId:ue,afterId:ue}),fe({kind:{enum:["interchangeable"]},stepIds:{...ve(ue),minItems:2}})]},vu=Object.fromEntries(Object.entries(Ss.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),wu=fe({...Ss.properties,schemaVersion:{enum:["0.4"]},objects:ve(fe({...Xo,icon:le,information:ve(hu)})),activities:Un(fe({...vu,performers:At(Un(bu)),procedure:fe({steps:Un(gu),orderRules:ve(yu)}),results:Un(fe({id:ue,text:le}))})),data:ve(fe({id:ue,name:le,items:Un(fe({informationId:ue,condition:At(le)}))})),relations:ve({anyOf:[fe({id:ue,kind:{enum:["input","output"]},fromId:ue,toId:ue,dataId:ue}),fe({...wa.properties,kind:{enum:["business-exception","object-exception"]}})]})}),ku=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,zn])),Iu=fe({id:ue,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:le,title:le,basedOn:fe({documentId:ue,revision:le,verification:{enum:["unverified"]}}),intro:zn,index:ve(fe({activityId:ue,purpose:Nt,connections:Nt,checkIds:ve(ue)})),sections:ve(fe({id:ue,activityId:At(ue),title:le,preamble:zn})),guarantees:ve(fe({id:ue,sectionId:ue,title:le,blocks:ve({anyOf:[fe({kind:{enum:["prose"]},content:zn}),fe({kind:{enum:["example"]},exampleId:ue})]})})),examples:ve(fe({id:ue,guaranteeId:ue,columns:ve(le),rows:ve(ve(zn))})),items:ve(fe({id:ue,checkId:ue,title:le,detailSummary:Nt,sectionId:ue,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:fe(ku,[])})),notes:ve(fe({id:ue,title:le,content:zn}))}),xs=fe({id:ue,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:le,title:le,basedOn:fe({documentId:ue,revision:le,verification:{enum:["unverified"]}}),objectId:ue,states:ve(fe({id:ue,name:le})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:le,transitions:ve(fe({id:ue,sourceId:le,fromId:le,activityId:ue,event:At(le),exception:At(le),condition:le,toId:le,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:le,note:le}))}),kr=Object.fromEntries(Object.entries({...xs.properties.transitions.items.properties,exceptionId:At(ue)}).filter(([e])=>e!=="exception")),Su=fe({...xs.properties,schemaVersion:{enum:["0.2"]},transitions:ve(fe({...kr,conditionLabel:le},Object.keys(kr)))}),ni=(e,t)=>fe({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:le,documents:ve({anyOf:t.map(pu)}),sources:ve(fe({documentId:ue,revision:le,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Nt})),externalDocuments:ve(fe({id:ue,kind:{enum:["businessDesign"]},revision:le,activities:ve(fe({id:ue,name:le}))})),diagnostics:ve(le)}),Ir={anyOf:[ni("0.1",["businessDesign","checkItems"]),ni("0.2",["businessDesign","checkItems","stateTransition"]),ni("0.3",["businessDesignRoles","checkItems","stateTransition"]),ni("0.4",["businessDesignStructured","checkItems","stateTransitionStructured"]),ni("0.5",["businessDesignD2","checkItems","stateTransitionStructured"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Zo,businessDesignRoles:ka,businessDesignStructured:Ss,businessDesignD2:wu,checkItems:Iu,stateTransition:xs,stateTransitionStructured:Su}},qn=(e,t)=>te(new Set(e).size===e.length,t);function xu(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&te(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};qn(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){te(o.name===o.name.trim(),"Data name whitespace"),qn(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities){if(o.performers!==null){qn(o.performers.map(g=>g.objectId),"Duplicate performer");for(const g of o.performers){i(g.objectId,"object"),qn(g.roleIds,"Duplicate performer Role");for(const c of g.roleIds)i(c,"role")}}let r=o.performers===null;for(const g of o.procedure.steps)if(g.performerObjectIds!==null){qn(g.performerObjectIds,"Duplicate Step performer");for(const c of g.performerObjectIds)te(o.performers?.some(h=>h.objectId===c),"Step performer outside Activity assignment: "+c)}else o.performers?.length!==1&&(r=!0);r&&te(e.findings.some(g=>g.status==="open"&&g.scope==="items"&&g.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id);const s=o.procedure.steps.map(g=>g.id),d=new Map(s.map(g=>[g,[]])),a=new Set,u=[];for(const g of o.procedure.orderRules)if(g.kind==="before"){i(g.beforeId,"step",o.id),i(g.afterId,"step",o.id),te(g.beforeId!==g.afterId,"Self Step order");const c=JSON.stringify([g.beforeId,g.afterId]);te(!a.has(c),"Duplicate Step order"),a.add(c),d.get(g.beforeId).push(g.afterId),te(s.indexOf(g.beforeId)<s.indexOf(g.afterId),"Standard Step order contradicts before constraint")}else{qn(g.stepIds,"Duplicate interchangeable Step");for(const c of g.stepIds)i(c,"step",o.id);u.push(g.stepIds)}const l=(g,c)=>{const h=[g],m=new Set;for(;h.length;){const f=h.pop();if(!m.has(f)){m.add(f);for(const b of d.get(f)){if(b===c)return!0;h.push(b)}}}return!1};for(const g of s)te(!l(g,g),"Step order cycle");const p=new Set;for(const g of u){const c=JSON.stringify([...g].sort());te(!p.has(c),"Duplicate interchangeable group"),p.add(c);for(const h of g)for(const m of g)h!==m&&te(!l(h,m),"Interchangeable Steps conflict with before constraint")}}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}const te=(e,t)=>{if(!e)throw Error(t)};function oi(e,t=Ir,n="$"){if(t.$ref)return oi(e,Ir.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{oi(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&te(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;te(i===t.type,"Invalid type at "+n)}if(t.minLength&&te(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&te(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])te(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))te(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),oi(e[i],t.properties[i],n+"."+i)}t.type==="array"&&(t.minItems!==void 0&&te(e.length>=t.minItems,"Too few items at "+n),e.forEach((i,o)=>oi(i,t.items,n+"["+o+"]")))}function Au(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,a,u=d.id)=>{te(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,a),o.set(s.id,u)};for(const s of e.documents){r(s,s,"document");for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[d]??[])r(u,s,a)}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}for(const s of e.documents.filter(d=>d.kind==="businessDesign"&&d.schemaVersion==="0.4")){for(const d of s.objects)for(const a of d.information)r(a,s,"information",d.id);for(const d of s.activities){for(const a of d.procedure.steps)r(a,s,"step",d.id);for(const a of d.results)r(a,s,"result",d.id)}for(const d of s.data)r(d,s,"data")}return{map:t,owner:n,types:i,parent:o}}function Eu(e){return oi(e),Ia(e)}function Ia(e,{allowUnresolvedFindings:t=!1}={}){te(e.documents.length>0,"Document required");const n=Au(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const c of e.sources)if(c.uri){const h=new URL(c.uri);te(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const a=(c,h,m)=>(te(i.has(c),"Dangling reference: "+c),h&&te(r.get(c)===h,"Reference type mismatch: "+c),m&&te(o.get(c)===m,"Cross-document mismatch: "+c),i.get(c)),u=c=>c?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),l=(c,h)=>{for(const m of c)if(m.kind==="reference"&&(a(m.targetId,null,h),te(["document","section","guarantee","example","check","note"].includes(r.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const f=new URL(m.uri);te(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}};for(const c of e.documents)if(te(e.formatVersion!=="0.1"||c.kind!=="stateTransition","State documents require formatVersion 0.2"),c.kind==="businessDesign"){te(c.activities.length>0,"Activity required");const h=[...c.objects,...c.activities].map(b=>b.name);te(new Set(h).size===h.length,"Duplicate visible name"),te(h.every(b=>b===b.trim()&&!(["0.4","0.5"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(A=>b.includes(A))),"Invalid Graph-visible name");for(const b of c.objects)te(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3","0.4"].includes(c.schemaVersion)&&(te(new Set(c.roles.map(b=>b.name)).size===c.roles.length,"Duplicate Role name"),te(c.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name"),c.schemaVersion!=="0.4"))for(const b of c.activities)b.roleId!==null?a(b.roleId,"role",c.id):d.add("Role未確定: "+b.id+" — "+b.who);for(const b of c.activities)te(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of c.exceptions??[])a(b.activityId,"activity",c.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;c.schemaVersion==="0.4"&&xu(c,n,a);for(const b of c.relations){a(b.fromId,m[b.kind][0],c.id),a(b.toId,m[b.kind][1],c.id);const A=JSON.stringify([b.kind,b.fromId,b.toId,b.dataId??b.label]);te(!f.has(A),"Duplicate relation"),f.add(A)}te(new Set(c.findings.map(b=>b.sourceId)).size===c.findings.length,"Duplicate Finding source ID");for(const b of c.findings){te(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),te(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const A of b.targetIds)a(A,null,c.id),te(["object","activity"].includes(r.get(A)),"Invalid Finding target");b.unresolvedTargets.length&&(te(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(c.kind==="stateTransition"){const h=a(c.basedOn.documentId,"document");te(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),te(h.revision===c.basedOn.revision,"Stale State source revision"),a(c.objectId,"object",h.id),te(!e.documents.some(f=>f!==c&&f.kind==="stateTransition"&&f.objectId===c.objectId),"Duplicate Object state declaration"),te(c.states.length>0&&new Set(c.states.map(f=>f.name)).size===c.states.length,"Duplicate/empty state names"),te(c.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),te(c.transitions.length<=1e3,"State transition row budget"),te(new Set(c.transitions.map(f=>f.sourceId)).size===c.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of c.transitions){f.fromId!=="@new"&&a(f.fromId,"state",c.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",c.id);const b=a(f.activityId,"activity",h.id);if(e.formatVersion!=="0.5"){const A=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);te(!m.has(A),"Duplicate state transition condition: "+m.get(A)+" / "+f.sourceId),m.set(A,f.sourceId)}if(["0.4","0.5"].includes(e.formatVersion))if(te(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const A=a(f.exceptionId,"exception",h.id);te(A.activityId===b.id,"Exception Activity mismatch")}else f.path==="exception"&&te(s.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else te(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);te(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),te(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),te(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),te(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+c.id)}else{const h=a(c.basedOn.documentId,"document");te(h.kind==="businessDesign","Check source is not BD"),te(h.revision===c.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+c.id),te(new Set(c.items.map(f=>f.checkId)).size===c.items.length,"Duplicate Check ID");const m=new Set;for(const f of c.index){a(f.activityId,"activity",h.id),te(!m.has(f.activityId),"Duplicate Activity index"),m.add(f.activityId),te(new Set(f.checkIds).size===f.checkIds.length,"Duplicate Check binding");for(const b of f.checkIds)a(b,"check",c.id)}te(new Set(c.sections.map(f=>f.activityId??f.title)).size===c.sections.length,"Duplicate Activity section");for(const f of c.sections)f.activityId!==null&&(a(f.activityId,"activity",h.id),te(m.has(f.activityId),"Section missing from index")),l(f.preamble,c.id);for(const f of c.guarantees){te(f.blocks.some(b=>b.kind==="prose"&&u(b.content)),"General guarantee prose required"),a(f.sectionId,"section",c.id);for(const b of f.blocks)if(b.kind==="prose")l(b.content,c.id);else{const A=a(b.exampleId,"example",c.id);te(A.guaranteeId===f.id,"Example owner mismatch")}}for(const f of c.examples){a(f.guaranteeId,"guarantee",c.id),te(f.columns.length>0,"Example columns required");for(const b of f.rows){te(b.length===f.columns.length,"Example column mismatch");for(const A of b)l(A,c.id)}}for(const f of c.items){const b=a(f.sectionId,"section",c.id);te(b.activityId===null?!c.index.some(A=>A.checkIds.includes(f.id)):c.index.some(A=>A.activityId===b.activityId&&A.checkIds.includes(f.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),te(u(f.fields.guarantee)||u(f.fields.condition)&&u(f.fields.expectedResult),"Check guarantee required");for(const A of Object.values(f.fields))l(A,c.id);te(b.activityId===null||c.index.some(A=>A.checkIds.includes(f.id)),"Unbound Check")}for(const f of c.notes)l(f.content,c.id);l(c.intro,c.id)}const p=e.diagnostics.filter(c=>c.startsWith("Role未確定:"));te(new Set(p).size===p.length,"Duplicate unresolved Role diagnostic");for(const c of p)te(d.delete(c),"Unresolved Who requires a diagnostic matching a current unresolved Activity");te(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const c of e.sources){a(c.documentId,"document");const h=c.documentId+"@"+c.revision;te(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const c of e.externalDocuments)te(e.sources.some(h=>h.documentId===c.id&&h.revision===c.revision),"External source revision missing"),te(c.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+c.id);return{diagnostics:s,entities:i.size}}function Ou({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=(e.formatVersion==="0.5"?Ia:oa)({formatVersion:["0.5","0.6","0.7"].includes(e.formatVersion)?e.formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const r=e.business,s=[...r.objects,...r.activities],d=[...r.objects.map(p=>({...p,information:p.information.map(g=>typeof g=="string"?g:g.name),type:"object"})),...r.activities.map(p=>({id:p.id,type:"business",name:p.name,scope:p.scope,why:p.why,when:p.when,who:En(r,p),where:p.where,result:"results"in p?p.results.map(g=>g.text).join(`
`):p.result,...p.problem===null?{}:{problem:p.problem,pain_level:p.painLevel}}))],a=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(p=>p.basedOn.documentId===r.id).map(p=>{const g=new Map(p.states.map(h=>[h.id,h.name])),c={object:s.find(h=>h.id===p.objectId).name,states:p.states.map(h=>h.name),start:p.start,terminal:p.terminal,completeness:p.completeness,source:p.source,transitions:p.transitions.map(h=>({id:h.sourceId,from:g.get(h.fromId)??h.fromId,to:g.get(h.toId)??h.toId,activity:h.activityId,...h.event?{event:h.event}:{},...h.exceptionId?{exceptionId:h.exceptionId,exception:r.exceptions?.find(m=>m.id===h.exceptionId)?.name}:{},condition:h.condition,...h.conditionLabel?{conditionLabel:h.conditionLabel}:{},effect:h.effect,path:h.path,evidence:h.evidence,note:h.note}))};return[p.objectId,{model:c}]}))),u=r.relations.map(p=>({kind:p.kind,from:p.fromId,to:p.toId,label:Hr(r,p)})),l=["0.6","0.7"].includes(e.formatVersion)?(()=>{const g=_d(r).edges.map(c=>({kind:c.direction,from:c.direction==="input"?c.objectId:c.activityId,to:c.direction==="input"?c.activityId:c.objectId,label:c.label||(c.transferUndecided?"未決":"")}));for(const c of u)g.some(h=>h.kind===c.kind&&h.from===c.from&&h.to===c.to)||g.push(c);return g})():u;return{graph:aa({version:1,...r.scope?{scope:r.scope}:{},nodes:d,relations:l}),sections:Object.fromEntries(d.map(p=>[p.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:r.activities.map(p=>p.id),objectStateTransitions:a,findings:[...r.findings.map(p=>({...p,displayId:p.sourceId,targets:[...p.targetIds,...p.unresolvedTargets],targetNames:[...p.targetIds,...p.unresolvedTargets].map(g=>s.find(c=>c.id===g)?.name??g)})),...id(r)]}}const Sa=8*1024*1024;function xa(e){return/^\s*[\[{]/.test(e)}function Yo(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Sr(e,t){if(!e||!["0.4","0.5","0.6","0.7"].includes(e.formatVersion))throw Error("JSON専用経路はformatVersion 0.4、旧候補0.5または候補0.6・0.7が必要です（旧形式は互換入力adapter）。");Yo(e);const n=e.formatVersion==="0.5"?Eu(e):Fi(e),i=e.documents.filter(r=>r.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(r=>r.kind==="checkItems"),states:e.documents.filter(r=>r.kind==="stateTransition"),concepts:e.documents.filter(r=>r.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function ju(e,t){if(!xa(e)){if(t!==void 0)throw Error("案を含まない文書です。");return uu(e)}if(new TextEncoder().encode(e).byteLength>Sa)throw Error("ローカルJSONは8MiB以内にしてください。");let n=ia(e.replace(/^\uFEFF/,""));Yo(n);let i;if(n?.format==="alder-named-plans"){ou(n);for(const s of n.plans)if(Yo(s.package),s.package.documents.filter(d=>d.kind==="businessDesign").length!==1)throw Error("業務案 "+s.id+" にはBusiness Designが1件必要です。");const o=t??n.plans[0].id,r=n.plans.find(s=>s.id===o);if(!r)throw Error("指定した業務案がありません: "+o);i={selected:o,choices:n.plans.map(({id:s,name:d})=>({id:s,name:d}))},n=r.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const o=Sr(ya(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const r=o.data.business;r.schemaVersion="0.1",delete r.roles;for(const s of r.activities)"roleId"in s&&delete s.roleId;o.data.diagnostics=o.data.diagnostics.filter(s=>!s.startsWith("Role未確定:"))}return{...o,...i?{namedPlans:i}:{}}}return{...Sr(n,e),...i?{namedPlans:i}:{}}}function sn(e,t){return Ou(ju(e,t))}async function Cu(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>Sa)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!xa(n))throw Error("JSONファイルの本文を確認してください。");return sn(n)}const Du=(e,t)=>As(e,t,!1);async function As(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,r=()=>o.abort();t?.addEventListener("abort",r,{once:!0}),t?.aborted&&r();const s=setTimeout(r,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const u=2*1024*1024;if(Number(d.headers.get("content-length"))>u)throw Error("本文は2MiB以内にしてください。");const l=d.body?.getReader();if(!l)throw Error("本文を読み取れません。");let p=0,g="";const c=new TextDecoder;try{for(;;){const{done:h,value:m}=await l.read();if(h)break;if(p+=m.length,p>u){try{l.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}g+=c.decode(m,{stream:!0})}g+=c.decode()}finally{l.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(g))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(g))throw Error("HTMLページは読み込めません。");return g}catch(d){const a=o.signal.aborted;throw r(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(s),t?.removeEventListener("abort",r)}}const Ji=Cu;async function ro(e,t){return sn(await As(e,t))}function Mu(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return sn(e)}const ao=e=>e==="question"?"要確認":"要修正";function Ru(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(r=>r.status==="open"&&r.kind===i&&r.targets.includes(t.id)).length;o&&n.push(`${ao(i)} ${o}`)}return n}function Lu(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ao(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const r=document.createElement("p");r.className="finding-reference-warning",r.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(r)}return t.append(et(e.content)),t}function Nu(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Pu(e,t,n,i=!1){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const r of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t)&&(!i||!s.id.startsWith("viewer:")))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=r.id,s.textContent=`${ao(r.kind)} · ${r.displayId??r.id}　${r.summary}`,s.onclick=()=>n({type:"finding",id:r.id}),o.append(s)}return o}function Tu(e,t,n,i,o){const r=document.createElement("section");r.className="findings-index";const s=document.createElement("label");s.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),s.append(d,document.createTextNode("解消済みも表示")),r.append(s);const a=(l,p,g)=>{const c=document.createElement("button");c.className="node-navigate finding-index-row",c.dataset.findingKey=l.type+":"+l.id;const h=document.createElement("strong");h.textContent=p;const m=document.createElement("span");return m.textContent=g,c.append(h,m),c.onclick=()=>i(l),c},u=e.graph.nodes.filter(l=>(!o||l.id===o)&&typeof l.problem=="string");if(u.length){const l=document.createElement("h3");l.textContent="困りごと",r.append(l);for(const p of u)r.append(a({type:"problem",id:p.id},`${p.name}（${String(p.pain_level)}）`,String(p.problem)))}for(const[l,p]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const g=(e.findings??[]).filter(h=>(!o||h.targets.includes(o))&&(t||h.status==="open")&&(l==="broken"?h.unresolvedTargets.length>0:h.scope===l&&!h.unresolvedTargets.length));if(!g.length)continue;const c=document.createElement("h3");c.textContent=`${p}（${g.length}件）`,r.append(c);for(const h of g)r.append(a({type:"finding",id:h.id},`${ao(h.kind)} · ${h.displayId??h.id}${h.status==="resolved"?" · 解消済み":""}`,h.summary))}if(r.childElementCount===1){const l=document.createElement("p");l.textContent="表示する指摘はありません。",r.append(l)}return r}function qu(e){const t=da(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((r,s)=>r===o[s]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...mc(),viewInset:[40,0],canvasOrigin:void 0}}function $u(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,r)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(r)}),n}function Es(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Wu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Es(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function zu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Es(t)),n.href}function Uu(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Es(t)}const Os=`# Alderを使った設計業務 — Business Design

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
`,Vu=`{
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
`;function Fu(e,t){const n=new Set(t.graph.nodes.map(g=>g.id)),i=new Map;for(const g of t.graph.nodes)i.set(g.name,i.has(g.name)?void 0:g.id);const o=g=>n.has(g)?g:i.get(g),r=Object.create(null);for(const[g,c]of Object.entries(e.positions)){const h=o(g);h&&(r[h]=c)}const{scroll:s,zoom:d,viewInset:a,canvasOrigin:u,showExceptions:l,selectedEdgesOnly:p}=e;return{positions:r,scroll:s,zoom:d,viewInset:a,canvasOrigin:u,showExceptions:l,selectedEdgesOnly:p,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(g=>{const c=o(g);return c?[c]:[]}))]}}}const Bu=`# Alderのチェックリストサンプル

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
`;function Gu(e,t,n,i,o=()=>!0,r=()=>{}){const s=e.ownerDocument,d=s.defaultView;let a,u=0,l=0,p=!1,g=null,c="";const h=new Map,m=()=>{a!==void 0&&(d.clearTimeout(a),u=Math.max(0,u-(Date.now()-l)),a=void 0)},f=(y=!1)=>{if(y&&!o())return;m(),h.delete(c);const S=[...h].at(-1);if(S){A(S[1],"error",S[0]);return}const x=e.contains(s.activeElement);e.hidden=!0,t.textContent="",r(),x&&(g?.isConnected?g:i).focus({preventScroll:!0})},b=()=>{e.hidden||e.dataset.kind==="error"||p||s.hidden||e.contains(s.activeElement)||(m(),l=Date.now(),a=d.setTimeout(f,u))};e.addEventListener("pointerenter",()=>{p=!0,m()}),e.addEventListener("pointerleave",()=>{p=!1,b()}),e.addEventListener("focusin",y=>{const S=y.relatedTarget;S&&!e.contains(S)&&(g=S),m()}),e.addEventListener("focusout",()=>d.setTimeout(b,0)),e.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),f(!0))}),s.addEventListener("visibilitychange",()=>s.hidden?m():b()),n.onclick=()=>f(!0);const A=(y,S,x)=>{m(),e.contains(s.activeElement)||(g=s.activeElement),c=x,e.dataset.kind=S,e.dataset.key=x,t.setAttribute("role",S==="error"?"alert":"status"),t.setAttribute("aria-live",S==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=y,r(),u=S==="warning"?8e3:5e3,b()};return(y,S="success",x="operation")=>{S==="error"&&y?(h.delete(x),h.set(x,y)):h.delete(x);const I=[...h].at(-1);if(I){if(!e.hidden&&t.textContent===I[1]&&c===I[0])return;A(I[1],"error",I[0]);return}if(!y){c===x&&f();return}!e.hidden&&t.textContent===y&&e.dataset.kind===S||A(y,S,x)}}const xr=Vu,Et=document.querySelector("#app");Et.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const k=e=>document.getElementById(e),Vn=la(location.pathname);Vn.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${Vn.version}`,k("preview-badge").title=`PR #${Vn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const fi=e=>Kn(e,{"stroke-width":1.8,"aria-hidden":"true"}),vi=document.createElement("div");vi.id="source-menu";vi.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';Et.append(vi);const co=document.createElement("div");co.id="checks-menu";co.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';Et.append(co);const Dn=document.createElement("section");Dn.id="check-followup";Dn.hidden=!0;Dn.setAttribute("aria-labelledby","check-followup-title");Dn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(Dn);const lo=document.createElement("div");lo.id="check-followup-menu";lo.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';Et.append(lo);const Ft=document.createElement("input");Ft.type="file";Ft.id="check-file";Ft.accept=".md,.markdown,text/markdown,text/plain";Ft.hidden=!0;Et.append(Ft);const rn=document.createElement("section");rn.id="check-url-dialog";rn.hidden=!0;rn.setAttribute("role","dialog");rn.setAttribute("aria-labelledby","check-url-title");rn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';Et.append(rn);const uo=document.createElement("div");uo.id="help-menu";uo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;Et.append(uo);so(k("help-menu-toggle"),uo);const ri=document.createElement("div");ri.id="url-history";vi.append(ri);function Hu(){if(ri.replaceChildren(),!C.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",ri.append(e);for(const t of C.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=re||Ne||ae,n.onclick=()=>{Ju(t.url)},ri.append(n)}}async function Ju(e){if(!(re||Ne||ae)){if(C.document?.source?.kind==="url"&&C.document.source.url===e){we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),Si();return}Ne=!0,Me();try{const t=await ro(e),n=Xn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await wi(n)}catch(t){t instanceof Rn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ne=!1,Me()}}}const _u=so(k("open-menu-toggle"),vi),Ku=so(k("open-checks"),co,()=>{const e=ne();k("check-open-sample").hidden=!e||!Rs(e),k("check-close").disabled=!e?.checks}),Aa=so(k("check-followup-open"),lo,()=>{k("check-followup-sample").hidden=!ne()||!Rs(ne())});for(const[e,t]of[["open-menu-toggle",Xs],["open",Xs],["open-url",hc],["open-text",bc],["view-markdown",gc],["open-checks",Rr],["share-source",yc],["refresh",vc],["help-menu-toggle",wc],["drawer",kc],["node-list-toggle",Ic],["node-list-close",Lr],["display-settings-toggle",Nr],["reset-layout",Sc],["save-image",xc],["copy-image",Ac],["out",qr],["in",$r]])k(e).prepend(fi(t));Ul(document.querySelector("header"));const Qo=zl(document.querySelector(".tab-strip"));let C={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Rt=!0,Yt=!1,re=!0,Jn=!1,On=!1,Ne=!1,Ar=Promise.resolve(),bn,ge,Lt=0,ae=!1,ai=!1,Fn=0,_i=0,Bn=!1,js=!1,es=!1,Er=!1;const ts=new Set,Qt=new Set,Ki=new Set;function Ea(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ki){const i=[...C.document?[C.document]:[],...C.recovery].find(r=>r.key===n),o=t.find(r=>r.key===n&&r.draft===i?.draft);i&&o&&Ki.delete(n)}}const ne=()=>C.tabs.find(e=>e.key===C.active),Mn=e=>tn(e)?.key??e.key,nn=e=>C.document?.key===Mn(e);let ns="";const Xu=Gu(k("status"),k("status-text"),k("status-close"),k("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(ns===e)return;ns=e}Xu(e,t,n)}function Cs(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Ds(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ht(){re||(Lt++,tt())}function Zu(e){e.preventDefault(),e.returnValue=!0}function tt(){const e=Lt>Fn||_i>0||!1||ae||Ki.size>0||es||Bn||On,t=!re&&e;t!==Er&&(Er=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Zu));const n=re?"restoring":Jn?"protected":On?"conflict":Bn?"error":es||Ki.size>0?"draft":_i>0||ae?"saving":Lt>Fn?"dirty":js?"saved":"unchanged";Et.dataset.saveState!==n&&(Et.dataset.saveState=n),Jn?Cs():On?Ds():Bn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),fo()}function Ms(e){Bn=!0,ns=""}function po(){if(Jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(On)throw new ks}async function Yu(e){po();try{await wl(e)}catch(t){throw t instanceof ks&&(On=!0,clearTimeout(bn),bn=void 0,Ds()),t}}function Oa(e,t){_i++,ts.add(t),tt();const n=Ar.catch(()=>{}).then(()=>Yu(e)).then(()=>{Fn=Math.max(Fn,t),js=!0,Ea(e),Fn===Lt&&(Bn=!1)},i=>{throw Ms(),i}).finally(()=>{_i--,ts.delete(t),tt()});return Ar=n.catch(()=>{}),n}function Ae(e=180,t=!0){if(re)return;if(t&&Lt++,clearTimeout(bn),bn=void 0,Jn){Cs(),tt();return}if(On){Ds(),tt();return}if(ae||ts.has(Lt)||!t&&Lt<=Fn&&!Bn){tt();return}const n=()=>{bn=void 0;let i;try{i=structuredClone(Is(C))}catch{Ms(),tt();return}Oa(i,Lt).catch(()=>tt())};e===0?n():bn=window.setTimeout(n,e),tt()}async function Qu(e){if(re||ge||ae||!C.tabs.includes(e))return;if(li(e)===void 0){Ue?.closeBusinessOverview();return}bt.cancel(),we();const t=C.active===e.key,n={...C,tabs:C.tabs.filter(i=>i!==e),active:t?C.tabs[0]?.key:C.active};try{await ki(()=>n,()=>{C=n}),t&&Et.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{tt()}}function pt(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!ne(),t=e&&C.drawer,n=e&&!!C.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Yt=!1),fo(),k("layout-lock").replaceChildren(fi(Rt?Pr:Tr)),k("layout-lock").setAttribute("aria-pressed",String(Rt)),k("layout-lock").title=Rt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",re),k("viewport").dataset.layoutLocked=String(Rt),k("prefer-write").checked=C.preferWrite===!0,k("prefer-write").disabled=re,k("show-exceptions").checked=ne()?.showExceptions!==!1,k("show-exceptions").disabled=re||ae||!ne()||ge===ne(),k("selected-edges-only").checked=ne()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=re||ae||!ne()||ge===ne(),document.documentElement.dataset.theme=C.dark?"dark":"light",k("theme").replaceChildren(fi(C.dark?Mc:Rc)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(C.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",re||!e),k("node-list-drawer").hidden=!n||ft().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",re||!e),Ue?.syncChrome()}function is(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!ne(),t.disabled=ai||re||!ne()||ge===ne(),t.setAttribute("aria-busy",String(ai))}}function fo(){is(),document.querySelector(".toolbar").dataset.settingsOpen=String(Yt),k("display-options").hidden=!Yt,k("reset-layout").disabled=re||Ne||ae||!1||!ne()||Qt.has(C.document?.key??"")||Jn||On;const e=k("display-settings-toggle"),t=Yt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Yt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=re||ae||!ne()||ge===ne()}function ja(e,t=!1){const n=ne();re||ae||!n||ge===n||e===Yt||(e&&(_n.delete(tn(n)?.key??n.key),mo()),bt.cancel(),qe=void 0,we(),Yt=e,fo(),Gt(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function Ca(e){const t=ne();if(!(ai||re||!t||ge===t)){ai=!0,is();try{const n=Kl(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Yl(n),$e("グラフ全体のPNGをコピーしました。")):await Zl(n,(tn(t)?.name??t.name)+(li(t)?" - "+li(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{ai=!1,is()}}}k("save-image").onclick=()=>Ca(!1);k("copy-image").onclick=()=>Ca(!0);k("display-settings-toggle").onclick=()=>ja(!Yt);k("reset-layout").onclick=()=>{const e=ne();if(re||Ne||ae||ge||!e||Qt.has(Mn(e)))return;try{po()}catch{tt();return}bt.cancel(),fn.cancel(),qe=void 0,we();const t={...e,design:io(e)},n=qu(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Pa.invalidate(e),Me(),n!==t&&Ae()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Yt&&k("source-dialog").hidden&&(e.preventDefault(),ja(!1,!0))});function we(e=!0){const t=ne();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Ht(),Ae(180,!1)),i}function Da(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function os(){_u.close(),Ku.close(),Aa.close(),Qo.close(),Da(ep),Qo.update()}function ep(){const e=k("tabs");e.replaceChildren(),C.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===C.active?" active":""),n.draggable=li(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Gi(t)!==void 0&&(n.dataset.activity=Gi(t)),Hi(t)!==void 0&&(n.dataset.object=Hi(t));const i=document.createElement("button");$o(i,"business",t.name),i.setAttribute("aria-current",String(t.key===C.active)),i.disabled=ae,i.onclick=async()=>{if(ae||Pt&&Pt!==t.key&&!await Ii())return;const r=we()||C.active!==t.key;Ue?.activateBusiness(),C.active=t.key,Me(),Ue?.businessActivated(),Ae(180,r)};const o=Wo("業務設計："+t.name+"を閉じる");o.disabled=ae,o.onclick=()=>Qu(t),n.append(i,o),n.ondragstart=r=>r.dataTransfer?.setData("text/plain",t.key),n.ondragover=r=>r.preventDefault(),n.ondrop=r=>{if(r.preventDefault(),ae)return;const s=C.tabs.findIndex(a=>a.key===r.dataTransfer?.getData("text/plain")),d=C.tabs.indexOf(t);if(s>0&&d>0&&s!==d){const[a]=C.tabs.splice(s,1);C.tabs.splice(d,0,a),os(),Ae()}},n.onkeydown=r=>{if(!ae&&r.altKey&&(r.key==="ArrowLeft"||r.key==="ArrowRight")){r.preventDefault();const s=C.tabs.indexOf(t),d=s+(r.key==="ArrowLeft"?-1:1);s>0&&d>0&&d<C.tabs.length&&([C.tabs[s],C.tabs[d]]=[C.tabs[d],C.tabs[s]],os(),Ae())}},e.append(n)})}const Or=new Map,_n=new Set;function mo(){const e=ne(),t=!!e&&e.design.sourceFormat!=="json"&&_n.has(tn(e)?.key??e.key)&&!e.checks;t||(Aa.close(),Dn.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),Dn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=re||Ne||ae||!1||!e||yn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=ne();e&&_n.delete(tn(e)?.key??e.key),mo()};let ss;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{ss=k("check-followup-open"),k(t).click(),ss=void 0};function Rs(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Os}function yn(e){const t=tn(e)?.key??e.key;let n=Or.get(t);return n||(n={},Or.set(t,n)),n}async function Ls(e,t){if(!nn(e))throw Error("原本文書が切り替わりました。");const n=Vt(C,C.recovery,{...C.document,checks:t},Is(C).views);await ki(()=>n,()=>{C=n,t&&_n.delete(tn(e)?.key??e.key)})}async function Ma(e,t){const n=yn(e);if(e.design.sourceFormat==="json"||n.busy||ae||re||ge===e)return;const i=ui(e);n.busy=!0,n.error=void 0,n.candidate=void 0,on();try{const o=await t();if(!nn(e))return;if(i!==ui(C.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const r=Hn(o),s=pi(r,C.tabs[0]);if(s.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+s.reason);s.state==="unverified"?n.candidate=o:(await Ls(e,o),n.candidate=void 0,Ue?.openRelatedChecks(ne()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,$e(n.error,"error")}finally{n.busy=!1,on()}}async function Ra(e,t){const n=yn(e);if(n.busy||ae||!nn(e))return;const i=pi(Hn(t),C.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,on();return}n.busy=!0,n.error=void 0;try{await Ls(e,{...t,confirmedFor:ui(C.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(ne()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,on()}}function on(){mo();const e=ne(),t=k("detail"),n=e?yn(e):void 0,i=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=re||ae||ge===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,r=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const s=e.design.graph.nodes.find(p=>p.id===e.selected),d=Wl(e,n,{disabled:re||ae||ge===e,redraw:on,confirm:p=>{Ra(e,p)}}),a=document.createElement("div");a.className="right-drawer-heading";const u=nd(s?.name??"業務設計");if(s){const p=s.type==="business"?La(String(s.who),s.id):Gr(s);p.classList.add("drawer-node-icon"),u.prepend(p)}a.append(u);const l=document.createElement("button");if(l.type="button",l.id="business-drawer-close",l.setAttribute("aria-label","右ドロワーを閉じる"),l.textContent="×",l.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},a.append(l),t.append(a),d.hasChildNodes()&&t.append(d),s){const p=Pu(e.design,s.id,Xi,s.type==="business");p.hasChildNodes()&&t.append(p)}t.append(el(e.design,s?.id,p=>Xi({type:"finding",id:p}))),s?.type==="business"&&Ue?.appendActivityTestLinks(t,s.id),t.scrollTop=r,o&&document.getElementById(o)?.focus({preventScroll:!0})}const jr=new Map,ft=()=>{const e=C.active??"";let t=jr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},jr.set(e,t)),t};function Xi(e){if(!ne())return;const t=ft();t.mode="findings",t.finding=e,C.nodeDrawer=!0,innerWidth<=800&&(C.drawer=!1),pt(),xt(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Ae()}function tp(e){const t=ne();if(!t)return;const n=ft();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){Xi(i[0]);return}C.nodeDrawer=!0,innerWidth<=800&&(C.drawer=!1),pt(),xt(),k("drawer-mode-findings").focus({preventScroll:!0}),Ae()}function np(e,t){const n=ft().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return ft().finding=void 0,!1;const r=document.createElement("button");if(r.className="node-navigate finding-back",r.textContent="← 指摘一覧に戻る",r.onclick=()=>{ft().finding=void 0,xt(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(r),i)t.append(Lu(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,et(String(o.problem)))}const s=i?.targets??[o.id];if(s.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const u of s){const l=document.createElement("button");l.className="node-navigate finding-target-link",l.dataset.findingTarget=u;const p=e.design.graph.nodes.some(c=>c.id===u),g=e.hiddenNodes?.includes(u);l.disabled=!p||!!g,l.textContent=(e.design.graph.nodes.find(c=>c.id===u)?.name??u)+(p?g?"（非表示）":"":"（参照先なし）"),l.onclick=()=>$i(u,!0),d.append(l)}t.append(d)}return!0}function La(e,t){let n=0;for(const s of e)n=n*31+s.codePointAt(0)>>>0;const i=document.createElement("span");i.className="who-badge",i.style.setProperty("--role-color",(t&&ne()?.design.model?.business.roles?ms(ne().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true");const o=ne()?.design.model?.business.activities.find(s=>s.id===t),r=o&&"who"in o&&typeof o.who=="object"?o.who?.kind:void 0;return i.append(fi(r==="system"?Lc:r==="scheduler"?Nc:Ur)),i}function ho(e,t=!0){re||!ne()||(bt.cancel(),we(),C.nodeDrawer=e,e&&ft().mode==="findings"&&innerWidth<=800&&(C.drawer=!1),pt(),e&&ne()?.selected&&Zn(ne().selected),xt(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Ae())}function Zn(e){const t=ne(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=ft();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(td(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(r=>r.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function ip(e,t){const n=ne();if(!n||re||ae||ge===n)return;bt.cancel(),qe=void 0,we();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],vn(),Ae()}function $i(e,t=!1){let n=ne();if(n&&!io(n).graph.nodes.some(p=>p.id===e)&&(we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,n=ne(),Me()),!n||n.hiddenNodes?.includes(e)||ge===n)return;t||(ft().finding=void 0);const i=k("node-list").contains(document.activeElement);bt.cancel(),qe=void 0,we(),n.selected=e,Zn(e),pt(),vn();const o=k("viewport"),r=o.getBoundingClientRect(),s=k("formattedMarkdownDrawer").getBoundingClientRect(),d=C.drawer&&s.left>r.left&&s.left<r.right?s.left:r.right,a=Math.max(1,Math.min(o.clientWidth,d-r.left-o.clientLeft)),u=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const l=n.positions[e];if(n.scroll=[(l[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(l[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-u/2],Gt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],we(),i){const p=t?"[data-finding-target]":"[data-list-node]",g=Array.from(k("node-list").querySelectorAll(p)).find(c=>(t?c.dataset.findingTarget:c.dataset.listNode)===e);(t?g:g?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Ae()}function xt(){const e=ne(),t=ft(),n=k("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const r=k("drawer-modes");r.replaceChildren();for(const h of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+h,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===h)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===h?0:-1,m.textContent=`指摘（${e?Nu(e.design):0}）`;const f=()=>{t.mode=h,xt(),k("drawer-mode-"+h).focus({preventScroll:!0})};m.onclick=f,m.onkeydown=b=>{["ArrowLeft","ArrowRight","Home","End"].includes(b.key)&&(b.preventDefault(),m.focus({preventScroll:!0}))},r.append(m)}for(const h of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])h.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const s=k("node-list-search");s.value=t.search,s.disabled=!e||re;const d=k("node-categories");d.replaceChildren();for(const[h,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const f=document.createElement("button");f.dataset.category=h,f.id="node-category-"+h,f.setAttribute("role","tab"),f.setAttribute("aria-selected",String(t.category===h)),f.setAttribute("aria-controls","node-list"),f.tabIndex=t.category===h?0:-1,f.textContent=m,f.onclick=()=>{t.category=h,xt(),k("node-category-"+h).focus({preventScroll:!0})},f.onkeydown=b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;b.preventDefault();const A=["activity","object","role"],y=A.indexOf(h);t.category=b.key==="Home"?"activity":b.key==="End"?"role":A[(y+(b.key==="ArrowRight"?1:2))%3],xt(),k("node-category-"+t.category).focus({preventScroll:!0})},d.append(f)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),u=e?.design.graph.nodes.filter(h=>h.scope===!1)??[],l=u.filter(h=>!a.has(h.id)).length,p=k("scope-outside"),g=l===u.length?"true":l===0?"false":"mixed";p.setAttribute("aria-pressed",g),p.setAttribute("aria-label",g==="true"?"スコープ外を非表示":"スコープ外を表示"),p.replaceChildren(fi(g==="false"?Pc:Tc)),p.disabled=!u.length||re||ge===e;const c=k("show-outside");if(c.checked=g==="true",c.indeterminate=g==="mixed",c.setAttribute("aria-checked",g),c.disabled=p.disabled,k("scope-count").textContent=g==="mixed"?`${l}/${u.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(np(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const h=document.createElement("p");h.textContent=(e.design.graph.nodes.find(f=>f.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,xt(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(h,m)}n.append(Tu(e.design,t.resolved,h=>{t.resolved=h,xt(),n.querySelector("input")?.focus({preventScroll:!0})},Xi,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>ho(!C.nodeDrawer);k("node-list-close").onclick=()=>ho(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),ho(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),ho(!1))});k("node-list-search").oninput=()=>{ft().search=k("node-list-search").value,xt()};function Na(){const e=ne();if(e){const t=e.design.graph.nodes.filter(n=>n.scope===!1);ip(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=Na;k("show-outside").onchange=Na;const op="http://www.w3.org/2000/svg",Lo=e=>document.createElementNS(op,e),Pa=new Ho,Cr=new WeakMap;function sp(e){if(!Br(e.graph))return;let t=Cr.get(e);return t||(t=yl(e),Cr.set(e,t)),t.wires}function rp(e,t,n){ps(k("edges"),e,t,{"data-relation":String(n)})}let mi=()=>{},Zt=[0,0],pn=[0,0];function ap(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function cp(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Gt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(p=>p[0])),Math.min(0,...i.map(p=>p[1]))],r=[o[0]<0||n[0]>0?Math.min(o[0],pn[0]):0,o[1]<0||n[1]>0?Math.min(o[1],pn[1]):0],{growth:s,origin:d}=Dc(n,r,e.zoom),a=s.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+s[0],e.scroll[1]+s[1]],Ht(),Ae(180,!1));const u=Math.ceil(Math.max(1400,Zt[0],(ap()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(p=>p[0]+340))),l=Math.max(850,Zt[1],Math.max(Zt[1],...i.map(p=>p[1]+68))+cp()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(p=>p[1]+220));k("canvas").style.width=(u+d[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(l+d[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(d[0]+t[0])*e.zoom+"px",k("nodes").style.top=(d[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=u+"px",k("nodes").style.height=l+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${u+d[0]} ${l+d[1]}`),k("edges").style.width=(u+d[0])*e.zoom+"px",k("edges").style.height=(l+d[1])*e.zoom+"px",a&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function vn(){Da(dp)}function dp(){fo(),fn.cancel(),mi=()=>{},Zt=[0,0],pn=[0,0];const e=ne();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,on(),xt();return}const t=io(e),n=t.graph.nodes,i=n.filter(l=>!e.hiddenNodes?.includes(l.id)),o=new Set(i.map(l=>l.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const r=e.selected,s=e.positions,d=Ui(t.graph.relations,r);Gt(e),k("edges").append(us());const a=$u(t.graph.relations,C.preferWrite===!0),u=()=>{const l=n.flatMap(f=>{const b=s[f.id];return b?[{id:f.id,x:b[0],y:b[1],width:260,height:68}]:[]}),p=sp(t),g=Pa.update(e,t,l,t.graph.relations,p),c=new Map;for(Zt=[0,0],pn=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const h=new Map(e.design.graph.nodes.map(f=>[f.id,f.name]));t.graph.relations.forEach((f,b)=>{if(a.has(b))return;const A=g[b];if(!A||(Zt[0]=Math.max(Zt[0],A.bounds.right+20,A.label[0]+Math.max(30,f.label.length*12)/2+12),Zt[1]=Math.max(Zt[1],A.bounds.bottom+20,A.label[1]+22),pn[0]=Math.min(pn[0],...A.points.map(j=>j[0]-20),A.label[0]-Math.max(30,f.label.length*12)/2-12),pn[1]=Math.min(pn[1],...A.points.map(j=>j[1]-20),A.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(f)||!o.has(f.from)||!o.has(f.to)||e.showExceptions===!1&&(f.kind==="business-exception"||f.kind==="object-exception")))return;const y=Lo("path");y.setAttribute("d",A.path),y.dataset.relation=String(b),y.dataset.collisions=String(A.collisions),y.dataset.rerouted=String(A.rerouted),y.dataset.fallback=String(A.fallback),y.setAttribute("marker-end","url(#arrow)"),y.classList.add("edge"),f.kind.endsWith("exception")&&y.classList.add("exception"),d.related(f)&&(y.classList.add("review-related"),y.setAttribute("marker-end","url(#related-arrow)")),d.muted(f)&&y.classList.add("muted");const S=Lo("title");S.textContent=(h.get(f.from)??f.from)+" → "+(h.get(f.to)??f.to)+": "+f.label,y.append(S),k("edges").append(y),f.kind.endsWith("exception")&&rp(y,A,b);const x=Fr(f,b,p?.[b]),I=c.get(x);if(I){I.dataset.relations+=" "+b,d.related(f)&&(I.classList.add("review-related"),I.classList.remove("muted"));return}const E=Lo("text");c.set(x,E),E.dataset.relations=String(b),E.setAttribute("x",String(A.label[0]-Math.max(30,f.label.length*12)/2)),E.setAttribute("y",String(A.label[1])),E.setAttribute("text-anchor","start"),E.classList.add("edge-label"),E.setAttribute("dominant-baseline","middle"),E.dataset.relation=String(b),d.related(f)&&E.classList.add("review-related"),d.muted(f)&&E.classList.add("muted"),E.textContent=f.label,k("edges").append(E)});const m=k("edges");for(const f of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(f);Gt(e)};mi=u,u(),i.forEach(l=>{const p=document.createElement("div");p.setAttribute("role","group"),p.className="node "+l.type+(l.scope===!1?" outside":l.scope===null?" scope-undecided":"")+d.nodeClasses(l.id),p.dataset.node=l.id,l.type==="business"&&(p.dataset.activity=l.id),p.style.left=s[l.id][0]+"px",p.style.top=s[l.id][1]+"px",l.type==="business"?p.append(La(String(l.who),l.id)):p.append(Gr(l));const g=document.createElement("span");g.className="node-text";const c=document.createElement("span");c.className="review-kind",c.textContent=(l.type==="business"?"Activity":"Object")+(l.scope===null?" · 範囲未決":l.scope?" · 範囲内":" · 範囲外"),g.append(c);const h=document.createElement("span");if(h.className="node-name",h.textContent=l.name,g.append(h),l.type==="business"){const y=document.createElement("small");y.textContent=String(l.who),g.append(y)}if(p.append(g),qc(l.id,li(e))){const y=document.createElement("button");y.type="button",y.className=l.type==="business"?"activity-open":"object-open",y.setAttribute("aria-label",l.name+"の詳細タブを開く"),y.title="詳細タブを開く",y.textContent="開く",y.onpointerdown=S=>S.stopPropagation(),y.onpointerup=S=>S.stopPropagation(),y.onclick=S=>{S.stopPropagation(),l.type==="business"?rs(l.id):Ta(l.id),Ue?.businessActivated()},p.append(y)}p.title=l.name+(l.type==="business"?" — "+String(l.who):""),p.setAttribute("aria-label",p.title+(l.id===r?"（選択中）":""));const m=Ru(e.design,l);if(m.length){const y=document.createElement("button");y.type="button",y.className="finding-badges",y.textContent=m.join(" · "),y.setAttribute("aria-label",l.name+"の指摘を開く"),y.onpointerdown=S=>S.stopPropagation(),y.onpointerup=S=>S.stopPropagation(),y.onclick=S=>{S.stopPropagation(),tp(l.id)},p.append(y),p.setAttribute("aria-label",p.getAttribute("aria-label")+" · "+m.join("、"))}let f;const b=p;b.onpointerdown=y=>{y.button!==0||ge===e||Rt||(y.stopPropagation(),b.setPointerCapture(y.pointerId),f=y.pointerId,fn.begin(l.id,[y.clientX,y.clientY]))},b.onpointermove=y=>{f===void 0||y.pointerId!==void 0&&y.pointerId!==f||!p.isConnected||ge===e||fn.move([y.clientX,y.clientY])},b.onpointerup=y=>{if(f===void 0||f!==y.pointerId||(f=void 0,!p.isConnected||ge===e))return;const S=fn.end();b.hasPointerCapture?.(y.pointerId)&&b.releasePointerCapture(y.pointerId),S&&(S.moved||(ft().finding=void 0,e.selected!==l.id&&(e.selected=l.id,Ht()),Zn(l.id)),we(),vn(),Ae(180,!1))};const A=y=>{f===void 0||f!==y.pointerId||(f=void 0,p.isConnected&&(fn.cancel(),we(),Ae(180,!1)))};b.onpointercancel=A,b.onlostpointercapture=A,k("nodes").append(p)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",on(),xt()}function rs(e){re||ae||ge||(we(),Cl(C,e),Me(),Ae(),k("viewport").focus({preventScroll:!0}))}function Ta(e){re||ae||ge||(we(),Dl(C,e),Me(),Ae(),k("viewport").focus({preventScroll:!0}))}function Me(){qa(),document.title=C.document?C.document.name+" · Alder Viewer":"Alder Viewer",bt.cancel(),qe=void 0,pt(),os(),vn();const e=ne();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",re||ae||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",re||Ne||ae||!1||!e||Qt.has(Mn(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",re||Ne||ae||!1||!e||!!(e&&yn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",re||Ne||ae);k("open-sample").setAttribute("aria-disabled",String(re||Ne||ae)),k("open-sample").tabIndex=re||Ne||ae?-1:0,k("theme").toggleAttribute("disabled",re),gi(),mo(),Hu(),yo(),Ue?.syncDocument()}function qa(){const e=k("header-title"),t=C.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{lp(n.value)},e.append(n));const i=Array.from(n.options).map(o=>[o.value,o.textContent]);JSON.stringify(i)!==JSON.stringify(t.choices.map(({id:o,name:r})=>[o,r]))&&n.replaceChildren(...t.choices.map(({id:o,name:r})=>{const s=document.createElement("option");return s.value=o,s.textContent=r,s})),n.value=t.selected,n.title=t.choices.find(o=>o.id===t.selected)?.name??"",n.disabled=re||Ne||ae||!1}async function lp(e){const t=C.document;if(!t?.design.namedPlans||re||Ne||ae||ge||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),i=document.activeElement===n;try{if(!k("source-dialog").hidden&&!await Ii()){qa();return}const o=sn(t.design.markdown,e),r=crypto.randomUUID(),s=Vt({...C,tabs:[],active:r},C.recovery,{...t,design:o},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await ki(()=>s,()=>{C=s}),Ue?.reopenBusinessOverview(),Ue?.activateBusiness(),Ue?.businessActivated(),$e("")}catch(o){Me(),o instanceof Rn||$e("案を切り替えられません: "+o.message,"error")}finally{i&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function wi(e){const t=C.document,n=Ol(C,e);return t?(await ki(()=>n,()=>{C=n,_n.add(tn(C.tabs[0])?.key??C.tabs[0].key)}),!0):(we(),C=n,_n.add(tn(C.tabs[0])?.key??C.tabs[0].key),Me(),Ae(),!0)}async function $a(e,t){if(Pt&&!await Ii())return;const n=await Ji(e),i=ne();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await hi(i,n,t))return;Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),Ae();return}const o=Xn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await wi(o)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(re||Ne||ae))try{if(C.document?.source?.kind==="sample"&&C.document.design.markdown===xr){we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),k("viewport").focus({preventScroll:!0});return}const t=sn(xr),n=C.document?.source?.kind==="sample"&&C.document.design.markdown===Os?C.tabs[0]:void 0;n&&we();const i=n??C.sampleLayout,o=i?Fu(i,t):{},r=Xn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await wi(r)&&k("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(re||Ne||ae)){Ne=!0,Me();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await $a(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Ne=!1,Me()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(re||Ne||ae)){Ne=!0,Me();try{for(const t of Array.from(e.files??[]))await $a(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Ne=!1,Me()}};class Rn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function ki(e,t){if(ae||ge)throw Error("表示を切り替えています。完了後に再試行してください。");try{po()}catch(o){throw new Rn(o)}we(),clearTimeout(bn),bn=void 0,ae=!0,Lt++;const n=Lt;Me(),tt();let i=!1;try{const o=structuredClone(Is(e()));await Oa(o,n);const r=C;t(),C!==r&&(C=Ml(C,r)),ut==="view"&&Pt&&!C.tabs.some(s=>s.key===Pt)&&(Pt=C.tabs[0]?.key),Ea(o),i=!0}catch(o){throw Ms(),new Rn(o)}finally{ae=!1,Me(),tt(),i&&Lt!==n&&Ae(0,!1)}}async function hi(e,t,n=e.handle,i=!1){if(!nn(e)||e.design!==C.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=sn(t.markdown,e.design.namedPlans.selected));const o=!!e.design.namedPlans!=!!t.namedPlans,r=crypto.randomUUID(),s=C.document,d=o&&s?Vt({...C,tabs:[],active:r},C.recovery,{...s,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):jl(C,t,n,i);return await ki(()=>d,()=>{C=d}),jn=void 0,yo(),$e(""),!0}async function Dr(e){if(!nn(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await hi(e,await Ji(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const r=()=>{o.remove(),n()};o.oncancel=r,o.onchange=async()=>{try{const s=o.files?.[0];s&&await hi(e,await Ji(s)),r()}catch(s){o.remove(),i(s)}},o.click()})}k("refresh").onclick=async()=>{const e=ne();if(re||ae||ge||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Qt.has(Mn(e)))return;Pt===e.key&&Yi();const t=Mn(e);Qt.add(t),Me();try{if(e.source?.kind==="url"){const i=await ro(e.source.url);await hi(e,i);return}if(!e.handle){await Dr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!nn(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Dr(e);return}await hi(e,await Ji(await e.handle.getFile()))}catch(n){nn(e)&&n.name!=="AbortError"&&!(n instanceof Rn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Qt.delete(t),Me()}};let ut="text",Pt,en=!1,gn=0,Zi,as=null;const Bt=()=>k("source-text"),bi=()=>k("source-url");function Ns(){es=!k("source-dialog").hidden&&ut!=="view"&&(ut==="text"?Bt().value:bi().value)!=="",tt()}bi().addEventListener("input",Ns);function gi(){cs();const e=ut==="view",t=en||ae;Bt().disabled=t,Bt().readOnly=e,k("source-dialog").dataset.mode=ut,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=ae||t&&ut!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",Ns(),queueMicrotask(Ua)}function Ps(e,t){if(!(re||Ne||ae||t&&Qt.has(Mn(t)))){Zi?.abort(),gn++,ut=e,Pt=t?.key,en=!1,as=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${C.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Bt().value=t.design.markdown:e==="text"&&(Bt().value=bo),gi(),(e==="url"?bi():Bt()).focus()}}let bo="",Pi;function up(){if(as?.isConnected&&as.focus({preventScroll:!0}),Pi!==void 0&&cancelAnimationFrame(Pi),ut!=="view")return;const e=gn;Pi=requestAnimationFrame(()=>{if(Pi=void 0,e!==gn||!k("source-dialog").hidden)return;const t=window.visualViewport,n=Et.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Yi(){gn++,Zi?.abort(),en=!1,Pt=void 0,k("source-dialog").hidden=!0,gi(),up()}async function Ii(){return ae?!1:(ut==="text"&&(bo=Bt().value),Yi(),!0)}function Wa(){return Ii()}Bt().oninput=()=>{ut==="text"&&(bo=Bt().value,Ns())};let Wi=!1;function za(){return re||Ne||en||ae||ge?"読込が終わってから共有してください。":Wu(ne())}function cs(){const e=za(),t=k("share-source");t.hidden=!ne(),t.setAttribute("aria-disabled",String(Wi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(Wi)return;const e=za();if(e){$e(e,"warning");return}const t=ne();if(t.source?.kind!=="url")return;const n=t.source.url,i=zu(location.href,n);Wi=!0,cs();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Wi=!1,cs()}};let Xt,$n=0,Mr=0,ci;function Ua(){if(re||Ne||en||ge||ae||Xt||ci===void 0)return;const e=ci;ci=void 0,Ts(e)}async function Ts(e=location.hash){const t=e;if(re)return;const n=++Mr;if(!/^#source(?:=|$)/.test(t)){ci=void 0,Xt&&!ae&&(Xt.abort(),Xt=void 0,$n++,Ne=!1,Me());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),ae){ci=t;return}if(en||Ne&&!Xt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++$n;Xt?.abort();try{const o=Uu(t);po();const r=C.tabs.find(u=>u.source?.kind==="url"&&u.source.url===o),s=r;if(s){if(Pt&&Pt!==s.key&&!await Ii()||i!==$n||n!==Mr)return;const u=we()||C.active!==s.key;C.active=s.key,Me(),Ae(180,u),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),Si();return}Xt=new AbortController,Ne=!0,Me();const d=await ro(o,Xt.signal);if(i!==$n)return;const a=Xn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await wi(a))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===$n&&!(o instanceof Rn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===$n&&(Xt=void 0,Ne=!1,Me(),Ua())}}window.addEventListener("hashchange",()=>{Ts().then(()=>{C.document?.key===ds&&Si()})});function qs(e){C.drawer=!0,pt(),on()}async function pp(e){const t=yn(e);if(!(e.design.sourceFormat==="json"||t.busy||ae||re||ge===e)){t.busy=!0;try{await Ls(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,on()}}}let Qi;Ft.onchange=()=>{const e=Ft.files?.[0],t=Qi??ne();Qi=void 0,Ft.value="",!(!e||!t||!nn(t))&&(qs(),Ma(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ft.oncancel=()=>{Qi=void 0};k("check-open").onclick=()=>{Qi=ne(),Ft.click()};let $s,zi=null;function Ws(){rn.hidden=!0,$s=void 0,(zi&&!zi.closest("[hidden]")?zi:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=ne();e&&(zi=ss??document.activeElement,$s=e,k("check-url").value=yn(e).url??"",rn.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=Ws;rn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Ws())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=$s;if(!t||!nn(t))return;const n=k("check-url").value.trim();yn(t).url=n,Ws(),qs(),Ma(t,async()=>({name:n,url:n,markdown:await Du(n)}))};k("check-open-sample").onclick=()=>{const e=ne();!e||!Rs(e)||(qs(),Ra(e,{name:"チェックリストのサンプル",markdown:Bu}))};k("check-close").onclick=()=>{const e=ne();e&&pp(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=ne();e&&Ps("view",e)};k("open-url").onclick=()=>Ps("url");k("open-text").onclick=()=>Ps("text");k("source-cancel").onclick=()=>Wa();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Wa())};k("source-submit").onclick=async()=>{if(en||ae||ut==="view"&&ge||k("source-dialog").hidden||ut==="view")return;en=!0,gi();const e=++gn,t=ut;Zi=new AbortController;try{const n=ut==="url"?new URL(bi().value.trim()).href:bi().value.trim();if(t==="url"&&C.document?.source?.kind==="url"&&C.document.source.url===n){Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Yi(),Me(),Si();return}const i=t==="url"?await ro(n,Zi.signal):Mu(Bt().value),o=i.markdown;if(e!==gn)return;const r=Xn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await wi(r))return;$e(""),t==="text"&&(bo=o),Yi()}catch(n){e===gn&&!(n instanceof Rn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===gn&&(en=!1,gi())}};k("layout-lock").onclick=()=>{re||(bt.cancel(),qe=void 0,we(),Rt=!Rt,pt(),vn())};k("selected-edges-only").onchange=()=>{const e=ne();!e||re||ae||ge===e||(bt.cancel(),qe=void 0,we(),e.selectedEdgesOnly=k("selected-edges-only").checked,mi(),Ae())};k("show-exceptions").onchange=()=>{const e=ne();!e||re||ae||ge===e||(bt.cancel(),qe=void 0,we(),e.showExceptions=k("show-exceptions").checked,mi(),Ae())};k("prefer-write").onchange=()=>{re||(we(),C.preferWrite=k("prefer-write").checked,vn(),Ae())};k("theme").onclick=()=>{re||(C.dark=!C.dark,pt(),Ae())};k("drawer").onclick=()=>{re||!ne()||(we(),C.drawer=!C.drawer,Me(),Ae())};for(const[e,t]of[["in",Zs],["out",1/Zs]])k(e).onclick=()=>{const n=ne();if(n&&ge!==n){const i=we(),o=Ec({zoom:n.zoom,scroll:n.scroll},t).zoom,r=i||o!==n.zoom;n.zoom=o,Me(),Ae(180,r)}};const je=k("viewport");function Va(e,t){const n=ne();if(!n||ae||ge===n)return;we();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Ht();const o=Array.from(k("nodes").children).find(r=>r.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),mi()}const fn=Cc({read:()=>{const e=ne();return e&&!ae&&e!==ge&&!Rt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>ne()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=je.getBoundingClientRect(),t=e.left+je.clientLeft,n=e.top+je.clientTop,i={left:t,top:n,right:t+je.clientWidth,bottom:n+je.clientHeight};for(const[r,s]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=k(r),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=i.bottom||(s==="right"&&a.left>i.left&&a.left<i.right&&(i.right=a.left),s==="left"&&a.right>i.left&&a.right<i.right&&(i.left=a.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:Va,pan:e=>{const t=ne();if(!t||t===ge||Rt)return;we();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],we(),Ht()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),bt=Oc(je,{nodeDrag:fn,read:()=>{const e=ne();return e&&!ae&&ge!==e?{key:e.key,zoom:e.zoom,locked:Rt,scroll:[je.scrollLeft,je.scrollTop]}:void 0},position:e=>ne()?.positions[e],change:e=>{const t=ne();if(!t||ae||ge===t)return;const n=t.scroll;let i=!1;e.node&&Va(e.node.id,e.node.position),e.selected&&(ft().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Zn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?vn():e.zoom!==void 0&&Gt(t),e.scroll&&(je.scrollLeft=e.scroll[0],je.scrollTop=e.scroll[1]),we(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ht()},finish:()=>{const e=ne();e&&Gt(e),we(),Ae(180,!1)}}),zs=()=>{bt.cancel(),qe=void 0,we(),Ae(0,!1)};window.addEventListener("blur",zs);window.addEventListener("pagehide",zs);document.addEventListener("visibilitychange",()=>{document.hidden&&zs()});je.onscroll=()=>{we()};let qe;jc(je,{read:()=>{const e=ne();return e&&!re&&!ae&&e!==ge?{zoom:e.zoom,scroll:[je.scrollLeft,je.scrollTop]}:void 0},change:e=>{const t=ne();!t||ae||t===ge||(bt.cancel(),fn.cancel(),qe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Gt(t),je.scrollLeft=t.scroll[0],je.scrollTop=t.scroll[1],we(!1),Ht(),Ae(180,!1))}});je.onpointerdown=e=>{const t=ne(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||ae||t===ge||n&&!Rt||(qe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[je.scrollLeft,je.scrollTop],node:n,moved:!1},je.setPointerCapture(e.pointerId))};je.onpointermove=e=>{if(qe&&qe.pointer===e.pointerId&&qe.key===ne()?.key&&ne()!==ge){const t=e.clientX-qe.x,n=e.clientY-qe.y;Math.hypot(t,n)>3&&(qe.moved=!0),je.scrollLeft=qe.scroll[0]-t,je.scrollTop=qe.scroll[1]-n,we()}};je.onpointerup=e=>{if(!qe||qe.pointer!==e.pointerId)return;const t=ne(),n=qe;qe=void 0,je.hasPointerCapture?.(e.pointerId)&&je.releasePointerCapture(e.pointerId),t&&t!==ge&&n.key===t.key&&!n.moved&&n.node&&(ft().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ht()),Zn(n.node),vn()),we(),Ae(180,!1)};je.onpointercancel=()=>{qe=void 0};je.addEventListener("lostpointercapture",e=>{e.target===je&&qe?.pointer===e.pointerId&&(qe=void 0)});let go=!1;k("resize").onpointerdown=e=>{re||(go=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(go){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==C.width&&(C.width=t,Ht()),pt()}};k("resize").onpointerup=()=>{go=!1,Ae(180,!1)};k("resize").onpointercancel=()=>{go=!1,Ae(180,!1)};k("resize").onkeydown=e=>{if(!re&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,C.width+(e.key==="ArrowLeft"?20:-20)));t!==C.width&&(C.width=t,Ht()),pt(),Ae(180,!1)}};window.addEventListener("resize",()=>{pt();const e=ne();e&&Gt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=ne();t&&Gt(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function Ti(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=sn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Hn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Yn=document.createElement("section");Yn.id="source-update-notice";Yn.className="info-bar";Yn.hidden=!0;Yn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Yn);let jn;const Fa=new Set;let No=0,ds,Po;function yo(){const e=C.document;Yn.hidden=!jn||jn.key!==e?.key||jn.baseline!==e.design.markdown||Fa.has(e.key),k("source-update-refresh").disabled=re||Ne||ae||!!(e&&Qt.has(e.key))}k("source-update-close").onclick=()=>{jn&&Fa.add(jn.key),yo()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function Si(){const e=C.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Po===t)return;Po=t;const n=++No,i=e.key,o=e.source.url,r=e.design.markdown;try{const s=await As(o);if(n!==No||C.document?.key!==i||C.document.design.markdown!==r||C.document.source?.kind!=="url"||C.document.source.url!==o)return;sn(s),jn=s.replace(/\r\n?/g,`
`)!==r.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:r}:void 0,yo()}catch{}finally{n===No&&(Po=void 0)}}Ue=cl(Et,{rightDrawer:{isOpen:()=>C.drawer,isReady:()=>!re,setOpen:e=>{re||(C.drawer=e,pt(),Ae())}},capture:()=>{we(),bt.cancel(),qe=void 0},business:()=>({key:C.document?.design.namedPlans?JSON.stringify([C.document.key,C.document.design.namedPlans.selected]):C.document?.key,design:C.document?.design,relatedChecks:C.tabs[0]?$l(C.tabs[0]):[],viewKey:ne()?.key,views:C.tabs.map(e=>({key:e.key,name:e.name,activity:Gi(e),object:Hi(e)})),activities:C.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:C.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:C.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!C.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=C.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{rs(e),$i(e)},openObject:e=>{Ta(e),$i(e)},openOverview:()=>{C.tabs[0]&&(we(),Ue?.reopenBusinessOverview(),C.active=C.tabs[0].key,Me(),Ae())},activateView:e=>{C.tabs.some(t=>t.key===e)&&(we(),C.active=e,Me(),Ae())},statePanel:e=>C.document?pl(C.document.design,e,t=>{Ue?.activateBusiness(),rs(t),$i(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{C.nodeDrawer=!1,pt()},refresh:()=>{pt(),Qo.update()}});const fp=C;Me();tt();kl().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const u of t.recovery??[])Ti(u);if(t.document){const u={...t.document};Ti(u),t.document.design=u.design,t.document.checks=u.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const u of t.tabs)Ti(u)}const n=El(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(u=>({...u,name:n.document.name,design:u.design,checks:u.checks,source:u.source,draft:u.draft,edited:u.edited,handle:u.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const u of i.tabs)Ti(u);if(new Set(i.tabs.map(u=>u.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const u of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!u||!u.positions||typeof u.positions!="object"||Array.isArray(u.positions)||u.selectedEdgesOnly!==void 0&&typeof u.selectedEdgesOnly!="boolean"||u.showExceptions!==void 0&&typeof u.showExceptions!="boolean"||u.hiddenNodes!==void 0&&(!Array.isArray(u.hiddenNodes)||!u.hiddenNodes.every(l=>typeof l=="string"))||u.viewInset!==void 0&&(!Array.isArray(u.viewInset)||u.viewInset.length!==2||!u.viewInset.every(l=>Number.isFinite(l)&&l>=0))||u.canvasOrigin!==void 0&&(!Array.isArray(u.canvasOrigin)||u.canvasOrigin.length!==2||!u.canvasOrigin.every(l=>Number.isFinite(l)&&l>=0))||!Array.isArray(u.scroll)||u.scroll.length!==2||!u.scroll.every(Number.isFinite)||!Number.isFinite(u.zoom)||u.zoom<.25||u.zoom>2.5||!Object.values(u.positions).every(l=>Array.isArray(l)&&l.length===2&&l.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:r,scopeOutside:s,...d}=i,a=u=>({...u,hiddenNodes:u.hiddenNodes??(i.scopeOutside==="hide"?u.design.graph.nodes.filter(l=>l.scope===!1).map(l=>l.id):[])});C=Vt({...d,tabs:i.tabs.map(a)},n.recovery,n.document,i.tabs.map(u=>{const{design:l,checks:p,source:g,draft:c,edited:h,handle:m,name:f,...b}=a(u);return b})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(C.sampleLayout={...i.sampleLayout,hiddenNodes:sn(Os).graph.nodes.filter(u=>u.scope===!1).map(u=>u.id)}),C.tabs.some(u=>u.key===C.active)||(C.active=C.tabs[0]?.key),ne()?.selected&&Zn(ne().selected),ds=C.document?.key,Me(),js=!0}).catch(()=>{C=fp,Jn=!0,Cs()}).finally(()=>{re=!1,Me(),tt(),Ts().then(()=>{C.document?.key===ds&&Si()})});
