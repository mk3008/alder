import{L as Ar,D as Va,G as Ba,W as Ha,P as Ga,l as On,X as Er,C as Ka,n as Ja,S as Cr,o as Or,p as Nr,M as jr,q as Mr,s as Lr,t as ts,g as ns,r as ji,d as Dr,b as Wo,u as os,U as Rr,B as _a,v as Xa,w as Za,x as Ya,y as Pr,z as Tr,A as Mi,E as Qa,m as is,F as ec,H as qr,I as tc,j as nc,J as Us,K as oc,T as ic,N as sc,O as rc,R as ac,Q as cc,V as dc,Y as lc,_ as uc,$ as fc,a0 as pc,Z as Fs,k as mc,i as hc,h as bc,f as gc,a as yc,a1 as vc,a2 as wc,a3 as Wr,a4 as kc,a5 as Ic,e as Sc}from"./canvas-toolbar-aYSe-n1e.js";const xc={subsystems:{full:"サブシステム",icon:Ga},business:{full:"業務設計",icon:Ha},states:{full:"状態遷移",icon:Ba},concept:{full:"データ構造",icon:Va},tests:{full:"テスト仕様",icon:Ar}};function Li(e,t,n){const o=xc[t],i=document.createElement("span"),s=document.createElement("span"),r=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(On(o.icon,{"aria-hidden":"true","stroke-width":1.8})),r.className="view-tab-name",r.textContent=n,i.append(s,r),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function Di(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(On(Er,{"aria-hidden":"true","stroke-width":1.8})),t}function Ac(e){const t=On(e?Ka:Ja,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Ec(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,r=Math.max(0,Math.min(n,s+o*i));r!==s&&(e.scrollLeft=r,t.preventDefault())},{passive:!1})}function Cc(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const Oc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Vs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=Oc,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const r=On(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&r.classList.add(s),t.querySelector(o)?.append(r)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",Cr),n(".layout-lock",Or,"lock-closed"),n(".layout-lock",Nr,"lock-open"),n(".zoom-out",jr),n(".zoom-in",Mr)}function Bs(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Nc({model:e}){const t=Object.fromEntries(e.concepts.map(u=>[u.id,{name:u.name,note:u.description,fields:u.information.map(c=>["",c.name+(c.responsibleSubsystemId&&c.responsibleSubsystemId!==u.subsystemId?"（担当："+e.subsystems.find(a=>a.id===c.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind]),o=e.reviewGroups.map(u=>({id:u.id,name:u.title,purpose:u.description,activities:u.relatedActivityIds,concepts:Object.fromEntries(u.graph.nodes.map(c=>[c.conceptId,{name:c.name,note:c.description,fields:c.fields.map(a=>["",a]),sources:c.sources,sourceActivities:c.sourceActivityIds}])),relations:u.graph.edges.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind])})),i=u=>o.find(c=>c.id===u),s=(u,c)=>{const a=Object.fromEntries(u.nodes.map(b=>[b.id,{...c[b.conceptId],name:b.name,note:b.description,sources:b.sources,conceptId:b.conceptId,subsystemId:b.subsystemId,fields:b.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(b=>u.nodes.some(g=>g.subsystemId===b.id)).map(b=>({id:b.id,name:b.name})),d=u.handoffIds.map(b=>e.handoffs.find(g=>g.id===b)).map(b=>({id:b.id,from:b.fromSubsystemId,to:b.toSubsystemId,label:b.information,returning:b.flowDirection==="return"}));return{ids:u.nodes.map(b=>b.id),tables:a,edges:u.edges.map(b=>[b.fromViewId,b.toViewId,b.fromLabel,b.toLabel,b.kind]),regions:f,handoffs:d}};return{tables:t,edges:n,groups:o,findGroup:i,graph:u=>{const c=i(u);if(!c)throw Error("Unknown review group: "+u);const a=e.reviewGroups.find(b=>b.id===u),f=a.graph.subsystemViews;if(f)return s(f,c.concepts);const d=Object.keys(t).filter(b=>Object.hasOwn(c.concepts,b));return{ids:d,tables:c.concepts,edges:c.relations.filter(([b,g])=>d.includes(b)&&d.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function dt(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function jc(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",dt(o,"span",t),o.onclick=n,e.append(o),o}function Mc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Lc(e,t,n,o=()=>{},i=()=>{},s=[]){const r=n.contentFor(t.id);if(e.replaceChildren(),!r)return;dt(e,"p",r.description).className="review-description",dt(e,"h3","Activity");const l=document.createElement("ul");l.className="review-related-activities";for(const u of r.relatedActivities){const c=document.createElement("li"),a=s.find(d=>d.id===u.id&&d.name===u.name),f=jc(c,u.name,()=>{a&&i(a.id)});f.disabled=!a,f.setAttribute("aria-label",u.name+"を業務タブで開く"),l.append(c)}e.append(l),dt(e,"h3","情報の構造");for(const u of r.structureStatements){const c=document.createElement("section");c.className="review-structure",c.dataset.structure=u.id,dt(c,"h4",u.title),dt(c,"p",u.description),e.append(c)}dt(e,"h3","できること");for(const u of r.capabilities){const c=document.createElement("section");c.className="review-capability",c.dataset.capability=u.id,dt(c,"h4",u.title),dt(c,"p",u.description);for(const a of u.samples){const f=o(u.id,a.id),d=document.createElement("button");d.className="review-sample-link",d.type="button",d.dataset.sample=a.id,d.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+a.name,f?d.onclick=f.open:(d.disabled=!0,d.title="対応するテスト仕様へのリンクがありません"),c.append(d)}e.append(c)}dt(e,"h3","できないこと（業務上のルール）");for(const u of r.limitations){const c=document.createElement("section");c.className="review-limitation",dt(c,"h4",u.title),dt(c,"p",u.description),dt(c,"h5","理由"),dt(c,"p",u.reason),e.append(c)}}function an(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function Dc({model:e,business:t}){const n=r=>r.kind==="group"?e.subsystems.find(l=>l.id===r.id):e.handoffs.find(l=>l.id===r.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(r){const l=n(r);return l?l.activityIds.map(u=>t.activities.find(c=>c.id===u)).filter(Boolean):[]}function s(r,l){if(r.replaceChildren(),l.kind==="group"){const f=e.subsystems.find(b=>b.id===l.id);if(!f)return"";an(r,"p",f.purpose),an(r,"h3","扱う情報");const d=r.ownerDocument.createElement("ul");for(const b of f.information)an(d,"li",b);return r.append(d),an(r,"h3","まとまりの理由"),an(r,"p",f.reason),f.name}const u=e.handoffs.find(f=>f.id===l.id);if(!u)return"";an(r,"p",u.description),an(r,"h3","出元と受取先");const c=e.subsystems.find(f=>f.id===u.fromSubsystemId),a=e.subsystems.find(f=>f.id===u.toSubsystemId);return an(r,"p",`${c.name} → ${a.name}`),u.information}return{sections:o,activities:i,describe:s}}function Ii(e,t,n,o="right"){const i=o==="left",s=document.createElement("div");s.className=i?"explorer-drawer-resize":"concept-drawer-resize",s.tabIndex=0,s.setAttribute("role","separator"),s.setAttribute("aria-orientation","vertical"),s.setAttribute("aria-label",i?"エクスプローラーの幅":"補足情報の幅"),e.prepend(s);let r=i?280:440;try{const a=Number(sessionStorage.getItem(n));Number.isFinite(a)&&a>=280&&(r=a)}catch{}const l=i?Array.from(t.querySelectorAll("#formattedMarkdownDrawer,.concept-related,.spec-related")):[t.querySelector("#design-explorer")].filter(a=>!!a),u=()=>{let a=t.clientWidth||innerWidth;if(innerWidth>800){const f=l.find(d=>!d.hidden);f&&(a-=f.offsetWidth)}return Math.max(280,Math.min(1e3,a-(innerWidth>800?240:16)))},c=(a,f=!1)=>{if(r=Math.max(280,Math.min(u(),a)),e.style.setProperty(i?"--explorer-drawer-width":"--concept-drawer-width",r+"px"),s.setAttribute("aria-valuemin","280"),s.setAttribute("aria-valuemax",String(u())),s.setAttribute("aria-valuenow",String(Math.round(r))),f)try{sessionStorage.setItem(n,String(r))}catch{}};if(s.onkeydown=a=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(a.key))return;a.preventDefault();const f=a.key==="ArrowLeft"?-1:1;c(a.key==="Home"?280:a.key==="End"?u():r+f*(i?40:-40),!0)},s.onpointerdown=a=>{if(a.button!==0)return;a.preventDefault();const f=a.clientX,d=r;s.setPointerCapture(a.pointerId),s.classList.add("resizing"),s.onpointermove=b=>c(d+(i?b.clientX-f:f-b.clientX)),s.onpointerup=()=>{s.onpointermove=null,s.onpointerup=null,s.onpointercancel=null,s.classList.remove("resizing"),c(r,!0)},s.onpointercancel=s.onpointerup},typeof ResizeObserver<"u"){const a=new ResizeObserver(()=>c(r));a.observe(t);for(const f of l)a.observe(f)}window.addEventListener("resize",()=>c(r)),c(r)}const Rc=260,Pc=68,Tc="http://www.w3.org/2000/svg",Wt=(e,t,n={})=>{const o=e.createElementNS(Tc,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function qc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(On(Rr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Wc(e,{model:t,business:n},o,i,s){const r=t.reviewGroups,l=t.subsystems,u=t.presentation.landscapeRelationships.map(I=>{const y=r.find(R=>R.id===I.from),z=r.find(R=>R.id===I.to);if(!y||!z||y.subsystemId!==z.subsystemId||!t.presentation.reviewBoundaries.some(R=>R.from===I.from&&R.to===I.to))throw Error("Unknown overview relationship: "+I.from+" -> "+I.to);return I}),c=t.handoffs.map(I=>{if(!["forward","return"].includes(I.flowDirection))throw Error("Unknown overview handoff direction: "+I.id);return{id:I.id,from:I.fromSubsystemId,to:I.toSubsystemId,label:I.information,returning:I.flowDirection==="return"}});if(new Set(c.map(I=>I.id)).size!==c.length)throw Error("Duplicate overview handoff");for(const I of c)if(!l.some(y=>y.id===I.from)||!l.some(y=>y.id===I.to)||I.from===I.to||!I.label.trim())throw Error("Unknown overview handoff: "+I.id);for(const I of r){if(!l.some(y=>y.id===I.subsystemId))throw Error("Unknown overview subsystem: "+I.id);if(!n.roles?.some(y=>y.id===I.reviewer.roleId))throw Error("Unknown overview reviewer: "+I.id)}const a=l.flatMap(I=>r.filter(y=>y.subsystemId===I.id)),f=new Map;let d=0;for(const[I,y]of l.entries())for(const z of a.filter(R=>R.subsystemId===y.id))f.set(z.id,[80+d*170,100+d*120+I*64]),d++;const b=ts(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let h,p;try{const I=JSON.parse(localStorage.getItem(g)||"null"),y=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),z=!I&&y?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,R=I??z;if(R){typeof R.zoom=="number"&&Number.isFinite(R.zoom)&&(b.zoom=Math.max(.25,Math.min(2.5,R.zoom))),Array.isArray(R.scroll)&&R.scroll.length===2&&R.scroll.every(W=>typeof W=="number"&&Number.isFinite(W))&&(b.scroll=R.scroll),typeof R.locked=="boolean"&&(b.locked=R.locked);for(const[W,K]of Object.entries(R.positions??{}))r.some(S=>S.id===W)&&Array.isArray(K)&&K.length===2&&K.every(S=>typeof S=="number"&&Number.isFinite(S))&&b.positions.set(W,[K[0],K[1]])}const A=R?.selection,T=A?.kind==="node"?t.concepts.find(W=>W.id===A.id)?.subsystemId:A?.id,q=A?.kind==="node"?"group":A?.kind;typeof T=="string"&&(q==="model"&&r.some(W=>W.id===T)||q==="group"&&l.some(W=>W.id===T)||q==="connection"&&c.some(W=>W.id===T))&&(p={kind:q,id:T}),p?.kind==="model"&&(b.selected=p.id)}catch{}const x=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:b.zoom,scroll:b.scroll,locked:b.locked,positions:Object.fromEntries(b.positions),selection:p}))}catch{}},M=I=>{if(!I&&!p)return;p=I,b.selected=I?.kind==="model"?I.id:void 0;const y=h?.querySelector(".diagram-world>svg");y&&w(y),x()},w=I=>{const y=Wo(u,b.selected),z=Wo(c,p?.kind==="group"?p.id:void 0);for(const R of r){const A=I.querySelector(`[data-node="${R.id}"]`);A?.setAttribute("class","node graph-shape state-shape"+y.nodeClasses(R.id)),A?.setAttribute("aria-pressed",String(b.selected===R.id))}for(const R of l){const A=I.querySelector(`[data-subsystem="${R.id}"]`);A?.setAttribute("class","subsystem-overview-group"+z.nodeClasses(R.id)),A?.querySelector("button")?.setAttribute("aria-pressed",String(p?.kind==="group"&&p.id===R.id))}for(const R of u){const A=I.querySelector(`[data-overview-from="${R.from}"][data-overview-to="${R.to}"]`);A?.setAttribute("class","edge"+(y.related(R)?" review-related":"")),A?.setAttribute("marker-end",`url(#overview-${y.related(R)?"related-arrow":"arrow"})`)}for(const R of c){const A=z.related(R)||p?.kind==="connection"&&p.id===R.id,T=I.querySelector(`[data-handoff-id="${R.id}"]`);T?.setAttribute("class","edge"+(R.returning?" exception":"")+(A?" review-related":"")),T?.setAttribute("marker-end",`url(#overview-${A?"related-arrow":"arrow"})`),I.querySelector(`[data-handoff-label="${R.id}"]`)?.classList.toggle("review-related",!!A)}I.querySelectorAll("[data-exception-paint]").forEach(R=>R.remove());for(const R of Array.from(I.querySelectorAll("[data-handoff-id].exception")))os(I,R,{path:R.getAttribute("d")},{"data-overview-return-paint":R.getAttribute("data-handoff-id")})};return h=Lr(e,I=>{const y=a.map(q=>{const W=I.positions.get(q.id)??f.get(q.id);return{id:q.id,x:W[0],y:W[1],width:Rc,height:Pc}}),z=Wt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});z.append(ns("overview-"));let R=0,A=0;const T=[];for(const q of l){const W=y.filter(ie=>r.find(me=>me.id===ie.id)?.subsystemId===q.id);if(!W.length)continue;const K=Math.min(...W.map(ie=>ie.x))-30,S=Math.min(...W.map(ie=>ie.y))-48,N=Math.max(...W.map(ie=>ie.x+ie.width))-K+30,j=Math.max(...W.map(ie=>ie.y+ie.height))-S+30;T.push({id:q.id,x:K,y:S,width:N,height:j});const B=Wt(e,"g",{"data-subsystem":q.id,"aria-label":q.name}),re=Wt(e,"rect",{x:K,y:S,width:N,height:j,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});re.addEventListener("click",()=>M({kind:"group",id:q.id})),B.append(re);const Z=Wt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:K+8,y:S+3,width:N-16,height:36}),ue=e.createElement("button");ue.type="button",ue.className="subsystem-overview-region-title",ue.setAttribute("aria-label",q.name+"を選択"),ue.textContent=q.name,ue.onclick=()=>M({kind:"group",id:q.id}),Z.append(ue),B.append(Z),z.append(B),R=Math.max(R,K+N+40),A=Math.max(A,S+j+40)}for(const[q,W]of c.entries()){if(!T.some(B=>B.id===W.from)||!T.some(B=>B.id===W.to))throw Error("Missing overview handoff region: "+W.id);const K=Math.max(30,W.label.length*12),S=ji({from:W.from,to:W.to,nodes:T,index:q,kind:"input",matrix:{returning:W.returning,captionLane:0},labelWidth:K,labelHeight:18}),N=Wt(e,"path",{d:S.path,class:"edge"+(W.returning?" exception":""),"data-handoff-id":W.id,"data-from-subsystem":W.from,"data-to-subsystem":W.to,"data-flow-direction":W.returning?"return":"forward","marker-end":"url(#overview-arrow)"});z.append(N);const j=Wt(e,"text",{x:S.label[0]-K/2,y:S.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":W.id});j.textContent=W.label,j.addEventListener("pointerdown",B=>B.stopPropagation()),j.addEventListener("pointerup",B=>B.stopPropagation()),j.addEventListener("click",()=>M({kind:"connection",id:W.id})),j.addEventListener("keydown",B=>{(B.key==="Enter"||B.key===" ")&&(B.preventDefault(),M({kind:"connection",id:W.id}))}),z.append(j),R=Math.max(R,S.bounds.right+40,S.label[0]+K/2+30),A=Math.max(A,S.bounds.bottom+40,S.label[1]+30)}for(const[q,W]of u.entries()){const K=ji({from:W.from,to:W.to,nodes:y,index:q,kind:"input",labelWidth:0,labelHeight:0}),S=Wt(e,"path",{d:K.path,class:"edge","data-overview-from":W.from,"data-overview-to":W.to,"marker-end":"url(#overview-arrow)"});z.append(S),R=Math.max(R,K.bounds.right+40),A=Math.max(A,K.bounds.bottom+40)}for(const q of y){const W=r.find(me=>me.id===q.id),K=n.roles.find(me=>me.id===W.reviewer.roleId),S=Wt(e,"g",{role:"button",tabindex:0,"aria-label":W.title+"を選択","aria-pressed":"false","data-node":q.id,"data-review-group":q.id,"data-subsystem-id":W.subsystemId,class:"node graph-shape state-shape"}),N=Dr(e,q);N.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),S.append(N,Wt(e,"rect",{x:q.x,y:q.y,width:q.width,height:q.height,rx:8,class:"state-diagram-node"}));const B=Wt(e,"foreignObject",{x:q.x,y:q.y,width:q.width,height:q.height}),re=e.createElement("div");re.className="subsystem-overview-card";const Z=qc(e,K.color),ue=e.createElement("span");ue.className="subsystem-overview-labels",ue.title=W.title+" — "+K.name;for(const[me,E,P]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",W.title],["small","subsystem-overview-role",K.name]]){const U=e.createElement(me);U.className=E,U.textContent=P,ue.append(U)}const ie=e.createElement("button");ie.type="button",ie.className="subsystem-overview-open",ie.setAttribute("aria-label",W.title+"の詳細タブを開く"),ie.title="詳細タブを開く",ie.textContent="開く",ie.onpointerdown=me=>me.stopPropagation(),ie.onpointerup=me=>me.stopPropagation(),ie.onclick=me=>{me.stopPropagation(),i(W.id)},re.append(Z,ue,ie),B.append(re),S.append(B),S.addEventListener("click",()=>M({kind:"model",id:q.id})),S.addEventListener("keydown",me=>{(me.key==="Enter"||me.key===" ")&&(me.preventDefault(),M({kind:"model",id:q.id}))}),z.append(S)}return z.setAttribute("viewBox",`0 0 ${R} ${A}`),w(z),z},b,x,()=>M(void 0)),h.classList.add("subsystem-overview-canvas"),h.addEventListener("click",x),h.addEventListener("pointerup",()=>queueMicrotask(x)),h.querySelector(".diagram-viewport")?.addEventListener("scroll",x),{root:h,selected:()=>b.selected,selection:()=>p,restore:()=>{const I=()=>{const y=h.querySelector(".diagram-viewport");y.scrollLeft=b.scroll[0],y.scrollTop=b.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(I):I()}}}function zc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(r=>r.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function $c({model:e,business:t}){const n=g=>{const h=t.activities.find(p=>p.id===g);if(!h)throw Error("Unknown activity: "+g);return h},o=g=>{const h=t.roles?.find(p=>p.id===g);if(!h)throw Error("Unknown role: "+g);return h.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(h=>{const p=n(h);return{id:p.id,name:p.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(h=>({...h,samples:h.samples.map(zc)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(h=>h.id===g),r=(g,h)=>s(g)?.capabilities.find(p=>p.samples.some(x=>x.id===h)),l=i.flatMap(g=>g.capabilities.flatMap(h=>h.samples.map(p=>({...p,group:g.id})))),u=["yellow","cyan","green","blue","purple","orange"];function c(g,h,p){let x=p.get(h);if(x||(x=u[p.size]??`extra-${p.size}`,p.set(h,x)),g.dataset.sampleKey=h,g.dataset.keyTone=x,g.className="data-example-key",x.startsWith("extra-")){const M=(Number(x.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${M} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${M} 24% 25%)`)}}const a=g=>l.filter(h=>h.group===g),f=(g,h)=>a(g).find(p=>p.id===h);function d(g,h,p){const x=g.ownerDocument.createElement(h);return x.textContent=p,g.append(x),x}function b(g,h,p,x,M){const w=g.ownerDocument,D=f(h.id,p);if(!D)throw Error("Unknown data example: "+p);g.replaceChildren(),g.dataset.dataExample=p;const I=new Map;e.presentation.sampleCaption&&(d(g,"p",e.presentation.sampleCaption).className="data-example-caption");const y=s(h.id)?.capabilities??[],z=M?.capabilityId?y.filter(W=>W.id===M.capabilityId):y;if(M?.capabilityId&&!z.some(W=>W.samples.some(K=>K.id===p)))throw Error("Sample does not belong to capability: "+p);const R=r(h.id,p);g.dataset.capability=R.id;const A=()=>{d(g,"h2",M?.heading?.trim()||R.title),M?.renderSpecification?M.renderSpecification(g):d(g,"p",R.description).className="data-example-capability"};M?.capabilityId&&!M.hideCapability&&A();const T=w.createElement("label");T.className="data-example-picker",d(T,"span","場面");const q=w.createElement("select");q.setAttribute("aria-label","データ例の場面");for(const W of z){let K=q;if(!M?.capabilityId){const S=w.createElement("optgroup");S.label=W.title,q.append(S),K=S}for(const S of W.samples){if(M?.sampleIds&&!M.sampleIds.includes(S.id))continue;const N=w.createElement("option");N.value=S.id,N.textContent=S.name,K.append(N)}}if(q.value=p,q.onchange=()=>x(q.value),T.append(q),(!M?.hideSinglePicker||q.options.length>1)&&g.append(T),!M?.capabilityId&&!M?.hideCapability&&A(),d(g,"h3",D.name).className="data-example-scene",M?.collapseScenario&&D.when){const W=w.createElement("details");W.className="data-example-context",d(W,"summary","場面の背景"),d(W,"p",D.when).className="data-example-when",g.append(W)}else d(g,"p",D.when).className="data-example-when";d(g,"p",D.meaning).className="data-example-meaning";for(const W of D.blocks){const K=w.createElement("section");K.className="data-example-block",K.dataset.exampleCard=W.card,d(K,"h3",h.concepts[W.card].name);const S=w.createElement("div");S.className="data-example-table",S.tabIndex=0,S.setAttribute("role","region"),S.setAttribute("aria-label",h.concepts[W.card].name+"のデータ表");const N=w.createElement("table");N.setAttribute("aria-label",h.concepts[W.card].name+"のデータ例");const j=w.createElement("caption");j.textContent=h.concepts[W.card].name+"に入る情報",N.append(j);const B=w.createElement("thead"),re=w.createElement("tr");for(const ue of W.columns)d(re,"th",ue).setAttribute("scope","col");B.append(re),N.append(B);const Z=w.createElement("tbody");for(const[ue,ie]of W.rows.entries()){const me=w.createElement("tr");for(const[E,P]of ie.entries()){const U=d(me,"td",String(P)),de=W.keyIds[ue][E];de&&(c(U,de,I),U.title=W.columns[E]+"："+P)}Z.append(me)}N.append(Z),S.append(N),K.append(S),W.rows.length||d(K,"p",W.empty??"データはありません。"),g.append(K)}D.note&&(d(g,"p",D.note).className="data-example-note")}return{reviewContents:i,dataExamples:l,contentFor:s,capabilityFor:r,examplesFor:a,findDataExample:f,renderDataExample:b}}function ss(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function Uc(e,t,n){return ss(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Fc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function xn(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const r=(l,u)=>{for(const c of u.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(c.startsWith("**")&&c.endsWith("**")){const a=document.createElement("strong");a.textContent=c.slice(2,-2),l.append(a)}else if(c.startsWith("`")&&c.endsWith("`")){const a=document.createElement("code");a.textContent=c.slice(1,-1),l.append(a)}else l.append(document.createTextNode(c))};for(const l of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const u=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(l);if(u&&!o){o=u[1],s=void 0;const d=document.createElement("pre");i=document.createElement("code"),d.append(i),n.append(d);continue}if(u&&u[1][0]===o[0]&&u[1].length>=o.length&&!u[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(l+`
`));continue}if(!l.trim()){s=void 0;continue}const c=/^(#{1,6}) (.*)$/.exec(l),a=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(l);if(a){s||(s=document.createElement(/^\s*\d/.test(l)?"ol":"ul"),n.append(s));const d=document.createElement("li");r(d,a[1]),s.append(d);continue}s=void 0;const f=document.createElement(c?"h"+c[1].length:"p");r(f,c?c[2]:l),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Ne={type:"string"},X={type:"string",minLength:1,pattern:"\\S"},J={type:"string",pattern:"^[A-Za-z0-9_-]+$"},pn=e=>({anyOf:[e,{type:"null"}]}),Q=e=>({type:"array",items:e}),oe=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Vc=e=>({$ref:"#/$defs/"+e}),Rn=Q({anyOf:[oe({kind:{enum:["text"]},value:Ne}),oe({kind:{enum:["reference"]},targetId:J,label:Ne}),oe({kind:{enum:["link"]},uri:X,label:Ne})]}),Hs=oe({id:J,name:X,scope:{type:"boolean"}}).properties,Bc=oe({id:J,kind:{enum:["input","output","business-exception","object-exception"]},fromId:J,toId:J,label:X}),Hc=oe({id:J,sourceId:J,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:Q(J),unresolvedTargets:Q(X),summary:X,content:X}),Ri=oe({id:J,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:X,title:X,preface:Ne,scope:Ne,objects:Q(oe({...Hs,icon:X,information:Q(X)})),activities:Q(oe({...Hs,why:X,when:X,who:X,where:X,procedure:X,exception:pn(X),result:X,problem:pn(X),painLevel:pn({enum:["Low","Medium","High"]})})),relations:Q(Bc),findings:Q(Hc)}),Gc=oe({id:J,name:X,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),zr=oe({...Ri.properties,schemaVersion:{enum:["0.2"]},roles:Q(Gc),activities:Q(oe({...Ri.properties.activities.items.properties,roleId:pn(J)}))}),Kc=oe({...zr.properties,schemaVersion:{enum:["0.3"]},exceptions:Q(oe({id:J,activityId:J,name:X,description:Ne}))}),Jc=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Rn])),_c=oe({id:J,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:X,title:X,basedOn:oe({documentId:J,revision:X,verification:{enum:["unverified"]}}),intro:Rn,index:Q(oe({activityId:J,purpose:Ne,connections:Ne,checkIds:Q(J)})),sections:Q(oe({id:J,activityId:pn(J),title:X,preamble:Rn})),guarantees:Q(oe({id:J,sectionId:J,title:X,blocks:Q({anyOf:[oe({kind:{enum:["prose"]},content:Rn}),oe({kind:{enum:["example"]},exampleId:J})]})})),examples:Q(oe({id:J,guaranteeId:J,columns:Q(X),rows:Q(Q(Rn))})),items:Q(oe({id:J,checkId:J,title:X,detailSummary:Ne,sectionId:J,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:oe(Jc,[])})),notes:Q(oe({id:J,title:X,content:Rn}))}),rs=oe({id:J,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:X,title:X,basedOn:oe({documentId:J,revision:X,verification:{enum:["unverified"]}}),objectId:J,states:Q(oe({id:J,name:X})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:X,transitions:Q(oe({id:J,sourceId:X,fromId:X,activityId:J,event:pn(X),exception:pn(X),condition:X,toId:X,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:X,note:X}))}),Gs=Object.fromEntries(Object.entries({...rs.properties.transitions.items.properties,exceptionId:pn(J)}).filter(([e])=>e!=="exception")),Xc=oe({...rs.properties,schemaVersion:{enum:["0.2"]},transitions:Q(oe({...Gs,conditionLabel:X},Object.keys(Gs)))}),as=oe({documentId:J,revision:X,targetType:X,targetId:J,section:X}),Zc=oe({id:J,name:X,responsibilityStatus:X,responsibleSubsystemId:J},["id","name"]),Yc=oe({id:J,name:X,subsystemId:J,information:Q(Zc),reason:Ne,description:Ne,businessObjectIds:Q(J),activityLinks:Q(oe({activityId:J,uses:Q(X)})),sourceRefs:Q(as),reviewState:X}),Qc=oe({id:J,fromConceptId:J,toConceptId:J,fromPerTarget:X,toPerSource:X,condition:Ne,reviewState:X,sourceRefs:Q(as),fromLabel:X,toLabel:X,kind:{enum:["down","reference"]}}),ed=oe({id:J,name:X,purpose:Ne,information:Q(X),reason:Ne,activityIds:Q(J),reviewState:X}),td=oe({id:J,fromSubsystemId:J,toSubsystemId:J,information:X,description:Ne,activityIds:Q(J),flowDirection:{enum:["forward","return"]},reviewState:X}),nd=oe({columnId:J,value:{anyOf:[Ne,{type:"number"}]},linkId:X},["columnId","value"]),od=oe({card:J,columns:Q(oe({id:J,name:X,informationId:J})),rows:Q(oe({id:J,cells:Q(nd)})),empty:Ne},["card","columns","rows"]),Pi=oe({id:J,name:X,when:Ne,meaning:Ne,blocks:Q(od),note:Ne},["id","name","when","meaning","blocks"]),Ti=oe({id:J,title:X,description:Ne,meta:{},samples:Q(Pi)}),id=oe({...Pi.properties,checkIds:{...Q(J),minItems:1,uniqueItems:!0}},[...Pi.required,"checkIds"]),sd=oe({decisionExampleIds:Q(J),decisionCheckIds:Q(J),resultCheckIds:Q(J),sampleIds:Q(J)}),rd=oe({...Ti.properties,samples:Q(id),testSpecification:sd},[...Object.keys(Ti.properties)]),ad=oe({id:J,title:X,description:Ne,reason:Ne,meta:{}}),cd=oe({conceptId:J,name:X,fields:Q(X),description:Ne,sources:Q(X),sourceActivityIds:Q(J)}),dd=oe({id:J,fromConceptId:J,toConceptId:J,relationIds:Q(J),scope:Ne,fromLabel:X,toLabel:X,kind:{enum:["down","reference"]}}),ld=oe({id:J,conceptId:J,subsystemId:J,name:X,description:Ne,sources:Q(X),fields:Q(oe({name:X,informationId:J}))}),ud=oe({id:J,fromViewId:J,toViewId:J,relationIds:Q(J),fromLabel:X,toLabel:X,kind:{enum:["down","reference"]}}),$r=oe({nodes:Q(ld),edges:Q(ud),handoffIds:Q(J)}),Ur=oe({id:J,subsystemId:J,title:X,description:Ne,reviewer:oe({roleId:J}),relatedActivityIds:Q(J),graph:oe({conceptIds:Q(J),nodes:Q(cd),edges:Q(dd),subsystemViews:$r},["conceptIds","nodes","edges"]),structureStatements:Q(oe({id:J,title:X,description:Ne,sampleIds:Q(J),sourceRefs:Q(as)})),capabilities:Q(Ti),limitations:Q(ad),meta:oe({questions:Q(X),hypotheses:{}},["questions"])}),fd=oe({...Ur.properties,capabilities:Q(rd)}),Fr=oe({id:J,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:X,basedOn:oe({documentId:J,revision:X,verification:{enum:["unverified"]}}),relatedStates:Q(oe({documentId:J,revision:X,verification:{enum:["unverified"]}})),subsystems:Q(ed),concepts:Q(Yc),relations:Q(Qc),handoffs:Q(td),reviewGroups:Q(Ur),benefits:Q(X),considerations:Q(X),reviewPoints:Q(X),meta:{},presentation:oe({activityViews:{},creatorActivityIds:{},sampleCaption:Ne,subsystemViews:$r,landscapeRelationships:Q(oe({from:J,to:J})),reviewBoundaries:Q(oe({from:J,to:J,label:Ne,promise:Ne}))},["landscapeRelationships","reviewBoundaries"])}),pd=oe({...Fr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:Q(fd)}),Ao=(e,t)=>oe({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:X,documents:Q({anyOf:t.map(Vc)}),sources:Q(oe({documentId:J,revision:X,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Ne})),externalDocuments:Q(oe({id:J,kind:{enum:["businessDesign"]},revision:X,activities:Q(oe({id:J,name:X}))})),diagnostics:Q(X)}),zo={anyOf:[Ao("0.1",["businessDesign","checkItems"]),Ao("0.2",["businessDesign","checkItems","stateTransition"]),Ao("0.3",["businessDesignRoles","checkItems","stateTransition"]),Ao("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Ri,businessDesignRoles:zr,businessDesignStructured:Kc,checkItems:_c,stateTransition:rs,stateTransitionStructured:Xc,conceptModel:Fr,checkedConceptModel:pd}},H=(e,t)=>{if(!e)throw Error(t)};function Vr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const r=e[t++];if(r==='"')return JSON.parse(e.slice(s,t));r==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{H(s<=64,"JSON depth limit"),n();const r=e[t];if(r==='"'){o();return}if(r==="{"){t++,n();const u=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),H(e[t]==='"',"JSON object key required");const c=o();H(!u.has(c),"Duplicate JSON key: "+c),u.add(c),n(),H(e[t++]===":","JSON colon required"),i(s+1),n();const a=e[t++];if(a==="}")return;H(a===",","JSON comma required")}throw Error("Truncated object")}if(r==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const u=e[t++];if(u==="]")return;H(u===",","JSON array comma required")}throw Error("Truncated array")}const l=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;H(t>l,"JSON value required"),JSON.parse(e.slice(l,t))};return i(),n(),H(t===e.length,"Trailing JSON content"),JSON.parse(e)}function kn(e,t=zo,n="$"){if(t.$ref)return kn(e,zo.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{kn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&H(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;H(o===t.type,"Invalid type at "+n)}if(t.minLength&&H(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&H(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])H(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))H(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),kn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>kn(o,t.items,n+"["+i+"]"))}function md(e){const t=new Map,n=new Map,o=new Map,i=(s,r,l)=>{H(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,r.id),o.set(s.id,l)};for(const s of e.documents){i(s,s,"document");for(const[r,l]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[r]??[])i(u,s,l)}for(const s of e.externalDocuments){i(s,s,"document");for(const r of s.activities)i(r,s,"activity")}return{map:t,owner:n,types:o}}function $o(e){return kn(e),Br(e)}function Wn(e,t){const n=new Set(e.items.map(r=>r.id)),o=new Set,i=e.guarantees.find(r=>r.id===t.guaranteeId),s=r=>{if(Array.isArray(r)){for(const l of r)s(l);return}if(r&&typeof r=="object"){r.kind==="reference"&&n.has(r.targetId)&&o.add(r.targetId);for(const l of Object.values(r))l&&typeof l=="object"&&s(l)}};s(t.rows);for(const r of i?.blocks??[])r.kind==="prose"&&s(r.content);for(const r of e.items)(r.fields.guarantee??[]).some(u=>u.kind==="reference"&&(u.targetId===t.id||u.targetId===t.guaranteeId))&&o.add(r.id);return[...o]}function Br(e,{allowUnresolvedFindings:t=!1}={}){H(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=md(e),s=[...e.diagnostics],r=new Set;for(const d of e.sources)if(d.uri){const b=new URL(d.uri);H(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const l=(d,b,g)=>(H(n.has(d),"Dangling reference: "+d),b&&H(i.get(d)===b,"Reference type mismatch: "+d),g&&H(o.get(d)===g,"Cross-document mismatch: "+d),n.get(d)),u=d=>d?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),c=(d,b)=>{for(const g of d)if(g.kind==="reference"&&(l(g.targetId,null,b),H(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const h=new URL(g.uri);H(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe external link")}};for(const d of e.documents)if(H(e.formatVersion!=="0.1"||d.kind!=="stateTransition","State documents require formatVersion 0.2"),d.kind==="businessDesign"){H(d.activities.length>0,"Activity required");const b=[...d.objects,...d.activities].map(p=>p.name);H(new Set(b).size===b.length,"Duplicate visible name"),H(b.every(p=>p===p.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>p.includes(x))),"Invalid Graph-visible name");for(const p of d.objects)H(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.icon),"Invalid icon");if(["0.2","0.3"].includes(d.schemaVersion)){H(new Set(d.roles.map(p=>p.name)).size===d.roles.length,"Duplicate Role name"),H(d.roles.every(p=>p.name===p.name.trim()&&!/[\r\n]/.test(p.name)),"Invalid Role name");for(const p of d.activities)p.roleId!==null?l(p.roleId,"role",d.id):r.add("Role未確定: "+p.id+" — "+p.who)}for(const p of d.activities)H(p.problem===null==(p.painLevel===null),"Problem/Pain pair mismatch");for(const p of d.exceptions??[])l(p.activityId,"activity",d.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},h=new Set;for(const p of d.relations){l(p.fromId,g[p.kind][0],d.id),l(p.toId,g[p.kind][1],d.id);const x=JSON.stringify([p.kind,p.fromId,p.toId,p.label]);H(!h.has(x),"Duplicate relation"),h.add(x)}H(new Set(d.findings.map(p=>p.sourceId)).size===d.findings.length,"Duplicate Finding source ID");for(const p of d.findings){H(p.scope==="items"?p.targetIds.length+p.unresolvedTargets.length>0:!p.targetIds.length&&!p.unresolvedTargets.length,"Finding scope mismatch"),H(new Set(p.targetIds).size===p.targetIds.length,"Duplicate Finding target");for(const x of p.targetIds)l(x,null,d.id),H(["object","activity"].includes(i.get(x)),"Invalid Finding target");p.unresolvedTargets.length&&(H(t,"Unresolved Finding target: "+p.sourceId),s.push("Finding参照未決: "+p.sourceId))}}else if(d.kind==="stateTransition"){const b=l(d.basedOn.documentId,"document");H(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),H(b.revision===d.basedOn.revision,"Stale State source revision"),l(d.objectId,"object",b.id),H(!e.documents.some(h=>h!==d&&h.kind==="stateTransition"&&h.objectId===d.objectId),"Duplicate Object state declaration"),H(d.states.length>0&&new Set(d.states.map(h=>h.name)).size===d.states.length,"Duplicate/empty state names"),H(d.states.every(h=>!h.name.startsWith("@")),"Reserved state name"),H(d.transitions.length<=1e3,"State transition row budget"),H(new Set(d.transitions.map(h=>h.sourceId)).size===d.transitions.length,"Duplicate transition source ID");const g=new Map;for(const h of d.transitions){h.fromId!=="@new"&&l(h.fromId,"state",d.id),["@unknown","@none"].includes(h.toId)||l(h.toId,"state",d.id);const p=l(h.activityId,"activity",b.id),x=JSON.stringify([h.fromId,h.activityId,h.condition.trim().replace(/\s+/gu," ")]);if(H(!g.has(x),"Duplicate state transition condition: "+g.get(x)+" / "+h.sourceId),g.set(x,h.sourceId),e.formatVersion==="0.4")if(H(h.path!=="normal"||h.exceptionId===null,"Normal transition cannot reference an exception"),h.exceptionId!==null){const M=l(h.exceptionId,"exception",b.id);H(M.activityId===p.id,"Exception Activity mismatch")}else h.path==="exception"&&H(s.includes("例外参照未決: "+h.id),"Unresolved exception requires a diagnostic");else H(h.path!=="normal"||h.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+h.id);H(h.effect!=="unchanged"||h.fromId===h.toId,"Unchanged state mismatch"),H(h.effect!=="change"||!h.toId.startsWith("@")&&h.fromId!==h.toId,"Invalid changed state"),H(h.effect!=="no-create"||h.fromId==="@new"&&h.toId==="@none","Invalid no-create transition"),H(h.effect!=="constraint"||h.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+d.id)}else if(d.kind==="conceptModel"){const b=l(d.basedOn.documentId,"document");H(b.kind==="businessDesign"&&b.revision===d.basedOn.revision,"Concept source must be the matching in-package BD revision"),H(!e.documents.some(A=>A!==d&&A.kind==="conceptModel"&&A.basedOn.documentId===b.id),"Duplicate Concept model for Business Design");const g=(A,T)=>{const q=new Map;for(const W of A)H(!q.has(W.id),"Duplicate "+T+" ID: "+W.id),q.set(W.id,W);return q},h=g(d.subsystems,"subsystem"),p=g(d.concepts,"concept"),x=g(d.relations,"concept relation"),M=g(d.reviewGroups,"review group"),w=g(d.handoffs,"handoff"),D=g(d.concepts.flatMap(A=>A.information),"concept information"),I=(A,T,q)=>(H(A.has(T),"Unknown "+q+": "+T),A.get(T)),y=A=>l(A,"activity",b.id),z=A=>{const T=l(A.documentId,"document");H(T.revision===A.revision,"Stale Concept source revision");const q=T.id===b.id,W=T.kind==="stateTransition"&&T.basedOn.documentId===b.id&&d.relatedStates.some(K=>K.documentId===T.id&&K.revision===T.revision);H(q||W,"Concept source must refer to its Business Design or a declared State"),l(A.targetId,A.targetType,T.id)};for(const A of d.relatedStates){const T=l(A.documentId,"document");H(T.kind==="stateTransition"&&T.revision===A.revision&&T.basedOn.documentId===b.id,"Invalid Concept state reference")}for(const A of d.subsystems)for(const T of A.activityIds)y(T);for(const A of d.concepts){I(h,A.subsystemId,"subsystem");for(const T of A.information)T.responsibleSubsystemId&&I(h,T.responsibleSubsystemId,"responsible subsystem");for(const T of A.businessObjectIds)l(T,"object",b.id);for(const T of A.activityLinks)y(T.activityId);for(const T of A.sourceRefs)z(T)}for(const A of d.relations){I(p,A.fromConceptId,"concept"),I(p,A.toConceptId,"concept");for(const T of A.sourceRefs)z(T)}for(const A of d.handoffs){I(h,A.fromSubsystemId,"subsystem"),I(h,A.toSubsystemId,"subsystem"),H(A.fromSubsystemId!==A.toSubsystemId,"Handoff must cross subsystem boundary");for(const T of A.activityIds)y(T)}const R=(A,T)=>{const q=g(A.nodes,"subsystem view"),W=g(A.edges,"subsystem view edge");for(const S of q.values()){I(T,S.conceptId,"view concept"),I(h,S.subsystemId,"subsystem");const N=I(p,S.conceptId,"concept");for(const j of S.fields)H(N.information.some(B=>B.id===j.informationId),"Unknown information for subsystem view: "+j.informationId)}for(const S of W.values()){const N=I(q,S.fromViewId,"subsystem view"),j=I(q,S.toViewId,"subsystem view");H(N.subsystemId===j.subsystemId,"View relationship crosses subsystem boundary"),H(S.relationIds.length>0,"Subsystem view relationship needs a concept relation");let B=N.conceptId;for(const re of S.relationIds){const Z=I(x,re,"concept relation");H(Z.fromConceptId===B,"Subsystem view relation path is disconnected: "+re),B=Z.toConceptId}H(B===j.conceptId,"Subsystem view relation target differs")}H(new Set(A.handoffIds).size===A.handoffIds.length,"Duplicate subsystem view handoff");const K=new Set([...q.values()].map(S=>S.subsystemId));for(const S of A.handoffIds){const N=I(w,S,"handoff");H(K.has(N.fromSubsystemId)&&K.has(N.toSubsystemId),"Missing subsystem view handoff region: "+S)}};d.presentation.subsystemViews&&R(d.presentation.subsystemViews,p);for(const A of d.reviewGroups){I(h,A.subsystemId,"subsystem"),l(A.reviewer.roleId,"role",b.id);for(const K of A.relatedActivityIds)y(K);const T=g(A.graph.nodes.map(K=>({...K,id:K.conceptId})),"view concept");H(new Set(A.graph.conceptIds).size===A.graph.conceptIds.length&&A.graph.conceptIds.length===T.size&&A.graph.conceptIds.every(K=>T.has(K)),"View concepts and nodes differ");for(const K of A.graph.nodes){I(p,K.conceptId,"concept");for(const S of K.sourceActivityIds)y(S)}g(A.graph.edges,"view edge");for(const K of A.graph.edges){I(T,K.fromConceptId,"view concept"),I(T,K.toConceptId,"view concept");for(const S of K.relationIds)I(x,S,"concept relation")}A.graph.subsystemViews&&R(A.graph.subsystemViews,T);const q=g(A.capabilities,"capability"),W=g(A.capabilities.flatMap(K=>K.samples),"sample");g(A.limitations,"limitation"),g(A.structureStatements,"structure statement");for(const K of A.structureStatements){for(const S of K.sampleIds)I(W,S,"sample");for(const S of K.sourceRefs)z(S)}for(const K of q.values())if(K.testSpecification){const S=K.testSpecification;for(const[j,B]of Object.entries(S))H(new Set(B).size===B.length,"Duplicate function specification reference: "+j);const N=(j,B)=>{const re=l(j,B),Z=l(o.get(j),"document");return H(Z.kind==="checkItems"&&Z.basedOn.documentId===b.id&&Z.basedOn.revision===b.revision,"Function Check source mismatch: "+j),{value:re,doc:Z}};for(const j of[...S.decisionCheckIds,...S.resultCheckIds])N(j,"check");for(const j of S.decisionExampleIds){const{value:B,doc:re}=N(j,"example"),Z=Wn(re,B);H(Z.length>0,"Function decision table needs a Check: "+j),H(Z.every(ue=>S.decisionCheckIds.includes(ue)),"Function decision table Check is not assigned: "+j)}for(const j of S.sampleIds){const B=K.samples.find(re=>re.id===j);H(B,"Function result sample belongs to another capability: "+j),H(B.checkIds.some(re=>S.resultCheckIds.includes(re)),"Function result sample needs a result Check: "+j),H(B.checkIds.every(re=>S.resultCheckIds.includes(re)||S.decisionCheckIds.includes(re)),"Function result sample Check is not assigned: "+j)}}for(const K of q.values())for(const S of K.samples){if(d.schemaVersion==="0.2"){H(S.checkIds.length>0,"Sample needs a Check: "+S.id),H(new Set(S.checkIds).size===S.checkIds.length,"Duplicate sample Check: "+S.id);for(const N of S.checkIds){l(N,"check");const j=l(o.get(N),"document");H(j.kind==="checkItems"&&j.basedOn.documentId===b.id&&j.basedOn.revision===b.revision,"Sample Check source mismatch: "+N)}}for(const N of S.blocks){I(T,N.card,"view concept");const j=g(N.columns,"sample column");for(const B of N.columns)I(D,B.informationId,"concept information");g(N.rows,"sample row");for(const B of N.rows){const re=new Set;for(const Z of B.cells)I(j,Z.columnId,"sample column"),H(!re.has(Z.columnId),"Duplicate sample cell: "+Z.columnId),re.add(Z.columnId);H(re.size===j.size,"Sample row does not match columns")}}}}for(const A of d.presentation.landscapeRelationships){const T=I(M,A.from,"review group"),q=I(M,A.to,"review group");H(T.subsystemId===q.subsystemId,"Internal relationship crosses subsystem boundary")}for(const A of d.presentation.reviewBoundaries)I(M,A.from,"review group"),I(M,A.to,"review group");s.push("概念モデルの業務意味は未確認: "+d.id)}else{const b=l(d.basedOn.documentId,"document");H(b.kind==="businessDesign","Check source is not BD"),H(b.revision===d.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+d.id),H(new Set(d.items.map(p=>p.checkId)).size===d.items.length,"Duplicate Check ID");const g=new Set;for(const p of d.index){l(p.activityId,"activity",b.id),H(!g.has(p.activityId),"Duplicate Activity index"),g.add(p.activityId),H(new Set(p.checkIds).size===p.checkIds.length,"Duplicate Check binding");for(const x of p.checkIds)l(x,"check",d.id)}H(new Set(d.sections.map(p=>p.activityId??p.title)).size===d.sections.length,"Duplicate Activity section");for(const p of d.sections)p.activityId!==null&&(l(p.activityId,"activity",b.id),H(g.has(p.activityId),"Section missing from index")),c(p.preamble,d.id);const h=new Set(e.documents.filter(p=>p.kind==="conceptModel"&&p.basedOn.documentId===b.id&&p.basedOn.revision===b.revision).flatMap(p=>p.reviewGroups.flatMap(x=>x.capabilities.flatMap(M=>M.testSpecification?.decisionExampleIds??[]))));for(const p of d.guarantees){const x=p.blocks.length>0&&p.blocks.every(M=>M.kind==="example"&&h.has(M.exampleId)&&d.examples.some(w=>w.id===M.exampleId&&w.guaranteeId===p.id&&Wn(d,w).length>0));H(p.blocks.some(M=>M.kind==="prose"&&u(M.content))||x,"General guarantee prose required"),l(p.sectionId,"section",d.id);for(const M of p.blocks)if(M.kind==="prose")c(M.content,d.id);else{const w=l(M.exampleId,"example",d.id);H(w.guaranteeId===p.id,"Example owner mismatch")}}for(const p of d.examples){l(p.guaranteeId,"guarantee",d.id),H(p.columns.length>0,"Example columns required");for(const x of p.rows){H(x.length===p.columns.length,"Example column mismatch");for(const M of x)c(M,d.id)}}for(const p of d.items){const x=l(p.sectionId,"section",d.id);H(x.activityId===null?!d.index.some(M=>M.checkIds.includes(p.id)):d.index.some(M=>M.activityId===x.activityId&&M.checkIds.includes(p.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),H(u(p.fields.guarantee)||u(p.fields.condition)&&u(p.fields.expectedResult),"Check guarantee required");for(const M of Object.values(p.fields))c(M,d.id);H(x.activityId===null||d.index.some(M=>M.checkIds.includes(p.id)),"Unbound Check")}for(const p of d.notes)c(p.content,d.id);c(d.intro,d.id)}const a=e.diagnostics.filter(d=>d.startsWith("Role未確定:"));H(new Set(a).size===a.length,"Duplicate unresolved Role diagnostic");for(const d of a)H(r.delete(d),"Unresolved Who requires a diagnostic matching a current unresolved Activity");H(r.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const d of e.sources){l(d.documentId,"document");const b=d.documentId+"@"+d.revision;H(!f.has(b),"Duplicate source descriptor"),f.add(b)}for(const d of e.externalDocuments)H(e.sources.some(b=>b.documentId===d.id&&b.revision===d.revision),"External source revision missing"),H(d.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+d.id);return{diagnostics:s,entities:n.size}}const ne=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Ks(e,t,n){if(n==null)return;const o=xn(n);return e.append(ne("h3",t),o),o}function hd(e,t){if(e===null)return;const n=xn(e),o=s=>String(s??"").replace(/\s+/g,""),i=new Set(t.map(s=>o(xn(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))i.has(o(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const bd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function gd(e,t,n){const o=new Map,i=new Set,s=new Set(n.map(l=>l.id)),r=e.model.business;for(const l of e.model.concepts??[]){if(l.basedOn.documentId!==r.id||l.basedOn.revision!==r.revision)continue;const u=l.presentation.activityViews;if(Array.isArray(u)){for(const c of u)if(!(!c||typeof c!="object"||Array.isArray(c)||c.activityId!==t||!Array.isArray(c.businessVariations)))for(const a of c.businessVariations){if(!a||typeof a!="object"||Array.isArray(a)||typeof a.exceptionId!="string"||!s.has(a.exceptionId)||a.kind!=="alternative"&&a.kind!=="exception"||i.has(a.exceptionId))continue;const f=o.get(a.exceptionId);f&&f!==a.kind?(o.delete(a.exceptionId),i.add(a.exceptionId)):o.set(a.exceptionId,a.kind)}}}return o}function yd(e,t){const n=ne("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(l=>l.id===t),r=i.activities.find(l=>l.id===t);if(s){Ks(n,"Scope",String(s.scope)),n.append(ne("h3","Information"));const l=ne("ul");for(const u of s.information)l.append(ne("li",u));n.append(l)}else if(r){const l=i.exceptions?.filter(d=>d.activityId===r.id)??[];for(const[d,b]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=Ks(n,d,b==="who"?ss(e,r.id)?.name??r.who:r[b]===null?null:String(r[b]));b==="result"&&g&&(g.dataset.businessResult="")}const u=hd(r.exception,l),c=gd(e,r.id,l),a=(d,b,g)=>{if(!b.length&&!g)return;const h=ne("section");h.dataset.businessVariations="",h.append(ne("h3",d)),g&&h.append(g);for(const p of b){const x=xn(p.description);x.dataset.businessException=p.id,h.append(ne("h4",p.name),x)}n.append(h)};c.size?(a("例外",l.filter(d=>c.get(d.id)==="exception")),a("別ルート",l.filter(d=>c.get(d.id)==="alternative")),a("通常以外の扱い",l.filter(d=>!c.has(d.id)),u)):a("通常以外の扱い",l,u);const f=new Map([...i.objects,...i.activities].map(d=>[d.id,d.name]));for(const[d,b]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=i.relations.filter(p=>p.kind===d&&(p.fromId===t||p.toId===t));if(!g.length)continue;n.append(ne("h3",b));const h=g.map(p=>`${f.get(p.fromId)} → ${f.get(p.toId)} — ${p.label}`);if(d==="business-exception")for(const p of h)n.append(ne("p",p));else{const p=ne("ul");for(const x of h)p.append(ne("li",x));n.append(p)}}}else n.append(ne("p","項目を選択すると業務内容を表示します。"));return n}class lo{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(ne("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(xn(i.value));continue}if(i.kind==="text"){const u=ne("span",i.value);u.style.whiteSpace="pre-wrap",t.append(u);continue}if(i.kind==="link"){t.append(ne("span",`${i.label} (${i.uri})`));continue}const s=ne("details"),r=ne("summary",i.label||i.targetId);s.append(r),t.append(s);let l=!1;s.addEventListener("toggle",()=>{if(!s.open||l)return;if(l=!0,o.has(i.targetId)){s.append(ne("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(ne("p","参照の深さの上限です。続きは原文で確認してください。"));return}const u=new Set(o).add(i.targetId),c=this.doc,a=c.guarantees.find(h=>h.id===i.targetId),f=c.examples.find(h=>h.id===i.targetId),d=c.items.find(h=>h.id===i.targetId),b=c.sections.find(h=>h.id===i.targetId),g=c.notes.find(h=>h.id===i.targetId);if(a){s.append(ne("h4",a.title));for(const h of a.blocks){if(!this.take(s))break;h.kind==="prose"?this.runs(s,h.content,u):this.example(s,h.exampleId,u)}}else if(f)this.example(s,f.id,u);else if(d){s.append(ne("p",`${d.checkId} · ${d.title}`+(this.requester?"":` · ${d.reviewState}`))),this.requester&&(d.reviewState==="要確認"||d.reviewState==="要修正")&&s.append(ne("p","確認が必要です。"));const h=this.requester?Object.fromEntries(Object.entries(d.fields).filter(([p])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(p))):d.fields;this.fields(s,h,u)}else b?(s.append(ne("h4",b.title)),this.runs(s,b.preamble,u)):g?(s.append(ne("h4",g.title)),this.runs(s,g.content,u)):i.targetId===c.id&&(s.append(ne("h4",c.title)),this.runs(s,c.intro,u))})}}fields(t,n,o,i=!1){for(const[s,r]of Object.entries(n)){if(!this.take(t))break;if(t.append(ne("h4",bd[s]??s)),s==="guarantee"&&i){const l=new Set;for(const u of r){const c=u.kind==="reference"?this.doc.guarantees.find(f=>f.id===u.targetId):void 0;if(!c){this.runs(t,[u],o);continue}if(l.has(c.id))continue;l.add(c.id);const a=new Set(o).add(c.id);for(const f of c.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,a):this.example(t,f.exampleId,a)}}}else this.runs(t,r,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!Wn(this.doc,s).length)return;const r=ne("table"),l=i?s.columns.indexOf("結果"):-1,u=l>0&&s.columns.at(-1)==="Check ID";if(u){const f=ne("colgroup");f.span=l,r.append(f);for(let p=l;p<s.columns.length;p++)r.append(ne("colgroup"));const d=ne("thead"),b=ne("tr"),g=ne("th","条件");g.colSpan=l,g.scope="colgroup",b.append(g);for(let p=l;p<s.columns.length;p++){const x=ne("th",s.columns[p]);x.rowSpan=2,x.scope="col",p===l?x.className="decision-result":s.columns[p]==="備考"&&(x.className="decision-notes"),b.append(x)}const h=ne("tr");for(const p of s.columns.slice(0,l)){const x=ne("th",p);x.scope="col",h.append(x)}d.append(b,h),r.append(d)}else{const f=ne("tr");for(const d of s.columns){if(!this.take(t))break;f.append(ne("th",d))}r.append(f)}const c=u?ne("tbody"):r;for(const f of s.rows){if(!this.take(t))break;const d=ne("tr");for(const[b,g]of f.entries()){if(!this.take(t))break;const h=ne("td");if(u&&b===l?h.className="decision-result":u&&s.columns[b]==="備考"&&(h.className="decision-notes"),i)for(const p of g){const x=p.kind==="reference"?this.doc.items.find(M=>M.id===p.targetId):void 0;x?h.append(ne("span",x.checkId)):this.runs(h,[p],o)}else this.runs(h,g,o);d.append(h)}c.append(d)}u&&r.append(c);const a=ne("div");a.className="json-example",a.append(r),t.append(a)}}function Js(e,t,n=e.model.checks,o=new Set,i=new Set){const s=ne("section");s.className="check-content json-checks";const r=e.model.business,l=n.filter(c=>c.basedOn.documentId===r.id);let u=!1;for(const c of l){const a=new lo(c),f=c.index.filter(h=>h.activityId===t),d=new Set(c.index.flatMap(h=>h.checkIds)),b=(t?[...new Set(f.flatMap(h=>h.checkIds))]:c.items.filter(h=>!d.has(h.id)).map(h=>h.id)).filter(h=>!o.has(h)),g=c.sections.filter(h=>t?h.activityId===t:h.activityId===null);for(const h of g){(h.preamble.length||c.guarantees.some(p=>p.sectionId===h.id&&!i.has(p.id)))&&(u=!0),a.runs(s,h.preamble);for(const p of c.guarantees.filter(x=>x.sectionId===h.id&&!i.has(x.id)))a.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}for(const h of b){const p=c.items.find(w=>w.id===h);if(!p)continue;u=!0;const x=ne("section");x.className="check-item",x.dataset.checkId=p.checkId,x.dataset.elementId=p.id,x.append(ne("h3",p.checkId+" · "+p.title)),(p.reviewState==="要確認"||p.reviewState==="要修正")&&x.append(ne("p","確認が必要です。"));const M=Object.fromEntries(Object.entries(p.fields).filter(([w])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(w)));a.fields(x,M,new Set([p.id])),s.append(x)}if(!t)for(const h of c.notes)u=!0,a.runs(s,[{kind:"reference",targetId:h.id,label:h.title}])}return u||s.append(ne("p","この業務のテスト仕様はありません。")),s}function vd(e,t,n=e.model.checks){const o=ne("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new lo(r);for(const u of r.items.filter(c=>s.has(c.id))){const c=ne("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(ne("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(ne("p","確認が必要です。"));const a=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));l.fields(c,a,new Set([u.id]),!0),o.append(c)}}return o}const wd=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function kd(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(wd,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Id(e,t,n=e.model.checks){const o=ne("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=r.examples.find(g=>g.id===s);if(!l||!Wn(r,l).length)continue;const u=new lo(r,!0),c=r.guarantees.find(g=>g.id===l.guaranteeId),a=ne("section");a.dataset.decisionExample=s;for(const g of c?.blocks??[])g.kind==="prose"&&u.runs(a,kd(g.content),new Set([c.id]));l.rows.length>1&&a.append(ne("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=l.columns.indexOf("結果"),d=f>0?f:l.columns.length;l.rows.some(g=>g.slice(0,d).some(h=>h.some(p=>p.kind==="text"&&/^\s*[-‐]\s*$/.test(p.value))))&&a.append(ne("p","‐＝値不問。")),u.example(a,s,new Set([s]),!0),o.append(a)}return o}function Sd(e,t,n=e.model.checks){const o=ne("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new lo(r,!0);for(const u of r.items.filter(c=>s.has(c.id))){const c=ne("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(ne("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(ne("p","確認が必要です。")),u.fields.condition?.length&&(c.append(ne("h4","条件")),l.runs(c,u.fields.condition,new Set([u.id])));const a=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(a).length){const f=ne("details");f.append(ne("summary","期待結果")),l.fields(f,a,new Set([u.id]),!0),c.append(f)}o.append(c)}}return o}function xd(e,t,n=e.model.checks,o=new Set){const i=ne("section");i.className="check-content json-checks result-checks";const s=e.model.business,r=new Set(t);for(const l of n.filter(u=>u.basedOn.documentId===s.id&&u.basedOn.revision===s.revision)){const u=new lo(l,!0),c=l.items.filter(a=>r.has(a.id)&&o.has(a.id)&&a.reviewState!=="要確認"&&a.reviewState!=="要修正"&&!a.fields.question?.length&&!a.fields.alternatives?.length);c.length&&i.append(ne("p",c.map(a=>a.checkId).join("、")));for(const a of l.items.filter(f=>r.has(f.id))){if(c.includes(a))continue;const f=ne("section");f.className="check-item",f.dataset.checkId=a.checkId,f.dataset.elementId=a.id,f.append(ne("h3",a.checkId)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&f.append(ne("p","確認が必要です。"));const d=Object.fromEntries(Object.entries(a.fields).filter(([h])=>["expectedResult","guarantee","question","alternatives"].includes(h)));u.fields(f,d,new Set([a.id]),!0);const b=ne("details"),g=ne("summary","Check の詳細");b.append(g,ne("p",a.title)),a.fields.condition?.length&&u.runs(b,a.fields.condition,new Set([a.id])),f.append(b),i.append(f)}}return i}const Si=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Ad(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(a=>a.id)),o=[],i=new Set,s=new Set,r=t.filter(a=>a.basedOn.documentId===e.business.id&&a.basedOn.revision===e.business.revision),l=(a,f)=>r.some(d=>d.items.some(b=>b.id===a)&&(!f||d.index.some(b=>b.activityId===f&&b.checkIds.includes(a)))),u=(a,f,d,b,g=[])=>{const h=f.testSpecification,p=(h?.decisionCheckIds??[]).filter(z=>l(z,d)),x=(h?.resultCheckIds??[]).filter(z=>l(z,d)),M=(h?.decisionExampleIds??[]).filter(z=>r.some(R=>{const A=R.examples.find(q=>q.id===z),T=A?Wn(R,A):[];return T.length>0&&T.every(q=>l(q,d))})),w=f.samples.filter(z=>(!h||h.sampleIds.includes(z.id))&&z.checkIds?.length&&(h?z.checkIds.every(R=>l(R,d)):z.checkIds.some(R=>l(R,d)))),D=M.flatMap(z=>r.flatMap(R=>{const A=R.examples.find(T=>T.id===z);return A?Wn(R,A).filter(T=>l(T,d)):[]})),I=[...new Set([...p,...x,...D,...w.flatMap(z=>(z.checkIds??[]).filter(R=>l(R,d)))])];if(!I.length)return;const y=`fn:${d??"_"}:${a}:${f.id}`;s.has(y)||(s.add(y),o.push({key:y,activityId:d,groupId:a,capability:f,name:b,samples:w,checkIds:I,decisionCheckIds:p,resultCheckIds:x,decisionExampleIds:M,decisionTableCheckIds:[...new Set(D)],businessSections:g}))},c=e.model.presentation.activityViews;if(Array.isArray(c)){for(const a of c)if(!(!Si(a)||typeof a.activityId!="string"||!n.has(a.activityId)||!Array.isArray(a.testSpecificationFunctions)))for(const f of a.testSpecificationFunctions){if(!Si(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const d=e.model.reviewGroups.find(h=>h.id===f.groupId),b=d?.capabilities.find(h=>h.id===f.capabilityId);if(!d||!b)continue;i.add(JSON.stringify([d.id,b.id]));const g=[];if(Array.isArray(f.businessSections))for(const h of f.businessSections){if(!Si(h)||!Array.isArray(h.pages)||h.kind!=="result"&&h.kind!=="exception"||h.kind==="exception"&&(typeof h.exceptionId!="string"||!e.business.exceptions?.some(x=>x.id===h.exceptionId&&x.activityId===a.activityId)))continue;const p=[...new Set(h.pages.filter(x=>x==="decision"||x==="result"))];p.length&&g.push({kind:h.kind,exceptionId:h.kind==="exception"?h.exceptionId:void 0,pages:p})}u(d.id,b,a.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():b.title,g)}}for(const a of e.model.reviewGroups)for(const f of a.capabilities)i.has(JSON.stringify([a.id,f.id]))||u(a.id,f,void 0,f.title);return o}function _s(e,t,n,o){const i=e.filter(r=>r.groupId===t&&r.capability.id===n),s=i.find(r=>r.samples.some(l=>l.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const r of i){if(!r.capability.testSpecification)continue;const l=r.capability.samples.find(c=>c.id===o),u=r.decisionExampleIds.length?r.decisionTableCheckIds:r.decisionCheckIds;if(l?.checkIds?.some(c=>u.includes(c)))return{kind:"decision",key:"decision:"+r.key}}}const qi=["owned","reference","unknownOut"];function Hr(e){const t=e.meta&&typeof e.meta=="object"&&!Array.isArray(e.meta)?e.meta:{},n=t.compatibilityReview&&typeof t.compatibilityReview=="object"&&!Array.isArray(t.compatibilityReview)?t.compatibilityReview:{},o=(i,s)=>{const r=n[i];if(!r||typeof r!="object"||Array.isArray(r))return;const l=r[s];if(!l||typeof l!="object"||Array.isArray(l))return;const u=l;return(u.kind==="legacy"||u.kind==="needs-review")&&typeof u.reason=="string"&&u.reason.trim()?{kind:u.kind,reason:u.reason}:void 0};return{concept:i=>o("concepts",i),field:(i,s)=>o("fields",i)??o("concepts",s),relation:(i,s)=>o("relations",i)??o("concepts",s)}}const Ro=e=>e.kind==="legacy"?"互換・移行用":"要確認";function Gr(e){const t=new Map(e.concepts.map(y=>[y.id,y])),n=e.meta&&typeof e.meta=="object"?e.meta:{},o=n.relationNames&&typeof n.relationNames=="object"&&!Array.isArray(n.relationNames)?n.relationNames:{},i=n.reverseRelationNames&&typeof n.reverseRelationNames=="object"&&!Array.isArray(n.reverseRelationNames)?n.reverseRelationNames:{},s=n.conceptNames&&typeof n.conceptNames=="object"&&!Array.isArray(n.conceptNames)?n.conceptNames:{},r=Array.isArray(n.fieldMappings)?n.fieldMappings.filter(y=>!!y&&typeof y=="object"&&typeof y.informationId=="string"&&typeof y.physicalName=="string"&&Array.isArray(y.relationIds)&&y.relationIds.every(z=>typeof z=="string")):[],l=new Map;for(const y of r){const z=l.get(y.informationId)??[];z.push(y),l.set(y.informationId,z)}const u=new Map([...l].filter(([,y])=>y.length===1).map(([y,z])=>[y,z[0]])),c=y=>y.representation==="relationKey"?Array.isArray(y.relationKeyIds)&&y.relationKeyIds.every(z=>typeof z=="string")?y.relationKeyIds:[]:y.relationIds,a=new Map;for(const y of e.relations){const z=a.get(y.id)??[];z.push(y),a.set(y.id,z)}const f=new Map([...a].filter(([,y])=>y.length===1).map(([y,z])=>[y,z[0]])),d=new Set;for(const y of e.concepts)for(const z of y.information){const R=u.get(z.id);R?.representation!=="relationKey"||!c(R).length||c(R).every(A=>{const T=f.get(A);return!!T&&t.has(T.fromConceptId)&&t.has(T.toConceptId)&&(T.kind==="reference"&&T.fromConceptId===y.id||T.kind==="down"&&(T.fromConceptId===y.id||T.toConceptId===y.id))})&&d.add(z.id)}const b=Array.isArray(n.relationPhysicalFields)?n.relationPhysicalFields.filter(y=>!!y&&typeof y=="object"&&typeof y.relationId=="string"&&typeof y.physicalName=="string"&&!!y.physicalName.trim()):[],g=new Map;for(const y of t.keys())g.set(y,[]);for(const y of e.relations){if(!t.has(y.fromConceptId)||!t.has(y.toConceptId))continue;const z=E=>typeof E=="string"&&E.trim()?E:"未定義",R=E=>t.get(E).information.flatMap(P=>{const U=u.get(P.id);return U&&c(U).includes(y.id)?[{name:P.name,physicalName:U.physicalName,valueType:U.valueType}]:[]}),A=R(y.fromConceptId),T=R(y.toConceptId),q=Object.hasOwn(o,y.id)?o[y.id]:void 0,W=typeof q=="string"&&q.trim()?q.trim():void 0,K=Object.hasOwn(i,y.id)?i[y.id]:void 0,S=typeof K=="string"&&K.trim()?K.trim():void 0,N=y.kind,j=N==="down"?t.get(y.toConceptId).information.flatMap(E=>{const P=u.get(E.id);return d.has(E.id)&&P&&c(P).includes(y.id)?[P.physicalName]:[]}):[],B=t.get(y.fromConceptId).information.flatMap(E=>{const P=u.get(E.id);return d.has(E.id)&&P&&c(P).includes(y.id)?[P.physicalName]:[]}),re=b.filter(E=>E.relationId===y.id).map(E=>E.physicalName),Z=[...new Set([...A.map(E=>E.physicalName),...j,...re])],ue=new Set([...B,...j,...re]),ie=new Set(t.get(y.fromConceptId).information.flatMap(E=>{const P=u.get(E.id);return!d.has(E.id)&&P&&c(P).includes(y.id)?[P.physicalName]:[]})),me=Z.filter(E=>!ue.has(E)||ie.has(E));g.get(y.fromConceptId).push({relation:y,from:y.fromConceptId,to:y.toConceptId,direction:N==="down"?"owned":N==="reference"?"reference":"unknownOut",count:z(y.toLabel),reverseCount:z(y.fromLabel),fields:Z,visibleFields:me,fieldDetails:A,roleName:W}),g.get(y.toConceptId).push({relation:y,from:y.toConceptId,to:y.fromConceptId,direction:N==="down"?"owner":N==="reference"?"referencedBy":"unknownIn",count:z(y.fromLabel),reverseCount:z(y.toLabel),fields:T.map(E=>E.physicalName),visibleFields:T.map(E=>E.physicalName),fieldDetails:T,...N==="down"&&S?{roleName:S}:{}})}const h=new Set(e.relations.filter(y=>y.kind==="down"&&t.has(y.fromConceptId)&&t.has(y.toConceptId)).map(y=>y.toConceptId)),p=e.concepts.filter(y=>!h.has(y.id)),x=p.filter(y=>{const z=y.information.map(A=>u.get(A.id)).filter(A=>!!A),R=z.find(A=>A.physicalName==="documents[]"&&A.valueType==="array");return z.some(A=>A.physicalName==="format")&&z.some(A=>/^formatVersion(?:\s*:.*)?$/.test(A.physicalName))&&z.some(A=>A.physicalName==="revision")&&!!R&&R.relationIds.some(A=>e.relations.some(T=>T.id===A&&T.kind==="down"&&T.fromConceptId===y.id))}),M=x.length===1?x[0].id:void 0,w=M?[M]:(p.length?p:e.concepts).map(y=>y.id),D=new Set,I=[...w];for(;I.length;){const y=I.pop();if(!D.has(y)){D.add(y);for(const z of g.get(y)??[])qi.includes(z.direction)&&!D.has(z.to)&&I.push(z.to)}}return{nodes:t,edges:g,mappings:u,relationKeys:d,conceptNames:s,packageRoot:M,roots:w,hasOwnershipRoots:p.length>0,reachable:D}}const Xn={owned:"所有",reference:"参照",owner:"所属先",referencedBy:"参照元",unknownOut:"種類未定義（出）",unknownIn:"種類未定義（入）"},Xs=(e,t)=>{const n=On(e,{"aria-hidden":"true","stroke-width":1.8});if(n.classList.add("structure-icon"),t){n.removeAttribute("aria-hidden"),n.setAttribute("role","img"),n.setAttribute("aria-label",t);const o=document.createElementNS("http://www.w3.org/2000/svg","title");o.textContent=t,n.prepend(o)}return n},$e=(e,t,n,o)=>{const i=document.createElement(t);return i.textContent=n,o&&(i.className=o),e.append(i),i},Kr=(e,t)=>{t&&(e.classList.add("structure-review-"+t.kind),$e(e,"span",Ro(t),"structure-review-badge"))},Eo=e=>e.split(" / ").map(t=>t.trim().split(".").pop()??t).join(" / ");function Zs(e){const t=e?.valueDomain,n=t?.kind,o=Wi(e);if((n==="enum"||n==="fixed")&&o.length)return o.map(r=>r.literal).join(" | ");const i={identifier:"識別子",version:"版・改訂",reference:"参照",referenceType:"参照先の種類",hash:"SHA-256",uri:"URI",cardinality:"多重度"};if(typeof n=="string"&&i[n])return i[n];const s=typeof e?.valueType=="string"&&e.valueType.trim()?e.valueType:"未定義";return e?.nullableStatus==="proposal"?s.split("|").map(r=>r.trim()).filter(r=>r!=="null").join(" | ")||"未定義":s}function Wi(e){const t=e?.valueDomain;if(!t||!["enum","fixed"].includes(String(t.kind))||!Array.isArray(t.values))return[];const n=[];for(const o of t.values){if(!o||typeof o!="object"||!["string","number","boolean"].includes(typeof o.value))return[];const i=typeof o.value=="string"?o.value||'""':String(o.value);n.push({value:i,literal:JSON.stringify(o.value)??String(o.value),...typeof o.label=="string"&&o.label.trim()?{label:o.label.trim()}:{}})}return n}function Ys(e){return e.label?e.value+"："+e.label:e.value}function Qs(e){const t=e?.valueDomain?.note;return typeof t=="string"&&t.trim()?t.trim():void 0}function er(e){return typeof e?.nullable=="boolean"?e.nullable?"許容する":"許容しない":e&&Object.hasOwn(e,"nullable")?"未決":"未定義"}function tr(e,t){const n=typeof e.description=="string"&&e.description.trim()?e.description:t?.logicalMeaning;return typeof n=="string"&&n.trim()?n:"この項目の説明はまだ記載されていません。"}function nr(e,t,n,o,i=[]){const s=document.createElement("div");s.className="structure-copy-actions";const r=document.createElement("span");r.className="structure-copy-status",r.setAttribute("role","status"),r.setAttribute("aria-live","polite");const l=()=>{const d=[];for(const b of Array.from(t.children)){if(b.tagName!=="DT")continue;const g=b.nextElementSibling;if(!g)continue;const h=g.querySelector("table"),p=M=>Array.from(M.childNodes).map(w=>w.nodeName==="UL"||w.nodeName==="OL"?Array.from(w.childNodes).map(D=>D.textContent?.trim()??"").filter(Boolean).join("、"):w.textContent?.trim()??"").filter(Boolean).join(" / "),x=h?Array.from(h.querySelectorAll("tr")).map(M=>Array.from(M.children).map(p).join(" | ")).join(`
`):Array.from(g.childNodes).map(M=>M.nodeName==="BR"?`
`:M.textContent??"").join("");d.push((b.querySelector(".structure-detail-caption")?.textContent??b.textContent??"")+"："+x)}return[o,...i.length?["元の定義："+i.join("、")]:[],...d].join(`
`)},u=async d=>{try{const b=e.ownerDocument.defaultView?.navigator.clipboard;if(!b?.writeText)throw Error("Clipboard unavailable");await b.writeText(d?l():o),r.textContent=d?"全文をコピーしました。":"識別情報をコピーしました。"}catch{r.textContent="コピーできませんでした。ブラウザーの設定を確認してください。"}},c=document.createElement("button");c.type="button",c.className="structure-copy-id",c.textContent="識別情報をコピー",c.title="Shiftを押しながら選ぶと全文をコピー",c.addEventListener("click",d=>{u(d.shiftKey)});const a=document.createElement("button");a.type="button",a.className="structure-copy-full",a.textContent="全文をコピー",a.addEventListener("click",()=>{u(!0)}),s.append(c,a);const f=document.createElement("span");f.className="structure-detail-caption",f.textContent=n.textContent,n.classList.add("structure-copy-heading"),n.replaceChildren(f,s,r)}function Jr(e,t,n,o){if(e.replaceChildren(),!n){$e(e,"p","ツリーの項目を選択すると詳細を確認できます。");return}const i=Gr(t),s=Hr(t),r=i.nodes.get(n.conceptId);if(!r){$e(e,"p","項目が見つかりません。");return}const l=t.meta&&typeof t.meta=="object"?t.meta:{},u=l.modelStatus==="normalized-study"||l.modelStatus==="complete-package-study",c=N=>{const j=i.nodes.get(N),B=i.conceptNames[N];return{local:typeof B?.logicalName=="string"&&B.logicalName?B.logicalName:j?.name??N,type:typeof B?.typeName=="string"&&B.typeName?B.typeName:j?.name??"未定義"}},a=document.createElement("dl");a.className="structure-detail-list",e.append(a);const f=N=>{o?o(N):Jr(e,t,N),N.kind==="attribute"?e.querySelector(".structure-attribute-back")?.focus():n.kind==="attribute"&&Array.from(e.querySelectorAll(".structure-attribute-table tbody tr")).find(j=>j.dataset.informationId===n.informationId)?.querySelector(".structure-attribute-select")?.focus()},d=(N,j)=>{const B=document.createElement("dt"),re=document.createElement("dd");B.textContent=N;const Z=Array.isArray(j)?j:[j??"未定義"];if(!Z.length)re.textContent="なし";else for(const[ue,ie]of Z.entries())ue&&re.append(document.createElement("br")),re.append(document.createTextNode(ie));return a.append(B,re),B};if(n.kind==="attribute"){if(n.returnTo){const U=document.createElement("button");U.type="button",U.className="structure-attribute-back",U.textContent="項目一覧に戻る",U.onclick=()=>f(n.returnTo),e.insertBefore(U,a)}const N=r.information.find(U=>U.id===n.informationId);if(!N){a.remove(),$e(e,"p","項目が見つかりません。");return}const j=i.mappings.get(N.id),B=N,re=c(r.id),Z="概念モデル："+t.id+"（"+t.revision+`）
構造：`+re.type+"［"+r.id+`］
項目：`+N.name+(j?.physicalName?"（"+Eo(j.physicalName)+"）":"")+"［"+N.id+"］",ue=Array.isArray(l.schemaCoverage)?l.schemaCoverage.flatMap(U=>U&&typeof U=="object"&&U.informationId===N.id&&typeof U.path=="string"?[U.path]:[]):[],ie=j?.relationIds.flatMap(U=>{const de=(i.edges.get(r.id)??[]).filter(Y=>Y.relation.id===U);return de.length?de.map(Y=>c(Y.to).local+"（"+Xn[Y.direction]+"）"):[U+"（未定義）"]});nr(e,a,d("論理名",j?.physicalName?Eo(j.physicalName):void 0),Z,ue),d("ローカル名",N.name),d("型名",Zs(j)),d("サンプル",or(j)??"未記載"),d("null許容",er(j)),d("説明",tr(B,j)),d("用途",typeof j?.logicalPurpose=="string"?j.logicalPurpose:""),j?.nullableReason&&d("null許容の理由",j.nullableReason);const me=Wi(j);me.length&&d(j?.valueDomain?.kind==="fixed"?"値":"選択肢",me.map(Ys));const E=Qs(j);E&&d("制約",E);const P=s.field(N.id,r.id);P&&d("位置づけ",Ro(P)+"："+P.reason),d("所属",c(r.id).local+"（"+c(r.id).type+"）"),d("参照",ie),j?.logicalSourcePaths?.length&&d("対応する定義",j.logicalSourcePaths),typeof j?.optional=="boolean"&&d("項目の省略",j.optional?"可能":"不可"),j?.representation&&d("対応の種類",j.representation),N.responsibilityStatus&&d("責任の確認状態",N.responsibilityStatus),N.responsibleSubsystemId&&d("責任を持つサブシステム",t.subsystems.find(U=>U.id===N.responsibleSubsystemId)?.name);return}const b=n.relationId?i.edges.get(n.fromId??"")?.find(N=>N.relation.id===n.relationId&&N.to===r.id):void 0,g=c(r.id),h="概念モデル："+t.id+"（"+t.revision+`）
構造：`+g.type+"［"+r.id+"］"+(n.relationId?`
関係：`+n.relationId:""),p=N=>{const j=c(N);return j.local+"（"+j.type+"）"},x=(i.edges.get(r.id)??[]).filter(N=>N.direction==="owner").map(N=>p(N.to)),M=b?.direction==="owned"?[p(b.from)]:x,w=(i.edges.get(r.id)??[]).filter(N=>N.direction==="owned"&&(n.hideLegacy===!1||s.relation(N.relation.id,N.to)?.kind!=="legacy")).map(N=>{const j=c(N.to),B=s.relation(N.relation.id,N.to);return(B?Ro(B)+"：":"")+(N.roleName??j.local)+"（"+j.type+"）"}),D=(i.edges.get(r.id)??[]).filter(N=>N.direction==="reference").map(N=>(N.roleName??"参照")+"："+c(N.to).local),I=b?.fieldDetails.filter(N=>!u||![...i.mappings.values()].some(j=>j.physicalName===N.physicalName&&j.relationIds.length>1)).map(N=>N.physicalName).filter(Boolean).map(Eo);nr(e,a,d("論理名",b?I?.length?I:void 0:g.type),h),d("ローカル名",b?.roleName??b?.fieldDetails[0]?.name??g.local),d("型名",g.type);const y=r.information.filter(N=>!i.relationKeys.has(N.id)&&(n.hideLegacy===!1||s.field(N.id,r.id)?.kind!=="legacy")),z=document.createElement("dt"),R=document.createElement("dd");if(z.textContent="項目とサンプル",a.append(z,R),!y.length)$e(R,"p","表示する属性はありません。","structure-attribute-empty");else{const N=document.createElement("div"),j=document.createElement("table"),B=document.createElement("thead"),re=document.createElement("tr"),Z=document.createElement("tbody");N.className="structure-attribute-wrap",j.className="structure-attribute-table",j.setAttribute("aria-label",g.local+"の項目とサンプル");for(const ue of["項目","サンプル","説明","用途"]){const ie=document.createElement("th");ie.scope="col",ie.textContent=ue,re.append(ie)}B.append(re),j.append(B,Z),N.append(j),R.append(N);for(const ue of y){const ie=i.mappings.get(ue.id),me=ue,E=document.createElement("tr"),P=document.createElement("th"),U=document.createElement("td"),de=document.createElement("td"),Y=document.createElement("td");E.dataset.informationId=ue.id,P.scope="row";const be=document.createElement("button");be.type="button",be.className="structure-attribute-name structure-attribute-select",be.textContent=ue.name,be.onclick=()=>f({kind:"attribute",conceptId:r.id,informationId:ue.id,hideLegacy:n.hideLegacy,returnTo:n}),P.append(be);const Ie=s.field(ue.id,r.id);Ie&&Kr(P,Ie),ie?.physicalName&&$e(P,"span","論理名："+Eo(ie.physicalName),"structure-attribute-meta"),$e(P,"span","型："+Zs(ie),"structure-attribute-meta"),$e(P,"span","null許容："+er(ie),"structure-attribute-meta");const ve=Wi(ie);if(ve.length){$e(P,"span",ie?.valueDomain?.kind==="fixed"?"値：":"選択肢：","structure-attribute-meta");const qe=document.createElement("ul");qe.className="structure-domain-values";for(const ge of ve)$e(qe,"li",Ys(ge));P.append(qe)}const le=Qs(ie);le&&$e(P,"span","制約："+le,"structure-attribute-meta");const ke=or(ie);ke!==void 0?$e(U,"span",ke,"structure-attribute-sample"):$e(U,"span","未記載","structure-attribute-missing"),de.textContent=tr(me,ie),Y.textContent=typeof ie?.logicalPurpose=="string"?ie.logicalPurpose:"",E.append(P,U,de,Y),Z.append(E)}}d("所属",M.length?[...new Set(M)]:void 0),w.length&&d("含む構造",[...new Set(w)]),d("参照",b?.direction==="reference"?[g.local+"（"+g.type+"）"]:D);const T=u&&(/^候補の .+。現行0\.7の物理構造そのものではない。$/.test(r.description)||r.description==="0.7候補の構造に基づく概念モデルの検討案。")?"":r.description,q=b?.relation.condition||T;q&&d("説明",q);const W=b?s.relation(b.relation.id,r.id):s.concept(r.id);W&&d("位置づけ",Ro(W)+"："+W.reason),b&&(d("関係の種類",Xn[b.direction]),d("多重度",b.count),d("反対側の多重度",b.reverseCount),b.relation.sourceRefs.length&&d("関係の出所",b.relation.sourceRefs.map(N=>[N.documentId,N.revision,N.targetType,N.targetId,N.section].filter(Boolean).join(" / "))),b.relation.condition&&T&&d("構造の説明",T));const K=u&&(r.reason==="正規化候補の構造レビュー。"||r.reason==="Alder JSON概念モデルのレビュー候補。");if(r.reason&&!K&&d("理由",r.reason),r.subsystemId){const N=t.subsystems.find(j=>j.id===r.subsystemId);u&&N?.id==="format-review"||d("サブシステム",N?.name)}const S=(i.edges.get(r.id)??[]).filter(N=>N.direction==="referencedBy").map(N=>{const j=i.edges.get(N.to)?.find(B=>B.relation.id===N.relation.id&&B.direction==="reference"&&B.to===r.id)?.roleName;return c(N.to).local+(j?"："+j:"")});S.length&&d("参照元",S),r.businessObjectIds.length&&d("関連する対象",r.businessObjectIds),r.activityLinks.length&&d("関連する業務",r.activityLinks.map(N=>N.activityId+(N.uses.length?"："+N.uses.join("、"):""))),r.sourceRefs.length&&d("出所",r.sourceRefs.map(N=>[N.documentId,N.revision,N.targetType,N.targetId,N.section].filter(Boolean).join(" / ")))}function or(e){if(!e)return;const t=Object.hasOwn(e,"sampleValue")&&e.sampleValue!==void 0?e.sampleValue:e.referenceValue;return typeof t=="string"?t||'""':JSON.stringify(t)}function Ed(e,t,n={}){const o=Gr(t),i=Hr(t);if(e.replaceChildren(),e.className="structure-explorer",!o.roots.length){$e(e,"p","この構造モデルには概念がありません。","structure-empty");return}if(n.rootId&&!o.nodes.has(n.rootId)){$e(e,"p","指定した構造が見つかりません。","structure-empty");return}const s=n.rootId?[n.rootId]:o.roots,r=document.createElement("section");r.className="structure-panel",e.append(r);const l=document.createElement("div");l.className="structure-toolbar",r.append(l);const u=document.createElement("button");u.type="button",u.textContent="すべて展開",l.append(u);const c=document.createElement("button");c.type="button",c.textContent="すべて折りたたみ",l.append(c);const a=document.createElement("label");a.className="structure-compatibility-filter";const f=document.createElement("input");f.type="checkbox",f.checked=!0,a.append(f,document.createTextNode("互換・移行用を非表示")),a.title="互換・移行用と明示された項目を非表示にします。",l.append(a);const d=document.createElement("label");d.className="structure-search",d.append(Xs(Za));const b=document.createElement("input");b.type="search",b.placeholder="構造名・項目名で検索",b.setAttribute("aria-label","構造名・項目名で検索"),d.append(b),l.append(d),!n.rootId&&!o.packageRoot&&!o.hasOwnershipRoots&&$e(r,"p","JSON全体のルートと所有関係の起点を特定できないため、すべての構造を表示します。","structure-unreachable");const g=[...o.nodes.keys()].filter(S=>!o.reachable.has(S));!n.rootId&&g.length&&$e(r,"p",`この起点からたどれない構造：${g.length}件`,"structure-unreachable");const h=[...o.mappings.values()].filter(S=>S.nullable===null).length;h&&$e(r,"p",`null許容が未決：${h}項目（互換・移行用を含む）`,"structure-pending");const p=document.createElement("div");p.className="structure-tree",p.setAttribute("aria-label","構造のツリー"),r.append(p);const x=document.createElement("p");x.className="structure-filter-empty",x.hidden=!0,x.textContent="互換・移行用の構造は非表示です。表示するにはフィルターをOFFにしてください。",p.before(x);const M=document.createElement("p");M.className="structure-filter-empty",M.hidden=!0,M.setAttribute("role","status"),M.textContent="検索結果は0件です。",p.before(M);let w=null,D,I,y;const z=S=>JSON.stringify(S.kind==="attribute"?["attribute",S.conceptId,S.informationId]:["structure",S.conceptId,S.fromId??"",S.relationId??""]),R=S=>{S.classList.add("structure-selected"),S.setAttribute("aria-current","true")},A=()=>{p.querySelectorAll(".structure-selected").forEach(N=>{N.classList.remove("structure-selected"),N.removeAttribute("aria-current")});const S=y&&p.contains(y)&&y.dataset.structureSelection===D?y:Array.from(p.querySelectorAll("[data-structure-selection]")).find(N=>N.dataset.structureSelection===D);S&&(y=S,R(S))},T=(S,N,j="select")=>{I=S,D=z(S),y=N,p.querySelectorAll(".structure-selected").forEach(B=>{B.classList.remove("structure-selected"),B.removeAttribute("aria-current")}),R(N),n.select?.({...S,hideLegacy:f.checked},j)},q=(S,N,j,B)=>{const re=o.nodes.get(S),Z=document.createElement("li");Z.className="structure-item",Z.dataset.conceptId=S;const ue=j?i.relation(j.relation.id,S):i.concept(S);ue&&(Z.dataset.compatibility=ue.kind);const ie=Object.hasOwn(o.conceptNames,S)?o.conceptNames[S]:void 0,me=ie&&typeof ie=="object"&&!Array.isArray(ie)?ie:{},E=typeof me.typeName=="string"&&!!me.typeName.trim(),P=E?me.typeName:re.name,U=E&&typeof me.logicalName=="string"&&me.logicalName.trim()?me.logicalName:"",de=he=>re.information.filter(Ae=>he||i.field(Ae.id,S)?.kind!=="legacy").flatMap(Ae=>[Ae.name,o.mappings.get(Ae.id)?.physicalName??""]),Y=he=>[re.name,P,U,re.id,...de(he),j?.roleName??"",...j?.fieldDetails.flatMap(Ae=>[Ae.name,Ae.physicalName])??[],...j?.fields??[],j?.relation.condition??""].join(" ").toLocaleLowerCase();Z.dataset.searchText=Y(!0),Z.dataset.searchVisibleText=Y(!1),j&&(Z.dataset.relationId=j.relation.id,Z.dataset.relationDirection=j.direction);const Ie=(o.edges.get(S)??[]).some(he=>he.direction==="owner"&&!!he.roleName)&&j?.direction==="reference",ve=Ie?S+"\0reference":S,le=N.has(S),ke=!!B?.has(ve),qe=ke||!!B?.has(Ie?S:S+"\0reference"),ge=document.createElement("summary");ge.className="structure-node-row",ge.append(Xs(j?.direction==="reference"||j?.direction==="owner"?Xa:_a,j?Xn[j.direction]:"構造")),Kr(ge,ue);const Re={kind:"structure",conceptId:S,...j?{fromId:j.from,relationId:j.relation.id}:{}};if(ge.dataset.structureSelection=z(Re),ge.addEventListener("click",()=>T(Re,ge)),j&&(j.direction==="unknownOut"&&$e(ge,"span",Xn[j.direction],"structure-type"),$e(ge,"span",j.count,"structure-count"),ge.title=`${Xn[j.direction]}：移動先 ${j.count}／反対側 ${j.reverseCount}${j.relation.condition?" — "+j.relation.condition:""}${j.fields.length>j.visibleFields.length?" — 物理項目："+j.fields.join("、"):""}`),j){const he=j.fieldDetails.length?j.fieldDetails:[void 0],Ae=tt=>{const nt=document.createElement("span");nt.className="structure-element",ge.append(nt),$e(nt,"strong",tt)};j.roleName&&he.length===1?Ae(j.roleName):(j.roleName&&Ae(j.roleName),he.forEach((tt,nt)=>{(nt||j.roleName)&&$e(ge,"span","／"),Ae(tt?.name?.trim()||"名前未定義")}))}else $e(ge,"strong",U||re.name);(le||qe)&&$e(ge,"span","既出","structure-seen");const Dt=(o.edges.get(S)??[]).some(he=>qi.includes(he.direction)||he.direction==="owner"&&!!he.roleName&&!(j?.direction==="owned"&&j.relation.id===he.relation.id&&j.from===he.to)),We=document.createElement("details");We.className="structure-node"+(Dt?"":" structure-leaf"),We.append(ge),Z.append(We);let bo=!1;const go=new Set(N);go.add(S);const Qe=he=>{if(bo)return;bo=!0;const Ae=document.createElement("ul");Ae.className="structure-children",We.append(Ae);for(const tt of[...qi,"owner"]){const nt=(o.edges.get(S)??[]).filter(_e=>_e.direction===tt&&(tt!=="owner"||!!_e.roleName&&!(j?.direction==="owned"&&j.relation.id===_e.relation.id&&j.from===_e.to)));if(nt.length)for(const _e of nt)Ae.append(q(_e.to,go,_e,he))}p.contains(We)&&(A(),K())};return ge.addEventListener("keydown",he=>{if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(he.key)||he.altKey||he.ctrlKey||he.metaKey)return;he.preventDefault(),he.stopPropagation();const Ae=Array.from(p.querySelectorAll("summary")).filter(nt=>{if(nt.closest("[hidden]"))return!1;for(let _e=nt.parentElement?.parentElement;_e&&_e!==p;_e=_e.parentElement)if(_e instanceof HTMLDetailsElement&&!_e.open)return!1;return!0}),tt=Ae.indexOf(ge);he.key==="ArrowDown"?Ae[tt+1]?.focus():he.key==="ArrowUp"?Ae[tt-1]?.focus():he.key==="Home"?Ae[0]?.focus():he.key==="End"?Ae.at(-1)?.focus():he.key==="ArrowRight"&&Dt?We.open?We.querySelector(":scope > .structure-children > li:not([hidden]) > details > summary")?.focus():(We.open=!0,Qe()):he.key==="ArrowLeft"&&(We.open&&Dt?We.open=!1:Z.parentElement?.closest(".structure-item")?.querySelector(":scope > details > summary")?.focus())}),We.addEventListener("toggle",()=>{We.open&&Qe()}),B&&!ke&&!le&&(B.add(ve),We.open=!0,Qe(B)),Z},W=S=>{const N=document.createElement("ul");N.className="structure-root";const j=S?new Set:void 0;for(const B of s)N.append(q(B,new Set,void 0,j));if(p.replaceChildren(N),!S){const B=N.querySelector(".structure-node");B.open=!0,B.dispatchEvent(new Event("toggle"))}A()},K=()=>{const S=b.value.trim().toLocaleLowerCase();S&&!w?(w=p.firstChild,W(!0)):!S&&w&&(p.replaceChildren(w),w=null,A());const N=Array.from(p.querySelectorAll("[data-search-text]")).reverse(),j=new Set;for(const B of N){const re=(f.checked?B.dataset.searchVisibleText??B.dataset.searchText:B.dataset.searchText)?.includes(S)??!1;if(B.hidden=f.checked&&B.dataset.compatibility==="legacy"||!!S&&!re&&!j.has(B),!B.hidden){const Z=B.parentElement?.closest("[data-search-text]");Z&&j.add(Z)}}x.hidden=!!S||!f.checked||!s.every(B=>i.concept(B)?.kind==="legacy"),M.hidden=!S||Array.from(p.querySelectorAll(".structure-root > li")).some(B=>!B.hidden)};if(f.onchange=()=>{const S=p.querySelector(".structure-selected");f.checked&&S?.closest('[data-compatibility="legacy"]')?(D=void 0,I=void 0,n.clearSelection?.()):I&&n.select?.({...I,hideLegacy:f.checked},"filter"),K(),A()},u.onclick=()=>{w=null,b.value="",W(!0),K()},c.onclick=()=>{w=null,b.value="",W(!1);const S=p.querySelector(".structure-node");S&&(S.open=!1),K()},b.oninput=K,W(!1),n.autoSelect){const S=Array.from(p.querySelectorAll(".structure-root > .structure-item")).find(j=>!j.hidden),N=S?.querySelector(":scope > details > summary");S?.dataset.conceptId&&N&&T({kind:"structure",conceptId:S.dataset.conceptId},N,"initial")}}const Ln=["landscape","overview"],wn="structure-explorer";function Cd(e,t){const n=e.querySelector(".workspace"),o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const r=document.createElement("aside");r.id="design-explorer",r.setAttribute("aria-label","設計ナビゲーション"),r.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><div class="explorer-mode-tabs" role="tablist" aria-label="エクスプローラーの切替"><button type="button" role="tab" id="explorer-tab-document" aria-controls="explorer-document-panel">文章</button><button type="button" role="tab" id="explorer-tab-structure" aria-controls="explorer-structure-panel">構造</button></div><div id="explorer-document-panel" class="explorer-document-panel" role="tabpanel" aria-labelledby="explorer-tab-document"><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav></div><div id="explorer-structure-panel" class="explorer-structure-panel" role="tabpanel" aria-labelledby="explorer-tab-structure" hidden></div>',r.prepend(r.querySelector(".explorer-mode-tabs"));const l=document.createElement("div");l.className="shell-center",s.append(r,l),l.append(o,n);const u=document.createElement("div");u.className="shell-open-tabs",i.before(u),u.append(i),Ec(u);const c=document.createElement("nav");c.className="concept-tabs",c.setAttribute("aria-label","開いているサブシステムとデータ構造"),u.append(c);const a=document.createElement("nav");a.className="state-tabs",a.setAttribute("aria-label","開いている状態遷移"),u.append(a);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),u.append(f);const d=document.createElement("section");d.id="concept-workspace",d.hidden=!0,d.setAttribute("aria-label","データ構造"),d.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',l.append(d);const b=new Map,g=new Map,h=new Map,p=document.createElement("section");p.id="states-workspace",p.hidden=!0,p.setAttribute("aria-label","状態遷移"),p.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',l.append(p);const x=document.createElement("section");x.id="tests-workspace",x.hidden=!0,x.setAttribute("aria-label","テスト仕様"),x.innerHTML='<main class="test-spec-page"></main>',l.append(x);const M=document.createElement("aside");M.id="test-related-panel",M.className="spec-related",M.setAttribute("aria-label","関連資料"),M.hidden=!0,M.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const w=document.createElement("section");w.id="empty-workspace",w.hidden=!0,w.innerHTML="<p>左の一覧から図を開いてください。</p>",l.append(w);const D=n.querySelector("#node-list-drawer");r.append(D);const I=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),z=r.querySelector(".explorer-search input"),R=r.querySelector(".explorer-groups"),A=r.querySelector("#explorer-document-panel"),T=r.querySelector("#explorer-structure-panel"),q=r.querySelector("#explorer-tab-document"),W=r.querySelector("#explorer-tab-structure"),K=d.querySelector("iframe"),S=d.querySelector(".concept-related"),N=p.querySelector("article"),j="alder-explorer-v1:"+location.pathname,B=location.protocol==="file:"||location.origin==="null"?"*":location.origin,re=window.__alderConceptHtml;let Z,ue,ie,me,E={},P=[],U=[...Ln],de=new Map,Y=new Map,be=new Map,Ie=new Map,ve=new Map;const le=m=>wn+":"+m,ke=m=>m===wn||ve.has(m),qe=m=>be.get(m)??m,ge=m=>Ie.get(m)??m,Re=m=>ue?.findGroup(de.get(m??"")),Dt=m=>ie?.contentFor(de.get(m)??""),We=(m,v)=>ie?.findDataExample(de.get(m)??"",v),bo=m=>ie?.examplesFor(de.get(m)??"")??[],go=m=>m===wn?"構造エクスプローラー":ve.has(m)?(Z?.model.concepts.find(v=>v.id===ve.get(m))?.name??m)+"・構造":Ln.includes(m)?"全体図":Dt(m)?.title??Re(m)?.name??E[Y.get(m)??""]?.name,Qe=()=>{const m=t.business(),v=m.design?.model;return v?[...v.checks,...m.relatedChecks??[]].filter(O=>O.basedOn.documentId===v.business.id):[]},he=()=>Ad(Z,Qe()),Ae=m=>he().find(v=>v.key===(m.startsWith("decision:")?m.slice(9):m)),tt=m=>he().filter(v=>v.name===m.name).length>1?m.name+"（"+(t.business().activities.find(v=>v.id===m.activityId)?.name??"その他")+"）":m.name,nt=m=>Qe().some(v=>v.index.some(O=>O.activityId===m)||v.sections.some(O=>O.activityId===m)),_e=m=>new Set(he().filter(v=>v.activityId===m).flatMap(v=>v.checkIds)),Cs=m=>{const v=new Set(he().filter(O=>O.activityId===m).flatMap(O=>O.decisionExampleIds));return new Set(Qe().flatMap(O=>O.examples.filter(C=>v.has(C.id)).map(C=>C.guaranteeId)))},Os=m=>{const v=_e(m),O=Cs(m);return Qe().some(C=>C.index.some($=>$.activityId===m&&$.checkIds.some(_=>!v.has(_)))||C.sections.some($=>$.activityId===m&&($.preamble.length>0||C.guarantees.some(_=>_.sectionId===$.id&&!O.has(_.id)))))},Na=()=>Qe().some(m=>m.items.some(v=>!m.index.some(O=>O.checkIds.includes(v.id)))||m.sections.some(v=>v.activityId===null)||m.notes.length>0),ja=m=>{const v=Ae(m);return v?v.capability.testSpecification?tt(v)+"・"+(m.startsWith("decision:")?"可否":"結果"):v.name:(m==="@unassigned"?"未割当":m.startsWith("remaining:")?t.business().activities.find(O=>O.id===m.slice(10))?.name:m.startsWith("checks:")?t.business().activities.find(O=>O.id===m.slice(7))?.name:m==="@overview"?"テスト仕様":void 0)??m},yo=n.querySelector("#formattedMarkdownDrawer");yo&&s.append(yo),s.append(S,M),Ii(r,s,j+":explorer-width","left"),Ii(S,s,j+":drawer-width"),Ii(M,s,j+":test-drawer-width");let vo=!1;const bt=t.rightDrawer??{isOpen:()=>vo,setOpen:m=>{vo=m}};let se="business",Le=!1,it=[],F="overview",st=[],gt="",yt=[],Pe="@overview",Nn,Ht=innerWidth>800,wo=!1,ko=!0,vt=!1,Hn,rt="document",Gn=wn;const wt=new Map,At=new Map([["overview",K]]),pt=new Map,bn=new Map,gn=new Map,Ue=new Map,on=new Map,Et=new Set,Xe=new Set,yn=new Set,Ve=new Map;let xe;try{if(xe=JSON.parse(sessionStorage.getItem(j)||"null"),xe){if(vt=xe.overviewClosed===!0,Hn=typeof xe.documentKey=="string"?xe.documentKey:void 0,Ht=typeof xe.left=="boolean"?xe.left:Ht,rt=xe.explorerMode==="structure"?"structure":"document",Array.isArray(xe.expanded)){Xe.clear();for(const m of xe.expanded)typeof m=="string"&&Xe.add(m)}st=Array.isArray(xe.states)?xe.states.filter(m=>typeof m=="string"):[],t.rightDrawer||(typeof xe.rightOpen=="boolean"?vo=xe.rightOpen:typeof xe.right?.["concept:"+xe.active]=="boolean"&&(vo=xe.right["concept:"+xe.active]))}}catch{}function Ma(){if(!(!xe||Hn!==t.business().key||!Le)){for(const m of Array.isArray(xe.overviewModes)?xe.overviewModes:[])Re(m)&&Et.add(m);for(const[m,v]of Object.entries(xe.lastExamples??xe.examples??{}))typeof v=="string"&&We(m,v)&&on.set(m,v);for(const[m,v]of Object.entries(xe.examples??{}))typeof v=="string"&&We(m,v)&&Ue.set(m,v);for(const[m,v]of Object.entries(xe.selected??{}))typeof v=="string"&&P.includes(v)&&pt.set(m,v);it=[...new Set((Array.isArray(xe.concepts)?xe.concepts:[]).filter(m=>typeof m=="string"&&U.includes(m)))],F=it.includes(xe.active)?xe.active:"landscape"}}let vn;const Be=()=>{try{sessionStorage.setItem(j,JSON.stringify({documentKey:Nn,overviewClosed:vt,selected:Object.fromEntries(pt),examples:Object.fromEntries(Ue),lastExamples:Object.fromEntries(on),overviewModes:[...Et],left:Ht,explorerMode:rt,expandedVersion:4,expanded:[...Xe],concepts:it,active:F,states:st,specs:yt,activeSpec:Pe,specExamples:Object.fromEntries(wt),...t.rightDrawer?{}:{rightOpen:bt.isOpen()}}))}catch{}},sn=()=>{se==="concept"&&ke(F)?Ve.set("structure:"+F,g.get(F)?.scrollTop??0):se==="concept"&&Ve.set("drawer:"+F,S.querySelector(".concept-drawer-body").scrollTop),se==="concept"&&bt.isOpen()&&Et.has(F)&&Ve.set("review-overview:"+F,S.querySelector(".data-review-overview").scrollTop),se==="concept"&&Ue.has(F)&&Ve.set("example:"+F+":"+Ue.get(F),S.querySelector(".data-examples-panel").scrollTop),se==="states"&&gt&&Ve.set("state:"+gt,N.scrollTop),se==="tests"&&Ve.set("tests:"+Pe,x.querySelector(".test-spec-page").scrollTop),se==="concept"&&F==="landscape"&&Ve.set("concept:landscape",d.querySelector(".concept-review-landscape").scrollTop)};function Ze(m=!0){if(wo)return;const v=new URL(location.href);if(v.searchParams.set("view",se),v.searchParams.delete("concept"),v.searchParams.delete("dataExample"),v.searchParams.delete("dataView"),se==="concept"&&bt.isOpen()&&Et.has(F)?v.searchParams.set("dataView","overview"):se==="concept"&&Re(F)&&!Ue.has(F)&&v.searchParams.set("dataView","structure"),se==="concept"&&bt.isOpen()&&Ue.has(F)&&v.searchParams.set("dataExample",Ue.get(F)),se==="tests"&&wt.has(Pe)&&v.searchParams.set("dataExample",wt.get(Pe)),v.searchParams.delete("state"),v.searchParams.delete("activity"),v.searchParams.delete("object"),v.searchParams.delete("spec"),se==="concept"&&v.searchParams.set("concept",F),se==="states"&&gt&&v.searchParams.set("state",gt),se==="tests"&&v.searchParams.set("spec",Pe),se==="business"){const O=t.business(),C=O.views?.find($=>$.key===O.viewKey);C?.activity?v.searchParams.set("activity",C.activity):C?.object&&v.searchParams.set("object",C.object)}v.href!==location.href&&history[m?"pushState":"replaceState"]({alderShell:!0},"",v)}function je(m,v,O){const C=document.createElement(v);return C.textContent=O,m.append(C),C}function kt(m){m!==se&&(se==="business"?t.capture():sn(),se=m),n.hidden=se!=="business",d.hidden=se!=="concept",p.hidden=se!=="states",x.hidden=se!=="tests",w.hidden=se!=="empty",e.dataset.workspaceArea=se,se==="business"&&t.refresh(),Nt(),It()}function Ct(m,v=!0){Le&&(m==="subsystems"&&(m="landscape"),U.includes(m)&&(sn(),it.includes(m)||it.push(m),F=m,ke(m)&&(rt="structure",Gn=m),kt("concept"),yi(),Ot(),Be(),v&&Ze()))}function La(){sn(),Ue.delete(F),Et.add(F),yi(),S.querySelector(".concept-drawer-body").scrollTop=Ve.get("drawer-overview:"+F)??0,Be(),Ze()}function Da(m,v=!0){if(m&&!We(F,m))return;const O=!Ue.has(F),C=S.querySelector(".concept-drawer-body");O&&Ve.set("drawer-overview:"+F,C.scrollTop),sn(),Et.delete(F),m?(Ue.set(F,m),on.set(F,m)):Ue.delete(F),bt.setOpen(!0),yi(),O&&(C.scrollTop=0),Be(),Ze(),v&&S.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}S.querySelector(".concept-example-back").onclick=()=>{La(),S.querySelector(".data-review-overview").focus({preventScroll:!0})};function jn(m,v=!0){t.business().states?.some(O=>O.id===m)&&(sn(),st.includes(m)||st.push(m),gt=m,kt("states"),Ua(),Ot(),Be(),v&&Ze())}function fi(m){return m.startsWith("decision:")&&Ae(m)&&!Ae(m)?.capability.testSpecification?Ae(m).key:Ae(m)||m==="@overview"||m==="@unassigned"||m.startsWith("checks:")&&nt(m.slice(7))||m.startsWith("remaining:")&&Os(m.slice(10))?m:t.business().activities.some(v=>v.id===m)?he().find(v=>v.activityId===m)?.key??(nt(m)?"checks:"+m:"@overview"):"@overview"}function Rt(m,v=!0){const O=t.business();if(!O.design?.model||!O.key)return;m=fi(m),se==="tests"&&m!==Pe&&sn(),yt.includes(m)||yt.push(m),Pe=m;const C=Ae(m);wo||(C?.capability.testSpecification?Xe.add("tests-function-"+C.key):C?.activityId?Xe.add("tests-activity-"+C.activityId):m.startsWith("checks:")?Xe.add("tests-activity-"+m.slice(7)):m.startsWith("remaining:")?Xe.add("tests-activity-"+m.slice(10)):C&&Xe.add("tests-other")),kt("tests"),pi(),Ot(),It(),Be(),v&&Ze()}function pi(){const m=t.business().design;if(!m?.model)return;const v=x.querySelector(".test-spec-page"),O=Ae(Pe);if(O){const C=document.createElement("section");C.className="test-spec-sample";const $=ue?.findGroup(O.groupId),_=O.samples.find(fe=>fe.id===wt.get(Pe))??O.samples[0],V=!!O.capability.testSpecification,ee=Pe.startsWith("decision:");if(V)if(je(C,"h2",O.name),je(C,"h3",ee?"可否判定":"処理結果"),ee)O.decisionExampleIds.length?C.append(Id(m,O.decisionExampleIds,Qe())):O.decisionCheckIds.length?C.append(Sd(m,O.decisionCheckIds,Qe())):je(C,"p","可否条件の記載はありません。");else{const fe=$&&_&&ie?new Set(O.samples.flatMap(Me=>Me.checkIds??[])):new Set;if(C.append(xd(m,O.resultCheckIds,Qe(),fe)),$&&_&&ie){je(C,"h3","データ例");const Me=document.createElement("div");Me.className="data-examples-panel test-spec-examples",C.append(Me),ie.renderDataExample(Me,$,_.id,He=>{Ve.set("tests:"+Pe,v.scrollTop),wt.set(Pe,He),pi(),Be(),Ze(),x.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:O.capability.id,sampleIds:O.samples.map(He=>He.id),hideCapability:!0,hideSinglePicker:!0})}}else if($&&_&&ie){const fe=document.createElement("div");fe.className="data-examples-panel test-spec-examples",C.append(fe),ie.renderDataExample(fe,$,_.id,Me=>{Ve.set("tests:"+Pe,v.scrollTop),wt.set(Pe,Me),pi(),Be(),Ze(),x.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:O.capability.id,heading:O.name,sampleIds:O.samples.map(Me=>Me.id),renderSpecification:Me=>Me.append(vd(m,_.checkIds??[],Qe()))})}v.replaceChildren(C)}else if(Pe==="@overview")v.replaceChildren(),je(v,"p","左のメニューからテスト仕様を選択してください。");else if(Pe.startsWith("remaining:")){const C=Pe.slice(10);v.replaceChildren(Js(m,C,Qe(),_e(C),Cs(C)))}else v.replaceChildren(Js(m,Pe.startsWith("checks:")?Pe.slice(7):void 0,Qe()));Ta(O),v.scrollTop=Ve.get("tests:"+Pe)??0}function Kn(m){m||(vt=!1),kt("business"),m?t.openActivity(m):(vt=!1,t.openOverview()),It(),Ot(),Ze()}function Ra(m){kt("business"),t.openObject(m),It(),Ot(),Ze()}function Ns(m){const v=t.business(),O=v.design?.model;return O?[...new Set(O.states.filter(C=>C.objectId===m&&C.basedOn.documentId===O.business.id&&C.basedOn.revision===O.business.revision).flatMap(C=>C.transitions.map($=>$.activityId)))]:[...new Set((v.design?.objectStateTransitions?.[m]?.model?.transitions??[]).flatMap(C=>C.activityId?[C.activityId]:[]))]}function js(m){return(t.business().states??[]).filter(v=>Ns(v.id).includes(m))}function Ms(m){const v=t.business(),O=v.design?.model,C=Z?.model.concepts.find($=>$.id===m);return!O||!Z||!C?[]:(v.states??[]).filter($=>C.businessObjectIds.includes($.id)&&O.states.some(_=>_.objectId===$.id&&_.basedOn.documentId===O.business.id&&_.basedOn.revision===O.business.revision&&Z.model.relatedStates.some(V=>V.documentId===_.id&&V.revision===_.revision)))}function mi(m,v,O="状態遷移"){if(!v.length)return;const C=document.createElement("section");C.className="shell-related-links",je(C,"h3",O);for(const $ of v){const _=Gt(C,$.name,()=>jn($.id));_.dataset.relatedState=$.id}m.append(C)}function Ls(m){const v=Z?.model.reviewGroups.find(C=>C.id===m.groupId);if(!v)return[];const O=new Set(v.graph.nodes.map(C=>C.conceptId));return[...new Set(m.samples.flatMap(C=>C.blocks.map($=>$.card)))].filter(C=>O.has(C)&&Z?.model.concepts.some($=>$.id===C))}function Gt(m,v,O){const C=document.createElement("button");return C.type="button",C.className="shell-evidence",je(C,"span",v),C.onclick=O,m.append(C),C}function hi(m,v){const O=v.filter($=>$.capability.testSpecification);if(!O.length)return;const C=document.createElement("section");C.className="shell-test-links",je(C,"h3","テスト仕様書");for(const $ of O)for(const[_,V]of[["decision:","可否判定"],["","処理結果"]]){const ee=_+$.key,fe=Gt(C,tt($)+"・"+V,()=>Rt(ee));fe.dataset.relatedSpec=ee}m.append(C)}function Pa(m,v){const O=he().filter(ee=>ee.activityId===v&&ee.capability.testSpecification),C=Z?.model.presentation.activityViews,$=Array.isArray(C)?C.find(ee=>ee&&typeof ee=="object"&&ee.activityId===v):void 0,_=Array.isArray($?.uncreatedTestSections)?$.uncreatedTestSections:[],V=m.querySelectorAll("[data-business-result],[data-business-exception]");for(const ee of Array.from(V)){const fe=ee.dataset.businessException,Me=fe?"exception":"result",He=fe??"result",Ge=O.flatMap(at=>at.businessSections.filter(Tt=>Tt.kind===Me&&(Me==="result"||Tt.exceptionId===fe)).flatMap(Tt=>Tt.pages.filter(G=>G==="decision"?at.decisionCheckIds.length||at.decisionExampleIds.length:at.resultCheckIds.length||at.samples.length).map(G=>({target:at,page:G})))),Pt=document.createElement("section");Pt.className="shell-section-links",Pt.setAttribute("aria-label","テスト仕様書");const mt=new Set;for(const{target:at,page:Tt}of Ge){const G=(Tt==="decision"?"decision:":"")+at.key;if(mt.has(G))continue;mt.add(G);const Ce=Gt(Pt,tt(at)+"・"+(Tt==="decision"?"可否判定":"処理結果"),()=>Rt(G));Ce.dataset.relatedSpec=G}if(!mt.size){const at=je(Pt,"p",_.includes(He)?"テスト仕様書未作成":"テスト仕様書との対応未確認");at.className="shell-spec-warning"}ee.after(Pt)}hi(m,O.filter(ee=>!ee.businessSections.length))}function Ta(m){const v=M.querySelector(".spec-related-content");if(v.replaceChildren(),!m?.capability.testSpecification)return;const O=t.business().activities.find(_=>_.id===m.activityId),C=ue?.findGroup(m.groupId);if(O){je(v,"h3","Activity");const _=Gt(v,O.name,()=>Kn(O.id));_.dataset.relatedActivity=O.id}if(C){je(v,"h3","概念モデル");const _=Gt(v,C.name,()=>Ct(qe(C.id)));_.dataset.relatedGroup=C.id}const $=Ls(m);if($.length){je(v,"h3","概念");for(const _ of $){const V=Z.model.concepts.find(fe=>fe.id===_),ee=Gt(v,V.name,()=>Ct(ge(_)));ee.dataset.relatedConcept=_}}m.activityId&&mi(v,js(m.activityId),"状態遷移（同じ Activity）")}function qa(m,v){je(m,"h3","Activity");const O=t.business(),C=Re(F),$=Z?.model.concepts.find(V=>V.id===v),_=C?.concepts[v]?.sourceActivities??C?.activities??$?.activityLinks.filter(V=>V.uses.includes("生成")).map(V=>V.activityId)??[];for(const V of _){const ee=O.activities.find(Me=>Me.id===V);if(!ee)continue;const fe=document.createElement("button");fe.className="shell-evidence",je(fe,"span",ee.name),fe.title=ee.name+"を業務タブで開く",fe.setAttribute("aria-label",fe.title),fe.onclick=()=>Kn(ee.id),m.append(fe)}}function bi(m){const v=Re(m);return v?ue?.graph(v.id):m==="overview"?ue?.overviewGraph():void 0}function Ds(m){const v=bn.get(F),O=v?bi(F)?.tables[v]:void 0;return O?.conceptId===m?O:void 0}function Wa(m,v){const O=Ds(v)??Re(F)?.concepts[v]??{...E[v],sources:void 0};m.replaceChildren(),je(m,"p",O.note),je(m,"h3","持つ情報");const C=document.createElement("ul");for(const[,$]of O.fields)je(C,"li",$);if(m.append(C),O.sources?.length){je(m,"h3","情報の出所・対象時点");const $=document.createElement("ul");for(const _ of O.sources)je($,"li",_);m.append($)}qa(m,v),hi(m,he().filter($=>Ls($).includes(v))),mi(m,Ms(v))}function gi(m){const v=S.querySelector(".shell-heading strong");v.textContent=m,S.setAttribute("aria-label",m)}function Rs(m=!1){Re(F)&&(pt.delete(F),bn.delete(F),gn.delete(F),m||At.get(F)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},B),Io(),Nt(),S.querySelector(".concept-drawer-body").scrollTop=0,Be())}S.querySelector(".concept-selection-clear").onclick=()=>{Rs(),Ue.has(F)?S.querySelector(".concept-example-back").focus({preventScroll:!0}):S.querySelector(".data-review-overview").focus({preventScroll:!0})};function Io(){const m=S.querySelector(".concept-related-content");if(ke(F))return;S.querySelector(".concept-selection").hidden=!!Re(F)&&!pt.has(F)&&!gn.has(F),S.querySelector(".concept-selection>h2").hidden=!Re(F),S.querySelector(".concept-selection-clear").hidden=!Re(F);const v=gn.get(F);if(v&&me){const _=me.describe(m,{kind:"group",id:v});gi(_);return}if(F==="landscape"&&vn){m.replaceChildren();for(const[_,V]of me.sections){je(m,"h3",_);const ee=document.createElement("ul");for(const fe of V)je(ee,"li",fe);m.append(ee)}gi("サブシステムの情報");return}const O=pt.get(F),C=Re(F),$=Le&&O?Ds(O)?.name??C?.concepts[O]?.name??E[O].name:C?.name??"データ構造の情報";gi($),Le&&O?Wa(m,O):(m.replaceChildren(),C||je(m,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function So(m,v=!1){const O=g.get(m);if(!O||!Z)return;const C=O.querySelector(".structure-detail-content");Jr(C,Z.model,h.get(m),$=>{h.set(m,$),Ve.set("structure:"+m,0),So(m,!0)}),v&&(O.scrollTop=0)}function Ps(m){if(!(!Z||!Le||!ke(m))){if(!g.has(m)){const v=document.createElement("article");v.className="structure-detail-page",v.hidden=se!=="concept"||F!==m,v.setAttribute("aria-label","構造の詳細"),je(v,"h1","構造の詳細");const O=document.createElement("div");O.className="structure-detail-content",v.append(O),d.querySelector(".concept-main").append(v),g.set(m,v)}if(!b.has(m)){const v=document.createElement("article");v.setAttribute("aria-label","構造エクスプローラー"),T.append(v),b.set(m,v),Ed(v,Z.model,{rootId:ve.get(m),autoSelect:se==="concept"&&F===m&&!h.has(m),select:(O,C)=>{h.set(m,O),C==="select"&&Ve.set("structure:"+m,0),C==="select"&&(se!=="concept"||F!==m)?Ct(m):se==="concept"&&F===m&&So(m,C!=="filter")},clearSelection:()=>{h.delete(m),se==="concept"&&F===m&&So(m)}})}}}function Ts(m){m.onload=()=>{zs(),m.contentDocument&&(Vs(m.contentDocument),Bs(m.contentDocument));const v=m.dataset.conceptView??"overview";if(!ue||!Z)return;const O=Re(v),C=O?ue.graph(O.id):v==="overview"?ue.overviewGraph():{ids:P,edges:ue.edges,tables:E};m.contentWindow?.postMessage({type:"alder-concept-data",graph:C,focus:Y.get(v),viewKey:v,documentKey:Nn??Z.model.id,clearSelectionOnBackground:!!O},B);const $=pt.get(v);$&&m.contentWindow?.postMessage({type:"alder-concept-highlight",id:$},B)}}Ts(K),K.dataset.conceptView="overview";function za(){S.querySelector(".concept-page-details").hidden=!0,S.querySelector(".concept-example-back").hidden=!0;const m=S.querySelector(".data-review-overview");m.hidden=!0,m.replaceChildren();const v=S.querySelector(".data-examples-panel");v.hidden=!0,v.replaceChildren(),delete v.dataset.dataExample,vn?.root.remove(),vn=void 0;for(const[O,C]of At)O!=="overview"&&(C.remove(),At.delete(O));for(const O of b.values())O.remove();for(const O of g.values())O.remove();b.clear(),g.clear(),h.clear(),Gn=wn,K.removeAttribute("src"),K.removeAttribute("srcdoc"),pt.clear(),bn.clear(),gn.clear()}function yi(){d.setAttribute("aria-label",F==="landscape"||Re(F)?"サブシステム":"データ構造"),d.querySelector(".concept-empty").hidden=Le;const m=d.querySelector(".concept-review-landscape"),v=Re(F),O=S.querySelector(".concept-page-details"),C=S.querySelector(".data-review-overview"),$=S.querySelector(".data-examples-panel");if(O.hidden=!Le||!v,C.hidden=!Le||!v||Ue.has(F),$.hidden=!Le||!v||!Ue.has(F),S.querySelector(".concept-example-back").hidden=$.hidden,Le&&v){const V=he();Lc(C,v,ie,(fe,Me)=>{const He=_s(V,v.id,fe,Me);if(He)return{kind:He.kind,open:()=>{const Ge=_s(he(),v.id,fe,Me);Ge&&(Ge.sampleId?wt.set(Ge.key,Ge.sampleId):wt.delete(Ge.key),Rt(Ge.key))}}},fe=>Kn(fe),t.business().activities),hi(C,V.filter(fe=>fe.groupId===v.id));const ee=Ue.get(F)??on.get(F)??bo(F)[0]?.id;ee&&ie.renderDataExample($,v,ee,fe=>Da(fe)),C.scrollTop=Ve.get("review-overview:"+F)??0,$.scrollTop=Ve.get("example:"+F+":"+ee)??0}m.hidden=!Le||!Ln.includes(F),Le&&ke(F)&&(Ps(F),So(F));for(const[V,ee]of g)ee.hidden=!Le||V!==F;for(const[V,ee]of b)ee.hidden=!Le||V!==Gn;if(Le&&Ln.includes(F)&&(F==="landscape"&&!vn&&(vn=Wc(document,Z,Nn??Z.model.id,V=>Ct(qe(V)))),Mc(m,vn?.root,F==="overview"?"graph":"overview"),F==="landscape"&&vn?.restore()),Le&&F!=="landscape"&&!ke(F)&&!At.has(F)){const V=document.createElement("iframe");V.className="concept-frame",V.dataset.conceptView=F,V.title=v?v.name+"のデータ構造":E[Y.get(F)].name+"と隣接する概念",V.hidden=!0,At.set(F,V);const ee=Y.get(F);ee&&pt.set(F,pt.get(F)??ee),Ts(V),d.querySelector(".concept-main").append(V)}for(const[V,ee]of At)ee.hidden=!Le||V!==F,Le&&V===F&&!ee.hasAttribute("src")&&!ee.hasAttribute("srcdoc")&&(re?ee.srcdoc=re:ee.src=new URL("concept.html?view=overview"+(Re(V)?"&group="+encodeURIComponent(Re(V).id):V==="overview"?"":"&focus="+encodeURIComponent(Y.get(V))),document.baseURI).href);const _=pt.get(F);if(_&&At.get(F)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:_},B),Io(),Nt(),ke(F)){const V=g.get(F);V&&(V.scrollTop=Ve.get("structure:"+F)??0)}else S.querySelector(".concept-drawer-body").scrollTop=Ve.get("drawer:"+F)??0}function Mn(){const m=t.business(),v=m.views?.find(O=>O.activity!==void 0||O.object!==void 0||!vt);v?(kt("business"),t.activateView(v.key)):it.length?Ct(it.at(-1),!1):st.length?jn(st.at(-1),!1):yt.length?Rt(yt.at(-1),!1):kt("empty")}function $a(){if(vt=!0,se==="business"){const m=t.business().views?.find(v=>v.key===t.business().viewKey);!m?.activity&&!m?.object&&Mn()}Ot(),It(),Be(),Ze(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function Ua(){N.replaceChildren();const m=t.business().states?.find(ee=>ee.id===gt);if(!m)return;const v=t.statePanel(m.id);v?N.append(v):je(N,"p","この対象の状態遷移は未定義です。");const O=M.querySelector(".spec-related-content");O.replaceChildren();const C=Ns(m.id),$=t.business().activities.filter(ee=>C.includes(ee.id));if($.length){je(O,"h3","Activity");for(const ee of $){const fe=Gt(O,ee.name,()=>Kn(ee.id));fe.dataset.relatedActivity=ee.id}}const _=Z?.model.concepts.filter(ee=>Ms(ee.id).some(fe=>fe.id===m.id))??[];if(_.length){je(O,"h3","概念");for(const ee of _){const fe=Gt(O,ee.name,()=>Ct(ge(ee.id)));fe.dataset.relatedConcept=ee.id}}const V=he().filter(ee=>ee.activityId&&C.includes(ee.activityId)&&ee.capability.testSpecification);if(V.length){je(O,"h3","Activity に関連するテスト仕様書");for(const ee of V)for(const[fe,Me]of[["decision:","可否判定"],["","処理結果"]]){const He=fe+ee.key,Ge=Gt(O,tt(ee)+"・"+Me,()=>Rt(He));Ge.dataset.relatedSpec=He}}N.scrollTop=Ve.get("state:"+gt)??0}let vi="";function Ot(){for(const C of Array.from(i.querySelectorAll(".tab"))){const $=t.business().views?.find(V=>V.key===C.dataset.key);C.hidden=vt&&$?.activity===void 0&&$?.object===void 0;const _=!C.hidden&&se==="business"&&C.dataset.key===t.business().viewKey;C.classList.toggle("active",_),C.querySelector("button")?.setAttribute("aria-current",String(_))}const m=(C,$,_)=>{C.replaceChildren();for(const V of $){const ee=_==="concept"?go(V):t.business().states?.find(mt=>mt.id===V)?.name??V,fe=se===_&&V===(_==="concept"?F:gt),Me=document.createElement("div");Me.className="tab"+(fe?" active":"");const He=_==="concept"&&(V==="landscape"||Re(V))?"subsystems":_;Me.dataset.viewKind=He;const Ge=document.createElement("button");Ge.id=(_==="concept"?"concept-tab-":"state-tab-")+V,Li(Ge,He,ee),Ge.setAttribute("aria-current",String(fe)),Ge.onclick=()=>_==="concept"?Ct(V):jn(V),Me.append(Ge);const Pt=Di((He==="subsystems"?"サブシステム：":_==="concept"?"データ構造：":"状態遷移：")+ee+"のタブを閉じる");Pt.onclick=()=>{sn(),_==="concept"?(it=it.filter(mt=>mt!==V),V!=="overview"&&(At.get(V)?.remove(),At.delete(V)),pt.delete(V),bn.delete(V),gn.delete(V),Ue.delete(V),on.delete(V),Et.delete(V),se===_&&F===V&&(it.length?Ct(it.at(-1),!1):Mn())):(st=st.filter(mt=>mt!==V),se===_&&gt===V&&(st.length?jn(st.at(-1),!1):Mn())),Ot(),It(),Be(),Ze(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Me.append(Pt),C.append(Me)}};m(c,it,"concept"),m(a,st,"states"),f.replaceChildren();for(const C of yt){const $=ja(C),_=document.createElement("div");_.className="tab"+(se==="tests"&&C===Pe?" active":""),_.dataset.viewKind="tests";const V=document.createElement("button");V.id="spec-tab-"+C,Li(V,"tests",$),V.setAttribute("aria-current",String(se==="tests"&&C===Pe)),V.onclick=()=>Rt(C);const ee=Di("テスト仕様："+$+"のタブを閉じる");ee.onclick=()=>{yt=yt.filter(fe=>fe!==C),se==="tests"&&Pe===C&&(yt.length?Rt(yt.at(-1),!1):Mn()),Ot(),It(),Be(),Ze()},_.append(V,ee),f.append(_)}const v=u.querySelector(".tab.active:not([hidden])"),O=se==="business"?"business:"+t.business().viewKey:se==="concept"?"concept:"+F:se==="states"?"states:"+gt:se==="tests"?"tests:"+Pe:"";v?(O!==vi&&Cc(u,v),vi=O):vi=""}function Fa(){innerWidth<=800&&xo(!1)}function It(){const m=R.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,v=R.scrollTop,O=t.business(),C=z.value.trim().toLocaleLowerCase();R.replaceChildren();const $=(G,Ce,ct)=>({kind:"item",id:G,name:Ce,key:ct}),_=(G,Ce,ct)=>({kind:"group",id:G,name:Ce,children:ct}),V=he(),ee=G=>$(G.key,G.name,"tests:"+G.key),fe=V.filter(G=>G.capability.testSpecification),Me=V.filter(G=>!G.capability.testSpecification),He=fe.map(G=>_("tests-function-"+G.key,tt(G),[$("decision:"+G.key,"可否判定","tests:decision:"+G.key),$(G.key,"処理結果","tests:"+G.key)]));for(const G of O.activities){const Ce=Me.filter(ot=>ot.activityId===G.id).map(ee),ct=(_e(G.id).size?"remaining:":"checks:")+G.id;Os(G.id)&&Ce.push($(ct,"その他","tests:"+ct)),Ce.length&&He.push(_("tests-activity-"+G.id,G.name,Ce))}const Ge=Me.filter(G=>!G.activityId);Ge.length&&He.push(_("tests-other","その他",Ge.map(ee))),Na()&&He.push($("@unassigned","未割当","tests:@unassigned"));const Pt=[{id:"business",label:"業務設計",items:[$("overview","全体図","business:overview"),_("business-activity","Activity",O.activities.map(G=>$(G.id,G.name,"business:"+G.id))),_("business-object","Object",(O.objects??[]).map(G=>$(G.id,G.name,"object:"+G.id)))]},{id:"states",label:"状態遷移",items:(O.states??[]).map(G=>$(G.id,G.name,"states:"+G.id))},{id:"subsystems",label:"サブシステム",items:Z?.model.subsystems.length?[$("landscape","全体図","concept:landscape"),...Z.model.subsystems.map(G=>_("subsystem-"+G.id,G.name.replace(/サブシステム$/,""),Z.model.reviewGroups.filter(Ce=>Ce.subsystemId===G.id).map(Ce=>$(qe(Ce.id),Ce.title,"concept:"+qe(Ce.id)))))]:[]},{id:"concept",label:"データ構造",items:Le&&P.length?[$("overview","全体図","concept:overview"),_("concept-relations","概念",P.map(G=>$(ge(G),E[G].name,"concept:"+ge(G))))]:[]},{id:"tests",label:"テスト仕様",items:O.design?.model&&(V.length||Qe().length)?He:[]}];let mt=0;const at=(G,Ce,ct)=>{const ot=document.createElement("button");ot.className="explorer-item"+(ct?" explorer-item-nested":""),ot.dataset.explorerKey=G.key,ot.textContent=G.name;const Ye=O.views?.find(Ke=>Ke.key===O.viewKey);return se===(Ce.id==="subsystems"?"concept":Ce.id)&&(["concept","subsystems"].includes(Ce.id)?G.id===F:Ce.id==="states"?G.id===gt:Ce.id==="tests"?G.id===Pe:G.key.startsWith("object:")?Ye?.object===G.id:G.id==="overview"?!vt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===G.id)&&ot.setAttribute("aria-current","page"),ot.disabled=Ce.id==="business"&&!O.key,ot.onclick=()=>{D.hidden||t.closeLegacyList(),Ce.id==="business"?G.key.startsWith("object:")?Ra(G.id):Kn(G.id==="overview"?void 0:G.id):Ce.id==="concept"||Ce.id==="subsystems"?Ct(G.id):Ce.id==="tests"?Rt(G.id):jn(G.id),Fa()},ot},Tt=(G,Ce,ct,ot=!1)=>{const Ye=document.createElement("button"),qt=C?!yn.has(G):Xe.has(G);return Ye.className=(ct?"explorer-subparent":"explorer-parent")+(ot?" explorer-pending":""),Ye.dataset.explorerKey="group:"+G,je(Ye,"span",Ce).className="explorer-parent-label",ot?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(qt)),Ye.setAttribute("aria-controls","explorer-"+G),Ye.append(Ac(qt)),Ye.onclick=()=>{C?yn.has(G)?yn.delete(G):yn.add(G):(Xe.has(G)?Xe.delete(G):Xe.add(G),Be()),It()},Ye)};for(const G of Pt){const Ce=G.items.flatMap(Ke=>{if(Ke.kind==="item")return!C||(G.label+" "+Ke.name).toLocaleLowerCase().includes(C)?[Ke]:[];const rn=C?Ke.children.filter(ki=>(G.label+" "+Ke.name+" "+ki.name).toLocaleLowerCase().includes(C)):Ke.children;return!C||rn.length?[{...Ke,children:rn}]:[]});if(C&&!Ce.length)continue;const ct=G.id!=="business"&&!G.items.length,ot=document.createElement("section"),Ye=Tt(G.id,G.label,!1,ct),qt=document.createElement("div");qt.id="explorer-"+G.id,qt.hidden=ct||(C?yn.has(G.id):!Xe.has(G.id));for(const Ke of Ce){if(Ke.kind==="item"){qt.append(at(Ke,G,0)),mt++;continue}const rn=document.createElement("div");rn.id="explorer-"+Ke.id,rn.hidden=C?yn.has(Ke.id):!Xe.has(Ke.id),qt.append(Tt(Ke.id,Ke.name,!0),rn);for(const ki of Ke.children)rn.append(at(ki,G,1)),mt++;!Ke.children.length&&!C&&(je(rn,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ce.length&&!ct&&(je(qt,"p","項目がありません。").className="explorer-empty"),ot.append(Ye,qt),R.append(ot)}C&&!mt&&(je(R,"p","該当する項目はありません。").className="explorer-empty"),R.scrollTop=v,m&&Array.from(R.querySelectorAll("[data-explorer-key]")).find(G=>G.dataset.explorerKey===m)?.focus({preventScroll:!0})}function qs(){!Le&&rt==="structure"&&(rt="document"),W.disabled=!Le,q.setAttribute("aria-selected",String(rt==="document")),W.setAttribute("aria-selected",String(rt==="structure")),q.tabIndex=rt==="document"?0:-1,W.tabIndex=rt==="structure"?0:-1,A.hidden=rt!=="document",T.hidden=rt!=="structure",rt==="structure"&&Ps(Gn);for(const[m,v]of b)v.hidden=m!==Gn}function Ws(m){m==="structure"&&!Le||(rt=m,qs(),Be())}q.onclick=()=>Ws("document"),W.onclick=()=>Ws("structure"),r.querySelector(".explorer-mode-tabs").addEventListener("keydown",m=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(m.key))return;const v=m.key==="Home"||m.key==="ArrowLeft"?q:W;v.disabled||(m.preventDefault(),v.click(),v.focus({preventScroll:!0}))});function xo(m){Ht=m,Nt(),Be(),(m?r.querySelector(".shell-heading button"):I).focus({preventScroll:!0})}I.addEventListener("click",m=>{m.preventDefault(),m.stopImmediatePropagation(),xo(!Ht)},!0),r.querySelector(".shell-heading button").onclick=()=>xo(!1),z.oninput=()=>{yn.clear(),It()},r.addEventListener("keydown",m=>{if(m.key==="Escape"&&!m.defaultPrevented&&D.hidden&&(m.preventDefault(),m.stopPropagation(),xo(!1)),(m.key==="ArrowDown"||m.key==="ArrowUp")&&R.contains(document.activeElement)){const v=Array.from(R.querySelectorAll("button")).filter($=>!$.disabled&&!$.closest("[hidden]")),O=v.indexOf(document.activeElement),C=v[O+(m.key==="ArrowDown"?1:-1)];C&&(m.preventDefault(),C.focus())}}),y.addEventListener("click",m=>{se!=="business"&&(m.preventDefault(),m.stopImmediatePropagation(),!(se==="concept"&&ke(F))&&(se==="concept"||se==="states"||se==="tests"&&Ae(Pe)?.capability.testSpecification)&&(bt.setOpen(!bt.isOpen()),Nt(),Be(),Ze(!1)))},!0),S.querySelector(".shell-heading button").onclick=()=>{bt.setOpen(!1),Nt(),Be(),Ze(!1),y.focus({preventScroll:!0})},M.querySelector(".shell-heading button").onclick=()=>{bt.setOpen(!1),Nt(),Be(),Ze(!1),y.focus({preventScroll:!0})},window.addEventListener("message",m=>{if(m.origin!==location.origin&&!(location.protocol==="file:"&&m.origin==="null"))return;const v=Array.from(At).find(([,C])=>m.source===C.contentWindow);if(!v)return;if(m.data?.type==="alder-concept-rendered"){v[1].contentDocument&&(Vs(v[1].contentDocument),Bs(v[1].contentDocument));return}if(se!=="concept"||v[0]!==F)return;const O=Re(F);if(m.data?.type==="alder-concept-clear-selection"){O&&Rs(!0);return}if(m.data?.type==="alder-concept-subsystem"){if(!bi(F)?.regions.some(C=>C.id===m.data.id))return;pt.delete(F),bn.delete(F),gn.set(F,m.data.id),Io(),Nt(),Be();return}if(!(!P.includes(m.data?.id)||O&&!O.concepts[m.data?.id])){if(m.data.type==="alder-concept-open"){Ct(ge(m.data.id));return}m.data.type==="alder-concept-select"&&(gn.delete(F),pt.set(F,m.data.id),(typeof m.data.viewId=="string"?bi(F)?.tables[m.data.viewId]:void 0)?.conceptId===m.data.id?bn.set(F,m.data.viewId):bn.delete(F),innerWidth<=800&&(Ht=!1),Io(),Nt(),Be())}});function zs(){const m=getComputedStyle(document.documentElement);for(const v of At.values()){const O=v.contentDocument?.documentElement;if(O){O.dataset.theme=document.documentElement.dataset.theme??"light";for(const C of["--bg","--panel","--fg","--line","--subtle","--select"])O.style.setProperty(C,m.getPropertyValue(C))}}}function Nt(){!D.hidden&&se==="business"&&(Ht=!0),r.hidden=!Ht,I.disabled=!1,I.setAttribute("aria-controls","design-explorer"),I.setAttribute("aria-label","ナビゲーションを開閉"),I.setAttribute("aria-expanded",String(Ht)),qs();const m=bt.isReady?.()??!0,v=se==="concept"&&ke(F);S.hidden=se!=="concept"||v||!Le||!m||!bt.isOpen();const O=!!Ae(Pe)?.capability.testSpecification;if(M.hidden=!(se==="states"||se==="tests"&&O)||!m||!bt.isOpen(),yo&&se!=="business"&&(yo.hidden=!0),se==="concept")y.disabled=v||!Le||!m,v?(y.removeAttribute("aria-controls"),y.setAttribute("aria-label","構造の詳細は中央に表示")):(y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉")),y.setAttribute("aria-expanded",String(!S.hidden));else if(se==="business"){const _=t.business();y.disabled=!m||!_.key||!_.viewKey,y.setAttribute("aria-controls","formattedMarkdownDrawer"),y.setAttribute("aria-label","業務内容開閉")}else se==="states"||se==="tests"&&O?(y.disabled=!m,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!M.hidden))):(se==="tests"||se==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const C=o.querySelector("#document-actions");C&&(C.hidden=se!=="business");const $=o.querySelector("#document-actions-toggle");$&&se!=="business"&&($.hidden=!0),zs(),wi()}function wi(){const m=o.getBoundingClientRect().bottom;m>0&&e.style.setProperty("--shell-content-top",m+"px")}if(typeof ResizeObserver<"u"){const m=new ResizeObserver(wi);m.observe(o),m.observe(e.querySelector("header"))}window.addEventListener("resize",wi);function $s(){sn(),wo=!0;try{const m=new URL(location.href).searchParams;if(se==="concept"&&m.get("view")==="concept"&&m.get("concept")===F&&!Ue.has(F)&&We(F,m.get("dataExample"))&&Ve.set("drawer-overview:"+F,S.querySelector(".concept-drawer-body").scrollTop),Le||(Et.clear(),Ue.clear(),on.clear(),it=[],F="overview",K.removeAttribute("src"),K.removeAttribute("srcdoc")),m.get("view")==="concept"){const v=Le&&U.includes(m.get("concept")??"")?m.get("concept"):"landscape",O=m.get("dataExample");Le&&Re(v)&&m.get("dataView")==="overview"&&!We(v,O)?(Et.add(v),Ue.delete(v)):(Et.delete(v),Le&&We(v,O)?(Ue.set(v,O),on.set(v,O)):Ue.delete(v)),Ct(v,!1)}else if(m.get("view")==="states")t.business().states?.some(v=>v.id===m.get("state"))?jn(m.get("state"),!1):Mn();else if(m.get("view")==="tests"){const v=fi(m.get("spec")??"@overview"),O=m.get("dataExample"),C=Ae(v);C&&O&&C.samples.some($=>$.id===O)?wt.set(v,O):C&&wt.delete(v),Rt(v,!1)}else if(m.get("view")==="empty")kt("empty");else if(kt("business"),t.business().key){const v=m.get("activity"),O=m.get("object"),C=t.business(),$=C.views?.find(_=>_.key===C.viewKey);v&&C.activities.some(_=>_.id===v)?$?.activity!==v&&t.openActivity(v):O&&C.objects?.some(_=>_.id===O)?$?.object!==O&&t.openObject(O):(vt=!1,(!$||$.activity!==void 0||$.object!==void 0)&&t.openOverview())}Ot(),It()}finally{wo=!1}}return window.addEventListener("popstate",$s),{closeBusinessOverview:$a,reopenBusinessOverview(){vt=!1},activateBusiness(){kt("business")},businessActivated(){kt("business"),Ot(),It(),Ze()},syncChrome:Nt,appendActivityTestLinks(m,v){Pa(m,v),mi(m,js(v))},openRelatedChecks(m){Xe.add("tests"),Rt(m&&nt(m)?"checks:"+m:"@overview")},syncDocument(){const m=t.business(),v=m.concept,O=!!(Nn&&m.key!==Nn||ko&&Hn&&m.key&&m.key!==Hn),C=Z?.model!==v?.model||Z?.business!==v?.business;if((O||C&&Z)&&(rt="document",x.querySelector(".test-spec-page").replaceChildren(),M.querySelector(".spec-related-content").replaceChildren(),S.querySelector(".concept-related-content").replaceChildren(),vt=!1,it=[],st=[],yt=[],F="overview",gt="",Pe="@overview",wt.clear(),Ve.clear(),Et.clear(),Ue.clear(),on.clear(),za(),se!=="business"&&kt("business"),O&&!ko&&Ze(!1)),C){Z=v,ue=v?Nc(v):void 0,ie=v?$c(v):void 0,me=v?Dc(v):void 0,Le=!!v,E=ue?.tables??{},P=Object.keys(E),ve=new Map((v?.model.concepts??[]).map(V=>[le(V.id),V.id]));const $=ue?.groups.map(V=>V.id)??[],_=new Set([...Ln,"subsystems",wn,...ve.keys()]);if(be=new Map($.map(V=>[V,_.has(V)||P.includes(V)?"group:"+V:V])),Ie=new Map(P.map(V=>[V,_.has(V)||$.includes(V)?"concept:"+V:V])),de=new Map([...be].map(([V,ee])=>[ee,V])),Y=new Map([...Ie].map(([V,ee])=>[ee,V])),U=[...Ln,wn,...ve.keys(),...de.keys(),...Y.keys()],Array.isArray(xe?.expanded)&&xe.expandedVersion!==4){Xe.add("subsystems"),Xe.add("concept-relations");for(const V of v?.model.subsystems??[])Xe.add("subsystem-"+V.id)}}if(Nn=m.key,st=st.filter($=>m.states?.some(_=>_.id===$)),se==="business"&&vt&&m.views?.find($=>$.key===m.viewKey)?.activity===void 0&&m.views?.find($=>$.key===m.viewKey)?.object===void 0&&Mn(),ko&&m.key){if(Ma(),Hn===m.key){Array.isArray(xe?.specs)&&(yt=[...new Set(xe.specs.filter($=>typeof $=="string").map($=>fi($)))]);for(const[$,_]of Object.entries(xe?.specExamples??{})){const V=Ae($);typeof _=="string"&&V?.capability.samples.some(ee=>ee.id===_)&&wt.set($,_)}}ko=!1,$s()}It(),Ot(),Nt(),O&&Be()}}}class zi{tabs=new WeakMap;router;constructor(t=ji){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const r=JSON.stringify([o.map(d=>[d.id,d.width,d.height]),i.map(d=>[d.kind,d.from,d.to,d.label]),s]),l=this.tabs.get(t),u=!l||l.design!==n||l.structure!==r,c=new Set(o.filter(d=>{const b=l?.nodes.get(d.id);return!b||b.x!==d.x||b.y!==d.y}).map(d=>d.id)),a=new Set(o.map(d=>d.id)),f=u?new Array(i.length):l.routes.slice();if(i.forEach((d,b)=>{!u&&!c.has(d.from)&&!c.has(d.to)||(f[b]=a.has(d.from)&&a.has(d.to)?this.router({from:d.from,to:d.to,index:b,nodes:o,kind:d.kind,matrix:s?.[b],labels:s?.[b]?[]:[...f.flatMap((g,h)=>g&&h<b?[{id:String(h),x:g.label[0]-Math.max(30,i[h].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[h].label.length*12),height:18}]:[])],wires:s?.[b]?[]:f.flatMap((g,h)=>g&&h<b?[g.points]:[]),labelWidth:Math.max(30,d.label.length*12),labelHeight:18}):void 0)}),s){const d=[],b=new Map,g=f.map((h,p)=>p).sort((h,p)=>Number(s[h].returning)-Number(s[p].returning));for(const h of g){const p=f[h];if(!p)continue;const x=o.find(y=>y.id===i[h].from),M=Math.max(30,i[h].label.length*12),w=s[h].returning?[Math.max(...p.points.map(y=>y[0]))+8+M/2,p.points[0][1]]:[x.x+x.width*.125+8+M/2,Ya(x.y+x.height,s[h].captionLane*Pr)+9],D=Tr(i[h],h,s[h]),I=b.get(D)??Mi(w,M,18,o,d);(I[0]!==p.label[0]||I[1]!==p.label[1])&&(f[h]={...p,label:I}),b.has(D)||(b.set(D,I),d.push({id:String(h),x:I[0]-M/2,y:I[1]-9,width:M,height:18}))}}return this.tabs.set(t,{design:n,structure:r,nodes:new Map(o.map(d=>[d.id,{...d}])),routes:f}),f}}function Od(e,t,n,o){const i=(f,d,b)=>(d[0]-f[0])*(b[1]-f[1])-(d[1]-f[1])*(b[0]-f[0]),s=i(e,t,n),r=i(e,t,o),l=i(n,o,e),u=i(n,o,t),c=1e-6;if(s*r<-c&&l*u<-c)return!0;if(Math.max(Math.abs(s),Math.abs(r),Math.abs(l),Math.abs(u))>c)return!1;const a=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[a],t[a]),Math.max(n[a],o[a]))-Math.max(Math.min(e[a],t[a]),Math.min(n[a],o[a]))>.1}function Nd(e,t,n,o,i=[]){const s=e.x+e.width,r=24,l=e.y+e.height,u=s-8-(2*(n.count-n.index)-1)*r,c=t.filter(M=>M.id!==e.id);let a;for(const M of[0,-24,24,-48,48,-72,72])for(const w of[0,16,32,64,128,256]){const D=[u+M,l],I=[D[0]+r,l];if(D[0]<e.x+8||I[0]>s-8)continue;const y=l+n.depth+w,z=Math.min(12,(I[0]-D[0])/2,(y-l)/2),R=[D];let A=`M${D}`;const T=S=>{A+=` L${S}`,R.push(S)},q=(S,N)=>{const j=R.at(-1);A+=` Q${S} ${N}`;for(let B=1;B<=4;B++){const re=B/4,Z=1-re;R.push([Z*Z*j[0]+2*Z*re*S[0]+re*re*N[0],Z*Z*j[1]+2*Z*re*S[1]+re*re*N[1]])}};T([D[0],y-z]),q([D[0],y],[D[0]+z,y]),T([I[0]-z,y]),q([I[0],y],[I[0],y-z]),T(I);const W=Qa(R,c,.3),K=i.filter(S=>R.slice(1).some((N,j)=>S.slice(1).some((B,re)=>Od(R[j],N,S[re],B)))).length;if((!a||W<a.collisions||W===a.collisions&&K<a.wireCollisions)&&(a={path:A,points:R,collisions:W,wireCollisions:K,low:y,extra:w,shift:M}),W===0&&K===0)break}const{path:f,points:d,collisions:b,wireCollisions:g,low:h,extra:p,shift:x}=a;return{path:f,points:d,label:[Math.max(s+8,n.labelLeft)+o/2,h],bounds:{right:Math.max(...d.map(M=>M[0])),bottom:Math.max(...d.map(M=>M[1]))},collisions:b+g,rerouted:p>0||x!==0,fallback:b+g>0}}function jd(e,t=ts()){const n="http://www.w3.org/2000/svg",o=(E,P={})=>{const U=document.createElementNS(n,E);for(const[de,Y]of Object.entries(P))U.setAttribute(de,Y);return U},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(E=>[E]),r=[...new Set(["@new",...e.states,...s.map(E=>E[0].to)])],l={nodes:r.map(E=>({id:E,type:"business",name:i[E]??E,scope:!0})),relations:s.map(([E])=>({kind:E.path==="exception"?"business-exception":"input",from:E.from,to:E.to,label:E.id+"："+E.activity+"："+E.condition}))},u=is(l,r),c=E=>{const P=Array.from(E);return Array.from({length:Math.ceil(P.length/28)},(U,de)=>P.slice(de*28,(de+1)*28).join(""))},a=s.map(([E])=>({from:E.from,activity:E.activity,rows:[E],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[E,P]of a.entries()){const U=P.rows[0],de=e.transitions.filter(le=>le.from===U.from&&(le.activityId??le.activity)===(U.activityId??U.activity)&&le.path===U.path&&(U.path!=="exception"||(le.exception??"例外名未定義")===(U.exception??"例外名未定義"))),Y=de.map(le=>(le.conditionLabel??le.condition).trim().replace(/\s+/g," ")),be=new Set(Y).size===de.length?U.conditionLabel??U.condition:U.condition,ve=[U.path==="exception"?"例外："+(U.exception??"例外名未定義"):"",...de.length>1||U.path==="normal"&&U.conditionLabel?[be]:[]].filter(Boolean).join("：");P.lines=c(P.activity+(ve?"（"+ve+"）":"")),P.lineRows=P.lines.map(()=>P.rows),P.width=Math.max(...P.lines.map(le=>Array.from(le).length*14)),P.height=P.lines.length*18,u.wires[E].returning||(P.offset=f.has(P.from)?f.get(P.from)+8:0,f.set(P.from,P.offset+P.height))}const d=new Map;s.forEach(([E],P)=>{if(E.from===E.to){const U=d.get(E.from)??[];U.push(P),d.set(E.from,U)}});const b=new Map,g=new Map;for(const[E,P]of d){let U=0;for(const Y of[...P].reverse())b.set(Y,{leader:P[0],index:0,count:1,depth:0,offset:U}),U+=a[Y].height+8;const de=24+Math.max(0,U-8)+8;g.set(E,de);for(const Y of P)b.get(Y).depth=de}const h=E=>44,p=r.slice().sort((E,P)=>u.positions[E][1]-u.positions[P][1]);let x=Math.max(40,...a.map((E,P)=>u.wires[P].returning&&E.from===p[0]?16+E.height/2-44*(u.wires[P].fromPort??.5):40));const M=new Map;for(const E of p){const P=h(),U=(f.get(E)??0)+(g.get(E)??0);M.set(E,x),x+=ec(P,U)}const w=r.map(E=>({id:E,x:t.positions.get(E)?.[0]??u.positions[E][0],y:t.positions.get(E)?.[1]??M.get(E),width:Math.max(104,Array.from(i[E]??E).length*14+32),height:h()})),D=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),I=o("title");I.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(r.includes("@none")?"作成なしはこの操作の処理結果。":"")+(r.includes("@unknown")?"未決は設計課題。":""),D.append(I),D.append(ns("state-transition-"));const y=new Map,z=[],R=[];let A=t.selected;const T=E=>{A=E,t.selected=E;const P=Wo(e.transitions,A);for(const[Y,be]of y)be.setAttribute("class","node graph-shape state-shape"+P.nodeClasses(Y)),be.setAttribute("aria-pressed",String(Y===A));z.forEach(({element:Y,rows:be})=>{const Ie=be[0].from===be[0].to;Y.setAttribute("class","edge"+(Ie?" state-self-loop":be[0].path==="exception"?" exception":"")+P.labelClasses(be)),Y.setAttribute("marker-end","url(#state-transition-"+(be.some(P.related)?"related-arrow":"arrow")+")")});for(const Y of R)Y.element.setAttribute("class","state-caption-line"+P.labelClasses(Y.rows));D.querySelectorAll("[data-exception-paint]").forEach(Y=>Y.remove());const U=Array.from(D.children).find(Y=>Y.matches(".state-diagram-edge-label,[data-state]"))??null,de=[...z].sort((Y,be)=>Number(Y.rows.some(P.related))-Number(be.rows.some(P.related)));for(const{element:Y}of de)if(D.insertBefore(Y,U),Y.classList.contains("exception")||Y.classList.contains("state-self-loop")){const be=D.children.length;os(D,Y,{path:Y.getAttribute("d")},{"data-transitions":Y.getAttribute("data-transitions")});for(const Ie of Array.from(D.children).slice(be))D.insertBefore(Ie,U)}D.querySelectorAll(".state-diagram-edge-label").forEach(Y=>D.append(Y))};D.addEventListener("click",E=>{E.target===D&&T()}),D.addEventListener("keydown",E=>{E.key==="Escape"&&(E.preventDefault(),T())});const q=u.wires.map((E,P)=>({...E,captionLane:(a[P].offset+(g.get(a[P].from)??0))/Pr})),W=l.relations.map((E,P)=>({...E,label:String(P).padEnd(Math.ceil(a[P].width/12),"x")})),K=[...b].map(([E,P])=>{const U=w.find(Y=>Y.id===s[E][0].from),de=a[E];return{x:U.x+U.width+8,y:U.y+U.height+24+P.offset,width:de.width,height:de.height}});let S=new zi().update({},e,w,W,q);for(let E=0;E<=K.length;E++){let P=!1,U=0;if(S.forEach((de,Y)=>{if(!de||b.has(Y)||!q[Y].returning)return;let be=0;for(const Ie of K)for(let ve=1;ve<de.points.length;ve++){const le=de.points[ve-1],ke=de.points[ve];if(Math.abs(le[0]-ke[0])>1e-7||Math.abs(le[1]-ke[1])<2)continue;const qe=le[0];if(qe<Ie.x-4||qe>Ie.x+Ie.width+4||Math.max(le[1],ke[1])<Ie.y-4||Math.min(le[1],ke[1])>Ie.y+Ie.height+4)continue;const ge=Ie.x+Ie.width+12-qe;ge>0&&(be=Math.max(be,ge))}be&&(q[Y]={...q[Y],returnLane:(q[Y].returnLane??0)+Math.ceil(be/16)+U++},P=!0)}),!P)break;S=new zi().update({},e,w,W,q)}const N=S.flatMap((E,P)=>E&&!b.has(P)?[E.points]:[]),j=new Map,B=S.map((E,P)=>{const U=b.get(P);if(!U)return E;const de=s[P][0].from,Y=w.find(ge=>ge.id===de),be=S.flatMap((ge,Re)=>ge&&!b.has(Re)?[ge.points]:[]),Ie=Math.max(30,W[P].label.length*12),ve=a[P];let le=j.get(U.leader);le||(le=Nd(Y,w,{...U,labelLeft:Y.x+Y.width+8},Ie,N),j.set(U.leader,le),N.push(le.points));const ke=be.flatMap((ge,Re)=>ge.slice(1).map((Dt,We)=>({id:`${Re}:${We}`,x:Math.min(ge[We][0],Dt[0])-2,y:Math.min(ge[We][1],Dt[1])-2,width:Math.abs(ge[We][0]-Dt[0])+4,height:Math.abs(ge[We][1]-Dt[1])+4}))),qe=Mi([Y.x+Y.width+8+ve.width/2,Y.y+Y.height+24+U.offset+ve.height/2],ve.width,ve.height,[...w,...ke]);return{...le,label:[qe[0]-ve.width/2+Ie/2,qe[1]]}}),re=new Array(s.length),Z=[],ue=s.map((E,P)=>P).sort((E,P)=>Number(q[E].returning)-Number(q[P].returning));for(const E of ue){const P=B[E],U=a[E],de=Math.max(30,W[E].label.length*12);let Y=[P.label[0]-de/2+U.width/2,P.label[1]+(q[E].returning?0:U.height/2-9)];const be=w.find(le=>le.id===s[E][0].from),Ie=w.find(le=>le.id===s[E][0].to);if(!b.has(E)&&q[E].returning&&Ie&&Ie.y>be.y){const le=P.points.slice(1).map((ke,qe)=>[P.points[qe],ke]).filter(([ke,qe])=>Math.abs(ke[0]-qe[0])<.01&&qe[1]-ke[1]>24).sort(([ke,qe],[ge,Re])=>Re[1]-ge[1]-(qe[1]-ke[1]))[0];if(le){const[ke,qe]=le;Y=[ke[0]+8+U.width/2,ke[1]+Math.min(24+U.height/2,(qe[1]-ke[1])/2)]}}const ve=Mi(Y,U.width,U.height,w,Z);re[E]=ve,Z.push({id:String(E),x:ve[0]-U.width/2,y:ve[1]-U.height/2,width:U.width,height:U.height})}let ie=Math.max(...w.map(E=>E.x+E.width))+40,me=Math.max(...w.map(E=>E.y+E.height))+40;s.forEach((E,P)=>{const U=b.get(P);if(U&&U.leader!==P)return;const de=U?s.flatMap((le,ke)=>b.get(ke)?.leader===P?le:[]):E,Y=de[0],be=B[P],Ie=o("path",{d:be.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":de.map(le=>le.id).join(" ")});(U||Y.path==="exception")&&Ie.setAttribute("stroke-dasharray","6 5");const ve=o("title");ve.textContent=de.map(le=>`${le.id} ${le.activity} / ${le.path==="normal"?"通常":"例外："+(le.exception??"例外名未定義")}：${le.condition}`).join(" / "),Ie.append(ve),D.append(Ie),z.push({element:Ie,rows:de}),ie=Math.max(ie,be.bounds.right+40),me=Math.max(me,be.bounds.bottom+40)});for(const[E,P]of a.entries()){const U=re[E],de=U[0]-P.width/2,Y=U[1]-P.height/2+14;D.append(o("rect",{x:String(de),y:String(Y-14),width:String(P.width),height:String(P.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const be=o("text",{x:String(de),y:String(Y),class:"state-diagram-edge-label","data-activity":P.activity,"data-transition-id":P.rows[0].id,"aria-label":P.lines.join("")});P.lines.forEach((Ie,ve)=>{const le=o("tspan",{x:String(de),dy:ve?"18":"0","font-size":"14","font-weight":"600"});le.textContent=Ie,le.setAttribute("data-transitions",P.lineRows[ve].map(ke=>ke.id).join(" ")),R.push({element:le,rows:P.lineRows[ve]}),be.append(le)}),D.append(be),ie=Math.max(ie,de+P.width+24),me=Math.max(me,Y+P.height+24)}for(const E of w){const P=E.id.startsWith("@"),U=o("g",{role:"button",tabindex:"0","aria-label":i[E.id]??E.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":E.id,"data-node":E.id});U.append(Dr(document,E,P)),U.append(o("rect",{x:String(E.x),y:String(E.y),width:String(E.width),height:String(E.height),rx:P?"20":"8",class:P?"state-diagram-node state-note":"state-diagram-node"}));const de=o("text",{x:String(E.x+E.width/2),y:String(E.y+E.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(de.textContent=i[E.id]??E.id,U.append(de),P&&E.id!=="@new"){const Y=o("text",{x:String(E.x+E.width/2),y:String(E.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Y.textContent=E.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",U.append(Y)}U.addEventListener("click",()=>T(E.id)),U.addEventListener("keydown",Y=>{(Y.key==="Enter"||Y.key===" ")&&(Y.preventDefault(),T(E.id))}),y.set(E.id,U),D.append(U)}return T(t.selected),D.setAttribute("viewBox",`0 0 ${ie} ${me}`),D.style.minWidth=`${ie}px`,D}const ir=new WeakMap;function Md(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(h=>h.id===t&&h.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(h,p,x=i)=>{const M=document.createElement(h);return M.textContent=p,x.append(M),M};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const r=o.model;for(const h of r.transitions){if(!e.graph.nodes.some(p=>p.id===h.activity&&p.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(h.exceptionId){const p=e.model?.business.exceptions?.find(x=>x.id===h.exceptionId);if(!p||p.activityId!==h.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const l=ir.get(e)??new Map;ir.set(e,l);const u=l.get(t)??ts();l.set(t,u);const c={...r,transitions:r.transitions.map(h=>({...h,activityId:h.activity,activity:e.graph.nodes.find(p=>p.id===h.activity)?.name??h.activity}))};i.append(Lr(document,h=>jd(c,h),u));const a=h=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[h]??h,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},d=document.createElement("details");s("summary",`操作の詳細（${r.transitions.length}）`,d);const b=document.createElement("ol");d.append(b),i.append(d);for(const h of r.transitions){const p=document.createElement("li");p.dataset.transition=h.id,s("h3",`${h.id} · ${a(h.from)} → ${a(h.to)}`,p),h.path==="exception"&&s("p","例外名："+(h.exception??"未定義"),p),s("p",`${f[h.effect]} · ${h.path==="normal"?"正常":"例外"}`,p);const x=e.graph.nodes.find(M=>M.id===h.activity&&M.type==="business");if(x){const M=document.createElement("button");M.type="button",M.textContent=x.name,M.onclick=()=>n(x.id),p.append(M)}else s("p","要確認：根拠Activityが見つかりません — "+h.activity,p);s("p","条件："+h.condition,p),s("p",h.note,p),s("p","根拠："+h.evidence,p),b.append(p)}r.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",r.source,g),i.append(g),i}const sr=64,Ld=96,Dd=260,rr=40,Rd=4;function Pd(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:r,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}=tc(e,t),a=r.map(I=>I.length),f=o.map(()=>0),d=o.flatMap((I,y)=>a[y]===0?[y]:[]);for(let I=0;I<d.length;I++)for(const y of s[d[I]])f[y]=Math.max(f[y],f[d[I]]+1),--a[y]===0&&d.push(y);const b=Array.from({length:f.reduce((I,y)=>Math.max(I,y),0)+1},()=>[]);o.forEach((I,y)=>b[f[y]].push(y));const g=o.map(()=>0),h=I=>I.forEach((y,z)=>g[y]=z);b.forEach(h);for(let I=0;I<Rd;I++){const y=I%2?[...b].reverse():b;for(const z of y){const R=new Map(z.map(A=>{const T=I%2?s[A]:r[A];return[A,T.length?T.reduce((q,W)=>q+g[W],0)/T.length:g[A]]}));z.sort((A,T)=>R.get(A)-R.get(T)||A-T),h(z)}}const p=b[0].filter(I=>o[I].type==="object"&&i[I].length===0&&s[I].length>0);if(n&&p.length>1){const I=new Set(p),y=b[0].filter(z=>!I.has(z));b.splice(0,1,...p.map((z,R)=>R===0?[...y,z]:[z]))}const x=Object.create(null),M=o.map(()=>0),w=[],D=Math.ceil(Dd/sr)-1;for(let I=0;I<b.length;I++){const y=new Map;for(const A of w)for(const T of A)y.set(T,T+1);const z=A=>{let T=A;for(;y.has(T);)T=y.get(T);let q=A;for(;y.has(q);){const W=y.get(q);y.set(q,T),q=W}return T},R=[];for(const A of b[I]){let T=I;for(const W of r[A])T=Math.max(T,M[W]+1);const q=z(T);M[A]=q,y.set(q,q+1),R.push(q),x[o[A].id]=[rr+I*sr,rr+q*Ld]}w.push(R),w.length>D&&w.shift()}return{positions:x,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}}function Td(e,t){return qr(e)?is(e,t).positions:Pd(e,t).positions}const ar=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function _r(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>ar(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=ar(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function Xr(e){const t=_r(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,r])=>[o.get(s),r])))}}function Zr(e){const t=Xr(e);return t.restore(Td(t.graph,t.order))}function qd(e){const t=Xr(e),n=is(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function Yr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Wd(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(r=>r.handle!==void 0):s.tabs.some(r=>r.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,r){if(Object.is(s,r))return!0;if(!s||!r||typeof s!="object"||typeof r!="object"||o.has(s)||o.has(r))return!1;const l=b=>Array.isArray(b)||Object.getPrototypeOf(b)===null||Object.getPrototypeOf(b)?.constructor?.name==="Object";if(!l(s)||!l(r)||Array.isArray(s)!==Array.isArray(r)||Array.isArray(s)&&s.length!==r.length)return!1;o.add(s),o.add(r);const u=s,c=r,a=Object.keys(u),f=Object.keys(c),d=a.length===f.length&&a.every(b=>Object.hasOwn(c,b)&&i(u[b],c[b]));return o.delete(s),o.delete(r),d}return i(e,t)}function Fn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,r]of Object.entries(e.positions))n.has(s)&&(o[s]=[...r]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=Zr(t),r=Object.values(o);for(const l of i){const u=[...s[l.id]];for(;r.some(c=>Math.abs(c[0]-u[0])<280&&Math.abs(c[1]-u[1])<88);)u[1]+=180;o[l.id]=u,r.push(u)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function Qr(){return new Promise((e,t)=>{const n=indexedDB.open(Yr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class cs extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Uo;function ea(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function zd(e){const t=Uo;if(t===void 0)throw Error("Session has not been loaded");const n=await Qr();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),r=s.objectStore("session"),l=r.get("generation"),u=r.get("current"),c=r.get("readonly-legacy");let a,f;c.onsuccess=()=>{try{const d=ea(l.result);if(Wd(u.result,e)){f=d;return}if(d!==t)throw new cs;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");c.result===void 0&&Ud(u.result)&&r.put(u.result,"readonly-legacy"),r.put(e,"current"),r.put(f,"generation")}catch(d){a=d,s.abort()}},s.oncomplete=()=>{Uo=f,o()},s.onerror=()=>i(a??s.error??Error("Session save failed")),s.onabort=()=>i(a??s.error??Error("Session save aborted"))})}finally{n.close()}}async function $d(){Uo=void 0;const e=await Qr();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),r=i.get("generation");o.oncomplete=()=>{try{Uo=ea(r.result),t(s.result)}catch(l){n(l)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function Ud(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const cr=new WeakMap;function Fd(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(a=>a.id===t&&a.type==="business"))throw Error("Unknown Activity: "+t);let o=cr.get(e);o||(o=new Map,cr.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),r=new Set(e.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),l=e.graph.relations.filter(a=>a.kind==="input"&&a.to===t&&s.has(a.from)||a.kind==="output"&&a.from===t&&s.has(a.to)||a.kind==="business-exception"&&(a.from===t&&r.has(a.to)||a.to===t&&r.has(a.from))),u=new Set([t,...l.flatMap(a=>[a.from,a.to])]),c={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(a=>u.has(a.id)),relations:l},activityOrder:(e.activityOrder??e.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)).filter(a=>u.has(a))};return o.set(t,c),c}const dr=new WeakMap;function Vd(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=dr.get(e);o||(o=new Map,dr.set(e,o));const i=t,s=o.get(i);if(s)return s;const r=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),l=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),u=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&l.has(f.to)||f.kind==="output"&&f.to===t&&l.has(f.from)||f.kind==="object-exception"&&(f.from===t&&r.has(f.to)||f.to===t&&r.has(f.from))),c=new Set([t,...u.flatMap(f=>[f.from,f.to])]),a={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>c.has(f.id)),relations:u},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>c.has(f))};return o.set(i,a),a}const ta=new WeakMap;function Yt(e){return ta.get(e)}const na=["design","checks","source","draft","edited","handle"];function Bd(e){return{key:e.key,name:e.name,...Object.fromEntries(na.map(t=>[t,e[t]]))}}function zt(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:r,viewInset:l,canvasOrigin:u,scroll:c,zoom:a}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:r,viewInset:l,canvasOrigin:u,scroll:c,zoom:a,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Xo(e,t){const n=t;ta.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of na)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function Fo(e){return e.activity}function Vo(e){return e.object}function to(e){return e.activity??e.object}function Zo(e){return e.object===void 0?Fd(e.design,e.activity):Vd(e.design,e.object)}function Yo(e){const t=Zo(e),n=Fn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function $t(e,t=[],n,o){const i=n??(e.tabs[0]?Bd(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?zt(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(d=>{const b=Xo(i,d);return Object.assign(d,zt(Yo(b))),b}):[],{dark:r,drawer:l,width:u,preferWrite:c,nodeDrawer:a,sampleLayout:f}=e;return{dark:r,drawer:l,width:u,preferWrite:c,nodeDrawer:a,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(d=>d.source?.kind==="url").map(d=>({url:d.source.url,name:d.name}))].filter((d,b,g)=>g.findIndex(h=>h.url===d.url)===b),legacyViews:e.legacyViews,active:s.some(d=>d.key===e.active)?e.active:s[0]?.key}}function ds(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(zt),recovery:n}}function Co(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function Hd(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!Zd(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const a of i.views)Co(a)}const{format:s,views:r,document:l,recovery:u,...c}=e;for(const a of r)Co(a);for(const a of u)Co(a);if(!!l!=!!r.length||new Set(r.map(a=>a.key)).size!==r.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(d=>d.group!==void 0&&typeof d.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(d=>d.group===void 0).length!==1))throw Error("Invalid legacy views");const a=o.views[0],f=a?{...a}:void 0;return f&&delete f.group,$t({...c,tabs:[],active:f?.key,legacyViews:{documentKey:l?.key,views:structuredClone(o.views),active:o.active}},u,l,f?[f]:[])}if(r.length&&(r[0].activity!==void 0||r[0].object!==void 0||r.filter(a=>a.activity===void 0&&a.object===void 0).length!==1)||new Set(r.filter(a=>a.activity!==void 0).map(a=>a.activity)).size!==r.filter(a=>a.activity!==void 0).length||new Set(r.filter(a=>a.object!==void 0).map(a=>a.object)).size!==r.filter(a=>a.object!==void 0).length)throw Error("Invalid workspace views");if(l&&r.some(a=>a.activity!==void 0&&!l.design.graph.nodes.some(f=>f.type==="business"&&f.id===a.activity)))throw Error("Unknown saved Activity");if(l&&r.some(a=>a.object!==void 0&&!l.design.graph.nodes.some(f=>f.type==="object"&&f.id===a.object)))throw Error("Unknown saved Object");return $t({...c,tabs:[]},u,l,r)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)Co(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return $t({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Gd(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return $t({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function Kd(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),r=new Set(t.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),l=e.tabs.filter(u=>(u.activity===void 0||s.has(u.activity))&&(u.object===void 0||r.has(u.object))).map(zt);return $t(e,e.recovery,i,l)}function Jd(e,t){const n=e.tabs.find(i=>Fo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=Xo(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,zt(Yo(o))),e.tabs.push(o),e.active=o.key,o}function _d(e,t){const n=e.tabs.find(i=>Vo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=Xo(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,zt(Yo(o))),e.tabs.push(o),e.active=o.key,o}function Xd(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return zt(i?Yo(Xo(e.document,{...zt(o),...zt(i)})):o)});return $t({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Zd(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Qo(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=l=>l instanceof HTMLButtonElement&&l.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(l=>!l.hidden&&!o(l));for(const l of Array.from(t.querySelectorAll("button,a[href]")))l.setAttribute("role","menuitem");const s=(l=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),l&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},r=(l=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const u=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),c=u.getBoundingClientRect();t.style.left=Math.max(8,Math.min(c.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(c.bottom+4,innerHeight-t.offsetHeight-8))+"px",(l?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?r():s(!0),e.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),r(l.key==="ArrowUp"))},t.addEventListener("keydown",l=>{const u=l,c=i(),a=c.indexOf(document.activeElement);let f;u.key==="ArrowDown"&&(f=(a+1)%c.length),u.key==="ArrowUp"&&(f=(a+c.length-1)%c.length),u.key==="Home"&&(f=0),u.key==="End"&&(f=c.length-1),f!==void 0&&(u.preventDefault(),c[f]?.focus())}),t.addEventListener("click",l=>{const u=l.target.closest("button,a[href]");!t.hidden&&u&&!o(u)&&s(!0)},!0),document.addEventListener("keydown",l=>{!t.hidden&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{!t.hidden&&!t.contains(l.target)&&!e.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{!t.hidden&&!t.contains(l.target)&&l.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const Yd=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Qd={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function el(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=w=>i.slice(w.line+1,o.find(D=>D.line>w.line&&D.level<=w.level)?.line??i.length).join(`
`).trim(),r=new Map(o.filter(w=>w.level===3&&t.some(D=>D.title===w.title)).map(w=>[w.title,w])),l=w=>{const D=t.find(I=>I.title===w.title);return D?"legacy-check:"+D.id:w.level===1?"legacy-check-document":"legacy-heading:"+w.line},u=new Map,c=(w,D)=>{u.has(w)?u.get(w)!==D&&u.set(w,void 0):u.set(w,D)};for(const w of o){const D=l(w);c(Yd(w.title),D);const I=t.find(y=>y.title===w.title);I&&c(I.id.toLowerCase(),D)}for(const[w,D]of i.entries()){const I=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(D);if(I){const y=o.find(z=>z.line>w);y&&c(I[1].toLowerCase(),l(y))}}const a=w=>{w=w.replace(/<a\s+id=[^>]+><\/a>/g,"");const D=[];let I=0;for(const y of w.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){y.index>I&&D.push({kind:"markdown",value:w.slice(I,y.index)});let z=y[2].slice(1);try{z=decodeURIComponent(z)}catch{}const R=y[2].startsWith("#")?u.get(z.toLowerCase()):void 0;D.push(R?{kind:"reference",targetId:R,label:y[1]}:{kind:"link",uri:y[2],label:y[1]}),I=y.index+y[0].length}return I<w.length&&D.push({kind:"markdown",value:w.slice(I)}),D},f=[],d=[],b=[],g=new Map;for(const w of o.filter(D=>D.level===2)){if(w.title==="業務一覧")continue;const D=l(w),I=o.find(y=>y.line>w.line)?.line??i.length;f.push({id:D,activityId:Object.hasOwn(n,w.title)?w.title:null,title:w.title,preamble:a(i.slice(w.line+1,I).join(`
`).trim())}),g.set(w.title,D)}const h="legacy-unassigned",p=w=>{const D=o.filter(I=>I.line<w.line&&I.level===2).at(-1);return D?g.get(D.title):void 0},x=t.map(w=>{const D=r.get(w.title),I=p(D)??h,y=Object.create(null),z=[];let R={name:"補足",value:""},A="";for(const q of w.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const W=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(q);W&&(A?W[1][0]===A[0]&&W[1].length>=A.length&&!W[2].trim()&&(A=""):A=W[1]);const K=A?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(q);K?(R.value.trim()&&z.push(R),R={name:K[1],value:K[2]}):R.value+=`
`+q}R.value.trim()&&z.push(R);let T="";for(const q of z)if(q.name==="人間レビュー状態"){T=q.value.split(`
`)[0].trim();const W=q.value.split(`
`).slice(1).join(`
`).trim();W&&(y.補足=[...y.補足??[],...a(W)])}else{const W=Qd[q.name]??q.name;y[W]=[...y[W]??[],...a(q.value.trim())]}return{id:"legacy-check:"+w.id,checkId:w.id,title:w.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:T,sectionId:I,detailSummary:[...w.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(q=>q[1]).join(`
`),fields:y}});x.some(w=>w.sectionId===h)&&f.push({id:h,activityId:null,title:"未割当",preamble:[]});for(const w of o.filter(D=>D.level===3&&!r.has(D.title))){const D=p(w);D?d.push({id:l(w),sectionId:D,title:w.title,blocks:[{kind:"prose",content:a(s(w))}]}):b.push({id:l(w),title:w.title,content:a(s(w))})}const M=o.find(w=>w.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(w=>w.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:a(i.slice(/^# /.test(i[0])?1:0,M).join(`
`)),sections:f,items:x,index:Object.entries(n).map(([w,D])=>{const I=i.find(y=>y.startsWith("|")&&y.includes("["+w+"]"))?.split("|").slice(1,-1)??[];return{activityId:w,purpose:I[1]?.trim()??"",connections:I[2]?.trim()??"",checkIds:D.map(y=>"legacy-check:"+y)}}),guarantees:d,examples:[],notes:b}}function xi(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[r,...l]=s;return!r||!l.length||!["main","master"].includes(r)&&!/^[a-f0-9]{40}$/i.test(r)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${l.join("/")}`,ref:r}}catch{return}}function $i(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function tl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,d)=>{const b=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(b){i?b[1][0]===i[0]&&b[1].length>=i.length&&!b[2].trim()&&(i=""):i=b[1];return}if(!i){t.add(d);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:d,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const r=new Set,l=s.map(f=>{const d=o.find(h=>h.line>f.line&&h.level<=3)?.line??n.length,b=f.title.split(/\s/)[0];if(r.has(b))throw Error("Check IDが重複しています: "+b);r.add(b);const g=n.slice(f.line+1,d).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const h of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+h+"[：:]\\s*\\S","m").test(g))throw Error(b+" の"+h+"が見つかりません。");return{id:b,title:f.title,body:g,activities:[]}}),u=Object.create(null);let c=!1;for(const[f,d]of n.entries()){if(!t.has(f)||(/^## /.test(d)&&(c=/^## 業務一覧\s*$/.test(d)),!c||!/^\|/.test(d)))continue;const b=d.split("|").slice(1,-1);if(b.length!==4)continue;const g=$i(b[0])[0]?.label;if(!g)continue;if(Object.hasOwn(u,g))throw Error("業務一覧のActivityが重複しています: "+g);const h=$i(b[3]);if(h.some(x=>x.url.toLowerCase()!=="#"+x.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const p=h.map(x=>x.label);if(!p.length||p.some(x=>!r.has(x)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);u[g]=[...new Set(p)];for(const x of l)p.includes(x.id)&&x.activities.push(g)}if(!Object.keys(u).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const a=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,a).join(`
`),items:l,index:u,model:el(e,l,u,o)}}function no(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function oo(e,t){const n=new Set(t.design.graph.nodes.filter(c=>c.type==="business").map(c=>c.name)),o=Object.keys(e.index).filter(c=>!n.has(c)),i=Object.keys(e.index).filter(c=>n.has(c)),s=(c,a)=>({state:c,reason:a,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const r=e.intro.split(`
`).filter(c=>/原典|^[-*] Source[：:]|Business Design/i.test(c)).join(`
`),l=$i(r).map(c=>xi(c.url)).filter(c=>c!==void 0),u=t.source?.kind==="url"?xi(t.source.url):t.source?.kind==="sample"?xi("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return u&&l.length&&l.some(c=>c.document!==u.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!u||!l.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||l.some(c=>c.ref!==u.ref)||!/^[a-f0-9]{40}$/i.test(u.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const lr=new WeakMap;function zn(e){let t=lr.get(e);return t||(t=tl(e.markdown),lr.set(e,t)),t}const Ai=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Oo(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function nl(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function ol(e){if(!e.checks)return[];const t=zn(e.checks),n=oo(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===no(e)?[t.model]:[]}function il(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&Oo(i,"関連Checkを読み込み・保存しています…"),t.error){const l=document.createElement("p");l.className="check-warning",l.setAttribute("role","alert"),l.textContent=t.error,i.append(l)}let s,r=!1;if(e.checks){s=zn(e.checks);const l=oo(s,e);if(r=l.state==="matched"||l.state==="unverified"&&e.checks.confirmedFor===no(e),!r&&(Oo(i,"現在のBDとの対応を再確認してください。"+l.reason),l.state==="unverified")){const u=Ai("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));u.disabled=n.disabled||t.busy===!0,i.append(u)}}if(t.candidate){const l=t.candidate,u=zn(l),c=oo(u,e),a=document.createElement("section");a.className="check-candidate",a.id="check-candidate",Oo(a,"一致未確認: "+l.name+" — "+c.reason),Oo(a,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),d=document.createElement("summary");d.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(d,nl(u.markdown)),a.append(f);const b=Ai("対応を確認して表示する",()=>n.confirm(l));b.id="check-confirm",b.disabled=c.state==="mismatch"||n.disabled||t.busy===!0;const g=Ai("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,a.append(b,g),i.append(a)}return i.childNodes.length&&o.append(i),o}function sl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const a of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=a.getAttribute("aria-label"),a.append(f)}let s=!1;const r=(a=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),a&&!o.hidden&&o.focus({preventScroll:!0})},l=()=>i.filter(a=>!a.hidden&&!a.disabled),u=()=>{const a=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const b=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+b,h=i.some(p=>!p.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=h?"menu":"inline",o.hidden=!h,(!h||a!==e.dataset.actionsMode)&&(r(),h&&n.contains(f)?o.focus({preventScroll:!0}):!h&&f===o&&l()[0]?.focus({preventScroll:!0}))},c=(a=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=l();(a?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?r(!0):c(),o.onkeydown=a=>{(a.key==="ArrowDown"||a.key==="ArrowUp")&&(a.preventDefault(),c(a.key==="ArrowUp"))},n.addEventListener("keydown",a=>{if(!s)return;const f=l(),d=f.indexOf(document.activeElement);let b;a.key==="ArrowDown"&&(b=(d+1)%f.length),a.key==="ArrowUp"&&(b=(d+f.length-1)%f.length),a.key==="Home"&&(b=0),a.key==="End"&&(b=f.length-1),b!==void 0&&(a.preventDefault(),f[b]?.focus())}),document.addEventListener("keydown",a=>{s&&a.key==="Escape"&&(a.preventDefault(),a.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",a=>{s&&!n.contains(a.target)&&!o.contains(a.target)&&r()}),document.addEventListener("focusin",a=>{s&&!n.contains(a.target)&&a.target!==o&&r()}),n.addEventListener("click",a=>{const f=a.target.closest("button");s&&f&&!f.disabled&&r(!0)},!0),r(),u(),window.addEventListener("resize",u),typeof ResizeObserver<"u"&&new ResizeObserver(u).observe(e),new MutationObserver(u).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(u),document.fonts?.addEventListener("loadingdone",u),{update:u,close:r}}function rl(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,r=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),l=n.reduce((c,a)=>c+a.getBoundingClientRect().width,0)+s*n.length+r,u=l+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&u>e.clientWidth),e.classList.toggle("header-icons-only",l>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const Jn="http://www.w3.org/2000/svg",al="http://www.w3.org/1999/xhtml",No=24,ur=8192,cl=16e6,dl=8e6,ll=4e3,ul=1e6,Ui="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function fl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(a=>![a.x,a.y,a.width,a.height].every(Number.isFinite)||a.width<0||a.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const a of e)t=Math.min(t,a.x),n=Math.min(n,a.y),o=Math.max(o,a.x+a.width),i=Math.max(i,a.y+a.height);const s=Math.floor(t)-No,r=Math.floor(n)-No,l=Math.ceil(o)-s+No,u=Math.ceil(i)-r+No,c=Math.min(2,ur/l,ur/u,Math.sqrt(cl/(l*u)));if(c<1)throw Error(Ui);return{bounds:{x:s,y:r,width:l,height:u},width:Math.floor(l*c),height:Math.floor(u*c),scale:c}}const pl="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function fr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const r=o[s],l=getComputedStyle(i);r.removeAttribute("style");for(const u of pl){const c=l.getPropertyValue(u);c&&!/url\s*\(/i.test(c)&&r.style.setProperty(u,c)}for(const u of Array.from(r.attributes))(u.name.startsWith("data-")||u.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(u.name))&&r.removeAttribute(u.name)}),t}function ml(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>ll||(e.textContent?.length??0)+(t.textContent?.length??0)>ul)throw Error(Ui);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(h=>({x:parseFloat(h.style.left),y:parseFloat(h.style.top),width:h.offsetWidth,height:h.offsetHeight}));for(const h of o)for(const p of Array.from(h.querySelectorAll(".finding-badges")))i.push({x:parseFloat(h.style.left)+h.clientLeft+p.offsetLeft,y:parseFloat(h.style.top)+h.clientTop+p.offsetTop,width:p.offsetWidth,height:p.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,r=Array.from(t.children).map(fr),l=r.filter(h=>h.matches(".edge,.edge-label"));if(l.length){const h=s.createElementNS(Jn,"svg");h.setAttribute("viewBox","0 0 1 1"),h.setAttribute("width","1"),h.setAttribute("height","1"),h.setAttribute("aria-hidden","true"),h.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",h.append(...l),s.body.append(h);try{for(const p of l){const x=p.getBBox();i.push({x:x.x-12,y:x.y-12,width:x.width+24,height:x.height+24})}}finally{h.remove()}}const u=fl(i),c=s.createElementNS(Jn,"svg");c.setAttribute("width",String(u.width)),c.setAttribute("height",String(u.height)),c.setAttribute("viewBox",`0 0 ${u.bounds.width} ${u.bounds.height}`);const a=s.createElementNS(Jn,"rect");a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("fill",n),c.append(a);const f=s.createElementNS(Jn,"g");f.setAttribute("transform",`translate(${-u.bounds.x} ${-u.bounds.y})`);for(const h of r)f.append(h);c.append(f);const d=s.createElementNS(Jn,"foreignObject");d.setAttribute("width",String(u.bounds.width)),d.setAttribute("height",String(u.bounds.height));const b=s.createElementNS(al,"div");b.style.cssText=`position:relative;width:${u.bounds.width}px;height:${u.bounds.height}px;`;for(const h of o){const p=fr(h);p.querySelector(".activity-open,.object-open")?.remove(),p.style.left=parseFloat(h.style.left)-u.bounds.x+"px",p.style.top=parseFloat(h.style.top)-u.bounds.y+"px",b.append(p)}d.append(b),c.append(d);const g=new XMLSerializer().serializeToString(c);if(new TextEncoder().encode(g).length>dl)throw Error(Ui);return{svg:g,...u}}function hl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function oa(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const r=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(r),i()},n.onerror=()=>{clearTimeout(r),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const r=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(l=>{clearTimeout(r),l?i(l):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(l){clearTimeout(r),s(l)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function bl(e,t){const n=await oa(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=hl(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function gl(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=oa(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ia(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:yl(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function yl(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const r of o)i=Math.imul(i^r.codePointAt(0),16777619)>>>0,s=Math.imul(s^r.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function sa(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return H(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function ra(e){H(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),kn(e),$o(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=ia(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=sa(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return $o(t),t}const pr=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),vl={anyOf:zo.anyOf},wl={type:"string",pattern:"^[A-Za-z0-9_-]+$"},kl={type:"string",minLength:1,pattern:"\\S"},Il={...pr({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:pr({id:wl,name:kl,package:vl})}}),$defs:zo.$defs};function Sl(e){kn(e,Il),H(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){H(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),H(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{$o(n.package),n.package.formatVersion!=="0.4"&&ra(n.package)}catch(o){throw Error("Plan "+n.id+": "+o.message,{cause:o})}}return{valid:!0,plans:e.plans.map(({id:n,name:o})=>({id:n,name:o}))}}const pe=(e,t)=>{if(!e)throw new Error(t)},_n=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Ei=e=>!!e&&typeof e=="object"&&!Array.isArray(e),jo=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),aa=e=>_n(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function xl(e){pe(Ei(e),"Graph must be an object");const t=e;pe(jo(t,["version","nodes","relations"])||jo(t,["version","nodes","relations","scope"]),"Invalid graph fields"),pe(t.version===1,"Unsupported graph version"),"scope"in t&&pe(_n(t.scope),"Invalid scope"),pe(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),pe(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){pe(Ei(s),"Node must be an object");const r=s;pe(r.type==="business"||r.type==="object","Invalid node type");const l=r.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];r.type==="business"&&("problem"in r||"pain_level"in r)&&(l.push("problem","pain_level"),pe(["Low","Medium","High"].includes(String(r.pain_level)),"Invalid Pain level")),pe(jo(r,l),"Invalid node fields"),pe(Object.entries(r).every(([c,a])=>c==="scope"||c==="information"||_n(a)),"Empty node text"),pe(typeof r.scope=="boolean","Invalid node scope"),pe(aa(r.name)&&r.id===r.name,"Node ID must equal visible name"),pe(!n.has(r.id),"Duplicate node ID"),r.type==="object"&&(pe(typeof r.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.icon),"Invalid Lucide icon"),pe(Array.isArray(r.information)&&r.information.every(_n),"Invalid information")),n.set(r.id,r.type)}pe([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){pe(Ei(s),"Relation must be an object");const r=s;pe(jo(r,["kind","from","to","label"])&&Object.values(r).every(_n),"Invalid relation fields");const l=o[r.kind];pe(Array.isArray(l)&&n.has(r.from)&&n.has(r.to)&&n.get(r.from)===l[0]&&n.get(r.to)===l[1],"Invalid relation endpoints");const u=JSON.stringify([r.kind,r.from,r.to,r.label]);pe(!i.has(u),"Duplicate relation"),i.add(u)}}function ln(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Zn(e){const t=[];let n="";return ln(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),pe(!n,"Unclosed code fence"),t}function Fi(e,t,n,o=[]){const i=ln(e),s=Zn(e),r=Object.create(null);return pe(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([l,u],c)=>{pe(t.includes(u)&&!(u in r),n+": unsupported/duplicate "+u),r[u]=i.slice(l+1,s[c+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),pe(r[u]||o.includes(u),n+": empty "+u)}),pe(s.map(l=>l[1]).join("|")===t.join("|"),n+": invalid field order"),r}const mr=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function Al(e){const t=ln(e),n=Zn(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return pe(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],r)=>{const l=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);pe(l,"Invalid Finding ID");const u=l[1];pe(!o.has(u),"Duplicate Finding ID"),o.add(u);const c=Fi(t.slice(i+1,n[r+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+u);pe(["question","correction"].includes(c["### Kind"]),"Invalid Finding Kind"),pe(["open","resolved"].includes(c["### Status"]),"Invalid Finding Status"),pe(["items","document","unassigned"].includes(c["### Scope"]),"Invalid Finding Scope");const a=c["### Targets"]==="(none)"?[]:ln(c["### Targets"]).filter(f=>f.trim()).map(f=>(pe(f.startsWith("- ")&&aa(f.slice(2)),"Invalid Finding target"),f.slice(2)));return pe(new Set(a).size===a.length,"Duplicate Finding target"),pe(c["### Scope"]==="items"?a.length>0:c["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:u,kind:c["### Kind"],status:c["### Status"],scope:c["### Scope"],targets:a,summary:c["### Summary"],content:c["### Content"],unresolvedTargets:[]}})}function El(e,t){pe(!e.includes("<!--"),"HTML comments are unsupported");const n=ln(e),o=Zn(e).filter(d=>d[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;pe(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const r={version:1,nodes:[],relations:[]},l=Object.create(null),u=new Set;o.slice(1).forEach(([d,b],g)=>{const h=o[g+2]?.[0]??n.length,p=n.slice(d+1,h).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(pe(p,"Empty section "+b),b==="# Findings"){pe(!u.has(b),"Duplicate Findings"),u.add(b),s=Al(p);return}if(["# Scope","# Graph exceptions"].includes(b)){pe(!u.has(b),"Duplicate "+b),u.add(b),b==="# Scope"?(pe(!Zn(p).length,"Scope must be prose"),r.scope=p):ln(p).filter(R=>R.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(R=>{const A=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(R);pe(A,"Invalid exception"),r.relations.push({kind:A[1],from:A[2],to:A[3],label:A[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const x=i.exec(b);pe(x,"Unsupported heading "+b);const M=x[1],w=x[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");l[w]=n.slice(d,h).join(`
`);const D=R=>Zn(p).some(A=>A[1]===R);if(M==="Object"){const R=["## Scope","## Icon"];D("## Information")&&R.push("## Information");const A=Fi(p,R,w);pe(["true","false"].includes(A["## Scope"]),"Invalid Scope");const T=ln(A["## Information"]??"").filter(q=>q.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(q=>(pe(/^- \S.*$/.test(q),"Invalid Information"),q.slice(2)));r.nodes.push({id:w,type:"object",name:w,scope:A["## Scope"]==="true",icon:A["## Icon"]==="(generic icon)"?"box":A["## Icon"],information:T});return}const I=["## Scope","## Why","## When"];D("## Exception When")&&I.push("## Exception When"),I.push("## Who","## Where","## How","### Input","### Procedure"),D("### Exception")&&I.push("### Exception"),I.push("### Output","## Result"),(D("## Problem")||D("## Pain level"))&&I.push("## Problem","## Pain level");const y=Fi(p,I,w,["## How"]);pe(!y["## How"],"How must only contain fields"),pe(["true","false"].includes(y["## Scope"]),"Invalid Scope"),t?.activity?.(w,y);const z={id:w,type:"business",name:w,scope:y["## Scope"]==="true",why:y["## Why"],when:y["## When"],who:y["## Who"],where:y["## Where"],result:y["## Result"]};"## Problem"in y&&(z.problem=y["## Problem"],z.pain_level=y["## Pain level"]),r.nodes.push(z);for(const[R,A]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(R in y)||A!=="business-exception"&&y[R]==="(none)"||ln(y[R]).filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(T=>{const q=/^- (.+?) — (\S.*)$/.exec(T);pe(q,"Invalid relation in "+w),r.relations.push({kind:A,from:A==="output"?w:q[1],to:A==="output"?q[1]:w,label:q[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const c=r.nodes.filter(d=>d.type==="business").map(d=>d.id);xl(r),r.nodes.sort((d,b)=>mr(d.id,b.id)),r.relations.sort((d,b)=>{for(const g of["kind","from","to","label"]){const h=mr(d[g],b[g]);if(h)return h}return 0});const a=new Set(r.nodes.map(d=>d.id));for(const d of s)d.unresolvedTargets=d.targets.filter(b=>!a.has(b));return{graph:r,sections:l,markdown:e,activityOrder:c,findings:s}}const Cl=["id","from","activity","condition","to","effect","path","evidence","note"],Je=(e,t)=>{if(!e)throw Error(t)},Mo=e=>typeof e=="string"&&!!e.trim();function Ol(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Je(n,"state-meta と遷移表が必要です");const o=Vr(n[1]);Je(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),Je(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Je(o.object===t,"対象Objectが一致しません"),Je(Array.isArray(o.states)&&o.states.length>0&&o.states.every(c=>Mo(c)&&!c.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),Je(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&Mo(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=c=>(Je(c.startsWith("|")&&c.endsWith("|"),"表の行が不正です"),c.slice(1,-1).split("|").map(a=>a.trim())),r=s(i[0]);Je([Cl,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(c=>r.join("|")===c.join("|")),"表の列名が不正です"),Je(s(i[1]).length===r.length&&s(i[1]).every(c=>/^-+$/.test(c)),"表の区切りが不正です"),Je(i.length<=1002,"遷移は1000行以内にしてください");const l=new Set,u=i.slice(2).map(c=>{const a=s(c);Je(a.length===r.length&&a.every(Mo),"表の列数・空欄が不正です");const f=Object.fromEntries(r.map((d,b)=>[d,a[b]]));return Je(/^T[0-9]+$/.test(f.id)&&!l.has(f.id),"遷移IDが不正または重複しています"),l.add(f.id),Je([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),Je(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),r.includes("exception")&&Je(f.path==="normal"?f.exception==="-":Mo(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),Je(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),Je(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),Je(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),Je(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:u}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const hr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Nl(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let r=0;r<o.length;r++){const l=o[r];if(!s&&/^# Object /.test(l)?n=l.slice(9):!s&&/^# /.test(l)&&(n=null),!s&&l==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const u=[];let c="";for(r++;r<o.length;r++){const f=o[r];if(!c&&/^#{1,2} /.test(f)){r--;break}u.push(f),c=hr(f,c)}const a=Ol(u.join(`
`),n);if(a.error)throw Error(a.error);t.push(a.model);continue}i.push(l),s=hr(l,s)}if(new Set(t.map(r=>r.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function jl(e){const t=/^## State Transitions$/m.test(e)?Nl(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=El(t.markdown,{activity:(u,c)=>i.set(u,c),document:(u,c)=>{n=u,o=c}}),r={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(u=>u.type==="object").map(u=>({id:u.id,name:u.name,scope:u.scope,icon:String(u.icon),information:u.information})),activities:(s.activityOrder??[]).map(u=>{const c=s.graph.nodes.find(f=>f.id===u),a=i.get(u);return{id:u,name:c.name,scope:c.scope,why:String(c.why),when:String(c.when),who:String(c.who),where:String(c.where),procedure:a["### Procedure"],exception:a["### Exception"]??null,result:String(c.result),problem:c.problem===void 0?null:String(c.problem),painLevel:c.pain_level===void 0?null:String(c.pain_level)}}),relations:s.graph.relations.map((u,c)=>({id:"legacy-relation-"+c,kind:u.kind,fromId:u.from,toId:u.to,label:u.label})),findings:(s.findings??[]).map(u=>({...u,sourceId:u.id,targetIds:u.targets.filter(c=>s.graph.nodes.some(a=>a.id===c))}))};r.exceptions=ia(r);const l=t.declarations.map((u,c)=>({id:"legacy-state-"+c,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:r.id,revision:r.revision,verification:"unverified"},objectId:u.object,states:u.states.map(a=>({id:a,name:a})),start:u.start,terminal:u.terminal,completeness:u.completeness,source:u.source,transitions:u.transitions.map(a=>({id:a.id,sourceId:a.id,fromId:a.from,toId:a.to,activityId:a.activity,exceptionId:sa(r,a.activity,a.exception),event:a.event??null,condition:a.condition,effect:a.effect,path:a.path,evidence:a.evidence,note:a.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:r,checks:[],states:l,diagnostics:[]}}}function Ml({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=Br({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const i=e.business,s=[...i.objects,...i.activities],r=c=>i.roles?.find(a=>a.id===c.roleId)?.name??c.who,l=[...i.objects.map(c=>({...c,type:"object"})),...i.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:r(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],u=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===i.id).map(c=>{const a=new Map(c.states.map(d=>[d.id,d.name])),f={object:s.find(d=>d.id===c.objectId).name,states:c.states.map(d=>d.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(d=>({id:d.sourceId,from:a.get(d.fromId)??d.fromId,to:a.get(d.toId)??d.toId,activity:d.activityId,...d.event?{event:d.event}:{},...d.exceptionId?{exceptionId:d.exceptionId,exception:i.exceptions?.find(b=>b.id===d.exceptionId)?.name}:{},condition:d.condition,...d.conditionLabel?{conditionLabel:d.conditionLabel}:{},effect:d.effect,path:d.path,evidence:d.evidence,note:d.note}))};return[c.objectId,{model:f}]})));return{graph:_r({version:1,...i.scope?{scope:i.scope}:{},nodes:l,relations:i.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(l.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:i.activities.map(c=>c.id),objectStateTransitions:u,findings:i.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(a=>s.find(f=>f.id===a)?.name??a)}))}}const ca=8*1024*1024;function da(e){return/^\s*[\[{]/.test(e)}function Vi(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function br(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");Vi(e);const n=$o(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Ll(e,t){if(!da(e)){if(t!==void 0)throw Error("案を含まない文書です。");return jl(e)}if(new TextEncoder().encode(e).byteLength>ca)throw Error("ローカルJSONは8MiB以内にしてください。");let n=Vr(e.replace(/^\uFEFF/,""));Vi(n);let o;if(n?.format==="alder-named-plans"){Sl(n);for(const r of n.plans)if(Vi(r.package),r.package.documents.filter(l=>l.kind==="businessDesign").length!==1)throw Error("業務案 "+r.id+" にはBusiness Designが1件必要です。");const i=t??n.plans[0].id,s=n.plans.find(r=>r.id===i);if(!s)throw Error("指定した業務案がありません: "+i);o={selected:i,choices:n.plans.map(({id:r,name:l})=>({id:r,name:l}))},n=s.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const i=br(ra(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const s=i.data.business;s.schemaVersion="0.1",delete s.roles;for(const r of s.activities)delete r.roleId;i.data.diagnostics=i.data.diagnostics.filter(r=>!r.startsWith("Role未確定:"))}return{...i,...o?{namedPlans:o}:{}}}return{...br(n,e),...o?{namedPlans:o}:{}}}function tn(e,t){return Ml(Ll(e,t))}async function Dl(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>ca)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!da(n))throw Error("JSONファイルの本文を確認してください。");return tn(n)}const Rl=(e,t)=>ls(e,t,!1);async function ls(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const r=setTimeout(s,3e4);try{const l=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!l.ok)throw Error("URL取得に失敗しました（HTTP "+l.status+"）。");const u=l.headers.get("content-type")?.toLowerCase()??"";if(u.includes("html")||!n&&u.includes("json")||u.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const c=2*1024*1024;if(Number(l.headers.get("content-length"))>c)throw Error("本文は2MiB以内にしてください。");const a=l.body?.getReader();if(!a)throw Error("本文を読み取れません。");let f=0,d="";const b=new TextDecoder;try{for(;;){const{done:g,value:h}=await a.read();if(g)break;if(f+=h.length,f>c){try{a.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}d+=b.decode(h,{stream:!0})}d+=b.decode()}finally{a.releaseLock()}if(n&&u.includes("json")&&!/^\s*[\[{]/.test(d))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(d))throw Error("HTMLページは読み込めません。");return d}catch(l){const u=i.signal.aborted;throw s(),u?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):l instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):l}finally{clearTimeout(r),t?.removeEventListener("abort",s)}}const Bo=Dl;async function ei(e,t){return tn(await ls(e,t))}function Pl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return tn(e)}const ti=e=>e==="question"?"要確認":"要修正";function Tl(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${ti(o)} ${i}`)}return n}function ql(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${ti(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(xn(e.content)),t}function Wl(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function zl(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${ti(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function $l(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const r=document.createElement("label");r.className="finding-filter";const l=document.createElement("input");l.type="checkbox",l.checked=t,l.onchange=()=>n(l.checked),r.append(l,document.createTextNode("解消済みも表示")),s.append(r);const u=(a,f,d)=>{const b=document.createElement("button");b.className="node-navigate finding-index-row",b.dataset.findingKey=a.type+":"+a.id;const g=document.createElement("strong");g.textContent=f;const h=document.createElement("span");return h.textContent=d,b.append(g,h),b.onclick=()=>o(a),b},c=e.graph.nodes.filter(a=>(!i||a.id===i)&&typeof a.problem=="string");if(c.length){const a=document.createElement("h3");a.textContent="困りごと",s.append(a);for(const f of c)s.append(u({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[a,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const d=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(a==="broken"?g.unresolvedTargets.length>0:g.scope===a&&!g.unresolvedTargets.length));if(!d.length)continue;const b=document.createElement("h3");b.textContent=`${f}（${d.length}件）`,s.append(b);for(const g of d)s.append(u({type:"finding",id:g.id},`${ti(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const a=document.createElement("p");a.textContent="表示する指摘はありません。",s.append(a)}return s}function Ul(e){const t=Zr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,r)=>s===i[r]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...nc(),viewInset:[40,0],canvasOrigin:void 0}}function Fl(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function us(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Vl(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{us(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Bl(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(us(t)),n.href}function Hl(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return us(t)}const fs=`# Alderを使った設計業務 — Business Design

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
`,Gl=`{
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
`;function Kl(e,t){const n=new Set(t.graph.nodes.map(d=>d.id)),o=new Map;for(const d of t.graph.nodes)o.set(d.name,o.has(d.name)?void 0:d.id);const i=d=>n.has(d)?d:o.get(d),s=Object.create(null);for(const[d,b]of Object.entries(e.positions)){const g=i(d);g&&(s[g]=b)}const{scroll:r,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:a,selectedEdgesOnly:f}=e;return{positions:s,scroll:r,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:a,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(d=>{const b=i(d);return b?[b]:[]}))]}}}const Jl=`# Alderのチェックリストサンプル

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
`;function _l(e,t,n,o,i=()=>!0,s=()=>{}){const r=e.ownerDocument,l=r.defaultView;let u,c=0,a=0,f=!1,d=null,b="";const g=new Map,h=()=>{u!==void 0&&(l.clearTimeout(u),c=Math.max(0,c-(Date.now()-a)),u=void 0)},p=(w=!1)=>{if(w&&!i())return;h(),g.delete(b);const D=[...g].at(-1);if(D){M(D[1],"error",D[0]);return}const I=e.contains(r.activeElement);e.hidden=!0,t.textContent="",s(),I&&(d?.isConnected?d:o).focus({preventScroll:!0})},x=()=>{e.hidden||e.dataset.kind==="error"||f||r.hidden||e.contains(r.activeElement)||(h(),a=Date.now(),u=l.setTimeout(p,c))};e.addEventListener("pointerenter",()=>{f=!0,h()}),e.addEventListener("pointerleave",()=>{f=!1,x()}),e.addEventListener("focusin",w=>{const D=w.relatedTarget;D&&!e.contains(D)&&(d=D),h()}),e.addEventListener("focusout",()=>l.setTimeout(x,0)),e.addEventListener("keydown",w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),p(!0))}),r.addEventListener("visibilitychange",()=>r.hidden?h():x()),n.onclick=()=>p(!0);const M=(w,D,I)=>{h(),e.contains(r.activeElement)||(d=r.activeElement),b=I,e.dataset.kind=D,e.dataset.key=I,t.setAttribute("role",D==="error"?"alert":"status"),t.setAttribute("aria-live",D==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=w,s(),c=D==="warning"?8e3:5e3,x()};return(w,D="success",I="operation")=>{D==="error"&&w?(g.delete(I),g.set(I,w)):g.delete(I);const y=[...g].at(-1);if(y){if(!e.hidden&&t.textContent===y[1]&&b===y[0])return;M(y[1],"error",y[0]);return}if(!w){b===I&&p();return}!e.hidden&&t.textContent===w&&e.dataset.kind===D||M(w,D,I)}}const gr=Gl,xt=document.querySelector("#app");xt.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Fe;const k=e=>document.getElementById(e),Pn=Yr(location.pathname);Pn.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${Pn.version}`,k("preview-badge").title=`PR #${Pn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const io=e=>On(e,{"stroke-width":1.8,"aria-hidden":"true"}),uo=document.createElement("div");uo.id="source-menu";uo.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';xt.append(uo);const ni=document.createElement("div");ni.id="checks-menu";ni.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';xt.append(ni);const An=document.createElement("section");An.id="check-followup";An.hidden=!0;An.setAttribute("aria-labelledby","check-followup-title");An.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(An);const oi=document.createElement("div");oi.id="check-followup-menu";oi.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';xt.append(oi);const Ut=document.createElement("input");Ut.type="file";Ut.id="check-file";Ut.accept=".md,.markdown,text/markdown,text/plain";Ut.hidden=!0;xt.append(Ut);const nn=document.createElement("section");nn.id="check-url-dialog";nn.hidden=!0;nn.setAttribute("role","dialog");nn.setAttribute("aria-labelledby","check-url-title");nn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';xt.append(nn);const ii=document.createElement("div");ii.id="help-menu";ii.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Pn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Pn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Pn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;xt.append(ii);Qo(k("help-menu-toggle"),ii);const Yn=document.createElement("div");Yn.id="url-history";uo.append(Yn);function Xl(){if(Yn.replaceChildren(),!L.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",Yn.append(e);for(const t of L.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=ae||De||ce,n.onclick=()=>{Zl(t.url)},Yn.append(n)}}async function Zl(e){if(!(ae||De||ce)){if(L.document?.source?.kind==="url"&&L.document.source.url===e){we(),Fe?.reopenBusinessOverview(),L.active=L.tabs[0].key,Oe(),ho();return}De=!0,Oe();try{const t=await ei(e),n=Fn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await fo(n)}catch(t){t instanceof Cn||ze("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{De=!1,Oe()}}}const Yl=Qo(k("open-menu-toggle"),uo),Ql=Qo(k("open-checks"),ni,()=>{const e=te();k("check-open-sample").hidden=!e||!gs(e),k("check-close").disabled=!e?.checks}),la=Qo(k("check-followup-open"),oi,()=>{k("check-followup-sample").hidden=!te()||!gs(te())});for(const[e,t]of[["open-menu-toggle",Us],["open",Us],["open-url",oc],["open-text",ic],["view-markdown",sc],["open-checks",Ar],["share-source",rc],["refresh",ac],["help-menu-toggle",cc],["drawer",dc],["node-list-toggle",lc],["node-list-close",Er],["display-settings-toggle",Cr],["reset-layout",uc],["save-image",fc],["copy-image",pc],["out",jr],["in",Mr]])k(e).prepend(io(t));rl(document.querySelector("header"));const Bi=sl(document.querySelector(".tab-strip"));let L={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},jt=!0,_t=!1,ae=!0,$n=!1,In=!1,De=!1,yr=Promise.resolve(),un,ye,Mt=0,ce=!1,Qn=!1,Tn=0,Ho=0,qn=!1,ps=!1,Hi=!1,vr=!1;const Gi=new Set,Xt=new Set,Go=new Set;function ua(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Go){const o=[...L.document?[L.document]:[],...L.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&Go.delete(n)}}const te=()=>L.tabs.find(e=>e.key===L.active),En=e=>Yt(e)?.key??e.key,Qt=e=>L.document?.key===En(e);let Ki="";const eu=_l(k("status"),k("status-text"),k("status-close"),k("viewport"));function ze(e,t="success",n="operation"){if(n==="storage"){if(Ki===e)return;Ki=e}eu(e,t,n)}function ms(){ze("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function hs(){ze("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Bt(){ae||(Mt++,et())}function tu(e){e.preventDefault(),e.returnValue=!0}function et(){const e=Mt>Tn||Ho>0||!1||ce||Go.size>0||Hi||qn||In,t=!ae&&e;t!==vr&&(vr=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",tu));const n=ae?"restoring":$n?"protected":In?"conflict":qn?"error":Hi||Go.size>0?"draft":Ho>0||ce?"saving":Mt>Tn?"dirty":ps?"saved":"unchanged";xt.dataset.saveState!==n&&(xt.dataset.saveState=n),$n?ms():In?hs():qn?ze("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):ze("","success","storage"),ri()}function bs(e){qn=!0,Ki=""}function si(){if($n)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(In)throw new cs}async function nu(e){si();try{await zd(e)}catch(t){throw t instanceof cs&&(In=!0,clearTimeout(un),un=void 0,hs()),t}}function fa(e,t){Ho++,Gi.add(t),et();const n=yr.catch(()=>{}).then(()=>nu(e)).then(()=>{Tn=Math.max(Tn,t),ps=!0,ua(e),Tn===Mt&&(qn=!1)},o=>{throw bs(),o}).finally(()=>{Ho--,Gi.delete(t),et()});return yr=n.catch(()=>{}),n}function Se(e=180,t=!0){if(ae)return;if(t&&Mt++,clearTimeout(un),un=void 0,$n){ms(),et();return}if(In){hs(),et();return}if(ce||Gi.has(Mt)||!t&&Mt<=Tn&&!qn){et();return}const n=()=>{un=void 0;let o;try{o=structuredClone(ds(L))}catch{bs(),et();return}fa(o,Mt).catch(()=>et())};e===0?n():un=window.setTimeout(n,e),et()}async function ou(e){if(ae||ye||ce||!L.tabs.includes(e))return;if(to(e)===void 0){Fe?.closeBusinessOverview();return}ht.cancel(),we();const t=L.active===e.key,n={...L,tabs:L.tabs.filter(o=>o!==e),active:t?L.tabs[0]?.key:L.active};try{await po(()=>n,()=>{L=n}),t&&xt.dataset.workspaceArea==="business"&&Fe?.businessActivated()}catch{et()}}function ut(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!te(),t=e&&L.drawer,n=e&&!!L.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(_t=!1),ri(),k("layout-lock").replaceChildren(io(jt?Or:Nr)),k("layout-lock").setAttribute("aria-pressed",String(jt)),k("layout-lock").title=jt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",ae),k("viewport").dataset.layoutLocked=String(jt),k("prefer-write").checked=L.preferWrite===!0,k("prefer-write").disabled=ae,k("show-exceptions").checked=te()?.showExceptions!==!1,k("show-exceptions").disabled=ae||ce||!te()||ye===te(),k("selected-edges-only").checked=te()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=ae||ce||!te()||ye===te(),document.documentElement.dataset.theme=L.dark?"dark":"light",k("theme").replaceChildren(io(L.dark?vc:wc)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(L.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",ae||!e),k("node-list-drawer").hidden=!n||ft().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",ae||!e),Fe?.syncChrome()}function Ji(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!te(),t.disabled=Qn||ae||!te()||ye===te(),t.setAttribute("aria-busy",String(Qn))}}function ri(){Ji(),document.querySelector(".toolbar").dataset.settingsOpen=String(_t),k("display-options").hidden=!_t,k("reset-layout").disabled=ae||De||ce||!1||!te()||Xt.has(L.document?.key??"")||$n||In;const e=k("display-settings-toggle"),t=_t?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(_t)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ae||ce||!te()||ye===te()}function pa(e,t=!1){const n=te();ae||ce||!n||ye===n||e===_t||(e&&(Un.delete(Yt(n)?.key??n.key),ai()),ht.cancel(),Te=void 0,we(),_t=e,ri(),Vt(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function ma(e){const t=te();if(!(Qn||ae||!t||ye===t)){Qn=!0,Ji();try{const n=ml(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await gl(n),ze("グラフ全体のPNGをコピーしました。")):await bl(n,(Yt(t)?.name??t.name)+(to(t)?" - "+to(t):""))}catch(n){ze((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{Qn=!1,Ji()}}}k("save-image").onclick=()=>ma(!1);k("copy-image").onclick=()=>ma(!0);k("display-settings-toggle").onclick=()=>pa(!_t);k("reset-layout").onclick=()=>{const e=te();if(ae||De||ce||ye||!e||Xt.has(En(e)))return;try{si()}catch{et();return}ht.cancel(),dn.cancel(),Te=void 0,we();const t={...e,design:Zo(e)},n=Ul(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),wa.invalidate(e),Oe(),n!==t&&Se()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&_t&&k("source-dialog").hidden&&(e.preventDefault(),pa(!1,!0))});function we(e=!0){const t=te();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Bt(),Se(180,!1)),o}function ha(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function _i(){Yl.close(),Ql.close(),la.close(),Bi.close(),ha(iu),Bi.update()}function iu(){const e=k("tabs");e.replaceChildren(),L.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===L.active?" active":""),n.draggable=to(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Fo(t)!==void 0&&(n.dataset.activity=Fo(t)),Vo(t)!==void 0&&(n.dataset.object=Vo(t));const o=document.createElement("button");Li(o,"business",t.name),o.setAttribute("aria-current",String(t.key===L.active)),o.disabled=ce,o.onclick=async()=>{if(ce||Lt&&Lt!==t.key&&!await mo())return;const s=we()||L.active!==t.key;Fe?.activateBusiness(),L.active=t.key,Oe(),Fe?.businessActivated(),Se(180,s)};const i=Di("業務設計："+t.name+"を閉じる");i.disabled=ce,i.onclick=()=>ou(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),ce)return;const r=L.tabs.findIndex(u=>u.key===s.dataTransfer?.getData("text/plain")),l=L.tabs.indexOf(t);if(r>0&&l>0&&r!==l){const[u]=L.tabs.splice(r,1);L.tabs.splice(l,0,u),_i(),Se()}},n.onkeydown=s=>{if(!ce&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const r=L.tabs.indexOf(t),l=r+(s.key==="ArrowLeft"?-1:1);r>0&&l>0&&l<L.tabs.length&&([L.tabs[r],L.tabs[l]]=[L.tabs[l],L.tabs[r]],_i(),Se())}},e.append(n)})}const wr=new Map,Un=new Set;function ai(){const e=te(),t=!!e&&e.design.sourceFormat!=="json"&&Un.has(Yt(e)?.key??e.key)&&!e.checks;t||(la.close(),An.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),An.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=ae||De||ce||!1||!e||mn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=te();e&&Un.delete(Yt(e)?.key??e.key),ai()};let Xi;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{Xi=k("check-followup-open"),k(t).click(),Xi=void 0};function gs(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===fs}function mn(e){const t=Yt(e)?.key??e.key;let n=wr.get(t);return n||(n={},wr.set(t,n)),n}async function ys(e,t){if(!Qt(e))throw Error("原本文書が切り替わりました。");const n=$t(L,L.recovery,{...L.document,checks:t},ds(L).views);await po(()=>n,()=>{L=n,t&&Un.delete(Yt(e)?.key??e.key)})}async function ba(e,t){const n=mn(e);if(e.design.sourceFormat==="json"||n.busy||ce||ae||ye===e)return;const o=no(e);n.busy=!0,n.error=void 0,n.candidate=void 0,en();try{const i=await t();if(!Qt(e))return;if(o!==no(L.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=zn(i),r=oo(s,L.tabs[0]);if(r.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+r.reason);r.state==="unverified"?n.candidate=i:(await ys(e,i),n.candidate=void 0,Fe?.openRelatedChecks(te()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,ze(n.error,"error")}finally{n.busy=!1,en()}}async function ga(e,t){const n=mn(e);if(n.busy||ce||!Qt(e))return;const o=oo(zn(t),L.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,en();return}n.busy=!0,n.error=void 0;try{await ys(e,{...t,confirmedFor:no(L.tabs[0])}),n.candidate=void 0,Fe?.openRelatedChecks(te()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,en()}}function en(){ai();const e=te(),t=k("detail"),n=e?mn(e):void 0,o=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=ae||ce||ye===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const r=e.design.graph.nodes.find(f=>f.id===e.selected),l=il(e,n,{disabled:ae||ce||ye===e,redraw:en,confirm:f=>{ga(e,f)}}),u=document.createElement("div");u.className="right-drawer-heading";const c=Fc(r?.name??"業務設計");if(r){const f=r.type==="business"?ya(String(r.who),r.id):Wr(r);f.classList.add("drawer-node-icon"),c.prepend(f)}u.append(c);const a=document.createElement("button");if(a.type="button",a.id="business-drawer-close",a.setAttribute("aria-label","右ドロワーを閉じる"),a.textContent="×",a.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},u.append(a),t.append(u),l.hasChildNodes()&&t.append(l),r){const f=zl(e.design,r.id,vs);f.hasChildNodes()&&t.append(f)}t.append(yd(e.design,r?.id)),r?.type==="business"&&Fe?.appendActivityTestLinks(t,r.id),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const kr=new Map,ft=()=>{const e=L.active??"";let t=kr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},kr.set(e,t)),t};function vs(e){if(!te())return;const t=ft();t.mode="findings",t.finding=e,L.nodeDrawer=!0,innerWidth<=800&&(L.drawer=!1),ut(),St(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Se()}function su(e){const t=te();if(!t)return;const n=ft();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){vs(o[0]);return}L.nodeDrawer=!0,innerWidth<=800&&(L.drawer=!1),ut(),St(),k("drawer-mode-findings").focus({preventScroll:!0}),Se()}function ru(e,t){const n=ft().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(l=>l.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(l=>l.id===n.id&&typeof l.problem=="string"):void 0;if(!o&&!i)return ft().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{ft().finding=void 0,St(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(ql(o));else{const l=document.createElement("h2");l.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(l,xn(String(i.problem)))}const r=o?.targets??[i.id];if(r.length){const l=document.createElement("section"),u=document.createElement("h3");u.textContent="関連項目へ移動",l.append(u);for(const c of r){const a=document.createElement("button");a.className="node-navigate finding-target-link",a.dataset.findingTarget=c;const f=e.design.graph.nodes.some(b=>b.id===c),d=e.hiddenNodes?.includes(c);a.disabled=!f||!!d,a.textContent=(e.design.graph.nodes.find(b=>b.id===c)?.name??c)+(f?d?"（非表示）":"":"（参照先なし）"),a.onclick=()=>Po(c,!0),l.append(a)}t.append(l)}return!0}function ya(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&te()?.design.model?.business.roles?ss(te().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(io(Rr)),o}function ci(e,t=!0){ae||!te()||(ht.cancel(),we(),L.nodeDrawer=e,e&&ft().mode==="findings"&&innerWidth<=800&&(L.drawer=!1),ut(),e&&te()?.selected&&Vn(te().selected),St(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Se())}function Vn(e){const t=te(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=ft();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(Uc(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function au(e,t){const n=te();if(!n||ae||ce||ye===n)return;ht.cancel(),Te=void 0,we();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],hn(),Se()}function Po(e,t=!1){let n=te();if(n&&!Zo(n).graph.nodes.some(f=>f.id===e)&&(we(),Fe?.reopenBusinessOverview(),L.active=L.tabs[0].key,n=te(),Oe()),!n||n.hiddenNodes?.includes(e)||ye===n)return;t||(ft().finding=void 0);const o=k("node-list").contains(document.activeElement);ht.cancel(),Te=void 0,we(),n.selected=e,Vn(e),ut(),hn();const i=k("viewport"),s=i.getBoundingClientRect(),r=k("formattedMarkdownDrawer").getBoundingClientRect(),l=L.drawer&&r.left>s.left&&r.left<s.right?r.left:s.right,u=Math.max(1,Math.min(i.clientWidth,l-s.left-i.clientLeft)),c=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const a=n.positions[e];if(n.scroll=[(a[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-u/2,(a[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-c/2],Vt(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],we(),o){const f=t?"[data-finding-target]":"[data-list-node]",d=Array.from(k("node-list").querySelectorAll(f)).find(b=>(t?b.dataset.findingTarget:b.dataset.listNode)===e);(t?d:d?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Se()}function St(){const e=te(),t=ft(),n=k("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=k("drawer-modes");s.replaceChildren();for(const g of["findings"]){const h=document.createElement("button");h.id="drawer-mode-"+g,h.setAttribute("role","tab"),h.setAttribute("aria-selected",String(t.mode===g)),h.setAttribute("aria-controls","node-list"),h.tabIndex=t.mode===g?0:-1,h.textContent=`指摘（${e?Wl(e.design):0}）`;const p=()=>{t.mode=g,St(),k("drawer-mode-"+g).focus({preventScroll:!0})};h.onclick=p,h.onkeydown=x=>{["ArrowLeft","ArrowRight","Home","End"].includes(x.key)&&(x.preventDefault(),h.focus({preventScroll:!0}))},s.append(h)}for(const g of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const r=k("node-list-search");r.value=t.search,r.disabled=!e||ae;const l=k("node-categories");l.replaceChildren();for(const[g,h]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const p=document.createElement("button");p.dataset.category=g,p.id="node-category-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.category===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.category===g?0:-1,p.textContent=h,p.onclick=()=>{t.category=g,St(),k("node-category-"+g).focus({preventScroll:!0})},p.onkeydown=x=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(x.key))return;x.preventDefault();const M=["activity","object","role"],w=M.indexOf(g);t.category=x.key==="Home"?"activity":x.key==="End"?"role":M[(w+(x.key==="ArrowRight"?1:2))%3],St(),k("node-category-"+t.category).focus({preventScroll:!0})},l.append(p)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const u=new Set(e?.hiddenNodes??[]),c=e?.design.graph.nodes.filter(g=>!g.scope)??[],a=c.filter(g=>!u.has(g.id)).length,f=k("scope-outside"),d=a===c.length?"true":a===0?"false":"mixed";f.setAttribute("aria-pressed",d),f.setAttribute("aria-label",d==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(io(d==="false"?kc:Ic)),f.disabled=!c.length||ae||ye===e;const b=k("show-outside");if(b.checked=d==="true",b.indeterminate=d==="mixed",b.setAttribute("aria-checked",d),b.disabled=f.disabled,k("scope-count").textContent=d==="mixed"?`${a}/${c.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(ru(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(p=>p.id===t.filterNode)?.name??t.filterNode)+"の指摘";const h=document.createElement("button");h.className="node-navigate finding-all",h.textContent="すべての指摘",h.onclick=()=>{t.filterNode=void 0,St(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,h)}n.append($l(e.design,t.resolved,g=>{t.resolved=g,St(),n.querySelector("input")?.focus({preventScroll:!0})},vs,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>ci(!L.nodeDrawer);k("node-list-close").onclick=()=>ci(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),ci(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),ci(!1))});k("node-list-search").oninput=()=>{ft().search=k("node-list-search").value,St()};function va(){const e=te();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);au(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=va;k("show-outside").onchange=va;const cu="http://www.w3.org/2000/svg",Ci=e=>document.createElementNS(cu,e),wa=new zi,Ir=new WeakMap;function du(e){if(!qr(e.graph))return;let t=Ir.get(e);return t||(t=qd(e),Ir.set(e,t)),t.wires}function lu(e,t,n){os(k("edges"),e,t,{"data-relation":String(n)})}let so=()=>{},Jt=[0,0],cn=[0,0];function uu(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function fu(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Vt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],cn[0]):0,i[1]<0||n[1]>0?Math.min(i[1],cn[1]):0],{growth:r,origin:l}=yc(n,s,e.zoom),u=r.some(Boolean);u&&(e.canvasOrigin=l,e.scroll=[e.scroll[0]+r[0],e.scroll[1]+r[1]],Bt(),Se(180,!1));const c=Math.ceil(Math.max(1400,Jt[0],(uu()+e.scroll[0])/e.zoom-t[0]*2-l[0],...o.map(f=>f[0]+340))),a=Math.max(850,Jt[1],Math.max(Jt[1],...o.map(f=>f[1]+68))+fu()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-l[1],...o.map(f=>f[1]+220));k("canvas").style.width=(c+l[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(a+l[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(l[0]+t[0])*e.zoom+"px",k("nodes").style.top=(l[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=c+"px",k("nodes").style.height=a+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-l[0]} ${-l[1]} ${c+l[0]} ${a+l[1]}`),k("edges").style.width=(c+l[0])*e.zoom+"px",k("edges").style.height=(a+l[1])*e.zoom+"px",u&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function hn(){ha(pu)}function pu(){ri(),dn.cancel(),so=()=>{},Jt=[0,0],cn=[0,0];const e=te();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,en(),St();return}const t=Zo(e),n=t.graph.nodes,o=n.filter(a=>!e.hiddenNodes?.includes(a.id)),i=new Set(o.map(a=>a.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,r=e.positions,l=Wo(t.graph.relations,s);Vt(e),k("edges").append(ns());const u=Fl(t.graph.relations,L.preferWrite===!0),c=()=>{const a=n.flatMap(p=>{const x=r[p.id];return x?[{id:p.id,x:x[0],y:x[1],width:260,height:68}]:[]}),f=du(t),d=wa.update(e,t,a,t.graph.relations,f),b=new Map;for(Jt=[0,0],cn=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(p=>[p.id,p.name]));t.graph.relations.forEach((p,x)=>{if(u.has(x))return;const M=d[x];if(!M||(Jt[0]=Math.max(Jt[0],M.bounds.right+20,M.label[0]+Math.max(30,p.label.length*12)/2+12),Jt[1]=Math.max(Jt[1],M.bounds.bottom+20,M.label[1]+22),cn[0]=Math.min(cn[0],...M.points.map(R=>R[0]-20),M.label[0]-Math.max(30,p.label.length*12)/2-12),cn[1]=Math.min(cn[1],...M.points.map(R=>R[1]-20),M.label[1]-22),e.selectedEdgesOnly===!0&&l.muted(p)||!i.has(p.from)||!i.has(p.to)||e.showExceptions===!1&&(p.kind==="business-exception"||p.kind==="object-exception")))return;const w=Ci("path");w.setAttribute("d",M.path),w.dataset.relation=String(x),w.dataset.collisions=String(M.collisions),w.dataset.rerouted=String(M.rerouted),w.dataset.fallback=String(M.fallback),w.setAttribute("marker-end","url(#arrow)"),w.classList.add("edge"),p.kind.endsWith("exception")&&w.classList.add("exception"),l.related(p)&&(w.classList.add("review-related"),w.setAttribute("marker-end","url(#related-arrow)")),l.muted(p)&&w.classList.add("muted");const D=Ci("title");D.textContent=(g.get(p.from)??p.from)+" → "+(g.get(p.to)??p.to)+": "+p.label,w.append(D),k("edges").append(w),p.kind.endsWith("exception")&&lu(w,M,x);const I=Tr(p,x,f?.[x]),y=b.get(I);if(y){y.dataset.relations+=" "+x,l.related(p)&&(y.classList.add("review-related"),y.classList.remove("muted"));return}const z=Ci("text");b.set(I,z),z.dataset.relations=String(x),z.setAttribute("x",String(M.label[0]-Math.max(30,p.label.length*12)/2)),z.setAttribute("y",String(M.label[1])),z.setAttribute("text-anchor","start"),z.classList.add("edge-label"),z.setAttribute("dominant-baseline","middle"),z.dataset.relation=String(x),l.related(p)&&z.classList.add("review-related"),l.muted(p)&&z.classList.add("muted"),z.textContent=p.label,k("edges").append(z)});const h=k("edges");for(const p of[...Array.from(h.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(h.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(h.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(h.querySelectorAll(".edge-label.review-related"))])h.append(p);Vt(e)};so=c,c(),o.forEach(a=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+a.type+(a.scope?"":" outside")+l.nodeClasses(a.id),f.dataset.node=a.id,a.type==="business"&&(f.dataset.activity=a.id),f.style.left=r[a.id][0]+"px",f.style.top=r[a.id][1]+"px",a.type==="business"?f.append(ya(String(a.who),a.id)):f.append(Wr(a));const d=document.createElement("span");d.className="node-text";const b=document.createElement("span");b.className="review-kind",b.textContent=(a.type==="business"?"Activity":"Object")+(a.scope?" · 範囲内":" · 範囲外"),d.append(b);const g=document.createElement("span");if(g.className="node-name",g.textContent=a.name,d.append(g),a.type==="business"){const w=document.createElement("small");w.textContent=String(a.who),d.append(w)}if(f.append(d),Sc(a.id,to(e))){const w=document.createElement("button");w.type="button",w.className=a.type==="business"?"activity-open":"object-open",w.setAttribute("aria-label",a.name+"の詳細タブを開く"),w.title="詳細タブを開く",w.textContent="開く",w.onpointerdown=D=>D.stopPropagation(),w.onpointerup=D=>D.stopPropagation(),w.onclick=D=>{D.stopPropagation(),a.type==="business"?Zi(a.id):ka(a.id),Fe?.businessActivated()},f.append(w)}f.title=a.name+(a.type==="business"?" — "+String(a.who):""),f.setAttribute("aria-label",f.title+(a.id===s?"（選択中）":""));const h=Tl(e.design,a);if(h.length){const w=document.createElement("button");w.type="button",w.className="finding-badges",w.textContent=h.join(" · "),w.setAttribute("aria-label",a.name+"の指摘を開く"),w.onpointerdown=D=>D.stopPropagation(),w.onpointerup=D=>D.stopPropagation(),w.onclick=D=>{D.stopPropagation(),su(a.id)},f.append(w),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+h.join("、"))}let p;const x=f;x.onpointerdown=w=>{w.button!==0||ye===e||jt||(w.stopPropagation(),x.setPointerCapture(w.pointerId),p=w.pointerId,dn.begin(a.id,[w.clientX,w.clientY]))},x.onpointermove=w=>{p===void 0||w.pointerId!==void 0&&w.pointerId!==p||!f.isConnected||ye===e||dn.move([w.clientX,w.clientY])},x.onpointerup=w=>{if(p===void 0||p!==w.pointerId||(p=void 0,!f.isConnected||ye===e))return;const D=dn.end();x.hasPointerCapture?.(w.pointerId)&&x.releasePointerCapture(w.pointerId),D&&(D.moved||(ft().finding=void 0,e.selected!==a.id&&(e.selected=a.id,Bt()),Vn(a.id)),we(),hn(),Se(180,!1))};const M=w=>{p===void 0||p!==w.pointerId||(p=void 0,f.isConnected&&(dn.cancel(),we(),Se(180,!1)))};x.onpointercancel=M,x.onlostpointercapture=M,k("nodes").append(f)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",en(),St()}function Zi(e){ae||ce||ye||(we(),Jd(L,e),Oe(),Se(),k("viewport").focus({preventScroll:!0}))}function ka(e){ae||ce||ye||(we(),_d(L,e),Oe(),Se(),k("viewport").focus({preventScroll:!0}))}function Oe(){Ia(),document.title=L.document?L.document.name+" · Alder Viewer":"Alder Viewer",ht.cancel(),Te=void 0,ut(),_i(),hn();const e=te();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",ae||ce||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Xt.has(En(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",ae||De||ce||!1||!e||Xt.has(En(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",ae||De||ce||!1||!e||!!(e&&mn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",ae||De||ce);k("open-sample").setAttribute("aria-disabled",String(ae||De||ce)),k("open-sample").tabIndex=ae||De||ce?-1:0,k("theme").toggleAttribute("disabled",ae),co(),ai(),Xl(),ui(),Fe?.syncDocument()}function Ia(){const e=k("header-title"),t=L.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{mu(n.value)},e.append(n));const o=Array.from(n.options).map(i=>[i.value,i.textContent]);JSON.stringify(o)!==JSON.stringify(t.choices.map(({id:i,name:s})=>[i,s]))&&n.replaceChildren(...t.choices.map(({id:i,name:s})=>{const r=document.createElement("option");return r.value=i,r.textContent=s,r})),n.value=t.selected,n.title=t.choices.find(i=>i.id===t.selected)?.name??"",n.disabled=ae||De||ce||!1}async function mu(e){const t=L.document;if(!t?.design.namedPlans||ae||De||ce||ye||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),o=document.activeElement===n;try{if(!k("source-dialog").hidden&&!await mo()){Ia();return}const i=tn(t.design.markdown,e),s=crypto.randomUUID(),r=$t({...L,tabs:[],active:s},L.recovery,{...t,design:i},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await po(()=>r,()=>{L=r}),Fe?.reopenBusinessOverview(),Fe?.activateBusiness(),Fe?.businessActivated(),ze("")}catch(i){Oe(),i instanceof Cn||ze("案を切り替えられません: "+i.message,"error")}finally{o&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function fo(e){const t=L.document,n=Gd(L,e);return t?(await po(()=>n,()=>{L=n,Un.add(Yt(L.tabs[0])?.key??L.tabs[0].key)}),!0):(we(),L=n,Un.add(Yt(L.tabs[0])?.key??L.tabs[0].key),Oe(),Se(),!0)}async function Sa(e,t){if(Lt&&!await mo())return;const n=await Bo(e),o=te();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await ro(o,n,t))return;Fe?.reopenBusinessOverview(),L.active=L.tabs[0].key,Oe(),Se();return}const i=Fn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await fo(i)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(ae||De||ce))try{if(L.document?.source?.kind==="sample"&&L.document.design.markdown===gr){we(),Fe?.reopenBusinessOverview(),L.active=L.tabs[0].key,Oe(),k("viewport").focus({preventScroll:!0});return}const t=tn(gr),n=L.document?.source?.kind==="sample"&&L.document.design.markdown===fs?L.tabs[0]:void 0;n&&we();const o=n??L.sampleLayout,i=o?Kl(o,t):{},s=Fn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await fo(s)&&k("viewport").focus({preventScroll:!0})}catch(t){ze("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(ae||De||ce)){De=!0,Oe();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Sa(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&ze("開けません: "+e.message,"error")}finally{De=!1,Oe()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(ae||De||ce)){De=!0,Oe();try{for(const t of Array.from(e.files??[]))await Sa(t)}catch(t){ze("開けません: "+t.message,"error")}e.value="",De=!1,Oe()}};class Cn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function po(e,t){if(ce||ye)throw Error("表示を切り替えています。完了後に再試行してください。");try{si()}catch(i){throw new Cn(i)}we(),clearTimeout(un),un=void 0,ce=!0,Mt++;const n=Mt;Oe(),et();let o=!1;try{const i=structuredClone(ds(e()));await fa(i,n);const s=L;t(),L!==s&&(L=Xd(L,s)),lt==="view"&&Lt&&!L.tabs.some(r=>r.key===Lt)&&(Lt=L.tabs[0]?.key),ua(i),o=!0}catch(i){throw bs(),new Cn(i)}finally{ce=!1,Oe(),et(),o&&Mt!==n&&Se(0,!1)}}async function ro(e,t,n=e.handle,o=!1){if(!Qt(e)||e.design!==L.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=tn(t.markdown,e.design.namedPlans.selected));const i=!!e.design.namedPlans!=!!t.namedPlans,s=crypto.randomUUID(),r=L.document,l=i&&r?$t({...L,tabs:[],active:s},L.recovery,{...r,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):Kd(L,t,n,o);return await po(()=>l,()=>{L=l}),Sn=void 0,ui(),ze(""),!0}async function Sr(e){if(!Qt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await ro(e,await Bo(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const r=i.files?.[0];r&&await ro(e,await Bo(r)),s()}catch(r){i.remove(),o(r)}},i.click()})}k("refresh").onclick=async()=>{const e=te();if(ae||ce||ye||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Xt.has(En(e)))return;Lt===e.key&&Jo();const t=En(e);Xt.add(t),Oe();try{if(e.source?.kind==="url"){const o=await ei(e.source.url);await ro(e,o);return}if(!e.handle){await Sr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Qt(e))return;if(n!=="granted"){ze("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Sr(e);return}await ro(e,await Bo(await e.handle.getFile()))}catch(n){Qt(e)&&n.name!=="AbortError"&&!(n instanceof Cn)&&ze("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Xt.delete(t),Oe()}};let lt="text",Lt,Zt=!1,fn=0,Ko,Yi=null;const Ft=()=>k("source-text"),ao=()=>k("source-url");function ws(){Hi=!k("source-dialog").hidden&&lt!=="view"&&(lt==="text"?Ft().value:ao().value)!=="",et()}ao().addEventListener("input",ws);function co(){Qi();const e=lt==="view",t=Zt||ce;Ft().disabled=t,Ft().readOnly=e,k("source-dialog").dataset.mode=lt,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=ce||t&&lt!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",ws(),queueMicrotask(Ea)}function ks(e,t){if(!(ae||De||ce||t&&Xt.has(En(t)))){Ko?.abort(),fn++,lt=e,Lt=t?.key,Zt=!1,Yi=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${L.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Ft().value=t.design.markdown:e==="text"&&(Ft().value=di),co(),(e==="url"?ao():Ft()).focus()}}let di="",Lo;function hu(){if(Yi?.isConnected&&Yi.focus({preventScroll:!0}),Lo!==void 0&&cancelAnimationFrame(Lo),lt!=="view")return;const e=fn;Lo=requestAnimationFrame(()=>{if(Lo=void 0,e!==fn||!k("source-dialog").hidden)return;const t=window.visualViewport,n=xt.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Jo(){fn++,Ko?.abort(),Zt=!1,Lt=void 0,k("source-dialog").hidden=!0,co(),hu()}async function mo(){return ce?!1:(lt==="text"&&(di=Ft().value),Jo(),!0)}function xa(){return mo()}Ft().oninput=()=>{lt==="text"&&(di=Ft().value,ws())};let To=!1;function Aa(){return ae||De||Zt||ce||ye?"読込が終わってから共有してください。":Vl(te())}function Qi(){const e=Aa(),t=k("share-source");t.hidden=!te(),t.setAttribute("aria-disabled",String(To||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(To)return;const e=Aa();if(e){ze(e,"warning");return}const t=te();if(t.source?.kind!=="url")return;const n=t.source.url,o=Bl(location.href,n);To=!0,Qi();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),ze("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{ze("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{To=!1,Qi()}};let Kt,Dn=0,xr=0,eo;function Ea(){if(ae||De||Zt||ye||ce||Kt||eo===void 0)return;const e=eo;eo=void 0,Is(e)}async function Is(e=location.hash){const t=e;if(ae)return;const n=++xr;if(!/^#source(?:=|$)/.test(t)){eo=void 0,Kt&&!ce&&(Kt.abort(),Kt=void 0,Dn++,De=!1,Oe());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),ce){eo=t;return}if(Zt||De&&!Kt){ze("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++Dn;Kt?.abort();try{const i=Hl(t);si();const s=L.tabs.find(c=>c.source?.kind==="url"&&c.source.url===i),r=s;if(r){if(Lt&&Lt!==r.key&&!await mo()||o!==Dn||n!==xr)return;const c=we()||L.active!==r.key;L.active=r.key,Oe(),Se(180,c),ze("開いている共有元のタブを選択しました。表示内容は保持しています。"),ho();return}Kt=new AbortController,De=!0,Oe();const l=await ei(i,Kt.signal);if(o!==Dn)return;const u=Fn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:l,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},l);if(!await fo(u))return;ze("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===Dn&&!(i instanceof Cn)&&ze("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===Dn&&(Kt=void 0,De=!1,Oe(),Ea())}}window.addEventListener("hashchange",()=>{Is().then(()=>{L.document?.key===es&&ho()})});function Ss(e){L.drawer=!0,ut(),en()}async function bu(e){const t=mn(e);if(!(e.design.sourceFormat==="json"||t.busy||ce||ae||ye===e)){t.busy=!0;try{await ys(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,en()}}}let _o;Ut.onchange=()=>{const e=Ut.files?.[0],t=_o??te();_o=void 0,Ut.value="",!(!e||!t||!Qt(t))&&(Ss(),ba(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ut.oncancel=()=>{_o=void 0};k("check-open").onclick=()=>{_o=te(),Ut.click()};let xs,qo=null;function As(){nn.hidden=!0,xs=void 0,(qo&&!qo.closest("[hidden]")?qo:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=te();e&&(qo=Xi??document.activeElement,xs=e,k("check-url").value=mn(e).url??"",nn.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=As;nn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),As())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=xs;if(!t||!Qt(t))return;const n=k("check-url").value.trim();mn(t).url=n,As(),Ss(),ba(t,async()=>({name:n,url:n,markdown:await Rl(n)}))};k("check-open-sample").onclick=()=>{const e=te();!e||!gs(e)||(Ss(),ga(e,{name:"チェックリストのサンプル",markdown:Jl}))};k("check-close").onclick=()=>{const e=te();e&&bu(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=te();e&&ks("view",e)};k("open-url").onclick=()=>ks("url");k("open-text").onclick=()=>ks("text");k("source-cancel").onclick=()=>xa();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),xa())};k("source-submit").onclick=async()=>{if(Zt||ce||lt==="view"&&ye||k("source-dialog").hidden||lt==="view")return;Zt=!0,co();const e=++fn,t=lt;Ko=new AbortController;try{const n=lt==="url"?new URL(ao().value.trim()).href:ao().value.trim();if(t==="url"&&L.document?.source?.kind==="url"&&L.document.source.url===n){Fe?.reopenBusinessOverview(),L.active=L.tabs[0].key,Jo(),Oe(),ho();return}const o=t==="url"?await ei(n,Ko.signal):Pl(Ft().value),i=o.markdown;if(e!==fn)return;const s=Fn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await fo(s))return;ze(""),t==="text"&&(di=i),Jo()}catch(n){e===fn&&!(n instanceof Cn)&&ze("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===fn&&(Zt=!1,co())}};k("layout-lock").onclick=()=>{ae||(ht.cancel(),Te=void 0,we(),jt=!jt,ut(),hn())};k("selected-edges-only").onchange=()=>{const e=te();!e||ae||ce||ye===e||(ht.cancel(),Te=void 0,we(),e.selectedEdgesOnly=k("selected-edges-only").checked,so(),Se())};k("show-exceptions").onchange=()=>{const e=te();!e||ae||ce||ye===e||(ht.cancel(),Te=void 0,we(),e.showExceptions=k("show-exceptions").checked,so(),Se())};k("prefer-write").onchange=()=>{ae||(we(),L.preferWrite=k("prefer-write").checked,hn(),Se())};k("theme").onclick=()=>{ae||(L.dark=!L.dark,ut(),Se())};k("drawer").onclick=()=>{ae||!te()||(we(),L.drawer=!L.drawer,Oe(),Se())};for(const[e,t]of[["in",Fs],["out",1/Fs]])k(e).onclick=()=>{const n=te();if(n&&ye!==n){const o=we(),i=mc({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,Oe(),Se(180,s)}};const Ee=k("viewport");function Ca(e,t){const n=te();if(!n||ce||ye===n)return;we();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Bt();const i=Array.from(k("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),so()}const dn=gc({read:()=>{const e=te();return e&&!ce&&e!==ye&&!jt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[Ee.scrollLeft,Ee.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>te()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=Ee.getBoundingClientRect(),t=e.left+Ee.clientLeft,n=e.top+Ee.clientTop,o={left:t,top:n,right:t+Ee.clientWidth,bottom:n+Ee.clientHeight};for(const[s,r]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const l=k(s),u=l.getBoundingClientRect();l.hidden||u.bottom<=n||u.top>=o.bottom||(r==="right"&&u.left>o.left&&u.left<o.right&&(o.right=u.left),r==="left"&&u.right>o.left&&u.right<o.right&&(o.left=u.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:Ca,pan:e=>{const t=te();if(!t||t===ye||jt)return;we();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Vt(t),Ee.scrollLeft=t.scroll[0],Ee.scrollTop=t.scroll[1],we(),Bt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),ht=hc(Ee,{nodeDrag:dn,read:()=>{const e=te();return e&&!ce&&ye!==e?{key:e.key,zoom:e.zoom,locked:jt,scroll:[Ee.scrollLeft,Ee.scrollTop]}:void 0},position:e=>te()?.positions[e],change:e=>{const t=te();if(!t||ce||ye===t)return;const n=t.scroll;let o=!1;e.node&&Ca(e.node.id,e.node.position),e.selected&&(ft().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Vn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?hn():e.zoom!==void 0&&Vt(t),e.scroll&&(Ee.scrollLeft=e.scroll[0],Ee.scrollTop=e.scroll[1]),we(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Bt()},finish:()=>{const e=te();e&&Vt(e),we(),Se(180,!1)}}),Es=()=>{ht.cancel(),Te=void 0,we(),Se(0,!1)};window.addEventListener("blur",Es);window.addEventListener("pagehide",Es);document.addEventListener("visibilitychange",()=>{document.hidden&&Es()});Ee.onscroll=()=>{we()};let Te;bc(Ee,{read:()=>{const e=te();return e&&!ae&&!ce&&e!==ye?{zoom:e.zoom,scroll:[Ee.scrollLeft,Ee.scrollTop]}:void 0},change:e=>{const t=te();!t||ce||t===ye||(ht.cancel(),dn.cancel(),Te=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Vt(t),Ee.scrollLeft=t.scroll[0],Ee.scrollTop=t.scroll[1],we(!1),Bt(),Se(180,!1))}});Ee.onpointerdown=e=>{const t=te(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||ce||t===ye||n&&!jt||(Te={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[Ee.scrollLeft,Ee.scrollTop],node:n,moved:!1},Ee.setPointerCapture(e.pointerId))};Ee.onpointermove=e=>{if(Te&&Te.pointer===e.pointerId&&Te.key===te()?.key&&te()!==ye){const t=e.clientX-Te.x,n=e.clientY-Te.y;Math.hypot(t,n)>3&&(Te.moved=!0),Ee.scrollLeft=Te.scroll[0]-t,Ee.scrollTop=Te.scroll[1]-n,we()}};Ee.onpointerup=e=>{if(!Te||Te.pointer!==e.pointerId)return;const t=te(),n=Te;Te=void 0,Ee.hasPointerCapture?.(e.pointerId)&&Ee.releasePointerCapture(e.pointerId),t&&t!==ye&&n.key===t.key&&!n.moved&&n.node&&(ft().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Bt()),Vn(n.node),hn()),we(),Se(180,!1)};Ee.onpointercancel=()=>{Te=void 0};Ee.addEventListener("lostpointercapture",e=>{e.target===Ee&&Te?.pointer===e.pointerId&&(Te=void 0)});let li=!1;k("resize").onpointerdown=e=>{ae||(li=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(li){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==L.width&&(L.width=t,Bt()),ut()}};k("resize").onpointerup=()=>{li=!1,Se(180,!1)};k("resize").onpointercancel=()=>{li=!1,Se(180,!1)};k("resize").onkeydown=e=>{if(!ae&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,L.width+(e.key==="ArrowLeft"?20:-20)));t!==L.width&&(L.width=t,Bt()),ut(),Se(180,!1)}};window.addEventListener("resize",()=>{ut();const e=te();e&&Vt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=te();t&&Vt(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function Do(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=tn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");zn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Bn=document.createElement("section");Bn.id="source-update-notice";Bn.className="info-bar";Bn.hidden=!0;Bn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Bn);let Sn;const Oa=new Set;let Oi=0,es,Ni;function ui(){const e=L.document;Bn.hidden=!Sn||Sn.key!==e?.key||Sn.baseline!==e.design.markdown||Oa.has(e.key),k("source-update-refresh").disabled=ae||De||ce||!!(e&&Xt.has(e.key))}k("source-update-close").onclick=()=>{Sn&&Oa.add(Sn.key),ui()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function ho(){const e=L.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Ni===t)return;Ni=t;const n=++Oi,o=e.key,i=e.source.url,s=e.design.markdown;try{const r=await ls(i);if(n!==Oi||L.document?.key!==o||L.document.design.markdown!==s||L.document.source?.kind!=="url"||L.document.source.url!==i)return;tn(r),Sn=r.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,ui()}catch{}finally{n===Oi&&(Ni=void 0)}}Fe=Cd(xt,{rightDrawer:{isOpen:()=>L.drawer,isReady:()=>!ae,setOpen:e=>{ae||(L.drawer=e,ut(),Se())}},capture:()=>{we(),ht.cancel(),Te=void 0},business:()=>({key:L.document?.design.namedPlans?JSON.stringify([L.document.key,L.document.design.namedPlans.selected]):L.document?.key,design:L.document?.design,relatedChecks:L.tabs[0]?ol(L.tabs[0]):[],viewKey:te()?.key,views:L.tabs.map(e=>({key:e.key,name:e.name,activity:Fo(e),object:Vo(e)})),activities:L.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:L.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:L.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!L.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=L.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Zi(e),Po(e)},openObject:e=>{ka(e),Po(e)},openOverview:()=>{L.tabs[0]&&(we(),Fe?.reopenBusinessOverview(),L.active=L.tabs[0].key,Oe(),Se())},activateView:e=>{L.tabs.some(t=>t.key===e)&&(we(),L.active=e,Oe(),Se())},statePanel:e=>L.document?Md(L.document.design,e,t=>{Fe?.activateBusiness(),Zi(t),Po(t),Fe?.businessActivated()}):void 0,closeLegacyList:()=>{L.nodeDrawer=!1,ut()},refresh:()=>{ut(),Bi.update()}});const gu=L;Oe();et();$d().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const c of t.recovery??[])Do(c);if(t.document){const c={...t.document};Do(c),t.document.design=c.design,t.document.checks=c.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const c of t.tabs)Do(c)}const n=Hd(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(c=>({...c,name:n.document.name,design:c.design,checks:c.checks,source:c.source,draft:c.draft,edited:c.edited,handle:c.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const c of o.tabs)Do(c);if(new Set(o.tabs.map(c=>c.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const c of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!c||!c.positions||typeof c.positions!="object"||Array.isArray(c.positions)||c.selectedEdgesOnly!==void 0&&typeof c.selectedEdgesOnly!="boolean"||c.showExceptions!==void 0&&typeof c.showExceptions!="boolean"||c.hiddenNodes!==void 0&&(!Array.isArray(c.hiddenNodes)||!c.hiddenNodes.every(a=>typeof a=="string"))||c.viewInset!==void 0&&(!Array.isArray(c.viewInset)||c.viewInset.length!==2||!c.viewInset.every(a=>Number.isFinite(a)&&a>=0))||c.canvasOrigin!==void 0&&(!Array.isArray(c.canvasOrigin)||c.canvasOrigin.length!==2||!c.canvasOrigin.every(a=>Number.isFinite(a)&&a>=0))||!Array.isArray(c.scroll)||c.scroll.length!==2||!c.scroll.every(Number.isFinite)||!Number.isFinite(c.zoom)||c.zoom<.25||c.zoom>2.5||!Object.values(c.positions).every(a=>Array.isArray(a)&&a.length===2&&a.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:r,...l}=o,u=c=>({...c,hiddenNodes:c.hiddenNodes??(o.scopeOutside==="hide"?c.design.graph.nodes.filter(a=>!a.scope).map(a=>a.id):[])});L=$t({...l,tabs:o.tabs.map(u)},n.recovery,n.document,o.tabs.map(c=>{const{design:a,checks:f,source:d,draft:b,edited:g,handle:h,name:p,...x}=u(c);return x})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(L.sampleLayout={...o.sampleLayout,hiddenNodes:tn(fs).graph.nodes.filter(c=>!c.scope).map(c=>c.id)}),L.tabs.some(c=>c.key===L.active)||(L.active=L.tabs[0]?.key),te()?.selected&&Vn(te().selected),es=L.document?.key,Oe(),ps=!0}).catch(()=>{L=gu,$n=!0,ms()}).finally(()=>{ae=!1,Oe(),et(),Is().then(()=>{L.document?.key===es&&ho()})});
