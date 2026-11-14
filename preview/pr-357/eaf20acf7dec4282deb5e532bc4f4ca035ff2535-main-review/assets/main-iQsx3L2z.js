import{L as Lr,D as Za,G as Ya,W as Qa,P as ec,l as Mn,X as Rr,C as tc,n as nc,S as Dr,o as Tr,p as Pr,M as qr,q as Wr,s as zr,t as as,g as cs,r as Pi,d as $r,b as Bo,u as ds,U as Ur,B as oc,v as ic,w as sc,x as rc,y as Fr,z as Vr,A as qi,E as ac,m as ls,F as cc,H as Br,I as dc,j as lc,J as Ks,K as uc,T as fc,N as pc,O as mc,R as hc,Q as bc,V as gc,Y as yc,_ as vc,$ as wc,a0 as kc,Z as Js,k as Ic,i as Sc,h as xc,f as Ac,a as Ec,a1 as Cc,a2 as Oc,a3 as Hr,a4 as jc,a5 as Nc,e as Mc}from"./canvas-toolbar-aYSe-n1e.js";const Lc={subsystems:{full:"サブシステム",icon:ec},business:{full:"業務設計",icon:Qa},states:{full:"状態遷移",icon:Ya},concept:{full:"データ構造",icon:Za},tests:{full:"テスト仕様",icon:Lr}};function Wi(e,t,n){const o=Lc[t],i=document.createElement("span"),s=document.createElement("span"),a=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Mn(o.icon,{"aria-hidden":"true","stroke-width":1.8})),a.className="view-tab-name",a.textContent=n,i.append(s,a),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function zi(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Mn(Rr,{"aria-hidden":"true","stroke-width":1.8})),t}function Rc(e){const t=Mn(e?tc:nc,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Dc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,a=Math.max(0,Math.min(n,s+o*i));a!==s&&(e.scrollLeft=a,t.preventDefault())},{passive:!1})}function Tc(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const Pc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function _s(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=Pc,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const a=Mn(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&a.classList.add(s),t.querySelector(o)?.append(a)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",Dr),n(".layout-lock",Tr,"lock-closed"),n(".layout-lock",Pr,"lock-open"),n(".zoom-out",qr),n(".zoom-in",Wr)}function Xs(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function qc({model:e}){const t=Object.fromEntries(e.concepts.map(u=>[u.id,{name:u.name,note:u.description,fields:u.information.map(c=>["",c.name+(c.responsibleSubsystemId&&c.responsibleSubsystemId!==u.subsystemId?"（担当："+e.subsystems.find(r=>r.id===c.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind]),o=e.reviewGroups.map(u=>({id:u.id,name:u.title,purpose:u.description,activities:u.relatedActivityIds,concepts:Object.fromEntries(u.graph.nodes.map(c=>[c.conceptId,{name:c.name,note:c.description,fields:c.fields.map(r=>["",r]),sources:c.sources,sourceActivities:c.sourceActivityIds}])),relations:u.graph.edges.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind])})),i=u=>o.find(c=>c.id===u),s=(u,c)=>{const r=Object.fromEntries(u.nodes.map(p=>[p.id,{...c[p.conceptId],name:p.name,note:p.description,sources:p.sources,conceptId:p.conceptId,subsystemId:p.subsystemId,fields:p.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(p=>u.nodes.some(g=>g.subsystemId===p.id)).map(p=>({id:p.id,name:p.name})),d=u.handoffIds.map(p=>e.handoffs.find(g=>g.id===p)).map(p=>({id:p.id,from:p.fromSubsystemId,to:p.toSubsystemId,label:p.information,returning:p.flowDirection==="return"}));return{ids:u.nodes.map(p=>p.id),tables:r,edges:u.edges.map(p=>[p.fromViewId,p.toViewId,p.fromLabel,p.toLabel,p.kind]),regions:f,handoffs:d}};return{tables:t,edges:n,groups:o,findGroup:i,graph:u=>{const c=i(u);if(!c)throw Error("Unknown review group: "+u);const r=e.reviewGroups.find(p=>p.id===u),f=r.graph.subsystemViews;if(f)return s(f,c.concepts);const d=Object.keys(t).filter(p=>Object.hasOwn(c.concepts,p));return{ids:d,tables:c.concepts,edges:c.relations.filter(([p,g])=>d.includes(p)&&d.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function lt(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Wc(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",lt(o,"span",t),o.onclick=n,e.append(o),o}function zc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function $c(e,t,n,o=()=>{},i=()=>{},s=[]){const a=n.contentFor(t.id);if(e.replaceChildren(),!a)return;lt(e,"p",a.description).className="review-description",lt(e,"h3","Activity");const l=document.createElement("ul");l.className="review-related-activities";for(const u of a.relatedActivities){const c=document.createElement("li"),r=s.find(d=>d.id===u.id&&d.name===u.name),f=Wc(c,u.name,()=>{r&&i(r.id)});f.disabled=!r,f.setAttribute("aria-label",u.name+"を業務タブで開く"),l.append(c)}e.append(l),lt(e,"h3","情報の構造");for(const u of a.structureStatements){const c=document.createElement("section");c.className="review-structure",c.dataset.structure=u.id,lt(c,"h4",u.title),lt(c,"p",u.description),e.append(c)}lt(e,"h3","できること");for(const u of a.capabilities){const c=document.createElement("section");c.className="review-capability",c.dataset.capability=u.id,lt(c,"h4",u.title),lt(c,"p",u.description);for(const r of u.samples){const f=o(u.id,r.id),d=document.createElement("button");d.className="review-sample-link",d.type="button",d.dataset.sample=r.id,d.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?d.onclick=f.open:(d.disabled=!0,d.title="対応するテスト仕様へのリンクがありません"),c.append(d)}e.append(c)}lt(e,"h3","できないこと（業務上のルール）");for(const u of a.limitations){const c=document.createElement("section");c.className="review-limitation",lt(c,"h4",u.title),lt(c,"p",u.description),lt(c,"h5","理由"),lt(c,"p",u.reason),e.append(c)}}function cn(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function Uc({model:e,business:t}){const n=a=>a.kind==="group"?e.subsystems.find(l=>l.id===a.id):e.handoffs.find(l=>l.id===a.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(a){const l=n(a);return l?l.activityIds.map(u=>t.activities.find(c=>c.id===u)).filter(Boolean):[]}function s(a,l){if(a.replaceChildren(),l.kind==="group"){const f=e.subsystems.find(p=>p.id===l.id);if(!f)return"";cn(a,"p",f.purpose),cn(a,"h3","扱う情報");const d=a.ownerDocument.createElement("ul");for(const p of f.information)cn(d,"li",p);return a.append(d),cn(a,"h3","まとまりの理由"),cn(a,"p",f.reason),f.name}const u=e.handoffs.find(f=>f.id===l.id);if(!u)return"";cn(a,"p",u.description),cn(a,"h3","出元と受取先");const c=e.subsystems.find(f=>f.id===u.fromSubsystemId),r=e.subsystems.find(f=>f.id===u.toSubsystemId);return cn(a,"p",`${c.name} → ${r.name}`),u.information}return{sections:o,activities:i,describe:s}}function Oi(e,t,n,o="right"){const i=o==="left",s=document.createElement("div");s.className=i?"explorer-drawer-resize":"concept-drawer-resize",s.tabIndex=0,s.setAttribute("role","separator"),s.setAttribute("aria-orientation","vertical"),s.setAttribute("aria-label",i?"エクスプローラーの幅":"補足情報の幅"),e.prepend(s);let a=i?280:440;try{const r=Number(sessionStorage.getItem(n));Number.isFinite(r)&&r>=280&&(a=r)}catch{}const l=i?Array.from(t.querySelectorAll("#formattedMarkdownDrawer,.concept-related,.spec-related")):[t.querySelector("#design-explorer")].filter(r=>!!r),u=()=>{let r=t.clientWidth||innerWidth;if(innerWidth>800){const f=l.find(d=>!d.hidden);f&&(r-=f.offsetWidth)}return Math.max(280,Math.min(1e3,r-(innerWidth>800?240:16)))},c=(r,f=!1)=>{if(a=Math.max(280,Math.min(u(),r)),e.style.setProperty(i?"--explorer-drawer-width":"--concept-drawer-width",a+"px"),s.setAttribute("aria-valuemin","280"),s.setAttribute("aria-valuemax",String(u())),s.setAttribute("aria-valuenow",String(Math.round(a))),f)try{sessionStorage.setItem(n,String(a))}catch{}};if(s.onkeydown=r=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(r.key))return;r.preventDefault();const f=r.key==="ArrowLeft"?-1:1;c(r.key==="Home"?280:r.key==="End"?u():a+f*(i?40:-40),!0)},s.onpointerdown=r=>{if(r.button!==0)return;r.preventDefault();const f=r.clientX,d=a;s.setPointerCapture(r.pointerId),s.classList.add("resizing"),s.onpointermove=p=>c(d+(i?p.clientX-f:f-p.clientX)),s.onpointerup=()=>{s.onpointermove=null,s.onpointerup=null,s.onpointercancel=null,s.classList.remove("resizing"),c(a,!0)},s.onpointercancel=s.onpointerup},typeof ResizeObserver<"u"){const r=new ResizeObserver(()=>c(a));r.observe(t);for(const f of l)r.observe(f)}window.addEventListener("resize",()=>c(a)),c(a)}const Fc=260,Vc=68,Bc="http://www.w3.org/2000/svg",zt=(e,t,n={})=>{const o=e.createElementNS(Bc,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function Hc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Mn(Ur,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Gc(e,{model:t,business:n},o,i,s){const a=t.reviewGroups,l=t.subsystems,u=t.presentation.landscapeRelationships.map(I=>{const y=a.find(R=>R.id===I.from),W=a.find(R=>R.id===I.to);if(!y||!W||y.subsystemId!==W.subsystemId||!t.presentation.reviewBoundaries.some(R=>R.from===I.from&&R.to===I.to))throw Error("Unknown overview relationship: "+I.from+" -> "+I.to);return I}),c=t.handoffs.map(I=>{if(!["forward","return"].includes(I.flowDirection))throw Error("Unknown overview handoff direction: "+I.id);return{id:I.id,from:I.fromSubsystemId,to:I.toSubsystemId,label:I.information,returning:I.flowDirection==="return"}});if(new Set(c.map(I=>I.id)).size!==c.length)throw Error("Duplicate overview handoff");for(const I of c)if(!l.some(y=>y.id===I.from)||!l.some(y=>y.id===I.to)||I.from===I.to||!I.label.trim())throw Error("Unknown overview handoff: "+I.id);for(const I of a){if(!l.some(y=>y.id===I.subsystemId))throw Error("Unknown overview subsystem: "+I.id);if(!n.roles?.some(y=>y.id===I.reviewer.roleId))throw Error("Unknown overview reviewer: "+I.id)}const r=l.flatMap(I=>a.filter(y=>y.subsystemId===I.id)),f=new Map;let d=0;for(const[I,y]of l.entries())for(const W of r.filter(R=>R.subsystemId===y.id))f.set(W.id,[80+d*170,100+d*120+I*64]),d++;const p=as(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let m,h;try{const I=JSON.parse(localStorage.getItem(g)||"null"),y=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),W=!I&&y?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,R=I??W;if(R){typeof R.zoom=="number"&&Number.isFinite(R.zoom)&&(p.zoom=Math.max(.25,Math.min(2.5,R.zoom))),Array.isArray(R.scroll)&&R.scroll.length===2&&R.scroll.every(q=>typeof q=="number"&&Number.isFinite(q))&&(p.scroll=R.scroll),typeof R.locked=="boolean"&&(p.locked=R.locked);for(const[q,H]of Object.entries(R.positions??{}))a.some(A=>A.id===q)&&Array.isArray(H)&&H.length===2&&H.every(A=>typeof A=="number"&&Number.isFinite(A))&&p.positions.set(q,[H[0],H[1]])}const E=R?.selection,P=E?.kind==="node"?t.concepts.find(q=>q.id===E.id)?.subsystemId:E?.id,T=E?.kind==="node"?"group":E?.kind;typeof P=="string"&&(T==="model"&&a.some(q=>q.id===P)||T==="group"&&l.some(q=>q.id===P)||T==="connection"&&c.some(q=>q.id===P))&&(h={kind:T,id:P}),h?.kind==="model"&&(p.selected=h.id)}catch{}const x=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:p.zoom,scroll:p.scroll,locked:p.locked,positions:Object.fromEntries(p.positions),selection:h}))}catch{}},C=I=>{if(!I&&!h)return;h=I,p.selected=I?.kind==="model"?I.id:void 0;const y=m?.querySelector(".diagram-world>svg");y&&w(y),x()},w=I=>{const y=Bo(u,p.selected),W=Bo(c,h?.kind==="group"?h.id:void 0);for(const R of a){const E=I.querySelector(`[data-node="${R.id}"]`);E?.setAttribute("class","node graph-shape state-shape"+y.nodeClasses(R.id)),E?.setAttribute("aria-pressed",String(p.selected===R.id))}for(const R of l){const E=I.querySelector(`[data-subsystem="${R.id}"]`);E?.setAttribute("class","subsystem-overview-group"+W.nodeClasses(R.id)),E?.querySelector("button")?.setAttribute("aria-pressed",String(h?.kind==="group"&&h.id===R.id))}for(const R of u){const E=I.querySelector(`[data-overview-from="${R.from}"][data-overview-to="${R.to}"]`);E?.setAttribute("class","edge"+(y.related(R)?" review-related":"")),E?.setAttribute("marker-end",`url(#overview-${y.related(R)?"related-arrow":"arrow"})`)}for(const R of c){const E=W.related(R)||h?.kind==="connection"&&h.id===R.id,P=I.querySelector(`[data-handoff-id="${R.id}"]`);P?.setAttribute("class","edge"+(R.returning?" exception":"")+(E?" review-related":"")),P?.setAttribute("marker-end",`url(#overview-${E?"related-arrow":"arrow"})`),I.querySelector(`[data-handoff-label="${R.id}"]`)?.classList.toggle("review-related",!!E)}I.querySelectorAll("[data-exception-paint]").forEach(R=>R.remove());for(const R of Array.from(I.querySelectorAll("[data-handoff-id].exception")))ds(I,R,{path:R.getAttribute("d")},{"data-overview-return-paint":R.getAttribute("data-handoff-id")})};return m=zr(e,I=>{const y=r.map(T=>{const q=I.positions.get(T.id)??f.get(T.id);return{id:T.id,x:q[0],y:q[1],width:Fc,height:Vc}}),W=zt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});W.append(cs("overview-"));let R=0,E=0;const P=[];for(const T of l){const q=y.filter(re=>a.find(ae=>ae.id===re.id)?.subsystemId===T.id);if(!q.length)continue;const H=Math.min(...q.map(re=>re.x))-30,A=Math.min(...q.map(re=>re.y))-48,Z=Math.max(...q.map(re=>re.x+re.width))-H+30,S=Math.max(...q.map(re=>re.y+re.height))-A+30;P.push({id:T.id,x:H,y:A,width:Z,height:S});const D=zt(e,"g",{"data-subsystem":T.id,"aria-label":T.name}),te=zt(e,"rect",{x:H,y:A,width:Z,height:S,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});te.addEventListener("click",()=>C({kind:"group",id:T.id})),D.append(te);const X=zt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:H+8,y:A+3,width:Z-16,height:36}),he=e.createElement("button");he.type="button",he.className="subsystem-overview-region-title",he.setAttribute("aria-label",T.name+"を選択"),he.textContent=T.name,he.onclick=()=>C({kind:"group",id:T.id}),X.append(he),D.append(X),W.append(D),R=Math.max(R,H+Z+40),E=Math.max(E,A+S+40)}for(const[T,q]of c.entries()){if(!P.some(D=>D.id===q.from)||!P.some(D=>D.id===q.to))throw Error("Missing overview handoff region: "+q.id);const H=Math.max(30,q.label.length*12),A=Pi({from:q.from,to:q.to,nodes:P,index:T,kind:"input",matrix:{returning:q.returning,captionLane:0},labelWidth:H,labelHeight:18}),Z=zt(e,"path",{d:A.path,class:"edge"+(q.returning?" exception":""),"data-handoff-id":q.id,"data-from-subsystem":q.from,"data-to-subsystem":q.to,"data-flow-direction":q.returning?"return":"forward","marker-end":"url(#overview-arrow)"});W.append(Z);const S=zt(e,"text",{x:A.label[0]-H/2,y:A.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":q.id});S.textContent=q.label,S.addEventListener("pointerdown",D=>D.stopPropagation()),S.addEventListener("pointerup",D=>D.stopPropagation()),S.addEventListener("click",()=>C({kind:"connection",id:q.id})),S.addEventListener("keydown",D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),C({kind:"connection",id:q.id}))}),W.append(S),R=Math.max(R,A.bounds.right+40,A.label[0]+H/2+30),E=Math.max(E,A.bounds.bottom+40,A.label[1]+30)}for(const[T,q]of u.entries()){const H=Pi({from:q.from,to:q.to,nodes:y,index:T,kind:"input",labelWidth:0,labelHeight:0}),A=zt(e,"path",{d:H.path,class:"edge","data-overview-from":q.from,"data-overview-to":q.to,"marker-end":"url(#overview-arrow)"});W.append(A),R=Math.max(R,H.bounds.right+40),E=Math.max(E,H.bounds.bottom+40)}for(const T of y){const q=a.find(ae=>ae.id===T.id),H=n.roles.find(ae=>ae.id===q.reviewer.roleId),A=zt(e,"g",{role:"button",tabindex:0,"aria-label":q.title+"を選択","aria-pressed":"false","data-node":T.id,"data-review-group":T.id,"data-subsystem-id":q.subsystemId,class:"node graph-shape state-shape"}),Z=$r(e,T);Z.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),A.append(Z,zt(e,"rect",{x:T.x,y:T.y,width:T.width,height:T.height,rx:8,class:"state-diagram-node"}));const D=zt(e,"foreignObject",{x:T.x,y:T.y,width:T.width,height:T.height}),te=e.createElement("div");te.className="subsystem-overview-card";const X=Hc(e,H.color),he=e.createElement("span");he.className="subsystem-overview-labels",he.title=q.title+" — "+H.name;for(const[ae,O,z]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",q.title],["small","subsystem-overview-role",H.name]]){const B=e.createElement(ae);B.className=O,B.textContent=z,he.append(B)}const re=e.createElement("button");re.type="button",re.className="subsystem-overview-open",re.setAttribute("aria-label",q.title+"の詳細タブを開く"),re.title="詳細タブを開く",re.textContent="開く",re.onpointerdown=ae=>ae.stopPropagation(),re.onpointerup=ae=>ae.stopPropagation(),re.onclick=ae=>{ae.stopPropagation(),i(q.id)},te.append(X,he,re),D.append(te),A.append(D),A.addEventListener("click",()=>C({kind:"model",id:T.id})),A.addEventListener("keydown",ae=>{(ae.key==="Enter"||ae.key===" ")&&(ae.preventDefault(),C({kind:"model",id:T.id}))}),W.append(A)}return W.setAttribute("viewBox",`0 0 ${R} ${E}`),w(W),W},p,x,()=>C(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",x),m.addEventListener("pointerup",()=>queueMicrotask(x)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",x),{root:m,selected:()=>p.selected,selection:()=>h,restore:()=>{const I=()=>{const y=m.querySelector(".diagram-viewport");y.scrollLeft=p.scroll[0],y.scrollTop=p.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(I):I()}}}function Kc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(a=>a.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function Jc({model:e,business:t}){const n=g=>{const m=t.activities.find(h=>h.id===g);if(!m)throw Error("Unknown activity: "+g);return m},o=g=>{const m=t.roles?.find(h=>h.id===g);if(!m)throw Error("Unknown role: "+g);return m.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(m=>{const h=n(m);return{id:h.id,name:h.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(m=>({...m,samples:m.samples.map(Kc)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(m=>m.id===g),a=(g,m)=>s(g)?.capabilities.find(h=>h.samples.some(x=>x.id===m)),l=i.flatMap(g=>g.capabilities.flatMap(m=>m.samples.map(h=>({...h,group:g.id})))),u=["yellow","cyan","green","blue","purple","orange"];function c(g,m,h){let x=h.get(m);if(x||(x=u[h.size]??`extra-${h.size}`,h.set(m,x)),g.dataset.sampleKey=m,g.dataset.keyTone=x,g.className="data-example-key",x.startsWith("extra-")){const C=(Number(x.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${C} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${C} 24% 25%)`)}}const r=g=>l.filter(m=>m.group===g),f=(g,m)=>r(g).find(h=>h.id===m);function d(g,m,h){const x=g.ownerDocument.createElement(m);return x.textContent=h,g.append(x),x}function p(g,m,h,x,C){const w=g.ownerDocument,L=f(m.id,h);if(!L)throw Error("Unknown data example: "+h);g.replaceChildren(),g.dataset.dataExample=h;const I=new Map;e.presentation.sampleCaption&&(d(g,"p",e.presentation.sampleCaption).className="data-example-caption");const y=s(m.id)?.capabilities??[],W=C?.capabilityId?y.filter(q=>q.id===C.capabilityId):y;if(C?.capabilityId&&!W.some(q=>q.samples.some(H=>H.id===h)))throw Error("Sample does not belong to capability: "+h);const R=a(m.id,h);g.dataset.capability=R.id;const E=()=>{d(g,"h2",C?.heading?.trim()||R.title),C?.renderSpecification?C.renderSpecification(g):d(g,"p",R.description).className="data-example-capability"};C?.capabilityId&&!C.hideCapability&&E();const P=w.createElement("label");P.className="data-example-picker",d(P,"span","場面");const T=w.createElement("select");T.setAttribute("aria-label","データ例の場面");for(const q of W){let H=T;if(!C?.capabilityId){const A=w.createElement("optgroup");A.label=q.title,T.append(A),H=A}for(const A of q.samples){if(C?.sampleIds&&!C.sampleIds.includes(A.id))continue;const Z=w.createElement("option");Z.value=A.id,Z.textContent=A.name,H.append(Z)}}if(T.value=h,T.onchange=()=>x(T.value),P.append(T),(!C?.hideSinglePicker||T.options.length>1)&&g.append(P),!C?.capabilityId&&!C?.hideCapability&&E(),d(g,"h3",L.name).className="data-example-scene",C?.collapseScenario&&L.when){const q=w.createElement("details");q.className="data-example-context",d(q,"summary","場面の背景"),d(q,"p",L.when).className="data-example-when",g.append(q)}else d(g,"p",L.when).className="data-example-when";d(g,"p",L.meaning).className="data-example-meaning";for(const q of L.blocks){const H=w.createElement("section");H.className="data-example-block",H.dataset.exampleCard=q.card,d(H,"h3",m.concepts[q.card].name);const A=w.createElement("div");A.className="data-example-table",A.tabIndex=0,A.setAttribute("role","region"),A.setAttribute("aria-label",m.concepts[q.card].name+"のデータ表");const Z=w.createElement("table");Z.setAttribute("aria-label",m.concepts[q.card].name+"のデータ例");const S=w.createElement("caption");S.textContent=m.concepts[q.card].name+"に入る情報",Z.append(S);const D=w.createElement("thead"),te=w.createElement("tr");for(const he of q.columns)d(te,"th",he).setAttribute("scope","col");D.append(te),Z.append(D);const X=w.createElement("tbody");for(const[he,re]of q.rows.entries()){const ae=w.createElement("tr");for(const[O,z]of re.entries()){const B=d(ae,"td",String(z)),ue=q.keyIds[he][O];ue&&(c(B,ue,I),B.title=q.columns[O]+"："+z)}X.append(ae)}Z.append(X),A.append(Z),H.append(A),q.rows.length||d(H,"p",q.empty??"データはありません。"),g.append(H)}L.note&&(d(g,"p",L.note).className="data-example-note")}return{reviewContents:i,dataExamples:l,contentFor:s,capabilityFor:a,examplesFor:r,findDataExample:f,renderDataExample:p}}function us(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function _c(e,t,n){return us(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Xc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function En(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const a=(l,u)=>{for(const c of u.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(c.startsWith("**")&&c.endsWith("**")){const r=document.createElement("strong");r.textContent=c.slice(2,-2),l.append(r)}else if(c.startsWith("`")&&c.endsWith("`")){const r=document.createElement("code");r.textContent=c.slice(1,-1),l.append(r)}else l.append(document.createTextNode(c))};for(const l of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const u=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(l);if(u&&!o){o=u[1],s=void 0;const d=document.createElement("pre");i=document.createElement("code"),d.append(i),n.append(d);continue}if(u&&u[1][0]===o[0]&&u[1].length>=o.length&&!u[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(l+`
`));continue}if(!l.trim()){s=void 0;continue}const c=/^(#{1,6}) (.*)$/.exec(l),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(l);if(r){s||(s=document.createElement(/^\s*\d/.test(l)?"ol":"ul"),n.append(s));const d=document.createElement("li");a(d,r[1]),s.append(d);continue}s=void 0;const f=document.createElement(c?"h"+c[1].length:"p");a(f,c?c[2]:l),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Ne={type:"string"},_={type:"string",minLength:1,pattern:"\\S"},K={type:"string",pattern:"^[A-Za-z0-9_-]+$"},hn=e=>({anyOf:[e,{type:"null"}]}),Y=e=>({type:"array",items:e}),ie=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Zc=e=>({$ref:"#/$defs/"+e}),zn=Y({anyOf:[ie({kind:{enum:["text"]},value:Ne}),ie({kind:{enum:["reference"]},targetId:K,label:Ne}),ie({kind:{enum:["link"]},uri:_,label:Ne})]}),Zs=ie({id:K,name:_,scope:{type:"boolean"}}).properties,Yc=ie({id:K,kind:{enum:["input","output","business-exception","object-exception"]},fromId:K,toId:K,label:_}),Qc=ie({id:K,sourceId:K,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:Y(K),unresolvedTargets:Y(_),summary:_,content:_}),$i=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:_,title:_,preface:Ne,scope:Ne,objects:Y(ie({...Zs,icon:_,information:Y(_)})),activities:Y(ie({...Zs,why:_,when:_,who:_,where:_,procedure:_,exception:hn(_),result:_,problem:hn(_),painLevel:hn({enum:["Low","Medium","High"]})})),relations:Y(Yc),findings:Y(Qc)}),ed=ie({id:K,name:_,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Gr=ie({...$i.properties,schemaVersion:{enum:["0.2"]},roles:Y(ed),activities:Y(ie({...$i.properties.activities.items.properties,roleId:hn(K)}))}),td=ie({...Gr.properties,schemaVersion:{enum:["0.3"]},exceptions:Y(ie({id:K,activityId:K,name:_,description:Ne}))}),nd=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,zn])),od=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:_,title:_,basedOn:ie({documentId:K,revision:_,verification:{enum:["unverified"]}}),intro:zn,index:Y(ie({activityId:K,purpose:Ne,connections:Ne,checkIds:Y(K)})),sections:Y(ie({id:K,activityId:hn(K),title:_,preamble:zn})),guarantees:Y(ie({id:K,sectionId:K,title:_,blocks:Y({anyOf:[ie({kind:{enum:["prose"]},content:zn}),ie({kind:{enum:["example"]},exampleId:K})]})})),examples:Y(ie({id:K,guaranteeId:K,columns:Y(_),rows:Y(Y(zn))})),items:Y(ie({id:K,checkId:K,title:_,detailSummary:Ne,sectionId:K,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:ie(nd,[])})),notes:Y(ie({id:K,title:_,content:zn}))}),fs=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:_,title:_,basedOn:ie({documentId:K,revision:_,verification:{enum:["unverified"]}}),objectId:K,states:Y(ie({id:K,name:_})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:_,transitions:Y(ie({id:K,sourceId:_,fromId:_,activityId:K,event:hn(_),exception:hn(_),condition:_,toId:_,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:_,note:_}))}),Ys=Object.fromEntries(Object.entries({...fs.properties.transitions.items.properties,exceptionId:hn(K)}).filter(([e])=>e!=="exception")),id=ie({...fs.properties,schemaVersion:{enum:["0.2"]},transitions:Y(ie({...Ys,conditionLabel:_},Object.keys(Ys)))}),ps=ie({documentId:K,revision:_,targetType:_,targetId:K,section:_}),sd=ie({id:K,name:_,responsibilityStatus:_,responsibleSubsystemId:K},["id","name"]),rd=ie({id:K,name:_,subsystemId:K,information:Y(sd),reason:Ne,description:Ne,businessObjectIds:Y(K),activityLinks:Y(ie({activityId:K,uses:Y(_)})),sourceRefs:Y(ps),reviewState:_}),ad=ie({id:K,fromConceptId:K,toConceptId:K,fromPerTarget:_,toPerSource:_,condition:Ne,reviewState:_,sourceRefs:Y(ps),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),cd=ie({id:K,name:_,purpose:Ne,information:Y(_),reason:Ne,activityIds:Y(K),reviewState:_}),dd=ie({id:K,fromSubsystemId:K,toSubsystemId:K,information:_,description:Ne,activityIds:Y(K),flowDirection:{enum:["forward","return"]},reviewState:_}),ld=ie({columnId:K,value:{anyOf:[Ne,{type:"number"}]},linkId:_},["columnId","value"]),ud=ie({card:K,columns:Y(ie({id:K,name:_,informationId:K})),rows:Y(ie({id:K,cells:Y(ld)})),empty:Ne},["card","columns","rows"]),Ui=ie({id:K,name:_,when:Ne,meaning:Ne,blocks:Y(ud),note:Ne},["id","name","when","meaning","blocks"]),Fi=ie({id:K,title:_,description:Ne,meta:{},samples:Y(Ui)}),fd=ie({...Ui.properties,checkIds:{...Y(K),minItems:1,uniqueItems:!0}},[...Ui.required,"checkIds"]),pd=ie({decisionExampleIds:Y(K),decisionCheckIds:Y(K),resultCheckIds:Y(K),sampleIds:Y(K)}),md=ie({...Fi.properties,samples:Y(fd),testSpecification:pd},[...Object.keys(Fi.properties)]),hd=ie({id:K,title:_,description:Ne,reason:Ne,meta:{}}),bd=ie({conceptId:K,name:_,fields:Y(_),description:Ne,sources:Y(_),sourceActivityIds:Y(K)}),gd=ie({id:K,fromConceptId:K,toConceptId:K,relationIds:Y(K),scope:Ne,fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),yd=ie({id:K,conceptId:K,subsystemId:K,name:_,description:Ne,sources:Y(_),fields:Y(ie({name:_,informationId:K}))}),vd=ie({id:K,fromViewId:K,toViewId:K,relationIds:Y(K),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),Kr=ie({nodes:Y(yd),edges:Y(vd),handoffIds:Y(K)}),Jr=ie({id:K,subsystemId:K,title:_,description:Ne,reviewer:ie({roleId:K}),relatedActivityIds:Y(K),graph:ie({conceptIds:Y(K),nodes:Y(bd),edges:Y(gd),subsystemViews:Kr},["conceptIds","nodes","edges"]),structureStatements:Y(ie({id:K,title:_,description:Ne,sampleIds:Y(K),sourceRefs:Y(ps)})),capabilities:Y(Fi),limitations:Y(hd),meta:ie({questions:Y(_),hypotheses:{}},["questions"])}),wd=ie({...Jr.properties,capabilities:Y(md)}),_r=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:_,basedOn:ie({documentId:K,revision:_,verification:{enum:["unverified"]}}),relatedStates:Y(ie({documentId:K,revision:_,verification:{enum:["unverified"]}})),subsystems:Y(cd),concepts:Y(rd),relations:Y(ad),handoffs:Y(dd),reviewGroups:Y(Jr),benefits:Y(_),considerations:Y(_),reviewPoints:Y(_),meta:{},presentation:ie({activityViews:{},creatorActivityIds:{},sampleCaption:Ne,subsystemViews:Kr,landscapeRelationships:Y(ie({from:K,to:K})),reviewBoundaries:Y(ie({from:K,to:K,label:Ne,promise:Ne}))},["landscapeRelationships","reviewBoundaries"])}),kd=ie({..._r.properties,schemaVersion:{enum:["0.2"]},reviewGroups:Y(wd)}),No=(e,t)=>ie({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:_,documents:Y({anyOf:t.map(Zc)}),sources:Y(ie({documentId:K,revision:_,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Ne})),externalDocuments:Y(ie({id:K,kind:{enum:["businessDesign"]},revision:_,activities:Y(ie({id:K,name:_}))})),diagnostics:Y(_)}),Ho={anyOf:[No("0.1",["businessDesign","checkItems"]),No("0.2",["businessDesign","checkItems","stateTransition"]),No("0.3",["businessDesignRoles","checkItems","stateTransition"]),No("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:$i,businessDesignRoles:Gr,businessDesignStructured:td,checkItems:od,stateTransition:fs,stateTransitionStructured:id,conceptModel:_r,checkedConceptModel:kd}},V=(e,t)=>{if(!e)throw Error(t)};function Xr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const a=e[t++];if(a==='"')return JSON.parse(e.slice(s,t));a==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{V(s<=64,"JSON depth limit"),n();const a=e[t];if(a==='"'){o();return}if(a==="{"){t++,n();const u=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),V(e[t]==='"',"JSON object key required");const c=o();V(!u.has(c),"Duplicate JSON key: "+c),u.add(c),n(),V(e[t++]===":","JSON colon required"),i(s+1),n();const r=e[t++];if(r==="}")return;V(r===",","JSON comma required")}throw Error("Truncated object")}if(a==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const u=e[t++];if(u==="]")return;V(u===",","JSON array comma required")}throw Error("Truncated array")}const l=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;V(t>l,"JSON value required"),JSON.parse(e.slice(l,t))};return i(),n(),V(t===e.length,"Trailing JSON content"),JSON.parse(e)}function Sn(e,t=Ho,n="$"){if(t.$ref)return Sn(e,Ho.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{Sn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&V(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;V(o===t.type,"Invalid type at "+n)}if(t.minLength&&V(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&V(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])V(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))V(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),Sn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>Sn(o,t.items,n+"["+i+"]"))}function Id(e){const t=new Map,n=new Map,o=new Map,i=(s,a,l)=>{V(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,a.id),o.set(s.id,l)};for(const s of e.documents){i(s,s,"document");for(const[a,l]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[a]??[])i(u,s,l)}for(const s of e.externalDocuments){i(s,s,"document");for(const a of s.activities)i(a,s,"activity")}return{map:t,owner:n,types:o}}function Go(e){return Sn(e),Zr(e)}function Vn(e,t){const n=new Set(e.items.map(a=>a.id)),o=new Set,i=e.guarantees.find(a=>a.id===t.guaranteeId),s=a=>{if(Array.isArray(a)){for(const l of a)s(l);return}if(a&&typeof a=="object"){a.kind==="reference"&&n.has(a.targetId)&&o.add(a.targetId);for(const l of Object.values(a))l&&typeof l=="object"&&s(l)}};s(t.rows);for(const a of i?.blocks??[])a.kind==="prose"&&s(a.content);for(const a of e.items)(a.fields.guarantee??[]).some(u=>u.kind==="reference"&&(u.targetId===t.id||u.targetId===t.guaranteeId))&&o.add(a.id);return[...o]}function Zr(e,{allowUnresolvedFindings:t=!1}={}){V(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=Id(e),s=[...e.diagnostics],a=new Set;for(const d of e.sources)if(d.uri){const p=new URL(d.uri);V(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe source URI")}const l=(d,p,g)=>(V(n.has(d),"Dangling reference: "+d),p&&V(i.get(d)===p,"Reference type mismatch: "+d),g&&V(o.get(d)===g,"Cross-document mismatch: "+d),n.get(d)),u=d=>d?.some(p=>p.kind==="text"?p.value.trim().length>0:!0),c=(d,p)=>{for(const g of d)if(g.kind==="reference"&&(l(g.targetId,null,p),V(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const m=new URL(g.uri);V(m.protocol==="https:"&&!m.username&&!m.password,"Unsafe external link")}};for(const d of e.documents)if(V(e.formatVersion!=="0.1"||d.kind!=="stateTransition","State documents require formatVersion 0.2"),d.kind==="businessDesign"){V(d.activities.length>0,"Activity required");const p=[...d.objects,...d.activities].map(h=>h.name);V(new Set(p).size===p.length,"Duplicate visible name"),V(p.every(h=>h===h.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>h.includes(x))),"Invalid Graph-visible name");for(const h of d.objects)V(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h.icon),"Invalid icon");if(["0.2","0.3"].includes(d.schemaVersion)){V(new Set(d.roles.map(h=>h.name)).size===d.roles.length,"Duplicate Role name"),V(d.roles.every(h=>h.name===h.name.trim()&&!/[\r\n]/.test(h.name)),"Invalid Role name");for(const h of d.activities)h.roleId!==null?l(h.roleId,"role",d.id):a.add("Role未確定: "+h.id+" — "+h.who)}for(const h of d.activities)V(h.problem===null==(h.painLevel===null),"Problem/Pain pair mismatch");for(const h of d.exceptions??[])l(h.activityId,"activity",d.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},m=new Set;for(const h of d.relations){l(h.fromId,g[h.kind][0],d.id),l(h.toId,g[h.kind][1],d.id);const x=JSON.stringify([h.kind,h.fromId,h.toId,h.label]);V(!m.has(x),"Duplicate relation"),m.add(x)}V(new Set(d.findings.map(h=>h.sourceId)).size===d.findings.length,"Duplicate Finding source ID");for(const h of d.findings){V(h.scope==="items"?h.targetIds.length+h.unresolvedTargets.length>0:!h.targetIds.length&&!h.unresolvedTargets.length,"Finding scope mismatch"),V(new Set(h.targetIds).size===h.targetIds.length,"Duplicate Finding target");for(const x of h.targetIds)l(x,null,d.id),V(["object","activity"].includes(i.get(x)),"Invalid Finding target");h.unresolvedTargets.length&&(V(t,"Unresolved Finding target: "+h.sourceId),s.push("Finding参照未決: "+h.sourceId))}}else if(d.kind==="stateTransition"){const p=l(d.basedOn.documentId,"document");V(p.kind==="businessDesign"&&p.objects,"State source must be an in-package BD"),V(p.revision===d.basedOn.revision,"Stale State source revision"),l(d.objectId,"object",p.id),V(!e.documents.some(m=>m!==d&&m.kind==="stateTransition"&&m.objectId===d.objectId),"Duplicate Object state declaration"),V(d.states.length>0&&new Set(d.states.map(m=>m.name)).size===d.states.length,"Duplicate/empty state names"),V(d.states.every(m=>!m.name.startsWith("@")),"Reserved state name"),V(d.transitions.length<=1e3,"State transition row budget"),V(new Set(d.transitions.map(m=>m.sourceId)).size===d.transitions.length,"Duplicate transition source ID");const g=new Map;for(const m of d.transitions){m.fromId!=="@new"&&l(m.fromId,"state",d.id),["@unknown","@none"].includes(m.toId)||l(m.toId,"state",d.id);const h=l(m.activityId,"activity",p.id),x=JSON.stringify([m.fromId,m.activityId,m.condition.trim().replace(/\s+/gu," ")]);if(V(!g.has(x),"Duplicate state transition condition: "+g.get(x)+" / "+m.sourceId),g.set(x,m.sourceId),e.formatVersion==="0.4")if(V(m.path!=="normal"||m.exceptionId===null,"Normal transition cannot reference an exception"),m.exceptionId!==null){const C=l(m.exceptionId,"exception",p.id);V(C.activityId===h.id,"Exception Activity mismatch")}else m.path==="exception"&&V(s.includes("例外参照未決: "+m.id),"Unresolved exception requires a diagnostic");else V(m.path!=="normal"||m.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+m.id);V(m.effect!=="unchanged"||m.fromId===m.toId,"Unchanged state mismatch"),V(m.effect!=="change"||!m.toId.startsWith("@")&&m.fromId!==m.toId,"Invalid changed state"),V(m.effect!=="no-create"||m.fromId==="@new"&&m.toId==="@none","Invalid no-create transition"),V(m.effect!=="constraint"||m.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+d.id)}else if(d.kind==="conceptModel"){const p=l(d.basedOn.documentId,"document");V(p.kind==="businessDesign"&&p.revision===d.basedOn.revision,"Concept source must be the matching in-package BD revision"),V(!e.documents.some(E=>E!==d&&E.kind==="conceptModel"&&E.basedOn.documentId===p.id),"Duplicate Concept model for Business Design");const g=(E,P)=>{const T=new Map;for(const q of E)V(!T.has(q.id),"Duplicate "+P+" ID: "+q.id),T.set(q.id,q);return T},m=g(d.subsystems,"subsystem"),h=g(d.concepts,"concept"),x=g(d.relations,"concept relation"),C=g(d.reviewGroups,"review group"),w=g(d.handoffs,"handoff"),L=g(d.concepts.flatMap(E=>E.information),"concept information"),I=(E,P,T)=>(V(E.has(P),"Unknown "+T+": "+P),E.get(P)),y=E=>l(E,"activity",p.id),W=E=>{const P=l(E.documentId,"document");V(P.revision===E.revision,"Stale Concept source revision");const T=P.id===p.id,q=P.kind==="stateTransition"&&P.basedOn.documentId===p.id&&d.relatedStates.some(H=>H.documentId===P.id&&H.revision===P.revision);V(T||q,"Concept source must refer to its Business Design or a declared State"),l(E.targetId,E.targetType,P.id)};for(const E of d.relatedStates){const P=l(E.documentId,"document");V(P.kind==="stateTransition"&&P.revision===E.revision&&P.basedOn.documentId===p.id,"Invalid Concept state reference")}for(const E of d.subsystems)for(const P of E.activityIds)y(P);for(const E of d.concepts){I(m,E.subsystemId,"subsystem");for(const P of E.information)P.responsibleSubsystemId&&I(m,P.responsibleSubsystemId,"responsible subsystem");for(const P of E.businessObjectIds)l(P,"object",p.id);for(const P of E.activityLinks)y(P.activityId);for(const P of E.sourceRefs)W(P)}for(const E of d.relations){I(h,E.fromConceptId,"concept"),I(h,E.toConceptId,"concept");for(const P of E.sourceRefs)W(P)}for(const E of d.handoffs){I(m,E.fromSubsystemId,"subsystem"),I(m,E.toSubsystemId,"subsystem"),V(E.fromSubsystemId!==E.toSubsystemId,"Handoff must cross subsystem boundary");for(const P of E.activityIds)y(P)}const R=(E,P)=>{const T=g(E.nodes,"subsystem view"),q=g(E.edges,"subsystem view edge");for(const A of T.values()){I(P,A.conceptId,"view concept"),I(m,A.subsystemId,"subsystem");const Z=I(h,A.conceptId,"concept");for(const S of A.fields)V(Z.information.some(D=>D.id===S.informationId),"Unknown information for subsystem view: "+S.informationId)}for(const A of q.values()){const Z=I(T,A.fromViewId,"subsystem view"),S=I(T,A.toViewId,"subsystem view");V(Z.subsystemId===S.subsystemId,"View relationship crosses subsystem boundary"),V(A.relationIds.length>0,"Subsystem view relationship needs a concept relation");let D=Z.conceptId;for(const te of A.relationIds){const X=I(x,te,"concept relation");V(X.fromConceptId===D,"Subsystem view relation path is disconnected: "+te),D=X.toConceptId}V(D===S.conceptId,"Subsystem view relation target differs")}V(new Set(E.handoffIds).size===E.handoffIds.length,"Duplicate subsystem view handoff");const H=new Set([...T.values()].map(A=>A.subsystemId));for(const A of E.handoffIds){const Z=I(w,A,"handoff");V(H.has(Z.fromSubsystemId)&&H.has(Z.toSubsystemId),"Missing subsystem view handoff region: "+A)}};d.presentation.subsystemViews&&R(d.presentation.subsystemViews,h);for(const E of d.reviewGroups){I(m,E.subsystemId,"subsystem"),l(E.reviewer.roleId,"role",p.id);for(const H of E.relatedActivityIds)y(H);const P=g(E.graph.nodes.map(H=>({...H,id:H.conceptId})),"view concept");V(new Set(E.graph.conceptIds).size===E.graph.conceptIds.length&&E.graph.conceptIds.length===P.size&&E.graph.conceptIds.every(H=>P.has(H)),"View concepts and nodes differ");for(const H of E.graph.nodes){I(h,H.conceptId,"concept");for(const A of H.sourceActivityIds)y(A)}g(E.graph.edges,"view edge");for(const H of E.graph.edges){I(P,H.fromConceptId,"view concept"),I(P,H.toConceptId,"view concept");for(const A of H.relationIds)I(x,A,"concept relation")}E.graph.subsystemViews&&R(E.graph.subsystemViews,P);const T=g(E.capabilities,"capability"),q=g(E.capabilities.flatMap(H=>H.samples),"sample");g(E.limitations,"limitation"),g(E.structureStatements,"structure statement");for(const H of E.structureStatements){for(const A of H.sampleIds)I(q,A,"sample");for(const A of H.sourceRefs)W(A)}for(const H of T.values())if(H.testSpecification){const A=H.testSpecification;for(const[S,D]of Object.entries(A))V(new Set(D).size===D.length,"Duplicate function specification reference: "+S);const Z=(S,D)=>{const te=l(S,D),X=l(o.get(S),"document");return V(X.kind==="checkItems"&&X.basedOn.documentId===p.id&&X.basedOn.revision===p.revision,"Function Check source mismatch: "+S),{value:te,doc:X}};for(const S of[...A.decisionCheckIds,...A.resultCheckIds])Z(S,"check");for(const S of A.decisionExampleIds){const{value:D,doc:te}=Z(S,"example"),X=Vn(te,D);V(X.length>0,"Function decision table needs a Check: "+S),V(X.every(he=>A.decisionCheckIds.includes(he)),"Function decision table Check is not assigned: "+S)}for(const S of A.sampleIds){const D=H.samples.find(te=>te.id===S);V(D,"Function result sample belongs to another capability: "+S),V(D.checkIds.some(te=>A.resultCheckIds.includes(te)),"Function result sample needs a result Check: "+S),V(D.checkIds.every(te=>A.resultCheckIds.includes(te)||A.decisionCheckIds.includes(te)),"Function result sample Check is not assigned: "+S)}}for(const H of T.values())for(const A of H.samples){if(d.schemaVersion==="0.2"){V(A.checkIds.length>0,"Sample needs a Check: "+A.id),V(new Set(A.checkIds).size===A.checkIds.length,"Duplicate sample Check: "+A.id);for(const Z of A.checkIds){l(Z,"check");const S=l(o.get(Z),"document");V(S.kind==="checkItems"&&S.basedOn.documentId===p.id&&S.basedOn.revision===p.revision,"Sample Check source mismatch: "+Z)}}for(const Z of A.blocks){I(P,Z.card,"view concept");const S=g(Z.columns,"sample column");for(const D of Z.columns)I(L,D.informationId,"concept information");g(Z.rows,"sample row");for(const D of Z.rows){const te=new Set;for(const X of D.cells)I(S,X.columnId,"sample column"),V(!te.has(X.columnId),"Duplicate sample cell: "+X.columnId),te.add(X.columnId);V(te.size===S.size,"Sample row does not match columns")}}}}for(const E of d.presentation.landscapeRelationships){const P=I(C,E.from,"review group"),T=I(C,E.to,"review group");V(P.subsystemId===T.subsystemId,"Internal relationship crosses subsystem boundary")}for(const E of d.presentation.reviewBoundaries)I(C,E.from,"review group"),I(C,E.to,"review group");s.push("概念モデルの業務意味は未確認: "+d.id)}else{const p=l(d.basedOn.documentId,"document");V(p.kind==="businessDesign","Check source is not BD"),V(p.revision===d.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+d.id),V(new Set(d.items.map(h=>h.checkId)).size===d.items.length,"Duplicate Check ID");const g=new Set;for(const h of d.index){l(h.activityId,"activity",p.id),V(!g.has(h.activityId),"Duplicate Activity index"),g.add(h.activityId),V(new Set(h.checkIds).size===h.checkIds.length,"Duplicate Check binding");for(const x of h.checkIds)l(x,"check",d.id)}V(new Set(d.sections.map(h=>h.activityId??h.title)).size===d.sections.length,"Duplicate Activity section");for(const h of d.sections)h.activityId!==null&&(l(h.activityId,"activity",p.id),V(g.has(h.activityId),"Section missing from index")),c(h.preamble,d.id);const m=new Set(e.documents.filter(h=>h.kind==="conceptModel"&&h.basedOn.documentId===p.id&&h.basedOn.revision===p.revision).flatMap(h=>h.reviewGroups.flatMap(x=>x.capabilities.flatMap(C=>C.testSpecification?.decisionExampleIds??[]))));for(const h of d.guarantees){const x=h.blocks.length>0&&h.blocks.every(C=>C.kind==="example"&&m.has(C.exampleId)&&d.examples.some(w=>w.id===C.exampleId&&w.guaranteeId===h.id&&Vn(d,w).length>0));V(h.blocks.some(C=>C.kind==="prose"&&u(C.content))||x,"General guarantee prose required"),l(h.sectionId,"section",d.id);for(const C of h.blocks)if(C.kind==="prose")c(C.content,d.id);else{const w=l(C.exampleId,"example",d.id);V(w.guaranteeId===h.id,"Example owner mismatch")}}for(const h of d.examples){l(h.guaranteeId,"guarantee",d.id),V(h.columns.length>0,"Example columns required");for(const x of h.rows){V(x.length===h.columns.length,"Example column mismatch");for(const C of x)c(C,d.id)}}for(const h of d.items){const x=l(h.sectionId,"section",d.id);V(x.activityId===null?!d.index.some(C=>C.checkIds.includes(h.id)):d.index.some(C=>C.activityId===x.activityId&&C.checkIds.includes(h.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),V(u(h.fields.guarantee)||u(h.fields.condition)&&u(h.fields.expectedResult),"Check guarantee required");for(const C of Object.values(h.fields))c(C,d.id);V(x.activityId===null||d.index.some(C=>C.checkIds.includes(h.id)),"Unbound Check")}for(const h of d.notes)c(h.content,d.id);c(d.intro,d.id)}const r=e.diagnostics.filter(d=>d.startsWith("Role未確定:"));V(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const d of r)V(a.delete(d),"Unresolved Who requires a diagnostic matching a current unresolved Activity");V(a.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const d of e.sources){l(d.documentId,"document");const p=d.documentId+"@"+d.revision;V(!f.has(p),"Duplicate source descriptor"),f.add(p)}for(const d of e.externalDocuments)V(e.sources.some(p=>p.documentId===d.id&&p.revision===d.revision),"External source revision missing"),V(d.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+d.id);return{diagnostics:s,entities:n.size}}const oe=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Qs(e,t,n){if(n==null)return;const o=En(n);return e.append(oe("h3",t),o),o}function Sd(e,t){if(e===null)return;const n=En(e),o=s=>String(s??"").replace(/\s+/g,""),i=new Set(t.map(s=>o(En(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))i.has(o(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const xd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Ad(e,t,n){const o=new Map,i=new Set,s=new Set(n.map(l=>l.id)),a=e.model.business;for(const l of e.model.concepts??[]){if(l.basedOn.documentId!==a.id||l.basedOn.revision!==a.revision)continue;const u=l.presentation.activityViews;if(Array.isArray(u)){for(const c of u)if(!(!c||typeof c!="object"||Array.isArray(c)||c.activityId!==t||!Array.isArray(c.businessVariations)))for(const r of c.businessVariations){if(!r||typeof r!="object"||Array.isArray(r)||typeof r.exceptionId!="string"||!s.has(r.exceptionId)||r.kind!=="alternative"&&r.kind!=="exception"||i.has(r.exceptionId))continue;const f=o.get(r.exceptionId);f&&f!==r.kind?(o.delete(r.exceptionId),i.add(r.exceptionId)):o.set(r.exceptionId,r.kind)}}}return o}function Ed(e,t){const n=oe("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(l=>l.id===t),a=i.activities.find(l=>l.id===t);if(s){Qs(n,"Scope",String(s.scope)),n.append(oe("h3","Information"));const l=oe("ul");for(const u of s.information)l.append(oe("li",u));n.append(l)}else if(a){const l=i.exceptions?.filter(d=>d.activityId===a.id)??[];for(const[d,p]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=Qs(n,d,p==="who"?us(e,a.id)?.name??a.who:a[p]===null?null:String(a[p]));p==="result"&&g&&(g.dataset.businessResult="")}const u=Sd(a.exception,l),c=Ad(e,a.id,l),r=(d,p,g)=>{if(!p.length&&!g)return;const m=oe("section");m.dataset.businessVariations="",m.append(oe("h3",d)),g&&m.append(g);for(const h of p){const x=En(h.description);x.dataset.businessException=h.id,m.append(oe("h4",h.name),x)}n.append(m)};c.size?(r("例外",l.filter(d=>c.get(d.id)==="exception")),r("別ルート",l.filter(d=>c.get(d.id)==="alternative")),r("通常以外の扱い",l.filter(d=>!c.has(d.id)),u)):r("通常以外の扱い",l,u);const f=new Map([...i.objects,...i.activities].map(d=>[d.id,d.name]));for(const[d,p]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=i.relations.filter(h=>h.kind===d&&(h.fromId===t||h.toId===t));if(!g.length)continue;n.append(oe("h3",p));const m=g.map(h=>`${f.get(h.fromId)} → ${f.get(h.toId)} — ${h.label}`);if(d==="business-exception")for(const h of m)n.append(oe("p",h));else{const h=oe("ul");for(const x of m)h.append(oe("li",x));n.append(h)}}}else n.append(oe("p","項目を選択すると業務内容を表示します。"));return n}class ho{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(oe("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(En(i.value));continue}if(i.kind==="text"){const u=oe("span",i.value);u.style.whiteSpace="pre-wrap",t.append(u);continue}if(i.kind==="link"){t.append(oe("span",`${i.label} (${i.uri})`));continue}const s=oe("details"),a=oe("summary",i.label||i.targetId);s.append(a),t.append(s);let l=!1;s.addEventListener("toggle",()=>{if(!s.open||l)return;if(l=!0,o.has(i.targetId)){s.append(oe("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(oe("p","参照の深さの上限です。続きは原文で確認してください。"));return}const u=new Set(o).add(i.targetId),c=this.doc,r=c.guarantees.find(m=>m.id===i.targetId),f=c.examples.find(m=>m.id===i.targetId),d=c.items.find(m=>m.id===i.targetId),p=c.sections.find(m=>m.id===i.targetId),g=c.notes.find(m=>m.id===i.targetId);if(r){s.append(oe("h4",r.title));for(const m of r.blocks){if(!this.take(s))break;m.kind==="prose"?this.runs(s,m.content,u):this.example(s,m.exampleId,u)}}else if(f)this.example(s,f.id,u);else if(d){s.append(oe("p",`${d.checkId} · ${d.title}`+(this.requester?"":` · ${d.reviewState}`))),this.requester&&(d.reviewState==="要確認"||d.reviewState==="要修正")&&s.append(oe("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(d.fields).filter(([h])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(h))):d.fields;this.fields(s,m,u)}else p?(s.append(oe("h4",p.title)),this.runs(s,p.preamble,u)):g?(s.append(oe("h4",g.title)),this.runs(s,g.content,u)):i.targetId===c.id&&(s.append(oe("h4",c.title)),this.runs(s,c.intro,u))})}}fields(t,n,o,i=!1){for(const[s,a]of Object.entries(n)){if(!this.take(t))break;if(t.append(oe("h4",xd[s]??s)),s==="guarantee"&&i){const l=new Set;for(const u of a){const c=u.kind==="reference"?this.doc.guarantees.find(f=>f.id===u.targetId):void 0;if(!c){this.runs(t,[u],o);continue}if(l.has(c.id))continue;l.add(c.id);const r=new Set(o).add(c.id);for(const f of c.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,a,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!Vn(this.doc,s).length)return;const a=oe("table"),l=i?s.columns.indexOf("結果"):-1,u=l>0&&s.columns.at(-1)==="Check ID";if(u){const f=oe("colgroup");f.span=l,a.append(f);for(let h=l;h<s.columns.length;h++)a.append(oe("colgroup"));const d=oe("thead"),p=oe("tr"),g=oe("th","条件");g.colSpan=l,g.scope="colgroup",p.append(g);for(let h=l;h<s.columns.length;h++){const x=oe("th",s.columns[h]);x.rowSpan=2,x.scope="col",h===l?x.className="decision-result":s.columns[h]==="備考"&&(x.className="decision-notes"),p.append(x)}const m=oe("tr");for(const h of s.columns.slice(0,l)){const x=oe("th",h);x.scope="col",m.append(x)}d.append(p,m),a.append(d)}else{const f=oe("tr");for(const d of s.columns){if(!this.take(t))break;f.append(oe("th",d))}a.append(f)}const c=u?oe("tbody"):a;for(const f of s.rows){if(!this.take(t))break;const d=oe("tr");for(const[p,g]of f.entries()){if(!this.take(t))break;const m=oe("td");if(u&&p===l?m.className="decision-result":u&&s.columns[p]==="備考"&&(m.className="decision-notes"),i)for(const h of g){const x=h.kind==="reference"?this.doc.items.find(C=>C.id===h.targetId):void 0;x?m.append(oe("span",x.checkId)):this.runs(m,[h],o)}else this.runs(m,g,o);d.append(m)}c.append(d)}u&&a.append(c);const r=oe("div");r.className="json-example",r.append(a),t.append(r)}}function er(e,t,n=e.model.checks,o=new Set,i=new Set){const s=oe("section");s.className="check-content json-checks";const a=e.model.business,l=n.filter(c=>c.basedOn.documentId===a.id);let u=!1;for(const c of l){const r=new ho(c),f=c.index.filter(m=>m.activityId===t),d=new Set(c.index.flatMap(m=>m.checkIds)),p=(t?[...new Set(f.flatMap(m=>m.checkIds))]:c.items.filter(m=>!d.has(m.id)).map(m=>m.id)).filter(m=>!o.has(m)),g=c.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of g){(m.preamble.length||c.guarantees.some(h=>h.sectionId===m.id&&!i.has(h.id)))&&(u=!0),r.runs(s,m.preamble);for(const h of c.guarantees.filter(x=>x.sectionId===m.id&&!i.has(x.id)))r.runs(s,[{kind:"reference",targetId:h.id,label:h.title}])}for(const m of p){const h=c.items.find(w=>w.id===m);if(!h)continue;u=!0;const x=oe("section");x.className="check-item",x.dataset.checkId=h.checkId,x.dataset.elementId=h.id,x.append(oe("h3",h.checkId+" · "+h.title)),(h.reviewState==="要確認"||h.reviewState==="要修正")&&x.append(oe("p","確認が必要です。"));const C=Object.fromEntries(Object.entries(h.fields).filter(([w])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(w)));r.fields(x,C,new Set([h.id])),s.append(x)}if(!t)for(const m of c.notes)u=!0,r.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}return u||s.append(oe("p","この業務のテスト仕様はありません。")),s}function Cd(e,t,n=e.model.checks){const o=oe("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const a of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new ho(a);for(const u of a.items.filter(c=>s.has(c.id))){const c=oe("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(oe("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(oe("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));l.fields(c,r,new Set([u.id]),!0),o.append(c)}}return o}const Od=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function jd(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(Od,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Nd(e,t,n=e.model.checks){const o=oe("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const a of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=a.examples.find(g=>g.id===s);if(!l||!Vn(a,l).length)continue;const u=new ho(a,!0),c=a.guarantees.find(g=>g.id===l.guaranteeId),r=oe("section");r.dataset.decisionExample=s;for(const g of c?.blocks??[])g.kind==="prose"&&u.runs(r,jd(g.content),new Set([c.id]));l.rows.length>1&&r.append(oe("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=l.columns.indexOf("結果"),d=f>0?f:l.columns.length;l.rows.some(g=>g.slice(0,d).some(m=>m.some(h=>h.kind==="text"&&/^\s*[-‐]\s*$/.test(h.value))))&&r.append(oe("p","‐＝値不問。")),u.example(r,s,new Set([s]),!0),o.append(r)}return o}function Md(e,t,n=e.model.checks){const o=oe("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const a of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new ho(a,!0);for(const u of a.items.filter(c=>s.has(c.id))){const c=oe("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(oe("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(oe("p","確認が必要です。")),u.fields.condition?.length&&(c.append(oe("h4","条件")),l.runs(c,u.fields.condition,new Set([u.id])));const r=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=oe("details");f.append(oe("summary","期待結果")),l.fields(f,r,new Set([u.id]),!0),c.append(f)}o.append(c)}}return o}function Ld(e,t,n=e.model.checks,o=new Set){const i=oe("section");i.className="check-content json-checks result-checks";const s=e.model.business,a=new Set(t);for(const l of n.filter(u=>u.basedOn.documentId===s.id&&u.basedOn.revision===s.revision)){const u=new ho(l,!0),c=l.items.filter(r=>a.has(r.id)&&o.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);c.length&&i.append(oe("p",c.map(r=>r.checkId).join("、")));for(const r of l.items.filter(f=>a.has(f.id))){if(c.includes(r))continue;const f=oe("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(oe("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(oe("p","確認が必要です。"));const d=Object.fromEntries(Object.entries(r.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));u.fields(f,d,new Set([r.id]),!0);const p=oe("details"),g=oe("summary","Check の詳細");p.append(g,oe("p",r.title)),r.fields.condition?.length&&u.runs(p,r.fields.condition,new Set([r.id])),f.append(p),i.append(f)}}return i}const ji=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Rd(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),o=[],i=new Set,s=new Set,a=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),l=(r,f)=>a.some(d=>d.items.some(p=>p.id===r)&&(!f||d.index.some(p=>p.activityId===f&&p.checkIds.includes(r)))),u=(r,f,d,p,g=[])=>{const m=f.testSpecification,h=(m?.decisionCheckIds??[]).filter(W=>l(W,d)),x=(m?.resultCheckIds??[]).filter(W=>l(W,d)),C=(m?.decisionExampleIds??[]).filter(W=>a.some(R=>{const E=R.examples.find(T=>T.id===W),P=E?Vn(R,E):[];return P.length>0&&P.every(T=>l(T,d))})),w=f.samples.filter(W=>(!m||m.sampleIds.includes(W.id))&&W.checkIds?.length&&(m?W.checkIds.every(R=>l(R,d)):W.checkIds.some(R=>l(R,d)))),L=C.flatMap(W=>a.flatMap(R=>{const E=R.examples.find(P=>P.id===W);return E?Vn(R,E).filter(P=>l(P,d)):[]})),I=[...new Set([...h,...x,...L,...w.flatMap(W=>(W.checkIds??[]).filter(R=>l(R,d)))])];if(!I.length)return;const y=`fn:${d??"_"}:${r}:${f.id}`;s.has(y)||(s.add(y),o.push({key:y,activityId:d,groupId:r,capability:f,name:p,samples:w,checkIds:I,decisionCheckIds:h,resultCheckIds:x,decisionExampleIds:C,decisionTableCheckIds:[...new Set(L)],businessSections:g}))},c=e.model.presentation.activityViews;if(Array.isArray(c)){for(const r of c)if(!(!ji(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!ji(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const d=e.model.reviewGroups.find(m=>m.id===f.groupId),p=d?.capabilities.find(m=>m.id===f.capabilityId);if(!d||!p)continue;i.add(JSON.stringify([d.id,p.id]));const g=[];if(Array.isArray(f.businessSections))for(const m of f.businessSections){if(!ji(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(x=>x.id===m.exceptionId&&x.activityId===r.activityId)))continue;const h=[...new Set(m.pages.filter(x=>x==="decision"||x==="result"))];h.length&&g.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:h})}u(d.id,p,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():p.title,g)}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)i.has(JSON.stringify([r.id,f.id]))||u(r.id,f,void 0,f.title);return o}function tr(e,t,n,o){const i=e.filter(a=>a.groupId===t&&a.capability.id===n),s=i.find(a=>a.samples.some(l=>l.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const a of i){if(!a.capability.testSpecification)continue;const l=a.capability.samples.find(c=>c.id===o),u=a.decisionExampleIds.length?a.decisionTableCheckIds:a.decisionCheckIds;if(l?.checkIds?.some(c=>u.includes(c)))return{kind:"decision",key:"decision:"+a.key}}}const Yr={enabled:!1,get:()=>{}},Qe=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Tn=e=>typeof e=="string"&&!!e.trim(),dn=(e,t)=>Object.keys(e).every(n=>t.includes(n));function Dd(e,t){return t===void 0?!0:typeof t!="string"?!1:t.split("|").map(o=>o.trim()).some(o=>o==="string"||/^string（[^）]*）$/.test(o)?typeof e=="string":o==="number"?typeof e=="number"&&Number.isFinite(e):o==="boolean"?typeof e=="boolean":o==="null"?e===null:o==="string[]"?Array.isArray(e)&&e.every(i=>typeof i=="string"):o==="array"?Array.isArray(e):o==="object"||o==="object（任意構造）"?Qe(e):!1)}function Cn(e){return Array.isArray(e)?"["+e.map(Cn).join(",")+"]":Qe(e)?"{"+Object.keys(e).sort().map(t=>JSON.stringify(t)+":"+Cn(e[t])).join(",")+"}":JSON.stringify(e)}function Td(e){const t=JSON.parse(JSON.stringify(e));return Qe(t.meta)&&delete t.meta.previewStructureReview,new TextEncoder().encode(Cn(t))}async function Pd(e){const t=await globalThis.crypto.subtle.digest("SHA-256",new Uint8Array(e));return Array.from(new Uint8Array(t),n=>n.toString(16).padStart(2,"0")).join("")}async function qd(e,t=Pd){const n=d=>({projection:Yr,code:d}),o=e.meta,i=Qe(o)?o.previewStructureReview:void 0;if(i===void 0)return n("absent");if(!Qe(i)||i.format!=="alder-preview-structure-review/2"||!dn(i,["format","basedOn","origin","fields"]))return n("catalog-shape");const s=i.basedOn,a=i.origin;if(!Qe(s)||!dn(s,["kind","documentId","revision","modelSha256"])||s.kind!=="conceptModel"||!Tn(s.modelSha256)||!/^[a-f0-9]{64}$/.test(s.modelSha256))return n("binding-shape");if(s.documentId!==e.id||s.revision!==e.revision)return n("wrong-model");if(!Qe(a)||!dn(a,["repository","commit","path","sha256"])||!Tn(a.repository)||!Tn(a.path)||typeof a.commit!="string"||!/^[a-f0-9]{40}$/.test(a.commit)||typeof a.sha256!="string"||!/^[a-f0-9]{64}$/.test(a.sha256))return n("origin-shape");if(!Array.isArray(i.fields))return n("fields-shape");const l=new Map,u=new Map,c=new Map,r=new Map;for(const d of e.concepts){if(l.has(d.id))return n("duplicate-concept");l.set(d.id,d);for(const p of d.information){if(u.has(p.id))return n("duplicate-information");u.set(p.id,d.id)}}for(const d of e.relations){if(c.has(d.id))return n("duplicate-relation");c.set(d.id,d)}if(!Qe(o)||!Array.isArray(o.fieldMappings))return n("missing-mappings");for(const d of o.fieldMappings){if(!Qe(d)||!Tn(d.informationId)||r.has(d.informationId))return n("duplicate-or-invalid-mapping");if(!u.has(d.informationId))return n("missing-mapping-target");r.set(d.informationId,d)}const f=new Map;for(const d of i.fields){if(!Qe(d)||!dn(d,["target","purpose","sample","perspectives"])||!Qe(d.target)||!dn(d.target,["conceptId","informationId"]))return n("entry-shape");const p=d.target,g=p.informationId;if(!Tn(g)||u.get(g)!==p.conceptId)return n("missing-target");if(f.has(g))return n("duplicate-target");const m=r.get(g);if(!m||!Array.isArray(m.relationIds))return n("missing-mapping");const h=m.representation==="relationKey"?m.relationKeyIds:m.relationIds;if(!Array.isArray(h))return n("missing-dependency");for(const C of h){const w=typeof C=="string"?c.get(C):void 0;if(!w||!l.has(w.fromConceptId)||!l.has(w.toConceptId)||w.fromConceptId!==p.conceptId&&w.toConceptId!==p.conceptId)return n("missing-dependency")}if(d.purpose!==void 0&&!Tn(d.purpose))return n("purpose-shape");if(!Array.isArray(d.perspectives)||!d.perspectives.length||d.perspectives.length>3||new Set(d.perspectives).size!==d.perspectives.length||!d.perspectives.every(C=>["依頼者","設計者","開発者"].includes(C)))return n("perspectives-shape");let x;if(d.sample!==void 0){const C=d.sample;if(!Qe(C)||!dn(C,["value","coverage","when"])||!Object.hasOwn(C,"value")||!["field-value","document-fragment"].includes(String(C.coverage)))return n("sample-shape");if(C.coverage==="document-fragment"&&(!Array.isArray(C.value)||!C.value.every(Qe)))return n("fragment-shape");const w=m.valueType,L=C.value,I=m.valueDomain;if(!Dd(L,w))return n("sample-type");if(Qe(I)&&Array.isArray(I.values)&&!I.values.some(y=>Qe(y)&&Cn(y.value)===Cn(L)))return n("sample-domain");if(C.when!==void 0){if(!Array.isArray(C.when)||!C.when.length)return n("condition-shape");for(const y of C.when)if(!Qe(y)||!dn(y,["target","predicate"])||y.predicate!=="nonempty"||!Qe(y.target)||!dn(y.target,["conceptId","informationId"])||u.get(String(y.target.informationId))!==y.target.conceptId||y.target.conceptId!==p.conceptId)return n("missing-dependency")}try{x=typeof C.value=="string"?C.value||'""':JSON.stringify(C.value)}catch{return n("sample-shape")}if(x===void 0)return n("sample-shape")}f.set(g,{purpose:d.purpose,sample:x,perspectives:[...d.perspectives]})}if(f.size!==u.size)return n("incomplete-targets");try{if(await t(Td(e))!==s.modelSha256)return n("model-content-mismatch")}catch{return n("digest-unavailable")}return{code:"valid",projection:{enabled:!0,get:d=>f.get(d)}}}const Vi=["owned","reference","unknownOut"];function Qr(e){const t=e.meta&&typeof e.meta=="object"&&!Array.isArray(e.meta)?e.meta:{},n=t.compatibilityReview&&typeof t.compatibilityReview=="object"&&!Array.isArray(t.compatibilityReview)?t.compatibilityReview:{},o=(i,s)=>{const a=n[i];if(!a||typeof a!="object"||Array.isArray(a))return;const l=a[s];if(!l||typeof l!="object"||Array.isArray(l))return;const u=l;return(u.kind==="legacy"||u.kind==="needs-review")&&typeof u.reason=="string"&&u.reason.trim()?{kind:u.kind,reason:u.reason}:void 0};return{concept:i=>o("concepts",i),field:(i,s)=>o("fields",i)??o("concepts",s),relation:(i,s)=>o("relations",i)??o("concepts",s)}}const zo=e=>e.kind==="legacy"?"互換・移行用":"要確認";function ea(e){const t=new Map(e.concepts.map(y=>[y.id,y])),n=e.meta&&typeof e.meta=="object"?e.meta:{},o=n.relationNames&&typeof n.relationNames=="object"&&!Array.isArray(n.relationNames)?n.relationNames:{},i=n.reverseRelationNames&&typeof n.reverseRelationNames=="object"&&!Array.isArray(n.reverseRelationNames)?n.reverseRelationNames:{},s=n.conceptNames&&typeof n.conceptNames=="object"&&!Array.isArray(n.conceptNames)?n.conceptNames:{},a=Array.isArray(n.fieldMappings)?n.fieldMappings.filter(y=>!!y&&typeof y=="object"&&typeof y.informationId=="string"&&typeof y.physicalName=="string"&&Array.isArray(y.relationIds)&&y.relationIds.every(W=>typeof W=="string")):[],l=new Map;for(const y of a){const W=l.get(y.informationId)??[];W.push(y),l.set(y.informationId,W)}const u=new Map([...l].filter(([,y])=>y.length===1).map(([y,W])=>[y,W[0]])),c=y=>y.representation==="relationKey"?Array.isArray(y.relationKeyIds)&&y.relationKeyIds.every(W=>typeof W=="string")?y.relationKeyIds:[]:y.relationIds,r=new Map;for(const y of e.relations){const W=r.get(y.id)??[];W.push(y),r.set(y.id,W)}const f=new Map([...r].filter(([,y])=>y.length===1).map(([y,W])=>[y,W[0]])),d=new Set;for(const y of e.concepts)for(const W of y.information){const R=u.get(W.id);R?.representation!=="relationKey"||!c(R).length||c(R).every(E=>{const P=f.get(E);return!!P&&t.has(P.fromConceptId)&&t.has(P.toConceptId)&&(P.kind==="reference"&&P.fromConceptId===y.id||P.kind==="down"&&(P.fromConceptId===y.id||P.toConceptId===y.id))})&&d.add(W.id)}const p=Array.isArray(n.relationPhysicalFields)?n.relationPhysicalFields.filter(y=>!!y&&typeof y=="object"&&typeof y.relationId=="string"&&typeof y.physicalName=="string"&&!!y.physicalName.trim()):[],g=new Map;for(const y of t.keys())g.set(y,[]);for(const y of e.relations){if(!t.has(y.fromConceptId)||!t.has(y.toConceptId))continue;const W=O=>typeof O=="string"&&O.trim()?O:"未定義",R=O=>t.get(O).information.flatMap(z=>{const B=u.get(z.id);return B&&c(B).includes(y.id)?[{name:z.name,physicalName:B.physicalName,valueType:B.valueType}]:[]}),E=R(y.fromConceptId),P=R(y.toConceptId),T=Object.hasOwn(o,y.id)?o[y.id]:void 0,q=typeof T=="string"&&T.trim()?T.trim():void 0,H=Object.hasOwn(i,y.id)?i[y.id]:void 0,A=typeof H=="string"&&H.trim()?H.trim():void 0,Z=y.kind,S=Z==="down"?t.get(y.toConceptId).information.flatMap(O=>{const z=u.get(O.id);return d.has(O.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]}):[],D=t.get(y.fromConceptId).information.flatMap(O=>{const z=u.get(O.id);return d.has(O.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]}),te=p.filter(O=>O.relationId===y.id).map(O=>O.physicalName),X=[...new Set([...E.map(O=>O.physicalName),...S,...te])],he=new Set([...D,...S,...te]),re=new Set(t.get(y.fromConceptId).information.flatMap(O=>{const z=u.get(O.id);return!d.has(O.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]})),ae=X.filter(O=>!he.has(O)||re.has(O));g.get(y.fromConceptId).push({relation:y,from:y.fromConceptId,to:y.toConceptId,direction:Z==="down"?"owned":Z==="reference"?"reference":"unknownOut",count:W(y.toLabel),reverseCount:W(y.fromLabel),fields:X,visibleFields:ae,fieldDetails:E,roleName:q}),g.get(y.toConceptId).push({relation:y,from:y.toConceptId,to:y.fromConceptId,direction:Z==="down"?"owner":Z==="reference"?"referencedBy":"unknownIn",count:W(y.fromLabel),reverseCount:W(y.toLabel),fields:P.map(O=>O.physicalName),visibleFields:P.map(O=>O.physicalName),fieldDetails:P,...Z==="down"&&A?{roleName:A}:{}})}const m=new Set(e.relations.filter(y=>y.kind==="down"&&t.has(y.fromConceptId)&&t.has(y.toConceptId)).map(y=>y.toConceptId)),h=e.concepts.filter(y=>!m.has(y.id)),x=h.filter(y=>{const W=y.information.map(E=>u.get(E.id)).filter(E=>!!E),R=W.find(E=>E.physicalName==="documents[]"&&E.valueType==="array");return W.some(E=>E.physicalName==="format")&&W.some(E=>/^formatVersion(?:\s*:.*)?$/.test(E.physicalName))&&W.some(E=>E.physicalName==="revision")&&!!R&&R.relationIds.some(E=>e.relations.some(P=>P.id===E&&P.kind==="down"&&P.fromConceptId===y.id))}),C=x.length===1?x[0].id:void 0,w=C?[C]:(h.length?h:e.concepts).map(y=>y.id),L=new Set,I=[...w];for(;I.length;){const y=I.pop();if(!L.has(y)){L.add(y);for(const W of g.get(y)??[])Vi.includes(W.direction)&&!L.has(W.to)&&I.push(W.to)}}return{nodes:t,edges:g,mappings:u,relationKeys:d,conceptNames:s,packageRoot:C,roots:w,hasOwnershipRoots:h.length>0,reachable:L}}const to={owned:"所有",reference:"参照",owner:"所属先",referencedBy:"参照元",unknownOut:"種類未定義（出）",unknownIn:"種類未定義（入）"},nr=(e,t)=>{const n=Mn(e,{"aria-hidden":"true","stroke-width":1.8});if(n.classList.add("structure-icon"),t){n.removeAttribute("aria-hidden"),n.setAttribute("role","img"),n.setAttribute("aria-label",t);const o=document.createElementNS("http://www.w3.org/2000/svg","title");o.textContent=t,n.prepend(o)}return n},We=(e,t,n,o)=>{const i=document.createElement(t);return i.textContent=n,o&&(i.className=o),e.append(i),i},ta=(e,t)=>{t&&(e.classList.add("structure-review-"+t.kind),We(e,"span",zo(t),"structure-review-badge"))};function Pn(e,t){const n=We(e,"div","","structure-review-value");if(Array.isArray(t))for(const[o,i]of t.entries())o&&n.append(document.createTextNode("・")),We(n,"span",i,"structure-review-perspective");else n.textContent=t}const or=new WeakMap;async function na(e,t,n,o){const i={};if(or.set(e,i),!t.meta||typeof t.meta!="object"||!Object.hasOwn(t.meta,"previewStructureReview")){$o(e,t,n,o);return}const s=JSON.parse(JSON.stringify(t)),a=Cn(s);$o(e,s,n,o);const l=await qd(s);if(or.get(e)!==i||!l.projection.enabled)return;try{if(Cn(t)!==a)return}catch{return}const u=e.contains(e.ownerDocument.activeElement)?e.ownerDocument.activeElement:void 0,c=u?.className,r=u?.closest("[data-information-id]")?.dataset.informationId;$o(e,s,n,o,l.projection),r?Array.from(e.querySelectorAll("[data-information-id]")).find(f=>f.dataset.informationId===r)?.querySelector("button")?.focus():c&&/^(structure-copy-id|structure-copy-full|structure-attribute-back)$/.test(c)&&e.querySelector("."+c)?.focus()}const Mo=e=>e.split(" / ").map(t=>t.trim().split(".").pop()??t).join(" / ");function ir(e){const t=e?.valueDomain,n=t?.kind,o=Bi(e);if((n==="enum"||n==="fixed")&&o.length)return o.map(a=>a.literal).join(" | ");const i={identifier:"識別子",version:"版・改訂",reference:"参照",referenceType:"参照先の種類",hash:"SHA-256",uri:"URI",cardinality:"多重度"};if(typeof n=="string"&&i[n])return i[n];const s=typeof e?.valueType=="string"&&e.valueType.trim()?e.valueType:"未定義";return e?.nullableStatus==="proposal"?s.split("|").map(a=>a.trim()).filter(a=>a!=="null").join(" | ")||"未定義":s}function Bi(e){const t=e?.valueDomain;if(!t||!["enum","fixed"].includes(String(t.kind))||!Array.isArray(t.values))return[];const n=[];for(const o of t.values){if(!o||typeof o!="object"||!["string","number","boolean"].includes(typeof o.value))return[];const i=typeof o.value=="string"?o.value||'""':String(o.value);n.push({value:i,literal:JSON.stringify(o.value)??String(o.value),...typeof o.label=="string"&&o.label.trim()?{label:o.label.trim()}:{}})}return n}function sr(e){return e.label?e.value+"："+e.label:e.value}function rr(e){const t=e?.valueDomain?.note;return typeof t=="string"&&t.trim()?t.trim():void 0}function ar(e){return typeof e?.nullable=="boolean"?e.nullable?"許容する":"許容しない":e&&Object.hasOwn(e,"nullable")?"未決":"未定義"}function cr(e,t){const n=typeof e.description=="string"&&e.description.trim()?e.description:t?.logicalMeaning;return typeof n=="string"&&n.trim()?n:"この項目の説明はまだ記載されていません。"}function dr(e,t,n,o,i=[]){const s=document.createElement("div");s.className="structure-copy-actions";const a=document.createElement("span");a.className="structure-copy-status",a.setAttribute("role","status"),a.setAttribute("aria-live","polite");const l=()=>{const d=[];for(const p of Array.from(t.children)){if(p.tagName!=="DT")continue;const g=p.nextElementSibling;if(!g)continue;const m=g.querySelector("table"),h=C=>Array.from(C.childNodes).map(w=>w.nodeName==="UL"||w.nodeName==="OL"?Array.from(w.childNodes).map(L=>L.textContent?.trim()??"").filter(Boolean).join("、"):w.textContent?.trim()??"").filter(Boolean).join(" / "),x=m?Array.from(m.querySelectorAll("tr")).map(C=>Array.from(C.children).map(h).join(" | ")).join(`
`):Array.from(g.childNodes).map(C=>C.nodeName==="BR"?`
`:C.textContent??"").join("");d.push((p.querySelector(".structure-detail-caption")?.textContent??p.textContent??"")+"："+x)}return[o,...i.length?["元の定義："+i.join("、")]:[],...d].join(`
`)},u=async d=>{try{const p=e.ownerDocument.defaultView?.navigator.clipboard;if(!p?.writeText)throw Error("Clipboard unavailable");await p.writeText(d?l():o),a.textContent=d?"全文をコピーしました。":"識別情報をコピーしました。"}catch{a.textContent="コピーできませんでした。ブラウザーの設定を確認してください。"}},c=document.createElement("button");c.type="button",c.className="structure-copy-id",c.textContent="識別情報をコピー",c.title="Shiftを押しながら選ぶと全文をコピー",c.addEventListener("click",d=>{u(d.shiftKey)});const r=document.createElement("button");r.type="button",r.className="structure-copy-full",r.textContent="全文をコピー",r.addEventListener("click",()=>{u(!0)}),s.append(c,r);const f=document.createElement("span");f.className="structure-detail-caption",f.textContent=n.textContent,n.classList.add("structure-copy-heading"),n.replaceChildren(f,s,a)}function $o(e,t,n,o,i=Yr){if(e.replaceChildren(),!n){We(e,"p","ツリーの項目を選択すると詳細を確認できます。");return}const s=ea(t),a=Qr(t),l=s.nodes.get(n.conceptId);if(!l){We(e,"p","項目が見つかりません。");return}const u=t.meta&&typeof t.meta=="object"?t.meta:{},c=u.modelStatus==="normalized-study"||u.modelStatus==="complete-package-study",r=S=>{const D=s.nodes.get(S),te=s.conceptNames[S];return{local:typeof te?.logicalName=="string"&&te.logicalName?te.logicalName:D?.name??S,type:typeof te?.typeName=="string"&&te.typeName?te.typeName:D?.name??"未定義"}},f=document.createElement("dl");f.className="structure-detail-list",e.append(f);const d=S=>{o?o(S):i.enabled?$o(e,t,S,void 0,i):na(e,t,S),S.kind==="attribute"?e.querySelector(".structure-attribute-back")?.focus():n.kind==="attribute"&&Array.from(e.querySelectorAll(".structure-attribute-table tbody tr")).find(D=>D.dataset.informationId===n.informationId)?.querySelector(".structure-attribute-select")?.focus()},p=(S,D)=>{const te=document.createElement("dt"),X=document.createElement("dd");te.textContent=S;const he=Array.isArray(D)?D:[D??"未定義"];if(!he.length)X.textContent="なし";else for(const[re,ae]of he.entries())re&&X.append(document.createElement("br")),X.append(document.createTextNode(ae));return f.append(te,X),te};if(n.kind==="attribute"){if(n.returnTo){const le=document.createElement("button");le.type="button",le.className="structure-attribute-back",le.textContent="項目一覧に戻る",le.onclick=()=>d(n.returnTo),e.insertBefore(le,f)}const S=l.information.find(le=>le.id===n.informationId);if(!S){f.remove(),We(e,"p","項目が見つかりません。");return}const D=s.mappings.get(S.id),te=S,X=r(l.id),he="概念モデル："+t.id+"（"+t.revision+`）
構造：`+X.type+"［"+l.id+`］
項目：`+S.name+(D?.physicalName?"（"+Mo(D.physicalName)+"）":"")+"［"+S.id+"］",re=Array.isArray(u.schemaCoverage)?u.schemaCoverage.flatMap(le=>le&&typeof le=="object"&&le.informationId===S.id&&typeof le.path=="string"?[le.path]:[]):[],ae=D?.relationIds.flatMap(le=>{const fe=(s.edges.get(l.id)??[]).filter(ve=>ve.relation.id===le);return fe.length?fe.map(ve=>r(ve.to).local+"（"+to[ve.direction]+"）"):[le+"（未定義）"]});dr(e,f,p("論理名",D?.physicalName?Mo(D.physicalName):void 0),he,re),p("ローカル名",S.name),p("型名",ir(D));const O=i.get(S.id),z=p("サンプル",lr(D)??"未記載");O?.sample!==void 0&&Pn(z.nextElementSibling,O.sample),p("null許容",ar(D)),p("説明",cr(te,D));const B=typeof D?.logicalPurpose=="string"?D.logicalPurpose:"",ue=p("使用目的",B);if(!B.trim()&&O?.purpose&&Pn(ue.nextElementSibling,O.purpose),i.enabled){const le=p("確認する立場",O?"":"未指定");if(O){const fe=le.nextElementSibling;Pn(fe,O.perspectives)}}D?.nullableReason&&p("null許容の理由",D.nullableReason);const Q=Bi(D);Q.length&&p(D?.valueDomain?.kind==="fixed"?"値":"選択肢",Q.map(sr));const ge=rr(D);ge&&p("制約",ge);const ye=a.field(S.id,l.id);ye&&p("位置づけ",zo(ye)+"："+ye.reason),p("所属",r(l.id).local+"（"+r(l.id).type+"）"),p("参照",ae),D?.logicalSourcePaths?.length&&p("対応する定義",D.logicalSourcePaths),typeof D?.optional=="boolean"&&p("項目の省略",D.optional?"可能":"不可"),D?.representation&&p("対応の種類",D.representation),S.responsibilityStatus&&p("責任の確認状態",S.responsibilityStatus),S.responsibleSubsystemId&&p("責任を持つサブシステム",t.subsystems.find(le=>le.id===S.responsibleSubsystemId)?.name);return}const g=n.relationId?s.edges.get(n.fromId??"")?.find(S=>S.relation.id===n.relationId&&S.to===l.id):void 0,m=r(l.id),h="概念モデル："+t.id+"（"+t.revision+`）
構造：`+m.type+"［"+l.id+"］"+(n.relationId?`
関係：`+n.relationId:""),x=S=>{const D=r(S);return D.local+"（"+D.type+"）"},C=(s.edges.get(l.id)??[]).filter(S=>S.direction==="owner").map(S=>x(S.to)),w=g?.direction==="owned"?[x(g.from)]:C,L=(s.edges.get(l.id)??[]).filter(S=>S.direction==="owned"&&(n.hideLegacy===!1||a.relation(S.relation.id,S.to)?.kind!=="legacy")).map(S=>{const D=r(S.to),te=a.relation(S.relation.id,S.to);return(te?zo(te)+"：":"")+(S.roleName??D.local)+"（"+D.type+"）"}),I=(s.edges.get(l.id)??[]).filter(S=>S.direction==="reference").map(S=>(S.roleName??"参照")+"："+r(S.to).local),y=g?.fieldDetails.filter(S=>!c||![...s.mappings.values()].some(D=>D.physicalName===S.physicalName&&D.relationIds.length>1)).map(S=>S.physicalName).filter(Boolean).map(Mo);dr(e,f,p("論理名",g?y?.length?y:void 0:m.type),h),p("ローカル名",g?.roleName??g?.fieldDetails[0]?.name??m.local),p("型名",m.type);const W=l.information.filter(S=>!s.relationKeys.has(S.id)&&(n.hideLegacy===!1||a.field(S.id,l.id)?.kind!=="legacy")),R=document.createElement("dt"),E=document.createElement("dd");if(R.textContent="項目とサンプル",f.append(R,E),!W.length)We(E,"p","表示する属性はありません。","structure-attribute-empty");else{const S=document.createElement("div"),D=document.createElement("table"),te=document.createElement("thead"),X=document.createElement("tr"),he=document.createElement("tbody");S.className="structure-attribute-wrap",D.className="structure-attribute-table",D.setAttribute("aria-label",m.local+"の項目とサンプル"),i.enabled&&D.classList.add("structure-review-table");for(const re of["項目","サンプル","説明","使用目的",...i.enabled?["確認する立場"]:[]]){const ae=document.createElement("th");ae.scope="col",ae.textContent=re,X.append(ae)}te.append(X),D.append(te,he),S.append(D),E.append(S);for(const re of W){const ae=s.mappings.get(re.id),O=re,z=document.createElement("tr"),B=document.createElement("th"),ue=document.createElement("td"),Q=document.createElement("td"),ge=document.createElement("td");z.dataset.informationId=re.id,B.scope="row";const ye=document.createElement("button");ye.type="button",ye.className="structure-attribute-name structure-attribute-select",ye.textContent=re.name,ye.onclick=()=>d({kind:"attribute",conceptId:l.id,informationId:re.id,hideLegacy:n.hideLegacy,returnTo:n}),B.append(ye);const le=a.field(re.id,l.id);le&&ta(B,le),ae?.physicalName&&We(B,"span","論理名："+Mo(ae.physicalName),"structure-attribute-meta"),We(B,"span","型："+ir(ae),"structure-attribute-meta"),We(B,"span","null許容："+ar(ae),"structure-attribute-meta");const fe=Bi(ae);if(fe.length){We(B,"span",ae?.valueDomain?.kind==="fixed"?"値：":"選択肢：","structure-attribute-meta");const Se=document.createElement("ul");Se.className="structure-domain-values";for(const gt of fe)We(Se,"li",sr(gt));B.append(Se)}const ve=rr(ae);ve&&We(B,"span","制約："+ve,"structure-attribute-meta");const ze=lr(ae);ze!==void 0?We(ue,"span",ze,"structure-attribute-sample"):We(ue,"span","未記載","structure-attribute-missing");const be=i.get(re.id);if(be?.sample!==void 0&&Pn(ue,be.sample),Q.textContent=cr(O,ae),ge.textContent=typeof ae?.logicalPurpose=="string"?ae.logicalPurpose:"",!ge.textContent.trim()&&be?.purpose&&Pn(ge,be.purpose),z.append(B,ue,Q,ge),i.enabled){const Se=document.createElement("td");Se.className="structure-review-perspectives",be?Pn(Se,be.perspectives):Se.textContent="未指定",z.append(Se)}he.append(z)}}p("所属",w.length?[...new Set(w)]:void 0),L.length&&p("含む構造",[...new Set(L)]),p("参照",g?.direction==="reference"?[m.local+"（"+m.type+"）"]:I);const T=c&&(/^候補の .+。現行0\.7の物理構造そのものではない。$/.test(l.description)||l.description==="0.7候補の構造に基づく概念モデルの検討案。")?"":l.description,q=g?.relation.condition||T;q&&p("説明",q);const H=g?a.relation(g.relation.id,l.id):a.concept(l.id);H&&p("位置づけ",zo(H)+"："+H.reason),g&&(p("関係の種類",to[g.direction]),p("多重度",g.count),p("反対側の多重度",g.reverseCount),g.relation.sourceRefs.length&&p("関係の出所",g.relation.sourceRefs.map(S=>[S.documentId,S.revision,S.targetType,S.targetId,S.section].filter(Boolean).join(" / "))),g.relation.condition&&T&&p("構造の説明",T));const A=c&&(l.reason==="正規化候補の構造レビュー。"||l.reason==="Alder JSON概念モデルのレビュー候補。");if(l.reason&&!A&&p("理由",l.reason),l.subsystemId){const S=t.subsystems.find(D=>D.id===l.subsystemId);c&&S?.id==="format-review"||p("サブシステム",S?.name)}const Z=(s.edges.get(l.id)??[]).filter(S=>S.direction==="referencedBy").map(S=>{const D=s.edges.get(S.to)?.find(te=>te.relation.id===S.relation.id&&te.direction==="reference"&&te.to===l.id)?.roleName;return r(S.to).local+(D?"："+D:"")});Z.length&&p("参照元",Z),l.businessObjectIds.length&&p("関連する対象",l.businessObjectIds),l.activityLinks.length&&p("関連する業務",l.activityLinks.map(S=>S.activityId+(S.uses.length?"："+S.uses.join("、"):""))),l.sourceRefs.length&&p("出所",l.sourceRefs.map(S=>[S.documentId,S.revision,S.targetType,S.targetId,S.section].filter(Boolean).join(" / ")))}function lr(e){if(!e)return;const t=Object.hasOwn(e,"sampleValue")&&e.sampleValue!==void 0?e.sampleValue:e.referenceValue;return typeof t=="string"?t||'""':JSON.stringify(t)}function Wd(e,t,n={}){const o=ea(t),i=Qr(t);if(e.replaceChildren(),e.className="structure-explorer",!o.roots.length){We(e,"p","この構造モデルには概念がありません。","structure-empty");return}if(n.rootId&&!o.nodes.has(n.rootId)){We(e,"p","指定した構造が見つかりません。","structure-empty");return}const s=n.rootId?[n.rootId]:o.roots,a=document.createElement("section");a.className="structure-panel",e.append(a);const l=document.createElement("div");l.className="structure-toolbar",a.append(l);const u=document.createElement("button");u.type="button",u.textContent="すべて展開",l.append(u);const c=document.createElement("button");c.type="button",c.textContent="すべて折りたたみ",l.append(c);const r=document.createElement("label");r.className="structure-compatibility-filter";const f=document.createElement("input");f.type="checkbox",f.checked=!0,r.append(f,document.createTextNode("互換・移行用を非表示")),r.title="互換・移行用と明示された項目を非表示にします。",l.append(r);const d=document.createElement("label");d.className="structure-search",d.append(nr(sc));const p=document.createElement("input");p.type="search",p.placeholder="構造名・項目名で検索",p.setAttribute("aria-label","構造名・項目名で検索"),d.append(p),l.append(d),!n.rootId&&!o.packageRoot&&!o.hasOwnershipRoots&&We(a,"p","JSON全体のルートと所有関係の起点を特定できないため、すべての構造を表示します。","structure-unreachable");const g=[...o.nodes.keys()].filter(A=>!o.reachable.has(A));!n.rootId&&g.length&&We(a,"p",`この起点からたどれない構造：${g.length}件`,"structure-unreachable");const m=[...o.mappings.values()].filter(A=>A.nullable===null).length;m&&We(a,"p",`null許容が未決：${m}項目（互換・移行用を含む）`,"structure-pending");const h=document.createElement("div");h.className="structure-tree",h.setAttribute("aria-label","構造のツリー"),a.append(h);const x=document.createElement("p");x.className="structure-filter-empty",x.hidden=!0,x.textContent="互換・移行用の構造は非表示です。表示するにはフィルターをOFFにしてください。",h.before(x);const C=document.createElement("p");C.className="structure-filter-empty",C.hidden=!0,C.setAttribute("role","status"),C.textContent="検索結果は0件です。",h.before(C);let w=null,L,I,y;const W=A=>JSON.stringify(A.kind==="attribute"?["attribute",A.conceptId,A.informationId]:["structure",A.conceptId,A.fromId??"",A.relationId??""]),R=A=>{A.classList.add("structure-selected"),A.setAttribute("aria-current","true")},E=()=>{h.querySelectorAll(".structure-selected").forEach(Z=>{Z.classList.remove("structure-selected"),Z.removeAttribute("aria-current")});const A=y&&h.contains(y)&&y.dataset.structureSelection===L?y:Array.from(h.querySelectorAll("[data-structure-selection]")).find(Z=>Z.dataset.structureSelection===L);A&&(y=A,R(A))},P=(A,Z,S="select")=>{I=A,L=W(A),y=Z,h.querySelectorAll(".structure-selected").forEach(D=>{D.classList.remove("structure-selected"),D.removeAttribute("aria-current")}),R(Z),n.select?.({...A,hideLegacy:f.checked},S)},T=(A,Z,S,D)=>{const te=o.nodes.get(A),X=document.createElement("li");X.className="structure-item",X.dataset.conceptId=A;const he=S?i.relation(S.relation.id,A):i.concept(A);he&&(X.dataset.compatibility=he.kind);const re=Object.hasOwn(o.conceptNames,A)?o.conceptNames[A]:void 0,ae=re&&typeof re=="object"&&!Array.isArray(re)?re:{},O=typeof ae.typeName=="string"&&!!ae.typeName.trim(),z=O?ae.typeName:te.name,B=O&&typeof ae.logicalName=="string"&&ae.logicalName.trim()?ae.logicalName:"",ue=we=>te.information.filter(Ee=>we||i.field(Ee.id,A)?.kind!=="legacy").flatMap(Ee=>[Ee.name,o.mappings.get(Ee.id)?.physicalName??""]),Q=we=>[te.name,z,B,te.id,...ue(we),S?.roleName??"",...S?.fieldDetails.flatMap(Ee=>[Ee.name,Ee.physicalName])??[],...S?.fields??[],S?.relation.condition??""].join(" ").toLocaleLowerCase();X.dataset.searchText=Q(!0),X.dataset.searchVisibleText=Q(!1),S&&(X.dataset.relationId=S.relation.id,X.dataset.relationDirection=S.direction);const ye=(o.edges.get(A)??[]).some(we=>we.direction==="owner"&&!!we.roleName)&&S?.direction==="reference",le=ye?A+"\0reference":A,fe=Z.has(A),ve=!!D?.has(le),ze=ve||!!D?.has(ye?A:A+"\0reference"),be=document.createElement("summary");be.className="structure-node-row",be.append(nr(S?.direction==="reference"||S?.direction==="owner"?ic:oc,S?to[S.direction]:"構造")),ta(be,he);const Se={kind:"structure",conceptId:A,...S?{fromId:S.from,relationId:S.relation.id}:{}};if(be.dataset.structureSelection=W(Se),be.addEventListener("click",()=>P(Se,be)),S&&(S.direction==="unknownOut"&&We(be,"span",to[S.direction],"structure-type"),We(be,"span",S.count,"structure-count"),be.title=`${to[S.direction]}：移動先 ${S.count}／反対側 ${S.reverseCount}${S.relation.condition?" — "+S.relation.condition:""}${S.fields.length>S.visibleFields.length?" — 物理項目："+S.fields.join("、"):""}`),S){const we=S.fieldDetails.length?S.fieldDetails:[void 0],Ee=nt=>{const ot=document.createElement("span");ot.className="structure-element",be.append(ot),We(ot,"strong",nt)};S.roleName&&we.length===1?Ee(S.roleName):(S.roleName&&Ee(S.roleName),we.forEach((nt,ot)=>{(ot||S.roleName)&&We(be,"span","／"),Ee(nt?.name?.trim()||"名前未定義")}))}else We(be,"strong",B||te.name);(fe||ze)&&We(be,"span","既出","structure-seen");const gt=(o.edges.get(A)??[]).some(we=>Vi.includes(we.direction)||we.direction==="owner"&&!!we.roleName&&!(S?.direction==="owned"&&S.relation.id===we.relation.id&&S.from===we.to)),qe=document.createElement("details");qe.className="structure-node"+(gt?"":" structure-leaf"),qe.append(be),X.append(qe);let ko=!1;const Io=new Set(Z);Io.add(A);const et=we=>{if(ko)return;ko=!0;const Ee=document.createElement("ul");Ee.className="structure-children",qe.append(Ee);for(const nt of[...Vi,"owner"]){const ot=(o.edges.get(A)??[]).filter(_e=>_e.direction===nt&&(nt!=="owner"||!!_e.roleName&&!(S?.direction==="owned"&&S.relation.id===_e.relation.id&&S.from===_e.to)));if(ot.length)for(const _e of ot)Ee.append(T(_e.to,Io,_e,we))}h.contains(qe)&&(E(),H())};return be.addEventListener("keydown",we=>{if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(we.key)||we.altKey||we.ctrlKey||we.metaKey)return;we.preventDefault(),we.stopPropagation();const Ee=Array.from(h.querySelectorAll("summary")).filter(ot=>{if(ot.closest("[hidden]"))return!1;for(let _e=ot.parentElement?.parentElement;_e&&_e!==h;_e=_e.parentElement)if(_e instanceof HTMLDetailsElement&&!_e.open)return!1;return!0}),nt=Ee.indexOf(be);we.key==="ArrowDown"?Ee[nt+1]?.focus():we.key==="ArrowUp"?Ee[nt-1]?.focus():we.key==="Home"?Ee[0]?.focus():we.key==="End"?Ee.at(-1)?.focus():we.key==="ArrowRight"&&gt?qe.open?qe.querySelector(":scope > .structure-children > li:not([hidden]) > details > summary")?.focus():(qe.open=!0,et()):we.key==="ArrowLeft"&&(qe.open&&gt?qe.open=!1:X.parentElement?.closest(".structure-item")?.querySelector(":scope > details > summary")?.focus())}),qe.addEventListener("toggle",()=>{qe.open&&et()}),D&&!ve&&!fe&&(D.add(le),qe.open=!0,et(D)),X},q=A=>{const Z=document.createElement("ul");Z.className="structure-root";const S=A?new Set:void 0;for(const D of s)Z.append(T(D,new Set,void 0,S));if(h.replaceChildren(Z),!A){const D=Z.querySelector(".structure-node");D.open=!0,D.dispatchEvent(new Event("toggle"))}E()},H=()=>{const A=p.value.trim().toLocaleLowerCase();A&&!w?(w=h.firstChild,q(!0)):!A&&w&&(h.replaceChildren(w),w=null,E());const Z=Array.from(h.querySelectorAll("[data-search-text]")).reverse(),S=new Set;for(const D of Z){const te=(f.checked?D.dataset.searchVisibleText??D.dataset.searchText:D.dataset.searchText)?.includes(A)??!1;if(D.hidden=f.checked&&D.dataset.compatibility==="legacy"||!!A&&!te&&!S.has(D),!D.hidden){const X=D.parentElement?.closest("[data-search-text]");X&&S.add(X)}}x.hidden=!!A||!f.checked||!s.every(D=>i.concept(D)?.kind==="legacy"),C.hidden=!A||Array.from(h.querySelectorAll(".structure-root > li")).some(D=>!D.hidden)};if(f.onchange=()=>{const A=h.querySelector(".structure-selected");f.checked&&A?.closest('[data-compatibility="legacy"]')?(L=void 0,I=void 0,n.clearSelection?.()):I&&n.select?.({...I,hideLegacy:f.checked},"filter"),H(),E()},u.onclick=()=>{w=null,p.value="",q(!0),H()},c.onclick=()=>{w=null,p.value="",q(!1);const A=h.querySelector(".structure-node");A&&(A.open=!1),H()},p.oninput=H,q(!1),n.autoSelect){const A=Array.from(h.querySelectorAll(".structure-root > .structure-item")).find(S=>!S.hidden),Z=A?.querySelector(":scope > details > summary");A?.dataset.conceptId&&Z&&P({kind:"structure",conceptId:A.dataset.conceptId},Z,"initial")}}const qn=["landscape","overview"],In="structure-explorer";function zd(e,t){const n=e.querySelector(".workspace"),o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const a=document.createElement("aside");a.id="design-explorer",a.setAttribute("aria-label","設計ナビゲーション"),a.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><div class="explorer-mode-tabs" role="tablist" aria-label="エクスプローラーの切替"><button type="button" role="tab" id="explorer-tab-document" aria-controls="explorer-document-panel">文章</button><button type="button" role="tab" id="explorer-tab-structure" aria-controls="explorer-structure-panel">構造</button></div><div id="explorer-document-panel" class="explorer-document-panel" role="tabpanel" aria-labelledby="explorer-tab-document"><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav></div><div id="explorer-structure-panel" class="explorer-structure-panel" role="tabpanel" aria-labelledby="explorer-tab-structure" hidden></div>',a.prepend(a.querySelector(".explorer-mode-tabs"));const l=document.createElement("div");l.className="shell-center",s.append(a,l),l.append(o,n);const u=document.createElement("div");u.className="shell-open-tabs",i.before(u),u.append(i),Dc(u);const c=document.createElement("nav");c.className="concept-tabs",c.setAttribute("aria-label","開いているサブシステムとデータ構造"),u.append(c);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),u.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),u.append(f);const d=document.createElement("section");d.id="concept-workspace",d.hidden=!0,d.setAttribute("aria-label","データ構造"),d.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',l.append(d);const p=new Map,g=new Map,m=new Map,h=document.createElement("section");h.id="states-workspace",h.hidden=!0,h.setAttribute("aria-label","状態遷移"),h.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',l.append(h);const x=document.createElement("section");x.id="tests-workspace",x.hidden=!0,x.setAttribute("aria-label","テスト仕様"),x.innerHTML='<main class="test-spec-page"></main>',l.append(x);const C=document.createElement("aside");C.id="test-related-panel",C.className="spec-related",C.setAttribute("aria-label","関連資料"),C.hidden=!0,C.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const w=document.createElement("section");w.id="empty-workspace",w.hidden=!0,w.innerHTML="<p>左の一覧から図を開いてください。</p>",l.append(w);const L=n.querySelector("#node-list-drawer");a.append(L);const I=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),W=a.querySelector(".explorer-search input"),R=a.querySelector(".explorer-groups"),E=a.querySelector("#explorer-document-panel"),P=a.querySelector("#explorer-structure-panel"),T=a.querySelector("#explorer-tab-document"),q=a.querySelector("#explorer-tab-structure"),H=d.querySelector("iframe"),A=d.querySelector(".concept-related"),Z=h.querySelector("article"),S="alder-explorer-v1:"+location.pathname,D=location.protocol==="file:"||location.origin==="null"?"*":location.origin,te=window.__alderConceptHtml;let X,he,re,ae,O={},z=[],B=[...qn],ue=new Map,Q=new Map,ge=new Map,ye=new Map,le=new Map;const fe=b=>In+":"+b,ve=b=>b===In||le.has(b),ze=b=>ge.get(b)??b,be=b=>ye.get(b)??b,Se=b=>he?.findGroup(ue.get(b??"")),gt=b=>re?.contentFor(ue.get(b)??""),qe=(b,v)=>re?.findDataExample(ue.get(b)??"",v),ko=b=>re?.examplesFor(ue.get(b)??"")??[],Io=b=>b===In?"構造エクスプローラー":le.has(b)?(X?.model.concepts.find(v=>v.id===le.get(b))?.name??b)+"・構造":qn.includes(b)?"全体図":gt(b)?.title??Se(b)?.name??O[Q.get(b)??""]?.name,et=()=>{const b=t.business(),v=b.design?.model;return v?[...v.checks,...b.relatedChecks??[]].filter(N=>N.basedOn.documentId===v.business.id):[]},we=()=>Rd(X,et()),Ee=b=>we().find(v=>v.key===(b.startsWith("decision:")?b.slice(9):b)),nt=b=>we().filter(v=>v.name===b.name).length>1?b.name+"（"+(t.business().activities.find(v=>v.id===b.activityId)?.name??"その他")+"）":b.name,ot=b=>et().some(v=>v.index.some(N=>N.activityId===b)||v.sections.some(N=>N.activityId===b)),_e=b=>new Set(we().filter(v=>v.activityId===b).flatMap(v=>v.checkIds)),Rs=b=>{const v=new Set(we().filter(N=>N.activityId===b).flatMap(N=>N.decisionExampleIds));return new Set(et().flatMap(N=>N.examples.filter(j=>v.has(j.id)).map(j=>j.guaranteeId)))},Ds=b=>{const v=_e(b),N=Rs(b);return et().some(j=>j.index.some($=>$.activityId===b&&$.checkIds.some(J=>!v.has(J)))||j.sections.some($=>$.activityId===b&&($.preamble.length>0||j.guarantees.some(J=>J.sectionId===$.id&&!N.has(J.id)))))},qa=()=>et().some(b=>b.items.some(v=>!b.index.some(N=>N.checkIds.includes(v.id)))||b.sections.some(v=>v.activityId===null)||b.notes.length>0),Wa=b=>{const v=Ee(b);return v?v.capability.testSpecification?nt(v)+"・"+(b.startsWith("decision:")?"可否":"結果"):v.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(N=>N.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(N=>N.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},So=n.querySelector("#formattedMarkdownDrawer");So&&s.append(So),s.append(A,C),Oi(a,s,S+":explorer-width","left"),Oi(A,s,S+":drawer-width"),Oi(C,s,S+":test-drawer-width");let xo=!1;const yt=t.rightDrawer??{isOpen:()=>xo,setOpen:b=>{xo=b}};let se="business",Re=!1,st=[],U="overview",rt=[],vt="",wt=[],Te="@overview",Ln,Gt=innerWidth>800,Ao=!1,Eo=!0,kt=!1,Xn,at="document",Zn=In;const It=new Map,Ct=new Map([["overview",H]]),mt=new Map,yn=new Map,vn=new Map,Ue=new Map,sn=new Map,Ot=new Set,Xe=new Set,wn=new Set,Ve=new Map;let Ae;try{if(Ae=JSON.parse(sessionStorage.getItem(S)||"null"),Ae){if(kt=Ae.overviewClosed===!0,Xn=typeof Ae.documentKey=="string"?Ae.documentKey:void 0,Gt=typeof Ae.left=="boolean"?Ae.left:Gt,at=Ae.explorerMode==="structure"?"structure":"document",Array.isArray(Ae.expanded)){Xe.clear();for(const b of Ae.expanded)typeof b=="string"&&Xe.add(b)}rt=Array.isArray(Ae.states)?Ae.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof Ae.rightOpen=="boolean"?xo=Ae.rightOpen:typeof Ae.right?.["concept:"+Ae.active]=="boolean"&&(xo=Ae.right["concept:"+Ae.active]))}}catch{}function za(){if(!(!Ae||Xn!==t.business().key||!Re)){for(const b of Array.isArray(Ae.overviewModes)?Ae.overviewModes:[])Se(b)&&Ot.add(b);for(const[b,v]of Object.entries(Ae.lastExamples??Ae.examples??{}))typeof v=="string"&&qe(b,v)&&sn.set(b,v);for(const[b,v]of Object.entries(Ae.examples??{}))typeof v=="string"&&qe(b,v)&&Ue.set(b,v);for(const[b,v]of Object.entries(Ae.selected??{}))typeof v=="string"&&z.includes(v)&&mt.set(b,v);st=[...new Set((Array.isArray(Ae.concepts)?Ae.concepts:[]).filter(b=>typeof b=="string"&&B.includes(b)))],U=st.includes(Ae.active)?Ae.active:"landscape"}}let kn;const Be=()=>{try{sessionStorage.setItem(S,JSON.stringify({documentKey:Ln,overviewClosed:kt,selected:Object.fromEntries(mt),examples:Object.fromEntries(Ue),lastExamples:Object.fromEntries(sn),overviewModes:[...Ot],left:Gt,explorerMode:at,expandedVersion:4,expanded:[...Xe],concepts:st,active:U,states:rt,specs:wt,activeSpec:Te,specExamples:Object.fromEntries(It),...t.rightDrawer?{}:{rightOpen:yt.isOpen()}}))}catch{}},rn=()=>{se==="concept"&&ve(U)?Ve.set("structure:"+U,g.get(U)?.scrollTop??0):se==="concept"&&Ve.set("drawer:"+U,A.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&yt.isOpen()&&Ot.has(U)&&Ve.set("review-overview:"+U,A.querySelector(".data-review-overview").scrollTop),se==="concept"&&Ue.has(U)&&Ve.set("example:"+U+":"+Ue.get(U),A.querySelector(".data-examples-panel").scrollTop),se==="states"&&vt&&Ve.set("state:"+vt,Z.scrollTop),se==="tests"&&Ve.set("tests:"+Te,x.querySelector(".test-spec-page").scrollTop),se==="concept"&&U==="landscape"&&Ve.set("concept:landscape",d.querySelector(".concept-review-landscape").scrollTop)};function Ze(b=!0){if(Ao)return;const v=new URL(location.href);if(v.searchParams.set("view",se),v.searchParams.delete("concept"),v.searchParams.delete("dataExample"),v.searchParams.delete("dataView"),se==="concept"&&yt.isOpen()&&Ot.has(U)?v.searchParams.set("dataView","overview"):se==="concept"&&Se(U)&&!Ue.has(U)&&v.searchParams.set("dataView","structure"),se==="concept"&&yt.isOpen()&&Ue.has(U)&&v.searchParams.set("dataExample",Ue.get(U)),se==="tests"&&It.has(Te)&&v.searchParams.set("dataExample",It.get(Te)),v.searchParams.delete("state"),v.searchParams.delete("activity"),v.searchParams.delete("object"),v.searchParams.delete("spec"),se==="concept"&&v.searchParams.set("concept",U),se==="states"&&vt&&v.searchParams.set("state",vt),se==="tests"&&v.searchParams.set("spec",Te),se==="business"){const N=t.business(),j=N.views?.find($=>$.key===N.viewKey);j?.activity?v.searchParams.set("activity",j.activity):j?.object&&v.searchParams.set("object",j.object)}v.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",v)}function Me(b,v,N){const j=document.createElement(v);return j.textContent=N,b.append(j),j}function St(b){b!==se&&(se==="business"?t.capture():rn(),se=b),n.hidden=se!=="business",d.hidden=se!=="concept",h.hidden=se!=="states",x.hidden=se!=="tests",w.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),Mt(),xt()}function jt(b,v=!0){Re&&(b==="subsystems"&&(b="landscape"),B.includes(b)&&(rn(),st.includes(b)||st.push(b),U=b,ve(b)&&(at="structure",Zn=b),St("concept"),xi(),Nt(),Be(),v&&Ze()))}function $a(){rn(),Ue.delete(U),Ot.add(U),xi(),A.querySelector(".concept-drawer-body").scrollTop=Ve.get("drawer-overview:"+U)??0,Be(),Ze()}function Ua(b,v=!0){if(b&&!qe(U,b))return;const N=!Ue.has(U),j=A.querySelector(".concept-drawer-body");N&&Ve.set("drawer-overview:"+U,j.scrollTop),rn(),Ot.delete(U),b?(Ue.set(U,b),sn.set(U,b)):Ue.delete(U),yt.setOpen(!0),xi(),N&&(j.scrollTop=0),Be(),Ze(),v&&A.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}A.querySelector(".concept-example-back").onclick=()=>{$a(),A.querySelector(".data-review-overview").focus({preventScroll:!0})};function Rn(b,v=!0){t.business().states?.some(N=>N.id===b)&&(rn(),rt.includes(b)||rt.push(b),vt=b,St("states"),_a(),Nt(),Be(),v&&Ze())}function yi(b){return b.startsWith("decision:")&&Ee(b)&&!Ee(b)?.capability.testSpecification?Ee(b).key:Ee(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&ot(b.slice(7))||b.startsWith("remaining:")&&Ds(b.slice(10))?b:t.business().activities.some(v=>v.id===b)?we().find(v=>v.activityId===b)?.key??(ot(b)?"checks:"+b:"@overview"):"@overview"}function Tt(b,v=!0){const N=t.business();if(!N.design?.model||!N.key)return;b=yi(b),se==="tests"&&b!==Te&&rn(),wt.includes(b)||wt.push(b),Te=b;const j=Ee(b);Ao||(j?.capability.testSpecification?Xe.add("tests-function-"+j.key):j?.activityId?Xe.add("tests-activity-"+j.activityId):b.startsWith("checks:")?Xe.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?Xe.add("tests-activity-"+b.slice(10)):j&&Xe.add("tests-other")),St("tests"),vi(),Nt(),xt(),Be(),v&&Ze()}function vi(){const b=t.business().design;if(!b?.model)return;const v=x.querySelector(".test-spec-page"),N=Ee(Te);if(N){const j=document.createElement("section");j.className="test-spec-sample";const $=he?.findGroup(N.groupId),J=N.samples.find(pe=>pe.id===It.get(Te))??N.samples[0],F=!!N.capability.testSpecification,ee=Te.startsWith("decision:");if(F)if(Me(j,"h2",N.name),Me(j,"h3",ee?"可否判定":"処理結果"),ee)N.decisionExampleIds.length?j.append(Nd(b,N.decisionExampleIds,et())):N.decisionCheckIds.length?j.append(Md(b,N.decisionCheckIds,et())):Me(j,"p","可否条件の記載はありません。");else{const pe=$&&J&&re?new Set(N.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(j.append(Ld(b,N.resultCheckIds,et(),pe)),$&&J&&re){Me(j,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",j.append(Le),re.renderDataExample(Le,$,J.id,He=>{Ve.set("tests:"+Te,v.scrollTop),It.set(Te,He),vi(),Be(),Ze(),x.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:N.capability.id,sampleIds:N.samples.map(He=>He.id),hideCapability:!0,hideSinglePicker:!0})}}else if($&&J&&re){const pe=document.createElement("div");pe.className="data-examples-panel test-spec-examples",j.append(pe),re.renderDataExample(pe,$,J.id,Le=>{Ve.set("tests:"+Te,v.scrollTop),It.set(Te,Le),vi(),Be(),Ze(),x.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:N.capability.id,heading:N.name,sampleIds:N.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(Cd(b,J.checkIds??[],et()))})}v.replaceChildren(j)}else if(Te==="@overview")v.replaceChildren(),Me(v,"p","左のメニューからテスト仕様を選択してください。");else if(Te.startsWith("remaining:")){const j=Te.slice(10);v.replaceChildren(er(b,j,et(),_e(j),Rs(j)))}else v.replaceChildren(er(b,Te.startsWith("checks:")?Te.slice(7):void 0,et()));Ba(N),v.scrollTop=Ve.get("tests:"+Te)??0}function Yn(b){b||(kt=!1),St("business"),b?t.openActivity(b):(kt=!1,t.openOverview()),xt(),Nt(),Ze()}function Fa(b){St("business"),t.openObject(b),xt(),Nt(),Ze()}function Ts(b){const v=t.business(),N=v.design?.model;return N?[...new Set(N.states.filter(j=>j.objectId===b&&j.basedOn.documentId===N.business.id&&j.basedOn.revision===N.business.revision).flatMap(j=>j.transitions.map($=>$.activityId)))]:[...new Set((v.design?.objectStateTransitions?.[b]?.model?.transitions??[]).flatMap(j=>j.activityId?[j.activityId]:[]))]}function Ps(b){return(t.business().states??[]).filter(v=>Ts(v.id).includes(b))}function qs(b){const v=t.business(),N=v.design?.model,j=X?.model.concepts.find($=>$.id===b);return!N||!X||!j?[]:(v.states??[]).filter($=>j.businessObjectIds.includes($.id)&&N.states.some(J=>J.objectId===$.id&&J.basedOn.documentId===N.business.id&&J.basedOn.revision===N.business.revision&&X.model.relatedStates.some(F=>F.documentId===J.id&&F.revision===J.revision)))}function wi(b,v,N="状態遷移"){if(!v.length)return;const j=document.createElement("section");j.className="shell-related-links",Me(j,"h3",N);for(const $ of v){const J=Kt(j,$.name,()=>Rn($.id));J.dataset.relatedState=$.id}b.append(j)}function Ws(b){const v=X?.model.reviewGroups.find(j=>j.id===b.groupId);if(!v)return[];const N=new Set(v.graph.nodes.map(j=>j.conceptId));return[...new Set(b.samples.flatMap(j=>j.blocks.map($=>$.card)))].filter(j=>N.has(j)&&X?.model.concepts.some($=>$.id===j))}function Kt(b,v,N){const j=document.createElement("button");return j.type="button",j.className="shell-evidence",Me(j,"span",v),j.onclick=N,b.append(j),j}function ki(b,v){const N=v.filter($=>$.capability.testSpecification);if(!N.length)return;const j=document.createElement("section");j.className="shell-test-links",Me(j,"h3","テスト仕様書");for(const $ of N)for(const[J,F]of[["decision:","可否判定"],["","処理結果"]]){const ee=J+$.key,pe=Kt(j,nt($)+"・"+F,()=>Tt(ee));pe.dataset.relatedSpec=ee}b.append(j)}function Va(b,v){const N=we().filter(ee=>ee.activityId===v&&ee.capability.testSpecification),j=X?.model.presentation.activityViews,$=Array.isArray(j)?j.find(ee=>ee&&typeof ee=="object"&&ee.activityId===v):void 0,J=Array.isArray($?.uncreatedTestSections)?$.uncreatedTestSections:[],F=b.querySelectorAll("[data-business-result],[data-business-exception]");for(const ee of Array.from(F)){const pe=ee.dataset.businessException,Le=pe?"exception":"result",He=pe??"result",Ge=N.flatMap(ct=>ct.businessSections.filter(qt=>qt.kind===Le&&(Le==="result"||qt.exceptionId===pe)).flatMap(qt=>qt.pages.filter(G=>G==="decision"?ct.decisionCheckIds.length||ct.decisionExampleIds.length:ct.resultCheckIds.length||ct.samples.length).map(G=>({target:ct,page:G})))),Pt=document.createElement("section");Pt.className="shell-section-links",Pt.setAttribute("aria-label","テスト仕様書");const ht=new Set;for(const{target:ct,page:qt}of Ge){const G=(qt==="decision"?"decision:":"")+ct.key;if(ht.has(G))continue;ht.add(G);const Oe=Kt(Pt,nt(ct)+"・"+(qt==="decision"?"可否判定":"処理結果"),()=>Tt(G));Oe.dataset.relatedSpec=G}if(!ht.size){const ct=Me(Pt,"p",J.includes(He)?"テスト仕様書未作成":"テスト仕様書との対応未確認");ct.className="shell-spec-warning"}ee.after(Pt)}ki(b,N.filter(ee=>!ee.businessSections.length))}function Ba(b){const v=C.querySelector(".spec-related-content");if(v.replaceChildren(),!b?.capability.testSpecification)return;const N=t.business().activities.find(J=>J.id===b.activityId),j=he?.findGroup(b.groupId);if(N){Me(v,"h3","Activity");const J=Kt(v,N.name,()=>Yn(N.id));J.dataset.relatedActivity=N.id}if(j){Me(v,"h3","概念モデル");const J=Kt(v,j.name,()=>jt(ze(j.id)));J.dataset.relatedGroup=j.id}const $=Ws(b);if($.length){Me(v,"h3","概念");for(const J of $){const F=X.model.concepts.find(pe=>pe.id===J),ee=Kt(v,F.name,()=>jt(be(J)));ee.dataset.relatedConcept=J}}b.activityId&&wi(v,Ps(b.activityId),"状態遷移（同じ Activity）")}function Ha(b,v){Me(b,"h3","Activity");const N=t.business(),j=Se(U),$=X?.model.concepts.find(F=>F.id===v),J=j?.concepts[v]?.sourceActivities??j?.activities??$?.activityLinks.filter(F=>F.uses.includes("生成")).map(F=>F.activityId)??[];for(const F of J){const ee=N.activities.find(Le=>Le.id===F);if(!ee)continue;const pe=document.createElement("button");pe.className="shell-evidence",Me(pe,"span",ee.name),pe.title=ee.name+"を業務タブで開く",pe.setAttribute("aria-label",pe.title),pe.onclick=()=>Yn(ee.id),b.append(pe)}}function Ii(b){const v=Se(b);return v?he?.graph(v.id):b==="overview"?he?.overviewGraph():void 0}function zs(b){const v=yn.get(U),N=v?Ii(U)?.tables[v]:void 0;return N?.conceptId===b?N:void 0}function Ga(b,v){const N=zs(v)??Se(U)?.concepts[v]??{...O[v],sources:void 0};b.replaceChildren(),Me(b,"p",N.note),Me(b,"h3","持つ情報");const j=document.createElement("ul");for(const[,$]of N.fields)Me(j,"li",$);if(b.append(j),N.sources?.length){Me(b,"h3","情報の出所・対象時点");const $=document.createElement("ul");for(const J of N.sources)Me($,"li",J);b.append($)}Ha(b,v),ki(b,we().filter($=>Ws($).includes(v))),wi(b,qs(v))}function Si(b){const v=A.querySelector(".shell-heading strong");v.textContent=b,A.setAttribute("aria-label",b)}function $s(b=!1){Se(U)&&(mt.delete(U),yn.delete(U),vn.delete(U),b||Ct.get(U)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},D),Co(),Mt(),A.querySelector(".concept-drawer-body").scrollTop=0,Be())}A.querySelector(".concept-selection-clear").onclick=()=>{$s(),Ue.has(U)?A.querySelector(".concept-example-back").focus({preventScroll:!0}):A.querySelector(".data-review-overview").focus({preventScroll:!0})};function Co(){const b=A.querySelector(".concept-related-content");if(ve(U))return;A.querySelector(".concept-selection").hidden=!!Se(U)&&!mt.has(U)&&!vn.has(U),A.querySelector(".concept-selection>h2").hidden=!Se(U),A.querySelector(".concept-selection-clear").hidden=!Se(U);const v=vn.get(U);if(v&&ae){const J=ae.describe(b,{kind:"group",id:v});Si(J);return}if(U==="landscape"&&kn){b.replaceChildren();for(const[J,F]of ae.sections){Me(b,"h3",J);const ee=document.createElement("ul");for(const pe of F)Me(ee,"li",pe);b.append(ee)}Si("サブシステムの情報");return}const N=mt.get(U),j=Se(U),$=Re&&N?zs(N)?.name??j?.concepts[N]?.name??O[N].name:j?.name??"データ構造の情報";Si($),Re&&N?Ga(b,N):(b.replaceChildren(),j||Me(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function Oo(b,v=!1){const N=g.get(b);if(!N||!X)return;const j=N.querySelector(".structure-detail-content");na(j,X.model,m.get(b),$=>{m.set(b,$),Ve.set("structure:"+b,0),Oo(b,!0)}),v&&(N.scrollTop=0)}function Us(b){if(!(!X||!Re||!ve(b))){if(!g.has(b)){const v=document.createElement("article");v.className="structure-detail-page",v.hidden=se!=="concept"||U!==b,v.setAttribute("aria-label","構造の詳細"),Me(v,"h1","構造の詳細");const N=document.createElement("div");N.className="structure-detail-content",v.append(N),d.querySelector(".concept-main").append(v),g.set(b,v)}if(!p.has(b)){const v=document.createElement("article");v.setAttribute("aria-label","構造エクスプローラー"),P.append(v),p.set(b,v),Wd(v,X.model,{rootId:le.get(b),autoSelect:se==="concept"&&U===b&&!m.has(b),select:(N,j)=>{m.set(b,N),j==="select"&&Ve.set("structure:"+b,0),j==="select"&&(se!=="concept"||U!==b)?jt(b):se==="concept"&&U===b&&Oo(b,j!=="filter")},clearSelection:()=>{m.delete(b),se==="concept"&&U===b&&Oo(b)}})}}}function Fs(b){b.onload=()=>{Hs(),b.contentDocument&&(_s(b.contentDocument),Xs(b.contentDocument));const v=b.dataset.conceptView??"overview";if(!he||!X)return;const N=Se(v),j=N?he.graph(N.id):v==="overview"?he.overviewGraph():{ids:z,edges:he.edges,tables:O};b.contentWindow?.postMessage({type:"alder-concept-data",graph:j,focus:Q.get(v),viewKey:v,documentKey:Ln??X.model.id,clearSelectionOnBackground:!!N},D);const $=mt.get(v);$&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:$},D)}}Fs(H),H.dataset.conceptView="overview";function Ka(){A.querySelector(".concept-page-details").hidden=!0,A.querySelector(".concept-example-back").hidden=!0;const b=A.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const v=A.querySelector(".data-examples-panel");v.hidden=!0,v.replaceChildren(),delete v.dataset.dataExample,kn?.root.remove(),kn=void 0;for(const[N,j]of Ct)N!=="overview"&&(j.remove(),Ct.delete(N));for(const N of p.values())N.remove();for(const N of g.values())N.remove();p.clear(),g.clear(),m.clear(),Zn=In,H.removeAttribute("src"),H.removeAttribute("srcdoc"),mt.clear(),yn.clear(),vn.clear()}function xi(){d.setAttribute("aria-label",U==="landscape"||Se(U)?"サブシステム":"データ構造"),d.querySelector(".concept-empty").hidden=Re;const b=d.querySelector(".concept-review-landscape"),v=Se(U),N=A.querySelector(".concept-page-details"),j=A.querySelector(".data-review-overview"),$=A.querySelector(".data-examples-panel");if(N.hidden=!Re||!v,j.hidden=!Re||!v||Ue.has(U),$.hidden=!Re||!v||!Ue.has(U),A.querySelector(".concept-example-back").hidden=$.hidden,Re&&v){const F=we();$c(j,v,re,(pe,Le)=>{const He=tr(F,v.id,pe,Le);if(He)return{kind:He.kind,open:()=>{const Ge=tr(we(),v.id,pe,Le);Ge&&(Ge.sampleId?It.set(Ge.key,Ge.sampleId):It.delete(Ge.key),Tt(Ge.key))}}},pe=>Yn(pe),t.business().activities),ki(j,F.filter(pe=>pe.groupId===v.id));const ee=Ue.get(U)??sn.get(U)??ko(U)[0]?.id;ee&&re.renderDataExample($,v,ee,pe=>Ua(pe)),j.scrollTop=Ve.get("review-overview:"+U)??0,$.scrollTop=Ve.get("example:"+U+":"+ee)??0}b.hidden=!Re||!qn.includes(U),Re&&ve(U)&&(Us(U),Oo(U));for(const[F,ee]of g)ee.hidden=!Re||F!==U;for(const[F,ee]of p)ee.hidden=!Re||F!==Zn;if(Re&&qn.includes(U)&&(U==="landscape"&&!kn&&(kn=Gc(document,X,Ln??X.model.id,F=>jt(ze(F)))),zc(b,kn?.root,U==="overview"?"graph":"overview"),U==="landscape"&&kn?.restore()),Re&&U!=="landscape"&&!ve(U)&&!Ct.has(U)){const F=document.createElement("iframe");F.className="concept-frame",F.dataset.conceptView=U,F.title=v?v.name+"のデータ構造":O[Q.get(U)].name+"と隣接する概念",F.hidden=!0,Ct.set(U,F);const ee=Q.get(U);ee&&mt.set(U,mt.get(U)??ee),Fs(F),d.querySelector(".concept-main").append(F)}for(const[F,ee]of Ct)ee.hidden=!Re||F!==U,Re&&F===U&&!ee.hasAttribute("src")&&!ee.hasAttribute("srcdoc")&&(te?ee.srcdoc=te:ee.src=new URL("concept.html?view=overview"+(Se(F)?"&group="+encodeURIComponent(Se(F).id):F==="overview"?"":"&focus="+encodeURIComponent(Q.get(F))),document.baseURI).href);const J=mt.get(U);if(J&&Ct.get(U)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:J},D),Co(),Mt(),ve(U)){const F=g.get(U);F&&(F.scrollTop=Ve.get("structure:"+U)??0)}else A.querySelector(".concept-drawer-body").scrollTop=Ve.get("drawer:"+U)??0}function Dn(){const b=t.business(),v=b.views?.find(N=>N.activity!==void 0||N.object!==void 0||!kt);v?(St("business"),t.activateView(v.key)):st.length?jt(st.at(-1),!1):rt.length?Rn(rt.at(-1),!1):wt.length?Tt(wt.at(-1),!1):St("empty")}function Ja(){if(kt=!0,se==="business"){const b=t.business().views?.find(v=>v.key===t.business().viewKey);!b?.activity&&!b?.object&&Dn()}Nt(),xt(),Be(),Ze(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function _a(){Z.replaceChildren();const b=t.business().states?.find(ee=>ee.id===vt);if(!b)return;const v=t.statePanel(b.id);v?Z.append(v):Me(Z,"p","この対象の状態遷移は未定義です。");const N=C.querySelector(".spec-related-content");N.replaceChildren();const j=Ts(b.id),$=t.business().activities.filter(ee=>j.includes(ee.id));if($.length){Me(N,"h3","Activity");for(const ee of $){const pe=Kt(N,ee.name,()=>Yn(ee.id));pe.dataset.relatedActivity=ee.id}}const J=X?.model.concepts.filter(ee=>qs(ee.id).some(pe=>pe.id===b.id))??[];if(J.length){Me(N,"h3","概念");for(const ee of J){const pe=Kt(N,ee.name,()=>jt(be(ee.id)));pe.dataset.relatedConcept=ee.id}}const F=we().filter(ee=>ee.activityId&&j.includes(ee.activityId)&&ee.capability.testSpecification);if(F.length){Me(N,"h3","Activity に関連するテスト仕様書");for(const ee of F)for(const[pe,Le]of[["decision:","可否判定"],["","処理結果"]]){const He=pe+ee.key,Ge=Kt(N,nt(ee)+"・"+Le,()=>Tt(He));Ge.dataset.relatedSpec=He}}Z.scrollTop=Ve.get("state:"+vt)??0}let Ai="";function Nt(){for(const j of Array.from(i.querySelectorAll(".tab"))){const $=t.business().views?.find(F=>F.key===j.dataset.key);j.hidden=kt&&$?.activity===void 0&&$?.object===void 0;const J=!j.hidden&&se==="business"&&j.dataset.key===t.business().viewKey;j.classList.toggle("active",J),j.querySelector("button")?.setAttribute("aria-current",String(J))}const b=(j,$,J)=>{j.replaceChildren();for(const F of $){const ee=J==="concept"?Io(F):t.business().states?.find(ht=>ht.id===F)?.name??F,pe=se===J&&F===(J==="concept"?U:vt),Le=document.createElement("div");Le.className="tab"+(pe?" active":"");const He=J==="concept"&&(F==="landscape"||Se(F))?"subsystems":J;Le.dataset.viewKind=He;const Ge=document.createElement("button");Ge.id=(J==="concept"?"concept-tab-":"state-tab-")+F,Wi(Ge,He,ee),Ge.setAttribute("aria-current",String(pe)),Ge.onclick=()=>J==="concept"?jt(F):Rn(F),Le.append(Ge);const Pt=zi((He==="subsystems"?"サブシステム：":J==="concept"?"データ構造：":"状態遷移：")+ee+"のタブを閉じる");Pt.onclick=()=>{rn(),J==="concept"?(st=st.filter(ht=>ht!==F),F!=="overview"&&(Ct.get(F)?.remove(),Ct.delete(F)),mt.delete(F),yn.delete(F),vn.delete(F),Ue.delete(F),sn.delete(F),Ot.delete(F),se===J&&U===F&&(st.length?jt(st.at(-1),!1):Dn())):(rt=rt.filter(ht=>ht!==F),se===J&&vt===F&&(rt.length?Rn(rt.at(-1),!1):Dn())),Nt(),xt(),Be(),Ze(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(Pt),j.append(Le)}};b(c,st,"concept"),b(r,rt,"states"),f.replaceChildren();for(const j of wt){const $=Wa(j),J=document.createElement("div");J.className="tab"+(se==="tests"&&j===Te?" active":""),J.dataset.viewKind="tests";const F=document.createElement("button");F.id="spec-tab-"+j,Wi(F,"tests",$),F.setAttribute("aria-current",String(se==="tests"&&j===Te)),F.onclick=()=>Tt(j);const ee=zi("テスト仕様："+$+"のタブを閉じる");ee.onclick=()=>{wt=wt.filter(pe=>pe!==j),se==="tests"&&Te===j&&(wt.length?Tt(wt.at(-1),!1):Dn()),Nt(),xt(),Be(),Ze()},J.append(F,ee),f.append(J)}const v=u.querySelector(".tab.active:not([hidden])"),N=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+U:se==="states"?"states:"+vt:se==="tests"?"tests:"+Te:"";v?(N!==Ai&&Tc(u,v),Ai=N):Ai=""}function Xa(){innerWidth<=800&&jo(!1)}function xt(){const b=R.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,v=R.scrollTop,N=t.business(),j=W.value.trim().toLocaleLowerCase();R.replaceChildren();const $=(G,Oe,dt)=>({kind:"item",id:G,name:Oe,key:dt}),J=(G,Oe,dt)=>({kind:"group",id:G,name:Oe,children:dt}),F=we(),ee=G=>$(G.key,G.name,"tests:"+G.key),pe=F.filter(G=>G.capability.testSpecification),Le=F.filter(G=>!G.capability.testSpecification),He=pe.map(G=>J("tests-function-"+G.key,nt(G),[$("decision:"+G.key,"可否判定","tests:decision:"+G.key),$(G.key,"処理結果","tests:"+G.key)]));for(const G of N.activities){const Oe=Le.filter(it=>it.activityId===G.id).map(ee),dt=(_e(G.id).size?"remaining:":"checks:")+G.id;Ds(G.id)&&Oe.push($(dt,"その他","tests:"+dt)),Oe.length&&He.push(J("tests-activity-"+G.id,G.name,Oe))}const Ge=Le.filter(G=>!G.activityId);Ge.length&&He.push(J("tests-other","その他",Ge.map(ee))),qa()&&He.push($("@unassigned","未割当","tests:@unassigned"));const Pt=[{id:"business",label:"業務設計",items:[$("overview","全体図","business:overview"),J("business-activity","Activity",N.activities.map(G=>$(G.id,G.name,"business:"+G.id))),J("business-object","Object",(N.objects??[]).map(G=>$(G.id,G.name,"object:"+G.id)))]},{id:"states",label:"状態遷移",items:(N.states??[]).map(G=>$(G.id,G.name,"states:"+G.id))},{id:"subsystems",label:"サブシステム",items:X?.model.subsystems.length?[$("landscape","全体図","concept:landscape"),...X.model.subsystems.map(G=>J("subsystem-"+G.id,G.name.replace(/サブシステム$/,""),X.model.reviewGroups.filter(Oe=>Oe.subsystemId===G.id).map(Oe=>$(ze(Oe.id),Oe.title,"concept:"+ze(Oe.id)))))]:[]},{id:"concept",label:"データ構造",items:Re&&z.length?[$("overview","全体図","concept:overview"),J("concept-relations","概念",z.map(G=>$(be(G),O[G].name,"concept:"+be(G))))]:[]},{id:"tests",label:"テスト仕様",items:N.design?.model&&(F.length||et().length)?He:[]}];let ht=0;const ct=(G,Oe,dt)=>{const it=document.createElement("button");it.className="explorer-item"+(dt?" explorer-item-nested":""),it.dataset.explorerKey=G.key,it.textContent=G.name;const Ye=N.views?.find(Ke=>Ke.key===N.viewKey);return se===(Oe.id==="subsystems"?"concept":Oe.id)&&(["concept","subsystems"].includes(Oe.id)?G.id===U:Oe.id==="states"?G.id===vt:Oe.id==="tests"?G.id===Te:G.key.startsWith("object:")?Ye?.object===G.id:G.id==="overview"?!kt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===G.id)&&it.setAttribute("aria-current","page"),it.disabled=Oe.id==="business"&&!N.key,it.onclick=()=>{L.hidden||t.closeLegacyList(),Oe.id==="business"?G.key.startsWith("object:")?Fa(G.id):Yn(G.id==="overview"?void 0:G.id):Oe.id==="concept"||Oe.id==="subsystems"?jt(G.id):Oe.id==="tests"?Tt(G.id):Rn(G.id),Xa()},it},qt=(G,Oe,dt,it=!1)=>{const Ye=document.createElement("button"),Wt=j?!wn.has(G):Xe.has(G);return Ye.className=(dt?"explorer-subparent":"explorer-parent")+(it?" explorer-pending":""),Ye.dataset.explorerKey="group:"+G,Me(Ye,"span",Oe).className="explorer-parent-label",it?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(Wt)),Ye.setAttribute("aria-controls","explorer-"+G),Ye.append(Rc(Wt)),Ye.onclick=()=>{j?wn.has(G)?wn.delete(G):wn.add(G):(Xe.has(G)?Xe.delete(G):Xe.add(G),Be()),xt()},Ye)};for(const G of Pt){const Oe=G.items.flatMap(Ke=>{if(Ke.kind==="item")return!j||(G.label+" "+Ke.name).toLocaleLowerCase().includes(j)?[Ke]:[];const an=j?Ke.children.filter(Ci=>(G.label+" "+Ke.name+" "+Ci.name).toLocaleLowerCase().includes(j)):Ke.children;return!j||an.length?[{...Ke,children:an}]:[]});if(j&&!Oe.length)continue;const dt=G.id!=="business"&&!G.items.length,it=document.createElement("section"),Ye=qt(G.id,G.label,!1,dt),Wt=document.createElement("div");Wt.id="explorer-"+G.id,Wt.hidden=dt||(j?wn.has(G.id):!Xe.has(G.id));for(const Ke of Oe){if(Ke.kind==="item"){Wt.append(ct(Ke,G,0)),ht++;continue}const an=document.createElement("div");an.id="explorer-"+Ke.id,an.hidden=j?wn.has(Ke.id):!Xe.has(Ke.id),Wt.append(qt(Ke.id,Ke.name,!0),an);for(const Ci of Ke.children)an.append(ct(Ci,G,1)),ht++;!Ke.children.length&&!j&&(Me(an,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Oe.length&&!dt&&(Me(Wt,"p","項目がありません。").className="explorer-empty"),it.append(Ye,Wt),R.append(it)}j&&!ht&&(Me(R,"p","該当する項目はありません。").className="explorer-empty"),R.scrollTop=v,b&&Array.from(R.querySelectorAll("[data-explorer-key]")).find(G=>G.dataset.explorerKey===b)?.focus({preventScroll:!0})}function Vs(){!Re&&at==="structure"&&(at="document"),q.disabled=!Re,T.setAttribute("aria-selected",String(at==="document")),q.setAttribute("aria-selected",String(at==="structure")),T.tabIndex=at==="document"?0:-1,q.tabIndex=at==="structure"?0:-1,E.hidden=at!=="document",P.hidden=at!=="structure",at==="structure"&&Us(Zn);for(const[b,v]of p)v.hidden=b!==Zn}function Bs(b){b==="structure"&&!Re||(at=b,Vs(),Be())}T.onclick=()=>Bs("document"),q.onclick=()=>Bs("structure"),a.querySelector(".explorer-mode-tabs").addEventListener("keydown",b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;const v=b.key==="Home"||b.key==="ArrowLeft"?T:q;v.disabled||(b.preventDefault(),v.click(),v.focus({preventScroll:!0}))});function jo(b){Gt=b,Mt(),Be(),(b?a.querySelector(".shell-heading button"):I).focus({preventScroll:!0})}I.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),jo(!Gt)},!0),a.querySelector(".shell-heading button").onclick=()=>jo(!1),W.oninput=()=>{wn.clear(),xt()},a.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&L.hidden&&(b.preventDefault(),b.stopPropagation(),jo(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&R.contains(document.activeElement)){const v=Array.from(R.querySelectorAll("button")).filter($=>!$.disabled&&!$.closest("[hidden]")),N=v.indexOf(document.activeElement),j=v[N+(b.key==="ArrowDown"?1:-1)];j&&(b.preventDefault(),j.focus())}}),y.addEventListener("click",b=>{se!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),!(se==="concept"&&ve(U))&&(se==="concept"||se==="states"||se==="tests"&&Ee(Te)?.capability.testSpecification)&&(yt.setOpen(!yt.isOpen()),Mt(),Be(),Ze(!1)))},!0),A.querySelector(".shell-heading button").onclick=()=>{yt.setOpen(!1),Mt(),Be(),Ze(!1),y.focus({preventScroll:!0})},C.querySelector(".shell-heading button").onclick=()=>{yt.setOpen(!1),Mt(),Be(),Ze(!1),y.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const v=Array.from(Ct).find(([,j])=>b.source===j.contentWindow);if(!v)return;if(b.data?.type==="alder-concept-rendered"){v[1].contentDocument&&(_s(v[1].contentDocument),Xs(v[1].contentDocument));return}if(se!=="concept"||v[0]!==U)return;const N=Se(U);if(b.data?.type==="alder-concept-clear-selection"){N&&$s(!0);return}if(b.data?.type==="alder-concept-subsystem"){if(!Ii(U)?.regions.some(j=>j.id===b.data.id))return;mt.delete(U),yn.delete(U),vn.set(U,b.data.id),Co(),Mt(),Be();return}if(!(!z.includes(b.data?.id)||N&&!N.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){jt(be(b.data.id));return}b.data.type==="alder-concept-select"&&(vn.delete(U),mt.set(U,b.data.id),(typeof b.data.viewId=="string"?Ii(U)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?yn.set(U,b.data.viewId):yn.delete(U),innerWidth<=800&&(Gt=!1),Co(),Mt(),Be())}});function Hs(){const b=getComputedStyle(document.documentElement);for(const v of Ct.values()){const N=v.contentDocument?.documentElement;if(N){N.dataset.theme=document.documentElement.dataset.theme??"light";for(const j of["--bg","--panel","--fg","--line","--subtle","--select"])N.style.setProperty(j,b.getPropertyValue(j))}}}function Mt(){!L.hidden&&se==="business"&&(Gt=!0),a.hidden=!Gt,I.disabled=!1,I.setAttribute("aria-controls","design-explorer"),I.setAttribute("aria-label","ナビゲーションを開閉"),I.setAttribute("aria-expanded",String(Gt)),Vs();const b=yt.isReady?.()??!0,v=se==="concept"&&ve(U);A.hidden=se!=="concept"||v||!Re||!b||!yt.isOpen();const N=!!Ee(Te)?.capability.testSpecification;if(C.hidden=!(se==="states"||se==="tests"&&N)||!b||!yt.isOpen(),So&&se!=="business"&&(So.hidden=!0),se==="concept")y.disabled=v||!Re||!b,v?(y.removeAttribute("aria-controls"),y.setAttribute("aria-label","構造の詳細は中央に表示")):(y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉")),y.setAttribute("aria-expanded",String(!A.hidden));else if(se==="business"){const J=t.business();y.disabled=!b||!J.key||!J.viewKey,y.setAttribute("aria-controls","formattedMarkdownDrawer"),y.setAttribute("aria-label","業務内容開閉")}else se==="states"||se==="tests"&&N?(y.disabled=!b,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!C.hidden))):(se==="tests"||se==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const j=o.querySelector("#document-actions");j&&(j.hidden=se!=="business");const $=o.querySelector("#document-actions-toggle");$&&se!=="business"&&($.hidden=!0),Hs(),Ei()}function Ei(){const b=o.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(Ei);b.observe(o),b.observe(e.querySelector("header"))}window.addEventListener("resize",Ei);function Gs(){rn(),Ao=!0;try{const b=new URL(location.href).searchParams;if(se==="concept"&&b.get("view")==="concept"&&b.get("concept")===U&&!Ue.has(U)&&qe(U,b.get("dataExample"))&&Ve.set("drawer-overview:"+U,A.querySelector(".concept-drawer-body").scrollTop),Re||(Ot.clear(),Ue.clear(),sn.clear(),st=[],U="overview",H.removeAttribute("src"),H.removeAttribute("srcdoc")),b.get("view")==="concept"){const v=Re&&B.includes(b.get("concept")??"")?b.get("concept"):"landscape",N=b.get("dataExample");Re&&Se(v)&&b.get("dataView")==="overview"&&!qe(v,N)?(Ot.add(v),Ue.delete(v)):(Ot.delete(v),Re&&qe(v,N)?(Ue.set(v,N),sn.set(v,N)):Ue.delete(v)),jt(v,!1)}else if(b.get("view")==="states")t.business().states?.some(v=>v.id===b.get("state"))?Rn(b.get("state"),!1):Dn();else if(b.get("view")==="tests"){const v=yi(b.get("spec")??"@overview"),N=b.get("dataExample"),j=Ee(v);j&&N&&j.samples.some($=>$.id===N)?It.set(v,N):j&&It.delete(v),Tt(v,!1)}else if(b.get("view")==="empty")St("empty");else if(St("business"),t.business().key){const v=b.get("activity"),N=b.get("object"),j=t.business(),$=j.views?.find(J=>J.key===j.viewKey);v&&j.activities.some(J=>J.id===v)?$?.activity!==v&&t.openActivity(v):N&&j.objects?.some(J=>J.id===N)?$?.object!==N&&t.openObject(N):(kt=!1,(!$||$.activity!==void 0||$.object!==void 0)&&t.openOverview())}Nt(),xt()}finally{Ao=!1}}return window.addEventListener("popstate",Gs),{closeBusinessOverview:Ja,reopenBusinessOverview(){kt=!1},activateBusiness(){St("business")},businessActivated(){St("business"),Nt(),xt(),Ze()},syncChrome:Mt,appendActivityTestLinks(b,v){Va(b,v),wi(b,Ps(v))},openRelatedChecks(b){Xe.add("tests"),Tt(b&&ot(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),v=b.concept,N=!!(Ln&&b.key!==Ln||Eo&&Xn&&b.key&&b.key!==Xn),j=X?.model!==v?.model||X?.business!==v?.business;if((N||j&&X)&&(at="document",x.querySelector(".test-spec-page").replaceChildren(),C.querySelector(".spec-related-content").replaceChildren(),A.querySelector(".concept-related-content").replaceChildren(),kt=!1,st=[],rt=[],wt=[],U="overview",vt="",Te="@overview",It.clear(),Ve.clear(),Ot.clear(),Ue.clear(),sn.clear(),Ka(),se!=="business"&&St("business"),N&&!Eo&&Ze(!1)),j){X=v,he=v?qc(v):void 0,re=v?Jc(v):void 0,ae=v?Uc(v):void 0,Re=!!v,O=he?.tables??{},z=Object.keys(O),le=new Map((v?.model.concepts??[]).map(F=>[fe(F.id),F.id]));const $=he?.groups.map(F=>F.id)??[],J=new Set([...qn,"subsystems",In,...le.keys()]);if(ge=new Map($.map(F=>[F,J.has(F)||z.includes(F)?"group:"+F:F])),ye=new Map(z.map(F=>[F,J.has(F)||$.includes(F)?"concept:"+F:F])),ue=new Map([...ge].map(([F,ee])=>[ee,F])),Q=new Map([...ye].map(([F,ee])=>[ee,F])),B=[...qn,In,...le.keys(),...ue.keys(),...Q.keys()],Array.isArray(Ae?.expanded)&&Ae.expandedVersion!==4){Xe.add("subsystems"),Xe.add("concept-relations");for(const F of v?.model.subsystems??[])Xe.add("subsystem-"+F.id)}}if(Ln=b.key,rt=rt.filter($=>b.states?.some(J=>J.id===$)),se==="business"&&kt&&b.views?.find($=>$.key===b.viewKey)?.activity===void 0&&b.views?.find($=>$.key===b.viewKey)?.object===void 0&&Dn(),Eo&&b.key){if(za(),Xn===b.key){Array.isArray(Ae?.specs)&&(wt=[...new Set(Ae.specs.filter($=>typeof $=="string").map($=>yi($)))]);for(const[$,J]of Object.entries(Ae?.specExamples??{})){const F=Ee($);typeof J=="string"&&F?.capability.samples.some(ee=>ee.id===J)&&It.set($,J)}}Eo=!1,Gs()}xt(),Nt(),Mt(),N&&Be()}}}class Hi{tabs=new WeakMap;router;constructor(t=Pi){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const a=JSON.stringify([o.map(d=>[d.id,d.width,d.height]),i.map(d=>[d.kind,d.from,d.to,d.label]),s]),l=this.tabs.get(t),u=!l||l.design!==n||l.structure!==a,c=new Set(o.filter(d=>{const p=l?.nodes.get(d.id);return!p||p.x!==d.x||p.y!==d.y}).map(d=>d.id)),r=new Set(o.map(d=>d.id)),f=u?new Array(i.length):l.routes.slice();if(i.forEach((d,p)=>{!u&&!c.has(d.from)&&!c.has(d.to)||(f[p]=r.has(d.from)&&r.has(d.to)?this.router({from:d.from,to:d.to,index:p,nodes:o,kind:d.kind,matrix:s?.[p],labels:s?.[p]?[]:[...f.flatMap((g,m)=>g&&m<p?[{id:String(m),x:g.label[0]-Math.max(30,i[m].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[m].label.length*12),height:18}]:[])],wires:s?.[p]?[]:f.flatMap((g,m)=>g&&m<p?[g.points]:[]),labelWidth:Math.max(30,d.label.length*12),labelHeight:18}):void 0)}),s){const d=[],p=new Map,g=f.map((m,h)=>h).sort((m,h)=>Number(s[m].returning)-Number(s[h].returning));for(const m of g){const h=f[m];if(!h)continue;const x=o.find(y=>y.id===i[m].from),C=Math.max(30,i[m].label.length*12),w=s[m].returning?[Math.max(...h.points.map(y=>y[0]))+8+C/2,h.points[0][1]]:[x.x+x.width*.125+8+C/2,rc(x.y+x.height,s[m].captionLane*Fr)+9],L=Vr(i[m],m,s[m]),I=p.get(L)??qi(w,C,18,o,d);(I[0]!==h.label[0]||I[1]!==h.label[1])&&(f[m]={...h,label:I}),p.has(L)||(p.set(L,I),d.push({id:String(m),x:I[0]-C/2,y:I[1]-9,width:C,height:18}))}}return this.tabs.set(t,{design:n,structure:a,nodes:new Map(o.map(d=>[d.id,{...d}])),routes:f}),f}}function $d(e,t,n,o){const i=(f,d,p)=>(d[0]-f[0])*(p[1]-f[1])-(d[1]-f[1])*(p[0]-f[0]),s=i(e,t,n),a=i(e,t,o),l=i(n,o,e),u=i(n,o,t),c=1e-6;if(s*a<-c&&l*u<-c)return!0;if(Math.max(Math.abs(s),Math.abs(a),Math.abs(l),Math.abs(u))>c)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],o[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],o[r]))>.1}function Ud(e,t,n,o,i=[]){const s=e.x+e.width,a=24,l=e.y+e.height,u=s-8-(2*(n.count-n.index)-1)*a,c=t.filter(C=>C.id!==e.id);let r;for(const C of[0,-24,24,-48,48,-72,72])for(const w of[0,16,32,64,128,256]){const L=[u+C,l],I=[L[0]+a,l];if(L[0]<e.x+8||I[0]>s-8)continue;const y=l+n.depth+w,W=Math.min(12,(I[0]-L[0])/2,(y-l)/2),R=[L];let E=`M${L}`;const P=A=>{E+=` L${A}`,R.push(A)},T=(A,Z)=>{const S=R.at(-1);E+=` Q${A} ${Z}`;for(let D=1;D<=4;D++){const te=D/4,X=1-te;R.push([X*X*S[0]+2*X*te*A[0]+te*te*Z[0],X*X*S[1]+2*X*te*A[1]+te*te*Z[1]])}};P([L[0],y-W]),T([L[0],y],[L[0]+W,y]),P([I[0]-W,y]),T([I[0],y],[I[0],y-W]),P(I);const q=ac(R,c,.3),H=i.filter(A=>R.slice(1).some((Z,S)=>A.slice(1).some((D,te)=>$d(R[S],Z,A[te],D)))).length;if((!r||q<r.collisions||q===r.collisions&&H<r.wireCollisions)&&(r={path:E,points:R,collisions:q,wireCollisions:H,low:y,extra:w,shift:C}),q===0&&H===0)break}const{path:f,points:d,collisions:p,wireCollisions:g,low:m,extra:h,shift:x}=r;return{path:f,points:d,label:[Math.max(s+8,n.labelLeft)+o/2,m],bounds:{right:Math.max(...d.map(C=>C[0])),bottom:Math.max(...d.map(C=>C[1]))},collisions:p+g,rerouted:h>0||x!==0,fallback:p+g>0}}function Fd(e,t=as()){const n="http://www.w3.org/2000/svg",o=(O,z={})=>{const B=document.createElementNS(n,O);for(const[ue,Q]of Object.entries(z))B.setAttribute(ue,Q);return B},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(O=>[O]),a=[...new Set(["@new",...e.states,...s.map(O=>O[0].to)])],l={nodes:a.map(O=>({id:O,type:"business",name:i[O]??O,scope:!0})),relations:s.map(([O])=>({kind:O.path==="exception"?"business-exception":"input",from:O.from,to:O.to,label:O.id+"："+O.activity+"："+O.condition}))},u=ls(l,a),c=O=>{const z=Array.from(O);return Array.from({length:Math.ceil(z.length/28)},(B,ue)=>z.slice(ue*28,(ue+1)*28).join(""))},r=s.map(([O])=>({from:O.from,activity:O.activity,rows:[O],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[O,z]of r.entries()){const B=z.rows[0],ue=e.transitions.filter(fe=>fe.from===B.from&&(fe.activityId??fe.activity)===(B.activityId??B.activity)&&fe.path===B.path&&(B.path!=="exception"||(fe.exception??"例外名未定義")===(B.exception??"例外名未定義"))),Q=ue.map(fe=>(fe.conditionLabel??fe.condition).trim().replace(/\s+/g," ")),ge=new Set(Q).size===ue.length?B.conditionLabel??B.condition:B.condition,le=[B.path==="exception"?"例外："+(B.exception??"例外名未定義"):"",...ue.length>1||B.path==="normal"&&B.conditionLabel?[ge]:[]].filter(Boolean).join("：");z.lines=c(z.activity+(le?"（"+le+"）":"")),z.lineRows=z.lines.map(()=>z.rows),z.width=Math.max(...z.lines.map(fe=>Array.from(fe).length*14)),z.height=z.lines.length*18,u.wires[O].returning||(z.offset=f.has(z.from)?f.get(z.from)+8:0,f.set(z.from,z.offset+z.height))}const d=new Map;s.forEach(([O],z)=>{if(O.from===O.to){const B=d.get(O.from)??[];B.push(z),d.set(O.from,B)}});const p=new Map,g=new Map;for(const[O,z]of d){let B=0;for(const Q of[...z].reverse())p.set(Q,{leader:z[0],index:0,count:1,depth:0,offset:B}),B+=r[Q].height+8;const ue=24+Math.max(0,B-8)+8;g.set(O,ue);for(const Q of z)p.get(Q).depth=ue}const m=O=>44,h=a.slice().sort((O,z)=>u.positions[O][1]-u.positions[z][1]);let x=Math.max(40,...r.map((O,z)=>u.wires[z].returning&&O.from===h[0]?16+O.height/2-44*(u.wires[z].fromPort??.5):40));const C=new Map;for(const O of h){const z=m(),B=(f.get(O)??0)+(g.get(O)??0);C.set(O,x),x+=cc(z,B)}const w=a.map(O=>({id:O,x:t.positions.get(O)?.[0]??u.positions[O][0],y:t.positions.get(O)?.[1]??C.get(O),width:Math.max(104,Array.from(i[O]??O).length*14+32),height:m()})),L=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),I=o("title");I.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(a.includes("@none")?"作成なしはこの操作の処理結果。":"")+(a.includes("@unknown")?"未決は設計課題。":""),L.append(I),L.append(cs("state-transition-"));const y=new Map,W=[],R=[];let E=t.selected;const P=O=>{E=O,t.selected=O;const z=Bo(e.transitions,E);for(const[Q,ge]of y)ge.setAttribute("class","node graph-shape state-shape"+z.nodeClasses(Q)),ge.setAttribute("aria-pressed",String(Q===E));W.forEach(({element:Q,rows:ge})=>{const ye=ge[0].from===ge[0].to;Q.setAttribute("class","edge"+(ye?" state-self-loop":ge[0].path==="exception"?" exception":"")+z.labelClasses(ge)),Q.setAttribute("marker-end","url(#state-transition-"+(ge.some(z.related)?"related-arrow":"arrow")+")")});for(const Q of R)Q.element.setAttribute("class","state-caption-line"+z.labelClasses(Q.rows));L.querySelectorAll("[data-exception-paint]").forEach(Q=>Q.remove());const B=Array.from(L.children).find(Q=>Q.matches(".state-diagram-edge-label,[data-state]"))??null,ue=[...W].sort((Q,ge)=>Number(Q.rows.some(z.related))-Number(ge.rows.some(z.related)));for(const{element:Q}of ue)if(L.insertBefore(Q,B),Q.classList.contains("exception")||Q.classList.contains("state-self-loop")){const ge=L.children.length;ds(L,Q,{path:Q.getAttribute("d")},{"data-transitions":Q.getAttribute("data-transitions")});for(const ye of Array.from(L.children).slice(ge))L.insertBefore(ye,B)}L.querySelectorAll(".state-diagram-edge-label").forEach(Q=>L.append(Q))};L.addEventListener("click",O=>{O.target===L&&P()}),L.addEventListener("keydown",O=>{O.key==="Escape"&&(O.preventDefault(),P())});const T=u.wires.map((O,z)=>({...O,captionLane:(r[z].offset+(g.get(r[z].from)??0))/Fr})),q=l.relations.map((O,z)=>({...O,label:String(z).padEnd(Math.ceil(r[z].width/12),"x")})),H=[...p].map(([O,z])=>{const B=w.find(Q=>Q.id===s[O][0].from),ue=r[O];return{x:B.x+B.width+8,y:B.y+B.height+24+z.offset,width:ue.width,height:ue.height}});let A=new Hi().update({},e,w,q,T);for(let O=0;O<=H.length;O++){let z=!1,B=0;if(A.forEach((ue,Q)=>{if(!ue||p.has(Q)||!T[Q].returning)return;let ge=0;for(const ye of H)for(let le=1;le<ue.points.length;le++){const fe=ue.points[le-1],ve=ue.points[le];if(Math.abs(fe[0]-ve[0])>1e-7||Math.abs(fe[1]-ve[1])<2)continue;const ze=fe[0];if(ze<ye.x-4||ze>ye.x+ye.width+4||Math.max(fe[1],ve[1])<ye.y-4||Math.min(fe[1],ve[1])>ye.y+ye.height+4)continue;const be=ye.x+ye.width+12-ze;be>0&&(ge=Math.max(ge,be))}ge&&(T[Q]={...T[Q],returnLane:(T[Q].returnLane??0)+Math.ceil(ge/16)+B++},z=!0)}),!z)break;A=new Hi().update({},e,w,q,T)}const Z=A.flatMap((O,z)=>O&&!p.has(z)?[O.points]:[]),S=new Map,D=A.map((O,z)=>{const B=p.get(z);if(!B)return O;const ue=s[z][0].from,Q=w.find(be=>be.id===ue),ge=A.flatMap((be,Se)=>be&&!p.has(Se)?[be.points]:[]),ye=Math.max(30,q[z].label.length*12),le=r[z];let fe=S.get(B.leader);fe||(fe=Ud(Q,w,{...B,labelLeft:Q.x+Q.width+8},ye,Z),S.set(B.leader,fe),Z.push(fe.points));const ve=ge.flatMap((be,Se)=>be.slice(1).map((gt,qe)=>({id:`${Se}:${qe}`,x:Math.min(be[qe][0],gt[0])-2,y:Math.min(be[qe][1],gt[1])-2,width:Math.abs(be[qe][0]-gt[0])+4,height:Math.abs(be[qe][1]-gt[1])+4}))),ze=qi([Q.x+Q.width+8+le.width/2,Q.y+Q.height+24+B.offset+le.height/2],le.width,le.height,[...w,...ve]);return{...fe,label:[ze[0]-le.width/2+ye/2,ze[1]]}}),te=new Array(s.length),X=[],he=s.map((O,z)=>z).sort((O,z)=>Number(T[O].returning)-Number(T[z].returning));for(const O of he){const z=D[O],B=r[O],ue=Math.max(30,q[O].label.length*12);let Q=[z.label[0]-ue/2+B.width/2,z.label[1]+(T[O].returning?0:B.height/2-9)];const ge=w.find(fe=>fe.id===s[O][0].from),ye=w.find(fe=>fe.id===s[O][0].to);if(!p.has(O)&&T[O].returning&&ye&&ye.y>ge.y){const fe=z.points.slice(1).map((ve,ze)=>[z.points[ze],ve]).filter(([ve,ze])=>Math.abs(ve[0]-ze[0])<.01&&ze[1]-ve[1]>24).sort(([ve,ze],[be,Se])=>Se[1]-be[1]-(ze[1]-ve[1]))[0];if(fe){const[ve,ze]=fe;Q=[ve[0]+8+B.width/2,ve[1]+Math.min(24+B.height/2,(ze[1]-ve[1])/2)]}}const le=qi(Q,B.width,B.height,w,X);te[O]=le,X.push({id:String(O),x:le[0]-B.width/2,y:le[1]-B.height/2,width:B.width,height:B.height})}let re=Math.max(...w.map(O=>O.x+O.width))+40,ae=Math.max(...w.map(O=>O.y+O.height))+40;s.forEach((O,z)=>{const B=p.get(z);if(B&&B.leader!==z)return;const ue=B?s.flatMap((fe,ve)=>p.get(ve)?.leader===z?fe:[]):O,Q=ue[0],ge=D[z],ye=o("path",{d:ge.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":ue.map(fe=>fe.id).join(" ")});(B||Q.path==="exception")&&ye.setAttribute("stroke-dasharray","6 5");const le=o("title");le.textContent=ue.map(fe=>`${fe.id} ${fe.activity} / ${fe.path==="normal"?"通常":"例外："+(fe.exception??"例外名未定義")}：${fe.condition}`).join(" / "),ye.append(le),L.append(ye),W.push({element:ye,rows:ue}),re=Math.max(re,ge.bounds.right+40),ae=Math.max(ae,ge.bounds.bottom+40)});for(const[O,z]of r.entries()){const B=te[O],ue=B[0]-z.width/2,Q=B[1]-z.height/2+14;L.append(o("rect",{x:String(ue),y:String(Q-14),width:String(z.width),height:String(z.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const ge=o("text",{x:String(ue),y:String(Q),class:"state-diagram-edge-label","data-activity":z.activity,"data-transition-id":z.rows[0].id,"aria-label":z.lines.join("")});z.lines.forEach((ye,le)=>{const fe=o("tspan",{x:String(ue),dy:le?"18":"0","font-size":"14","font-weight":"600"});fe.textContent=ye,fe.setAttribute("data-transitions",z.lineRows[le].map(ve=>ve.id).join(" ")),R.push({element:fe,rows:z.lineRows[le]}),ge.append(fe)}),L.append(ge),re=Math.max(re,ue+z.width+24),ae=Math.max(ae,Q+z.height+24)}for(const O of w){const z=O.id.startsWith("@"),B=o("g",{role:"button",tabindex:"0","aria-label":i[O.id]??O.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":O.id,"data-node":O.id});B.append($r(document,O,z)),B.append(o("rect",{x:String(O.x),y:String(O.y),width:String(O.width),height:String(O.height),rx:z?"20":"8",class:z?"state-diagram-node state-note":"state-diagram-node"}));const ue=o("text",{x:String(O.x+O.width/2),y:String(O.y+O.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(ue.textContent=i[O.id]??O.id,B.append(ue),z&&O.id!=="@new"){const Q=o("text",{x:String(O.x+O.width/2),y:String(O.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Q.textContent=O.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",B.append(Q)}B.addEventListener("click",()=>P(O.id)),B.addEventListener("keydown",Q=>{(Q.key==="Enter"||Q.key===" ")&&(Q.preventDefault(),P(O.id))}),y.set(O.id,B),L.append(B)}return P(t.selected),L.setAttribute("viewBox",`0 0 ${re} ${ae}`),L.style.minWidth=`${re}px`,L}const ur=new WeakMap;function Vd(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(m,h,x=i)=>{const C=document.createElement(m);return C.textContent=h,x.append(C),C};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const a=o.model;for(const m of a.transitions){if(!e.graph.nodes.some(h=>h.id===m.activity&&h.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(m.exceptionId){const h=e.model?.business.exceptions?.find(x=>x.id===m.exceptionId);if(!h||h.activityId!==m.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const l=ur.get(e)??new Map;ur.set(e,l);const u=l.get(t)??as();l.set(t,u);const c={...a,transitions:a.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(h=>h.id===m.activity)?.name??m.activity}))};i.append(zr(document,m=>Fd(c,m),u));const r=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},d=document.createElement("details");s("summary",`操作の詳細（${a.transitions.length}）`,d);const p=document.createElement("ol");d.append(p),i.append(d);for(const m of a.transitions){const h=document.createElement("li");h.dataset.transition=m.id,s("h3",`${m.id} · ${r(m.from)} → ${r(m.to)}`,h),m.path==="exception"&&s("p","例外名："+(m.exception??"未定義"),h),s("p",`${f[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,h);const x=e.graph.nodes.find(C=>C.id===m.activity&&C.type==="business");if(x){const C=document.createElement("button");C.type="button",C.textContent=x.name,C.onclick=()=>n(x.id),h.append(C)}else s("p","要確認：根拠Activityが見つかりません — "+m.activity,h);s("p","条件："+m.condition,h),s("p",m.note,h),s("p","根拠："+m.evidence,h),p.append(h)}a.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",a.source,g),i.append(g),i}const fr=64,Bd=96,Hd=260,pr=40,Gd=4;function Kd(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:a,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}=dc(e,t),r=a.map(I=>I.length),f=o.map(()=>0),d=o.flatMap((I,y)=>r[y]===0?[y]:[]);for(let I=0;I<d.length;I++)for(const y of s[d[I]])f[y]=Math.max(f[y],f[d[I]]+1),--r[y]===0&&d.push(y);const p=Array.from({length:f.reduce((I,y)=>Math.max(I,y),0)+1},()=>[]);o.forEach((I,y)=>p[f[y]].push(y));const g=o.map(()=>0),m=I=>I.forEach((y,W)=>g[y]=W);p.forEach(m);for(let I=0;I<Gd;I++){const y=I%2?[...p].reverse():p;for(const W of y){const R=new Map(W.map(E=>{const P=I%2?s[E]:a[E];return[E,P.length?P.reduce((T,q)=>T+g[q],0)/P.length:g[E]]}));W.sort((E,P)=>R.get(E)-R.get(P)||E-P),m(W)}}const h=p[0].filter(I=>o[I].type==="object"&&i[I].length===0&&s[I].length>0);if(n&&h.length>1){const I=new Set(h),y=p[0].filter(W=>!I.has(W));p.splice(0,1,...h.map((W,R)=>R===0?[...y,W]:[W]))}const x=Object.create(null),C=o.map(()=>0),w=[],L=Math.ceil(Hd/fr)-1;for(let I=0;I<p.length;I++){const y=new Map;for(const E of w)for(const P of E)y.set(P,P+1);const W=E=>{let P=E;for(;y.has(P);)P=y.get(P);let T=E;for(;y.has(T);){const q=y.get(T);y.set(T,P),T=q}return P},R=[];for(const E of p[I]){let P=I;for(const q of a[E])P=Math.max(P,C[q]+1);const T=W(P);C[E]=T,y.set(T,T+1),R.push(T),x[o[E].id]=[pr+I*fr,pr+T*Bd]}w.push(R),w.length>L&&w.shift()}return{positions:x,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}}function Jd(e,t){return Br(e)?ls(e,t).positions:Kd(e,t).positions}const mr=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function oa(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>mr(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=mr(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function ia(e){const t=oa(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,a])=>[o.get(s),a])))}}function sa(e){const t=ia(e);return t.restore(Jd(t.graph,t.order))}function _d(e){const t=ia(e),n=ls(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function ra(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Xd(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(a=>a.handle!==void 0):s.tabs.some(a=>a.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,a){if(Object.is(s,a))return!0;if(!s||!a||typeof s!="object"||typeof a!="object"||o.has(s)||o.has(a))return!1;const l=p=>Array.isArray(p)||Object.getPrototypeOf(p)===null||Object.getPrototypeOf(p)?.constructor?.name==="Object";if(!l(s)||!l(a)||Array.isArray(s)!==Array.isArray(a)||Array.isArray(s)&&s.length!==a.length)return!1;o.add(s),o.add(a);const u=s,c=a,r=Object.keys(u),f=Object.keys(c),d=r.length===f.length&&r.every(p=>Object.hasOwn(c,p)&&i(u[p],c[p]));return o.delete(s),o.delete(a),d}return i(e,t)}function Kn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,a]of Object.entries(e.positions))n.has(s)&&(o[s]=[...a]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=sa(t),a=Object.values(o);for(const l of i){const u=[...s[l.id]];for(;a.some(c=>Math.abs(c[0]-u[0])<280&&Math.abs(c[1]-u[1])<88);)u[1]+=180;o[l.id]=u,a.push(u)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function aa(){return new Promise((e,t)=>{const n=indexedDB.open(ra(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class ms extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Ko;function ca(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Zd(e){const t=Ko;if(t===void 0)throw Error("Session has not been loaded");const n=await aa();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),a=s.objectStore("session"),l=a.get("generation"),u=a.get("current"),c=a.get("readonly-legacy");let r,f;c.onsuccess=()=>{try{const d=ca(l.result);if(Xd(u.result,e)){f=d;return}if(d!==t)throw new ms;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");c.result===void 0&&Qd(u.result)&&a.put(u.result,"readonly-legacy"),a.put(e,"current"),a.put(f,"generation")}catch(d){r=d,s.abort()}},s.oncomplete=()=>{Ko=f,o()},s.onerror=()=>i(r??s.error??Error("Session save failed")),s.onabort=()=>i(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Yd(){Ko=void 0;const e=await aa();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),a=i.get("generation");o.oncomplete=()=>{try{Ko=ca(a.result),t(s.result)}catch(l){n(l)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function Qd(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const hr=new WeakMap;function el(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let o=hr.get(e);o||(o=new Map,hr.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),a=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),l=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&a.has(r.to)||r.to===t&&a.has(r.from))),u=new Set([t,...l.flatMap(r=>[r.from,r.to])]),c={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>u.has(r.id)),relations:l},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>u.has(r))};return o.set(t,c),c}const br=new WeakMap;function tl(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=br.get(e);o||(o=new Map,br.set(e,o));const i=t,s=o.get(i);if(s)return s;const a=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),l=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),u=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&l.has(f.to)||f.kind==="output"&&f.to===t&&l.has(f.from)||f.kind==="object-exception"&&(f.from===t&&a.has(f.to)||f.to===t&&a.has(f.from))),c=new Set([t,...u.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>c.has(f.id)),relations:u},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>c.has(f))};return o.set(i,r),r}const da=new WeakMap;function Qt(e){return da.get(e)}const la=["design","checks","source","draft","edited","handle"];function nl(e){return{key:e.key,name:e.name,...Object.fromEntries(la.map(t=>[t,e[t]]))}}function $t(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:a,viewInset:l,canvasOrigin:u,scroll:c,zoom:r}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:a,viewInset:l,canvasOrigin:u,scroll:c,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function ni(e,t){const n=t;da.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of la)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function Jo(e){return e.activity}function _o(e){return e.object}function ro(e){return e.activity??e.object}function oi(e){return e.object===void 0?el(e.design,e.activity):tl(e.design,e.object)}function ii(e){const t=oi(e),n=Kn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function Ut(e,t=[],n,o){const i=n??(e.tabs[0]?nl(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?$t(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(d=>{const p=ni(i,d);return Object.assign(d,$t(ii(p))),p}):[],{dark:a,drawer:l,width:u,preferWrite:c,nodeDrawer:r,sampleLayout:f}=e;return{dark:a,drawer:l,width:u,preferWrite:c,nodeDrawer:r,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(d=>d.source?.kind==="url").map(d=>({url:d.source.url,name:d.name}))].filter((d,p,g)=>g.findIndex(m=>m.url===d.url)===p),legacyViews:e.legacyViews,active:s.some(d=>d.key===e.active)?e.active:s[0]?.key}}function hs(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map($t),recovery:n}}function Lo(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function ol(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!dl(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const r of i.views)Lo(r)}const{format:s,views:a,document:l,recovery:u,...c}=e;for(const r of a)Lo(r);for(const r of u)Lo(r);if(!!l!=!!a.length||new Set(a.map(r=>r.key)).size!==a.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(d=>d.group!==void 0&&typeof d.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(d=>d.group===void 0).length!==1))throw Error("Invalid legacy views");const r=o.views[0],f=r?{...r}:void 0;return f&&delete f.group,Ut({...c,tabs:[],active:f?.key,legacyViews:{documentKey:l?.key,views:structuredClone(o.views),active:o.active}},u,l,f?[f]:[])}if(a.length&&(a[0].activity!==void 0||a[0].object!==void 0||a.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(a.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==a.filter(r=>r.activity!==void 0).length||new Set(a.filter(r=>r.object!==void 0).map(r=>r.object)).size!==a.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(l&&a.some(r=>r.activity!==void 0&&!l.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(l&&a.some(r=>r.object!==void 0&&!l.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return Ut({...c,tabs:[]},u,l,a)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)Lo(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return Ut({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function il(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return Ut({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function sl(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),a=new Set(t.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),l=e.tabs.filter(u=>(u.activity===void 0||s.has(u.activity))&&(u.object===void 0||a.has(u.object))).map($t);return Ut(e,e.recovery,i,l)}function rl(e,t){const n=e.tabs.find(i=>Jo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=ni(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,$t(ii(o))),e.tabs.push(o),e.active=o.key,o}function al(e,t){const n=e.tabs.find(i=>_o(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=ni(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,$t(ii(o))),e.tabs.push(o),e.active=o.key,o}function cl(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return $t(i?ii(ni(e.document,{...$t(o),...$t(i)})):o)});return Ut({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function dl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function si(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=l=>l instanceof HTMLButtonElement&&l.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(l=>!l.hidden&&!o(l));for(const l of Array.from(t.querySelectorAll("button,a[href]")))l.setAttribute("role","menuitem");const s=(l=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),l&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},a=(l=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const u=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),c=u.getBoundingClientRect();t.style.left=Math.max(8,Math.min(c.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(c.bottom+4,innerHeight-t.offsetHeight-8))+"px",(l?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?a():s(!0),e.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),a(l.key==="ArrowUp"))},t.addEventListener("keydown",l=>{const u=l,c=i(),r=c.indexOf(document.activeElement);let f;u.key==="ArrowDown"&&(f=(r+1)%c.length),u.key==="ArrowUp"&&(f=(r+c.length-1)%c.length),u.key==="Home"&&(f=0),u.key==="End"&&(f=c.length-1),f!==void 0&&(u.preventDefault(),c[f]?.focus())}),t.addEventListener("click",l=>{const u=l.target.closest("button,a[href]");!t.hidden&&u&&!o(u)&&s(!0)},!0),document.addEventListener("keydown",l=>{!t.hidden&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{!t.hidden&&!t.contains(l.target)&&!e.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{!t.hidden&&!t.contains(l.target)&&l.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const ll=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),ul={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function fl(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=w=>i.slice(w.line+1,o.find(L=>L.line>w.line&&L.level<=w.level)?.line??i.length).join(`
`).trim(),a=new Map(o.filter(w=>w.level===3&&t.some(L=>L.title===w.title)).map(w=>[w.title,w])),l=w=>{const L=t.find(I=>I.title===w.title);return L?"legacy-check:"+L.id:w.level===1?"legacy-check-document":"legacy-heading:"+w.line},u=new Map,c=(w,L)=>{u.has(w)?u.get(w)!==L&&u.set(w,void 0):u.set(w,L)};for(const w of o){const L=l(w);c(ll(w.title),L);const I=t.find(y=>y.title===w.title);I&&c(I.id.toLowerCase(),L)}for(const[w,L]of i.entries()){const I=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(L);if(I){const y=o.find(W=>W.line>w);y&&c(I[1].toLowerCase(),l(y))}}const r=w=>{w=w.replace(/<a\s+id=[^>]+><\/a>/g,"");const L=[];let I=0;for(const y of w.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){y.index>I&&L.push({kind:"markdown",value:w.slice(I,y.index)});let W=y[2].slice(1);try{W=decodeURIComponent(W)}catch{}const R=y[2].startsWith("#")?u.get(W.toLowerCase()):void 0;L.push(R?{kind:"reference",targetId:R,label:y[1]}:{kind:"link",uri:y[2],label:y[1]}),I=y.index+y[0].length}return I<w.length&&L.push({kind:"markdown",value:w.slice(I)}),L},f=[],d=[],p=[],g=new Map;for(const w of o.filter(L=>L.level===2)){if(w.title==="業務一覧")continue;const L=l(w),I=o.find(y=>y.line>w.line)?.line??i.length;f.push({id:L,activityId:Object.hasOwn(n,w.title)?w.title:null,title:w.title,preamble:r(i.slice(w.line+1,I).join(`
`).trim())}),g.set(w.title,L)}const m="legacy-unassigned",h=w=>{const L=o.filter(I=>I.line<w.line&&I.level===2).at(-1);return L?g.get(L.title):void 0},x=t.map(w=>{const L=a.get(w.title),I=h(L)??m,y=Object.create(null),W=[];let R={name:"補足",value:""},E="";for(const T of w.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const q=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(T);q&&(E?q[1][0]===E[0]&&q[1].length>=E.length&&!q[2].trim()&&(E=""):E=q[1]);const H=E?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(T);H?(R.value.trim()&&W.push(R),R={name:H[1],value:H[2]}):R.value+=`
`+T}R.value.trim()&&W.push(R);let P="";for(const T of W)if(T.name==="人間レビュー状態"){P=T.value.split(`
`)[0].trim();const q=T.value.split(`
`).slice(1).join(`
`).trim();q&&(y.補足=[...y.補足??[],...r(q)])}else{const q=ul[T.name]??T.name;y[q]=[...y[q]??[],...r(T.value.trim())]}return{id:"legacy-check:"+w.id,checkId:w.id,title:w.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:P,sectionId:I,detailSummary:[...w.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(T=>T[1]).join(`
`),fields:y}});x.some(w=>w.sectionId===m)&&f.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const w of o.filter(L=>L.level===3&&!a.has(L.title))){const L=h(w);L?d.push({id:l(w),sectionId:L,title:w.title,blocks:[{kind:"prose",content:r(s(w))}]}):p.push({id:l(w),title:w.title,content:r(s(w))})}const C=o.find(w=>w.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(w=>w.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(i.slice(/^# /.test(i[0])?1:0,C).join(`
`)),sections:f,items:x,index:Object.entries(n).map(([w,L])=>{const I=i.find(y=>y.startsWith("|")&&y.includes("["+w+"]"))?.split("|").slice(1,-1)??[];return{activityId:w,purpose:I[1]?.trim()??"",connections:I[2]?.trim()??"",checkIds:L.map(y=>"legacy-check:"+y)}}),guarantees:d,examples:[],notes:p}}function Ni(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[a,...l]=s;return!a||!l.length||!["main","master"].includes(a)&&!/^[a-f0-9]{40}$/i.test(a)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${l.join("/")}`,ref:a}}catch{return}}function Gi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function pl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,d)=>{const p=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(p){i?p[1][0]===i[0]&&p[1].length>=i.length&&!p[2].trim()&&(i=""):i=p[1];return}if(!i){t.add(d);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:d,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const a=new Set,l=s.map(f=>{const d=o.find(m=>m.line>f.line&&m.level<=3)?.line??n.length,p=f.title.split(/\s/)[0];if(a.has(p))throw Error("Check IDが重複しています: "+p);a.add(p);const g=n.slice(f.line+1,d).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(g))throw Error(p+" の"+m+"が見つかりません。");return{id:p,title:f.title,body:g,activities:[]}}),u=Object.create(null);let c=!1;for(const[f,d]of n.entries()){if(!t.has(f)||(/^## /.test(d)&&(c=/^## 業務一覧\s*$/.test(d)),!c||!/^\|/.test(d)))continue;const p=d.split("|").slice(1,-1);if(p.length!==4)continue;const g=Gi(p[0])[0]?.label;if(!g)continue;if(Object.hasOwn(u,g))throw Error("業務一覧のActivityが重複しています: "+g);const m=Gi(p[3]);if(m.some(x=>x.url.toLowerCase()!=="#"+x.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const h=m.map(x=>x.label);if(!h.length||h.some(x=>!a.has(x)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);u[g]=[...new Set(h)];for(const x of l)h.includes(x.id)&&x.activities.push(g)}if(!Object.keys(u).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:l,index:u,model:fl(e,l,u,o)}}function ao(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function co(e,t){const n=new Set(t.design.graph.nodes.filter(c=>c.type==="business").map(c=>c.name)),o=Object.keys(e.index).filter(c=>!n.has(c)),i=Object.keys(e.index).filter(c=>n.has(c)),s=(c,r)=>({state:c,reason:r,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const a=e.intro.split(`
`).filter(c=>/原典|^[-*] Source[：:]|Business Design/i.test(c)).join(`
`),l=Gi(a).map(c=>Ni(c.url)).filter(c=>c!==void 0),u=t.source?.kind==="url"?Ni(t.source.url):t.source?.kind==="sample"?Ni("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return u&&l.length&&l.some(c=>c.document!==u.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!u||!l.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||l.some(c=>c.ref!==u.ref)||!/^[a-f0-9]{40}$/i.test(u.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const gr=new WeakMap;function Bn(e){let t=gr.get(e);return t||(t=pl(e.markdown),gr.set(e,t)),t}const Mi=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Ro(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function ml(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function hl(e){if(!e.checks)return[];const t=Bn(e.checks),n=co(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===ao(e)?[t.model]:[]}function bl(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&Ro(i,"関連Checkを読み込み・保存しています…"),t.error){const l=document.createElement("p");l.className="check-warning",l.setAttribute("role","alert"),l.textContent=t.error,i.append(l)}let s,a=!1;if(e.checks){s=Bn(e.checks);const l=co(s,e);if(a=l.state==="matched"||l.state==="unverified"&&e.checks.confirmedFor===ao(e),!a&&(Ro(i,"現在のBDとの対応を再確認してください。"+l.reason),l.state==="unverified")){const u=Mi("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));u.disabled=n.disabled||t.busy===!0,i.append(u)}}if(t.candidate){const l=t.candidate,u=Bn(l),c=co(u,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",Ro(r,"一致未確認: "+l.name+" — "+c.reason),Ro(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),d=document.createElement("summary");d.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(d,ml(u.markdown)),r.append(f);const p=Mi("対応を確認して表示する",()=>n.confirm(l));p.id="check-confirm",p.disabled=c.state==="mismatch"||n.disabled||t.busy===!0;const g=Mi("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(p,g),i.append(r)}return i.childNodes.length&&o.append(i),o}function gl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const r of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const a=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),r&&!o.hidden&&o.focus({preventScroll:!0})},l=()=>i.filter(r=>!r.hidden&&!r.disabled),u=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const p=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+p,m=i.some(h=>!h.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",o.hidden=!m,(!m||r!==e.dataset.actionsMode)&&(a(),m&&n.contains(f)?o.focus({preventScroll:!0}):!m&&f===o&&l()[0]?.focus({preventScroll:!0}))},c=(r=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=l();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?a(!0):c(),o.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),c(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=l(),d=f.indexOf(document.activeElement);let p;r.key==="ArrowDown"&&(p=(d+1)%f.length),r.key==="ArrowUp"&&(p=(d+f.length-1)%f.length),r.key==="Home"&&(p=0),r.key==="End"&&(p=f.length-1),p!==void 0&&(r.preventDefault(),f[p]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),a(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!o.contains(r.target)&&a()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==o&&a()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&a(!0)},!0),a(),u(),window.addEventListener("resize",u),typeof ResizeObserver<"u"&&new ResizeObserver(u).observe(e),new MutationObserver(u).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(u),document.fonts?.addEventListener("loadingdone",u),{update:u,close:a}}function yl(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,a=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),l=n.reduce((c,r)=>c+r.getBoundingClientRect().width,0)+s*n.length+a,u=l+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&u>e.clientWidth),e.classList.toggle("header-icons-only",l>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const Qn="http://www.w3.org/2000/svg",vl="http://www.w3.org/1999/xhtml",Do=24,yr=8192,wl=16e6,kl=8e6,Il=4e3,Sl=1e6,Ki="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function xl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),o=Math.max(o,r.x+r.width),i=Math.max(i,r.y+r.height);const s=Math.floor(t)-Do,a=Math.floor(n)-Do,l=Math.ceil(o)-s+Do,u=Math.ceil(i)-a+Do,c=Math.min(2,yr/l,yr/u,Math.sqrt(wl/(l*u)));if(c<1)throw Error(Ki);return{bounds:{x:s,y:a,width:l,height:u},width:Math.floor(l*c),height:Math.floor(u*c),scale:c}}const Al="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function vr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const a=o[s],l=getComputedStyle(i);a.removeAttribute("style");for(const u of Al){const c=l.getPropertyValue(u);c&&!/url\s*\(/i.test(c)&&a.style.setProperty(u,c)}for(const u of Array.from(a.attributes))(u.name.startsWith("data-")||u.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(u.name))&&a.removeAttribute(u.name)}),t}function El(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Il||(e.textContent?.length??0)+(t.textContent?.length??0)>Sl)throw Error(Ki);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of o)for(const h of Array.from(m.querySelectorAll(".finding-badges")))i.push({x:parseFloat(m.style.left)+m.clientLeft+h.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+h.offsetTop,width:h.offsetWidth,height:h.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,a=Array.from(t.children).map(vr),l=a.filter(m=>m.matches(".edge,.edge-label"));if(l.length){const m=s.createElementNS(Qn,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...l),s.body.append(m);try{for(const h of l){const x=h.getBBox();i.push({x:x.x-12,y:x.y-12,width:x.width+24,height:x.height+24})}}finally{m.remove()}}const u=xl(i),c=s.createElementNS(Qn,"svg");c.setAttribute("width",String(u.width)),c.setAttribute("height",String(u.height)),c.setAttribute("viewBox",`0 0 ${u.bounds.width} ${u.bounds.height}`);const r=s.createElementNS(Qn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),c.append(r);const f=s.createElementNS(Qn,"g");f.setAttribute("transform",`translate(${-u.bounds.x} ${-u.bounds.y})`);for(const m of a)f.append(m);c.append(f);const d=s.createElementNS(Qn,"foreignObject");d.setAttribute("width",String(u.bounds.width)),d.setAttribute("height",String(u.bounds.height));const p=s.createElementNS(vl,"div");p.style.cssText=`position:relative;width:${u.bounds.width}px;height:${u.bounds.height}px;`;for(const m of o){const h=vr(m);h.querySelector(".activity-open,.object-open")?.remove(),h.style.left=parseFloat(m.style.left)-u.bounds.x+"px",h.style.top=parseFloat(m.style.top)-u.bounds.y+"px",p.append(h)}d.append(p),c.append(d);const g=new XMLSerializer().serializeToString(c);if(new TextEncoder().encode(g).length>kl)throw Error(Ki);return{svg:g,...u}}function Cl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ua(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const a=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(a),i()},n.onerror=()=>{clearTimeout(a),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const a=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(l=>{clearTimeout(a),l?i(l):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(l){clearTimeout(a),s(l)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Ol(e,t){const n=await ua(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=Cl(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function jl(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ua(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function fa(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:Nl(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Nl(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const a of o)i=Math.imul(i^a.codePointAt(0),16777619)>>>0,s=Math.imul(s^a.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function pa(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return V(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function ma(e){V(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),Sn(e),Go(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=fa(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=pa(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return Go(t),t}const wr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Ml={anyOf:Ho.anyOf},Ll={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Rl={type:"string",minLength:1,pattern:"\\S"},Dl={...wr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:wr({id:Ll,name:Rl,package:Ml})}}),$defs:Ho.$defs};function Tl(e){Sn(e,Dl),V(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){V(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),V(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Go(n.package),n.package.formatVersion!=="0.4"&&ma(n.package)}catch(o){throw Error("Plan "+n.id+": "+o.message,{cause:o})}}return{valid:!0,plans:e.plans.map(({id:n,name:o})=>({id:n,name:o}))}}const me=(e,t)=>{if(!e)throw new Error(t)},eo=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Li=e=>!!e&&typeof e=="object"&&!Array.isArray(e),To=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),ha=e=>eo(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Pl(e){me(Li(e),"Graph must be an object");const t=e;me(To(t,["version","nodes","relations"])||To(t,["version","nodes","relations","scope"]),"Invalid graph fields"),me(t.version===1,"Unsupported graph version"),"scope"in t&&me(eo(t.scope),"Invalid scope"),me(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),me(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){me(Li(s),"Node must be an object");const a=s;me(a.type==="business"||a.type==="object","Invalid node type");const l=a.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];a.type==="business"&&("problem"in a||"pain_level"in a)&&(l.push("problem","pain_level"),me(["Low","Medium","High"].includes(String(a.pain_level)),"Invalid Pain level")),me(To(a,l),"Invalid node fields"),me(Object.entries(a).every(([c,r])=>c==="scope"||c==="information"||eo(r)),"Empty node text"),me(typeof a.scope=="boolean","Invalid node scope"),me(ha(a.name)&&a.id===a.name,"Node ID must equal visible name"),me(!n.has(a.id),"Duplicate node ID"),a.type==="object"&&(me(typeof a.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.icon),"Invalid Lucide icon"),me(Array.isArray(a.information)&&a.information.every(eo),"Invalid information")),n.set(a.id,a.type)}me([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){me(Li(s),"Relation must be an object");const a=s;me(To(a,["kind","from","to","label"])&&Object.values(a).every(eo),"Invalid relation fields");const l=o[a.kind];me(Array.isArray(l)&&n.has(a.from)&&n.has(a.to)&&n.get(a.from)===l[0]&&n.get(a.to)===l[1],"Invalid relation endpoints");const u=JSON.stringify([a.kind,a.from,a.to,a.label]);me(!i.has(u),"Duplicate relation"),i.add(u)}}function fn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function no(e){const t=[];let n="";return fn(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),me(!n,"Unclosed code fence"),t}function Ji(e,t,n,o=[]){const i=fn(e),s=no(e),a=Object.create(null);return me(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([l,u],c)=>{me(t.includes(u)&&!(u in a),n+": unsupported/duplicate "+u),a[u]=i.slice(l+1,s[c+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),me(a[u]||o.includes(u),n+": empty "+u)}),me(s.map(l=>l[1]).join("|")===t.join("|"),n+": invalid field order"),a}const kr=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function ql(e){const t=fn(e),n=no(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return me(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],a)=>{const l=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);me(l,"Invalid Finding ID");const u=l[1];me(!o.has(u),"Duplicate Finding ID"),o.add(u);const c=Ji(t.slice(i+1,n[a+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+u);me(["question","correction"].includes(c["### Kind"]),"Invalid Finding Kind"),me(["open","resolved"].includes(c["### Status"]),"Invalid Finding Status"),me(["items","document","unassigned"].includes(c["### Scope"]),"Invalid Finding Scope");const r=c["### Targets"]==="(none)"?[]:fn(c["### Targets"]).filter(f=>f.trim()).map(f=>(me(f.startsWith("- ")&&ha(f.slice(2)),"Invalid Finding target"),f.slice(2)));return me(new Set(r).size===r.length,"Duplicate Finding target"),me(c["### Scope"]==="items"?r.length>0:c["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:u,kind:c["### Kind"],status:c["### Status"],scope:c["### Scope"],targets:r,summary:c["### Summary"],content:c["### Content"],unresolvedTargets:[]}})}function Wl(e,t){me(!e.includes("<!--"),"HTML comments are unsupported");const n=fn(e),o=no(e).filter(d=>d[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;me(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const a={version:1,nodes:[],relations:[]},l=Object.create(null),u=new Set;o.slice(1).forEach(([d,p],g)=>{const m=o[g+2]?.[0]??n.length,h=n.slice(d+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(me(h,"Empty section "+p),p==="# Findings"){me(!u.has(p),"Duplicate Findings"),u.add(p),s=ql(h);return}if(["# Scope","# Graph exceptions"].includes(p)){me(!u.has(p),"Duplicate "+p),u.add(p),p==="# Scope"?(me(!no(h).length,"Scope must be prose"),a.scope=h):fn(h).filter(R=>R.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(R=>{const E=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(R);me(E,"Invalid exception"),a.relations.push({kind:E[1],from:E[2],to:E[3],label:E[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const x=i.exec(p);me(x,"Unsupported heading "+p);const C=x[1],w=x[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");l[w]=n.slice(d,m).join(`
`);const L=R=>no(h).some(E=>E[1]===R);if(C==="Object"){const R=["## Scope","## Icon"];L("## Information")&&R.push("## Information");const E=Ji(h,R,w);me(["true","false"].includes(E["## Scope"]),"Invalid Scope");const P=fn(E["## Information"]??"").filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(T=>(me(/^- \S.*$/.test(T),"Invalid Information"),T.slice(2)));a.nodes.push({id:w,type:"object",name:w,scope:E["## Scope"]==="true",icon:E["## Icon"]==="(generic icon)"?"box":E["## Icon"],information:P});return}const I=["## Scope","## Why","## When"];L("## Exception When")&&I.push("## Exception When"),I.push("## Who","## Where","## How","### Input","### Procedure"),L("### Exception")&&I.push("### Exception"),I.push("### Output","## Result"),(L("## Problem")||L("## Pain level"))&&I.push("## Problem","## Pain level");const y=Ji(h,I,w,["## How"]);me(!y["## How"],"How must only contain fields"),me(["true","false"].includes(y["## Scope"]),"Invalid Scope"),t?.activity?.(w,y);const W={id:w,type:"business",name:w,scope:y["## Scope"]==="true",why:y["## Why"],when:y["## When"],who:y["## Who"],where:y["## Where"],result:y["## Result"]};"## Problem"in y&&(W.problem=y["## Problem"],W.pain_level=y["## Pain level"]),a.nodes.push(W);for(const[R,E]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(R in y)||E!=="business-exception"&&y[R]==="(none)"||fn(y[R]).filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(P=>{const T=/^- (.+?) — (\S.*)$/.exec(P);me(T,"Invalid relation in "+w),a.relations.push({kind:E,from:E==="output"?w:T[1],to:E==="output"?T[1]:w,label:T[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const c=a.nodes.filter(d=>d.type==="business").map(d=>d.id);Pl(a),a.nodes.sort((d,p)=>kr(d.id,p.id)),a.relations.sort((d,p)=>{for(const g of["kind","from","to","label"]){const m=kr(d[g],p[g]);if(m)return m}return 0});const r=new Set(a.nodes.map(d=>d.id));for(const d of s)d.unresolvedTargets=d.targets.filter(p=>!r.has(p));return{graph:a,sections:l,markdown:e,activityOrder:c,findings:s}}const zl=["id","from","activity","condition","to","effect","path","evidence","note"],Je=(e,t)=>{if(!e)throw Error(t)},Po=e=>typeof e=="string"&&!!e.trim();function $l(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Je(n,"state-meta と遷移表が必要です");const o=Xr(n[1]);Je(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),Je(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Je(o.object===t,"対象Objectが一致しません"),Je(Array.isArray(o.states)&&o.states.length>0&&o.states.every(c=>Po(c)&&!c.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),Je(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&Po(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=c=>(Je(c.startsWith("|")&&c.endsWith("|"),"表の行が不正です"),c.slice(1,-1).split("|").map(r=>r.trim())),a=s(i[0]);Je([zl,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(c=>a.join("|")===c.join("|")),"表の列名が不正です"),Je(s(i[1]).length===a.length&&s(i[1]).every(c=>/^-+$/.test(c)),"表の区切りが不正です"),Je(i.length<=1002,"遷移は1000行以内にしてください");const l=new Set,u=i.slice(2).map(c=>{const r=s(c);Je(r.length===a.length&&r.every(Po),"表の列数・空欄が不正です");const f=Object.fromEntries(a.map((d,p)=>[d,r[p]]));return Je(/^T[0-9]+$/.test(f.id)&&!l.has(f.id),"遷移IDが不正または重複しています"),l.add(f.id),Je([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),Je(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),a.includes("exception")&&Je(f.path==="normal"?f.exception==="-":Po(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),Je(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),Je(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),Je(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),Je(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:u}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Ir=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Ul(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let a=0;a<o.length;a++){const l=o[a];if(!s&&/^# Object /.test(l)?n=l.slice(9):!s&&/^# /.test(l)&&(n=null),!s&&l==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const u=[];let c="";for(a++;a<o.length;a++){const f=o[a];if(!c&&/^#{1,2} /.test(f)){a--;break}u.push(f),c=Ir(f,c)}const r=$l(u.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}i.push(l),s=Ir(l,s)}if(new Set(t.map(a=>a.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function Fl(e){const t=/^## State Transitions$/m.test(e)?Ul(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=Wl(t.markdown,{activity:(u,c)=>i.set(u,c),document:(u,c)=>{n=u,o=c}}),a={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(u=>u.type==="object").map(u=>({id:u.id,name:u.name,scope:u.scope,icon:String(u.icon),information:u.information})),activities:(s.activityOrder??[]).map(u=>{const c=s.graph.nodes.find(f=>f.id===u),r=i.get(u);return{id:u,name:c.name,scope:c.scope,why:String(c.why),when:String(c.when),who:String(c.who),where:String(c.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(c.result),problem:c.problem===void 0?null:String(c.problem),painLevel:c.pain_level===void 0?null:String(c.pain_level)}}),relations:s.graph.relations.map((u,c)=>({id:"legacy-relation-"+c,kind:u.kind,fromId:u.from,toId:u.to,label:u.label})),findings:(s.findings??[]).map(u=>({...u,sourceId:u.id,targetIds:u.targets.filter(c=>s.graph.nodes.some(r=>r.id===c))}))};a.exceptions=fa(a);const l=t.declarations.map((u,c)=>({id:"legacy-state-"+c,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:a.id,revision:a.revision,verification:"unverified"},objectId:u.object,states:u.states.map(r=>({id:r,name:r})),start:u.start,terminal:u.terminal,completeness:u.completeness,source:u.source,transitions:u.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:pa(a,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:a,checks:[],states:l,diagnostics:[]}}}function Vl({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=Zr({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const i=e.business,s=[...i.objects,...i.activities],a=c=>i.roles?.find(r=>r.id===c.roleId)?.name??c.who,l=[...i.objects.map(c=>({...c,type:"object"})),...i.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:a(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],u=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===i.id).map(c=>{const r=new Map(c.states.map(d=>[d.id,d.name])),f={object:s.find(d=>d.id===c.objectId).name,states:c.states.map(d=>d.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(d=>({id:d.sourceId,from:r.get(d.fromId)??d.fromId,to:r.get(d.toId)??d.toId,activity:d.activityId,...d.event?{event:d.event}:{},...d.exceptionId?{exceptionId:d.exceptionId,exception:i.exceptions?.find(p=>p.id===d.exceptionId)?.name}:{},condition:d.condition,...d.conditionLabel?{conditionLabel:d.conditionLabel}:{},effect:d.effect,path:d.path,evidence:d.evidence,note:d.note}))};return[c.objectId,{model:f}]})));return{graph:oa({version:1,...i.scope?{scope:i.scope}:{},nodes:l,relations:i.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(l.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:i.activities.map(c=>c.id),objectStateTransitions:u,findings:i.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(r=>s.find(f=>f.id===r)?.name??r)}))}}const ba=8*1024*1024;function ga(e){return/^\s*[\[{]/.test(e)}function _i(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Sr(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");_i(e);const n=Go(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Bl(e,t){if(!ga(e)){if(t!==void 0)throw Error("案を含まない文書です。");return Fl(e)}if(new TextEncoder().encode(e).byteLength>ba)throw Error("ローカルJSONは8MiB以内にしてください。");let n=Xr(e.replace(/^\uFEFF/,""));_i(n);let o;if(n?.format==="alder-named-plans"){Tl(n);for(const a of n.plans)if(_i(a.package),a.package.documents.filter(l=>l.kind==="businessDesign").length!==1)throw Error("業務案 "+a.id+" にはBusiness Designが1件必要です。");const i=t??n.plans[0].id,s=n.plans.find(a=>a.id===i);if(!s)throw Error("指定した業務案がありません: "+i);o={selected:i,choices:n.plans.map(({id:a,name:l})=>({id:a,name:l}))},n=s.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const i=Sr(ma(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const s=i.data.business;s.schemaVersion="0.1",delete s.roles;for(const a of s.activities)delete a.roleId;i.data.diagnostics=i.data.diagnostics.filter(a=>!a.startsWith("Role未確定:"))}return{...i,...o?{namedPlans:o}:{}}}return{...Sr(n,e),...o?{namedPlans:o}:{}}}function nn(e,t){return Vl(Bl(e,t))}async function Hl(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>ba)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!ga(n))throw Error("JSONファイルの本文を確認してください。");return nn(n)}const Gl=(e,t)=>bs(e,t,!1);async function bs(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const a=setTimeout(s,3e4);try{const l=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!l.ok)throw Error("URL取得に失敗しました（HTTP "+l.status+"）。");const u=l.headers.get("content-type")?.toLowerCase()??"";if(u.includes("html")||!n&&u.includes("json")||u.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const c=2*1024*1024;if(Number(l.headers.get("content-length"))>c)throw Error("本文は2MiB以内にしてください。");const r=l.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,d="";const p=new TextDecoder;try{for(;;){const{done:g,value:m}=await r.read();if(g)break;if(f+=m.length,f>c){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}d+=p.decode(m,{stream:!0})}d+=p.decode()}finally{r.releaseLock()}if(n&&u.includes("json")&&!/^\s*[\[{]/.test(d))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(d))throw Error("HTMLページは読み込めません。");return d}catch(l){const u=i.signal.aborted;throw s(),u?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):l instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):l}finally{clearTimeout(a),t?.removeEventListener("abort",s)}}const Xo=Hl;async function ri(e,t){return nn(await bs(e,t))}function Kl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return nn(e)}const ai=e=>e==="question"?"要確認":"要修正";function Jl(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${ai(o)} ${i}`)}return n}function _l(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ai(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(En(e.content)),t}function Xl(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Zl(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${ai(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function Yl(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const a=document.createElement("label");a.className="finding-filter";const l=document.createElement("input");l.type="checkbox",l.checked=t,l.onchange=()=>n(l.checked),a.append(l,document.createTextNode("解消済みも表示")),s.append(a);const u=(r,f,d)=>{const p=document.createElement("button");p.className="node-navigate finding-index-row",p.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const m=document.createElement("span");return m.textContent=d,p.append(g,m),p.onclick=()=>o(r),p},c=e.graph.nodes.filter(r=>(!i||r.id===i)&&typeof r.problem=="string");if(c.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of c)s.append(u({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const d=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!d.length)continue;const p=document.createElement("h3");p.textContent=`${f}（${d.length}件）`,s.append(p);for(const g of d)s.append(u({type:"finding",id:g.id},`${ai(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function Ql(e){const t=sa(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,a)=>s===i[a]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...lc(),viewInset:[40,0],canvasOrigin:void 0}}function eu(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function gs(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function tu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{gs(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function nu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(gs(t)),n.href}function ou(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return gs(t)}const ys=`# Alderを使った設計業務 — Business Design

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
`,iu=`{
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
`;function su(e,t){const n=new Set(t.graph.nodes.map(d=>d.id)),o=new Map;for(const d of t.graph.nodes)o.set(d.name,o.has(d.name)?void 0:d.id);const i=d=>n.has(d)?d:o.get(d),s=Object.create(null);for(const[d,p]of Object.entries(e.positions)){const g=i(d);g&&(s[g]=p)}const{scroll:a,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:a,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(d=>{const p=i(d);return p?[p]:[]}))]}}}const ru=`# Alderのチェックリストサンプル

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
`;function au(e,t,n,o,i=()=>!0,s=()=>{}){const a=e.ownerDocument,l=a.defaultView;let u,c=0,r=0,f=!1,d=null,p="";const g=new Map,m=()=>{u!==void 0&&(l.clearTimeout(u),c=Math.max(0,c-(Date.now()-r)),u=void 0)},h=(w=!1)=>{if(w&&!i())return;m(),g.delete(p);const L=[...g].at(-1);if(L){C(L[1],"error",L[0]);return}const I=e.contains(a.activeElement);e.hidden=!0,t.textContent="",s(),I&&(d?.isConnected?d:o).focus({preventScroll:!0})},x=()=>{e.hidden||e.dataset.kind==="error"||f||a.hidden||e.contains(a.activeElement)||(m(),r=Date.now(),u=l.setTimeout(h,c))};e.addEventListener("pointerenter",()=>{f=!0,m()}),e.addEventListener("pointerleave",()=>{f=!1,x()}),e.addEventListener("focusin",w=>{const L=w.relatedTarget;L&&!e.contains(L)&&(d=L),m()}),e.addEventListener("focusout",()=>l.setTimeout(x,0)),e.addEventListener("keydown",w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),h(!0))}),a.addEventListener("visibilitychange",()=>a.hidden?m():x()),n.onclick=()=>h(!0);const C=(w,L,I)=>{m(),e.contains(a.activeElement)||(d=a.activeElement),p=I,e.dataset.kind=L,e.dataset.key=I,t.setAttribute("role",L==="error"?"alert":"status"),t.setAttribute("aria-live",L==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=w,s(),c=L==="warning"?8e3:5e3,x()};return(w,L="success",I="operation")=>{L==="error"&&w?(g.delete(I),g.set(I,w)):g.delete(I);const y=[...g].at(-1);if(y){if(!e.hidden&&t.textContent===y[1]&&p===y[0])return;C(y[1],"error",y[0]);return}if(!w){p===I&&h();return}!e.hidden&&t.textContent===w&&e.dataset.kind===L||C(w,L,I)}}const xr=iu,Et=document.querySelector("#app");Et.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Fe;const k=e=>document.getElementById(e),$n=ra(location.pathname);$n.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${$n.version}`,k("preview-badge").title=`PR #${$n.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const lo=e=>Mn(e,{"stroke-width":1.8,"aria-hidden":"true"}),bo=document.createElement("div");bo.id="source-menu";bo.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';Et.append(bo);const ci=document.createElement("div");ci.id="checks-menu";ci.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';Et.append(ci);const On=document.createElement("section");On.id="check-followup";On.hidden=!0;On.setAttribute("aria-labelledby","check-followup-title");On.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(On);const di=document.createElement("div");di.id="check-followup-menu";di.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';Et.append(di);const Ft=document.createElement("input");Ft.type="file";Ft.id="check-file";Ft.accept=".md,.markdown,text/markdown,text/plain";Ft.hidden=!0;Et.append(Ft);const on=document.createElement("section");on.id="check-url-dialog";on.hidden=!0;on.setAttribute("role","dialog");on.setAttribute("aria-labelledby","check-url-title");on.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';Et.append(on);const li=document.createElement("div");li.id="help-menu";li.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${$n.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${$n.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${$n.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;Et.append(li);si(k("help-menu-toggle"),li);const oo=document.createElement("div");oo.id="url-history";bo.append(oo);function cu(){if(oo.replaceChildren(),!M.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",oo.append(e);for(const t of M.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=ce||De||de,n.onclick=()=>{du(t.url)},oo.append(n)}}async function du(e){if(!(ce||De||de)){if(M.document?.source?.kind==="url"&&M.document.source.url===e){Ie(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),wo();return}De=!0,je();try{const t=await ri(e),n=Kn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await go(n)}catch(t){t instanceof Nn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{De=!1,je()}}}const lu=si(k("open-menu-toggle"),bo),uu=si(k("open-checks"),ci,()=>{const e=ne();k("check-open-sample").hidden=!e||!Ss(e),k("check-close").disabled=!e?.checks}),ya=si(k("check-followup-open"),di,()=>{k("check-followup-sample").hidden=!ne()||!Ss(ne())});for(const[e,t]of[["open-menu-toggle",Ks],["open",Ks],["open-url",uc],["open-text",fc],["view-markdown",pc],["open-checks",Lr],["share-source",mc],["refresh",hc],["help-menu-toggle",bc],["drawer",gc],["node-list-toggle",yc],["node-list-close",Rr],["display-settings-toggle",Dr],["reset-layout",vc],["save-image",wc],["copy-image",kc],["out",qr],["in",Wr]])k(e).prepend(lo(t));yl(document.querySelector("header"));const Xi=gl(document.querySelector(".tab-strip"));let M={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Lt=!0,Xt=!1,ce=!0,Hn=!1,xn=!1,De=!1,Ar=Promise.resolve(),pn,ke,Rt=0,de=!1,io=!1,Un=0,Zo=0,Fn=!1,vs=!1,Zi=!1,Er=!1;const Yi=new Set,Zt=new Set,Yo=new Set;function va(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Yo){const o=[...M.document?[M.document]:[],...M.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&Yo.delete(n)}}const ne=()=>M.tabs.find(e=>e.key===M.active),jn=e=>Qt(e)?.key??e.key,en=e=>M.document?.key===jn(e);let Qi="";const fu=au(k("status"),k("status-text"),k("status-close"),k("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(Qi===e)return;Qi=e}fu(e,t,n)}function ws(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function ks(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ht(){ce||(Rt++,tt())}function pu(e){e.preventDefault(),e.returnValue=!0}function tt(){const e=Rt>Un||Zo>0||!1||de||Yo.size>0||Zi||Fn||xn,t=!ce&&e;t!==Er&&(Er=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",pu));const n=ce?"restoring":Hn?"protected":xn?"conflict":Fn?"error":Zi||Yo.size>0?"draft":Zo>0||de?"saving":Rt>Un?"dirty":vs?"saved":"unchanged";Et.dataset.saveState!==n&&(Et.dataset.saveState=n),Hn?ws():xn?ks():Fn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),fi()}function Is(e){Fn=!0,Qi=""}function ui(){if(Hn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(xn)throw new ms}async function mu(e){ui();try{await Zd(e)}catch(t){throw t instanceof ms&&(xn=!0,clearTimeout(pn),pn=void 0,ks()),t}}function wa(e,t){Zo++,Yi.add(t),tt();const n=Ar.catch(()=>{}).then(()=>mu(e)).then(()=>{Un=Math.max(Un,t),vs=!0,va(e),Un===Rt&&(Fn=!1)},o=>{throw Is(),o}).finally(()=>{Zo--,Yi.delete(t),tt()});return Ar=n.catch(()=>{}),n}function xe(e=180,t=!0){if(ce)return;if(t&&Rt++,clearTimeout(pn),pn=void 0,Hn){ws(),tt();return}if(xn){ks(),tt();return}if(de||Yi.has(Rt)||!t&&Rt<=Un&&!Fn){tt();return}const n=()=>{pn=void 0;let o;try{o=structuredClone(hs(M))}catch{Is(),tt();return}wa(o,Rt).catch(()=>tt())};e===0?n():pn=window.setTimeout(n,e),tt()}async function hu(e){if(ce||ke||de||!M.tabs.includes(e))return;if(ro(e)===void 0){Fe?.closeBusinessOverview();return}bt.cancel(),Ie();const t=M.active===e.key,n={...M,tabs:M.tabs.filter(o=>o!==e),active:t?M.tabs[0]?.key:M.active};try{await yo(()=>n,()=>{M=n}),t&&Et.dataset.workspaceArea==="business"&&Fe?.businessActivated()}catch{tt()}}function ft(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!ne(),t=e&&M.drawer,n=e&&!!M.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Xt=!1),fi(),k("layout-lock").replaceChildren(lo(Lt?Tr:Pr)),k("layout-lock").setAttribute("aria-pressed",String(Lt)),k("layout-lock").title=Lt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",ce),k("viewport").dataset.layoutLocked=String(Lt),k("prefer-write").checked=M.preferWrite===!0,k("prefer-write").disabled=ce,k("show-exceptions").checked=ne()?.showExceptions!==!1,k("show-exceptions").disabled=ce||de||!ne()||ke===ne(),k("selected-edges-only").checked=ne()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=ce||de||!ne()||ke===ne(),document.documentElement.dataset.theme=M.dark?"dark":"light",k("theme").replaceChildren(lo(M.dark?Cc:Oc)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(M.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",ce||!e),k("node-list-drawer").hidden=!n||pt().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",ce||!e),Fe?.syncChrome()}function es(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!ne(),t.disabled=io||ce||!ne()||ke===ne(),t.setAttribute("aria-busy",String(io))}}function fi(){es(),document.querySelector(".toolbar").dataset.settingsOpen=String(Xt),k("display-options").hidden=!Xt,k("reset-layout").disabled=ce||De||de||!1||!ne()||Zt.has(M.document?.key??"")||Hn||xn;const e=k("display-settings-toggle"),t=Xt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Xt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ce||de||!ne()||ke===ne()}function ka(e,t=!1){const n=ne();ce||de||!n||ke===n||e===Xt||(e&&(Gn.delete(Qt(n)?.key??n.key),pi()),bt.cancel(),Pe=void 0,Ie(),Xt=e,fi(),Bt(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function Ia(e){const t=ne();if(!(io||ce||!t||ke===t)){io=!0,es();try{const n=El(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await jl(n),$e("グラフ全体のPNGをコピーしました。")):await Ol(n,(Qt(t)?.name??t.name)+(ro(t)?" - "+ro(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{io=!1,es()}}}k("save-image").onclick=()=>Ia(!1);k("copy-image").onclick=()=>Ia(!0);k("display-settings-toggle").onclick=()=>ka(!Xt);k("reset-layout").onclick=()=>{const e=ne();if(ce||De||de||ke||!e||Zt.has(jn(e)))return;try{ui()}catch{tt();return}bt.cancel(),un.cancel(),Pe=void 0,Ie();const t={...e,design:oi(e)},n=Ql(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Oa.invalidate(e),je(),n!==t&&xe()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Xt&&k("source-dialog").hidden&&(e.preventDefault(),ka(!1,!0))});function Ie(e=!0){const t=ne();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Ht(),xe(180,!1)),o}function Sa(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function ts(){lu.close(),uu.close(),ya.close(),Xi.close(),Sa(bu),Xi.update()}function bu(){const e=k("tabs");e.replaceChildren(),M.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===M.active?" active":""),n.draggable=ro(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Jo(t)!==void 0&&(n.dataset.activity=Jo(t)),_o(t)!==void 0&&(n.dataset.object=_o(t));const o=document.createElement("button");Wi(o,"business",t.name),o.setAttribute("aria-current",String(t.key===M.active)),o.disabled=de,o.onclick=async()=>{if(de||Dt&&Dt!==t.key&&!await vo())return;const s=Ie()||M.active!==t.key;Fe?.activateBusiness(),M.active=t.key,je(),Fe?.businessActivated(),xe(180,s)};const i=zi("業務設計："+t.name+"を閉じる");i.disabled=de,i.onclick=()=>hu(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),de)return;const a=M.tabs.findIndex(u=>u.key===s.dataTransfer?.getData("text/plain")),l=M.tabs.indexOf(t);if(a>0&&l>0&&a!==l){const[u]=M.tabs.splice(a,1);M.tabs.splice(l,0,u),ts(),xe()}},n.onkeydown=s=>{if(!de&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const a=M.tabs.indexOf(t),l=a+(s.key==="ArrowLeft"?-1:1);a>0&&l>0&&l<M.tabs.length&&([M.tabs[a],M.tabs[l]]=[M.tabs[l],M.tabs[a]],ts(),xe())}},e.append(n)})}const Cr=new Map,Gn=new Set;function pi(){const e=ne(),t=!!e&&e.design.sourceFormat!=="json"&&Gn.has(Qt(e)?.key??e.key)&&!e.checks;t||(ya.close(),On.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),On.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=ce||De||de||!1||!e||bn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=ne();e&&Gn.delete(Qt(e)?.key??e.key),pi()};let ns;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{ns=k("check-followup-open"),k(t).click(),ns=void 0};function Ss(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===ys}function bn(e){const t=Qt(e)?.key??e.key;let n=Cr.get(t);return n||(n={},Cr.set(t,n)),n}async function xs(e,t){if(!en(e))throw Error("原本文書が切り替わりました。");const n=Ut(M,M.recovery,{...M.document,checks:t},hs(M).views);await yo(()=>n,()=>{M=n,t&&Gn.delete(Qt(e)?.key??e.key)})}async function xa(e,t){const n=bn(e);if(e.design.sourceFormat==="json"||n.busy||de||ce||ke===e)return;const o=ao(e);n.busy=!0,n.error=void 0,n.candidate=void 0,tn();try{const i=await t();if(!en(e))return;if(o!==ao(M.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=Bn(i),a=co(s,M.tabs[0]);if(a.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+a.reason);a.state==="unverified"?n.candidate=i:(await xs(e,i),n.candidate=void 0,Fe?.openRelatedChecks(ne()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,$e(n.error,"error")}finally{n.busy=!1,tn()}}async function Aa(e,t){const n=bn(e);if(n.busy||de||!en(e))return;const o=co(Bn(t),M.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,tn();return}n.busy=!0,n.error=void 0;try{await xs(e,{...t,confirmedFor:ao(M.tabs[0])}),n.candidate=void 0,Fe?.openRelatedChecks(ne()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,tn()}}function tn(){pi();const e=ne(),t=k("detail"),n=e?bn(e):void 0,o=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=ce||de||ke===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const a=e.design.graph.nodes.find(f=>f.id===e.selected),l=bl(e,n,{disabled:ce||de||ke===e,redraw:tn,confirm:f=>{Aa(e,f)}}),u=document.createElement("div");u.className="right-drawer-heading";const c=Xc(a?.name??"業務設計");if(a){const f=a.type==="business"?Ea(String(a.who),a.id):Hr(a);f.classList.add("drawer-node-icon"),c.prepend(f)}u.append(c);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},u.append(r),t.append(u),l.hasChildNodes()&&t.append(l),a){const f=Zl(e.design,a.id,As);f.hasChildNodes()&&t.append(f)}t.append(Ed(e.design,a?.id)),a?.type==="business"&&Fe?.appendActivityTestLinks(t,a.id),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Or=new Map,pt=()=>{const e=M.active??"";let t=Or.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Or.set(e,t)),t};function As(e){if(!ne())return;const t=pt();t.mode="findings",t.finding=e,M.nodeDrawer=!0,innerWidth<=800&&(M.drawer=!1),ft(),At(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),xe()}function gu(e){const t=ne();if(!t)return;const n=pt();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){As(o[0]);return}M.nodeDrawer=!0,innerWidth<=800&&(M.drawer=!1),ft(),At(),k("drawer-mode-findings").focus({preventScroll:!0}),xe()}function yu(e,t){const n=pt().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(l=>l.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(l=>l.id===n.id&&typeof l.problem=="string"):void 0;if(!o&&!i)return pt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{pt().finding=void 0,At(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(_l(o));else{const l=document.createElement("h2");l.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(l,En(String(i.problem)))}const a=o?.targets??[i.id];if(a.length){const l=document.createElement("section"),u=document.createElement("h3");u.textContent="関連項目へ移動",l.append(u);for(const c of a){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=c;const f=e.design.graph.nodes.some(p=>p.id===c),d=e.hiddenNodes?.includes(c);r.disabled=!f||!!d,r.textContent=(e.design.graph.nodes.find(p=>p.id===c)?.name??c)+(f?d?"（非表示）":"":"（参照先なし）"),r.onclick=()=>Uo(c,!0),l.append(r)}t.append(l)}return!0}function Ea(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&ne()?.design.model?.business.roles?us(ne().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(lo(Ur)),o}function mi(e,t=!0){ce||!ne()||(bt.cancel(),Ie(),M.nodeDrawer=e,e&&pt().mode==="findings"&&innerWidth<=800&&(M.drawer=!1),ft(),e&&ne()?.selected&&Jn(ne().selected),At(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),xe())}function Jn(e){const t=ne(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=pt();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(_c(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function vu(e,t){const n=ne();if(!n||ce||de||ke===n)return;bt.cancel(),Pe=void 0,Ie();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],gn(),xe()}function Uo(e,t=!1){let n=ne();if(n&&!oi(n).graph.nodes.some(f=>f.id===e)&&(Ie(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,n=ne(),je()),!n||n.hiddenNodes?.includes(e)||ke===n)return;t||(pt().finding=void 0);const o=k("node-list").contains(document.activeElement);bt.cancel(),Pe=void 0,Ie(),n.selected=e,Jn(e),ft(),gn();const i=k("viewport"),s=i.getBoundingClientRect(),a=k("formattedMarkdownDrawer").getBoundingClientRect(),l=M.drawer&&a.left>s.left&&a.left<s.right?a.left:s.right,u=Math.max(1,Math.min(i.clientWidth,l-s.left-i.clientLeft)),c=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-u/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-c/2],Bt(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],Ie(),o){const f=t?"[data-finding-target]":"[data-list-node]",d=Array.from(k("node-list").querySelectorAll(f)).find(p=>(t?p.dataset.findingTarget:p.dataset.listNode)===e);(t?d:d?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}xe()}function At(){const e=ne(),t=pt(),n=k("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=k("drawer-modes");s.replaceChildren();for(const g of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===g?0:-1,m.textContent=`指摘（${e?Xl(e.design):0}）`;const h=()=>{t.mode=g,At(),k("drawer-mode-"+g).focus({preventScroll:!0})};m.onclick=h,m.onkeydown=x=>{["ArrowLeft","ArrowRight","Home","End"].includes(x.key)&&(x.preventDefault(),m.focus({preventScroll:!0}))},s.append(m)}for(const g of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const a=k("node-list-search");a.value=t.search,a.disabled=!e||ce;const l=k("node-categories");l.replaceChildren();for(const[g,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const h=document.createElement("button");h.dataset.category=g,h.id="node-category-"+g,h.setAttribute("role","tab"),h.setAttribute("aria-selected",String(t.category===g)),h.setAttribute("aria-controls","node-list"),h.tabIndex=t.category===g?0:-1,h.textContent=m,h.onclick=()=>{t.category=g,At(),k("node-category-"+g).focus({preventScroll:!0})},h.onkeydown=x=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(x.key))return;x.preventDefault();const C=["activity","object","role"],w=C.indexOf(g);t.category=x.key==="Home"?"activity":x.key==="End"?"role":C[(w+(x.key==="ArrowRight"?1:2))%3],At(),k("node-category-"+t.category).focus({preventScroll:!0})},l.append(h)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const u=new Set(e?.hiddenNodes??[]),c=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=c.filter(g=>!u.has(g.id)).length,f=k("scope-outside"),d=r===c.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",d),f.setAttribute("aria-label",d==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(lo(d==="false"?jc:Nc)),f.disabled=!c.length||ce||ke===e;const p=k("show-outside");if(p.checked=d==="true",p.indeterminate=d==="mixed",p.setAttribute("aria-checked",d),p.disabled=f.disabled,k("scope-count").textContent=d==="mixed"?`${r}/${c.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(yu(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(h=>h.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,At(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,m)}n.append(Yl(e.design,t.resolved,g=>{t.resolved=g,At(),n.querySelector("input")?.focus({preventScroll:!0})},As,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>mi(!M.nodeDrawer);k("node-list-close").onclick=()=>mi(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),mi(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),mi(!1))});k("node-list-search").oninput=()=>{pt().search=k("node-list-search").value,At()};function Ca(){const e=ne();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);vu(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=Ca;k("show-outside").onchange=Ca;const wu="http://www.w3.org/2000/svg",Ri=e=>document.createElementNS(wu,e),Oa=new Hi,jr=new WeakMap;function ku(e){if(!Br(e.graph))return;let t=jr.get(e);return t||(t=_d(e),jr.set(e,t)),t.wires}function Iu(e,t,n){ds(k("edges"),e,t,{"data-relation":String(n)})}let uo=()=>{},_t=[0,0],ln=[0,0];function Su(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function xu(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Bt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],ln[0]):0,i[1]<0||n[1]>0?Math.min(i[1],ln[1]):0],{growth:a,origin:l}=Ec(n,s,e.zoom),u=a.some(Boolean);u&&(e.canvasOrigin=l,e.scroll=[e.scroll[0]+a[0],e.scroll[1]+a[1]],Ht(),xe(180,!1));const c=Math.ceil(Math.max(1400,_t[0],(Su()+e.scroll[0])/e.zoom-t[0]*2-l[0],...o.map(f=>f[0]+340))),r=Math.max(850,_t[1],Math.max(_t[1],...o.map(f=>f[1]+68))+xu()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-l[1],...o.map(f=>f[1]+220));k("canvas").style.width=(c+l[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(r+l[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(l[0]+t[0])*e.zoom+"px",k("nodes").style.top=(l[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=c+"px",k("nodes").style.height=r+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-l[0]} ${-l[1]} ${c+l[0]} ${r+l[1]}`),k("edges").style.width=(c+l[0])*e.zoom+"px",k("edges").style.height=(r+l[1])*e.zoom+"px",u&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function gn(){Sa(Au)}function Au(){fi(),un.cancel(),uo=()=>{},_t=[0,0],ln=[0,0];const e=ne();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,tn(),At();return}const t=oi(e),n=t.graph.nodes,o=n.filter(r=>!e.hiddenNodes?.includes(r.id)),i=new Set(o.map(r=>r.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,a=e.positions,l=Bo(t.graph.relations,s);Bt(e),k("edges").append(cs());const u=eu(t.graph.relations,M.preferWrite===!0),c=()=>{const r=n.flatMap(h=>{const x=a[h.id];return x?[{id:h.id,x:x[0],y:x[1],width:260,height:68}]:[]}),f=ku(t),d=Oa.update(e,t,r,t.graph.relations,f),p=new Map;for(_t=[0,0],ln=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(h=>[h.id,h.name]));t.graph.relations.forEach((h,x)=>{if(u.has(x))return;const C=d[x];if(!C||(_t[0]=Math.max(_t[0],C.bounds.right+20,C.label[0]+Math.max(30,h.label.length*12)/2+12),_t[1]=Math.max(_t[1],C.bounds.bottom+20,C.label[1]+22),ln[0]=Math.min(ln[0],...C.points.map(R=>R[0]-20),C.label[0]-Math.max(30,h.label.length*12)/2-12),ln[1]=Math.min(ln[1],...C.points.map(R=>R[1]-20),C.label[1]-22),e.selectedEdgesOnly===!0&&l.muted(h)||!i.has(h.from)||!i.has(h.to)||e.showExceptions===!1&&(h.kind==="business-exception"||h.kind==="object-exception")))return;const w=Ri("path");w.setAttribute("d",C.path),w.dataset.relation=String(x),w.dataset.collisions=String(C.collisions),w.dataset.rerouted=String(C.rerouted),w.dataset.fallback=String(C.fallback),w.setAttribute("marker-end","url(#arrow)"),w.classList.add("edge"),h.kind.endsWith("exception")&&w.classList.add("exception"),l.related(h)&&(w.classList.add("review-related"),w.setAttribute("marker-end","url(#related-arrow)")),l.muted(h)&&w.classList.add("muted");const L=Ri("title");L.textContent=(g.get(h.from)??h.from)+" → "+(g.get(h.to)??h.to)+": "+h.label,w.append(L),k("edges").append(w),h.kind.endsWith("exception")&&Iu(w,C,x);const I=Vr(h,x,f?.[x]),y=p.get(I);if(y){y.dataset.relations+=" "+x,l.related(h)&&(y.classList.add("review-related"),y.classList.remove("muted"));return}const W=Ri("text");p.set(I,W),W.dataset.relations=String(x),W.setAttribute("x",String(C.label[0]-Math.max(30,h.label.length*12)/2)),W.setAttribute("y",String(C.label[1])),W.setAttribute("text-anchor","start"),W.classList.add("edge-label"),W.setAttribute("dominant-baseline","middle"),W.dataset.relation=String(x),l.related(h)&&W.classList.add("review-related"),l.muted(h)&&W.classList.add("muted"),W.textContent=h.label,k("edges").append(W)});const m=k("edges");for(const h of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(h);Bt(e)};uo=c,c(),o.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+l.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=a[r.id][0]+"px",f.style.top=a[r.id][1]+"px",r.type==="business"?f.append(Ea(String(r.who),r.id)):f.append(Hr(r));const d=document.createElement("span");d.className="node-text";const p=document.createElement("span");p.className="review-kind",p.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),d.append(p);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,d.append(g),r.type==="business"){const w=document.createElement("small");w.textContent=String(r.who),d.append(w)}if(f.append(d),Mc(r.id,ro(e))){const w=document.createElement("button");w.type="button",w.className=r.type==="business"?"activity-open":"object-open",w.setAttribute("aria-label",r.name+"の詳細タブを開く"),w.title="詳細タブを開く",w.textContent="開く",w.onpointerdown=L=>L.stopPropagation(),w.onpointerup=L=>L.stopPropagation(),w.onclick=L=>{L.stopPropagation(),r.type==="business"?os(r.id):ja(r.id),Fe?.businessActivated()},f.append(w)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const m=Jl(e.design,r);if(m.length){const w=document.createElement("button");w.type="button",w.className="finding-badges",w.textContent=m.join(" · "),w.setAttribute("aria-label",r.name+"の指摘を開く"),w.onpointerdown=L=>L.stopPropagation(),w.onpointerup=L=>L.stopPropagation(),w.onclick=L=>{L.stopPropagation(),gu(r.id)},f.append(w),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+m.join("、"))}let h;const x=f;x.onpointerdown=w=>{w.button!==0||ke===e||Lt||(w.stopPropagation(),x.setPointerCapture(w.pointerId),h=w.pointerId,un.begin(r.id,[w.clientX,w.clientY]))},x.onpointermove=w=>{h===void 0||w.pointerId!==void 0&&w.pointerId!==h||!f.isConnected||ke===e||un.move([w.clientX,w.clientY])},x.onpointerup=w=>{if(h===void 0||h!==w.pointerId||(h=void 0,!f.isConnected||ke===e))return;const L=un.end();x.hasPointerCapture?.(w.pointerId)&&x.releasePointerCapture(w.pointerId),L&&(L.moved||(pt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Ht()),Jn(r.id)),Ie(),gn(),xe(180,!1))};const C=w=>{h===void 0||h!==w.pointerId||(h=void 0,f.isConnected&&(un.cancel(),Ie(),xe(180,!1)))};x.onpointercancel=C,x.onlostpointercapture=C,k("nodes").append(f)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",tn(),At()}function os(e){ce||de||ke||(Ie(),rl(M,e),je(),xe(),k("viewport").focus({preventScroll:!0}))}function ja(e){ce||de||ke||(Ie(),al(M,e),je(),xe(),k("viewport").focus({preventScroll:!0}))}function je(){Na(),document.title=M.document?M.document.name+" · Alder Viewer":"Alder Viewer",bt.cancel(),Pe=void 0,ft(),ts(),gn();const e=ne();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",ce||de||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Zt.has(jn(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",ce||De||de||!1||!e||Zt.has(jn(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",ce||De||de||!1||!e||!!(e&&bn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",ce||De||de);k("open-sample").setAttribute("aria-disabled",String(ce||De||de)),k("open-sample").tabIndex=ce||De||de?-1:0,k("theme").toggleAttribute("disabled",ce),mo(),pi(),cu(),gi(),Fe?.syncDocument()}function Na(){const e=k("header-title"),t=M.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{Eu(n.value)},e.append(n));const o=Array.from(n.options).map(i=>[i.value,i.textContent]);JSON.stringify(o)!==JSON.stringify(t.choices.map(({id:i,name:s})=>[i,s]))&&n.replaceChildren(...t.choices.map(({id:i,name:s})=>{const a=document.createElement("option");return a.value=i,a.textContent=s,a})),n.value=t.selected,n.title=t.choices.find(i=>i.id===t.selected)?.name??"",n.disabled=ce||De||de||!1}async function Eu(e){const t=M.document;if(!t?.design.namedPlans||ce||De||de||ke||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),o=document.activeElement===n;try{if(!k("source-dialog").hidden&&!await vo()){Na();return}const i=nn(t.design.markdown,e),s=crypto.randomUUID(),a=Ut({...M,tabs:[],active:s},M.recovery,{...t,design:i},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await yo(()=>a,()=>{M=a}),Fe?.reopenBusinessOverview(),Fe?.activateBusiness(),Fe?.businessActivated(),$e("")}catch(i){je(),i instanceof Nn||$e("案を切り替えられません: "+i.message,"error")}finally{o&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function go(e){const t=M.document,n=il(M,e);return t?(await yo(()=>n,()=>{M=n,Gn.add(Qt(M.tabs[0])?.key??M.tabs[0].key)}),!0):(Ie(),M=n,Gn.add(Qt(M.tabs[0])?.key??M.tabs[0].key),je(),xe(),!0)}async function Ma(e,t){if(Dt&&!await vo())return;const n=await Xo(e),o=ne();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await fo(o,n,t))return;Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),xe();return}const i=Kn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await go(i)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(ce||De||de))try{if(M.document?.source?.kind==="sample"&&M.document.design.markdown===xr){Ie(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),k("viewport").focus({preventScroll:!0});return}const t=nn(xr),n=M.document?.source?.kind==="sample"&&M.document.design.markdown===ys?M.tabs[0]:void 0;n&&Ie();const o=n??M.sampleLayout,i=o?su(o,t):{},s=Kn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await go(s)&&k("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(ce||De||de)){De=!0,je();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Ma(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{De=!1,je()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(ce||De||de)){De=!0,je();try{for(const t of Array.from(e.files??[]))await Ma(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",De=!1,je()}};class Nn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function yo(e,t){if(de||ke)throw Error("表示を切り替えています。完了後に再試行してください。");try{ui()}catch(i){throw new Nn(i)}Ie(),clearTimeout(pn),pn=void 0,de=!0,Rt++;const n=Rt;je(),tt();let o=!1;try{const i=structuredClone(hs(e()));await wa(i,n);const s=M;t(),M!==s&&(M=cl(M,s)),ut==="view"&&Dt&&!M.tabs.some(a=>a.key===Dt)&&(Dt=M.tabs[0]?.key),va(i),o=!0}catch(i){throw Is(),new Nn(i)}finally{de=!1,je(),tt(),o&&Rt!==n&&xe(0,!1)}}async function fo(e,t,n=e.handle,o=!1){if(!en(e)||e.design!==M.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=nn(t.markdown,e.design.namedPlans.selected));const i=!!e.design.namedPlans!=!!t.namedPlans,s=crypto.randomUUID(),a=M.document,l=i&&a?Ut({...M,tabs:[],active:s},M.recovery,{...a,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):sl(M,t,n,o);return await yo(()=>l,()=>{M=l}),An=void 0,gi(),$e(""),!0}async function Nr(e){if(!en(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await fo(e,await Xo(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const a=i.files?.[0];a&&await fo(e,await Xo(a)),s()}catch(a){i.remove(),o(a)}},i.click()})}k("refresh").onclick=async()=>{const e=ne();if(ce||de||ke||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Zt.has(jn(e)))return;Dt===e.key&&ei();const t=jn(e);Zt.add(t),je();try{if(e.source?.kind==="url"){const o=await ri(e.source.url);await fo(e,o);return}if(!e.handle){await Nr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!en(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Nr(e);return}await fo(e,await Xo(await e.handle.getFile()))}catch(n){en(e)&&n.name!=="AbortError"&&!(n instanceof Nn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Zt.delete(t),je()}};let ut="text",Dt,Yt=!1,mn=0,Qo,is=null;const Vt=()=>k("source-text"),po=()=>k("source-url");function Es(){Zi=!k("source-dialog").hidden&&ut!=="view"&&(ut==="text"?Vt().value:po().value)!=="",tt()}po().addEventListener("input",Es);function mo(){ss();const e=ut==="view",t=Yt||de;Vt().disabled=t,Vt().readOnly=e,k("source-dialog").dataset.mode=ut,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=de||t&&ut!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",Es(),queueMicrotask(Da)}function Cs(e,t){if(!(ce||De||de||t&&Zt.has(jn(t)))){Qo?.abort(),mn++,ut=e,Dt=t?.key,Yt=!1,is=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${M.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Vt().value=t.design.markdown:e==="text"&&(Vt().value=hi),mo(),(e==="url"?po():Vt()).focus()}}let hi="",qo;function Cu(){if(is?.isConnected&&is.focus({preventScroll:!0}),qo!==void 0&&cancelAnimationFrame(qo),ut!=="view")return;const e=mn;qo=requestAnimationFrame(()=>{if(qo=void 0,e!==mn||!k("source-dialog").hidden)return;const t=window.visualViewport,n=Et.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function ei(){mn++,Qo?.abort(),Yt=!1,Dt=void 0,k("source-dialog").hidden=!0,mo(),Cu()}async function vo(){return de?!1:(ut==="text"&&(hi=Vt().value),ei(),!0)}function La(){return vo()}Vt().oninput=()=>{ut==="text"&&(hi=Vt().value,Es())};let Fo=!1;function Ra(){return ce||De||Yt||de||ke?"読込が終わってから共有してください。":tu(ne())}function ss(){const e=Ra(),t=k("share-source");t.hidden=!ne(),t.setAttribute("aria-disabled",String(Fo||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(Fo)return;const e=Ra();if(e){$e(e,"warning");return}const t=ne();if(t.source?.kind!=="url")return;const n=t.source.url,o=nu(location.href,n);Fo=!0,ss();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Fo=!1,ss()}};let Jt,Wn=0,Mr=0,so;function Da(){if(ce||De||Yt||ke||de||Jt||so===void 0)return;const e=so;so=void 0,Os(e)}async function Os(e=location.hash){const t=e;if(ce)return;const n=++Mr;if(!/^#source(?:=|$)/.test(t)){so=void 0,Jt&&!de&&(Jt.abort(),Jt=void 0,Wn++,De=!1,je());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),de){so=t;return}if(Yt||De&&!Jt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++Wn;Jt?.abort();try{const i=ou(t);ui();const s=M.tabs.find(c=>c.source?.kind==="url"&&c.source.url===i),a=s;if(a){if(Dt&&Dt!==a.key&&!await vo()||o!==Wn||n!==Mr)return;const c=Ie()||M.active!==a.key;M.active=a.key,je(),xe(180,c),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),wo();return}Jt=new AbortController,De=!0,je();const l=await ri(i,Jt.signal);if(o!==Wn)return;const u=Kn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:l,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},l);if(!await go(u))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===Wn&&!(i instanceof Nn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===Wn&&(Jt=void 0,De=!1,je(),Da())}}window.addEventListener("hashchange",()=>{Os().then(()=>{M.document?.key===rs&&wo()})});function js(e){M.drawer=!0,ft(),tn()}async function Ou(e){const t=bn(e);if(!(e.design.sourceFormat==="json"||t.busy||de||ce||ke===e)){t.busy=!0;try{await xs(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,tn()}}}let ti;Ft.onchange=()=>{const e=Ft.files?.[0],t=ti??ne();ti=void 0,Ft.value="",!(!e||!t||!en(t))&&(js(),xa(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ft.oncancel=()=>{ti=void 0};k("check-open").onclick=()=>{ti=ne(),Ft.click()};let Ns,Vo=null;function Ms(){on.hidden=!0,Ns=void 0,(Vo&&!Vo.closest("[hidden]")?Vo:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=ne();e&&(Vo=ns??document.activeElement,Ns=e,k("check-url").value=bn(e).url??"",on.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=Ms;on.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Ms())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=Ns;if(!t||!en(t))return;const n=k("check-url").value.trim();bn(t).url=n,Ms(),js(),xa(t,async()=>({name:n,url:n,markdown:await Gl(n)}))};k("check-open-sample").onclick=()=>{const e=ne();!e||!Ss(e)||(js(),Aa(e,{name:"チェックリストのサンプル",markdown:ru}))};k("check-close").onclick=()=>{const e=ne();e&&Ou(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=ne();e&&Cs("view",e)};k("open-url").onclick=()=>Cs("url");k("open-text").onclick=()=>Cs("text");k("source-cancel").onclick=()=>La();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),La())};k("source-submit").onclick=async()=>{if(Yt||de||ut==="view"&&ke||k("source-dialog").hidden||ut==="view")return;Yt=!0,mo();const e=++mn,t=ut;Qo=new AbortController;try{const n=ut==="url"?new URL(po().value.trim()).href:po().value.trim();if(t==="url"&&M.document?.source?.kind==="url"&&M.document.source.url===n){Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,ei(),je(),wo();return}const o=t==="url"?await ri(n,Qo.signal):Kl(Vt().value),i=o.markdown;if(e!==mn)return;const s=Kn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await go(s))return;$e(""),t==="text"&&(hi=i),ei()}catch(n){e===mn&&!(n instanceof Nn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===mn&&(Yt=!1,mo())}};k("layout-lock").onclick=()=>{ce||(bt.cancel(),Pe=void 0,Ie(),Lt=!Lt,ft(),gn())};k("selected-edges-only").onchange=()=>{const e=ne();!e||ce||de||ke===e||(bt.cancel(),Pe=void 0,Ie(),e.selectedEdgesOnly=k("selected-edges-only").checked,uo(),xe())};k("show-exceptions").onchange=()=>{const e=ne();!e||ce||de||ke===e||(bt.cancel(),Pe=void 0,Ie(),e.showExceptions=k("show-exceptions").checked,uo(),xe())};k("prefer-write").onchange=()=>{ce||(Ie(),M.preferWrite=k("prefer-write").checked,gn(),xe())};k("theme").onclick=()=>{ce||(M.dark=!M.dark,ft(),xe())};k("drawer").onclick=()=>{ce||!ne()||(Ie(),M.drawer=!M.drawer,je(),xe())};for(const[e,t]of[["in",Js],["out",1/Js]])k(e).onclick=()=>{const n=ne();if(n&&ke!==n){const o=Ie(),i=Ic({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,je(),xe(180,s)}};const Ce=k("viewport");function Ta(e,t){const n=ne();if(!n||de||ke===n)return;Ie();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Ht();const i=Array.from(k("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),uo()}const un=Ac({read:()=>{const e=ne();return e&&!de&&e!==ke&&!Lt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[Ce.scrollLeft,Ce.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>ne()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=Ce.getBoundingClientRect(),t=e.left+Ce.clientLeft,n=e.top+Ce.clientTop,o={left:t,top:n,right:t+Ce.clientWidth,bottom:n+Ce.clientHeight};for(const[s,a]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const l=k(s),u=l.getBoundingClientRect();l.hidden||u.bottom<=n||u.top>=o.bottom||(a==="right"&&u.left>o.left&&u.left<o.right&&(o.right=u.left),a==="left"&&u.right>o.left&&u.right<o.right&&(o.left=u.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:Ta,pan:e=>{const t=ne();if(!t||t===ke||Lt)return;Ie();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Bt(t),Ce.scrollLeft=t.scroll[0],Ce.scrollTop=t.scroll[1],Ie(),Ht()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),bt=Sc(Ce,{nodeDrag:un,read:()=>{const e=ne();return e&&!de&&ke!==e?{key:e.key,zoom:e.zoom,locked:Lt,scroll:[Ce.scrollLeft,Ce.scrollTop]}:void 0},position:e=>ne()?.positions[e],change:e=>{const t=ne();if(!t||de||ke===t)return;const n=t.scroll;let o=!1;e.node&&Ta(e.node.id,e.node.position),e.selected&&(pt().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Jn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?gn():e.zoom!==void 0&&Bt(t),e.scroll&&(Ce.scrollLeft=e.scroll[0],Ce.scrollTop=e.scroll[1]),Ie(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ht()},finish:()=>{const e=ne();e&&Bt(e),Ie(),xe(180,!1)}}),Ls=()=>{bt.cancel(),Pe=void 0,Ie(),xe(0,!1)};window.addEventListener("blur",Ls);window.addEventListener("pagehide",Ls);document.addEventListener("visibilitychange",()=>{document.hidden&&Ls()});Ce.onscroll=()=>{Ie()};let Pe;xc(Ce,{read:()=>{const e=ne();return e&&!ce&&!de&&e!==ke?{zoom:e.zoom,scroll:[Ce.scrollLeft,Ce.scrollTop]}:void 0},change:e=>{const t=ne();!t||de||t===ke||(bt.cancel(),un.cancel(),Pe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Bt(t),Ce.scrollLeft=t.scroll[0],Ce.scrollTop=t.scroll[1],Ie(!1),Ht(),xe(180,!1))}});Ce.onpointerdown=e=>{const t=ne(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||de||t===ke||n&&!Lt||(Pe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[Ce.scrollLeft,Ce.scrollTop],node:n,moved:!1},Ce.setPointerCapture(e.pointerId))};Ce.onpointermove=e=>{if(Pe&&Pe.pointer===e.pointerId&&Pe.key===ne()?.key&&ne()!==ke){const t=e.clientX-Pe.x,n=e.clientY-Pe.y;Math.hypot(t,n)>3&&(Pe.moved=!0),Ce.scrollLeft=Pe.scroll[0]-t,Ce.scrollTop=Pe.scroll[1]-n,Ie()}};Ce.onpointerup=e=>{if(!Pe||Pe.pointer!==e.pointerId)return;const t=ne(),n=Pe;Pe=void 0,Ce.hasPointerCapture?.(e.pointerId)&&Ce.releasePointerCapture(e.pointerId),t&&t!==ke&&n.key===t.key&&!n.moved&&n.node&&(pt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ht()),Jn(n.node),gn()),Ie(),xe(180,!1)};Ce.onpointercancel=()=>{Pe=void 0};Ce.addEventListener("lostpointercapture",e=>{e.target===Ce&&Pe?.pointer===e.pointerId&&(Pe=void 0)});let bi=!1;k("resize").onpointerdown=e=>{ce||(bi=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(bi){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==M.width&&(M.width=t,Ht()),ft()}};k("resize").onpointerup=()=>{bi=!1,xe(180,!1)};k("resize").onpointercancel=()=>{bi=!1,xe(180,!1)};k("resize").onkeydown=e=>{if(!ce&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,M.width+(e.key==="ArrowLeft"?20:-20)));t!==M.width&&(M.width=t,Ht()),ft(),xe(180,!1)}};window.addEventListener("resize",()=>{ft();const e=ne();e&&Bt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=ne();t&&Bt(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function Wo(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=nn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Bn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const _n=document.createElement("section");_n.id="source-update-notice";_n.className="info-bar";_n.hidden=!0;_n.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(_n);let An;const Pa=new Set;let Di=0,rs,Ti;function gi(){const e=M.document;_n.hidden=!An||An.key!==e?.key||An.baseline!==e.design.markdown||Pa.has(e.key),k("source-update-refresh").disabled=ce||De||de||!!(e&&Zt.has(e.key))}k("source-update-close").onclick=()=>{An&&Pa.add(An.key),gi()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function wo(){const e=M.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Ti===t)return;Ti=t;const n=++Di,o=e.key,i=e.source.url,s=e.design.markdown;try{const a=await bs(i);if(n!==Di||M.document?.key!==o||M.document.design.markdown!==s||M.document.source?.kind!=="url"||M.document.source.url!==i)return;nn(a),An=a.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,gi()}catch{}finally{n===Di&&(Ti=void 0)}}Fe=zd(Et,{rightDrawer:{isOpen:()=>M.drawer,isReady:()=>!ce,setOpen:e=>{ce||(M.drawer=e,ft(),xe())}},capture:()=>{Ie(),bt.cancel(),Pe=void 0},business:()=>({key:M.document?.design.namedPlans?JSON.stringify([M.document.key,M.document.design.namedPlans.selected]):M.document?.key,design:M.document?.design,relatedChecks:M.tabs[0]?hl(M.tabs[0]):[],viewKey:ne()?.key,views:M.tabs.map(e=>({key:e.key,name:e.name,activity:Jo(e),object:_o(e)})),activities:M.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:M.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:M.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!M.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=M.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{os(e),Uo(e)},openObject:e=>{ja(e),Uo(e)},openOverview:()=>{M.tabs[0]&&(Ie(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),xe())},activateView:e=>{M.tabs.some(t=>t.key===e)&&(Ie(),M.active=e,je(),xe())},statePanel:e=>M.document?Vd(M.document.design,e,t=>{Fe?.activateBusiness(),os(t),Uo(t),Fe?.businessActivated()}):void 0,closeLegacyList:()=>{M.nodeDrawer=!1,ft()},refresh:()=>{ft(),Xi.update()}});const ju=M;je();tt();Yd().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const c of t.recovery??[])Wo(c);if(t.document){const c={...t.document};Wo(c),t.document.design=c.design,t.document.checks=c.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const c of t.tabs)Wo(c)}const n=ol(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(c=>({...c,name:n.document.name,design:c.design,checks:c.checks,source:c.source,draft:c.draft,edited:c.edited,handle:c.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const c of o.tabs)Wo(c);if(new Set(o.tabs.map(c=>c.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const c of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!c||!c.positions||typeof c.positions!="object"||Array.isArray(c.positions)||c.selectedEdgesOnly!==void 0&&typeof c.selectedEdgesOnly!="boolean"||c.showExceptions!==void 0&&typeof c.showExceptions!="boolean"||c.hiddenNodes!==void 0&&(!Array.isArray(c.hiddenNodes)||!c.hiddenNodes.every(r=>typeof r=="string"))||c.viewInset!==void 0&&(!Array.isArray(c.viewInset)||c.viewInset.length!==2||!c.viewInset.every(r=>Number.isFinite(r)&&r>=0))||c.canvasOrigin!==void 0&&(!Array.isArray(c.canvasOrigin)||c.canvasOrigin.length!==2||!c.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(c.scroll)||c.scroll.length!==2||!c.scroll.every(Number.isFinite)||!Number.isFinite(c.zoom)||c.zoom<.25||c.zoom>2.5||!Object.values(c.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:a,...l}=o,u=c=>({...c,hiddenNodes:c.hiddenNodes??(o.scopeOutside==="hide"?c.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});M=Ut({...l,tabs:o.tabs.map(u)},n.recovery,n.document,o.tabs.map(c=>{const{design:r,checks:f,source:d,draft:p,edited:g,handle:m,name:h,...x}=u(c);return x})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(M.sampleLayout={...o.sampleLayout,hiddenNodes:nn(ys).graph.nodes.filter(c=>!c.scope).map(c=>c.id)}),M.tabs.some(c=>c.key===M.active)||(M.active=M.tabs[0]?.key),ne()?.selected&&Jn(ne().selected),rs=M.document?.key,je(),vs=!0}).catch(()=>{M=ju,Hn=!0,ws()}).finally(()=>{ce=!1,je(),tt(),Os().then(()=>{M.document?.key===rs&&wo()})});
