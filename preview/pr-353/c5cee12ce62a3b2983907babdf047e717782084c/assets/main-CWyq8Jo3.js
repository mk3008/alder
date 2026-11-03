import{L as kr,D as Ba,G as Ga,W as Ha,P as Ja,l as Hn,X as Ir,C as _a,n as Ka,S as Sr,o as xr,p as Ar,M as Er,q as Or,s as jr,t as ss,g as rs,r as Lo,d as Cr,b as Wi,u as as,U as Dr,v as Xa,w as Mr,x as Rr,y as No,z as Za,m as cs,A as Ya,B as Lr,E as Qa,j as ec,F as Vs,H as tc,T as nc,I as ic,J as oc,R as sc,K as rc,N as ac,O as cc,Q as dc,V as lc,Y as uc,Z as Fs,k as fc,i as pc,h as mc,f as hc,a as bc,_ as gc,$ as yc,a0 as Nr,a1 as vc,a2 as wc,a3 as kc,a4 as Ic,e as Sc}from"./canvas-toolbar-DBjSxaGB.js";const xc={subsystems:{full:"サブシステム",icon:Ja},business:{full:"業務設計",icon:Ha},states:{full:"状態遷移",icon:Ga},concept:{full:"データ構造",icon:Ba},tests:{full:"テスト仕様",icon:kr}};function Po(e,t,n){const i=xc[t],o=document.createElement("span"),r=document.createElement("span"),s=document.createElement("span");o.className="view-tab-label",r.className="view-tab-kind",r.setAttribute("aria-hidden","true"),r.append(Hn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),s.className="view-tab-name",s.textContent=n,o.append(r,s),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function To(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Hn(Ir,{"aria-hidden":"true","stroke-width":1.8})),t}function Ac(e){const t=Hn(e?_a:Ka,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Ec(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,r=e.scrollLeft,s=Math.max(0,Math.min(n,r+i*o));s!==r&&(e.scrollLeft=s,t.preventDefault())},{passive:!1})}function Oc(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const jc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function Bs(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=jc,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,r)=>{const s=Hn(o,{"stroke-width":1.8,"aria-hidden":"true"});r&&s.classList.add(r),t.querySelector(i)?.append(s)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Sr),n(".layout-lock",xr,"lock-closed"),n(".layout-lock",Ar,"lock-open"),n(".zoom-out",Er),n(".zoom-in",Or)}function Gs(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Cc({model:e}){const t=Object.fromEntries(e.concepts.map(c=>[c.id,{name:c.name,note:c.description,fields:c.information.map(u=>["",u.name+(u.responsibleSubsystemId&&u.responsibleSubsystemId!==c.subsystemId?"（担当："+e.subsystems.find(l=>l.id===u.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind]),i=e.reviewGroups.map(c=>({id:c.id,name:c.title,purpose:c.description,activities:c.relatedActivityIds,concepts:Object.fromEntries(c.graph.nodes.map(u=>[u.conceptId,{name:u.name,note:u.description,fields:u.fields.map(l=>["",l]),sources:u.sources,sourceActivities:u.sourceActivityIds}])),relations:c.graph.edges.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind])})),o=c=>i.find(u=>u.id===c),r=(c,u)=>{const l=Object.fromEntries(c.nodes.map(a=>[a.id,{...u[a.conceptId],name:a.name,note:a.description,sources:a.sources,conceptId:a.conceptId,subsystemId:a.subsystemId,fields:a.fields.map(h=>["",h.name])}])),f=e.subsystems.filter(a=>c.nodes.some(h=>h.subsystemId===a.id)).map(a=>({id:a.id,name:a.name})),g=c.handoffIds.map(a=>e.handoffs.find(h=>h.id===a)).map(a=>({id:a.id,from:a.fromSubsystemId,to:a.toSubsystemId,label:a.information,returning:a.flowDirection==="return"}));return{ids:c.nodes.map(a=>a.id),tables:l,edges:c.edges.map(a=>[a.fromViewId,a.toViewId,a.fromLabel,a.toLabel,a.kind]),regions:f,handoffs:g}};return{tables:t,edges:n,groups:i,findGroup:o,graph:c=>{const u=o(c);if(!u)throw Error("Unknown review group: "+c);const l=e.reviewGroups.find(a=>a.id===c),f=l.graph.subsystemViews;if(f)return r(f,u.concepts);const g=Object.keys(t).filter(a=>Object.hasOwn(u.concepts,a));return{ids:g,tables:u.concepts,edges:u.relations.filter(([a,h])=>g.includes(a)&&g.includes(h)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?r(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function rt(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function Dc(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",rt(i,"span",t),i.onclick=n,e.append(i),i}function Mc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Rc(e,t,n,i=()=>{},o=()=>{},r=[]){const s=n.contentFor(t.id);if(e.replaceChildren(),!s)return;rt(e,"p",s.description).className="review-description",rt(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const c of s.relatedActivities){const u=document.createElement("li"),l=r.find(g=>g.id===c.id&&g.name===c.name),f=Dc(u,c.name,()=>{l&&o(l.id)});f.disabled=!l,f.setAttribute("aria-label",c.name+"を業務タブで開く"),d.append(u)}e.append(d),rt(e,"h3","情報の構造");for(const c of s.structureStatements){const u=document.createElement("section");u.className="review-structure",u.dataset.structure=c.id,rt(u,"h4",c.title),rt(u,"p",c.description),e.append(u)}rt(e,"h3","できること");for(const c of s.capabilities){const u=document.createElement("section");u.className="review-capability",u.dataset.capability=c.id,rt(u,"h4",c.title),rt(u,"p",c.description);for(const l of c.samples){const f=i(c.id,l.id),g=document.createElement("button");g.className="review-sample-link",g.type="button",g.dataset.sample=l.id,g.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+l.name,f?g.onclick=f.open:(g.disabled=!0,g.title="対応するテスト仕様へのリンクがありません"),u.append(g)}e.append(u)}rt(e,"h3","できないこと（業務上のルール）");for(const c of s.limitations){const u=document.createElement("section");u.className="review-limitation",rt(u,"h4",c.title),rt(u,"p",c.description),rt(u,"h5","理由"),rt(u,"p",c.reason),e.append(u)}}function ln(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function Lc({model:e,business:t}){const n=s=>s.kind==="group"?e.subsystems.find(d=>d.id===s.id):e.handoffs.find(d=>d.id===s.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(s){const d=n(s);return d?d.activityIds.map(c=>t.activities.find(u=>u.id===c)).filter(Boolean):[]}function r(s,d){if(s.replaceChildren(),d.kind==="group"){const f=e.subsystems.find(a=>a.id===d.id);if(!f)return"";ln(s,"p",f.purpose),ln(s,"h3","扱う情報");const g=s.ownerDocument.createElement("ul");for(const a of f.information)ln(g,"li",a);return s.append(g),ln(s,"h3","まとまりの理由"),ln(s,"p",f.reason),f.name}const c=e.handoffs.find(f=>f.id===d.id);if(!c)return"";ln(s,"p",c.description),ln(s,"h3","出元と受取先");const u=e.subsystems.find(f=>f.id===c.fromSubsystemId),l=e.subsystems.find(f=>f.id===c.toSubsystemId);return ln(s,"p",`${u.name} → ${l.name}`),c.information}return{sections:i,activities:o,describe:r}}function Hs(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const r=()=>{let d=t.clientWidth||innerWidth;const c=t.querySelector("#design-explorer");return innerWidth>800&&c&&!c.hidden&&(d-=c.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},s=(d,c=!1)=>{if(o=Math.max(280,Math.min(r(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(r())),i.setAttribute("aria-valuenow",String(Math.round(o))),c)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),s(d.key==="Home"?280:d.key==="End"?r():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const c=d.clientX,u=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=l=>s(u+c-l.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),s(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>s(o));d.observe(t);const c=t.querySelector("#design-explorer");c&&d.observe(c)}window.addEventListener("resize",()=>s(o)),s(o)}const Nc=260,Pc=68,Tc="http://www.w3.org/2000/svg",qt=(e,t,n={})=>{const i=e.createElementNS(Tc,t);for(const[o,r]of Object.entries(n))i.setAttribute(o,String(r));return i};function qc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Hn(Dr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function $c(e,{model:t,business:n},i,o,r){const s=t.reviewGroups,d=t.subsystems,c=t.presentation.landscapeRelationships.map(x=>{const I=s.find(M=>M.id===x.from),A=s.find(M=>M.id===x.to);if(!I||!A||I.subsystemId!==A.subsystemId||!t.presentation.reviewBoundaries.some(M=>M.from===x.from&&M.to===x.to))throw Error("Unknown overview relationship: "+x.from+" -> "+x.to);return x}),u=t.handoffs.map(x=>{if(!["forward","return"].includes(x.flowDirection))throw Error("Unknown overview handoff direction: "+x.id);return{id:x.id,from:x.fromSubsystemId,to:x.toSubsystemId,label:x.information,returning:x.flowDirection==="return"}});if(new Set(u.map(x=>x.id)).size!==u.length)throw Error("Duplicate overview handoff");for(const x of u)if(!d.some(I=>I.id===x.from)||!d.some(I=>I.id===x.to)||x.from===x.to||!x.label.trim())throw Error("Unknown overview handoff: "+x.id);for(const x of s){if(!d.some(I=>I.id===x.subsystemId))throw Error("Unknown overview subsystem: "+x.id);if(!n.roles?.some(I=>I.id===x.reviewer.roleId))throw Error("Unknown overview reviewer: "+x.id)}const l=d.flatMap(x=>s.filter(I=>I.subsystemId===x.id)),f=new Map;let g=0;for(const[x,I]of d.entries())for(const A of l.filter(M=>M.subsystemId===I.id))f.set(A.id,[80+g*170,100+g*120+x*64]),g++;const a=ss(),h="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,p;try{const x=JSON.parse(localStorage.getItem(h)||"null"),I=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),A=!x&&I?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,M=x??A;if(M){typeof M.zoom=="number"&&Number.isFinite(M.zoom)&&(a.zoom=Math.max(.25,Math.min(2.5,M.zoom))),Array.isArray(M.scroll)&&M.scroll.length===2&&M.scroll.every(R=>typeof R=="number"&&Number.isFinite(R))&&(a.scroll=M.scroll),typeof M.locked=="boolean"&&(a.locked=M.locked);for(const[R,ee]of Object.entries(M.positions??{}))s.some(V=>V.id===R)&&Array.isArray(ee)&&ee.length===2&&ee.every(V=>typeof V=="number"&&Number.isFinite(V))&&a.positions.set(R,[ee[0],ee[1]])}const $=M?.selection,L=$?.kind==="node"?t.concepts.find(R=>R.id===$.id)?.subsystemId:$?.id,C=$?.kind==="node"?"group":$?.kind;typeof L=="string"&&(C==="model"&&s.some(R=>R.id===L)||C==="group"&&d.some(R=>R.id===L)||C==="connection"&&u.some(R=>R.id===L))&&(p={kind:C,id:L}),p?.kind==="model"&&(a.selected=p.id)}catch{}const b=()=>{try{localStorage.setItem(h,JSON.stringify({zoom:a.zoom,scroll:a.scroll,locked:a.locked,positions:Object.fromEntries(a.positions),selection:p}))}catch{}},S=x=>{if(!x&&!p)return;p=x,a.selected=x?.kind==="model"?x.id:void 0;const I=m?.querySelector(".diagram-world>svg");I&&v(I),b()},v=x=>{const I=Wi(c,a.selected),A=Wi(u,p?.kind==="group"?p.id:void 0);for(const M of s){const $=x.querySelector(`[data-node="${M.id}"]`);$?.setAttribute("class","node graph-shape state-shape"+I.nodeClasses(M.id)),$?.setAttribute("aria-pressed",String(a.selected===M.id))}for(const M of d){const $=x.querySelector(`[data-subsystem="${M.id}"]`);$?.setAttribute("class","subsystem-overview-group"+A.nodeClasses(M.id)),$?.querySelector("button")?.setAttribute("aria-pressed",String(p?.kind==="group"&&p.id===M.id))}for(const M of c){const $=x.querySelector(`[data-overview-from="${M.from}"][data-overview-to="${M.to}"]`);$?.setAttribute("class","edge"+(I.related(M)?" review-related":"")),$?.setAttribute("marker-end",`url(#overview-${I.related(M)?"related-arrow":"arrow"})`)}for(const M of u){const $=A.related(M)||p?.kind==="connection"&&p.id===M.id,L=x.querySelector(`[data-handoff-id="${M.id}"]`);L?.setAttribute("class","edge"+(M.returning?" exception":"")+($?" review-related":"")),L?.setAttribute("marker-end",`url(#overview-${$?"related-arrow":"arrow"})`),x.querySelector(`[data-handoff-label="${M.id}"]`)?.classList.toggle("review-related",!!$)}x.querySelectorAll("[data-exception-paint]").forEach(M=>M.remove());for(const M of Array.from(x.querySelectorAll("[data-handoff-id].exception")))as(x,M,{path:M.getAttribute("d")},{"data-overview-return-paint":M.getAttribute("data-handoff-id")})};return m=jr(e,x=>{const I=l.map(C=>{const R=x.positions.get(C.id)??f.get(C.id);return{id:C.id,x:R[0],y:R[1],width:Nc,height:Pc}}),A=qt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});A.append(rs("overview-"));let M=0,$=0;const L=[];for(const C of d){const R=I.filter(ge=>s.find(Ie=>Ie.id===ge.id)?.subsystemId===C.id);if(!R.length)continue;const ee=Math.min(...R.map(ge=>ge.x))-30,V=Math.min(...R.map(ge=>ge.y))-48,Z=Math.max(...R.map(ge=>ge.x+ge.width))-ee+30,ae=Math.max(...R.map(ge=>ge.y+ge.height))-V+30;L.push({id:C.id,x:ee,y:V,width:Z,height:ae});const te=qt(e,"g",{"data-subsystem":C.id,"aria-label":C.name}),ue=qt(e,"rect",{x:ee,y:V,width:Z,height:ae,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});ue.addEventListener("click",()=>S({kind:"group",id:C.id})),te.append(ue);const he=qt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:ee+8,y:V+3,width:Z-16,height:36}),ce=e.createElement("button");ce.type="button",ce.className="subsystem-overview-region-title",ce.setAttribute("aria-label",C.name+"を選択"),ce.textContent=C.name,ce.onclick=()=>S({kind:"group",id:C.id}),he.append(ce),te.append(he),A.append(te),M=Math.max(M,ee+Z+40),$=Math.max($,V+ae+40)}for(const[C,R]of u.entries()){if(!L.some(te=>te.id===R.from)||!L.some(te=>te.id===R.to))throw Error("Missing overview handoff region: "+R.id);const ee=Math.max(30,R.label.length*12),V=Lo({from:R.from,to:R.to,nodes:L,index:C,kind:"input",matrix:{returning:R.returning,captionLane:0},labelWidth:ee,labelHeight:18}),Z=qt(e,"path",{d:V.path,class:"edge"+(R.returning?" exception":""),"data-handoff-id":R.id,"data-from-subsystem":R.from,"data-to-subsystem":R.to,"data-flow-direction":R.returning?"return":"forward","marker-end":"url(#overview-arrow)"});A.append(Z);const ae=qt(e,"text",{x:V.label[0]-ee/2,y:V.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":R.id});ae.textContent=R.label,ae.addEventListener("pointerdown",te=>te.stopPropagation()),ae.addEventListener("pointerup",te=>te.stopPropagation()),ae.addEventListener("click",()=>S({kind:"connection",id:R.id})),ae.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),S({kind:"connection",id:R.id}))}),A.append(ae),M=Math.max(M,V.bounds.right+40,V.label[0]+ee/2+30),$=Math.max($,V.bounds.bottom+40,V.label[1]+30)}for(const[C,R]of c.entries()){const ee=Lo({from:R.from,to:R.to,nodes:I,index:C,kind:"input",labelWidth:0,labelHeight:0}),V=qt(e,"path",{d:ee.path,class:"edge","data-overview-from":R.from,"data-overview-to":R.to,"marker-end":"url(#overview-arrow)"});A.append(V),M=Math.max(M,ee.bounds.right+40),$=Math.max($,ee.bounds.bottom+40)}for(const C of I){const R=s.find(Ie=>Ie.id===C.id),ee=n.roles.find(Ie=>Ie.id===R.reviewer.roleId),V=qt(e,"g",{role:"button",tabindex:0,"aria-label":R.title+"を選択","aria-pressed":"false","data-node":C.id,"data-review-group":C.id,"data-subsystem-id":R.subsystemId,class:"node graph-shape state-shape"}),Z=Cr(e,C);Z.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),V.append(Z,qt(e,"rect",{x:C.x,y:C.y,width:C.width,height:C.height,rx:8,class:"state-diagram-node"}));const te=qt(e,"foreignObject",{x:C.x,y:C.y,width:C.width,height:C.height}),ue=e.createElement("div");ue.className="subsystem-overview-card";const he=qc(e,ee.color),ce=e.createElement("span");ce.className="subsystem-overview-labels",ce.title=R.title+" — "+ee.name;for(const[Ie,N,F]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",R.title],["small","subsystem-overview-role",ee.name]]){const J=e.createElement(Ie);J.className=N,J.textContent=F,ce.append(J)}const ge=e.createElement("button");ge.type="button",ge.className="subsystem-overview-open",ge.setAttribute("aria-label",R.title+"の詳細タブを開く"),ge.title="詳細タブを開く",ge.textContent="開く",ge.onpointerdown=Ie=>Ie.stopPropagation(),ge.onpointerup=Ie=>Ie.stopPropagation(),ge.onclick=Ie=>{Ie.stopPropagation(),o(R.id)},ue.append(he,ce,ge),te.append(ue),V.append(te),V.addEventListener("click",()=>S({kind:"model",id:C.id})),V.addEventListener("keydown",Ie=>{(Ie.key==="Enter"||Ie.key===" ")&&(Ie.preventDefault(),S({kind:"model",id:C.id}))}),A.append(V)}return A.setAttribute("viewBox",`0 0 ${M} ${$}`),v(A),A},a,b,()=>S(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",b),m.addEventListener("pointerup",()=>queueMicrotask(b)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",b),{root:m,selected:()=>a.selected,selection:()=>p,restore:()=>{const x=()=>{const I=m.querySelector(".diagram-viewport");I.scrollLeft=a.scroll[0],I.scrollTop=a.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(x):x()}}}function Wc(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const r=i.cells.find(s=>s.columnId===o.id);if(!r)throw Error("Missing sample cell: "+o.id);return r}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function zc({model:e,business:t}){const n=h=>{const m=t.activities.find(p=>p.id===h);if(!m)throw Error("Unknown activity: "+h);return m},i=h=>{const m=t.roles?.find(p=>p.id===h);if(!m)throw Error("Unknown role: "+h);return m.name},o=e.reviewGroups.map(h=>({id:h.id,title:h.title,description:h.description,reviewer:{role:i(h.reviewer.roleId)},relatedActivities:h.relatedActivityIds.map(m=>{const p=n(m);return{id:p.id,name:p.name}}),structureStatements:h.structureStatements,capabilities:h.capabilities.map(m=>({...m,samples:m.samples.map(Wc)})),limitations:h.limitations,meta:{questions:h.meta.questions}})),r=h=>o.find(m=>m.id===h),s=(h,m)=>r(h)?.capabilities.find(p=>p.samples.some(b=>b.id===m)),d=o.flatMap(h=>h.capabilities.flatMap(m=>m.samples.map(p=>({...p,group:h.id})))),c=["yellow","cyan","green","blue","purple","orange"];function u(h,m,p){let b=p.get(m);if(b||(b=c[p.size]??`extra-${p.size}`,p.set(m,b)),h.dataset.sampleKey=m,h.dataset.keyTone=b,h.className="data-example-key",b.startsWith("extra-")){const S=(Number(b.slice(6))*137.508%360).toFixed(2);h.style.setProperty("--sample-key-extra-light",`hsl(${S} 26% 78%)`),h.style.setProperty("--sample-key-extra-dark",`hsl(${S} 24% 25%)`)}}const l=h=>d.filter(m=>m.group===h),f=(h,m)=>l(h).find(p=>p.id===m);function g(h,m,p){const b=h.ownerDocument.createElement(m);return b.textContent=p,h.append(b),b}function a(h,m,p,b,S){const v=h.ownerDocument,D=f(m.id,p);if(!D)throw Error("Unknown data example: "+p);h.replaceChildren(),h.dataset.dataExample=p;const x=new Map;e.presentation.sampleCaption&&(g(h,"p",e.presentation.sampleCaption).className="data-example-caption");const I=r(m.id)?.capabilities??[],A=S?.capabilityId?I.filter(R=>R.id===S.capabilityId):I;if(S?.capabilityId&&!A.some(R=>R.samples.some(ee=>ee.id===p)))throw Error("Sample does not belong to capability: "+p);const M=s(m.id,p);h.dataset.capability=M.id;const $=()=>{g(h,"h2",S?.heading?.trim()||M.title),S?.renderSpecification?S.renderSpecification(h):g(h,"p",M.description).className="data-example-capability"};S?.capabilityId&&!S.hideCapability&&$();const L=v.createElement("label");L.className="data-example-picker",g(L,"span","場面");const C=v.createElement("select");C.setAttribute("aria-label","データ例の場面");for(const R of A){let ee=C;if(!S?.capabilityId){const V=v.createElement("optgroup");V.label=R.title,C.append(V),ee=V}for(const V of R.samples){if(S?.sampleIds&&!S.sampleIds.includes(V.id))continue;const Z=v.createElement("option");Z.value=V.id,Z.textContent=V.name,ee.append(Z)}}if(C.value=p,C.onchange=()=>b(C.value),L.append(C),(!S?.hideSinglePicker||C.options.length>1)&&h.append(L),!S?.capabilityId&&!S?.hideCapability&&$(),g(h,"h3",D.name).className="data-example-scene",S?.collapseScenario&&D.when){const R=v.createElement("details");R.className="data-example-context",g(R,"summary","場面の背景"),g(R,"p",D.when).className="data-example-when",h.append(R)}else g(h,"p",D.when).className="data-example-when";g(h,"p",D.meaning).className="data-example-meaning";for(const R of D.blocks){const ee=v.createElement("section");ee.className="data-example-block",ee.dataset.exampleCard=R.card,g(ee,"h3",m.concepts[R.card].name);const V=v.createElement("div");V.className="data-example-table",V.tabIndex=0,V.setAttribute("role","region"),V.setAttribute("aria-label",m.concepts[R.card].name+"のデータ表");const Z=v.createElement("table");Z.setAttribute("aria-label",m.concepts[R.card].name+"のデータ例");const ae=v.createElement("caption");ae.textContent=m.concepts[R.card].name+"に入る情報",Z.append(ae);const te=v.createElement("thead"),ue=v.createElement("tr");for(const ce of R.columns)g(ue,"th",ce).setAttribute("scope","col");te.append(ue),Z.append(te);const he=v.createElement("tbody");for(const[ce,ge]of R.rows.entries()){const Ie=v.createElement("tr");for(const[N,F]of ge.entries()){const J=g(Ie,"td",String(F)),be=R.keyIds[ce][N];be&&(u(J,be,x),J.title=R.columns[N]+"："+F)}he.append(Ie)}Z.append(he),V.append(Z),ee.append(V),R.rows.length||g(ee,"p",R.empty??"データはありません。"),h.append(ee)}D.note&&(g(h,"p",D.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:r,capabilityFor:s,examplesFor:l,findDataExample:f,renderDataExample:a}}function ds(e,t){const n=e.model?.business,i=n?.activities.find(r=>r.id===t);if(!i||"performers"in i)return;const o=typeof i.who=="object"&&i.who?.kind==="role"?i.who.roleId:"roleId"in i?i.roleId:void 0;return o?n?.roles?.find(r=>r.id===o):void 0}function Uc(e,t,n){const i=e.model?.business.activities.find(o=>o.id===t);return i&&"who"in i&&typeof i.who=="object"&&i.who&&(i.who.kind==="system"||i.who.kind==="scheduler")?i.who.kind+":"+i.who.name:ds(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Vc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function ft(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,r;const s=(d,c)=>{for(const u of c.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(u.startsWith("**")&&u.endsWith("**")){const l=document.createElement("strong");l.textContent=u.slice(2,-2),d.append(l)}else if(u.startsWith("`")&&u.endsWith("`")){const l=document.createElement("code");l.textContent=u.slice(1,-1),d.append(l)}else d.append(document.createTextNode(u))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(c&&!i){i=c[1],r=void 0;const g=document.createElement("pre");o=document.createElement("code"),g.append(o),n.append(g);continue}if(c&&c[1][0]===i[0]&&c[1].length>=i.length&&!c[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",r=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){r=void 0;continue}const u=/^(#{1,6}) (.*)$/.exec(d),l=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(l){r||(r=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(r));const g=document.createElement("li");s(g,l[1]),r.append(g);continue}r=void 0;const f=document.createElement(u?"h"+u[1].length:"p");s(f,u?u[2]:d),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}function qo(e,t,n){if(t.performers===null)return"未決";const i=n===void 0?t.performers:n===null?t.performers.length===1?t.performers:[]:t.performers.filter(o=>n.includes(o.objectId));return i.length?i.map(o=>{const r=e.objects.find(d=>d.id===o.objectId).name,s=o.roleIds.map(d=>e.roles.find(c=>c.id===d).name);return s.length?`${r}（旧Role：${s.join("・")}）`:r}).join("、"):"未決"}function ei(e,t){if("performers"in t)return"未決";if(typeof t.who=="string")return e.roles?.find(i=>"roleId"in t&&i.id===t.roleId)?.name??t.who;const n=t.who;return n?n.kind==="role"?e.roles?.find(i=>i.id===n.roleId)?.name??"未決":n.name:"未決"}function Pr(e,t){return t.dataId!==void 0?e.data?.find(n=>n.id===t.dataId)?.name??"未決":t.label??""}function Fc(e){const t=[];for(const n of e.activities){if(!("performers"in n))continue;const i=(u,l,f,g)=>t.push({id:`viewer:${u}:${n.id}`,displayId:"構造の要確認（表示のみ）",kind:l,status:"open",scope:"items",targets:[n.id],targetNames:[n.name],summary:f,content:g,unresolvedTargets:[]}),o=n.performers??[],r=new Set(o.flatMap(u=>u.roleIds)),s=[...o.length>1?["複数の担当Object"]:[],...r.size>1?["複数Role"]:[]];i("who",s.length?"correction":"question",s.length?`旧形式に${s.join("と")}があります。`:"Whoは未決です。",`旧形式の担当情報：${qo(e,n)}。旧0.5にはActivityからWhoへの直接参照がありません。このActivityの単一のWhoを、Role・システム・スケジューラーを含めて確認してください。入力や出力の相手からは決められません。`);const d=n.procedure.steps.filter(u=>u.performerObjectIds===null&&n.performers?.length!==1),c=n.procedure.steps.filter(u=>u.performerObjectIds!==null&&(u.performerObjectIds.length!==o.length||u.performerObjectIds.some(l=>!o.some(f=>f.objectId===l))));(d.length||c.length)&&i("steps",c.length?"correction":"question",c.length?"旧形式の手順の担当情報が異なります。":"旧形式の担当情報が未決の手順があります。",[d.length?`旧形式の担当情報が未決：${d.map(u=>u.text).join("、")}。`:"",c.length?`Activityと異なる旧形式の担当情報：${c.map(u=>u.text).join("、")}。責任境界が変わる場合はActivityの分割を検討してください。`:""].join(""))}return t}const xe={type:"string"},z={type:"string",minLength:1,pattern:"\\S"},P={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Re=e=>({anyOf:[e,{type:"null"}]}),G=e=>({type:"array",items:e}),U=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Bc=e=>({$ref:"#/$defs/"+e}),Tn=G({anyOf:[U({kind:{enum:["text"]},value:xe}),U({kind:{enum:["reference"]},targetId:P,label:xe}),U({kind:{enum:["link"]},uri:z,label:xe})]}),zi=U({id:P,name:z,scope:{type:"boolean"}}).properties,ls=U({id:P,kind:{enum:["input","output","business-exception","object-exception"]},fromId:P,toId:P,label:z}),Gc=U({id:P,sourceId:P,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:G(P),unresolvedTargets:G(z),summary:z,content:z}),$o=U({id:P,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:z,title:z,preface:xe,scope:xe,objects:G(U({...zi,icon:z,information:G(z)})),activities:G(U({...zi,why:z,when:z,who:z,where:z,procedure:z,exception:Re(z),result:z,problem:Re(z),painLevel:Re({enum:["Low","Medium","High"]})})),relations:G(ls),findings:G(Gc)}),Hc=U({id:P,name:z,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Tr=U({...$o.properties,schemaVersion:{enum:["0.2"]},roles:G(Hc),activities:G(U({...$o.properties.activities.items.properties,roleId:Re(P)}))}),Yi=U({...Tr.properties,schemaVersion:{enum:["0.3"]},exceptions:G(U({id:P,activityId:P,name:z,description:xe}))}),Xt=e=>({...G(e),minItems:1}),qr=U({id:P,name:z,description:xe}),$r={anyOf:[U({kind:{enum:["before"]},beforeId:P,afterId:P}),U({kind:{enum:["interchangeable"]},stepIds:{...G(P),minItems:2}})]},Wr=Object.fromEntries(Object.entries(Yi.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),Jc=U({objectId:P,roleIds:G(P)}),_c=U({id:P,text:z,obligation:{enum:["required","optional"]},appliesWhen:Re(z),performerObjectIds:Re(Xt(P))}),zr=U({id:P,name:z,items:Xt(U({informationId:P,condition:Re(z)}))}),Kc=U({...Yi.properties,schemaVersion:{enum:["0.4"]},objects:G(U({...zi,icon:z,information:G(qr)})),activities:Xt(U({...Wr,performers:Re(Xt(Jc)),procedure:U({steps:Xt(_c),orderRules:G($r)}),results:Xt(U({id:P,text:z}))})),data:G(zr),relations:G({anyOf:[U({id:P,kind:{enum:["input","output"]},fromId:P,toId:P,dataId:P}),U({...ls.properties,kind:{enum:["business-exception","object-exception"]}})]})}),Xc={anyOf:[U({kind:{enum:["role"]},roleId:P}),U({kind:{enum:["system","scheduler"]},name:z}),{type:"null"}]},Zc={anyOf:[U({kind:{enum:["interaction"]},phase:Re({enum:["request","response","not-applicable"]}),direction:{enum:["input","output"]},objectId:P,dataIds:Re(G(P)),relationId:Re(P),pairedStepId:Re(P)}),U({kind:{enum:["internal"]}}),U({kind:{enum:["unresolved"]}})]},Js={anyOf:[U({kind:{enum:["who"]}}),U({kind:{enum:["object"]},objectId:P})]},Yc=U({from:Re(Js),to:Re(Js)}),Qc=U({id:P,action:z,method:Re(z),whatDataIds:Re(G(P)),legacyText:z,obligation:{enum:["required","optional"]},appliesWhen:Re(z),effect:Re({enum:["create","read","update","delete","not-applicable","undecided"]}),exchange:Zc,parties:Yc},["id","action","method","whatDataIds","obligation","appliesWhen","effect","exchange"]),ed=U({trigger:Re(z),onInterrupt:Re(z),outcome:Re({enum:["resume","continue","end"]}),resumeCondition:Re(z),resumeAction:Re(z),interruptedAtStepId:Re(P),resumeAtStepId:Re(P),retainedDataIds:Re(G(P))}),td=U({id:P,activityId:P,name:z,description:xe,continuity:ed},["id","activityId","name","description"]),_s={...zi,scope:Re({type:"boolean"})},nd=U({...Yi.properties,schemaVersion:{enum:["0.5"]},objects:G(U({..._s,icon:z,information:G(qr)})),activities:Xt(U({...Wr,..._s,who:Xc,procedure:U({steps:Xt(Qc),orderRules:G($r)}),results:Xt(U({id:P,text:z}))})),exceptions:G(td),data:G(zr),relations:G({anyOf:[U({id:P,kind:{enum:["input","output"]},fromId:P,toId:P}),U({...ls.properties,kind:{enum:["business-exception","object-exception"]}})]})}),id=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Tn])),od=U({id:P,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:z,title:z,basedOn:U({documentId:P,revision:z,verification:{enum:["unverified"]}}),intro:Tn,index:G(U({activityId:P,purpose:xe,connections:xe,checkIds:G(P)})),sections:G(U({id:P,activityId:Re(P),title:z,preamble:Tn})),guarantees:G(U({id:P,sectionId:P,title:z,blocks:G({anyOf:[U({kind:{enum:["prose"]},content:Tn}),U({kind:{enum:["example"]},exampleId:P})]})})),examples:G(U({id:P,guaranteeId:P,columns:G(z),rows:G(G(Tn))})),items:G(U({id:P,checkId:P,title:z,detailSummary:xe,sectionId:P,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:U(id,[])})),notes:G(U({id:P,title:z,content:Tn}))}),us=U({id:P,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:z,title:z,basedOn:U({documentId:P,revision:z,verification:{enum:["unverified"]}}),objectId:P,states:G(U({id:P,name:z})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:z,transitions:G(U({id:P,sourceId:z,fromId:z,activityId:P,event:Re(z),exception:Re(z),condition:z,toId:z,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:z,note:z}))}),Ks=Object.fromEntries(Object.entries({...us.properties.transitions.items.properties,exceptionId:Re(P)}).filter(([e])=>e!=="exception")),sd=U({...us.properties,schemaVersion:{enum:["0.2"]},transitions:G(U({...Ks,conditionLabel:z},Object.keys(Ks)))}),fs=U({documentId:P,revision:z,targetType:z,targetId:P,section:z}),rd=U({id:P,name:z,responsibilityStatus:z,responsibleSubsystemId:P},["id","name"]),ad=U({id:P,name:z,subsystemId:P,information:G(rd),reason:xe,description:xe,businessObjectIds:G(P),activityLinks:G(U({activityId:P,uses:G(z)})),sourceRefs:G(fs),reviewState:z}),cd=U({id:P,fromConceptId:P,toConceptId:P,fromPerTarget:z,toPerSource:z,condition:xe,reviewState:z,sourceRefs:G(fs),fromLabel:z,toLabel:z,kind:{enum:["down","reference"]}}),dd=U({id:P,name:z,purpose:xe,information:G(z),reason:xe,activityIds:G(P),reviewState:z}),ld=U({id:P,fromSubsystemId:P,toSubsystemId:P,information:z,description:xe,activityIds:G(P),flowDirection:{enum:["forward","return"]},reviewState:z}),ud=U({columnId:P,value:{anyOf:[xe,{type:"number"}]},linkId:z},["columnId","value"]),fd=U({card:P,columns:G(U({id:P,name:z,informationId:P})),rows:G(U({id:P,cells:G(ud)})),empty:xe},["card","columns","rows"]),Wo=U({id:P,name:z,when:xe,meaning:xe,blocks:G(fd),note:xe},["id","name","when","meaning","blocks"]),zo=U({id:P,title:z,description:xe,meta:{},samples:G(Wo)}),pd=U({...Wo.properties,checkIds:{...G(P),minItems:1,uniqueItems:!0}},[...Wo.required,"checkIds"]),md=U({decisionExampleIds:G(P),decisionCheckIds:G(P),resultCheckIds:G(P),sampleIds:G(P)}),hd=U({...zo.properties,samples:G(pd),testSpecification:md},[...Object.keys(zo.properties)]),bd=U({id:P,title:z,description:xe,reason:xe,meta:{}}),gd=U({conceptId:P,name:z,fields:G(z),description:xe,sources:G(z),sourceActivityIds:G(P)}),yd=U({id:P,fromConceptId:P,toConceptId:P,relationIds:G(P),scope:xe,fromLabel:z,toLabel:z,kind:{enum:["down","reference"]}}),vd=U({id:P,conceptId:P,subsystemId:P,name:z,description:xe,sources:G(z),fields:G(U({name:z,informationId:P}))}),wd=U({id:P,fromViewId:P,toViewId:P,relationIds:G(P),fromLabel:z,toLabel:z,kind:{enum:["down","reference"]}}),Ur=U({nodes:G(vd),edges:G(wd),handoffIds:G(P)}),Vr=U({id:P,subsystemId:P,title:z,description:xe,reviewer:U({roleId:P}),relatedActivityIds:G(P),graph:U({conceptIds:G(P),nodes:G(gd),edges:G(yd),subsystemViews:Ur},["conceptIds","nodes","edges"]),structureStatements:G(U({id:P,title:z,description:xe,sampleIds:G(P),sourceRefs:G(fs)})),capabilities:G(zo),limitations:G(bd),meta:U({questions:G(z),hypotheses:{}},["questions"])}),kd=U({...Vr.properties,capabilities:G(hd)}),Fr=U({id:P,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:z,basedOn:U({documentId:P,revision:z,verification:{enum:["unverified"]}}),relatedStates:G(U({documentId:P,revision:z,verification:{enum:["unverified"]}})),subsystems:G(dd),concepts:G(ad),relations:G(cd),handoffs:G(ld),reviewGroups:G(Vr),benefits:G(z),considerations:G(z),reviewPoints:G(z),meta:{},presentation:U({activityViews:{},creatorActivityIds:{},sampleCaption:xe,subsystemViews:Ur,landscapeRelationships:G(U({from:P,to:P})),reviewBoundaries:G(U({from:P,to:P,label:xe,promise:xe}))},["landscapeRelationships","reviewBoundaries"])}),Id=U({...Fr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:G(kd)}),Rn=(e,t)=>U({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:z,documents:G({anyOf:t.map(Bc)}),sources:G(U({documentId:P,revision:z,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:xe})),externalDocuments:G(U({id:P,kind:{enum:["businessDesign"]},revision:z,activities:G(U({id:P,name:z}))})),diagnostics:G(z)}),ai={anyOf:[Rn("0.1",["businessDesign","checkItems"]),Rn("0.2",["businessDesign","checkItems","stateTransition"]),Rn("0.3",["businessDesignRoles","checkItems","stateTransition"]),Rn("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"]),Rn("0.5",["oldStructuredBusinessDesign","checkItems","stateTransitionStructured"]),Rn("0.6",["procedureBusinessDesign","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:$o,businessDesignRoles:Tr,businessDesignStructured:Yi,oldStructuredBusinessDesign:Kc,procedureBusinessDesign:nd,checkItems:od,stateTransition:us,stateTransitionStructured:sd,conceptModel:Fr,checkedConceptModel:Id}},Wt=(e,t)=>T(new Set(e).size===e.length,t),ci=(e,t)=>T(e.length>0,t);function Sd(e,t){const n=e.procedure.steps,i=n.map(u=>u.id),o=new Map(i.map(u=>[u,[]])),r=new Set,s=new Set,d=[];ci(n,"Procedure requires a Step: "+e.id);for(const u of e.procedure.orderRules)if(u.kind==="before"){t(u.beforeId,"step",e.id),t(u.afterId,"step",e.id),T(u.beforeId!==u.afterId,"Self Step order");const l=JSON.stringify([u.beforeId,u.afterId]);T(!r.has(l),"Duplicate Step order"),r.add(l),T(i.indexOf(u.beforeId)<i.indexOf(u.afterId),"Standard Step order contradicts before constraint"),o.get(u.beforeId).push(u.afterId)}else{T(u.stepIds.length>=2,"Interchangeable group requires two Steps"),Wt(u.stepIds,"Duplicate interchangeable Step");for(const f of u.stepIds)t(f,"step",e.id);const l=JSON.stringify([...u.stepIds].sort());T(!s.has(l),"Duplicate interchangeable group"),s.add(l),d.push(u.stepIds)}const c=(u,l)=>{const f=[u],g=new Set;for(;f.length;){const a=f.pop();if(!g.has(a)){g.add(a);for(const h of o.get(a)){if(h===l)return!0;f.push(h)}}}return!1};for(const u of i)T(!c(u,u),"Step order cycle");for(const u of d)for(const l of u)for(const f of u)l!==f&&T(!c(l,f),"Interchangeable Steps conflict with before constraint")}function Br(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&T(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};Wt(e.roles.map(o=>o.name),"Duplicate Role name"),T(e.roles.every(o=>o.name===o.name.trim()&&!/[\r\n]/.test(o.name)),"Invalid Role name"),Wt(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){T(o.name===o.name.trim(),"Data name whitespace"),ci(o.items,"Data requires Information: "+o.id),Wt(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities)ci(o.results,"Activity requires Result: "+o.id),Sd(o,i);return i}function xd(e,t,n){const i=Br(e,t,n);for(const o of e.activities){if(o.performers!==null){ci(o.performers,"Empty performers"),Wt(o.performers.map(s=>s.objectId),"Duplicate performer");for(const s of o.performers){i(s.objectId,"object"),Wt(s.roleIds,"Duplicate performer Role");for(const d of s.roleIds)i(d,"role")}}let r=o.performers===null;for(const s of o.procedure.steps)if(s.performerObjectIds!==null){ci(s.performerObjectIds,"Empty Step performers"),Wt(s.performerObjectIds,"Duplicate Step performer");for(const d of s.performerObjectIds)T(o.performers?.some(c=>c.objectId===d),"Step performer outside Activity assignment: "+d)}else o.performers?.length!==1&&(r=!0);r&&T(e.findings.some(s=>s.status==="open"&&s.scope==="items"&&s.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id)}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}function Ad(e,t,n,i){const o=Br(e,t,n),r=new Map(e.activities.flatMap(s=>s.procedure.steps.map(d=>[d.id,{activity:s,step:d}])));for(const s of e.exceptions){const d=s.continuity;if(d){for(const c of[d.interruptedAtStepId,d.resumeAtStepId])c!==null&&o(c,"step",s.activityId);if(d.retainedDataIds!==null){Wt(d.retainedDataIds,"Duplicate retained Data");for(const c of d.retainedDataIds)o(c,"data")}}}for(const s of e.objects)s.scope===null&&i.push("Scope未確定: "+s.id);for(const s of e.activities){s.scope===null&&i.push("Scope未確定: "+s.id),s.who===null?i.push("Who未確定: "+s.id):s.who.kind==="role"&&o(s.who.roleId,"role");for(const d of s.procedure.steps){if(d.parties)for(const u of[d.parties.from,d.parties.to])u?.kind==="object"&&o(u.objectId,"object");if(d.whatDataIds===null)i.push("対象Data未確定: "+d.id);else{Wt(d.whatDataIds,"Duplicate Step target Data");for(const u of d.whatDataIds)o(u,"data")}const c=d.exchange;if(c.kind==="unresolved"){i.push("やり取り未確定: "+d.id);continue}if(c.kind!=="internal"){if(o(c.objectId,"object"),c.phase===null&&i.push("Request/Response未確定: "+d.id),c.dataIds===null)i.push("Data未確定: "+d.id);else{Wt(c.dataIds,"Duplicate Step Data");for(const u of c.dataIds)o(u,"data")}if(c.relationId!==null){const u=o(c.relationId,"relation"),l=c.direction==="input";T(u.kind===c.direction&&u.fromId===(l?c.objectId:s.id)&&u.toId===(l?s.id:c.objectId),"Step relation direction/endpoint mismatch: "+d.id)}if(c.pairedStepId!==null){const u=r.get(c.pairedStepId);T(u&&u.activity.id===s.id&&u.step.id!==d.id,"Invalid paired Step: "+d.id);const l=u.step.exchange;T(l.kind==="interaction"&&["request","response"].includes(c.phase)&&["request","response"].includes(l.phase)&&l.phase!==c.phase&&l.direction!==c.direction&&l.objectId===c.objectId,"Request/Response mismatch: "+d.id)}}}}}function Ed(e){const t=new Map(e.data.map(o=>[o.id,o])),n=new Map,i=[];for(const o of e.activities)for(const r of o.procedure.steps){const s=r.exchange,d=new Map,c=(h,m)=>{let p=d.get(h);if(!p){const b=t.get(h);T(b,"Unknown Data during projection: "+h),p={id:b.id,name:b.name,uses:[]},d.set(h,p)}p.uses.includes(m)||p.uses.push(m)};for(const h of r.whatDataIds??[])c(h,"target");if(s.kind==="interaction")for(const h of s.dataIds??[])c(h,"transferred");const u={activityId:o.id,stepId:r.id,action:r.action,method:r.method,data:[...d.values()],targetDataUndecided:r.whatDataIds===null,obligation:r.obligation,appliesWhen:r.appliesWhen,effect:r.effect,...r.parties?{parties:r.parties}:{}};if(s.kind!=="interaction"){i.push({...u,kind:s.kind,from:s.kind==="internal"?{kind:"who",activityId:o.id}:null,to:null});continue}const l={kind:"who",activityId:o.id},f={kind:"object",objectId:s.objectId};i.push({...u,kind:s.kind,from:s.direction==="output"?l:f,to:s.direction==="output"?f:l,objectId:s.objectId,direction:s.direction,phase:s.phase,dataIds:s.dataIds,relationId:s.relationId,pairedStepId:s.pairedStepId});const g=JSON.stringify([o.id,s.objectId,s.direction]);n.has(g)||n.set(g,{activityId:o.id,objectId:s.objectId,direction:s.direction,stepIds:[],relationIds:[],data:[]});const a=n.get(g);a.stepIds.push(r.id),s.relationId!==null&&!a.relationIds.includes(s.relationId)&&a.relationIds.push(s.relationId),s.dataIds===null&&(a.transferUndecided=!0);for(const h of s.dataIds??[])if(!a.data.some(m=>m.id===h)){const m=t.get(h);T(m,"Unknown Data during projection: "+h),a.data.push({id:m.id,name:m.name})}}return{rows:i,edges:[...n.values()].map(o=>({...o,label:o.data.map(r=>r.name).join(" / ")}))}}const T=(e,t)=>{if(!e)throw Error(t)};function Gr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const r=t++;for(;t<e.length;){const s=e[t++];if(s==='"')return JSON.parse(e.slice(r,t));s==="\\"&&t++}throw Error("Unclosed JSON string")},o=(r=0)=>{T(r<=64,"JSON depth limit"),n();const s=e[t];if(s==='"'){i();return}if(s==="{"){t++,n();const c=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),T(e[t]==='"',"JSON object key required");const u=i();T(!c.has(u),"Duplicate JSON key: "+u),c.add(u),n(),T(e[t++]===":","JSON colon required"),o(r+1),n();const l=e[t++];if(l==="}")return;T(l===",","JSON comma required")}throw Error("Truncated object")}if(s==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(r+1),n();const c=e[t++];if(c==="]")return;T(c===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;T(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),T(t===e.length,"Trailing JSON content"),JSON.parse(e)}function pn(e,t=ai,n="$"){if(t.$ref)return pn(e,ai.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{pn(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&T(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;T(i===t.type,"Invalid type at "+n)}if(t.minLength&&T(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&T(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])T(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))T(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),pn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>pn(i,t.items,n+"["+o+"]"))}function Od(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,c,u=d.id)=>{T(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,c),o.set(s.id,u)};for(const s of e.documents){r(s,s,"document",null);for(const[d,c]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[d]??[])r(u,s,c);if(s.kind==="businessDesign"&&["0.4","0.5"].includes(s.schemaVersion)){for(const d of s.objects)for(const c of d.information)r(c,s,"information",d.id);for(const d of s.activities){for(const c of d.procedure.steps)r(c,s,"step",d.id);for(const c of d.results)r(c,s,"result",d.id)}for(const d of s.data)r(d,s,"data")}}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}return{map:t,owner:n,types:i,parent:o}}function Ui(e){return pn(e),Hr(e)}function Vn(e,t){const n=new Set(e.items.map(s=>s.id)),i=new Set,o=e.guarantees.find(s=>s.id===t.guaranteeId),r=s=>{if(Array.isArray(s)){for(const d of s)r(d);return}if(s&&typeof s=="object"){s.kind==="reference"&&n.has(s.targetId)&&i.add(s.targetId);for(const d of Object.values(s))d&&typeof d=="object"&&r(d)}};r(t.rows);for(const s of o?.blocks??[])s.kind==="prose"&&r(s.content);for(const s of e.items)(s.fields.guarantee??[]).some(c=>c.kind==="reference"&&(c.targetId===t.id||c.targetId===t.guaranteeId))&&i.add(s.id);return[...i]}function Hr(e,{allowUnresolvedFindings:t=!1}={}){T(e.documents.length>0,"Document required");const n=Od(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const a of e.sources)if(a.uri){const h=new URL(a.uri);T(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const c=(a,h,m)=>(T(i.has(a),"Dangling reference: "+a),h&&T(r.get(a)===h,"Reference type mismatch: "+a),m&&T(o.get(a)===m,"Cross-document mismatch: "+a),i.get(a)),u=a=>a?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),l=(a,h)=>{for(const m of a)if(m.kind==="reference"&&(c(m.targetId,null,h),T(["document","section","guarantee","example","check","note"].includes(r.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const p=new URL(m.uri);T(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const a of e.documents)if(T(e.formatVersion!=="0.1"||a.kind!=="stateTransition","State documents require formatVersion 0.2"),a.kind==="businessDesign"){T(a.activities.length>0,"Activity required");const h=[...a.objects,...a.activities].map(b=>b.name);T(new Set(h).size===h.length,"Duplicate visible name"),T(h.every(b=>b===b.trim()&&!(["0.4","0.5","0.6"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(S=>b.includes(S))),"Invalid Graph-visible name");for(const b of a.objects)T(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3"].includes(a.schemaVersion)){T(new Set(a.roles.map(b=>b.name)).size===a.roles.length,"Duplicate Role name"),T(a.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name");for(const b of a.activities)b.roleId!==null?c(b.roleId,"role",a.id):d.add("Role未確定: "+b.id+" — "+b.who)}for(const b of a.activities)T(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of a.exceptions??[])c(b.activityId,"activity",a.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const b of a.relations){c(b.fromId,m[b.kind][0],a.id),c(b.toId,m[b.kind][1],a.id);const S=JSON.stringify([b.kind,b.fromId,b.toId,a.schemaVersion==="0.5"?b.id:b.dataId??b.label]);T(!p.has(S),"Duplicate relation"),p.add(S)}a.schemaVersion==="0.4"&&xd(a,n,c),a.schemaVersion==="0.5"&&Ad(a,n,c,s),T(new Set(a.findings.map(b=>b.sourceId)).size===a.findings.length,"Duplicate Finding source ID");for(const b of a.findings){T(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),T(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const S of b.targetIds)c(S,null,a.id),T(["object","activity"].includes(r.get(S)),"Invalid Finding target");b.unresolvedTargets.length&&(T(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(a.kind==="stateTransition"){const h=c(a.basedOn.documentId,"document");T(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),T(h.revision===a.basedOn.revision,"Stale State source revision"),c(a.objectId,"object",h.id),T(!e.documents.some(p=>p!==a&&p.kind==="stateTransition"&&p.objectId===a.objectId),"Duplicate Object state declaration"),T(a.states.length>0&&new Set(a.states.map(p=>p.name)).size===a.states.length,"Duplicate/empty state names"),T(a.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),T(a.transitions.length<=1e3,"State transition row budget"),T(new Set(a.transitions.map(p=>p.sourceId)).size===a.transitions.length,"Duplicate transition source ID");const m=new Map;for(const p of a.transitions){p.fromId!=="@new"&&c(p.fromId,"state",a.id),["@unknown","@none"].includes(p.toId)||c(p.toId,"state",a.id);const b=c(p.activityId,"activity",h.id),S=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(T(!m.has(S),"Duplicate state transition condition: "+m.get(S)+" / "+p.sourceId),m.set(S,p.sourceId),["0.4","0.5","0.6"].includes(e.formatVersion))if(T(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const v=c(p.exceptionId,"exception",h.id);T(v.activityId===b.id,"Exception Activity mismatch")}else p.path==="exception"&&T(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else T(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);T(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),T(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),T(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),T(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+a.id)}else if(a.kind==="conceptModel"){const h=c(a.basedOn.documentId,"document");T(h.kind==="businessDesign"&&h.revision===a.basedOn.revision,"Concept source must be the matching in-package BD revision"),T(!e.documents.some(L=>L!==a&&L.kind==="conceptModel"&&L.basedOn.documentId===h.id),"Duplicate Concept model for Business Design");const m=(L,C)=>{const R=new Map;for(const ee of L)T(!R.has(ee.id),"Duplicate "+C+" ID: "+ee.id),R.set(ee.id,ee);return R},p=m(a.subsystems,"subsystem"),b=m(a.concepts,"concept"),S=m(a.relations,"concept relation"),v=m(a.reviewGroups,"review group"),D=m(a.handoffs,"handoff"),x=m(a.concepts.flatMap(L=>L.information),"concept information"),I=(L,C,R)=>(T(L.has(C),"Unknown "+R+": "+C),L.get(C)),A=L=>c(L,"activity",h.id),M=L=>{const C=c(L.documentId,"document");T(C.revision===L.revision,"Stale Concept source revision");const R=C.id===h.id,ee=C.kind==="stateTransition"&&C.basedOn.documentId===h.id&&a.relatedStates.some(V=>V.documentId===C.id&&V.revision===C.revision);T(R||ee,"Concept source must refer to its Business Design or a declared State"),c(L.targetId,L.targetType,C.id)};for(const L of a.relatedStates){const C=c(L.documentId,"document");T(C.kind==="stateTransition"&&C.revision===L.revision&&C.basedOn.documentId===h.id,"Invalid Concept state reference")}for(const L of a.subsystems)for(const C of L.activityIds)A(C);for(const L of a.concepts){I(p,L.subsystemId,"subsystem");for(const C of L.information)C.responsibleSubsystemId&&I(p,C.responsibleSubsystemId,"responsible subsystem");for(const C of L.businessObjectIds)c(C,"object",h.id);for(const C of L.activityLinks)A(C.activityId);for(const C of L.sourceRefs)M(C)}for(const L of a.relations){I(b,L.fromConceptId,"concept"),I(b,L.toConceptId,"concept");for(const C of L.sourceRefs)M(C)}for(const L of a.handoffs){I(p,L.fromSubsystemId,"subsystem"),I(p,L.toSubsystemId,"subsystem"),T(L.fromSubsystemId!==L.toSubsystemId,"Handoff must cross subsystem boundary");for(const C of L.activityIds)A(C)}const $=(L,C)=>{const R=m(L.nodes,"subsystem view"),ee=m(L.edges,"subsystem view edge");for(const Z of R.values()){I(C,Z.conceptId,"view concept"),I(p,Z.subsystemId,"subsystem");const ae=I(b,Z.conceptId,"concept");for(const te of Z.fields)T(ae.information.some(ue=>ue.id===te.informationId),"Unknown information for subsystem view: "+te.informationId)}for(const Z of ee.values()){const ae=I(R,Z.fromViewId,"subsystem view"),te=I(R,Z.toViewId,"subsystem view");T(ae.subsystemId===te.subsystemId,"View relationship crosses subsystem boundary"),T(Z.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ue=ae.conceptId;for(const he of Z.relationIds){const ce=I(S,he,"concept relation");T(ce.fromConceptId===ue,"Subsystem view relation path is disconnected: "+he),ue=ce.toConceptId}T(ue===te.conceptId,"Subsystem view relation target differs")}T(new Set(L.handoffIds).size===L.handoffIds.length,"Duplicate subsystem view handoff");const V=new Set([...R.values()].map(Z=>Z.subsystemId));for(const Z of L.handoffIds){const ae=I(D,Z,"handoff");T(V.has(ae.fromSubsystemId)&&V.has(ae.toSubsystemId),"Missing subsystem view handoff region: "+Z)}};a.presentation.subsystemViews&&$(a.presentation.subsystemViews,b);for(const L of a.reviewGroups){I(p,L.subsystemId,"subsystem"),c(L.reviewer.roleId,"role",h.id);for(const V of L.relatedActivityIds)A(V);const C=m(L.graph.nodes.map(V=>({...V,id:V.conceptId})),"view concept");T(new Set(L.graph.conceptIds).size===L.graph.conceptIds.length&&L.graph.conceptIds.length===C.size&&L.graph.conceptIds.every(V=>C.has(V)),"View concepts and nodes differ");for(const V of L.graph.nodes){I(b,V.conceptId,"concept");for(const Z of V.sourceActivityIds)A(Z)}m(L.graph.edges,"view edge");for(const V of L.graph.edges){I(C,V.fromConceptId,"view concept"),I(C,V.toConceptId,"view concept");for(const Z of V.relationIds)I(S,Z,"concept relation")}L.graph.subsystemViews&&$(L.graph.subsystemViews,C);const R=m(L.capabilities,"capability"),ee=m(L.capabilities.flatMap(V=>V.samples),"sample");m(L.limitations,"limitation"),m(L.structureStatements,"structure statement");for(const V of L.structureStatements){for(const Z of V.sampleIds)I(ee,Z,"sample");for(const Z of V.sourceRefs)M(Z)}for(const V of R.values())if(V.testSpecification){const Z=V.testSpecification;for(const[te,ue]of Object.entries(Z))T(new Set(ue).size===ue.length,"Duplicate function specification reference: "+te);const ae=(te,ue)=>{const he=c(te,ue),ce=c(o.get(te),"document");return T(ce.kind==="checkItems"&&ce.basedOn.documentId===h.id&&ce.basedOn.revision===h.revision,"Function Check source mismatch: "+te),{value:he,doc:ce}};for(const te of[...Z.decisionCheckIds,...Z.resultCheckIds])ae(te,"check");for(const te of Z.decisionExampleIds){const{value:ue,doc:he}=ae(te,"example"),ce=Vn(he,ue);T(ce.length>0,"Function decision table needs a Check: "+te),T(ce.every(ge=>Z.decisionCheckIds.includes(ge)),"Function decision table Check is not assigned: "+te)}for(const te of Z.sampleIds){const ue=V.samples.find(he=>he.id===te);T(ue,"Function result sample belongs to another capability: "+te),T(ue.checkIds.some(he=>Z.resultCheckIds.includes(he)),"Function result sample needs a result Check: "+te),T(ue.checkIds.every(he=>Z.resultCheckIds.includes(he)||Z.decisionCheckIds.includes(he)),"Function result sample Check is not assigned: "+te)}}for(const V of R.values())for(const Z of V.samples){if(a.schemaVersion==="0.2"){T(Z.checkIds.length>0,"Sample needs a Check: "+Z.id),T(new Set(Z.checkIds).size===Z.checkIds.length,"Duplicate sample Check: "+Z.id);for(const ae of Z.checkIds){c(ae,"check");const te=c(o.get(ae),"document");T(te.kind==="checkItems"&&te.basedOn.documentId===h.id&&te.basedOn.revision===h.revision,"Sample Check source mismatch: "+ae)}}for(const ae of Z.blocks){I(C,ae.card,"view concept");const te=m(ae.columns,"sample column");for(const ue of ae.columns)I(x,ue.informationId,"concept information");m(ae.rows,"sample row");for(const ue of ae.rows){const he=new Set;for(const ce of ue.cells)I(te,ce.columnId,"sample column"),T(!he.has(ce.columnId),"Duplicate sample cell: "+ce.columnId),he.add(ce.columnId);T(he.size===te.size,"Sample row does not match columns")}}}}for(const L of a.presentation.landscapeRelationships){const C=I(v,L.from,"review group"),R=I(v,L.to,"review group");T(C.subsystemId===R.subsystemId,"Internal relationship crosses subsystem boundary")}for(const L of a.presentation.reviewBoundaries)I(v,L.from,"review group"),I(v,L.to,"review group");s.push("概念モデルの業務意味は未確認: "+a.id)}else{const h=c(a.basedOn.documentId,"document");T(h.kind==="businessDesign","Check source is not BD"),T(h.revision===a.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+a.id),T(new Set(a.items.map(b=>b.checkId)).size===a.items.length,"Duplicate Check ID");const m=new Set;for(const b of a.index){c(b.activityId,"activity",h.id),T(!m.has(b.activityId),"Duplicate Activity index"),m.add(b.activityId),T(new Set(b.checkIds).size===b.checkIds.length,"Duplicate Check binding");for(const S of b.checkIds)c(S,"check",a.id)}T(new Set(a.sections.map(b=>b.activityId??b.title)).size===a.sections.length,"Duplicate Activity section");for(const b of a.sections)b.activityId!==null&&(c(b.activityId,"activity",h.id),T(m.has(b.activityId),"Section missing from index")),l(b.preamble,a.id);const p=new Set(e.documents.filter(b=>b.kind==="conceptModel"&&b.basedOn.documentId===h.id&&b.basedOn.revision===h.revision).flatMap(b=>b.reviewGroups.flatMap(S=>S.capabilities.flatMap(v=>v.testSpecification?.decisionExampleIds??[]))));for(const b of a.guarantees){const S=b.blocks.length>0&&b.blocks.every(v=>v.kind==="example"&&p.has(v.exampleId)&&a.examples.some(D=>D.id===v.exampleId&&D.guaranteeId===b.id&&Vn(a,D).length>0));T(b.blocks.some(v=>v.kind==="prose"&&u(v.content))||S,"General guarantee prose required"),c(b.sectionId,"section",a.id);for(const v of b.blocks)if(v.kind==="prose")l(v.content,a.id);else{const D=c(v.exampleId,"example",a.id);T(D.guaranteeId===b.id,"Example owner mismatch")}}for(const b of a.examples){c(b.guaranteeId,"guarantee",a.id),T(b.columns.length>0,"Example columns required");for(const S of b.rows){T(S.length===b.columns.length,"Example column mismatch");for(const v of S)l(v,a.id)}}for(const b of a.items){const S=c(b.sectionId,"section",a.id);T(S.activityId===null?!a.index.some(v=>v.checkIds.includes(b.id)):a.index.some(v=>v.activityId===S.activityId&&v.checkIds.includes(b.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),T(u(b.fields.guarantee)||u(b.fields.condition)&&u(b.fields.expectedResult),"Check guarantee required");for(const v of Object.values(b.fields))l(v,a.id);T(S.activityId===null||a.index.some(v=>v.checkIds.includes(b.id)),"Unbound Check")}for(const b of a.notes)l(b.content,a.id);l(a.intro,a.id)}const f=e.diagnostics.filter(a=>a.startsWith("Role未確定:"));T(new Set(f).size===f.length,"Duplicate unresolved Role diagnostic");for(const a of f)T(d.delete(a),"Unresolved Who requires a diagnostic matching a current unresolved Activity");T(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const a of e.sources){c(a.documentId,"document");const h=a.documentId+"@"+a.revision;T(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const a of e.externalDocuments)T(e.sources.some(h=>h.documentId===a.id&&h.revision===a.revision),"External source revision missing"),T(a.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+a.id);return{diagnostics:s,entities:i.size}}const q=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function Qe(e,t,n){if(n==null)return;const i=ft(n);return e.append(q("h3",t),i),i}function jd(e,t){const n=q("ul");for(const i of[...new Set(t)]){const o=e.data?.find(r=>r.id===i);if(o)for(const r of o.items){const s=e.objects.flatMap(c=>c.information).find(c=>typeof c!="string"&&c.id===r.informationId);if(!s||typeof s=="string")continue;const d=q("li",s.name+(r.condition?`（条件：${r.condition}）`:""));s.description&&d.append(ft(s.description)),n.append(d)}}return n}function Cd(e,t){if(e===null)return;const n=ft(e),i=r=>String(r??"").replace(/\s+/g,""),o=new Set(t.map(r=>i(ft(`**${r.name}** — ${r.description}`).textContent)));for(const r of Array.from(n.querySelectorAll("li")))o.has(i(r.textContent))&&r.remove();for(const r of Array.from(n.querySelectorAll("ul,ol")))r.children.length||r.remove();return n.textContent?.trim()?n:void 0}const Dd={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Md(e,t,n){const i=new Map,o=new Set,r=new Set(n.map(d=>d.id)),s=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==s.id||d.basedOn.revision!==s.revision)continue;const c=d.presentation.activityViews;if(Array.isArray(c)){for(const u of c)if(!(!u||typeof u!="object"||Array.isArray(u)||u.activityId!==t||!Array.isArray(u.businessVariations)))for(const l of u.businessVariations){if(!l||typeof l!="object"||Array.isArray(l)||typeof l.exceptionId!="string"||!r.has(l.exceptionId)||l.kind!=="alternative"&&l.kind!=="exception"||o.has(l.exceptionId))continue;const f=i.get(l.exceptionId);f&&f!==l.kind?(i.delete(l.exceptionId),o.add(l.exceptionId)):i.set(l.exceptionId,l.kind)}}}return i}function Rd(e,t,n){const i=q("article");i.className="markdown json-detail";const o=e.model,r=o.business,s=r.objects.find(c=>c.id===t),d=r.activities.find(c=>c.id===t);if(s){Qe(i,"Scope",s.scope===null?"未決":String(s.scope)),i.append(q("h3","Information"));const c=q("ul");for(const u of s.information){const l=q("li",typeof u=="string"?u:u.name);typeof u!="string"&&u.description&&l.append(ft(u.description)),c.append(l)}i.append(c)}else if(d){const c=r.exceptions?.filter(a=>a.activityId===d.id)??[];if("performers"in d){Qe(i,"Scope",String(d.scope)),Qe(i,"Why",d.why),Qe(i,"When",d.when),Qe(i,"Who",ei(r,d)),Qe(i,"旧形式の担当情報",qo(r,d)),d.performers?.length===1&&d.procedure.steps.some(p=>p.performerObjectIds===null)&&i.append(q("p","旧形式では、指定のない手順は旧形式の担当情報を継承します。")),Qe(i,"Where",d.where);const a=(e.findings??[]).filter(p=>p.id.startsWith("viewer:")&&p.targets.includes(d.id));for(const p of a){const b=q("p",p.summary+" ");b.className="finding-reference-warning",b.dataset.structureIssue=p.id;const S=q("button","構造の要確認を開く");S.type="button",S.className="node-navigate",S.onclick=()=>n?.(p.id),b.append(S),i.append(b)}i.append(q("h3","Procedure"));const h=q("ol");for(const p of d.procedure.steps){const b=q("li");b.append(ft(p.text));const S=d.performers?.length===1&&(p.performerObjectIds===null||p.performerObjectIds.length===1&&p.performerObjectIds[0]===d.performers[0].objectId),v=[p.obligation==="required"?"必須":"任意",...p.appliesWhen?[`適用条件：${p.appliesWhen}`]:[],...S?[]:[`旧形式の担当：${qo(r,d,p.performerObjectIds)}`]];b.append(q("p",v.join(" · "))),h.append(b)}if(i.append(h),d.procedure.orderRules.length){i.append(q("h3","手順の順序制約"));const p=q("ul"),b=S=>String(d.procedure.steps.findIndex(v=>v.id===S)+1);for(const S of d.procedure.orderRules)p.append(q("li",S.kind==="before"?`手順${b(S.beforeId)} → 手順${b(S.afterId)}`:`手順${S.stepIds.map(b).join("・")}は入替可能`));i.append(p)}i.append(q("h3","Result"));const m=q("ul");m.dataset.businessResult="",m.dataset.resultScope="activity";for(const p of d.results){const b=q("li");b.append(ft(p.text)),m.append(b)}i.append(m),Qe(i,"Problem",d.problem),Qe(i,"Pain level",d.painLevel)}else if(typeof d.who!="string"){const a=d;Qe(i,"Scope",a.scope===null?"未決":String(a.scope)),Qe(i,"Why",a.why),Qe(i,"When",a.when),Qe(i,"Who",ei(r,a)),Qe(i,"Where",a.where),i.append(q("h3","Procedure"));const h=q("table");h.dataset.procedureTable="";const m=q("thead"),p=q("tr");for(const I of["Step","From","To","Data","Action"]){const A=q("th",I);A.scope="col",p.append(A)}m.append(p),h.append(m);const b=q("tbody"),S=I=>I?I.kind==="who"?ei(r,a):r.objects.find(A=>A.id===I.objectId)?.name??"未決":"未決";for(const[I,A]of a.procedure.steps.entries()){const M=q("tr");M.dataset.stepId=A.id;const $=A.parties,L=ce=>ce===null?"未決":ce.map(ge=>r.data?.find(Ie=>Ie.id===ge)?.name??"未決").join("、")||"なし",C=L(A.whatDataIds),R=A.exchange.kind==="interaction"?L(A.exchange.dataIds):null,ee=R===null||R===C?C:`対象：${C} / 受渡し：${R}`,V=$?S($.from):A.exchange.kind==="internal"?ei(r,a):"未決",Z=$?S($.to):A.exchange.kind==="internal"?"—":"未決";for(const ce of[String(I+1),V,Z])M.append(q("td",ce));const ae=q("td",ee),te=jd(r,[...A.whatDataIds??[],...A.exchange.kind==="interaction"?A.exchange.dataIds??[]:[]]);te.children.length&&ae.append(te),M.append(ae);const ue=q("td",A.action),he=[A.obligation==="required"?"必須":"任意",...A.method?[`方法：${A.method}`]:[],...A.appliesWhen?[`適用条件：${A.appliesWhen}`]:[],...A.effect?[`操作効果：${A.effect}`]:[]];if(A.exchange.kind==="interaction"){const ce=A.exchange,ge=r.objects.find(Ie=>Ie.id===ce.objectId)?.name??"未決";he.push(`受渡し：${ge} / ${ce.direction==="input"?"Input":"Output"}${ce.phase==="not-applicable"?"":ce.phase?` / ${ce.phase}`:" / 未決"}`),ce.pairedStepId&&he.push(`対応：手順${a.procedure.steps.findIndex(Ie=>Ie.id===ce.pairedStepId)+1}`)}else A.exchange.kind==="unresolved"&&he.push("やり取り：未決");ue.append(q("small",he.join(" · "))),A.legacyText&&ue.append(q("p",`旧手順：${A.legacyText}`)),M.append(ue),b.append(M)}h.append(b);const v=q("p","表は左右にスクロールできます。");v.className="procedure-scroll-hint";const D=q("div");if(D.dataset.procedureScroll="",D.tabIndex=0,D.setAttribute("role","region"),D.setAttribute("aria-label","手順表"),D.append(h),i.append(v,D),a.procedure.orderRules.length){i.append(q("h3","手順の順序制約"));const I=q("ul"),A=M=>String(a.procedure.steps.findIndex($=>$.id===M)+1);for(const M of a.procedure.orderRules)I.append(q("li",M.kind==="before"?`手順${A(M.beforeId)} → 手順${A(M.afterId)}`:`手順${M.stepIds.map(A).join("・")}は入替可能`));i.append(I)}i.append(q("h3","Result"));const x=q("ul");x.dataset.businessResult="",x.dataset.resultScope="activity";for(const I of a.results){const A=q("li");A.append(ft(I.text)),x.append(A)}i.append(x),Qe(i,"Problem",a.problem),Qe(i,"Pain level",a.painLevel)}else{const a=d;for(const[h,m]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const p=Qe(i,h,m==="who"?ds(e,a.id)?.name??a.who:a[m]===null?null:String(a[m]));m==="result"&&p&&(p.dataset.businessResult="")}}const u=Cd("exception"in d?d.exception:null,c),l=Md(e,d.id,c),f=(a,h,m)=>{if(!h.length&&!m)return;const p=q("section");p.dataset.businessVariations="",p.append(q("h3",a)),m&&p.append(m);for(const b of h){const S=ft(b.description);S.dataset.businessException=b.id,p.append(q("h4",b.name),S);const v=b.continuity;if(v){const D=q("dl"),x=M=>M&&typeof d.procedure!="string"?`手順${d.procedure.steps.findIndex($=>$.id===M)+1}`:"未決",I=M=>M===null?"未決":M.map($=>r.data?.find(L=>L.id===$)?.name??"未決").join("、")||"なし",A=[["発生条件",v.trigger??"未決"]];(v.onInterrupt!==null||v.outcome==="resume"||v.outcome===null)&&A.push(["中断時の扱い",v.onInterrupt??"未決"]),A.push(["その後",v.outcome==="resume"?"再開":v.outcome==="continue"?"そのまま続行":v.outcome==="end"?"終了":"未決"]),(v.outcome==="resume"||v.outcome===null||v.resumeCondition!==null||v.resumeAction!==null)&&A.push(["再開条件",v.resumeCondition??"未決"],["再開方法",v.resumeAction??"未決"]),v.interruptedAtStepId&&A.push(["中断した手順",x(v.interruptedAtStepId)]),v.resumeAtStepId&&A.push(["再開する手順",x(v.resumeAtStepId)]),(v.retainedDataIds!==null||v.outcome==="resume")&&A.push(["保持するData",I(v.retainedDataIds)]);for(const[M,$]of A)D.append(q("dt",M),q("dd",$));p.append(D)}}i.append(p)};o.formatVersion==="0.6"?f("Exception",c,u):l.size?(f("例外",c.filter(a=>l.get(a.id)==="exception")),f("別ルート",c.filter(a=>l.get(a.id)==="alternative")),f("通常以外の扱い",c.filter(a=>!l.has(a.id)),u)):f("通常以外の扱い",c,u);const g=new Map([...r.objects,...r.activities].map(a=>[a.id,a.name]));if(o.formatVersion==="0.6")for(const[a,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=e.graph.relations.filter(b=>b.kind===a&&(b.from===t||b.to===t));if(!m.length)continue;i.append(q("h3",h));const p=q("ul");for(const b of m){const v=`${a==="business-exception"?`${g.get(b.from)} → ${g.get(b.to)}`:g.get(a==="input"?b.from:b.to)} — ${b.label||"未決"}`;if(a==="business-exception"){i.append(q("p",v));continue}p.append(q("li",v))}a!=="business-exception"&&i.append(p)}else for(const[a,h]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const m=r.relations.filter(b=>b.kind===a&&(b.fromId===t||b.toId===t));if(!m.length)continue;i.append(q("h3",h));const p=q("ul");for(const b of m){const S=a==="business-exception"?`${g.get(b.fromId)} → ${g.get(b.toId)}`:g.get(a==="input"?b.fromId:b.toId),v=Pr(r,b),D=`${S} — ${v||"未決"}`;if(a==="business-exception"){i.append(q("p",D));continue}const x=q("li",D);if("dataId"in b){const I=r.data.find(M=>M.id===b.dataId),A=q("ul");for(const M of I.items){const $=r.objects.flatMap(C=>C.information).find(C=>typeof C!="string"&&C.id===M.informationId);if(!$||typeof $=="string")continue;const L=q("li",$.name+(M.condition?`（条件：${M.condition}）`:""));$.description&&L.append(ft($.description)),A.append(L)}x.append(A)}p.append(x)}a!=="business-exception"&&i.append(p)}}else i.append(q("p","項目を選択すると業務内容を表示します。"));return i}class gi{remaining=5e3;warned=!1;doc;requester;constructor(t,n=!1){this.doc=t,this.requester=n}take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(q("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(ft(o.value));continue}if(o.kind==="text"){const c=q("span",o.value);c.style.whiteSpace="pre-wrap",t.append(c);continue}if(o.kind==="link"){t.append(q("span",`${o.label} (${o.uri})`));continue}const r=q("details"),s=q("summary",o.label||o.targetId);r.append(s),t.append(r);let d=!1;r.addEventListener("toggle",()=>{if(!r.open||d)return;if(d=!0,i.has(o.targetId)){r.append(q("p","循環参照："+o.targetId));return}if(i.size>=16){r.append(q("p","参照の深さの上限です。続きは原文で確認してください。"));return}const c=new Set(i).add(o.targetId),u=this.doc,l=u.guarantees.find(m=>m.id===o.targetId),f=u.examples.find(m=>m.id===o.targetId),g=u.items.find(m=>m.id===o.targetId),a=u.sections.find(m=>m.id===o.targetId),h=u.notes.find(m=>m.id===o.targetId);if(l){r.append(q("h4",l.title));for(const m of l.blocks){if(!this.take(r))break;m.kind==="prose"?this.runs(r,m.content,c):this.example(r,m.exampleId,c)}}else if(f)this.example(r,f.id,c);else if(g){r.append(q("p",`${g.checkId} · ${g.title}`+(this.requester?"":` · ${g.reviewState}`))),this.requester&&(g.reviewState==="要確認"||g.reviewState==="要修正")&&r.append(q("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(g.fields).filter(([p])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(p))):g.fields;this.fields(r,m,c)}else a?(r.append(q("h4",a.title)),this.runs(r,a.preamble,c)):h?(r.append(q("h4",h.title)),this.runs(r,h.content,c)):o.targetId===u.id&&(r.append(q("h4",u.title)),this.runs(r,u.intro,c))})}}fields(t,n,i,o=!1){for(const[r,s]of Object.entries(n)){if(!this.take(t))break;if(t.append(q("h4",Dd[r]??r)),r==="guarantee"&&o){const d=new Set;for(const c of s){const u=c.kind==="reference"?this.doc.guarantees.find(f=>f.id===c.targetId):void 0;if(!u){this.runs(t,[c],i);continue}if(d.has(u.id))continue;d.add(u.id);const l=new Set(i).add(u.id);for(const f of u.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,l):this.example(t,f.exampleId,l)}}}else this.runs(t,s,i)}}example(t,n,i,o=!1){const r=this.doc.examples.find(f=>f.id===n);if(!Vn(this.doc,r).length)return;const s=q("table"),d=o?r.columns.indexOf("結果"):-1,c=d>0&&r.columns.at(-1)==="Check ID";if(c){const f=q("colgroup");f.span=d,s.append(f);for(let p=d;p<r.columns.length;p++)s.append(q("colgroup"));const g=q("thead"),a=q("tr"),h=q("th","条件");h.colSpan=d,h.scope="colgroup",a.append(h);for(let p=d;p<r.columns.length;p++){const b=q("th",r.columns[p]);b.rowSpan=2,b.scope="col",p===d?b.className="decision-result":r.columns[p]==="備考"&&(b.className="decision-notes"),a.append(b)}const m=q("tr");for(const p of r.columns.slice(0,d)){const b=q("th",p);b.scope="col",m.append(b)}g.append(a,m),s.append(g)}else{const f=q("tr");for(const g of r.columns){if(!this.take(t))break;f.append(q("th",g))}s.append(f)}const u=c?q("tbody"):s;for(const f of r.rows){if(!this.take(t))break;const g=q("tr");for(const[a,h]of f.entries()){if(!this.take(t))break;const m=q("td");if(c&&a===d?m.className="decision-result":c&&r.columns[a]==="備考"&&(m.className="decision-notes"),o)for(const p of h){const b=p.kind==="reference"?this.doc.items.find(S=>S.id===p.targetId):void 0;b?m.append(q("span",b.checkId)):this.runs(m,[p],i)}else this.runs(m,h,i);g.append(m)}u.append(g)}c&&s.append(u);const l=q("div");l.className="json-example",l.append(s),t.append(l)}}function Xs(e,t,n=e.model.checks,i=new Set,o=new Set){const r=q("section");r.className="check-content json-checks";const s=e.model.business,d=n.filter(u=>u.basedOn.documentId===s.id);let c=!1;for(const u of d){const l=new gi(u),f=u.index.filter(m=>m.activityId===t),g=new Set(u.index.flatMap(m=>m.checkIds)),a=(t?[...new Set(f.flatMap(m=>m.checkIds))]:u.items.filter(m=>!g.has(m.id)).map(m=>m.id)).filter(m=>!i.has(m)),h=u.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of h){(m.preamble.length||u.guarantees.some(p=>p.sectionId===m.id&&!o.has(p.id)))&&(c=!0),l.runs(r,m.preamble);for(const p of u.guarantees.filter(b=>b.sectionId===m.id&&!o.has(b.id)))l.runs(r,[{kind:"reference",targetId:p.id,label:p.title}])}for(const m of a){const p=u.items.find(v=>v.id===m);if(!p)continue;c=!0;const b=q("section");b.className="check-item",b.dataset.checkId=p.checkId,b.dataset.elementId=p.id,b.append(q("h3",p.checkId+" · "+p.title)),(p.reviewState==="要確認"||p.reviewState==="要修正")&&b.append(q("p","確認が必要です。"));const S=Object.fromEntries(Object.entries(p.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));l.fields(b,S,new Set([p.id])),r.append(b)}if(!t)for(const m of u.notes)c=!0,l.runs(r,[{kind:"reference",targetId:m.id,label:m.title}])}return c||r.append(q("p","この業務のテスト仕様はありません。")),r}function Ld(e,t,n=e.model.checks){const i=q("section");i.className="check-content json-checks sample-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new gi(s);for(const c of s.items.filter(u=>r.has(u.id))){const u=q("section");u.className="check-item",u.dataset.checkId=c.checkId,u.dataset.elementId=c.id,u.append(q("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&u.append(q("p","確認が必要です。"));const l=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));d.fields(u,l,new Set([c.id]),!0),i.append(u)}}return i}const Nd=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Pd(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(Nd,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function Td(e,t,n=e.model.checks){const i=q("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const r of t)for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=s.examples.find(h=>h.id===r);if(!d||!Vn(s,d).length)continue;const c=new gi(s,!0),u=s.guarantees.find(h=>h.id===d.guaranteeId),l=q("section");l.dataset.decisionExample=r;for(const h of u?.blocks??[])h.kind==="prose"&&c.runs(l,Pd(h.content),new Set([u.id]));d.rows.length>1&&l.append(q("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=d.columns.indexOf("結果"),g=f>0?f:d.columns.length;d.rows.some(h=>h.slice(0,g).some(m=>m.some(p=>p.kind==="text"&&/^\s*[-‐]\s*$/.test(p.value))))&&l.append(q("p","‐＝値不問。")),c.example(l,r,new Set([r]),!0),i.append(l)}return i}function qd(e,t,n=e.model.checks){const i=q("section");i.className="check-content json-checks decision-checks";const o=e.model.business,r=new Set(t);for(const s of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new gi(s,!0);for(const c of s.items.filter(u=>r.has(u.id))){const u=q("section");u.className="check-item",u.dataset.checkId=c.checkId,u.dataset.elementId=c.id,u.append(q("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&u.append(q("p","確認が必要です。")),c.fields.condition?.length&&(u.append(q("h4","条件")),d.runs(u,c.fields.condition,new Set([c.id])));const l=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(l).length){const f=q("details");f.append(q("summary","期待結果")),d.fields(f,l,new Set([c.id]),!0),u.append(f)}i.append(u)}}return i}function $d(e,t,n=e.model.checks,i=new Set){const o=q("section");o.className="check-content json-checks result-checks";const r=e.model.business,s=new Set(t);for(const d of n.filter(c=>c.basedOn.documentId===r.id&&c.basedOn.revision===r.revision)){const c=new gi(d,!0),u=d.items.filter(l=>s.has(l.id)&&i.has(l.id)&&l.reviewState!=="要確認"&&l.reviewState!=="要修正"&&!l.fields.question?.length&&!l.fields.alternatives?.length);u.length&&o.append(q("p",u.map(l=>l.checkId).join("、")));for(const l of d.items.filter(f=>s.has(f.id))){if(u.includes(l))continue;const f=q("section");f.className="check-item",f.dataset.checkId=l.checkId,f.dataset.elementId=l.id,f.append(q("h3",l.checkId)),(l.reviewState==="要確認"||l.reviewState==="要修正")&&f.append(q("p","確認が必要です。"));const g=Object.fromEntries(Object.entries(l.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));c.fields(f,g,new Set([l.id]),!0);const a=q("details"),h=q("summary","Check の詳細");a.append(h,q("p",l.title)),l.fields.condition?.length&&c.runs(a,l.fields.condition,new Set([l.id])),f.append(a),o.append(f)}}return o}const Eo=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Wd(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(l=>l.id)),i=[],o=new Set,r=new Set,s=t.filter(l=>l.basedOn.documentId===e.business.id&&l.basedOn.revision===e.business.revision),d=(l,f)=>s.some(g=>g.items.some(a=>a.id===l)&&(!f||g.index.some(a=>a.activityId===f&&a.checkIds.includes(l)))),c=(l,f,g,a,h=[])=>{const m=f.testSpecification,p=(m?.decisionCheckIds??[]).filter(A=>d(A,g)),b=(m?.resultCheckIds??[]).filter(A=>d(A,g)),S=(m?.decisionExampleIds??[]).filter(A=>s.some(M=>{const $=M.examples.find(C=>C.id===A),L=$?Vn(M,$):[];return L.length>0&&L.every(C=>d(C,g))})),v=f.samples.filter(A=>(!m||m.sampleIds.includes(A.id))&&A.checkIds?.length&&(m?A.checkIds.every(M=>d(M,g)):A.checkIds.some(M=>d(M,g)))),D=S.flatMap(A=>s.flatMap(M=>{const $=M.examples.find(L=>L.id===A);return $?Vn(M,$).filter(L=>d(L,g)):[]})),x=[...new Set([...p,...b,...D,...v.flatMap(A=>(A.checkIds??[]).filter(M=>d(M,g)))])];if(!x.length)return;const I=`fn:${g??"_"}:${l}:${f.id}`;r.has(I)||(r.add(I),i.push({key:I,activityId:g,groupId:l,capability:f,name:a,samples:v,checkIds:x,decisionCheckIds:p,resultCheckIds:b,decisionExampleIds:S,decisionTableCheckIds:[...new Set(D)],businessSections:h}))},u=e.model.presentation.activityViews;if(Array.isArray(u)){for(const l of u)if(!(!Eo(l)||typeof l.activityId!="string"||!n.has(l.activityId)||!Array.isArray(l.testSpecificationFunctions)))for(const f of l.testSpecificationFunctions){if(!Eo(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const g=e.model.reviewGroups.find(m=>m.id===f.groupId),a=g?.capabilities.find(m=>m.id===f.capabilityId);if(!g||!a)continue;o.add(JSON.stringify([g.id,a.id]));const h=[];if(Array.isArray(f.businessSections))for(const m of f.businessSections){if(!Eo(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(b=>b.id===m.exceptionId&&b.activityId===l.activityId)))continue;const p=[...new Set(m.pages.filter(b=>b==="decision"||b==="result"))];p.length&&h.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:p})}c(g.id,a,l.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():a.title,h)}}for(const l of e.model.reviewGroups)for(const f of l.capabilities)o.has(JSON.stringify([l.id,f.id]))||c(l.id,f,void 0,f.title);return i}function Zs(e,t,n,i){const o=e.filter(s=>s.groupId===t&&s.capability.id===n),r=o.find(s=>s.samples.some(d=>d.id===i));if(r)return{kind:"sample",key:r.key,sampleId:i};for(const s of o){if(!s.capability.testSpecification)continue;const d=s.capability.samples.find(u=>u.id===i),c=s.decisionExampleIds.length?s.decisionTableCheckIds:s.decisionCheckIds;if(d?.checkIds?.some(u=>c.includes(u)))return{kind:"decision",key:"decision:"+s.key}}}const Ln=["landscape","overview"];function zd(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const r=document.createElement("div");r.className="shell-workbench",n.before(r);const s=document.createElement("aside");s.id="design-explorer",s.setAttribute("aria-label","設計ナビゲーション"),s.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",r.append(s,d),d.append(i,n);const c=document.createElement("div");c.className="shell-open-tabs",o.before(c),c.append(o),Ec(c);const u=document.createElement("nav");u.className="concept-tabs",u.setAttribute("aria-label","開いているサブシステムとデータ構造"),c.append(u);const l=document.createElement("nav");l.className="state-tabs",l.setAttribute("aria-label","開いている状態遷移"),c.append(l);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),c.append(f);const g=document.createElement("section");g.id="concept-workspace",g.hidden=!0,g.setAttribute("aria-label","データ構造"),g.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(g);const a=document.createElement("section");a.id="states-workspace",a.hidden=!0,a.setAttribute("aria-label","状態遷移"),a.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(a);const h=document.createElement("section");h.id="tests-workspace",h.hidden=!0,h.setAttribute("aria-label","テスト仕様"),h.innerHTML='<main class="test-spec-page"></main>',d.append(h);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const p=document.createElement("section");p.id="empty-workspace",p.hidden=!0,p.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(p);const b=n.querySelector("#node-list-drawer");s.append(b);const S=e.querySelector("#node-list-toggle"),v=e.querySelector("#drawer"),D=s.querySelector("input"),x=s.querySelector("nav"),I=g.querySelector("iframe"),A=g.querySelector(".concept-related"),M=a.querySelector("article"),$="alder-explorer-v1:"+location.pathname,L=location.protocol==="file:"||location.origin==="null"?"*":location.origin,C=window.__alderConceptHtml;let R,ee,V,Z,ae={},te=[],ue=[...Ln],he=new Map,ce=new Map,ge=new Map,Ie=new Map;const N=y=>ge.get(y)??y,F=y=>Ie.get(y)??y,J=y=>ee?.findGroup(he.get(y??"")),be=y=>V?.contentFor(he.get(y)??""),ne=(y,w)=>V?.findDataExample(he.get(y)??"",w),je=y=>V?.examplesFor(he.get(y)??"")??[],Pe=y=>Ln.includes(y)?"全体図":be(y)?.title??J(y)?.name??ae[ce.get(y)??""]?.name,ke=()=>{const y=t.business(),w=y.design?.model;return w?[...w.checks,...y.relatedChecks??[]].filter(j=>j.basedOn.documentId===w.business.id):[]},re=()=>Wd(R,ke()),Ae=y=>re().find(w=>w.key===(y.startsWith("decision:")?y.slice(9):y)),Ve=y=>re().filter(w=>w.name===y.name).length>1?y.name+"（"+(t.business().activities.find(w=>w.id===y.activityId)?.name??"その他")+"）":y.name,Ge=y=>ke().some(w=>w.index.some(j=>j.activityId===y)||w.sections.some(j=>j.activityId===y)),Gt=y=>new Set(re().filter(w=>w.activityId===y).flatMap(w=>w.checkIds)),vn=y=>{const w=new Set(re().filter(j=>j.activityId===y).flatMap(j=>j.decisionExampleIds));return new Set(ke().flatMap(j=>j.examples.filter(E=>w.has(E.id)).map(E=>E.guaranteeId)))},rn=y=>{const w=Gt(y),j=vn(y);return ke().some(E=>E.index.some(W=>W.activityId===y&&W.checkIds.some(K=>!w.has(K)))||E.sections.some(W=>W.activityId===y&&(W.preamble.length>0||E.guarantees.some(K=>K.sectionId===W.id&&!j.has(K.id)))))},Da=()=>ke().some(y=>y.items.some(w=>!y.index.some(j=>j.checkIds.includes(w.id)))||y.sections.some(w=>w.activityId===null)||y.notes.length>0),Ma=y=>{const w=Ae(y);return w?w.capability.testSpecification?Ve(w)+"・"+(y.startsWith("decision:")?"可否":"結果"):w.name:(y==="@unassigned"?"未割当":y.startsWith("remaining:")?t.business().activities.find(j=>j.id===y.slice(10))?.name:y.startsWith("checks:")?t.business().activities.find(j=>j.id===y.slice(7))?.name:y==="@overview"?"テスト仕様":void 0)??y},Si=n.querySelector("#formattedMarkdownDrawer");Si&&r.append(Si),r.append(A,m),Hs(A,r,$+":drawer-width"),Hs(m,r,$+":test-drawer-width");let xi=!1;const mt=t.rightDrawer??{isOpen:()=>xi,setOpen:y=>{xi=y}};let ie="business",We=!1,nt=[],_="overview",it=[],ht="",bt=[],Te="@overview",Cn,Ht=innerWidth>800,Ai=!1,Ei=!0,gt=!1,Xn;const yt=new Map,xt=new Map([["overview",I]]),lt=new Map,wn=new Map,kn=new Map,ze=new Map,an=new Map,At=new Set,Ke=new Set,In=new Set,Xe=new Map;let Ee;try{if(Ee=JSON.parse(sessionStorage.getItem($)||"null"),Ee){if(gt=Ee.overviewClosed===!0,Xn=typeof Ee.documentKey=="string"?Ee.documentKey:void 0,Ht=typeof Ee.left=="boolean"?Ee.left:Ht,Array.isArray(Ee.expanded)){Ke.clear();for(const y of Ee.expanded)typeof y=="string"&&Ke.add(y)}it=Array.isArray(Ee.states)?Ee.states.filter(y=>typeof y=="string"):[],t.rightDrawer||(typeof Ee.rightOpen=="boolean"?xi=Ee.rightOpen:typeof Ee.right?.["concept:"+Ee.active]=="boolean"&&(xi=Ee.right["concept:"+Ee.active]))}}catch{}function Ra(){if(!(!Ee||Xn!==t.business().key||!We)){for(const y of Array.isArray(Ee.overviewModes)?Ee.overviewModes:[])J(y)&&At.add(y);for(const[y,w]of Object.entries(Ee.lastExamples??Ee.examples??{}))typeof w=="string"&&ne(y,w)&&an.set(y,w);for(const[y,w]of Object.entries(Ee.examples??{}))typeof w=="string"&&ne(y,w)&&ze.set(y,w);for(const[y,w]of Object.entries(Ee.selected??{}))typeof w=="string"&&te.includes(w)&&lt.set(y,w);nt=[...new Set((Array.isArray(Ee.concepts)?Ee.concepts:[]).filter(y=>typeof y=="string"&&ue.includes(y)))],_=nt.includes(Ee.active)?Ee.active:"landscape"}}let Sn;const He=()=>{try{sessionStorage.setItem($,JSON.stringify({documentKey:Cn,overviewClosed:gt,selected:Object.fromEntries(lt),examples:Object.fromEntries(ze),lastExamples:Object.fromEntries(an),overviewModes:[...At],left:Ht,expandedVersion:4,expanded:[...Ke],concepts:nt,active:_,states:it,specs:bt,activeSpec:Te,specExamples:Object.fromEntries(yt),...t.rightDrawer?{}:{rightOpen:mt.isOpen()}}))}catch{}},cn=()=>{ie==="concept"&&Xe.set("drawer:"+_,A.querySelector(".concept-drawer-body").scrollTop),ie==="concept"&&mt.isOpen()&&At.has(_)&&Xe.set("review-overview:"+_,A.querySelector(".data-review-overview").scrollTop),ie==="concept"&&ze.has(_)&&Xe.set("example:"+_+":"+ze.get(_),A.querySelector(".data-examples-panel").scrollTop),ie==="states"&&ht&&Xe.set("state:"+ht,M.scrollTop),ie==="tests"&&Xe.set("tests:"+Te,h.querySelector(".test-spec-page").scrollTop),ie==="concept"&&_==="landscape"&&Xe.set("concept:landscape",g.querySelector(".concept-review-landscape").scrollTop)};function Ze(y=!0){if(Ai)return;const w=new URL(location.href);if(w.searchParams.set("view",ie),w.searchParams.delete("concept"),w.searchParams.delete("dataExample"),w.searchParams.delete("dataView"),ie==="concept"&&mt.isOpen()&&At.has(_)?w.searchParams.set("dataView","overview"):ie==="concept"&&J(_)&&!ze.has(_)&&w.searchParams.set("dataView","structure"),ie==="concept"&&mt.isOpen()&&ze.has(_)&&w.searchParams.set("dataExample",ze.get(_)),ie==="tests"&&yt.has(Te)&&w.searchParams.set("dataExample",yt.get(Te)),w.searchParams.delete("state"),w.searchParams.delete("activity"),w.searchParams.delete("object"),w.searchParams.delete("spec"),ie==="concept"&&w.searchParams.set("concept",_),ie==="states"&&ht&&w.searchParams.set("state",ht),ie==="tests"&&w.searchParams.set("spec",Te),ie==="business"){const j=t.business(),E=j.views?.find(W=>W.key===j.viewKey);E?.activity?w.searchParams.set("activity",E.activity):E?.object&&w.searchParams.set("object",E.object)}w.href!==location.href&&history[y?"pushState":"replaceState"]({alderShell:!0},"",w)}function Me(y,w,j){const E=document.createElement(w);return E.textContent=j,y.append(E),E}function vt(y){y!==ie&&(ie==="business"?t.capture():cn(),ie=y),n.hidden=ie!=="business",g.hidden=ie!=="concept",a.hidden=ie!=="states",h.hidden=ie!=="tests",p.hidden=ie!=="empty",e.dataset.workspaceArea=ie,ie==="business"&&t.refresh(),Ot(),wt()}function Lt(y,w=!0){We&&(y==="subsystems"&&(y="landscape"),ue.includes(y)&&(cn(),nt.includes(y)||nt.push(y),_=y,vt("concept"),Io(),Et(),He(),w&&Ze()))}function La(){cn(),ze.delete(_),At.add(_),Io(),A.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer-overview:"+_)??0,He(),Ze()}function Na(y,w=!0){if(y&&!ne(_,y))return;const j=!ze.has(_),E=A.querySelector(".concept-drawer-body");j&&Xe.set("drawer-overview:"+_,E.scrollTop),cn(),At.delete(_),y?(ze.set(_,y),an.set(_,y)):ze.delete(_),mt.setOpen(!0),Io(),j&&(E.scrollTop=0),He(),Ze(),w&&A.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}A.querySelector(".concept-example-back").onclick=()=>{La(),A.querySelector(".data-review-overview").focus({preventScroll:!0})};function Dn(y,w=!0){t.business().states?.some(j=>j.id===y)&&(cn(),it.includes(y)||it.push(y),ht=y,vt("states"),Va(),Et(),He(),w&&Ze())}function bo(y){return y.startsWith("decision:")&&Ae(y)&&!Ae(y)?.capability.testSpecification?Ae(y).key:Ae(y)||y==="@overview"||y==="@unassigned"||y.startsWith("checks:")&&Ge(y.slice(7))||y.startsWith("remaining:")&&rn(y.slice(10))?y:t.business().activities.some(w=>w.id===y)?re().find(w=>w.activityId===y)?.key??(Ge(y)?"checks:"+y:"@overview"):"@overview"}function Nt(y,w=!0){const j=t.business();if(!j.design?.model||!j.key)return;y=bo(y),ie==="tests"&&y!==Te&&cn(),bt.includes(y)||bt.push(y),Te=y;const E=Ae(y);Ai||(E?.capability.testSpecification?Ke.add("tests-function-"+E.key):E?.activityId?Ke.add("tests-activity-"+E.activityId):y.startsWith("checks:")?Ke.add("tests-activity-"+y.slice(7)):y.startsWith("remaining:")?Ke.add("tests-activity-"+y.slice(10)):E&&Ke.add("tests-other")),vt("tests"),go(),Et(),wt(),He(),w&&Ze()}function go(){const y=t.business().design;if(!y?.model)return;const w=h.querySelector(".test-spec-page"),j=Ae(Te);if(j){const E=document.createElement("section");E.className="test-spec-sample";const W=ee?.findGroup(j.groupId),K=j.samples.find(fe=>fe.id===yt.get(Te))??j.samples[0],B=!!j.capability.testSpecification,X=Te.startsWith("decision:");if(B)if(Me(E,"h2",j.name),Me(E,"h3",X?"可否判定":"処理結果"),X)j.decisionExampleIds.length?E.append(Td(y,j.decisionExampleIds,ke())):j.decisionCheckIds.length?E.append(qd(y,j.decisionCheckIds,ke())):Me(E,"p","可否条件の記載はありません。");else{const fe=W&&K&&V?new Set(j.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(E.append($d(y,j.resultCheckIds,ke(),fe)),W&&K&&V){Me(E,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",E.append(Le),V.renderDataExample(Le,W,K.id,Fe=>{Xe.set("tests:"+Te,w.scrollTop),yt.set(Te,Fe),go(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:j.capability.id,sampleIds:j.samples.map(Fe=>Fe.id),hideCapability:!0,hideSinglePicker:!0})}}else if(W&&K&&V){const fe=document.createElement("div");fe.className="data-examples-panel test-spec-examples",E.append(fe),V.renderDataExample(fe,W,K.id,Le=>{Xe.set("tests:"+Te,w.scrollTop),yt.set(Te,Le),go(),He(),Ze(),h.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:j.capability.id,heading:j.name,sampleIds:j.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(Ld(y,K.checkIds??[],ke()))})}w.replaceChildren(E)}else if(Te==="@overview")w.replaceChildren(),Me(w,"p","左のメニューからテスト仕様を選択してください。");else if(Te.startsWith("remaining:")){const E=Te.slice(10);w.replaceChildren(Xs(y,E,ke(),Gt(E),vn(E)))}else w.replaceChildren(Xs(y,Te.startsWith("checks:")?Te.slice(7):void 0,ke()));qa(j),w.scrollTop=Xe.get("tests:"+Te)??0}function Zn(y){y||(gt=!1),vt("business"),y?t.openActivity(y):(gt=!1,t.openOverview()),wt(),Et(),Ze()}function Pa(y){vt("business"),t.openObject(y),wt(),Et(),Ze()}function Ls(y){const w=t.business(),j=w.design?.model;return j?[...new Set(j.states.filter(E=>E.objectId===y&&E.basedOn.documentId===j.business.id&&E.basedOn.revision===j.business.revision).flatMap(E=>E.transitions.map(W=>W.activityId)))]:[...new Set((w.design?.objectStateTransitions?.[y]?.model?.transitions??[]).flatMap(E=>E.activityId?[E.activityId]:[]))]}function Ns(y){return(t.business().states??[]).filter(w=>Ls(w.id).includes(y))}function Ps(y){const w=t.business(),j=w.design?.model,E=R?.model.concepts.find(W=>W.id===y);return!j||!R||!E?[]:(w.states??[]).filter(W=>E.businessObjectIds.includes(W.id)&&j.states.some(K=>K.objectId===W.id&&K.basedOn.documentId===j.business.id&&K.basedOn.revision===j.business.revision&&R.model.relatedStates.some(B=>B.documentId===K.id&&B.revision===K.revision)))}function yo(y,w,j="状態遷移"){if(!w.length)return;const E=document.createElement("section");E.className="shell-related-links",Me(E,"h3",j);for(const W of w){const K=Jt(E,W.name,()=>Dn(W.id));K.dataset.relatedState=W.id}y.append(E)}function Ts(y){const w=R?.model.reviewGroups.find(E=>E.id===y.groupId);if(!w)return[];const j=new Set(w.graph.nodes.map(E=>E.conceptId));return[...new Set(y.samples.flatMap(E=>E.blocks.map(W=>W.card)))].filter(E=>j.has(E)&&R?.model.concepts.some(W=>W.id===E))}function Jt(y,w,j){const E=document.createElement("button");return E.type="button",E.className="shell-evidence",Me(E,"span",w),E.onclick=j,y.append(E),E}function vo(y,w){const j=w.filter(W=>W.capability.testSpecification);if(!j.length)return;const E=document.createElement("section");E.className="shell-test-links",Me(E,"h3","テスト仕様書");for(const W of j)for(const[K,B]of[["decision:","可否判定"],["","処理結果"]]){const X=K+W.key,fe=Jt(E,Ve(W)+"・"+B,()=>Nt(X));fe.dataset.relatedSpec=X}y.append(E)}function Ta(y,w){const j=re().filter(X=>X.activityId===w&&X.capability.testSpecification),E=R?.model.presentation.activityViews,W=Array.isArray(E)?E.find(X=>X&&typeof X=="object"&&X.activityId===w):void 0,K=Array.isArray(W?.uncreatedTestSections)?W.uncreatedTestSections:[],B=y.querySelectorAll("[data-business-result],[data-business-exception]");for(const X of Array.from(B)){const fe=X.dataset.businessException,Le=fe?"exception":"result",Fe=fe??"result",Be=j.flatMap(ot=>ot.businessSections.filter(Pt=>Pt.kind===Le&&(Le==="result"||Pt.exceptionId===fe)).flatMap(Pt=>Pt.pages.filter(H=>H==="decision"?ot.decisionCheckIds.length||ot.decisionExampleIds.length:ot.resultCheckIds.length||ot.samples.length).map(H=>({target:ot,page:H})))),jt=document.createElement("section");jt.className="shell-section-links",jt.setAttribute("aria-label","テスト仕様書"),X.dataset.resultScope==="activity"&&Me(jt,"p",(Be.length?"Activity全体との対応です。":"")+"各Resultとの対応は未確認です。");const ut=new Set;for(const{target:ot,page:Pt}of Be){const H=(Pt==="decision"?"decision:":"")+ot.key;if(ut.has(H))continue;ut.add(H);const Ce=Jt(jt,Ve(ot)+"・"+(Pt==="decision"?"可否判定":"処理結果"),()=>Nt(H));Ce.dataset.relatedSpec=H}if(!ut.size){const ot=Me(jt,"p",K.includes(Fe)?"テスト仕様書未作成":"テスト仕様書との対応未確認");ot.className="shell-spec-warning"}X.after(jt)}vo(y,j.filter(X=>!X.businessSections.length))}function qa(y){const w=m.querySelector(".spec-related-content");if(w.replaceChildren(),!y?.capability.testSpecification)return;const j=t.business().activities.find(K=>K.id===y.activityId),E=ee?.findGroup(y.groupId);if(j){Me(w,"h3","Activity");const K=Jt(w,j.name,()=>Zn(j.id));K.dataset.relatedActivity=j.id}if(E){Me(w,"h3","概念モデル");const K=Jt(w,E.name,()=>Lt(N(E.id)));K.dataset.relatedGroup=E.id}const W=Ts(y);if(W.length){Me(w,"h3","概念");for(const K of W){const B=R.model.concepts.find(fe=>fe.id===K),X=Jt(w,B.name,()=>Lt(F(K)));X.dataset.relatedConcept=K}}y.activityId&&yo(w,Ns(y.activityId),"状態遷移（同じ Activity）")}function $a(y,w){Me(y,"h3","Activity");const j=t.business(),E=J(_),W=R?.model.concepts.find(B=>B.id===w),K=E?.concepts[w]?.sourceActivities??E?.activities??W?.activityLinks.filter(B=>B.uses.includes("生成")).map(B=>B.activityId)??[];for(const B of K){const X=j.activities.find(Le=>Le.id===B);if(!X)continue;const fe=document.createElement("button");fe.className="shell-evidence",Me(fe,"span",X.name),fe.title=X.name+"を業務タブで開く",fe.setAttribute("aria-label",fe.title),fe.onclick=()=>Zn(X.id),y.append(fe)}}function wo(y){const w=J(y);return w?ee?.graph(w.id):y==="overview"?ee?.overviewGraph():void 0}function qs(y){const w=wn.get(_),j=w?wo(_)?.tables[w]:void 0;return j?.conceptId===y?j:void 0}function Wa(y,w){const j=qs(w)??J(_)?.concepts[w]??{...ae[w],sources:void 0};y.replaceChildren(),Me(y,"p",j.note),Me(y,"h3","持つ情報");const E=document.createElement("ul");for(const[,W]of j.fields)Me(E,"li",W);if(y.append(E),j.sources?.length){Me(y,"h3","情報の出所・対象時点");const W=document.createElement("ul");for(const K of j.sources)Me(W,"li",K);y.append(W)}$a(y,w),vo(y,re().filter(W=>Ts(W).includes(w))),yo(y,Ps(w))}function ko(y){const w=A.querySelector(".shell-heading strong");w.textContent=y,A.setAttribute("aria-label",y)}function $s(y=!1){J(_)&&(lt.delete(_),wn.delete(_),kn.delete(_),y||xt.get(_)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},L),Oi(),Ot(),A.querySelector(".concept-drawer-body").scrollTop=0,He())}A.querySelector(".concept-selection-clear").onclick=()=>{$s(),ze.has(_)?A.querySelector(".concept-example-back").focus({preventScroll:!0}):A.querySelector(".data-review-overview").focus({preventScroll:!0})};function Oi(){const y=A.querySelector(".concept-related-content");A.querySelector(".concept-selection").hidden=!!J(_)&&!lt.has(_)&&!kn.has(_),A.querySelector(".concept-selection>h2").hidden=!J(_),A.querySelector(".concept-selection-clear").hidden=!J(_);const w=kn.get(_);if(w&&Z){const K=Z.describe(y,{kind:"group",id:w});ko(K);return}if(_==="landscape"&&Sn){y.replaceChildren();for(const[K,B]of Z.sections){Me(y,"h3",K);const X=document.createElement("ul");for(const fe of B)Me(X,"li",fe);y.append(X)}ko("サブシステムの情報");return}const j=lt.get(_),E=J(_),W=We&&j?qs(j)?.name??E?.concepts[j]?.name??ae[j].name:E?.name??"データ構造の情報";ko(W),We&&j?Wa(y,j):(y.replaceChildren(),E||Me(y,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function Ws(y){y.onload=()=>{zs(),y.contentDocument&&(Bs(y.contentDocument),Gs(y.contentDocument));const w=y.dataset.conceptView??"overview";if(!ee||!R)return;const j=J(w),E=j?ee.graph(j.id):w==="overview"?ee.overviewGraph():{ids:te,edges:ee.edges,tables:ae};y.contentWindow?.postMessage({type:"alder-concept-data",graph:E,focus:ce.get(w),viewKey:w,documentKey:Cn??R.model.id,clearSelectionOnBackground:!!j},L);const W=lt.get(w);W&&y.contentWindow?.postMessage({type:"alder-concept-highlight",id:W},L)}}Ws(I),I.dataset.conceptView="overview";function za(){A.querySelector(".concept-page-details").hidden=!0,A.querySelector(".concept-example-back").hidden=!0;const y=A.querySelector(".data-review-overview");y.hidden=!0,y.replaceChildren();const w=A.querySelector(".data-examples-panel");w.hidden=!0,w.replaceChildren(),delete w.dataset.dataExample,Sn?.root.remove(),Sn=void 0;for(const[j,E]of xt)j!=="overview"&&(E.remove(),xt.delete(j));I.removeAttribute("src"),I.removeAttribute("srcdoc"),lt.clear(),wn.clear(),kn.clear()}function Io(){g.setAttribute("aria-label",_==="landscape"||J(_)?"サブシステム":"データ構造"),g.querySelector(".concept-empty").hidden=We;const y=g.querySelector(".concept-review-landscape"),w=J(_),j=A.querySelector(".concept-page-details"),E=A.querySelector(".data-review-overview"),W=A.querySelector(".data-examples-panel");if(j.hidden=!We||!w,E.hidden=!We||!w||ze.has(_),W.hidden=!We||!w||!ze.has(_),A.querySelector(".concept-example-back").hidden=W.hidden,We&&w){const B=re();Rc(E,w,V,(fe,Le)=>{const Fe=Zs(B,w.id,fe,Le);if(Fe)return{kind:Fe.kind,open:()=>{const Be=Zs(re(),w.id,fe,Le);Be&&(Be.sampleId?yt.set(Be.key,Be.sampleId):yt.delete(Be.key),Nt(Be.key))}}},fe=>Zn(fe),t.business().activities),vo(E,B.filter(fe=>fe.groupId===w.id));const X=ze.get(_)??an.get(_)??je(_)[0]?.id;X&&V.renderDataExample(W,w,X,fe=>Na(fe)),E.scrollTop=Xe.get("review-overview:"+_)??0,W.scrollTop=Xe.get("example:"+_+":"+X)??0}if(y.hidden=!We||!Ln.includes(_),We&&Ln.includes(_)&&(_==="landscape"&&!Sn&&(Sn=$c(document,R,Cn??R.model.id,B=>Lt(N(B)))),Mc(y,Sn?.root,_==="overview"?"graph":"overview"),_==="landscape"&&Sn?.restore()),We&&_!=="landscape"&&!xt.has(_)){const B=document.createElement("iframe");B.className="concept-frame",B.dataset.conceptView=_,B.title=w?w.name+"のデータ構造":ae[ce.get(_)].name+"と隣接する概念",B.hidden=!0,xt.set(_,B);const X=ce.get(_);X&&lt.set(_,lt.get(_)??X),Ws(B),g.querySelector(".concept-main").append(B)}for(const[B,X]of xt)X.hidden=!We||B!==_,We&&B===_&&!X.hasAttribute("src")&&!X.hasAttribute("srcdoc")&&(C?X.srcdoc=C:X.src=new URL("concept.html?view=overview"+(J(B)?"&group="+encodeURIComponent(J(B).id):B==="overview"?"":"&focus="+encodeURIComponent(ce.get(B))),document.baseURI).href);const K=lt.get(_);K&&xt.get(_)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:K},L),Oi(),Ot(),A.querySelector(".concept-drawer-body").scrollTop=Xe.get("drawer:"+_)??0}function Mn(){const y=t.business(),w=y.views?.find(j=>j.activity!==void 0||j.object!==void 0||!gt);w?(vt("business"),t.activateView(w.key)):nt.length?Lt(nt.at(-1),!1):it.length?Dn(it.at(-1),!1):bt.length?Nt(bt.at(-1),!1):vt("empty")}function Ua(){if(gt=!0,ie==="business"){const y=t.business().views?.find(w=>w.key===t.business().viewKey);!y?.activity&&!y?.object&&Mn()}Et(),wt(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function Va(){M.replaceChildren();const y=t.business().states?.find(X=>X.id===ht);if(!y)return;const w=t.statePanel(y.id);w?M.append(w):Me(M,"p","この対象の状態遷移は未定義です。");const j=m.querySelector(".spec-related-content");j.replaceChildren();const E=Ls(y.id),W=t.business().activities.filter(X=>E.includes(X.id));if(W.length){Me(j,"h3","Activity");for(const X of W){const fe=Jt(j,X.name,()=>Zn(X.id));fe.dataset.relatedActivity=X.id}}const K=R?.model.concepts.filter(X=>Ps(X.id).some(fe=>fe.id===y.id))??[];if(K.length){Me(j,"h3","概念");for(const X of K){const fe=Jt(j,X.name,()=>Lt(F(X.id)));fe.dataset.relatedConcept=X.id}}const B=re().filter(X=>X.activityId&&E.includes(X.activityId)&&X.capability.testSpecification);if(B.length){Me(j,"h3","Activity に関連するテスト仕様書");for(const X of B)for(const[fe,Le]of[["decision:","可否判定"],["","処理結果"]]){const Fe=fe+X.key,Be=Jt(j,Ve(X)+"・"+Le,()=>Nt(Fe));Be.dataset.relatedSpec=Fe}}M.scrollTop=Xe.get("state:"+ht)??0}let So="";function Et(){for(const E of Array.from(o.querySelectorAll(".tab"))){const W=t.business().views?.find(B=>B.key===E.dataset.key);E.hidden=gt&&W?.activity===void 0&&W?.object===void 0;const K=!E.hidden&&ie==="business"&&E.dataset.key===t.business().viewKey;E.classList.toggle("active",K),E.querySelector("button")?.setAttribute("aria-current",String(K))}const y=(E,W,K)=>{E.replaceChildren();for(const B of W){const X=K==="concept"?Pe(B):t.business().states?.find(ut=>ut.id===B)?.name??B,fe=ie===K&&B===(K==="concept"?_:ht),Le=document.createElement("div");Le.className="tab"+(fe?" active":"");const Fe=K==="concept"&&(B==="landscape"||J(B))?"subsystems":K;Le.dataset.viewKind=Fe;const Be=document.createElement("button");Be.id=(K==="concept"?"concept-tab-":"state-tab-")+B,Po(Be,Fe,X),Be.setAttribute("aria-current",String(fe)),Be.onclick=()=>K==="concept"?Lt(B):Dn(B),Le.append(Be);const jt=To((Fe==="subsystems"?"サブシステム：":K==="concept"?"データ構造：":"状態遷移：")+X+"のタブを閉じる");jt.onclick=()=>{cn(),K==="concept"?(nt=nt.filter(ut=>ut!==B),B!=="overview"&&(xt.get(B)?.remove(),xt.delete(B)),lt.delete(B),wn.delete(B),kn.delete(B),ze.delete(B),an.delete(B),At.delete(B),ie===K&&_===B&&(nt.length?Lt(nt.at(-1),!1):Mn())):(it=it.filter(ut=>ut!==B),ie===K&&ht===B&&(it.length?Dn(it.at(-1),!1):Mn())),Et(),wt(),He(),Ze(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(jt),E.append(Le)}};y(u,nt,"concept"),y(l,it,"states"),f.replaceChildren();for(const E of bt){const W=Ma(E),K=document.createElement("div");K.className="tab"+(ie==="tests"&&E===Te?" active":""),K.dataset.viewKind="tests";const B=document.createElement("button");B.id="spec-tab-"+E,Po(B,"tests",W),B.setAttribute("aria-current",String(ie==="tests"&&E===Te)),B.onclick=()=>Nt(E);const X=To("テスト仕様："+W+"のタブを閉じる");X.onclick=()=>{bt=bt.filter(fe=>fe!==E),ie==="tests"&&Te===E&&(bt.length?Nt(bt.at(-1),!1):Mn()),Et(),wt(),He(),Ze()},K.append(B,X),f.append(K)}const w=c.querySelector(".tab.active:not([hidden])"),j=ie==="business"?"business:"+t.business().viewKey:ie==="concept"?"concept:"+_:ie==="states"?"states:"+ht:ie==="tests"?"tests:"+Te:"";w?(j!==So&&Oc(c,w),So=j):So=""}function Fa(){innerWidth<=800&&ji(!1)}function wt(){const y=x.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,w=x.scrollTop,j=t.business(),E=D.value.trim().toLocaleLowerCase();x.replaceChildren();const W=(H,Ce,st)=>({kind:"item",id:H,name:Ce,key:st}),K=(H,Ce,st)=>({kind:"group",id:H,name:Ce,children:st}),B=re(),X=H=>W(H.key,H.name,"tests:"+H.key),fe=B.filter(H=>H.capability.testSpecification),Le=B.filter(H=>!H.capability.testSpecification),Fe=fe.map(H=>K("tests-function-"+H.key,Ve(H),[W("decision:"+H.key,"可否判定","tests:decision:"+H.key),W(H.key,"処理結果","tests:"+H.key)]));for(const H of j.activities){const Ce=Le.filter(tt=>tt.activityId===H.id).map(X),st=(Gt(H.id).size?"remaining:":"checks:")+H.id;rn(H.id)&&Ce.push(W(st,"その他","tests:"+st)),Ce.length&&Fe.push(K("tests-activity-"+H.id,H.name,Ce))}const Be=Le.filter(H=>!H.activityId);Be.length&&Fe.push(K("tests-other","その他",Be.map(X))),Da()&&Fe.push(W("@unassigned","未割当","tests:@unassigned"));const jt=[{id:"business",label:"業務設計",items:[W("overview","全体図","business:overview"),K("business-activity","Activity",j.activities.map(H=>W(H.id,H.name,"business:"+H.id))),K("business-object","Object",(j.objects??[]).map(H=>W(H.id,H.name,"object:"+H.id)))]},{id:"states",label:"状態遷移",items:(j.states??[]).map(H=>W(H.id,H.name,"states:"+H.id))},{id:"subsystems",label:"サブシステム",items:R?.model.subsystems.length?[W("landscape","全体図","concept:landscape"),...R.model.subsystems.map(H=>K("subsystem-"+H.id,H.name.replace(/サブシステム$/,""),R.model.reviewGroups.filter(Ce=>Ce.subsystemId===H.id).map(Ce=>W(N(Ce.id),Ce.title,"concept:"+N(Ce.id)))))]:[]},{id:"concept",label:"データ構造",items:We&&te.length?[W("overview","全体図","concept:overview"),K("concept-relations","概念",te.map(H=>W(F(H),ae[H].name,"concept:"+F(H))))]:[]},{id:"tests",label:"テスト仕様",items:j.design?.model&&(B.length||ke().length)?Fe:[]}];let ut=0;const ot=(H,Ce,st)=>{const tt=document.createElement("button");tt.className="explorer-item"+(st?" explorer-item-nested":""),tt.dataset.explorerKey=H.key,tt.textContent=H.name;const Ye=j.views?.find(Je=>Je.key===j.viewKey);return ie===(Ce.id==="subsystems"?"concept":Ce.id)&&(["concept","subsystems"].includes(Ce.id)?H.id===_:Ce.id==="states"?H.id===ht:Ce.id==="tests"?H.id===Te:H.key.startsWith("object:")?Ye?.object===H.id:H.id==="overview"?!gt&&Ye?.activity===void 0&&Ye?.object===void 0:Ye?.activity===H.id)&&tt.setAttribute("aria-current","page"),tt.disabled=Ce.id==="business"&&!j.key,tt.onclick=()=>{b.hidden||t.closeLegacyList(),Ce.id==="business"?H.key.startsWith("object:")?Pa(H.id):Zn(H.id==="overview"?void 0:H.id):Ce.id==="concept"||Ce.id==="subsystems"?Lt(H.id):Ce.id==="tests"?Nt(H.id):Dn(H.id),Fa()},tt},Pt=(H,Ce,st,tt=!1)=>{const Ye=document.createElement("button"),Tt=E?!In.has(H):Ke.has(H);return Ye.className=(st?"explorer-subparent":"explorer-parent")+(tt?" explorer-pending":""),Ye.dataset.explorerKey="group:"+H,Me(Ye,"span",Ce).className="explorer-parent-label",tt?(Ye.disabled=!0,Ye):(Ye.setAttribute("aria-expanded",String(Tt)),Ye.setAttribute("aria-controls","explorer-"+H),Ye.append(Ac(Tt)),Ye.onclick=()=>{E?In.has(H)?In.delete(H):In.add(H):(Ke.has(H)?Ke.delete(H):Ke.add(H),He()),wt()},Ye)};for(const H of jt){const Ce=H.items.flatMap(Je=>{if(Je.kind==="item")return!E||(H.label+" "+Je.name).toLocaleLowerCase().includes(E)?[Je]:[];const dn=E?Je.children.filter(Ao=>(H.label+" "+Je.name+" "+Ao.name).toLocaleLowerCase().includes(E)):Je.children;return!E||dn.length?[{...Je,children:dn}]:[]});if(E&&!Ce.length)continue;const st=H.id!=="business"&&!H.items.length,tt=document.createElement("section"),Ye=Pt(H.id,H.label,!1,st),Tt=document.createElement("div");Tt.id="explorer-"+H.id,Tt.hidden=st||(E?In.has(H.id):!Ke.has(H.id));for(const Je of Ce){if(Je.kind==="item"){Tt.append(ot(Je,H,0)),ut++;continue}const dn=document.createElement("div");dn.id="explorer-"+Je.id,dn.hidden=E?In.has(Je.id):!Ke.has(Je.id),Tt.append(Pt(Je.id,Je.name,!0),dn);for(const Ao of Je.children)dn.append(ot(Ao,H,1)),ut++;!Je.children.length&&!E&&(Me(dn,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ce.length&&!st&&(Me(Tt,"p","項目がありません。").className="explorer-empty"),tt.append(Ye,Tt),x.append(tt)}E&&!ut&&(Me(x,"p","該当する項目はありません。").className="explorer-empty"),x.scrollTop=w,y&&Array.from(x.querySelectorAll("[data-explorer-key]")).find(H=>H.dataset.explorerKey===y)?.focus({preventScroll:!0})}function ji(y){Ht=y,Ot(),He(),(y?s.querySelector(".shell-heading button"):S).focus({preventScroll:!0})}S.addEventListener("click",y=>{y.preventDefault(),y.stopImmediatePropagation(),ji(!Ht)},!0),s.querySelector(".shell-heading button").onclick=()=>ji(!1),D.oninput=()=>{In.clear(),wt()},s.addEventListener("keydown",y=>{if(y.key==="Escape"&&!y.defaultPrevented&&b.hidden&&(y.preventDefault(),y.stopPropagation(),ji(!1)),(y.key==="ArrowDown"||y.key==="ArrowUp")&&x.contains(document.activeElement)){const w=Array.from(x.querySelectorAll("button")).filter(W=>!W.disabled&&!W.closest("[hidden]")),j=w.indexOf(document.activeElement),E=w[j+(y.key==="ArrowDown"?1:-1)];E&&(y.preventDefault(),E.focus())}}),v.addEventListener("click",y=>{ie!=="business"&&(y.preventDefault(),y.stopImmediatePropagation(),(ie==="concept"||ie==="states"||ie==="tests"&&Ae(Te)?.capability.testSpecification)&&(mt.setOpen(!mt.isOpen()),Ot(),He(),Ze(!1)))},!0),A.querySelector(".shell-heading button").onclick=()=>{mt.setOpen(!1),Ot(),He(),Ze(!1),v.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{mt.setOpen(!1),Ot(),He(),Ze(!1),v.focus({preventScroll:!0})},window.addEventListener("message",y=>{if(y.origin!==location.origin&&!(location.protocol==="file:"&&y.origin==="null"))return;const w=Array.from(xt).find(([,E])=>y.source===E.contentWindow);if(!w)return;if(y.data?.type==="alder-concept-rendered"){w[1].contentDocument&&(Bs(w[1].contentDocument),Gs(w[1].contentDocument));return}if(ie!=="concept"||w[0]!==_)return;const j=J(_);if(y.data?.type==="alder-concept-clear-selection"){j&&$s(!0);return}if(y.data?.type==="alder-concept-subsystem"){if(!wo(_)?.regions.some(E=>E.id===y.data.id))return;lt.delete(_),wn.delete(_),kn.set(_,y.data.id),Oi(),Ot(),He();return}if(!(!te.includes(y.data?.id)||j&&!j.concepts[y.data?.id])){if(y.data.type==="alder-concept-open"){Lt(F(y.data.id));return}y.data.type==="alder-concept-select"&&(kn.delete(_),lt.set(_,y.data.id),(typeof y.data.viewId=="string"?wo(_)?.tables[y.data.viewId]:void 0)?.conceptId===y.data.id?wn.set(_,y.data.viewId):wn.delete(_),innerWidth<=800&&(Ht=!1),Oi(),Ot(),He())}});function zs(){const y=getComputedStyle(document.documentElement);for(const w of xt.values()){const j=w.contentDocument?.documentElement;if(j){j.dataset.theme=document.documentElement.dataset.theme??"light";for(const E of["--bg","--panel","--fg","--line","--subtle","--select"])j.style.setProperty(E,y.getPropertyValue(E))}}}function Ot(){!b.hidden&&ie==="business"&&(Ht=!0),s.hidden=!Ht,S.disabled=!1,S.setAttribute("aria-controls","design-explorer"),S.setAttribute("aria-label","ナビゲーションを開閉"),S.setAttribute("aria-expanded",String(Ht));const y=mt.isReady?.()??!0;A.hidden=ie!=="concept"||!We||!y||!mt.isOpen();const w=!!Ae(Te)?.capability.testSpecification;m.hidden=!(ie==="states"||ie==="tests"&&w)||!y||!mt.isOpen(),Si&&ie!=="business"&&(Si.hidden=!0),ie==="concept"?(v.disabled=!We||!y,v.setAttribute("aria-controls","concept-related-panel"),v.setAttribute("aria-label","データ構造の情報を開閉"),v.setAttribute("aria-expanded",String(!A.hidden))):ie==="business"?v.setAttribute("aria-controls","formattedMarkdownDrawer"):ie==="states"||ie==="tests"&&w?(v.disabled=!y,v.setAttribute("aria-controls","test-related-panel"),v.setAttribute("aria-label","関連資料を開閉"),v.setAttribute("aria-expanded",String(!m.hidden))):(ie==="tests"||ie==="empty")&&(v.disabled=!0,v.setAttribute("aria-expanded","false"));const j=i.querySelector("#document-actions");j&&(j.hidden=ie!=="business");const E=i.querySelector("#document-actions-toggle");E&&ie!=="business"&&(E.hidden=!0),zs(),xo()}function xo(){const y=i.getBoundingClientRect().bottom;y>0&&e.style.setProperty("--shell-content-top",y+"px")}if(typeof ResizeObserver<"u"){const y=new ResizeObserver(xo);y.observe(i),y.observe(e.querySelector("header"))}window.addEventListener("resize",xo);function Us(){cn(),Ai=!0;try{const y=new URL(location.href).searchParams;if(ie==="concept"&&y.get("view")==="concept"&&y.get("concept")===_&&!ze.has(_)&&ne(_,y.get("dataExample"))&&Xe.set("drawer-overview:"+_,A.querySelector(".concept-drawer-body").scrollTop),We||(At.clear(),ze.clear(),an.clear(),nt=[],_="overview",I.removeAttribute("src"),I.removeAttribute("srcdoc")),y.get("view")==="concept"){const w=We&&ue.includes(y.get("concept")??"")?y.get("concept"):"landscape",j=y.get("dataExample");We&&J(w)&&y.get("dataView")==="overview"&&!ne(w,j)?(At.add(w),ze.delete(w)):(At.delete(w),We&&ne(w,j)?(ze.set(w,j),an.set(w,j)):ze.delete(w)),Lt(w,!1)}else if(y.get("view")==="states")t.business().states?.some(w=>w.id===y.get("state"))?Dn(y.get("state"),!1):Mn();else if(y.get("view")==="tests"){const w=bo(y.get("spec")??"@overview"),j=y.get("dataExample"),E=Ae(w);E&&j&&E.samples.some(W=>W.id===j)?yt.set(w,j):E&&yt.delete(w),Nt(w,!1)}else if(y.get("view")==="empty")vt("empty");else if(vt("business"),t.business().key){const w=y.get("activity"),j=y.get("object"),E=t.business(),W=E.views?.find(K=>K.key===E.viewKey);w&&E.activities.some(K=>K.id===w)?W?.activity!==w&&t.openActivity(w):j&&E.objects?.some(K=>K.id===j)?W?.object!==j&&t.openObject(j):(gt=!1,(!W||W.activity!==void 0||W.object!==void 0)&&t.openOverview())}Et(),wt()}finally{Ai=!1}}return window.addEventListener("popstate",Us),{closeBusinessOverview:Ua,reopenBusinessOverview(){gt=!1},activateBusiness(){vt("business")},businessActivated(){vt("business"),Et(),wt(),Ze()},syncChrome:Ot,appendActivityTestLinks(y,w){Ta(y,w),yo(y,Ns(w))},openRelatedChecks(y){Ke.add("tests"),Nt(y&&Ge(y)?"checks:"+y:"@overview")},syncDocument(){const y=t.business(),w=y.concept,j=!!(Cn&&y.key!==Cn||Ei&&Xn&&y.key&&y.key!==Xn),E=R?.model!==w?.model||R?.business!==w?.business;if((j||E&&R)&&(h.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),A.querySelector(".concept-related-content").replaceChildren(),gt=!1,nt=[],it=[],bt=[],_="overview",ht="",Te="@overview",yt.clear(),Xe.clear(),At.clear(),ze.clear(),an.clear(),za(),ie!=="business"&&vt("business"),j&&!Ei&&Ze(!1)),E){R=w,ee=w?Cc(w):void 0,V=w?zc(w):void 0,Z=w?Lc(w):void 0,We=!!w,ae=ee?.tables??{},te=Object.keys(ae);const W=ee?.groups.map(B=>B.id)??[],K=new Set([...Ln,"subsystems"]);if(ge=new Map(W.map(B=>[B,K.has(B)||te.includes(B)?"group:"+B:B])),Ie=new Map(te.map(B=>[B,K.has(B)||W.includes(B)?"concept:"+B:B])),he=new Map([...ge].map(([B,X])=>[X,B])),ce=new Map([...Ie].map(([B,X])=>[X,B])),ue=[...Ln,...he.keys(),...ce.keys()],Array.isArray(Ee?.expanded)&&Ee.expandedVersion!==4){Ke.add("subsystems"),Ke.add("concept-relations");for(const B of w?.model.subsystems??[])Ke.add("subsystem-"+B.id)}}if(Cn=y.key,it=it.filter(W=>y.states?.some(K=>K.id===W)),ie==="business"&&gt&&y.views?.find(W=>W.key===y.viewKey)?.activity===void 0&&y.views?.find(W=>W.key===y.viewKey)?.object===void 0&&Mn(),Ei&&y.key){if(Ra(),Xn===y.key){Array.isArray(Ee?.specs)&&(bt=[...new Set(Ee.specs.filter(W=>typeof W=="string").map(W=>bo(W)))]);for(const[W,K]of Object.entries(Ee?.specExamples??{})){const B=Ae(W);typeof K=="string"&&B?.capability.samples.some(X=>X.id===K)&&yt.set(W,K)}}Ei=!1,Us()}wt(),Et(),Ot(),j&&He()}}}class Uo{tabs=new WeakMap;router;constructor(t=Lo){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,r){const s=JSON.stringify([i.map(g=>[g.id,g.width,g.height]),o.map(g=>[g.kind,g.from,g.to,g.label]),r]),d=this.tabs.get(t),c=!d||d.design!==n||d.structure!==s,u=new Set(i.filter(g=>{const a=d?.nodes.get(g.id);return!a||a.x!==g.x||a.y!==g.y}).map(g=>g.id)),l=new Set(i.map(g=>g.id)),f=c?new Array(o.length):d.routes.slice();if(o.forEach((g,a)=>{!c&&!u.has(g.from)&&!u.has(g.to)||(f[a]=l.has(g.from)&&l.has(g.to)?this.router({from:g.from,to:g.to,index:a,nodes:i,kind:g.kind,matrix:r?.[a],labels:r?.[a]?[]:[...f.flatMap((h,m)=>h&&m<a?[{id:String(m),x:h.label[0]-Math.max(30,o[m].label.length*12)/2,y:h.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:r?.[a]?[]:f.flatMap((h,m)=>h&&m<a?[h.points]:[]),labelWidth:Math.max(30,g.label.length*12),labelHeight:18}):void 0)}),r){const g=[],a=new Map,h=f.map((m,p)=>p).sort((m,p)=>Number(r[m].returning)-Number(r[p].returning));for(const m of h){const p=f[m];if(!p)continue;const b=i.find(I=>I.id===o[m].from),S=Math.max(30,o[m].label.length*12),v=r[m].returning?[Math.max(...p.points.map(I=>I[0]))+8+S/2,p.points[0][1]]:[b.x+b.width*.125+8+S/2,Xa(b.y+b.height,r[m].captionLane*Mr)+9],D=Rr(o[m],m,r[m]),x=a.get(D)??No(v,S,18,i,g);(x[0]!==p.label[0]||x[1]!==p.label[1])&&(f[m]={...p,label:x}),a.has(D)||(a.set(D,x),g.push({id:String(m),x:x[0]-S/2,y:x[1]-9,width:S,height:18}))}}return this.tabs.set(t,{design:n,structure:s,nodes:new Map(i.map(g=>[g.id,{...g}])),routes:f}),f}}function Ud(e,t,n,i){const o=(f,g,a)=>(g[0]-f[0])*(a[1]-f[1])-(g[1]-f[1])*(a[0]-f[0]),r=o(e,t,n),s=o(e,t,i),d=o(n,i,e),c=o(n,i,t),u=1e-6;if(r*s<-u&&d*c<-u)return!0;if(Math.max(Math.abs(r),Math.abs(s),Math.abs(d),Math.abs(c))>u)return!1;const l=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[l],t[l]),Math.max(n[l],i[l]))-Math.max(Math.min(e[l],t[l]),Math.min(n[l],i[l]))>.1}function Vd(e,t,n,i,o=[]){const r=e.x+e.width,s=24,d=e.y+e.height,c=r-8-(2*(n.count-n.index)-1)*s,u=t.filter(S=>S.id!==e.id);let l;for(const S of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const D=[c+S,d],x=[D[0]+s,d];if(D[0]<e.x+8||x[0]>r-8)continue;const I=d+n.depth+v,A=Math.min(12,(x[0]-D[0])/2,(I-d)/2),M=[D];let $=`M${D}`;const L=V=>{$+=` L${V}`,M.push(V)},C=(V,Z)=>{const ae=M.at(-1);$+=` Q${V} ${Z}`;for(let te=1;te<=4;te++){const ue=te/4,he=1-ue;M.push([he*he*ae[0]+2*he*ue*V[0]+ue*ue*Z[0],he*he*ae[1]+2*he*ue*V[1]+ue*ue*Z[1]])}};L([D[0],I-A]),C([D[0],I],[D[0]+A,I]),L([x[0]-A,I]),C([x[0],I],[x[0],I-A]),L(x);const R=Za(M,u,.3),ee=o.filter(V=>M.slice(1).some((Z,ae)=>V.slice(1).some((te,ue)=>Ud(M[ae],Z,V[ue],te)))).length;if((!l||R<l.collisions||R===l.collisions&&ee<l.wireCollisions)&&(l={path:$,points:M,collisions:R,wireCollisions:ee,low:I,extra:v,shift:S}),R===0&&ee===0)break}const{path:f,points:g,collisions:a,wireCollisions:h,low:m,extra:p,shift:b}=l;return{path:f,points:g,label:[Math.max(r+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...g.map(S=>S[0])),bottom:Math.max(...g.map(S=>S[1]))},collisions:a+h,rerouted:p>0||b!==0,fallback:a+h>0}}function Fd(e,t=ss()){const n="http://www.w3.org/2000/svg",i=(N,F={})=>{const J=document.createElementNS(n,N);for(const[be,ne]of Object.entries(F))J.setAttribute(be,ne);return J},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},r=e.transitions.map(N=>[N]),s=[...new Set(["@new",...e.states,...r.map(N=>N[0].to)])],d={nodes:s.map(N=>({id:N,type:"business",name:o[N]??N,scope:!0})),relations:r.map(([N])=>({kind:N.path==="exception"?"business-exception":"input",from:N.from,to:N.to,label:N.id+"："+N.activity+"："+N.condition}))},c=cs(d,s),u=N=>{const F=Array.from(N);return Array.from({length:Math.ceil(F.length/28)},(J,be)=>F.slice(be*28,(be+1)*28).join(""))},l=r.map(([N])=>({from:N.from,activity:N.activity,rows:[N],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[N,F]of l.entries()){const J=F.rows[0],be=e.transitions.filter(re=>re.from===J.from&&(re.activityId??re.activity)===(J.activityId??J.activity)&&re.path===J.path&&(J.path!=="exception"||(re.exception??"例外名未定義")===(J.exception??"例外名未定義"))),ne=be.map(re=>(re.conditionLabel??re.condition).trim().replace(/\s+/g," ")),je=new Set(ne).size===be.length?J.conditionLabel??J.condition:J.condition,ke=[J.path==="exception"?"例外："+(J.exception??"例外名未定義"):"",...be.length>1||J.path==="normal"&&J.conditionLabel?[je]:[]].filter(Boolean).join("：");F.lines=u(F.activity+(ke?"（"+ke+"）":"")),F.lineRows=F.lines.map(()=>F.rows),F.width=Math.max(...F.lines.map(re=>Array.from(re).length*14)),F.height=F.lines.length*18,c.wires[N].returning||(F.offset=f.has(F.from)?f.get(F.from)+8:0,f.set(F.from,F.offset+F.height))}const g=new Map;r.forEach(([N],F)=>{if(N.from===N.to){const J=g.get(N.from)??[];J.push(F),g.set(N.from,J)}});const a=new Map,h=new Map;for(const[N,F]of g){let J=0;for(const ne of[...F].reverse())a.set(ne,{leader:F[0],index:0,count:1,depth:0,offset:J}),J+=l[ne].height+8;const be=24+Math.max(0,J-8)+8;h.set(N,be);for(const ne of F)a.get(ne).depth=be}const m=N=>44,p=s.slice().sort((N,F)=>c.positions[N][1]-c.positions[F][1]);let b=Math.max(40,...l.map((N,F)=>c.wires[F].returning&&N.from===p[0]?16+N.height/2-44*(c.wires[F].fromPort??.5):40));const S=new Map;for(const N of p){const F=m(),J=(f.get(N)??0)+(h.get(N)??0);S.set(N,b),b+=Ya(F,J)}const v=s.map(N=>({id:N,x:t.positions.get(N)?.[0]??c.positions[N][0],y:t.positions.get(N)?.[1]??S.get(N),width:Math.max(104,Array.from(o[N]??N).length*14+32),height:m()})),D=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),x=i("title");x.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(s.includes("@none")?"作成なしはこの操作の処理結果。":"")+(s.includes("@unknown")?"未決は設計課題。":""),D.append(x),D.append(rs("state-transition-"));const I=new Map,A=[],M=[];let $=t.selected;const L=N=>{$=N,t.selected=N;const F=Wi(e.transitions,$);for(const[ne,je]of I)je.setAttribute("class","node graph-shape state-shape"+F.nodeClasses(ne)),je.setAttribute("aria-pressed",String(ne===$));A.forEach(({element:ne,rows:je})=>{const Pe=je[0].from===je[0].to;ne.setAttribute("class","edge"+(Pe?" state-self-loop":je[0].path==="exception"?" exception":"")+F.labelClasses(je)),ne.setAttribute("marker-end","url(#state-transition-"+(je.some(F.related)?"related-arrow":"arrow")+")")});for(const ne of M)ne.element.setAttribute("class","state-caption-line"+F.labelClasses(ne.rows));D.querySelectorAll("[data-exception-paint]").forEach(ne=>ne.remove());const J=Array.from(D.children).find(ne=>ne.matches(".state-diagram-edge-label,[data-state]"))??null,be=[...A].sort((ne,je)=>Number(ne.rows.some(F.related))-Number(je.rows.some(F.related)));for(const{element:ne}of be)if(D.insertBefore(ne,J),ne.classList.contains("exception")||ne.classList.contains("state-self-loop")){const je=D.children.length;as(D,ne,{path:ne.getAttribute("d")},{"data-transitions":ne.getAttribute("data-transitions")});for(const Pe of Array.from(D.children).slice(je))D.insertBefore(Pe,J)}D.querySelectorAll(".state-diagram-edge-label").forEach(ne=>D.append(ne))};D.addEventListener("click",N=>{N.target===D&&L()}),D.addEventListener("keydown",N=>{N.key==="Escape"&&(N.preventDefault(),L())});const C=c.wires.map((N,F)=>({...N,captionLane:(l[F].offset+(h.get(l[F].from)??0))/Mr})),R=d.relations.map((N,F)=>({...N,label:String(F).padEnd(Math.ceil(l[F].width/12),"x")})),ee=[...a].map(([N,F])=>{const J=v.find(ne=>ne.id===r[N][0].from),be=l[N];return{x:J.x+J.width+8,y:J.y+J.height+24+F.offset,width:be.width,height:be.height}});let V=new Uo().update({},e,v,R,C);for(let N=0;N<=ee.length;N++){let F=!1,J=0;if(V.forEach((be,ne)=>{if(!be||a.has(ne)||!C[ne].returning)return;let je=0;for(const Pe of ee)for(let ke=1;ke<be.points.length;ke++){const re=be.points[ke-1],Ae=be.points[ke];if(Math.abs(re[0]-Ae[0])>1e-7||Math.abs(re[1]-Ae[1])<2)continue;const Ve=re[0];if(Ve<Pe.x-4||Ve>Pe.x+Pe.width+4||Math.max(re[1],Ae[1])<Pe.y-4||Math.min(re[1],Ae[1])>Pe.y+Pe.height+4)continue;const Ge=Pe.x+Pe.width+12-Ve;Ge>0&&(je=Math.max(je,Ge))}je&&(C[ne]={...C[ne],returnLane:(C[ne].returnLane??0)+Math.ceil(je/16)+J++},F=!0)}),!F)break;V=new Uo().update({},e,v,R,C)}const Z=V.flatMap((N,F)=>N&&!a.has(F)?[N.points]:[]),ae=new Map,te=V.map((N,F)=>{const J=a.get(F);if(!J)return N;const be=r[F][0].from,ne=v.find(Ge=>Ge.id===be),je=V.flatMap((Ge,Gt)=>Ge&&!a.has(Gt)?[Ge.points]:[]),Pe=Math.max(30,R[F].label.length*12),ke=l[F];let re=ae.get(J.leader);re||(re=Vd(ne,v,{...J,labelLeft:ne.x+ne.width+8},Pe,Z),ae.set(J.leader,re),Z.push(re.points));const Ae=je.flatMap((Ge,Gt)=>Ge.slice(1).map((vn,rn)=>({id:`${Gt}:${rn}`,x:Math.min(Ge[rn][0],vn[0])-2,y:Math.min(Ge[rn][1],vn[1])-2,width:Math.abs(Ge[rn][0]-vn[0])+4,height:Math.abs(Ge[rn][1]-vn[1])+4}))),Ve=No([ne.x+ne.width+8+ke.width/2,ne.y+ne.height+24+J.offset+ke.height/2],ke.width,ke.height,[...v,...Ae]);return{...re,label:[Ve[0]-ke.width/2+Pe/2,Ve[1]]}}),ue=new Array(r.length),he=[],ce=r.map((N,F)=>F).sort((N,F)=>Number(C[N].returning)-Number(C[F].returning));for(const N of ce){const F=te[N],J=l[N],be=Math.max(30,R[N].label.length*12);let ne=[F.label[0]-be/2+J.width/2,F.label[1]+(C[N].returning?0:J.height/2-9)];const je=v.find(re=>re.id===r[N][0].from),Pe=v.find(re=>re.id===r[N][0].to);if(!a.has(N)&&C[N].returning&&Pe&&Pe.y>je.y){const re=F.points.slice(1).map((Ae,Ve)=>[F.points[Ve],Ae]).filter(([Ae,Ve])=>Math.abs(Ae[0]-Ve[0])<.01&&Ve[1]-Ae[1]>24).sort(([Ae,Ve],[Ge,Gt])=>Gt[1]-Ge[1]-(Ve[1]-Ae[1]))[0];if(re){const[Ae,Ve]=re;ne=[Ae[0]+8+J.width/2,Ae[1]+Math.min(24+J.height/2,(Ve[1]-Ae[1])/2)]}}const ke=No(ne,J.width,J.height,v,he);ue[N]=ke,he.push({id:String(N),x:ke[0]-J.width/2,y:ke[1]-J.height/2,width:J.width,height:J.height})}let ge=Math.max(...v.map(N=>N.x+N.width))+40,Ie=Math.max(...v.map(N=>N.y+N.height))+40;r.forEach((N,F)=>{const J=a.get(F);if(J&&J.leader!==F)return;const be=J?r.flatMap((re,Ae)=>a.get(Ae)?.leader===F?re:[]):N,ne=be[0],je=te[F],Pe=i("path",{d:je.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":be.map(re=>re.id).join(" ")});(J||ne.path==="exception")&&Pe.setAttribute("stroke-dasharray","6 5");const ke=i("title");ke.textContent=be.map(re=>`${re.id} ${re.activity} / ${re.path==="normal"?"通常":"例外："+(re.exception??"例外名未定義")}：${re.condition}`).join(" / "),Pe.append(ke),D.append(Pe),A.push({element:Pe,rows:be}),ge=Math.max(ge,je.bounds.right+40),Ie=Math.max(Ie,je.bounds.bottom+40)});for(const[N,F]of l.entries()){const J=ue[N],be=J[0]-F.width/2,ne=J[1]-F.height/2+14;D.append(i("rect",{x:String(be),y:String(ne-14),width:String(F.width),height:String(F.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const je=i("text",{x:String(be),y:String(ne),class:"state-diagram-edge-label","data-activity":F.activity,"data-transition-id":F.rows[0].id,"aria-label":F.lines.join("")});F.lines.forEach((Pe,ke)=>{const re=i("tspan",{x:String(be),dy:ke?"18":"0","font-size":"14","font-weight":"600"});re.textContent=Pe,re.setAttribute("data-transitions",F.lineRows[ke].map(Ae=>Ae.id).join(" ")),M.push({element:re,rows:F.lineRows[ke]}),je.append(re)}),D.append(je),ge=Math.max(ge,be+F.width+24),Ie=Math.max(Ie,ne+F.height+24)}for(const N of v){const F=N.id.startsWith("@"),J=i("g",{role:"button",tabindex:"0","aria-label":o[N.id]??N.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":N.id,"data-node":N.id});J.append(Cr(document,N,F)),J.append(i("rect",{x:String(N.x),y:String(N.y),width:String(N.width),height:String(N.height),rx:F?"20":"8",class:F?"state-diagram-node state-note":"state-diagram-node"}));const be=i("text",{x:String(N.x+N.width/2),y:String(N.y+N.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(be.textContent=o[N.id]??N.id,J.append(be),F&&N.id!=="@new"){const ne=i("text",{x:String(N.x+N.width/2),y:String(N.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});ne.textContent=N.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",J.append(ne)}J.addEventListener("click",()=>L(N.id)),J.addEventListener("keydown",ne=>{(ne.key==="Enter"||ne.key===" ")&&(ne.preventDefault(),L(N.id))}),I.set(N.id,J),D.append(J)}return L(t.selected),D.setAttribute("viewBox",`0 0 ${ge} ${Ie}`),D.style.minWidth=`${ge}px`,D}const Ys=new WeakMap;function Bd(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const r=(m,p,b=o)=>{const S=document.createElement(m);return S.textContent=p,b.append(S),S};if(i.error)return r("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const s=i.model;for(const m of s.transitions){if(!e.graph.nodes.some(p=>p.id===m.activity&&p.type==="business"))return r("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const p=e.model?.business.exceptions?.find(b=>b.id===m.exceptionId);if(!p||p.activityId!==m.activity)return r("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=Ys.get(e)??new Map;Ys.set(e,d);const c=d.get(t)??ss();d.set(t,c);const u={...s,transitions:s.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(p=>p.id===m.activity)?.name??m.activity}))};o.append(jr(document,m=>Fd(u,m),c));const l=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},g=document.createElement("details");r("summary",`操作の詳細（${s.transitions.length}）`,g);const a=document.createElement("ol");g.append(a),o.append(g);for(const m of s.transitions){const p=document.createElement("li");p.dataset.transition=m.id,r("h3",`${m.id} · ${l(m.from)} → ${l(m.to)}`,p),m.path==="exception"&&r("p","例外名："+(m.exception??"未定義"),p),r("p",`${f[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,p);const b=e.graph.nodes.find(S=>S.id===m.activity&&S.type==="business");if(b){const S=document.createElement("button");S.type="button",S.textContent=b.name,S.onclick=()=>n(b.id),p.append(S)}else r("p","要確認：根拠Activityが見つかりません — "+m.activity,p);r("p","条件："+m.condition,p),r("p",m.note,p),r("p","根拠："+m.evidence,p),a.append(p)}s.transitions.length||r("p","明示された操作はありません。");const h=document.createElement("details");return r("summary","宣言の出典",h),r("p",s.source,h),o.append(h),o}const Qs=64,Gd=96,Hd=260,er=40,Jd=4;function _d(e,t,n=!0){const{nodes:i,previous:o,children:r,parents:s,forwardRelations:d,feedbackRelations:c,exceptionRelations:u}=Qa(e,t),l=s.map(x=>x.length),f=i.map(()=>0),g=i.flatMap((x,I)=>l[I]===0?[I]:[]);for(let x=0;x<g.length;x++)for(const I of r[g[x]])f[I]=Math.max(f[I],f[g[x]]+1),--l[I]===0&&g.push(I);const a=Array.from({length:f.reduce((x,I)=>Math.max(x,I),0)+1},()=>[]);i.forEach((x,I)=>a[f[I]].push(I));const h=i.map(()=>0),m=x=>x.forEach((I,A)=>h[I]=A);a.forEach(m);for(let x=0;x<Jd;x++){const I=x%2?[...a].reverse():a;for(const A of I){const M=new Map(A.map($=>{const L=x%2?r[$]:s[$];return[$,L.length?L.reduce((C,R)=>C+h[R],0)/L.length:h[$]]}));A.sort(($,L)=>M.get($)-M.get(L)||$-L),m(A)}}const p=a[0].filter(x=>i[x].type==="object"&&o[x].length===0&&r[x].length>0);if(n&&p.length>1){const x=new Set(p),I=a[0].filter(A=>!x.has(A));a.splice(0,1,...p.map((A,M)=>M===0?[...I,A]:[A]))}const b=Object.create(null),S=i.map(()=>0),v=[],D=Math.ceil(Hd/Qs)-1;for(let x=0;x<a.length;x++){const I=new Map;for(const $ of v)for(const L of $)I.set(L,L+1);const A=$=>{let L=$;for(;I.has(L);)L=I.get(L);let C=$;for(;I.has(C);){const R=I.get(C);I.set(C,L),C=R}return L},M=[];for(const $ of a[x]){let L=x;for(const R of s[$])L=Math.max(L,S[R]+1);const C=A(L);S[$]=C,I.set(C,C+1),M.push(C),b[i[$].id]=[er+x*Qs,er+C*Gd]}v.push(M),v.length>D&&v.shift()}return{positions:b,forwardRelations:d,feedbackRelations:c,exceptionRelations:u}}function Kd(e,t){return Lr(e)?cs(e,t).positions:_d(e,t).positions}const tr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function Jr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>tr(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const r=tr(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(r)return r}return 0})}}function _r(e){const t=Jr(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([r,s])=>[i.get(r),s])))}}function Kr(e){const t=_r(e);return t.restore(Kd(t.graph,t.order))}function Xd(e){const t=_r(e),n=cs(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function Xr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function Zd(e,t){if(!e)return!1;const n=r=>"format"in r?!!r.document?.handle||r.recovery.some(s=>s.handle!==void 0):r.tabs.some(s=>s.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(r,s){if(Object.is(r,s))return!0;if(!r||!s||typeof r!="object"||typeof s!="object"||i.has(r)||i.has(s))return!1;const d=a=>Array.isArray(a)||Object.getPrototypeOf(a)===null||Object.getPrototypeOf(a)?.constructor?.name==="Object";if(!d(r)||!d(s)||Array.isArray(r)!==Array.isArray(s)||Array.isArray(r)&&r.length!==s.length)return!1;i.add(r),i.add(s);const c=r,u=s,l=Object.keys(c),f=Object.keys(u),g=l.length===f.length&&l.every(a=>Object.hasOwn(u,a)&&o(c[a],u[a]));return i.delete(r),i.delete(s),g}return o(e,t)}function Jn(e,t){const n=new Set(t.graph.nodes.map(r=>r.id)),i=Object.create(null);for(const[r,s]of Object.entries(e.positions))n.has(r)&&(i[r]=[...s]);const o=t.graph.nodes.filter(r=>!i[r.id]);if(o.length){const r=Kr(t),s=Object.values(i);for(const d of o){const c=[...r[d.id]];for(;s.some(u=>Math.abs(u[0]-c[0])<280&&Math.abs(u[1]-c[1])<88);)c[1]+=180;i[d.id]=c,s.push(c)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(r=>n.has(r)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function Zr(){return new Promise((e,t)=>{const n=indexedDB.open(Xr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class ps extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let Vi;function Yr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function Yd(e){const t=Vi;if(t===void 0)throw Error("Session has not been loaded");const n=await Zr();try{await new Promise((i,o)=>{const r=n.transaction("session","readwrite"),s=r.objectStore("session"),d=s.get("generation"),c=s.get("current"),u=s.get("readonly-legacy");let l,f;u.onsuccess=()=>{try{const g=Yr(d.result);if(Zd(c.result,e)){f=g;return}if(g!==t)throw new ps;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");u.result===void 0&&el(c.result)&&s.put(c.result,"readonly-legacy"),s.put(e,"current"),s.put(f,"generation")}catch(g){l=g,r.abort()}},r.oncomplete=()=>{Vi=f,i()},r.onerror=()=>o(l??r.error??Error("Session save failed")),r.onabort=()=>o(l??r.error??Error("Session save aborted"))})}finally{n.close()}}async function Qd(){Vi=void 0;const e=await Zr();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),r=o.get("current"),s=o.get("generation");i.oncomplete=()=>{try{Vi=Yr(s.result),t(r.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function el(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const nr=new WeakMap;function tl(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(l=>l.id===t&&l.type==="business"))throw Error("Unknown Activity: "+t);let i=nr.get(e);i||(i=new Map,nr.set(e,i));const o=i.get(t);if(o)return o;const r=new Set(e.graph.nodes.filter(l=>l.type==="object").map(l=>l.id)),s=new Set(e.graph.nodes.filter(l=>l.type==="business").map(l=>l.id)),d=e.graph.relations.filter(l=>l.kind==="input"&&l.to===t&&r.has(l.from)||l.kind==="output"&&l.from===t&&r.has(l.to)||l.kind==="business-exception"&&(l.from===t&&s.has(l.to)||l.to===t&&s.has(l.from))),c=new Set([t,...d.flatMap(l=>[l.from,l.to])]),u={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(l=>c.has(l.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(l=>l.type==="business").map(l=>l.id)).filter(l=>c.has(l))};return i.set(t,u),u}const ir=new WeakMap;function nl(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let i=ir.get(e);i||(i=new Map,ir.set(e,i));const o=t,r=i.get(o);if(r)return r;const s=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),d=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),c=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&d.has(f.to)||f.kind==="output"&&f.to===t&&d.has(f.from)||f.kind==="object-exception"&&(f.from===t&&s.has(f.to)||f.to===t&&s.has(f.from))),u=new Set([t,...c.flatMap(f=>[f.from,f.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>u.has(f.id)),relations:c},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>u.has(f))};return i.set(o,l),l}const Qr=new WeakMap;function en(e){return Qr.get(e)}const ea=["design","checks","source","draft","edited","handle"];function il(e){return{key:e.key,name:e.name,...Object.fromEntries(ea.map(t=>[t,e[t]]))}}function $t(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:c,scroll:u,zoom:l}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:r,selectedEdgesOnly:s,viewInset:d,canvasOrigin:c,scroll:u,zoom:l,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Qi(e,t){const n=t;Qr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of ea)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function Fi(e){return e.activity}function Bi(e){return e.object}function di(e){return e.activity??e.object}function eo(e){return e.object===void 0?tl(e.design,e.activity):nl(e.design,e.object)}function to(e){const t=eo(e),n=Jn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function zt(e,t=[],n,i){const o=n??(e.tabs[0]?il(e.tabs[0]):void 0),r=o?(i??[e.tabs[0]?$t(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(g=>{const a=Qi(o,g);return Object.assign(g,$t(to(a))),a}):[],{dark:s,drawer:d,width:c,preferWrite:u,nodeDrawer:l,sampleLayout:f}=e;return{dark:s,drawer:d,width:c,preferWrite:u,nodeDrawer:l,sampleLayout:f,document:o,tabs:r,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(g=>g.source?.kind==="url").map(g=>({url:g.source.url,name:g.name}))].filter((g,a,h)=>h.findIndex(m=>m.url===g.url)===a),legacyViews:e.legacyViews,active:r.some(g=>g.key===e.active)?e.active:r[0]?.key}}function ms(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map($t),recovery:n}}function Ci(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function ol(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!ll(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const l of o.views)Ci(l)}const{format:r,views:s,document:d,recovery:c,...u}=e;for(const l of s)Ci(l);for(const l of c)Ci(l);if(!!d!=!!s.length||new Set(s.map(l=>l.key)).size!==s.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(g=>g.group!==void 0&&typeof g.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(g=>g.group===void 0).length!==1))throw Error("Invalid legacy views");const l=i.views[0],f=l?{...l}:void 0;return f&&delete f.group,zt({...u,tabs:[],active:f?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},c,d,f?[f]:[])}if(s.length&&(s[0].activity!==void 0||s[0].object!==void 0||s.filter(l=>l.activity===void 0&&l.object===void 0).length!==1)||new Set(s.filter(l=>l.activity!==void 0).map(l=>l.activity)).size!==s.filter(l=>l.activity!==void 0).length||new Set(s.filter(l=>l.object!==void 0).map(l=>l.object)).size!==s.filter(l=>l.object!==void 0).length)throw Error("Invalid workspace views");if(d&&s.some(l=>l.activity!==void 0&&!d.design.graph.nodes.some(f=>f.type==="business"&&f.id===l.activity)))throw Error("Unknown saved Activity");if(d&&s.some(l=>l.object!==void 0&&!d.design.graph.nodes.some(f=>f.type==="object"&&f.id===l.object)))throw Error("Unknown saved Object");return zt({...u,tabs:[]},c,d,s)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)Ci(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return zt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function sl(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return zt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function rl(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},r=new Set(t.graph.nodes.filter(c=>c.type==="business").map(c=>c.id)),s=new Set(t.graph.nodes.filter(c=>c.type==="object").map(c=>c.id)),d=e.tabs.filter(c=>(c.activity===void 0||r.has(c.activity))&&(c.object===void 0||s.has(c.object))).map($t);return zt(e,e.recovery,o,d)}function al(e,t){const n=e.tabs.find(o=>Fi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=Qi(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,$t(to(i))),e.tabs.push(i),e.active=i.key,i}function cl(e,t){const n=e.tabs.find(o=>Bi(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=Qi(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,$t(to(i))),e.tabs.push(i),e.active=i.key,i}function dl(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(r=>r.key===i.key);return $t(o?to(Qi(e.document,{...$t(i),...$t(o)})):i)});return zt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function ll(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function no(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const r=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},s=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const c=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),u=c.getBoundingClientRect();t.style.left=Math.max(8,Math.min(u.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(u.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?s():r(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),s(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const c=d,u=o(),l=u.indexOf(document.activeElement);let f;c.key==="ArrowDown"&&(f=(l+1)%u.length),c.key==="ArrowUp"&&(f=(l+u.length-1)%u.length),c.key==="Home"&&(f=0),c.key==="End"&&(f=u.length-1),f!==void 0&&(c.preventDefault(),u[f]?.focus())}),t.addEventListener("click",d=>{const c=d.target.closest("button,a[href]");!t.hidden&&c&&!i(c)&&r(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&r()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&r()}),window.addEventListener("resize",()=>r()),{close:r}}const ul=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),fl={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function pl(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),r=v=>o.slice(v.line+1,i.find(D=>D.line>v.line&&D.level<=v.level)?.line??o.length).join(`
`).trim(),s=new Map(i.filter(v=>v.level===3&&t.some(D=>D.title===v.title)).map(v=>[v.title,v])),d=v=>{const D=t.find(x=>x.title===v.title);return D?"legacy-check:"+D.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},c=new Map,u=(v,D)=>{c.has(v)?c.get(v)!==D&&c.set(v,void 0):c.set(v,D)};for(const v of i){const D=d(v);u(ul(v.title),D);const x=t.find(I=>I.title===v.title);x&&u(x.id.toLowerCase(),D)}for(const[v,D]of o.entries()){const x=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(D);if(x){const I=i.find(A=>A.line>v);I&&u(x[1].toLowerCase(),d(I))}}const l=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const D=[];let x=0;for(const I of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){I.index>x&&D.push({kind:"markdown",value:v.slice(x,I.index)});let A=I[2].slice(1);try{A=decodeURIComponent(A)}catch{}const M=I[2].startsWith("#")?c.get(A.toLowerCase()):void 0;D.push(M?{kind:"reference",targetId:M,label:I[1]}:{kind:"link",uri:I[2],label:I[1]}),x=I.index+I[0].length}return x<v.length&&D.push({kind:"markdown",value:v.slice(x)}),D},f=[],g=[],a=[],h=new Map;for(const v of i.filter(D=>D.level===2)){if(v.title==="業務一覧")continue;const D=d(v),x=i.find(I=>I.line>v.line)?.line??o.length;f.push({id:D,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:l(o.slice(v.line+1,x).join(`
`).trim())}),h.set(v.title,D)}const m="legacy-unassigned",p=v=>{const D=i.filter(x=>x.line<v.line&&x.level===2).at(-1);return D?h.get(D.title):void 0},b=t.map(v=>{const D=s.get(v.title),x=p(D)??m,I=Object.create(null),A=[];let M={name:"補足",value:""},$="";for(const C of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const R=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(C);R&&($?R[1][0]===$[0]&&R[1].length>=$.length&&!R[2].trim()&&($=""):$=R[1]);const ee=$?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(C);ee?(M.value.trim()&&A.push(M),M={name:ee[1],value:ee[2]}):M.value+=`
`+C}M.value.trim()&&A.push(M);let L="";for(const C of A)if(C.name==="人間レビュー状態"){L=C.value.split(`
`)[0].trim();const R=C.value.split(`
`).slice(1).join(`
`).trim();R&&(I.補足=[...I.補足??[],...l(R)])}else{const R=fl[C.name]??C.name;I[R]=[...I[R]??[],...l(C.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:L,sectionId:x,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(C=>C[1]).join(`
`),fields:I}});b.some(v=>v.sectionId===m)&&f.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const v of i.filter(D=>D.level===3&&!s.has(D.title))){const D=p(v);D?g.push({id:d(v),sectionId:D,title:v.title,blocks:[{kind:"prose",content:l(r(v))}]}):a.push({id:d(v),title:v.title,content:l(r(v))})}const S=i.find(v=>v.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:l(o.slice(/^# /.test(o[0])?1:0,S).join(`
`)),sections:f,items:b,index:Object.entries(n).map(([v,D])=>{const x=o.find(I=>I.startsWith("|")&&I.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:x[1]?.trim()??"",connections:x[2]?.trim()??"",checkIds:D.map(I=>"legacy-check:"+I)}}),guarantees:g,examples:[],notes:a}}function Oo(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...r]=n;if(!i||!o)return;r[0]==="refs"&&["heads","tags"].includes(r[1])&&r.splice(0,2);const[s,...d]=r;return!s||!d.length||!["main","master"].includes(s)&&!/^[a-f0-9]{40}$/i.test(s)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:s}}catch{return}}function Vo(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function ml(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((f,g)=>{const a=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(a){o?a[1][0]===o[0]&&a[1].length>=o.length&&!a[2].trim()&&(o=""):o=a[1];return}if(!o){t.add(g);const h=/^(#{1,6}) (.+)$/.exec(f);h&&i.push({line:g,level:h[1].length,title:h[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const r=i.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!r.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const s=new Set,d=r.map(f=>{const g=i.find(m=>m.line>f.line&&m.level<=3)?.line??n.length,a=f.title.split(/\s/)[0];if(s.has(a))throw Error("Check IDが重複しています: "+a);s.add(a);const h=n.slice(f.line+1,g).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(h))throw Error(a+" の"+m+"が見つかりません。");return{id:a,title:f.title,body:h,activities:[]}}),c=Object.create(null);let u=!1;for(const[f,g]of n.entries()){if(!t.has(f)||(/^## /.test(g)&&(u=/^## 業務一覧\s*$/.test(g)),!u||!/^\|/.test(g)))continue;const a=g.split("|").slice(1,-1);if(a.length!==4)continue;const h=Vo(a[0])[0]?.label;if(!h)continue;if(Object.hasOwn(c,h))throw Error("業務一覧のActivityが重複しています: "+h);const m=Vo(a[3]);if(m.some(b=>b.url.toLowerCase()!=="#"+b.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+h);const p=m.map(b=>b.label);if(!p.length||p.some(b=>!s.has(b)))throw Error("業務一覧のCheck ID参照を確認できません: "+h);c[h]=[...new Set(p)];for(const b of d)p.includes(b.id)&&b.activities.push(h)}if(!Object.keys(c).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const l=i.find(f=>f.level===2)?.line??r[0].line;return{markdown:e,intro:n.slice(0,l).join(`
`),items:d,index:c,model:pl(e,d,c,i)}}function li(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function ui(e,t){const n=new Set(t.design.graph.nodes.filter(u=>u.type==="business").map(u=>u.name)),i=Object.keys(e.index).filter(u=>!n.has(u)),o=Object.keys(e.index).filter(u=>n.has(u)),r=(u,l)=>({state:u,reason:l,unknown:i});if(!o.length)return r("mismatch","業務一覧に、この業務設計書のActivityがありません。");const s=e.intro.split(`
`).filter(u=>/原典|^[-*] Source[：:]|Business Design/i.test(u)).join(`
`),d=Vo(s).map(u=>Oo(u.url)).filter(u=>u!==void 0),c=t.source?.kind==="url"?Oo(t.source.url):t.source?.kind==="sample"?Oo("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return c&&d.length&&d.some(u=>u.document!==c.document)?r("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?r("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!c||!d.length?r("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(u=>u.ref!==c.ref)||!/^[a-f0-9]{40}$/i.test(c.ref)?r("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):r("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const or=new WeakMap;function Fn(e){let t=or.get(e);return t||(t=ml(e.markdown),or.set(e,t)),t}const jo=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function Di(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function hl(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function bl(e){if(!e.checks)return[];const t=Fn(e.checks),n=ui(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===li(e)?[t.model]:[]}function gl(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&Di(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let r,s=!1;if(e.checks){r=Fn(e.checks);const d=ui(r,e);if(s=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===li(e),!s&&(Di(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const c=jo("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));c.disabled=n.disabled||t.busy===!0,o.append(c)}}if(t.candidate){const d=t.candidate,c=Fn(d),u=ui(c,e),l=document.createElement("section");l.className="check-candidate",l.id="check-candidate",Di(l,"一致未確認: "+d.name+" — "+u.reason),Di(l,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),g=document.createElement("summary");g.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(g,hl(c.markdown)),l.append(f);const a=jo("対応を確認して表示する",()=>n.confirm(d));a.id="check-confirm",a.disabled=u.state==="mismatch"||n.disabled||t.busy===!0;const h=jo("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});h.disabled=n.disabled||t.busy===!0,l.append(a,h),o.append(l)}return o.childNodes.length&&i.append(o),i}function yl(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const l of o){const f=document.createElement("span");f.className="document-action-label",f.textContent=l.getAttribute("aria-label"),l.append(f)}let r=!1;const s=(l=!1)=>{r=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),l&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(l=>!l.hidden&&!l.disabled),c=()=>{const l=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const a=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,h=n.getBoundingClientRect().width+a,m=o.some(p=>!p.hidden)&&e.clientWidth>0&&h>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||l!==e.dataset.actionsMode)&&(s(),m&&n.contains(f)?i.focus({preventScroll:!0}):!m&&f===i&&d()[0]?.focus({preventScroll:!0}))},u=(l=!1)=>{if(i.hidden)return;r=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const f=d();(l?f.at(-1):f[0])?.focus({preventScroll:!0})};return i.onclick=()=>r?s(!0):u(),i.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),u(l.key==="ArrowUp"))},n.addEventListener("keydown",l=>{if(!r)return;const f=d(),g=f.indexOf(document.activeElement);let a;l.key==="ArrowDown"&&(a=(g+1)%f.length),l.key==="ArrowUp"&&(a=(g+f.length-1)%f.length),l.key==="Home"&&(a=0),l.key==="End"&&(a=f.length-1),a!==void 0&&(l.preventDefault(),f[a]?.focus())}),document.addEventListener("keydown",l=>{r&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{r&&!n.contains(l.target)&&!i.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{r&&!n.contains(l.target)&&l.target!==i&&s()}),n.addEventListener("click",l=>{const f=l.target.closest("button");r&&f&&!f.disabled&&s(!0)},!0),s(),c(),window.addEventListener("resize",c),typeof ResizeObserver<"u"&&new ResizeObserver(c).observe(e),new MutationObserver(c).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(c),document.fonts?.addEventListener("loadingdone",c),{update:c,close:s}}function vl(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),r=parseFloat(o.columnGap)||0,s=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((u,l)=>u+l.getBoundingClientRect().width,0)+r*n.length+s,c=d+t.getBoundingClientRect().width+r;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&c>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(r=>o.observe(r))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const Yn="http://www.w3.org/2000/svg",wl="http://www.w3.org/1999/xhtml",Mi=24,sr=8192,kl=16e6,Il=8e6,Sl=4e3,xl=1e6,Fo="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Al(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(l=>![l.x,l.y,l.width,l.height].every(Number.isFinite)||l.width<0||l.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const l of e)t=Math.min(t,l.x),n=Math.min(n,l.y),i=Math.max(i,l.x+l.width),o=Math.max(o,l.y+l.height);const r=Math.floor(t)-Mi,s=Math.floor(n)-Mi,d=Math.ceil(i)-r+Mi,c=Math.ceil(o)-s+Mi,u=Math.min(2,sr/d,sr/c,Math.sqrt(kl/(d*c)));if(u<1)throw Error(Fo);return{bounds:{x:r,y:s,width:d,height:c},width:Math.floor(d*u),height:Math.floor(c*u),scale:u}}const El="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function rr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,r)=>{const s=i[r],d=getComputedStyle(o);s.removeAttribute("style");for(const c of El){const u=d.getPropertyValue(c);u&&!/url\s*\(/i.test(u)&&s.style.setProperty(c,u)}for(const c of Array.from(s.attributes))(c.name.startsWith("data-")||c.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(c.name))&&s.removeAttribute(c.name)}),t}function Ol(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Sl||(e.textContent?.length??0)+(t.textContent?.length??0)>xl)throw Error(Fo);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const p of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+p.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+p.offsetTop,width:p.offsetWidth,height:p.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const r=e.ownerDocument,s=Array.from(t.children).map(rr),d=s.filter(m=>m.matches(".edge,.edge-label"));if(d.length){const m=r.createElementNS(Yn,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...d),r.body.append(m);try{for(const p of d){const b=p.getBBox();o.push({x:b.x-12,y:b.y-12,width:b.width+24,height:b.height+24})}}finally{m.remove()}}const c=Al(o),u=r.createElementNS(Yn,"svg");u.setAttribute("width",String(c.width)),u.setAttribute("height",String(c.height)),u.setAttribute("viewBox",`0 0 ${c.bounds.width} ${c.bounds.height}`);const l=r.createElementNS(Yn,"rect");l.setAttribute("width","100%"),l.setAttribute("height","100%"),l.setAttribute("fill",n),u.append(l);const f=r.createElementNS(Yn,"g");f.setAttribute("transform",`translate(${-c.bounds.x} ${-c.bounds.y})`);for(const m of s)f.append(m);u.append(f);const g=r.createElementNS(Yn,"foreignObject");g.setAttribute("width",String(c.bounds.width)),g.setAttribute("height",String(c.bounds.height));const a=r.createElementNS(wl,"div");a.style.cssText=`position:relative;width:${c.bounds.width}px;height:${c.bounds.height}px;`;for(const m of i){const p=rr(m);p.querySelector(".activity-open,.object-open")?.remove(),p.style.left=parseFloat(m.style.left)-c.bounds.x+"px",p.style.top=parseFloat(m.style.top)-c.bounds.y+"px",a.append(p)}g.append(a),u.append(g);const h=new XMLSerializer().serializeToString(u);if(new TextEncoder().encode(h).length>Il)throw Error(Fo);return{svg:h,...c}}function jl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ta(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,r)=>{const s=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",r(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(s),o()},n.onerror=()=>{clearTimeout(s),r(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,r)=>{const s=window.setTimeout(()=>r(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(s),d?o(d):r(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(s),r(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Cl(e,t){const n=await ta(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=jl(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function Dl(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ta(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function na(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:Ml(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Ml(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,r=2246822507;for(const s of i)o=Math.imul(o^s.codePointAt(0),16777619)>>>0,r=Math.imul(r^s.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+r.toString(16).padStart(8,"0")}function ia(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return T(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function oa(e){T(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),pn(e),Ui(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=na(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=ia(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return Ui(t),t}const ar=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Rl={anyOf:ai.anyOf},Ll={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Nl={type:"string",minLength:1,pattern:"\\S"},Pl={$schema:"https://json-schema.org/draft/2020-12/schema",...ar({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:ar({id:Ll,name:Nl,package:Rl})}}),$defs:ai.$defs};function Tl(e){try{pn(e,Pl)}catch(n){if(Array.isArray(e?.plans))for(const i of e.plans)try{pn(i?.package,ai)}catch(o){throw Error("Plan "+(i?.id??"<missing>")+" (formatVersion "+String(i?.package?.formatVersion)+"): "+o.message,{cause:o})}throw n}T(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){T(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),T(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Ui(n.package),["0.1","0.2","0.3"].includes(n.package.formatVersion)&&oa(n.package)}catch(i){throw Error("Plan "+n.id+" (formatVersion "+n.package.formatVersion+"): "+i.message,{cause:i})}}return{valid:!0,plans:e.plans.map(({id:n,name:i})=>({id:n,name:i}))}}const me=(e,t)=>{if(!e)throw new Error(t)},ti=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Co=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Ri=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),sa=e=>ti(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function ql(e){me(Co(e),"Graph must be an object");const t=e;me(Ri(t,["version","nodes","relations"])||Ri(t,["version","nodes","relations","scope"]),"Invalid graph fields"),me(t.version===1,"Unsupported graph version"),"scope"in t&&me(ti(t.scope),"Invalid scope"),me(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),me(Array.isArray(t.relations),"Relations required");const n=new Map;for(const r of t.nodes){me(Co(r),"Node must be an object");const s=r;me(s.type==="business"||s.type==="object","Invalid node type");const d=s.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];s.type==="business"&&("problem"in s||"pain_level"in s)&&(d.push("problem","pain_level"),me(["Low","Medium","High"].includes(String(s.pain_level)),"Invalid Pain level")),me(Ri(s,d),"Invalid node fields"),me(Object.entries(s).every(([u,l])=>u==="scope"||u==="information"||ti(l)),"Empty node text"),me(typeof s.scope=="boolean","Invalid node scope"),me(sa(s.name)&&s.id===s.name,"Node ID must equal visible name"),me(!n.has(s.id),"Duplicate node ID"),s.type==="object"&&(me(typeof s.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.icon),"Invalid Lucide icon"),me(Array.isArray(s.information)&&s.information.every(ti),"Invalid information")),n.set(s.id,s.type)}me([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const r of t.relations){me(Co(r),"Relation must be an object");const s=r;me(Ri(s,["kind","from","to","label"])&&Object.values(s).every(ti),"Invalid relation fields");const d=i[s.kind];me(Array.isArray(d)&&n.has(s.from)&&n.has(s.to)&&n.get(s.from)===d[0]&&n.get(s.to)===d[1],"Invalid relation endpoints");const c=JSON.stringify([s.kind,s.from,s.to,s.label]);me(!o.has(c),"Duplicate relation"),o.add(c)}}function mn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function ii(e){const t=[];let n="";return mn(e).forEach((i,o)=>{const r=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(r){n?r[1][0]===n[0]&&r[1].length>=n.length&&!r[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=r[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),me(!n,"Unclosed code fence"),t}function Bo(e,t,n,i=[]){const o=mn(e),r=ii(e),s=Object.create(null);return me(r.length&&!o.slice(0,r[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),r.forEach(([d,c],u)=>{me(t.includes(c)&&!(c in s),n+": unsupported/duplicate "+c),s[c]=o.slice(d+1,r[u+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),me(s[c]||i.includes(c),n+": empty "+c)}),me(r.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),s}const cr=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const r=n[o].codePointAt(0)-i[o].codePointAt(0);if(r)return r}return n.length-i.length};function $l(e){const t=mn(e),n=ii(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return me(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,r],s)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(r);me(d,"Invalid Finding ID");const c=d[1];me(!i.has(c),"Duplicate Finding ID"),i.add(c);const u=Bo(t.slice(o+1,n[s+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+c);me(["question","correction"].includes(u["### Kind"]),"Invalid Finding Kind"),me(["open","resolved"].includes(u["### Status"]),"Invalid Finding Status"),me(["items","document","unassigned"].includes(u["### Scope"]),"Invalid Finding Scope");const l=u["### Targets"]==="(none)"?[]:mn(u["### Targets"]).filter(f=>f.trim()).map(f=>(me(f.startsWith("- ")&&sa(f.slice(2)),"Invalid Finding target"),f.slice(2)));return me(new Set(l).size===l.length,"Duplicate Finding target"),me(u["### Scope"]==="items"?l.length>0:u["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:c,kind:u["### Kind"],status:u["### Status"],scope:u["### Scope"],targets:l,summary:u["### Summary"],content:u["### Content"],unresolvedTargets:[]}})}function Wl(e,t){me(!e.includes("<!--"),"HTML comments are unsupported");const n=mn(e),i=ii(e).filter(g=>g[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;me(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let r=[];const s={version:1,nodes:[],relations:[]},d=Object.create(null),c=new Set;i.slice(1).forEach(([g,a],h)=>{const m=i[h+2]?.[0]??n.length,p=n.slice(g+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(me(p,"Empty section "+a),a==="# Findings"){me(!c.has(a),"Duplicate Findings"),c.add(a),r=$l(p);return}if(["# Scope","# Graph exceptions"].includes(a)){me(!c.has(a),"Duplicate "+a),c.add(a),a==="# Scope"?(me(!ii(p).length,"Scope must be prose"),s.scope=p):mn(p).filter(M=>M.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(M=>{const $=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(M);me($,"Invalid exception"),s.relations.push({kind:$[1],from:$[2],to:$[3],label:$[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const b=o.exec(a);me(b,"Unsupported heading "+a);const S=b[1],v=b[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[v]=n.slice(g,m).join(`
`);const D=M=>ii(p).some($=>$[1]===M);if(S==="Object"){const M=["## Scope","## Icon"];D("## Information")&&M.push("## Information");const $=Bo(p,M,v);me(["true","false"].includes($["## Scope"]),"Invalid Scope");const L=mn($["## Information"]??"").filter(C=>C.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(C=>(me(/^- \S.*$/.test(C),"Invalid Information"),C.slice(2)));s.nodes.push({id:v,type:"object",name:v,scope:$["## Scope"]==="true",icon:$["## Icon"]==="(generic icon)"?"box":$["## Icon"],information:L});return}const x=["## Scope","## Why","## When"];D("## Exception When")&&x.push("## Exception When"),x.push("## Who","## Where","## How","### Input","### Procedure"),D("### Exception")&&x.push("### Exception"),x.push("### Output","## Result"),(D("## Problem")||D("## Pain level"))&&x.push("## Problem","## Pain level");const I=Bo(p,x,v,["## How"]);me(!I["## How"],"How must only contain fields"),me(["true","false"].includes(I["## Scope"]),"Invalid Scope"),t?.activity?.(v,I);const A={id:v,type:"business",name:v,scope:I["## Scope"]==="true",why:I["## Why"],when:I["## When"],who:I["## Who"],where:I["## Where"],result:I["## Result"]};"## Problem"in I&&(A.problem=I["## Problem"],A.pain_level=I["## Pain level"]),s.nodes.push(A);for(const[M,$]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(M in I)||$!=="business-exception"&&I[M]==="(none)"||mn(I[M]).filter(L=>L.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(L=>{const C=/^- (.+?) — (\S.*)$/.exec(L);me(C,"Invalid relation in "+v),s.relations.push({kind:$,from:$==="output"?v:C[1],to:$==="output"?C[1]:v,label:C[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const u=s.nodes.filter(g=>g.type==="business").map(g=>g.id);ql(s),s.nodes.sort((g,a)=>cr(g.id,a.id)),s.relations.sort((g,a)=>{for(const h of["kind","from","to","label"]){const m=cr(g[h],a[h]);if(m)return m}return 0});const l=new Set(s.nodes.map(g=>g.id));for(const g of r)g.unresolvedTargets=g.targets.filter(a=>!l.has(a));return{graph:s,sections:d,markdown:e,activityOrder:u,findings:r}}const zl=["id","from","activity","condition","to","effect","path","evidence","note"],_e=(e,t)=>{if(!e)throw Error(t)},Li=e=>typeof e=="string"&&!!e.trim();function Ul(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());_e(n,"state-meta と遷移表が必要です");const i=Gr(n[1]);_e(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),_e(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),_e(i.object===t,"対象Objectが一致しません"),_e(Array.isArray(i.states)&&i.states.length>0&&i.states.every(u=>Li(u)&&!u.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),_e(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&Li(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),r=u=>(_e(u.startsWith("|")&&u.endsWith("|"),"表の行が不正です"),u.slice(1,-1).split("|").map(l=>l.trim())),s=r(o[0]);_e([zl,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(u=>s.join("|")===u.join("|")),"表の列名が不正です"),_e(r(o[1]).length===s.length&&r(o[1]).every(u=>/^-+$/.test(u)),"表の区切りが不正です"),_e(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,c=o.slice(2).map(u=>{const l=r(u);_e(l.length===s.length&&l.every(Li),"表の列数・空欄が不正です");const f=Object.fromEntries(s.map((g,a)=>[g,l[a]]));return _e(/^T[0-9]+$/.test(f.id)&&!d.has(f.id),"遷移IDが不正または重複しています"),d.add(f.id),_e([...i.states,"@new"].includes(f.from)&&[...i.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),_e(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),s.includes("exception")&&_e(f.path==="normal"?f.exception==="-":Li(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),_e(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),_e(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),_e(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),_e(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...i,transitions:c}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const dr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Vl(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let r="";for(let s=0;s<i.length;s++){const d=i[s];if(!r&&/^# Object /.test(d)?n=d.slice(9):!r&&/^# /.test(d)&&(n=null),!r&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const c=[];let u="";for(s++;s<i.length;s++){const f=i[s];if(!u&&/^#{1,2} /.test(f)){s--;break}c.push(f),u=dr(f,u)}const l=Ul(c.join(`
`),n);if(l.error)throw Error(l.error);t.push(l.model);continue}o.push(d),r=dr(d,r)}if(new Set(t.map(s=>s.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function Fl(e){const t=/^## State Transitions$/m.test(e)?Vl(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,r=Wl(t.markdown,{activity:(c,u)=>o.set(c,u),document:(c,u)=>{n=c,i=u}}),s={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:r.graph.scope??"",objects:r.graph.nodes.filter(c=>c.type==="object").map(c=>({id:c.id,name:c.name,scope:c.scope,icon:String(c.icon),information:c.information})),activities:(r.activityOrder??[]).map(c=>{const u=r.graph.nodes.find(f=>f.id===c),l=o.get(c);return{id:c,name:u.name,scope:u.scope,why:String(u.why),when:String(u.when),who:String(u.who),where:String(u.where),procedure:l["### Procedure"],exception:l["### Exception"]??null,result:String(u.result),problem:u.problem===void 0?null:String(u.problem),painLevel:u.pain_level===void 0?null:String(u.pain_level)}}),relations:r.graph.relations.map((c,u)=>({id:"legacy-relation-"+u,kind:c.kind,fromId:c.from,toId:c.to,label:c.label})),findings:(r.findings??[]).map(c=>({...c,sourceId:c.id,targetIds:c.targets.filter(u=>r.graph.nodes.some(l=>l.id===u))}))};s.exceptions=na(s);const d=t.declarations.map((c,u)=>({id:"legacy-state-"+u,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:s.id,revision:s.revision,verification:"unverified"},objectId:c.object,states:c.states.map(l=>({id:l,name:l})),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(l=>({id:l.id,sourceId:l.id,fromId:l.from,toId:l.to,activityId:l.activity,exceptionId:ia(s,l.activity,l.exception),event:l.event??null,condition:l.condition,effect:l.effect,path:l.path,evidence:l.evidence,note:l.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:s,checks:[],states:d,diagnostics:[]}}}const Mt={type:"string"},de={type:"string",minLength:1,pattern:"\\S"},le={type:"string",pattern:"^[A-Za-z0-9_-]+$"},It=e=>({anyOf:[e,{type:"null"}]}),ve=e=>({type:"array",items:e}),pe=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Bl=e=>({$ref:"#/$defs/"+e}),qn=ve({anyOf:[pe({kind:{enum:["text"]},value:Mt}),pe({kind:{enum:["reference"]},targetId:le,label:Mt}),pe({kind:{enum:["link"]},uri:de,label:Mt})]}),Go=pe({id:le,name:de,scope:{type:"boolean"}}).properties,ra=pe({id:le,kind:{enum:["input","output","business-exception","object-exception"]},fromId:le,toId:le,label:de}),Gl=pe({id:le,sourceId:le,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:ve(le),unresolvedTargets:ve(de),summary:de,content:de}),Ho=pe({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:de,title:de,preface:Mt,scope:Mt,objects:ve(pe({...Go,icon:de,information:ve(de)})),activities:ve(pe({...Go,why:de,when:de,who:de,where:de,procedure:de,exception:It(de),result:de,problem:It(de),painLevel:It({enum:["Low","Medium","High"]})})),relations:ve(ra),findings:ve(Gl)}),Hl=pe({id:le,name:de,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),aa=pe({...Ho.properties,schemaVersion:{enum:["0.2"]},roles:ve(Hl),activities:ve(pe({...Ho.properties.activities.items.properties,roleId:It(le)}))}),hs=pe({...aa.properties,schemaVersion:{enum:["0.3"]},exceptions:ve(pe({id:le,activityId:le,name:de,description:Mt}))}),$n=e=>({...ve(e),minItems:1}),Jl=pe({id:le,name:de,description:Mt}),_l=pe({objectId:le,roleIds:ve(le)}),Kl=pe({id:le,text:de,obligation:{enum:["required","optional"]},appliesWhen:It(de),performerObjectIds:It($n(le))}),Xl={anyOf:[pe({kind:{enum:["before"]},beforeId:le,afterId:le}),pe({kind:{enum:["interchangeable"]},stepIds:{...ve(le),minItems:2}})]},Zl=Object.fromEntries(Object.entries(hs.properties.activities.items.properties).filter(([e])=>!["who","roleId","procedure","result","exception"].includes(e))),Yl=pe({...hs.properties,schemaVersion:{enum:["0.4"]},objects:ve(pe({...Go,icon:de,information:ve(Jl)})),activities:$n(pe({...Zl,performers:It($n(_l)),procedure:pe({steps:$n(Kl),orderRules:ve(Xl)}),results:$n(pe({id:le,text:de}))})),data:ve(pe({id:le,name:de,items:$n(pe({informationId:le,condition:It(de)}))})),relations:ve({anyOf:[pe({id:le,kind:{enum:["input","output"]},fromId:le,toId:le,dataId:le}),pe({...ra.properties,kind:{enum:["business-exception","object-exception"]}})]})}),Ql=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,qn])),eu=pe({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:de,title:de,basedOn:pe({documentId:le,revision:de,verification:{enum:["unverified"]}}),intro:qn,index:ve(pe({activityId:le,purpose:Mt,connections:Mt,checkIds:ve(le)})),sections:ve(pe({id:le,activityId:It(le),title:de,preamble:qn})),guarantees:ve(pe({id:le,sectionId:le,title:de,blocks:ve({anyOf:[pe({kind:{enum:["prose"]},content:qn}),pe({kind:{enum:["example"]},exampleId:le})]})})),examples:ve(pe({id:le,guaranteeId:le,columns:ve(de),rows:ve(ve(qn))})),items:ve(pe({id:le,checkId:le,title:de,detailSummary:Mt,sectionId:le,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:pe(Ql,[])})),notes:ve(pe({id:le,title:de,content:qn}))}),bs=pe({id:le,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:de,title:de,basedOn:pe({documentId:le,revision:de,verification:{enum:["unverified"]}}),objectId:le,states:ve(pe({id:le,name:de})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:de,transitions:ve(pe({id:le,sourceId:de,fromId:de,activityId:le,event:It(de),exception:It(de),condition:de,toId:de,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:de,note:de}))}),lr=Object.fromEntries(Object.entries({...bs.properties.transitions.items.properties,exceptionId:It(le)}).filter(([e])=>e!=="exception")),tu=pe({...bs.properties,schemaVersion:{enum:["0.2"]},transitions:ve(pe({...lr,conditionLabel:de},Object.keys(lr)))}),Qn=(e,t)=>pe({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:de,documents:ve({anyOf:t.map(Bl)}),sources:ve(pe({documentId:le,revision:de,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Mt})),externalDocuments:ve(pe({id:le,kind:{enum:["businessDesign"]},revision:de,activities:ve(pe({id:le,name:de}))})),diagnostics:ve(de)}),ur={anyOf:[Qn("0.1",["businessDesign","checkItems"]),Qn("0.2",["businessDesign","checkItems","stateTransition"]),Qn("0.3",["businessDesignRoles","checkItems","stateTransition"]),Qn("0.4",["businessDesignStructured","checkItems","stateTransitionStructured"]),Qn("0.5",["businessDesignD2","checkItems","stateTransitionStructured"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Ho,businessDesignRoles:aa,businessDesignStructured:hs,businessDesignD2:Yl,checkItems:eu,stateTransition:bs,stateTransitionStructured:tu}},Nn=(e,t)=>Y(new Set(e).size===e.length,t);function nu(e,t,n){const i=(o,r,s)=>{const d=n(o,r,e.id);return s&&Y(t.parent.get(o)===s,"Structure owner mismatch: "+o),d};Nn(e.data.map(o=>o.name),"Duplicate Data name");for(const o of e.data){Y(o.name===o.name.trim(),"Data name whitespace"),Nn(o.items.map(r=>r.informationId),"Duplicate Data information");for(const r of o.items)i(r.informationId,"information")}for(const o of e.activities){if(o.performers!==null){Nn(o.performers.map(g=>g.objectId),"Duplicate performer");for(const g of o.performers){i(g.objectId,"object"),Nn(g.roleIds,"Duplicate performer Role");for(const a of g.roleIds)i(a,"role")}}let r=o.performers===null;for(const g of o.procedure.steps)if(g.performerObjectIds!==null){Nn(g.performerObjectIds,"Duplicate Step performer");for(const a of g.performerObjectIds)Y(o.performers?.some(h=>h.objectId===a),"Step performer outside Activity assignment: "+a)}else o.performers?.length!==1&&(r=!0);r&&Y(e.findings.some(g=>g.status==="open"&&g.scope==="items"&&g.targetIds.includes(o.id)),"Unresolved performer requires an open Activity Finding: "+o.id);const s=o.procedure.steps.map(g=>g.id),d=new Map(s.map(g=>[g,[]])),c=new Set,u=[];for(const g of o.procedure.orderRules)if(g.kind==="before"){i(g.beforeId,"step",o.id),i(g.afterId,"step",o.id),Y(g.beforeId!==g.afterId,"Self Step order");const a=JSON.stringify([g.beforeId,g.afterId]);Y(!c.has(a),"Duplicate Step order"),c.add(a),d.get(g.beforeId).push(g.afterId),Y(s.indexOf(g.beforeId)<s.indexOf(g.afterId),"Standard Step order contradicts before constraint")}else{Nn(g.stepIds,"Duplicate interchangeable Step");for(const a of g.stepIds)i(a,"step",o.id);u.push(g.stepIds)}const l=(g,a)=>{const h=[g],m=new Set;for(;h.length;){const p=h.pop();if(!m.has(p)){m.add(p);for(const b of d.get(p)){if(b===a)return!0;h.push(b)}}}return!1};for(const g of s)Y(!l(g,g),"Step order cycle");const f=new Set;for(const g of u){const a=JSON.stringify([...g].sort());Y(!f.has(a),"Duplicate interchangeable group"),f.add(a);for(const h of g)for(const m of g)h!==m&&Y(!l(h,m),"Interchangeable Steps conflict with before constraint")}}for(const o of e.relations)if(["input","output"].includes(o.kind)){const r=i(o.dataId,"data"),s=o.kind==="input"?o.fromId:o.toId;for(const d of r.items)i(d.informationId,"information",s)}}const Y=(e,t)=>{if(!e)throw Error(t)};function ni(e,t=ur,n="$"){if(t.$ref)return ni(e,ur.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{ni(e,o,n);return}catch(r){i.push(r.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&Y(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;Y(i===t.type,"Invalid type at "+n)}if(t.minLength&&Y(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&Y(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])Y(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))Y(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),ni(e[i],t.properties[i],n+"."+i)}t.type==="array"&&(t.minItems!==void 0&&Y(e.length>=t.minItems,"Too few items at "+n),e.forEach((i,o)=>ni(i,t.items,n+"["+o+"]")))}function iu(e){const t=new Map,n=new Map,i=new Map,o=new Map,r=(s,d,c,u=d.id)=>{Y(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,d.id),i.set(s.id,c),o.set(s.id,u)};for(const s of e.documents){r(s,s,"document");for(const[d,c]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[d]??[])r(u,s,c)}for(const s of e.externalDocuments){r(s,s,"document");for(const d of s.activities)r(d,s,"activity")}for(const s of e.documents.filter(d=>d.kind==="businessDesign"&&d.schemaVersion==="0.4")){for(const d of s.objects)for(const c of d.information)r(c,s,"information",d.id);for(const d of s.activities){for(const c of d.procedure.steps)r(c,s,"step",d.id);for(const c of d.results)r(c,s,"result",d.id)}for(const d of s.data)r(d,s,"data")}return{map:t,owner:n,types:i,parent:o}}function ou(e){return ni(e),ca(e)}function ca(e,{allowUnresolvedFindings:t=!1}={}){Y(e.documents.length>0,"Document required");const n=iu(e),{map:i,owner:o,types:r}=n,s=[...e.diagnostics],d=new Set;for(const a of e.sources)if(a.uri){const h=new URL(a.uri);Y(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const c=(a,h,m)=>(Y(i.has(a),"Dangling reference: "+a),h&&Y(r.get(a)===h,"Reference type mismatch: "+a),m&&Y(o.get(a)===m,"Cross-document mismatch: "+a),i.get(a)),u=a=>a?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),l=(a,h)=>{for(const m of a)if(m.kind==="reference"&&(c(m.targetId,null,h),Y(["document","section","guarantee","example","check","note"].includes(r.get(m.targetId)),"Invalid rich reference target")),m.kind==="link"){const p=new URL(m.uri);Y(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const a of e.documents)if(Y(e.formatVersion!=="0.1"||a.kind!=="stateTransition","State documents require formatVersion 0.2"),a.kind==="businessDesign"){Y(a.activities.length>0,"Activity required");const h=[...a.objects,...a.activities].map(b=>b.name);Y(new Set(h).size===h.length,"Duplicate visible name"),Y(h.every(b=>b===b.trim()&&!(["0.4","0.5"].includes(e.formatVersion)?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(S=>b.includes(S))),"Invalid Graph-visible name");for(const b of a.objects)Y(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.icon),"Invalid icon");if(["0.2","0.3","0.4"].includes(a.schemaVersion)&&(Y(new Set(a.roles.map(b=>b.name)).size===a.roles.length,"Duplicate Role name"),Y(a.roles.every(b=>b.name===b.name.trim()&&!/[\r\n]/.test(b.name)),"Invalid Role name"),a.schemaVersion!=="0.4"))for(const b of a.activities)b.roleId!==null?c(b.roleId,"role",a.id):d.add("Role未確定: "+b.id+" — "+b.who);for(const b of a.activities)Y(b.problem===null==(b.painLevel===null),"Problem/Pain pair mismatch");for(const b of a.exceptions??[])c(b.activityId,"activity",a.id);const m={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;a.schemaVersion==="0.4"&&nu(a,n,c);for(const b of a.relations){c(b.fromId,m[b.kind][0],a.id),c(b.toId,m[b.kind][1],a.id);const S=JSON.stringify([b.kind,b.fromId,b.toId,b.dataId??b.label]);Y(!p.has(S),"Duplicate relation"),p.add(S)}Y(new Set(a.findings.map(b=>b.sourceId)).size===a.findings.length,"Duplicate Finding source ID");for(const b of a.findings){Y(b.scope==="items"?b.targetIds.length+b.unresolvedTargets.length>0:!b.targetIds.length&&!b.unresolvedTargets.length,"Finding scope mismatch"),Y(new Set(b.targetIds).size===b.targetIds.length,"Duplicate Finding target");for(const S of b.targetIds)c(S,null,a.id),Y(["object","activity"].includes(r.get(S)),"Invalid Finding target");b.unresolvedTargets.length&&(Y(t,"Unresolved Finding target: "+b.sourceId),s.push("Finding参照未決: "+b.sourceId))}}else if(a.kind==="stateTransition"){const h=c(a.basedOn.documentId,"document");Y(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),Y(h.revision===a.basedOn.revision,"Stale State source revision"),c(a.objectId,"object",h.id),Y(!e.documents.some(p=>p!==a&&p.kind==="stateTransition"&&p.objectId===a.objectId),"Duplicate Object state declaration"),Y(a.states.length>0&&new Set(a.states.map(p=>p.name)).size===a.states.length,"Duplicate/empty state names"),Y(a.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),Y(a.transitions.length<=1e3,"State transition row budget"),Y(new Set(a.transitions.map(p=>p.sourceId)).size===a.transitions.length,"Duplicate transition source ID");const m=new Map;for(const p of a.transitions){p.fromId!=="@new"&&c(p.fromId,"state",a.id),["@unknown","@none"].includes(p.toId)||c(p.toId,"state",a.id);const b=c(p.activityId,"activity",h.id);if(e.formatVersion!=="0.5"){const S=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);Y(!m.has(S),"Duplicate state transition condition: "+m.get(S)+" / "+p.sourceId),m.set(S,p.sourceId)}if(["0.4","0.5"].includes(e.formatVersion))if(Y(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const S=c(p.exceptionId,"exception",h.id);Y(S.activityId===b.id,"Exception Activity mismatch")}else p.path==="exception"&&Y(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else Y(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);Y(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),Y(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),Y(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),Y(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+a.id)}else{const h=c(a.basedOn.documentId,"document");Y(h.kind==="businessDesign","Check source is not BD"),Y(h.revision===a.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+a.id),Y(new Set(a.items.map(p=>p.checkId)).size===a.items.length,"Duplicate Check ID");const m=new Set;for(const p of a.index){c(p.activityId,"activity",h.id),Y(!m.has(p.activityId),"Duplicate Activity index"),m.add(p.activityId),Y(new Set(p.checkIds).size===p.checkIds.length,"Duplicate Check binding");for(const b of p.checkIds)c(b,"check",a.id)}Y(new Set(a.sections.map(p=>p.activityId??p.title)).size===a.sections.length,"Duplicate Activity section");for(const p of a.sections)p.activityId!==null&&(c(p.activityId,"activity",h.id),Y(m.has(p.activityId),"Section missing from index")),l(p.preamble,a.id);for(const p of a.guarantees){Y(p.blocks.some(b=>b.kind==="prose"&&u(b.content)),"General guarantee prose required"),c(p.sectionId,"section",a.id);for(const b of p.blocks)if(b.kind==="prose")l(b.content,a.id);else{const S=c(b.exampleId,"example",a.id);Y(S.guaranteeId===p.id,"Example owner mismatch")}}for(const p of a.examples){c(p.guaranteeId,"guarantee",a.id),Y(p.columns.length>0,"Example columns required");for(const b of p.rows){Y(b.length===p.columns.length,"Example column mismatch");for(const S of b)l(S,a.id)}}for(const p of a.items){const b=c(p.sectionId,"section",a.id);Y(b.activityId===null?!a.index.some(S=>S.checkIds.includes(p.id)):a.index.some(S=>S.activityId===b.activityId&&S.checkIds.includes(p.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),Y(u(p.fields.guarantee)||u(p.fields.condition)&&u(p.fields.expectedResult),"Check guarantee required");for(const S of Object.values(p.fields))l(S,a.id);Y(b.activityId===null||a.index.some(S=>S.checkIds.includes(p.id)),"Unbound Check")}for(const p of a.notes)l(p.content,a.id);l(a.intro,a.id)}const f=e.diagnostics.filter(a=>a.startsWith("Role未確定:"));Y(new Set(f).size===f.length,"Duplicate unresolved Role diagnostic");for(const a of f)Y(d.delete(a),"Unresolved Who requires a diagnostic matching a current unresolved Activity");Y(d.size===0,"Unresolved Who requires a diagnostic");const g=new Set;for(const a of e.sources){c(a.documentId,"document");const h=a.documentId+"@"+a.revision;Y(!g.has(h),"Duplicate source descriptor"),g.add(h)}for(const a of e.externalDocuments)Y(e.sources.some(h=>h.documentId===a.id&&h.revision===a.revision),"External source revision missing"),Y(a.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+a.id);return{diagnostics:s,entities:i.size}}function su({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=(e.formatVersion==="0.5"?ca:Hr)({formatVersion:["0.5","0.6"].includes(e.formatVersion)?e.formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const r=e.business,s=[...r.objects,...r.activities],d=[...r.objects.map(f=>({...f,information:f.information.map(g=>typeof g=="string"?g:g.name),type:"object"})),...r.activities.map(f=>({id:f.id,type:"business",name:f.name,scope:f.scope,why:f.why,when:f.when,who:ei(r,f),where:f.where,result:"results"in f?f.results.map(g=>g.text).join(`
`):f.result,...f.problem===null?{}:{problem:f.problem,pain_level:f.painLevel}}))],c=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(f=>f.basedOn.documentId===r.id).map(f=>{const g=new Map(f.states.map(h=>[h.id,h.name])),a={object:s.find(h=>h.id===f.objectId).name,states:f.states.map(h=>h.name),start:f.start,terminal:f.terminal,completeness:f.completeness,source:f.source,transitions:f.transitions.map(h=>({id:h.sourceId,from:g.get(h.fromId)??h.fromId,to:g.get(h.toId)??h.toId,activity:h.activityId,...h.event?{event:h.event}:{},...h.exceptionId?{exceptionId:h.exceptionId,exception:r.exceptions?.find(m=>m.id===h.exceptionId)?.name}:{},condition:h.condition,...h.conditionLabel?{conditionLabel:h.conditionLabel}:{},effect:h.effect,path:h.path,evidence:h.evidence,note:h.note}))};return[f.objectId,{model:a}]}))),u=r.relations.map(f=>({kind:f.kind,from:f.fromId,to:f.toId,label:Pr(r,f)})),l=e.formatVersion==="0.6"?(()=>{const g=Ed(r).edges.map(a=>({kind:a.direction,from:a.direction==="input"?a.objectId:a.activityId,to:a.direction==="input"?a.activityId:a.objectId,label:a.label||(a.transferUndecided?"未決":"")}));for(const a of u)g.some(h=>h.kind===a.kind&&h.from===a.from&&h.to===a.to)||g.push(a);return g})():u;return{graph:Jr({version:1,...r.scope?{scope:r.scope}:{},nodes:d,relations:l}),sections:Object.fromEntries(d.map(f=>[f.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:r.activities.map(f=>f.id),objectStateTransitions:c,findings:[...r.findings.map(f=>({...f,displayId:f.sourceId,targets:[...f.targetIds,...f.unresolvedTargets],targetNames:[...f.targetIds,...f.unresolvedTargets].map(g=>s.find(a=>a.id===g)?.name??g)})),...Fc(r)]}}const da=8*1024*1024;function la(e){return/^\s*[\[{]/.test(e)}function Jo(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function fr(e,t){if(!e||!["0.4","0.5","0.6"].includes(e.formatVersion))throw Error("JSON専用経路はformatVersion 0.4、旧候補0.5または候補0.6が必要です（旧形式は互換入力adapter）。");Jo(e);const n=e.formatVersion==="0.5"?ou(e):Ui(e),i=e.documents.filter(r=>r.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(r=>r.kind==="checkItems"),states:e.documents.filter(r=>r.kind==="stateTransition"),concepts:e.documents.filter(r=>r.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function ru(e,t){if(!la(e)){if(t!==void 0)throw Error("案を含まない文書です。");return Fl(e)}if(new TextEncoder().encode(e).byteLength>da)throw Error("ローカルJSONは8MiB以内にしてください。");let n=Gr(e.replace(/^\uFEFF/,""));Jo(n);let i;if(n?.format==="alder-named-plans"){Tl(n);for(const s of n.plans)if(Jo(s.package),s.package.documents.filter(d=>d.kind==="businessDesign").length!==1)throw Error("業務案 "+s.id+" にはBusiness Designが1件必要です。");const o=t??n.plans[0].id,r=n.plans.find(s=>s.id===o);if(!r)throw Error("指定した業務案がありません: "+o);i={selected:o,choices:n.plans.map(({id:s,name:d})=>({id:s,name:d}))},n=r.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const o=fr(oa(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const r=o.data.business;r.schemaVersion="0.1",delete r.roles;for(const s of r.activities)"roleId"in s&&delete s.roleId;o.data.diagnostics=o.data.diagnostics.filter(s=>!s.startsWith("Role未確定:"))}return{...o,...i?{namedPlans:i}:{}}}return{...fr(n,e),...i?{namedPlans:i}:{}}}function on(e,t){return su(ru(e,t))}async function au(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>da)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!la(n))throw Error("JSONファイルの本文を確認してください。");return on(n)}const cu=(e,t)=>gs(e,t,!1);async function gs(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,r=()=>o.abort();t?.addEventListener("abort",r,{once:!0}),t?.aborted&&r();const s=setTimeout(r,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const c=d.headers.get("content-type")?.toLowerCase()??"";if(c.includes("html")||!n&&c.includes("json")||c.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const u=2*1024*1024;if(Number(d.headers.get("content-length"))>u)throw Error("本文は2MiB以内にしてください。");const l=d.body?.getReader();if(!l)throw Error("本文を読み取れません。");let f=0,g="";const a=new TextDecoder;try{for(;;){const{done:h,value:m}=await l.read();if(h)break;if(f+=m.length,f>u){try{l.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}g+=a.decode(m,{stream:!0})}g+=a.decode()}finally{l.releaseLock()}if(n&&c.includes("json")&&!/^\s*[\[{]/.test(g))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(g))throw Error("HTMLページは読み込めません。");return g}catch(d){const c=o.signal.aborted;throw r(),c?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(s),t?.removeEventListener("abort",r)}}const Gi=au;async function io(e,t){return on(await gs(e,t))}function du(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return on(e)}const oo=e=>e==="question"?"要確認":"要修正";function lu(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(r=>r.status==="open"&&r.kind===i&&r.targets.includes(t.id)).length;o&&n.push(`${oo(i)} ${o}`)}return n}function uu(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${oo(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const r=document.createElement("p");r.className="finding-reference-warning",r.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(r)}return t.append(ft(e.content)),t}function fu(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function pu(e,t,n,i=!1){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const r of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t)&&(!i||!s.id.startsWith("viewer:")))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=r.id,s.textContent=`${oo(r.kind)} · ${r.displayId??r.id}　${r.summary}`,s.onclick=()=>n({type:"finding",id:r.id}),o.append(s)}return o}function mu(e,t,n,i,o){const r=document.createElement("section");r.className="findings-index";const s=document.createElement("label");s.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),s.append(d,document.createTextNode("解消済みも表示")),r.append(s);const c=(l,f,g)=>{const a=document.createElement("button");a.className="node-navigate finding-index-row",a.dataset.findingKey=l.type+":"+l.id;const h=document.createElement("strong");h.textContent=f;const m=document.createElement("span");return m.textContent=g,a.append(h,m),a.onclick=()=>i(l),a},u=e.graph.nodes.filter(l=>(!o||l.id===o)&&typeof l.problem=="string");if(u.length){const l=document.createElement("h3");l.textContent="困りごと",r.append(l);for(const f of u)r.append(c({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[l,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const g=(e.findings??[]).filter(h=>(!o||h.targets.includes(o))&&(t||h.status==="open")&&(l==="broken"?h.unresolvedTargets.length>0:h.scope===l&&!h.unresolvedTargets.length));if(!g.length)continue;const a=document.createElement("h3");a.textContent=`${f}（${g.length}件）`,r.append(a);for(const h of g)r.append(c({type:"finding",id:h.id},`${oo(h.kind)} · ${h.displayId??h.id}${h.status==="resolved"?" · 解消済み":""}`,h.summary))}if(r.childElementCount===1){const l=document.createElement("p");l.textContent="表示する指摘はありません。",r.append(l)}return r}function hu(e){const t=Kr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((r,s)=>r===o[s]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...ec(),viewInset:[40,0],canvasOrigin:void 0}}function bu(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,r)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(r)}),n}function ys(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function gu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{ys(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function yu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(ys(t)),n.href}function vu(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return ys(t)}const vs=`# Alderを使った設計業務 — Business Design

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
`,wu=`{
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
`;function ku(e,t){const n=new Set(t.graph.nodes.map(g=>g.id)),i=new Map;for(const g of t.graph.nodes)i.set(g.name,i.has(g.name)?void 0:g.id);const o=g=>n.has(g)?g:i.get(g),r=Object.create(null);for(const[g,a]of Object.entries(e.positions)){const h=o(g);h&&(r[h]=a)}const{scroll:s,zoom:d,viewInset:c,canvasOrigin:u,showExceptions:l,selectedEdgesOnly:f}=e;return{positions:r,scroll:s,zoom:d,viewInset:c,canvasOrigin:u,showExceptions:l,selectedEdgesOnly:f,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(g=>{const a=o(g);return a?[a]:[]}))]}}}const Iu=`# Alderのチェックリストサンプル

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
`;function Su(e,t,n,i,o=()=>!0,r=()=>{}){const s=e.ownerDocument,d=s.defaultView;let c,u=0,l=0,f=!1,g=null,a="";const h=new Map,m=()=>{c!==void 0&&(d.clearTimeout(c),u=Math.max(0,u-(Date.now()-l)),c=void 0)},p=(v=!1)=>{if(v&&!o())return;m(),h.delete(a);const D=[...h].at(-1);if(D){S(D[1],"error",D[0]);return}const x=e.contains(s.activeElement);e.hidden=!0,t.textContent="",r(),x&&(g?.isConnected?g:i).focus({preventScroll:!0})},b=()=>{e.hidden||e.dataset.kind==="error"||f||s.hidden||e.contains(s.activeElement)||(m(),l=Date.now(),c=d.setTimeout(p,u))};e.addEventListener("pointerenter",()=>{f=!0,m()}),e.addEventListener("pointerleave",()=>{f=!1,b()}),e.addEventListener("focusin",v=>{const D=v.relatedTarget;D&&!e.contains(D)&&(g=D),m()}),e.addEventListener("focusout",()=>d.setTimeout(b,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),p(!0))}),s.addEventListener("visibilitychange",()=>s.hidden?m():b()),n.onclick=()=>p(!0);const S=(v,D,x)=>{m(),e.contains(s.activeElement)||(g=s.activeElement),a=x,e.dataset.kind=D,e.dataset.key=x,t.setAttribute("role",D==="error"?"alert":"status"),t.setAttribute("aria-live",D==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,r(),u=D==="warning"?8e3:5e3,b()};return(v,D="success",x="operation")=>{D==="error"&&v?(h.delete(x),h.set(x,v)):h.delete(x);const I=[...h].at(-1);if(I){if(!e.hidden&&t.textContent===I[1]&&a===I[0])return;S(I[1],"error",I[0]);return}if(!v){a===x&&p();return}!e.hidden&&t.textContent===v&&e.dataset.kind===D||S(v,D,x)}}const pr=wu,St=document.querySelector("#app");St.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const k=e=>document.getElementById(e),Wn=Xr(location.pathname);Wn.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${Wn.version}`,k("preview-badge").title=`PR #${Wn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const fi=e=>Hn(e,{"stroke-width":1.8,"aria-hidden":"true"}),yi=document.createElement("div");yi.id="source-menu";yi.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';St.append(yi);const so=document.createElement("div");so.id="checks-menu";so.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';St.append(so);const En=document.createElement("section");En.id="check-followup";En.hidden=!0;En.setAttribute("aria-labelledby","check-followup-title");En.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(En);const ro=document.createElement("div");ro.id="check-followup-menu";ro.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';St.append(ro);const Ut=document.createElement("input");Ut.type="file";Ut.id="check-file";Ut.accept=".md,.markdown,text/markdown,text/plain";Ut.hidden=!0;St.append(Ut);const sn=document.createElement("section");sn.id="check-url-dialog";sn.hidden=!0;sn.setAttribute("role","dialog");sn.setAttribute("aria-labelledby","check-url-title");sn.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';St.append(sn);const ao=document.createElement("div");ao.id="help-menu";ao.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Wn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Wn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Wn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;St.append(ao);no(k("help-menu-toggle"),ao);const oi=document.createElement("div");oi.id="url-history";yi.append(oi);function xu(){if(oi.replaceChildren(),!O.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",oi.append(e);for(const t of O.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=oe||Ne||se,n.onclick=()=>{Au(t.url)},oi.append(n)}}async function Au(e){if(!(oe||Ne||se)){if(O.document?.source?.kind==="url"&&O.document.source.url===e){we(),Ue?.reopenBusinessOverview(),O.active=O.tabs[0].key,De(),Ii();return}Ne=!0,De();try{const t=await io(e),n=Jn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await vi(n)}catch(t){t instanceof jn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ne=!1,De()}}}const Eu=no(k("open-menu-toggle"),yi),Ou=no(k("open-checks"),so,()=>{const e=Q();k("check-open-sample").hidden=!e||!xs(e),k("check-close").disabled=!e?.checks}),ua=no(k("check-followup-open"),ro,()=>{k("check-followup-sample").hidden=!Q()||!xs(Q())});for(const[e,t]of[["open-menu-toggle",Vs],["open",Vs],["open-url",tc],["open-text",nc],["view-markdown",ic],["open-checks",kr],["share-source",oc],["refresh",sc],["help-menu-toggle",rc],["drawer",ac],["node-list-toggle",cc],["node-list-close",Ir],["display-settings-toggle",Sr],["reset-layout",dc],["save-image",lc],["copy-image",uc],["out",Er],["in",Or]])k(e).prepend(fi(t));vl(document.querySelector("header"));const _o=yl(document.querySelector(".tab-strip"));let O={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Ct=!0,Zt=!1,oe=!0,Bn=!1,xn=!1,Ne=!1,mr=Promise.resolve(),hn,ye,Dt=0,se=!1,si=!1,zn=0,Hi=0,Un=!1,ws=!1,Ko=!1,hr=!1;const Xo=new Set,Yt=new Set,Ji=new Set;function fa(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ji){const i=[...O.document?[O.document]:[],...O.recovery].find(r=>r.key===n),o=t.find(r=>r.key===n&&r.draft===i?.draft);i&&o&&Ji.delete(n)}}const Q=()=>O.tabs.find(e=>e.key===O.active),On=e=>en(e)?.key??e.key,tn=e=>O.document?.key===On(e);let Zo="";const ju=Su(k("status"),k("status-text"),k("status-close"),k("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(Zo===e)return;Zo=e}ju(e,t,n)}function ks(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Is(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Bt(){oe||(Dt++,et())}function Cu(e){e.preventDefault(),e.returnValue=!0}function et(){const e=Dt>zn||Hi>0||!1||se||Ji.size>0||Ko||Un||xn,t=!oe&&e;t!==hr&&(hr=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Cu));const n=oe?"restoring":Bn?"protected":xn?"conflict":Un?"error":Ko||Ji.size>0?"draft":Hi>0||se?"saving":Dt>zn?"dirty":ws?"saved":"unchanged";St.dataset.saveState!==n&&(St.dataset.saveState=n),Bn?ks():xn?Is():Un?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),lo()}function Ss(e){Un=!0,Zo=""}function co(){if(Bn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(xn)throw new ps}async function Du(e){co();try{await Yd(e)}catch(t){throw t instanceof ps&&(xn=!0,clearTimeout(hn),hn=void 0,Is()),t}}function pa(e,t){Hi++,Xo.add(t),et();const n=mr.catch(()=>{}).then(()=>Du(e)).then(()=>{zn=Math.max(zn,t),ws=!0,fa(e),zn===Dt&&(Un=!1)},i=>{throw Ss(),i}).finally(()=>{Hi--,Xo.delete(t),et()});return mr=n.catch(()=>{}),n}function Se(e=180,t=!0){if(oe)return;if(t&&Dt++,clearTimeout(hn),hn=void 0,Bn){ks(),et();return}if(xn){Is(),et();return}if(se||Xo.has(Dt)||!t&&Dt<=zn&&!Un){et();return}const n=()=>{hn=void 0;let i;try{i=structuredClone(ms(O))}catch{Ss(),et();return}pa(i,Dt).catch(()=>et())};e===0?n():hn=window.setTimeout(n,e),et()}async function Mu(e){if(oe||ye||se||!O.tabs.includes(e))return;if(di(e)===void 0){Ue?.closeBusinessOverview();return}pt.cancel(),we();const t=O.active===e.key,n={...O,tabs:O.tabs.filter(i=>i!==e),active:t?O.tabs[0]?.key:O.active};try{await wi(()=>n,()=>{O=n}),t&&St.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{et()}}function ct(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!Q(),t=e&&O.drawer,n=e&&!!O.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Zt=!1),lo(),k("layout-lock").replaceChildren(fi(Ct?xr:Ar)),k("layout-lock").setAttribute("aria-pressed",String(Ct)),k("layout-lock").title=Ct?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",oe),k("viewport").dataset.layoutLocked=String(Ct),k("prefer-write").checked=O.preferWrite===!0,k("prefer-write").disabled=oe,k("show-exceptions").checked=Q()?.showExceptions!==!1,k("show-exceptions").disabled=oe||se||!Q()||ye===Q(),k("selected-edges-only").checked=Q()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=oe||se||!Q()||ye===Q(),document.documentElement.dataset.theme=O.dark?"dark":"light",k("theme").replaceChildren(fi(O.dark?gc:yc)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(O.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",oe||!e),k("node-list-drawer").hidden=!n||dt().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",oe||!e),Ue?.syncChrome()}function Yo(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!Q(),t.disabled=si||oe||!Q()||ye===Q(),t.setAttribute("aria-busy",String(si))}}function lo(){Yo(),document.querySelector(".toolbar").dataset.settingsOpen=String(Zt),k("display-options").hidden=!Zt,k("reset-layout").disabled=oe||Ne||se||!1||!Q()||Yt.has(O.document?.key??"")||Bn||xn;const e=k("display-settings-toggle"),t=Zt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Zt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=oe||se||!Q()||ye===Q()}function ma(e,t=!1){const n=Q();oe||se||!n||ye===n||e===Zt||(e&&(Gn.delete(en(n)?.key??n.key),uo()),pt.cancel(),qe=void 0,we(),Zt=e,lo(),Ft(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function ha(e){const t=Q();if(!(si||oe||!t||ye===t)){si=!0,Yo();try{const n=Ol(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Dl(n),$e("グラフ全体のPNGをコピーしました。")):await Cl(n,(en(t)?.name??t.name)+(di(t)?" - "+di(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{si=!1,Yo()}}}k("save-image").onclick=()=>ha(!1);k("copy-image").onclick=()=>ha(!0);k("display-settings-toggle").onclick=()=>ma(!Zt);k("reset-layout").onclick=()=>{const e=Q();if(oe||Ne||se||ye||!e||Yt.has(On(e)))return;try{co()}catch{et();return}pt.cancel(),fn.cancel(),qe=void 0,we();const t={...e,design:eo(e)},n=hu(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),ka.invalidate(e),De(),n!==t&&Se()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Zt&&k("source-dialog").hidden&&(e.preventDefault(),ma(!1,!0))});function we(e=!0){const t=Q();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Bt(),Se(180,!1)),i}function ba(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function Qo(){Eu.close(),Ou.close(),ua.close(),_o.close(),ba(Ru),_o.update()}function Ru(){const e=k("tabs");e.replaceChildren(),O.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===O.active?" active":""),n.draggable=di(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Fi(t)!==void 0&&(n.dataset.activity=Fi(t)),Bi(t)!==void 0&&(n.dataset.object=Bi(t));const i=document.createElement("button");Po(i,"business",t.name),i.setAttribute("aria-current",String(t.key===O.active)),i.disabled=se,i.onclick=async()=>{if(se||Rt&&Rt!==t.key&&!await ki())return;const r=we()||O.active!==t.key;Ue?.activateBusiness(),O.active=t.key,De(),Ue?.businessActivated(),Se(180,r)};const o=To("業務設計："+t.name+"を閉じる");o.disabled=se,o.onclick=()=>Mu(t),n.append(i,o),n.ondragstart=r=>r.dataTransfer?.setData("text/plain",t.key),n.ondragover=r=>r.preventDefault(),n.ondrop=r=>{if(r.preventDefault(),se)return;const s=O.tabs.findIndex(c=>c.key===r.dataTransfer?.getData("text/plain")),d=O.tabs.indexOf(t);if(s>0&&d>0&&s!==d){const[c]=O.tabs.splice(s,1);O.tabs.splice(d,0,c),Qo(),Se()}},n.onkeydown=r=>{if(!se&&r.altKey&&(r.key==="ArrowLeft"||r.key==="ArrowRight")){r.preventDefault();const s=O.tabs.indexOf(t),d=s+(r.key==="ArrowLeft"?-1:1);s>0&&d>0&&d<O.tabs.length&&([O.tabs[s],O.tabs[d]]=[O.tabs[d],O.tabs[s]],Qo(),Se())}},e.append(n)})}const br=new Map,Gn=new Set;function uo(){const e=Q(),t=!!e&&e.design.sourceFormat!=="json"&&Gn.has(en(e)?.key??e.key)&&!e.checks;t||(ua.close(),En.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),En.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=oe||Ne||se||!1||!e||gn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=Q();e&&Gn.delete(en(e)?.key??e.key),uo()};let es;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{es=k("check-followup-open"),k(t).click(),es=void 0};function xs(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===vs}function gn(e){const t=en(e)?.key??e.key;let n=br.get(t);return n||(n={},br.set(t,n)),n}async function As(e,t){if(!tn(e))throw Error("原本文書が切り替わりました。");const n=zt(O,O.recovery,{...O.document,checks:t},ms(O).views);await wi(()=>n,()=>{O=n,t&&Gn.delete(en(e)?.key??e.key)})}async function ga(e,t){const n=gn(e);if(e.design.sourceFormat==="json"||n.busy||se||oe||ye===e)return;const i=li(e);n.busy=!0,n.error=void 0,n.candidate=void 0,nn();try{const o=await t();if(!tn(e))return;if(i!==li(O.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const r=Fn(o),s=ui(r,O.tabs[0]);if(s.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+s.reason);s.state==="unverified"?n.candidate=o:(await As(e,o),n.candidate=void 0,Ue?.openRelatedChecks(Q()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,$e(n.error,"error")}finally{n.busy=!1,nn()}}async function ya(e,t){const n=gn(e);if(n.busy||se||!tn(e))return;const i=ui(Fn(t),O.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,nn();return}n.busy=!0,n.error=void 0;try{await As(e,{...t,confirmedFor:li(O.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(Q()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,nn()}}function nn(){uo();const e=Q(),t=k("detail"),n=e?gn(e):void 0,i=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=oe||se||ye===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,r=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const s=e.design.graph.nodes.find(f=>f.id===e.selected),d=gl(e,n,{disabled:oe||se||ye===e,redraw:nn,confirm:f=>{ya(e,f)}}),c=document.createElement("div");c.className="right-drawer-heading";const u=Vc(s?.name??"業務設計");if(s){const f=s.type==="business"?va(String(s.who),s.id):Nr(s);f.classList.add("drawer-node-icon"),u.prepend(f)}c.append(u);const l=document.createElement("button");if(l.type="button",l.id="business-drawer-close",l.setAttribute("aria-label","右ドロワーを閉じる"),l.textContent="×",l.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},c.append(l),t.append(c),d.hasChildNodes()&&t.append(d),s){const f=pu(e.design,s.id,_i,s.type==="business");f.hasChildNodes()&&t.append(f)}t.append(Rd(e.design,s?.id,f=>_i({type:"finding",id:f}))),s?.type==="business"&&Ue?.appendActivityTestLinks(t,s.id),t.scrollTop=r,o&&document.getElementById(o)?.focus({preventScroll:!0})}const gr=new Map,dt=()=>{const e=O.active??"";let t=gr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},gr.set(e,t)),t};function _i(e){if(!Q())return;const t=dt();t.mode="findings",t.finding=e,O.nodeDrawer=!0,innerWidth<=800&&(O.drawer=!1),ct(),kt(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Se()}function Lu(e){const t=Q();if(!t)return;const n=dt();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){_i(i[0]);return}O.nodeDrawer=!0,innerWidth<=800&&(O.drawer=!1),ct(),kt(),k("drawer-mode-findings").focus({preventScroll:!0}),Se()}function Nu(e,t){const n=dt().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return dt().finding=void 0,!1;const r=document.createElement("button");if(r.className="node-navigate finding-back",r.textContent="← 指摘一覧に戻る",r.onclick=()=>{dt().finding=void 0,kt(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(r),i)t.append(uu(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,ft(String(o.problem)))}const s=i?.targets??[o.id];if(s.length){const d=document.createElement("section"),c=document.createElement("h3");c.textContent="関連項目へ移動",d.append(c);for(const u of s){const l=document.createElement("button");l.className="node-navigate finding-target-link",l.dataset.findingTarget=u;const f=e.design.graph.nodes.some(a=>a.id===u),g=e.hiddenNodes?.includes(u);l.disabled=!f||!!g,l.textContent=(e.design.graph.nodes.find(a=>a.id===u)?.name??u)+(f?g?"（非表示）":"":"（参照先なし）"),l.onclick=()=>Ti(u,!0),d.append(l)}t.append(d)}return!0}function va(e,t){let n=0;for(const s of e)n=n*31+s.codePointAt(0)>>>0;const i=document.createElement("span");i.className="who-badge",i.style.setProperty("--role-color",(t&&Q()?.design.model?.business.roles?ds(Q().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true");const o=Q()?.design.model?.business.activities.find(s=>s.id===t),r=o&&"who"in o&&typeof o.who=="object"?o.who?.kind:void 0;return i.append(fi(r==="system"?vc:r==="scheduler"?wc:Dr)),i}function fo(e,t=!0){oe||!Q()||(pt.cancel(),we(),O.nodeDrawer=e,e&&dt().mode==="findings"&&innerWidth<=800&&(O.drawer=!1),ct(),e&&Q()?.selected&&_n(Q().selected),kt(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Se())}function _n(e){const t=Q(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=dt();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(Uc(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(r=>r.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function Pu(e,t){const n=Q();if(!n||oe||se||ye===n)return;pt.cancel(),qe=void 0,we();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],yn(),Se()}function Ti(e,t=!1){let n=Q();if(n&&!eo(n).graph.nodes.some(f=>f.id===e)&&(we(),Ue?.reopenBusinessOverview(),O.active=O.tabs[0].key,n=Q(),De()),!n||n.hiddenNodes?.includes(e)||ye===n)return;t||(dt().finding=void 0);const i=k("node-list").contains(document.activeElement);pt.cancel(),qe=void 0,we(),n.selected=e,_n(e),ct(),yn();const o=k("viewport"),r=o.getBoundingClientRect(),s=k("formattedMarkdownDrawer").getBoundingClientRect(),d=O.drawer&&s.left>r.left&&s.left<r.right?s.left:r.right,c=Math.max(1,Math.min(o.clientWidth,d-r.left-o.clientLeft)),u=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const l=n.positions[e];if(n.scroll=[(l[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-c/2,(l[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-u/2],Ft(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],we(),i){const f=t?"[data-finding-target]":"[data-list-node]",g=Array.from(k("node-list").querySelectorAll(f)).find(a=>(t?a.dataset.findingTarget:a.dataset.listNode)===e);(t?g:g?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Se()}function kt(){const e=Q(),t=dt(),n=k("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const r=k("drawer-modes");r.replaceChildren();for(const h of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+h,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===h)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===h?0:-1,m.textContent=`指摘（${e?fu(e.design):0}）`;const p=()=>{t.mode=h,kt(),k("drawer-mode-"+h).focus({preventScroll:!0})};m.onclick=p,m.onkeydown=b=>{["ArrowLeft","ArrowRight","Home","End"].includes(b.key)&&(b.preventDefault(),m.focus({preventScroll:!0}))},r.append(m)}for(const h of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])h.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const s=k("node-list-search");s.value=t.search,s.disabled=!e||oe;const d=k("node-categories");d.replaceChildren();for(const[h,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const p=document.createElement("button");p.dataset.category=h,p.id="node-category-"+h,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.category===h)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.category===h?0:-1,p.textContent=m,p.onclick=()=>{t.category=h,kt(),k("node-category-"+h).focus({preventScroll:!0})},p.onkeydown=b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;b.preventDefault();const S=["activity","object","role"],v=S.indexOf(h);t.category=b.key==="Home"?"activity":b.key==="End"?"role":S[(v+(b.key==="ArrowRight"?1:2))%3],kt(),k("node-category-"+t.category).focus({preventScroll:!0})},d.append(p)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const c=new Set(e?.hiddenNodes??[]),u=e?.design.graph.nodes.filter(h=>h.scope===!1)??[],l=u.filter(h=>!c.has(h.id)).length,f=k("scope-outside"),g=l===u.length?"true":l===0?"false":"mixed";f.setAttribute("aria-pressed",g),f.setAttribute("aria-label",g==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(fi(g==="false"?kc:Ic)),f.disabled=!u.length||oe||ye===e;const a=k("show-outside");if(a.checked=g==="true",a.indeterminate=g==="mixed",a.setAttribute("aria-checked",g),a.disabled=f.disabled,k("scope-count").textContent=g==="mixed"?`${l}/${u.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(Nu(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const h=document.createElement("p");h.textContent=(e.design.graph.nodes.find(p=>p.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,kt(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(h,m)}n.append(mu(e.design,t.resolved,h=>{t.resolved=h,kt(),n.querySelector("input")?.focus({preventScroll:!0})},_i,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>fo(!O.nodeDrawer);k("node-list-close").onclick=()=>fo(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),fo(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),fo(!1))});k("node-list-search").oninput=()=>{dt().search=k("node-list-search").value,kt()};function wa(){const e=Q();if(e){const t=e.design.graph.nodes.filter(n=>n.scope===!1);Pu(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=wa;k("show-outside").onchange=wa;const Tu="http://www.w3.org/2000/svg",Do=e=>document.createElementNS(Tu,e),ka=new Uo,yr=new WeakMap;function qu(e){if(!Lr(e.graph))return;let t=yr.get(e);return t||(t=Xd(e),yr.set(e,t)),t.wires}function $u(e,t,n){as(k("edges"),e,t,{"data-relation":String(n)})}let pi=()=>{},Kt=[0,0],un=[0,0];function Wu(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function zu(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Ft(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(f=>f[0])),Math.min(0,...i.map(f=>f[1]))],r=[o[0]<0||n[0]>0?Math.min(o[0],un[0]):0,o[1]<0||n[1]>0?Math.min(o[1],un[1]):0],{growth:s,origin:d}=bc(n,r,e.zoom),c=s.some(Boolean);c&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+s[0],e.scroll[1]+s[1]],Bt(),Se(180,!1));const u=Math.ceil(Math.max(1400,Kt[0],(Wu()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(f=>f[0]+340))),l=Math.max(850,Kt[1],Math.max(Kt[1],...i.map(f=>f[1]+68))+zu()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(f=>f[1]+220));k("canvas").style.width=(u+d[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(l+d[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(d[0]+t[0])*e.zoom+"px",k("nodes").style.top=(d[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=u+"px",k("nodes").style.height=l+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${u+d[0]} ${l+d[1]}`),k("edges").style.width=(u+d[0])*e.zoom+"px",k("edges").style.height=(l+d[1])*e.zoom+"px",c&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function yn(){ba(Uu)}function Uu(){lo(),fn.cancel(),pi=()=>{},Kt=[0,0],un=[0,0];const e=Q();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,nn(),kt();return}const t=eo(e),n=t.graph.nodes,i=n.filter(l=>!e.hiddenNodes?.includes(l.id)),o=new Set(i.map(l=>l.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const r=e.selected,s=e.positions,d=Wi(t.graph.relations,r);Ft(e),k("edges").append(rs());const c=bu(t.graph.relations,O.preferWrite===!0),u=()=>{const l=n.flatMap(p=>{const b=s[p.id];return b?[{id:p.id,x:b[0],y:b[1],width:260,height:68}]:[]}),f=qu(t),g=ka.update(e,t,l,t.graph.relations,f),a=new Map;for(Kt=[0,0],un=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const h=new Map(e.design.graph.nodes.map(p=>[p.id,p.name]));t.graph.relations.forEach((p,b)=>{if(c.has(b))return;const S=g[b];if(!S||(Kt[0]=Math.max(Kt[0],S.bounds.right+20,S.label[0]+Math.max(30,p.label.length*12)/2+12),Kt[1]=Math.max(Kt[1],S.bounds.bottom+20,S.label[1]+22),un[0]=Math.min(un[0],...S.points.map(M=>M[0]-20),S.label[0]-Math.max(30,p.label.length*12)/2-12),un[1]=Math.min(un[1],...S.points.map(M=>M[1]-20),S.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(p)||!o.has(p.from)||!o.has(p.to)||e.showExceptions===!1&&(p.kind==="business-exception"||p.kind==="object-exception")))return;const v=Do("path");v.setAttribute("d",S.path),v.dataset.relation=String(b),v.dataset.collisions=String(S.collisions),v.dataset.rerouted=String(S.rerouted),v.dataset.fallback=String(S.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),p.kind.endsWith("exception")&&v.classList.add("exception"),d.related(p)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),d.muted(p)&&v.classList.add("muted");const D=Do("title");D.textContent=(h.get(p.from)??p.from)+" → "+(h.get(p.to)??p.to)+": "+p.label,v.append(D),k("edges").append(v),p.kind.endsWith("exception")&&$u(v,S,b);const x=Rr(p,b,f?.[b]),I=a.get(x);if(I){I.dataset.relations+=" "+b,d.related(p)&&(I.classList.add("review-related"),I.classList.remove("muted"));return}const A=Do("text");a.set(x,A),A.dataset.relations=String(b),A.setAttribute("x",String(S.label[0]-Math.max(30,p.label.length*12)/2)),A.setAttribute("y",String(S.label[1])),A.setAttribute("text-anchor","start"),A.classList.add("edge-label"),A.setAttribute("dominant-baseline","middle"),A.dataset.relation=String(b),d.related(p)&&A.classList.add("review-related"),d.muted(p)&&A.classList.add("muted"),A.textContent=p.label,k("edges").append(A)});const m=k("edges");for(const p of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(p);Ft(e)};pi=u,u(),i.forEach(l=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+l.type+(l.scope===!1?" outside":l.scope===null?" scope-undecided":"")+d.nodeClasses(l.id),f.dataset.node=l.id,l.type==="business"&&(f.dataset.activity=l.id),f.style.left=s[l.id][0]+"px",f.style.top=s[l.id][1]+"px",l.type==="business"?f.append(va(String(l.who),l.id)):f.append(Nr(l));const g=document.createElement("span");g.className="node-text";const a=document.createElement("span");a.className="review-kind",a.textContent=(l.type==="business"?"Activity":"Object")+(l.scope===null?" · 範囲未決":l.scope?" · 範囲内":" · 範囲外"),g.append(a);const h=document.createElement("span");if(h.className="node-name",h.textContent=l.name,g.append(h),l.type==="business"){const v=document.createElement("small");v.textContent=String(l.who),g.append(v)}if(f.append(g),Sc(l.id,di(e))){const v=document.createElement("button");v.type="button",v.className=l.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",l.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=D=>D.stopPropagation(),v.onpointerup=D=>D.stopPropagation(),v.onclick=D=>{D.stopPropagation(),l.type==="business"?ts(l.id):Ia(l.id),Ue?.businessActivated()},f.append(v)}f.title=l.name+(l.type==="business"?" — "+String(l.who):""),f.setAttribute("aria-label",f.title+(l.id===r?"（選択中）":""));const m=lu(e.design,l);if(m.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=m.join(" · "),v.setAttribute("aria-label",l.name+"の指摘を開く"),v.onpointerdown=D=>D.stopPropagation(),v.onpointerup=D=>D.stopPropagation(),v.onclick=D=>{D.stopPropagation(),Lu(l.id)},f.append(v),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+m.join("、"))}let p;const b=f;b.onpointerdown=v=>{v.button!==0||ye===e||Ct||(v.stopPropagation(),b.setPointerCapture(v.pointerId),p=v.pointerId,fn.begin(l.id,[v.clientX,v.clientY]))},b.onpointermove=v=>{p===void 0||v.pointerId!==void 0&&v.pointerId!==p||!f.isConnected||ye===e||fn.move([v.clientX,v.clientY])},b.onpointerup=v=>{if(p===void 0||p!==v.pointerId||(p=void 0,!f.isConnected||ye===e))return;const D=fn.end();b.hasPointerCapture?.(v.pointerId)&&b.releasePointerCapture(v.pointerId),D&&(D.moved||(dt().finding=void 0,e.selected!==l.id&&(e.selected=l.id,Bt()),_n(l.id)),we(),yn(),Se(180,!1))};const S=v=>{p===void 0||p!==v.pointerId||(p=void 0,f.isConnected&&(fn.cancel(),we(),Se(180,!1)))};b.onpointercancel=S,b.onlostpointercapture=S,k("nodes").append(f)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",nn(),kt()}function ts(e){oe||se||ye||(we(),al(O,e),De(),Se(),k("viewport").focus({preventScroll:!0}))}function Ia(e){oe||se||ye||(we(),cl(O,e),De(),Se(),k("viewport").focus({preventScroll:!0}))}function De(){Sa(),document.title=O.document?O.document.name+" · Alder Viewer":"Alder Viewer",pt.cancel(),qe=void 0,ct(),Qo(),yn();const e=Q();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",oe||se||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Yt.has(On(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",oe||Ne||se||!1||!e||Yt.has(On(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",oe||Ne||se||!1||!e||!!(e&&gn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",oe||Ne||se);k("open-sample").setAttribute("aria-disabled",String(oe||Ne||se)),k("open-sample").tabIndex=oe||Ne||se?-1:0,k("theme").toggleAttribute("disabled",oe),bi(),uo(),xu(),ho(),Ue?.syncDocument()}function Sa(){const e=k("header-title"),t=O.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{Vu(n.value)},e.append(n));const i=Array.from(n.options).map(o=>[o.value,o.textContent]);JSON.stringify(i)!==JSON.stringify(t.choices.map(({id:o,name:r})=>[o,r]))&&n.replaceChildren(...t.choices.map(({id:o,name:r})=>{const s=document.createElement("option");return s.value=o,s.textContent=r,s})),n.value=t.selected,n.title=t.choices.find(o=>o.id===t.selected)?.name??"",n.disabled=oe||Ne||se||!1}async function Vu(e){const t=O.document;if(!t?.design.namedPlans||oe||Ne||se||ye||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),i=document.activeElement===n;try{if(!k("source-dialog").hidden&&!await ki()){Sa();return}const o=on(t.design.markdown,e),r=crypto.randomUUID(),s=zt({...O,tabs:[],active:r},O.recovery,{...t,design:o},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await wi(()=>s,()=>{O=s}),Ue?.reopenBusinessOverview(),Ue?.activateBusiness(),Ue?.businessActivated(),$e("")}catch(o){De(),o instanceof jn||$e("案を切り替えられません: "+o.message,"error")}finally{i&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function vi(e){const t=O.document,n=sl(O,e);return t?(await wi(()=>n,()=>{O=n,Gn.add(en(O.tabs[0])?.key??O.tabs[0].key)}),!0):(we(),O=n,Gn.add(en(O.tabs[0])?.key??O.tabs[0].key),De(),Se(),!0)}async function xa(e,t){if(Rt&&!await ki())return;const n=await Gi(e),i=Q();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await mi(i,n,t))return;Ue?.reopenBusinessOverview(),O.active=O.tabs[0].key,De(),Se();return}const o=Jn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await vi(o)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(oe||Ne||se))try{if(O.document?.source?.kind==="sample"&&O.document.design.markdown===pr){we(),Ue?.reopenBusinessOverview(),O.active=O.tabs[0].key,De(),k("viewport").focus({preventScroll:!0});return}const t=on(pr),n=O.document?.source?.kind==="sample"&&O.document.design.markdown===vs?O.tabs[0]:void 0;n&&we();const i=n??O.sampleLayout,o=i?ku(i,t):{},r=Jn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await vi(r)&&k("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(oe||Ne||se)){Ne=!0,De();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await xa(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Ne=!1,De()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(oe||Ne||se)){Ne=!0,De();try{for(const t of Array.from(e.files??[]))await xa(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Ne=!1,De()}};class jn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function wi(e,t){if(se||ye)throw Error("表示を切り替えています。完了後に再試行してください。");try{co()}catch(o){throw new jn(o)}we(),clearTimeout(hn),hn=void 0,se=!0,Dt++;const n=Dt;De(),et();let i=!1;try{const o=structuredClone(ms(e()));await pa(o,n);const r=O;t(),O!==r&&(O=dl(O,r)),at==="view"&&Rt&&!O.tabs.some(s=>s.key===Rt)&&(Rt=O.tabs[0]?.key),fa(o),i=!0}catch(o){throw Ss(),new jn(o)}finally{se=!1,De(),et(),i&&Dt!==n&&Se(0,!1)}}async function mi(e,t,n=e.handle,i=!1){if(!tn(e)||e.design!==O.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=on(t.markdown,e.design.namedPlans.selected));const o=!!e.design.namedPlans!=!!t.namedPlans,r=crypto.randomUUID(),s=O.document,d=o&&s?zt({...O,tabs:[],active:r},O.recovery,{...s,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:r,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):rl(O,t,n,i);return await wi(()=>d,()=>{O=d}),An=void 0,ho(),$e(""),!0}async function vr(e){if(!tn(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await mi(e,await Gi(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const r=()=>{o.remove(),n()};o.oncancel=r,o.onchange=async()=>{try{const s=o.files?.[0];s&&await mi(e,await Gi(s)),r()}catch(s){o.remove(),i(s)}},o.click()})}k("refresh").onclick=async()=>{const e=Q();if(oe||se||ye||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Yt.has(On(e)))return;Rt===e.key&&Xi();const t=On(e);Yt.add(t),De();try{if(e.source?.kind==="url"){const i=await io(e.source.url);await mi(e,i);return}if(!e.handle){await vr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!tn(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await vr(e);return}await mi(e,await Gi(await e.handle.getFile()))}catch(n){tn(e)&&n.name!=="AbortError"&&!(n instanceof jn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Yt.delete(t),De()}};let at="text",Rt,Qt=!1,bn=0,Ki,ns=null;const Vt=()=>k("source-text"),hi=()=>k("source-url");function Es(){Ko=!k("source-dialog").hidden&&at!=="view"&&(at==="text"?Vt().value:hi().value)!=="",et()}hi().addEventListener("input",Es);function bi(){is();const e=at==="view",t=Qt||se;Vt().disabled=t,Vt().readOnly=e,k("source-dialog").dataset.mode=at,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=se||t&&at!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",Es(),queueMicrotask(Oa)}function Os(e,t){if(!(oe||Ne||se||t&&Yt.has(On(t)))){Ki?.abort(),bn++,at=e,Rt=t?.key,Qt=!1,ns=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${O.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Vt().value=t.design.markdown:e==="text"&&(Vt().value=po),bi(),(e==="url"?hi():Vt()).focus()}}let po="",Ni;function Fu(){if(ns?.isConnected&&ns.focus({preventScroll:!0}),Ni!==void 0&&cancelAnimationFrame(Ni),at!=="view")return;const e=bn;Ni=requestAnimationFrame(()=>{if(Ni=void 0,e!==bn||!k("source-dialog").hidden)return;const t=window.visualViewport,n=St.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Xi(){bn++,Ki?.abort(),Qt=!1,Rt=void 0,k("source-dialog").hidden=!0,bi(),Fu()}async function ki(){return se?!1:(at==="text"&&(po=Vt().value),Xi(),!0)}function Aa(){return ki()}Vt().oninput=()=>{at==="text"&&(po=Vt().value,Es())};let qi=!1;function Ea(){return oe||Ne||Qt||se||ye?"読込が終わってから共有してください。":gu(Q())}function is(){const e=Ea(),t=k("share-source");t.hidden=!Q(),t.setAttribute("aria-disabled",String(qi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(qi)return;const e=Ea();if(e){$e(e,"warning");return}const t=Q();if(t.source?.kind!=="url")return;const n=t.source.url,i=yu(location.href,n);qi=!0,is();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{qi=!1,is()}};let _t,Pn=0,wr=0,ri;function Oa(){if(oe||Ne||Qt||ye||se||_t||ri===void 0)return;const e=ri;ri=void 0,js(e)}async function js(e=location.hash){const t=e;if(oe)return;const n=++wr;if(!/^#source(?:=|$)/.test(t)){ri=void 0,_t&&!se&&(_t.abort(),_t=void 0,Pn++,Ne=!1,De());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),se){ri=t;return}if(Qt||Ne&&!_t){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++Pn;_t?.abort();try{const o=vu(t);co();const r=O.tabs.find(u=>u.source?.kind==="url"&&u.source.url===o),s=r;if(s){if(Rt&&Rt!==s.key&&!await ki()||i!==Pn||n!==wr)return;const u=we()||O.active!==s.key;O.active=s.key,De(),Se(180,u),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),Ii();return}_t=new AbortController,Ne=!0,De();const d=await io(o,_t.signal);if(i!==Pn)return;const c=Jn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await vi(c))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===Pn&&!(o instanceof jn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===Pn&&(_t=void 0,Ne=!1,De(),Oa())}}window.addEventListener("hashchange",()=>{js().then(()=>{O.document?.key===os&&Ii()})});function Cs(e){O.drawer=!0,ct(),nn()}async function Bu(e){const t=gn(e);if(!(e.design.sourceFormat==="json"||t.busy||se||oe||ye===e)){t.busy=!0;try{await As(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,nn()}}}let Zi;Ut.onchange=()=>{const e=Ut.files?.[0],t=Zi??Q();Zi=void 0,Ut.value="",!(!e||!t||!tn(t))&&(Cs(),ga(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ut.oncancel=()=>{Zi=void 0};k("check-open").onclick=()=>{Zi=Q(),Ut.click()};let Ds,$i=null;function Ms(){sn.hidden=!0,Ds=void 0,($i&&!$i.closest("[hidden]")?$i:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=Q();e&&($i=es??document.activeElement,Ds=e,k("check-url").value=gn(e).url??"",sn.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=Ms;sn.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Ms())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=Ds;if(!t||!tn(t))return;const n=k("check-url").value.trim();gn(t).url=n,Ms(),Cs(),ga(t,async()=>({name:n,url:n,markdown:await cu(n)}))};k("check-open-sample").onclick=()=>{const e=Q();!e||!xs(e)||(Cs(),ya(e,{name:"チェックリストのサンプル",markdown:Iu}))};k("check-close").onclick=()=>{const e=Q();e&&Bu(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=Q();e&&Os("view",e)};k("open-url").onclick=()=>Os("url");k("open-text").onclick=()=>Os("text");k("source-cancel").onclick=()=>Aa();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Aa())};k("source-submit").onclick=async()=>{if(Qt||se||at==="view"&&ye||k("source-dialog").hidden||at==="view")return;Qt=!0,bi();const e=++bn,t=at;Ki=new AbortController;try{const n=at==="url"?new URL(hi().value.trim()).href:hi().value.trim();if(t==="url"&&O.document?.source?.kind==="url"&&O.document.source.url===n){Ue?.reopenBusinessOverview(),O.active=O.tabs[0].key,Xi(),De(),Ii();return}const i=t==="url"?await io(n,Ki.signal):du(Vt().value),o=i.markdown;if(e!==bn)return;const r=Jn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await vi(r))return;$e(""),t==="text"&&(po=o),Xi()}catch(n){e===bn&&!(n instanceof jn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===bn&&(Qt=!1,bi())}};k("layout-lock").onclick=()=>{oe||(pt.cancel(),qe=void 0,we(),Ct=!Ct,ct(),yn())};k("selected-edges-only").onchange=()=>{const e=Q();!e||oe||se||ye===e||(pt.cancel(),qe=void 0,we(),e.selectedEdgesOnly=k("selected-edges-only").checked,pi(),Se())};k("show-exceptions").onchange=()=>{const e=Q();!e||oe||se||ye===e||(pt.cancel(),qe=void 0,we(),e.showExceptions=k("show-exceptions").checked,pi(),Se())};k("prefer-write").onchange=()=>{oe||(we(),O.preferWrite=k("prefer-write").checked,yn(),Se())};k("theme").onclick=()=>{oe||(O.dark=!O.dark,ct(),Se())};k("drawer").onclick=()=>{oe||!Q()||(we(),O.drawer=!O.drawer,De(),Se())};for(const[e,t]of[["in",Fs],["out",1/Fs]])k(e).onclick=()=>{const n=Q();if(n&&ye!==n){const i=we(),o=fc({zoom:n.zoom,scroll:n.scroll},t).zoom,r=i||o!==n.zoom;n.zoom=o,De(),Se(180,r)}};const Oe=k("viewport");function ja(e,t){const n=Q();if(!n||se||ye===n)return;we();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Bt();const o=Array.from(k("nodes").children).find(r=>r.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),pi()}const fn=hc({read:()=>{const e=Q();return e&&!se&&e!==ye&&!Ct&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[Oe.scrollLeft,Oe.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>Q()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=Oe.getBoundingClientRect(),t=e.left+Oe.clientLeft,n=e.top+Oe.clientTop,i={left:t,top:n,right:t+Oe.clientWidth,bottom:n+Oe.clientHeight};for(const[r,s]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=k(r),c=d.getBoundingClientRect();d.hidden||c.bottom<=n||c.top>=i.bottom||(s==="right"&&c.left>i.left&&c.left<i.right&&(i.right=c.left),s==="left"&&c.right>i.left&&c.right<i.right&&(i.left=c.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:ja,pan:e=>{const t=Q();if(!t||t===ye||Ct)return;we();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],Ft(t),Oe.scrollLeft=t.scroll[0],Oe.scrollTop=t.scroll[1],we(),Bt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),pt=pc(Oe,{nodeDrag:fn,read:()=>{const e=Q();return e&&!se&&ye!==e?{key:e.key,zoom:e.zoom,locked:Ct,scroll:[Oe.scrollLeft,Oe.scrollTop]}:void 0},position:e=>Q()?.positions[e],change:e=>{const t=Q();if(!t||se||ye===t)return;const n=t.scroll;let i=!1;e.node&&ja(e.node.id,e.node.position),e.selected&&(dt().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,_n(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?yn():e.zoom!==void 0&&Ft(t),e.scroll&&(Oe.scrollLeft=e.scroll[0],Oe.scrollTop=e.scroll[1]),we(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Bt()},finish:()=>{const e=Q();e&&Ft(e),we(),Se(180,!1)}}),Rs=()=>{pt.cancel(),qe=void 0,we(),Se(0,!1)};window.addEventListener("blur",Rs);window.addEventListener("pagehide",Rs);document.addEventListener("visibilitychange",()=>{document.hidden&&Rs()});Oe.onscroll=()=>{we()};let qe;mc(Oe,{read:()=>{const e=Q();return e&&!oe&&!se&&e!==ye?{zoom:e.zoom,scroll:[Oe.scrollLeft,Oe.scrollTop]}:void 0},change:e=>{const t=Q();!t||se||t===ye||(pt.cancel(),fn.cancel(),qe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Ft(t),Oe.scrollLeft=t.scroll[0],Oe.scrollTop=t.scroll[1],we(!1),Bt(),Se(180,!1))}});Oe.onpointerdown=e=>{const t=Q(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||se||t===ye||n&&!Ct||(qe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[Oe.scrollLeft,Oe.scrollTop],node:n,moved:!1},Oe.setPointerCapture(e.pointerId))};Oe.onpointermove=e=>{if(qe&&qe.pointer===e.pointerId&&qe.key===Q()?.key&&Q()!==ye){const t=e.clientX-qe.x,n=e.clientY-qe.y;Math.hypot(t,n)>3&&(qe.moved=!0),Oe.scrollLeft=qe.scroll[0]-t,Oe.scrollTop=qe.scroll[1]-n,we()}};Oe.onpointerup=e=>{if(!qe||qe.pointer!==e.pointerId)return;const t=Q(),n=qe;qe=void 0,Oe.hasPointerCapture?.(e.pointerId)&&Oe.releasePointerCapture(e.pointerId),t&&t!==ye&&n.key===t.key&&!n.moved&&n.node&&(dt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Bt()),_n(n.node),yn()),we(),Se(180,!1)};Oe.onpointercancel=()=>{qe=void 0};Oe.addEventListener("lostpointercapture",e=>{e.target===Oe&&qe?.pointer===e.pointerId&&(qe=void 0)});let mo=!1;k("resize").onpointerdown=e=>{oe||(mo=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(mo){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==O.width&&(O.width=t,Bt()),ct()}};k("resize").onpointerup=()=>{mo=!1,Se(180,!1)};k("resize").onpointercancel=()=>{mo=!1,Se(180,!1)};k("resize").onkeydown=e=>{if(!oe&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,O.width+(e.key==="ArrowLeft"?20:-20)));t!==O.width&&(O.width=t,Bt()),ct(),Se(180,!1)}};window.addEventListener("resize",()=>{ct();const e=Q();e&&Ft(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=Q();t&&Ft(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function Pi(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=on(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Fn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Kn=document.createElement("section");Kn.id="source-update-notice";Kn.className="info-bar";Kn.hidden=!0;Kn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Kn);let An;const Ca=new Set;let Mo=0,os,Ro;function ho(){const e=O.document;Kn.hidden=!An||An.key!==e?.key||An.baseline!==e.design.markdown||Ca.has(e.key),k("source-update-refresh").disabled=oe||Ne||se||!!(e&&Yt.has(e.key))}k("source-update-close").onclick=()=>{An&&Ca.add(An.key),ho()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function Ii(){const e=O.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(Ro===t)return;Ro=t;const n=++Mo,i=e.key,o=e.source.url,r=e.design.markdown;try{const s=await gs(o);if(n!==Mo||O.document?.key!==i||O.document.design.markdown!==r||O.document.source?.kind!=="url"||O.document.source.url!==o)return;on(s),An=s.replace(/\r\n?/g,`
`)!==r.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:r}:void 0,ho()}catch{}finally{n===Mo&&(Ro=void 0)}}Ue=zd(St,{rightDrawer:{isOpen:()=>O.drawer,isReady:()=>!oe,setOpen:e=>{oe||(O.drawer=e,ct(),Se())}},capture:()=>{we(),pt.cancel(),qe=void 0},business:()=>({key:O.document?.design.namedPlans?JSON.stringify([O.document.key,O.document.design.namedPlans.selected]):O.document?.key,design:O.document?.design,relatedChecks:O.tabs[0]?bl(O.tabs[0]):[],viewKey:Q()?.key,views:O.tabs.map(e=>({key:e.key,name:e.name,activity:Fi(e),object:Bi(e)})),activities:O.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:O.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:O.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!O.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=O.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{ts(e),Ti(e)},openObject:e=>{Ia(e),Ti(e)},openOverview:()=>{O.tabs[0]&&(we(),Ue?.reopenBusinessOverview(),O.active=O.tabs[0].key,De(),Se())},activateView:e=>{O.tabs.some(t=>t.key===e)&&(we(),O.active=e,De(),Se())},statePanel:e=>O.document?Bd(O.document.design,e,t=>{Ue?.activateBusiness(),ts(t),Ti(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{O.nodeDrawer=!1,ct()},refresh:()=>{ct(),_o.update()}});const Gu=O;De();et();Qd().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const u of t.recovery??[])Pi(u);if(t.document){const u={...t.document};Pi(u),t.document.design=u.design,t.document.checks=u.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const u of t.tabs)Pi(u)}const n=ol(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(u=>({...u,name:n.document.name,design:u.design,checks:u.checks,source:u.source,draft:u.draft,edited:u.edited,handle:u.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const u of i.tabs)Pi(u);if(new Set(i.tabs.map(u=>u.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const u of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!u||!u.positions||typeof u.positions!="object"||Array.isArray(u.positions)||u.selectedEdgesOnly!==void 0&&typeof u.selectedEdgesOnly!="boolean"||u.showExceptions!==void 0&&typeof u.showExceptions!="boolean"||u.hiddenNodes!==void 0&&(!Array.isArray(u.hiddenNodes)||!u.hiddenNodes.every(l=>typeof l=="string"))||u.viewInset!==void 0&&(!Array.isArray(u.viewInset)||u.viewInset.length!==2||!u.viewInset.every(l=>Number.isFinite(l)&&l>=0))||u.canvasOrigin!==void 0&&(!Array.isArray(u.canvasOrigin)||u.canvasOrigin.length!==2||!u.canvasOrigin.every(l=>Number.isFinite(l)&&l>=0))||!Array.isArray(u.scroll)||u.scroll.length!==2||!u.scroll.every(Number.isFinite)||!Number.isFinite(u.zoom)||u.zoom<.25||u.zoom>2.5||!Object.values(u.positions).every(l=>Array.isArray(l)&&l.length===2&&l.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:r,scopeOutside:s,...d}=i,c=u=>({...u,hiddenNodes:u.hiddenNodes??(i.scopeOutside==="hide"?u.design.graph.nodes.filter(l=>l.scope===!1).map(l=>l.id):[])});O=zt({...d,tabs:i.tabs.map(c)},n.recovery,n.document,i.tabs.map(u=>{const{design:l,checks:f,source:g,draft:a,edited:h,handle:m,name:p,...b}=c(u);return b})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(O.sampleLayout={...i.sampleLayout,hiddenNodes:on(vs).graph.nodes.filter(u=>u.scope===!1).map(u=>u.id)}),O.tabs.some(u=>u.key===O.active)||(O.active=O.tabs[0]?.key),Q()?.selected&&_n(Q().selected),os=O.document?.key,De(),ws=!0}).catch(()=>{O=Gu,Bn=!0,ks()}).finally(()=>{oe=!1,De(),et(),js().then(()=>{O.document?.key===os&&Ii()})});
