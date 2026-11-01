import{L as Bs,D as na,G as oa,W as ia,P as sa,l as wt,X as Gs,C as ra,n as aa,S as Sn,o as Hs,p as _s,q as Js,M as Ks,s as Xs,t as Zs,u as Li,g as Ri,r as ci,d as Ys,b as vo,v as Di,U as Qs,w as ca,x as er,y as tr,z as di,A as da,m as Ni,B as la,E as nr,F as ua,j as fa,H as us,I as pa,T as ma,J as ha,K as ba,R as ga,N as ya,O as va,Q as wa,V as ka,Y as Ia,_ as Sa,Z as fs,k as xa,i as Aa,h as Ea,f as Oa,a as Ca,$ as ja,a0 as Ma,a1 as or,a2 as La,a3 as Ra,e as Da}from"./canvas-toolbar-DuA_31SG.js";const Na={subsystems:{full:"サブシステム",icon:sa},business:{full:"業務設計",icon:ia},states:{full:"状態遷移",icon:oa},concept:{full:"データ構造",icon:na},tests:{full:"テスト仕様",icon:Bs}};function li(e,t,n){const o=Na[t],i=document.createElement("span"),s=document.createElement("span"),c=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(wt(o.icon,{"aria-hidden":"true","stroke-width":1.8})),c.className="view-tab-name",c.textContent=n,i.append(s,c),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function ui(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(wt(Gs,{"aria-hidden":"true","stroke-width":1.8})),t}function Pa(e){const t=wt(e?ra:aa,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Ta(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,c=Math.max(0,Math.min(n,s+o*i));c!==s&&(e.scrollLeft=c,t.preventDefault())},{passive:!1})}function qa(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const Wa=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function ps(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=Wa,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const c=wt(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&c.classList.add(s),t.querySelector(o)?.append(c)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",Hs),n(".layout-lock",_s,"lock-closed"),n(".layout-lock",Js,"lock-open"),n(".zoom-out",Ks),n(".zoom-in",Xs)}function ms(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))t.querySelector("svg")||t.append(wt(Sn,{"aria-hidden":"true","stroke-width":1.8}))}function za({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(r=>r.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),o=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(r=>["",r]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:a.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),i=a=>o.find(l=>l.id===a),s=(a,l)=>{const r=Object.fromEntries(a.nodes.map(h=>[h.id,{...l[h.conceptId],name:h.name,note:h.description,sources:h.sources,conceptId:h.conceptId,subsystemId:h.subsystemId,fields:h.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(h=>a.nodes.some(g=>g.subsystemId===h.id)).map(h=>({id:h.id,name:h.name})),u=a.handoffIds.map(h=>e.handoffs.find(g=>g.id===h)).map(h=>({id:h.id,from:h.fromSubsystemId,to:h.toSubsystemId,label:h.information,returning:h.flowDirection==="return"}));return{ids:a.nodes.map(h=>h.id),tables:r,edges:a.edges.map(h=>[h.fromViewId,h.toViewId,h.fromLabel,h.toLabel,h.kind]),regions:f,handoffs:u}};return{tables:t,edges:n,groups:o,findGroup:i,graph:a=>{const l=i(a);if(!l)throw Error("Unknown review group: "+a);const r=e.reviewGroups.find(h=>h.id===a),f=r.graph.subsystemViews;if(f)return s(f,l.concepts);const u=Object.keys(t).filter(h=>Object.hasOwn(l.concepts,h));return{ids:u,tables:l.concepts,edges:l.relations.filter(([h,g])=>u.includes(h)&&u.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function Ye(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Ua(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",o.append(wt(Sn,{"aria-hidden":"true","stroke-width":1.8})),Ye(o,"span",t),o.onclick=n,e.append(o),o}function $a(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Fa(e,t,n,o=()=>{},i=()=>{},s=[]){const c=n.contentFor(t.id);if(e.replaceChildren(),!c)return;Ye(e,"p",c.description).className="review-description",Ye(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of c.relatedActivities){const l=document.createElement("li"),r=s.find(u=>u.id===a.id&&u.name===a.name),f=Ua(l,a.name,()=>{r&&i(r.id)});f.disabled=!r,f.setAttribute("aria-label",a.name+"を業務タブで開く"),f.querySelector("svg")?.setAttribute("data-icon","square-arrow-out-up-right"),f.append(f.querySelector("svg")),d.append(l)}e.append(d),Ye(e,"h3","情報の構造");for(const a of c.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=a.id,Ye(l,"h4",a.title),Ye(l,"p",a.description),e.append(l)}Ye(e,"h3","できること");for(const a of c.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=a.id,Ye(l,"h4",a.title),Ye(l,"p",a.description);for(const r of a.samples){const f=o(a.id,r.id),u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=r.id,u.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?u.onclick=f.open:(u.disabled=!0,u.title="対応するテスト仕様へのリンクがありません"),l.append(u)}e.append(l)}Ye(e,"h3","できないこと（業務上のルール）");for(const a of c.limitations){const l=document.createElement("section");l.className="review-limitation",Ye(l,"h4",a.title),Ye(l,"p",a.description),Ye(l,"h5","理由"),Ye(l,"p",a.reason),e.append(l)}}function Ht(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function Va({model:e,business:t}){const n=c=>c.kind==="group"?e.subsystems.find(d=>d.id===c.id):e.handoffs.find(d=>d.id===c.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(c){const d=n(c);return d?d.activityIds.map(a=>t.activities.find(l=>l.id===a)).filter(Boolean):[]}function s(c,d){if(c.replaceChildren(),d.kind==="group"){const f=e.subsystems.find(h=>h.id===d.id);if(!f)return"";Ht(c,"p",f.purpose),Ht(c,"h3","扱う情報");const u=c.ownerDocument.createElement("ul");for(const h of f.information)Ht(u,"li",h);return c.append(u),Ht(c,"h3","まとまりの理由"),Ht(c,"p",f.reason),f.name}const a=e.handoffs.find(f=>f.id===d.id);if(!a)return"";Ht(c,"p",a.description),Ht(c,"h3","出元と受取先");const l=e.subsystems.find(f=>f.id===a.fromSubsystemId),r=e.subsystems.find(f=>f.id===a.toSubsystemId);return Ht(c,"p",`${l.name} → ${r.name}`),a.information}return{sections:o,activities:i,describe:s}}function hs(e,t,n){const o=document.createElement("div");o.className="concept-drawer-resize",o.tabIndex=0,o.setAttribute("role","separator"),o.setAttribute("aria-orientation","vertical"),o.setAttribute("aria-label","補足情報の幅"),e.prepend(o);let i=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(i=d)}catch{}const s=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},c=(d,a=!1)=>{if(i=Math.max(280,Math.min(s(),d)),e.style.setProperty("--concept-drawer-width",i+"px"),o.setAttribute("aria-valuemin","280"),o.setAttribute("aria-valuemax",String(s())),o.setAttribute("aria-valuenow",String(Math.round(i))),a)try{sessionStorage.setItem(n,String(i))}catch{}};if(o.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),c(d.key==="Home"?280:d.key==="End"?s():i+(d.key==="ArrowLeft"?40:-40),!0))},o.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,l=i;o.setPointerCapture(d.pointerId),o.classList.add("resizing"),o.onpointermove=r=>c(l+a-r.clientX),o.onpointerup=()=>{o.onpointermove=null,o.onpointerup=null,o.onpointercancel=null,o.classList.remove("resizing"),c(i,!0)},o.onpointercancel=o.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>c(i));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>c(i)),c(i)}const Ba=260,Ga=68,Ha="http://www.w3.org/2000/svg",It=(e,t,n={})=>{const o=e.createElementNS(Ha,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function _a(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(wt(Qs,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Ja(e,{model:t,business:n},o,i,s){const c=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(k=>{const x=c.find(D=>D.id===k.from),R=c.find(D=>D.id===k.to);if(!x||!R||x.subsystemId!==R.subsystemId||!t.presentation.reviewBoundaries.some(D=>D.from===k.from&&D.to===k.to))throw Error("Unknown overview relationship: "+k.from+" -> "+k.to);return k}),l=t.handoffs.map(k=>{if(!["forward","return"].includes(k.flowDirection))throw Error("Unknown overview handoff direction: "+k.id);return{id:k.id,from:k.fromSubsystemId,to:k.toSubsystemId,label:k.information,returning:k.flowDirection==="return"}});if(new Set(l.map(k=>k.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const k of l)if(!d.some(x=>x.id===k.from)||!d.some(x=>x.id===k.to)||k.from===k.to||!k.label.trim())throw Error("Unknown overview handoff: "+k.id);for(const k of c){if(!d.some(x=>x.id===k.subsystemId))throw Error("Unknown overview subsystem: "+k.id);if(!n.roles?.some(x=>x.id===k.reviewer.roleId))throw Error("Unknown overview reviewer: "+k.id)}const r=d.flatMap(k=>c.filter(x=>x.subsystemId===k.id)),f=new Map;let u=0;for(const[k,x]of d.entries())for(const R of r.filter(D=>D.subsystemId===x.id))f.set(R.id,[80+u*170,100+u*120+k*64]),u++;const h=Li(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let p,m;try{const k=JSON.parse(localStorage.getItem(g)||"null"),x=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),R=!k&&x?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,D=k??R;if(D){typeof D.zoom=="number"&&Number.isFinite(D.zoom)&&(h.zoom=Math.max(.25,Math.min(2.5,D.zoom))),Array.isArray(D.scroll)&&D.scroll.length===2&&D.scroll.every(M=>typeof M=="number"&&Number.isFinite(M))&&(h.scroll=D.scroll),typeof D.locked=="boolean"&&(h.locked=D.locked);for(const[M,B]of Object.entries(D.positions??{}))c.some(T=>T.id===M)&&Array.isArray(B)&&B.length===2&&B.every(T=>typeof T=="number"&&Number.isFinite(T))&&h.positions.set(M,[B[0],B[1]])}const I=D?.selection,P=I?.kind==="node"?t.concepts.find(M=>M.id===I.id)?.subsystemId:I?.id,N=I?.kind==="node"?"group":I?.kind;typeof P=="string"&&(N==="model"&&c.some(M=>M.id===P)||N==="group"&&d.some(M=>M.id===P)||N==="connection"&&l.some(M=>M.id===P))&&(m={kind:N,id:P}),m?.kind==="model"&&(h.selected=m.id)}catch{}const S=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:h.zoom,scroll:h.scroll,locked:h.locked,positions:Object.fromEntries(h.positions),selection:m}))}catch{}},C=k=>{if(!k&&!m)return;m=k,h.selected=k?.kind==="model"?k.id:void 0;const x=p?.querySelector(".diagram-world>svg");x&&y(x),S()},y=k=>{const x=vo(a,h.selected),R=vo(l,m?.kind==="group"?m.id:void 0);for(const D of c){const I=k.querySelector(`[data-node="${D.id}"]`);I?.setAttribute("class","node graph-shape state-shape"+x.nodeClasses(D.id)),I?.setAttribute("aria-pressed",String(h.selected===D.id))}for(const D of d){const I=k.querySelector(`[data-subsystem="${D.id}"]`);I?.setAttribute("class","subsystem-overview-group"+R.nodeClasses(D.id)),I?.querySelector("button")?.setAttribute("aria-pressed",String(m?.kind==="group"&&m.id===D.id))}for(const D of a){const I=k.querySelector(`[data-overview-from="${D.from}"][data-overview-to="${D.to}"]`);I?.setAttribute("class","edge"+(x.related(D)?" review-related":"")),I?.setAttribute("marker-end",`url(#overview-${x.related(D)?"related-arrow":"arrow"})`)}for(const D of l){const I=R.related(D)||m?.kind==="connection"&&m.id===D.id,P=k.querySelector(`[data-handoff-id="${D.id}"]`);P?.setAttribute("class","edge"+(D.returning?" exception":"")+(I?" review-related":"")),P?.setAttribute("marker-end",`url(#overview-${I?"related-arrow":"arrow"})`),k.querySelector(`[data-handoff-label="${D.id}"]`)?.classList.toggle("review-related",!!I)}k.querySelectorAll("[data-exception-paint]").forEach(D=>D.remove());for(const D of Array.from(k.querySelectorAll("[data-handoff-id].exception")))Di(k,D,{path:D.getAttribute("d")},{"data-overview-return-paint":D.getAttribute("data-handoff-id")})};return p=Zs(e,k=>{const x=r.map(N=>{const M=k.positions.get(N.id)??f.get(N.id);return{id:N.id,x:M[0],y:M[1],width:Ba,height:Ga}}),R=It(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});R.append(Ri("overview-"));let D=0,I=0;const P=[];for(const N of d){const M=x.filter(he=>c.find(Se=>Se.id===he.id)?.subsystemId===N.id);if(!M.length)continue;const B=Math.min(...M.map(he=>he.x))-30,T=Math.min(...M.map(he=>he.y))-48,ie=Math.max(...M.map(he=>he.x+he.width))-B+30,Q=Math.max(...M.map(he=>he.y+he.height))-T+30;P.push({id:N.id,x:B,y:T,width:ie,height:Q});const ee=It(e,"g",{"data-subsystem":N.id,"aria-label":N.name}),ae=It(e,"rect",{x:B,y:T,width:ie,height:Q,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});ae.addEventListener("click",()=>C({kind:"group",id:N.id})),ee.append(ae);const le=It(e,"foreignObject",{class:"subsystem-overview-region-heading",x:B+8,y:T+3,width:ie-16,height:36}),Oe=e.createElement("button");Oe.type="button",Oe.className="subsystem-overview-region-title",Oe.setAttribute("aria-label",N.name+"を選択"),Oe.textContent=N.name,Oe.onclick=()=>C({kind:"group",id:N.id}),le.append(Oe),ee.append(le),R.append(ee),D=Math.max(D,B+ie+40),I=Math.max(I,T+Q+40)}for(const[N,M]of l.entries()){if(!P.some(ee=>ee.id===M.from)||!P.some(ee=>ee.id===M.to))throw Error("Missing overview handoff region: "+M.id);const B=Math.max(30,M.label.length*12),T=ci({from:M.from,to:M.to,nodes:P,index:N,kind:"input",matrix:{returning:M.returning,captionLane:0},labelWidth:B,labelHeight:18}),ie=It(e,"path",{d:T.path,class:"edge"+(M.returning?" exception":""),"data-handoff-id":M.id,"data-from-subsystem":M.from,"data-to-subsystem":M.to,"data-flow-direction":M.returning?"return":"forward","marker-end":"url(#overview-arrow)"});R.append(ie);const Q=It(e,"text",{x:T.label[0]-B/2,y:T.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":M.id});Q.textContent=M.label,Q.addEventListener("pointerdown",ee=>ee.stopPropagation()),Q.addEventListener("pointerup",ee=>ee.stopPropagation()),Q.addEventListener("click",()=>C({kind:"connection",id:M.id})),Q.addEventListener("keydown",ee=>{(ee.key==="Enter"||ee.key===" ")&&(ee.preventDefault(),C({kind:"connection",id:M.id}))}),R.append(Q),D=Math.max(D,T.bounds.right+40,T.label[0]+B/2+30),I=Math.max(I,T.bounds.bottom+40,T.label[1]+30)}for(const[N,M]of a.entries()){const B=ci({from:M.from,to:M.to,nodes:x,index:N,kind:"input",labelWidth:0,labelHeight:0}),T=It(e,"path",{d:B.path,class:"edge","data-overview-from":M.from,"data-overview-to":M.to,"marker-end":"url(#overview-arrow)"});R.append(T),D=Math.max(D,B.bounds.right+40),I=Math.max(I,B.bounds.bottom+40)}for(const N of x){const M=c.find(Se=>Se.id===N.id),B=n.roles.find(Se=>Se.id===M.reviewer.roleId),T=It(e,"g",{role:"button",tabindex:0,"aria-label":M.title+"を選択","aria-pressed":"false","data-node":N.id,"data-review-group":N.id,"data-subsystem-id":M.subsystemId,class:"node graph-shape state-shape"}),ie=Ys(e,N);ie.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),T.append(ie,It(e,"rect",{x:N.x,y:N.y,width:N.width,height:N.height,rx:8,class:"state-diagram-node"}));const ee=It(e,"foreignObject",{x:N.x,y:N.y,width:N.width,height:N.height}),ae=e.createElement("div");ae.className="subsystem-overview-card";const le=_a(e,B.color),Oe=e.createElement("span");Oe.className="subsystem-overview-labels",Oe.title=M.title+" — "+B.name;for(const[Se,L,W]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",M.title],["small","subsystem-overview-role",B.name]]){const U=e.createElement(Se);U.className=L,U.textContent=W,Oe.append(U)}const he=e.createElement("button");he.type="button",he.className="subsystem-overview-open",he.setAttribute("aria-label",M.title+"の詳細タブを開く"),he.title="詳細タブを開く",he.append(e.importNode(wt(Sn,{"aria-hidden":"true","stroke-width":1.8}),!0)),he.onpointerdown=Se=>Se.stopPropagation(),he.onpointerup=Se=>Se.stopPropagation(),he.onclick=Se=>{Se.stopPropagation(),i(M.id)},ae.append(le,Oe,he),ee.append(ae),T.append(ee),T.addEventListener("click",()=>C({kind:"model",id:N.id})),T.addEventListener("keydown",Se=>{(Se.key==="Enter"||Se.key===" ")&&(Se.preventDefault(),C({kind:"model",id:N.id}))}),R.append(T)}return R.setAttribute("viewBox",`0 0 ${D} ${I}`),y(R),R},h,S,()=>C(void 0)),p.classList.add("subsystem-overview-canvas"),p.addEventListener("click",S),p.addEventListener("pointerup",()=>queueMicrotask(S)),p.querySelector(".diagram-viewport")?.addEventListener("scroll",S),{root:p,selected:()=>h.selected,selection:()=>m,restore:()=>{const k=()=>{const x=p.querySelector(".diagram-viewport");x.scrollLeft=h.scroll[0],x.scrollTop=h.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(k):k()}}}function Ka(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(c=>c.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function Xa({model:e,business:t}){const n=g=>{const p=t.activities.find(m=>m.id===g);if(!p)throw Error("Unknown activity: "+g);return p},o=g=>{const p=t.roles?.find(m=>m.id===g);if(!p)throw Error("Unknown role: "+g);return p.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(p=>{const m=n(p);return{id:m.id,name:m.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(p=>({...p,samples:p.samples.map(Ka)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(p=>p.id===g),c=(g,p)=>s(g)?.capabilities.find(m=>m.samples.some(S=>S.id===p)),d=i.flatMap(g=>g.capabilities.flatMap(p=>p.samples.map(m=>({...m,group:g.id})))),a=["yellow","cyan","green","blue","purple","orange"];function l(g,p,m){let S=m.get(p);if(S||(S=a[m.size]??`extra-${m.size}`,m.set(p,S)),g.dataset.sampleKey=p,g.dataset.keyTone=S,g.className="data-example-key",S.startsWith("extra-")){const C=(Number(S.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${C} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${C} 24% 25%)`)}}const r=g=>d.filter(p=>p.group===g),f=(g,p)=>r(g).find(m=>m.id===p);function u(g,p,m){const S=g.ownerDocument.createElement(p);return S.textContent=m,g.append(S),S}function h(g,p,m,S,C){const y=g.ownerDocument,j=f(p.id,m);if(!j)throw Error("Unknown data example: "+m);g.replaceChildren(),g.dataset.dataExample=m;const k=new Map;e.presentation.sampleCaption&&(u(g,"p",e.presentation.sampleCaption).className="data-example-caption");const x=s(p.id)?.capabilities??[],R=C?.capabilityId?x.filter(M=>M.id===C.capabilityId):x;if(C?.capabilityId&&!R.some(M=>M.samples.some(B=>B.id===m)))throw Error("Sample does not belong to capability: "+m);const D=c(p.id,m);g.dataset.capability=D.id;const I=()=>{u(g,"h2",C?.heading?.trim()||D.title),C?.renderSpecification?C.renderSpecification(g):u(g,"p",D.description).className="data-example-capability"};C?.capabilityId&&!C.hideCapability&&I();const P=y.createElement("label");P.className="data-example-picker",u(P,"span","場面");const N=y.createElement("select");N.setAttribute("aria-label","データ例の場面");for(const M of R){let B=N;if(!C?.capabilityId){const T=y.createElement("optgroup");T.label=M.title,N.append(T),B=T}for(const T of M.samples){if(C?.sampleIds&&!C.sampleIds.includes(T.id))continue;const ie=y.createElement("option");ie.value=T.id,ie.textContent=T.name,B.append(ie)}}if(N.value=m,N.onchange=()=>S(N.value),P.append(N),(!C?.hideSinglePicker||N.options.length>1)&&g.append(P),!C?.capabilityId&&!C?.hideCapability&&I(),u(g,"h3",j.name).className="data-example-scene",C?.collapseScenario&&j.when){const M=y.createElement("details");M.className="data-example-context",u(M,"summary","場面の背景"),u(M,"p",j.when).className="data-example-when",g.append(M)}else u(g,"p",j.when).className="data-example-when";u(g,"p",j.meaning).className="data-example-meaning";for(const M of j.blocks){const B=y.createElement("section");B.className="data-example-block",B.dataset.exampleCard=M.card,u(B,"h3",p.concepts[M.card].name);const T=y.createElement("div");T.className="data-example-table",T.tabIndex=0,T.setAttribute("role","region"),T.setAttribute("aria-label",p.concepts[M.card].name+"のデータ表");const ie=y.createElement("table");ie.setAttribute("aria-label",p.concepts[M.card].name+"のデータ例");const Q=y.createElement("caption");Q.textContent=p.concepts[M.card].name+"に入る情報",ie.append(Q);const ee=y.createElement("thead"),ae=y.createElement("tr");for(const Oe of M.columns)u(ae,"th",Oe).setAttribute("scope","col");ee.append(ae),ie.append(ee);const le=y.createElement("tbody");for(const[Oe,he]of M.rows.entries()){const Se=y.createElement("tr");for(const[L,W]of he.entries()){const U=u(Se,"td",String(W)),ce=M.keyIds[Oe][L];ce&&(l(U,ce,k),U.title=M.columns[L]+"："+W)}le.append(Se)}ie.append(le),T.append(ie),B.append(T),M.rows.length||u(B,"p",M.empty??"データはありません。"),g.append(B)}j.note&&(u(g,"p",j.note).className="data-example-note")}return{reviewContents:i,dataExamples:d,contentFor:s,capabilityFor:c,examplesFor:r,findDataExample:f,renderDataExample:h}}function Pi(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function Za(e,t,n){return Pi(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Ya(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function ln(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const c=(d,a)=>{for(const l of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const r=document.createElement("strong");r.textContent=l.slice(2,-2),d.append(r)}else if(l.startsWith("`")&&l.endsWith("`")){const r=document.createElement("code");r.textContent=l.slice(1,-1),d.append(r)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!o){o=a[1],s=void 0;const u=document.createElement("pre");i=document.createElement("code"),u.append(i),n.append(u);continue}if(a&&a[1][0]===o[0]&&a[1].length>=o.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(d+`
`));continue}if(!d.trim()){s=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(r){s||(s=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(s));const u=document.createElement("li");c(u,r[1]),s.append(u);continue}s=void 0;const f=document.createElement(l?"h"+l[1].length:"p");c(f,l?l[2]:d),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const ke={type:"string"},H={type:"string",minLength:1,pattern:"\\S"},z={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Yt=e=>({anyOf:[e,{type:"null"}]}),_=e=>({type:"array",items:e}),Z=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Qa=e=>({$ref:"#/$defs/"+e}),yn=_({anyOf:[Z({kind:{enum:["text"]},value:ke}),Z({kind:{enum:["reference"]},targetId:z,label:ke}),Z({kind:{enum:["link"]},uri:H,label:ke})]}),bs=Z({id:z,name:H,scope:{type:"boolean"}}).properties,ec=Z({id:z,kind:{enum:["input","output","business-exception","object-exception"]},fromId:z,toId:z,label:H}),tc=Z({id:z,sourceId:z,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:_(z),unresolvedTargets:_(H),summary:H,content:H}),fi=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:H,title:H,preface:ke,scope:ke,objects:_(Z({...bs,icon:H,information:_(H)})),activities:_(Z({...bs,why:H,when:H,who:H,where:H,procedure:H,exception:Yt(H),result:H,problem:Yt(H),painLevel:Yt({enum:["Low","Medium","High"]})})),relations:_(ec),findings:_(tc)}),nc=Z({id:z,name:H,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),ir=Z({...fi.properties,schemaVersion:{enum:["0.2"]},roles:_(nc),activities:_(Z({...fi.properties.activities.items.properties,roleId:Yt(z)}))}),oc=Z({...ir.properties,schemaVersion:{enum:["0.3"]},exceptions:_(Z({id:z,activityId:z,name:H,description:ke}))}),ic=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,yn])),sc=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:H,title:H,basedOn:Z({documentId:z,revision:H,verification:{enum:["unverified"]}}),intro:yn,index:_(Z({activityId:z,purpose:ke,connections:ke,checkIds:_(z)})),sections:_(Z({id:z,activityId:Yt(z),title:H,preamble:yn})),guarantees:_(Z({id:z,sectionId:z,title:H,blocks:_({anyOf:[Z({kind:{enum:["prose"]},content:yn}),Z({kind:{enum:["example"]},exampleId:z})]})})),examples:_(Z({id:z,guaranteeId:z,columns:_(H),rows:_(_(yn))})),items:_(Z({id:z,checkId:z,title:H,detailSummary:ke,sectionId:z,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:Z(ic,[])})),notes:_(Z({id:z,title:H,content:yn}))}),Ti=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:H,title:H,basedOn:Z({documentId:z,revision:H,verification:{enum:["unverified"]}}),objectId:z,states:_(Z({id:z,name:H})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:H,transitions:_(Z({id:z,sourceId:H,fromId:H,activityId:z,event:Yt(H),exception:Yt(H),condition:H,toId:H,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:H,note:H}))}),gs=Object.fromEntries(Object.entries({...Ti.properties.transitions.items.properties,exceptionId:Yt(z)}).filter(([e])=>e!=="exception")),rc=Z({...Ti.properties,schemaVersion:{enum:["0.2"]},transitions:_(Z({...gs,conditionLabel:H},Object.keys(gs)))}),qi=Z({documentId:z,revision:H,targetType:H,targetId:z,section:H}),ac=Z({id:z,name:H,responsibilityStatus:H,responsibleSubsystemId:z},["id","name"]),cc=Z({id:z,name:H,subsystemId:z,information:_(ac),reason:ke,description:ke,businessObjectIds:_(z),activityLinks:_(Z({activityId:z,uses:_(H)})),sourceRefs:_(qi),reviewState:H}),dc=Z({id:z,fromConceptId:z,toConceptId:z,fromPerTarget:H,toPerSource:H,condition:ke,reviewState:H,sourceRefs:_(qi),fromLabel:H,toLabel:H,kind:{enum:["down","reference"]}}),lc=Z({id:z,name:H,purpose:ke,information:_(H),reason:ke,activityIds:_(z),reviewState:H}),uc=Z({id:z,fromSubsystemId:z,toSubsystemId:z,information:H,description:ke,activityIds:_(z),flowDirection:{enum:["forward","return"]},reviewState:H}),fc=Z({columnId:z,value:{anyOf:[ke,{type:"number"}]},linkId:H},["columnId","value"]),pc=Z({card:z,columns:_(Z({id:z,name:H,informationId:z})),rows:_(Z({id:z,cells:_(fc)})),empty:ke},["card","columns","rows"]),pi=Z({id:z,name:H,when:ke,meaning:ke,blocks:_(pc),note:ke},["id","name","when","meaning","blocks"]),mi=Z({id:z,title:H,description:ke,meta:{},samples:_(pi)}),mc=Z({...pi.properties,checkIds:{..._(z),minItems:1,uniqueItems:!0}},[...pi.required,"checkIds"]),hc=Z({decisionExampleIds:_(z),decisionCheckIds:_(z),resultCheckIds:_(z),sampleIds:_(z)}),bc=Z({...mi.properties,samples:_(mc),testSpecification:hc},[...Object.keys(mi.properties)]),gc=Z({id:z,title:H,description:ke,reason:ke,meta:{}}),yc=Z({conceptId:z,name:H,fields:_(H),description:ke,sources:_(H),sourceActivityIds:_(z)}),vc=Z({id:z,fromConceptId:z,toConceptId:z,relationIds:_(z),scope:ke,fromLabel:H,toLabel:H,kind:{enum:["down","reference"]}}),wc=Z({id:z,conceptId:z,subsystemId:z,name:H,description:ke,sources:_(H),fields:_(Z({name:H,informationId:z}))}),kc=Z({id:z,fromViewId:z,toViewId:z,relationIds:_(z),fromLabel:H,toLabel:H,kind:{enum:["down","reference"]}}),sr=Z({nodes:_(wc),edges:_(kc),handoffIds:_(z)}),rr=Z({id:z,subsystemId:z,title:H,description:ke,reviewer:Z({roleId:z}),relatedActivityIds:_(z),graph:Z({conceptIds:_(z),nodes:_(yc),edges:_(vc),subsystemViews:sr},["conceptIds","nodes","edges"]),structureStatements:_(Z({id:z,title:H,description:ke,sampleIds:_(z),sourceRefs:_(qi)})),capabilities:_(mi),limitations:_(gc),meta:Z({questions:_(H),hypotheses:{}},["questions"])}),Ic=Z({...rr.properties,capabilities:_(bc)}),ar=Z({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:H,basedOn:Z({documentId:z,revision:H,verification:{enum:["unverified"]}}),relatedStates:_(Z({documentId:z,revision:H,verification:{enum:["unverified"]}})),subsystems:_(lc),concepts:_(cc),relations:_(dc),handoffs:_(uc),reviewGroups:_(rr),benefits:_(H),considerations:_(H),reviewPoints:_(H),meta:{},presentation:Z({activityViews:{},creatorActivityIds:{},sampleCaption:ke,subsystemViews:sr,landscapeRelationships:_(Z({from:z,to:z})),reviewBoundaries:_(Z({from:z,to:z,label:ke,promise:ke}))},["landscapeRelationships","reviewBoundaries"])}),Sc=Z({...ar.properties,schemaVersion:{enum:["0.2"]},reviewGroups:_(Ic)}),ao=(e,t)=>Z({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:H,documents:_({anyOf:t.map(Qa)}),sources:_(Z({documentId:z,revision:H,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:ke})),externalDocuments:_(Z({id:z,kind:{enum:["businessDesign"]},revision:H,activities:_(Z({id:z,name:H}))})),diagnostics:_(H)}),ys={anyOf:[ao("0.1",["businessDesign","checkItems"]),ao("0.2",["businessDesign","checkItems","stateTransition"]),ao("0.3",["businessDesignRoles","checkItems","stateTransition"]),ao("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:fi,businessDesignRoles:ir,businessDesignStructured:oc,checkItems:sc,stateTransition:Ti,stateTransitionStructured:rc,conceptModel:ar,checkedConceptModel:Sc}},q=(e,t)=>{if(!e)throw Error(t)};function cr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const c=e[t++];if(c==='"')return JSON.parse(e.slice(s,t));c==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{q(s<=64,"JSON depth limit"),n();const c=e[t];if(c==='"'){o();return}if(c==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),q(e[t]==='"',"JSON object key required");const l=o();q(!a.has(l),"Duplicate JSON key: "+l),a.add(l),n(),q(e[t++]===":","JSON colon required"),i(s+1),n();const r=e[t++];if(r==="}")return;q(r===",","JSON comma required")}throw Error("Truncated object")}if(c==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const a=e[t++];if(a==="]")return;q(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;q(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return i(),n(),q(t===e.length,"Trailing JSON content"),JSON.parse(e)}function vn(e,t=ys,n="$"){if(t.$ref)return vn(e,ys.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{vn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&q(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;q(o===t.type,"Invalid type at "+n)}if(t.minLength&&q(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&q(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])q(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))q(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),vn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>vn(o,t.items,n+"["+i+"]"))}function xc(e){const t=new Map,n=new Map,o=new Map,i=(s,c,d)=>{q(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,c.id),o.set(s.id,d)};for(const s of e.documents){i(s,s,"document");for(const[c,d]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const a of s[c]??[])i(a,s,d)}for(const s of e.externalDocuments){i(s,s,"document");for(const c of s.activities)i(c,s,"activity")}return{map:t,owner:n,types:o}}function hi(e){return vn(e),dr(e)}function xn(e,t){const n=new Set(e.items.map(c=>c.id)),o=new Set,i=e.guarantees.find(c=>c.id===t.guaranteeId),s=c=>{if(Array.isArray(c)){for(const d of c)s(d);return}if(c&&typeof c=="object"){c.kind==="reference"&&n.has(c.targetId)&&o.add(c.targetId);for(const d of Object.values(c))d&&typeof d=="object"&&s(d)}};s(t.rows);for(const c of i?.blocks??[])c.kind==="prose"&&s(c.content);for(const c of e.items)(c.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&o.add(c.id);return[...o]}function dr(e,{allowUnresolvedFindings:t=!1}={}){q(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=xc(e),s=[...e.diagnostics],c=new Set;for(const u of e.sources)if(u.uri){const h=new URL(u.uri);q(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const d=(u,h,g)=>(q(n.has(u),"Dangling reference: "+u),h&&q(i.get(u)===h,"Reference type mismatch: "+u),g&&q(o.get(u)===g,"Cross-document mismatch: "+u),n.get(u)),a=u=>u?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),l=(u,h)=>{for(const g of u)if(g.kind==="reference"&&(d(g.targetId,null,h),q(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const p=new URL(g.uri);q(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const u of e.documents)if(q(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){q(u.activities.length>0,"Activity required");const h=[...u.objects,...u.activities].map(m=>m.name);q(new Set(h).size===h.length,"Duplicate visible name"),q(h.every(m=>m===m.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(S=>m.includes(S))),"Invalid Graph-visible name");for(const m of u.objects)q(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){q(new Set(u.roles.map(m=>m.name)).size===u.roles.length,"Duplicate Role name"),q(u.roles.every(m=>m.name===m.name.trim()&&!/[\r\n]/.test(m.name)),"Invalid Role name");for(const m of u.activities)m.roleId!==null?d(m.roleId,"role",u.id):c.add("Role未確定: "+m.id+" — "+m.who)}for(const m of u.activities)q(m.problem===null==(m.painLevel===null),"Problem/Pain pair mismatch");for(const m of u.exceptions??[])d(m.activityId,"activity",u.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const m of u.relations){d(m.fromId,g[m.kind][0],u.id),d(m.toId,g[m.kind][1],u.id);const S=JSON.stringify([m.kind,m.fromId,m.toId,m.label]);q(!p.has(S),"Duplicate relation"),p.add(S)}q(new Set(u.findings.map(m=>m.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const m of u.findings){q(m.scope==="items"?m.targetIds.length+m.unresolvedTargets.length>0:!m.targetIds.length&&!m.unresolvedTargets.length,"Finding scope mismatch"),q(new Set(m.targetIds).size===m.targetIds.length,"Duplicate Finding target");for(const S of m.targetIds)d(S,null,u.id),q(["object","activity"].includes(i.get(S)),"Invalid Finding target");m.unresolvedTargets.length&&(q(t,"Unresolved Finding target: "+m.sourceId),s.push("Finding参照未決: "+m.sourceId))}}else if(u.kind==="stateTransition"){const h=d(u.basedOn.documentId,"document");q(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),q(h.revision===u.basedOn.revision,"Stale State source revision"),d(u.objectId,"object",h.id),q(!e.documents.some(p=>p!==u&&p.kind==="stateTransition"&&p.objectId===u.objectId),"Duplicate Object state declaration"),q(u.states.length>0&&new Set(u.states.map(p=>p.name)).size===u.states.length,"Duplicate/empty state names"),q(u.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),q(u.transitions.length<=1e3,"State transition row budget"),q(new Set(u.transitions.map(p=>p.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const g=new Map;for(const p of u.transitions){p.fromId!=="@new"&&d(p.fromId,"state",u.id),["@unknown","@none"].includes(p.toId)||d(p.toId,"state",u.id);const m=d(p.activityId,"activity",h.id),S=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(q(!g.has(S),"Duplicate state transition condition: "+g.get(S)+" / "+p.sourceId),g.set(S,p.sourceId),e.formatVersion==="0.4")if(q(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const C=d(p.exceptionId,"exception",h.id);q(C.activityId===m.id,"Exception Activity mismatch")}else p.path==="exception"&&q(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else q(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);q(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),q(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),q(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),q(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const h=d(u.basedOn.documentId,"document");q(h.kind==="businessDesign"&&h.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),q(!e.documents.some(I=>I!==u&&I.kind==="conceptModel"&&I.basedOn.documentId===h.id),"Duplicate Concept model for Business Design");const g=(I,P)=>{const N=new Map;for(const M of I)q(!N.has(M.id),"Duplicate "+P+" ID: "+M.id),N.set(M.id,M);return N},p=g(u.subsystems,"subsystem"),m=g(u.concepts,"concept"),S=g(u.relations,"concept relation"),C=g(u.reviewGroups,"review group"),y=g(u.handoffs,"handoff"),j=g(u.concepts.flatMap(I=>I.information),"concept information"),k=(I,P,N)=>(q(I.has(P),"Unknown "+N+": "+P),I.get(P)),x=I=>d(I,"activity",h.id),R=I=>{const P=d(I.documentId,"document");q(P.revision===I.revision,"Stale Concept source revision");const N=P.id===h.id,M=P.kind==="stateTransition"&&P.basedOn.documentId===h.id&&u.relatedStates.some(B=>B.documentId===P.id&&B.revision===P.revision);q(N||M,"Concept source must refer to its Business Design or a declared State"),d(I.targetId,I.targetType,P.id)};for(const I of u.relatedStates){const P=d(I.documentId,"document");q(P.kind==="stateTransition"&&P.revision===I.revision&&P.basedOn.documentId===h.id,"Invalid Concept state reference")}for(const I of u.subsystems)for(const P of I.activityIds)x(P);for(const I of u.concepts){k(p,I.subsystemId,"subsystem");for(const P of I.information)P.responsibleSubsystemId&&k(p,P.responsibleSubsystemId,"responsible subsystem");for(const P of I.businessObjectIds)d(P,"object",h.id);for(const P of I.activityLinks)x(P.activityId);for(const P of I.sourceRefs)R(P)}for(const I of u.relations){k(m,I.fromConceptId,"concept"),k(m,I.toConceptId,"concept");for(const P of I.sourceRefs)R(P)}for(const I of u.handoffs){k(p,I.fromSubsystemId,"subsystem"),k(p,I.toSubsystemId,"subsystem"),q(I.fromSubsystemId!==I.toSubsystemId,"Handoff must cross subsystem boundary");for(const P of I.activityIds)x(P)}const D=(I,P)=>{const N=g(I.nodes,"subsystem view"),M=g(I.edges,"subsystem view edge");for(const T of N.values()){k(P,T.conceptId,"view concept"),k(p,T.subsystemId,"subsystem");const ie=k(m,T.conceptId,"concept");for(const Q of T.fields)q(ie.information.some(ee=>ee.id===Q.informationId),"Unknown information for subsystem view: "+Q.informationId)}for(const T of M.values()){const ie=k(N,T.fromViewId,"subsystem view"),Q=k(N,T.toViewId,"subsystem view");q(ie.subsystemId===Q.subsystemId,"View relationship crosses subsystem boundary"),q(T.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ee=ie.conceptId;for(const ae of T.relationIds){const le=k(S,ae,"concept relation");q(le.fromConceptId===ee,"Subsystem view relation path is disconnected: "+ae),ee=le.toConceptId}q(ee===Q.conceptId,"Subsystem view relation target differs")}q(new Set(I.handoffIds).size===I.handoffIds.length,"Duplicate subsystem view handoff");const B=new Set([...N.values()].map(T=>T.subsystemId));for(const T of I.handoffIds){const ie=k(y,T,"handoff");q(B.has(ie.fromSubsystemId)&&B.has(ie.toSubsystemId),"Missing subsystem view handoff region: "+T)}};u.presentation.subsystemViews&&D(u.presentation.subsystemViews,m);for(const I of u.reviewGroups){k(p,I.subsystemId,"subsystem"),d(I.reviewer.roleId,"role",h.id);for(const B of I.relatedActivityIds)x(B);const P=g(I.graph.nodes.map(B=>({...B,id:B.conceptId})),"view concept");q(new Set(I.graph.conceptIds).size===I.graph.conceptIds.length&&I.graph.conceptIds.length===P.size&&I.graph.conceptIds.every(B=>P.has(B)),"View concepts and nodes differ");for(const B of I.graph.nodes){k(m,B.conceptId,"concept");for(const T of B.sourceActivityIds)x(T)}g(I.graph.edges,"view edge");for(const B of I.graph.edges){k(P,B.fromConceptId,"view concept"),k(P,B.toConceptId,"view concept");for(const T of B.relationIds)k(S,T,"concept relation")}I.graph.subsystemViews&&D(I.graph.subsystemViews,P);const N=g(I.capabilities,"capability"),M=g(I.capabilities.flatMap(B=>B.samples),"sample");g(I.limitations,"limitation"),g(I.structureStatements,"structure statement");for(const B of I.structureStatements){for(const T of B.sampleIds)k(M,T,"sample");for(const T of B.sourceRefs)R(T)}for(const B of N.values())if(B.testSpecification){const T=B.testSpecification;for(const[Q,ee]of Object.entries(T))q(new Set(ee).size===ee.length,"Duplicate function specification reference: "+Q);const ie=(Q,ee)=>{const ae=d(Q,ee),le=d(o.get(Q),"document");return q(le.kind==="checkItems"&&le.basedOn.documentId===h.id&&le.basedOn.revision===h.revision,"Function Check source mismatch: "+Q),{value:ae,doc:le}};for(const Q of[...T.decisionCheckIds,...T.resultCheckIds])ie(Q,"check");for(const Q of T.decisionExampleIds){const{value:ee,doc:ae}=ie(Q,"example"),le=xn(ae,ee);q(le.length>0,"Function decision table needs a Check: "+Q),q(le.every(Oe=>T.decisionCheckIds.includes(Oe)),"Function decision table Check is not assigned: "+Q)}for(const Q of T.sampleIds){const ee=B.samples.find(ae=>ae.id===Q);q(ee,"Function result sample belongs to another capability: "+Q),q(ee.checkIds.some(ae=>T.resultCheckIds.includes(ae)),"Function result sample needs a result Check: "+Q),q(ee.checkIds.every(ae=>T.resultCheckIds.includes(ae)||T.decisionCheckIds.includes(ae)),"Function result sample Check is not assigned: "+Q)}}for(const B of N.values())for(const T of B.samples){if(u.schemaVersion==="0.2"){q(T.checkIds.length>0,"Sample needs a Check: "+T.id),q(new Set(T.checkIds).size===T.checkIds.length,"Duplicate sample Check: "+T.id);for(const ie of T.checkIds){d(ie,"check");const Q=d(o.get(ie),"document");q(Q.kind==="checkItems"&&Q.basedOn.documentId===h.id&&Q.basedOn.revision===h.revision,"Sample Check source mismatch: "+ie)}}for(const ie of T.blocks){k(P,ie.card,"view concept");const Q=g(ie.columns,"sample column");for(const ee of ie.columns)k(j,ee.informationId,"concept information");g(ie.rows,"sample row");for(const ee of ie.rows){const ae=new Set;for(const le of ee.cells)k(Q,le.columnId,"sample column"),q(!ae.has(le.columnId),"Duplicate sample cell: "+le.columnId),ae.add(le.columnId);q(ae.size===Q.size,"Sample row does not match columns")}}}}for(const I of u.presentation.landscapeRelationships){const P=k(C,I.from,"review group"),N=k(C,I.to,"review group");q(P.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const I of u.presentation.reviewBoundaries)k(C,I.from,"review group"),k(C,I.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const h=d(u.basedOn.documentId,"document");q(h.kind==="businessDesign","Check source is not BD"),q(h.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),q(new Set(u.items.map(m=>m.checkId)).size===u.items.length,"Duplicate Check ID");const g=new Set;for(const m of u.index){d(m.activityId,"activity",h.id),q(!g.has(m.activityId),"Duplicate Activity index"),g.add(m.activityId),q(new Set(m.checkIds).size===m.checkIds.length,"Duplicate Check binding");for(const S of m.checkIds)d(S,"check",u.id)}q(new Set(u.sections.map(m=>m.activityId??m.title)).size===u.sections.length,"Duplicate Activity section");for(const m of u.sections)m.activityId!==null&&(d(m.activityId,"activity",h.id),q(g.has(m.activityId),"Section missing from index")),l(m.preamble,u.id);const p=new Set(e.documents.filter(m=>m.kind==="conceptModel"&&m.basedOn.documentId===h.id&&m.basedOn.revision===h.revision).flatMap(m=>m.reviewGroups.flatMap(S=>S.capabilities.flatMap(C=>C.testSpecification?.decisionExampleIds??[]))));for(const m of u.guarantees){const S=m.blocks.length>0&&m.blocks.every(C=>C.kind==="example"&&p.has(C.exampleId)&&u.examples.some(y=>y.id===C.exampleId&&y.guaranteeId===m.id&&xn(u,y).length>0));q(m.blocks.some(C=>C.kind==="prose"&&a(C.content))||S,"General guarantee prose required"),d(m.sectionId,"section",u.id);for(const C of m.blocks)if(C.kind==="prose")l(C.content,u.id);else{const y=d(C.exampleId,"example",u.id);q(y.guaranteeId===m.id,"Example owner mismatch")}}for(const m of u.examples){d(m.guaranteeId,"guarantee",u.id),q(m.columns.length>0,"Example columns required");for(const S of m.rows){q(S.length===m.columns.length,"Example column mismatch");for(const C of S)l(C,u.id)}}for(const m of u.items){const S=d(m.sectionId,"section",u.id);q(S.activityId===null?!u.index.some(C=>C.checkIds.includes(m.id)):u.index.some(C=>C.activityId===S.activityId&&C.checkIds.includes(m.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),q(a(m.fields.guarantee)||a(m.fields.condition)&&a(m.fields.expectedResult),"Check guarantee required");for(const C of Object.values(m.fields))l(C,u.id);q(S.activityId===null||u.index.some(C=>C.checkIds.includes(m.id)),"Unbound Check")}for(const m of u.notes)l(m.content,u.id);l(u.intro,u.id)}const r=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));q(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const u of r)q(c.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");q(c.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const u of e.sources){d(u.documentId,"document");const h=u.documentId+"@"+u.revision;q(!f.has(h),"Duplicate source descriptor"),f.add(h)}for(const u of e.externalDocuments)q(e.sources.some(h=>h.documentId===u.id&&h.revision===u.revision),"External source revision missing"),q(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:n.size}}const Y=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function vs(e,t,n){n!=null&&e.append(Y("h3",t),ln(n))}function Ac(e,t){if(e===null)return;const n=ln(e),o=s=>String(s??"").replace(/\s+/g,""),i=new Set(t.map(s=>o(ln(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))i.has(o(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const Ec={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Oc(e,t){const n=Y("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(d=>d.id===t),c=i.activities.find(d=>d.id===t);if(s){vs(n,"Scope",String(s.scope)),n.append(Y("h3","Information"));const d=Y("ul");for(const a of s.information)d.append(Y("li",a));n.append(d)}else if(c){const d=i.exceptions?.filter(r=>r.activityId===c.id)??[];for(const[r,f]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]])vs(n,r,f==="who"?Pi(e,c.id)?.name??c.who:c[f]===null?null:String(c[f]));const a=Ac(c.exception,d);if(a||d.length){const r=Y("section");r.dataset.businessVariations="",r.append(Y("h3","通常以外の扱い")),a&&r.append(a);for(const f of d)r.append(Y("h4",f.name),ln(f.description));n.append(r)}const l=new Map([...i.objects,...i.activities].map(r=>[r.id,r.name]));for(const[r,f]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const u=i.relations.filter(h=>h.kind===r&&(h.fromId===t||h.toId===t));if(u.length){n.append(Y("h3",f));for(const h of u)n.append(Y("p",`${l.get(h.fromId)} → ${l.get(h.toId)} — ${h.label}`))}}}else n.append(Y("p","項目を選択すると業務内容を表示します。"));return n}class Jn{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Y("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(ln(i.value));continue}if(i.kind==="text"){const a=Y("span",i.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(i.kind==="link"){t.append(Y("span",`${i.label} (${i.uri})`));continue}const s=Y("details"),c=Y("summary",i.label||i.targetId);s.append(c),t.append(s);let d=!1;s.addEventListener("toggle",()=>{if(!s.open||d)return;if(d=!0,o.has(i.targetId)){s.append(Y("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(Y("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(o).add(i.targetId),l=this.doc,r=l.guarantees.find(p=>p.id===i.targetId),f=l.examples.find(p=>p.id===i.targetId),u=l.items.find(p=>p.id===i.targetId),h=l.sections.find(p=>p.id===i.targetId),g=l.notes.find(p=>p.id===i.targetId);if(r){s.append(Y("h4",r.title));for(const p of r.blocks){if(!this.take(s))break;p.kind==="prose"?this.runs(s,p.content,a):this.example(s,p.exampleId,a)}}else if(f)this.example(s,f.id,a);else if(u){s.append(Y("p",`${u.checkId} · ${u.title}`+(this.requester?"":` · ${u.reviewState}`))),this.requester&&(u.reviewState==="要確認"||u.reviewState==="要修正")&&s.append(Y("p","確認が必要です。"));const p=this.requester?Object.fromEntries(Object.entries(u.fields).filter(([m])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(m))):u.fields;this.fields(s,p,a)}else h?(s.append(Y("h4",h.title)),this.runs(s,h.preamble,a)):g?(s.append(Y("h4",g.title)),this.runs(s,g.content,a)):i.targetId===l.id&&(s.append(Y("h4",l.title)),this.runs(s,l.intro,a))})}}fields(t,n,o,i=!1){for(const[s,c]of Object.entries(n)){if(!this.take(t))break;if(t.append(Y("h4",Ec[s]??s)),s==="guarantee"&&i){const d=new Set;for(const a of c){const l=a.kind==="reference"?this.doc.guarantees.find(f=>f.id===a.targetId):void 0;if(!l){this.runs(t,[a],o);continue}if(d.has(l.id))continue;d.add(l.id);const r=new Set(o).add(l.id);for(const f of l.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,c,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!xn(this.doc,s).length)return;const c=Y("table"),d=i?s.columns.indexOf("結果"):-1,a=d>0&&s.columns.at(-1)==="Check ID";if(a){const f=Y("colgroup");f.span=d,c.append(f);for(let m=d;m<s.columns.length;m++)c.append(Y("colgroup"));const u=Y("thead"),h=Y("tr"),g=Y("th","条件");g.colSpan=d,g.scope="colgroup",h.append(g);for(let m=d;m<s.columns.length;m++){const S=Y("th",s.columns[m]);S.rowSpan=2,S.scope="col",m===d?S.className="decision-result":s.columns[m]==="備考"&&(S.className="decision-notes"),h.append(S)}const p=Y("tr");for(const m of s.columns.slice(0,d)){const S=Y("th",m);S.scope="col",p.append(S)}u.append(h,p),c.append(u)}else{const f=Y("tr");for(const u of s.columns){if(!this.take(t))break;f.append(Y("th",u))}c.append(f)}const l=a?Y("tbody"):c;for(const f of s.rows){if(!this.take(t))break;const u=Y("tr");for(const[h,g]of f.entries()){if(!this.take(t))break;const p=Y("td");if(a&&h===d?p.className="decision-result":a&&s.columns[h]==="備考"&&(p.className="decision-notes"),i)for(const m of g){const S=m.kind==="reference"?this.doc.items.find(C=>C.id===m.targetId):void 0;S?p.append(Y("span",S.checkId)):this.runs(p,[m],o)}else this.runs(p,g,o);u.append(p)}l.append(u)}a&&c.append(l);const r=Y("div");r.className="json-example",r.append(c),t.append(r)}}function ws(e,t,n=e.model.checks,o=new Set,i=new Set){const s=Y("section");s.className="check-content json-checks";const c=e.model.business,d=n.filter(l=>l.basedOn.documentId===c.id);let a=!1;for(const l of d){const r=new Jn(l),f=l.index.filter(p=>p.activityId===t),u=new Set(l.index.flatMap(p=>p.checkIds)),h=(t?[...new Set(f.flatMap(p=>p.checkIds))]:l.items.filter(p=>!u.has(p.id)).map(p=>p.id)).filter(p=>!o.has(p)),g=l.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of g){(p.preamble.length||l.guarantees.some(m=>m.sectionId===p.id&&!i.has(m.id)))&&(a=!0),r.runs(s,p.preamble);for(const m of l.guarantees.filter(S=>S.sectionId===p.id&&!i.has(S.id)))r.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}for(const p of h){const m=l.items.find(y=>y.id===p);if(!m)continue;a=!0;const S=Y("section");S.className="check-item",S.dataset.checkId=m.checkId,S.dataset.elementId=m.id,S.append(Y("h3",m.checkId+" · "+m.title)),(m.reviewState==="要確認"||m.reviewState==="要修正")&&S.append(Y("p","確認が必要です。"));const C=Object.fromEntries(Object.entries(m.fields).filter(([y])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(y)));r.fields(S,C,new Set([m.id])),s.append(S)}if(!t)for(const p of l.notes)a=!0,r.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}return a||s.append(Y("p","この業務のテスト仕様はありません。")),s}function Cc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const c of n.filter(d=>d.basedOn.documentId===i.id&&d.basedOn.revision===i.revision)){const d=new Jn(c);for(const a of c.items.filter(l=>s.has(l.id))){const l=Y("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(Y("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(a.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));d.fields(l,r,new Set([a.id]),!0),o.append(l)}}return o}const jc=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Mc(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(jc,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Lc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const c of n.filter(d=>d.basedOn.documentId===i.id&&d.basedOn.revision===i.revision)){const d=c.examples.find(g=>g.id===s);if(!d||!xn(c,d).length)continue;const a=new Jn(c,!0),l=c.guarantees.find(g=>g.id===d.guaranteeId),r=Y("section");r.dataset.decisionExample=s;for(const g of l?.blocks??[])g.kind==="prose"&&a.runs(r,Mc(g.content),new Set([l.id]));d.rows.length>1&&r.append(Y("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=d.columns.indexOf("結果"),u=f>0?f:d.columns.length;d.rows.some(g=>g.slice(0,u).some(p=>p.some(m=>m.kind==="text"&&/^\s*[-‐]\s*$/.test(m.value))))&&r.append(Y("p","‐＝値不問。")),a.example(r,s,new Set([s]),!0),o.append(r)}return o}function Rc(e,t,n=e.model.checks){const o=Y("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const c of n.filter(d=>d.basedOn.documentId===i.id&&d.basedOn.revision===i.revision)){const d=new Jn(c,!0);for(const a of c.items.filter(l=>s.has(l.id))){const l=Y("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(Y("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(Y("p","確認が必要です。")),a.fields.condition?.length&&(l.append(Y("h4","条件")),d.runs(l,a.fields.condition,new Set([a.id])));const r=Object.fromEntries(Object.entries(a.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=Y("details");f.append(Y("summary","期待結果")),d.fields(f,r,new Set([a.id]),!0),l.append(f)}o.append(l)}}return o}function Dc(e,t,n=e.model.checks,o=new Set){const i=Y("section");i.className="check-content json-checks result-checks";const s=e.model.business,c=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===s.id&&a.basedOn.revision===s.revision)){const a=new Jn(d,!0),l=d.items.filter(r=>c.has(r.id)&&o.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);l.length&&i.append(Y("p",l.map(r=>r.checkId).join("、")));for(const r of d.items.filter(f=>c.has(f.id))){if(l.includes(r))continue;const f=Y("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(Y("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(Y("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(r.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));a.fields(f,u,new Set([r.id]),!0);const h=Y("details"),g=Y("summary","Check の詳細");h.append(g,Y("p",r.title)),r.fields.condition?.length&&a.runs(h,r.fields.condition,new Set([r.id])),f.append(h),i.append(f)}}return i}const ks=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Is(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),o=[],i=new Set,s=new Set,c=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),d=(r,f)=>c.some(u=>u.items.some(h=>h.id===r)&&(!f||u.index.some(h=>h.activityId===f&&h.checkIds.includes(r)))),a=(r,f,u,h)=>{const g=f.testSpecification,p=(g?.decisionCheckIds??[]).filter(x=>d(x,u)),m=(g?.resultCheckIds??[]).filter(x=>d(x,u)),S=(g?.decisionExampleIds??[]).filter(x=>c.some(R=>{const D=R.examples.find(P=>P.id===x),I=D?xn(R,D):[];return I.length>0&&I.every(P=>d(P,u))})),C=f.samples.filter(x=>(!g||g.sampleIds.includes(x.id))&&x.checkIds?.length&&(g?x.checkIds.every(R=>d(R,u)):x.checkIds.some(R=>d(R,u)))),y=S.flatMap(x=>c.flatMap(R=>{const D=R.examples.find(I=>I.id===x);return D?xn(R,D).filter(I=>d(I,u)):[]})),j=[...new Set([...p,...m,...y,...C.flatMap(x=>(x.checkIds??[]).filter(R=>d(R,u)))])];if(!j.length)return;const k=`fn:${u??"_"}:${r}:${f.id}`;s.has(k)||(s.add(k),o.push({key:k,activityId:u,groupId:r,capability:f,name:h,samples:C,checkIds:j,decisionCheckIds:p,resultCheckIds:m,decisionExampleIds:S,decisionTableCheckIds:[...new Set(y)]}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const r of l)if(!(!ks(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!ks(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const u=e.model.reviewGroups.find(g=>g.id===f.groupId),h=u?.capabilities.find(g=>g.id===f.capabilityId);!u||!h||(i.add(JSON.stringify([u.id,h.id])),a(u.id,h,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():h.title))}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)i.has(JSON.stringify([r.id,f.id]))||a(r.id,f,void 0,f.title);return o}function Ss(e,t,n,o){const i=e.filter(c=>c.groupId===t&&c.capability.id===n),s=i.find(c=>c.samples.some(d=>d.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const c of i){if(!c.capability.testSpecification)continue;const d=c.capability.samples.find(l=>l.id===o),a=c.decisionExampleIds.length?c.decisionTableCheckIds:c.decisionCheckIds;if(d?.checkIds?.some(l=>a.includes(l)))return{kind:"decision",key:"decision:"+c.key}}}const bn=["landscape","overview"];function Nc(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const c=document.createElement("aside");c.id="design-explorer",c.setAttribute("aria-label","設計ナビゲーション"),c.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",s.append(c,d),d.append(o,n);const a=document.createElement("div");a.className="shell-open-tabs",i.before(a),a.append(i),Ta(a);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(l);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),a.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),a.append(f);const u=document.createElement("section");u.id="concept-workspace",u.hidden=!0,u.setAttribute("aria-label","データ構造"),u.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(u);const h=document.createElement("section");h.id="states-workspace",h.hidden=!0,h.setAttribute("aria-label","状態遷移"),h.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(h);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',d.append(g);const p=document.createElement("aside");p.id="test-related-panel",p.className="spec-related",p.setAttribute("aria-label","関連資料"),p.hidden=!0,p.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const m=document.createElement("section");m.id="empty-workspace",m.hidden=!0,m.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(m);const S=n.querySelector("#node-list-drawer");c.append(S);const C=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),j=c.querySelector("input"),k=c.querySelector("nav"),x=u.querySelector("iframe"),R=u.querySelector(".concept-related"),D=h.querySelector("article"),I="alder-explorer-v1:"+location.pathname,P=location.protocol==="file:"||location.origin==="null"?"*":location.origin,N=window.__alderConceptHtml;let M,B,T,ie,Q={},ee=[],ae=[...bn],le=new Map,Oe=new Map,he=new Map,Se=new Map;const L=b=>he.get(b)??b,W=b=>Se.get(b)??b,U=b=>B?.findGroup(le.get(b??"")),ce=b=>T?.contentFor(le.get(b)??""),X=(b,w)=>T?.findDataExample(le.get(b)??"",w),we=b=>T?.examplesFor(le.get(b)??"")??[],Ae=b=>bn.includes(b)?"全体図":ce(b)?.title??U(b)?.name??Q[Oe.get(b)??""]?.name,ue=()=>{const b=t.business(),w=b.design?.model;return w?[...w.checks,...b.relatedChecks??[]].filter(O=>O.basedOn.documentId===w.business.id):[]},se=()=>Is(M,ue()),ge=b=>se().find(w=>w.key===(b.startsWith("decision:")?b.slice(9):b)),Pe=b=>se().filter(w=>w.name===b.name).length>1?b.name+"（"+(t.business().activities.find(w=>w.id===b.activityId)?.name??"その他")+"）":b.name,Te=b=>ue().some(w=>w.index.some(O=>O.activityId===b)||w.sections.some(O=>O.activityId===b)),Ct=b=>new Set(se().filter(w=>w.activityId===b).flatMap(w=>w.checkIds)),nn=b=>{const w=new Set(se().filter(O=>O.activityId===b).flatMap(O=>O.decisionExampleIds));return new Set(ue().flatMap(O=>O.examples.filter(E=>w.has(E.id)).map(E=>E.guaranteeId)))},$t=b=>{const w=Ct(b),O=nn(b);return ue().some(E=>E.index.some(F=>F.activityId===b&&F.checkIds.some(J=>!w.has(J)))||E.sections.some(F=>F.activityId===b&&(F.preamble.length>0||E.guarantees.some(J=>J.sectionId===F.id&&!O.has(J.id)))))},Vr=()=>ue().some(b=>b.items.some(w=>!b.index.some(O=>O.checkIds.includes(w.id)))||b.sections.some(w=>w.activityId===null)||b.notes.length>0),Br=b=>{const w=ge(b);return w?w.capability.testSpecification?Pe(w)+"・"+(b.startsWith("decision:")?"可否":"結果"):w.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(O=>O.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(O=>O.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},Yn=n.querySelector("#formattedMarkdownDrawer");Yn&&s.append(Yn),s.append(R,p),hs(R,s,I+":drawer-width"),hs(p,s,I+":test-drawer-width");let Qn=!1;const it=t.rightDrawer??{isOpen:()=>Qn,setOpen:b=>{Qn=b}};let te="business",De=!1,Ke=[],$="overview",Xe=[],st="",rt=[],Ee="@overview",mn,jt=innerWidth>800,eo=!1,to=!0,at=!1,Dn;const ct=new Map,pt=new Map([["overview",x]]),nt=new Map,on=new Map,sn=new Map,Ne=new Map,Ft=new Map,mt=new Set,$e=new Set,rn=new Set,Fe=new Map;let ye;try{if(ye=JSON.parse(sessionStorage.getItem(I)||"null"),ye){if(at=ye.overviewClosed===!0,Dn=typeof ye.documentKey=="string"?ye.documentKey:void 0,jt=typeof ye.left=="boolean"?ye.left:jt,Array.isArray(ye.expanded)){$e.clear();for(const b of ye.expanded)typeof b=="string"&&$e.add(b)}Xe=Array.isArray(ye.states)?ye.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof ye.rightOpen=="boolean"?Qn=ye.rightOpen:typeof ye.right?.["concept:"+ye.active]=="boolean"&&(Qn=ye.right["concept:"+ye.active]))}}catch{}function Gr(){if(!(!ye||Dn!==t.business().key||!De)){for(const b of Array.isArray(ye.overviewModes)?ye.overviewModes:[])U(b)&&mt.add(b);for(const[b,w]of Object.entries(ye.lastExamples??ye.examples??{}))typeof w=="string"&&X(b,w)&&Ft.set(b,w);for(const[b,w]of Object.entries(ye.examples??{}))typeof w=="string"&&X(b,w)&&Ne.set(b,w);for(const[b,w]of Object.entries(ye.selected??{}))typeof w=="string"&&ee.includes(w)&&nt.set(b,w);Ke=[...new Set((Array.isArray(ye.concepts)?ye.concepts:[]).filter(b=>typeof b=="string"&&ae.includes(b)))],$=Ke.includes(ye.active)?ye.active:"landscape"}}let an;const qe=()=>{try{sessionStorage.setItem(I,JSON.stringify({documentKey:mn,overviewClosed:at,selected:Object.fromEntries(nt),examples:Object.fromEntries(Ne),lastExamples:Object.fromEntries(Ft),overviewModes:[...mt],left:jt,expandedVersion:4,expanded:[...$e],concepts:Ke,active:$,states:Xe,specs:rt,activeSpec:Ee,specExamples:Object.fromEntries(ct),...t.rightDrawer?{}:{rightOpen:it.isOpen()}}))}catch{}},Vt=()=>{te==="concept"&&Fe.set("drawer:"+$,R.querySelector(".concept-drawer-body").scrollTop),te==="concept"&&it.isOpen()&&mt.has($)&&Fe.set("review-overview:"+$,R.querySelector(".data-review-overview").scrollTop),te==="concept"&&Ne.has($)&&Fe.set("example:"+$+":"+Ne.get($),R.querySelector(".data-examples-panel").scrollTop),te==="states"&&st&&Fe.set("state:"+st,D.scrollTop),te==="tests"&&Fe.set("tests:"+Ee,g.querySelector(".test-spec-page").scrollTop),te==="concept"&&$==="landscape"&&Fe.set("concept:landscape",u.querySelector(".concept-review-landscape").scrollTop)};function Ve(b=!0){if(eo)return;const w=new URL(location.href);if(w.searchParams.set("view",te),w.searchParams.delete("concept"),w.searchParams.delete("dataExample"),w.searchParams.delete("dataView"),te==="concept"&&it.isOpen()&&mt.has($)?w.searchParams.set("dataView","overview"):te==="concept"&&U($)&&!Ne.has($)&&w.searchParams.set("dataView","structure"),te==="concept"&&it.isOpen()&&Ne.has($)&&w.searchParams.set("dataExample",Ne.get($)),te==="tests"&&ct.has(Ee)&&w.searchParams.set("dataExample",ct.get(Ee)),w.searchParams.delete("state"),w.searchParams.delete("activity"),w.searchParams.delete("object"),w.searchParams.delete("spec"),te==="concept"&&w.searchParams.set("concept",$),te==="states"&&st&&w.searchParams.set("state",st),te==="tests"&&w.searchParams.set("spec",Ee),te==="business"){const O=t.business(),E=O.views?.find(F=>F.key===O.viewKey);E?.activity?w.searchParams.set("activity",E.activity):E?.object&&w.searchParams.set("object",E.object)}w.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",w)}function Me(b,w,O){const E=document.createElement(w);return E.textContent=O,b.append(E),E}function dt(b){b!==te&&(te==="business"?t.capture():Vt(),te=b),n.hidden=te!=="business",u.hidden=te!=="concept",h.hidden=te!=="states",g.hidden=te!=="tests",m.hidden=te!=="empty",e.dataset.workspaceArea=te,te==="business"&&t.refresh(),bt(),lt()}function Mt(b,w=!0){De&&(b==="subsystems"&&(b="landscape"),ae.includes(b)&&(Vt(),Ke.includes(b)||Ke.push(b),$=b,dt("concept"),Yo(),ht(),qe(),w&&Ve()))}function Hr(){Vt(),Ne.delete($),mt.add($),Yo(),R.querySelector(".concept-drawer-body").scrollTop=Fe.get("drawer-overview:"+$)??0,qe(),Ve()}function _r(b,w=!0){if(b&&!X($,b))return;const O=!Ne.has($),E=R.querySelector(".concept-drawer-body");O&&Fe.set("drawer-overview:"+$,E.scrollTop),Vt(),mt.delete($),b?(Ne.set($,b),Ft.set($,b)):Ne.delete($),it.setOpen(!0),Yo(),O&&(E.scrollTop=0),qe(),Ve(),w&&R.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}R.querySelector(".concept-example-back").onclick=()=>{Hr(),R.querySelector(".data-review-overview").focus({preventScroll:!0})};function Nn(b,w=!0){t.business().states?.some(O=>O.id===b)&&(Vt(),Xe.includes(b)||Xe.push(b),st=b,dt("states"),ea(),ht(),qe(),w&&Ve())}function _o(b){return b.startsWith("decision:")&&ge(b)&&!ge(b)?.capability.testSpecification?ge(b).key:ge(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&Te(b.slice(7))||b.startsWith("remaining:")&&$t(b.slice(10))?b:t.business().activities.some(w=>w.id===b)?se().find(w=>w.activityId===b)?.key??(Te(b)?"checks:"+b:"@overview"):"@overview"}function Bt(b,w=!0){const O=t.business();if(!O.design?.model||!O.key)return;b=_o(b),te==="tests"&&b!==Ee&&Vt(),rt.includes(b)||rt.push(b),Ee=b;const E=ge(b);eo||(E?.capability.testSpecification?$e.add("tests-function-"+E.key):E?.activityId?$e.add("tests-activity-"+E.activityId):b.startsWith("checks:")?$e.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?$e.add("tests-activity-"+b.slice(10)):E&&$e.add("tests-other")),dt("tests"),Jo(),ht(),lt(),qe(),w&&Ve()}function Jo(){const b=t.business().design;if(!b?.model)return;const w=g.querySelector(".test-spec-page"),O=ge(Ee);if(O){const E=document.createElement("section");E.className="test-spec-sample";const F=B?.findGroup(O.groupId),J=O.samples.find(fe=>fe.id===ct.get(Ee))??O.samples[0],V=!!O.capability.testSpecification,de=Ee.startsWith("decision:");if(V)if(Me(E,"h2",O.name),Me(E,"h3",de?"可否判定":"処理結果"),de)O.decisionExampleIds.length?E.append(Lc(b,O.decisionExampleIds,ue())):O.decisionCheckIds.length?E.append(Rc(b,O.decisionCheckIds,ue())):Me(E,"p","可否条件の記載はありません。");else{const fe=F&&J&&T?new Set(O.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(E.append(Dc(b,O.resultCheckIds,ue(),fe)),F&&J&&T){Me(E,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",E.append(Le),T.renderDataExample(Le,F,J.id,He=>{Fe.set("tests:"+Ee,w.scrollTop),ct.set(Ee,He),Jo(),qe(),Ve(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:O.capability.id,sampleIds:O.samples.map(He=>He.id),hideCapability:!0,hideSinglePicker:!0})}}else if(F&&J&&T){const fe=document.createElement("div");fe.className="data-examples-panel test-spec-examples",E.append(fe),T.renderDataExample(fe,F,J.id,Le=>{Fe.set("tests:"+Ee,w.scrollTop),ct.set(Ee,Le),Jo(),qe(),Ve(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:O.capability.id,heading:O.name,sampleIds:O.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(Cc(b,J.checkIds??[],ue()))})}w.replaceChildren(E)}else if(Ee==="@overview")w.replaceChildren(),Me(w,"p","左のメニューからテスト仕様を選択してください。");else if(Ee.startsWith("remaining:")){const E=Ee.slice(10);w.replaceChildren(ws(b,E,ue(),Ct(E),nn(E)))}else w.replaceChildren(ws(b,Ee.startsWith("checks:")?Ee.slice(7):void 0,ue()));Kr(O),w.scrollTop=Fe.get("tests:"+Ee)??0}function no(b){b||(at=!1),dt("business"),b?t.openActivity(b):(at=!1,t.openOverview()),lt(),ht(),Ve()}function Jr(b){dt("business"),t.openObject(b),lt(),ht(),Ve()}function os(b){const w=M?.model.reviewGroups.find(E=>E.id===b.groupId);if(!w)return[];const O=new Set(w.graph.nodes.map(E=>E.conceptId));return[...new Set(b.samples.flatMap(E=>E.blocks.map(F=>F.card)))].filter(E=>O.has(E)&&M?.model.concepts.some(F=>F.id===E))}function oo(b,w,O){const E=document.createElement("button");return E.type="button",E.className="shell-evidence",Me(E,"span",w),E.append(wt(Sn,{"aria-hidden":"true","stroke-width":1.8})),E.onclick=O,b.append(E),E}function Ko(b,w){const O=w.filter(F=>F.capability.testSpecification);if(!O.length)return;const E=document.createElement("section");E.className="shell-test-links",Me(E,"h3","テスト仕様書");for(const F of O)for(const[J,V]of[["decision:","可否判定"],["","処理結果"]]){const de=J+F.key,fe=oo(E,Pe(F)+"・"+V,()=>Bt(de));fe.dataset.relatedSpec=de}b.append(E)}function Kr(b){const w=p.querySelector(".spec-related-content");if(w.replaceChildren(),!b?.capability.testSpecification)return;const O=t.business().activities.find(J=>J.id===b.activityId),E=B?.findGroup(b.groupId);if(O){Me(w,"h3","Activity");const J=oo(w,O.name,()=>no(O.id));J.dataset.relatedActivity=O.id}if(E){Me(w,"h3","概念モデル");const J=oo(w,E.name,()=>Mt(L(E.id)));J.dataset.relatedGroup=E.id}const F=os(b);if(F.length){Me(w,"h3","概念");for(const J of F){const V=M.model.concepts.find(fe=>fe.id===J),de=oo(w,V.name,()=>Mt(W(J)));de.dataset.relatedConcept=J}}}function Xr(b,w){Me(b,"h3","Activity");const O=t.business(),E=U($),F=M?.model.concepts.find(V=>V.id===w),J=E?.concepts[w]?.sourceActivities??E?.activities??F?.activityLinks.filter(V=>V.uses.includes("生成")).map(V=>V.activityId)??[];for(const V of J){const de=O.activities.find(Le=>Le.id===V);if(!de)continue;const fe=document.createElement("button");fe.className="shell-evidence",Me(fe,"span",de.name),fe.append(wt(Sn,{"aria-hidden":"true","stroke-width":1.8,"data-icon":"square-arrow-out-up-right"})),fe.title=de.name+"を業務タブで開く",fe.setAttribute("aria-label",fe.title),fe.onclick=()=>no(de.id),b.append(fe)}}function Xo(b){const w=U(b);return w?B?.graph(w.id):b==="overview"?B?.overviewGraph():void 0}function is(b){const w=on.get($),O=w?Xo($)?.tables[w]:void 0;return O?.conceptId===b?O:void 0}function Zr(b,w){const O=is(w)??U($)?.concepts[w]??{...Q[w],sources:void 0};b.replaceChildren(),Me(b,"p",O.note),Me(b,"h3","持つ情報");const E=document.createElement("ul");for(const[,F]of O.fields)Me(E,"li",F);if(b.append(E),O.sources?.length){Me(b,"h3","情報の出所・対象時点");const F=document.createElement("ul");for(const J of O.sources)Me(F,"li",J);b.append(F)}Xr(b,w),Ko(b,se().filter(F=>os(F).includes(w)))}function Zo(b){const w=R.querySelector(".shell-heading strong");w.textContent=b,R.setAttribute("aria-label",b)}function ss(b=!1){U($)&&(nt.delete($),on.delete($),sn.delete($),b||pt.get($)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},P),io(),bt(),R.querySelector(".concept-drawer-body").scrollTop=0,qe())}R.querySelector(".concept-selection-clear").onclick=()=>{ss(),Ne.has($)?R.querySelector(".concept-example-back").focus({preventScroll:!0}):R.querySelector(".data-review-overview").focus({preventScroll:!0})};function io(){const b=R.querySelector(".concept-related-content");R.querySelector(".concept-selection").hidden=!!U($)&&!nt.has($)&&!sn.has($),R.querySelector(".concept-selection>h2").hidden=!U($),R.querySelector(".concept-selection-clear").hidden=!U($);const w=sn.get($);if(w&&ie){const J=ie.describe(b,{kind:"group",id:w});Zo(J);return}if($==="landscape"&&an){b.replaceChildren();for(const[J,V]of ie.sections){Me(b,"h3",J);const de=document.createElement("ul");for(const fe of V)Me(de,"li",fe);b.append(de)}Zo("サブシステムの情報");return}const O=nt.get($),E=U($),F=De&&O?is(O)?.name??E?.concepts[O]?.name??Q[O].name:E?.name??"データ構造の情報";Zo(F),De&&O?Zr(b,O):(b.replaceChildren(),E||Me(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function rs(b){b.onload=()=>{as(),b.contentDocument&&(ps(b.contentDocument),ms(b.contentDocument));const w=b.dataset.conceptView??"overview";if(!B||!M)return;const O=U(w),E=O?B.graph(O.id):w==="overview"?B.overviewGraph():{ids:ee,edges:B.edges,tables:Q};b.contentWindow?.postMessage({type:"alder-concept-data",graph:E,focus:Oe.get(w),viewKey:w,documentKey:mn??M.model.id,clearSelectionOnBackground:!!O},P);const F=nt.get(w);F&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:F},P)}}rs(x),x.dataset.conceptView="overview";function Yr(){R.querySelector(".concept-page-details").hidden=!0,R.querySelector(".concept-example-back").hidden=!0;const b=R.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const w=R.querySelector(".data-examples-panel");w.hidden=!0,w.replaceChildren(),delete w.dataset.dataExample,an?.root.remove(),an=void 0;for(const[O,E]of pt)O!=="overview"&&(E.remove(),pt.delete(O));x.removeAttribute("src"),x.removeAttribute("srcdoc"),nt.clear(),on.clear(),sn.clear()}function Yo(){u.setAttribute("aria-label",$==="landscape"||U($)?"サブシステム":"データ構造"),u.querySelector(".concept-empty").hidden=De;const b=u.querySelector(".concept-review-landscape"),w=U($),O=R.querySelector(".concept-page-details"),E=R.querySelector(".data-review-overview"),F=R.querySelector(".data-examples-panel");if(O.hidden=!De||!w,E.hidden=!De||!w||Ne.has($),F.hidden=!De||!w||!Ne.has($),R.querySelector(".concept-example-back").hidden=F.hidden,De&&w){const V=se();Fa(E,w,T,(fe,Le)=>{const He=Ss(V,w.id,fe,Le);if(He)return{kind:He.kind,open:()=>{const _e=Ss(se(),w.id,fe,Le);_e&&(_e.sampleId?ct.set(_e.key,_e.sampleId):ct.delete(_e.key),Bt(_e.key))}}},fe=>no(fe),t.business().activities),Ko(E,V.filter(fe=>fe.groupId===w.id));const de=Ne.get($)??Ft.get($)??we($)[0]?.id;de&&T.renderDataExample(F,w,de,fe=>_r(fe)),E.scrollTop=Fe.get("review-overview:"+$)??0,F.scrollTop=Fe.get("example:"+$+":"+de)??0}if(b.hidden=!De||!bn.includes($),De&&bn.includes($)&&($==="landscape"&&!an&&(an=Ja(document,M,mn??M.model.id,V=>Mt(L(V)))),$a(b,an?.root,$==="overview"?"graph":"overview"),$==="landscape"&&an?.restore()),De&&$!=="landscape"&&!pt.has($)){const V=document.createElement("iframe");V.className="concept-frame",V.dataset.conceptView=$,V.title=w?w.name+"のデータ構造":Q[Oe.get($)].name+"と隣接する概念",V.hidden=!0,pt.set($,V);const de=Oe.get($);de&&nt.set($,nt.get($)??de),rs(V),u.querySelector(".concept-main").append(V)}for(const[V,de]of pt)de.hidden=!De||V!==$,De&&V===$&&!de.hasAttribute("src")&&!de.hasAttribute("srcdoc")&&(N?de.srcdoc=N:de.src=new URL("concept.html?view=overview"+(U(V)?"&group="+encodeURIComponent(U(V).id):V==="overview"?"":"&focus="+encodeURIComponent(Oe.get(V))),document.baseURI).href);const J=nt.get($);J&&pt.get($)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:J},P),io(),bt(),R.querySelector(".concept-drawer-body").scrollTop=Fe.get("drawer:"+$)??0}function hn(){const b=t.business(),w=b.views?.find(O=>O.activity!==void 0||O.object!==void 0||!at);w?(dt("business"),t.activateView(w.key)):Ke.length?Mt(Ke.at(-1),!1):Xe.length?Nn(Xe.at(-1),!1):rt.length?Bt(rt.at(-1),!1):dt("empty")}function Qr(){if(at=!0,te==="business"){const b=t.business().views?.find(w=>w.key===t.business().viewKey);!b?.activity&&!b?.object&&hn()}ht(),lt(),qe(),Ve(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function ea(){D.replaceChildren();const b=t.business().states?.find(O=>O.id===st);if(!b)return;const w=t.statePanel(b.id);w?D.append(w):Me(D,"p","この対象の状態遷移は未定義です。"),D.scrollTop=Fe.get("state:"+st)??0}let Qo="";function ht(){for(const E of Array.from(i.querySelectorAll(".tab"))){const F=t.business().views?.find(V=>V.key===E.dataset.key);E.hidden=at&&F?.activity===void 0&&F?.object===void 0;const J=!E.hidden&&te==="business"&&E.dataset.key===t.business().viewKey;E.classList.toggle("active",J),E.querySelector("button")?.setAttribute("aria-current",String(J))}const b=(E,F,J)=>{E.replaceChildren();for(const V of F){const de=J==="concept"?Ae(V):t.business().states?.find(Lt=>Lt.id===V)?.name??V,fe=te===J&&V===(J==="concept"?$:st),Le=document.createElement("div");Le.className="tab"+(fe?" active":"");const He=J==="concept"&&(V==="landscape"||U(V))?"subsystems":J;Le.dataset.viewKind=He;const _e=document.createElement("button");_e.id=(J==="concept"?"concept-tab-":"state-tab-")+V,li(_e,He,de),_e.setAttribute("aria-current",String(fe)),_e.onclick=()=>J==="concept"?Mt(V):Nn(V),Le.append(_e);const ro=ui((He==="subsystems"?"サブシステム：":J==="concept"?"データ構造：":"状態遷移：")+de+"のタブを閉じる");ro.onclick=()=>{Vt(),J==="concept"?(Ke=Ke.filter(Lt=>Lt!==V),V!=="overview"&&(pt.get(V)?.remove(),pt.delete(V)),nt.delete(V),on.delete(V),sn.delete(V),Ne.delete(V),Ft.delete(V),mt.delete(V),te===J&&$===V&&(Ke.length?Mt(Ke.at(-1),!1):hn())):(Xe=Xe.filter(Lt=>Lt!==V),te===J&&st===V&&(Xe.length?Nn(Xe.at(-1),!1):hn())),ht(),lt(),qe(),Ve(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(ro),E.append(Le)}};b(l,Ke,"concept"),b(r,Xe,"states"),f.replaceChildren();for(const E of rt){const F=Br(E),J=document.createElement("div");J.className="tab"+(te==="tests"&&E===Ee?" active":""),J.dataset.viewKind="tests";const V=document.createElement("button");V.id="spec-tab-"+E,li(V,"tests",F),V.setAttribute("aria-current",String(te==="tests"&&E===Ee)),V.onclick=()=>Bt(E);const de=ui("テスト仕様："+F+"のタブを閉じる");de.onclick=()=>{rt=rt.filter(fe=>fe!==E),te==="tests"&&Ee===E&&(rt.length?Bt(rt.at(-1),!1):hn()),ht(),lt(),qe(),Ve()},J.append(V,de),f.append(J)}const w=a.querySelector(".tab.active:not([hidden])"),O=te==="business"?"business:"+t.business().viewKey:te==="concept"?"concept:"+$:te==="states"?"states:"+st:te==="tests"?"tests:"+Ee:"";w?(O!==Qo&&qa(a,w),Qo=O):Qo=""}function ta(){innerWidth<=800&&so(!1)}function lt(){const b=k.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,w=k.scrollTop,O=t.business(),E=j.value.trim().toLocaleLowerCase();k.replaceChildren();const F=(G,xe,Ze)=>({kind:"item",id:G,name:xe,key:Ze}),J=(G,xe,Ze)=>({kind:"group",id:G,name:xe,children:Ze}),V=se(),de=G=>F(G.key,G.name,"tests:"+G.key),fe=V.filter(G=>G.capability.testSpecification),Le=V.filter(G=>!G.capability.testSpecification),He=fe.map(G=>J("tests-function-"+G.key,Pe(G),[F("decision:"+G.key,"可否判定","tests:decision:"+G.key),F(G.key,"処理結果","tests:"+G.key)]));for(const G of O.activities){const xe=Le.filter(Je=>Je.activityId===G.id).map(de),Ze=(Ct(G.id).size?"remaining:":"checks:")+G.id;$t(G.id)&&xe.push(F(Ze,"その他","tests:"+Ze)),xe.length&&He.push(J("tests-activity-"+G.id,G.name,xe))}const _e=Le.filter(G=>!G.activityId);_e.length&&He.push(J("tests-other","その他",_e.map(de))),Vr()&&He.push(F("@unassigned","未割当","tests:@unassigned"));const ro=[{id:"business",label:"業務設計",items:[F("overview","全体図","business:overview"),J("business-activity","Activity",O.activities.map(G=>F(G.id,G.name,"business:"+G.id))),J("business-object","Object",(O.objects??[]).map(G=>F(G.id,G.name,"object:"+G.id)))]},{id:"states",label:"状態遷移",items:(O.states??[]).map(G=>F(G.id,G.name,"states:"+G.id))},{id:"subsystems",label:"サブシステム",items:M?.model.subsystems.length?[F("landscape","全体図","concept:landscape"),...M.model.subsystems.map(G=>J("subsystem-"+G.id,G.name.replace(/サブシステム$/,""),M.model.reviewGroups.filter(xe=>xe.subsystemId===G.id).map(xe=>F(L(xe.id),xe.title,"concept:"+L(xe.id)))))]:[]},{id:"concept",label:"データ構造",items:De&&ee.length?[F("overview","全体図","concept:overview"),J("concept-relations","概念",ee.map(G=>F(W(G),Q[G].name,"concept:"+W(G))))]:[]},{id:"tests",label:"テスト仕様",items:O.design?.model&&(V.length||ue().length)?He:[]}];let Lt=0;const ds=(G,xe,Ze)=>{const Je=document.createElement("button");Je.className="explorer-item"+(Ze?" explorer-item-nested":""),Je.dataset.explorerKey=G.key,Je.textContent=G.name;const Be=O.views?.find(We=>We.key===O.viewKey);return te===(xe.id==="subsystems"?"concept":xe.id)&&(["concept","subsystems"].includes(xe.id)?G.id===$:xe.id==="states"?G.id===st:xe.id==="tests"?G.id===Ee:G.key.startsWith("object:")?Be?.object===G.id:G.id==="overview"?!at&&Be?.activity===void 0&&Be?.object===void 0:Be?.activity===G.id)&&Je.setAttribute("aria-current","page"),Je.disabled=xe.id==="business"&&!O.key,Je.onclick=()=>{S.hidden||t.closeLegacyList(),xe.id==="business"?G.key.startsWith("object:")?Jr(G.id):no(G.id==="overview"?void 0:G.id):xe.id==="concept"||xe.id==="subsystems"?Mt(G.id):xe.id==="tests"?Bt(G.id):Nn(G.id),ta()},Je},ls=(G,xe,Ze,Je=!1)=>{const Be=document.createElement("button"),kt=E?!rn.has(G):$e.has(G);return Be.className=(Ze?"explorer-subparent":"explorer-parent")+(Je?" explorer-pending":""),Be.dataset.explorerKey="group:"+G,Me(Be,"span",xe).className="explorer-parent-label",Je?(Be.disabled=!0,Be):(Be.setAttribute("aria-expanded",String(kt)),Be.setAttribute("aria-controls","explorer-"+G),Be.append(Pa(kt)),Be.onclick=()=>{E?rn.has(G)?rn.delete(G):rn.add(G):($e.has(G)?$e.delete(G):$e.add(G),qe()),lt()},Be)};for(const G of ro){const xe=G.items.flatMap(We=>{if(We.kind==="item")return!E||(G.label+" "+We.name).toLocaleLowerCase().includes(E)?[We]:[];const Gt=E?We.children.filter(ti=>(G.label+" "+We.name+" "+ti.name).toLocaleLowerCase().includes(E)):We.children;return!E||Gt.length?[{...We,children:Gt}]:[]});if(E&&!xe.length)continue;const Ze=G.id!=="business"&&!G.items.length,Je=document.createElement("section"),Be=ls(G.id,G.label,!1,Ze),kt=document.createElement("div");kt.id="explorer-"+G.id,kt.hidden=Ze||(E?rn.has(G.id):!$e.has(G.id));for(const We of xe){if(We.kind==="item"){kt.append(ds(We,G,0)),Lt++;continue}const Gt=document.createElement("div");Gt.id="explorer-"+We.id,Gt.hidden=E?rn.has(We.id):!$e.has(We.id),kt.append(ls(We.id,We.name,!0),Gt);for(const ti of We.children)Gt.append(ds(ti,G,1)),Lt++;!We.children.length&&!E&&(Me(Gt,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!xe.length&&!Ze&&(Me(kt,"p","項目がありません。").className="explorer-empty"),Je.append(Be,kt),k.append(Je)}E&&!Lt&&(Me(k,"p","該当する項目はありません。").className="explorer-empty"),k.scrollTop=w,b&&Array.from(k.querySelectorAll("[data-explorer-key]")).find(G=>G.dataset.explorerKey===b)?.focus({preventScroll:!0})}function so(b){jt=b,bt(),qe(),(b?c.querySelector(".shell-heading button"):C).focus({preventScroll:!0})}C.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),so(!jt)},!0),c.querySelector(".shell-heading button").onclick=()=>so(!1),j.oninput=()=>{rn.clear(),lt()},c.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&S.hidden&&(b.preventDefault(),b.stopPropagation(),so(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&k.contains(document.activeElement)){const w=Array.from(k.querySelectorAll("button")).filter(F=>!F.disabled&&!F.closest("[hidden]")),O=w.indexOf(document.activeElement),E=w[O+(b.key==="ArrowDown"?1:-1)];E&&(b.preventDefault(),E.focus())}}),y.addEventListener("click",b=>{te!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),(te==="concept"||te==="tests"&&ge(Ee)?.capability.testSpecification)&&(it.setOpen(!it.isOpen()),bt(),qe(),Ve(!1)))},!0),R.querySelector(".shell-heading button").onclick=()=>{it.setOpen(!1),bt(),qe(),Ve(!1),y.focus({preventScroll:!0})},p.querySelector(".shell-heading button").onclick=()=>{it.setOpen(!1),bt(),qe(),Ve(!1),y.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const w=Array.from(pt).find(([,E])=>b.source===E.contentWindow);if(!w)return;if(b.data?.type==="alder-concept-rendered"){w[1].contentDocument&&(ps(w[1].contentDocument),ms(w[1].contentDocument));return}if(te!=="concept"||w[0]!==$)return;const O=U($);if(b.data?.type==="alder-concept-clear-selection"){O&&ss(!0);return}if(b.data?.type==="alder-concept-subsystem"){if(!Xo($)?.regions.some(E=>E.id===b.data.id))return;nt.delete($),on.delete($),sn.set($,b.data.id),io(),bt(),qe();return}if(!(!ee.includes(b.data?.id)||O&&!O.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){Mt(W(b.data.id));return}b.data.type==="alder-concept-select"&&(sn.delete($),nt.set($,b.data.id),(typeof b.data.viewId=="string"?Xo($)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?on.set($,b.data.viewId):on.delete($),innerWidth<=800&&(jt=!1),io(),bt(),qe())}});function as(){const b=getComputedStyle(document.documentElement);for(const w of pt.values()){const O=w.contentDocument?.documentElement;if(O){O.dataset.theme=document.documentElement.dataset.theme??"light";for(const E of["--bg","--panel","--fg","--line","--subtle","--select"])O.style.setProperty(E,b.getPropertyValue(E))}}}function bt(){!S.hidden&&te==="business"&&(jt=!0),c.hidden=!jt,C.disabled=!1,C.setAttribute("aria-controls","design-explorer"),C.setAttribute("aria-label","ナビゲーションを開閉"),C.setAttribute("aria-expanded",String(jt));const b=it.isReady?.()??!0;R.hidden=te!=="concept"||!De||!b||!it.isOpen();const w=!!ge(Ee)?.capability.testSpecification;p.hidden=te!=="tests"||!w||!b||!it.isOpen(),Yn&&te!=="business"&&(Yn.hidden=!0),te==="concept"?(y.disabled=!De||!b,y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉"),y.setAttribute("aria-expanded",String(!R.hidden))):te==="business"?y.setAttribute("aria-controls","formattedMarkdownDrawer"):te==="tests"&&w?(y.disabled=!b,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!p.hidden))):(te==="states"||te==="tests"||te==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const O=o.querySelector("#document-actions");O&&(O.hidden=te!=="business");const E=o.querySelector("#document-actions-toggle");E&&te!=="business"&&(E.hidden=!0),as(),ei()}function ei(){const b=o.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(ei);b.observe(o),b.observe(e.querySelector("header"))}window.addEventListener("resize",ei);function cs(){Vt(),eo=!0;try{const b=new URL(location.href).searchParams;if(te==="concept"&&b.get("view")==="concept"&&b.get("concept")===$&&!Ne.has($)&&X($,b.get("dataExample"))&&Fe.set("drawer-overview:"+$,R.querySelector(".concept-drawer-body").scrollTop),De||(mt.clear(),Ne.clear(),Ft.clear(),Ke=[],$="overview",x.removeAttribute("src"),x.removeAttribute("srcdoc")),b.get("view")==="concept"){const w=De&&ae.includes(b.get("concept")??"")?b.get("concept"):"landscape",O=b.get("dataExample");De&&U(w)&&b.get("dataView")==="overview"&&!X(w,O)?(mt.add(w),Ne.delete(w)):(mt.delete(w),De&&X(w,O)?(Ne.set(w,O),Ft.set(w,O)):Ne.delete(w)),Mt(w,!1)}else if(b.get("view")==="states")t.business().states?.some(w=>w.id===b.get("state"))?Nn(b.get("state"),!1):hn();else if(b.get("view")==="tests"){const w=_o(b.get("spec")??"@overview"),O=b.get("dataExample"),E=ge(w);E&&O&&E.samples.some(F=>F.id===O)?ct.set(w,O):E&&ct.delete(w),Bt(w,!1)}else if(b.get("view")==="empty")dt("empty");else if(dt("business"),t.business().key){const w=b.get("activity"),O=b.get("object"),E=t.business(),F=E.views?.find(J=>J.key===E.viewKey);w&&E.activities.some(J=>J.id===w)?F?.activity!==w&&t.openActivity(w):O&&E.objects?.some(J=>J.id===O)?F?.object!==O&&t.openObject(O):(at=!1,(!F||F.activity!==void 0||F.object!==void 0)&&t.openOverview())}ht(),lt()}finally{eo=!1}}return window.addEventListener("popstate",cs),{closeBusinessOverview:Qr,reopenBusinessOverview(){at=!1},activateBusiness(){dt("business")},businessActivated(){dt("business"),ht(),lt(),Ve()},syncChrome:bt,appendActivityTestLinks(b,w){Ko(b,Is(t.business().concept,ue()).filter(O=>O.activityId===w))},openRelatedChecks(b){$e.add("tests"),Bt(b&&Te(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),w=b.concept,O=!!(mn&&b.key!==mn||to&&Dn&&b.key&&b.key!==Dn),E=M?.model!==w?.model||M?.business!==w?.business;if((O||E&&M)&&(g.querySelector(".test-spec-page").replaceChildren(),at=!1,Ke=[],Xe=[],rt=[],$="overview",st="",Ee="@overview",ct.clear(),Fe.clear(),mt.clear(),Ne.clear(),Ft.clear(),Yr(),te!=="business"&&dt("business"),O&&!to&&Ve(!1)),E){M=w,B=w?za(w):void 0,T=w?Xa(w):void 0,ie=w?Va(w):void 0,De=!!w,Q=B?.tables??{},ee=Object.keys(Q);const F=B?.groups.map(V=>V.id)??[],J=new Set([...bn,"subsystems"]);if(he=new Map(F.map(V=>[V,J.has(V)||ee.includes(V)?"group:"+V:V])),Se=new Map(ee.map(V=>[V,J.has(V)||F.includes(V)?"concept:"+V:V])),le=new Map([...he].map(([V,de])=>[de,V])),Oe=new Map([...Se].map(([V,de])=>[de,V])),ae=[...bn,...le.keys(),...Oe.keys()],Array.isArray(ye?.expanded)&&ye.expandedVersion!==4){$e.add("subsystems"),$e.add("concept-relations");for(const V of w?.model.subsystems??[])$e.add("subsystem-"+V.id)}}if(mn=b.key,Xe=Xe.filter(F=>b.states?.some(J=>J.id===F)),te==="business"&&at&&b.views?.find(F=>F.key===b.viewKey)?.activity===void 0&&b.views?.find(F=>F.key===b.viewKey)?.object===void 0&&hn(),to&&b.key){if(Gr(),Dn===b.key){Array.isArray(ye?.specs)&&(rt=[...new Set(ye.specs.filter(F=>typeof F=="string").map(F=>_o(F)))]);for(const[F,J]of Object.entries(ye?.specExamples??{})){const V=ge(F);typeof J=="string"&&V?.capability.samples.some(de=>de.id===J)&&ct.set(F,J)}}to=!1,cs()}lt(),ht(),bt(),O&&qe()}}}class bi{tabs=new WeakMap;router;constructor(t=ci){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const c=JSON.stringify([o.map(u=>[u.id,u.width,u.height]),i.map(u=>[u.kind,u.from,u.to,u.label]),s]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==c,l=new Set(o.filter(u=>{const h=d?.nodes.get(u.id);return!h||h.x!==u.x||h.y!==u.y}).map(u=>u.id)),r=new Set(o.map(u=>u.id)),f=a?new Array(i.length):d.routes.slice();if(i.forEach((u,h)=>{!a&&!l.has(u.from)&&!l.has(u.to)||(f[h]=r.has(u.from)&&r.has(u.to)?this.router({from:u.from,to:u.to,index:h,nodes:o,kind:u.kind,matrix:s?.[h],labels:s?.[h]?[]:[...f.flatMap((g,p)=>g&&p<h?[{id:String(p),x:g.label[0]-Math.max(30,i[p].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[p].label.length*12),height:18}]:[])],wires:s?.[h]?[]:f.flatMap((g,p)=>g&&p<h?[g.points]:[]),labelWidth:Math.max(30,u.label.length*12),labelHeight:18}):void 0)}),s){const u=[],h=new Map,g=f.map((p,m)=>m).sort((p,m)=>Number(s[p].returning)-Number(s[m].returning));for(const p of g){const m=f[p];if(!m)continue;const S=o.find(x=>x.id===i[p].from),C=Math.max(30,i[p].label.length*12),y=s[p].returning?[Math.max(...m.points.map(x=>x[0]))+8+C/2,m.points[0][1]]:[S.x+S.width*.125+8+C/2,ca(S.y+S.height,s[p].captionLane*er)+9],j=tr(i[p],p,s[p]),k=h.get(j)??di(y,C,18,o,u);(k[0]!==m.label[0]||k[1]!==m.label[1])&&(f[p]={...m,label:k}),h.has(j)||(h.set(j,k),u.push({id:String(p),x:k[0]-C/2,y:k[1]-9,width:C,height:18}))}}return this.tabs.set(t,{design:n,structure:c,nodes:new Map(o.map(u=>[u.id,{...u}])),routes:f}),f}}function Pc(e,t,n,o){const i=(f,u,h)=>(u[0]-f[0])*(h[1]-f[1])-(u[1]-f[1])*(h[0]-f[0]),s=i(e,t,n),c=i(e,t,o),d=i(n,o,e),a=i(n,o,t),l=1e-6;if(s*c<-l&&d*a<-l)return!0;if(Math.max(Math.abs(s),Math.abs(c),Math.abs(d),Math.abs(a))>l)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],o[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],o[r]))>.1}function Tc(e,t,n,o,i=[]){const s=e.x+e.width,c=24,d=e.y+e.height,a=s-8-(2*(n.count-n.index)-1)*c,l=t.filter(C=>C.id!==e.id);let r;for(const C of[0,-24,24,-48,48,-72,72])for(const y of[0,16,32,64,128,256]){const j=[a+C,d],k=[j[0]+c,d];if(j[0]<e.x+8||k[0]>s-8)continue;const x=d+n.depth+y,R=Math.min(12,(k[0]-j[0])/2,(x-d)/2),D=[j];let I=`M${j}`;const P=T=>{I+=` L${T}`,D.push(T)},N=(T,ie)=>{const Q=D.at(-1);I+=` Q${T} ${ie}`;for(let ee=1;ee<=4;ee++){const ae=ee/4,le=1-ae;D.push([le*le*Q[0]+2*le*ae*T[0]+ae*ae*ie[0],le*le*Q[1]+2*le*ae*T[1]+ae*ae*ie[1]])}};P([j[0],x-R]),N([j[0],x],[j[0]+R,x]),P([k[0]-R,x]),N([k[0],x],[k[0],x-R]),P(k);const M=da(D,l,.3),B=i.filter(T=>D.slice(1).some((ie,Q)=>T.slice(1).some((ee,ae)=>Pc(D[Q],ie,T[ae],ee)))).length;if((!r||M<r.collisions||M===r.collisions&&B<r.wireCollisions)&&(r={path:I,points:D,collisions:M,wireCollisions:B,low:x,extra:y,shift:C}),M===0&&B===0)break}const{path:f,points:u,collisions:h,wireCollisions:g,low:p,extra:m,shift:S}=r;return{path:f,points:u,label:[Math.max(s+8,n.labelLeft)+o/2,p],bounds:{right:Math.max(...u.map(C=>C[0])),bottom:Math.max(...u.map(C=>C[1]))},collisions:h+g,rerouted:m>0||S!==0,fallback:h+g>0}}function qc(e,t=Li()){const n="http://www.w3.org/2000/svg",o=(L,W={})=>{const U=document.createElementNS(n,L);for(const[ce,X]of Object.entries(W))U.setAttribute(ce,X);return U},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(L=>[L]),c=[...new Set(["@new",...e.states,...s.map(L=>L[0].to)])],d={nodes:c.map(L=>({id:L,type:"business",name:i[L]??L,scope:!0})),relations:s.map(([L])=>({kind:L.path==="exception"?"business-exception":"input",from:L.from,to:L.to,label:L.id+"："+L.activity+"："+L.condition}))},a=Ni(d,c),l=L=>{const W=Array.from(L);return Array.from({length:Math.ceil(W.length/28)},(U,ce)=>W.slice(ce*28,(ce+1)*28).join(""))},r=s.map(([L])=>({from:L.from,activity:L.activity,rows:[L],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[L,W]of r.entries()){const U=W.rows[0],ce=e.transitions.filter(se=>se.from===U.from&&(se.activityId??se.activity)===(U.activityId??U.activity)&&se.path===U.path&&(U.path!=="exception"||(se.exception??"例外名未定義")===(U.exception??"例外名未定義"))),X=ce.map(se=>(se.conditionLabel??se.condition).trim().replace(/\s+/g," ")),we=new Set(X).size===ce.length?U.conditionLabel??U.condition:U.condition,ue=[U.path==="exception"?"例外："+(U.exception??"例外名未定義"):"",...ce.length>1?[we]:[]].filter(Boolean).join("：");W.lines=l(W.activity+(ue?"（"+ue+"）":"")),W.lineRows=W.lines.map(()=>W.rows),W.width=Math.max(...W.lines.map(se=>Array.from(se).length*14)),W.height=W.lines.length*18,a.wires[L].returning||(W.offset=f.has(W.from)?f.get(W.from)+8:0,f.set(W.from,W.offset+W.height))}const u=new Map;s.forEach(([L],W)=>{if(L.from===L.to){const U=u.get(L.from)??[];U.push(W),u.set(L.from,U)}});const h=new Map,g=new Map;for(const[L,W]of u){let U=0;for(const X of[...W].reverse())h.set(X,{leader:W[0],index:0,count:1,depth:0,offset:U}),U+=r[X].height+8;const ce=24+Math.max(0,U-8)+8;g.set(L,ce);for(const X of W)h.get(X).depth=ce}const p=L=>44,m=c.slice().sort((L,W)=>a.positions[L][1]-a.positions[W][1]);let S=Math.max(40,...r.map((L,W)=>a.wires[W].returning&&L.from===m[0]?16+L.height/2-44*(a.wires[W].fromPort??.5):40));const C=new Map;for(const L of m){const W=p(),U=(f.get(L)??0)+(g.get(L)??0);C.set(L,S),S+=la(W,U)}const y=c.map(L=>({id:L,x:t.positions.get(L)?.[0]??a.positions[L][0],y:t.positions.get(L)?.[1]??C.get(L),width:Math.max(104,Array.from(i[L]??L).length*14+32),height:p()})),j=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),k=o("title");k.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(c.includes("@none")?"作成なしはこの操作の処理結果。":"")+(c.includes("@unknown")?"未決は設計課題。":""),j.append(k),j.append(Ri("state-transition-"));const x=new Map,R=[],D=[];let I=t.selected;const P=L=>{I=L,t.selected=L;const W=vo(e.transitions,I);for(const[X,we]of x)we.setAttribute("class","node graph-shape state-shape"+W.nodeClasses(X)),we.setAttribute("aria-pressed",String(X===I));R.forEach(({element:X,rows:we})=>{const Ae=we[0].from===we[0].to;X.setAttribute("class","edge"+(Ae?" state-self-loop":we[0].path==="exception"?" exception":"")+W.labelClasses(we)),X.setAttribute("marker-end","url(#state-transition-"+(we.some(W.related)?"related-arrow":"arrow")+")")});for(const X of D)X.element.setAttribute("class","state-caption-line"+W.labelClasses(X.rows));j.querySelectorAll("[data-exception-paint]").forEach(X=>X.remove());const U=Array.from(j.children).find(X=>X.matches(".state-diagram-edge-label,[data-state]"))??null,ce=[...R].sort((X,we)=>Number(X.rows.some(W.related))-Number(we.rows.some(W.related)));for(const{element:X}of ce)if(j.insertBefore(X,U),X.classList.contains("exception")||X.classList.contains("state-self-loop")){const we=j.children.length;Di(j,X,{path:X.getAttribute("d")},{"data-transitions":X.getAttribute("data-transitions")});for(const Ae of Array.from(j.children).slice(we))j.insertBefore(Ae,U)}j.querySelectorAll(".state-diagram-edge-label").forEach(X=>j.append(X))};j.addEventListener("click",L=>{L.target===j&&P()}),j.addEventListener("keydown",L=>{L.key==="Escape"&&(L.preventDefault(),P())});const N=a.wires.map((L,W)=>({...L,captionLane:(r[W].offset+(g.get(r[W].from)??0))/er})),M=d.relations.map((L,W)=>({...L,label:String(W).padEnd(Math.ceil(r[W].width/12),"x")})),B=[...h].map(([L,W])=>{const U=y.find(X=>X.id===s[L][0].from),ce=r[L];return{x:U.x+U.width+8,y:U.y+U.height+24+W.offset,width:ce.width,height:ce.height}});let T=new bi().update({},e,y,M,N);for(let L=0;L<=B.length;L++){let W=!1,U=0;if(T.forEach((ce,X)=>{if(!ce||h.has(X)||!N[X].returning)return;let we=0;for(const Ae of B)for(let ue=1;ue<ce.points.length;ue++){const se=ce.points[ue-1],ge=ce.points[ue];if(Math.abs(se[0]-ge[0])>1e-7||Math.abs(se[1]-ge[1])<2)continue;const Pe=se[0];if(Pe<Ae.x-4||Pe>Ae.x+Ae.width+4||Math.max(se[1],ge[1])<Ae.y-4||Math.min(se[1],ge[1])>Ae.y+Ae.height+4)continue;const Te=Ae.x+Ae.width+12-Pe;Te>0&&(we=Math.max(we,Te))}we&&(N[X]={...N[X],returnLane:(N[X].returnLane??0)+Math.ceil(we/16)+U++},W=!0)}),!W)break;T=new bi().update({},e,y,M,N)}const ie=T.flatMap((L,W)=>L&&!h.has(W)?[L.points]:[]),Q=new Map,ee=T.map((L,W)=>{const U=h.get(W);if(!U)return L;const ce=s[W][0].from,X=y.find(Te=>Te.id===ce),we=T.flatMap((Te,Ct)=>Te&&!h.has(Ct)?[Te.points]:[]),Ae=Math.max(30,M[W].label.length*12),ue=r[W];let se=Q.get(U.leader);se||(se=Tc(X,y,{...U,labelLeft:X.x+X.width+8},Ae,ie),Q.set(U.leader,se),ie.push(se.points));const ge=we.flatMap((Te,Ct)=>Te.slice(1).map((nn,$t)=>({id:`${Ct}:${$t}`,x:Math.min(Te[$t][0],nn[0])-2,y:Math.min(Te[$t][1],nn[1])-2,width:Math.abs(Te[$t][0]-nn[0])+4,height:Math.abs(Te[$t][1]-nn[1])+4}))),Pe=di([X.x+X.width+8+ue.width/2,X.y+X.height+24+U.offset+ue.height/2],ue.width,ue.height,[...y,...ge]);return{...se,label:[Pe[0]-ue.width/2+Ae/2,Pe[1]]}}),ae=new Array(s.length),le=[],Oe=s.map((L,W)=>W).sort((L,W)=>Number(N[L].returning)-Number(N[W].returning));for(const L of Oe){const W=ee[L],U=r[L],ce=Math.max(30,M[L].label.length*12);let X=[W.label[0]-ce/2+U.width/2,W.label[1]+(N[L].returning?0:U.height/2-9)];const we=y.find(se=>se.id===s[L][0].from),Ae=y.find(se=>se.id===s[L][0].to);if(!h.has(L)&&N[L].returning&&Ae&&Ae.y>we.y){const se=W.points.slice(1).map((ge,Pe)=>[W.points[Pe],ge]).filter(([ge,Pe])=>Math.abs(ge[0]-Pe[0])<.01&&Pe[1]-ge[1]>24).sort(([ge,Pe],[Te,Ct])=>Ct[1]-Te[1]-(Pe[1]-ge[1]))[0];if(se){const[ge,Pe]=se;X=[ge[0]+8+U.width/2,ge[1]+Math.min(24+U.height/2,(Pe[1]-ge[1])/2)]}}const ue=di(X,U.width,U.height,y,le);ae[L]=ue,le.push({id:String(L),x:ue[0]-U.width/2,y:ue[1]-U.height/2,width:U.width,height:U.height})}let he=Math.max(...y.map(L=>L.x+L.width))+40,Se=Math.max(...y.map(L=>L.y+L.height))+40;s.forEach((L,W)=>{const U=h.get(W);if(U&&U.leader!==W)return;const ce=U?s.flatMap((se,ge)=>h.get(ge)?.leader===W?se:[]):L,X=ce[0],we=ee[W],Ae=o("path",{d:we.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":ce.map(se=>se.id).join(" ")});(U||X.path==="exception")&&Ae.setAttribute("stroke-dasharray","6 5");const ue=o("title");ue.textContent=ce.map(se=>`${se.id} ${se.activity} / ${se.path==="normal"?"通常":"例外："+(se.exception??"例外名未定義")}：${se.condition}`).join(" / "),Ae.append(ue),j.append(Ae),R.push({element:Ae,rows:ce}),he=Math.max(he,we.bounds.right+40),Se=Math.max(Se,we.bounds.bottom+40)});for(const[L,W]of r.entries()){const U=ae[L],ce=U[0]-W.width/2,X=U[1]-W.height/2+14;j.append(o("rect",{x:String(ce),y:String(X-14),width:String(W.width),height:String(W.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const we=o("text",{x:String(ce),y:String(X),class:"state-diagram-edge-label","data-activity":W.activity,"data-transition-id":W.rows[0].id,"aria-label":W.lines.join("")});W.lines.forEach((Ae,ue)=>{const se=o("tspan",{x:String(ce),dy:ue?"18":"0","font-size":"14","font-weight":"600"});se.textContent=Ae,se.setAttribute("data-transitions",W.lineRows[ue].map(ge=>ge.id).join(" ")),D.push({element:se,rows:W.lineRows[ue]}),we.append(se)}),j.append(we),he=Math.max(he,ce+W.width+24),Se=Math.max(Se,X+W.height+24)}for(const L of y){const W=L.id.startsWith("@"),U=o("g",{role:"button",tabindex:"0","aria-label":i[L.id]??L.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":L.id,"data-node":L.id});U.append(Ys(document,L,W)),U.append(o("rect",{x:String(L.x),y:String(L.y),width:String(L.width),height:String(L.height),rx:W?"20":"8",class:W?"state-diagram-node state-note":"state-diagram-node"}));const ce=o("text",{x:String(L.x+L.width/2),y:String(L.y+L.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(ce.textContent=i[L.id]??L.id,U.append(ce),W&&L.id!=="@new"){const X=o("text",{x:String(L.x+L.width/2),y:String(L.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});X.textContent=L.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",U.append(X)}U.addEventListener("click",()=>P(L.id)),U.addEventListener("keydown",X=>{(X.key==="Enter"||X.key===" ")&&(X.preventDefault(),P(L.id))}),x.set(L.id,U),j.append(U)}return P(t.selected),j.setAttribute("viewBox",`0 0 ${he} ${Se}`),j.style.minWidth=`${he}px`,j}const xs=new WeakMap;function Wc(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(p=>p.id===t&&p.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(p,m,S=i)=>{const C=document.createElement(p);return C.textContent=m,S.append(C),C};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const c=o.model;for(const p of c.transitions){if(!e.graph.nodes.some(m=>m.id===p.activity&&m.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(p.exceptionId){const m=e.model?.business.exceptions?.find(S=>S.id===p.exceptionId);if(!m||m.activityId!==p.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const d=xs.get(e)??new Map;xs.set(e,d);const a=d.get(t)??Li();d.set(t,a);const l={...c,transitions:c.transitions.map(p=>({...p,activityId:p.activity,activity:e.graph.nodes.find(m=>m.id===p.activity)?.name??p.activity}))};i.append(Zs(document,p=>qc(l,p),a));const r=p=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[p]??p,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},u=document.createElement("details");s("summary",`操作の詳細（${c.transitions.length}）`,u);const h=document.createElement("ol");u.append(h),i.append(u);for(const p of c.transitions){const m=document.createElement("li");m.dataset.transition=p.id,s("h3",`${p.id} · ${r(p.from)} → ${r(p.to)}`,m),p.path==="exception"&&s("p","例外名："+(p.exception??"未定義"),m),s("p",`${f[p.effect]} · ${p.path==="normal"?"正常":"例外"}`,m);const S=e.graph.nodes.find(C=>C.id===p.activity&&C.type==="business");if(S){const C=document.createElement("button");C.type="button",C.textContent=S.name,C.onclick=()=>n(S.id),m.append(C)}else s("p","要確認：根拠Activityが見つかりません — "+p.activity,m);s("p","条件："+p.condition,m),s("p",p.note,m),s("p","根拠："+p.evidence,m),h.append(m)}c.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",c.source,g),i.append(g),i}const As=64,zc=96,Uc=260,Es=40,$c=4;function Fc(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:c,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}=ua(e,t),r=c.map(k=>k.length),f=o.map(()=>0),u=o.flatMap((k,x)=>r[x]===0?[x]:[]);for(let k=0;k<u.length;k++)for(const x of s[u[k]])f[x]=Math.max(f[x],f[u[k]]+1),--r[x]===0&&u.push(x);const h=Array.from({length:f.reduce((k,x)=>Math.max(k,x),0)+1},()=>[]);o.forEach((k,x)=>h[f[x]].push(x));const g=o.map(()=>0),p=k=>k.forEach((x,R)=>g[x]=R);h.forEach(p);for(let k=0;k<$c;k++){const x=k%2?[...h].reverse():h;for(const R of x){const D=new Map(R.map(I=>{const P=k%2?s[I]:c[I];return[I,P.length?P.reduce((N,M)=>N+g[M],0)/P.length:g[I]]}));R.sort((I,P)=>D.get(I)-D.get(P)||I-P),p(R)}}const m=h[0].filter(k=>o[k].type==="object"&&i[k].length===0&&s[k].length>0);if(n&&m.length>1){const k=new Set(m),x=h[0].filter(R=>!k.has(R));h.splice(0,1,...m.map((R,D)=>D===0?[...x,R]:[R]))}const S=Object.create(null),C=o.map(()=>0),y=[],j=Math.ceil(Uc/As)-1;for(let k=0;k<h.length;k++){const x=new Map;for(const I of y)for(const P of I)x.set(P,P+1);const R=I=>{let P=I;for(;x.has(P);)P=x.get(P);let N=I;for(;x.has(N);){const M=x.get(N);x.set(N,P),N=M}return P},D=[];for(const I of h[k]){let P=k;for(const M of c[I])P=Math.max(P,C[M]+1);const N=R(P);C[I]=N,x.set(N,N+1),D.push(N),S[o[I].id]=[Es+k*As,Es+N*zc]}y.push(D),y.length>j&&y.shift()}return{positions:S,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}}function Vc(e,t){return nr(e)?Ni(e,t).positions:Fc(e,t).positions}const Os=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function lr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>Os(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=Os(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function ur(e){const t=lr(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,c])=>[o.get(s),c])))}}function fr(e){const t=ur(e);return t.restore(Vc(t.graph,t.order))}function Bc(e){const t=ur(e),n=Ni(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function pr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Gc(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(c=>c.handle!==void 0):s.tabs.some(c=>c.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,c){if(Object.is(s,c))return!0;if(!s||!c||typeof s!="object"||typeof c!="object"||o.has(s)||o.has(c))return!1;const d=h=>Array.isArray(h)||Object.getPrototypeOf(h)===null||Object.getPrototypeOf(h)?.constructor?.name==="Object";if(!d(s)||!d(c)||Array.isArray(s)!==Array.isArray(c)||Array.isArray(s)&&s.length!==c.length)return!1;o.add(s),o.add(c);const a=s,l=c,r=Object.keys(a),f=Object.keys(l),u=r.length===f.length&&r.every(h=>Object.hasOwn(l,h)&&i(a[h],l[h]));return o.delete(s),o.delete(c),u}return i(e,t)}function Mn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,c]of Object.entries(e.positions))n.has(s)&&(o[s]=[...c]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=fr(t),c=Object.values(o);for(const d of i){const a=[...s[d.id]];for(;c.some(l=>Math.abs(l[0]-a[0])<280&&Math.abs(l[1]-a[1])<88);)a[1]+=180;o[d.id]=a,c.push(a)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function mr(){return new Promise((e,t)=>{const n=indexedDB.open(pr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class Wi extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let wo;function hr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Hc(e){const t=wo;if(t===void 0)throw Error("Session has not been loaded");const n=await mr();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),c=s.objectStore("session"),d=c.get("generation"),a=c.get("current"),l=c.get("readonly-legacy");let r,f;l.onsuccess=()=>{try{const u=hr(d.result);if(Gc(a.result,e)){f=u;return}if(u!==t)throw new Wi;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");l.result===void 0&&Jc(a.result)&&c.put(a.result,"readonly-legacy"),c.put(e,"current"),c.put(f,"generation")}catch(u){r=u,s.abort()}},s.oncomplete=()=>{wo=f,o()},s.onerror=()=>i(r??s.error??Error("Session save failed")),s.onabort=()=>i(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function _c(){wo=void 0;const e=await mr();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),c=i.get("generation");o.oncomplete=()=>{try{wo=hr(c.result),t(s.result)}catch(d){n(d)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function Jc(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Cs=new WeakMap;function Kc(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let o=Cs.get(e);o||(o=new Map,Cs.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),c=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),d=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&c.has(r.to)||r.to===t&&c.has(r.from))),a=new Set([t,...d.flatMap(r=>[r.from,r.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>a.has(r.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>a.has(r))};return o.set(t,l),l}const js=new WeakMap;function Xc(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=js.get(e);o||(o=new Map,js.set(e,o));const i=t,s=o.get(i);if(s)return s;const c=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),d=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),a=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&d.has(f.to)||f.kind==="output"&&f.to===t&&d.has(f.from)||f.kind==="object-exception"&&(f.from===t&&c.has(f.to)||f.to===t&&c.has(f.from))),l=new Set([t,...a.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>l.has(f.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>l.has(f))};return o.set(i,r),r}const br=new WeakMap;function qt(e){return br.get(e)}const gr=["design","checks","source","draft","edited","handle"];function Zc(e){return{key:e.key,name:e.name,...Object.fromEntries(gr.map(t=>[t,e[t]]))}}function St(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:c,viewInset:d,canvasOrigin:a,scroll:l,zoom:r}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:c,viewInset:d,canvasOrigin:a,scroll:l,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function jo(e,t){const n=t;br.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of gr)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function ko(e){return e.activity}function Io(e){return e.object}function $n(e){return e.activity??e.object}function Mo(e){return e.object===void 0?Kc(e.design,e.activity):Xc(e.design,e.object)}function Lo(e){const t=Mo(e),n=Mn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function Qt(e,t=[],n,o){const i=n??(e.tabs[0]?Zc(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?St(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(u=>{const h=jo(i,u);return Object.assign(u,St(Lo(h))),h}):[],{dark:c,drawer:d,width:a,preferWrite:l,nodeDrawer:r,sampleLayout:f}=e;return{dark:c,drawer:d,width:a,preferWrite:l,nodeDrawer:r,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(u=>u.source?.kind==="url").map(u=>({url:u.source.url,name:u.name}))].filter((u,h,g)=>g.findIndex(p=>p.url===u.url)===h),legacyViews:e.legacyViews,active:s.some(u=>u.key===e.active)?e.active:s[0]?.key}}function zi(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(St),recovery:n}}function co(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function Yc(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!id(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const r of i.views)co(r)}const{format:s,views:c,document:d,recovery:a,...l}=e;for(const r of c)co(r);for(const r of a)co(r);if(!!d!=!!c.length||new Set(c.map(r=>r.key)).size!==c.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(u=>u.group!==void 0&&typeof u.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(u=>u.group===void 0).length!==1))throw Error("Invalid legacy views");const r=o.views[0],f=r?{...r}:void 0;return f&&delete f.group,Qt({...l,tabs:[],active:f?.key,legacyViews:{documentKey:d?.key,views:structuredClone(o.views),active:o.active}},a,d,f?[f]:[])}if(c.length&&(c[0].activity!==void 0||c[0].object!==void 0||c.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(c.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==c.filter(r=>r.activity!==void 0).length||new Set(c.filter(r=>r.object!==void 0).map(r=>r.object)).size!==c.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(d&&c.some(r=>r.activity!==void 0&&!d.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(d&&c.some(r=>r.object!==void 0&&!d.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return Qt({...l,tabs:[]},a,d,c)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)co(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return Qt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Qc(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return Qt({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function ed(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),c=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||s.has(a.activity))&&(a.object===void 0||c.has(a.object))).map(St);return Qt(e,e.recovery,i,d)}function td(e,t){const n=e.tabs.find(i=>ko(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=jo(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,St(Lo(o))),e.tabs.push(o),e.active=o.key,o}function nd(e,t){const n=e.tabs.find(i=>Io(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=jo(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,St(Lo(o))),e.tabs.push(o),e.active=o.key,o}function od(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return St(i?Lo(jo(e.document,{...St(o),...St(i)})):o)});return Qt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function id(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Ro(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=d=>d instanceof HTMLButtonElement&&d.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!o(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const s=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},c=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?c():s(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),c(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,l=i(),r=l.indexOf(document.activeElement);let f;a.key==="ArrowDown"&&(f=(r+1)%l.length),a.key==="ArrowUp"&&(f=(r+l.length-1)%l.length),a.key==="Home"&&(f=0),a.key==="End"&&(f=l.length-1),f!==void 0&&(a.preventDefault(),l[f]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!o(a)&&s(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const sd=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),rd={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function ad(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=y=>i.slice(y.line+1,o.find(j=>j.line>y.line&&j.level<=y.level)?.line??i.length).join(`
`).trim(),c=new Map(o.filter(y=>y.level===3&&t.some(j=>j.title===y.title)).map(y=>[y.title,y])),d=y=>{const j=t.find(k=>k.title===y.title);return j?"legacy-check:"+j.id:y.level===1?"legacy-check-document":"legacy-heading:"+y.line},a=new Map,l=(y,j)=>{a.has(y)?a.get(y)!==j&&a.set(y,void 0):a.set(y,j)};for(const y of o){const j=d(y);l(sd(y.title),j);const k=t.find(x=>x.title===y.title);k&&l(k.id.toLowerCase(),j)}for(const[y,j]of i.entries()){const k=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(j);if(k){const x=o.find(R=>R.line>y);x&&l(k[1].toLowerCase(),d(x))}}const r=y=>{y=y.replace(/<a\s+id=[^>]+><\/a>/g,"");const j=[];let k=0;for(const x of y.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){x.index>k&&j.push({kind:"markdown",value:y.slice(k,x.index)});let R=x[2].slice(1);try{R=decodeURIComponent(R)}catch{}const D=x[2].startsWith("#")?a.get(R.toLowerCase()):void 0;j.push(D?{kind:"reference",targetId:D,label:x[1]}:{kind:"link",uri:x[2],label:x[1]}),k=x.index+x[0].length}return k<y.length&&j.push({kind:"markdown",value:y.slice(k)}),j},f=[],u=[],h=[],g=new Map;for(const y of o.filter(j=>j.level===2)){if(y.title==="業務一覧")continue;const j=d(y),k=o.find(x=>x.line>y.line)?.line??i.length;f.push({id:j,activityId:Object.hasOwn(n,y.title)?y.title:null,title:y.title,preamble:r(i.slice(y.line+1,k).join(`
`).trim())}),g.set(y.title,j)}const p="legacy-unassigned",m=y=>{const j=o.filter(k=>k.line<y.line&&k.level===2).at(-1);return j?g.get(j.title):void 0},S=t.map(y=>{const j=c.get(y.title),k=m(j)??p,x=Object.create(null),R=[];let D={name:"補足",value:""},I="";for(const N of y.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const M=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(N);M&&(I?M[1][0]===I[0]&&M[1].length>=I.length&&!M[2].trim()&&(I=""):I=M[1]);const B=I?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(N);B?(D.value.trim()&&R.push(D),D={name:B[1],value:B[2]}):D.value+=`
`+N}D.value.trim()&&R.push(D);let P="";for(const N of R)if(N.name==="人間レビュー状態"){P=N.value.split(`
`)[0].trim();const M=N.value.split(`
`).slice(1).join(`
`).trim();M&&(x.補足=[...x.補足??[],...r(M)])}else{const M=rd[N.name]??N.name;x[M]=[...x[M]??[],...r(N.value.trim())]}return{id:"legacy-check:"+y.id,checkId:y.id,title:y.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:P,sectionId:k,detailSummary:[...y.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(N=>N[1]).join(`
`),fields:x}});S.some(y=>y.sectionId===p)&&f.push({id:p,activityId:null,title:"未割当",preamble:[]});for(const y of o.filter(j=>j.level===3&&!c.has(j.title))){const j=m(y);j?u.push({id:d(y),sectionId:j,title:y.title,blocks:[{kind:"prose",content:r(s(y))}]}):h.push({id:d(y),title:y.title,content:r(s(y))})}const C=o.find(y=>y.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(y=>y.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(i.slice(/^# /.test(i[0])?1:0,C).join(`
`)),sections:f,items:S,index:Object.entries(n).map(([y,j])=>{const k=i.find(x=>x.startsWith("|")&&x.includes("["+y+"]"))?.split("|").slice(1,-1)??[];return{activityId:y,purpose:k[1]?.trim()??"",connections:k[2]?.trim()??"",checkIds:j.map(x=>"legacy-check:"+x)}}),guarantees:u,examples:[],notes:h}}function ni(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[c,...d]=s;return!c||!d.length||!["main","master"].includes(c)&&!/^[a-f0-9]{40}$/i.test(c)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${d.join("/")}`,ref:c}}catch{return}}function gi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function cd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,u)=>{const h=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(h){i?h[1][0]===i[0]&&h[1].length>=i.length&&!h[2].trim()&&(i=""):i=h[1];return}if(!i){t.add(u);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:u,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const c=new Set,d=s.map(f=>{const u=o.find(p=>p.line>f.line&&p.level<=3)?.line??n.length,h=f.title.split(/\s/)[0];if(c.has(h))throw Error("Check IDが重複しています: "+h);c.add(h);const g=n.slice(f.line+1,u).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const p of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+p+"[：:]\\s*\\S","m").test(g))throw Error(h+" の"+p+"が見つかりません。");return{id:h,title:f.title,body:g,activities:[]}}),a=Object.create(null);let l=!1;for(const[f,u]of n.entries()){if(!t.has(f)||(/^## /.test(u)&&(l=/^## 業務一覧\s*$/.test(u)),!l||!/^\|/.test(u)))continue;const h=u.split("|").slice(1,-1);if(h.length!==4)continue;const g=gi(h[0])[0]?.label;if(!g)continue;if(Object.hasOwn(a,g))throw Error("業務一覧のActivityが重複しています: "+g);const p=gi(h[3]);if(p.some(S=>S.url.toLowerCase()!=="#"+S.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const m=p.map(S=>S.label);if(!m.length||m.some(S=>!c.has(S)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);a[g]=[...new Set(m)];for(const S of d)m.includes(S.id)&&S.activities.push(g)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:d,index:a,model:ad(e,d,a,o)}}function Fn(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Vn(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),o=Object.keys(e.index).filter(l=>!n.has(l)),i=Object.keys(e.index).filter(l=>n.has(l)),s=(l,r)=>({state:l,reason:r,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const c=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=gi(c).map(l=>ni(l.url)).filter(l=>l!==void 0),a=t.source?.kind==="url"?ni(t.source.url):t.source?.kind==="sample"?ni("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(l=>l.document!==a.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!a||!d.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Ms=new WeakMap;function An(e){let t=Ms.get(e);return t||(t=cd(e.markdown),Ms.set(e,t)),t}const oi=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function lo(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function dd(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function ld(e){if(!e.checks)return[];const t=An(e.checks),n=Vn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===Fn(e)?[t.model]:[]}function ud(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&lo(i,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,i.append(d)}let s,c=!1;if(e.checks){s=An(e.checks);const d=Vn(s,e);if(c=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===Fn(e),!c&&(lo(i,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=oi("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,i.append(a)}}if(t.candidate){const d=t.candidate,a=An(d),l=Vn(a,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",lo(r,"一致未確認: "+d.name+" — "+l.reason),lo(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),u=document.createElement("summary");u.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(u,dd(a.markdown)),r.append(f);const h=oi("対応を確認して表示する",()=>n.confirm(d));h.id="check-confirm",h.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const g=oi("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(h,g),i.append(r)}return i.childNodes.length&&o.append(i),o}function fd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const r of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const c=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),r&&!o.hidden&&o.focus({preventScroll:!0})},d=()=>i.filter(r=>!r.hidden&&!r.disabled),a=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const h=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+h,p=i.some(m=>!m.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=p?"menu":"inline",o.hidden=!p,(!p||r!==e.dataset.actionsMode)&&(c(),p&&n.contains(f)?o.focus({preventScroll:!0}):!p&&f===o&&d()[0]?.focus({preventScroll:!0}))},l=(r=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=d();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?c(!0):l(),o.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),l(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=d(),u=f.indexOf(document.activeElement);let h;r.key==="ArrowDown"&&(h=(u+1)%f.length),r.key==="ArrowUp"&&(h=(u+f.length-1)%f.length),r.key==="Home"&&(h=0),r.key==="End"&&(h=f.length-1),h!==void 0&&(r.preventDefault(),f[h]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),c(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!o.contains(r.target)&&c()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==o&&c()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&c(!0)},!0),c(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:c}}function pd(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,c=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),d=n.reduce((l,r)=>l+r.getBoundingClientRect().width,0)+s*n.length+c,a=d+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const Pn="http://www.w3.org/2000/svg",md="http://www.w3.org/1999/xhtml",uo=24,Ls=8192,hd=16e6,bd=8e6,gd=4e3,yd=1e6,yi="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function vd(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),o=Math.max(o,r.x+r.width),i=Math.max(i,r.y+r.height);const s=Math.floor(t)-uo,c=Math.floor(n)-uo,d=Math.ceil(o)-s+uo,a=Math.ceil(i)-c+uo,l=Math.min(2,Ls/d,Ls/a,Math.sqrt(hd/(d*a)));if(l<1)throw Error(yi);return{bounds:{x:s,y:c,width:d,height:a},width:Math.floor(d*l),height:Math.floor(a*l),scale:l}}const wd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function Rs(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const c=o[s],d=getComputedStyle(i);c.removeAttribute("style");for(const a of wd){const l=d.getPropertyValue(a);l&&!/url\s*\(/i.test(l)&&c.style.setProperty(a,l)}for(const a of Array.from(c.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&c.removeAttribute(a.name)}),t}function kd(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>gd||(e.textContent?.length??0)+(t.textContent?.length??0)>yd)throw Error(yi);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(p=>({x:parseFloat(p.style.left),y:parseFloat(p.style.top),width:p.offsetWidth,height:p.offsetHeight}));for(const p of o)for(const m of Array.from(p.querySelectorAll(".finding-badges")))i.push({x:parseFloat(p.style.left)+p.clientLeft+m.offsetLeft,y:parseFloat(p.style.top)+p.clientTop+m.offsetTop,width:m.offsetWidth,height:m.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,c=Array.from(t.children).map(Rs),d=c.filter(p=>p.matches(".edge,.edge-label"));if(d.length){const p=s.createElementNS(Pn,"svg");p.setAttribute("viewBox","0 0 1 1"),p.setAttribute("width","1"),p.setAttribute("height","1"),p.setAttribute("aria-hidden","true"),p.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",p.append(...d),s.body.append(p);try{for(const m of d){const S=m.getBBox();i.push({x:S.x-12,y:S.y-12,width:S.width+24,height:S.height+24})}}finally{p.remove()}}const a=vd(i),l=s.createElementNS(Pn,"svg");l.setAttribute("width",String(a.width)),l.setAttribute("height",String(a.height)),l.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const r=s.createElementNS(Pn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),l.append(r);const f=s.createElementNS(Pn,"g");f.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const p of c)f.append(p);l.append(f);const u=s.createElementNS(Pn,"foreignObject");u.setAttribute("width",String(a.bounds.width)),u.setAttribute("height",String(a.bounds.height));const h=s.createElementNS(md,"div");h.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const p of o){const m=Rs(p);m.querySelector(".activity-open,.object-open")?.remove(),m.style.left=parseFloat(p.style.left)-a.bounds.x+"px",m.style.top=parseFloat(p.style.top)-a.bounds.y+"px",h.append(m)}u.append(h),l.append(u);const g=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(g).length>bd)throw Error(yi);return{svg:g,...a}}function Id(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function yr(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const c=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(c),i()},n.onerror=()=>{clearTimeout(c),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const c=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(c),d?i(d):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(c),s(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Sd(e,t){const n=await yr(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=Id(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function xd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=yr(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function vr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:Ad(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Ad(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const c of o)i=Math.imul(i^c.codePointAt(0),16777619)>>>0,s=Math.imul(s^c.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function wr(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return q(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function Ed(e){q(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),vn(e),hi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=vr(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=wr(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return hi(t),t}const re=(e,t)=>{if(!e)throw new Error(t)},Tn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ii=e=>!!e&&typeof e=="object"&&!Array.isArray(e),fo=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),kr=e=>Tn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Od(e){re(ii(e),"Graph must be an object");const t=e;re(fo(t,["version","nodes","relations"])||fo(t,["version","nodes","relations","scope"]),"Invalid graph fields"),re(t.version===1,"Unsupported graph version"),"scope"in t&&re(Tn(t.scope),"Invalid scope"),re(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),re(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){re(ii(s),"Node must be an object");const c=s;re(c.type==="business"||c.type==="object","Invalid node type");const d=c.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];c.type==="business"&&("problem"in c||"pain_level"in c)&&(d.push("problem","pain_level"),re(["Low","Medium","High"].includes(String(c.pain_level)),"Invalid Pain level")),re(fo(c,d),"Invalid node fields"),re(Object.entries(c).every(([l,r])=>l==="scope"||l==="information"||Tn(r)),"Empty node text"),re(typeof c.scope=="boolean","Invalid node scope"),re(kr(c.name)&&c.id===c.name,"Node ID must equal visible name"),re(!n.has(c.id),"Duplicate node ID"),c.type==="object"&&(re(typeof c.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.icon),"Invalid Lucide icon"),re(Array.isArray(c.information)&&c.information.every(Tn),"Invalid information")),n.set(c.id,c.type)}re([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){re(ii(s),"Relation must be an object");const c=s;re(fo(c,["kind","from","to","label"])&&Object.values(c).every(Tn),"Invalid relation fields");const d=o[c.kind];re(Array.isArray(d)&&n.has(c.from)&&n.has(c.to)&&n.get(c.from)===d[0]&&n.get(c.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([c.kind,c.from,c.to,c.label]);re(!i.has(a),"Duplicate relation"),i.add(a)}}function Kt(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function qn(e){const t=[];let n="";return Kt(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),re(!n,"Unclosed code fence"),t}function vi(e,t,n,o=[]){const i=Kt(e),s=qn(e),c=Object.create(null);return re(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([d,a],l)=>{re(t.includes(a)&&!(a in c),n+": unsupported/duplicate "+a),c[a]=i.slice(d+1,s[l+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),re(c[a]||o.includes(a),n+": empty "+a)}),re(s.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),c}const Ds=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function Cd(e){const t=Kt(e),n=qn(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return re(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],c)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);re(d,"Invalid Finding ID");const a=d[1];re(!o.has(a),"Duplicate Finding ID"),o.add(a);const l=vi(t.slice(i+1,n[c+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);re(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),re(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),re(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const r=l["### Targets"]==="(none)"?[]:Kt(l["### Targets"]).filter(f=>f.trim()).map(f=>(re(f.startsWith("- ")&&kr(f.slice(2)),"Invalid Finding target"),f.slice(2)));return re(new Set(r).size===r.length,"Duplicate Finding target"),re(l["### Scope"]==="items"?r.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:r,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function jd(e,t){re(!e.includes("<!--"),"HTML comments are unsupported");const n=Kt(e),o=qn(e).filter(u=>u[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;re(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const c={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;o.slice(1).forEach(([u,h],g)=>{const p=o[g+2]?.[0]??n.length,m=n.slice(u+1,p).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(re(m,"Empty section "+h),h==="# Findings"){re(!a.has(h),"Duplicate Findings"),a.add(h),s=Cd(m);return}if(["# Scope","# Graph exceptions"].includes(h)){re(!a.has(h),"Duplicate "+h),a.add(h),h==="# Scope"?(re(!qn(m).length,"Scope must be prose"),c.scope=m):Kt(m).filter(D=>D.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(D=>{const I=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(D);re(I,"Invalid exception"),c.relations.push({kind:I[1],from:I[2],to:I[3],label:I[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const S=i.exec(h);re(S,"Unsupported heading "+h);const C=S[1],y=S[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[y]=n.slice(u,p).join(`
`);const j=D=>qn(m).some(I=>I[1]===D);if(C==="Object"){const D=["## Scope","## Icon"];j("## Information")&&D.push("## Information");const I=vi(m,D,y);re(["true","false"].includes(I["## Scope"]),"Invalid Scope");const P=Kt(I["## Information"]??"").filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(N=>(re(/^- \S.*$/.test(N),"Invalid Information"),N.slice(2)));c.nodes.push({id:y,type:"object",name:y,scope:I["## Scope"]==="true",icon:I["## Icon"]==="(generic icon)"?"box":I["## Icon"],information:P});return}const k=["## Scope","## Why","## When"];j("## Exception When")&&k.push("## Exception When"),k.push("## Who","## Where","## How","### Input","### Procedure"),j("### Exception")&&k.push("### Exception"),k.push("### Output","## Result"),(j("## Problem")||j("## Pain level"))&&k.push("## Problem","## Pain level");const x=vi(m,k,y,["## How"]);re(!x["## How"],"How must only contain fields"),re(["true","false"].includes(x["## Scope"]),"Invalid Scope"),t?.activity?.(y,x);const R={id:y,type:"business",name:y,scope:x["## Scope"]==="true",why:x["## Why"],when:x["## When"],who:x["## Who"],where:x["## Where"],result:x["## Result"]};"## Problem"in x&&(R.problem=x["## Problem"],R.pain_level=x["## Pain level"]),c.nodes.push(R);for(const[D,I]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(D in x)||I!=="business-exception"&&x[D]==="(none)"||Kt(x[D]).filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(P=>{const N=/^- (.+?) — (\S.*)$/.exec(P);re(N,"Invalid relation in "+y),c.relations.push({kind:I,from:I==="output"?y:N[1],to:I==="output"?N[1]:y,label:N[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=c.nodes.filter(u=>u.type==="business").map(u=>u.id);Od(c),c.nodes.sort((u,h)=>Ds(u.id,h.id)),c.relations.sort((u,h)=>{for(const g of["kind","from","to","label"]){const p=Ds(u[g],h[g]);if(p)return p}return 0});const r=new Set(c.nodes.map(u=>u.id));for(const u of s)u.unresolvedTargets=u.targets.filter(h=>!r.has(h));return{graph:c,sections:d,markdown:e,activityOrder:l,findings:s}}const Md=["id","from","activity","condition","to","effect","path","evidence","note"],ze=(e,t)=>{if(!e)throw Error(t)},po=e=>typeof e=="string"&&!!e.trim();function Ld(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());ze(n,"state-meta と遷移表が必要です");const o=cr(n[1]);ze(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),ze(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),ze(o.object===t,"対象Objectが一致しません"),ze(Array.isArray(o.states)&&o.states.length>0&&o.states.every(l=>po(l)&&!l.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),ze(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&po(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=l=>(ze(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(r=>r.trim())),c=s(i[0]);ze([Md,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>c.join("|")===l.join("|")),"表の列名が不正です"),ze(s(i[1]).length===c.length&&s(i[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),ze(i.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=i.slice(2).map(l=>{const r=s(l);ze(r.length===c.length&&r.every(po),"表の列数・空欄が不正です");const f=Object.fromEntries(c.map((u,h)=>[u,r[h]]));return ze(/^T[0-9]+$/.test(f.id)&&!d.has(f.id),"遷移IDが不正または重複しています"),d.add(f.id),ze([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),ze(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),c.includes("exception")&&ze(f.path==="normal"?f.exception==="-":po(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),ze(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),ze(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),ze(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),ze(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Ns=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Rd(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let c=0;c<o.length;c++){const d=o[c];if(!s&&/^# Object /.test(d)?n=d.slice(9):!s&&/^# /.test(d)&&(n=null),!s&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let l="";for(c++;c<o.length;c++){const f=o[c];if(!l&&/^#{1,2} /.test(f)){c--;break}a.push(f),l=Ns(f,l)}const r=Ld(a.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}i.push(d),s=Ns(d,s)}if(new Set(t.map(c=>c.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function Dd(e){const t=/^## State Transitions$/m.test(e)?Rd(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=jd(t.markdown,{activity:(a,l)=>i.set(a,l),document:(a,l)=>{n=a,o=l}}),c={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(s.activityOrder??[]).map(a=>{const l=s.graph.nodes.find(f=>f.id===a),r=i.get(a);return{id:a,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:s.graph.relations.map((a,l)=>({id:"legacy-relation-"+l,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(s.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(l=>s.graph.nodes.some(r=>r.id===l))}))};c.exceptions=vr(c);const d=t.declarations.map((a,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:c.id,revision:c.revision,verification:"unverified"},objectId:a.object,states:a.states.map(r=>({id:r,name:r})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:wr(c,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:c,checks:[],states:d,diagnostics:[]}}}function Nd({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const n=dr({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(n.diagnostics)]};const o=e.business,i=[...o.objects,...o.activities],s=a=>o.roles?.find(l=>l.id===a.roleId)?.name??a.who,c=[...o.objects.map(a=>({...a,type:"object"})),...o.activities.map(a=>({id:a.id,type:"business",name:a.name,scope:a.scope,why:a.why,when:a.when,who:s(a),where:a.where,result:a.result,...a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel}}))],d=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(a=>a.basedOn.documentId===o.id).map(a=>{const l=new Map(a.states.map(f=>[f.id,f.name])),r={object:i.find(f=>f.id===a.objectId).name,states:a.states.map(f=>f.name),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(f=>({id:f.sourceId,from:l.get(f.fromId)??f.fromId,to:l.get(f.toId)??f.toId,activity:f.activityId,...f.event?{event:f.event}:{},...f.exceptionId?{exceptionId:f.exceptionId,exception:o.exceptions?.find(u=>u.id===f.exceptionId)?.name}:{},condition:f.condition,...f.conditionLabel?{conditionLabel:f.conditionLabel}:{},effect:f.effect,path:f.path,evidence:f.evidence,note:f.note}))};return[a.objectId,{model:r}]})));return{graph:lr({version:1,...o.scope?{scope:o.scope}:{},nodes:c,relations:o.relations.map(a=>({kind:a.kind,from:a.fromId,to:a.toId,label:a.label}))}),sections:Object.fromEntries(c.map(a=>[a.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:o.activities.map(a=>a.id),objectStateTransitions:d,findings:o.findings.map(a=>({...a,displayId:a.sourceId,targets:[...a.targetIds,...a.unresolvedTargets],targetNames:[...a.targetIds,...a.unresolvedTargets].map(l=>i.find(r=>r.id===l)?.name??l)}))}}const Ir=8*1024*1024;function Sr(e){return/^\s*[\[{]/.test(e)}function xr(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Ps(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");xr(e);const n=hi(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Pd(e){if(!Sr(e))return Dd(e);if(new TextEncoder().encode(e).byteLength>Ir)throw Error("ローカルJSONは8MiB以内にしてください。");const t=cr(e.replace(/^\uFEFF/,""));if(xr(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=Ps(Ed(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const o=n.data.business;o.schemaVersion="0.1",delete o.roles;for(const i of o.activities)delete i.roleId;n.data.diagnostics=n.data.diagnostics.filter(i=>!i.startsWith("Role未確定:"))}return n}return Ps(t,e)}function pn(e){return Nd(Pd(e))}async function Td(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>Ir)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Sr(n))throw Error("JSONファイルの本文を確認してください。");return pn(n)}const qd=(e,t)=>Ui(e,t,!1);async function Ui(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const c=setTimeout(s,3e4);try{const d=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const r=d.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,u="";const h=new TextDecoder;try{for(;;){const{done:g,value:p}=await r.read();if(g)break;if(f+=p.length,f>l){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}u+=h.decode(p,{stream:!0})}u+=h.decode()}finally{r.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(u))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(u))throw Error("HTMLページは読み込めません。");return u}catch(d){const a=i.signal.aborted;throw s(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(c),t?.removeEventListener("abort",s)}}const So=Td;async function Do(e,t){return pn(await Ui(e,t))}function Wd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return pn(e)}const No=e=>e==="question"?"要確認":"要修正";function zd(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${No(o)} ${i}`)}return n}function Ud(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${No(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(ln(e.content)),t}function $d(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Fd(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${No(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function Vd(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const c=document.createElement("label");c.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),c.append(d,document.createTextNode("解消済みも表示")),s.append(c);const a=(r,f,u)=>{const h=document.createElement("button");h.className="node-navigate finding-index-row",h.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const p=document.createElement("span");return p.textContent=u,h.append(g,p),h.onclick=()=>o(r),h},l=e.graph.nodes.filter(r=>(!i||r.id===i)&&typeof r.problem=="string");if(l.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of l)s.append(a({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const u=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!u.length)continue;const h=document.createElement("h3");h.textContent=`${f}（${u.length}件）`,s.append(h);for(const g of u)s.append(a({type:"finding",id:g.id},`${No(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function Bd(e){const t=fr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,c)=>s===i[c]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...fa(),viewInset:[40,0],canvasOrigin:void 0}}function Gd(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function $i(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function Hd(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{$i(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function _d(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent($i(t)),n.href}function Jd(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return $i(t)}const Fi=`# Alderを使った設計業務 — Business Design

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
`,Kd=`{
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
`;function Xd(e,t){const n=new Set(t.graph.nodes.map(u=>u.id)),o=new Map;for(const u of t.graph.nodes)o.set(u.name,o.has(u.name)?void 0:u.id);const i=u=>n.has(u)?u:o.get(u),s=Object.create(null);for(const[u,h]of Object.entries(e.positions)){const g=i(u);g&&(s[g]=h)}const{scroll:c,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:c,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(u=>{const h=i(u);return h?[h]:[]}))]}}}const Zd=`# Alderのチェックリストサンプル

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
`;function Yd(e,t,n,o,i=()=>!0,s=()=>{}){const c=e.ownerDocument,d=c.defaultView;let a,l=0,r=0,f=!1,u=null,h="";const g=new Map,p=()=>{a!==void 0&&(d.clearTimeout(a),l=Math.max(0,l-(Date.now()-r)),a=void 0)},m=(y=!1)=>{if(y&&!i())return;p(),g.delete(h);const j=[...g].at(-1);if(j){C(j[1],"error",j[0]);return}const k=e.contains(c.activeElement);e.hidden=!0,t.textContent="",s(),k&&(u?.isConnected?u:o).focus({preventScroll:!0})},S=()=>{e.hidden||e.dataset.kind==="error"||f||c.hidden||e.contains(c.activeElement)||(p(),r=Date.now(),a=d.setTimeout(m,l))};e.addEventListener("pointerenter",()=>{f=!0,p()}),e.addEventListener("pointerleave",()=>{f=!1,S()}),e.addEventListener("focusin",y=>{const j=y.relatedTarget;j&&!e.contains(j)&&(u=j),p()}),e.addEventListener("focusout",()=>d.setTimeout(S,0)),e.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),m(!0))}),c.addEventListener("visibilitychange",()=>c.hidden?p():S()),n.onclick=()=>m(!0);const C=(y,j,k)=>{p(),e.contains(c.activeElement)||(u=c.activeElement),h=k,e.dataset.kind=j,e.dataset.key=k,t.setAttribute("role",j==="error"?"alert":"status"),t.setAttribute("aria-live",j==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=y,s(),l=j==="warning"?8e3:5e3,S()};return(y,j="success",k="operation")=>{j==="error"&&y?(g.delete(k),g.set(k,y)):g.delete(k);const x=[...g].at(-1);if(x){if(!e.hidden&&t.textContent===x[1]&&h===x[0])return;C(x[1],"error",x[0]);return}if(!y){h===k&&m();return}!e.hidden&&t.textContent===y&&e.dataset.kind===j||C(y,j,k)}}const Ts=Kd,ft=document.querySelector("#app");ft.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const v=e=>document.getElementById(e),wn=pr(location.pathname);wn.version&&(v("preview-badge").hidden=!1,v("preview-badge").textContent=`確認用 · ${wn.version}`,v("preview-badge").title=`PR #${wn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const En=e=>wt(e,{"stroke-width":1.8,"aria-hidden":"true"}),Kn=document.createElement("div");Kn.id="source-menu";Kn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';ft.append(Kn);const Po=document.createElement("div");Po.id="checks-menu";Po.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';ft.append(Po);const un=document.createElement("section");un.id="check-followup";un.hidden=!0;un.setAttribute("aria-labelledby","check-followup-title");un.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(un);const To=document.createElement("div");To.id="check-followup-menu";To.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';ft.append(To);const xt=document.createElement("input");xt.type="file";xt.id="check-file";xt.accept=".md,.markdown,text/markdown,text/plain";xt.hidden=!0;ft.append(xt);const Ut=document.createElement("section");Ut.id="check-url-dialog";Ut.hidden=!0;Ut.setAttribute("role","dialog");Ut.setAttribute("aria-labelledby","check-url-title");Ut.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';ft.append(Ut);const qo=document.createElement("div");qo.id="help-menu";qo.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${wn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${wn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${wn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;ft.append(qo);Ro(v("help-menu-toggle"),qo);const Wn=document.createElement("div");Wn.id="url-history";Kn.append(Wn);function Qd(){if(Wn.replaceChildren(),!A.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",Wn.append(e);for(const t of A.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=ne||je||oe,n.onclick=()=>{el(t.url)},Wn.append(n)}}async function el(e){if(!(ne||je||oe)){if(A.document?.source?.kind==="url"&&A.document.source.url===e){me(),Ue?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),Zn();return}je=!0,Ie();try{const t=await Do(e),n=Mn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await Xn(n)}catch(t){t instanceof jn||Re("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{je=!1,Ie()}}}const tl=Ro(v("open-menu-toggle"),Kn),nl=Ro(v("open-checks"),Po,()=>{const e=K();v("check-open-sample").hidden=!e||!_i(e),v("check-close").disabled=!e?.checks}),Ar=Ro(v("check-followup-open"),To,()=>{v("check-followup-sample").hidden=!K()||!_i(K())});for(const[e,t]of[["open-menu-toggle",us],["open",us],["open-url",pa],["open-text",ma],["view-markdown",ha],["open-checks",Bs],["share-source",ba],["refresh",ga],["help-menu-toggle",ya],["drawer",va],["node-list-toggle",wa],["node-list-close",Gs],["display-settings-toggle",Hs],["reset-layout",ka],["save-image",Ia],["copy-image",Sa],["out",Ks],["in",Xs]])v(e).prepend(En(t));pd(document.querySelector("header"));const wi=fd(document.querySelector(".tab-strip"));let A={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},gt=!0,Nt=!1,ne=!0,On=!1,cn=!1,je=!1,qs=Promise.resolve(),Xt,pe,yt=0,oe=!1,zn=!1,kn=0,xo=0,In=!1,Vi=!1,ki=!1,Ws=!1;const Ii=new Set,Pt=new Set,Ao=new Set;function Er(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ao){const o=[...A.document?[A.document]:[],...A.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&Ao.delete(n)}}const K=()=>A.tabs.find(e=>e.key===A.active),fn=e=>qt(e)?.key??e.key,Wt=e=>A.document?.key===fn(e);let Si="";const ol=Yd(v("status"),v("status-text"),v("status-close"),v("viewport"));function Re(e,t="success",n="operation"){if(n==="storage"){if(Si===e)return;Si=e}ol(e,t,n)}function Bi(){Re("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Gi(){Re("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ot(){ne||(yt++,Ge())}function il(e){e.preventDefault(),e.returnValue=!0}function Ge(){const e=yt>kn||xo>0||!1||oe||Ao.size>0||ki||In||cn,t=!ne&&e;t!==Ws&&(Ws=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",il));const n=ne?"restoring":On?"protected":cn?"conflict":In?"error":ki||Ao.size>0?"draft":xo>0||oe?"saving":yt>kn?"dirty":Vi?"saved":"unchanged";ft.dataset.saveState!==n&&(ft.dataset.saveState=n),On?Bi():cn?Gi():In?Re("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):Re("","success","storage"),zo()}function Hi(e){In=!0,Si=""}function Wo(){if(On)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(cn)throw new Wi}async function sl(e){Wo();try{await Hc(e)}catch(t){throw t instanceof Wi&&(cn=!0,clearTimeout(Xt),Xt=void 0,Gi()),t}}function Or(e,t){xo++,Ii.add(t),Ge();const n=qs.catch(()=>{}).then(()=>sl(e)).then(()=>{kn=Math.max(kn,t),Vi=!0,Er(e),kn===yt&&(In=!1)},o=>{throw Hi(),o}).finally(()=>{xo--,Ii.delete(t),Ge()});return qs=n.catch(()=>{}),n}function be(e=180,t=!0){if(ne)return;if(t&&yt++,clearTimeout(Xt),Xt=void 0,On){Bi(),Ge();return}if(cn){Gi(),Ge();return}if(oe||Ii.has(yt)||!t&&yt<=kn&&!In){Ge();return}const n=()=>{Xt=void 0;let o;try{o=structuredClone(zi(A))}catch{Hi(),Ge();return}Or(o,yt).catch(()=>Ge())};e===0?n():Xt=window.setTimeout(n,e),Ge()}async function rl(e){if(ne||pe||oe||!A.tabs.includes(e))return;if($n(e)===void 0){Ue?.closeBusinessOverview();return}ot.cancel(),me();const t=A.active===e.key,n={...A,tabs:A.tabs.filter(o=>o!==e),active:t?A.tabs[0]?.key:A.active};try{await Fo(()=>n,()=>{A=n}),t&&ft.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{Ge()}}function et(){v("drawer").setAttribute("aria-label","業務内容開閉"),v("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!K(),t=e&&A.drawer,n=e&&!!A.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Nt=!1),zo(),v("layout-lock").replaceChildren(En(gt?_s:Js)),v("layout-lock").setAttribute("aria-pressed",String(gt)),v("layout-lock").title=gt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",v("layout-lock").toggleAttribute("disabled",ne),v("viewport").dataset.layoutLocked=String(gt),v("prefer-write").checked=A.preferWrite===!0,v("prefer-write").disabled=ne,v("show-exceptions").checked=K()?.showExceptions!==!1,v("show-exceptions").disabled=ne||oe||!K()||pe===K(),v("selected-edges-only").checked=K()?.selectedEdgesOnly===!0,v("selected-edges-only").disabled=ne||oe||!K()||pe===K(),document.documentElement.dataset.theme=A.dark?"dark":"light",v("theme").replaceChildren(En(A.dark?ja:Ma)),v("formattedMarkdownDrawer").hidden=!t,v("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(A.width,innerWidth*.65))+"px",v("drawer").setAttribute("aria-expanded",String(t)),v("drawer").toggleAttribute("disabled",ne||!e),v("node-list-drawer").hidden=!n||tt().mode!=="findings",v("node-list-toggle").setAttribute("aria-expanded",String(n)),v("node-list-toggle").toggleAttribute("disabled",ne||!e),Ue?.syncChrome()}function xi(){for(const e of["save-image","copy-image"]){const t=v(e);t.hidden=!K(),t.disabled=zn||ne||!K()||pe===K(),t.setAttribute("aria-busy",String(zn))}}function zo(){xi(),document.querySelector(".toolbar").dataset.settingsOpen=String(Nt),v("display-options").hidden=!Nt,v("reset-layout").disabled=ne||je||oe||!1||!K()||Pt.has(A.document?.key??"")||On||cn;const e=v("display-settings-toggle"),t=Nt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Nt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ne||oe||!K()||pe===K()}function Cr(e,t=!1){const n=K();ne||oe||!n||pe===n||e===Nt||(e&&(Cn.delete(qt(n)?.key??n.key),Uo()),ot.cancel(),Ce=void 0,me(),Nt=e,zo(),Et(n),!e&&(t||v("display-options").contains(document.activeElement))&&v("display-settings-toggle").focus({preventScroll:!0}))}async function jr(e){const t=K();if(!(zn||ne||!t||pe===t)){zn=!0,xi();try{const n=kd(v("nodes"),v("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await xd(n),Re("グラフ全体のPNGをコピーしました。")):await Sd(n,(qt(t)?.name??t.name)+($n(t)?" - "+$n(t):""))}catch(n){Re((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{zn=!1,xi()}}}v("save-image").onclick=()=>jr(!1);v("copy-image").onclick=()=>jr(!0);v("display-settings-toggle").onclick=()=>Cr(!Nt);v("reset-layout").onclick=()=>{const e=K();if(ne||je||oe||pe||!e||Pt.has(fn(e)))return;try{Wo()}catch{Ge();return}ot.cancel(),Jt.cancel(),Ce=void 0,me();const t={...e,design:Mo(e)},n=Bd(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Pr.invalidate(e),Ie(),n!==t&&be()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Nt&&v("source-dialog").hidden&&(e.preventDefault(),Cr(!1,!0))});function me(e=!0){const t=K();if(!t)return!1;const n=[v("viewport").scrollLeft,v("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Ot(),be(180,!1)),o}function Mr(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function Ai(){tl.close(),nl.close(),Ar.close(),wi.close(),Mr(al),wi.update()}function al(){const e=v("tabs");e.replaceChildren(),A.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===A.active?" active":""),n.draggable=$n(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",ko(t)!==void 0&&(n.dataset.activity=ko(t)),Io(t)!==void 0&&(n.dataset.object=Io(t));const o=document.createElement("button");li(o,"business",t.name),o.setAttribute("aria-current",String(t.key===A.active)),o.disabled=oe,o.onclick=async()=>{if(oe||vt&&vt!==t.key&&!await Bo())return;const s=me()||A.active!==t.key;Ue?.activateBusiness(),A.active=t.key,Ie(),Ue?.businessActivated(),be(180,s)};const i=ui("業務設計："+t.name+"を閉じる");i.disabled=oe,i.onclick=()=>rl(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),oe)return;const c=A.tabs.findIndex(a=>a.key===s.dataTransfer?.getData("text/plain")),d=A.tabs.indexOf(t);if(c>0&&d>0&&c!==d){const[a]=A.tabs.splice(c,1);A.tabs.splice(d,0,a),Ai(),be()}},n.onkeydown=s=>{if(!oe&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const c=A.tabs.indexOf(t),d=c+(s.key==="ArrowLeft"?-1:1);c>0&&d>0&&d<A.tabs.length&&([A.tabs[c],A.tabs[d]]=[A.tabs[d],A.tabs[c]],Ai(),be())}},e.append(n)})}const zs=new Map,Cn=new Set;function Uo(){const e=K(),t=!!e&&e.design.sourceFormat!=="json"&&Cn.has(qt(e)?.key??e.key)&&!e.checks;t||(Ar.close(),un.contains(document.activeElement)&&v("viewport").focus({preventScroll:!0})),un.hidden=!t;for(const n of["check-followup-open","check-followup-later"])v(n).disabled=ne||je||oe||!1||!e||en(e).busy===!0}v("check-followup-later").onclick=()=>{const e=K();e&&Cn.delete(qt(e)?.key??e.key),Uo()};let Ei;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])v("check-followup-"+e).onclick=()=>{Ei=v("check-followup-open"),v(t).click(),Ei=void 0};function _i(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Fi}function en(e){const t=qt(e)?.key??e.key;let n=zs.get(t);return n||(n={},zs.set(t,n)),n}async function Ji(e,t){if(!Wt(e))throw Error("原本文書が切り替わりました。");const n=Qt(A,A.recovery,{...A.document,checks:t},zi(A).views);await Fo(()=>n,()=>{A=n,t&&Cn.delete(qt(e)?.key??e.key)})}async function Lr(e,t){const n=en(e);if(e.design.sourceFormat==="json"||n.busy||oe||ne||pe===e)return;const o=Fn(e);n.busy=!0,n.error=void 0,n.candidate=void 0,zt();try{const i=await t();if(!Wt(e))return;if(o!==Fn(A.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=An(i),c=Vn(s,A.tabs[0]);if(c.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+c.reason);c.state==="unverified"?n.candidate=i:(await Ji(e,i),n.candidate=void 0,Ue?.openRelatedChecks(K()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,Re(n.error,"error")}finally{n.busy=!1,zt()}}async function Rr(e,t){const n=en(e);if(n.busy||oe||!Wt(e))return;const o=Vn(An(t),A.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,zt();return}n.busy=!0,n.error=void 0;try{await Ji(e,{...t,confirmedFor:Fn(A.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(K()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,zt()}}function zt(){Uo();const e=K(),t=v("detail"),n=e?en(e):void 0,o=e?e.key+":"+(e.selected??""):"";v("open-checks").disabled=ne||oe||pe===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const c=e.design.graph.nodes.find(f=>f.id===e.selected),d=ud(e,n,{disabled:ne||oe||pe===e,redraw:zt,confirm:f=>{Rr(e,f)}}),a=document.createElement("div");a.className="right-drawer-heading";const l=Ya(c?.name??"業務設計");if(c){const f=c.type==="business"?Dr(String(c.who),c.id):or(c);f.classList.add("drawer-node-icon"),l.prepend(f)}a.append(l);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{v("drawer").click(),v("drawer").focus({preventScroll:!0})},a.append(r),t.append(a),d.hasChildNodes()&&t.append(d),c){const f=Fd(e.design,c.id,Ki);f.hasChildNodes()&&t.append(f)}t.append(Oc(e.design,c?.id)),c?.type==="business"&&Ue?.appendActivityTestLinks(t,c.id),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Us=new Map,tt=()=>{const e=A.active??"";let t=Us.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Us.set(e,t)),t};function Ki(e){if(!K())return;const t=tt();t.mode="findings",t.finding=e,A.nodeDrawer=!0,innerWidth<=800&&(A.drawer=!1),et(),ut(),v("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),be()}function cl(e){const t=K();if(!t)return;const n=tt();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){Ki(o[0]);return}A.nodeDrawer=!0,innerWidth<=800&&(A.drawer=!1),et(),ut(),v("drawer-mode-findings").focus({preventScroll:!0}),be()}function dl(e,t){const n=tt().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!o&&!i)return tt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{tt().finding=void 0,ut(),v("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(Ud(o));else{const d=document.createElement("h2");d.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(d,ln(String(i.problem)))}const c=o?.targets??[i.id];if(c.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const l of c){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=l;const f=e.design.graph.nodes.some(h=>h.id===l),u=e.hiddenNodes?.includes(l);r.disabled=!f||!!u,r.textContent=(e.design.graph.nodes.find(h=>h.id===l)?.name??l)+(f?u?"（非表示）":"":"（参照先なし）"),r.onclick=()=>bo(l,!0),d.append(r)}t.append(d)}return!0}function Dr(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&K()?.design.model?.business.roles?Pi(K().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(En(Qs)),o}function $o(e,t=!0){ne||!K()||(ot.cancel(),me(),A.nodeDrawer=e,e&&tt().mode==="findings"&&innerWidth<=800&&(A.drawer=!1),et(),e&&K()?.selected&&Ln(K().selected),ut(),t&&v(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),be())}function Ln(e){const t=K(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=tt();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(Za(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(v("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function ll(e,t){const n=K();if(!n||ne||oe||pe===n)return;ot.cancel(),Ce=void 0,me();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],tn(),be()}function bo(e,t=!1){let n=K();if(n&&!Mo(n).graph.nodes.some(f=>f.id===e)&&(me(),Ue?.reopenBusinessOverview(),A.active=A.tabs[0].key,n=K(),Ie()),!n||n.hiddenNodes?.includes(e)||pe===n)return;t||(tt().finding=void 0);const o=v("node-list").contains(document.activeElement);ot.cancel(),Ce=void 0,me(),n.selected=e,Ln(e),et(),tn();const i=v("viewport"),s=i.getBoundingClientRect(),c=v("formattedMarkdownDrawer").getBoundingClientRect(),d=A.drawer&&c.left>s.left&&c.left<s.right?c.left:s.right,a=Math.max(1,Math.min(i.clientWidth,d-s.left-i.clientLeft)),l=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],Et(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],me(),o){const f=t?"[data-finding-target]":"[data-list-node]",u=Array.from(v("node-list").querySelectorAll(f)).find(h=>(t?h.dataset.findingTarget:h.dataset.listNode)===e);(t?u:u?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}be()}function ut(){const e=K(),t=tt(),n=v("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=v("drawer-modes");s.replaceChildren();for(const g of["findings"]){const p=document.createElement("button");p.id="drawer-mode-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.mode===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.mode===g?0:-1,p.textContent=`指摘（${e?$d(e.design):0}）`;const m=()=>{t.mode=g,ut(),v("drawer-mode-"+g).focus({preventScroll:!0})};p.onclick=m,p.onkeydown=S=>{["ArrowLeft","ArrowRight","Home","End"].includes(S.key)&&(S.preventDefault(),p.focus({preventScroll:!0}))},s.append(p)}for(const g of[v("node-categories"),v("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const c=v("node-list-search");c.value=t.search,c.disabled=!e||ne;const d=v("node-categories");d.replaceChildren();for(const[g,p]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const m=document.createElement("button");m.dataset.category=g,m.id="node-category-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.category===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.category===g?0:-1,m.textContent=p,m.onclick=()=>{t.category=g,ut(),v("node-category-"+g).focus({preventScroll:!0})},m.onkeydown=S=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(S.key))return;S.preventDefault();const C=["activity","object","role"],y=C.indexOf(g);t.category=S.key==="Home"?"activity":S.key==="End"?"role":C[(y+(S.key==="ArrowRight"?1:2))%3],ut(),v("node-category-"+t.category).focus({preventScroll:!0})},d.append(m)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=l.filter(g=>!a.has(g.id)).length,f=v("scope-outside"),u=r===l.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",u),f.setAttribute("aria-label",u==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(En(u==="false"?La:Ra)),f.disabled=!l.length||ne||pe===e;const h=v("show-outside");if(h.checked=u==="true",h.indeterminate=u==="mixed",h.setAttribute("aria-checked",u),h.disabled=f.disabled,v("scope-count").textContent=u==="mixed"?`${r}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(dl(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(m=>m.id===t.filterNode)?.name??t.filterNode)+"の指摘";const p=document.createElement("button");p.className="node-navigate finding-all",p.textContent="すべての指摘",p.onclick=()=>{t.filterNode=void 0,ut(),v("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,p)}n.append(Vd(e.design,t.resolved,g=>{t.resolved=g,ut(),n.querySelector("input")?.focus({preventScroll:!0})},Ki,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}v("node-list-toggle").onclick=()=>$o(!A.nodeDrawer);v("node-list-close").onclick=()=>$o(!1);v("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),$o(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!v("node-list-drawer").hidden&&v("source-dialog").hidden&&(e.preventDefault(),$o(!1))});v("node-list-search").oninput=()=>{tt().search=v("node-list-search").value,ut()};function Nr(){const e=K();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);ll(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}v("scope-outside").onclick=Nr;v("show-outside").onchange=Nr;const ul="http://www.w3.org/2000/svg",si=e=>document.createElementNS(ul,e),Pr=new bi,$s=new WeakMap;function fl(e){if(!nr(e.graph))return;let t=$s.get(e);return t||(t=Bc(e),$s.set(e,t)),t.wires}function pl(e,t,n){Di(v("edges"),e,t,{"data-relation":String(n)})}let Bn=()=>{},Dt=[0,0],_t=[0,0];function ml(){const e=v("node-list-drawer");return v("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function hl(){const e=v("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Et(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],_t[0]):0,i[1]<0||n[1]>0?Math.min(i[1],_t[1]):0],{growth:c,origin:d}=Ca(n,s,e.zoom),a=c.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+c[0],e.scroll[1]+c[1]],Ot(),be(180,!1));const l=Math.ceil(Math.max(1400,Dt[0],(ml()+e.scroll[0])/e.zoom-t[0]*2-d[0],...o.map(f=>f[0]+340))),r=Math.max(850,Dt[1],Math.max(Dt[1],...o.map(f=>f[1]+68))+hl()/e.zoom-t[1],(v("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...o.map(f=>f[1]+220));v("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",v("canvas").style.height=(r+d[1]+t[1]*2)*e.zoom+"px",v("nodes").style.left=(d[0]+t[0])*e.zoom+"px",v("nodes").style.top=(d[1]+t[1])*e.zoom+"px",v("edges").style.left=t[0]*e.zoom+"px",v("edges").style.top=t[1]*e.zoom+"px",v("nodes").style.width=l+"px",v("nodes").style.height=r+"px",v("nodes").style.transform=`scale(${e.zoom})`,v("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${r+d[1]}`),v("edges").style.width=(l+d[0])*e.zoom+"px",v("edges").style.height=(r+d[1])*e.zoom+"px",a&&(v("viewport").scrollLeft=e.scroll[0],v("viewport").scrollTop=e.scroll[1]),v("zoom").textContent=Math.round(e.zoom*100)+"%"}function tn(){Mr(bl)}function bl(){zo(),Jt.cancel(),Bn=()=>{},Dt=[0,0],_t=[0,0];const e=K();if(v("nodes").replaceChildren(),v("edges").replaceChildren(),v("empty").hidden=!!e,v("canvas").hidden=!e,!e){v("viewport").scrollLeft=0,v("viewport").scrollTop=0,zt(),ut();return}const t=Mo(e),n=t.graph.nodes,o=n.filter(r=>!e.hiddenNodes?.includes(r.id)),i=new Set(o.map(r=>r.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,c=e.positions,d=vo(t.graph.relations,s);Et(e),v("edges").append(Ri());const a=Gd(t.graph.relations,A.preferWrite===!0),l=()=>{const r=n.flatMap(m=>{const S=c[m.id];return S?[{id:m.id,x:S[0],y:S[1],width:260,height:68}]:[]}),f=fl(t),u=Pr.update(e,t,r,t.graph.relations,f),h=new Map;for(Dt=[0,0],_t=[0,0];v("edges").childNodes.length>1;)v("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(m=>[m.id,m.name]));t.graph.relations.forEach((m,S)=>{if(a.has(S))return;const C=u[S];if(!C||(Dt[0]=Math.max(Dt[0],C.bounds.right+20,C.label[0]+Math.max(30,m.label.length*12)/2+12),Dt[1]=Math.max(Dt[1],C.bounds.bottom+20,C.label[1]+22),_t[0]=Math.min(_t[0],...C.points.map(D=>D[0]-20),C.label[0]-Math.max(30,m.label.length*12)/2-12),_t[1]=Math.min(_t[1],...C.points.map(D=>D[1]-20),C.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(m)||!i.has(m.from)||!i.has(m.to)||e.showExceptions===!1&&(m.kind==="business-exception"||m.kind==="object-exception")))return;const y=si("path");y.setAttribute("d",C.path),y.dataset.relation=String(S),y.dataset.collisions=String(C.collisions),y.dataset.rerouted=String(C.rerouted),y.dataset.fallback=String(C.fallback),y.setAttribute("marker-end","url(#arrow)"),y.classList.add("edge"),m.kind.endsWith("exception")&&y.classList.add("exception"),d.related(m)&&(y.classList.add("review-related"),y.setAttribute("marker-end","url(#related-arrow)")),d.muted(m)&&y.classList.add("muted");const j=si("title");j.textContent=(g.get(m.from)??m.from)+" → "+(g.get(m.to)??m.to)+": "+m.label,y.append(j),v("edges").append(y),m.kind.endsWith("exception")&&pl(y,C,S);const k=tr(m,S,f?.[S]),x=h.get(k);if(x){x.dataset.relations+=" "+S,d.related(m)&&(x.classList.add("review-related"),x.classList.remove("muted"));return}const R=si("text");h.set(k,R),R.dataset.relations=String(S),R.setAttribute("x",String(C.label[0]-Math.max(30,m.label.length*12)/2)),R.setAttribute("y",String(C.label[1])),R.setAttribute("text-anchor","start"),R.classList.add("edge-label"),R.setAttribute("dominant-baseline","middle"),R.dataset.relation=String(S),d.related(m)&&R.classList.add("review-related"),d.muted(m)&&R.classList.add("muted"),R.textContent=m.label,v("edges").append(R)});const p=v("edges");for(const m of[...Array.from(p.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(p.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(p.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(p.querySelectorAll(".edge-label.review-related"))])p.append(m);Et(e)};Bn=l,l(),o.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+d.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=c[r.id][0]+"px",f.style.top=c[r.id][1]+"px",r.type==="business"?f.append(Dr(String(r.who),r.id)):f.append(or(r));const u=document.createElement("span");u.className="node-text";const h=document.createElement("span");h.className="review-kind",h.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),u.append(h);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,u.append(g),r.type==="business"){const y=document.createElement("small");y.textContent=String(r.who),u.append(y)}if(f.append(u),Da(r.id,$n(e))){const y=document.createElement("button");y.type="button",y.className=r.type==="business"?"activity-open":"object-open",y.setAttribute("aria-label",r.name+"の詳細タブを開く"),y.title="詳細タブを開く",y.append(En(Sn)),y.onpointerdown=j=>j.stopPropagation(),y.onpointerup=j=>j.stopPropagation(),y.onclick=j=>{j.stopPropagation(),r.type==="business"?Oi(r.id):Tr(r.id),Ue?.businessActivated()},f.append(y)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const p=zd(e.design,r);if(p.length){const y=document.createElement("button");y.type="button",y.className="finding-badges",y.textContent=p.join(" · "),y.setAttribute("aria-label",r.name+"の指摘を開く"),y.onpointerdown=j=>j.stopPropagation(),y.onpointerup=j=>j.stopPropagation(),y.onclick=j=>{j.stopPropagation(),cl(r.id)},f.append(y),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+p.join("、"))}let m;const S=f;S.onpointerdown=y=>{y.button!==0||pe===e||gt||(y.stopPropagation(),S.setPointerCapture(y.pointerId),m=y.pointerId,Jt.begin(r.id,[y.clientX,y.clientY]))},S.onpointermove=y=>{m===void 0||y.pointerId!==void 0&&y.pointerId!==m||!f.isConnected||pe===e||Jt.move([y.clientX,y.clientY])},S.onpointerup=y=>{if(m===void 0||m!==y.pointerId||(m=void 0,!f.isConnected||pe===e))return;const j=Jt.end();S.hasPointerCapture?.(y.pointerId)&&S.releasePointerCapture(y.pointerId),j&&(j.moved||(tt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Ot()),Ln(r.id)),me(),tn(),be(180,!1))};const C=y=>{m===void 0||m!==y.pointerId||(m=void 0,f.isConnected&&(Jt.cancel(),me(),be(180,!1)))};S.onpointercancel=C,S.onlostpointercapture=C,v("nodes").append(f)}),v("zoom").textContent=Math.round(e.zoom*100)+"%",zt(),ut()}function Oi(e){ne||oe||pe||(me(),td(A,e),Ie(),be(),v("viewport").focus({preventScroll:!0}))}function Tr(e){ne||oe||pe||(me(),nd(A,e),Ie(),be(),v("viewport").focus({preventScroll:!0}))}function Ie(){document.title=A.document?A.document.name+" · Alder Viewer":"Alder Viewer",ot.cancel(),Ce=void 0,et(),Ai(),tn();const e=K();e&&(v("viewport").scrollLeft=e.scroll[0],v("viewport").scrollTop=e.scroll[1]),v("refresh").toggleAttribute("disabled",ne||oe||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Pt.has(fn(e))),v("refresh").hidden=!e,v("view-markdown").toggleAttribute("disabled",ne||je||oe||!1||!e||Pt.has(fn(e))),v("view-markdown").hidden=!e,v("open-checks").hidden=!e||e.design.sourceFormat==="json",v("open-checks").toggleAttribute("disabled",ne||je||oe||!1||!e||!!(e&&en(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])v(t).toggleAttribute("disabled",ne||je||oe);v("open-sample").setAttribute("aria-disabled",String(ne||je||oe)),v("open-sample").tabIndex=ne||je||oe?-1:0,v("theme").toggleAttribute("disabled",ne),_n(),Uo(),Qd(),Ho(),Ue?.syncDocument()}async function Xn(e){const t=A.document,n=Qc(A,e);return t?(await Fo(()=>n,()=>{A=n,Cn.add(qt(A.tabs[0])?.key??A.tabs[0].key)}),!0):(me(),A=n,Cn.add(qt(A.tabs[0])?.key??A.tabs[0].key),Ie(),be(),!0)}async function qr(e,t){if(vt&&!await Bo())return;const n=await So(e),o=K();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await Gn(o,n,t))return;Ue?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),be();return}const i=Mn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await Xn(i)}v("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])v("guide-"+e).onclick=()=>v(e).click();v("open-sample").onpointerdown=e=>e.stopPropagation();v("open-sample").onclick=async e=>{if(e.preventDefault(),!(ne||je||oe))try{if(A.document?.source?.kind==="sample"&&A.document.design.markdown===Ts){me(),Ue?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),v("viewport").focus({preventScroll:!0});return}const t=pn(Ts),n=A.document?.source?.kind==="sample"&&A.document.design.markdown===Fi?A.tabs[0]:void 0;n&&me();const o=n??A.sampleLayout,i=o?Xd(o,t):{},s=Mn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await Xn(s)&&v("viewport").focus({preventScroll:!0})}catch(t){Re("サンプルを開けません: "+t.message,"error")}};v("open").onclick=async()=>{if(!(ne||je||oe)){je=!0,Ie();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await qr(await n.getFile(),n)}else v("fallback").click()}catch(e){e.name!=="AbortError"&&Re("開けません: "+e.message,"error")}finally{je=!1,Ie()}}};v("fallback").onchange=async()=>{const e=v("fallback");if(!(ne||je||oe)){je=!0,Ie();try{for(const t of Array.from(e.files??[]))await qr(t)}catch(t){Re("開けません: "+t.message,"error")}e.value="",je=!1,Ie()}};class jn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function Fo(e,t){if(oe||pe)throw Error("表示を切り替えています。完了後に再試行してください。");try{Wo()}catch(i){throw new jn(i)}me(),clearTimeout(Xt),Xt=void 0,oe=!0,yt++;const n=yt;Ie(),Ge();let o=!1;try{const i=structuredClone(zi(e()));await Or(i,n);const s=A;t(),A!==s&&(A=od(A,s)),Qe==="view"&&vt&&!A.tabs.some(c=>c.key===vt)&&(vt=A.tabs[0]?.key),Er(i),o=!0}catch(i){throw Hi(),new jn(i)}finally{oe=!1,Ie(),Ge(),o&&yt!==n&&be(0,!1)}}async function Gn(e,t,n=e.handle,o=!1){if(!Wt(e)||e.design!==A.document?.design)return!1;const i=ed(A,t,n,o);return await Fo(()=>i,()=>{A=i}),dn=void 0,Ho(),Re(""),!0}async function Fs(e){if(!Wt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await Gn(e,await So(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const c=i.files?.[0];c&&await Gn(e,await So(c)),s()}catch(c){i.remove(),o(c)}},i.click()})}v("refresh").onclick=async()=>{const e=K();if(ne||oe||pe||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Pt.has(fn(e)))return;vt===e.key&&Oo();const t=fn(e);Pt.add(t),Ie();try{if(e.source?.kind==="url"){const o=await Do(e.source.url);await Gn(e,o);return}if(!e.handle){await Fs(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Wt(e))return;if(n!=="granted"){Re("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Fs(e);return}await Gn(e,await So(await e.handle.getFile()))}catch(n){Wt(e)&&n.name!=="AbortError"&&!(n instanceof jn)&&Re("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Pt.delete(t),Ie()}};let Qe="text",vt,Tt=!1,Zt=0,Eo,Ci=null;const At=()=>v("source-text"),Hn=()=>v("source-url");function Xi(){ki=!v("source-dialog").hidden&&Qe!=="view"&&(Qe==="text"?At().value:Hn().value)!=="",Ge()}Hn().addEventListener("input",Xi);function _n(){ji();const e=Qe==="view",t=Tt||oe;At().disabled=t,At().readOnly=e,v("source-dialog").dataset.mode=Qe,v("source-submit").hidden=e,v("source-submit").textContent="表示",v("source-submit").disabled=t||e,v("source-cancel").disabled=oe||t&&Qe!=="url",v("source-cancel").textContent=e?"閉じる":"キャンセル",Xi(),queueMicrotask(Ur)}function Zi(e,t){if(!(ne||je||oe||t&&Pt.has(fn(t)))){Eo?.abort(),Zt++,Qe=e,vt=t?.key,Tt=!1,Ci=document.activeElement,v("source-dialog").hidden=!1,v("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${A.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])v(n).hidden=e!=="url";for(const n of["text-label","source-text"])v(n).hidden=e==="url";v("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?At().value=t.design.markdown:e==="text"&&(At().value=Vo),_n(),(e==="url"?Hn():At()).focus()}}let Vo="",mo;function gl(){if(Ci?.isConnected&&Ci.focus({preventScroll:!0}),mo!==void 0&&cancelAnimationFrame(mo),Qe!=="view")return;const e=Zt;mo=requestAnimationFrame(()=>{if(mo=void 0,e!==Zt||!v("source-dialog").hidden)return;const t=window.visualViewport,n=ft.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Oo(){Zt++,Eo?.abort(),Tt=!1,vt=void 0,v("source-dialog").hidden=!0,_n(),gl()}async function Bo(){return oe?!1:(Qe==="text"&&(Vo=At().value),Oo(),!0)}function Wr(){return Bo()}At().oninput=()=>{Qe==="text"&&(Vo=At().value,Xi())};let go=!1;function zr(){return ne||je||Tt||oe||pe?"読込が終わってから共有してください。":Hd(K())}function ji(){const e=zr(),t=v("share-source");t.hidden=!K(),t.setAttribute("aria-disabled",String(go||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}v("share-source").onclick=async()=>{if(go)return;const e=zr();if(e){Re(e,"warning");return}const t=K();if(t.source?.kind!=="url")return;const n=t.source.url,o=_d(location.href,n);go=!0,ji();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),Re("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{Re("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{go=!1,ji()}};let Rt,gn=0,Vs=0,Un;function Ur(){if(ne||je||Tt||pe||oe||Rt||Un===void 0)return;const e=Un;Un=void 0,Yi(e)}async function Yi(e=location.hash){const t=e;if(ne)return;const n=++Vs;if(!/^#source(?:=|$)/.test(t)){Un=void 0,Rt&&!oe&&(Rt.abort(),Rt=void 0,gn++,je=!1,Ie());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),oe){Un=t;return}if(Tt||je&&!Rt){Re("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++gn;Rt?.abort();try{const i=Jd(t);Wo();const s=A.tabs.find(l=>l.source?.kind==="url"&&l.source.url===i),c=s;if(c){if(vt&&vt!==c.key&&!await Bo()||o!==gn||n!==Vs)return;const l=me()||A.active!==c.key;A.active=c.key,Ie(),be(180,l),Re("開いている共有元のタブを選択しました。表示内容は保持しています。"),Zn();return}Rt=new AbortController,je=!0,Ie();const d=await Do(i,Rt.signal);if(o!==gn)return;const a=Mn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await Xn(a))return;Re("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===gn&&!(i instanceof jn)&&Re("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===gn&&(Rt=void 0,je=!1,Ie(),Ur())}}window.addEventListener("hashchange",()=>{Yi().then(()=>{A.document?.key===Mi&&Zn()})});function Qi(e){A.drawer=!0,et(),zt()}async function yl(e){const t=en(e);if(!(e.design.sourceFormat==="json"||t.busy||oe||ne||pe===e)){t.busy=!0;try{await Ji(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,zt()}}}let Co;xt.onchange=()=>{const e=xt.files?.[0],t=Co??K();Co=void 0,xt.value="",!(!e||!t||!Wt(t))&&(Qi(),Lr(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};xt.oncancel=()=>{Co=void 0};v("check-open").onclick=()=>{Co=K(),xt.click()};let es,yo=null;function ts(){Ut.hidden=!0,es=void 0,(yo&&!yo.closest("[hidden]")?yo:v("open-checks").getBoundingClientRect().width?v("open-checks"):v("document-actions-toggle")).focus({preventScroll:!0})}v("check-open-url").onclick=()=>{const e=K();e&&(yo=Ei??document.activeElement,es=e,v("check-url").value=en(e).url??"",Ut.hidden=!1,v("check-url").focus())};v("check-url-cancel").onclick=ts;Ut.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),ts())};v("check-url-form").onsubmit=e=>{e.preventDefault();const t=es;if(!t||!Wt(t))return;const n=v("check-url").value.trim();en(t).url=n,ts(),Qi(),Lr(t,async()=>({name:n,url:n,markdown:await qd(n)}))};v("check-open-sample").onclick=()=>{const e=K();!e||!_i(e)||(Qi(),Rr(e,{name:"チェックリストのサンプル",markdown:Zd}))};v("check-close").onclick=()=>{const e=K();e&&yl(e)};v("open-sample-menu").onclick=()=>{v("open-sample").click()};v("view-markdown").onclick=()=>{const e=K();e&&Zi("view",e)};v("open-url").onclick=()=>Zi("url");v("open-text").onclick=()=>Zi("text");v("source-cancel").onclick=()=>Wr();v("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Wr())};v("source-submit").onclick=async()=>{if(Tt||oe||Qe==="view"&&pe||v("source-dialog").hidden||Qe==="view")return;Tt=!0,_n();const e=++Zt,t=Qe;Eo=new AbortController;try{const n=Qe==="url"?new URL(Hn().value.trim()).href:Hn().value.trim();if(t==="url"&&A.document?.source?.kind==="url"&&A.document.source.url===n){Ue?.reopenBusinessOverview(),A.active=A.tabs[0].key,Oo(),Ie(),Zn();return}const o=t==="url"?await Do(n,Eo.signal):Wd(At().value),i=o.markdown;if(e!==Zt)return;const s=Mn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await Xn(s))return;Re(""),t==="text"&&(Vo=i),Oo()}catch(n){e===Zt&&!(n instanceof jn)&&Re("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===Zt&&(Tt=!1,_n())}};v("layout-lock").onclick=()=>{ne||(ot.cancel(),Ce=void 0,me(),gt=!gt,et(),tn())};v("selected-edges-only").onchange=()=>{const e=K();!e||ne||oe||pe===e||(ot.cancel(),Ce=void 0,me(),e.selectedEdgesOnly=v("selected-edges-only").checked,Bn(),be())};v("show-exceptions").onchange=()=>{const e=K();!e||ne||oe||pe===e||(ot.cancel(),Ce=void 0,me(),e.showExceptions=v("show-exceptions").checked,Bn(),be())};v("prefer-write").onchange=()=>{ne||(me(),A.preferWrite=v("prefer-write").checked,tn(),be())};v("theme").onclick=()=>{ne||(A.dark=!A.dark,et(),be())};v("drawer").onclick=()=>{ne||!K()||(me(),A.drawer=!A.drawer,Ie(),be())};for(const[e,t]of[["in",fs],["out",1/fs]])v(e).onclick=()=>{const n=K();if(n&&pe!==n){const o=me(),i=xa({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,Ie(),be(180,s)}};const ve=v("viewport");function $r(e,t){const n=K();if(!n||oe||pe===n)return;me();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Ot();const i=Array.from(v("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),Bn()}const Jt=Oa({read:()=>{const e=K();return e&&!oe&&e!==pe&&!gt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>K()?.positions[e],connected:e=>Array.from(v("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=ve.getBoundingClientRect(),t=e.left+ve.clientLeft,n=e.top+ve.clientTop,o={left:t,top:n,right:t+ve.clientWidth,bottom:n+ve.clientHeight};for(const[s,c]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=v(s),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=o.bottom||(c==="right"&&a.left>o.left&&a.left<o.right&&(o.right=a.left),c==="left"&&a.right>o.left&&a.right<o.right&&(o.left=a.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:$r,pan:e=>{const t=K();if(!t||t===pe||gt)return;me();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Et(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],me(),Ot()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),ot=Aa(ve,{nodeDrag:Jt,read:()=>{const e=K();return e&&!oe&&pe!==e?{key:e.key,zoom:e.zoom,locked:gt,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},position:e=>K()?.positions[e],change:e=>{const t=K();if(!t||oe||pe===t)return;const n=t.scroll;let o=!1;e.node&&$r(e.node.id,e.node.position),e.selected&&(tt().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Ln(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?tn():e.zoom!==void 0&&Et(t),e.scroll&&(ve.scrollLeft=e.scroll[0],ve.scrollTop=e.scroll[1]),me(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ot()},finish:()=>{const e=K();e&&Et(e),me(),be(180,!1)}}),ns=()=>{ot.cancel(),Ce=void 0,me(),be(0,!1)};window.addEventListener("blur",ns);window.addEventListener("pagehide",ns);document.addEventListener("visibilitychange",()=>{document.hidden&&ns()});ve.onscroll=()=>{me()};let Ce;Ea(ve,{read:()=>{const e=K();return e&&!ne&&!oe&&e!==pe?{zoom:e.zoom,scroll:[ve.scrollLeft,ve.scrollTop]}:void 0},change:e=>{const t=K();!t||oe||t===pe||(ot.cancel(),Jt.cancel(),Ce=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Et(t),ve.scrollLeft=t.scroll[0],ve.scrollTop=t.scroll[1],me(!1),Ot(),be(180,!1))}});ve.onpointerdown=e=>{const t=K(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||oe||t===pe||n&&!gt||(Ce={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[ve.scrollLeft,ve.scrollTop],node:n,moved:!1},ve.setPointerCapture(e.pointerId))};ve.onpointermove=e=>{if(Ce&&Ce.pointer===e.pointerId&&Ce.key===K()?.key&&K()!==pe){const t=e.clientX-Ce.x,n=e.clientY-Ce.y;Math.hypot(t,n)>3&&(Ce.moved=!0),ve.scrollLeft=Ce.scroll[0]-t,ve.scrollTop=Ce.scroll[1]-n,me()}};ve.onpointerup=e=>{if(!Ce||Ce.pointer!==e.pointerId)return;const t=K(),n=Ce;Ce=void 0,ve.hasPointerCapture?.(e.pointerId)&&ve.releasePointerCapture(e.pointerId),t&&t!==pe&&n.key===t.key&&!n.moved&&n.node&&(tt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ot()),Ln(n.node),tn()),me(),be(180,!1)};ve.onpointercancel=()=>{Ce=void 0};ve.addEventListener("lostpointercapture",e=>{e.target===ve&&Ce?.pointer===e.pointerId&&(Ce=void 0)});let Go=!1;v("resize").onpointerdown=e=>{ne||(Go=!0,v("resize").setPointerCapture(e.pointerId))};v("resize").onpointermove=e=>{if(Go){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==A.width&&(A.width=t,Ot()),et()}};v("resize").onpointerup=()=>{Go=!1,be(180,!1)};v("resize").onpointercancel=()=>{Go=!1,be(180,!1)};v("resize").onkeydown=e=>{if(!ne&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,A.width+(e.key==="ArrowLeft"?20:-20)));t!==A.width&&(A.width=t,Ot()),et(),be(180,!1)}};window.addEventListener("resize",()=>{et();const e=K();e&&Et(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=K();t&&Et(t)});e.observe(v("viewport")),e.observe(document.querySelector(".toolbar"))}function ho(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=pn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");An(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Rn=document.createElement("section");Rn.id="source-update-notice";Rn.className="info-bar";Rn.hidden=!0;Rn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Rn);let dn;const Fr=new Set;let ri=0,Mi,ai;function Ho(){const e=A.document;Rn.hidden=!dn||dn.key!==e?.key||dn.baseline!==e.design.markdown||Fr.has(e.key),v("source-update-refresh").disabled=ne||je||oe||!!(e&&Pt.has(e.key))}v("source-update-close").onclick=()=>{dn&&Fr.add(dn.key),Ho()};v("source-update-refresh").onclick=()=>{v("refresh").click()};async function Zn(){const e=A.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(ai===t)return;ai=t;const n=++ri,o=e.key,i=e.source.url,s=e.design.markdown;try{const c=await Ui(i);if(n!==ri||A.document?.key!==o||A.document.design.markdown!==s||A.document.source?.kind!=="url"||A.document.source.url!==i)return;pn(c),dn=c.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,Ho()}catch{}finally{n===ri&&(ai=void 0)}}Ue=Nc(ft,{rightDrawer:{isOpen:()=>A.drawer,isReady:()=>!ne,setOpen:e=>{ne||(A.drawer=e,et(),be())}},capture:()=>{me(),ot.cancel(),Ce=void 0},business:()=>({key:A.document?.key,design:A.document?.design,relatedChecks:A.tabs[0]?ld(A.tabs[0]):[],viewKey:K()?.key,views:A.tabs.map(e=>({key:e.key,name:e.name,activity:ko(e),object:Io(e)})),activities:A.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:A.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:A.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!A.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=A.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Oi(e),bo(e)},openObject:e=>{Tr(e),bo(e)},openOverview:()=>{A.tabs[0]&&(me(),Ue?.reopenBusinessOverview(),A.active=A.tabs[0].key,Ie(),be())},activateView:e=>{A.tabs.some(t=>t.key===e)&&(me(),A.active=e,Ie(),be())},statePanel:e=>A.document?Wc(A.document.design,e,t=>{Ue?.activateBusiness(),Oi(t),bo(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{A.nodeDrawer=!1,et()},refresh:()=>{et(),wi.update()}});const vl=A;Ie();Ge();_c().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])ho(l);if(t.document){const l={...t.document};ho(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)ho(l)}const n=Yc(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const l of o.tabs)ho(l);if(new Set(o.tabs.map(l=>l.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(r=>typeof r=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(r=>Number.isFinite(r)&&r>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:c,...d}=o,a=l=>({...l,hiddenNodes:l.hiddenNodes??(o.scopeOutside==="hide"?l.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});A=Qt({...d,tabs:o.tabs.map(a)},n.recovery,n.document,o.tabs.map(l=>{const{design:r,checks:f,source:u,draft:h,edited:g,handle:p,name:m,...S}=a(l);return S})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(A.sampleLayout={...o.sampleLayout,hiddenNodes:pn(Fi).graph.nodes.filter(l=>!l.scope).map(l=>l.id)}),A.tabs.some(l=>l.key===A.active)||(A.active=A.tabs[0]?.key),K()?.selected&&Ln(K().selected),Mi=A.document?.key,Ie(),Vi=!0}).catch(()=>{A=vl,On=!0,Bi()}).finally(()=>{ne=!1,Ie(),Ge(),Yi().then(()=>{A.document?.key===Mi&&Zn()})});
