import{L as _s,D as ca,G as da,W as la,P as ua,l as Dn,X as Ks,C as fa,n as pa,S as Xs,o as Zs,p as Ys,M as Qs,q as er,s as tr,t as To,g as qo,r as po,d as nr,b as ki,u as Wo,U as ir,v as ma,w as or,x as sr,y as mo,z as ha,m as zo,A as ba,B as rr,E as ga,j as ya,F as gs,H as va,T as wa,I as ka,J as Ia,R as Sa,K as xa,N as Aa,O as Ea,Q as Oa,V as Ca,Y as ja,Z as ys,k as Ma,i as La,h as Da,f as Ra,a as Na,_ as Pa,$ as Ta,a0 as ar,a1 as qa,a2 as Wa,e as za}from"./canvas-toolbar-Ch5Zpft_.js";const Ua={subsystems:{full:"サブシステム",icon:ua},business:{full:"業務設計",icon:la},states:{full:"状態遷移",icon:da},concept:{full:"データ構造",icon:ca},tests:{full:"テスト仕様",icon:_s}};function ho(e,t,n){const i=Ua[t],o=document.createElement("span"),s=document.createElement("span"),a=document.createElement("span");o.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Dn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),a.className="view-tab-name",a.textContent=n,o.append(s,a),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function bo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Dn(Ks,{"aria-hidden":"true","stroke-width":1.8})),t}function $a(e){const t=Dn(e?fa:pa,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Fa(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,a=Math.max(0,Math.min(n,s+i*o));a!==s&&(e.scrollLeft=a,t.preventDefault())},{passive:!1})}function Va(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const Ba=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function vs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=Ba,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,s)=>{const a=Dn(o,{"stroke-width":1.8,"aria-hidden":"true"});s&&a.classList.add(s),t.querySelector(i)?.append(a)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Xs),n(".layout-lock",Zs,"lock-closed"),n(".layout-lock",Ys,"lock-open"),n(".zoom-out",Qs),n(".zoom-in",er)}function ws(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Ga({model:e}){const t=Object.fromEntries(e.concepts.map(u=>[u.id,{name:u.name,note:u.description,fields:u.information.map(c=>["",c.name+(c.responsibleSubsystemId&&c.responsibleSubsystemId!==u.subsystemId?"（担当："+e.subsystems.find(r=>r.id===c.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind]),i=e.reviewGroups.map(u=>({id:u.id,name:u.title,purpose:u.description,activities:u.relatedActivityIds,concepts:Object.fromEntries(u.graph.nodes.map(c=>[c.conceptId,{name:c.name,note:c.description,fields:c.fields.map(r=>["",r]),sources:c.sources,sourceActivities:c.sourceActivityIds}])),relations:u.graph.edges.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind])})),o=u=>i.find(c=>c.id===u),s=(u,c)=>{const r=Object.fromEntries(u.nodes.map(b=>[b.id,{...c[b.conceptId],name:b.name,note:b.description,sources:b.sources,conceptId:b.conceptId,subsystemId:b.subsystemId,fields:b.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(b=>u.nodes.some(g=>g.subsystemId===b.id)).map(b=>({id:b.id,name:b.name})),l=u.handoffIds.map(b=>e.handoffs.find(g=>g.id===b)).map(b=>({id:b.id,from:b.fromSubsystemId,to:b.toSubsystemId,label:b.information,returning:b.flowDirection==="return"}));return{ids:u.nodes.map(b=>b.id),tables:r,edges:u.edges.map(b=>[b.fromViewId,b.toViewId,b.fromLabel,b.toLabel,b.kind]),regions:f,handoffs:l}};return{tables:t,edges:n,groups:i,findGroup:o,graph:u=>{const c=o(u);if(!c)throw Error("Unknown review group: "+u);const r=e.reviewGroups.find(b=>b.id===u),f=r.graph.subsystemViews;if(f)return s(f,c.concepts);const l=Object.keys(t).filter(b=>Object.hasOwn(c.concepts,b));return{ids:l,tables:c.concepts,edges:c.relations.filter(([b,g])=>l.includes(b)&&l.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function Qe(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Ha(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",Qe(i,"span",t),i.onclick=n,e.append(i),i}function Ja(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function _a(e,t,n,i=()=>{},o=()=>{},s=[]){const a=n.contentFor(t.id);if(e.replaceChildren(),!a)return;Qe(e,"p",a.description).className="review-description",Qe(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const u of a.relatedActivities){const c=document.createElement("li"),r=s.find(l=>l.id===u.id&&l.name===u.name),f=Ha(c,u.name,()=>{r&&o(r.id)});f.disabled=!r,f.setAttribute("aria-label",u.name+"を業務タブで開く"),d.append(c)}e.append(d),Qe(e,"h3","情報の構造");for(const u of a.structureStatements){const c=document.createElement("section");c.className="review-structure",c.dataset.structure=u.id,Qe(c,"h4",u.title),Qe(c,"p",u.description),e.append(c)}Qe(e,"h3","できること");for(const u of a.capabilities){const c=document.createElement("section");c.className="review-capability",c.dataset.capability=u.id,Qe(c,"h4",u.title),Qe(c,"p",u.description);for(const r of u.samples){const f=i(u.id,r.id),l=document.createElement("button");l.className="review-sample-link",l.type="button",l.dataset.sample=r.id,l.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?l.onclick=f.open:(l.disabled=!0,l.title="対応するテスト仕様へのリンクがありません"),c.append(l)}e.append(c)}Qe(e,"h3","できないこと（業務上のルール）");for(const u of a.limitations){const c=document.createElement("section");c.className="review-limitation",Qe(c,"h4",u.title),Qe(c,"p",u.description),Qe(c,"h5","理由"),Qe(c,"p",u.reason),e.append(c)}}function Zt(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function Ka({model:e,business:t}){const n=a=>a.kind==="group"?e.subsystems.find(d=>d.id===a.id):e.handoffs.find(d=>d.id===a.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(a){const d=n(a);return d?d.activityIds.map(u=>t.activities.find(c=>c.id===u)).filter(Boolean):[]}function s(a,d){if(a.replaceChildren(),d.kind==="group"){const f=e.subsystems.find(b=>b.id===d.id);if(!f)return"";Zt(a,"p",f.purpose),Zt(a,"h3","扱う情報");const l=a.ownerDocument.createElement("ul");for(const b of f.information)Zt(l,"li",b);return a.append(l),Zt(a,"h3","まとまりの理由"),Zt(a,"p",f.reason),f.name}const u=e.handoffs.find(f=>f.id===d.id);if(!u)return"";Zt(a,"p",u.description),Zt(a,"h3","出元と受取先");const c=e.subsystems.find(f=>f.id===u.fromSubsystemId),r=e.subsystems.find(f=>f.id===u.toSubsystemId);return Zt(a,"p",`${c.name} → ${r.name}`),u.information}return{sections:i,activities:o,describe:s}}function ks(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const s=()=>{let d=t.clientWidth||innerWidth;const u=t.querySelector("#design-explorer");return innerWidth>800&&u&&!u.hidden&&(d-=u.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},a=(d,u=!1)=>{if(o=Math.max(280,Math.min(s(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(s())),i.setAttribute("aria-valuenow",String(Math.round(o))),u)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),a(d.key==="Home"?280:d.key==="End"?s():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const u=d.clientX,c=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=r=>a(c+u-r.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),a(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>a(o));d.observe(t);const u=t.querySelector("#design-explorer");u&&d.observe(u)}window.addEventListener("resize",()=>a(o)),a(o)}const Xa=260,Za=68,Ya="http://www.w3.org/2000/svg",Ot=(e,t,n={})=>{const i=e.createElementNS(Ya,t);for(const[o,s]of Object.entries(n))i.setAttribute(o,String(s));return i};function Qa(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Dn(ir,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function ec(e,{model:t,business:n},i,o,s){const a=t.reviewGroups,d=t.subsystems,u=t.presentation.landscapeRelationships.map(k=>{const O=a.find(R=>R.id===k.from),D=a.find(R=>R.id===k.to);if(!O||!D||O.subsystemId!==D.subsystemId||!t.presentation.reviewBoundaries.some(R=>R.from===k.from&&R.to===k.to))throw Error("Unknown overview relationship: "+k.from+" -> "+k.to);return k}),c=t.handoffs.map(k=>{if(!["forward","return"].includes(k.flowDirection))throw Error("Unknown overview handoff direction: "+k.id);return{id:k.id,from:k.fromSubsystemId,to:k.toSubsystemId,label:k.information,returning:k.flowDirection==="return"}});if(new Set(c.map(k=>k.id)).size!==c.length)throw Error("Duplicate overview handoff");for(const k of c)if(!d.some(O=>O.id===k.from)||!d.some(O=>O.id===k.to)||k.from===k.to||!k.label.trim())throw Error("Unknown overview handoff: "+k.id);for(const k of a){if(!d.some(O=>O.id===k.subsystemId))throw Error("Unknown overview subsystem: "+k.id);if(!n.roles?.some(O=>O.id===k.reviewer.roleId))throw Error("Unknown overview reviewer: "+k.id)}const r=d.flatMap(k=>a.filter(O=>O.subsystemId===k.id)),f=new Map;let l=0;for(const[k,O]of d.entries())for(const D of r.filter(R=>R.subsystemId===O.id))f.set(D.id,[80+l*170,100+l*120+k*64]),l++;const b=To(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let p,m;try{const k=JSON.parse(localStorage.getItem(g)||"null"),O=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),D=!k&&O?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,R=k??D;if(R){typeof R.zoom=="number"&&Number.isFinite(R.zoom)&&(b.zoom=Math.max(.25,Math.min(2.5,R.zoom))),Array.isArray(R.scroll)&&R.scroll.length===2&&R.scroll.every(C=>typeof C=="number"&&Number.isFinite(C))&&(b.scroll=R.scroll),typeof R.locked=="boolean"&&(b.locked=R.locked);for(const[C,G]of Object.entries(R.positions??{}))a.some(q=>q.id===C)&&Array.isArray(G)&&G.length===2&&G.every(q=>typeof q=="number"&&Number.isFinite(q))&&b.positions.set(C,[G[0],G[1]])}const x=R?.selection,P=x?.kind==="node"?t.concepts.find(C=>C.id===x.id)?.subsystemId:x?.id,N=x?.kind==="node"?"group":x?.kind;typeof P=="string"&&(N==="model"&&a.some(C=>C.id===P)||N==="group"&&d.some(C=>C.id===P)||N==="connection"&&c.some(C=>C.id===P))&&(m={kind:N,id:P}),m?.kind==="model"&&(b.selected=m.id)}catch{}const I=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:b.zoom,scroll:b.scroll,locked:b.locked,positions:Object.fromEntries(b.positions),selection:m}))}catch{}},j=k=>{if(!k&&!m)return;m=k,b.selected=k?.kind==="model"?k.id:void 0;const O=p?.querySelector(".diagram-world>svg");O&&v(O),I()},v=k=>{const O=ki(u,b.selected),D=ki(c,m?.kind==="group"?m.id:void 0);for(const R of a){const x=k.querySelector(`[data-node="${R.id}"]`);x?.setAttribute("class","node graph-shape state-shape"+O.nodeClasses(R.id)),x?.setAttribute("aria-pressed",String(b.selected===R.id))}for(const R of d){const x=k.querySelector(`[data-subsystem="${R.id}"]`);x?.setAttribute("class","subsystem-overview-group"+D.nodeClasses(R.id)),x?.querySelector("button")?.setAttribute("aria-pressed",String(m?.kind==="group"&&m.id===R.id))}for(const R of u){const x=k.querySelector(`[data-overview-from="${R.from}"][data-overview-to="${R.to}"]`);x?.setAttribute("class","edge"+(O.related(R)?" review-related":"")),x?.setAttribute("marker-end",`url(#overview-${O.related(R)?"related-arrow":"arrow"})`)}for(const R of c){const x=D.related(R)||m?.kind==="connection"&&m.id===R.id,P=k.querySelector(`[data-handoff-id="${R.id}"]`);P?.setAttribute("class","edge"+(R.returning?" exception":"")+(x?" review-related":"")),P?.setAttribute("marker-end",`url(#overview-${x?"related-arrow":"arrow"})`),k.querySelector(`[data-handoff-label="${R.id}"]`)?.classList.toggle("review-related",!!x)}k.querySelectorAll("[data-exception-paint]").forEach(R=>R.remove());for(const R of Array.from(k.querySelectorAll("[data-handoff-id].exception")))Wo(k,R,{path:R.getAttribute("d")},{"data-overview-return-paint":R.getAttribute("data-handoff-id")})};return p=tr(e,k=>{const O=r.map(N=>{const C=k.positions.get(N.id)??f.get(N.id);return{id:N.id,x:C[0],y:C[1],width:Xa,height:Za}}),D=Ot(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});D.append(qo("overview-"));let R=0,x=0;const P=[];for(const N of d){const C=O.filter(he=>a.find(xe=>xe.id===he.id)?.subsystemId===N.id);if(!C.length)continue;const G=Math.min(...C.map(he=>he.x))-30,q=Math.min(...C.map(he=>he.y))-48,re=Math.max(...C.map(he=>he.x+he.width))-G+30,ee=Math.max(...C.map(he=>he.y+he.height))-q+30;P.push({id:N.id,x:G,y:q,width:re,height:ee});const te=Ot(e,"g",{"data-subsystem":N.id,"aria-label":N.name}),de=Ot(e,"rect",{x:G,y:q,width:re,height:ee,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});de.addEventListener("click",()=>j({kind:"group",id:N.id})),te.append(de);const ue=Ot(e,"foreignObject",{class:"subsystem-overview-region-heading",x:G+8,y:q+3,width:re-16,height:36}),Me=e.createElement("button");Me.type="button",Me.className="subsystem-overview-region-title",Me.setAttribute("aria-label",N.name+"を選択"),Me.textContent=N.name,Me.onclick=()=>j({kind:"group",id:N.id}),ue.append(Me),te.append(ue),D.append(te),R=Math.max(R,G+re+40),x=Math.max(x,q+ee+40)}for(const[N,C]of c.entries()){if(!P.some(te=>te.id===C.from)||!P.some(te=>te.id===C.to))throw Error("Missing overview handoff region: "+C.id);const G=Math.max(30,C.label.length*12),q=po({from:C.from,to:C.to,nodes:P,index:N,kind:"input",matrix:{returning:C.returning,captionLane:0},labelWidth:G,labelHeight:18}),re=Ot(e,"path",{d:q.path,class:"edge"+(C.returning?" exception":""),"data-handoff-id":C.id,"data-from-subsystem":C.from,"data-to-subsystem":C.to,"data-flow-direction":C.returning?"return":"forward","marker-end":"url(#overview-arrow)"});D.append(re);const ee=Ot(e,"text",{x:q.label[0]-G/2,y:q.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":C.id});ee.textContent=C.label,ee.addEventListener("pointerdown",te=>te.stopPropagation()),ee.addEventListener("pointerup",te=>te.stopPropagation()),ee.addEventListener("click",()=>j({kind:"connection",id:C.id})),ee.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),j({kind:"connection",id:C.id}))}),D.append(ee),R=Math.max(R,q.bounds.right+40,q.label[0]+G/2+30),x=Math.max(x,q.bounds.bottom+40,q.label[1]+30)}for(const[N,C]of u.entries()){const G=po({from:C.from,to:C.to,nodes:O,index:N,kind:"input",labelWidth:0,labelHeight:0}),q=Ot(e,"path",{d:G.path,class:"edge","data-overview-from":C.from,"data-overview-to":C.to,"marker-end":"url(#overview-arrow)"});D.append(q),R=Math.max(R,G.bounds.right+40),x=Math.max(x,G.bounds.bottom+40)}for(const N of O){const C=a.find(xe=>xe.id===N.id),G=n.roles.find(xe=>xe.id===C.reviewer.roleId),q=Ot(e,"g",{role:"button",tabindex:0,"aria-label":C.title+"を選択","aria-pressed":"false","data-node":N.id,"data-review-group":N.id,"data-subsystem-id":C.subsystemId,class:"node graph-shape state-shape"}),re=nr(e,N);re.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),q.append(re,Ot(e,"rect",{x:N.x,y:N.y,width:N.width,height:N.height,rx:8,class:"state-diagram-node"}));const te=Ot(e,"foreignObject",{x:N.x,y:N.y,width:N.width,height:N.height}),de=e.createElement("div");de.className="subsystem-overview-card";const ue=Qa(e,G.color),Me=e.createElement("span");Me.className="subsystem-overview-labels",Me.title=C.title+" — "+G.name;for(const[xe,L,z]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",C.title],["small","subsystem-overview-role",G.name]]){const F=e.createElement(xe);F.className=L,F.textContent=z,Me.append(F)}const he=e.createElement("button");he.type="button",he.className="subsystem-overview-open",he.setAttribute("aria-label",C.title+"の詳細タブを開く"),he.title="詳細タブを開く",he.textContent="開く",he.onpointerdown=xe=>xe.stopPropagation(),he.onpointerup=xe=>xe.stopPropagation(),he.onclick=xe=>{xe.stopPropagation(),o(C.id)},de.append(ue,Me,he),te.append(de),q.append(te),q.addEventListener("click",()=>j({kind:"model",id:N.id})),q.addEventListener("keydown",xe=>{(xe.key==="Enter"||xe.key===" ")&&(xe.preventDefault(),j({kind:"model",id:N.id}))}),D.append(q)}return D.setAttribute("viewBox",`0 0 ${R} ${x}`),v(D),D},b,I,()=>j(void 0)),p.classList.add("subsystem-overview-canvas"),p.addEventListener("click",I),p.addEventListener("pointerup",()=>queueMicrotask(I)),p.querySelector(".diagram-viewport")?.addEventListener("scroll",I),{root:p,selected:()=>b.selected,selection:()=>m,restore:()=>{const k=()=>{const O=p.querySelector(".diagram-viewport");O.scrollLeft=b.scroll[0],O.scrollTop=b.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(k):k()}}}function tc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const s=i.cells.find(a=>a.columnId===o.id);if(!s)throw Error("Missing sample cell: "+o.id);return s}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function nc({model:e,business:t}){const n=g=>{const p=t.activities.find(m=>m.id===g);if(!p)throw Error("Unknown activity: "+g);return p},i=g=>{const p=t.roles?.find(m=>m.id===g);if(!p)throw Error("Unknown role: "+g);return p.name},o=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:i(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(p=>{const m=n(p);return{id:m.id,name:m.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(p=>({...p,samples:p.samples.map(tc)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>o.find(p=>p.id===g),a=(g,p)=>s(g)?.capabilities.find(m=>m.samples.some(I=>I.id===p)),d=o.flatMap(g=>g.capabilities.flatMap(p=>p.samples.map(m=>({...m,group:g.id})))),u=["yellow","cyan","green","blue","purple","orange"];function c(g,p,m){let I=m.get(p);if(I||(I=u[m.size]??`extra-${m.size}`,m.set(p,I)),g.dataset.sampleKey=p,g.dataset.keyTone=I,g.className="data-example-key",I.startsWith("extra-")){const j=(Number(I.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${j} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${j} 24% 25%)`)}}const r=g=>d.filter(p=>p.group===g),f=(g,p)=>r(g).find(m=>m.id===p);function l(g,p,m){const I=g.ownerDocument.createElement(p);return I.textContent=m,g.append(I),I}function b(g,p,m,I,j){const v=g.ownerDocument,M=f(p.id,m);if(!M)throw Error("Unknown data example: "+m);g.replaceChildren(),g.dataset.dataExample=m;const k=new Map;e.presentation.sampleCaption&&(l(g,"p",e.presentation.sampleCaption).className="data-example-caption");const O=s(p.id)?.capabilities??[],D=j?.capabilityId?O.filter(C=>C.id===j.capabilityId):O;if(j?.capabilityId&&!D.some(C=>C.samples.some(G=>G.id===m)))throw Error("Sample does not belong to capability: "+m);const R=a(p.id,m);g.dataset.capability=R.id;const x=()=>{l(g,"h2",j?.heading?.trim()||R.title),j?.renderSpecification?j.renderSpecification(g):l(g,"p",R.description).className="data-example-capability"};j?.capabilityId&&!j.hideCapability&&x();const P=v.createElement("label");P.className="data-example-picker",l(P,"span","場面");const N=v.createElement("select");N.setAttribute("aria-label","データ例の場面");for(const C of D){let G=N;if(!j?.capabilityId){const q=v.createElement("optgroup");q.label=C.title,N.append(q),G=q}for(const q of C.samples){if(j?.sampleIds&&!j.sampleIds.includes(q.id))continue;const re=v.createElement("option");re.value=q.id,re.textContent=q.name,G.append(re)}}if(N.value=m,N.onchange=()=>I(N.value),P.append(N),(!j?.hideSinglePicker||N.options.length>1)&&g.append(P),!j?.capabilityId&&!j?.hideCapability&&x(),l(g,"h3",M.name).className="data-example-scene",j?.collapseScenario&&M.when){const C=v.createElement("details");C.className="data-example-context",l(C,"summary","場面の背景"),l(C,"p",M.when).className="data-example-when",g.append(C)}else l(g,"p",M.when).className="data-example-when";l(g,"p",M.meaning).className="data-example-meaning";for(const C of M.blocks){const G=v.createElement("section");G.className="data-example-block",G.dataset.exampleCard=C.card,l(G,"h3",p.concepts[C.card].name);const q=v.createElement("div");q.className="data-example-table",q.tabIndex=0,q.setAttribute("role","region"),q.setAttribute("aria-label",p.concepts[C.card].name+"のデータ表");const re=v.createElement("table");re.setAttribute("aria-label",p.concepts[C.card].name+"のデータ例");const ee=v.createElement("caption");ee.textContent=p.concepts[C.card].name+"に入る情報",re.append(ee);const te=v.createElement("thead"),de=v.createElement("tr");for(const Me of C.columns)l(de,"th",Me).setAttribute("scope","col");te.append(de),re.append(te);const ue=v.createElement("tbody");for(const[Me,he]of C.rows.entries()){const xe=v.createElement("tr");for(const[L,z]of he.entries()){const F=l(xe,"td",String(z)),le=C.keyIds[Me][L];le&&(c(F,le,k),F.title=C.columns[L]+"："+z)}ue.append(xe)}re.append(ue),q.append(re),G.append(q),C.rows.length||l(G,"p",C.empty??"データはありません。"),g.append(G)}M.note&&(l(g,"p",M.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:s,capabilityFor:a,examplesFor:r,findDataExample:f,renderDataExample:b}}function Uo(e,t){const n=e.model?.business,i=n?.activities.find(o=>o.id===t);return i?.roleId?n?.roles?.find(o=>o.id===i.roleId):void 0}function ic(e,t,n){return Uo(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function oc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function hn(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,s;const a=(d,u)=>{for(const c of u.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(c.startsWith("**")&&c.endsWith("**")){const r=document.createElement("strong");r.textContent=c.slice(2,-2),d.append(r)}else if(c.startsWith("`")&&c.endsWith("`")){const r=document.createElement("code");r.textContent=c.slice(1,-1),d.append(r)}else d.append(document.createTextNode(c))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const u=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(u&&!i){i=u[1],s=void 0;const l=document.createElement("pre");o=document.createElement("code"),l.append(o),n.append(l);continue}if(u&&u[1][0]===i[0]&&u[1].length>=i.length&&!u[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",s=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){s=void 0;continue}const c=/^(#{1,6}) (.*)$/.exec(d),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(r){s||(s=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(s));const l=document.createElement("li");a(l,r[1]),s.append(l);continue}s=void 0;const f=document.createElement(c?"h"+c[1].length:"p");a(f,c?c[2]:d),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Se={type:"string"},J={type:"string",minLength:1,pattern:"\\S"},V={type:"string",pattern:"^[A-Za-z0-9_-]+$"},on=e=>({anyOf:[e,{type:"null"}]}),_=e=>({type:"array",items:e}),Q=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),sc=e=>({$ref:"#/$defs/"+e}),xn=_({anyOf:[Q({kind:{enum:["text"]},value:Se}),Q({kind:{enum:["reference"]},targetId:V,label:Se}),Q({kind:{enum:["link"]},uri:J,label:Se})]}),Is=Q({id:V,name:J,scope:{type:"boolean"}}).properties,rc=Q({id:V,kind:{enum:["input","output","business-exception","object-exception"]},fromId:V,toId:V,label:J}),ac=Q({id:V,sourceId:V,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:_(V),unresolvedTargets:_(J),summary:J,content:J}),go=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:J,title:J,preface:Se,scope:Se,objects:_(Q({...Is,icon:J,information:_(J)})),activities:_(Q({...Is,why:J,when:J,who:J,where:J,procedure:J,exception:on(J),result:J,problem:on(J),painLevel:on({enum:["Low","Medium","High"]})})),relations:_(rc),findings:_(ac)}),cc=Q({id:V,name:J,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),cr=Q({...go.properties,schemaVersion:{enum:["0.2"]},roles:_(cc),activities:_(Q({...go.properties.activities.items.properties,roleId:on(V)}))}),dc=Q({...cr.properties,schemaVersion:{enum:["0.3"]},exceptions:_(Q({id:V,activityId:V,name:J,description:Se}))}),lc=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,xn])),uc=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:J,title:J,basedOn:Q({documentId:V,revision:J,verification:{enum:["unverified"]}}),intro:xn,index:_(Q({activityId:V,purpose:Se,connections:Se,checkIds:_(V)})),sections:_(Q({id:V,activityId:on(V),title:J,preamble:xn})),guarantees:_(Q({id:V,sectionId:V,title:J,blocks:_({anyOf:[Q({kind:{enum:["prose"]},content:xn}),Q({kind:{enum:["example"]},exampleId:V})]})})),examples:_(Q({id:V,guaranteeId:V,columns:_(J),rows:_(_(xn))})),items:_(Q({id:V,checkId:V,title:J,detailSummary:Se,sectionId:V,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:Q(lc,[])})),notes:_(Q({id:V,title:J,content:xn}))}),$o=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:J,title:J,basedOn:Q({documentId:V,revision:J,verification:{enum:["unverified"]}}),objectId:V,states:_(Q({id:V,name:J})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:J,transitions:_(Q({id:V,sourceId:J,fromId:J,activityId:V,event:on(J),exception:on(J),condition:J,toId:J,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:J,note:J}))}),Ss=Object.fromEntries(Object.entries({...$o.properties.transitions.items.properties,exceptionId:on(V)}).filter(([e])=>e!=="exception")),fc=Q({...$o.properties,schemaVersion:{enum:["0.2"]},transitions:_(Q({...Ss,conditionLabel:J},Object.keys(Ss)))}),Fo=Q({documentId:V,revision:J,targetType:J,targetId:V,section:J}),pc=Q({id:V,name:J,responsibilityStatus:J,responsibleSubsystemId:V},["id","name"]),mc=Q({id:V,name:J,subsystemId:V,information:_(pc),reason:Se,description:Se,businessObjectIds:_(V),activityLinks:_(Q({activityId:V,uses:_(J)})),sourceRefs:_(Fo),reviewState:J}),hc=Q({id:V,fromConceptId:V,toConceptId:V,fromPerTarget:J,toPerSource:J,condition:Se,reviewState:J,sourceRefs:_(Fo),fromLabel:J,toLabel:J,kind:{enum:["down","reference"]}}),bc=Q({id:V,name:J,purpose:Se,information:_(J),reason:Se,activityIds:_(V),reviewState:J}),gc=Q({id:V,fromSubsystemId:V,toSubsystemId:V,information:J,description:Se,activityIds:_(V),flowDirection:{enum:["forward","return"]},reviewState:J}),yc=Q({columnId:V,value:{anyOf:[Se,{type:"number"}]},linkId:J},["columnId","value"]),vc=Q({card:V,columns:_(Q({id:V,name:J,informationId:V})),rows:_(Q({id:V,cells:_(yc)})),empty:Se},["card","columns","rows"]),yo=Q({id:V,name:J,when:Se,meaning:Se,blocks:_(vc),note:Se},["id","name","when","meaning","blocks"]),vo=Q({id:V,title:J,description:Se,meta:{},samples:_(yo)}),wc=Q({...yo.properties,checkIds:{..._(V),minItems:1,uniqueItems:!0}},[...yo.required,"checkIds"]),kc=Q({decisionExampleIds:_(V),decisionCheckIds:_(V),resultCheckIds:_(V),sampleIds:_(V)}),Ic=Q({...vo.properties,samples:_(wc),testSpecification:kc},[...Object.keys(vo.properties)]),Sc=Q({id:V,title:J,description:Se,reason:Se,meta:{}}),xc=Q({conceptId:V,name:J,fields:_(J),description:Se,sources:_(J),sourceActivityIds:_(V)}),Ac=Q({id:V,fromConceptId:V,toConceptId:V,relationIds:_(V),scope:Se,fromLabel:J,toLabel:J,kind:{enum:["down","reference"]}}),Ec=Q({id:V,conceptId:V,subsystemId:V,name:J,description:Se,sources:_(J),fields:_(Q({name:J,informationId:V}))}),Oc=Q({id:V,fromViewId:V,toViewId:V,relationIds:_(V),fromLabel:J,toLabel:J,kind:{enum:["down","reference"]}}),dr=Q({nodes:_(Ec),edges:_(Oc),handoffIds:_(V)}),lr=Q({id:V,subsystemId:V,title:J,description:Se,reviewer:Q({roleId:V}),relatedActivityIds:_(V),graph:Q({conceptIds:_(V),nodes:_(xc),edges:_(Ac),subsystemViews:dr},["conceptIds","nodes","edges"]),structureStatements:_(Q({id:V,title:J,description:Se,sampleIds:_(V),sourceRefs:_(Fo)})),capabilities:_(vo),limitations:_(Sc),meta:Q({questions:_(J),hypotheses:{}},["questions"])}),Cc=Q({...lr.properties,capabilities:_(Ic)}),ur=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:J,basedOn:Q({documentId:V,revision:J,verification:{enum:["unverified"]}}),relatedStates:_(Q({documentId:V,revision:J,verification:{enum:["unverified"]}})),subsystems:_(bc),concepts:_(mc),relations:_(hc),handoffs:_(gc),reviewGroups:_(lr),benefits:_(J),considerations:_(J),reviewPoints:_(J),meta:{},presentation:Q({activityViews:{},creatorActivityIds:{},sampleCaption:Se,subsystemViews:dr,landscapeRelationships:_(Q({from:V,to:V})),reviewBoundaries:_(Q({from:V,to:V,label:Se,promise:Se}))},["landscapeRelationships","reviewBoundaries"])}),jc=Q({...ur.properties,schemaVersion:{enum:["0.2"]},reviewGroups:_(Cc)}),li=(e,t)=>Q({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:J,documents:_({anyOf:t.map(sc)}),sources:_(Q({documentId:V,revision:J,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Se})),externalDocuments:_(Q({id:V,kind:{enum:["businessDesign"]},revision:J,activities:_(Q({id:V,name:J}))})),diagnostics:_(J)}),Ii={anyOf:[li("0.1",["businessDesign","checkItems"]),li("0.2",["businessDesign","checkItems","stateTransition"]),li("0.3",["businessDesignRoles","checkItems","stateTransition"]),li("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:go,businessDesignRoles:cr,businessDesignStructured:dc,checkItems:uc,stateTransition:$o,stateTransitionStructured:fc,conceptModel:ur,checkedConceptModel:jc}},W=(e,t)=>{if(!e)throw Error(t)};function fr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const s=t++;for(;t<e.length;){const a=e[t++];if(a==='"')return JSON.parse(e.slice(s,t));a==="\\"&&t++}throw Error("Unclosed JSON string")},o=(s=0)=>{W(s<=64,"JSON depth limit"),n();const a=e[t];if(a==='"'){i();return}if(a==="{"){t++,n();const u=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),W(e[t]==='"',"JSON object key required");const c=i();W(!u.has(c),"Duplicate JSON key: "+c),u.add(c),n(),W(e[t++]===":","JSON colon required"),o(s+1),n();const r=e[t++];if(r==="}")return;W(r===",","JSON comma required")}throw Error("Truncated object")}if(a==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(s+1),n();const u=e[t++];if(u==="]")return;W(u===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;W(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),W(t===e.length,"Trailing JSON content"),JSON.parse(e)}function fn(e,t=Ii,n="$"){if(t.$ref)return fn(e,Ii.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{fn(e,o,n);return}catch(s){i.push(s.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&W(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;W(i===t.type,"Invalid type at "+n)}if(t.minLength&&W(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&W(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])W(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))W(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),fn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>fn(i,t.items,n+"["+o+"]"))}function Mc(e){const t=new Map,n=new Map,i=new Map,o=(s,a,d)=>{W(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,a.id),i.set(s.id,d)};for(const s of e.documents){o(s,s,"document");for(const[a,d]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[a]??[])o(u,s,d)}for(const s of e.externalDocuments){o(s,s,"document");for(const a of s.activities)o(a,s,"activity")}return{map:t,owner:n,types:i}}function Si(e){return fn(e),pr(e)}function Cn(e,t){const n=new Set(e.items.map(a=>a.id)),i=new Set,o=e.guarantees.find(a=>a.id===t.guaranteeId),s=a=>{if(Array.isArray(a)){for(const d of a)s(d);return}if(a&&typeof a=="object"){a.kind==="reference"&&n.has(a.targetId)&&i.add(a.targetId);for(const d of Object.values(a))d&&typeof d=="object"&&s(d)}};s(t.rows);for(const a of o?.blocks??[])a.kind==="prose"&&s(a.content);for(const a of e.items)(a.fields.guarantee??[]).some(u=>u.kind==="reference"&&(u.targetId===t.id||u.targetId===t.guaranteeId))&&i.add(a.id);return[...i]}function pr(e,{allowUnresolvedFindings:t=!1}={}){W(e.documents.length>0,"Document required");const{map:n,owner:i,types:o}=Mc(e),s=[...e.diagnostics],a=new Set;for(const l of e.sources)if(l.uri){const b=new URL(l.uri);W(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const d=(l,b,g)=>(W(n.has(l),"Dangling reference: "+l),b&&W(o.get(l)===b,"Reference type mismatch: "+l),g&&W(i.get(l)===g,"Cross-document mismatch: "+l),n.get(l)),u=l=>l?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),c=(l,b)=>{for(const g of l)if(g.kind==="reference"&&(d(g.targetId,null,b),W(["document","section","guarantee","example","check","note"].includes(o.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const p=new URL(g.uri);W(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const l of e.documents)if(W(e.formatVersion!=="0.1"||l.kind!=="stateTransition","State documents require formatVersion 0.2"),l.kind==="businessDesign"){W(l.activities.length>0,"Activity required");const b=[...l.objects,...l.activities].map(m=>m.name);W(new Set(b).size===b.length,"Duplicate visible name"),W(b.every(m=>m===m.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(I=>m.includes(I))),"Invalid Graph-visible name");for(const m of l.objects)W(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.icon),"Invalid icon");if(["0.2","0.3"].includes(l.schemaVersion)){W(new Set(l.roles.map(m=>m.name)).size===l.roles.length,"Duplicate Role name"),W(l.roles.every(m=>m.name===m.name.trim()&&!/[\r\n]/.test(m.name)),"Invalid Role name");for(const m of l.activities)m.roleId!==null?d(m.roleId,"role",l.id):a.add("Role未確定: "+m.id+" — "+m.who)}for(const m of l.activities)W(m.problem===null==(m.painLevel===null),"Problem/Pain pair mismatch");for(const m of l.exceptions??[])d(m.activityId,"activity",l.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const m of l.relations){d(m.fromId,g[m.kind][0],l.id),d(m.toId,g[m.kind][1],l.id);const I=JSON.stringify([m.kind,m.fromId,m.toId,m.label]);W(!p.has(I),"Duplicate relation"),p.add(I)}W(new Set(l.findings.map(m=>m.sourceId)).size===l.findings.length,"Duplicate Finding source ID");for(const m of l.findings){W(m.scope==="items"?m.targetIds.length+m.unresolvedTargets.length>0:!m.targetIds.length&&!m.unresolvedTargets.length,"Finding scope mismatch"),W(new Set(m.targetIds).size===m.targetIds.length,"Duplicate Finding target");for(const I of m.targetIds)d(I,null,l.id),W(["object","activity"].includes(o.get(I)),"Invalid Finding target");m.unresolvedTargets.length&&(W(t,"Unresolved Finding target: "+m.sourceId),s.push("Finding参照未決: "+m.sourceId))}}else if(l.kind==="stateTransition"){const b=d(l.basedOn.documentId,"document");W(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),W(b.revision===l.basedOn.revision,"Stale State source revision"),d(l.objectId,"object",b.id),W(!e.documents.some(p=>p!==l&&p.kind==="stateTransition"&&p.objectId===l.objectId),"Duplicate Object state declaration"),W(l.states.length>0&&new Set(l.states.map(p=>p.name)).size===l.states.length,"Duplicate/empty state names"),W(l.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),W(l.transitions.length<=1e3,"State transition row budget"),W(new Set(l.transitions.map(p=>p.sourceId)).size===l.transitions.length,"Duplicate transition source ID");const g=new Map;for(const p of l.transitions){p.fromId!=="@new"&&d(p.fromId,"state",l.id),["@unknown","@none"].includes(p.toId)||d(p.toId,"state",l.id);const m=d(p.activityId,"activity",b.id),I=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(W(!g.has(I),"Duplicate state transition condition: "+g.get(I)+" / "+p.sourceId),g.set(I,p.sourceId),e.formatVersion==="0.4")if(W(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const j=d(p.exceptionId,"exception",b.id);W(j.activityId===m.id,"Exception Activity mismatch")}else p.path==="exception"&&W(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else W(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);W(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),W(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),W(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),W(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+l.id)}else if(l.kind==="conceptModel"){const b=d(l.basedOn.documentId,"document");W(b.kind==="businessDesign"&&b.revision===l.basedOn.revision,"Concept source must be the matching in-package BD revision"),W(!e.documents.some(x=>x!==l&&x.kind==="conceptModel"&&x.basedOn.documentId===b.id),"Duplicate Concept model for Business Design");const g=(x,P)=>{const N=new Map;for(const C of x)W(!N.has(C.id),"Duplicate "+P+" ID: "+C.id),N.set(C.id,C);return N},p=g(l.subsystems,"subsystem"),m=g(l.concepts,"concept"),I=g(l.relations,"concept relation"),j=g(l.reviewGroups,"review group"),v=g(l.handoffs,"handoff"),M=g(l.concepts.flatMap(x=>x.information),"concept information"),k=(x,P,N)=>(W(x.has(P),"Unknown "+N+": "+P),x.get(P)),O=x=>d(x,"activity",b.id),D=x=>{const P=d(x.documentId,"document");W(P.revision===x.revision,"Stale Concept source revision");const N=P.id===b.id,C=P.kind==="stateTransition"&&P.basedOn.documentId===b.id&&l.relatedStates.some(G=>G.documentId===P.id&&G.revision===P.revision);W(N||C,"Concept source must refer to its Business Design or a declared State"),d(x.targetId,x.targetType,P.id)};for(const x of l.relatedStates){const P=d(x.documentId,"document");W(P.kind==="stateTransition"&&P.revision===x.revision&&P.basedOn.documentId===b.id,"Invalid Concept state reference")}for(const x of l.subsystems)for(const P of x.activityIds)O(P);for(const x of l.concepts){k(p,x.subsystemId,"subsystem");for(const P of x.information)P.responsibleSubsystemId&&k(p,P.responsibleSubsystemId,"responsible subsystem");for(const P of x.businessObjectIds)d(P,"object",b.id);for(const P of x.activityLinks)O(P.activityId);for(const P of x.sourceRefs)D(P)}for(const x of l.relations){k(m,x.fromConceptId,"concept"),k(m,x.toConceptId,"concept");for(const P of x.sourceRefs)D(P)}for(const x of l.handoffs){k(p,x.fromSubsystemId,"subsystem"),k(p,x.toSubsystemId,"subsystem"),W(x.fromSubsystemId!==x.toSubsystemId,"Handoff must cross subsystem boundary");for(const P of x.activityIds)O(P)}const R=(x,P)=>{const N=g(x.nodes,"subsystem view"),C=g(x.edges,"subsystem view edge");for(const q of N.values()){k(P,q.conceptId,"view concept"),k(p,q.subsystemId,"subsystem");const re=k(m,q.conceptId,"concept");for(const ee of q.fields)W(re.information.some(te=>te.id===ee.informationId),"Unknown information for subsystem view: "+ee.informationId)}for(const q of C.values()){const re=k(N,q.fromViewId,"subsystem view"),ee=k(N,q.toViewId,"subsystem view");W(re.subsystemId===ee.subsystemId,"View relationship crosses subsystem boundary"),W(q.relationIds.length>0,"Subsystem view relationship needs a concept relation");let te=re.conceptId;for(const de of q.relationIds){const ue=k(I,de,"concept relation");W(ue.fromConceptId===te,"Subsystem view relation path is disconnected: "+de),te=ue.toConceptId}W(te===ee.conceptId,"Subsystem view relation target differs")}W(new Set(x.handoffIds).size===x.handoffIds.length,"Duplicate subsystem view handoff");const G=new Set([...N.values()].map(q=>q.subsystemId));for(const q of x.handoffIds){const re=k(v,q,"handoff");W(G.has(re.fromSubsystemId)&&G.has(re.toSubsystemId),"Missing subsystem view handoff region: "+q)}};l.presentation.subsystemViews&&R(l.presentation.subsystemViews,m);for(const x of l.reviewGroups){k(p,x.subsystemId,"subsystem"),d(x.reviewer.roleId,"role",b.id);for(const G of x.relatedActivityIds)O(G);const P=g(x.graph.nodes.map(G=>({...G,id:G.conceptId})),"view concept");W(new Set(x.graph.conceptIds).size===x.graph.conceptIds.length&&x.graph.conceptIds.length===P.size&&x.graph.conceptIds.every(G=>P.has(G)),"View concepts and nodes differ");for(const G of x.graph.nodes){k(m,G.conceptId,"concept");for(const q of G.sourceActivityIds)O(q)}g(x.graph.edges,"view edge");for(const G of x.graph.edges){k(P,G.fromConceptId,"view concept"),k(P,G.toConceptId,"view concept");for(const q of G.relationIds)k(I,q,"concept relation")}x.graph.subsystemViews&&R(x.graph.subsystemViews,P);const N=g(x.capabilities,"capability"),C=g(x.capabilities.flatMap(G=>G.samples),"sample");g(x.limitations,"limitation"),g(x.structureStatements,"structure statement");for(const G of x.structureStatements){for(const q of G.sampleIds)k(C,q,"sample");for(const q of G.sourceRefs)D(q)}for(const G of N.values())if(G.testSpecification){const q=G.testSpecification;for(const[ee,te]of Object.entries(q))W(new Set(te).size===te.length,"Duplicate function specification reference: "+ee);const re=(ee,te)=>{const de=d(ee,te),ue=d(i.get(ee),"document");return W(ue.kind==="checkItems"&&ue.basedOn.documentId===b.id&&ue.basedOn.revision===b.revision,"Function Check source mismatch: "+ee),{value:de,doc:ue}};for(const ee of[...q.decisionCheckIds,...q.resultCheckIds])re(ee,"check");for(const ee of q.decisionExampleIds){const{value:te,doc:de}=re(ee,"example"),ue=Cn(de,te);W(ue.length>0,"Function decision table needs a Check: "+ee),W(ue.every(Me=>q.decisionCheckIds.includes(Me)),"Function decision table Check is not assigned: "+ee)}for(const ee of q.sampleIds){const te=G.samples.find(de=>de.id===ee);W(te,"Function result sample belongs to another capability: "+ee),W(te.checkIds.some(de=>q.resultCheckIds.includes(de)),"Function result sample needs a result Check: "+ee),W(te.checkIds.every(de=>q.resultCheckIds.includes(de)||q.decisionCheckIds.includes(de)),"Function result sample Check is not assigned: "+ee)}}for(const G of N.values())for(const q of G.samples){if(l.schemaVersion==="0.2"){W(q.checkIds.length>0,"Sample needs a Check: "+q.id),W(new Set(q.checkIds).size===q.checkIds.length,"Duplicate sample Check: "+q.id);for(const re of q.checkIds){d(re,"check");const ee=d(i.get(re),"document");W(ee.kind==="checkItems"&&ee.basedOn.documentId===b.id&&ee.basedOn.revision===b.revision,"Sample Check source mismatch: "+re)}}for(const re of q.blocks){k(P,re.card,"view concept");const ee=g(re.columns,"sample column");for(const te of re.columns)k(M,te.informationId,"concept information");g(re.rows,"sample row");for(const te of re.rows){const de=new Set;for(const ue of te.cells)k(ee,ue.columnId,"sample column"),W(!de.has(ue.columnId),"Duplicate sample cell: "+ue.columnId),de.add(ue.columnId);W(de.size===ee.size,"Sample row does not match columns")}}}}for(const x of l.presentation.landscapeRelationships){const P=k(j,x.from,"review group"),N=k(j,x.to,"review group");W(P.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const x of l.presentation.reviewBoundaries)k(j,x.from,"review group"),k(j,x.to,"review group");s.push("概念モデルの業務意味は未確認: "+l.id)}else{const b=d(l.basedOn.documentId,"document");W(b.kind==="businessDesign","Check source is not BD"),W(b.revision===l.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+l.id),W(new Set(l.items.map(m=>m.checkId)).size===l.items.length,"Duplicate Check ID");const g=new Set;for(const m of l.index){d(m.activityId,"activity",b.id),W(!g.has(m.activityId),"Duplicate Activity index"),g.add(m.activityId),W(new Set(m.checkIds).size===m.checkIds.length,"Duplicate Check binding");for(const I of m.checkIds)d(I,"check",l.id)}W(new Set(l.sections.map(m=>m.activityId??m.title)).size===l.sections.length,"Duplicate Activity section");for(const m of l.sections)m.activityId!==null&&(d(m.activityId,"activity",b.id),W(g.has(m.activityId),"Section missing from index")),c(m.preamble,l.id);const p=new Set(e.documents.filter(m=>m.kind==="conceptModel"&&m.basedOn.documentId===b.id&&m.basedOn.revision===b.revision).flatMap(m=>m.reviewGroups.flatMap(I=>I.capabilities.flatMap(j=>j.testSpecification?.decisionExampleIds??[]))));for(const m of l.guarantees){const I=m.blocks.length>0&&m.blocks.every(j=>j.kind==="example"&&p.has(j.exampleId)&&l.examples.some(v=>v.id===j.exampleId&&v.guaranteeId===m.id&&Cn(l,v).length>0));W(m.blocks.some(j=>j.kind==="prose"&&u(j.content))||I,"General guarantee prose required"),d(m.sectionId,"section",l.id);for(const j of m.blocks)if(j.kind==="prose")c(j.content,l.id);else{const v=d(j.exampleId,"example",l.id);W(v.guaranteeId===m.id,"Example owner mismatch")}}for(const m of l.examples){d(m.guaranteeId,"guarantee",l.id),W(m.columns.length>0,"Example columns required");for(const I of m.rows){W(I.length===m.columns.length,"Example column mismatch");for(const j of I)c(j,l.id)}}for(const m of l.items){const I=d(m.sectionId,"section",l.id);W(I.activityId===null?!l.index.some(j=>j.checkIds.includes(m.id)):l.index.some(j=>j.activityId===I.activityId&&j.checkIds.includes(m.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),W(u(m.fields.guarantee)||u(m.fields.condition)&&u(m.fields.expectedResult),"Check guarantee required");for(const j of Object.values(m.fields))c(j,l.id);W(I.activityId===null||l.index.some(j=>j.checkIds.includes(m.id)),"Unbound Check")}for(const m of l.notes)c(m.content,l.id);c(l.intro,l.id)}const r=e.diagnostics.filter(l=>l.startsWith("Role未確定:"));W(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const l of r)W(a.delete(l),"Unresolved Who requires a diagnostic matching a current unresolved Activity");W(a.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const l of e.sources){d(l.documentId,"document");const b=l.documentId+"@"+l.revision;W(!f.has(b),"Duplicate source descriptor"),f.add(b)}for(const l of e.externalDocuments)W(e.sources.some(b=>b.documentId===l.id&&b.revision===l.revision),"External source revision missing"),W(l.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+l.id);return{diagnostics:s,entities:n.size}}const Y=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function xs(e,t,n){if(n==null)return;const i=hn(n);return e.append(Y("h3",t),i),i}function Lc(e,t){if(e===null)return;const n=hn(e),i=s=>String(s??"").replace(/\s+/g,""),o=new Set(t.map(s=>i(hn(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))o.has(i(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const Dc={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Rc(e,t,n){const i=new Map,o=new Set,s=new Set(n.map(d=>d.id)),a=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==a.id||d.basedOn.revision!==a.revision)continue;const u=d.presentation.activityViews;if(Array.isArray(u)){for(const c of u)if(!(!c||typeof c!="object"||Array.isArray(c)||c.activityId!==t||!Array.isArray(c.businessVariations)))for(const r of c.businessVariations){if(!r||typeof r!="object"||Array.isArray(r)||typeof r.exceptionId!="string"||!s.has(r.exceptionId)||r.kind!=="alternative"&&r.kind!=="exception"||o.has(r.exceptionId))continue;const f=i.get(r.exceptionId);f&&f!==r.kind?(i.delete(r.exceptionId),o.add(r.exceptionId)):i.set(r.exceptionId,r.kind)}}}return i}function Nc(e,t){const n=Y("article");n.className="markdown json-detail";const i=e.model,o=i.business,s=o.objects.find(d=>d.id===t),a=o.activities.find(d=>d.id===t);if(s){xs(n,"Scope",String(s.scope)),n.append(Y("h3","Information"));const d=Y("ul");for(const u of s.information)d.append(Y("li",u));n.append(d)}else if(a){const d=o.exceptions?.filter(l=>l.activityId===a.id)??[];for(const[l,b]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=xs(n,l,b==="who"?Uo(e,a.id)?.name??a.who:a[b]===null?null:String(a[b]));b==="result"&&g&&(g.dataset.businessResult="")}const u=Lc(a.exception,d),c=Rc(e,a.id,d),r=(l,b,g)=>{if(!b.length&&!g)return;const p=Y("section");p.dataset.businessVariations="",p.append(Y("h3",l)),g&&p.append(g);for(const m of b){const I=hn(m.description);I.dataset.businessException=m.id,p.append(Y("h4",m.name),I)}n.append(p)};c.size?(r("例外",d.filter(l=>c.get(l.id)==="exception")),r("別ルート",d.filter(l=>c.get(l.id)==="alternative")),r("通常以外の扱い",d.filter(l=>!c.has(l.id)),u)):r("通常以外の扱い",d,u);const f=new Map([...o.objects,...o.activities].map(l=>[l.id,l.name]));for(const[l,b]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=o.relations.filter(m=>m.kind===l&&(m.fromId===t||m.toId===t));if(!g.length)continue;n.append(Y("h3",b));const p=g.map(m=>`${f.get(m.fromId)} → ${f.get(m.toId)} — ${m.label}`);if(l==="business-exception")for(const m of p)n.append(Y("p",m));else{const m=Y("ul");for(const I of p)m.append(Y("li",I));n.append(m)}}}else n.append(Y("p","項目を選択すると業務内容を表示します。"));return n}class Yn{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Y("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(hn(o.value));continue}if(o.kind==="text"){const u=Y("span",o.value);u.style.whiteSpace="pre-wrap",t.append(u);continue}if(o.kind==="link"){t.append(Y("span",`${o.label} (${o.uri})`));continue}const s=Y("details"),a=Y("summary",o.label||o.targetId);s.append(a),t.append(s);let d=!1;s.addEventListener("toggle",()=>{if(!s.open||d)return;if(d=!0,i.has(o.targetId)){s.append(Y("p","循環参照："+o.targetId));return}if(i.size>=16){s.append(Y("p","参照の深さの上限です。続きは原文で確認してください。"));return}const u=new Set(i).add(o.targetId),c=this.doc,r=c.guarantees.find(p=>p.id===o.targetId),f=c.examples.find(p=>p.id===o.targetId),l=c.items.find(p=>p.id===o.targetId),b=c.sections.find(p=>p.id===o.targetId),g=c.notes.find(p=>p.id===o.targetId);if(r){s.append(Y("h4",r.title));for(const p of r.blocks){if(!this.take(s))break;p.kind==="prose"?this.runs(s,p.content,u):this.example(s,p.exampleId,u)}}else if(f)this.example(s,f.id,u);else if(l){s.append(Y("p",`${l.checkId} · ${l.title}`+(this.requester?"":` · ${l.reviewState}`))),this.requester&&(l.reviewState==="要確認"||l.reviewState==="要修正")&&s.append(Y("p","確認が必要です。"));const p=this.requester?Object.fromEntries(Object.entries(l.fields).filter(([m])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(m))):l.fields;this.fields(s,p,u)}else b?(s.append(Y("h4",b.title)),this.runs(s,b.preamble,u)):g?(s.append(Y("h4",g.title)),this.runs(s,g.content,u)):o.targetId===c.id&&(s.append(Y("h4",c.title)),this.runs(s,c.intro,u))})}}fields(t,n,i,o=!1){for(const[s,a]of Object.entries(n)){if(!this.take(t))break;if(t.append(Y("h4",Dc[s]??s)),s==="guarantee"&&o){const d=new Set;for(const u of a){const c=u.kind==="reference"?this.doc.guarantees.find(f=>f.id===u.targetId):void 0;if(!c){this.runs(t,[u],i);continue}if(d.has(c.id))continue;d.add(c.id);const r=new Set(i).add(c.id);for(const f of c.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,a,i)}}example(t,n,i,o=!1){const s=this.doc.examples.find(f=>f.id===n);if(!Cn(this.doc,s).length)return;const a=Y("table"),d=o?s.columns.indexOf("結果"):-1,u=d>0&&s.columns.at(-1)==="Check ID";if(u){const f=Y("colgroup");f.span=d,a.append(f);for(let m=d;m<s.columns.length;m++)a.append(Y("colgroup"));const l=Y("thead"),b=Y("tr"),g=Y("th","条件");g.colSpan=d,g.scope="colgroup",b.append(g);for(let m=d;m<s.columns.length;m++){const I=Y("th",s.columns[m]);I.rowSpan=2,I.scope="col",m===d?I.className="decision-result":s.columns[m]==="備考"&&(I.className="decision-notes"),b.append(I)}const p=Y("tr");for(const m of s.columns.slice(0,d)){const I=Y("th",m);I.scope="col",p.append(I)}l.append(b,p),a.append(l)}else{const f=Y("tr");for(const l of s.columns){if(!this.take(t))break;f.append(Y("th",l))}a.append(f)}const c=u?Y("tbody"):a;for(const f of s.rows){if(!this.take(t))break;const l=Y("tr");for(const[b,g]of f.entries()){if(!this.take(t))break;const p=Y("td");if(u&&b===d?p.className="decision-result":u&&s.columns[b]==="備考"&&(p.className="decision-notes"),o)for(const m of g){const I=m.kind==="reference"?this.doc.items.find(j=>j.id===m.targetId):void 0;I?p.append(Y("span",I.checkId)):this.runs(p,[m],i)}else this.runs(p,g,i);l.append(p)}c.append(l)}u&&a.append(c);const r=Y("div");r.className="json-example",r.append(a),t.append(r)}}function As(e,t,n=e.model.checks,i=new Set,o=new Set){const s=Y("section");s.className="check-content json-checks";const a=e.model.business,d=n.filter(c=>c.basedOn.documentId===a.id);let u=!1;for(const c of d){const r=new Yn(c),f=c.index.filter(p=>p.activityId===t),l=new Set(c.index.flatMap(p=>p.checkIds)),b=(t?[...new Set(f.flatMap(p=>p.checkIds))]:c.items.filter(p=>!l.has(p.id)).map(p=>p.id)).filter(p=>!i.has(p)),g=c.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of g){(p.preamble.length||c.guarantees.some(m=>m.sectionId===p.id&&!o.has(m.id)))&&(u=!0),r.runs(s,p.preamble);for(const m of c.guarantees.filter(I=>I.sectionId===p.id&&!o.has(I.id)))r.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}for(const p of b){const m=c.items.find(v=>v.id===p);if(!m)continue;u=!0;const I=Y("section");I.className="check-item",I.dataset.checkId=m.checkId,I.dataset.elementId=m.id,I.append(Y("h3",m.checkId+" · "+m.title)),(m.reviewState==="要確認"||m.reviewState==="要修正")&&I.append(Y("p","確認が必要です。"));const j=Object.fromEntries(Object.entries(m.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));r.fields(I,j,new Set([m.id])),s.append(I)}if(!t)for(const p of c.notes)u=!0,r.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}return u||s.append(Y("p","この業務のテスト仕様はありません。")),s}function Pc(e,t,n=e.model.checks){const i=Y("section");i.className="check-content json-checks sample-checks";const o=e.model.business,s=new Set(t);for(const a of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new Yn(a);for(const u of a.items.filter(c=>s.has(c.id))){const c=Y("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(Y("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(Y("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));d.fields(c,r,new Set([u.id]),!0),i.append(c)}}return i}const Tc=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function qc(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(Tc,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function Wc(e,t,n=e.model.checks){const i=Y("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const s of t)for(const a of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=a.examples.find(g=>g.id===s);if(!d||!Cn(a,d).length)continue;const u=new Yn(a,!0),c=a.guarantees.find(g=>g.id===d.guaranteeId),r=Y("section");r.dataset.decisionExample=s;for(const g of c?.blocks??[])g.kind==="prose"&&u.runs(r,qc(g.content),new Set([c.id]));d.rows.length>1&&r.append(Y("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=d.columns.indexOf("結果"),l=f>0?f:d.columns.length;d.rows.some(g=>g.slice(0,l).some(p=>p.some(m=>m.kind==="text"&&/^\s*[-‐]\s*$/.test(m.value))))&&r.append(Y("p","‐＝値不問。")),u.example(r,s,new Set([s]),!0),i.append(r)}return i}function zc(e,t,n=e.model.checks){const i=Y("section");i.className="check-content json-checks decision-checks";const o=e.model.business,s=new Set(t);for(const a of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new Yn(a,!0);for(const u of a.items.filter(c=>s.has(c.id))){const c=Y("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(Y("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(Y("p","確認が必要です。")),u.fields.condition?.length&&(c.append(Y("h4","条件")),d.runs(c,u.fields.condition,new Set([u.id])));const r=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=Y("details");f.append(Y("summary","期待結果")),d.fields(f,r,new Set([u.id]),!0),c.append(f)}i.append(c)}}return i}function Uc(e,t,n=e.model.checks,i=new Set){const o=Y("section");o.className="check-content json-checks result-checks";const s=e.model.business,a=new Set(t);for(const d of n.filter(u=>u.basedOn.documentId===s.id&&u.basedOn.revision===s.revision)){const u=new Yn(d,!0),c=d.items.filter(r=>a.has(r.id)&&i.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);c.length&&o.append(Y("p",c.map(r=>r.checkId).join("、")));for(const r of d.items.filter(f=>a.has(f.id))){if(c.includes(r))continue;const f=Y("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(Y("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(Y("p","確認が必要です。"));const l=Object.fromEntries(Object.entries(r.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));u.fields(f,l,new Set([r.id]),!0);const b=Y("details"),g=Y("summary","Check の詳細");b.append(g,Y("p",r.title)),r.fields.condition?.length&&u.runs(b,r.fields.condition,new Set([r.id])),f.append(b),o.append(f)}}return o}const so=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function $c(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),i=[],o=new Set,s=new Set,a=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),d=(r,f)=>a.some(l=>l.items.some(b=>b.id===r)&&(!f||l.index.some(b=>b.activityId===f&&b.checkIds.includes(r)))),u=(r,f,l,b,g=[])=>{const p=f.testSpecification,m=(p?.decisionCheckIds??[]).filter(D=>d(D,l)),I=(p?.resultCheckIds??[]).filter(D=>d(D,l)),j=(p?.decisionExampleIds??[]).filter(D=>a.some(R=>{const x=R.examples.find(N=>N.id===D),P=x?Cn(R,x):[];return P.length>0&&P.every(N=>d(N,l))})),v=f.samples.filter(D=>(!p||p.sampleIds.includes(D.id))&&D.checkIds?.length&&(p?D.checkIds.every(R=>d(R,l)):D.checkIds.some(R=>d(R,l)))),M=j.flatMap(D=>a.flatMap(R=>{const x=R.examples.find(P=>P.id===D);return x?Cn(R,x).filter(P=>d(P,l)):[]})),k=[...new Set([...m,...I,...M,...v.flatMap(D=>(D.checkIds??[]).filter(R=>d(R,l)))])];if(!k.length)return;const O=`fn:${l??"_"}:${r}:${f.id}`;s.has(O)||(s.add(O),i.push({key:O,activityId:l,groupId:r,capability:f,name:b,samples:v,checkIds:k,decisionCheckIds:m,resultCheckIds:I,decisionExampleIds:j,decisionTableCheckIds:[...new Set(M)],businessSections:g}))},c=e.model.presentation.activityViews;if(Array.isArray(c)){for(const r of c)if(!(!so(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!so(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const l=e.model.reviewGroups.find(p=>p.id===f.groupId),b=l?.capabilities.find(p=>p.id===f.capabilityId);if(!l||!b)continue;o.add(JSON.stringify([l.id,b.id]));const g=[];if(Array.isArray(f.businessSections))for(const p of f.businessSections){if(!so(p)||!Array.isArray(p.pages)||p.kind!=="result"&&p.kind!=="exception"||p.kind==="exception"&&(typeof p.exceptionId!="string"||!e.business.exceptions?.some(I=>I.id===p.exceptionId&&I.activityId===r.activityId)))continue;const m=[...new Set(p.pages.filter(I=>I==="decision"||I==="result"))];m.length&&g.push({kind:p.kind,exceptionId:p.kind==="exception"?p.exceptionId:void 0,pages:m})}u(l.id,b,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():b.title,g)}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)o.has(JSON.stringify([r.id,f.id]))||u(r.id,f,void 0,f.title);return i}function Es(e,t,n,i){const o=e.filter(a=>a.groupId===t&&a.capability.id===n),s=o.find(a=>a.samples.some(d=>d.id===i));if(s)return{kind:"sample",key:s.key,sampleId:i};for(const a of o){if(!a.capability.testSpecification)continue;const d=a.capability.samples.find(c=>c.id===i),u=a.decisionExampleIds.length?a.decisionTableCheckIds:a.decisionCheckIds;if(d?.checkIds?.some(c=>u.includes(c)))return{kind:"decision",key:"decision:"+a.key}}}const In=["landscape","overview"];function Fc(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const a=document.createElement("aside");a.id="design-explorer",a.setAttribute("aria-label","設計ナビゲーション"),a.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",s.append(a,d),d.append(i,n);const u=document.createElement("div");u.className="shell-open-tabs",o.before(u),u.append(o),Fa(u);const c=document.createElement("nav");c.className="concept-tabs",c.setAttribute("aria-label","開いているサブシステムとデータ構造"),u.append(c);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),u.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),u.append(f);const l=document.createElement("section");l.id="concept-workspace",l.hidden=!0,l.setAttribute("aria-label","データ構造"),l.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(l);const b=document.createElement("section");b.id="states-workspace",b.hidden=!0,b.setAttribute("aria-label","状態遷移"),b.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(b);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',d.append(g);const p=document.createElement("aside");p.id="test-related-panel",p.className="spec-related",p.setAttribute("aria-label","関連資料"),p.hidden=!0,p.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const m=document.createElement("section");m.id="empty-workspace",m.hidden=!0,m.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(m);const I=n.querySelector("#node-list-drawer");a.append(I);const j=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),M=a.querySelector("input"),k=a.querySelector("nav"),O=l.querySelector("iframe"),D=l.querySelector(".concept-related"),R=b.querySelector("article"),x="alder-explorer-v1:"+location.pathname,P=location.protocol==="file:"||location.origin==="null"?"*":location.origin,N=window.__alderConceptHtml;let C,G,q,re,ee={},te=[],de=[...In],ue=new Map,Me=new Map,he=new Map,xe=new Map;const L=h=>he.get(h)??h,z=h=>xe.get(h)??h,F=h=>G?.findGroup(ue.get(h??"")),le=h=>q?.contentFor(ue.get(h)??""),Z=(h,y)=>q?.findDataExample(ue.get(h)??"",y),we=h=>q?.examplesFor(ue.get(h)??"")??[],Ce=h=>In.includes(h)?"全体図":le(h)?.title??F(h)?.name??ee[Me.get(h)??""]?.name,me=()=>{const h=t.business(),y=h.design?.model;return y?[...y.checks,...h.relatedChecks??[]].filter(E=>E.basedOn.documentId===y.business.id):[]},se=()=>$c(C,me()),ge=h=>se().find(y=>y.key===(h.startsWith("decision:")?h.slice(9):h)),Te=h=>se().filter(y=>y.name===h.name).length>1?h.name+"（"+(t.business().activities.find(y=>y.id===h.activityId)?.name??"その他")+"）":h.name,We=h=>me().some(y=>y.index.some(E=>E.activityId===h)||y.sections.some(E=>E.activityId===h)),Nt=h=>new Set(se().filter(y=>y.activityId===h).flatMap(y=>y.checkIds)),an=h=>{const y=new Set(se().filter(E=>E.activityId===h).flatMap(E=>E.decisionExampleIds));return new Set(me().flatMap(E=>E.examples.filter(S=>y.has(S.id)).map(S=>S.guaranteeId)))},Jt=h=>{const y=Nt(h),E=an(h);return me().some(S=>S.index.some(T=>T.activityId===h&&T.checkIds.some(H=>!y.has(H)))||S.sections.some(T=>T.activityId===h&&(T.preamble.length>0||S.guarantees.some(H=>H.sectionId===T.id&&!E.has(H.id)))))},_r=()=>me().some(h=>h.items.some(y=>!h.index.some(E=>E.checkIds.includes(y.id)))||h.sections.some(y=>y.activityId===null)||h.notes.length>0),Kr=h=>{const y=ge(h);return y?y.capability.testSpecification?Te(y)+"・"+(h.startsWith("decision:")?"可否":"結果"):y.name:(h==="@unassigned"?"未割当":h.startsWith("remaining:")?t.business().activities.find(E=>E.id===h.slice(10))?.name:h.startsWith("checks:")?t.business().activities.find(E=>E.id===h.slice(7))?.name:h==="@overview"?"テスト仕様":void 0)??h},oi=n.querySelector("#formattedMarkdownDrawer");oi&&s.append(oi),s.append(D,p),ks(D,s,x+":drawer-width"),ks(p,s,x+":test-drawer-width");let si=!1;const rt=t.rightDrawer??{isOpen:()=>si,setOpen:h=>{si=h}};let ne="business",Re=!1,Ke=[],B="overview",Xe=[],at="",ct=[],je="@overview",vn,Pt=innerWidth>800,ri=!1,ai=!0,dt=!1,Tn;const lt=new Map,ht=new Map([["overview",O]]),it=new Map,cn=new Map,dn=new Map,Ne=new Map,_t=new Map,bt=new Set,Ve=new Set,ln=new Set,Be=new Map;let ye;try{if(ye=JSON.parse(sessionStorage.getItem(x)||"null"),ye){if(dt=ye.overviewClosed===!0,Tn=typeof ye.documentKey=="string"?ye.documentKey:void 0,Pt=typeof ye.left=="boolean"?ye.left:Pt,Array.isArray(ye.expanded)){Ve.clear();for(const h of ye.expanded)typeof h=="string"&&Ve.add(h)}Xe=Array.isArray(ye.states)?ye.states.filter(h=>typeof h=="string"):[],t.rightDrawer||(typeof ye.rightOpen=="boolean"?si=ye.rightOpen:typeof ye.right?.["concept:"+ye.active]=="boolean"&&(si=ye.right["concept:"+ye.active]))}}catch{}function Xr(){if(!(!ye||Tn!==t.business().key||!Re)){for(const h of Array.isArray(ye.overviewModes)?ye.overviewModes:[])F(h)&&bt.add(h);for(const[h,y]of Object.entries(ye.lastExamples??ye.examples??{}))typeof y=="string"&&Z(h,y)&&_t.set(h,y);for(const[h,y]of Object.entries(ye.examples??{}))typeof y=="string"&&Z(h,y)&&Ne.set(h,y);for(const[h,y]of Object.entries(ye.selected??{}))typeof y=="string"&&te.includes(y)&&it.set(h,y);Ke=[...new Set((Array.isArray(ye.concepts)?ye.concepts:[]).filter(h=>typeof h=="string"&&de.includes(h)))],B=Ke.includes(ye.active)?ye.active:"landscape"}}let un;const ze=()=>{try{sessionStorage.setItem(x,JSON.stringify({documentKey:vn,overviewClosed:dt,selected:Object.fromEntries(it),examples:Object.fromEntries(Ne),lastExamples:Object.fromEntries(_t),overviewModes:[...bt],left:Pt,expandedVersion:4,expanded:[...Ve],concepts:Ke,active:B,states:Xe,specs:ct,activeSpec:je,specExamples:Object.fromEntries(lt),...t.rightDrawer?{}:{rightOpen:rt.isOpen()}}))}catch{}},Kt=()=>{ne==="concept"&&Be.set("drawer:"+B,D.querySelector(".concept-drawer-body").scrollTop),ne==="concept"&&rt.isOpen()&&bt.has(B)&&Be.set("review-overview:"+B,D.querySelector(".data-review-overview").scrollTop),ne==="concept"&&Ne.has(B)&&Be.set("example:"+B+":"+Ne.get(B),D.querySelector(".data-examples-panel").scrollTop),ne==="states"&&at&&Be.set("state:"+at,R.scrollTop),ne==="tests"&&Be.set("tests:"+je,g.querySelector(".test-spec-page").scrollTop),ne==="concept"&&B==="landscape"&&Be.set("concept:landscape",l.querySelector(".concept-review-landscape").scrollTop)};function Ge(h=!0){if(ri)return;const y=new URL(location.href);if(y.searchParams.set("view",ne),y.searchParams.delete("concept"),y.searchParams.delete("dataExample"),y.searchParams.delete("dataView"),ne==="concept"&&rt.isOpen()&&bt.has(B)?y.searchParams.set("dataView","overview"):ne==="concept"&&F(B)&&!Ne.has(B)&&y.searchParams.set("dataView","structure"),ne==="concept"&&rt.isOpen()&&Ne.has(B)&&y.searchParams.set("dataExample",Ne.get(B)),ne==="tests"&&lt.has(je)&&y.searchParams.set("dataExample",lt.get(je)),y.searchParams.delete("state"),y.searchParams.delete("activity"),y.searchParams.delete("object"),y.searchParams.delete("spec"),ne==="concept"&&y.searchParams.set("concept",B),ne==="states"&&at&&y.searchParams.set("state",at),ne==="tests"&&y.searchParams.set("spec",je),ne==="business"){const E=t.business(),S=E.views?.find(T=>T.key===E.viewKey);S?.activity?y.searchParams.set("activity",S.activity):S?.object&&y.searchParams.set("object",S.object)}y.href!==location.href&&history[h?"pushState":"replaceState"]({alderShell:!0},"",y)}function Ae(h,y,E){const S=document.createElement(y);return S.textContent=E,h.append(S),S}function ut(h){h!==ne&&(ne==="business"?t.capture():Kt(),ne=h),n.hidden=ne!=="business",l.hidden=ne!=="concept",b.hidden=ne!=="states",g.hidden=ne!=="tests",m.hidden=ne!=="empty",e.dataset.workspaceArea=ne,ne==="business"&&t.refresh(),yt(),ft()}function It(h,y=!0){Re&&(h==="subsystems"&&(h="landscape"),de.includes(h)&&(Kt(),Ke.includes(h)||Ke.push(h),B=h,ut("concept"),to(),gt(),ze(),y&&Ge()))}function Zr(){Kt(),Ne.delete(B),bt.add(B),to(),D.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer-overview:"+B)??0,ze(),Ge()}function Yr(h,y=!0){if(h&&!Z(B,h))return;const E=!Ne.has(B),S=D.querySelector(".concept-drawer-body");E&&Be.set("drawer-overview:"+B,S.scrollTop),Kt(),bt.delete(B),h?(Ne.set(B,h),_t.set(B,h)):Ne.delete(B),rt.setOpen(!0),to(),E&&(S.scrollTop=0),ze(),Ge(),y&&D.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}D.querySelector(".concept-example-back").onclick=()=>{Zr(),D.querySelector(".data-review-overview").focus({preventScroll:!0})};function wn(h,y=!0){t.business().states?.some(E=>E.id===h)&&(Kt(),Xe.includes(h)||Xe.push(h),at=h,ut("states"),ra(),gt(),ze(),y&&Ge())}function Ki(h){return h.startsWith("decision:")&&ge(h)&&!ge(h)?.capability.testSpecification?ge(h).key:ge(h)||h==="@overview"||h==="@unassigned"||h.startsWith("checks:")&&We(h.slice(7))||h.startsWith("remaining:")&&Jt(h.slice(10))?h:t.business().activities.some(y=>y.id===h)?se().find(y=>y.activityId===h)?.key??(We(h)?"checks:"+h:"@overview"):"@overview"}function St(h,y=!0){const E=t.business();if(!E.design?.model||!E.key)return;h=Ki(h),ne==="tests"&&h!==je&&Kt(),ct.includes(h)||ct.push(h),je=h;const S=ge(h);ri||(S?.capability.testSpecification?Ve.add("tests-function-"+S.key):S?.activityId?Ve.add("tests-activity-"+S.activityId):h.startsWith("checks:")?Ve.add("tests-activity-"+h.slice(7)):h.startsWith("remaining:")?Ve.add("tests-activity-"+h.slice(10)):S&&Ve.add("tests-other")),ut("tests"),Xi(),gt(),ft(),ze(),y&&Ge()}function Xi(){const h=t.business().design;if(!h?.model)return;const y=g.querySelector(".test-spec-page"),E=ge(je);if(E){const S=document.createElement("section");S.className="test-spec-sample";const T=G?.findGroup(E.groupId),H=E.samples.find(ae=>ae.id===lt.get(je))??E.samples[0],U=!!E.capability.testSpecification,K=je.startsWith("decision:");if(U)if(Ae(S,"h2",E.name),Ae(S,"h3",K?"可否判定":"処理結果"),K)E.decisionExampleIds.length?S.append(Wc(h,E.decisionExampleIds,me())):E.decisionCheckIds.length?S.append(zc(h,E.decisionCheckIds,me())):Ae(S,"p","可否条件の記載はありません。");else{const ae=T&&H&&q?new Set(E.samples.flatMap(Ee=>Ee.checkIds??[])):new Set;if(S.append(Uc(h,E.resultCheckIds,me(),ae)),T&&H&&q){Ae(S,"h3","データ例");const Ee=document.createElement("div");Ee.className="data-examples-panel test-spec-examples",S.append(Ee),q.renderDataExample(Ee,T,H.id,qe=>{Be.set("tests:"+je,y.scrollTop),lt.set(je,qe),Xi(),ze(),Ge(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:E.capability.id,sampleIds:E.samples.map(qe=>qe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(T&&H&&q){const ae=document.createElement("div");ae.className="data-examples-panel test-spec-examples",S.append(ae),q.renderDataExample(ae,T,H.id,Ee=>{Be.set("tests:"+je,y.scrollTop),lt.set(je,Ee),Xi(),ze(),Ge(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:E.capability.id,heading:E.name,sampleIds:E.samples.map(Ee=>Ee.id),renderSpecification:Ee=>Ee.append(Pc(h,H.checkIds??[],me()))})}y.replaceChildren(S)}else if(je==="@overview")y.replaceChildren(),Ae(y,"p","左のメニューからテスト仕様を選択してください。");else if(je.startsWith("remaining:")){const S=je.slice(10);y.replaceChildren(As(h,S,me(),Nt(S),an(S)))}else y.replaceChildren(As(h,je.startsWith("checks:")?je.slice(7):void 0,me()));ta(E),y.scrollTop=Be.get("tests:"+je)??0}function qn(h){h||(dt=!1),ut("business"),h?t.openActivity(h):(dt=!1,t.openOverview()),ft(),gt(),Ge()}function Qr(h){ut("business"),t.openObject(h),ft(),gt(),Ge()}function cs(h){const y=t.business(),E=y.design?.model;return E?[...new Set(E.states.filter(S=>S.objectId===h&&S.basedOn.documentId===E.business.id&&S.basedOn.revision===E.business.revision).flatMap(S=>S.transitions.map(T=>T.activityId)))]:[...new Set((y.design?.objectStateTransitions?.[h]?.model?.transitions??[]).flatMap(S=>S.activityId?[S.activityId]:[]))]}function ds(h){return(t.business().states??[]).filter(y=>cs(y.id).includes(h))}function ls(h){const y=t.business(),E=y.design?.model,S=C?.model.concepts.find(T=>T.id===h);return!E||!C||!S?[]:(y.states??[]).filter(T=>S.businessObjectIds.includes(T.id)&&E.states.some(H=>H.objectId===T.id&&H.basedOn.documentId===E.business.id&&H.basedOn.revision===E.business.revision&&C.model.relatedStates.some(U=>U.documentId===H.id&&U.revision===H.revision)))}function Zi(h,y,E="状態遷移"){if(!y.length)return;const S=document.createElement("section");S.className="shell-related-links",Ae(S,"h3",E);for(const T of y){const H=Tt(S,T.name,()=>wn(T.id));H.dataset.relatedState=T.id}h.append(S)}function us(h){const y=C?.model.reviewGroups.find(S=>S.id===h.groupId);if(!y)return[];const E=new Set(y.graph.nodes.map(S=>S.conceptId));return[...new Set(h.samples.flatMap(S=>S.blocks.map(T=>T.card)))].filter(S=>E.has(S)&&C?.model.concepts.some(T=>T.id===S))}function Tt(h,y,E){const S=document.createElement("button");return S.type="button",S.className="shell-evidence",Ae(S,"span",y),S.onclick=E,h.append(S),S}function Yi(h,y){const E=y.filter(T=>T.capability.testSpecification);if(!E.length)return;const S=document.createElement("section");S.className="shell-test-links",Ae(S,"h3","テスト仕様書");for(const T of E)for(const[H,U]of[["decision:","可否判定"],["","処理結果"]]){const K=H+T.key,ae=Tt(S,Te(T)+"・"+U,()=>St(K));ae.dataset.relatedSpec=K}h.append(S)}function ea(h,y){const E=se().filter(K=>K.activityId===y&&K.capability.testSpecification),S=C?.model.presentation.activityViews,T=Array.isArray(S)?S.find(K=>K&&typeof K=="object"&&K.activityId===y):void 0,H=Array.isArray(T?.uncreatedTestSections)?T.uncreatedTestSections:[],U=h.querySelectorAll("[data-business-result],[data-business-exception]");for(const K of Array.from(U)){const ae=K.dataset.businessException,Ee=ae?"exception":"result",qe=ae??"result",Ue=E.flatMap(Ze=>Ze.businessSections.filter(At=>At.kind===Ee&&(Ee==="result"||At.exceptionId===ae)).flatMap(At=>At.pages.filter($=>$==="decision"?Ze.decisionCheckIds.length||Ze.decisionExampleIds.length:Ze.resultCheckIds.length||Ze.samples.length).map($=>({target:Ze,page:$})))),xt=document.createElement("section");xt.className="shell-section-links",xt.setAttribute("aria-label","テスト仕様書");const ot=new Set;for(const{target:Ze,page:At}of Ue){const $=(At==="decision"?"decision:":"")+Ze.key;if(ot.has($))continue;ot.add($);const ke=Tt(xt,Te(Ze)+"・"+(At==="decision"?"可否判定":"処理結果"),()=>St($));ke.dataset.relatedSpec=$}if(!ot.size){const Ze=Ae(xt,"p",H.includes(qe)?"テスト仕様書未作成":"テスト仕様書との対応未確認");Ze.className="shell-spec-warning"}K.after(xt)}Yi(h,E.filter(K=>!K.businessSections.length))}function ta(h){const y=p.querySelector(".spec-related-content");if(y.replaceChildren(),!h?.capability.testSpecification)return;const E=t.business().activities.find(H=>H.id===h.activityId),S=G?.findGroup(h.groupId);if(E){Ae(y,"h3","Activity");const H=Tt(y,E.name,()=>qn(E.id));H.dataset.relatedActivity=E.id}if(S){Ae(y,"h3","概念モデル");const H=Tt(y,S.name,()=>It(L(S.id)));H.dataset.relatedGroup=S.id}const T=us(h);if(T.length){Ae(y,"h3","概念");for(const H of T){const U=C.model.concepts.find(ae=>ae.id===H),K=Tt(y,U.name,()=>It(z(H)));K.dataset.relatedConcept=H}}h.activityId&&Zi(y,ds(h.activityId),"状態遷移（同じ Activity）")}function na(h,y){Ae(h,"h3","Activity");const E=t.business(),S=F(B),T=C?.model.concepts.find(U=>U.id===y),H=S?.concepts[y]?.sourceActivities??S?.activities??T?.activityLinks.filter(U=>U.uses.includes("生成")).map(U=>U.activityId)??[];for(const U of H){const K=E.activities.find(Ee=>Ee.id===U);if(!K)continue;const ae=document.createElement("button");ae.className="shell-evidence",Ae(ae,"span",K.name),ae.title=K.name+"を業務タブで開く",ae.setAttribute("aria-label",ae.title),ae.onclick=()=>qn(K.id),h.append(ae)}}function Qi(h){const y=F(h);return y?G?.graph(y.id):h==="overview"?G?.overviewGraph():void 0}function fs(h){const y=cn.get(B),E=y?Qi(B)?.tables[y]:void 0;return E?.conceptId===h?E:void 0}function ia(h,y){const E=fs(y)??F(B)?.concepts[y]??{...ee[y],sources:void 0};h.replaceChildren(),Ae(h,"p",E.note),Ae(h,"h3","持つ情報");const S=document.createElement("ul");for(const[,T]of E.fields)Ae(S,"li",T);if(h.append(S),E.sources?.length){Ae(h,"h3","情報の出所・対象時点");const T=document.createElement("ul");for(const H of E.sources)Ae(T,"li",H);h.append(T)}na(h,y),Yi(h,se().filter(T=>us(T).includes(y))),Zi(h,ls(y))}function eo(h){const y=D.querySelector(".shell-heading strong");y.textContent=h,D.setAttribute("aria-label",h)}function ps(h=!1){F(B)&&(it.delete(B),cn.delete(B),dn.delete(B),h||ht.get(B)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},P),ci(),yt(),D.querySelector(".concept-drawer-body").scrollTop=0,ze())}D.querySelector(".concept-selection-clear").onclick=()=>{ps(),Ne.has(B)?D.querySelector(".concept-example-back").focus({preventScroll:!0}):D.querySelector(".data-review-overview").focus({preventScroll:!0})};function ci(){const h=D.querySelector(".concept-related-content");D.querySelector(".concept-selection").hidden=!!F(B)&&!it.has(B)&&!dn.has(B),D.querySelector(".concept-selection>h2").hidden=!F(B),D.querySelector(".concept-selection-clear").hidden=!F(B);const y=dn.get(B);if(y&&re){const H=re.describe(h,{kind:"group",id:y});eo(H);return}if(B==="landscape"&&un){h.replaceChildren();for(const[H,U]of re.sections){Ae(h,"h3",H);const K=document.createElement("ul");for(const ae of U)Ae(K,"li",ae);h.append(K)}eo("サブシステムの情報");return}const E=it.get(B),S=F(B),T=Re&&E?fs(E)?.name??S?.concepts[E]?.name??ee[E].name:S?.name??"データ構造の情報";eo(T),Re&&E?ia(h,E):(h.replaceChildren(),S||Ae(h,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function ms(h){h.onload=()=>{hs(),h.contentDocument&&(vs(h.contentDocument),ws(h.contentDocument));const y=h.dataset.conceptView??"overview";if(!G||!C)return;const E=F(y),S=E?G.graph(E.id):y==="overview"?G.overviewGraph():{ids:te,edges:G.edges,tables:ee};h.contentWindow?.postMessage({type:"alder-concept-data",graph:S,focus:Me.get(y),viewKey:y,documentKey:vn??C.model.id,clearSelectionOnBackground:!!E},P);const T=it.get(y);T&&h.contentWindow?.postMessage({type:"alder-concept-highlight",id:T},P)}}ms(O),O.dataset.conceptView="overview";function oa(){D.querySelector(".concept-page-details").hidden=!0,D.querySelector(".concept-example-back").hidden=!0;const h=D.querySelector(".data-review-overview");h.hidden=!0,h.replaceChildren();const y=D.querySelector(".data-examples-panel");y.hidden=!0,y.replaceChildren(),delete y.dataset.dataExample,un?.root.remove(),un=void 0;for(const[E,S]of ht)E!=="overview"&&(S.remove(),ht.delete(E));O.removeAttribute("src"),O.removeAttribute("srcdoc"),it.clear(),cn.clear(),dn.clear()}function to(){l.setAttribute("aria-label",B==="landscape"||F(B)?"サブシステム":"データ構造"),l.querySelector(".concept-empty").hidden=Re;const h=l.querySelector(".concept-review-landscape"),y=F(B),E=D.querySelector(".concept-page-details"),S=D.querySelector(".data-review-overview"),T=D.querySelector(".data-examples-panel");if(E.hidden=!Re||!y,S.hidden=!Re||!y||Ne.has(B),T.hidden=!Re||!y||!Ne.has(B),D.querySelector(".concept-example-back").hidden=T.hidden,Re&&y){const U=se();_a(S,y,q,(ae,Ee)=>{const qe=Es(U,y.id,ae,Ee);if(qe)return{kind:qe.kind,open:()=>{const Ue=Es(se(),y.id,ae,Ee);Ue&&(Ue.sampleId?lt.set(Ue.key,Ue.sampleId):lt.delete(Ue.key),St(Ue.key))}}},ae=>qn(ae),t.business().activities),Yi(S,U.filter(ae=>ae.groupId===y.id));const K=Ne.get(B)??_t.get(B)??we(B)[0]?.id;K&&q.renderDataExample(T,y,K,ae=>Yr(ae)),S.scrollTop=Be.get("review-overview:"+B)??0,T.scrollTop=Be.get("example:"+B+":"+K)??0}if(h.hidden=!Re||!In.includes(B),Re&&In.includes(B)&&(B==="landscape"&&!un&&(un=ec(document,C,vn??C.model.id,U=>It(L(U)))),Ja(h,un?.root,B==="overview"?"graph":"overview"),B==="landscape"&&un?.restore()),Re&&B!=="landscape"&&!ht.has(B)){const U=document.createElement("iframe");U.className="concept-frame",U.dataset.conceptView=B,U.title=y?y.name+"のデータ構造":ee[Me.get(B)].name+"と隣接する概念",U.hidden=!0,ht.set(B,U);const K=Me.get(B);K&&it.set(B,it.get(B)??K),ms(U),l.querySelector(".concept-main").append(U)}for(const[U,K]of ht)K.hidden=!Re||U!==B,Re&&U===B&&!K.hasAttribute("src")&&!K.hasAttribute("srcdoc")&&(N?K.srcdoc=N:K.src=new URL("concept.html?view=overview"+(F(U)?"&group="+encodeURIComponent(F(U).id):U==="overview"?"":"&focus="+encodeURIComponent(Me.get(U))),document.baseURI).href);const H=it.get(B);H&&ht.get(B)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:H},P),ci(),yt(),D.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer:"+B)??0}function kn(){const h=t.business(),y=h.views?.find(E=>E.activity!==void 0||E.object!==void 0||!dt);y?(ut("business"),t.activateView(y.key)):Ke.length?It(Ke.at(-1),!1):Xe.length?wn(Xe.at(-1),!1):ct.length?St(ct.at(-1),!1):ut("empty")}function sa(){if(dt=!0,ne==="business"){const h=t.business().views?.find(y=>y.key===t.business().viewKey);!h?.activity&&!h?.object&&kn()}gt(),ft(),ze(),Ge(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function ra(){R.replaceChildren();const h=t.business().states?.find(K=>K.id===at);if(!h)return;const y=t.statePanel(h.id);y?R.append(y):Ae(R,"p","この対象の状態遷移は未定義です。");const E=p.querySelector(".spec-related-content");E.replaceChildren();const S=cs(h.id),T=t.business().activities.filter(K=>S.includes(K.id));if(T.length){Ae(E,"h3","Activity");for(const K of T){const ae=Tt(E,K.name,()=>qn(K.id));ae.dataset.relatedActivity=K.id}}const H=C?.model.concepts.filter(K=>ls(K.id).some(ae=>ae.id===h.id))??[];if(H.length){Ae(E,"h3","概念");for(const K of H){const ae=Tt(E,K.name,()=>It(z(K.id)));ae.dataset.relatedConcept=K.id}}const U=se().filter(K=>K.activityId&&S.includes(K.activityId)&&K.capability.testSpecification);if(U.length){Ae(E,"h3","Activity に関連するテスト仕様書");for(const K of U)for(const[ae,Ee]of[["decision:","可否判定"],["","処理結果"]]){const qe=ae+K.key,Ue=Tt(E,Te(K)+"・"+Ee,()=>St(qe));Ue.dataset.relatedSpec=qe}}R.scrollTop=Be.get("state:"+at)??0}let no="";function gt(){for(const S of Array.from(o.querySelectorAll(".tab"))){const T=t.business().views?.find(U=>U.key===S.dataset.key);S.hidden=dt&&T?.activity===void 0&&T?.object===void 0;const H=!S.hidden&&ne==="business"&&S.dataset.key===t.business().viewKey;S.classList.toggle("active",H),S.querySelector("button")?.setAttribute("aria-current",String(H))}const h=(S,T,H)=>{S.replaceChildren();for(const U of T){const K=H==="concept"?Ce(U):t.business().states?.find(ot=>ot.id===U)?.name??U,ae=ne===H&&U===(H==="concept"?B:at),Ee=document.createElement("div");Ee.className="tab"+(ae?" active":"");const qe=H==="concept"&&(U==="landscape"||F(U))?"subsystems":H;Ee.dataset.viewKind=qe;const Ue=document.createElement("button");Ue.id=(H==="concept"?"concept-tab-":"state-tab-")+U,ho(Ue,qe,K),Ue.setAttribute("aria-current",String(ae)),Ue.onclick=()=>H==="concept"?It(U):wn(U),Ee.append(Ue);const xt=bo((qe==="subsystems"?"サブシステム：":H==="concept"?"データ構造：":"状態遷移：")+K+"のタブを閉じる");xt.onclick=()=>{Kt(),H==="concept"?(Ke=Ke.filter(ot=>ot!==U),U!=="overview"&&(ht.get(U)?.remove(),ht.delete(U)),it.delete(U),cn.delete(U),dn.delete(U),Ne.delete(U),_t.delete(U),bt.delete(U),ne===H&&B===U&&(Ke.length?It(Ke.at(-1),!1):kn())):(Xe=Xe.filter(ot=>ot!==U),ne===H&&at===U&&(Xe.length?wn(Xe.at(-1),!1):kn())),gt(),ft(),ze(),Ge(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Ee.append(xt),S.append(Ee)}};h(c,Ke,"concept"),h(r,Xe,"states"),f.replaceChildren();for(const S of ct){const T=Kr(S),H=document.createElement("div");H.className="tab"+(ne==="tests"&&S===je?" active":""),H.dataset.viewKind="tests";const U=document.createElement("button");U.id="spec-tab-"+S,ho(U,"tests",T),U.setAttribute("aria-current",String(ne==="tests"&&S===je)),U.onclick=()=>St(S);const K=bo("テスト仕様："+T+"のタブを閉じる");K.onclick=()=>{ct=ct.filter(ae=>ae!==S),ne==="tests"&&je===S&&(ct.length?St(ct.at(-1),!1):kn()),gt(),ft(),ze(),Ge()},H.append(U,K),f.append(H)}const y=u.querySelector(".tab.active:not([hidden])"),E=ne==="business"?"business:"+t.business().viewKey:ne==="concept"?"concept:"+B:ne==="states"?"states:"+at:ne==="tests"?"tests:"+je:"";y?(E!==no&&Va(u,y),no=E):no=""}function aa(){innerWidth<=800&&di(!1)}function ft(){const h=k.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,y=k.scrollTop,E=t.business(),S=M.value.trim().toLocaleLowerCase();k.replaceChildren();const T=($,ke,Ye)=>({kind:"item",id:$,name:ke,key:Ye}),H=($,ke,Ye)=>({kind:"group",id:$,name:ke,children:Ye}),U=se(),K=$=>T($.key,$.name,"tests:"+$.key),ae=U.filter($=>$.capability.testSpecification),Ee=U.filter($=>!$.capability.testSpecification),qe=ae.map($=>H("tests-function-"+$.key,Te($),[T("decision:"+$.key,"可否判定","tests:decision:"+$.key),T($.key,"処理結果","tests:"+$.key)]));for(const $ of E.activities){const ke=Ee.filter(_e=>_e.activityId===$.id).map(K),Ye=(Nt($.id).size?"remaining:":"checks:")+$.id;Jt($.id)&&ke.push(T(Ye,"その他","tests:"+Ye)),ke.length&&qe.push(H("tests-activity-"+$.id,$.name,ke))}const Ue=Ee.filter($=>!$.activityId);Ue.length&&qe.push(H("tests-other","その他",Ue.map(K))),_r()&&qe.push(T("@unassigned","未割当","tests:@unassigned"));const xt=[{id:"business",label:"業務設計",items:[T("overview","全体図","business:overview"),H("business-activity","Activity",E.activities.map($=>T($.id,$.name,"business:"+$.id))),H("business-object","Object",(E.objects??[]).map($=>T($.id,$.name,"object:"+$.id)))]},{id:"states",label:"状態遷移",items:(E.states??[]).map($=>T($.id,$.name,"states:"+$.id))},{id:"subsystems",label:"サブシステム",items:C?.model.subsystems.length?[T("landscape","全体図","concept:landscape"),...C.model.subsystems.map($=>H("subsystem-"+$.id,$.name.replace(/サブシステム$/,""),C.model.reviewGroups.filter(ke=>ke.subsystemId===$.id).map(ke=>T(L(ke.id),ke.title,"concept:"+L(ke.id)))))]:[]},{id:"concept",label:"データ構造",items:Re&&te.length?[T("overview","全体図","concept:overview"),H("concept-relations","概念",te.map($=>T(z($),ee[$].name,"concept:"+z($))))]:[]},{id:"tests",label:"テスト仕様",items:E.design?.model&&(U.length||me().length)?qe:[]}];let ot=0;const Ze=($,ke,Ye)=>{const _e=document.createElement("button");_e.className="explorer-item"+(Ye?" explorer-item-nested":""),_e.dataset.explorerKey=$.key,_e.textContent=$.name;const He=E.views?.find($e=>$e.key===E.viewKey);return ne===(ke.id==="subsystems"?"concept":ke.id)&&(["concept","subsystems"].includes(ke.id)?$.id===B:ke.id==="states"?$.id===at:ke.id==="tests"?$.id===je:$.key.startsWith("object:")?He?.object===$.id:$.id==="overview"?!dt&&He?.activity===void 0&&He?.object===void 0:He?.activity===$.id)&&_e.setAttribute("aria-current","page"),_e.disabled=ke.id==="business"&&!E.key,_e.onclick=()=>{I.hidden||t.closeLegacyList(),ke.id==="business"?$.key.startsWith("object:")?Qr($.id):qn($.id==="overview"?void 0:$.id):ke.id==="concept"||ke.id==="subsystems"?It($.id):ke.id==="tests"?St($.id):wn($.id),aa()},_e},At=($,ke,Ye,_e=!1)=>{const He=document.createElement("button"),Et=S?!ln.has($):Ve.has($);return He.className=(Ye?"explorer-subparent":"explorer-parent")+(_e?" explorer-pending":""),He.dataset.explorerKey="group:"+$,Ae(He,"span",ke).className="explorer-parent-label",_e?(He.disabled=!0,He):(He.setAttribute("aria-expanded",String(Et)),He.setAttribute("aria-controls","explorer-"+$),He.append($a(Et)),He.onclick=()=>{S?ln.has($)?ln.delete($):ln.add($):(Ve.has($)?Ve.delete($):Ve.add($),ze()),ft()},He)};for(const $ of xt){const ke=$.items.flatMap($e=>{if($e.kind==="item")return!S||($.label+" "+$e.name).toLocaleLowerCase().includes(S)?[$e]:[];const Xt=S?$e.children.filter(oo=>($.label+" "+$e.name+" "+oo.name).toLocaleLowerCase().includes(S)):$e.children;return!S||Xt.length?[{...$e,children:Xt}]:[]});if(S&&!ke.length)continue;const Ye=$.id!=="business"&&!$.items.length,_e=document.createElement("section"),He=At($.id,$.label,!1,Ye),Et=document.createElement("div");Et.id="explorer-"+$.id,Et.hidden=Ye||(S?ln.has($.id):!Ve.has($.id));for(const $e of ke){if($e.kind==="item"){Et.append(Ze($e,$,0)),ot++;continue}const Xt=document.createElement("div");Xt.id="explorer-"+$e.id,Xt.hidden=S?ln.has($e.id):!Ve.has($e.id),Et.append(At($e.id,$e.name,!0),Xt);for(const oo of $e.children)Xt.append(Ze(oo,$,1)),ot++;!$e.children.length&&!S&&(Ae(Xt,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!ke.length&&!Ye&&(Ae(Et,"p","項目がありません。").className="explorer-empty"),_e.append(He,Et),k.append(_e)}S&&!ot&&(Ae(k,"p","該当する項目はありません。").className="explorer-empty"),k.scrollTop=y,h&&Array.from(k.querySelectorAll("[data-explorer-key]")).find($=>$.dataset.explorerKey===h)?.focus({preventScroll:!0})}function di(h){Pt=h,yt(),ze(),(h?a.querySelector(".shell-heading button"):j).focus({preventScroll:!0})}j.addEventListener("click",h=>{h.preventDefault(),h.stopImmediatePropagation(),di(!Pt)},!0),a.querySelector(".shell-heading button").onclick=()=>di(!1),M.oninput=()=>{ln.clear(),ft()},a.addEventListener("keydown",h=>{if(h.key==="Escape"&&!h.defaultPrevented&&I.hidden&&(h.preventDefault(),h.stopPropagation(),di(!1)),(h.key==="ArrowDown"||h.key==="ArrowUp")&&k.contains(document.activeElement)){const y=Array.from(k.querySelectorAll("button")).filter(T=>!T.disabled&&!T.closest("[hidden]")),E=y.indexOf(document.activeElement),S=y[E+(h.key==="ArrowDown"?1:-1)];S&&(h.preventDefault(),S.focus())}}),v.addEventListener("click",h=>{ne!=="business"&&(h.preventDefault(),h.stopImmediatePropagation(),(ne==="concept"||ne==="states"||ne==="tests"&&ge(je)?.capability.testSpecification)&&(rt.setOpen(!rt.isOpen()),yt(),ze(),Ge(!1)))},!0),D.querySelector(".shell-heading button").onclick=()=>{rt.setOpen(!1),yt(),ze(),Ge(!1),v.focus({preventScroll:!0})},p.querySelector(".shell-heading button").onclick=()=>{rt.setOpen(!1),yt(),ze(),Ge(!1),v.focus({preventScroll:!0})},window.addEventListener("message",h=>{if(h.origin!==location.origin&&!(location.protocol==="file:"&&h.origin==="null"))return;const y=Array.from(ht).find(([,S])=>h.source===S.contentWindow);if(!y)return;if(h.data?.type==="alder-concept-rendered"){y[1].contentDocument&&(vs(y[1].contentDocument),ws(y[1].contentDocument));return}if(ne!=="concept"||y[0]!==B)return;const E=F(B);if(h.data?.type==="alder-concept-clear-selection"){E&&ps(!0);return}if(h.data?.type==="alder-concept-subsystem"){if(!Qi(B)?.regions.some(S=>S.id===h.data.id))return;it.delete(B),cn.delete(B),dn.set(B,h.data.id),ci(),yt(),ze();return}if(!(!te.includes(h.data?.id)||E&&!E.concepts[h.data?.id])){if(h.data.type==="alder-concept-open"){It(z(h.data.id));return}h.data.type==="alder-concept-select"&&(dn.delete(B),it.set(B,h.data.id),(typeof h.data.viewId=="string"?Qi(B)?.tables[h.data.viewId]:void 0)?.conceptId===h.data.id?cn.set(B,h.data.viewId):cn.delete(B),innerWidth<=800&&(Pt=!1),ci(),yt(),ze())}});function hs(){const h=getComputedStyle(document.documentElement);for(const y of ht.values()){const E=y.contentDocument?.documentElement;if(E){E.dataset.theme=document.documentElement.dataset.theme??"light";for(const S of["--bg","--panel","--fg","--line","--subtle","--select"])E.style.setProperty(S,h.getPropertyValue(S))}}}function yt(){!I.hidden&&ne==="business"&&(Pt=!0),a.hidden=!Pt,j.disabled=!1,j.setAttribute("aria-controls","design-explorer"),j.setAttribute("aria-label","ナビゲーションを開閉"),j.setAttribute("aria-expanded",String(Pt));const h=rt.isReady?.()??!0;D.hidden=ne!=="concept"||!Re||!h||!rt.isOpen();const y=!!ge(je)?.capability.testSpecification;p.hidden=!(ne==="states"||ne==="tests"&&y)||!h||!rt.isOpen(),oi&&ne!=="business"&&(oi.hidden=!0),ne==="concept"?(v.disabled=!Re||!h,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!D.hidden))):ne==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):ne==="states"||ne==="tests"&&y?(v.disabled=!h,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!p.hidden))):(ne==="tests"||ne==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const E=i.querySelector("#document-actions");E&&(E.hidden=ne!=="business");const S=i.querySelector("#document-actions-toggle");S&&ne!=="business"&&(S.hidden=!0),hs(),io()}function io(){const h=i.getBoundingClientRect().bottom;h>0&&e.style.setProperty("--shell-content-top",h+"px")}if(typeof ResizeObserver<"u"){const h=new ResizeObserver(io);h.observe(i),h.observe(e.querySelector("header"))}window.addEventListener("resize",io);function bs(){Kt(),ri=!0;try{const h=new URL(location.href).searchParams;if(ne==="concept"&&h.get("view")==="concept"&&h.get("concept")===B&&!Ne.has(B)&&Z(B,h.get("dataExample"))&&Be.set("drawer-overview:"+B,D.querySelector(".concept-drawer-body").scrollTop),Re||(bt.clear(),Ne.clear(),_t.clear(),Ke=[],B="overview",O.removeAttribute("src"),O.removeAttribute("srcdoc")),h.get("view")==="concept"){const y=Re&&de.includes(h.get("concept")??"")?h.get("concept"):"landscape",E=h.get("dataExample");Re&&F(y)&&h.get("dataView")==="overview"&&!Z(y,E)?(bt.add(y),Ne.delete(y)):(bt.delete(y),Re&&Z(y,E)?(Ne.set(y,E),_t.set(y,E)):Ne.delete(y)),It(y,!1)}else if(h.get("view")==="states")t.business().states?.some(y=>y.id===h.get("state"))?wn(h.get("state"),!1):kn();else if(h.get("view")==="tests"){const y=Ki(h.get("spec")??"@overview"),E=h.get("dataExample"),S=ge(y);S&&E&&S.samples.some(T=>T.id===E)?lt.set(y,E):S&&lt.delete(y),St(y,!1)}else if(h.get("view")==="empty")ut("empty");else if(ut("business"),t.business().key){const y=h.get("activity"),E=h.get("object"),S=t.business(),T=S.views?.find(H=>H.key===S.viewKey);y&&S.activities.some(H=>H.id===y)?T?.activity!==y&&t.openActivity(y):E&&S.objects?.some(H=>H.id===E)?T?.object!==E&&t.openObject(E):(dt=!1,(!T||T.activity!==void 0||T.object!==void 0)&&t.openOverview())}gt(),ft()}finally{ri=!1}}return window.addEventListener("popstate",bs),{closeBusinessOverview:sa,reopenBusinessOverview(){dt=!1},activateBusiness(){ut("business")},businessActivated(){ut("business"),gt(),ft(),Ge()},syncChrome:yt,appendActivityTestLinks(h,y){ea(h,y),Zi(h,ds(y))},openRelatedChecks(h){Ve.add("tests"),St(h&&We(h)?"checks:"+h:"@overview")},syncDocument(){const h=t.business(),y=h.concept,E=!!(vn&&h.key!==vn||ai&&Tn&&h.key&&h.key!==Tn),S=C?.model!==y?.model||C?.business!==y?.business;if((E||S&&C)&&(g.querySelector(".test-spec-page").replaceChildren(),p.querySelector(".spec-related-content").replaceChildren(),D.querySelector(".concept-related-content").replaceChildren(),dt=!1,Ke=[],Xe=[],ct=[],B="overview",at="",je="@overview",lt.clear(),Be.clear(),bt.clear(),Ne.clear(),_t.clear(),oa(),ne!=="business"&&ut("business"),E&&!ai&&Ge(!1)),S){C=y,G=y?Ga(y):void 0,q=y?nc(y):void 0,re=y?Ka(y):void 0,Re=!!y,ee=G?.tables??{},te=Object.keys(ee);const T=G?.groups.map(U=>U.id)??[],H=new Set([...In,"subsystems"]);if(he=new Map(T.map(U=>[U,H.has(U)||te.includes(U)?"group:"+U:U])),xe=new Map(te.map(U=>[U,H.has(U)||T.includes(U)?"concept:"+U:U])),ue=new Map([...he].map(([U,K])=>[K,U])),Me=new Map([...xe].map(([U,K])=>[K,U])),de=[...In,...ue.keys(),...Me.keys()],Array.isArray(ye?.expanded)&&ye.expandedVersion!==4){Ve.add("subsystems"),Ve.add("concept-relations");for(const U of y?.model.subsystems??[])Ve.add("subsystem-"+U.id)}}if(vn=h.key,Xe=Xe.filter(T=>h.states?.some(H=>H.id===T)),ne==="business"&&dt&&h.views?.find(T=>T.key===h.viewKey)?.activity===void 0&&h.views?.find(T=>T.key===h.viewKey)?.object===void 0&&kn(),ai&&h.key){if(Xr(),Tn===h.key){Array.isArray(ye?.specs)&&(ct=[...new Set(ye.specs.filter(T=>typeof T=="string").map(T=>Ki(T)))]);for(const[T,H]of Object.entries(ye?.specExamples??{})){const U=ge(T);typeof H=="string"&&U?.capability.samples.some(K=>K.id===H)&&lt.set(T,H)}}ai=!1,bs()}ft(),gt(),yt(),E&&ze()}}}class wo{tabs=new WeakMap;router;constructor(t=po){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,s){const a=JSON.stringify([i.map(l=>[l.id,l.width,l.height]),o.map(l=>[l.kind,l.from,l.to,l.label]),s]),d=this.tabs.get(t),u=!d||d.design!==n||d.structure!==a,c=new Set(i.filter(l=>{const b=d?.nodes.get(l.id);return!b||b.x!==l.x||b.y!==l.y}).map(l=>l.id)),r=new Set(i.map(l=>l.id)),f=u?new Array(o.length):d.routes.slice();if(o.forEach((l,b)=>{!u&&!c.has(l.from)&&!c.has(l.to)||(f[b]=r.has(l.from)&&r.has(l.to)?this.router({from:l.from,to:l.to,index:b,nodes:i,kind:l.kind,matrix:s?.[b],labels:s?.[b]?[]:[...f.flatMap((g,p)=>g&&p<b?[{id:String(p),x:g.label[0]-Math.max(30,o[p].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,o[p].label.length*12),height:18}]:[])],wires:s?.[b]?[]:f.flatMap((g,p)=>g&&p<b?[g.points]:[]),labelWidth:Math.max(30,l.label.length*12),labelHeight:18}):void 0)}),s){const l=[],b=new Map,g=f.map((p,m)=>m).sort((p,m)=>Number(s[p].returning)-Number(s[m].returning));for(const p of g){const m=f[p];if(!m)continue;const I=i.find(O=>O.id===o[p].from),j=Math.max(30,o[p].label.length*12),v=s[p].returning?[Math.max(...m.points.map(O=>O[0]))+8+j/2,m.points[0][1]]:[I.x+I.width*.125+8+j/2,ma(I.y+I.height,s[p].captionLane*or)+9],M=sr(o[p],p,s[p]),k=b.get(M)??mo(v,j,18,i,l);(k[0]!==m.label[0]||k[1]!==m.label[1])&&(f[p]={...m,label:k}),b.has(M)||(b.set(M,k),l.push({id:String(p),x:k[0]-j/2,y:k[1]-9,width:j,height:18}))}}return this.tabs.set(t,{design:n,structure:a,nodes:new Map(i.map(l=>[l.id,{...l}])),routes:f}),f}}function Vc(e,t,n,i){const o=(f,l,b)=>(l[0]-f[0])*(b[1]-f[1])-(l[1]-f[1])*(b[0]-f[0]),s=o(e,t,n),a=o(e,t,i),d=o(n,i,e),u=o(n,i,t),c=1e-6;if(s*a<-c&&d*u<-c)return!0;if(Math.max(Math.abs(s),Math.abs(a),Math.abs(d),Math.abs(u))>c)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],i[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],i[r]))>.1}function Bc(e,t,n,i,o=[]){const s=e.x+e.width,a=24,d=e.y+e.height,u=s-8-(2*(n.count-n.index)-1)*a,c=t.filter(j=>j.id!==e.id);let r;for(const j of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const M=[u+j,d],k=[M[0]+a,d];if(M[0]<e.x+8||k[0]>s-8)continue;const O=d+n.depth+v,D=Math.min(12,(k[0]-M[0])/2,(O-d)/2),R=[M];let x=`M${M}`;const P=q=>{x+=` L${q}`,R.push(q)},N=(q,re)=>{const ee=R.at(-1);x+=` Q${q} ${re}`;for(let te=1;te<=4;te++){const de=te/4,ue=1-de;R.push([ue*ue*ee[0]+2*ue*de*q[0]+de*de*re[0],ue*ue*ee[1]+2*ue*de*q[1]+de*de*re[1]])}};P([M[0],O-D]),N([M[0],O],[M[0]+D,O]),P([k[0]-D,O]),N([k[0],O],[k[0],O-D]),P(k);const C=ha(R,c,.3),G=o.filter(q=>R.slice(1).some((re,ee)=>q.slice(1).some((te,de)=>Vc(R[ee],re,q[de],te)))).length;if((!r||C<r.collisions||C===r.collisions&&G<r.wireCollisions)&&(r={path:x,points:R,collisions:C,wireCollisions:G,low:O,extra:v,shift:j}),C===0&&G===0)break}const{path:f,points:l,collisions:b,wireCollisions:g,low:p,extra:m,shift:I}=r;return{path:f,points:l,label:[Math.max(s+8,n.labelLeft)+i/2,p],bounds:{right:Math.max(...l.map(j=>j[0])),bottom:Math.max(...l.map(j=>j[1]))},collisions:b+g,rerouted:m>0||I!==0,fallback:b+g>0}}function Gc(e,t=To()){const n="http://www.w3.org/2000/svg",i=(L,z={})=>{const F=document.createElementNS(n,L);for(const[le,Z]of Object.entries(z))F.setAttribute(le,Z);return F},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(L=>[L]),a=[...new Set(["@new",...e.states,...s.map(L=>L[0].to)])],d={nodes:a.map(L=>({id:L,type:"business",name:o[L]??L,scope:!0})),relations:s.map(([L])=>({kind:L.path==="exception"?"business-exception":"input",from:L.from,to:L.to,label:L.id+"："+L.activity+"："+L.condition}))},u=zo(d,a),c=L=>{const z=Array.from(L);return Array.from({length:Math.ceil(z.length/28)},(F,le)=>z.slice(le*28,(le+1)*28).join(""))},r=s.map(([L])=>({from:L.from,activity:L.activity,rows:[L],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[L,z]of r.entries()){const F=z.rows[0],le=e.transitions.filter(se=>se.from===F.from&&(se.activityId??se.activity)===(F.activityId??F.activity)&&se.path===F.path&&(F.path!=="exception"||(se.exception??"例外名未定義")===(F.exception??"例外名未定義"))),Z=le.map(se=>(se.conditionLabel??se.condition).trim().replace(/\s+/g," ")),we=new Set(Z).size===le.length?F.conditionLabel??F.condition:F.condition,me=[F.path==="exception"?"例外："+(F.exception??"例外名未定義"):"",...le.length>1||F.path==="normal"&&F.conditionLabel?[we]:[]].filter(Boolean).join("：");z.lines=c(z.activity+(me?"（"+me+"）":"")),z.lineRows=z.lines.map(()=>z.rows),z.width=Math.max(...z.lines.map(se=>Array.from(se).length*14)),z.height=z.lines.length*18,u.wires[L].returning||(z.offset=f.has(z.from)?f.get(z.from)+8:0,f.set(z.from,z.offset+z.height))}const l=new Map;s.forEach(([L],z)=>{if(L.from===L.to){const F=l.get(L.from)??[];F.push(z),l.set(L.from,F)}});const b=new Map,g=new Map;for(const[L,z]of l){let F=0;for(const Z of[...z].reverse())b.set(Z,{leader:z[0],index:0,count:1,depth:0,offset:F}),F+=r[Z].height+8;const le=24+Math.max(0,F-8)+8;g.set(L,le);for(const Z of z)b.get(Z).depth=le}const p=L=>44,m=a.slice().sort((L,z)=>u.positions[L][1]-u.positions[z][1]);let I=Math.max(40,...r.map((L,z)=>u.wires[z].returning&&L.from===m[0]?16+L.height/2-44*(u.wires[z].fromPort??.5):40));const j=new Map;for(const L of m){const z=p(),F=(f.get(L)??0)+(g.get(L)??0);j.set(L,I),I+=ba(z,F)}const v=a.map(L=>({id:L,x:t.positions.get(L)?.[0]??u.positions[L][0],y:t.positions.get(L)?.[1]??j.get(L),width:Math.max(104,Array.from(o[L]??L).length*14+32),height:p()})),M=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),k=i("title");k.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(a.includes("@none")?"作成なしはこの操作の処理結果。":"")+(a.includes("@unknown")?"未決は設計課題。":""),M.append(k),M.append(qo("state-transition-"));const O=new Map,D=[],R=[];let x=t.selected;const P=L=>{x=L,t.selected=L;const z=ki(e.transitions,x);for(const[Z,we]of O)we.setAttribute("class","node graph-shape state-shape"+z.nodeClasses(Z)),we.setAttribute("aria-pressed",String(Z===x));D.forEach(({element:Z,rows:we})=>{const Ce=we[0].from===we[0].to;Z.setAttribute("class","edge"+(Ce?" state-self-loop":we[0].path==="exception"?" exception":"")+z.labelClasses(we)),Z.setAttribute("marker-end","url(#state-transition-"+(we.some(z.related)?"related-arrow":"arrow")+")")});for(const Z of R)Z.element.setAttribute("class","state-caption-line"+z.labelClasses(Z.rows));M.querySelectorAll("[data-exception-paint]").forEach(Z=>Z.remove());const F=Array.from(M.children).find(Z=>Z.matches(".state-diagram-edge-label,[data-state]"))??null,le=[...D].sort((Z,we)=>Number(Z.rows.some(z.related))-Number(we.rows.some(z.related)));for(const{element:Z}of le)if(M.insertBefore(Z,F),Z.classList.contains("exception")||Z.classList.contains("state-self-loop")){const we=M.children.length;Wo(M,Z,{path:Z.getAttribute("d")},{"data-transitions":Z.getAttribute("data-transitions")});for(const Ce of Array.from(M.children).slice(we))M.insertBefore(Ce,F)}M.querySelectorAll(".state-diagram-edge-label").forEach(Z=>M.append(Z))};M.addEventListener("click",L=>{L.target===M&&P()}),M.addEventListener("keydown",L=>{L.key==="Escape"&&(L.preventDefault(),P())});const N=u.wires.map((L,z)=>({...L,captionLane:(r[z].offset+(g.get(r[z].from)??0))/or})),C=d.relations.map((L,z)=>({...L,label:String(z).padEnd(Math.ceil(r[z].width/12),"x")})),G=[...b].map(([L,z])=>{const F=v.find(Z=>Z.id===s[L][0].from),le=r[L];return{x:F.x+F.width+8,y:F.y+F.height+24+z.offset,width:le.width,height:le.height}});let q=new wo().update({},e,v,C,N);for(let L=0;L<=G.length;L++){let z=!1,F=0;if(q.forEach((le,Z)=>{if(!le||b.has(Z)||!N[Z].returning)return;let we=0;for(const Ce of G)for(let me=1;me<le.points.length;me++){const se=le.points[me-1],ge=le.points[me];if(Math.abs(se[0]-ge[0])>1e-7||Math.abs(se[1]-ge[1])<2)continue;const Te=se[0];if(Te<Ce.x-4||Te>Ce.x+Ce.width+4||Math.max(se[1],ge[1])<Ce.y-4||Math.min(se[1],ge[1])>Ce.y+Ce.height+4)continue;const We=Ce.x+Ce.width+12-Te;We>0&&(we=Math.max(we,We))}we&&(N[Z]={...N[Z],returnLane:(N[Z].returnLane??0)+Math.ceil(we/16)+F++},z=!0)}),!z)break;q=new wo().update({},e,v,C,N)}const re=q.flatMap((L,z)=>L&&!b.has(z)?[L.points]:[]),ee=new Map,te=q.map((L,z)=>{const F=b.get(z);if(!F)return L;const le=s[z][0].from,Z=v.find(We=>We.id===le),we=q.flatMap((We,Nt)=>We&&!b.has(Nt)?[We.points]:[]),Ce=Math.max(30,C[z].label.length*12),me=r[z];let se=ee.get(F.leader);se||(se=Bc(Z,v,{...F,labelLeft:Z.x+Z.width+8},Ce,re),ee.set(F.leader,se),re.push(se.points));const ge=we.flatMap((We,Nt)=>We.slice(1).map((an,Jt)=>({id:`${Nt}:${Jt}`,x:Math.min(We[Jt][0],an[0])-2,y:Math.min(We[Jt][1],an[1])-2,width:Math.abs(We[Jt][0]-an[0])+4,height:Math.abs(We[Jt][1]-an[1])+4}))),Te=mo([Z.x+Z.width+8+me.width/2,Z.y+Z.height+24+F.offset+me.height/2],me.width,me.height,[...v,...ge]);return{...se,label:[Te[0]-me.width/2+Ce/2,Te[1]]}}),de=new Array(s.length),ue=[],Me=s.map((L,z)=>z).sort((L,z)=>Number(N[L].returning)-Number(N[z].returning));for(const L of Me){const z=te[L],F=r[L],le=Math.max(30,C[L].label.length*12);let Z=[z.label[0]-le/2+F.width/2,z.label[1]+(N[L].returning?0:F.height/2-9)];const we=v.find(se=>se.id===s[L][0].from),Ce=v.find(se=>se.id===s[L][0].to);if(!b.has(L)&&N[L].returning&&Ce&&Ce.y>we.y){const se=z.points.slice(1).map((ge,Te)=>[z.points[Te],ge]).filter(([ge,Te])=>Math.abs(ge[0]-Te[0])<.01&&Te[1]-ge[1]>24).sort(([ge,Te],[We,Nt])=>Nt[1]-We[1]-(Te[1]-ge[1]))[0];if(se){const[ge,Te]=se;Z=[ge[0]+8+F.width/2,ge[1]+Math.min(24+F.height/2,(Te[1]-ge[1])/2)]}}const me=mo(Z,F.width,F.height,v,ue);de[L]=me,ue.push({id:String(L),x:me[0]-F.width/2,y:me[1]-F.height/2,width:F.width,height:F.height})}let he=Math.max(...v.map(L=>L.x+L.width))+40,xe=Math.max(...v.map(L=>L.y+L.height))+40;s.forEach((L,z)=>{const F=b.get(z);if(F&&F.leader!==z)return;const le=F?s.flatMap((se,ge)=>b.get(ge)?.leader===z?se:[]):L,Z=le[0],we=te[z],Ce=i("path",{d:we.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":le.map(se=>se.id).join(" ")});(F||Z.path==="exception")&&Ce.setAttribute("stroke-dasharray","6 5");const me=i("title");me.textContent=le.map(se=>`${se.id} ${se.activity} / ${se.path==="normal"?"通常":"例外："+(se.exception??"例外名未定義")}：${se.condition}`).join(" / "),Ce.append(me),M.append(Ce),D.push({element:Ce,rows:le}),he=Math.max(he,we.bounds.right+40),xe=Math.max(xe,we.bounds.bottom+40)});for(const[L,z]of r.entries()){const F=de[L],le=F[0]-z.width/2,Z=F[1]-z.height/2+14;M.append(i("rect",{x:String(le),y:String(Z-14),width:String(z.width),height:String(z.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const we=i("text",{x:String(le),y:String(Z),class:"state-diagram-edge-label","data-activity":z.activity,"data-transition-id":z.rows[0].id,"aria-label":z.lines.join("")});z.lines.forEach((Ce,me)=>{const se=i("tspan",{x:String(le),dy:me?"18":"0","font-size":"14","font-weight":"600"});se.textContent=Ce,se.setAttribute("data-transitions",z.lineRows[me].map(ge=>ge.id).join(" ")),R.push({element:se,rows:z.lineRows[me]}),we.append(se)}),M.append(we),he=Math.max(he,le+z.width+24),xe=Math.max(xe,Z+z.height+24)}for(const L of v){const z=L.id.startsWith("@"),F=i("g",{role:"button",tabindex:"0","aria-label":o[L.id]??L.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":L.id,"data-node":L.id});F.append(nr(document,L,z)),F.append(i("rect",{x:String(L.x),y:String(L.y),width:String(L.width),height:String(L.height),rx:z?"20":"8",class:z?"state-diagram-node state-note":"state-diagram-node"}));const le=i("text",{x:String(L.x+L.width/2),y:String(L.y+L.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(le.textContent=o[L.id]??L.id,F.append(le),z&&L.id!=="@new"){const Z=i("text",{x:String(L.x+L.width/2),y:String(L.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Z.textContent=L.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",F.append(Z)}F.addEventListener("click",()=>P(L.id)),F.addEventListener("keydown",Z=>{(Z.key==="Enter"||Z.key===" ")&&(Z.preventDefault(),P(L.id))}),O.set(L.id,F),M.append(F)}return P(t.selected),M.setAttribute("viewBox",`0 0 ${he} ${xe}`),M.style.minWidth=`${he}px`,M}const Os=new WeakMap;function Hc(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(p=>p.id===t&&p.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const s=(p,m,I=o)=>{const j=document.createElement(p);return j.textContent=m,I.append(j),j};if(i.error)return s("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const a=i.model;for(const p of a.transitions){if(!e.graph.nodes.some(m=>m.id===p.activity&&m.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(p.exceptionId){const m=e.model?.business.exceptions?.find(I=>I.id===p.exceptionId);if(!m||m.activityId!==p.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=Os.get(e)??new Map;Os.set(e,d);const u=d.get(t)??To();d.set(t,u);const c={...a,transitions:a.transitions.map(p=>({...p,activityId:p.activity,activity:e.graph.nodes.find(m=>m.id===p.activity)?.name??p.activity}))};o.append(tr(document,p=>Gc(c,p),u));const r=p=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[p]??p,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},l=document.createElement("details");s("summary",`操作の詳細（${a.transitions.length}）`,l);const b=document.createElement("ol");l.append(b),o.append(l);for(const p of a.transitions){const m=document.createElement("li");m.dataset.transition=p.id,s("h3",`${p.id} · ${r(p.from)} → ${r(p.to)}`,m),p.path==="exception"&&s("p","例外名："+(p.exception??"未定義"),m),s("p",`${f[p.effect]} · ${p.path==="normal"?"正常":"例外"}`,m);const I=e.graph.nodes.find(j=>j.id===p.activity&&j.type==="business");if(I){const j=document.createElement("button");j.type="button",j.textContent=I.name,j.onclick=()=>n(I.id),m.append(j)}else s("p","要確認：根拠Activityが見つかりません — "+p.activity,m);s("p","条件："+p.condition,m),s("p",p.note,m),s("p","根拠："+p.evidence,m),b.append(m)}a.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",a.source,g),o.append(g),o}const Cs=64,Jc=96,_c=260,js=40,Kc=4;function Xc(e,t,n=!0){const{nodes:i,previous:o,children:s,parents:a,forwardRelations:d,feedbackRelations:u,exceptionRelations:c}=ga(e,t),r=a.map(k=>k.length),f=i.map(()=>0),l=i.flatMap((k,O)=>r[O]===0?[O]:[]);for(let k=0;k<l.length;k++)for(const O of s[l[k]])f[O]=Math.max(f[O],f[l[k]]+1),--r[O]===0&&l.push(O);const b=Array.from({length:f.reduce((k,O)=>Math.max(k,O),0)+1},()=>[]);i.forEach((k,O)=>b[f[O]].push(O));const g=i.map(()=>0),p=k=>k.forEach((O,D)=>g[O]=D);b.forEach(p);for(let k=0;k<Kc;k++){const O=k%2?[...b].reverse():b;for(const D of O){const R=new Map(D.map(x=>{const P=k%2?s[x]:a[x];return[x,P.length?P.reduce((N,C)=>N+g[C],0)/P.length:g[x]]}));D.sort((x,P)=>R.get(x)-R.get(P)||x-P),p(D)}}const m=b[0].filter(k=>i[k].type==="object"&&o[k].length===0&&s[k].length>0);if(n&&m.length>1){const k=new Set(m),O=b[0].filter(D=>!k.has(D));b.splice(0,1,...m.map((D,R)=>R===0?[...O,D]:[D]))}const I=Object.create(null),j=i.map(()=>0),v=[],M=Math.ceil(_c/Cs)-1;for(let k=0;k<b.length;k++){const O=new Map;for(const x of v)for(const P of x)O.set(P,P+1);const D=x=>{let P=x;for(;O.has(P);)P=O.get(P);let N=x;for(;O.has(N);){const C=O.get(N);O.set(N,P),N=C}return P},R=[];for(const x of b[k]){let P=k;for(const C of a[x])P=Math.max(P,j[C]+1);const N=D(P);j[x]=N,O.set(N,N+1),R.push(N),I[i[x].id]=[js+k*Cs,js+N*Jc]}v.push(R),v.length>M&&v.shift()}return{positions:I,forwardRelations:d,feedbackRelations:u,exceptionRelations:c}}function Zc(e,t){return rr(e)?zo(e,t).positions:Xc(e,t).positions}const Ms=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function mr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>Ms(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const s=Ms(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(s)return s}return 0})}}function hr(e){const t=mr(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([s,a])=>[i.get(s),a])))}}function br(e){const t=hr(e);return t.restore(Zc(t.graph,t.order))}function Yc(e){const t=hr(e),n=zo(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function gr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function Qc(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(a=>a.handle!==void 0):s.tabs.some(a=>a.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(s,a){if(Object.is(s,a))return!0;if(!s||!a||typeof s!="object"||typeof a!="object"||i.has(s)||i.has(a))return!1;const d=b=>Array.isArray(b)||Object.getPrototypeOf(b)===null||Object.getPrototypeOf(b)?.constructor?.name==="Object";if(!d(s)||!d(a)||Array.isArray(s)!==Array.isArray(a)||Array.isArray(s)&&s.length!==a.length)return!1;i.add(s),i.add(a);const u=s,c=a,r=Object.keys(u),f=Object.keys(c),l=r.length===f.length&&r.every(b=>Object.hasOwn(c,b)&&o(u[b],c[b]));return i.delete(s),i.delete(a),l}return o(e,t)}function Rn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),i=Object.create(null);for(const[s,a]of Object.entries(e.positions))n.has(s)&&(i[s]=[...a]);const o=t.graph.nodes.filter(s=>!i[s.id]);if(o.length){const s=br(t),a=Object.values(i);for(const d of o){const u=[...s[d.id]];for(;a.some(c=>Math.abs(c[0]-u[0])<280&&Math.abs(c[1]-u[1])<88);)u[1]+=180;i[d.id]=u,a.push(u)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function yr(){return new Promise((e,t)=>{const n=indexedDB.open(gr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class Vo extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let xi;function vr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function ed(e){const t=xi;if(t===void 0)throw Error("Session has not been loaded");const n=await yr();try{await new Promise((i,o)=>{const s=n.transaction("session","readwrite"),a=s.objectStore("session"),d=a.get("generation"),u=a.get("current"),c=a.get("readonly-legacy");let r,f;c.onsuccess=()=>{try{const l=vr(d.result);if(Qc(u.result,e)){f=l;return}if(l!==t)throw new Vo;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");c.result===void 0&&nd(u.result)&&a.put(u.result,"readonly-legacy"),a.put(e,"current"),a.put(f,"generation")}catch(l){r=l,s.abort()}},s.oncomplete=()=>{xi=f,i()},s.onerror=()=>o(r??s.error??Error("Session save failed")),s.onabort=()=>o(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function td(){xi=void 0;const e=await yr();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),s=o.get("current"),a=o.get("generation");i.oncomplete=()=>{try{xi=vr(a.result),t(s.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function nd(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Ls=new WeakMap;function id(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let i=Ls.get(e);i||(i=new Map,Ls.set(e,i));const o=i.get(t);if(o)return o;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),a=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),d=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&a.has(r.to)||r.to===t&&a.has(r.from))),u=new Set([t,...d.flatMap(r=>[r.from,r.to])]),c={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>u.has(r.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>u.has(r))};return i.set(t,c),c}const Ds=new WeakMap;function od(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let i=Ds.get(e);i||(i=new Map,Ds.set(e,i));const o=t,s=i.get(o);if(s)return s;const a=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),d=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),u=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&d.has(f.to)||f.kind==="output"&&f.to===t&&d.has(f.from)||f.kind==="object-exception"&&(f.from===t&&a.has(f.to)||f.to===t&&a.has(f.from))),c=new Set([t,...u.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>c.has(f.id)),relations:u},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>c.has(f))};return i.set(o,r),r}const wr=new WeakMap;function Ft(e){return wr.get(e)}const kr=["design","checks","source","draft","edited","handle"];function sd(e){return{key:e.key,name:e.name,...Object.fromEntries(kr.map(t=>[t,e[t]]))}}function Ct(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:a,viewInset:d,canvasOrigin:u,scroll:c,zoom:r}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:a,viewInset:d,canvasOrigin:u,scroll:c,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Ri(e,t){const n=t;wr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of kr)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Ai(e){return e.activity}function Ei(e){return e.object}function Bn(e){return e.activity??e.object}function Ni(e){return e.object===void 0?id(e.design,e.activity):od(e.design,e.object)}function Pi(e){const t=Ni(e),n=Rn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function jt(e,t=[],n,i){const o=n??(e.tabs[0]?sd(e.tabs[0]):void 0),s=o?(i??[e.tabs[0]?Ct(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(l=>{const b=Ri(o,l);return Object.assign(l,Ct(Pi(b))),b}):[],{dark:a,drawer:d,width:u,preferWrite:c,nodeDrawer:r,sampleLayout:f}=e;return{dark:a,drawer:d,width:u,preferWrite:c,nodeDrawer:r,sampleLayout:f,document:o,tabs:s,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(l=>l.source?.kind==="url").map(l=>({url:l.source.url,name:l.name}))].filter((l,b,g)=>g.findIndex(p=>p.url===l.url)===b),legacyViews:e.legacyViews,active:s.some(l=>l.key===e.active)?e.active:s[0]?.key}}function Bo(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Ct),recovery:n}}function ui(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function rd(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!fd(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const r of o.views)ui(r)}const{format:s,views:a,document:d,recovery:u,...c}=e;for(const r of a)ui(r);for(const r of u)ui(r);if(!!d!=!!a.length||new Set(a.map(r=>r.key)).size!==a.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(l=>l.group!==void 0&&typeof l.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(l=>l.group===void 0).length!==1))throw Error("Invalid legacy views");const r=i.views[0],f=r?{...r}:void 0;return f&&delete f.group,jt({...c,tabs:[],active:f?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},u,d,f?[f]:[])}if(a.length&&(a[0].activity!==void 0||a[0].object!==void 0||a.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(a.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==a.filter(r=>r.activity!==void 0).length||new Set(a.filter(r=>r.object!==void 0).map(r=>r.object)).size!==a.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(d&&a.some(r=>r.activity!==void 0&&!d.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(d&&a.some(r=>r.object!==void 0&&!d.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return jt({...c,tabs:[]},u,d,a)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)ui(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return jt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function ad(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return jt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function cd(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),a=new Set(t.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),d=e.tabs.filter(u=>(u.activity===void 0||s.has(u.activity))&&(u.object===void 0||a.has(u.object))).map(Ct);return jt(e,e.recovery,o,d)}function dd(e,t){const n=e.tabs.find(o=>Ai(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=Ri(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ct(Pi(i))),e.tabs.push(i),e.active=i.key,i}function ld(e,t){const n=e.tabs.find(o=>Ei(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=Ri(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ct(Pi(i))),e.tabs.push(i),e.active=i.key,i}function ud(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(s=>s.key===i.key);return Ct(o?Pi(Ri(e.document,{...Ct(i),...Ct(o)})):i)});return jt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function fd(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Ti(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const s=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},a=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const u=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),c=u.getBoundingClientRect();t.style.left=Math.max(8,Math.min(c.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(c.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?a():s(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),a(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const u=d,c=o(),r=c.indexOf(document.activeElement);let f;u.key==="ArrowDown"&&(f=(r+1)%c.length),u.key==="ArrowUp"&&(f=(r+c.length-1)%c.length),u.key==="Home"&&(f=0),u.key==="End"&&(f=c.length-1),f!==void 0&&(u.preventDefault(),c[f]?.focus())}),t.addEventListener("click",d=>{const u=d.target.closest("button,a[href]");!t.hidden&&u&&!i(u)&&s(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const pd=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),md={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function hd(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),s=v=>o.slice(v.line+1,i.find(M=>M.line>v.line&&M.level<=v.level)?.line??o.length).join(`
`).trim(),a=new Map(i.filter(v=>v.level===3&&t.some(M=>M.title===v.title)).map(v=>[v.title,v])),d=v=>{const M=t.find(k=>k.title===v.title);return M?"legacy-check:"+M.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},u=new Map,c=(v,M)=>{u.has(v)?u.get(v)!==M&&u.set(v,void 0):u.set(v,M)};for(const v of i){const M=d(v);c(pd(v.title),M);const k=t.find(O=>O.title===v.title);k&&c(k.id.toLowerCase(),M)}for(const[v,M]of o.entries()){const k=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(M);if(k){const O=i.find(D=>D.line>v);O&&c(k[1].toLowerCase(),d(O))}}const r=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const M=[];let k=0;for(const O of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){O.index>k&&M.push({kind:"markdown",value:v.slice(k,O.index)});let D=O[2].slice(1);try{D=decodeURIComponent(D)}catch{}const R=O[2].startsWith("#")?u.get(D.toLowerCase()):void 0;M.push(R?{kind:"reference",targetId:R,label:O[1]}:{kind:"link",uri:O[2],label:O[1]}),k=O.index+O[0].length}return k<v.length&&M.push({kind:"markdown",value:v.slice(k)}),M},f=[],l=[],b=[],g=new Map;for(const v of i.filter(M=>M.level===2)){if(v.title==="業務一覧")continue;const M=d(v),k=i.find(O=>O.line>v.line)?.line??o.length;f.push({id:M,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:r(o.slice(v.line+1,k).join(`
`).trim())}),g.set(v.title,M)}const p="legacy-unassigned",m=v=>{const M=i.filter(k=>k.line<v.line&&k.level===2).at(-1);return M?g.get(M.title):void 0},I=t.map(v=>{const M=a.get(v.title),k=m(M)??p,O=Object.create(null),D=[];let R={name:"補足",value:""},x="";for(const N of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const C=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(N);C&&(x?C[1][0]===x[0]&&C[1].length>=x.length&&!C[2].trim()&&(x=""):x=C[1]);const G=x?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(N);G?(R.value.trim()&&D.push(R),R={name:G[1],value:G[2]}):R.value+=`
`+N}R.value.trim()&&D.push(R);let P="";for(const N of D)if(N.name==="人間レビュー状態"){P=N.value.split(`
`)[0].trim();const C=N.value.split(`
`).slice(1).join(`
`).trim();C&&(O.補足=[...O.補足??[],...r(C)])}else{const C=md[N.name]??N.name;O[C]=[...O[C]??[],...r(N.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:P,sectionId:k,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(N=>N[1]).join(`
`),fields:O}});I.some(v=>v.sectionId===p)&&f.push({id:p,activityId:null,title:"未割当",preamble:[]});for(const v of i.filter(M=>M.level===3&&!a.has(M.title))){const M=m(v);M?l.push({id:d(v),sectionId:M,title:v.title,blocks:[{kind:"prose",content:r(s(v))}]}):b.push({id:d(v),title:v.title,content:r(s(v))})}const j=i.find(v=>v.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(o.slice(/^# /.test(o[0])?1:0,j).join(`
`)),sections:f,items:I,index:Object.entries(n).map(([v,M])=>{const k=o.find(O=>O.startsWith("|")&&O.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:k[1]?.trim()??"",connections:k[2]?.trim()??"",checkIds:M.map(O=>"legacy-check:"+O)}}),guarantees:l,examples:[],notes:b}}function ro(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...s]=n;if(!i||!o)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[a,...d]=s;return!a||!d.length||!["main","master"].includes(a)&&!/^[a-f0-9]{40}$/i.test(a)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:a}}catch{return}}function ko(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function bd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((f,l)=>{const b=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(b){o?b[1][0]===o[0]&&b[1].length>=o.length&&!b[2].trim()&&(o=""):o=b[1];return}if(!o){t.add(l);const g=/^(#{1,6}) (.+)$/.exec(f);g&&i.push({line:l,level:g[1].length,title:g[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const s=i.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const a=new Set,d=s.map(f=>{const l=i.find(p=>p.line>f.line&&p.level<=3)?.line??n.length,b=f.title.split(/\s/)[0];if(a.has(b))throw Error("Check IDが重複しています: "+b);a.add(b);const g=n.slice(f.line+1,l).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const p of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+p+"[：:]\\s*\\S","m").test(g))throw Error(b+" の"+p+"が見つかりません。");return{id:b,title:f.title,body:g,activities:[]}}),u=Object.create(null);let c=!1;for(const[f,l]of n.entries()){if(!t.has(f)||(/^## /.test(l)&&(c=/^## 業務一覧\s*$/.test(l)),!c||!/^\|/.test(l)))continue;const b=l.split("|").slice(1,-1);if(b.length!==4)continue;const g=ko(b[0])[0]?.label;if(!g)continue;if(Object.hasOwn(u,g))throw Error("業務一覧のActivityが重複しています: "+g);const p=ko(b[3]);if(p.some(I=>I.url.toLowerCase()!=="#"+I.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const m=p.map(I=>I.label);if(!m.length||m.some(I=>!a.has(I)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);u[g]=[...new Set(m)];for(const I of d)m.includes(I.id)&&I.activities.push(g)}if(!Object.keys(u).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=i.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:d,index:u,model:hd(e,d,u,i)}}function Gn(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Hn(e,t){const n=new Set(t.design.graph.nodes.filter(c=>c.type==="business").map(c=>c.name)),i=Object.keys(e.index).filter(c=>!n.has(c)),o=Object.keys(e.index).filter(c=>n.has(c)),s=(c,r)=>({state:c,reason:r,unknown:i});if(!o.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const a=e.intro.split(`
`).filter(c=>/原典|^[-*] Source[：:]|Business Design/i.test(c)).join(`
`),d=ko(a).map(c=>ro(c.url)).filter(c=>c!==void 0),u=t.source?.kind==="url"?ro(t.source.url):t.source?.kind==="sample"?ro("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return u&&d.length&&d.some(c=>c.document!==u.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!u||!d.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(c=>c.ref!==u.ref)||!/^[a-f0-9]{40}$/i.test(u.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Rs=new WeakMap;function jn(e){let t=Rs.get(e);return t||(t=bd(e.markdown),Rs.set(e,t)),t}const ao=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function fi(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function gd(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function yd(e){if(!e.checks)return[];const t=jn(e.checks),n=Hn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===Gn(e)?[t.model]:[]}function vd(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&fi(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let s,a=!1;if(e.checks){s=jn(e.checks);const d=Hn(s,e);if(a=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===Gn(e),!a&&(fi(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const u=ao("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));u.disabled=n.disabled||t.busy===!0,o.append(u)}}if(t.candidate){const d=t.candidate,u=jn(d),c=Hn(u,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",fi(r,"一致未確認: "+d.name+" — "+c.reason),fi(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),l=document.createElement("summary");l.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(l,gd(u.markdown)),r.append(f);const b=ao("対応を確認して表示する",()=>n.confirm(d));b.id="check-confirm",b.disabled=c.state==="mismatch"||n.disabled||t.busy===!0;const g=ao("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(b,g),o.append(r)}return o.childNodes.length&&i.append(o),i}function wd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const r of o){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const a=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),r&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(r=>!r.hidden&&!r.disabled),u=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const b=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+b,p=o.some(m=>!m.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=p?"menu":"inline",i.hidden=!p,(!p||r!==e.dataset.actionsMode)&&(a(),p&&n.contains(f)?i.focus({preventScroll:!0}):!p&&f===i&&d()[0]?.focus({preventScroll:!0}))},c=(r=!1)=>{if(i.hidden)return;s=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const f=d();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return i.onclick=()=>s?a(!0):c(),i.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),c(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=d(),l=f.indexOf(document.activeElement);let b;r.key==="ArrowDown"&&(b=(l+1)%f.length),r.key==="ArrowUp"&&(b=(l+f.length-1)%f.length),r.key==="Home"&&(b=0),r.key==="End"&&(b=f.length-1),b!==void 0&&(r.preventDefault(),f[b]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),a(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!i.contains(r.target)&&a()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==i&&a()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&a(!0)},!0),a(),u(),window.addEventListener("resize",u),typeof ResizeObserver<"u"&&new ResizeObserver(u).observe(e),new MutationObserver(u).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(u),document.fonts?.addEventListener("loadingdone",u),{update:u,close:a}}function kd(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),s=parseFloat(o.columnGap)||0,a=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((c,r)=>c+r.getBoundingClientRect().width,0)+s*n.length+a,u=d+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&u>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(s=>o.observe(s))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const Wn="http://www.w3.org/2000/svg",Id="http://www.w3.org/1999/xhtml",pi=24,Ns=8192,Sd=16e6,xd=8e6,Ad=4e3,Ed=1e6,Io="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Od(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),i=Math.max(i,r.x+r.width),o=Math.max(o,r.y+r.height);const s=Math.floor(t)-pi,a=Math.floor(n)-pi,d=Math.ceil(i)-s+pi,u=Math.ceil(o)-a+pi,c=Math.min(2,Ns/d,Ns/u,Math.sqrt(Sd/(d*u)));if(c<1)throw Error(Io);return{bounds:{x:s,y:a,width:d,height:u},width:Math.floor(d*c),height:Math.floor(u*c),scale:c}}const Cd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function Ps(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,s)=>{const a=i[s],d=getComputedStyle(o);a.removeAttribute("style");for(const u of Cd){const c=d.getPropertyValue(u);c&&!/url\s*\(/i.test(c)&&a.style.setProperty(u,c)}for(const u of Array.from(a.attributes))(u.name.startsWith("data-")||u.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(u.name))&&a.removeAttribute(u.name)}),t}function jd(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Ad||(e.textContent?.length??0)+(t.textContent?.length??0)>Ed)throw Error(Io);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(p=>({x:parseFloat(p.style.left),y:parseFloat(p.style.top),width:p.offsetWidth,height:p.offsetHeight}));for(const p of i)for(const m of Array.from(p.querySelectorAll(".finding-badges")))o.push({x:parseFloat(p.style.left)+p.clientLeft+m.offsetLeft,y:parseFloat(p.style.top)+p.clientTop+m.offsetTop,width:m.offsetWidth,height:m.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,a=Array.from(t.children).map(Ps),d=a.filter(p=>p.matches(".edge,.edge-label"));if(d.length){const p=s.createElementNS(Wn,"svg");p.setAttribute("viewBox","0 0 1 1"),p.setAttribute("width","1"),p.setAttribute("height","1"),p.setAttribute("aria-hidden","true"),p.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",p.append(...d),s.body.append(p);try{for(const m of d){const I=m.getBBox();o.push({x:I.x-12,y:I.y-12,width:I.width+24,height:I.height+24})}}finally{p.remove()}}const u=Od(o),c=s.createElementNS(Wn,"svg");c.setAttribute("width",String(u.width)),c.setAttribute("height",String(u.height)),c.setAttribute("viewBox",`0 0 ${u.bounds.width} ${u.bounds.height}`);const r=s.createElementNS(Wn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),c.append(r);const f=s.createElementNS(Wn,"g");f.setAttribute("transform",`translate(${-u.bounds.x} ${-u.bounds.y})`);for(const p of a)f.append(p);c.append(f);const l=s.createElementNS(Wn,"foreignObject");l.setAttribute("width",String(u.bounds.width)),l.setAttribute("height",String(u.bounds.height));const b=s.createElementNS(Id,"div");b.style.cssText=`position:relative;width:${u.bounds.width}px;height:${u.bounds.height}px;`;for(const p of i){const m=Ps(p);m.querySelector(".activity-open,.object-open")?.remove(),m.style.left=parseFloat(p.style.left)-u.bounds.x+"px",m.style.top=parseFloat(p.style.top)-u.bounds.y+"px",b.append(m)}l.append(b),c.append(l);const g=new XMLSerializer().serializeToString(c);if(new TextEncoder().encode(g).length>xd)throw Error(Io);return{svg:g,...u}}function Md(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function Ir(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,s)=>{const a=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(a),o()},n.onerror=()=>{clearTimeout(a),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,s)=>{const a=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(a),d?o(d):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(a),s(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Ld(e,t){const n=await Ir(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Md(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function Dd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=Ir(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function Sr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:Rd(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Rd(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,s=2246822507;for(const a of i)o=Math.imul(o^a.codePointAt(0),16777619)>>>0,s=Math.imul(s^a.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function xr(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return W(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function Ar(e){W(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),fn(e),Si(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=Sr(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=xr(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Si(t),t}const Ts=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Nd={anyOf:Ii.anyOf},Pd={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Td={type:"string",minLength:1,pattern:"\\S"},qd={...Ts({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:Ts({id:Pd,name:Td,package:Nd})}}),$defs:Ii.$defs};function Wd(e){fn(e,qd),W(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){W(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),W(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Si(n.package),n.package.formatVersion!=="0.4"&&Ar(n.package)}catch(i){throw Error("Plan "+n.id+": "+i.message,{cause:i})}}return{valid:!0,plans:e.plans.map(({id:n,name:i})=>({id:n,name:i}))}}const ce=(e,t)=>{if(!e)throw new Error(t)},zn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),co=e=>!!e&&typeof e=="object"&&!Array.isArray(e),mi=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),Er=e=>zn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function zd(e){ce(co(e),"Graph must be an object");const t=e;ce(mi(t,["version","nodes","relations"])||mi(t,["version","nodes","relations","scope"]),"Invalid graph fields"),ce(t.version===1,"Unsupported graph version"),"scope"in t&&ce(zn(t.scope),"Invalid scope"),ce(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),ce(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){ce(co(s),"Node must be an object");const a=s;ce(a.type==="business"||a.type==="object","Invalid node type");const d=a.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];a.type==="business"&&("problem"in a||"pain_level"in a)&&(d.push("problem","pain_level"),ce(["Low","Medium","High"].includes(String(a.pain_level)),"Invalid Pain level")),ce(mi(a,d),"Invalid node fields"),ce(Object.entries(a).every(([c,r])=>c==="scope"||c==="information"||zn(r)),"Empty node text"),ce(typeof a.scope=="boolean","Invalid node scope"),ce(Er(a.name)&&a.id===a.name,"Node ID must equal visible name"),ce(!n.has(a.id),"Duplicate node ID"),a.type==="object"&&(ce(typeof a.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.icon),"Invalid Lucide icon"),ce(Array.isArray(a.information)&&a.information.every(zn),"Invalid information")),n.set(a.id,a.type)}ce([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const s of t.relations){ce(co(s),"Relation must be an object");const a=s;ce(mi(a,["kind","from","to","label"])&&Object.values(a).every(zn),"Invalid relation fields");const d=i[a.kind];ce(Array.isArray(d)&&n.has(a.from)&&n.has(a.to)&&n.get(a.from)===d[0]&&n.get(a.to)===d[1],"Invalid relation endpoints");const u=JSON.stringify([a.kind,a.from,a.to,a.label]);ce(!o.has(u),"Duplicate relation"),o.add(u)}}function en(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Un(e){const t=[];let n="";return en(e).forEach((i,o)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),ce(!n,"Unclosed code fence"),t}function So(e,t,n,i=[]){const o=en(e),s=Un(e),a=Object.create(null);return ce(s.length&&!o.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([d,u],c)=>{ce(t.includes(u)&&!(u in a),n+": unsupported/duplicate "+u),a[u]=o.slice(d+1,s[c+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ce(a[u]||i.includes(u),n+": empty "+u)}),ce(s.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),a}const qs=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function Ud(e){const t=en(e),n=Un(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return ce(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,s],a)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);ce(d,"Invalid Finding ID");const u=d[1];ce(!i.has(u),"Duplicate Finding ID"),i.add(u);const c=So(t.slice(o+1,n[a+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+u);ce(["question","correction"].includes(c["### Kind"]),"Invalid Finding Kind"),ce(["open","resolved"].includes(c["### Status"]),"Invalid Finding Status"),ce(["items","document","unassigned"].includes(c["### Scope"]),"Invalid Finding Scope");const r=c["### Targets"]==="(none)"?[]:en(c["### Targets"]).filter(f=>f.trim()).map(f=>(ce(f.startsWith("- ")&&Er(f.slice(2)),"Invalid Finding target"),f.slice(2)));return ce(new Set(r).size===r.length,"Duplicate Finding target"),ce(c["### Scope"]==="items"?r.length>0:c["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:u,kind:c["### Kind"],status:c["### Status"],scope:c["### Scope"],targets:r,summary:c["### Summary"],content:c["### Content"],unresolvedTargets:[]}})}function $d(e,t){ce(!e.includes("<!--"),"HTML comments are unsupported");const n=en(e),i=Un(e).filter(l=>l[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;ce(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let s=[];const a={version:1,nodes:[],relations:[]},d=Object.create(null),u=new Set;i.slice(1).forEach(([l,b],g)=>{const p=i[g+2]?.[0]??n.length,m=n.slice(l+1,p).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(ce(m,"Empty section "+b),b==="# Findings"){ce(!u.has(b),"Duplicate Findings"),u.add(b),s=Ud(m);return}if(["# Scope","# Graph exceptions"].includes(b)){ce(!u.has(b),"Duplicate "+b),u.add(b),b==="# Scope"?(ce(!Un(m).length,"Scope must be prose"),a.scope=m):en(m).filter(R=>R.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(R=>{const x=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(R);ce(x,"Invalid exception"),a.relations.push({kind:x[1],from:x[2],to:x[3],label:x[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const I=o.exec(b);ce(I,"Unsupported heading "+b);const j=I[1],v=I[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[v]=n.slice(l,p).join(`
`);const M=R=>Un(m).some(x=>x[1]===R);if(j==="Object"){const R=["## Scope","## Icon"];M("## Information")&&R.push("## Information");const x=So(m,R,v);ce(["true","false"].includes(x["## Scope"]),"Invalid Scope");const P=en(x["## Information"]??"").filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(N=>(ce(/^- \S.*$/.test(N),"Invalid Information"),N.slice(2)));a.nodes.push({id:v,type:"object",name:v,scope:x["## Scope"]==="true",icon:x["## Icon"]==="(generic icon)"?"box":x["## Icon"],information:P});return}const k=["## Scope","## Why","## When"];M("## Exception When")&&k.push("## Exception When"),k.push("## Who","## Where","## How","### Input","### Procedure"),M("### Exception")&&k.push("### Exception"),k.push("### Output","## Result"),(M("## Problem")||M("## Pain level"))&&k.push("## Problem","## Pain level");const O=So(m,k,v,["## How"]);ce(!O["## How"],"How must only contain fields"),ce(["true","false"].includes(O["## Scope"]),"Invalid Scope"),t?.activity?.(v,O);const D={id:v,type:"business",name:v,scope:O["## Scope"]==="true",why:O["## Why"],when:O["## When"],who:O["## Who"],where:O["## Where"],result:O["## Result"]};"## Problem"in O&&(D.problem=O["## Problem"],D.pain_level=O["## Pain level"]),a.nodes.push(D);for(const[R,x]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(R in O)||x!=="business-exception"&&O[R]==="(none)"||en(O[R]).filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(P=>{const N=/^- (.+?) — (\S.*)$/.exec(P);ce(N,"Invalid relation in "+v),a.relations.push({kind:x,from:x==="output"?v:N[1],to:x==="output"?N[1]:v,label:N[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const c=a.nodes.filter(l=>l.type==="business").map(l=>l.id);zd(a),a.nodes.sort((l,b)=>qs(l.id,b.id)),a.relations.sort((l,b)=>{for(const g of["kind","from","to","label"]){const p=qs(l[g],b[g]);if(p)return p}return 0});const r=new Set(a.nodes.map(l=>l.id));for(const l of s)l.unresolvedTargets=l.targets.filter(b=>!r.has(b));return{graph:a,sections:d,markdown:e,activityOrder:c,findings:s}}const Fd=["id","from","activity","condition","to","effect","path","evidence","note"],Fe=(e,t)=>{if(!e)throw Error(t)},hi=e=>typeof e=="string"&&!!e.trim();function Vd(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Fe(n,"state-meta と遷移表が必要です");const i=fr(n[1]);Fe(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),Fe(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Fe(i.object===t,"対象Objectが一致しません"),Fe(Array.isArray(i.states)&&i.states.length>0&&i.states.every(c=>hi(c)&&!c.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),Fe(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&hi(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),s=c=>(Fe(c.startsWith("|")&&c.endsWith("|"),"表の行が不正です"),c.slice(1,-1).split("|").map(r=>r.trim())),a=s(o[0]);Fe([Fd,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(c=>a.join("|")===c.join("|")),"表の列名が不正です"),Fe(s(o[1]).length===a.length&&s(o[1]).every(c=>/^-+$/.test(c)),"表の区切りが不正です"),Fe(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,u=o.slice(2).map(c=>{const r=s(c);Fe(r.length===a.length&&r.every(hi),"表の列数・空欄が不正です");const f=Object.fromEntries(a.map((l,b)=>[l,r[b]]));return Fe(/^T[0-9]+$/.test(f.id)&&!d.has(f.id),"遷移IDが不正または重複しています"),d.add(f.id),Fe([...i.states,"@new"].includes(f.from)&&[...i.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),Fe(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),a.includes("exception")&&Fe(f.path==="normal"?f.exception==="-":hi(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),Fe(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),Fe(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),Fe(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),Fe(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...i,transitions:u}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Ws=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Bd(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let s="";for(let a=0;a<i.length;a++){const d=i[a];if(!s&&/^# Object /.test(d)?n=d.slice(9):!s&&/^# /.test(d)&&(n=null),!s&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const u=[];let c="";for(a++;a<i.length;a++){const f=i[a];if(!c&&/^#{1,2} /.test(f)){a--;break}u.push(f),c=Ws(f,c)}const r=Vd(u.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}o.push(d),s=Ws(d,s)}if(new Set(t.map(a=>a.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function Gd(e){const t=/^## State Transitions$/m.test(e)?Bd(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,s=$d(t.markdown,{activity:(u,c)=>o.set(u,c),document:(u,c)=>{n=u,i=c}}),a={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:s.graph.scope??"",objects:s.graph.nodes.filter(u=>u.type==="object").map(u=>({id:u.id,name:u.name,scope:u.scope,icon:String(u.icon),information:u.information})),activities:(s.activityOrder??[]).map(u=>{const c=s.graph.nodes.find(f=>f.id===u),r=o.get(u);return{id:u,name:c.name,scope:c.scope,why:String(c.why),when:String(c.when),who:String(c.who),where:String(c.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(c.result),problem:c.problem===void 0?null:String(c.problem),painLevel:c.pain_level===void 0?null:String(c.pain_level)}}),relations:s.graph.relations.map((u,c)=>({id:"legacy-relation-"+c,kind:u.kind,fromId:u.from,toId:u.to,label:u.label})),findings:(s.findings??[]).map(u=>({...u,sourceId:u.id,targetIds:u.targets.filter(c=>s.graph.nodes.some(r=>r.id===c))}))};a.exceptions=Sr(a);const d=t.declarations.map((u,c)=>({id:"legacy-state-"+c,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:a.id,revision:a.revision,verification:"unverified"},objectId:u.object,states:u.states.map(r=>({id:r,name:r})),start:u.start,terminal:u.terminal,completeness:u.completeness,source:u.source,transitions:u.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:xr(a,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:a,checks:[],states:d,diagnostics:[]}}}function Hd({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const i=pr({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(i.diagnostics)]};const o=e.business,s=[...o.objects,...o.activities],a=c=>o.roles?.find(r=>r.id===c.roleId)?.name??c.who,d=[...o.objects.map(c=>({...c,type:"object"})),...o.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:a(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],u=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===o.id).map(c=>{const r=new Map(c.states.map(l=>[l.id,l.name])),f={object:s.find(l=>l.id===c.objectId).name,states:c.states.map(l=>l.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(l=>({id:l.sourceId,from:r.get(l.fromId)??l.fromId,to:r.get(l.toId)??l.toId,activity:l.activityId,...l.event?{event:l.event}:{},...l.exceptionId?{exceptionId:l.exceptionId,exception:o.exceptions?.find(b=>b.id===l.exceptionId)?.name}:{},condition:l.condition,...l.conditionLabel?{conditionLabel:l.conditionLabel}:{},effect:l.effect,path:l.path,evidence:l.evidence,note:l.note}))};return[c.objectId,{model:f}]})));return{graph:mr({version:1,...o.scope?{scope:o.scope}:{},nodes:d,relations:o.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(d.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:o.activities.map(c=>c.id),objectStateTransitions:u,findings:o.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(r=>s.find(f=>f.id===r)?.name??r)}))}}const Or=8*1024*1024;function Cr(e){return/^\s*[\[{]/.test(e)}function xo(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function zs(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");xo(e);const n=Si(e),i=e.documents.filter(s=>s.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Jd(e,t){if(!Cr(e)){if(t!==void 0)throw Error("案を含まない文書です。");return Gd(e)}if(new TextEncoder().encode(e).byteLength>Or)throw Error("ローカルJSONは8MiB以内にしてください。");let n=fr(e.replace(/^\uFEFF/,""));xo(n);let i;if(n?.format==="alder-named-plans"){Wd(n);for(const a of n.plans)if(xo(a.package),a.package.documents.filter(d=>d.kind==="businessDesign").length!==1)throw Error("業務案 "+a.id+" にはBusiness Designが1件必要です。");const o=t??n.plans[0].id,s=n.plans.find(a=>a.id===o);if(!s)throw Error("指定した業務案がありません: "+o);i={selected:o,choices:n.plans.map(({id:a,name:d})=>({id:a,name:d}))},n=s.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const o=zs(Ar(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const s=o.data.business;s.schemaVersion="0.1",delete s.roles;for(const a of s.activities)delete a.roleId;o.data.diagnostics=o.data.diagnostics.filter(a=>!a.startsWith("Role未確定:"))}return{...o,...i?{namedPlans:i}:{}}}return{...zs(n,e),...i?{namedPlans:i}:{}}}function Gt(e,t){return Hd(Jd(e,t))}async function _d(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>Or)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Cr(n))throw Error("JSONファイルの本文を確認してください。");return Gt(n)}const Kd=(e,t)=>Go(e,t,!1);async function Go(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,s=()=>o.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const a=setTimeout(s,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const u=d.headers.get("content-type")?.toLowerCase()??"";if(u.includes("html")||!n&&u.includes("json")||u.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const c=2*1024*1024;if(Number(d.headers.get("content-length"))>c)throw Error("本文は2MiB以内にしてください。");const r=d.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,l="";const b=new TextDecoder;try{for(;;){const{done:g,value:p}=await r.read();if(g)break;if(f+=p.length,f>c){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}l+=b.decode(p,{stream:!0})}l+=b.decode()}finally{r.releaseLock()}if(n&&u.includes("json")&&!/^\s*[\[{]/.test(l))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(l))throw Error("HTMLページは読み込めません。");return l}catch(d){const u=o.signal.aborted;throw s(),u?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(a),t?.removeEventListener("abort",s)}}const Oi=_d;async function qi(e,t){return Gt(await Go(e,t))}function Xd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return Gt(e)}const Wi=e=>e==="question"?"要確認":"要修正";function Zd(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===i&&s.targets.includes(t.id)).length;o&&n.push(`${Wi(i)} ${o}`)}return n}function Yd(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Wi(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(hn(e.content)),t}function Qd(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function el(e,t,n){const i=document.createElement("nav");i.className="drawer-findings",i.setAttribute("aria-label","関連する指摘");for(const o of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=o.id,s.textContent=`${Wi(o.kind)} · ${o.displayId??o.id}　${o.summary}`,s.onclick=()=>n({type:"finding",id:o.id}),i.append(s)}return i}function tl(e,t,n,i,o){const s=document.createElement("section");s.className="findings-index";const a=document.createElement("label");a.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),a.append(d,document.createTextNode("解消済みも表示")),s.append(a);const u=(r,f,l)=>{const b=document.createElement("button");b.className="node-navigate finding-index-row",b.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const p=document.createElement("span");return p.textContent=l,b.append(g,p),b.onclick=()=>i(r),b},c=e.graph.nodes.filter(r=>(!o||r.id===o)&&typeof r.problem=="string");if(c.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of c)s.append(u({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const l=(e.findings??[]).filter(g=>(!o||g.targets.includes(o))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!l.length)continue;const b=document.createElement("h3");b.textContent=`${f}（${l.length}件）`,s.append(b);for(const g of l)s.append(u({type:"finding",id:g.id},`${Wi(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function nl(e){const t=br(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((s,a)=>s===o[a]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...ya(),viewInset:[40,0],canvasOrigin:void 0}}function il(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,s)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(s)}),n}function Ho(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function ol(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Ho(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function sl(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Ho(t)),n.href}function rl(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Ho(t)}const Jo=`# Alderを使った設計業務 — Business Design

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
`,al=`{
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
`;function cl(e,t){const n=new Set(t.graph.nodes.map(l=>l.id)),i=new Map;for(const l of t.graph.nodes)i.set(l.name,i.has(l.name)?void 0:l.id);const o=l=>n.has(l)?l:i.get(l),s=Object.create(null);for(const[l,b]of Object.entries(e.positions)){const g=o(l);g&&(s[g]=b)}const{scroll:a,zoom:d,viewInset:u,canvasOrigin:c,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:a,zoom:d,viewInset:u,canvasOrigin:c,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(l=>{const b=o(l);return b?[b]:[]}))]}}}const dl=`# Alderのチェックリストサンプル

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
`;function ll(e,t,n,i,o=()=>!0,s=()=>{}){const a=e.ownerDocument,d=a.defaultView;let u,c=0,r=0,f=!1,l=null,b="";const g=new Map,p=()=>{u!==void 0&&(d.clearTimeout(u),c=Math.max(0,c-(Date.now()-r)),u=void 0)},m=(v=!1)=>{if(v&&!o())return;p(),g.delete(b);const M=[...g].at(-1);if(M){j(M[1],"error",M[0]);return}const k=e.contains(a.activeElement);e.hidden=!0,t.textContent="",s(),k&&(l?.isConnected?l:i).focus({preventScroll:!0})},I=()=>{e.hidden||e.dataset.kind==="error"||f||a.hidden||e.contains(a.activeElement)||(p(),r=Date.now(),u=d.setTimeout(m,c))};e.addEventListener("pointerenter",()=>{f=!0,p()}),e.addEventListener("pointerleave",()=>{f=!1,I()}),e.addEventListener("focusin",v=>{const M=v.relatedTarget;M&&!e.contains(M)&&(l=M),p()}),e.addEventListener("focusout",()=>d.setTimeout(I,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),m(!0))}),a.addEventListener("visibilitychange",()=>a.hidden?p():I()),n.onclick=()=>m(!0);const j=(v,M,k)=>{p(),e.contains(a.activeElement)||(l=a.activeElement),b=k,e.dataset.kind=M,e.dataset.key=k,t.setAttribute("role",M==="error"?"alert":"status"),t.setAttribute("aria-live",M==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,s(),c=M==="warning"?8e3:5e3,I()};return(v,M="success",k="operation")=>{M==="error"&&v?(g.delete(k),g.set(k,v)):g.delete(k);const O=[...g].at(-1);if(O){if(!e.hidden&&t.textContent===O[1]&&b===O[0])return;j(O[1],"error",O[0]);return}if(!v){b===k&&m();return}!e.hidden&&t.textContent===v&&e.dataset.kind===M||j(v,M,k)}}const Us=al,mt=document.querySelector("#app");mt.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Pe;const w=e=>document.getElementById(e),An=gr(location.pathname);An.version&&(w("preview-badge").hidden=!1,w("preview-badge").textContent=`確認用 · ${An.version}`,w("preview-badge").title=`PR #${An.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const Jn=e=>Dn(e,{"stroke-width":1.8,"aria-hidden":"true"}),Qn=document.createElement("div");Qn.id="source-menu";Qn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';mt.append(Qn);const zi=document.createElement("div");zi.id="checks-menu";zi.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';mt.append(zi);const bn=document.createElement("section");bn.id="check-followup";bn.hidden=!0;bn.setAttribute("aria-labelledby","check-followup-title");bn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(bn);const Ui=document.createElement("div");Ui.id="check-followup-menu";Ui.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';mt.append(Ui);const Mt=document.createElement("input");Mt.type="file";Mt.id="check-file";Mt.accept=".md,.markdown,text/markdown,text/plain";Mt.hidden=!0;mt.append(Mt);const Ht=document.createElement("section");Ht.id="check-url-dialog";Ht.hidden=!0;Ht.setAttribute("role","dialog");Ht.setAttribute("aria-labelledby","check-url-title");Ht.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';mt.append(Ht);const $i=document.createElement("div");$i.id="help-menu";$i.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${An.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${An.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${An.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;mt.append($i);Ti(w("help-menu-toggle"),$i);const $n=document.createElement("div");$n.id="url-history";Qn.append($n);function ul(){if($n.replaceChildren(),!A.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",$n.append(e);for(const t of A.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=ie||Oe||oe,n.onclick=()=>{fl(t.url)},$n.append(n)}}async function fl(e){if(!(ie||Oe||oe)){if(A.document?.source?.kind==="url"&&A.document.source.url===e){pe(),Pe?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),ii();return}Oe=!0,Ie();try{const t=await qi(e),n=Rn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await ei(n)}catch(t){t instanceof yn||De("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Oe=!1,Ie()}}}const pl=Ti(w("open-menu-toggle"),Qn),ml=Ti(w("open-checks"),zi,()=>{const e=X();w("check-open-sample").hidden=!e||!Yo(e),w("check-close").disabled=!e?.checks}),jr=Ti(w("check-followup-open"),Ui,()=>{w("check-followup-sample").hidden=!X()||!Yo(X())});for(const[e,t]of[["open-menu-toggle",gs],["open",gs],["open-url",va],["open-text",wa],["view-markdown",ka],["open-checks",_s],["share-source",Ia],["refresh",Sa],["help-menu-toggle",xa],["drawer",Aa],["node-list-toggle",Ea],["node-list-close",Ks],["display-settings-toggle",Xs],["reset-layout",Oa],["save-image",Ca],["copy-image",ja],["out",Qs],["in",er]])w(e).prepend(Jn(t));kd(document.querySelector("header"));const Ao=wd(document.querySelector(".tab-strip"));let A={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},vt=!0,zt=!1,ie=!0,Mn=!1,pn=!1,Oe=!1,$s=Promise.resolve(),tn,fe,wt=0,oe=!1,Fn=!1,En=0,Ci=0,On=!1,_o=!1,Eo=!1,Fs=!1;const Oo=new Set,Ut=new Set,ji=new Set;function Mr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of ji){const i=[...A.document?[A.document]:[],...A.recovery].find(s=>s.key===n),o=t.find(s=>s.key===n&&s.draft===i?.draft);i&&o&&ji.delete(n)}}const X=()=>A.tabs.find(e=>e.key===A.active),gn=e=>Ft(e)?.key??e.key,Vt=e=>A.document?.key===gn(e);let Co="";const hl=ll(w("status"),w("status-text"),w("status-close"),w("viewport"));function De(e,t="success",n="operation"){if(n==="storage"){if(Co===e)return;Co=e}hl(e,t,n)}function Ko(){De("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Xo(){De("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Rt(){ie||(wt++,Je())}function bl(e){e.preventDefault(),e.returnValue=!0}function Je(){const e=wt>En||Ci>0||!1||oe||ji.size>0||Eo||On||pn,t=!ie&&e;t!==Fs&&(Fs=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",bl));const n=ie?"restoring":Mn?"protected":pn?"conflict":On?"error":Eo||ji.size>0?"draft":Ci>0||oe?"saving":wt>En?"dirty":_o?"saved":"unchanged";mt.dataset.saveState!==n&&(mt.dataset.saveState=n),Mn?Ko():pn?Xo():On?De("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):De("","success","storage"),Vi()}function Zo(e){On=!0,Co=""}function Fi(){if(Mn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(pn)throw new Vo}async function gl(e){Fi();try{await ed(e)}catch(t){throw t instanceof Vo&&(pn=!0,clearTimeout(tn),tn=void 0,Xo()),t}}function Lr(e,t){Ci++,Oo.add(t),Je();const n=$s.catch(()=>{}).then(()=>gl(e)).then(()=>{En=Math.max(En,t),_o=!0,Mr(e),En===wt&&(On=!1)},i=>{throw Zo(),i}).finally(()=>{Ci--,Oo.delete(t),Je()});return $s=n.catch(()=>{}),n}function be(e=180,t=!0){if(ie)return;if(t&&wt++,clearTimeout(tn),tn=void 0,Mn){Ko(),Je();return}if(pn){Xo(),Je();return}if(oe||Oo.has(wt)||!t&&wt<=En&&!On){Je();return}const n=()=>{tn=void 0;let i;try{i=structuredClone(Bo(A))}catch{Zo(),Je();return}Lr(i,wt).catch(()=>Je())};e===0?n():tn=window.setTimeout(n,e),Je()}async function yl(e){if(ie||fe||oe||!A.tabs.includes(e))return;if(Bn(e)===void 0){Pe?.closeBusinessOverview();return}st.cancel(),pe();const t=A.active===e.key,n={...A,tabs:A.tabs.filter(i=>i!==e),active:t?A.tabs[0]?.key:A.active};try{await ti(()=>n,()=>{A=n}),t&&mt.dataset.workspaceArea==="business"&&Pe?.businessActivated()}catch{Je()}}function tt(){w("drawer").setAttribute("aria-label","業務内容開閉"),w("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!X(),t=e&&A.drawer,n=e&&!!A.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(zt=!1),Vi(),w("layout-lock").replaceChildren(Jn(vt?Zs:Ys)),w("layout-lock").setAttribute("aria-pressed",String(vt)),w("layout-lock").title=vt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",w("layout-lock").toggleAttribute("disabled",ie),w("viewport").dataset.layoutLocked=String(vt),w("prefer-write").checked=A.preferWrite===!0,w("prefer-write").disabled=ie,w("show-exceptions").checked=X()?.showExceptions!==!1,w("show-exceptions").disabled=ie||oe||!X()||fe===X(),w("selected-edges-only").checked=X()?.selectedEdgesOnly===!0,w("selected-edges-only").disabled=ie||oe||!X()||fe===X(),document.documentElement.dataset.theme=A.dark?"dark":"light",w("theme").replaceChildren(Jn(A.dark?Pa:Ta)),w("formattedMarkdownDrawer").hidden=!t,w("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(A.width,innerWidth*.65))+"px",w("drawer").setAttribute("aria-expanded",String(t)),w("drawer").toggleAttribute("disabled",ie||!e),w("node-list-drawer").hidden=!n||nt().mode!=="findings",w("node-list-toggle").setAttribute("aria-expanded",String(n)),w("node-list-toggle").toggleAttribute("disabled",ie||!e),Pe?.syncChrome()}function jo(){for(const e of["save-image","copy-image"]){const t=w(e);t.hidden=!X(),t.disabled=Fn||ie||!X()||fe===X(),t.setAttribute("aria-busy",String(Fn))}}function Vi(){jo(),document.querySelector(".toolbar").dataset.settingsOpen=String(zt),w("display-options").hidden=!zt,w("reset-layout").disabled=ie||Oe||oe||!1||!X()||Ut.has(A.document?.key??"")||Mn||pn;const e=w("display-settings-toggle"),t=zt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(zt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ie||oe||!X()||fe===X()}function Dr(e,t=!1){const n=X();ie||oe||!n||fe===n||e===zt||(e&&(Ln.delete(Ft(n)?.key??n.key),Bi()),st.cancel(),Le=void 0,pe(),zt=e,Vi(),Dt(n),!e&&(t||w("display-options").contains(document.activeElement))&&w("display-settings-toggle").focus({preventScroll:!0}))}async function Rr(e){const t=X();if(!(Fn||ie||!t||fe===t)){Fn=!0,jo();try{const n=jd(w("nodes"),w("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Dd(n),De("グラフ全体のPNGをコピーしました。")):await Ld(n,(Ft(t)?.name??t.name)+(Bn(t)?" - "+Bn(t):""))}catch(n){De((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{Fn=!1,jo()}}}w("save-image").onclick=()=>Rr(!1);w("copy-image").onclick=()=>Rr(!0);w("display-settings-toggle").onclick=()=>Dr(!zt);w("reset-layout").onclick=()=>{const e=X();if(ie||Oe||oe||fe||!e||Ut.has(gn(e)))return;try{Fi()}catch{Je();return}st.cancel(),Qt.cancel(),Le=void 0,pe();const t={...e,design:Ni(e)},n=nl(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),zr.invalidate(e),Ie(),n!==t&&be()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&zt&&w("source-dialog").hidden&&(e.preventDefault(),Dr(!1,!0))});function pe(e=!0){const t=X();if(!t)return!1;const n=[w("viewport").scrollLeft,w("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Rt(),be(180,!1)),i}function Nr(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function Mo(){pl.close(),ml.close(),jr.close(),Ao.close(),Nr(vl),Ao.update()}function vl(){const e=w("tabs");e.replaceChildren(),A.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===A.active?" active":""),n.draggable=Bn(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Ai(t)!==void 0&&(n.dataset.activity=Ai(t)),Ei(t)!==void 0&&(n.dataset.object=Ei(t));const i=document.createElement("button");ho(i,"business",t.name),i.setAttribute("aria-current",String(t.key===A.active)),i.disabled=oe,i.onclick=async()=>{if(oe||kt&&kt!==t.key&&!await ni())return;const s=pe()||A.active!==t.key;Pe?.activateBusiness(),A.active=t.key,Ie(),Pe?.businessActivated(),be(180,s)};const o=bo("業務設計："+t.name+"を閉じる");o.disabled=oe,o.onclick=()=>yl(t),n.append(i,o),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),oe)return;const a=A.tabs.findIndex(u=>u.key===s.dataTransfer?.getData("text/plain")),d=A.tabs.indexOf(t);if(a>0&&d>0&&a!==d){const[u]=A.tabs.splice(a,1);A.tabs.splice(d,0,u),Mo(),be()}},n.onkeydown=s=>{if(!oe&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const a=A.tabs.indexOf(t),d=a+(s.key==="ArrowLeft"?-1:1);a>0&&d>0&&d<A.tabs.length&&([A.tabs[a],A.tabs[d]]=[A.tabs[d],A.tabs[a]],Mo(),be())}},e.append(n)})}const Vs=new Map,Ln=new Set;function Bi(){const e=X(),t=!!e&&e.design.sourceFormat!=="json"&&Ln.has(Ft(e)?.key??e.key)&&!e.checks;t||(jr.close(),bn.contains(document.activeElement)&&w("viewport").focus({preventScroll:!0})),bn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])w(n).disabled=ie||Oe||oe||!1||!e||sn(e).busy===!0}w("check-followup-later").onclick=()=>{const e=X();e&&Ln.delete(Ft(e)?.key??e.key),Bi()};let Lo;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])w("check-followup-"+e).onclick=()=>{Lo=w("check-followup-open"),w(t).click(),Lo=void 0};function Yo(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Jo}function sn(e){const t=Ft(e)?.key??e.key;let n=Vs.get(t);return n||(n={},Vs.set(t,n)),n}async function Qo(e,t){if(!Vt(e))throw Error("原本文書が切り替わりました。");const n=jt(A,A.recovery,{...A.document,checks:t},Bo(A).views);await ti(()=>n,()=>{A=n,t&&Ln.delete(Ft(e)?.key??e.key)})}async function Pr(e,t){const n=sn(e);if(e.design.sourceFormat==="json"||n.busy||oe||ie||fe===e)return;const i=Gn(e);n.busy=!0,n.error=void 0,n.candidate=void 0,Bt();try{const o=await t();if(!Vt(e))return;if(i!==Gn(A.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=jn(o),a=Hn(s,A.tabs[0]);if(a.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+a.reason);a.state==="unverified"?n.candidate=o:(await Qo(e,o),n.candidate=void 0,Pe?.openRelatedChecks(X()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,De(n.error,"error")}finally{n.busy=!1,Bt()}}async function Tr(e,t){const n=sn(e);if(n.busy||oe||!Vt(e))return;const i=Hn(jn(t),A.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,Bt();return}n.busy=!0,n.error=void 0;try{await Qo(e,{...t,confirmedFor:Gn(A.tabs[0])}),n.candidate=void 0,Pe?.openRelatedChecks(X()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,Bt()}}function Bt(){Bi();const e=X(),t=w("detail"),n=e?sn(e):void 0,i=e?e.key+":"+(e.selected??""):"";w("open-checks").disabled=ie||oe||fe===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const a=e.design.graph.nodes.find(f=>f.id===e.selected),d=vd(e,n,{disabled:ie||oe||fe===e,redraw:Bt,confirm:f=>{Tr(e,f)}}),u=document.createElement("div");u.className="right-drawer-heading";const c=oc(a?.name??"業務設計");if(a){const f=a.type==="business"?qr(String(a.who),a.id):ar(a);f.classList.add("drawer-node-icon"),c.prepend(f)}u.append(c);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{w("drawer").click(),w("drawer").focus({preventScroll:!0})},u.append(r),t.append(u),d.hasChildNodes()&&t.append(d),a){const f=el(e.design,a.id,es);f.hasChildNodes()&&t.append(f)}t.append(Nc(e.design,a?.id)),a?.type==="business"&&Pe?.appendActivityTestLinks(t,a.id),t.scrollTop=s,o&&document.getElementById(o)?.focus({preventScroll:!0})}const Bs=new Map,nt=()=>{const e=A.active??"";let t=Bs.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Bs.set(e,t)),t};function es(e){if(!X())return;const t=nt();t.mode="findings",t.finding=e,A.nodeDrawer=!0,innerWidth<=800&&(A.drawer=!1),tt(),pt(),w("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),be()}function wl(e){const t=X();if(!t)return;const n=nt();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){es(i[0]);return}A.nodeDrawer=!0,innerWidth<=800&&(A.drawer=!1),tt(),pt(),w("drawer-mode-findings").focus({preventScroll:!0}),be()}function kl(e,t){const n=nt().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return nt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{nt().finding=void 0,pt(),w("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),i)t.append(Yd(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,hn(String(o.problem)))}const a=i?.targets??[o.id];if(a.length){const d=document.createElement("section"),u=document.createElement("h3");u.textContent="関連項目へ移動",d.append(u);for(const c of a){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=c;const f=e.design.graph.nodes.some(b=>b.id===c),l=e.hiddenNodes?.includes(c);r.disabled=!f||!!l,r.textContent=(e.design.graph.nodes.find(b=>b.id===c)?.name??c)+(f?l?"（非表示）":"":"（参照先なし）"),r.onclick=()=>yi(c,!0),d.append(r)}t.append(d)}return!0}function qr(e,t){let n=0;for(const o of e)n=n*31+o.codePointAt(0)>>>0;const i=document.createElement("span");return i.className="who-badge",i.style.setProperty("--role-color",(t&&X()?.design.model?.business.roles?Uo(X().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true"),i.append(Jn(ir)),i}function Gi(e,t=!0){ie||!X()||(st.cancel(),pe(),A.nodeDrawer=e,e&&nt().mode==="findings"&&innerWidth<=800&&(A.drawer=!1),tt(),e&&X()?.selected&&Nn(X().selected),pt(),t&&w(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),be())}function Nn(e){const t=X(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=nt();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(ic(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(w("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function Il(e,t){const n=X();if(!n||ie||oe||fe===n)return;st.cancel(),Le=void 0,pe();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],rn(),be()}function yi(e,t=!1){let n=X();if(n&&!Ni(n).graph.nodes.some(f=>f.id===e)&&(pe(),Pe?.reopenBusinessOverview(),A.active=A.tabs[0].key,n=X(),Ie()),!n||n.hiddenNodes?.includes(e)||fe===n)return;t||(nt().finding=void 0);const i=w("node-list").contains(document.activeElement);st.cancel(),Le=void 0,pe(),n.selected=e,Nn(e),tt(),rn();const o=w("viewport"),s=o.getBoundingClientRect(),a=w("formattedMarkdownDrawer").getBoundingClientRect(),d=A.drawer&&a.left>s.left&&a.left<s.right?a.left:s.right,u=Math.max(1,Math.min(o.clientWidth,d-s.left-o.clientLeft)),c=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-u/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-c/2],Dt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],pe(),i){const f=t?"[data-finding-target]":"[data-list-node]",l=Array.from(w("node-list").querySelectorAll(f)).find(b=>(t?b.dataset.findingTarget:b.dataset.listNode)===e);(t?l:l?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}be()}function pt(){const e=X(),t=nt(),n=w("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const s=w("drawer-modes");s.replaceChildren();for(const g of["findings"]){const p=document.createElement("button");p.id="drawer-mode-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.mode===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.mode===g?0:-1,p.textContent=`指摘（${e?Qd(e.design):0}）`;const m=()=>{t.mode=g,pt(),w("drawer-mode-"+g).focus({preventScroll:!0})};p.onclick=m,p.onkeydown=I=>{["ArrowLeft","ArrowRight","Home","End"].includes(I.key)&&(I.preventDefault(),p.focus({preventScroll:!0}))},s.append(p)}for(const g of[w("node-categories"),w("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const a=w("node-list-search");a.value=t.search,a.disabled=!e||ie;const d=w("node-categories");d.replaceChildren();for(const[g,p]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const m=document.createElement("button");m.dataset.category=g,m.id="node-category-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.category===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.category===g?0:-1,m.textContent=p,m.onclick=()=>{t.category=g,pt(),w("node-category-"+g).focus({preventScroll:!0})},m.onkeydown=I=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(I.key))return;I.preventDefault();const j=["activity","object","role"],v=j.indexOf(g);t.category=I.key==="Home"?"activity":I.key==="End"?"role":j[(v+(I.key==="ArrowRight"?1:2))%3],pt(),w("node-category-"+t.category).focus({preventScroll:!0})},d.append(m)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const u=new Set(e?.hiddenNodes??[]),c=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=c.filter(g=>!u.has(g.id)).length,f=w("scope-outside"),l=r===c.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",l),f.setAttribute("aria-label",l==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(Jn(l==="false"?qa:Wa)),f.disabled=!c.length||ie||fe===e;const b=w("show-outside");if(b.checked=l==="true",b.indeterminate=l==="mixed",b.setAttribute("aria-checked",l),b.disabled=f.disabled,w("scope-count").textContent=l==="mixed"?`${r}/${c.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(kl(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(m=>m.id===t.filterNode)?.name??t.filterNode)+"の指摘";const p=document.createElement("button");p.className="node-navigate finding-all",p.textContent="すべての指摘",p.onclick=()=>{t.filterNode=void 0,pt(),w("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,p)}n.append(tl(e.design,t.resolved,g=>{t.resolved=g,pt(),n.querySelector("input")?.focus({preventScroll:!0})},es,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}w("node-list-toggle").onclick=()=>Gi(!A.nodeDrawer);w("node-list-close").onclick=()=>Gi(!1);w("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Gi(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!w("node-list-drawer").hidden&&w("source-dialog").hidden&&(e.preventDefault(),Gi(!1))});w("node-list-search").oninput=()=>{nt().search=w("node-list-search").value,pt()};function Wr(){const e=X();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);Il(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}w("scope-outside").onclick=Wr;w("show-outside").onchange=Wr;const Sl="http://www.w3.org/2000/svg",lo=e=>document.createElementNS(Sl,e),zr=new wo,Gs=new WeakMap;function xl(e){if(!rr(e.graph))return;let t=Gs.get(e);return t||(t=Yc(e),Gs.set(e,t)),t.wires}function Al(e,t,n){Wo(w("edges"),e,t,{"data-relation":String(n)})}let _n=()=>{},Wt=[0,0],Yt=[0,0];function El(){const e=w("node-list-drawer");return w("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function Ol(){const e=w("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Dt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(f=>f[0])),Math.min(0,...i.map(f=>f[1]))],s=[o[0]<0||n[0]>0?Math.min(o[0],Yt[0]):0,o[1]<0||n[1]>0?Math.min(o[1],Yt[1]):0],{growth:a,origin:d}=Na(n,s,e.zoom),u=a.some(Boolean);u&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+a[0],e.scroll[1]+a[1]],Rt(),be(180,!1));const c=Math.ceil(Math.max(1400,Wt[0],(El()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(f=>f[0]+340))),r=Math.max(850,Wt[1],Math.max(Wt[1],...i.map(f=>f[1]+68))+Ol()/e.zoom-t[1],(w("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(f=>f[1]+220));w("canvas").style.width=(c+d[0]+t[0]*2)*e.zoom+"px",w("canvas").style.height=(r+d[1]+t[1]*2)*e.zoom+"px",w("nodes").style.left=(d[0]+t[0])*e.zoom+"px",w("nodes").style.top=(d[1]+t[1])*e.zoom+"px",w("edges").style.left=t[0]*e.zoom+"px",w("edges").style.top=t[1]*e.zoom+"px",w("nodes").style.width=c+"px",w("nodes").style.height=r+"px",w("nodes").style.transform=`scale(${e.zoom})`,w("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${c+d[0]} ${r+d[1]}`),w("edges").style.width=(c+d[0])*e.zoom+"px",w("edges").style.height=(r+d[1])*e.zoom+"px",u&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("zoom").textContent=Math.round(e.zoom*100)+"%"}function rn(){Nr(Cl)}function Cl(){Vi(),Qt.cancel(),_n=()=>{},Wt=[0,0],Yt=[0,0];const e=X();if(w("nodes").replaceChildren(),w("edges").replaceChildren(),w("empty").hidden=!!e,w("canvas").hidden=!e,!e){w("viewport").scrollLeft=0,w("viewport").scrollTop=0,Bt(),pt();return}const t=Ni(e),n=t.graph.nodes,i=n.filter(r=>!e.hiddenNodes?.includes(r.id)),o=new Set(i.map(r=>r.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const s=e.selected,a=e.positions,d=ki(t.graph.relations,s);Dt(e),w("edges").append(qo());const u=il(t.graph.relations,A.preferWrite===!0),c=()=>{const r=n.flatMap(m=>{const I=a[m.id];return I?[{id:m.id,x:I[0],y:I[1],width:260,height:68}]:[]}),f=xl(t),l=zr.update(e,t,r,t.graph.relations,f),b=new Map;for(Wt=[0,0],Yt=[0,0];w("edges").childNodes.length>1;)w("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(m=>[m.id,m.name]));t.graph.relations.forEach((m,I)=>{if(u.has(I))return;const j=l[I];if(!j||(Wt[0]=Math.max(Wt[0],j.bounds.right+20,j.label[0]+Math.max(30,m.label.length*12)/2+12),Wt[1]=Math.max(Wt[1],j.bounds.bottom+20,j.label[1]+22),Yt[0]=Math.min(Yt[0],...j.points.map(R=>R[0]-20),j.label[0]-Math.max(30,m.label.length*12)/2-12),Yt[1]=Math.min(Yt[1],...j.points.map(R=>R[1]-20),j.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(m)||!o.has(m.from)||!o.has(m.to)||e.showExceptions===!1&&(m.kind==="business-exception"||m.kind==="object-exception")))return;const v=lo("path");v.setAttribute("d",j.path),v.dataset.relation=String(I),v.dataset.collisions=String(j.collisions),v.dataset.rerouted=String(j.rerouted),v.dataset.fallback=String(j.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),m.kind.endsWith("exception")&&v.classList.add("exception"),d.related(m)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),d.muted(m)&&v.classList.add("muted");const M=lo("title");M.textContent=(g.get(m.from)??m.from)+" → "+(g.get(m.to)??m.to)+": "+m.label,v.append(M),w("edges").append(v),m.kind.endsWith("exception")&&Al(v,j,I);const k=sr(m,I,f?.[I]),O=b.get(k);if(O){O.dataset.relations+=" "+I,d.related(m)&&(O.classList.add("review-related"),O.classList.remove("muted"));return}const D=lo("text");b.set(k,D),D.dataset.relations=String(I),D.setAttribute("x",String(j.label[0]-Math.max(30,m.label.length*12)/2)),D.setAttribute("y",String(j.label[1])),D.setAttribute("text-anchor","start"),D.classList.add("edge-label"),D.setAttribute("dominant-baseline","middle"),D.dataset.relation=String(I),d.related(m)&&D.classList.add("review-related"),d.muted(m)&&D.classList.add("muted"),D.textContent=m.label,w("edges").append(D)});const p=w("edges");for(const m of[...Array.from(p.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(p.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(p.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(p.querySelectorAll(".edge-label.review-related"))])p.append(m);Dt(e)};_n=c,c(),i.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+d.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=a[r.id][0]+"px",f.style.top=a[r.id][1]+"px",r.type==="business"?f.append(qr(String(r.who),r.id)):f.append(ar(r));const l=document.createElement("span");l.className="node-text";const b=document.createElement("span");b.className="review-kind",b.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),l.append(b);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,l.append(g),r.type==="business"){const v=document.createElement("small");v.textContent=String(r.who),l.append(v)}if(f.append(l),za(r.id,Bn(e))){const v=document.createElement("button");v.type="button",v.className=r.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",r.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),r.type==="business"?Do(r.id):Ur(r.id),Pe?.businessActivated()},f.append(v)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const p=Zd(e.design,r);if(p.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=p.join(" · "),v.setAttribute("aria-label",r.name+"の指摘を開く"),v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),wl(r.id)},f.append(v),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+p.join("、"))}let m;const I=f;I.onpointerdown=v=>{v.button!==0||fe===e||vt||(v.stopPropagation(),I.setPointerCapture(v.pointerId),m=v.pointerId,Qt.begin(r.id,[v.clientX,v.clientY]))},I.onpointermove=v=>{m===void 0||v.pointerId!==void 0&&v.pointerId!==m||!f.isConnected||fe===e||Qt.move([v.clientX,v.clientY])},I.onpointerup=v=>{if(m===void 0||m!==v.pointerId||(m=void 0,!f.isConnected||fe===e))return;const M=Qt.end();I.hasPointerCapture?.(v.pointerId)&&I.releasePointerCapture(v.pointerId),M&&(M.moved||(nt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Rt()),Nn(r.id)),pe(),rn(),be(180,!1))};const j=v=>{m===void 0||m!==v.pointerId||(m=void 0,f.isConnected&&(Qt.cancel(),pe(),be(180,!1)))};I.onpointercancel=j,I.onlostpointercapture=j,w("nodes").append(f)}),w("zoom").textContent=Math.round(e.zoom*100)+"%",Bt(),pt()}function Do(e){ie||oe||fe||(pe(),dd(A,e),Ie(),be(),w("viewport").focus({preventScroll:!0}))}function Ur(e){ie||oe||fe||(pe(),ld(A,e),Ie(),be(),w("viewport").focus({preventScroll:!0}))}function Ie(){$r(),document.title=A.document?A.document.name+" · Alder Viewer":"Alder Viewer",st.cancel(),Le=void 0,tt(),Mo(),rn();const e=X();e&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("refresh").toggleAttribute("disabled",ie||oe||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Ut.has(gn(e))),w("refresh").hidden=!e,w("view-markdown").toggleAttribute("disabled",ie||Oe||oe||!1||!e||Ut.has(gn(e))),w("view-markdown").hidden=!e,w("open-checks").hidden=!e||e.design.sourceFormat==="json",w("open-checks").toggleAttribute("disabled",ie||Oe||oe||!1||!e||!!(e&&sn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])w(t).toggleAttribute("disabled",ie||Oe||oe);w("open-sample").setAttribute("aria-disabled",String(ie||Oe||oe)),w("open-sample").tabIndex=ie||Oe||oe?-1:0,w("theme").toggleAttribute("disabled",ie),Zn(),Bi(),ul(),_i(),Pe?.syncDocument()}function $r(){const e=w("header-title"),t=A.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{jl(n.value)},e.append(n));const i=Array.from(n.options).map(o=>[o.value,o.textContent]);JSON.stringify(i)!==JSON.stringify(t.choices.map(({id:o,name:s})=>[o,s]))&&n.replaceChildren(...t.choices.map(({id:o,name:s})=>{const a=document.createElement("option");return a.value=o,a.textContent=s,a})),n.value=t.selected,n.title=t.choices.find(o=>o.id===t.selected)?.name??"",n.disabled=ie||Oe||oe||!1}async function jl(e){const t=A.document;if(!t?.design.namedPlans||ie||Oe||oe||fe||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),i=document.activeElement===n;try{if(!w("source-dialog").hidden&&!await ni()){$r();return}const o=Gt(t.design.markdown,e),s=crypto.randomUUID(),a=jt({...A,tabs:[],active:s},A.recovery,{...t,design:o},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await ti(()=>a,()=>{A=a}),Pe?.reopenBusinessOverview(),Pe?.activateBusiness(),Pe?.businessActivated(),De("")}catch(o){Ie(),o instanceof yn||De("案を切り替えられません: "+o.message,"error")}finally{i&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function ei(e){const t=A.document,n=ad(A,e);return t?(await ti(()=>n,()=>{A=n,Ln.add(Ft(A.tabs[0])?.key??A.tabs[0].key)}),!0):(pe(),A=n,Ln.add(Ft(A.tabs[0])?.key??A.tabs[0].key),Ie(),be(),!0)}async function Fr(e,t){if(kt&&!await ni())return;const n=await Oi(e),i=X();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await Kn(i,n,t))return;Pe?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),be();return}const o=Rn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await ei(o)}w("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])w("guide-"+e).onclick=()=>w(e).click();w("open-sample").onpointerdown=e=>e.stopPropagation();w("open-sample").onclick=async e=>{if(e.preventDefault(),!(ie||Oe||oe))try{if(A.document?.source?.kind==="sample"&&A.document.design.markdown===Us){pe(),Pe?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),w("viewport").focus({preventScroll:!0});return}const t=Gt(Us),n=A.document?.source?.kind==="sample"&&A.document.design.markdown===Jo?A.tabs[0]:void 0;n&&pe();const i=n??A.sampleLayout,o=i?cl(i,t):{},s=Rn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await ei(s)&&w("viewport").focus({preventScroll:!0})}catch(t){De("サンプルを開けません: "+t.message,"error")}};w("open").onclick=async()=>{if(!(ie||Oe||oe)){Oe=!0,Ie();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Fr(await n.getFile(),n)}else w("fallback").click()}catch(e){e.name!=="AbortError"&&De("開けません: "+e.message,"error")}finally{Oe=!1,Ie()}}};w("fallback").onchange=async()=>{const e=w("fallback");if(!(ie||Oe||oe)){Oe=!0,Ie();try{for(const t of Array.from(e.files??[]))await Fr(t)}catch(t){De("開けません: "+t.message,"error")}e.value="",Oe=!1,Ie()}};class yn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function ti(e,t){if(oe||fe)throw Error("表示を切り替えています。完了後に再試行してください。");try{Fi()}catch(o){throw new yn(o)}pe(),clearTimeout(tn),tn=void 0,oe=!0,wt++;const n=wt;Ie(),Je();let i=!1;try{const o=structuredClone(Bo(e()));await Lr(o,n);const s=A;t(),A!==s&&(A=ud(A,s)),et==="view"&&kt&&!A.tabs.some(a=>a.key===kt)&&(kt=A.tabs[0]?.key),Mr(o),i=!0}catch(o){throw Zo(),new yn(o)}finally{oe=!1,Ie(),Je(),i&&wt!==n&&be(0,!1)}}async function Kn(e,t,n=e.handle,i=!1){if(!Vt(e)||e.design!==A.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=Gt(t.markdown,e.design.namedPlans.selected));const o=!!e.design.namedPlans!=!!t.namedPlans,s=crypto.randomUUID(),a=A.document,d=o&&a?jt({...A,tabs:[],active:s},A.recovery,{...a,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):cd(A,t,n,i);return await ti(()=>d,()=>{A=d}),mn=void 0,_i(),De(""),!0}async function Hs(e){if(!Vt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await Kn(e,await Oi(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const s=()=>{o.remove(),n()};o.oncancel=s,o.onchange=async()=>{try{const a=o.files?.[0];a&&await Kn(e,await Oi(a)),s()}catch(a){o.remove(),i(a)}},o.click()})}w("refresh").onclick=async()=>{const e=X();if(ie||oe||fe||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Ut.has(gn(e)))return;kt===e.key&&Li();const t=gn(e);Ut.add(t),Ie();try{if(e.source?.kind==="url"){const i=await qi(e.source.url);await Kn(e,i);return}if(!e.handle){await Hs(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Vt(e))return;if(n!=="granted"){De("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Hs(e);return}await Kn(e,await Oi(await e.handle.getFile()))}catch(n){Vt(e)&&n.name!=="AbortError"&&!(n instanceof yn)&&De("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Ut.delete(t),Ie()}};let et="text",kt,$t=!1,nn=0,Mi,Ro=null;const Lt=()=>w("source-text"),Xn=()=>w("source-url");function ts(){Eo=!w("source-dialog").hidden&&et!=="view"&&(et==="text"?Lt().value:Xn().value)!=="",Je()}Xn().addEventListener("input",ts);function Zn(){No();const e=et==="view",t=$t||oe;Lt().disabled=t,Lt().readOnly=e,w("source-dialog").dataset.mode=et,w("source-submit").hidden=e,w("source-submit").textContent="表示",w("source-submit").disabled=t||e,w("source-cancel").disabled=oe||t&&et!=="url",w("source-cancel").textContent=e?"閉じる":"キャンセル",ts(),queueMicrotask(Gr)}function ns(e,t){if(!(ie||Oe||oe||t&&Ut.has(gn(t)))){Mi?.abort(),nn++,et=e,kt=t?.key,$t=!1,Ro=document.activeElement,w("source-dialog").hidden=!1,w("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${A.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])w(n).hidden=e!=="url";for(const n of["text-label","source-text"])w(n).hidden=e==="url";w("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Lt().value=t.design.markdown:e==="text"&&(Lt().value=Hi),Zn(),(e==="url"?Xn():Lt()).focus()}}let Hi="",bi;function Ml(){if(Ro?.isConnected&&Ro.focus({preventScroll:!0}),bi!==void 0&&cancelAnimationFrame(bi),et!=="view")return;const e=nn;bi=requestAnimationFrame(()=>{if(bi=void 0,e!==nn||!w("source-dialog").hidden)return;const t=window.visualViewport,n=mt.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Li(){nn++,Mi?.abort(),$t=!1,kt=void 0,w("source-dialog").hidden=!0,Zn(),Ml()}async function ni(){return oe?!1:(et==="text"&&(Hi=Lt().value),Li(),!0)}function Vr(){return ni()}Lt().oninput=()=>{et==="text"&&(Hi=Lt().value,ts())};let vi=!1;function Br(){return ie||Oe||$t||oe||fe?"読込が終わってから共有してください。":ol(X())}function No(){const e=Br(),t=w("share-source");t.hidden=!X(),t.setAttribute("aria-disabled",String(vi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}w("share-source").onclick=async()=>{if(vi)return;const e=Br();if(e){De(e,"warning");return}const t=X();if(t.source?.kind!=="url")return;const n=t.source.url,i=sl(location.href,n);vi=!0,No();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),De("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{De("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{vi=!1,No()}};let qt,Sn=0,Js=0,Vn;function Gr(){if(ie||Oe||$t||fe||oe||qt||Vn===void 0)return;const e=Vn;Vn=void 0,is(e)}async function is(e=location.hash){const t=e;if(ie)return;const n=++Js;if(!/^#source(?:=|$)/.test(t)){Vn=void 0,qt&&!oe&&(qt.abort(),qt=void 0,Sn++,Oe=!1,Ie());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),oe){Vn=t;return}if($t||Oe&&!qt){De("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++Sn;qt?.abort();try{const o=rl(t);Fi();const s=A.tabs.find(c=>c.source?.kind==="url"&&c.source.url===o),a=s;if(a){if(kt&&kt!==a.key&&!await ni()||i!==Sn||n!==Js)return;const c=pe()||A.active!==a.key;A.active=a.key,Ie(),be(180,c),De("開いている共有元のタブを選択しました。表示内容は保持しています。"),ii();return}qt=new AbortController,Oe=!0,Ie();const d=await qi(o,qt.signal);if(i!==Sn)return;const u=Rn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await ei(u))return;De("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===Sn&&!(o instanceof yn)&&De("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===Sn&&(qt=void 0,Oe=!1,Ie(),Gr())}}window.addEventListener("hashchange",()=>{is().then(()=>{A.document?.key===Po&&ii()})});function os(e){A.drawer=!0,tt(),Bt()}async function Ll(e){const t=sn(e);if(!(e.design.sourceFormat==="json"||t.busy||oe||ie||fe===e)){t.busy=!0;try{await Qo(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,Bt()}}}let Di;Mt.onchange=()=>{const e=Mt.files?.[0],t=Di??X();Di=void 0,Mt.value="",!(!e||!t||!Vt(t))&&(os(),Pr(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Mt.oncancel=()=>{Di=void 0};w("check-open").onclick=()=>{Di=X(),Mt.click()};let ss,wi=null;function rs(){Ht.hidden=!0,ss=void 0,(wi&&!wi.closest("[hidden]")?wi:w("open-checks").getBoundingClientRect().width?w("open-checks"):w("document-actions-toggle")).focus({preventScroll:!0})}w("check-open-url").onclick=()=>{const e=X();e&&(wi=Lo??document.activeElement,ss=e,w("check-url").value=sn(e).url??"",Ht.hidden=!1,w("check-url").focus())};w("check-url-cancel").onclick=rs;Ht.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),rs())};w("check-url-form").onsubmit=e=>{e.preventDefault();const t=ss;if(!t||!Vt(t))return;const n=w("check-url").value.trim();sn(t).url=n,rs(),os(),Pr(t,async()=>({name:n,url:n,markdown:await Kd(n)}))};w("check-open-sample").onclick=()=>{const e=X();!e||!Yo(e)||(os(),Tr(e,{name:"チェックリストのサンプル",markdown:dl}))};w("check-close").onclick=()=>{const e=X();e&&Ll(e)};w("open-sample-menu").onclick=()=>{w("open-sample").click()};w("view-markdown").onclick=()=>{const e=X();e&&ns("view",e)};w("open-url").onclick=()=>ns("url");w("open-text").onclick=()=>ns("text");w("source-cancel").onclick=()=>Vr();w("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Vr())};w("source-submit").onclick=async()=>{if($t||oe||et==="view"&&fe||w("source-dialog").hidden||et==="view")return;$t=!0,Zn();const e=++nn,t=et;Mi=new AbortController;try{const n=et==="url"?new URL(Xn().value.trim()).href:Xn().value.trim();if(t==="url"&&A.document?.source?.kind==="url"&&A.document.source.url===n){Pe?.reopenBusinessOverview(),A.active=A.tabs[0].key,Li(),Ie(),ii();return}const i=t==="url"?await qi(n,Mi.signal):Xd(Lt().value),o=i.markdown;if(e!==nn)return;const s=Rn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await ei(s))return;De(""),t==="text"&&(Hi=o),Li()}catch(n){e===nn&&!(n instanceof yn)&&De("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===nn&&($t=!1,Zn())}};w("layout-lock").onclick=()=>{ie||(st.cancel(),Le=void 0,pe(),vt=!vt,tt(),rn())};w("selected-edges-only").onchange=()=>{const e=X();!e||ie||oe||fe===e||(st.cancel(),Le=void 0,pe(),e.selectedEdgesOnly=w("selected-edges-only").checked,_n(),be())};w("show-exceptions").onchange=()=>{const e=X();!e||ie||oe||fe===e||(st.cancel(),Le=void 0,pe(),e.showExceptions=w("show-exceptions").checked,_n(),be())};w("prefer-write").onchange=()=>{ie||(pe(),A.preferWrite=w("prefer-write").checked,rn(),be())};w("theme").onclick=()=>{ie||(A.dark=!A.dark,tt(),be())};w("drawer").onclick=()=>{ie||!X()||(pe(),A.drawer=!A.drawer,Ie(),be())};for(const[e,t]of[["in",ys],["out",1/ys]])w(e).onclick=()=>{const n=X();if(n&&fe!==n){const i=pe(),o=Ma({zoom:n.zoom,scroll:n.scroll},t).zoom,s=i||o!==n.zoom;n.zoom=o,Ie(),be(180,s)}};const ve=w("viewport");function Hr(e,t){const n=X();if(!n||oe||fe===n)return;pe();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Rt();const o=Array.from(w("nodes").children).find(s=>s.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),_n()}const Qt=Ra({read:()=>{const e=X();return e&&!oe&&e!==fe&&!vt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>X()?.positions[e],connected:e=>Array.from(w("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=ve.getBoundingClientRect(),t=e.left+ve.clientLeft,n=e.top+ve.clientTop,i={left:t,top:n,right:t+ve.clientWidth,bottom:n+ve.clientHeight};for(const[s,a]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=w(s),u=d.getBoundingClientRect();d.hidden||u.bottom<=n||u.top>=i.bottom||(a==="right"&&u.left>i.left&&u.left<i.right&&(i.right=u.left),a==="left"&&u.right>i.left&&u.right<i.right&&(i.left=u.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:Hr,pan:e=>{const t=X();if(!t||t===fe||vt)return;pe();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Dt(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],pe(),Rt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),st=La(ve,{nodeDrag:Qt,read:()=>{const e=X();return e&&!oe&&fe!==e?{key:e.key,zoom:e.zoom,locked:vt,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},position:e=>X()?.positions[e],change:e=>{const t=X();if(!t||oe||fe===t)return;const n=t.scroll;let i=!1;e.node&&Hr(e.node.id,e.node.position),e.selected&&(nt().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Nn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?rn():e.zoom!==void 0&&Dt(t),e.scroll&&(ve.scrollLeft=e.scroll[0],ve.scrollTop=e.scroll[1]),pe(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Rt()},finish:()=>{const e=X();e&&Dt(e),pe(),be(180,!1)}}),as=()=>{st.cancel(),Le=void 0,pe(),be(0,!1)};window.addEventListener("blur",as);window.addEventListener("pagehide",as);document.addEventListener("visibilitychange",()=>{document.hidden&&as()});ve.onscroll=()=>{pe()};let Le;Da(ve,{read:()=>{const e=X();return e&&!ie&&!oe&&e!==fe?{zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},change:e=>{const t=X();!t||oe||t===fe||(st.cancel(),Qt.cancel(),Le=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Dt(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],pe(!1),Rt(),be(180,!1))}});ve.onpointerdown=e=>{const t=X(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||oe||t===fe||n&&!vt||(Le={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[ve.scrollLeft,ve.scrollTop],node:n,moved:!1},ve.setPointerCapture(e.pointerId))};ve.onpointermove=e=>{if(Le&&Le.pointer===e.pointerId&&Le.key===X()?.key&&X()!==fe){const t=e.clientX-Le.x,n=e.clientY-Le.y;Math.hypot(t,n)>3&&(Le.moved=!0),ve.scrollLeft=Le.scroll[0]-t,ve.scrollTop=Le.scroll[1]-n,pe()}};ve.onpointerup=e=>{if(!Le||Le.pointer!==e.pointerId)return;const t=X(),n=Le;Le=void 0,ve.hasPointerCapture?.(e.pointerId)&&ve.releasePointerCapture(e.pointerId),t&&t!==fe&&n.key===t.key&&!n.moved&&n.node&&(nt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Rt()),Nn(n.node),rn()),pe(),be(180,!1)};ve.onpointercancel=()=>{Le=void 0};ve.addEventListener("lostpointercapture",e=>{e.target===ve&&Le?.pointer===e.pointerId&&(Le=void 0)});let Ji=!1;w("resize").onpointerdown=e=>{ie||(Ji=!0,w("resize").setPointerCapture(e.pointerId))};w("resize").onpointermove=e=>{if(Ji){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==A.width&&(A.width=t,Rt()),tt()}};w("resize").onpointerup=()=>{Ji=!1,be(180,!1)};w("resize").onpointercancel=()=>{Ji=!1,be(180,!1)};w("resize").onkeydown=e=>{if(!ie&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,A.width+(e.key==="ArrowLeft"?20:-20)));t!==A.width&&(A.width=t,Rt()),tt(),be(180,!1)}};window.addEventListener("resize",()=>{tt();const e=X();e&&Dt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=X();t&&Dt(t)});e.observe(w("viewport")),e.observe(document.querySelector(".toolbar"))}function gi(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=Gt(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");jn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Pn=document.createElement("section");Pn.id="source-update-notice";Pn.className="info-bar";Pn.hidden=!0;Pn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Pn);let mn;const Jr=new Set;let uo=0,Po,fo;function _i(){const e=A.document;Pn.hidden=!mn||mn.key!==e?.key||mn.baseline!==e.design.markdown||Jr.has(e.key),w("source-update-refresh").disabled=ie||Oe||oe||!!(e&&Ut.has(e.key))}w("source-update-close").onclick=()=>{mn&&Jr.add(mn.key),_i()};w("source-update-refresh").onclick=()=>{w("refresh").click()};async function ii(){const e=A.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(fo===t)return;fo=t;const n=++uo,i=e.key,o=e.source.url,s=e.design.markdown;try{const a=await Go(o);if(n!==uo||A.document?.key!==i||A.document.design.markdown!==s||A.document.source?.kind!=="url"||A.document.source.url!==o)return;Gt(a),mn=a.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:s}:void 0,_i()}catch{}finally{n===uo&&(fo=void 0)}}Pe=Fc(mt,{rightDrawer:{isOpen:()=>A.drawer,isReady:()=>!ie,setOpen:e=>{ie||(A.drawer=e,tt(),be())}},capture:()=>{pe(),st.cancel(),Le=void 0},business:()=>({key:A.document?.design.namedPlans?JSON.stringify([A.document.key,A.document.design.namedPlans.selected]):A.document?.key,design:A.document?.design,relatedChecks:A.tabs[0]?yd(A.tabs[0]):[],viewKey:X()?.key,views:A.tabs.map(e=>({key:e.key,name:e.name,activity:Ai(e),object:Ei(e)})),activities:A.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:A.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:A.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!A.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=A.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Do(e),yi(e)},openObject:e=>{Ur(e),yi(e)},openOverview:()=>{A.tabs[0]&&(pe(),Pe?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),be())},activateView:e=>{A.tabs.some(t=>t.key===e)&&(pe(),A.active=e,Ie(),be())},statePanel:e=>A.document?Hc(A.document.design,e,t=>{Pe?.activateBusiness(),Do(t),yi(t),Pe?.businessActivated()}):void 0,closeLegacyList:()=>{A.nodeDrawer=!1,tt()},refresh:()=>{tt(),Ao.update()}});const Dl=A;Ie();Je();td().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const c of t.recovery??[])gi(c);if(t.document){const c={...t.document};gi(c),t.document.design=c.design,t.document.checks=c.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const c of t.tabs)gi(c)}const n=rd(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(c=>({...c,name:n.document.name,design:c.design,checks:c.checks,source:c.source,draft:c.draft,edited:c.edited,handle:c.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const c of i.tabs)gi(c);if(new Set(i.tabs.map(c=>c.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const c of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!c||!c.positions||typeof c.positions!="object"||Array.isArray(c.positions)||c.selectedEdgesOnly!==void 0&&typeof c.selectedEdgesOnly!="boolean"||c.showExceptions!==void 0&&typeof c.showExceptions!="boolean"||c.hiddenNodes!==void 0&&(!Array.isArray(c.hiddenNodes)||!c.hiddenNodes.every(r=>typeof r=="string"))||c.viewInset!==void 0&&(!Array.isArray(c.viewInset)||c.viewInset.length!==2||!c.viewInset.every(r=>Number.isFinite(r)&&r>=0))||c.canvasOrigin!==void 0&&(!Array.isArray(c.canvasOrigin)||c.canvasOrigin.length!==2||!c.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(c.scroll)||c.scroll.length!==2||!c.scroll.every(Number.isFinite)||!Number.isFinite(c.zoom)||c.zoom<.25||c.zoom>2.5||!Object.values(c.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:s,scopeOutside:a,...d}=i,u=c=>({...c,hiddenNodes:c.hiddenNodes??(i.scopeOutside==="hide"?c.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});A=jt({...d,tabs:i.tabs.map(u)},n.recovery,n.document,i.tabs.map(c=>{const{design:r,checks:f,source:l,draft:b,edited:g,handle:p,name:m,...I}=u(c);return I})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(A.sampleLayout={...i.sampleLayout,hiddenNodes:Gt(Jo).graph.nodes.filter(c=>!c.scope).map(c=>c.id)}),A.tabs.some(c=>c.key===A.active)||(A.active=A.tabs[0]?.key),X()?.selected&&Nn(X().selected),Po=A.document?.key,Ie(),_o=!0}).catch(()=>{A=Dl,Mn=!0,Ko()}).finally(()=>{ie=!1,Ie(),Je(),is().then(()=>{A.document?.key===Po&&ii()})});
