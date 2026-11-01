import{L as Hs,D as sa,G as ra,W as aa,P as ca,l as Rn,X as _s,C as da,n as la,S as Js,o as Ks,p as Xs,M as Zs,q as Ys,s as Qs,t as No,g as Po,r as uo,d as er,b as vi,u as To,U as tr,v as ua,w as nr,x as ir,y as fo,z as fa,m as qo,A as pa,B as or,E as ma,j as ha,F as hs,H as ba,T as ga,I as ya,J as va,R as wa,K as ka,N as Ia,O as Sa,Q as xa,V as Aa,Y as Ea,Z as bs,k as Oa,i as Ca,h as ja,f as Ma,a as La,_ as Ra,$ as Da,a0 as sr,a1 as Na,a2 as Pa,e as Ta}from"./canvas-toolbar-Ch5Zpft_.js";const qa={subsystems:{full:"サブシステム",icon:ca},business:{full:"業務設計",icon:aa},states:{full:"状態遷移",icon:ra},concept:{full:"データ構造",icon:sa},tests:{full:"テスト仕様",icon:Hs}};function po(e,t,n){const i=qa[t],o=document.createElement("span"),s=document.createElement("span"),c=document.createElement("span");o.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Rn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),c.className="view-tab-name",c.textContent=n,o.append(s,c),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function mo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Rn(_s,{"aria-hidden":"true","stroke-width":1.8})),t}function Wa(e){const t=Rn(e?da:la,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function za(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,c=Math.max(0,Math.min(n,s+i*o));c!==s&&(e.scrollLeft=c,t.preventDefault())},{passive:!1})}function Ua(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const $a=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function gs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=$a,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,s)=>{const c=Rn(o,{"stroke-width":1.8,"aria-hidden":"true"});s&&c.classList.add(s),t.querySelector(i)?.append(c)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Js),n(".layout-lock",Ks,"lock-closed"),n(".layout-lock",Xs,"lock-open"),n(".zoom-out",Zs),n(".zoom-in",Ys)}function ys(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Fa({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(r=>r.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),i=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(r=>["",r]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:a.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),o=a=>i.find(l=>l.id===a),s=(a,l)=>{const r=Object.fromEntries(a.nodes.map(b=>[b.id,{...l[b.conceptId],name:b.name,note:b.description,sources:b.sources,conceptId:b.conceptId,subsystemId:b.subsystemId,fields:b.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(b=>a.nodes.some(g=>g.subsystemId===b.id)).map(b=>({id:b.id,name:b.name})),u=a.handoffIds.map(b=>e.handoffs.find(g=>g.id===b)).map(b=>({id:b.id,from:b.fromSubsystemId,to:b.toSubsystemId,label:b.information,returning:b.flowDirection==="return"}));return{ids:a.nodes.map(b=>b.id),tables:r,edges:a.edges.map(b=>[b.fromViewId,b.toViewId,b.fromLabel,b.toLabel,b.kind]),regions:f,handoffs:u}};return{tables:t,edges:n,groups:i,findGroup:o,graph:a=>{const l=o(a);if(!l)throw Error("Unknown review group: "+a);const r=e.reviewGroups.find(b=>b.id===a),f=r.graph.subsystemViews;if(f)return s(f,l.concepts);const u=Object.keys(t).filter(b=>Object.hasOwn(l.concepts,b));return{ids:u,tables:l.concepts,edges:l.relations.filter(([b,g])=>u.includes(b)&&u.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function Qe(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Va(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",Qe(i,"span",t),i.onclick=n,e.append(i),i}function Ba(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Ga(e,t,n,i=()=>{},o=()=>{},s=[]){const c=n.contentFor(t.id);if(e.replaceChildren(),!c)return;Qe(e,"p",c.description).className="review-description",Qe(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of c.relatedActivities){const l=document.createElement("li"),r=s.find(u=>u.id===a.id&&u.name===a.name),f=Va(l,a.name,()=>{r&&o(r.id)});f.disabled=!r,f.setAttribute("aria-label",a.name+"を業務タブで開く"),d.append(l)}e.append(d),Qe(e,"h3","情報の構造");for(const a of c.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=a.id,Qe(l,"h4",a.title),Qe(l,"p",a.description),e.append(l)}Qe(e,"h3","できること");for(const a of c.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=a.id,Qe(l,"h4",a.title),Qe(l,"p",a.description);for(const r of a.samples){const f=i(a.id,r.id),u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=r.id,u.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?u.onclick=f.open:(u.disabled=!0,u.title="対応するテスト仕様へのリンクがありません"),l.append(u)}e.append(l)}Qe(e,"h3","できないこと（業務上のルール）");for(const a of c.limitations){const l=document.createElement("section");l.className="review-limitation",Qe(l,"h4",a.title),Qe(l,"p",a.description),Qe(l,"h5","理由"),Qe(l,"p",a.reason),e.append(l)}}function Kt(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function Ha({model:e,business:t}){const n=c=>c.kind==="group"?e.subsystems.find(d=>d.id===c.id):e.handoffs.find(d=>d.id===c.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(c){const d=n(c);return d?d.activityIds.map(a=>t.activities.find(l=>l.id===a)).filter(Boolean):[]}function s(c,d){if(c.replaceChildren(),d.kind==="group"){const f=e.subsystems.find(b=>b.id===d.id);if(!f)return"";Kt(c,"p",f.purpose),Kt(c,"h3","扱う情報");const u=c.ownerDocument.createElement("ul");for(const b of f.information)Kt(u,"li",b);return c.append(u),Kt(c,"h3","まとまりの理由"),Kt(c,"p",f.reason),f.name}const a=e.handoffs.find(f=>f.id===d.id);if(!a)return"";Kt(c,"p",a.description),Kt(c,"h3","出元と受取先");const l=e.subsystems.find(f=>f.id===a.fromSubsystemId),r=e.subsystems.find(f=>f.id===a.toSubsystemId);return Kt(c,"p",`${l.name} → ${r.name}`),a.information}return{sections:i,activities:o,describe:s}}function vs(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const s=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},c=(d,a=!1)=>{if(o=Math.max(280,Math.min(s(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(s())),i.setAttribute("aria-valuenow",String(Math.round(o))),a)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),c(d.key==="Home"?280:d.key==="End"?s():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,l=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=r=>c(l+a-r.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),c(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>c(o));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>c(o)),c(o)}const _a=260,Ja=68,Ka="http://www.w3.org/2000/svg",Ot=(e,t,n={})=>{const i=e.createElementNS(Ka,t);for(const[o,s]of Object.entries(n))i.setAttribute(o,String(s));return i};function Xa(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Rn(tr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Za(e,{model:t,business:n},i,o,s){const c=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(k=>{const O=c.find(D=>D.id===k.from),R=c.find(D=>D.id===k.to);if(!O||!R||O.subsystemId!==R.subsystemId||!t.presentation.reviewBoundaries.some(D=>D.from===k.from&&D.to===k.to))throw Error("Unknown overview relationship: "+k.from+" -> "+k.to);return k}),l=t.handoffs.map(k=>{if(!["forward","return"].includes(k.flowDirection))throw Error("Unknown overview handoff direction: "+k.id);return{id:k.id,from:k.fromSubsystemId,to:k.toSubsystemId,label:k.information,returning:k.flowDirection==="return"}});if(new Set(l.map(k=>k.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const k of l)if(!d.some(O=>O.id===k.from)||!d.some(O=>O.id===k.to)||k.from===k.to||!k.label.trim())throw Error("Unknown overview handoff: "+k.id);for(const k of c){if(!d.some(O=>O.id===k.subsystemId))throw Error("Unknown overview subsystem: "+k.id);if(!n.roles?.some(O=>O.id===k.reviewer.roleId))throw Error("Unknown overview reviewer: "+k.id)}const r=d.flatMap(k=>c.filter(O=>O.subsystemId===k.id)),f=new Map;let u=0;for(const[k,O]of d.entries())for(const R of r.filter(D=>D.subsystemId===O.id))f.set(R.id,[80+u*170,100+u*120+k*64]),u++;const b=No(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let p,m;try{const k=JSON.parse(localStorage.getItem(g)||"null"),O=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),R=!k&&O?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,D=k??R;if(D){typeof D.zoom=="number"&&Number.isFinite(D.zoom)&&(b.zoom=Math.max(.25,Math.min(2.5,D.zoom))),Array.isArray(D.scroll)&&D.scroll.length===2&&D.scroll.every(C=>typeof C=="number"&&Number.isFinite(C))&&(b.scroll=D.scroll),typeof D.locked=="boolean"&&(b.locked=D.locked);for(const[C,G]of Object.entries(D.positions??{}))c.some(q=>q.id===C)&&Array.isArray(G)&&G.length===2&&G.every(q=>typeof q=="number"&&Number.isFinite(q))&&b.positions.set(C,[G[0],G[1]])}const x=D?.selection,P=x?.kind==="node"?t.concepts.find(C=>C.id===x.id)?.subsystemId:x?.id,N=x?.kind==="node"?"group":x?.kind;typeof P=="string"&&(N==="model"&&c.some(C=>C.id===P)||N==="group"&&d.some(C=>C.id===P)||N==="connection"&&l.some(C=>C.id===P))&&(m={kind:N,id:P}),m?.kind==="model"&&(b.selected=m.id)}catch{}const I=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:b.zoom,scroll:b.scroll,locked:b.locked,positions:Object.fromEntries(b.positions),selection:m}))}catch{}},j=k=>{if(!k&&!m)return;m=k,b.selected=k?.kind==="model"?k.id:void 0;const O=p?.querySelector(".diagram-world>svg");O&&v(O),I()},v=k=>{const O=vi(a,b.selected),R=vi(l,m?.kind==="group"?m.id:void 0);for(const D of c){const x=k.querySelector(`[data-node="${D.id}"]`);x?.setAttribute("class","node graph-shape state-shape"+O.nodeClasses(D.id)),x?.setAttribute("aria-pressed",String(b.selected===D.id))}for(const D of d){const x=k.querySelector(`[data-subsystem="${D.id}"]`);x?.setAttribute("class","subsystem-overview-group"+R.nodeClasses(D.id)),x?.querySelector("button")?.setAttribute("aria-pressed",String(m?.kind==="group"&&m.id===D.id))}for(const D of a){const x=k.querySelector(`[data-overview-from="${D.from}"][data-overview-to="${D.to}"]`);x?.setAttribute("class","edge"+(O.related(D)?" review-related":"")),x?.setAttribute("marker-end",`url(#overview-${O.related(D)?"related-arrow":"arrow"})`)}for(const D of l){const x=R.related(D)||m?.kind==="connection"&&m.id===D.id,P=k.querySelector(`[data-handoff-id="${D.id}"]`);P?.setAttribute("class","edge"+(D.returning?" exception":"")+(x?" review-related":"")),P?.setAttribute("marker-end",`url(#overview-${x?"related-arrow":"arrow"})`),k.querySelector(`[data-handoff-label="${D.id}"]`)?.classList.toggle("review-related",!!x)}k.querySelectorAll("[data-exception-paint]").forEach(D=>D.remove());for(const D of Array.from(k.querySelectorAll("[data-handoff-id].exception")))To(k,D,{path:D.getAttribute("d")},{"data-overview-return-paint":D.getAttribute("data-handoff-id")})};return p=Qs(e,k=>{const O=r.map(N=>{const C=k.positions.get(N.id)??f.get(N.id);return{id:N.id,x:C[0],y:C[1],width:_a,height:Ja}}),R=Ot(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});R.append(Po("overview-"));let D=0,x=0;const P=[];for(const N of d){const C=O.filter(he=>c.find(xe=>xe.id===he.id)?.subsystemId===N.id);if(!C.length)continue;const G=Math.min(...C.map(he=>he.x))-30,q=Math.min(...C.map(he=>he.y))-48,re=Math.max(...C.map(he=>he.x+he.width))-G+30,ee=Math.max(...C.map(he=>he.y+he.height))-q+30;P.push({id:N.id,x:G,y:q,width:re,height:ee});const te=Ot(e,"g",{"data-subsystem":N.id,"aria-label":N.name}),de=Ot(e,"rect",{x:G,y:q,width:re,height:ee,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});de.addEventListener("click",()=>j({kind:"group",id:N.id})),te.append(de);const ue=Ot(e,"foreignObject",{class:"subsystem-overview-region-heading",x:G+8,y:q+3,width:re-16,height:36}),je=e.createElement("button");je.type="button",je.className="subsystem-overview-region-title",je.setAttribute("aria-label",N.name+"を選択"),je.textContent=N.name,je.onclick=()=>j({kind:"group",id:N.id}),ue.append(je),te.append(ue),R.append(te),D=Math.max(D,G+re+40),x=Math.max(x,q+ee+40)}for(const[N,C]of l.entries()){if(!P.some(te=>te.id===C.from)||!P.some(te=>te.id===C.to))throw Error("Missing overview handoff region: "+C.id);const G=Math.max(30,C.label.length*12),q=uo({from:C.from,to:C.to,nodes:P,index:N,kind:"input",matrix:{returning:C.returning,captionLane:0},labelWidth:G,labelHeight:18}),re=Ot(e,"path",{d:q.path,class:"edge"+(C.returning?" exception":""),"data-handoff-id":C.id,"data-from-subsystem":C.from,"data-to-subsystem":C.to,"data-flow-direction":C.returning?"return":"forward","marker-end":"url(#overview-arrow)"});R.append(re);const ee=Ot(e,"text",{x:q.label[0]-G/2,y:q.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":C.id});ee.textContent=C.label,ee.addEventListener("pointerdown",te=>te.stopPropagation()),ee.addEventListener("pointerup",te=>te.stopPropagation()),ee.addEventListener("click",()=>j({kind:"connection",id:C.id})),ee.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),j({kind:"connection",id:C.id}))}),R.append(ee),D=Math.max(D,q.bounds.right+40,q.label[0]+G/2+30),x=Math.max(x,q.bounds.bottom+40,q.label[1]+30)}for(const[N,C]of a.entries()){const G=uo({from:C.from,to:C.to,nodes:O,index:N,kind:"input",labelWidth:0,labelHeight:0}),q=Ot(e,"path",{d:G.path,class:"edge","data-overview-from":C.from,"data-overview-to":C.to,"marker-end":"url(#overview-arrow)"});R.append(q),D=Math.max(D,G.bounds.right+40),x=Math.max(x,G.bounds.bottom+40)}for(const N of O){const C=c.find(xe=>xe.id===N.id),G=n.roles.find(xe=>xe.id===C.reviewer.roleId),q=Ot(e,"g",{role:"button",tabindex:0,"aria-label":C.title+"を選択","aria-pressed":"false","data-node":N.id,"data-review-group":N.id,"data-subsystem-id":C.subsystemId,class:"node graph-shape state-shape"}),re=er(e,N);re.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),q.append(re,Ot(e,"rect",{x:N.x,y:N.y,width:N.width,height:N.height,rx:8,class:"state-diagram-node"}));const te=Ot(e,"foreignObject",{x:N.x,y:N.y,width:N.width,height:N.height}),de=e.createElement("div");de.className="subsystem-overview-card";const ue=Xa(e,G.color),je=e.createElement("span");je.className="subsystem-overview-labels",je.title=C.title+" — "+G.name;for(const[xe,L,z]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",C.title],["small","subsystem-overview-role",G.name]]){const F=e.createElement(xe);F.className=L,F.textContent=z,je.append(F)}const he=e.createElement("button");he.type="button",he.className="subsystem-overview-open",he.setAttribute("aria-label",C.title+"の詳細タブを開く"),he.title="詳細タブを開く",he.textContent="開く",he.onpointerdown=xe=>xe.stopPropagation(),he.onpointerup=xe=>xe.stopPropagation(),he.onclick=xe=>{xe.stopPropagation(),o(C.id)},de.append(ue,je,he),te.append(de),q.append(te),q.addEventListener("click",()=>j({kind:"model",id:N.id})),q.addEventListener("keydown",xe=>{(xe.key==="Enter"||xe.key===" ")&&(xe.preventDefault(),j({kind:"model",id:N.id}))}),R.append(q)}return R.setAttribute("viewBox",`0 0 ${D} ${x}`),v(R),R},b,I,()=>j(void 0)),p.classList.add("subsystem-overview-canvas"),p.addEventListener("click",I),p.addEventListener("pointerup",()=>queueMicrotask(I)),p.querySelector(".diagram-viewport")?.addEventListener("scroll",I),{root:p,selected:()=>b.selected,selection:()=>m,restore:()=>{const k=()=>{const O=p.querySelector(".diagram-viewport");O.scrollLeft=b.scroll[0],O.scrollTop=b.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(k):k()}}}function Ya(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const s=i.cells.find(c=>c.columnId===o.id);if(!s)throw Error("Missing sample cell: "+o.id);return s}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function Qa({model:e,business:t}){const n=g=>{const p=t.activities.find(m=>m.id===g);if(!p)throw Error("Unknown activity: "+g);return p},i=g=>{const p=t.roles?.find(m=>m.id===g);if(!p)throw Error("Unknown role: "+g);return p.name},o=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:i(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(p=>{const m=n(p);return{id:m.id,name:m.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(p=>({...p,samples:p.samples.map(Ya)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>o.find(p=>p.id===g),c=(g,p)=>s(g)?.capabilities.find(m=>m.samples.some(I=>I.id===p)),d=o.flatMap(g=>g.capabilities.flatMap(p=>p.samples.map(m=>({...m,group:g.id})))),a=["yellow","cyan","green","blue","purple","orange"];function l(g,p,m){let I=m.get(p);if(I||(I=a[m.size]??`extra-${m.size}`,m.set(p,I)),g.dataset.sampleKey=p,g.dataset.keyTone=I,g.className="data-example-key",I.startsWith("extra-")){const j=(Number(I.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${j} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${j} 24% 25%)`)}}const r=g=>d.filter(p=>p.group===g),f=(g,p)=>r(g).find(m=>m.id===p);function u(g,p,m){const I=g.ownerDocument.createElement(p);return I.textContent=m,g.append(I),I}function b(g,p,m,I,j){const v=g.ownerDocument,M=f(p.id,m);if(!M)throw Error("Unknown data example: "+m);g.replaceChildren(),g.dataset.dataExample=m;const k=new Map;e.presentation.sampleCaption&&(u(g,"p",e.presentation.sampleCaption).className="data-example-caption");const O=s(p.id)?.capabilities??[],R=j?.capabilityId?O.filter(C=>C.id===j.capabilityId):O;if(j?.capabilityId&&!R.some(C=>C.samples.some(G=>G.id===m)))throw Error("Sample does not belong to capability: "+m);const D=c(p.id,m);g.dataset.capability=D.id;const x=()=>{u(g,"h2",j?.heading?.trim()||D.title),j?.renderSpecification?j.renderSpecification(g):u(g,"p",D.description).className="data-example-capability"};j?.capabilityId&&!j.hideCapability&&x();const P=v.createElement("label");P.className="data-example-picker",u(P,"span","場面");const N=v.createElement("select");N.setAttribute("aria-label","データ例の場面");for(const C of R){let G=N;if(!j?.capabilityId){const q=v.createElement("optgroup");q.label=C.title,N.append(q),G=q}for(const q of C.samples){if(j?.sampleIds&&!j.sampleIds.includes(q.id))continue;const re=v.createElement("option");re.value=q.id,re.textContent=q.name,G.append(re)}}if(N.value=m,N.onchange=()=>I(N.value),P.append(N),(!j?.hideSinglePicker||N.options.length>1)&&g.append(P),!j?.capabilityId&&!j?.hideCapability&&x(),u(g,"h3",M.name).className="data-example-scene",j?.collapseScenario&&M.when){const C=v.createElement("details");C.className="data-example-context",u(C,"summary","場面の背景"),u(C,"p",M.when).className="data-example-when",g.append(C)}else u(g,"p",M.when).className="data-example-when";u(g,"p",M.meaning).className="data-example-meaning";for(const C of M.blocks){const G=v.createElement("section");G.className="data-example-block",G.dataset.exampleCard=C.card,u(G,"h3",p.concepts[C.card].name);const q=v.createElement("div");q.className="data-example-table",q.tabIndex=0,q.setAttribute("role","region"),q.setAttribute("aria-label",p.concepts[C.card].name+"のデータ表");const re=v.createElement("table");re.setAttribute("aria-label",p.concepts[C.card].name+"のデータ例");const ee=v.createElement("caption");ee.textContent=p.concepts[C.card].name+"に入る情報",re.append(ee);const te=v.createElement("thead"),de=v.createElement("tr");for(const je of C.columns)u(de,"th",je).setAttribute("scope","col");te.append(de),re.append(te);const ue=v.createElement("tbody");for(const[je,he]of C.rows.entries()){const xe=v.createElement("tr");for(const[L,z]of he.entries()){const F=u(xe,"td",String(z)),le=C.keyIds[je][L];le&&(l(F,le,k),F.title=C.columns[L]+"："+z)}ue.append(xe)}re.append(ue),q.append(re),G.append(q),C.rows.length||u(G,"p",C.empty??"データはありません。"),g.append(G)}M.note&&(u(g,"p",M.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:s,capabilityFor:c,examplesFor:r,findDataExample:f,renderDataExample:b}}function Wo(e,t){const n=e.model?.business,i=n?.activities.find(o=>o.id===t);return i?.roleId?n?.roles?.find(o=>o.id===i.roleId):void 0}function ec(e,t,n){return Wo(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function tc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function pn(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,s;const c=(d,a)=>{for(const l of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const r=document.createElement("strong");r.textContent=l.slice(2,-2),d.append(r)}else if(l.startsWith("`")&&l.endsWith("`")){const r=document.createElement("code");r.textContent=l.slice(1,-1),d.append(r)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!i){i=a[1],s=void 0;const u=document.createElement("pre");o=document.createElement("code"),u.append(o),n.append(u);continue}if(a&&a[1][0]===i[0]&&a[1].length>=i.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",s=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){s=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(r){s||(s=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(s));const u=document.createElement("li");c(u,r[1]),s.append(u);continue}s=void 0;const f=document.createElement(l?"h"+l[1].length:"p");c(f,l?l[2]:d),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Ie={type:"string"},_={type:"string",minLength:1,pattern:"\\S"},V={type:"string",pattern:"^[A-Za-z0-9_-]+$"},tn=e=>({anyOf:[e,{type:"null"}]}),J=e=>({type:"array",items:e}),Q=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),nc=e=>({$ref:"#/$defs/"+e}),In=J({anyOf:[Q({kind:{enum:["text"]},value:Ie}),Q({kind:{enum:["reference"]},targetId:V,label:Ie}),Q({kind:{enum:["link"]},uri:_,label:Ie})]}),ws=Q({id:V,name:_,scope:{type:"boolean"}}).properties,ic=Q({id:V,kind:{enum:["input","output","business-exception","object-exception"]},fromId:V,toId:V,label:_}),oc=Q({id:V,sourceId:V,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:J(V),unresolvedTargets:J(_),summary:_,content:_}),ho=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:_,title:_,preface:Ie,scope:Ie,objects:J(Q({...ws,icon:_,information:J(_)})),activities:J(Q({...ws,why:_,when:_,who:_,where:_,procedure:_,exception:tn(_),result:_,problem:tn(_),painLevel:tn({enum:["Low","Medium","High"]})})),relations:J(ic),findings:J(oc)}),sc=Q({id:V,name:_,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),rr=Q({...ho.properties,schemaVersion:{enum:["0.2"]},roles:J(sc),activities:J(Q({...ho.properties.activities.items.properties,roleId:tn(V)}))}),rc=Q({...rr.properties,schemaVersion:{enum:["0.3"]},exceptions:J(Q({id:V,activityId:V,name:_,description:Ie}))}),ac=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,In])),cc=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:_,title:_,basedOn:Q({documentId:V,revision:_,verification:{enum:["unverified"]}}),intro:In,index:J(Q({activityId:V,purpose:Ie,connections:Ie,checkIds:J(V)})),sections:J(Q({id:V,activityId:tn(V),title:_,preamble:In})),guarantees:J(Q({id:V,sectionId:V,title:_,blocks:J({anyOf:[Q({kind:{enum:["prose"]},content:In}),Q({kind:{enum:["example"]},exampleId:V})]})})),examples:J(Q({id:V,guaranteeId:V,columns:J(_),rows:J(J(In))})),items:J(Q({id:V,checkId:V,title:_,detailSummary:Ie,sectionId:V,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:Q(ac,[])})),notes:J(Q({id:V,title:_,content:In}))}),zo=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:_,title:_,basedOn:Q({documentId:V,revision:_,verification:{enum:["unverified"]}}),objectId:V,states:J(Q({id:V,name:_})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:_,transitions:J(Q({id:V,sourceId:_,fromId:_,activityId:V,event:tn(_),exception:tn(_),condition:_,toId:_,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:_,note:_}))}),ks=Object.fromEntries(Object.entries({...zo.properties.transitions.items.properties,exceptionId:tn(V)}).filter(([e])=>e!=="exception")),dc=Q({...zo.properties,schemaVersion:{enum:["0.2"]},transitions:J(Q({...ks,conditionLabel:_},Object.keys(ks)))}),Uo=Q({documentId:V,revision:_,targetType:_,targetId:V,section:_}),lc=Q({id:V,name:_,responsibilityStatus:_,responsibleSubsystemId:V},["id","name"]),uc=Q({id:V,name:_,subsystemId:V,information:J(lc),reason:Ie,description:Ie,businessObjectIds:J(V),activityLinks:J(Q({activityId:V,uses:J(_)})),sourceRefs:J(Uo),reviewState:_}),fc=Q({id:V,fromConceptId:V,toConceptId:V,fromPerTarget:_,toPerSource:_,condition:Ie,reviewState:_,sourceRefs:J(Uo),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),pc=Q({id:V,name:_,purpose:Ie,information:J(_),reason:Ie,activityIds:J(V),reviewState:_}),mc=Q({id:V,fromSubsystemId:V,toSubsystemId:V,information:_,description:Ie,activityIds:J(V),flowDirection:{enum:["forward","return"]},reviewState:_}),hc=Q({columnId:V,value:{anyOf:[Ie,{type:"number"}]},linkId:_},["columnId","value"]),bc=Q({card:V,columns:J(Q({id:V,name:_,informationId:V})),rows:J(Q({id:V,cells:J(hc)})),empty:Ie},["card","columns","rows"]),bo=Q({id:V,name:_,when:Ie,meaning:Ie,blocks:J(bc),note:Ie},["id","name","when","meaning","blocks"]),go=Q({id:V,title:_,description:Ie,meta:{},samples:J(bo)}),gc=Q({...bo.properties,checkIds:{...J(V),minItems:1,uniqueItems:!0}},[...bo.required,"checkIds"]),yc=Q({decisionExampleIds:J(V),decisionCheckIds:J(V),resultCheckIds:J(V),sampleIds:J(V)}),vc=Q({...go.properties,samples:J(gc),testSpecification:yc},[...Object.keys(go.properties)]),wc=Q({id:V,title:_,description:Ie,reason:Ie,meta:{}}),kc=Q({conceptId:V,name:_,fields:J(_),description:Ie,sources:J(_),sourceActivityIds:J(V)}),Ic=Q({id:V,fromConceptId:V,toConceptId:V,relationIds:J(V),scope:Ie,fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),Sc=Q({id:V,conceptId:V,subsystemId:V,name:_,description:Ie,sources:J(_),fields:J(Q({name:_,informationId:V}))}),xc=Q({id:V,fromViewId:V,toViewId:V,relationIds:J(V),fromLabel:_,toLabel:_,kind:{enum:["down","reference"]}}),ar=Q({nodes:J(Sc),edges:J(xc),handoffIds:J(V)}),cr=Q({id:V,subsystemId:V,title:_,description:Ie,reviewer:Q({roleId:V}),relatedActivityIds:J(V),graph:Q({conceptIds:J(V),nodes:J(kc),edges:J(Ic),subsystemViews:ar},["conceptIds","nodes","edges"]),structureStatements:J(Q({id:V,title:_,description:Ie,sampleIds:J(V),sourceRefs:J(Uo)})),capabilities:J(go),limitations:J(wc),meta:Q({questions:J(_),hypotheses:{}},["questions"])}),Ac=Q({...cr.properties,capabilities:J(vc)}),dr=Q({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:_,basedOn:Q({documentId:V,revision:_,verification:{enum:["unverified"]}}),relatedStates:J(Q({documentId:V,revision:_,verification:{enum:["unverified"]}})),subsystems:J(pc),concepts:J(uc),relations:J(fc),handoffs:J(mc),reviewGroups:J(cr),benefits:J(_),considerations:J(_),reviewPoints:J(_),meta:{},presentation:Q({activityViews:{},creatorActivityIds:{},sampleCaption:Ie,subsystemViews:ar,landscapeRelationships:J(Q({from:V,to:V})),reviewBoundaries:J(Q({from:V,to:V,label:Ie,promise:Ie}))},["landscapeRelationships","reviewBoundaries"])}),Ec=Q({...dr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:J(Ac)}),ci=(e,t)=>Q({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:_,documents:J({anyOf:t.map(nc)}),sources:J(Q({documentId:V,revision:_,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Ie})),externalDocuments:J(Q({id:V,kind:{enum:["businessDesign"]},revision:_,activities:J(Q({id:V,name:_}))})),diagnostics:J(_)}),Is={anyOf:[ci("0.1",["businessDesign","checkItems"]),ci("0.2",["businessDesign","checkItems","stateTransition"]),ci("0.3",["businessDesignRoles","checkItems","stateTransition"]),ci("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:ho,businessDesignRoles:rr,businessDesignStructured:rc,checkItems:cc,stateTransition:zo,stateTransitionStructured:dc,conceptModel:dr,checkedConceptModel:Ec}},W=(e,t)=>{if(!e)throw Error(t)};function lr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const s=t++;for(;t<e.length;){const c=e[t++];if(c==='"')return JSON.parse(e.slice(s,t));c==="\\"&&t++}throw Error("Unclosed JSON string")},o=(s=0)=>{W(s<=64,"JSON depth limit"),n();const c=e[t];if(c==='"'){i();return}if(c==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),W(e[t]==='"',"JSON object key required");const l=i();W(!a.has(l),"Duplicate JSON key: "+l),a.add(l),n(),W(e[t++]===":","JSON colon required"),o(s+1),n();const r=e[t++];if(r==="}")return;W(r===",","JSON comma required")}throw Error("Truncated object")}if(c==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(s+1),n();const a=e[t++];if(a==="]")return;W(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;W(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),W(t===e.length,"Trailing JSON content"),JSON.parse(e)}function Sn(e,t=Is,n="$"){if(t.$ref)return Sn(e,Is.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{Sn(e,o,n);return}catch(s){i.push(s.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&W(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;W(i===t.type,"Invalid type at "+n)}if(t.minLength&&W(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&W(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])W(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))W(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),Sn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>Sn(i,t.items,n+"["+o+"]"))}function Oc(e){const t=new Map,n=new Map,i=new Map,o=(s,c,d)=>{W(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,c.id),i.set(s.id,d)};for(const s of e.documents){o(s,s,"document");for(const[c,d]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const a of s[c]??[])o(a,s,d)}for(const s of e.externalDocuments){o(s,s,"document");for(const c of s.activities)o(c,s,"activity")}return{map:t,owner:n,types:i}}function yo(e){return Sn(e),ur(e)}function On(e,t){const n=new Set(e.items.map(c=>c.id)),i=new Set,o=e.guarantees.find(c=>c.id===t.guaranteeId),s=c=>{if(Array.isArray(c)){for(const d of c)s(d);return}if(c&&typeof c=="object"){c.kind==="reference"&&n.has(c.targetId)&&i.add(c.targetId);for(const d of Object.values(c))d&&typeof d=="object"&&s(d)}};s(t.rows);for(const c of o?.blocks??[])c.kind==="prose"&&s(c.content);for(const c of e.items)(c.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&i.add(c.id);return[...i]}function ur(e,{allowUnresolvedFindings:t=!1}={}){W(e.documents.length>0,"Document required");const{map:n,owner:i,types:o}=Oc(e),s=[...e.diagnostics],c=new Set;for(const u of e.sources)if(u.uri){const b=new URL(u.uri);W(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const d=(u,b,g)=>(W(n.has(u),"Dangling reference: "+u),b&&W(o.get(u)===b,"Reference type mismatch: "+u),g&&W(i.get(u)===g,"Cross-document mismatch: "+u),n.get(u)),a=u=>u?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),l=(u,b)=>{for(const g of u)if(g.kind==="reference"&&(d(g.targetId,null,b),W(["document","section","guarantee","example","check","note"].includes(o.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const p=new URL(g.uri);W(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const u of e.documents)if(W(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){W(u.activities.length>0,"Activity required");const b=[...u.objects,...u.activities].map(m=>m.name);W(new Set(b).size===b.length,"Duplicate visible name"),W(b.every(m=>m===m.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(I=>m.includes(I))),"Invalid Graph-visible name");for(const m of u.objects)W(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){W(new Set(u.roles.map(m=>m.name)).size===u.roles.length,"Duplicate Role name"),W(u.roles.every(m=>m.name===m.name.trim()&&!/[\r\n]/.test(m.name)),"Invalid Role name");for(const m of u.activities)m.roleId!==null?d(m.roleId,"role",u.id):c.add("Role未確定: "+m.id+" — "+m.who)}for(const m of u.activities)W(m.problem===null==(m.painLevel===null),"Problem/Pain pair mismatch");for(const m of u.exceptions??[])d(m.activityId,"activity",u.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const m of u.relations){d(m.fromId,g[m.kind][0],u.id),d(m.toId,g[m.kind][1],u.id);const I=JSON.stringify([m.kind,m.fromId,m.toId,m.label]);W(!p.has(I),"Duplicate relation"),p.add(I)}W(new Set(u.findings.map(m=>m.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const m of u.findings){W(m.scope==="items"?m.targetIds.length+m.unresolvedTargets.length>0:!m.targetIds.length&&!m.unresolvedTargets.length,"Finding scope mismatch"),W(new Set(m.targetIds).size===m.targetIds.length,"Duplicate Finding target");for(const I of m.targetIds)d(I,null,u.id),W(["object","activity"].includes(o.get(I)),"Invalid Finding target");m.unresolvedTargets.length&&(W(t,"Unresolved Finding target: "+m.sourceId),s.push("Finding参照未決: "+m.sourceId))}}else if(u.kind==="stateTransition"){const b=d(u.basedOn.documentId,"document");W(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),W(b.revision===u.basedOn.revision,"Stale State source revision"),d(u.objectId,"object",b.id),W(!e.documents.some(p=>p!==u&&p.kind==="stateTransition"&&p.objectId===u.objectId),"Duplicate Object state declaration"),W(u.states.length>0&&new Set(u.states.map(p=>p.name)).size===u.states.length,"Duplicate/empty state names"),W(u.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),W(u.transitions.length<=1e3,"State transition row budget"),W(new Set(u.transitions.map(p=>p.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const g=new Map;for(const p of u.transitions){p.fromId!=="@new"&&d(p.fromId,"state",u.id),["@unknown","@none"].includes(p.toId)||d(p.toId,"state",u.id);const m=d(p.activityId,"activity",b.id),I=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(W(!g.has(I),"Duplicate state transition condition: "+g.get(I)+" / "+p.sourceId),g.set(I,p.sourceId),e.formatVersion==="0.4")if(W(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const j=d(p.exceptionId,"exception",b.id);W(j.activityId===m.id,"Exception Activity mismatch")}else p.path==="exception"&&W(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else W(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);W(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),W(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),W(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),W(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const b=d(u.basedOn.documentId,"document");W(b.kind==="businessDesign"&&b.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),W(!e.documents.some(x=>x!==u&&x.kind==="conceptModel"&&x.basedOn.documentId===b.id),"Duplicate Concept model for Business Design");const g=(x,P)=>{const N=new Map;for(const C of x)W(!N.has(C.id),"Duplicate "+P+" ID: "+C.id),N.set(C.id,C);return N},p=g(u.subsystems,"subsystem"),m=g(u.concepts,"concept"),I=g(u.relations,"concept relation"),j=g(u.reviewGroups,"review group"),v=g(u.handoffs,"handoff"),M=g(u.concepts.flatMap(x=>x.information),"concept information"),k=(x,P,N)=>(W(x.has(P),"Unknown "+N+": "+P),x.get(P)),O=x=>d(x,"activity",b.id),R=x=>{const P=d(x.documentId,"document");W(P.revision===x.revision,"Stale Concept source revision");const N=P.id===b.id,C=P.kind==="stateTransition"&&P.basedOn.documentId===b.id&&u.relatedStates.some(G=>G.documentId===P.id&&G.revision===P.revision);W(N||C,"Concept source must refer to its Business Design or a declared State"),d(x.targetId,x.targetType,P.id)};for(const x of u.relatedStates){const P=d(x.documentId,"document");W(P.kind==="stateTransition"&&P.revision===x.revision&&P.basedOn.documentId===b.id,"Invalid Concept state reference")}for(const x of u.subsystems)for(const P of x.activityIds)O(P);for(const x of u.concepts){k(p,x.subsystemId,"subsystem");for(const P of x.information)P.responsibleSubsystemId&&k(p,P.responsibleSubsystemId,"responsible subsystem");for(const P of x.businessObjectIds)d(P,"object",b.id);for(const P of x.activityLinks)O(P.activityId);for(const P of x.sourceRefs)R(P)}for(const x of u.relations){k(m,x.fromConceptId,"concept"),k(m,x.toConceptId,"concept");for(const P of x.sourceRefs)R(P)}for(const x of u.handoffs){k(p,x.fromSubsystemId,"subsystem"),k(p,x.toSubsystemId,"subsystem"),W(x.fromSubsystemId!==x.toSubsystemId,"Handoff must cross subsystem boundary");for(const P of x.activityIds)O(P)}const D=(x,P)=>{const N=g(x.nodes,"subsystem view"),C=g(x.edges,"subsystem view edge");for(const q of N.values()){k(P,q.conceptId,"view concept"),k(p,q.subsystemId,"subsystem");const re=k(m,q.conceptId,"concept");for(const ee of q.fields)W(re.information.some(te=>te.id===ee.informationId),"Unknown information for subsystem view: "+ee.informationId)}for(const q of C.values()){const re=k(N,q.fromViewId,"subsystem view"),ee=k(N,q.toViewId,"subsystem view");W(re.subsystemId===ee.subsystemId,"View relationship crosses subsystem boundary"),W(q.relationIds.length>0,"Subsystem view relationship needs a concept relation");let te=re.conceptId;for(const de of q.relationIds){const ue=k(I,de,"concept relation");W(ue.fromConceptId===te,"Subsystem view relation path is disconnected: "+de),te=ue.toConceptId}W(te===ee.conceptId,"Subsystem view relation target differs")}W(new Set(x.handoffIds).size===x.handoffIds.length,"Duplicate subsystem view handoff");const G=new Set([...N.values()].map(q=>q.subsystemId));for(const q of x.handoffIds){const re=k(v,q,"handoff");W(G.has(re.fromSubsystemId)&&G.has(re.toSubsystemId),"Missing subsystem view handoff region: "+q)}};u.presentation.subsystemViews&&D(u.presentation.subsystemViews,m);for(const x of u.reviewGroups){k(p,x.subsystemId,"subsystem"),d(x.reviewer.roleId,"role",b.id);for(const G of x.relatedActivityIds)O(G);const P=g(x.graph.nodes.map(G=>({...G,id:G.conceptId})),"view concept");W(new Set(x.graph.conceptIds).size===x.graph.conceptIds.length&&x.graph.conceptIds.length===P.size&&x.graph.conceptIds.every(G=>P.has(G)),"View concepts and nodes differ");for(const G of x.graph.nodes){k(m,G.conceptId,"concept");for(const q of G.sourceActivityIds)O(q)}g(x.graph.edges,"view edge");for(const G of x.graph.edges){k(P,G.fromConceptId,"view concept"),k(P,G.toConceptId,"view concept");for(const q of G.relationIds)k(I,q,"concept relation")}x.graph.subsystemViews&&D(x.graph.subsystemViews,P);const N=g(x.capabilities,"capability"),C=g(x.capabilities.flatMap(G=>G.samples),"sample");g(x.limitations,"limitation"),g(x.structureStatements,"structure statement");for(const G of x.structureStatements){for(const q of G.sampleIds)k(C,q,"sample");for(const q of G.sourceRefs)R(q)}for(const G of N.values())if(G.testSpecification){const q=G.testSpecification;for(const[ee,te]of Object.entries(q))W(new Set(te).size===te.length,"Duplicate function specification reference: "+ee);const re=(ee,te)=>{const de=d(ee,te),ue=d(i.get(ee),"document");return W(ue.kind==="checkItems"&&ue.basedOn.documentId===b.id&&ue.basedOn.revision===b.revision,"Function Check source mismatch: "+ee),{value:de,doc:ue}};for(const ee of[...q.decisionCheckIds,...q.resultCheckIds])re(ee,"check");for(const ee of q.decisionExampleIds){const{value:te,doc:de}=re(ee,"example"),ue=On(de,te);W(ue.length>0,"Function decision table needs a Check: "+ee),W(ue.every(je=>q.decisionCheckIds.includes(je)),"Function decision table Check is not assigned: "+ee)}for(const ee of q.sampleIds){const te=G.samples.find(de=>de.id===ee);W(te,"Function result sample belongs to another capability: "+ee),W(te.checkIds.some(de=>q.resultCheckIds.includes(de)),"Function result sample needs a result Check: "+ee),W(te.checkIds.every(de=>q.resultCheckIds.includes(de)||q.decisionCheckIds.includes(de)),"Function result sample Check is not assigned: "+ee)}}for(const G of N.values())for(const q of G.samples){if(u.schemaVersion==="0.2"){W(q.checkIds.length>0,"Sample needs a Check: "+q.id),W(new Set(q.checkIds).size===q.checkIds.length,"Duplicate sample Check: "+q.id);for(const re of q.checkIds){d(re,"check");const ee=d(i.get(re),"document");W(ee.kind==="checkItems"&&ee.basedOn.documentId===b.id&&ee.basedOn.revision===b.revision,"Sample Check source mismatch: "+re)}}for(const re of q.blocks){k(P,re.card,"view concept");const ee=g(re.columns,"sample column");for(const te of re.columns)k(M,te.informationId,"concept information");g(re.rows,"sample row");for(const te of re.rows){const de=new Set;for(const ue of te.cells)k(ee,ue.columnId,"sample column"),W(!de.has(ue.columnId),"Duplicate sample cell: "+ue.columnId),de.add(ue.columnId);W(de.size===ee.size,"Sample row does not match columns")}}}}for(const x of u.presentation.landscapeRelationships){const P=k(j,x.from,"review group"),N=k(j,x.to,"review group");W(P.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const x of u.presentation.reviewBoundaries)k(j,x.from,"review group"),k(j,x.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const b=d(u.basedOn.documentId,"document");W(b.kind==="businessDesign","Check source is not BD"),W(b.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),W(new Set(u.items.map(m=>m.checkId)).size===u.items.length,"Duplicate Check ID");const g=new Set;for(const m of u.index){d(m.activityId,"activity",b.id),W(!g.has(m.activityId),"Duplicate Activity index"),g.add(m.activityId),W(new Set(m.checkIds).size===m.checkIds.length,"Duplicate Check binding");for(const I of m.checkIds)d(I,"check",u.id)}W(new Set(u.sections.map(m=>m.activityId??m.title)).size===u.sections.length,"Duplicate Activity section");for(const m of u.sections)m.activityId!==null&&(d(m.activityId,"activity",b.id),W(g.has(m.activityId),"Section missing from index")),l(m.preamble,u.id);const p=new Set(e.documents.filter(m=>m.kind==="conceptModel"&&m.basedOn.documentId===b.id&&m.basedOn.revision===b.revision).flatMap(m=>m.reviewGroups.flatMap(I=>I.capabilities.flatMap(j=>j.testSpecification?.decisionExampleIds??[]))));for(const m of u.guarantees){const I=m.blocks.length>0&&m.blocks.every(j=>j.kind==="example"&&p.has(j.exampleId)&&u.examples.some(v=>v.id===j.exampleId&&v.guaranteeId===m.id&&On(u,v).length>0));W(m.blocks.some(j=>j.kind==="prose"&&a(j.content))||I,"General guarantee prose required"),d(m.sectionId,"section",u.id);for(const j of m.blocks)if(j.kind==="prose")l(j.content,u.id);else{const v=d(j.exampleId,"example",u.id);W(v.guaranteeId===m.id,"Example owner mismatch")}}for(const m of u.examples){d(m.guaranteeId,"guarantee",u.id),W(m.columns.length>0,"Example columns required");for(const I of m.rows){W(I.length===m.columns.length,"Example column mismatch");for(const j of I)l(j,u.id)}}for(const m of u.items){const I=d(m.sectionId,"section",u.id);W(I.activityId===null?!u.index.some(j=>j.checkIds.includes(m.id)):u.index.some(j=>j.activityId===I.activityId&&j.checkIds.includes(m.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),W(a(m.fields.guarantee)||a(m.fields.condition)&&a(m.fields.expectedResult),"Check guarantee required");for(const j of Object.values(m.fields))l(j,u.id);W(I.activityId===null||u.index.some(j=>j.checkIds.includes(m.id)),"Unbound Check")}for(const m of u.notes)l(m.content,u.id);l(u.intro,u.id)}const r=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));W(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const u of r)W(c.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");W(c.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const u of e.sources){d(u.documentId,"document");const b=u.documentId+"@"+u.revision;W(!f.has(b),"Duplicate source descriptor"),f.add(b)}for(const u of e.externalDocuments)W(e.sources.some(b=>b.documentId===u.id&&b.revision===u.revision),"External source revision missing"),W(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:n.size}}const Y=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Ss(e,t,n){if(n==null)return;const i=pn(n);return e.append(Y("h3",t),i),i}function Cc(e,t){if(e===null)return;const n=pn(e),i=s=>String(s??"").replace(/\s+/g,""),o=new Set(t.map(s=>i(pn(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))o.has(i(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const jc={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Mc(e,t,n){const i=new Map,o=new Set,s=new Set(n.map(d=>d.id)),c=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==c.id||d.basedOn.revision!==c.revision)continue;const a=d.presentation.activityViews;if(Array.isArray(a)){for(const l of a)if(!(!l||typeof l!="object"||Array.isArray(l)||l.activityId!==t||!Array.isArray(l.businessVariations)))for(const r of l.businessVariations){if(!r||typeof r!="object"||Array.isArray(r)||typeof r.exceptionId!="string"||!s.has(r.exceptionId)||r.kind!=="alternative"&&r.kind!=="exception"||o.has(r.exceptionId))continue;const f=i.get(r.exceptionId);f&&f!==r.kind?(i.delete(r.exceptionId),o.add(r.exceptionId)):i.set(r.exceptionId,r.kind)}}}return i}function Lc(e,t){const n=Y("article");n.className="markdown json-detail";const i=e.model,o=i.business,s=o.objects.find(d=>d.id===t),c=o.activities.find(d=>d.id===t);if(s){Ss(n,"Scope",String(s.scope)),n.append(Y("h3","Information"));const d=Y("ul");for(const a of s.information)d.append(Y("li",a));n.append(d)}else if(c){const d=o.exceptions?.filter(u=>u.activityId===c.id)??[];for(const[u,b]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=Ss(n,u,b==="who"?Wo(e,c.id)?.name??c.who:c[b]===null?null:String(c[b]));b==="result"&&g&&(g.dataset.businessResult="")}const a=Cc(c.exception,d),l=Mc(e,c.id,d),r=(u,b,g)=>{if(!b.length&&!g)return;const p=Y("section");p.dataset.businessVariations="",p.append(Y("h3",u)),g&&p.append(g);for(const m of b){const I=pn(m.description);I.dataset.businessException=m.id,p.append(Y("h4",m.name),I)}n.append(p)};l.size?(r("例外",d.filter(u=>l.get(u.id)==="exception")),r("別ルート",d.filter(u=>l.get(u.id)==="alternative")),r("通常以外の扱い",d.filter(u=>!l.has(u.id)),a)):r("通常以外の扱い",d,a);const f=new Map([...o.objects,...o.activities].map(u=>[u.id,u.name]));for(const[u,b]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=o.relations.filter(m=>m.kind===u&&(m.fromId===t||m.toId===t));if(!g.length)continue;n.append(Y("h3",b));const p=g.map(m=>`${u==="business-exception"?`${f.get(m.fromId)} → ${f.get(m.toId)}`:f.get(u==="input"?m.fromId:m.toId)} — ${m.label}`);if(u==="business-exception")for(const m of p)n.append(Y("p",m));else{const m=Y("ul");for(const I of p)m.append(Y("li",I));n.append(m)}}}else n.append(Y("p","項目を選択すると業務内容を表示します。"));return n}class Yn{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Y("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(pn(o.value));continue}if(o.kind==="text"){const a=Y("span",o.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(o.kind==="link"){t.append(Y("span",`${o.label} (${o.uri})`));continue}const s=Y("details"),c=Y("summary",o.label||o.targetId);s.append(c),t.append(s);let d=!1;s.addEventListener("toggle",()=>{if(!s.open||d)return;if(d=!0,i.has(o.targetId)){s.append(Y("p","循環参照："+o.targetId));return}if(i.size>=16){s.append(Y("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(i).add(o.targetId),l=this.doc,r=l.guarantees.find(p=>p.id===o.targetId),f=l.examples.find(p=>p.id===o.targetId),u=l.items.find(p=>p.id===o.targetId),b=l.sections.find(p=>p.id===o.targetId),g=l.notes.find(p=>p.id===o.targetId);if(r){s.append(Y("h4",r.title));for(const p of r.blocks){if(!this.take(s))break;p.kind==="prose"?this.runs(s,p.content,a):this.example(s,p.exampleId,a)}}else if(f)this.example(s,f.id,a);else if(u){s.append(Y("p",`${u.checkId} · ${u.title}`+(this.requester?"":` · ${u.reviewState}`))),this.requester&&(u.reviewState==="要確認"||u.reviewState==="要修正")&&s.append(Y("p","確認が必要です。"));const p=this.requester?Object.fromEntries(Object.entries(u.fields).filter(([m])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(m))):u.fields;this.fields(s,p,a)}else b?(s.append(Y("h4",b.title)),this.runs(s,b.preamble,a)):g?(s.append(Y("h4",g.title)),this.runs(s,g.content,a)):o.targetId===l.id&&(s.append(Y("h4",l.title)),this.runs(s,l.intro,a))})}}fields(t,n,i,o=!1){for(const[s,c]of Object.entries(n)){if(!this.take(t))break;if(t.append(Y("h4",jc[s]??s)),s==="guarantee"&&o){const d=new Set;for(const a of c){const l=a.kind==="reference"?this.doc.guarantees.find(f=>f.id===a.targetId):void 0;if(!l){this.runs(t,[a],i);continue}if(d.has(l.id))continue;d.add(l.id);const r=new Set(i).add(l.id);for(const f of l.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,c,i)}}example(t,n,i,o=!1){const s=this.doc.examples.find(f=>f.id===n);if(!On(this.doc,s).length)return;const c=Y("table"),d=o?s.columns.indexOf("結果"):-1,a=d>0&&s.columns.at(-1)==="Check ID";if(a){const f=Y("colgroup");f.span=d,c.append(f);for(let m=d;m<s.columns.length;m++)c.append(Y("colgroup"));const u=Y("thead"),b=Y("tr"),g=Y("th","条件");g.colSpan=d,g.scope="colgroup",b.append(g);for(let m=d;m<s.columns.length;m++){const I=Y("th",s.columns[m]);I.rowSpan=2,I.scope="col",m===d?I.className="decision-result":s.columns[m]==="備考"&&(I.className="decision-notes"),b.append(I)}const p=Y("tr");for(const m of s.columns.slice(0,d)){const I=Y("th",m);I.scope="col",p.append(I)}u.append(b,p),c.append(u)}else{const f=Y("tr");for(const u of s.columns){if(!this.take(t))break;f.append(Y("th",u))}c.append(f)}const l=a?Y("tbody"):c;for(const f of s.rows){if(!this.take(t))break;const u=Y("tr");for(const[b,g]of f.entries()){if(!this.take(t))break;const p=Y("td");if(a&&b===d?p.className="decision-result":a&&s.columns[b]==="備考"&&(p.className="decision-notes"),o)for(const m of g){const I=m.kind==="reference"?this.doc.items.find(j=>j.id===m.targetId):void 0;I?p.append(Y("span",I.checkId)):this.runs(p,[m],i)}else this.runs(p,g,i);u.append(p)}l.append(u)}a&&c.append(l);const r=Y("div");r.className="json-example",r.append(c),t.append(r)}}function xs(e,t,n=e.model.checks,i=new Set,o=new Set){const s=Y("section");s.className="check-content json-checks";const c=e.model.business,d=n.filter(l=>l.basedOn.documentId===c.id);let a=!1;for(const l of d){const r=new Yn(l),f=l.index.filter(p=>p.activityId===t),u=new Set(l.index.flatMap(p=>p.checkIds)),b=(t?[...new Set(f.flatMap(p=>p.checkIds))]:l.items.filter(p=>!u.has(p.id)).map(p=>p.id)).filter(p=>!i.has(p)),g=l.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of g){(p.preamble.length||l.guarantees.some(m=>m.sectionId===p.id&&!o.has(m.id)))&&(a=!0),r.runs(s,p.preamble);for(const m of l.guarantees.filter(I=>I.sectionId===p.id&&!o.has(I.id)))r.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}for(const p of b){const m=l.items.find(v=>v.id===p);if(!m)continue;a=!0;const I=Y("section");I.className="check-item",I.dataset.checkId=m.checkId,I.dataset.elementId=m.id,I.append(Y("h3",m.checkId+" · "+m.title)),(m.reviewState==="要確認"||m.reviewState==="要修正")&&I.append(Y("p","確認が必要です。"));const j=Object.fromEntries(Object.entries(m.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));r.fields(I,j,new Set([m.id])),s.append(I)}if(!t)for(const p of l.notes)a=!0,r.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}return a||s.append(Y("p","この業務のテスト仕様はありません。")),s}function Rc(e,t,n=e.model.checks){const i=Y("section");i.className="check-content json-checks sample-checks";const o=e.model.business,s=new Set(t);for(const c of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new Yn(c);for(const a of c.items.filter(l=>s.has(l.id))){const l=Y("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(Y("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(a.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));d.fields(l,r,new Set([a.id]),!0),i.append(l)}}return i}const Dc=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Nc(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(Dc,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function Pc(e,t,n=e.model.checks){const i=Y("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const s of t)for(const c of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=c.examples.find(g=>g.id===s);if(!d||!On(c,d).length)continue;const a=new Yn(c,!0),l=c.guarantees.find(g=>g.id===d.guaranteeId),r=Y("section");r.dataset.decisionExample=s;for(const g of l?.blocks??[])g.kind==="prose"&&a.runs(r,Nc(g.content),new Set([l.id]));d.rows.length>1&&r.append(Y("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=d.columns.indexOf("結果"),u=f>0?f:d.columns.length;d.rows.some(g=>g.slice(0,u).some(p=>p.some(m=>m.kind==="text"&&/^\s*[-‐]\s*$/.test(m.value))))&&r.append(Y("p","‐＝値不問。")),a.example(r,s,new Set([s]),!0),i.append(r)}return i}function Tc(e,t,n=e.model.checks){const i=Y("section");i.className="check-content json-checks decision-checks";const o=e.model.business,s=new Set(t);for(const c of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new Yn(c,!0);for(const a of c.items.filter(l=>s.has(l.id))){const l=Y("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(Y("p","確認が必要です。")),a.fields.condition?.length&&(l.append(Y("h4","条件")),d.runs(l,a.fields.condition,new Set([a.id])));const r=Object.fromEntries(Object.entries(a.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=Y("details");f.append(Y("summary","期待結果")),d.fields(f,r,new Set([a.id]),!0),l.append(f)}i.append(l)}}return i}function qc(e,t,n=e.model.checks,i=new Set){const o=Y("section");o.className="check-content json-checks result-checks";const s=e.model.business,c=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===s.id&&a.basedOn.revision===s.revision)){const a=new Yn(d,!0),l=d.items.filter(r=>c.has(r.id)&&i.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);l.length&&o.append(Y("p",l.map(r=>r.checkId).join("、")));for(const r of d.items.filter(f=>c.has(f.id))){if(l.includes(r))continue;const f=Y("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(Y("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(Y("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(r.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));a.fields(f,u,new Set([r.id]),!0);const b=Y("details"),g=Y("summary","Check の詳細");b.append(g,Y("p",r.title)),r.fields.condition?.length&&a.runs(b,r.fields.condition,new Set([r.id])),f.append(b),o.append(f)}}return o}const io=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Wc(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),i=[],o=new Set,s=new Set,c=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),d=(r,f)=>c.some(u=>u.items.some(b=>b.id===r)&&(!f||u.index.some(b=>b.activityId===f&&b.checkIds.includes(r)))),a=(r,f,u,b,g=[])=>{const p=f.testSpecification,m=(p?.decisionCheckIds??[]).filter(R=>d(R,u)),I=(p?.resultCheckIds??[]).filter(R=>d(R,u)),j=(p?.decisionExampleIds??[]).filter(R=>c.some(D=>{const x=D.examples.find(N=>N.id===R),P=x?On(D,x):[];return P.length>0&&P.every(N=>d(N,u))})),v=f.samples.filter(R=>(!p||p.sampleIds.includes(R.id))&&R.checkIds?.length&&(p?R.checkIds.every(D=>d(D,u)):R.checkIds.some(D=>d(D,u)))),M=j.flatMap(R=>c.flatMap(D=>{const x=D.examples.find(P=>P.id===R);return x?On(D,x).filter(P=>d(P,u)):[]})),k=[...new Set([...m,...I,...M,...v.flatMap(R=>(R.checkIds??[]).filter(D=>d(D,u)))])];if(!k.length)return;const O=`fn:${u??"_"}:${r}:${f.id}`;s.has(O)||(s.add(O),i.push({key:O,activityId:u,groupId:r,capability:f,name:b,samples:v,checkIds:k,decisionCheckIds:m,resultCheckIds:I,decisionExampleIds:j,decisionTableCheckIds:[...new Set(M)],businessSections:g}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const r of l)if(!(!io(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!io(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const u=e.model.reviewGroups.find(p=>p.id===f.groupId),b=u?.capabilities.find(p=>p.id===f.capabilityId);if(!u||!b)continue;o.add(JSON.stringify([u.id,b.id]));const g=[];if(Array.isArray(f.businessSections))for(const p of f.businessSections){if(!io(p)||!Array.isArray(p.pages)||p.kind!=="result"&&p.kind!=="exception"||p.kind==="exception"&&(typeof p.exceptionId!="string"||!e.business.exceptions?.some(I=>I.id===p.exceptionId&&I.activityId===r.activityId)))continue;const m=[...new Set(p.pages.filter(I=>I==="decision"||I==="result"))];m.length&&g.push({kind:p.kind,exceptionId:p.kind==="exception"?p.exceptionId:void 0,pages:m})}a(u.id,b,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():b.title,g)}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)o.has(JSON.stringify([r.id,f.id]))||a(r.id,f,void 0,f.title);return i}function As(e,t,n,i){const o=e.filter(c=>c.groupId===t&&c.capability.id===n),s=o.find(c=>c.samples.some(d=>d.id===i));if(s)return{kind:"sample",key:s.key,sampleId:i};for(const c of o){if(!c.capability.testSpecification)continue;const d=c.capability.samples.find(l=>l.id===i),a=c.decisionExampleIds.length?c.decisionTableCheckIds:c.decisionCheckIds;if(d?.checkIds?.some(l=>a.includes(l)))return{kind:"decision",key:"decision:"+c.key}}}const wn=["landscape","overview"];function zc(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const c=document.createElement("aside");c.id="design-explorer",c.setAttribute("aria-label","設計ナビゲーション"),c.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",s.append(c,d),d.append(i,n);const a=document.createElement("div");a.className="shell-open-tabs",o.before(a),a.append(o),za(a);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(l);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),a.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),a.append(f);const u=document.createElement("section");u.id="concept-workspace",u.hidden=!0,u.setAttribute("aria-label","データ構造"),u.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(u);const b=document.createElement("section");b.id="states-workspace",b.hidden=!0,b.setAttribute("aria-label","状態遷移"),b.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(b);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',d.append(g);const p=document.createElement("aside");p.id="test-related-panel",p.className="spec-related",p.setAttribute("aria-label","関連資料"),p.hidden=!0,p.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const m=document.createElement("section");m.id="empty-workspace",m.hidden=!0,m.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(m);const I=n.querySelector("#node-list-drawer");c.append(I);const j=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),M=c.querySelector("input"),k=c.querySelector("nav"),O=u.querySelector("iframe"),R=u.querySelector(".concept-related"),D=b.querySelector("article"),x="alder-explorer-v1:"+location.pathname,P=location.protocol==="file:"||location.origin==="null"?"*":location.origin,N=window.__alderConceptHtml;let C,G,q,re,ee={},te=[],de=[...wn],ue=new Map,je=new Map,he=new Map,xe=new Map;const L=h=>he.get(h)??h,z=h=>xe.get(h)??h,F=h=>G?.findGroup(ue.get(h??"")),le=h=>q?.contentFor(ue.get(h)??""),Z=(h,y)=>q?.findDataExample(ue.get(h)??"",y),we=h=>q?.examplesFor(ue.get(h)??"")??[],Oe=h=>wn.includes(h)?"全体図":le(h)?.title??F(h)?.name??ee[je.get(h)??""]?.name,me=()=>{const h=t.business(),y=h.design?.model;return y?[...y.checks,...h.relatedChecks??[]].filter(A=>A.basedOn.documentId===y.business.id):[]},se=()=>Wc(C,me()),ge=h=>se().find(y=>y.key===(h.startsWith("decision:")?h.slice(9):h)),Pe=h=>se().filter(y=>y.name===h.name).length>1?h.name+"（"+(t.business().activities.find(y=>y.id===h.activityId)?.name??"その他")+"）":h.name,qe=h=>me().some(y=>y.index.some(A=>A.activityId===h)||y.sections.some(A=>A.activityId===h)),Dt=h=>new Set(se().filter(y=>y.activityId===h).flatMap(y=>y.checkIds)),rn=h=>{const y=new Set(se().filter(A=>A.activityId===h).flatMap(A=>A.decisionExampleIds));return new Set(me().flatMap(A=>A.examples.filter(S=>y.has(S.id)).map(S=>S.guaranteeId)))},Gt=h=>{const y=Dt(h),A=rn(h);return me().some(S=>S.index.some(T=>T.activityId===h&&T.checkIds.some(H=>!y.has(H)))||S.sections.some(T=>T.activityId===h&&(T.preamble.length>0||S.guarantees.some(H=>H.sectionId===T.id&&!A.has(H.id)))))},Gr=()=>me().some(h=>h.items.some(y=>!h.index.some(A=>A.checkIds.includes(y.id)))||h.sections.some(y=>y.activityId===null)||h.notes.length>0),Hr=h=>{const y=ge(h);return y?y.capability.testSpecification?Pe(y)+"・"+(h.startsWith("decision:")?"可否":"結果"):y.name:(h==="@unassigned"?"未割当":h.startsWith("remaining:")?t.business().activities.find(A=>A.id===h.slice(10))?.name:h.startsWith("checks:")?t.business().activities.find(A=>A.id===h.slice(7))?.name:h==="@overview"?"テスト仕様":void 0)??h},ni=n.querySelector("#formattedMarkdownDrawer");ni&&s.append(ni),s.append(R,p),vs(R,s,x+":drawer-width"),vs(p,s,x+":test-drawer-width");let ii=!1;const rt=t.rightDrawer??{isOpen:()=>ii,setOpen:h=>{ii=h}};let ne="business",De=!1,Ke=[],B="overview",Xe=[],at="",ct=[],Ce="@overview",gn,Nt=innerWidth>800,oi=!1,si=!0,dt=!1,Tn;const lt=new Map,ht=new Map([["overview",O]]),it=new Map,an=new Map,cn=new Map,Ne=new Map,Ht=new Map,bt=new Set,Ve=new Set,dn=new Set,Be=new Map;let ye;try{if(ye=JSON.parse(sessionStorage.getItem(x)||"null"),ye){if(dt=ye.overviewClosed===!0,Tn=typeof ye.documentKey=="string"?ye.documentKey:void 0,Nt=typeof ye.left=="boolean"?ye.left:Nt,Array.isArray(ye.expanded)){Ve.clear();for(const h of ye.expanded)typeof h=="string"&&Ve.add(h)}Xe=Array.isArray(ye.states)?ye.states.filter(h=>typeof h=="string"):[],t.rightDrawer||(typeof ye.rightOpen=="boolean"?ii=ye.rightOpen:typeof ye.right?.["concept:"+ye.active]=="boolean"&&(ii=ye.right["concept:"+ye.active]))}}catch{}function _r(){if(!(!ye||Tn!==t.business().key||!De)){for(const h of Array.isArray(ye.overviewModes)?ye.overviewModes:[])F(h)&&bt.add(h);for(const[h,y]of Object.entries(ye.lastExamples??ye.examples??{}))typeof y=="string"&&Z(h,y)&&Ht.set(h,y);for(const[h,y]of Object.entries(ye.examples??{}))typeof y=="string"&&Z(h,y)&&Ne.set(h,y);for(const[h,y]of Object.entries(ye.selected??{}))typeof y=="string"&&te.includes(y)&&it.set(h,y);Ke=[...new Set((Array.isArray(ye.concepts)?ye.concepts:[]).filter(h=>typeof h=="string"&&de.includes(h)))],B=Ke.includes(ye.active)?ye.active:"landscape"}}let ln;const We=()=>{try{sessionStorage.setItem(x,JSON.stringify({documentKey:gn,overviewClosed:dt,selected:Object.fromEntries(it),examples:Object.fromEntries(Ne),lastExamples:Object.fromEntries(Ht),overviewModes:[...bt],left:Nt,expandedVersion:4,expanded:[...Ve],concepts:Ke,active:B,states:Xe,specs:ct,activeSpec:Ce,specExamples:Object.fromEntries(lt),...t.rightDrawer?{}:{rightOpen:rt.isOpen()}}))}catch{}},_t=()=>{ne==="concept"&&Be.set("drawer:"+B,R.querySelector(".concept-drawer-body").scrollTop),ne==="concept"&&rt.isOpen()&&bt.has(B)&&Be.set("review-overview:"+B,R.querySelector(".data-review-overview").scrollTop),ne==="concept"&&Ne.has(B)&&Be.set("example:"+B+":"+Ne.get(B),R.querySelector(".data-examples-panel").scrollTop),ne==="states"&&at&&Be.set("state:"+at,D.scrollTop),ne==="tests"&&Be.set("tests:"+Ce,g.querySelector(".test-spec-page").scrollTop),ne==="concept"&&B==="landscape"&&Be.set("concept:landscape",u.querySelector(".concept-review-landscape").scrollTop)};function Ge(h=!0){if(oi)return;const y=new URL(location.href);if(y.searchParams.set("view",ne),y.searchParams.delete("concept"),y.searchParams.delete("dataExample"),y.searchParams.delete("dataView"),ne==="concept"&&rt.isOpen()&&bt.has(B)?y.searchParams.set("dataView","overview"):ne==="concept"&&F(B)&&!Ne.has(B)&&y.searchParams.set("dataView","structure"),ne==="concept"&&rt.isOpen()&&Ne.has(B)&&y.searchParams.set("dataExample",Ne.get(B)),ne==="tests"&&lt.has(Ce)&&y.searchParams.set("dataExample",lt.get(Ce)),y.searchParams.delete("state"),y.searchParams.delete("activity"),y.searchParams.delete("object"),y.searchParams.delete("spec"),ne==="concept"&&y.searchParams.set("concept",B),ne==="states"&&at&&y.searchParams.set("state",at),ne==="tests"&&y.searchParams.set("spec",Ce),ne==="business"){const A=t.business(),S=A.views?.find(T=>T.key===A.viewKey);S?.activity?y.searchParams.set("activity",S.activity):S?.object&&y.searchParams.set("object",S.object)}y.href!==location.href&&history[h?"pushState":"replaceState"]({alderShell:!0},"",y)}function Ae(h,y,A){const S=document.createElement(y);return S.textContent=A,h.append(S),S}function ut(h){h!==ne&&(ne==="business"?t.capture():_t(),ne=h),n.hidden=ne!=="business",u.hidden=ne!=="concept",b.hidden=ne!=="states",g.hidden=ne!=="tests",m.hidden=ne!=="empty",e.dataset.workspaceArea=ne,ne==="business"&&t.refresh(),yt(),ft()}function It(h,y=!0){De&&(h==="subsystems"&&(h="landscape"),de.includes(h)&&(_t(),Ke.includes(h)||Ke.push(h),B=h,ut("concept"),Qi(),gt(),We(),y&&Ge()))}function Jr(){_t(),Ne.delete(B),bt.add(B),Qi(),R.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer-overview:"+B)??0,We(),Ge()}function Kr(h,y=!0){if(h&&!Z(B,h))return;const A=!Ne.has(B),S=R.querySelector(".concept-drawer-body");A&&Be.set("drawer-overview:"+B,S.scrollTop),_t(),bt.delete(B),h?(Ne.set(B,h),Ht.set(B,h)):Ne.delete(B),rt.setOpen(!0),Qi(),A&&(S.scrollTop=0),We(),Ge(),y&&R.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}R.querySelector(".concept-example-back").onclick=()=>{Jr(),R.querySelector(".data-review-overview").focus({preventScroll:!0})};function yn(h,y=!0){t.business().states?.some(A=>A.id===h)&&(_t(),Xe.includes(h)||Xe.push(h),at=h,ut("states"),ia(),gt(),We(),y&&Ge())}function _i(h){return h.startsWith("decision:")&&ge(h)&&!ge(h)?.capability.testSpecification?ge(h).key:ge(h)||h==="@overview"||h==="@unassigned"||h.startsWith("checks:")&&qe(h.slice(7))||h.startsWith("remaining:")&&Gt(h.slice(10))?h:t.business().activities.some(y=>y.id===h)?se().find(y=>y.activityId===h)?.key??(qe(h)?"checks:"+h:"@overview"):"@overview"}function St(h,y=!0){const A=t.business();if(!A.design?.model||!A.key)return;h=_i(h),ne==="tests"&&h!==Ce&&_t(),ct.includes(h)||ct.push(h),Ce=h;const S=ge(h);oi||(S?.capability.testSpecification?Ve.add("tests-function-"+S.key):S?.activityId?Ve.add("tests-activity-"+S.activityId):h.startsWith("checks:")?Ve.add("tests-activity-"+h.slice(7)):h.startsWith("remaining:")?Ve.add("tests-activity-"+h.slice(10)):S&&Ve.add("tests-other")),ut("tests"),Ji(),gt(),ft(),We(),y&&Ge()}function Ji(){const h=t.business().design;if(!h?.model)return;const y=g.querySelector(".test-spec-page"),A=ge(Ce);if(A){const S=document.createElement("section");S.className="test-spec-sample";const T=G?.findGroup(A.groupId),H=A.samples.find(ae=>ae.id===lt.get(Ce))??A.samples[0],U=!!A.capability.testSpecification,K=Ce.startsWith("decision:");if(U)if(Ae(S,"h2",A.name),Ae(S,"h3",K?"可否判定":"処理結果"),K)A.decisionExampleIds.length?S.append(Pc(h,A.decisionExampleIds,me())):A.decisionCheckIds.length?S.append(Tc(h,A.decisionCheckIds,me())):Ae(S,"p","可否条件の記載はありません。");else{const ae=T&&H&&q?new Set(A.samples.flatMap(Ee=>Ee.checkIds??[])):new Set;if(S.append(qc(h,A.resultCheckIds,me(),ae)),T&&H&&q){Ae(S,"h3","データ例");const Ee=document.createElement("div");Ee.className="data-examples-panel test-spec-examples",S.append(Ee),q.renderDataExample(Ee,T,H.id,Te=>{Be.set("tests:"+Ce,y.scrollTop),lt.set(Ce,Te),Ji(),We(),Ge(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:A.capability.id,sampleIds:A.samples.map(Te=>Te.id),hideCapability:!0,hideSinglePicker:!0})}}else if(T&&H&&q){const ae=document.createElement("div");ae.className="data-examples-panel test-spec-examples",S.append(ae),q.renderDataExample(ae,T,H.id,Ee=>{Be.set("tests:"+Ce,y.scrollTop),lt.set(Ce,Ee),Ji(),We(),Ge(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:A.capability.id,heading:A.name,sampleIds:A.samples.map(Ee=>Ee.id),renderSpecification:Ee=>Ee.append(Rc(h,H.checkIds??[],me()))})}y.replaceChildren(S)}else if(Ce==="@overview")y.replaceChildren(),Ae(y,"p","左のメニューからテスト仕様を選択してください。");else if(Ce.startsWith("remaining:")){const S=Ce.slice(10);y.replaceChildren(xs(h,S,me(),Dt(S),rn(S)))}else y.replaceChildren(xs(h,Ce.startsWith("checks:")?Ce.slice(7):void 0,me()));Yr(A),y.scrollTop=Be.get("tests:"+Ce)??0}function qn(h){h||(dt=!1),ut("business"),h?t.openActivity(h):(dt=!1,t.openOverview()),ft(),gt(),Ge()}function Xr(h){ut("business"),t.openObject(h),ft(),gt(),Ge()}function rs(h){const y=t.business(),A=y.design?.model;return A?[...new Set(A.states.filter(S=>S.objectId===h&&S.basedOn.documentId===A.business.id&&S.basedOn.revision===A.business.revision).flatMap(S=>S.transitions.map(T=>T.activityId)))]:[...new Set((y.design?.objectStateTransitions?.[h]?.model?.transitions??[]).flatMap(S=>S.activityId?[S.activityId]:[]))]}function as(h){return(t.business().states??[]).filter(y=>rs(y.id).includes(h))}function cs(h){const y=t.business(),A=y.design?.model,S=C?.model.concepts.find(T=>T.id===h);return!A||!C||!S?[]:(y.states??[]).filter(T=>S.businessObjectIds.includes(T.id)&&A.states.some(H=>H.objectId===T.id&&H.basedOn.documentId===A.business.id&&H.basedOn.revision===A.business.revision&&C.model.relatedStates.some(U=>U.documentId===H.id&&U.revision===H.revision)))}function Ki(h,y,A="状態遷移"){if(!y.length)return;const S=document.createElement("section");S.className="shell-related-links",Ae(S,"h3",A);for(const T of y){const H=Pt(S,T.name,()=>yn(T.id));H.dataset.relatedState=T.id}h.append(S)}function ds(h){const y=C?.model.reviewGroups.find(S=>S.id===h.groupId);if(!y)return[];const A=new Set(y.graph.nodes.map(S=>S.conceptId));return[...new Set(h.samples.flatMap(S=>S.blocks.map(T=>T.card)))].filter(S=>A.has(S)&&C?.model.concepts.some(T=>T.id===S))}function Pt(h,y,A){const S=document.createElement("button");return S.type="button",S.className="shell-evidence",Ae(S,"span",y),S.onclick=A,h.append(S),S}function Xi(h,y){const A=y.filter(T=>T.capability.testSpecification);if(!A.length)return;const S=document.createElement("section");S.className="shell-test-links",Ae(S,"h3","テスト仕様書");for(const T of A)for(const[H,U]of[["decision:","可否判定"],["","処理結果"]]){const K=H+T.key,ae=Pt(S,Pe(T)+"・"+U,()=>St(K));ae.dataset.relatedSpec=K}h.append(S)}function Zr(h,y){const A=se().filter(K=>K.activityId===y&&K.capability.testSpecification),S=C?.model.presentation.activityViews,T=Array.isArray(S)?S.find(K=>K&&typeof K=="object"&&K.activityId===y):void 0,H=Array.isArray(T?.uncreatedTestSections)?T.uncreatedTestSections:[],U=h.querySelectorAll("[data-business-result],[data-business-exception]");for(const K of Array.from(U)){const ae=K.dataset.businessException,Ee=ae?"exception":"result",Te=ae??"result",ze=A.flatMap(Ze=>Ze.businessSections.filter(At=>At.kind===Ee&&(Ee==="result"||At.exceptionId===ae)).flatMap(At=>At.pages.filter($=>$==="decision"?Ze.decisionCheckIds.length||Ze.decisionExampleIds.length:Ze.resultCheckIds.length||Ze.samples.length).map($=>({target:Ze,page:$})))),xt=document.createElement("section");xt.className="shell-section-links",xt.setAttribute("aria-label","テスト仕様書");const ot=new Set;for(const{target:Ze,page:At}of ze){const $=(At==="decision"?"decision:":"")+Ze.key;if(ot.has($))continue;ot.add($);const ke=Pt(xt,Pe(Ze)+"・"+(At==="decision"?"可否判定":"処理結果"),()=>St($));ke.dataset.relatedSpec=$}if(!ot.size){const Ze=Ae(xt,"p",H.includes(Te)?"テスト仕様書未作成":"テスト仕様書との対応未確認");Ze.className="shell-spec-warning"}K.after(xt)}Xi(h,A.filter(K=>!K.businessSections.length))}function Yr(h){const y=p.querySelector(".spec-related-content");if(y.replaceChildren(),!h?.capability.testSpecification)return;const A=t.business().activities.find(H=>H.id===h.activityId),S=G?.findGroup(h.groupId);if(A){Ae(y,"h3","Activity");const H=Pt(y,A.name,()=>qn(A.id));H.dataset.relatedActivity=A.id}if(S){Ae(y,"h3","概念モデル");const H=Pt(y,S.name,()=>It(L(S.id)));H.dataset.relatedGroup=S.id}const T=ds(h);if(T.length){Ae(y,"h3","概念");for(const H of T){const U=C.model.concepts.find(ae=>ae.id===H),K=Pt(y,U.name,()=>It(z(H)));K.dataset.relatedConcept=H}}h.activityId&&Ki(y,as(h.activityId),"状態遷移（同じ Activity）")}function Qr(h,y){Ae(h,"h3","Activity");const A=t.business(),S=F(B),T=C?.model.concepts.find(U=>U.id===y),H=S?.concepts[y]?.sourceActivities??S?.activities??T?.activityLinks.filter(U=>U.uses.includes("生成")).map(U=>U.activityId)??[];for(const U of H){const K=A.activities.find(Ee=>Ee.id===U);if(!K)continue;const ae=document.createElement("button");ae.className="shell-evidence",Ae(ae,"span",K.name),ae.title=K.name+"を業務タブで開く",ae.setAttribute("aria-label",ae.title),ae.onclick=()=>qn(K.id),h.append(ae)}}function Zi(h){const y=F(h);return y?G?.graph(y.id):h==="overview"?G?.overviewGraph():void 0}function ls(h){const y=an.get(B),A=y?Zi(B)?.tables[y]:void 0;return A?.conceptId===h?A:void 0}function ea(h,y){const A=ls(y)??F(B)?.concepts[y]??{...ee[y],sources:void 0};h.replaceChildren(),Ae(h,"p",A.note),Ae(h,"h3","持つ情報");const S=document.createElement("ul");for(const[,T]of A.fields)Ae(S,"li",T);if(h.append(S),A.sources?.length){Ae(h,"h3","情報の出所・対象時点");const T=document.createElement("ul");for(const H of A.sources)Ae(T,"li",H);h.append(T)}Qr(h,y),Xi(h,se().filter(T=>ds(T).includes(y))),Ki(h,cs(y))}function Yi(h){const y=R.querySelector(".shell-heading strong");y.textContent=h,R.setAttribute("aria-label",h)}function us(h=!1){F(B)&&(it.delete(B),an.delete(B),cn.delete(B),h||ht.get(B)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},P),ri(),yt(),R.querySelector(".concept-drawer-body").scrollTop=0,We())}R.querySelector(".concept-selection-clear").onclick=()=>{us(),Ne.has(B)?R.querySelector(".concept-example-back").focus({preventScroll:!0}):R.querySelector(".data-review-overview").focus({preventScroll:!0})};function ri(){const h=R.querySelector(".concept-related-content");R.querySelector(".concept-selection").hidden=!!F(B)&&!it.has(B)&&!cn.has(B),R.querySelector(".concept-selection>h2").hidden=!F(B),R.querySelector(".concept-selection-clear").hidden=!F(B);const y=cn.get(B);if(y&&re){const H=re.describe(h,{kind:"group",id:y});Yi(H);return}if(B==="landscape"&&ln){h.replaceChildren();for(const[H,U]of re.sections){Ae(h,"h3",H);const K=document.createElement("ul");for(const ae of U)Ae(K,"li",ae);h.append(K)}Yi("サブシステムの情報");return}const A=it.get(B),S=F(B),T=De&&A?ls(A)?.name??S?.concepts[A]?.name??ee[A].name:S?.name??"データ構造の情報";Yi(T),De&&A?ea(h,A):(h.replaceChildren(),S||Ae(h,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function fs(h){h.onload=()=>{ps(),h.contentDocument&&(gs(h.contentDocument),ys(h.contentDocument));const y=h.dataset.conceptView??"overview";if(!G||!C)return;const A=F(y),S=A?G.graph(A.id):y==="overview"?G.overviewGraph():{ids:te,edges:G.edges,tables:ee};h.contentWindow?.postMessage({type:"alder-concept-data",graph:S,focus:je.get(y),viewKey:y,documentKey:gn??C.model.id,clearSelectionOnBackground:!!A},P);const T=it.get(y);T&&h.contentWindow?.postMessage({type:"alder-concept-highlight",id:T},P)}}fs(O),O.dataset.conceptView="overview";function ta(){R.querySelector(".concept-page-details").hidden=!0,R.querySelector(".concept-example-back").hidden=!0;const h=R.querySelector(".data-review-overview");h.hidden=!0,h.replaceChildren();const y=R.querySelector(".data-examples-panel");y.hidden=!0,y.replaceChildren(),delete y.dataset.dataExample,ln?.root.remove(),ln=void 0;for(const[A,S]of ht)A!=="overview"&&(S.remove(),ht.delete(A));O.removeAttribute("src"),O.removeAttribute("srcdoc"),it.clear(),an.clear(),cn.clear()}function Qi(){u.setAttribute("aria-label",B==="landscape"||F(B)?"サブシステム":"データ構造"),u.querySelector(".concept-empty").hidden=De;const h=u.querySelector(".concept-review-landscape"),y=F(B),A=R.querySelector(".concept-page-details"),S=R.querySelector(".data-review-overview"),T=R.querySelector(".data-examples-panel");if(A.hidden=!De||!y,S.hidden=!De||!y||Ne.has(B),T.hidden=!De||!y||!Ne.has(B),R.querySelector(".concept-example-back").hidden=T.hidden,De&&y){const U=se();Ga(S,y,q,(ae,Ee)=>{const Te=As(U,y.id,ae,Ee);if(Te)return{kind:Te.kind,open:()=>{const ze=As(se(),y.id,ae,Ee);ze&&(ze.sampleId?lt.set(ze.key,ze.sampleId):lt.delete(ze.key),St(ze.key))}}},ae=>qn(ae),t.business().activities),Xi(S,U.filter(ae=>ae.groupId===y.id));const K=Ne.get(B)??Ht.get(B)??we(B)[0]?.id;K&&q.renderDataExample(T,y,K,ae=>Kr(ae)),S.scrollTop=Be.get("review-overview:"+B)??0,T.scrollTop=Be.get("example:"+B+":"+K)??0}if(h.hidden=!De||!wn.includes(B),De&&wn.includes(B)&&(B==="landscape"&&!ln&&(ln=Za(document,C,gn??C.model.id,U=>It(L(U)))),Ba(h,ln?.root,B==="overview"?"graph":"overview"),B==="landscape"&&ln?.restore()),De&&B!=="landscape"&&!ht.has(B)){const U=document.createElement("iframe");U.className="concept-frame",U.dataset.conceptView=B,U.title=y?y.name+"のデータ構造":ee[je.get(B)].name+"と隣接する概念",U.hidden=!0,ht.set(B,U);const K=je.get(B);K&&it.set(B,it.get(B)??K),fs(U),u.querySelector(".concept-main").append(U)}for(const[U,K]of ht)K.hidden=!De||U!==B,De&&U===B&&!K.hasAttribute("src")&&!K.hasAttribute("srcdoc")&&(N?K.srcdoc=N:K.src=new URL("concept.html?view=overview"+(F(U)?"&group="+encodeURIComponent(F(U).id):U==="overview"?"":"&focus="+encodeURIComponent(je.get(U))),document.baseURI).href);const H=it.get(B);H&&ht.get(B)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:H},P),ri(),yt(),R.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer:"+B)??0}function vn(){const h=t.business(),y=h.views?.find(A=>A.activity!==void 0||A.object!==void 0||!dt);y?(ut("business"),t.activateView(y.key)):Ke.length?It(Ke.at(-1),!1):Xe.length?yn(Xe.at(-1),!1):ct.length?St(ct.at(-1),!1):ut("empty")}function na(){if(dt=!0,ne==="business"){const h=t.business().views?.find(y=>y.key===t.business().viewKey);!h?.activity&&!h?.object&&vn()}gt(),ft(),We(),Ge(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function ia(){D.replaceChildren();const h=t.business().states?.find(K=>K.id===at);if(!h)return;const y=t.statePanel(h.id);y?D.append(y):Ae(D,"p","この対象の状態遷移は未定義です。");const A=p.querySelector(".spec-related-content");A.replaceChildren();const S=rs(h.id),T=t.business().activities.filter(K=>S.includes(K.id));if(T.length){Ae(A,"h3","Activity");for(const K of T){const ae=Pt(A,K.name,()=>qn(K.id));ae.dataset.relatedActivity=K.id}}const H=C?.model.concepts.filter(K=>cs(K.id).some(ae=>ae.id===h.id))??[];if(H.length){Ae(A,"h3","概念");for(const K of H){const ae=Pt(A,K.name,()=>It(z(K.id)));ae.dataset.relatedConcept=K.id}}const U=se().filter(K=>K.activityId&&S.includes(K.activityId)&&K.capability.testSpecification);if(U.length){Ae(A,"h3","Activity に関連するテスト仕様書");for(const K of U)for(const[ae,Ee]of[["decision:","可否判定"],["","処理結果"]]){const Te=ae+K.key,ze=Pt(A,Pe(K)+"・"+Ee,()=>St(Te));ze.dataset.relatedSpec=Te}}D.scrollTop=Be.get("state:"+at)??0}let eo="";function gt(){for(const S of Array.from(o.querySelectorAll(".tab"))){const T=t.business().views?.find(U=>U.key===S.dataset.key);S.hidden=dt&&T?.activity===void 0&&T?.object===void 0;const H=!S.hidden&&ne==="business"&&S.dataset.key===t.business().viewKey;S.classList.toggle("active",H),S.querySelector("button")?.setAttribute("aria-current",String(H))}const h=(S,T,H)=>{S.replaceChildren();for(const U of T){const K=H==="concept"?Oe(U):t.business().states?.find(ot=>ot.id===U)?.name??U,ae=ne===H&&U===(H==="concept"?B:at),Ee=document.createElement("div");Ee.className="tab"+(ae?" active":"");const Te=H==="concept"&&(U==="landscape"||F(U))?"subsystems":H;Ee.dataset.viewKind=Te;const ze=document.createElement("button");ze.id=(H==="concept"?"concept-tab-":"state-tab-")+U,po(ze,Te,K),ze.setAttribute("aria-current",String(ae)),ze.onclick=()=>H==="concept"?It(U):yn(U),Ee.append(ze);const xt=mo((Te==="subsystems"?"サブシステム：":H==="concept"?"データ構造：":"状態遷移：")+K+"のタブを閉じる");xt.onclick=()=>{_t(),H==="concept"?(Ke=Ke.filter(ot=>ot!==U),U!=="overview"&&(ht.get(U)?.remove(),ht.delete(U)),it.delete(U),an.delete(U),cn.delete(U),Ne.delete(U),Ht.delete(U),bt.delete(U),ne===H&&B===U&&(Ke.length?It(Ke.at(-1),!1):vn())):(Xe=Xe.filter(ot=>ot!==U),ne===H&&at===U&&(Xe.length?yn(Xe.at(-1),!1):vn())),gt(),ft(),We(),Ge(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Ee.append(xt),S.append(Ee)}};h(l,Ke,"concept"),h(r,Xe,"states"),f.replaceChildren();for(const S of ct){const T=Hr(S),H=document.createElement("div");H.className="tab"+(ne==="tests"&&S===Ce?" active":""),H.dataset.viewKind="tests";const U=document.createElement("button");U.id="spec-tab-"+S,po(U,"tests",T),U.setAttribute("aria-current",String(ne==="tests"&&S===Ce)),U.onclick=()=>St(S);const K=mo("テスト仕様："+T+"のタブを閉じる");K.onclick=()=>{ct=ct.filter(ae=>ae!==S),ne==="tests"&&Ce===S&&(ct.length?St(ct.at(-1),!1):vn()),gt(),ft(),We(),Ge()},H.append(U,K),f.append(H)}const y=a.querySelector(".tab.active:not([hidden])"),A=ne==="business"?"business:"+t.business().viewKey:ne==="concept"?"concept:"+B:ne==="states"?"states:"+at:ne==="tests"?"tests:"+Ce:"";y?(A!==eo&&Ua(a,y),eo=A):eo=""}function oa(){innerWidth<=800&&ai(!1)}function ft(){const h=k.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,y=k.scrollTop,A=t.business(),S=M.value.trim().toLocaleLowerCase();k.replaceChildren();const T=($,ke,Ye)=>({kind:"item",id:$,name:ke,key:Ye}),H=($,ke,Ye)=>({kind:"group",id:$,name:ke,children:Ye}),U=se(),K=$=>T($.key,$.name,"tests:"+$.key),ae=U.filter($=>$.capability.testSpecification),Ee=U.filter($=>!$.capability.testSpecification),Te=ae.map($=>H("tests-function-"+$.key,Pe($),[T("decision:"+$.key,"可否判定","tests:decision:"+$.key),T($.key,"処理結果","tests:"+$.key)]));for(const $ of A.activities){const ke=Ee.filter(Je=>Je.activityId===$.id).map(K),Ye=(Dt($.id).size?"remaining:":"checks:")+$.id;Gt($.id)&&ke.push(T(Ye,"その他","tests:"+Ye)),ke.length&&Te.push(H("tests-activity-"+$.id,$.name,ke))}const ze=Ee.filter($=>!$.activityId);ze.length&&Te.push(H("tests-other","その他",ze.map(K))),Gr()&&Te.push(T("@unassigned","未割当","tests:@unassigned"));const xt=[{id:"business",label:"業務設計",items:[T("overview","全体図","business:overview"),H("business-activity","Activity",A.activities.map($=>T($.id,$.name,"business:"+$.id))),H("business-object","Object",(A.objects??[]).map($=>T($.id,$.name,"object:"+$.id)))]},{id:"states",label:"状態遷移",items:(A.states??[]).map($=>T($.id,$.name,"states:"+$.id))},{id:"subsystems",label:"サブシステム",items:C?.model.subsystems.length?[T("landscape","全体図","concept:landscape"),...C.model.subsystems.map($=>H("subsystem-"+$.id,$.name.replace(/サブシステム$/,""),C.model.reviewGroups.filter(ke=>ke.subsystemId===$.id).map(ke=>T(L(ke.id),ke.title,"concept:"+L(ke.id)))))]:[]},{id:"concept",label:"データ構造",items:De&&te.length?[T("overview","全体図","concept:overview"),H("concept-relations","概念",te.map($=>T(z($),ee[$].name,"concept:"+z($))))]:[]},{id:"tests",label:"テスト仕様",items:A.design?.model&&(U.length||me().length)?Te:[]}];let ot=0;const Ze=($,ke,Ye)=>{const Je=document.createElement("button");Je.className="explorer-item"+(Ye?" explorer-item-nested":""),Je.dataset.explorerKey=$.key,Je.textContent=$.name;const He=A.views?.find(Ue=>Ue.key===A.viewKey);return ne===(ke.id==="subsystems"?"concept":ke.id)&&(["concept","subsystems"].includes(ke.id)?$.id===B:ke.id==="states"?$.id===at:ke.id==="tests"?$.id===Ce:$.key.startsWith("object:")?He?.object===$.id:$.id==="overview"?!dt&&He?.activity===void 0&&He?.object===void 0:He?.activity===$.id)&&Je.setAttribute("aria-current","page"),Je.disabled=ke.id==="business"&&!A.key,Je.onclick=()=>{I.hidden||t.closeLegacyList(),ke.id==="business"?$.key.startsWith("object:")?Xr($.id):qn($.id==="overview"?void 0:$.id):ke.id==="concept"||ke.id==="subsystems"?It($.id):ke.id==="tests"?St($.id):yn($.id),oa()},Je},At=($,ke,Ye,Je=!1)=>{const He=document.createElement("button"),Et=S?!dn.has($):Ve.has($);return He.className=(Ye?"explorer-subparent":"explorer-parent")+(Je?" explorer-pending":""),He.dataset.explorerKey="group:"+$,Ae(He,"span",ke).className="explorer-parent-label",Je?(He.disabled=!0,He):(He.setAttribute("aria-expanded",String(Et)),He.setAttribute("aria-controls","explorer-"+$),He.append(Wa(Et)),He.onclick=()=>{S?dn.has($)?dn.delete($):dn.add($):(Ve.has($)?Ve.delete($):Ve.add($),We()),ft()},He)};for(const $ of xt){const ke=$.items.flatMap(Ue=>{if(Ue.kind==="item")return!S||($.label+" "+Ue.name).toLocaleLowerCase().includes(S)?[Ue]:[];const Jt=S?Ue.children.filter(no=>($.label+" "+Ue.name+" "+no.name).toLocaleLowerCase().includes(S)):Ue.children;return!S||Jt.length?[{...Ue,children:Jt}]:[]});if(S&&!ke.length)continue;const Ye=$.id!=="business"&&!$.items.length,Je=document.createElement("section"),He=At($.id,$.label,!1,Ye),Et=document.createElement("div");Et.id="explorer-"+$.id,Et.hidden=Ye||(S?dn.has($.id):!Ve.has($.id));for(const Ue of ke){if(Ue.kind==="item"){Et.append(Ze(Ue,$,0)),ot++;continue}const Jt=document.createElement("div");Jt.id="explorer-"+Ue.id,Jt.hidden=S?dn.has(Ue.id):!Ve.has(Ue.id),Et.append(At(Ue.id,Ue.name,!0),Jt);for(const no of Ue.children)Jt.append(Ze(no,$,1)),ot++;!Ue.children.length&&!S&&(Ae(Jt,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!ke.length&&!Ye&&(Ae(Et,"p","項目がありません。").className="explorer-empty"),Je.append(He,Et),k.append(Je)}S&&!ot&&(Ae(k,"p","該当する項目はありません。").className="explorer-empty"),k.scrollTop=y,h&&Array.from(k.querySelectorAll("[data-explorer-key]")).find($=>$.dataset.explorerKey===h)?.focus({preventScroll:!0})}function ai(h){Nt=h,yt(),We(),(h?c.querySelector(".shell-heading button"):j).focus({preventScroll:!0})}j.addEventListener("click",h=>{h.preventDefault(),h.stopImmediatePropagation(),ai(!Nt)},!0),c.querySelector(".shell-heading button").onclick=()=>ai(!1),M.oninput=()=>{dn.clear(),ft()},c.addEventListener("keydown",h=>{if(h.key==="Escape"&&!h.defaultPrevented&&I.hidden&&(h.preventDefault(),h.stopPropagation(),ai(!1)),(h.key==="ArrowDown"||h.key==="ArrowUp")&&k.contains(document.activeElement)){const y=Array.from(k.querySelectorAll("button")).filter(T=>!T.disabled&&!T.closest("[hidden]")),A=y.indexOf(document.activeElement),S=y[A+(h.key==="ArrowDown"?1:-1)];S&&(h.preventDefault(),S.focus())}}),v.addEventListener("click",h=>{ne!=="business"&&(h.preventDefault(),h.stopImmediatePropagation(),(ne==="concept"||ne==="states"||ne==="tests"&&ge(Ce)?.capability.testSpecification)&&(rt.setOpen(!rt.isOpen()),yt(),We(),Ge(!1)))},!0),R.querySelector(".shell-heading button").onclick=()=>{rt.setOpen(!1),yt(),We(),Ge(!1),v.focus({preventScroll:!0})},p.querySelector(".shell-heading button").onclick=()=>{rt.setOpen(!1),yt(),We(),Ge(!1),v.focus({preventScroll:!0})},window.addEventListener("message",h=>{if(h.origin!==location.origin&&!(location.protocol==="file:"&&h.origin==="null"))return;const y=Array.from(ht).find(([,S])=>h.source===S.contentWindow);if(!y)return;if(h.data?.type==="alder-concept-rendered"){y[1].contentDocument&&(gs(y[1].contentDocument),ys(y[1].contentDocument));return}if(ne!=="concept"||y[0]!==B)return;const A=F(B);if(h.data?.type==="alder-concept-clear-selection"){A&&us(!0);return}if(h.data?.type==="alder-concept-subsystem"){if(!Zi(B)?.regions.some(S=>S.id===h.data.id))return;it.delete(B),an.delete(B),cn.set(B,h.data.id),ri(),yt(),We();return}if(!(!te.includes(h.data?.id)||A&&!A.concepts[h.data?.id])){if(h.data.type==="alder-concept-open"){It(z(h.data.id));return}h.data.type==="alder-concept-select"&&(cn.delete(B),it.set(B,h.data.id),(typeof h.data.viewId=="string"?Zi(B)?.tables[h.data.viewId]:void 0)?.conceptId===h.data.id?an.set(B,h.data.viewId):an.delete(B),innerWidth<=800&&(Nt=!1),ri(),yt(),We())}});function ps(){const h=getComputedStyle(document.documentElement);for(const y of ht.values()){const A=y.contentDocument?.documentElement;if(A){A.dataset.theme=document.documentElement.dataset.theme??"light";for(const S of["--bg","--panel","--fg","--line","--subtle","--select"])A.style.setProperty(S,h.getPropertyValue(S))}}}function yt(){!I.hidden&&ne==="business"&&(Nt=!0),c.hidden=!Nt,j.disabled=!1,j.setAttribute("aria-controls","design-explorer"),j.setAttribute("aria-label","ナビゲーションを開閉"),j.setAttribute("aria-expanded",String(Nt));const h=rt.isReady?.()??!0;R.hidden=ne!=="concept"||!De||!h||!rt.isOpen();const y=!!ge(Ce)?.capability.testSpecification;p.hidden=!(ne==="states"||ne==="tests"&&y)||!h||!rt.isOpen(),ni&&ne!=="business"&&(ni.hidden=!0),ne==="concept"?(v.disabled=!De||!h,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!R.hidden))):ne==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):ne==="states"||ne==="tests"&&y?(v.disabled=!h,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!p.hidden))):(ne==="tests"||ne==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const A=i.querySelector("#document-actions");A&&(A.hidden=ne!=="business");const S=i.querySelector("#document-actions-toggle");S&&ne!=="business"&&(S.hidden=!0),ps(),to()}function to(){const h=i.getBoundingClientRect().bottom;h>0&&e.style.setProperty("--shell-content-top",h+"px")}if(typeof ResizeObserver<"u"){const h=new ResizeObserver(to);h.observe(i),h.observe(e.querySelector("header"))}window.addEventListener("resize",to);function ms(){_t(),oi=!0;try{const h=new URL(location.href).searchParams;if(ne==="concept"&&h.get("view")==="concept"&&h.get("concept")===B&&!Ne.has(B)&&Z(B,h.get("dataExample"))&&Be.set("drawer-overview:"+B,R.querySelector(".concept-drawer-body").scrollTop),De||(bt.clear(),Ne.clear(),Ht.clear(),Ke=[],B="overview",O.removeAttribute("src"),O.removeAttribute("srcdoc")),h.get("view")==="concept"){const y=De&&de.includes(h.get("concept")??"")?h.get("concept"):"landscape",A=h.get("dataExample");De&&F(y)&&h.get("dataView")==="overview"&&!Z(y,A)?(bt.add(y),Ne.delete(y)):(bt.delete(y),De&&Z(y,A)?(Ne.set(y,A),Ht.set(y,A)):Ne.delete(y)),It(y,!1)}else if(h.get("view")==="states")t.business().states?.some(y=>y.id===h.get("state"))?yn(h.get("state"),!1):vn();else if(h.get("view")==="tests"){const y=_i(h.get("spec")??"@overview"),A=h.get("dataExample"),S=ge(y);S&&A&&S.samples.some(T=>T.id===A)?lt.set(y,A):S&&lt.delete(y),St(y,!1)}else if(h.get("view")==="empty")ut("empty");else if(ut("business"),t.business().key){const y=h.get("activity"),A=h.get("object"),S=t.business(),T=S.views?.find(H=>H.key===S.viewKey);y&&S.activities.some(H=>H.id===y)?T?.activity!==y&&t.openActivity(y):A&&S.objects?.some(H=>H.id===A)?T?.object!==A&&t.openObject(A):(dt=!1,(!T||T.activity!==void 0||T.object!==void 0)&&t.openOverview())}gt(),ft()}finally{oi=!1}}return window.addEventListener("popstate",ms),{closeBusinessOverview:na,reopenBusinessOverview(){dt=!1},activateBusiness(){ut("business")},businessActivated(){ut("business"),gt(),ft(),Ge()},syncChrome:yt,appendActivityTestLinks(h,y){Zr(h,y),Ki(h,as(y))},openRelatedChecks(h){Ve.add("tests"),St(h&&qe(h)?"checks:"+h:"@overview")},syncDocument(){const h=t.business(),y=h.concept,A=!!(gn&&h.key!==gn||si&&Tn&&h.key&&h.key!==Tn),S=C?.model!==y?.model||C?.business!==y?.business;if((A||S&&C)&&(g.querySelector(".test-spec-page").replaceChildren(),p.querySelector(".spec-related-content").replaceChildren(),R.querySelector(".concept-related-content").replaceChildren(),dt=!1,Ke=[],Xe=[],ct=[],B="overview",at="",Ce="@overview",lt.clear(),Be.clear(),bt.clear(),Ne.clear(),Ht.clear(),ta(),ne!=="business"&&ut("business"),A&&!si&&Ge(!1)),S){C=y,G=y?Fa(y):void 0,q=y?Qa(y):void 0,re=y?Ha(y):void 0,De=!!y,ee=G?.tables??{},te=Object.keys(ee);const T=G?.groups.map(U=>U.id)??[],H=new Set([...wn,"subsystems"]);if(he=new Map(T.map(U=>[U,H.has(U)||te.includes(U)?"group:"+U:U])),xe=new Map(te.map(U=>[U,H.has(U)||T.includes(U)?"concept:"+U:U])),ue=new Map([...he].map(([U,K])=>[K,U])),je=new Map([...xe].map(([U,K])=>[K,U])),de=[...wn,...ue.keys(),...je.keys()],Array.isArray(ye?.expanded)&&ye.expandedVersion!==4){Ve.add("subsystems"),Ve.add("concept-relations");for(const U of y?.model.subsystems??[])Ve.add("subsystem-"+U.id)}}if(gn=h.key,Xe=Xe.filter(T=>h.states?.some(H=>H.id===T)),ne==="business"&&dt&&h.views?.find(T=>T.key===h.viewKey)?.activity===void 0&&h.views?.find(T=>T.key===h.viewKey)?.object===void 0&&vn(),si&&h.key){if(_r(),Tn===h.key){Array.isArray(ye?.specs)&&(ct=[...new Set(ye.specs.filter(T=>typeof T=="string").map(T=>_i(T)))]);for(const[T,H]of Object.entries(ye?.specExamples??{})){const U=ge(T);typeof H=="string"&&U?.capability.samples.some(K=>K.id===H)&&lt.set(T,H)}}si=!1,ms()}ft(),gt(),yt(),A&&We()}}}class vo{tabs=new WeakMap;router;constructor(t=uo){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,s){const c=JSON.stringify([i.map(u=>[u.id,u.width,u.height]),o.map(u=>[u.kind,u.from,u.to,u.label]),s]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==c,l=new Set(i.filter(u=>{const b=d?.nodes.get(u.id);return!b||b.x!==u.x||b.y!==u.y}).map(u=>u.id)),r=new Set(i.map(u=>u.id)),f=a?new Array(o.length):d.routes.slice();if(o.forEach((u,b)=>{!a&&!l.has(u.from)&&!l.has(u.to)||(f[b]=r.has(u.from)&&r.has(u.to)?this.router({from:u.from,to:u.to,index:b,nodes:i,kind:u.kind,matrix:s?.[b],labels:s?.[b]?[]:[...f.flatMap((g,p)=>g&&p<b?[{id:String(p),x:g.label[0]-Math.max(30,o[p].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,o[p].label.length*12),height:18}]:[])],wires:s?.[b]?[]:f.flatMap((g,p)=>g&&p<b?[g.points]:[]),labelWidth:Math.max(30,u.label.length*12),labelHeight:18}):void 0)}),s){const u=[],b=new Map,g=f.map((p,m)=>m).sort((p,m)=>Number(s[p].returning)-Number(s[m].returning));for(const p of g){const m=f[p];if(!m)continue;const I=i.find(O=>O.id===o[p].from),j=Math.max(30,o[p].label.length*12),v=s[p].returning?[Math.max(...m.points.map(O=>O[0]))+8+j/2,m.points[0][1]]:[I.x+I.width*.125+8+j/2,ua(I.y+I.height,s[p].captionLane*nr)+9],M=ir(o[p],p,s[p]),k=b.get(M)??fo(v,j,18,i,u);(k[0]!==m.label[0]||k[1]!==m.label[1])&&(f[p]={...m,label:k}),b.has(M)||(b.set(M,k),u.push({id:String(p),x:k[0]-j/2,y:k[1]-9,width:j,height:18}))}}return this.tabs.set(t,{design:n,structure:c,nodes:new Map(i.map(u=>[u.id,{...u}])),routes:f}),f}}function Uc(e,t,n,i){const o=(f,u,b)=>(u[0]-f[0])*(b[1]-f[1])-(u[1]-f[1])*(b[0]-f[0]),s=o(e,t,n),c=o(e,t,i),d=o(n,i,e),a=o(n,i,t),l=1e-6;if(s*c<-l&&d*a<-l)return!0;if(Math.max(Math.abs(s),Math.abs(c),Math.abs(d),Math.abs(a))>l)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],i[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],i[r]))>.1}function $c(e,t,n,i,o=[]){const s=e.x+e.width,c=24,d=e.y+e.height,a=s-8-(2*(n.count-n.index)-1)*c,l=t.filter(j=>j.id!==e.id);let r;for(const j of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const M=[a+j,d],k=[M[0]+c,d];if(M[0]<e.x+8||k[0]>s-8)continue;const O=d+n.depth+v,R=Math.min(12,(k[0]-M[0])/2,(O-d)/2),D=[M];let x=`M${M}`;const P=q=>{x+=` L${q}`,D.push(q)},N=(q,re)=>{const ee=D.at(-1);x+=` Q${q} ${re}`;for(let te=1;te<=4;te++){const de=te/4,ue=1-de;D.push([ue*ue*ee[0]+2*ue*de*q[0]+de*de*re[0],ue*ue*ee[1]+2*ue*de*q[1]+de*de*re[1]])}};P([M[0],O-R]),N([M[0],O],[M[0]+R,O]),P([k[0]-R,O]),N([k[0],O],[k[0],O-R]),P(k);const C=fa(D,l,.3),G=o.filter(q=>D.slice(1).some((re,ee)=>q.slice(1).some((te,de)=>Uc(D[ee],re,q[de],te)))).length;if((!r||C<r.collisions||C===r.collisions&&G<r.wireCollisions)&&(r={path:x,points:D,collisions:C,wireCollisions:G,low:O,extra:v,shift:j}),C===0&&G===0)break}const{path:f,points:u,collisions:b,wireCollisions:g,low:p,extra:m,shift:I}=r;return{path:f,points:u,label:[Math.max(s+8,n.labelLeft)+i/2,p],bounds:{right:Math.max(...u.map(j=>j[0])),bottom:Math.max(...u.map(j=>j[1]))},collisions:b+g,rerouted:m>0||I!==0,fallback:b+g>0}}function Fc(e,t=No()){const n="http://www.w3.org/2000/svg",i=(L,z={})=>{const F=document.createElementNS(n,L);for(const[le,Z]of Object.entries(z))F.setAttribute(le,Z);return F},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(L=>[L]),c=[...new Set(["@new",...e.states,...s.map(L=>L[0].to)])],d={nodes:c.map(L=>({id:L,type:"business",name:o[L]??L,scope:!0})),relations:s.map(([L])=>({kind:L.path==="exception"?"business-exception":"input",from:L.from,to:L.to,label:L.id+"："+L.activity+"："+L.condition}))},a=qo(d,c),l=L=>{const z=Array.from(L);return Array.from({length:Math.ceil(z.length/28)},(F,le)=>z.slice(le*28,(le+1)*28).join(""))},r=s.map(([L])=>({from:L.from,activity:L.activity,rows:[L],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[L,z]of r.entries()){const F=z.rows[0],le=e.transitions.filter(se=>se.from===F.from&&(se.activityId??se.activity)===(F.activityId??F.activity)&&se.path===F.path&&(F.path!=="exception"||(se.exception??"例外名未定義")===(F.exception??"例外名未定義"))),Z=le.map(se=>(se.conditionLabel??se.condition).trim().replace(/\s+/g," ")),we=new Set(Z).size===le.length?F.conditionLabel??F.condition:F.condition,me=[F.path==="exception"?"例外："+(F.exception??"例外名未定義"):"",...le.length>1||F.path==="normal"&&F.conditionLabel?[we]:[]].filter(Boolean).join("：");z.lines=l(z.activity+(me?"（"+me+"）":"")),z.lineRows=z.lines.map(()=>z.rows),z.width=Math.max(...z.lines.map(se=>Array.from(se).length*14)),z.height=z.lines.length*18,a.wires[L].returning||(z.offset=f.has(z.from)?f.get(z.from)+8:0,f.set(z.from,z.offset+z.height))}const u=new Map;s.forEach(([L],z)=>{if(L.from===L.to){const F=u.get(L.from)??[];F.push(z),u.set(L.from,F)}});const b=new Map,g=new Map;for(const[L,z]of u){let F=0;for(const Z of[...z].reverse())b.set(Z,{leader:z[0],index:0,count:1,depth:0,offset:F}),F+=r[Z].height+8;const le=24+Math.max(0,F-8)+8;g.set(L,le);for(const Z of z)b.get(Z).depth=le}const p=L=>44,m=c.slice().sort((L,z)=>a.positions[L][1]-a.positions[z][1]);let I=Math.max(40,...r.map((L,z)=>a.wires[z].returning&&L.from===m[0]?16+L.height/2-44*(a.wires[z].fromPort??.5):40));const j=new Map;for(const L of m){const z=p(),F=(f.get(L)??0)+(g.get(L)??0);j.set(L,I),I+=pa(z,F)}const v=c.map(L=>({id:L,x:t.positions.get(L)?.[0]??a.positions[L][0],y:t.positions.get(L)?.[1]??j.get(L),width:Math.max(104,Array.from(o[L]??L).length*14+32),height:p()})),M=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),k=i("title");k.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(c.includes("@none")?"作成なしはこの操作の処理結果。":"")+(c.includes("@unknown")?"未決は設計課題。":""),M.append(k),M.append(Po("state-transition-"));const O=new Map,R=[],D=[];let x=t.selected;const P=L=>{x=L,t.selected=L;const z=vi(e.transitions,x);for(const[Z,we]of O)we.setAttribute("class","node graph-shape state-shape"+z.nodeClasses(Z)),we.setAttribute("aria-pressed",String(Z===x));R.forEach(({element:Z,rows:we})=>{const Oe=we[0].from===we[0].to;Z.setAttribute("class","edge"+(Oe?" state-self-loop":we[0].path==="exception"?" exception":"")+z.labelClasses(we)),Z.setAttribute("marker-end","url(#state-transition-"+(we.some(z.related)?"related-arrow":"arrow")+")")});for(const Z of D)Z.element.setAttribute("class","state-caption-line"+z.labelClasses(Z.rows));M.querySelectorAll("[data-exception-paint]").forEach(Z=>Z.remove());const F=Array.from(M.children).find(Z=>Z.matches(".state-diagram-edge-label,[data-state]"))??null,le=[...R].sort((Z,we)=>Number(Z.rows.some(z.related))-Number(we.rows.some(z.related)));for(const{element:Z}of le)if(M.insertBefore(Z,F),Z.classList.contains("exception")||Z.classList.contains("state-self-loop")){const we=M.children.length;To(M,Z,{path:Z.getAttribute("d")},{"data-transitions":Z.getAttribute("data-transitions")});for(const Oe of Array.from(M.children).slice(we))M.insertBefore(Oe,F)}M.querySelectorAll(".state-diagram-edge-label").forEach(Z=>M.append(Z))};M.addEventListener("click",L=>{L.target===M&&P()}),M.addEventListener("keydown",L=>{L.key==="Escape"&&(L.preventDefault(),P())});const N=a.wires.map((L,z)=>({...L,captionLane:(r[z].offset+(g.get(r[z].from)??0))/nr})),C=d.relations.map((L,z)=>({...L,label:String(z).padEnd(Math.ceil(r[z].width/12),"x")})),G=[...b].map(([L,z])=>{const F=v.find(Z=>Z.id===s[L][0].from),le=r[L];return{x:F.x+F.width+8,y:F.y+F.height+24+z.offset,width:le.width,height:le.height}});let q=new vo().update({},e,v,C,N);for(let L=0;L<=G.length;L++){let z=!1,F=0;if(q.forEach((le,Z)=>{if(!le||b.has(Z)||!N[Z].returning)return;let we=0;for(const Oe of G)for(let me=1;me<le.points.length;me++){const se=le.points[me-1],ge=le.points[me];if(Math.abs(se[0]-ge[0])>1e-7||Math.abs(se[1]-ge[1])<2)continue;const Pe=se[0];if(Pe<Oe.x-4||Pe>Oe.x+Oe.width+4||Math.max(se[1],ge[1])<Oe.y-4||Math.min(se[1],ge[1])>Oe.y+Oe.height+4)continue;const qe=Oe.x+Oe.width+12-Pe;qe>0&&(we=Math.max(we,qe))}we&&(N[Z]={...N[Z],returnLane:(N[Z].returnLane??0)+Math.ceil(we/16)+F++},z=!0)}),!z)break;q=new vo().update({},e,v,C,N)}const re=q.flatMap((L,z)=>L&&!b.has(z)?[L.points]:[]),ee=new Map,te=q.map((L,z)=>{const F=b.get(z);if(!F)return L;const le=s[z][0].from,Z=v.find(qe=>qe.id===le),we=q.flatMap((qe,Dt)=>qe&&!b.has(Dt)?[qe.points]:[]),Oe=Math.max(30,C[z].label.length*12),me=r[z];let se=ee.get(F.leader);se||(se=$c(Z,v,{...F,labelLeft:Z.x+Z.width+8},Oe,re),ee.set(F.leader,se),re.push(se.points));const ge=we.flatMap((qe,Dt)=>qe.slice(1).map((rn,Gt)=>({id:`${Dt}:${Gt}`,x:Math.min(qe[Gt][0],rn[0])-2,y:Math.min(qe[Gt][1],rn[1])-2,width:Math.abs(qe[Gt][0]-rn[0])+4,height:Math.abs(qe[Gt][1]-rn[1])+4}))),Pe=fo([Z.x+Z.width+8+me.width/2,Z.y+Z.height+24+F.offset+me.height/2],me.width,me.height,[...v,...ge]);return{...se,label:[Pe[0]-me.width/2+Oe/2,Pe[1]]}}),de=new Array(s.length),ue=[],je=s.map((L,z)=>z).sort((L,z)=>Number(N[L].returning)-Number(N[z].returning));for(const L of je){const z=te[L],F=r[L],le=Math.max(30,C[L].label.length*12);let Z=[z.label[0]-le/2+F.width/2,z.label[1]+(N[L].returning?0:F.height/2-9)];const we=v.find(se=>se.id===s[L][0].from),Oe=v.find(se=>se.id===s[L][0].to);if(!b.has(L)&&N[L].returning&&Oe&&Oe.y>we.y){const se=z.points.slice(1).map((ge,Pe)=>[z.points[Pe],ge]).filter(([ge,Pe])=>Math.abs(ge[0]-Pe[0])<.01&&Pe[1]-ge[1]>24).sort(([ge,Pe],[qe,Dt])=>Dt[1]-qe[1]-(Pe[1]-ge[1]))[0];if(se){const[ge,Pe]=se;Z=[ge[0]+8+F.width/2,ge[1]+Math.min(24+F.height/2,(Pe[1]-ge[1])/2)]}}const me=fo(Z,F.width,F.height,v,ue);de[L]=me,ue.push({id:String(L),x:me[0]-F.width/2,y:me[1]-F.height/2,width:F.width,height:F.height})}let he=Math.max(...v.map(L=>L.x+L.width))+40,xe=Math.max(...v.map(L=>L.y+L.height))+40;s.forEach((L,z)=>{const F=b.get(z);if(F&&F.leader!==z)return;const le=F?s.flatMap((se,ge)=>b.get(ge)?.leader===z?se:[]):L,Z=le[0],we=te[z],Oe=i("path",{d:we.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":le.map(se=>se.id).join(" ")});(F||Z.path==="exception")&&Oe.setAttribute("stroke-dasharray","6 5");const me=i("title");me.textContent=le.map(se=>`${se.id} ${se.activity} / ${se.path==="normal"?"通常":"例外："+(se.exception??"例外名未定義")}：${se.condition}`).join(" / "),Oe.append(me),M.append(Oe),R.push({element:Oe,rows:le}),he=Math.max(he,we.bounds.right+40),xe=Math.max(xe,we.bounds.bottom+40)});for(const[L,z]of r.entries()){const F=de[L],le=F[0]-z.width/2,Z=F[1]-z.height/2+14;M.append(i("rect",{x:String(le),y:String(Z-14),width:String(z.width),height:String(z.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const we=i("text",{x:String(le),y:String(Z),class:"state-diagram-edge-label","data-activity":z.activity,"data-transition-id":z.rows[0].id,"aria-label":z.lines.join("")});z.lines.forEach((Oe,me)=>{const se=i("tspan",{x:String(le),dy:me?"18":"0","font-size":"14","font-weight":"600"});se.textContent=Oe,se.setAttribute("data-transitions",z.lineRows[me].map(ge=>ge.id).join(" ")),D.push({element:se,rows:z.lineRows[me]}),we.append(se)}),M.append(we),he=Math.max(he,le+z.width+24),xe=Math.max(xe,Z+z.height+24)}for(const L of v){const z=L.id.startsWith("@"),F=i("g",{role:"button",tabindex:"0","aria-label":o[L.id]??L.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":L.id,"data-node":L.id});F.append(er(document,L,z)),F.append(i("rect",{x:String(L.x),y:String(L.y),width:String(L.width),height:String(L.height),rx:z?"20":"8",class:z?"state-diagram-node state-note":"state-diagram-node"}));const le=i("text",{x:String(L.x+L.width/2),y:String(L.y+L.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(le.textContent=o[L.id]??L.id,F.append(le),z&&L.id!=="@new"){const Z=i("text",{x:String(L.x+L.width/2),y:String(L.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Z.textContent=L.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",F.append(Z)}F.addEventListener("click",()=>P(L.id)),F.addEventListener("keydown",Z=>{(Z.key==="Enter"||Z.key===" ")&&(Z.preventDefault(),P(L.id))}),O.set(L.id,F),M.append(F)}return P(t.selected),M.setAttribute("viewBox",`0 0 ${he} ${xe}`),M.style.minWidth=`${he}px`,M}const Es=new WeakMap;function Vc(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(p=>p.id===t&&p.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const s=(p,m,I=o)=>{const j=document.createElement(p);return j.textContent=m,I.append(j),j};if(i.error)return s("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const c=i.model;for(const p of c.transitions){if(!e.graph.nodes.some(m=>m.id===p.activity&&m.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(p.exceptionId){const m=e.model?.business.exceptions?.find(I=>I.id===p.exceptionId);if(!m||m.activityId!==p.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=Es.get(e)??new Map;Es.set(e,d);const a=d.get(t)??No();d.set(t,a);const l={...c,transitions:c.transitions.map(p=>({...p,activityId:p.activity,activity:e.graph.nodes.find(m=>m.id===p.activity)?.name??p.activity}))};o.append(Qs(document,p=>Fc(l,p),a));const r=p=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[p]??p,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},u=document.createElement("details");s("summary",`操作の詳細（${c.transitions.length}）`,u);const b=document.createElement("ol");u.append(b),o.append(u);for(const p of c.transitions){const m=document.createElement("li");m.dataset.transition=p.id,s("h3",`${p.id} · ${r(p.from)} → ${r(p.to)}`,m),p.path==="exception"&&s("p","例外名："+(p.exception??"未定義"),m),s("p",`${f[p.effect]} · ${p.path==="normal"?"正常":"例外"}`,m);const I=e.graph.nodes.find(j=>j.id===p.activity&&j.type==="business");if(I){const j=document.createElement("button");j.type="button",j.textContent=I.name,j.onclick=()=>n(I.id),m.append(j)}else s("p","要確認：根拠Activityが見つかりません — "+p.activity,m);s("p","条件："+p.condition,m),s("p",p.note,m),s("p","根拠："+p.evidence,m),b.append(m)}c.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",c.source,g),o.append(g),o}const Os=64,Bc=96,Gc=260,Cs=40,Hc=4;function _c(e,t,n=!0){const{nodes:i,previous:o,children:s,parents:c,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}=ma(e,t),r=c.map(k=>k.length),f=i.map(()=>0),u=i.flatMap((k,O)=>r[O]===0?[O]:[]);for(let k=0;k<u.length;k++)for(const O of s[u[k]])f[O]=Math.max(f[O],f[u[k]]+1),--r[O]===0&&u.push(O);const b=Array.from({length:f.reduce((k,O)=>Math.max(k,O),0)+1},()=>[]);i.forEach((k,O)=>b[f[O]].push(O));const g=i.map(()=>0),p=k=>k.forEach((O,R)=>g[O]=R);b.forEach(p);for(let k=0;k<Hc;k++){const O=k%2?[...b].reverse():b;for(const R of O){const D=new Map(R.map(x=>{const P=k%2?s[x]:c[x];return[x,P.length?P.reduce((N,C)=>N+g[C],0)/P.length:g[x]]}));R.sort((x,P)=>D.get(x)-D.get(P)||x-P),p(R)}}const m=b[0].filter(k=>i[k].type==="object"&&o[k].length===0&&s[k].length>0);if(n&&m.length>1){const k=new Set(m),O=b[0].filter(R=>!k.has(R));b.splice(0,1,...m.map((R,D)=>D===0?[...O,R]:[R]))}const I=Object.create(null),j=i.map(()=>0),v=[],M=Math.ceil(Gc/Os)-1;for(let k=0;k<b.length;k++){const O=new Map;for(const x of v)for(const P of x)O.set(P,P+1);const R=x=>{let P=x;for(;O.has(P);)P=O.get(P);let N=x;for(;O.has(N);){const C=O.get(N);O.set(N,P),N=C}return P},D=[];for(const x of b[k]){let P=k;for(const C of c[x])P=Math.max(P,j[C]+1);const N=R(P);j[x]=N,O.set(N,N+1),D.push(N),I[i[x].id]=[Cs+k*Os,Cs+N*Bc]}v.push(D),v.length>M&&v.shift()}return{positions:I,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}}function Jc(e,t){return or(e)?qo(e,t).positions:_c(e,t).positions}const js=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function fr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>js(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const s=js(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(s)return s}return 0})}}function pr(e){const t=fr(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([s,c])=>[i.get(s),c])))}}function mr(e){const t=pr(e);return t.restore(Jc(t.graph,t.order))}function Kc(e){const t=pr(e),n=qo(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function hr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function Xc(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(c=>c.handle!==void 0):s.tabs.some(c=>c.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(s,c){if(Object.is(s,c))return!0;if(!s||!c||typeof s!="object"||typeof c!="object"||i.has(s)||i.has(c))return!1;const d=b=>Array.isArray(b)||Object.getPrototypeOf(b)===null||Object.getPrototypeOf(b)?.constructor?.name==="Object";if(!d(s)||!d(c)||Array.isArray(s)!==Array.isArray(c)||Array.isArray(s)&&s.length!==c.length)return!1;i.add(s),i.add(c);const a=s,l=c,r=Object.keys(a),f=Object.keys(l),u=r.length===f.length&&r.every(b=>Object.hasOwn(l,b)&&o(a[b],l[b]));return i.delete(s),i.delete(c),u}return o(e,t)}function Dn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),i=Object.create(null);for(const[s,c]of Object.entries(e.positions))n.has(s)&&(i[s]=[...c]);const o=t.graph.nodes.filter(s=>!i[s.id]);if(o.length){const s=mr(t),c=Object.values(i);for(const d of o){const a=[...s[d.id]];for(;c.some(l=>Math.abs(l[0]-a[0])<280&&Math.abs(l[1]-a[1])<88);)a[1]+=180;i[d.id]=a,c.push(a)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function br(){return new Promise((e,t)=>{const n=indexedDB.open(hr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class $o extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let wi;function gr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Zc(e){const t=wi;if(t===void 0)throw Error("Session has not been loaded");const n=await br();try{await new Promise((i,o)=>{const s=n.transaction("session","readwrite"),c=s.objectStore("session"),d=c.get("generation"),a=c.get("current"),l=c.get("readonly-legacy");let r,f;l.onsuccess=()=>{try{const u=gr(d.result);if(Xc(a.result,e)){f=u;return}if(u!==t)throw new $o;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");l.result===void 0&&Qc(a.result)&&c.put(a.result,"readonly-legacy"),c.put(e,"current"),c.put(f,"generation")}catch(u){r=u,s.abort()}},s.oncomplete=()=>{wi=f,i()},s.onerror=()=>o(r??s.error??Error("Session save failed")),s.onabort=()=>o(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Yc(){wi=void 0;const e=await br();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),s=o.get("current"),c=o.get("generation");i.oncomplete=()=>{try{wi=gr(c.result),t(s.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function Qc(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Ms=new WeakMap;function ed(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let i=Ms.get(e);i||(i=new Map,Ms.set(e,i));const o=i.get(t);if(o)return o;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),c=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),d=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&c.has(r.to)||r.to===t&&c.has(r.from))),a=new Set([t,...d.flatMap(r=>[r.from,r.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>a.has(r.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>a.has(r))};return i.set(t,l),l}const Ls=new WeakMap;function td(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let i=Ls.get(e);i||(i=new Map,Ls.set(e,i));const o=t,s=i.get(o);if(s)return s;const c=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),d=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),a=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&d.has(f.to)||f.kind==="output"&&f.to===t&&d.has(f.from)||f.kind==="object-exception"&&(f.from===t&&c.has(f.to)||f.to===t&&c.has(f.from))),l=new Set([t,...a.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>l.has(f.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>l.has(f))};return i.set(o,r),r}const yr=new WeakMap;function $t(e){return yr.get(e)}const vr=["design","checks","source","draft","edited","handle"];function nd(e){return{key:e.key,name:e.name,...Object.fromEntries(vr.map(t=>[t,e[t]]))}}function Ct(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:c,viewInset:d,canvasOrigin:a,scroll:l,zoom:r}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:c,viewInset:d,canvasOrigin:a,scroll:l,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function ji(e,t){const n=t;yr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of vr)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function ki(e){return e.activity}function Ii(e){return e.object}function Bn(e){return e.activity??e.object}function Mi(e){return e.object===void 0?ed(e.design,e.activity):td(e.design,e.object)}function Li(e){const t=Mi(e),n=Dn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function nn(e,t=[],n,i){const o=n??(e.tabs[0]?nd(e.tabs[0]):void 0),s=o?(i??[e.tabs[0]?Ct(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(u=>{const b=ji(o,u);return Object.assign(u,Ct(Li(b))),b}):[],{dark:c,drawer:d,width:a,preferWrite:l,nodeDrawer:r,sampleLayout:f}=e;return{dark:c,drawer:d,width:a,preferWrite:l,nodeDrawer:r,sampleLayout:f,document:o,tabs:s,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(u=>u.source?.kind==="url").map(u=>({url:u.source.url,name:u.name}))].filter((u,b,g)=>g.findIndex(p=>p.url===u.url)===b),legacyViews:e.legacyViews,active:s.some(u=>u.key===e.active)?e.active:s[0]?.key}}function Fo(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Ct),recovery:n}}function di(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function id(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!dd(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const r of o.views)di(r)}const{format:s,views:c,document:d,recovery:a,...l}=e;for(const r of c)di(r);for(const r of a)di(r);if(!!d!=!!c.length||new Set(c.map(r=>r.key)).size!==c.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(u=>u.group!==void 0&&typeof u.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(u=>u.group===void 0).length!==1))throw Error("Invalid legacy views");const r=i.views[0],f=r?{...r}:void 0;return f&&delete f.group,nn({...l,tabs:[],active:f?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},a,d,f?[f]:[])}if(c.length&&(c[0].activity!==void 0||c[0].object!==void 0||c.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(c.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==c.filter(r=>r.activity!==void 0).length||new Set(c.filter(r=>r.object!==void 0).map(r=>r.object)).size!==c.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(d&&c.some(r=>r.activity!==void 0&&!d.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(d&&c.some(r=>r.object!==void 0&&!d.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return nn({...l,tabs:[]},a,d,c)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)di(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return nn({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function od(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return nn({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function sd(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),c=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||s.has(a.activity))&&(a.object===void 0||c.has(a.object))).map(Ct);return nn(e,e.recovery,o,d)}function rd(e,t){const n=e.tabs.find(o=>ki(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=ji(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ct(Li(i))),e.tabs.push(i),e.active=i.key,i}function ad(e,t){const n=e.tabs.find(o=>Ii(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=ji(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Ct(Li(i))),e.tabs.push(i),e.active=i.key,i}function cd(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(s=>s.key===i.key);return Ct(o?Li(ji(e.document,{...Ct(i),...Ct(o)})):i)});return nn({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function dd(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Ri(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const s=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},c=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?c():s(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),c(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,l=o(),r=l.indexOf(document.activeElement);let f;a.key==="ArrowDown"&&(f=(r+1)%l.length),a.key==="ArrowUp"&&(f=(r+l.length-1)%l.length),a.key==="Home"&&(f=0),a.key==="End"&&(f=l.length-1),f!==void 0&&(a.preventDefault(),l[f]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!i(a)&&s(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const ld=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),ud={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function fd(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),s=v=>o.slice(v.line+1,i.find(M=>M.line>v.line&&M.level<=v.level)?.line??o.length).join(`
`).trim(),c=new Map(i.filter(v=>v.level===3&&t.some(M=>M.title===v.title)).map(v=>[v.title,v])),d=v=>{const M=t.find(k=>k.title===v.title);return M?"legacy-check:"+M.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},a=new Map,l=(v,M)=>{a.has(v)?a.get(v)!==M&&a.set(v,void 0):a.set(v,M)};for(const v of i){const M=d(v);l(ld(v.title),M);const k=t.find(O=>O.title===v.title);k&&l(k.id.toLowerCase(),M)}for(const[v,M]of o.entries()){const k=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(M);if(k){const O=i.find(R=>R.line>v);O&&l(k[1].toLowerCase(),d(O))}}const r=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const M=[];let k=0;for(const O of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){O.index>k&&M.push({kind:"markdown",value:v.slice(k,O.index)});let R=O[2].slice(1);try{R=decodeURIComponent(R)}catch{}const D=O[2].startsWith("#")?a.get(R.toLowerCase()):void 0;M.push(D?{kind:"reference",targetId:D,label:O[1]}:{kind:"link",uri:O[2],label:O[1]}),k=O.index+O[0].length}return k<v.length&&M.push({kind:"markdown",value:v.slice(k)}),M},f=[],u=[],b=[],g=new Map;for(const v of i.filter(M=>M.level===2)){if(v.title==="業務一覧")continue;const M=d(v),k=i.find(O=>O.line>v.line)?.line??o.length;f.push({id:M,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:r(o.slice(v.line+1,k).join(`
`).trim())}),g.set(v.title,M)}const p="legacy-unassigned",m=v=>{const M=i.filter(k=>k.line<v.line&&k.level===2).at(-1);return M?g.get(M.title):void 0},I=t.map(v=>{const M=c.get(v.title),k=m(M)??p,O=Object.create(null),R=[];let D={name:"補足",value:""},x="";for(const N of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const C=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(N);C&&(x?C[1][0]===x[0]&&C[1].length>=x.length&&!C[2].trim()&&(x=""):x=C[1]);const G=x?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(N);G?(D.value.trim()&&R.push(D),D={name:G[1],value:G[2]}):D.value+=`
`+N}D.value.trim()&&R.push(D);let P="";for(const N of R)if(N.name==="人間レビュー状態"){P=N.value.split(`
`)[0].trim();const C=N.value.split(`
`).slice(1).join(`
`).trim();C&&(O.補足=[...O.補足??[],...r(C)])}else{const C=ud[N.name]??N.name;O[C]=[...O[C]??[],...r(N.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:P,sectionId:k,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(N=>N[1]).join(`
`),fields:O}});I.some(v=>v.sectionId===p)&&f.push({id:p,activityId:null,title:"未割当",preamble:[]});for(const v of i.filter(M=>M.level===3&&!c.has(M.title))){const M=m(v);M?u.push({id:d(v),sectionId:M,title:v.title,blocks:[{kind:"prose",content:r(s(v))}]}):b.push({id:d(v),title:v.title,content:r(s(v))})}const j=i.find(v=>v.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(o.slice(/^# /.test(o[0])?1:0,j).join(`
`)),sections:f,items:I,index:Object.entries(n).map(([v,M])=>{const k=o.find(O=>O.startsWith("|")&&O.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:k[1]?.trim()??"",connections:k[2]?.trim()??"",checkIds:M.map(O=>"legacy-check:"+O)}}),guarantees:u,examples:[],notes:b}}function oo(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...s]=n;if(!i||!o)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[c,...d]=s;return!c||!d.length||!["main","master"].includes(c)&&!/^[a-f0-9]{40}$/i.test(c)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:c}}catch{return}}function wo(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function pd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((f,u)=>{const b=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(b){o?b[1][0]===o[0]&&b[1].length>=o.length&&!b[2].trim()&&(o=""):o=b[1];return}if(!o){t.add(u);const g=/^(#{1,6}) (.+)$/.exec(f);g&&i.push({line:u,level:g[1].length,title:g[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const s=i.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const c=new Set,d=s.map(f=>{const u=i.find(p=>p.line>f.line&&p.level<=3)?.line??n.length,b=f.title.split(/\s/)[0];if(c.has(b))throw Error("Check IDが重複しています: "+b);c.add(b);const g=n.slice(f.line+1,u).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const p of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+p+"[：:]\\s*\\S","m").test(g))throw Error(b+" の"+p+"が見つかりません。");return{id:b,title:f.title,body:g,activities:[]}}),a=Object.create(null);let l=!1;for(const[f,u]of n.entries()){if(!t.has(f)||(/^## /.test(u)&&(l=/^## 業務一覧\s*$/.test(u)),!l||!/^\|/.test(u)))continue;const b=u.split("|").slice(1,-1);if(b.length!==4)continue;const g=wo(b[0])[0]?.label;if(!g)continue;if(Object.hasOwn(a,g))throw Error("業務一覧のActivityが重複しています: "+g);const p=wo(b[3]);if(p.some(I=>I.url.toLowerCase()!=="#"+I.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const m=p.map(I=>I.label);if(!m.length||m.some(I=>!c.has(I)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);a[g]=[...new Set(m)];for(const I of d)m.includes(I.id)&&I.activities.push(g)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=i.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:d,index:a,model:fd(e,d,a,i)}}function Gn(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Hn(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),i=Object.keys(e.index).filter(l=>!n.has(l)),o=Object.keys(e.index).filter(l=>n.has(l)),s=(l,r)=>({state:l,reason:r,unknown:i});if(!o.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const c=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=wo(c).map(l=>oo(l.url)).filter(l=>l!==void 0),a=t.source?.kind==="url"?oo(t.source.url):t.source?.kind==="sample"?oo("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(l=>l.document!==a.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!a||!d.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Rs=new WeakMap;function Cn(e){let t=Rs.get(e);return t||(t=pd(e.markdown),Rs.set(e,t)),t}const so=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function li(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function md(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function hd(e){if(!e.checks)return[];const t=Cn(e.checks),n=Hn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===Gn(e)?[t.model]:[]}function bd(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&li(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let s,c=!1;if(e.checks){s=Cn(e.checks);const d=Hn(s,e);if(c=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===Gn(e),!c&&(li(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=so("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,o.append(a)}}if(t.candidate){const d=t.candidate,a=Cn(d),l=Hn(a,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",li(r,"一致未確認: "+d.name+" — "+l.reason),li(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),u=document.createElement("summary");u.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(u,md(a.markdown)),r.append(f);const b=so("対応を確認して表示する",()=>n.confirm(d));b.id="check-confirm",b.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const g=so("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(b,g),o.append(r)}return o.childNodes.length&&i.append(o),i}function gd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const r of o){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const c=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),r&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(r=>!r.hidden&&!r.disabled),a=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const b=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+b,p=o.some(m=>!m.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=p?"menu":"inline",i.hidden=!p,(!p||r!==e.dataset.actionsMode)&&(c(),p&&n.contains(f)?i.focus({preventScroll:!0}):!p&&f===i&&d()[0]?.focus({preventScroll:!0}))},l=(r=!1)=>{if(i.hidden)return;s=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const f=d();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return i.onclick=()=>s?c(!0):l(),i.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),l(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=d(),u=f.indexOf(document.activeElement);let b;r.key==="ArrowDown"&&(b=(u+1)%f.length),r.key==="ArrowUp"&&(b=(u+f.length-1)%f.length),r.key==="Home"&&(b=0),r.key==="End"&&(b=f.length-1),b!==void 0&&(r.preventDefault(),f[b]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),c(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!i.contains(r.target)&&c()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==i&&c()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&c(!0)},!0),c(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:c}}function yd(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),s=parseFloat(o.columnGap)||0,c=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((l,r)=>l+r.getBoundingClientRect().width,0)+s*n.length+c,a=d+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(s=>o.observe(s))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const Wn="http://www.w3.org/2000/svg",vd="http://www.w3.org/1999/xhtml",ui=24,Ds=8192,wd=16e6,kd=8e6,Id=4e3,Sd=1e6,ko="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function xd(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),i=Math.max(i,r.x+r.width),o=Math.max(o,r.y+r.height);const s=Math.floor(t)-ui,c=Math.floor(n)-ui,d=Math.ceil(i)-s+ui,a=Math.ceil(o)-c+ui,l=Math.min(2,Ds/d,Ds/a,Math.sqrt(wd/(d*a)));if(l<1)throw Error(ko);return{bounds:{x:s,y:c,width:d,height:a},width:Math.floor(d*l),height:Math.floor(a*l),scale:l}}const Ad="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function Ns(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,s)=>{const c=i[s],d=getComputedStyle(o);c.removeAttribute("style");for(const a of Ad){const l=d.getPropertyValue(a);l&&!/url\s*\(/i.test(l)&&c.style.setProperty(a,l)}for(const a of Array.from(c.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&c.removeAttribute(a.name)}),t}function Ed(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Id||(e.textContent?.length??0)+(t.textContent?.length??0)>Sd)throw Error(ko);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(p=>({x:parseFloat(p.style.left),y:parseFloat(p.style.top),width:p.offsetWidth,height:p.offsetHeight}));for(const p of i)for(const m of Array.from(p.querySelectorAll(".finding-badges")))o.push({x:parseFloat(p.style.left)+p.clientLeft+m.offsetLeft,y:parseFloat(p.style.top)+p.clientTop+m.offsetTop,width:m.offsetWidth,height:m.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,c=Array.from(t.children).map(Ns),d=c.filter(p=>p.matches(".edge,.edge-label"));if(d.length){const p=s.createElementNS(Wn,"svg");p.setAttribute("viewBox","0 0 1 1"),p.setAttribute("width","1"),p.setAttribute("height","1"),p.setAttribute("aria-hidden","true"),p.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",p.append(...d),s.body.append(p);try{for(const m of d){const I=m.getBBox();o.push({x:I.x-12,y:I.y-12,width:I.width+24,height:I.height+24})}}finally{p.remove()}}const a=xd(o),l=s.createElementNS(Wn,"svg");l.setAttribute("width",String(a.width)),l.setAttribute("height",String(a.height)),l.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const r=s.createElementNS(Wn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),l.append(r);const f=s.createElementNS(Wn,"g");f.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const p of c)f.append(p);l.append(f);const u=s.createElementNS(Wn,"foreignObject");u.setAttribute("width",String(a.bounds.width)),u.setAttribute("height",String(a.bounds.height));const b=s.createElementNS(vd,"div");b.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const p of i){const m=Ns(p);m.querySelector(".activity-open,.object-open")?.remove(),m.style.left=parseFloat(p.style.left)-a.bounds.x+"px",m.style.top=parseFloat(p.style.top)-a.bounds.y+"px",b.append(m)}u.append(b),l.append(u);const g=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(g).length>kd)throw Error(ko);return{svg:g,...a}}function Od(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function wr(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,s)=>{const c=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(c),o()},n.onerror=()=>{clearTimeout(c),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,s)=>{const c=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(c),d?o(d):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(c),s(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Cd(e,t){const n=await wr(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Od(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function jd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=wr(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function kr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:Md(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Md(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,s=2246822507;for(const c of i)o=Math.imul(o^c.codePointAt(0),16777619)>>>0,s=Math.imul(s^c.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function Ir(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return W(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function Ld(e){W(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),Sn(e),yo(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=kr(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=Ir(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return yo(t),t}const ce=(e,t)=>{if(!e)throw new Error(t)},zn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ro=e=>!!e&&typeof e=="object"&&!Array.isArray(e),fi=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),Sr=e=>zn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Rd(e){ce(ro(e),"Graph must be an object");const t=e;ce(fi(t,["version","nodes","relations"])||fi(t,["version","nodes","relations","scope"]),"Invalid graph fields"),ce(t.version===1,"Unsupported graph version"),"scope"in t&&ce(zn(t.scope),"Invalid scope"),ce(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),ce(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){ce(ro(s),"Node must be an object");const c=s;ce(c.type==="business"||c.type==="object","Invalid node type");const d=c.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];c.type==="business"&&("problem"in c||"pain_level"in c)&&(d.push("problem","pain_level"),ce(["Low","Medium","High"].includes(String(c.pain_level)),"Invalid Pain level")),ce(fi(c,d),"Invalid node fields"),ce(Object.entries(c).every(([l,r])=>l==="scope"||l==="information"||zn(r)),"Empty node text"),ce(typeof c.scope=="boolean","Invalid node scope"),ce(Sr(c.name)&&c.id===c.name,"Node ID must equal visible name"),ce(!n.has(c.id),"Duplicate node ID"),c.type==="object"&&(ce(typeof c.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.icon),"Invalid Lucide icon"),ce(Array.isArray(c.information)&&c.information.every(zn),"Invalid information")),n.set(c.id,c.type)}ce([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const s of t.relations){ce(ro(s),"Relation must be an object");const c=s;ce(fi(c,["kind","from","to","label"])&&Object.values(c).every(zn),"Invalid relation fields");const d=i[c.kind];ce(Array.isArray(d)&&n.has(c.from)&&n.has(c.to)&&n.get(c.from)===d[0]&&n.get(c.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([c.kind,c.from,c.to,c.label]);ce(!o.has(a),"Duplicate relation"),o.add(a)}}function Yt(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Un(e){const t=[];let n="";return Yt(e).forEach((i,o)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),ce(!n,"Unclosed code fence"),t}function Io(e,t,n,i=[]){const o=Yt(e),s=Un(e),c=Object.create(null);return ce(s.length&&!o.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([d,a],l)=>{ce(t.includes(a)&&!(a in c),n+": unsupported/duplicate "+a),c[a]=o.slice(d+1,s[l+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ce(c[a]||i.includes(a),n+": empty "+a)}),ce(s.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),c}const Ps=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function Dd(e){const t=Yt(e),n=Un(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return ce(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,s],c)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);ce(d,"Invalid Finding ID");const a=d[1];ce(!i.has(a),"Duplicate Finding ID"),i.add(a);const l=Io(t.slice(o+1,n[c+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);ce(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),ce(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),ce(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const r=l["### Targets"]==="(none)"?[]:Yt(l["### Targets"]).filter(f=>f.trim()).map(f=>(ce(f.startsWith("- ")&&Sr(f.slice(2)),"Invalid Finding target"),f.slice(2)));return ce(new Set(r).size===r.length,"Duplicate Finding target"),ce(l["### Scope"]==="items"?r.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:r,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function Nd(e,t){ce(!e.includes("<!--"),"HTML comments are unsupported");const n=Yt(e),i=Un(e).filter(u=>u[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;ce(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let s=[];const c={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;i.slice(1).forEach(([u,b],g)=>{const p=i[g+2]?.[0]??n.length,m=n.slice(u+1,p).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(ce(m,"Empty section "+b),b==="# Findings"){ce(!a.has(b),"Duplicate Findings"),a.add(b),s=Dd(m);return}if(["# Scope","# Graph exceptions"].includes(b)){ce(!a.has(b),"Duplicate "+b),a.add(b),b==="# Scope"?(ce(!Un(m).length,"Scope must be prose"),c.scope=m):Yt(m).filter(D=>D.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(D=>{const x=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(D);ce(x,"Invalid exception"),c.relations.push({kind:x[1],from:x[2],to:x[3],label:x[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const I=o.exec(b);ce(I,"Unsupported heading "+b);const j=I[1],v=I[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[v]=n.slice(u,p).join(`
`);const M=D=>Un(m).some(x=>x[1]===D);if(j==="Object"){const D=["## Scope","## Icon"];M("## Information")&&D.push("## Information");const x=Io(m,D,v);ce(["true","false"].includes(x["## Scope"]),"Invalid Scope");const P=Yt(x["## Information"]??"").filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(N=>(ce(/^- \S.*$/.test(N),"Invalid Information"),N.slice(2)));c.nodes.push({id:v,type:"object",name:v,scope:x["## Scope"]==="true",icon:x["## Icon"]==="(generic icon)"?"box":x["## Icon"],information:P});return}const k=["## Scope","## Why","## When"];M("## Exception When")&&k.push("## Exception When"),k.push("## Who","## Where","## How","### Input","### Procedure"),M("### Exception")&&k.push("### Exception"),k.push("### Output","## Result"),(M("## Problem")||M("## Pain level"))&&k.push("## Problem","## Pain level");const O=Io(m,k,v,["## How"]);ce(!O["## How"],"How must only contain fields"),ce(["true","false"].includes(O["## Scope"]),"Invalid Scope"),t?.activity?.(v,O);const R={id:v,type:"business",name:v,scope:O["## Scope"]==="true",why:O["## Why"],when:O["## When"],who:O["## Who"],where:O["## Where"],result:O["## Result"]};"## Problem"in O&&(R.problem=O["## Problem"],R.pain_level=O["## Pain level"]),c.nodes.push(R);for(const[D,x]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(D in O)||x!=="business-exception"&&O[D]==="(none)"||Yt(O[D]).filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(P=>{const N=/^- (.+?) — (\S.*)$/.exec(P);ce(N,"Invalid relation in "+v),c.relations.push({kind:x,from:x==="output"?v:N[1],to:x==="output"?N[1]:v,label:N[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=c.nodes.filter(u=>u.type==="business").map(u=>u.id);Rd(c),c.nodes.sort((u,b)=>Ps(u.id,b.id)),c.relations.sort((u,b)=>{for(const g of["kind","from","to","label"]){const p=Ps(u[g],b[g]);if(p)return p}return 0});const r=new Set(c.nodes.map(u=>u.id));for(const u of s)u.unresolvedTargets=u.targets.filter(b=>!r.has(b));return{graph:c,sections:d,markdown:e,activityOrder:l,findings:s}}const Pd=["id","from","activity","condition","to","effect","path","evidence","note"],$e=(e,t)=>{if(!e)throw Error(t)},pi=e=>typeof e=="string"&&!!e.trim();function Td(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());$e(n,"state-meta と遷移表が必要です");const i=lr(n[1]);$e(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),$e(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),$e(i.object===t,"対象Objectが一致しません"),$e(Array.isArray(i.states)&&i.states.length>0&&i.states.every(l=>pi(l)&&!l.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),$e(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&pi(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),s=l=>($e(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(r=>r.trim())),c=s(o[0]);$e([Pd,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>c.join("|")===l.join("|")),"表の列名が不正です"),$e(s(o[1]).length===c.length&&s(o[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),$e(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=o.slice(2).map(l=>{const r=s(l);$e(r.length===c.length&&r.every(pi),"表の列数・空欄が不正です");const f=Object.fromEntries(c.map((u,b)=>[u,r[b]]));return $e(/^T[0-9]+$/.test(f.id)&&!d.has(f.id),"遷移IDが不正または重複しています"),d.add(f.id),$e([...i.states,"@new"].includes(f.from)&&[...i.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),$e(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),c.includes("exception")&&$e(f.path==="normal"?f.exception==="-":pi(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),$e(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),$e(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),$e(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),$e(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...i,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Ts=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function qd(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let s="";for(let c=0;c<i.length;c++){const d=i[c];if(!s&&/^# Object /.test(d)?n=d.slice(9):!s&&/^# /.test(d)&&(n=null),!s&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let l="";for(c++;c<i.length;c++){const f=i[c];if(!l&&/^#{1,2} /.test(f)){c--;break}a.push(f),l=Ts(f,l)}const r=Td(a.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}o.push(d),s=Ts(d,s)}if(new Set(t.map(c=>c.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function Wd(e){const t=/^## State Transitions$/m.test(e)?qd(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,s=Nd(t.markdown,{activity:(a,l)=>o.set(a,l),document:(a,l)=>{n=a,i=l}}),c={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:s.graph.scope??"",objects:s.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(s.activityOrder??[]).map(a=>{const l=s.graph.nodes.find(f=>f.id===a),r=o.get(a);return{id:a,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:s.graph.relations.map((a,l)=>({id:"legacy-relation-"+l,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(s.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(l=>s.graph.nodes.some(r=>r.id===l))}))};c.exceptions=kr(c);const d=t.declarations.map((a,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:c.id,revision:c.revision,verification:"unverified"},objectId:a.object,states:a.states.map(r=>({id:r,name:r})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:Ir(c,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:c,checks:[],states:d,diagnostics:[]}}}function zd({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const n=ur({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(n.diagnostics)]};const i=e.business,o=[...i.objects,...i.activities],s=a=>i.roles?.find(l=>l.id===a.roleId)?.name??a.who,c=[...i.objects.map(a=>({...a,type:"object"})),...i.activities.map(a=>({id:a.id,type:"business",name:a.name,scope:a.scope,why:a.why,when:a.when,who:s(a),where:a.where,result:a.result,...a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel}}))],d=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(a=>a.basedOn.documentId===i.id).map(a=>{const l=new Map(a.states.map(f=>[f.id,f.name])),r={object:o.find(f=>f.id===a.objectId).name,states:a.states.map(f=>f.name),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(f=>({id:f.sourceId,from:l.get(f.fromId)??f.fromId,to:l.get(f.toId)??f.toId,activity:f.activityId,...f.event?{event:f.event}:{},...f.exceptionId?{exceptionId:f.exceptionId,exception:i.exceptions?.find(u=>u.id===f.exceptionId)?.name}:{},condition:f.condition,...f.conditionLabel?{conditionLabel:f.conditionLabel}:{},effect:f.effect,path:f.path,evidence:f.evidence,note:f.note}))};return[a.objectId,{model:r}]})));return{graph:fr({version:1,...i.scope?{scope:i.scope}:{},nodes:c,relations:i.relations.map(a=>({kind:a.kind,from:a.fromId,to:a.toId,label:a.label}))}),sections:Object.fromEntries(c.map(a=>[a.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:i.activities.map(a=>a.id),objectStateTransitions:d,findings:i.findings.map(a=>({...a,displayId:a.sourceId,targets:[...a.targetIds,...a.unresolvedTargets],targetNames:[...a.targetIds,...a.unresolvedTargets].map(l=>o.find(r=>r.id===l)?.name??l)}))}}const xr=8*1024*1024;function Ar(e){return/^\s*[\[{]/.test(e)}function Er(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function qs(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");Er(e);const n=yo(e),i=e.documents.filter(s=>s.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Ud(e){if(!Ar(e))return Wd(e);if(new TextEncoder().encode(e).byteLength>xr)throw Error("ローカルJSONは8MiB以内にしてください。");const t=lr(e.replace(/^\uFEFF/,""));if(Er(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=qs(Ld(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const i=n.data.business;i.schemaVersion="0.1",delete i.roles;for(const o of i.activities)delete o.roleId;n.data.diagnostics=n.data.diagnostics.filter(o=>!o.startsWith("Role未確定:"))}return n}return qs(t,e)}function bn(e){return zd(Ud(e))}async function $d(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>xr)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Ar(n))throw Error("JSONファイルの本文を確認してください。");return bn(n)}const Fd=(e,t)=>Vo(e,t,!1);async function Vo(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,s=()=>o.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const c=setTimeout(s,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const r=d.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,u="";const b=new TextDecoder;try{for(;;){const{done:g,value:p}=await r.read();if(g)break;if(f+=p.length,f>l){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}u+=b.decode(p,{stream:!0})}u+=b.decode()}finally{r.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(u))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(u))throw Error("HTMLページは読み込めません。");return u}catch(d){const a=o.signal.aborted;throw s(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(c),t?.removeEventListener("abort",s)}}const Si=$d;async function Di(e,t){return bn(await Vo(e,t))}function Vd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return bn(e)}const Ni=e=>e==="question"?"要確認":"要修正";function Bd(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===i&&s.targets.includes(t.id)).length;o&&n.push(`${Ni(i)} ${o}`)}return n}function Gd(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Ni(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(pn(e.content)),t}function Hd(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function _d(e,t,n){const i=document.createElement("nav");i.className="drawer-findings",i.setAttribute("aria-label","関連する指摘");for(const o of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=o.id,s.textContent=`${Ni(o.kind)} · ${o.displayId??o.id}　${o.summary}`,s.onclick=()=>n({type:"finding",id:o.id}),i.append(s)}return i}function Jd(e,t,n,i,o){const s=document.createElement("section");s.className="findings-index";const c=document.createElement("label");c.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),c.append(d,document.createTextNode("解消済みも表示")),s.append(c);const a=(r,f,u)=>{const b=document.createElement("button");b.className="node-navigate finding-index-row",b.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const p=document.createElement("span");return p.textContent=u,b.append(g,p),b.onclick=()=>i(r),b},l=e.graph.nodes.filter(r=>(!o||r.id===o)&&typeof r.problem=="string");if(l.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of l)s.append(a({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const u=(e.findings??[]).filter(g=>(!o||g.targets.includes(o))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!u.length)continue;const b=document.createElement("h3");b.textContent=`${f}（${u.length}件）`,s.append(b);for(const g of u)s.append(a({type:"finding",id:g.id},`${Ni(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function Kd(e){const t=mr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((s,c)=>s===o[c]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...ha(),viewInset:[40,0],canvasOrigin:void 0}}function Xd(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,s)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(s)}),n}function Bo(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Zd(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Bo(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Yd(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Bo(t)),n.href}function Qd(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Bo(t)}const Go=`# Alderを使った設計業務 — Business Design

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
`,el=`{
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
`;function tl(e,t){const n=new Set(t.graph.nodes.map(u=>u.id)),i=new Map;for(const u of t.graph.nodes)i.set(u.name,i.has(u.name)?void 0:u.id);const o=u=>n.has(u)?u:i.get(u),s=Object.create(null);for(const[u,b]of Object.entries(e.positions)){const g=o(u);g&&(s[g]=b)}const{scroll:c,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:c,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(u=>{const b=o(u);return b?[b]:[]}))]}}}const nl=`# Alderのチェックリストサンプル

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
`;function il(e,t,n,i,o=()=>!0,s=()=>{}){const c=e.ownerDocument,d=c.defaultView;let a,l=0,r=0,f=!1,u=null,b="";const g=new Map,p=()=>{a!==void 0&&(d.clearTimeout(a),l=Math.max(0,l-(Date.now()-r)),a=void 0)},m=(v=!1)=>{if(v&&!o())return;p(),g.delete(b);const M=[...g].at(-1);if(M){j(M[1],"error",M[0]);return}const k=e.contains(c.activeElement);e.hidden=!0,t.textContent="",s(),k&&(u?.isConnected?u:i).focus({preventScroll:!0})},I=()=>{e.hidden||e.dataset.kind==="error"||f||c.hidden||e.contains(c.activeElement)||(p(),r=Date.now(),a=d.setTimeout(m,l))};e.addEventListener("pointerenter",()=>{f=!0,p()}),e.addEventListener("pointerleave",()=>{f=!1,I()}),e.addEventListener("focusin",v=>{const M=v.relatedTarget;M&&!e.contains(M)&&(u=M),p()}),e.addEventListener("focusout",()=>d.setTimeout(I,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),m(!0))}),c.addEventListener("visibilitychange",()=>c.hidden?p():I()),n.onclick=()=>m(!0);const j=(v,M,k)=>{p(),e.contains(c.activeElement)||(u=c.activeElement),b=k,e.dataset.kind=M,e.dataset.key=k,t.setAttribute("role",M==="error"?"alert":"status"),t.setAttribute("aria-live",M==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,s(),l=M==="warning"?8e3:5e3,I()};return(v,M="success",k="operation")=>{M==="error"&&v?(g.delete(k),g.set(k,v)):g.delete(k);const O=[...g].at(-1);if(O){if(!e.hidden&&t.textContent===O[1]&&b===O[0])return;j(O[1],"error",O[0]);return}if(!v){b===k&&m();return}!e.hidden&&t.textContent===v&&e.dataset.kind===M||j(v,M,k)}}const Ws=el,mt=document.querySelector("#app");mt.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Fe;const w=e=>document.getElementById(e),xn=hr(location.pathname);xn.version&&(w("preview-badge").hidden=!1,w("preview-badge").textContent=`確認用 · ${xn.version}`,w("preview-badge").title=`PR #${xn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const _n=e=>Rn(e,{"stroke-width":1.8,"aria-hidden":"true"}),Qn=document.createElement("div");Qn.id="source-menu";Qn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';mt.append(Qn);const Pi=document.createElement("div");Pi.id="checks-menu";Pi.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';mt.append(Pi);const mn=document.createElement("section");mn.id="check-followup";mn.hidden=!0;mn.setAttribute("aria-labelledby","check-followup-title");mn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(mn);const Ti=document.createElement("div");Ti.id="check-followup-menu";Ti.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';mt.append(Ti);const jt=document.createElement("input");jt.type="file";jt.id="check-file";jt.accept=".md,.markdown,text/markdown,text/plain";jt.hidden=!0;mt.append(jt);const Bt=document.createElement("section");Bt.id="check-url-dialog";Bt.hidden=!0;Bt.setAttribute("role","dialog");Bt.setAttribute("aria-labelledby","check-url-title");Bt.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';mt.append(Bt);const qi=document.createElement("div");qi.id="help-menu";qi.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${xn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${xn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${xn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;mt.append(qi);Ri(w("help-menu-toggle"),qi);const $n=document.createElement("div");$n.id="url-history";Qn.append($n);function ol(){if($n.replaceChildren(),!E.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",$n.append(e);for(const t of E.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=ie||Le||oe,n.onclick=()=>{sl(t.url)},$n.append(n)}}async function sl(e){if(!(ie||Le||oe)){if(E.document?.source?.kind==="url"&&E.document.source.url===e){pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),ti();return}Le=!0,Se();try{const t=await Di(e),n=Dn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await ei(n)}catch(t){t instanceof Ln||Re("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Le=!1,Se()}}}const rl=Ri(w("open-menu-toggle"),Qn),al=Ri(w("open-checks"),Pi,()=>{const e=X();w("check-open-sample").hidden=!e||!Xo(e),w("check-close").disabled=!e?.checks}),Or=Ri(w("check-followup-open"),Ti,()=>{w("check-followup-sample").hidden=!X()||!Xo(X())});for(const[e,t]of[["open-menu-toggle",hs],["open",hs],["open-url",ba],["open-text",ga],["view-markdown",ya],["open-checks",Hs],["share-source",va],["refresh",wa],["help-menu-toggle",ka],["drawer",Ia],["node-list-toggle",Sa],["node-list-close",_s],["display-settings-toggle",Js],["reset-layout",xa],["save-image",Aa],["copy-image",Ea],["out",Zs],["in",Ys]])w(e).prepend(_n(t));yd(document.querySelector("header"));const So=gd(document.querySelector(".tab-strip"));let E={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},vt=!0,Wt=!1,ie=!0,jn=!1,un=!1,Le=!1,zs=Promise.resolve(),Qt,fe,wt=0,oe=!1,Fn=!1,An=0,xi=0,En=!1,Ho=!1,xo=!1,Us=!1;const Ao=new Set,zt=new Set,Ai=new Set;function Cr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ai){const i=[...E.document?[E.document]:[],...E.recovery].find(s=>s.key===n),o=t.find(s=>s.key===n&&s.draft===i?.draft);i&&o&&Ai.delete(n)}}const X=()=>E.tabs.find(e=>e.key===E.active),hn=e=>$t(e)?.key??e.key,Ft=e=>E.document?.key===hn(e);let Eo="";const cl=il(w("status"),w("status-text"),w("status-close"),w("viewport"));function Re(e,t="success",n="operation"){if(n==="storage"){if(Eo===e)return;Eo=e}cl(e,t,n)}function _o(){Re("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Jo(){Re("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Rt(){ie||(wt++,_e())}function dl(e){e.preventDefault(),e.returnValue=!0}function _e(){const e=wt>An||xi>0||!1||oe||Ai.size>0||xo||En||un,t=!ie&&e;t!==Us&&(Us=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",dl));const n=ie?"restoring":jn?"protected":un?"conflict":En?"error":xo||Ai.size>0?"draft":xi>0||oe?"saving":wt>An?"dirty":Ho?"saved":"unchanged";mt.dataset.saveState!==n&&(mt.dataset.saveState=n),jn?_o():un?Jo():En?Re("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):Re("","success","storage"),zi()}function Ko(e){En=!0,Eo=""}function Wi(){if(jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(un)throw new $o}async function ll(e){Wi();try{await Zc(e)}catch(t){throw t instanceof $o&&(un=!0,clearTimeout(Qt),Qt=void 0,Jo()),t}}function jr(e,t){xi++,Ao.add(t),_e();const n=zs.catch(()=>{}).then(()=>ll(e)).then(()=>{An=Math.max(An,t),Ho=!0,Cr(e),An===wt&&(En=!1)},i=>{throw Ko(),i}).finally(()=>{xi--,Ao.delete(t),_e()});return zs=n.catch(()=>{}),n}function be(e=180,t=!0){if(ie)return;if(t&&wt++,clearTimeout(Qt),Qt=void 0,jn){_o(),_e();return}if(un){Jo(),_e();return}if(oe||Ao.has(wt)||!t&&wt<=An&&!En){_e();return}const n=()=>{Qt=void 0;let i;try{i=structuredClone(Fo(E))}catch{Ko(),_e();return}jr(i,wt).catch(()=>_e())};e===0?n():Qt=window.setTimeout(n,e),_e()}async function ul(e){if(ie||fe||oe||!E.tabs.includes(e))return;if(Bn(e)===void 0){Fe?.closeBusinessOverview();return}st.cancel(),pe();const t=E.active===e.key,n={...E,tabs:E.tabs.filter(i=>i!==e),active:t?E.tabs[0]?.key:E.active};try{await Fi(()=>n,()=>{E=n}),t&&mt.dataset.workspaceArea==="business"&&Fe?.businessActivated()}catch{_e()}}function tt(){w("drawer").setAttribute("aria-label","業務内容開閉"),w("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!X(),t=e&&E.drawer,n=e&&!!E.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Wt=!1),zi(),w("layout-lock").replaceChildren(_n(vt?Ks:Xs)),w("layout-lock").setAttribute("aria-pressed",String(vt)),w("layout-lock").title=vt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",w("layout-lock").toggleAttribute("disabled",ie),w("viewport").dataset.layoutLocked=String(vt),w("prefer-write").checked=E.preferWrite===!0,w("prefer-write").disabled=ie,w("show-exceptions").checked=X()?.showExceptions!==!1,w("show-exceptions").disabled=ie||oe||!X()||fe===X(),w("selected-edges-only").checked=X()?.selectedEdgesOnly===!0,w("selected-edges-only").disabled=ie||oe||!X()||fe===X(),document.documentElement.dataset.theme=E.dark?"dark":"light",w("theme").replaceChildren(_n(E.dark?Ra:Da)),w("formattedMarkdownDrawer").hidden=!t,w("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(E.width,innerWidth*.65))+"px",w("drawer").setAttribute("aria-expanded",String(t)),w("drawer").toggleAttribute("disabled",ie||!e),w("node-list-drawer").hidden=!n||nt().mode!=="findings",w("node-list-toggle").setAttribute("aria-expanded",String(n)),w("node-list-toggle").toggleAttribute("disabled",ie||!e),Fe?.syncChrome()}function Oo(){for(const e of["save-image","copy-image"]){const t=w(e);t.hidden=!X(),t.disabled=Fn||ie||!X()||fe===X(),t.setAttribute("aria-busy",String(Fn))}}function zi(){Oo(),document.querySelector(".toolbar").dataset.settingsOpen=String(Wt),w("display-options").hidden=!Wt,w("reset-layout").disabled=ie||Le||oe||!1||!X()||zt.has(E.document?.key??"")||jn||un;const e=w("display-settings-toggle"),t=Wt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Wt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ie||oe||!X()||fe===X()}function Mr(e,t=!1){const n=X();ie||oe||!n||fe===n||e===Wt||(e&&(Mn.delete($t(n)?.key??n.key),Ui()),st.cancel(),Me=void 0,pe(),Wt=e,zi(),Lt(n),!e&&(t||w("display-options").contains(document.activeElement))&&w("display-settings-toggle").focus({preventScroll:!0}))}async function Lr(e){const t=X();if(!(Fn||ie||!t||fe===t)){Fn=!0,Oo();try{const n=Ed(w("nodes"),w("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await jd(n),Re("グラフ全体のPNGをコピーしました。")):await Cd(n,($t(t)?.name??t.name)+(Bn(t)?" - "+Bn(t):""))}catch(n){Re((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{Fn=!1,Oo()}}}w("save-image").onclick=()=>Lr(!1);w("copy-image").onclick=()=>Lr(!0);w("display-settings-toggle").onclick=()=>Mr(!Wt);w("reset-layout").onclick=()=>{const e=X();if(ie||Le||oe||fe||!e||zt.has(hn(e)))return;try{Wi()}catch{_e();return}st.cancel(),Zt.cancel(),Me=void 0,pe();const t={...e,design:Mi(e)},n=Kd(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),qr.invalidate(e),Se(),n!==t&&be()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Wt&&w("source-dialog").hidden&&(e.preventDefault(),Mr(!1,!0))});function pe(e=!0){const t=X();if(!t)return!1;const n=[w("viewport").scrollLeft,w("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Rt(),be(180,!1)),i}function Rr(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function Co(){rl.close(),al.close(),Or.close(),So.close(),Rr(fl),So.update()}function fl(){const e=w("tabs");e.replaceChildren(),E.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===E.active?" active":""),n.draggable=Bn(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",ki(t)!==void 0&&(n.dataset.activity=ki(t)),Ii(t)!==void 0&&(n.dataset.object=Ii(t));const i=document.createElement("button");po(i,"business",t.name),i.setAttribute("aria-current",String(t.key===E.active)),i.disabled=oe,i.onclick=async()=>{if(oe||kt&&kt!==t.key&&!await Bi())return;const s=pe()||E.active!==t.key;Fe?.activateBusiness(),E.active=t.key,Se(),Fe?.businessActivated(),be(180,s)};const o=mo("業務設計："+t.name+"を閉じる");o.disabled=oe,o.onclick=()=>ul(t),n.append(i,o),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),oe)return;const c=E.tabs.findIndex(a=>a.key===s.dataTransfer?.getData("text/plain")),d=E.tabs.indexOf(t);if(c>0&&d>0&&c!==d){const[a]=E.tabs.splice(c,1);E.tabs.splice(d,0,a),Co(),be()}},n.onkeydown=s=>{if(!oe&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const c=E.tabs.indexOf(t),d=c+(s.key==="ArrowLeft"?-1:1);c>0&&d>0&&d<E.tabs.length&&([E.tabs[c],E.tabs[d]]=[E.tabs[d],E.tabs[c]],Co(),be())}},e.append(n)})}const $s=new Map,Mn=new Set;function Ui(){const e=X(),t=!!e&&e.design.sourceFormat!=="json"&&Mn.has($t(e)?.key??e.key)&&!e.checks;t||(Or.close(),mn.contains(document.activeElement)&&w("viewport").focus({preventScroll:!0})),mn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])w(n).disabled=ie||Le||oe||!1||!e||on(e).busy===!0}w("check-followup-later").onclick=()=>{const e=X();e&&Mn.delete($t(e)?.key??e.key),Ui()};let jo;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])w("check-followup-"+e).onclick=()=>{jo=w("check-followup-open"),w(t).click(),jo=void 0};function Xo(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Go}function on(e){const t=$t(e)?.key??e.key;let n=$s.get(t);return n||(n={},$s.set(t,n)),n}async function Zo(e,t){if(!Ft(e))throw Error("原本文書が切り替わりました。");const n=nn(E,E.recovery,{...E.document,checks:t},Fo(E).views);await Fi(()=>n,()=>{E=n,t&&Mn.delete($t(e)?.key??e.key)})}async function Dr(e,t){const n=on(e);if(e.design.sourceFormat==="json"||n.busy||oe||ie||fe===e)return;const i=Gn(e);n.busy=!0,n.error=void 0,n.candidate=void 0,Vt();try{const o=await t();if(!Ft(e))return;if(i!==Gn(E.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=Cn(o),c=Hn(s,E.tabs[0]);if(c.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+c.reason);c.state==="unverified"?n.candidate=o:(await Zo(e,o),n.candidate=void 0,Fe?.openRelatedChecks(X()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,Re(n.error,"error")}finally{n.busy=!1,Vt()}}async function Nr(e,t){const n=on(e);if(n.busy||oe||!Ft(e))return;const i=Hn(Cn(t),E.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,Vt();return}n.busy=!0,n.error=void 0;try{await Zo(e,{...t,confirmedFor:Gn(E.tabs[0])}),n.candidate=void 0,Fe?.openRelatedChecks(X()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,Vt()}}function Vt(){Ui();const e=X(),t=w("detail"),n=e?on(e):void 0,i=e?e.key+":"+(e.selected??""):"";w("open-checks").disabled=ie||oe||fe===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const c=e.design.graph.nodes.find(f=>f.id===e.selected),d=bd(e,n,{disabled:ie||oe||fe===e,redraw:Vt,confirm:f=>{Nr(e,f)}}),a=document.createElement("div");a.className="right-drawer-heading";const l=tc(c?.name??"業務設計");if(c){const f=c.type==="business"?Pr(String(c.who),c.id):sr(c);f.classList.add("drawer-node-icon"),l.prepend(f)}a.append(l);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{w("drawer").click(),w("drawer").focus({preventScroll:!0})},a.append(r),t.append(a),d.hasChildNodes()&&t.append(d),c){const f=_d(e.design,c.id,Yo);f.hasChildNodes()&&t.append(f)}t.append(Lc(e.design,c?.id)),c?.type==="business"&&Fe?.appendActivityTestLinks(t,c.id),t.scrollTop=s,o&&document.getElementById(o)?.focus({preventScroll:!0})}const Fs=new Map,nt=()=>{const e=E.active??"";let t=Fs.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Fs.set(e,t)),t};function Yo(e){if(!X())return;const t=nt();t.mode="findings",t.finding=e,E.nodeDrawer=!0,innerWidth<=800&&(E.drawer=!1),tt(),pt(),w("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),be()}function pl(e){const t=X();if(!t)return;const n=nt();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){Yo(i[0]);return}E.nodeDrawer=!0,innerWidth<=800&&(E.drawer=!1),tt(),pt(),w("drawer-mode-findings").focus({preventScroll:!0}),be()}function ml(e,t){const n=nt().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return nt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{nt().finding=void 0,pt(),w("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),i)t.append(Gd(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,pn(String(o.problem)))}const c=i?.targets??[o.id];if(c.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const l of c){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=l;const f=e.design.graph.nodes.some(b=>b.id===l),u=e.hiddenNodes?.includes(l);r.disabled=!f||!!u,r.textContent=(e.design.graph.nodes.find(b=>b.id===l)?.name??l)+(f?u?"（非表示）":"":"（参照先なし）"),r.onclick=()=>bi(l,!0),d.append(r)}t.append(d)}return!0}function Pr(e,t){let n=0;for(const o of e)n=n*31+o.codePointAt(0)>>>0;const i=document.createElement("span");return i.className="who-badge",i.style.setProperty("--role-color",(t&&X()?.design.model?.business.roles?Wo(X().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true"),i.append(_n(tr)),i}function $i(e,t=!0){ie||!X()||(st.cancel(),pe(),E.nodeDrawer=e,e&&nt().mode==="findings"&&innerWidth<=800&&(E.drawer=!1),tt(),e&&X()?.selected&&Nn(X().selected),pt(),t&&w(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),be())}function Nn(e){const t=X(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=nt();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(ec(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(w("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function hl(e,t){const n=X();if(!n||ie||oe||fe===n)return;st.cancel(),Me=void 0,pe();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],sn(),be()}function bi(e,t=!1){let n=X();if(n&&!Mi(n).graph.nodes.some(f=>f.id===e)&&(pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,n=X(),Se()),!n||n.hiddenNodes?.includes(e)||fe===n)return;t||(nt().finding=void 0);const i=w("node-list").contains(document.activeElement);st.cancel(),Me=void 0,pe(),n.selected=e,Nn(e),tt(),sn();const o=w("viewport"),s=o.getBoundingClientRect(),c=w("formattedMarkdownDrawer").getBoundingClientRect(),d=E.drawer&&c.left>s.left&&c.left<s.right?c.left:s.right,a=Math.max(1,Math.min(o.clientWidth,d-s.left-o.clientLeft)),l=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],Lt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],pe(),i){const f=t?"[data-finding-target]":"[data-list-node]",u=Array.from(w("node-list").querySelectorAll(f)).find(b=>(t?b.dataset.findingTarget:b.dataset.listNode)===e);(t?u:u?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}be()}function pt(){const e=X(),t=nt(),n=w("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const s=w("drawer-modes");s.replaceChildren();for(const g of["findings"]){const p=document.createElement("button");p.id="drawer-mode-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.mode===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.mode===g?0:-1,p.textContent=`指摘（${e?Hd(e.design):0}）`;const m=()=>{t.mode=g,pt(),w("drawer-mode-"+g).focus({preventScroll:!0})};p.onclick=m,p.onkeydown=I=>{["ArrowLeft","ArrowRight","Home","End"].includes(I.key)&&(I.preventDefault(),p.focus({preventScroll:!0}))},s.append(p)}for(const g of[w("node-categories"),w("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const c=w("node-list-search");c.value=t.search,c.disabled=!e||ie;const d=w("node-categories");d.replaceChildren();for(const[g,p]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const m=document.createElement("button");m.dataset.category=g,m.id="node-category-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.category===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.category===g?0:-1,m.textContent=p,m.onclick=()=>{t.category=g,pt(),w("node-category-"+g).focus({preventScroll:!0})},m.onkeydown=I=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(I.key))return;I.preventDefault();const j=["activity","object","role"],v=j.indexOf(g);t.category=I.key==="Home"?"activity":I.key==="End"?"role":j[(v+(I.key==="ArrowRight"?1:2))%3],pt(),w("node-category-"+t.category).focus({preventScroll:!0})},d.append(m)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=l.filter(g=>!a.has(g.id)).length,f=w("scope-outside"),u=r===l.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",u),f.setAttribute("aria-label",u==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(_n(u==="false"?Na:Pa)),f.disabled=!l.length||ie||fe===e;const b=w("show-outside");if(b.checked=u==="true",b.indeterminate=u==="mixed",b.setAttribute("aria-checked",u),b.disabled=f.disabled,w("scope-count").textContent=u==="mixed"?`${r}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(ml(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(m=>m.id===t.filterNode)?.name??t.filterNode)+"の指摘";const p=document.createElement("button");p.className="node-navigate finding-all",p.textContent="すべての指摘",p.onclick=()=>{t.filterNode=void 0,pt(),w("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,p)}n.append(Jd(e.design,t.resolved,g=>{t.resolved=g,pt(),n.querySelector("input")?.focus({preventScroll:!0})},Yo,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}w("node-list-toggle").onclick=()=>$i(!E.nodeDrawer);w("node-list-close").onclick=()=>$i(!1);w("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),$i(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!w("node-list-drawer").hidden&&w("source-dialog").hidden&&(e.preventDefault(),$i(!1))});w("node-list-search").oninput=()=>{nt().search=w("node-list-search").value,pt()};function Tr(){const e=X();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);hl(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}w("scope-outside").onclick=Tr;w("show-outside").onchange=Tr;const bl="http://www.w3.org/2000/svg",ao=e=>document.createElementNS(bl,e),qr=new vo,Vs=new WeakMap;function gl(e){if(!or(e.graph))return;let t=Vs.get(e);return t||(t=Kc(e),Vs.set(e,t)),t.wires}function yl(e,t,n){To(w("edges"),e,t,{"data-relation":String(n)})}let Jn=()=>{},qt=[0,0],Xt=[0,0];function vl(){const e=w("node-list-drawer");return w("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function wl(){const e=w("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Lt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(f=>f[0])),Math.min(0,...i.map(f=>f[1]))],s=[o[0]<0||n[0]>0?Math.min(o[0],Xt[0]):0,o[1]<0||n[1]>0?Math.min(o[1],Xt[1]):0],{growth:c,origin:d}=La(n,s,e.zoom),a=c.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+c[0],e.scroll[1]+c[1]],Rt(),be(180,!1));const l=Math.ceil(Math.max(1400,qt[0],(vl()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(f=>f[0]+340))),r=Math.max(850,qt[1],Math.max(qt[1],...i.map(f=>f[1]+68))+wl()/e.zoom-t[1],(w("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(f=>f[1]+220));w("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",w("canvas").style.height=(r+d[1]+t[1]*2)*e.zoom+"px",w("nodes").style.left=(d[0]+t[0])*e.zoom+"px",w("nodes").style.top=(d[1]+t[1])*e.zoom+"px",w("edges").style.left=t[0]*e.zoom+"px",w("edges").style.top=t[1]*e.zoom+"px",w("nodes").style.width=l+"px",w("nodes").style.height=r+"px",w("nodes").style.transform=`scale(${e.zoom})`,w("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${r+d[1]}`),w("edges").style.width=(l+d[0])*e.zoom+"px",w("edges").style.height=(r+d[1])*e.zoom+"px",a&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("zoom").textContent=Math.round(e.zoom*100)+"%"}function sn(){Rr(kl)}function kl(){zi(),Zt.cancel(),Jn=()=>{},qt=[0,0],Xt=[0,0];const e=X();if(w("nodes").replaceChildren(),w("edges").replaceChildren(),w("empty").hidden=!!e,w("canvas").hidden=!e,!e){w("viewport").scrollLeft=0,w("viewport").scrollTop=0,Vt(),pt();return}const t=Mi(e),n=t.graph.nodes,i=n.filter(r=>!e.hiddenNodes?.includes(r.id)),o=new Set(i.map(r=>r.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const s=e.selected,c=e.positions,d=vi(t.graph.relations,s);Lt(e),w("edges").append(Po());const a=Xd(t.graph.relations,E.preferWrite===!0),l=()=>{const r=n.flatMap(m=>{const I=c[m.id];return I?[{id:m.id,x:I[0],y:I[1],width:260,height:68}]:[]}),f=gl(t),u=qr.update(e,t,r,t.graph.relations,f),b=new Map;for(qt=[0,0],Xt=[0,0];w("edges").childNodes.length>1;)w("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(m=>[m.id,m.name]));t.graph.relations.forEach((m,I)=>{if(a.has(I))return;const j=u[I];if(!j||(qt[0]=Math.max(qt[0],j.bounds.right+20,j.label[0]+Math.max(30,m.label.length*12)/2+12),qt[1]=Math.max(qt[1],j.bounds.bottom+20,j.label[1]+22),Xt[0]=Math.min(Xt[0],...j.points.map(D=>D[0]-20),j.label[0]-Math.max(30,m.label.length*12)/2-12),Xt[1]=Math.min(Xt[1],...j.points.map(D=>D[1]-20),j.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(m)||!o.has(m.from)||!o.has(m.to)||e.showExceptions===!1&&(m.kind==="business-exception"||m.kind==="object-exception")))return;const v=ao("path");v.setAttribute("d",j.path),v.dataset.relation=String(I),v.dataset.collisions=String(j.collisions),v.dataset.rerouted=String(j.rerouted),v.dataset.fallback=String(j.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),m.kind.endsWith("exception")&&v.classList.add("exception"),d.related(m)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),d.muted(m)&&v.classList.add("muted");const M=ao("title");M.textContent=(g.get(m.from)??m.from)+" → "+(g.get(m.to)??m.to)+": "+m.label,v.append(M),w("edges").append(v),m.kind.endsWith("exception")&&yl(v,j,I);const k=ir(m,I,f?.[I]),O=b.get(k);if(O){O.dataset.relations+=" "+I,d.related(m)&&(O.classList.add("review-related"),O.classList.remove("muted"));return}const R=ao("text");b.set(k,R),R.dataset.relations=String(I),R.setAttribute("x",String(j.label[0]-Math.max(30,m.label.length*12)/2)),R.setAttribute("y",String(j.label[1])),R.setAttribute("text-anchor","start"),R.classList.add("edge-label"),R.setAttribute("dominant-baseline","middle"),R.dataset.relation=String(I),d.related(m)&&R.classList.add("review-related"),d.muted(m)&&R.classList.add("muted"),R.textContent=m.label,w("edges").append(R)});const p=w("edges");for(const m of[...Array.from(p.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(p.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(p.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(p.querySelectorAll(".edge-label.review-related"))])p.append(m);Lt(e)};Jn=l,l(),i.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+d.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=c[r.id][0]+"px",f.style.top=c[r.id][1]+"px",r.type==="business"?f.append(Pr(String(r.who),r.id)):f.append(sr(r));const u=document.createElement("span");u.className="node-text";const b=document.createElement("span");b.className="review-kind",b.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),u.append(b);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,u.append(g),r.type==="business"){const v=document.createElement("small");v.textContent=String(r.who),u.append(v)}if(f.append(u),Ta(r.id,Bn(e))){const v=document.createElement("button");v.type="button",v.className=r.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",r.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),r.type==="business"?Mo(r.id):Wr(r.id),Fe?.businessActivated()},f.append(v)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const p=Bd(e.design,r);if(p.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=p.join(" · "),v.setAttribute("aria-label",r.name+"の指摘を開く"),v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),pl(r.id)},f.append(v),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+p.join("、"))}let m;const I=f;I.onpointerdown=v=>{v.button!==0||fe===e||vt||(v.stopPropagation(),I.setPointerCapture(v.pointerId),m=v.pointerId,Zt.begin(r.id,[v.clientX,v.clientY]))},I.onpointermove=v=>{m===void 0||v.pointerId!==void 0&&v.pointerId!==m||!f.isConnected||fe===e||Zt.move([v.clientX,v.clientY])},I.onpointerup=v=>{if(m===void 0||m!==v.pointerId||(m=void 0,!f.isConnected||fe===e))return;const M=Zt.end();I.hasPointerCapture?.(v.pointerId)&&I.releasePointerCapture(v.pointerId),M&&(M.moved||(nt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Rt()),Nn(r.id)),pe(),sn(),be(180,!1))};const j=v=>{m===void 0||m!==v.pointerId||(m=void 0,f.isConnected&&(Zt.cancel(),pe(),be(180,!1)))};I.onpointercancel=j,I.onlostpointercapture=j,w("nodes").append(f)}),w("zoom").textContent=Math.round(e.zoom*100)+"%",Vt(),pt()}function Mo(e){ie||oe||fe||(pe(),rd(E,e),Se(),be(),w("viewport").focus({preventScroll:!0}))}function Wr(e){ie||oe||fe||(pe(),ad(E,e),Se(),be(),w("viewport").focus({preventScroll:!0}))}function Se(){document.title=E.document?E.document.name+" · Alder Viewer":"Alder Viewer",st.cancel(),Me=void 0,tt(),Co(),sn();const e=X();e&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("refresh").toggleAttribute("disabled",ie||oe||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||zt.has(hn(e))),w("refresh").hidden=!e,w("view-markdown").toggleAttribute("disabled",ie||Le||oe||!1||!e||zt.has(hn(e))),w("view-markdown").hidden=!e,w("open-checks").hidden=!e||e.design.sourceFormat==="json",w("open-checks").toggleAttribute("disabled",ie||Le||oe||!1||!e||!!(e&&on(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])w(t).toggleAttribute("disabled",ie||Le||oe);w("open-sample").setAttribute("aria-disabled",String(ie||Le||oe)),w("open-sample").tabIndex=ie||Le||oe?-1:0,w("theme").toggleAttribute("disabled",ie),Zn(),Ui(),ol(),Hi(),Fe?.syncDocument()}async function ei(e){const t=E.document,n=od(E,e);return t?(await Fi(()=>n,()=>{E=n,Mn.add($t(E.tabs[0])?.key??E.tabs[0].key)}),!0):(pe(),E=n,Mn.add($t(E.tabs[0])?.key??E.tabs[0].key),Se(),be(),!0)}async function zr(e,t){if(kt&&!await Bi())return;const n=await Si(e),i=X();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await Kn(i,n,t))return;Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),be();return}const o=Dn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await ei(o)}w("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])w("guide-"+e).onclick=()=>w(e).click();w("open-sample").onpointerdown=e=>e.stopPropagation();w("open-sample").onclick=async e=>{if(e.preventDefault(),!(ie||Le||oe))try{if(E.document?.source?.kind==="sample"&&E.document.design.markdown===Ws){pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),w("viewport").focus({preventScroll:!0});return}const t=bn(Ws),n=E.document?.source?.kind==="sample"&&E.document.design.markdown===Go?E.tabs[0]:void 0;n&&pe();const i=n??E.sampleLayout,o=i?tl(i,t):{},s=Dn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await ei(s)&&w("viewport").focus({preventScroll:!0})}catch(t){Re("サンプルを開けません: "+t.message,"error")}};w("open").onclick=async()=>{if(!(ie||Le||oe)){Le=!0,Se();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await zr(await n.getFile(),n)}else w("fallback").click()}catch(e){e.name!=="AbortError"&&Re("開けません: "+e.message,"error")}finally{Le=!1,Se()}}};w("fallback").onchange=async()=>{const e=w("fallback");if(!(ie||Le||oe)){Le=!0,Se();try{for(const t of Array.from(e.files??[]))await zr(t)}catch(t){Re("開けません: "+t.message,"error")}e.value="",Le=!1,Se()}};class Ln extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function Fi(e,t){if(oe||fe)throw Error("表示を切り替えています。完了後に再試行してください。");try{Wi()}catch(o){throw new Ln(o)}pe(),clearTimeout(Qt),Qt=void 0,oe=!0,wt++;const n=wt;Se(),_e();let i=!1;try{const o=structuredClone(Fo(e()));await jr(o,n);const s=E;t(),E!==s&&(E=cd(E,s)),et==="view"&&kt&&!E.tabs.some(c=>c.key===kt)&&(kt=E.tabs[0]?.key),Cr(o),i=!0}catch(o){throw Ko(),new Ln(o)}finally{oe=!1,Se(),_e(),i&&wt!==n&&be(0,!1)}}async function Kn(e,t,n=e.handle,i=!1){if(!Ft(e)||e.design!==E.document?.design)return!1;const o=sd(E,t,n,i);return await Fi(()=>o,()=>{E=o}),fn=void 0,Hi(),Re(""),!0}async function Bs(e){if(!Ft(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await Kn(e,await Si(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const s=()=>{o.remove(),n()};o.oncancel=s,o.onchange=async()=>{try{const c=o.files?.[0];c&&await Kn(e,await Si(c)),s()}catch(c){o.remove(),i(c)}},o.click()})}w("refresh").onclick=async()=>{const e=X();if(ie||oe||fe||!e||e.source?.kind==="text"||e.source?.kind==="sample"||zt.has(hn(e)))return;kt===e.key&&Oi();const t=hn(e);zt.add(t),Se();try{if(e.source?.kind==="url"){const i=await Di(e.source.url);await Kn(e,i);return}if(!e.handle){await Bs(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Ft(e))return;if(n!=="granted"){Re("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Bs(e);return}await Kn(e,await Si(await e.handle.getFile()))}catch(n){Ft(e)&&n.name!=="AbortError"&&!(n instanceof Ln)&&Re("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{zt.delete(t),Se()}};let et="text",kt,Ut=!1,en=0,Ei,Lo=null;const Mt=()=>w("source-text"),Xn=()=>w("source-url");function Qo(){xo=!w("source-dialog").hidden&&et!=="view"&&(et==="text"?Mt().value:Xn().value)!=="",_e()}Xn().addEventListener("input",Qo);function Zn(){Ro();const e=et==="view",t=Ut||oe;Mt().disabled=t,Mt().readOnly=e,w("source-dialog").dataset.mode=et,w("source-submit").hidden=e,w("source-submit").textContent="表示",w("source-submit").disabled=t||e,w("source-cancel").disabled=oe||t&&et!=="url",w("source-cancel").textContent=e?"閉じる":"キャンセル",Qo(),queueMicrotask(Fr)}function es(e,t){if(!(ie||Le||oe||t&&zt.has(hn(t)))){Ei?.abort(),en++,et=e,kt=t?.key,Ut=!1,Lo=document.activeElement,w("source-dialog").hidden=!1,w("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${E.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])w(n).hidden=e!=="url";for(const n of["text-label","source-text"])w(n).hidden=e==="url";w("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Mt().value=t.design.markdown:e==="text"&&(Mt().value=Vi),Zn(),(e==="url"?Xn():Mt()).focus()}}let Vi="",mi;function Il(){if(Lo?.isConnected&&Lo.focus({preventScroll:!0}),mi!==void 0&&cancelAnimationFrame(mi),et!=="view")return;const e=en;mi=requestAnimationFrame(()=>{if(mi=void 0,e!==en||!w("source-dialog").hidden)return;const t=window.visualViewport,n=mt.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Oi(){en++,Ei?.abort(),Ut=!1,kt=void 0,w("source-dialog").hidden=!0,Zn(),Il()}async function Bi(){return oe?!1:(et==="text"&&(Vi=Mt().value),Oi(),!0)}function Ur(){return Bi()}Mt().oninput=()=>{et==="text"&&(Vi=Mt().value,Qo())};let gi=!1;function $r(){return ie||Le||Ut||oe||fe?"読込が終わってから共有してください。":Zd(X())}function Ro(){const e=$r(),t=w("share-source");t.hidden=!X(),t.setAttribute("aria-disabled",String(gi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}w("share-source").onclick=async()=>{if(gi)return;const e=$r();if(e){Re(e,"warning");return}const t=X();if(t.source?.kind!=="url")return;const n=t.source.url,i=Yd(location.href,n);gi=!0,Ro();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),Re("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{Re("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{gi=!1,Ro()}};let Tt,kn=0,Gs=0,Vn;function Fr(){if(ie||Le||Ut||fe||oe||Tt||Vn===void 0)return;const e=Vn;Vn=void 0,ts(e)}async function ts(e=location.hash){const t=e;if(ie)return;const n=++Gs;if(!/^#source(?:=|$)/.test(t)){Vn=void 0,Tt&&!oe&&(Tt.abort(),Tt=void 0,kn++,Le=!1,Se());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),oe){Vn=t;return}if(Ut||Le&&!Tt){Re("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++kn;Tt?.abort();try{const o=Qd(t);Wi();const s=E.tabs.find(l=>l.source?.kind==="url"&&l.source.url===o),c=s;if(c){if(kt&&kt!==c.key&&!await Bi()||i!==kn||n!==Gs)return;const l=pe()||E.active!==c.key;E.active=c.key,Se(),be(180,l),Re("開いている共有元のタブを選択しました。表示内容は保持しています。"),ti();return}Tt=new AbortController,Le=!0,Se();const d=await Di(o,Tt.signal);if(i!==kn)return;const a=Dn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await ei(a))return;Re("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===kn&&!(o instanceof Ln)&&Re("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===kn&&(Tt=void 0,Le=!1,Se(),Fr())}}window.addEventListener("hashchange",()=>{ts().then(()=>{E.document?.key===Do&&ti()})});function ns(e){E.drawer=!0,tt(),Vt()}async function Sl(e){const t=on(e);if(!(e.design.sourceFormat==="json"||t.busy||oe||ie||fe===e)){t.busy=!0;try{await Zo(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,Vt()}}}let Ci;jt.onchange=()=>{const e=jt.files?.[0],t=Ci??X();Ci=void 0,jt.value="",!(!e||!t||!Ft(t))&&(ns(),Dr(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};jt.oncancel=()=>{Ci=void 0};w("check-open").onclick=()=>{Ci=X(),jt.click()};let is,yi=null;function os(){Bt.hidden=!0,is=void 0,(yi&&!yi.closest("[hidden]")?yi:w("open-checks").getBoundingClientRect().width?w("open-checks"):w("document-actions-toggle")).focus({preventScroll:!0})}w("check-open-url").onclick=()=>{const e=X();e&&(yi=jo??document.activeElement,is=e,w("check-url").value=on(e).url??"",Bt.hidden=!1,w("check-url").focus())};w("check-url-cancel").onclick=os;Bt.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),os())};w("check-url-form").onsubmit=e=>{e.preventDefault();const t=is;if(!t||!Ft(t))return;const n=w("check-url").value.trim();on(t).url=n,os(),ns(),Dr(t,async()=>({name:n,url:n,markdown:await Fd(n)}))};w("check-open-sample").onclick=()=>{const e=X();!e||!Xo(e)||(ns(),Nr(e,{name:"チェックリストのサンプル",markdown:nl}))};w("check-close").onclick=()=>{const e=X();e&&Sl(e)};w("open-sample-menu").onclick=()=>{w("open-sample").click()};w("view-markdown").onclick=()=>{const e=X();e&&es("view",e)};w("open-url").onclick=()=>es("url");w("open-text").onclick=()=>es("text");w("source-cancel").onclick=()=>Ur();w("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Ur())};w("source-submit").onclick=async()=>{if(Ut||oe||et==="view"&&fe||w("source-dialog").hidden||et==="view")return;Ut=!0,Zn();const e=++en,t=et;Ei=new AbortController;try{const n=et==="url"?new URL(Xn().value.trim()).href:Xn().value.trim();if(t==="url"&&E.document?.source?.kind==="url"&&E.document.source.url===n){Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Oi(),Se(),ti();return}const i=t==="url"?await Di(n,Ei.signal):Vd(Mt().value),o=i.markdown;if(e!==en)return;const s=Dn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await ei(s))return;Re(""),t==="text"&&(Vi=o),Oi()}catch(n){e===en&&!(n instanceof Ln)&&Re("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===en&&(Ut=!1,Zn())}};w("layout-lock").onclick=()=>{ie||(st.cancel(),Me=void 0,pe(),vt=!vt,tt(),sn())};w("selected-edges-only").onchange=()=>{const e=X();!e||ie||oe||fe===e||(st.cancel(),Me=void 0,pe(),e.selectedEdgesOnly=w("selected-edges-only").checked,Jn(),be())};w("show-exceptions").onchange=()=>{const e=X();!e||ie||oe||fe===e||(st.cancel(),Me=void 0,pe(),e.showExceptions=w("show-exceptions").checked,Jn(),be())};w("prefer-write").onchange=()=>{ie||(pe(),E.preferWrite=w("prefer-write").checked,sn(),be())};w("theme").onclick=()=>{ie||(E.dark=!E.dark,tt(),be())};w("drawer").onclick=()=>{ie||!X()||(pe(),E.drawer=!E.drawer,Se(),be())};for(const[e,t]of[["in",bs],["out",1/bs]])w(e).onclick=()=>{const n=X();if(n&&fe!==n){const i=pe(),o=Oa({zoom:n.zoom,scroll:n.scroll},t).zoom,s=i||o!==n.zoom;n.zoom=o,Se(),be(180,s)}};const ve=w("viewport");function Vr(e,t){const n=X();if(!n||oe||fe===n)return;pe();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Rt();const o=Array.from(w("nodes").children).find(s=>s.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),Jn()}const Zt=Ma({read:()=>{const e=X();return e&&!oe&&e!==fe&&!vt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>X()?.positions[e],connected:e=>Array.from(w("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=ve.getBoundingClientRect(),t=e.left+ve.clientLeft,n=e.top+ve.clientTop,i={left:t,top:n,right:t+ve.clientWidth,bottom:n+ve.clientHeight};for(const[s,c]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=w(s),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=i.bottom||(c==="right"&&a.left>i.left&&a.left<i.right&&(i.right=a.left),c==="left"&&a.right>i.left&&a.right<i.right&&(i.left=a.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:Vr,pan:e=>{const t=X();if(!t||t===fe||vt)return;pe();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Lt(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],pe(),Rt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),st=Ca(ve,{nodeDrag:Zt,read:()=>{const e=X();return e&&!oe&&fe!==e?{key:e.key,zoom:e.zoom,locked:vt,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},position:e=>X()?.positions[e],change:e=>{const t=X();if(!t||oe||fe===t)return;const n=t.scroll;let i=!1;e.node&&Vr(e.node.id,e.node.position),e.selected&&(nt().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Nn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?sn():e.zoom!==void 0&&Lt(t),e.scroll&&(ve.scrollLeft=e.scroll[0],ve.scrollTop=e.scroll[1]),pe(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Rt()},finish:()=>{const e=X();e&&Lt(e),pe(),be(180,!1)}}),ss=()=>{st.cancel(),Me=void 0,pe(),be(0,!1)};window.addEventListener("blur",ss);window.addEventListener("pagehide",ss);document.addEventListener("visibilitychange",()=>{document.hidden&&ss()});ve.onscroll=()=>{pe()};let Me;ja(ve,{read:()=>{const e=X();return e&&!ie&&!oe&&e!==fe?{zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},change:e=>{const t=X();!t||oe||t===fe||(st.cancel(),Zt.cancel(),Me=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Lt(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],pe(!1),Rt(),be(180,!1))}});ve.onpointerdown=e=>{const t=X(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||oe||t===fe||n&&!vt||(Me={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[ve.scrollLeft,ve.scrollTop],node:n,moved:!1},ve.setPointerCapture(e.pointerId))};ve.onpointermove=e=>{if(Me&&Me.pointer===e.pointerId&&Me.key===X()?.key&&X()!==fe){const t=e.clientX-Me.x,n=e.clientY-Me.y;Math.hypot(t,n)>3&&(Me.moved=!0),ve.scrollLeft=Me.scroll[0]-t,ve.scrollTop=Me.scroll[1]-n,pe()}};ve.onpointerup=e=>{if(!Me||Me.pointer!==e.pointerId)return;const t=X(),n=Me;Me=void 0,ve.hasPointerCapture?.(e.pointerId)&&ve.releasePointerCapture(e.pointerId),t&&t!==fe&&n.key===t.key&&!n.moved&&n.node&&(nt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Rt()),Nn(n.node),sn()),pe(),be(180,!1)};ve.onpointercancel=()=>{Me=void 0};ve.addEventListener("lostpointercapture",e=>{e.target===ve&&Me?.pointer===e.pointerId&&(Me=void 0)});let Gi=!1;w("resize").onpointerdown=e=>{ie||(Gi=!0,w("resize").setPointerCapture(e.pointerId))};w("resize").onpointermove=e=>{if(Gi){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==E.width&&(E.width=t,Rt()),tt()}};w("resize").onpointerup=()=>{Gi=!1,be(180,!1)};w("resize").onpointercancel=()=>{Gi=!1,be(180,!1)};w("resize").onkeydown=e=>{if(!ie&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,E.width+(e.key==="ArrowLeft"?20:-20)));t!==E.width&&(E.width=t,Rt()),tt(),be(180,!1)}};window.addEventListener("resize",()=>{tt();const e=X();e&&Lt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=X();t&&Lt(t)});e.observe(w("viewport")),e.observe(document.querySelector(".toolbar"))}function hi(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=bn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Cn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Pn=document.createElement("section");Pn.id="source-update-notice";Pn.className="info-bar";Pn.hidden=!0;Pn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Pn);let fn;const Br=new Set;let co=0,Do,lo;function Hi(){const e=E.document;Pn.hidden=!fn||fn.key!==e?.key||fn.baseline!==e.design.markdown||Br.has(e.key),w("source-update-refresh").disabled=ie||Le||oe||!!(e&&zt.has(e.key))}w("source-update-close").onclick=()=>{fn&&Br.add(fn.key),Hi()};w("source-update-refresh").onclick=()=>{w("refresh").click()};async function ti(){const e=E.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(lo===t)return;lo=t;const n=++co,i=e.key,o=e.source.url,s=e.design.markdown;try{const c=await Vo(o);if(n!==co||E.document?.key!==i||E.document.design.markdown!==s||E.document.source?.kind!=="url"||E.document.source.url!==o)return;bn(c),fn=c.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:s}:void 0,Hi()}catch{}finally{n===co&&(lo=void 0)}}Fe=zc(mt,{rightDrawer:{isOpen:()=>E.drawer,isReady:()=>!ie,setOpen:e=>{ie||(E.drawer=e,tt(),be())}},capture:()=>{pe(),st.cancel(),Me=void 0},business:()=>({key:E.document?.key,design:E.document?.design,relatedChecks:E.tabs[0]?hd(E.tabs[0]):[],viewKey:X()?.key,views:E.tabs.map(e=>({key:e.key,name:e.name,activity:ki(e),object:Ii(e)})),activities:E.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:E.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:E.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!E.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=E.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Mo(e),bi(e)},openObject:e=>{Wr(e),bi(e)},openOverview:()=>{E.tabs[0]&&(pe(),Fe?.reopenBusinessOverview(),E.active=E.tabs[0].key,Se(),be())},activateView:e=>{E.tabs.some(t=>t.key===e)&&(pe(),E.active=e,Se(),be())},statePanel:e=>E.document?Vc(E.document.design,e,t=>{Fe?.activateBusiness(),Mo(t),bi(t),Fe?.businessActivated()}):void 0,closeLegacyList:()=>{E.nodeDrawer=!1,tt()},refresh:()=>{tt(),So.update()}});const xl=E;Se();_e();Yc().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])hi(l);if(t.document){const l={...t.document};hi(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)hi(l)}const n=id(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const l of i.tabs)hi(l);if(new Set(i.tabs.map(l=>l.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(r=>typeof r=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(r=>Number.isFinite(r)&&r>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:s,scopeOutside:c,...d}=i,a=l=>({...l,hiddenNodes:l.hiddenNodes??(i.scopeOutside==="hide"?l.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});E=nn({...d,tabs:i.tabs.map(a)},n.recovery,n.document,i.tabs.map(l=>{const{design:r,checks:f,source:u,draft:b,edited:g,handle:p,name:m,...I}=a(l);return I})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(E.sampleLayout={...i.sampleLayout,hiddenNodes:bn(Go).graph.nodes.filter(l=>!l.scope).map(l=>l.id)}),E.tabs.some(l=>l.key===E.active)||(E.active=E.tabs[0]?.key),X()?.selected&&Nn(X().selected),Do=E.document?.key,Se(),Ho=!0}).catch(()=>{E=xl,jn=!0,_o()}).finally(()=>{ie=!1,Se(),_e(),ts().then(()=>{E.document?.key===Do&&ti()})});
