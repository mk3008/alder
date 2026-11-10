import{L as Nr,D as Ka,G as Ja,W as _a,P as Xa,l as On,X as jr,C as Za,n as Ya,S as Mr,o as Lr,p as Rr,M as Dr,q as Tr,s as Pr,t as is,g as ss,r as Ri,d as qr,b as Uo,u as rs,U as Wr,B as Qa,v as ec,w as tc,x as nc,y as zr,z as $r,A as Di,E as oc,m as as,F as ic,H as Ur,I as sc,j as rc,J as Bs,K as ac,T as cc,N as dc,O as lc,R as uc,Q as fc,V as pc,Y as mc,_ as hc,$ as bc,a0 as gc,Z as Hs,k as yc,i as vc,h as wc,f as kc,a as Ic,a1 as Sc,a2 as xc,a3 as Fr,a4 as Ac,a5 as Ec,e as Cc}from"./canvas-toolbar-aYSe-n1e.js";const Oc={subsystems:{full:"サブシステム",icon:Xa},business:{full:"業務設計",icon:_a},states:{full:"状態遷移",icon:Ja},concept:{full:"データ構造",icon:Ka},tests:{full:"テスト仕様",icon:Nr}};function Ti(e,t,n){const o=Oc[t],i=document.createElement("span"),s=document.createElement("span"),r=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(On(o.icon,{"aria-hidden":"true","stroke-width":1.8})),r.className="view-tab-name",r.textContent=n,i.append(s,r),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function Pi(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(On(jr,{"aria-hidden":"true","stroke-width":1.8})),t}function Nc(e){const t=On(e?Za:Ya,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function jc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,r=Math.max(0,Math.min(n,s+o*i));r!==s&&(e.scrollLeft=r,t.preventDefault())},{passive:!1})}function Mc(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const Lc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Gs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=Lc,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const r=On(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&r.classList.add(s),t.querySelector(o)?.append(r)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",Mr),n(".layout-lock",Lr,"lock-closed"),n(".layout-lock",Rr,"lock-open"),n(".zoom-out",Dr),n(".zoom-in",Tr)}function Ks(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Rc({model:e}){const t=Object.fromEntries(e.concepts.map(u=>[u.id,{name:u.name,note:u.description,fields:u.information.map(c=>["",c.name+(c.responsibleSubsystemId&&c.responsibleSubsystemId!==u.subsystemId?"（担当："+e.subsystems.find(a=>a.id===c.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind]),o=e.reviewGroups.map(u=>({id:u.id,name:u.title,purpose:u.description,activities:u.relatedActivityIds,concepts:Object.fromEntries(u.graph.nodes.map(c=>[c.conceptId,{name:c.name,note:c.description,fields:c.fields.map(a=>["",a]),sources:c.sources,sourceActivities:c.sourceActivityIds}])),relations:u.graph.edges.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind])})),i=u=>o.find(c=>c.id===u),s=(u,c)=>{const a=Object.fromEntries(u.nodes.map(p=>[p.id,{...c[p.conceptId],name:p.name,note:p.description,sources:p.sources,conceptId:p.conceptId,subsystemId:p.subsystemId,fields:p.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(p=>u.nodes.some(g=>g.subsystemId===p.id)).map(p=>({id:p.id,name:p.name})),d=u.handoffIds.map(p=>e.handoffs.find(g=>g.id===p)).map(p=>({id:p.id,from:p.fromSubsystemId,to:p.toSubsystemId,label:p.information,returning:p.flowDirection==="return"}));return{ids:u.nodes.map(p=>p.id),tables:a,edges:u.edges.map(p=>[p.fromViewId,p.toViewId,p.fromLabel,p.toLabel,p.kind]),regions:f,handoffs:d}};return{tables:t,edges:n,groups:o,findGroup:i,graph:u=>{const c=i(u);if(!c)throw Error("Unknown review group: "+u);const a=e.reviewGroups.find(p=>p.id===u),f=a.graph.subsystemViews;if(f)return s(f,c.concepts);const d=Object.keys(t).filter(p=>Object.hasOwn(c.concepts,p));return{ids:d,tables:c.concepts,edges:c.relations.filter(([p,g])=>d.includes(p)&&d.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function dt(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Dc(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",dt(o,"span",t),o.onclick=n,e.append(o),o}function Tc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Pc(e,t,n,o=()=>{},i=()=>{},s=[]){const r=n.contentFor(t.id);if(e.replaceChildren(),!r)return;dt(e,"p",r.description).className="review-description",dt(e,"h3","Activity");const l=document.createElement("ul");l.className="review-related-activities";for(const u of r.relatedActivities){const c=document.createElement("li"),a=s.find(d=>d.id===u.id&&d.name===u.name),f=Dc(c,u.name,()=>{a&&i(a.id)});f.disabled=!a,f.setAttribute("aria-label",u.name+"を業務タブで開く"),l.append(c)}e.append(l),dt(e,"h3","情報の構造");for(const u of r.structureStatements){const c=document.createElement("section");c.className="review-structure",c.dataset.structure=u.id,dt(c,"h4",u.title),dt(c,"p",u.description),e.append(c)}dt(e,"h3","できること");for(const u of r.capabilities){const c=document.createElement("section");c.className="review-capability",c.dataset.capability=u.id,dt(c,"h4",u.title),dt(c,"p",u.description);for(const a of u.samples){const f=o(u.id,a.id),d=document.createElement("button");d.className="review-sample-link",d.type="button",d.dataset.sample=a.id,d.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+a.name,f?d.onclick=f.open:(d.disabled=!0,d.title="対応するテスト仕様へのリンクがありません"),c.append(d)}e.append(c)}dt(e,"h3","できないこと（業務上のルール）");for(const u of r.limitations){const c=document.createElement("section");c.className="review-limitation",dt(c,"h4",u.title),dt(c,"p",u.description),dt(c,"h5","理由"),dt(c,"p",u.reason),e.append(c)}}function an(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function qc({model:e,business:t}){const n=r=>r.kind==="group"?e.subsystems.find(l=>l.id===r.id):e.handoffs.find(l=>l.id===r.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(r){const l=n(r);return l?l.activityIds.map(u=>t.activities.find(c=>c.id===u)).filter(Boolean):[]}function s(r,l){if(r.replaceChildren(),l.kind==="group"){const f=e.subsystems.find(p=>p.id===l.id);if(!f)return"";an(r,"p",f.purpose),an(r,"h3","扱う情報");const d=r.ownerDocument.createElement("ul");for(const p of f.information)an(d,"li",p);return r.append(d),an(r,"h3","まとまりの理由"),an(r,"p",f.reason),f.name}const u=e.handoffs.find(f=>f.id===l.id);if(!u)return"";an(r,"p",u.description),an(r,"h3","出元と受取先");const c=e.subsystems.find(f=>f.id===u.fromSubsystemId),a=e.subsystems.find(f=>f.id===u.toSubsystemId);return an(r,"p",`${c.name} → ${a.name}`),u.information}return{sections:o,activities:i,describe:s}}function Ai(e,t,n,o="right"){const i=o==="left",s=document.createElement("div");s.className=i?"explorer-drawer-resize":"concept-drawer-resize",s.tabIndex=0,s.setAttribute("role","separator"),s.setAttribute("aria-orientation","vertical"),s.setAttribute("aria-label",i?"エクスプローラーの幅":"補足情報の幅"),e.prepend(s);let r=i?280:440;try{const a=Number(sessionStorage.getItem(n));Number.isFinite(a)&&a>=280&&(r=a)}catch{}const l=i?Array.from(t.querySelectorAll("#formattedMarkdownDrawer,.concept-related,.spec-related")):[t.querySelector("#design-explorer")].filter(a=>!!a),u=()=>{let a=t.clientWidth||innerWidth;if(innerWidth>800){const f=l.find(d=>!d.hidden);f&&(a-=f.offsetWidth)}return Math.max(280,Math.min(1e3,a-(innerWidth>800?240:16)))},c=(a,f=!1)=>{if(r=Math.max(280,Math.min(u(),a)),e.style.setProperty(i?"--explorer-drawer-width":"--concept-drawer-width",r+"px"),s.setAttribute("aria-valuemin","280"),s.setAttribute("aria-valuemax",String(u())),s.setAttribute("aria-valuenow",String(Math.round(r))),f)try{sessionStorage.setItem(n,String(r))}catch{}};if(s.onkeydown=a=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(a.key))return;a.preventDefault();const f=a.key==="ArrowLeft"?-1:1;c(a.key==="Home"?280:a.key==="End"?u():r+f*(i?40:-40),!0)},s.onpointerdown=a=>{if(a.button!==0)return;a.preventDefault();const f=a.clientX,d=r;s.setPointerCapture(a.pointerId),s.classList.add("resizing"),s.onpointermove=p=>c(d+(i?p.clientX-f:f-p.clientX)),s.onpointerup=()=>{s.onpointermove=null,s.onpointerup=null,s.onpointercancel=null,s.classList.remove("resizing"),c(r,!0)},s.onpointercancel=s.onpointerup},typeof ResizeObserver<"u"){const a=new ResizeObserver(()=>c(r));a.observe(t);for(const f of l)a.observe(f)}window.addEventListener("resize",()=>c(r)),c(r)}const Wc=260,zc=68,$c="http://www.w3.org/2000/svg",Wt=(e,t,n={})=>{const o=e.createElementNS($c,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function Uc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(On(Wr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Fc(e,{model:t,business:n},o,i,s){const r=t.reviewGroups,l=t.subsystems,u=t.presentation.landscapeRelationships.map(I=>{const y=r.find(R=>R.id===I.from),W=r.find(R=>R.id===I.to);if(!y||!W||y.subsystemId!==W.subsystemId||!t.presentation.reviewBoundaries.some(R=>R.from===I.from&&R.to===I.to))throw Error("Unknown overview relationship: "+I.from+" -> "+I.to);return I}),c=t.handoffs.map(I=>{if(!["forward","return"].includes(I.flowDirection))throw Error("Unknown overview handoff direction: "+I.id);return{id:I.id,from:I.fromSubsystemId,to:I.toSubsystemId,label:I.information,returning:I.flowDirection==="return"}});if(new Set(c.map(I=>I.id)).size!==c.length)throw Error("Duplicate overview handoff");for(const I of c)if(!l.some(y=>y.id===I.from)||!l.some(y=>y.id===I.to)||I.from===I.to||!I.label.trim())throw Error("Unknown overview handoff: "+I.id);for(const I of r){if(!l.some(y=>y.id===I.subsystemId))throw Error("Unknown overview subsystem: "+I.id);if(!n.roles?.some(y=>y.id===I.reviewer.roleId))throw Error("Unknown overview reviewer: "+I.id)}const a=l.flatMap(I=>r.filter(y=>y.subsystemId===I.id)),f=new Map;let d=0;for(const[I,y]of l.entries())for(const W of a.filter(R=>R.subsystemId===y.id))f.set(W.id,[80+d*170,100+d*120+I*64]),d++;const p=is(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let h,m;try{const I=JSON.parse(localStorage.getItem(g)||"null"),y=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),W=!I&&y?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,R=I??W;if(R){typeof R.zoom=="number"&&Number.isFinite(R.zoom)&&(p.zoom=Math.max(.25,Math.min(2.5,R.zoom))),Array.isArray(R.scroll)&&R.scroll.length===2&&R.scroll.every(q=>typeof q=="number"&&Number.isFinite(q))&&(p.scroll=R.scroll),typeof R.locked=="boolean"&&(p.locked=R.locked);for(const[q,H]of Object.entries(R.positions??{}))r.some(S=>S.id===q)&&Array.isArray(H)&&H.length===2&&H.every(S=>typeof S=="number"&&Number.isFinite(S))&&p.positions.set(q,[H[0],H[1]])}const E=R?.selection,P=E?.kind==="node"?t.concepts.find(q=>q.id===E.id)?.subsystemId:E?.id,T=E?.kind==="node"?"group":E?.kind;typeof P=="string"&&(T==="model"&&r.some(q=>q.id===P)||T==="group"&&l.some(q=>q.id===P)||T==="connection"&&c.some(q=>q.id===P))&&(m={kind:T,id:P}),m?.kind==="model"&&(p.selected=m.id)}catch{}const A=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:p.zoom,scroll:p.scroll,locked:p.locked,positions:Object.fromEntries(p.positions),selection:m}))}catch{}},j=I=>{if(!I&&!m)return;m=I,p.selected=I?.kind==="model"?I.id:void 0;const y=h?.querySelector(".diagram-world>svg");y&&w(y),A()},w=I=>{const y=Uo(u,p.selected),W=Uo(c,m?.kind==="group"?m.id:void 0);for(const R of r){const E=I.querySelector(`[data-node="${R.id}"]`);E?.setAttribute("class","node graph-shape state-shape"+y.nodeClasses(R.id)),E?.setAttribute("aria-pressed",String(p.selected===R.id))}for(const R of l){const E=I.querySelector(`[data-subsystem="${R.id}"]`);E?.setAttribute("class","subsystem-overview-group"+W.nodeClasses(R.id)),E?.querySelector("button")?.setAttribute("aria-pressed",String(m?.kind==="group"&&m.id===R.id))}for(const R of u){const E=I.querySelector(`[data-overview-from="${R.from}"][data-overview-to="${R.to}"]`);E?.setAttribute("class","edge"+(y.related(R)?" review-related":"")),E?.setAttribute("marker-end",`url(#overview-${y.related(R)?"related-arrow":"arrow"})`)}for(const R of c){const E=W.related(R)||m?.kind==="connection"&&m.id===R.id,P=I.querySelector(`[data-handoff-id="${R.id}"]`);P?.setAttribute("class","edge"+(R.returning?" exception":"")+(E?" review-related":"")),P?.setAttribute("marker-end",`url(#overview-${E?"related-arrow":"arrow"})`),I.querySelector(`[data-handoff-label="${R.id}"]`)?.classList.toggle("review-related",!!E)}I.querySelectorAll("[data-exception-paint]").forEach(R=>R.remove());for(const R of Array.from(I.querySelectorAll("[data-handoff-id].exception")))rs(I,R,{path:R.getAttribute("d")},{"data-overview-return-paint":R.getAttribute("data-handoff-id")})};return h=Pr(e,I=>{const y=a.map(T=>{const q=I.positions.get(T.id)??f.get(T.id);return{id:T.id,x:q[0],y:q[1],width:Wc,height:zc}}),W=Wt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});W.append(ss("overview-"));let R=0,E=0;const P=[];for(const T of l){const q=y.filter(re=>r.find(ae=>ae.id===re.id)?.subsystemId===T.id);if(!q.length)continue;const H=Math.min(...q.map(re=>re.x))-30,S=Math.min(...q.map(re=>re.y))-48,Z=Math.max(...q.map(re=>re.x+re.width))-H+30,x=Math.max(...q.map(re=>re.y+re.height))-S+30;P.push({id:T.id,x:H,y:S,width:Z,height:x});const D=Wt(e,"g",{"data-subsystem":T.id,"aria-label":T.name}),te=Wt(e,"rect",{x:H,y:S,width:Z,height:x,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});te.addEventListener("click",()=>j({kind:"group",id:T.id})),D.append(te);const X=Wt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:H+8,y:S+3,width:Z-16,height:36}),be=e.createElement("button");be.type="button",be.className="subsystem-overview-region-title",be.setAttribute("aria-label",T.name+"を選択"),be.textContent=T.name,be.onclick=()=>j({kind:"group",id:T.id}),X.append(be),D.append(X),W.append(D),R=Math.max(R,H+Z+40),E=Math.max(E,S+x+40)}for(const[T,q]of c.entries()){if(!P.some(D=>D.id===q.from)||!P.some(D=>D.id===q.to))throw Error("Missing overview handoff region: "+q.id);const H=Math.max(30,q.label.length*12),S=Ri({from:q.from,to:q.to,nodes:P,index:T,kind:"input",matrix:{returning:q.returning,captionLane:0},labelWidth:H,labelHeight:18}),Z=Wt(e,"path",{d:S.path,class:"edge"+(q.returning?" exception":""),"data-handoff-id":q.id,"data-from-subsystem":q.from,"data-to-subsystem":q.to,"data-flow-direction":q.returning?"return":"forward","marker-end":"url(#overview-arrow)"});W.append(Z);const x=Wt(e,"text",{x:S.label[0]-H/2,y:S.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":q.id});x.textContent=q.label,x.addEventListener("pointerdown",D=>D.stopPropagation()),x.addEventListener("pointerup",D=>D.stopPropagation()),x.addEventListener("click",()=>j({kind:"connection",id:q.id})),x.addEventListener("keydown",D=>{(D.key==="Enter"||D.key===" ")&&(D.preventDefault(),j({kind:"connection",id:q.id}))}),W.append(x),R=Math.max(R,S.bounds.right+40,S.label[0]+H/2+30),E=Math.max(E,S.bounds.bottom+40,S.label[1]+30)}for(const[T,q]of u.entries()){const H=Ri({from:q.from,to:q.to,nodes:y,index:T,kind:"input",labelWidth:0,labelHeight:0}),S=Wt(e,"path",{d:H.path,class:"edge","data-overview-from":q.from,"data-overview-to":q.to,"marker-end":"url(#overview-arrow)"});W.append(S),R=Math.max(R,H.bounds.right+40),E=Math.max(E,H.bounds.bottom+40)}for(const T of y){const q=r.find(ae=>ae.id===T.id),H=n.roles.find(ae=>ae.id===q.reviewer.roleId),S=Wt(e,"g",{role:"button",tabindex:0,"aria-label":q.title+"を選択","aria-pressed":"false","data-node":T.id,"data-review-group":T.id,"data-subsystem-id":q.subsystemId,class:"node graph-shape state-shape"}),Z=qr(e,T);Z.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),S.append(Z,Wt(e,"rect",{x:T.x,y:T.y,width:T.width,height:T.height,rx:8,class:"state-diagram-node"}));const D=Wt(e,"foreignObject",{x:T.x,y:T.y,width:T.width,height:T.height}),te=e.createElement("div");te.className="subsystem-overview-card";const X=Uc(e,H.color),be=e.createElement("span");be.className="subsystem-overview-labels",be.title=q.title+" — "+H.name;for(const[ae,C,z]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",q.title],["small","subsystem-overview-role",H.name]]){const B=e.createElement(ae);B.className=C,B.textContent=z,be.append(B)}const re=e.createElement("button");re.type="button",re.className="subsystem-overview-open",re.setAttribute("aria-label",q.title+"の詳細タブを開く"),re.title="詳細タブを開く",re.textContent="開く",re.onpointerdown=ae=>ae.stopPropagation(),re.onpointerup=ae=>ae.stopPropagation(),re.onclick=ae=>{ae.stopPropagation(),i(q.id)},te.append(X,be,re),D.append(te),S.append(D),S.addEventListener("click",()=>j({kind:"model",id:T.id})),S.addEventListener("keydown",ae=>{(ae.key==="Enter"||ae.key===" ")&&(ae.preventDefault(),j({kind:"model",id:T.id}))}),W.append(S)}return W.setAttribute("viewBox",`0 0 ${R} ${E}`),w(W),W},p,A,()=>j(void 0)),h.classList.add("subsystem-overview-canvas"),h.addEventListener("click",A),h.addEventListener("pointerup",()=>queueMicrotask(A)),h.querySelector(".diagram-viewport")?.addEventListener("scroll",A),{root:h,selected:()=>p.selected,selection:()=>m,restore:()=>{const I=()=>{const y=h.querySelector(".diagram-viewport");y.scrollLeft=p.scroll[0],y.scrollTop=p.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(I):I()}}}function Vc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(r=>r.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function Bc({model:e,business:t}){const n=g=>{const h=t.activities.find(m=>m.id===g);if(!h)throw Error("Unknown activity: "+g);return h},o=g=>{const h=t.roles?.find(m=>m.id===g);if(!h)throw Error("Unknown role: "+g);return h.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(h=>{const m=n(h);return{id:m.id,name:m.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(h=>({...h,samples:h.samples.map(Vc)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(h=>h.id===g),r=(g,h)=>s(g)?.capabilities.find(m=>m.samples.some(A=>A.id===h)),l=i.flatMap(g=>g.capabilities.flatMap(h=>h.samples.map(m=>({...m,group:g.id})))),u=["yellow","cyan","green","blue","purple","orange"];function c(g,h,m){let A=m.get(h);if(A||(A=u[m.size]??`extra-${m.size}`,m.set(h,A)),g.dataset.sampleKey=h,g.dataset.keyTone=A,g.className="data-example-key",A.startsWith("extra-")){const j=(Number(A.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${j} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${j} 24% 25%)`)}}const a=g=>l.filter(h=>h.group===g),f=(g,h)=>a(g).find(m=>m.id===h);function d(g,h,m){const A=g.ownerDocument.createElement(h);return A.textContent=m,g.append(A),A}function p(g,h,m,A,j){const w=g.ownerDocument,L=f(h.id,m);if(!L)throw Error("Unknown data example: "+m);g.replaceChildren(),g.dataset.dataExample=m;const I=new Map;e.presentation.sampleCaption&&(d(g,"p",e.presentation.sampleCaption).className="data-example-caption");const y=s(h.id)?.capabilities??[],W=j?.capabilityId?y.filter(q=>q.id===j.capabilityId):y;if(j?.capabilityId&&!W.some(q=>q.samples.some(H=>H.id===m)))throw Error("Sample does not belong to capability: "+m);const R=r(h.id,m);g.dataset.capability=R.id;const E=()=>{d(g,"h2",j?.heading?.trim()||R.title),j?.renderSpecification?j.renderSpecification(g):d(g,"p",R.description).className="data-example-capability"};j?.capabilityId&&!j.hideCapability&&E();const P=w.createElement("label");P.className="data-example-picker",d(P,"span","場面");const T=w.createElement("select");T.setAttribute("aria-label","データ例の場面");for(const q of W){let H=T;if(!j?.capabilityId){const S=w.createElement("optgroup");S.label=q.title,T.append(S),H=S}for(const S of q.samples){if(j?.sampleIds&&!j.sampleIds.includes(S.id))continue;const Z=w.createElement("option");Z.value=S.id,Z.textContent=S.name,H.append(Z)}}if(T.value=m,T.onchange=()=>A(T.value),P.append(T),(!j?.hideSinglePicker||T.options.length>1)&&g.append(P),!j?.capabilityId&&!j?.hideCapability&&E(),d(g,"h3",L.name).className="data-example-scene",j?.collapseScenario&&L.when){const q=w.createElement("details");q.className="data-example-context",d(q,"summary","場面の背景"),d(q,"p",L.when).className="data-example-when",g.append(q)}else d(g,"p",L.when).className="data-example-when";d(g,"p",L.meaning).className="data-example-meaning";for(const q of L.blocks){const H=w.createElement("section");H.className="data-example-block",H.dataset.exampleCard=q.card,d(H,"h3",h.concepts[q.card].name);const S=w.createElement("div");S.className="data-example-table",S.tabIndex=0,S.setAttribute("role","region"),S.setAttribute("aria-label",h.concepts[q.card].name+"のデータ表");const Z=w.createElement("table");Z.setAttribute("aria-label",h.concepts[q.card].name+"のデータ例");const x=w.createElement("caption");x.textContent=h.concepts[q.card].name+"に入る情報",Z.append(x);const D=w.createElement("thead"),te=w.createElement("tr");for(const be of q.columns)d(te,"th",be).setAttribute("scope","col");D.append(te),Z.append(D);const X=w.createElement("tbody");for(const[be,re]of q.rows.entries()){const ae=w.createElement("tr");for(const[C,z]of re.entries()){const B=d(ae,"td",String(z)),fe=q.keyIds[be][C];fe&&(c(B,fe,I),B.title=q.columns[C]+"："+z)}X.append(ae)}Z.append(X),S.append(Z),H.append(S),q.rows.length||d(H,"p",q.empty??"データはありません。"),g.append(H)}L.note&&(d(g,"p",L.note).className="data-example-note")}return{reviewContents:i,dataExamples:l,contentFor:s,capabilityFor:r,examplesFor:a,findDataExample:f,renderDataExample:p}}function cs(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function Hc(e,t,n){return cs(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Gc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function xn(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const r=(l,u)=>{for(const c of u.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(c.startsWith("**")&&c.endsWith("**")){const a=document.createElement("strong");a.textContent=c.slice(2,-2),l.append(a)}else if(c.startsWith("`")&&c.endsWith("`")){const a=document.createElement("code");a.textContent=c.slice(1,-1),l.append(a)}else l.append(document.createTextNode(c))};for(const l of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const u=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(l);if(u&&!o){o=u[1],s=void 0;const d=document.createElement("pre");i=document.createElement("code"),d.append(i),n.append(d);continue}if(u&&u[1][0]===o[0]&&u[1].length>=o.length&&!u[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(l+`
`));continue}if(!l.trim()){s=void 0;continue}const c=/^(#{1,6}) (.*)$/.exec(l),a=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(l);if(a){s||(s=document.createElement(/^\s*\d/.test(l)?"ol":"ul"),n.append(s));const d=document.createElement("li");r(d,a[1]),s.append(d);continue}s=void 0;const f=document.createElement(c?"h"+c[1].length:"p");r(f,c?c[2]:l),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Me={type:"string"},_={type:"string",minLength:1,pattern:"\\S"},K={type:"string",pattern:"^[A-Za-z0-9_-]+$"},pn=e=>({anyOf:[e,{type:"null"}]}),Y=e=>({type:"array",items:e}),ie=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Kc=e=>({$ref:"#/$defs/"+e}),Tn=Y({anyOf:[ie({kind:{enum:["text"]},value:Me}),ie({kind:{enum:["reference"]},targetId:K,label:Me}),ie({kind:{enum:["link"]},uri:_,label:Me})]}),Js=ie({id:K,name:_,scope:{type:"boolean"}}).properties,Jc=ie({id:K,kind:{enum:["input","output","business-exception","object-exception"]},fromId:K,toId:K,label:_}),_c=ie({id:K,sourceId:K,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:Y(K),unresolvedTargets:Y(_),summary:_,content:_}),qi=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:_,title:_,preface:Me,scope:Me,objects:Y(ie({...Js,icon:_,information:Y(_)})),activities:Y(ie({...Js,why:_,when:_,who:_,where:_,procedure:_,exception:pn(_),result:_,problem:pn(_),painLevel:pn({enum:["Low","Medium","High"]})})),relations:Y(Jc),findings:Y(_c)}),Xc=ie({id:K,name:_,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Vr=ie({...qi.properties,schemaVersion:{enum:["0.2"]},roles:Y(Xc),activities:Y(ie({...qi.properties.activities.items.properties,roleId:pn(K)}))}),Zc=ie({...Vr.properties,schemaVersion:{enum:["0.3"]},exceptions:Y(ie({id:K,activityId:K,name:_,description:Me}))}),Yc=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Tn])),Qc=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:_,title:_,basedOn:ie({documentId:K,revision:_,verification:{enum:["unverified"]}}),intro:Tn,index:Y(ie({activityId:K,purpose:Me,connections:Me,checkIds:Y(K)})),sections:Y(ie({id:K,activityId:pn(K),title:_,preamble:Tn})),guarantees:Y(ie({id:K,sectionId:K,title:_,blocks:Y({anyOf:[ie({kind:{enum:["prose"]},content:Tn}),ie({kind:{enum:["example"]},exampleId:K})]})})),examples:Y(ie({id:K,guaranteeId:K,columns:Y(_),rows:Y(Y(Tn))})),items:Y(ie({id:K,checkId:K,title:_,detailSummary:Me,sectionId:K,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:ie(Yc,[])})),notes:Y(ie({id:K,title:_,content:Tn}))}),ds=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:_,title:_,basedOn:ie({documentId:K,revision:_,verification:{enum:["unverified"]}}),objectId:K,states:Y(ie({id:K,name:_})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:_,transitions:Y(ie({id:K,sourceId:_,fromId:_,activityId:K,event:pn(_),exception:pn(_),condition:_,toId:_,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:_,note:_}))}),_s=Object.fromEntries(Object.entries({...ds.properties.transitions.items.properties,exceptionId:pn(K)}).filter(([e])=>e!=="exception")),ed=ie({...ds.properties,schemaVersion:{enum:["0.2"]},transitions:Y(ie({..._s,conditionLabel:_},Object.keys(_s)))}),ls=ie({documentId:K,revision:_,targetType:_,targetId:K,section:_}),td=ie({id:K,name:_,responsibilityStatus:_,responsibleSubsystemId:K},["id","name"]),nd=ie({id:K,name:_,subsystemId:K,information:Y(td),reason:Me,description:Me,businessObjectIds:Y(K),activityLinks:Y(ie({activityId:K,uses:Y(_)})),sourceRefs:Y(ls),reviewState:_}),od=ie({id:K,fromConceptId:K,toConceptId:K,fromPerTarget:_,toPerSource:_,condition:Me,reviewState:_,sourceRefs:Y(ls),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),id=ie({id:K,name:_,purpose:Me,information:Y(_),reason:Me,activityIds:Y(K),reviewState:_}),sd=ie({id:K,fromSubsystemId:K,toSubsystemId:K,information:_,description:Me,activityIds:Y(K),flowDirection:{enum:["forward","return"]},reviewState:_}),rd=ie({columnId:K,value:{anyOf:[Me,{type:"number"}]},linkId:_},["columnId","value"]),ad=ie({card:K,columns:Y(ie({id:K,name:_,informationId:K})),rows:Y(ie({id:K,cells:Y(rd)})),empty:Me},["card","columns","rows"]),Wi=ie({id:K,name:_,when:Me,meaning:Me,blocks:Y(ad),note:Me},["id","name","when","meaning","blocks"]),zi=ie({id:K,title:_,description:Me,meta:{},samples:Y(Wi)}),cd=ie({...Wi.properties,checkIds:{...Y(K),minItems:1,uniqueItems:!0}},[...Wi.required,"checkIds"]),dd=ie({decisionExampleIds:Y(K),decisionCheckIds:Y(K),resultCheckIds:Y(K),sampleIds:Y(K)}),ld=ie({...zi.properties,samples:Y(cd),testSpecification:dd},[...Object.keys(zi.properties)]),ud=ie({id:K,title:_,description:Me,reason:Me,meta:{}}),fd=ie({conceptId:K,name:_,fields:Y(_),description:Me,sources:Y(_),sourceActivityIds:Y(K)}),pd=ie({id:K,fromConceptId:K,toConceptId:K,relationIds:Y(K),scope:Me,fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),md=ie({id:K,conceptId:K,subsystemId:K,name:_,description:Me,sources:Y(_),fields:Y(ie({name:_,informationId:K}))}),hd=ie({id:K,fromViewId:K,toViewId:K,relationIds:Y(K),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),Br=ie({nodes:Y(md),edges:Y(hd),handoffIds:Y(K)}),Hr=ie({id:K,subsystemId:K,title:_,description:Me,reviewer:ie({roleId:K}),relatedActivityIds:Y(K),graph:ie({conceptIds:Y(K),nodes:Y(fd),edges:Y(pd),subsystemViews:Br},["conceptIds","nodes","edges"]),structureStatements:Y(ie({id:K,title:_,description:Me,sampleIds:Y(K),sourceRefs:Y(ls)})),capabilities:Y(zi),limitations:Y(ud),meta:ie({questions:Y(_),hypotheses:{}},["questions"])}),bd=ie({...Hr.properties,capabilities:Y(ld)}),Gr=ie({id:K,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:_,basedOn:ie({documentId:K,revision:_,verification:{enum:["unverified"]}}),relatedStates:Y(ie({documentId:K,revision:_,verification:{enum:["unverified"]}})),subsystems:Y(id),concepts:Y(nd),relations:Y(od),handoffs:Y(sd),reviewGroups:Y(Hr),benefits:Y(_),considerations:Y(_),reviewPoints:Y(_),meta:{},presentation:ie({activityViews:{},creatorActivityIds:{},sampleCaption:Me,subsystemViews:Br,landscapeRelationships:Y(ie({from:K,to:K})),reviewBoundaries:Y(ie({from:K,to:K,label:Me,promise:Me}))},["landscapeRelationships","reviewBoundaries"])}),gd=ie({...Gr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:Y(bd)}),Co=(e,t)=>ie({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:_,documents:Y({anyOf:t.map(Kc)}),sources:Y(ie({documentId:K,revision:_,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Me})),externalDocuments:Y(ie({id:K,kind:{enum:["businessDesign"]},revision:_,activities:Y(ie({id:K,name:_}))})),diagnostics:Y(_)}),Fo={anyOf:[Co("0.1",["businessDesign","checkItems"]),Co("0.2",["businessDesign","checkItems","stateTransition"]),Co("0.3",["businessDesignRoles","checkItems","stateTransition"]),Co("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:qi,businessDesignRoles:Vr,businessDesignStructured:Zc,checkItems:Qc,stateTransition:ds,stateTransitionStructured:ed,conceptModel:Gr,checkedConceptModel:gd}},V=(e,t)=>{if(!e)throw Error(t)};function Kr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const r=e[t++];if(r==='"')return JSON.parse(e.slice(s,t));r==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{V(s<=64,"JSON depth limit"),n();const r=e[t];if(r==='"'){o();return}if(r==="{"){t++,n();const u=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),V(e[t]==='"',"JSON object key required");const c=o();V(!u.has(c),"Duplicate JSON key: "+c),u.add(c),n(),V(e[t++]===":","JSON colon required"),i(s+1),n();const a=e[t++];if(a==="}")return;V(a===",","JSON comma required")}throw Error("Truncated object")}if(r==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const u=e[t++];if(u==="]")return;V(u===",","JSON array comma required")}throw Error("Truncated array")}const l=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;V(t>l,"JSON value required"),JSON.parse(e.slice(l,t))};return i(),n(),V(t===e.length,"Trailing JSON content"),JSON.parse(e)}function kn(e,t=Fo,n="$"){if(t.$ref)return kn(e,Fo.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{kn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&V(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;V(o===t.type,"Invalid type at "+n)}if(t.minLength&&V(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&V(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])V(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))V(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),kn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>kn(o,t.items,n+"["+i+"]"))}function yd(e){const t=new Map,n=new Map,o=new Map,i=(s,r,l)=>{V(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,r.id),o.set(s.id,l)};for(const s of e.documents){i(s,s,"document");for(const[r,l]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[r]??[])i(u,s,l)}for(const s of e.externalDocuments){i(s,s,"document");for(const r of s.activities)i(r,s,"activity")}return{map:t,owner:n,types:o}}function Vo(e){return kn(e),Jr(e)}function zn(e,t){const n=new Set(e.items.map(r=>r.id)),o=new Set,i=e.guarantees.find(r=>r.id===t.guaranteeId),s=r=>{if(Array.isArray(r)){for(const l of r)s(l);return}if(r&&typeof r=="object"){r.kind==="reference"&&n.has(r.targetId)&&o.add(r.targetId);for(const l of Object.values(r))l&&typeof l=="object"&&s(l)}};s(t.rows);for(const r of i?.blocks??[])r.kind==="prose"&&s(r.content);for(const r of e.items)(r.fields.guarantee??[]).some(u=>u.kind==="reference"&&(u.targetId===t.id||u.targetId===t.guaranteeId))&&o.add(r.id);return[...o]}function Jr(e,{allowUnresolvedFindings:t=!1}={}){V(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=yd(e),s=[...e.diagnostics],r=new Set;for(const d of e.sources)if(d.uri){const p=new URL(d.uri);V(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe source URI")}const l=(d,p,g)=>(V(n.has(d),"Dangling reference: "+d),p&&V(i.get(d)===p,"Reference type mismatch: "+d),g&&V(o.get(d)===g,"Cross-document mismatch: "+d),n.get(d)),u=d=>d?.some(p=>p.kind==="text"?p.value.trim().length>0:!0),c=(d,p)=>{for(const g of d)if(g.kind==="reference"&&(l(g.targetId,null,p),V(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const h=new URL(g.uri);V(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe external link")}};for(const d of e.documents)if(V(e.formatVersion!=="0.1"||d.kind!=="stateTransition","State documents require formatVersion 0.2"),d.kind==="businessDesign"){V(d.activities.length>0,"Activity required");const p=[...d.objects,...d.activities].map(m=>m.name);V(new Set(p).size===p.length,"Duplicate visible name"),V(p.every(m=>m===m.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(A=>m.includes(A))),"Invalid Graph-visible name");for(const m of d.objects)V(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.icon),"Invalid icon");if(["0.2","0.3"].includes(d.schemaVersion)){V(new Set(d.roles.map(m=>m.name)).size===d.roles.length,"Duplicate Role name"),V(d.roles.every(m=>m.name===m.name.trim()&&!/[\r\n]/.test(m.name)),"Invalid Role name");for(const m of d.activities)m.roleId!==null?l(m.roleId,"role",d.id):r.add("Role未確定: "+m.id+" — "+m.who)}for(const m of d.activities)V(m.problem===null==(m.painLevel===null),"Problem/Pain pair mismatch");for(const m of d.exceptions??[])l(m.activityId,"activity",d.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},h=new Set;for(const m of d.relations){l(m.fromId,g[m.kind][0],d.id),l(m.toId,g[m.kind][1],d.id);const A=JSON.stringify([m.kind,m.fromId,m.toId,m.label]);V(!h.has(A),"Duplicate relation"),h.add(A)}V(new Set(d.findings.map(m=>m.sourceId)).size===d.findings.length,"Duplicate Finding source ID");for(const m of d.findings){V(m.scope==="items"?m.targetIds.length+m.unresolvedTargets.length>0:!m.targetIds.length&&!m.unresolvedTargets.length,"Finding scope mismatch"),V(new Set(m.targetIds).size===m.targetIds.length,"Duplicate Finding target");for(const A of m.targetIds)l(A,null,d.id),V(["object","activity"].includes(i.get(A)),"Invalid Finding target");m.unresolvedTargets.length&&(V(t,"Unresolved Finding target: "+m.sourceId),s.push("Finding参照未決: "+m.sourceId))}}else if(d.kind==="stateTransition"){const p=l(d.basedOn.documentId,"document");V(p.kind==="businessDesign"&&p.objects,"State source must be an in-package BD"),V(p.revision===d.basedOn.revision,"Stale State source revision"),l(d.objectId,"object",p.id),V(!e.documents.some(h=>h!==d&&h.kind==="stateTransition"&&h.objectId===d.objectId),"Duplicate Object state declaration"),V(d.states.length>0&&new Set(d.states.map(h=>h.name)).size===d.states.length,"Duplicate/empty state names"),V(d.states.every(h=>!h.name.startsWith("@")),"Reserved state name"),V(d.transitions.length<=1e3,"State transition row budget"),V(new Set(d.transitions.map(h=>h.sourceId)).size===d.transitions.length,"Duplicate transition source ID");const g=new Map;for(const h of d.transitions){h.fromId!=="@new"&&l(h.fromId,"state",d.id),["@unknown","@none"].includes(h.toId)||l(h.toId,"state",d.id);const m=l(h.activityId,"activity",p.id),A=JSON.stringify([h.fromId,h.activityId,h.condition.trim().replace(/\s+/gu," ")]);if(V(!g.has(A),"Duplicate state transition condition: "+g.get(A)+" / "+h.sourceId),g.set(A,h.sourceId),e.formatVersion==="0.4")if(V(h.path!=="normal"||h.exceptionId===null,"Normal transition cannot reference an exception"),h.exceptionId!==null){const j=l(h.exceptionId,"exception",p.id);V(j.activityId===m.id,"Exception Activity mismatch")}else h.path==="exception"&&V(s.includes("例外参照未決: "+h.id),"Unresolved exception requires a diagnostic");else V(h.path!=="normal"||h.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+h.id);V(h.effect!=="unchanged"||h.fromId===h.toId,"Unchanged state mismatch"),V(h.effect!=="change"||!h.toId.startsWith("@")&&h.fromId!==h.toId,"Invalid changed state"),V(h.effect!=="no-create"||h.fromId==="@new"&&h.toId==="@none","Invalid no-create transition"),V(h.effect!=="constraint"||h.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+d.id)}else if(d.kind==="conceptModel"){const p=l(d.basedOn.documentId,"document");V(p.kind==="businessDesign"&&p.revision===d.basedOn.revision,"Concept source must be the matching in-package BD revision"),V(!e.documents.some(E=>E!==d&&E.kind==="conceptModel"&&E.basedOn.documentId===p.id),"Duplicate Concept model for Business Design");const g=(E,P)=>{const T=new Map;for(const q of E)V(!T.has(q.id),"Duplicate "+P+" ID: "+q.id),T.set(q.id,q);return T},h=g(d.subsystems,"subsystem"),m=g(d.concepts,"concept"),A=g(d.relations,"concept relation"),j=g(d.reviewGroups,"review group"),w=g(d.handoffs,"handoff"),L=g(d.concepts.flatMap(E=>E.information),"concept information"),I=(E,P,T)=>(V(E.has(P),"Unknown "+T+": "+P),E.get(P)),y=E=>l(E,"activity",p.id),W=E=>{const P=l(E.documentId,"document");V(P.revision===E.revision,"Stale Concept source revision");const T=P.id===p.id,q=P.kind==="stateTransition"&&P.basedOn.documentId===p.id&&d.relatedStates.some(H=>H.documentId===P.id&&H.revision===P.revision);V(T||q,"Concept source must refer to its Business Design or a declared State"),l(E.targetId,E.targetType,P.id)};for(const E of d.relatedStates){const P=l(E.documentId,"document");V(P.kind==="stateTransition"&&P.revision===E.revision&&P.basedOn.documentId===p.id,"Invalid Concept state reference")}for(const E of d.subsystems)for(const P of E.activityIds)y(P);for(const E of d.concepts){I(h,E.subsystemId,"subsystem");for(const P of E.information)P.responsibleSubsystemId&&I(h,P.responsibleSubsystemId,"responsible subsystem");for(const P of E.businessObjectIds)l(P,"object",p.id);for(const P of E.activityLinks)y(P.activityId);for(const P of E.sourceRefs)W(P)}for(const E of d.relations){I(m,E.fromConceptId,"concept"),I(m,E.toConceptId,"concept");for(const P of E.sourceRefs)W(P)}for(const E of d.handoffs){I(h,E.fromSubsystemId,"subsystem"),I(h,E.toSubsystemId,"subsystem"),V(E.fromSubsystemId!==E.toSubsystemId,"Handoff must cross subsystem boundary");for(const P of E.activityIds)y(P)}const R=(E,P)=>{const T=g(E.nodes,"subsystem view"),q=g(E.edges,"subsystem view edge");for(const S of T.values()){I(P,S.conceptId,"view concept"),I(h,S.subsystemId,"subsystem");const Z=I(m,S.conceptId,"concept");for(const x of S.fields)V(Z.information.some(D=>D.id===x.informationId),"Unknown information for subsystem view: "+x.informationId)}for(const S of q.values()){const Z=I(T,S.fromViewId,"subsystem view"),x=I(T,S.toViewId,"subsystem view");V(Z.subsystemId===x.subsystemId,"View relationship crosses subsystem boundary"),V(S.relationIds.length>0,"Subsystem view relationship needs a concept relation");let D=Z.conceptId;for(const te of S.relationIds){const X=I(A,te,"concept relation");V(X.fromConceptId===D,"Subsystem view relation path is disconnected: "+te),D=X.toConceptId}V(D===x.conceptId,"Subsystem view relation target differs")}V(new Set(E.handoffIds).size===E.handoffIds.length,"Duplicate subsystem view handoff");const H=new Set([...T.values()].map(S=>S.subsystemId));for(const S of E.handoffIds){const Z=I(w,S,"handoff");V(H.has(Z.fromSubsystemId)&&H.has(Z.toSubsystemId),"Missing subsystem view handoff region: "+S)}};d.presentation.subsystemViews&&R(d.presentation.subsystemViews,m);for(const E of d.reviewGroups){I(h,E.subsystemId,"subsystem"),l(E.reviewer.roleId,"role",p.id);for(const H of E.relatedActivityIds)y(H);const P=g(E.graph.nodes.map(H=>({...H,id:H.conceptId})),"view concept");V(new Set(E.graph.conceptIds).size===E.graph.conceptIds.length&&E.graph.conceptIds.length===P.size&&E.graph.conceptIds.every(H=>P.has(H)),"View concepts and nodes differ");for(const H of E.graph.nodes){I(m,H.conceptId,"concept");for(const S of H.sourceActivityIds)y(S)}g(E.graph.edges,"view edge");for(const H of E.graph.edges){I(P,H.fromConceptId,"view concept"),I(P,H.toConceptId,"view concept");for(const S of H.relationIds)I(A,S,"concept relation")}E.graph.subsystemViews&&R(E.graph.subsystemViews,P);const T=g(E.capabilities,"capability"),q=g(E.capabilities.flatMap(H=>H.samples),"sample");g(E.limitations,"limitation"),g(E.structureStatements,"structure statement");for(const H of E.structureStatements){for(const S of H.sampleIds)I(q,S,"sample");for(const S of H.sourceRefs)W(S)}for(const H of T.values())if(H.testSpecification){const S=H.testSpecification;for(const[x,D]of Object.entries(S))V(new Set(D).size===D.length,"Duplicate function specification reference: "+x);const Z=(x,D)=>{const te=l(x,D),X=l(o.get(x),"document");return V(X.kind==="checkItems"&&X.basedOn.documentId===p.id&&X.basedOn.revision===p.revision,"Function Check source mismatch: "+x),{value:te,doc:X}};for(const x of[...S.decisionCheckIds,...S.resultCheckIds])Z(x,"check");for(const x of S.decisionExampleIds){const{value:D,doc:te}=Z(x,"example"),X=zn(te,D);V(X.length>0,"Function decision table needs a Check: "+x),V(X.every(be=>S.decisionCheckIds.includes(be)),"Function decision table Check is not assigned: "+x)}for(const x of S.sampleIds){const D=H.samples.find(te=>te.id===x);V(D,"Function result sample belongs to another capability: "+x),V(D.checkIds.some(te=>S.resultCheckIds.includes(te)),"Function result sample needs a result Check: "+x),V(D.checkIds.every(te=>S.resultCheckIds.includes(te)||S.decisionCheckIds.includes(te)),"Function result sample Check is not assigned: "+x)}}for(const H of T.values())for(const S of H.samples){if(d.schemaVersion==="0.2"){V(S.checkIds.length>0,"Sample needs a Check: "+S.id),V(new Set(S.checkIds).size===S.checkIds.length,"Duplicate sample Check: "+S.id);for(const Z of S.checkIds){l(Z,"check");const x=l(o.get(Z),"document");V(x.kind==="checkItems"&&x.basedOn.documentId===p.id&&x.basedOn.revision===p.revision,"Sample Check source mismatch: "+Z)}}for(const Z of S.blocks){I(P,Z.card,"view concept");const x=g(Z.columns,"sample column");for(const D of Z.columns)I(L,D.informationId,"concept information");g(Z.rows,"sample row");for(const D of Z.rows){const te=new Set;for(const X of D.cells)I(x,X.columnId,"sample column"),V(!te.has(X.columnId),"Duplicate sample cell: "+X.columnId),te.add(X.columnId);V(te.size===x.size,"Sample row does not match columns")}}}}for(const E of d.presentation.landscapeRelationships){const P=I(j,E.from,"review group"),T=I(j,E.to,"review group");V(P.subsystemId===T.subsystemId,"Internal relationship crosses subsystem boundary")}for(const E of d.presentation.reviewBoundaries)I(j,E.from,"review group"),I(j,E.to,"review group");s.push("概念モデルの業務意味は未確認: "+d.id)}else{const p=l(d.basedOn.documentId,"document");V(p.kind==="businessDesign","Check source is not BD"),V(p.revision===d.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+d.id),V(new Set(d.items.map(m=>m.checkId)).size===d.items.length,"Duplicate Check ID");const g=new Set;for(const m of d.index){l(m.activityId,"activity",p.id),V(!g.has(m.activityId),"Duplicate Activity index"),g.add(m.activityId),V(new Set(m.checkIds).size===m.checkIds.length,"Duplicate Check binding");for(const A of m.checkIds)l(A,"check",d.id)}V(new Set(d.sections.map(m=>m.activityId??m.title)).size===d.sections.length,"Duplicate Activity section");for(const m of d.sections)m.activityId!==null&&(l(m.activityId,"activity",p.id),V(g.has(m.activityId),"Section missing from index")),c(m.preamble,d.id);const h=new Set(e.documents.filter(m=>m.kind==="conceptModel"&&m.basedOn.documentId===p.id&&m.basedOn.revision===p.revision).flatMap(m=>m.reviewGroups.flatMap(A=>A.capabilities.flatMap(j=>j.testSpecification?.decisionExampleIds??[]))));for(const m of d.guarantees){const A=m.blocks.length>0&&m.blocks.every(j=>j.kind==="example"&&h.has(j.exampleId)&&d.examples.some(w=>w.id===j.exampleId&&w.guaranteeId===m.id&&zn(d,w).length>0));V(m.blocks.some(j=>j.kind==="prose"&&u(j.content))||A,"General guarantee prose required"),l(m.sectionId,"section",d.id);for(const j of m.blocks)if(j.kind==="prose")c(j.content,d.id);else{const w=l(j.exampleId,"example",d.id);V(w.guaranteeId===m.id,"Example owner mismatch")}}for(const m of d.examples){l(m.guaranteeId,"guarantee",d.id),V(m.columns.length>0,"Example columns required");for(const A of m.rows){V(A.length===m.columns.length,"Example column mismatch");for(const j of A)c(j,d.id)}}for(const m of d.items){const A=l(m.sectionId,"section",d.id);V(A.activityId===null?!d.index.some(j=>j.checkIds.includes(m.id)):d.index.some(j=>j.activityId===A.activityId&&j.checkIds.includes(m.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),V(u(m.fields.guarantee)||u(m.fields.condition)&&u(m.fields.expectedResult),"Check guarantee required");for(const j of Object.values(m.fields))c(j,d.id);V(A.activityId===null||d.index.some(j=>j.checkIds.includes(m.id)),"Unbound Check")}for(const m of d.notes)c(m.content,d.id);c(d.intro,d.id)}const a=e.diagnostics.filter(d=>d.startsWith("Role未確定:"));V(new Set(a).size===a.length,"Duplicate unresolved Role diagnostic");for(const d of a)V(r.delete(d),"Unresolved Who requires a diagnostic matching a current unresolved Activity");V(r.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const d of e.sources){l(d.documentId,"document");const p=d.documentId+"@"+d.revision;V(!f.has(p),"Duplicate source descriptor"),f.add(p)}for(const d of e.externalDocuments)V(e.sources.some(p=>p.documentId===d.id&&p.revision===d.revision),"External source revision missing"),V(d.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+d.id);return{diagnostics:s,entities:n.size}}const oe=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Xs(e,t,n){if(n==null)return;const o=xn(n);return e.append(oe("h3",t),o),o}function vd(e,t){if(e===null)return;const n=xn(e),o=s=>String(s??"").replace(/\s+/g,""),i=new Set(t.map(s=>o(xn(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))i.has(o(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const wd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function kd(e,t,n){const o=new Map,i=new Set,s=new Set(n.map(l=>l.id)),r=e.model.business;for(const l of e.model.concepts??[]){if(l.basedOn.documentId!==r.id||l.basedOn.revision!==r.revision)continue;const u=l.presentation.activityViews;if(Array.isArray(u)){for(const c of u)if(!(!c||typeof c!="object"||Array.isArray(c)||c.activityId!==t||!Array.isArray(c.businessVariations)))for(const a of c.businessVariations){if(!a||typeof a!="object"||Array.isArray(a)||typeof a.exceptionId!="string"||!s.has(a.exceptionId)||a.kind!=="alternative"&&a.kind!=="exception"||i.has(a.exceptionId))continue;const f=o.get(a.exceptionId);f&&f!==a.kind?(o.delete(a.exceptionId),i.add(a.exceptionId)):o.set(a.exceptionId,a.kind)}}}return o}function Id(e,t){const n=oe("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(l=>l.id===t),r=i.activities.find(l=>l.id===t);if(s){Xs(n,"Scope",String(s.scope)),n.append(oe("h3","Information"));const l=oe("ul");for(const u of s.information)l.append(oe("li",u));n.append(l)}else if(r){const l=i.exceptions?.filter(d=>d.activityId===r.id)??[];for(const[d,p]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=Xs(n,d,p==="who"?cs(e,r.id)?.name??r.who:r[p]===null?null:String(r[p]));p==="result"&&g&&(g.dataset.businessResult="")}const u=vd(r.exception,l),c=kd(e,r.id,l),a=(d,p,g)=>{if(!p.length&&!g)return;const h=oe("section");h.dataset.businessVariations="",h.append(oe("h3",d)),g&&h.append(g);for(const m of p){const A=xn(m.description);A.dataset.businessException=m.id,h.append(oe("h4",m.name),A)}n.append(h)};c.size?(a("例外",l.filter(d=>c.get(d.id)==="exception")),a("別ルート",l.filter(d=>c.get(d.id)==="alternative")),a("通常以外の扱い",l.filter(d=>!c.has(d.id)),u)):a("通常以外の扱い",l,u);const f=new Map([...i.objects,...i.activities].map(d=>[d.id,d.name]));for(const[d,p]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=i.relations.filter(m=>m.kind===d&&(m.fromId===t||m.toId===t));if(!g.length)continue;n.append(oe("h3",p));const h=g.map(m=>`${f.get(m.fromId)} → ${f.get(m.toId)} — ${m.label}`);if(d==="business-exception")for(const m of h)n.append(oe("p",m));else{const m=oe("ul");for(const A of h)m.append(oe("li",A));n.append(m)}}}else n.append(oe("p","項目を選択すると業務内容を表示します。"));return n}class fo{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(oe("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(xn(i.value));continue}if(i.kind==="text"){const u=oe("span",i.value);u.style.whiteSpace="pre-wrap",t.append(u);continue}if(i.kind==="link"){t.append(oe("span",`${i.label} (${i.uri})`));continue}const s=oe("details"),r=oe("summary",i.label||i.targetId);s.append(r),t.append(s);let l=!1;s.addEventListener("toggle",()=>{if(!s.open||l)return;if(l=!0,o.has(i.targetId)){s.append(oe("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(oe("p","参照の深さの上限です。続きは原文で確認してください。"));return}const u=new Set(o).add(i.targetId),c=this.doc,a=c.guarantees.find(h=>h.id===i.targetId),f=c.examples.find(h=>h.id===i.targetId),d=c.items.find(h=>h.id===i.targetId),p=c.sections.find(h=>h.id===i.targetId),g=c.notes.find(h=>h.id===i.targetId);if(a){s.append(oe("h4",a.title));for(const h of a.blocks){if(!this.take(s))break;h.kind==="prose"?this.runs(s,h.content,u):this.example(s,h.exampleId,u)}}else if(f)this.example(s,f.id,u);else if(d){s.append(oe("p",`${d.checkId} · ${d.title}`+(this.requester?"":` · ${d.reviewState}`))),this.requester&&(d.reviewState==="要確認"||d.reviewState==="要修正")&&s.append(oe("p","確認が必要です。"));const h=this.requester?Object.fromEntries(Object.entries(d.fields).filter(([m])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(m))):d.fields;this.fields(s,h,u)}else p?(s.append(oe("h4",p.title)),this.runs(s,p.preamble,u)):g?(s.append(oe("h4",g.title)),this.runs(s,g.content,u)):i.targetId===c.id&&(s.append(oe("h4",c.title)),this.runs(s,c.intro,u))})}}fields(t,n,o,i=!1){for(const[s,r]of Object.entries(n)){if(!this.take(t))break;if(t.append(oe("h4",wd[s]??s)),s==="guarantee"&&i){const l=new Set;for(const u of r){const c=u.kind==="reference"?this.doc.guarantees.find(f=>f.id===u.targetId):void 0;if(!c){this.runs(t,[u],o);continue}if(l.has(c.id))continue;l.add(c.id);const a=new Set(o).add(c.id);for(const f of c.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,a):this.example(t,f.exampleId,a)}}}else this.runs(t,r,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!zn(this.doc,s).length)return;const r=oe("table"),l=i?s.columns.indexOf("結果"):-1,u=l>0&&s.columns.at(-1)==="Check ID";if(u){const f=oe("colgroup");f.span=l,r.append(f);for(let m=l;m<s.columns.length;m++)r.append(oe("colgroup"));const d=oe("thead"),p=oe("tr"),g=oe("th","条件");g.colSpan=l,g.scope="colgroup",p.append(g);for(let m=l;m<s.columns.length;m++){const A=oe("th",s.columns[m]);A.rowSpan=2,A.scope="col",m===l?A.className="decision-result":s.columns[m]==="備考"&&(A.className="decision-notes"),p.append(A)}const h=oe("tr");for(const m of s.columns.slice(0,l)){const A=oe("th",m);A.scope="col",h.append(A)}d.append(p,h),r.append(d)}else{const f=oe("tr");for(const d of s.columns){if(!this.take(t))break;f.append(oe("th",d))}r.append(f)}const c=u?oe("tbody"):r;for(const f of s.rows){if(!this.take(t))break;const d=oe("tr");for(const[p,g]of f.entries()){if(!this.take(t))break;const h=oe("td");if(u&&p===l?h.className="decision-result":u&&s.columns[p]==="備考"&&(h.className="decision-notes"),i)for(const m of g){const A=m.kind==="reference"?this.doc.items.find(j=>j.id===m.targetId):void 0;A?h.append(oe("span",A.checkId)):this.runs(h,[m],o)}else this.runs(h,g,o);d.append(h)}c.append(d)}u&&r.append(c);const a=oe("div");a.className="json-example",a.append(r),t.append(a)}}function Zs(e,t,n=e.model.checks,o=new Set,i=new Set){const s=oe("section");s.className="check-content json-checks";const r=e.model.business,l=n.filter(c=>c.basedOn.documentId===r.id);let u=!1;for(const c of l){const a=new fo(c),f=c.index.filter(h=>h.activityId===t),d=new Set(c.index.flatMap(h=>h.checkIds)),p=(t?[...new Set(f.flatMap(h=>h.checkIds))]:c.items.filter(h=>!d.has(h.id)).map(h=>h.id)).filter(h=>!o.has(h)),g=c.sections.filter(h=>t?h.activityId===t:h.activityId===null);for(const h of g){(h.preamble.length||c.guarantees.some(m=>m.sectionId===h.id&&!i.has(m.id)))&&(u=!0),a.runs(s,h.preamble);for(const m of c.guarantees.filter(A=>A.sectionId===h.id&&!i.has(A.id)))a.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}for(const h of p){const m=c.items.find(w=>w.id===h);if(!m)continue;u=!0;const A=oe("section");A.className="check-item",A.dataset.checkId=m.checkId,A.dataset.elementId=m.id,A.append(oe("h3",m.checkId+" · "+m.title)),(m.reviewState==="要確認"||m.reviewState==="要修正")&&A.append(oe("p","確認が必要です。"));const j=Object.fromEntries(Object.entries(m.fields).filter(([w])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(w)));a.fields(A,j,new Set([m.id])),s.append(A)}if(!t)for(const h of c.notes)u=!0,a.runs(s,[{kind:"reference",targetId:h.id,label:h.title}])}return u||s.append(oe("p","この業務のテスト仕様はありません。")),s}function Sd(e,t,n=e.model.checks){const o=oe("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new fo(r);for(const u of r.items.filter(c=>s.has(c.id))){const c=oe("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(oe("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(oe("p","確認が必要です。"));const a=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));l.fields(c,a,new Set([u.id]),!0),o.append(c)}}return o}const xd=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Ad(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(xd,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Ed(e,t,n=e.model.checks){const o=oe("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=r.examples.find(g=>g.id===s);if(!l||!zn(r,l).length)continue;const u=new fo(r,!0),c=r.guarantees.find(g=>g.id===l.guaranteeId),a=oe("section");a.dataset.decisionExample=s;for(const g of c?.blocks??[])g.kind==="prose"&&u.runs(a,Ad(g.content),new Set([c.id]));l.rows.length>1&&a.append(oe("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=l.columns.indexOf("結果"),d=f>0?f:l.columns.length;l.rows.some(g=>g.slice(0,d).some(h=>h.some(m=>m.kind==="text"&&/^\s*[-‐]\s*$/.test(m.value))))&&a.append(oe("p","‐＝値不問。")),u.example(a,s,new Set([s]),!0),o.append(a)}return o}function Cd(e,t,n=e.model.checks){const o=oe("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new fo(r,!0);for(const u of r.items.filter(c=>s.has(c.id))){const c=oe("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(oe("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(oe("p","確認が必要です。")),u.fields.condition?.length&&(c.append(oe("h4","条件")),l.runs(c,u.fields.condition,new Set([u.id])));const a=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(a).length){const f=oe("details");f.append(oe("summary","期待結果")),l.fields(f,a,new Set([u.id]),!0),c.append(f)}o.append(c)}}return o}function Od(e,t,n=e.model.checks,o=new Set){const i=oe("section");i.className="check-content json-checks result-checks";const s=e.model.business,r=new Set(t);for(const l of n.filter(u=>u.basedOn.documentId===s.id&&u.basedOn.revision===s.revision)){const u=new fo(l,!0),c=l.items.filter(a=>r.has(a.id)&&o.has(a.id)&&a.reviewState!=="要確認"&&a.reviewState!=="要修正"&&!a.fields.question?.length&&!a.fields.alternatives?.length);c.length&&i.append(oe("p",c.map(a=>a.checkId).join("、")));for(const a of l.items.filter(f=>r.has(f.id))){if(c.includes(a))continue;const f=oe("section");f.className="check-item",f.dataset.checkId=a.checkId,f.dataset.elementId=a.id,f.append(oe("h3",a.checkId)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&f.append(oe("p","確認が必要です。"));const d=Object.fromEntries(Object.entries(a.fields).filter(([h])=>["expectedResult","guarantee","question","alternatives"].includes(h)));u.fields(f,d,new Set([a.id]),!0);const p=oe("details"),g=oe("summary","Check の詳細");p.append(g,oe("p",a.title)),a.fields.condition?.length&&u.runs(p,a.fields.condition,new Set([a.id])),f.append(p),i.append(f)}}return i}const Ei=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Nd(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(a=>a.id)),o=[],i=new Set,s=new Set,r=t.filter(a=>a.basedOn.documentId===e.business.id&&a.basedOn.revision===e.business.revision),l=(a,f)=>r.some(d=>d.items.some(p=>p.id===a)&&(!f||d.index.some(p=>p.activityId===f&&p.checkIds.includes(a)))),u=(a,f,d,p,g=[])=>{const h=f.testSpecification,m=(h?.decisionCheckIds??[]).filter(W=>l(W,d)),A=(h?.resultCheckIds??[]).filter(W=>l(W,d)),j=(h?.decisionExampleIds??[]).filter(W=>r.some(R=>{const E=R.examples.find(T=>T.id===W),P=E?zn(R,E):[];return P.length>0&&P.every(T=>l(T,d))})),w=f.samples.filter(W=>(!h||h.sampleIds.includes(W.id))&&W.checkIds?.length&&(h?W.checkIds.every(R=>l(R,d)):W.checkIds.some(R=>l(R,d)))),L=j.flatMap(W=>r.flatMap(R=>{const E=R.examples.find(P=>P.id===W);return E?zn(R,E).filter(P=>l(P,d)):[]})),I=[...new Set([...m,...A,...L,...w.flatMap(W=>(W.checkIds??[]).filter(R=>l(R,d)))])];if(!I.length)return;const y=`fn:${d??"_"}:${a}:${f.id}`;s.has(y)||(s.add(y),o.push({key:y,activityId:d,groupId:a,capability:f,name:p,samples:w,checkIds:I,decisionCheckIds:m,resultCheckIds:A,decisionExampleIds:j,decisionTableCheckIds:[...new Set(L)],businessSections:g}))},c=e.model.presentation.activityViews;if(Array.isArray(c)){for(const a of c)if(!(!Ei(a)||typeof a.activityId!="string"||!n.has(a.activityId)||!Array.isArray(a.testSpecificationFunctions)))for(const f of a.testSpecificationFunctions){if(!Ei(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const d=e.model.reviewGroups.find(h=>h.id===f.groupId),p=d?.capabilities.find(h=>h.id===f.capabilityId);if(!d||!p)continue;i.add(JSON.stringify([d.id,p.id]));const g=[];if(Array.isArray(f.businessSections))for(const h of f.businessSections){if(!Ei(h)||!Array.isArray(h.pages)||h.kind!=="result"&&h.kind!=="exception"||h.kind==="exception"&&(typeof h.exceptionId!="string"||!e.business.exceptions?.some(A=>A.id===h.exceptionId&&A.activityId===a.activityId)))continue;const m=[...new Set(h.pages.filter(A=>A==="decision"||A==="result"))];m.length&&g.push({kind:h.kind,exceptionId:h.kind==="exception"?h.exceptionId:void 0,pages:m})}u(d.id,p,a.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():p.title,g)}}for(const a of e.model.reviewGroups)for(const f of a.capabilities)i.has(JSON.stringify([a.id,f.id]))||u(a.id,f,void 0,f.title);return o}function Ys(e,t,n,o){const i=e.filter(r=>r.groupId===t&&r.capability.id===n),s=i.find(r=>r.samples.some(l=>l.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const r of i){if(!r.capability.testSpecification)continue;const l=r.capability.samples.find(c=>c.id===o),u=r.decisionExampleIds.length?r.decisionTableCheckIds:r.decisionCheckIds;if(l?.checkIds?.some(c=>u.includes(c)))return{kind:"decision",key:"decision:"+r.key}}}const Oo=e=>!!e&&typeof e=="object"&&!Array.isArray(e),_n=e=>typeof e=="string"&&!!e.trim();function jd(e){const t=Oo(e)&&Oo(e.previewStructureReview)?e.previewStructureReview:void 0,n=t?.format==="alder-preview-structure-review/1"&&t.status==="hypothesis"&&Oo(t.fields)?t.fields:void 0;return{enabled:!!n,get(o){if(!n||!Object.hasOwn(n,o))return;const i=n[o];if(!Oo(i)||i.status!=="hypothesis"||!_n(i.source)||!_n(i.reason)||!_n(i.perspectiveReason)||!Array.isArray(i.perspectives)||!i.perspectives.length||i.perspectives.length>3||new Set(i.perspectives).size!==i.perspectives.length||!i.perspectives.every(r=>["依頼者","設計者","開発者"].includes(r))||i.purpose!==void 0&&!_n(i.purpose))return;let s;if(Object.hasOwn(i,"sample")){if(!_n(i.sampleReason))return;try{s=typeof i.sample=="string"?i.sample||'""':JSON.stringify(i.sample)}catch{return}if(s===void 0)return}return{purpose:i.purpose,sample:s,perspectives:i.perspectives,reason:i.reason,perspectiveReason:i.perspectiveReason,sampleReason:i.sampleReason,source:i.source}}}}const $i=["owned","reference","unknownOut"];function _r(e){const t=e.meta&&typeof e.meta=="object"&&!Array.isArray(e.meta)?e.meta:{},n=t.compatibilityReview&&typeof t.compatibilityReview=="object"&&!Array.isArray(t.compatibilityReview)?t.compatibilityReview:{},o=(i,s)=>{const r=n[i];if(!r||typeof r!="object"||Array.isArray(r))return;const l=r[s];if(!l||typeof l!="object"||Array.isArray(l))return;const u=l;return(u.kind==="legacy"||u.kind==="needs-review")&&typeof u.reason=="string"&&u.reason.trim()?{kind:u.kind,reason:u.reason}:void 0};return{concept:i=>o("concepts",i),field:(i,s)=>o("fields",i)??o("concepts",s),relation:(i,s)=>o("relations",i)??o("concepts",s)}}const qo=e=>e.kind==="legacy"?"互換・移行用":"要確認";function Xr(e){const t=new Map(e.concepts.map(y=>[y.id,y])),n=e.meta&&typeof e.meta=="object"?e.meta:{},o=n.relationNames&&typeof n.relationNames=="object"&&!Array.isArray(n.relationNames)?n.relationNames:{},i=n.reverseRelationNames&&typeof n.reverseRelationNames=="object"&&!Array.isArray(n.reverseRelationNames)?n.reverseRelationNames:{},s=n.conceptNames&&typeof n.conceptNames=="object"&&!Array.isArray(n.conceptNames)?n.conceptNames:{},r=Array.isArray(n.fieldMappings)?n.fieldMappings.filter(y=>!!y&&typeof y=="object"&&typeof y.informationId=="string"&&typeof y.physicalName=="string"&&Array.isArray(y.relationIds)&&y.relationIds.every(W=>typeof W=="string")):[],l=new Map;for(const y of r){const W=l.get(y.informationId)??[];W.push(y),l.set(y.informationId,W)}const u=new Map([...l].filter(([,y])=>y.length===1).map(([y,W])=>[y,W[0]])),c=y=>y.representation==="relationKey"?Array.isArray(y.relationKeyIds)&&y.relationKeyIds.every(W=>typeof W=="string")?y.relationKeyIds:[]:y.relationIds,a=new Map;for(const y of e.relations){const W=a.get(y.id)??[];W.push(y),a.set(y.id,W)}const f=new Map([...a].filter(([,y])=>y.length===1).map(([y,W])=>[y,W[0]])),d=new Set;for(const y of e.concepts)for(const W of y.information){const R=u.get(W.id);R?.representation!=="relationKey"||!c(R).length||c(R).every(E=>{const P=f.get(E);return!!P&&t.has(P.fromConceptId)&&t.has(P.toConceptId)&&(P.kind==="reference"&&P.fromConceptId===y.id||P.kind==="down"&&(P.fromConceptId===y.id||P.toConceptId===y.id))})&&d.add(W.id)}const p=Array.isArray(n.relationPhysicalFields)?n.relationPhysicalFields.filter(y=>!!y&&typeof y=="object"&&typeof y.relationId=="string"&&typeof y.physicalName=="string"&&!!y.physicalName.trim()):[],g=new Map;for(const y of t.keys())g.set(y,[]);for(const y of e.relations){if(!t.has(y.fromConceptId)||!t.has(y.toConceptId))continue;const W=C=>typeof C=="string"&&C.trim()?C:"未定義",R=C=>t.get(C).information.flatMap(z=>{const B=u.get(z.id);return B&&c(B).includes(y.id)?[{name:z.name,physicalName:B.physicalName,valueType:B.valueType}]:[]}),E=R(y.fromConceptId),P=R(y.toConceptId),T=Object.hasOwn(o,y.id)?o[y.id]:void 0,q=typeof T=="string"&&T.trim()?T.trim():void 0,H=Object.hasOwn(i,y.id)?i[y.id]:void 0,S=typeof H=="string"&&H.trim()?H.trim():void 0,Z=y.kind,x=Z==="down"?t.get(y.toConceptId).information.flatMap(C=>{const z=u.get(C.id);return d.has(C.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]}):[],D=t.get(y.fromConceptId).information.flatMap(C=>{const z=u.get(C.id);return d.has(C.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]}),te=p.filter(C=>C.relationId===y.id).map(C=>C.physicalName),X=[...new Set([...E.map(C=>C.physicalName),...x,...te])],be=new Set([...D,...x,...te]),re=new Set(t.get(y.fromConceptId).information.flatMap(C=>{const z=u.get(C.id);return!d.has(C.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]})),ae=X.filter(C=>!be.has(C)||re.has(C));g.get(y.fromConceptId).push({relation:y,from:y.fromConceptId,to:y.toConceptId,direction:Z==="down"?"owned":Z==="reference"?"reference":"unknownOut",count:W(y.toLabel),reverseCount:W(y.fromLabel),fields:X,visibleFields:ae,fieldDetails:E,roleName:q}),g.get(y.toConceptId).push({relation:y,from:y.toConceptId,to:y.fromConceptId,direction:Z==="down"?"owner":Z==="reference"?"referencedBy":"unknownIn",count:W(y.fromLabel),reverseCount:W(y.toLabel),fields:P.map(C=>C.physicalName),visibleFields:P.map(C=>C.physicalName),fieldDetails:P,...Z==="down"&&S?{roleName:S}:{}})}const h=new Set(e.relations.filter(y=>y.kind==="down"&&t.has(y.fromConceptId)&&t.has(y.toConceptId)).map(y=>y.toConceptId)),m=e.concepts.filter(y=>!h.has(y.id)),A=m.filter(y=>{const W=y.information.map(E=>u.get(E.id)).filter(E=>!!E),R=W.find(E=>E.physicalName==="documents[]"&&E.valueType==="array");return W.some(E=>E.physicalName==="format")&&W.some(E=>/^formatVersion(?:\s*:.*)?$/.test(E.physicalName))&&W.some(E=>E.physicalName==="revision")&&!!R&&R.relationIds.some(E=>e.relations.some(P=>P.id===E&&P.kind==="down"&&P.fromConceptId===y.id))}),j=A.length===1?A[0].id:void 0,w=j?[j]:(m.length?m:e.concepts).map(y=>y.id),L=new Set,I=[...w];for(;I.length;){const y=I.pop();if(!L.has(y)){L.add(y);for(const W of g.get(y)??[])$i.includes(W.direction)&&!L.has(W.to)&&I.push(W.to)}}return{nodes:t,edges:g,mappings:u,relationKeys:d,conceptNames:s,packageRoot:j,roots:w,hasOwnershipRoots:m.length>0,reachable:L}}const Yn={owned:"所有",reference:"参照",owner:"所属先",referencedBy:"参照元",unknownOut:"種類未定義（出）",unknownIn:"種類未定義（入）"},Qs=(e,t)=>{const n=On(e,{"aria-hidden":"true","stroke-width":1.8});if(n.classList.add("structure-icon"),t){n.removeAttribute("aria-hidden"),n.setAttribute("role","img"),n.setAttribute("aria-label",t);const o=document.createElementNS("http://www.w3.org/2000/svg","title");o.textContent=t,n.prepend(o)}return n},Ce=(e,t,n,o)=>{const i=document.createElement(t);return i.textContent=n,o&&(i.className=o),e.append(i),i},Zr=(e,t)=>{t&&(e.classList.add("structure-review-"+t.kind),Ce(e,"span",qo(t),"structure-review-badge"))};function Ln(e,t,n){const o=Ce(e,"div","","structure-review-hypothesis");o.title=n,Ce(o,"span","仮説（未確認）","structure-review-hypothesis-label");const i=Ce(o,"span","","structure-review-hypothesis-value");if(Array.isArray(t))for(const[s,r]of t.entries())s&&i.append(document.createTextNode("・")),Ce(i,"span",r,"structure-review-perspective");else i.textContent=t}function er(e,t){const n=document.createElement("details");n.className="structure-review-candidate-source",e.append(n),Ce(n,"summary","候補の根拠"),Ce(n,"p",t.reason),Ce(n,"p",t.perspectiveReason),t.sampleReason&&Ce(n,"p",t.sampleReason),Ce(n,"p","出典："+t.source)}const No=e=>e.split(" / ").map(t=>t.trim().split(".").pop()??t).join(" / ");function tr(e){const t=e?.valueDomain,n=t?.kind,o=Ui(e);if((n==="enum"||n==="fixed")&&o.length)return o.map(r=>r.literal).join(" | ");const i={identifier:"識別子",version:"版・改訂",reference:"参照",referenceType:"参照先の種類",hash:"SHA-256",uri:"URI",cardinality:"多重度"};if(typeof n=="string"&&i[n])return i[n];const s=typeof e?.valueType=="string"&&e.valueType.trim()?e.valueType:"未定義";return e?.nullableStatus==="proposal"?s.split("|").map(r=>r.trim()).filter(r=>r!=="null").join(" | ")||"未定義":s}function Ui(e){const t=e?.valueDomain;if(!t||!["enum","fixed"].includes(String(t.kind))||!Array.isArray(t.values))return[];const n=[];for(const o of t.values){if(!o||typeof o!="object"||!["string","number","boolean"].includes(typeof o.value))return[];const i=typeof o.value=="string"?o.value||'""':String(o.value);n.push({value:i,literal:JSON.stringify(o.value)??String(o.value),...typeof o.label=="string"&&o.label.trim()?{label:o.label.trim()}:{}})}return n}function nr(e){return e.label?e.value+"："+e.label:e.value}function or(e){const t=e?.valueDomain?.note;return typeof t=="string"&&t.trim()?t.trim():void 0}function ir(e){return typeof e?.nullable=="boolean"?e.nullable?"許容する":"許容しない":e&&Object.hasOwn(e,"nullable")?"未決":"未定義"}function sr(e,t){const n=typeof e.description=="string"&&e.description.trim()?e.description:t?.logicalMeaning;return typeof n=="string"&&n.trim()?n:"この項目の説明はまだ記載されていません。"}function rr(e,t,n,o,i=[]){const s=document.createElement("div");s.className="structure-copy-actions";const r=document.createElement("span");r.className="structure-copy-status",r.setAttribute("role","status"),r.setAttribute("aria-live","polite");const l=()=>{const d=[];for(const p of Array.from(t.children)){if(p.tagName!=="DT")continue;const g=p.nextElementSibling;if(!g)continue;const h=g.querySelector("table"),m=j=>Array.from(j.childNodes).map(w=>w.nodeName==="UL"||w.nodeName==="OL"?Array.from(w.childNodes).map(L=>L.textContent?.trim()??"").filter(Boolean).join("、"):w.textContent?.trim()??"").filter(Boolean).join(" / "),A=h?Array.from(h.querySelectorAll("tr")).map(j=>Array.from(j.children).map(m).join(" | ")).join(`
`):Array.from(g.childNodes).map(j=>j.nodeName==="BR"?`
`:j.textContent??"").join("");d.push((p.querySelector(".structure-detail-caption")?.textContent??p.textContent??"")+"："+A)}return[o,...i.length?["元の定義："+i.join("、")]:[],...d].join(`
`)},u=async d=>{try{const p=e.ownerDocument.defaultView?.navigator.clipboard;if(!p?.writeText)throw Error("Clipboard unavailable");await p.writeText(d?l():o),r.textContent=d?"全文をコピーしました。":"識別情報をコピーしました。"}catch{r.textContent="コピーできませんでした。ブラウザーの設定を確認してください。"}},c=document.createElement("button");c.type="button",c.className="structure-copy-id",c.textContent="識別情報をコピー",c.title="Shiftを押しながら選ぶと全文をコピー",c.addEventListener("click",d=>{u(d.shiftKey)});const a=document.createElement("button");a.type="button",a.className="structure-copy-full",a.textContent="全文をコピー",a.addEventListener("click",()=>{u(!0)}),s.append(c,a);const f=document.createElement("span");f.className="structure-detail-caption",f.textContent=n.textContent,n.classList.add("structure-copy-heading"),n.replaceChildren(f,s,r)}function Yr(e,t,n,o){if(e.replaceChildren(),!n){Ce(e,"p","ツリーの項目を選択すると詳細を確認できます。");return}const i=Xr(t),s=_r(t),r=i.nodes.get(n.conceptId);if(!r){Ce(e,"p","項目が見つかりません。");return}const l=t.meta&&typeof t.meta=="object"?t.meta:{},u=jd(t.meta),c=l.modelStatus==="normalized-study"||l.modelStatus==="complete-package-study",a=x=>{const D=i.nodes.get(x),te=i.conceptNames[x];return{local:typeof te?.logicalName=="string"&&te.logicalName?te.logicalName:D?.name??x,type:typeof te?.typeName=="string"&&te.typeName?te.typeName:D?.name??"未定義"}},f=document.createElement("dl");f.className="structure-detail-list",e.append(f);const d=x=>{o?o(x):Yr(e,t,x),x.kind==="attribute"?e.querySelector(".structure-attribute-back")?.focus():n.kind==="attribute"&&Array.from(e.querySelectorAll(".structure-attribute-table tbody tr")).find(D=>D.dataset.informationId===n.informationId)?.querySelector(".structure-attribute-select")?.focus()},p=(x,D)=>{const te=document.createElement("dt"),X=document.createElement("dd");te.textContent=x;const be=Array.isArray(D)?D:[D??"未定義"];if(!be.length)X.textContent="なし";else for(const[re,ae]of be.entries())re&&X.append(document.createElement("br")),X.append(document.createTextNode(ae));return f.append(te,X),te};if(n.kind==="attribute"){if(n.returnTo){const le=document.createElement("button");le.type="button",le.className="structure-attribute-back",le.textContent="項目一覧に戻る",le.onclick=()=>d(n.returnTo),e.insertBefore(le,f)}const x=r.information.find(le=>le.id===n.informationId);if(!x){f.remove(),Ce(e,"p","項目が見つかりません。");return}const D=i.mappings.get(x.id),te=x,X=a(r.id),be="概念モデル："+t.id+"（"+t.revision+`）
構造：`+X.type+"［"+r.id+`］
項目：`+x.name+(D?.physicalName?"（"+No(D.physicalName)+"）":"")+"［"+x.id+"］",re=Array.isArray(l.schemaCoverage)?l.schemaCoverage.flatMap(le=>le&&typeof le=="object"&&le.informationId===x.id&&typeof le.path=="string"?[le.path]:[]):[],ae=D?.relationIds.flatMap(le=>{const ue=(i.edges.get(r.id)??[]).filter(ve=>ve.relation.id===le);return ue.length?ue.map(ve=>a(ve.to).local+"（"+Yn[ve.direction]+"）"):[le+"（未定義）"]});rr(e,f,p("論理名",D?.physicalName?No(D.physicalName):void 0),be,re),p("ローカル名",x.name),p("型名",tr(D));const C=u.get(x.id),z=p("サンプル",ar(D)??"未記載");C?.sample!==void 0&&Ln(z.nextElementSibling,C.sample,C.sampleReason),p("null許容",ir(D)),p("説明",sr(te,D));const B=typeof D?.logicalPurpose=="string"?D.logicalPurpose:"",fe=p("使用目的",B);if(!B.trim()&&C?.purpose&&Ln(fe.nextElementSibling,C.purpose,C.reason),u.enabled){const le=p("確認する立場",C?"":"未指定");if(C){const ue=le.nextElementSibling;Ln(ue,C.perspectives,C.perspectiveReason),er(ue,C)}}D?.nullableReason&&p("null許容の理由",D.nullableReason);const Q=Ui(D);Q.length&&p(D?.valueDomain?.kind==="fixed"?"値":"選択肢",Q.map(nr));const ge=or(D);ge&&p("制約",ge);const ye=s.field(x.id,r.id);ye&&p("位置づけ",qo(ye)+"："+ye.reason),p("所属",a(r.id).local+"（"+a(r.id).type+"）"),p("参照",ae),D?.logicalSourcePaths?.length&&p("対応する定義",D.logicalSourcePaths),typeof D?.optional=="boolean"&&p("項目の省略",D.optional?"可能":"不可"),D?.representation&&p("対応の種類",D.representation),x.responsibilityStatus&&p("責任の確認状態",x.responsibilityStatus),x.responsibleSubsystemId&&p("責任を持つサブシステム",t.subsystems.find(le=>le.id===x.responsibleSubsystemId)?.name);return}const g=n.relationId?i.edges.get(n.fromId??"")?.find(x=>x.relation.id===n.relationId&&x.to===r.id):void 0,h=a(r.id),m="概念モデル："+t.id+"（"+t.revision+`）
構造：`+h.type+"［"+r.id+"］"+(n.relationId?`
関係：`+n.relationId:""),A=x=>{const D=a(x);return D.local+"（"+D.type+"）"},j=(i.edges.get(r.id)??[]).filter(x=>x.direction==="owner").map(x=>A(x.to)),w=g?.direction==="owned"?[A(g.from)]:j,L=(i.edges.get(r.id)??[]).filter(x=>x.direction==="owned"&&(n.hideLegacy===!1||s.relation(x.relation.id,x.to)?.kind!=="legacy")).map(x=>{const D=a(x.to),te=s.relation(x.relation.id,x.to);return(te?qo(te)+"：":"")+(x.roleName??D.local)+"（"+D.type+"）"}),I=(i.edges.get(r.id)??[]).filter(x=>x.direction==="reference").map(x=>(x.roleName??"参照")+"："+a(x.to).local),y=g?.fieldDetails.filter(x=>!c||![...i.mappings.values()].some(D=>D.physicalName===x.physicalName&&D.relationIds.length>1)).map(x=>x.physicalName).filter(Boolean).map(No);rr(e,f,p("論理名",g?y?.length?y:void 0:h.type),m),p("ローカル名",g?.roleName??g?.fieldDetails[0]?.name??h.local),p("型名",h.type);const W=r.information.filter(x=>!i.relationKeys.has(x.id)&&(n.hideLegacy===!1||s.field(x.id,r.id)?.kind!=="legacy")),R=document.createElement("dt"),E=document.createElement("dd");if(R.textContent="項目とサンプル",f.append(R,E),!W.length)Ce(E,"p","表示する属性はありません。","structure-attribute-empty");else{const x=document.createElement("div"),D=document.createElement("table"),te=document.createElement("thead"),X=document.createElement("tr"),be=document.createElement("tbody");x.className="structure-attribute-wrap",D.className="structure-attribute-table",D.setAttribute("aria-label",h.local+"の項目とサンプル"),u.enabled&&D.classList.add("structure-review-table");for(const re of["項目","サンプル","説明","使用目的",...u.enabled?["確認する立場"]:[]]){const ae=document.createElement("th");ae.scope="col",ae.textContent=re,X.append(ae)}te.append(X),D.append(te,be),x.append(D),E.append(x);for(const re of W){const ae=i.mappings.get(re.id),C=re,z=document.createElement("tr"),B=document.createElement("th"),fe=document.createElement("td"),Q=document.createElement("td"),ge=document.createElement("td");z.dataset.informationId=re.id,B.scope="row";const ye=document.createElement("button");ye.type="button",ye.className="structure-attribute-name structure-attribute-select",ye.textContent=re.name,ye.onclick=()=>d({kind:"attribute",conceptId:r.id,informationId:re.id,hideLegacy:n.hideLegacy,returnTo:n}),B.append(ye);const le=s.field(re.id,r.id);le&&Zr(B,le),ae?.physicalName&&Ce(B,"span","論理名："+No(ae.physicalName),"structure-attribute-meta"),Ce(B,"span","型："+tr(ae),"structure-attribute-meta"),Ce(B,"span","null許容："+ir(ae),"structure-attribute-meta");const ue=Ui(ae);if(ue.length){Ce(B,"span",ae?.valueDomain?.kind==="fixed"?"値：":"選択肢：","structure-attribute-meta");const Ie=document.createElement("ul");Ie.className="structure-domain-values";for(const bt of ue)Ce(Ie,"li",nr(bt));B.append(Ie)}const ve=or(ae);ve&&Ce(B,"span","制約："+ve,"structure-attribute-meta");const ze=ar(ae);ze!==void 0?Ce(fe,"span",ze,"structure-attribute-sample"):Ce(fe,"span","未記載","structure-attribute-missing");const pe=u.get(re.id);if(pe?.sample!==void 0&&Ln(fe,pe.sample,pe.sampleReason),Q.textContent=sr(C,ae),ge.textContent=typeof ae?.logicalPurpose=="string"?ae.logicalPurpose:"",!ge.textContent.trim()&&pe?.purpose&&Ln(ge,pe.purpose,pe.reason),z.append(B,fe,Q,ge),u.enabled){const Ie=document.createElement("td");Ie.className="structure-review-perspectives",pe?(Ln(Ie,pe.perspectives,pe.perspectiveReason),er(Ie,pe)):Ie.textContent="未指定",z.append(Ie)}be.append(z)}}p("所属",w.length?[...new Set(w)]:void 0),L.length&&p("含む構造",[...new Set(L)]),p("参照",g?.direction==="reference"?[h.local+"（"+h.type+"）"]:I);const T=c&&(/^候補の .+。現行0\.7の物理構造そのものではない。$/.test(r.description)||r.description==="0.7候補の構造に基づく概念モデルの検討案。")?"":r.description,q=g?.relation.condition||T;q&&p("説明",q);const H=g?s.relation(g.relation.id,r.id):s.concept(r.id);H&&p("位置づけ",qo(H)+"："+H.reason),g&&(p("関係の種類",Yn[g.direction]),p("多重度",g.count),p("反対側の多重度",g.reverseCount),g.relation.sourceRefs.length&&p("関係の出所",g.relation.sourceRefs.map(x=>[x.documentId,x.revision,x.targetType,x.targetId,x.section].filter(Boolean).join(" / "))),g.relation.condition&&T&&p("構造の説明",T));const S=c&&(r.reason==="正規化候補の構造レビュー。"||r.reason==="Alder JSON概念モデルのレビュー候補。");if(r.reason&&!S&&p("理由",r.reason),r.subsystemId){const x=t.subsystems.find(D=>D.id===r.subsystemId);c&&x?.id==="format-review"||p("サブシステム",x?.name)}const Z=(i.edges.get(r.id)??[]).filter(x=>x.direction==="referencedBy").map(x=>{const D=i.edges.get(x.to)?.find(te=>te.relation.id===x.relation.id&&te.direction==="reference"&&te.to===r.id)?.roleName;return a(x.to).local+(D?"："+D:"")});Z.length&&p("参照元",Z),r.businessObjectIds.length&&p("関連する対象",r.businessObjectIds),r.activityLinks.length&&p("関連する業務",r.activityLinks.map(x=>x.activityId+(x.uses.length?"："+x.uses.join("、"):""))),r.sourceRefs.length&&p("出所",r.sourceRefs.map(x=>[x.documentId,x.revision,x.targetType,x.targetId,x.section].filter(Boolean).join(" / ")))}function ar(e){if(!e)return;const t=Object.hasOwn(e,"sampleValue")&&e.sampleValue!==void 0?e.sampleValue:e.referenceValue;return typeof t=="string"?t||'""':JSON.stringify(t)}function Md(e,t,n={}){const o=Xr(t),i=_r(t);if(e.replaceChildren(),e.className="structure-explorer",!o.roots.length){Ce(e,"p","この構造モデルには概念がありません。","structure-empty");return}if(n.rootId&&!o.nodes.has(n.rootId)){Ce(e,"p","指定した構造が見つかりません。","structure-empty");return}const s=n.rootId?[n.rootId]:o.roots,r=document.createElement("section");r.className="structure-panel",e.append(r);const l=document.createElement("div");l.className="structure-toolbar",r.append(l);const u=document.createElement("button");u.type="button",u.textContent="すべて展開",l.append(u);const c=document.createElement("button");c.type="button",c.textContent="すべて折りたたみ",l.append(c);const a=document.createElement("label");a.className="structure-compatibility-filter";const f=document.createElement("input");f.type="checkbox",f.checked=!0,a.append(f,document.createTextNode("互換・移行用を非表示")),a.title="互換・移行用と明示された項目を非表示にします。",l.append(a);const d=document.createElement("label");d.className="structure-search",d.append(Qs(tc));const p=document.createElement("input");p.type="search",p.placeholder="構造名・項目名で検索",p.setAttribute("aria-label","構造名・項目名で検索"),d.append(p),l.append(d),!n.rootId&&!o.packageRoot&&!o.hasOwnershipRoots&&Ce(r,"p","JSON全体のルートと所有関係の起点を特定できないため、すべての構造を表示します。","structure-unreachable");const g=[...o.nodes.keys()].filter(S=>!o.reachable.has(S));!n.rootId&&g.length&&Ce(r,"p",`この起点からたどれない構造：${g.length}件`,"structure-unreachable");const h=[...o.mappings.values()].filter(S=>S.nullable===null).length;h&&Ce(r,"p",`null許容が未決：${h}項目（互換・移行用を含む）`,"structure-pending");const m=document.createElement("div");m.className="structure-tree",m.setAttribute("aria-label","構造のツリー"),r.append(m);const A=document.createElement("p");A.className="structure-filter-empty",A.hidden=!0,A.textContent="互換・移行用の構造は非表示です。表示するにはフィルターをOFFにしてください。",m.before(A);const j=document.createElement("p");j.className="structure-filter-empty",j.hidden=!0,j.setAttribute("role","status"),j.textContent="検索結果は0件です。",m.before(j);let w=null,L,I,y;const W=S=>JSON.stringify(S.kind==="attribute"?["attribute",S.conceptId,S.informationId]:["structure",S.conceptId,S.fromId??"",S.relationId??""]),R=S=>{S.classList.add("structure-selected"),S.setAttribute("aria-current","true")},E=()=>{m.querySelectorAll(".structure-selected").forEach(Z=>{Z.classList.remove("structure-selected"),Z.removeAttribute("aria-current")});const S=y&&m.contains(y)&&y.dataset.structureSelection===L?y:Array.from(m.querySelectorAll("[data-structure-selection]")).find(Z=>Z.dataset.structureSelection===L);S&&(y=S,R(S))},P=(S,Z,x="select")=>{I=S,L=W(S),y=Z,m.querySelectorAll(".structure-selected").forEach(D=>{D.classList.remove("structure-selected"),D.removeAttribute("aria-current")}),R(Z),n.select?.({...S,hideLegacy:f.checked},x)},T=(S,Z,x,D)=>{const te=o.nodes.get(S),X=document.createElement("li");X.className="structure-item",X.dataset.conceptId=S;const be=x?i.relation(x.relation.id,S):i.concept(S);be&&(X.dataset.compatibility=be.kind);const re=Object.hasOwn(o.conceptNames,S)?o.conceptNames[S]:void 0,ae=re&&typeof re=="object"&&!Array.isArray(re)?re:{},C=typeof ae.typeName=="string"&&!!ae.typeName.trim(),z=C?ae.typeName:te.name,B=C&&typeof ae.logicalName=="string"&&ae.logicalName.trim()?ae.logicalName:"",fe=we=>te.information.filter(Ee=>we||i.field(Ee.id,S)?.kind!=="legacy").flatMap(Ee=>[Ee.name,o.mappings.get(Ee.id)?.physicalName??""]),Q=we=>[te.name,z,B,te.id,...fe(we),x?.roleName??"",...x?.fieldDetails.flatMap(Ee=>[Ee.name,Ee.physicalName])??[],...x?.fields??[],x?.relation.condition??""].join(" ").toLocaleLowerCase();X.dataset.searchText=Q(!0),X.dataset.searchVisibleText=Q(!1),x&&(X.dataset.relationId=x.relation.id,X.dataset.relationDirection=x.direction);const ye=(o.edges.get(S)??[]).some(we=>we.direction==="owner"&&!!we.roleName)&&x?.direction==="reference",le=ye?S+"\0reference":S,ue=Z.has(S),ve=!!D?.has(le),ze=ve||!!D?.has(ye?S:S+"\0reference"),pe=document.createElement("summary");pe.className="structure-node-row",pe.append(Qs(x?.direction==="reference"||x?.direction==="owner"?ec:Qa,x?Yn[x.direction]:"構造")),Zr(pe,be);const Ie={kind:"structure",conceptId:S,...x?{fromId:x.from,relationId:x.relation.id}:{}};if(pe.dataset.structureSelection=W(Ie),pe.addEventListener("click",()=>P(Ie,pe)),x&&(x.direction==="unknownOut"&&Ce(pe,"span",Yn[x.direction],"structure-type"),Ce(pe,"span",x.count,"structure-count"),pe.title=`${Yn[x.direction]}：移動先 ${x.count}／反対側 ${x.reverseCount}${x.relation.condition?" — "+x.relation.condition:""}${x.fields.length>x.visibleFields.length?" — 物理項目："+x.fields.join("、"):""}`),x){const we=x.fieldDetails.length?x.fieldDetails:[void 0],Ee=tt=>{const nt=document.createElement("span");nt.className="structure-element",pe.append(nt),Ce(nt,"strong",tt)};x.roleName&&we.length===1?Ee(x.roleName):(x.roleName&&Ee(x.roleName),we.forEach((tt,nt)=>{(nt||x.roleName)&&Ce(pe,"span","／"),Ee(tt?.name?.trim()||"名前未定義")}))}else Ce(pe,"strong",B||te.name);(ue||ze)&&Ce(pe,"span","既出","structure-seen");const bt=(o.edges.get(S)??[]).some(we=>$i.includes(we.direction)||we.direction==="owner"&&!!we.roleName&&!(x?.direction==="owned"&&x.relation.id===we.relation.id&&x.from===we.to)),We=document.createElement("details");We.className="structure-node"+(bt?"":" structure-leaf"),We.append(pe),X.append(We);let yo=!1;const vo=new Set(Z);vo.add(S);const Qe=we=>{if(yo)return;yo=!0;const Ee=document.createElement("ul");Ee.className="structure-children",We.append(Ee);for(const tt of[...$i,"owner"]){const nt=(o.edges.get(S)??[]).filter(_e=>_e.direction===tt&&(tt!=="owner"||!!_e.roleName&&!(x?.direction==="owned"&&x.relation.id===_e.relation.id&&x.from===_e.to)));if(nt.length)for(const _e of nt)Ee.append(T(_e.to,vo,_e,we))}m.contains(We)&&(E(),H())};return pe.addEventListener("keydown",we=>{if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(we.key)||we.altKey||we.ctrlKey||we.metaKey)return;we.preventDefault(),we.stopPropagation();const Ee=Array.from(m.querySelectorAll("summary")).filter(nt=>{if(nt.closest("[hidden]"))return!1;for(let _e=nt.parentElement?.parentElement;_e&&_e!==m;_e=_e.parentElement)if(_e instanceof HTMLDetailsElement&&!_e.open)return!1;return!0}),tt=Ee.indexOf(pe);we.key==="ArrowDown"?Ee[tt+1]?.focus():we.key==="ArrowUp"?Ee[tt-1]?.focus():we.key==="Home"?Ee[0]?.focus():we.key==="End"?Ee.at(-1)?.focus():we.key==="ArrowRight"&&bt?We.open?We.querySelector(":scope > .structure-children > li:not([hidden]) > details > summary")?.focus():(We.open=!0,Qe()):we.key==="ArrowLeft"&&(We.open&&bt?We.open=!1:X.parentElement?.closest(".structure-item")?.querySelector(":scope > details > summary")?.focus())}),We.addEventListener("toggle",()=>{We.open&&Qe()}),D&&!ve&&!ue&&(D.add(le),We.open=!0,Qe(D)),X},q=S=>{const Z=document.createElement("ul");Z.className="structure-root";const x=S?new Set:void 0;for(const D of s)Z.append(T(D,new Set,void 0,x));if(m.replaceChildren(Z),!S){const D=Z.querySelector(".structure-node");D.open=!0,D.dispatchEvent(new Event("toggle"))}E()},H=()=>{const S=p.value.trim().toLocaleLowerCase();S&&!w?(w=m.firstChild,q(!0)):!S&&w&&(m.replaceChildren(w),w=null,E());const Z=Array.from(m.querySelectorAll("[data-search-text]")).reverse(),x=new Set;for(const D of Z){const te=(f.checked?D.dataset.searchVisibleText??D.dataset.searchText:D.dataset.searchText)?.includes(S)??!1;if(D.hidden=f.checked&&D.dataset.compatibility==="legacy"||!!S&&!te&&!x.has(D),!D.hidden){const X=D.parentElement?.closest("[data-search-text]");X&&x.add(X)}}A.hidden=!!S||!f.checked||!s.every(D=>i.concept(D)?.kind==="legacy"),j.hidden=!S||Array.from(m.querySelectorAll(".structure-root > li")).some(D=>!D.hidden)};if(f.onchange=()=>{const S=m.querySelector(".structure-selected");f.checked&&S?.closest('[data-compatibility="legacy"]')?(L=void 0,I=void 0,n.clearSelection?.()):I&&n.select?.({...I,hideLegacy:f.checked},"filter"),H(),E()},u.onclick=()=>{w=null,p.value="",q(!0),H()},c.onclick=()=>{w=null,p.value="",q(!1);const S=m.querySelector(".structure-node");S&&(S.open=!1),H()},p.oninput=H,q(!1),n.autoSelect){const S=Array.from(m.querySelectorAll(".structure-root > .structure-item")).find(x=>!x.hidden),Z=S?.querySelector(":scope > details > summary");S?.dataset.conceptId&&Z&&P({kind:"structure",conceptId:S.dataset.conceptId},Z,"initial")}}const Rn=["landscape","overview"],wn="structure-explorer";function Ld(e,t){const n=e.querySelector(".workspace"),o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const r=document.createElement("aside");r.id="design-explorer",r.setAttribute("aria-label","設計ナビゲーション"),r.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><div class="explorer-mode-tabs" role="tablist" aria-label="エクスプローラーの切替"><button type="button" role="tab" id="explorer-tab-document" aria-controls="explorer-document-panel">文章</button><button type="button" role="tab" id="explorer-tab-structure" aria-controls="explorer-structure-panel">構造</button></div><div id="explorer-document-panel" class="explorer-document-panel" role="tabpanel" aria-labelledby="explorer-tab-document"><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav></div><div id="explorer-structure-panel" class="explorer-structure-panel" role="tabpanel" aria-labelledby="explorer-tab-structure" hidden></div>',r.prepend(r.querySelector(".explorer-mode-tabs"));const l=document.createElement("div");l.className="shell-center",s.append(r,l),l.append(o,n);const u=document.createElement("div");u.className="shell-open-tabs",i.before(u),u.append(i),jc(u);const c=document.createElement("nav");c.className="concept-tabs",c.setAttribute("aria-label","開いているサブシステムとデータ構造"),u.append(c);const a=document.createElement("nav");a.className="state-tabs",a.setAttribute("aria-label","開いている状態遷移"),u.append(a);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),u.append(f);const d=document.createElement("section");d.id="concept-workspace",d.hidden=!0,d.setAttribute("aria-label","データ構造"),d.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',l.append(d);const p=new Map,g=new Map,h=new Map,m=document.createElement("section");m.id="states-workspace",m.hidden=!0,m.setAttribute("aria-label","状態遷移"),m.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',l.append(m);const A=document.createElement("section");A.id="tests-workspace",A.hidden=!0,A.setAttribute("aria-label","テスト仕様"),A.innerHTML='<main class="test-spec-page"></main>',l.append(A);const j=document.createElement("aside");j.id="test-related-panel",j.className="spec-related",j.setAttribute("aria-label","関連資料"),j.hidden=!0,j.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const w=document.createElement("section");w.id="empty-workspace",w.hidden=!0,w.innerHTML="<p>左の一覧から図を開いてください。</p>",l.append(w);const L=n.querySelector("#node-list-drawer");r.append(L);const I=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),W=r.querySelector(".explorer-search input"),R=r.querySelector(".explorer-groups"),E=r.querySelector("#explorer-document-panel"),P=r.querySelector("#explorer-structure-panel"),T=r.querySelector("#explorer-tab-document"),q=r.querySelector("#explorer-tab-structure"),H=d.querySelector("iframe"),S=d.querySelector(".concept-related"),Z=m.querySelector("article"),x="alder-explorer-v1:"+location.pathname,D=location.protocol==="file:"||location.origin==="null"?"*":location.origin,te=window.__alderConceptHtml;let X,be,re,ae,C={},z=[],B=[...Rn],fe=new Map,Q=new Map,ge=new Map,ye=new Map,le=new Map;const ue=b=>wn+":"+b,ve=b=>b===wn||le.has(b),ze=b=>ge.get(b)??b,pe=b=>ye.get(b)??b,Ie=b=>be?.findGroup(fe.get(b??"")),bt=b=>re?.contentFor(fe.get(b)??""),We=(b,v)=>re?.findDataExample(fe.get(b)??"",v),yo=b=>re?.examplesFor(fe.get(b)??"")??[],vo=b=>b===wn?"構造エクスプローラー":le.has(b)?(X?.model.concepts.find(v=>v.id===le.get(b))?.name??b)+"・構造":Rn.includes(b)?"全体図":bt(b)?.title??Ie(b)?.name??C[Q.get(b)??""]?.name,Qe=()=>{const b=t.business(),v=b.design?.model;return v?[...v.checks,...b.relatedChecks??[]].filter(N=>N.basedOn.documentId===v.business.id):[]},we=()=>Nd(X,Qe()),Ee=b=>we().find(v=>v.key===(b.startsWith("decision:")?b.slice(9):b)),tt=b=>we().filter(v=>v.name===b.name).length>1?b.name+"（"+(t.business().activities.find(v=>v.id===b.activityId)?.name??"その他")+"）":b.name,nt=b=>Qe().some(v=>v.index.some(N=>N.activityId===b)||v.sections.some(N=>N.activityId===b)),_e=b=>new Set(we().filter(v=>v.activityId===b).flatMap(v=>v.checkIds)),js=b=>{const v=new Set(we().filter(N=>N.activityId===b).flatMap(N=>N.decisionExampleIds));return new Set(Qe().flatMap(N=>N.examples.filter(O=>v.has(O.id)).map(O=>O.guaranteeId)))},Ms=b=>{const v=_e(b),N=js(b);return Qe().some(O=>O.index.some($=>$.activityId===b&&$.checkIds.some(J=>!v.has(J)))||O.sections.some($=>$.activityId===b&&($.preamble.length>0||O.guarantees.some(J=>J.sectionId===$.id&&!N.has(J.id)))))},Ra=()=>Qe().some(b=>b.items.some(v=>!b.index.some(N=>N.checkIds.includes(v.id)))||b.sections.some(v=>v.activityId===null)||b.notes.length>0),Da=b=>{const v=Ee(b);return v?v.capability.testSpecification?tt(v)+"・"+(b.startsWith("decision:")?"可否":"結果"):v.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(N=>N.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(N=>N.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},wo=n.querySelector("#formattedMarkdownDrawer");wo&&s.append(wo),s.append(S,j),Ai(r,s,x+":explorer-width","left"),Ai(S,s,x+":drawer-width"),Ai(j,s,x+":test-drawer-width");let ko=!1;const gt=t.rightDrawer??{isOpen:()=>ko,setOpen:b=>{ko=b}};let se="business",De=!1,it=[],U="overview",st=[],yt="",vt=[],Pe="@overview",Nn,Ht=innerWidth>800,Io=!1,So=!0,wt=!1,Gn,rt="document",Kn=wn;const kt=new Map,Et=new Map([["overview",H]]),pt=new Map,bn=new Map,gn=new Map,Ue=new Map,on=new Map,Ct=new Set,Xe=new Set,yn=new Set,Ve=new Map;let Ae;try{if(Ae=JSON.parse(sessionStorage.getItem(x)||"null"),Ae){if(wt=Ae.overviewClosed===!0,Gn=typeof Ae.documentKey=="string"?Ae.documentKey:void 0,Ht=typeof Ae.left=="boolean"?Ae.left:Ht,rt=Ae.explorerMode==="structure"?"structure":"document",Array.isArray(Ae.expanded)){Xe.clear();for(const b of Ae.expanded)typeof b=="string"&&Xe.add(b)}st=Array.isArray(Ae.states)?Ae.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof Ae.rightOpen=="boolean"?ko=Ae.rightOpen:typeof Ae.right?.["concept:"+Ae.active]=="boolean"&&(ko=Ae.right["concept:"+Ae.active]))}}catch{}function Ta(){if(!(!Ae||Gn!==t.business().key||!De)){for(const b of Array.isArray(Ae.overviewModes)?Ae.overviewModes:[])Ie(b)&&Ct.add(b);for(const[b,v]of Object.entries(Ae.lastExamples??Ae.examples??{}))typeof v=="string"&&We(b,v)&&on.set(b,v);for(const[b,v]of Object.entries(Ae.examples??{}))typeof v=="string"&&We(b,v)&&Ue.set(b,v);for(const[b,v]of Object.entries(Ae.selected??{}))typeof v=="string"&&z.includes(v)&&pt.set(b,v);it=[...new Set((Array.isArray(Ae.concepts)?Ae.concepts:[]).filter(b=>typeof b=="string"&&B.includes(b)))],U=it.includes(Ae.active)?Ae.active:"landscape"}}let vn;const Be=()=>{try{sessionStorage.setItem(x,JSON.stringify({documentKey:Nn,overviewClosed:wt,selected:Object.fromEntries(pt),examples:Object.fromEntries(Ue),lastExamples:Object.fromEntries(on),overviewModes:[...Ct],left:Ht,explorerMode:rt,expandedVersion:4,expanded:[...Xe],concepts:it,active:U,states:st,specs:vt,activeSpec:Pe,specExamples:Object.fromEntries(kt),...t.rightDrawer?{}:{rightOpen:gt.isOpen()}}))}catch{}},sn=()=>{se==="concept"&&ve(U)?Ve.set("structure:"+U,g.get(U)?.scrollTop??0):se==="concept"&&Ve.set("drawer:"+U,S.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&gt.isOpen()&&Ct.has(U)&&Ve.set("review-overview:"+U,S.querySelector(".data-review-overview").scrollTop),se==="concept"&&Ue.has(U)&&Ve.set("example:"+U+":"+Ue.get(U),S.querySelector(".data-examples-panel").scrollTop),se==="states"&&yt&&Ve.set("state:"+yt,Z.scrollTop),se==="tests"&&Ve.set("tests:"+Pe,A.querySelector(".test-spec-page").scrollTop),se==="concept"&&U==="landscape"&&Ve.set("concept:landscape",d.querySelector(".concept-review-landscape").scrollTop)};function Ze(b=!0){if(Io)return;const v=new URL(location.href);if(v.searchParams.set("view",se),v.searchParams.delete("concept"),v.searchParams.delete("dataExample"),v.searchParams.delete("dataView"),se==="concept"&&gt.isOpen()&&Ct.has(U)?v.searchParams.set("dataView","overview"):se==="concept"&&Ie(U)&&!Ue.has(U)&&v.searchParams.set("dataView","structure"),se==="concept"&&gt.isOpen()&&Ue.has(U)&&v.searchParams.set("dataExample",Ue.get(U)),se==="tests"&&kt.has(Pe)&&v.searchParams.set("dataExample",kt.get(Pe)),v.searchParams.delete("state"),v.searchParams.delete("activity"),v.searchParams.delete("object"),v.searchParams.delete("spec"),se==="concept"&&v.searchParams.set("concept",U),se==="states"&&yt&&v.searchParams.set("state",yt),se==="tests"&&v.searchParams.set("spec",Pe),se==="business"){const N=t.business(),O=N.views?.find($=>$.key===N.viewKey);O?.activity?v.searchParams.set("activity",O.activity):O?.object&&v.searchParams.set("object",O.object)}v.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",v)}function Le(b,v,N){const O=document.createElement(v);return O.textContent=N,b.append(O),O}function It(b){b!==se&&(se==="business"?t.capture():sn(),se=b),n.hidden=se!=="business",d.hidden=se!=="concept",m.hidden=se!=="states",A.hidden=se!=="tests",w.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),jt(),St()}function Ot(b,v=!0){De&&(b==="subsystems"&&(b="landscape"),B.includes(b)&&(sn(),it.includes(b)||it.push(b),U=b,ve(b)&&(rt="structure",Kn=b),It("concept"),ki(),Nt(),Be(),v&&Ze()))}function Pa(){sn(),Ue.delete(U),Ct.add(U),ki(),S.querySelector(".concept-drawer-body").scrollTop=Ve.get("drawer-overview:"+U)??0,Be(),Ze()}function qa(b,v=!0){if(b&&!We(U,b))return;const N=!Ue.has(U),O=S.querySelector(".concept-drawer-body");N&&Ve.set("drawer-overview:"+U,O.scrollTop),sn(),Ct.delete(U),b?(Ue.set(U,b),on.set(U,b)):Ue.delete(U),gt.setOpen(!0),ki(),N&&(O.scrollTop=0),Be(),Ze(),v&&S.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}S.querySelector(".concept-example-back").onclick=()=>{Pa(),S.querySelector(".data-review-overview").focus({preventScroll:!0})};function jn(b,v=!0){t.business().states?.some(N=>N.id===b)&&(sn(),st.includes(b)||st.push(b),yt=b,It("states"),Ha(),Nt(),Be(),v&&Ze())}function hi(b){return b.startsWith("decision:")&&Ee(b)&&!Ee(b)?.capability.testSpecification?Ee(b).key:Ee(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&nt(b.slice(7))||b.startsWith("remaining:")&&Ms(b.slice(10))?b:t.business().activities.some(v=>v.id===b)?we().find(v=>v.activityId===b)?.key??(nt(b)?"checks:"+b:"@overview"):"@overview"}function Dt(b,v=!0){const N=t.business();if(!N.design?.model||!N.key)return;b=hi(b),se==="tests"&&b!==Pe&&sn(),vt.includes(b)||vt.push(b),Pe=b;const O=Ee(b);Io||(O?.capability.testSpecification?Xe.add("tests-function-"+O.key):O?.activityId?Xe.add("tests-activity-"+O.activityId):b.startsWith("checks:")?Xe.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?Xe.add("tests-activity-"+b.slice(10)):O&&Xe.add("tests-other")),It("tests"),bi(),Nt(),St(),Be(),v&&Ze()}function bi(){const b=t.business().design;if(!b?.model)return;const v=A.querySelector(".test-spec-page"),N=Ee(Pe);if(N){const O=document.createElement("section");O.className="test-spec-sample";const $=be?.findGroup(N.groupId),J=N.samples.find(me=>me.id===kt.get(Pe))??N.samples[0],F=!!N.capability.testSpecification,ee=Pe.startsWith("decision:");if(F)if(Le(O,"h2",N.name),Le(O,"h3",ee?"可否判定":"処理結果"),ee)N.decisionExampleIds.length?O.append(Ed(b,N.decisionExampleIds,Qe())):N.decisionCheckIds.length?O.append(Cd(b,N.decisionCheckIds,Qe())):Le(O,"p","可否条件の記載はありません。");else{const me=$&&J&&re?new Set(N.samples.flatMap(Re=>Re.checkIds??[])):new Set;if(O.append(Od(b,N.resultCheckIds,Qe(),me)),$&&J&&re){Le(O,"h3","データ例");const Re=document.createElement("div");Re.className="data-examples-panel test-spec-examples",O.append(Re),re.renderDataExample(Re,$,J.id,He=>{Ve.set("tests:"+Pe,v.scrollTop),kt.set(Pe,He),bi(),Be(),Ze(),A.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:N.capability.id,sampleIds:N.samples.map(He=>He.id),hideCapability:!0,hideSinglePicker:!0})}}else if($&&J&&re){const me=document.createElement("div");me.className="data-examples-panel test-spec-examples",O.append(me),re.renderDataExample(me,$,J.id,Re=>{Ve.set("tests:"+Pe,v.scrollTop),kt.set(Pe,Re),bi(),Be(),Ze(),A.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:N.capability.id,heading:N.name,sampleIds:N.samples.map(Re=>Re.id),renderSpecification:Re=>Re.append(Sd(b,J.checkIds??[],Qe()))})}v.replaceChildren(O)}else if(Pe==="@overview")v.replaceChildren(),Le(v,"p","左のメニューからテスト仕様を選択してください。");else if(Pe.startsWith("remaining:")){const O=Pe.slice(10);v.replaceChildren(Zs(b,O,Qe(),_e(O),js(O)))}else v.replaceChildren(Zs(b,Pe.startsWith("checks:")?Pe.slice(7):void 0,Qe()));$a(N),v.scrollTop=Ve.get("tests:"+Pe)??0}function Jn(b){b||(wt=!1),It("business"),b?t.openActivity(b):(wt=!1,t.openOverview()),St(),Nt(),Ze()}function Wa(b){It("business"),t.openObject(b),St(),Nt(),Ze()}function Ls(b){const v=t.business(),N=v.design?.model;return N?[...new Set(N.states.filter(O=>O.objectId===b&&O.basedOn.documentId===N.business.id&&O.basedOn.revision===N.business.revision).flatMap(O=>O.transitions.map($=>$.activityId)))]:[...new Set((v.design?.objectStateTransitions?.[b]?.model?.transitions??[]).flatMap(O=>O.activityId?[O.activityId]:[]))]}function Rs(b){return(t.business().states??[]).filter(v=>Ls(v.id).includes(b))}function Ds(b){const v=t.business(),N=v.design?.model,O=X?.model.concepts.find($=>$.id===b);return!N||!X||!O?[]:(v.states??[]).filter($=>O.businessObjectIds.includes($.id)&&N.states.some(J=>J.objectId===$.id&&J.basedOn.documentId===N.business.id&&J.basedOn.revision===N.business.revision&&X.model.relatedStates.some(F=>F.documentId===J.id&&F.revision===J.revision)))}function gi(b,v,N="状態遷移"){if(!v.length)return;const O=document.createElement("section");O.className="shell-related-links",Le(O,"h3",N);for(const $ of v){const J=Gt(O,$.name,()=>jn($.id));J.dataset.relatedState=$.id}b.append(O)}function Ts(b){const v=X?.model.reviewGroups.find(O=>O.id===b.groupId);if(!v)return[];const N=new Set(v.graph.nodes.map(O=>O.conceptId));return[...new Set(b.samples.flatMap(O=>O.blocks.map($=>$.card)))].filter(O=>N.has(O)&&X?.model.concepts.some($=>$.id===O))}function Gt(b,v,N){const O=document.createElement("button");return O.type="button",O.className="shell-evidence",Le(O,"span",v),O.onclick=N,b.append(O),O}function yi(b,v){const N=v.filter($=>$.capability.testSpecification);if(!N.length)return;const O=document.createElement("section");O.className="shell-test-links",Le(O,"h3","テスト仕様書");for(const $ of N)for(const[J,F]of[["decision:","可否判定"],["","処理結果"]]){const ee=J+$.key,me=Gt(O,tt($)+"・"+F,()=>Dt(ee));me.dataset.relatedSpec=ee}b.append(O)}function za(b,v){const N=we().filter(ee=>ee.activityId===v&&ee.capability.testSpecification),O=X?.model.presentation.activityViews,$=Array.isArray(O)?O.find(ee=>ee&&typeof ee=="object"&&ee.activityId===v):void 0,J=Array.isArray($?.uncreatedTestSections)?$.uncreatedTestSections:[],F=b.querySelectorAll("[data-business-result],[data-business-exception]");for(const ee of Array.from(F)){const me=ee.dataset.businessException,Re=me?"exception":"result",He=me??"result",Ge=N.flatMap(at=>at.businessSections.filter(Pt=>Pt.kind===Re&&(Re==="result"||Pt.exceptionId===me)).flatMap(Pt=>Pt.pages.filter(G=>G==="decision"?at.decisionCheckIds.length||at.decisionExampleIds.length:at.resultCheckIds.length||at.samples.length).map(G=>({target:at,page:G})))),Tt=document.createElement("section");Tt.className="shell-section-links",Tt.setAttribute("aria-label","テスト仕様書");const mt=new Set;for(const{target:at,page:Pt}of Ge){const G=(Pt==="decision"?"decision:":"")+at.key;if(mt.has(G))continue;mt.add(G);const Ne=Gt(Tt,tt(at)+"・"+(Pt==="decision"?"可否判定":"処理結果"),()=>Dt(G));Ne.dataset.relatedSpec=G}if(!mt.size){const at=Le(Tt,"p",J.includes(He)?"テスト仕様書未作成":"テスト仕様書との対応未確認");at.className="shell-spec-warning"}ee.after(Tt)}yi(b,N.filter(ee=>!ee.businessSections.length))}function $a(b){const v=j.querySelector(".spec-related-content");if(v.replaceChildren(),!b?.capability.testSpecification)return;const N=t.business().activities.find(J=>J.id===b.activityId),O=be?.findGroup(b.groupId);if(N){Le(v,"h3","Activity");const J=Gt(v,N.name,()=>Jn(N.id));J.dataset.relatedActivity=N.id}if(O){Le(v,"h3","概念モデル");const J=Gt(v,O.name,()=>Ot(ze(O.id)));J.dataset.relatedGroup=O.id}const $=Ts(b);if($.length){Le(v,"h3","概念");for(const J of $){const F=X.model.concepts.find(me=>me.id===J),ee=Gt(v,F.name,()=>Ot(pe(J)));ee.dataset.relatedConcept=J}}b.activityId&&gi(v,Rs(b.activityId),"状態遷移（同じ Activity）")}function Ua(b,v){Le(b,"h3","Activity");const N=t.business(),O=Ie(U),$=X?.model.concepts.find(F=>F.id===v),J=O?.concepts[v]?.sourceActivities??O?.activities??$?.activityLinks.filter(F=>F.uses.includes("生成")).map(F=>F.activityId)??[];for(const F of J){const ee=N.activities.find(Re=>Re.id===F);if(!ee)continue;const me=document.createElement("button");me.className="shell-evidence",Le(me,"span",ee.name),me.title=ee.name+"を業務タブで開く",me.setAttribute("aria-label",me.title),me.onclick=()=>Jn(ee.id),b.append(me)}}function vi(b){const v=Ie(b);return v?be?.graph(v.id):b==="overview"?be?.overviewGraph():void 0}function Ps(b){const v=bn.get(U),N=v?vi(U)?.tables[v]:void 0;return N?.conceptId===b?N:void 0}function Fa(b,v){const N=Ps(v)??Ie(U)?.concepts[v]??{...C[v],sources:void 0};b.replaceChildren(),Le(b,"p",N.note),Le(b,"h3","持つ情報");const O=document.createElement("ul");for(const[,$]of N.fields)Le(O,"li",$);if(b.append(O),N.sources?.length){Le(b,"h3","情報の出所・対象時点");const $=document.createElement("ul");for(const J of N.sources)Le($,"li",J);b.append($)}Ua(b,v),yi(b,we().filter($=>Ts($).includes(v))),gi(b,Ds(v))}function wi(b){const v=S.querySelector(".shell-heading strong");v.textContent=b,S.setAttribute("aria-label",b)}function qs(b=!1){Ie(U)&&(pt.delete(U),bn.delete(U),gn.delete(U),b||Et.get(U)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},D),xo(),jt(),S.querySelector(".concept-drawer-body").scrollTop=0,Be())}S.querySelector(".concept-selection-clear").onclick=()=>{qs(),Ue.has(U)?S.querySelector(".concept-example-back").focus({preventScroll:!0}):S.querySelector(".data-review-overview").focus({preventScroll:!0})};function xo(){const b=S.querySelector(".concept-related-content");if(ve(U))return;S.querySelector(".concept-selection").hidden=!!Ie(U)&&!pt.has(U)&&!gn.has(U),S.querySelector(".concept-selection>h2").hidden=!Ie(U),S.querySelector(".concept-selection-clear").hidden=!Ie(U);const v=gn.get(U);if(v&&ae){const J=ae.describe(b,{kind:"group",id:v});wi(J);return}if(U==="landscape"&&vn){b.replaceChildren();for(const[J,F]of ae.sections){Le(b,"h3",J);const ee=document.createElement("ul");for(const me of F)Le(ee,"li",me);b.append(ee)}wi("サブシステムの情報");return}const N=pt.get(U),O=Ie(U),$=De&&N?Ps(N)?.name??O?.concepts[N]?.name??C[N].name:O?.name??"データ構造の情報";wi($),De&&N?Fa(b,N):(b.replaceChildren(),O||Le(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function Ao(b,v=!1){const N=g.get(b);if(!N||!X)return;const O=N.querySelector(".structure-detail-content");Yr(O,X.model,h.get(b),$=>{h.set(b,$),Ve.set("structure:"+b,0),Ao(b,!0)}),v&&(N.scrollTop=0)}function Ws(b){if(!(!X||!De||!ve(b))){if(!g.has(b)){const v=document.createElement("article");v.className="structure-detail-page",v.hidden=se!=="concept"||U!==b,v.setAttribute("aria-label","構造の詳細"),Le(v,"h1","構造の詳細");const N=document.createElement("div");N.className="structure-detail-content",v.append(N),d.querySelector(".concept-main").append(v),g.set(b,v)}if(!p.has(b)){const v=document.createElement("article");v.setAttribute("aria-label","構造エクスプローラー"),P.append(v),p.set(b,v),Md(v,X.model,{rootId:le.get(b),autoSelect:se==="concept"&&U===b&&!h.has(b),select:(N,O)=>{h.set(b,N),O==="select"&&Ve.set("structure:"+b,0),O==="select"&&(se!=="concept"||U!==b)?Ot(b):se==="concept"&&U===b&&Ao(b,O!=="filter")},clearSelection:()=>{h.delete(b),se==="concept"&&U===b&&Ao(b)}})}}}function zs(b){b.onload=()=>{Fs(),b.contentDocument&&(Gs(b.contentDocument),Ks(b.contentDocument));const v=b.dataset.conceptView??"overview";if(!be||!X)return;const N=Ie(v),O=N?be.graph(N.id):v==="overview"?be.overviewGraph():{ids:z,edges:be.edges,tables:C};b.contentWindow?.postMessage({type:"alder-concept-data",graph:O,focus:Q.get(v),viewKey:v,documentKey:Nn??X.model.id,clearSelectionOnBackground:!!N},D);const $=pt.get(v);$&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:$},D)}}zs(H),H.dataset.conceptView="overview";function Va(){S.querySelector(".concept-page-details").hidden=!0,S.querySelector(".concept-example-back").hidden=!0;const b=S.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const v=S.querySelector(".data-examples-panel");v.hidden=!0,v.replaceChildren(),delete v.dataset.dataExample,vn?.root.remove(),vn=void 0;for(const[N,O]of Et)N!=="overview"&&(O.remove(),Et.delete(N));for(const N of p.values())N.remove();for(const N of g.values())N.remove();p.clear(),g.clear(),h.clear(),Kn=wn,H.removeAttribute("src"),H.removeAttribute("srcdoc"),pt.clear(),bn.clear(),gn.clear()}function ki(){d.setAttribute("aria-label",U==="landscape"||Ie(U)?"サブシステム":"データ構造"),d.querySelector(".concept-empty").hidden=De;const b=d.querySelector(".concept-review-landscape"),v=Ie(U),N=S.querySelector(".concept-page-details"),O=S.querySelector(".data-review-overview"),$=S.querySelector(".data-examples-panel");if(N.hidden=!De||!v,O.hidden=!De||!v||Ue.has(U),$.hidden=!De||!v||!Ue.has(U),S.querySelector(".concept-example-back").hidden=$.hidden,De&&v){const F=we();Pc(O,v,re,(me,Re)=>{const He=Ys(F,v.id,me,Re);if(He)return{kind:He.kind,open:()=>{const Ge=Ys(we(),v.id,me,Re);Ge&&(Ge.sampleId?kt.set(Ge.key,Ge.sampleId):kt.delete(Ge.key),Dt(Ge.key))}}},me=>Jn(me),t.business().activities),yi(O,F.filter(me=>me.groupId===v.id));const ee=Ue.get(U)??on.get(U)??yo(U)[0]?.id;ee&&re.renderDataExample($,v,ee,me=>qa(me)),O.scrollTop=Ve.get("review-overview:"+U)??0,$.scrollTop=Ve.get("example:"+U+":"+ee)??0}b.hidden=!De||!Rn.includes(U),De&&ve(U)&&(Ws(U),Ao(U));for(const[F,ee]of g)ee.hidden=!De||F!==U;for(const[F,ee]of p)ee.hidden=!De||F!==Kn;if(De&&Rn.includes(U)&&(U==="landscape"&&!vn&&(vn=Fc(document,X,Nn??X.model.id,F=>Ot(ze(F)))),Tc(b,vn?.root,U==="overview"?"graph":"overview"),U==="landscape"&&vn?.restore()),De&&U!=="landscape"&&!ve(U)&&!Et.has(U)){const F=document.createElement("iframe");F.className="concept-frame",F.dataset.conceptView=U,F.title=v?v.name+"のデータ構造":C[Q.get(U)].name+"と隣接する概念",F.hidden=!0,Et.set(U,F);const ee=Q.get(U);ee&&pt.set(U,pt.get(U)??ee),zs(F),d.querySelector(".concept-main").append(F)}for(const[F,ee]of Et)ee.hidden=!De||F!==U,De&&F===U&&!ee.hasAttribute("src")&&!ee.hasAttribute("srcdoc")&&(te?ee.srcdoc=te:ee.src=new URL("concept.html?view=overview"+(Ie(F)?"&group="+encodeURIComponent(Ie(F).id):F==="overview"?"":"&focus="+encodeURIComponent(Q.get(F))),document.baseURI).href);const J=pt.get(U);if(J&&Et.get(U)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:J},D),xo(),jt(),ve(U)){const F=g.get(U);F&&(F.scrollTop=Ve.get("structure:"+U)??0)}else S.querySelector(".concept-drawer-body").scrollTop=Ve.get("drawer:"+U)??0}function Mn(){const b=t.business(),v=b.views?.find(N=>N.activity!==void 0||N.object!==void 0||!wt);v?(It("business"),t.activateView(v.key)):it.length?Ot(it.at(-1),!1):st.length?jn(st.at(-1),!1):vt.length?Dt(vt.at(-1),!1):It("empty")}function Ba(){if(wt=!0,se==="business"){const b=t.business().views?.find(v=>v.key===t.business().viewKey);!b?.activity&&!b?.object&&Mn()}Nt(),St(),Be(),Ze(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function Ha(){Z.replaceChildren();const b=t.business().states?.find(ee=>ee.id===yt);if(!b)return;const v=t.statePanel(b.id);v?Z.append(v):Le(Z,"p","この対象の状態遷移は未定義です。");const N=j.querySelector(".spec-related-content");N.replaceChildren();const O=Ls(b.id),$=t.business().activities.filter(ee=>O.includes(ee.id));if($.length){Le(N,"h3","Activity");for(const ee of $){const me=Gt(N,ee.name,()=>Jn(ee.id));me.dataset.relatedActivity=ee.id}}const J=X?.model.concepts.filter(ee=>Ds(ee.id).some(me=>me.id===b.id))??[];if(J.length){Le(N,"h3","概念");for(const ee of J){const me=Gt(N,ee.name,()=>Ot(pe(ee.id)));me.dataset.relatedConcept=ee.id}}const F=we().filter(ee=>ee.activityId&&O.includes(ee.activityId)&&ee.capability.testSpecification);if(F.length){Le(N,"h3","Activity に関連するテスト仕様書");for(const ee of F)for(const[me,Re]of[["decision:","可否判定"],["","処理結果"]]){const He=me+ee.key,Ge=Gt(N,tt(ee)+"・"+Re,()=>Dt(He));Ge.dataset.relatedSpec=He}}Z.scrollTop=Ve.get("state:"+yt)??0}let Ii="";function Nt(){for(const O of Array.from(i.querySelectorAll(".tab"))){const $=t.business().views?.find(F=>F.key===O.dataset.key);O.hidden=wt&&$?.activity===void 0&&$?.object===void 0;const J=!O.hidden&&se==="business"&&O.dataset.key===t.business().viewKey;O.classList.toggle("active",J),O.querySelector("button")?.setAttribute("aria-current",String(J))}const b=(O,$,J)=>{O.replaceChildren();for(const F of $){const ee=J==="concept"?vo(F):t.business().states?.find(mt=>mt.id===F)?.name??F,me=se===J&&F===(J==="concept"?U:yt),Re=document.createElement("div");Re.className="tab"+(me?" active":"");const He=J==="concept"&&(F==="landscape"||Ie(F))?"subsystems":J;Re.dataset.viewKind=He;const Ge=document.createElement("button");Ge.id=(J==="concept"?"concept-tab-":"state-tab-")+F,Ti(Ge,He,ee),Ge.setAttribute("aria-current",String(me)),Ge.onclick=()=>J==="concept"?Ot(F):jn(F),Re.append(Ge);const Tt=Pi((He==="subsystems"?"サブシステム：":J==="concept"?"データ構造：":"状態遷移：")+ee+"のタブを閉じる");Tt.onclick=()=>{sn(),J==="concept"?(it=it.filter(mt=>mt!==F),F!=="overview"&&(Et.get(F)?.remove(),Et.delete(F)),pt.delete(F),bn.delete(F),gn.delete(F),Ue.delete(F),on.delete(F),Ct.delete(F),se===J&&U===F&&(it.length?Ot(it.at(-1),!1):Mn())):(st=st.filter(mt=>mt!==F),se===J&&yt===F&&(st.length?jn(st.at(-1),!1):Mn())),Nt(),St(),Be(),Ze(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Re.append(Tt),O.append(Re)}};b(c,it,"concept"),b(a,st,"states"),f.replaceChildren();for(const O of vt){const $=Da(O),J=document.createElement("div");J.className="tab"+(se==="tests"&&O===Pe?" active":""),J.dataset.viewKind="tests";const F=document.createElement("button");F.id="spec-tab-"+O,Ti(F,"tests",$),F.setAttribute("aria-current",String(se==="tests"&&O===Pe)),F.onclick=()=>Dt(O);const ee=Pi("テスト仕様："+$+"のタブを閉じる");ee.onclick=()=>{vt=vt.filter(me=>me!==O),se==="tests"&&Pe===O&&(vt.length?Dt(vt.at(-1),!1):Mn()),Nt(),St(),Be(),Ze()},J.append(F,ee),f.append(J)}const v=u.querySelector(".tab.active:not([hidden])"),N=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+U:se==="states"?"states:"+yt:se==="tests"?"tests:"+Pe:"";v?(N!==Ii&&Mc(u,v),Ii=N):Ii=""}function Ga(){innerWidth<=800&&Eo(!1)}function St(){const b=R.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,v=R.scrollTop,N=t.business(),O=W.value.trim().toLocaleLowerCase();R.replaceChildren();const $=(G,Ne,ct)=>({kind:"item",id:G,name:Ne,key:ct}),J=(G,Ne,ct)=>({kind:"group",id:G,name:Ne,children:ct}),F=we(),ee=G=>$(G.key,G.name,"tests:"+G.key),me=F.filter(G=>G.capability.testSpecification),Re=F.filter(G=>!G.capability.testSpecification),He=me.map(G=>J("tests-function-"+G.key,tt(G),[$("decision:"+G.key,"可否判定","tests:decision:"+G.key),$(G.key,"処理結果","tests:"+G.key)]));for(const G of N.activities){const Ne=Re.filter(ot=>ot.activityId===G.id).map(ee),ct=(_e(G.id).size?"remaining:":"checks:")+G.id;Ms(G.id)&&Ne.push($(ct,"その他","tests:"+ct)),Ne.length&&He.push(J("tests-activity-"+G.id,G.name,Ne))}const Ge=Re.filter(G=>!G.activityId);Ge.length&&He.push(J("tests-other","その他",Ge.map(ee))),Ra()&&He.push($("@unassigned","未割当","tests:@unassigned"));const Tt=[{id:"business",label:"業務設計",items:[$("overview","全体図","business:overview"),J("business-activity","Activity",N.activities.map(G=>$(G.id,G.name,"business:"+G.id))),J("business-object","Object",(N.objects??[]).map(G=>$(G.id,G.name,"object:"+G.id)))]},{id:"states",label:"状態遷移",items:(N.states??[]).map(G=>$(G.id,G.name,"states:"+G.id))},{id:"subsystems",label:"サブシステム",items:X?.model.subsystems.length?[$("landscape","全体図","concept:landscape"),...X.model.subsystems.map(G=>J("subsystem-"+G.id,G.name.replace(/サブシステム$/,""),X.model.reviewGroups.filter(Ne=>Ne.subsystemId===G.id).map(Ne=>$(ze(Ne.id),Ne.title,"concept:"+ze(Ne.id)))))]:[]},{id:"concept",label:"データ構造",items:De&&z.length?[$("overview","全体図","concept:overview"),J("concept-relations","概念",z.map(G=>$(pe(G),C[G].name,"concept:"+pe(G))))]:[]},{id:"tests",label:"テスト仕様",items:N.design?.model&&(F.length||Qe().length)?He:[]}];let mt=0;const at=(G,Ne,ct)=>{const ot=document.createElement("button");ot.className="explorer-item"+(ct?" explorer-item-nested":""),ot.dataset.explorerKey=G.key,ot.textContent=G.name;const Ye=N.views?.find(Ke=>Ke.key===N.viewKey);return se===(Ne.id==="subsystems"?"concept":Ne.id)&&(["concept","subsystems"].includes(Ne.id)?G.id===U:Ne.id==="states"?G.id===yt:Ne.id==="tests"?G.id===Pe:G.key.startsWith("object:")?Ye?.object===G.id:G.id==="overview"?!wt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===G.id)&&ot.setAttribute("aria-current","page"),ot.disabled=Ne.id==="business"&&!N.key,ot.onclick=()=>{L.hidden||t.closeLegacyList(),Ne.id==="business"?G.key.startsWith("object:")?Wa(G.id):Jn(G.id==="overview"?void 0:G.id):Ne.id==="concept"||Ne.id==="subsystems"?Ot(G.id):Ne.id==="tests"?Dt(G.id):jn(G.id),Ga()},ot},Pt=(G,Ne,ct,ot=!1)=>{const Ye=document.createElement("button"),qt=O?!yn.has(G):Xe.has(G);return Ye.className=(ct?"explorer-subparent":"explorer-parent")+(ot?" explorer-pending":""),Ye.dataset.explorerKey="group:"+G,Le(Ye,"span",Ne).className="explorer-parent-label",ot?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(qt)),Ye.setAttribute("aria-controls","explorer-"+G),Ye.append(Nc(qt)),Ye.onclick=()=>{O?yn.has(G)?yn.delete(G):yn.add(G):(Xe.has(G)?Xe.delete(G):Xe.add(G),Be()),St()},Ye)};for(const G of Tt){const Ne=G.items.flatMap(Ke=>{if(Ke.kind==="item")return!O||(G.label+" "+Ke.name).toLocaleLowerCase().includes(O)?[Ke]:[];const rn=O?Ke.children.filter(xi=>(G.label+" "+Ke.name+" "+xi.name).toLocaleLowerCase().includes(O)):Ke.children;return!O||rn.length?[{...Ke,children:rn}]:[]});if(O&&!Ne.length)continue;const ct=G.id!=="business"&&!G.items.length,ot=document.createElement("section"),Ye=Pt(G.id,G.label,!1,ct),qt=document.createElement("div");qt.id="explorer-"+G.id,qt.hidden=ct||(O?yn.has(G.id):!Xe.has(G.id));for(const Ke of Ne){if(Ke.kind==="item"){qt.append(at(Ke,G,0)),mt++;continue}const rn=document.createElement("div");rn.id="explorer-"+Ke.id,rn.hidden=O?yn.has(Ke.id):!Xe.has(Ke.id),qt.append(Pt(Ke.id,Ke.name,!0),rn);for(const xi of Ke.children)rn.append(at(xi,G,1)),mt++;!Ke.children.length&&!O&&(Le(rn,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ne.length&&!ct&&(Le(qt,"p","項目がありません。").className="explorer-empty"),ot.append(Ye,qt),R.append(ot)}O&&!mt&&(Le(R,"p","該当する項目はありません。").className="explorer-empty"),R.scrollTop=v,b&&Array.from(R.querySelectorAll("[data-explorer-key]")).find(G=>G.dataset.explorerKey===b)?.focus({preventScroll:!0})}function $s(){!De&&rt==="structure"&&(rt="document"),q.disabled=!De,T.setAttribute("aria-selected",String(rt==="document")),q.setAttribute("aria-selected",String(rt==="structure")),T.tabIndex=rt==="document"?0:-1,q.tabIndex=rt==="structure"?0:-1,E.hidden=rt!=="document",P.hidden=rt!=="structure",rt==="structure"&&Ws(Kn);for(const[b,v]of p)v.hidden=b!==Kn}function Us(b){b==="structure"&&!De||(rt=b,$s(),Be())}T.onclick=()=>Us("document"),q.onclick=()=>Us("structure"),r.querySelector(".explorer-mode-tabs").addEventListener("keydown",b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;const v=b.key==="Home"||b.key==="ArrowLeft"?T:q;v.disabled||(b.preventDefault(),v.click(),v.focus({preventScroll:!0}))});function Eo(b){Ht=b,jt(),Be(),(b?r.querySelector(".shell-heading button"):I).focus({preventScroll:!0})}I.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),Eo(!Ht)},!0),r.querySelector(".shell-heading button").onclick=()=>Eo(!1),W.oninput=()=>{yn.clear(),St()},r.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&L.hidden&&(b.preventDefault(),b.stopPropagation(),Eo(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&R.contains(document.activeElement)){const v=Array.from(R.querySelectorAll("button")).filter($=>!$.disabled&&!$.closest("[hidden]")),N=v.indexOf(document.activeElement),O=v[N+(b.key==="ArrowDown"?1:-1)];O&&(b.preventDefault(),O.focus())}}),y.addEventListener("click",b=>{se!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),!(se==="concept"&&ve(U))&&(se==="concept"||se==="states"||se==="tests"&&Ee(Pe)?.capability.testSpecification)&&(gt.setOpen(!gt.isOpen()),jt(),Be(),Ze(!1)))},!0),S.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),jt(),Be(),Ze(!1),y.focus({preventScroll:!0})},j.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),jt(),Be(),Ze(!1),y.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const v=Array.from(Et).find(([,O])=>b.source===O.contentWindow);if(!v)return;if(b.data?.type==="alder-concept-rendered"){v[1].contentDocument&&(Gs(v[1].contentDocument),Ks(v[1].contentDocument));return}if(se!=="concept"||v[0]!==U)return;const N=Ie(U);if(b.data?.type==="alder-concept-clear-selection"){N&&qs(!0);return}if(b.data?.type==="alder-concept-subsystem"){if(!vi(U)?.regions.some(O=>O.id===b.data.id))return;pt.delete(U),bn.delete(U),gn.set(U,b.data.id),xo(),jt(),Be();return}if(!(!z.includes(b.data?.id)||N&&!N.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){Ot(pe(b.data.id));return}b.data.type==="alder-concept-select"&&(gn.delete(U),pt.set(U,b.data.id),(typeof b.data.viewId=="string"?vi(U)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?bn.set(U,b.data.viewId):bn.delete(U),innerWidth<=800&&(Ht=!1),xo(),jt(),Be())}});function Fs(){const b=getComputedStyle(document.documentElement);for(const v of Et.values()){const N=v.contentDocument?.documentElement;if(N){N.dataset.theme=document.documentElement.dataset.theme??"light";for(const O of["--bg","--panel","--fg","--line","--subtle","--select"])N.style.setProperty(O,b.getPropertyValue(O))}}}function jt(){!L.hidden&&se==="business"&&(Ht=!0),r.hidden=!Ht,I.disabled=!1,I.setAttribute("aria-controls","design-explorer"),I.setAttribute("aria-label","ナビゲーションを開閉"),I.setAttribute("aria-expanded",String(Ht)),$s();const b=gt.isReady?.()??!0,v=se==="concept"&&ve(U);S.hidden=se!=="concept"||v||!De||!b||!gt.isOpen();const N=!!Ee(Pe)?.capability.testSpecification;if(j.hidden=!(se==="states"||se==="tests"&&N)||!b||!gt.isOpen(),wo&&se!=="business"&&(wo.hidden=!0),se==="concept")y.disabled=v||!De||!b,v?(y.removeAttribute("aria-controls"),y.setAttribute("aria-label","構造の詳細は中央に表示")):(y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉")),y.setAttribute("aria-expanded",String(!S.hidden));else if(se==="business"){const J=t.business();y.disabled=!b||!J.key||!J.viewKey,y.setAttribute("aria-controls","formattedMarkdownDrawer"),y.setAttribute("aria-label","業務内容開閉")}else se==="states"||se==="tests"&&N?(y.disabled=!b,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!j.hidden))):(se==="tests"||se==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const O=o.querySelector("#document-actions");O&&(O.hidden=se!=="business");const $=o.querySelector("#document-actions-toggle");$&&se!=="business"&&($.hidden=!0),Fs(),Si()}function Si(){const b=o.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(Si);b.observe(o),b.observe(e.querySelector("header"))}window.addEventListener("resize",Si);function Vs(){sn(),Io=!0;try{const b=new URL(location.href).searchParams;if(se==="concept"&&b.get("view")==="concept"&&b.get("concept")===U&&!Ue.has(U)&&We(U,b.get("dataExample"))&&Ve.set("drawer-overview:"+U,S.querySelector(".concept-drawer-body").scrollTop),De||(Ct.clear(),Ue.clear(),on.clear(),it=[],U="overview",H.removeAttribute("src"),H.removeAttribute("srcdoc")),b.get("view")==="concept"){const v=De&&B.includes(b.get("concept")??"")?b.get("concept"):"landscape",N=b.get("dataExample");De&&Ie(v)&&b.get("dataView")==="overview"&&!We(v,N)?(Ct.add(v),Ue.delete(v)):(Ct.delete(v),De&&We(v,N)?(Ue.set(v,N),on.set(v,N)):Ue.delete(v)),Ot(v,!1)}else if(b.get("view")==="states")t.business().states?.some(v=>v.id===b.get("state"))?jn(b.get("state"),!1):Mn();else if(b.get("view")==="tests"){const v=hi(b.get("spec")??"@overview"),N=b.get("dataExample"),O=Ee(v);O&&N&&O.samples.some($=>$.id===N)?kt.set(v,N):O&&kt.delete(v),Dt(v,!1)}else if(b.get("view")==="empty")It("empty");else if(It("business"),t.business().key){const v=b.get("activity"),N=b.get("object"),O=t.business(),$=O.views?.find(J=>J.key===O.viewKey);v&&O.activities.some(J=>J.id===v)?$?.activity!==v&&t.openActivity(v):N&&O.objects?.some(J=>J.id===N)?$?.object!==N&&t.openObject(N):(wt=!1,(!$||$.activity!==void 0||$.object!==void 0)&&t.openOverview())}Nt(),St()}finally{Io=!1}}return window.addEventListener("popstate",Vs),{closeBusinessOverview:Ba,reopenBusinessOverview(){wt=!1},activateBusiness(){It("business")},businessActivated(){It("business"),Nt(),St(),Ze()},syncChrome:jt,appendActivityTestLinks(b,v){za(b,v),gi(b,Rs(v))},openRelatedChecks(b){Xe.add("tests"),Dt(b&&nt(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),v=b.concept,N=!!(Nn&&b.key!==Nn||So&&Gn&&b.key&&b.key!==Gn),O=X?.model!==v?.model||X?.business!==v?.business;if((N||O&&X)&&(rt="document",A.querySelector(".test-spec-page").replaceChildren(),j.querySelector(".spec-related-content").replaceChildren(),S.querySelector(".concept-related-content").replaceChildren(),wt=!1,it=[],st=[],vt=[],U="overview",yt="",Pe="@overview",kt.clear(),Ve.clear(),Ct.clear(),Ue.clear(),on.clear(),Va(),se!=="business"&&It("business"),N&&!So&&Ze(!1)),O){X=v,be=v?Rc(v):void 0,re=v?Bc(v):void 0,ae=v?qc(v):void 0,De=!!v,C=be?.tables??{},z=Object.keys(C),le=new Map((v?.model.concepts??[]).map(F=>[ue(F.id),F.id]));const $=be?.groups.map(F=>F.id)??[],J=new Set([...Rn,"subsystems",wn,...le.keys()]);if(ge=new Map($.map(F=>[F,J.has(F)||z.includes(F)?"group:"+F:F])),ye=new Map(z.map(F=>[F,J.has(F)||$.includes(F)?"concept:"+F:F])),fe=new Map([...ge].map(([F,ee])=>[ee,F])),Q=new Map([...ye].map(([F,ee])=>[ee,F])),B=[...Rn,wn,...le.keys(),...fe.keys(),...Q.keys()],Array.isArray(Ae?.expanded)&&Ae.expandedVersion!==4){Xe.add("subsystems"),Xe.add("concept-relations");for(const F of v?.model.subsystems??[])Xe.add("subsystem-"+F.id)}}if(Nn=b.key,st=st.filter($=>b.states?.some(J=>J.id===$)),se==="business"&&wt&&b.views?.find($=>$.key===b.viewKey)?.activity===void 0&&b.views?.find($=>$.key===b.viewKey)?.object===void 0&&Mn(),So&&b.key){if(Ta(),Gn===b.key){Array.isArray(Ae?.specs)&&(vt=[...new Set(Ae.specs.filter($=>typeof $=="string").map($=>hi($)))]);for(const[$,J]of Object.entries(Ae?.specExamples??{})){const F=Ee($);typeof J=="string"&&F?.capability.samples.some(ee=>ee.id===J)&&kt.set($,J)}}So=!1,Vs()}St(),Nt(),jt(),N&&Be()}}}class Fi{tabs=new WeakMap;router;constructor(t=Ri){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const r=JSON.stringify([o.map(d=>[d.id,d.width,d.height]),i.map(d=>[d.kind,d.from,d.to,d.label]),s]),l=this.tabs.get(t),u=!l||l.design!==n||l.structure!==r,c=new Set(o.filter(d=>{const p=l?.nodes.get(d.id);return!p||p.x!==d.x||p.y!==d.y}).map(d=>d.id)),a=new Set(o.map(d=>d.id)),f=u?new Array(i.length):l.routes.slice();if(i.forEach((d,p)=>{!u&&!c.has(d.from)&&!c.has(d.to)||(f[p]=a.has(d.from)&&a.has(d.to)?this.router({from:d.from,to:d.to,index:p,nodes:o,kind:d.kind,matrix:s?.[p],labels:s?.[p]?[]:[...f.flatMap((g,h)=>g&&h<p?[{id:String(h),x:g.label[0]-Math.max(30,i[h].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[h].label.length*12),height:18}]:[])],wires:s?.[p]?[]:f.flatMap((g,h)=>g&&h<p?[g.points]:[]),labelWidth:Math.max(30,d.label.length*12),labelHeight:18}):void 0)}),s){const d=[],p=new Map,g=f.map((h,m)=>m).sort((h,m)=>Number(s[h].returning)-Number(s[m].returning));for(const h of g){const m=f[h];if(!m)continue;const A=o.find(y=>y.id===i[h].from),j=Math.max(30,i[h].label.length*12),w=s[h].returning?[Math.max(...m.points.map(y=>y[0]))+8+j/2,m.points[0][1]]:[A.x+A.width*.125+8+j/2,nc(A.y+A.height,s[h].captionLane*zr)+9],L=$r(i[h],h,s[h]),I=p.get(L)??Di(w,j,18,o,d);(I[0]!==m.label[0]||I[1]!==m.label[1])&&(f[h]={...m,label:I}),p.has(L)||(p.set(L,I),d.push({id:String(h),x:I[0]-j/2,y:I[1]-9,width:j,height:18}))}}return this.tabs.set(t,{design:n,structure:r,nodes:new Map(o.map(d=>[d.id,{...d}])),routes:f}),f}}function Rd(e,t,n,o){const i=(f,d,p)=>(d[0]-f[0])*(p[1]-f[1])-(d[1]-f[1])*(p[0]-f[0]),s=i(e,t,n),r=i(e,t,o),l=i(n,o,e),u=i(n,o,t),c=1e-6;if(s*r<-c&&l*u<-c)return!0;if(Math.max(Math.abs(s),Math.abs(r),Math.abs(l),Math.abs(u))>c)return!1;const a=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[a],t[a]),Math.max(n[a],o[a]))-Math.max(Math.min(e[a],t[a]),Math.min(n[a],o[a]))>.1}function Dd(e,t,n,o,i=[]){const s=e.x+e.width,r=24,l=e.y+e.height,u=s-8-(2*(n.count-n.index)-1)*r,c=t.filter(j=>j.id!==e.id);let a;for(const j of[0,-24,24,-48,48,-72,72])for(const w of[0,16,32,64,128,256]){const L=[u+j,l],I=[L[0]+r,l];if(L[0]<e.x+8||I[0]>s-8)continue;const y=l+n.depth+w,W=Math.min(12,(I[0]-L[0])/2,(y-l)/2),R=[L];let E=`M${L}`;const P=S=>{E+=` L${S}`,R.push(S)},T=(S,Z)=>{const x=R.at(-1);E+=` Q${S} ${Z}`;for(let D=1;D<=4;D++){const te=D/4,X=1-te;R.push([X*X*x[0]+2*X*te*S[0]+te*te*Z[0],X*X*x[1]+2*X*te*S[1]+te*te*Z[1]])}};P([L[0],y-W]),T([L[0],y],[L[0]+W,y]),P([I[0]-W,y]),T([I[0],y],[I[0],y-W]),P(I);const q=oc(R,c,.3),H=i.filter(S=>R.slice(1).some((Z,x)=>S.slice(1).some((D,te)=>Rd(R[x],Z,S[te],D)))).length;if((!a||q<a.collisions||q===a.collisions&&H<a.wireCollisions)&&(a={path:E,points:R,collisions:q,wireCollisions:H,low:y,extra:w,shift:j}),q===0&&H===0)break}const{path:f,points:d,collisions:p,wireCollisions:g,low:h,extra:m,shift:A}=a;return{path:f,points:d,label:[Math.max(s+8,n.labelLeft)+o/2,h],bounds:{right:Math.max(...d.map(j=>j[0])),bottom:Math.max(...d.map(j=>j[1]))},collisions:p+g,rerouted:m>0||A!==0,fallback:p+g>0}}function Td(e,t=is()){const n="http://www.w3.org/2000/svg",o=(C,z={})=>{const B=document.createElementNS(n,C);for(const[fe,Q]of Object.entries(z))B.setAttribute(fe,Q);return B},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(C=>[C]),r=[...new Set(["@new",...e.states,...s.map(C=>C[0].to)])],l={nodes:r.map(C=>({id:C,type:"business",name:i[C]??C,scope:!0})),relations:s.map(([C])=>({kind:C.path==="exception"?"business-exception":"input",from:C.from,to:C.to,label:C.id+"："+C.activity+"："+C.condition}))},u=as(l,r),c=C=>{const z=Array.from(C);return Array.from({length:Math.ceil(z.length/28)},(B,fe)=>z.slice(fe*28,(fe+1)*28).join(""))},a=s.map(([C])=>({from:C.from,activity:C.activity,rows:[C],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[C,z]of a.entries()){const B=z.rows[0],fe=e.transitions.filter(ue=>ue.from===B.from&&(ue.activityId??ue.activity)===(B.activityId??B.activity)&&ue.path===B.path&&(B.path!=="exception"||(ue.exception??"例外名未定義")===(B.exception??"例外名未定義"))),Q=fe.map(ue=>(ue.conditionLabel??ue.condition).trim().replace(/\s+/g," ")),ge=new Set(Q).size===fe.length?B.conditionLabel??B.condition:B.condition,le=[B.path==="exception"?"例外："+(B.exception??"例外名未定義"):"",...fe.length>1||B.path==="normal"&&B.conditionLabel?[ge]:[]].filter(Boolean).join("：");z.lines=c(z.activity+(le?"（"+le+"）":"")),z.lineRows=z.lines.map(()=>z.rows),z.width=Math.max(...z.lines.map(ue=>Array.from(ue).length*14)),z.height=z.lines.length*18,u.wires[C].returning||(z.offset=f.has(z.from)?f.get(z.from)+8:0,f.set(z.from,z.offset+z.height))}const d=new Map;s.forEach(([C],z)=>{if(C.from===C.to){const B=d.get(C.from)??[];B.push(z),d.set(C.from,B)}});const p=new Map,g=new Map;for(const[C,z]of d){let B=0;for(const Q of[...z].reverse())p.set(Q,{leader:z[0],index:0,count:1,depth:0,offset:B}),B+=a[Q].height+8;const fe=24+Math.max(0,B-8)+8;g.set(C,fe);for(const Q of z)p.get(Q).depth=fe}const h=C=>44,m=r.slice().sort((C,z)=>u.positions[C][1]-u.positions[z][1]);let A=Math.max(40,...a.map((C,z)=>u.wires[z].returning&&C.from===m[0]?16+C.height/2-44*(u.wires[z].fromPort??.5):40));const j=new Map;for(const C of m){const z=h(),B=(f.get(C)??0)+(g.get(C)??0);j.set(C,A),A+=ic(z,B)}const w=r.map(C=>({id:C,x:t.positions.get(C)?.[0]??u.positions[C][0],y:t.positions.get(C)?.[1]??j.get(C),width:Math.max(104,Array.from(i[C]??C).length*14+32),height:h()})),L=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),I=o("title");I.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(r.includes("@none")?"作成なしはこの操作の処理結果。":"")+(r.includes("@unknown")?"未決は設計課題。":""),L.append(I),L.append(ss("state-transition-"));const y=new Map,W=[],R=[];let E=t.selected;const P=C=>{E=C,t.selected=C;const z=Uo(e.transitions,E);for(const[Q,ge]of y)ge.setAttribute("class","node graph-shape state-shape"+z.nodeClasses(Q)),ge.setAttribute("aria-pressed",String(Q===E));W.forEach(({element:Q,rows:ge})=>{const ye=ge[0].from===ge[0].to;Q.setAttribute("class","edge"+(ye?" state-self-loop":ge[0].path==="exception"?" exception":"")+z.labelClasses(ge)),Q.setAttribute("marker-end","url(#state-transition-"+(ge.some(z.related)?"related-arrow":"arrow")+")")});for(const Q of R)Q.element.setAttribute("class","state-caption-line"+z.labelClasses(Q.rows));L.querySelectorAll("[data-exception-paint]").forEach(Q=>Q.remove());const B=Array.from(L.children).find(Q=>Q.matches(".state-diagram-edge-label,[data-state]"))??null,fe=[...W].sort((Q,ge)=>Number(Q.rows.some(z.related))-Number(ge.rows.some(z.related)));for(const{element:Q}of fe)if(L.insertBefore(Q,B),Q.classList.contains("exception")||Q.classList.contains("state-self-loop")){const ge=L.children.length;rs(L,Q,{path:Q.getAttribute("d")},{"data-transitions":Q.getAttribute("data-transitions")});for(const ye of Array.from(L.children).slice(ge))L.insertBefore(ye,B)}L.querySelectorAll(".state-diagram-edge-label").forEach(Q=>L.append(Q))};L.addEventListener("click",C=>{C.target===L&&P()}),L.addEventListener("keydown",C=>{C.key==="Escape"&&(C.preventDefault(),P())});const T=u.wires.map((C,z)=>({...C,captionLane:(a[z].offset+(g.get(a[z].from)??0))/zr})),q=l.relations.map((C,z)=>({...C,label:String(z).padEnd(Math.ceil(a[z].width/12),"x")})),H=[...p].map(([C,z])=>{const B=w.find(Q=>Q.id===s[C][0].from),fe=a[C];return{x:B.x+B.width+8,y:B.y+B.height+24+z.offset,width:fe.width,height:fe.height}});let S=new Fi().update({},e,w,q,T);for(let C=0;C<=H.length;C++){let z=!1,B=0;if(S.forEach((fe,Q)=>{if(!fe||p.has(Q)||!T[Q].returning)return;let ge=0;for(const ye of H)for(let le=1;le<fe.points.length;le++){const ue=fe.points[le-1],ve=fe.points[le];if(Math.abs(ue[0]-ve[0])>1e-7||Math.abs(ue[1]-ve[1])<2)continue;const ze=ue[0];if(ze<ye.x-4||ze>ye.x+ye.width+4||Math.max(ue[1],ve[1])<ye.y-4||Math.min(ue[1],ve[1])>ye.y+ye.height+4)continue;const pe=ye.x+ye.width+12-ze;pe>0&&(ge=Math.max(ge,pe))}ge&&(T[Q]={...T[Q],returnLane:(T[Q].returnLane??0)+Math.ceil(ge/16)+B++},z=!0)}),!z)break;S=new Fi().update({},e,w,q,T)}const Z=S.flatMap((C,z)=>C&&!p.has(z)?[C.points]:[]),x=new Map,D=S.map((C,z)=>{const B=p.get(z);if(!B)return C;const fe=s[z][0].from,Q=w.find(pe=>pe.id===fe),ge=S.flatMap((pe,Ie)=>pe&&!p.has(Ie)?[pe.points]:[]),ye=Math.max(30,q[z].label.length*12),le=a[z];let ue=x.get(B.leader);ue||(ue=Dd(Q,w,{...B,labelLeft:Q.x+Q.width+8},ye,Z),x.set(B.leader,ue),Z.push(ue.points));const ve=ge.flatMap((pe,Ie)=>pe.slice(1).map((bt,We)=>({id:`${Ie}:${We}`,x:Math.min(pe[We][0],bt[0])-2,y:Math.min(pe[We][1],bt[1])-2,width:Math.abs(pe[We][0]-bt[0])+4,height:Math.abs(pe[We][1]-bt[1])+4}))),ze=Di([Q.x+Q.width+8+le.width/2,Q.y+Q.height+24+B.offset+le.height/2],le.width,le.height,[...w,...ve]);return{...ue,label:[ze[0]-le.width/2+ye/2,ze[1]]}}),te=new Array(s.length),X=[],be=s.map((C,z)=>z).sort((C,z)=>Number(T[C].returning)-Number(T[z].returning));for(const C of be){const z=D[C],B=a[C],fe=Math.max(30,q[C].label.length*12);let Q=[z.label[0]-fe/2+B.width/2,z.label[1]+(T[C].returning?0:B.height/2-9)];const ge=w.find(ue=>ue.id===s[C][0].from),ye=w.find(ue=>ue.id===s[C][0].to);if(!p.has(C)&&T[C].returning&&ye&&ye.y>ge.y){const ue=z.points.slice(1).map((ve,ze)=>[z.points[ze],ve]).filter(([ve,ze])=>Math.abs(ve[0]-ze[0])<.01&&ze[1]-ve[1]>24).sort(([ve,ze],[pe,Ie])=>Ie[1]-pe[1]-(ze[1]-ve[1]))[0];if(ue){const[ve,ze]=ue;Q=[ve[0]+8+B.width/2,ve[1]+Math.min(24+B.height/2,(ze[1]-ve[1])/2)]}}const le=Di(Q,B.width,B.height,w,X);te[C]=le,X.push({id:String(C),x:le[0]-B.width/2,y:le[1]-B.height/2,width:B.width,height:B.height})}let re=Math.max(...w.map(C=>C.x+C.width))+40,ae=Math.max(...w.map(C=>C.y+C.height))+40;s.forEach((C,z)=>{const B=p.get(z);if(B&&B.leader!==z)return;const fe=B?s.flatMap((ue,ve)=>p.get(ve)?.leader===z?ue:[]):C,Q=fe[0],ge=D[z],ye=o("path",{d:ge.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":fe.map(ue=>ue.id).join(" ")});(B||Q.path==="exception")&&ye.setAttribute("stroke-dasharray","6 5");const le=o("title");le.textContent=fe.map(ue=>`${ue.id} ${ue.activity} / ${ue.path==="normal"?"通常":"例外："+(ue.exception??"例外名未定義")}：${ue.condition}`).join(" / "),ye.append(le),L.append(ye),W.push({element:ye,rows:fe}),re=Math.max(re,ge.bounds.right+40),ae=Math.max(ae,ge.bounds.bottom+40)});for(const[C,z]of a.entries()){const B=te[C],fe=B[0]-z.width/2,Q=B[1]-z.height/2+14;L.append(o("rect",{x:String(fe),y:String(Q-14),width:String(z.width),height:String(z.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const ge=o("text",{x:String(fe),y:String(Q),class:"state-diagram-edge-label","data-activity":z.activity,"data-transition-id":z.rows[0].id,"aria-label":z.lines.join("")});z.lines.forEach((ye,le)=>{const ue=o("tspan",{x:String(fe),dy:le?"18":"0","font-size":"14","font-weight":"600"});ue.textContent=ye,ue.setAttribute("data-transitions",z.lineRows[le].map(ve=>ve.id).join(" ")),R.push({element:ue,rows:z.lineRows[le]}),ge.append(ue)}),L.append(ge),re=Math.max(re,fe+z.width+24),ae=Math.max(ae,Q+z.height+24)}for(const C of w){const z=C.id.startsWith("@"),B=o("g",{role:"button",tabindex:"0","aria-label":i[C.id]??C.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":C.id,"data-node":C.id});B.append(qr(document,C,z)),B.append(o("rect",{x:String(C.x),y:String(C.y),width:String(C.width),height:String(C.height),rx:z?"20":"8",class:z?"state-diagram-node state-note":"state-diagram-node"}));const fe=o("text",{x:String(C.x+C.width/2),y:String(C.y+C.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(fe.textContent=i[C.id]??C.id,B.append(fe),z&&C.id!=="@new"){const Q=o("text",{x:String(C.x+C.width/2),y:String(C.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Q.textContent=C.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",B.append(Q)}B.addEventListener("click",()=>P(C.id)),B.addEventListener("keydown",Q=>{(Q.key==="Enter"||Q.key===" ")&&(Q.preventDefault(),P(C.id))}),y.set(C.id,B),L.append(B)}return P(t.selected),L.setAttribute("viewBox",`0 0 ${re} ${ae}`),L.style.minWidth=`${re}px`,L}const cr=new WeakMap;function Pd(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(h=>h.id===t&&h.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(h,m,A=i)=>{const j=document.createElement(h);return j.textContent=m,A.append(j),j};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const r=o.model;for(const h of r.transitions){if(!e.graph.nodes.some(m=>m.id===h.activity&&m.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(h.exceptionId){const m=e.model?.business.exceptions?.find(A=>A.id===h.exceptionId);if(!m||m.activityId!==h.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const l=cr.get(e)??new Map;cr.set(e,l);const u=l.get(t)??is();l.set(t,u);const c={...r,transitions:r.transitions.map(h=>({...h,activityId:h.activity,activity:e.graph.nodes.find(m=>m.id===h.activity)?.name??h.activity}))};i.append(Pr(document,h=>Td(c,h),u));const a=h=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[h]??h,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},d=document.createElement("details");s("summary",`操作の詳細（${r.transitions.length}）`,d);const p=document.createElement("ol");d.append(p),i.append(d);for(const h of r.transitions){const m=document.createElement("li");m.dataset.transition=h.id,s("h3",`${h.id} · ${a(h.from)} → ${a(h.to)}`,m),h.path==="exception"&&s("p","例外名："+(h.exception??"未定義"),m),s("p",`${f[h.effect]} · ${h.path==="normal"?"正常":"例外"}`,m);const A=e.graph.nodes.find(j=>j.id===h.activity&&j.type==="business");if(A){const j=document.createElement("button");j.type="button",j.textContent=A.name,j.onclick=()=>n(A.id),m.append(j)}else s("p","要確認：根拠Activityが見つかりません — "+h.activity,m);s("p","条件："+h.condition,m),s("p",h.note,m),s("p","根拠："+h.evidence,m),p.append(m)}r.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",r.source,g),i.append(g),i}const dr=64,qd=96,Wd=260,lr=40,zd=4;function $d(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:r,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}=sc(e,t),a=r.map(I=>I.length),f=o.map(()=>0),d=o.flatMap((I,y)=>a[y]===0?[y]:[]);for(let I=0;I<d.length;I++)for(const y of s[d[I]])f[y]=Math.max(f[y],f[d[I]]+1),--a[y]===0&&d.push(y);const p=Array.from({length:f.reduce((I,y)=>Math.max(I,y),0)+1},()=>[]);o.forEach((I,y)=>p[f[y]].push(y));const g=o.map(()=>0),h=I=>I.forEach((y,W)=>g[y]=W);p.forEach(h);for(let I=0;I<zd;I++){const y=I%2?[...p].reverse():p;for(const W of y){const R=new Map(W.map(E=>{const P=I%2?s[E]:r[E];return[E,P.length?P.reduce((T,q)=>T+g[q],0)/P.length:g[E]]}));W.sort((E,P)=>R.get(E)-R.get(P)||E-P),h(W)}}const m=p[0].filter(I=>o[I].type==="object"&&i[I].length===0&&s[I].length>0);if(n&&m.length>1){const I=new Set(m),y=p[0].filter(W=>!I.has(W));p.splice(0,1,...m.map((W,R)=>R===0?[...y,W]:[W]))}const A=Object.create(null),j=o.map(()=>0),w=[],L=Math.ceil(Wd/dr)-1;for(let I=0;I<p.length;I++){const y=new Map;for(const E of w)for(const P of E)y.set(P,P+1);const W=E=>{let P=E;for(;y.has(P);)P=y.get(P);let T=E;for(;y.has(T);){const q=y.get(T);y.set(T,P),T=q}return P},R=[];for(const E of p[I]){let P=I;for(const q of r[E])P=Math.max(P,j[q]+1);const T=W(P);j[E]=T,y.set(T,T+1),R.push(T),A[o[E].id]=[lr+I*dr,lr+T*qd]}w.push(R),w.length>L&&w.shift()}return{positions:A,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}}function Ud(e,t){return Ur(e)?as(e,t).positions:$d(e,t).positions}const ur=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function Qr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>ur(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=ur(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function ea(e){const t=Qr(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,r])=>[o.get(s),r])))}}function ta(e){const t=ea(e);return t.restore(Ud(t.graph,t.order))}function Fd(e){const t=ea(e),n=as(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function na(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Vd(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(r=>r.handle!==void 0):s.tabs.some(r=>r.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,r){if(Object.is(s,r))return!0;if(!s||!r||typeof s!="object"||typeof r!="object"||o.has(s)||o.has(r))return!1;const l=p=>Array.isArray(p)||Object.getPrototypeOf(p)===null||Object.getPrototypeOf(p)?.constructor?.name==="Object";if(!l(s)||!l(r)||Array.isArray(s)!==Array.isArray(r)||Array.isArray(s)&&s.length!==r.length)return!1;o.add(s),o.add(r);const u=s,c=r,a=Object.keys(u),f=Object.keys(c),d=a.length===f.length&&a.every(p=>Object.hasOwn(c,p)&&i(u[p],c[p]));return o.delete(s),o.delete(r),d}return i(e,t)}function Vn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,r]of Object.entries(e.positions))n.has(s)&&(o[s]=[...r]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=ta(t),r=Object.values(o);for(const l of i){const u=[...s[l.id]];for(;r.some(c=>Math.abs(c[0]-u[0])<280&&Math.abs(c[1]-u[1])<88);)u[1]+=180;o[l.id]=u,r.push(u)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function oa(){return new Promise((e,t)=>{const n=indexedDB.open(na(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class us extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Bo;function ia(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Bd(e){const t=Bo;if(t===void 0)throw Error("Session has not been loaded");const n=await oa();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),r=s.objectStore("session"),l=r.get("generation"),u=r.get("current"),c=r.get("readonly-legacy");let a,f;c.onsuccess=()=>{try{const d=ia(l.result);if(Vd(u.result,e)){f=d;return}if(d!==t)throw new us;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");c.result===void 0&&Gd(u.result)&&r.put(u.result,"readonly-legacy"),r.put(e,"current"),r.put(f,"generation")}catch(d){a=d,s.abort()}},s.oncomplete=()=>{Bo=f,o()},s.onerror=()=>i(a??s.error??Error("Session save failed")),s.onabort=()=>i(a??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Hd(){Bo=void 0;const e=await oa();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),r=i.get("generation");o.oncomplete=()=>{try{Bo=ia(r.result),t(s.result)}catch(l){n(l)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function Gd(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const fr=new WeakMap;function Kd(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(a=>a.id===t&&a.type==="business"))throw Error("Unknown Activity: "+t);let o=fr.get(e);o||(o=new Map,fr.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),r=new Set(e.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),l=e.graph.relations.filter(a=>a.kind==="input"&&a.to===t&&s.has(a.from)||a.kind==="output"&&a.from===t&&s.has(a.to)||a.kind==="business-exception"&&(a.from===t&&r.has(a.to)||a.to===t&&r.has(a.from))),u=new Set([t,...l.flatMap(a=>[a.from,a.to])]),c={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(a=>u.has(a.id)),relations:l},activityOrder:(e.activityOrder??e.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)).filter(a=>u.has(a))};return o.set(t,c),c}const pr=new WeakMap;function Jd(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=pr.get(e);o||(o=new Map,pr.set(e,o));const i=t,s=o.get(i);if(s)return s;const r=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),l=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),u=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&l.has(f.to)||f.kind==="output"&&f.to===t&&l.has(f.from)||f.kind==="object-exception"&&(f.from===t&&r.has(f.to)||f.to===t&&r.has(f.from))),c=new Set([t,...u.flatMap(f=>[f.from,f.to])]),a={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>c.has(f.id)),relations:u},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>c.has(f))};return o.set(i,a),a}const sa=new WeakMap;function Yt(e){return sa.get(e)}const ra=["design","checks","source","draft","edited","handle"];function _d(e){return{key:e.key,name:e.name,...Object.fromEntries(ra.map(t=>[t,e[t]]))}}function zt(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:r,viewInset:l,canvasOrigin:u,scroll:c,zoom:a}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:r,viewInset:l,canvasOrigin:u,scroll:c,zoom:a,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Qo(e,t){const n=t;sa.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of ra)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function Ho(e){return e.activity}function Go(e){return e.object}function oo(e){return e.activity??e.object}function ei(e){return e.object===void 0?Kd(e.design,e.activity):Jd(e.design,e.object)}function ti(e){const t=ei(e),n=Vn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function $t(e,t=[],n,o){const i=n??(e.tabs[0]?_d(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?zt(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(d=>{const p=Qo(i,d);return Object.assign(d,zt(ti(p))),p}):[],{dark:r,drawer:l,width:u,preferWrite:c,nodeDrawer:a,sampleLayout:f}=e;return{dark:r,drawer:l,width:u,preferWrite:c,nodeDrawer:a,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(d=>d.source?.kind==="url").map(d=>({url:d.source.url,name:d.name}))].filter((d,p,g)=>g.findIndex(h=>h.url===d.url)===p),legacyViews:e.legacyViews,active:s.some(d=>d.key===e.active)?e.active:s[0]?.key}}function fs(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(zt),recovery:n}}function jo(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function Xd(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!nl(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const a of i.views)jo(a)}const{format:s,views:r,document:l,recovery:u,...c}=e;for(const a of r)jo(a);for(const a of u)jo(a);if(!!l!=!!r.length||new Set(r.map(a=>a.key)).size!==r.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(d=>d.group!==void 0&&typeof d.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(d=>d.group===void 0).length!==1))throw Error("Invalid legacy views");const a=o.views[0],f=a?{...a}:void 0;return f&&delete f.group,$t({...c,tabs:[],active:f?.key,legacyViews:{documentKey:l?.key,views:structuredClone(o.views),active:o.active}},u,l,f?[f]:[])}if(r.length&&(r[0].activity!==void 0||r[0].object!==void 0||r.filter(a=>a.activity===void 0&&a.object===void 0).length!==1)||new Set(r.filter(a=>a.activity!==void 0).map(a=>a.activity)).size!==r.filter(a=>a.activity!==void 0).length||new Set(r.filter(a=>a.object!==void 0).map(a=>a.object)).size!==r.filter(a=>a.object!==void 0).length)throw Error("Invalid workspace views");if(l&&r.some(a=>a.activity!==void 0&&!l.design.graph.nodes.some(f=>f.type==="business"&&f.id===a.activity)))throw Error("Unknown saved Activity");if(l&&r.some(a=>a.object!==void 0&&!l.design.graph.nodes.some(f=>f.type==="object"&&f.id===a.object)))throw Error("Unknown saved Object");return $t({...c,tabs:[]},u,l,r)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)jo(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return $t({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Zd(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return $t({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function Yd(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),r=new Set(t.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),l=e.tabs.filter(u=>(u.activity===void 0||s.has(u.activity))&&(u.object===void 0||r.has(u.object))).map(zt);return $t(e,e.recovery,i,l)}function Qd(e,t){const n=e.tabs.find(i=>Ho(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=Qo(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,zt(ti(o))),e.tabs.push(o),e.active=o.key,o}function el(e,t){const n=e.tabs.find(i=>Go(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=Qo(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,zt(ti(o))),e.tabs.push(o),e.active=o.key,o}function tl(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return zt(i?ti(Qo(e.document,{...zt(o),...zt(i)})):o)});return $t({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function nl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function ni(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=l=>l instanceof HTMLButtonElement&&l.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(l=>!l.hidden&&!o(l));for(const l of Array.from(t.querySelectorAll("button,a[href]")))l.setAttribute("role","menuitem");const s=(l=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),l&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},r=(l=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const u=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),c=u.getBoundingClientRect();t.style.left=Math.max(8,Math.min(c.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(c.bottom+4,innerHeight-t.offsetHeight-8))+"px",(l?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?r():s(!0),e.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),r(l.key==="ArrowUp"))},t.addEventListener("keydown",l=>{const u=l,c=i(),a=c.indexOf(document.activeElement);let f;u.key==="ArrowDown"&&(f=(a+1)%c.length),u.key==="ArrowUp"&&(f=(a+c.length-1)%c.length),u.key==="Home"&&(f=0),u.key==="End"&&(f=c.length-1),f!==void 0&&(u.preventDefault(),c[f]?.focus())}),t.addEventListener("click",l=>{const u=l.target.closest("button,a[href]");!t.hidden&&u&&!o(u)&&s(!0)},!0),document.addEventListener("keydown",l=>{!t.hidden&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{!t.hidden&&!t.contains(l.target)&&!e.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{!t.hidden&&!t.contains(l.target)&&l.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const ol=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),il={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function sl(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=w=>i.slice(w.line+1,o.find(L=>L.line>w.line&&L.level<=w.level)?.line??i.length).join(`
`).trim(),r=new Map(o.filter(w=>w.level===3&&t.some(L=>L.title===w.title)).map(w=>[w.title,w])),l=w=>{const L=t.find(I=>I.title===w.title);return L?"legacy-check:"+L.id:w.level===1?"legacy-check-document":"legacy-heading:"+w.line},u=new Map,c=(w,L)=>{u.has(w)?u.get(w)!==L&&u.set(w,void 0):u.set(w,L)};for(const w of o){const L=l(w);c(ol(w.title),L);const I=t.find(y=>y.title===w.title);I&&c(I.id.toLowerCase(),L)}for(const[w,L]of i.entries()){const I=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(L);if(I){const y=o.find(W=>W.line>w);y&&c(I[1].toLowerCase(),l(y))}}const a=w=>{w=w.replace(/<a\s+id=[^>]+><\/a>/g,"");const L=[];let I=0;for(const y of w.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){y.index>I&&L.push({kind:"markdown",value:w.slice(I,y.index)});let W=y[2].slice(1);try{W=decodeURIComponent(W)}catch{}const R=y[2].startsWith("#")?u.get(W.toLowerCase()):void 0;L.push(R?{kind:"reference",targetId:R,label:y[1]}:{kind:"link",uri:y[2],label:y[1]}),I=y.index+y[0].length}return I<w.length&&L.push({kind:"markdown",value:w.slice(I)}),L},f=[],d=[],p=[],g=new Map;for(const w of o.filter(L=>L.level===2)){if(w.title==="業務一覧")continue;const L=l(w),I=o.find(y=>y.line>w.line)?.line??i.length;f.push({id:L,activityId:Object.hasOwn(n,w.title)?w.title:null,title:w.title,preamble:a(i.slice(w.line+1,I).join(`
`).trim())}),g.set(w.title,L)}const h="legacy-unassigned",m=w=>{const L=o.filter(I=>I.line<w.line&&I.level===2).at(-1);return L?g.get(L.title):void 0},A=t.map(w=>{const L=r.get(w.title),I=m(L)??h,y=Object.create(null),W=[];let R={name:"補足",value:""},E="";for(const T of w.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const q=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(T);q&&(E?q[1][0]===E[0]&&q[1].length>=E.length&&!q[2].trim()&&(E=""):E=q[1]);const H=E?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(T);H?(R.value.trim()&&W.push(R),R={name:H[1],value:H[2]}):R.value+=`
`+T}R.value.trim()&&W.push(R);let P="";for(const T of W)if(T.name==="人間レビュー状態"){P=T.value.split(`
`)[0].trim();const q=T.value.split(`
`).slice(1).join(`
`).trim();q&&(y.補足=[...y.補足??[],...a(q)])}else{const q=il[T.name]??T.name;y[q]=[...y[q]??[],...a(T.value.trim())]}return{id:"legacy-check:"+w.id,checkId:w.id,title:w.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:P,sectionId:I,detailSummary:[...w.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(T=>T[1]).join(`
`),fields:y}});A.some(w=>w.sectionId===h)&&f.push({id:h,activityId:null,title:"未割当",preamble:[]});for(const w of o.filter(L=>L.level===3&&!r.has(L.title))){const L=m(w);L?d.push({id:l(w),sectionId:L,title:w.title,blocks:[{kind:"prose",content:a(s(w))}]}):p.push({id:l(w),title:w.title,content:a(s(w))})}const j=o.find(w=>w.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(w=>w.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:a(i.slice(/^# /.test(i[0])?1:0,j).join(`
`)),sections:f,items:A,index:Object.entries(n).map(([w,L])=>{const I=i.find(y=>y.startsWith("|")&&y.includes("["+w+"]"))?.split("|").slice(1,-1)??[];return{activityId:w,purpose:I[1]?.trim()??"",connections:I[2]?.trim()??"",checkIds:L.map(y=>"legacy-check:"+y)}}),guarantees:d,examples:[],notes:p}}function Ci(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[r,...l]=s;return!r||!l.length||!["main","master"].includes(r)&&!/^[a-f0-9]{40}$/i.test(r)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${l.join("/")}`,ref:r}}catch{return}}function Vi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function rl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,d)=>{const p=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(p){i?p[1][0]===i[0]&&p[1].length>=i.length&&!p[2].trim()&&(i=""):i=p[1];return}if(!i){t.add(d);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:d,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const r=new Set,l=s.map(f=>{const d=o.find(h=>h.line>f.line&&h.level<=3)?.line??n.length,p=f.title.split(/\s/)[0];if(r.has(p))throw Error("Check IDが重複しています: "+p);r.add(p);const g=n.slice(f.line+1,d).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const h of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+h+"[：:]\\s*\\S","m").test(g))throw Error(p+" の"+h+"が見つかりません。");return{id:p,title:f.title,body:g,activities:[]}}),u=Object.create(null);let c=!1;for(const[f,d]of n.entries()){if(!t.has(f)||(/^## /.test(d)&&(c=/^## 業務一覧\s*$/.test(d)),!c||!/^\|/.test(d)))continue;const p=d.split("|").slice(1,-1);if(p.length!==4)continue;const g=Vi(p[0])[0]?.label;if(!g)continue;if(Object.hasOwn(u,g))throw Error("業務一覧のActivityが重複しています: "+g);const h=Vi(p[3]);if(h.some(A=>A.url.toLowerCase()!=="#"+A.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const m=h.map(A=>A.label);if(!m.length||m.some(A=>!r.has(A)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);u[g]=[...new Set(m)];for(const A of l)m.includes(A.id)&&A.activities.push(g)}if(!Object.keys(u).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const a=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,a).join(`
`),items:l,index:u,model:sl(e,l,u,o)}}function io(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function so(e,t){const n=new Set(t.design.graph.nodes.filter(c=>c.type==="business").map(c=>c.name)),o=Object.keys(e.index).filter(c=>!n.has(c)),i=Object.keys(e.index).filter(c=>n.has(c)),s=(c,a)=>({state:c,reason:a,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const r=e.intro.split(`
`).filter(c=>/原典|^[-*] Source[：:]|Business Design/i.test(c)).join(`
`),l=Vi(r).map(c=>Ci(c.url)).filter(c=>c!==void 0),u=t.source?.kind==="url"?Ci(t.source.url):t.source?.kind==="sample"?Ci("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return u&&l.length&&l.some(c=>c.document!==u.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!u||!l.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||l.some(c=>c.ref!==u.ref)||!/^[a-f0-9]{40}$/i.test(u.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const mr=new WeakMap;function $n(e){let t=mr.get(e);return t||(t=rl(e.markdown),mr.set(e,t)),t}const Oi=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Mo(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function al(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function cl(e){if(!e.checks)return[];const t=$n(e.checks),n=so(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===io(e)?[t.model]:[]}function dl(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&Mo(i,"関連Checkを読み込み・保存しています…"),t.error){const l=document.createElement("p");l.className="check-warning",l.setAttribute("role","alert"),l.textContent=t.error,i.append(l)}let s,r=!1;if(e.checks){s=$n(e.checks);const l=so(s,e);if(r=l.state==="matched"||l.state==="unverified"&&e.checks.confirmedFor===io(e),!r&&(Mo(i,"現在のBDとの対応を再確認してください。"+l.reason),l.state==="unverified")){const u=Oi("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));u.disabled=n.disabled||t.busy===!0,i.append(u)}}if(t.candidate){const l=t.candidate,u=$n(l),c=so(u,e),a=document.createElement("section");a.className="check-candidate",a.id="check-candidate",Mo(a,"一致未確認: "+l.name+" — "+c.reason),Mo(a,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),d=document.createElement("summary");d.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(d,al(u.markdown)),a.append(f);const p=Oi("対応を確認して表示する",()=>n.confirm(l));p.id="check-confirm",p.disabled=c.state==="mismatch"||n.disabled||t.busy===!0;const g=Oi("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,a.append(p,g),i.append(a)}return i.childNodes.length&&o.append(i),o}function ll(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const a of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=a.getAttribute("aria-label"),a.append(f)}let s=!1;const r=(a=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),a&&!o.hidden&&o.focus({preventScroll:!0})},l=()=>i.filter(a=>!a.hidden&&!a.disabled),u=()=>{const a=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const p=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+p,h=i.some(m=>!m.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=h?"menu":"inline",o.hidden=!h,(!h||a!==e.dataset.actionsMode)&&(r(),h&&n.contains(f)?o.focus({preventScroll:!0}):!h&&f===o&&l()[0]?.focus({preventScroll:!0}))},c=(a=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=l();(a?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?r(!0):c(),o.onkeydown=a=>{(a.key==="ArrowDown"||a.key==="ArrowUp")&&(a.preventDefault(),c(a.key==="ArrowUp"))},n.addEventListener("keydown",a=>{if(!s)return;const f=l(),d=f.indexOf(document.activeElement);let p;a.key==="ArrowDown"&&(p=(d+1)%f.length),a.key==="ArrowUp"&&(p=(d+f.length-1)%f.length),a.key==="Home"&&(p=0),a.key==="End"&&(p=f.length-1),p!==void 0&&(a.preventDefault(),f[p]?.focus())}),document.addEventListener("keydown",a=>{s&&a.key==="Escape"&&(a.preventDefault(),a.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",a=>{s&&!n.contains(a.target)&&!o.contains(a.target)&&r()}),document.addEventListener("focusin",a=>{s&&!n.contains(a.target)&&a.target!==o&&r()}),n.addEventListener("click",a=>{const f=a.target.closest("button");s&&f&&!f.disabled&&r(!0)},!0),r(),u(),window.addEventListener("resize",u),typeof ResizeObserver<"u"&&new ResizeObserver(u).observe(e),new MutationObserver(u).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(u),document.fonts?.addEventListener("loadingdone",u),{update:u,close:r}}function ul(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,r=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),l=n.reduce((c,a)=>c+a.getBoundingClientRect().width,0)+s*n.length+r,u=l+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&u>e.clientWidth),e.classList.toggle("header-icons-only",l>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const Xn="http://www.w3.org/2000/svg",fl="http://www.w3.org/1999/xhtml",Lo=24,hr=8192,pl=16e6,ml=8e6,hl=4e3,bl=1e6,Bi="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function gl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(a=>![a.x,a.y,a.width,a.height].every(Number.isFinite)||a.width<0||a.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const a of e)t=Math.min(t,a.x),n=Math.min(n,a.y),o=Math.max(o,a.x+a.width),i=Math.max(i,a.y+a.height);const s=Math.floor(t)-Lo,r=Math.floor(n)-Lo,l=Math.ceil(o)-s+Lo,u=Math.ceil(i)-r+Lo,c=Math.min(2,hr/l,hr/u,Math.sqrt(pl/(l*u)));if(c<1)throw Error(Bi);return{bounds:{x:s,y:r,width:l,height:u},width:Math.floor(l*c),height:Math.floor(u*c),scale:c}}const yl="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function br(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const r=o[s],l=getComputedStyle(i);r.removeAttribute("style");for(const u of yl){const c=l.getPropertyValue(u);c&&!/url\s*\(/i.test(c)&&r.style.setProperty(u,c)}for(const u of Array.from(r.attributes))(u.name.startsWith("data-")||u.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(u.name))&&r.removeAttribute(u.name)}),t}function vl(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>hl||(e.textContent?.length??0)+(t.textContent?.length??0)>bl)throw Error(Bi);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(h=>({x:parseFloat(h.style.left),y:parseFloat(h.style.top),width:h.offsetWidth,height:h.offsetHeight}));for(const h of o)for(const m of Array.from(h.querySelectorAll(".finding-badges")))i.push({x:parseFloat(h.style.left)+h.clientLeft+m.offsetLeft,y:parseFloat(h.style.top)+h.clientTop+m.offsetTop,width:m.offsetWidth,height:m.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,r=Array.from(t.children).map(br),l=r.filter(h=>h.matches(".edge,.edge-label"));if(l.length){const h=s.createElementNS(Xn,"svg");h.setAttribute("viewBox","0 0 1 1"),h.setAttribute("width","1"),h.setAttribute("height","1"),h.setAttribute("aria-hidden","true"),h.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",h.append(...l),s.body.append(h);try{for(const m of l){const A=m.getBBox();i.push({x:A.x-12,y:A.y-12,width:A.width+24,height:A.height+24})}}finally{h.remove()}}const u=gl(i),c=s.createElementNS(Xn,"svg");c.setAttribute("width",String(u.width)),c.setAttribute("height",String(u.height)),c.setAttribute("viewBox",`0 0 ${u.bounds.width} ${u.bounds.height}`);const a=s.createElementNS(Xn,"rect");a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("fill",n),c.append(a);const f=s.createElementNS(Xn,"g");f.setAttribute("transform",`translate(${-u.bounds.x} ${-u.bounds.y})`);for(const h of r)f.append(h);c.append(f);const d=s.createElementNS(Xn,"foreignObject");d.setAttribute("width",String(u.bounds.width)),d.setAttribute("height",String(u.bounds.height));const p=s.createElementNS(fl,"div");p.style.cssText=`position:relative;width:${u.bounds.width}px;height:${u.bounds.height}px;`;for(const h of o){const m=br(h);m.querySelector(".activity-open,.object-open")?.remove(),m.style.left=parseFloat(h.style.left)-u.bounds.x+"px",m.style.top=parseFloat(h.style.top)-u.bounds.y+"px",p.append(m)}d.append(p),c.append(d);const g=new XMLSerializer().serializeToString(c);if(new TextEncoder().encode(g).length>ml)throw Error(Bi);return{svg:g,...u}}function wl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function aa(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const r=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(r),i()},n.onerror=()=>{clearTimeout(r),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const r=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(l=>{clearTimeout(r),l?i(l):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(l){clearTimeout(r),s(l)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function kl(e,t){const n=await aa(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=wl(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function Il(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=aa(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ca(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:Sl(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Sl(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const r of o)i=Math.imul(i^r.codePointAt(0),16777619)>>>0,s=Math.imul(s^r.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function da(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return V(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function la(e){V(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),kn(e),Vo(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=ca(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=da(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return Vo(t),t}const gr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),xl={anyOf:Fo.anyOf},Al={type:"string",pattern:"^[A-Za-z0-9_-]+$"},El={type:"string",minLength:1,pattern:"\\S"},Cl={...gr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:gr({id:Al,name:El,package:xl})}}),$defs:Fo.$defs};function Ol(e){kn(e,Cl),V(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){V(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),V(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Vo(n.package),n.package.formatVersion!=="0.4"&&la(n.package)}catch(o){throw Error("Plan "+n.id+": "+o.message,{cause:o})}}return{valid:!0,plans:e.plans.map(({id:n,name:o})=>({id:n,name:o}))}}const he=(e,t)=>{if(!e)throw new Error(t)},Zn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Ni=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Ro=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),ua=e=>Zn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Nl(e){he(Ni(e),"Graph must be an object");const t=e;he(Ro(t,["version","nodes","relations"])||Ro(t,["version","nodes","relations","scope"]),"Invalid graph fields"),he(t.version===1,"Unsupported graph version"),"scope"in t&&he(Zn(t.scope),"Invalid scope"),he(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),he(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){he(Ni(s),"Node must be an object");const r=s;he(r.type==="business"||r.type==="object","Invalid node type");const l=r.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];r.type==="business"&&("problem"in r||"pain_level"in r)&&(l.push("problem","pain_level"),he(["Low","Medium","High"].includes(String(r.pain_level)),"Invalid Pain level")),he(Ro(r,l),"Invalid node fields"),he(Object.entries(r).every(([c,a])=>c==="scope"||c==="information"||Zn(a)),"Empty node text"),he(typeof r.scope=="boolean","Invalid node scope"),he(ua(r.name)&&r.id===r.name,"Node ID must equal visible name"),he(!n.has(r.id),"Duplicate node ID"),r.type==="object"&&(he(typeof r.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.icon),"Invalid Lucide icon"),he(Array.isArray(r.information)&&r.information.every(Zn),"Invalid information")),n.set(r.id,r.type)}he([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){he(Ni(s),"Relation must be an object");const r=s;he(Ro(r,["kind","from","to","label"])&&Object.values(r).every(Zn),"Invalid relation fields");const l=o[r.kind];he(Array.isArray(l)&&n.has(r.from)&&n.has(r.to)&&n.get(r.from)===l[0]&&n.get(r.to)===l[1],"Invalid relation endpoints");const u=JSON.stringify([r.kind,r.from,r.to,r.label]);he(!i.has(u),"Duplicate relation"),i.add(u)}}function ln(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Qn(e){const t=[];let n="";return ln(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),he(!n,"Unclosed code fence"),t}function Hi(e,t,n,o=[]){const i=ln(e),s=Qn(e),r=Object.create(null);return he(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([l,u],c)=>{he(t.includes(u)&&!(u in r),n+": unsupported/duplicate "+u),r[u]=i.slice(l+1,s[c+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),he(r[u]||o.includes(u),n+": empty "+u)}),he(s.map(l=>l[1]).join("|")===t.join("|"),n+": invalid field order"),r}const yr=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function jl(e){const t=ln(e),n=Qn(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return he(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],r)=>{const l=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);he(l,"Invalid Finding ID");const u=l[1];he(!o.has(u),"Duplicate Finding ID"),o.add(u);const c=Hi(t.slice(i+1,n[r+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+u);he(["question","correction"].includes(c["### Kind"]),"Invalid Finding Kind"),he(["open","resolved"].includes(c["### Status"]),"Invalid Finding Status"),he(["items","document","unassigned"].includes(c["### Scope"]),"Invalid Finding Scope");const a=c["### Targets"]==="(none)"?[]:ln(c["### Targets"]).filter(f=>f.trim()).map(f=>(he(f.startsWith("- ")&&ua(f.slice(2)),"Invalid Finding target"),f.slice(2)));return he(new Set(a).size===a.length,"Duplicate Finding target"),he(c["### Scope"]==="items"?a.length>0:c["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:u,kind:c["### Kind"],status:c["### Status"],scope:c["### Scope"],targets:a,summary:c["### Summary"],content:c["### Content"],unresolvedTargets:[]}})}function Ml(e,t){he(!e.includes("<!--"),"HTML comments are unsupported");const n=ln(e),o=Qn(e).filter(d=>d[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;he(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const r={version:1,nodes:[],relations:[]},l=Object.create(null),u=new Set;o.slice(1).forEach(([d,p],g)=>{const h=o[g+2]?.[0]??n.length,m=n.slice(d+1,h).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(he(m,"Empty section "+p),p==="# Findings"){he(!u.has(p),"Duplicate Findings"),u.add(p),s=jl(m);return}if(["# Scope","# Graph exceptions"].includes(p)){he(!u.has(p),"Duplicate "+p),u.add(p),p==="# Scope"?(he(!Qn(m).length,"Scope must be prose"),r.scope=m):ln(m).filter(R=>R.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(R=>{const E=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(R);he(E,"Invalid exception"),r.relations.push({kind:E[1],from:E[2],to:E[3],label:E[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const A=i.exec(p);he(A,"Unsupported heading "+p);const j=A[1],w=A[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");l[w]=n.slice(d,h).join(`
`);const L=R=>Qn(m).some(E=>E[1]===R);if(j==="Object"){const R=["## Scope","## Icon"];L("## Information")&&R.push("## Information");const E=Hi(m,R,w);he(["true","false"].includes(E["## Scope"]),"Invalid Scope");const P=ln(E["## Information"]??"").filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(T=>(he(/^- \S.*$/.test(T),"Invalid Information"),T.slice(2)));r.nodes.push({id:w,type:"object",name:w,scope:E["## Scope"]==="true",icon:E["## Icon"]==="(generic icon)"?"box":E["## Icon"],information:P});return}const I=["## Scope","## Why","## When"];L("## Exception When")&&I.push("## Exception When"),I.push("## Who","## Where","## How","### Input","### Procedure"),L("### Exception")&&I.push("### Exception"),I.push("### Output","## Result"),(L("## Problem")||L("## Pain level"))&&I.push("## Problem","## Pain level");const y=Hi(m,I,w,["## How"]);he(!y["## How"],"How must only contain fields"),he(["true","false"].includes(y["## Scope"]),"Invalid Scope"),t?.activity?.(w,y);const W={id:w,type:"business",name:w,scope:y["## Scope"]==="true",why:y["## Why"],when:y["## When"],who:y["## Who"],where:y["## Where"],result:y["## Result"]};"## Problem"in y&&(W.problem=y["## Problem"],W.pain_level=y["## Pain level"]),r.nodes.push(W);for(const[R,E]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(R in y)||E!=="business-exception"&&y[R]==="(none)"||ln(y[R]).filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(P=>{const T=/^- (.+?) — (\S.*)$/.exec(P);he(T,"Invalid relation in "+w),r.relations.push({kind:E,from:E==="output"?w:T[1],to:E==="output"?T[1]:w,label:T[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const c=r.nodes.filter(d=>d.type==="business").map(d=>d.id);Nl(r),r.nodes.sort((d,p)=>yr(d.id,p.id)),r.relations.sort((d,p)=>{for(const g of["kind","from","to","label"]){const h=yr(d[g],p[g]);if(h)return h}return 0});const a=new Set(r.nodes.map(d=>d.id));for(const d of s)d.unresolvedTargets=d.targets.filter(p=>!a.has(p));return{graph:r,sections:l,markdown:e,activityOrder:c,findings:s}}const Ll=["id","from","activity","condition","to","effect","path","evidence","note"],Je=(e,t)=>{if(!e)throw Error(t)},Do=e=>typeof e=="string"&&!!e.trim();function Rl(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Je(n,"state-meta と遷移表が必要です");const o=Kr(n[1]);Je(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),Je(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Je(o.object===t,"対象Objectが一致しません"),Je(Array.isArray(o.states)&&o.states.length>0&&o.states.every(c=>Do(c)&&!c.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),Je(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&Do(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=c=>(Je(c.startsWith("|")&&c.endsWith("|"),"表の行が不正です"),c.slice(1,-1).split("|").map(a=>a.trim())),r=s(i[0]);Je([Ll,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(c=>r.join("|")===c.join("|")),"表の列名が不正です"),Je(s(i[1]).length===r.length&&s(i[1]).every(c=>/^-+$/.test(c)),"表の区切りが不正です"),Je(i.length<=1002,"遷移は1000行以内にしてください");const l=new Set,u=i.slice(2).map(c=>{const a=s(c);Je(a.length===r.length&&a.every(Do),"表の列数・空欄が不正です");const f=Object.fromEntries(r.map((d,p)=>[d,a[p]]));return Je(/^T[0-9]+$/.test(f.id)&&!l.has(f.id),"遷移IDが不正または重複しています"),l.add(f.id),Je([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),Je(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),r.includes("exception")&&Je(f.path==="normal"?f.exception==="-":Do(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),Je(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),Je(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),Je(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),Je(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:u}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const vr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Dl(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let r=0;r<o.length;r++){const l=o[r];if(!s&&/^# Object /.test(l)?n=l.slice(9):!s&&/^# /.test(l)&&(n=null),!s&&l==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const u=[];let c="";for(r++;r<o.length;r++){const f=o[r];if(!c&&/^#{1,2} /.test(f)){r--;break}u.push(f),c=vr(f,c)}const a=Rl(u.join(`
`),n);if(a.error)throw Error(a.error);t.push(a.model);continue}i.push(l),s=vr(l,s)}if(new Set(t.map(r=>r.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function Tl(e){const t=/^## State Transitions$/m.test(e)?Dl(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=Ml(t.markdown,{activity:(u,c)=>i.set(u,c),document:(u,c)=>{n=u,o=c}}),r={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(u=>u.type==="object").map(u=>({id:u.id,name:u.name,scope:u.scope,icon:String(u.icon),information:u.information})),activities:(s.activityOrder??[]).map(u=>{const c=s.graph.nodes.find(f=>f.id===u),a=i.get(u);return{id:u,name:c.name,scope:c.scope,why:String(c.why),when:String(c.when),who:String(c.who),where:String(c.where),procedure:a["### Procedure"],exception:a["### Exception"]??null,result:String(c.result),problem:c.problem===void 0?null:String(c.problem),painLevel:c.pain_level===void 0?null:String(c.pain_level)}}),relations:s.graph.relations.map((u,c)=>({id:"legacy-relation-"+c,kind:u.kind,fromId:u.from,toId:u.to,label:u.label})),findings:(s.findings??[]).map(u=>({...u,sourceId:u.id,targetIds:u.targets.filter(c=>s.graph.nodes.some(a=>a.id===c))}))};r.exceptions=ca(r);const l=t.declarations.map((u,c)=>({id:"legacy-state-"+c,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:r.id,revision:r.revision,verification:"unverified"},objectId:u.object,states:u.states.map(a=>({id:a,name:a})),start:u.start,terminal:u.terminal,completeness:u.completeness,source:u.source,transitions:u.transitions.map(a=>({id:a.id,sourceId:a.id,fromId:a.from,toId:a.to,activityId:a.activity,exceptionId:da(r,a.activity,a.exception),event:a.event??null,condition:a.condition,effect:a.effect,path:a.path,evidence:a.evidence,note:a.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:r,checks:[],states:l,diagnostics:[]}}}function Pl({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=Jr({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const i=e.business,s=[...i.objects,...i.activities],r=c=>i.roles?.find(a=>a.id===c.roleId)?.name??c.who,l=[...i.objects.map(c=>({...c,type:"object"})),...i.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:r(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],u=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===i.id).map(c=>{const a=new Map(c.states.map(d=>[d.id,d.name])),f={object:s.find(d=>d.id===c.objectId).name,states:c.states.map(d=>d.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(d=>({id:d.sourceId,from:a.get(d.fromId)??d.fromId,to:a.get(d.toId)??d.toId,activity:d.activityId,...d.event?{event:d.event}:{},...d.exceptionId?{exceptionId:d.exceptionId,exception:i.exceptions?.find(p=>p.id===d.exceptionId)?.name}:{},condition:d.condition,...d.conditionLabel?{conditionLabel:d.conditionLabel}:{},effect:d.effect,path:d.path,evidence:d.evidence,note:d.note}))};return[c.objectId,{model:f}]})));return{graph:Qr({version:1,...i.scope?{scope:i.scope}:{},nodes:l,relations:i.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(l.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:i.activities.map(c=>c.id),objectStateTransitions:u,findings:i.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(a=>s.find(f=>f.id===a)?.name??a)}))}}const fa=8*1024*1024;function pa(e){return/^\s*[\[{]/.test(e)}function Gi(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function wr(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");Gi(e);const n=Vo(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function ql(e,t){if(!pa(e)){if(t!==void 0)throw Error("案を含まない文書です。");return Tl(e)}if(new TextEncoder().encode(e).byteLength>fa)throw Error("ローカルJSONは8MiB以内にしてください。");let n=Kr(e.replace(/^\uFEFF/,""));Gi(n);let o;if(n?.format==="alder-named-plans"){Ol(n);for(const r of n.plans)if(Gi(r.package),r.package.documents.filter(l=>l.kind==="businessDesign").length!==1)throw Error("業務案 "+r.id+" にはBusiness Designが1件必要です。");const i=t??n.plans[0].id,s=n.plans.find(r=>r.id===i);if(!s)throw Error("指定した業務案がありません: "+i);o={selected:i,choices:n.plans.map(({id:r,name:l})=>({id:r,name:l}))},n=s.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const i=wr(la(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const s=i.data.business;s.schemaVersion="0.1",delete s.roles;for(const r of s.activities)delete r.roleId;i.data.diagnostics=i.data.diagnostics.filter(r=>!r.startsWith("Role未確定:"))}return{...i,...o?{namedPlans:o}:{}}}return{...wr(n,e),...o?{namedPlans:o}:{}}}function tn(e,t){return Pl(ql(e,t))}async function Wl(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>fa)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!pa(n))throw Error("JSONファイルの本文を確認してください。");return tn(n)}const zl=(e,t)=>ps(e,t,!1);async function ps(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const r=setTimeout(s,3e4);try{const l=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!l.ok)throw Error("URL取得に失敗しました（HTTP "+l.status+"）。");const u=l.headers.get("content-type")?.toLowerCase()??"";if(u.includes("html")||!n&&u.includes("json")||u.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const c=2*1024*1024;if(Number(l.headers.get("content-length"))>c)throw Error("本文は2MiB以内にしてください。");const a=l.body?.getReader();if(!a)throw Error("本文を読み取れません。");let f=0,d="";const p=new TextDecoder;try{for(;;){const{done:g,value:h}=await a.read();if(g)break;if(f+=h.length,f>c){try{a.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}d+=p.decode(h,{stream:!0})}d+=p.decode()}finally{a.releaseLock()}if(n&&u.includes("json")&&!/^\s*[\[{]/.test(d))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(d))throw Error("HTMLページは読み込めません。");return d}catch(l){const u=i.signal.aborted;throw s(),u?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):l instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):l}finally{clearTimeout(r),t?.removeEventListener("abort",s)}}const Ko=Wl;async function oi(e,t){return tn(await ps(e,t))}function $l(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return tn(e)}const ii=e=>e==="question"?"要確認":"要修正";function Ul(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${ii(o)} ${i}`)}return n}function Fl(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ii(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(xn(e.content)),t}function Vl(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Bl(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${ii(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function Hl(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const r=document.createElement("label");r.className="finding-filter";const l=document.createElement("input");l.type="checkbox",l.checked=t,l.onchange=()=>n(l.checked),r.append(l,document.createTextNode("解消済みも表示")),s.append(r);const u=(a,f,d)=>{const p=document.createElement("button");p.className="node-navigate finding-index-row",p.dataset.findingKey=a.type+":"+a.id;const g=document.createElement("strong");g.textContent=f;const h=document.createElement("span");return h.textContent=d,p.append(g,h),p.onclick=()=>o(a),p},c=e.graph.nodes.filter(a=>(!i||a.id===i)&&typeof a.problem=="string");if(c.length){const a=document.createElement("h3");a.textContent="困りごと",s.append(a);for(const f of c)s.append(u({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[a,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const d=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(a==="broken"?g.unresolvedTargets.length>0:g.scope===a&&!g.unresolvedTargets.length));if(!d.length)continue;const p=document.createElement("h3");p.textContent=`${f}（${d.length}件）`,s.append(p);for(const g of d)s.append(u({type:"finding",id:g.id},`${ii(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const a=document.createElement("p");a.textContent="表示する指摘はありません。",s.append(a)}return s}function Gl(e){const t=ta(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,r)=>s===i[r]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...rc(),viewInset:[40,0],canvasOrigin:void 0}}function Kl(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function ms(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Jl(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{ms(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function _l(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(ms(t)),n.href}function Xl(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return ms(t)}const hs=`# Alderを使った設計業務 — Business Design

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
`,Zl=`{
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
`;function Yl(e,t){const n=new Set(t.graph.nodes.map(d=>d.id)),o=new Map;for(const d of t.graph.nodes)o.set(d.name,o.has(d.name)?void 0:d.id);const i=d=>n.has(d)?d:o.get(d),s=Object.create(null);for(const[d,p]of Object.entries(e.positions)){const g=i(d);g&&(s[g]=p)}const{scroll:r,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:a,selectedEdgesOnly:f}=e;return{positions:s,scroll:r,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:a,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(d=>{const p=i(d);return p?[p]:[]}))]}}}const Ql=`# Alderのチェックリストサンプル

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
`;function eu(e,t,n,o,i=()=>!0,s=()=>{}){const r=e.ownerDocument,l=r.defaultView;let u,c=0,a=0,f=!1,d=null,p="";const g=new Map,h=()=>{u!==void 0&&(l.clearTimeout(u),c=Math.max(0,c-(Date.now()-a)),u=void 0)},m=(w=!1)=>{if(w&&!i())return;h(),g.delete(p);const L=[...g].at(-1);if(L){j(L[1],"error",L[0]);return}const I=e.contains(r.activeElement);e.hidden=!0,t.textContent="",s(),I&&(d?.isConnected?d:o).focus({preventScroll:!0})},A=()=>{e.hidden||e.dataset.kind==="error"||f||r.hidden||e.contains(r.activeElement)||(h(),a=Date.now(),u=l.setTimeout(m,c))};e.addEventListener("pointerenter",()=>{f=!0,h()}),e.addEventListener("pointerleave",()=>{f=!1,A()}),e.addEventListener("focusin",w=>{const L=w.relatedTarget;L&&!e.contains(L)&&(d=L),h()}),e.addEventListener("focusout",()=>l.setTimeout(A,0)),e.addEventListener("keydown",w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),m(!0))}),r.addEventListener("visibilitychange",()=>r.hidden?h():A()),n.onclick=()=>m(!0);const j=(w,L,I)=>{h(),e.contains(r.activeElement)||(d=r.activeElement),p=I,e.dataset.kind=L,e.dataset.key=I,t.setAttribute("role",L==="error"?"alert":"status"),t.setAttribute("aria-live",L==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=w,s(),c=L==="warning"?8e3:5e3,A()};return(w,L="success",I="operation")=>{L==="error"&&w?(g.delete(I),g.set(I,w)):g.delete(I);const y=[...g].at(-1);if(y){if(!e.hidden&&t.textContent===y[1]&&p===y[0])return;j(y[1],"error",y[0]);return}if(!w){p===I&&m();return}!e.hidden&&t.textContent===w&&e.dataset.kind===L||j(w,L,I)}}const kr=Zl,At=document.querySelector("#app");At.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Fe;const k=e=>document.getElementById(e),Pn=na(location.pathname);Pn.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${Pn.version}`,k("preview-badge").title=`PR #${Pn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const ro=e=>On(e,{"stroke-width":1.8,"aria-hidden":"true"}),po=document.createElement("div");po.id="source-menu";po.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';At.append(po);const si=document.createElement("div");si.id="checks-menu";si.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';At.append(si);const An=document.createElement("section");An.id="check-followup";An.hidden=!0;An.setAttribute("aria-labelledby","check-followup-title");An.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(An);const ri=document.createElement("div");ri.id="check-followup-menu";ri.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';At.append(ri);const Ut=document.createElement("input");Ut.type="file";Ut.id="check-file";Ut.accept=".md,.markdown,text/markdown,text/plain";Ut.hidden=!0;At.append(Ut);const nn=document.createElement("section");nn.id="check-url-dialog";nn.hidden=!0;nn.setAttribute("role","dialog");nn.setAttribute("aria-labelledby","check-url-title");nn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';At.append(nn);const ai=document.createElement("div");ai.id="help-menu";ai.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Pn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Pn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Pn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;At.append(ai);ni(k("help-menu-toggle"),ai);const eo=document.createElement("div");eo.id="url-history";po.append(eo);function tu(){if(eo.replaceChildren(),!M.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",eo.append(e);for(const t of M.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=ce||Te||de,n.onclick=()=>{nu(t.url)},eo.append(n)}}async function nu(e){if(!(ce||Te||de)){if(M.document?.source?.kind==="url"&&M.document.source.url===e){Se(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),go();return}Te=!0,je();try{const t=await oi(e),n=Vn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await mo(n)}catch(t){t instanceof Cn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Te=!1,je()}}}const ou=ni(k("open-menu-toggle"),po),iu=ni(k("open-checks"),si,()=>{const e=ne();k("check-open-sample").hidden=!e||!ws(e),k("check-close").disabled=!e?.checks}),ma=ni(k("check-followup-open"),ri,()=>{k("check-followup-sample").hidden=!ne()||!ws(ne())});for(const[e,t]of[["open-menu-toggle",Bs],["open",Bs],["open-url",ac],["open-text",cc],["view-markdown",dc],["open-checks",Nr],["share-source",lc],["refresh",uc],["help-menu-toggle",fc],["drawer",pc],["node-list-toggle",mc],["node-list-close",jr],["display-settings-toggle",Mr],["reset-layout",hc],["save-image",bc],["copy-image",gc],["out",Dr],["in",Tr]])k(e).prepend(ro(t));ul(document.querySelector("header"));const Ki=ll(document.querySelector(".tab-strip"));let M={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Mt=!0,_t=!1,ce=!0,Un=!1,In=!1,Te=!1,Ir=Promise.resolve(),un,ke,Lt=0,de=!1,to=!1,qn=0,Jo=0,Wn=!1,bs=!1,Ji=!1,Sr=!1;const _i=new Set,Xt=new Set,_o=new Set;function ha(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of _o){const o=[...M.document?[M.document]:[],...M.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&_o.delete(n)}}const ne=()=>M.tabs.find(e=>e.key===M.active),En=e=>Yt(e)?.key??e.key,Qt=e=>M.document?.key===En(e);let Xi="";const su=eu(k("status"),k("status-text"),k("status-close"),k("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(Xi===e)return;Xi=e}su(e,t,n)}function gs(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function ys(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Bt(){ce||(Lt++,et())}function ru(e){e.preventDefault(),e.returnValue=!0}function et(){const e=Lt>qn||Jo>0||!1||de||_o.size>0||Ji||Wn||In,t=!ce&&e;t!==Sr&&(Sr=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",ru));const n=ce?"restoring":Un?"protected":In?"conflict":Wn?"error":Ji||_o.size>0?"draft":Jo>0||de?"saving":Lt>qn?"dirty":bs?"saved":"unchanged";At.dataset.saveState!==n&&(At.dataset.saveState=n),Un?gs():In?ys():Wn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),di()}function vs(e){Wn=!0,Xi=""}function ci(){if(Un)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(In)throw new us}async function au(e){ci();try{await Bd(e)}catch(t){throw t instanceof us&&(In=!0,clearTimeout(un),un=void 0,ys()),t}}function ba(e,t){Jo++,_i.add(t),et();const n=Ir.catch(()=>{}).then(()=>au(e)).then(()=>{qn=Math.max(qn,t),bs=!0,ha(e),qn===Lt&&(Wn=!1)},o=>{throw vs(),o}).finally(()=>{Jo--,_i.delete(t),et()});return Ir=n.catch(()=>{}),n}function xe(e=180,t=!0){if(ce)return;if(t&&Lt++,clearTimeout(un),un=void 0,Un){gs(),et();return}if(In){ys(),et();return}if(de||_i.has(Lt)||!t&&Lt<=qn&&!Wn){et();return}const n=()=>{un=void 0;let o;try{o=structuredClone(fs(M))}catch{vs(),et();return}ba(o,Lt).catch(()=>et())};e===0?n():un=window.setTimeout(n,e),et()}async function cu(e){if(ce||ke||de||!M.tabs.includes(e))return;if(oo(e)===void 0){Fe?.closeBusinessOverview();return}ht.cancel(),Se();const t=M.active===e.key,n={...M,tabs:M.tabs.filter(o=>o!==e),active:t?M.tabs[0]?.key:M.active};try{await ho(()=>n,()=>{M=n}),t&&At.dataset.workspaceArea==="business"&&Fe?.businessActivated()}catch{et()}}function ut(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!ne(),t=e&&M.drawer,n=e&&!!M.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(_t=!1),di(),k("layout-lock").replaceChildren(ro(Mt?Lr:Rr)),k("layout-lock").setAttribute("aria-pressed",String(Mt)),k("layout-lock").title=Mt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",ce),k("viewport").dataset.layoutLocked=String(Mt),k("prefer-write").checked=M.preferWrite===!0,k("prefer-write").disabled=ce,k("show-exceptions").checked=ne()?.showExceptions!==!1,k("show-exceptions").disabled=ce||de||!ne()||ke===ne(),k("selected-edges-only").checked=ne()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=ce||de||!ne()||ke===ne(),document.documentElement.dataset.theme=M.dark?"dark":"light",k("theme").replaceChildren(ro(M.dark?Sc:xc)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(M.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",ce||!e),k("node-list-drawer").hidden=!n||ft().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",ce||!e),Fe?.syncChrome()}function Zi(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!ne(),t.disabled=to||ce||!ne()||ke===ne(),t.setAttribute("aria-busy",String(to))}}function di(){Zi(),document.querySelector(".toolbar").dataset.settingsOpen=String(_t),k("display-options").hidden=!_t,k("reset-layout").disabled=ce||Te||de||!1||!ne()||Xt.has(M.document?.key??"")||Un||In;const e=k("display-settings-toggle"),t=_t?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(_t)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ce||de||!ne()||ke===ne()}function ga(e,t=!1){const n=ne();ce||de||!n||ke===n||e===_t||(e&&(Fn.delete(Yt(n)?.key??n.key),li()),ht.cancel(),qe=void 0,Se(),_t=e,di(),Vt(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function ya(e){const t=ne();if(!(to||ce||!t||ke===t)){to=!0,Zi();try{const n=vl(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Il(n),$e("グラフ全体のPNGをコピーしました。")):await kl(n,(Yt(t)?.name??t.name)+(oo(t)?" - "+oo(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{to=!1,Zi()}}}k("save-image").onclick=()=>ya(!1);k("copy-image").onclick=()=>ya(!0);k("display-settings-toggle").onclick=()=>ga(!_t);k("reset-layout").onclick=()=>{const e=ne();if(ce||Te||de||ke||!e||Xt.has(En(e)))return;try{ci()}catch{et();return}ht.cancel(),dn.cancel(),qe=void 0,Se();const t={...e,design:ei(e)},n=Gl(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),xa.invalidate(e),je(),n!==t&&xe()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&_t&&k("source-dialog").hidden&&(e.preventDefault(),ga(!1,!0))});function Se(e=!0){const t=ne();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Bt(),xe(180,!1)),o}function va(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function Yi(){ou.close(),iu.close(),ma.close(),Ki.close(),va(du),Ki.update()}function du(){const e=k("tabs");e.replaceChildren(),M.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===M.active?" active":""),n.draggable=oo(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Ho(t)!==void 0&&(n.dataset.activity=Ho(t)),Go(t)!==void 0&&(n.dataset.object=Go(t));const o=document.createElement("button");Ti(o,"business",t.name),o.setAttribute("aria-current",String(t.key===M.active)),o.disabled=de,o.onclick=async()=>{if(de||Rt&&Rt!==t.key&&!await bo())return;const s=Se()||M.active!==t.key;Fe?.activateBusiness(),M.active=t.key,je(),Fe?.businessActivated(),xe(180,s)};const i=Pi("業務設計："+t.name+"を閉じる");i.disabled=de,i.onclick=()=>cu(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),de)return;const r=M.tabs.findIndex(u=>u.key===s.dataTransfer?.getData("text/plain")),l=M.tabs.indexOf(t);if(r>0&&l>0&&r!==l){const[u]=M.tabs.splice(r,1);M.tabs.splice(l,0,u),Yi(),xe()}},n.onkeydown=s=>{if(!de&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const r=M.tabs.indexOf(t),l=r+(s.key==="ArrowLeft"?-1:1);r>0&&l>0&&l<M.tabs.length&&([M.tabs[r],M.tabs[l]]=[M.tabs[l],M.tabs[r]],Yi(),xe())}},e.append(n)})}const xr=new Map,Fn=new Set;function li(){const e=ne(),t=!!e&&e.design.sourceFormat!=="json"&&Fn.has(Yt(e)?.key??e.key)&&!e.checks;t||(ma.close(),An.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),An.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=ce||Te||de||!1||!e||mn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=ne();e&&Fn.delete(Yt(e)?.key??e.key),li()};let Qi;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{Qi=k("check-followup-open"),k(t).click(),Qi=void 0};function ws(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===hs}function mn(e){const t=Yt(e)?.key??e.key;let n=xr.get(t);return n||(n={},xr.set(t,n)),n}async function ks(e,t){if(!Qt(e))throw Error("原本文書が切り替わりました。");const n=$t(M,M.recovery,{...M.document,checks:t},fs(M).views);await ho(()=>n,()=>{M=n,t&&Fn.delete(Yt(e)?.key??e.key)})}async function wa(e,t){const n=mn(e);if(e.design.sourceFormat==="json"||n.busy||de||ce||ke===e)return;const o=io(e);n.busy=!0,n.error=void 0,n.candidate=void 0,en();try{const i=await t();if(!Qt(e))return;if(o!==io(M.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=$n(i),r=so(s,M.tabs[0]);if(r.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+r.reason);r.state==="unverified"?n.candidate=i:(await ks(e,i),n.candidate=void 0,Fe?.openRelatedChecks(ne()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,$e(n.error,"error")}finally{n.busy=!1,en()}}async function ka(e,t){const n=mn(e);if(n.busy||de||!Qt(e))return;const o=so($n(t),M.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,en();return}n.busy=!0,n.error=void 0;try{await ks(e,{...t,confirmedFor:io(M.tabs[0])}),n.candidate=void 0,Fe?.openRelatedChecks(ne()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,en()}}function en(){li();const e=ne(),t=k("detail"),n=e?mn(e):void 0,o=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=ce||de||ke===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const r=e.design.graph.nodes.find(f=>f.id===e.selected),l=dl(e,n,{disabled:ce||de||ke===e,redraw:en,confirm:f=>{ka(e,f)}}),u=document.createElement("div");u.className="right-drawer-heading";const c=Gc(r?.name??"業務設計");if(r){const f=r.type==="business"?Ia(String(r.who),r.id):Fr(r);f.classList.add("drawer-node-icon"),c.prepend(f)}u.append(c);const a=document.createElement("button");if(a.type="button",a.id="business-drawer-close",a.setAttribute("aria-label","右ドロワーを閉じる"),a.textContent="×",a.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},u.append(a),t.append(u),l.hasChildNodes()&&t.append(l),r){const f=Bl(e.design,r.id,Is);f.hasChildNodes()&&t.append(f)}t.append(Id(e.design,r?.id)),r?.type==="business"&&Fe?.appendActivityTestLinks(t,r.id),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Ar=new Map,ft=()=>{const e=M.active??"";let t=Ar.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Ar.set(e,t)),t};function Is(e){if(!ne())return;const t=ft();t.mode="findings",t.finding=e,M.nodeDrawer=!0,innerWidth<=800&&(M.drawer=!1),ut(),xt(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),xe()}function lu(e){const t=ne();if(!t)return;const n=ft();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){Is(o[0]);return}M.nodeDrawer=!0,innerWidth<=800&&(M.drawer=!1),ut(),xt(),k("drawer-mode-findings").focus({preventScroll:!0}),xe()}function uu(e,t){const n=ft().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(l=>l.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(l=>l.id===n.id&&typeof l.problem=="string"):void 0;if(!o&&!i)return ft().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{ft().finding=void 0,xt(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(Fl(o));else{const l=document.createElement("h2");l.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(l,xn(String(i.problem)))}const r=o?.targets??[i.id];if(r.length){const l=document.createElement("section"),u=document.createElement("h3");u.textContent="関連項目へ移動",l.append(u);for(const c of r){const a=document.createElement("button");a.className="node-navigate finding-target-link",a.dataset.findingTarget=c;const f=e.design.graph.nodes.some(p=>p.id===c),d=e.hiddenNodes?.includes(c);a.disabled=!f||!!d,a.textContent=(e.design.graph.nodes.find(p=>p.id===c)?.name??c)+(f?d?"（非表示）":"":"（参照先なし）"),a.onclick=()=>Wo(c,!0),l.append(a)}t.append(l)}return!0}function Ia(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&ne()?.design.model?.business.roles?cs(ne().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(ro(Wr)),o}function ui(e,t=!0){ce||!ne()||(ht.cancel(),Se(),M.nodeDrawer=e,e&&ft().mode==="findings"&&innerWidth<=800&&(M.drawer=!1),ut(),e&&ne()?.selected&&Bn(ne().selected),xt(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),xe())}function Bn(e){const t=ne(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=ft();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(Hc(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function fu(e,t){const n=ne();if(!n||ce||de||ke===n)return;ht.cancel(),qe=void 0,Se();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],hn(),xe()}function Wo(e,t=!1){let n=ne();if(n&&!ei(n).graph.nodes.some(f=>f.id===e)&&(Se(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,n=ne(),je()),!n||n.hiddenNodes?.includes(e)||ke===n)return;t||(ft().finding=void 0);const o=k("node-list").contains(document.activeElement);ht.cancel(),qe=void 0,Se(),n.selected=e,Bn(e),ut(),hn();const i=k("viewport"),s=i.getBoundingClientRect(),r=k("formattedMarkdownDrawer").getBoundingClientRect(),l=M.drawer&&r.left>s.left&&r.left<s.right?r.left:s.right,u=Math.max(1,Math.min(i.clientWidth,l-s.left-i.clientLeft)),c=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const a=n.positions[e];if(n.scroll=[(a[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-u/2,(a[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-c/2],Vt(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],Se(),o){const f=t?"[data-finding-target]":"[data-list-node]",d=Array.from(k("node-list").querySelectorAll(f)).find(p=>(t?p.dataset.findingTarget:p.dataset.listNode)===e);(t?d:d?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}xe()}function xt(){const e=ne(),t=ft(),n=k("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=k("drawer-modes");s.replaceChildren();for(const g of["findings"]){const h=document.createElement("button");h.id="drawer-mode-"+g,h.setAttribute("role","tab"),h.setAttribute("aria-selected",String(t.mode===g)),h.setAttribute("aria-controls","node-list"),h.tabIndex=t.mode===g?0:-1,h.textContent=`指摘（${e?Vl(e.design):0}）`;const m=()=>{t.mode=g,xt(),k("drawer-mode-"+g).focus({preventScroll:!0})};h.onclick=m,h.onkeydown=A=>{["ArrowLeft","ArrowRight","Home","End"].includes(A.key)&&(A.preventDefault(),h.focus({preventScroll:!0}))},s.append(h)}for(const g of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const r=k("node-list-search");r.value=t.search,r.disabled=!e||ce;const l=k("node-categories");l.replaceChildren();for(const[g,h]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const m=document.createElement("button");m.dataset.category=g,m.id="node-category-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.category===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.category===g?0:-1,m.textContent=h,m.onclick=()=>{t.category=g,xt(),k("node-category-"+g).focus({preventScroll:!0})},m.onkeydown=A=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(A.key))return;A.preventDefault();const j=["activity","object","role"],w=j.indexOf(g);t.category=A.key==="Home"?"activity":A.key==="End"?"role":j[(w+(A.key==="ArrowRight"?1:2))%3],xt(),k("node-category-"+t.category).focus({preventScroll:!0})},l.append(m)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const u=new Set(e?.hiddenNodes??[]),c=e?.design.graph.nodes.filter(g=>!g.scope)??[],a=c.filter(g=>!u.has(g.id)).length,f=k("scope-outside"),d=a===c.length?"true":a===0?"false":"mixed";f.setAttribute("aria-pressed",d),f.setAttribute("aria-label",d==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(ro(d==="false"?Ac:Ec)),f.disabled=!c.length||ce||ke===e;const p=k("show-outside");if(p.checked=d==="true",p.indeterminate=d==="mixed",p.setAttribute("aria-checked",d),p.disabled=f.disabled,k("scope-count").textContent=d==="mixed"?`${a}/${c.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(uu(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(m=>m.id===t.filterNode)?.name??t.filterNode)+"の指摘";const h=document.createElement("button");h.className="node-navigate finding-all",h.textContent="すべての指摘",h.onclick=()=>{t.filterNode=void 0,xt(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,h)}n.append(Hl(e.design,t.resolved,g=>{t.resolved=g,xt(),n.querySelector("input")?.focus({preventScroll:!0})},Is,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>ui(!M.nodeDrawer);k("node-list-close").onclick=()=>ui(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),ui(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),ui(!1))});k("node-list-search").oninput=()=>{ft().search=k("node-list-search").value,xt()};function Sa(){const e=ne();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);fu(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=Sa;k("show-outside").onchange=Sa;const pu="http://www.w3.org/2000/svg",ji=e=>document.createElementNS(pu,e),xa=new Fi,Er=new WeakMap;function mu(e){if(!Ur(e.graph))return;let t=Er.get(e);return t||(t=Fd(e),Er.set(e,t)),t.wires}function hu(e,t,n){rs(k("edges"),e,t,{"data-relation":String(n)})}let ao=()=>{},Jt=[0,0],cn=[0,0];function bu(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function gu(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Vt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],cn[0]):0,i[1]<0||n[1]>0?Math.min(i[1],cn[1]):0],{growth:r,origin:l}=Ic(n,s,e.zoom),u=r.some(Boolean);u&&(e.canvasOrigin=l,e.scroll=[e.scroll[0]+r[0],e.scroll[1]+r[1]],Bt(),xe(180,!1));const c=Math.ceil(Math.max(1400,Jt[0],(bu()+e.scroll[0])/e.zoom-t[0]*2-l[0],...o.map(f=>f[0]+340))),a=Math.max(850,Jt[1],Math.max(Jt[1],...o.map(f=>f[1]+68))+gu()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-l[1],...o.map(f=>f[1]+220));k("canvas").style.width=(c+l[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(a+l[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(l[0]+t[0])*e.zoom+"px",k("nodes").style.top=(l[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=c+"px",k("nodes").style.height=a+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-l[0]} ${-l[1]} ${c+l[0]} ${a+l[1]}`),k("edges").style.width=(c+l[0])*e.zoom+"px",k("edges").style.height=(a+l[1])*e.zoom+"px",u&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function hn(){va(yu)}function yu(){di(),dn.cancel(),ao=()=>{},Jt=[0,0],cn=[0,0];const e=ne();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,en(),xt();return}const t=ei(e),n=t.graph.nodes,o=n.filter(a=>!e.hiddenNodes?.includes(a.id)),i=new Set(o.map(a=>a.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,r=e.positions,l=Uo(t.graph.relations,s);Vt(e),k("edges").append(ss());const u=Kl(t.graph.relations,M.preferWrite===!0),c=()=>{const a=n.flatMap(m=>{const A=r[m.id];return A?[{id:m.id,x:A[0],y:A[1],width:260,height:68}]:[]}),f=mu(t),d=xa.update(e,t,a,t.graph.relations,f),p=new Map;for(Jt=[0,0],cn=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(m=>[m.id,m.name]));t.graph.relations.forEach((m,A)=>{if(u.has(A))return;const j=d[A];if(!j||(Jt[0]=Math.max(Jt[0],j.bounds.right+20,j.label[0]+Math.max(30,m.label.length*12)/2+12),Jt[1]=Math.max(Jt[1],j.bounds.bottom+20,j.label[1]+22),cn[0]=Math.min(cn[0],...j.points.map(R=>R[0]-20),j.label[0]-Math.max(30,m.label.length*12)/2-12),cn[1]=Math.min(cn[1],...j.points.map(R=>R[1]-20),j.label[1]-22),e.selectedEdgesOnly===!0&&l.muted(m)||!i.has(m.from)||!i.has(m.to)||e.showExceptions===!1&&(m.kind==="business-exception"||m.kind==="object-exception")))return;const w=ji("path");w.setAttribute("d",j.path),w.dataset.relation=String(A),w.dataset.collisions=String(j.collisions),w.dataset.rerouted=String(j.rerouted),w.dataset.fallback=String(j.fallback),w.setAttribute("marker-end","url(#arrow)"),w.classList.add("edge"),m.kind.endsWith("exception")&&w.classList.add("exception"),l.related(m)&&(w.classList.add("review-related"),w.setAttribute("marker-end","url(#related-arrow)")),l.muted(m)&&w.classList.add("muted");const L=ji("title");L.textContent=(g.get(m.from)??m.from)+" → "+(g.get(m.to)??m.to)+": "+m.label,w.append(L),k("edges").append(w),m.kind.endsWith("exception")&&hu(w,j,A);const I=$r(m,A,f?.[A]),y=p.get(I);if(y){y.dataset.relations+=" "+A,l.related(m)&&(y.classList.add("review-related"),y.classList.remove("muted"));return}const W=ji("text");p.set(I,W),W.dataset.relations=String(A),W.setAttribute("x",String(j.label[0]-Math.max(30,m.label.length*12)/2)),W.setAttribute("y",String(j.label[1])),W.setAttribute("text-anchor","start"),W.classList.add("edge-label"),W.setAttribute("dominant-baseline","middle"),W.dataset.relation=String(A),l.related(m)&&W.classList.add("review-related"),l.muted(m)&&W.classList.add("muted"),W.textContent=m.label,k("edges").append(W)});const h=k("edges");for(const m of[...Array.from(h.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(h.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(h.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(h.querySelectorAll(".edge-label.review-related"))])h.append(m);Vt(e)};ao=c,c(),o.forEach(a=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+a.type+(a.scope?"":" outside")+l.nodeClasses(a.id),f.dataset.node=a.id,a.type==="business"&&(f.dataset.activity=a.id),f.style.left=r[a.id][0]+"px",f.style.top=r[a.id][1]+"px",a.type==="business"?f.append(Ia(String(a.who),a.id)):f.append(Fr(a));const d=document.createElement("span");d.className="node-text";const p=document.createElement("span");p.className="review-kind",p.textContent=(a.type==="business"?"Activity":"Object")+(a.scope?" · 範囲内":" · 範囲外"),d.append(p);const g=document.createElement("span");if(g.className="node-name",g.textContent=a.name,d.append(g),a.type==="business"){const w=document.createElement("small");w.textContent=String(a.who),d.append(w)}if(f.append(d),Cc(a.id,oo(e))){const w=document.createElement("button");w.type="button",w.className=a.type==="business"?"activity-open":"object-open",w.setAttribute("aria-label",a.name+"の詳細タブを開く"),w.title="詳細タブを開く",w.textContent="開く",w.onpointerdown=L=>L.stopPropagation(),w.onpointerup=L=>L.stopPropagation(),w.onclick=L=>{L.stopPropagation(),a.type==="business"?es(a.id):Aa(a.id),Fe?.businessActivated()},f.append(w)}f.title=a.name+(a.type==="business"?" — "+String(a.who):""),f.setAttribute("aria-label",f.title+(a.id===s?"（選択中）":""));const h=Ul(e.design,a);if(h.length){const w=document.createElement("button");w.type="button",w.className="finding-badges",w.textContent=h.join(" · "),w.setAttribute("aria-label",a.name+"の指摘を開く"),w.onpointerdown=L=>L.stopPropagation(),w.onpointerup=L=>L.stopPropagation(),w.onclick=L=>{L.stopPropagation(),lu(a.id)},f.append(w),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+h.join("、"))}let m;const A=f;A.onpointerdown=w=>{w.button!==0||ke===e||Mt||(w.stopPropagation(),A.setPointerCapture(w.pointerId),m=w.pointerId,dn.begin(a.id,[w.clientX,w.clientY]))},A.onpointermove=w=>{m===void 0||w.pointerId!==void 0&&w.pointerId!==m||!f.isConnected||ke===e||dn.move([w.clientX,w.clientY])},A.onpointerup=w=>{if(m===void 0||m!==w.pointerId||(m=void 0,!f.isConnected||ke===e))return;const L=dn.end();A.hasPointerCapture?.(w.pointerId)&&A.releasePointerCapture(w.pointerId),L&&(L.moved||(ft().finding=void 0,e.selected!==a.id&&(e.selected=a.id,Bt()),Bn(a.id)),Se(),hn(),xe(180,!1))};const j=w=>{m===void 0||m!==w.pointerId||(m=void 0,f.isConnected&&(dn.cancel(),Se(),xe(180,!1)))};A.onpointercancel=j,A.onlostpointercapture=j,k("nodes").append(f)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",en(),xt()}function es(e){ce||de||ke||(Se(),Qd(M,e),je(),xe(),k("viewport").focus({preventScroll:!0}))}function Aa(e){ce||de||ke||(Se(),el(M,e),je(),xe(),k("viewport").focus({preventScroll:!0}))}function je(){Ea(),document.title=M.document?M.document.name+" · Alder Viewer":"Alder Viewer",ht.cancel(),qe=void 0,ut(),Yi(),hn();const e=ne();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",ce||de||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Xt.has(En(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",ce||Te||de||!1||!e||Xt.has(En(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",ce||Te||de||!1||!e||!!(e&&mn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",ce||Te||de);k("open-sample").setAttribute("aria-disabled",String(ce||Te||de)),k("open-sample").tabIndex=ce||Te||de?-1:0,k("theme").toggleAttribute("disabled",ce),uo(),li(),tu(),mi(),Fe?.syncDocument()}function Ea(){const e=k("header-title"),t=M.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{vu(n.value)},e.append(n));const o=Array.from(n.options).map(i=>[i.value,i.textContent]);JSON.stringify(o)!==JSON.stringify(t.choices.map(({id:i,name:s})=>[i,s]))&&n.replaceChildren(...t.choices.map(({id:i,name:s})=>{const r=document.createElement("option");return r.value=i,r.textContent=s,r})),n.value=t.selected,n.title=t.choices.find(i=>i.id===t.selected)?.name??"",n.disabled=ce||Te||de||!1}async function vu(e){const t=M.document;if(!t?.design.namedPlans||ce||Te||de||ke||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),o=document.activeElement===n;try{if(!k("source-dialog").hidden&&!await bo()){Ea();return}const i=tn(t.design.markdown,e),s=crypto.randomUUID(),r=$t({...M,tabs:[],active:s},M.recovery,{...t,design:i},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await ho(()=>r,()=>{M=r}),Fe?.reopenBusinessOverview(),Fe?.activateBusiness(),Fe?.businessActivated(),$e("")}catch(i){je(),i instanceof Cn||$e("案を切り替えられません: "+i.message,"error")}finally{o&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function mo(e){const t=M.document,n=Zd(M,e);return t?(await ho(()=>n,()=>{M=n,Fn.add(Yt(M.tabs[0])?.key??M.tabs[0].key)}),!0):(Se(),M=n,Fn.add(Yt(M.tabs[0])?.key??M.tabs[0].key),je(),xe(),!0)}async function Ca(e,t){if(Rt&&!await bo())return;const n=await Ko(e),o=ne();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await co(o,n,t))return;Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),xe();return}const i=Vn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await mo(i)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(ce||Te||de))try{if(M.document?.source?.kind==="sample"&&M.document.design.markdown===kr){Se(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),k("viewport").focus({preventScroll:!0});return}const t=tn(kr),n=M.document?.source?.kind==="sample"&&M.document.design.markdown===hs?M.tabs[0]:void 0;n&&Se();const o=n??M.sampleLayout,i=o?Yl(o,t):{},s=Vn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await mo(s)&&k("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(ce||Te||de)){Te=!0,je();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Ca(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Te=!1,je()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(ce||Te||de)){Te=!0,je();try{for(const t of Array.from(e.files??[]))await Ca(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Te=!1,je()}};class Cn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function ho(e,t){if(de||ke)throw Error("表示を切り替えています。完了後に再試行してください。");try{ci()}catch(i){throw new Cn(i)}Se(),clearTimeout(un),un=void 0,de=!0,Lt++;const n=Lt;je(),et();let o=!1;try{const i=structuredClone(fs(e()));await ba(i,n);const s=M;t(),M!==s&&(M=tl(M,s)),lt==="view"&&Rt&&!M.tabs.some(r=>r.key===Rt)&&(Rt=M.tabs[0]?.key),ha(i),o=!0}catch(i){throw vs(),new Cn(i)}finally{de=!1,je(),et(),o&&Lt!==n&&xe(0,!1)}}async function co(e,t,n=e.handle,o=!1){if(!Qt(e)||e.design!==M.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=tn(t.markdown,e.design.namedPlans.selected));const i=!!e.design.namedPlans!=!!t.namedPlans,s=crypto.randomUUID(),r=M.document,l=i&&r?$t({...M,tabs:[],active:s},M.recovery,{...r,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):Yd(M,t,n,o);return await ho(()=>l,()=>{M=l}),Sn=void 0,mi(),$e(""),!0}async function Cr(e){if(!Qt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await co(e,await Ko(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const r=i.files?.[0];r&&await co(e,await Ko(r)),s()}catch(r){i.remove(),o(r)}},i.click()})}k("refresh").onclick=async()=>{const e=ne();if(ce||de||ke||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Xt.has(En(e)))return;Rt===e.key&&Zo();const t=En(e);Xt.add(t),je();try{if(e.source?.kind==="url"){const o=await oi(e.source.url);await co(e,o);return}if(!e.handle){await Cr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Qt(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Cr(e);return}await co(e,await Ko(await e.handle.getFile()))}catch(n){Qt(e)&&n.name!=="AbortError"&&!(n instanceof Cn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Xt.delete(t),je()}};let lt="text",Rt,Zt=!1,fn=0,Xo,ts=null;const Ft=()=>k("source-text"),lo=()=>k("source-url");function Ss(){Ji=!k("source-dialog").hidden&&lt!=="view"&&(lt==="text"?Ft().value:lo().value)!=="",et()}lo().addEventListener("input",Ss);function uo(){ns();const e=lt==="view",t=Zt||de;Ft().disabled=t,Ft().readOnly=e,k("source-dialog").dataset.mode=lt,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=de||t&&lt!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",Ss(),queueMicrotask(ja)}function xs(e,t){if(!(ce||Te||de||t&&Xt.has(En(t)))){Xo?.abort(),fn++,lt=e,Rt=t?.key,Zt=!1,ts=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${M.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Ft().value=t.design.markdown:e==="text"&&(Ft().value=fi),uo(),(e==="url"?lo():Ft()).focus()}}let fi="",To;function wu(){if(ts?.isConnected&&ts.focus({preventScroll:!0}),To!==void 0&&cancelAnimationFrame(To),lt!=="view")return;const e=fn;To=requestAnimationFrame(()=>{if(To=void 0,e!==fn||!k("source-dialog").hidden)return;const t=window.visualViewport,n=At.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Zo(){fn++,Xo?.abort(),Zt=!1,Rt=void 0,k("source-dialog").hidden=!0,uo(),wu()}async function bo(){return de?!1:(lt==="text"&&(fi=Ft().value),Zo(),!0)}function Oa(){return bo()}Ft().oninput=()=>{lt==="text"&&(fi=Ft().value,Ss())};let zo=!1;function Na(){return ce||Te||Zt||de||ke?"読込が終わってから共有してください。":Jl(ne())}function ns(){const e=Na(),t=k("share-source");t.hidden=!ne(),t.setAttribute("aria-disabled",String(zo||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(zo)return;const e=Na();if(e){$e(e,"warning");return}const t=ne();if(t.source?.kind!=="url")return;const n=t.source.url,o=_l(location.href,n);zo=!0,ns();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{zo=!1,ns()}};let Kt,Dn=0,Or=0,no;function ja(){if(ce||Te||Zt||ke||de||Kt||no===void 0)return;const e=no;no=void 0,As(e)}async function As(e=location.hash){const t=e;if(ce)return;const n=++Or;if(!/^#source(?:=|$)/.test(t)){no=void 0,Kt&&!de&&(Kt.abort(),Kt=void 0,Dn++,Te=!1,je());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),de){no=t;return}if(Zt||Te&&!Kt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++Dn;Kt?.abort();try{const i=Xl(t);ci();const s=M.tabs.find(c=>c.source?.kind==="url"&&c.source.url===i),r=s;if(r){if(Rt&&Rt!==r.key&&!await bo()||o!==Dn||n!==Or)return;const c=Se()||M.active!==r.key;M.active=r.key,je(),xe(180,c),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),go();return}Kt=new AbortController,Te=!0,je();const l=await oi(i,Kt.signal);if(o!==Dn)return;const u=Vn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:l,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},l);if(!await mo(u))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===Dn&&!(i instanceof Cn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===Dn&&(Kt=void 0,Te=!1,je(),ja())}}window.addEventListener("hashchange",()=>{As().then(()=>{M.document?.key===os&&go()})});function Es(e){M.drawer=!0,ut(),en()}async function ku(e){const t=mn(e);if(!(e.design.sourceFormat==="json"||t.busy||de||ce||ke===e)){t.busy=!0;try{await ks(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,en()}}}let Yo;Ut.onchange=()=>{const e=Ut.files?.[0],t=Yo??ne();Yo=void 0,Ut.value="",!(!e||!t||!Qt(t))&&(Es(),wa(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ut.oncancel=()=>{Yo=void 0};k("check-open").onclick=()=>{Yo=ne(),Ut.click()};let Cs,$o=null;function Os(){nn.hidden=!0,Cs=void 0,($o&&!$o.closest("[hidden]")?$o:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=ne();e&&($o=Qi??document.activeElement,Cs=e,k("check-url").value=mn(e).url??"",nn.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=Os;nn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Os())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=Cs;if(!t||!Qt(t))return;const n=k("check-url").value.trim();mn(t).url=n,Os(),Es(),wa(t,async()=>({name:n,url:n,markdown:await zl(n)}))};k("check-open-sample").onclick=()=>{const e=ne();!e||!ws(e)||(Es(),ka(e,{name:"チェックリストのサンプル",markdown:Ql}))};k("check-close").onclick=()=>{const e=ne();e&&ku(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=ne();e&&xs("view",e)};k("open-url").onclick=()=>xs("url");k("open-text").onclick=()=>xs("text");k("source-cancel").onclick=()=>Oa();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Oa())};k("source-submit").onclick=async()=>{if(Zt||de||lt==="view"&&ke||k("source-dialog").hidden||lt==="view")return;Zt=!0,uo();const e=++fn,t=lt;Xo=new AbortController;try{const n=lt==="url"?new URL(lo().value.trim()).href:lo().value.trim();if(t==="url"&&M.document?.source?.kind==="url"&&M.document.source.url===n){Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,Zo(),je(),go();return}const o=t==="url"?await oi(n,Xo.signal):$l(Ft().value),i=o.markdown;if(e!==fn)return;const s=Vn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await mo(s))return;$e(""),t==="text"&&(fi=i),Zo()}catch(n){e===fn&&!(n instanceof Cn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===fn&&(Zt=!1,uo())}};k("layout-lock").onclick=()=>{ce||(ht.cancel(),qe=void 0,Se(),Mt=!Mt,ut(),hn())};k("selected-edges-only").onchange=()=>{const e=ne();!e||ce||de||ke===e||(ht.cancel(),qe=void 0,Se(),e.selectedEdgesOnly=k("selected-edges-only").checked,ao(),xe())};k("show-exceptions").onchange=()=>{const e=ne();!e||ce||de||ke===e||(ht.cancel(),qe=void 0,Se(),e.showExceptions=k("show-exceptions").checked,ao(),xe())};k("prefer-write").onchange=()=>{ce||(Se(),M.preferWrite=k("prefer-write").checked,hn(),xe())};k("theme").onclick=()=>{ce||(M.dark=!M.dark,ut(),xe())};k("drawer").onclick=()=>{ce||!ne()||(Se(),M.drawer=!M.drawer,je(),xe())};for(const[e,t]of[["in",Hs],["out",1/Hs]])k(e).onclick=()=>{const n=ne();if(n&&ke!==n){const o=Se(),i=yc({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,je(),xe(180,s)}};const Oe=k("viewport");function Ma(e,t){const n=ne();if(!n||de||ke===n)return;Se();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Bt();const i=Array.from(k("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),ao()}const dn=kc({read:()=>{const e=ne();return e&&!de&&e!==ke&&!Mt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[Oe.scrollLeft,Oe.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>ne()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=Oe.getBoundingClientRect(),t=e.left+Oe.clientLeft,n=e.top+Oe.clientTop,o={left:t,top:n,right:t+Oe.clientWidth,bottom:n+Oe.clientHeight};for(const[s,r]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const l=k(s),u=l.getBoundingClientRect();l.hidden||u.bottom<=n||u.top>=o.bottom||(r==="right"&&u.left>o.left&&u.left<o.right&&(o.right=u.left),r==="left"&&u.right>o.left&&u.right<o.right&&(o.left=u.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:Ma,pan:e=>{const t=ne();if(!t||t===ke||Mt)return;Se();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Vt(t),Oe.scrollLeft=t.scroll[0],Oe.scrollTop=t.scroll[1],Se(),Bt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),ht=vc(Oe,{nodeDrag:dn,read:()=>{const e=ne();return e&&!de&&ke!==e?{key:e.key,zoom:e.zoom,locked:Mt,scroll:[Oe.scrollLeft,Oe.scrollTop]}:void 0},position:e=>ne()?.positions[e],change:e=>{const t=ne();if(!t||de||ke===t)return;const n=t.scroll;let o=!1;e.node&&Ma(e.node.id,e.node.position),e.selected&&(ft().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Bn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?hn():e.zoom!==void 0&&Vt(t),e.scroll&&(Oe.scrollLeft=e.scroll[0],Oe.scrollTop=e.scroll[1]),Se(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Bt()},finish:()=>{const e=ne();e&&Vt(e),Se(),xe(180,!1)}}),Ns=()=>{ht.cancel(),qe=void 0,Se(),xe(0,!1)};window.addEventListener("blur",Ns);window.addEventListener("pagehide",Ns);document.addEventListener("visibilitychange",()=>{document.hidden&&Ns()});Oe.onscroll=()=>{Se()};let qe;wc(Oe,{read:()=>{const e=ne();return e&&!ce&&!de&&e!==ke?{zoom:e.zoom,scroll:[Oe.scrollLeft,Oe.scrollTop]}:void 0},change:e=>{const t=ne();!t||de||t===ke||(ht.cancel(),dn.cancel(),qe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Vt(t),Oe.scrollLeft=t.scroll[0],Oe.scrollTop=t.scroll[1],Se(!1),Bt(),xe(180,!1))}});Oe.onpointerdown=e=>{const t=ne(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||de||t===ke||n&&!Mt||(qe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[Oe.scrollLeft,Oe.scrollTop],node:n,moved:!1},Oe.setPointerCapture(e.pointerId))};Oe.onpointermove=e=>{if(qe&&qe.pointer===e.pointerId&&qe.key===ne()?.key&&ne()!==ke){const t=e.clientX-qe.x,n=e.clientY-qe.y;Math.hypot(t,n)>3&&(qe.moved=!0),Oe.scrollLeft=qe.scroll[0]-t,Oe.scrollTop=qe.scroll[1]-n,Se()}};Oe.onpointerup=e=>{if(!qe||qe.pointer!==e.pointerId)return;const t=ne(),n=qe;qe=void 0,Oe.hasPointerCapture?.(e.pointerId)&&Oe.releasePointerCapture(e.pointerId),t&&t!==ke&&n.key===t.key&&!n.moved&&n.node&&(ft().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Bt()),Bn(n.node),hn()),Se(),xe(180,!1)};Oe.onpointercancel=()=>{qe=void 0};Oe.addEventListener("lostpointercapture",e=>{e.target===Oe&&qe?.pointer===e.pointerId&&(qe=void 0)});let pi=!1;k("resize").onpointerdown=e=>{ce||(pi=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(pi){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==M.width&&(M.width=t,Bt()),ut()}};k("resize").onpointerup=()=>{pi=!1,xe(180,!1)};k("resize").onpointercancel=()=>{pi=!1,xe(180,!1)};k("resize").onkeydown=e=>{if(!ce&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,M.width+(e.key==="ArrowLeft"?20:-20)));t!==M.width&&(M.width=t,Bt()),ut(),xe(180,!1)}};window.addEventListener("resize",()=>{ut();const e=ne();e&&Vt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=ne();t&&Vt(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function Po(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=tn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");$n(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Hn=document.createElement("section");Hn.id="source-update-notice";Hn.className="info-bar";Hn.hidden=!0;Hn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Hn);let Sn;const La=new Set;let Mi=0,os,Li;function mi(){const e=M.document;Hn.hidden=!Sn||Sn.key!==e?.key||Sn.baseline!==e.design.markdown||La.has(e.key),k("source-update-refresh").disabled=ce||Te||de||!!(e&&Xt.has(e.key))}k("source-update-close").onclick=()=>{Sn&&La.add(Sn.key),mi()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function go(){const e=M.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Li===t)return;Li=t;const n=++Mi,o=e.key,i=e.source.url,s=e.design.markdown;try{const r=await ps(i);if(n!==Mi||M.document?.key!==o||M.document.design.markdown!==s||M.document.source?.kind!=="url"||M.document.source.url!==i)return;tn(r),Sn=r.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,mi()}catch{}finally{n===Mi&&(Li=void 0)}}Fe=Ld(At,{rightDrawer:{isOpen:()=>M.drawer,isReady:()=>!ce,setOpen:e=>{ce||(M.drawer=e,ut(),xe())}},capture:()=>{Se(),ht.cancel(),qe=void 0},business:()=>({key:M.document?.design.namedPlans?JSON.stringify([M.document.key,M.document.design.namedPlans.selected]):M.document?.key,design:M.document?.design,relatedChecks:M.tabs[0]?cl(M.tabs[0]):[],viewKey:ne()?.key,views:M.tabs.map(e=>({key:e.key,name:e.name,activity:Ho(e),object:Go(e)})),activities:M.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:M.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:M.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!M.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=M.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{es(e),Wo(e)},openObject:e=>{Aa(e),Wo(e)},openOverview:()=>{M.tabs[0]&&(Se(),Fe?.reopenBusinessOverview(),M.active=M.tabs[0].key,je(),xe())},activateView:e=>{M.tabs.some(t=>t.key===e)&&(Se(),M.active=e,je(),xe())},statePanel:e=>M.document?Pd(M.document.design,e,t=>{Fe?.activateBusiness(),es(t),Wo(t),Fe?.businessActivated()}):void 0,closeLegacyList:()=>{M.nodeDrawer=!1,ut()},refresh:()=>{ut(),Ki.update()}});const Iu=M;je();et();Hd().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const c of t.recovery??[])Po(c);if(t.document){const c={...t.document};Po(c),t.document.design=c.design,t.document.checks=c.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const c of t.tabs)Po(c)}const n=Xd(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(c=>({...c,name:n.document.name,design:c.design,checks:c.checks,source:c.source,draft:c.draft,edited:c.edited,handle:c.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const c of o.tabs)Po(c);if(new Set(o.tabs.map(c=>c.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const c of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!c||!c.positions||typeof c.positions!="object"||Array.isArray(c.positions)||c.selectedEdgesOnly!==void 0&&typeof c.selectedEdgesOnly!="boolean"||c.showExceptions!==void 0&&typeof c.showExceptions!="boolean"||c.hiddenNodes!==void 0&&(!Array.isArray(c.hiddenNodes)||!c.hiddenNodes.every(a=>typeof a=="string"))||c.viewInset!==void 0&&(!Array.isArray(c.viewInset)||c.viewInset.length!==2||!c.viewInset.every(a=>Number.isFinite(a)&&a>=0))||c.canvasOrigin!==void 0&&(!Array.isArray(c.canvasOrigin)||c.canvasOrigin.length!==2||!c.canvasOrigin.every(a=>Number.isFinite(a)&&a>=0))||!Array.isArray(c.scroll)||c.scroll.length!==2||!c.scroll.every(Number.isFinite)||!Number.isFinite(c.zoom)||c.zoom<.25||c.zoom>2.5||!Object.values(c.positions).every(a=>Array.isArray(a)&&a.length===2&&a.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:r,...l}=o,u=c=>({...c,hiddenNodes:c.hiddenNodes??(o.scopeOutside==="hide"?c.design.graph.nodes.filter(a=>!a.scope).map(a=>a.id):[])});M=$t({...l,tabs:o.tabs.map(u)},n.recovery,n.document,o.tabs.map(c=>{const{design:a,checks:f,source:d,draft:p,edited:g,handle:h,name:m,...A}=u(c);return A})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(M.sampleLayout={...o.sampleLayout,hiddenNodes:tn(hs).graph.nodes.filter(c=>!c.scope).map(c=>c.id)}),M.tabs.some(c=>c.key===M.active)||(M.active=M.tabs[0]?.key),ne()?.selected&&Bn(ne().selected),os=M.document?.key,je(),bs=!0}).catch(()=>{M=Iu,Un=!0,gs()}).finally(()=>{ce=!1,je(),et(),As().then(()=>{M.document?.key===os&&go()})});
