import{L as zs,D as Kr,G as Xr,W as Zr,P as Yr,l as Et,X as Us,C as Qr,n as ea,S as Jn,o as $s,p as Fs,q as Vs,M as Bs,s as Gs,t as Hs,u as ji,g as Mi,r as ri,d as Js,b as go,v as Li,U as _s,w as ta,x as Ks,y as Xs,z as ai,A as na,m as Ri,B as oa,E as Zs,F as ia,j as sa,H as cs,I as ra,T as aa,J as ca,K as da,R as la,N as ua,O as fa,Q as pa,V as ma,Y as ha,_ as ba,Z as ds,k as ga,i as ya,h as va,f as wa,a as ka,$ as Ia,a0 as Sa,a1 as Ys,a2 as xa,a3 as Aa,e as Ea}from"./canvas-toolbar-DuA_31SG.js";const Oa={subsystems:{full:"サブシステム",icon:Yr},business:{full:"業務設計",icon:Zr},states:{full:"状態遷移",icon:Xr},concept:{full:"データ構造",icon:Kr},tests:{full:"テスト仕様",icon:zs}};function ci(e,t,n){const o=Oa[t],i=document.createElement("span"),s=document.createElement("span"),a=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Et(o.icon,{"aria-hidden":"true","stroke-width":1.8})),a.className="view-tab-name",a.textContent=n,i.append(s,a),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function di(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Et(Us,{"aria-hidden":"true","stroke-width":1.8})),t}function Ca(e){const t=Et(e?Qr:ea,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function ja(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,a=Math.max(0,Math.min(n,s+o*i));a!==s&&(e.scrollLeft=a,t.preventDefault())},{passive:!1})}function Ma(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const La=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function ls(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=La,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const a=Et(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&a.classList.add(s),t.querySelector(o)?.append(a)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",$s),n(".layout-lock",Fs,"lock-closed"),n(".layout-lock",Vs,"lock-open"),n(".zoom-out",Bs),n(".zoom-in",Gs)}function us(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))t.querySelector("svg")||t.append(Et(Jn,{"aria-hidden":"true","stroke-width":1.8}))}function Ra({model:e}){const t=Object.fromEntries(e.concepts.map(c=>[c.id,{name:c.name,note:c.description,fields:c.information.map(d=>["",d.name+(d.responsibleSubsystemId&&d.responsibleSubsystemId!==c.subsystemId?"（担当："+e.subsystems.find(r=>r.id===d.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind]),o=e.reviewGroups.map(c=>({id:c.id,name:c.title,purpose:c.description,activities:c.relatedActivityIds,concepts:Object.fromEntries(c.graph.nodes.map(d=>[d.conceptId,{name:d.name,note:d.description,fields:d.fields.map(r=>["",r]),sources:d.sources,sourceActivities:d.sourceActivityIds}])),relations:c.graph.edges.map(d=>[d.fromConceptId,d.toConceptId,d.fromLabel,d.toLabel,d.kind])})),i=c=>o.find(d=>d.id===c),s=(c,d)=>{const r=Object.fromEntries(c.nodes.map(h=>[h.id,{...d[h.conceptId],name:h.name,note:h.description,sources:h.sources,conceptId:h.conceptId,subsystemId:h.subsystemId,fields:h.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(h=>c.nodes.some(g=>g.subsystemId===h.id)).map(h=>({id:h.id,name:h.name})),u=c.handoffIds.map(h=>e.handoffs.find(g=>g.id===h)).map(h=>({id:h.id,from:h.fromSubsystemId,to:h.toSubsystemId,label:h.information,returning:h.flowDirection==="return"}));return{ids:c.nodes.map(h=>h.id),tables:r,edges:c.edges.map(h=>[h.fromViewId,h.toViewId,h.fromLabel,h.toLabel,h.kind]),regions:f,handoffs:u}};return{tables:t,edges:n,groups:o,findGroup:i,graph:c=>{const d=i(c);if(!d)throw Error("Unknown review group: "+c);const r=e.reviewGroups.find(h=>h.id===c),f=r.graph.subsystemViews;if(f)return s(f,d.concepts);const u=Object.keys(t).filter(h=>Object.hasOwn(d.concepts,h));return{ids:u,tables:d.concepts,edges:d.relations.filter(([h,g])=>u.includes(h)&&u.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function Ye(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Da(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",o.append(Et(Jn,{"aria-hidden":"true","stroke-width":1.8})),Ye(o,"span",t),o.onclick=n,e.append(o),o}function Na(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Pa(e,t,n,o=()=>{},i=()=>{},s=[]){const a=n.contentFor(t.id);if(e.replaceChildren(),!a)return;Ye(e,"p",a.description).className="review-description",Ye(e,"h3","関連業務");const l=document.createElement("ul");l.className="review-related-activities";for(const c of a.relatedActivities){const d=document.createElement("li"),r=s.find(u=>u.id===c.id&&u.name===c.name),f=Da(d,c.name,()=>{r&&i(r.id)});f.disabled=!r,f.setAttribute("aria-label",c.name+"を業務タブで開く"),f.querySelector("svg")?.setAttribute("data-icon","square-arrow-out-up-right"),f.append(f.querySelector("svg")),l.append(d)}e.append(l),Ye(e,"h3","情報の構造");for(const c of a.structureStatements){const d=document.createElement("section");d.className="review-structure",d.dataset.structure=c.id,Ye(d,"h4",c.title),Ye(d,"p",c.description),e.append(d)}Ye(e,"h3","できること");for(const c of a.capabilities){const d=document.createElement("section");d.className="review-capability",d.dataset.capability=c.id,Ye(d,"h4",c.title),Ye(d,"p",c.description);for(const r of c.samples){const f=o(c.id,r.id),u=document.createElement("button");u.className="review-sample-link",u.type="button",u.dataset.sample=r.id,u.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+r.name,f?u.onclick=f.open:(u.disabled=!0,u.title="対応するテスト仕様へのリンクがありません"),d.append(u)}e.append(d)}Ye(e,"h3","できないこと（業務上のルール）");for(const c of a.limitations){const d=document.createElement("section");d.className="review-limitation",Ye(d,"h4",c.title),Ye(d,"p",c.description),Ye(d,"h5","理由"),Ye(d,"p",c.reason),e.append(d)}}function Vt(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function Ta({model:e,business:t}){const n=a=>a.kind==="group"?e.subsystems.find(l=>l.id===a.id):e.handoffs.find(l=>l.id===a.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(a){const l=n(a);return l?l.activityIds.map(c=>t.activities.find(d=>d.id===c)).filter(Boolean):[]}function s(a,l){if(a.replaceChildren(),l.kind==="group"){const f=e.subsystems.find(h=>h.id===l.id);if(!f)return"";Vt(a,"p",f.purpose),Vt(a,"h3","扱う情報");const u=a.ownerDocument.createElement("ul");for(const h of f.information)Vt(u,"li",h);return a.append(u),Vt(a,"h3","まとまりの理由"),Vt(a,"p",f.reason),f.name}const c=e.handoffs.find(f=>f.id===l.id);if(!c)return"";Vt(a,"p",c.description),Vt(a,"h3","出元と受取先");const d=e.subsystems.find(f=>f.id===c.fromSubsystemId),r=e.subsystems.find(f=>f.id===c.toSubsystemId);return Vt(a,"p",`${d.name} → ${r.name}`),c.information}return{sections:o,activities:i,describe:s}}function qa(e,t,n){const o=document.createElement("div");o.className="concept-drawer-resize",o.tabIndex=0,o.setAttribute("role","separator"),o.setAttribute("aria-orientation","vertical"),o.setAttribute("aria-label","補足情報の幅"),e.prepend(o);let i=440;try{const l=Number(sessionStorage.getItem(n));Number.isFinite(l)&&l>=280&&(i=l)}catch{}const s=()=>{let l=t.clientWidth||innerWidth;const c=t.querySelector("#design-explorer");return innerWidth>800&&c&&!c.hidden&&(l-=c.offsetWidth),Math.max(280,Math.min(1e3,l-(innerWidth>800?240:16)))},a=(l,c=!1)=>{if(i=Math.max(280,Math.min(s(),l)),e.style.setProperty("--concept-drawer-width",i+"px"),o.setAttribute("aria-valuemin","280"),o.setAttribute("aria-valuemax",String(s())),o.setAttribute("aria-valuenow",String(Math.round(i))),c)try{sessionStorage.setItem(n,String(i))}catch{}};if(o.onkeydown=l=>{["ArrowLeft","ArrowRight","Home","End"].includes(l.key)&&(l.preventDefault(),a(l.key==="Home"?280:l.key==="End"?s():i+(l.key==="ArrowLeft"?40:-40),!0))},o.onpointerdown=l=>{if(l.button!==0)return;l.preventDefault();const c=l.clientX,d=i;o.setPointerCapture(l.pointerId),o.classList.add("resizing"),o.onpointermove=r=>a(d+c-r.clientX),o.onpointerup=()=>{o.onpointermove=null,o.onpointerup=null,o.onpointercancel=null,o.classList.remove("resizing"),a(i,!0)},o.onpointercancel=o.onpointerup},typeof ResizeObserver<"u"){const l=new ResizeObserver(()=>a(i));l.observe(t);const c=t.querySelector("#design-explorer");c&&l.observe(c)}window.addEventListener("resize",()=>a(i)),a(i)}const Wa="http://www.w3.org/2000/svg",kt=(e,t,n={})=>{const o=e.createElementNS(Wa,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function za(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Et(_s,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function Ua(e,{model:t,business:n},o,i,s){const a=t.reviewGroups,l=t.subsystems,c=t.presentation.landscapeRelationships.map(y=>{const P=a.find(k=>k.id===y.from),B=a.find(k=>k.id===y.to);if(!P||!B||P.subsystemId!==B.subsystemId||!t.presentation.reviewBoundaries.some(k=>k.from===y.from&&k.to===y.to))throw Error("Unknown overview relationship: "+y.from+" -> "+y.to);return y}),d=t.handoffs.map(y=>{if(!["forward","return"].includes(y.flowDirection))throw Error("Unknown overview handoff direction: "+y.id);return{id:y.id,from:y.fromSubsystemId,to:y.toSubsystemId,label:y.information,returning:y.flowDirection==="return"}});if(new Set(d.map(y=>y.id)).size!==d.length)throw Error("Duplicate overview handoff");for(const y of d)if(!l.some(P=>P.id===y.from)||!l.some(P=>P.id===y.to)||y.from===y.to||!y.label.trim())throw Error("Unknown overview handoff: "+y.id);for(const y of a){if(!l.some(P=>P.id===y.subsystemId))throw Error("Unknown overview subsystem: "+y.id);if(!n.roles?.some(P=>P.id===y.reviewer.roleId))throw Error("Unknown overview reviewer: "+y.id)}const r=l.flatMap(y=>a.filter(P=>P.subsystemId===y.id)),f=new Map;let u=0;for(const[y,P]of l.entries())for(const B of r.filter(k=>k.subsystemId===P.id))f.set(B.id,[80+u*170,100+u*120+y*64]),u++;const h=ji(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let p,m,S=!1;try{const y=JSON.parse(localStorage.getItem(g)||"null"),P=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),B=!y&&P?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,k=y??B;if(k){S=!0,typeof k.zoom=="number"&&Number.isFinite(k.zoom)&&(h.zoom=Math.max(.25,Math.min(2.5,k.zoom))),Array.isArray(k.scroll)&&k.scroll.length===2&&k.scroll.every(L=>typeof L=="number"&&Number.isFinite(L))&&(h.scroll=k.scroll),typeof k.locked=="boolean"&&(h.locked=k.locked);for(const[L,W]of Object.entries(k.positions??{}))a.some(J=>J.id===L)&&Array.isArray(W)&&W.length===2&&W.every(J=>typeof J=="number"&&Number.isFinite(J))&&h.positions.set(L,[W[0],W[1]])}const M=k?.selection,T=M?.kind==="node"?t.concepts.find(L=>L.id===M.id)?.subsystemId:M?.id,N=M?.kind==="node"?"group":M?.kind;typeof T=="string"&&(N==="model"&&a.some(L=>L.id===T)||N==="group"&&l.some(L=>L.id===T)||N==="connection"&&d.some(L=>L.id===T))&&(m={kind:N,id:T}),m?.kind==="model"&&(h.selected=m.id)}catch{}const O=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:h.zoom,scroll:h.scroll,locked:h.locked,positions:Object.fromEntries(h.positions),selection:m}))}catch{}},w=y=>{if(!y&&!m)return;m=y,h.selected=y?.kind==="model"?y.id:void 0;const P=p?.querySelector(".diagram-world>svg");P&&E(P),O()},E=y=>{const P=go(c,h.selected),B=go(d,m?.kind==="group"?m.id:void 0);for(const k of a){const M=y.querySelector(`[data-node="${k.id}"]`);M?.setAttribute("class","node graph-shape state-shape"+P.nodeClasses(k.id)),M?.setAttribute("aria-pressed",String(h.selected===k.id))}for(const k of l){const M=y.querySelector(`[data-subsystem="${k.id}"]`);M?.setAttribute("class","subsystem-overview-group"+B.nodeClasses(k.id)),M?.querySelector("button")?.setAttribute("aria-pressed",String(m?.kind==="group"&&m.id===k.id))}for(const k of c){const M=y.querySelector(`[data-overview-from="${k.from}"][data-overview-to="${k.to}"]`);M?.setAttribute("class","edge"+(P.related(k)?" review-related":"")),M?.setAttribute("marker-end",`url(#overview-${P.related(k)?"related-arrow":"arrow"})`)}for(const k of d){const M=B.related(k)||m?.kind==="connection"&&m.id===k.id,T=y.querySelector(`[data-handoff-id="${k.id}"]`);T?.setAttribute("class","edge"+(k.returning?" exception":"")+(M?" review-related":"")),T?.setAttribute("marker-end",`url(#overview-${M?"related-arrow":"arrow"})`),y.querySelector(`[data-handoff-label="${k.id}"]`)?.classList.toggle("review-related",!!M)}y.querySelectorAll("[data-exception-paint]").forEach(k=>k.remove());for(const k of Array.from(y.querySelectorAll("[data-handoff-id].exception")))Li(y,k,{path:k.getAttribute("d")},{"data-overview-return-paint":k.getAttribute("data-handoff-id")})};return p=Hs(e,y=>{const P=r.map(N=>{const L=y.positions.get(N.id)??f.get(N.id);return{id:N.id,x:L[0],y:L[1],width:300,height:86}}),B=kt(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});B.append(Mi("overview-"));let k=0,M=0;const T=[];for(const N of l){const L=P.filter(he=>a.find(A=>A.id===he.id)?.subsystemId===N.id);if(!L.length)continue;const W=Math.min(...L.map(he=>he.x))-30,J=Math.min(...L.map(he=>he.y))-48,ee=Math.max(...L.map(he=>he.x+he.width))-W+30,ae=Math.max(...L.map(he=>he.y+he.height))-J+30;T.push({id:N.id,x:W,y:J,width:ee,height:ae});const te=kt(e,"g",{"data-subsystem":N.id,"aria-label":N.name}),de=kt(e,"rect",{x:W,y:J,width:ee,height:ae,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});de.addEventListener("click",()=>w({kind:"group",id:N.id})),te.append(de);const Ve=kt(e,"foreignObject",{class:"subsystem-overview-region-heading",x:W+8,y:J+3,width:ee-16,height:36}),Ce=e.createElement("button");Ce.type="button",Ce.className="subsystem-overview-region-title",Ce.setAttribute("aria-label",N.name+"を選択"),Ce.textContent=N.name,Ce.onclick=()=>w({kind:"group",id:N.id}),Ve.append(Ce),te.append(Ve),B.append(te),k=Math.max(k,W+ee+40),M=Math.max(M,J+ae+40)}for(const[N,L]of d.entries()){if(!T.some(te=>te.id===L.from)||!T.some(te=>te.id===L.to))throw Error("Missing overview handoff region: "+L.id);const W=Math.max(30,L.label.length*12),J=ri({from:L.from,to:L.to,nodes:T,index:N,kind:"input",matrix:{returning:L.returning,captionLane:0},labelWidth:W,labelHeight:18}),ee=kt(e,"path",{d:J.path,class:"edge"+(L.returning?" exception":""),"data-handoff-id":L.id,"data-from-subsystem":L.from,"data-to-subsystem":L.to,"data-flow-direction":L.returning?"return":"forward","marker-end":"url(#overview-arrow)"});B.append(ee);const ae=kt(e,"text",{x:J.label[0]-W/2,y:J.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":L.id});ae.textContent=L.label,ae.addEventListener("pointerdown",te=>te.stopPropagation()),ae.addEventListener("pointerup",te=>te.stopPropagation()),ae.addEventListener("click",()=>w({kind:"connection",id:L.id})),ae.addEventListener("keydown",te=>{(te.key==="Enter"||te.key===" ")&&(te.preventDefault(),w({kind:"connection",id:L.id}))}),B.append(ae),k=Math.max(k,J.bounds.right+40,J.label[0]+W/2+30),M=Math.max(M,J.bounds.bottom+40,J.label[1]+30)}for(const[N,L]of c.entries()){const W=ri({from:L.from,to:L.to,nodes:P,index:N,kind:"input",labelWidth:0,labelHeight:0}),J=kt(e,"path",{d:W.path,class:"edge","data-overview-from":L.from,"data-overview-to":L.to,"marker-end":"url(#overview-arrow)"});B.append(J),k=Math.max(k,W.bounds.right+40),M=Math.max(M,W.bounds.bottom+40)}for(const N of P){const L=a.find(A=>A.id===N.id),W=n.roles.find(A=>A.id===L.reviewer.roleId),J=kt(e,"g",{role:"button",tabindex:0,"aria-label":L.title+"を選択","aria-pressed":"false","data-node":N.id,"data-review-group":N.id,"data-subsystem-id":L.subsystemId,class:"node graph-shape state-shape"}),ee=Js(e,N);ee.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),J.append(ee,kt(e,"rect",{x:N.x,y:N.y,width:N.width,height:N.height,rx:8,class:"state-diagram-node"}));const te=kt(e,"foreignObject",{x:N.x,y:N.y,width:N.width,height:N.height}),de=e.createElement("div");de.className="subsystem-overview-card";const Ve=za(e,W.color),Ce=e.createElement("span");Ce.className="subsystem-overview-labels";for(const[A,R,_]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",L.title],["small","subsystem-overview-role",W.name]]){const re=e.createElement(A);re.className=R,re.textContent=_,Ce.append(re)}const he=e.createElement("button");he.type="button",he.className="subsystem-overview-open",he.setAttribute("aria-label",L.title+"の詳細タブを開く"),he.title="詳細タブを開く",he.append(e.importNode(Et(Jn,{"aria-hidden":"true","stroke-width":1.8}),!0)),he.onpointerdown=A=>A.stopPropagation(),he.onpointerup=A=>A.stopPropagation(),he.onclick=A=>{A.stopPropagation(),i(L.id)},de.append(Ve,Ce,he),te.append(de),J.append(te),J.addEventListener("click",()=>w({kind:"model",id:N.id})),J.addEventListener("keydown",A=>{(A.key==="Enter"||A.key===" ")&&(A.preventDefault(),w({kind:"model",id:N.id}))}),B.append(J)}return B.setAttribute("viewBox",`0 0 ${k} ${M}`),E(B),B},h,O,()=>w(void 0)),p.classList.add("subsystem-overview-canvas"),p.addEventListener("click",O),p.addEventListener("pointerup",()=>queueMicrotask(O)),p.querySelector(".diagram-viewport")?.addEventListener("scroll",O),S||e.defaultView?.requestAnimationFrame?.(()=>{const y=p.querySelector(".diagram-viewport"),P=p.querySelector(".zoom-out");if(y.clientWidth){for(let B=0;B<8;B++){y.scrollLeft=0,y.scrollTop=0;const k=y.getBoundingClientRect().right;if(Array.from(p.querySelectorAll("[data-handoff-label]")).every(M=>M.getBoundingClientRect().right<=k))break;P.click()}h.scroll=[y.scrollLeft,y.scrollTop],O()}}),{root:p,selected:()=>h.selected,selection:()=>m,restore:()=>{const y=()=>{const P=p.querySelector(".diagram-viewport");P.scrollLeft=h.scroll[0],P.scrollTop=h.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(y):y()}}}function $a(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(a=>a.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function Fa({model:e,business:t}){const n=g=>{const p=t.activities.find(m=>m.id===g);if(!p)throw Error("Unknown activity: "+g);return p},o=g=>{const p=t.roles?.find(m=>m.id===g);if(!p)throw Error("Unknown role: "+g);return p.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(p=>{const m=n(p);return{id:m.id,name:m.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(p=>({...p,samples:p.samples.map($a)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(p=>p.id===g),a=(g,p)=>s(g)?.capabilities.find(m=>m.samples.some(S=>S.id===p)),l=i.flatMap(g=>g.capabilities.flatMap(p=>p.samples.map(m=>({...m,group:g.id})))),c=["yellow","cyan","green","blue","purple","orange"];function d(g,p,m){let S=m.get(p);if(S||(S=c[m.size]??`extra-${m.size}`,m.set(p,S)),g.dataset.sampleKey=p,g.dataset.keyTone=S,g.className="data-example-key",S.startsWith("extra-")){const O=(Number(S.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${O} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${O} 24% 25%)`)}}const r=g=>l.filter(p=>p.group===g),f=(g,p)=>r(g).find(m=>m.id===p);function u(g,p,m){const S=g.ownerDocument.createElement(p);return S.textContent=m,g.append(S),S}function h(g,p,m,S,O){const w=g.ownerDocument,E=f(p.id,m);if(!E)throw Error("Unknown data example: "+m);g.replaceChildren(),g.dataset.dataExample=m;const C=new Map;e.presentation.sampleCaption&&(u(g,"p",e.presentation.sampleCaption).className="data-example-caption");const y=s(p.id)?.capabilities??[],P=O?.capabilityId?y.filter(N=>N.id===O.capabilityId):y;if(O?.capabilityId&&!P.some(N=>N.samples.some(L=>L.id===m)))throw Error("Sample does not belong to capability: "+m);const B=a(p.id,m);g.dataset.capability=B.id;const k=()=>{u(g,"h2",O?.heading?.trim()||B.title),O?.renderSpecification?O.renderSpecification(g):u(g,"p",B.description).className="data-example-capability"};O?.capabilityId&&!O.hideCapability&&k();const M=w.createElement("label");M.className="data-example-picker",u(M,"span","場面");const T=w.createElement("select");T.setAttribute("aria-label","データ例の場面");for(const N of P){let L=T;if(!O?.capabilityId){const W=w.createElement("optgroup");W.label=N.title,T.append(W),L=W}for(const W of N.samples){if(O?.sampleIds&&!O.sampleIds.includes(W.id))continue;const J=w.createElement("option");J.value=W.id,J.textContent=W.name,L.append(J)}}if(T.value=m,T.onchange=()=>S(T.value),M.append(T),(!O?.hideSinglePicker||T.options.length>1)&&g.append(M),!O?.capabilityId&&!O?.hideCapability&&k(),u(g,"h3",E.name).className="data-example-scene",O?.collapseScenario&&E.when){const N=w.createElement("details");N.className="data-example-context",u(N,"summary","場面の背景"),u(N,"p",E.when).className="data-example-when",g.append(N)}else u(g,"p",E.when).className="data-example-when";u(g,"p",E.meaning).className="data-example-meaning";for(const N of E.blocks){const L=w.createElement("section");L.className="data-example-block",L.dataset.exampleCard=N.card,u(L,"h3",p.concepts[N.card].name);const W=w.createElement("div");W.className="data-example-table",W.tabIndex=0,W.setAttribute("role","region"),W.setAttribute("aria-label",p.concepts[N.card].name+"のデータ表");const J=w.createElement("table");J.setAttribute("aria-label",p.concepts[N.card].name+"のデータ例");const ee=w.createElement("caption");ee.textContent=p.concepts[N.card].name+"に入る情報",J.append(ee);const ae=w.createElement("thead"),te=w.createElement("tr");for(const Ve of N.columns)u(te,"th",Ve).setAttribute("scope","col");ae.append(te),J.append(ae);const de=w.createElement("tbody");for(const[Ve,Ce]of N.rows.entries()){const he=w.createElement("tr");for(const[A,R]of Ce.entries()){const _=u(he,"td",String(R)),re=N.keyIds[Ve][A];re&&(d(_,re,C),_.title=N.columns[A]+"："+R)}de.append(he)}J.append(de),W.append(J),L.append(W),N.rows.length||u(L,"p",N.empty??"データはありません。"),g.append(L)}E.note&&(u(g,"p",E.note).className="data-example-note")}return{reviewContents:i,dataExamples:l,contentFor:s,capabilityFor:a,examplesFor:r,findDataExample:f,renderDataExample:h}}function Di(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function Va(e,t,n){return Di(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function Ba(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function ln(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const a=(l,c)=>{for(const d of c.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(d.startsWith("**")&&d.endsWith("**")){const r=document.createElement("strong");r.textContent=d.slice(2,-2),l.append(r)}else if(d.startsWith("`")&&d.endsWith("`")){const r=document.createElement("code");r.textContent=d.slice(1,-1),l.append(r)}else l.append(document.createTextNode(d))};for(const l of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const c=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(l);if(c&&!o){o=c[1],s=void 0;const u=document.createElement("pre");i=document.createElement("code"),u.append(i),n.append(u);continue}if(c&&c[1][0]===o[0]&&c[1].length>=o.length&&!c[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(l+`
`));continue}if(!l.trim()){s=void 0;continue}const d=/^(#{1,6}) (.*)$/.exec(l),r=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(l);if(r){s||(s=document.createElement(/^\s*\d/.test(l)?"ol":"ul"),n.append(s));const u=document.createElement("li");a(u,r[1]),s.append(u);continue}s=void 0;const f=document.createElement(d?"h"+d[1].length:"p");a(f,d?d[2]:l),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const ke={type:"string"},F={type:"string",minLength:1,pattern:"\\S"},z={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Kt=e=>({anyOf:[e,{type:"null"}]}),G=e=>({type:"array",items:e}),X=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),Ga=e=>({$ref:"#/$defs/"+e}),yn=G({anyOf:[X({kind:{enum:["text"]},value:ke}),X({kind:{enum:["reference"]},targetId:z,label:ke}),X({kind:{enum:["link"]},uri:F,label:ke})]}),fs=X({id:z,name:F,scope:{type:"boolean"}}).properties,Ha=X({id:z,kind:{enum:["input","output","business-exception","object-exception"]},fromId:z,toId:z,label:F}),Ja=X({id:z,sourceId:z,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:G(z),unresolvedTargets:G(F),summary:F,content:F}),li=X({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:F,title:F,preface:ke,scope:ke,objects:G(X({...fs,icon:F,information:G(F)})),activities:G(X({...fs,why:F,when:F,who:F,where:F,procedure:F,exception:Kt(F),result:F,problem:Kt(F),painLevel:Kt({enum:["Low","Medium","High"]})})),relations:G(Ha),findings:G(Ja)}),_a=X({id:z,name:F,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Qs=X({...li.properties,schemaVersion:{enum:["0.2"]},roles:G(_a),activities:G(X({...li.properties.activities.items.properties,roleId:Kt(z)}))}),Ka=X({...Qs.properties,schemaVersion:{enum:["0.3"]},exceptions:G(X({id:z,activityId:z,name:F,description:ke}))}),Xa=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,yn])),Za=X({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:F,title:F,basedOn:X({documentId:z,revision:F,verification:{enum:["unverified"]}}),intro:yn,index:G(X({activityId:z,purpose:ke,connections:ke,checkIds:G(z)})),sections:G(X({id:z,activityId:Kt(z),title:F,preamble:yn})),guarantees:G(X({id:z,sectionId:z,title:F,blocks:G({anyOf:[X({kind:{enum:["prose"]},content:yn}),X({kind:{enum:["example"]},exampleId:z})]})})),examples:G(X({id:z,guaranteeId:z,columns:G(F),rows:G(G(yn))})),items:G(X({id:z,checkId:z,title:F,detailSummary:ke,sectionId:z,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:X(Xa,[])})),notes:G(X({id:z,title:F,content:yn}))}),Ni=X({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:F,title:F,basedOn:X({documentId:z,revision:F,verification:{enum:["unverified"]}}),objectId:z,states:G(X({id:z,name:F})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:F,transitions:G(X({id:z,sourceId:F,fromId:F,activityId:z,event:Kt(F),exception:Kt(F),condition:F,toId:F,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:F,note:F}))}),ps=Object.fromEntries(Object.entries({...Ni.properties.transitions.items.properties,exceptionId:Kt(z)}).filter(([e])=>e!=="exception")),Ya=X({...Ni.properties,schemaVersion:{enum:["0.2"]},transitions:G(X({...ps,conditionLabel:F},Object.keys(ps)))}),Pi=X({documentId:z,revision:F,targetType:F,targetId:z,section:F}),Qa=X({id:z,name:F,responsibilityStatus:F,responsibleSubsystemId:z},["id","name"]),ec=X({id:z,name:F,subsystemId:z,information:G(Qa),reason:ke,description:ke,businessObjectIds:G(z),activityLinks:G(X({activityId:z,uses:G(F)})),sourceRefs:G(Pi),reviewState:F}),tc=X({id:z,fromConceptId:z,toConceptId:z,fromPerTarget:F,toPerSource:F,condition:ke,reviewState:F,sourceRefs:G(Pi),fromLabel:F,toLabel:F,kind:{enum:["down","reference"]}}),nc=X({id:z,name:F,purpose:ke,information:G(F),reason:ke,activityIds:G(z),reviewState:F}),oc=X({id:z,fromSubsystemId:z,toSubsystemId:z,information:F,description:ke,activityIds:G(z),flowDirection:{enum:["forward","return"]},reviewState:F}),ic=X({columnId:z,value:{anyOf:[ke,{type:"number"}]},linkId:F},["columnId","value"]),sc=X({card:z,columns:G(X({id:z,name:F,informationId:z})),rows:G(X({id:z,cells:G(ic)})),empty:ke},["card","columns","rows"]),ui=X({id:z,name:F,when:ke,meaning:ke,blocks:G(sc),note:ke},["id","name","when","meaning","blocks"]),fi=X({id:z,title:F,description:ke,meta:{},samples:G(ui)}),rc=X({...ui.properties,checkIds:{...G(z),minItems:1,uniqueItems:!0}},[...ui.required,"checkIds"]),ac=X({decisionExampleIds:G(z),decisionCheckIds:G(z),resultCheckIds:G(z),sampleIds:G(z)}),cc=X({...fi.properties,samples:G(rc),testSpecification:ac},[...Object.keys(fi.properties)]),dc=X({id:z,title:F,description:ke,reason:ke,meta:{}}),lc=X({conceptId:z,name:F,fields:G(F),description:ke,sources:G(F),sourceActivityIds:G(z)}),uc=X({id:z,fromConceptId:z,toConceptId:z,relationIds:G(z),scope:ke,fromLabel:F,toLabel:F,kind:{enum:["down","reference"]}}),fc=X({id:z,conceptId:z,subsystemId:z,name:F,description:ke,sources:G(F),fields:G(X({name:F,informationId:z}))}),pc=X({id:z,fromViewId:z,toViewId:z,relationIds:G(z),fromLabel:F,toLabel:F,kind:{enum:["down","reference"]}}),er=X({nodes:G(fc),edges:G(pc),handoffIds:G(z)}),tr=X({id:z,subsystemId:z,title:F,description:ke,reviewer:X({roleId:z}),relatedActivityIds:G(z),graph:X({conceptIds:G(z),nodes:G(lc),edges:G(uc),subsystemViews:er},["conceptIds","nodes","edges"]),structureStatements:G(X({id:z,title:F,description:ke,sampleIds:G(z),sourceRefs:G(Pi)})),capabilities:G(fi),limitations:G(dc),meta:X({questions:G(F),hypotheses:{}},["questions"])}),mc=X({...tr.properties,capabilities:G(cc)}),nr=X({id:z,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:F,basedOn:X({documentId:z,revision:F,verification:{enum:["unverified"]}}),relatedStates:G(X({documentId:z,revision:F,verification:{enum:["unverified"]}})),subsystems:G(nc),concepts:G(ec),relations:G(tc),handoffs:G(oc),reviewGroups:G(tr),benefits:G(F),considerations:G(F),reviewPoints:G(F),meta:{},presentation:X({activityViews:{},creatorActivityIds:{},sampleCaption:ke,subsystemViews:er,landscapeRelationships:G(X({from:z,to:z})),reviewBoundaries:G(X({from:z,to:z,label:ke,promise:ke}))},["landscapeRelationships","reviewBoundaries"])}),hc=X({...nr.properties,schemaVersion:{enum:["0.2"]},reviewGroups:G(mc)}),so=(e,t)=>X({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:F,documents:G({anyOf:t.map(Ga)}),sources:G(X({documentId:z,revision:F,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:ke})),externalDocuments:G(X({id:z,kind:{enum:["businessDesign"]},revision:F,activities:G(X({id:z,name:F}))})),diagnostics:G(F)}),ms={anyOf:[so("0.1",["businessDesign","checkItems"]),so("0.2",["businessDesign","checkItems","stateTransition"]),so("0.3",["businessDesignRoles","checkItems","stateTransition"]),so("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:li,businessDesignRoles:Qs,businessDesignStructured:Ka,checkItems:Za,stateTransition:Ni,stateTransitionStructured:Ya,conceptModel:nr,checkedConceptModel:hc}},q=(e,t)=>{if(!e)throw Error(t)};function or(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const a=e[t++];if(a==='"')return JSON.parse(e.slice(s,t));a==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{q(s<=64,"JSON depth limit"),n();const a=e[t];if(a==='"'){o();return}if(a==="{"){t++,n();const c=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),q(e[t]==='"',"JSON object key required");const d=o();q(!c.has(d),"Duplicate JSON key: "+d),c.add(d),n(),q(e[t++]===":","JSON colon required"),i(s+1),n();const r=e[t++];if(r==="}")return;q(r===",","JSON comma required")}throw Error("Truncated object")}if(a==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const c=e[t++];if(c==="]")return;q(c===",","JSON array comma required")}throw Error("Truncated array")}const l=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;q(t>l,"JSON value required"),JSON.parse(e.slice(l,t))};return i(),n(),q(t===e.length,"Trailing JSON content"),JSON.parse(e)}function vn(e,t=ms,n="$"){if(t.$ref)return vn(e,ms.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{vn(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&q(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;q(o===t.type,"Invalid type at "+n)}if(t.minLength&&q(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&q(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])q(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))q(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),vn(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>vn(o,t.items,n+"["+i+"]"))}function bc(e){const t=new Map,n=new Map,o=new Map,i=(s,a,l)=>{q(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,a.id),o.set(s.id,l)};for(const s of e.documents){i(s,s,"document");for(const[a,l]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const c of s[a]??[])i(c,s,l)}for(const s of e.externalDocuments){i(s,s,"document");for(const a of s.activities)i(a,s,"activity")}return{map:t,owner:n,types:o}}function pi(e){return vn(e),ir(e)}function Sn(e,t){const n=new Set(e.items.map(a=>a.id)),o=new Set,i=e.guarantees.find(a=>a.id===t.guaranteeId),s=a=>{if(Array.isArray(a)){for(const l of a)s(l);return}if(a&&typeof a=="object"){a.kind==="reference"&&n.has(a.targetId)&&o.add(a.targetId);for(const l of Object.values(a))l&&typeof l=="object"&&s(l)}};s(t.rows);for(const a of i?.blocks??[])a.kind==="prose"&&s(a.content);for(const a of e.items)(a.fields.guarantee??[]).some(c=>c.kind==="reference"&&(c.targetId===t.id||c.targetId===t.guaranteeId))&&o.add(a.id);return[...o]}function ir(e,{allowUnresolvedFindings:t=!1}={}){q(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=bc(e),s=[...e.diagnostics],a=new Set;for(const u of e.sources)if(u.uri){const h=new URL(u.uri);q(h.protocol==="https:"&&!h.username&&!h.password,"Unsafe source URI")}const l=(u,h,g)=>(q(n.has(u),"Dangling reference: "+u),h&&q(i.get(u)===h,"Reference type mismatch: "+u),g&&q(o.get(u)===g,"Cross-document mismatch: "+u),n.get(u)),c=u=>u?.some(h=>h.kind==="text"?h.value.trim().length>0:!0),d=(u,h)=>{for(const g of u)if(g.kind==="reference"&&(l(g.targetId,null,h),q(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const p=new URL(g.uri);q(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe external link")}};for(const u of e.documents)if(q(e.formatVersion!=="0.1"||u.kind!=="stateTransition","State documents require formatVersion 0.2"),u.kind==="businessDesign"){q(u.activities.length>0,"Activity required");const h=[...u.objects,...u.activities].map(m=>m.name);q(new Set(h).size===h.length,"Duplicate visible name"),q(h.every(m=>m===m.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(S=>m.includes(S))),"Invalid Graph-visible name");for(const m of u.objects)q(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.icon),"Invalid icon");if(["0.2","0.3"].includes(u.schemaVersion)){q(new Set(u.roles.map(m=>m.name)).size===u.roles.length,"Duplicate Role name"),q(u.roles.every(m=>m.name===m.name.trim()&&!/[\r\n]/.test(m.name)),"Invalid Role name");for(const m of u.activities)m.roleId!==null?l(m.roleId,"role",u.id):a.add("Role未確定: "+m.id+" — "+m.who)}for(const m of u.activities)q(m.problem===null==(m.painLevel===null),"Problem/Pain pair mismatch");for(const m of u.exceptions??[])l(m.activityId,"activity",u.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},p=new Set;for(const m of u.relations){l(m.fromId,g[m.kind][0],u.id),l(m.toId,g[m.kind][1],u.id);const S=JSON.stringify([m.kind,m.fromId,m.toId,m.label]);q(!p.has(S),"Duplicate relation"),p.add(S)}q(new Set(u.findings.map(m=>m.sourceId)).size===u.findings.length,"Duplicate Finding source ID");for(const m of u.findings){q(m.scope==="items"?m.targetIds.length+m.unresolvedTargets.length>0:!m.targetIds.length&&!m.unresolvedTargets.length,"Finding scope mismatch"),q(new Set(m.targetIds).size===m.targetIds.length,"Duplicate Finding target");for(const S of m.targetIds)l(S,null,u.id),q(["object","activity"].includes(i.get(S)),"Invalid Finding target");m.unresolvedTargets.length&&(q(t,"Unresolved Finding target: "+m.sourceId),s.push("Finding参照未決: "+m.sourceId))}}else if(u.kind==="stateTransition"){const h=l(u.basedOn.documentId,"document");q(h.kind==="businessDesign"&&h.objects,"State source must be an in-package BD"),q(h.revision===u.basedOn.revision,"Stale State source revision"),l(u.objectId,"object",h.id),q(!e.documents.some(p=>p!==u&&p.kind==="stateTransition"&&p.objectId===u.objectId),"Duplicate Object state declaration"),q(u.states.length>0&&new Set(u.states.map(p=>p.name)).size===u.states.length,"Duplicate/empty state names"),q(u.states.every(p=>!p.name.startsWith("@")),"Reserved state name"),q(u.transitions.length<=1e3,"State transition row budget"),q(new Set(u.transitions.map(p=>p.sourceId)).size===u.transitions.length,"Duplicate transition source ID");const g=new Map;for(const p of u.transitions){p.fromId!=="@new"&&l(p.fromId,"state",u.id),["@unknown","@none"].includes(p.toId)||l(p.toId,"state",u.id);const m=l(p.activityId,"activity",h.id),S=JSON.stringify([p.fromId,p.activityId,p.condition.trim().replace(/\s+/gu," ")]);if(q(!g.has(S),"Duplicate state transition condition: "+g.get(S)+" / "+p.sourceId),g.set(S,p.sourceId),e.formatVersion==="0.4")if(q(p.path!=="normal"||p.exceptionId===null,"Normal transition cannot reference an exception"),p.exceptionId!==null){const O=l(p.exceptionId,"exception",h.id);q(O.activityId===m.id,"Exception Activity mismatch")}else p.path==="exception"&&q(s.includes("例外参照未決: "+p.id),"Unresolved exception requires a diagnostic");else q(p.path!=="normal"||p.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+p.id);q(p.effect!=="unchanged"||p.fromId===p.toId,"Unchanged state mismatch"),q(p.effect!=="change"||!p.toId.startsWith("@")&&p.fromId!==p.toId,"Invalid changed state"),q(p.effect!=="no-create"||p.fromId==="@new"&&p.toId==="@none","Invalid no-create transition"),q(p.effect!=="constraint"||p.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+u.id)}else if(u.kind==="conceptModel"){const h=l(u.basedOn.documentId,"document");q(h.kind==="businessDesign"&&h.revision===u.basedOn.revision,"Concept source must be the matching in-package BD revision"),q(!e.documents.some(k=>k!==u&&k.kind==="conceptModel"&&k.basedOn.documentId===h.id),"Duplicate Concept model for Business Design");const g=(k,M)=>{const T=new Map;for(const N of k)q(!T.has(N.id),"Duplicate "+M+" ID: "+N.id),T.set(N.id,N);return T},p=g(u.subsystems,"subsystem"),m=g(u.concepts,"concept"),S=g(u.relations,"concept relation"),O=g(u.reviewGroups,"review group"),w=g(u.handoffs,"handoff"),E=g(u.concepts.flatMap(k=>k.information),"concept information"),C=(k,M,T)=>(q(k.has(M),"Unknown "+T+": "+M),k.get(M)),y=k=>l(k,"activity",h.id),P=k=>{const M=l(k.documentId,"document");q(M.revision===k.revision,"Stale Concept source revision");const T=M.id===h.id,N=M.kind==="stateTransition"&&M.basedOn.documentId===h.id&&u.relatedStates.some(L=>L.documentId===M.id&&L.revision===M.revision);q(T||N,"Concept source must refer to its Business Design or a declared State"),l(k.targetId,k.targetType,M.id)};for(const k of u.relatedStates){const M=l(k.documentId,"document");q(M.kind==="stateTransition"&&M.revision===k.revision&&M.basedOn.documentId===h.id,"Invalid Concept state reference")}for(const k of u.subsystems)for(const M of k.activityIds)y(M);for(const k of u.concepts){C(p,k.subsystemId,"subsystem");for(const M of k.information)M.responsibleSubsystemId&&C(p,M.responsibleSubsystemId,"responsible subsystem");for(const M of k.businessObjectIds)l(M,"object",h.id);for(const M of k.activityLinks)y(M.activityId);for(const M of k.sourceRefs)P(M)}for(const k of u.relations){C(m,k.fromConceptId,"concept"),C(m,k.toConceptId,"concept");for(const M of k.sourceRefs)P(M)}for(const k of u.handoffs){C(p,k.fromSubsystemId,"subsystem"),C(p,k.toSubsystemId,"subsystem"),q(k.fromSubsystemId!==k.toSubsystemId,"Handoff must cross subsystem boundary");for(const M of k.activityIds)y(M)}const B=(k,M)=>{const T=g(k.nodes,"subsystem view"),N=g(k.edges,"subsystem view edge");for(const W of T.values()){C(M,W.conceptId,"view concept"),C(p,W.subsystemId,"subsystem");const J=C(m,W.conceptId,"concept");for(const ee of W.fields)q(J.information.some(ae=>ae.id===ee.informationId),"Unknown information for subsystem view: "+ee.informationId)}for(const W of N.values()){const J=C(T,W.fromViewId,"subsystem view"),ee=C(T,W.toViewId,"subsystem view");q(J.subsystemId===ee.subsystemId,"View relationship crosses subsystem boundary"),q(W.relationIds.length>0,"Subsystem view relationship needs a concept relation");let ae=J.conceptId;for(const te of W.relationIds){const de=C(S,te,"concept relation");q(de.fromConceptId===ae,"Subsystem view relation path is disconnected: "+te),ae=de.toConceptId}q(ae===ee.conceptId,"Subsystem view relation target differs")}q(new Set(k.handoffIds).size===k.handoffIds.length,"Duplicate subsystem view handoff");const L=new Set([...T.values()].map(W=>W.subsystemId));for(const W of k.handoffIds){const J=C(w,W,"handoff");q(L.has(J.fromSubsystemId)&&L.has(J.toSubsystemId),"Missing subsystem view handoff region: "+W)}};u.presentation.subsystemViews&&B(u.presentation.subsystemViews,m);for(const k of u.reviewGroups){C(p,k.subsystemId,"subsystem"),l(k.reviewer.roleId,"role",h.id);for(const L of k.relatedActivityIds)y(L);const M=g(k.graph.nodes.map(L=>({...L,id:L.conceptId})),"view concept");q(new Set(k.graph.conceptIds).size===k.graph.conceptIds.length&&k.graph.conceptIds.length===M.size&&k.graph.conceptIds.every(L=>M.has(L)),"View concepts and nodes differ");for(const L of k.graph.nodes){C(m,L.conceptId,"concept");for(const W of L.sourceActivityIds)y(W)}g(k.graph.edges,"view edge");for(const L of k.graph.edges){C(M,L.fromConceptId,"view concept"),C(M,L.toConceptId,"view concept");for(const W of L.relationIds)C(S,W,"concept relation")}k.graph.subsystemViews&&B(k.graph.subsystemViews,M);const T=g(k.capabilities,"capability"),N=g(k.capabilities.flatMap(L=>L.samples),"sample");g(k.limitations,"limitation"),g(k.structureStatements,"structure statement");for(const L of k.structureStatements){for(const W of L.sampleIds)C(N,W,"sample");for(const W of L.sourceRefs)P(W)}for(const L of T.values())if(L.testSpecification){const W=L.testSpecification;for(const[ee,ae]of Object.entries(W))q(new Set(ae).size===ae.length,"Duplicate function specification reference: "+ee);const J=(ee,ae)=>{const te=l(ee,ae),de=l(o.get(ee),"document");return q(de.kind==="checkItems"&&de.basedOn.documentId===h.id&&de.basedOn.revision===h.revision,"Function Check source mismatch: "+ee),{value:te,doc:de}};for(const ee of[...W.decisionCheckIds,...W.resultCheckIds])J(ee,"check");for(const ee of W.decisionExampleIds){const{value:ae,doc:te}=J(ee,"example"),de=Sn(te,ae);q(de.length>0,"Function decision table needs a Check: "+ee),q(de.every(Ve=>W.decisionCheckIds.includes(Ve)),"Function decision table Check is not assigned: "+ee)}for(const ee of W.sampleIds){const ae=L.samples.find(te=>te.id===ee);q(ae,"Function result sample belongs to another capability: "+ee),q(ae.checkIds.some(te=>W.resultCheckIds.includes(te)),"Function result sample needs a result Check: "+ee),q(ae.checkIds.every(te=>W.resultCheckIds.includes(te)||W.decisionCheckIds.includes(te)),"Function result sample Check is not assigned: "+ee)}}for(const L of T.values())for(const W of L.samples){if(u.schemaVersion==="0.2"){q(W.checkIds.length>0,"Sample needs a Check: "+W.id),q(new Set(W.checkIds).size===W.checkIds.length,"Duplicate sample Check: "+W.id);for(const J of W.checkIds){l(J,"check");const ee=l(o.get(J),"document");q(ee.kind==="checkItems"&&ee.basedOn.documentId===h.id&&ee.basedOn.revision===h.revision,"Sample Check source mismatch: "+J)}}for(const J of W.blocks){C(M,J.card,"view concept");const ee=g(J.columns,"sample column");for(const ae of J.columns)C(E,ae.informationId,"concept information");g(J.rows,"sample row");for(const ae of J.rows){const te=new Set;for(const de of ae.cells)C(ee,de.columnId,"sample column"),q(!te.has(de.columnId),"Duplicate sample cell: "+de.columnId),te.add(de.columnId);q(te.size===ee.size,"Sample row does not match columns")}}}}for(const k of u.presentation.landscapeRelationships){const M=C(O,k.from,"review group"),T=C(O,k.to,"review group");q(M.subsystemId===T.subsystemId,"Internal relationship crosses subsystem boundary")}for(const k of u.presentation.reviewBoundaries)C(O,k.from,"review group"),C(O,k.to,"review group");s.push("概念モデルの業務意味は未確認: "+u.id)}else{const h=l(u.basedOn.documentId,"document");q(h.kind==="businessDesign","Check source is not BD"),q(h.revision===u.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+u.id),q(new Set(u.items.map(m=>m.checkId)).size===u.items.length,"Duplicate Check ID");const g=new Set;for(const m of u.index){l(m.activityId,"activity",h.id),q(!g.has(m.activityId),"Duplicate Activity index"),g.add(m.activityId),q(new Set(m.checkIds).size===m.checkIds.length,"Duplicate Check binding");for(const S of m.checkIds)l(S,"check",u.id)}q(new Set(u.sections.map(m=>m.activityId??m.title)).size===u.sections.length,"Duplicate Activity section");for(const m of u.sections)m.activityId!==null&&(l(m.activityId,"activity",h.id),q(g.has(m.activityId),"Section missing from index")),d(m.preamble,u.id);const p=new Set(e.documents.filter(m=>m.kind==="conceptModel"&&m.basedOn.documentId===h.id&&m.basedOn.revision===h.revision).flatMap(m=>m.reviewGroups.flatMap(S=>S.capabilities.flatMap(O=>O.testSpecification?.decisionExampleIds??[]))));for(const m of u.guarantees){const S=m.blocks.length>0&&m.blocks.every(O=>O.kind==="example"&&p.has(O.exampleId)&&u.examples.some(w=>w.id===O.exampleId&&w.guaranteeId===m.id&&Sn(u,w).length>0));q(m.blocks.some(O=>O.kind==="prose"&&c(O.content))||S,"General guarantee prose required"),l(m.sectionId,"section",u.id);for(const O of m.blocks)if(O.kind==="prose")d(O.content,u.id);else{const w=l(O.exampleId,"example",u.id);q(w.guaranteeId===m.id,"Example owner mismatch")}}for(const m of u.examples){l(m.guaranteeId,"guarantee",u.id),q(m.columns.length>0,"Example columns required");for(const S of m.rows){q(S.length===m.columns.length,"Example column mismatch");for(const O of S)d(O,u.id)}}for(const m of u.items){const S=l(m.sectionId,"section",u.id);q(S.activityId===null?!u.index.some(O=>O.checkIds.includes(m.id)):u.index.some(O=>O.activityId===S.activityId&&O.checkIds.includes(m.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),q(c(m.fields.guarantee)||c(m.fields.condition)&&c(m.fields.expectedResult),"Check guarantee required");for(const O of Object.values(m.fields))d(O,u.id);q(S.activityId===null||u.index.some(O=>O.checkIds.includes(m.id)),"Unbound Check")}for(const m of u.notes)d(m.content,u.id);d(u.intro,u.id)}const r=e.diagnostics.filter(u=>u.startsWith("Role未確定:"));q(new Set(r).size===r.length,"Duplicate unresolved Role diagnostic");for(const u of r)q(a.delete(u),"Unresolved Who requires a diagnostic matching a current unresolved Activity");q(a.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const u of e.sources){l(u.documentId,"document");const h=u.documentId+"@"+u.revision;q(!f.has(h),"Duplicate source descriptor"),f.add(h)}for(const u of e.externalDocuments)q(e.sources.some(h=>h.documentId===u.id&&h.revision===u.revision),"External source revision missing"),q(u.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+u.id);return{diagnostics:s,entities:n.size}}const Z=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function hs(e,t,n){n!=null&&e.append(Z("h3",t),ln(n))}function gc(e,t,n){if(t===null)return;const o=ln(t),i=a=>String(a??"").replace(/\s+/g,""),s=new Set(n.map(a=>i(ln(`**${a.name}** — ${a.description}`).textContent)));for(const a of Array.from(o.querySelectorAll("li")))s.has(i(a.textContent))&&a.remove();for(const a of Array.from(o.querySelectorAll("ul,ol")))a.children.length||a.remove();o.textContent?.trim()&&e.append(Z("h3","Exception"),o)}const yc={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function vc(e,t){const n=Z("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(l=>l.id===t),a=i.activities.find(l=>l.id===t);if(s){hs(n,"Scope",String(s.scope)),n.append(Z("h3","Information"));const l=Z("ul");for(const c of s.information)l.append(Z("li",c));n.append(l)}else if(a){const l=i.exceptions?.filter(d=>d.activityId===a.id)??[];for(const[d,r]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Exception","exception"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]])r==="exception"?gc(n,a.exception,l):hs(n,d,r==="who"?Di(e,a.id)?.name??a.who:a[r]===null?null:String(a[r]));for(const d of l)n.append(Z("h3",d.name),ln(d.description));const c=new Map([...i.objects,...i.activities].map(d=>[d.id,d.name]));for(const[d,r]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const f=i.relations.filter(u=>u.kind===d&&(u.fromId===t||u.toId===t));if(f.length){n.append(Z("h3",r));for(const u of f)n.append(Z("p",`${c.get(u.fromId)} → ${c.get(u.toId)} — ${u.label}`))}}}else n.append(Z("p","項目を選択すると業務内容を表示します。"));return n}class _n{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(Z("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(ln(i.value));continue}if(i.kind==="text"){const c=Z("span",i.value);c.style.whiteSpace="pre-wrap",t.append(c);continue}if(i.kind==="link"){t.append(Z("span",`${i.label} (${i.uri})`));continue}const s=Z("details"),a=Z("summary",i.label||i.targetId);s.append(a),t.append(s);let l=!1;s.addEventListener("toggle",()=>{if(!s.open||l)return;if(l=!0,o.has(i.targetId)){s.append(Z("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(Z("p","参照の深さの上限です。続きは原文で確認してください。"));return}const c=new Set(o).add(i.targetId),d=this.doc,r=d.guarantees.find(p=>p.id===i.targetId),f=d.examples.find(p=>p.id===i.targetId),u=d.items.find(p=>p.id===i.targetId),h=d.sections.find(p=>p.id===i.targetId),g=d.notes.find(p=>p.id===i.targetId);if(r){s.append(Z("h4",r.title));for(const p of r.blocks){if(!this.take(s))break;p.kind==="prose"?this.runs(s,p.content,c):this.example(s,p.exampleId,c)}}else if(f)this.example(s,f.id,c);else if(u){s.append(Z("p",`${u.checkId} · ${u.title}`+(this.requester?"":` · ${u.reviewState}`))),this.requester&&(u.reviewState==="要確認"||u.reviewState==="要修正")&&s.append(Z("p","確認が必要です。"));const p=this.requester?Object.fromEntries(Object.entries(u.fields).filter(([m])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(m))):u.fields;this.fields(s,p,c)}else h?(s.append(Z("h4",h.title)),this.runs(s,h.preamble,c)):g?(s.append(Z("h4",g.title)),this.runs(s,g.content,c)):i.targetId===d.id&&(s.append(Z("h4",d.title)),this.runs(s,d.intro,c))})}}fields(t,n,o,i=!1){for(const[s,a]of Object.entries(n)){if(!this.take(t))break;if(t.append(Z("h4",yc[s]??s)),s==="guarantee"&&i){const l=new Set;for(const c of a){const d=c.kind==="reference"?this.doc.guarantees.find(f=>f.id===c.targetId):void 0;if(!d){this.runs(t,[c],o);continue}if(l.has(d.id))continue;l.add(d.id);const r=new Set(o).add(d.id);for(const f of d.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,r):this.example(t,f.exampleId,r)}}}else this.runs(t,a,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!Sn(this.doc,s).length)return;const a=Z("table"),l=i?s.columns.indexOf("結果"):-1,c=l>0&&s.columns.at(-1)==="Check ID";if(c){const f=Z("colgroup");f.span=l,a.append(f);for(let m=l;m<s.columns.length;m++)a.append(Z("colgroup"));const u=Z("thead"),h=Z("tr"),g=Z("th","条件");g.colSpan=l,g.scope="colgroup",h.append(g);for(let m=l;m<s.columns.length;m++){const S=Z("th",s.columns[m]);S.rowSpan=2,S.scope="col",m===l?S.className="decision-result":s.columns[m]==="備考"&&(S.className="decision-notes"),h.append(S)}const p=Z("tr");for(const m of s.columns.slice(0,l)){const S=Z("th",m);S.scope="col",p.append(S)}u.append(h,p),a.append(u)}else{const f=Z("tr");for(const u of s.columns){if(!this.take(t))break;f.append(Z("th",u))}a.append(f)}const d=c?Z("tbody"):a;for(const f of s.rows){if(!this.take(t))break;const u=Z("tr");for(const[h,g]of f.entries()){if(!this.take(t))break;const p=Z("td");if(c&&h===l?p.className="decision-result":c&&s.columns[h]==="備考"&&(p.className="decision-notes"),i)for(const m of g){const S=m.kind==="reference"?this.doc.items.find(O=>O.id===m.targetId):void 0;S?p.append(Z("span",S.checkId)):this.runs(p,[m],o)}else this.runs(p,g,o);u.append(p)}d.append(u)}c&&a.append(d);const r=Z("div");r.className="json-example",r.append(a),t.append(r)}}function bs(e,t,n=e.model.checks,o=new Set,i=new Set){const s=Z("section");s.className="check-content json-checks";const a=e.model.business,l=n.filter(d=>d.basedOn.documentId===a.id);let c=!1;for(const d of l){const r=new _n(d),f=d.index.filter(p=>p.activityId===t),u=new Set(d.index.flatMap(p=>p.checkIds)),h=(t?[...new Set(f.flatMap(p=>p.checkIds))]:d.items.filter(p=>!u.has(p.id)).map(p=>p.id)).filter(p=>!o.has(p)),g=d.sections.filter(p=>t?p.activityId===t:p.activityId===null);for(const p of g){(p.preamble.length||d.guarantees.some(m=>m.sectionId===p.id&&!i.has(m.id)))&&(c=!0),r.runs(s,p.preamble);for(const m of d.guarantees.filter(S=>S.sectionId===p.id&&!i.has(S.id)))r.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}for(const p of h){const m=d.items.find(w=>w.id===p);if(!m)continue;c=!0;const S=Z("section");S.className="check-item",S.dataset.checkId=m.checkId,S.dataset.elementId=m.id,S.append(Z("h3",m.checkId+" · "+m.title)),(m.reviewState==="要確認"||m.reviewState==="要修正")&&S.append(Z("p","確認が必要です。"));const O=Object.fromEntries(Object.entries(m.fields).filter(([w])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(w)));r.fields(S,O,new Set([m.id])),s.append(S)}if(!t)for(const p of d.notes)c=!0,r.runs(s,[{kind:"reference",targetId:p.id,label:p.title}])}return c||s.append(Z("p","この業務のテスト仕様はありません。")),s}function wc(e,t,n=e.model.checks){const o=Z("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const a of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new _n(a);for(const c of a.items.filter(d=>s.has(d.id))){const d=Z("section");d.className="check-item",d.dataset.checkId=c.checkId,d.dataset.elementId=c.id,d.append(Z("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&d.append(Z("p","確認が必要です。"));const r=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));l.fields(d,r,new Set([c.id]),!0),o.append(d)}}return o}const kc=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function Ic(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(kc,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Sc(e,t,n=e.model.checks){const o=Z("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const a of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=a.examples.find(g=>g.id===s);if(!l||!Sn(a,l).length)continue;const c=new _n(a,!0),d=a.guarantees.find(g=>g.id===l.guaranteeId),r=Z("section");r.dataset.decisionExample=s;for(const g of d?.blocks??[])g.kind==="prose"&&c.runs(r,Ic(g.content),new Set([d.id]));l.rows.length>1&&r.append(Z("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=l.columns.indexOf("結果"),u=f>0?f:l.columns.length;l.rows.some(g=>g.slice(0,u).some(p=>p.some(m=>m.kind==="text"&&/^\s*[-‐]\s*$/.test(m.value))))&&r.append(Z("p","‐＝値不問。")),c.example(r,s,new Set([s]),!0),o.append(r)}return o}function xc(e,t,n=e.model.checks){const o=Z("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const a of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new _n(a,!0);for(const c of a.items.filter(d=>s.has(d.id))){const d=Z("section");d.className="check-item",d.dataset.checkId=c.checkId,d.dataset.elementId=c.id,d.append(Z("h3",c.checkId+" · "+c.title)),(c.reviewState==="要確認"||c.reviewState==="要修正")&&d.append(Z("p","確認が必要です。")),c.fields.condition?.length&&(d.append(Z("h4","条件")),l.runs(d,c.fields.condition,new Set([c.id])));const r=Object.fromEntries(Object.entries(c.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(r).length){const f=Z("details");f.append(Z("summary","期待結果")),l.fields(f,r,new Set([c.id]),!0),d.append(f)}o.append(d)}}return o}function Ac(e,t,n=e.model.checks,o=new Set){const i=Z("section");i.className="check-content json-checks result-checks";const s=e.model.business,a=new Set(t);for(const l of n.filter(c=>c.basedOn.documentId===s.id&&c.basedOn.revision===s.revision)){const c=new _n(l,!0),d=l.items.filter(r=>a.has(r.id)&&o.has(r.id)&&r.reviewState!=="要確認"&&r.reviewState!=="要修正"&&!r.fields.question?.length&&!r.fields.alternatives?.length);d.length&&i.append(Z("p",d.map(r=>r.checkId).join("、")));for(const r of l.items.filter(f=>a.has(f.id))){if(d.includes(r))continue;const f=Z("section");f.className="check-item",f.dataset.checkId=r.checkId,f.dataset.elementId=r.id,f.append(Z("h3",r.checkId)),(r.reviewState==="要確認"||r.reviewState==="要修正")&&f.append(Z("p","確認が必要です。"));const u=Object.fromEntries(Object.entries(r.fields).filter(([p])=>["expectedResult","guarantee","question","alternatives"].includes(p)));c.fields(f,u,new Set([r.id]),!0);const h=Z("details"),g=Z("summary","Check の詳細");h.append(g,Z("p",r.title)),r.fields.condition?.length&&c.runs(h,r.fields.condition,new Set([r.id])),f.append(h),i.append(f)}}return i}const gs=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Ec(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(r=>r.id)),o=[],i=new Set,s=new Set,a=t.filter(r=>r.basedOn.documentId===e.business.id&&r.basedOn.revision===e.business.revision),l=(r,f)=>a.some(u=>u.items.some(h=>h.id===r)&&(!f||u.index.some(h=>h.activityId===f&&h.checkIds.includes(r)))),c=(r,f,u,h)=>{const g=f.testSpecification,p=(g?.decisionCheckIds??[]).filter(y=>l(y,u)),m=(g?.resultCheckIds??[]).filter(y=>l(y,u)),S=(g?.decisionExampleIds??[]).filter(y=>a.some(P=>{const B=P.examples.find(M=>M.id===y),k=B?Sn(P,B):[];return k.length>0&&k.every(M=>l(M,u))})),O=f.samples.filter(y=>(!g||g.sampleIds.includes(y.id))&&y.checkIds?.length&&(g?y.checkIds.every(P=>l(P,u)):y.checkIds.some(P=>l(P,u)))),w=S.flatMap(y=>a.flatMap(P=>{const B=P.examples.find(k=>k.id===y);return B?Sn(P,B).filter(k=>l(k,u)):[]})),E=[...new Set([...p,...m,...w,...O.flatMap(y=>(y.checkIds??[]).filter(P=>l(P,u)))])];if(!E.length)return;const C=`fn:${u??"_"}:${r}:${f.id}`;s.has(C)||(s.add(C),o.push({key:C,activityId:u,groupId:r,capability:f,name:h,samples:O,checkIds:E,decisionCheckIds:p,resultCheckIds:m,decisionExampleIds:S,decisionTableCheckIds:[...new Set(w)]}))},d=e.model.presentation.activityViews;if(Array.isArray(d)){for(const r of d)if(!(!gs(r)||typeof r.activityId!="string"||!n.has(r.activityId)||!Array.isArray(r.testSpecificationFunctions)))for(const f of r.testSpecificationFunctions){if(!gs(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const u=e.model.reviewGroups.find(g=>g.id===f.groupId),h=u?.capabilities.find(g=>g.id===f.capabilityId);!u||!h||(i.add(JSON.stringify([u.id,h.id])),c(u.id,h,r.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():h.title))}}for(const r of e.model.reviewGroups)for(const f of r.capabilities)i.has(JSON.stringify([r.id,f.id]))||c(r.id,f,void 0,f.title);return o}function ys(e,t,n,o){const i=e.filter(a=>a.groupId===t&&a.capability.id===n),s=i.find(a=>a.samples.some(l=>l.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const a of i){if(!a.capability.testSpecification)continue;const l=a.capability.samples.find(d=>d.id===o),c=a.decisionExampleIds.length?a.decisionTableCheckIds:a.decisionCheckIds;if(l?.checkIds?.some(d=>c.includes(d)))return{kind:"decision",key:"decision:"+a.key}}}const bn=["landscape","overview"];function Oc(e,t){const n=e.querySelector(".workspace");n.querySelector("main");const o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const a=document.createElement("aside");a.id="design-explorer",a.setAttribute("aria-label","設計ナビゲーション"),a.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav>';const l=document.createElement("div");l.className="shell-center",s.append(a,l),l.append(o,n);const c=document.createElement("div");c.className="shell-open-tabs",i.before(c),c.append(i),ja(c);const d=document.createElement("nav");d.className="concept-tabs",d.setAttribute("aria-label","開いているサブシステムとデータ構造"),c.append(d);const r=document.createElement("nav");r.className="state-tabs",r.setAttribute("aria-label","開いている状態遷移"),c.append(r);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),c.append(f);const u=document.createElement("section");u.id="concept-workspace",u.hidden=!0,u.setAttribute("aria-label","データ構造"),u.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',l.append(u);const h=document.createElement("section");h.id="states-workspace",h.hidden=!0,h.setAttribute("aria-label","状態遷移"),h.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',l.append(h);const g=document.createElement("section");g.id="tests-workspace",g.hidden=!0,g.setAttribute("aria-label","テスト仕様"),g.innerHTML='<main class="test-spec-page"></main>',l.append(g);const p=document.createElement("section");p.id="empty-workspace",p.hidden=!0,p.innerHTML="<p>左の一覧から図を開いてください。</p>",l.append(p);const m=n.querySelector("#node-list-drawer");a.append(m);const S=e.querySelector("#node-list-toggle"),O=e.querySelector("#drawer"),w=a.querySelector("input"),E=a.querySelector("nav"),C=u.querySelector("iframe"),y=u.querySelector(".concept-related"),P=h.querySelector("article"),B="alder-explorer-v1:"+location.pathname,k=location.protocol==="file:"||location.origin==="null"?"*":location.origin,M=window.__alderConceptHtml;let T,N,L,W,J={},ee=[],ae=[...bn],te=new Map,de=new Map,Ve=new Map,Ce=new Map;const he=b=>Ve.get(b)??b,A=b=>Ce.get(b)??b,R=b=>N?.findGroup(te.get(b??"")),_=b=>L?.contentFor(te.get(b)??""),re=(b,I)=>L?.findDataExample(te.get(b)??"",I),Y=b=>L?.examplesFor(te.get(b)??"")??[],ve=b=>bn.includes(b)?"全体図":_(b)?.title??R(b)?.name??J[de.get(b)??""]?.name,le=()=>{const b=t.business(),I=b.design?.model;return I?[...I.checks,...b.relatedChecks??[]].filter(j=>j.basedOn.documentId===I.business.id):[]},be=()=>Ec(T,le()),se=b=>be().find(I=>I.key===(b.startsWith("decision:")?b.slice(9):b)),je=b=>be().filter(I=>I.name===b.name).length>1?b.name+"（"+(t.business().activities.find(I=>I.id===b.activityId)?.name??"その他")+"）":b.name,Ne=b=>le().some(I=>I.index.some(j=>j.activityId===b)||I.sections.some(j=>j.activityId===b)),Pe=b=>new Set(be().filter(I=>I.activityId===b).flatMap(I=>I.checkIds)),zt=b=>{const I=new Set(be().filter(j=>j.activityId===b).flatMap(j=>j.decisionExampleIds));return new Set(le().flatMap(j=>j.examples.filter(D=>I.has(D.id)).map(D=>D.guaranteeId)))},Qt=b=>{const I=Pe(b),j=zt(b);return le().some(D=>D.index.some(H=>H.activityId===b&&H.checkIds.some(Q=>!I.has(Q)))||D.sections.some(H=>H.activityId===b&&(H.preamble.length>0||D.guarantees.some(Q=>Q.sectionId===H.id&&!j.has(Q.id)))))},en=()=>le().some(b=>b.items.some(I=>!b.index.some(j=>j.checkIds.includes(I.id)))||b.sections.some(I=>I.activityId===null)||b.notes.length>0),Wr=b=>{const I=se(b);return I?I.capability.testSpecification?je(I)+"・"+(b.startsWith("decision:")?"可否":"結果"):I.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(j=>j.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(j=>j.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},Yn=n.querySelector("#formattedMarkdownDrawer");Yn&&s.append(Yn),s.append(y),qa(y,s,B+":drawer-width");let Qn=!1;const yt=t.rightDrawer??{isOpen:()=>Qn,setOpen:b=>{Qn=b}};let ie="business",Le=!1,Ke=[],U="overview",Xe=[],it="",st=[],Ee="@overview",mn,Ct=innerWidth>800,eo=!1,to=!0,rt=!1,Rn;const at=new Map,ft=new Map([["overview",C]]),nt=new Map,tn=new Map,nn=new Map,Re=new Map,Ut=new Map,pt=new Set,We=new Set,on=new Set,$e=new Map;let ge;try{if(ge=JSON.parse(sessionStorage.getItem(B)||"null"),ge){if(rt=ge.overviewClosed===!0,Rn=typeof ge.documentKey=="string"?ge.documentKey:void 0,Ct=typeof ge.left=="boolean"?ge.left:Ct,Array.isArray(ge.expanded)){We.clear();for(const b of ge.expanded)typeof b=="string"&&We.add(b)}Xe=Array.isArray(ge.states)?ge.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof ge.rightOpen=="boolean"?Qn=ge.rightOpen:typeof ge.right?.["concept:"+ge.active]=="boolean"&&(Qn=ge.right["concept:"+ge.active]))}}catch{}function zr(){if(!(!ge||Rn!==t.business().key||!Le)){for(const b of Array.isArray(ge.overviewModes)?ge.overviewModes:[])R(b)&&pt.add(b);for(const[b,I]of Object.entries(ge.lastExamples??ge.examples??{}))typeof I=="string"&&re(b,I)&&Ut.set(b,I);for(const[b,I]of Object.entries(ge.examples??{}))typeof I=="string"&&re(b,I)&&Re.set(b,I);for(const[b,I]of Object.entries(ge.selected??{}))typeof I=="string"&&ee.includes(I)&&nt.set(b,I);Ke=[...new Set((Array.isArray(ge.concepts)?ge.concepts:[]).filter(b=>typeof b=="string"&&ae.includes(b)))],U=Ke.includes(ge.active)?ge.active:"landscape"}}let sn;const ze=()=>{try{sessionStorage.setItem(B,JSON.stringify({documentKey:mn,overviewClosed:rt,selected:Object.fromEntries(nt),examples:Object.fromEntries(Re),lastExamples:Object.fromEntries(Ut),overviewModes:[...pt],left:Ct,expandedVersion:4,expanded:[...We],concepts:Ke,active:U,states:Xe,specs:st,activeSpec:Ee,specExamples:Object.fromEntries(at),...t.rightDrawer?{}:{rightOpen:yt.isOpen()}}))}catch{}},$t=()=>{ie==="concept"&&$e.set("drawer:"+U,y.querySelector(".concept-drawer-body").scrollTop),ie==="concept"&&yt.isOpen()&&pt.has(U)&&$e.set("review-overview:"+U,y.querySelector(".data-review-overview").scrollTop),ie==="concept"&&Re.has(U)&&$e.set("example:"+U+":"+Re.get(U),y.querySelector(".data-examples-panel").scrollTop),ie==="states"&&it&&$e.set("state:"+it,P.scrollTop),ie==="tests"&&$e.set("tests:"+Ee,g.querySelector(".test-spec-page").scrollTop),ie==="concept"&&U==="landscape"&&$e.set("concept:landscape",u.querySelector(".concept-review-landscape").scrollTop)};function Be(b=!0){if(eo)return;const I=new URL(location.href);if(I.searchParams.set("view",ie),I.searchParams.delete("concept"),I.searchParams.delete("dataExample"),I.searchParams.delete("dataView"),ie==="concept"&&yt.isOpen()&&pt.has(U)?I.searchParams.set("dataView","overview"):ie==="concept"&&R(U)&&!Re.has(U)&&I.searchParams.set("dataView","structure"),ie==="concept"&&yt.isOpen()&&Re.has(U)&&I.searchParams.set("dataExample",Re.get(U)),ie==="tests"&&at.has(Ee)&&I.searchParams.set("dataExample",at.get(Ee)),I.searchParams.delete("state"),I.searchParams.delete("activity"),I.searchParams.delete("object"),I.searchParams.delete("spec"),ie==="concept"&&I.searchParams.set("concept",U),ie==="states"&&it&&I.searchParams.set("state",it),ie==="tests"&&I.searchParams.set("spec",Ee),ie==="business"){const j=t.business(),D=j.views?.find(H=>H.key===j.viewKey);D?.activity?I.searchParams.set("activity",D.activity):D?.object&&I.searchParams.set("object",D.object)}I.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",I)}function De(b,I,j){const D=document.createElement(I);return D.textContent=j,b.append(D),D}function ct(b){b!==ie&&(ie==="business"?t.capture():$t(),ie=b),n.hidden=ie!=="business",u.hidden=ie!=="concept",h.hidden=ie!=="states",g.hidden=ie!=="tests",p.hidden=ie!=="empty",e.dataset.workspaceArea=ie,ie==="business"&&t.refresh(),vt(),dt()}function rn(b,I=!0){Le&&(b==="subsystems"&&(b="landscape"),ae.includes(b)&&($t(),Ke.includes(b)||Ke.push(b),U=b,ct("concept"),Xo(),mt(),ze(),I&&Be()))}function Ur(){$t(),Re.delete(U),pt.add(U),Xo(),y.querySelector(".concept-drawer-body").scrollTop=$e.get("drawer-overview:"+U)??0,ze(),Be()}function $r(b,I=!0){if(b&&!re(U,b))return;const j=!Re.has(U),D=y.querySelector(".concept-drawer-body");j&&$e.set("drawer-overview:"+U,D.scrollTop),$t(),pt.delete(U),b?(Re.set(U,b),Ut.set(U,b)):Re.delete(U),yt.setOpen(!0),Xo(),j&&(D.scrollTop=0),ze(),Be(),I&&y.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}y.querySelector(".concept-example-back").onclick=()=>{Ur(),y.querySelector(".data-review-overview").focus({preventScroll:!0})};function Dn(b,I=!0){t.business().states?.some(j=>j.id===b)&&($t(),Xe.includes(b)||Xe.push(b),it=b,ct("states"),Jr(),mt(),ze(),I&&Be())}function Go(b){return b.startsWith("decision:")&&se(b)&&!se(b)?.capability.testSpecification?se(b).key:se(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&Ne(b.slice(7))||b.startsWith("remaining:")&&Qt(b.slice(10))?b:t.business().activities.some(I=>I.id===b)?be().find(I=>I.activityId===b)?.key??(Ne(b)?"checks:"+b:"@overview"):"@overview"}function an(b,I=!0){const j=t.business();if(!j.design?.model||!j.key)return;b=Go(b),ie==="tests"&&b!==Ee&&$t(),st.includes(b)||st.push(b),Ee=b;const D=se(b);eo||(D?.capability.testSpecification?We.add("tests-function-"+D.key):D?.activityId?We.add("tests-activity-"+D.activityId):b.startsWith("checks:")?We.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?We.add("tests-activity-"+b.slice(10)):D&&We.add("tests-other")),ct("tests"),Ho(),mt(),dt(),ze(),I&&Be()}function Ho(){const b=t.business().design;if(!b?.model)return;const I=g.querySelector(".test-spec-page"),j=se(Ee);if(j){const D=document.createElement("section");D.className="test-spec-sample";const H=N?.findGroup(j.groupId),Q=j.samples.find(we=>we.id===at.get(Ee))??j.samples[0],V=!!j.capability.testSpecification,ue=Ee.startsWith("decision:");if(V)if(De(D,"h2",j.name),De(D,"h3",ue?"可否判定":"処理結果"),ue)j.decisionExampleIds.length?D.append(Sc(b,j.decisionExampleIds,le())):j.decisionCheckIds.length?D.append(xc(b,j.decisionCheckIds,le())):De(D,"p","可否条件の記載はありません。");else{const we=H&&Q&&L?new Set(j.samples.flatMap(Oe=>Oe.checkIds??[])):new Set;if(D.append(Ac(b,j.resultCheckIds,le(),we)),H&&Q&&L){De(D,"h3","データ例");const Oe=document.createElement("div");Oe.className="data-examples-panel test-spec-examples",D.append(Oe),L.renderDataExample(Oe,H,Q.id,He=>{$e.set("tests:"+Ee,I.scrollTop),at.set(Ee,He),Ho(),ze(),Be(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:j.capability.id,sampleIds:j.samples.map(He=>He.id),hideCapability:!0,hideSinglePicker:!0})}}else if(H&&Q&&L){const we=document.createElement("div");we.className="data-examples-panel test-spec-examples",D.append(we),L.renderDataExample(we,H,Q.id,Oe=>{$e.set("tests:"+Ee,I.scrollTop),at.set(Ee,Oe),Ho(),ze(),Be(),g.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:j.capability.id,heading:j.name,sampleIds:j.samples.map(Oe=>Oe.id),renderSpecification:Oe=>Oe.append(wc(b,Q.checkIds??[],le()))})}I.replaceChildren(D)}else if(Ee==="@overview")I.replaceChildren(),De(I,"p","左のメニューからテスト仕様を選択してください。");else if(Ee.startsWith("remaining:")){const D=Ee.slice(10);I.replaceChildren(bs(b,D,le(),Pe(D),zt(D)))}else I.replaceChildren(bs(b,Ee.startsWith("checks:")?Ee.slice(7):void 0,le()));I.scrollTop=$e.get("tests:"+Ee)??0}function Jo(b){b||(rt=!1),ct("business"),b?t.openActivity(b):(rt=!1,t.openOverview()),dt(),mt(),Be()}function Fr(b){ct("business"),t.openObject(b),dt(),mt(),Be()}function Vr(b,I){De(b,"h3",R(U)?"関連する業務":"作成する業務");const j=t.business(),D=R(U),H=T?.model.concepts.find(V=>V.id===I),Q=D?.concepts[I]?.sourceActivities??D?.activities??H?.activityLinks.filter(V=>V.uses.includes("生成")).map(V=>V.activityId)??[];for(const V of Q){const ue=j.activities.find(Oe=>Oe.id===V);if(!ue)continue;const we=document.createElement("button");we.className="shell-evidence",De(we,"span",ue.name),we.append(Et(Jn,{"aria-hidden":"true","stroke-width":1.8,"data-icon":"square-arrow-out-up-right"})),we.title=ue.name+"を業務タブで開く",we.setAttribute("aria-label",we.title),we.onclick=()=>Jo(ue.id),b.append(we)}}function _o(b){const I=R(b);return I?N?.graph(I.id):b==="overview"?N?.overviewGraph():void 0}function ts(b){const I=tn.get(U),j=I?_o(U)?.tables[I]:void 0;return j?.conceptId===b?j:void 0}function Br(b,I){const j=ts(I)??R(U)?.concepts[I]??{...J[I],sources:void 0};b.replaceChildren(),De(b,"p",j.note),De(b,"h3","持つ情報");const D=document.createElement("ul");for(const[,H]of j.fields)De(D,"li",H);if(b.append(D),j.sources?.length){De(b,"h3","情報の出所・対象時点");const H=document.createElement("ul");for(const Q of j.sources)De(H,"li",Q);b.append(H)}Vr(b,I)}function Ko(b){const I=y.querySelector(".shell-heading strong");I.textContent=b,y.setAttribute("aria-label",b)}function ns(b=!1){R(U)&&(nt.delete(U),tn.delete(U),nn.delete(U),b||ft.get(U)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},k),no(),vt(),y.querySelector(".concept-drawer-body").scrollTop=0,ze())}y.querySelector(".concept-selection-clear").onclick=()=>{ns(),Re.has(U)?y.querySelector(".concept-example-back").focus({preventScroll:!0}):y.querySelector(".data-review-overview").focus({preventScroll:!0})};function no(){const b=y.querySelector(".concept-related-content");y.querySelector(".concept-selection").hidden=!!R(U)&&!nt.has(U)&&!nn.has(U),y.querySelector(".concept-selection>h2").hidden=!R(U),y.querySelector(".concept-selection-clear").hidden=!R(U);const I=nn.get(U);if(I&&W){const Q=W.describe(b,{kind:"group",id:I});Ko(Q);return}if(U==="landscape"&&sn){b.replaceChildren();for(const[Q,V]of W.sections){De(b,"h3",Q);const ue=document.createElement("ul");for(const we of V)De(ue,"li",we);b.append(ue)}Ko("サブシステムの情報");return}const j=nt.get(U),D=R(U),H=Le&&j?ts(j)?.name??D?.concepts[j]?.name??J[j].name:D?.name??"データ構造の情報";Ko(H),Le&&j?Br(b,j):(b.replaceChildren(),D||De(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function os(b){b.onload=()=>{is(),b.contentDocument&&(ls(b.contentDocument),us(b.contentDocument));const I=b.dataset.conceptView??"overview";if(!N||!T)return;const j=R(I),D=j?N.graph(j.id):I==="overview"?N.overviewGraph():{ids:ee,edges:N.edges,tables:J};b.contentWindow?.postMessage({type:"alder-concept-data",graph:D,focus:de.get(I),viewKey:I,documentKey:mn??T.model.id,clearSelectionOnBackground:!!j},k);const H=nt.get(I);H&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:H},k)}}os(C),C.dataset.conceptView="overview";function Gr(){y.querySelector(".concept-page-details").hidden=!0,y.querySelector(".concept-example-back").hidden=!0;const b=y.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const I=y.querySelector(".data-examples-panel");I.hidden=!0,I.replaceChildren(),delete I.dataset.dataExample,sn?.root.remove(),sn=void 0;for(const[j,D]of ft)j!=="overview"&&(D.remove(),ft.delete(j));C.removeAttribute("src"),C.removeAttribute("srcdoc"),nt.clear(),tn.clear(),nn.clear()}function Xo(){u.setAttribute("aria-label",U==="landscape"||R(U)?"サブシステム":"データ構造"),u.querySelector(".concept-empty").hidden=Le;const b=u.querySelector(".concept-review-landscape"),I=R(U),j=y.querySelector(".concept-page-details"),D=y.querySelector(".data-review-overview"),H=y.querySelector(".data-examples-panel");if(j.hidden=!Le||!I,D.hidden=!Le||!I||Re.has(U),H.hidden=!Le||!I||!Re.has(U),y.querySelector(".concept-example-back").hidden=H.hidden,Le&&I){const V=be();Pa(D,I,L,(we,Oe)=>{const He=ys(V,I.id,we,Oe);if(He)return{kind:He.kind,open:()=>{const Je=ys(be(),I.id,we,Oe);Je&&(Je.sampleId?at.set(Je.key,Je.sampleId):at.delete(Je.key),an(Je.key))}}},we=>Jo(we),t.business().activities);const ue=Re.get(U)??Ut.get(U)??Y(U)[0]?.id;ue&&L.renderDataExample(H,I,ue,we=>$r(we)),D.scrollTop=$e.get("review-overview:"+U)??0,H.scrollTop=$e.get("example:"+U+":"+ue)??0}if(b.hidden=!Le||!bn.includes(U),Le&&bn.includes(U)&&(U==="landscape"&&!sn&&(sn=Ua(document,T,mn??T.model.id,V=>rn(he(V)))),Na(b,sn?.root,U==="overview"?"graph":"overview"),U==="landscape"&&sn?.restore()),Le&&U!=="landscape"&&!ft.has(U)){const V=document.createElement("iframe");V.className="concept-frame",V.dataset.conceptView=U,V.title=I?I.name+"のデータ構造":J[de.get(U)].name+"と隣接する概念",V.hidden=!0,ft.set(U,V);const ue=de.get(U);ue&&nt.set(U,nt.get(U)??ue),os(V),u.querySelector(".concept-main").append(V)}for(const[V,ue]of ft)ue.hidden=!Le||V!==U,Le&&V===U&&!ue.hasAttribute("src")&&!ue.hasAttribute("srcdoc")&&(M?ue.srcdoc=M:ue.src=new URL("concept.html?view=overview"+(R(V)?"&group="+encodeURIComponent(R(V).id):V==="overview"?"":"&focus="+encodeURIComponent(de.get(V))),document.baseURI).href);const Q=nt.get(U);Q&&ft.get(U)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:Q},k),no(),vt(),y.querySelector(".concept-drawer-body").scrollTop=$e.get("drawer:"+U)??0}function hn(){const b=t.business(),I=b.views?.find(j=>j.activity!==void 0||j.object!==void 0||!rt);I?(ct("business"),t.activateView(I.key)):Ke.length?rn(Ke.at(-1),!1):Xe.length?Dn(Xe.at(-1),!1):st.length?an(st.at(-1),!1):ct("empty")}function Hr(){if(rt=!0,ie==="business"){const b=t.business().views?.find(I=>I.key===t.business().viewKey);!b?.activity&&!b?.object&&hn()}mt(),dt(),ze(),Be(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function Jr(){P.replaceChildren();const b=t.business().states?.find(j=>j.id===it);if(!b)return;const I=t.statePanel(b.id);I?P.append(I):De(P,"p","この対象の状態遷移は未定義です。"),P.scrollTop=$e.get("state:"+it)??0}let Zo="";function mt(){for(const D of Array.from(i.querySelectorAll(".tab"))){const H=t.business().views?.find(V=>V.key===D.dataset.key);D.hidden=rt&&H?.activity===void 0&&H?.object===void 0;const Q=!D.hidden&&ie==="business"&&D.dataset.key===t.business().viewKey;D.classList.toggle("active",Q),D.querySelector("button")?.setAttribute("aria-current",String(Q))}const b=(D,H,Q)=>{D.replaceChildren();for(const V of H){const ue=Q==="concept"?ve(V):t.business().states?.find(jt=>jt.id===V)?.name??V,we=ie===Q&&V===(Q==="concept"?U:it),Oe=document.createElement("div");Oe.className="tab"+(we?" active":"");const He=Q==="concept"&&(V==="landscape"||R(V))?"subsystems":Q;Oe.dataset.viewKind=He;const Je=document.createElement("button");Je.id=(Q==="concept"?"concept-tab-":"state-tab-")+V,ci(Je,He,ue),Je.setAttribute("aria-current",String(we)),Je.onclick=()=>Q==="concept"?rn(V):Dn(V),Oe.append(Je);const io=di((He==="subsystems"?"サブシステム：":Q==="concept"?"データ構造：":"状態遷移：")+ue+"のタブを閉じる");io.onclick=()=>{$t(),Q==="concept"?(Ke=Ke.filter(jt=>jt!==V),V!=="overview"&&(ft.get(V)?.remove(),ft.delete(V)),nt.delete(V),tn.delete(V),nn.delete(V),Re.delete(V),Ut.delete(V),pt.delete(V),ie===Q&&U===V&&(Ke.length?rn(Ke.at(-1),!1):hn())):(Xe=Xe.filter(jt=>jt!==V),ie===Q&&it===V&&(Xe.length?Dn(Xe.at(-1),!1):hn())),mt(),dt(),ze(),Be(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Oe.append(io),D.append(Oe)}};b(d,Ke,"concept"),b(r,Xe,"states"),f.replaceChildren();for(const D of st){const H=Wr(D),Q=document.createElement("div");Q.className="tab"+(ie==="tests"&&D===Ee?" active":""),Q.dataset.viewKind="tests";const V=document.createElement("button");V.id="spec-tab-"+D,ci(V,"tests",H),V.setAttribute("aria-current",String(ie==="tests"&&D===Ee)),V.onclick=()=>an(D);const ue=di("テスト仕様："+H+"のタブを閉じる");ue.onclick=()=>{st=st.filter(we=>we!==D),ie==="tests"&&Ee===D&&(st.length?an(st.at(-1),!1):hn()),mt(),dt(),ze(),Be()},Q.append(V,ue),f.append(Q)}const I=c.querySelector(".tab.active:not([hidden])"),j=ie==="business"?"business:"+t.business().viewKey:ie==="concept"?"concept:"+U:ie==="states"?"states:"+it:ie==="tests"?"tests:"+Ee:"";I?(j!==Zo&&Ma(c,I),Zo=j):Zo=""}function _r(){innerWidth<=800&&oo(!1)}function dt(){const b=E.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,I=E.scrollTop,j=t.business(),D=w.value.trim().toLocaleLowerCase();E.replaceChildren();const H=($,Se,Ze)=>({kind:"item",id:$,name:Se,key:Ze}),Q=($,Se,Ze)=>({kind:"group",id:$,name:Se,children:Ze}),V=be(),ue=$=>H($.key,$.name,"tests:"+$.key),we=V.filter($=>$.capability.testSpecification),Oe=V.filter($=>!$.capability.testSpecification),He=we.map($=>Q("tests-function-"+$.key,je($),[H("decision:"+$.key,"可否判定","tests:decision:"+$.key),H($.key,"処理結果","tests:"+$.key)]));for(const $ of j.activities){const Se=Oe.filter(_e=>_e.activityId===$.id).map(ue),Ze=(Pe($.id).size?"remaining:":"checks:")+$.id;Qt($.id)&&Se.push(H(Ze,"その他","tests:"+Ze)),Se.length&&He.push(Q("tests-activity-"+$.id,$.name,Se))}const Je=Oe.filter($=>!$.activityId);Je.length&&He.push(Q("tests-other","その他",Je.map(ue))),en()&&He.push(H("@unassigned","未割当","tests:@unassigned"));const io=[{id:"business",label:"業務設計",items:[H("overview","全体図","business:overview"),Q("business-activity","Activity",j.activities.map($=>H($.id,$.name,"business:"+$.id))),Q("business-object","Object",(j.objects??[]).map($=>H($.id,$.name,"object:"+$.id)))]},{id:"states",label:"状態遷移",items:(j.states??[]).map($=>H($.id,$.name,"states:"+$.id))},{id:"subsystems",label:"サブシステム",items:T?.model.subsystems.length?[H("landscape","全体図","concept:landscape"),...T.model.subsystems.map($=>Q("subsystem-"+$.id,$.name.replace(/サブシステム$/,""),T.model.reviewGroups.filter(Se=>Se.subsystemId===$.id).map(Se=>H(he(Se.id),Se.title,"concept:"+he(Se.id)))))]:[]},{id:"concept",label:"データ構造",items:Le&&ee.length?[H("overview","全体図","concept:overview"),Q("concept-relations","概念",ee.map($=>H(A($),J[$].name,"concept:"+A($))))]:[]},{id:"tests",label:"テスト仕様",items:j.design?.model&&(V.length||le().length)?He:[]}];let jt=0;const rs=($,Se,Ze)=>{const _e=document.createElement("button");_e.className="explorer-item"+(Ze?" explorer-item-nested":""),_e.dataset.explorerKey=$.key,_e.textContent=$.name;const Fe=j.views?.find(Te=>Te.key===j.viewKey);return ie===(Se.id==="subsystems"?"concept":Se.id)&&(["concept","subsystems"].includes(Se.id)?$.id===U:Se.id==="states"?$.id===it:Se.id==="tests"?$.id===Ee:$.key.startsWith("object:")?Fe?.object===$.id:$.id==="overview"?!rt&&Fe?.activity===void 0&&Fe?.object===void 0:Fe?.activity===$.id)&&_e.setAttribute("aria-current","page"),_e.disabled=Se.id==="business"&&!j.key,_e.onclick=()=>{m.hidden||t.closeLegacyList(),Se.id==="business"?$.key.startsWith("object:")?Fr($.id):Jo($.id==="overview"?void 0:$.id):Se.id==="concept"||Se.id==="subsystems"?rn($.id):Se.id==="tests"?an($.id):Dn($.id),_r()},_e},as=($,Se,Ze,_e=!1)=>{const Fe=document.createElement("button"),wt=D?!on.has($):We.has($);return Fe.className=(Ze?"explorer-subparent":"explorer-parent")+(_e?" explorer-pending":""),Fe.dataset.explorerKey="group:"+$,De(Fe,"span",Se).className="explorer-parent-label",_e?(Fe.disabled=!0,Fe):(Fe.setAttribute("aria-expanded",String(wt)),Fe.setAttribute("aria-controls","explorer-"+$),Fe.append(Ca(wt)),Fe.onclick=()=>{D?on.has($)?on.delete($):on.add($):(We.has($)?We.delete($):We.add($),ze()),dt()},Fe)};for(const $ of io){const Se=$.items.flatMap(Te=>{if(Te.kind==="item")return!D||($.label+" "+Te.name).toLocaleLowerCase().includes(D)?[Te]:[];const Ft=D?Te.children.filter(Qo=>($.label+" "+Te.name+" "+Qo.name).toLocaleLowerCase().includes(D)):Te.children;return!D||Ft.length?[{...Te,children:Ft}]:[]});if(D&&!Se.length)continue;const Ze=$.id!=="business"&&!$.items.length,_e=document.createElement("section"),Fe=as($.id,$.label,!1,Ze),wt=document.createElement("div");wt.id="explorer-"+$.id,wt.hidden=Ze||(D?on.has($.id):!We.has($.id));for(const Te of Se){if(Te.kind==="item"){wt.append(rs(Te,$,0)),jt++;continue}const Ft=document.createElement("div");Ft.id="explorer-"+Te.id,Ft.hidden=D?on.has(Te.id):!We.has(Te.id),wt.append(as(Te.id,Te.name,!0),Ft);for(const Qo of Te.children)Ft.append(rs(Qo,$,1)),jt++;!Te.children.length&&!D&&(De(Ft,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Se.length&&!Ze&&(De(wt,"p","項目がありません。").className="explorer-empty"),_e.append(Fe,wt),E.append(_e)}D&&!jt&&(De(E,"p","該当する項目はありません。").className="explorer-empty"),E.scrollTop=I,b&&Array.from(E.querySelectorAll("[data-explorer-key]")).find($=>$.dataset.explorerKey===b)?.focus({preventScroll:!0})}function oo(b){Ct=b,vt(),ze(),(b?a.querySelector(".shell-heading button"):S).focus({preventScroll:!0})}S.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),oo(!Ct)},!0),a.querySelector(".shell-heading button").onclick=()=>oo(!1),w.oninput=()=>{on.clear(),dt()},a.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&m.hidden&&(b.preventDefault(),b.stopPropagation(),oo(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&E.contains(document.activeElement)){const I=Array.from(E.querySelectorAll("button")).filter(H=>!H.disabled&&!H.closest("[hidden]")),j=I.indexOf(document.activeElement),D=I[j+(b.key==="ArrowDown"?1:-1)];D&&(b.preventDefault(),D.focus())}}),O.addEventListener("click",b=>{ie!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),ie==="concept"&&(yt.setOpen(!yt.isOpen()),vt(),ze(),Be(!1)))},!0),y.querySelector(".shell-heading button").onclick=()=>{yt.setOpen(!1),vt(),ze(),Be(!1),O.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const I=Array.from(ft).find(([,D])=>b.source===D.contentWindow);if(!I)return;if(b.data?.type==="alder-concept-rendered"){I[1].contentDocument&&(ls(I[1].contentDocument),us(I[1].contentDocument));return}if(ie!=="concept"||I[0]!==U)return;const j=R(U);if(b.data?.type==="alder-concept-clear-selection"){j&&ns(!0);return}if(b.data?.type==="alder-concept-subsystem"){if(!_o(U)?.regions.some(D=>D.id===b.data.id))return;nt.delete(U),tn.delete(U),nn.set(U,b.data.id),no(),vt(),ze();return}if(!(!ee.includes(b.data?.id)||j&&!j.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){rn(A(b.data.id));return}b.data.type==="alder-concept-select"&&(nn.delete(U),nt.set(U,b.data.id),(typeof b.data.viewId=="string"?_o(U)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?tn.set(U,b.data.viewId):tn.delete(U),innerWidth<=800&&(Ct=!1),no(),vt(),ze())}});function is(){const b=getComputedStyle(document.documentElement);for(const I of ft.values()){const j=I.contentDocument?.documentElement;if(j){j.dataset.theme=document.documentElement.dataset.theme??"light";for(const D of["--bg","--panel","--fg","--line","--subtle","--select"])j.style.setProperty(D,b.getPropertyValue(D))}}}function vt(){!m.hidden&&ie==="business"&&(Ct=!0),a.hidden=!Ct,S.disabled=!1,S.setAttribute("aria-controls","design-explorer"),S.setAttribute("aria-label","ナビゲーションを開閉"),S.setAttribute("aria-expanded",String(Ct));const b=yt.isReady?.()??!0;y.hidden=ie!=="concept"||!Le||!b||!yt.isOpen(),Yn&&ie!=="business"&&(Yn.hidden=!0),ie==="concept"?(O.disabled=!Le||!b,O.setAttribute("aria-controls","concept-related-panel"),O.setAttribute("aria-label","データ構造の情報を開閉"),O.setAttribute("aria-expanded",String(!y.hidden))):ie==="business"?O.setAttribute("aria-controls","formattedMarkdownDrawer"):(ie==="states"||ie==="tests"||ie==="empty")&&(O.disabled=!0,O.setAttribute("aria-expanded","false"));const I=o.querySelector("#document-actions");I&&(I.hidden=ie!=="business");const j=o.querySelector("#document-actions-toggle");j&&ie!=="business"&&(j.hidden=!0),is(),Yo()}function Yo(){const b=o.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(Yo);b.observe(o),b.observe(e.querySelector("header"))}window.addEventListener("resize",Yo);function ss(){$t(),eo=!0;try{const b=new URL(location.href).searchParams;if(ie==="concept"&&b.get("view")==="concept"&&b.get("concept")===U&&!Re.has(U)&&re(U,b.get("dataExample"))&&$e.set("drawer-overview:"+U,y.querySelector(".concept-drawer-body").scrollTop),Le||(pt.clear(),Re.clear(),Ut.clear(),Ke=[],U="overview",C.removeAttribute("src"),C.removeAttribute("srcdoc")),b.get("view")==="concept"){const I=Le&&ae.includes(b.get("concept")??"")?b.get("concept"):"landscape",j=b.get("dataExample");Le&&R(I)&&b.get("dataView")==="overview"&&!re(I,j)?(pt.add(I),Re.delete(I)):(pt.delete(I),Le&&re(I,j)?(Re.set(I,j),Ut.set(I,j)):Re.delete(I)),rn(I,!1)}else if(b.get("view")==="states")t.business().states?.some(I=>I.id===b.get("state"))?Dn(b.get("state"),!1):hn();else if(b.get("view")==="tests"){const I=Go(b.get("spec")??"@overview"),j=b.get("dataExample"),D=se(I);D&&j&&D.samples.some(H=>H.id===j)?at.set(I,j):D&&at.delete(I),an(I,!1)}else if(b.get("view")==="empty")ct("empty");else if(ct("business"),t.business().key){const I=b.get("activity"),j=b.get("object"),D=t.business(),H=D.views?.find(Q=>Q.key===D.viewKey);I&&D.activities.some(Q=>Q.id===I)?H?.activity!==I&&t.openActivity(I):j&&D.objects?.some(Q=>Q.id===j)?H?.object!==j&&t.openObject(j):(rt=!1,(!H||H.activity!==void 0||H.object!==void 0)&&t.openOverview())}mt(),dt()}finally{eo=!1}}return window.addEventListener("popstate",ss),{closeBusinessOverview:Hr,reopenBusinessOverview(){rt=!1},activateBusiness(){ct("business")},businessActivated(){ct("business"),mt(),dt(),Be()},syncChrome:vt,openRelatedChecks(b){We.add("tests"),an(b&&Ne(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),I=b.concept,j=!!(mn&&b.key!==mn||to&&Rn&&b.key&&b.key!==Rn),D=T?.model!==I?.model||T?.business!==I?.business;if((j||D&&T)&&(g.querySelector(".test-spec-page").replaceChildren(),rt=!1,Ke=[],Xe=[],st=[],U="overview",it="",Ee="@overview",at.clear(),$e.clear(),pt.clear(),Re.clear(),Ut.clear(),Gr(),ie!=="business"&&ct("business"),j&&!to&&Be(!1)),D){T=I,N=I?Ra(I):void 0,L=I?Fa(I):void 0,W=I?Ta(I):void 0,Le=!!I,J=N?.tables??{},ee=Object.keys(J);const H=N?.groups.map(V=>V.id)??[],Q=new Set([...bn,"subsystems"]);if(Ve=new Map(H.map(V=>[V,Q.has(V)||ee.includes(V)?"group:"+V:V])),Ce=new Map(ee.map(V=>[V,Q.has(V)||H.includes(V)?"concept:"+V:V])),te=new Map([...Ve].map(([V,ue])=>[ue,V])),de=new Map([...Ce].map(([V,ue])=>[ue,V])),ae=[...bn,...te.keys(),...de.keys()],Array.isArray(ge?.expanded)&&ge.expandedVersion!==4){We.add("subsystems"),We.add("concept-relations");for(const V of I?.model.subsystems??[])We.add("subsystem-"+V.id)}}if(mn=b.key,Xe=Xe.filter(H=>b.states?.some(Q=>Q.id===H)),ie==="business"&&rt&&b.views?.find(H=>H.key===b.viewKey)?.activity===void 0&&b.views?.find(H=>H.key===b.viewKey)?.object===void 0&&hn(),to&&b.key){if(zr(),Rn===b.key){Array.isArray(ge?.specs)&&(st=[...new Set(ge.specs.filter(H=>typeof H=="string").map(H=>Go(H)))]);for(const[H,Q]of Object.entries(ge?.specExamples??{})){const V=se(H);typeof Q=="string"&&V?.capability.samples.some(ue=>ue.id===Q)&&at.set(H,Q)}}to=!1,ss()}dt(),mt(),vt(),j&&ze()}}}class mi{tabs=new WeakMap;router;constructor(t=ri){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const a=JSON.stringify([o.map(u=>[u.id,u.width,u.height]),i.map(u=>[u.kind,u.from,u.to,u.label]),s]),l=this.tabs.get(t),c=!l||l.design!==n||l.structure!==a,d=new Set(o.filter(u=>{const h=l?.nodes.get(u.id);return!h||h.x!==u.x||h.y!==u.y}).map(u=>u.id)),r=new Set(o.map(u=>u.id)),f=c?new Array(i.length):l.routes.slice();if(i.forEach((u,h)=>{!c&&!d.has(u.from)&&!d.has(u.to)||(f[h]=r.has(u.from)&&r.has(u.to)?this.router({from:u.from,to:u.to,index:h,nodes:o,kind:u.kind,matrix:s?.[h],labels:s?.[h]?[]:[...f.flatMap((g,p)=>g&&p<h?[{id:String(p),x:g.label[0]-Math.max(30,i[p].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[p].label.length*12),height:18}]:[])],wires:s?.[h]?[]:f.flatMap((g,p)=>g&&p<h?[g.points]:[]),labelWidth:Math.max(30,u.label.length*12),labelHeight:18}):void 0)}),s){const u=[],h=new Map,g=f.map((p,m)=>m).sort((p,m)=>Number(s[p].returning)-Number(s[m].returning));for(const p of g){const m=f[p];if(!m)continue;const S=o.find(y=>y.id===i[p].from),O=Math.max(30,i[p].label.length*12),w=s[p].returning?[Math.max(...m.points.map(y=>y[0]))+8+O/2,m.points[0][1]]:[S.x+S.width*.125+8+O/2,ta(S.y+S.height,s[p].captionLane*Ks)+9],E=Xs(i[p],p,s[p]),C=h.get(E)??ai(w,O,18,o,u);(C[0]!==m.label[0]||C[1]!==m.label[1])&&(f[p]={...m,label:C}),h.has(E)||(h.set(E,C),u.push({id:String(p),x:C[0]-O/2,y:C[1]-9,width:O,height:18}))}}return this.tabs.set(t,{design:n,structure:a,nodes:new Map(o.map(u=>[u.id,{...u}])),routes:f}),f}}function Cc(e,t,n,o){const i=(f,u,h)=>(u[0]-f[0])*(h[1]-f[1])-(u[1]-f[1])*(h[0]-f[0]),s=i(e,t,n),a=i(e,t,o),l=i(n,o,e),c=i(n,o,t),d=1e-6;if(s*a<-d&&l*c<-d)return!0;if(Math.max(Math.abs(s),Math.abs(a),Math.abs(l),Math.abs(c))>d)return!1;const r=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[r],t[r]),Math.max(n[r],o[r]))-Math.max(Math.min(e[r],t[r]),Math.min(n[r],o[r]))>.1}function jc(e,t,n,o,i=[]){const s=e.x+e.width,a=24,l=e.y+e.height,c=s-8-(2*(n.count-n.index)-1)*a,d=t.filter(O=>O.id!==e.id);let r;for(const O of[0,-24,24,-48,48,-72,72])for(const w of[0,16,32,64,128,256]){const E=[c+O,l],C=[E[0]+a,l];if(E[0]<e.x+8||C[0]>s-8)continue;const y=l+n.depth+w,P=Math.min(12,(C[0]-E[0])/2,(y-l)/2),B=[E];let k=`M${E}`;const M=W=>{k+=` L${W}`,B.push(W)},T=(W,J)=>{const ee=B.at(-1);k+=` Q${W} ${J}`;for(let ae=1;ae<=4;ae++){const te=ae/4,de=1-te;B.push([de*de*ee[0]+2*de*te*W[0]+te*te*J[0],de*de*ee[1]+2*de*te*W[1]+te*te*J[1]])}};M([E[0],y-P]),T([E[0],y],[E[0]+P,y]),M([C[0]-P,y]),T([C[0],y],[C[0],y-P]),M(C);const N=na(B,d,.3),L=i.filter(W=>B.slice(1).some((J,ee)=>W.slice(1).some((ae,te)=>Cc(B[ee],J,W[te],ae)))).length;if((!r||N<r.collisions||N===r.collisions&&L<r.wireCollisions)&&(r={path:k,points:B,collisions:N,wireCollisions:L,low:y,extra:w,shift:O}),N===0&&L===0)break}const{path:f,points:u,collisions:h,wireCollisions:g,low:p,extra:m,shift:S}=r;return{path:f,points:u,label:[Math.max(s+8,n.labelLeft)+o/2,p],bounds:{right:Math.max(...u.map(O=>O[0])),bottom:Math.max(...u.map(O=>O[1]))},collisions:h+g,rerouted:m>0||S!==0,fallback:h+g>0}}function Mc(e,t=ji()){const n="http://www.w3.org/2000/svg",o=(A,R={})=>{const _=document.createElementNS(n,A);for(const[re,Y]of Object.entries(R))_.setAttribute(re,Y);return _},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(A=>[A]),a=[...new Set(["@new",...e.states,...s.map(A=>A[0].to)])],l={nodes:a.map(A=>({id:A,type:"business",name:i[A]??A,scope:!0})),relations:s.map(([A])=>({kind:A.path==="exception"?"business-exception":"input",from:A.from,to:A.to,label:A.id+"："+A.activity+"："+A.condition}))},c=Ri(l,a),d=A=>{const R=Array.from(A);return Array.from({length:Math.ceil(R.length/28)},(_,re)=>R.slice(re*28,(re+1)*28).join(""))},r=s.map(([A])=>({from:A.from,activity:A.activity,rows:[A],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[A,R]of r.entries()){const _=R.rows[0],re=e.transitions.filter(se=>se.from===_.from&&(se.activityId??se.activity)===(_.activityId??_.activity)&&se.path===_.path&&(_.path!=="exception"||(se.exception??"例外名未定義")===(_.exception??"例外名未定義"))),Y=re.map(se=>(se.conditionLabel??se.condition).trim().replace(/\s+/g," ")),ve=new Set(Y).size===re.length?_.conditionLabel??_.condition:_.condition,be=[_.path==="exception"?"例外："+(_.exception??"例外名未定義"):"",...re.length>1?[ve]:[]].filter(Boolean).join("：");R.lines=d(R.activity+(be?"（"+be+"）":"")),R.lineRows=R.lines.map(()=>R.rows),R.width=Math.max(...R.lines.map(se=>Array.from(se).length*14)),R.height=R.lines.length*18,c.wires[A].returning||(R.offset=f.has(R.from)?f.get(R.from)+8:0,f.set(R.from,R.offset+R.height))}const u=new Map;s.forEach(([A],R)=>{if(A.from===A.to){const _=u.get(A.from)??[];_.push(R),u.set(A.from,_)}});const h=new Map,g=new Map;for(const[A,R]of u){let _=0;for(const Y of[...R].reverse())h.set(Y,{leader:R[0],index:0,count:1,depth:0,offset:_}),_+=r[Y].height+8;const re=24+Math.max(0,_-8)+8;g.set(A,re);for(const Y of R)h.get(Y).depth=re}const p=A=>44,m=a.slice().sort((A,R)=>c.positions[A][1]-c.positions[R][1]);let S=Math.max(40,...r.map((A,R)=>c.wires[R].returning&&A.from===m[0]?16+A.height/2-44*(c.wires[R].fromPort??.5):40));const O=new Map;for(const A of m){const R=p(),_=(f.get(A)??0)+(g.get(A)??0);O.set(A,S),S+=oa(R,_)}const w=a.map(A=>({id:A,x:t.positions.get(A)?.[0]??c.positions[A][0],y:t.positions.get(A)?.[1]??O.get(A),width:Math.max(104,Array.from(i[A]??A).length*14+32),height:p()})),E=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),C=o("title");C.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(a.includes("@none")?"作成なしはこの操作の処理結果。":"")+(a.includes("@unknown")?"未決は設計課題。":""),E.append(C),E.append(Mi("state-transition-"));const y=new Map,P=[],B=[];let k=t.selected;const M=A=>{k=A,t.selected=A;const R=go(e.transitions,k);for(const[Y,ve]of y)ve.setAttribute("class","node graph-shape state-shape"+R.nodeClasses(Y)),ve.setAttribute("aria-pressed",String(Y===k));P.forEach(({element:Y,rows:ve})=>{const le=ve[0].from===ve[0].to;Y.setAttribute("class","edge"+(le?" state-self-loop":ve[0].path==="exception"?" exception":"")+R.labelClasses(ve)),Y.setAttribute("marker-end","url(#state-transition-"+(ve.some(R.related)?"related-arrow":"arrow")+")")});for(const Y of B)Y.element.setAttribute("class","state-caption-line"+R.labelClasses(Y.rows));E.querySelectorAll("[data-exception-paint]").forEach(Y=>Y.remove());const _=Array.from(E.children).find(Y=>Y.matches(".state-diagram-edge-label,[data-state]"))??null,re=[...P].sort((Y,ve)=>Number(Y.rows.some(R.related))-Number(ve.rows.some(R.related)));for(const{element:Y}of re)if(E.insertBefore(Y,_),Y.classList.contains("exception")||Y.classList.contains("state-self-loop")){const ve=E.children.length;Li(E,Y,{path:Y.getAttribute("d")},{"data-transitions":Y.getAttribute("data-transitions")});for(const le of Array.from(E.children).slice(ve))E.insertBefore(le,_)}E.querySelectorAll(".state-diagram-edge-label").forEach(Y=>E.append(Y))};E.addEventListener("click",A=>{A.target===E&&M()}),E.addEventListener("keydown",A=>{A.key==="Escape"&&(A.preventDefault(),M())});const T=c.wires.map((A,R)=>({...A,captionLane:(r[R].offset+(g.get(r[R].from)??0))/Ks})),N=l.relations.map((A,R)=>({...A,label:String(R).padEnd(Math.ceil(r[R].width/12),"x")})),L=[...h].map(([A,R])=>{const _=w.find(Y=>Y.id===s[A][0].from),re=r[A];return{x:_.x+_.width+8,y:_.y+_.height+24+R.offset,width:re.width,height:re.height}});let W=new mi().update({},e,w,N,T);for(let A=0;A<=L.length;A++){let R=!1,_=0;if(W.forEach((re,Y)=>{if(!re||h.has(Y)||!T[Y].returning)return;let ve=0;for(const le of L)for(let be=1;be<re.points.length;be++){const se=re.points[be-1],je=re.points[be];if(Math.abs(se[0]-je[0])>1e-7||Math.abs(se[1]-je[1])<2)continue;const Ne=se[0];if(Ne<le.x-4||Ne>le.x+le.width+4||Math.max(se[1],je[1])<le.y-4||Math.min(se[1],je[1])>le.y+le.height+4)continue;const Pe=le.x+le.width+12-Ne;Pe>0&&(ve=Math.max(ve,Pe))}ve&&(T[Y]={...T[Y],returnLane:(T[Y].returnLane??0)+Math.ceil(ve/16)+_++},R=!0)}),!R)break;W=new mi().update({},e,w,N,T)}const J=W.flatMap((A,R)=>A&&!h.has(R)?[A.points]:[]),ee=new Map,ae=W.map((A,R)=>{const _=h.get(R);if(!_)return A;const re=s[R][0].from,Y=w.find(Pe=>Pe.id===re),ve=W.flatMap((Pe,zt)=>Pe&&!h.has(zt)?[Pe.points]:[]),le=Math.max(30,N[R].label.length*12),be=r[R];let se=ee.get(_.leader);se||(se=jc(Y,w,{..._,labelLeft:Y.x+Y.width+8},le,J),ee.set(_.leader,se),J.push(se.points));const je=ve.flatMap((Pe,zt)=>Pe.slice(1).map((Qt,en)=>({id:`${zt}:${en}`,x:Math.min(Pe[en][0],Qt[0])-2,y:Math.min(Pe[en][1],Qt[1])-2,width:Math.abs(Pe[en][0]-Qt[0])+4,height:Math.abs(Pe[en][1]-Qt[1])+4}))),Ne=ai([Y.x+Y.width+8+be.width/2,Y.y+Y.height+24+_.offset+be.height/2],be.width,be.height,[...w,...je]);return{...se,label:[Ne[0]-be.width/2+le/2,Ne[1]]}}),te=new Array(s.length),de=[],Ve=s.map((A,R)=>R).sort((A,R)=>Number(T[A].returning)-Number(T[R].returning));for(const A of Ve){const R=ae[A],_=r[A],re=Math.max(30,N[A].label.length*12);let Y=[R.label[0]-re/2+_.width/2,R.label[1]+(T[A].returning?0:_.height/2-9)];const ve=w.find(se=>se.id===s[A][0].from),le=w.find(se=>se.id===s[A][0].to);if(!h.has(A)&&T[A].returning&&le&&le.y>ve.y){const se=R.points.slice(1).map((je,Ne)=>[R.points[Ne],je]).filter(([je,Ne])=>Math.abs(je[0]-Ne[0])<.01&&Ne[1]-je[1]>24).sort(([je,Ne],[Pe,zt])=>zt[1]-Pe[1]-(Ne[1]-je[1]))[0];if(se){const[je,Ne]=se;Y=[je[0]+8+_.width/2,je[1]+Math.min(24+_.height/2,(Ne[1]-je[1])/2)]}}const be=ai(Y,_.width,_.height,w,de);te[A]=be,de.push({id:String(A),x:be[0]-_.width/2,y:be[1]-_.height/2,width:_.width,height:_.height})}let Ce=Math.max(...w.map(A=>A.x+A.width))+40,he=Math.max(...w.map(A=>A.y+A.height))+40;s.forEach((A,R)=>{const _=h.get(R);if(_&&_.leader!==R)return;const re=_?s.flatMap((se,je)=>h.get(je)?.leader===R?se:[]):A,Y=re[0],ve=ae[R],le=o("path",{d:ve.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":re.map(se=>se.id).join(" ")});(_||Y.path==="exception")&&le.setAttribute("stroke-dasharray","6 5");const be=o("title");be.textContent=re.map(se=>`${se.id} ${se.activity} / ${se.path==="normal"?"通常":"例外："+(se.exception??"例外名未定義")}：${se.condition}`).join(" / "),le.append(be),E.append(le),P.push({element:le,rows:re}),Ce=Math.max(Ce,ve.bounds.right+40),he=Math.max(he,ve.bounds.bottom+40)});for(const[A,R]of r.entries()){const _=te[A],re=_[0]-R.width/2,Y=_[1]-R.height/2+14;E.append(o("rect",{x:String(re),y:String(Y-14),width:String(R.width),height:String(R.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const ve=o("text",{x:String(re),y:String(Y),class:"state-diagram-edge-label","data-activity":R.activity,"data-transition-id":R.rows[0].id,"aria-label":R.lines.join("")});R.lines.forEach((le,be)=>{const se=o("tspan",{x:String(re),dy:be?"18":"0","font-size":"14","font-weight":"600"});se.textContent=le,se.setAttribute("data-transitions",R.lineRows[be].map(je=>je.id).join(" ")),B.push({element:se,rows:R.lineRows[be]}),ve.append(se)}),E.append(ve),Ce=Math.max(Ce,re+R.width+24),he=Math.max(he,Y+R.height+24)}for(const A of w){const R=A.id.startsWith("@"),_=o("g",{role:"button",tabindex:"0","aria-label":i[A.id]??A.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":A.id,"data-node":A.id});_.append(Js(document,A,R)),_.append(o("rect",{x:String(A.x),y:String(A.y),width:String(A.width),height:String(A.height),rx:R?"20":"8",class:R?"state-diagram-node state-note":"state-diagram-node"}));const re=o("text",{x:String(A.x+A.width/2),y:String(A.y+A.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(re.textContent=i[A.id]??A.id,_.append(re),R&&A.id!=="@new"){const Y=o("text",{x:String(A.x+A.width/2),y:String(A.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});Y.textContent=A.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",_.append(Y)}_.addEventListener("click",()=>M(A.id)),_.addEventListener("keydown",Y=>{(Y.key==="Enter"||Y.key===" ")&&(Y.preventDefault(),M(A.id))}),y.set(A.id,_),E.append(_)}return M(t.selected),E.setAttribute("viewBox",`0 0 ${Ce} ${he}`),E.style.minWidth=`${Ce}px`,E}const vs=new WeakMap;function Lc(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(p=>p.id===t&&p.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(p,m,S=i)=>{const O=document.createElement(p);return O.textContent=m,S.append(O),O};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const a=o.model;for(const p of a.transitions){if(!e.graph.nodes.some(m=>m.id===p.activity&&m.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(p.exceptionId){const m=e.model?.business.exceptions?.find(S=>S.id===p.exceptionId);if(!m||m.activityId!==p.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const l=vs.get(e)??new Map;vs.set(e,l);const c=l.get(t)??ji();l.set(t,c);const d={...a,transitions:a.transitions.map(p=>({...p,activityId:p.activity,activity:e.graph.nodes.find(m=>m.id===p.activity)?.name??p.activity}))};i.append(Hs(document,p=>Mc(d,p),c));const r=p=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[p]??p,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},u=document.createElement("details");s("summary",`操作の詳細（${a.transitions.length}）`,u);const h=document.createElement("ol");u.append(h),i.append(u);for(const p of a.transitions){const m=document.createElement("li");m.dataset.transition=p.id,s("h3",`${p.id} · ${r(p.from)} → ${r(p.to)}`,m),p.path==="exception"&&s("p","例外名："+(p.exception??"未定義"),m),s("p",`${f[p.effect]} · ${p.path==="normal"?"正常":"例外"}`,m);const S=e.graph.nodes.find(O=>O.id===p.activity&&O.type==="business");if(S){const O=document.createElement("button");O.type="button",O.textContent=S.name,O.onclick=()=>n(S.id),m.append(O)}else s("p","要確認：根拠Activityが見つかりません — "+p.activity,m);s("p","条件："+p.condition,m),s("p",p.note,m),s("p","根拠："+p.evidence,m),h.append(m)}a.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",a.source,g),i.append(g),i}const ws=64,Rc=96,Dc=260,ks=40,Nc=4;function Pc(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:a,forwardRelations:l,feedbackRelations:c,exceptionRelations:d}=ia(e,t),r=a.map(C=>C.length),f=o.map(()=>0),u=o.flatMap((C,y)=>r[y]===0?[y]:[]);for(let C=0;C<u.length;C++)for(const y of s[u[C]])f[y]=Math.max(f[y],f[u[C]]+1),--r[y]===0&&u.push(y);const h=Array.from({length:f.reduce((C,y)=>Math.max(C,y),0)+1},()=>[]);o.forEach((C,y)=>h[f[y]].push(y));const g=o.map(()=>0),p=C=>C.forEach((y,P)=>g[y]=P);h.forEach(p);for(let C=0;C<Nc;C++){const y=C%2?[...h].reverse():h;for(const P of y){const B=new Map(P.map(k=>{const M=C%2?s[k]:a[k];return[k,M.length?M.reduce((T,N)=>T+g[N],0)/M.length:g[k]]}));P.sort((k,M)=>B.get(k)-B.get(M)||k-M),p(P)}}const m=h[0].filter(C=>o[C].type==="object"&&i[C].length===0&&s[C].length>0);if(n&&m.length>1){const C=new Set(m),y=h[0].filter(P=>!C.has(P));h.splice(0,1,...m.map((P,B)=>B===0?[...y,P]:[P]))}const S=Object.create(null),O=o.map(()=>0),w=[],E=Math.ceil(Dc/ws)-1;for(let C=0;C<h.length;C++){const y=new Map;for(const k of w)for(const M of k)y.set(M,M+1);const P=k=>{let M=k;for(;y.has(M);)M=y.get(M);let T=k;for(;y.has(T);){const N=y.get(T);y.set(T,M),T=N}return M},B=[];for(const k of h[C]){let M=C;for(const N of a[k])M=Math.max(M,O[N]+1);const T=P(M);O[k]=T,y.set(T,T+1),B.push(T),S[o[k].id]=[ks+C*ws,ks+T*Rc]}w.push(B),w.length>E&&w.shift()}return{positions:S,forwardRelations:l,feedbackRelations:c,exceptionRelations:d}}function Tc(e,t){return Zs(e)?Ri(e,t).positions:Pc(e,t).positions}const Is=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function sr(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>Is(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=Is(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function rr(e){const t=sr(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,a])=>[o.get(s),a])))}}function ar(e){const t=rr(e);return t.restore(Tc(t.graph,t.order))}function qc(e){const t=rr(e),n=Ri(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function cr(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function Wc(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(a=>a.handle!==void 0):s.tabs.some(a=>a.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,a){if(Object.is(s,a))return!0;if(!s||!a||typeof s!="object"||typeof a!="object"||o.has(s)||o.has(a))return!1;const l=h=>Array.isArray(h)||Object.getPrototypeOf(h)===null||Object.getPrototypeOf(h)?.constructor?.name==="Object";if(!l(s)||!l(a)||Array.isArray(s)!==Array.isArray(a)||Array.isArray(s)&&s.length!==a.length)return!1;o.add(s),o.add(a);const c=s,d=a,r=Object.keys(c),f=Object.keys(d),u=r.length===f.length&&r.every(h=>Object.hasOwn(d,h)&&i(c[h],d[h]));return o.delete(s),o.delete(a),u}return i(e,t)}function jn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,a]of Object.entries(e.positions))n.has(s)&&(o[s]=[...a]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=ar(t),a=Object.values(o);for(const l of i){const c=[...s[l.id]];for(;a.some(d=>Math.abs(d[0]-c[0])<280&&Math.abs(d[1]-c[1])<88);)c[1]+=180;o[l.id]=c,a.push(c)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function dr(){return new Promise((e,t)=>{const n=indexedDB.open(cr(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class Ti extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let yo;function lr(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function zc(e){const t=yo;if(t===void 0)throw Error("Session has not been loaded");const n=await dr();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),a=s.objectStore("session"),l=a.get("generation"),c=a.get("current"),d=a.get("readonly-legacy");let r,f;d.onsuccess=()=>{try{const u=lr(l.result);if(Wc(c.result,e)){f=u;return}if(u!==t)throw new Ti;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");d.result===void 0&&$c(c.result)&&a.put(c.result,"readonly-legacy"),a.put(e,"current"),a.put(f,"generation")}catch(u){r=u,s.abort()}},s.oncomplete=()=>{yo=f,o()},s.onerror=()=>i(r??s.error??Error("Session save failed")),s.onabort=()=>i(r??s.error??Error("Session save aborted"))})}finally{n.close()}}async function Uc(){yo=void 0;const e=await dr();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),a=i.get("generation");o.oncomplete=()=>{try{yo=lr(a.result),t(s.result)}catch(l){n(l)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function $c(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const Ss=new WeakMap;function Fc(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(r=>r.id===t&&r.type==="business"))throw Error("Unknown Activity: "+t);let o=Ss.get(e);o||(o=new Map,Ss.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(r=>r.type==="object").map(r=>r.id)),a=new Set(e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)),l=e.graph.relations.filter(r=>r.kind==="input"&&r.to===t&&s.has(r.from)||r.kind==="output"&&r.from===t&&s.has(r.to)||r.kind==="business-exception"&&(r.from===t&&a.has(r.to)||r.to===t&&a.has(r.from))),c=new Set([t,...l.flatMap(r=>[r.from,r.to])]),d={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(r=>c.has(r.id)),relations:l},activityOrder:(e.activityOrder??e.graph.nodes.filter(r=>r.type==="business").map(r=>r.id)).filter(r=>c.has(r))};return o.set(t,d),d}const xs=new WeakMap;function Vc(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=xs.get(e);o||(o=new Map,xs.set(e,o));const i=t,s=o.get(i);if(s)return s;const a=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),l=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),c=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&l.has(f.to)||f.kind==="output"&&f.to===t&&l.has(f.from)||f.kind==="object-exception"&&(f.from===t&&a.has(f.to)||f.to===t&&a.has(f.from))),d=new Set([t,...c.flatMap(f=>[f.from,f.to])]),r={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>d.has(f.id)),relations:c},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>d.has(f))};return o.set(i,r),r}const ur=new WeakMap;function Pt(e){return ur.get(e)}const fr=["design","checks","source","draft","edited","handle"];function Bc(e){return{key:e.key,name:e.name,...Object.fromEntries(fr.map(t=>[t,e[t]]))}}function It(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:a,viewInset:l,canvasOrigin:c,scroll:d,zoom:r}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:a,viewInset:l,canvasOrigin:c,scroll:d,zoom:r,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function Oo(e,t){const n=t;ur.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of fr)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function vo(e){return e.activity}function wo(e){return e.object}function Un(e){return e.activity??e.object}function Co(e){return e.object===void 0?Fc(e.design,e.activity):Vc(e.design,e.object)}function jo(e){const t=Co(e),n=jn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function Xt(e,t=[],n,o){const i=n??(e.tabs[0]?Bc(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?It(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(u=>{const h=Oo(i,u);return Object.assign(u,It(jo(h))),h}):[],{dark:a,drawer:l,width:c,preferWrite:d,nodeDrawer:r,sampleLayout:f}=e;return{dark:a,drawer:l,width:c,preferWrite:d,nodeDrawer:r,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(u=>u.source?.kind==="url").map(u=>({url:u.source.url,name:u.name}))].filter((u,h,g)=>g.findIndex(p=>p.url===u.url)===h),legacyViews:e.legacyViews,active:s.some(u=>u.key===e.active)?e.active:s[0]?.key}}function qi(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(It),recovery:n}}function ro(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function Gc(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!Zc(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const r of i.views)ro(r)}const{format:s,views:a,document:l,recovery:c,...d}=e;for(const r of a)ro(r);for(const r of c)ro(r);if(!!l!=!!a.length||new Set(a.map(r=>r.key)).size!==a.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(u=>u.group!==void 0&&typeof u.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(u=>u.group===void 0).length!==1))throw Error("Invalid legacy views");const r=o.views[0],f=r?{...r}:void 0;return f&&delete f.group,Xt({...d,tabs:[],active:f?.key,legacyViews:{documentKey:l?.key,views:structuredClone(o.views),active:o.active}},c,l,f?[f]:[])}if(a.length&&(a[0].activity!==void 0||a[0].object!==void 0||a.filter(r=>r.activity===void 0&&r.object===void 0).length!==1)||new Set(a.filter(r=>r.activity!==void 0).map(r=>r.activity)).size!==a.filter(r=>r.activity!==void 0).length||new Set(a.filter(r=>r.object!==void 0).map(r=>r.object)).size!==a.filter(r=>r.object!==void 0).length)throw Error("Invalid workspace views");if(l&&a.some(r=>r.activity!==void 0&&!l.design.graph.nodes.some(f=>f.type==="business"&&f.id===r.activity)))throw Error("Unknown saved Activity");if(l&&a.some(r=>r.object!==void 0&&!l.design.graph.nodes.some(f=>f.type==="object"&&f.id===r.object)))throw Error("Unknown saved Object");return Xt({...d,tabs:[]},c,l,a)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)ro(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return Xt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function Hc(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return Xt({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function Jc(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(c=>c.type==="business").map(c=>c.id)),a=new Set(t.graph.nodes.filter(c=>c.type==="object").map(c=>c.id)),l=e.tabs.filter(c=>(c.activity===void 0||s.has(c.activity))&&(c.object===void 0||a.has(c.object))).map(It);return Xt(e,e.recovery,i,l)}function _c(e,t){const n=e.tabs.find(i=>vo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=Oo(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,It(jo(o))),e.tabs.push(o),e.active=o.key,o}function Kc(e,t){const n=e.tabs.find(i=>wo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=Oo(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,It(jo(o))),e.tabs.push(o),e.active=o.key,o}function Xc(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return It(i?jo(Oo(e.document,{...It(o),...It(i)})):o)});return Xt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function Zc(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function Mo(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=l=>l instanceof HTMLButtonElement&&l.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(l=>!l.hidden&&!o(l));for(const l of Array.from(t.querySelectorAll("button,a[href]")))l.setAttribute("role","menuitem");const s=(l=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),l&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},a=(l=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const c=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),d=c.getBoundingClientRect();t.style.left=Math.max(8,Math.min(d.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(d.bottom+4,innerHeight-t.offsetHeight-8))+"px",(l?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?a():s(!0),e.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),a(l.key==="ArrowUp"))},t.addEventListener("keydown",l=>{const c=l,d=i(),r=d.indexOf(document.activeElement);let f;c.key==="ArrowDown"&&(f=(r+1)%d.length),c.key==="ArrowUp"&&(f=(r+d.length-1)%d.length),c.key==="Home"&&(f=0),c.key==="End"&&(f=d.length-1),f!==void 0&&(c.preventDefault(),d[f]?.focus())}),t.addEventListener("click",l=>{const c=l.target.closest("button,a[href]");!t.hidden&&c&&!o(c)&&s(!0)},!0),document.addEventListener("keydown",l=>{!t.hidden&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{!t.hidden&&!t.contains(l.target)&&!e.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{!t.hidden&&!t.contains(l.target)&&l.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const Yc=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),Qc={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function ed(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=w=>i.slice(w.line+1,o.find(E=>E.line>w.line&&E.level<=w.level)?.line??i.length).join(`
`).trim(),a=new Map(o.filter(w=>w.level===3&&t.some(E=>E.title===w.title)).map(w=>[w.title,w])),l=w=>{const E=t.find(C=>C.title===w.title);return E?"legacy-check:"+E.id:w.level===1?"legacy-check-document":"legacy-heading:"+w.line},c=new Map,d=(w,E)=>{c.has(w)?c.get(w)!==E&&c.set(w,void 0):c.set(w,E)};for(const w of o){const E=l(w);d(Yc(w.title),E);const C=t.find(y=>y.title===w.title);C&&d(C.id.toLowerCase(),E)}for(const[w,E]of i.entries()){const C=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(E);if(C){const y=o.find(P=>P.line>w);y&&d(C[1].toLowerCase(),l(y))}}const r=w=>{w=w.replace(/<a\s+id=[^>]+><\/a>/g,"");const E=[];let C=0;for(const y of w.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){y.index>C&&E.push({kind:"markdown",value:w.slice(C,y.index)});let P=y[2].slice(1);try{P=decodeURIComponent(P)}catch{}const B=y[2].startsWith("#")?c.get(P.toLowerCase()):void 0;E.push(B?{kind:"reference",targetId:B,label:y[1]}:{kind:"link",uri:y[2],label:y[1]}),C=y.index+y[0].length}return C<w.length&&E.push({kind:"markdown",value:w.slice(C)}),E},f=[],u=[],h=[],g=new Map;for(const w of o.filter(E=>E.level===2)){if(w.title==="業務一覧")continue;const E=l(w),C=o.find(y=>y.line>w.line)?.line??i.length;f.push({id:E,activityId:Object.hasOwn(n,w.title)?w.title:null,title:w.title,preamble:r(i.slice(w.line+1,C).join(`
`).trim())}),g.set(w.title,E)}const p="legacy-unassigned",m=w=>{const E=o.filter(C=>C.line<w.line&&C.level===2).at(-1);return E?g.get(E.title):void 0},S=t.map(w=>{const E=a.get(w.title),C=m(E)??p,y=Object.create(null),P=[];let B={name:"補足",value:""},k="";for(const T of w.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const N=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(T);N&&(k?N[1][0]===k[0]&&N[1].length>=k.length&&!N[2].trim()&&(k=""):k=N[1]);const L=k?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(T);L?(B.value.trim()&&P.push(B),B={name:L[1],value:L[2]}):B.value+=`
`+T}B.value.trim()&&P.push(B);let M="";for(const T of P)if(T.name==="人間レビュー状態"){M=T.value.split(`
`)[0].trim();const N=T.value.split(`
`).slice(1).join(`
`).trim();N&&(y.補足=[...y.補足??[],...r(N)])}else{const N=Qc[T.name]??T.name;y[N]=[...y[N]??[],...r(T.value.trim())]}return{id:"legacy-check:"+w.id,checkId:w.id,title:w.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:M,sectionId:C,detailSummary:[...w.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(T=>T[1]).join(`
`),fields:y}});S.some(w=>w.sectionId===p)&&f.push({id:p,activityId:null,title:"未割当",preamble:[]});for(const w of o.filter(E=>E.level===3&&!a.has(E.title))){const E=m(w);E?u.push({id:l(w),sectionId:E,title:w.title,blocks:[{kind:"prose",content:r(s(w))}]}):h.push({id:l(w),title:w.title,content:r(s(w))})}const O=o.find(w=>w.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(w=>w.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:r(i.slice(/^# /.test(i[0])?1:0,O).join(`
`)),sections:f,items:S,index:Object.entries(n).map(([w,E])=>{const C=i.find(y=>y.startsWith("|")&&y.includes("["+w+"]"))?.split("|").slice(1,-1)??[];return{activityId:w,purpose:C[1]?.trim()??"",connections:C[2]?.trim()??"",checkIds:E.map(y=>"legacy-check:"+y)}}),guarantees:u,examples:[],notes:h}}function ei(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[a,...l]=s;return!a||!l.length||!["main","master"].includes(a)&&!/^[a-f0-9]{40}$/i.test(a)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${l.join("/")}`,ref:a}}catch{return}}function hi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function td(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,u)=>{const h=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(h){i?h[1][0]===i[0]&&h[1].length>=i.length&&!h[2].trim()&&(i=""):i=h[1];return}if(!i){t.add(u);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:u,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const a=new Set,l=s.map(f=>{const u=o.find(p=>p.line>f.line&&p.level<=3)?.line??n.length,h=f.title.split(/\s/)[0];if(a.has(h))throw Error("Check IDが重複しています: "+h);a.add(h);const g=n.slice(f.line+1,u).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const p of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+p+"[：:]\\s*\\S","m").test(g))throw Error(h+" の"+p+"が見つかりません。");return{id:h,title:f.title,body:g,activities:[]}}),c=Object.create(null);let d=!1;for(const[f,u]of n.entries()){if(!t.has(f)||(/^## /.test(u)&&(d=/^## 業務一覧\s*$/.test(u)),!d||!/^\|/.test(u)))continue;const h=u.split("|").slice(1,-1);if(h.length!==4)continue;const g=hi(h[0])[0]?.label;if(!g)continue;if(Object.hasOwn(c,g))throw Error("業務一覧のActivityが重複しています: "+g);const p=hi(h[3]);if(p.some(S=>S.url.toLowerCase()!=="#"+S.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const m=p.map(S=>S.label);if(!m.length||m.some(S=>!a.has(S)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);c[g]=[...new Set(m)];for(const S of l)m.includes(S.id)&&S.activities.push(g)}if(!Object.keys(c).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const r=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,r).join(`
`),items:l,index:c,model:ed(e,l,c,o)}}function $n(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function Fn(e,t){const n=new Set(t.design.graph.nodes.filter(d=>d.type==="business").map(d=>d.name)),o=Object.keys(e.index).filter(d=>!n.has(d)),i=Object.keys(e.index).filter(d=>n.has(d)),s=(d,r)=>({state:d,reason:r,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const a=e.intro.split(`
`).filter(d=>/原典|^[-*] Source[：:]|Business Design/i.test(d)).join(`
`),l=hi(a).map(d=>ei(d.url)).filter(d=>d!==void 0),c=t.source?.kind==="url"?ei(t.source.url):t.source?.kind==="sample"?ei("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return c&&l.length&&l.some(d=>d.document!==c.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!c||!l.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||l.some(d=>d.ref!==c.ref)||!/^[a-f0-9]{40}$/i.test(c.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const As=new WeakMap;function xn(e){let t=As.get(e);return t||(t=td(e.markdown),As.set(e,t)),t}const ti=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function ao(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function nd(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function od(e){if(!e.checks)return[];const t=xn(e.checks),n=Fn(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===$n(e)?[t.model]:[]}function id(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&ao(i,"関連Checkを読み込み・保存しています…"),t.error){const l=document.createElement("p");l.className="check-warning",l.setAttribute("role","alert"),l.textContent=t.error,i.append(l)}let s,a=!1;if(e.checks){s=xn(e.checks);const l=Fn(s,e);if(a=l.state==="matched"||l.state==="unverified"&&e.checks.confirmedFor===$n(e),!a&&(ao(i,"現在のBDとの対応を再確認してください。"+l.reason),l.state==="unverified")){const c=ti("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));c.disabled=n.disabled||t.busy===!0,i.append(c)}}if(t.candidate){const l=t.candidate,c=xn(l),d=Fn(c,e),r=document.createElement("section");r.className="check-candidate",r.id="check-candidate",ao(r,"一致未確認: "+l.name+" — "+d.reason),ao(r,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),u=document.createElement("summary");u.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(u,nd(c.markdown)),r.append(f);const h=ti("対応を確認して表示する",()=>n.confirm(l));h.id="check-confirm",h.disabled=d.state==="mismatch"||n.disabled||t.busy===!0;const g=ti("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,r.append(h,g),i.append(r)}return i.childNodes.length&&o.append(i),o}function sd(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const r of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=r.getAttribute("aria-label"),r.append(f)}let s=!1;const a=(r=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),r&&!o.hidden&&o.focus({preventScroll:!0})},l=()=>i.filter(r=>!r.hidden&&!r.disabled),c=()=>{const r=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const h=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+h,p=i.some(m=>!m.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=p?"menu":"inline",o.hidden=!p,(!p||r!==e.dataset.actionsMode)&&(a(),p&&n.contains(f)?o.focus({preventScroll:!0}):!p&&f===o&&l()[0]?.focus({preventScroll:!0}))},d=(r=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=l();(r?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?a(!0):d(),o.onkeydown=r=>{(r.key==="ArrowDown"||r.key==="ArrowUp")&&(r.preventDefault(),d(r.key==="ArrowUp"))},n.addEventListener("keydown",r=>{if(!s)return;const f=l(),u=f.indexOf(document.activeElement);let h;r.key==="ArrowDown"&&(h=(u+1)%f.length),r.key==="ArrowUp"&&(h=(u+f.length-1)%f.length),r.key==="Home"&&(h=0),r.key==="End"&&(h=f.length-1),h!==void 0&&(r.preventDefault(),f[h]?.focus())}),document.addEventListener("keydown",r=>{s&&r.key==="Escape"&&(r.preventDefault(),r.stopImmediatePropagation(),a(!0))},!0),document.addEventListener("pointerdown",r=>{s&&!n.contains(r.target)&&!o.contains(r.target)&&a()}),document.addEventListener("focusin",r=>{s&&!n.contains(r.target)&&r.target!==o&&a()}),n.addEventListener("click",r=>{const f=r.target.closest("button");s&&f&&!f.disabled&&a(!0)},!0),a(),c(),window.addEventListener("resize",c),typeof ResizeObserver<"u"&&new ResizeObserver(c).observe(e),new MutationObserver(c).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(c),document.fonts?.addEventListener("loadingdone",c),{update:c,close:a}}function rd(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,a=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),l=n.reduce((d,r)=>d+r.getBoundingClientRect().width,0)+s*n.length+a,c=l+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",c>e.clientWidth),e.classList.toggle("header-icons-only",l>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const Nn="http://www.w3.org/2000/svg",ad="http://www.w3.org/1999/xhtml",co=24,Es=8192,cd=16e6,dd=8e6,ld=4e3,ud=1e6,bi="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function fd(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(r=>![r.x,r.y,r.width,r.height].every(Number.isFinite)||r.width<0||r.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const r of e)t=Math.min(t,r.x),n=Math.min(n,r.y),o=Math.max(o,r.x+r.width),i=Math.max(i,r.y+r.height);const s=Math.floor(t)-co,a=Math.floor(n)-co,l=Math.ceil(o)-s+co,c=Math.ceil(i)-a+co,d=Math.min(2,Es/l,Es/c,Math.sqrt(cd/(l*c)));if(d<1)throw Error(bi);return{bounds:{x:s,y:a,width:l,height:c},width:Math.floor(l*d),height:Math.floor(c*d),scale:d}}const pd="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function Os(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const a=o[s],l=getComputedStyle(i);a.removeAttribute("style");for(const c of pd){const d=l.getPropertyValue(c);d&&!/url\s*\(/i.test(d)&&a.style.setProperty(c,d)}for(const c of Array.from(a.attributes))(c.name.startsWith("data-")||c.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(c.name))&&a.removeAttribute(c.name)}),t}function md(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>ld||(e.textContent?.length??0)+(t.textContent?.length??0)>ud)throw Error(bi);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(p=>({x:parseFloat(p.style.left),y:parseFloat(p.style.top),width:p.offsetWidth,height:p.offsetHeight}));for(const p of o)for(const m of Array.from(p.querySelectorAll(".finding-badges")))i.push({x:parseFloat(p.style.left)+p.clientLeft+m.offsetLeft,y:parseFloat(p.style.top)+p.clientTop+m.offsetTop,width:m.offsetWidth,height:m.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,a=Array.from(t.children).map(Os),l=a.filter(p=>p.matches(".edge,.edge-label"));if(l.length){const p=s.createElementNS(Nn,"svg");p.setAttribute("viewBox","0 0 1 1"),p.setAttribute("width","1"),p.setAttribute("height","1"),p.setAttribute("aria-hidden","true"),p.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",p.append(...l),s.body.append(p);try{for(const m of l){const S=m.getBBox();i.push({x:S.x-12,y:S.y-12,width:S.width+24,height:S.height+24})}}finally{p.remove()}}const c=fd(i),d=s.createElementNS(Nn,"svg");d.setAttribute("width",String(c.width)),d.setAttribute("height",String(c.height)),d.setAttribute("viewBox",`0 0 ${c.bounds.width} ${c.bounds.height}`);const r=s.createElementNS(Nn,"rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",n),d.append(r);const f=s.createElementNS(Nn,"g");f.setAttribute("transform",`translate(${-c.bounds.x} ${-c.bounds.y})`);for(const p of a)f.append(p);d.append(f);const u=s.createElementNS(Nn,"foreignObject");u.setAttribute("width",String(c.bounds.width)),u.setAttribute("height",String(c.bounds.height));const h=s.createElementNS(ad,"div");h.style.cssText=`position:relative;width:${c.bounds.width}px;height:${c.bounds.height}px;`;for(const p of o){const m=Os(p);m.querySelector(".activity-open,.object-open")?.remove(),m.style.left=parseFloat(p.style.left)-c.bounds.x+"px",m.style.top=parseFloat(p.style.top)-c.bounds.y+"px",h.append(m)}u.append(h),d.append(u);const g=new XMLSerializer().serializeToString(d);if(new TextEncoder().encode(g).length>dd)throw Error(bi);return{svg:g,...c}}function hd(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function pr(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const a=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(a),i()},n.onerror=()=>{clearTimeout(a),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const a=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(l=>{clearTimeout(a),l?i(l):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(l){clearTimeout(a),s(l)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function bd(e,t){const n=await pr(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=hd(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function gd(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=pr(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function mr(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:yd(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function yd(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const a of o)i=Math.imul(i^a.codePointAt(0),16777619)>>>0,s=Math.imul(s^a.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function hr(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return q(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function vd(e){q(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),vn(e),pi(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=mr(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=hr(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return pi(t),t}const ce=(e,t)=>{if(!e)throw new Error(t)},Pn=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ni=e=>!!e&&typeof e=="object"&&!Array.isArray(e),lo=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),br=e=>Pn(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function wd(e){ce(ni(e),"Graph must be an object");const t=e;ce(lo(t,["version","nodes","relations"])||lo(t,["version","nodes","relations","scope"]),"Invalid graph fields"),ce(t.version===1,"Unsupported graph version"),"scope"in t&&ce(Pn(t.scope),"Invalid scope"),ce(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),ce(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){ce(ni(s),"Node must be an object");const a=s;ce(a.type==="business"||a.type==="object","Invalid node type");const l=a.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];a.type==="business"&&("problem"in a||"pain_level"in a)&&(l.push("problem","pain_level"),ce(["Low","Medium","High"].includes(String(a.pain_level)),"Invalid Pain level")),ce(lo(a,l),"Invalid node fields"),ce(Object.entries(a).every(([d,r])=>d==="scope"||d==="information"||Pn(r)),"Empty node text"),ce(typeof a.scope=="boolean","Invalid node scope"),ce(br(a.name)&&a.id===a.name,"Node ID must equal visible name"),ce(!n.has(a.id),"Duplicate node ID"),a.type==="object"&&(ce(typeof a.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.icon),"Invalid Lucide icon"),ce(Array.isArray(a.information)&&a.information.every(Pn),"Invalid information")),n.set(a.id,a.type)}ce([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){ce(ni(s),"Relation must be an object");const a=s;ce(lo(a,["kind","from","to","label"])&&Object.values(a).every(Pn),"Invalid relation fields");const l=o[a.kind];ce(Array.isArray(l)&&n.has(a.from)&&n.has(a.to)&&n.get(a.from)===l[0]&&n.get(a.to)===l[1],"Invalid relation endpoints");const c=JSON.stringify([a.kind,a.from,a.to,a.label]);ce(!i.has(c),"Duplicate relation"),i.add(c)}}function Ht(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function Tn(e){const t=[];let n="";return Ht(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),ce(!n,"Unclosed code fence"),t}function gi(e,t,n,o=[]){const i=Ht(e),s=Tn(e),a=Object.create(null);return ce(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([l,c],d)=>{ce(t.includes(c)&&!(c in a),n+": unsupported/duplicate "+c),a[c]=i.slice(l+1,s[d+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),ce(a[c]||o.includes(c),n+": empty "+c)}),ce(s.map(l=>l[1]).join("|")===t.join("|"),n+": invalid field order"),a}const Cs=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function kd(e){const t=Ht(e),n=Tn(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return ce(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],a)=>{const l=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);ce(l,"Invalid Finding ID");const c=l[1];ce(!o.has(c),"Duplicate Finding ID"),o.add(c);const d=gi(t.slice(i+1,n[a+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+c);ce(["question","correction"].includes(d["### Kind"]),"Invalid Finding Kind"),ce(["open","resolved"].includes(d["### Status"]),"Invalid Finding Status"),ce(["items","document","unassigned"].includes(d["### Scope"]),"Invalid Finding Scope");const r=d["### Targets"]==="(none)"?[]:Ht(d["### Targets"]).filter(f=>f.trim()).map(f=>(ce(f.startsWith("- ")&&br(f.slice(2)),"Invalid Finding target"),f.slice(2)));return ce(new Set(r).size===r.length,"Duplicate Finding target"),ce(d["### Scope"]==="items"?r.length>0:d["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:c,kind:d["### Kind"],status:d["### Status"],scope:d["### Scope"],targets:r,summary:d["### Summary"],content:d["### Content"],unresolvedTargets:[]}})}function Id(e,t){ce(!e.includes("<!--"),"HTML comments are unsupported");const n=Ht(e),o=Tn(e).filter(u=>u[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;ce(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const a={version:1,nodes:[],relations:[]},l=Object.create(null),c=new Set;o.slice(1).forEach(([u,h],g)=>{const p=o[g+2]?.[0]??n.length,m=n.slice(u+1,p).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(ce(m,"Empty section "+h),h==="# Findings"){ce(!c.has(h),"Duplicate Findings"),c.add(h),s=kd(m);return}if(["# Scope","# Graph exceptions"].includes(h)){ce(!c.has(h),"Duplicate "+h),c.add(h),h==="# Scope"?(ce(!Tn(m).length,"Scope must be prose"),a.scope=m):Ht(m).filter(B=>B.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(B=>{const k=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(B);ce(k,"Invalid exception"),a.relations.push({kind:k[1],from:k[2],to:k[3],label:k[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const S=i.exec(h);ce(S,"Unsupported heading "+h);const O=S[1],w=S[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");l[w]=n.slice(u,p).join(`
`);const E=B=>Tn(m).some(k=>k[1]===B);if(O==="Object"){const B=["## Scope","## Icon"];E("## Information")&&B.push("## Information");const k=gi(m,B,w);ce(["true","false"].includes(k["## Scope"]),"Invalid Scope");const M=Ht(k["## Information"]??"").filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(T=>(ce(/^- \S.*$/.test(T),"Invalid Information"),T.slice(2)));a.nodes.push({id:w,type:"object",name:w,scope:k["## Scope"]==="true",icon:k["## Icon"]==="(generic icon)"?"box":k["## Icon"],information:M});return}const C=["## Scope","## Why","## When"];E("## Exception When")&&C.push("## Exception When"),C.push("## Who","## Where","## How","### Input","### Procedure"),E("### Exception")&&C.push("### Exception"),C.push("### Output","## Result"),(E("## Problem")||E("## Pain level"))&&C.push("## Problem","## Pain level");const y=gi(m,C,w,["## How"]);ce(!y["## How"],"How must only contain fields"),ce(["true","false"].includes(y["## Scope"]),"Invalid Scope"),t?.activity?.(w,y);const P={id:w,type:"business",name:w,scope:y["## Scope"]==="true",why:y["## Why"],when:y["## When"],who:y["## Who"],where:y["## Where"],result:y["## Result"]};"## Problem"in y&&(P.problem=y["## Problem"],P.pain_level=y["## Pain level"]),a.nodes.push(P);for(const[B,k]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(B in y)||k!=="business-exception"&&y[B]==="(none)"||Ht(y[B]).filter(M=>M.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(M=>{const T=/^- (.+?) — (\S.*)$/.exec(M);ce(T,"Invalid relation in "+w),a.relations.push({kind:k,from:k==="output"?w:T[1],to:k==="output"?T[1]:w,label:T[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const d=a.nodes.filter(u=>u.type==="business").map(u=>u.id);wd(a),a.nodes.sort((u,h)=>Cs(u.id,h.id)),a.relations.sort((u,h)=>{for(const g of["kind","from","to","label"]){const p=Cs(u[g],h[g]);if(p)return p}return 0});const r=new Set(a.nodes.map(u=>u.id));for(const u of s)u.unresolvedTargets=u.targets.filter(h=>!r.has(h));return{graph:a,sections:l,markdown:e,activityOrder:d,findings:s}}const Sd=["id","from","activity","condition","to","effect","path","evidence","note"],qe=(e,t)=>{if(!e)throw Error(t)},uo=e=>typeof e=="string"&&!!e.trim();function xd(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());qe(n,"state-meta と遷移表が必要です");const o=or(n[1]);qe(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),qe(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),qe(o.object===t,"対象Objectが一致しません"),qe(Array.isArray(o.states)&&o.states.length>0&&o.states.every(d=>uo(d)&&!d.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),qe(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&uo(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=d=>(qe(d.startsWith("|")&&d.endsWith("|"),"表の行が不正です"),d.slice(1,-1).split("|").map(r=>r.trim())),a=s(i[0]);qe([Sd,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(d=>a.join("|")===d.join("|")),"表の列名が不正です"),qe(s(i[1]).length===a.length&&s(i[1]).every(d=>/^-+$/.test(d)),"表の区切りが不正です"),qe(i.length<=1002,"遷移は1000行以内にしてください");const l=new Set,c=i.slice(2).map(d=>{const r=s(d);qe(r.length===a.length&&r.every(uo),"表の列数・空欄が不正です");const f=Object.fromEntries(a.map((u,h)=>[u,r[h]]));return qe(/^T[0-9]+$/.test(f.id)&&!l.has(f.id),"遷移IDが不正または重複しています"),l.add(f.id),qe([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),qe(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),a.includes("exception")&&qe(f.path==="normal"?f.exception==="-":uo(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),qe(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),qe(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),qe(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),qe(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:c}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const js=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Ad(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let a=0;a<o.length;a++){const l=o[a];if(!s&&/^# Object /.test(l)?n=l.slice(9):!s&&/^# /.test(l)&&(n=null),!s&&l==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const c=[];let d="";for(a++;a<o.length;a++){const f=o[a];if(!d&&/^#{1,2} /.test(f)){a--;break}c.push(f),d=js(f,d)}const r=xd(c.join(`
`),n);if(r.error)throw Error(r.error);t.push(r.model);continue}i.push(l),s=js(l,s)}if(new Set(t.map(a=>a.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function Ed(e){const t=/^## State Transitions$/m.test(e)?Ad(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=Id(t.markdown,{activity:(c,d)=>i.set(c,d),document:(c,d)=>{n=c,o=d}}),a={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(c=>c.type==="object").map(c=>({id:c.id,name:c.name,scope:c.scope,icon:String(c.icon),information:c.information})),activities:(s.activityOrder??[]).map(c=>{const d=s.graph.nodes.find(f=>f.id===c),r=i.get(c);return{id:c,name:d.name,scope:d.scope,why:String(d.why),when:String(d.when),who:String(d.who),where:String(d.where),procedure:r["### Procedure"],exception:r["### Exception"]??null,result:String(d.result),problem:d.problem===void 0?null:String(d.problem),painLevel:d.pain_level===void 0?null:String(d.pain_level)}}),relations:s.graph.relations.map((c,d)=>({id:"legacy-relation-"+d,kind:c.kind,fromId:c.from,toId:c.to,label:c.label})),findings:(s.findings??[]).map(c=>({...c,sourceId:c.id,targetIds:c.targets.filter(d=>s.graph.nodes.some(r=>r.id===d))}))};a.exceptions=mr(a);const l=t.declarations.map((c,d)=>({id:"legacy-state-"+d,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:a.id,revision:a.revision,verification:"unverified"},objectId:c.object,states:c.states.map(r=>({id:r,name:r})),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(r=>({id:r.id,sourceId:r.id,fromId:r.from,toId:r.to,activityId:r.activity,exceptionId:hr(a,r.activity,r.exception),event:r.event??null,condition:r.condition,effect:r.effect,path:r.path,evidence:r.evidence,note:r.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:a,checks:[],states:l,diagnostics:[]}}}function Od({data:e,original:t}){if(e.version!==1)throw Error("Unsupported Viewer document version");const n=ir({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(n.diagnostics)]};const o=e.business,i=[...o.objects,...o.activities],s=c=>o.roles?.find(d=>d.id===c.roleId)?.name??c.who,a=[...o.objects.map(c=>({...c,type:"object"})),...o.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:s(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],l=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===o.id).map(c=>{const d=new Map(c.states.map(f=>[f.id,f.name])),r={object:i.find(f=>f.id===c.objectId).name,states:c.states.map(f=>f.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(f=>({id:f.sourceId,from:d.get(f.fromId)??f.fromId,to:d.get(f.toId)??f.toId,activity:f.activityId,...f.event?{event:f.event}:{},...f.exceptionId?{exceptionId:f.exceptionId,exception:o.exceptions?.find(u=>u.id===f.exceptionId)?.name}:{},condition:f.condition,...f.conditionLabel?{conditionLabel:f.conditionLabel}:{},effect:f.effect,path:f.path,evidence:f.evidence,note:f.note}))};return[c.objectId,{model:r}]})));return{graph:sr({version:1,...o.scope?{scope:o.scope}:{},nodes:a,relations:o.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(a.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},model:e,activityOrder:o.activities.map(c=>c.id),objectStateTransitions:l,findings:o.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(d=>i.find(r=>r.id===d)?.name??d)}))}}const gr=8*1024*1024;function yr(e){return/^\s*[\[{]/.test(e)}function vr(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Ms(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");vr(e);const n=pi(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Cd(e){if(!yr(e))return Ed(e);if(new TextEncoder().encode(e).byteLength>gr)throw Error("ローカルJSONは8MiB以内にしてください。");const t=or(e.replace(/^\uFEFF/,""));if(vr(t),["0.1","0.2","0.3"].includes(t?.formatVersion)){const n=Ms(vd(t),e);if(["0.1","0.2"].includes(t.formatVersion)){const o=n.data.business;o.schemaVersion="0.1",delete o.roles;for(const i of o.activities)delete i.roleId;n.data.diagnostics=n.data.diagnostics.filter(i=>!i.startsWith("Role未確定:"))}return n}return Ms(t,e)}function pn(e){return Od(Cd(e))}async function jd(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>gr)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!yr(n))throw Error("JSONファイルの本文を確認してください。");return pn(n)}const Md=(e,t)=>Wi(e,t,!1);async function Wi(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const a=setTimeout(s,3e4);try{const l=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!l.ok)throw Error("URL取得に失敗しました（HTTP "+l.status+"）。");const c=l.headers.get("content-type")?.toLowerCase()??"";if(c.includes("html")||!n&&c.includes("json")||c.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const d=2*1024*1024;if(Number(l.headers.get("content-length"))>d)throw Error("本文は2MiB以内にしてください。");const r=l.body?.getReader();if(!r)throw Error("本文を読み取れません。");let f=0,u="";const h=new TextDecoder;try{for(;;){const{done:g,value:p}=await r.read();if(g)break;if(f+=p.length,f>d){try{r.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}u+=h.decode(p,{stream:!0})}u+=h.decode()}finally{r.releaseLock()}if(n&&c.includes("json")&&!/^\s*[\[{]/.test(u))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(u))throw Error("HTMLページは読み込めません。");return u}catch(l){const c=i.signal.aborted;throw s(),c?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):l instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):l}finally{clearTimeout(a),t?.removeEventListener("abort",s)}}const ko=jd;async function Lo(e,t){return pn(await Wi(e,t))}function Ld(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return pn(e)}const Ro=e=>e==="question"?"要確認":"要修正";function Rd(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${Ro(o)} ${i}`)}return n}function Dd(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${Ro(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(ln(e.content)),t}function Nd(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function Pd(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${Ro(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function Td(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const a=document.createElement("label");a.className="finding-filter";const l=document.createElement("input");l.type="checkbox",l.checked=t,l.onchange=()=>n(l.checked),a.append(l,document.createTextNode("解消済みも表示")),s.append(a);const c=(r,f,u)=>{const h=document.createElement("button");h.className="node-navigate finding-index-row",h.dataset.findingKey=r.type+":"+r.id;const g=document.createElement("strong");g.textContent=f;const p=document.createElement("span");return p.textContent=u,h.append(g,p),h.onclick=()=>o(r),h},d=e.graph.nodes.filter(r=>(!i||r.id===i)&&typeof r.problem=="string");if(d.length){const r=document.createElement("h3");r.textContent="困りごと",s.append(r);for(const f of d)s.append(c({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[r,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const u=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(r==="broken"?g.unresolvedTargets.length>0:g.scope===r&&!g.unresolvedTargets.length));if(!u.length)continue;const h=document.createElement("h3");h.textContent=`${f}（${u.length}件）`,s.append(h);for(const g of u)s.append(c({type:"finding",id:g.id},`${Ro(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const r=document.createElement("p");r.textContent="表示する指摘はありません。",s.append(r)}return s}function qd(e){const t=ar(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,a)=>s===i[a]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...sa(),viewInset:[40,0],canvasOrigin:void 0}}function Wd(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function zi(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function zd(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{zi(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function Ud(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(zi(t)),n.href}function $d(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return zi(t)}const Ui=`# Alderを使った設計業務 — Business Design

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
`,Fd=`{
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
`;function Vd(e,t){const n=new Set(t.graph.nodes.map(u=>u.id)),o=new Map;for(const u of t.graph.nodes)o.set(u.name,o.has(u.name)?void 0:u.id);const i=u=>n.has(u)?u:o.get(u),s=Object.create(null);for(const[u,h]of Object.entries(e.positions)){const g=i(u);g&&(s[g]=h)}const{scroll:a,zoom:l,viewInset:c,canvasOrigin:d,showExceptions:r,selectedEdgesOnly:f}=e;return{positions:s,scroll:a,zoom:l,viewInset:c,canvasOrigin:d,showExceptions:r,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(u=>{const h=i(u);return h?[h]:[]}))]}}}const Bd=`# Alderのチェックリストサンプル

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
`;function Gd(e,t,n,o,i=()=>!0,s=()=>{}){const a=e.ownerDocument,l=a.defaultView;let c,d=0,r=0,f=!1,u=null,h="";const g=new Map,p=()=>{c!==void 0&&(l.clearTimeout(c),d=Math.max(0,d-(Date.now()-r)),c=void 0)},m=(w=!1)=>{if(w&&!i())return;p(),g.delete(h);const E=[...g].at(-1);if(E){O(E[1],"error",E[0]);return}const C=e.contains(a.activeElement);e.hidden=!0,t.textContent="",s(),C&&(u?.isConnected?u:o).focus({preventScroll:!0})},S=()=>{e.hidden||e.dataset.kind==="error"||f||a.hidden||e.contains(a.activeElement)||(p(),r=Date.now(),c=l.setTimeout(m,d))};e.addEventListener("pointerenter",()=>{f=!0,p()}),e.addEventListener("pointerleave",()=>{f=!1,S()}),e.addEventListener("focusin",w=>{const E=w.relatedTarget;E&&!e.contains(E)&&(u=E),p()}),e.addEventListener("focusout",()=>l.setTimeout(S,0)),e.addEventListener("keydown",w=>{w.key==="Escape"&&(w.preventDefault(),w.stopPropagation(),m(!0))}),a.addEventListener("visibilitychange",()=>a.hidden?p():S()),n.onclick=()=>m(!0);const O=(w,E,C)=>{p(),e.contains(a.activeElement)||(u=a.activeElement),h=C,e.dataset.kind=E,e.dataset.key=C,t.setAttribute("role",E==="error"?"alert":"status"),t.setAttribute("aria-live",E==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=w,s(),d=E==="warning"?8e3:5e3,S()};return(w,E="success",C="operation")=>{E==="error"&&w?(g.delete(C),g.set(C,w)):g.delete(C);const y=[...g].at(-1);if(y){if(!e.hidden&&t.textContent===y[1]&&h===y[0])return;O(y[1],"error",y[0]);return}if(!w){h===C&&m();return}!e.hidden&&t.textContent===w&&e.dataset.kind===E||O(w,E,C)}}const Ls=Fd,ut=document.querySelector("#app");ut.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong>Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let Ue;const v=e=>document.getElementById(e),wn=cr(location.pathname);wn.version&&(v("preview-badge").hidden=!1,v("preview-badge").textContent=`確認用 · ${wn.version}`,v("preview-badge").title=`PR #${wn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const An=e=>Et(e,{"stroke-width":1.8,"aria-hidden":"true"}),Kn=document.createElement("div");Kn.id="source-menu";Kn.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';ut.append(Kn);const Do=document.createElement("div");Do.id="checks-menu";Do.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';ut.append(Do);const un=document.createElement("section");un.id="check-followup";un.hidden=!0;un.setAttribute("aria-labelledby","check-followup-title");un.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(un);const No=document.createElement("div");No.id="check-followup-menu";No.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';ut.append(No);const St=document.createElement("input");St.type="file";St.id="check-file";St.accept=".md,.markdown,text/markdown,text/plain";St.hidden=!0;ut.append(St);const Wt=document.createElement("section");Wt.id="check-url-dialog";Wt.hidden=!0;Wt.setAttribute("role","dialog");Wt.setAttribute("aria-labelledby","check-url-title");Wt.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';ut.append(Wt);const Po=document.createElement("div");Po.id="help-menu";Po.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${wn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${wn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${wn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;ut.append(Po);Mo(v("help-menu-toggle"),Po);const qn=document.createElement("div");qn.id="url-history";Kn.append(qn);function Hd(){if(qn.replaceChildren(),!x.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",qn.append(e);for(const t of x.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=ne||Ae||oe,n.onclick=()=>{Jd(t.url)},qn.append(n)}}async function Jd(e){if(!(ne||Ae||oe)){if(x.document?.source?.kind==="url"&&x.document.source.url===e){pe(),Ue?.reopenBusinessOverview(),x.active=x.tabs[0].key,Ie(),Zn();return}Ae=!0,Ie();try{const t=await Lo(e),n=jn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await Xn(n)}catch(t){t instanceof Cn||Me("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Ae=!1,Ie()}}}const _d=Mo(v("open-menu-toggle"),Kn),Kd=Mo(v("open-checks"),Do,()=>{const e=K();v("check-open-sample").hidden=!e||!Gi(e),v("check-close").disabled=!e?.checks}),wr=Mo(v("check-followup-open"),No,()=>{v("check-followup-sample").hidden=!K()||!Gi(K())});for(const[e,t]of[["open-menu-toggle",cs],["open",cs],["open-url",ra],["open-text",aa],["view-markdown",ca],["open-checks",zs],["share-source",da],["refresh",la],["help-menu-toggle",ua],["drawer",fa],["node-list-toggle",pa],["node-list-close",Us],["display-settings-toggle",$s],["reset-layout",ma],["save-image",ha],["copy-image",ba],["out",Bs],["in",Gs]])v(e).prepend(An(t));rd(document.querySelector("header"));const yi=sd(document.querySelector(".tab-strip"));let x={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},ht=!0,Rt=!1,ne=!0,En=!1,cn=!1,Ae=!1,Rs=Promise.resolve(),Jt,fe,bt=0,oe=!1,Wn=!1,kn=0,Io=0,In=!1,$i=!1,vi=!1,Ds=!1;const wi=new Set,Dt=new Set,So=new Set;function kr(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of So){const o=[...x.document?[x.document]:[],...x.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&So.delete(n)}}const K=()=>x.tabs.find(e=>e.key===x.active),fn=e=>Pt(e)?.key??e.key,Tt=e=>x.document?.key===fn(e);let ki="";const Xd=Gd(v("status"),v("status-text"),v("status-close"),v("viewport"));function Me(e,t="success",n="operation"){if(n==="storage"){if(ki===e)return;ki=e}Xd(e,t,n)}function Fi(){Me("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Vi(){Me("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Ot(){ne||(bt++,Ge())}function Zd(e){e.preventDefault(),e.returnValue=!0}function Ge(){const e=bt>kn||Io>0||!1||oe||So.size>0||vi||In||cn,t=!ne&&e;t!==Ds&&(Ds=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Zd));const n=ne?"restoring":En?"protected":cn?"conflict":In?"error":vi||So.size>0?"draft":Io>0||oe?"saving":bt>kn?"dirty":$i?"saved":"unchanged";ut.dataset.saveState!==n&&(ut.dataset.saveState=n),En?Fi():cn?Vi():In?Me("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):Me("","success","storage"),qo()}function Bi(e){In=!0,ki=""}function To(){if(En)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(cn)throw new Ti}async function Yd(e){To();try{await zc(e)}catch(t){throw t instanceof Ti&&(cn=!0,clearTimeout(Jt),Jt=void 0,Vi()),t}}function Ir(e,t){Io++,wi.add(t),Ge();const n=Rs.catch(()=>{}).then(()=>Yd(e)).then(()=>{kn=Math.max(kn,t),$i=!0,kr(e),kn===bt&&(In=!1)},o=>{throw Bi(),o}).finally(()=>{Io--,wi.delete(t),Ge()});return Rs=n.catch(()=>{}),n}function me(e=180,t=!0){if(ne)return;if(t&&bt++,clearTimeout(Jt),Jt=void 0,En){Fi(),Ge();return}if(cn){Vi(),Ge();return}if(oe||wi.has(bt)||!t&&bt<=kn&&!In){Ge();return}const n=()=>{Jt=void 0;let o;try{o=structuredClone(qi(x))}catch{Bi(),Ge();return}Ir(o,bt).catch(()=>Ge())};e===0?n():Jt=window.setTimeout(n,e),Ge()}async function Qd(e){if(ne||fe||oe||!x.tabs.includes(e))return;if(Un(e)===void 0){Ue?.closeBusinessOverview();return}ot.cancel(),pe();const t=x.active===e.key,n={...x,tabs:x.tabs.filter(o=>o!==e),active:t?x.tabs[0]?.key:x.active};try{await Uo(()=>n,()=>{x=n}),t&&ut.dataset.workspaceArea==="business"&&Ue?.businessActivated()}catch{Ge()}}function et(){v("drawer").setAttribute("aria-label","業務内容開閉"),v("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!K(),t=e&&x.drawer,n=e&&!!x.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Rt=!1),qo(),v("layout-lock").replaceChildren(An(ht?Fs:Vs)),v("layout-lock").setAttribute("aria-pressed",String(ht)),v("layout-lock").title=ht?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",v("layout-lock").toggleAttribute("disabled",ne),v("viewport").dataset.layoutLocked=String(ht),v("prefer-write").checked=x.preferWrite===!0,v("prefer-write").disabled=ne,v("show-exceptions").checked=K()?.showExceptions!==!1,v("show-exceptions").disabled=ne||oe||!K()||fe===K(),v("selected-edges-only").checked=K()?.selectedEdgesOnly===!0,v("selected-edges-only").disabled=ne||oe||!K()||fe===K(),document.documentElement.dataset.theme=x.dark?"dark":"light",v("theme").replaceChildren(An(x.dark?Ia:Sa)),v("formattedMarkdownDrawer").hidden=!t,v("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(x.width,innerWidth*.65))+"px",v("drawer").setAttribute("aria-expanded",String(t)),v("drawer").toggleAttribute("disabled",ne||!e),v("node-list-drawer").hidden=!n||tt().mode!=="findings",v("node-list-toggle").setAttribute("aria-expanded",String(n)),v("node-list-toggle").toggleAttribute("disabled",ne||!e),Ue?.syncChrome()}function Ii(){for(const e of["save-image","copy-image"]){const t=v(e);t.hidden=!K(),t.disabled=Wn||ne||!K()||fe===K(),t.setAttribute("aria-busy",String(Wn))}}function qo(){Ii(),document.querySelector(".toolbar").dataset.settingsOpen=String(Rt),v("display-options").hidden=!Rt,v("reset-layout").disabled=ne||Ae||oe||!1||!K()||Dt.has(x.document?.key??"")||En||cn;const e=v("display-settings-toggle"),t=Rt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Rt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=ne||oe||!K()||fe===K()}function Sr(e,t=!1){const n=K();ne||oe||!n||fe===n||e===Rt||(e&&(On.delete(Pt(n)?.key??n.key),Wo()),ot.cancel(),xe=void 0,pe(),Rt=e,qo(),At(n),!e&&(t||v("display-options").contains(document.activeElement))&&v("display-settings-toggle").focus({preventScroll:!0}))}async function xr(e){const t=K();if(!(Wn||ne||!t||fe===t)){Wn=!0,Ii();try{const n=md(v("nodes"),v("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await gd(n),Me("グラフ全体のPNGをコピーしました。")):await bd(n,(Pt(t)?.name??t.name)+(Un(t)?" - "+Un(t):""))}catch(n){Me((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{Wn=!1,Ii()}}}v("save-image").onclick=()=>xr(!1);v("copy-image").onclick=()=>xr(!0);v("display-settings-toggle").onclick=()=>Sr(!Rt);v("reset-layout").onclick=()=>{const e=K();if(ne||Ae||oe||fe||!e||Dt.has(fn(e)))return;try{To()}catch{Ge();return}ot.cancel(),Gt.cancel(),xe=void 0,pe();const t={...e,design:Co(e)},n=qd(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Mr.invalidate(e),Ie(),n!==t&&me()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Rt&&v("source-dialog").hidden&&(e.preventDefault(),Sr(!1,!0))});function pe(e=!0){const t=K();if(!t)return!1;const n=[v("viewport").scrollLeft,v("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Ot(),me(180,!1)),o}function Ar(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function Si(){_d.close(),Kd.close(),wr.close(),yi.close(),Ar(el),yi.update()}function el(){const e=v("tabs");e.replaceChildren(),x.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===x.active?" active":""),n.draggable=Un(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",vo(t)!==void 0&&(n.dataset.activity=vo(t)),wo(t)!==void 0&&(n.dataset.object=wo(t));const o=document.createElement("button");ci(o,"business",t.name),o.setAttribute("aria-current",String(t.key===x.active)),o.disabled=oe,o.onclick=async()=>{if(oe||gt&&gt!==t.key&&!await Fo())return;const s=pe()||x.active!==t.key;Ue?.activateBusiness(),x.active=t.key,Ie(),Ue?.businessActivated(),me(180,s)};const i=di("業務設計："+t.name+"を閉じる");i.disabled=oe,i.onclick=()=>Qd(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),oe)return;const a=x.tabs.findIndex(c=>c.key===s.dataTransfer?.getData("text/plain")),l=x.tabs.indexOf(t);if(a>0&&l>0&&a!==l){const[c]=x.tabs.splice(a,1);x.tabs.splice(l,0,c),Si(),me()}},n.onkeydown=s=>{if(!oe&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const a=x.tabs.indexOf(t),l=a+(s.key==="ArrowLeft"?-1:1);a>0&&l>0&&l<x.tabs.length&&([x.tabs[a],x.tabs[l]]=[x.tabs[l],x.tabs[a]],Si(),me())}},e.append(n)})}const Ns=new Map,On=new Set;function Wo(){const e=K(),t=!!e&&e.design.sourceFormat!=="json"&&On.has(Pt(e)?.key??e.key)&&!e.checks;t||(wr.close(),un.contains(document.activeElement)&&v("viewport").focus({preventScroll:!0})),un.hidden=!t;for(const n of["check-followup-open","check-followup-later"])v(n).disabled=ne||Ae||oe||!1||!e||Zt(e).busy===!0}v("check-followup-later").onclick=()=>{const e=K();e&&On.delete(Pt(e)?.key??e.key),Wo()};let xi;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])v("check-followup-"+e).onclick=()=>{xi=v("check-followup-open"),v(t).click(),xi=void 0};function Gi(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Ui}function Zt(e){const t=Pt(e)?.key??e.key;let n=Ns.get(t);return n||(n={},Ns.set(t,n)),n}async function Hi(e,t){if(!Tt(e))throw Error("原本文書が切り替わりました。");const n=Xt(x,x.recovery,{...x.document,checks:t},qi(x).views);await Uo(()=>n,()=>{x=n,t&&On.delete(Pt(e)?.key??e.key)})}async function Er(e,t){const n=Zt(e);if(e.design.sourceFormat==="json"||n.busy||oe||ne||fe===e)return;const o=$n(e);n.busy=!0,n.error=void 0,n.candidate=void 0,qt();try{const i=await t();if(!Tt(e))return;if(o!==$n(x.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=xn(i),a=Fn(s,x.tabs[0]);if(a.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+a.reason);a.state==="unverified"?n.candidate=i:(await Hi(e,i),n.candidate=void 0,Ue?.openRelatedChecks(K()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,Me(n.error,"error")}finally{n.busy=!1,qt()}}async function Or(e,t){const n=Zt(e);if(n.busy||oe||!Tt(e))return;const o=Fn(xn(t),x.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,qt();return}n.busy=!0,n.error=void 0;try{await Hi(e,{...t,confirmedFor:$n(x.tabs[0])}),n.candidate=void 0,Ue?.openRelatedChecks(K()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,qt()}}function qt(){Wo();const e=K(),t=v("detail"),n=e?Zt(e):void 0,o=e?e.key+":"+(e.selected??""):"";v("open-checks").disabled=ne||oe||fe===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const a=e.design.graph.nodes.find(f=>f.id===e.selected),l=id(e,n,{disabled:ne||oe||fe===e,redraw:qt,confirm:f=>{Or(e,f)}}),c=document.createElement("div");c.className="right-drawer-heading";const d=Ba(a?.name??"業務設計");if(a){const f=a.type==="business"?Cr(String(a.who),a.id):Ys(a);f.classList.add("drawer-node-icon"),d.prepend(f)}c.append(d);const r=document.createElement("button");if(r.type="button",r.id="business-drawer-close",r.setAttribute("aria-label","右ドロワーを閉じる"),r.textContent="×",r.onclick=()=>{v("drawer").click(),v("drawer").focus({preventScroll:!0})},c.append(r),t.append(c),l.hasChildNodes()&&t.append(l),a){const f=Pd(e.design,a.id,Ji);f.hasChildNodes()&&t.append(f)}t.append(vc(e.design,a?.id)),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Ps=new Map,tt=()=>{const e=x.active??"";let t=Ps.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Ps.set(e,t)),t};function Ji(e){if(!K())return;const t=tt();t.mode="findings",t.finding=e,x.nodeDrawer=!0,innerWidth<=800&&(x.drawer=!1),et(),lt(),v("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),me()}function tl(e){const t=K();if(!t)return;const n=tt();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){Ji(o[0]);return}x.nodeDrawer=!0,innerWidth<=800&&(x.drawer=!1),et(),lt(),v("drawer-mode-findings").focus({preventScroll:!0}),me()}function nl(e,t){const n=tt().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(l=>l.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(l=>l.id===n.id&&typeof l.problem=="string"):void 0;if(!o&&!i)return tt().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{tt().finding=void 0,lt(),v("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(Dd(o));else{const l=document.createElement("h2");l.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(l,ln(String(i.problem)))}const a=o?.targets??[i.id];if(a.length){const l=document.createElement("section"),c=document.createElement("h3");c.textContent="関連項目へ移動",l.append(c);for(const d of a){const r=document.createElement("button");r.className="node-navigate finding-target-link",r.dataset.findingTarget=d;const f=e.design.graph.nodes.some(h=>h.id===d),u=e.hiddenNodes?.includes(d);r.disabled=!f||!!u,r.textContent=(e.design.graph.nodes.find(h=>h.id===d)?.name??d)+(f?u?"（非表示）":"":"（参照先なし）"),r.onclick=()=>mo(d,!0),l.append(r)}t.append(l)}return!0}function Cr(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&K()?.design.model?.business.roles?Di(K().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(An(_s)),o}function zo(e,t=!0){ne||!K()||(ot.cancel(),pe(),x.nodeDrawer=e,e&&tt().mode==="findings"&&innerWidth<=800&&(x.drawer=!1),et(),e&&K()?.selected&&Mn(K().selected),lt(),t&&v(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),me())}function Mn(e){const t=K(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=tt();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(Va(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(v("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function ol(e,t){const n=K();if(!n||ne||oe||fe===n)return;ot.cancel(),xe=void 0,pe();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],Yt(),me()}function mo(e,t=!1){let n=K();if(n&&!Co(n).graph.nodes.some(f=>f.id===e)&&(pe(),Ue?.reopenBusinessOverview(),x.active=x.tabs[0].key,n=K(),Ie()),!n||n.hiddenNodes?.includes(e)||fe===n)return;t||(tt().finding=void 0);const o=v("node-list").contains(document.activeElement);ot.cancel(),xe=void 0,pe(),n.selected=e,Mn(e),et(),Yt();const i=v("viewport"),s=i.getBoundingClientRect(),a=v("formattedMarkdownDrawer").getBoundingClientRect(),l=x.drawer&&a.left>s.left&&a.left<s.right?a.left:s.right,c=Math.max(1,Math.min(i.clientWidth,l-s.left-i.clientLeft)),d=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const r=n.positions[e];if(n.scroll=[(r[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-c/2,(r[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-d/2],At(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],pe(),o){const f=t?"[data-finding-target]":"[data-list-node]",u=Array.from(v("node-list").querySelectorAll(f)).find(h=>(t?h.dataset.findingTarget:h.dataset.listNode)===e);(t?u:u?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}me()}function lt(){const e=K(),t=tt(),n=v("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=v("drawer-modes");s.replaceChildren();for(const g of["findings"]){const p=document.createElement("button");p.id="drawer-mode-"+g,p.setAttribute("role","tab"),p.setAttribute("aria-selected",String(t.mode===g)),p.setAttribute("aria-controls","node-list"),p.tabIndex=t.mode===g?0:-1,p.textContent=`指摘（${e?Nd(e.design):0}）`;const m=()=>{t.mode=g,lt(),v("drawer-mode-"+g).focus({preventScroll:!0})};p.onclick=m,p.onkeydown=S=>{["ArrowLeft","ArrowRight","Home","End"].includes(S.key)&&(S.preventDefault(),p.focus({preventScroll:!0}))},s.append(p)}for(const g of[v("node-categories"),v("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const a=v("node-list-search");a.value=t.search,a.disabled=!e||ne;const l=v("node-categories");l.replaceChildren();for(const[g,p]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const m=document.createElement("button");m.dataset.category=g,m.id="node-category-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.category===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.category===g?0:-1,m.textContent=p,m.onclick=()=>{t.category=g,lt(),v("node-category-"+g).focus({preventScroll:!0})},m.onkeydown=S=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(S.key))return;S.preventDefault();const O=["activity","object","role"],w=O.indexOf(g);t.category=S.key==="Home"?"activity":S.key==="End"?"role":O[(w+(S.key==="ArrowRight"?1:2))%3],lt(),v("node-category-"+t.category).focus({preventScroll:!0})},l.append(m)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const c=new Set(e?.hiddenNodes??[]),d=e?.design.graph.nodes.filter(g=>!g.scope)??[],r=d.filter(g=>!c.has(g.id)).length,f=v("scope-outside"),u=r===d.length?"true":r===0?"false":"mixed";f.setAttribute("aria-pressed",u),f.setAttribute("aria-label",u==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(An(u==="false"?xa:Aa)),f.disabled=!d.length||ne||fe===e;const h=v("show-outside");if(h.checked=u==="true",h.indeterminate=u==="mixed",h.setAttribute("aria-checked",u),h.disabled=f.disabled,v("scope-count").textContent=u==="mixed"?`${r}/${d.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(nl(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(m=>m.id===t.filterNode)?.name??t.filterNode)+"の指摘";const p=document.createElement("button");p.className="node-navigate finding-all",p.textContent="すべての指摘",p.onclick=()=>{t.filterNode=void 0,lt(),v("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,p)}n.append(Td(e.design,t.resolved,g=>{t.resolved=g,lt(),n.querySelector("input")?.focus({preventScroll:!0})},Ji,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}v("node-list-toggle").onclick=()=>zo(!x.nodeDrawer);v("node-list-close").onclick=()=>zo(!1);v("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),zo(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!v("node-list-drawer").hidden&&v("source-dialog").hidden&&(e.preventDefault(),zo(!1))});v("node-list-search").oninput=()=>{tt().search=v("node-list-search").value,lt()};function jr(){const e=K();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);ol(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}v("scope-outside").onclick=jr;v("show-outside").onchange=jr;const il="http://www.w3.org/2000/svg",oi=e=>document.createElementNS(il,e),Mr=new mi,Ts=new WeakMap;function sl(e){if(!Zs(e.graph))return;let t=Ts.get(e);return t||(t=qc(e),Ts.set(e,t)),t.wires}function rl(e,t,n){Li(v("edges"),e,t,{"data-relation":String(n)})}let Vn=()=>{},Lt=[0,0],Bt=[0,0];function al(){const e=v("node-list-drawer");return v("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function cl(){const e=v("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function At(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],Bt[0]):0,i[1]<0||n[1]>0?Math.min(i[1],Bt[1]):0],{growth:a,origin:l}=ka(n,s,e.zoom),c=a.some(Boolean);c&&(e.canvasOrigin=l,e.scroll=[e.scroll[0]+a[0],e.scroll[1]+a[1]],Ot(),me(180,!1));const d=Math.ceil(Math.max(1400,Lt[0],(al()+e.scroll[0])/e.zoom-t[0]*2-l[0],...o.map(f=>f[0]+340))),r=Math.max(850,Lt[1],Math.max(Lt[1],...o.map(f=>f[1]+68))+cl()/e.zoom-t[1],(v("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-l[1],...o.map(f=>f[1]+220));v("canvas").style.width=(d+l[0]+t[0]*2)*e.zoom+"px",v("canvas").style.height=(r+l[1]+t[1]*2)*e.zoom+"px",v("nodes").style.left=(l[0]+t[0])*e.zoom+"px",v("nodes").style.top=(l[1]+t[1])*e.zoom+"px",v("edges").style.left=t[0]*e.zoom+"px",v("edges").style.top=t[1]*e.zoom+"px",v("nodes").style.width=d+"px",v("nodes").style.height=r+"px",v("nodes").style.transform=`scale(${e.zoom})`,v("edges").setAttribute("viewBox",`${-l[0]} ${-l[1]} ${d+l[0]} ${r+l[1]}`),v("edges").style.width=(d+l[0])*e.zoom+"px",v("edges").style.height=(r+l[1])*e.zoom+"px",c&&(v("viewport").scrollLeft=e.scroll[0],v("viewport").scrollTop=e.scroll[1]),v("zoom").textContent=Math.round(e.zoom*100)+"%"}function Yt(){Ar(dl)}function dl(){qo(),Gt.cancel(),Vn=()=>{},Lt=[0,0],Bt=[0,0];const e=K();if(v("nodes").replaceChildren(),v("edges").replaceChildren(),v("empty").hidden=!!e,v("canvas").hidden=!e,!e){v("viewport").scrollLeft=0,v("viewport").scrollTop=0,qt(),lt();return}const t=Co(e),n=t.graph.nodes,o=n.filter(r=>!e.hiddenNodes?.includes(r.id)),i=new Set(o.map(r=>r.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,a=e.positions,l=go(t.graph.relations,s);At(e),v("edges").append(Mi());const c=Wd(t.graph.relations,x.preferWrite===!0),d=()=>{const r=n.flatMap(m=>{const S=a[m.id];return S?[{id:m.id,x:S[0],y:S[1],width:260,height:68}]:[]}),f=sl(t),u=Mr.update(e,t,r,t.graph.relations,f),h=new Map;for(Lt=[0,0],Bt=[0,0];v("edges").childNodes.length>1;)v("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(m=>[m.id,m.name]));t.graph.relations.forEach((m,S)=>{if(c.has(S))return;const O=u[S];if(!O||(Lt[0]=Math.max(Lt[0],O.bounds.right+20,O.label[0]+Math.max(30,m.label.length*12)/2+12),Lt[1]=Math.max(Lt[1],O.bounds.bottom+20,O.label[1]+22),Bt[0]=Math.min(Bt[0],...O.points.map(B=>B[0]-20),O.label[0]-Math.max(30,m.label.length*12)/2-12),Bt[1]=Math.min(Bt[1],...O.points.map(B=>B[1]-20),O.label[1]-22),e.selectedEdgesOnly===!0&&l.muted(m)||!i.has(m.from)||!i.has(m.to)||e.showExceptions===!1&&(m.kind==="business-exception"||m.kind==="object-exception")))return;const w=oi("path");w.setAttribute("d",O.path),w.dataset.relation=String(S),w.dataset.collisions=String(O.collisions),w.dataset.rerouted=String(O.rerouted),w.dataset.fallback=String(O.fallback),w.setAttribute("marker-end","url(#arrow)"),w.classList.add("edge"),m.kind.endsWith("exception")&&w.classList.add("exception"),l.related(m)&&(w.classList.add("review-related"),w.setAttribute("marker-end","url(#related-arrow)")),l.muted(m)&&w.classList.add("muted");const E=oi("title");E.textContent=(g.get(m.from)??m.from)+" → "+(g.get(m.to)??m.to)+": "+m.label,w.append(E),v("edges").append(w),m.kind.endsWith("exception")&&rl(w,O,S);const C=Xs(m,S,f?.[S]),y=h.get(C);if(y){y.dataset.relations+=" "+S,l.related(m)&&(y.classList.add("review-related"),y.classList.remove("muted"));return}const P=oi("text");h.set(C,P),P.dataset.relations=String(S),P.setAttribute("x",String(O.label[0]-Math.max(30,m.label.length*12)/2)),P.setAttribute("y",String(O.label[1])),P.setAttribute("text-anchor","start"),P.classList.add("edge-label"),P.setAttribute("dominant-baseline","middle"),P.dataset.relation=String(S),l.related(m)&&P.classList.add("review-related"),l.muted(m)&&P.classList.add("muted"),P.textContent=m.label,v("edges").append(P)});const p=v("edges");for(const m of[...Array.from(p.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(p.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(p.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(p.querySelectorAll(".edge-label.review-related"))])p.append(m);At(e)};Vn=d,d(),o.forEach(r=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+r.type+(r.scope?"":" outside")+l.nodeClasses(r.id),f.dataset.node=r.id,r.type==="business"&&(f.dataset.activity=r.id),f.style.left=a[r.id][0]+"px",f.style.top=a[r.id][1]+"px",r.type==="business"?f.append(Cr(String(r.who),r.id)):f.append(Ys(r));const u=document.createElement("span");u.className="node-text";const h=document.createElement("span");h.className="review-kind",h.textContent=(r.type==="business"?"Activity":"Object")+(r.scope?" · 範囲内":" · 範囲外"),u.append(h);const g=document.createElement("span");if(g.className="node-name",g.textContent=r.name,u.append(g),r.type==="business"){const w=document.createElement("small");w.textContent=String(r.who),u.append(w)}if(f.append(u),Ea(r.id,Un(e))){const w=document.createElement("button");w.type="button",w.className=r.type==="business"?"activity-open":"object-open",w.setAttribute("aria-label",r.name+"の詳細タブを開く"),w.title="詳細タブを開く",w.append(An(Jn)),w.onpointerdown=E=>E.stopPropagation(),w.onpointerup=E=>E.stopPropagation(),w.onclick=E=>{E.stopPropagation(),r.type==="business"?Ai(r.id):Lr(r.id),Ue?.businessActivated()},f.append(w)}f.title=r.name+(r.type==="business"?" — "+String(r.who):""),f.setAttribute("aria-label",f.title+(r.id===s?"（選択中）":""));const p=Rd(e.design,r);if(p.length){const w=document.createElement("button");w.type="button",w.className="finding-badges",w.textContent=p.join(" · "),w.setAttribute("aria-label",r.name+"の指摘を開く"),w.onpointerdown=E=>E.stopPropagation(),w.onpointerup=E=>E.stopPropagation(),w.onclick=E=>{E.stopPropagation(),tl(r.id)},f.append(w),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+p.join("、"))}let m;const S=f;S.onpointerdown=w=>{w.button!==0||fe===e||ht||(w.stopPropagation(),S.setPointerCapture(w.pointerId),m=w.pointerId,Gt.begin(r.id,[w.clientX,w.clientY]))},S.onpointermove=w=>{m===void 0||w.pointerId!==void 0&&w.pointerId!==m||!f.isConnected||fe===e||Gt.move([w.clientX,w.clientY])},S.onpointerup=w=>{if(m===void 0||m!==w.pointerId||(m=void 0,!f.isConnected||fe===e))return;const E=Gt.end();S.hasPointerCapture?.(w.pointerId)&&S.releasePointerCapture(w.pointerId),E&&(E.moved||(tt().finding=void 0,e.selected!==r.id&&(e.selected=r.id,Ot()),Mn(r.id)),pe(),Yt(),me(180,!1))};const O=w=>{m===void 0||m!==w.pointerId||(m=void 0,f.isConnected&&(Gt.cancel(),pe(),me(180,!1)))};S.onpointercancel=O,S.onlostpointercapture=O,v("nodes").append(f)}),v("zoom").textContent=Math.round(e.zoom*100)+"%",qt(),lt()}function Ai(e){ne||oe||fe||(pe(),_c(x,e),Ie(),me(),v("viewport").focus({preventScroll:!0}))}function Lr(e){ne||oe||fe||(pe(),Kc(x,e),Ie(),me(),v("viewport").focus({preventScroll:!0}))}function Ie(){document.title=x.document?x.document.name+" · Alder Viewer":"Alder Viewer",ot.cancel(),xe=void 0,et(),Si(),Yt();const e=K();e&&(v("viewport").scrollLeft=e.scroll[0],v("viewport").scrollTop=e.scroll[1]),v("refresh").toggleAttribute("disabled",ne||oe||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Dt.has(fn(e))),v("refresh").hidden=!e,v("view-markdown").toggleAttribute("disabled",ne||Ae||oe||!1||!e||Dt.has(fn(e))),v("view-markdown").hidden=!e,v("open-checks").hidden=!e||e.design.sourceFormat==="json",v("open-checks").toggleAttribute("disabled",ne||Ae||oe||!1||!e||!!(e&&Zt(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])v(t).toggleAttribute("disabled",ne||Ae||oe);v("open-sample").setAttribute("aria-disabled",String(ne||Ae||oe)),v("open-sample").tabIndex=ne||Ae||oe?-1:0,v("theme").toggleAttribute("disabled",ne),Hn(),Wo(),Hd(),Bo(),Ue?.syncDocument()}async function Xn(e){const t=x.document,n=Hc(x,e);return t?(await Uo(()=>n,()=>{x=n,On.add(Pt(x.tabs[0])?.key??x.tabs[0].key)}),!0):(pe(),x=n,On.add(Pt(x.tabs[0])?.key??x.tabs[0].key),Ie(),me(),!0)}async function Rr(e,t){if(gt&&!await Fo())return;const n=await ko(e),o=K();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await Bn(o,n,t))return;Ue?.reopenBusinessOverview(),x.active=x.tabs[0].key,Ie(),me();return}const i=jn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await Xn(i)}v("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])v("guide-"+e).onclick=()=>v(e).click();v("open-sample").onpointerdown=e=>e.stopPropagation();v("open-sample").onclick=async e=>{if(e.preventDefault(),!(ne||Ae||oe))try{if(x.document?.source?.kind==="sample"&&x.document.design.markdown===Ls){pe(),Ue?.reopenBusinessOverview(),x.active=x.tabs[0].key,Ie(),v("viewport").focus({preventScroll:!0});return}const t=pn(Ls),n=x.document?.source?.kind==="sample"&&x.document.design.markdown===Ui?x.tabs[0]:void 0;n&&pe();const o=n??x.sampleLayout,i=o?Vd(o,t):{},s=jn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await Xn(s)&&v("viewport").focus({preventScroll:!0})}catch(t){Me("サンプルを開けません: "+t.message,"error")}};v("open").onclick=async()=>{if(!(ne||Ae||oe)){Ae=!0,Ie();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Rr(await n.getFile(),n)}else v("fallback").click()}catch(e){e.name!=="AbortError"&&Me("開けません: "+e.message,"error")}finally{Ae=!1,Ie()}}};v("fallback").onchange=async()=>{const e=v("fallback");if(!(ne||Ae||oe)){Ae=!0,Ie();try{for(const t of Array.from(e.files??[]))await Rr(t)}catch(t){Me("開けません: "+t.message,"error")}e.value="",Ae=!1,Ie()}};class Cn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function Uo(e,t){if(oe||fe)throw Error("表示を切り替えています。完了後に再試行してください。");try{To()}catch(i){throw new Cn(i)}pe(),clearTimeout(Jt),Jt=void 0,oe=!0,bt++;const n=bt;Ie(),Ge();let o=!1;try{const i=structuredClone(qi(e()));await Ir(i,n);const s=x;t(),x!==s&&(x=Xc(x,s)),Qe==="view"&&gt&&!x.tabs.some(a=>a.key===gt)&&(gt=x.tabs[0]?.key),kr(i),o=!0}catch(i){throw Bi(),new Cn(i)}finally{oe=!1,Ie(),Ge(),o&&bt!==n&&me(0,!1)}}async function Bn(e,t,n=e.handle,o=!1){if(!Tt(e)||e.design!==x.document?.design)return!1;const i=Jc(x,t,n,o);return await Uo(()=>i,()=>{x=i}),dn=void 0,Bo(),Me(""),!0}async function qs(e){if(!Tt(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await Bn(e,await ko(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const a=i.files?.[0];a&&await Bn(e,await ko(a)),s()}catch(a){i.remove(),o(a)}},i.click()})}v("refresh").onclick=async()=>{const e=K();if(ne||oe||fe||!e||e.source?.kind==="text"||e.source?.kind==="sample"||Dt.has(fn(e)))return;gt===e.key&&Ao();const t=fn(e);Dt.add(t),Ie();try{if(e.source?.kind==="url"){const o=await Lo(e.source.url);await Bn(e,o);return}if(!e.handle){await qs(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!Tt(e))return;if(n!=="granted"){Me("読取権限がありません。同じMarkdownを再選択してください。","warning"),await qs(e);return}await Bn(e,await ko(await e.handle.getFile()))}catch(n){Tt(e)&&n.name!=="AbortError"&&!(n instanceof Cn)&&Me("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{Dt.delete(t),Ie()}};let Qe="text",gt,Nt=!1,_t=0,xo,Ei=null;const xt=()=>v("source-text"),Gn=()=>v("source-url");function _i(){vi=!v("source-dialog").hidden&&Qe!=="view"&&(Qe==="text"?xt().value:Gn().value)!=="",Ge()}Gn().addEventListener("input",_i);function Hn(){Oi();const e=Qe==="view",t=Nt||oe;xt().disabled=t,xt().readOnly=e,v("source-dialog").dataset.mode=Qe,v("source-submit").hidden=e,v("source-submit").textContent="表示",v("source-submit").disabled=t||e,v("source-cancel").disabled=oe||t&&Qe!=="url",v("source-cancel").textContent=e?"閉じる":"キャンセル",_i(),queueMicrotask(Pr)}function Ki(e,t){if(!(ne||Ae||oe||t&&Dt.has(fn(t)))){xo?.abort(),_t++,Qe=e,gt=t?.key,Nt=!1,Ei=document.activeElement,v("source-dialog").hidden=!1,v("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${x.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])v(n).hidden=e!=="url";for(const n of["text-label","source-text"])v(n).hidden=e==="url";v("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?xt().value=t.design.markdown:e==="text"&&(xt().value=$o),Hn(),(e==="url"?Gn():xt()).focus()}}let $o="",fo;function ll(){if(Ei?.isConnected&&Ei.focus({preventScroll:!0}),fo!==void 0&&cancelAnimationFrame(fo),Qe!=="view")return;const e=_t;fo=requestAnimationFrame(()=>{if(fo=void 0,e!==_t||!v("source-dialog").hidden)return;const t=window.visualViewport,n=ut.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function Ao(){_t++,xo?.abort(),Nt=!1,gt=void 0,v("source-dialog").hidden=!0,Hn(),ll()}async function Fo(){return oe?!1:(Qe==="text"&&($o=xt().value),Ao(),!0)}function Dr(){return Fo()}xt().oninput=()=>{Qe==="text"&&($o=xt().value,_i())};let ho=!1;function Nr(){return ne||Ae||Nt||oe||fe?"読込が終わってから共有してください。":zd(K())}function Oi(){const e=Nr(),t=v("share-source");t.hidden=!K(),t.setAttribute("aria-disabled",String(ho||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}v("share-source").onclick=async()=>{if(ho)return;const e=Nr();if(e){Me(e,"warning");return}const t=K();if(t.source?.kind!=="url")return;const n=t.source.url,o=Ud(location.href,n);ho=!0,Oi();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),Me("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{Me("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{ho=!1,Oi()}};let Mt,gn=0,Ws=0,zn;function Pr(){if(ne||Ae||Nt||fe||oe||Mt||zn===void 0)return;const e=zn;zn=void 0,Xi(e)}async function Xi(e=location.hash){const t=e;if(ne)return;const n=++Ws;if(!/^#source(?:=|$)/.test(t)){zn=void 0,Mt&&!oe&&(Mt.abort(),Mt=void 0,gn++,Ae=!1,Ie());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),oe){zn=t;return}if(Nt||Ae&&!Mt){Me("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++gn;Mt?.abort();try{const i=$d(t);To();const s=x.tabs.find(d=>d.source?.kind==="url"&&d.source.url===i),a=s;if(a){if(gt&&gt!==a.key&&!await Fo()||o!==gn||n!==Ws)return;const d=pe()||x.active!==a.key;x.active=a.key,Ie(),me(180,d),Me("開いている共有元のタブを選択しました。表示内容は保持しています。"),Zn();return}Mt=new AbortController,Ae=!0,Ie();const l=await Lo(i,Mt.signal);if(o!==gn)return;const c=jn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:l,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},l);if(!await Xn(c))return;Me("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===gn&&!(i instanceof Cn)&&Me("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===gn&&(Mt=void 0,Ae=!1,Ie(),Pr())}}window.addEventListener("hashchange",()=>{Xi().then(()=>{x.document?.key===Ci&&Zn()})});function Zi(e){x.drawer=!0,et(),qt()}async function ul(e){const t=Zt(e);if(!(e.design.sourceFormat==="json"||t.busy||oe||ne||fe===e)){t.busy=!0;try{await Hi(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,qt()}}}let Eo;St.onchange=()=>{const e=St.files?.[0],t=Eo??K();Eo=void 0,St.value="",!(!e||!t||!Tt(t))&&(Zi(),Er(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};St.oncancel=()=>{Eo=void 0};v("check-open").onclick=()=>{Eo=K(),St.click()};let Yi,bo=null;function Qi(){Wt.hidden=!0,Yi=void 0,(bo&&!bo.closest("[hidden]")?bo:v("open-checks").getBoundingClientRect().width?v("open-checks"):v("document-actions-toggle")).focus({preventScroll:!0})}v("check-open-url").onclick=()=>{const e=K();e&&(bo=xi??document.activeElement,Yi=e,v("check-url").value=Zt(e).url??"",Wt.hidden=!1,v("check-url").focus())};v("check-url-cancel").onclick=Qi;Wt.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Qi())};v("check-url-form").onsubmit=e=>{e.preventDefault();const t=Yi;if(!t||!Tt(t))return;const n=v("check-url").value.trim();Zt(t).url=n,Qi(),Zi(),Er(t,async()=>({name:n,url:n,markdown:await Md(n)}))};v("check-open-sample").onclick=()=>{const e=K();!e||!Gi(e)||(Zi(),Or(e,{name:"チェックリストのサンプル",markdown:Bd}))};v("check-close").onclick=()=>{const e=K();e&&ul(e)};v("open-sample-menu").onclick=()=>{v("open-sample").click()};v("view-markdown").onclick=()=>{const e=K();e&&Ki("view",e)};v("open-url").onclick=()=>Ki("url");v("open-text").onclick=()=>Ki("text");v("source-cancel").onclick=()=>Dr();v("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),Dr())};v("source-submit").onclick=async()=>{if(Nt||oe||Qe==="view"&&fe||v("source-dialog").hidden||Qe==="view")return;Nt=!0,Hn();const e=++_t,t=Qe;xo=new AbortController;try{const n=Qe==="url"?new URL(Gn().value.trim()).href:Gn().value.trim();if(t==="url"&&x.document?.source?.kind==="url"&&x.document.source.url===n){Ue?.reopenBusinessOverview(),x.active=x.tabs[0].key,Ao(),Ie(),Zn();return}const o=t==="url"?await Lo(n,xo.signal):Ld(xt().value),i=o.markdown;if(e!==_t)return;const s=jn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await Xn(s))return;Me(""),t==="text"&&($o=i),Ao()}catch(n){e===_t&&!(n instanceof Cn)&&Me("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===_t&&(Nt=!1,Hn())}};v("layout-lock").onclick=()=>{ne||(ot.cancel(),xe=void 0,pe(),ht=!ht,et(),Yt())};v("selected-edges-only").onchange=()=>{const e=K();!e||ne||oe||fe===e||(ot.cancel(),xe=void 0,pe(),e.selectedEdgesOnly=v("selected-edges-only").checked,Vn(),me())};v("show-exceptions").onchange=()=>{const e=K();!e||ne||oe||fe===e||(ot.cancel(),xe=void 0,pe(),e.showExceptions=v("show-exceptions").checked,Vn(),me())};v("prefer-write").onchange=()=>{ne||(pe(),x.preferWrite=v("prefer-write").checked,Yt(),me())};v("theme").onclick=()=>{ne||(x.dark=!x.dark,et(),me())};v("drawer").onclick=()=>{ne||!K()||(pe(),x.drawer=!x.drawer,Ie(),me())};for(const[e,t]of[["in",ds],["out",1/ds]])v(e).onclick=()=>{const n=K();if(n&&fe!==n){const o=pe(),i=ga({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,Ie(),me(180,s)}};const ye=v("viewport");function Tr(e,t){const n=K();if(!n||oe||fe===n)return;pe();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Ot();const i=Array.from(v("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),Vn()}const Gt=wa({read:()=>{const e=K();return e&&!oe&&e!==fe&&!ht&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[ye.scrollLeft,ye.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>K()?.positions[e],connected:e=>Array.from(v("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=ye.getBoundingClientRect(),t=e.left+ye.clientLeft,n=e.top+ye.clientTop,o={left:t,top:n,right:t+ye.clientWidth,bottom:n+ye.clientHeight};for(const[s,a]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const l=v(s),c=l.getBoundingClientRect();l.hidden||c.bottom<=n||c.top>=o.bottom||(a==="right"&&c.left>o.left&&c.left<o.right&&(o.right=c.left),a==="left"&&c.right>o.left&&c.right<o.right&&(o.left=c.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:Tr,pan:e=>{const t=K();if(!t||t===fe||ht)return;pe();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],At(t),ye.scrollLeft=t.scroll[0],ye.scrollTop=t.scroll[1],pe(),Ot()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),ot=ya(ye,{nodeDrag:Gt,read:()=>{const e=K();return e&&!oe&&fe!==e?{key:e.key,zoom:e.zoom,locked:ht,scroll:[ye.scrollLeft,ye.scrollTop]}:void 0},position:e=>K()?.positions[e],change:e=>{const t=K();if(!t||oe||fe===t)return;const n=t.scroll;let o=!1;e.node&&Tr(e.node.id,e.node.position),e.selected&&(tt().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Mn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?Yt():e.zoom!==void 0&&At(t),e.scroll&&(ye.scrollLeft=e.scroll[0],ye.scrollTop=e.scroll[1]),pe(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Ot()},finish:()=>{const e=K();e&&At(e),pe(),me(180,!1)}}),es=()=>{ot.cancel(),xe=void 0,pe(),me(0,!1)};window.addEventListener("blur",es);window.addEventListener("pagehide",es);document.addEventListener("visibilitychange",()=>{document.hidden&&es()});ye.onscroll=()=>{pe()};let xe;va(ye,{read:()=>{const e=K();return e&&!ne&&!oe&&e!==fe?{zoom:e.zoom,scroll:[ye.scrollLeft,ye.scrollTop]}:void 0},change:e=>{const t=K();!t||oe||t===fe||(ot.cancel(),Gt.cancel(),xe=void 0,t.zoom=e.zoom,t.scroll=e.scroll,At(t),ye.scrollLeft=t.scroll[0],ye.scrollTop=t.scroll[1],pe(!1),Ot(),me(180,!1))}});ye.onpointerdown=e=>{const t=K(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||oe||t===fe||n&&!ht||(xe={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[ye.scrollLeft,ye.scrollTop],node:n,moved:!1},ye.setPointerCapture(e.pointerId))};ye.onpointermove=e=>{if(xe&&xe.pointer===e.pointerId&&xe.key===K()?.key&&K()!==fe){const t=e.clientX-xe.x,n=e.clientY-xe.y;Math.hypot(t,n)>3&&(xe.moved=!0),ye.scrollLeft=xe.scroll[0]-t,ye.scrollTop=xe.scroll[1]-n,pe()}};ye.onpointerup=e=>{if(!xe||xe.pointer!==e.pointerId)return;const t=K(),n=xe;xe=void 0,ye.hasPointerCapture?.(e.pointerId)&&ye.releasePointerCapture(e.pointerId),t&&t!==fe&&n.key===t.key&&!n.moved&&n.node&&(tt().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Ot()),Mn(n.node),Yt()),pe(),me(180,!1)};ye.onpointercancel=()=>{xe=void 0};ye.addEventListener("lostpointercapture",e=>{e.target===ye&&xe?.pointer===e.pointerId&&(xe=void 0)});let Vo=!1;v("resize").onpointerdown=e=>{ne||(Vo=!0,v("resize").setPointerCapture(e.pointerId))};v("resize").onpointermove=e=>{if(Vo){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==x.width&&(x.width=t,Ot()),et()}};v("resize").onpointerup=()=>{Vo=!1,me(180,!1)};v("resize").onpointercancel=()=>{Vo=!1,me(180,!1)};v("resize").onkeydown=e=>{if(!ne&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,x.width+(e.key==="ArrowLeft"?20:-20)));t!==x.width&&(x.width=t,Ot()),et(),me(180,!1)}};window.addEventListener("resize",()=>{et();const e=K();e&&At(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=K();t&&At(t)});e.observe(v("viewport")),e.observe(document.querySelector(".toolbar"))}function po(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");if(e.design=pn(e.design.markdown),e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");xn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Ln=document.createElement("section");Ln.id="source-update-notice";Ln.className="info-bar";Ln.hidden=!0;Ln.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Ln);let dn;const qr=new Set;let ii=0,Ci,si;function Bo(){const e=x.document;Ln.hidden=!dn||dn.key!==e?.key||dn.baseline!==e.design.markdown||qr.has(e.key),v("source-update-refresh").disabled=ne||Ae||oe||!!(e&&Dt.has(e.key))}v("source-update-close").onclick=()=>{dn&&qr.add(dn.key),Bo()};v("source-update-refresh").onclick=()=>{v("refresh").click()};async function Zn(){const e=x.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(si===t)return;si=t;const n=++ii,o=e.key,i=e.source.url,s=e.design.markdown;try{const a=await Wi(i);if(n!==ii||x.document?.key!==o||x.document.design.markdown!==s||x.document.source?.kind!=="url"||x.document.source.url!==i)return;pn(a),dn=a.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,Bo()}catch{}finally{n===ii&&(si=void 0)}}Ue=Oc(ut,{rightDrawer:{isOpen:()=>x.drawer,isReady:()=>!ne,setOpen:e=>{ne||(x.drawer=e,et(),me())}},capture:()=>{pe(),ot.cancel(),xe=void 0},business:()=>({key:x.document?.key,design:x.document?.design,relatedChecks:x.tabs[0]?od(x.tabs[0]):[],viewKey:K()?.key,views:x.tabs.map(e=>({key:e.key,name:e.name,activity:vo(e),object:wo(e)})),activities:x.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:x.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:x.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!x.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=x.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{Ai(e),mo(e)},openObject:e=>{Lr(e),mo(e)},openOverview:()=>{x.tabs[0]&&(pe(),Ue?.reopenBusinessOverview(),x.active=x.tabs[0].key,Ie(),me())},activateView:e=>{x.tabs.some(t=>t.key===e)&&(pe(),x.active=e,Ie(),me())},statePanel:e=>x.document?Lc(x.document.design,e,t=>{Ue?.activateBusiness(),Ai(t),mo(t),Ue?.businessActivated()}):void 0,closeLegacyList:()=>{x.nodeDrawer=!1,et()},refresh:()=>{et(),yi.update()}});const fl=x;Ie();Ge();Uc().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const d of t.recovery??[])po(d);if(t.document){const d={...t.document};po(d),t.document.design=d.design,t.document.checks=d.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const d of t.tabs)po(d)}const n=Gc(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(d=>({...d,name:n.document.name,design:d.design,checks:d.checks,source:d.source,draft:d.draft,edited:d.edited,handle:d.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const d of o.tabs)po(d);if(new Set(o.tabs.map(d=>d.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const d of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!d||!d.positions||typeof d.positions!="object"||Array.isArray(d.positions)||d.selectedEdgesOnly!==void 0&&typeof d.selectedEdgesOnly!="boolean"||d.showExceptions!==void 0&&typeof d.showExceptions!="boolean"||d.hiddenNodes!==void 0&&(!Array.isArray(d.hiddenNodes)||!d.hiddenNodes.every(r=>typeof r=="string"))||d.viewInset!==void 0&&(!Array.isArray(d.viewInset)||d.viewInset.length!==2||!d.viewInset.every(r=>Number.isFinite(r)&&r>=0))||d.canvasOrigin!==void 0&&(!Array.isArray(d.canvasOrigin)||d.canvasOrigin.length!==2||!d.canvasOrigin.every(r=>Number.isFinite(r)&&r>=0))||!Array.isArray(d.scroll)||d.scroll.length!==2||!d.scroll.every(Number.isFinite)||!Number.isFinite(d.zoom)||d.zoom<.25||d.zoom>2.5||!Object.values(d.positions).every(r=>Array.isArray(r)&&r.length===2&&r.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:a,...l}=o,c=d=>({...d,hiddenNodes:d.hiddenNodes??(o.scopeOutside==="hide"?d.design.graph.nodes.filter(r=>!r.scope).map(r=>r.id):[])});x=Xt({...l,tabs:o.tabs.map(c)},n.recovery,n.document,o.tabs.map(d=>{const{design:r,checks:f,source:u,draft:h,edited:g,handle:p,name:m,...S}=c(d);return S})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(x.sampleLayout={...o.sampleLayout,hiddenNodes:pn(Ui).graph.nodes.filter(d=>!d.scope).map(d=>d.id)}),x.tabs.some(d=>d.key===x.active)||(x.active=x.tabs[0]?.key),K()?.selected&&Mn(K().selected),Ci=x.document?.key,Ie(),$i=!0}).catch(()=>{x=fl,En=!0,Fi()}).finally(()=>{ne=!1,Ie(),Ge(),Xi().then(()=>{x.document?.key===Ci&&Zn()})});
