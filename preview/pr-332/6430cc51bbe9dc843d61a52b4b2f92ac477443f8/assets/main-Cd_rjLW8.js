import{L as Hs,D as sa,G as ra,W as aa,P as ca,l as Rn,X as _s,C as da,n as la,S as Js,o as Ks,p as Xs,M as Zs,q as Ys,s as Qs,t as Ni,g as Pi,r as ui,d as er,b as wo,u as Ti,U as tr,v as ua,w as nr,x as or,y as fi,z as fa,m as qi,A as pa,B as ir,E as ma,j as ha,F as hs,H as ba,T as ga,I as ya,J as va,R as wa,K as ka,N as Ia,O as Sa,Q as xa,V as Aa,Y as Ea,Z as bs,k as Oa,i as Ca,h as ja,f as Ma,a as La,_ as Ra,$ as Da,a0 as sr,a1 as Na,a2 as Pa,e as Ta}from"./canvas-toolbar-Ch5Zpft_.js";const qa={subsystems:{full:"サブシステム",icon:ca},business:{full:"業務設計",icon:aa},states:{full:"状態遷移",icon:ra},concept:{full:"データ構造",icon:sa},tests:{full:"テスト仕様",icon:Hs}};function pi(e,t,n){const o=qa[t],i=document.createElement("span"),s=document.createElement("span"),c=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Rn(o.icon,{"aria-hidden":"true","stroke-width":1.8})),c.className="view-tab-name",c.textContent=n,i.append(s,c),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function mi(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Rn(_s,{"aria-hidden":"true","stroke-width":1.8})),t}function Wa(e){const t=Rn(e?da:la,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function za(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,c=Math.max(0,Math.min(n,s+o*i));c!==s&&(e.scrollLeft=c,t.preventDefault())},{passive:!1})}function Ua(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const $a=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function gs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=$a,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const c=Rn(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&c.classList.add(s),t.querySelector(o)?.append(c)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",Js),n(".layout-lock",Ks,"lock-closed"),n(".layout-lock",Xs,"lock-open"),n(".zoom-out",Zs),n(".zoom-in",Ys)}function ys(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Fa({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(r=>r.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),o=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(r=>["",r]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:a.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),i=a=>o.find(l=>l.id===a),s=(a,l)=>{const r=Object.fromEntries(a.nodes.map(b=>[b.id,{...l[b.conceptId],name:b.name,note:b.description,sources:b.sources,conceptId:b.conceptId,subsystemId:b.subsystemId,fields:b.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(b=>a.nodes.some(g=>g.subsystemId===b.id)).map(b=>({id:b.id,name:b.name})),u=a.handoffIds.map(b=>e.handoffs.find(g=>g.id===b)).map(b=>({id:b.id,from:b.fromSubsystemId,to:b.toSubsystemId,label:b.information,returning:b.flowDirection==="return"}));return{ids:a.nodes.map(b=>b.id),tables:r,edges:a.edges.map(b=>[b.fromViewId,b.toViewId,b.fromLabel,b.toLabel,b.kind]),regions:f,handoffs:u}};return{tables:t,edges:n,groups:o,findGroup:i,graph:a=>{const l=i(a);if(!l)throw Error("Unknown review group: "+a);const r=e.reviewGroups.find(b=>b.id===a),f=r.graph.subsystemViews;if(f)return s(f,l.concepts);const u=Object.keys(t).filter(b=>Object.hasOwn(l.concepts,b));return{ids:u,tables:l.concepts,edges:l.relations.filter(([b,g])=>u.includes(b)&&u.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function Qe(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Va(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",Qe(o,"span",t),o.onclick=n,e.append(o),o}function Ba(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Ga(e,t,n,o=()=>{},i=()=>{},s=[]){const c=n.contentFor(t.id);if(e.replaceChildren(),!c)return;Qe(e,"p",c.description).className="review-description",Qe(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of c.relatedActivities){const l=document.createElement("li"),r=s.find(u=>u.id===a.id&&u.name===a.name),f=Va(l,a.name,()=>{r&&i(r.id)});f.disabled=!r,f.setAttribute("aria-label",a.name+"を業務タブで開く"),d.append(l)}e.append(d),Qe(e,"h3","情報の構造");for(const a of c.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=a.id,Qe(l,"h4",a.title),Qe(l,"p",a.description),e.append(l)}Qe(e,"h3","できること");for(const a of c.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=a.id,Qe(l,"h4",a.title),Qe(l,"p",a.description);for(const r of a.samples){const f=o(a.id,r.id),u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=r.id,u.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?u.onclick=f.open:(u.disabled=!0,u.title="対応するテスト仕様へのリンクがありません"),l.append(u)}e.append(l)}Qe(e,"h3","できないこと（業務上のルール）");for(const a of c.limitations){const l=document.createElement("section");l.className="review-limitation",Qe(l,"h4",a.title),Qe(l,"p",a.description),Qe(l,"h5","理由"),Qe(l,"p",a.reason),e.append(l)}}function Kt(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function Ha({model:e,business:t}){const n=c=>c.kind==="group"?e.subsystems.find(d=>d.id===c.id):e.handoffs.find(d=>d.id===c.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(c){const d=n(c);return d?d.activityIds.map(a=>t.activities.find(l=>l.id===a)).filter(Boolean):[]}function s(c,d){if(c.replaceChildren(),d.kind==="group"){const f=e.subsystems.find(b=>b.id===d.id);if(!f)return"";Kt(c,"p",f.purpose),Kt(c,"h3","扱う情報");const u=c.ownerDocument.createElement("ul");for(const b of f.information)Kt(u,"li",b);return c.append(u),Kt(c,"h3","まとまりの理由"),Kt(c,"p",f.reason),f.name}const a=e.handoffs.find(f=>f.id===d.id);if(!a)return"";Kt(c,"p",a.description),Kt(c,"h3","出元と受取先");const l=e.subsystems.find(f=>f.id===a.fromSubsystemId),r=e.subsystems.find(f=>f.id===a.toSubsystemId);return Kt(c,"p",`${l.name} → ${r.name}`),a.information}return{sections:o,activities:i,describe:s}}function vs(e,t,n){const o=document.createElement("div");o.className="concept-drawer-resize",o.tabIndex=0,o.setAttribute("role","separator"),o.setAttribute("aria-orientation","vertical"),o.setAttribute("aria-label","補足情報の幅"),e.prepend(o);let i=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(i=d)}catch{}const s=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},c=(d,a=!1)=>{if(i=Math.max(280,Math.min(s(),d)),e.style.setProperty("--concept-drawer-width",i+"px"),o.setAttribute("aria-valuemin","280"),o.setAttribute("aria-valuemax",String(s())),o.setAttribute("aria-valuenow",String(Math.round(i))),a)try{sessionStorage.setItem(n,String(i))}catch{}};if(o.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),c(d.key==="Home"?280:d.key==="End"?s():i+(d.key==="ArrowLeft"?40:-40),!0))},o.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,l=i;o.setPointerCapture(d.pointerId),o.classList.add("resizing"),o.onpointermove=r=>c(l+a-r.clientX),o.onpointerup=()=>{o.onpointermove=null,o.onpointerup=null,o.onpointercancel=null,o.classList.remove("resizing"),c(i,!0)},o.onpointercancel=o.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>c(i));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>c(i)),c(i)}const _a=260,Ja=68,Ka="http://www.w3.org/2000/svg",Ot=(e,t,n={})=>{const o=e.createElementNS(Ka,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function Xa(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Rn(tr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Za(e,{model:t,business:n},o,i,s){const c=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(k=>{const O=c.find(D=>D.id===k.from),R=c.find(D=>D.id===k.to);if(!O||!R||O.subsystemId!==R.subsystemId||!t.presentation.reviewBoundaries.some(D=>D.from===k.from&&D.to===k.to))throw Error("Unknown overview relationship: "+k.from+" -> "+k.to);return k}),l=t.handoffs.map(k=>{if(!["forward","return"].includes(k.flowDirection))throw Error("Unknown overview handoff direction: "+k.id);return{id:k.id,from:k.fromSubsystemId,to:k.toSubsystemId,label:k.information,returning:k.flowDirection==="return"}});if(new Set(l.map(k=>k.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const k of l)if(!d.some(O=>O.id===k.from)||!d.some(O=>O.id===k.to)||k.from===k.to||!k.label.trim())throw Error("Unknown overview handoff: "+k.id);for(const k of c){if(!d.some(O=>O.id===k.subsystemId))throw Error("Unknown overview subsystem: "+k.id);if(!n.roles?.some(O=>O.id===k.reviewer.roleId))throw Error("Unknown overview reviewer: "+k.id)}const r=d.flatMap(k=>c.filter(O=>O.subsystemId===k.id)),f=new Map;let u=0;for(const[k,O]of d.entries())for(const R of r.filter(D=>D.subsystemId===O.id))f.set(R.id,[80+u*170,100+u*120+k*64]),u++;const b=Ni(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let p,m;try{const k=JSON.parse(localStorage.getItem(g)||"null"),O=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),R=!k&&O?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,D=k??R;if(D){typeof D.zoom=="number"&&Number.isFinite(D.zoom)&&(b.zoom=Math.max(.25,Math.min(2.5,D.zoom))),Array.isArray(D.scroll)&&D.scroll.length===2&&D.scroll.every(C=>typeof C=="number"&&Number.isFinite(C))&&(b.scroll=D.scroll),typeof D.locked=="boolean"&&(b.locked=D.locked);for(const[C,G]of Object.entries(D.positions??{}))c.some(q=>q.id===C)&&Array.isArray(G)&&G.length===2&&G.every(q=>typeof q=="number"&&Number.isFinite(q))&&b.positions.set(C,[G[0],G[1]])}const x=D?.selection,P=x?.kind==="node"?t.concepts.find(C=>C.id===x.id)?.subsystemId:x?.id,N=x?.kind==="node"?"group":x?.kind;typeof P=="string"&&(N==="model"&&c.some(C=>C.id===P)||N==="group"&&d.some(C=>C.id===P)||N==="connection"&&l.some(C=>C.id===P))&&(m={kind:N,id:P}),m?.kind==="model"&&(b.selected=m.id)}catch{}const I=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:b.zoom,scroll:b.scroll,locked:b.locked,positions:Object.fromEntries(b.positions),selection:m}))}catch{}},j=k=>{if(!k&&!m)return;m=k,b.selected=k?.kind==="model"?k.id:void 0;const O=p?.querySelector(".diagram-world>svg");O&&v(O),I()},v=k=>{const O=wo(a,b.selected),R=wo(l,m?.kind==="group"?m.id:void 0);for(const D of c){const x=k.querySelector(`[data-node="${D.id}"]`);x?.setAttribute("class","node graph-shape state-shape"+O.nodeClasses(D.id)),x?.setAttribute("aria-pressed",String(b.selected===D.id))}for(const D of d){const x=k.querySelector(`[data-subsystem="${D.id}"]`);x?.setAttribute("class","subsystem-overview-group"+R.nodeClasses(D.id)),x?.querySelector("button")?.setAttribute("aria-pressed",String(m?.kind==="group"&&m.id===D.id))}for(const D of a){const x=k.querySelector(`[data-overview-from="${D.from}"][data-overview-to="${D.to}"]`);x?.setAttribute("class","edge"+(O.related(D)?" review-related":"")),x?.setAttribute("marker-end",`url(#overview-${O.related(D)?"related-arrow":"arrow"})`)}for(const D of l){const x=R.related(D)||m?.kind==="connection"&&m.id===D.id,P=k.querySelector(`[data-handoff-id="${D.id}"]`);P?.setAttribute("class","edge"+(D.returning?" exception":"")+(x?" review-related":"")),P?.setAttribute("marker-end",`url(#overview-${x?"related-arrow":"arrow"})`),k.querySelector(`[data-handoff-label="${D.id}"]`)?.classList.toggle("review-related",!!x)}k.querySelectorAll("[data-exception-paint]").forEach(D=>D.remove());for(const D of Array.from(k.querySelectorAll("[data-handoff-id].exception")))Ti(k,D,{path:D.getAttribute("d")},{"data-overview-return-paint":D.getAttribute("data-handoff-id")})};return p=Qs(e,k=>{const O=r.map(N=>{const C=k.positions.get(N.id)??f.get(N.id);return{id:N.id,x:C[0],y:C[1],width:_a,height:Ja}}),R=Ot(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});R.append(Pi("overview-"));let D=0,x=0;const P=[];for(const N of d){const C=O.filter(he=>c.find(xe=>xe.id===he.id)?.subsystemId===N.id);if(!C.length)continue;const G=Math.min(...C.map(he=>he.x))-30,q=Math.min(...C.map(he=>he.y))-48,re=Math.max(...C.map(he=>he.x+he.width))-G+30,ee=Math.max(...C.map(he=>he.y+he.height))-q+30;P.push({id:N.id,x:G,y:q,width:re,height:ee});const te=Ot(e,"g",{"data-subsystem":N.id,"aria-label":N.name}),de=Ot(e,"rect",{x:G,y:q,width:re,height:ee,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});de.addEventListener("click",()=>j({kind:"group",id:N.id})),te.append(de);const ue=Ot(e,"foreignObject",{class:"subsystem-overview-region-heading",x:G+8,y:q+3,width:re-16,height:36}),je=e.createElement("button");je.type="button",je.className="subsystem-overview-region-title",je.setAttribute("aria-label",N.name+"を選択"),je.textContent=N.name,je.onclick=()=>j({kind:"group",id:N.id}),ue.append(je),te.append(ue),R.append(te),D=Math.max(D,G+re+40),x=Math.max(x,q+ee+40)}for(const[N,C]of l.entries()){if(!P.some(te=>te.id===C.from)||!P.some(te=>te.id===C.to))throw Error("Missing overview handoff region: "+C.id);const G=Math.max(30,C.label.length*12),q=ui({from:C.from,to:C.to,nodes:P,index:N,kind:"input",matrix:{returning:C.returning,captionLane:0},labelWidth:G,labelHeight:18}),re=Ot(e,"path",{d:q.path,class:"edge"+(C.returning?" exception":""),"data-handoff-id":C.id,"data-from-subsystem":C.from,"data-to-subsystem":C.to,"data-flow-direction":C.returning?"return":"forward","marker-end":"url(#overview-arrow)"});R.append(re);const ee=Ot(e,"text",{x:q.label[0]-G/2,y:q.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":C.id});ee.textContent=C.label,ee.addEventListener("pointerdown",te=>te.stopPropagation()),ee.addEventListener("pointerup",te=>te.stopPropagation()),ee.addEventListener("click",()=>j({kind:"connection",id:C.id})),ee.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),j({kind:"connection",id:C.id}))}),R.append(ee),D=Math.max(D,q.bounds.right+40,q.label[0]+G/2+30),x=Math.max(x,q.bounds.bottom+40,q.label[1]+30)}for(const[N,C]of a.entries()){const G=ui({from:C.from,to:C.to,nodes:O,index:N,kind:"input",labelWidth:0,labelHeight:0}),q=Ot(e,"path",{d:G.path,class:"edge","data-overview-from":C.from,"data-overview-to":C.to,"marker-end":"url(#overview-arrow)"});R.append(q),D=Math.max(D,G.bounds.right+40),x=Math.max(x,G.bounds.bottom+40)}for(const N of O){const C=c.find(xe=>xe.id===N.id),G=n.roles.find(xe=>xe.id===C.reviewer.roleId),q=Ot(e,"g",{role:"button",tabindex:0,"aria-label":C.title+"を選択","aria-pressed":"false","data-node":N.id,"data-review-group":N.id,"data-subsystem-id":C.subsystemId,class:"node graph-shape state-shape"}),re=er(e,N);re.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),q.append(re,Ot(e,"rect",{x:N.x,y:N.y,width:N.width,height:N.height,rx:8,class:"state-diagram-node"}));const te=Ot(e,"foreignObject",{x:N.x,y:N.y,width:N.width,height:N.height}),de=e.createElement("div");de.className="subsystem-overview-card";const ue=Xa(e,G.color),je=e.createElement("span");je.className="subsystem-overview-labels",je.title=C.title+" — "+G.name;for(const[xe,L,z]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",C.title],["small","subsystem-overview-role",G.name]]){const V=e.createElement(xe);V.className=L,V.textContent=z,je.append(V)}const he=e.createElement("button");he.type="button",he.className="subsystem-overview-open",he.setAttribute("aria-label",C.title+"の詳細タブを開く"),he.title="詳細タブを開く",he.textContent="開く",he.onpointerdown=xe=>xe.stopPropagation(),he.onpointerup=xe=>xe.stopPropagation(),he.onclick=xe=>{xe.stopPropagation(),i(C.id)},de.append(ue,je,he),te.append(de),q.append(te),q.addEventListener("click",()=>j({kind:"model",id:N.id})),q.addEventListener("keydown",xe=>{(xe.key==="Enter"||xe.key===" ")&&(xe.preventDefault(),j({kind:"model",id:N.id}))}),R.append(q)}return R.setAttribute("viewBox",`0 0 ${D} ${x}`),v(R),R},b,I,()=>j(void 0)),p.classList.add("subsystem-overview-canvas"),p.addEventListener("click",I),p.addEventListener("pointerup",()=>queueMicrotask(I)),p.querySelector(".diagram-viewport")?.addEventListener("scroll",I),{root:p,selected:()=>b.selected,selection:()=>m,restore:()=>{const k=()=>{const O=p.querySelector(".diagram-viewport");O.scrollLeft=b.scroll[0],O.scrollTop=b.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(k):k()}}}function Ya(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(c=>c.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function Qa({model:e,business:t}){const n=g=>{const p=t.activities.find(m=>m.id===g);if(!p)throw Error("Unknown activity: "+g);return p},o=g=>{const p=t.roles?.find(m=>m.id===g);if(!p)throw Error("Unknown role: "+g);return p.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(p=>{const m=n(p);return{id:m.id,name:m.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(p=>({...p,samples:p.samples.map(Ya)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(p=>p.id===g),c=(g,p)=>s(g)?.capabilities.find(m=>m.samples.some(I=>I.id===p)),d=i.flatMap(g=>g.capabilities.flatMap(p=>p.samples.map(m=>({...m,group:g.id})))),a=["yellow","cyan","green","blue","purple","orange"];function l(g,p,m){let I=m.get(p);if(I||(I=a[m.size]??`extra-${m.size}`,m.set(p,I)),g.dataset.sampleKey=p,g.dataset.keyTone=I,g.className="data-example-key",I.startsWith("extra-")){const j=(Number(I.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${j} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${j} 24% 25%)`)}}const r=g=>d.filter(p=>p.group===g),f=(g,p)=>r(g).find(m=>m.id===p);function u(g,p,m){const I=g.ownerDocument.createElement(p);return I.textContent=m,g.append(I),I}function b(g,p,m,I,j){const v=g.ownerDocument,M=f(p.id,m);if(!M)throw Error("Unknown data example: "+m);g.replaceChildren(),g.dataset.dataExample=m;const k=new Map;e.presentation.sampleCaption&&(u(g,"p",e.presentation.sampleCaption).className="data-example-caption");const O=s(p.id)?.capabilities??[],R=j?.capabilityId?O.filter(C=>C.id===j.capabilityId):O;if(j?.capabilityId&&!R.some(C=>C.samples.some(G=>G.id===m)))throw Error("Sample does not belong to capability: "+m);const D=c(p.id,m);g.dataset.capability=D.id;const x=()=>{u(g,"h2",j?.heading?.trim()||D.title),j?.renderSpecification?j.renderSpecification(g):u(g,"p",D.description).className="data-example-capability"};j?.capabilityId&&!j.hideCapability&&x();const P=v.createElement("label");P.className="data-example-picker",u(P,"span","場面");const N=v.createElement("select");N.setAttribute("aria-label","データ例の場面");for(const C of R){let G=N;if(!j?.capabilityId){const q=v.createElement("optgroup");q.label=C.title,N.append(q),G=q}for(const q of C.samples){if(j?.sampleIds&&!j.sampleIds.includes(q.id))continue;const re=v.createElement("option");re.value=q.id,re.textContent=q.name,G.append(re)}}if(N.value=m,N.onchange=()=>I(N.value),P.append(N),(!j?.hideSinglePicker||N.options.length>1)&&g.append(P),!j?.capabilityId&&!j?.hideCapability&&x(),u(g,"h3",M.name).className="data-example-scene",j?.collapseScenario&&M.when){const C=v.createElement("details");C.className="data-example-context",u(C,"summary","場面の背景"),u(C,"p",M.when).className="data-example-when",g.append(C)}else u(g,"p",M.when).className="data-example-when";u(g,"p",M.meaning).className="data-example-meaning";for(const C of M.blocks){const G=v.createElement("section");G.className="data-example-block",G.dataset.exampleCard=C.card,u(G,"h3",p.concepts[C.card].name);const q=v.createElement("div");q.className="data-example-table",q.tabIndex=0,q.setAttribute("role","region"),q.setAttribute("aria-label",p.concepts[C.card].name+"のデータ表");const re=v.createElement("table");re.setAttribute("aria-label",p.concepts[C.card].name+"のデータ例");const ee=v.createElement("caption");ee.textContent=p.concepts[C.card].name+"に入る情報",re.append(ee);const te=v.createElement("thead"),de=v.createElement("tr");for(const je of C.columns)u(de,"th",je).setAttribute("scope","col");te.append(de),re.append(te);const ue=v.createElement("tbody");for(const[je,he]of C.rows.entries()){const xe=v.createElement("tr");for(const[L,z]of he.entries()){const V=u(xe,"td",String(z)),le=C.keyIds[je][L];le&&(l(V,le,k),V.title=C.columns[L]+"："+z)}ue.append(xe)}re.append(ue),q.append(re),G.append(q),C.rows.length||u(G,"p",C.empty??"データはありません。"),g.append(G)}M.note&&(u(g,"p",M.note).className="data-example-note")}return{reviewContents:i,dataExamples:d,contentFor:s,capabilityFor:c,examplesFor:r,findDataExample:f,renderDataExample:b}}function Wi(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function ec(e,t,n){return Wi(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function tc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function pn(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const c=(d,a)=>{for(const l of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const r=document.createElement("strong");r.textContent=l.slice(2,-2),d.append(r)}else if(l.startsWith("`")&&l.endsWith("`")){const r=document.createElement("code");r.textContent=l.slice(1,-1),d.append(r)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!o){o=a[1],s=void 0;const u=document.createElement("pre");i=document.createElement("code"),u.append(i),n.append(u);continue}if(a&&a[1][0]===o[0]&&a[1].length>=o.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(d+`
`));continue}if(!d.trim()){s=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(r){s||(s=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(s));const u=document.createElement("li");c(u,r[1]),s.append(u);continue}s=void 0;const f=document.createElement(l?"h"+l[1].length:"p");c(f,l?l[2]:d),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Ie={type:"string"},_={type:"string",minLength:1,pattern:"\\S"},F={type:"string",pattern:"^[A-Za-z0-9_-]+$"},tn=e=>({anyOf:[e,{type:"null"}]}),J=e=>({type:"array",items:e}),Q=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),nc=e=>({$ref:"#/$defs/"+e}),In=J({anyOf:[Q({kind:{enum:["text"]},value:Ie}),Q({kind:{enum:["reference"]},targetId:F,label:Ie}),Q({kind:{enum:["link"]},uri:_,label:Ie})]}),ws=Q({id:F,name:_,scope:{type:"boolean"}}).properties,oc=Q({id:F,kind:{enum:["input","output","business-exception","object-exception"]},fromId:F,toId:F,label:_}),ic=Q({id:F,sourceId:F,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:J(F),unresolvedTargets:J(_),summary:_,content:_}),hi=Q({id:F,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:_,title:_,preface:Ie,scope:Ie,objects:J(Q({...ws,icon:_,information:J(_)})),activities:J(Q({...ws,why:_,when:_,who:_,where:_,procedure:_,exception:tn(_),result:_,problem:tn(_),painLevel:tn({enum:["Low","Medium","High"]})})),relations:J(oc),findings:J(ic)}),sc=Q({id:F,name:_,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),rr=Q({...hi.properties,schemaVersion:{enum:["0.2"]},roles:J(sc),activities:J(Q({...hi.properties.activities.items.properties,roleId:tn(F)}))}),rc=Q({...rr.properties,schemaVersion:{enum:["0.3"]},exceptions:J(Q({id:F,activityId:F,name:_,description:Ie}))}),ac=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,In])),cc=Q({id:F,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:_,title:_,basedOn:Q({documentId:F,revision:_,verification:{enum:["unverified"]}}),intro:In,index:J(Q({activityId:F,purpose:Ie,connections:Ie,checkIds:J(F)})),sections:J(Q({id:F,activityId:tn(F),title:_,preamble:In})),guarantees:J(Q({id:F,sectionId:F,title:_,blocks:J({anyOf:[Q({kind:{enum:["prose"]},content:In}),Q({kind:{enum:["example"]},exampleId:F})]})})),examples:J(Q({id:F,guaranteeId:F,columns:J(_),rows:J(J(In))})),items:J(Q({id:F,checkId:F,title:_,detailSummary:Ie,sectionId:F,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:Q(ac,[])})),notes:J(Q({id:F,title:_,content:In}))}),zi=Q({id:F,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:_,title:_,basedOn:Q({documentId:F,revision:_,verification:{enum:["unverified"]}}),objectId:F,states:J(Q({id:F,name:_})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:_,transitions:J(Q({id:F,sourceId:_,fromId:_,activityId:F,event:tn(_),exception:tn(_),condition:_,toId:_,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:_,note:_}))}),ks=Object.fromEntries(Object.entries({...zi.properties.transitions.items.properties,exceptionId:tn(F)}).filter(([e])=>e!=="exception")),dc=Q({...zi.properties,schemaVersion:{enum:["0.2"]},transitions:J(Q({...ks,conditionLabel:_},Object.keys(ks)))}),Ui=Q({documentId:F,revision:_,targetType:_,targetId:F,section:_}),lc=Q({id:F,name:_,responsibilityStatus:_,responsibleSubsystemId:F},["id","name"]),uc=Q({id:F,name:_,subsystemId:F,information:J(lc),reason:Ie,description:Ie,businessObjectIds:J(F),activityLinks:J(Q({activityId:F,uses:J(_)})),sourceRefs:J(Ui),reviewState:_}),fc=Q({id:F,fromConceptId:F,toConceptId:F,fromPerTarget:_,toPerSource:_,condition:Ie,reviewState:_,sourceRefs:J(Ui),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),pc=Q({id:F,name:_,purpose:Ie,information:J(_),reason:Ie,activityIds:J(F),reviewState:_}),mc=Q({id:F,fromSubsystemId:F,toSubsystemId:F,information:_,description:Ie,activityIds:J(F),flowDirection:{enum:["forward","return"]},reviewState:_}),hc=Q({columnId:F,value:{anyOf:[Ie,{type:"number"}]},linkId:_},["columnId","value"]),bc=Q({card:F,columns:J(Q({id:F,name:_,informationId:F})),rows:J(Q({id:F,cells:J(hc)})),empty:Ie},["card","columns","rows"]),bi=Q({id:F,name:_,when:Ie,meaning:Ie,blocks:J(bc),note:Ie},["id","name","when","meaning","blocks"]),gi=Q({id:F,title:_,description:Ie,meta:{},samples:J(bi)}),gc=Q({...bi.properties,checkIds:{...J(F),minItems:1,uniqueItems:!0}},[...bi.required,"checkIds"]),yc=Q({decisionExampleIds:J(F),decisionCheckIds:J(F),resultCheckIds:J(F),sampleIds:J(F)}),vc=Q({...gi.properties,samples:J(gc),testSpecification:yc},[...Object.keys(gi.properties)]),wc=Q({id:F,title:_,description:Ie,reason:Ie,meta:{}}),kc=Q({conceptId:F,name:_,fields:J(_),description:Ie,sources:J(_),sourceActivityIds:J(F)}),Ic=Q({id:F,fromConceptId:F,toConceptId:F,relationIds:J(F),scope:Ie,fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),Sc=Q({id:F,conceptId:F,subsystemId:F,name:_,description:Ie,sources:J(_),fields:J(Q({name:_,informationId:F}))}),xc=Q({id:F,fromViewId:F,toViewId:F,relationIds:J(F),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),ar=Q({nodes:J(Sc),edges:J(xc),handoffIds:J(F)}),cr=Q({id:F,subsystemId:F,title:_,description:Ie,reviewer:Q({roleId:F}),relatedActivityIds:J(F),graph:Q({conceptIds:J(F),nodes:J(kc),edges:J(Ic),subsystemViews:ar},["conceptIds","nodes","edges"]),structureStatements:J(Q({id:F,title:_,description:Ie,sampleIds:J(F),sourceRefs:J(Ui)})),capabilities:J(gi),limitations:J(wc),meta:Q({questions:J(_),hypotheses:{}},["questions"])}),Ac=Q({...cr.properties,capabilities:J(vc)}),dr=Q({id:F,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:_,basedOn:Q({documentId:F,revision:_,verification:{enum:["unverified"]}}),relatedStates:J(Q({documentId:F,revision:_,verification:{enum:["unverified"]}})),subsystems:J(pc),concepts:J(uc),relations:J(fc),handoffs:J(mc),reviewGroups:J(cr),benefits:J(_),considerations:J(_),reviewPoints:J(_),meta:{},presentation:Q({activityViews:{},creatorActivityIds:{},sampleCaption:Ie,subsystemViews:ar,landscapeRelationships:J(Q({from:F,to:F})),reviewBoundaries:J(Q({from:F,to:F,label:Ie,promise:Ie}))},["landscapeRelationships","reviewBoundaries"])}),Ec=Q({...dr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:J(Ac)}),co=(e,t)=>Q({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:_,documents:J({anyOf:t.map(nc)}),sources:J(Q({documentId:F,revision:_,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Ie})),externalDocuments:J(Q({id:F,kind:{enum:["businessDesign"]},revision:_,activities:J(Q({id:F,name:_}))})),diagnostics:J(_)}),Is={anyOf:[co("0.1",["businessDesign","checkItems"]),co("0.2",["businessDesign","checkItems","stateTransition"]),co("0.3",["businessDesignRoles","checkItems","stateTransition"]),co("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:hi,businessDesignRoles:rr,businessDesignStructured:rc,checkItems:cc,stateTransition:zi,stateTransitionStructured:dc,conceptModel:dr,checkedConceptModel:Ec}},W=(e,t)=>{if(!e)throw Error(t)};function lr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const c=e[t++];if(c==='"')return JSON.parse(e.slice(s,t));c==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{W(s<=64,"JSON depth limit"),n();const c=e[t];if(c==='"'){o();return}if(c==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),W(e[t]==='"',"JSON object key required");const l=o();W(!a.has(l),"Duplicate JSON key: "+l),a.add(l),n(),W(e[t++]===":","JSON colon required"),i(s+1),n();const r=e[t++];if(r==="}")return;W(r===",","JSON comma required")}throw Error("Truncated object")}if(c==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const a=e[t++];if(a==="]")return;W(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;W(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return i(),n(),W(t===e.length,"Trailing JSON content"),JSON.parse(e)}function Sn(e,t=Is,n="$"){if(t.$ref)return Sn(e,Is.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{Sn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&W(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;W(o===t.type,"Invalid type at "+n)}if(t.minLength&&W(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&W(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])W(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))W(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),Sn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>Sn(o,t.items,n+"["+i+"]"))}function Oc(e){const t=new Map,n=new Map,o=new Map,i=(s,c,d)=>{W(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,c.id),o.set(s.id,d)};for(const s of e.documents){i(s,s,"document");for(const[c,d]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const a of s[c]??[])i(a,s,d)}for(const s of e.externalDocuments){i(s,s,"document");for(const c of s.activities)i(c,s,"activity")}return{map:t,owner:n,types:o}}function yi(e){return Sn(e),ur(e)}function On(e,t){const n=new Set(e.items.map(c=>c.id)),o=new Set,i=e.guarantees.find(c=>c.id===t.guaranteeId),s=c=>{if(Array.isArray(c)){for(const d of c)s(d);return}if(c&&typeof c=="object"){c.kind==="reference"&&n.has(c.targetId)&&o.add(c.targetId);for(const d of Object.values(c))d&&typeof d=="object"&&s(d)}};s(t.rows);for(const c of i?.blocks??[])c.kind==="prose"&&s(c.content);for(const c of e.items)(c.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&o.add(c.id);return[...o]}function ur(e,{allowUnresolvedFindings:t=!1}={}){W(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=Oc(e),s=[...e.diagnostics],c=new Set;for(const u of e.sources)if(u.uri){const b=new URL(u.uri);W(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const d=(u,b,g)=>(W(n.has(u),"Dangling reference: "+u),b&&W(i.get(u)===b,"Reference type mismatch: "+u),g&&W(o.get(u)===g,"Cross-document mismatch: "+u),n.get(u)),a=u=>u?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),l=(u,b)=>{for(const g of u)if(g.kind==="reference"&&(d(g.targetId,null,b),W(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const p=new URL(g.uri);W(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const u of e.documents)if(W(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){W(u.activities.length>0,"Activity required");const b=[...u.objects,...u.activities].map(m=>m.name);W(new Set(b).size===b.length,"Duplicate visible name"),W(b.every(m=>m===m.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(I=>m.includes(I))),"Invalid Graph-visible name");for(const m of u.objects)W(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){W(new Set(u.roles.map(m=>m.name)).size===u.roles.length,"Duplicate Role name"),W(u.roles.every(m=>m.name===m.name.trim()&&!/[\r\n]/.test(m.name)),"Invalid Role name");for(const m of u.activities)m.roleId!==null?d(m.roleId,"role",u.id):c.add("Role未確定: "+m.id+" — "+m.who)}for(const m of u.activities)W(m.problem===null==(m.painLevel===null),"Problem/Pain pair mismatch");for(const m of u.exceptions??[])d(m.activityId,"activity",u.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const m of u.relations){d(m.fromId,g[m.kind][0],u.id),d(m.toId,g[m.kind][1],u.id);const I=JSON.stringify([m.kind,m.fromId,m.toId,m.label]);W(!p.has(I),"Duplicate relation"),p.add(I)}W(new Set(u.findings.map(m=>m.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const m of u.findings){W(m.scope==="items"?m.targetIds.length+m.unresolvedTargets.length>0:!m.targetIds.length&&!m.unresolvedTargets.length,"Finding scope mismatch"),W(new Set(m.targetIds).size===m.targetIds.length,"Duplicate Finding target");for(const I of m.targetIds)d(I,null,u.id),W(["object","activity"].includes(i.get(I)),"Invalid Finding target");m.unresolvedTargets.length&&(W(t,"Unresolved Finding target: "+m.sourceId),s.push("Finding参照未決: "+m.sourceId))}}else if(u.kind==="stateTransition"){const b=d(u.basedOn.documentId,"document");W(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),W(b.revision===u.basedOn.revision,"Stale State source revision"),d(u.objectId,"object",b.id),W(!e.documents.some(p=>p!==u&&p.kind==="stateTransition"&&p.objectId===u.objectId),"Duplicate Object state declaration"),W(u.states.length>0&&new Set(u.states.map(p=>p.name)).size===u.states.length,"Duplicate/empty state names"),W(u.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),W(u.transitions.length<=1e3,"State transition row budget"),W(new Set(u.transitions.map(p=>p.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const g=new Map;for(const p of u.transitions){p.fromId!=="@new"&&d(p.fromId,"state",u.id),["@unknown","@none"].includes(p.toId)||d(p.toId,"state",u.id);const m=d(p.activityId,"activity",b.id),I=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(W(!g.has(I),"Duplicate state transition condition: "+g.get(I)+" / "+p.sourceId),g.set(I,p.sourceId),e.formatVersion==="0.4")if(W(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const j=d(p.exceptionId,"exception",b.id);W(j.activityId===m.id,"Exception Activity mismatch")}else p.path==="exception"&&W(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else W(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);W(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),W(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),W(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),W(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const b=d(u.basedOn.documentId,"document");W(b.kind==="businessDesign"&&b.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),W(!e.documents.some(x=>x!==u&&x.kind==="conceptModel"&&x.basedOn.documentId===b.id),"Duplicate Concept model for Business Design");const g=(x,P)=>{const N=new Map;for(const C of x)W(!N.has(C.id),"Duplicate "+P+" ID: "+C.id),N.set(C.id,C);return N},p=g(u.subsystems,"subsystem"),m=g(u.concepts,"concept"),I=g(u.relations,"concept relation"),j=g(u.reviewGroups,"review group"),v=g(u.handoffs,"handoff"),M=g(u.concepts.flatMap(x=>x.information),"concept information"),k=(x,P,N)=>(W(x.has(P),"Unknown "+N+": "+P),x.get(P)),O=x=>d(x,"activity",b.id),R=x=>{const P=d(x.documentId,"document");W(P.revision===x.revision,"Stale Concept source revision");const N=P.id===b.id,C=P.kind==="stateTransition"&&P.basedOn.documentId===b.id&&u.relatedStates.some(G=>G.documentId===P.id&&G.revision===P.revision);W(N||C,"Concept source must refer to its Business Design or a declared State"),d(x.targetId,x.targetType,P.id)};for(const x of u.relatedStates){const P=d(x.documentId,"document");W(P.kind==="stateTransition"&&P.revision===x.revision&&P.basedOn.documentId===b.id,"Invalid Concept state reference")}for(const x of u.subsystems)for(const P of x.activityIds)O(P);for(const x of u.concepts){k(p,x.subsystemId,"subsystem");for(const P of x.information)P.responsibleSubsystemId&&k(p,P.responsibleSubsystemId,"responsible subsystem");for(const P of x.businessObjectIds)d(P,"object",b.id);for(const P of x.activityLinks)O(P.activityId);for(const P of x.sourceRefs)R(P)}for(const x of u.relations){k(m,x.fromConceptId,"concept"),k(m,x.toConceptId,"concept");for(const P of x.sourceRefs)R(P)}for(const x of u.handoffs){k(p,x.fromSubsystemId,"subsystem"),k(p,x.toSubsystemId,"subsystem"),W(x.fromSubsystemId!==x.toSubsystemId,"Handoff must cross subsystem boundary");for(const P of x.activityIds)O(P)}const D=(x,P)=>{const N=g(x.nodes,"subsystem view"),C=g(x.edges,"subsystem view edge");for(const q of N.values()){k(P,q.conceptId,"view concept"),k(p,q.subsystemId,"subsystem");const re=k(m,q.conceptId,"concept");for(const ee of q.fields)W(re.information.some(te=>te.id===ee.informationId),"Unknown information for subsystem view: "+ee.informationId)}for(const q of C.values()){const re=k(N,q.fromViewId,"subsystem view"),ee=k(N,q.toViewId,"subsystem view");W(re.subsystemId===ee.subsystemId,"View relationship crosses subsystem boundary"),W(q.relationIds.length>0,"Subsystem view relationship needs a concept relation");let te=re.conceptId;for(const de of q.relationIds){const ue=k(I,de,"concept relation");W(ue.fromConceptId===te,"Subsystem view relation path is disconnected: "+de),te=ue.toConceptId}W(te===ee.conceptId,"Subsystem view relation target differs")}W(new Set(x.handoffIds).size===x.handoffIds.length,"Duplicate subsystem view handoff");const G=new Set([...N.values()].map(q=>q.subsystemId));for(const q of x.handoffIds){const re=k(v,q,"handoff");W(G.has(re.fromSubsystemId)&&G.has(re.toSubsystemId),"Missing subsystem view handoff region: "+q)}};u.presentation.subsystemViews&&D(u.presentation.subsystemViews,m);for(const x of u.reviewGroups){k(p,x.subsystemId,"subsystem"),d(x.reviewer.roleId,"role",b.id);for(const G of x.relatedActivityIds)O(G);const P=g(x.graph.nodes.map(G=>({...G,id:G.conceptId})),"view concept");W(new Set(x.graph.conceptIds).size===x.graph.conceptIds.length&&x.graph.conceptIds.length===P.size&&x.graph.conceptIds.every(G=>P.has(G)),"View concepts and nodes differ");for(const G of x.graph.nodes){k(m,G.conceptId,"concept");for(const q of G.sourceActivityIds)O(q)}g(x.graph.edges,"view edge");for(const G of x.graph.edges){k(P,G.fromConceptId,"view concept"),k(P,G.toConceptId,"view concept");for(const q of G.relationIds)k(I,q,"concept relation")}x.graph.subsystemViews&&D(x.graph.subsystemViews,P);const N=g(x.capabilities,"capability"),C=g(x.capabilities.flatMap(G=>G.samples),"sample");g(x.limitations,"limitation"),g(x.structureStatements,"structure statement");for(const G of x.structureStatements){for(const q of G.sampleIds)k(C,q,"sample");for(const q of G.sourceRefs)R(q)}for(const G of N.values())if(G.testSpecification){const q=G.testSpecification;for(const[ee,te]of Object.entries(q))W(new Set(te).size===te.length,"Duplicate function specification reference: "+ee);const re=(ee,te)=>{const de=d(ee,te),ue=d(o.get(ee),"document");return W(ue.kind==="checkItems"&&ue.basedOn.documentId===b.id&&ue.basedOn.revision===b.revision,"Function Check source mismatch: "+ee),{value:de,doc:ue}};for(const ee of[...q.decisionCheckIds,...q.resultCheckIds])re(ee,"check");for(const ee of q.decisionExampleIds){const{value:te,doc:de}=re(ee,"example"),ue=On(de,te);W(ue.length>0,"Function decision table needs a Check: "+ee),W(ue.every(je=>q.decisionCheckIds.includes(je)),"Function decision table Check is not assigned: "+ee)}for(const ee of q.sampleIds){const te=G.samples.find(de=>de.id===ee);W(te,"Function result sample belongs to another capability: "+ee),W(te.checkIds.some(de=>q.resultCheckIds.includes(de)),"Function result sample needs a result Check: "+ee),W(te.checkIds.every(de=>q.resultCheckIds.includes(de)||q.decisionCheckIds.includes(de)),"Function result sample Check is not assigned: "+ee)}}for(const G of N.values())for(const q of G.samples){if(u.schemaVersion==="0.2"){W(q.checkIds.length>0,"Sample needs a Check: "+q.id),W(new Set(q.checkIds).size===q.checkIds.length,"Duplicate sample Check: "+q.id);for(const re of q.checkIds){d(re,"check");const ee=d(o.get(re),"document");W(ee.kind==="checkItems"&&ee.basedOn.documentId===b.id&&ee.basedOn.revision===b.revision,"Sample Check source mismatch: "+re)}}for(const re of q.blocks){k(P,re.card,"view concept");const ee=g(re.columns,"sample column");for(const te of re.columns)k(M,te.informationId,"concept information");g(re.rows,"sample row");for(const te of re.rows){const de=new Set;for(const ue of te.cells)k(ee,ue.columnId,"sample column"),W(!de.has(ue.columnId),"Duplicate sample cell: "+ue.columnId),de.add(ue.columnId);W(de.size===ee.size,"Sample row does not match columns")}}}}for(const x of u.presentation.landscapeRelationships){const P=k(j,x.from,"review group"),N=k(j,x.to,"review group");W(P.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const x of u.presentation.reviewBoundaries)k(j,x.from,"review group"),k(j,x.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const b=d(u.basedOn.documentId,"document");W(b.kind==="businessDesign","Check source is not BD"),W(b.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),W(new Set(u.items.map(m=>m.checkId)).size===u.items.length,"Duplicate Check ID");const g=new Set;for(const m of u.index){d(m.activityId,"activity",b.id),W(!g.has(m.activityId),"Duplicate Activity index"),g.add(m.activityId),W(new Set(m.checkIds).size===m.checkIds.length,"Duplicate Check binding");for(const I of m.checkIds)d(I,"check",u.id)}W(new Set(u.sections.map(m=>m.activityId??m.title)).size===u.sections.length,"Duplicate Activity section");for(const m of u.sections)m.activityId!==null&&(d(m.activityId,"activity",b.id),W(g.has(m.activityId),"Section missing from index")),l(m.preamble,u.id);const p=new Set(e.documents.filter(m=>m.kind==="conceptModel"&&m.basedOn.documentId===b.id&&m.basedOn.revision===b.revision).flatMap(m=>m.reviewGroups.flatMap(I=>I.capabilities.flatMap(j=>j.testSpecification?.decisionExampleIds??[]))));for(const m of u.guarantees){const I=m.blocks.length>0&&m.blocks.every(j=>j.kind==="example"&&p.has(j.exampleId)&&u.examples.some(v=>v.id===j.exampleId&&v.guaranteeId===m.id&&On(u,v).length>0));W(m.blocks.some(j=>j.kind==="prose"&&a(j.content))||I,"General guarantee prose required"),d(m.sectionId,"section",u.id);for(const j of m.blocks)if(j.kind==="prose")l(j.content,u.id);else{const v=d(j.exampleId,"example",u.id);W(v.guaranteeId===m.id,"Example owner mismatch")}}for(const m of u.examples){d(m.guaranteeId,"guarantee",u.id),W(m.columns.length>0,"Example columns required");for(const I of m.rows){W(I.length===m.columns.length,"Example column mismatch");for(const j of I)l(j,u.id)}}for(const m of u.items){const I=d(m.sectionId,"section",u.id);W(I.activityId===null?!u.index.some(j=>j.checkIds.includes(m.id)):u.index.some(j=>j.activityId===I.activityId&&j.checkIds.includes(m.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),W(a(m.fields.guarantee)||a(m.fields.condition)&&a(m.fields.expectedResult),"Check guarantee required");for(const j of Object.values(m.fields))l(j,u.id);W(I.activityId===null||u.index.some(j=>j.checkIds.includes(m.id)),"Unbound Check")}for(const m of u.notes)l(m.content,u.id);l(u.intro,u.id)}const r=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));W(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const u of r)W(c.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");W(c.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const u of e.sources){d(u.documentId,"document");const b=u.documentId+"@"+u.revision;W(!f.has(b),"Duplicate source descriptor"),f.add(b)}for(const u of e.externalDocuments)W(e.sources.some(b=>b.documentId===u.id&&b.revision===u.revision),"External source revision missing"),W(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:n.size}}const Y=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Ss(e,t,n){if(n==null)return;const o=pn(n);return e.append(Y("h3",t),o),o}function Cc(e,t){if(e===null)return;const n=pn(e),o=s=>String(s??"").replace(/\s+/g,""),i=new Set(t.map(s=>o(pn(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))i.has(o(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const jc={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Mc(e,t){const n=Y("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(d=>d.id===t),c=i.activities.find(d=>d.id===t);if(s){Ss(n,"Scope",String(s.scope)),n.append(Y("h3","Information"));const d=Y("ul");for(const a of s.information)d.append(Y("li",a));n.append(d)}else if(c){const d=i.exceptions?.filter(r=>r.activityId===c.id)??[];for(const[r,f]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const u=Ss(n,r,f==="who"?Wi(e,c.id)?.name??c.who:c[f]===null?null:String(c[f]));f==="result"&&u&&(u.dataset.businessResult="")}const a=Cc(c.exception,d);if(a||d.length){const r=Y("section");r.dataset.businessVariations="",r.append(Y("h3","通常以外の扱い")),a&&r.append(a);for(const f of d){const u=pn(f.description);u.dataset.businessException=f.id,r.append(Y("h4",f.name),u)}n.append(r)}const l=new Map([...i.objects,...i.activities].map(r=>[r.id,r.name]));for(const[r,f]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const u=i.relations.filter(g=>g.kind===r&&(g.fromId===t||g.toId===t));if(!u.length)continue;n.append(Y("h3",f));const b=u.map(g=>`${l.get(g.fromId)} → ${l.get(g.toId)} — ${g.label}`);if(r==="business-exception")for(const g of b)n.append(Y("p",g));else{const g=Y("ul");for(const p of b)g.append(Y("li",p));n.append(g)}}}else n.append(Y("p","項目を選択すると業務内容を表示します。"));return n}class Yn{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Y("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(pn(i.value));continue}if(i.kind==="text"){const a=Y("span",i.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(i.kind==="link"){t.append(Y("span",`${i.label} (${i.uri})`));continue}const s=Y("details"),c=Y("summary",i.label||i.targetId);s.append(c),t.append(s);let d=!1;s.addEventListener("toggle",()=>{if(!s.open||d)return;if(d=!0,o.has(i.targetId)){s.append(Y("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(Y("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(o).add(i.targetId),l=this.doc,r=l.guarantees.find(p=>p.id===i.targetId),f=l.examples.find(p=>p.id===i.targetId),u=l.items.find(p=>p.id===i.targetId),b=l.sections.find(p=>p.id===i.targetId),g=l.notes.find(p=>p.id===i.targetId);if(r){s.append(Y("h4",r.title));for(const p of r.blocks){if(!this.take(s))break;p.kind==="prose"?this.runs(s,p.content,a):this.example(s,p.exampleId,a)}}else if(f)this.example(s,f.id,a);else if(u){s.append(Y("p",`${u.checkId} · ${u.title}`+(this.requester?"":` · ${u.reviewState}`))),this.requester&&(u.reviewState==="要確認"||u.reviewState==="要修正")&&s.append(Y("p","確認が必要です。"));const p=this.requester?Object.fromEntries(Object.entries(u.fields).filter(([m])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(m))):u.fields;this.fields(s,p,a)}else b?(s.append(Y("h4",b.title)),this.runs(s,b.preamble,a)):g?(s.append(Y("h4",g.title)),this.runs(s,g.content,a)):i.targetId===l.id&&(s.append(Y("h4",l.title)),this.runs(s,l.intro,a))})}}fields(t,n,o,i=!1){for(const[s,c]of Object.entries(n)){if(!this.take(t))break;if(t.append(Y("h4",jc[s]??s)),s==="guarantee"&&i){const d=new Set;for(const a of c){const l=a.kind==="reference"?this.doc.guarantees.find(f=>f.id===a.targetId):void 0;if(!l){this.runs(t,[a],o);continue}if(d.has(l.id))continue;d.add(l.id);const r=new Set(o).add(l.id);for(const f of l.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,c,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!On(this.doc,s).length)return;const c=Y("table"),d=i?s.columns.indexOf("結果"):-1,a=d>0&&s.columns.at(-1)==="Check ID";if(a){const f=Y("colgroup");f.span=d,c.append(f);for(let m=d;m<s.columns.length;m++)c.append(Y("colgroup"));const u=Y("thead"),b=Y("tr"),g=Y("th","条件");g.colSpan=d,g.scope="colgroup",b.append(g);for(let m=d;m<s.columns.length;m++){const I=Y("th",s.columns[m]);I.rowSpan=2,I.scope="col",m===d?I.className="decision-result":s.columns[m]==="備考"&&(I.className="decision-notes"),b.append(I)}const p=Y("tr");for(const m of s.columns.slice(0,d)){const I=Y("th",m);I.scope="col",p.append(I)}u.append(b,p),c.append(u)}else{const f=Y("tr");for(const u of s.columns){if(!this.take(t))break;f.append(Y("th",u))}c.append(f)}const l=a?Y("tbody"):c;for(const f of s.rows){if(!this.take(t))break;const u=Y("tr");for(const[b,g]of f.entries()){if(!this.take(t))break;const p=Y("td");if(a&&b===d?p.className="decision-result":a&&s.columns[b]==="備考"&&(p.className="decision-notes"),i)for(const m of g){const I=m.kind==="reference"?this.doc.items.find(j=>j.id===m.targetId):void 0;I?p.append(Y("span",I.checkId)):this.runs(p,[m],o)}else this.runs(p,g,o);u.append(p)}l.append(u)}a&&c.append(l);const r=Y("div");r.className="json-example",r.append(c),t.append(r)}}function xs(e,t,n=e.model.checks,o=new Set,i=new Set){const s=Y("section");s.className="check-content json-checks";const c=e.model.business,d=n.filter(l=>l.basedOn.documentId===c.id);let a=!1;for(const l of d){const r=new Yn(l),f=l.index.filter(p=>p.activityId===t),u=new Set(l.index.flatMap(p=>p.checkIds)),b=(t?[...new Set(f.flatMap(p=>p.checkIds))]:l.items.filter(p=>!u.has(p.id)).map(p=>p.id)).filter(p=>!o.has(p)),g=l.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of g){(p.preamble.length||l.guarantees.some(m=>m.sectionId===p.id&&!i.has(m.id)))&&(a=!0),r.runs(s,p.preamble);for(const m of l.guarantees.filter(I=>I.sectionId===p.id&&!i.has(I.id)))r.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}for(const p of b){const m=l.items.find(v=>v.id===p);if(!m)continue;a=!0;const I=Y("section");I.className="check-item",I.dataset.checkId=m.checkId,I.dataset.elementId=m.id,I.append(Y("h3",m.checkId+" · "+m.title)),(m.reviewState==="要確認"||m.reviewState==="要修正")&&I.append(Y("p","確認が必要です。"));const j=Object.fromEntries(Object.entries(m.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));r.fields(I,j,new Set([m.id])),s.append(I)}if(!t)for(const p of l.notes)a=!0,r.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}return a||s.append(Y("p","この業務のテスト仕様はありません。")),s}function Lc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const c of n.filter(d=>d.basedOn.documentId===i.id&&d.basedOn.revision===i.revision)){const d=new Yn(c);for(const a of c.items.filter(l=>s.has(l.id))){const l=Y("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(Y("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(a.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));d.fields(l,r,new Set([a.id]),!0),o.append(l)}}return o}const Rc=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Dc(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(Rc,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Nc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const c of n.filter(d=>d.basedOn.documentId===i.id&&d.basedOn.revision===i.revision)){const d=c.examples.find(g=>g.id===s);if(!d||!On(c,d).length)continue;const a=new Yn(c,!0),l=c.guarantees.find(g=>g.id===d.guaranteeId),r=Y("section");r.dataset.decisionExample=s;for(const g of l?.blocks??[])g.kind==="prose"&&a.runs(r,Dc(g.content),new Set([l.id]));d.rows.length>1&&r.append(Y("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=d.columns.indexOf("結果"),u=f>0?f:d.columns.length;d.rows.some(g=>g.slice(0,u).some(p=>p.some(m=>m.kind==="text"&&/^\s*[-‐]\s*$/.test(m.value))))&&r.append(Y("p","‐＝値不問。")),a.example(r,s,new Set([s]),!0),o.append(r)}return o}function Pc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const c of n.filter(d=>d.basedOn.documentId===i.id&&d.basedOn.revision===i.revision)){const d=new Yn(c,!0);for(const a of c.items.filter(l=>s.has(l.id))){const l=Y("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(Y("p","確認が必要です。")),a.fields.condition?.length&&(l.append(Y("h4","条件")),d.runs(l,a.fields.condition,new Set([a.id])));const r=Object.fromEntries(Object.entries(a.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=Y("details");f.append(Y("summary","期待結果")),d.fields(f,r,new Set([a.id]),!0),l.append(f)}o.append(l)}}return o}function Tc(e,t,n=e.model.checks,o=new Set){const i=Y("section");i.className="check-content json-checks result-checks";const s=e.model.business,c=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===s.id&&a.basedOn.revision===s.revision)){const a=new Yn(d,!0),l=d.items.filter(r=>c.has(r.id)&&o.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);l.length&&i.append(Y("p",l.map(r=>r.checkId).join("、")));for(const r of d.items.filter(f=>c.has(f.id))){if(l.includes(r))continue;const f=Y("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(Y("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(Y("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(r.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));a.fields(f,u,new Set([r.id]),!0);const b=Y("details"),g=Y("summary","Check の詳細");b.append(g,Y("p",r.title)),r.fields.condition?.length&&a.runs(b,r.fields.condition,new Set([r.id])),f.append(b),i.append(f)}}return i}const ii=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function qc(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),o=[],i=new Set,s=new Set,c=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),d=(r,f)=>c.some(u=>u.items.some(b=>b.id===r)&&(!f||u.index.some(b=>b.activityId===f&&b.checkIds.includes(r)))),a=(r,f,u,b,g=[])=>{const p=f.testSpecification,m=(p?.decisionCheckIds??[]).filter(R=>d(R,u)),I=(p?.resultCheckIds??[]).filter(R=>d(R,u)),j=(p?.decisionExampleIds??[]).filter(R=>c.some(D=>{const x=D.examples.find(N=>N.id===R),P=x?On(D,x):[];return P.length>0&&P.every(N=>d(N,u))})),v=f.samples.filter(R=>(!p||p.sampleIds.includes(R.id))&&R.checkIds?.length&&(p?R.checkIds.every(D=>d(D,u)):R.checkIds.some(D=>d(D,u)))),M=j.flatMap(R=>c.flatMap(D=>{const x=D.examples.find(P=>P.id===R);return x?On(D,x).filter(P=>d(P,u)):[]})),k=[...new Set([...m,...I,...M,...v.flatMap(R=>(R.checkIds??[]).filter(D=>d(D,u)))])];if(!k.length)return;const O=`fn:${u??"_"}:${r}:${f.id}`;s.has(O)||(s.add(O),o.push({key:O,activityId:u,groupId:r,capability:f,name:b,samples:v,checkIds:k,decisionCheckIds:m,resultCheckIds:I,decisionExampleIds:j,decisionTableCheckIds:[...new Set(M)],businessSections:g}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const r of l)if(!(!ii(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!ii(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const u=e.model.reviewGroups.find(p=>p.id===f.groupId),b=u?.capabilities.find(p=>p.id===f.capabilityId);if(!u||!b)continue;i.add(JSON.stringify([u.id,b.id]));const g=[];if(Array.isArray(f.businessSections))for(const p of f.businessSections){if(!ii(p)||!Array.isArray(p.pages)||p.kind!=="result"&&p.kind!=="exception"||p.kind==="exception"&&(typeof p.exceptionId!="string"||!e.business.exceptions?.some(I=>I.id===p.exceptionId&&I.activityId===r.activityId)))continue;const m=[...new Set(p.pages.filter(I=>I==="decision"||I==="result"))];m.length&&g.push({kind:p.kind,exceptionId:p.kind==="exception"?p.exceptionId:void 0,pages:m})}a(u.id,b,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():b.title,g)}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)i.has(JSON.stringify([r.id,f.id]))||a(r.id,f,void 0,f.title);return o}function As(e,t,n,o){const i=e.filter(c=>c.groupId===t&&c.capability.id===n),s=i.find(c=>c.samples.some(d=>d.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const c of i){if(!c.capability.testSpecification)continue;const d=c.capability.samples.find(l=>l.id===o),a=c.decisionExampleIds.length?c.decisionTableCheckIds:c.decisionCheckIds;if(d?.checkIds?.some(l=>a.includes(l)))return{kind:"decision",key:"decision:"+c.key}}}const wn=["landscape","overview"];function Wc(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const c=document.createElement("aside");c.id="design-explorer",c.setAttribute("aria-label","設計ナビゲーション"),c.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",s.append(c,d),d.append(o,n);const a=document.createElement("div");a.className="shell-open-tabs",i.before(a),a.append(i),za(a);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(l);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),a.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),a.append(f);const u=document.createElement("section");u.id="concept-workspace",u.hidden=!0,u.setAttribute("aria-label","データ構造"),u.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(u);const b=document.createElement("section");b.id="states-workspace",b.hidden=!0,b.setAttribute("aria-label","状態遷移"),b.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(b);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',d.append(g);const p=document.createElement("aside");p.id="test-related-panel",p.className="spec-related",p.setAttribute("aria-label","関連資料"),p.hidden=!0,p.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const m=document.createElement("section");m.id="empty-workspace",m.hidden=!0,m.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(m);const I=n.querySelector("#node-list-drawer");c.append(I);const j=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),M=c.querySelector("input"),k=c.querySelector("nav"),O=u.querySelector("iframe"),R=u.querySelector(".concept-related"),D=b.querySelector("article"),x="alder-explorer-v1:"+location.pathname,P=location.protocol==="file:"||location.origin==="null"?"*":location.origin,N=window.__alderConceptHtml;let C,G,q,re,ee={},te=[],de=[...wn],ue=new Map,je=new Map,he=new Map,xe=new Map;const L=h=>he.get(h)??h,z=h=>xe.get(h)??h,V=h=>G?.findGroup(ue.get(h??"")),le=h=>q?.contentFor(ue.get(h)??""),Z=(h,y)=>q?.findDataExample(ue.get(h)??"",y),we=h=>q?.examplesFor(ue.get(h)??"")??[],Oe=h=>wn.includes(h)?"全体図":le(h)?.title??V(h)?.name??ee[je.get(h)??""]?.name,me=()=>{const h=t.business(),y=h.design?.model;return y?[...y.checks,...h.relatedChecks??[]].filter(A=>A.basedOn.documentId===y.business.id):[]},se=()=>qc(C,me()),ge=h=>se().find(y=>y.key===(h.startsWith("decision:")?h.slice(9):h)),Pe=h=>se().filter(y=>y.name===h.name).length>1?h.name+"（"+(t.business().activities.find(y=>y.id===h.activityId)?.name??"その他")+"）":h.name,Te=h=>me().some(y=>y.index.some(A=>A.activityId===h)||y.sections.some(A=>A.activityId===h)),Dt=h=>new Set(se().filter(y=>y.activityId===h).flatMap(y=>y.checkIds)),rn=h=>{const y=new Set(se().filter(A=>A.activityId===h).flatMap(A=>A.decisionExampleIds));return new Set(me().flatMap(A=>A.examples.filter(S=>y.has(S.id)).map(S=>S.guaranteeId)))},Gt=h=>{const y=Dt(h),A=rn(h);return me().some(S=>S.index.some(T=>T.activityId===h&&T.checkIds.some(H=>!y.has(H)))||S.sections.some(T=>T.activityId===h&&(T.preamble.length>0||S.guarantees.some(H=>H.sectionId===T.id&&!A.has(H.id)))))},Gr=()=>me().some(h=>h.items.some(y=>!h.index.some(A=>A.checkIds.includes(y.id)))||h.sections.some(y=>y.activityId===null)||h.notes.length>0),Hr=h=>{const y=ge(h);return y?y.capability.testSpecification?Pe(y)+"・"+(h.startsWith("decision:")?"可否":"結果"):y.name:(h==="@unassigned"?"未割当":h.startsWith("remaining:")?t.business().activities.find(A=>A.id===h.slice(10))?.name:h.startsWith("checks:")?t.business().activities.find(A=>A.id===h.slice(7))?.name:h==="@overview"?"テスト仕様":void 0)??h},no=n.querySelector("#formattedMarkdownDrawer");no&&s.append(no),s.append(R,p),vs(R,s,x+":drawer-width"),vs(p,s,x+":test-drawer-width");let oo=!1;const rt=t.rightDrawer??{isOpen:()=>oo,setOpen:h=>{oo=h}};let ne="business",De=!1,Ke=[],B="overview",Xe=[],at="",ct=[],Ce="@overview",gn,Nt=innerWidth>800,io=!1,so=!0,dt=!1,Tn;const lt=new Map,bt=new Map([["overview",O]]),ot=new Map,an=new Map,cn=new Map,Ne=new Map,Ht=new Map,gt=new Set,Ve=new Set,dn=new Set,Be=new Map;let ye;try{if(ye=JSON.parse(sessionStorage.getItem(x)||"null"),ye){if(dt=ye.overviewClosed===!0,Tn=typeof ye.documentKey=="string"?ye.documentKey:void 0,Nt=typeof ye.left=="boolean"?ye.left:Nt,Array.isArray(ye.expanded)){Ve.clear();for(const h of ye.expanded)typeof h=="string"&&Ve.add(h)}Xe=Array.isArray(ye.states)?ye.states.filter(h=>typeof h=="string"):[],t.rightDrawer||(typeof ye.rightOpen=="boolean"?oo=ye.rightOpen:typeof ye.right?.["concept:"+ye.active]=="boolean"&&(oo=ye.right["concept:"+ye.active]))}}catch{}function _r(){if(!(!ye||Tn!==t.business().key||!De)){for(const h of Array.isArray(ye.overviewModes)?ye.overviewModes:[])V(h)&&gt.add(h);for(const[h,y]of Object.entries(ye.lastExamples??ye.examples??{}))typeof y=="string"&&Z(h,y)&&Ht.set(h,y);for(const[h,y]of Object.entries(ye.examples??{}))typeof y=="string"&&Z(h,y)&&Ne.set(h,y);for(const[h,y]of Object.entries(ye.selected??{}))typeof y=="string"&&te.includes(y)&&ot.set(h,y);Ke=[...new Set((Array.isArray(ye.concepts)?ye.concepts:[]).filter(h=>typeof h=="string"&&de.includes(h)))],B=Ke.includes(ye.active)?ye.active:"landscape"}}let ln;const We=()=>{try{sessionStorage.setItem(x,JSON.stringify({documentKey:gn,overviewClosed:dt,selected:Object.fromEntries(ot),examples:Object.fromEntries(Ne),lastExamples:Object.fromEntries(Ht),overviewModes:[...gt],left:Nt,expandedVersion:4,expanded:[...Ve],concepts:Ke,active:B,states:Xe,specs:ct,activeSpec:Ce,specExamples:Object.fromEntries(lt),...t.rightDrawer?{}:{rightOpen:rt.isOpen()}}))}catch{}},_t=()=>{ne==="concept"&&Be.set("drawer:"+B,R.querySelector(".concept-drawer-body").scrollTop),ne==="concept"&&rt.isOpen()&&gt.has(B)&&Be.set("review-overview:"+B,R.querySelector(".data-review-overview").scrollTop),ne==="concept"&&Ne.has(B)&&Be.set("example:"+B+":"+Ne.get(B),R.querySelector(".data-examples-panel").scrollTop),ne==="states"&&at&&Be.set("state:"+at,D.scrollTop),ne==="tests"&&Be.set("tests:"+Ce,g.querySelector(".test-spec-page").scrollTop),ne==="concept"&&B==="landscape"&&Be.set("concept:landscape",u.querySelector(".concept-review-landscape").scrollTop)};function Ge(h=!0){if(io)return;const y=new URL(location.href);if(y.searchParams.set("view",ne),y.searchParams.delete("concept"),y.searchParams.delete("dataExample"),y.searchParams.delete("dataView"),ne==="concept"&&rt.isOpen()&&gt.has(B)?y.searchParams.set("dataView","overview"):ne==="concept"&&V(B)&&!Ne.has(B)&&y.searchParams.set("dataView","structure"),ne==="concept"&&rt.isOpen()&&Ne.has(B)&&y.searchParams.set("dataExample",Ne.get(B)),ne==="tests"&&lt.has(Ce)&&y.searchParams.set("dataExample",lt.get(Ce)),y.searchParams.delete("state"),y.searchParams.delete("activity"),y.searchParams.delete("object"),y.searchParams.delete("spec"),ne==="concept"&&y.searchParams.set("concept",B),ne==="states"&&at&&y.searchParams.set("state",at),ne==="tests"&&y.searchParams.set("spec",Ce),ne==="business"){const A=t.business(),S=A.views?.find(T=>T.key===A.viewKey);S?.activity?y.searchParams.set("activity",S.activity):S?.object&&y.searchParams.set("object",S.object)}y.href!==location.href&&history[h?"pushState":"replaceState"]({alderShell:!0},"",y)}function Ae(h,y,A){const S=document.createElement(y);return S.textContent=A,h.append(S),S}function ut(h){h!==ne&&(ne==="business"?t.capture():_t(),ne=h),n.hidden=ne!=="business",u.hidden=ne!=="concept",b.hidden=ne!=="states",g.hidden=ne!=="tests",m.hidden=ne!=="empty",e.dataset.workspaceArea=ne,ne==="business"&&t.refresh(),vt(),ft()}function St(h,y=!0){De&&(h==="subsystems"&&(h="landscape"),de.includes(h)&&(_t(),Ke.includes(h)||Ke.push(h),B=h,ut("concept"),ei(),yt(),We(),y&&Ge()))}function Jr(){_t(),Ne.delete(B),gt.add(B),ei(),R.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer-overview:"+B)??0,We(),Ge()}function Kr(h,y=!0){if(h&&!Z(B,h))return;const A=!Ne.has(B),S=R.querySelector(".concept-drawer-body");A&&Be.set("drawer-overview:"+B,S.scrollTop),_t(),gt.delete(B),h?(Ne.set(B,h),Ht.set(B,h)):Ne.delete(B),rt.setOpen(!0),ei(),A&&(S.scrollTop=0),We(),Ge(),y&&R.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}R.querySelector(".concept-example-back").onclick=()=>{Jr(),R.querySelector(".data-review-overview").focus({preventScroll:!0})};function yn(h,y=!0){t.business().states?.some(A=>A.id===h)&&(_t(),Xe.includes(h)||Xe.push(h),at=h,ut("states"),oa(),yt(),We(),y&&Ge())}function Jo(h){return h.startsWith("decision:")&&ge(h)&&!ge(h)?.capability.testSpecification?ge(h).key:ge(h)||h==="@overview"||h==="@unassigned"||h.startsWith("checks:")&&Te(h.slice(7))||h.startsWith("remaining:")&&Gt(h.slice(10))?h:t.business().activities.some(y=>y.id===h)?se().find(y=>y.activityId===h)?.key??(Te(h)?"checks:"+h:"@overview"):"@overview"}function xt(h,y=!0){const A=t.business();if(!A.design?.model||!A.key)return;h=Jo(h),ne==="tests"&&h!==Ce&&_t(),ct.includes(h)||ct.push(h),Ce=h;const S=ge(h);io||(S?.capability.testSpecification?Ve.add("tests-function-"+S.key):S?.activityId?Ve.add("tests-activity-"+S.activityId):h.startsWith("checks:")?Ve.add("tests-activity-"+h.slice(7)):h.startsWith("remaining:")?Ve.add("tests-activity-"+h.slice(10)):S&&Ve.add("tests-other")),ut("tests"),Ko(),yt(),ft(),We(),y&&Ge()}function Ko(){const h=t.business().design;if(!h?.model)return;const y=g.querySelector(".test-spec-page"),A=ge(Ce);if(A){const S=document.createElement("section");S.className="test-spec-sample";const T=G?.findGroup(A.groupId),H=A.samples.find(ae=>ae.id===lt.get(Ce))??A.samples[0],U=!!A.capability.testSpecification,K=Ce.startsWith("decision:");if(U)if(Ae(S,"h2",A.name),Ae(S,"h3",K?"可否判定":"処理結果"),K)A.decisionExampleIds.length?S.append(Nc(h,A.decisionExampleIds,me())):A.decisionCheckIds.length?S.append(Pc(h,A.decisionCheckIds,me())):Ae(S,"p","可否条件の記載はありません。");else{const ae=T&&H&&q?new Set(A.samples.flatMap(Ee=>Ee.checkIds??[])):new Set;if(S.append(Tc(h,A.resultCheckIds,me(),ae)),T&&H&&q){Ae(S,"h3","データ例");const Ee=document.createElement("div");Ee.className="data-examples-panel test-spec-examples",S.append(Ee),q.renderDataExample(Ee,T,H.id,qe=>{Be.set("tests:"+Ce,y.scrollTop),lt.set(Ce,qe),Ko(),We(),Ge(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:A.capability.id,sampleIds:A.samples.map(qe=>qe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(T&&H&&q){const ae=document.createElement("div");ae.className="data-examples-panel test-spec-examples",S.append(ae),q.renderDataExample(ae,T,H.id,Ee=>{Be.set("tests:"+Ce,y.scrollTop),lt.set(Ce,Ee),Ko(),We(),Ge(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:A.capability.id,heading:A.name,sampleIds:A.samples.map(Ee=>Ee.id),renderSpecification:Ee=>Ee.append(Lc(h,H.checkIds??[],me()))})}y.replaceChildren(S)}else if(Ce==="@overview")y.replaceChildren(),Ae(y,"p","左のメニューからテスト仕様を選択してください。");else if(Ce.startsWith("remaining:")){const S=Ce.slice(10);y.replaceChildren(xs(h,S,me(),Dt(S),rn(S)))}else y.replaceChildren(xs(h,Ce.startsWith("checks:")?Ce.slice(7):void 0,me()));Yr(A),y.scrollTop=Be.get("tests:"+Ce)??0}function qn(h){h||(dt=!1),ut("business"),h?t.openActivity(h):(dt=!1,t.openOverview()),ft(),yt(),Ge()}function Xr(h){ut("business"),t.openObject(h),ft(),yt(),Ge()}function rs(h){const y=t.business(),A=y.design?.model;return A?[...new Set(A.states.filter(S=>S.objectId===h&&S.basedOn.documentId===A.business.id&&S.basedOn.revision===A.business.revision).flatMap(S=>S.transitions.map(T=>T.activityId)))]:[...new Set((y.design?.objectStateTransitions?.[h]?.model?.transitions??[]).flatMap(S=>S.activityId?[S.activityId]:[]))]}function as(h){return(t.business().states??[]).filter(y=>rs(y.id).includes(h))}function cs(h){const y=t.business(),A=y.design?.model,S=C?.model.concepts.find(T=>T.id===h);return!A||!C||!S?[]:(y.states??[]).filter(T=>S.businessObjectIds.includes(T.id)&&A.states.some(H=>H.objectId===T.id&&H.basedOn.documentId===A.business.id&&H.basedOn.revision===A.business.revision&&C.model.relatedStates.some(U=>U.documentId===H.id&&U.revision===H.revision)))}function Xo(h,y,A="状態遷移"){if(!y.length)return;const S=document.createElement("section");S.className="shell-related-links",Ae(S,"h3",A);for(const T of y){const H=Pt(S,T.name,()=>yn(T.id));H.dataset.relatedState=T.id}h.append(S)}function ds(h){const y=C?.model.reviewGroups.find(S=>S.id===h.groupId);if(!y)return[];const A=new Set(y.graph.nodes.map(S=>S.conceptId));return[...new Set(h.samples.flatMap(S=>S.blocks.map(T=>T.card)))].filter(S=>A.has(S)&&C?.model.concepts.some(T=>T.id===S))}function Pt(h,y,A){const S=document.createElement("button");return S.type="button",S.className="shell-evidence",Ae(S,"span",y),S.onclick=A,h.append(S),S}function Zo(h,y){const A=y.filter(T=>T.capability.testSpecification);if(!A.length)return;const S=document.createElement("section");S.className="shell-test-links",Ae(S,"h3","テスト仕様書");for(const T of A)for(const[H,U]of[["decision:","可否判定"],["","処理結果"]]){const K=H+T.key,ae=Pt(S,Pe(T)+"・"+U,()=>xt(K));ae.dataset.relatedSpec=K}h.append(S)}function Zr(h,y){const A=se().filter(K=>K.activityId===y&&K.capability.testSpecification),S=C?.model.presentation.activityViews,T=Array.isArray(S)?S.find(K=>K&&typeof K=="object"&&K.activityId===y):void 0,H=Array.isArray(T?.uncreatedTestSections)?T.uncreatedTestSections:[],U=h.querySelectorAll("[data-business-result],[data-business-exception]");for(const K of Array.from(U)){const ae=K.dataset.businessException,Ee=ae?"exception":"result",qe=ae??"result",ze=A.flatMap(Ze=>Ze.businessSections.filter(pt=>pt.kind===Ee&&(Ee==="result"||pt.exceptionId===ae)).flatMap(pt=>pt.pages.filter($=>$==="decision"?Ze.decisionCheckIds.length||Ze.decisionExampleIds.length:Ze.resultCheckIds.length||Ze.samples.length).map($=>({target:Ze,page:$})))),At=document.createElement("section");At.className="shell-section-links",At.setAttribute("aria-label","テスト仕様書");const it=new Set;for(const{target:Ze,page:pt}of ze){const $=(pt==="decision"?"decision:":"")+Ze.key;if(it.has($))continue;it.add($);const ke=Pt(At,Pe(Ze)+"・"+(pt==="decision"?"可否判定":"処理結果"),()=>xt($));ke.dataset.relatedSpec=$}if(!it.size){const Ze=H.includes(qe)||!A.length&&!Te(y),pt=Ae(At,"p",Ze?"テスト仕様書未作成":"テスト仕様書との対応未確認");pt.className="shell-spec-warning"}K.after(At)}Zo(h,A.filter(K=>!K.businessSections.length))}function Yr(h){const y=p.querySelector(".spec-related-content");if(y.replaceChildren(),!h?.capability.testSpecification)return;const A=t.business().activities.find(H=>H.id===h.activityId),S=G?.findGroup(h.groupId);if(A){Ae(y,"h3","Activity");const H=Pt(y,A.name,()=>qn(A.id));H.dataset.relatedActivity=A.id}if(S){Ae(y,"h3","概念モデル");const H=Pt(y,S.name,()=>St(L(S.id)));H.dataset.relatedGroup=S.id}const T=ds(h);if(T.length){Ae(y,"h3","概念");for(const H of T){const U=C.model.concepts.find(ae=>ae.id===H),K=Pt(y,U.name,()=>St(z(H)));K.dataset.relatedConcept=H}}h.activityId&&Xo(y,as(h.activityId),"状態遷移（同じ Activity）")}function Qr(h,y){Ae(h,"h3","Activity");const A=t.business(),S=V(B),T=C?.model.concepts.find(U=>U.id===y),H=S?.concepts[y]?.sourceActivities??S?.activities??T?.activityLinks.filter(U=>U.uses.includes("生成")).map(U=>U.activityId)??[];for(const U of H){const K=A.activities.find(Ee=>Ee.id===U);if(!K)continue;const ae=document.createElement("button");ae.className="shell-evidence",Ae(ae,"span",K.name),ae.title=K.name+"を業務タブで開く",ae.setAttribute("aria-label",ae.title),ae.onclick=()=>qn(K.id),h.append(ae)}}function Yo(h){const y=V(h);return y?G?.graph(y.id):h==="overview"?G?.overviewGraph():void 0}function ls(h){const y=an.get(B),A=y?Yo(B)?.tables[y]:void 0;return A?.conceptId===h?A:void 0}function ea(h,y){const A=ls(y)??V(B)?.concepts[y]??{...ee[y],sources:void 0};h.replaceChildren(),Ae(h,"p",A.note),Ae(h,"h3","持つ情報");const S=document.createElement("ul");for(const[,T]of A.fields)Ae(S,"li",T);if(h.append(S),A.sources?.length){Ae(h,"h3","情報の出所・対象時点");const T=document.createElement("ul");for(const H of A.sources)Ae(T,"li",H);h.append(T)}Qr(h,y),Zo(h,se().filter(T=>ds(T).includes(y))),Xo(h,cs(y))}function Qo(h){const y=R.querySelector(".shell-heading strong");y.textContent=h,R.setAttribute("aria-label",h)}function us(h=!1){V(B)&&(ot.delete(B),an.delete(B),cn.delete(B),h||bt.get(B)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},P),ro(),vt(),R.querySelector(".concept-drawer-body").scrollTop=0,We())}R.querySelector(".concept-selection-clear").onclick=()=>{us(),Ne.has(B)?R.querySelector(".concept-example-back").focus({preventScroll:!0}):R.querySelector(".data-review-overview").focus({preventScroll:!0})};function ro(){const h=R.querySelector(".concept-related-content");R.querySelector(".concept-selection").hidden=!!V(B)&&!ot.has(B)&&!cn.has(B),R.querySelector(".concept-selection>h2").hidden=!V(B),R.querySelector(".concept-selection-clear").hidden=!V(B);const y=cn.get(B);if(y&&re){const H=re.describe(h,{kind:"group",id:y});Qo(H);return}if(B==="landscape"&&ln){h.replaceChildren();for(const[H,U]of re.sections){Ae(h,"h3",H);const K=document.createElement("ul");for(const ae of U)Ae(K,"li",ae);h.append(K)}Qo("サブシステムの情報");return}const A=ot.get(B),S=V(B),T=De&&A?ls(A)?.name??S?.concepts[A]?.name??ee[A].name:S?.name??"データ構造の情報";Qo(T),De&&A?ea(h,A):(h.replaceChildren(),S||Ae(h,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function fs(h){h.onload=()=>{ps(),h.contentDocument&&(gs(h.contentDocument),ys(h.contentDocument));const y=h.dataset.conceptView??"overview";if(!G||!C)return;const A=V(y),S=A?G.graph(A.id):y==="overview"?G.overviewGraph():{ids:te,edges:G.edges,tables:ee};h.contentWindow?.postMessage({type:"alder-concept-data",graph:S,focus:je.get(y),viewKey:y,documentKey:gn??C.model.id,clearSelectionOnBackground:!!A},P);const T=ot.get(y);T&&h.contentWindow?.postMessage({type:"alder-concept-highlight",id:T},P)}}fs(O),O.dataset.conceptView="overview";function ta(){R.querySelector(".concept-page-details").hidden=!0,R.querySelector(".concept-example-back").hidden=!0;const h=R.querySelector(".data-review-overview");h.hidden=!0,h.replaceChildren();const y=R.querySelector(".data-examples-panel");y.hidden=!0,y.replaceChildren(),delete y.dataset.dataExample,ln?.root.remove(),ln=void 0;for(const[A,S]of bt)A!=="overview"&&(S.remove(),bt.delete(A));O.removeAttribute("src"),O.removeAttribute("srcdoc"),ot.clear(),an.clear(),cn.clear()}function ei(){u.setAttribute("aria-label",B==="landscape"||V(B)?"サブシステム":"データ構造"),u.querySelector(".concept-empty").hidden=De;const h=u.querySelector(".concept-review-landscape"),y=V(B),A=R.querySelector(".concept-page-details"),S=R.querySelector(".data-review-overview"),T=R.querySelector(".data-examples-panel");if(A.hidden=!De||!y,S.hidden=!De||!y||Ne.has(B),T.hidden=!De||!y||!Ne.has(B),R.querySelector(".concept-example-back").hidden=T.hidden,De&&y){const U=se();Ga(S,y,q,(ae,Ee)=>{const qe=As(U,y.id,ae,Ee);if(qe)return{kind:qe.kind,open:()=>{const ze=As(se(),y.id,ae,Ee);ze&&(ze.sampleId?lt.set(ze.key,ze.sampleId):lt.delete(ze.key),xt(ze.key))}}},ae=>qn(ae),t.business().activities),Zo(S,U.filter(ae=>ae.groupId===y.id));const K=Ne.get(B)??Ht.get(B)??we(B)[0]?.id;K&&q.renderDataExample(T,y,K,ae=>Kr(ae)),S.scrollTop=Be.get("review-overview:"+B)??0,T.scrollTop=Be.get("example:"+B+":"+K)??0}if(h.hidden=!De||!wn.includes(B),De&&wn.includes(B)&&(B==="landscape"&&!ln&&(ln=Za(document,C,gn??C.model.id,U=>St(L(U)))),Ba(h,ln?.root,B==="overview"?"graph":"overview"),B==="landscape"&&ln?.restore()),De&&B!=="landscape"&&!bt.has(B)){const U=document.createElement("iframe");U.className="concept-frame",U.dataset.conceptView=B,U.title=y?y.name+"のデータ構造":ee[je.get(B)].name+"と隣接する概念",U.hidden=!0,bt.set(B,U);const K=je.get(B);K&&ot.set(B,ot.get(B)??K),fs(U),u.querySelector(".concept-main").append(U)}for(const[U,K]of bt)K.hidden=!De||U!==B,De&&U===B&&!K.hasAttribute("src")&&!K.hasAttribute("srcdoc")&&(N?K.srcdoc=N:K.src=new URL("concept.html?view=overview"+(V(U)?"&group="+encodeURIComponent(V(U).id):U==="overview"?"":"&focus="+encodeURIComponent(je.get(U))),document.baseURI).href);const H=ot.get(B);H&&bt.get(B)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:H},P),ro(),vt(),R.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer:"+B)??0}function vn(){const h=t.business(),y=h.views?.find(A=>A.activity!==void 0||A.object!==void 0||!dt);y?(ut("business"),t.activateView(y.key)):Ke.length?St(Ke.at(-1),!1):Xe.length?yn(Xe.at(-1),!1):ct.length?xt(ct.at(-1),!1):ut("empty")}function na(){if(dt=!0,ne==="business"){const h=t.business().views?.find(y=>y.key===t.business().viewKey);!h?.activity&&!h?.object&&vn()}yt(),ft(),We(),Ge(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function oa(){D.replaceChildren();const h=t.business().states?.find(K=>K.id===at);if(!h)return;const y=t.statePanel(h.id);y?D.append(y):Ae(D,"p","この対象の状態遷移は未定義です。");const A=p.querySelector(".spec-related-content");A.replaceChildren();const S=rs(h.id),T=t.business().activities.filter(K=>S.includes(K.id));if(T.length){Ae(A,"h3","Activity");for(const K of T){const ae=Pt(A,K.name,()=>qn(K.id));ae.dataset.relatedActivity=K.id}}const H=C?.model.concepts.filter(K=>cs(K.id).some(ae=>ae.id===h.id))??[];if(H.length){Ae(A,"h3","概念");for(const K of H){const ae=Pt(A,K.name,()=>St(z(K.id)));ae.dataset.relatedConcept=K.id}}const U=se().filter(K=>K.activityId&&S.includes(K.activityId)&&K.capability.testSpecification);if(U.length){Ae(A,"h3","Activity に関連するテスト仕様書");for(const K of U)for(const[ae,Ee]of[["decision:","可否判定"],["","処理結果"]]){const qe=ae+K.key,ze=Pt(A,Pe(K)+"・"+Ee,()=>xt(qe));ze.dataset.relatedSpec=qe}}D.scrollTop=Be.get("state:"+at)??0}let ti="";function yt(){for(const S of Array.from(i.querySelectorAll(".tab"))){const T=t.business().views?.find(U=>U.key===S.dataset.key);S.hidden=dt&&T?.activity===void 0&&T?.object===void 0;const H=!S.hidden&&ne==="business"&&S.dataset.key===t.business().viewKey;S.classList.toggle("active",H),S.querySelector("button")?.setAttribute("aria-current",String(H))}const h=(S,T,H)=>{S.replaceChildren();for(const U of T){const K=H==="concept"?Oe(U):t.business().states?.find(it=>it.id===U)?.name??U,ae=ne===H&&U===(H==="concept"?B:at),Ee=document.createElement("div");Ee.className="tab"+(ae?" active":"");const qe=H==="concept"&&(U==="landscape"||V(U))?"subsystems":H;Ee.dataset.viewKind=qe;const ze=document.createElement("button");ze.id=(H==="concept"?"concept-tab-":"state-tab-")+U,pi(ze,qe,K),ze.setAttribute("aria-current",String(ae)),ze.onclick=()=>H==="concept"?St(U):yn(U),Ee.append(ze);const At=mi((qe==="subsystems"?"サブシステム：":H==="concept"?"データ構造：":"状態遷移：")+K+"のタブを閉じる");At.onclick=()=>{_t(),H==="concept"?(Ke=Ke.filter(it=>it!==U),U!=="overview"&&(bt.get(U)?.remove(),bt.delete(U)),ot.delete(U),an.delete(U),cn.delete(U),Ne.delete(U),Ht.delete(U),gt.delete(U),ne===H&&B===U&&(Ke.length?St(Ke.at(-1),!1):vn())):(Xe=Xe.filter(it=>it!==U),ne===H&&at===U&&(Xe.length?yn(Xe.at(-1),!1):vn())),yt(),ft(),We(),Ge(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Ee.append(At),S.append(Ee)}};h(l,Ke,"concept"),h(r,Xe,"states"),f.replaceChildren();for(const S of ct){const T=Hr(S),H=document.createElement("div");H.className="tab"+(ne==="tests"&&S===Ce?" active":""),H.dataset.viewKind="tests";const U=document.createElement("button");U.id="spec-tab-"+S,pi(U,"tests",T),U.setAttribute("aria-current",String(ne==="tests"&&S===Ce)),U.onclick=()=>xt(S);const K=mi("テスト仕様："+T+"のタブを閉じる");K.onclick=()=>{ct=ct.filter(ae=>ae!==S),ne==="tests"&&Ce===S&&(ct.length?xt(ct.at(-1),!1):vn()),yt(),ft(),We(),Ge()},H.append(U,K),f.append(H)}const y=a.querySelector(".tab.active:not([hidden])"),A=ne==="business"?"business:"+t.business().viewKey:ne==="concept"?"concept:"+B:ne==="states"?"states:"+at:ne==="tests"?"tests:"+Ce:"";y?(A!==ti&&Ua(a,y),ti=A):ti=""}function ia(){innerWidth<=800&&ao(!1)}function ft(){const h=k.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,y=k.scrollTop,A=t.business(),S=M.value.trim().toLocaleLowerCase();k.replaceChildren();const T=($,ke,Ye)=>({kind:"item",id:$,name:ke,key:Ye}),H=($,ke,Ye)=>({kind:"group",id:$,name:ke,children:Ye}),U=se(),K=$=>T($.key,$.name,"tests:"+$.key),ae=U.filter($=>$.capability.testSpecification),Ee=U.filter($=>!$.capability.testSpecification),qe=ae.map($=>H("tests-function-"+$.key,Pe($),[T("decision:"+$.key,"可否判定","tests:decision:"+$.key),T($.key,"処理結果","tests:"+$.key)]));for(const $ of A.activities){const ke=Ee.filter(Je=>Je.activityId===$.id).map(K),Ye=(Dt($.id).size?"remaining:":"checks:")+$.id;Gt($.id)&&ke.push(T(Ye,"その他","tests:"+Ye)),ke.length&&qe.push(H("tests-activity-"+$.id,$.name,ke))}const ze=Ee.filter($=>!$.activityId);ze.length&&qe.push(H("tests-other","その他",ze.map(K))),Gr()&&qe.push(T("@unassigned","未割当","tests:@unassigned"));const At=[{id:"business",label:"業務設計",items:[T("overview","全体図","business:overview"),H("business-activity","Activity",A.activities.map($=>T($.id,$.name,"business:"+$.id))),H("business-object","Object",(A.objects??[]).map($=>T($.id,$.name,"object:"+$.id)))]},{id:"states",label:"状態遷移",items:(A.states??[]).map($=>T($.id,$.name,"states:"+$.id))},{id:"subsystems",label:"サブシステム",items:C?.model.subsystems.length?[T("landscape","全体図","concept:landscape"),...C.model.subsystems.map($=>H("subsystem-"+$.id,$.name.replace(/サブシステム$/,""),C.model.reviewGroups.filter(ke=>ke.subsystemId===$.id).map(ke=>T(L(ke.id),ke.title,"concept:"+L(ke.id)))))]:[]},{id:"concept",label:"データ構造",items:De&&te.length?[T("overview","全体図","concept:overview"),H("concept-relations","概念",te.map($=>T(z($),ee[$].name,"concept:"+z($))))]:[]},{id:"tests",label:"テスト仕様",items:A.design?.model&&(U.length||me().length)?qe:[]}];let it=0;const Ze=($,ke,Ye)=>{const Je=document.createElement("button");Je.className="explorer-item"+(Ye?" explorer-item-nested":""),Je.dataset.explorerKey=$.key,Je.textContent=$.name;const He=A.views?.find(Ue=>Ue.key===A.viewKey);return ne===(ke.id==="subsystems"?"concept":ke.id)&&(["concept","subsystems"].includes(ke.id)?$.id===B:ke.id==="states"?$.id===at:ke.id==="tests"?$.id===Ce:$.key.startsWith("object:")?He?.object===$.id:$.id==="overview"?!dt&&He?.activity===void 0&&He?.object===void 0:He?.activity===$.id)&&Je.setAttribute("aria-current","page"),Je.disabled=ke.id==="business"&&!A.key,Je.onclick=()=>{I.hidden||t.closeLegacyList(),ke.id==="business"?$.key.startsWith("object:")?Xr($.id):qn($.id==="overview"?void 0:$.id):ke.id==="concept"||ke.id==="subsystems"?St($.id):ke.id==="tests"?xt($.id):yn($.id),ia()},Je},pt=($,ke,Ye,Je=!1)=>{const He=document.createElement("button"),Et=S?!dn.has($):Ve.has($);return He.className=(Ye?"explorer-subparent":"explorer-parent")+(Je?" explorer-pending":""),He.dataset.explorerKey="group:"+$,Ae(He,"span",ke).className="explorer-parent-label",Je?(He.disabled=!0,He):(He.setAttribute("aria-expanded",String(Et)),He.setAttribute("aria-controls","explorer-"+$),He.append(Wa(Et)),He.onclick=()=>{S?dn.has($)?dn.delete($):dn.add($):(Ve.has($)?Ve.delete($):Ve.add($),We()),ft()},He)};for(const $ of At){const ke=$.items.flatMap(Ue=>{if(Ue.kind==="item")return!S||($.label+" "+Ue.name).toLocaleLowerCase().includes(S)?[Ue]:[];const Jt=S?Ue.children.filter(oi=>($.label+" "+Ue.name+" "+oi.name).toLocaleLowerCase().includes(S)):Ue.children;return!S||Jt.length?[{...Ue,children:Jt}]:[]});if(S&&!ke.length)continue;const Ye=$.id!=="business"&&!$.items.length,Je=document.createElement("section"),He=pt($.id,$.label,!1,Ye),Et=document.createElement("div");Et.id="explorer-"+$.id,Et.hidden=Ye||(S?dn.has($.id):!Ve.has($.id));for(const Ue of ke){if(Ue.kind==="item"){Et.append(Ze(Ue,$,0)),it++;continue}const Jt=document.createElement("div");Jt.id="explorer-"+Ue.id,Jt.hidden=S?dn.has(Ue.id):!Ve.has(Ue.id),Et.append(pt(Ue.id,Ue.name,!0),Jt);for(const oi of Ue.children)Jt.append(Ze(oi,$,1)),it++;!Ue.children.length&&!S&&(Ae(Jt,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!ke.length&&!Ye&&(Ae(Et,"p","項目がありません。").className="explorer-empty"),Je.append(He,Et),k.append(Je)}S&&!it&&(Ae(k,"p","該当する項目はありません。").className="explorer-empty"),k.scrollTop=y,h&&Array.from(k.querySelectorAll("[data-explorer-key]")).find($=>$.dataset.explorerKey===h)?.focus({preventScroll:!0})}function ao(h){Nt=h,vt(),We(),(h?c.querySelector(".shell-heading button"):j).focus({preventScroll:!0})}j.addEventListener("click",h=>{h.preventDefault(),h.stopImmediatePropagation(),ao(!Nt)},!0),c.querySelector(".shell-heading button").onclick=()=>ao(!1),M.oninput=()=>{dn.clear(),ft()},c.addEventListener("keydown",h=>{if(h.key==="Escape"&&!h.defaultPrevented&&I.hidden&&(h.preventDefault(),h.stopPropagation(),ao(!1)),(h.key==="ArrowDown"||h.key==="ArrowUp")&&k.contains(document.activeElement)){const y=Array.from(k.querySelectorAll("button")).filter(T=>!T.disabled&&!T.closest("[hidden]")),A=y.indexOf(document.activeElement),S=y[A+(h.key==="ArrowDown"?1:-1)];S&&(h.preventDefault(),S.focus())}}),v.addEventListener("click",h=>{ne!=="business"&&(h.preventDefault(),h.stopImmediatePropagation(),(ne==="concept"||ne==="states"||ne==="tests"&&ge(Ce)?.capability.testSpecification)&&(rt.setOpen(!rt.isOpen()),vt(),We(),Ge(!1)))},!0),R.querySelector(".shell-heading button").onclick=()=>{rt.setOpen(!1),vt(),We(),Ge(!1),v.focus({preventScroll:!0})},p.querySelector(".shell-heading button").onclick=()=>{rt.setOpen(!1),vt(),We(),Ge(!1),v.focus({preventScroll:!0})},window.addEventListener("message",h=>{if(h.origin!==location.origin&&!(location.protocol==="file:"&&h.origin==="null"))return;const y=Array.from(bt).find(([,S])=>h.source===S.contentWindow);if(!y)return;if(h.data?.type==="alder-concept-rendered"){y[1].contentDocument&&(gs(y[1].contentDocument),ys(y[1].contentDocument));return}if(ne!=="concept"||y[0]!==B)return;const A=V(B);if(h.data?.type==="alder-concept-clear-selection"){A&&us(!0);return}if(h.data?.type==="alder-concept-subsystem"){if(!Yo(B)?.regions.some(S=>S.id===h.data.id))return;ot.delete(B),an.delete(B),cn.set(B,h.data.id),ro(),vt(),We();return}if(!(!te.includes(h.data?.id)||A&&!A.concepts[h.data?.id])){if(h.data.type==="alder-concept-open"){St(z(h.data.id));return}h.data.type==="alder-concept-select"&&(cn.delete(B),ot.set(B,h.data.id),(typeof h.data.viewId=="string"?Yo(B)?.tables[h.data.viewId]:void 0)?.conceptId===h.data.id?an.set(B,h.data.viewId):an.delete(B),innerWidth<=800&&(Nt=!1),ro(),vt(),We())}});function ps(){const h=getComputedStyle(document.documentElement);for(const y of bt.values()){const A=y.contentDocument?.documentElement;if(A){A.dataset.theme=document.documentElement.dataset.theme??"light";for(const S of["--bg","--panel","--fg","--line","--subtle","--select"])A.style.setProperty(S,h.getPropertyValue(S))}}}function vt(){!I.hidden&&ne==="business"&&(Nt=!0),c.hidden=!Nt,j.disabled=!1,j.setAttribute("aria-controls","design-explorer"),j.setAttribute("aria-label","ナビゲーションを開閉"),j.setAttribute("aria-expanded",String(Nt));const h=rt.isReady?.()??!0;R.hidden=ne!=="concept"||!De||!h||!rt.isOpen();const y=!!ge(Ce)?.capability.testSpecification;p.hidden=!(ne==="states"||ne==="tests"&&y)||!h||!rt.isOpen(),no&&ne!=="business"&&(no.hidden=!0),ne==="concept"?(v.disabled=!De||!h,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!R.hidden))):ne==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):ne==="states"||ne==="tests"&&y?(v.disabled=!h,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!p.hidden))):(ne==="tests"||ne==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const A=o.querySelector("#document-actions");A&&(A.hidden=ne!=="business");const S=o.querySelector("#document-actions-toggle");S&&ne!=="business"&&(S.hidden=!0),ps(),ni()}function ni(){const h=o.getBoundingClientRect().bottom;h>0&&e.style.setProperty("--shell-content-top",h+"px")}if(typeof ResizeObserver<"u"){const h=new ResizeObserver(ni);h.observe(o),h.observe(e.querySelector("header"))}window.addEventListener("resize",ni);function ms(){_t(),io=!0;try{const h=new URL(location.href).searchParams;if(ne==="concept"&&h.get("view")==="concept"&&h.get("concept")===B&&!Ne.has(B)&&Z(B,h.get("dataExample"))&&Be.set("drawer-overview:"+B,R.querySelector(".concept-drawer-body").scrollTop),De||(gt.clear(),Ne.clear(),Ht.clear(),Ke=[],B="overview",O.removeAttribute("src"),O.removeAttribute("srcdoc")),h.get("view")==="concept"){const y=De&&de.includes(h.get("concept")??"")?h.get("concept"):"landscape",A=h.get("dataExample");De&&V(y)&&h.get("dataView")==="overview"&&!Z(y,A)?(gt.add(y),Ne.delete(y)):(gt.delete(y),De&&Z(y,A)?(Ne.set(y,A),Ht.set(y,A)):Ne.delete(y)),St(y,!1)}else if(h.get("view")==="states")t.business().states?.some(y=>y.id===h.get("state"))?yn(h.get("state"),!1):vn();else if(h.get("view")==="tests"){const y=Jo(h.get("spec")??"@overview"),A=h.get("dataExample"),S=ge(y);S&&A&&S.samples.some(T=>T.id===A)?lt.set(y,A):S&&lt.delete(y),xt(y,!1)}else if(h.get("view")==="empty")ut("empty");else if(ut("business"),t.business().key){const y=h.get("activity"),A=h.get("object"),S=t.business(),T=S.views?.find(H=>H.key===S.viewKey);y&&S.activities.some(H=>H.id===y)?T?.activity!==y&&t.openActivity(y):A&&S.objects?.some(H=>H.id===A)?T?.object!==A&&t.openObject(A):(dt=!1,(!T||T.activity!==void 0||T.object!==void 0)&&t.openOverview())}yt(),ft()}finally{io=!1}}return window.addEventListener("popstate",ms),{closeBusinessOverview:na,reopenBusinessOverview(){dt=!1},activateBusiness(){ut("business")},businessActivated(){ut("business"),yt(),ft(),Ge()},syncChrome:vt,appendActivityTestLinks(h,y){Zr(h,y),Xo(h,as(y))},openRelatedChecks(h){Ve.add("tests"),xt(h&&Te(h)?"checks:"+h:"@overview")},syncDocument(){const h=t.business(),y=h.concept,A=!!(gn&&h.key!==gn||so&&Tn&&h.key&&h.key!==Tn),S=C?.model!==y?.model||C?.business!==y?.business;if((A||S&&C)&&(g.querySelector(".test-spec-page").replaceChildren(),p.querySelector(".spec-related-content").replaceChildren(),R.querySelector(".concept-related-content").replaceChildren(),dt=!1,Ke=[],Xe=[],ct=[],B="overview",at="",Ce="@overview",lt.clear(),Be.clear(),gt.clear(),Ne.clear(),Ht.clear(),ta(),ne!=="business"&&ut("business"),A&&!so&&Ge(!1)),S){C=y,G=y?Fa(y):void 0,q=y?Qa(y):void 0,re=y?Ha(y):void 0,De=!!y,ee=G?.tables??{},te=Object.keys(ee);const T=G?.groups.map(U=>U.id)??[],H=new Set([...wn,"subsystems"]);if(he=new Map(T.map(U=>[U,H.has(U)||te.includes(U)?"group:"+U:U])),xe=new Map(te.map(U=>[U,H.has(U)||T.includes(U)?"concept:"+U:U])),ue=new Map([...he].map(([U,K])=>[K,U])),je=new Map([...xe].map(([U,K])=>[K,U])),de=[...wn,...ue.keys(),...je.keys()],Array.isArray(ye?.expanded)&&ye.expandedVersion!==4){Ve.add("subsystems"),Ve.add("concept-relations");for(const U of y?.model.subsystems??[])Ve.add("subsystem-"+U.id)}}if(gn=h.key,Xe=Xe.filter(T=>h.states?.some(H=>H.id===T)),ne==="business"&&dt&&h.views?.find(T=>T.key===h.viewKey)?.activity===void 0&&h.views?.find(T=>T.key===h.viewKey)?.object===void 0&&vn(),so&&h.key){if(_r(),Tn===h.key){Array.isArray(ye?.specs)&&(ct=[...new Set(ye.specs.filter(T=>typeof T=="string").map(T=>Jo(T)))]);for(const[T,H]of Object.entries(ye?.specExamples??{})){const U=ge(T);typeof H=="string"&&U?.capability.samples.some(K=>K.id===H)&&lt.set(T,H)}}so=!1,ms()}ft(),yt(),vt(),A&&We()}}}class vi{tabs=new WeakMap;router;constructor(t=ui){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const c=JSON.stringify([o.map(u=>[u.id,u.width,u.height]),i.map(u=>[u.kind,u.from,u.to,u.label]),s]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==c,l=new Set(o.filter(u=>{const b=d?.nodes.get(u.id);return!b||b.x!==u.x||b.y!==u.y}).map(u=>u.id)),r=new Set(o.map(u=>u.id)),f=a?new Array(i.length):d.routes.slice();if(i.forEach((u,b)=>{!a&&!l.has(u.from)&&!l.has(u.to)||(f[b]=r.has(u.from)&&r.has(u.to)?this.router({from:u.from,to:u.to,index:b,nodes:o,kind:u.kind,matrix:s?.[b],labels:s?.[b]?[]:[...f.flatMap((g,p)=>g&&p<b?[{id:String(p),x:g.label[0]-Math.max(30,i[p].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[p].label.length*12),height:18}]:[])],wires:s?.[b]?[]:f.flatMap((g,p)=>g&&p<b?[g.points]:[]),labelWidth:Math.max(30,u.label.length*12),labelHeight:18}):void 0)}),s){const u=[],b=new Map,g=f.map((p,m)=>m).sort((p,m)=>Number(s[p].returning)-Number(s[m].returning));for(const p of g){const m=f[p];if(!m)continue;const I=o.find(O=>O.id===i[p].from),j=Math.max(30,i[p].label.length*12),v=s[p].returning?[Math.max(...m.points.map(O=>O[0]))+8+j/2,m.points[0][1]]:[I.x+I.width*.125+8+j/2,ua(I.y+I.height,s[p].captionLane*nr)+9],M=or(i[p],p,s[p]),k=b.get(M)??fi(v,j,18,o,u);(k[0]!==m.label[0]||k[1]!==m.label[1])&&(f[p]={...m,label:k}),b.has(M)||(b.set(M,k),u.push({id:String(p),x:k[0]-j/2,y:k[1]-9,width:j,height:18}))}}return this.tabs.set(t,{design:n,structure:c,nodes:new Map(o.map(u=>[u.id,{...u}])),routes:f}),f}}function zc(e,t,n,o){const i=(f,u,b)=>(u[0]-f[0])*(b[1]-f[1])-(u[1]-f[1])*(b[0]-f[0]),s=i(e,t,n),c=i(e,t,o),d=i(n,o,e),a=i(n,o,t),l=1e-6;if(s*c<-l&&d*a<-l)return!0;if(Math.max(Math.abs(s),Math.abs(c),Math.abs(d),Math.abs(a))>l)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],o[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],o[r]))>.1}function Uc(e,t,n,o,i=[]){const s=e.x+e.width,c=24,d=e.y+e.height,a=s-8-(2*(n.count-n.index)-1)*c,l=t.filter(j=>j.id!==e.id);let r;for(const j of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const M=[a+j,d],k=[M[0]+c,d];if(M[0]<e.x+8||k[0]>s-8)continue;const O=d+n.depth+v,R=Math.min(12,(k[0]-M[0])/2,(O-d)/2),D=[M];let x=`M${M}`;const P=q=>{x+=` L${q}`,D.push(q)},N=(q,re)=>{const ee=D.at(-1);x+=` Q${q} ${re}`;for(let te=1;te<=4;te++){const de=te/4,ue=1-de;D.push([ue*ue*ee[0]+2*ue*de*q[0]+de*de*re[0],ue*ue*ee[1]+2*ue*de*q[1]+de*de*re[1]])}};P([M[0],O-R]),N([M[0],O],[M[0]+R,O]),P([k[0]-R,O]),N([k[0],O],[k[0],O-R]),P(k);const C=fa(D,l,.3),G=i.filter(q=>D.slice(1).some((re,ee)=>q.slice(1).some((te,de)=>zc(D[ee],re,q[de],te)))).length;if((!r||C<r.collisions||C===r.collisions&&G<r.wireCollisions)&&(r={path:x,points:D,collisions:C,wireCollisions:G,low:O,extra:v,shift:j}),C===0&&G===0)break}const{path:f,points:u,collisions:b,wireCollisions:g,low:p,extra:m,shift:I}=r;return{path:f,points:u,label:[Math.max(s+8,n.labelLeft)+o/2,p],bounds:{right:Math.max(...u.map(j=>j[0])),bottom:Math.max(...u.map(j=>j[1]))},collisions:b+g,rerouted:m>0||I!==0,fallback:b+g>0}}function $c(e,t=Ni()){const n="http://www.w3.org/2000/svg",o=(L,z={})=>{const V=document.createElementNS(n,L);for(const[le,Z]of Object.entries(z))V.setAttribute(le,Z);return V},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(L=>[L]),c=[...new Set(["@new",...e.states,...s.map(L=>L[0].to)])],d={nodes:c.map(L=>({id:L,type:"business",name:i[L]??L,scope:!0})),relations:s.map(([L])=>({kind:L.path==="exception"?"business-exception":"input",from:L.from,to:L.to,label:L.id+"："+L.activity+"："+L.condition}))},a=qi(d,c),l=L=>{const z=Array.from(L);return Array.from({length:Math.ceil(z.length/28)},(V,le)=>z.slice(le*28,(le+1)*28).join(""))},r=s.map(([L])=>({from:L.from,activity:L.activity,rows:[L],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[L,z]of r.entries()){const V=z.rows[0],le=e.transitions.filter(se=>se.from===V.from&&(se.activityId??se.activity)===(V.activityId??V.activity)&&se.path===V.path&&(V.path!=="exception"||(se.exception??"例外名未定義")===(V.exception??"例外名未定義"))),Z=le.map(se=>(se.conditionLabel??se.condition).trim().replace(/\s+/g," ")),we=new Set(Z).size===le.length?V.conditionLabel??V.condition:V.condition,me=[V.path==="exception"?"例外："+(V.exception??"例外名未定義"):"",...le.length>1?[we]:[]].filter(Boolean).join("：");z.lines=l(z.activity+(me?"（"+me+"）":"")),z.lineRows=z.lines.map(()=>z.rows),z.width=Math.max(...z.lines.map(se=>Array.from(se).length*14)),z.height=z.lines.length*18,a.wires[L].returning||(z.offset=f.has(z.from)?f.get(z.from)+8:0,f.set(z.from,z.offset+z.height))}const u=new Map;s.forEach(([L],z)=>{if(L.from===L.to){const V=u.get(L.from)??[];V.push(z),u.set(L.from,V)}});const b=new Map,g=new Map;for(const[L,z]of u){let V=0;for(const Z of[...z].reverse())b.set(Z,{leader:z[0],index:0,count:1,depth:0,offset:V}),V+=r[Z].height+8;const le=24+Math.max(0,V-8)+8;g.set(L,le);for(const Z of z)b.get(Z).depth=le}const p=L=>44,m=c.slice().sort((L,z)=>a.positions[L][1]-a.positions[z][1]);let I=Math.max(40,...r.map((L,z)=>a.wires[z].returning&&L.from===m[0]?16+L.height/2-44*(a.wires[z].fromPort??.5):40));const j=new Map;for(const L of m){const z=p(),V=(f.get(L)??0)+(g.get(L)??0);j.set(L,I),I+=pa(z,V)}const v=c.map(L=>({id:L,x:t.positions.get(L)?.[0]??a.positions[L][0],y:t.positions.get(L)?.[1]??j.get(L),width:Math.max(104,Array.from(i[L]??L).length*14+32),height:p()})),M=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),k=o("title");k.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(c.includes("@none")?"作成なしはこの操作の処理結果。":"")+(c.includes("@unknown")?"未決は設計課題。":""),M.append(k),M.append(Pi("state-transition-"));const O=new Map,R=[],D=[];let x=t.selected;const P=L=>{x=L,t.selected=L;const z=wo(e.transitions,x);for(const[Z,we]of O)we.setAttribute("class","node graph-shape state-shape"+z.nodeClasses(Z)),we.setAttribute("aria-pressed",String(Z===x));R.forEach(({element:Z,rows:we})=>{const Oe=we[0].from===we[0].to;Z.setAttribute("class","edge"+(Oe?" state-self-loop":we[0].path==="exception"?" exception":"")+z.labelClasses(we)),Z.setAttribute("marker-end","url(#state-transition-"+(we.some(z.related)?"related-arrow":"arrow")+")")});for(const Z of D)Z.element.setAttribute("class","state-caption-line"+z.labelClasses(Z.rows));M.querySelectorAll("[data-exception-paint]").forEach(Z=>Z.remove());const V=Array.from(M.children).find(Z=>Z.matches(".state-diagram-edge-label,[data-state]"))??null,le=[...R].sort((Z,we)=>Number(Z.rows.some(z.related))-Number(we.rows.some(z.related)));for(const{element:Z}of le)if(M.insertBefore(Z,V),Z.classList.contains("exception")||Z.classList.contains("state-self-loop")){const we=M.children.length;Ti(M,Z,{path:Z.getAttribute("d")},{"data-transitions":Z.getAttribute("data-transitions")});for(const Oe of Array.from(M.children).slice(we))M.insertBefore(Oe,V)}M.querySelectorAll(".state-diagram-edge-label").forEach(Z=>M.append(Z))};M.addEventListener("click",L=>{L.target===M&&P()}),M.addEventListener("keydown",L=>{L.key==="Escape"&&(L.preventDefault(),P())});const N=a.wires.map((L,z)=>({...L,captionLane:(r[z].offset+(g.get(r[z].from)??0))/nr})),C=d.relations.map((L,z)=>({...L,label:String(z).padEnd(Math.ceil(r[z].width/12),"x")})),G=[...b].map(([L,z])=>{const V=v.find(Z=>Z.id===s[L][0].from),le=r[L];return{x:V.x+V.width+8,y:V.y+V.height+24+z.offset,width:le.width,height:le.height}});let q=new vi().update({},e,v,C,N);for(let L=0;L<=G.length;L++){let z=!1,V=0;if(q.forEach((le,Z)=>{if(!le||b.has(Z)||!N[Z].returning)return;let we=0;for(const Oe of G)for(let me=1;me<le.points.length;me++){const se=le.points[me-1],ge=le.points[me];if(Math.abs(se[0]-ge[0])>1e-7||Math.abs(se[1]-ge[1])<2)continue;const Pe=se[0];if(Pe<Oe.x-4||Pe>Oe.x+Oe.width+4||Math.max(se[1],ge[1])<Oe.y-4||Math.min(se[1],ge[1])>Oe.y+Oe.height+4)continue;const Te=Oe.x+Oe.width+12-Pe;Te>0&&(we=Math.max(we,Te))}we&&(N[Z]={...N[Z],returnLane:(N[Z].returnLane??0)+Math.ceil(we/16)+V++},z=!0)}),!z)break;q=new vi().update({},e,v,C,N)}const re=q.flatMap((L,z)=>L&&!b.has(z)?[L.points]:[]),ee=new Map,te=q.map((L,z)=>{const V=b.get(z);if(!V)return L;const le=s[z][0].from,Z=v.find(Te=>Te.id===le),we=q.flatMap((Te,Dt)=>Te&&!b.has(Dt)?[Te.points]:[]),Oe=Math.max(30,C[z].label.length*12),me=r[z];let se=ee.get(V.leader);se||(se=Uc(Z,v,{...V,labelLeft:Z.x+Z.width+8},Oe,re),ee.set(V.leader,se),re.push(se.points));const ge=we.flatMap((Te,Dt)=>Te.slice(1).map((rn,Gt)=>({id:`${Dt}:${Gt}`,x:Math.min(Te[Gt][0],rn[0])-2,y:Math.min(Te[Gt][1],rn[1])-2,width:Math.abs(Te[Gt][0]-rn[0])+4,height:Math.abs(Te[Gt][1]-rn[1])+4}))),Pe=fi([Z.x+Z.width+8+me.width/2,Z.y+Z.height+24+V.offset+me.height/2],me.width,me.height,[...v,...ge]);return{...se,label:[Pe[0]-me.width/2+Oe/2,Pe[1]]}}),de=new Array(s.length),ue=[],je=s.map((L,z)=>z).sort((L,z)=>Number(N[L].returning)-Number(N[z].returning));for(const L of je){const z=te[L],V=r[L],le=Math.max(30,C[L].label.length*12);let Z=[z.label[0]-le/2+V.width/2,z.label[1]+(N[L].returning?0:V.height/2-9)];const we=v.find(se=>se.id===s[L][0].from),Oe=v.find(se=>se.id===s[L][0].to);if(!b.has(L)&&N[L].returning&&Oe&&Oe.y>we.y){const se=z.points.slice(1).map((ge,Pe)=>[z.points[Pe],ge]).filter(([ge,Pe])=>Math.abs(ge[0]-Pe[0])<.01&&Pe[1]-ge[1]>24).sort(([ge,Pe],[Te,Dt])=>Dt[1]-Te[1]-(Pe[1]-ge[1]))[0];if(se){const[ge,Pe]=se;Z=[ge[0]+8+V.width/2,ge[1]+Math.min(24+V.height/2,(Pe[1]-ge[1])/2)]}}const me=fi(Z,V.width,V.height,v,ue);de[L]=me,ue.push({id:String(L),x:me[0]-V.width/2,y:me[1]-V.height/2,width:V.width,height:V.height})}let he=Math.max(...v.map(L=>L.x+L.width))+40,xe=Math.max(...v.map(L=>L.y+L.height))+40;s.forEach((L,z)=>{const V=b.get(z);if(V&&V.leader!==z)return;const le=V?s.flatMap((se,ge)=>b.get(ge)?.leader===z?se:[]):L,Z=le[0],we=te[z],Oe=o("path",{d:we.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":le.map(se=>se.id).join(" ")});(V||Z.path==="exception")&&Oe.setAttribute("stroke-dasharray","6 5");const me=o("title");me.textContent=le.map(se=>`${se.id} ${se.activity} / ${se.path==="normal"?"通常":"例外："+(se.exception??"例外名未定義")}：${se.condition}`).join(" / "),Oe.append(me),M.append(Oe),R.push({element:Oe,rows:le}),he=Math.max(he,we.bounds.right+40),xe=Math.max(xe,we.bounds.bottom+40)});for(const[L,z]of r.entries()){const V=de[L],le=V[0]-z.width/2,Z=V[1]-z.height/2+14;M.append(o("rect",{x:String(le),y:String(Z-14),width:String(z.width),height:String(z.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const we=o("text",{x:String(le),y:String(Z),class:"state-diagram-edge-label","data-activity":z.activity,"data-transition-id":z.rows[0].id,"aria-label":z.lines.join("")});z.lines.forEach((Oe,me)=>{const se=o("tspan",{x:String(le),dy:me?"18":"0","font-size":"14","font-weight":"600"});se.textContent=Oe,se.setAttribute("data-transitions",z.lineRows[me].map(ge=>ge.id).join(" ")),D.push({element:se,rows:z.lineRows[me]}),we.append(se)}),M.append(we),he=Math.max(he,le+z.width+24),xe=Math.max(xe,Z+z.height+24)}for(const L of v){const z=L.id.startsWith("@"),V=o("g",{role:"button",tabindex:"0","aria-label":i[L.id]??L.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":L.id,"data-node":L.id});V.append(er(document,L,z)),V.append(o("rect",{x:String(L.x),y:String(L.y),width:String(L.width),height:String(L.height),rx:z?"20":"8",class:z?"state-diagram-node state-note":"state-diagram-node"}));const le=o("text",{x:String(L.x+L.width/2),y:String(L.y+L.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(le.textContent=i[L.id]??L.id,V.append(le),z&&L.id!=="@new"){const Z=o("text",{x:String(L.x+L.width/2),y:String(L.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Z.textContent=L.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",V.append(Z)}V.addEventListener("click",()=>P(L.id)),V.addEventListener("keydown",Z=>{(Z.key==="Enter"||Z.key===" ")&&(Z.preventDefault(),P(L.id))}),O.set(L.id,V),M.append(V)}return P(t.selected),M.setAttribute("viewBox",`0 0 ${he} ${xe}`),M.style.minWidth=`${he}px`,M}const Es=new WeakMap;function Fc(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(p=>p.id===t&&p.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(p,m,I=i)=>{const j=document.createElement(p);return j.textContent=m,I.append(j),j};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const c=o.model;for(const p of c.transitions){if(!e.graph.nodes.some(m=>m.id===p.activity&&m.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(p.exceptionId){const m=e.model?.business.exceptions?.find(I=>I.id===p.exceptionId);if(!m||m.activityId!==p.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const d=Es.get(e)??new Map;Es.set(e,d);const a=d.get(t)??Ni();d.set(t,a);const l={...c,transitions:c.transitions.map(p=>({...p,activityId:p.activity,activity:e.graph.nodes.find(m=>m.id===p.activity)?.name??p.activity}))};i.append(Qs(document,p=>$c(l,p),a));const r=p=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[p]??p,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},u=document.createElement("details");s("summary",`操作の詳細（${c.transitions.length}）`,u);const b=document.createElement("ol");u.append(b),i.append(u);for(const p of c.transitions){const m=document.createElement("li");m.dataset.transition=p.id,s("h3",`${p.id} · ${r(p.from)} → ${r(p.to)}`,m),p.path==="exception"&&s("p","例外名："+(p.exception??"未定義"),m),s("p",`${f[p.effect]} · ${p.path==="normal"?"正常":"例外"}`,m);const I=e.graph.nodes.find(j=>j.id===p.activity&&j.type==="business");if(I){const j=document.createElement("button");j.type="button",j.textContent=I.name,j.onclick=()=>n(I.id),m.append(j)}else s("p","要確認：根拠Activityが見つかりません — "+p.activity,m);s("p","条件："+p.condition,m),s("p",p.note,m),s("p","根拠："+p.evidence,m),b.append(m)}c.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",c.source,g),i.append(g),i}const Os=64,Vc=96,Bc=260,Cs=40,Gc=4;function Hc(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:c,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}=ma(e,t),r=c.map(k=>k.length),f=o.map(()=>0),u=o.flatMap((k,O)=>r[O]===0?[O]:[]);for(let k=0;k<u.length;k++)for(const O of s[u[k]])f[O]=Math.max(f[O],f[u[k]]+1),--r[O]===0&&u.push(O);const b=Array.from({length:f.reduce((k,O)=>Math.max(k,O),0)+1},()=>[]);o.forEach((k,O)=>b[f[O]].push(O));const g=o.map(()=>0),p=k=>k.forEach((O,R)=>g[O]=R);b.forEach(p);for(let k=0;k<Gc;k++){const O=k%2?[...b].reverse():b;for(const R of O){const D=new Map(R.map(x=>{const P=k%2?s[x]:c[x];return[x,P.length?P.reduce((N,C)=>N+g[C],0)/P.length:g[x]]}));R.sort((x,P)=>D.get(x)-D.get(P)||x-P),p(R)}}const m=b[0].filter(k=>o[k].type==="object"&&i[k].length===0&&s[k].length>0);if(n&&m.length>1){const k=new Set(m),O=b[0].filter(R=>!k.has(R));b.splice(0,1,...m.map((R,D)=>D===0?[...O,R]:[R]))}const I=Object.create(null),j=o.map(()=>0),v=[],M=Math.ceil(Bc/Os)-1;for(let k=0;k<b.length;k++){const O=new Map;for(const x of v)for(const P of x)O.set(P,P+1);const R=x=>{let P=x;for(;O.has(P);)P=O.get(P);let N=x;for(;O.has(N);){const C=O.get(N);O.set(N,P),N=C}return P},D=[];for(const x of b[k]){let P=k;for(const C of c[x])P=Math.max(P,j[C]+1);const N=R(P);j[x]=N,O.set(N,N+1),D.push(N),I[o[x].id]=[Cs+k*Os,Cs+N*Vc]}v.push(D),v.length>M&&v.shift()}return{positions:I,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}}function _c(e,t){return ir(e)?qi(e,t).positions:Hc(e,t).positions}const js=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function fr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>js(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=js(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function pr(e){const t=fr(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,c])=>[o.get(s),c])))}}function mr(e){const t=pr(e);return t.restore(_c(t.graph,t.order))}function Jc(e){const t=pr(e),n=qi(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function hr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Kc(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(c=>c.handle!==void 0):s.tabs.some(c=>c.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,c){if(Object.is(s,c))return!0;if(!s||!c||typeof s!="object"||typeof c!="object"||o.has(s)||o.has(c))return!1;const d=b=>Array.isArray(b)||Object.getPrototypeOf(b)===null||Object.getPrototypeOf(b)?.constructor?.name==="Object";if(!d(s)||!d(c)||Array.isArray(s)!==Array.isArray(c)||Array.isArray(s)&&s.length!==c.length)return!1;o.add(s),o.add(c);const a=s,l=c,r=Object.keys(a),f=Object.keys(l),u=r.length===f.length&&r.every(b=>Object.hasOwn(l,b)&&i(a[b],l[b]));return o.delete(s),o.delete(c),u}return i(e,t)}function Dn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,c]of Object.entries(e.positions))n.has(s)&&(o[s]=[...c]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=mr(t),c=Object.values(o);for(const d of i){const a=[...s[d.id]];for(;c.some(l=>Math.abs(l[0]-a[0])<280&&Math.abs(l[1]-a[1])<88);)a[1]+=180;o[d.id]=a,c.push(a)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function br(){return new Promise((e,t)=>{const n=indexedDB.open(hr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class $i extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let ko;function gr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Xc(e){const t=ko;if(t===void 0)throw Error("Session has not been loaded");const n=await br();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),c=s.objectStore("session"),d=c.get("generation"),a=c.get("current"),l=c.get("readonly-legacy");let r,f;l.onsuccess=()=>{try{const u=gr(d.result);if(Kc(a.result,e)){f=u;return}if(u!==t)throw new $i;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");l.result===void 0&&Yc(a.result)&&c.put(a.result,"readonly-legacy"),c.put(e,"current"),c.put(f,"generation")}catch(u){r=u,s.abort()}},s.oncomplete=()=>{ko=f,o()},s.onerror=()=>i(r??s.error??Error("Session save failed")),s.onabort=()=>i(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Zc(){ko=void 0;const e=await br();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),c=i.get("generation");o.oncomplete=()=>{try{ko=gr(c.result),t(s.result)}catch(d){n(d)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function Yc(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Ms=new WeakMap;function Qc(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let o=Ms.get(e);o||(o=new Map,Ms.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),c=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),d=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&c.has(r.to)||r.to===t&&c.has(r.from))),a=new Set([t,...d.flatMap(r=>[r.from,r.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>a.has(r.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>a.has(r))};return o.set(t,l),l}const Ls=new WeakMap;function ed(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=Ls.get(e);o||(o=new Map,Ls.set(e,o));const i=t,s=o.get(i);if(s)return s;const c=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),d=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),a=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&d.has(f.to)||f.kind==="output"&&f.to===t&&d.has(f.from)||f.kind==="object-exception"&&(f.from===t&&c.has(f.to)||f.to===t&&c.has(f.from))),l=new Set([t,...a.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>l.has(f.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>l.has(f))};return o.set(i,r),r}const yr=new WeakMap;function $t(e){return yr.get(e)}const vr=["design","checks","source","draft","edited","handle"];function td(e){return{key:e.key,name:e.name,...Object.fromEntries(vr.map(t=>[t,e[t]]))}}function Ct(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:c,viewInset:d,canvasOrigin:a,scroll:l,zoom:r}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:c,viewInset:d,canvasOrigin:a,scroll:l,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Mo(e,t){const n=t;yr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of vr)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function Io(e){return e.activity}function So(e){return e.object}function Bn(e){return e.activity??e.object}function Lo(e){return e.object===void 0?Qc(e.design,e.activity):ed(e.design,e.object)}function Ro(e){const t=Lo(e),n=Dn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function nn(e,t=[],n,o){const i=n??(e.tabs[0]?td(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?Ct(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(u=>{const b=Mo(i,u);return Object.assign(u,Ct(Ro(b))),b}):[],{dark:c,drawer:d,width:a,preferWrite:l,nodeDrawer:r,sampleLayout:f}=e;return{dark:c,drawer:d,width:a,preferWrite:l,nodeDrawer:r,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(u=>u.source?.kind==="url").map(u=>({url:u.source.url,name:u.name}))].filter((u,b,g)=>g.findIndex(p=>p.url===u.url)===b),legacyViews:e.legacyViews,active:s.some(u=>u.key===e.active)?e.active:s[0]?.key}}function Fi(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(Ct),recovery:n}}function lo(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function nd(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!cd(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const r of i.views)lo(r)}const{format:s,views:c,document:d,recovery:a,...l}=e;for(const r of c)lo(r);for(const r of a)lo(r);if(!!d!=!!c.length||new Set(c.map(r=>r.key)).size!==c.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(u=>u.group!==void 0&&typeof u.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(u=>u.group===void 0).length!==1))throw Error("Invalid legacy views");const r=o.views[0],f=r?{...r}:void 0;return f&&delete f.group,nn({...l,tabs:[],active:f?.key,legacyViews:{documentKey:d?.key,views:structuredClone(o.views),active:o.active}},a,d,f?[f]:[])}if(c.length&&(c[0].activity!==void 0||c[0].object!==void 0||c.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(c.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==c.filter(r=>r.activity!==void 0).length||new Set(c.filter(r=>r.object!==void 0).map(r=>r.object)).size!==c.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(d&&c.some(r=>r.activity!==void 0&&!d.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(d&&c.some(r=>r.object!==void 0&&!d.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return nn({...l,tabs:[]},a,d,c)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)lo(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return nn({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function od(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return nn({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function id(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),c=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||s.has(a.activity))&&(a.object===void 0||c.has(a.object))).map(Ct);return nn(e,e.recovery,i,d)}function sd(e,t){const n=e.tabs.find(i=>Io(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=Mo(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,Ct(Ro(o))),e.tabs.push(o),e.active=o.key,o}function rd(e,t){const n=e.tabs.find(i=>So(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=Mo(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,Ct(Ro(o))),e.tabs.push(o),e.active=o.key,o}function ad(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return Ct(i?Ro(Mo(e.document,{...Ct(o),...Ct(i)})):o)});return nn({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function cd(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Do(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=d=>d instanceof HTMLButtonElement&&d.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!o(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const s=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},c=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?c():s(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),c(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,l=i(),r=l.indexOf(document.activeElement);let f;a.key==="ArrowDown"&&(f=(r+1)%l.length),a.key==="ArrowUp"&&(f=(r+l.length-1)%l.length),a.key==="Home"&&(f=0),a.key==="End"&&(f=l.length-1),f!==void 0&&(a.preventDefault(),l[f]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!o(a)&&s(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const dd=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),ld={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function ud(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=v=>i.slice(v.line+1,o.find(M=>M.line>v.line&&M.level<=v.level)?.line??i.length).join(`
`).trim(),c=new Map(o.filter(v=>v.level===3&&t.some(M=>M.title===v.title)).map(v=>[v.title,v])),d=v=>{const M=t.find(k=>k.title===v.title);return M?"legacy-check:"+M.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},a=new Map,l=(v,M)=>{a.has(v)?a.get(v)!==M&&a.set(v,void 0):a.set(v,M)};for(const v of o){const M=d(v);l(dd(v.title),M);const k=t.find(O=>O.title===v.title);k&&l(k.id.toLowerCase(),M)}for(const[v,M]of i.entries()){const k=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(M);if(k){const O=o.find(R=>R.line>v);O&&l(k[1].toLowerCase(),d(O))}}const r=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const M=[];let k=0;for(const O of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){O.index>k&&M.push({kind:"markdown",value:v.slice(k,O.index)});let R=O[2].slice(1);try{R=decodeURIComponent(R)}catch{}const D=O[2].startsWith("#")?a.get(R.toLowerCase()):void 0;M.push(D?{kind:"reference",targetId:D,label:O[1]}:{kind:"link",uri:O[2],label:O[1]}),k=O.index+O[0].length}return k<v.length&&M.push({kind:"markdown",value:v.slice(k)}),M},f=[],u=[],b=[],g=new Map;for(const v of o.filter(M=>M.level===2)){if(v.title==="業務一覧")continue;const M=d(v),k=o.find(O=>O.line>v.line)?.line??i.length;f.push({id:M,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:r(i.slice(v.line+1,k).join(`
`).trim())}),g.set(v.title,M)}const p="legacy-unassigned",m=v=>{const M=o.filter(k=>k.line<v.line&&k.level===2).at(-1);return M?g.get(M.title):void 0},I=t.map(v=>{const M=c.get(v.title),k=m(M)??p,O=Object.create(null),R=[];let D={name:"補足",value:""},x="";for(const N of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const C=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(N);C&&(x?C[1][0]===x[0]&&C[1].length>=x.length&&!C[2].trim()&&(x=""):x=C[1]);const G=x?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(N);G?(D.value.trim()&&R.push(D),D={name:G[1],value:G[2]}):D.value+=`
`+N}D.value.trim()&&R.push(D);let P="";for(const N of R)if(N.name==="人間レビュー状態"){P=N.value.split(`
`)[0].trim();const C=N.value.split(`
`).slice(1).join(`
`).trim();C&&(O.補足=[...O.補足??[],...r(C)])}else{const C=ld[N.name]??N.name;O[C]=[...O[C]??[],...r(N.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:P,sectionId:k,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(N=>N[1]).join(`
`),fields:O}});I.some(v=>v.sectionId===p)&&f.push({id:p,activityId:null,title:"未割当",preamble:[]});for(const v of o.filter(M=>M.level===3&&!c.has(M.title))){const M=m(v);M?u.push({id:d(v),sectionId:M,title:v.title,blocks:[{kind:"prose",content:r(s(v))}]}):b.push({id:d(v),title:v.title,content:r(s(v))})}const j=o.find(v=>v.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(i.slice(/^# /.test(i[0])?1:0,j).join(`
`)),sections:f,items:I,index:Object.entries(n).map(([v,M])=>{const k=i.find(O=>O.startsWith("|")&&O.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:k[1]?.trim()??"",connections:k[2]?.trim()??"",checkIds:M.map(O=>"legacy-check:"+O)}}),guarantees:u,examples:[],notes:b}}function si(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[c,...d]=s;return!c||!d.length||!["main","master"].includes(c)&&!/^[a-f0-9]{40}$/i.test(c)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${d.join("/")}`,ref:c}}catch{return}}function wi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function fd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,u)=>{const b=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(b){i?b[1][0]===i[0]&&b[1].length>=i.length&&!b[2].trim()&&(i=""):i=b[1];return}if(!i){t.add(u);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:u,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const c=new Set,d=s.map(f=>{const u=o.find(p=>p.line>f.line&&p.level<=3)?.line??n.length,b=f.title.split(/\s/)[0];if(c.has(b))throw Error("Check IDが重複しています: "+b);c.add(b);const g=n.slice(f.line+1,u).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const p of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+p+"[：:]\\s*\\S","m").test(g))throw Error(b+" の"+p+"が見つかりません。");return{id:b,title:f.title,body:g,activities:[]}}),a=Object.create(null);let l=!1;for(const[f,u]of n.entries()){if(!t.has(f)||(/^## /.test(u)&&(l=/^## 業務一覧\s*$/.test(u)),!l||!/^\|/.test(u)))continue;const b=u.split("|").slice(1,-1);if(b.length!==4)continue;const g=wi(b[0])[0]?.label;if(!g)continue;if(Object.hasOwn(a,g))throw Error("業務一覧のActivityが重複しています: "+g);const p=wi(b[3]);if(p.some(I=>I.url.toLowerCase()!=="#"+I.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const m=p.map(I=>I.label);if(!m.length||m.some(I=>!c.has(I)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);a[g]=[...new Set(m)];for(const I of d)m.includes(I.id)&&I.activities.push(g)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:d,index:a,model:ud(e,d,a,o)}}function Gn(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Hn(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),o=Object.keys(e.index).filter(l=>!n.has(l)),i=Object.keys(e.index).filter(l=>n.has(l)),s=(l,r)=>({state:l,reason:r,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const c=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=wi(c).map(l=>si(l.url)).filter(l=>l!==void 0),a=t.source?.kind==="url"?si(t.source.url):t.source?.kind==="sample"?si("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(l=>l.document!==a.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!a||!d.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Rs=new WeakMap;function Cn(e){let t=Rs.get(e);return t||(t=fd(e.markdown),Rs.set(e,t)),t}const ri=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function uo(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function pd(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function md(e){if(!e.checks)return[];const t=Cn(e.checks),n=Hn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===Gn(e)?[t.model]:[]}function hd(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&uo(i,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,i.append(d)}let s,c=!1;if(e.checks){s=Cn(e.checks);const d=Hn(s,e);if(c=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===Gn(e),!c&&(uo(i,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=ri("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,i.append(a)}}if(t.candidate){const d=t.candidate,a=Cn(d),l=Hn(a,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",uo(r,"一致未確認: "+d.name+" — "+l.reason),uo(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),u=document.createElement("summary");u.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(u,pd(a.markdown)),r.append(f);const b=ri("対応を確認して表示する",()=>n.confirm(d));b.id="check-confirm",b.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const g=ri("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(b,g),i.append(r)}return i.childNodes.length&&o.append(i),o}function bd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const r of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const c=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),r&&!o.hidden&&o.focus({preventScroll:!0})},d=()=>i.filter(r=>!r.hidden&&!r.disabled),a=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const b=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+b,p=i.some(m=>!m.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=p?"menu":"inline",o.hidden=!p,(!p||r!==e.dataset.actionsMode)&&(c(),p&&n.contains(f)?o.focus({preventScroll:!0}):!p&&f===o&&d()[0]?.focus({preventScroll:!0}))},l=(r=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=d();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?c(!0):l(),o.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),l(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=d(),u=f.indexOf(document.activeElement);let b;r.key==="ArrowDown"&&(b=(u+1)%f.length),r.key==="ArrowUp"&&(b=(u+f.length-1)%f.length),r.key==="Home"&&(b=0),r.key==="End"&&(b=f.length-1),b!==void 0&&(r.preventDefault(),f[b]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),c(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!o.contains(r.target)&&c()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==o&&c()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&c(!0)},!0),c(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:c}}function gd(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,c=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),d=n.reduce((l,r)=>l+r.getBoundingClientRect().width,0)+s*n.length+c,a=d+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const Wn="http://www.w3.org/2000/svg",yd="http://www.w3.org/1999/xhtml",fo=24,Ds=8192,vd=16e6,wd=8e6,kd=4e3,Id=1e6,ki="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Sd(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),o=Math.max(o,r.x+r.width),i=Math.max(i,r.y+r.height);const s=Math.floor(t)-fo,c=Math.floor(n)-fo,d=Math.ceil(o)-s+fo,a=Math.ceil(i)-c+fo,l=Math.min(2,Ds/d,Ds/a,Math.sqrt(vd/(d*a)));if(l<1)throw Error(ki);return{bounds:{x:s,y:c,width:d,height:a},width:Math.floor(d*l),height:Math.floor(a*l),scale:l}}const xd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function Ns(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const c=o[s],d=getComputedStyle(i);c.removeAttribute("style");for(const a of xd){const l=d.getPropertyValue(a);l&&!/url\s*\(/i.test(l)&&c.style.setProperty(a,l)}for(const a of Array.from(c.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&c.removeAttribute(a.name)}),t}function Ad(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>kd||(e.textContent?.length??0)+(t.textContent?.length??0)>Id)throw Error(ki);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(p=>({x:parseFloat(p.style.left),y:parseFloat(p.style.top),width:p.offsetWidth,height:p.offsetHeight}));for(const p of o)for(const m of Array.from(p.querySelectorAll(".finding-badges")))i.push({x:parseFloat(p.style.left)+p.clientLeft+m.offsetLeft,y:parseFloat(p.style.top)+p.clientTop+m.offsetTop,width:m.offsetWidth,height:m.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,c=Array.from(t.children).map(Ns),d=c.filter(p=>p.matches(".edge,.edge-label"));if(d.length){const p=s.createElementNS(Wn,"svg");p.setAttribute("viewBox","0 0 1 1"),p.setAttribute("width","1"),p.setAttribute("height","1"),p.setAttribute("aria-hidden","true"),p.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",p.append(...d),s.body.append(p);try{for(const m of d){const I=m.getBBox();i.push({x:I.x-12,y:I.y-12,width:I.width+24,height:I.height+24})}}finally{p.remove()}}const a=Sd(i),l=s.createElementNS(Wn,"svg");l.setAttribute("width",String(a.width)),l.setAttribute("height",String(a.height)),l.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const r=s.createElementNS(Wn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),l.append(r);const f=s.createElementNS(Wn,"g");f.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const p of c)f.append(p);l.append(f);const u=s.createElementNS(Wn,"foreignObject");u.setAttribute("width",String(a.bounds.width)),u.setAttribute("height",String(a.bounds.height));const b=s.createElementNS(yd,"div");b.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const p of o){const m=Ns(p);m.querySelector(".activity-open,.object-open")?.remove(),m.style.left=parseFloat(p.style.left)-a.bounds.x+"px",m.style.top=parseFloat(p.style.top)-a.bounds.y+"px",b.append(m)}u.append(b),l.append(u);const g=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(g).length>wd)throw Error(ki);return{svg:g,...a}}function Ed(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function wr(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const c=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(c),i()},n.onerror=()=>{clearTimeout(c),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const c=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(c),d?i(d):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(c),s(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Od(e,t){const n=await wr(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=Ed(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function Cd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=wr(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function kr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:jd(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function jd(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const c of o)i=Math.imul(i^c.codePointAt(0),16777619)>>>0,s=Math.imul(s^c.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function Ir(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return W(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function Md(e){W(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),Sn(e),yi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=kr(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=Ir(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return yi(t),t}const ce=(e,t)=>{if(!e)throw new Error(t)},zn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ai=e=>!!e&&typeof e=="object"&&!Array.isArray(e),po=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),Sr=e=>zn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Ld(e){ce(ai(e),"Graph must be an object");const t=e;ce(po(t,["version","nodes","relations"])||po(t,["version","nodes","relations","scope"]),"Invalid graph fields"),ce(t.version===1,"Unsupported graph version"),"scope"in t&&ce(zn(t.scope),"Invalid scope"),ce(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),ce(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){ce(ai(s),"Node must be an object");const c=s;ce(c.type==="business"||c.type==="object","Invalid node type");const d=c.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];c.type==="business"&&("problem"in c||"pain_level"in c)&&(d.push("problem","pain_level"),ce(["Low","Medium","High"].includes(String(c.pain_level)),"Invalid Pain level")),ce(po(c,d),"Invalid node fields"),ce(Object.entries(c).every(([l,r])=>l==="scope"||l==="information"||zn(r)),"Empty node text"),ce(typeof c.scope=="boolean","Invalid node scope"),ce(Sr(c.name)&&c.id===c.name,"Node ID must equal visible name"),ce(!n.has(c.id),"Duplicate node ID"),c.type==="object"&&(ce(typeof c.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.icon),"Invalid Lucide icon"),ce(Array.isArray(c.information)&&c.information.every(zn),"Invalid information")),n.set(c.id,c.type)}ce([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){ce(ai(s),"Relation must be an object");const c=s;ce(po(c,["kind","from","to","label"])&&Object.values(c).every(zn),"Invalid relation fields");const d=o[c.kind];ce(Array.isArray(d)&&n.has(c.from)&&n.has(c.to)&&n.get(c.from)===d[0]&&n.get(c.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([c.kind,c.from,c.to,c.label]);ce(!i.has(a),"Duplicate relation"),i.add(a)}}function Yt(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Un(e){const t=[];let n="";return Yt(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),ce(!n,"Unclosed code fence"),t}function Ii(e,t,n,o=[]){const i=Yt(e),s=Un(e),c=Object.create(null);return ce(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([d,a],l)=>{ce(t.includes(a)&&!(a in c),n+": unsupported/duplicate "+a),c[a]=i.slice(d+1,s[l+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ce(c[a]||o.includes(a),n+": empty "+a)}),ce(s.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),c}const Ps=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function Rd(e){const t=Yt(e),n=Un(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return ce(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],c)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);ce(d,"Invalid Finding ID");const a=d[1];ce(!o.has(a),"Duplicate Finding ID"),o.add(a);const l=Ii(t.slice(i+1,n[c+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);ce(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),ce(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),ce(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const r=l["### Targets"]==="(none)"?[]:Yt(l["### Targets"]).filter(f=>f.trim()).map(f=>(ce(f.startsWith("- ")&&Sr(f.slice(2)),"Invalid Finding target"),f.slice(2)));return ce(new Set(r).size===r.length,"Duplicate Finding target"),ce(l["### Scope"]==="items"?r.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:r,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function Dd(e,t){ce(!e.includes("<!--"),"HTML comments are unsupported");const n=Yt(e),o=Un(e).filter(u=>u[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;ce(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const c={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;o.slice(1).forEach(([u,b],g)=>{const p=o[g+2]?.[0]??n.length,m=n.slice(u+1,p).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(ce(m,"Empty section "+b),b==="# Findings"){ce(!a.has(b),"Duplicate Findings"),a.add(b),s=Rd(m);return}if(["# Scope","# Graph exceptions"].includes(b)){ce(!a.has(b),"Duplicate "+b),a.add(b),b==="# Scope"?(ce(!Un(m).length,"Scope must be prose"),c.scope=m):Yt(m).filter(D=>D.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(D=>{const x=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(D);ce(x,"Invalid exception"),c.relations.push({kind:x[1],from:x[2],to:x[3],label:x[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const I=i.exec(b);ce(I,"Unsupported heading "+b);const j=I[1],v=I[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[v]=n.slice(u,p).join(`
`);const M=D=>Un(m).some(x=>x[1]===D);if(j==="Object"){const D=["## Scope","## Icon"];M("## Information")&&D.push("## Information");const x=Ii(m,D,v);ce(["true","false"].includes(x["## Scope"]),"Invalid Scope");const P=Yt(x["## Information"]??"").filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(N=>(ce(/^- \S.*$/.test(N),"Invalid Information"),N.slice(2)));c.nodes.push({id:v,type:"object",name:v,scope:x["## Scope"]==="true",icon:x["## Icon"]==="(generic icon)"?"box":x["## Icon"],information:P});return}const k=["## Scope","## Why","## When"];M("## Exception When")&&k.push("## Exception When"),k.push("## Who","## Where","## How","### Input","### Procedure"),M("### Exception")&&k.push("### Exception"),k.push("### Output","## Result"),(M("## Problem")||M("## Pain level"))&&k.push("## Problem","## Pain level");const O=Ii(m,k,v,["## How"]);ce(!O["## How"],"How must only contain fields"),ce(["true","false"].includes(O["## Scope"]),"Invalid Scope"),t?.activity?.(v,O);const R={id:v,type:"business",name:v,scope:O["## Scope"]==="true",why:O["## Why"],when:O["## When"],who:O["## Who"],where:O["## Where"],result:O["## Result"]};"## Problem"in O&&(R.problem=O["## Problem"],R.pain_level=O["## Pain level"]),c.nodes.push(R);for(const[D,x]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(D in O)||x!=="business-exception"&&O[D]==="(none)"||Yt(O[D]).filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(P=>{const N=/^- (.+?) — (\S.*)$/.exec(P);ce(N,"Invalid relation in "+v),c.relations.push({kind:x,from:x==="output"?v:N[1],to:x==="output"?N[1]:v,label:N[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=c.nodes.filter(u=>u.type==="business").map(u=>u.id);Ld(c),c.nodes.sort((u,b)=>Ps(u.id,b.id)),c.relations.sort((u,b)=>{for(const g of["kind","from","to","label"]){const p=Ps(u[g],b[g]);if(p)return p}return 0});const r=new Set(c.nodes.map(u=>u.id));for(const u of s)u.unresolvedTargets=u.targets.filter(b=>!r.has(b));return{graph:c,sections:d,markdown:e,activityOrder:l,findings:s}}const Nd=["id","from","activity","condition","to","effect","path","evidence","note"],$e=(e,t)=>{if(!e)throw Error(t)},mo=e=>typeof e=="string"&&!!e.trim();function Pd(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());$e(n,"state-meta と遷移表が必要です");const o=lr(n[1]);$e(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),$e(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),$e(o.object===t,"対象Objectが一致しません"),$e(Array.isArray(o.states)&&o.states.length>0&&o.states.every(l=>mo(l)&&!l.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),$e(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&mo(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=l=>($e(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(r=>r.trim())),c=s(i[0]);$e([Nd,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>c.join("|")===l.join("|")),"表の列名が不正です"),$e(s(i[1]).length===c.length&&s(i[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),$e(i.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=i.slice(2).map(l=>{const r=s(l);$e(r.length===c.length&&r.every(mo),"表の列数・空欄が不正です");const f=Object.fromEntries(c.map((u,b)=>[u,r[b]]));return $e(/^T[0-9]+$/.test(f.id)&&!d.has(f.id),"遷移IDが不正または重複しています"),d.add(f.id),$e([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),$e(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),c.includes("exception")&&$e(f.path==="normal"?f.exception==="-":mo(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),$e(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),$e(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),$e(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),$e(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Ts=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Td(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let c=0;c<o.length;c++){const d=o[c];if(!s&&/^# Object /.test(d)?n=d.slice(9):!s&&/^# /.test(d)&&(n=null),!s&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let l="";for(c++;c<o.length;c++){const f=o[c];if(!l&&/^#{1,2} /.test(f)){c--;break}a.push(f),l=Ts(f,l)}const r=Pd(a.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}i.push(d),s=Ts(d,s)}if(new Set(t.map(c=>c.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function qd(e){const t=/^## State Transitions$/m.test(e)?Td(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=Dd(t.markdown,{activity:(a,l)=>i.set(a,l),document:(a,l)=>{n=a,o=l}}),c={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(s.activityOrder??[]).map(a=>{const l=s.graph.nodes.find(f=>f.id===a),r=i.get(a);return{id:a,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:s.graph.relations.map((a,l)=>({id:"legacy-relation-"+l,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(s.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(l=>s.graph.nodes.some(r=>r.id===l))}))};c.exceptions=kr(c);const d=t.declarations.map((a,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:c.id,revision:c.revision,verification:"unverified"},objectId:a.object,states:a.states.map(r=>({id:r,name:r})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:Ir(c,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:c,checks:[],states:d,diagnostics:[]}}}function Wd({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const n=ur({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(n.diagnostics)]};const o=e.business,i=[...o.objects,...o.activities],s=a=>o.roles?.find(l=>l.id===a.roleId)?.name??a.who,c=[...o.objects.map(a=>({...a,type:"object"})),...o.activities.map(a=>({id:a.id,type:"business",name:a.name,scope:a.scope,why:a.why,when:a.when,who:s(a),where:a.where,result:a.result,...a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel}}))],d=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(a=>a.basedOn.documentId===o.id).map(a=>{const l=new Map(a.states.map(f=>[f.id,f.name])),r={object:i.find(f=>f.id===a.objectId).name,states:a.states.map(f=>f.name),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(f=>({id:f.sourceId,from:l.get(f.fromId)??f.fromId,to:l.get(f.toId)??f.toId,activity:f.activityId,...f.event?{event:f.event}:{},...f.exceptionId?{exceptionId:f.exceptionId,exception:o.exceptions?.find(u=>u.id===f.exceptionId)?.name}:{},condition:f.condition,...f.conditionLabel?{conditionLabel:f.conditionLabel}:{},effect:f.effect,path:f.path,evidence:f.evidence,note:f.note}))};return[a.objectId,{model:r}]})));return{graph:fr({version:1,...o.scope?{scope:o.scope}:{},nodes:c,relations:o.relations.map(a=>({kind:a.kind,from:a.fromId,to:a.toId,label:a.label}))}),sections:Object.fromEntries(c.map(a=>[a.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:o.activities.map(a=>a.id),objectStateTransitions:d,findings:o.findings.map(a=>({...a,displayId:a.sourceId,targets:[...a.targetIds,...a.unresolvedTargets],targetNames:[...a.targetIds,...a.unresolvedTargets].map(l=>i.find(r=>r.id===l)?.name??l)}))}}const xr=8*1024*1024;function Ar(e){return/^\s*[\[{]/.test(e)}function Er(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function qs(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");Er(e);const n=yi(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function zd(e){if(!Ar(e))return qd(e);if(new TextEncoder().encode(e).byteLength>xr)throw Error("ローカルJSONは8MiB以内にしてください。");const t=lr(e.replace(/^\uFEFF/,""));if(Er(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=qs(Md(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const o=n.data.business;o.schemaVersion="0.1",delete o.roles;for(const i of o.activities)delete i.roleId;n.data.diagnostics=n.data.diagnostics.filter(i=>!i.startsWith("Role未確定:"))}return n}return qs(t,e)}function bn(e){return Wd(zd(e))}async function Ud(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>xr)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Ar(n))throw Error("JSONファイルの本文を確認してください。");return bn(n)}const $d=(e,t)=>Vi(e,t,!1);async function Vi(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const c=setTimeout(s,3e4);try{const d=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const r=d.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,u="";const b=new TextDecoder;try{for(;;){const{done:g,value:p}=await r.read();if(g)break;if(f+=p.length,f>l){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}u+=b.decode(p,{stream:!0})}u+=b.decode()}finally{r.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(u))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(u))throw Error("HTMLページは読み込めません。");return u}catch(d){const a=i.signal.aborted;throw s(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(c),t?.removeEventListener("abort",s)}}const xo=Ud;async function No(e,t){return bn(await Vi(e,t))}function Fd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return bn(e)}const Po=e=>e==="question"?"要確認":"要修正";function Vd(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${Po(o)} ${i}`)}return n}function Bd(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Po(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(pn(e.content)),t}function Gd(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Hd(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${Po(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function _d(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const c=document.createElement("label");c.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),c.append(d,document.createTextNode("解消済みも表示")),s.append(c);const a=(r,f,u)=>{const b=document.createElement("button");b.className="node-navigate finding-index-row",b.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const p=document.createElement("span");return p.textContent=u,b.append(g,p),b.onclick=()=>o(r),b},l=e.graph.nodes.filter(r=>(!i||r.id===i)&&typeof r.problem=="string");if(l.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of l)s.append(a({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const u=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!u.length)continue;const b=document.createElement("h3");b.textContent=`${f}（${u.length}件）`,s.append(b);for(const g of u)s.append(a({type:"finding",id:g.id},`${Po(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function Jd(e){const t=mr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,c)=>s===i[c]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...ha(),viewInset:[40,0],canvasOrigin:void 0}}function Kd(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function Bi(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Xd(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Bi(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Zd(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Bi(t)),n.href}function Yd(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Bi(t)}const Gi=`# Alderを使った設計業務 — Business Design

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
`,Qd=`{
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
`;function el(e,t){const n=new Set(t.graph.nodes.map(u=>u.id)),o=new Map;for(const u of t.graph.nodes)o.set(u.name,o.has(u.name)?void 0:u.id);const i=u=>n.has(u)?u:o.get(u),s=Object.create(null);for(const[u,b]of Object.entries(e.positions)){const g=i(u);g&&(s[g]=b)}const{scroll:c,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:c,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(u=>{const b=i(u);return b?[b]:[]}))]}}}const tl=`# Alderのチェックリストサンプル

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
`;function nl(e,t,n,o,i=()=>!0,s=()=>{}){const c=e.ownerDocument,d=c.defaultView;let a,l=0,r=0,f=!1,u=null,b="";const g=new Map,p=()=>{a!==void 0&&(d.clearTimeout(a),l=Math.max(0,l-(Date.now()-r)),a=void 0)},m=(v=!1)=>{if(v&&!i())return;p(),g.delete(b);const M=[...g].at(-1);if(M){j(M[1],"error",M[0]);return}const k=e.contains(c.activeElement);e.hidden=!0,t.textContent="",s(),k&&(u?.isConnected?u:o).focus({preventScroll:!0})},I=()=>{e.hidden||e.dataset.kind==="error"||f||c.hidden||e.contains(c.activeElement)||(p(),r=Date.now(),a=d.setTimeout(m,l))};e.addEventListener("pointerenter",()=>{f=!0,p()}),e.addEventListener("pointerleave",()=>{f=!1,I()}),e.addEventListener("focusin",v=>{const M=v.relatedTarget;M&&!e.contains(M)&&(u=M),p()}),e.addEventListener("focusout",()=>d.setTimeout(I,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),m(!0))}),c.addEventListener("visibilitychange",()=>c.hidden?p():I()),n.onclick=()=>m(!0);const j=(v,M,k)=>{p(),e.contains(c.activeElement)||(u=c.activeElement),b=k,e.dataset.kind=M,e.dataset.key=k,t.setAttribute("role",M==="error"?"alert":"status"),t.setAttribute("aria-live",M==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,s(),l=M==="warning"?8e3:5e3,I()};return(v,M="success",k="operation")=>{M==="error"&&v?(g.delete(k),g.set(k,v)):g.delete(k);const O=[...g].at(-1);if(O){if(!e.hidden&&t.textContent===O[1]&&b===O[0])return;j(O[1],"error",O[0]);return}if(!v){b===k&&m();return}!e.hidden&&t.textContent===v&&e.dataset.kind===M||j(v,M,k)}}const Ws=Qd,ht=document.querySelector("#app");ht.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Fe;const w=e=>document.getElementById(e),xn=hr(location.pathname);xn.version&&(w("preview-badge").hidden=!1,w("preview-badge").textContent=`確認用 · ${xn.version}`,w("preview-badge").title=`PR #${xn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const _n=e=>Rn(e,{"stroke-width":1.8,"aria-hidden":"true"}),Qn=document.createElement("div");Qn.id="source-menu";Qn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';ht.append(Qn);const To=document.createElement("div");To.id="checks-menu";To.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';ht.append(To);const mn=document.createElement("section");mn.id="check-followup";mn.hidden=!0;mn.setAttribute("aria-labelledby","check-followup-title");mn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(mn);const qo=document.createElement("div");qo.id="check-followup-menu";qo.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';ht.append(qo);const jt=document.createElement("input");jt.type="file";jt.id="check-file";jt.accept=".md,.markdown,text/markdown,text/plain";jt.hidden=!0;ht.append(jt);const Bt=document.createElement("section");Bt.id="check-url-dialog";Bt.hidden=!0;Bt.setAttribute("role","dialog");Bt.setAttribute("aria-labelledby","check-url-title");Bt.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';ht.append(Bt);const Wo=document.createElement("div");Wo.id="help-menu";Wo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${xn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${xn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${xn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;ht.append(Wo);Do(w("help-menu-toggle"),Wo);const $n=document.createElement("div");$n.id="url-history";Qn.append($n);function ol(){if($n.replaceChildren(),!E.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",$n.append(e);for(const t of E.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=oe||Le||ie,n.onclick=()=>{il(t.url)},$n.append(n)}}async function il(e){if(!(oe||Le||ie)){if(E.document?.source?.kind==="url"&&E.document.source.url===e){pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),to();return}Le=!0,Se();try{const t=await No(e),n=Dn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await eo(n)}catch(t){t instanceof Ln||Re("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Le=!1,Se()}}}const sl=Do(w("open-menu-toggle"),Qn),rl=Do(w("open-checks"),To,()=>{const e=X();w("check-open-sample").hidden=!e||!Xi(e),w("check-close").disabled=!e?.checks}),Or=Do(w("check-followup-open"),qo,()=>{w("check-followup-sample").hidden=!X()||!Xi(X())});for(const[e,t]of[["open-menu-toggle",hs],["open",hs],["open-url",ba],["open-text",ga],["view-markdown",ya],["open-checks",Hs],["share-source",va],["refresh",wa],["help-menu-toggle",ka],["drawer",Ia],["node-list-toggle",Sa],["node-list-close",_s],["display-settings-toggle",Js],["reset-layout",xa],["save-image",Aa],["copy-image",Ea],["out",Zs],["in",Ys]])w(e).prepend(_n(t));gd(document.querySelector("header"));const Si=bd(document.querySelector(".tab-strip"));let E={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},wt=!0,Wt=!1,oe=!0,jn=!1,un=!1,Le=!1,zs=Promise.resolve(),Qt,fe,kt=0,ie=!1,Fn=!1,An=0,Ao=0,En=!1,Hi=!1,xi=!1,Us=!1;const Ai=new Set,zt=new Set,Eo=new Set;function Cr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Eo){const o=[...E.document?[E.document]:[],...E.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&Eo.delete(n)}}const X=()=>E.tabs.find(e=>e.key===E.active),hn=e=>$t(e)?.key??e.key,Ft=e=>E.document?.key===hn(e);let Ei="";const al=nl(w("status"),w("status-text"),w("status-close"),w("viewport"));function Re(e,t="success",n="operation"){if(n==="storage"){if(Ei===e)return;Ei=e}al(e,t,n)}function _i(){Re("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Ji(){Re("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Rt(){oe||(kt++,_e())}function cl(e){e.preventDefault(),e.returnValue=!0}function _e(){const e=kt>An||Ao>0||!1||ie||Eo.size>0||xi||En||un,t=!oe&&e;t!==Us&&(Us=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",cl));const n=oe?"restoring":jn?"protected":un?"conflict":En?"error":xi||Eo.size>0?"draft":Ao>0||ie?"saving":kt>An?"dirty":Hi?"saved":"unchanged";ht.dataset.saveState!==n&&(ht.dataset.saveState=n),jn?_i():un?Ji():En?Re("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):Re("","success","storage"),Uo()}function Ki(e){En=!0,Ei=""}function zo(){if(jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(un)throw new $i}async function dl(e){zo();try{await Xc(e)}catch(t){throw t instanceof $i&&(un=!0,clearTimeout(Qt),Qt=void 0,Ji()),t}}function jr(e,t){Ao++,Ai.add(t),_e();const n=zs.catch(()=>{}).then(()=>dl(e)).then(()=>{An=Math.max(An,t),Hi=!0,Cr(e),An===kt&&(En=!1)},o=>{throw Ki(),o}).finally(()=>{Ao--,Ai.delete(t),_e()});return zs=n.catch(()=>{}),n}function be(e=180,t=!0){if(oe)return;if(t&&kt++,clearTimeout(Qt),Qt=void 0,jn){_i(),_e();return}if(un){Ji(),_e();return}if(ie||Ai.has(kt)||!t&&kt<=An&&!En){_e();return}const n=()=>{Qt=void 0;let o;try{o=structuredClone(Fi(E))}catch{Ki(),_e();return}jr(o,kt).catch(()=>_e())};e===0?n():Qt=window.setTimeout(n,e),_e()}async function ll(e){if(oe||fe||ie||!E.tabs.includes(e))return;if(Bn(e)===void 0){Fe?.closeBusinessOverview();return}st.cancel(),pe();const t=E.active===e.key,n={...E,tabs:E.tabs.filter(o=>o!==e),active:t?E.tabs[0]?.key:E.active};try{await Vo(()=>n,()=>{E=n}),t&&ht.dataset.workspaceArea==="business"&&Fe?.businessActivated()}catch{_e()}}function tt(){w("drawer").setAttribute("aria-label","業務内容開閉"),w("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!X(),t=e&&E.drawer,n=e&&!!E.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Wt=!1),Uo(),w("layout-lock").replaceChildren(_n(wt?Ks:Xs)),w("layout-lock").setAttribute("aria-pressed",String(wt)),w("layout-lock").title=wt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",w("layout-lock").toggleAttribute("disabled",oe),w("viewport").dataset.layoutLocked=String(wt),w("prefer-write").checked=E.preferWrite===!0,w("prefer-write").disabled=oe,w("show-exceptions").checked=X()?.showExceptions!==!1,w("show-exceptions").disabled=oe||ie||!X()||fe===X(),w("selected-edges-only").checked=X()?.selectedEdgesOnly===!0,w("selected-edges-only").disabled=oe||ie||!X()||fe===X(),document.documentElement.dataset.theme=E.dark?"dark":"light",w("theme").replaceChildren(_n(E.dark?Ra:Da)),w("formattedMarkdownDrawer").hidden=!t,w("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(E.width,innerWidth*.65))+"px",w("drawer").setAttribute("aria-expanded",String(t)),w("drawer").toggleAttribute("disabled",oe||!e),w("node-list-drawer").hidden=!n||nt().mode!=="findings",w("node-list-toggle").setAttribute("aria-expanded",String(n)),w("node-list-toggle").toggleAttribute("disabled",oe||!e),Fe?.syncChrome()}function Oi(){for(const e of["save-image","copy-image"]){const t=w(e);t.hidden=!X(),t.disabled=Fn||oe||!X()||fe===X(),t.setAttribute("aria-busy",String(Fn))}}function Uo(){Oi(),document.querySelector(".toolbar").dataset.settingsOpen=String(Wt),w("display-options").hidden=!Wt,w("reset-layout").disabled=oe||Le||ie||!1||!X()||zt.has(E.document?.key??"")||jn||un;const e=w("display-settings-toggle"),t=Wt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Wt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=oe||ie||!X()||fe===X()}function Mr(e,t=!1){const n=X();oe||ie||!n||fe===n||e===Wt||(e&&(Mn.delete($t(n)?.key??n.key),$o()),st.cancel(),Me=void 0,pe(),Wt=e,Uo(),Lt(n),!e&&(t||w("display-options").contains(document.activeElement))&&w("display-settings-toggle").focus({preventScroll:!0}))}async function Lr(e){const t=X();if(!(Fn||oe||!t||fe===t)){Fn=!0,Oi();try{const n=Ad(w("nodes"),w("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Cd(n),Re("グラフ全体のPNGをコピーしました。")):await Od(n,($t(t)?.name??t.name)+(Bn(t)?" - "+Bn(t):""))}catch(n){Re((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{Fn=!1,Oi()}}}w("save-image").onclick=()=>Lr(!1);w("copy-image").onclick=()=>Lr(!0);w("display-settings-toggle").onclick=()=>Mr(!Wt);w("reset-layout").onclick=()=>{const e=X();if(oe||Le||ie||fe||!e||zt.has(hn(e)))return;try{zo()}catch{_e();return}st.cancel(),Zt.cancel(),Me=void 0,pe();const t={...e,design:Lo(e)},n=Jd(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),qr.invalidate(e),Se(),n!==t&&be()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Wt&&w("source-dialog").hidden&&(e.preventDefault(),Mr(!1,!0))});function pe(e=!0){const t=X();if(!t)return!1;const n=[w("viewport").scrollLeft,w("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Rt(),be(180,!1)),o}function Rr(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function Ci(){sl.close(),rl.close(),Or.close(),Si.close(),Rr(ul),Si.update()}function ul(){const e=w("tabs");e.replaceChildren(),E.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===E.active?" active":""),n.draggable=Bn(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Io(t)!==void 0&&(n.dataset.activity=Io(t)),So(t)!==void 0&&(n.dataset.object=So(t));const o=document.createElement("button");pi(o,"business",t.name),o.setAttribute("aria-current",String(t.key===E.active)),o.disabled=ie,o.onclick=async()=>{if(ie||It&&It!==t.key&&!await Go())return;const s=pe()||E.active!==t.key;Fe?.activateBusiness(),E.active=t.key,Se(),Fe?.businessActivated(),be(180,s)};const i=mi("業務設計："+t.name+"を閉じる");i.disabled=ie,i.onclick=()=>ll(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),ie)return;const c=E.tabs.findIndex(a=>a.key===s.dataTransfer?.getData("text/plain")),d=E.tabs.indexOf(t);if(c>0&&d>0&&c!==d){const[a]=E.tabs.splice(c,1);E.tabs.splice(d,0,a),Ci(),be()}},n.onkeydown=s=>{if(!ie&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const c=E.tabs.indexOf(t),d=c+(s.key==="ArrowLeft"?-1:1);c>0&&d>0&&d<E.tabs.length&&([E.tabs[c],E.tabs[d]]=[E.tabs[d],E.tabs[c]],Ci(),be())}},e.append(n)})}const $s=new Map,Mn=new Set;function $o(){const e=X(),t=!!e&&e.design.sourceFormat!=="json"&&Mn.has($t(e)?.key??e.key)&&!e.checks;t||(Or.close(),mn.contains(document.activeElement)&&w("viewport").focus({preventScroll:!0})),mn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])w(n).disabled=oe||Le||ie||!1||!e||on(e).busy===!0}w("check-followup-later").onclick=()=>{const e=X();e&&Mn.delete($t(e)?.key??e.key),$o()};let ji;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])w("check-followup-"+e).onclick=()=>{ji=w("check-followup-open"),w(t).click(),ji=void 0};function Xi(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Gi}function on(e){const t=$t(e)?.key??e.key;let n=$s.get(t);return n||(n={},$s.set(t,n)),n}async function Zi(e,t){if(!Ft(e))throw Error("原本文書が切り替わりました。");const n=nn(E,E.recovery,{...E.document,checks:t},Fi(E).views);await Vo(()=>n,()=>{E=n,t&&Mn.delete($t(e)?.key??e.key)})}async function Dr(e,t){const n=on(e);if(e.design.sourceFormat==="json"||n.busy||ie||oe||fe===e)return;const o=Gn(e);n.busy=!0,n.error=void 0,n.candidate=void 0,Vt();try{const i=await t();if(!Ft(e))return;if(o!==Gn(E.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=Cn(i),c=Hn(s,E.tabs[0]);if(c.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+c.reason);c.state==="unverified"?n.candidate=i:(await Zi(e,i),n.candidate=void 0,Fe?.openRelatedChecks(X()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,Re(n.error,"error")}finally{n.busy=!1,Vt()}}async function Nr(e,t){const n=on(e);if(n.busy||ie||!Ft(e))return;const o=Hn(Cn(t),E.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,Vt();return}n.busy=!0,n.error=void 0;try{await Zi(e,{...t,confirmedFor:Gn(E.tabs[0])}),n.candidate=void 0,Fe?.openRelatedChecks(X()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,Vt()}}function Vt(){$o();const e=X(),t=w("detail"),n=e?on(e):void 0,o=e?e.key+":"+(e.selected??""):"";w("open-checks").disabled=oe||ie||fe===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const c=e.design.graph.nodes.find(f=>f.id===e.selected),d=hd(e,n,{disabled:oe||ie||fe===e,redraw:Vt,confirm:f=>{Nr(e,f)}}),a=document.createElement("div");a.className="right-drawer-heading";const l=tc(c?.name??"業務設計");if(c){const f=c.type==="business"?Pr(String(c.who),c.id):sr(c);f.classList.add("drawer-node-icon"),l.prepend(f)}a.append(l);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{w("drawer").click(),w("drawer").focus({preventScroll:!0})},a.append(r),t.append(a),d.hasChildNodes()&&t.append(d),c){const f=Hd(e.design,c.id,Yi);f.hasChildNodes()&&t.append(f)}t.append(Mc(e.design,c?.id)),c?.type==="business"&&Fe?.appendActivityTestLinks(t,c.id),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Fs=new Map,nt=()=>{const e=E.active??"";let t=Fs.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Fs.set(e,t)),t};function Yi(e){if(!X())return;const t=nt();t.mode="findings",t.finding=e,E.nodeDrawer=!0,innerWidth<=800&&(E.drawer=!1),tt(),mt(),w("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),be()}function fl(e){const t=X();if(!t)return;const n=nt();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){Yi(o[0]);return}E.nodeDrawer=!0,innerWidth<=800&&(E.drawer=!1),tt(),mt(),w("drawer-mode-findings").focus({preventScroll:!0}),be()}function pl(e,t){const n=nt().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!o&&!i)return nt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{nt().finding=void 0,mt(),w("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(Bd(o));else{const d=document.createElement("h2");d.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(d,pn(String(i.problem)))}const c=o?.targets??[i.id];if(c.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const l of c){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=l;const f=e.design.graph.nodes.some(b=>b.id===l),u=e.hiddenNodes?.includes(l);r.disabled=!f||!!u,r.textContent=(e.design.graph.nodes.find(b=>b.id===l)?.name??l)+(f?u?"（非表示）":"":"（参照先なし）"),r.onclick=()=>go(l,!0),d.append(r)}t.append(d)}return!0}function Pr(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&X()?.design.model?.business.roles?Wi(X().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(_n(tr)),o}function Fo(e,t=!0){oe||!X()||(st.cancel(),pe(),E.nodeDrawer=e,e&&nt().mode==="findings"&&innerWidth<=800&&(E.drawer=!1),tt(),e&&X()?.selected&&Nn(X().selected),mt(),t&&w(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),be())}function Nn(e){const t=X(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=nt();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(ec(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(w("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function ml(e,t){const n=X();if(!n||oe||ie||fe===n)return;st.cancel(),Me=void 0,pe();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],sn(),be()}function go(e,t=!1){let n=X();if(n&&!Lo(n).graph.nodes.some(f=>f.id===e)&&(pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,n=X(),Se()),!n||n.hiddenNodes?.includes(e)||fe===n)return;t||(nt().finding=void 0);const o=w("node-list").contains(document.activeElement);st.cancel(),Me=void 0,pe(),n.selected=e,Nn(e),tt(),sn();const i=w("viewport"),s=i.getBoundingClientRect(),c=w("formattedMarkdownDrawer").getBoundingClientRect(),d=E.drawer&&c.left>s.left&&c.left<s.right?c.left:s.right,a=Math.max(1,Math.min(i.clientWidth,d-s.left-i.clientLeft)),l=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],Lt(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],pe(),o){const f=t?"[data-finding-target]":"[data-list-node]",u=Array.from(w("node-list").querySelectorAll(f)).find(b=>(t?b.dataset.findingTarget:b.dataset.listNode)===e);(t?u:u?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}be()}function mt(){const e=X(),t=nt(),n=w("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=w("drawer-modes");s.replaceChildren();for(const g of["findings"]){const p=document.createElement("button");p.id="drawer-mode-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.mode===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.mode===g?0:-1,p.textContent=`指摘（${e?Gd(e.design):0}）`;const m=()=>{t.mode=g,mt(),w("drawer-mode-"+g).focus({preventScroll:!0})};p.onclick=m,p.onkeydown=I=>{["ArrowLeft","ArrowRight","Home","End"].includes(I.key)&&(I.preventDefault(),p.focus({preventScroll:!0}))},s.append(p)}for(const g of[w("node-categories"),w("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const c=w("node-list-search");c.value=t.search,c.disabled=!e||oe;const d=w("node-categories");d.replaceChildren();for(const[g,p]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const m=document.createElement("button");m.dataset.category=g,m.id="node-category-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.category===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.category===g?0:-1,m.textContent=p,m.onclick=()=>{t.category=g,mt(),w("node-category-"+g).focus({preventScroll:!0})},m.onkeydown=I=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(I.key))return;I.preventDefault();const j=["activity","object","role"],v=j.indexOf(g);t.category=I.key==="Home"?"activity":I.key==="End"?"role":j[(v+(I.key==="ArrowRight"?1:2))%3],mt(),w("node-category-"+t.category).focus({preventScroll:!0})},d.append(m)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=l.filter(g=>!a.has(g.id)).length,f=w("scope-outside"),u=r===l.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",u),f.setAttribute("aria-label",u==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(_n(u==="false"?Na:Pa)),f.disabled=!l.length||oe||fe===e;const b=w("show-outside");if(b.checked=u==="true",b.indeterminate=u==="mixed",b.setAttribute("aria-checked",u),b.disabled=f.disabled,w("scope-count").textContent=u==="mixed"?`${r}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(pl(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(m=>m.id===t.filterNode)?.name??t.filterNode)+"の指摘";const p=document.createElement("button");p.className="node-navigate finding-all",p.textContent="すべての指摘",p.onclick=()=>{t.filterNode=void 0,mt(),w("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,p)}n.append(_d(e.design,t.resolved,g=>{t.resolved=g,mt(),n.querySelector("input")?.focus({preventScroll:!0})},Yi,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}w("node-list-toggle").onclick=()=>Fo(!E.nodeDrawer);w("node-list-close").onclick=()=>Fo(!1);w("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Fo(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!w("node-list-drawer").hidden&&w("source-dialog").hidden&&(e.preventDefault(),Fo(!1))});w("node-list-search").oninput=()=>{nt().search=w("node-list-search").value,mt()};function Tr(){const e=X();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);ml(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}w("scope-outside").onclick=Tr;w("show-outside").onchange=Tr;const hl="http://www.w3.org/2000/svg",ci=e=>document.createElementNS(hl,e),qr=new vi,Vs=new WeakMap;function bl(e){if(!ir(e.graph))return;let t=Vs.get(e);return t||(t=Jc(e),Vs.set(e,t)),t.wires}function gl(e,t,n){Ti(w("edges"),e,t,{"data-relation":String(n)})}let Jn=()=>{},qt=[0,0],Xt=[0,0];function yl(){const e=w("node-list-drawer");return w("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function vl(){const e=w("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Lt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],Xt[0]):0,i[1]<0||n[1]>0?Math.min(i[1],Xt[1]):0],{growth:c,origin:d}=La(n,s,e.zoom),a=c.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+c[0],e.scroll[1]+c[1]],Rt(),be(180,!1));const l=Math.ceil(Math.max(1400,qt[0],(yl()+e.scroll[0])/e.zoom-t[0]*2-d[0],...o.map(f=>f[0]+340))),r=Math.max(850,qt[1],Math.max(qt[1],...o.map(f=>f[1]+68))+vl()/e.zoom-t[1],(w("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...o.map(f=>f[1]+220));w("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",w("canvas").style.height=(r+d[1]+t[1]*2)*e.zoom+"px",w("nodes").style.left=(d[0]+t[0])*e.zoom+"px",w("nodes").style.top=(d[1]+t[1])*e.zoom+"px",w("edges").style.left=t[0]*e.zoom+"px",w("edges").style.top=t[1]*e.zoom+"px",w("nodes").style.width=l+"px",w("nodes").style.height=r+"px",w("nodes").style.transform=`scale(${e.zoom})`,w("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${r+d[1]}`),w("edges").style.width=(l+d[0])*e.zoom+"px",w("edges").style.height=(r+d[1])*e.zoom+"px",a&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("zoom").textContent=Math.round(e.zoom*100)+"%"}function sn(){Rr(wl)}function wl(){Uo(),Zt.cancel(),Jn=()=>{},qt=[0,0],Xt=[0,0];const e=X();if(w("nodes").replaceChildren(),w("edges").replaceChildren(),w("empty").hidden=!!e,w("canvas").hidden=!e,!e){w("viewport").scrollLeft=0,w("viewport").scrollTop=0,Vt(),mt();return}const t=Lo(e),n=t.graph.nodes,o=n.filter(r=>!e.hiddenNodes?.includes(r.id)),i=new Set(o.map(r=>r.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,c=e.positions,d=wo(t.graph.relations,s);Lt(e),w("edges").append(Pi());const a=Kd(t.graph.relations,E.preferWrite===!0),l=()=>{const r=n.flatMap(m=>{const I=c[m.id];return I?[{id:m.id,x:I[0],y:I[1],width:260,height:68}]:[]}),f=bl(t),u=qr.update(e,t,r,t.graph.relations,f),b=new Map;for(qt=[0,0],Xt=[0,0];w("edges").childNodes.length>1;)w("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(m=>[m.id,m.name]));t.graph.relations.forEach((m,I)=>{if(a.has(I))return;const j=u[I];if(!j||(qt[0]=Math.max(qt[0],j.bounds.right+20,j.label[0]+Math.max(30,m.label.length*12)/2+12),qt[1]=Math.max(qt[1],j.bounds.bottom+20,j.label[1]+22),Xt[0]=Math.min(Xt[0],...j.points.map(D=>D[0]-20),j.label[0]-Math.max(30,m.label.length*12)/2-12),Xt[1]=Math.min(Xt[1],...j.points.map(D=>D[1]-20),j.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(m)||!i.has(m.from)||!i.has(m.to)||e.showExceptions===!1&&(m.kind==="business-exception"||m.kind==="object-exception")))return;const v=ci("path");v.setAttribute("d",j.path),v.dataset.relation=String(I),v.dataset.collisions=String(j.collisions),v.dataset.rerouted=String(j.rerouted),v.dataset.fallback=String(j.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),m.kind.endsWith("exception")&&v.classList.add("exception"),d.related(m)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),d.muted(m)&&v.classList.add("muted");const M=ci("title");M.textContent=(g.get(m.from)??m.from)+" → "+(g.get(m.to)??m.to)+": "+m.label,v.append(M),w("edges").append(v),m.kind.endsWith("exception")&&gl(v,j,I);const k=or(m,I,f?.[I]),O=b.get(k);if(O){O.dataset.relations+=" "+I,d.related(m)&&(O.classList.add("review-related"),O.classList.remove("muted"));return}const R=ci("text");b.set(k,R),R.dataset.relations=String(I),R.setAttribute("x",String(j.label[0]-Math.max(30,m.label.length*12)/2)),R.setAttribute("y",String(j.label[1])),R.setAttribute("text-anchor","start"),R.classList.add("edge-label"),R.setAttribute("dominant-baseline","middle"),R.dataset.relation=String(I),d.related(m)&&R.classList.add("review-related"),d.muted(m)&&R.classList.add("muted"),R.textContent=m.label,w("edges").append(R)});const p=w("edges");for(const m of[...Array.from(p.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(p.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(p.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(p.querySelectorAll(".edge-label.review-related"))])p.append(m);Lt(e)};Jn=l,l(),o.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+d.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=c[r.id][0]+"px",f.style.top=c[r.id][1]+"px",r.type==="business"?f.append(Pr(String(r.who),r.id)):f.append(sr(r));const u=document.createElement("span");u.className="node-text";const b=document.createElement("span");b.className="review-kind",b.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),u.append(b);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,u.append(g),r.type==="business"){const v=document.createElement("small");v.textContent=String(r.who),u.append(v)}if(f.append(u),Ta(r.id,Bn(e))){const v=document.createElement("button");v.type="button",v.className=r.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",r.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),r.type==="business"?Mi(r.id):Wr(r.id),Fe?.businessActivated()},f.append(v)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const p=Vd(e.design,r);if(p.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=p.join(" · "),v.setAttribute("aria-label",r.name+"の指摘を開く"),v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),fl(r.id)},f.append(v),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+p.join("、"))}let m;const I=f;I.onpointerdown=v=>{v.button!==0||fe===e||wt||(v.stopPropagation(),I.setPointerCapture(v.pointerId),m=v.pointerId,Zt.begin(r.id,[v.clientX,v.clientY]))},I.onpointermove=v=>{m===void 0||v.pointerId!==void 0&&v.pointerId!==m||!f.isConnected||fe===e||Zt.move([v.clientX,v.clientY])},I.onpointerup=v=>{if(m===void 0||m!==v.pointerId||(m=void 0,!f.isConnected||fe===e))return;const M=Zt.end();I.hasPointerCapture?.(v.pointerId)&&I.releasePointerCapture(v.pointerId),M&&(M.moved||(nt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Rt()),Nn(r.id)),pe(),sn(),be(180,!1))};const j=v=>{m===void 0||m!==v.pointerId||(m=void 0,f.isConnected&&(Zt.cancel(),pe(),be(180,!1)))};I.onpointercancel=j,I.onlostpointercapture=j,w("nodes").append(f)}),w("zoom").textContent=Math.round(e.zoom*100)+"%",Vt(),mt()}function Mi(e){oe||ie||fe||(pe(),sd(E,e),Se(),be(),w("viewport").focus({preventScroll:!0}))}function Wr(e){oe||ie||fe||(pe(),rd(E,e),Se(),be(),w("viewport").focus({preventScroll:!0}))}function Se(){document.title=E.document?E.document.name+" · Alder Viewer":"Alder Viewer",st.cancel(),Me=void 0,tt(),Ci(),sn();const e=X();e&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("refresh").toggleAttribute("disabled",oe||ie||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||zt.has(hn(e))),w("refresh").hidden=!e,w("view-markdown").toggleAttribute("disabled",oe||Le||ie||!1||!e||zt.has(hn(e))),w("view-markdown").hidden=!e,w("open-checks").hidden=!e||e.design.sourceFormat==="json",w("open-checks").toggleAttribute("disabled",oe||Le||ie||!1||!e||!!(e&&on(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])w(t).toggleAttribute("disabled",oe||Le||ie);w("open-sample").setAttribute("aria-disabled",String(oe||Le||ie)),w("open-sample").tabIndex=oe||Le||ie?-1:0,w("theme").toggleAttribute("disabled",oe),Zn(),$o(),ol(),_o(),Fe?.syncDocument()}async function eo(e){const t=E.document,n=od(E,e);return t?(await Vo(()=>n,()=>{E=n,Mn.add($t(E.tabs[0])?.key??E.tabs[0].key)}),!0):(pe(),E=n,Mn.add($t(E.tabs[0])?.key??E.tabs[0].key),Se(),be(),!0)}async function zr(e,t){if(It&&!await Go())return;const n=await xo(e),o=X();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await Kn(o,n,t))return;Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),be();return}const i=Dn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await eo(i)}w("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])w("guide-"+e).onclick=()=>w(e).click();w("open-sample").onpointerdown=e=>e.stopPropagation();w("open-sample").onclick=async e=>{if(e.preventDefault(),!(oe||Le||ie))try{if(E.document?.source?.kind==="sample"&&E.document.design.markdown===Ws){pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),w("viewport").focus({preventScroll:!0});return}const t=bn(Ws),n=E.document?.source?.kind==="sample"&&E.document.design.markdown===Gi?E.tabs[0]:void 0;n&&pe();const o=n??E.sampleLayout,i=o?el(o,t):{},s=Dn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await eo(s)&&w("viewport").focus({preventScroll:!0})}catch(t){Re("サンプルを開けません: "+t.message,"error")}};w("open").onclick=async()=>{if(!(oe||Le||ie)){Le=!0,Se();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await zr(await n.getFile(),n)}else w("fallback").click()}catch(e){e.name!=="AbortError"&&Re("開けません: "+e.message,"error")}finally{Le=!1,Se()}}};w("fallback").onchange=async()=>{const e=w("fallback");if(!(oe||Le||ie)){Le=!0,Se();try{for(const t of Array.from(e.files??[]))await zr(t)}catch(t){Re("開けません: "+t.message,"error")}e.value="",Le=!1,Se()}};class Ln extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function Vo(e,t){if(ie||fe)throw Error("表示を切り替えています。完了後に再試行してください。");try{zo()}catch(i){throw new Ln(i)}pe(),clearTimeout(Qt),Qt=void 0,ie=!0,kt++;const n=kt;Se(),_e();let o=!1;try{const i=structuredClone(Fi(e()));await jr(i,n);const s=E;t(),E!==s&&(E=ad(E,s)),et==="view"&&It&&!E.tabs.some(c=>c.key===It)&&(It=E.tabs[0]?.key),Cr(i),o=!0}catch(i){throw Ki(),new Ln(i)}finally{ie=!1,Se(),_e(),o&&kt!==n&&be(0,!1)}}async function Kn(e,t,n=e.handle,o=!1){if(!Ft(e)||e.design!==E.document?.design)return!1;const i=id(E,t,n,o);return await Vo(()=>i,()=>{E=i}),fn=void 0,_o(),Re(""),!0}async function Bs(e){if(!Ft(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await Kn(e,await xo(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const c=i.files?.[0];c&&await Kn(e,await xo(c)),s()}catch(c){i.remove(),o(c)}},i.click()})}w("refresh").onclick=async()=>{const e=X();if(oe||ie||fe||!e||e.source?.kind==="text"||e.source?.kind==="sample"||zt.has(hn(e)))return;It===e.key&&Co();const t=hn(e);zt.add(t),Se();try{if(e.source?.kind==="url"){const o=await No(e.source.url);await Kn(e,o);return}if(!e.handle){await Bs(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Ft(e))return;if(n!=="granted"){Re("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Bs(e);return}await Kn(e,await xo(await e.handle.getFile()))}catch(n){Ft(e)&&n.name!=="AbortError"&&!(n instanceof Ln)&&Re("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{zt.delete(t),Se()}};let et="text",It,Ut=!1,en=0,Oo,Li=null;const Mt=()=>w("source-text"),Xn=()=>w("source-url");function Qi(){xi=!w("source-dialog").hidden&&et!=="view"&&(et==="text"?Mt().value:Xn().value)!=="",_e()}Xn().addEventListener("input",Qi);function Zn(){Ri();const e=et==="view",t=Ut||ie;Mt().disabled=t,Mt().readOnly=e,w("source-dialog").dataset.mode=et,w("source-submit").hidden=e,w("source-submit").textContent="表示",w("source-submit").disabled=t||e,w("source-cancel").disabled=ie||t&&et!=="url",w("source-cancel").textContent=e?"閉じる":"キャンセル",Qi(),queueMicrotask(Fr)}function es(e,t){if(!(oe||Le||ie||t&&zt.has(hn(t)))){Oo?.abort(),en++,et=e,It=t?.key,Ut=!1,Li=document.activeElement,w("source-dialog").hidden=!1,w("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${E.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])w(n).hidden=e!=="url";for(const n of["text-label","source-text"])w(n).hidden=e==="url";w("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Mt().value=t.design.markdown:e==="text"&&(Mt().value=Bo),Zn(),(e==="url"?Xn():Mt()).focus()}}let Bo="",ho;function kl(){if(Li?.isConnected&&Li.focus({preventScroll:!0}),ho!==void 0&&cancelAnimationFrame(ho),et!=="view")return;const e=en;ho=requestAnimationFrame(()=>{if(ho=void 0,e!==en||!w("source-dialog").hidden)return;const t=window.visualViewport,n=ht.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Co(){en++,Oo?.abort(),Ut=!1,It=void 0,w("source-dialog").hidden=!0,Zn(),kl()}async function Go(){return ie?!1:(et==="text"&&(Bo=Mt().value),Co(),!0)}function Ur(){return Go()}Mt().oninput=()=>{et==="text"&&(Bo=Mt().value,Qi())};let yo=!1;function $r(){return oe||Le||Ut||ie||fe?"読込が終わってから共有してください。":Xd(X())}function Ri(){const e=$r(),t=w("share-source");t.hidden=!X(),t.setAttribute("aria-disabled",String(yo||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}w("share-source").onclick=async()=>{if(yo)return;const e=$r();if(e){Re(e,"warning");return}const t=X();if(t.source?.kind!=="url")return;const n=t.source.url,o=Zd(location.href,n);yo=!0,Ri();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),Re("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{Re("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{yo=!1,Ri()}};let Tt,kn=0,Gs=0,Vn;function Fr(){if(oe||Le||Ut||fe||ie||Tt||Vn===void 0)return;const e=Vn;Vn=void 0,ts(e)}async function ts(e=location.hash){const t=e;if(oe)return;const n=++Gs;if(!/^#source(?:=|$)/.test(t)){Vn=void 0,Tt&&!ie&&(Tt.abort(),Tt=void 0,kn++,Le=!1,Se());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),ie){Vn=t;return}if(Ut||Le&&!Tt){Re("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++kn;Tt?.abort();try{const i=Yd(t);zo();const s=E.tabs.find(l=>l.source?.kind==="url"&&l.source.url===i),c=s;if(c){if(It&&It!==c.key&&!await Go()||o!==kn||n!==Gs)return;const l=pe()||E.active!==c.key;E.active=c.key,Se(),be(180,l),Re("開いている共有元のタブを選択しました。表示内容は保持しています。"),to();return}Tt=new AbortController,Le=!0,Se();const d=await No(i,Tt.signal);if(o!==kn)return;const a=Dn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await eo(a))return;Re("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===kn&&!(i instanceof Ln)&&Re("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===kn&&(Tt=void 0,Le=!1,Se(),Fr())}}window.addEventListener("hashchange",()=>{ts().then(()=>{E.document?.key===Di&&to()})});function ns(e){E.drawer=!0,tt(),Vt()}async function Il(e){const t=on(e);if(!(e.design.sourceFormat==="json"||t.busy||ie||oe||fe===e)){t.busy=!0;try{await Zi(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,Vt()}}}let jo;jt.onchange=()=>{const e=jt.files?.[0],t=jo??X();jo=void 0,jt.value="",!(!e||!t||!Ft(t))&&(ns(),Dr(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};jt.oncancel=()=>{jo=void 0};w("check-open").onclick=()=>{jo=X(),jt.click()};let os,vo=null;function is(){Bt.hidden=!0,os=void 0,(vo&&!vo.closest("[hidden]")?vo:w("open-checks").getBoundingClientRect().width?w("open-checks"):w("document-actions-toggle")).focus({preventScroll:!0})}w("check-open-url").onclick=()=>{const e=X();e&&(vo=ji??document.activeElement,os=e,w("check-url").value=on(e).url??"",Bt.hidden=!1,w("check-url").focus())};w("check-url-cancel").onclick=is;Bt.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),is())};w("check-url-form").onsubmit=e=>{e.preventDefault();const t=os;if(!t||!Ft(t))return;const n=w("check-url").value.trim();on(t).url=n,is(),ns(),Dr(t,async()=>({name:n,url:n,markdown:await $d(n)}))};w("check-open-sample").onclick=()=>{const e=X();!e||!Xi(e)||(ns(),Nr(e,{name:"チェックリストのサンプル",markdown:tl}))};w("check-close").onclick=()=>{const e=X();e&&Il(e)};w("open-sample-menu").onclick=()=>{w("open-sample").click()};w("view-markdown").onclick=()=>{const e=X();e&&es("view",e)};w("open-url").onclick=()=>es("url");w("open-text").onclick=()=>es("text");w("source-cancel").onclick=()=>Ur();w("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Ur())};w("source-submit").onclick=async()=>{if(Ut||ie||et==="view"&&fe||w("source-dialog").hidden||et==="view")return;Ut=!0,Zn();const e=++en,t=et;Oo=new AbortController;try{const n=et==="url"?new URL(Xn().value.trim()).href:Xn().value.trim();if(t==="url"&&E.document?.source?.kind==="url"&&E.document.source.url===n){Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Co(),Se(),to();return}const o=t==="url"?await No(n,Oo.signal):Fd(Mt().value),i=o.markdown;if(e!==en)return;const s=Dn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await eo(s))return;Re(""),t==="text"&&(Bo=i),Co()}catch(n){e===en&&!(n instanceof Ln)&&Re("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===en&&(Ut=!1,Zn())}};w("layout-lock").onclick=()=>{oe||(st.cancel(),Me=void 0,pe(),wt=!wt,tt(),sn())};w("selected-edges-only").onchange=()=>{const e=X();!e||oe||ie||fe===e||(st.cancel(),Me=void 0,pe(),e.selectedEdgesOnly=w("selected-edges-only").checked,Jn(),be())};w("show-exceptions").onchange=()=>{const e=X();!e||oe||ie||fe===e||(st.cancel(),Me=void 0,pe(),e.showExceptions=w("show-exceptions").checked,Jn(),be())};w("prefer-write").onchange=()=>{oe||(pe(),E.preferWrite=w("prefer-write").checked,sn(),be())};w("theme").onclick=()=>{oe||(E.dark=!E.dark,tt(),be())};w("drawer").onclick=()=>{oe||!X()||(pe(),E.drawer=!E.drawer,Se(),be())};for(const[e,t]of[["in",bs],["out",1/bs]])w(e).onclick=()=>{const n=X();if(n&&fe!==n){const o=pe(),i=Oa({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,Se(),be(180,s)}};const ve=w("viewport");function Vr(e,t){const n=X();if(!n||ie||fe===n)return;pe();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Rt();const i=Array.from(w("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),Jn()}const Zt=Ma({read:()=>{const e=X();return e&&!ie&&e!==fe&&!wt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>X()?.positions[e],connected:e=>Array.from(w("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=ve.getBoundingClientRect(),t=e.left+ve.clientLeft,n=e.top+ve.clientTop,o={left:t,top:n,right:t+ve.clientWidth,bottom:n+ve.clientHeight};for(const[s,c]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=w(s),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=o.bottom||(c==="right"&&a.left>o.left&&a.left<o.right&&(o.right=a.left),c==="left"&&a.right>o.left&&a.right<o.right&&(o.left=a.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:Vr,pan:e=>{const t=X();if(!t||t===fe||wt)return;pe();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Lt(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],pe(),Rt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),st=Ca(ve,{nodeDrag:Zt,read:()=>{const e=X();return e&&!ie&&fe!==e?{key:e.key,zoom:e.zoom,locked:wt,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},position:e=>X()?.positions[e],change:e=>{const t=X();if(!t||ie||fe===t)return;const n=t.scroll;let o=!1;e.node&&Vr(e.node.id,e.node.position),e.selected&&(nt().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Nn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?sn():e.zoom!==void 0&&Lt(t),e.scroll&&(ve.scrollLeft=e.scroll[0],ve.scrollTop=e.scroll[1]),pe(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Rt()},finish:()=>{const e=X();e&&Lt(e),pe(),be(180,!1)}}),ss=()=>{st.cancel(),Me=void 0,pe(),be(0,!1)};window.addEventListener("blur",ss);window.addEventListener("pagehide",ss);document.addEventListener("visibilitychange",()=>{document.hidden&&ss()});ve.onscroll=()=>{pe()};let Me;ja(ve,{read:()=>{const e=X();return e&&!oe&&!ie&&e!==fe?{zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},change:e=>{const t=X();!t||ie||t===fe||(st.cancel(),Zt.cancel(),Me=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Lt(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],pe(!1),Rt(),be(180,!1))}});ve.onpointerdown=e=>{const t=X(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||ie||t===fe||n&&!wt||(Me={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[ve.scrollLeft,ve.scrollTop],node:n,moved:!1},ve.setPointerCapture(e.pointerId))};ve.onpointermove=e=>{if(Me&&Me.pointer===e.pointerId&&Me.key===X()?.key&&X()!==fe){const t=e.clientX-Me.x,n=e.clientY-Me.y;Math.hypot(t,n)>3&&(Me.moved=!0),ve.scrollLeft=Me.scroll[0]-t,ve.scrollTop=Me.scroll[1]-n,pe()}};ve.onpointerup=e=>{if(!Me||Me.pointer!==e.pointerId)return;const t=X(),n=Me;Me=void 0,ve.hasPointerCapture?.(e.pointerId)&&ve.releasePointerCapture(e.pointerId),t&&t!==fe&&n.key===t.key&&!n.moved&&n.node&&(nt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Rt()),Nn(n.node),sn()),pe(),be(180,!1)};ve.onpointercancel=()=>{Me=void 0};ve.addEventListener("lostpointercapture",e=>{e.target===ve&&Me?.pointer===e.pointerId&&(Me=void 0)});let Ho=!1;w("resize").onpointerdown=e=>{oe||(Ho=!0,w("resize").setPointerCapture(e.pointerId))};w("resize").onpointermove=e=>{if(Ho){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==E.width&&(E.width=t,Rt()),tt()}};w("resize").onpointerup=()=>{Ho=!1,be(180,!1)};w("resize").onpointercancel=()=>{Ho=!1,be(180,!1)};w("resize").onkeydown=e=>{if(!oe&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,E.width+(e.key==="ArrowLeft"?20:-20)));t!==E.width&&(E.width=t,Rt()),tt(),be(180,!1)}};window.addEventListener("resize",()=>{tt();const e=X();e&&Lt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=X();t&&Lt(t)});e.observe(w("viewport")),e.observe(document.querySelector(".toolbar"))}function bo(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=bn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Cn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Pn=document.createElement("section");Pn.id="source-update-notice";Pn.className="info-bar";Pn.hidden=!0;Pn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Pn);let fn;const Br=new Set;let di=0,Di,li;function _o(){const e=E.document;Pn.hidden=!fn||fn.key!==e?.key||fn.baseline!==e.design.markdown||Br.has(e.key),w("source-update-refresh").disabled=oe||Le||ie||!!(e&&zt.has(e.key))}w("source-update-close").onclick=()=>{fn&&Br.add(fn.key),_o()};w("source-update-refresh").onclick=()=>{w("refresh").click()};async function to(){const e=E.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(li===t)return;li=t;const n=++di,o=e.key,i=e.source.url,s=e.design.markdown;try{const c=await Vi(i);if(n!==di||E.document?.key!==o||E.document.design.markdown!==s||E.document.source?.kind!=="url"||E.document.source.url!==i)return;bn(c),fn=c.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,_o()}catch{}finally{n===di&&(li=void 0)}}Fe=Wc(ht,{rightDrawer:{isOpen:()=>E.drawer,isReady:()=>!oe,setOpen:e=>{oe||(E.drawer=e,tt(),be())}},capture:()=>{pe(),st.cancel(),Me=void 0},business:()=>({key:E.document?.key,design:E.document?.design,relatedChecks:E.tabs[0]?md(E.tabs[0]):[],viewKey:X()?.key,views:E.tabs.map(e=>({key:e.key,name:e.name,activity:Io(e),object:So(e)})),activities:E.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:E.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:E.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!E.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=E.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Mi(e),go(e)},openObject:e=>{Wr(e),go(e)},openOverview:()=>{E.tabs[0]&&(pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),be())},activateView:e=>{E.tabs.some(t=>t.key===e)&&(pe(),E.active=e,Se(),be())},statePanel:e=>E.document?Fc(E.document.design,e,t=>{Fe?.activateBusiness(),Mi(t),go(t),Fe?.businessActivated()}):void 0,closeLegacyList:()=>{E.nodeDrawer=!1,tt()},refresh:()=>{tt(),Si.update()}});const Sl=E;Se();_e();Zc().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])bo(l);if(t.document){const l={...t.document};bo(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)bo(l)}const n=nd(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const l of o.tabs)bo(l);if(new Set(o.tabs.map(l=>l.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(r=>typeof r=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(r=>Number.isFinite(r)&&r>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:c,...d}=o,a=l=>({...l,hiddenNodes:l.hiddenNodes??(o.scopeOutside==="hide"?l.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});E=nn({...d,tabs:o.tabs.map(a)},n.recovery,n.document,o.tabs.map(l=>{const{design:r,checks:f,source:u,draft:b,edited:g,handle:p,name:m,...I}=a(l);return I})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(E.sampleLayout={...o.sampleLayout,hiddenNodes:bn(Gi).graph.nodes.filter(l=>!l.scope).map(l=>l.id)}),E.tabs.some(l=>l.key===E.active)||(E.active=E.tabs[0]?.key),X()?.selected&&Nn(X().selected),Di=E.document?.key,Se(),Hi=!0}).catch(()=>{E=Sl,jn=!0,_i()}).finally(()=>{oe=!1,Se(),_e(),ts().then(()=>{E.document?.key===Di&&to()})});
