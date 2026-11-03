import{L as Js,D as la,G as ua,W as fa,P as pa,l as Rn,X as Xs,C as ma,n as ha,S as Zs,o as Ys,p as Qs,M as er,q as tr,s as nr,t as Po,g as To,r as fo,d as ir,b as vi,u as qo,U as or,v as ba,w as sr,x as rr,y as po,z as ga,m as Wo,A as ya,B as ar,E as va,j as wa,F as bs,H as ka,T as Ia,I as Sa,J as xa,R as Aa,K as Ea,N as Oa,O as Ca,Q as ja,V as Ma,Y as La,Z as gs,k as Ra,i as Na,h as Da,f as Pa,a as Ta,_ as qa,$ as Wa,a0 as cr,a1 as za,a2 as Ua,e as $a}from"./canvas-toolbar-Ch5Zpft_.js";const Fa={subsystems:{full:"サブシステム",icon:pa},business:{full:"業務設計",icon:fa},states:{full:"状態遷移",icon:ua},concept:{full:"データ構造",icon:la},tests:{full:"テスト仕様",icon:Js}};function mo(e,t,n){const i=Fa[t],o=document.createElement("span"),s=document.createElement("span"),a=document.createElement("span");o.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Rn(i.icon,{"aria-hidden":"true","stroke-width":1.8})),a.className="view-tab-name",a.textContent=n,o.append(s,a),e.replaceChildren(o),e.title=i.full+" / "+n,e.setAttribute("aria-label",i.full+"："+n)}function ho(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Rn(Xs,{"aria-hidden":"true","stroke-width":1.8})),t}function Va(e){const t=Rn(e?ma:ha,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Ba(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const i=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!i)return;const o=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,a=Math.max(0,Math.min(n,s+i*o));a!==s&&(e.scrollLeft=a,t.preventDefault())},{passive:!1})}function Ha(e,t){const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),o=i.left<n.left?i.left-n.left:i.right>n.right?i.right-n.right:0;o&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+o)))}const Ga=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function ys(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const i=e.createElement("link");i.rel="stylesheet",i.href=Ga,i.dataset.canvasToolbarStyle="",e.head.append(i)}const n=(i,o,s)=>{const a=Rn(o,{"stroke-width":1.8,"aria-hidden":"true"});s&&a.classList.add(s),t.querySelector(i)?.append(a)};for(const i of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(i)?.replaceChildren();n(".graph-settings-toggle",Zs),n(".layout-lock",Ys,"lock-closed"),n(".layout-lock",Qs,"lock-open"),n(".zoom-out",er),n(".zoom-in",tr)}function vs(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Ka({model:e}){const t=Object.fromEntries(e.concepts.map(c=>[c.id,{name:c.name,note:c.description,fields:c.information.map(l=>["",l.name+(l.responsibleSubsystemId&&l.responsibleSubsystemId!==c.subsystemId?"（担当："+e.subsystems.find(r=>r.id===l.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind]),i=e.reviewGroups.map(c=>({id:c.id,name:c.title,purpose:c.description,activities:c.relatedActivityIds,concepts:Object.fromEntries(c.graph.nodes.map(l=>[l.conceptId,{name:l.name,note:l.description,fields:l.fields.map(r=>["",r]),sources:l.sources,sourceActivities:l.sourceActivityIds}])),relations:c.graph.edges.map(l=>[l.fromConceptId,l.toConceptId,l.fromLabel,l.toLabel,l.kind])})),o=c=>i.find(l=>l.id===c),s=(c,l)=>{const r=Object.fromEntries(c.nodes.map(b=>[b.id,{...l[b.conceptId],name:b.name,note:b.description,sources:b.sources,conceptId:b.conceptId,subsystemId:b.subsystemId,fields:b.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(b=>c.nodes.some(g=>g.subsystemId===b.id)).map(b=>({id:b.id,name:b.name})),u=c.handoffIds.map(b=>e.handoffs.find(g=>g.id===b)).map(b=>({id:b.id,from:b.fromSubsystemId,to:b.toSubsystemId,label:b.information,returning:b.flowDirection==="return"}));return{ids:c.nodes.map(b=>b.id),tables:r,edges:c.edges.map(b=>[b.fromViewId,b.toViewId,b.fromLabel,b.toLabel,b.kind]),regions:f,handoffs:u}};return{tables:t,edges:n,groups:i,findGroup:o,graph:c=>{const l=o(c);if(!l)throw Error("Unknown review group: "+c);const r=e.reviewGroups.find(b=>b.id===c),f=r.graph.subsystemViews;if(f)return s(f,l.concepts);const u=Object.keys(t).filter(b=>Object.hasOwn(l.concepts,b));return{ids:u,tables:l.concepts,edges:l.relations.filter(([b,g])=>u.includes(b)&&u.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function tt(e,t,n){const i=document.createElement(t);return i.textContent=n,e.append(i),i}function _a(e,t,n){const i=document.createElement("button");return i.type="button",i.className="review-open",tt(i,"span",t),i.onclick=n,e.append(i),i}function Ja(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const i=document.createElement("div");i.className="landscape-overview",i.append(t),e.append(i)}}function Xa(e,t,n,i=()=>{},o=()=>{},s=[]){const a=n.contentFor(t.id);if(e.replaceChildren(),!a)return;tt(e,"p",a.description).className="review-description",tt(e,"h3","Activity");const d=document.createElement("ul");d.className="review-related-activities";for(const c of a.relatedActivities){const l=document.createElement("li"),r=s.find(u=>u.id===c.id&&u.name===c.name),f=_a(l,c.name,()=>{r&&o(r.id)});f.disabled=!r,f.setAttribute("aria-label",c.name+"を業務タブで開く"),d.append(l)}e.append(d),tt(e,"h3","情報の構造");for(const c of a.structureStatements){const l=document.createElement("section");l.className="review-structure",l.dataset.structure=c.id,tt(l,"h4",c.title),tt(l,"p",c.description),e.append(l)}tt(e,"h3","できること");for(const c of a.capabilities){const l=document.createElement("section");l.className="review-capability",l.dataset.capability=c.id,tt(l,"h4",c.title),tt(l,"p",c.description);for(const r of c.samples){const f=i(c.id,r.id),u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=r.id,u.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?u.onclick=f.open:(u.disabled=!0,u.title="対応するテスト仕様へのリンクがありません"),l.append(u)}e.append(l)}tt(e,"h3","できないこと（業務上のルール）");for(const c of a.limitations){const l=document.createElement("section");l.className="review-limitation",tt(l,"h4",c.title),tt(l,"p",c.description),tt(l,"h5","理由"),tt(l,"p",c.reason),e.append(l)}}function Gt(e,t,n){const i=e.ownerDocument.createElement(t);return i.textContent=n,e.append(i),i}function Za({model:e,business:t}){const n=a=>a.kind==="group"?e.subsystems.find(d=>d.id===a.id):e.handoffs.find(d=>d.id===a.id),i=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function o(a){const d=n(a);return d?d.activityIds.map(c=>t.activities.find(l=>l.id===c)).filter(Boolean):[]}function s(a,d){if(a.replaceChildren(),d.kind==="group"){const f=e.subsystems.find(b=>b.id===d.id);if(!f)return"";Gt(a,"p",f.purpose),Gt(a,"h3","扱う情報");const u=a.ownerDocument.createElement("ul");for(const b of f.information)Gt(u,"li",b);return a.append(u),Gt(a,"h3","まとまりの理由"),Gt(a,"p",f.reason),f.name}const c=e.handoffs.find(f=>f.id===d.id);if(!c)return"";Gt(a,"p",c.description),Gt(a,"h3","出元と受取先");const l=e.subsystems.find(f=>f.id===c.fromSubsystemId),r=e.subsystems.find(f=>f.id===c.toSubsystemId);return Gt(a,"p",`${l.name} → ${r.name}`),c.information}return{sections:i,activities:o,describe:s}}function ws(e,t,n){const i=document.createElement("div");i.className="concept-drawer-resize",i.tabIndex=0,i.setAttribute("role","separator"),i.setAttribute("aria-orientation","vertical"),i.setAttribute("aria-label","補足情報の幅"),e.prepend(i);let o=440;try{const d=Number(sessionStorage.getItem(n));Number.isFinite(d)&&d>=280&&(o=d)}catch{}const s=()=>{let d=t.clientWidth||innerWidth;const c=t.querySelector("#design-explorer");return innerWidth>800&&c&&!c.hidden&&(d-=c.offsetWidth),Math.max(280,Math.min(1e3,d-(innerWidth>800?240:16)))},a=(d,c=!1)=>{if(o=Math.max(280,Math.min(s(),d)),e.style.setProperty("--concept-drawer-width",o+"px"),i.setAttribute("aria-valuemin","280"),i.setAttribute("aria-valuemax",String(s())),i.setAttribute("aria-valuenow",String(Math.round(o))),c)try{sessionStorage.setItem(n,String(o))}catch{}};if(i.onkeydown=d=>{["ArrowLeft","ArrowRight","Home","End"].includes(d.key)&&(d.preventDefault(),a(d.key==="Home"?280:d.key==="End"?s():o+(d.key==="ArrowLeft"?40:-40),!0))},i.onpointerdown=d=>{if(d.button!==0)return;d.preventDefault();const c=d.clientX,l=o;i.setPointerCapture(d.pointerId),i.classList.add("resizing"),i.onpointermove=r=>a(l+c-r.clientX),i.onpointerup=()=>{i.onpointermove=null,i.onpointerup=null,i.onpointercancel=null,i.classList.remove("resizing"),a(o,!0)},i.onpointercancel=i.onpointerup},typeof ResizeObserver<"u"){const d=new ResizeObserver(()=>a(o));d.observe(t);const c=t.querySelector("#design-explorer");c&&d.observe(c)}window.addEventListener("resize",()=>a(o)),a(o)}const Ya=260,Qa=68,ec="http://www.w3.org/2000/svg",At=(e,t,n={})=>{const i=e.createElementNS(ec,t);for(const[o,s]of Object.entries(n))i.setAttribute(o,String(s));return i};function tc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Rn(or,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function nc(e,{model:t,business:n},i,o,s){const a=t.reviewGroups,d=t.subsystems,c=t.presentation.landscapeRelationships.map(I=>{const E=a.find(N=>N.id===I.from),T=a.find(N=>N.id===I.to);if(!E||!T||E.subsystemId!==T.subsystemId||!t.presentation.reviewBoundaries.some(N=>N.from===I.from&&N.to===I.to))throw Error("Unknown overview relationship: "+I.from+" -> "+I.to);return I}),l=t.handoffs.map(I=>{if(!["forward","return"].includes(I.flowDirection))throw Error("Unknown overview handoff direction: "+I.id);return{id:I.id,from:I.fromSubsystemId,to:I.toSubsystemId,label:I.information,returning:I.flowDirection==="return"}});if(new Set(l.map(I=>I.id)).size!==l.length)throw Error("Duplicate overview handoff");for(const I of l)if(!d.some(E=>E.id===I.from)||!d.some(E=>E.id===I.to)||I.from===I.to||!I.label.trim())throw Error("Unknown overview handoff: "+I.id);for(const I of a){if(!d.some(E=>E.id===I.subsystemId))throw Error("Unknown overview subsystem: "+I.id);if(!n.roles?.some(E=>E.id===I.reviewer.roleId))throw Error("Unknown overview reviewer: "+I.id)}const r=d.flatMap(I=>a.filter(E=>E.subsystemId===I.id)),f=new Map;let u=0;for(const[I,E]of d.entries())for(const T of r.filter(N=>N.subsystemId===E.id))f.set(T.id,[80+u*170,100+u*120+I*64]),u++;const b=Po(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(i);let m,p;try{const I=JSON.parse(localStorage.getItem(g)||"null"),E=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),T=!I&&E?.documentKey===i?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,N=I??T;if(N){typeof N.zoom=="number"&&Number.isFinite(N.zoom)&&(b.zoom=Math.max(.25,Math.min(2.5,N.zoom))),Array.isArray(N.scroll)&&N.scroll.length===2&&N.scroll.every(M=>typeof M=="number"&&Number.isFinite(M))&&(b.scroll=N.scroll),typeof N.locked=="boolean"&&(b.locked=N.locked);for(const[M,V]of Object.entries(N.positions??{}))a.some(q=>q.id===M)&&Array.isArray(V)&&V.length===2&&V.every(q=>typeof q=="number"&&Number.isFinite(q))&&b.positions.set(M,[V[0],V[1]])}const S=N?.selection,L=S?.kind==="node"?t.concepts.find(M=>M.id===S.id)?.subsystemId:S?.id,D=S?.kind==="node"?"group":S?.kind;typeof L=="string"&&(D==="model"&&a.some(M=>M.id===L)||D==="group"&&d.some(M=>M.id===L)||D==="connection"&&l.some(M=>M.id===L))&&(p={kind:D,id:L}),p?.kind==="model"&&(b.selected=p.id)}catch{}const k=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:b.zoom,scroll:b.scroll,locked:b.locked,positions:Object.fromEntries(b.positions),selection:p}))}catch{}},A=I=>{if(!I&&!p)return;p=I,b.selected=I?.kind==="model"?I.id:void 0;const E=m?.querySelector(".diagram-world>svg");E&&y(E),k()},y=I=>{const E=vi(c,b.selected),T=vi(l,p?.kind==="group"?p.id:void 0);for(const N of a){const S=I.querySelector(`[data-node="${N.id}"]`);S?.setAttribute("class","node graph-shape state-shape"+E.nodeClasses(N.id)),S?.setAttribute("aria-pressed",String(b.selected===N.id))}for(const N of d){const S=I.querySelector(`[data-subsystem="${N.id}"]`);S?.setAttribute("class","subsystem-overview-group"+T.nodeClasses(N.id)),S?.querySelector("button")?.setAttribute("aria-pressed",String(p?.kind==="group"&&p.id===N.id))}for(const N of c){const S=I.querySelector(`[data-overview-from="${N.from}"][data-overview-to="${N.to}"]`);S?.setAttribute("class","edge"+(E.related(N)?" review-related":"")),S?.setAttribute("marker-end",`url(#overview-${E.related(N)?"related-arrow":"arrow"})`)}for(const N of l){const S=T.related(N)||p?.kind==="connection"&&p.id===N.id,L=I.querySelector(`[data-handoff-id="${N.id}"]`);L?.setAttribute("class","edge"+(N.returning?" exception":"")+(S?" review-related":"")),L?.setAttribute("marker-end",`url(#overview-${S?"related-arrow":"arrow"})`),I.querySelector(`[data-handoff-label="${N.id}"]`)?.classList.toggle("review-related",!!S)}I.querySelectorAll("[data-exception-paint]").forEach(N=>N.remove());for(const N of Array.from(I.querySelectorAll("[data-handoff-id].exception")))qo(I,N,{path:N.getAttribute("d")},{"data-overview-return-paint":N.getAttribute("data-handoff-id")})};return m=nr(e,I=>{const E=r.map(D=>{const M=I.positions.get(D.id)??f.get(D.id);return{id:D.id,x:M[0],y:M[1],width:Ya,height:Qa}}),T=At(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});T.append(To("overview-"));let N=0,S=0;const L=[];for(const D of d){const M=E.filter(ve=>a.find(Me=>Me.id===ve.id)?.subsystemId===D.id);if(!M.length)continue;const V=Math.min(...M.map(ve=>ve.x))-30,q=Math.min(...M.map(ve=>ve.y))-48,re=Math.max(...M.map(ve=>ve.x+ve.width))-V+30,te=Math.max(...M.map(ve=>ve.y+ve.height))-q+30;L.push({id:D.id,x:V,y:q,width:re,height:te});const ie=At(e,"g",{"data-subsystem":D.id,"aria-label":D.name}),ue=At(e,"rect",{x:V,y:q,width:re,height:te,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});ue.addEventListener("click",()=>A({kind:"group",id:D.id})),ie.append(ue);const me=At(e,"foreignObject",{class:"subsystem-overview-region-heading",x:V+8,y:q+3,width:re-16,height:36}),Pe=e.createElement("button");Pe.type="button",Pe.className="subsystem-overview-region-title",Pe.setAttribute("aria-label",D.name+"を選択"),Pe.textContent=D.name,Pe.onclick=()=>A({kind:"group",id:D.id}),me.append(Pe),ie.append(me),T.append(ie),N=Math.max(N,V+re+40),S=Math.max(S,q+te+40)}for(const[D,M]of l.entries()){if(!L.some(ie=>ie.id===M.from)||!L.some(ie=>ie.id===M.to))throw Error("Missing overview handoff region: "+M.id);const V=Math.max(30,M.label.length*12),q=fo({from:M.from,to:M.to,nodes:L,index:D,kind:"input",matrix:{returning:M.returning,captionLane:0},labelWidth:V,labelHeight:18}),re=At(e,"path",{d:q.path,class:"edge"+(M.returning?" exception":""),"data-handoff-id":M.id,"data-from-subsystem":M.from,"data-to-subsystem":M.to,"data-flow-direction":M.returning?"return":"forward","marker-end":"url(#overview-arrow)"});T.append(re);const te=At(e,"text",{x:q.label[0]-V/2,y:q.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":M.id});te.textContent=M.label,te.addEventListener("pointerdown",ie=>ie.stopPropagation()),te.addEventListener("pointerup",ie=>ie.stopPropagation()),te.addEventListener("click",()=>A({kind:"connection",id:M.id})),te.addEventListener("keydown",ie=>{(ie.key==="Enter"||ie.key===" ")&&(ie.preventDefault(),A({kind:"connection",id:M.id}))}),T.append(te),N=Math.max(N,q.bounds.right+40,q.label[0]+V/2+30),S=Math.max(S,q.bounds.bottom+40,q.label[1]+30)}for(const[D,M]of c.entries()){const V=fo({from:M.from,to:M.to,nodes:E,index:D,kind:"input",labelWidth:0,labelHeight:0}),q=At(e,"path",{d:V.path,class:"edge","data-overview-from":M.from,"data-overview-to":M.to,"marker-end":"url(#overview-arrow)"});T.append(q),N=Math.max(N,V.bounds.right+40),S=Math.max(S,V.bounds.bottom+40)}for(const D of E){const M=a.find(Me=>Me.id===D.id),V=n.roles.find(Me=>Me.id===M.reviewer.roleId),q=At(e,"g",{role:"button",tabindex:0,"aria-label":M.title+"を選択","aria-pressed":"false","data-node":D.id,"data-review-group":D.id,"data-subsystem-id":M.subsystemId,class:"node graph-shape state-shape"}),re=ir(e,D);re.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),q.append(re,At(e,"rect",{x:D.x,y:D.y,width:D.width,height:D.height,rx:8,class:"state-diagram-node"}));const ie=At(e,"foreignObject",{x:D.x,y:D.y,width:D.width,height:D.height}),ue=e.createElement("div");ue.className="subsystem-overview-card";const me=tc(e,V.color),Pe=e.createElement("span");Pe.className="subsystem-overview-labels",Pe.title=M.title+" — "+V.name;for(const[Me,R,$]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",M.title],["small","subsystem-overview-role",V.name]]){const B=e.createElement(Me);B.className=R,B.textContent=$,Pe.append(B)}const ve=e.createElement("button");ve.type="button",ve.className="subsystem-overview-open",ve.setAttribute("aria-label",M.title+"の詳細タブを開く"),ve.title="詳細タブを開く",ve.textContent="開く",ve.onpointerdown=Me=>Me.stopPropagation(),ve.onpointerup=Me=>Me.stopPropagation(),ve.onclick=Me=>{Me.stopPropagation(),o(M.id)},ue.append(me,Pe,ve),ie.append(ue),q.append(ie),q.addEventListener("click",()=>A({kind:"model",id:D.id})),q.addEventListener("keydown",Me=>{(Me.key==="Enter"||Me.key===" ")&&(Me.preventDefault(),A({kind:"model",id:D.id}))}),T.append(q)}return T.setAttribute("viewBox",`0 0 ${N} ${S}`),y(T),T},b,k,()=>A(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",k),m.addEventListener("pointerup",()=>queueMicrotask(k)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",k),{root:m,selected:()=>b.selected,selection:()=>p,restore:()=>{const I=()=>{const E=m.querySelector(".diagram-viewport");E.scrollLeft=b.scroll[0],E.scrollTop=b.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(I):I()}}}function ic(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(i=>t.columns.map(o=>{const s=i.cells.find(a=>a.columnId===o.id);if(!s)throw Error("Missing sample cell: "+o.id);return s}));return{card:t.card,columns:t.columns.map(i=>i.name),rows:n.map(i=>i.map(o=>o.value)),keyIds:n.map(i=>i.map(o=>o.linkId)),empty:t.empty}})}}function oc({model:e,business:t}){const n=g=>{const m=t.activities.find(p=>p.id===g);if(!m)throw Error("Unknown activity: "+g);return m},i=g=>{const m=t.roles?.find(p=>p.id===g);if(!m)throw Error("Unknown role: "+g);return m.name},o=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:i(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(m=>{const p=n(m);return{id:p.id,name:p.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(m=>({...m,samples:m.samples.map(ic)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>o.find(m=>m.id===g),a=(g,m)=>s(g)?.capabilities.find(p=>p.samples.some(k=>k.id===m)),d=o.flatMap(g=>g.capabilities.flatMap(m=>m.samples.map(p=>({...p,group:g.id})))),c=["yellow","cyan","green","blue","purple","orange"];function l(g,m,p){let k=p.get(m);if(k||(k=c[p.size]??`extra-${p.size}`,p.set(m,k)),g.dataset.sampleKey=m,g.dataset.keyTone=k,g.className="data-example-key",k.startsWith("extra-")){const A=(Number(k.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${A} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${A} 24% 25%)`)}}const r=g=>d.filter(m=>m.group===g),f=(g,m)=>r(g).find(p=>p.id===m);function u(g,m,p){const k=g.ownerDocument.createElement(m);return k.textContent=p,g.append(k),k}function b(g,m,p,k,A){const y=g.ownerDocument,j=f(m.id,p);if(!j)throw Error("Unknown data example: "+p);g.replaceChildren(),g.dataset.dataExample=p;const I=new Map;e.presentation.sampleCaption&&(u(g,"p",e.presentation.sampleCaption).className="data-example-caption");const E=s(m.id)?.capabilities??[],T=A?.capabilityId?E.filter(M=>M.id===A.capabilityId):E;if(A?.capabilityId&&!T.some(M=>M.samples.some(V=>V.id===p)))throw Error("Sample does not belong to capability: "+p);const N=a(m.id,p);g.dataset.capability=N.id;const S=()=>{u(g,"h2",A?.heading?.trim()||N.title),A?.renderSpecification?A.renderSpecification(g):u(g,"p",N.description).className="data-example-capability"};A?.capabilityId&&!A.hideCapability&&S();const L=y.createElement("label");L.className="data-example-picker",u(L,"span","場面");const D=y.createElement("select");D.setAttribute("aria-label","データ例の場面");for(const M of T){let V=D;if(!A?.capabilityId){const q=y.createElement("optgroup");q.label=M.title,D.append(q),V=q}for(const q of M.samples){if(A?.sampleIds&&!A.sampleIds.includes(q.id))continue;const re=y.createElement("option");re.value=q.id,re.textContent=q.name,V.append(re)}}if(D.value=p,D.onchange=()=>k(D.value),L.append(D),(!A?.hideSinglePicker||D.options.length>1)&&g.append(L),!A?.capabilityId&&!A?.hideCapability&&S(),u(g,"h3",j.name).className="data-example-scene",A?.collapseScenario&&j.when){const M=y.createElement("details");M.className="data-example-context",u(M,"summary","場面の背景"),u(M,"p",j.when).className="data-example-when",g.append(M)}else u(g,"p",j.when).className="data-example-when";u(g,"p",j.meaning).className="data-example-meaning";for(const M of j.blocks){const V=y.createElement("section");V.className="data-example-block",V.dataset.exampleCard=M.card,u(V,"h3",m.concepts[M.card].name);const q=y.createElement("div");q.className="data-example-table",q.tabIndex=0,q.setAttribute("role","region"),q.setAttribute("aria-label",m.concepts[M.card].name+"のデータ表");const re=y.createElement("table");re.setAttribute("aria-label",m.concepts[M.card].name+"のデータ例");const te=y.createElement("caption");te.textContent=m.concepts[M.card].name+"に入る情報",re.append(te);const ie=y.createElement("thead"),ue=y.createElement("tr");for(const Pe of M.columns)u(ue,"th",Pe).setAttribute("scope","col");ie.append(ue),re.append(ie);const me=y.createElement("tbody");for(const[Pe,ve]of M.rows.entries()){const Me=y.createElement("tr");for(const[R,$]of ve.entries()){const B=u(Me,"td",String($)),pe=M.keyIds[Pe][R];pe&&(l(B,pe,I),B.title=M.columns[R]+"："+$)}me.append(Me)}re.append(me),q.append(re),V.append(q),M.rows.length||u(V,"p",M.empty??"データはありません。"),g.append(V)}j.note&&(u(g,"p",j.note).className="data-example-note")}return{reviewContents:o,dataExamples:d,contentFor:s,capabilityFor:a,examplesFor:r,findDataExample:f,renderDataExample:b}}function zo(e,t){const n=e.model?.business,i=n?.activities.find(o=>o.id===t);return i?.roleId?n?.roles?.find(o=>o.id===i.roleId):void 0}function sc(e,t,n){return zo(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function rc(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function Wt(e,t=!1){const n=document.createElement("article");n.className="markdown";let i="",o,s;const a=(d,c)=>{for(const l of c.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(l.startsWith("**")&&l.endsWith("**")){const r=document.createElement("strong");r.textContent=l.slice(2,-2),d.append(r)}else if(l.startsWith("`")&&l.endsWith("`")){const r=document.createElement("code");r.textContent=l.slice(1,-1),d.append(r)}else d.append(document.createTextNode(l))};for(const d of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(d);if(c&&!i){i=c[1],s=void 0;const u=document.createElement("pre");o=document.createElement("code"),u.append(o),n.append(u);continue}if(c&&c[1][0]===i[0]&&c[1].length>=i.length&&!c[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){i="",s=void 0;continue}if(i){o.append(document.createTextNode(d+`
`));continue}if(!d.trim()){s=void 0;continue}const l=/^(#{1,6}) (.*)$/.exec(d),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(d);if(r){s||(s=document.createElement(/^\s*\d/.test(d)?"ol":"ul"),n.append(s));const u=document.createElement("li");a(u,r[1]),s.append(u);continue}s=void 0;const f=document.createElement(l?"h"+l[1].length:"p");a(f,l?l[2]:d),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const Oe={type:"string"},K={type:"string",minLength:1,pattern:"\\S"},H={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Yt=e=>({anyOf:[e,{type:"null"}]}),J=e=>({type:"array",items:e}),Q=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),ac=e=>({$ref:"#/$defs/"+e}),Sn=J({anyOf:[Q({kind:{enum:["text"]},value:Oe}),Q({kind:{enum:["reference"]},targetId:H,label:Oe}),Q({kind:{enum:["link"]},uri:K,label:Oe})]}),ks=Q({id:H,name:K,scope:{type:"boolean"}}).properties,cc=Q({id:H,kind:{enum:["input","output","business-exception","object-exception"]},fromId:H,toId:H,label:K}),dc=Q({id:H,sourceId:H,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:J(H),unresolvedTargets:J(K),summary:K,content:K}),bo=Q({id:H,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:K,title:K,preface:Oe,scope:Oe,objects:J(Q({...ks,icon:K,information:J(K)})),activities:J(Q({...ks,why:K,when:K,who:K,where:K,procedure:K,exception:Yt(K),result:K,problem:Yt(K),painLevel:Yt({enum:["Low","Medium","High"]})})),relations:J(cc),findings:J(dc)}),lc=Q({id:H,name:K,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),dr=Q({...bo.properties,schemaVersion:{enum:["0.2"]},roles:J(lc),activities:J(Q({...bo.properties.activities.items.properties,roleId:Yt(H)}))}),uc=Q({...dr.properties,schemaVersion:{enum:["0.3"]},exceptions:J(Q({id:H,activityId:H,name:K,description:Oe}))}),fc=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Sn])),pc=Q({id:H,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:K,title:K,basedOn:Q({documentId:H,revision:K,verification:{enum:["unverified"]}}),intro:Sn,index:J(Q({activityId:H,purpose:Oe,connections:Oe,checkIds:J(H)})),sections:J(Q({id:H,activityId:Yt(H),title:K,preamble:Sn})),guarantees:J(Q({id:H,sectionId:H,title:K,blocks:J({anyOf:[Q({kind:{enum:["prose"]},content:Sn}),Q({kind:{enum:["example"]},exampleId:H})]})})),examples:J(Q({id:H,guaranteeId:H,columns:J(K),rows:J(J(Sn))})),items:J(Q({id:H,checkId:H,title:K,detailSummary:Oe,sectionId:H,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:Q(fc,[])})),notes:J(Q({id:H,title:K,content:Sn}))}),Uo=Q({id:H,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:K,title:K,basedOn:Q({documentId:H,revision:K,verification:{enum:["unverified"]}}),objectId:H,states:J(Q({id:H,name:K})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:K,transitions:J(Q({id:H,sourceId:K,fromId:K,activityId:H,event:Yt(K),exception:Yt(K),condition:K,toId:K,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:K,note:K}))}),Is=Object.fromEntries(Object.entries({...Uo.properties.transitions.items.properties,exceptionId:Yt(H)}).filter(([e])=>e!=="exception")),mc=Q({...Uo.properties,schemaVersion:{enum:["0.2"]},transitions:J(Q({...Is,conditionLabel:K},Object.keys(Is)))}),$o=Q({documentId:H,revision:K,targetType:K,targetId:H,section:K}),hc=Q({id:H,name:K,responsibilityStatus:K,responsibleSubsystemId:H},["id","name"]),bc=Q({id:H,name:K,subsystemId:H,information:J(hc),reason:Oe,description:Oe,businessObjectIds:J(H),activityLinks:J(Q({activityId:H,uses:J(K)})),sourceRefs:J($o),reviewState:K}),gc=Q({id:H,fromConceptId:H,toConceptId:H,fromPerTarget:K,toPerSource:K,condition:Oe,reviewState:K,sourceRefs:J($o),fromLabel:K,toLabel:K,kind:{enum:["down","reference"]}}),yc=Q({id:H,name:K,purpose:Oe,information:J(K),reason:Oe,activityIds:J(H),reviewState:K}),vc=Q({id:H,fromSubsystemId:H,toSubsystemId:H,information:K,description:Oe,activityIds:J(H),flowDirection:{enum:["forward","return"]},reviewState:K}),wc=Q({columnId:H,value:{anyOf:[Oe,{type:"number"}]},linkId:K},["columnId","value"]),kc=Q({card:H,columns:J(Q({id:H,name:K,informationId:H})),rows:J(Q({id:H,cells:J(wc)})),empty:Oe},["card","columns","rows"]),go=Q({id:H,name:K,when:Oe,meaning:Oe,blocks:J(kc),note:Oe},["id","name","when","meaning","blocks"]),yo=Q({id:H,title:K,description:Oe,meta:{},samples:J(go)}),Ic=Q({...go.properties,checkIds:{...J(H),minItems:1,uniqueItems:!0}},[...go.required,"checkIds"]),Sc=Q({decisionExampleIds:J(H),decisionCheckIds:J(H),resultCheckIds:J(H),sampleIds:J(H)}),xc=Q({...yo.properties,samples:J(Ic),testSpecification:Sc},[...Object.keys(yo.properties)]),Ac=Q({id:H,title:K,description:Oe,reason:Oe,meta:{}}),Ec=Q({conceptId:H,name:K,fields:J(K),description:Oe,sources:J(K),sourceActivityIds:J(H)}),Oc=Q({id:H,fromConceptId:H,toConceptId:H,relationIds:J(H),scope:Oe,fromLabel:K,toLabel:K,kind:{enum:["down","reference"]}}),Cc=Q({id:H,conceptId:H,subsystemId:H,name:K,description:Oe,sources:J(K),fields:J(Q({name:K,informationId:H}))}),jc=Q({id:H,fromViewId:H,toViewId:H,relationIds:J(H),fromLabel:K,toLabel:K,kind:{enum:["down","reference"]}}),lr=Q({nodes:J(Cc),edges:J(jc),handoffIds:J(H)}),ur=Q({id:H,subsystemId:H,title:K,description:Oe,reviewer:Q({roleId:H}),relatedActivityIds:J(H),graph:Q({conceptIds:J(H),nodes:J(Ec),edges:J(Oc),subsystemViews:lr},["conceptIds","nodes","edges"]),structureStatements:J(Q({id:H,title:K,description:Oe,sampleIds:J(H),sourceRefs:J($o)})),capabilities:J(yo),limitations:J(Ac),meta:Q({questions:J(K),hypotheses:{}},["questions"])}),Mc=Q({...ur.properties,capabilities:J(xc)}),fr=Q({id:H,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:K,basedOn:Q({documentId:H,revision:K,verification:{enum:["unverified"]}}),relatedStates:J(Q({documentId:H,revision:K,verification:{enum:["unverified"]}})),subsystems:J(yc),concepts:J(bc),relations:J(gc),handoffs:J(vc),reviewGroups:J(ur),benefits:J(K),considerations:J(K),reviewPoints:J(K),meta:{},presentation:Q({activityViews:{},creatorActivityIds:{},sampleCaption:Oe,subsystemViews:lr,landscapeRelationships:J(Q({from:H,to:H})),reviewBoundaries:J(Q({from:H,to:H,label:Oe,promise:Oe}))},["landscapeRelationships","reviewBoundaries"])}),Lc=Q({...fr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:J(Mc)}),ci=(e,t)=>Q({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:K,documents:J({anyOf:t.map(ac)}),sources:J(Q({documentId:H,revision:K,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:Oe})),externalDocuments:J(Q({id:H,kind:{enum:["businessDesign"]},revision:K,activities:J(Q({id:H,name:K}))})),diagnostics:J(K)}),Ss={anyOf:[ci("0.1",["businessDesign","checkItems"]),ci("0.2",["businessDesign","checkItems","stateTransition"]),ci("0.3",["businessDesignRoles","checkItems","stateTransition"]),ci("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:bo,businessDesignRoles:dr,businessDesignStructured:uc,checkItems:pc,stateTransition:Uo,stateTransitionStructured:mc,conceptModel:fr,checkedConceptModel:Lc}},U=(e,t)=>{if(!e)throw Error(t)};function pr(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},i=()=>{const s=t++;for(;t<e.length;){const a=e[t++];if(a==='"')return JSON.parse(e.slice(s,t));a==="\\"&&t++}throw Error("Unclosed JSON string")},o=(s=0)=>{U(s<=64,"JSON depth limit"),n();const a=e[t];if(a==='"'){i();return}if(a==="{"){t++,n();const c=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),U(e[t]==='"',"JSON object key required");const l=i();U(!c.has(l),"Duplicate JSON key: "+l),c.add(l),n(),U(e[t++]===":","JSON colon required"),o(s+1),n();const r=e[t++];if(r==="}")return;U(r===",","JSON comma required")}throw Error("Truncated object")}if(a==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){o(s+1),n();const c=e[t++];if(c==="]")return;U(c===",","JSON array comma required")}throw Error("Truncated array")}const d=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;U(t>d,"JSON value required"),JSON.parse(e.slice(d,t))};return o(),n(),U(t===e.length,"Trailing JSON content"),JSON.parse(e)}function xn(e,t=Ss,n="$"){if(t.$ref)return xn(e,Ss.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const i=[];for(const o of t.anyOf)try{xn(e,o,n);return}catch(s){i.push(s.message)}throw Error("No schema variant at "+n+": "+i.join("; "))}if(t.enum&&U(t.enum.includes(e),"Invalid enum at "+n),t.type){const i=e===null?"null":Array.isArray(e)?"array":typeof e;U(i===t.type,"Invalid type at "+n)}if(t.minLength&&U(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&U(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const i of t.required??[])U(Object.hasOwn(e,i),"Missing "+n+"."+i);for(const i of Object.keys(e))U(Object.hasOwn(t.properties,i),"Unknown field "+n+"."+i),xn(e[i],t.properties[i],n+"."+i)}t.type==="array"&&e.forEach((i,o)=>xn(i,t.items,n+"["+o+"]"))}function Rc(e){const t=new Map,n=new Map,i=new Map,o=(s,a,d)=>{U(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,a.id),i.set(s.id,d)};for(const s of e.documents){o(s,s,"document");for(const[a,d]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const c of s[a]??[])o(c,s,d)}for(const s of e.externalDocuments){o(s,s,"document");for(const a of s.activities)o(a,s,"activity")}return{map:t,owner:n,types:i}}function vo(e){return xn(e),mr(e)}function en(e,t){const n=new Set(e.items.map(a=>a.id)),i=new Set,o=e.guarantees.find(a=>a.id===t.guaranteeId),s=a=>{if(Array.isArray(a)){for(const d of a)s(d);return}if(a&&typeof a=="object"){a.kind==="reference"&&n.has(a.targetId)&&i.add(a.targetId);for(const d of Object.values(a))d&&typeof d=="object"&&s(d)}};s(t.rows);for(const a of o?.blocks??[])a.kind==="prose"&&s(a.content);for(const a of e.items)(a.fields.guarantee??[]).some(c=>c.kind==="reference"&&(c.targetId===t.id||c.targetId===t.guaranteeId))&&i.add(a.id);return[...i]}function mr(e,{allowUnresolvedFindings:t=!1}={}){U(e.documents.length>0,"Document required");const{map:n,owner:i,types:o}=Rc(e),s=[...e.diagnostics],a=new Set;for(const u of e.sources)if(u.uri){const b=new URL(u.uri);U(b.protocol==="https:"&&!b.username&&!b.password,"Unsafe source URI")}const d=(u,b,g)=>(U(n.has(u),"Dangling reference: "+u),b&&U(o.get(u)===b,"Reference type mismatch: "+u),g&&U(i.get(u)===g,"Cross-document mismatch: "+u),n.get(u)),c=u=>u?.some(b=>b.kind==="text"?b.value.trim().length>0:!0),l=(u,b)=>{for(const g of u)if(g.kind==="reference"&&(d(g.targetId,null,b),U(["document","section","guarantee","example","check","note"].includes(o.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const m=new URL(g.uri);U(m.protocol==="https:"&&!m.username&&!m.password,"Unsafe external link")}};for(const u of e.documents)if(U(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){U(u.activities.length>0,"Activity required");const b=[...u.objects,...u.activities].map(p=>p.name);U(new Set(b).size===b.length,"Duplicate visible name"),U(b.every(p=>p===p.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(k=>p.includes(k))),"Invalid Graph-visible name");for(const p of u.objects)U(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){U(new Set(u.roles.map(p=>p.name)).size===u.roles.length,"Duplicate Role name"),U(u.roles.every(p=>p.name===p.name.trim()&&!/[\r\n]/.test(p.name)),"Invalid Role name");for(const p of u.activities)p.roleId!==null?d(p.roleId,"role",u.id):a.add("Role未確定: "+p.id+" — "+p.who)}for(const p of u.activities)U(p.problem===null==(p.painLevel===null),"Problem/Pain pair mismatch");for(const p of u.exceptions??[])d(p.activityId,"activity",u.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},m=new Set;for(const p of u.relations){d(p.fromId,g[p.kind][0],u.id),d(p.toId,g[p.kind][1],u.id);const k=JSON.stringify([p.kind,p.fromId,p.toId,p.label]);U(!m.has(k),"Duplicate relation"),m.add(k)}U(new Set(u.findings.map(p=>p.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const p of u.findings){U(p.scope==="items"?p.targetIds.length+p.unresolvedTargets.length>0:!p.targetIds.length&&!p.unresolvedTargets.length,"Finding scope mismatch"),U(new Set(p.targetIds).size===p.targetIds.length,"Duplicate Finding target");for(const k of p.targetIds)d(k,null,u.id),U(["object","activity"].includes(o.get(k)),"Invalid Finding target");p.unresolvedTargets.length&&(U(t,"Unresolved Finding target: "+p.sourceId),s.push("Finding参照未決: "+p.sourceId))}}else if(u.kind==="stateTransition"){const b=d(u.basedOn.documentId,"document");U(b.kind==="businessDesign"&&b.objects,"State source must be an in-package BD"),U(b.revision===u.basedOn.revision,"Stale State source revision"),d(u.objectId,"object",b.id),U(!e.documents.some(m=>m!==u&&m.kind==="stateTransition"&&m.objectId===u.objectId),"Duplicate Object state declaration"),U(u.states.length>0&&new Set(u.states.map(m=>m.name)).size===u.states.length,"Duplicate/empty state names"),U(u.states.every(m=>!m.name.startsWith("@")),"Reserved state name"),U(u.transitions.length<=1e3,"State transition row budget"),U(new Set(u.transitions.map(m=>m.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const g=new Map;for(const m of u.transitions){m.fromId!=="@new"&&d(m.fromId,"state",u.id),["@unknown","@none"].includes(m.toId)||d(m.toId,"state",u.id);const p=d(m.activityId,"activity",b.id),k=JSON.stringify([m.fromId,m.activityId,m.condition.trim().replace(/\s+/gu," ")]);if(U(!g.has(k),"Duplicate state transition condition: "+g.get(k)+" / "+m.sourceId),g.set(k,m.sourceId),e.formatVersion==="0.4")if(U(m.path!=="normal"||m.exceptionId===null,"Normal transition cannot reference an exception"),m.exceptionId!==null){const A=d(m.exceptionId,"exception",b.id);U(A.activityId===p.id,"Exception Activity mismatch")}else m.path==="exception"&&U(s.includes("例外参照未決: "+m.id),"Unresolved exception requires a diagnostic");else U(m.path!=="normal"||m.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+m.id);U(m.effect!=="unchanged"||m.fromId===m.toId,"Unchanged state mismatch"),U(m.effect!=="change"||!m.toId.startsWith("@")&&m.fromId!==m.toId,"Invalid changed state"),U(m.effect!=="no-create"||m.fromId==="@new"&&m.toId==="@none","Invalid no-create transition"),U(m.effect!=="constraint"||m.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const b=d(u.basedOn.documentId,"document");U(b.kind==="businessDesign"&&b.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),U(!e.documents.some(S=>S!==u&&S.kind==="conceptModel"&&S.basedOn.documentId===b.id),"Duplicate Concept model for Business Design");const g=(S,L)=>{const D=new Map;for(const M of S)U(!D.has(M.id),"Duplicate "+L+" ID: "+M.id),D.set(M.id,M);return D},m=g(u.subsystems,"subsystem"),p=g(u.concepts,"concept"),k=g(u.relations,"concept relation"),A=g(u.reviewGroups,"review group"),y=g(u.handoffs,"handoff"),j=g(u.concepts.flatMap(S=>S.information),"concept information"),I=(S,L,D)=>(U(S.has(L),"Unknown "+D+": "+L),S.get(L)),E=S=>d(S,"activity",b.id),T=S=>{const L=d(S.documentId,"document");U(L.revision===S.revision,"Stale Concept source revision");const D=L.id===b.id,M=L.kind==="stateTransition"&&L.basedOn.documentId===b.id&&u.relatedStates.some(V=>V.documentId===L.id&&V.revision===L.revision);U(D||M,"Concept source must refer to its Business Design or a declared State"),d(S.targetId,S.targetType,L.id)};for(const S of u.relatedStates){const L=d(S.documentId,"document");U(L.kind==="stateTransition"&&L.revision===S.revision&&L.basedOn.documentId===b.id,"Invalid Concept state reference")}for(const S of u.subsystems)for(const L of S.activityIds)E(L);for(const S of u.concepts){I(m,S.subsystemId,"subsystem");for(const L of S.information)L.responsibleSubsystemId&&I(m,L.responsibleSubsystemId,"responsible subsystem");for(const L of S.businessObjectIds)d(L,"object",b.id);for(const L of S.activityLinks)E(L.activityId);for(const L of S.sourceRefs)T(L)}for(const S of u.relations){I(p,S.fromConceptId,"concept"),I(p,S.toConceptId,"concept");for(const L of S.sourceRefs)T(L)}for(const S of u.handoffs){I(m,S.fromSubsystemId,"subsystem"),I(m,S.toSubsystemId,"subsystem"),U(S.fromSubsystemId!==S.toSubsystemId,"Handoff must cross subsystem boundary");for(const L of S.activityIds)E(L)}const N=(S,L)=>{const D=g(S.nodes,"subsystem view"),M=g(S.edges,"subsystem view edge");for(const q of D.values()){I(L,q.conceptId,"view concept"),I(m,q.subsystemId,"subsystem");const re=I(p,q.conceptId,"concept");for(const te of q.fields)U(re.information.some(ie=>ie.id===te.informationId),"Unknown information for subsystem view: "+te.informationId)}for(const q of M.values()){const re=I(D,q.fromViewId,"subsystem view"),te=I(D,q.toViewId,"subsystem view");U(re.subsystemId===te.subsystemId,"View relationship crosses subsystem boundary"),U(q.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ie=re.conceptId;for(const ue of q.relationIds){const me=I(k,ue,"concept relation");U(me.fromConceptId===ie,"Subsystem view relation path is disconnected: "+ue),ie=me.toConceptId}U(ie===te.conceptId,"Subsystem view relation target differs")}U(new Set(S.handoffIds).size===S.handoffIds.length,"Duplicate subsystem view handoff");const V=new Set([...D.values()].map(q=>q.subsystemId));for(const q of S.handoffIds){const re=I(y,q,"handoff");U(V.has(re.fromSubsystemId)&&V.has(re.toSubsystemId),"Missing subsystem view handoff region: "+q)}};u.presentation.subsystemViews&&N(u.presentation.subsystemViews,p);for(const S of u.reviewGroups){I(m,S.subsystemId,"subsystem"),d(S.reviewer.roleId,"role",b.id);for(const V of S.relatedActivityIds)E(V);const L=g(S.graph.nodes.map(V=>({...V,id:V.conceptId})),"view concept");U(new Set(S.graph.conceptIds).size===S.graph.conceptIds.length&&S.graph.conceptIds.length===L.size&&S.graph.conceptIds.every(V=>L.has(V)),"View concepts and nodes differ");for(const V of S.graph.nodes){I(p,V.conceptId,"concept");for(const q of V.sourceActivityIds)E(q)}g(S.graph.edges,"view edge");for(const V of S.graph.edges){I(L,V.fromConceptId,"view concept"),I(L,V.toConceptId,"view concept");for(const q of V.relationIds)I(k,q,"concept relation")}S.graph.subsystemViews&&N(S.graph.subsystemViews,L);const D=g(S.capabilities,"capability"),M=g(S.capabilities.flatMap(V=>V.samples),"sample");g(S.limitations,"limitation"),g(S.structureStatements,"structure statement");for(const V of S.structureStatements){for(const q of V.sampleIds)I(M,q,"sample");for(const q of V.sourceRefs)T(q)}for(const V of D.values())if(V.testSpecification){const q=V.testSpecification;for(const[te,ie]of Object.entries(q))U(new Set(ie).size===ie.length,"Duplicate function specification reference: "+te);const re=(te,ie)=>{const ue=d(te,ie),me=d(i.get(te),"document");return U(me.kind==="checkItems"&&me.basedOn.documentId===b.id&&me.basedOn.revision===b.revision,"Function Check source mismatch: "+te),{value:ue,doc:me}};for(const te of[...q.decisionCheckIds,...q.resultCheckIds])re(te,"check");for(const te of q.decisionExampleIds){const{value:ie,doc:ue}=re(te,"example"),me=en(ue,ie);U(me.length>0,"Function decision table needs a Check: "+te),U(me.every(Pe=>q.decisionCheckIds.includes(Pe)),"Function decision table Check is not assigned: "+te)}for(const te of q.sampleIds){const ie=V.samples.find(ue=>ue.id===te);U(ie,"Function result sample belongs to another capability: "+te),U(ie.checkIds.some(ue=>q.resultCheckIds.includes(ue)),"Function result sample needs a result Check: "+te),U(ie.checkIds.every(ue=>q.resultCheckIds.includes(ue)||q.decisionCheckIds.includes(ue)),"Function result sample Check is not assigned: "+te)}}for(const V of D.values())for(const q of V.samples){if(u.schemaVersion==="0.2"){U(q.checkIds.length>0,"Sample needs a Check: "+q.id),U(new Set(q.checkIds).size===q.checkIds.length,"Duplicate sample Check: "+q.id);for(const re of q.checkIds){d(re,"check");const te=d(i.get(re),"document");U(te.kind==="checkItems"&&te.basedOn.documentId===b.id&&te.basedOn.revision===b.revision,"Sample Check source mismatch: "+re)}}for(const re of q.blocks){I(L,re.card,"view concept");const te=g(re.columns,"sample column");for(const ie of re.columns)I(j,ie.informationId,"concept information");g(re.rows,"sample row");for(const ie of re.rows){const ue=new Set;for(const me of ie.cells)I(te,me.columnId,"sample column"),U(!ue.has(me.columnId),"Duplicate sample cell: "+me.columnId),ue.add(me.columnId);U(ue.size===te.size,"Sample row does not match columns")}}}}for(const S of u.presentation.landscapeRelationships){const L=I(A,S.from,"review group"),D=I(A,S.to,"review group");U(L.subsystemId===D.subsystemId,"Internal relationship crosses subsystem boundary")}for(const S of u.presentation.reviewBoundaries)I(A,S.from,"review group"),I(A,S.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const b=d(u.basedOn.documentId,"document");U(b.kind==="businessDesign","Check source is not BD"),U(b.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),U(new Set(u.items.map(p=>p.checkId)).size===u.items.length,"Duplicate Check ID");const g=new Set;for(const p of u.index){d(p.activityId,"activity",b.id),U(!g.has(p.activityId),"Duplicate Activity index"),g.add(p.activityId),U(new Set(p.checkIds).size===p.checkIds.length,"Duplicate Check binding");for(const k of p.checkIds)d(k,"check",u.id)}U(new Set(u.sections.map(p=>p.activityId??p.title)).size===u.sections.length,"Duplicate Activity section");for(const p of u.sections)p.activityId!==null&&(d(p.activityId,"activity",b.id),U(g.has(p.activityId),"Section missing from index")),l(p.preamble,u.id);const m=new Set(e.documents.filter(p=>p.kind==="conceptModel"&&p.basedOn.documentId===b.id&&p.basedOn.revision===b.revision).flatMap(p=>p.reviewGroups.flatMap(k=>k.capabilities.flatMap(A=>A.testSpecification?.decisionExampleIds??[]))));for(const p of u.guarantees){const k=p.blocks.length>0&&p.blocks.every(A=>A.kind==="example"&&m.has(A.exampleId)&&u.examples.some(y=>y.id===A.exampleId&&y.guaranteeId===p.id&&en(u,y).length>0));U(p.blocks.some(A=>A.kind==="prose"&&c(A.content))||k,"General guarantee prose required"),d(p.sectionId,"section",u.id);for(const A of p.blocks)if(A.kind==="prose")l(A.content,u.id);else{const y=d(A.exampleId,"example",u.id);U(y.guaranteeId===p.id,"Example owner mismatch")}}for(const p of u.examples){d(p.guaranteeId,"guarantee",u.id),U(p.columns.length>0,"Example columns required");for(const k of p.rows){U(k.length===p.columns.length,"Example column mismatch");for(const A of k)l(A,u.id)}}for(const p of u.items){const k=d(p.sectionId,"section",u.id);U(k.activityId===null?!u.index.some(A=>A.checkIds.includes(p.id)):u.index.some(A=>A.activityId===k.activityId&&A.checkIds.includes(p.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),U(c(p.fields.guarantee)||c(p.fields.condition)&&c(p.fields.expectedResult),"Check guarantee required");for(const A of Object.values(p.fields))l(A,u.id);U(k.activityId===null||u.index.some(A=>A.checkIds.includes(p.id)),"Unbound Check")}for(const p of u.notes)l(p.content,u.id);l(u.intro,u.id)}const r=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));U(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const u of r)U(a.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");U(a.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const u of e.sources){d(u.documentId,"document");const b=u.documentId+"@"+u.revision;U(!f.has(b),"Duplicate source descriptor"),f.add(b)}for(const u of e.externalDocuments)U(e.sources.some(b=>b.documentId===u.id&&b.revision===u.revision),"External source revision missing"),U(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:n.size}}const Z=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function xs(e,t,n){if(n==null)return;const i=Wt(n);return e.append(Z("h3",t),i),i}function Nc(e,t){if(e===null)return;const n=Wt(e),i=s=>String(s??"").replace(/\s+/g,""),o=new Set(t.map(s=>i(Wt(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))o.has(i(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const Dc={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Pc(e,t,n){const i=new Map,o=new Set,s=new Set(n.map(d=>d.id)),a=e.model.business;for(const d of e.model.concepts??[]){if(d.basedOn.documentId!==a.id||d.basedOn.revision!==a.revision)continue;const c=d.presentation.activityViews;if(Array.isArray(c)){for(const l of c)if(!(!l||typeof l!="object"||Array.isArray(l)||l.activityId!==t||!Array.isArray(l.businessVariations)))for(const r of l.businessVariations){if(!r||typeof r!="object"||Array.isArray(r)||typeof r.exceptionId!="string"||!s.has(r.exceptionId)||r.kind!=="alternative"&&r.kind!=="exception"||o.has(r.exceptionId))continue;const f=i.get(r.exceptionId);f&&f!==r.kind?(i.delete(r.exceptionId),o.add(r.exceptionId)):i.set(r.exceptionId,r.kind)}}}return i}function Tc(e,t){const n=Z("article");n.className="markdown json-detail";const i=e.model,o=i.business,s=o.objects.find(d=>d.id===t),a=o.activities.find(d=>d.id===t);if(s){xs(n,"Scope",String(s.scope)),n.append(Z("h3","Information"));const d=Z("ul");for(const c of s.information)d.append(Z("li",c));n.append(d)}else if(a){const d=o.exceptions?.filter(u=>u.activityId===a.id)??[];for(const[u,b]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=xs(n,u,b==="who"?zo(e,a.id)?.name??a.who:a[b]===null?null:String(a[b]));b==="result"&&g&&(g.dataset.businessResult="")}const c=Nc(a.exception,d),l=Pc(e,a.id,d),r=(u,b,g)=>{if(!b.length&&!g)return;const m=Z("section");m.dataset.businessVariations="",m.append(Z("h3",u)),g&&m.append(g);for(const p of b){const k=Wt(p.description);k.dataset.businessException=p.id,m.append(Z("h4",p.name),k)}n.append(m)};l.size?(r("例外",d.filter(u=>l.get(u.id)==="exception")),r("別ルート",d.filter(u=>l.get(u.id)==="alternative")),r("通常以外の扱い",d.filter(u=>!l.has(u.id)),c)):r("通常以外の扱い",d,c);const f=new Map([...o.objects,...o.activities].map(u=>[u.id,u.name]));for(const[u,b]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=o.relations.filter(p=>p.kind===u&&(p.fromId===t||p.toId===t));if(!g.length)continue;n.append(Z("h3",b));const m=g.map(p=>`${f.get(p.fromId)} → ${f.get(p.toId)} — ${p.label}`);if(u==="business-exception")for(const p of m)n.append(Z("p",p));else{const p=Z("ul");for(const k of m)p.append(Z("li",k));n.append(p)}}}else n.append(Z("p","項目を選択すると業務内容を表示します。"));return n}class hn{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Z("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,i=new Set){for(const o of n){if(!this.take(t))break;if(o.kind==="markdown"){t.append(Wt(o.value));continue}if(o.kind==="text"){const c=Z("span",o.value);c.style.whiteSpace="pre-wrap",t.append(c);continue}if(o.kind==="link"){t.append(Z("span",`${o.label} (${o.uri})`));continue}const s=Z("details"),a=Z("summary",o.label||o.targetId);s.append(a),t.append(s);let d=!1;s.addEventListener("toggle",()=>{if(!s.open||d)return;if(d=!0,i.has(o.targetId)){s.append(Z("p","循環参照："+o.targetId));return}if(i.size>=16){s.append(Z("p","参照の深さの上限です。続きは原文で確認してください。"));return}const c=new Set(i).add(o.targetId),l=this.doc,r=l.guarantees.find(m=>m.id===o.targetId),f=l.examples.find(m=>m.id===o.targetId),u=l.items.find(m=>m.id===o.targetId),b=l.sections.find(m=>m.id===o.targetId),g=l.notes.find(m=>m.id===o.targetId);if(r){s.append(Z("h4",r.title));for(const m of r.blocks){if(!this.take(s))break;m.kind==="prose"?this.runs(s,m.content,c):this.example(s,m.exampleId,c)}}else if(f)this.example(s,f.id,c);else if(u){s.append(Z("p",`${u.checkId} · ${u.title}`+(this.requester?"":` · ${u.reviewState}`))),this.requester&&(u.reviewState==="要確認"||u.reviewState==="要修正")&&s.append(Z("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(u.fields).filter(([p])=>["condition","expectedResult","guarantee","question","alternatives"].includes(p))):u.fields;this.fields(s,m,c)}else b?(s.append(Z("h4",b.title)),this.runs(s,b.preamble,c)):g?(s.append(Z("h4",g.title)),this.runs(s,g.content,c)):o.targetId===l.id&&(s.append(Z("h4",l.title)),this.runs(s,l.intro,c))})}}fields(t,n,i,o=!1){for(const[s,a]of Object.entries(n)){if(!this.take(t))break;if(t.append(Z("h4",Dc[s]??s)),s==="guarantee"&&o){const d=new Set;for(const c of a){const l=c.kind==="reference"?this.doc.guarantees.find(f=>f.id===c.targetId):void 0;if(!l){this.runs(t,[c],i);continue}if(d.has(l.id))continue;d.add(l.id);const r=new Set(i).add(l.id);for(const f of l.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,a,i)}}example(t,n,i,o=!1){const s=this.doc.examples.find(f=>f.id===n);if(!en(this.doc,s).length)return;const a=Z("table"),d=o?s.columns.indexOf("結果"):-1,c=d>0&&s.columns.at(-1)==="Check ID";if(c){const f=Z("colgroup");f.span=d,a.append(f);for(let p=d;p<s.columns.length;p++)a.append(Z("colgroup"));const u=Z("thead"),b=Z("tr"),g=Z("th","条件");g.colSpan=d,g.scope="colgroup",b.append(g);for(let p=d;p<s.columns.length;p++){const k=Z("th",s.columns[p]);k.rowSpan=2,k.scope="col",p===d?k.className="decision-result":s.columns[p]==="備考"&&(k.className="decision-notes"),b.append(k)}const m=Z("tr");for(const p of s.columns.slice(0,d)){const k=Z("th",p);k.scope="col",m.append(k)}u.append(b,m),a.append(u)}else{const f=Z("tr");for(const u of s.columns){if(!this.take(t))break;f.append(Z("th",u))}a.append(f)}const l=c?Z("tbody"):a;for(const f of s.rows){if(!this.take(t))break;const u=Z("tr");for(const[b,g]of f.entries()){if(!this.take(t))break;const m=Z("td");if(c&&b===d?m.className="decision-result":c&&s.columns[b]==="備考"&&(m.className="decision-notes"),o)for(const p of g){const k=p.kind==="reference"?this.doc.items.find(A=>A.id===p.targetId):void 0;k?m.append(Z("span",k.checkId)):this.runs(m,[p],i)}else this.runs(m,g,i);u.append(m)}l.append(u)}c&&a.append(l);const r=Z("div");r.className="json-example",r.append(a),t.append(r)}}function no(e,t,n=e.model.checks,i=new Set,o=new Set,s=!0){const a=Z("section");a.className="check-content json-checks";const d=e.model.business,c=n.filter(r=>r.basedOn.documentId===d.id);let l=!1;for(const r of c){const f=new hn(r,!s),u=r.index.filter(p=>p.activityId===t),b=new Set(r.index.flatMap(p=>p.checkIds)),g=(t?[...new Set(u.flatMap(p=>p.checkIds))]:r.items.filter(p=>!b.has(p.id)).map(p=>p.id)).filter(p=>!i.has(p)),m=r.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of m){(p.preamble.length||r.guarantees.some(k=>k.sectionId===p.id&&!o.has(k.id)))&&(l=!0),f.runs(a,p.preamble);for(const k of r.guarantees.filter(A=>A.sectionId===p.id&&!o.has(A.id)))f.runs(a,[{kind:"reference",targetId:k.id,label:k.title}])}for(const p of g){const k=r.items.find(j=>j.id===p);if(!k)continue;l=!0;const A=Z("section");A.className="check-item",A.dataset.checkId=k.checkId,A.dataset.elementId=k.id,A.append(Z("h3",k.checkId+" · "+k.title)),s||A.append(Z("p","人間レビュー："+k.reviewState)),(k.reviewState==="要確認"||k.reviewState==="要修正")&&A.append(Z("p","確認が必要です。"));const y=Object.fromEntries(Object.entries(k.fields).filter(([j])=>["condition","expectedResult","guarantee","question","alternatives",...s?["classification"]:[]].includes(j)));f.fields(A,y,new Set([k.id])),a.append(A)}if(!t)for(const p of r.notes)l=!0,f.runs(a,[{kind:"reference",targetId:p.id,label:p.title}])}return l||a.append(Z("p","この業務のテスト仕様はありません。")),a}function As(e,t,n=e.model.checks,i=!0){const o=Z("section");o.className="check-content json-checks sample-checks";const s=e.model.business,a=new Set(t);for(const d of n.filter(c=>c.basedOn.documentId===s.id&&c.basedOn.revision===s.revision)){const c=new hn(d,!i);for(const l of d.items.filter(r=>a.has(r.id))){const r=Z("section");r.className="check-item",r.dataset.checkId=l.checkId,r.dataset.elementId=l.id,r.append(Z("h3",l.checkId+" · "+l.title)),(l.reviewState==="要確認"||l.reviewState==="要修正")&&r.append(Z("p","確認が必要です。"));const f=Object.fromEntries(Object.entries(l.fields).filter(([u])=>["condition","expectedResult","guarantee","question","alternatives",...i?["classification"]:[]].includes(u)));c.fields(r,f,new Set([l.id]),!0),o.append(r)}}return o}const qc=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Wc(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const i=n.value.replace(qc,"");i===n.value?t.push(n):i.trim()&&t.push({...n,value:i})}return t}function Es(e,t,n=e.model.checks){const i=Z("section");i.className="check-content json-checks decision-examples";const o=e.model.business;for(const s of t)for(const a of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=a.examples.find(g=>g.id===s);if(!d||!en(a,d).length)continue;const c=new hn(a,!0),l=a.guarantees.find(g=>g.id===d.guaranteeId),r=Z("section");r.dataset.decisionExample=s;for(const g of l?.blocks??[])g.kind==="prose"&&c.runs(r,Wc(g.content),new Set([l.id]));d.rows.length>1&&r.append(Z("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=d.columns.indexOf("結果"),u=f>0?f:d.columns.length;d.rows.some(g=>g.slice(0,u).some(m=>m.some(p=>p.kind==="text"&&/^\s*[-‐]\s*$/.test(p.value))))&&r.append(Z("p","‐＝値不問。")),c.example(r,s,new Set([s]),!0),i.append(r)}return i}function Os(e,t,n=e.model.checks){const i=Z("section");i.className="check-content json-checks decision-checks";const o=e.model.business,s=new Set(t);for(const a of n.filter(d=>d.basedOn.documentId===o.id&&d.basedOn.revision===o.revision)){const d=new hn(a,!0);for(const c of a.items.filter(l=>s.has(l.id))){const l=Z("section");l.className="check-item",l.dataset.checkId=c.checkId,l.dataset.elementId=c.id,l.append(Z("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&l.append(Z("p","確認が必要です。")),c.fields.condition?.length&&(l.append(Z("h4","条件")),d.runs(l,c.fields.condition,new Set([c.id])));const r=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=Z("details");f.append(Z("summary","期待結果")),d.fields(f,r,new Set([c.id]),!0),l.append(f)}i.append(l)}}return i}function io(e,t,n=e.model.checks,i=new Set){const o=Z("section");o.className="check-content json-checks result-checks";const s=e.model.business,a=new Set(t);for(const d of n.filter(c=>c.basedOn.documentId===s.id&&c.basedOn.revision===s.revision)){const c=new hn(d,!0),l=d.items.filter(r=>a.has(r.id)&&i.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);l.length&&o.append(Z("p",l.map(r=>r.checkId).join("、")));for(const r of d.items.filter(f=>a.has(f.id))){if(l.includes(r))continue;const f=Z("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(Z("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(Z("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(r.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));c.fields(f,u,new Set([r.id]),!0);const b=Z("details"),g=Z("summary","Check の詳細");b.append(g,Z("p",r.title)),r.fields.condition?.length&&c.runs(b,r.fields.condition,new Set([r.id])),f.append(b),o.append(f)}}return o}const oo=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function zc(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),i=[],o=new Set,s=new Set,a=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),d=(r,f)=>a.some(u=>u.items.some(b=>b.id===r)&&(!f||u.index.some(b=>b.activityId===f&&b.checkIds.includes(r)))),c=(r,f,u,b,g=[])=>{const m=f.testSpecification,p=(m?.decisionCheckIds??[]).filter(T=>d(T,u)),k=(m?.resultCheckIds??[]).filter(T=>d(T,u)),A=(m?.decisionExampleIds??[]).filter(T=>a.some(N=>{const S=N.examples.find(D=>D.id===T),L=S?en(N,S):[];return L.length>0&&L.every(D=>d(D,u))})),y=f.samples.filter(T=>(!m||m.sampleIds.includes(T.id))&&T.checkIds?.length&&(m?T.checkIds.every(N=>d(N,u)):T.checkIds.some(N=>d(N,u)))),j=A.flatMap(T=>a.flatMap(N=>{const S=N.examples.find(L=>L.id===T);return S?en(N,S).filter(L=>d(L,u)):[]})),I=[...new Set([...p,...k,...j,...y.flatMap(T=>(T.checkIds??[]).filter(N=>d(N,u)))])];if(!I.length)return;const E=`fn:${u??"_"}:${r}:${f.id}`;s.has(E)||(s.add(E),i.push({key:E,activityId:u,groupId:r,capability:f,name:b,samples:y,checkIds:I,decisionCheckIds:p,resultCheckIds:k,decisionExampleIds:A,decisionTableCheckIds:[...new Set(j)],businessSections:g}))},l=e.model.presentation.activityViews;if(Array.isArray(l)){for(const r of l)if(!(!oo(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!oo(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const u=e.model.reviewGroups.find(m=>m.id===f.groupId),b=u?.capabilities.find(m=>m.id===f.capabilityId);if(!u||!b)continue;o.add(JSON.stringify([u.id,b.id]));const g=[];if(Array.isArray(f.businessSections))for(const m of f.businessSections){if(!oo(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(k=>k.id===m.exceptionId&&k.activityId===r.activityId)))continue;const p=[...new Set(m.pages.filter(k=>k==="decision"||k==="result"))];p.length&&g.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:p})}c(u.id,b,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():b.title,g)}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)o.has(JSON.stringify([r.id,f.id]))||c(r.id,f,void 0,f.title);return i}function Cs(e,t,n,i){const o=e.filter(a=>a.groupId===t&&a.capability.id===n),s=o.find(a=>a.samples.some(d=>d.id===i));if(s)return{kind:"sample",key:s.key,sampleId:i};for(const a of o){if(!a.capability.testSpecification)continue;const d=a.capability.samples.find(l=>l.id===i),c=a.decisionExampleIds.length?a.decisionTableCheckIds:a.decisionCheckIds;if(d?.checkIds?.some(l=>c.includes(l)))return{kind:"decision",key:"decision:"+a.key}}}const we=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function hr(e,t,n){const i=e.model.business;return n.filter(o=>o.basedOn.documentId===i.id).map(o=>{const a=[...new Set(o.index.filter(c=>c.activityId===t).flatMap(c=>c.checkIds))].flatMap(c=>{const l=o.items.find(r=>r.id===c);return l?[l]:[]}),d=o.sections.filter(c=>c.activityId===t);return{doc:o,items:a,sections:d}}).filter(o=>o.items.length||o.sections.length)}function Uc(e,t,n){const i=hr(e,t,n),o=i.flatMap(s=>s.items);return{available:i.length>0,unlinked:o.length>0&&o.every(s=>!s.fields.testEvidence?.length)}}function br(e,t,n,i=new Set){for(const o of t)if(o.kind==="text"){const s=we("span",o.value);s.style.whiteSpace="pre-wrap",e.append(s)}else if(o.kind==="markdown")e.append(Wt(o.value));else if(o.kind==="link"){let s;try{s=new URL(o.uri)}catch{}if(s&&s.protocol==="https:"&&!s.username&&!s.password){const a=we("a",o.label||o.uri);a.href=s.href,a.target="_blank",a.rel="noopener noreferrer",e.append(a,we("span","（リンク先未確認）"))}else e.append(we("span",o.label||o.uri))}else{const s=n.notes.find(c=>c.id===o.targetId);if(!s){new hn(n,!0).runs(e,[o],i);continue}const a=we("details");a.append(we("summary",o.label||s.title)),e.append(a);let d=!1;a.addEventListener("toggle",()=>{if(!(!a.open||d)){if(d=!0,i.has(s.id)||i.size>=16){a.append(we("p","参照を展開できません。原文で確認してください。"));return}br(a,s.content,n,new Set(i).add(s.id))}})}}function $c(e,t,n,i=new Set){const o=e.model.business.activities.find(k=>k.id===t),s=we("article");s.className="activity-test-spec";const a=[],d=(k,A)=>(A.tabIndex=-1,a.push({label:k,node:A}),A);if(!o)return s.append(we("p","この業務は見つかりません。")),{root:s,sections:a};const c=hr(e,t,n),l=we("div");l.className="activity-test-header";const r=we("h1",o.name),f=we("span",o.id);f.className="activity-test-id",f.title=o.id;const u=we("div");u.className="activity-test-title",u.append(f,r),l.append(u),o.why&&l.append(Wt(o.why));const b=we("p","テストの対応・実行結果・証拠の鮮度：未確認");b.className="activity-test-status",l.append(b),s.append(l);const g=d("仕様",we("section"));g.className="activity-test-section check-content json-checks",g.append(we("h2","仕様"));for(const{doc:k,items:A,sections:y}of c){if(k.basedOn.revision!==e.model.business.revision){const S=we("p","このCheckと現在の業務設計の版の対応は未確認です。");S.className="activity-test-warning",g.append(S)}const j=new hn(k,!0),I=new Set(A.map(S=>S.id)),E=new Set;for(const S of A)for(const L of Object.values(S.fields))for(const D of L)D.kind==="reference"&&E.add(D.targetId);for(const S of y)j.runs(g,S.preamble);const T=k.guarantees.filter(S=>y.some(L=>L.id===S.sectionId)||E.has(S.id)),N=new Set;for(const S of T){const L=we("section");L.className="activity-test-rule",L.append(we("h3",S.title));const D=S.blocks.some(M=>M.kind==="example"&&i.has(M.exampleId));for(const M of S.blocks)if(M.kind==="prose")D||j.runs(L,M.content,new Set([S.id]));else if(!N.has(M.exampleId)&&!i.has(M.exampleId)){const V=k.examples.find(q=>q.id===M.exampleId);V&&en(k,V).some(q=>I.has(q))&&(j.example(L,V.id,new Set([S.id]),!0),N.add(V.id))}L.childElementCount>1&&g.append(L)}for(const S of k.examples.filter(L=>E.has(L.id)&&!N.has(L.id)&&!i.has(L.id)))en(k,S).some(L=>I.has(L))&&(j.example(g,S.id,new Set,!0),N.add(S.id));for(const S of A){const L=d(S.checkId,we("section"));L.className="check-item activity-test-check",L.dataset.checkId=S.checkId,L.dataset.elementId=S.id;const D=we("div");D.className="activity-test-check-title";const M=we("span",S.checkId);M.className="activity-test-check-id",D.append(M,we("h3",S.title)),L.append(D);const V=we("p","人間レビュー："+S.reviewState);V.className="activity-test-review",L.append(V),(S.reviewState==="要確認"||S.reviewState==="要修正")&&L.append(we("p","確認が必要です。"));const q={};for(const re of["condition","expectedResult","guarantee","question","alternatives"]){const te=S.fields[re];te?.length&&(q[re]=te)}j.fields(L,q,new Set([S.id])),g.append(L)}}c.length||g.append(we("p","この業務に対応するCheck Itemはありません。")),s.append(g);const m=d("テスト",we("section"));m.className="activity-test-section activity-test-evidence",m.append(we("h2","テスト"));const p=c.flatMap(({doc:k,items:A})=>A.flatMap(y=>y.fields.testEvidence?.length?[{doc:k,item:y,runs:y.fields.testEvidence}]:[]));if(!p.length)m.append(we("p","対応するテストの記録はありません。"));else{m.append(we("p","保存された証拠の記述があります。テストとの対応、実行結果、鮮度は確認されていません。"));for(const{doc:k,item:A,runs:y}of p){const j=we("details"),I=we("summary",A.checkId+" の証拠記録");j.append(I);const E=we("div");br(E,y,k),j.append(E),m.append(j)}}return s.append(m),{root:s,sections:a}}function Fc(e,t,n){e.replaceChildren(n.root),t.replaceChildren(we("h2","目次"));const i=n.sections.map(({label:a,node:d},c)=>{const l=we("button",a);return l.type="button",l.className=c>0&&a!=="テスト"?"activity-test-toc-check":"",l.onclick=()=>{d.scrollIntoView({block:"start"}),d.focus({preventScroll:!0}),o(c)},t.append(l),l}),o=a=>i.forEach((d,c)=>{c===a?d.setAttribute("aria-current","location"):d.removeAttribute("aria-current")}),s=()=>{const a=e.getBoundingClientRect().top+24;let d=0;for(let c=0;c<n.sections.length;c++)n.sections[c].node.getBoundingClientRect().top<=a&&(d=c);e.scrollHeight>e.clientHeight&&e.scrollTop+e.clientHeight>=e.scrollHeight-2&&(d=i.length-1),o(d)};e.onscroll=s,s()}const kn=["landscape","overview"];function Vc(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const i=e.querySelector(".tab-strip"),o=i.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const a=document.createElement("aside");a.id="design-explorer",a.setAttribute("aria-label","設計ナビゲーション"),a.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const d=document.createElement("div");d.className="shell-center",s.append(a,d),d.append(i,n);const c=document.createElement("div");c.className="shell-open-tabs",o.before(c),c.append(o),Ba(c);const l=document.createElement("nav");l.className="concept-tabs",l.setAttribute("aria-label","開いているサブシステムとデータ構造"),c.append(l);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),c.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),c.append(f);const u=document.createElement("section");u.id="concept-workspace",u.hidden=!0,u.setAttribute("aria-label","データ構造"),u.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',d.append(u);const b=document.createElement("section");b.id="states-workspace",b.hidden=!0,b.setAttribute("aria-label","状態遷移"),b.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',d.append(b);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main><nav class="activity-test-toc" aria-label="テスト仕様の目次" hidden></nav>',d.append(g);const m=document.createElement("aside");m.id="test-related-panel",m.className="spec-related",m.setAttribute("aria-label","関連資料"),m.hidden=!0,m.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const p=document.createElement("section");p.id="empty-workspace",p.hidden=!0,p.innerHTML="<p>左の一覧から図を開いてください。</p>",d.append(p);const k=n.querySelector("#node-list-drawer");a.append(k);const A=e.querySelector("#node-list-toggle"),y=e.querySelector("#drawer"),j=a.querySelector("input"),I=a.querySelector("nav"),E=u.querySelector("iframe"),T=u.querySelector(".concept-related"),N=b.querySelector("article"),S="alder-explorer-v1:"+location.pathname,L=location.protocol==="file:"||location.origin==="null"?"*":location.origin,D=window.__alderConceptHtml;let M,V,q,re,te={},ie=[],ue=[...kn],me=new Map,Pe=new Map,ve=new Map,Me=new Map;const R=h=>ve.get(h)??h,$=h=>Me.get(h)??h,B=h=>V?.findGroup(me.get(h??"")),pe=h=>q?.contentFor(me.get(h)??""),Y=(h,v)=>q?.findDataExample(me.get(h)??"",v),Ee=h=>q?.examplesFor(me.get(h)??"")??[],Ne=h=>kn.includes(h)?"全体図":pe(h)?.title??B(h)?.name??te[Pe.get(h)??""]?.name,fe=()=>{const h=t.business(),v=h.design?.model;return v?[...v.checks,...h.relatedChecks??[]].filter(O=>O.basedOn.documentId===v.business.id):[]},ae=()=>zc(M,fe()),be=h=>ae().find(v=>v.key===(h.startsWith("decision:")?h.slice(9):h)),Ve=h=>ae().filter(v=>v.name===h.name).length>1?h.name+"（"+(t.business().activities.find(v=>v.id===h.activityId)?.name??"その他")+"）":h.name,Be=h=>fe().some(v=>v.index.some(O=>O.activityId===h)||v.sections.some(O=>O.activityId===h)),Vt=h=>new Set(ae().filter(v=>v.activityId===h).flatMap(v=>v.checkIds)),on=h=>{const v=new Set(ae().filter(O=>O.activityId===h).flatMap(O=>O.decisionExampleIds));return new Set(fe().flatMap(O=>O.examples.filter(x=>v.has(x.id)).map(x=>x.guaranteeId)))},sn=h=>{const v=Vt(h),O=on(h);return fe().some(x=>x.index.some(P=>P.activityId===h&&P.checkIds.some(F=>!v.has(F)))||x.sections.some(P=>P.activityId===h&&(P.preamble.length>0||x.guarantees.some(F=>F.sectionId===P.id&&!O.has(F.id)))))},Xr=()=>fe().some(h=>h.items.some(v=>!h.index.some(O=>O.checkIds.includes(v.id)))||h.sections.some(v=>v.activityId===null)||h.notes.length>0),Zr=h=>{if(h.startsWith("activity:"))return"テスト"+h.slice(9);const v=be(h);return v?v.capability.testSpecification?Ve(v)+"・"+(h.startsWith("decision:")?"可否":"結果"):v.name:(h==="@unassigned"?"未割当":h.startsWith("remaining:")?t.business().activities.find(O=>O.id===h.slice(10))?.name:h.startsWith("checks:")?t.business().activities.find(O=>O.id===h.slice(7))?.name:h==="@overview"?"テスト仕様":void 0)??h},ni=n.querySelector("#formattedMarkdownDrawer");ni&&s.append(ni),s.append(T,m),ws(T,s,S+":drawer-width"),ws(m,s,S+":test-drawer-width");let ii=!1;const at=t.rightDrawer??{isOpen:()=>ii,setOpen:h=>{ii=h}};let ne="business",ze=!1,Ze=[],G="overview",Ye=[],ct="",dt=[],he="@overview",gn,Lt=innerWidth>800,oi=!1,si=!0,lt=!1,Tn;const Qe=new Map,ut=new Map,gt=new Map([["overview",E]]),st=new Map,rn=new Map,an=new Map,Ue=new Map,Bt=new Map,yt=new Set,et=new Set,cn=new Set,_e=new Map;let Ie;try{if(Ie=JSON.parse(sessionStorage.getItem(S)||"null"),Ie){if(lt=Ie.overviewClosed===!0,Tn=typeof Ie.documentKey=="string"?Ie.documentKey:void 0,Lt=typeof Ie.left=="boolean"?Ie.left:Lt,Array.isArray(Ie.expanded)){et.clear();for(const h of Ie.expanded)typeof h=="string"&&et.add(h)}Ye=Array.isArray(Ie.states)?Ie.states.filter(h=>typeof h=="string"):[],t.rightDrawer||(typeof Ie.rightOpen=="boolean"?ii=Ie.rightOpen:typeof Ie.right?.["concept:"+Ie.active]=="boolean"&&(ii=Ie.right["concept:"+Ie.active]))}}catch{}function Yr(){if(!(!Ie||Tn!==t.business().key||!ze)){for(const h of Array.isArray(Ie.overviewModes)?Ie.overviewModes:[])B(h)&&yt.add(h);for(const[h,v]of Object.entries(Ie.lastExamples??Ie.examples??{}))typeof v=="string"&&Y(h,v)&&Bt.set(h,v);for(const[h,v]of Object.entries(Ie.examples??{}))typeof v=="string"&&Y(h,v)&&Ue.set(h,v);for(const[h,v]of Object.entries(Ie.selected??{}))typeof v=="string"&&ie.includes(v)&&st.set(h,v);Ze=[...new Set((Array.isArray(Ie.concepts)?Ie.concepts:[]).filter(h=>typeof h=="string"&&ue.includes(h)))],G=Ze.includes(Ie.active)?Ie.active:"landscape"}}let dn;const Fe=()=>{try{sessionStorage.setItem(S,JSON.stringify({documentKey:gn,overviewClosed:lt,selected:Object.fromEntries(st),examples:Object.fromEntries(Ue),lastExamples:Object.fromEntries(Bt),overviewModes:[...yt],left:Lt,expandedVersion:4,expanded:[...et],concepts:Ze,active:G,states:Ye,specs:dt,activeSpec:he,specExamples:Object.fromEntries(Qe),specFocus:Object.fromEntries(ut),...t.rightDrawer?{}:{rightOpen:at.isOpen()}}))}catch{}},Ht=()=>{ne==="concept"&&_e.set("drawer:"+G,T.querySelector(".concept-drawer-body").scrollTop),ne==="concept"&&at.isOpen()&&yt.has(G)&&_e.set("review-overview:"+G,T.querySelector(".data-review-overview").scrollTop),ne==="concept"&&Ue.has(G)&&_e.set("example:"+G+":"+Ue.get(G),T.querySelector(".data-examples-panel").scrollTop),ne==="states"&&ct&&_e.set("state:"+ct,N.scrollTop),ne==="tests"&&_e.set("tests:"+he,g.querySelector(".test-spec-page").scrollTop),ne==="concept"&&G==="landscape"&&_e.set("concept:landscape",u.querySelector(".concept-review-landscape").scrollTop)};function He(h=!0){if(oi)return;const v=new URL(location.href);if(v.searchParams.set("view",ne),v.searchParams.delete("concept"),v.searchParams.delete("dataExample"),v.searchParams.delete("dataView"),v.searchParams.delete("specPart"),ne==="concept"&&at.isOpen()&&yt.has(G)?v.searchParams.set("dataView","overview"):ne==="concept"&&B(G)&&!Ue.has(G)&&v.searchParams.set("dataView","structure"),ne==="concept"&&at.isOpen()&&Ue.has(G)&&v.searchParams.set("dataExample",Ue.get(G)),ne==="tests"){const O=ut.get(he),x=O?be(O)?.key:he;O&&v.searchParams.set("specPart",O),x&&!O?.startsWith("decision:")&&Qe.has(x)&&v.searchParams.set("dataExample",Qe.get(x))}if(v.searchParams.delete("state"),v.searchParams.delete("activity"),v.searchParams.delete("object"),v.searchParams.delete("spec"),ne==="concept"&&v.searchParams.set("concept",G),ne==="states"&&ct&&v.searchParams.set("state",ct),ne==="tests"&&v.searchParams.set("spec",he),ne==="business"){const O=t.business(),x=O.views?.find(P=>P.key===O.viewKey);x?.activity?v.searchParams.set("activity",x.activity):x?.object&&v.searchParams.set("object",x.object)}v.href!==location.href&&history[h?"pushState":"replaceState"]({alderShell:!0},"",v)}function Se(h,v,O){const x=document.createElement(v);return x.textContent=O,h.append(x),x}function ft(h){h!==ne&&(ne==="business"?t.capture():Ht(),ne=h),n.hidden=ne!=="business",u.hidden=ne!=="concept",b.hidden=ne!=="states",g.hidden=ne!=="tests",p.hidden=ne!=="empty",e.dataset.workspaceArea=ne,ne==="business"&&t.refresh(),mt(),pt()}function St(h,v=!0){ze&&(h==="subsystems"&&(h="landscape"),ue.includes(h)&&(Ht(),Ze.includes(h)||Ze.push(h),G=h,ft("concept"),Qi(),vt(),Fe(),v&&He()))}function Qr(){Ht(),Ue.delete(G),yt.add(G),Qi(),T.querySelector(".concept-drawer-body").scrollTop=_e.get("drawer-overview:"+G)??0,Fe(),He()}function ea(h,v=!0){if(h&&!Y(G,h))return;const O=!Ue.has(G),x=T.querySelector(".concept-drawer-body");O&&_e.set("drawer-overview:"+G,x.scrollTop),Ht(),yt.delete(G),h?(Ue.set(G,h),Bt.set(G,h)):Ue.delete(G),at.setOpen(!0),Qi(),O&&(x.scrollTop=0),Fe(),He(),v&&T.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}T.querySelector(".concept-example-back").onclick=()=>{Qr(),T.querySelector(".data-review-overview").focus({preventScroll:!0})};function yn(h,v=!0){t.business().states?.some(O=>O.id===h)&&(Ht(),Ye.includes(h)||Ye.push(h),ct=h,ft("states"),aa(),vt(),Fe(),v&&He())}function qn(h){const v=be(h)?.activityId??(h.startsWith("activity:")?h.slice(9):h.startsWith("checks:")?h.slice(7):h.startsWith("remaining:")?h.slice(10):h);return t.business().activities.some(O=>O.id===v)?"activity:"+v:h.startsWith("decision:")&&be(h)&&!be(h)?.capability.testSpecification?be(h).key:be(h)||h==="@overview"||h==="@unassigned"||h.startsWith("checks:")&&Be(h.slice(7))||h.startsWith("remaining:")&&sn(h.slice(10))?h:"@overview"}function xt(h,v=!0){const O=t.business();if(!O.design?.model||!O.key)return;const x=h,P=be(h);if(h=qn(h),P?.activityId&&ut.set(h,x),ne==="tests"&&h!==he&&Ht(),dt.includes(h)||dt.push(h),he=h,oi||et.add("tests"),ft("tests"),Ki(),P?.activityId){const F=x.startsWith("decision:"),W=Array.from(g.querySelectorAll(F?"[data-decision-example]":".activity-test-samples")),_=W.find(ce=>F?P.decisionExampleIds.includes(ce.dataset.decisionExample??""):ce.dataset.functionKey===P.key);_&&(_.tabIndex=-1,_.scrollIntoView({block:"start"}),_.focus({preventScroll:!0}))}vt(),pt(),Fe(),v&&He()}function Ki(){const h=t.business().design;if(!h?.model)return;const v=g.querySelector(".test-spec-page"),O=g.querySelector(".activity-test-toc"),x=be(he);if(O.hidden=!he.startsWith("activity:"),v.onscroll=null,he.startsWith("activity:")){const P=he.slice(9),F=ae().filter(ee=>ee.activityId===P),W=new Set(F.flatMap(ee=>ee.decisionExampleIds)),_=$c(h,P,fe(),W),ce=_.root.querySelector(".activity-test-section"),Re=new Set;for(const ee of F){const z=ee.decisionExampleIds.filter(le=>!Re.has(le));if(ce&&(z.length||!ee.decisionExampleIds.length&&ee.decisionCheckIds.length)){const le=document.createElement("section");le.className="activity-test-decision",le.dataset.functionKey=ee.key,Se(le,"h3",ee.name+"：可否判定"),le.append(z.length?Es(h,z,fe()):Os(h,ee.decisionCheckIds,fe())),ce.insertBefore(le,ce.querySelector(".activity-test-check"));for(const xe of z)Re.add(xe)}}for(const ee of F.filter(z=>z.samples.length||z.resultCheckIds.length)){const z=V?.findGroup(ee.groupId);if(!z||!q||!ce)continue;const le=he,xe=document.createElement("details");xe.className="activity-test-samples",xe.dataset.functionKey=ee.key,xe.open=ut.get(he)===ee.key,xe.addEventListener("toggle",()=>{xe.isConnected&&xe.open&&ne==="tests"&&he===le&&(ut.set(le,ee.key),Xi(ee),mt(),Fe(),He(!1))}),Se(xe,"summary",ee.name+"のテストケース"),ee.capability.testSpecification&&Se(xe,"h3","処理結果");const Ce=document.createElement("div");Ce.className="data-examples-panel test-spec-examples",xe.append(Ce),ce.append(xe);const De=Le=>{Qe.set(ee.key,Le);const Xe=ee.samples.find(ln=>ln.id===Le),wn=!!ee.capability.testSpecification;q.renderDataExample(Ce,z,Le,ln=>{ut.set(he,ee.key),De(ln),Fe(),He()},{capabilityId:ee.capability.id,heading:ee.name,sampleIds:ee.samples.map(ln=>ln.id),hideSinglePicker:wn,renderSpecification:ln=>ln.append(wn?io(h,ee.resultCheckIds,fe(),new Set(ee.samples.flatMap(da=>da.checkIds??[]))):As(h,Xe?.checkIds??[],fe(),!1))})},$e=ee.samples.find(Le=>Le.id===Qe.get(ee.key))??ee.samples[0];$e?De($e.id):Ce.append(io(h,ee.resultCheckIds,fe()))}if(Xr()){const ee=document.createElement("details");ee.className="activity-test-unassigned",Se(ee,"summary","文書全体・未割当");let z=!1;ee.addEventListener("toggle",()=>{ee.open&&!z&&(z=!0,ee.append(no(h,void 0,fe(),new Set,new Set,!1)))}),_.root.append(ee)}Fc(v,O,_),Xi(be(ut.get(he)??"")),v.scrollTop=_e.get("tests:"+he)??0;return}if(x){const P=document.createElement("section");P.className="test-spec-sample";const F=V?.findGroup(x.groupId),W=x.samples.find(Re=>Re.id===Qe.get(he))??x.samples[0],_=!!x.capability.testSpecification,ce=he.startsWith("decision:");if(_)if(Se(P,"h2",x.name),Se(P,"h3",ce?"可否判定":"処理結果"),ce)x.decisionExampleIds.length?P.append(Es(h,x.decisionExampleIds,fe())):x.decisionCheckIds.length?P.append(Os(h,x.decisionCheckIds,fe())):Se(P,"p","可否条件の記載はありません。");else{const Re=F&&W&&q?new Set(x.samples.flatMap(ee=>ee.checkIds??[])):new Set;if(P.append(io(h,x.resultCheckIds,fe(),Re)),F&&W&&q){Se(P,"h3","データ例");const ee=document.createElement("div");ee.className="data-examples-panel test-spec-examples",P.append(ee),q.renderDataExample(ee,F,W.id,z=>{_e.set("tests:"+he,v.scrollTop),Qe.set(he,z),Ki(),Fe(),He(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:x.capability.id,sampleIds:x.samples.map(z=>z.id),hideCapability:!0,hideSinglePicker:!0})}}else if(F&&W&&q){const Re=document.createElement("div");Re.className="data-examples-panel test-spec-examples",P.append(Re),q.renderDataExample(Re,F,W.id,ee=>{_e.set("tests:"+he,v.scrollTop),Qe.set(he,ee),Ki(),Fe(),He(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:x.capability.id,heading:x.name,sampleIds:x.samples.map(ee=>ee.id),renderSpecification:ee=>ee.append(As(h,W.checkIds??[],fe()))})}v.replaceChildren(P)}else if(he==="@overview")v.replaceChildren(),Se(v,"p","左のメニューからテスト仕様を選択してください。");else if(he.startsWith("remaining:")){const P=he.slice(10);v.replaceChildren(no(h,P,fe(),Vt(P),on(P)))}else v.replaceChildren(no(h,he.startsWith("checks:")?he.slice(7):void 0,fe()));Xi(x),v.scrollTop=_e.get("tests:"+he)??0}function Wn(h){h||(lt=!1),ft("business"),h?t.openActivity(h):(lt=!1,t.openOverview()),pt(),vt(),He()}function ta(h){ft("business"),t.openObject(h),pt(),vt(),He()}function as(h){const v=t.business(),O=v.design?.model;return O?[...new Set(O.states.filter(x=>x.objectId===h&&x.basedOn.documentId===O.business.id&&x.basedOn.revision===O.business.revision).flatMap(x=>x.transitions.map(P=>P.activityId)))]:[...new Set((v.design?.objectStateTransitions?.[h]?.model?.transitions??[]).flatMap(x=>x.activityId?[x.activityId]:[]))]}function cs(h){return(t.business().states??[]).filter(v=>as(v.id).includes(h))}function ds(h){const v=t.business(),O=v.design?.model,x=M?.model.concepts.find(P=>P.id===h);return!O||!M||!x?[]:(v.states??[]).filter(P=>x.businessObjectIds.includes(P.id)&&O.states.some(F=>F.objectId===P.id&&F.basedOn.documentId===O.business.id&&F.basedOn.revision===O.business.revision&&M.model.relatedStates.some(W=>W.documentId===F.id&&W.revision===F.revision)))}function _i(h,v,O="状態遷移"){if(!v.length)return;const x=document.createElement("section");x.className="shell-related-links",Se(x,"h3",O);for(const P of v){const F=Rt(x,P.name,()=>yn(P.id));F.dataset.relatedState=P.id}h.append(x)}function ls(h){const v=M?.model.reviewGroups.find(x=>x.id===h.groupId);if(!v)return[];const O=new Set(v.graph.nodes.map(x=>x.conceptId));return[...new Set(h.samples.flatMap(x=>x.blocks.map(P=>P.card)))].filter(x=>O.has(x)&&M?.model.concepts.some(P=>P.id===x))}function Rt(h,v,O){const x=document.createElement("button");return x.type="button",x.className="shell-evidence",Se(x,"span",v),x.onclick=O,h.append(x),x}function Ji(h,v){const O=v.filter(P=>P.capability.testSpecification);if(!O.length)return;const x=document.createElement("section");x.className="shell-test-links",Se(x,"h3","テスト仕様書");for(const P of O)for(const[F,W]of[["decision:","可否判定"],["","処理結果"]]){const _=F+P.key,ce=Rt(x,Ve(P)+"・"+W,()=>xt(_));ce.dataset.relatedSpec=_}h.append(x)}function na(h,v){const O=ae().filter(_=>_.activityId===v&&_.capability.testSpecification),x=M?.model.presentation.activityViews,P=Array.isArray(x)?x.find(_=>_&&typeof _=="object"&&_.activityId===v):void 0,F=Array.isArray(P?.uncreatedTestSections)?P.uncreatedTestSections:[],W=h.querySelectorAll("[data-business-result],[data-business-exception]");for(const _ of Array.from(W)){const ce=_.dataset.businessException,Re=ce?"exception":"result",ee=ce??"result",z=O.flatMap(Ce=>Ce.businessSections.filter(De=>De.kind===Re&&(Re==="result"||De.exceptionId===ce)).flatMap(De=>De.pages.filter($e=>$e==="decision"?Ce.decisionCheckIds.length||Ce.decisionExampleIds.length:Ce.resultCheckIds.length||Ce.samples.length).map($e=>({target:Ce,page:$e})))),le=document.createElement("section");le.className="shell-section-links",le.setAttribute("aria-label","テスト仕様書");const xe=new Set;for(const{target:Ce,page:De}of z){const $e=(De==="decision"?"decision:":"")+Ce.key;if(xe.has($e))continue;xe.add($e);const Le=Rt(le,Ve(Ce)+"・"+(De==="decision"?"可否判定":"処理結果"),()=>xt($e));Le.dataset.relatedSpec=$e}if(!xe.size){const Ce=Se(le,"p",F.includes(ee)?"テスト仕様書未作成":"テスト仕様書との対応未確認");Ce.className="shell-spec-warning"}_.after(le)}Ji(h,O.filter(_=>!_.businessSections.length))}function Xi(h){const v=m.querySelector(".spec-related-content");if(v.replaceChildren(),!h?.capability.testSpecification)return;const O=t.business().activities.find(F=>F.id===h.activityId),x=V?.findGroup(h.groupId);if(O){Se(v,"h3","Activity");const F=Rt(v,O.name,()=>Wn(O.id));F.dataset.relatedActivity=O.id}if(x){Se(v,"h3","概念モデル");const F=Rt(v,x.name,()=>St(R(x.id)));F.dataset.relatedGroup=x.id}const P=ls(h);if(P.length){Se(v,"h3","概念");for(const F of P){const W=M.model.concepts.find(ce=>ce.id===F),_=Rt(v,W.name,()=>St($(F)));_.dataset.relatedConcept=F}}h.activityId&&_i(v,cs(h.activityId),"状態遷移（同じ Activity）")}function ia(h,v){Se(h,"h3","Activity");const O=t.business(),x=B(G),P=M?.model.concepts.find(W=>W.id===v),F=x?.concepts[v]?.sourceActivities??x?.activities??P?.activityLinks.filter(W=>W.uses.includes("生成")).map(W=>W.activityId)??[];for(const W of F){const _=O.activities.find(Re=>Re.id===W);if(!_)continue;const ce=document.createElement("button");ce.className="shell-evidence",Se(ce,"span",_.name),ce.title=_.name+"を業務タブで開く",ce.setAttribute("aria-label",ce.title),ce.onclick=()=>Wn(_.id),h.append(ce)}}function Zi(h){const v=B(h);return v?V?.graph(v.id):h==="overview"?V?.overviewGraph():void 0}function us(h){const v=rn.get(G),O=v?Zi(G)?.tables[v]:void 0;return O?.conceptId===h?O:void 0}function oa(h,v){const O=us(v)??B(G)?.concepts[v]??{...te[v],sources:void 0};h.replaceChildren(),Se(h,"p",O.note),Se(h,"h3","持つ情報");const x=document.createElement("ul");for(const[,P]of O.fields)Se(x,"li",P);if(h.append(x),O.sources?.length){Se(h,"h3","情報の出所・対象時点");const P=document.createElement("ul");for(const F of O.sources)Se(P,"li",F);h.append(P)}ia(h,v),Ji(h,ae().filter(P=>ls(P).includes(v))),_i(h,ds(v))}function Yi(h){const v=T.querySelector(".shell-heading strong");v.textContent=h,T.setAttribute("aria-label",h)}function fs(h=!1){B(G)&&(st.delete(G),rn.delete(G),an.delete(G),h||gt.get(G)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},L),ri(),mt(),T.querySelector(".concept-drawer-body").scrollTop=0,Fe())}T.querySelector(".concept-selection-clear").onclick=()=>{fs(),Ue.has(G)?T.querySelector(".concept-example-back").focus({preventScroll:!0}):T.querySelector(".data-review-overview").focus({preventScroll:!0})};function ri(){const h=T.querySelector(".concept-related-content");T.querySelector(".concept-selection").hidden=!!B(G)&&!st.has(G)&&!an.has(G),T.querySelector(".concept-selection>h2").hidden=!B(G),T.querySelector(".concept-selection-clear").hidden=!B(G);const v=an.get(G);if(v&&re){const F=re.describe(h,{kind:"group",id:v});Yi(F);return}if(G==="landscape"&&dn){h.replaceChildren();for(const[F,W]of re.sections){Se(h,"h3",F);const _=document.createElement("ul");for(const ce of W)Se(_,"li",ce);h.append(_)}Yi("サブシステムの情報");return}const O=st.get(G),x=B(G),P=ze&&O?us(O)?.name??x?.concepts[O]?.name??te[O].name:x?.name??"データ構造の情報";Yi(P),ze&&O?oa(h,O):(h.replaceChildren(),x||Se(h,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function ps(h){h.onload=()=>{ms(),h.contentDocument&&(ys(h.contentDocument),vs(h.contentDocument));const v=h.dataset.conceptView??"overview";if(!V||!M)return;const O=B(v),x=O?V.graph(O.id):v==="overview"?V.overviewGraph():{ids:ie,edges:V.edges,tables:te};h.contentWindow?.postMessage({type:"alder-concept-data",graph:x,focus:Pe.get(v),viewKey:v,documentKey:gn??M.model.id,clearSelectionOnBackground:!!O},L);const P=st.get(v);P&&h.contentWindow?.postMessage({type:"alder-concept-highlight",id:P},L)}}ps(E),E.dataset.conceptView="overview";function sa(){T.querySelector(".concept-page-details").hidden=!0,T.querySelector(".concept-example-back").hidden=!0;const h=T.querySelector(".data-review-overview");h.hidden=!0,h.replaceChildren();const v=T.querySelector(".data-examples-panel");v.hidden=!0,v.replaceChildren(),delete v.dataset.dataExample,dn?.root.remove(),dn=void 0;for(const[O,x]of gt)O!=="overview"&&(x.remove(),gt.delete(O));E.removeAttribute("src"),E.removeAttribute("srcdoc"),st.clear(),rn.clear(),an.clear()}function Qi(){u.setAttribute("aria-label",G==="landscape"||B(G)?"サブシステム":"データ構造"),u.querySelector(".concept-empty").hidden=ze;const h=u.querySelector(".concept-review-landscape"),v=B(G),O=T.querySelector(".concept-page-details"),x=T.querySelector(".data-review-overview"),P=T.querySelector(".data-examples-panel");if(O.hidden=!ze||!v,x.hidden=!ze||!v||Ue.has(G),P.hidden=!ze||!v||!Ue.has(G),T.querySelector(".concept-example-back").hidden=P.hidden,ze&&v){const W=ae();Xa(x,v,q,(ce,Re)=>{const ee=Cs(W,v.id,ce,Re);if(ee)return{kind:ee.kind,open:()=>{const z=Cs(ae(),v.id,ce,Re);z&&(z.sampleId?Qe.set(z.key,z.sampleId):Qe.delete(z.key),xt(z.key))}}},ce=>Wn(ce),t.business().activities),Ji(x,W.filter(ce=>ce.groupId===v.id));const _=Ue.get(G)??Bt.get(G)??Ee(G)[0]?.id;_&&q.renderDataExample(P,v,_,ce=>ea(ce)),x.scrollTop=_e.get("review-overview:"+G)??0,P.scrollTop=_e.get("example:"+G+":"+_)??0}if(h.hidden=!ze||!kn.includes(G),ze&&kn.includes(G)&&(G==="landscape"&&!dn&&(dn=nc(document,M,gn??M.model.id,W=>St(R(W)))),Ja(h,dn?.root,G==="overview"?"graph":"overview"),G==="landscape"&&dn?.restore()),ze&&G!=="landscape"&&!gt.has(G)){const W=document.createElement("iframe");W.className="concept-frame",W.dataset.conceptView=G,W.title=v?v.name+"のデータ構造":te[Pe.get(G)].name+"と隣接する概念",W.hidden=!0,gt.set(G,W);const _=Pe.get(G);_&&st.set(G,st.get(G)??_),ps(W),u.querySelector(".concept-main").append(W)}for(const[W,_]of gt)_.hidden=!ze||W!==G,ze&&W===G&&!_.hasAttribute("src")&&!_.hasAttribute("srcdoc")&&(D?_.srcdoc=D:_.src=new URL("concept.html?view=overview"+(B(W)?"&group="+encodeURIComponent(B(W).id):W==="overview"?"":"&focus="+encodeURIComponent(Pe.get(W))),document.baseURI).href);const F=st.get(G);F&&gt.get(G)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:F},L),ri(),mt(),T.querySelector(".concept-drawer-body").scrollTop=_e.get("drawer:"+G)??0}function vn(){const h=t.business(),v=h.views?.find(O=>O.activity!==void 0||O.object!==void 0||!lt);v?(ft("business"),t.activateView(v.key)):Ze.length?St(Ze.at(-1),!1):Ye.length?yn(Ye.at(-1),!1):dt.length?xt(dt.at(-1),!1):ft("empty")}function ra(){if(lt=!0,ne==="business"){const h=t.business().views?.find(v=>v.key===t.business().viewKey);!h?.activity&&!h?.object&&vn()}vt(),pt(),Fe(),He(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function aa(){N.replaceChildren();const h=t.business().states?.find(_=>_.id===ct);if(!h)return;const v=t.statePanel(h.id);v?N.append(v):Se(N,"p","この対象の状態遷移は未定義です。");const O=m.querySelector(".spec-related-content");O.replaceChildren();const x=as(h.id),P=t.business().activities.filter(_=>x.includes(_.id));if(P.length){Se(O,"h3","Activity");for(const _ of P){const ce=Rt(O,_.name,()=>Wn(_.id));ce.dataset.relatedActivity=_.id}}const F=M?.model.concepts.filter(_=>ds(_.id).some(ce=>ce.id===h.id))??[];if(F.length){Se(O,"h3","概念");for(const _ of F){const ce=Rt(O,_.name,()=>St($(_.id)));ce.dataset.relatedConcept=_.id}}const W=ae().filter(_=>_.activityId&&x.includes(_.activityId)&&_.capability.testSpecification);if(W.length){Se(O,"h3","Activity に関連するテスト仕様書");for(const _ of W)for(const[ce,Re]of[["decision:","可否判定"],["","処理結果"]]){const ee=ce+_.key,z=Rt(O,Ve(_)+"・"+Re,()=>xt(ee));z.dataset.relatedSpec=ee}}N.scrollTop=_e.get("state:"+ct)??0}let eo="";function vt(){for(const x of Array.from(o.querySelectorAll(".tab"))){const P=t.business().views?.find(W=>W.key===x.dataset.key);x.hidden=lt&&P?.activity===void 0&&P?.object===void 0;const F=!x.hidden&&ne==="business"&&x.dataset.key===t.business().viewKey;x.classList.toggle("active",F),x.querySelector("button")?.setAttribute("aria-current",String(F))}const h=(x,P,F)=>{x.replaceChildren();for(const W of P){const _=F==="concept"?Ne(W):t.business().states?.find(xe=>xe.id===W)?.name??W,ce=ne===F&&W===(F==="concept"?G:ct),Re=document.createElement("div");Re.className="tab"+(ce?" active":"");const ee=F==="concept"&&(W==="landscape"||B(W))?"subsystems":F;Re.dataset.viewKind=ee;const z=document.createElement("button");z.id=(F==="concept"?"concept-tab-":"state-tab-")+W,mo(z,ee,_),z.setAttribute("aria-current",String(ce)),z.onclick=()=>F==="concept"?St(W):yn(W),Re.append(z);const le=ho((ee==="subsystems"?"サブシステム：":F==="concept"?"データ構造：":"状態遷移：")+_+"のタブを閉じる");le.onclick=()=>{Ht(),F==="concept"?(Ze=Ze.filter(xe=>xe!==W),W!=="overview"&&(gt.get(W)?.remove(),gt.delete(W)),st.delete(W),rn.delete(W),an.delete(W),Ue.delete(W),Bt.delete(W),yt.delete(W),ne===F&&G===W&&(Ze.length?St(Ze.at(-1),!1):vn())):(Ye=Ye.filter(xe=>xe!==W),ne===F&&ct===W&&(Ye.length?yn(Ye.at(-1),!1):vn())),vt(),pt(),Fe(),He(),i.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Re.append(le),x.append(Re)}};h(l,Ze,"concept"),h(r,Ye,"states"),f.replaceChildren();for(const x of dt){const P=Zr(x),F=document.createElement("div");F.className="tab"+(ne==="tests"&&x===he?" active":""),F.dataset.viewKind="tests";const W=document.createElement("button");W.id="spec-tab-"+x,mo(W,"tests",P),W.setAttribute("aria-current",String(ne==="tests"&&x===he)),W.onclick=()=>xt(x);const _=ho("テスト仕様："+P+"のタブを閉じる");_.onclick=()=>{dt=dt.filter(ce=>ce!==x),ne==="tests"&&he===x&&(dt.length?xt(dt.at(-1),!1):vn()),vt(),pt(),Fe(),He()},F.append(W,_),f.append(F)}const v=c.querySelector(".tab.active:not([hidden])"),O=ne==="business"?"business:"+t.business().viewKey:ne==="concept"?"concept:"+G:ne==="states"?"states:"+ct:ne==="tests"?"tests:"+he:"";v?(O!==eo&&Ha(c,v),eo=O):eo=""}function ca(){innerWidth<=800&&ai(!1)}function pt(){const h=I.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,v=I.scrollTop,O=t.business(),x=j.value.trim().toLocaleLowerCase();I.replaceChildren();const P=(z,le,xe)=>({kind:"item",id:z,name:le,key:xe}),F=(z,le,xe)=>({kind:"group",id:z,name:le,children:xe}),W=O.design?.model?O.activities.filter(z=>Be(z.id)).map(z=>P("activity:"+z.id,z.name,"tests:activity:"+z.id)):[],_=[{id:"business",label:"業務設計",items:[P("overview","全体図","business:overview"),F("business-activity","Activity",O.activities.map(z=>P(z.id,z.name,"business:"+z.id))),F("business-object","Object",(O.objects??[]).map(z=>P(z.id,z.name,"object:"+z.id)))]},{id:"states",label:"状態遷移",items:(O.states??[]).map(z=>P(z.id,z.name,"states:"+z.id))},{id:"subsystems",label:"サブシステム",items:M?.model.subsystems.length?[P("landscape","全体図","concept:landscape"),...M.model.subsystems.map(z=>F("subsystem-"+z.id,z.name.replace(/サブシステム$/,""),M.model.reviewGroups.filter(le=>le.subsystemId===z.id).map(le=>P(R(le.id),le.title,"concept:"+R(le.id)))))]:[]},{id:"concept",label:"データ構造",items:ze&&ie.length?[P("overview","全体図","concept:overview"),F("concept-relations","概念",ie.map(z=>P($(z),te[z].name,"concept:"+$(z))))]:[]},{id:"tests",label:"テスト仕様",items:W}];let ce=0;const Re=(z,le,xe)=>{const Ce=document.createElement("button");if(Ce.className="explorer-item"+(xe?" explorer-item-nested":""),Ce.dataset.explorerKey=z.key,le.id==="tests"&&z.id.startsWith("activity:")&&O.design){const Le=Uc(O.design,z.id.slice(9),fe());if(!Le.available||Le.unlinked){const Xe=document.createElement("span");Xe.className="activity-test-unlinked",Xe.setAttribute("role","img"),Xe.setAttribute("aria-label","テスト未結合"),Ce.append(Xe)}}Ce.append(document.createTextNode(z.name));const De=O.views?.find(Le=>Le.key===O.viewKey);return ne===(le.id==="subsystems"?"concept":le.id)&&(["concept","subsystems"].includes(le.id)?z.id===G:le.id==="states"?z.id===ct:le.id==="tests"?z.id===he:z.key.startsWith("object:")?De?.object===z.id:z.id==="overview"?!lt&&De?.activity===void 0&&De?.object===void 0:De?.activity===z.id)&&Ce.setAttribute("aria-current","page"),Ce.disabled=le.id==="business"&&!O.key,Ce.onclick=()=>{k.hidden||t.closeLegacyList(),le.id==="business"?z.key.startsWith("object:")?ta(z.id):Wn(z.id==="overview"?void 0:z.id):le.id==="concept"||le.id==="subsystems"?St(z.id):le.id==="tests"?xt(z.id):yn(z.id),ca()},Ce},ee=(z,le,xe,Ce=!1)=>{const De=document.createElement("button"),$e=x?!cn.has(z):et.has(z);return De.className=(xe?"explorer-subparent":"explorer-parent")+(Ce?" explorer-pending":""),De.dataset.explorerKey="group:"+z,Se(De,"span",le).className="explorer-parent-label",Ce?(De.disabled=!0,De):(De.setAttribute("aria-expanded",String($e)),De.setAttribute("aria-controls","explorer-"+z),De.append(Va($e)),De.onclick=()=>{x?cn.has(z)?cn.delete(z):cn.add(z):(et.has(z)?et.delete(z):et.add(z),Fe()),pt()},De)};for(const z of _){const le=z.items.flatMap(Le=>{if(Le.kind==="item")return!x||(z.label+" "+Le.name).toLocaleLowerCase().includes(x)?[Le]:[];const Xe=x?Le.children.filter(wn=>(z.label+" "+Le.name+" "+wn.name).toLocaleLowerCase().includes(x)):Le.children;return!x||Xe.length?[{...Le,children:Xe}]:[]});if(x&&!le.length)continue;const xe=z.id!=="business"&&!z.items.length,Ce=document.createElement("section"),De=ee(z.id,z.label,!1,xe),$e=document.createElement("div");$e.id="explorer-"+z.id,$e.hidden=xe||(x?cn.has(z.id):!et.has(z.id));for(const Le of le){if(Le.kind==="item"){$e.append(Re(Le,z,0)),ce++;continue}const Xe=document.createElement("div");Xe.id="explorer-"+Le.id,Xe.hidden=x?cn.has(Le.id):!et.has(Le.id),$e.append(ee(Le.id,Le.name,!0),Xe);for(const wn of Le.children)Xe.append(Re(wn,z,1)),ce++;!Le.children.length&&!x&&(Se(Xe,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!le.length&&!xe&&(Se($e,"p","項目がありません。").className="explorer-empty"),Ce.append(De,$e),I.append(Ce)}x&&!ce&&(Se(I,"p","該当する項目はありません。").className="explorer-empty"),I.scrollTop=v,h&&Array.from(I.querySelectorAll("[data-explorer-key]")).find(z=>z.dataset.explorerKey===h)?.focus({preventScroll:!0})}function ai(h){Lt=h,mt(),Fe(),(h?a.querySelector(".shell-heading button"):A).focus({preventScroll:!0})}A.addEventListener("click",h=>{h.preventDefault(),h.stopImmediatePropagation(),ai(!Lt)},!0),a.querySelector(".shell-heading button").onclick=()=>ai(!1),j.oninput=()=>{cn.clear(),pt()},a.addEventListener("keydown",h=>{if(h.key==="Escape"&&!h.defaultPrevented&&k.hidden&&(h.preventDefault(),h.stopPropagation(),ai(!1)),(h.key==="ArrowDown"||h.key==="ArrowUp")&&I.contains(document.activeElement)){const v=Array.from(I.querySelectorAll("button")).filter(P=>!P.disabled&&!P.closest("[hidden]")),O=v.indexOf(document.activeElement),x=v[O+(h.key==="ArrowDown"?1:-1)];x&&(h.preventDefault(),x.focus())}}),y.addEventListener("click",h=>{ne!=="business"&&(h.preventDefault(),h.stopImmediatePropagation(),(ne==="concept"||ne==="states"||ne==="tests"&&be(ut.get(he)??he)?.capability.testSpecification)&&(at.setOpen(!at.isOpen()),mt(),Fe(),He(!1)))},!0),T.querySelector(".shell-heading button").onclick=()=>{at.setOpen(!1),mt(),Fe(),He(!1),y.focus({preventScroll:!0})},m.querySelector(".shell-heading button").onclick=()=>{at.setOpen(!1),mt(),Fe(),He(!1),y.focus({preventScroll:!0})},window.addEventListener("message",h=>{if(h.origin!==location.origin&&!(location.protocol==="file:"&&h.origin==="null"))return;const v=Array.from(gt).find(([,x])=>h.source===x.contentWindow);if(!v)return;if(h.data?.type==="alder-concept-rendered"){v[1].contentDocument&&(ys(v[1].contentDocument),vs(v[1].contentDocument));return}if(ne!=="concept"||v[0]!==G)return;const O=B(G);if(h.data?.type==="alder-concept-clear-selection"){O&&fs(!0);return}if(h.data?.type==="alder-concept-subsystem"){if(!Zi(G)?.regions.some(x=>x.id===h.data.id))return;st.delete(G),rn.delete(G),an.set(G,h.data.id),ri(),mt(),Fe();return}if(!(!ie.includes(h.data?.id)||O&&!O.concepts[h.data?.id])){if(h.data.type==="alder-concept-open"){St($(h.data.id));return}h.data.type==="alder-concept-select"&&(an.delete(G),st.set(G,h.data.id),(typeof h.data.viewId=="string"?Zi(G)?.tables[h.data.viewId]:void 0)?.conceptId===h.data.id?rn.set(G,h.data.viewId):rn.delete(G),innerWidth<=800&&(Lt=!1),ri(),mt(),Fe())}});function ms(){const h=getComputedStyle(document.documentElement);for(const v of gt.values()){const O=v.contentDocument?.documentElement;if(O){O.dataset.theme=document.documentElement.dataset.theme??"light";for(const x of["--bg","--panel","--fg","--line","--subtle","--select"])O.style.setProperty(x,h.getPropertyValue(x))}}}function mt(){!k.hidden&&ne==="business"&&(Lt=!0),a.hidden=!Lt,A.disabled=!1,A.setAttribute("aria-controls","design-explorer"),A.setAttribute("aria-label","ナビゲーションを開閉"),A.setAttribute("aria-expanded",String(Lt));const h=at.isReady?.()??!0;T.hidden=ne!=="concept"||!ze||!h||!at.isOpen();const v=!!be(ut.get(he)??he)?.capability.testSpecification;m.hidden=!(ne==="states"||ne==="tests"&&v)||!h||!at.isOpen(),ni&&ne!=="business"&&(ni.hidden=!0),ne==="concept"?(y.disabled=!ze||!h,y.setAttribute("aria-controls","concept-related-panel"),y.setAttribute("aria-label","データ構造の情報を開閉"),y.setAttribute("aria-expanded",String(!T.hidden))):ne==="business"?y.setAttribute("aria-controls","formattedMarkdownDrawer"):ne==="states"||ne==="tests"&&v?(y.disabled=!h,y.setAttribute("aria-controls","test-related-panel"),y.setAttribute("aria-label","関連資料を開閉"),y.setAttribute("aria-expanded",String(!m.hidden))):(ne==="tests"||ne==="empty")&&(y.disabled=!0,y.setAttribute("aria-expanded","false"));const O=i.querySelector("#document-actions");O&&(O.hidden=ne!=="business");const x=i.querySelector("#document-actions-toggle");x&&ne!=="business"&&(x.hidden=!0),ms(),to()}function to(){const h=i.getBoundingClientRect().bottom;h>0&&e.style.setProperty("--shell-content-top",h+"px")}if(typeof ResizeObserver<"u"){const h=new ResizeObserver(to);h.observe(i),h.observe(e.querySelector("header"))}window.addEventListener("resize",to);function hs(){Ht(),oi=!0;try{const h=new URL(location.href).searchParams;if(ne==="concept"&&h.get("view")==="concept"&&h.get("concept")===G&&!Ue.has(G)&&Y(G,h.get("dataExample"))&&_e.set("drawer-overview:"+G,T.querySelector(".concept-drawer-body").scrollTop),ze||(yt.clear(),Ue.clear(),Bt.clear(),Ze=[],G="overview",E.removeAttribute("src"),E.removeAttribute("srcdoc")),h.get("view")==="concept"){const v=ze&&ue.includes(h.get("concept")??"")?h.get("concept"):"landscape",O=h.get("dataExample");ze&&B(v)&&h.get("dataView")==="overview"&&!Y(v,O)?(yt.add(v),Ue.delete(v)):(yt.delete(v),ze&&Y(v,O)?(Ue.set(v,O),Bt.set(v,O)):Ue.delete(v)),St(v,!1)}else if(h.get("view")==="states")t.business().states?.some(v=>v.id===h.get("state"))?yn(h.get("state"),!1):vn();else if(h.get("view")==="tests"){const v=h.get("spec")??"@overview",O=qn(v),x=h.get("specPart"),P=x&&be(x)&&qn(x)===O?x:v,F=h.get("dataExample"),W=be(P);W&&F&&W.samples.some(_=>_.id===F)?Qe.set(W.key,F):W&&Qe.delete(W.key),W||ut.delete(O),xt(P,!1)}else if(h.get("view")==="empty")ft("empty");else if(ft("business"),t.business().key){const v=h.get("activity"),O=h.get("object"),x=t.business(),P=x.views?.find(F=>F.key===x.viewKey);v&&x.activities.some(F=>F.id===v)?P?.activity!==v&&t.openActivity(v):O&&x.objects?.some(F=>F.id===O)?P?.object!==O&&t.openObject(O):(lt=!1,(!P||P.activity!==void 0||P.object!==void 0)&&t.openOverview())}vt(),pt()}finally{oi=!1}}return window.addEventListener("popstate",hs),{closeBusinessOverview:ra,reopenBusinessOverview(){lt=!1},activateBusiness(){ft("business")},businessActivated(){ft("business"),vt(),pt(),He()},syncChrome:mt,appendActivityTestLinks(h,v){na(h,v),_i(h,cs(v))},openRelatedChecks(h){et.add("tests"),xt(h&&Be(h)?"checks:"+h:"@overview")},syncDocument(){const h=t.business(),v=h.concept,O=!!(gn&&h.key!==gn||si&&Tn&&h.key&&h.key!==Tn),x=M?.model!==v?.model||M?.business!==v?.business;if((O||x&&M)&&(g.querySelector(".test-spec-page").replaceChildren(),m.querySelector(".spec-related-content").replaceChildren(),T.querySelector(".concept-related-content").replaceChildren(),lt=!1,Ze=[],Ye=[],dt=[],G="overview",ct="",he="@overview",Qe.clear(),ut.clear(),_e.clear(),yt.clear(),Ue.clear(),Bt.clear(),sa(),ne!=="business"&&ft("business"),O&&!si&&He(!1)),x){M=v,V=v?Ka(v):void 0,q=v?oc(v):void 0,re=v?Za(v):void 0,ze=!!v,te=V?.tables??{},ie=Object.keys(te);const P=V?.groups.map(W=>W.id)??[],F=new Set([...kn,"subsystems"]);if(ve=new Map(P.map(W=>[W,F.has(W)||ie.includes(W)?"group:"+W:W])),Me=new Map(ie.map(W=>[W,F.has(W)||P.includes(W)?"concept:"+W:W])),me=new Map([...ve].map(([W,_])=>[_,W])),Pe=new Map([...Me].map(([W,_])=>[_,W])),ue=[...kn,...me.keys(),...Pe.keys()],Array.isArray(Ie?.expanded)&&Ie.expandedVersion!==4){et.add("subsystems"),et.add("concept-relations");for(const W of v?.model.subsystems??[])et.add("subsystem-"+W.id)}}if(gn=h.key,Ye=Ye.filter(P=>h.states?.some(F=>F.id===P)),ne==="business"&&lt&&h.views?.find(P=>P.key===h.viewKey)?.activity===void 0&&h.views?.find(P=>P.key===h.viewKey)?.object===void 0&&vn(),si&&h.key){if(Yr(),Tn===h.key){Array.isArray(Ie?.specs)&&(dt=[...new Set(Ie.specs.filter(P=>typeof P=="string").map(P=>qn(P)))]);for(const[P,F]of Object.entries(Ie?.specExamples??{})){const W=be(P);typeof F=="string"&&W?.capability.samples.some(_=>_.id===F)&&Qe.set(W.key,F)}for(const[P,F]of Object.entries(Ie?.specFocus??{}))typeof F=="string"&&be(F)&&qn(F)===P&&ut.set(P,F)}si=!1,hs()}pt(),vt(),mt(),O&&Fe()}}}class wo{tabs=new WeakMap;router;constructor(t=fo){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,i,o,s){const a=JSON.stringify([i.map(u=>[u.id,u.width,u.height]),o.map(u=>[u.kind,u.from,u.to,u.label]),s]),d=this.tabs.get(t),c=!d||d.design!==n||d.structure!==a,l=new Set(i.filter(u=>{const b=d?.nodes.get(u.id);return!b||b.x!==u.x||b.y!==u.y}).map(u=>u.id)),r=new Set(i.map(u=>u.id)),f=c?new Array(o.length):d.routes.slice();if(o.forEach((u,b)=>{!c&&!l.has(u.from)&&!l.has(u.to)||(f[b]=r.has(u.from)&&r.has(u.to)?this.router({from:u.from,to:u.to,index:b,nodes:i,kind:u.kind,matrix:s?.[b],labels:s?.[b]?[]:[...f.flatMap((g,m)=>g&&m<b?[{id:String(m),x:g.label[0]-Math.max(30,o[m].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,o[m].label.length*12),height:18}]:[])],wires:s?.[b]?[]:f.flatMap((g,m)=>g&&m<b?[g.points]:[]),labelWidth:Math.max(30,u.label.length*12),labelHeight:18}):void 0)}),s){const u=[],b=new Map,g=f.map((m,p)=>p).sort((m,p)=>Number(s[m].returning)-Number(s[p].returning));for(const m of g){const p=f[m];if(!p)continue;const k=i.find(E=>E.id===o[m].from),A=Math.max(30,o[m].label.length*12),y=s[m].returning?[Math.max(...p.points.map(E=>E[0]))+8+A/2,p.points[0][1]]:[k.x+k.width*.125+8+A/2,ba(k.y+k.height,s[m].captionLane*sr)+9],j=rr(o[m],m,s[m]),I=b.get(j)??po(y,A,18,i,u);(I[0]!==p.label[0]||I[1]!==p.label[1])&&(f[m]={...p,label:I}),b.has(j)||(b.set(j,I),u.push({id:String(m),x:I[0]-A/2,y:I[1]-9,width:A,height:18}))}}return this.tabs.set(t,{design:n,structure:a,nodes:new Map(i.map(u=>[u.id,{...u}])),routes:f}),f}}function Bc(e,t,n,i){const o=(f,u,b)=>(u[0]-f[0])*(b[1]-f[1])-(u[1]-f[1])*(b[0]-f[0]),s=o(e,t,n),a=o(e,t,i),d=o(n,i,e),c=o(n,i,t),l=1e-6;if(s*a<-l&&d*c<-l)return!0;if(Math.max(Math.abs(s),Math.abs(a),Math.abs(d),Math.abs(c))>l)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],i[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],i[r]))>.1}function Hc(e,t,n,i,o=[]){const s=e.x+e.width,a=24,d=e.y+e.height,c=s-8-(2*(n.count-n.index)-1)*a,l=t.filter(A=>A.id!==e.id);let r;for(const A of[0,-24,24,-48,48,-72,72])for(const y of[0,16,32,64,128,256]){const j=[c+A,d],I=[j[0]+a,d];if(j[0]<e.x+8||I[0]>s-8)continue;const E=d+n.depth+y,T=Math.min(12,(I[0]-j[0])/2,(E-d)/2),N=[j];let S=`M${j}`;const L=q=>{S+=` L${q}`,N.push(q)},D=(q,re)=>{const te=N.at(-1);S+=` Q${q} ${re}`;for(let ie=1;ie<=4;ie++){const ue=ie/4,me=1-ue;N.push([me*me*te[0]+2*me*ue*q[0]+ue*ue*re[0],me*me*te[1]+2*me*ue*q[1]+ue*ue*re[1]])}};L([j[0],E-T]),D([j[0],E],[j[0]+T,E]),L([I[0]-T,E]),D([I[0],E],[I[0],E-T]),L(I);const M=ga(N,l,.3),V=o.filter(q=>N.slice(1).some((re,te)=>q.slice(1).some((ie,ue)=>Bc(N[te],re,q[ue],ie)))).length;if((!r||M<r.collisions||M===r.collisions&&V<r.wireCollisions)&&(r={path:S,points:N,collisions:M,wireCollisions:V,low:E,extra:y,shift:A}),M===0&&V===0)break}const{path:f,points:u,collisions:b,wireCollisions:g,low:m,extra:p,shift:k}=r;return{path:f,points:u,label:[Math.max(s+8,n.labelLeft)+i/2,m],bounds:{right:Math.max(...u.map(A=>A[0])),bottom:Math.max(...u.map(A=>A[1]))},collisions:b+g,rerouted:p>0||k!==0,fallback:b+g>0}}function Gc(e,t=Po()){const n="http://www.w3.org/2000/svg",i=(R,$={})=>{const B=document.createElementNS(n,R);for(const[pe,Y]of Object.entries($))B.setAttribute(pe,Y);return B},o={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(R=>[R]),a=[...new Set(["@new",...e.states,...s.map(R=>R[0].to)])],d={nodes:a.map(R=>({id:R,type:"business",name:o[R]??R,scope:!0})),relations:s.map(([R])=>({kind:R.path==="exception"?"business-exception":"input",from:R.from,to:R.to,label:R.id+"："+R.activity+"："+R.condition}))},c=Wo(d,a),l=R=>{const $=Array.from(R);return Array.from({length:Math.ceil($.length/28)},(B,pe)=>$.slice(pe*28,(pe+1)*28).join(""))},r=s.map(([R])=>({from:R.from,activity:R.activity,rows:[R],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[R,$]of r.entries()){const B=$.rows[0],pe=e.transitions.filter(ae=>ae.from===B.from&&(ae.activityId??ae.activity)===(B.activityId??B.activity)&&ae.path===B.path&&(B.path!=="exception"||(ae.exception??"例外名未定義")===(B.exception??"例外名未定義"))),Y=pe.map(ae=>(ae.conditionLabel??ae.condition).trim().replace(/\s+/g," ")),Ee=new Set(Y).size===pe.length?B.conditionLabel??B.condition:B.condition,fe=[B.path==="exception"?"例外："+(B.exception??"例外名未定義"):"",...pe.length>1||B.path==="normal"&&B.conditionLabel?[Ee]:[]].filter(Boolean).join("：");$.lines=l($.activity+(fe?"（"+fe+"）":"")),$.lineRows=$.lines.map(()=>$.rows),$.width=Math.max(...$.lines.map(ae=>Array.from(ae).length*14)),$.height=$.lines.length*18,c.wires[R].returning||($.offset=f.has($.from)?f.get($.from)+8:0,f.set($.from,$.offset+$.height))}const u=new Map;s.forEach(([R],$)=>{if(R.from===R.to){const B=u.get(R.from)??[];B.push($),u.set(R.from,B)}});const b=new Map,g=new Map;for(const[R,$]of u){let B=0;for(const Y of[...$].reverse())b.set(Y,{leader:$[0],index:0,count:1,depth:0,offset:B}),B+=r[Y].height+8;const pe=24+Math.max(0,B-8)+8;g.set(R,pe);for(const Y of $)b.get(Y).depth=pe}const m=R=>44,p=a.slice().sort((R,$)=>c.positions[R][1]-c.positions[$][1]);let k=Math.max(40,...r.map((R,$)=>c.wires[$].returning&&R.from===p[0]?16+R.height/2-44*(c.wires[$].fromPort??.5):40));const A=new Map;for(const R of p){const $=m(),B=(f.get(R)??0)+(g.get(R)??0);A.set(R,k),k+=ya($,B)}const y=a.map(R=>({id:R,x:t.positions.get(R)?.[0]??c.positions[R][0],y:t.positions.get(R)?.[1]??A.get(R),width:Math.max(104,Array.from(o[R]??R).length*14+32),height:m()})),j=i("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),I=i("title");I.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(a.includes("@none")?"作成なしはこの操作の処理結果。":"")+(a.includes("@unknown")?"未決は設計課題。":""),j.append(I),j.append(To("state-transition-"));const E=new Map,T=[],N=[];let S=t.selected;const L=R=>{S=R,t.selected=R;const $=vi(e.transitions,S);for(const[Y,Ee]of E)Ee.setAttribute("class","node graph-shape state-shape"+$.nodeClasses(Y)),Ee.setAttribute("aria-pressed",String(Y===S));T.forEach(({element:Y,rows:Ee})=>{const Ne=Ee[0].from===Ee[0].to;Y.setAttribute("class","edge"+(Ne?" state-self-loop":Ee[0].path==="exception"?" exception":"")+$.labelClasses(Ee)),Y.setAttribute("marker-end","url(#state-transition-"+(Ee.some($.related)?"related-arrow":"arrow")+")")});for(const Y of N)Y.element.setAttribute("class","state-caption-line"+$.labelClasses(Y.rows));j.querySelectorAll("[data-exception-paint]").forEach(Y=>Y.remove());const B=Array.from(j.children).find(Y=>Y.matches(".state-diagram-edge-label,[data-state]"))??null,pe=[...T].sort((Y,Ee)=>Number(Y.rows.some($.related))-Number(Ee.rows.some($.related)));for(const{element:Y}of pe)if(j.insertBefore(Y,B),Y.classList.contains("exception")||Y.classList.contains("state-self-loop")){const Ee=j.children.length;qo(j,Y,{path:Y.getAttribute("d")},{"data-transitions":Y.getAttribute("data-transitions")});for(const Ne of Array.from(j.children).slice(Ee))j.insertBefore(Ne,B)}j.querySelectorAll(".state-diagram-edge-label").forEach(Y=>j.append(Y))};j.addEventListener("click",R=>{R.target===j&&L()}),j.addEventListener("keydown",R=>{R.key==="Escape"&&(R.preventDefault(),L())});const D=c.wires.map((R,$)=>({...R,captionLane:(r[$].offset+(g.get(r[$].from)??0))/sr})),M=d.relations.map((R,$)=>({...R,label:String($).padEnd(Math.ceil(r[$].width/12),"x")})),V=[...b].map(([R,$])=>{const B=y.find(Y=>Y.id===s[R][0].from),pe=r[R];return{x:B.x+B.width+8,y:B.y+B.height+24+$.offset,width:pe.width,height:pe.height}});let q=new wo().update({},e,y,M,D);for(let R=0;R<=V.length;R++){let $=!1,B=0;if(q.forEach((pe,Y)=>{if(!pe||b.has(Y)||!D[Y].returning)return;let Ee=0;for(const Ne of V)for(let fe=1;fe<pe.points.length;fe++){const ae=pe.points[fe-1],be=pe.points[fe];if(Math.abs(ae[0]-be[0])>1e-7||Math.abs(ae[1]-be[1])<2)continue;const Ve=ae[0];if(Ve<Ne.x-4||Ve>Ne.x+Ne.width+4||Math.max(ae[1],be[1])<Ne.y-4||Math.min(ae[1],be[1])>Ne.y+Ne.height+4)continue;const Be=Ne.x+Ne.width+12-Ve;Be>0&&(Ee=Math.max(Ee,Be))}Ee&&(D[Y]={...D[Y],returnLane:(D[Y].returnLane??0)+Math.ceil(Ee/16)+B++},$=!0)}),!$)break;q=new wo().update({},e,y,M,D)}const re=q.flatMap((R,$)=>R&&!b.has($)?[R.points]:[]),te=new Map,ie=q.map((R,$)=>{const B=b.get($);if(!B)return R;const pe=s[$][0].from,Y=y.find(Be=>Be.id===pe),Ee=q.flatMap((Be,Vt)=>Be&&!b.has(Vt)?[Be.points]:[]),Ne=Math.max(30,M[$].label.length*12),fe=r[$];let ae=te.get(B.leader);ae||(ae=Hc(Y,y,{...B,labelLeft:Y.x+Y.width+8},Ne,re),te.set(B.leader,ae),re.push(ae.points));const be=Ee.flatMap((Be,Vt)=>Be.slice(1).map((on,sn)=>({id:`${Vt}:${sn}`,x:Math.min(Be[sn][0],on[0])-2,y:Math.min(Be[sn][1],on[1])-2,width:Math.abs(Be[sn][0]-on[0])+4,height:Math.abs(Be[sn][1]-on[1])+4}))),Ve=po([Y.x+Y.width+8+fe.width/2,Y.y+Y.height+24+B.offset+fe.height/2],fe.width,fe.height,[...y,...be]);return{...ae,label:[Ve[0]-fe.width/2+Ne/2,Ve[1]]}}),ue=new Array(s.length),me=[],Pe=s.map((R,$)=>$).sort((R,$)=>Number(D[R].returning)-Number(D[$].returning));for(const R of Pe){const $=ie[R],B=r[R],pe=Math.max(30,M[R].label.length*12);let Y=[$.label[0]-pe/2+B.width/2,$.label[1]+(D[R].returning?0:B.height/2-9)];const Ee=y.find(ae=>ae.id===s[R][0].from),Ne=y.find(ae=>ae.id===s[R][0].to);if(!b.has(R)&&D[R].returning&&Ne&&Ne.y>Ee.y){const ae=$.points.slice(1).map((be,Ve)=>[$.points[Ve],be]).filter(([be,Ve])=>Math.abs(be[0]-Ve[0])<.01&&Ve[1]-be[1]>24).sort(([be,Ve],[Be,Vt])=>Vt[1]-Be[1]-(Ve[1]-be[1]))[0];if(ae){const[be,Ve]=ae;Y=[be[0]+8+B.width/2,be[1]+Math.min(24+B.height/2,(Ve[1]-be[1])/2)]}}const fe=po(Y,B.width,B.height,y,me);ue[R]=fe,me.push({id:String(R),x:fe[0]-B.width/2,y:fe[1]-B.height/2,width:B.width,height:B.height})}let ve=Math.max(...y.map(R=>R.x+R.width))+40,Me=Math.max(...y.map(R=>R.y+R.height))+40;s.forEach((R,$)=>{const B=b.get($);if(B&&B.leader!==$)return;const pe=B?s.flatMap((ae,be)=>b.get(be)?.leader===$?ae:[]):R,Y=pe[0],Ee=ie[$],Ne=i("path",{d:Ee.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":pe.map(ae=>ae.id).join(" ")});(B||Y.path==="exception")&&Ne.setAttribute("stroke-dasharray","6 5");const fe=i("title");fe.textContent=pe.map(ae=>`${ae.id} ${ae.activity} / ${ae.path==="normal"?"通常":"例外："+(ae.exception??"例外名未定義")}：${ae.condition}`).join(" / "),Ne.append(fe),j.append(Ne),T.push({element:Ne,rows:pe}),ve=Math.max(ve,Ee.bounds.right+40),Me=Math.max(Me,Ee.bounds.bottom+40)});for(const[R,$]of r.entries()){const B=ue[R],pe=B[0]-$.width/2,Y=B[1]-$.height/2+14;j.append(i("rect",{x:String(pe),y:String(Y-14),width:String($.width),height:String($.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const Ee=i("text",{x:String(pe),y:String(Y),class:"state-diagram-edge-label","data-activity":$.activity,"data-transition-id":$.rows[0].id,"aria-label":$.lines.join("")});$.lines.forEach((Ne,fe)=>{const ae=i("tspan",{x:String(pe),dy:fe?"18":"0","font-size":"14","font-weight":"600"});ae.textContent=Ne,ae.setAttribute("data-transitions",$.lineRows[fe].map(be=>be.id).join(" ")),N.push({element:ae,rows:$.lineRows[fe]}),Ee.append(ae)}),j.append(Ee),ve=Math.max(ve,pe+$.width+24),Me=Math.max(Me,Y+$.height+24)}for(const R of y){const $=R.id.startsWith("@"),B=i("g",{role:"button",tabindex:"0","aria-label":o[R.id]??R.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":R.id,"data-node":R.id});B.append(ir(document,R,$)),B.append(i("rect",{x:String(R.x),y:String(R.y),width:String(R.width),height:String(R.height),rx:$?"20":"8",class:$?"state-diagram-node state-note":"state-diagram-node"}));const pe=i("text",{x:String(R.x+R.width/2),y:String(R.y+R.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(pe.textContent=o[R.id]??R.id,B.append(pe),$&&R.id!=="@new"){const Y=i("text",{x:String(R.x+R.width/2),y:String(R.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Y.textContent=R.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",B.append(Y)}B.addEventListener("click",()=>L(R.id)),B.addEventListener("keydown",Y=>{(Y.key==="Enter"||Y.key===" ")&&(Y.preventDefault(),L(R.id))}),E.set(R.id,B),j.append(B)}return L(t.selected),j.setAttribute("viewBox",`0 0 ${ve} ${Me}`),j.style.minWidth=`${ve}px`,j}const js=new WeakMap;function Kc(e,t,n){const i=e.objectStateTransitions?.[t];if(!i||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const o=document.createElement("section");o.className="state-transition-panel",o.setAttribute("aria-label","状態遷移");const s=(m,p,k=o)=>{const A=document.createElement(m);return A.textContent=p,k.append(A),A};if(i.error)return s("p","状態遷移を表示できません："+i.error).setAttribute("role","status"),o;const a=i.model;for(const m of a.transitions){if(!e.graph.nodes.some(p=>p.id===m.activity&&p.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),o;if(m.exceptionId){const p=e.model?.business.exceptions?.find(k=>k.id===m.exceptionId);if(!p||p.activityId!==m.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),o}}const d=js.get(e)??new Map;js.set(e,d);const c=d.get(t)??Po();d.set(t,c);const l={...a,transitions:a.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(p=>p.id===m.activity)?.name??m.activity}))};o.append(nr(document,m=>Gc(l,m),c));const r=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},u=document.createElement("details");s("summary",`操作の詳細（${a.transitions.length}）`,u);const b=document.createElement("ol");u.append(b),o.append(u);for(const m of a.transitions){const p=document.createElement("li");p.dataset.transition=m.id,s("h3",`${m.id} · ${r(m.from)} → ${r(m.to)}`,p),m.path==="exception"&&s("p","例外名："+(m.exception??"未定義"),p),s("p",`${f[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,p);const k=e.graph.nodes.find(A=>A.id===m.activity&&A.type==="business");if(k){const A=document.createElement("button");A.type="button",A.textContent=k.name,A.onclick=()=>n(k.id),p.append(A)}else s("p","要確認：根拠Activityが見つかりません — "+m.activity,p);s("p","条件："+m.condition,p),s("p",m.note,p),s("p","根拠："+m.evidence,p),b.append(p)}a.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",a.source,g),o.append(g),o}const Ms=64,_c=96,Jc=260,Ls=40,Xc=4;function Zc(e,t,n=!0){const{nodes:i,previous:o,children:s,parents:a,forwardRelations:d,feedbackRelations:c,exceptionRelations:l}=va(e,t),r=a.map(I=>I.length),f=i.map(()=>0),u=i.flatMap((I,E)=>r[E]===0?[E]:[]);for(let I=0;I<u.length;I++)for(const E of s[u[I]])f[E]=Math.max(f[E],f[u[I]]+1),--r[E]===0&&u.push(E);const b=Array.from({length:f.reduce((I,E)=>Math.max(I,E),0)+1},()=>[]);i.forEach((I,E)=>b[f[E]].push(E));const g=i.map(()=>0),m=I=>I.forEach((E,T)=>g[E]=T);b.forEach(m);for(let I=0;I<Xc;I++){const E=I%2?[...b].reverse():b;for(const T of E){const N=new Map(T.map(S=>{const L=I%2?s[S]:a[S];return[S,L.length?L.reduce((D,M)=>D+g[M],0)/L.length:g[S]]}));T.sort((S,L)=>N.get(S)-N.get(L)||S-L),m(T)}}const p=b[0].filter(I=>i[I].type==="object"&&o[I].length===0&&s[I].length>0);if(n&&p.length>1){const I=new Set(p),E=b[0].filter(T=>!I.has(T));b.splice(0,1,...p.map((T,N)=>N===0?[...E,T]:[T]))}const k=Object.create(null),A=i.map(()=>0),y=[],j=Math.ceil(Jc/Ms)-1;for(let I=0;I<b.length;I++){const E=new Map;for(const S of y)for(const L of S)E.set(L,L+1);const T=S=>{let L=S;for(;E.has(L);)L=E.get(L);let D=S;for(;E.has(D);){const M=E.get(D);E.set(D,L),D=M}return L},N=[];for(const S of b[I]){let L=I;for(const M of a[S])L=Math.max(L,A[M]+1);const D=T(L);A[S]=D,E.set(D,D+1),N.push(D),k[i[S].id]=[Ls+I*Ms,Ls+D*_c]}y.push(N),y.length>j&&y.shift()}return{positions:k,forwardRelations:d,feedbackRelations:c,exceptionRelations:l}}function Yc(e,t){return ar(e)?Wo(e,t).positions:Zc(e,t).positions}const Rs=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function gr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,i)=>Rs(n.name,i.name)),relations:[...e.relations].sort((n,i)=>{for(const o of["kind","from","to","label"]){const s=Rs(o==="from"||o==="to"?t.get(n[o]):n[o],o==="from"||o==="to"?t.get(i[o]):i[o]);if(s)return s}return 0})}}function yr(e){const t=gr(e.graph),n=new Map(t.nodes.map(o=>[o.id,o.name])),i=new Map(t.nodes.map(o=>[o.name,o.id]));return{graph:{...t,nodes:t.nodes.map(o=>({...o,id:o.name})),relations:t.relations.map(o=>({...o,from:n.get(o.from),to:n.get(o.to)}))},order:e.activityOrder?.map(o=>n.get(o)),restore:o=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(o).map(([s,a])=>[i.get(s),a])))}}function vr(e){const t=yr(e);return t.restore(Yc(t.graph,t.order))}function Qc(e){const t=yr(e),n=Wo(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function wr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,i]=t;return{database:`alder-web-viewer:preview:pr-${n}:${i}`,pr:n,version:i}}function ed(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(a=>a.handle!==void 0):s.tabs.some(a=>a.handle!==void 0);if(n(e)||n(t))return!1;const i=new Set;function o(s,a){if(Object.is(s,a))return!0;if(!s||!a||typeof s!="object"||typeof a!="object"||i.has(s)||i.has(a))return!1;const d=b=>Array.isArray(b)||Object.getPrototypeOf(b)===null||Object.getPrototypeOf(b)?.constructor?.name==="Object";if(!d(s)||!d(a)||Array.isArray(s)!==Array.isArray(a)||Array.isArray(s)&&s.length!==a.length)return!1;i.add(s),i.add(a);const c=s,l=a,r=Object.keys(c),f=Object.keys(l),u=r.length===f.length&&r.every(b=>Object.hasOwn(l,b)&&o(c[b],l[b]));return i.delete(s),i.delete(a),u}return o(e,t)}function Nn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),i=Object.create(null);for(const[s,a]of Object.entries(e.positions))n.has(s)&&(i[s]=[...a]);const o=t.graph.nodes.filter(s=>!i[s.id]);if(o.length){const s=vr(t),a=Object.values(i);for(const d of o){const c=[...s[d.id]];for(;a.some(l=>Math.abs(l[0]-c[0])<280&&Math.abs(l[1]-c[1])<88);)c[1]+=180;i[d.id]=c,a.push(c)}}return{...e,design:t,positions:i,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function kr(){return new Promise((e,t)=>{const n=indexedDB.open(wr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class Fo extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let wi;function Ir(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function td(e){const t=wi;if(t===void 0)throw Error("Session has not been loaded");const n=await kr();try{await new Promise((i,o)=>{const s=n.transaction("session","readwrite"),a=s.objectStore("session"),d=a.get("generation"),c=a.get("current"),l=a.get("readonly-legacy");let r,f;l.onsuccess=()=>{try{const u=Ir(d.result);if(ed(c.result,e)){f=u;return}if(u!==t)throw new Fo;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");l.result===void 0&&id(c.result)&&a.put(c.result,"readonly-legacy"),a.put(e,"current"),a.put(f,"generation")}catch(u){r=u,s.abort()}},s.oncomplete=()=>{wi=f,i()},s.onerror=()=>o(r??s.error??Error("Session save failed")),s.onabort=()=>o(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function nd(){wi=void 0;const e=await kr();try{return await new Promise((t,n)=>{const i=e.transaction("session"),o=i.objectStore("session"),s=o.get("current"),a=o.get("generation");i.oncomplete=()=>{try{wi=Ir(a.result),t(s.result)}catch(d){n(d)}},i.onerror=()=>n(i.error),i.onabort=()=>n(i.error??Error("Session load aborted"))})}finally{e.close()}}function id(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Ns=new WeakMap;function od(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let i=Ns.get(e);i||(i=new Map,Ns.set(e,i));const o=i.get(t);if(o)return o;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),a=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),d=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&a.has(r.to)||r.to===t&&a.has(r.from))),c=new Set([t,...d.flatMap(r=>[r.from,r.to])]),l={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>c.has(r.id)),relations:d},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>c.has(r))};return i.set(t,l),l}const Ds=new WeakMap;function sd(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let i=Ds.get(e);i||(i=new Map,Ds.set(e,i));const o=t,s=i.get(o);if(s)return s;const a=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),d=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),c=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&d.has(f.to)||f.kind==="output"&&f.to===t&&d.has(f.from)||f.kind==="object-exception"&&(f.from===t&&a.has(f.to)||f.to===t&&a.has(f.from))),l=new Set([t,...c.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>l.has(f.id)),relations:c},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>l.has(f))};return i.set(o,r),r}const Sr=new WeakMap;function zt(e){return Sr.get(e)}const xr=["design","checks","source","draft","edited","handle"];function rd(e){return{key:e.key,name:e.name,...Object.fromEntries(xr.map(t=>[t,e[t]]))}}function Et(e){const{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:a,viewInset:d,canvasOrigin:c,scroll:l,zoom:r}=e;return{key:t,positions:n,selected:i,hiddenNodes:o,showExceptions:s,selectedEdgesOnly:a,viewInset:d,canvasOrigin:c,scroll:l,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function ji(e,t){const n=t;Sr.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const i=t.activity??t.object;return i===void 0?"全体図":e.design.graph.nodes.find(o=>o.id===i)?.name??i}});for(const i of xr)Object.defineProperty(n,i,{configurable:!0,get:()=>e[i],set:o=>{e[i]=o}});return n}function ki(e){return e.activity}function Ii(e){return e.object}function Hn(e){return e.activity??e.object}function Mi(e){return e.object===void 0?od(e.design,e.activity):sd(e.design,e.object)}function Li(e){const t=Mi(e),n=Nn({...e},t);if(e.hiddenNodes!==void 0){const i=new Set([...e.design.graph.nodes,...t.graph.nodes].map(o=>o.id));n.hiddenNodes=e.hiddenNodes.filter(o=>i.has(o))}return n}function Qt(e,t=[],n,i){const o=n??(e.tabs[0]?rd(e.tabs[0]):void 0),s=o?(i??[e.tabs[0]?Et(e.tabs[0]):{key:o.key,positions:{},scroll:[0,0],zoom:1}]).map(u=>{const b=ji(o,u);return Object.assign(u,Et(Li(b))),b}):[],{dark:a,drawer:d,width:c,preferWrite:l,nodeDrawer:r,sampleLayout:f}=e;return{dark:a,drawer:d,width:c,preferWrite:l,nodeDrawer:r,sampleLayout:f,document:o,tabs:s,recovery:t,urlHistory:e.urlHistory??[...o?.source?.kind==="url"?[{url:o.source.url,name:o.name}]:[],...t.filter(u=>u.source?.kind==="url").map(u=>({url:u.source.url,name:u.name}))].filter((u,b,g)=>g.findIndex(m=>m.url===u.url)===b),legacyViews:e.legacyViews,active:s.some(u=>u.key===e.active)?e.active:s[0]?.key}}function Vo(e){const{document:t,recovery:n,tabs:i,...o}=e;return{...o,format:3,document:t,views:i.map(Et),recovery:n}}function di(e){const t=(n,i=!1)=>Array.isArray(n)&&n.length===2&&n.every(o=>typeof o=="number"&&Number.isFinite(o)&&(!i||o>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function ad(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(i=>!i||typeof i.name!="string"||typeof i.url!="string"||!pd(i.url))||new Set(t.map(i=>i.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const i=e;if(![2,3].includes(i.format)||!Array.isArray(i.views)||!Array.isArray(i.recovery))throw Error("Invalid workspace");const o=e.legacyViews;if(o){if(!Array.isArray(o.views)||o.active!==void 0&&typeof o.active!="string"||o.documentKey!==void 0&&typeof o.documentKey!="string")throw Error("Invalid legacy backup");for(const r of o.views)di(r)}const{format:s,views:a,document:d,recovery:c,...l}=e;for(const r of a)di(r);for(const r of c)di(r);if(!!d!=!!a.length||new Set(a.map(r=>r.key)).size!==a.length)throw Error("Invalid workspace views");if(i.format===2){if(i.views.some(u=>u.group!==void 0&&typeof u.group!="string"))throw Error("Invalid legacy Group");if(i.views.length&&(i.views[0].group!==void 0||i.views.filter(u=>u.group===void 0).length!==1))throw Error("Invalid legacy views");const r=i.views[0],f=r?{...r}:void 0;return f&&delete f.group,Qt({...l,tabs:[],active:f?.key,legacyViews:{documentKey:d?.key,views:structuredClone(i.views),active:i.active}},c,d,f?[f]:[])}if(a.length&&(a[0].activity!==void 0||a[0].object!==void 0||a.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(a.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==a.filter(r=>r.activity!==void 0).length||new Set(a.filter(r=>r.object!==void 0).map(r=>r.object)).size!==a.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(d&&a.some(r=>r.activity!==void 0&&!d.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(d&&a.some(r=>r.object!==void 0&&!d.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return Qt({...l,tabs:[]},c,d,a)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(i=>i.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const i of e.tabs)di(i);const n=e.tabs.find(i=>i.key===e.active)??e.tabs[0];return Qt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function cd(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,i=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(o=>o.url!==n)]:e.urlHistory;return Qt({...e,urlHistory:i,tabs:[t],active:t.key},e.recovery)}function dd(e,t,n=e.document?.handle,i=!1){if(!e.document)return e;const o={...e.document,design:t,handle:n,edited:i,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(c=>c.type==="business").map(c=>c.id)),a=new Set(t.graph.nodes.filter(c=>c.type==="object").map(c=>c.id)),d=e.tabs.filter(c=>(c.activity===void 0||s.has(c.activity))&&(c.object===void 0||a.has(c.object))).map(Et);return Qt(e,e.recovery,o,d)}function ld(e,t){const n=e.tabs.find(o=>ki(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="business"&&o.id===t))throw Error("Unknown Activity");const i=ji(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Et(Li(i))),e.tabs.push(i),e.active=i.key,i}function ud(e,t){const n=e.tabs.find(o=>Ii(o)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(o=>o.type==="object"&&o.id===t))throw Error("Unknown Object");const i=ji(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(i,Et(Li(i))),e.tabs.push(i),e.active=i.key,i}function fd(e,t){const n=e.tabs.map(i=>{const o=t.tabs.find(s=>s.key===i.key);return Et(o?Li(ji(e.document,{...Et(i),...Et(o)})):i)});return Qt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(i=>i.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function pd(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Ri(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const i=d=>d instanceof HTMLButtonElement&&d.disabled,o=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(d=>!d.hidden&&!i(d));for(const d of Array.from(t.querySelectorAll("button,a[href]")))d.setAttribute("role","menuitem");const s=(d=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),d&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},a=(d=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const c=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),l=c.getBoundingClientRect();t.style.left=Math.max(8,Math.min(l.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(l.bottom+4,innerHeight-t.offsetHeight-8))+"px",(d?o().at(-1):o()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?a():s(!0),e.onkeydown=d=>{(d.key==="ArrowDown"||d.key==="ArrowUp")&&(d.preventDefault(),a(d.key==="ArrowUp"))},t.addEventListener("keydown",d=>{const c=d,l=o(),r=l.indexOf(document.activeElement);let f;c.key==="ArrowDown"&&(f=(r+1)%l.length),c.key==="ArrowUp"&&(f=(r+l.length-1)%l.length),c.key==="Home"&&(f=0),c.key==="End"&&(f=l.length-1),f!==void 0&&(c.preventDefault(),l[f]?.focus())}),t.addEventListener("click",d=>{const c=d.target.closest("button,a[href]");!t.hidden&&c&&!i(c)&&s(!0)},!0),document.addEventListener("keydown",d=>{!t.hidden&&d.key==="Escape"&&(d.preventDefault(),d.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",d=>{!t.hidden&&!t.contains(d.target)&&!e.contains(d.target)&&s()}),document.addEventListener("focusin",d=>{!t.hidden&&!t.contains(d.target)&&d.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const md=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),hd={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function bd(e,t,n,i){const o=e.replace(/\r\n?/g,`
`).split(`
`),s=y=>o.slice(y.line+1,i.find(j=>j.line>y.line&&j.level<=y.level)?.line??o.length).join(`
`).trim(),a=new Map(i.filter(y=>y.level===3&&t.some(j=>j.title===y.title)).map(y=>[y.title,y])),d=y=>{const j=t.find(I=>I.title===y.title);return j?"legacy-check:"+j.id:y.level===1?"legacy-check-document":"legacy-heading:"+y.line},c=new Map,l=(y,j)=>{c.has(y)?c.get(y)!==j&&c.set(y,void 0):c.set(y,j)};for(const y of i){const j=d(y);l(md(y.title),j);const I=t.find(E=>E.title===y.title);I&&l(I.id.toLowerCase(),j)}for(const[y,j]of o.entries()){const I=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(j);if(I){const E=i.find(T=>T.line>y);E&&l(I[1].toLowerCase(),d(E))}}const r=y=>{y=y.replace(/<a\s+id=[^>]+><\/a>/g,"");const j=[];let I=0;for(const E of y.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){E.index>I&&j.push({kind:"markdown",value:y.slice(I,E.index)});let T=E[2].slice(1);try{T=decodeURIComponent(T)}catch{}const N=E[2].startsWith("#")?c.get(T.toLowerCase()):void 0;j.push(N?{kind:"reference",targetId:N,label:E[1]}:{kind:"link",uri:E[2],label:E[1]}),I=E.index+E[0].length}return I<y.length&&j.push({kind:"markdown",value:y.slice(I)}),j},f=[],u=[],b=[],g=new Map;for(const y of i.filter(j=>j.level===2)){if(y.title==="業務一覧")continue;const j=d(y),I=i.find(E=>E.line>y.line)?.line??o.length;f.push({id:j,activityId:Object.hasOwn(n,y.title)?y.title:null,title:y.title,preamble:r(o.slice(y.line+1,I).join(`
`).trim())}),g.set(y.title,j)}const m="legacy-unassigned",p=y=>{const j=i.filter(I=>I.line<y.line&&I.level===2).at(-1);return j?g.get(j.title):void 0},k=t.map(y=>{const j=a.get(y.title),I=p(j)??m,E=Object.create(null),T=[];let N={name:"補足",value:""},S="";for(const D of y.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const M=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(D);M&&(S?M[1][0]===S[0]&&M[1].length>=S.length&&!M[2].trim()&&(S=""):S=M[1]);const V=S?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(D);V?(N.value.trim()&&T.push(N),N={name:V[1],value:V[2]}):N.value+=`
`+D}N.value.trim()&&T.push(N);let L="";for(const D of T)if(D.name==="人間レビュー状態"){L=D.value.split(`
`)[0].trim();const M=D.value.split(`
`).slice(1).join(`
`).trim();M&&(E.補足=[...E.補足??[],...r(M)])}else{const M=hd[D.name]??D.name;E[M]=[...E[M]??[],...r(D.value.trim())]}return{id:"legacy-check:"+y.id,checkId:y.id,title:y.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:L,sectionId:I,detailSummary:[...y.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(D=>D[1]).join(`
`),fields:E}});k.some(y=>y.sectionId===m)&&f.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const y of i.filter(j=>j.level===3&&!a.has(j.title))){const j=p(y);j?u.push({id:d(y),sectionId:j,title:y.title,blocks:[{kind:"prose",content:r(s(y))}]}):b.push({id:d(y),title:y.title,content:r(s(y))})}const A=i.find(y=>y.level===2)?.line??o.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:i.find(y=>y.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(o.slice(/^# /.test(o[0])?1:0,A).join(`
`)),sections:f,items:k,index:Object.entries(n).map(([y,j])=>{const I=o.find(E=>E.startsWith("|")&&E.includes("["+y+"]"))?.split("|").slice(1,-1)??[];return{activityId:y,purpose:I[1]?.trim()??"",connections:I[2]?.trim()??"",checkIds:j.map(E=>"legacy-check:"+E)}}),guarantees:u,examples:[],notes:b}}function so(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[i,o,...s]=n;if(!i||!o)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[a,...d]=s;return!a||!d.length||!["main","master"].includes(a)&&!/^[a-f0-9]{40}$/i.test(a)?void 0:{document:`${i.toLowerCase()}/${o.toLowerCase()}/${d.join("/")}`,ref:a}}catch{return}}function ko(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function gd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),i=[];let o="";if(n.forEach((f,u)=>{const b=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(b){o?b[1][0]===o[0]&&b[1].length>=o.length&&!b[2].trim()&&(o=""):o=b[1];return}if(!o){t.add(u);const g=/^(#{1,6}) (.+)$/.exec(f);g&&i.push({line:u,level:g[1].length,title:g[2]})}}),o)throw Error("Check Markdownのコードブロックが閉じていません。");const s=i.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const a=new Set,d=s.map(f=>{const u=i.find(m=>m.line>f.line&&m.level<=3)?.line??n.length,b=f.title.split(/\s/)[0];if(a.has(b))throw Error("Check IDが重複しています: "+b);a.add(b);const g=n.slice(f.line+1,u).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(g))throw Error(b+" の"+m+"が見つかりません。");return{id:b,title:f.title,body:g,activities:[]}}),c=Object.create(null);let l=!1;for(const[f,u]of n.entries()){if(!t.has(f)||(/^## /.test(u)&&(l=/^## 業務一覧\s*$/.test(u)),!l||!/^\|/.test(u)))continue;const b=u.split("|").slice(1,-1);if(b.length!==4)continue;const g=ko(b[0])[0]?.label;if(!g)continue;if(Object.hasOwn(c,g))throw Error("業務一覧のActivityが重複しています: "+g);const m=ko(b[3]);if(m.some(k=>k.url.toLowerCase()!=="#"+k.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const p=m.map(k=>k.label);if(!p.length||p.some(k=>!a.has(k)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);c[g]=[...new Set(p)];for(const k of d)p.includes(k.id)&&k.activities.push(g)}if(!Object.keys(c).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=i.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:d,index:c,model:bd(e,d,c,i)}}function Gn(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Kn(e,t){const n=new Set(t.design.graph.nodes.filter(l=>l.type==="business").map(l=>l.name)),i=Object.keys(e.index).filter(l=>!n.has(l)),o=Object.keys(e.index).filter(l=>n.has(l)),s=(l,r)=>({state:l,reason:r,unknown:i});if(!o.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const a=e.intro.split(`
`).filter(l=>/原典|^[-*] Source[：:]|Business Design/i.test(l)).join(`
`),d=ko(a).map(l=>so(l.url)).filter(l=>l!==void 0),c=t.source?.kind==="url"?so(t.source.url):t.source?.kind==="sample"?so("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return c&&d.length&&d.some(l=>l.document!==c.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):i.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+i.join("、")):!c||!d.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||d.some(l=>l.ref!==c.ref)||!/^[a-f0-9]{40}$/i.test(c.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Ps=new WeakMap;function Cn(e){let t=Ps.get(e);return t||(t=gd(e.markdown),Ps.set(e,t)),t}const ro=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function li(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function yd(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function vd(e){if(!e.checks)return[];const t=Cn(e.checks),n=Kn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===Gn(e)?[t.model]:[]}function wd(e,t,n){const i=document.createElement("section");i.className="check-controls",i.setAttribute("aria-label","関連Check");const o=document.createElement("section");if(o.className="check-notices",t.busy&&li(o,"関連Checkを読み込み・保存しています…"),t.error){const d=document.createElement("p");d.className="check-warning",d.setAttribute("role","alert"),d.textContent=t.error,o.append(d)}let s,a=!1;if(e.checks){s=Cn(e.checks);const d=Kn(s,e);if(a=d.state==="matched"||d.state==="unverified"&&e.checks.confirmedFor===Gn(e),!a&&(li(o,"現在のBDとの対応を再確認してください。"+d.reason),d.state==="unverified")){const c=ro("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));c.disabled=n.disabled||t.busy===!0,o.append(c)}}if(t.candidate){const d=t.candidate,c=Cn(d),l=Kn(c,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",li(r,"一致未確認: "+d.name+" — "+l.reason),li(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),u=document.createElement("summary");u.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(u,yd(c.markdown)),r.append(f);const b=ro("対応を確認して表示する",()=>n.confirm(d));b.id="check-confirm",b.disabled=l.state==="mismatch"||n.disabled||t.busy===!0;const g=ro("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(b,g),o.append(r)}return o.childNodes.length&&i.append(o),i}function kd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),i=e.querySelector("#document-actions-toggle"),o=Array.from(n.querySelectorAll("button"));for(const r of o){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const a=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",i.setAttribute("aria-expanded","false"),r&&!i.hidden&&i.focus({preventScroll:!0})},d=()=>o.filter(r=>!r.hidden&&!r.disabled),c=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const b=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+b,m=o.some(p=>!p.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",i.hidden=!m,(!m||r!==e.dataset.actionsMode)&&(a(),m&&n.contains(f)?i.focus({preventScroll:!0}):!m&&f===i&&d()[0]?.focus({preventScroll:!0}))},l=(r=!1)=>{if(i.hidden)return;s=!0,e.dataset.actionsOpen="true",i.setAttribute("aria-expanded","true");const f=d();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return i.onclick=()=>s?a(!0):l(),i.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),l(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=d(),u=f.indexOf(document.activeElement);let b;r.key==="ArrowDown"&&(b=(u+1)%f.length),r.key==="ArrowUp"&&(b=(u+f.length-1)%f.length),r.key==="Home"&&(b=0),r.key==="End"&&(b=f.length-1),b!==void 0&&(r.preventDefault(),f[b]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),a(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!i.contains(r.target)&&a()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==i&&a()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&a(!0)},!0),a(),c(),window.addEventListener("resize",c),typeof ResizeObserver<"u"&&new ResizeObserver(c).observe(e),new MutationObserver(c).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(c),document.fonts?.addEventListener("loadingdone",c),{update:c,close:a}}function Id(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),i=()=>{e.classList.remove("header-icons-only");const o=getComputedStyle(e),s=parseFloat(o.columnGap)||0,a=parseFloat(o.paddingLeft)+parseFloat(o.paddingRight),d=n.reduce((l,r)=>l+r.getBoundingClientRect().width,0)+s*n.length+a,c=d+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",c>e.clientWidth),e.classList.toggle("header-icons-only",d>e.clientWidth)};if(i(),window.addEventListener("resize",i),typeof ResizeObserver<"u"){const o=new ResizeObserver(i);[e,t,...n].forEach(s=>o.observe(s))}document.fonts?.ready.then(i),document.fonts?.addEventListener("loadingdone",i)}const zn="http://www.w3.org/2000/svg",Sd="http://www.w3.org/1999/xhtml",ui=24,Ts=8192,xd=16e6,Ad=8e6,Ed=4e3,Od=1e6,Io="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Cd(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,i=-1/0,o=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),i=Math.max(i,r.x+r.width),o=Math.max(o,r.y+r.height);const s=Math.floor(t)-ui,a=Math.floor(n)-ui,d=Math.ceil(i)-s+ui,c=Math.ceil(o)-a+ui,l=Math.min(2,Ts/d,Ts/c,Math.sqrt(xd/(d*c)));if(l<1)throw Error(Io);return{bounds:{x:s,y:a,width:d,height:c},width:Math.floor(d*l),height:Math.floor(c*l),scale:l}}const jd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function qs(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],i=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((o,s)=>{const a=i[s],d=getComputedStyle(o);a.removeAttribute("style");for(const c of jd){const l=d.getPropertyValue(c);l&&!/url\s*\(/i.test(l)&&a.style.setProperty(c,l)}for(const c of Array.from(a.attributes))(c.name.startsWith("data-")||c.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(c.name))&&a.removeAttribute(c.name)}),t}function Md(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Ed||(e.textContent?.length??0)+(t.textContent?.length??0)>Od)throw Error(Io);const i=Array.from(e.querySelectorAll(":scope > .node")),o=i.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of i)for(const p of Array.from(m.querySelectorAll(".finding-badges")))o.push({x:parseFloat(m.style.left)+m.clientLeft+p.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+p.offsetTop,width:p.offsetWidth,height:p.offsetHeight});if(!i.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,a=Array.from(t.children).map(qs),d=a.filter(m=>m.matches(".edge,.edge-label"));if(d.length){const m=s.createElementNS(zn,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...d),s.body.append(m);try{for(const p of d){const k=p.getBBox();o.push({x:k.x-12,y:k.y-12,width:k.width+24,height:k.height+24})}}finally{m.remove()}}const c=Cd(o),l=s.createElementNS(zn,"svg");l.setAttribute("width",String(c.width)),l.setAttribute("height",String(c.height)),l.setAttribute("viewBox",`0 0 ${c.bounds.width} ${c.bounds.height}`);const r=s.createElementNS(zn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),l.append(r);const f=s.createElementNS(zn,"g");f.setAttribute("transform",`translate(${-c.bounds.x} ${-c.bounds.y})`);for(const m of a)f.append(m);l.append(f);const u=s.createElementNS(zn,"foreignObject");u.setAttribute("width",String(c.bounds.width)),u.setAttribute("height",String(c.bounds.height));const b=s.createElementNS(Sd,"div");b.style.cssText=`position:relative;width:${c.bounds.width}px;height:${c.bounds.height}px;`;for(const m of i){const p=qs(m);p.querySelector(".activity-open,.object-open")?.remove(),p.style.left=parseFloat(m.style.left)-c.bounds.x+"px",p.style.top=parseFloat(m.style.top)-c.bounds.y+"px",b.append(p)}u.append(b),l.append(u);const g=new XMLSerializer().serializeToString(l);if(new TextEncoder().encode(g).length>Ad)throw Error(Io);return{svg:g,...c}}function Ld(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function Ar(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((o,s)=>{const a=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(a),o()},n.onerror=()=>{clearTimeout(a),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const i=t.getContext("2d");if(!i)throw Error("画像用のメモリを確保できませんでした。");return i.drawImage(n,0,0,e.width,e.height),await new Promise((o,s)=>{const a=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(d=>{clearTimeout(a),d?o(d):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(d){clearTimeout(a),s(d)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function Rd(e,t){const n=await Ar(e),i=URL.createObjectURL(n),o=document.createElement("a");try{o.href=i,o.download=Ld(t),o.hidden=!0,document.body.append(o),o.click()}finally{o.remove(),window.setTimeout(()=>URL.revokeObjectURL(i),1500)}}async function Nd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=Ar(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function Er(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,i)=>({id:Dd(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function Dd(e,t,n){const i=JSON.stringify([e,t,n]);let o=2166136261,s=2246822507;for(const a of i)o=Math.imul(o^a.codePointAt(0),16777619)>>>0,s=Math.imul(s^a.codePointAt(0),3266489909)>>>0;return"exception-"+o.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function Or(e,t,n){if(n==null||n==="-")return null;const i=e.exceptions.filter(o=>o.activityId===t&&o.name===n);return U(i.length===1,"Unknown or ambiguous State exception name: "+n),i[0].id}function Pd(e){U(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),xn(e),vo(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(i=>i.kind==="businessDesign")){n.exceptions=Er(n),n.roles??=[],n.schemaVersion="0.3";for(const i of n.activities)Object.hasOwn(i,"roleId")||(i.roleId=null,t.diagnostics.push("Role未確定: "+i.id+" — "+i.who))}for(const n of t.documents.filter(i=>i.kind==="stateTransition")){const i=t.documents.find(o=>o.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const o of n.transitions)o.exceptionId=Or(i,o.activityId,o.exception),delete o.exception,o.path==="exception"&&o.exceptionId===null&&t.diagnostics.push("例外参照未決: "+o.id)}return vo(t),t}const de=(e,t)=>{if(!e)throw new Error(t)},Un=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ao=e=>!!e&&typeof e=="object"&&!Array.isArray(e),fi=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),Cr=e=>Un(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Td(e){de(ao(e),"Graph must be an object");const t=e;de(fi(t,["version","nodes","relations"])||fi(t,["version","nodes","relations","scope"]),"Invalid graph fields"),de(t.version===1,"Unsupported graph version"),"scope"in t&&de(Un(t.scope),"Invalid scope"),de(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),de(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){de(ao(s),"Node must be an object");const a=s;de(a.type==="business"||a.type==="object","Invalid node type");const d=a.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];a.type==="business"&&("problem"in a||"pain_level"in a)&&(d.push("problem","pain_level"),de(["Low","Medium","High"].includes(String(a.pain_level)),"Invalid Pain level")),de(fi(a,d),"Invalid node fields"),de(Object.entries(a).every(([l,r])=>l==="scope"||l==="information"||Un(r)),"Empty node text"),de(typeof a.scope=="boolean","Invalid node scope"),de(Cr(a.name)&&a.id===a.name,"Node ID must equal visible name"),de(!n.has(a.id),"Duplicate node ID"),a.type==="object"&&(de(typeof a.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.icon),"Invalid Lucide icon"),de(Array.isArray(a.information)&&a.information.every(Un),"Invalid information")),n.set(a.id,a.type)}de([...n.values()].includes("business"),"Activity required");const i={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},o=new Set;for(const s of t.relations){de(ao(s),"Relation must be an object");const a=s;de(fi(a,["kind","from","to","label"])&&Object.values(a).every(Un),"Invalid relation fields");const d=i[a.kind];de(Array.isArray(d)&&n.has(a.from)&&n.has(a.to)&&n.get(a.from)===d[0]&&n.get(a.to)===d[1],"Invalid relation endpoints");const c=JSON.stringify([a.kind,a.from,a.to,a.label]);de(!o.has(c),"Duplicate relation"),o.add(c)}}function Jt(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function $n(e){const t=[];let n="";return Jt(e).forEach((i,o)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(i);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(i)&&t.push([o,i])}),de(!n,"Unclosed code fence"),t}function So(e,t,n,i=[]){const o=Jt(e),s=$n(e),a=Object.create(null);return de(s.length&&!o.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([d,c],l)=>{de(t.includes(c)&&!(c in a),n+": unsupported/duplicate "+c),a[c]=o.slice(d+1,s[l+1]?.[0]??o.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),de(a[c]||i.includes(c),n+": empty "+c)}),de(s.map(d=>d[1]).join("|")===t.join("|"),n+": invalid field order"),a}const Ws=(e,t)=>{const n=Array.from(e),i=Array.from(t);for(let o=0;o<Math.min(n.length,i.length);o++){const s=n[o].codePointAt(0)-i[o].codePointAt(0);if(s)return s}return n.length-i.length};function qd(e){const t=Jt(e),n=$n(e).filter(([,o])=>o.startsWith("## ")),i=new Set;return de(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([o,s],a)=>{const d=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);de(d,"Invalid Finding ID");const c=d[1];de(!i.has(c),"Duplicate Finding ID"),i.add(c);const l=So(t.slice(o+1,n[a+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+c);de(["question","correction"].includes(l["### Kind"]),"Invalid Finding Kind"),de(["open","resolved"].includes(l["### Status"]),"Invalid Finding Status"),de(["items","document","unassigned"].includes(l["### Scope"]),"Invalid Finding Scope");const r=l["### Targets"]==="(none)"?[]:Jt(l["### Targets"]).filter(f=>f.trim()).map(f=>(de(f.startsWith("- ")&&Cr(f.slice(2)),"Invalid Finding target"),f.slice(2)));return de(new Set(r).size===r.length,"Duplicate Finding target"),de(l["### Scope"]==="items"?r.length>0:l["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:c,kind:l["### Kind"],status:l["### Status"],scope:l["### Scope"],targets:r,summary:l["### Summary"],content:l["### Content"],unresolvedTargets:[]}})}function Wd(e,t){de(!e.includes("<!--"),"HTML comments are unsupported");const n=Jt(e),i=$n(e).filter(u=>u[1].startsWith("# ")),o=/^# (Activity|Object) (\S.*)$/;de(i.length&&!o.test(i[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(i[0][1]),"Document title required"),t?.document?.(i[0][1].slice(2),n.slice(i[0][0]+1,i[1]?.[0]??n.length).join(`
`).trim());let s=[];const a={version:1,nodes:[],relations:[]},d=Object.create(null),c=new Set;i.slice(1).forEach(([u,b],g)=>{const m=i[g+2]?.[0]??n.length,p=n.slice(u+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(de(p,"Empty section "+b),b==="# Findings"){de(!c.has(b),"Duplicate Findings"),c.add(b),s=qd(p);return}if(["# Scope","# Graph exceptions"].includes(b)){de(!c.has(b),"Duplicate "+b),c.add(b),b==="# Scope"?(de(!$n(p).length,"Scope must be prose"),a.scope=p):Jt(p).filter(N=>N.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(N=>{const S=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(N);de(S,"Invalid exception"),a.relations.push({kind:S[1],from:S[2],to:S[3],label:S[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const k=o.exec(b);de(k,"Unsupported heading "+b);const A=k[1],y=k[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");d[y]=n.slice(u,m).join(`
`);const j=N=>$n(p).some(S=>S[1]===N);if(A==="Object"){const N=["## Scope","## Icon"];j("## Information")&&N.push("## Information");const S=So(p,N,y);de(["true","false"].includes(S["## Scope"]),"Invalid Scope");const L=Jt(S["## Information"]??"").filter(D=>D.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(D=>(de(/^- \S.*$/.test(D),"Invalid Information"),D.slice(2)));a.nodes.push({id:y,type:"object",name:y,scope:S["## Scope"]==="true",icon:S["## Icon"]==="(generic icon)"?"box":S["## Icon"],information:L});return}const I=["## Scope","## Why","## When"];j("## Exception When")&&I.push("## Exception When"),I.push("## Who","## Where","## How","### Input","### Procedure"),j("### Exception")&&I.push("### Exception"),I.push("### Output","## Result"),(j("## Problem")||j("## Pain level"))&&I.push("## Problem","## Pain level");const E=So(p,I,y,["## How"]);de(!E["## How"],"How must only contain fields"),de(["true","false"].includes(E["## Scope"]),"Invalid Scope"),t?.activity?.(y,E);const T={id:y,type:"business",name:y,scope:E["## Scope"]==="true",why:E["## Why"],when:E["## When"],who:E["## Who"],where:E["## Where"],result:E["## Result"]};"## Problem"in E&&(T.problem=E["## Problem"],T.pain_level=E["## Pain level"]),a.nodes.push(T);for(const[N,S]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(N in E)||S!=="business-exception"&&E[N]==="(none)"||Jt(E[N]).filter(L=>L.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(L=>{const D=/^- (.+?) — (\S.*)$/.exec(L);de(D,"Invalid relation in "+y),a.relations.push({kind:S,from:S==="output"?y:D[1],to:S==="output"?D[1]:y,label:D[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const l=a.nodes.filter(u=>u.type==="business").map(u=>u.id);Td(a),a.nodes.sort((u,b)=>Ws(u.id,b.id)),a.relations.sort((u,b)=>{for(const g of["kind","from","to","label"]){const m=Ws(u[g],b[g]);if(m)return m}return 0});const r=new Set(a.nodes.map(u=>u.id));for(const u of s)u.unresolvedTargets=u.targets.filter(b=>!r.has(b));return{graph:a,sections:d,markdown:e,activityOrder:l,findings:s}}const zd=["id","from","activity","condition","to","effect","path","evidence","note"],Ge=(e,t)=>{if(!e)throw Error(t)},pi=e=>typeof e=="string"&&!!e.trim();function Ud(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Ge(n,"state-meta と遷移表が必要です");const i=pr(n[1]);Ge(i&&typeof i=="object"&&!Array.isArray(i),"メタ情報が不正です"),Ge(Object.keys(i).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Ge(i.object===t,"対象Objectが一致しません"),Ge(Array.isArray(i.states)&&i.states.length>0&&i.states.every(l=>pi(l)&&!l.startsWith("@"))&&new Set(i.states).size===i.states.length,"状態一覧が不正です"),Ge(i.start==="@new"&&i.terminal==="@unknown"&&i.completeness==="partial"&&pi(i.source),"開始・終端・部分定義の宣言が不正です");const o=n[2].trim().split(/\r?\n/),s=l=>(Ge(l.startsWith("|")&&l.endsWith("|"),"表の行が不正です"),l.slice(1,-1).split("|").map(r=>r.trim())),a=s(o[0]);Ge([zd,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(l=>a.join("|")===l.join("|")),"表の列名が不正です"),Ge(s(o[1]).length===a.length&&s(o[1]).every(l=>/^-+$/.test(l)),"表の区切りが不正です"),Ge(o.length<=1002,"遷移は1000行以内にしてください");const d=new Set,c=o.slice(2).map(l=>{const r=s(l);Ge(r.length===a.length&&r.every(pi),"表の列数・空欄が不正です");const f=Object.fromEntries(a.map((u,b)=>[u,r[b]]));return Ge(/^T[0-9]+$/.test(f.id)&&!d.has(f.id),"遷移IDが不正または重複しています"),d.add(f.id),Ge([...i.states,"@new"].includes(f.from)&&[...i.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),Ge(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),a.includes("exception")&&Ge(f.path==="normal"?f.exception==="-":pi(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),Ge(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),Ge(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),Ge(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),Ge(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...i,transitions:c}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const zs=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function $d(e){const t=[];let n=null;const i=e.split(/\r?\n/),o=[];let s="";for(let a=0;a<i.length;a++){const d=i[a];if(!s&&/^# Object /.test(d)?n=d.slice(9):!s&&/^# /.test(d)&&(n=null),!s&&d==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const c=[];let l="";for(a++;a<i.length;a++){const f=i[a];if(!l&&/^#{1,2} /.test(f)){a--;break}c.push(f),l=zs(f,l)}const r=Ud(c.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}o.push(d),s=zs(d,s)}if(new Set(t.map(a=>a.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:o.join(`
`),declarations:t}}function Fd(e){const t=/^## State Transitions$/m.test(e)?$d(e):{markdown:e,declarations:[]};let n="",i="";const o=new Map,s=Wd(t.markdown,{activity:(c,l)=>o.set(c,l),document:(c,l)=>{n=c,i=l}}),a={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:i,scope:s.graph.scope??"",objects:s.graph.nodes.filter(c=>c.type==="object").map(c=>({id:c.id,name:c.name,scope:c.scope,icon:String(c.icon),information:c.information})),activities:(s.activityOrder??[]).map(c=>{const l=s.graph.nodes.find(f=>f.id===c),r=o.get(c);return{id:c,name:l.name,scope:l.scope,why:String(l.why),when:String(l.when),who:String(l.who),where:String(l.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(l.result),problem:l.problem===void 0?null:String(l.problem),painLevel:l.pain_level===void 0?null:String(l.pain_level)}}),relations:s.graph.relations.map((c,l)=>({id:"legacy-relation-"+l,kind:c.kind,fromId:c.from,toId:c.to,label:c.label})),findings:(s.findings??[]).map(c=>({...c,sourceId:c.id,targetIds:c.targets.filter(l=>s.graph.nodes.some(r=>r.id===l))}))};a.exceptions=Er(a);const d=t.declarations.map((c,l)=>({id:"legacy-state-"+l,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:a.id,revision:a.revision,verification:"unverified"},objectId:c.object,states:c.states.map(r=>({id:r,name:r})),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:Or(a,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:a,checks:[],states:d,diagnostics:[]}}}function Vd({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const n=mr({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(n.diagnostics)]};const i=e.business,o=[...i.objects,...i.activities],s=c=>i.roles?.find(l=>l.id===c.roleId)?.name??c.who,a=[...i.objects.map(c=>({...c,type:"object"})),...i.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:s(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],d=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===i.id).map(c=>{const l=new Map(c.states.map(f=>[f.id,f.name])),r={object:o.find(f=>f.id===c.objectId).name,states:c.states.map(f=>f.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(f=>({id:f.sourceId,from:l.get(f.fromId)??f.fromId,to:l.get(f.toId)??f.toId,activity:f.activityId,...f.event?{event:f.event}:{},...f.exceptionId?{exceptionId:f.exceptionId,exception:i.exceptions?.find(u=>u.id===f.exceptionId)?.name}:{},condition:f.condition,...f.conditionLabel?{conditionLabel:f.conditionLabel}:{},effect:f.effect,path:f.path,evidence:f.evidence,note:f.note}))};return[c.objectId,{model:r}]})));return{graph:gr({version:1,...i.scope?{scope:i.scope}:{},nodes:a,relations:i.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(a.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:i.activities.map(c=>c.id),objectStateTransitions:d,findings:i.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(l=>o.find(r=>r.id===l)?.name??l)}))}}const jr=8*1024*1024;function Mr(e){return/^\s*[\[{]/.test(e)}function Lr(e){const t=[e];let n=0;for(;t.length;){const i=t.pop();if(i&&typeof i=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const o of Object.values(i))o&&typeof o=="object"&&t.push(o)}}for(const i of Array.isArray(e?.documents)?e.documents:[])if(i&&typeof i=="object"&&i.kind==="businessDesign"&&((i.objects?.length??0)+(i.activities?.length??0)>2e3||(i.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Us(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");Lr(e);const n=vo(e),i=e.documents.filter(s=>s.kind==="businessDesign");if(i.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const o=i[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:o,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Bd(e){if(!Mr(e))return Fd(e);if(new TextEncoder().encode(e).byteLength>jr)throw Error("ローカルJSONは8MiB以内にしてください。");const t=pr(e.replace(/^\uFEFF/,""));if(Lr(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=Us(Pd(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const i=n.data.business;i.schemaVersion="0.1",delete i.roles;for(const o of i.activities)delete o.roleId;n.data.diagnostics=n.data.diagnostics.filter(o=>!o.startsWith("Role未確定:"))}return n}return Us(t,e)}function bn(e){return Vd(Bd(e))}async function Hd(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>jr)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Mr(n))throw Error("JSONファイルの本文を確認してください。");return bn(n)}const Gd=(e,t)=>Bo(e,t,!1);async function Bo(e,t,n=!0){let i;try{i=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(i.protocol!=="https:"||i.username||i.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const o=new AbortController,s=()=>o.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const a=setTimeout(s,3e4);try{const d=await fetch(i.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:o.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!d.ok)throw Error("URL取得に失敗しました（HTTP "+d.status+"）。");const c=d.headers.get("content-type")?.toLowerCase()??"";if(c.includes("html")||!n&&c.includes("json")||c.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const l=2*1024*1024;if(Number(d.headers.get("content-length"))>l)throw Error("本文は2MiB以内にしてください。");const r=d.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,u="";const b=new TextDecoder;try{for(;;){const{done:g,value:m}=await r.read();if(g)break;if(f+=m.length,f>l){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}u+=b.decode(m,{stream:!0})}u+=b.decode()}finally{r.releaseLock()}if(n&&c.includes("json")&&!/^\s*[\[{]/.test(u))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(u))throw Error("HTMLページは読み込めません。");return u}catch(d){const c=o.signal.aborted;throw s(),c?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):d instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):d}finally{clearTimeout(a),t?.removeEventListener("abort",s)}}const Si=Hd;async function Ni(e,t){return bn(await Bo(e,t))}function Kd(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return bn(e)}const Di=e=>e==="question"?"要確認":"要修正";function _d(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const i of["question","correction"]){const o=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===i&&s.targets.includes(t.id)).length;o&&n.push(`${Di(i)} ${o}`)}return n}function Jd(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Di(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const i=document.createElement("p");i.className="finding-summary",i.textContent=e.summary;const o=document.createElement("p");if(o.className="finding-target",o.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,i,o),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(Wt(e.content)),t}function Xd(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Zd(e,t,n){const i=document.createElement("nav");i.className="drawer-findings",i.setAttribute("aria-label","関連する指摘");for(const o of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=o.id,s.textContent=`${Di(o.kind)} · ${o.displayId??o.id}　${o.summary}`,s.onclick=()=>n({type:"finding",id:o.id}),i.append(s)}return i}function Yd(e,t,n,i,o){const s=document.createElement("section");s.className="findings-index";const a=document.createElement("label");a.className="finding-filter";const d=document.createElement("input");d.type="checkbox",d.checked=t,d.onchange=()=>n(d.checked),a.append(d,document.createTextNode("解消済みも表示")),s.append(a);const c=(r,f,u)=>{const b=document.createElement("button");b.className="node-navigate finding-index-row",b.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const m=document.createElement("span");return m.textContent=u,b.append(g,m),b.onclick=()=>i(r),b},l=e.graph.nodes.filter(r=>(!o||r.id===o)&&typeof r.problem=="string");if(l.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of l)s.append(c({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const u=(e.findings??[]).filter(g=>(!o||g.targets.includes(o))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!u.length)continue;const b=document.createElement("h3");b.textContent=`${f}（${u.length}件）`,s.append(b);for(const g of u)s.append(c({type:"finding",id:g.id},`${Di(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function Qd(e){const t=vr(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([i,o])=>e.positions[i]?.every((s,a)=>s===o[a]))&&e.zoom===1&&e.scroll.every(i=>i===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(i=>i===0))?e:{...e,positions:t,...wa(),viewInset:[40,0],canvasOrigin:void 0}}function el(e,t){const n=new Set;if(!t)return n;const i=new Set(e.filter(o=>o.kind==="output").map(o=>JSON.stringify([o.to,o.from])));return e.forEach((o,s)=>{o.kind==="input"&&i.has(JSON.stringify([o.from,o.to]))&&n.add(s)}),n}function Ho(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function tl(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Ho(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function nl(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Ho(t)),n.href}function il(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Ho(t)}const Go=`# Alderを使った設計業務 — Business Design

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
`,ol=`{
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
`;function sl(e,t){const n=new Set(t.graph.nodes.map(u=>u.id)),i=new Map;for(const u of t.graph.nodes)i.set(u.name,i.has(u.name)?void 0:u.id);const o=u=>n.has(u)?u:i.get(u),s=Object.create(null);for(const[u,b]of Object.entries(e.positions)){const g=o(u);g&&(s[g]=b)}const{scroll:a,zoom:d,viewInset:c,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:a,zoom:d,viewInset:c,canvasOrigin:l,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?o(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(u=>{const b=o(u);return b?[b]:[]}))]}}}const rl=`# Alderのチェックリストサンプル

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
`;function al(e,t,n,i,o=()=>!0,s=()=>{}){const a=e.ownerDocument,d=a.defaultView;let c,l=0,r=0,f=!1,u=null,b="";const g=new Map,m=()=>{c!==void 0&&(d.clearTimeout(c),l=Math.max(0,l-(Date.now()-r)),c=void 0)},p=(y=!1)=>{if(y&&!o())return;m(),g.delete(b);const j=[...g].at(-1);if(j){A(j[1],"error",j[0]);return}const I=e.contains(a.activeElement);e.hidden=!0,t.textContent="",s(),I&&(u?.isConnected?u:i).focus({preventScroll:!0})},k=()=>{e.hidden||e.dataset.kind==="error"||f||a.hidden||e.contains(a.activeElement)||(m(),r=Date.now(),c=d.setTimeout(p,l))};e.addEventListener("pointerenter",()=>{f=!0,m()}),e.addEventListener("pointerleave",()=>{f=!1,k()}),e.addEventListener("focusin",y=>{const j=y.relatedTarget;j&&!e.contains(j)&&(u=j),m()}),e.addEventListener("focusout",()=>d.setTimeout(k,0)),e.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),p(!0))}),a.addEventListener("visibilitychange",()=>a.hidden?m():k()),n.onclick=()=>p(!0);const A=(y,j,I)=>{m(),e.contains(a.activeElement)||(u=a.activeElement),b=I,e.dataset.kind=j,e.dataset.key=I,t.setAttribute("role",j==="error"?"alert":"status"),t.setAttribute("aria-live",j==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=y,s(),l=j==="warning"?8e3:5e3,k()};return(y,j="success",I="operation")=>{j==="error"&&y?(g.delete(I),g.set(I,y)):g.delete(I);const E=[...g].at(-1);if(E){if(!e.hidden&&t.textContent===E[1]&&b===E[0])return;A(E[1],"error",E[0]);return}if(!y){b===I&&p();return}!e.hidden&&t.textContent===y&&e.dataset.kind===j||A(y,j,I)}}const $s=ol,bt=document.querySelector("#app");bt.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ke;const w=e=>document.getElementById(e),An=wr(location.pathname);An.version&&(w("preview-badge").hidden=!1,w("preview-badge").textContent=`確認用 · ${An.version}`,w("preview-badge").title=`PR #${An.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const _n=e=>Rn(e,{"stroke-width":1.8,"aria-hidden":"true"}),Qn=document.createElement("div");Qn.id="source-menu";Qn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';bt.append(Qn);const Pi=document.createElement("div");Pi.id="checks-menu";Pi.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';bt.append(Pi);const pn=document.createElement("section");pn.id="check-followup";pn.hidden=!0;pn.setAttribute("aria-labelledby","check-followup-title");pn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(pn);const Ti=document.createElement("div");Ti.id="check-followup-menu";Ti.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';bt.append(Ti);const Ot=document.createElement("input");Ot.type="file";Ot.id="check-file";Ot.accept=".md,.markdown,text/markdown,text/plain";Ot.hidden=!0;bt.append(Ot);const Ft=document.createElement("section");Ft.id="check-url-dialog";Ft.hidden=!0;Ft.setAttribute("role","dialog");Ft.setAttribute("aria-labelledby","check-url-title");Ft.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';bt.append(Ft);const qi=document.createElement("div");qi.id="help-menu";qi.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${An.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${An.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${An.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;bt.append(qi);Ri(w("help-menu-toggle"),qi);const Fn=document.createElement("div");Fn.id="url-history";Qn.append(Fn);function cl(){if(Fn.replaceChildren(),!C.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",Fn.append(e);for(const t of C.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const i=document.createElement("small");i.textContent=t.url,n.append(i),n.title=t.url,n.disabled=oe||qe||se,n.onclick=()=>{dl(t.url)},Fn.append(n)}}async function dl(e){if(!(oe||qe||se)){if(C.document?.source?.kind==="url"&&C.document.source.url===e){ye(),Ke?.reopenBusinessOverview(),C.active=C.tabs[0].key,je(),ti();return}qe=!0,je();try{const t=await Ni(e),n=Nn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await ei(n)}catch(t){t instanceof Ln||We("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{qe=!1,je()}}}const ll=Ri(w("open-menu-toggle"),Qn),ul=Ri(w("open-checks"),Pi,()=>{const e=X();w("check-open-sample").hidden=!e||!Zo(e),w("check-close").disabled=!e?.checks}),Rr=Ri(w("check-followup-open"),Ti,()=>{w("check-followup-sample").hidden=!X()||!Zo(X())});for(const[e,t]of[["open-menu-toggle",bs],["open",bs],["open-url",ka],["open-text",Ia],["view-markdown",Sa],["open-checks",Js],["share-source",xa],["refresh",Aa],["help-menu-toggle",Ea],["drawer",Oa],["node-list-toggle",Ca],["node-list-close",Xs],["display-settings-toggle",Zs],["reset-layout",ja],["save-image",Ma],["copy-image",La],["out",er],["in",tr]])w(e).prepend(_n(t));Id(document.querySelector("header"));const xo=kd(document.querySelector(".tab-strip"));let C={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},wt=!0,Pt=!1,oe=!0,jn=!1,un=!1,qe=!1,Fs=Promise.resolve(),Xt,ge,kt=0,se=!1,Vn=!1,En=0,xi=0,On=!1,Ko=!1,Ao=!1,Vs=!1;const Eo=new Set,Tt=new Set,Ai=new Set;function Nr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of Ai){const i=[...C.document?[C.document]:[],...C.recovery].find(s=>s.key===n),o=t.find(s=>s.key===n&&s.draft===i?.draft);i&&o&&Ai.delete(n)}}const X=()=>C.tabs.find(e=>e.key===C.active),mn=e=>zt(e)?.key??e.key,Ut=e=>C.document?.key===mn(e);let Oo="";const fl=al(w("status"),w("status-text"),w("status-close"),w("viewport"));function We(e,t="success",n="operation"){if(n==="storage"){if(Oo===e)return;Oo=e}fl(e,t,n)}function _o(){We("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Jo(){We("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Mt(){oe||(kt++,Je())}function pl(e){e.preventDefault(),e.returnValue=!0}function Je(){const e=kt>En||xi>0||!1||se||Ai.size>0||Ao||On||un,t=!oe&&e;t!==Vs&&(Vs=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",pl));const n=oe?"restoring":jn?"protected":un?"conflict":On?"error":Ao||Ai.size>0?"draft":xi>0||se?"saving":kt>En?"dirty":Ko?"saved":"unchanged";bt.dataset.saveState!==n&&(bt.dataset.saveState=n),jn?_o():un?Jo():On?We("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):We("","success","storage"),zi()}function Xo(e){On=!0,Oo=""}function Wi(){if(jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(un)throw new Fo}async function ml(e){Wi();try{await td(e)}catch(t){throw t instanceof Fo&&(un=!0,clearTimeout(Xt),Xt=void 0,Jo()),t}}function Dr(e,t){xi++,Eo.add(t),Je();const n=Fs.catch(()=>{}).then(()=>ml(e)).then(()=>{En=Math.max(En,t),Ko=!0,Nr(e),En===kt&&(On=!1)},i=>{throw Xo(),i}).finally(()=>{xi--,Eo.delete(t),Je()});return Fs=n.catch(()=>{}),n}function ke(e=180,t=!0){if(oe)return;if(t&&kt++,clearTimeout(Xt),Xt=void 0,jn){_o(),Je();return}if(un){Jo(),Je();return}if(se||Eo.has(kt)||!t&&kt<=En&&!On){Je();return}const n=()=>{Xt=void 0;let i;try{i=structuredClone(Vo(C))}catch{Xo(),Je();return}Dr(i,kt).catch(()=>Je())};e===0?n():Xt=window.setTimeout(n,e),Je()}async function hl(e){if(oe||ge||se||!C.tabs.includes(e))return;if(Hn(e)===void 0){Ke?.closeBusinessOverview();return}rt.cancel(),ye();const t=C.active===e.key,n={...C,tabs:C.tabs.filter(i=>i!==e),active:t?C.tabs[0]?.key:C.active};try{await Fi(()=>n,()=>{C=n}),t&&bt.dataset.workspaceArea==="business"&&Ke?.businessActivated()}catch{Je()}}function it(){w("drawer").setAttribute("aria-label","業務内容開閉"),w("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!X(),t=e&&C.drawer,n=e&&!!C.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Pt=!1),zi(),w("layout-lock").replaceChildren(_n(wt?Ys:Qs)),w("layout-lock").setAttribute("aria-pressed",String(wt)),w("layout-lock").title=wt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",w("layout-lock").toggleAttribute("disabled",oe),w("viewport").dataset.layoutLocked=String(wt),w("prefer-write").checked=C.preferWrite===!0,w("prefer-write").disabled=oe,w("show-exceptions").checked=X()?.showExceptions!==!1,w("show-exceptions").disabled=oe||se||!X()||ge===X(),w("selected-edges-only").checked=X()?.selectedEdgesOnly===!0,w("selected-edges-only").disabled=oe||se||!X()||ge===X(),document.documentElement.dataset.theme=C.dark?"dark":"light",w("theme").replaceChildren(_n(C.dark?qa:Wa)),w("formattedMarkdownDrawer").hidden=!t,w("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(C.width,innerWidth*.65))+"px",w("drawer").setAttribute("aria-expanded",String(t)),w("drawer").toggleAttribute("disabled",oe||!e),w("node-list-drawer").hidden=!n||ot().mode!=="findings",w("node-list-toggle").setAttribute("aria-expanded",String(n)),w("node-list-toggle").toggleAttribute("disabled",oe||!e),Ke?.syncChrome()}function Co(){for(const e of["save-image","copy-image"]){const t=w(e);t.hidden=!X(),t.disabled=Vn||oe||!X()||ge===X(),t.setAttribute("aria-busy",String(Vn))}}function zi(){Co(),document.querySelector(".toolbar").dataset.settingsOpen=String(Pt),w("display-options").hidden=!Pt,w("reset-layout").disabled=oe||qe||se||!1||!X()||Tt.has(C.document?.key??"")||jn||un;const e=w("display-settings-toggle"),t=Pt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Pt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=oe||se||!X()||ge===X()}function Pr(e,t=!1){const n=X();oe||se||!n||ge===n||e===Pt||(e&&(Mn.delete(zt(n)?.key??n.key),Ui()),rt.cancel(),Te=void 0,ye(),Pt=e,zi(),jt(n),!e&&(t||w("display-options").contains(document.activeElement))&&w("display-settings-toggle").focus({preventScroll:!0}))}async function Tr(e){const t=X();if(!(Vn||oe||!t||ge===t)){Vn=!0,Co();try{const n=Md(w("nodes"),w("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Nd(n),We("グラフ全体のPNGをコピーしました。")):await Rd(n,(zt(t)?.name??t.name)+(Hn(t)?" - "+Hn(t):""))}catch(n){We((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{Vn=!1,Co()}}}w("save-image").onclick=()=>Tr(!1);w("copy-image").onclick=()=>Tr(!0);w("display-settings-toggle").onclick=()=>Pr(!Pt);w("reset-layout").onclick=()=>{const e=X();if(oe||qe||se||ge||!e||Tt.has(mn(e)))return;try{Wi()}catch{Je();return}rt.cancel(),_t.cancel(),Te=void 0,ye();const t={...e,design:Mi(e)},n=Qd(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Fr.invalidate(e),je(),n!==t&&ke()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Pt&&w("source-dialog").hidden&&(e.preventDefault(),Pr(!1,!0))});function ye(e=!0){const t=X();if(!t)return!1;const n=[w("viewport").scrollLeft,w("viewport").scrollTop],i=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,i&&e&&(Mt(),ke(180,!1)),i}function qr(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,i=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(o=>o.dataset.key===n)?.querySelector(i?".close":"button")?.focus({preventScroll:!0})}function jo(){ll.close(),ul.close(),Rr.close(),xo.close(),qr(bl),xo.update()}function bl(){const e=w("tabs");e.replaceChildren(),C.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===C.active?" active":""),n.draggable=Hn(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",ki(t)!==void 0&&(n.dataset.activity=ki(t)),Ii(t)!==void 0&&(n.dataset.object=Ii(t));const i=document.createElement("button");mo(i,"business",t.name),i.setAttribute("aria-current",String(t.key===C.active)),i.disabled=se,i.onclick=async()=>{if(se||It&&It!==t.key&&!await Bi())return;const s=ye()||C.active!==t.key;Ke?.activateBusiness(),C.active=t.key,je(),Ke?.businessActivated(),ke(180,s)};const o=ho("業務設計："+t.name+"を閉じる");o.disabled=se,o.onclick=()=>hl(t),n.append(i,o),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),se)return;const a=C.tabs.findIndex(c=>c.key===s.dataTransfer?.getData("text/plain")),d=C.tabs.indexOf(t);if(a>0&&d>0&&a!==d){const[c]=C.tabs.splice(a,1);C.tabs.splice(d,0,c),jo(),ke()}},n.onkeydown=s=>{if(!se&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const a=C.tabs.indexOf(t),d=a+(s.key==="ArrowLeft"?-1:1);a>0&&d>0&&d<C.tabs.length&&([C.tabs[a],C.tabs[d]]=[C.tabs[d],C.tabs[a]],jo(),ke())}},e.append(n)})}const Bs=new Map,Mn=new Set;function Ui(){const e=X(),t=!!e&&e.design.sourceFormat!=="json"&&Mn.has(zt(e)?.key??e.key)&&!e.checks;t||(Rr.close(),pn.contains(document.activeElement)&&w("viewport").focus({preventScroll:!0})),pn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])w(n).disabled=oe||qe||se||!1||!e||tn(e).busy===!0}w("check-followup-later").onclick=()=>{const e=X();e&&Mn.delete(zt(e)?.key??e.key),Ui()};let Mo;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])w("check-followup-"+e).onclick=()=>{Mo=w("check-followup-open"),w(t).click(),Mo=void 0};function Zo(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Go}function tn(e){const t=zt(e)?.key??e.key;let n=Bs.get(t);return n||(n={},Bs.set(t,n)),n}async function Yo(e,t){if(!Ut(e))throw Error("原本文書が切り替わりました。");const n=Qt(C,C.recovery,{...C.document,checks:t},Vo(C).views);await Fi(()=>n,()=>{C=n,t&&Mn.delete(zt(e)?.key??e.key)})}async function Wr(e,t){const n=tn(e);if(e.design.sourceFormat==="json"||n.busy||se||oe||ge===e)return;const i=Gn(e);n.busy=!0,n.error=void 0,n.candidate=void 0,$t();try{const o=await t();if(!Ut(e))return;if(i!==Gn(C.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=Cn(o),a=Kn(s,C.tabs[0]);if(a.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+a.reason);a.state==="unverified"?n.candidate=o:(await Yo(e,o),n.candidate=void 0,Ke?.openRelatedChecks(X()?.selected))}catch(o){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+o.message,We(n.error,"error")}finally{n.busy=!1,$t()}}async function zr(e,t){const n=tn(e);if(n.busy||se||!Ut(e))return;const i=Kn(Cn(t),C.tabs[0]);if(i.state==="mismatch"){n.error=i.reason,$t();return}n.busy=!0,n.error=void 0;try{await Yo(e,{...t,confirmedFor:Gn(C.tabs[0])}),n.candidate=void 0,Ke?.openRelatedChecks(X()?.selected)}catch(o){n.error="関連Checkを開けません: "+o.message}finally{n.busy=!1,$t()}}function $t(){Ui();const e=X(),t=w("detail"),n=e?tn(e):void 0,i=e?e.key+":"+(e.selected??""):"";w("open-checks").disabled=oe||se||ge===e||!e||n?.busy===!0;const o=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===i?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=i,!e)return;const a=e.design.graph.nodes.find(f=>f.id===e.selected),d=wd(e,n,{disabled:oe||se||ge===e,redraw:$t,confirm:f=>{zr(e,f)}}),c=document.createElement("div");c.className="right-drawer-heading";const l=rc(a?.name??"業務設計");if(a){const f=a.type==="business"?Ur(String(a.who),a.id):cr(a);f.classList.add("drawer-node-icon"),l.prepend(f)}c.append(l);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{w("drawer").click(),w("drawer").focus({preventScroll:!0})},c.append(r),t.append(c),d.hasChildNodes()&&t.append(d),a){const f=Zd(e.design,a.id,Qo);f.hasChildNodes()&&t.append(f)}t.append(Tc(e.design,a?.id)),a?.type==="business"&&Ke?.appendActivityTestLinks(t,a.id),t.scrollTop=s,o&&document.getElementById(o)?.focus({preventScroll:!0})}const Hs=new Map,ot=()=>{const e=C.active??"";let t=Hs.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Hs.set(e,t)),t};function Qo(e){if(!X())return;const t=ot();t.mode="findings",t.finding=e,C.nodeDrawer=!0,innerWidth<=800&&(C.drawer=!1),it(),ht(),w("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),ke()}function gl(e){const t=X();if(!t)return;const n=ot();n.mode="findings",n.filterNode=e,n.finding=void 0;const i=(t.design.findings??[]).filter(o=>o.status==="open"&&o.targets.includes(e)).map(o=>({type:"finding",id:o.id}));if(t.design.graph.nodes.some(o=>o.id===e&&typeof o.problem=="string")&&i.unshift({type:"problem",id:e}),i.length===1){Qo(i[0]);return}C.nodeDrawer=!0,innerWidth<=800&&(C.drawer=!1),it(),ht(),w("drawer-mode-findings").focus({preventScroll:!0}),ke()}function yl(e,t){const n=ot().finding;if(!n)return!1;const i=n.type==="finding"?e.design.findings?.find(d=>d.id===n.id):void 0,o=n.type==="problem"?e.design.graph.nodes.find(d=>d.id===n.id&&typeof d.problem=="string"):void 0;if(!i&&!o)return ot().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{ot().finding=void 0,ht(),w("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),i)t.append(Jd(i));else{const d=document.createElement("h2");d.textContent=`困りごと · ${o.name}（${String(o.pain_level)}）`,t.append(d,Wt(String(o.problem)))}const a=i?.targets??[o.id];if(a.length){const d=document.createElement("section"),c=document.createElement("h3");c.textContent="関連項目へ移動",d.append(c);for(const l of a){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=l;const f=e.design.graph.nodes.some(b=>b.id===l),u=e.hiddenNodes?.includes(l);r.disabled=!f||!!u,r.textContent=(e.design.graph.nodes.find(b=>b.id===l)?.name??l)+(f?u?"（非表示）":"":"（参照先なし）"),r.onclick=()=>bi(l,!0),d.append(r)}t.append(d)}return!0}function Ur(e,t){let n=0;for(const o of e)n=n*31+o.codePointAt(0)>>>0;const i=document.createElement("span");return i.className="who-badge",i.style.setProperty("--role-color",(t&&X()?.design.model?.business.roles?zo(X().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),i.setAttribute("aria-hidden","true"),i.append(_n(or)),i}function $i(e,t=!0){oe||!X()||(rt.cancel(),ye(),C.nodeDrawer=e,e&&ot().mode==="findings"&&innerWidth<=800&&(C.drawer=!1),it(),e&&X()?.selected&&Dn(X().selected),ht(),t&&w(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),ke())}function Dn(e){const t=X(),n=t?.design.graph.nodes.find(o=>o.id===e);if(!n)return;const i=ot();(i.category!=="role"||n.type!=="business")&&(i.category=n.type==="business"?"activity":"object"),i.collapsed.delete(sc(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(i.search.toLocaleLowerCase())||(i.search=""),requestAnimationFrame(()=>{Array.from(w("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function vl(e,t){const n=X();if(!n||oe||se||ge===n)return;rt.cancel(),Te=void 0,ye();const i=new Set(n.hiddenNodes??[]);for(const o of e)t?i.delete(o):i.add(o);n.hiddenNodes=[...i],nn(),ke()}function bi(e,t=!1){let n=X();if(n&&!Mi(n).graph.nodes.some(f=>f.id===e)&&(ye(),Ke?.reopenBusinessOverview(),C.active=C.tabs[0].key,n=X(),je()),!n||n.hiddenNodes?.includes(e)||ge===n)return;t||(ot().finding=void 0);const i=w("node-list").contains(document.activeElement);rt.cancel(),Te=void 0,ye(),n.selected=e,Dn(e),it(),nn();const o=w("viewport"),s=o.getBoundingClientRect(),a=w("formattedMarkdownDrawer").getBoundingClientRect(),d=C.drawer&&a.left>s.left&&a.left<s.right?a.left:s.right,c=Math.max(1,Math.min(o.clientWidth,d-s.left-o.clientLeft)),l=o.clientHeight;n.viewInset=[o.clientWidth/(2*n.zoom),o.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-c/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-l/2],jt(n),o.scrollLeft=n.scroll[0],o.scrollTop=n.scroll[1],ye(),i){const f=t?"[data-finding-target]":"[data-list-node]",u=Array.from(w("node-list").querySelectorAll(f)).find(b=>(t?b.dataset.findingTarget:b.dataset.listNode)===e);(t?u:u?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}ke()}function ht(){const e=X(),t=ot(),n=w("node-list"),i=n.scrollTop,o=document.activeElement;o?.closest("[data-list-node]")?.dataset.listNode,o?.hasAttribute("data-node-visibility"),o?.dataset.role;const s=w("drawer-modes");s.replaceChildren();for(const g of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===g?0:-1,m.textContent=`指摘（${e?Xd(e.design):0}）`;const p=()=>{t.mode=g,ht(),w("drawer-mode-"+g).focus({preventScroll:!0})};m.onclick=p,m.onkeydown=k=>{["ArrowLeft","ArrowRight","Home","End"].includes(k.key)&&(k.preventDefault(),m.focus({preventScroll:!0}))},s.append(m)}for(const g of[w("node-categories"),w("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const a=w("node-list-search");a.value=t.search,a.disabled=!e||oe;const d=w("node-categories");d.replaceChildren();for(const[g,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const p=document.createElement("button");p.dataset.category=g,p.id="node-category-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.category===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.category===g?0:-1,p.textContent=m,p.onclick=()=>{t.category=g,ht(),w("node-category-"+g).focus({preventScroll:!0})},p.onkeydown=k=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(k.key))return;k.preventDefault();const A=["activity","object","role"],y=A.indexOf(g);t.category=k.key==="Home"?"activity":k.key==="End"?"role":A[(y+(k.key==="ArrowRight"?1:2))%3],ht(),w("node-category-"+t.category).focus({preventScroll:!0})},d.append(p)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const c=new Set(e?.hiddenNodes??[]),l=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=l.filter(g=>!c.has(g.id)).length,f=w("scope-outside"),u=r===l.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",u),f.setAttribute("aria-label",u==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(_n(u==="false"?za:Ua)),f.disabled=!l.length||oe||ge===e;const b=w("show-outside");if(b.checked=u==="true",b.indeterminate=u==="mixed",b.setAttribute("aria-checked",u),b.disabled=f.disabled,w("scope-count").textContent=u==="mixed"?`${r}/${l.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(yl(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=i;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(p=>p.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,ht(),w("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,m)}n.append(Yd(e.design,t.resolved,g=>{t.resolved=g,ht(),n.querySelector("input")?.focus({preventScroll:!0})},Qo,t.filterNode))}n.scrollTop=i;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}w("node-list-toggle").onclick=()=>$i(!C.nodeDrawer);w("node-list-close").onclick=()=>$i(!1);w("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),$i(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!w("node-list-drawer").hidden&&w("source-dialog").hidden&&(e.preventDefault(),$i(!1))});w("node-list-search").oninput=()=>{ot().search=w("node-list-search").value,ht()};function $r(){const e=X();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);vl(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}w("scope-outside").onclick=$r;w("show-outside").onchange=$r;const wl="http://www.w3.org/2000/svg",co=e=>document.createElementNS(wl,e),Fr=new wo,Gs=new WeakMap;function kl(e){if(!ar(e.graph))return;let t=Gs.get(e);return t||(t=Qc(e),Gs.set(e,t)),t.wires}function Il(e,t,n){qo(w("edges"),e,t,{"data-relation":String(n)})}let Jn=()=>{},Dt=[0,0],Kt=[0,0];function Sl(){const e=w("node-list-drawer");return w("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function xl(){const e=w("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function jt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],i=Object.values(e.positions),o=[Math.min(0,...i.map(f=>f[0])),Math.min(0,...i.map(f=>f[1]))],s=[o[0]<0||n[0]>0?Math.min(o[0],Kt[0]):0,o[1]<0||n[1]>0?Math.min(o[1],Kt[1]):0],{growth:a,origin:d}=Ta(n,s,e.zoom),c=a.some(Boolean);c&&(e.canvasOrigin=d,e.scroll=[e.scroll[0]+a[0],e.scroll[1]+a[1]],Mt(),ke(180,!1));const l=Math.ceil(Math.max(1400,Dt[0],(Sl()+e.scroll[0])/e.zoom-t[0]*2-d[0],...i.map(f=>f[0]+340))),r=Math.max(850,Dt[1],Math.max(Dt[1],...i.map(f=>f[1]+68))+xl()/e.zoom-t[1],(w("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-d[1],...i.map(f=>f[1]+220));w("canvas").style.width=(l+d[0]+t[0]*2)*e.zoom+"px",w("canvas").style.height=(r+d[1]+t[1]*2)*e.zoom+"px",w("nodes").style.left=(d[0]+t[0])*e.zoom+"px",w("nodes").style.top=(d[1]+t[1])*e.zoom+"px",w("edges").style.left=t[0]*e.zoom+"px",w("edges").style.top=t[1]*e.zoom+"px",w("nodes").style.width=l+"px",w("nodes").style.height=r+"px",w("nodes").style.transform=`scale(${e.zoom})`,w("edges").setAttribute("viewBox",`${-d[0]} ${-d[1]} ${l+d[0]} ${r+d[1]}`),w("edges").style.width=(l+d[0])*e.zoom+"px",w("edges").style.height=(r+d[1])*e.zoom+"px",c&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("zoom").textContent=Math.round(e.zoom*100)+"%"}function nn(){qr(Al)}function Al(){zi(),_t.cancel(),Jn=()=>{},Dt=[0,0],Kt=[0,0];const e=X();if(w("nodes").replaceChildren(),w("edges").replaceChildren(),w("empty").hidden=!!e,w("canvas").hidden=!e,!e){w("viewport").scrollLeft=0,w("viewport").scrollTop=0,$t(),ht();return}const t=Mi(e),n=t.graph.nodes,i=n.filter(r=>!e.hiddenNodes?.includes(r.id)),o=new Set(i.map(r=>r.id));e.selected&&!o.has(e.selected)&&(e.selected=void 0);const s=e.selected,a=e.positions,d=vi(t.graph.relations,s);jt(e),w("edges").append(To());const c=el(t.graph.relations,C.preferWrite===!0),l=()=>{const r=n.flatMap(p=>{const k=a[p.id];return k?[{id:p.id,x:k[0],y:k[1],width:260,height:68}]:[]}),f=kl(t),u=Fr.update(e,t,r,t.graph.relations,f),b=new Map;for(Dt=[0,0],Kt=[0,0];w("edges").childNodes.length>1;)w("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(p=>[p.id,p.name]));t.graph.relations.forEach((p,k)=>{if(c.has(k))return;const A=u[k];if(!A||(Dt[0]=Math.max(Dt[0],A.bounds.right+20,A.label[0]+Math.max(30,p.label.length*12)/2+12),Dt[1]=Math.max(Dt[1],A.bounds.bottom+20,A.label[1]+22),Kt[0]=Math.min(Kt[0],...A.points.map(N=>N[0]-20),A.label[0]-Math.max(30,p.label.length*12)/2-12),Kt[1]=Math.min(Kt[1],...A.points.map(N=>N[1]-20),A.label[1]-22),e.selectedEdgesOnly===!0&&d.muted(p)||!o.has(p.from)||!o.has(p.to)||e.showExceptions===!1&&(p.kind==="business-exception"||p.kind==="object-exception")))return;const y=co("path");y.setAttribute("d",A.path),y.dataset.relation=String(k),y.dataset.collisions=String(A.collisions),y.dataset.rerouted=String(A.rerouted),y.dataset.fallback=String(A.fallback),y.setAttribute("marker-end","url(#arrow)"),y.classList.add("edge"),p.kind.endsWith("exception")&&y.classList.add("exception"),d.related(p)&&(y.classList.add("review-related"),y.setAttribute("marker-end","url(#related-arrow)")),d.muted(p)&&y.classList.add("muted");const j=co("title");j.textContent=(g.get(p.from)??p.from)+" → "+(g.get(p.to)??p.to)+": "+p.label,y.append(j),w("edges").append(y),p.kind.endsWith("exception")&&Il(y,A,k);const I=rr(p,k,f?.[k]),E=b.get(I);if(E){E.dataset.relations+=" "+k,d.related(p)&&(E.classList.add("review-related"),E.classList.remove("muted"));return}const T=co("text");b.set(I,T),T.dataset.relations=String(k),T.setAttribute("x",String(A.label[0]-Math.max(30,p.label.length*12)/2)),T.setAttribute("y",String(A.label[1])),T.setAttribute("text-anchor","start"),T.classList.add("edge-label"),T.setAttribute("dominant-baseline","middle"),T.dataset.relation=String(k),d.related(p)&&T.classList.add("review-related"),d.muted(p)&&T.classList.add("muted"),T.textContent=p.label,w("edges").append(T)});const m=w("edges");for(const p of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(p);jt(e)};Jn=l,l(),i.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+d.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=a[r.id][0]+"px",f.style.top=a[r.id][1]+"px",r.type==="business"?f.append(Ur(String(r.who),r.id)):f.append(cr(r));const u=document.createElement("span");u.className="node-text";const b=document.createElement("span");b.className="review-kind",b.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),u.append(b);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,u.append(g),r.type==="business"){const y=document.createElement("small");y.textContent=String(r.who),u.append(y)}if(f.append(u),$a(r.id,Hn(e))){const y=document.createElement("button");y.type="button",y.className=r.type==="business"?"activity-open":"object-open",y.setAttribute("aria-label",r.name+"の詳細タブを開く"),y.title="詳細タブを開く",y.textContent="開く",y.onpointerdown=j=>j.stopPropagation(),y.onpointerup=j=>j.stopPropagation(),y.onclick=j=>{j.stopPropagation(),r.type==="business"?Lo(r.id):Vr(r.id),Ke?.businessActivated()},f.append(y)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const m=_d(e.design,r);if(m.length){const y=document.createElement("button");y.type="button",y.className="finding-badges",y.textContent=m.join(" · "),y.setAttribute("aria-label",r.name+"の指摘を開く"),y.onpointerdown=j=>j.stopPropagation(),y.onpointerup=j=>j.stopPropagation(),y.onclick=j=>{j.stopPropagation(),gl(r.id)},f.append(y),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+m.join("、"))}let p;const k=f;k.onpointerdown=y=>{y.button!==0||ge===e||wt||(y.stopPropagation(),k.setPointerCapture(y.pointerId),p=y.pointerId,_t.begin(r.id,[y.clientX,y.clientY]))},k.onpointermove=y=>{p===void 0||y.pointerId!==void 0&&y.pointerId!==p||!f.isConnected||ge===e||_t.move([y.clientX,y.clientY])},k.onpointerup=y=>{if(p===void 0||p!==y.pointerId||(p=void 0,!f.isConnected||ge===e))return;const j=_t.end();k.hasPointerCapture?.(y.pointerId)&&k.releasePointerCapture(y.pointerId),j&&(j.moved||(ot().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Mt()),Dn(r.id)),ye(),nn(),ke(180,!1))};const A=y=>{p===void 0||p!==y.pointerId||(p=void 0,f.isConnected&&(_t.cancel(),ye(),ke(180,!1)))};k.onpointercancel=A,k.onlostpointercapture=A,w("nodes").append(f)}),w("zoom").textContent=Math.round(e.zoom*100)+"%",$t(),ht()}function Lo(e){oe||se||ge||(ye(),ld(C,e),je(),ke(),w("viewport").focus({preventScroll:!0}))}function Vr(e){oe||se||ge||(ye(),ud(C,e),je(),ke(),w("viewport").focus({preventScroll:!0}))}function je(){document.title=C.document?C.document.name+" · Alder Viewer":"Alder Viewer",rt.cancel(),Te=void 0,it(),jo(),nn();const e=X();e&&(w("viewport").scrollLeft=e.scroll[0],w("viewport").scrollTop=e.scroll[1]),w("refresh").toggleAttribute("disabled",oe||se||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Tt.has(mn(e))),w("refresh").hidden=!e,w("view-markdown").toggleAttribute("disabled",oe||qe||se||!1||!e||Tt.has(mn(e))),w("view-markdown").hidden=!e,w("open-checks").hidden=!e||e.design.sourceFormat==="json",w("open-checks").toggleAttribute("disabled",oe||qe||se||!1||!e||!!(e&&tn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])w(t).toggleAttribute("disabled",oe||qe||se);w("open-sample").setAttribute("aria-disabled",String(oe||qe||se)),w("open-sample").tabIndex=oe||qe||se?-1:0,w("theme").toggleAttribute("disabled",oe),Yn(),Ui(),cl(),Gi(),Ke?.syncDocument()}async function ei(e){const t=C.document,n=cd(C,e);return t?(await Fi(()=>n,()=>{C=n,Mn.add(zt(C.tabs[0])?.key??C.tabs[0].key)}),!0):(ye(),C=n,Mn.add(zt(C.tabs[0])?.key??C.tabs[0].key),je(),ke(),!0)}async function Br(e,t){if(It&&!await Bi())return;const n=await Si(e),i=X();if(t&&i?.handle&&await i.handle.isSameEntry(t)){if(i.design.markdown!==n.markdown&&!await Xn(i,n,t))return;Ke?.reopenBusinessOverview(),C.active=C.tabs[0].key,je(),ke();return}const o=Nn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await ei(o)}w("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])w("guide-"+e).onclick=()=>w(e).click();w("open-sample").onpointerdown=e=>e.stopPropagation();w("open-sample").onclick=async e=>{if(e.preventDefault(),!(oe||qe||se))try{if(C.document?.source?.kind==="sample"&&C.document.design.markdown===$s){ye(),Ke?.reopenBusinessOverview(),C.active=C.tabs[0].key,je(),w("viewport").focus({preventScroll:!0});return}const t=bn($s),n=C.document?.source?.kind==="sample"&&C.document.design.markdown===Go?C.tabs[0]:void 0;n&&ye();const i=n??C.sampleLayout,o=i?sl(i,t):{},s=Nn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...o},t);await ei(s)&&w("viewport").focus({preventScroll:!0})}catch(t){We("サンプルを開けません: "+t.message,"error")}};w("open").onclick=async()=>{if(!(oe||qe||se)){qe=!0,je();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Br(await n.getFile(),n)}else w("fallback").click()}catch(e){e.name!=="AbortError"&&We("開けません: "+e.message,"error")}finally{qe=!1,je()}}};w("fallback").onchange=async()=>{const e=w("fallback");if(!(oe||qe||se)){qe=!0,je();try{for(const t of Array.from(e.files??[]))await Br(t)}catch(t){We("開けません: "+t.message,"error")}e.value="",qe=!1,je()}};class Ln extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function Fi(e,t){if(se||ge)throw Error("表示を切り替えています。完了後に再試行してください。");try{Wi()}catch(o){throw new Ln(o)}ye(),clearTimeout(Xt),Xt=void 0,se=!0,kt++;const n=kt;je(),Je();let i=!1;try{const o=structuredClone(Vo(e()));await Dr(o,n);const s=C;t(),C!==s&&(C=fd(C,s)),nt==="view"&&It&&!C.tabs.some(a=>a.key===It)&&(It=C.tabs[0]?.key),Nr(o),i=!0}catch(o){throw Xo(),new Ln(o)}finally{se=!1,je(),Je(),i&&kt!==n&&ke(0,!1)}}async function Xn(e,t,n=e.handle,i=!1){if(!Ut(e)||e.design!==C.document?.design)return!1;const o=dd(C,t,n,i);return await Fi(()=>o,()=>{C=o}),fn=void 0,Gi(),We(""),!0}async function Ks(e){if(!Ut(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await Xn(e,await Si(await n.getFile()),n)}else await new Promise((n,i)=>{const o=document.createElement("input");o.type="file",o.accept=".md,.markdown,.json",o.hidden=!0,document.body.append(o);const s=()=>{o.remove(),n()};o.oncancel=s,o.onchange=async()=>{try{const a=o.files?.[0];a&&await Xn(e,await Si(a)),s()}catch(a){o.remove(),i(a)}},o.click()})}w("refresh").onclick=async()=>{const e=X();if(oe||se||ge||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Tt.has(mn(e)))return;It===e.key&&Oi();const t=mn(e);Tt.add(t),je();try{if(e.source?.kind==="url"){const i=await Ni(e.source.url);await Xn(e,i);return}if(!e.handle){await Ks(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Ut(e))return;if(n!=="granted"){We("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Ks(e);return}await Xn(e,await Si(await e.handle.getFile()))}catch(n){Ut(e)&&n.name!=="AbortError"&&!(n instanceof Ln)&&We("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Tt.delete(t),je()}};let nt="text",It,qt=!1,Zt=0,Ei,Ro=null;const Ct=()=>w("source-text"),Zn=()=>w("source-url");function es(){Ao=!w("source-dialog").hidden&&nt!=="view"&&(nt==="text"?Ct().value:Zn().value)!=="",Je()}Zn().addEventListener("input",es);function Yn(){No();const e=nt==="view",t=qt||se;Ct().disabled=t,Ct().readOnly=e,w("source-dialog").dataset.mode=nt,w("source-submit").hidden=e,w("source-submit").textContent="表示",w("source-submit").disabled=t||e,w("source-cancel").disabled=se||t&&nt!=="url",w("source-cancel").textContent=e?"閉じる":"キャンセル",es(),queueMicrotask(Kr)}function ts(e,t){if(!(oe||qe||se||t&&Tt.has(mn(t)))){Ei?.abort(),Zt++,nt=e,It=t?.key,qt=!1,Ro=document.activeElement,w("source-dialog").hidden=!1,w("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${C.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])w(n).hidden=e!=="url";for(const n of["text-label","source-text"])w(n).hidden=e==="url";w("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Ct().value=t.design.markdown:e==="text"&&(Ct().value=Vi),Yn(),(e==="url"?Zn():Ct()).focus()}}let Vi="",mi;function El(){if(Ro?.isConnected&&Ro.focus({preventScroll:!0}),mi!==void 0&&cancelAnimationFrame(mi),nt!=="view")return;const e=Zt;mi=requestAnimationFrame(()=>{if(mi=void 0,e!==Zt||!w("source-dialog").hidden)return;const t=window.visualViewport,n=bt.querySelector("header"),i=n.getBoundingClientRect();t&&t.height>0&&i.height>0&&i.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Oi(){Zt++,Ei?.abort(),qt=!1,It=void 0,w("source-dialog").hidden=!0,Yn(),El()}async function Bi(){return se?!1:(nt==="text"&&(Vi=Ct().value),Oi(),!0)}function Hr(){return Bi()}Ct().oninput=()=>{nt==="text"&&(Vi=Ct().value,es())};let gi=!1;function Gr(){return oe||qe||qt||se||ge?"読込が終わってから共有してください。":tl(X())}function No(){const e=Gr(),t=w("share-source");t.hidden=!X(),t.setAttribute("aria-disabled",String(gi||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}w("share-source").onclick=async()=>{if(gi)return;const e=Gr();if(e){We(e,"warning");return}const t=X();if(t.source?.kind!=="url")return;const n=t.source.url,i=nl(location.href,n);gi=!0,No();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(i),We("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{We("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{gi=!1,No()}};let Nt,In=0,_s=0,Bn;function Kr(){if(oe||qe||qt||ge||se||Nt||Bn===void 0)return;const e=Bn;Bn=void 0,ns(e)}async function ns(e=location.hash){const t=e;if(oe)return;const n=++_s;if(!/^#source(?:=|$)/.test(t)){Bn=void 0,Nt&&!se&&(Nt.abort(),Nt=void 0,In++,qe=!1,je());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),se){Bn=t;return}if(qt||qe&&!Nt){We("読込が終わってから共有リンクを開き直してください。","warning");return}const i=++In;Nt?.abort();try{const o=il(t);Wi();const s=C.tabs.find(l=>l.source?.kind==="url"&&l.source.url===o),a=s;if(a){if(It&&It!==a.key&&!await Bi()||i!==In||n!==_s)return;const l=ye()||C.active!==a.key;C.active=a.key,je(),ke(180,l),We("開いている共有元のタブを選択しました。表示内容は保持しています。"),ti();return}Nt=new AbortController,qe=!0,je();const d=await Ni(o,Nt.signal);if(i!==In)return;const c=Nn({key:crypto.randomUUID(),name:new URL(o).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:o},design:d,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},d);if(!await ei(c))return;We("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+o)}catch(o){i===In&&!(o instanceof Ln)&&We("共有リンクを開けません。既存の表示は保持しています: "+o.message,"error")}finally{i===In&&(Nt=void 0,qe=!1,je(),Kr())}}window.addEventListener("hashchange",()=>{ns().then(()=>{C.document?.key===Do&&ti()})});function is(e){C.drawer=!0,it(),$t()}async function Ol(e){const t=tn(e);if(!(e.design.sourceFormat==="json"||t.busy||se||oe||ge===e)){t.busy=!0;try{await Yo(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,$t()}}}let Ci;Ot.onchange=()=>{const e=Ot.files?.[0],t=Ci??X();Ci=void 0,Ot.value="",!(!e||!t||!Ut(t))&&(is(),Wr(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ot.oncancel=()=>{Ci=void 0};w("check-open").onclick=()=>{Ci=X(),Ot.click()};let os,yi=null;function ss(){Ft.hidden=!0,os=void 0,(yi&&!yi.closest("[hidden]")?yi:w("open-checks").getBoundingClientRect().width?w("open-checks"):w("document-actions-toggle")).focus({preventScroll:!0})}w("check-open-url").onclick=()=>{const e=X();e&&(yi=Mo??document.activeElement,os=e,w("check-url").value=tn(e).url??"",Ft.hidden=!1,w("check-url").focus())};w("check-url-cancel").onclick=ss;Ft.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),ss())};w("check-url-form").onsubmit=e=>{e.preventDefault();const t=os;if(!t||!Ut(t))return;const n=w("check-url").value.trim();tn(t).url=n,ss(),is(),Wr(t,async()=>({name:n,url:n,markdown:await Gd(n)}))};w("check-open-sample").onclick=()=>{const e=X();!e||!Zo(e)||(is(),zr(e,{name:"チェックリストのサンプル",markdown:rl}))};w("check-close").onclick=()=>{const e=X();e&&Ol(e)};w("open-sample-menu").onclick=()=>{w("open-sample").click()};w("view-markdown").onclick=()=>{const e=X();e&&ts("view",e)};w("open-url").onclick=()=>ts("url");w("open-text").onclick=()=>ts("text");w("source-cancel").onclick=()=>Hr();w("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Hr())};w("source-submit").onclick=async()=>{if(qt||se||nt==="view"&&ge||w("source-dialog").hidden||nt==="view")return;qt=!0,Yn();const e=++Zt,t=nt;Ei=new AbortController;try{const n=nt==="url"?new URL(Zn().value.trim()).href:Zn().value.trim();if(t==="url"&&C.document?.source?.kind==="url"&&C.document.source.url===n){Ke?.reopenBusinessOverview(),C.active=C.tabs[0].key,Oi(),je(),ti();return}const i=t==="url"?await Ni(n,Ei.signal):Kd(Ct().value),o=i.markdown;if(e!==Zt)return;const s=Nn({key:crypto.randomUUID(),name:t==="text"?i.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:i,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},i);if(!await ei(s))return;We(""),t==="text"&&(Vi=o),Oi()}catch(n){e===Zt&&!(n instanceof Ln)&&We("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===Zt&&(qt=!1,Yn())}};w("layout-lock").onclick=()=>{oe||(rt.cancel(),Te=void 0,ye(),wt=!wt,it(),nn())};w("selected-edges-only").onchange=()=>{const e=X();!e||oe||se||ge===e||(rt.cancel(),Te=void 0,ye(),e.selectedEdgesOnly=w("selected-edges-only").checked,Jn(),ke())};w("show-exceptions").onchange=()=>{const e=X();!e||oe||se||ge===e||(rt.cancel(),Te=void 0,ye(),e.showExceptions=w("show-exceptions").checked,Jn(),ke())};w("prefer-write").onchange=()=>{oe||(ye(),C.preferWrite=w("prefer-write").checked,nn(),ke())};w("theme").onclick=()=>{oe||(C.dark=!C.dark,it(),ke())};w("drawer").onclick=()=>{oe||!X()||(ye(),C.drawer=!C.drawer,je(),ke())};for(const[e,t]of[["in",gs],["out",1/gs]])w(e).onclick=()=>{const n=X();if(n&&ge!==n){const i=ye(),o=Ra({zoom:n.zoom,scroll:n.scroll},t).zoom,s=i||o!==n.zoom;n.zoom=o,je(),ke(180,s)}};const Ae=w("viewport");function _r(e,t){const n=X();if(!n||se||ge===n)return;ye();const i=n.positions[e];n.positions[e]=t,(i?.[0]!==t[0]||i?.[1]!==t[1])&&Mt();const o=Array.from(w("nodes").children).find(s=>s.dataset.node===e);o&&(o.style.left=t[0]+"px",o.style.top=t[1]+"px"),Jn()}const _t=Pa({read:()=>{const e=X();return e&&!se&&e!==ge&&!wt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[Ae.scrollLeft,Ae.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>X()?.positions[e],connected:e=>Array.from(w("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=Ae.getBoundingClientRect(),t=e.left+Ae.clientLeft,n=e.top+Ae.clientTop,i={left:t,top:n,right:t+Ae.clientWidth,bottom:n+Ae.clientHeight};for(const[s,a]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const d=w(s),c=d.getBoundingClientRect();d.hidden||c.bottom<=n||c.top>=i.bottom||(a==="right"&&c.left>i.left&&c.left<i.right&&(i.right=c.left),a==="left"&&c.right>i.left&&c.right<i.right&&(i.left=c.right))}const o=document.querySelector(".toolbar").getBoundingClientRect();return o.height&&o.top<i.bottom&&o.bottom>i.top&&(i.bottom=Math.max(i.top,o.top-12)),i},change:_r,pan:e=>{const t=X();if(!t||t===ge||wt)return;ye();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],i=t.canvasOrigin??[0,0],o=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];o.some(Boolean)&&(t.canvasOrigin=[i[0]+o[0]/t.zoom,i[1]+o[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+o[0]),Math.max(0,n[1]+o[1])],jt(t),Ae.scrollLeft=t.scroll[0],Ae.scrollTop=t.scroll[1],ye(),Mt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),rt=Na(Ae,{nodeDrag:_t,read:()=>{const e=X();return e&&!se&&ge!==e?{key:e.key,zoom:e.zoom,locked:wt,scroll:[Ae.scrollLeft,Ae.scrollTop]}:void 0},position:e=>X()?.positions[e],change:e=>{const t=X();if(!t||se||ge===t)return;const n=t.scroll;let i=!1;e.node&&_r(e.node.id,e.node.position),e.selected&&(ot().finding=void 0,i=i||t.selected!==e.selected,t.selected=e.selected,Dn(e.selected)),e.zoom!==void 0&&(i=i||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?nn():e.zoom!==void 0&&jt(t),e.scroll&&(Ae.scrollLeft=e.scroll[0],Ae.scrollTop=e.scroll[1]),ye(!1),(i||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Mt()},finish:()=>{const e=X();e&&jt(e),ye(),ke(180,!1)}}),rs=()=>{rt.cancel(),Te=void 0,ye(),ke(0,!1)};window.addEventListener("blur",rs);window.addEventListener("pagehide",rs);document.addEventListener("visibilitychange",()=>{document.hidden&&rs()});Ae.onscroll=()=>{ye()};let Te;Da(Ae,{read:()=>{const e=X();return e&&!oe&&!se&&e!==ge?{zoom:e.zoom,scroll:[Ae.scrollLeft,Ae.scrollTop]}:void 0},change:e=>{const t=X();!t||se||t===ge||(rt.cancel(),_t.cancel(),Te=void 0,t.zoom=e.zoom,t.scroll=e.scroll,jt(t),Ae.scrollLeft=t.scroll[0],Ae.scrollTop=t.scroll[1],ye(!1),Mt(),ke(180,!1))}});Ae.onpointerdown=e=>{const t=X(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||se||t===ge||n&&!wt||(Te={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[Ae.scrollLeft,Ae.scrollTop],node:n,moved:!1},Ae.setPointerCapture(e.pointerId))};Ae.onpointermove=e=>{if(Te&&Te.pointer===e.pointerId&&Te.key===X()?.key&&X()!==ge){const t=e.clientX-Te.x,n=e.clientY-Te.y;Math.hypot(t,n)>3&&(Te.moved=!0),Ae.scrollLeft=Te.scroll[0]-t,Ae.scrollTop=Te.scroll[1]-n,ye()}};Ae.onpointerup=e=>{if(!Te||Te.pointer!==e.pointerId)return;const t=X(),n=Te;Te=void 0,Ae.hasPointerCapture?.(e.pointerId)&&Ae.releasePointerCapture(e.pointerId),t&&t!==ge&&n.key===t.key&&!n.moved&&n.node&&(ot().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Mt()),Dn(n.node),nn()),ye(),ke(180,!1)};Ae.onpointercancel=()=>{Te=void 0};Ae.addEventListener("lostpointercapture",e=>{e.target===Ae&&Te?.pointer===e.pointerId&&(Te=void 0)});let Hi=!1;w("resize").onpointerdown=e=>{oe||(Hi=!0,w("resize").setPointerCapture(e.pointerId))};w("resize").onpointermove=e=>{if(Hi){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==C.width&&(C.width=t,Mt()),it()}};w("resize").onpointerup=()=>{Hi=!1,ke(180,!1)};w("resize").onpointercancel=()=>{Hi=!1,ke(180,!1)};w("resize").onkeydown=e=>{if(!oe&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,C.width+(e.key==="ArrowLeft"?20:-20)));t!==C.width&&(C.width=t,Mt()),it(),ke(180,!1)}};window.addEventListener("resize",()=>{it();const e=X();e&&jt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=X();t&&jt(t)});e.observe(w("viewport")),e.observe(document.querySelector(".toolbar"))}function hi(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=bn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Cn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Pn=document.createElement("section");Pn.id="source-update-notice";Pn.className="info-bar";Pn.hidden=!0;Pn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Pn);let fn;const Jr=new Set;let lo=0,Do,uo;function Gi(){const e=C.document;Pn.hidden=!fn||fn.key!==e?.key||fn.baseline!==e.design.markdown||Jr.has(e.key),w("source-update-refresh").disabled=oe||qe||se||!!(e&&Tt.has(e.key))}w("source-update-close").onclick=()=>{fn&&Jr.add(fn.key),Gi()};w("source-update-refresh").onclick=()=>{w("refresh").click()};async function ti(){const e=C.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(uo===t)return;uo=t;const n=++lo,i=e.key,o=e.source.url,s=e.design.markdown;try{const a=await Bo(o);if(n!==lo||C.document?.key!==i||C.document.design.markdown!==s||C.document.source?.kind!=="url"||C.document.source.url!==o)return;bn(a),fn=a.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:i,url:o,baseline:s}:void 0,Gi()}catch{}finally{n===lo&&(uo=void 0)}}Ke=Vc(bt,{rightDrawer:{isOpen:()=>C.drawer,isReady:()=>!oe,setOpen:e=>{oe||(C.drawer=e,it(),ke())}},capture:()=>{ye(),rt.cancel(),Te=void 0},business:()=>({key:C.document?.key,design:C.document?.design,relatedChecks:C.tabs[0]?vd(C.tabs[0]):[],viewKey:X()?.key,views:C.tabs.map(e=>({key:e.key,name:e.name,activity:ki(e),object:Ii(e)})),activities:C.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:C.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:C.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!C.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=C.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Lo(e),bi(e)},openObject:e=>{Vr(e),bi(e)},openOverview:()=>{C.tabs[0]&&(ye(),Ke?.reopenBusinessOverview(),C.active=C.tabs[0].key,je(),ke())},activateView:e=>{C.tabs.some(t=>t.key===e)&&(ye(),C.active=e,je(),ke())},statePanel:e=>C.document?Kc(C.document.design,e,t=>{Ke?.activateBusiness(),Lo(t),bi(t),Ke?.businessActivated()}):void 0,closeLegacyList:()=>{C.nodeDrawer=!1,it()},refresh:()=>{it(),xo.update()}});const Cl=C;je();Je();nd().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const l of t.recovery??[])hi(l);if(t.document){const l={...t.document};hi(l),t.document.design=l.design,t.document.checks=l.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const l of t.tabs)hi(l)}const n=ad(t),i={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(l=>({...l,name:n.document.name,design:l.design,checks:l.checks,source:l.source,draft:l.draft,edited:l.edited,handle:l.handle}))};if(!Array.isArray(i.tabs)||typeof i.dark!="boolean"||typeof i.drawer!="boolean"||i.preferWrite!==void 0&&typeof i.preferWrite!="boolean"||i.scopeOutside!==void 0&&!["show","dim","hide"].includes(i.scopeOutside)||i.dimOutside!==void 0&&typeof i.dimOutside!="boolean"||i.hideOutside!==void 0&&typeof i.hideOutside!="boolean"||!Number.isFinite(i.width))throw Error("Invalid session");for(const l of i.tabs)hi(l);if(new Set(i.tabs.map(l=>l.key)).size!==i.tabs.length||i.active!==void 0&&typeof i.active!="string")throw Error("Invalid saved tab keys");if(i.nodeDrawer!==void 0&&typeof i.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const l of[...i.tabs,...i.sampleLayout===void 0?[]:[i.sampleLayout]])if(!l||!l.positions||typeof l.positions!="object"||Array.isArray(l.positions)||l.selectedEdgesOnly!==void 0&&typeof l.selectedEdgesOnly!="boolean"||l.showExceptions!==void 0&&typeof l.showExceptions!="boolean"||l.hiddenNodes!==void 0&&(!Array.isArray(l.hiddenNodes)||!l.hiddenNodes.every(r=>typeof r=="string"))||l.viewInset!==void 0&&(!Array.isArray(l.viewInset)||l.viewInset.length!==2||!l.viewInset.every(r=>Number.isFinite(r)&&r>=0))||l.canvasOrigin!==void 0&&(!Array.isArray(l.canvasOrigin)||l.canvasOrigin.length!==2||!l.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(l.scroll)||l.scroll.length!==2||!l.scroll.every(Number.isFinite)||!Number.isFinite(l.zoom)||l.zoom<.25||l.zoom>2.5||!Object.values(l.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:o,hideOutside:s,scopeOutside:a,...d}=i,c=l=>({...l,hiddenNodes:l.hiddenNodes??(i.scopeOutside==="hide"?l.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});C=Qt({...d,tabs:i.tabs.map(c)},n.recovery,n.document,i.tabs.map(l=>{const{design:r,checks:f,source:u,draft:b,edited:g,handle:m,name:p,...k}=c(l);return k})),i.sampleLayout&&i.sampleLayout.hiddenNodes===void 0&&i.scopeOutside==="hide"&&(C.sampleLayout={...i.sampleLayout,hiddenNodes:bn(Go).graph.nodes.filter(l=>!l.scope).map(l=>l.id)}),C.tabs.some(l=>l.key===C.active)||(C.active=C.tabs[0]?.key),X()?.selected&&Dn(X().selected),Do=C.document?.key,je(),Ko=!0}).catch(()=>{C=Cl,jn=!0,_o()}).finally(()=>{oe=!1,je(),Je(),ns().then(()=>{C.document?.key===Do&&ti()})});
