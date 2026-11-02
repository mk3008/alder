import{L as ur,D as Ca,G as Ma,W as Da,P as La,l as Vn,X as fr,C as Ra,n as Na,S as pr,o as mr,p as hr,M as br,q as gr,s as yr,t as Xo,g as Zo,r as xo,d as vr,b as Li,u as Yo,U as wr,v as Ta,w as kr,x as Ir,y as Ao,z as Pa,m as Qo,A as qa,B as Sr,E as $a,j as Wa,F as Rs,H as za,T as Ua,I as Fa,J as Va,R as Ba,K as Ga,N as Ha,O as Ja,Q as _a,V as Ka,Y as Xa,Z as Ns,k as Za,i as Ya,h as Qa,f as ec,a as tc,_ as nc,$ as ic,a0 as xr,a1 as oc,a2 as sc,e as rc}from"./canvas-toolbar-Ch5Zpft_.js";const ac={subsystems:{full:"サブシステム",icon:La},business:{full:"業務設計",icon:Da},states:{full:"状態遷移",icon:Ma},concept:{full:"データ構造",icon:Ca},tests:{full:"テスト仕様",icon:ur}};function Eo(e,t,n){const i=ac[t],o=document.createElement("span"),s=document.createElement("span"),r=document.createElement("span");o.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Vn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),r.className="view-tab-name",r.textContent=n,o.append(s,r),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function Oo(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Vn(fr,{"aria-hidden":"true","stroke-width":1.8})),t}function cc(e){const t=Vn(e?Ra:Na,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function dc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,r=Math.max(0,Math.min(n,s+i*o));r!==s&&(e.scrollLeft=r,t.preventDefault())},{passive:!1})}function lc(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const uc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Ts(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=uc,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,s)=>{const r=Vn(o,{"stroke-width":1.8,"aria-hidden":"true"});s&&r.classList.add(s),t.querySelector(i)?.append(r)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",pr),n(".layout-lock",mr,"lock-closed"),n(".layout-lock",hr,"lock-open"),n(".zoom-out",br),n(".zoom-in",gr)}function Ps(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function fc({model:e}){const t=Object.fromEntries(e.concepts.map(a=>[a.id,{name:a.name,note:a.description,fields:a.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==a.subsystemId?"（担当："+e.subsystems.find(c=>c.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(a=>[a.fromConceptId,a.toConceptId,a.fromLabel,a.toLabel,a.kind]),i=e.reviewGroups.map(a=>({id:a.id,name:a.title,purpose:a.description,activities:a.relatedActivityIds,concepts:Object.fromEntries(a.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(c=>["",c]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:a.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),o=a=>i.find(l=>l.id===a),s=(a,l)=>{const c=Object.fromEntries(a.nodes.map(p=>[p.id,{...l[p.conceptId],name:p.name,note:p.description,sources:p.sources,conceptId:p.conceptId,subsystemId:p.subsystemId,fields:p.fields.map(g=>["",g.name])}])),h=e.subsystems.filter(p=>a.nodes.some(g=>g.subsystemId===p.id)).map(p=>({id:p.id,name:p.name})),u=a.handoffIds.map(p=>e.handoffs.find(g=>g.id===p)).map(p=>({id:p.id,from:p.fromSubsystemId,to:p.toSubsystemId,label:p.information,returning:p.flowDirection==="return"}));return{ids:a.nodes.map(p=>p.id),tables:c,edges:a.edges.map(p=>[p.fromViewId,p.toViewId,p.fromLabel,p.toLabel,p.kind]),regions:h,handoffs:u}};return{tables:t,edges:n,groups:i,findGroup:o,graph:a=>{const l=o(a);if(!l)throw Error("Unknown review group: "+a);const c=e.reviewGroups.find(p=>p.id===a),h=c.graph.subsystemViews;if(h)return s(h,l.concepts);const u=Object.keys(t).filter(p=>Object.hasOwn(l.concepts,p));return{ids:u,tables:l.concepts,edges:l.relations.filter(([p,g])=>u.includes(p)&&u.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function ot(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function pc(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",ot(i,"span",t),i.onclick=n,e.append(i),i}function mc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function hc(e,t,n,i=()=>{},o=()=>{},s=[]){const r=n.contentFor(t.id);if(e.replaceChildren(),!r)return;ot(e,"p",r.description).className="review-description",ot(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const a of r.relatedActivities){const l=document.createElement("li"),c=s.find(u=>u.id===a.id&&u.name===a.name),h=pc(l,a.name,()=>{c&&o(c.id)});h.disabled=!c,h.setAttribute("aria-label",a.name+"を業務タブで開く"),d.append(l)}e.append(d),ot(e,"h3","情報の構造");for(const a of r.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=a.id,ot(l,"h4",a.title),ot(l,"p",a.description),e.append(l)}ot(e,"h3","できること");for(const a of r.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=a.id,ot(l,"h4",a.title),ot(l,"p",a.description);for(const c of a.samples){const h=i(a.id,c.id),u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=c.id,u.textContent=(h?.kind==="decision"?"可否判定：":"サンプル：")+c.name,h?u.onclick=h.open:(u.disabled=!0,u.title="対応するテスト仕様へのリンクがありません"),l.append(u)}e.append(l)}ot(e,"h3","できないこと（業務上のルール）");for(const a of r.limitations){const l=document.createElement("section");l.className="review-limitation",ot(l,"h4",a.title),ot(l,"p",a.description),ot(l,"h5","理由"),ot(l,"p",a.reason),e.append(l)}}function sn(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function bc({model:e,business:t}){const n=r=>r.kind==="group"?e.subsystems.find(d=>d.id===r.id):e.handoffs.find(d=>d.id===r.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(r){const d=n(r);return d?d.activityIds.map(a=>t.activities.find(l=>l.id===a)).filter(Boolean):[]}function s(r,d){if(r.replaceChildren(),d.kind==="group"){const h=e.subsystems.find(p=>p.id===d.id);if(!h)return"";sn(r,"p",h.purpose),sn(r,"h3","扱う情報");const u=r.ownerDocument.createElement("ul");for(const p of h.information)sn(u,"li",p);return r.append(u),sn(r,"h3","まとまりの理由"),sn(r,"p",h.reason),h.name}const a=e.handoffs.find(h=>h.id===d.id);if(!a)return"";sn(r,"p",a.description),sn(r,"h3","出元と受取先");const l=e.subsystems.find(h=>h.id===a.fromSubsystemId),c=e.subsystems.find(h=>h.id===a.toSubsystemId);return sn(r,"p",`${l.name} → ${c.name}`),a.information}return{sections:i,activities:o,describe:s}}function qs(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const s=()=>{let d=t.clientWidth||innerWidth;const a=t.querySelector("#design-explorer");return innerWidth>800&&a&&!a.hidden&&(d-=a.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},r=(d,a=!1)=>{if(o=Math.max(280,Math.min(s(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(s())),i.setAttribute("aria-valuenow",String(Math.round(o))),a)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),r(d.key==="Home"?280:d.key==="End"?s():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const a=d.clientX,l=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=c=>r(l+a-c.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),r(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>r(o));d.observe(t);const a=t.querySelector("#design-explorer");a&&d.observe(a)}window.addEventListener("resize",()=>r(o)),r(o)}const gc=260,yc=68,vc="http://www.w3.org/2000/svg",Tt=(e,t,n={})=>{const i=e.createElementNS(vc,t);for(const[o,s]of Object.entries(n))i.setAttribute(o,String(s));return i};function wc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Vn(wr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function kc(e,{model:t,business:n},i,o,s){const r=t.reviewGroups,d=t.subsystems,a=t.presentation.landscapeRelationships.map(I=>{const O=r.find(R=>R.id===I.from),D=r.find(R=>R.id===I.to);if(!O||!D||O.subsystemId!==D.subsystemId||!t.presentation.reviewBoundaries.some(R=>R.from===I.from&&R.to===I.to))throw Error("Unknown overview relationship: "+I.from+" -> "+I.to);return I}),l=t.handoffs.map(I=>{if(!["forward","return"].includes(I.flowDirection))throw Error("Unknown overview handoff direction: "+I.id);return{id:I.id,from:I.fromSubsystemId,to:I.toSubsystemId,label:I.information,returning:I.flowDirection==="return"}});if(new Set(l.map(I=>I.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const I of l)if(!d.some(O=>O.id===I.from)||!d.some(O=>O.id===I.to)||I.from===I.to||!I.label.trim())throw Error("Unknown overview handoff: "+I.id);for(const I of r){if(!d.some(O=>O.id===I.subsystemId))throw Error("Unknown overview subsystem: "+I.id);if(!n.roles?.some(O=>O.id===I.reviewer.roleId))throw Error("Unknown overview reviewer: "+I.id)}const c=d.flatMap(I=>r.filter(O=>O.subsystemId===I.id)),h=new Map;let u=0;for(const[I,O]of d.entries())for(const D of c.filter(R=>R.subsystemId===O.id))h.set(D.id,[80+u*170,100+u*120+I*64]),u++;const p=Xo(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,f;try{const I=JSON.parse(localStorage.getItem(g)||"null"),O=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),D=!I&&O?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,R=I??D;if(R){typeof R.zoom=="number"&&Number.isFinite(R.zoom)&&(p.zoom=Math.max(.25,Math.min(2.5,R.zoom))),Array.isArray(R.scroll)&&R.scroll.length===2&&R.scroll.every(M=>typeof M=="number"&&Number.isFinite(M))&&(p.scroll=R.scroll),typeof R.locked=="boolean"&&(p.locked=R.locked);for(const[M,G]of Object.entries(R.positions??{}))r.some(q=>q.id===M)&&Array.isArray(G)&&G.length===2&&G.every(q=>typeof q=="number"&&Number.isFinite(q))&&p.positions.set(M,[G[0],G[1]])}const x=R?.selection,T=x?.kind==="node"?t.concepts.find(M=>M.id===x.id)?.subsystemId:x?.id,N=x?.kind==="node"?"group":x?.kind;typeof T=="string"&&(N==="model"&&r.some(M=>M.id===T)||N==="group"&&d.some(M=>M.id===T)||N==="connection"&&l.some(M=>M.id===T))&&(f={kind:N,id:T}),f?.kind==="model"&&(p.selected=f.id)}catch{}const y=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:p.zoom,scroll:p.scroll,locked:p.locked,positions:Object.fromEntries(p.positions),selection:f}))}catch{}},S=I=>{if(!I&&!f)return;f=I,p.selected=I?.kind==="model"?I.id:void 0;const O=m?.querySelector(".diagram-world>svg");O&&v(O),y()},v=I=>{const O=Li(a,p.selected),D=Li(l,f?.kind==="group"?f.id:void 0);for(const R of r){const x=I.querySelector(`[data-node="${R.id}"]`);x?.setAttribute("class","node graph-shape state-shape"+O.nodeClasses(R.id)),x?.setAttribute("aria-pressed",String(p.selected===R.id))}for(const R of d){const x=I.querySelector(`[data-subsystem="${R.id}"]`);x?.setAttribute("class","subsystem-overview-group"+D.nodeClasses(R.id)),x?.querySelector("button")?.setAttribute("aria-pressed",String(f?.kind==="group"&&f.id===R.id))}for(const R of a){const x=I.querySelector(`[data-overview-from="${R.from}"][data-overview-to="${R.to}"]`);x?.setAttribute("class","edge"+(O.related(R)?" review-related":"")),x?.setAttribute("marker-end",`url(#overview-${O.related(R)?"related-arrow":"arrow"})`)}for(const R of l){const x=D.related(R)||f?.kind==="connection"&&f.id===R.id,T=I.querySelector(`[data-handoff-id="${R.id}"]`);T?.setAttribute("class","edge"+(R.returning?" exception":"")+(x?" review-related":"")),T?.setAttribute("marker-end",`url(#overview-${x?"related-arrow":"arrow"})`),I.querySelector(`[data-handoff-label="${R.id}"]`)?.classList.toggle("review-related",!!x)}I.querySelectorAll("[data-exception-paint]").forEach(R=>R.remove());for(const R of Array.from(I.querySelectorAll("[data-handoff-id].exception")))Yo(I,R,{path:R.getAttribute("d")},{"data-overview-return-paint":R.getAttribute("data-handoff-id")})};return m=yr(e,I=>{const O=c.map(N=>{const M=I.positions.get(N.id)??h.get(N.id);return{id:N.id,x:M[0],y:M[1],width:gc,height:yc}}),D=Tt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});D.append(Zo("overview-"));let R=0,x=0;const T=[];for(const N of d){const M=O.filter(we=>r.find(Me=>Me.id===we.id)?.subsystemId===N.id);if(!M.length)continue;const G=Math.min(...M.map(we=>we.x))-30,q=Math.min(...M.map(we=>we.y))-48,ae=Math.max(...M.map(we=>we.x+we.width))-G+30,te=Math.max(...M.map(we=>we.y+we.height))-q+30;T.push({id:N.id,x:G,y:q,width:ae,height:te});const ne=Tt(e,"g",{"data-subsystem":N.id,"aria-label":N.name}),pe=Tt(e,"rect",{x:G,y:q,width:ae,height:te,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});pe.addEventListener("click",()=>S({kind:"group",id:N.id})),ne.append(pe);const he=Tt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:G+8,y:q+3,width:ae-16,height:36}),Ne=e.createElement("button");Ne.type="button",Ne.className="subsystem-overview-region-title",Ne.setAttribute("aria-label",N.name+"を選択"),Ne.textContent=N.name,Ne.onclick=()=>S({kind:"group",id:N.id}),he.append(Ne),ne.append(he),D.append(ne),R=Math.max(R,G+ae+40),x=Math.max(x,q+te+40)}for(const[N,M]of l.entries()){if(!T.some(ne=>ne.id===M.from)||!T.some(ne=>ne.id===M.to))throw Error("Missing overview handoff region: "+M.id);const G=Math.max(30,M.label.length*12),q=xo({from:M.from,to:M.to,nodes:T,index:N,kind:"input",matrix:{returning:M.returning,captionLane:0},labelWidth:G,labelHeight:18}),ae=Tt(e,"path",{d:q.path,class:"edge"+(M.returning?" exception":""),"data-handoff-id":M.id,"data-from-subsystem":M.from,"data-to-subsystem":M.to,"data-flow-direction":M.returning?"return":"forward","marker-end":"url(#overview-arrow)"});D.append(ae);const te=Tt(e,"text",{x:q.label[0]-G/2,y:q.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":M.id});te.textContent=M.label,te.addEventListener("pointerdown",ne=>ne.stopPropagation()),te.addEventListener("pointerup",ne=>ne.stopPropagation()),te.addEventListener("click",()=>S({kind:"connection",id:M.id})),te.addEventListener("keydown",ne=>{(ne.key==="Enter"||ne.key===" ")&&(ne.preventDefault(),S({kind:"connection",id:M.id}))}),D.append(te),R=Math.max(R,q.bounds.right+40,q.label[0]+G/2+30),x=Math.max(x,q.bounds.bottom+40,q.label[1]+30)}for(const[N,M]of a.entries()){const G=xo({from:M.from,to:M.to,nodes:O,index:N,kind:"input",labelWidth:0,labelHeight:0}),q=Tt(e,"path",{d:G.path,class:"edge","data-overview-from":M.from,"data-overview-to":M.to,"marker-end":"url(#overview-arrow)"});D.append(q),R=Math.max(R,G.bounds.right+40),x=Math.max(x,G.bounds.bottom+40)}for(const N of O){const M=r.find(Me=>Me.id===N.id),G=n.roles.find(Me=>Me.id===M.reviewer.roleId),q=Tt(e,"g",{role:"button",tabindex:0,"aria-label":M.title+"を選択","aria-pressed":"false","data-node":N.id,"data-review-group":N.id,"data-subsystem-id":M.subsystemId,class:"node graph-shape state-shape"}),ae=vr(e,N);ae.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),q.append(ae,Tt(e,"rect",{x:N.x,y:N.y,width:N.width,height:N.height,rx:8,class:"state-diagram-node"}));const ne=Tt(e,"foreignObject",{x:N.x,y:N.y,width:N.width,height:N.height}),pe=e.createElement("div");pe.className="subsystem-overview-card";const he=wc(e,G.color),Ne=e.createElement("span");Ne.className="subsystem-overview-labels",Ne.title=M.title+" — "+G.name;for(const[Me,L,W]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",M.title],["small","subsystem-overview-role",G.name]]){const F=e.createElement(Me);F.className=L,F.textContent=W,Ne.append(F)}const we=e.createElement("button");we.type="button",we.className="subsystem-overview-open",we.setAttribute("aria-label",M.title+"の詳細タブを開く"),we.title="詳細タブを開く",we.textContent="開く",we.onpointerdown=Me=>Me.stopPropagation(),we.onpointerup=Me=>Me.stopPropagation(),we.onclick=Me=>{Me.stopPropagation(),o(M.id)},pe.append(he,Ne,we),ne.append(pe),q.append(ne),q.addEventListener("click",()=>S({kind:"model",id:N.id})),q.addEventListener("keydown",Me=>{(Me.key==="Enter"||Me.key===" ")&&(Me.preventDefault(),S({kind:"model",id:N.id}))}),D.append(q)}return D.setAttribute("viewBox",`0 0 ${R} ${x}`),v(D),D},p,y,()=>S(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",y),m.addEventListener("pointerup",()=>queueMicrotask(y)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",y),{root:m,selected:()=>p.selected,selection:()=>f,restore:()=>{const I=()=>{const O=m.querySelector(".diagram-viewport");O.scrollLeft=p.scroll[0],O.scrollTop=p.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(I):I()}}}function Ic(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const s=i.cells.find(r=>r.columnId===o.id);if(!s)throw Error("Missing sample cell: "+o.id);return s}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function Sc({model:e,business:t}){const n=g=>{const m=t.activities.find(f=>f.id===g);if(!m)throw Error("Unknown activity: "+g);return m},i=g=>{const m=t.roles?.find(f=>f.id===g);if(!m)throw Error("Unknown role: "+g);return m.name},o=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:i(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(m=>{const f=n(m);return{id:f.id,name:f.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(m=>({...m,samples:m.samples.map(Ic)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>o.find(m=>m.id===g),r=(g,m)=>s(g)?.capabilities.find(f=>f.samples.some(y=>y.id===m)),d=o.flatMap(g=>g.capabilities.flatMap(m=>m.samples.map(f=>({...f,group:g.id})))),a=["yellow","cyan","green","blue","purple","orange"];function l(g,m,f){let y=f.get(m);if(y||(y=a[f.size]??`extra-${f.size}`,f.set(m,y)),g.dataset.sampleKey=m,g.dataset.keyTone=y,g.className="data-example-key",y.startsWith("extra-")){const S=(Number(y.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${S} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${S} 24% 25%)`)}}const c=g=>d.filter(m=>m.group===g),h=(g,m)=>c(g).find(f=>f.id===m);function u(g,m,f){const y=g.ownerDocument.createElement(m);return y.textContent=f,g.append(y),y}function p(g,m,f,y,S){const v=g.ownerDocument,C=h(m.id,f);if(!C)throw Error("Unknown data example: "+f);g.replaceChildren(),g.dataset.dataExample=f;const I=new Map;e.presentation.sampleCaption&&(u(g,"p",e.presentation.sampleCaption).className="data-example-caption");const O=s(m.id)?.capabilities??[],D=S?.capabilityId?O.filter(M=>M.id===S.capabilityId):O;if(S?.capabilityId&&!D.some(M=>M.samples.some(G=>G.id===f)))throw Error("Sample does not belong to capability: "+f);const R=r(m.id,f);g.dataset.capability=R.id;const x=()=>{u(g,"h2",S?.heading?.trim()||R.title),S?.renderSpecification?S.renderSpecification(g):u(g,"p",R.description).className="data-example-capability"};S?.capabilityId&&!S.hideCapability&&x();const T=v.createElement("label");T.className="data-example-picker",u(T,"span","場面");const N=v.createElement("select");N.setAttribute("aria-label","データ例の場面");for(const M of D){let G=N;if(!S?.capabilityId){const q=v.createElement("optgroup");q.label=M.title,N.append(q),G=q}for(const q of M.samples){if(S?.sampleIds&&!S.sampleIds.includes(q.id))continue;const ae=v.createElement("option");ae.value=q.id,ae.textContent=q.name,G.append(ae)}}if(N.value=f,N.onchange=()=>y(N.value),T.append(N),(!S?.hideSinglePicker||N.options.length>1)&&g.append(T),!S?.capabilityId&&!S?.hideCapability&&x(),u(g,"h3",C.name).className="data-example-scene",S?.collapseScenario&&C.when){const M=v.createElement("details");M.className="data-example-context",u(M,"summary","場面の背景"),u(M,"p",C.when).className="data-example-when",g.append(M)}else u(g,"p",C.when).className="data-example-when";u(g,"p",C.meaning).className="data-example-meaning";for(const M of C.blocks){const G=v.createElement("section");G.className="data-example-block",G.dataset.exampleCard=M.card,u(G,"h3",m.concepts[M.card].name);const q=v.createElement("div");q.className="data-example-table",q.tabIndex=0,q.setAttribute("role","region"),q.setAttribute("aria-label",m.concepts[M.card].name+"のデータ表");const ae=v.createElement("table");ae.setAttribute("aria-label",m.concepts[M.card].name+"のデータ例");const te=v.createElement("caption");te.textContent=m.concepts[M.card].name+"に入る情報",ae.append(te);const ne=v.createElement("thead"),pe=v.createElement("tr");for(const Ne of M.columns)u(pe,"th",Ne).setAttribute("scope","col");ne.append(pe),ae.append(ne);const he=v.createElement("tbody");for(const[Ne,we]of M.rows.entries()){const Me=v.createElement("tr");for(const[L,W]of we.entries()){const F=u(Me,"td",String(W)),me=M.keyIds[Ne][L];me&&(l(F,me,I),F.title=M.columns[L]+"："+W)}he.append(Me)}ae.append(he),q.append(ae),G.append(q),M.rows.length||u(G,"p",M.empty??"データはありません。"),g.append(G)}C.note&&(u(g,"p",C.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:s,capabilityFor:r,examplesFor:c,findDataExample:h,renderDataExample:p}}function es(e,t){const n=e.model?.business,i=n?.activities.find(o=>o.id===t);if(!(!i||"performers"in i))return i.roleId?n?.roles?.find(o=>o.id===i.roleId):void 0}function xc(e,t,n){return es(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Ac(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function Et(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,s;const r=(d,a)=>{for(const l of a.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const c=document.createElement("strong");c.textContent=l.slice(2,-2),d.append(c)}else if(l.startsWith("`")&&l.endsWith("`")){const c=document.createElement("code");c.textContent=l.slice(1,-1),d.append(c)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(a&&!i){i=a[1],s=void 0;const u=document.createElement("pre");o=document.createElement("code"),u.append(o),n.append(u);continue}if(a&&a[1][0]===i[0]&&a[1].length>=i.length&&!a[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",s=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){s=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),c=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(c){s||(s=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(s));const u=document.createElement("li");r(u,c[1]),s.append(u);continue}s=void 0;const h=document.createElement(l?"h"+l[1].length:"p");r(h,l?l[2]:d),n.append(h)}return t&&n.querySelector("h1")?.remove(),n}function jo(e,t,n){if(t.performers===null)return"未決";const i=n===void 0?t.performers:n===null?t.performers.length===1?t.performers:[]:t.performers.filter(o=>n.includes(o.objectId));return i.length?i.map(o=>{const s=e.objects.find(d=>d.id===o.objectId).name,r=o.roleIds.map(d=>e.roles.find(a=>a.id===d).name);return r.length?`${s}（旧Role：${r.join("・")}）`:s}).join("、"):"未決"}function Ar(e,t){return"performers"in t?"未決":e.roles?.find(n=>n.id===t.roleId)?.name??t.who}function Er(e,t){return"dataId"in t?e.data.find(n=>n.id===t.dataId).name:t.label}function Ec(e){const t=[];for(const n of e.activities){if(!("performers"in n))continue;const i=(l,c,h,u)=>t.push({id:`viewer:${l}:${n.id}`,displayId:"構造の要確認（表示のみ）",kind:c,status:"open",scope:"items",targets:[n.id],targetNames:[n.name],summary:h,content:u,unresolvedTargets:[]}),o=n.performers??[],s=new Set(o.flatMap(l=>l.roleIds)),r=[...o.length>1?["複数の担当Object"]:[],...s.size>1?["複数Role"]:[]];i("who",r.length?"correction":"question",r.length?`旧形式に${r.join("と")}があります。`:"Whoは未決です。",`旧形式の担当情報：${jo(e,n)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityのWhoを単一の業務Roleとして確認してください。入力や出力の相手からは決められません。`);const d=n.procedure.steps.filter(l=>l.performerObjectIds===null&&n.performers?.length!==1),a=n.procedure.steps.filter(l=>l.performerObjectIds!==null&&(l.performerObjectIds.length!==o.length||l.performerObjectIds.some(c=>!o.some(h=>h.objectId===c))));(d.length||a.length)&&i("steps",a.length?"correction":"question",a.length?"旧形式の手順の担当情報が異なります。":"旧形式の担当情報が未決の手順があります。",[d.length?`旧形式の担当情報が未決：${d.map(l=>l.text).join("、")}。`:"",a.length?`Activityと異なる旧形式の担当情報：${a.map(l=>l.text).join("、")}。責任境界が変わる場合はActivityの分割を検討してください。`:""].join(""))}return t}const Oe={type:"string"},J={type:"string",minLength:1,pattern:"\\S"},V={type:"string",pattern:"^[A-Za-z0-9_-]+$"},un=e=>({anyOf:[e,{type:"null"}]}),K=e=>({type:"array",items:e}),ee=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Oc=e=>({$ref:"#/$defs/"+e}),Dn=K({anyOf:[ee({kind:{enum:["text"]},value:Oe}),ee({kind:{enum:["reference"]},targetId:V,label:Oe}),ee({kind:{enum:["link"]},uri:J,label:Oe})]}),$s=ee({id:V,name:J,scope:{type:"boolean"}}).properties,jc=ee({id:V,kind:{enum:["input","output","business-exception","object-exception"]},fromId:V,toId:V,label:J}),Cc=ee({id:V,sourceId:V,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:K(V),unresolvedTargets:K(J),summary:J,content:J}),Co=ee({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:J,title:J,preface:Oe,scope:Oe,objects:K(ee({...$s,icon:J,information:K(J)})),activities:K(ee({...$s,why:J,when:J,who:J,where:J,procedure:J,exception:un(J),result:J,problem:un(J),painLevel:un({enum:["Low","Medium","High"]})})),relations:K(jc),findings:K(Cc)}),Mc=ee({id:V,name:J,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Or=ee({...Co.properties,schemaVersion:{enum:["0.2"]},roles:K(Mc),activities:K(ee({...Co.properties.activities.items.properties,roleId:un(V)}))}),Dc=ee({...Or.properties,schemaVersion:{enum:["0.3"]},exceptions:K(ee({id:V,activityId:V,name:J,description:Oe}))}),Lc=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Dn])),Rc=ee({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:J,title:J,basedOn:ee({documentId:V,revision:J,verification:{enum:["unverified"]}}),intro:Dn,index:K(ee({activityId:V,purpose:Oe,connections:Oe,checkIds:K(V)})),sections:K(ee({id:V,activityId:un(V),title:J,preamble:Dn})),guarantees:K(ee({id:V,sectionId:V,title:J,blocks:K({anyOf:[ee({kind:{enum:["prose"]},content:Dn}),ee({kind:{enum:["example"]},exampleId:V})]})})),examples:K(ee({id:V,guaranteeId:V,columns:K(J),rows:K(K(Dn))})),items:K(ee({id:V,checkId:V,title:J,detailSummary:Oe,sectionId:V,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:ee(Lc,[])})),notes:K(ee({id:V,title:J,content:Dn}))}),ts=ee({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:J,title:J,basedOn:ee({documentId:V,revision:J,verification:{enum:["unverified"]}}),objectId:V,states:K(ee({id:V,name:J})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:J,transitions:K(ee({id:V,sourceId:J,fromId:J,activityId:V,event:un(J),exception:un(J),condition:J,toId:J,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:J,note:J}))}),Ws=Object.fromEntries(Object.entries({...ts.properties.transitions.items.properties,exceptionId:un(V)}).filter(([e])=>e!=="exception")),Nc=ee({...ts.properties,schemaVersion:{enum:["0.2"]},transitions:K(ee({...Ws,conditionLabel:J},Object.keys(Ws)))}),ns=ee({documentId:V,revision:J,targetType:J,targetId:V,section:J}),Tc=ee({id:V,name:J,responsibilityStatus:J,responsibleSubsystemId:V},["id","name"]),Pc=ee({id:V,name:J,subsystemId:V,information:K(Tc),reason:Oe,description:Oe,businessObjectIds:K(V),activityLinks:K(ee({activityId:V,uses:K(J)})),sourceRefs:K(ns),reviewState:J}),qc=ee({id:V,fromConceptId:V,toConceptId:V,fromPerTarget:J,toPerSource:J,condition:Oe,reviewState:J,sourceRefs:K(ns),fromLabel:J,toLabel:J,kind:{enum:["down","reference"]}}),$c=ee({id:V,name:J,purpose:Oe,information:K(J),reason:Oe,activityIds:K(V),reviewState:J}),Wc=ee({id:V,fromSubsystemId:V,toSubsystemId:V,information:J,description:Oe,activityIds:K(V),flowDirection:{enum:["forward","return"]},reviewState:J}),zc=ee({columnId:V,value:{anyOf:[Oe,{type:"number"}]},linkId:J},["columnId","value"]),Uc=ee({card:V,columns:K(ee({id:V,name:J,informationId:V})),rows:K(ee({id:V,cells:K(zc)})),empty:Oe},["card","columns","rows"]),Mo=ee({id:V,name:J,when:Oe,meaning:Oe,blocks:K(Uc),note:Oe},["id","name","when","meaning","blocks"]),Do=ee({id:V,title:J,description:Oe,meta:{},samples:K(Mo)}),Fc=ee({...Mo.properties,checkIds:{...K(V),minItems:1,uniqueItems:!0}},[...Mo.required,"checkIds"]),Vc=ee({decisionExampleIds:K(V),decisionCheckIds:K(V),resultCheckIds:K(V),sampleIds:K(V)}),Bc=ee({...Do.properties,samples:K(Fc),testSpecification:Vc},[...Object.keys(Do.properties)]),Gc=ee({id:V,title:J,description:Oe,reason:Oe,meta:{}}),Hc=ee({conceptId:V,name:J,fields:K(J),description:Oe,sources:K(J),sourceActivityIds:K(V)}),Jc=ee({id:V,fromConceptId:V,toConceptId:V,relationIds:K(V),scope:Oe,fromLabel:J,toLabel:J,kind:{enum:["down","reference"]}}),_c=ee({id:V,conceptId:V,subsystemId:V,name:J,description:Oe,sources:K(J),fields:K(ee({name:J,informationId:V}))}),Kc=ee({id:V,fromViewId:V,toViewId:V,relationIds:K(V),fromLabel:J,toLabel:J,kind:{enum:["down","reference"]}}),jr=ee({nodes:K(_c),edges:K(Kc),handoffIds:K(V)}),Cr=ee({id:V,subsystemId:V,title:J,description:Oe,reviewer:ee({roleId:V}),relatedActivityIds:K(V),graph:ee({conceptIds:K(V),nodes:K(Hc),edges:K(Jc),subsystemViews:jr},["conceptIds","nodes","edges"]),structureStatements:K(ee({id:V,title:J,description:Oe,sampleIds:K(V),sourceRefs:K(ns)})),capabilities:K(Do),limitations:K(Gc),meta:ee({questions:K(J),hypotheses:{}},["questions"])}),Xc=ee({...Cr.properties,capabilities:K(Bc)}),Mr=ee({id:V,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:J,basedOn:ee({documentId:V,revision:J,verification:{enum:["unverified"]}}),relatedStates:K(ee({documentId:V,revision:J,verification:{enum:["unverified"]}})),subsystems:K($c),concepts:K(Pc),relations:K(qc),handoffs:K(Wc),reviewGroups:K(Cr),benefits:K(J),considerations:K(J),reviewPoints:K(J),meta:{},presentation:ee({activityViews:{},creatorActivityIds:{},sampleCaption:Oe,subsystemViews:jr,landscapeRelationships:K(ee({from:V,to:V})),reviewBoundaries:K(ee({from:V,to:V,label:Oe,promise:Oe}))},["landscapeRelationships","reviewBoundaries"])}),Zc=ee({...Mr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:K(Xc)}),ki=(e,t)=>ee({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:J,documents:K({anyOf:t.map(Oc)}),sources:K(ee({documentId:V,revision:J,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Oe})),externalDocuments:K(ee({id:V,kind:{enum:["businessDesign"]},revision:J,activities:K(ee({id:V,name:J}))})),diagnostics:K(J)}),zs={anyOf:[ki("0.1",["businessDesign","checkItems"]),ki("0.2",["businessDesign","checkItems","stateTransition"]),ki("0.3",["businessDesignRoles","checkItems","stateTransition"]),ki("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Co,businessDesignRoles:Or,businessDesignStructured:Dc,checkItems:Rc,stateTransition:ts,stateTransitionStructured:Nc,conceptModel:Mr,checkedConceptModel:Zc}},$=(e,t)=>{if(!e)throw Error(t)};function Dr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const s=t++;for(;t<e.length;){const r=e[t++];if(r==='"')return JSON.parse(e.slice(s,t));r==="\\"&&t++}throw Error("Unclosed JSON string")},o=(s=0)=>{$(s<=64,"JSON depth limit"),n();const r=e[t];if(r==='"'){i();return}if(r==="{"){t++,n();const a=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),$(e[t]==='"',"JSON object key required");const l=i();$(!a.has(l),"Duplicate JSON key: "+l),a.add(l),n(),$(e[t++]===":","JSON colon required"),o(s+1),n();const c=e[t++];if(c==="}")return;$(c===",","JSON comma required")}throw Error("Truncated object")}if(r==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(s+1),n();const a=e[t++];if(a==="]")return;$(a===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;$(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),$(t===e.length,"Trailing JSON content"),JSON.parse(e)}function Nn(e,t=zs,n="$"){if(t.$ref)return Nn(e,zs.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{Nn(e,o,n);return}catch(s){i.push(s.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&$(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;$(i===t.type,"Invalid type at "+n)}if(t.minLength&&$(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&$(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])$(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))$(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),Nn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>Nn(i,t.items,n+"["+o+"]"))}function Yc(e){const t=new Map,n=new Map,i=new Map,o=(s,r,d)=>{$(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,r.id),i.set(s.id,d)};for(const s of e.documents){o(s,s,"document");for(const[r,d]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const a of s[r]??[])o(a,s,d)}for(const s of e.externalDocuments){o(s,s,"document");for(const r of s.activities)o(r,s,"activity")}return{map:t,owner:n,types:i}}function Lo(e){return Nn(e),Lr(e)}function $n(e,t){const n=new Set(e.items.map(r=>r.id)),i=new Set,o=e.guarantees.find(r=>r.id===t.guaranteeId),s=r=>{if(Array.isArray(r)){for(const d of r)s(d);return}if(r&&typeof r=="object"){r.kind==="reference"&&n.has(r.targetId)&&i.add(r.targetId);for(const d of Object.values(r))d&&typeof d=="object"&&s(d)}};s(t.rows);for(const r of o?.blocks??[])r.kind==="prose"&&s(r.content);for(const r of e.items)(r.fields.guarantee??[]).some(a=>a.kind==="reference"&&(a.targetId===t.id||a.targetId===t.guaranteeId))&&i.add(r.id);return[...i]}function Lr(e,{allowUnresolvedFindings:t=!1}={}){$(e.documents.length>0,"Document required");const{map:n,owner:i,types:o}=Yc(e),s=[...e.diagnostics],r=new Set;for(const u of e.sources)if(u.uri){const p=new URL(u.uri);$(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe source URI")}const d=(u,p,g)=>($(n.has(u),"Dangling reference: "+u),p&&$(o.get(u)===p,"Reference type mismatch: "+u),g&&$(i.get(u)===g,"Cross-document mismatch: "+u),n.get(u)),a=u=>u?.some(p=>p.kind==="text"?p.value.trim().length>0:!0),l=(u,p)=>{for(const g of u)if(g.kind==="reference"&&(d(g.targetId,null,p),$(["document","section","guarantee","example","check","note"].includes(o.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const m=new URL(g.uri);$(m.protocol==="https:"&&!m.username&&!m.password,"Unsafe external link")}};for(const u of e.documents)if($(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){$(u.activities.length>0,"Activity required");const p=[...u.objects,...u.activities].map(f=>f.name);$(new Set(p).size===p.length,"Duplicate visible name"),$(p.every(f=>f===f.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(y=>f.includes(y))),"Invalid Graph-visible name");for(const f of u.objects)$(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){$(new Set(u.roles.map(f=>f.name)).size===u.roles.length,"Duplicate Role name"),$(u.roles.every(f=>f.name===f.name.trim()&&!/[\r\n]/.test(f.name)),"Invalid Role name");for(const f of u.activities)f.roleId!==null?d(f.roleId,"role",u.id):r.add("Role未確定: "+f.id+" — "+f.who)}for(const f of u.activities)$(f.problem===null==(f.painLevel===null),"Problem/Pain pair mismatch");for(const f of u.exceptions??[])d(f.activityId,"activity",u.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},m=new Set;for(const f of u.relations){d(f.fromId,g[f.kind][0],u.id),d(f.toId,g[f.kind][1],u.id);const y=JSON.stringify([f.kind,f.fromId,f.toId,f.label]);$(!m.has(y),"Duplicate relation"),m.add(y)}$(new Set(u.findings.map(f=>f.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const f of u.findings){$(f.scope==="items"?f.targetIds.length+f.unresolvedTargets.length>0:!f.targetIds.length&&!f.unresolvedTargets.length,"Finding scope mismatch"),$(new Set(f.targetIds).size===f.targetIds.length,"Duplicate Finding target");for(const y of f.targetIds)d(y,null,u.id),$(["object","activity"].includes(o.get(y)),"Invalid Finding target");f.unresolvedTargets.length&&($(t,"Unresolved Finding target: "+f.sourceId),s.push("Finding参照未決: "+f.sourceId))}}else if(u.kind==="stateTransition"){const p=d(u.basedOn.documentId,"document");$(p.kind==="businessDesign"&&p.objects,"State source must be an in-package BD"),$(p.revision===u.basedOn.revision,"Stale State source revision"),d(u.objectId,"object",p.id),$(!e.documents.some(m=>m!==u&&m.kind==="stateTransition"&&m.objectId===u.objectId),"Duplicate Object state declaration"),$(u.states.length>0&&new Set(u.states.map(m=>m.name)).size===u.states.length,"Duplicate/empty state names"),$(u.states.every(m=>!m.name.startsWith("@")),"Reserved state name"),$(u.transitions.length<=1e3,"State transition row budget"),$(new Set(u.transitions.map(m=>m.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const g=new Map;for(const m of u.transitions){m.fromId!=="@new"&&d(m.fromId,"state",u.id),["@unknown","@none"].includes(m.toId)||d(m.toId,"state",u.id);const f=d(m.activityId,"activity",p.id),y=JSON.stringify([m.fromId,m.activityId,m.condition.trim().replace(/\s+/gu," ")]);if($(!g.has(y),"Duplicate state transition condition: "+g.get(y)+" / "+m.sourceId),g.set(y,m.sourceId),e.formatVersion==="0.4")if($(m.path!=="normal"||m.exceptionId===null,"Normal transition cannot reference an exception"),m.exceptionId!==null){const S=d(m.exceptionId,"exception",p.id);$(S.activityId===f.id,"Exception Activity mismatch")}else m.path==="exception"&&$(s.includes("例外参照未決: "+m.id),"Unresolved exception requires a diagnostic");else $(m.path!=="normal"||m.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+m.id);$(m.effect!=="unchanged"||m.fromId===m.toId,"Unchanged state mismatch"),$(m.effect!=="change"||!m.toId.startsWith("@")&&m.fromId!==m.toId,"Invalid changed state"),$(m.effect!=="no-create"||m.fromId==="@new"&&m.toId==="@none","Invalid no-create transition"),$(m.effect!=="constraint"||m.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const p=d(u.basedOn.documentId,"document");$(p.kind==="businessDesign"&&p.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),$(!e.documents.some(x=>x!==u&&x.kind==="conceptModel"&&x.basedOn.documentId===p.id),"Duplicate Concept model for Business Design");const g=(x,T)=>{const N=new Map;for(const M of x)$(!N.has(M.id),"Duplicate "+T+" ID: "+M.id),N.set(M.id,M);return N},m=g(u.subsystems,"subsystem"),f=g(u.concepts,"concept"),y=g(u.relations,"concept relation"),S=g(u.reviewGroups,"review group"),v=g(u.handoffs,"handoff"),C=g(u.concepts.flatMap(x=>x.information),"concept information"),I=(x,T,N)=>($(x.has(T),"Unknown "+N+": "+T),x.get(T)),O=x=>d(x,"activity",p.id),D=x=>{const T=d(x.documentId,"document");$(T.revision===x.revision,"Stale Concept source revision");const N=T.id===p.id,M=T.kind==="stateTransition"&&T.basedOn.documentId===p.id&&u.relatedStates.some(G=>G.documentId===T.id&&G.revision===T.revision);$(N||M,"Concept source must refer to its Business Design or a declared State"),d(x.targetId,x.targetType,T.id)};for(const x of u.relatedStates){const T=d(x.documentId,"document");$(T.kind==="stateTransition"&&T.revision===x.revision&&T.basedOn.documentId===p.id,"Invalid Concept state reference")}for(const x of u.subsystems)for(const T of x.activityIds)O(T);for(const x of u.concepts){I(m,x.subsystemId,"subsystem");for(const T of x.information)T.responsibleSubsystemId&&I(m,T.responsibleSubsystemId,"responsible subsystem");for(const T of x.businessObjectIds)d(T,"object",p.id);for(const T of x.activityLinks)O(T.activityId);for(const T of x.sourceRefs)D(T)}for(const x of u.relations){I(f,x.fromConceptId,"concept"),I(f,x.toConceptId,"concept");for(const T of x.sourceRefs)D(T)}for(const x of u.handoffs){I(m,x.fromSubsystemId,"subsystem"),I(m,x.toSubsystemId,"subsystem"),$(x.fromSubsystemId!==x.toSubsystemId,"Handoff must cross subsystem boundary");for(const T of x.activityIds)O(T)}const R=(x,T)=>{const N=g(x.nodes,"subsystem view"),M=g(x.edges,"subsystem view edge");for(const q of N.values()){I(T,q.conceptId,"view concept"),I(m,q.subsystemId,"subsystem");const ae=I(f,q.conceptId,"concept");for(const te of q.fields)$(ae.information.some(ne=>ne.id===te.informationId),"Unknown information for subsystem view: "+te.informationId)}for(const q of M.values()){const ae=I(N,q.fromViewId,"subsystem view"),te=I(N,q.toViewId,"subsystem view");$(ae.subsystemId===te.subsystemId,"View relationship crosses subsystem boundary"),$(q.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ne=ae.conceptId;for(const pe of q.relationIds){const he=I(y,pe,"concept relation");$(he.fromConceptId===ne,"Subsystem view relation path is disconnected: "+pe),ne=he.toConceptId}$(ne===te.conceptId,"Subsystem view relation target differs")}$(new Set(x.handoffIds).size===x.handoffIds.length,"Duplicate subsystem view handoff");const G=new Set([...N.values()].map(q=>q.subsystemId));for(const q of x.handoffIds){const ae=I(v,q,"handoff");$(G.has(ae.fromSubsystemId)&&G.has(ae.toSubsystemId),"Missing subsystem view handoff region: "+q)}};u.presentation.subsystemViews&&R(u.presentation.subsystemViews,f);for(const x of u.reviewGroups){I(m,x.subsystemId,"subsystem"),d(x.reviewer.roleId,"role",p.id);for(const G of x.relatedActivityIds)O(G);const T=g(x.graph.nodes.map(G=>({...G,id:G.conceptId})),"view concept");$(new Set(x.graph.conceptIds).size===x.graph.conceptIds.length&&x.graph.conceptIds.length===T.size&&x.graph.conceptIds.every(G=>T.has(G)),"View concepts and nodes differ");for(const G of x.graph.nodes){I(f,G.conceptId,"concept");for(const q of G.sourceActivityIds)O(q)}g(x.graph.edges,"view edge");for(const G of x.graph.edges){I(T,G.fromConceptId,"view concept"),I(T,G.toConceptId,"view concept");for(const q of G.relationIds)I(y,q,"concept relation")}x.graph.subsystemViews&&R(x.graph.subsystemViews,T);const N=g(x.capabilities,"capability"),M=g(x.capabilities.flatMap(G=>G.samples),"sample");g(x.limitations,"limitation"),g(x.structureStatements,"structure statement");for(const G of x.structureStatements){for(const q of G.sampleIds)I(M,q,"sample");for(const q of G.sourceRefs)D(q)}for(const G of N.values())if(G.testSpecification){const q=G.testSpecification;for(const[te,ne]of Object.entries(q))$(new Set(ne).size===ne.length,"Duplicate function specification reference: "+te);const ae=(te,ne)=>{const pe=d(te,ne),he=d(i.get(te),"document");return $(he.kind==="checkItems"&&he.basedOn.documentId===p.id&&he.basedOn.revision===p.revision,"Function Check source mismatch: "+te),{value:pe,doc:he}};for(const te of[...q.decisionCheckIds,...q.resultCheckIds])ae(te,"check");for(const te of q.decisionExampleIds){const{value:ne,doc:pe}=ae(te,"example"),he=$n(pe,ne);$(he.length>0,"Function decision table needs a Check: "+te),$(he.every(Ne=>q.decisionCheckIds.includes(Ne)),"Function decision table Check is not assigned: "+te)}for(const te of q.sampleIds){const ne=G.samples.find(pe=>pe.id===te);$(ne,"Function result sample belongs to another capability: "+te),$(ne.checkIds.some(pe=>q.resultCheckIds.includes(pe)),"Function result sample needs a result Check: "+te),$(ne.checkIds.every(pe=>q.resultCheckIds.includes(pe)||q.decisionCheckIds.includes(pe)),"Function result sample Check is not assigned: "+te)}}for(const G of N.values())for(const q of G.samples){if(u.schemaVersion==="0.2"){$(q.checkIds.length>0,"Sample needs a Check: "+q.id),$(new Set(q.checkIds).size===q.checkIds.length,"Duplicate sample Check: "+q.id);for(const ae of q.checkIds){d(ae,"check");const te=d(i.get(ae),"document");$(te.kind==="checkItems"&&te.basedOn.documentId===p.id&&te.basedOn.revision===p.revision,"Sample Check source mismatch: "+ae)}}for(const ae of q.blocks){I(T,ae.card,"view concept");const te=g(ae.columns,"sample column");for(const ne of ae.columns)I(C,ne.informationId,"concept information");g(ae.rows,"sample row");for(const ne of ae.rows){const pe=new Set;for(const he of ne.cells)I(te,he.columnId,"sample column"),$(!pe.has(he.columnId),"Duplicate sample cell: "+he.columnId),pe.add(he.columnId);$(pe.size===te.size,"Sample row does not match columns")}}}}for(const x of u.presentation.landscapeRelationships){const T=I(S,x.from,"review group"),N=I(S,x.to,"review group");$(T.subsystemId===N.subsystemId,"Internal relationship crosses subsystem boundary")}for(const x of u.presentation.reviewBoundaries)I(S,x.from,"review group"),I(S,x.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const p=d(u.basedOn.documentId,"document");$(p.kind==="businessDesign","Check source is not BD"),$(p.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),$(new Set(u.items.map(f=>f.checkId)).size===u.items.length,"Duplicate Check ID");const g=new Set;for(const f of u.index){d(f.activityId,"activity",p.id),$(!g.has(f.activityId),"Duplicate Activity index"),g.add(f.activityId),$(new Set(f.checkIds).size===f.checkIds.length,"Duplicate Check binding");for(const y of f.checkIds)d(y,"check",u.id)}$(new Set(u.sections.map(f=>f.activityId??f.title)).size===u.sections.length,"Duplicate Activity section");for(const f of u.sections)f.activityId!==null&&(d(f.activityId,"activity",p.id),$(g.has(f.activityId),"Section missing from index")),l(f.preamble,u.id);const m=new Set(e.documents.filter(f=>f.kind==="conceptModel"&&f.basedOn.documentId===p.id&&f.basedOn.revision===p.revision).flatMap(f=>f.reviewGroups.flatMap(y=>y.capabilities.flatMap(S=>S.testSpecification?.decisionExampleIds??[]))));for(const f of u.guarantees){const y=f.blocks.length>0&&f.blocks.every(S=>S.kind==="example"&&m.has(S.exampleId)&&u.examples.some(v=>v.id===S.exampleId&&v.guaranteeId===f.id&&$n(u,v).length>0));$(f.blocks.some(S=>S.kind==="prose"&&a(S.content))||y,"General guarantee prose required"),d(f.sectionId,"section",u.id);for(const S of f.blocks)if(S.kind==="prose")l(S.content,u.id);else{const v=d(S.exampleId,"example",u.id);$(v.guaranteeId===f.id,"Example owner mismatch")}}for(const f of u.examples){d(f.guaranteeId,"guarantee",u.id),$(f.columns.length>0,"Example columns required");for(const y of f.rows){$(y.length===f.columns.length,"Example column mismatch");for(const S of y)l(S,u.id)}}for(const f of u.items){const y=d(f.sectionId,"section",u.id);$(y.activityId===null?!u.index.some(S=>S.checkIds.includes(f.id)):u.index.some(S=>S.activityId===y.activityId&&S.checkIds.includes(f.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),$(a(f.fields.guarantee)||a(f.fields.condition)&&a(f.fields.expectedResult),"Check guarantee required");for(const S of Object.values(f.fields))l(S,u.id);$(y.activityId===null||u.index.some(S=>S.checkIds.includes(f.id)),"Unbound Check")}for(const f of u.notes)l(f.content,u.id);l(u.intro,u.id)}const c=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));$(new Set(c).size===c.length,"Duplicate unresolved Role diagnostic");for(const u of c)$(r.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");$(r.size===0,"Unresolved Who requires a diagnostic");const h=new Set;for(const u of e.sources){d(u.documentId,"document");const p=u.documentId+"@"+u.revision;$(!h.has(p),"Duplicate source descriptor"),h.add(p)}for(const u of e.externalDocuments)$(e.sources.some(p=>p.documentId===u.id&&p.revision===u.revision),"External source revision missing"),$(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:n.size}}const _=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Pt(e,t,n){if(n==null)return;const i=Et(n);return e.append(_("h3",t),i),i}function Qc(e,t){if(e===null)return;const n=Et(e),i=s=>String(s??"").replace(/\s+/g,""),o=new Set(t.map(s=>i(Et(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))o.has(i(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const ed={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function td(e,t,n){const i=new Map,o=new Set,s=new Set(n.map(d=>d.id)),r=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==r.id||d.basedOn.revision!==r.revision)continue;const a=d.presentation.activityViews;if(Array.isArray(a)){for(const l of a)if(!(!l||typeof l!="object"||Array.isArray(l)||l.activityId!==t||!Array.isArray(l.businessVariations)))for(const c of l.businessVariations){if(!c||typeof c!="object"||Array.isArray(c)||typeof c.exceptionId!="string"||!s.has(c.exceptionId)||c.kind!=="alternative"&&c.kind!=="exception"||o.has(c.exceptionId))continue;const h=i.get(c.exceptionId);h&&h!==c.kind?(i.delete(c.exceptionId),o.add(c.exceptionId)):i.set(c.exceptionId,c.kind)}}}return i}function nd(e,t){const n=_("article");n.className="markdown json-detail";const i=e.model,o=i.business,s=o.objects.find(d=>d.id===t),r=o.activities.find(d=>d.id===t);if(s){Pt(n,"Scope",String(s.scope)),n.append(_("h3","Information"));const d=_("ul");for(const a of s.information){const l=_("li",typeof a=="string"?a:a.name);typeof a!="string"&&a.description&&l.append(Et(a.description)),d.append(l)}n.append(d)}else if(r){const d=o.exceptions?.filter(u=>u.activityId===r.id)??[];if("performers"in r){Pt(n,"Scope",String(r.scope)),Pt(n,"Why",r.why),Pt(n,"When",r.when),Pt(n,"Who",Ar(o,r)),Pt(n,"旧形式の担当情報",jo(o,r)),r.performers?.length===1&&r.procedure.steps.some(m=>m.performerObjectIds===null)&&n.append(_("p","旧形式では、指定のない手順は旧形式の担当情報を継承します。")),Pt(n,"Where",r.where);const u=(e.findings??[]).filter(m=>m.id.startsWith("viewer:")&&m.targets.includes(r.id));for(const m of u){const f=_("p",m.summary+" 詳細は構造の要確認を参照してください。");f.className="finding-reference-warning",f.dataset.structureIssue=m.id,n.append(f)}n.append(_("h3","Procedure"));const p=_("ol");for(const m of r.procedure.steps){const f=_("li");f.append(Et(m.text));const y=r.performers?.length===1&&(m.performerObjectIds===null||m.performerObjectIds.length===1&&m.performerObjectIds[0]===r.performers[0].objectId),S=[m.obligation==="required"?"必須":"任意",...m.appliesWhen?[`適用条件：${m.appliesWhen}`]:[],...y?[]:[`旧形式の担当：${jo(o,r,m.performerObjectIds)}`]];f.append(_("p",S.join(" · "))),p.append(f)}if(n.append(p),r.procedure.orderRules.length){n.append(_("h3","手順の順序制約"));const m=_("ul"),f=y=>String(r.procedure.steps.findIndex(S=>S.id===y)+1);for(const y of r.procedure.orderRules)m.append(_("li",y.kind==="before"?`手順${f(y.beforeId)} → 手順${f(y.afterId)}`:`手順${y.stepIds.map(f).join("・")}は入替可能`));n.append(m)}n.append(_("h3","Result"));const g=_("ul");g.dataset.businessResult="",g.dataset.resultScope="activity";for(const m of r.results){const f=_("li");f.append(Et(m.text)),g.append(f)}n.append(g),Pt(n,"Problem",r.problem),Pt(n,"Pain level",r.painLevel)}else for(const[u,p]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=Pt(n,u,p==="who"?es(e,r.id)?.name??r.who:r[p]===null?null:String(r[p]));p==="result"&&g&&(g.dataset.businessResult="")}const a=Qc("exception"in r?r.exception:null,d),l=td(e,r.id,d),c=(u,p,g)=>{if(!p.length&&!g)return;const m=_("section");m.dataset.businessVariations="",m.append(_("h3",u)),g&&m.append(g);for(const f of p){const y=Et(f.description);y.dataset.businessException=f.id,m.append(_("h4",f.name),y)}n.append(m)};l.size?(c("例外",d.filter(u=>l.get(u.id)==="exception")),c("別ルート",d.filter(u=>l.get(u.id)==="alternative")),c("通常以外の扱い",d.filter(u=>!l.has(u.id)),a)):c("通常以外の扱い",d,a);const h=new Map([...o.objects,...o.activities].map(u=>[u.id,u.name]));for(const[u,p]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=o.relations.filter(f=>f.kind===u&&(f.fromId===t||f.toId===t));if(!g.length)continue;n.append(_("h3",p));const m=_("ul");for(const f of g){const S=`${"dataId"in f?h.get(u==="input"?f.fromId:f.toId):`${h.get(f.fromId)} → ${h.get(f.toId)}`} — ${Er(o,f)}`;if(u==="business-exception"){n.append(_("p",S));continue}const v=_("li",S);if("dataId"in f){const C=o.data.find(O=>O.id===f.dataId),I=_("ul");for(const O of C.items){const D=o.objects.flatMap(x=>x.information).find(x=>typeof x!="string"&&x.id===O.informationId);if(!D||typeof D=="string")continue;const R=_("li",D.name+(O.condition?`（条件：${O.condition}）`:""));D.description&&R.append(Et(D.description)),I.append(R)}v.append(I)}m.append(v)}u!=="business-exception"&&n.append(m)}}else n.append(_("p","項目を選択すると業務内容を表示します。"));return n}class ui{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(_("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(Et(o.value));continue}if(o.kind==="text"){const a=_("span",o.value);a.style.whiteSpace="pre-wrap",t.append(a);continue}if(o.kind==="link"){t.append(_("span",`${o.label} (${o.uri})`));continue}const s=_("details"),r=_("summary",o.label||o.targetId);s.append(r),t.append(s);let d=!1;s.addEventListener("toggle",()=>{if(!s.open||d)return;if(d=!0,i.has(o.targetId)){s.append(_("p","循環参照："+o.targetId));return}if(i.size>=16){s.append(_("p","参照の深さの上限です。続きは原文で確認してください。"));return}const a=new Set(i).add(o.targetId),l=this.doc,c=l.guarantees.find(m=>m.id===o.targetId),h=l.examples.find(m=>m.id===o.targetId),u=l.items.find(m=>m.id===o.targetId),p=l.sections.find(m=>m.id===o.targetId),g=l.notes.find(m=>m.id===o.targetId);if(c){s.append(_("h4",c.title));for(const m of c.blocks){if(!this.take(s))break;m.kind==="prose"?this.runs(s,m.content,a):this.example(s,m.exampleId,a)}}else if(h)this.example(s,h.id,a);else if(u){s.append(_("p",`${u.checkId} · ${u.title}`+(this.requester?"":` · ${u.reviewState}`))),this.requester&&(u.reviewState==="要確認"||u.reviewState==="要修正")&&s.append(_("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(u.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f))):u.fields;this.fields(s,m,a)}else p?(s.append(_("h4",p.title)),this.runs(s,p.preamble,a)):g?(s.append(_("h4",g.title)),this.runs(s,g.content,a)):o.targetId===l.id&&(s.append(_("h4",l.title)),this.runs(s,l.intro,a))})}}fields(t,n,i,o=!1){for(const[s,r]of Object.entries(n)){if(!this.take(t))break;if(t.append(_("h4",ed[s]??s)),s==="guarantee"&&o){const d=new Set;for(const a of r){const l=a.kind==="reference"?this.doc.guarantees.find(h=>h.id===a.targetId):void 0;if(!l){this.runs(t,[a],i);continue}if(d.has(l.id))continue;d.add(l.id);const c=new Set(i).add(l.id);for(const h of l.blocks){if(!this.take(t))break;h.kind==="prose"?this.runs(t,h.content,c):this.example(t,h.exampleId,c)}}}else this.runs(t,r,i)}}example(t,n,i,o=!1){const s=this.doc.examples.find(h=>h.id===n);if(!$n(this.doc,s).length)return;const r=_("table"),d=o?s.columns.indexOf("結果"):-1,a=d>0&&s.columns.at(-1)==="Check ID";if(a){const h=_("colgroup");h.span=d,r.append(h);for(let f=d;f<s.columns.length;f++)r.append(_("colgroup"));const u=_("thead"),p=_("tr"),g=_("th","条件");g.colSpan=d,g.scope="colgroup",p.append(g);for(let f=d;f<s.columns.length;f++){const y=_("th",s.columns[f]);y.rowSpan=2,y.scope="col",f===d?y.className="decision-result":s.columns[f]==="備考"&&(y.className="decision-notes"),p.append(y)}const m=_("tr");for(const f of s.columns.slice(0,d)){const y=_("th",f);y.scope="col",m.append(y)}u.append(p,m),r.append(u)}else{const h=_("tr");for(const u of s.columns){if(!this.take(t))break;h.append(_("th",u))}r.append(h)}const l=a?_("tbody"):r;for(const h of s.rows){if(!this.take(t))break;const u=_("tr");for(const[p,g]of h.entries()){if(!this.take(t))break;const m=_("td");if(a&&p===d?m.className="decision-result":a&&s.columns[p]==="備考"&&(m.className="decision-notes"),o)for(const f of g){const y=f.kind==="reference"?this.doc.items.find(S=>S.id===f.targetId):void 0;y?m.append(_("span",y.checkId)):this.runs(m,[f],i)}else this.runs(m,g,i);u.append(m)}l.append(u)}a&&r.append(l);const c=_("div");c.className="json-example",c.append(r),t.append(c)}}function Us(e,t,n=e.model.checks,i=new Set,o=new Set){const s=_("section");s.className="check-content json-checks";const r=e.model.business,d=n.filter(l=>l.basedOn.documentId===r.id);let a=!1;for(const l of d){const c=new ui(l),h=l.index.filter(m=>m.activityId===t),u=new Set(l.index.flatMap(m=>m.checkIds)),p=(t?[...new Set(h.flatMap(m=>m.checkIds))]:l.items.filter(m=>!u.has(m.id)).map(m=>m.id)).filter(m=>!i.has(m)),g=l.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of g){(m.preamble.length||l.guarantees.some(f=>f.sectionId===m.id&&!o.has(f.id)))&&(a=!0),c.runs(s,m.preamble);for(const f of l.guarantees.filter(y=>y.sectionId===m.id&&!o.has(y.id)))c.runs(s,[{kind:"reference",targetId:f.id,label:f.title}])}for(const m of p){const f=l.items.find(v=>v.id===m);if(!f)continue;a=!0;const y=_("section");y.className="check-item",y.dataset.checkId=f.checkId,y.dataset.elementId=f.id,y.append(_("h3",f.checkId+" · "+f.title)),(f.reviewState==="要確認"||f.reviewState==="要修正")&&y.append(_("p","確認が必要です。"));const S=Object.fromEntries(Object.entries(f.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));c.fields(y,S,new Set([f.id])),s.append(y)}if(!t)for(const m of l.notes)a=!0,c.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}return a||s.append(_("p","この業務のテスト仕様はありません。")),s}function id(e,t,n=e.model.checks){const i=_("section");i.className="check-content json-checks sample-checks";const o=e.model.business,s=new Set(t);for(const r of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new ui(r);for(const a of r.items.filter(l=>s.has(l.id))){const l=_("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(_("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(_("p","確認が必要です。"));const c=Object.fromEntries(Object.entries(a.fields).filter(([h])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(h)));d.fields(l,c,new Set([a.id]),!0),i.append(l)}}return i}const od=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function sd(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(od,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function rd(e,t,n=e.model.checks){const i=_("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const s of t)for(const r of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=r.examples.find(g=>g.id===s);if(!d||!$n(r,d).length)continue;const a=new ui(r,!0),l=r.guarantees.find(g=>g.id===d.guaranteeId),c=_("section");c.dataset.decisionExample=s;for(const g of l?.blocks??[])g.kind==="prose"&&a.runs(c,sd(g.content),new Set([l.id]));d.rows.length>1&&c.append(_("p","上から順に判定し、最初に当てはまる行を見ます。"));const h=d.columns.indexOf("結果"),u=h>0?h:d.columns.length;d.rows.some(g=>g.slice(0,u).some(m=>m.some(f=>f.kind==="text"&&/^\s*[-‐]\s*$/.test(f.value))))&&c.append(_("p","‐＝値不問。")),a.example(c,s,new Set([s]),!0),i.append(c)}return i}function ad(e,t,n=e.model.checks){const i=_("section");i.className="check-content json-checks decision-checks";const o=e.model.business,s=new Set(t);for(const r of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new ui(r,!0);for(const a of r.items.filter(l=>s.has(l.id))){const l=_("section");l.className="check-item",l.dataset.checkId=a.checkId,l.dataset.elementId=a.id,l.append(_("h3",a.checkId+" · "+a.title)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&l.append(_("p","確認が必要です。")),a.fields.condition?.length&&(l.append(_("h4","条件")),d.runs(l,a.fields.condition,new Set([a.id])));const c=Object.fromEntries(Object.entries(a.fields).filter(([h])=>["expectedResult","guarantee","question","alternatives"].includes(h)));if(Object.keys(c).length){const h=_("details");h.append(_("summary","期待結果")),d.fields(h,c,new Set([a.id]),!0),l.append(h)}i.append(l)}}return i}function cd(e,t,n=e.model.checks,i=new Set){const o=_("section");o.className="check-content json-checks result-checks";const s=e.model.business,r=new Set(t);for(const d of n.filter(a=>a.basedOn.documentId===s.id&&a.basedOn.revision===s.revision)){const a=new ui(d,!0),l=d.items.filter(c=>r.has(c.id)&&i.has(c.id)&&c.reviewState!=="要確認"&&c.reviewState!=="要修正"&&!c.fields.question?.length&&!c.fields.alternatives?.length);l.length&&o.append(_("p",l.map(c=>c.checkId).join("、")));for(const c of d.items.filter(h=>r.has(h.id))){if(l.includes(c))continue;const h=_("section");h.className="check-item",h.dataset.checkId=c.checkId,h.dataset.elementId=c.id,h.append(_("h3",c.checkId)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&h.append(_("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(c.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));a.fields(h,u,new Set([c.id]),!0);const p=_("details"),g=_("summary","Check の詳細");p.append(g,_("p",c.title)),c.fields.condition?.length&&a.runs(p,c.fields.condition,new Set([c.id])),h.append(p),o.append(h)}}return o}const go=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function dd(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(c=>c.id)),i=[],o=new Set,s=new Set,r=t.filter(c=>c.basedOn.documentId===e.business.id&&c.basedOn.revision===e.business.revision),d=(c,h)=>r.some(u=>u.items.some(p=>p.id===c)&&(!h||u.index.some(p=>p.activityId===h&&p.checkIds.includes(c)))),a=(c,h,u,p,g=[])=>{const m=h.testSpecification,f=(m?.decisionCheckIds??[]).filter(D=>d(D,u)),y=(m?.resultCheckIds??[]).filter(D=>d(D,u)),S=(m?.decisionExampleIds??[]).filter(D=>r.some(R=>{const x=R.examples.find(N=>N.id===D),T=x?$n(R,x):[];return T.length>0&&T.every(N=>d(N,u))})),v=h.samples.filter(D=>(!m||m.sampleIds.includes(D.id))&&D.checkIds?.length&&(m?D.checkIds.every(R=>d(R,u)):D.checkIds.some(R=>d(R,u)))),C=S.flatMap(D=>r.flatMap(R=>{const x=R.examples.find(T=>T.id===D);return x?$n(R,x).filter(T=>d(T,u)):[]})),I=[...new Set([...f,...y,...C,...v.flatMap(D=>(D.checkIds??[]).filter(R=>d(R,u)))])];if(!I.length)return;const O=`fn:${u??"_"}:${c}:${h.id}`;s.has(O)||(s.add(O),i.push({key:O,activityId:u,groupId:c,capability:h,name:p,samples:v,checkIds:I,decisionCheckIds:f,resultCheckIds:y,decisionExampleIds:S,decisionTableCheckIds:[...new Set(C)],businessSections:g}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const c of l)if(!(!go(c)||typeof c.activityId!="string"||!n.has(c.activityId)||!Array.isArray(c.testSpecificationFunctions)))for(const h of c.testSpecificationFunctions){if(!go(h)||typeof h.groupId!="string"||typeof h.capabilityId!="string")continue;const u=e.model.reviewGroups.find(m=>m.id===h.groupId),p=u?.capabilities.find(m=>m.id===h.capabilityId);if(!u||!p)continue;o.add(JSON.stringify([u.id,p.id]));const g=[];if(Array.isArray(h.businessSections))for(const m of h.businessSections){if(!go(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(y=>y.id===m.exceptionId&&y.activityId===c.activityId)))continue;const f=[...new Set(m.pages.filter(y=>y==="decision"||y==="result"))];f.length&&g.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:f})}a(u.id,p,c.activityId,typeof h.name=="string"&&h.name.trim()?h.name.trim():p.title,g)}}for(const c of e.model.reviewGroups)for(const h of c.capabilities)o.has(JSON.stringify([c.id,h.id]))||a(c.id,h,void 0,h.title);return i}function Fs(e,t,n,i){const o=e.filter(r=>r.groupId===t&&r.capability.id===n),s=o.find(r=>r.samples.some(d=>d.id===i));if(s)return{kind:"sample",key:s.key,sampleId:i};for(const r of o){if(!r.capability.testSpecification)continue;const d=r.capability.samples.find(l=>l.id===i),a=r.decisionExampleIds.length?r.decisionTableCheckIds:r.decisionCheckIds;if(d?.checkIds?.some(l=>a.includes(l)))return{kind:"decision",key:"decision:"+r.key}}}const jn=["landscape","overview"];function ld(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const r=document.createElement("aside");r.id="design-explorer",r.setAttribute("aria-label","設計ナビゲーション"),r.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",s.append(r,d),d.append(i,n);const a=document.createElement("div");a.className="shell-open-tabs",o.before(a),a.append(o),dc(a);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),a.append(l);const c=document.createElement("nav");c.className="state-tabs",c.setAttribute("aria-label","開いている状態遷移"),a.append(c);const h=document.createElement("nav");h.className="spec-tabs",h.setAttribute("aria-label","開いているテスト仕様"),a.append(h);const u=document.createElement("section");u.id="concept-workspace",u.hidden=!0,u.setAttribute("aria-label","データ構造"),u.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(u);const p=document.createElement("section");p.id="states-workspace",p.hidden=!0,p.setAttribute("aria-label","状態遷移"),p.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(p);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',d.append(g);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const f=document.createElement("section");f.id="empty-workspace",f.hidden=!0,f.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(f);const y=n.querySelector("#node-list-drawer");r.append(y);const S=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),C=r.querySelector("input"),I=r.querySelector("nav"),O=u.querySelector("iframe"),D=u.querySelector(".concept-related"),R=p.querySelector("article"),x="alder-explorer-v1:"+location.pathname,T=location.protocol==="file:"||location.origin==="null"?"*":location.origin,N=window.__alderConceptHtml;let M,G,q,ae,te={},ne=[],pe=[...jn],he=new Map,Ne=new Map,we=new Map,Me=new Map;const L=b=>we.get(b)??b,W=b=>Me.get(b)??b,F=b=>G?.findGroup(he.get(b??"")),me=b=>q?.contentFor(he.get(b)??""),Q=(b,w)=>q?.findDataExample(he.get(b)??"",w),Ae=b=>q?.examplesFor(he.get(b)??"")??[],Le=b=>jn.includes(b)?"全体図":me(b)?.title??F(b)?.name??te[Ne.get(b)??""]?.name,ve=()=>{const b=t.business(),w=b.design?.model;return w?[...w.checks,...b.relatedChecks??[]].filter(E=>E.basedOn.documentId===w.business.id):[]},re=()=>dd(M,ve()),Ie=b=>re().find(w=>w.key===(b.startsWith("decision:")?b.slice(9):b)),ze=b=>re().filter(w=>w.name===b.name).length>1?b.name+"（"+(t.business().activities.find(w=>w.id===b.activityId)?.name??"その他")+"）":b.name,Ve=b=>ve().some(w=>w.index.some(E=>E.activityId===b)||w.sections.some(E=>E.activityId===b)),Ft=b=>new Set(re().filter(w=>w.activityId===b).flatMap(w=>w.checkIds)),hn=b=>{const w=new Set(re().filter(E=>E.activityId===b).flatMap(E=>E.decisionExampleIds));return new Set(ve().flatMap(E=>E.examples.filter(A=>w.has(A.id)).map(A=>A.guaranteeId)))},en=b=>{const w=Ft(b),E=hn(b);return ve().some(A=>A.index.some(P=>P.activityId===b&&P.checkIds.some(H=>!w.has(H)))||A.sections.some(P=>P.activityId===b&&(P.preamble.length>0||A.guarantees.some(H=>H.sectionId===P.id&&!E.has(H.id)))))},ha=()=>ve().some(b=>b.items.some(w=>!b.index.some(E=>E.checkIds.includes(w.id)))||b.sections.some(w=>w.activityId===null)||b.notes.length>0),ba=b=>{const w=Ie(b);return w?w.capability.testSpecification?ze(w)+"・"+(b.startsWith("decision:")?"可否":"結果"):w.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(E=>E.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(E=>E.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},hi=n.querySelector("#formattedMarkdownDrawer");hi&&s.append(hi),s.append(D,m),qs(D,s,x+":drawer-width"),qs(m,s,x+":test-drawer-width");let bi=!1;const ut=t.rightDrawer??{isOpen:()=>bi,setOpen:b=>{bi=b}};let ie="business",$e=!1,et=[],B="overview",tt=[],ft="",pt=[],Re="@overview",An,Vt=innerWidth>800,gi=!1,yi=!0,mt=!1,Jn;const ht=new Map,kt=new Map([["overview",O]]),ct=new Map,bn=new Map,gn=new Map,We=new Map,tn=new Map,It=new Set,_e=new Set,yn=new Set,Ke=new Map;let Se;try{if(Se=JSON.parse(sessionStorage.getItem(x)||"null"),Se){if(mt=Se.overviewClosed===!0,Jn=typeof Se.documentKey=="string"?Se.documentKey:void 0,Vt=typeof Se.left=="boolean"?Se.left:Vt,Array.isArray(Se.expanded)){_e.clear();for(const b of Se.expanded)typeof b=="string"&&_e.add(b)}tt=Array.isArray(Se.states)?Se.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof Se.rightOpen=="boolean"?bi=Se.rightOpen:typeof Se.right?.["concept:"+Se.active]=="boolean"&&(bi=Se.right["concept:"+Se.active]))}}catch{}function ga(){if(!(!Se||Jn!==t.business().key||!$e)){for(const b of Array.isArray(Se.overviewModes)?Se.overviewModes:[])F(b)&&It.add(b);for(const[b,w]of Object.entries(Se.lastExamples??Se.examples??{}))typeof w=="string"&&Q(b,w)&&tn.set(b,w);for(const[b,w]of Object.entries(Se.examples??{}))typeof w=="string"&&Q(b,w)&&We.set(b,w);for(const[b,w]of Object.entries(Se.selected??{}))typeof w=="string"&&ne.includes(w)&&ct.set(b,w);et=[...new Set((Array.isArray(Se.concepts)?Se.concepts:[]).filter(b=>typeof b=="string"&&pe.includes(b)))],B=et.includes(Se.active)?Se.active:"landscape"}}let vn;const Be=()=>{try{sessionStorage.setItem(x,JSON.stringify({documentKey:An,overviewClosed:mt,selected:Object.fromEntries(ct),examples:Object.fromEntries(We),lastExamples:Object.fromEntries(tn),overviewModes:[...It],left:Vt,expandedVersion:4,expanded:[..._e],concepts:et,active:B,states:tt,specs:pt,activeSpec:Re,specExamples:Object.fromEntries(ht),...t.rightDrawer?{}:{rightOpen:ut.isOpen()}}))}catch{}},nn=()=>{ie==="concept"&&Ke.set("drawer:"+B,D.querySelector(".concept-drawer-body").scrollTop),ie==="concept"&&ut.isOpen()&&It.has(B)&&Ke.set("review-overview:"+B,D.querySelector(".data-review-overview").scrollTop),ie==="concept"&&We.has(B)&&Ke.set("example:"+B+":"+We.get(B),D.querySelector(".data-examples-panel").scrollTop),ie==="states"&&ft&&Ke.set("state:"+ft,R.scrollTop),ie==="tests"&&Ke.set("tests:"+Re,g.querySelector(".test-spec-page").scrollTop),ie==="concept"&&B==="landscape"&&Ke.set("concept:landscape",u.querySelector(".concept-review-landscape").scrollTop)};function Xe(b=!0){if(gi)return;const w=new URL(location.href);if(w.searchParams.set("view",ie),w.searchParams.delete("concept"),w.searchParams.delete("dataExample"),w.searchParams.delete("dataView"),ie==="concept"&&ut.isOpen()&&It.has(B)?w.searchParams.set("dataView","overview"):ie==="concept"&&F(B)&&!We.has(B)&&w.searchParams.set("dataView","structure"),ie==="concept"&&ut.isOpen()&&We.has(B)&&w.searchParams.set("dataExample",We.get(B)),ie==="tests"&&ht.has(Re)&&w.searchParams.set("dataExample",ht.get(Re)),w.searchParams.delete("state"),w.searchParams.delete("activity"),w.searchParams.delete("object"),w.searchParams.delete("spec"),ie==="concept"&&w.searchParams.set("concept",B),ie==="states"&&ft&&w.searchParams.set("state",ft),ie==="tests"&&w.searchParams.set("spec",Re),ie==="business"){const E=t.business(),A=E.views?.find(P=>P.key===E.viewKey);A?.activity?w.searchParams.set("activity",A.activity):A?.object&&w.searchParams.set("object",A.object)}w.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",w)}function je(b,w,E){const A=document.createElement(w);return A.textContent=E,b.append(A),A}function bt(b){b!==ie&&(ie==="business"?t.capture():nn(),ie=b),n.hidden=ie!=="business",u.hidden=ie!=="concept",p.hidden=ie!=="states",g.hidden=ie!=="tests",f.hidden=ie!=="empty",e.dataset.workspaceArea=ie,ie==="business"&&t.refresh(),xt(),gt()}function Dt(b,w=!0){$e&&(b==="subsystems"&&(b="landscape"),pe.includes(b)&&(nn(),et.includes(b)||et.push(b),B=b,bt("concept"),po(),St(),Be(),w&&Xe()))}function ya(){nn(),We.delete(B),It.add(B),po(),D.querySelector(".concept-drawer-body").scrollTop=Ke.get("drawer-overview:"+B)??0,Be(),Xe()}function va(b,w=!0){if(b&&!Q(B,b))return;const E=!We.has(B),A=D.querySelector(".concept-drawer-body");E&&Ke.set("drawer-overview:"+B,A.scrollTop),nn(),It.delete(B),b?(We.set(B,b),tn.set(B,b)):We.delete(B),ut.setOpen(!0),po(),E&&(A.scrollTop=0),Be(),Xe(),w&&D.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}D.querySelector(".concept-example-back").onclick=()=>{ya(),D.querySelector(".data-review-overview").focus({preventScroll:!0})};function En(b,w=!0){t.business().states?.some(E=>E.id===b)&&(nn(),tt.includes(b)||tt.push(b),ft=b,bt("states"),Oa(),St(),Be(),w&&Xe())}function ro(b){return b.startsWith("decision:")&&Ie(b)&&!Ie(b)?.capability.testSpecification?Ie(b).key:Ie(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&Ve(b.slice(7))||b.startsWith("remaining:")&&en(b.slice(10))?b:t.business().activities.some(w=>w.id===b)?re().find(w=>w.activityId===b)?.key??(Ve(b)?"checks:"+b:"@overview"):"@overview"}function Lt(b,w=!0){const E=t.business();if(!E.design?.model||!E.key)return;b=ro(b),ie==="tests"&&b!==Re&&nn(),pt.includes(b)||pt.push(b),Re=b;const A=Ie(b);gi||(A?.capability.testSpecification?_e.add("tests-function-"+A.key):A?.activityId?_e.add("tests-activity-"+A.activityId):b.startsWith("checks:")?_e.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?_e.add("tests-activity-"+b.slice(10)):A&&_e.add("tests-other")),bt("tests"),ao(),St(),gt(),Be(),w&&Xe()}function ao(){const b=t.business().design;if(!b?.model)return;const w=g.querySelector(".test-spec-page"),E=Ie(Re);if(E){const A=document.createElement("section");A.className="test-spec-sample";const P=G?.findGroup(E.groupId),H=E.samples.find(le=>le.id===ht.get(Re))??E.samples[0],z=!!E.capability.testSpecification,X=Re.startsWith("decision:");if(z)if(je(A,"h2",E.name),je(A,"h3",X?"可否判定":"処理結果"),X)E.decisionExampleIds.length?A.append(rd(b,E.decisionExampleIds,ve())):E.decisionCheckIds.length?A.append(ad(b,E.decisionCheckIds,ve())):je(A,"p","可否条件の記載はありません。");else{const le=P&&H&&q?new Set(E.samples.flatMap(De=>De.checkIds??[])):new Set;if(A.append(cd(b,E.resultCheckIds,ve(),le)),P&&H&&q){je(A,"h3","データ例");const De=document.createElement("div");De.className="data-examples-panel test-spec-examples",A.append(De),q.renderDataExample(De,P,H.id,Ue=>{Ke.set("tests:"+Re,w.scrollTop),ht.set(Re,Ue),ao(),Be(),Xe(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:E.capability.id,sampleIds:E.samples.map(Ue=>Ue.id),hideCapability:!0,hideSinglePicker:!0})}}else if(P&&H&&q){const le=document.createElement("div");le.className="data-examples-panel test-spec-examples",A.append(le),q.renderDataExample(le,P,H.id,De=>{Ke.set("tests:"+Re,w.scrollTop),ht.set(Re,De),ao(),Be(),Xe(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:E.capability.id,heading:E.name,sampleIds:E.samples.map(De=>De.id),renderSpecification:De=>De.append(id(b,H.checkIds??[],ve()))})}w.replaceChildren(A)}else if(Re==="@overview")w.replaceChildren(),je(w,"p","左のメニューからテスト仕様を選択してください。");else if(Re.startsWith("remaining:")){const A=Re.slice(10);w.replaceChildren(Us(b,A,ve(),Ft(A),hn(A)))}else w.replaceChildren(Us(b,Re.startsWith("checks:")?Re.slice(7):void 0,ve()));Ia(E),w.scrollTop=Ke.get("tests:"+Re)??0}function _n(b){b||(mt=!1),bt("business"),b?t.openActivity(b):(mt=!1,t.openOverview()),gt(),St(),Xe()}function wa(b){bt("business"),t.openObject(b),gt(),St(),Xe()}function xs(b){const w=t.business(),E=w.design?.model;return E?[...new Set(E.states.filter(A=>A.objectId===b&&A.basedOn.documentId===E.business.id&&A.basedOn.revision===E.business.revision).flatMap(A=>A.transitions.map(P=>P.activityId)))]:[...new Set((w.design?.objectStateTransitions?.[b]?.model?.transitions??[]).flatMap(A=>A.activityId?[A.activityId]:[]))]}function As(b){return(t.business().states??[]).filter(w=>xs(w.id).includes(b))}function Es(b){const w=t.business(),E=w.design?.model,A=M?.model.concepts.find(P=>P.id===b);return!E||!M||!A?[]:(w.states??[]).filter(P=>A.businessObjectIds.includes(P.id)&&E.states.some(H=>H.objectId===P.id&&H.basedOn.documentId===E.business.id&&H.basedOn.revision===E.business.revision&&M.model.relatedStates.some(z=>z.documentId===H.id&&z.revision===H.revision)))}function co(b,w,E="状態遷移"){if(!w.length)return;const A=document.createElement("section");A.className="shell-related-links",je(A,"h3",E);for(const P of w){const H=Bt(A,P.name,()=>En(P.id));H.dataset.relatedState=P.id}b.append(A)}function Os(b){const w=M?.model.reviewGroups.find(A=>A.id===b.groupId);if(!w)return[];const E=new Set(w.graph.nodes.map(A=>A.conceptId));return[...new Set(b.samples.flatMap(A=>A.blocks.map(P=>P.card)))].filter(A=>E.has(A)&&M?.model.concepts.some(P=>P.id===A))}function Bt(b,w,E){const A=document.createElement("button");return A.type="button",A.className="shell-evidence",je(A,"span",w),A.onclick=E,b.append(A),A}function lo(b,w){const E=w.filter(P=>P.capability.testSpecification);if(!E.length)return;const A=document.createElement("section");A.className="shell-test-links",je(A,"h3","テスト仕様書");for(const P of E)for(const[H,z]of[["decision:","可否判定"],["","処理結果"]]){const X=H+P.key,le=Bt(A,ze(P)+"・"+z,()=>Lt(X));le.dataset.relatedSpec=X}b.append(A)}function ka(b,w){const E=re().filter(X=>X.activityId===w&&X.capability.testSpecification),A=M?.model.presentation.activityViews,P=Array.isArray(A)?A.find(X=>X&&typeof X=="object"&&X.activityId===w):void 0,H=Array.isArray(P?.uncreatedTestSections)?P.uncreatedTestSections:[],z=b.querySelectorAll("[data-business-result],[data-business-exception]");for(const X of Array.from(z)){const le=X.dataset.businessException,De=le?"exception":"result",Ue=le??"result",Fe=E.flatMap(nt=>nt.businessSections.filter(Rt=>Rt.kind===De&&(De==="result"||Rt.exceptionId===le)).flatMap(Rt=>Rt.pages.filter(U=>U==="decision"?nt.decisionCheckIds.length||nt.decisionExampleIds.length:nt.resultCheckIds.length||nt.samples.length).map(U=>({target:nt,page:U})))),At=document.createElement("section");At.className="shell-section-links",At.setAttribute("aria-label","テスト仕様書"),X.dataset.resultScope==="activity"&&je(At,"p",(Fe.length?"Activity全体との対応です。":"")+"各Resultとの対応は未確認です。");const dt=new Set;for(const{target:nt,page:Rt}of Fe){const U=(Rt==="decision"?"decision:":"")+nt.key;if(dt.has(U))continue;dt.add(U);const Ee=Bt(At,ze(nt)+"・"+(Rt==="decision"?"可否判定":"処理結果"),()=>Lt(U));Ee.dataset.relatedSpec=U}if(!dt.size){const nt=je(At,"p",H.includes(Ue)?"テスト仕様書未作成":"テスト仕様書との対応未確認");nt.className="shell-spec-warning"}X.after(At)}lo(b,E.filter(X=>!X.businessSections.length))}function Ia(b){const w=m.querySelector(".spec-related-content");if(w.replaceChildren(),!b?.capability.testSpecification)return;const E=t.business().activities.find(H=>H.id===b.activityId),A=G?.findGroup(b.groupId);if(E){je(w,"h3","Activity");const H=Bt(w,E.name,()=>_n(E.id));H.dataset.relatedActivity=E.id}if(A){je(w,"h3","概念モデル");const H=Bt(w,A.name,()=>Dt(L(A.id)));H.dataset.relatedGroup=A.id}const P=Os(b);if(P.length){je(w,"h3","概念");for(const H of P){const z=M.model.concepts.find(le=>le.id===H),X=Bt(w,z.name,()=>Dt(W(H)));X.dataset.relatedConcept=H}}b.activityId&&co(w,As(b.activityId),"状態遷移（同じ Activity）")}function Sa(b,w){je(b,"h3","Activity");const E=t.business(),A=F(B),P=M?.model.concepts.find(z=>z.id===w),H=A?.concepts[w]?.sourceActivities??A?.activities??P?.activityLinks.filter(z=>z.uses.includes("生成")).map(z=>z.activityId)??[];for(const z of H){const X=E.activities.find(De=>De.id===z);if(!X)continue;const le=document.createElement("button");le.className="shell-evidence",je(le,"span",X.name),le.title=X.name+"を業務タブで開く",le.setAttribute("aria-label",le.title),le.onclick=()=>_n(X.id),b.append(le)}}function uo(b){const w=F(b);return w?G?.graph(w.id):b==="overview"?G?.overviewGraph():void 0}function js(b){const w=bn.get(B),E=w?uo(B)?.tables[w]:void 0;return E?.conceptId===b?E:void 0}function xa(b,w){const E=js(w)??F(B)?.concepts[w]??{...te[w],sources:void 0};b.replaceChildren(),je(b,"p",E.note),je(b,"h3","持つ情報");const A=document.createElement("ul");for(const[,P]of E.fields)je(A,"li",P);if(b.append(A),E.sources?.length){je(b,"h3","情報の出所・対象時点");const P=document.createElement("ul");for(const H of E.sources)je(P,"li",H);b.append(P)}Sa(b,w),lo(b,re().filter(P=>Os(P).includes(w))),co(b,Es(w))}function fo(b){const w=D.querySelector(".shell-heading strong");w.textContent=b,D.setAttribute("aria-label",b)}function Cs(b=!1){F(B)&&(ct.delete(B),bn.delete(B),gn.delete(B),b||kt.get(B)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},T),vi(),xt(),D.querySelector(".concept-drawer-body").scrollTop=0,Be())}D.querySelector(".concept-selection-clear").onclick=()=>{Cs(),We.has(B)?D.querySelector(".concept-example-back").focus({preventScroll:!0}):D.querySelector(".data-review-overview").focus({preventScroll:!0})};function vi(){const b=D.querySelector(".concept-related-content");D.querySelector(".concept-selection").hidden=!!F(B)&&!ct.has(B)&&!gn.has(B),D.querySelector(".concept-selection>h2").hidden=!F(B),D.querySelector(".concept-selection-clear").hidden=!F(B);const w=gn.get(B);if(w&&ae){const H=ae.describe(b,{kind:"group",id:w});fo(H);return}if(B==="landscape"&&vn){b.replaceChildren();for(const[H,z]of ae.sections){je(b,"h3",H);const X=document.createElement("ul");for(const le of z)je(X,"li",le);b.append(X)}fo("サブシステムの情報");return}const E=ct.get(B),A=F(B),P=$e&&E?js(E)?.name??A?.concepts[E]?.name??te[E].name:A?.name??"データ構造の情報";fo(P),$e&&E?xa(b,E):(b.replaceChildren(),A||je(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function Ms(b){b.onload=()=>{Ds(),b.contentDocument&&(Ts(b.contentDocument),Ps(b.contentDocument));const w=b.dataset.conceptView??"overview";if(!G||!M)return;const E=F(w),A=E?G.graph(E.id):w==="overview"?G.overviewGraph():{ids:ne,edges:G.edges,tables:te};b.contentWindow?.postMessage({type:"alder-concept-data",graph:A,focus:Ne.get(w),viewKey:w,documentKey:An??M.model.id,clearSelectionOnBackground:!!E},T);const P=ct.get(w);P&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:P},T)}}Ms(O),O.dataset.conceptView="overview";function Aa(){D.querySelector(".concept-page-details").hidden=!0,D.querySelector(".concept-example-back").hidden=!0;const b=D.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const w=D.querySelector(".data-examples-panel");w.hidden=!0,w.replaceChildren(),delete w.dataset.dataExample,vn?.root.remove(),vn=void 0;for(const[E,A]of kt)E!=="overview"&&(A.remove(),kt.delete(E));O.removeAttribute("src"),O.removeAttribute("srcdoc"),ct.clear(),bn.clear(),gn.clear()}function po(){u.setAttribute("aria-label",B==="landscape"||F(B)?"サブシステム":"データ構造"),u.querySelector(".concept-empty").hidden=$e;const b=u.querySelector(".concept-review-landscape"),w=F(B),E=D.querySelector(".concept-page-details"),A=D.querySelector(".data-review-overview"),P=D.querySelector(".data-examples-panel");if(E.hidden=!$e||!w,A.hidden=!$e||!w||We.has(B),P.hidden=!$e||!w||!We.has(B),D.querySelector(".concept-example-back").hidden=P.hidden,$e&&w){const z=re();hc(A,w,q,(le,De)=>{const Ue=Fs(z,w.id,le,De);if(Ue)return{kind:Ue.kind,open:()=>{const Fe=Fs(re(),w.id,le,De);Fe&&(Fe.sampleId?ht.set(Fe.key,Fe.sampleId):ht.delete(Fe.key),Lt(Fe.key))}}},le=>_n(le),t.business().activities),lo(A,z.filter(le=>le.groupId===w.id));const X=We.get(B)??tn.get(B)??Ae(B)[0]?.id;X&&q.renderDataExample(P,w,X,le=>va(le)),A.scrollTop=Ke.get("review-overview:"+B)??0,P.scrollTop=Ke.get("example:"+B+":"+X)??0}if(b.hidden=!$e||!jn.includes(B),$e&&jn.includes(B)&&(B==="landscape"&&!vn&&(vn=kc(document,M,An??M.model.id,z=>Dt(L(z)))),mc(b,vn?.root,B==="overview"?"graph":"overview"),B==="landscape"&&vn?.restore()),$e&&B!=="landscape"&&!kt.has(B)){const z=document.createElement("iframe");z.className="concept-frame",z.dataset.conceptView=B,z.title=w?w.name+"のデータ構造":te[Ne.get(B)].name+"と隣接する概念",z.hidden=!0,kt.set(B,z);const X=Ne.get(B);X&&ct.set(B,ct.get(B)??X),Ms(z),u.querySelector(".concept-main").append(z)}for(const[z,X]of kt)X.hidden=!$e||z!==B,$e&&z===B&&!X.hasAttribute("src")&&!X.hasAttribute("srcdoc")&&(N?X.srcdoc=N:X.src=new URL("concept.html?view=overview"+(F(z)?"&group="+encodeURIComponent(F(z).id):z==="overview"?"":"&focus="+encodeURIComponent(Ne.get(z))),document.baseURI).href);const H=ct.get(B);H&&kt.get(B)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:H},T),vi(),xt(),D.querySelector(".concept-drawer-body").scrollTop=Ke.get("drawer:"+B)??0}function On(){const b=t.business(),w=b.views?.find(E=>E.activity!==void 0||E.object!==void 0||!mt);w?(bt("business"),t.activateView(w.key)):et.length?Dt(et.at(-1),!1):tt.length?En(tt.at(-1),!1):pt.length?Lt(pt.at(-1),!1):bt("empty")}function Ea(){if(mt=!0,ie==="business"){const b=t.business().views?.find(w=>w.key===t.business().viewKey);!b?.activity&&!b?.object&&On()}St(),gt(),Be(),Xe(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function Oa(){R.replaceChildren();const b=t.business().states?.find(X=>X.id===ft);if(!b)return;const w=t.statePanel(b.id);w?R.append(w):je(R,"p","この対象の状態遷移は未定義です。");const E=m.querySelector(".spec-related-content");E.replaceChildren();const A=xs(b.id),P=t.business().activities.filter(X=>A.includes(X.id));if(P.length){je(E,"h3","Activity");for(const X of P){const le=Bt(E,X.name,()=>_n(X.id));le.dataset.relatedActivity=X.id}}const H=M?.model.concepts.filter(X=>Es(X.id).some(le=>le.id===b.id))??[];if(H.length){je(E,"h3","概念");for(const X of H){const le=Bt(E,X.name,()=>Dt(W(X.id)));le.dataset.relatedConcept=X.id}}const z=re().filter(X=>X.activityId&&A.includes(X.activityId)&&X.capability.testSpecification);if(z.length){je(E,"h3","Activity に関連するテスト仕様書");for(const X of z)for(const[le,De]of[["decision:","可否判定"],["","処理結果"]]){const Ue=le+X.key,Fe=Bt(E,ze(X)+"・"+De,()=>Lt(Ue));Fe.dataset.relatedSpec=Ue}}R.scrollTop=Ke.get("state:"+ft)??0}let mo="";function St(){for(const A of Array.from(o.querySelectorAll(".tab"))){const P=t.business().views?.find(z=>z.key===A.dataset.key);A.hidden=mt&&P?.activity===void 0&&P?.object===void 0;const H=!A.hidden&&ie==="business"&&A.dataset.key===t.business().viewKey;A.classList.toggle("active",H),A.querySelector("button")?.setAttribute("aria-current",String(H))}const b=(A,P,H)=>{A.replaceChildren();for(const z of P){const X=H==="concept"?Le(z):t.business().states?.find(dt=>dt.id===z)?.name??z,le=ie===H&&z===(H==="concept"?B:ft),De=document.createElement("div");De.className="tab"+(le?" active":"");const Ue=H==="concept"&&(z==="landscape"||F(z))?"subsystems":H;De.dataset.viewKind=Ue;const Fe=document.createElement("button");Fe.id=(H==="concept"?"concept-tab-":"state-tab-")+z,Eo(Fe,Ue,X),Fe.setAttribute("aria-current",String(le)),Fe.onclick=()=>H==="concept"?Dt(z):En(z),De.append(Fe);const At=Oo((Ue==="subsystems"?"サブシステム：":H==="concept"?"データ構造：":"状態遷移：")+X+"のタブを閉じる");At.onclick=()=>{nn(),H==="concept"?(et=et.filter(dt=>dt!==z),z!=="overview"&&(kt.get(z)?.remove(),kt.delete(z)),ct.delete(z),bn.delete(z),gn.delete(z),We.delete(z),tn.delete(z),It.delete(z),ie===H&&B===z&&(et.length?Dt(et.at(-1),!1):On())):(tt=tt.filter(dt=>dt!==z),ie===H&&ft===z&&(tt.length?En(tt.at(-1),!1):On())),St(),gt(),Be(),Xe(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},De.append(At),A.append(De)}};b(l,et,"concept"),b(c,tt,"states"),h.replaceChildren();for(const A of pt){const P=ba(A),H=document.createElement("div");H.className="tab"+(ie==="tests"&&A===Re?" active":""),H.dataset.viewKind="tests";const z=document.createElement("button");z.id="spec-tab-"+A,Eo(z,"tests",P),z.setAttribute("aria-current",String(ie==="tests"&&A===Re)),z.onclick=()=>Lt(A);const X=Oo("テスト仕様："+P+"のタブを閉じる");X.onclick=()=>{pt=pt.filter(le=>le!==A),ie==="tests"&&Re===A&&(pt.length?Lt(pt.at(-1),!1):On()),St(),gt(),Be(),Xe()},H.append(z,X),h.append(H)}const w=a.querySelector(".tab.active:not([hidden])"),E=ie==="business"?"business:"+t.business().viewKey:ie==="concept"?"concept:"+B:ie==="states"?"states:"+ft:ie==="tests"?"tests:"+Re:"";w?(E!==mo&&lc(a,w),mo=E):mo=""}function ja(){innerWidth<=800&&wi(!1)}function gt(){const b=I.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,w=I.scrollTop,E=t.business(),A=C.value.trim().toLocaleLowerCase();I.replaceChildren();const P=(U,Ee,it)=>({kind:"item",id:U,name:Ee,key:it}),H=(U,Ee,it)=>({kind:"group",id:U,name:Ee,children:it}),z=re(),X=U=>P(U.key,U.name,"tests:"+U.key),le=z.filter(U=>U.capability.testSpecification),De=z.filter(U=>!U.capability.testSpecification),Ue=le.map(U=>H("tests-function-"+U.key,ze(U),[P("decision:"+U.key,"可否判定","tests:decision:"+U.key),P(U.key,"処理結果","tests:"+U.key)]));for(const U of E.activities){const Ee=De.filter(Qe=>Qe.activityId===U.id).map(X),it=(Ft(U.id).size?"remaining:":"checks:")+U.id;en(U.id)&&Ee.push(P(it,"その他","tests:"+it)),Ee.length&&Ue.push(H("tests-activity-"+U.id,U.name,Ee))}const Fe=De.filter(U=>!U.activityId);Fe.length&&Ue.push(H("tests-other","その他",Fe.map(X))),ha()&&Ue.push(P("@unassigned","未割当","tests:@unassigned"));const At=[{id:"business",label:"業務設計",items:[P("overview","全体図","business:overview"),H("business-activity","Activity",E.activities.map(U=>P(U.id,U.name,"business:"+U.id))),H("business-object","Object",(E.objects??[]).map(U=>P(U.id,U.name,"object:"+U.id)))]},{id:"states",label:"状態遷移",items:(E.states??[]).map(U=>P(U.id,U.name,"states:"+U.id))},{id:"subsystems",label:"サブシステム",items:M?.model.subsystems.length?[P("landscape","全体図","concept:landscape"),...M.model.subsystems.map(U=>H("subsystem-"+U.id,U.name.replace(/サブシステム$/,""),M.model.reviewGroups.filter(Ee=>Ee.subsystemId===U.id).map(Ee=>P(L(Ee.id),Ee.title,"concept:"+L(Ee.id)))))]:[]},{id:"concept",label:"データ構造",items:$e&&ne.length?[P("overview","全体図","concept:overview"),H("concept-relations","概念",ne.map(U=>P(W(U),te[U].name,"concept:"+W(U))))]:[]},{id:"tests",label:"テスト仕様",items:E.design?.model&&(z.length||ve().length)?Ue:[]}];let dt=0;const nt=(U,Ee,it)=>{const Qe=document.createElement("button");Qe.className="explorer-item"+(it?" explorer-item-nested":""),Qe.dataset.explorerKey=U.key,Qe.textContent=U.name;const Ze=E.views?.find(Ge=>Ge.key===E.viewKey);return ie===(Ee.id==="subsystems"?"concept":Ee.id)&&(["concept","subsystems"].includes(Ee.id)?U.id===B:Ee.id==="states"?U.id===ft:Ee.id==="tests"?U.id===Re:U.key.startsWith("object:")?Ze?.object===U.id:U.id==="overview"?!mt&&Ze?.activity===void 0&&Ze?.object===void 0:Ze?.activity===U.id)&&Qe.setAttribute("aria-current","page"),Qe.disabled=Ee.id==="business"&&!E.key,Qe.onclick=()=>{y.hidden||t.closeLegacyList(),Ee.id==="business"?U.key.startsWith("object:")?wa(U.id):_n(U.id==="overview"?void 0:U.id):Ee.id==="concept"||Ee.id==="subsystems"?Dt(U.id):Ee.id==="tests"?Lt(U.id):En(U.id),ja()},Qe},Rt=(U,Ee,it,Qe=!1)=>{const Ze=document.createElement("button"),Nt=A?!yn.has(U):_e.has(U);return Ze.className=(it?"explorer-subparent":"explorer-parent")+(Qe?" explorer-pending":""),Ze.dataset.explorerKey="group:"+U,je(Ze,"span",Ee).className="explorer-parent-label",Qe?(Ze.disabled=!0,Ze):(Ze.setAttribute("aria-expanded",String(Nt)),Ze.setAttribute("aria-controls","explorer-"+U),Ze.append(cc(Nt)),Ze.onclick=()=>{A?yn.has(U)?yn.delete(U):yn.add(U):(_e.has(U)?_e.delete(U):_e.add(U),Be()),gt()},Ze)};for(const U of At){const Ee=U.items.flatMap(Ge=>{if(Ge.kind==="item")return!A||(U.label+" "+Ge.name).toLocaleLowerCase().includes(A)?[Ge]:[];const on=A?Ge.children.filter(bo=>(U.label+" "+Ge.name+" "+bo.name).toLocaleLowerCase().includes(A)):Ge.children;return!A||on.length?[{...Ge,children:on}]:[]});if(A&&!Ee.length)continue;const it=U.id!=="business"&&!U.items.length,Qe=document.createElement("section"),Ze=Rt(U.id,U.label,!1,it),Nt=document.createElement("div");Nt.id="explorer-"+U.id,Nt.hidden=it||(A?yn.has(U.id):!_e.has(U.id));for(const Ge of Ee){if(Ge.kind==="item"){Nt.append(nt(Ge,U,0)),dt++;continue}const on=document.createElement("div");on.id="explorer-"+Ge.id,on.hidden=A?yn.has(Ge.id):!_e.has(Ge.id),Nt.append(Rt(Ge.id,Ge.name,!0),on);for(const bo of Ge.children)on.append(nt(bo,U,1)),dt++;!Ge.children.length&&!A&&(je(on,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ee.length&&!it&&(je(Nt,"p","項目がありません。").className="explorer-empty"),Qe.append(Ze,Nt),I.append(Qe)}A&&!dt&&(je(I,"p","該当する項目はありません。").className="explorer-empty"),I.scrollTop=w,b&&Array.from(I.querySelectorAll("[data-explorer-key]")).find(U=>U.dataset.explorerKey===b)?.focus({preventScroll:!0})}function wi(b){Vt=b,xt(),Be(),(b?r.querySelector(".shell-heading button"):S).focus({preventScroll:!0})}S.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),wi(!Vt)},!0),r.querySelector(".shell-heading button").onclick=()=>wi(!1),C.oninput=()=>{yn.clear(),gt()},r.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&y.hidden&&(b.preventDefault(),b.stopPropagation(),wi(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&I.contains(document.activeElement)){const w=Array.from(I.querySelectorAll("button")).filter(P=>!P.disabled&&!P.closest("[hidden]")),E=w.indexOf(document.activeElement),A=w[E+(b.key==="ArrowDown"?1:-1)];A&&(b.preventDefault(),A.focus())}}),v.addEventListener("click",b=>{ie!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),(ie==="concept"||ie==="states"||ie==="tests"&&Ie(Re)?.capability.testSpecification)&&(ut.setOpen(!ut.isOpen()),xt(),Be(),Xe(!1)))},!0),D.querySelector(".shell-heading button").onclick=()=>{ut.setOpen(!1),xt(),Be(),Xe(!1),v.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{ut.setOpen(!1),xt(),Be(),Xe(!1),v.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const w=Array.from(kt).find(([,A])=>b.source===A.contentWindow);if(!w)return;if(b.data?.type==="alder-concept-rendered"){w[1].contentDocument&&(Ts(w[1].contentDocument),Ps(w[1].contentDocument));return}if(ie!=="concept"||w[0]!==B)return;const E=F(B);if(b.data?.type==="alder-concept-clear-selection"){E&&Cs(!0);return}if(b.data?.type==="alder-concept-subsystem"){if(!uo(B)?.regions.some(A=>A.id===b.data.id))return;ct.delete(B),bn.delete(B),gn.set(B,b.data.id),vi(),xt(),Be();return}if(!(!ne.includes(b.data?.id)||E&&!E.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){Dt(W(b.data.id));return}b.data.type==="alder-concept-select"&&(gn.delete(B),ct.set(B,b.data.id),(typeof b.data.viewId=="string"?uo(B)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?bn.set(B,b.data.viewId):bn.delete(B),innerWidth<=800&&(Vt=!1),vi(),xt(),Be())}});function Ds(){const b=getComputedStyle(document.documentElement);for(const w of kt.values()){const E=w.contentDocument?.documentElement;if(E){E.dataset.theme=document.documentElement.dataset.theme??"light";for(const A of["--bg","--panel","--fg","--line","--subtle","--select"])E.style.setProperty(A,b.getPropertyValue(A))}}}function xt(){!y.hidden&&ie==="business"&&(Vt=!0),r.hidden=!Vt,S.disabled=!1,S.setAttribute("aria-controls","design-explorer"),S.setAttribute("aria-label","ナビゲーションを開閉"),S.setAttribute("aria-expanded",String(Vt));const b=ut.isReady?.()??!0;D.hidden=ie!=="concept"||!$e||!b||!ut.isOpen();const w=!!Ie(Re)?.capability.testSpecification;m.hidden=!(ie==="states"||ie==="tests"&&w)||!b||!ut.isOpen(),hi&&ie!=="business"&&(hi.hidden=!0),ie==="concept"?(v.disabled=!$e||!b,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!D.hidden))):ie==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):ie==="states"||ie==="tests"&&w?(v.disabled=!b,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!m.hidden))):(ie==="tests"||ie==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const E=i.querySelector("#document-actions");E&&(E.hidden=ie!=="business");const A=i.querySelector("#document-actions-toggle");A&&ie!=="business"&&(A.hidden=!0),Ds(),ho()}function ho(){const b=i.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(ho);b.observe(i),b.observe(e.querySelector("header"))}window.addEventListener("resize",ho);function Ls(){nn(),gi=!0;try{const b=new URL(location.href).searchParams;if(ie==="concept"&&b.get("view")==="concept"&&b.get("concept")===B&&!We.has(B)&&Q(B,b.get("dataExample"))&&Ke.set("drawer-overview:"+B,D.querySelector(".concept-drawer-body").scrollTop),$e||(It.clear(),We.clear(),tn.clear(),et=[],B="overview",O.removeAttribute("src"),O.removeAttribute("srcdoc")),b.get("view")==="concept"){const w=$e&&pe.includes(b.get("concept")??"")?b.get("concept"):"landscape",E=b.get("dataExample");$e&&F(w)&&b.get("dataView")==="overview"&&!Q(w,E)?(It.add(w),We.delete(w)):(It.delete(w),$e&&Q(w,E)?(We.set(w,E),tn.set(w,E)):We.delete(w)),Dt(w,!1)}else if(b.get("view")==="states")t.business().states?.some(w=>w.id===b.get("state"))?En(b.get("state"),!1):On();else if(b.get("view")==="tests"){const w=ro(b.get("spec")??"@overview"),E=b.get("dataExample"),A=Ie(w);A&&E&&A.samples.some(P=>P.id===E)?ht.set(w,E):A&&ht.delete(w),Lt(w,!1)}else if(b.get("view")==="empty")bt("empty");else if(bt("business"),t.business().key){const w=b.get("activity"),E=b.get("object"),A=t.business(),P=A.views?.find(H=>H.key===A.viewKey);w&&A.activities.some(H=>H.id===w)?P?.activity!==w&&t.openActivity(w):E&&A.objects?.some(H=>H.id===E)?P?.object!==E&&t.openObject(E):(mt=!1,(!P||P.activity!==void 0||P.object!==void 0)&&t.openOverview())}St(),gt()}finally{gi=!1}}return window.addEventListener("popstate",Ls),{closeBusinessOverview:Ea,reopenBusinessOverview(){mt=!1},activateBusiness(){bt("business")},businessActivated(){bt("business"),St(),gt(),Xe()},syncChrome:xt,appendActivityTestLinks(b,w){ka(b,w),co(b,As(w))},openRelatedChecks(b){_e.add("tests"),Lt(b&&Ve(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),w=b.concept,E=!!(An&&b.key!==An||yi&&Jn&&b.key&&b.key!==Jn),A=M?.model!==w?.model||M?.business!==w?.business;if((E||A&&M)&&(g.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),D.querySelector(".concept-related-content").replaceChildren(),mt=!1,et=[],tt=[],pt=[],B="overview",ft="",Re="@overview",ht.clear(),Ke.clear(),It.clear(),We.clear(),tn.clear(),Aa(),ie!=="business"&&bt("business"),E&&!yi&&Xe(!1)),A){M=w,G=w?fc(w):void 0,q=w?Sc(w):void 0,ae=w?bc(w):void 0,$e=!!w,te=G?.tables??{},ne=Object.keys(te);const P=G?.groups.map(z=>z.id)??[],H=new Set([...jn,"subsystems"]);if(we=new Map(P.map(z=>[z,H.has(z)||ne.includes(z)?"group:"+z:z])),Me=new Map(ne.map(z=>[z,H.has(z)||P.includes(z)?"concept:"+z:z])),he=new Map([...we].map(([z,X])=>[X,z])),Ne=new Map([...Me].map(([z,X])=>[X,z])),pe=[...jn,...he.keys(),...Ne.keys()],Array.isArray(Se?.expanded)&&Se.expandedVersion!==4){_e.add("subsystems"),_e.add("concept-relations");for(const z of w?.model.subsystems??[])_e.add("subsystem-"+z.id)}}if(An=b.key,tt=tt.filter(P=>b.states?.some(H=>H.id===P)),ie==="business"&&mt&&b.views?.find(P=>P.key===b.viewKey)?.activity===void 0&&b.views?.find(P=>P.key===b.viewKey)?.object===void 0&&On(),yi&&b.key){if(ga(),Jn===b.key){Array.isArray(Se?.specs)&&(pt=[...new Set(Se.specs.filter(P=>typeof P=="string").map(P=>ro(P)))]);for(const[P,H]of Object.entries(Se?.specExamples??{})){const z=Ie(P);typeof H=="string"&&z?.capability.samples.some(X=>X.id===H)&&ht.set(P,H)}}yi=!1,Ls()}gt(),St(),xt(),E&&Be()}}}class Ro{tabs=new WeakMap;router;constructor(t=xo){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,s){const r=JSON.stringify([i.map(u=>[u.id,u.width,u.height]),o.map(u=>[u.kind,u.from,u.to,u.label]),s]),d=this.tabs.get(t),a=!d||d.design!==n||d.structure!==r,l=new Set(i.filter(u=>{const p=d?.nodes.get(u.id);return!p||p.x!==u.x||p.y!==u.y}).map(u=>u.id)),c=new Set(i.map(u=>u.id)),h=a?new Array(o.length):d.routes.slice();if(o.forEach((u,p)=>{!a&&!l.has(u.from)&&!l.has(u.to)||(h[p]=c.has(u.from)&&c.has(u.to)?this.router({from:u.from,to:u.to,index:p,nodes:i,kind:u.kind,matrix:s?.[p],labels:s?.[p]?[]:[...h.flatMap((g,m)=>g&&m<p?[{id:String(m),x:g.label[0]-Math.max(30,o[m].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:s?.[p]?[]:h.flatMap((g,m)=>g&&m<p?[g.points]:[]),labelWidth:Math.max(30,u.label.length*12),labelHeight:18}):void 0)}),s){const u=[],p=new Map,g=h.map((m,f)=>f).sort((m,f)=>Number(s[m].returning)-Number(s[f].returning));for(const m of g){const f=h[m];if(!f)continue;const y=i.find(O=>O.id===o[m].from),S=Math.max(30,o[m].label.length*12),v=s[m].returning?[Math.max(...f.points.map(O=>O[0]))+8+S/2,f.points[0][1]]:[y.x+y.width*.125+8+S/2,Ta(y.y+y.height,s[m].captionLane*kr)+9],C=Ir(o[m],m,s[m]),I=p.get(C)??Ao(v,S,18,i,u);(I[0]!==f.label[0]||I[1]!==f.label[1])&&(h[m]={...f,label:I}),p.has(C)||(p.set(C,I),u.push({id:String(m),x:I[0]-S/2,y:I[1]-9,width:S,height:18}))}}return this.tabs.set(t,{design:n,structure:r,nodes:new Map(i.map(u=>[u.id,{...u}])),routes:h}),h}}function ud(e,t,n,i){const o=(h,u,p)=>(u[0]-h[0])*(p[1]-h[1])-(u[1]-h[1])*(p[0]-h[0]),s=o(e,t,n),r=o(e,t,i),d=o(n,i,e),a=o(n,i,t),l=1e-6;if(s*r<-l&&d*a<-l)return!0;if(Math.max(Math.abs(s),Math.abs(r),Math.abs(d),Math.abs(a))>l)return!1;const c=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[c],t[c]),Math.max(n[c],i[c]))-Math.max(Math.min(e[c],t[c]),Math.min(n[c],i[c]))>.1}function fd(e,t,n,i,o=[]){const s=e.x+e.width,r=24,d=e.y+e.height,a=s-8-(2*(n.count-n.index)-1)*r,l=t.filter(S=>S.id!==e.id);let c;for(const S of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const C=[a+S,d],I=[C[0]+r,d];if(C[0]<e.x+8||I[0]>s-8)continue;const O=d+n.depth+v,D=Math.min(12,(I[0]-C[0])/2,(O-d)/2),R=[C];let x=`M${C}`;const T=q=>{x+=` L${q}`,R.push(q)},N=(q,ae)=>{const te=R.at(-1);x+=` Q${q} ${ae}`;for(let ne=1;ne<=4;ne++){const pe=ne/4,he=1-pe;R.push([he*he*te[0]+2*he*pe*q[0]+pe*pe*ae[0],he*he*te[1]+2*he*pe*q[1]+pe*pe*ae[1]])}};T([C[0],O-D]),N([C[0],O],[C[0]+D,O]),T([I[0]-D,O]),N([I[0],O],[I[0],O-D]),T(I);const M=Pa(R,l,.3),G=o.filter(q=>R.slice(1).some((ae,te)=>q.slice(1).some((ne,pe)=>ud(R[te],ae,q[pe],ne)))).length;if((!c||M<c.collisions||M===c.collisions&&G<c.wireCollisions)&&(c={path:x,points:R,collisions:M,wireCollisions:G,low:O,extra:v,shift:S}),M===0&&G===0)break}const{path:h,points:u,collisions:p,wireCollisions:g,low:m,extra:f,shift:y}=c;return{path:h,points:u,label:[Math.max(s+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...u.map(S=>S[0])),bottom:Math.max(...u.map(S=>S[1]))},collisions:p+g,rerouted:f>0||y!==0,fallback:p+g>0}}function pd(e,t=Xo()){const n="http://www.w3.org/2000/svg",i=(L,W={})=>{const F=document.createElementNS(n,L);for(const[me,Q]of Object.entries(W))F.setAttribute(me,Q);return F},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(L=>[L]),r=[...new Set(["@new",...e.states,...s.map(L=>L[0].to)])],d={nodes:r.map(L=>({id:L,type:"business",name:o[L]??L,scope:!0})),relations:s.map(([L])=>({kind:L.path==="exception"?"business-exception":"input",from:L.from,to:L.to,label:L.id+"："+L.activity+"："+L.condition}))},a=Qo(d,r),l=L=>{const W=Array.from(L);return Array.from({length:Math.ceil(W.length/28)},(F,me)=>W.slice(me*28,(me+1)*28).join(""))},c=s.map(([L])=>({from:L.from,activity:L.activity,rows:[L],lines:[],lineRows:[],offset:0,width:0,height:0})),h=new Map;for(const[L,W]of c.entries()){const F=W.rows[0],me=e.transitions.filter(re=>re.from===F.from&&(re.activityId??re.activity)===(F.activityId??F.activity)&&re.path===F.path&&(F.path!=="exception"||(re.exception??"例外名未定義")===(F.exception??"例外名未定義"))),Q=me.map(re=>(re.conditionLabel??re.condition).trim().replace(/\s+/g," ")),Ae=new Set(Q).size===me.length?F.conditionLabel??F.condition:F.condition,ve=[F.path==="exception"?"例外："+(F.exception??"例外名未定義"):"",...me.length>1||F.path==="normal"&&F.conditionLabel?[Ae]:[]].filter(Boolean).join("：");W.lines=l(W.activity+(ve?"（"+ve+"）":"")),W.lineRows=W.lines.map(()=>W.rows),W.width=Math.max(...W.lines.map(re=>Array.from(re).length*14)),W.height=W.lines.length*18,a.wires[L].returning||(W.offset=h.has(W.from)?h.get(W.from)+8:0,h.set(W.from,W.offset+W.height))}const u=new Map;s.forEach(([L],W)=>{if(L.from===L.to){const F=u.get(L.from)??[];F.push(W),u.set(L.from,F)}});const p=new Map,g=new Map;for(const[L,W]of u){let F=0;for(const Q of[...W].reverse())p.set(Q,{leader:W[0],index:0,count:1,depth:0,offset:F}),F+=c[Q].height+8;const me=24+Math.max(0,F-8)+8;g.set(L,me);for(const Q of W)p.get(Q).depth=me}const m=L=>44,f=r.slice().sort((L,W)=>a.positions[L][1]-a.positions[W][1]);let y=Math.max(40,...c.map((L,W)=>a.wires[W].returning&&L.from===f[0]?16+L.height/2-44*(a.wires[W].fromPort??.5):40));const S=new Map;for(const L of f){const W=m(),F=(h.get(L)??0)+(g.get(L)??0);S.set(L,y),y+=qa(W,F)}const v=r.map(L=>({id:L,x:t.positions.get(L)?.[0]??a.positions[L][0],y:t.positions.get(L)?.[1]??S.get(L),width:Math.max(104,Array.from(o[L]??L).length*14+32),height:m()})),C=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),I=i("title");I.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(r.includes("@none")?"作成なしはこの操作の処理結果。":"")+(r.includes("@unknown")?"未決は設計課題。":""),C.append(I),C.append(Zo("state-transition-"));const O=new Map,D=[],R=[];let x=t.selected;const T=L=>{x=L,t.selected=L;const W=Li(e.transitions,x);for(const[Q,Ae]of O)Ae.setAttribute("class","node graph-shape state-shape"+W.nodeClasses(Q)),Ae.setAttribute("aria-pressed",String(Q===x));D.forEach(({element:Q,rows:Ae})=>{const Le=Ae[0].from===Ae[0].to;Q.setAttribute("class","edge"+(Le?" state-self-loop":Ae[0].path==="exception"?" exception":"")+W.labelClasses(Ae)),Q.setAttribute("marker-end","url(#state-transition-"+(Ae.some(W.related)?"related-arrow":"arrow")+")")});for(const Q of R)Q.element.setAttribute("class","state-caption-line"+W.labelClasses(Q.rows));C.querySelectorAll("[data-exception-paint]").forEach(Q=>Q.remove());const F=Array.from(C.children).find(Q=>Q.matches(".state-diagram-edge-label,[data-state]"))??null,me=[...D].sort((Q,Ae)=>Number(Q.rows.some(W.related))-Number(Ae.rows.some(W.related)));for(const{element:Q}of me)if(C.insertBefore(Q,F),Q.classList.contains("exception")||Q.classList.contains("state-self-loop")){const Ae=C.children.length;Yo(C,Q,{path:Q.getAttribute("d")},{"data-transitions":Q.getAttribute("data-transitions")});for(const Le of Array.from(C.children).slice(Ae))C.insertBefore(Le,F)}C.querySelectorAll(".state-diagram-edge-label").forEach(Q=>C.append(Q))};C.addEventListener("click",L=>{L.target===C&&T()}),C.addEventListener("keydown",L=>{L.key==="Escape"&&(L.preventDefault(),T())});const N=a.wires.map((L,W)=>({...L,captionLane:(c[W].offset+(g.get(c[W].from)??0))/kr})),M=d.relations.map((L,W)=>({...L,label:String(W).padEnd(Math.ceil(c[W].width/12),"x")})),G=[...p].map(([L,W])=>{const F=v.find(Q=>Q.id===s[L][0].from),me=c[L];return{x:F.x+F.width+8,y:F.y+F.height+24+W.offset,width:me.width,height:me.height}});let q=new Ro().update({},e,v,M,N);for(let L=0;L<=G.length;L++){let W=!1,F=0;if(q.forEach((me,Q)=>{if(!me||p.has(Q)||!N[Q].returning)return;let Ae=0;for(const Le of G)for(let ve=1;ve<me.points.length;ve++){const re=me.points[ve-1],Ie=me.points[ve];if(Math.abs(re[0]-Ie[0])>1e-7||Math.abs(re[1]-Ie[1])<2)continue;const ze=re[0];if(ze<Le.x-4||ze>Le.x+Le.width+4||Math.max(re[1],Ie[1])<Le.y-4||Math.min(re[1],Ie[1])>Le.y+Le.height+4)continue;const Ve=Le.x+Le.width+12-ze;Ve>0&&(Ae=Math.max(Ae,Ve))}Ae&&(N[Q]={...N[Q],returnLane:(N[Q].returnLane??0)+Math.ceil(Ae/16)+F++},W=!0)}),!W)break;q=new Ro().update({},e,v,M,N)}const ae=q.flatMap((L,W)=>L&&!p.has(W)?[L.points]:[]),te=new Map,ne=q.map((L,W)=>{const F=p.get(W);if(!F)return L;const me=s[W][0].from,Q=v.find(Ve=>Ve.id===me),Ae=q.flatMap((Ve,Ft)=>Ve&&!p.has(Ft)?[Ve.points]:[]),Le=Math.max(30,M[W].label.length*12),ve=c[W];let re=te.get(F.leader);re||(re=fd(Q,v,{...F,labelLeft:Q.x+Q.width+8},Le,ae),te.set(F.leader,re),ae.push(re.points));const Ie=Ae.flatMap((Ve,Ft)=>Ve.slice(1).map((hn,en)=>({id:`${Ft}:${en}`,x:Math.min(Ve[en][0],hn[0])-2,y:Math.min(Ve[en][1],hn[1])-2,width:Math.abs(Ve[en][0]-hn[0])+4,height:Math.abs(Ve[en][1]-hn[1])+4}))),ze=Ao([Q.x+Q.width+8+ve.width/2,Q.y+Q.height+24+F.offset+ve.height/2],ve.width,ve.height,[...v,...Ie]);return{...re,label:[ze[0]-ve.width/2+Le/2,ze[1]]}}),pe=new Array(s.length),he=[],Ne=s.map((L,W)=>W).sort((L,W)=>Number(N[L].returning)-Number(N[W].returning));for(const L of Ne){const W=ne[L],F=c[L],me=Math.max(30,M[L].label.length*12);let Q=[W.label[0]-me/2+F.width/2,W.label[1]+(N[L].returning?0:F.height/2-9)];const Ae=v.find(re=>re.id===s[L][0].from),Le=v.find(re=>re.id===s[L][0].to);if(!p.has(L)&&N[L].returning&&Le&&Le.y>Ae.y){const re=W.points.slice(1).map((Ie,ze)=>[W.points[ze],Ie]).filter(([Ie,ze])=>Math.abs(Ie[0]-ze[0])<.01&&ze[1]-Ie[1]>24).sort(([Ie,ze],[Ve,Ft])=>Ft[1]-Ve[1]-(ze[1]-Ie[1]))[0];if(re){const[Ie,ze]=re;Q=[Ie[0]+8+F.width/2,Ie[1]+Math.min(24+F.height/2,(ze[1]-Ie[1])/2)]}}const ve=Ao(Q,F.width,F.height,v,he);pe[L]=ve,he.push({id:String(L),x:ve[0]-F.width/2,y:ve[1]-F.height/2,width:F.width,height:F.height})}let we=Math.max(...v.map(L=>L.x+L.width))+40,Me=Math.max(...v.map(L=>L.y+L.height))+40;s.forEach((L,W)=>{const F=p.get(W);if(F&&F.leader!==W)return;const me=F?s.flatMap((re,Ie)=>p.get(Ie)?.leader===W?re:[]):L,Q=me[0],Ae=ne[W],Le=i("path",{d:Ae.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":me.map(re=>re.id).join(" ")});(F||Q.path==="exception")&&Le.setAttribute("stroke-dasharray","6 5");const ve=i("title");ve.textContent=me.map(re=>`${re.id} ${re.activity} / ${re.path==="normal"?"通常":"例外："+(re.exception??"例外名未定義")}：${re.condition}`).join(" / "),Le.append(ve),C.append(Le),D.push({element:Le,rows:me}),we=Math.max(we,Ae.bounds.right+40),Me=Math.max(Me,Ae.bounds.bottom+40)});for(const[L,W]of c.entries()){const F=pe[L],me=F[0]-W.width/2,Q=F[1]-W.height/2+14;C.append(i("rect",{x:String(me),y:String(Q-14),width:String(W.width),height:String(W.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const Ae=i("text",{x:String(me),y:String(Q),class:"state-diagram-edge-label","data-activity":W.activity,"data-transition-id":W.rows[0].id,"aria-label":W.lines.join("")});W.lines.forEach((Le,ve)=>{const re=i("tspan",{x:String(me),dy:ve?"18":"0","font-size":"14","font-weight":"600"});re.textContent=Le,re.setAttribute("data-transitions",W.lineRows[ve].map(Ie=>Ie.id).join(" ")),R.push({element:re,rows:W.lineRows[ve]}),Ae.append(re)}),C.append(Ae),we=Math.max(we,me+W.width+24),Me=Math.max(Me,Q+W.height+24)}for(const L of v){const W=L.id.startsWith("@"),F=i("g",{role:"button",tabindex:"0","aria-label":o[L.id]??L.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":L.id,"data-node":L.id});F.append(vr(document,L,W)),F.append(i("rect",{x:String(L.x),y:String(L.y),width:String(L.width),height:String(L.height),rx:W?"20":"8",class:W?"state-diagram-node state-note":"state-diagram-node"}));const me=i("text",{x:String(L.x+L.width/2),y:String(L.y+L.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(me.textContent=o[L.id]??L.id,F.append(me),W&&L.id!=="@new"){const Q=i("text",{x:String(L.x+L.width/2),y:String(L.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Q.textContent=L.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",F.append(Q)}F.addEventListener("click",()=>T(L.id)),F.addEventListener("keydown",Q=>{(Q.key==="Enter"||Q.key===" ")&&(Q.preventDefault(),T(L.id))}),O.set(L.id,F),C.append(F)}return T(t.selected),C.setAttribute("viewBox",`0 0 ${we} ${Me}`),C.style.minWidth=`${we}px`,C}const Vs=new WeakMap;function md(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const s=(m,f,y=o)=>{const S=document.createElement(m);return S.textContent=f,y.append(S),S};if(i.error)return s("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const r=i.model;for(const m of r.transitions){if(!e.graph.nodes.some(f=>f.id===m.activity&&f.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const f=e.model?.business.exceptions?.find(y=>y.id===m.exceptionId);if(!f||f.activityId!==m.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=Vs.get(e)??new Map;Vs.set(e,d);const a=d.get(t)??Xo();d.set(t,a);const l={...r,transitions:r.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(f=>f.id===m.activity)?.name??m.activity}))};o.append(yr(document,m=>pd(l,m),a));const c=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,h={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},u=document.createElement("details");s("summary",`操作の詳細（${r.transitions.length}）`,u);const p=document.createElement("ol");u.append(p),o.append(u);for(const m of r.transitions){const f=document.createElement("li");f.dataset.transition=m.id,s("h3",`${m.id} · ${c(m.from)} → ${c(m.to)}`,f),m.path==="exception"&&s("p","例外名："+(m.exception??"未定義"),f),s("p",`${h[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,f);const y=e.graph.nodes.find(S=>S.id===m.activity&&S.type==="business");if(y){const S=document.createElement("button");S.type="button",S.textContent=y.name,S.onclick=()=>n(y.id),f.append(S)}else s("p","要確認：根拠Activityが見つかりません — "+m.activity,f);s("p","条件："+m.condition,f),s("p",m.note,f),s("p","根拠："+m.evidence,f),p.append(f)}r.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",r.source,g),o.append(g),o}const Bs=64,hd=96,bd=260,Gs=40,gd=4;function yd(e,t,n=!0){const{nodes:i,previous:o,children:s,parents:r,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}=$a(e,t),c=r.map(I=>I.length),h=i.map(()=>0),u=i.flatMap((I,O)=>c[O]===0?[O]:[]);for(let I=0;I<u.length;I++)for(const O of s[u[I]])h[O]=Math.max(h[O],h[u[I]]+1),--c[O]===0&&u.push(O);const p=Array.from({length:h.reduce((I,O)=>Math.max(I,O),0)+1},()=>[]);i.forEach((I,O)=>p[h[O]].push(O));const g=i.map(()=>0),m=I=>I.forEach((O,D)=>g[O]=D);p.forEach(m);for(let I=0;I<gd;I++){const O=I%2?[...p].reverse():p;for(const D of O){const R=new Map(D.map(x=>{const T=I%2?s[x]:r[x];return[x,T.length?T.reduce((N,M)=>N+g[M],0)/T.length:g[x]]}));D.sort((x,T)=>R.get(x)-R.get(T)||x-T),m(D)}}const f=p[0].filter(I=>i[I].type==="object"&&o[I].length===0&&s[I].length>0);if(n&&f.length>1){const I=new Set(f),O=p[0].filter(D=>!I.has(D));p.splice(0,1,...f.map((D,R)=>R===0?[...O,D]:[D]))}const y=Object.create(null),S=i.map(()=>0),v=[],C=Math.ceil(bd/Bs)-1;for(let I=0;I<p.length;I++){const O=new Map;for(const x of v)for(const T of x)O.set(T,T+1);const D=x=>{let T=x;for(;O.has(T);)T=O.get(T);let N=x;for(;O.has(N);){const M=O.get(N);O.set(N,T),N=M}return T},R=[];for(const x of p[I]){let T=I;for(const M of r[x])T=Math.max(T,S[M]+1);const N=D(T);S[x]=N,O.set(N,N+1),R.push(N),y[i[x].id]=[Gs+I*Bs,Gs+N*hd]}v.push(R),v.length>C&&v.shift()}return{positions:y,forwardRelations:d,feedbackRelations:a,exceptionRelations:l}}function vd(e,t){return Sr(e)?Qo(e,t).positions:yd(e,t).positions}const Hs=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function Rr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>Hs(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const s=Hs(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(s)return s}return 0})}}function Nr(e){const t=Rr(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([s,r])=>[i.get(s),r])))}}function Tr(e){const t=Nr(e);return t.restore(vd(t.graph,t.order))}function wd(e){const t=Nr(e),n=Qo(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function Pr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function kd(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(r=>r.handle!==void 0):s.tabs.some(r=>r.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(s,r){if(Object.is(s,r))return!0;if(!s||!r||typeof s!="object"||typeof r!="object"||i.has(s)||i.has(r))return!1;const d=p=>Array.isArray(p)||Object.getPrototypeOf(p)===null||Object.getPrototypeOf(p)?.constructor?.name==="Object";if(!d(s)||!d(r)||Array.isArray(s)!==Array.isArray(r)||Array.isArray(s)&&s.length!==r.length)return!1;i.add(s),i.add(r);const a=s,l=r,c=Object.keys(a),h=Object.keys(l),u=c.length===h.length&&c.every(p=>Object.hasOwn(l,p)&&o(a[p],l[p]));return i.delete(s),i.delete(r),u}return o(e,t)}function Bn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),i=Object.create(null);for(const[s,r]of Object.entries(e.positions))n.has(s)&&(i[s]=[...r]);const o=t.graph.nodes.filter(s=>!i[s.id]);if(o.length){const s=Tr(t),r=Object.values(i);for(const d of o){const a=[...s[d.id]];for(;r.some(l=>Math.abs(l[0]-a[0])<280&&Math.abs(l[1]-a[1])<88);)a[1]+=180;i[d.id]=a,r.push(a)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function qr(){return new Promise((e,t)=>{const n=indexedDB.open(Pr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class is extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Ri;function $r(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Id(e){const t=Ri;if(t===void 0)throw Error("Session has not been loaded");const n=await qr();try{await new Promise((i,o)=>{const s=n.transaction("session","readwrite"),r=s.objectStore("session"),d=r.get("generation"),a=r.get("current"),l=r.get("readonly-legacy");let c,h;l.onsuccess=()=>{try{const u=$r(d.result);if(kd(a.result,e)){h=u;return}if(u!==t)throw new is;if(h=t+1,!Number.isSafeInteger(h))throw Error("Session generation exhausted");l.result===void 0&&xd(a.result)&&r.put(a.result,"readonly-legacy"),r.put(e,"current"),r.put(h,"generation")}catch(u){c=u,s.abort()}},s.oncomplete=()=>{Ri=h,i()},s.onerror=()=>o(c??s.error??Error("Session save failed")),s.onabort=()=>o(c??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Sd(){Ri=void 0;const e=await qr();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),s=o.get("current"),r=o.get("generation");i.oncomplete=()=>{try{Ri=$r(r.result),t(s.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function xd(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Js=new WeakMap;function Ad(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(c=>c.id===t&&c.type==="business"))throw Error("Unknown Activity: "+t);let i=Js.get(e);i||(i=new Map,Js.set(e,i));const o=i.get(t);if(o)return o;const s=new Set(e.graph.nodes.filter(c=>c.type==="object").map(c=>c.id)),r=new Set(e.graph.nodes.filter(c=>c.type==="business").map(c=>c.id)),d=e.graph.relations.filter(c=>c.kind==="input"&&c.to===t&&s.has(c.from)||c.kind==="output"&&c.from===t&&s.has(c.to)||c.kind==="business-exception"&&(c.from===t&&r.has(c.to)||c.to===t&&r.has(c.from))),a=new Set([t,...d.flatMap(c=>[c.from,c.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(c=>a.has(c.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(c=>c.type==="business").map(c=>c.id)).filter(c=>a.has(c))};return i.set(t,l),l}const _s=new WeakMap;function Ed(e,t){if(!e.graph.nodes.find(h=>h.id===t&&h.type==="object"))throw Error("Unknown Object: "+t);let i=_s.get(e);i||(i=new Map,_s.set(e,i));const o=t,s=i.get(o);if(s)return s;const r=new Set(e.graph.nodes.filter(h=>h.type==="object").map(h=>h.id)),d=new Set(e.graph.nodes.filter(h=>h.type==="business").map(h=>h.id)),a=e.graph.relations.filter(h=>h.kind==="input"&&h.from===t&&d.has(h.to)||h.kind==="output"&&h.to===t&&d.has(h.from)||h.kind==="object-exception"&&(h.from===t&&r.has(h.to)||h.to===t&&r.has(h.from))),l=new Set([t,...a.flatMap(h=>[h.from,h.to])]),c={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(h=>l.has(h.id)),relations:a},activityOrder:(e.activityOrder??e.graph.nodes.filter(h=>h.type==="business").map(h=>h.id)).filter(h=>l.has(h))};return i.set(o,c),c}const Wr=new WeakMap;function Xt(e){return Wr.get(e)}const zr=["design","checks","source","draft","edited","handle"];function Od(e){return{key:e.key,name:e.name,...Object.fromEntries(zr.map(t=>[t,e[t]]))}}function qt(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:r,viewInset:d,canvasOrigin:a,scroll:l,zoom:c}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:r,viewInset:d,canvasOrigin:a,scroll:l,zoom:c,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Fi(e,t){const n=t;Wr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of zr)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Ni(e){return e.activity}function Ti(e){return e.object}function ii(e){return e.activity??e.object}function Vi(e){return e.object===void 0?Ad(e.design,e.activity):Ed(e.design,e.object)}function Bi(e){const t=Vi(e),n=Bn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function fn(e,t=[],n,i){const o=n??(e.tabs[0]?Od(e.tabs[0]):void 0),s=o?(i??[e.tabs[0]?qt(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(u=>{const p=Fi(o,u);return Object.assign(u,qt(Bi(p))),p}):[],{dark:r,drawer:d,width:a,preferWrite:l,nodeDrawer:c,sampleLayout:h}=e;return{dark:r,drawer:d,width:a,preferWrite:l,nodeDrawer:c,sampleLayout:h,document:o,tabs:s,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(u=>u.source?.kind==="url").map(u=>({url:u.source.url,name:u.name}))].filter((u,p,g)=>g.findIndex(m=>m.url===u.url)===p),legacyViews:e.legacyViews,active:s.some(u=>u.key===e.active)?e.active:s[0]?.key}}function os(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(qt),recovery:n}}function Ii(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function jd(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!Nd(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const c of o.views)Ii(c)}const{format:s,views:r,document:d,recovery:a,...l}=e;for(const c of r)Ii(c);for(const c of a)Ii(c);if(!!d!=!!r.length||new Set(r.map(c=>c.key)).size!==r.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(u=>u.group!==void 0&&typeof u.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(u=>u.group===void 0).length!==1))throw Error("Invalid legacy views");const c=i.views[0],h=c?{...c}:void 0;return h&&delete h.group,fn({...l,tabs:[],active:h?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},a,d,h?[h]:[])}if(r.length&&(r[0].activity!==void 0||r[0].object!==void 0||r.filter(c=>c.activity===void 0&&c.object===void 0).length!==1)||new Set(r.filter(c=>c.activity!==void 0).map(c=>c.activity)).size!==r.filter(c=>c.activity!==void 0).length||new Set(r.filter(c=>c.object!==void 0).map(c=>c.object)).size!==r.filter(c=>c.object!==void 0).length)throw Error("Invalid workspace views");if(d&&r.some(c=>c.activity!==void 0&&!d.design.graph.nodes.some(h=>h.type==="business"&&h.id===c.activity)))throw Error("Unknown saved Activity");if(d&&r.some(c=>c.object!==void 0&&!d.design.graph.nodes.some(h=>h.type==="object"&&h.id===c.object)))throw Error("Unknown saved Object");return fn({...l,tabs:[]},a,d,r)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)Ii(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return fn({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Cd(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return fn({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function Md(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),r=new Set(t.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),d=e.tabs.filter(a=>(a.activity===void 0||s.has(a.activity))&&(a.object===void 0||r.has(a.object))).map(qt);return fn(e,e.recovery,o,d)}function Dd(e,t){const n=e.tabs.find(o=>Ni(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=Fi(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,qt(Bi(i))),e.tabs.push(i),e.active=i.key,i}function Ld(e,t){const n=e.tabs.find(o=>Ti(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=Fi(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,qt(Bi(i))),e.tabs.push(i),e.active=i.key,i}function Rd(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(s=>s.key===i.key);return qt(o?Bi(Fi(e.document,{...qt(i),...qt(o)})):i)});return fn({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Nd(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Gi(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const s=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},r=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const a=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=a.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?r():s(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),r(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const a=d,l=o(),c=l.indexOf(document.activeElement);let h;a.key==="ArrowDown"&&(h=(c+1)%l.length),a.key==="ArrowUp"&&(h=(c+l.length-1)%l.length),a.key==="Home"&&(h=0),a.key==="End"&&(h=l.length-1),h!==void 0&&(a.preventDefault(),l[h]?.focus())}),t.addEventListener("click",d=>{const a=d.target.closest("button,a[href]");!t.hidden&&a&&!i(a)&&s(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const Td=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Pd={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function qd(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),s=v=>o.slice(v.line+1,i.find(C=>C.line>v.line&&C.level<=v.level)?.line??o.length).join(`
`).trim(),r=new Map(i.filter(v=>v.level===3&&t.some(C=>C.title===v.title)).map(v=>[v.title,v])),d=v=>{const C=t.find(I=>I.title===v.title);return C?"legacy-check:"+C.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},a=new Map,l=(v,C)=>{a.has(v)?a.get(v)!==C&&a.set(v,void 0):a.set(v,C)};for(const v of i){const C=d(v);l(Td(v.title),C);const I=t.find(O=>O.title===v.title);I&&l(I.id.toLowerCase(),C)}for(const[v,C]of o.entries()){const I=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(C);if(I){const O=i.find(D=>D.line>v);O&&l(I[1].toLowerCase(),d(O))}}const c=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const C=[];let I=0;for(const O of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){O.index>I&&C.push({kind:"markdown",value:v.slice(I,O.index)});let D=O[2].slice(1);try{D=decodeURIComponent(D)}catch{}const R=O[2].startsWith("#")?a.get(D.toLowerCase()):void 0;C.push(R?{kind:"reference",targetId:R,label:O[1]}:{kind:"link",uri:O[2],label:O[1]}),I=O.index+O[0].length}return I<v.length&&C.push({kind:"markdown",value:v.slice(I)}),C},h=[],u=[],p=[],g=new Map;for(const v of i.filter(C=>C.level===2)){if(v.title==="業務一覧")continue;const C=d(v),I=i.find(O=>O.line>v.line)?.line??o.length;h.push({id:C,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:c(o.slice(v.line+1,I).join(`
`).trim())}),g.set(v.title,C)}const m="legacy-unassigned",f=v=>{const C=i.filter(I=>I.line<v.line&&I.level===2).at(-1);return C?g.get(C.title):void 0},y=t.map(v=>{const C=r.get(v.title),I=f(C)??m,O=Object.create(null),D=[];let R={name:"補足",value:""},x="";for(const N of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const M=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(N);M&&(x?M[1][0]===x[0]&&M[1].length>=x.length&&!M[2].trim()&&(x=""):x=M[1]);const G=x?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(N);G?(R.value.trim()&&D.push(R),R={name:G[1],value:G[2]}):R.value+=`
`+N}R.value.trim()&&D.push(R);let T="";for(const N of D)if(N.name==="人間レビュー状態"){T=N.value.split(`
`)[0].trim();const M=N.value.split(`
`).slice(1).join(`
`).trim();M&&(O.補足=[...O.補足??[],...c(M)])}else{const M=Pd[N.name]??N.name;O[M]=[...O[M]??[],...c(N.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:T,sectionId:I,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(N=>N[1]).join(`
`),fields:O}});y.some(v=>v.sectionId===m)&&h.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const v of i.filter(C=>C.level===3&&!r.has(C.title))){const C=f(v);C?u.push({id:d(v),sectionId:C,title:v.title,blocks:[{kind:"prose",content:c(s(v))}]}):p.push({id:d(v),title:v.title,content:c(s(v))})}const S=i.find(v=>v.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:c(o.slice(/^# /.test(o[0])?1:0,S).join(`
`)),sections:h,items:y,index:Object.entries(n).map(([v,C])=>{const I=o.find(O=>O.startsWith("|")&&O.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:I[1]?.trim()??"",connections:I[2]?.trim()??"",checkIds:C.map(O=>"legacy-check:"+O)}}),guarantees:u,examples:[],notes:p}}function yo(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...s]=n;if(!i||!o)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[r,...d]=s;return!r||!d.length||!["main","master"].includes(r)&&!/^[a-f0-9]{40}$/i.test(r)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:r}}catch{return}}function No(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function $d(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((h,u)=>{const p=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(h);if(p){o?p[1][0]===o[0]&&p[1].length>=o.length&&!p[2].trim()&&(o=""):o=p[1];return}if(!o){t.add(u);const g=/^(#{1,6}) (.+)$/.exec(h);g&&i.push({line:u,level:g[1].length,title:g[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const s=i.filter(h=>h.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(h.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const r=new Set,d=s.map(h=>{const u=i.find(m=>m.line>h.line&&m.level<=3)?.line??n.length,p=h.title.split(/\s/)[0];if(r.has(p))throw Error("Check IDが重複しています: "+p);r.add(p);const g=n.slice(h.line+1,u).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(g))throw Error(p+" の"+m+"が見つかりません。");return{id:p,title:h.title,body:g,activities:[]}}),a=Object.create(null);let l=!1;for(const[h,u]of n.entries()){if(!t.has(h)||(/^## /.test(u)&&(l=/^## 業務一覧\s*$/.test(u)),!l||!/^\|/.test(u)))continue;const p=u.split("|").slice(1,-1);if(p.length!==4)continue;const g=No(p[0])[0]?.label;if(!g)continue;if(Object.hasOwn(a,g))throw Error("業務一覧のActivityが重複しています: "+g);const m=No(p[3]);if(m.some(y=>y.url.toLowerCase()!=="#"+y.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const f=m.map(y=>y.label);if(!f.length||f.some(y=>!r.has(y)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);a[g]=[...new Set(f)];for(const y of d)f.includes(y.id)&&y.activities.push(g)}if(!Object.keys(a).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const c=i.find(h=>h.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,c).join(`
`),items:d,index:a,model:qd(e,d,a,i)}}function oi(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function si(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),i=Object.keys(e.index).filter(l=>!n.has(l)),o=Object.keys(e.index).filter(l=>n.has(l)),s=(l,c)=>({state:l,reason:c,unknown:i});if(!o.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const r=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=No(r).map(l=>yo(l.url)).filter(l=>l!==void 0),a=t.source?.kind==="url"?yo(t.source.url):t.source?.kind==="sample"?yo("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return a&&d.length&&d.some(l=>l.document!==a.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!a||!d.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==a.ref)||!/^[a-f0-9]{40}$/i.test(a.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Ks=new WeakMap;function Wn(e){let t=Ks.get(e);return t||(t=$d(e.markdown),Ks.set(e,t)),t}const vo=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Si(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function Wd(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function zd(e){if(!e.checks)return[];const t=Wn(e.checks),n=si(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===oi(e)?[t.model]:[]}function Ud(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&Si(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let s,r=!1;if(e.checks){s=Wn(e.checks);const d=si(s,e);if(r=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===oi(e),!r&&(Si(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const a=vo("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));a.disabled=n.disabled||t.busy===!0,o.append(a)}}if(t.candidate){const d=t.candidate,a=Wn(d),l=si(a,e),c=document.createElement("section");c.className="check-candidate",c.id="check-candidate",Si(c,"一致未確認: "+d.name+" — "+l.reason),Si(c,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const h=document.createElement("details"),u=document.createElement("summary");u.textContent="原典参照・業務別インデックス・Check本文を確認",h.append(u,Wd(a.markdown)),c.append(h);const p=vo("対応を確認して表示する",()=>n.confirm(d));p.id="check-confirm",p.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const g=vo("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,c.append(p,g),o.append(c)}return o.childNodes.length&&i.append(o),i}function Fd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const c of o){const h=document.createElement("span");h.className="document-action-label",h.textContent=c.getAttribute("aria-label"),c.append(h)}let s=!1;const r=(c=!1)=>{s=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),c&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(c=>!c.hidden&&!c.disabled),a=()=>{const c=e.dataset.actionsMode,h=document.activeElement;e.dataset.actionsMode="inline";const p=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+p,m=o.some(f=>!f.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||c!==e.dataset.actionsMode)&&(r(),m&&n.contains(h)?i.focus({preventScroll:!0}):!m&&h===i&&d()[0]?.focus({preventScroll:!0}))},l=(c=!1)=>{if(i.hidden)return;s=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const h=d();(c?h.at(-1):h[0])?.focus({preventScroll:!0})};return i.onclick=()=>s?r(!0):l(),i.onkeydown=c=>{(c.key==="ArrowDown"||c.key==="ArrowUp")&&(c.preventDefault(),l(c.key==="ArrowUp"))},n.addEventListener("keydown",c=>{if(!s)return;const h=d(),u=h.indexOf(document.activeElement);let p;c.key==="ArrowDown"&&(p=(u+1)%h.length),c.key==="ArrowUp"&&(p=(u+h.length-1)%h.length),c.key==="Home"&&(p=0),c.key==="End"&&(p=h.length-1),p!==void 0&&(c.preventDefault(),h[p]?.focus())}),document.addEventListener("keydown",c=>{s&&c.key==="Escape"&&(c.preventDefault(),c.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",c=>{s&&!n.contains(c.target)&&!i.contains(c.target)&&r()}),document.addEventListener("focusin",c=>{s&&!n.contains(c.target)&&c.target!==i&&r()}),n.addEventListener("click",c=>{const h=c.target.closest("button");s&&h&&!h.disabled&&r(!0)},!0),r(),a(),window.addEventListener("resize",a),typeof ResizeObserver<"u"&&new ResizeObserver(a).observe(e),new MutationObserver(a).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(a),document.fonts?.addEventListener("loadingdone",a),{update:a,close:r}}function Vd(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),s=parseFloat(o.columnGap)||0,r=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((l,c)=>l+c.getBoundingClientRect().width,0)+s*n.length+r,a=d+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",a>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(s=>o.observe(s))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const Kn="http://www.w3.org/2000/svg",Bd="http://www.w3.org/1999/xhtml",xi=24,Xs=8192,Gd=16e6,Hd=8e6,Jd=4e3,_d=1e6,To="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Kd(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(c=>![c.x,c.y,c.width,c.height].every(Number.isFinite)||c.width<0||c.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const c of e)t=Math.min(t,c.x),n=Math.min(n,c.y),i=Math.max(i,c.x+c.width),o=Math.max(o,c.y+c.height);const s=Math.floor(t)-xi,r=Math.floor(n)-xi,d=Math.ceil(i)-s+xi,a=Math.ceil(o)-r+xi,l=Math.min(2,Xs/d,Xs/a,Math.sqrt(Gd/(d*a)));if(l<1)throw Error(To);return{bounds:{x:s,y:r,width:d,height:a},width:Math.floor(d*l),height:Math.floor(a*l),scale:l}}const Xd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function Zs(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,s)=>{const r=i[s],d=getComputedStyle(o);r.removeAttribute("style");for(const a of Xd){const l=d.getPropertyValue(a);l&&!/url\s*\(/i.test(l)&&r.style.setProperty(a,l)}for(const a of Array.from(r.attributes))(a.name.startsWith("data-")||a.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(a.name))&&r.removeAttribute(a.name)}),t}function Zd(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Jd||(e.textContent?.length??0)+(t.textContent?.length??0)>_d)throw Error(To);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const f of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+f.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+f.offsetTop,width:f.offsetWidth,height:f.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,r=Array.from(t.children).map(Zs),d=r.filter(m=>m.matches(".edge,.edge-label"));if(d.length){const m=s.createElementNS(Kn,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...d),s.body.append(m);try{for(const f of d){const y=f.getBBox();o.push({x:y.x-12,y:y.y-12,width:y.width+24,height:y.height+24})}}finally{m.remove()}}const a=Kd(o),l=s.createElementNS(Kn,"svg");l.setAttribute("width",String(a.width)),l.setAttribute("height",String(a.height)),l.setAttribute("viewBox",`0 0 ${a.bounds.width} ${a.bounds.height}`);const c=s.createElementNS(Kn,"rect");c.setAttribute("width","100%"),c.setAttribute("height","100%"),c.setAttribute("fill",n),l.append(c);const h=s.createElementNS(Kn,"g");h.setAttribute("transform",`translate(${-a.bounds.x} ${-a.bounds.y})`);for(const m of r)h.append(m);l.append(h);const u=s.createElementNS(Kn,"foreignObject");u.setAttribute("width",String(a.bounds.width)),u.setAttribute("height",String(a.bounds.height));const p=s.createElementNS(Bd,"div");p.style.cssText=`position:relative;width:${a.bounds.width}px;height:${a.bounds.height}px;`;for(const m of i){const f=Zs(m);f.querySelector(".activity-open,.object-open")?.remove(),f.style.left=parseFloat(m.style.left)-a.bounds.x+"px",f.style.top=parseFloat(m.style.top)-a.bounds.y+"px",p.append(f)}u.append(p),l.append(u);const g=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(g).length>Hd)throw Error(To);return{svg:g,...a}}function Yd(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function Ur(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,s)=>{const r=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(r),o()},n.onerror=()=>{clearTimeout(r),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,s)=>{const r=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(r),d?o(d):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(r),s(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Qd(e,t){const n=await Ur(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Yd(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function el(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=Ur(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function Fr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:tl(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function tl(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,s=2246822507;for(const r of i)o=Math.imul(o^r.codePointAt(0),16777619)>>>0,s=Math.imul(s^r.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function Vr(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return $(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function nl(e){$(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),Nn(e),Lo(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=Fr(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=Vr(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Lo(t),t}const fe=(e,t)=>{if(!e)throw new Error(t)},Zn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),wo=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Ai=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),Br=e=>Zn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function il(e){fe(wo(e),"Graph must be an object");const t=e;fe(Ai(t,["version","nodes","relations"])||Ai(t,["version","nodes","relations","scope"]),"Invalid graph fields"),fe(t.version===1,"Unsupported graph version"),"scope"in t&&fe(Zn(t.scope),"Invalid scope"),fe(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),fe(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){fe(wo(s),"Node must be an object");const r=s;fe(r.type==="business"||r.type==="object","Invalid node type");const d=r.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];r.type==="business"&&("problem"in r||"pain_level"in r)&&(d.push("problem","pain_level"),fe(["Low","Medium","High"].includes(String(r.pain_level)),"Invalid Pain level")),fe(Ai(r,d),"Invalid node fields"),fe(Object.entries(r).every(([l,c])=>l==="scope"||l==="information"||Zn(c)),"Empty node text"),fe(typeof r.scope=="boolean","Invalid node scope"),fe(Br(r.name)&&r.id===r.name,"Node ID must equal visible name"),fe(!n.has(r.id),"Duplicate node ID"),r.type==="object"&&(fe(typeof r.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.icon),"Invalid Lucide icon"),fe(Array.isArray(r.information)&&r.information.every(Zn),"Invalid information")),n.set(r.id,r.type)}fe([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const s of t.relations){fe(wo(s),"Relation must be an object");const r=s;fe(Ai(r,["kind","from","to","label"])&&Object.values(r).every(Zn),"Invalid relation fields");const d=i[r.kind];fe(Array.isArray(d)&&n.has(r.from)&&n.has(r.to)&&n.get(r.from)===d[0]&&n.get(r.to)===d[1],"Invalid relation endpoints");const a=JSON.stringify([r.kind,r.from,r.to,r.label]);fe(!o.has(a),"Duplicate relation"),o.add(a)}}function cn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Qn(e){const t=[];let n="";return cn(e).forEach((i,o)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),fe(!n,"Unclosed code fence"),t}function Po(e,t,n,i=[]){const o=cn(e),s=Qn(e),r=Object.create(null);return fe(s.length&&!o.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([d,a],l)=>{fe(t.includes(a)&&!(a in r),n+": unsupported/duplicate "+a),r[a]=o.slice(d+1,s[l+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),fe(r[a]||i.includes(a),n+": empty "+a)}),fe(s.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),r}const Ys=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function ol(e){const t=cn(e),n=Qn(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return fe(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,s],r)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);fe(d,"Invalid Finding ID");const a=d[1];fe(!i.has(a),"Duplicate Finding ID"),i.add(a);const l=Po(t.slice(o+1,n[r+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+a);fe(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),fe(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),fe(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const c=l["### Targets"]==="(none)"?[]:cn(l["### Targets"]).filter(h=>h.trim()).map(h=>(fe(h.startsWith("- ")&&Br(h.slice(2)),"Invalid Finding target"),h.slice(2)));return fe(new Set(c).size===c.length,"Duplicate Finding target"),fe(l["### Scope"]==="items"?c.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:a,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:c,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function sl(e,t){fe(!e.includes("<!--"),"HTML comments are unsupported");const n=cn(e),i=Qn(e).filter(u=>u[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;fe(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let s=[];const r={version:1,nodes:[],relations:[]},d=Object.create(null),a=new Set;i.slice(1).forEach(([u,p],g)=>{const m=i[g+2]?.[0]??n.length,f=n.slice(u+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(fe(f,"Empty section "+p),p==="# Findings"){fe(!a.has(p),"Duplicate Findings"),a.add(p),s=ol(f);return}if(["# Scope","# Graph exceptions"].includes(p)){fe(!a.has(p),"Duplicate "+p),a.add(p),p==="# Scope"?(fe(!Qn(f).length,"Scope must be prose"),r.scope=f):cn(f).filter(R=>R.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(R=>{const x=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(R);fe(x,"Invalid exception"),r.relations.push({kind:x[1],from:x[2],to:x[3],label:x[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const y=o.exec(p);fe(y,"Unsupported heading "+p);const S=y[1],v=y[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[v]=n.slice(u,m).join(`
`);const C=R=>Qn(f).some(x=>x[1]===R);if(S==="Object"){const R=["## Scope","## Icon"];C("## Information")&&R.push("## Information");const x=Po(f,R,v);fe(["true","false"].includes(x["## Scope"]),"Invalid Scope");const T=cn(x["## Information"]??"").filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(N=>(fe(/^- \S.*$/.test(N),"Invalid Information"),N.slice(2)));r.nodes.push({id:v,type:"object",name:v,scope:x["## Scope"]==="true",icon:x["## Icon"]==="(generic icon)"?"box":x["## Icon"],information:T});return}const I=["## Scope","## Why","## When"];C("## Exception When")&&I.push("## Exception When"),I.push("## Who","## Where","## How","### Input","### Procedure"),C("### Exception")&&I.push("### Exception"),I.push("### Output","## Result"),(C("## Problem")||C("## Pain level"))&&I.push("## Problem","## Pain level");const O=Po(f,I,v,["## How"]);fe(!O["## How"],"How must only contain fields"),fe(["true","false"].includes(O["## Scope"]),"Invalid Scope"),t?.activity?.(v,O);const D={id:v,type:"business",name:v,scope:O["## Scope"]==="true",why:O["## Why"],when:O["## When"],who:O["## Who"],where:O["## Where"],result:O["## Result"]};"## Problem"in O&&(D.problem=O["## Problem"],D.pain_level=O["## Pain level"]),r.nodes.push(D);for(const[R,x]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(R in O)||x!=="business-exception"&&O[R]==="(none)"||cn(O[R]).filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(T=>{const N=/^- (.+?) — (\S.*)$/.exec(T);fe(N,"Invalid relation in "+v),r.relations.push({kind:x,from:x==="output"?v:N[1],to:x==="output"?N[1]:v,label:N[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=r.nodes.filter(u=>u.type==="business").map(u=>u.id);il(r),r.nodes.sort((u,p)=>Ys(u.id,p.id)),r.relations.sort((u,p)=>{for(const g of["kind","from","to","label"]){const m=Ys(u[g],p[g]);if(m)return m}return 0});const c=new Set(r.nodes.map(u=>u.id));for(const u of s)u.unresolvedTargets=u.targets.filter(p=>!c.has(p));return{graph:r,sections:d,markdown:e,activityOrder:l,findings:s}}const rl=["id","from","activity","condition","to","effect","path","evidence","note"],He=(e,t)=>{if(!e)throw Error(t)},Ei=e=>typeof e=="string"&&!!e.trim();function al(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());He(n,"state-meta と遷移表が必要です");const i=Dr(n[1]);He(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),He(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),He(i.object===t,"対象Objectが一致しません"),He(Array.isArray(i.states)&&i.states.length>0&&i.states.every(l=>Ei(l)&&!l.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),He(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&Ei(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),s=l=>(He(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(c=>c.trim())),r=s(o[0]);He([rl,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>r.join("|")===l.join("|")),"表の列名が不正です"),He(s(o[1]).length===r.length&&s(o[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),He(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,a=o.slice(2).map(l=>{const c=s(l);He(c.length===r.length&&c.every(Ei),"表の列数・空欄が不正です");const h=Object.fromEntries(r.map((u,p)=>[u,c[p]]));return He(/^T[0-9]+$/.test(h.id)&&!d.has(h.id),"遷移IDが不正または重複しています"),d.add(h.id),He([...i.states,"@new"].includes(h.from)&&[...i.states,"@unknown","@none"].includes(h.to),"未登録の状態が参照されています"),He(["change","unchanged","no-create","constraint"].includes(h.effect)&&["normal","exception"].includes(h.path),"効果・経路の指定が不正です"),r.includes("exception")&&He(h.path==="normal"?h.exception==="-":Ei(h.exception)&&h.exception!=="-","通常は例外名なし、例外は名前が必要です"),He(h.effect!=="unchanged"||h.from===h.to,"状態不変の元と先が一致しません"),He(h.effect!=="change"||!h.to.startsWith("@")&&h.from!==h.to,"状態変更の遷移先が不正です"),He(h.effect!=="no-create"||h.from==="@new"&&h.to==="@none","不成立の元と先が不正です"),He(h.effect!=="constraint"||h.to==="@unknown","未決の制約は遷移先未決としてください"),h});return{model:{...i,transitions:a}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Qs=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function cl(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let s="";for(let r=0;r<i.length;r++){const d=i[r];if(!s&&/^# Object /.test(d)?n=d.slice(9):!s&&/^# /.test(d)&&(n=null),!s&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const a=[];let l="";for(r++;r<i.length;r++){const h=i[r];if(!l&&/^#{1,2} /.test(h)){r--;break}a.push(h),l=Qs(h,l)}const c=al(a.join(`
`),n);if(c.error)throw Error(c.error);t.push(c.model);continue}o.push(d),s=Qs(d,s)}if(new Set(t.map(r=>r.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function dl(e){const t=/^## State Transitions$/m.test(e)?cl(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,s=sl(t.markdown,{activity:(a,l)=>o.set(a,l),document:(a,l)=>{n=a,i=l}}),r={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:s.graph.scope??"",objects:s.graph.nodes.filter(a=>a.type==="object").map(a=>({id:a.id,name:a.name,scope:a.scope,icon:String(a.icon),information:a.information})),activities:(s.activityOrder??[]).map(a=>{const l=s.graph.nodes.find(h=>h.id===a),c=o.get(a);return{id:a,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:c["### Procedure"],exception:c["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:s.graph.relations.map((a,l)=>({id:"legacy-relation-"+l,kind:a.kind,fromId:a.from,toId:a.to,label:a.label})),findings:(s.findings??[]).map(a=>({...a,sourceId:a.id,targetIds:a.targets.filter(l=>s.graph.nodes.some(c=>c.id===l))}))};r.exceptions=Fr(r);const d=t.declarations.map((a,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:r.id,revision:r.revision,verification:"unverified"},objectId:a.object,states:a.states.map(c=>({id:c,name:c})),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(c=>({id:c.id,sourceId:c.id,fromId:c.from,toId:c.to,activityId:c.activity,exceptionId:Vr(r,c.activity,c.exception),event:c.event??null,condition:c.condition,effect:c.effect,path:c.path,evidence:c.evidence,note:c.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:r,checks:[],states:d,diagnostics:[]}}}const Ct={type:"string"},ce={type:"string",minLength:1,pattern:"\\S"},de={type:"string",pattern:"^[A-Za-z0-9_-]+$"},vt=e=>({anyOf:[e,{type:"null"}]}),be=e=>({type:"array",items:e}),ue=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),ll=e=>({$ref:"#/$defs/"+e}),Ln=be({anyOf:[ue({kind:{enum:["text"]},value:Ct}),ue({kind:{enum:["reference"]},targetId:de,label:Ct}),ue({kind:{enum:["link"]},uri:ce,label:Ct})]}),qo=ue({id:de,name:ce,scope:{type:"boolean"}}).properties,Gr=ue({id:de,kind:{enum:["input","output","business-exception","object-exception"]},fromId:de,toId:de,label:ce}),ul=ue({id:de,sourceId:de,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:be(de),unresolvedTargets:be(ce),summary:ce,content:ce}),$o=ue({id:de,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:ce,title:ce,preface:Ct,scope:Ct,objects:be(ue({...qo,icon:ce,information:be(ce)})),activities:be(ue({...qo,why:ce,when:ce,who:ce,where:ce,procedure:ce,exception:vt(ce),result:ce,problem:vt(ce),painLevel:vt({enum:["Low","Medium","High"]})})),relations:be(Gr),findings:be(ul)}),fl=ue({id:de,name:ce,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Hr=ue({...$o.properties,schemaVersion:{enum:["0.2"]},roles:be(fl),activities:be(ue({...$o.properties.activities.items.properties,roleId:vt(de)}))}),ss=ue({...Hr.properties,schemaVersion:{enum:["0.3"]},exceptions:be(ue({id:de,activityId:de,name:ce,description:Ct}))}),Rn=e=>({...be(e),minItems:1}),pl=ue({id:de,name:ce,description:Ct}),ml=ue({objectId:de,roleIds:be(de)}),hl=ue({id:de,text:ce,obligation:{enum:["required","optional"]},appliesWhen:vt(ce),performerObjectIds:vt(Rn(de))}),bl={anyOf:[ue({kind:{enum:["before"]},beforeId:de,afterId:de}),ue({kind:{enum:["interchangeable"]},stepIds:{...be(de),minItems:2}})]},gl=Object.fromEntries(Object.entries(ss.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),yl=ue({...ss.properties,schemaVersion:{enum:["0.4"]},objects:be(ue({...qo,icon:ce,information:be(pl)})),activities:Rn(ue({...gl,performers:vt(Rn(ml)),procedure:ue({steps:Rn(hl),orderRules:be(bl)}),results:Rn(ue({id:de,text:ce}))})),data:be(ue({id:de,name:ce,items:Rn(ue({informationId:de,condition:vt(ce)}))})),relations:be({anyOf:[ue({id:de,kind:{enum:["input","output"]},fromId:de,toId:de,dataId:de}),ue({...Gr.properties,kind:{enum:["business-exception","object-exception"]}})]})}),vl=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Ln])),wl=ue({id:de,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:ce,title:ce,basedOn:ue({documentId:de,revision:ce,verification:{enum:["unverified"]}}),intro:Ln,index:be(ue({activityId:de,purpose:Ct,connections:Ct,checkIds:be(de)})),sections:be(ue({id:de,activityId:vt(de),title:ce,preamble:Ln})),guarantees:be(ue({id:de,sectionId:de,title:ce,blocks:be({anyOf:[ue({kind:{enum:["prose"]},content:Ln}),ue({kind:{enum:["example"]},exampleId:de})]})})),examples:be(ue({id:de,guaranteeId:de,columns:be(ce),rows:be(be(Ln))})),items:be(ue({id:de,checkId:de,title:ce,detailSummary:Ct,sectionId:de,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:ue(vl,[])})),notes:be(ue({id:de,title:ce,content:Ln}))}),rs=ue({id:de,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:ce,title:ce,basedOn:ue({documentId:de,revision:ce,verification:{enum:["unverified"]}}),objectId:de,states:be(ue({id:de,name:ce})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:ce,transitions:be(ue({id:de,sourceId:ce,fromId:ce,activityId:de,event:vt(ce),exception:vt(ce),condition:ce,toId:ce,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:ce,note:ce}))}),er=Object.fromEntries(Object.entries({...rs.properties.transitions.items.properties,exceptionId:vt(de)}).filter(([e])=>e!=="exception")),kl=ue({...rs.properties,schemaVersion:{enum:["0.2"]},transitions:be(ue({...er,conditionLabel:ce},Object.keys(er)))}),Xn=(e,t)=>ue({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:ce,documents:be({anyOf:t.map(ll)}),sources:be(ue({documentId:de,revision:ce,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Ct})),externalDocuments:be(ue({id:de,kind:{enum:["businessDesign"]},revision:ce,activities:be(ue({id:de,name:ce}))})),diagnostics:be(ce)}),tr={anyOf:[Xn("0.1",["businessDesign","checkItems"]),Xn("0.2",["businessDesign","checkItems","stateTransition"]),Xn("0.3",["businessDesignRoles","checkItems","stateTransition"]),Xn("0.4",["businessDesignStructured","checkItems","stateTransitionStructured"]),Xn("0.5",["businessDesignD2","checkItems","stateTransitionStructured"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:$o,businessDesignRoles:Hr,businessDesignStructured:ss,businessDesignD2:yl,checkItems:wl,stateTransition:rs,stateTransitionStructured:kl}},Cn=(e,t)=>Z(new Set(e).size===e.length,t);function Il(e,t,n){const i=(o,s,r)=>{const d=n(o,s,e.id);return r&&Z(t.parent.get(o)===r,"Structure owner mismatch: "+o),d};Cn(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){Z(o.name===o.name.trim(),"Data name whitespace"),Cn(o.items.map(s=>s.informationId),"Duplicate Data information");for(const s of o.items)i(s.informationId,"information")}for(const o of e.activities){if(o.performers!==null){Cn(o.performers.map(u=>u.objectId),"Duplicate performer");for(const u of o.performers){i(u.objectId,"object"),Cn(u.roleIds,"Duplicate performer Role");for(const p of u.roleIds)i(p,"role")}}let s=o.performers===null;for(const u of o.procedure.steps)if(u.performerObjectIds!==null){Cn(u.performerObjectIds,"Duplicate Step performer");for(const p of u.performerObjectIds)Z(o.performers?.some(g=>g.objectId===p),"Step performer outside Activity assignment: "+p)}else o.performers?.length!==1&&(s=!0);s&&Z(e.findings.some(u=>u.status==="open"&&u.scope==="items"&&u.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id);const r=o.procedure.steps.map(u=>u.id),d=new Map(r.map(u=>[u,[]])),a=new Set,l=[];for(const u of o.procedure.orderRules)if(u.kind==="before"){i(u.beforeId,"step",o.id),i(u.afterId,"step",o.id),Z(u.beforeId!==u.afterId,"Self Step order");const p=JSON.stringify([u.beforeId,u.afterId]);Z(!a.has(p),"Duplicate Step order"),a.add(p),d.get(u.beforeId).push(u.afterId),Z(r.indexOf(u.beforeId)<r.indexOf(u.afterId),"Standard Step order contradicts before constraint")}else{Cn(u.stepIds,"Duplicate interchangeable Step");for(const p of u.stepIds)i(p,"step",o.id);l.push(u.stepIds)}const c=(u,p)=>{const g=[u],m=new Set;for(;g.length;){const f=g.pop();if(!m.has(f)){m.add(f);for(const y of d.get(f)){if(y===p)return!0;g.push(y)}}}return!1};for(const u of r)Z(!c(u,u),"Step order cycle");const h=new Set;for(const u of l){const p=JSON.stringify([...u].sort());Z(!h.has(p),"Duplicate interchangeable group"),h.add(p);for(const g of u)for(const m of u)g!==m&&Z(!c(g,m),"Interchangeable Steps conflict with before constraint")}}for(const o of e.relations)if(["input","output"].includes(o.kind)){const s=i(o.dataId,"data"),r=o.kind==="input"?o.fromId:o.toId;for(const d of s.items)i(d.informationId,"information",r)}}const Z=(e,t)=>{if(!e)throw Error(t)};function Yn(e,t=tr,n="$"){if(t.$ref)return Yn(e,tr.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{Yn(e,o,n);return}catch(s){i.push(s.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&Z(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;Z(i===t.type,"Invalid type at "+n)}if(t.minLength&&Z(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&Z(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])Z(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))Z(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),Yn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&(t.minItems!==void 0&&Z(e.length>=t.minItems,"Too few items at "+n),e.forEach((i,o)=>Yn(i,t.items,n+"["+o+"]")))}function Sl(e){const t=new Map,n=new Map,i=new Map,o=new Map,s=(r,d,a,l=d.id)=>{Z(!t.has(r.id),"Duplicate ID: "+r.id),t.set(r.id,r),n.set(r.id,d.id),i.set(r.id,a),o.set(r.id,l)};for(const r of e.documents){s(r,r,"document");for(const[d,a]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const l of r[d]??[])s(l,r,a)}for(const r of e.externalDocuments){s(r,r,"document");for(const d of r.activities)s(d,r,"activity")}for(const r of e.documents.filter(d=>d.kind==="businessDesign"&&d.schemaVersion==="0.4")){for(const d of r.objects)for(const a of d.information)s(a,r,"information",d.id);for(const d of r.activities){for(const a of d.procedure.steps)s(a,r,"step",d.id);for(const a of d.results)s(a,r,"result",d.id)}for(const d of r.data)s(d,r,"data")}return{map:t,owner:n,types:i,parent:o}}function xl(e){return Yn(e),Jr(e)}function Jr(e,{allowUnresolvedFindings:t=!1}={}){Z(e.documents.length>0,"Document required");const n=Sl(e),{map:i,owner:o,types:s}=n,r=[...e.diagnostics],d=new Set;for(const p of e.sources)if(p.uri){const g=new URL(p.uri);Z(g.protocol==="https:"&&!g.username&&!g.password,"Unsafe source URI")}const a=(p,g,m)=>(Z(i.has(p),"Dangling reference: "+p),g&&Z(s.get(p)===g,"Reference type mismatch: "+p),m&&Z(o.get(p)===m,"Cross-document mismatch: "+p),i.get(p)),l=p=>p?.some(g=>g.kind==="text"?g.value.trim().length>0:!0),c=(p,g)=>{for(const m of p)if(m.kind==="reference"&&(a(m.targetId,null,g),Z(["document","section","guarantee","example","check","note"].includes(s.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const f=new URL(m.uri);Z(f.protocol==="https:"&&!f.username&&!f.password,"Unsafe external link")}};for(const p of e.documents)if(Z(e.formatVersion!=="0.1"||p.kind!=="stateTransition","State documents require formatVersion 0.2"),p.kind==="businessDesign"){Z(p.activities.length>0,"Activity required");const g=[...p.objects,...p.activities].map(y=>y.name);Z(new Set(g).size===g.length,"Duplicate visible name"),Z(g.every(y=>y===y.trim()&&!(["0.4","0.5"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(S=>y.includes(S))),"Invalid Graph-visible name");for(const y of p.objects)Z(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(y.icon),"Invalid icon");if(["0.2","0.3","0.4"].includes(p.schemaVersion)&&(Z(new Set(p.roles.map(y=>y.name)).size===p.roles.length,"Duplicate Role name"),Z(p.roles.every(y=>y.name===y.name.trim()&&!/[\r\n]/.test(y.name)),"Invalid Role name"),p.schemaVersion!=="0.4"))for(const y of p.activities)y.roleId!==null?a(y.roleId,"role",p.id):d.add("Role未確定: "+y.id+" — "+y.who);for(const y of p.activities)Z(y.problem===null==(y.painLevel===null),"Problem/Pain pair mismatch");for(const y of p.exceptions??[])a(y.activityId,"activity",p.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},f=new Set;p.schemaVersion==="0.4"&&Il(p,n,a);for(const y of p.relations){a(y.fromId,m[y.kind][0],p.id),a(y.toId,m[y.kind][1],p.id);const S=JSON.stringify([y.kind,y.fromId,y.toId,y.dataId??y.label]);Z(!f.has(S),"Duplicate relation"),f.add(S)}Z(new Set(p.findings.map(y=>y.sourceId)).size===p.findings.length,"Duplicate Finding source ID");for(const y of p.findings){Z(y.scope==="items"?y.targetIds.length+y.unresolvedTargets.length>0:!y.targetIds.length&&!y.unresolvedTargets.length,"Finding scope mismatch"),Z(new Set(y.targetIds).size===y.targetIds.length,"Duplicate Finding target");for(const S of y.targetIds)a(S,null,p.id),Z(["object","activity"].includes(s.get(S)),"Invalid Finding target");y.unresolvedTargets.length&&(Z(t,"Unresolved Finding target: "+y.sourceId),r.push("Finding参照未決: "+y.sourceId))}}else if(p.kind==="stateTransition"){const g=a(p.basedOn.documentId,"document");Z(g.kind==="businessDesign"&&g.objects,"State source must be an in-package BD"),Z(g.revision===p.basedOn.revision,"Stale State source revision"),a(p.objectId,"object",g.id),Z(!e.documents.some(f=>f!==p&&f.kind==="stateTransition"&&f.objectId===p.objectId),"Duplicate Object state declaration"),Z(p.states.length>0&&new Set(p.states.map(f=>f.name)).size===p.states.length,"Duplicate/empty state names"),Z(p.states.every(f=>!f.name.startsWith("@")),"Reserved state name"),Z(p.transitions.length<=1e3,"State transition row budget"),Z(new Set(p.transitions.map(f=>f.sourceId)).size===p.transitions.length,"Duplicate transition source ID");const m=new Map;for(const f of p.transitions){f.fromId!=="@new"&&a(f.fromId,"state",p.id),["@unknown","@none"].includes(f.toId)||a(f.toId,"state",p.id);const y=a(f.activityId,"activity",g.id);if(e.formatVersion!=="0.5"){const S=JSON.stringify([f.fromId,f.activityId,f.condition.trim().replace(/\s+/gu," ")]);Z(!m.has(S),"Duplicate state transition condition: "+m.get(S)+" / "+f.sourceId),m.set(S,f.sourceId)}if(["0.4","0.5"].includes(e.formatVersion))if(Z(f.path!=="normal"||f.exceptionId===null,"Normal transition cannot reference an exception"),f.exceptionId!==null){const S=a(f.exceptionId,"exception",g.id);Z(S.activityId===y.id,"Exception Activity mismatch")}else f.path==="exception"&&Z(r.includes("例外参照未決: "+f.id),"Unresolved exception requires a diagnostic");else Z(f.path!=="normal"||f.exception===null,"Normal transition cannot name an exception"),r.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+f.id);Z(f.effect!=="unchanged"||f.fromId===f.toId,"Unchanged state mismatch"),Z(f.effect!=="change"||!f.toId.startsWith("@")&&f.fromId!==f.toId,"Invalid changed state"),Z(f.effect!=="no-create"||f.fromId==="@new"&&f.toId==="@none","Invalid no-create transition"),Z(f.effect!=="constraint"||f.toId==="@unknown","Constraint must remain undecided")}r.push("状態遷移は部分定義・業務意味未確認: "+p.id)}else{const g=a(p.basedOn.documentId,"document");Z(g.kind==="businessDesign","Check source is not BD"),Z(g.revision===p.basedOn.revision,"Stale Check source revision"),r.push("Check原典の意味対応は未確認: "+p.id),Z(new Set(p.items.map(f=>f.checkId)).size===p.items.length,"Duplicate Check ID");const m=new Set;for(const f of p.index){a(f.activityId,"activity",g.id),Z(!m.has(f.activityId),"Duplicate Activity index"),m.add(f.activityId),Z(new Set(f.checkIds).size===f.checkIds.length,"Duplicate Check binding");for(const y of f.checkIds)a(y,"check",p.id)}Z(new Set(p.sections.map(f=>f.activityId??f.title)).size===p.sections.length,"Duplicate Activity section");for(const f of p.sections)f.activityId!==null&&(a(f.activityId,"activity",g.id),Z(m.has(f.activityId),"Section missing from index")),c(f.preamble,p.id);for(const f of p.guarantees){Z(f.blocks.some(y=>y.kind==="prose"&&l(y.content)),"General guarantee prose required"),a(f.sectionId,"section",p.id);for(const y of f.blocks)if(y.kind==="prose")c(y.content,p.id);else{const S=a(y.exampleId,"example",p.id);Z(S.guaranteeId===f.id,"Example owner mismatch")}}for(const f of p.examples){a(f.guaranteeId,"guarantee",p.id),Z(f.columns.length>0,"Example columns required");for(const y of f.rows){Z(y.length===f.columns.length,"Example column mismatch");for(const S of y)c(S,p.id)}}for(const f of p.items){const y=a(f.sectionId,"section",p.id);Z(y.activityId===null?!p.index.some(S=>S.checkIds.includes(f.id)):p.index.some(S=>S.activityId===y.activityId&&S.checkIds.includes(f.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),Z(l(f.fields.guarantee)||l(f.fields.condition)&&l(f.fields.expectedResult),"Check guarantee required");for(const S of Object.values(f.fields))c(S,p.id);Z(y.activityId===null||p.index.some(S=>S.checkIds.includes(f.id)),"Unbound Check")}for(const f of p.notes)c(f.content,p.id);c(p.intro,p.id)}const h=e.diagnostics.filter(p=>p.startsWith("Role未確定:"));Z(new Set(h).size===h.length,"Duplicate unresolved Role diagnostic");for(const p of h)Z(d.delete(p),"Unresolved Who requires a diagnostic matching a current unresolved Activity");Z(d.size===0,"Unresolved Who requires a diagnostic");const u=new Set;for(const p of e.sources){a(p.documentId,"document");const g=p.documentId+"@"+p.revision;Z(!u.has(g),"Duplicate source descriptor"),u.add(g)}for(const p of e.externalDocuments)Z(e.sources.some(g=>g.documentId===p.id&&g.revision===p.revision),"External source revision missing"),Z(p.activities.length>0,"External activity catalog required"),r.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+p.id);return{diagnostics:r,entities:i.size}}function Al({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const i=(e.formatVersion==="0.5"?Jr:Lr)({formatVersion:e.formatVersion==="0.5"?"0.5":"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(i.diagnostics)]};const o=e.business,s=[...o.objects,...o.activities],r=[...o.objects.map(a=>({...a,information:a.information.map(l=>typeof l=="string"?l:l.name),type:"object"})),...o.activities.map(a=>({id:a.id,type:"business",name:a.name,scope:a.scope,why:a.why,when:a.when,who:Ar(o,a),where:a.where,result:"results"in a?a.results.map(l=>l.text).join(`
`):a.result,...a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel}}))],d=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(a=>a.basedOn.documentId===o.id).map(a=>{const l=new Map(a.states.map(h=>[h.id,h.name])),c={object:s.find(h=>h.id===a.objectId).name,states:a.states.map(h=>h.name),start:a.start,terminal:a.terminal,completeness:a.completeness,source:a.source,transitions:a.transitions.map(h=>({id:h.sourceId,from:l.get(h.fromId)??h.fromId,to:l.get(h.toId)??h.toId,activity:h.activityId,...h.event?{event:h.event}:{},...h.exceptionId?{exceptionId:h.exceptionId,exception:o.exceptions?.find(u=>u.id===h.exceptionId)?.name}:{},condition:h.condition,...h.conditionLabel?{conditionLabel:h.conditionLabel}:{},effect:h.effect,path:h.path,evidence:h.evidence,note:h.note}))};return[a.objectId,{model:c}]})));return{graph:Rr({version:1,...o.scope?{scope:o.scope}:{},nodes:r,relations:o.relations.map(a=>({kind:a.kind,from:a.fromId,to:a.toId,label:Er(o,a)}))}),sections:Object.fromEntries(r.map(a=>[a.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:o.activities.map(a=>a.id),objectStateTransitions:d,findings:[...o.findings.map(a=>({...a,displayId:a.sourceId,targets:[...a.targetIds,...a.unresolvedTargets],targetNames:[...a.targetIds,...a.unresolvedTargets].map(l=>s.find(c=>c.id===l)?.name??l)})),...Ec(o)]}}const _r=8*1024*1024;function Kr(e){return/^\s*[\[{]/.test(e)}function Xr(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function nr(e,t){if(!e||!["0.4","0.5"].includes(e.formatVersion))throw Error("JSON専用経路はformatVersion 0.4または旧候補0.5が必要です（旧形式は互換入力adapter）。");Xr(e);const n=e.formatVersion==="0.5"?xl(e):Lo(e),i=e.documents.filter(s=>s.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function El(e){if(!Kr(e))return dl(e);if(new TextEncoder().encode(e).byteLength>_r)throw Error("ローカルJSONは8MiB以内にしてください。");const t=Dr(e.replace(/^\uFEFF/,""));if(Xr(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=nr(nl(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const i=n.data.business;i.schemaVersion="0.1",delete i.roles;for(const o of i.activities)"performers"in o||delete o.roleId;n.data.diagnostics=n.data.diagnostics.filter(o=>!o.startsWith("Role未確定:"))}return n}return nr(t,e)}function xn(e){return Al(El(e))}async function Ol(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>_r)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Kr(n))throw Error("JSONファイルの本文を確認してください。");return xn(n)}const jl=(e,t)=>as(e,t,!1);async function as(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,s=()=>o.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const r=setTimeout(s,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const a=d.headers.get("content-type")?.toLowerCase()??"";if(a.includes("html")||!n&&a.includes("json")||a.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const c=d.body?.getReader();if(!c)throw Error("本文を読み取れません。");let h=0,u="";const p=new TextDecoder;try{for(;;){const{done:g,value:m}=await c.read();if(g)break;if(h+=m.length,h>l){try{c.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}u+=p.decode(m,{stream:!0})}u+=p.decode()}finally{c.releaseLock()}if(n&&a.includes("json")&&!/^\s*[\[{]/.test(u))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(u))throw Error("HTMLページは読み込めません。");return u}catch(d){const a=o.signal.aborted;throw s(),a?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(r),t?.removeEventListener("abort",s)}}const Pi=Ol;async function Hi(e,t){return xn(await as(e,t))}function Cl(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return xn(e)}const Ji=e=>e==="question"?"要確認":"要修正";function Ml(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===i&&s.targets.includes(t.id)).length;o&&n.push(`${Ji(i)} ${o}`)}return n}function Dl(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Ji(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(Et(e.content)),t}function Ll(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Rl(e,t,n){const i=document.createElement("nav");i.className="drawer-findings",i.setAttribute("aria-label","関連する指摘");for(const o of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=o.id,s.textContent=`${Ji(o.kind)} · ${o.displayId??o.id}　${o.summary}`,s.onclick=()=>n({type:"finding",id:o.id}),i.append(s)}return i}function Nl(e,t,n,i,o){const s=document.createElement("section");s.className="findings-index";const r=document.createElement("label");r.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),r.append(d,document.createTextNode("解消済みも表示")),s.append(r);const a=(c,h,u)=>{const p=document.createElement("button");p.className="node-navigate finding-index-row",p.dataset.findingKey=c.type+":"+c.id;const g=document.createElement("strong");g.textContent=h;const m=document.createElement("span");return m.textContent=u,p.append(g,m),p.onclick=()=>i(c),p},l=e.graph.nodes.filter(c=>(!o||c.id===o)&&typeof c.problem=="string");if(l.length){const c=document.createElement("h3");c.textContent="困りごと",s.append(c);for(const h of l)s.append(a({type:"problem",id:h.id},`${h.name}（${String(h.pain_level)}）`,String(h.problem)))}for(const[c,h]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const u=(e.findings??[]).filter(g=>(!o||g.targets.includes(o))&&(t||g.status==="open")&&(c==="broken"?g.unresolvedTargets.length>0:g.scope===c&&!g.unresolvedTargets.length));if(!u.length)continue;const p=document.createElement("h3");p.textContent=`${h}（${u.length}件）`,s.append(p);for(const g of u)s.append(a({type:"finding",id:g.id},`${Ji(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const c=document.createElement("p");c.textContent="表示する指摘はありません。",s.append(c)}return s}function Tl(e){const t=Tr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((s,r)=>s===o[r]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...Wa(),viewInset:[40,0],canvasOrigin:void 0}}function Pl(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,s)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(s)}),n}function cs(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function ql(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{cs(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function $l(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(cs(t)),n.href}function Wl(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return cs(t)}const ds=`# Alderを使った設計業務 — Business Design

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
`,zl=`{
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
`;function Ul(e,t){const n=new Set(t.graph.nodes.map(u=>u.id)),i=new Map;for(const u of t.graph.nodes)i.set(u.name,i.has(u.name)?void 0:u.id);const o=u=>n.has(u)?u:i.get(u),s=Object.create(null);for(const[u,p]of Object.entries(e.positions)){const g=o(u);g&&(s[g]=p)}const{scroll:r,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:c,selectedEdgesOnly:h}=e;return{positions:s,scroll:r,zoom:d,viewInset:a,canvasOrigin:l,showExceptions:c,selectedEdgesOnly:h,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(u=>{const p=o(u);return p?[p]:[]}))]}}}const Fl=`# Alderのチェックリストサンプル

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
`;function Vl(e,t,n,i,o=()=>!0,s=()=>{}){const r=e.ownerDocument,d=r.defaultView;let a,l=0,c=0,h=!1,u=null,p="";const g=new Map,m=()=>{a!==void 0&&(d.clearTimeout(a),l=Math.max(0,l-(Date.now()-c)),a=void 0)},f=(v=!1)=>{if(v&&!o())return;m(),g.delete(p);const C=[...g].at(-1);if(C){S(C[1],"error",C[0]);return}const I=e.contains(r.activeElement);e.hidden=!0,t.textContent="",s(),I&&(u?.isConnected?u:i).focus({preventScroll:!0})},y=()=>{e.hidden||e.dataset.kind==="error"||h||r.hidden||e.contains(r.activeElement)||(m(),c=Date.now(),a=d.setTimeout(f,l))};e.addEventListener("pointerenter",()=>{h=!0,m()}),e.addEventListener("pointerleave",()=>{h=!1,y()}),e.addEventListener("focusin",v=>{const C=v.relatedTarget;C&&!e.contains(C)&&(u=C),m()}),e.addEventListener("focusout",()=>d.setTimeout(y,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),f(!0))}),r.addEventListener("visibilitychange",()=>r.hidden?m():y()),n.onclick=()=>f(!0);const S=(v,C,I)=>{m(),e.contains(r.activeElement)||(u=r.activeElement),p=I,e.dataset.kind=C,e.dataset.key=I,t.setAttribute("role",C==="error"?"alert":"status"),t.setAttribute("aria-live",C==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,s(),l=C==="warning"?8e3:5e3,y()};return(v,C="success",I="operation")=>{C==="error"&&v?(g.delete(I),g.set(I,v)):g.delete(I);const O=[...g].at(-1);if(O){if(!e.hidden&&t.textContent===O[1]&&p===O[0])return;S(O[1],"error",O[0]);return}if(!v){p===I&&f();return}!e.hidden&&t.textContent===v&&e.dataset.kind===C||S(v,C,I)}}const ir=zl,wt=document.querySelector("#app");wt.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Je;const k=e=>document.getElementById(e),Tn=Pr(location.pathname);Tn.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${Tn.version}`,k("preview-badge").title=`PR #${Tn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const ri=e=>Vn(e,{"stroke-width":1.8,"aria-hidden":"true"}),fi=document.createElement("div");fi.id="source-menu";fi.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';wt.append(fi);const _i=document.createElement("div");_i.id="checks-menu";_i.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';wt.append(_i);const In=document.createElement("section");In.id="check-followup";In.hidden=!0;In.setAttribute("aria-labelledby","check-followup-title");In.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(In);const Ki=document.createElement("div");Ki.id="check-followup-menu";Ki.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';wt.append(Ki);const $t=document.createElement("input");$t.type="file";$t.id="check-file";$t.accept=".md,.markdown,text/markdown,text/plain";$t.hidden=!0;wt.append($t);const Qt=document.createElement("section");Qt.id="check-url-dialog";Qt.hidden=!0;Qt.setAttribute("role","dialog");Qt.setAttribute("aria-labelledby","check-url-title");Qt.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';wt.append(Qt);const Xi=document.createElement("div");Xi.id="help-menu";Xi.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Tn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Tn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Tn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;wt.append(Xi);Gi(k("help-menu-toggle"),Xi);const ei=document.createElement("div");ei.id="url-history";fi.append(ei);function Bl(){if(ei.replaceChildren(),!j.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",ei.append(e);for(const t of j.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=oe||Pe||se,n.onclick=()=>{Gl(t.url)},ei.append(n)}}async function Gl(e){if(!(oe||Pe||se)){if(j.document?.source?.kind==="url"&&j.document.source.url===e){ye(),Je?.reopenBusinessOverview(),j.active=j.tabs[0].key,Ce(),mi();return}Pe=!0,Ce();try{const t=await Hi(e),n=Bn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await pi(n)}catch(t){t instanceof Fn||qe("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Pe=!1,Ce()}}}const Hl=Gi(k("open-menu-toggle"),fi),Jl=Gi(k("open-checks"),_i,()=>{const e=Y();k("check-open-sample").hidden=!e||!ms(e),k("check-close").disabled=!e?.checks}),Zr=Gi(k("check-followup-open"),Ki,()=>{k("check-followup-sample").hidden=!Y()||!ms(Y())});for(const[e,t]of[["open-menu-toggle",Rs],["open",Rs],["open-url",za],["open-text",Ua],["view-markdown",Fa],["open-checks",ur],["share-source",Va],["refresh",Ba],["help-menu-toggle",Ga],["drawer",Ha],["node-list-toggle",Ja],["node-list-close",fr],["display-settings-toggle",pr],["reset-layout",_a],["save-image",Ka],["copy-image",Xa],["out",br],["in",gr]])k(e).prepend(ri(t));Vd(document.querySelector("header"));const Wo=Fd(document.querySelector(".tab-strip"));let j={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Ot=!0,Jt=!1,oe=!0,zn=!1,wn=!1,Pe=!1,or=Promise.resolve(),dn,ge,jt=0,se=!1,ti=!1,Pn=0,qi=0,qn=!1,ls=!1,zo=!1,sr=!1;const Uo=new Set,_t=new Set,$i=new Set;function Yr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of $i){const i=[...j.document?[j.document]:[],...j.recovery].find(s=>s.key===n),o=t.find(s=>s.key===n&&s.draft===i?.draft);i&&o&&$i.delete(n)}}const Y=()=>j.tabs.find(e=>e.key===j.active),Sn=e=>Xt(e)?.key??e.key,Zt=e=>j.document?.key===Sn(e);let Fo="";const _l=Vl(k("status"),k("status-text"),k("status-close"),k("viewport"));function qe(e,t="success",n="operation"){if(n==="storage"){if(Fo===e)return;Fo=e}_l(e,t,n)}function us(){qe("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function fs(){qe("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ut(){oe||(jt++,Ye())}function Kl(e){e.preventDefault(),e.returnValue=!0}function Ye(){const e=jt>Pn||qi>0||!1||se||$i.size>0||zo||qn||wn,t=!oe&&e;t!==sr&&(sr=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Kl));const n=oe?"restoring":zn?"protected":wn?"conflict":qn?"error":zo||$i.size>0?"draft":qi>0||se?"saving":jt>Pn?"dirty":ls?"saved":"unchanged";wt.dataset.saveState!==n&&(wt.dataset.saveState=n),zn?us():wn?fs():qn?qe("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):qe("","success","storage"),Yi()}function ps(e){qn=!0,Fo=""}function Zi(){if(zn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(wn)throw new is}async function Xl(e){Zi();try{await Id(e)}catch(t){throw t instanceof is&&(wn=!0,clearTimeout(dn),dn=void 0,fs()),t}}function Qr(e,t){qi++,Uo.add(t),Ye();const n=or.catch(()=>{}).then(()=>Xl(e)).then(()=>{Pn=Math.max(Pn,t),ls=!0,Yr(e),Pn===jt&&(qn=!1)},i=>{throw ps(),i}).finally(()=>{qi--,Uo.delete(t),Ye()});return or=n.catch(()=>{}),n}function ke(e=180,t=!0){if(oe)return;if(t&&jt++,clearTimeout(dn),dn=void 0,zn){us(),Ye();return}if(wn){fs(),Ye();return}if(se||Uo.has(jt)||!t&&jt<=Pn&&!qn){Ye();return}const n=()=>{dn=void 0;let i;try{i=structuredClone(os(j))}catch{ps(),Ye();return}Qr(i,jt).catch(()=>Ye())};e===0?n():dn=window.setTimeout(n,e),Ye()}async function Zl(e){if(oe||ge||se||!j.tabs.includes(e))return;if(ii(e)===void 0){Je?.closeBusinessOverview();return}lt.cancel(),ye();const t=j.active===e.key,n={...j,tabs:j.tabs.filter(i=>i!==e),active:t?j.tabs[0]?.key:j.active};try{await to(()=>n,()=>{j=n}),t&&wt.dataset.workspaceArea==="business"&&Je?.businessActivated()}catch{Ye()}}function rt(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!Y(),t=e&&j.drawer,n=e&&!!j.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Jt=!1),Yi(),k("layout-lock").replaceChildren(ri(Ot?mr:hr)),k("layout-lock").setAttribute("aria-pressed",String(Ot)),k("layout-lock").title=Ot?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",oe),k("viewport").dataset.layoutLocked=String(Ot),k("prefer-write").checked=j.preferWrite===!0,k("prefer-write").disabled=oe,k("show-exceptions").checked=Y()?.showExceptions!==!1,k("show-exceptions").disabled=oe||se||!Y()||ge===Y(),k("selected-edges-only").checked=Y()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=oe||se||!Y()||ge===Y(),document.documentElement.dataset.theme=j.dark?"dark":"light",k("theme").replaceChildren(ri(j.dark?nc:ic)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(j.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",oe||!e),k("node-list-drawer").hidden=!n||at().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",oe||!e),Je?.syncChrome()}function Vo(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!Y(),t.disabled=ti||oe||!Y()||ge===Y(),t.setAttribute("aria-busy",String(ti))}}function Yi(){Vo(),document.querySelector(".toolbar").dataset.settingsOpen=String(Jt),k("display-options").hidden=!Jt,k("reset-layout").disabled=oe||Pe||se||!1||!Y()||_t.has(j.document?.key??"")||zn||wn;const e=k("display-settings-toggle"),t=Jt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Jt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=oe||se||!Y()||ge===Y()}function ea(e,t=!1){const n=Y();oe||se||!n||ge===n||e===Jt||(e&&(Un.delete(Xt(n)?.key??n.key),Qi()),lt.cancel(),Te=void 0,ye(),Jt=e,Yi(),zt(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function ta(e){const t=Y();if(!(ti||oe||!t||ge===t)){ti=!0,Vo();try{const n=Zd(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await el(n),qe("グラフ全体のPNGをコピーしました。")):await Qd(n,(Xt(t)?.name??t.name)+(ii(t)?" - "+ii(t):""))}catch(n){qe((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{ti=!1,Vo()}}}k("save-image").onclick=()=>ta(!1);k("copy-image").onclick=()=>ta(!0);k("display-settings-toggle").onclick=()=>ea(!Jt);k("reset-layout").onclick=()=>{const e=Y();if(oe||Pe||se||ge||!e||_t.has(Sn(e)))return;try{Zi()}catch{Ye();return}lt.cancel(),an.cancel(),Te=void 0,ye();const t={...e,design:Vi(e)},n=Tl(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),aa.invalidate(e),Ce(),n!==t&&ke()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Jt&&k("source-dialog").hidden&&(e.preventDefault(),ea(!1,!0))});function ye(e=!0){const t=Y();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Ut(),ke(180,!1)),i}function na(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function Bo(){Hl.close(),Jl.close(),Zr.close(),Wo.close(),na(Yl),Wo.update()}function Yl(){const e=k("tabs");e.replaceChildren(),j.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===j.active?" active":""),n.draggable=ii(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Ni(t)!==void 0&&(n.dataset.activity=Ni(t)),Ti(t)!==void 0&&(n.dataset.object=Ti(t));const i=document.createElement("button");Eo(i,"business",t.name),i.setAttribute("aria-current",String(t.key===j.active)),i.disabled=se,i.onclick=async()=>{if(se||Mt&&Mt!==t.key&&!await io())return;const s=ye()||j.active!==t.key;Je?.activateBusiness(),j.active=t.key,Ce(),Je?.businessActivated(),ke(180,s)};const o=Oo("業務設計："+t.name+"を閉じる");o.disabled=se,o.onclick=()=>Zl(t),n.append(i,o),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),se)return;const r=j.tabs.findIndex(a=>a.key===s.dataTransfer?.getData("text/plain")),d=j.tabs.indexOf(t);if(r>0&&d>0&&r!==d){const[a]=j.tabs.splice(r,1);j.tabs.splice(d,0,a),Bo(),ke()}},n.onkeydown=s=>{if(!se&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const r=j.tabs.indexOf(t),d=r+(s.key==="ArrowLeft"?-1:1);r>0&&d>0&&d<j.tabs.length&&([j.tabs[r],j.tabs[d]]=[j.tabs[d],j.tabs[r]],Bo(),ke())}},e.append(n)})}const rr=new Map,Un=new Set;function Qi(){const e=Y(),t=!!e&&e.design.sourceFormat!=="json"&&Un.has(Xt(e)?.key??e.key)&&!e.checks;t||(Zr.close(),In.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),In.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=oe||Pe||se||!1||!e||pn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=Y();e&&Un.delete(Xt(e)?.key??e.key),Qi()};let Go;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{Go=k("check-followup-open"),k(t).click(),Go=void 0};function ms(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===ds}function pn(e){const t=Xt(e)?.key??e.key;let n=rr.get(t);return n||(n={},rr.set(t,n)),n}async function hs(e,t){if(!Zt(e))throw Error("原本文書が切り替わりました。");const n=fn(j,j.recovery,{...j.document,checks:t},os(j).views);await to(()=>n,()=>{j=n,t&&Un.delete(Xt(e)?.key??e.key)})}async function ia(e,t){const n=pn(e);if(e.design.sourceFormat==="json"||n.busy||se||oe||ge===e)return;const i=oi(e);n.busy=!0,n.error=void 0,n.candidate=void 0,Yt();try{const o=await t();if(!Zt(e))return;if(i!==oi(j.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=Wn(o),r=si(s,j.tabs[0]);if(r.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+r.reason);r.state==="unverified"?n.candidate=o:(await hs(e,o),n.candidate=void 0,Je?.openRelatedChecks(Y()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,qe(n.error,"error")}finally{n.busy=!1,Yt()}}async function oa(e,t){const n=pn(e);if(n.busy||se||!Zt(e))return;const i=si(Wn(t),j.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,Yt();return}n.busy=!0,n.error=void 0;try{await hs(e,{...t,confirmedFor:oi(j.tabs[0])}),n.candidate=void 0,Je?.openRelatedChecks(Y()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,Yt()}}function Yt(){Qi();const e=Y(),t=k("detail"),n=e?pn(e):void 0,i=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=oe||se||ge===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const r=e.design.graph.nodes.find(h=>h.id===e.selected),d=Ud(e,n,{disabled:oe||se||ge===e,redraw:Yt,confirm:h=>{oa(e,h)}}),a=document.createElement("div");a.className="right-drawer-heading";const l=Ac(r?.name??"業務設計");if(r){const h=r.type==="business"?sa(String(r.who),r.id):xr(r);h.classList.add("drawer-node-icon"),l.prepend(h)}a.append(l);const c=document.createElement("button");if(c.type="button",c.id="business-drawer-close",c.setAttribute("aria-label","右ドロワーを閉じる"),c.textContent="×",c.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},a.append(c),t.append(a),d.hasChildNodes()&&t.append(d),r){const h=Rl(e.design,r.id,bs);h.hasChildNodes()&&t.append(h)}t.append(nd(e.design,r?.id)),r?.type==="business"&&Je?.appendActivityTestLinks(t,r.id),t.scrollTop=s,o&&document.getElementById(o)?.focus({preventScroll:!0})}const ar=new Map,at=()=>{const e=j.active??"";let t=ar.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},ar.set(e,t)),t};function bs(e){if(!Y())return;const t=at();t.mode="findings",t.finding=e,j.nodeDrawer=!0,innerWidth<=800&&(j.drawer=!1),rt(),yt(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),ke()}function Ql(e){const t=Y();if(!t)return;const n=at();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){bs(i[0]);return}j.nodeDrawer=!0,innerWidth<=800&&(j.drawer=!1),rt(),yt(),k("drawer-mode-findings").focus({preventScroll:!0}),ke()}function eu(e,t){const n=at().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return at().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{at().finding=void 0,yt(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),i)t.append(Dl(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,Et(String(o.problem)))}const r=i?.targets??[o.id];if(r.length){const d=document.createElement("section"),a=document.createElement("h3");a.textContent="関連項目へ移動",d.append(a);for(const l of r){const c=document.createElement("button");c.className="node-navigate finding-target-link",c.dataset.findingTarget=l;const h=e.design.graph.nodes.some(p=>p.id===l),u=e.hiddenNodes?.includes(l);c.disabled=!h||!!u,c.textContent=(e.design.graph.nodes.find(p=>p.id===l)?.name??l)+(h?u?"（非表示）":"":"（参照先なし）"),c.onclick=()=>Ci(l,!0),d.append(c)}t.append(d)}return!0}function sa(e,t){let n=0;for(const o of e)n=n*31+o.codePointAt(0)>>>0;const i=document.createElement("span");return i.className="who-badge",i.style.setProperty("--role-color",(t&&Y()?.design.model?.business.roles?es(Y().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true"),i.append(ri(wr)),i}function eo(e,t=!0){oe||!Y()||(lt.cancel(),ye(),j.nodeDrawer=e,e&&at().mode==="findings"&&innerWidth<=800&&(j.drawer=!1),rt(),e&&Y()?.selected&&Gn(Y().selected),yt(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),ke())}function Gn(e){const t=Y(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=at();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(xc(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function tu(e,t){const n=Y();if(!n||oe||se||ge===n)return;lt.cancel(),Te=void 0,ye();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],mn(),ke()}function Ci(e,t=!1){let n=Y();if(n&&!Vi(n).graph.nodes.some(h=>h.id===e)&&(ye(),Je?.reopenBusinessOverview(),j.active=j.tabs[0].key,n=Y(),Ce()),!n||n.hiddenNodes?.includes(e)||ge===n)return;t||(at().finding=void 0);const i=k("node-list").contains(document.activeElement);lt.cancel(),Te=void 0,ye(),n.selected=e,Gn(e),rt(),mn();const o=k("viewport"),s=o.getBoundingClientRect(),r=k("formattedMarkdownDrawer").getBoundingClientRect(),d=j.drawer&&r.left>s.left&&r.left<s.right?r.left:s.right,a=Math.max(1,Math.min(o.clientWidth,d-s.left-o.clientLeft)),l=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const c=n.positions[e];if(n.scroll=[(c[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-a/2,(c[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],zt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],ye(),i){const h=t?"[data-finding-target]":"[data-list-node]",u=Array.from(k("node-list").querySelectorAll(h)).find(p=>(t?p.dataset.findingTarget:p.dataset.listNode)===e);(t?u:u?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}ke()}function yt(){const e=Y(),t=at(),n=k("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const s=k("drawer-modes");s.replaceChildren();for(const g of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===g?0:-1,m.textContent=`指摘（${e?Ll(e.design):0}）`;const f=()=>{t.mode=g,yt(),k("drawer-mode-"+g).focus({preventScroll:!0})};m.onclick=f,m.onkeydown=y=>{["ArrowLeft","ArrowRight","Home","End"].includes(y.key)&&(y.preventDefault(),m.focus({preventScroll:!0}))},s.append(m)}for(const g of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const r=k("node-list-search");r.value=t.search,r.disabled=!e||oe;const d=k("node-categories");d.replaceChildren();for(const[g,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const f=document.createElement("button");f.dataset.category=g,f.id="node-category-"+g,f.setAttribute("role","tab"),f.setAttribute("aria-selected",String(t.category===g)),f.setAttribute("aria-controls","node-list"),f.tabIndex=t.category===g?0:-1,f.textContent=m,f.onclick=()=>{t.category=g,yt(),k("node-category-"+g).focus({preventScroll:!0})},f.onkeydown=y=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(y.key))return;y.preventDefault();const S=["activity","object","role"],v=S.indexOf(g);t.category=y.key==="Home"?"activity":y.key==="End"?"role":S[(v+(y.key==="ArrowRight"?1:2))%3],yt(),k("node-category-"+t.category).focus({preventScroll:!0})},d.append(f)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const a=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(g=>!g.scope)??[],c=l.filter(g=>!a.has(g.id)).length,h=k("scope-outside"),u=c===l.length?"true":c===0?"false":"mixed";h.setAttribute("aria-pressed",u),h.setAttribute("aria-label",u==="true"?"スコープ外を非表示":"スコープ外を表示"),h.replaceChildren(ri(u==="false"?oc:sc)),h.disabled=!l.length||oe||ge===e;const p=k("show-outside");if(p.checked=u==="true",p.indeterminate=u==="mixed",p.setAttribute("aria-checked",u),p.disabled=h.disabled,k("scope-count").textContent=u==="mixed"?`${c}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(eu(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(f=>f.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,yt(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,m)}n.append(Nl(e.design,t.resolved,g=>{t.resolved=g,yt(),n.querySelector("input")?.focus({preventScroll:!0})},bs,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>eo(!j.nodeDrawer);k("node-list-close").onclick=()=>eo(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),eo(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),eo(!1))});k("node-list-search").oninput=()=>{at().search=k("node-list-search").value,yt()};function ra(){const e=Y();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);tu(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=ra;k("show-outside").onchange=ra;const nu="http://www.w3.org/2000/svg",ko=e=>document.createElementNS(nu,e),aa=new Ro,cr=new WeakMap;function iu(e){if(!Sr(e.graph))return;let t=cr.get(e);return t||(t=wd(e),cr.set(e,t)),t.wires}function ou(e,t,n){Yo(k("edges"),e,t,{"data-relation":String(n)})}let ai=()=>{},Ht=[0,0],rn=[0,0];function su(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function ru(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function zt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(h=>h[0])),Math.min(0,...i.map(h=>h[1]))],s=[o[0]<0||n[0]>0?Math.min(o[0],rn[0]):0,o[1]<0||n[1]>0?Math.min(o[1],rn[1]):0],{growth:r,origin:d}=tc(n,s,e.zoom),a=r.some(Boolean);a&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+r[0],e.scroll[1]+r[1]],Ut(),ke(180,!1));const l=Math.ceil(Math.max(1400,Ht[0],(su()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(h=>h[0]+340))),c=Math.max(850,Ht[1],Math.max(Ht[1],...i.map(h=>h[1]+68))+ru()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(h=>h[1]+220));k("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(c+d[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(d[0]+t[0])*e.zoom+"px",k("nodes").style.top=(d[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=l+"px",k("nodes").style.height=c+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${c+d[1]}`),k("edges").style.width=(l+d[0])*e.zoom+"px",k("edges").style.height=(c+d[1])*e.zoom+"px",a&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function mn(){na(au)}function au(){Yi(),an.cancel(),ai=()=>{},Ht=[0,0],rn=[0,0];const e=Y();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,Yt(),yt();return}const t=Vi(e),n=t.graph.nodes,i=n.filter(c=>!e.hiddenNodes?.includes(c.id)),o=new Set(i.map(c=>c.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const s=e.selected,r=e.positions,d=Li(t.graph.relations,s);zt(e),k("edges").append(Zo());const a=Pl(t.graph.relations,j.preferWrite===!0),l=()=>{const c=n.flatMap(f=>{const y=r[f.id];return y?[{id:f.id,x:y[0],y:y[1],width:260,height:68}]:[]}),h=iu(t),u=aa.update(e,t,c,t.graph.relations,h),p=new Map;for(Ht=[0,0],rn=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(f=>[f.id,f.name]));t.graph.relations.forEach((f,y)=>{if(a.has(y))return;const S=u[y];if(!S||(Ht[0]=Math.max(Ht[0],S.bounds.right+20,S.label[0]+Math.max(30,f.label.length*12)/2+12),Ht[1]=Math.max(Ht[1],S.bounds.bottom+20,S.label[1]+22),rn[0]=Math.min(rn[0],...S.points.map(R=>R[0]-20),S.label[0]-Math.max(30,f.label.length*12)/2-12),rn[1]=Math.min(rn[1],...S.points.map(R=>R[1]-20),S.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(f)||!o.has(f.from)||!o.has(f.to)||e.showExceptions===!1&&(f.kind==="business-exception"||f.kind==="object-exception")))return;const v=ko("path");v.setAttribute("d",S.path),v.dataset.relation=String(y),v.dataset.collisions=String(S.collisions),v.dataset.rerouted=String(S.rerouted),v.dataset.fallback=String(S.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),f.kind.endsWith("exception")&&v.classList.add("exception"),d.related(f)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),d.muted(f)&&v.classList.add("muted");const C=ko("title");C.textContent=(g.get(f.from)??f.from)+" → "+(g.get(f.to)??f.to)+": "+f.label,v.append(C),k("edges").append(v),f.kind.endsWith("exception")&&ou(v,S,y);const I=Ir(f,y,h?.[y]),O=p.get(I);if(O){O.dataset.relations+=" "+y,d.related(f)&&(O.classList.add("review-related"),O.classList.remove("muted"));return}const D=ko("text");p.set(I,D),D.dataset.relations=String(y),D.setAttribute("x",String(S.label[0]-Math.max(30,f.label.length*12)/2)),D.setAttribute("y",String(S.label[1])),D.setAttribute("text-anchor","start"),D.classList.add("edge-label"),D.setAttribute("dominant-baseline","middle"),D.dataset.relation=String(y),d.related(f)&&D.classList.add("review-related"),d.muted(f)&&D.classList.add("muted"),D.textContent=f.label,k("edges").append(D)});const m=k("edges");for(const f of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(f);zt(e)};ai=l,l(),i.forEach(c=>{const h=document.createElement("div");h.setAttribute("role","group"),h.className="node "+c.type+(c.scope?"":" outside")+d.nodeClasses(c.id),h.dataset.node=c.id,c.type==="business"&&(h.dataset.activity=c.id),h.style.left=r[c.id][0]+"px",h.style.top=r[c.id][1]+"px",c.type==="business"?h.append(sa(String(c.who),c.id)):h.append(xr(c));const u=document.createElement("span");u.className="node-text";const p=document.createElement("span");p.className="review-kind",p.textContent=(c.type==="business"?"Activity":"Object")+(c.scope?" · 範囲内":" · 範囲外"),u.append(p);const g=document.createElement("span");if(g.className="node-name",g.textContent=c.name,u.append(g),c.type==="business"){const v=document.createElement("small");v.textContent=String(c.who),u.append(v)}if(h.append(u),rc(c.id,ii(e))){const v=document.createElement("button");v.type="button",v.className=c.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",c.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=C=>C.stopPropagation(),v.onpointerup=C=>C.stopPropagation(),v.onclick=C=>{C.stopPropagation(),c.type==="business"?Ho(c.id):ca(c.id),Je?.businessActivated()},h.append(v)}h.title=c.name+(c.type==="business"?" — "+String(c.who):""),h.setAttribute("aria-label",h.title+(c.id===s?"（選択中）":""));const m=Ml(e.design,c);if(m.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=m.join(" · "),v.setAttribute("aria-label",c.name+"の指摘を開く"),v.onpointerdown=C=>C.stopPropagation(),v.onpointerup=C=>C.stopPropagation(),v.onclick=C=>{C.stopPropagation(),Ql(c.id)},h.append(v),h.setAttribute("aria-label",h.getAttribute("aria-label")+" · "+m.join("、"))}let f;const y=h;y.onpointerdown=v=>{v.button!==0||ge===e||Ot||(v.stopPropagation(),y.setPointerCapture(v.pointerId),f=v.pointerId,an.begin(c.id,[v.clientX,v.clientY]))},y.onpointermove=v=>{f===void 0||v.pointerId!==void 0&&v.pointerId!==f||!h.isConnected||ge===e||an.move([v.clientX,v.clientY])},y.onpointerup=v=>{if(f===void 0||f!==v.pointerId||(f=void 0,!h.isConnected||ge===e))return;const C=an.end();y.hasPointerCapture?.(v.pointerId)&&y.releasePointerCapture(v.pointerId),C&&(C.moved||(at().finding=void 0,e.selected!==c.id&&(e.selected=c.id,Ut()),Gn(c.id)),ye(),mn(),ke(180,!1))};const S=v=>{f===void 0||f!==v.pointerId||(f=void 0,h.isConnected&&(an.cancel(),ye(),ke(180,!1)))};y.onpointercancel=S,y.onlostpointercapture=S,k("nodes").append(h)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",Yt(),yt()}function Ho(e){oe||se||ge||(ye(),Dd(j,e),Ce(),ke(),k("viewport").focus({preventScroll:!0}))}function ca(e){oe||se||ge||(ye(),Ld(j,e),Ce(),ke(),k("viewport").focus({preventScroll:!0}))}function Ce(){document.title=j.document?j.document.name+" · Alder Viewer":"Alder Viewer",lt.cancel(),Te=void 0,rt(),Bo(),mn();const e=Y();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",oe||se||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||_t.has(Sn(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",oe||Pe||se||!1||!e||_t.has(Sn(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",oe||Pe||se||!1||!e||!!(e&&pn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",oe||Pe||se);k("open-sample").setAttribute("aria-disabled",String(oe||Pe||se)),k("open-sample").tabIndex=oe||Pe||se?-1:0,k("theme").toggleAttribute("disabled",oe),li(),Qi(),Bl(),so(),Je?.syncDocument()}async function pi(e){const t=j.document,n=Cd(j,e);return t?(await to(()=>n,()=>{j=n,Un.add(Xt(j.tabs[0])?.key??j.tabs[0].key)}),!0):(ye(),j=n,Un.add(Xt(j.tabs[0])?.key??j.tabs[0].key),Ce(),ke(),!0)}async function da(e,t){if(Mt&&!await io())return;const n=await Pi(e),i=Y();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await ci(i,n,t))return;Je?.reopenBusinessOverview(),j.active=j.tabs[0].key,Ce(),ke();return}const o=Bn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await pi(o)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(oe||Pe||se))try{if(j.document?.source?.kind==="sample"&&j.document.design.markdown===ir){ye(),Je?.reopenBusinessOverview(),j.active=j.tabs[0].key,Ce(),k("viewport").focus({preventScroll:!0});return}const t=xn(ir),n=j.document?.source?.kind==="sample"&&j.document.design.markdown===ds?j.tabs[0]:void 0;n&&ye();const i=n??j.sampleLayout,o=i?Ul(i,t):{},s=Bn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await pi(s)&&k("viewport").focus({preventScroll:!0})}catch(t){qe("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(oe||Pe||se)){Pe=!0,Ce();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await da(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&qe("開けません: "+e.message,"error")}finally{Pe=!1,Ce()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(oe||Pe||se)){Pe=!0,Ce();try{for(const t of Array.from(e.files??[]))await da(t)}catch(t){qe("開けません: "+t.message,"error")}e.value="",Pe=!1,Ce()}};class Fn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function to(e,t){if(se||ge)throw Error("表示を切り替えています。完了後に再試行してください。");try{Zi()}catch(o){throw new Fn(o)}ye(),clearTimeout(dn),dn=void 0,se=!0,jt++;const n=jt;Ce(),Ye();let i=!1;try{const o=structuredClone(os(e()));await Qr(o,n);const s=j;t(),j!==s&&(j=Rd(j,s)),st==="view"&&Mt&&!j.tabs.some(r=>r.key===Mt)&&(Mt=j.tabs[0]?.key),Yr(o),i=!0}catch(o){throw ps(),new Fn(o)}finally{se=!1,Ce(),Ye(),i&&jt!==n&&ke(0,!1)}}async function ci(e,t,n=e.handle,i=!1){if(!Zt(e)||e.design!==j.document?.design)return!1;const o=Md(j,t,n,i);return await to(()=>o,()=>{j=o}),kn=void 0,so(),qe(""),!0}async function dr(e){if(!Zt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await ci(e,await Pi(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const s=()=>{o.remove(),n()};o.oncancel=s,o.onchange=async()=>{try{const r=o.files?.[0];r&&await ci(e,await Pi(r)),s()}catch(r){o.remove(),i(r)}},o.click()})}k("refresh").onclick=async()=>{const e=Y();if(oe||se||ge||!e||e.source?.kind==="text"||e.source?.kind==="sample"||_t.has(Sn(e)))return;Mt===e.key&&zi();const t=Sn(e);_t.add(t),Ce();try{if(e.source?.kind==="url"){const i=await Hi(e.source.url);await ci(e,i);return}if(!e.handle){await dr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Zt(e))return;if(n!=="granted"){qe("読取権限がありません。同じMarkdownを再選択してください。","warning"),await dr(e);return}await ci(e,await Pi(await e.handle.getFile()))}catch(n){Zt(e)&&n.name!=="AbortError"&&!(n instanceof Fn)&&qe("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{_t.delete(t),Ce()}};let st="text",Mt,Kt=!1,ln=0,Wi,Jo=null;const Wt=()=>k("source-text"),di=()=>k("source-url");function gs(){zo=!k("source-dialog").hidden&&st!=="view"&&(st==="text"?Wt().value:di().value)!=="",Ye()}di().addEventListener("input",gs);function li(){_o();const e=st==="view",t=Kt||se;Wt().disabled=t,Wt().readOnly=e,k("source-dialog").dataset.mode=st,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=se||t&&st!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",gs(),queueMicrotask(fa)}function ys(e,t){if(!(oe||Pe||se||t&&_t.has(Sn(t)))){Wi?.abort(),ln++,st=e,Mt=t?.key,Kt=!1,Jo=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${j.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Wt().value=t.design.markdown:e==="text"&&(Wt().value=no),li(),(e==="url"?di():Wt()).focus()}}let no="",Oi;function cu(){if(Jo?.isConnected&&Jo.focus({preventScroll:!0}),Oi!==void 0&&cancelAnimationFrame(Oi),st!=="view")return;const e=ln;Oi=requestAnimationFrame(()=>{if(Oi=void 0,e!==ln||!k("source-dialog").hidden)return;const t=window.visualViewport,n=wt.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function zi(){ln++,Wi?.abort(),Kt=!1,Mt=void 0,k("source-dialog").hidden=!0,li(),cu()}async function io(){return se?!1:(st==="text"&&(no=Wt().value),zi(),!0)}function la(){return io()}Wt().oninput=()=>{st==="text"&&(no=Wt().value,gs())};let Mi=!1;function ua(){return oe||Pe||Kt||se||ge?"読込が終わってから共有してください。":ql(Y())}function _o(){const e=ua(),t=k("share-source");t.hidden=!Y(),t.setAttribute("aria-disabled",String(Mi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(Mi)return;const e=ua();if(e){qe(e,"warning");return}const t=Y();if(t.source?.kind!=="url")return;const n=t.source.url,i=$l(location.href,n);Mi=!0,_o();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),qe("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{qe("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Mi=!1,_o()}};let Gt,Mn=0,lr=0,ni;function fa(){if(oe||Pe||Kt||ge||se||Gt||ni===void 0)return;const e=ni;ni=void 0,vs(e)}async function vs(e=location.hash){const t=e;if(oe)return;const n=++lr;if(!/^#source(?:=|$)/.test(t)){ni=void 0,Gt&&!se&&(Gt.abort(),Gt=void 0,Mn++,Pe=!1,Ce());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),se){ni=t;return}if(Kt||Pe&&!Gt){qe("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++Mn;Gt?.abort();try{const o=Wl(t);Zi();const s=j.tabs.find(l=>l.source?.kind==="url"&&l.source.url===o),r=s;if(r){if(Mt&&Mt!==r.key&&!await io()||i!==Mn||n!==lr)return;const l=ye()||j.active!==r.key;j.active=r.key,Ce(),ke(180,l),qe("開いている共有元のタブを選択しました。表示内容は保持しています。"),mi();return}Gt=new AbortController,Pe=!0,Ce();const d=await Hi(o,Gt.signal);if(i!==Mn)return;const a=Bn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await pi(a))return;qe("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===Mn&&!(o instanceof Fn)&&qe("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===Mn&&(Gt=void 0,Pe=!1,Ce(),fa())}}window.addEventListener("hashchange",()=>{vs().then(()=>{j.document?.key===Ko&&mi()})});function ws(e){j.drawer=!0,rt(),Yt()}async function du(e){const t=pn(e);if(!(e.design.sourceFormat==="json"||t.busy||se||oe||ge===e)){t.busy=!0;try{await hs(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,Yt()}}}let Ui;$t.onchange=()=>{const e=$t.files?.[0],t=Ui??Y();Ui=void 0,$t.value="",!(!e||!t||!Zt(t))&&(ws(),ia(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};$t.oncancel=()=>{Ui=void 0};k("check-open").onclick=()=>{Ui=Y(),$t.click()};let ks,Di=null;function Is(){Qt.hidden=!0,ks=void 0,(Di&&!Di.closest("[hidden]")?Di:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=Y();e&&(Di=Go??document.activeElement,ks=e,k("check-url").value=pn(e).url??"",Qt.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=Is;Qt.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Is())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=ks;if(!t||!Zt(t))return;const n=k("check-url").value.trim();pn(t).url=n,Is(),ws(),ia(t,async()=>({name:n,url:n,markdown:await jl(n)}))};k("check-open-sample").onclick=()=>{const e=Y();!e||!ms(e)||(ws(),oa(e,{name:"チェックリストのサンプル",markdown:Fl}))};k("check-close").onclick=()=>{const e=Y();e&&du(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=Y();e&&ys("view",e)};k("open-url").onclick=()=>ys("url");k("open-text").onclick=()=>ys("text");k("source-cancel").onclick=()=>la();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),la())};k("source-submit").onclick=async()=>{if(Kt||se||st==="view"&&ge||k("source-dialog").hidden||st==="view")return;Kt=!0,li();const e=++ln,t=st;Wi=new AbortController;try{const n=st==="url"?new URL(di().value.trim()).href:di().value.trim();if(t==="url"&&j.document?.source?.kind==="url"&&j.document.source.url===n){Je?.reopenBusinessOverview(),j.active=j.tabs[0].key,zi(),Ce(),mi();return}const i=t==="url"?await Hi(n,Wi.signal):Cl(Wt().value),o=i.markdown;if(e!==ln)return;const s=Bn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await pi(s))return;qe(""),t==="text"&&(no=o),zi()}catch(n){e===ln&&!(n instanceof Fn)&&qe("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===ln&&(Kt=!1,li())}};k("layout-lock").onclick=()=>{oe||(lt.cancel(),Te=void 0,ye(),Ot=!Ot,rt(),mn())};k("selected-edges-only").onchange=()=>{const e=Y();!e||oe||se||ge===e||(lt.cancel(),Te=void 0,ye(),e.selectedEdgesOnly=k("selected-edges-only").checked,ai(),ke())};k("show-exceptions").onchange=()=>{const e=Y();!e||oe||se||ge===e||(lt.cancel(),Te=void 0,ye(),e.showExceptions=k("show-exceptions").checked,ai(),ke())};k("prefer-write").onchange=()=>{oe||(ye(),j.preferWrite=k("prefer-write").checked,mn(),ke())};k("theme").onclick=()=>{oe||(j.dark=!j.dark,rt(),ke())};k("drawer").onclick=()=>{oe||!Y()||(ye(),j.drawer=!j.drawer,Ce(),ke())};for(const[e,t]of[["in",Ns],["out",1/Ns]])k(e).onclick=()=>{const n=Y();if(n&&ge!==n){const i=ye(),o=Za({zoom:n.zoom,scroll:n.scroll},t).zoom,s=i||o!==n.zoom;n.zoom=o,Ce(),ke(180,s)}};const xe=k("viewport");function pa(e,t){const n=Y();if(!n||se||ge===n)return;ye();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Ut();const o=Array.from(k("nodes").children).find(s=>s.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),ai()}const an=ec({read:()=>{const e=Y();return e&&!se&&e!==ge&&!Ot&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[xe.scrollLeft,xe.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>Y()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=xe.getBoundingClientRect(),t=e.left+xe.clientLeft,n=e.top+xe.clientTop,i={left:t,top:n,right:t+xe.clientWidth,bottom:n+xe.clientHeight};for(const[s,r]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=k(s),a=d.getBoundingClientRect();d.hidden||a.bottom<=n||a.top>=i.bottom||(r==="right"&&a.left>i.left&&a.left<i.right&&(i.right=a.left),r==="left"&&a.right>i.left&&a.right<i.right&&(i.left=a.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:pa,pan:e=>{const t=Y();if(!t||t===ge||Ot)return;ye();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],zt(t),xe.scrollLeft=t.scroll[0],xe.scrollTop=t.scroll[1],ye(),Ut()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),lt=Ya(xe,{nodeDrag:an,read:()=>{const e=Y();return e&&!se&&ge!==e?{key:e.key,zoom:e.zoom,locked:Ot,scroll:[xe.scrollLeft,xe.scrollTop]}:void 0},position:e=>Y()?.positions[e],change:e=>{const t=Y();if(!t||se||ge===t)return;const n=t.scroll;let i=!1;e.node&&pa(e.node.id,e.node.position),e.selected&&(at().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Gn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?mn():e.zoom!==void 0&&zt(t),e.scroll&&(xe.scrollLeft=e.scroll[0],xe.scrollTop=e.scroll[1]),ye(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ut()},finish:()=>{const e=Y();e&&zt(e),ye(),ke(180,!1)}}),Ss=()=>{lt.cancel(),Te=void 0,ye(),ke(0,!1)};window.addEventListener("blur",Ss);window.addEventListener("pagehide",Ss);document.addEventListener("visibilitychange",()=>{document.hidden&&Ss()});xe.onscroll=()=>{ye()};let Te;Qa(xe,{read:()=>{const e=Y();return e&&!oe&&!se&&e!==ge?{zoom:e.zoom,scroll:[xe.scrollLeft,xe.scrollTop]}:void 0},change:e=>{const t=Y();!t||se||t===ge||(lt.cancel(),an.cancel(),Te=void 0,t.zoom=e.zoom,t.scroll=e.scroll,zt(t),xe.scrollLeft=t.scroll[0],xe.scrollTop=t.scroll[1],ye(!1),Ut(),ke(180,!1))}});xe.onpointerdown=e=>{const t=Y(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||se||t===ge||n&&!Ot||(Te={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[xe.scrollLeft,xe.scrollTop],node:n,moved:!1},xe.setPointerCapture(e.pointerId))};xe.onpointermove=e=>{if(Te&&Te.pointer===e.pointerId&&Te.key===Y()?.key&&Y()!==ge){const t=e.clientX-Te.x,n=e.clientY-Te.y;Math.hypot(t,n)>3&&(Te.moved=!0),xe.scrollLeft=Te.scroll[0]-t,xe.scrollTop=Te.scroll[1]-n,ye()}};xe.onpointerup=e=>{if(!Te||Te.pointer!==e.pointerId)return;const t=Y(),n=Te;Te=void 0,xe.hasPointerCapture?.(e.pointerId)&&xe.releasePointerCapture(e.pointerId),t&&t!==ge&&n.key===t.key&&!n.moved&&n.node&&(at().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ut()),Gn(n.node),mn()),ye(),ke(180,!1)};xe.onpointercancel=()=>{Te=void 0};xe.addEventListener("lostpointercapture",e=>{e.target===xe&&Te?.pointer===e.pointerId&&(Te=void 0)});let oo=!1;k("resize").onpointerdown=e=>{oe||(oo=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(oo){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==j.width&&(j.width=t,Ut()),rt()}};k("resize").onpointerup=()=>{oo=!1,ke(180,!1)};k("resize").onpointercancel=()=>{oo=!1,ke(180,!1)};k("resize").onkeydown=e=>{if(!oe&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,j.width+(e.key==="ArrowLeft"?20:-20)));t!==j.width&&(j.width=t,Ut()),rt(),ke(180,!1)}};window.addEventListener("resize",()=>{rt();const e=Y();e&&zt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=Y();t&&zt(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function ji(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=xn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Wn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Hn=document.createElement("section");Hn.id="source-update-notice";Hn.className="info-bar";Hn.hidden=!0;Hn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Hn);let kn;const ma=new Set;let Io=0,Ko,So;function so(){const e=j.document;Hn.hidden=!kn||kn.key!==e?.key||kn.baseline!==e.design.markdown||ma.has(e.key),k("source-update-refresh").disabled=oe||Pe||se||!!(e&&_t.has(e.key))}k("source-update-close").onclick=()=>{kn&&ma.add(kn.key),so()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function mi(){const e=j.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(So===t)return;So=t;const n=++Io,i=e.key,o=e.source.url,s=e.design.markdown;try{const r=await as(o);if(n!==Io||j.document?.key!==i||j.document.design.markdown!==s||j.document.source?.kind!=="url"||j.document.source.url!==o)return;xn(r),kn=r.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:s}:void 0,so()}catch{}finally{n===Io&&(So=void 0)}}Je=ld(wt,{rightDrawer:{isOpen:()=>j.drawer,isReady:()=>!oe,setOpen:e=>{oe||(j.drawer=e,rt(),ke())}},capture:()=>{ye(),lt.cancel(),Te=void 0},business:()=>({key:j.document?.key,design:j.document?.design,relatedChecks:j.tabs[0]?zd(j.tabs[0]):[],viewKey:Y()?.key,views:j.tabs.map(e=>({key:e.key,name:e.name,activity:Ni(e),object:Ti(e)})),activities:j.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:j.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:j.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!j.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=j.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Ho(e),Ci(e)},openObject:e=>{ca(e),Ci(e)},openOverview:()=>{j.tabs[0]&&(ye(),Je?.reopenBusinessOverview(),j.active=j.tabs[0].key,Ce(),ke())},activateView:e=>{j.tabs.some(t=>t.key===e)&&(ye(),j.active=e,Ce(),ke())},statePanel:e=>j.document?md(j.document.design,e,t=>{Je?.activateBusiness(),Ho(t),Ci(t),Je?.businessActivated()}):void 0,closeLegacyList:()=>{j.nodeDrawer=!1,rt()},refresh:()=>{rt(),Wo.update()}});const lu=j;Ce();Ye();Sd().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])ji(l);if(t.document){const l={...t.document};ji(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)ji(l)}const n=jd(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const l of i.tabs)ji(l);if(new Set(i.tabs.map(l=>l.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(c=>typeof c=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(c=>Number.isFinite(c)&&c>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(c=>Number.isFinite(c)&&c>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(c=>Array.isArray(c)&&c.length===2&&c.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:s,scopeOutside:r,...d}=i,a=l=>({...l,hiddenNodes:l.hiddenNodes??(i.scopeOutside==="hide"?l.design.graph.nodes.filter(c=>!c.scope).map(c=>c.id):[])});j=fn({...d,tabs:i.tabs.map(a)},n.recovery,n.document,i.tabs.map(l=>{const{design:c,checks:h,source:u,draft:p,edited:g,handle:m,name:f,...y}=a(l);return y})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(j.sampleLayout={...i.sampleLayout,hiddenNodes:xn(ds).graph.nodes.filter(l=>!l.scope).map(l=>l.id)}),j.tabs.some(l=>l.key===j.active)||(j.active=j.tabs[0]?.key),Y()?.selected&&Gn(Y().selected),Ko=j.document?.key,Ce(),ls=!0}).catch(()=>{j=lu,zn=!0,us()}).finally(()=>{oe=!1,Ce(),Ye(),vs().then(()=>{j.document?.key===Ko&&mi()})});
