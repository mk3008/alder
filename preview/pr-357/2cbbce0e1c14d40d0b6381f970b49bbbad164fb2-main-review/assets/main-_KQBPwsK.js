import{L as qr,D as sc,G as rc,W as ac,P as cc,l as Dn,X as Wr,C as dc,n as lc,S as zr,o as $r,p as Ur,M as Fr,q as Vr,s as Br,t as us,g as fs,r as $i,d as Hr,b as Go,u as ps,U as Gr,B as uc,v as fc,w as pc,x as mc,y as Kr,z as Jr,A as Ui,E as hc,m as ms,F as bc,H as _r,I as gc,j as yc,J as Ys,K as vc,T as wc,N as kc,O as Ic,R as Sc,Q as xc,V as Ac,Y as Ec,_ as Cc,$ as Oc,a0 as jc,Z as Qs,k as Nc,i as Mc,h as Lc,f as Rc,a as Dc,a1 as Tc,a2 as Pc,a3 as Xr,a4 as qc,a5 as Wc,e as zc}from"./canvas-toolbar-aYSe-n1e.js";const $c={subsystems:{full:"サブシステム",icon:cc},business:{full:"業務設計",icon:ac},states:{full:"状態遷移",icon:rc},concept:{full:"データ構造",icon:sc},tests:{full:"テスト仕様",icon:qr}};function Fi(e,t,n){const o=$c[t],i=document.createElement("span"),s=document.createElement("span"),r=document.createElement("span");i.className="view-tab-label",s.className="view-tab-kind",s.setAttribute("aria-hidden","true"),s.append(Dn(o.icon,{"aria-hidden":"true","stroke-width":1.8})),r.className="view-tab-name",r.textContent=n,i.append(s,r),e.replaceChildren(i),e.title=o.full+" / "+n,e.setAttribute("aria-label",o.full+"："+n)}function Vi(e){const t=document.createElement("button");return t.type="button",t.className="close",t.title=e,t.setAttribute("aria-label",e),t.append(Dn(Wr,{"aria-hidden":"true","stroke-width":1.8})),t}function Uc(e){const t=Dn(e?dc:lc,{"aria-hidden":"true","stroke-width":1.5});return t.classList.add("explorer-chevron"),t.dataset.icon=e?"chevron-down":"chevron-right",t}function Fc(e){e.addEventListener("wheel",t=>{if(t.ctrlKey)return;const n=Math.max(0,e.scrollWidth-e.clientWidth);if(!n)return;const o=Math.abs(t.deltaX)>Math.abs(t.deltaY)?t.deltaX:t.deltaY;if(!o)return;const i=t.deltaMode===1?16:t.deltaMode===2?e.clientWidth:1,s=e.scrollLeft,r=Math.max(0,Math.min(n,s+o*i));r!==s&&(e.scrollLeft=r,t.preventDefault())},{passive:!1})}function Vc(e,t){const n=e.getBoundingClientRect(),o=t.getBoundingClientRect(),i=o.left<n.left?o.left-n.left:o.right>n.right?o.right-n.right:0;i&&(e.scrollLeft=Math.max(0,Math.min(e.scrollWidth-e.clientWidth,e.scrollLeft+i)))}const Bc=""+new URL("canvas-toolbar-JZS1kHdY.css",import.meta.url).href;function er(e){const t=e.querySelector(".canvas-controls");if(!t)return;if(!e.querySelector("[data-canvas-toolbar-style]")){const o=e.createElement("link");o.rel="stylesheet",o.href=Bc,o.dataset.canvasToolbarStyle="",e.head.append(o)}const n=(o,i,s)=>{const r=Dn(i,{"stroke-width":1.8,"aria-hidden":"true"});s&&r.classList.add(s),t.querySelector(o)?.append(r)};for(const o of[".graph-settings-toggle",".layout-lock",".zoom-out",".zoom-in"])t.querySelector(o)?.replaceChildren();n(".graph-settings-toggle",zr),n(".layout-lock",$r,"lock-closed"),n(".layout-lock",Ur,"lock-open"),n(".zoom-out",Fr),n(".zoom-in",Vr)}function tr(e){for(const t of Array.from(e.querySelectorAll(".concept-open-action")))(t.textContent!=="開く"||t.querySelector("svg"))&&t.replaceChildren("開く")}function Hc({model:e}){const t=Object.fromEntries(e.concepts.map(u=>[u.id,{name:u.name,note:u.description,fields:u.information.map(c=>["",c.name+(c.responsibleSubsystemId&&c.responsibleSubsystemId!==u.subsystemId?"（担当："+e.subsystems.find(a=>a.id===c.responsibleSubsystemId).name+"）":"")])}])),n=e.relations.map(u=>[u.fromConceptId,u.toConceptId,u.fromLabel,u.toLabel,u.kind]),o=e.reviewGroups.map(u=>({id:u.id,name:u.title,purpose:u.description,activities:u.relatedActivityIds,concepts:Object.fromEntries(u.graph.nodes.map(c=>[c.conceptId,{name:c.name,note:c.description,fields:c.fields.map(a=>["",a]),sources:c.sources,sourceActivities:c.sourceActivityIds}])),relations:u.graph.edges.map(c=>[c.fromConceptId,c.toConceptId,c.fromLabel,c.toLabel,c.kind])})),i=u=>o.find(c=>c.id===u),s=(u,c)=>{const a=Object.fromEntries(u.nodes.map(p=>[p.id,{...c[p.conceptId],name:p.name,note:p.description,sources:p.sources,conceptId:p.conceptId,subsystemId:p.subsystemId,fields:p.fields.map(g=>["",g.name])}])),f=e.subsystems.filter(p=>u.nodes.some(g=>g.subsystemId===p.id)).map(p=>({id:p.id,name:p.name})),d=u.handoffIds.map(p=>e.handoffs.find(g=>g.id===p)).map(p=>({id:p.id,from:p.fromSubsystemId,to:p.toSubsystemId,label:p.information,returning:p.flowDirection==="return"}));return{ids:u.nodes.map(p=>p.id),tables:a,edges:u.edges.map(p=>[p.fromViewId,p.toViewId,p.fromLabel,p.toLabel,p.kind]),regions:f,handoffs:d}};return{tables:t,edges:n,groups:o,findGroup:i,graph:u=>{const c=i(u);if(!c)throw Error("Unknown review group: "+u);const a=e.reviewGroups.find(p=>p.id===u),f=a.graph.subsystemViews;if(f)return s(f,c.concepts);const d=Object.keys(t).filter(p=>Object.hasOwn(c.concepts,p));return{ids:d,tables:c.concepts,edges:c.relations.filter(([p,g])=>d.includes(p)&&d.includes(g)),regions:[],handoffs:[]}},overviewGraph:()=>e.presentation.subsystemViews?s(e.presentation.subsystemViews,t):{ids:Object.keys(t),tables:t,edges:n,regions:[],handoffs:[]}}}function ct(e,t,n){const o=document.createElement(t);return o.textContent=n,e.append(o),o}function Gc(e,t,n){const o=document.createElement("button");return o.type="button",o.className="review-open",ct(o,"span",t),o.onclick=n,e.append(o),o}function Kc(e,t,n="overview"){if(e.replaceChildren(),e.dataset.mode=n,n==="overview"&&t){const o=document.createElement("div");o.className="landscape-overview",o.append(t),e.append(o)}}function Jc(e,t,n,o=()=>{},i=()=>{},s=[]){const r=n.contentFor(t.id);if(e.replaceChildren(),!r)return;ct(e,"p",r.description).className="review-description",ct(e,"h3","Activity");const l=document.createElement("ul");l.className="review-related-activities";for(const u of r.relatedActivities){const c=document.createElement("li"),a=s.find(d=>d.id===u.id&&d.name===u.name),f=Gc(c,u.name,()=>{a&&i(a.id)});f.disabled=!a,f.setAttribute("aria-label",u.name+"を業務タブで開く"),l.append(c)}e.append(l),ct(e,"h3","情報の構造");for(const u of r.structureStatements){const c=document.createElement("section");c.className="review-structure",c.dataset.structure=u.id,ct(c,"h4",u.title),ct(c,"p",u.description),e.append(c)}ct(e,"h3","できること");for(const u of r.capabilities){const c=document.createElement("section");c.className="review-capability",c.dataset.capability=u.id,ct(c,"h4",u.title),ct(c,"p",u.description);for(const a of u.samples){const f=o(u.id,a.id),d=document.createElement("button");d.className="review-sample-link",d.type="button",d.dataset.sample=a.id,d.textContent=(f?.kind==="decision"?"可否判定：":"サンプル：")+a.name,f?d.onclick=f.open:(d.disabled=!0,d.title="対応するテスト仕様へのリンクがありません"),c.append(d)}e.append(c)}ct(e,"h3","できないこと（業務上のルール）");for(const u of r.limitations){const c=document.createElement("section");c.className="review-limitation",ct(c,"h4",u.title),ct(c,"p",u.description),ct(c,"h5","理由"),ct(c,"p",u.reason),e.append(c)}}function fn(e,t,n){const o=e.ownerDocument.createElement(t);return o.textContent=n,e.append(o),o}function _c({model:e,business:t}){const n=r=>r.kind==="group"?e.subsystems.find(l=>l.id===r.id):e.handoffs.find(l=>l.id===r.id),o=[["メリット",e.benefits],["デメリット・必要な管理",e.considerations],["レビューポイント",e.reviewPoints]];function i(r){const l=n(r);return l?l.activityIds.map(u=>t.activities.find(c=>c.id===u)).filter(Boolean):[]}function s(r,l){if(r.replaceChildren(),l.kind==="group"){const f=e.subsystems.find(p=>p.id===l.id);if(!f)return"";fn(r,"p",f.purpose),fn(r,"h3","扱う情報");const d=r.ownerDocument.createElement("ul");for(const p of f.information)fn(d,"li",p);return r.append(d),fn(r,"h3","まとまりの理由"),fn(r,"p",f.reason),f.name}const u=e.handoffs.find(f=>f.id===l.id);if(!u)return"";fn(r,"p",u.description),fn(r,"h3","出元と受取先");const c=e.subsystems.find(f=>f.id===u.fromSubsystemId),a=e.subsystems.find(f=>f.id===u.toSubsystemId);return fn(r,"p",`${c.name} → ${a.name}`),u.information}return{sections:o,activities:i,describe:s}}function Li(e,t,n,o="right"){const i=o==="left",s=document.createElement("div");s.className=i?"explorer-drawer-resize":"concept-drawer-resize",s.tabIndex=0,s.setAttribute("role","separator"),s.setAttribute("aria-orientation","vertical"),s.setAttribute("aria-label",i?"エクスプローラーの幅":"補足情報の幅"),e.prepend(s);let r=i?280:440;try{const a=Number(sessionStorage.getItem(n));Number.isFinite(a)&&a>=280&&(r=a)}catch{}const l=i?Array.from(t.querySelectorAll("#formattedMarkdownDrawer,.concept-related,.spec-related")):[t.querySelector("#design-explorer")].filter(a=>!!a),u=()=>{let a=t.clientWidth||innerWidth;if(innerWidth>800){const f=l.find(d=>!d.hidden);f&&(a-=f.offsetWidth)}return Math.max(280,Math.min(1e3,a-(innerWidth>800?240:16)))},c=(a,f=!1)=>{if(r=Math.max(280,Math.min(u(),a)),e.style.setProperty(i?"--explorer-drawer-width":"--concept-drawer-width",r+"px"),s.setAttribute("aria-valuemin","280"),s.setAttribute("aria-valuemax",String(u())),s.setAttribute("aria-valuenow",String(Math.round(r))),f)try{sessionStorage.setItem(n,String(r))}catch{}};if(s.onkeydown=a=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(a.key))return;a.preventDefault();const f=a.key==="ArrowLeft"?-1:1;c(a.key==="Home"?280:a.key==="End"?u():r+f*(i?40:-40),!0)},s.onpointerdown=a=>{if(a.button!==0)return;a.preventDefault();const f=a.clientX,d=r;s.setPointerCapture(a.pointerId),s.classList.add("resizing"),s.onpointermove=p=>c(d+(i?p.clientX-f:f-p.clientX)),s.onpointerup=()=>{s.onpointermove=null,s.onpointerup=null,s.onpointercancel=null,s.classList.remove("resizing"),c(r,!0)},s.onpointercancel=s.onpointerup},typeof ResizeObserver<"u"){const a=new ResizeObserver(()=>c(r));a.observe(t);for(const f of l)a.observe(f)}window.addEventListener("resize",()=>c(r)),c(r)}const Xc=260,Zc=68,Yc="http://www.w3.org/2000/svg",Ft=(e,t,n={})=>{const o=e.createElementNS(Yc,t);for(const[i,s]of Object.entries(n))o.setAttribute(i,String(s));return o};function Qc(e,t){const n=e.createElement("span");return n.className="subsystem-overview-role-icon",n.style.setProperty("--role-color",t),n.setAttribute("aria-hidden","true"),n.append(e.importNode(Dn(Gr,{"aria-hidden":"true","stroke-width":1.8}),!0)),n}function ed(e,{model:t,business:n},o,i,s){const r=t.reviewGroups,l=t.subsystems,u=t.presentation.landscapeRelationships.map(I=>{const y=r.find(T=>T.id===I.from),D=r.find(T=>T.id===I.to);if(!y||!D||y.subsystemId!==D.subsystemId||!t.presentation.reviewBoundaries.some(T=>T.from===I.from&&T.to===I.to))throw Error("Unknown overview relationship: "+I.from+" -> "+I.to);return I}),c=t.handoffs.map(I=>{if(!["forward","return"].includes(I.flowDirection))throw Error("Unknown overview handoff direction: "+I.id);return{id:I.id,from:I.fromSubsystemId,to:I.toSubsystemId,label:I.information,returning:I.flowDirection==="return"}});if(new Set(c.map(I=>I.id)).size!==c.length)throw Error("Duplicate overview handoff");for(const I of c)if(!l.some(y=>y.id===I.from)||!l.some(y=>y.id===I.to)||I.from===I.to||!I.label.trim())throw Error("Unknown overview handoff: "+I.id);for(const I of r){if(!l.some(y=>y.id===I.subsystemId))throw Error("Unknown overview subsystem: "+I.id);if(!n.roles?.some(y=>y.id===I.reviewer.roleId))throw Error("Unknown overview reviewer: "+I.id)}const a=l.flatMap(I=>r.filter(y=>y.subsystemId===I.id)),f=new Map;let d=0;for(const[I,y]of l.entries())for(const D of a.filter(T=>T.subsystemId===y.id))f.set(D.id,[80+d*170,100+d*120+I*64]),d++;const p=us(),g="alder-subsystem-overview-v2:"+location.pathname+":"+encodeURIComponent(o);let m,h;try{const I=JSON.parse(localStorage.getItem(g)||"null"),y=JSON.parse(sessionStorage.getItem("alder-explorer-v1:"+location.pathname)||"null"),D=!I&&y?.documentKey===o?JSON.parse(localStorage.getItem("alder-subsystem-overview-v1:"+location.pathname)||localStorage.getItem("alder-logical-subsystems-v1:"+location.pathname)||"null"):void 0,T=I??D;if(T){typeof T.zoom=="number"&&Number.isFinite(T.zoom)&&(p.zoom=Math.max(.25,Math.min(2.5,T.zoom))),Array.isArray(T.scroll)&&T.scroll.length===2&&T.scroll.every(W=>typeof W=="number"&&Number.isFinite(W))&&(p.scroll=T.scroll),typeof T.locked=="boolean"&&(p.locked=T.locked);for(const[W,R]of Object.entries(T.positions??{}))r.some($=>$.id===W)&&Array.isArray(R)&&R.length===2&&R.every($=>typeof $=="number"&&Number.isFinite($))&&p.positions.set(W,[R[0],R[1]])}const A=T?.selection,q=A?.kind==="node"?t.concepts.find(W=>W.id===A.id)?.subsystemId:A?.id,P=A?.kind==="node"?"group":A?.kind;typeof q=="string"&&(P==="model"&&r.some(W=>W.id===q)||P==="group"&&l.some(W=>W.id===q)||P==="connection"&&c.some(W=>W.id===q))&&(h={kind:P,id:q}),h?.kind==="model"&&(p.selected=h.id)}catch{}const x=()=>{try{localStorage.setItem(g,JSON.stringify({zoom:p.zoom,scroll:p.scroll,locked:p.locked,positions:Object.fromEntries(p.positions),selection:h}))}catch{}},C=I=>{if(!I&&!h)return;h=I,p.selected=I?.kind==="model"?I.id:void 0;const y=m?.querySelector(".diagram-world>svg");y&&v(y),x()},v=I=>{const y=Go(u,p.selected),D=Go(c,h?.kind==="group"?h.id:void 0);for(const T of r){const A=I.querySelector(`[data-node="${T.id}"]`);A?.setAttribute("class","node graph-shape state-shape"+y.nodeClasses(T.id)),A?.setAttribute("aria-pressed",String(p.selected===T.id))}for(const T of l){const A=I.querySelector(`[data-subsystem="${T.id}"]`);A?.setAttribute("class","subsystem-overview-group"+D.nodeClasses(T.id)),A?.querySelector("button")?.setAttribute("aria-pressed",String(h?.kind==="group"&&h.id===T.id))}for(const T of u){const A=I.querySelector(`[data-overview-from="${T.from}"][data-overview-to="${T.to}"]`);A?.setAttribute("class","edge"+(y.related(T)?" review-related":"")),A?.setAttribute("marker-end",`url(#overview-${y.related(T)?"related-arrow":"arrow"})`)}for(const T of c){const A=D.related(T)||h?.kind==="connection"&&h.id===T.id,q=I.querySelector(`[data-handoff-id="${T.id}"]`);q?.setAttribute("class","edge"+(T.returning?" exception":"")+(A?" review-related":"")),q?.setAttribute("marker-end",`url(#overview-${A?"related-arrow":"arrow"})`),I.querySelector(`[data-handoff-label="${T.id}"]`)?.classList.toggle("review-related",!!A)}I.querySelectorAll("[data-exception-paint]").forEach(T=>T.remove());for(const T of Array.from(I.querySelectorAll("[data-handoff-id].exception")))ps(I,T,{path:T.getAttribute("d")},{"data-overview-return-paint":T.getAttribute("data-handoff-id")})};return m=Br(e,I=>{const y=a.map(P=>{const W=I.positions.get(P.id)??f.get(P.id);return{id:P.id,x:W[0],y:W[1],width:Xc,height:Zc}}),D=Ft(e,"svg",{class:"state-diagram subsystem-overview-graph",role:"group","aria-label":"論理サブシステムと概念モデルの全体図"});D.append(fs("overview-"));let T=0,A=0;const q=[];for(const P of l){const W=y.filter(se=>r.find(re=>re.id===se.id)?.subsystemId===P.id);if(!W.length)continue;const R=Math.min(...W.map(se=>se.x))-30,$=Math.min(...W.map(se=>se.y))-48,L=Math.max(...W.map(se=>se.x+se.width))-R+30,O=Math.max(...W.map(se=>se.y+se.height))-$+30;q.push({id:P.id,x:R,y:$,width:L,height:O});const U=Ft(e,"g",{"data-subsystem":P.id,"aria-label":P.name}),Q=Ft(e,"rect",{x:R,y:$,width:L,height:O,rx:8,class:"subsystem-overview-region","data-canvas-boundary":"","data-canvas-tap":""});Q.addEventListener("click",()=>C({kind:"group",id:P.id})),U.append(Q);const pe=Ft(e,"foreignObject",{class:"subsystem-overview-region-heading",x:R+8,y:$+3,width:L-16,height:36}),ce=e.createElement("button");ce.type="button",ce.className="subsystem-overview-region-title",ce.setAttribute("aria-label",P.name+"を選択"),ce.textContent=P.name,ce.onclick=()=>C({kind:"group",id:P.id}),pe.append(ce),U.append(pe),D.append(U),T=Math.max(T,R+L+40),A=Math.max(A,$+O+40)}for(const[P,W]of c.entries()){if(!q.some(U=>U.id===W.from)||!q.some(U=>U.id===W.to))throw Error("Missing overview handoff region: "+W.id);const R=Math.max(30,W.label.length*12),$=$i({from:W.from,to:W.to,nodes:q,index:P,kind:"input",matrix:{returning:W.returning,captionLane:0},labelWidth:R,labelHeight:18}),L=Ft(e,"path",{d:$.path,class:"edge"+(W.returning?" exception":""),"data-handoff-id":W.id,"data-from-subsystem":W.from,"data-to-subsystem":W.to,"data-flow-direction":W.returning?"return":"forward","marker-end":"url(#overview-arrow)"});D.append(L);const O=Ft(e,"text",{x:$.label[0]-R/2,y:$.label[1],class:"edge-label","text-anchor":"start","dominant-baseline":"middle",role:"button",tabindex:0,"data-handoff-label":W.id});O.textContent=W.label,O.addEventListener("pointerdown",U=>U.stopPropagation()),O.addEventListener("pointerup",U=>U.stopPropagation()),O.addEventListener("click",()=>C({kind:"connection",id:W.id})),O.addEventListener("keydown",U=>{(U.key==="Enter"||U.key===" ")&&(U.preventDefault(),C({kind:"connection",id:W.id}))}),D.append(O),T=Math.max(T,$.bounds.right+40,$.label[0]+R/2+30),A=Math.max(A,$.bounds.bottom+40,$.label[1]+30)}for(const[P,W]of u.entries()){const R=$i({from:W.from,to:W.to,nodes:y,index:P,kind:"input",labelWidth:0,labelHeight:0}),$=Ft(e,"path",{d:R.path,class:"edge","data-overview-from":W.from,"data-overview-to":W.to,"marker-end":"url(#overview-arrow)"});D.append($),T=Math.max(T,R.bounds.right+40),A=Math.max(A,R.bounds.bottom+40)}for(const P of y){const W=r.find(re=>re.id===P.id),R=n.roles.find(re=>re.id===W.reviewer.roleId),$=Ft(e,"g",{role:"button",tabindex:0,"aria-label":W.title+"を選択","aria-pressed":"false","data-node":P.id,"data-review-group":P.id,"data-subsystem-id":W.subsystemId,class:"node graph-shape state-shape"}),L=Hr(e,P);L.querySelector(".graph-card-surface").classList.add("subsystem-overview-card-surface"),$.append(L,Ft(e,"rect",{x:P.x,y:P.y,width:P.width,height:P.height,rx:8,class:"state-diagram-node"}));const U=Ft(e,"foreignObject",{x:P.x,y:P.y,width:P.width,height:P.height}),Q=e.createElement("div");Q.className="subsystem-overview-card";const pe=Qc(e,R.color),ce=e.createElement("span");ce.className="subsystem-overview-labels",ce.title=W.title+" — "+R.name;for(const[re,j,z]of[["span","subsystem-overview-kind","概念モデル"],["strong","subsystem-overview-name",W.title],["small","subsystem-overview-role",R.name]]){const B=e.createElement(re);B.className=j,B.textContent=z,ce.append(B)}const se=e.createElement("button");se.type="button",se.className="subsystem-overview-open",se.setAttribute("aria-label",W.title+"の詳細タブを開く"),se.title="詳細タブを開く",se.textContent="開く",se.onpointerdown=re=>re.stopPropagation(),se.onpointerup=re=>re.stopPropagation(),se.onclick=re=>{re.stopPropagation(),i(W.id)},Q.append(pe,ce,se),U.append(Q),$.append(U),$.addEventListener("click",()=>C({kind:"model",id:P.id})),$.addEventListener("keydown",re=>{(re.key==="Enter"||re.key===" ")&&(re.preventDefault(),C({kind:"model",id:P.id}))}),D.append($)}return D.setAttribute("viewBox",`0 0 ${T} ${A}`),v(D),D},p,x,()=>C(void 0)),m.classList.add("subsystem-overview-canvas"),m.addEventListener("click",x),m.addEventListener("pointerup",()=>queueMicrotask(x)),m.querySelector(".diagram-viewport")?.addEventListener("scroll",x),{root:m,selected:()=>p.selected,selection:()=>h,restore:()=>{const I=()=>{const y=m.querySelector(".diagram-viewport");y.scrollLeft=p.scroll[0],y.scrollTop=p.scroll[1]};e.defaultView?.requestAnimationFrame?e.defaultView.requestAnimationFrame(I):I()}}}function td(e){return{...e,blocks:e.blocks.map(t=>{const n=t.rows.map(o=>t.columns.map(i=>{const s=o.cells.find(r=>r.columnId===i.id);if(!s)throw Error("Missing sample cell: "+i.id);return s}));return{card:t.card,columns:t.columns.map(o=>o.name),rows:n.map(o=>o.map(i=>i.value)),keyIds:n.map(o=>o.map(i=>i.linkId)),empty:t.empty}})}}function nd({model:e,business:t}){const n=g=>{const m=t.activities.find(h=>h.id===g);if(!m)throw Error("Unknown activity: "+g);return m},o=g=>{const m=t.roles?.find(h=>h.id===g);if(!m)throw Error("Unknown role: "+g);return m.name},i=e.reviewGroups.map(g=>({id:g.id,title:g.title,description:g.description,reviewer:{role:o(g.reviewer.roleId)},relatedActivities:g.relatedActivityIds.map(m=>{const h=n(m);return{id:h.id,name:h.name}}),structureStatements:g.structureStatements,capabilities:g.capabilities.map(m=>({...m,samples:m.samples.map(td)})),limitations:g.limitations,meta:{questions:g.meta.questions}})),s=g=>i.find(m=>m.id===g),r=(g,m)=>s(g)?.capabilities.find(h=>h.samples.some(x=>x.id===m)),l=i.flatMap(g=>g.capabilities.flatMap(m=>m.samples.map(h=>({...h,group:g.id})))),u=["yellow","cyan","green","blue","purple","orange"];function c(g,m,h){let x=h.get(m);if(x||(x=u[h.size]??`extra-${h.size}`,h.set(m,x)),g.dataset.sampleKey=m,g.dataset.keyTone=x,g.className="data-example-key",x.startsWith("extra-")){const C=(Number(x.slice(6))*137.508%360).toFixed(2);g.style.setProperty("--sample-key-extra-light",`hsl(${C} 26% 78%)`),g.style.setProperty("--sample-key-extra-dark",`hsl(${C} 24% 25%)`)}}const a=g=>l.filter(m=>m.group===g),f=(g,m)=>a(g).find(h=>h.id===m);function d(g,m,h){const x=g.ownerDocument.createElement(m);return x.textContent=h,g.append(x),x}function p(g,m,h,x,C){const v=g.ownerDocument,M=f(m.id,h);if(!M)throw Error("Unknown data example: "+h);g.replaceChildren(),g.dataset.dataExample=h;const I=new Map;e.presentation.sampleCaption&&(d(g,"p",e.presentation.sampleCaption).className="data-example-caption");const y=s(m.id)?.capabilities??[],D=C?.capabilityId?y.filter(W=>W.id===C.capabilityId):y;if(C?.capabilityId&&!D.some(W=>W.samples.some(R=>R.id===h)))throw Error("Sample does not belong to capability: "+h);const T=r(m.id,h);g.dataset.capability=T.id;const A=()=>{d(g,"h2",C?.heading?.trim()||T.title),C?.renderSpecification?C.renderSpecification(g):d(g,"p",T.description).className="data-example-capability"};C?.capabilityId&&!C.hideCapability&&A();const q=v.createElement("label");q.className="data-example-picker",d(q,"span","場面");const P=v.createElement("select");P.setAttribute("aria-label","データ例の場面");for(const W of D){let R=P;if(!C?.capabilityId){const $=v.createElement("optgroup");$.label=W.title,P.append($),R=$}for(const $ of W.samples){if(C?.sampleIds&&!C.sampleIds.includes($.id))continue;const L=v.createElement("option");L.value=$.id,L.textContent=$.name,R.append(L)}}if(P.value=h,P.onchange=()=>x(P.value),q.append(P),(!C?.hideSinglePicker||P.options.length>1)&&g.append(q),!C?.capabilityId&&!C?.hideCapability&&A(),d(g,"h3",M.name).className="data-example-scene",C?.collapseScenario&&M.when){const W=v.createElement("details");W.className="data-example-context",d(W,"summary","場面の背景"),d(W,"p",M.when).className="data-example-when",g.append(W)}else d(g,"p",M.when).className="data-example-when";d(g,"p",M.meaning).className="data-example-meaning";for(const W of M.blocks){const R=v.createElement("section");R.className="data-example-block",R.dataset.exampleCard=W.card,d(R,"h3",m.concepts[W.card].name);const $=v.createElement("div");$.className="data-example-table",$.tabIndex=0,$.setAttribute("role","region"),$.setAttribute("aria-label",m.concepts[W.card].name+"のデータ表");const L=v.createElement("table");L.setAttribute("aria-label",m.concepts[W.card].name+"のデータ例");const O=v.createElement("caption");O.textContent=m.concepts[W.card].name+"に入る情報",L.append(O);const U=v.createElement("thead"),Q=v.createElement("tr");for(const ce of W.columns)d(Q,"th",ce).setAttribute("scope","col");U.append(Q),L.append(U);const pe=v.createElement("tbody");for(const[ce,se]of W.rows.entries()){const re=v.createElement("tr");for(const[j,z]of se.entries()){const B=d(re,"td",String(z)),ue=W.keyIds[ce][j];ue&&(c(B,ue,I),B.title=W.columns[j]+"："+z)}pe.append(re)}L.append(pe),$.append(L),R.append($),W.rows.length||d(R,"p",W.empty??"データはありません。"),g.append(R)}M.note&&(d(g,"p",M.note).className="data-example-note")}return{reviewContents:i,dataExamples:l,contentFor:s,capabilityFor:r,examplesFor:a,findDataExample:f,renderDataExample:p}}function hs(e,t){const n=e.model?.business,o=n?.activities.find(i=>i.id===t);return o?.roleId?n?.roles?.find(i=>i.id===o.roleId):void 0}function od(e,t,n){return hs(e,t)?.id??(e.model?.business.roles?"unresolved:"+t:n)}function id(e){const t=document.createElement("h1");return t.className="detail-title",t.textContent=e,t}function jn(e,t=!1){const n=document.createElement("article");n.className="markdown";let o="",i,s;const r=(l,u)=>{for(const c of u.split(/(\*\*[^*]+\*\*|`[^`]+`)/g))if(c.startsWith("**")&&c.endsWith("**")){const a=document.createElement("strong");a.textContent=c.slice(2,-2),l.append(a)}else if(c.startsWith("`")&&c.endsWith("`")){const a=document.createElement("code");a.textContent=c.slice(1,-1),l.append(a)}else l.append(document.createTextNode(c))};for(const l of e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){const u=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(l);if(u&&!o){o=u[1],s=void 0;const d=document.createElement("pre");i=document.createElement("code"),d.append(i),n.append(d);continue}if(u&&u[1][0]===o[0]&&u[1].length>=o.length&&!u[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")){o="",s=void 0;continue}if(o){i.append(document.createTextNode(l+`
`));continue}if(!l.trim()){s=void 0;continue}const c=/^(#{1,6}) (.*)$/.exec(l),a=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(l);if(a){s||(s=document.createElement(/^\s*\d/.test(l)?"ol":"ul"),n.append(s));const d=document.createElement("li");r(d,a[1]),s.append(d);continue}s=void 0;const f=document.createElement(c?"h"+c[1].length:"p");r(f,c?c[2]:l),n.append(f)}return t&&n.querySelector("h1")?.remove(),n}const je={type:"string"},Z={type:"string",minLength:1,pattern:"\\S"},_={type:"string",pattern:"^[A-Za-z0-9_-]+$"},vn=e=>({anyOf:[e,{type:"null"}]}),Y=e=>({type:"array",items:e}),oe=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),sd=e=>({$ref:"#/$defs/"+e}),Fn=Y({anyOf:[oe({kind:{enum:["text"]},value:je}),oe({kind:{enum:["reference"]},targetId:_,label:je}),oe({kind:{enum:["link"]},uri:Z,label:je})]}),nr=oe({id:_,name:Z,scope:{type:"boolean"}}).properties,rd=oe({id:_,kind:{enum:["input","output","business-exception","object-exception"]},fromId:_,toId:_,label:Z}),ad=oe({id:_,sourceId:_,kind:{enum:["question","correction"]},status:{enum:["open","resolved"]},scope:{enum:["items","document","unassigned"]},targetIds:Y(_),unresolvedTargets:Y(Z),summary:Z,content:Z}),Bi=oe({id:_,schemaVersion:{enum:["0.1"]},kind:{enum:["businessDesign"]},revision:Z,title:Z,preface:je,scope:je,objects:Y(oe({...nr,icon:Z,information:Y(Z)})),activities:Y(oe({...nr,why:Z,when:Z,who:Z,where:Z,procedure:Z,exception:vn(Z),result:Z,problem:vn(Z),painLevel:vn({enum:["Low","Medium","High"]})})),relations:Y(rd),findings:Y(ad)}),cd=oe({id:_,name:Z,color:{enum:["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"]}}),Zr=oe({...Bi.properties,schemaVersion:{enum:["0.2"]},roles:Y(cd),activities:Y(oe({...Bi.properties.activities.items.properties,roleId:vn(_)}))}),dd=oe({...Zr.properties,schemaVersion:{enum:["0.3"]},exceptions:Y(oe({id:_,activityId:_,name:Z,description:je}))}),ld=Object.fromEntries(["classification","condition","expectedResult","guarantee","evidence","derivation","related","testEvidence","question","alternatives","confidence"].map(e=>[e,Fn])),ud=oe({id:_,schemaVersion:{enum:["0.1"]},kind:{enum:["checkItems"]},revision:Z,title:Z,basedOn:oe({documentId:_,revision:Z,verification:{enum:["unverified"]}}),intro:Fn,index:Y(oe({activityId:_,purpose:je,connections:je,checkIds:Y(_)})),sections:Y(oe({id:_,activityId:vn(_),title:Z,preamble:Fn})),guarantees:Y(oe({id:_,sectionId:_,title:Z,blocks:Y({anyOf:[oe({kind:{enum:["prose"]},content:Fn}),oe({kind:{enum:["example"]},exampleId:_})]})})),examples:Y(oe({id:_,guaranteeId:_,columns:Y(Z),rows:Y(Y(Fn))})),items:Y(oe({id:_,checkId:_,title:Z,detailSummary:je,sectionId:_,reviewState:{enum:["未レビュー","要確認","確認済み","要修正"]},fields:oe(ld,[])})),notes:Y(oe({id:_,title:Z,content:Fn}))}),bs=oe({id:_,schemaVersion:{enum:["0.1"]},kind:{enum:["stateTransition"]},revision:Z,title:Z,basedOn:oe({documentId:_,revision:Z,verification:{enum:["unverified"]}}),objectId:_,states:Y(oe({id:_,name:Z})),start:{enum:["@new"]},terminal:{enum:["@unknown"]},completeness:{enum:["partial"]},source:Z,transitions:Y(oe({id:_,sourceId:Z,fromId:Z,activityId:_,event:vn(Z),exception:vn(Z),condition:Z,toId:Z,effect:{enum:["change","unchanged","no-create","constraint"]},path:{enum:["normal","exception"]},evidence:Z,note:Z}))}),or=Object.fromEntries(Object.entries({...bs.properties.transitions.items.properties,exceptionId:vn(_)}).filter(([e])=>e!=="exception")),fd=oe({...bs.properties,schemaVersion:{enum:["0.2"]},transitions:Y(oe({...or,conditionLabel:Z},Object.keys(or)))}),gs=oe({documentId:_,revision:Z,targetType:Z,targetId:_,section:Z}),pd=oe({id:_,name:Z,responsibilityStatus:Z,responsibleSubsystemId:_},["id","name"]),md=oe({id:_,name:Z,subsystemId:_,information:Y(pd),reason:je,description:je,businessObjectIds:Y(_),activityLinks:Y(oe({activityId:_,uses:Y(Z)})),sourceRefs:Y(gs),reviewState:Z}),hd=oe({id:_,fromConceptId:_,toConceptId:_,fromPerTarget:Z,toPerSource:Z,condition:je,reviewState:Z,sourceRefs:Y(gs),fromLabel:Z,toLabel:Z,kind:{enum:["down","reference"]}}),bd=oe({id:_,name:Z,purpose:je,information:Y(Z),reason:je,activityIds:Y(_),reviewState:Z}),gd=oe({id:_,fromSubsystemId:_,toSubsystemId:_,information:Z,description:je,activityIds:Y(_),flowDirection:{enum:["forward","return"]},reviewState:Z}),yd=oe({columnId:_,value:{anyOf:[je,{type:"number"}]},linkId:Z},["columnId","value"]),vd=oe({card:_,columns:Y(oe({id:_,name:Z,informationId:_})),rows:Y(oe({id:_,cells:Y(yd)})),empty:je},["card","columns","rows"]),Hi=oe({id:_,name:Z,when:je,meaning:je,blocks:Y(vd),note:je},["id","name","when","meaning","blocks"]),Gi=oe({id:_,title:Z,description:je,meta:{},samples:Y(Hi)}),wd=oe({...Hi.properties,checkIds:{...Y(_),minItems:1,uniqueItems:!0}},[...Hi.required,"checkIds"]),kd=oe({decisionExampleIds:Y(_),decisionCheckIds:Y(_),resultCheckIds:Y(_),sampleIds:Y(_)}),Id=oe({...Gi.properties,samples:Y(wd),testSpecification:kd},[...Object.keys(Gi.properties)]),Sd=oe({id:_,title:Z,description:je,reason:je,meta:{}}),xd=oe({conceptId:_,name:Z,fields:Y(Z),description:je,sources:Y(Z),sourceActivityIds:Y(_)}),Ad=oe({id:_,fromConceptId:_,toConceptId:_,relationIds:Y(_),scope:je,fromLabel:Z,toLabel:Z,kind:{enum:["down","reference"]}}),Ed=oe({id:_,conceptId:_,subsystemId:_,name:Z,description:je,sources:Y(Z),fields:Y(oe({name:Z,informationId:_}))}),Cd=oe({id:_,fromViewId:_,toViewId:_,relationIds:Y(_),fromLabel:Z,toLabel:Z,kind:{enum:["down","reference"]}}),Yr=oe({nodes:Y(Ed),edges:Y(Cd),handoffIds:Y(_)}),Qr=oe({id:_,subsystemId:_,title:Z,description:je,reviewer:oe({roleId:_}),relatedActivityIds:Y(_),graph:oe({conceptIds:Y(_),nodes:Y(xd),edges:Y(Ad),subsystemViews:Yr},["conceptIds","nodes","edges"]),structureStatements:Y(oe({id:_,title:Z,description:je,sampleIds:Y(_),sourceRefs:Y(gs)})),capabilities:Y(Gi),limitations:Y(Sd),meta:oe({questions:Y(Z),hypotheses:{}},["questions"])}),Od=oe({...Qr.properties,capabilities:Y(Id)}),ea=oe({id:_,schemaVersion:{enum:["0.1"]},kind:{enum:["conceptModel"]},revision:Z,basedOn:oe({documentId:_,revision:Z,verification:{enum:["unverified"]}}),relatedStates:Y(oe({documentId:_,revision:Z,verification:{enum:["unverified"]}})),subsystems:Y(bd),concepts:Y(md),relations:Y(hd),handoffs:Y(gd),reviewGroups:Y(Qr),benefits:Y(Z),considerations:Y(Z),reviewPoints:Y(Z),meta:{},presentation:oe({activityViews:{},creatorActivityIds:{},sampleCaption:je,subsystemViews:Yr,landscapeRelationships:Y(oe({from:_,to:_})),reviewBoundaries:Y(oe({from:_,to:_,label:je,promise:je}))},["landscapeRelationships","reviewBoundaries"])}),jd=oe({...ea.properties,schemaVersion:{enum:["0.2"]},reviewGroups:Y(Od)}),Lo=(e,t)=>oe({format:{enum:["alder-document-package"]},formatVersion:{enum:[e]},revision:Z,documents:Y({anyOf:t.map(sd)}),sources:Y(oe({documentId:_,revision:Z,sha256:{type:"string",pattern:"^[0-9a-f]{64}$"},uri:je})),externalDocuments:Y(oe({id:_,kind:{enum:["businessDesign"]},revision:Z,activities:Y(oe({id:_,name:Z}))})),diagnostics:Y(Z)}),Ko={anyOf:[Lo("0.1",["businessDesign","checkItems"]),Lo("0.2",["businessDesign","checkItems","stateTransition"]),Lo("0.3",["businessDesignRoles","checkItems","stateTransition"]),Lo("0.4",["businessDesignStructured","checkItems","stateTransitionStructured","conceptModel","checkedConceptModel"])],$schema:"https://json-schema.org/draft/2020-12/schema",$defs:{businessDesign:Bi,businessDesignRoles:Zr,businessDesignStructured:dd,checkItems:ud,stateTransition:bs,stateTransitionStructured:fd,conceptModel:ea,checkedConceptModel:jd}},H=(e,t)=>{if(!e)throw Error(t)};function ta(e){let t=0;const n=()=>{for(;/\s/.test(e[t]??"")&&t<e.length;)t++},o=()=>{const s=t++;for(;t<e.length;){const r=e[t++];if(r==='"')return JSON.parse(e.slice(s,t));r==="\\"&&t++}throw Error("Unclosed JSON string")},i=(s=0)=>{H(s<=64,"JSON depth limit"),n();const r=e[t];if(r==='"'){o();return}if(r==="{"){t++,n();const u=new Set;if(e[t]==="}"){t++;return}for(;t<e.length;){n(),H(e[t]==='"',"JSON object key required");const c=o();H(!u.has(c),"Duplicate JSON key: "+c),u.add(c),n(),H(e[t++]===":","JSON colon required"),i(s+1),n();const a=e[t++];if(a==="}")return;H(a===",","JSON comma required")}throw Error("Truncated object")}if(r==="["){if(t++,n(),e[t]==="]"){t++;return}for(;t<e.length;){i(s+1),n();const u=e[t++];if(u==="]")return;H(u===",","JSON array comma required")}throw Error("Truncated array")}const l=t;for(;t<e.length&&!/[\s,\]}]/.test(e[t]);)t++;H(t>l,"JSON value required"),JSON.parse(e.slice(l,t))};return i(),n(),H(t===e.length,"Trailing JSON content"),JSON.parse(e)}function En(e,t=Ko,n="$"){if(t.$ref)return En(e,Ko.$defs[t.$ref.split("/").at(-1)],n);if(t.anyOf){const o=[];for(const i of t.anyOf)try{En(e,i,n);return}catch(s){o.push(s.message)}throw Error("No schema variant at "+n+": "+o.join("; "))}if(t.enum&&H(t.enum.includes(e),"Invalid enum at "+n),t.type){const o=e===null?"null":Array.isArray(e)?"array":typeof e;H(o===t.type,"Invalid type at "+n)}if(t.minLength&&H(e.trim().length>=t.minLength,"Empty field at "+n),t.pattern&&H(new RegExp(t.pattern).test(e),"Invalid pattern at "+n),t.type==="object"){for(const o of t.required??[])H(Object.hasOwn(e,o),"Missing "+n+"."+o);for(const o of Object.keys(e))H(Object.hasOwn(t.properties,o),"Unknown field "+n+"."+o),En(e[o],t.properties[o],n+"."+o)}t.type==="array"&&e.forEach((o,i)=>En(o,t.items,n+"["+i+"]"))}function Nd(e){const t=new Map,n=new Map,o=new Map,i=(s,r,l)=>{H(!t.has(s.id),"Duplicate ID: "+s.id),t.set(s.id,s),n.set(s.id,r.id),o.set(s.id,l)};for(const s of e.documents){i(s,s,"document");for(const[r,l]of Object.entries({objects:"object",activities:"activity",relations:"relation",findings:"finding",sections:"section",guarantees:"guarantee",examples:"example",items:"check",notes:"note",states:"state",transitions:"transition",roles:"role",exceptions:"exception"}))for(const u of s[r]??[])i(u,s,l)}for(const s of e.externalDocuments){i(s,s,"document");for(const r of s.activities)i(r,s,"activity")}return{map:t,owner:n,types:o}}function Jo(e){return En(e),na(e)}function Gn(e,t){const n=new Set(e.items.map(r=>r.id)),o=new Set,i=e.guarantees.find(r=>r.id===t.guaranteeId),s=r=>{if(Array.isArray(r)){for(const l of r)s(l);return}if(r&&typeof r=="object"){r.kind==="reference"&&n.has(r.targetId)&&o.add(r.targetId);for(const l of Object.values(r))l&&typeof l=="object"&&s(l)}};s(t.rows);for(const r of i?.blocks??[])r.kind==="prose"&&s(r.content);for(const r of e.items)(r.fields.guarantee??[]).some(u=>u.kind==="reference"&&(u.targetId===t.id||u.targetId===t.guaranteeId))&&o.add(r.id);return[...o]}function na(e,{allowUnresolvedFindings:t=!1}={}){H(e.documents.length>0,"Document required");const{map:n,owner:o,types:i}=Nd(e),s=[...e.diagnostics],r=new Set;for(const d of e.sources)if(d.uri){const p=new URL(d.uri);H(p.protocol==="https:"&&!p.username&&!p.password,"Unsafe source URI")}const l=(d,p,g)=>(H(n.has(d),"Dangling reference: "+d),p&&H(i.get(d)===p,"Reference type mismatch: "+d),g&&H(o.get(d)===g,"Cross-document mismatch: "+d),n.get(d)),u=d=>d?.some(p=>p.kind==="text"?p.value.trim().length>0:!0),c=(d,p)=>{for(const g of d)if(g.kind==="reference"&&(l(g.targetId,null,p),H(["document","section","guarantee","example","check","note"].includes(i.get(g.targetId)),"Invalid rich reference target")),g.kind==="link"){const m=new URL(g.uri);H(m.protocol==="https:"&&!m.username&&!m.password,"Unsafe external link")}};for(const d of e.documents)if(H(e.formatVersion!=="0.1"||d.kind!=="stateTransition","State documents require formatVersion 0.2"),d.kind==="businessDesign"){H(d.activities.length>0,"Activity required");const p=[...d.objects,...d.activities].map(h=>h.name);H(new Set(p).size===p.length,"Duplicate visible name"),H(p.every(h=>h===h.trim()&&!(e.formatVersion==="0.4"?[`
`,"\r"]:[`
`,"\r"," — "," → ","<!--"]).some(x=>h.includes(x))),"Invalid Graph-visible name");for(const h of d.objects)H(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(h.icon),"Invalid icon");if(["0.2","0.3"].includes(d.schemaVersion)){H(new Set(d.roles.map(h=>h.name)).size===d.roles.length,"Duplicate Role name"),H(d.roles.every(h=>h.name===h.name.trim()&&!/[\r\n]/.test(h.name)),"Invalid Role name");for(const h of d.activities)h.roleId!==null?l(h.roleId,"role",d.id):r.add("Role未確定: "+h.id+" — "+h.who)}for(const h of d.activities)H(h.problem===null==(h.painLevel===null),"Problem/Pain pair mismatch");for(const h of d.exceptions??[])l(h.activityId,"activity",d.id);const g={input:["object","activity"],output:["activity","object"],"business-exception":["activity","activity"],"object-exception":["object","object"]},m=new Set;for(const h of d.relations){l(h.fromId,g[h.kind][0],d.id),l(h.toId,g[h.kind][1],d.id);const x=JSON.stringify([h.kind,h.fromId,h.toId,h.label]);H(!m.has(x),"Duplicate relation"),m.add(x)}H(new Set(d.findings.map(h=>h.sourceId)).size===d.findings.length,"Duplicate Finding source ID");for(const h of d.findings){H(h.scope==="items"?h.targetIds.length+h.unresolvedTargets.length>0:!h.targetIds.length&&!h.unresolvedTargets.length,"Finding scope mismatch"),H(new Set(h.targetIds).size===h.targetIds.length,"Duplicate Finding target");for(const x of h.targetIds)l(x,null,d.id),H(["object","activity"].includes(i.get(x)),"Invalid Finding target");h.unresolvedTargets.length&&(H(t,"Unresolved Finding target: "+h.sourceId),s.push("Finding参照未決: "+h.sourceId))}}else if(d.kind==="stateTransition"){const p=l(d.basedOn.documentId,"document");H(p.kind==="businessDesign"&&p.objects,"State source must be an in-package BD"),H(p.revision===d.basedOn.revision,"Stale State source revision"),l(d.objectId,"object",p.id),H(!e.documents.some(m=>m!==d&&m.kind==="stateTransition"&&m.objectId===d.objectId),"Duplicate Object state declaration"),H(d.states.length>0&&new Set(d.states.map(m=>m.name)).size===d.states.length,"Duplicate/empty state names"),H(d.states.every(m=>!m.name.startsWith("@")),"Reserved state name"),H(d.transitions.length<=1e3,"State transition row budget"),H(new Set(d.transitions.map(m=>m.sourceId)).size===d.transitions.length,"Duplicate transition source ID");const g=new Map;for(const m of d.transitions){m.fromId!=="@new"&&l(m.fromId,"state",d.id),["@unknown","@none"].includes(m.toId)||l(m.toId,"state",d.id);const h=l(m.activityId,"activity",p.id),x=JSON.stringify([m.fromId,m.activityId,m.condition.trim().replace(/\s+/gu," ")]);if(H(!g.has(x),"Duplicate state transition condition: "+g.get(x)+" / "+m.sourceId),g.set(x,m.sourceId),e.formatVersion==="0.4")if(H(m.path!=="normal"||m.exceptionId===null,"Normal transition cannot reference an exception"),m.exceptionId!==null){const C=l(m.exceptionId,"exception",p.id);H(C.activityId===h.id,"Exception Activity mismatch")}else m.path==="exception"&&H(s.includes("例外参照未決: "+m.id),"Unresolved exception requires a diagnostic");else H(m.path!=="normal"||m.exception===null,"Normal transition cannot name an exception"),s.push("旧JSONの名前による例外参照は互換入力adapterで検査・変換が必要: "+m.id);H(m.effect!=="unchanged"||m.fromId===m.toId,"Unchanged state mismatch"),H(m.effect!=="change"||!m.toId.startsWith("@")&&m.fromId!==m.toId,"Invalid changed state"),H(m.effect!=="no-create"||m.fromId==="@new"&&m.toId==="@none","Invalid no-create transition"),H(m.effect!=="constraint"||m.toId==="@unknown","Constraint must remain undecided")}s.push("状態遷移は部分定義・業務意味未確認: "+d.id)}else if(d.kind==="conceptModel"){const p=l(d.basedOn.documentId,"document");H(p.kind==="businessDesign"&&p.revision===d.basedOn.revision,"Concept source must be the matching in-package BD revision"),H(!e.documents.some(A=>A!==d&&A.kind==="conceptModel"&&A.basedOn.documentId===p.id),"Duplicate Concept model for Business Design");const g=(A,q)=>{const P=new Map;for(const W of A)H(!P.has(W.id),"Duplicate "+q+" ID: "+W.id),P.set(W.id,W);return P},m=g(d.subsystems,"subsystem"),h=g(d.concepts,"concept"),x=g(d.relations,"concept relation"),C=g(d.reviewGroups,"review group"),v=g(d.handoffs,"handoff"),M=g(d.concepts.flatMap(A=>A.information),"concept information"),I=(A,q,P)=>(H(A.has(q),"Unknown "+P+": "+q),A.get(q)),y=A=>l(A,"activity",p.id),D=A=>{const q=l(A.documentId,"document");H(q.revision===A.revision,"Stale Concept source revision");const P=q.id===p.id,W=q.kind==="stateTransition"&&q.basedOn.documentId===p.id&&d.relatedStates.some(R=>R.documentId===q.id&&R.revision===q.revision);H(P||W,"Concept source must refer to its Business Design or a declared State"),l(A.targetId,A.targetType,q.id)};for(const A of d.relatedStates){const q=l(A.documentId,"document");H(q.kind==="stateTransition"&&q.revision===A.revision&&q.basedOn.documentId===p.id,"Invalid Concept state reference")}for(const A of d.subsystems)for(const q of A.activityIds)y(q);for(const A of d.concepts){I(m,A.subsystemId,"subsystem");for(const q of A.information)q.responsibleSubsystemId&&I(m,q.responsibleSubsystemId,"responsible subsystem");for(const q of A.businessObjectIds)l(q,"object",p.id);for(const q of A.activityLinks)y(q.activityId);for(const q of A.sourceRefs)D(q)}for(const A of d.relations){I(h,A.fromConceptId,"concept"),I(h,A.toConceptId,"concept");for(const q of A.sourceRefs)D(q)}for(const A of d.handoffs){I(m,A.fromSubsystemId,"subsystem"),I(m,A.toSubsystemId,"subsystem"),H(A.fromSubsystemId!==A.toSubsystemId,"Handoff must cross subsystem boundary");for(const q of A.activityIds)y(q)}const T=(A,q)=>{const P=g(A.nodes,"subsystem view"),W=g(A.edges,"subsystem view edge");for(const $ of P.values()){I(q,$.conceptId,"view concept"),I(m,$.subsystemId,"subsystem");const L=I(h,$.conceptId,"concept");for(const O of $.fields)H(L.information.some(U=>U.id===O.informationId),"Unknown information for subsystem view: "+O.informationId)}for(const $ of W.values()){const L=I(P,$.fromViewId,"subsystem view"),O=I(P,$.toViewId,"subsystem view");H(L.subsystemId===O.subsystemId,"View relationship crosses subsystem boundary"),H($.relationIds.length>0,"Subsystem view relationship needs a concept relation");let U=L.conceptId;for(const Q of $.relationIds){const pe=I(x,Q,"concept relation");H(pe.fromConceptId===U,"Subsystem view relation path is disconnected: "+Q),U=pe.toConceptId}H(U===O.conceptId,"Subsystem view relation target differs")}H(new Set(A.handoffIds).size===A.handoffIds.length,"Duplicate subsystem view handoff");const R=new Set([...P.values()].map($=>$.subsystemId));for(const $ of A.handoffIds){const L=I(v,$,"handoff");H(R.has(L.fromSubsystemId)&&R.has(L.toSubsystemId),"Missing subsystem view handoff region: "+$)}};d.presentation.subsystemViews&&T(d.presentation.subsystemViews,h);for(const A of d.reviewGroups){I(m,A.subsystemId,"subsystem"),l(A.reviewer.roleId,"role",p.id);for(const R of A.relatedActivityIds)y(R);const q=g(A.graph.nodes.map(R=>({...R,id:R.conceptId})),"view concept");H(new Set(A.graph.conceptIds).size===A.graph.conceptIds.length&&A.graph.conceptIds.length===q.size&&A.graph.conceptIds.every(R=>q.has(R)),"View concepts and nodes differ");for(const R of A.graph.nodes){I(h,R.conceptId,"concept");for(const $ of R.sourceActivityIds)y($)}g(A.graph.edges,"view edge");for(const R of A.graph.edges){I(q,R.fromConceptId,"view concept"),I(q,R.toConceptId,"view concept");for(const $ of R.relationIds)I(x,$,"concept relation")}A.graph.subsystemViews&&T(A.graph.subsystemViews,q);const P=g(A.capabilities,"capability"),W=g(A.capabilities.flatMap(R=>R.samples),"sample");g(A.limitations,"limitation"),g(A.structureStatements,"structure statement");for(const R of A.structureStatements){for(const $ of R.sampleIds)I(W,$,"sample");for(const $ of R.sourceRefs)D($)}for(const R of P.values())if(R.testSpecification){const $=R.testSpecification;for(const[O,U]of Object.entries($))H(new Set(U).size===U.length,"Duplicate function specification reference: "+O);const L=(O,U)=>{const Q=l(O,U),pe=l(o.get(O),"document");return H(pe.kind==="checkItems"&&pe.basedOn.documentId===p.id&&pe.basedOn.revision===p.revision,"Function Check source mismatch: "+O),{value:Q,doc:pe}};for(const O of[...$.decisionCheckIds,...$.resultCheckIds])L(O,"check");for(const O of $.decisionExampleIds){const{value:U,doc:Q}=L(O,"example"),pe=Gn(Q,U);H(pe.length>0,"Function decision table needs a Check: "+O),H(pe.every(ce=>$.decisionCheckIds.includes(ce)),"Function decision table Check is not assigned: "+O)}for(const O of $.sampleIds){const U=R.samples.find(Q=>Q.id===O);H(U,"Function result sample belongs to another capability: "+O),H(U.checkIds.some(Q=>$.resultCheckIds.includes(Q)),"Function result sample needs a result Check: "+O),H(U.checkIds.every(Q=>$.resultCheckIds.includes(Q)||$.decisionCheckIds.includes(Q)),"Function result sample Check is not assigned: "+O)}}for(const R of P.values())for(const $ of R.samples){if(d.schemaVersion==="0.2"){H($.checkIds.length>0,"Sample needs a Check: "+$.id),H(new Set($.checkIds).size===$.checkIds.length,"Duplicate sample Check: "+$.id);for(const L of $.checkIds){l(L,"check");const O=l(o.get(L),"document");H(O.kind==="checkItems"&&O.basedOn.documentId===p.id&&O.basedOn.revision===p.revision,"Sample Check source mismatch: "+L)}}for(const L of $.blocks){I(q,L.card,"view concept");const O=g(L.columns,"sample column");for(const U of L.columns)I(M,U.informationId,"concept information");g(L.rows,"sample row");for(const U of L.rows){const Q=new Set;for(const pe of U.cells)I(O,pe.columnId,"sample column"),H(!Q.has(pe.columnId),"Duplicate sample cell: "+pe.columnId),Q.add(pe.columnId);H(Q.size===O.size,"Sample row does not match columns")}}}}for(const A of d.presentation.landscapeRelationships){const q=I(C,A.from,"review group"),P=I(C,A.to,"review group");H(q.subsystemId===P.subsystemId,"Internal relationship crosses subsystem boundary")}for(const A of d.presentation.reviewBoundaries)I(C,A.from,"review group"),I(C,A.to,"review group");s.push("概念モデルの業務意味は未確認: "+d.id)}else{const p=l(d.basedOn.documentId,"document");H(p.kind==="businessDesign","Check source is not BD"),H(p.revision===d.basedOn.revision,"Stale Check source revision"),s.push("Check原典の意味対応は未確認: "+d.id),H(new Set(d.items.map(h=>h.checkId)).size===d.items.length,"Duplicate Check ID");const g=new Set;for(const h of d.index){l(h.activityId,"activity",p.id),H(!g.has(h.activityId),"Duplicate Activity index"),g.add(h.activityId),H(new Set(h.checkIds).size===h.checkIds.length,"Duplicate Check binding");for(const x of h.checkIds)l(x,"check",d.id)}H(new Set(d.sections.map(h=>h.activityId??h.title)).size===d.sections.length,"Duplicate Activity section");for(const h of d.sections)h.activityId!==null&&(l(h.activityId,"activity",p.id),H(g.has(h.activityId),"Section missing from index")),c(h.preamble,d.id);const m=new Set(e.documents.filter(h=>h.kind==="conceptModel"&&h.basedOn.documentId===p.id&&h.basedOn.revision===p.revision).flatMap(h=>h.reviewGroups.flatMap(x=>x.capabilities.flatMap(C=>C.testSpecification?.decisionExampleIds??[]))));for(const h of d.guarantees){const x=h.blocks.length>0&&h.blocks.every(C=>C.kind==="example"&&m.has(C.exampleId)&&d.examples.some(v=>v.id===C.exampleId&&v.guaranteeId===h.id&&Gn(d,v).length>0));H(h.blocks.some(C=>C.kind==="prose"&&u(C.content))||x,"General guarantee prose required"),l(h.sectionId,"section",d.id);for(const C of h.blocks)if(C.kind==="prose")c(C.content,d.id);else{const v=l(C.exampleId,"example",d.id);H(v.guaranteeId===h.id,"Example owner mismatch")}}for(const h of d.examples){l(h.guaranteeId,"guarantee",d.id),H(h.columns.length>0,"Example columns required");for(const x of h.rows){H(x.length===h.columns.length,"Example column mismatch");for(const C of x)c(C,d.id)}}for(const h of d.items){const x=l(h.sectionId,"section",d.id);H(x.activityId===null?!d.index.some(C=>C.checkIds.includes(h.id)):d.index.some(C=>C.activityId===x.activityId&&C.checkIds.includes(h.id)),"Primary Check absent from Activity index or assigned while declared unassigned"),H(u(h.fields.guarantee)||u(h.fields.condition)&&u(h.fields.expectedResult),"Check guarantee required");for(const C of Object.values(h.fields))c(C,d.id);H(x.activityId===null||d.index.some(C=>C.checkIds.includes(h.id)),"Unbound Check")}for(const h of d.notes)c(h.content,d.id);c(d.intro,d.id)}const a=e.diagnostics.filter(d=>d.startsWith("Role未確定:"));H(new Set(a).size===a.length,"Duplicate unresolved Role diagnostic");for(const d of a)H(r.delete(d),"Unresolved Who requires a diagnostic matching a current unresolved Activity");H(r.size===0,"Unresolved Who requires a diagnostic");const f=new Set;for(const d of e.sources){l(d.documentId,"document");const p=d.documentId+"@"+d.revision;H(!f.has(p),"Duplicate source descriptor"),f.add(p)}for(const d of e.externalDocuments)H(e.sources.some(p=>p.documentId===d.id&&p.revision===d.revision),"External source revision missing"),H(d.activities.length>0,"External activity catalog required"),s.push("外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: "+d.id);return{diagnostics:s,entities:n.size}}const ne=(e,t)=>{const n=document.createElement(e);return t!==void 0&&(n.textContent=t),n};function ir(e,t,n){if(n==null)return;const o=jn(n);return e.append(ne("h3",t),o),o}function Md(e,t){if(e===null)return;const n=jn(e),o=s=>String(s??"").replace(/\s+/g,""),i=new Set(t.map(s=>o(jn(`**${s.name}** — ${s.description}`).textContent)));for(const s of Array.from(n.querySelectorAll("li")))i.has(o(s.textContent))&&s.remove();for(const s of Array.from(n.querySelectorAll("ul,ol")))s.children.length||s.remove();return n.textContent?.trim()?n:void 0}const Ld={classification:"分類",condition:"条件",expectedResult:"期待結果",guarantee:"一般保証",question:"未決事項",alternatives:"選択肢",evidence:"根拠",testEvidence:"Test証拠",derivation:"導出",confidence:"確信度",related:"関連"};function Rd(e,t,n){const o=new Map,i=new Set,s=new Set(n.map(l=>l.id)),r=e.model.business;for(const l of e.model.concepts??[]){if(l.basedOn.documentId!==r.id||l.basedOn.revision!==r.revision)continue;const u=l.presentation.activityViews;if(Array.isArray(u)){for(const c of u)if(!(!c||typeof c!="object"||Array.isArray(c)||c.activityId!==t||!Array.isArray(c.businessVariations)))for(const a of c.businessVariations){if(!a||typeof a!="object"||Array.isArray(a)||typeof a.exceptionId!="string"||!s.has(a.exceptionId)||a.kind!=="alternative"&&a.kind!=="exception"||i.has(a.exceptionId))continue;const f=o.get(a.exceptionId);f&&f!==a.kind?(o.delete(a.exceptionId),i.add(a.exceptionId)):o.set(a.exceptionId,a.kind)}}}return o}function Dd(e,t){const n=ne("article");n.className="markdown json-detail";const o=e.model,i=o.business,s=i.objects.find(l=>l.id===t),r=i.activities.find(l=>l.id===t);if(s){ir(n,"Scope",String(s.scope)),n.append(ne("h3","Information"));const l=ne("ul");for(const u of s.information)l.append(ne("li",u));n.append(l)}else if(r){const l=i.exceptions?.filter(d=>d.activityId===r.id)??[];for(const[d,p]of[["Scope","scope"],["Why","why"],["When","when"],["Who","who"],["Where","where"],["Procedure","procedure"],["Result","result"],["Problem","problem"],["Pain level","painLevel"]]){const g=ir(n,d,p==="who"?hs(e,r.id)?.name??r.who:r[p]===null?null:String(r[p]));p==="result"&&g&&(g.dataset.businessResult="")}const u=Md(r.exception,l),c=Rd(e,r.id,l),a=(d,p,g)=>{if(!p.length&&!g)return;const m=ne("section");m.dataset.businessVariations="",m.append(ne("h3",d)),g&&m.append(g);for(const h of p){const x=jn(h.description);x.dataset.businessException=h.id,m.append(ne("h4",h.name),x)}n.append(m)};c.size?(a("例外",l.filter(d=>c.get(d.id)==="exception")),a("別ルート",l.filter(d=>c.get(d.id)==="alternative")),a("通常以外の扱い",l.filter(d=>!c.has(d.id)),u)):a("通常以外の扱い",l,u);const f=new Map([...i.objects,...i.activities].map(d=>[d.id,d.name]));for(const[d,p]of[["input","Input"],["output","Output"],["business-exception","Exception When"]]){const g=i.relations.filter(h=>h.kind===d&&(h.fromId===t||h.toId===t));if(!g.length)continue;n.append(ne("h3",p));const m=g.map(h=>`${f.get(h.fromId)} → ${f.get(h.toId)} — ${h.label}`);if(d==="business-exception")for(const h of m)n.append(ne("p",h));else{const h=ne("ul");for(const x of m)h.append(ne("li",x));n.append(h)}}}else n.append(ne("p","項目を選択すると業務内容を表示します。"));return n}class wo{constructor(t,n=!1){this.doc=t,this.requester=n}doc;requester;remaining=5e3;warned=!1;take(t){return this.remaining-- >0?!0:(this.warned||(this.warned=!0,t.append(ne("p","展開する内容が表示量の上限に達しました。続きは原文で確認してください。"))),!1)}runs(t,n,o=new Set){for(const i of n){if(!this.take(t))break;if(i.kind==="markdown"){t.append(jn(i.value));continue}if(i.kind==="text"){const u=ne("span",i.value);u.style.whiteSpace="pre-wrap",t.append(u);continue}if(i.kind==="link"){t.append(ne("span",`${i.label} (${i.uri})`));continue}const s=ne("details"),r=ne("summary",i.label||i.targetId);s.append(r),t.append(s);let l=!1;s.addEventListener("toggle",()=>{if(!s.open||l)return;if(l=!0,o.has(i.targetId)){s.append(ne("p","循環参照："+i.targetId));return}if(o.size>=16){s.append(ne("p","参照の深さの上限です。続きは原文で確認してください。"));return}const u=new Set(o).add(i.targetId),c=this.doc,a=c.guarantees.find(m=>m.id===i.targetId),f=c.examples.find(m=>m.id===i.targetId),d=c.items.find(m=>m.id===i.targetId),p=c.sections.find(m=>m.id===i.targetId),g=c.notes.find(m=>m.id===i.targetId);if(a){s.append(ne("h4",a.title));for(const m of a.blocks){if(!this.take(s))break;m.kind==="prose"?this.runs(s,m.content,u):this.example(s,m.exampleId,u)}}else if(f)this.example(s,f.id,u);else if(d){s.append(ne("p",`${d.checkId} · ${d.title}`+(this.requester?"":` · ${d.reviewState}`))),this.requester&&(d.reviewState==="要確認"||d.reviewState==="要修正")&&s.append(ne("p","確認が必要です。"));const m=this.requester?Object.fromEntries(Object.entries(d.fields).filter(([h])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(h))):d.fields;this.fields(s,m,u)}else p?(s.append(ne("h4",p.title)),this.runs(s,p.preamble,u)):g?(s.append(ne("h4",g.title)),this.runs(s,g.content,u)):i.targetId===c.id&&(s.append(ne("h4",c.title)),this.runs(s,c.intro,u))})}}fields(t,n,o,i=!1){for(const[s,r]of Object.entries(n)){if(!this.take(t))break;if(t.append(ne("h4",Ld[s]??s)),s==="guarantee"&&i){const l=new Set;for(const u of r){const c=u.kind==="reference"?this.doc.guarantees.find(f=>f.id===u.targetId):void 0;if(!c){this.runs(t,[u],o);continue}if(l.has(c.id))continue;l.add(c.id);const a=new Set(o).add(c.id);for(const f of c.blocks){if(!this.take(t))break;f.kind==="prose"?this.runs(t,f.content,a):this.example(t,f.exampleId,a)}}}else this.runs(t,r,o)}}example(t,n,o,i=!1){const s=this.doc.examples.find(f=>f.id===n);if(!Gn(this.doc,s).length)return;const r=ne("table"),l=i?s.columns.indexOf("結果"):-1,u=l>0&&s.columns.at(-1)==="Check ID";if(u){const f=ne("colgroup");f.span=l,r.append(f);for(let h=l;h<s.columns.length;h++)r.append(ne("colgroup"));const d=ne("thead"),p=ne("tr"),g=ne("th","条件");g.colSpan=l,g.scope="colgroup",p.append(g);for(let h=l;h<s.columns.length;h++){const x=ne("th",s.columns[h]);x.rowSpan=2,x.scope="col",h===l?x.className="decision-result":s.columns[h]==="備考"&&(x.className="decision-notes"),p.append(x)}const m=ne("tr");for(const h of s.columns.slice(0,l)){const x=ne("th",h);x.scope="col",m.append(x)}d.append(p,m),r.append(d)}else{const f=ne("tr");for(const d of s.columns){if(!this.take(t))break;f.append(ne("th",d))}r.append(f)}const c=u?ne("tbody"):r;for(const f of s.rows){if(!this.take(t))break;const d=ne("tr");for(const[p,g]of f.entries()){if(!this.take(t))break;const m=ne("td");if(u&&p===l?m.className="decision-result":u&&s.columns[p]==="備考"&&(m.className="decision-notes"),i)for(const h of g){const x=h.kind==="reference"?this.doc.items.find(C=>C.id===h.targetId):void 0;x?m.append(ne("span",x.checkId)):this.runs(m,[h],o)}else this.runs(m,g,o);d.append(m)}c.append(d)}u&&r.append(c);const a=ne("div");a.className="json-example",a.append(r),t.append(a)}}function sr(e,t,n=e.model.checks,o=new Set,i=new Set){const s=ne("section");s.className="check-content json-checks";const r=e.model.business,l=n.filter(c=>c.basedOn.documentId===r.id);let u=!1;for(const c of l){const a=new wo(c),f=c.index.filter(m=>m.activityId===t),d=new Set(c.index.flatMap(m=>m.checkIds)),p=(t?[...new Set(f.flatMap(m=>m.checkIds))]:c.items.filter(m=>!d.has(m.id)).map(m=>m.id)).filter(m=>!o.has(m)),g=c.sections.filter(m=>t?m.activityId===t:m.activityId===null);for(const m of g){(m.preamble.length||c.guarantees.some(h=>h.sectionId===m.id&&!i.has(h.id)))&&(u=!0),a.runs(s,m.preamble);for(const h of c.guarantees.filter(x=>x.sectionId===m.id&&!i.has(x.id)))a.runs(s,[{kind:"reference",targetId:h.id,label:h.title}])}for(const m of p){const h=c.items.find(v=>v.id===m);if(!h)continue;u=!0;const x=ne("section");x.className="check-item",x.dataset.checkId=h.checkId,x.dataset.elementId=h.id,x.append(ne("h3",h.checkId+" · "+h.title)),(h.reviewState==="要確認"||h.reviewState==="要修正")&&x.append(ne("p","確認が必要です。"));const C=Object.fromEntries(Object.entries(h.fields).filter(([v])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(v)));a.fields(x,C,new Set([h.id])),s.append(x)}if(!t)for(const m of c.notes)u=!0,a.runs(s,[{kind:"reference",targetId:m.id,label:m.title}])}return u||s.append(ne("p","この業務のテスト仕様はありません。")),s}function Td(e,t,n=e.model.checks){const o=ne("section");o.className="check-content json-checks sample-checks";const i=e.model.business,s=new Set(t);for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new wo(r);for(const u of r.items.filter(c=>s.has(c.id))){const c=ne("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(ne("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(ne("p","確認が必要です。"));const a=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["classification","condition","expectedResult","guarantee","question","alternatives"].includes(f)));l.fields(c,a,new Set([u.id]),!0),o.append(c)}}return o}const Pd=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;function qd(e){const t=[];for(const n of e){if(n.kind!=="text"&&n.kind!=="markdown"){t.push(n);continue}const o=n.value.replace(Pd,"");o===n.value?t.push(n):o.trim()&&t.push({...n,value:o})}return t}function Wd(e,t,n=e.model.checks){const o=ne("section");o.className="check-content json-checks decision-examples";const i=e.model.business;for(const s of t)for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=r.examples.find(g=>g.id===s);if(!l||!Gn(r,l).length)continue;const u=new wo(r,!0),c=r.guarantees.find(g=>g.id===l.guaranteeId),a=ne("section");a.dataset.decisionExample=s;for(const g of c?.blocks??[])g.kind==="prose"&&u.runs(a,qd(g.content),new Set([c.id]));l.rows.length>1&&a.append(ne("p","上から順に判定し、最初に当てはまる行を見ます。"));const f=l.columns.indexOf("結果"),d=f>0?f:l.columns.length;l.rows.some(g=>g.slice(0,d).some(m=>m.some(h=>h.kind==="text"&&/^\s*[-‐]\s*$/.test(h.value))))&&a.append(ne("p","‐＝値不問。")),u.example(a,s,new Set([s]),!0),o.append(a)}return o}function zd(e,t,n=e.model.checks){const o=ne("section");o.className="check-content json-checks decision-checks";const i=e.model.business,s=new Set(t);for(const r of n.filter(l=>l.basedOn.documentId===i.id&&l.basedOn.revision===i.revision)){const l=new wo(r,!0);for(const u of r.items.filter(c=>s.has(c.id))){const c=ne("section");c.className="check-item",c.dataset.checkId=u.checkId,c.dataset.elementId=u.id,c.append(ne("h3",u.checkId+" · "+u.title)),(u.reviewState==="要確認"||u.reviewState==="要修正")&&c.append(ne("p","確認が必要です。")),u.fields.condition?.length&&(c.append(ne("h4","条件")),l.runs(c,u.fields.condition,new Set([u.id])));const a=Object.fromEntries(Object.entries(u.fields).filter(([f])=>["expectedResult","guarantee","question","alternatives"].includes(f)));if(Object.keys(a).length){const f=ne("details");f.append(ne("summary","期待結果")),l.fields(f,a,new Set([u.id]),!0),c.append(f)}o.append(c)}}return o}function $d(e,t,n=e.model.checks,o=new Set){const i=ne("section");i.className="check-content json-checks result-checks";const s=e.model.business,r=new Set(t);for(const l of n.filter(u=>u.basedOn.documentId===s.id&&u.basedOn.revision===s.revision)){const u=new wo(l,!0),c=l.items.filter(a=>r.has(a.id)&&o.has(a.id)&&a.reviewState!=="要確認"&&a.reviewState!=="要修正"&&!a.fields.question?.length&&!a.fields.alternatives?.length);c.length&&i.append(ne("p",c.map(a=>a.checkId).join("、")));for(const a of l.items.filter(f=>r.has(f.id))){if(c.includes(a))continue;const f=ne("section");f.className="check-item",f.dataset.checkId=a.checkId,f.dataset.elementId=a.id,f.append(ne("h3",a.checkId)),(a.reviewState==="要確認"||a.reviewState==="要修正")&&f.append(ne("p","確認が必要です。"));const d=Object.fromEntries(Object.entries(a.fields).filter(([m])=>["expectedResult","guarantee","question","alternatives"].includes(m)));u.fields(f,d,new Set([a.id]),!0);const p=ne("details"),g=ne("summary","Check の詳細");p.append(g,ne("p",a.title)),a.fields.condition?.length&&u.runs(p,a.fields.condition,new Set([a.id])),f.append(p),i.append(f)}}return i}const Ri=e=>!!e&&typeof e=="object"&&!Array.isArray(e);function Ud(e,t){if(!e||e.model.schemaVersion!=="0.2")return[];const n=new Set(e.business.activities.map(a=>a.id)),o=[],i=new Set,s=new Set,r=t.filter(a=>a.basedOn.documentId===e.business.id&&a.basedOn.revision===e.business.revision),l=(a,f)=>r.some(d=>d.items.some(p=>p.id===a)&&(!f||d.index.some(p=>p.activityId===f&&p.checkIds.includes(a)))),u=(a,f,d,p,g=[])=>{const m=f.testSpecification,h=(m?.decisionCheckIds??[]).filter(D=>l(D,d)),x=(m?.resultCheckIds??[]).filter(D=>l(D,d)),C=(m?.decisionExampleIds??[]).filter(D=>r.some(T=>{const A=T.examples.find(P=>P.id===D),q=A?Gn(T,A):[];return q.length>0&&q.every(P=>l(P,d))})),v=f.samples.filter(D=>(!m||m.sampleIds.includes(D.id))&&D.checkIds?.length&&(m?D.checkIds.every(T=>l(T,d)):D.checkIds.some(T=>l(T,d)))),M=C.flatMap(D=>r.flatMap(T=>{const A=T.examples.find(q=>q.id===D);return A?Gn(T,A).filter(q=>l(q,d)):[]})),I=[...new Set([...h,...x,...M,...v.flatMap(D=>(D.checkIds??[]).filter(T=>l(T,d)))])];if(!I.length)return;const y=`fn:${d??"_"}:${a}:${f.id}`;s.has(y)||(s.add(y),o.push({key:y,activityId:d,groupId:a,capability:f,name:p,samples:v,checkIds:I,decisionCheckIds:h,resultCheckIds:x,decisionExampleIds:C,decisionTableCheckIds:[...new Set(M)],businessSections:g}))},c=e.model.presentation.activityViews;if(Array.isArray(c)){for(const a of c)if(!(!Ri(a)||typeof a.activityId!="string"||!n.has(a.activityId)||!Array.isArray(a.testSpecificationFunctions)))for(const f of a.testSpecificationFunctions){if(!Ri(f)||typeof f.groupId!="string"||typeof f.capabilityId!="string")continue;const d=e.model.reviewGroups.find(m=>m.id===f.groupId),p=d?.capabilities.find(m=>m.id===f.capabilityId);if(!d||!p)continue;i.add(JSON.stringify([d.id,p.id]));const g=[];if(Array.isArray(f.businessSections))for(const m of f.businessSections){if(!Ri(m)||!Array.isArray(m.pages)||m.kind!=="result"&&m.kind!=="exception"||m.kind==="exception"&&(typeof m.exceptionId!="string"||!e.business.exceptions?.some(x=>x.id===m.exceptionId&&x.activityId===a.activityId)))continue;const h=[...new Set(m.pages.filter(x=>x==="decision"||x==="result"))];h.length&&g.push({kind:m.kind,exceptionId:m.kind==="exception"?m.exceptionId:void 0,pages:h})}u(d.id,p,a.activityId,typeof f.name=="string"&&f.name.trim()?f.name.trim():p.title,g)}}for(const a of e.model.reviewGroups)for(const f of a.capabilities)i.has(JSON.stringify([a.id,f.id]))||u(a.id,f,void 0,f.title);return o}function rr(e,t,n,o){const i=e.filter(r=>r.groupId===t&&r.capability.id===n),s=i.find(r=>r.samples.some(l=>l.id===o));if(s)return{kind:"sample",key:s.key,sampleId:o};for(const r of i){if(!r.capability.testSpecification)continue;const l=r.capability.samples.find(c=>c.id===o),u=r.decisionExampleIds.length?r.decisionTableCheckIds:r.decisionCheckIds;if(l?.checkIds?.some(c=>u.includes(c)))return{kind:"decision",key:"decision:"+r.key}}}const oa={enabled:!1,get:()=>{}},et=e=>!!e&&typeof e=="object"&&!Array.isArray(e),Wn=e=>typeof e=="string"&&!!e.trim(),pn=(e,t)=>Object.keys(e).every(n=>t.includes(n));function Fd(e,t){return t===void 0?!0:typeof t!="string"?!1:t.split("|").map(o=>o.trim()).some(o=>o==="string"||/^string（[^）]*）$/.test(o)?typeof e=="string":o==="number"?typeof e=="number"&&Number.isFinite(e):o==="boolean"?typeof e=="boolean":o==="null"?e===null:o==="string[]"?Array.isArray(e)&&e.every(i=>typeof i=="string"):o==="array"?Array.isArray(e):o==="object"||o==="object（任意構造）"?et(e):!1)}function Nn(e){return Array.isArray(e)?"["+e.map(Nn).join(",")+"]":et(e)?"{"+Object.keys(e).sort().map(t=>JSON.stringify(t)+":"+Nn(e[t])).join(",")+"}":JSON.stringify(e)}function Vd(e){const t=JSON.parse(JSON.stringify(e));return et(t.meta)&&delete t.meta.previewStructureReview,new TextEncoder().encode(Nn(t))}async function Bd(e){const t=await globalThis.crypto.subtle.digest("SHA-256",new Uint8Array(e));return Array.from(new Uint8Array(t),n=>n.toString(16).padStart(2,"0")).join("")}async function Hd(e,t=Bd){const n=d=>({projection:oa,code:d}),o=e.meta,i=et(o)?o.previewStructureReview:void 0;if(i===void 0)return n("absent");if(!et(i)||i.format!=="alder-preview-structure-review/2"||!pn(i,["format","basedOn","origin","fields"]))return n("catalog-shape");const s=i.basedOn,r=i.origin;if(!et(s)||!pn(s,["kind","documentId","revision","modelSha256"])||s.kind!=="conceptModel"||!Wn(s.modelSha256)||!/^[a-f0-9]{64}$/.test(s.modelSha256))return n("binding-shape");if(s.documentId!==e.id||s.revision!==e.revision)return n("wrong-model");if(!et(r)||!pn(r,["repository","commit","path","sha256"])||!Wn(r.repository)||!Wn(r.path)||typeof r.commit!="string"||!/^[a-f0-9]{40}$/.test(r.commit)||typeof r.sha256!="string"||!/^[a-f0-9]{64}$/.test(r.sha256))return n("origin-shape");if(!Array.isArray(i.fields))return n("fields-shape");const l=new Map,u=new Map,c=new Map,a=new Map;for(const d of e.concepts){if(l.has(d.id))return n("duplicate-concept");l.set(d.id,d);for(const p of d.information){if(u.has(p.id))return n("duplicate-information");u.set(p.id,d.id)}}for(const d of e.relations){if(c.has(d.id))return n("duplicate-relation");c.set(d.id,d)}if(!et(o)||!Array.isArray(o.fieldMappings))return n("missing-mappings");for(const d of o.fieldMappings){if(!et(d)||!Wn(d.informationId)||a.has(d.informationId))return n("duplicate-or-invalid-mapping");if(!u.has(d.informationId))return n("missing-mapping-target");a.set(d.informationId,d)}const f=new Map;for(const d of i.fields){if(!et(d)||!pn(d,["target","purpose","sample","perspectives"])||!et(d.target)||!pn(d.target,["conceptId","informationId"]))return n("entry-shape");const p=d.target,g=p.informationId;if(!Wn(g)||u.get(g)!==p.conceptId)return n("missing-target");if(f.has(g))return n("duplicate-target");const m=a.get(g);if(!m||!Array.isArray(m.relationIds))return n("missing-mapping");const h=m.representation==="relationKey"?m.relationKeyIds:m.relationIds;if(!Array.isArray(h))return n("missing-dependency");for(const C of h){const v=typeof C=="string"?c.get(C):void 0;if(!v||!l.has(v.fromConceptId)||!l.has(v.toConceptId)||v.fromConceptId!==p.conceptId&&v.toConceptId!==p.conceptId)return n("missing-dependency")}if(d.purpose!==void 0&&!Wn(d.purpose))return n("purpose-shape");if(!Array.isArray(d.perspectives)||!d.perspectives.length||d.perspectives.length>3||new Set(d.perspectives).size!==d.perspectives.length||!d.perspectives.every(C=>["依頼者","設計者","開発者"].includes(C)))return n("perspectives-shape");let x;if(d.sample!==void 0){const C=d.sample;if(!et(C)||!pn(C,["value","coverage","when"])||!Object.hasOwn(C,"value")||!["field-value","document-fragment"].includes(String(C.coverage)))return n("sample-shape");if(C.coverage==="document-fragment"&&(!Array.isArray(C.value)||!C.value.every(et)))return n("fragment-shape");const v=m.valueType,M=C.value,I=m.valueDomain;if(!Fd(M,v))return n("sample-type");if(et(I)&&Array.isArray(I.values)&&!I.values.some(y=>et(y)&&Nn(y.value)===Nn(M)))return n("sample-domain");if(C.when!==void 0){if(!Array.isArray(C.when)||!C.when.length)return n("condition-shape");for(const y of C.when)if(!et(y)||!pn(y,["target","predicate"])||y.predicate!=="nonempty"||!et(y.target)||!pn(y.target,["conceptId","informationId"])||u.get(String(y.target.informationId))!==y.target.conceptId||y.target.conceptId!==p.conceptId)return n("missing-dependency")}try{x=typeof C.value=="string"?C.value||'""':JSON.stringify(C.value)}catch{return n("sample-shape")}if(x===void 0)return n("sample-shape")}f.set(g,{purpose:d.purpose,sample:x,perspectives:[...d.perspectives]})}if(f.size!==u.size)return n("incomplete-targets");try{if(await t(Vd(e))!==s.modelSha256)return n("model-content-mismatch")}catch{return n("digest-unavailable")}return{code:"valid",projection:{enabled:!0,get:d=>f.get(d)}}}const Ki=["owned","reference","unknownOut"];function ia(e,t){const n=e.nodes.get(t),o=Object.hasOwn(e.conceptNames,t)?e.conceptNames[t]:void 0;return{local:typeof o?.logicalName=="string"&&o.logicalName.trim()?o.logicalName:n?.name??t,type:typeof o?.typeName=="string"&&o.typeName?o.typeName:n?.name??"未定義"}}function Gd(e){const t=new Map,n=new Map;for(const i of e.nodes.keys()){const s=ia(e,i).local,r=n.get(s)??[];r.push(i),n.set(s,r)}const o=new Set(n.keys());for(const[i,s]of n){if(s.length===1){t.set(s[0],i);continue}let r=1;for(const l of s){let u=i+r++;for(;o.has(u);)u=i+r++;o.add(u),t.set(l,u)}}return t}function sa(e){const t=e.meta&&typeof e.meta=="object"&&!Array.isArray(e.meta)?e.meta:{},n=t.compatibilityReview&&typeof t.compatibilityReview=="object"&&!Array.isArray(t.compatibilityReview)?t.compatibilityReview:{},o=(i,s)=>{const r=n[i];if(!r||typeof r!="object"||Array.isArray(r))return;const l=r[s];if(!l||typeof l!="object"||Array.isArray(l))return;const u=l;return(u.kind==="legacy"||u.kind==="needs-review")&&typeof u.reason=="string"&&u.reason.trim()?{kind:u.kind,reason:u.reason}:void 0};return{concept:i=>o("concepts",i),field:(i,s)=>o("fields",i)??o("concepts",s),relation:(i,s)=>o("relations",i)??o("concepts",s)}}const Uo=e=>e.kind==="legacy"?"互換・移行用":"要確認";function ys(e){const t=new Map(e.concepts.map(y=>[y.id,y])),n=e.meta&&typeof e.meta=="object"?e.meta:{},o=n.relationNames&&typeof n.relationNames=="object"&&!Array.isArray(n.relationNames)?n.relationNames:{},i=n.reverseRelationNames&&typeof n.reverseRelationNames=="object"&&!Array.isArray(n.reverseRelationNames)?n.reverseRelationNames:{},s=n.conceptNames&&typeof n.conceptNames=="object"&&!Array.isArray(n.conceptNames)?n.conceptNames:{},r=Array.isArray(n.fieldMappings)?n.fieldMappings.filter(y=>!!y&&typeof y=="object"&&typeof y.informationId=="string"&&typeof y.physicalName=="string"&&Array.isArray(y.relationIds)&&y.relationIds.every(D=>typeof D=="string")):[],l=new Map;for(const y of r){const D=l.get(y.informationId)??[];D.push(y),l.set(y.informationId,D)}const u=new Map([...l].filter(([,y])=>y.length===1).map(([y,D])=>[y,D[0]])),c=y=>y.representation==="relationKey"?Array.isArray(y.relationKeyIds)&&y.relationKeyIds.every(D=>typeof D=="string")?y.relationKeyIds:[]:y.relationIds,a=new Map;for(const y of e.relations){const D=a.get(y.id)??[];D.push(y),a.set(y.id,D)}const f=new Map([...a].filter(([,y])=>y.length===1).map(([y,D])=>[y,D[0]])),d=new Set;for(const y of e.concepts)for(const D of y.information){const T=u.get(D.id);T?.representation!=="relationKey"||!c(T).length||c(T).every(A=>{const q=f.get(A);return!!q&&t.has(q.fromConceptId)&&t.has(q.toConceptId)&&(q.kind==="reference"&&q.fromConceptId===y.id||q.kind==="down"&&(q.fromConceptId===y.id||q.toConceptId===y.id))})&&d.add(D.id)}const p=Array.isArray(n.relationPhysicalFields)?n.relationPhysicalFields.filter(y=>!!y&&typeof y=="object"&&typeof y.relationId=="string"&&typeof y.physicalName=="string"&&!!y.physicalName.trim()):[],g=new Map;for(const y of t.keys())g.set(y,[]);for(const y of e.relations){if(!t.has(y.fromConceptId)||!t.has(y.toConceptId))continue;const D=j=>typeof j=="string"&&j.trim()?j:"未定義",T=j=>t.get(j).information.flatMap(z=>{const B=u.get(z.id);return B&&c(B).includes(y.id)?[{name:z.name,physicalName:B.physicalName,valueType:B.valueType}]:[]}),A=T(y.fromConceptId),q=T(y.toConceptId),P=Object.hasOwn(o,y.id)?o[y.id]:void 0,W=typeof P=="string"&&P.trim()?P.trim():void 0,R=Object.hasOwn(i,y.id)?i[y.id]:void 0,$=typeof R=="string"&&R.trim()?R.trim():void 0,L=y.kind,O=L==="down"?t.get(y.toConceptId).information.flatMap(j=>{const z=u.get(j.id);return d.has(j.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]}):[],U=t.get(y.fromConceptId).information.flatMap(j=>{const z=u.get(j.id);return d.has(j.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]}),Q=p.filter(j=>j.relationId===y.id).map(j=>j.physicalName),pe=[...new Set([...A.map(j=>j.physicalName),...O,...Q])],ce=new Set([...U,...O,...Q]),se=new Set(t.get(y.fromConceptId).information.flatMap(j=>{const z=u.get(j.id);return!d.has(j.id)&&z&&c(z).includes(y.id)?[z.physicalName]:[]})),re=pe.filter(j=>!ce.has(j)||se.has(j));g.get(y.fromConceptId).push({relation:y,from:y.fromConceptId,to:y.toConceptId,direction:L==="down"?"owned":L==="reference"?"reference":"unknownOut",count:D(y.toLabel),reverseCount:D(y.fromLabel),fields:pe,visibleFields:re,fieldDetails:A,roleName:W}),g.get(y.toConceptId).push({relation:y,from:y.toConceptId,to:y.fromConceptId,direction:L==="down"?"owner":L==="reference"?"referencedBy":"unknownIn",count:D(y.fromLabel),reverseCount:D(y.toLabel),fields:q.map(j=>j.physicalName),visibleFields:q.map(j=>j.physicalName),fieldDetails:q,...L==="down"&&$?{roleName:$}:{}})}const m=new Set(e.relations.filter(y=>y.kind==="down"&&t.has(y.fromConceptId)&&t.has(y.toConceptId)).map(y=>y.toConceptId)),h=e.concepts.filter(y=>!m.has(y.id)),x=h.filter(y=>{const D=y.information.map(A=>u.get(A.id)).filter(A=>!!A),T=D.find(A=>A.physicalName==="documents[]"&&A.valueType==="array");return D.some(A=>A.physicalName==="format")&&D.some(A=>/^formatVersion(?:\s*:.*)?$/.test(A.physicalName))&&D.some(A=>A.physicalName==="revision")&&!!T&&T.relationIds.some(A=>e.relations.some(q=>q.id===A&&q.kind==="down"&&q.fromConceptId===y.id))}),C=x.length===1?x[0].id:void 0,v=C?[C]:(h.length?h:e.concepts).map(y=>y.id),M=new Set,I=[...v];for(;I.length;){const y=I.pop();if(!M.has(y)){M.add(y);for(const D of g.get(y)??[])Ki.includes(D.direction)&&!M.has(D.to)&&I.push(D.to)}}return{nodes:t,edges:g,mappings:u,relationKeys:d,conceptNames:s,packageRoot:C,roots:v,hasOwnershipRoots:h.length>0,reachable:M}}const ro={owned:"所有",reference:"参照",owner:"所属先",referencedBy:"参照元",unknownOut:"種類未定義（出）",unknownIn:"種類未定義（入）"},ar=(e,t)=>{const n=Dn(e,{"aria-hidden":"true","stroke-width":1.8});if(n.classList.add("structure-icon"),t){n.removeAttribute("aria-hidden"),n.setAttribute("role","img"),n.setAttribute("aria-label",t);const o=document.createElementNS("http://www.w3.org/2000/svg","title");o.textContent=t,n.prepend(o)}return n},ze=(e,t,n,o)=>{const i=document.createElement(t);return i.textContent=n,o&&(i.className=o),e.append(i),i},ra=(e,t)=>{t&&(e.classList.add("structure-review-"+t.kind),ze(e,"span",Uo(t),"structure-review-badge"))};function zn(e,t){const n=ze(e,"div","","structure-review-value");if(Array.isArray(t))for(const[o,i]of t.entries())o&&n.append(document.createTextNode("・")),ze(n,"span",i,"structure-review-perspective");else n.textContent=t}const cr=new WeakMap;async function aa(e,t,n,o){const i={};if(cr.set(e,i),!t.meta||typeof t.meta!="object"||!Object.hasOwn(t.meta,"previewStructureReview")){Fo(e,t,n,o);return}const s=JSON.parse(JSON.stringify(t)),r=Nn(s);Fo(e,s,n,o);const l=await Hd(s);if(cr.get(e)!==i||!l.projection.enabled)return;try{if(Nn(t)!==r)return}catch{return}const u=e.contains(e.ownerDocument.activeElement)?e.ownerDocument.activeElement:void 0,c=u?.className,a=u?.closest("[data-information-id]")?.dataset.informationId;Fo(e,s,n,o,l.projection),a?Array.from(e.querySelectorAll("[data-information-id]")).find(f=>f.dataset.informationId===a)?.querySelector("button")?.focus():c&&/^(structure-copy-id|structure-copy-full|structure-attribute-back)$/.test(c)&&e.querySelector("."+c)?.focus()}const Ro=e=>e.split(" / ").map(t=>t.trim().split(".").pop()??t).join(" / ");function dr(e){const t=e?.valueDomain,n=t?.kind,o=Ji(e);if((n==="enum"||n==="fixed")&&o.length)return o.map(r=>r.literal).join(" | ");const i={identifier:"識別子",version:"版・改訂",reference:"参照",referenceType:"参照先の種類",hash:"SHA-256",uri:"URI",cardinality:"多重度"};if(typeof n=="string"&&i[n])return i[n];const s=typeof e?.valueType=="string"&&e.valueType.trim()?e.valueType:"未定義";return e?.nullableStatus==="proposal"?s.split("|").map(r=>r.trim()).filter(r=>r!=="null").join(" | ")||"未定義":s}function Ji(e){const t=e?.valueDomain;if(!t||!["enum","fixed"].includes(String(t.kind))||!Array.isArray(t.values))return[];const n=[];for(const o of t.values){if(!o||typeof o!="object"||!["string","number","boolean"].includes(typeof o.value))return[];const i=typeof o.value=="string"?o.value||'""':String(o.value);n.push({value:i,literal:JSON.stringify(o.value)??String(o.value),...typeof o.label=="string"&&o.label.trim()?{label:o.label.trim()}:{}})}return n}function lr(e){return e.label?e.value+"："+e.label:e.value}function ur(e){const t=e?.valueDomain?.note;return typeof t=="string"&&t.trim()?t.trim():void 0}function fr(e){return typeof e?.nullable=="boolean"?e.nullable?"許容する":"許容しない":e&&Object.hasOwn(e,"nullable")?"未決":"未定義"}function pr(e,t){const n=typeof e.description=="string"&&e.description.trim()?e.description:t?.logicalMeaning;return typeof n=="string"&&n.trim()?n:"この項目の説明はまだ記載されていません。"}function mr(e,t,n,o,i=[]){const s=document.createElement("div");s.className="structure-copy-actions";const r=document.createElement("span");r.className="structure-copy-status",r.setAttribute("role","status"),r.setAttribute("aria-live","polite");const l=()=>{const d=[];for(const p of Array.from(t.children)){if(p.tagName!=="DT")continue;const g=p.nextElementSibling;if(!g)continue;const m=g.querySelector("table"),h=C=>Array.from(C.childNodes).map(v=>v.nodeName==="UL"||v.nodeName==="OL"?Array.from(v.childNodes).map(M=>M.textContent?.trim()??"").filter(Boolean).join("、"):v.textContent?.trim()??"").filter(Boolean).join(" / "),x=m?Array.from(m.querySelectorAll("tr")).map(C=>Array.from(C.children).map(h).join(" | ")).join(`
`):Array.from(g.childNodes).map(C=>C.nodeName==="BR"?`
`:C.textContent??"").join("");d.push((p.querySelector(".structure-detail-caption")?.textContent??p.textContent??"")+"："+x)}return[o,...i.length?["元の定義："+i.join("、")]:[],...d].join(`
`)},u=async d=>{try{const p=e.ownerDocument.defaultView?.navigator.clipboard;if(!p?.writeText)throw Error("Clipboard unavailable");await p.writeText(d?l():o),r.textContent=d?"全文をコピーしました。":"識別情報をコピーしました。"}catch{r.textContent="コピーできませんでした。ブラウザーの設定を確認してください。"}},c=document.createElement("button");c.type="button",c.className="structure-copy-id",c.textContent="識別情報をコピー",c.title="Shiftを押しながら選ぶと全文をコピー",c.addEventListener("click",d=>{u(d.shiftKey)});const a=document.createElement("button");a.type="button",a.className="structure-copy-full",a.textContent="全文をコピー",a.addEventListener("click",()=>{u(!0)}),s.append(c,a);const f=document.createElement("span");f.className="structure-detail-caption",f.textContent=n.textContent,n.classList.add("structure-copy-heading"),n.replaceChildren(f,s,r)}function Fo(e,t,n,o,i=oa){if(e.replaceChildren(),!n){ze(e,"p","ツリーの項目を選択すると詳細を確認できます。");return}const s=ys(t),r=sa(t),l=s.nodes.get(n.conceptId);if(!l){ze(e,"p","項目が見つかりません。");return}const u=t.meta&&typeof t.meta=="object"?t.meta:{},c=u.modelStatus==="normalized-study"||u.modelStatus==="complete-package-study",a=O=>ia(s,O),f=document.createElement("dl");f.className="structure-detail-list",e.append(f);const d=O=>{o?o(O):i.enabled?Fo(e,t,O,void 0,i):aa(e,t,O),O.kind==="attribute"?e.querySelector(".structure-attribute-back")?.focus():n.kind==="attribute"&&Array.from(e.querySelectorAll(".structure-attribute-table tbody tr")).find(U=>U.dataset.informationId===n.informationId)?.querySelector(".structure-attribute-select")?.focus()},p=(O,U)=>{const Q=document.createElement("dt"),pe=document.createElement("dd");Q.textContent=O;const ce=Array.isArray(U)?U:[U??"未定義"];if(!ce.length)pe.textContent="なし";else for(const[se,re]of ce.entries())se&&pe.append(document.createElement("br")),pe.append(document.createTextNode(re));return f.append(Q,pe),Q};if(n.kind==="attribute"){if(n.returnTo){const fe=document.createElement("button");fe.type="button",fe.className="structure-attribute-back",fe.textContent="項目一覧に戻る",fe.onclick=()=>d(n.returnTo),e.insertBefore(fe,f)}const O=l.information.find(fe=>fe.id===n.informationId);if(!O){f.remove(),ze(e,"p","項目が見つかりません。");return}const U=s.mappings.get(O.id),Q=O,pe=a(l.id),ce="概念モデル："+t.id+"（"+t.revision+`）
構造：`+pe.type+"［"+l.id+`］
項目：`+O.name+(U?.physicalName?"（"+Ro(U.physicalName)+"）":"")+"［"+O.id+"］",se=Array.isArray(u.schemaCoverage)?u.schemaCoverage.flatMap(fe=>fe&&typeof fe=="object"&&fe.informationId===O.id&&typeof fe.path=="string"?[fe.path]:[]):[],re=U?.relationIds.flatMap(fe=>{const ae=(s.edges.get(l.id)??[]).filter(Se=>Se.relation.id===fe);return ae.length?ae.map(Se=>a(Se.to).local+"（"+ro[Se.direction]+"）"):[fe+"（未定義）"]});mr(e,f,p("論理名",U?.physicalName?Ro(U.physicalName):void 0),ce,se),p("ローカル名",O.name),p("型名",dr(U));const j=i.get(O.id),z=p("サンプル",hr(U)??"未記載");j?.sample!==void 0&&zn(z.nextElementSibling,j.sample),p("null許容",fr(U)),p("説明",pr(Q,U));const B=typeof U?.logicalPurpose=="string"?U.logicalPurpose:"",ue=p("使用目的",B);if(!B.trim()&&j?.purpose&&zn(ue.nextElementSibling,j.purpose),i.enabled){const fe=p("確認する立場",j?"":"未指定");if(j){const ae=fe.nextElementSibling;zn(ae,j.perspectives)}}U?.nullableReason&&p("null許容の理由",U.nullableReason);const ee=Ji(U);ee.length&&p(U?.valueDomain?.kind==="fixed"?"値":"選択肢",ee.map(lr));const he=ur(U);he&&p("制約",he);const ge=r.field(O.id,l.id);ge&&p("位置づけ",Uo(ge)+"："+ge.reason),p("所属",a(l.id).local+"（"+a(l.id).type+"）"),p("参照",re),U?.logicalSourcePaths?.length&&p("対応する定義",U.logicalSourcePaths),typeof U?.optional=="boolean"&&p("項目の省略",U.optional?"可能":"不可"),U?.representation&&p("対応の種類",U.representation),O.responsibilityStatus&&p("責任の確認状態",O.responsibilityStatus),O.responsibleSubsystemId&&p("責任を持つサブシステム",t.subsystems.find(fe=>fe.id===O.responsibleSubsystemId)?.name);return}const g=n.relationId?s.edges.get(n.fromId??"")?.find(O=>O.relation.id===n.relationId&&O.to===l.id):void 0,m=a(l.id),h="概念モデル："+t.id+"（"+t.revision+`）
構造：`+m.type+"［"+l.id+"］"+(n.relationId?`
関係：`+n.relationId:""),x=O=>{const U=a(O);return U.local+"（"+U.type+"）"},C=(s.edges.get(l.id)??[]).filter(O=>O.direction==="owner").map(O=>x(O.to)),v=g?.direction==="owned"?[x(g.from)]:C,M=(s.edges.get(l.id)??[]).filter(O=>O.direction==="owned"&&(n.hideLegacy===!1||r.relation(O.relation.id,O.to)?.kind!=="legacy")).map(O=>{const U=a(O.to),Q=r.relation(O.relation.id,O.to);return(Q?Uo(Q)+"：":"")+(O.roleName??U.local)+"（"+U.type+"）"}),I=(s.edges.get(l.id)??[]).filter(O=>O.direction==="reference").map(O=>(O.roleName??"参照")+"："+a(O.to).local),y=g?.fieldDetails.filter(O=>!c||![...s.mappings.values()].some(U=>U.physicalName===O.physicalName&&U.relationIds.length>1)).map(O=>O.physicalName).filter(Boolean).map(Ro);mr(e,f,p("論理名",g?y?.length?y:void 0:m.type),h),p("ローカル名",g?.roleName??g?.fieldDetails[0]?.name??m.local),p("型名",m.type);const D=l.information.filter(O=>!s.relationKeys.has(O.id)&&(n.hideLegacy===!1||r.field(O.id,l.id)?.kind!=="legacy")),T=document.createElement("dt"),A=document.createElement("dd");if(T.textContent="項目とサンプル",f.append(T,A),!D.length)ze(A,"p","表示する属性はありません。","structure-attribute-empty");else{const O=document.createElement("div"),U=document.createElement("table"),Q=document.createElement("thead"),pe=document.createElement("tr"),ce=document.createElement("tbody");O.className="structure-attribute-wrap",U.className="structure-attribute-table",U.setAttribute("aria-label",m.local+"の項目とサンプル"),i.enabled&&U.classList.add("structure-review-table");for(const se of["項目","サンプル","説明","使用目的",...i.enabled?["確認する立場"]:[]]){const re=document.createElement("th");re.scope="col",re.textContent=se,pe.append(re)}Q.append(pe),U.append(Q,ce),O.append(U),A.append(O);for(const se of D){const re=s.mappings.get(se.id),j=se,z=document.createElement("tr"),B=document.createElement("th"),ue=document.createElement("td"),ee=document.createElement("td"),he=document.createElement("td");z.dataset.informationId=se.id,B.scope="row";const ge=document.createElement("button");ge.type="button",ge.className="structure-attribute-name structure-attribute-select",ge.textContent=se.name,ge.onclick=()=>d({kind:"attribute",conceptId:l.id,informationId:se.id,hideLegacy:n.hideLegacy,returnTo:n}),B.append(ge);const fe=r.field(se.id,l.id);fe&&ra(B,fe),re?.physicalName&&ze(B,"span","論理名："+Ro(re.physicalName),"structure-attribute-meta"),ze(B,"span","型："+dr(re),"structure-attribute-meta"),ze(B,"span","null許容："+fr(re),"structure-attribute-meta");const ae=Ji(re);if(ae.length){ze(B,"span",re?.valueDomain?.kind==="fixed"?"値：":"選択肢：","structure-attribute-meta");const ke=document.createElement("ul");ke.className="structure-domain-values";for(const Ue of ae)ze(ke,"li",lr(Ue));B.append(ke)}const Se=ur(re);Se&&ze(B,"span","制約："+Se,"structure-attribute-meta");const ye=hr(re);ye!==void 0?ze(ue,"span",ye,"structure-attribute-sample"):ze(ue,"span","未記載","structure-attribute-missing");const Me=i.get(se.id);if(Me?.sample!==void 0&&zn(ue,Me.sample),ee.textContent=pr(j,re),he.textContent=typeof re?.logicalPurpose=="string"?re.logicalPurpose:"",!he.textContent.trim()&&Me?.purpose&&zn(he,Me.purpose),z.append(B,ue,ee,he),i.enabled){const ke=document.createElement("td");ke.className="structure-review-perspectives",Me?zn(ke,Me.perspectives):ke.textContent="未指定",z.append(ke)}ce.append(z)}}p("所属",v.length?[...new Set(v)]:void 0),M.length&&p("含む構造",[...new Set(M)]),p("参照",g?.direction==="reference"?[m.local+"（"+m.type+"）"]:I);const P=c&&(/^候補の .+。現行0\.7の物理構造そのものではない。$/.test(l.description)||l.description==="0.7候補の構造に基づく概念モデルの検討案。")?"":l.description,W=g?.relation.condition||P;W&&p("説明",W);const R=g?r.relation(g.relation.id,l.id):r.concept(l.id);R&&p("位置づけ",Uo(R)+"："+R.reason),g&&(p("関係の種類",ro[g.direction]),p("多重度",g.count),p("反対側の多重度",g.reverseCount),g.relation.sourceRefs.length&&p("関係の出所",g.relation.sourceRefs.map(O=>[O.documentId,O.revision,O.targetType,O.targetId,O.section].filter(Boolean).join(" / "))),g.relation.condition&&P&&p("構造の説明",P));const $=c&&(l.reason==="正規化候補の構造レビュー。"||l.reason==="Alder JSON概念モデルのレビュー候補。");if(l.reason&&!$&&p("理由",l.reason),l.subsystemId){const O=t.subsystems.find(U=>U.id===l.subsystemId);c&&O?.id==="format-review"||p("サブシステム",O?.name)}const L=(s.edges.get(l.id)??[]).filter(O=>O.direction==="referencedBy").map(O=>{const U=s.edges.get(O.to)?.find(Q=>Q.relation.id===O.relation.id&&Q.direction==="reference"&&Q.to===l.id)?.roleName;return a(O.to).local+(U?"："+U:"")});L.length&&p("参照元",L),l.businessObjectIds.length&&p("関連する対象",l.businessObjectIds),l.activityLinks.length&&p("関連する業務",l.activityLinks.map(O=>O.activityId+(O.uses.length?"："+O.uses.join("、"):""))),l.sourceRefs.length&&p("出所",l.sourceRefs.map(O=>[O.documentId,O.revision,O.targetType,O.targetId,O.section].filter(Boolean).join(" / ")))}function hr(e){if(!e)return;const t=Object.hasOwn(e,"sampleValue")&&e.sampleValue!==void 0?e.sampleValue:e.referenceValue;return typeof t=="string"?t||'""':JSON.stringify(t)}function Kd(e,t,n={}){const o=ys(t),i=sa(t);if(e.replaceChildren(),e.className="structure-explorer",!o.roots.length){ze(e,"p","この構造モデルには概念がありません。","structure-empty");return}if(n.rootId&&!o.nodes.has(n.rootId)){ze(e,"p","指定した構造が見つかりません。","structure-empty");return}const s=n.rootId?[n.rootId]:o.roots,r=document.createElement("section");r.className="structure-panel",e.append(r);const l=document.createElement("div");l.className="structure-toolbar",r.append(l);const u=document.createElement("button");u.type="button",u.textContent="すべて展開",l.append(u);const c=document.createElement("button");c.type="button",c.textContent="すべて折りたたみ",l.append(c);const a=document.createElement("label");a.className="structure-compatibility-filter";const f=document.createElement("input");f.type="checkbox",f.checked=!0,a.append(f,document.createTextNode("互換・移行用を非表示")),a.title="互換・移行用と明示された項目を非表示にします。",l.append(a);const d=document.createElement("label");d.className="structure-search",d.append(ar(pc));const p=document.createElement("input");p.type="search",p.placeholder="構造名・項目名で検索",p.setAttribute("aria-label","構造名・項目名で検索"),d.append(p),l.append(d),!n.rootId&&!o.packageRoot&&!o.hasOwnershipRoots&&ze(r,"p","JSON全体のルートと所有関係の起点を特定できないため、すべての構造を表示します。","structure-unreachable");const g=[...o.nodes.keys()].filter(R=>!o.reachable.has(R));!n.rootId&&g.length&&ze(r,"p",`この起点からたどれない構造：${g.length}件`,"structure-unreachable");const m=[...o.mappings.values()].filter(R=>R.nullable===null).length;m&&ze(r,"p",`null許容が未決：${m}項目（互換・移行用を含む）`,"structure-pending");const h=document.createElement("div");h.className="structure-tree",h.setAttribute("aria-label","構造のツリー"),r.append(h);const x=document.createElement("p");x.className="structure-filter-empty",x.hidden=!0,x.textContent="互換・移行用の構造は非表示です。表示するにはフィルターをOFFにしてください。",h.before(x);const C=document.createElement("p");C.className="structure-filter-empty",C.hidden=!0,C.setAttribute("role","status"),C.textContent="検索結果は0件です。",h.before(C);let v=null,M,I;const y=R=>JSON.stringify(["structure",R.conceptId,R.fromId??"",R.relationId??""]),D=R=>{R.classList.add("structure-selected"),R.setAttribute("aria-current","true")},T=()=>{if(h.querySelectorAll(".structure-selected").forEach(U=>{U.classList.remove("structure-selected"),U.removeAttribute("aria-current")}),!M)return;const R=M,$=y(R),L=Array.from(h.querySelectorAll("[data-structure-selection]")),O=I&&h.contains(I)&&I.dataset.structureSelection===$?I:L.find(U=>U.dataset.structureSelection===$)??L.find(U=>U.closest("[data-concept-id]")?.dataset.conceptId===R.conceptId&&!U.closest("[hidden]"));O&&(I=O,D(O))},A=(R,$,L="select")=>{M=R,I=$,T(),n.select?.({...R,hideLegacy:f.checked},L)},q=(R,$,L,O)=>{const U=o.nodes.get(R),Q=document.createElement("li");Q.className="structure-item",Q.dataset.conceptId=R;const pe=L?i.relation(L.relation.id,R):i.concept(R);pe&&(Q.dataset.compatibility=pe.kind);const ce=Object.hasOwn(o.conceptNames,R)?o.conceptNames[R]:void 0,se=ce&&typeof ce=="object"&&!Array.isArray(ce)?ce:{},re=typeof se.typeName=="string"&&!!se.typeName.trim(),j=re?se.typeName:U.name,z=re&&typeof se.logicalName=="string"&&se.logicalName.trim()?se.logicalName:"",B=Ee=>U.information.filter(De=>Ee||i.field(De.id,R)?.kind!=="legacy").flatMap(De=>[De.name,o.mappings.get(De.id)?.physicalName??""]),ue=Ee=>[U.name,j,z,U.id,...B(Ee),L?.roleName??"",...L?.fieldDetails.flatMap(De=>[De.name,De.physicalName])??[],...L?.fields??[],L?.relation.condition??""].join(" ").toLocaleLowerCase();Q.dataset.searchText=ue(!0),Q.dataset.searchVisibleText=ue(!1),L&&(Q.dataset.relationId=L.relation.id,Q.dataset.relationDirection=L.direction);const he=(o.edges.get(R)??[]).some(Ee=>Ee.direction==="owner"&&!!Ee.roleName)&&L?.direction==="reference",ge=he?R+"\0reference":R,fe=$.has(R),ae=!!O?.has(ge),Se=ae||!!O?.has(he?R:R+"\0reference"),ye=document.createElement("summary");ye.className="structure-node-row",ye.append(ar(L?.direction==="reference"||L?.direction==="owner"?fc:uc,L?ro[L.direction]:"構造")),ra(ye,pe);const Me={kind:"structure",conceptId:R,...L?{fromId:L.from,relationId:L.relation.id}:{}};if(ye.dataset.structureSelection=y(Me),ye.addEventListener("click",()=>A(Me,ye)),L&&(L.direction==="unknownOut"&&ze(ye,"span",ro[L.direction],"structure-type"),ze(ye,"span",L.count,"structure-count"),ye.title=`${ro[L.direction]}：移動先 ${L.count}／反対側 ${L.reverseCount}${L.relation.condition?" — "+L.relation.condition:""}${L.fields.length>L.visibleFields.length?" — 物理項目："+L.fields.join("、"):""}`),L){const Ee=L.fieldDetails.length?L.fieldDetails:[void 0],De=Et=>{const pt=document.createElement("span");pt.className="structure-element",ye.append(pt),ze(pt,"strong",Et)};L.roleName&&Ee.length===1?De(L.roleName):(L.roleName&&De(L.roleName),Ee.forEach((Et,pt)=>{(pt||L.roleName)&&ze(ye,"span","／"),De(Et?.name?.trim()||"名前未定義")}))}else ze(ye,"strong",z||U.name);(fe||Se)&&ze(ye,"span","既出","structure-seen");const ke=(o.edges.get(R)??[]).some(Ee=>Ki.includes(Ee.direction)||Ee.direction==="owner"&&!!Ee.roleName&&!(L?.direction==="owned"&&L.relation.id===Ee.relation.id&&L.from===Ee.to)),Ue=document.createElement("details");Ue.className="structure-node"+(ke?"":" structure-leaf"),Ue.append(ye),Q.append(Ue);let ft=!1;const cn=new Set($);cn.add(R);const Fe=Ee=>{if(ft)return;ft=!0;const De=document.createElement("ul");De.className="structure-children",Ue.append(De);for(const Et of[...Ki,"owner"]){const pt=(o.edges.get(R)??[]).filter(qe=>qe.direction===Et&&(Et!=="owner"||!!qe.roleName&&!(L?.direction==="owned"&&L.relation.id===qe.relation.id&&L.from===qe.to)));if(pt.length)for(const qe of pt)De.append(q(qe.to,cn,qe,Ee))}h.contains(Ue)&&(T(),W())};return ye.addEventListener("keydown",Ee=>{if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End"].includes(Ee.key)||Ee.altKey||Ee.ctrlKey||Ee.metaKey)return;Ee.preventDefault(),Ee.stopPropagation();const De=Array.from(h.querySelectorAll("summary")).filter(pt=>{if(pt.closest("[hidden]"))return!1;for(let qe=pt.parentElement?.parentElement;qe&&qe!==h;qe=qe.parentElement)if(qe instanceof HTMLDetailsElement&&!qe.open)return!1;return!0}),Et=De.indexOf(ye);Ee.key==="ArrowDown"?De[Et+1]?.focus():Ee.key==="ArrowUp"?De[Et-1]?.focus():Ee.key==="Home"?De[0]?.focus():Ee.key==="End"?De.at(-1)?.focus():Ee.key==="ArrowRight"&&ke?Ue.open?Ue.querySelector(":scope > .structure-children > li:not([hidden]) > details > summary")?.focus():(Ue.open=!0,Fe()):Ee.key==="ArrowLeft"&&(Ue.open&&ke?Ue.open=!1:Q.parentElement?.closest(".structure-item")?.querySelector(":scope > details > summary")?.focus())}),Ue.addEventListener("toggle",()=>{Ue.open&&Fe()}),O&&!ae&&!fe&&(O.add(ge),Ue.open=!0,Fe(O)),Q},P=R=>{const $=document.createElement("ul");$.className="structure-root";const L=R?new Set:void 0;for(const O of s)$.append(q(O,new Set,void 0,L));if(h.replaceChildren($),!R){const O=$.querySelector(".structure-node");O.open=!0,O.dispatchEvent(new Event("toggle"))}T()},W=()=>{const R=p.value.trim().toLocaleLowerCase();R&&!v?(v=h.firstChild,P(!0)):!R&&v&&(h.replaceChildren(v),v=null,T());const $=Array.from(h.querySelectorAll("[data-search-text]")).reverse(),L=new Set;for(const O of $){const U=(f.checked?O.dataset.searchVisibleText??O.dataset.searchText:O.dataset.searchText)?.includes(R)??!1;if(O.hidden=f.checked&&O.dataset.compatibility==="legacy"||!!R&&!U&&!L.has(O),!O.hidden){const Q=O.parentElement?.closest("[data-search-text]");Q&&L.add(Q)}}x.hidden=!!R||!f.checked||!s.every(O=>i.concept(O)?.kind==="legacy"),C.hidden=!R||Array.from(h.querySelectorAll(".structure-root > li")).some(O=>!O.hidden)};if(f.onchange=()=>{const R=h.querySelector(".structure-selected");f.checked&&R?.closest('[data-compatibility="legacy"]')?(M=void 0,n.clearSelection?.()):M&&n.select?.({...M,hideLegacy:f.checked},"filter"),W(),T()},u.onclick=()=>{v=null,p.value="",P(!0),W()},c.onclick=()=>{v=null,p.value="",P(!1);const R=h.querySelector(".structure-node");R&&(R.open=!1),W()},p.oninput=W,P(!1),n.autoSelect){const R=Array.from(h.querySelectorAll(".structure-root > .structure-item")).find(L=>!L.hidden),$=R?.querySelector(":scope > details > summary");R?.dataset.conceptId&&$&&A({kind:"structure",conceptId:R.dataset.conceptId},$,"initial")}return{setSelection(R){M=R,T()},hidesLegacy:()=>f.checked}}const $n=["landscape","overview"],Dt="structure-explorer";function Jd(e,t){const n=e.querySelector(".workspace"),o=e.querySelector(".tab-strip"),i=o.querySelector("#tabs");n.id="business-workspace",n.setAttribute("aria-label","業務設計"),n.querySelector(".toolbar")?.classList.add("canvas-controls"),n.querySelector("#zoom")?.classList.add("canvas-zoom"),n.querySelector("#layout-lock")?.classList.add("canvas-lock");const s=document.createElement("div");s.className="shell-workbench",n.before(s);const r=document.createElement("aside");r.id="design-explorer",r.setAttribute("aria-label","設計ナビゲーション"),r.innerHTML='<div class="shell-heading"><strong>エクスプローラー</strong><button type="button" aria-label="ナビゲーションを閉じる">×</button></div><div class="explorer-mode-tabs" role="tablist" aria-label="エクスプローラーの切替"><button type="button" role="tab" id="explorer-tab-document" aria-controls="explorer-document-panel">文章</button><button type="button" role="tab" id="explorer-tab-structure" aria-controls="explorer-structure-panel">構造</button></div><div id="explorer-document-panel" class="explorer-document-panel" role="tabpanel" aria-labelledby="explorer-tab-document"><label class="explorer-search"><span>設計を検索</span><input type="search" aria-label="設計を検索" placeholder="名前で絞り込み" autocomplete="off"></label><nav class="explorer-groups" aria-label="設計の一覧"></nav></div><div id="explorer-structure-panel" class="explorer-structure-panel" role="tabpanel" aria-labelledby="explorer-tab-structure" hidden></div>',r.prepend(r.querySelector(".explorer-mode-tabs"));const l=document.createElement("div");l.className="shell-center",s.append(r,l),l.append(o,n);const u=document.createElement("div");u.className="shell-open-tabs",i.before(u),u.append(i),Fc(u);const c=document.createElement("nav");c.className="concept-tabs",c.setAttribute("aria-label","開いているサブシステムとデータ構造"),u.append(c);const a=document.createElement("nav");a.className="state-tabs",a.setAttribute("aria-label","開いている状態遷移"),u.append(a);const f=document.createElement("nav");f.className="spec-tabs",f.setAttribute("aria-label","開いているテスト仕様"),u.append(f);const d=document.createElement("section");d.id="concept-workspace",d.hidden=!0,d.setAttribute("aria-label","データ構造"),d.innerHTML='<main class="concept-main"><div class="concept-empty"><h2>データ構造</h2><p>この文書のデータ構造は未定義です。</p></div><article class="concept-review-landscape" hidden></article><iframe class="concept-frame" title="概念相関図" hidden></iframe></main><aside class="concept-related" id="concept-related-panel" aria-label="データ構造の情報" hidden><div class="shell-heading right-drawer-heading"><strong>データ構造の情報</strong><button type="button" aria-label="データ構造の情報を閉じる">×</button></div><div class="concept-drawer-body"><section class="concept-selection"><h2 hidden>選択中の概念</h2><button class="concept-selection-clear" type="button" hidden>カードの選択を解除</button><div class="concept-related-content"></div></section><section class="concept-page-details" hidden><article class="data-review-overview" aria-label="概念モデルの概要" tabindex="-1"></article><button class="concept-example-back" type="button" hidden>概要に戻る</button><article class="data-examples-panel" aria-label="場面別データ例"></article></section></div></aside>',l.append(d);const p=new Map,g=new Map,m=new Map,h=new Map,x=document.createElement("section");x.id="states-workspace",x.hidden=!0,x.setAttribute("aria-label","状態遷移"),x.innerHTML='<article class="state-detail-page" tabindex="-1"></article>',l.append(x);const C=document.createElement("section");C.id="tests-workspace",C.hidden=!0,C.setAttribute("aria-label","テスト仕様"),C.innerHTML='<main class="test-spec-page"></main>',l.append(C);const v=document.createElement("aside");v.id="test-related-panel",v.className="spec-related",v.setAttribute("aria-label","関連資料"),v.hidden=!0,v.innerHTML='<div class="shell-heading right-drawer-heading"><strong>関連資料</strong><button type="button" aria-label="関連資料を閉じる">×</button></div><div class="spec-related-content"></div>';const M=document.createElement("section");M.id="empty-workspace",M.hidden=!0,M.innerHTML="<p>左の一覧から図を開いてください。</p>",l.append(M);const I=n.querySelector("#node-list-drawer");r.append(I);const y=e.querySelector("#node-list-toggle"),D=e.querySelector("#drawer"),T=r.querySelector(".explorer-search input"),A=r.querySelector(".explorer-groups"),q=r.querySelector("#explorer-document-panel"),P=r.querySelector("#explorer-structure-panel"),W=r.querySelector("#explorer-tab-document"),R=r.querySelector("#explorer-tab-structure"),$=d.querySelector("iframe"),L=d.querySelector(".concept-related"),O=x.querySelector("article"),U="alder-explorer-v1:"+location.pathname,Q=location.protocol==="file:"||location.origin==="null"?"*":location.origin,pe=window.__alderConceptHtml;let ce,se,re,j,z={},B=[],ue=[...$n],ee=new Map,he=new Map,ge=new Map,fe=new Map,ae=new Map,Se=new Map,ye;const Me=b=>Dt+":"+b,ke=b=>ae.has(b),Ue=b=>b===Dt?ye?Me(ye):"landscape":b,ft=b=>ge.get(b)??b,cn=b=>fe.get(b)??b,Fe=b=>se?.findGroup(ee.get(b??"")),Ee=b=>re?.contentFor(ee.get(b)??""),De=(b,w)=>re?.findDataExample(ee.get(b)??"",w),Et=b=>re?.examplesFor(ee.get(b)??"")??[],pt=b=>ke(b)?"構造-"+Se.get(ae.get(b)):$n.includes(b)?"全体図":Ee(b)?.title??Fe(b)?.name??z[he.get(b)??""]?.name,qe=()=>{const b=t.business(),w=b.design?.model;return w?[...w.checks,...b.relatedChecks??[]].filter(S=>S.basedOn.documentId===w.business.id):[]},Ct=()=>Ud(ce,qe()),Ot=b=>Ct().find(w=>w.key===(b.startsWith("decision:")?b.slice(9):b)),Qn=b=>Ct().filter(w=>w.name===b.name).length>1?b.name+"（"+(t.business().activities.find(w=>w.id===b.activityId)?.name??"その他")+"）":b.name,wi=b=>qe().some(w=>w.index.some(S=>S.activityId===b)||w.sections.some(S=>S.activityId===b)),ki=b=>new Set(Ct().filter(w=>w.activityId===b).flatMap(w=>w.checkIds)),Ws=b=>{const w=new Set(Ct().filter(S=>S.activityId===b).flatMap(S=>S.decisionExampleIds));return new Set(qe().flatMap(S=>S.examples.filter(E=>w.has(E.id)).map(E=>E.guaranteeId)))},zs=b=>{const w=ki(b),S=Ws(b);return qe().some(E=>E.index.some(F=>F.activityId===b&&F.checkIds.some(X=>!w.has(X)))||E.sections.some(F=>F.activityId===b&&(F.preamble.length>0||E.guarantees.some(X=>X.sectionId===F.id&&!S.has(X.id)))))},Fa=()=>qe().some(b=>b.items.some(w=>!b.index.some(S=>S.checkIds.includes(w.id)))||b.sections.some(w=>w.activityId===null)||b.notes.length>0),Va=b=>{const w=Ot(b);return w?w.capability.testSpecification?Qn(w)+"・"+(b.startsWith("decision:")?"可否":"結果"):w.name:(b==="@unassigned"?"未割当":b.startsWith("remaining:")?t.business().activities.find(S=>S.id===b.slice(10))?.name:b.startsWith("checks:")?t.business().activities.find(S=>S.id===b.slice(7))?.name:b==="@overview"?"テスト仕様":void 0)??b},Eo=n.querySelector("#formattedMarkdownDrawer");Eo&&s.append(Eo),s.append(L,v),Li(r,s,U+":explorer-width","left"),Li(L,s,U+":drawer-width"),Li(v,s,U+":test-drawer-width");let Co=!1;const gt=t.rightDrawer??{isOpen:()=>Co,setOpen:b=>{Co=b}};let ie="business",Te=!1,ot=[],V="overview",it=[],yt="",vt=[],Pe="@overview",Tn,_t=innerWidth>800,Oo=!1,jo=!0,wt=!1,eo,st="document",to=Dt;const kt=new Map,jt=new Map([["overview",$]]),mt=new Map,In=new Map,Sn=new Map,Ve=new Map,dn=new Map,Nt=new Set,Ze=new Set,xn=new Set,Be=new Map;let xe;try{if(xe=JSON.parse(sessionStorage.getItem(U)||"null"),xe){if(wt=xe.overviewClosed===!0,eo=typeof xe.documentKey=="string"?xe.documentKey:void 0,_t=typeof xe.left=="boolean"?xe.left:_t,st=xe.explorerMode==="structure"?"structure":"document",Array.isArray(xe.expanded)){Ze.clear();for(const b of xe.expanded)typeof b=="string"&&Ze.add(b)}it=Array.isArray(xe.states)?xe.states.filter(b=>typeof b=="string"):[],t.rightDrawer||(typeof xe.rightOpen=="boolean"?Co=xe.rightOpen:typeof xe.right?.["concept:"+xe.active]=="boolean"&&(Co=xe.right["concept:"+xe.active]))}}catch{}function Ba(){if(!xe||eo!==t.business().key||!Te)return;for(const S of Array.isArray(xe.overviewModes)?xe.overviewModes:[])Fe(S)&&Nt.add(S);for(const[S,E]of Object.entries(xe.lastExamples??xe.examples??{}))typeof E=="string"&&De(S,E)&&dn.set(S,E);for(const[S,E]of Object.entries(xe.examples??{}))typeof E=="string"&&De(S,E)&&Ve.set(S,E);for(const[S,E]of Object.entries(xe.selected??{}))typeof E=="string"&&B.includes(E)&&mt.set(S,E);const b=Array.isArray(xe.concepts)?xe.concepts:[];ot=[...new Set(b.filter(S=>typeof S=="string").map(Ue).filter(S=>ue.includes(S)))];const w=Ue(xe.active);V=ot.includes(w)?w:"landscape",b.includes(Dt)&&ye&&g.set(Me(ye),Dt);for(const[S,E]of Object.entries(xe.structureSources??{}))ke(S)&&typeof E=="string"&&(E===Dt||ke(E))&&g.set(S,E)}let An;const Ge=()=>{try{sessionStorage.setItem(U,JSON.stringify({documentKey:Tn,overviewClosed:wt,selected:Object.fromEntries(mt),examples:Object.fromEntries(Ve),lastExamples:Object.fromEntries(dn),overviewModes:[...Nt],left:_t,explorerMode:st,expandedVersion:4,expanded:[...Ze],concepts:ot,structureSources:Object.fromEntries(g),active:V,states:it,specs:vt,activeSpec:Pe,specExamples:Object.fromEntries(kt),...t.rightDrawer?{}:{rightOpen:gt.isOpen()}}))}catch{}},ln=()=>{ie==="concept"&&ke(V)?Be.set("structure:"+V,m.get(V)?.scrollTop??0):ie==="concept"&&Be.set("drawer:"+V,L.querySelector(".concept-drawer-body").scrollTop),ie==="concept"&&gt.isOpen()&&Nt.has(V)&&Be.set("review-overview:"+V,L.querySelector(".data-review-overview").scrollTop),ie==="concept"&&Ve.has(V)&&Be.set("example:"+V+":"+Ve.get(V),L.querySelector(".data-examples-panel").scrollTop),ie==="states"&&yt&&Be.set("state:"+yt,O.scrollTop),ie==="tests"&&Be.set("tests:"+Pe,C.querySelector(".test-spec-page").scrollTop),ie==="concept"&&V==="landscape"&&Be.set("concept:landscape",d.querySelector(".concept-review-landscape").scrollTop)};function Ye(b=!0){if(Oo)return;const w=new URL(location.href);if(w.searchParams.set("view",ie),w.searchParams.delete("concept"),w.searchParams.delete("dataExample"),w.searchParams.delete("dataView"),ie==="concept"&&gt.isOpen()&&Nt.has(V)?w.searchParams.set("dataView","overview"):ie==="concept"&&Fe(V)&&!Ve.has(V)&&w.searchParams.set("dataView","structure"),ie==="concept"&&gt.isOpen()&&Ve.has(V)&&w.searchParams.set("dataExample",Ve.get(V)),ie==="tests"&&kt.has(Pe)&&w.searchParams.set("dataExample",kt.get(Pe)),w.searchParams.delete("state"),w.searchParams.delete("activity"),w.searchParams.delete("object"),w.searchParams.delete("spec"),ie==="concept"&&w.searchParams.set("concept",V),ie==="states"&&yt&&w.searchParams.set("state",yt),ie==="tests"&&w.searchParams.set("spec",Pe),ie==="business"){const S=t.business(),E=S.views?.find(F=>F.key===S.viewKey);E?.activity?w.searchParams.set("activity",E.activity):E?.object&&w.searchParams.set("object",E.object)}w.href!==location.href&&history[b?"pushState":"replaceState"]({alderShell:!0},"",w)}function Ne(b,w,S){const E=document.createElement(w);return E.textContent=S,b.append(E),E}function It(b){b!==ie&&(ie==="business"?t.capture():ln(),ie=b),n.hidden=ie!=="business",d.hidden=ie!=="concept",x.hidden=ie!=="states",C.hidden=ie!=="tests",M.hidden=ie!=="empty",e.dataset.workspaceArea=ie,ie==="business"&&t.refresh(),Rt(),St()}function Mt(b,w=!0){if(!Te)return;const S=b===Dt;if(b=Ue(b==="subsystems"?"landscape":b),!!ue.includes(b)){if(ln(),ot.includes(b)||ot.push(b),V=b,ke(b)){S&&g.set(b,Dt),st="structure",to=g.get(b)??b;const E=Gs(to),F=h.has(b)?h.get(b):{kind:"structure",conceptId:ae.get(b)};F&&h.set(b,{...F,hideLegacy:E?.hidesLegacy()})}It("concept"),Oi(),Lt(),Ge(),w&&Ye()}}function Ha(){ln(),Ve.delete(V),Nt.add(V),Oi(),L.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer-overview:"+V)??0,Ge(),Ye()}function Ga(b,w=!0){if(b&&!De(V,b))return;const S=!Ve.has(V),E=L.querySelector(".concept-drawer-body");S&&Be.set("drawer-overview:"+V,E.scrollTop),ln(),Nt.delete(V),b?(Ve.set(V,b),dn.set(V,b)):Ve.delete(V),gt.setOpen(!0),Oi(),S&&(E.scrollTop=0),Ge(),Ye(),w&&L.querySelector(".data-example-picker select")?.focus({preventScroll:!0})}L.querySelector(".concept-example-back").onclick=()=>{Ha(),L.querySelector(".data-review-overview").focus({preventScroll:!0})};function Pn(b,w=!0){t.business().states?.some(S=>S.id===b)&&(ln(),it.includes(b)||it.push(b),yt=b,It("states"),oc(),Lt(),Ge(),w&&Ye())}function Ii(b){return b.startsWith("decision:")&&Ot(b)&&!Ot(b)?.capability.testSpecification?Ot(b).key:Ot(b)||b==="@overview"||b==="@unassigned"||b.startsWith("checks:")&&wi(b.slice(7))||b.startsWith("remaining:")&&zs(b.slice(10))?b:t.business().activities.some(w=>w.id===b)?Ct().find(w=>w.activityId===b)?.key??(wi(b)?"checks:"+b:"@overview"):"@overview"}function Wt(b,w=!0){const S=t.business();if(!S.design?.model||!S.key)return;b=Ii(b),ie==="tests"&&b!==Pe&&ln(),vt.includes(b)||vt.push(b),Pe=b;const E=Ot(b);Oo||(E?.capability.testSpecification?Ze.add("tests-function-"+E.key):E?.activityId?Ze.add("tests-activity-"+E.activityId):b.startsWith("checks:")?Ze.add("tests-activity-"+b.slice(7)):b.startsWith("remaining:")?Ze.add("tests-activity-"+b.slice(10)):E&&Ze.add("tests-other")),It("tests"),Si(),Lt(),St(),Ge(),w&&Ye()}function Si(){const b=t.business().design;if(!b?.model)return;const w=C.querySelector(".test-spec-page"),S=Ot(Pe);if(S){const E=document.createElement("section");E.className="test-spec-sample";const F=se?.findGroup(S.groupId),X=S.samples.find(me=>me.id===kt.get(Pe))??S.samples[0],G=!!S.capability.testSpecification,J=Pe.startsWith("decision:");if(G)if(Ne(E,"h2",S.name),Ne(E,"h3",J?"可否判定":"処理結果"),J)S.decisionExampleIds.length?E.append(Wd(b,S.decisionExampleIds,qe())):S.decisionCheckIds.length?E.append(zd(b,S.decisionCheckIds,qe())):Ne(E,"p","可否条件の記載はありません。");else{const me=F&&X&&re?new Set(S.samples.flatMap(Le=>Le.checkIds??[])):new Set;if(E.append($d(b,S.resultCheckIds,qe(),me)),F&&X&&re){Ne(E,"h3","データ例");const Le=document.createElement("div");Le.className="data-examples-panel test-spec-examples",E.append(Le),re.renderDataExample(Le,F,X.id,Ke=>{Be.set("tests:"+Pe,w.scrollTop),kt.set(Pe,Ke),Si(),Ge(),Ye(),C.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:S.capability.id,sampleIds:S.samples.map(Ke=>Ke.id),hideCapability:!0,hideSinglePicker:!0})}}else if(F&&X&&re){const me=document.createElement("div");me.className="data-examples-panel test-spec-examples",E.append(me),re.renderDataExample(me,F,X.id,Le=>{Be.set("tests:"+Pe,w.scrollTop),kt.set(Pe,Le),Si(),Ge(),Ye(),C.querySelector(".data-example-picker select")?.focus({preventScroll:!0})},{capabilityId:S.capability.id,heading:S.name,sampleIds:S.samples.map(Le=>Le.id),renderSpecification:Le=>Le.append(Td(b,X.checkIds??[],qe()))})}w.replaceChildren(E)}else if(Pe==="@overview")w.replaceChildren(),Ne(w,"p","左のメニューからテスト仕様を選択してください。");else if(Pe.startsWith("remaining:")){const E=Pe.slice(10);w.replaceChildren(sr(b,E,qe(),ki(E),Ws(E)))}else w.replaceChildren(sr(b,Pe.startsWith("checks:")?Pe.slice(7):void 0,qe()));_a(S),w.scrollTop=Be.get("tests:"+Pe)??0}function no(b){b||(wt=!1),It("business"),b?t.openActivity(b):(wt=!1,t.openOverview()),St(),Lt(),Ye()}function Ka(b){It("business"),t.openObject(b),St(),Lt(),Ye()}function $s(b){const w=t.business(),S=w.design?.model;return S?[...new Set(S.states.filter(E=>E.objectId===b&&E.basedOn.documentId===S.business.id&&E.basedOn.revision===S.business.revision).flatMap(E=>E.transitions.map(F=>F.activityId)))]:[...new Set((w.design?.objectStateTransitions?.[b]?.model?.transitions??[]).flatMap(E=>E.activityId?[E.activityId]:[]))]}function Us(b){return(t.business().states??[]).filter(w=>$s(w.id).includes(b))}function Fs(b){const w=t.business(),S=w.design?.model,E=ce?.model.concepts.find(F=>F.id===b);return!S||!ce||!E?[]:(w.states??[]).filter(F=>E.businessObjectIds.includes(F.id)&&S.states.some(X=>X.objectId===F.id&&X.basedOn.documentId===S.business.id&&X.basedOn.revision===S.business.revision&&ce.model.relatedStates.some(G=>G.documentId===X.id&&G.revision===X.revision)))}function xi(b,w,S="状態遷移"){if(!w.length)return;const E=document.createElement("section");E.className="shell-related-links",Ne(E,"h3",S);for(const F of w){const X=Xt(E,F.name,()=>Pn(F.id));X.dataset.relatedState=F.id}b.append(E)}function Vs(b){const w=ce?.model.reviewGroups.find(E=>E.id===b.groupId);if(!w)return[];const S=new Set(w.graph.nodes.map(E=>E.conceptId));return[...new Set(b.samples.flatMap(E=>E.blocks.map(F=>F.card)))].filter(E=>S.has(E)&&ce?.model.concepts.some(F=>F.id===E))}function Xt(b,w,S){const E=document.createElement("button");return E.type="button",E.className="shell-evidence",Ne(E,"span",w),E.onclick=S,b.append(E),E}function Ai(b,w){const S=w.filter(F=>F.capability.testSpecification);if(!S.length)return;const E=document.createElement("section");E.className="shell-test-links",Ne(E,"h3","テスト仕様書");for(const F of S)for(const[X,G]of[["decision:","可否判定"],["","処理結果"]]){const J=X+F.key,me=Xt(E,Qn(F)+"・"+G,()=>Wt(J));me.dataset.relatedSpec=J}b.append(E)}function Ja(b,w){const S=Ct().filter(J=>J.activityId===w&&J.capability.testSpecification),E=ce?.model.presentation.activityViews,F=Array.isArray(E)?E.find(J=>J&&typeof J=="object"&&J.activityId===w):void 0,X=Array.isArray(F?.uncreatedTestSections)?F.uncreatedTestSections:[],G=b.querySelectorAll("[data-business-result],[data-business-exception]");for(const J of Array.from(G)){const me=J.dataset.businessException,Le=me?"exception":"result",Ke=me??"result",Je=S.flatMap(rt=>rt.businessSections.filter($t=>$t.kind===Le&&(Le==="result"||$t.exceptionId===me)).flatMap($t=>$t.pages.filter(K=>K==="decision"?rt.decisionCheckIds.length||rt.decisionExampleIds.length:rt.resultCheckIds.length||rt.samples.length).map(K=>({target:rt,page:K})))),zt=document.createElement("section");zt.className="shell-section-links",zt.setAttribute("aria-label","テスト仕様書");const ht=new Set;for(const{target:rt,page:$t}of Je){const K=($t==="decision"?"decision:":"")+rt.key;if(ht.has(K))continue;ht.add(K);const Ce=Xt(zt,Qn(rt)+"・"+($t==="decision"?"可否判定":"処理結果"),()=>Wt(K));Ce.dataset.relatedSpec=K}if(!ht.size){const rt=Ne(zt,"p",X.includes(Ke)?"テスト仕様書未作成":"テスト仕様書との対応未確認");rt.className="shell-spec-warning"}J.after(zt)}Ai(b,S.filter(J=>!J.businessSections.length))}function _a(b){const w=v.querySelector(".spec-related-content");if(w.replaceChildren(),!b?.capability.testSpecification)return;const S=t.business().activities.find(X=>X.id===b.activityId),E=se?.findGroup(b.groupId);if(S){Ne(w,"h3","Activity");const X=Xt(w,S.name,()=>no(S.id));X.dataset.relatedActivity=S.id}if(E){Ne(w,"h3","概念モデル");const X=Xt(w,E.name,()=>Mt(ft(E.id)));X.dataset.relatedGroup=E.id}const F=Vs(b);if(F.length){Ne(w,"h3","概念");for(const X of F){const G=ce.model.concepts.find(me=>me.id===X),J=Xt(w,G.name,()=>Mt(cn(X)));J.dataset.relatedConcept=X}}b.activityId&&xi(w,Us(b.activityId),"状態遷移（同じ Activity）")}function Xa(b,w){Ne(b,"h3","Activity");const S=t.business(),E=Fe(V),F=ce?.model.concepts.find(G=>G.id===w),X=E?.concepts[w]?.sourceActivities??E?.activities??F?.activityLinks.filter(G=>G.uses.includes("生成")).map(G=>G.activityId)??[];for(const G of X){const J=S.activities.find(Le=>Le.id===G);if(!J)continue;const me=document.createElement("button");me.className="shell-evidence",Ne(me,"span",J.name),me.title=J.name+"を業務タブで開く",me.setAttribute("aria-label",me.title),me.onclick=()=>no(J.id),b.append(me)}}function Ei(b){const w=Fe(b);return w?se?.graph(w.id):b==="overview"?se?.overviewGraph():void 0}function Bs(b){const w=In.get(V),S=w?Ei(V)?.tables[w]:void 0;return S?.conceptId===b?S:void 0}function Za(b,w){const S=Bs(w)??Fe(V)?.concepts[w]??{...z[w],sources:void 0};b.replaceChildren(),Ne(b,"p",S.note),Ne(b,"h3","持つ情報");const E=document.createElement("ul");for(const[,F]of S.fields)Ne(E,"li",F);if(b.append(E),S.sources?.length){Ne(b,"h3","情報の出所・対象時点");const F=document.createElement("ul");for(const X of S.sources)Ne(F,"li",X);b.append(F)}Xa(b,w),Ai(b,Ct().filter(F=>Vs(F).includes(w))),xi(b,Fs(w))}function Ci(b){const w=L.querySelector(".shell-heading strong");w.textContent=b,L.setAttribute("aria-label",b)}function Hs(b=!1){Fe(V)&&(mt.delete(V),In.delete(V),Sn.delete(V),b||jt.get(V)?.contentWindow?.postMessage({type:"alder-concept-clear-highlight"},Q),No(),Rt(),L.querySelector(".concept-drawer-body").scrollTop=0,Ge())}L.querySelector(".concept-selection-clear").onclick=()=>{Hs(),Ve.has(V)?L.querySelector(".concept-example-back").focus({preventScroll:!0}):L.querySelector(".data-review-overview").focus({preventScroll:!0})};function No(){const b=L.querySelector(".concept-related-content");if(ke(V))return;L.querySelector(".concept-selection").hidden=!!Fe(V)&&!mt.has(V)&&!Sn.has(V),L.querySelector(".concept-selection>h2").hidden=!Fe(V),L.querySelector(".concept-selection-clear").hidden=!Fe(V);const w=Sn.get(V);if(w&&j){const X=j.describe(b,{kind:"group",id:w});Ci(X);return}if(V==="landscape"&&An){b.replaceChildren();for(const[X,G]of j.sections){Ne(b,"h3",X);const J=document.createElement("ul");for(const me of G)Ne(J,"li",me);b.append(J)}Ci("サブシステムの情報");return}const S=mt.get(V),E=Fe(V),F=Te&&S?Bs(S)?.name??E?.concepts[S]?.name??z[S].name:E?.name??"データ構造の情報";Ci(F),Te&&S?Za(b,S):(b.replaceChildren(),E||Ne(b,"p","シェイプを選ぶとデータ構造の情報を確認できます。"))}function oo(b,w=!1){const S=m.get(b);if(!S||!ce)return;const E=S.querySelector(".structure-detail-content");aa(E,ce.model,h.get(b),F=>{h.set(b,F),Be.set("structure:"+b,0),oo(b,!0)}),w&&(S.scrollTop=0)}function Ya(b){if(!(!ce||!Te||!ke(b))&&!m.has(b)){const w=document.createElement("article");w.className="structure-detail-page",w.hidden=ie!=="concept"||V!==b,w.setAttribute("aria-label","構造の詳細"),Ne(w,"h1","構造の詳細");const S=document.createElement("div");S.className="structure-detail-content",w.append(S),d.querySelector(".concept-main").append(w),m.set(b,w)}}function Gs(b){if(!ce)return;const w=p.get(b);if(w)return w.tree;const S=document.createElement("article");S.setAttribute("aria-label","構造エクスプローラー"),P.append(S);const E=Kd(S,ce.model,{rootId:ae.get(b),select:(F,X)=>{if(X==="select"){const G=Me(F.conceptId);h.set(G,F),g.set(G,b),ie==="concept"&&V===G?oo(G,!0):(Be.set("structure:"+G,0),Mt(G))}else if(X==="filter"&&ie==="concept"&&ke(V)){const G=h.get(V);G&&(h.set(V,{...G,hideLegacy:F.hideLegacy}),oo(V))}},clearSelection:()=>{ie==="concept"&&ke(V)&&(h.set(V,void 0),oo(V))}});return p.set(b,{page:S,tree:E}),E}function Qa(){const b=st==="structure"?Gs(to):void 0;for(const[S,{page:E}]of p)E.hidden=S!==to;const w=ie==="concept"&&ke(V)?h.get(V):void 0;b?.setSelection(w?.kind==="attribute"?w.returnTo:w)}function ec(b){m.get(b)?.remove(),m.delete(b),h.delete(b),g.delete(b),Be.delete("structure:"+b)}function Ks(b){b.onload=()=>{Xs(),b.contentDocument&&(er(b.contentDocument),tr(b.contentDocument));const w=b.dataset.conceptView??"overview";if(!se||!ce)return;const S=Fe(w),E=S?se.graph(S.id):w==="overview"?se.overviewGraph():{ids:B,edges:se.edges,tables:z};b.contentWindow?.postMessage({type:"alder-concept-data",graph:E,focus:he.get(w),viewKey:w,documentKey:Tn??ce.model.id,clearSelectionOnBackground:!!S},Q);const F=mt.get(w);F&&b.contentWindow?.postMessage({type:"alder-concept-highlight",id:F},Q)}}Ks($),$.dataset.conceptView="overview";function tc(){L.querySelector(".concept-page-details").hidden=!0,L.querySelector(".concept-example-back").hidden=!0;const b=L.querySelector(".data-review-overview");b.hidden=!0,b.replaceChildren();const w=L.querySelector(".data-examples-panel");w.hidden=!0,w.replaceChildren(),delete w.dataset.dataExample,An?.root.remove(),An=void 0;for(const[S,E]of jt)S!=="overview"&&(E.remove(),jt.delete(S));for(const{page:S}of p.values())S.remove();for(const S of m.values())S.remove();p.clear(),m.clear(),h.clear(),g.clear(),to=Dt,$.removeAttribute("src"),$.removeAttribute("srcdoc"),mt.clear(),In.clear(),Sn.clear()}function Oi(){d.setAttribute("aria-label",V==="landscape"||Fe(V)?"サブシステム":"データ構造"),d.querySelector(".concept-empty").hidden=Te;const b=d.querySelector(".concept-review-landscape"),w=Fe(V),S=L.querySelector(".concept-page-details"),E=L.querySelector(".data-review-overview"),F=L.querySelector(".data-examples-panel");if(S.hidden=!Te||!w,E.hidden=!Te||!w||Ve.has(V),F.hidden=!Te||!w||!Ve.has(V),L.querySelector(".concept-example-back").hidden=F.hidden,Te&&w){const G=Ct();Jc(E,w,re,(me,Le)=>{const Ke=rr(G,w.id,me,Le);if(Ke)return{kind:Ke.kind,open:()=>{const Je=rr(Ct(),w.id,me,Le);Je&&(Je.sampleId?kt.set(Je.key,Je.sampleId):kt.delete(Je.key),Wt(Je.key))}}},me=>no(me),t.business().activities),Ai(E,G.filter(me=>me.groupId===w.id));const J=Ve.get(V)??dn.get(V)??Et(V)[0]?.id;J&&re.renderDataExample(F,w,J,me=>Ga(me)),E.scrollTop=Be.get("review-overview:"+V)??0,F.scrollTop=Be.get("example:"+V+":"+J)??0}b.hidden=!Te||!$n.includes(V),Te&&ke(V)&&(Ya(V),oo(V));for(const[G,J]of m)J.hidden=!Te||G!==V;if(Te&&$n.includes(V)&&(V==="landscape"&&!An&&(An=ed(document,ce,Tn??ce.model.id,G=>Mt(ft(G)))),Kc(b,An?.root,V==="overview"?"graph":"overview"),V==="landscape"&&An?.restore()),Te&&V!=="landscape"&&!ke(V)&&!jt.has(V)){const G=document.createElement("iframe");G.className="concept-frame",G.dataset.conceptView=V,G.title=w?w.name+"のデータ構造":z[he.get(V)].name+"と隣接する概念",G.hidden=!0,jt.set(V,G);const J=he.get(V);J&&mt.set(V,mt.get(V)??J),Ks(G),d.querySelector(".concept-main").append(G)}for(const[G,J]of jt)J.hidden=!Te||G!==V,Te&&G===V&&!J.hasAttribute("src")&&!J.hasAttribute("srcdoc")&&(pe?J.srcdoc=pe:J.src=new URL("concept.html?view=overview"+(Fe(G)?"&group="+encodeURIComponent(Fe(G).id):G==="overview"?"":"&focus="+encodeURIComponent(he.get(G))),document.baseURI).href);const X=mt.get(V);if(X&&jt.get(V)?.contentWindow?.postMessage({type:"alder-concept-highlight",id:X},Q),No(),Rt(),ke(V)){const G=m.get(V);G&&(G.scrollTop=Be.get("structure:"+V)??0)}else L.querySelector(".concept-drawer-body").scrollTop=Be.get("drawer:"+V)??0}function qn(){const b=t.business(),w=b.views?.find(S=>S.activity!==void 0||S.object!==void 0||!wt);w?(It("business"),t.activateView(w.key)):ot.length?Mt(ot.at(-1),!1):it.length?Pn(it.at(-1),!1):vt.length?Wt(vt.at(-1),!1):It("empty")}function nc(){if(wt=!0,ie==="business"){const b=t.business().views?.find(w=>w.key===t.business().viewKey);!b?.activity&&!b?.object&&qn()}Lt(),St(),Ge(),Ye(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})}function oc(){O.replaceChildren();const b=t.business().states?.find(J=>J.id===yt);if(!b)return;const w=t.statePanel(b.id);w?O.append(w):Ne(O,"p","この対象の状態遷移は未定義です。");const S=v.querySelector(".spec-related-content");S.replaceChildren();const E=$s(b.id),F=t.business().activities.filter(J=>E.includes(J.id));if(F.length){Ne(S,"h3","Activity");for(const J of F){const me=Xt(S,J.name,()=>no(J.id));me.dataset.relatedActivity=J.id}}const X=ce?.model.concepts.filter(J=>Fs(J.id).some(me=>me.id===b.id))??[];if(X.length){Ne(S,"h3","概念");for(const J of X){const me=Xt(S,J.name,()=>Mt(cn(J.id)));me.dataset.relatedConcept=J.id}}const G=Ct().filter(J=>J.activityId&&E.includes(J.activityId)&&J.capability.testSpecification);if(G.length){Ne(S,"h3","Activity に関連するテスト仕様書");for(const J of G)for(const[me,Le]of[["decision:","可否判定"],["","処理結果"]]){const Ke=me+J.key,Je=Xt(S,Qn(J)+"・"+Le,()=>Wt(Ke));Je.dataset.relatedSpec=Ke}}O.scrollTop=Be.get("state:"+yt)??0}let ji="";function Lt(){for(const E of Array.from(i.querySelectorAll(".tab"))){const F=t.business().views?.find(G=>G.key===E.dataset.key);E.hidden=wt&&F?.activity===void 0&&F?.object===void 0;const X=!E.hidden&&ie==="business"&&E.dataset.key===t.business().viewKey;E.classList.toggle("active",X),E.querySelector("button")?.setAttribute("aria-current",String(X))}const b=(E,F,X)=>{E.replaceChildren();for(const G of F){const J=X==="concept"?pt(G):t.business().states?.find(ht=>ht.id===G)?.name??G,me=ie===X&&G===(X==="concept"?V:yt),Le=document.createElement("div");Le.className="tab"+(me?" active":"");const Ke=X==="concept"&&(G==="landscape"||Fe(G))?"subsystems":X;Le.dataset.viewKind=Ke;const Je=document.createElement("button");Je.id=(X==="concept"?"concept-tab-":"state-tab-")+G,Fi(Je,Ke,J),Je.setAttribute("aria-current",String(me)),Je.onclick=()=>X==="concept"?Mt(G):Pn(G),Le.append(Je);const zt=Vi((Ke==="subsystems"?"サブシステム：":X==="concept"?"データ構造：":"状態遷移：")+J+"のタブを閉じる");zt.onclick=()=>{ln(),X==="concept"?(ot=ot.filter(ht=>ht!==G),ke(G)&&ec(G),G!=="overview"&&(jt.get(G)?.remove(),jt.delete(G)),mt.delete(G),In.delete(G),Sn.delete(G),Ve.delete(G),dn.delete(G),Nt.delete(G),ie===X&&V===G&&(ot.length?Mt(ot.at(-1),!1):qn())):(it=it.filter(ht=>ht!==G),ie===X&&yt===G&&(it.length?Pn(it.at(-1),!1):qn())),Lt(),St(),Ge(),Ye(),o.querySelector("[aria-current=true]")?.focus({preventScroll:!0})},Le.append(zt),E.append(Le)}};b(c,ot,"concept"),b(a,it,"states"),f.replaceChildren();for(const E of vt){const F=Va(E),X=document.createElement("div");X.className="tab"+(ie==="tests"&&E===Pe?" active":""),X.dataset.viewKind="tests";const G=document.createElement("button");G.id="spec-tab-"+E,Fi(G,"tests",F),G.setAttribute("aria-current",String(ie==="tests"&&E===Pe)),G.onclick=()=>Wt(E);const J=Vi("テスト仕様："+F+"のタブを閉じる");J.onclick=()=>{vt=vt.filter(me=>me!==E),ie==="tests"&&Pe===E&&(vt.length?Wt(vt.at(-1),!1):qn()),Lt(),St(),Ge(),Ye()},X.append(G,J),f.append(X)}const w=u.querySelector(".tab.active:not([hidden])"),S=ie==="business"?"business:"+t.business().viewKey:ie==="concept"?"concept:"+V:ie==="states"?"states:"+yt:ie==="tests"?"tests:"+Pe:"";w?(S!==ji&&Vc(u,w),ji=S):ji=""}function ic(){innerWidth<=800&&Mo(!1)}function St(){const b=A.contains(document.activeElement)?document.activeElement.dataset.explorerKey:void 0,w=A.scrollTop,S=t.business(),E=T.value.trim().toLocaleLowerCase();A.replaceChildren();const F=(K,Ce,at)=>({kind:"item",id:K,name:Ce,key:at}),X=(K,Ce,at)=>({kind:"group",id:K,name:Ce,children:at}),G=Ct(),J=K=>F(K.key,K.name,"tests:"+K.key),me=G.filter(K=>K.capability.testSpecification),Le=G.filter(K=>!K.capability.testSpecification),Ke=me.map(K=>X("tests-function-"+K.key,Qn(K),[F("decision:"+K.key,"可否判定","tests:decision:"+K.key),F(K.key,"処理結果","tests:"+K.key)]));for(const K of S.activities){const Ce=Le.filter(nt=>nt.activityId===K.id).map(J),at=(ki(K.id).size?"remaining:":"checks:")+K.id;zs(K.id)&&Ce.push(F(at,"その他","tests:"+at)),Ce.length&&Ke.push(X("tests-activity-"+K.id,K.name,Ce))}const Je=Le.filter(K=>!K.activityId);Je.length&&Ke.push(X("tests-other","その他",Je.map(J))),Fa()&&Ke.push(F("@unassigned","未割当","tests:@unassigned"));const zt=[{id:"business",label:"業務設計",items:[F("overview","全体図","business:overview"),X("business-activity","Activity",S.activities.map(K=>F(K.id,K.name,"business:"+K.id))),X("business-object","Object",(S.objects??[]).map(K=>F(K.id,K.name,"object:"+K.id)))]},{id:"states",label:"状態遷移",items:(S.states??[]).map(K=>F(K.id,K.name,"states:"+K.id))},{id:"subsystems",label:"サブシステム",items:ce?.model.subsystems.length?[F("landscape","全体図","concept:landscape"),...ce.model.subsystems.map(K=>X("subsystem-"+K.id,K.name.replace(/サブシステム$/,""),ce.model.reviewGroups.filter(Ce=>Ce.subsystemId===K.id).map(Ce=>F(ft(Ce.id),Ce.title,"concept:"+ft(Ce.id)))))]:[]},{id:"concept",label:"データ構造",items:Te&&B.length?[F("overview","全体図","concept:overview"),X("concept-relations","概念",B.map(K=>F(cn(K),z[K].name,"concept:"+cn(K))))]:[]},{id:"tests",label:"テスト仕様",items:S.design?.model&&(G.length||qe().length)?Ke:[]}];let ht=0;const rt=(K,Ce,at)=>{const nt=document.createElement("button");nt.className="explorer-item"+(at?" explorer-item-nested":""),nt.dataset.explorerKey=K.key,nt.textContent=K.name;const Qe=S.views?.find(_e=>_e.key===S.viewKey);return ie===(Ce.id==="subsystems"?"concept":Ce.id)&&(["concept","subsystems"].includes(Ce.id)?K.id===V:Ce.id==="states"?K.id===yt:Ce.id==="tests"?K.id===Pe:K.key.startsWith("object:")?Qe?.object===K.id:K.id==="overview"?!wt&&Qe?.activity===void 0&&Qe?.object===void 0:Qe?.activity===K.id)&&nt.setAttribute("aria-current","page"),nt.disabled=Ce.id==="business"&&!S.key,nt.onclick=()=>{I.hidden||t.closeLegacyList(),Ce.id==="business"?K.key.startsWith("object:")?Ka(K.id):no(K.id==="overview"?void 0:K.id):Ce.id==="concept"||Ce.id==="subsystems"?Mt(K.id):Ce.id==="tests"?Wt(K.id):Pn(K.id),ic()},nt},$t=(K,Ce,at,nt=!1)=>{const Qe=document.createElement("button"),Ut=E?!xn.has(K):Ze.has(K);return Qe.className=(at?"explorer-subparent":"explorer-parent")+(nt?" explorer-pending":""),Qe.dataset.explorerKey="group:"+K,Ne(Qe,"span",Ce).className="explorer-parent-label",nt?(Qe.disabled=!0,Qe):(Qe.setAttribute("aria-expanded",String(Ut)),Qe.setAttribute("aria-controls","explorer-"+K),Qe.append(Uc(Ut)),Qe.onclick=()=>{E?xn.has(K)?xn.delete(K):xn.add(K):(Ze.has(K)?Ze.delete(K):Ze.add(K),Ge()),St()},Qe)};for(const K of zt){const Ce=K.items.flatMap(_e=>{if(_e.kind==="item")return!E||(K.label+" "+_e.name).toLocaleLowerCase().includes(E)?[_e]:[];const un=E?_e.children.filter(Mi=>(K.label+" "+_e.name+" "+Mi.name).toLocaleLowerCase().includes(E)):_e.children;return!E||un.length?[{..._e,children:un}]:[]});if(E&&!Ce.length)continue;const at=K.id!=="business"&&!K.items.length,nt=document.createElement("section"),Qe=$t(K.id,K.label,!1,at),Ut=document.createElement("div");Ut.id="explorer-"+K.id,Ut.hidden=at||(E?xn.has(K.id):!Ze.has(K.id));for(const _e of Ce){if(_e.kind==="item"){Ut.append(rt(_e,K,0)),ht++;continue}const un=document.createElement("div");un.id="explorer-"+_e.id,un.hidden=E?xn.has(_e.id):!Ze.has(_e.id),Ut.append($t(_e.id,_e.name,!0),un);for(const Mi of _e.children)un.append(rt(Mi,K,1)),ht++;!_e.children.length&&!E&&(Ne(un,"p","項目がありません。").className="explorer-empty explorer-empty-nested")}!Ce.length&&!at&&(Ne(Ut,"p","項目がありません。").className="explorer-empty"),nt.append(Qe,Ut),A.append(nt)}E&&!ht&&(Ne(A,"p","該当する項目はありません。").className="explorer-empty"),A.scrollTop=w,b&&Array.from(A.querySelectorAll("[data-explorer-key]")).find(K=>K.dataset.explorerKey===b)?.focus({preventScroll:!0})}function Js(){!Te&&st==="structure"&&(st="document"),R.disabled=!Te,W.setAttribute("aria-selected",String(st==="document")),R.setAttribute("aria-selected",String(st==="structure")),W.tabIndex=st==="document"?0:-1,R.tabIndex=st==="structure"?0:-1,q.hidden=st!=="document",P.hidden=st!=="structure",Qa()}function _s(b){b==="structure"&&!Te||(st=b,Js(),Ge())}W.onclick=()=>_s("document"),R.onclick=()=>_s("structure"),r.querySelector(".explorer-mode-tabs").addEventListener("keydown",b=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(b.key))return;const w=b.key==="Home"||b.key==="ArrowLeft"?W:R;w.disabled||(b.preventDefault(),w.click(),w.focus({preventScroll:!0}))});function Mo(b){_t=b,Rt(),Ge(),(b?r.querySelector(".shell-heading button"):y).focus({preventScroll:!0})}y.addEventListener("click",b=>{b.preventDefault(),b.stopImmediatePropagation(),Mo(!_t)},!0),r.querySelector(".shell-heading button").onclick=()=>Mo(!1),T.oninput=()=>{xn.clear(),St()},r.addEventListener("keydown",b=>{if(b.key==="Escape"&&!b.defaultPrevented&&I.hidden&&(b.preventDefault(),b.stopPropagation(),Mo(!1)),(b.key==="ArrowDown"||b.key==="ArrowUp")&&A.contains(document.activeElement)){const w=Array.from(A.querySelectorAll("button")).filter(F=>!F.disabled&&!F.closest("[hidden]")),S=w.indexOf(document.activeElement),E=w[S+(b.key==="ArrowDown"?1:-1)];E&&(b.preventDefault(),E.focus())}}),D.addEventListener("click",b=>{ie!=="business"&&(b.preventDefault(),b.stopImmediatePropagation(),!(ie==="concept"&&ke(V))&&(ie==="concept"||ie==="states"||ie==="tests"&&Ot(Pe)?.capability.testSpecification)&&(gt.setOpen(!gt.isOpen()),Rt(),Ge(),Ye(!1)))},!0),L.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Rt(),Ge(),Ye(!1),D.focus({preventScroll:!0})},v.querySelector(".shell-heading button").onclick=()=>{gt.setOpen(!1),Rt(),Ge(),Ye(!1),D.focus({preventScroll:!0})},window.addEventListener("message",b=>{if(b.origin!==location.origin&&!(location.protocol==="file:"&&b.origin==="null"))return;const w=Array.from(jt).find(([,E])=>b.source===E.contentWindow);if(!w)return;if(b.data?.type==="alder-concept-rendered"){w[1].contentDocument&&(er(w[1].contentDocument),tr(w[1].contentDocument));return}if(ie!=="concept"||w[0]!==V)return;const S=Fe(V);if(b.data?.type==="alder-concept-clear-selection"){S&&Hs(!0);return}if(b.data?.type==="alder-concept-subsystem"){if(!Ei(V)?.regions.some(E=>E.id===b.data.id))return;mt.delete(V),In.delete(V),Sn.set(V,b.data.id),No(),Rt(),Ge();return}if(!(!B.includes(b.data?.id)||S&&!S.concepts[b.data?.id])){if(b.data.type==="alder-concept-open"){Mt(cn(b.data.id));return}b.data.type==="alder-concept-select"&&(Sn.delete(V),mt.set(V,b.data.id),(typeof b.data.viewId=="string"?Ei(V)?.tables[b.data.viewId]:void 0)?.conceptId===b.data.id?In.set(V,b.data.viewId):In.delete(V),innerWidth<=800&&(_t=!1),No(),Rt(),Ge())}});function Xs(){const b=getComputedStyle(document.documentElement);for(const w of jt.values()){const S=w.contentDocument?.documentElement;if(S){S.dataset.theme=document.documentElement.dataset.theme??"light";for(const E of["--bg","--panel","--fg","--line","--subtle","--select"])S.style.setProperty(E,b.getPropertyValue(E))}}}function Rt(){!I.hidden&&ie==="business"&&(_t=!0),r.hidden=!_t,y.disabled=!1,y.setAttribute("aria-controls","design-explorer"),y.setAttribute("aria-label","ナビゲーションを開閉"),y.setAttribute("aria-expanded",String(_t)),Js();const b=gt.isReady?.()??!0,w=ie==="concept"&&ke(V);L.hidden=ie!=="concept"||w||!Te||!b||!gt.isOpen();const S=!!Ot(Pe)?.capability.testSpecification;if(v.hidden=!(ie==="states"||ie==="tests"&&S)||!b||!gt.isOpen(),Eo&&ie!=="business"&&(Eo.hidden=!0),ie==="concept")D.disabled=w||!Te||!b,w?(D.removeAttribute("aria-controls"),D.setAttribute("aria-label","構造の詳細は中央に表示")):(D.setAttribute("aria-controls","concept-related-panel"),D.setAttribute("aria-label","データ構造の情報を開閉")),D.setAttribute("aria-expanded",String(!L.hidden));else if(ie==="business"){const X=t.business();D.disabled=!b||!X.key||!X.viewKey,D.setAttribute("aria-controls","formattedMarkdownDrawer"),D.setAttribute("aria-label","業務内容開閉")}else ie==="states"||ie==="tests"&&S?(D.disabled=!b,D.setAttribute("aria-controls","test-related-panel"),D.setAttribute("aria-label","関連資料を開閉"),D.setAttribute("aria-expanded",String(!v.hidden))):(ie==="tests"||ie==="empty")&&(D.disabled=!0,D.setAttribute("aria-expanded","false"));const E=o.querySelector("#document-actions");E&&(E.hidden=ie!=="business");const F=o.querySelector("#document-actions-toggle");F&&ie!=="business"&&(F.hidden=!0),Xs(),Ni()}function Ni(){const b=o.getBoundingClientRect().bottom;b>0&&e.style.setProperty("--shell-content-top",b+"px")}if(typeof ResizeObserver<"u"){const b=new ResizeObserver(Ni);b.observe(o),b.observe(e.querySelector("header"))}window.addEventListener("resize",Ni);function Zs(){ln(),Oo=!0;try{const b=new URL(location.href).searchParams;if(ie==="concept"&&b.get("view")==="concept"&&b.get("concept")===V&&!Ve.has(V)&&De(V,b.get("dataExample"))&&Be.set("drawer-overview:"+V,L.querySelector(".concept-drawer-body").scrollTop),Te||(Nt.clear(),Ve.clear(),dn.clear(),ot=[],V="overview",$.removeAttribute("src"),$.removeAttribute("srcdoc")),b.get("view")==="concept"){const w=Te&&ue.includes(b.get("concept")??"")?b.get("concept"):"landscape",S=b.get("dataExample");Te&&Fe(w)&&b.get("dataView")==="overview"&&!De(w,S)?(Nt.add(w),Ve.delete(w)):(Nt.delete(w),Te&&De(w,S)?(Ve.set(w,S),dn.set(w,S)):Ve.delete(w)),Mt(w,!1)}else if(b.get("view")==="states")t.business().states?.some(w=>w.id===b.get("state"))?Pn(b.get("state"),!1):qn();else if(b.get("view")==="tests"){const w=Ii(b.get("spec")??"@overview"),S=b.get("dataExample"),E=Ot(w);E&&S&&E.samples.some(F=>F.id===S)?kt.set(w,S):E&&kt.delete(w),Wt(w,!1)}else if(b.get("view")==="empty")It("empty");else if(It("business"),t.business().key){const w=b.get("activity"),S=b.get("object"),E=t.business(),F=E.views?.find(X=>X.key===E.viewKey);w&&E.activities.some(X=>X.id===w)?F?.activity!==w&&t.openActivity(w):S&&E.objects?.some(X=>X.id===S)?F?.object!==S&&t.openObject(S):(wt=!1,(!F||F.activity!==void 0||F.object!==void 0)&&t.openOverview())}Lt(),St()}finally{Oo=!1}}return window.addEventListener("popstate",Zs),{closeBusinessOverview:nc,reopenBusinessOverview(){wt=!1},activateBusiness(){It("business")},businessActivated(){It("business"),Lt(),St(),Ye()},syncChrome:Rt,appendActivityTestLinks(b,w){Ja(b,w),xi(b,Us(w))},openRelatedChecks(b){Ze.add("tests"),Wt(b&&wi(b)?"checks:"+b:"@overview")},syncDocument(){const b=t.business(),w=b.concept,S=!!(Tn&&b.key!==Tn||jo&&eo&&b.key&&b.key!==eo),E=ce?.model!==w?.model||ce?.business!==w?.business;if((S||E&&ce)&&(st="document",C.querySelector(".test-spec-page").replaceChildren(),v.querySelector(".spec-related-content").replaceChildren(),L.querySelector(".concept-related-content").replaceChildren(),wt=!1,ot=[],it=[],vt=[],V="overview",yt="",Pe="@overview",kt.clear(),Be.clear(),Nt.clear(),Ve.clear(),dn.clear(),tc(),ie!=="business"&&It("business"),S&&!jo&&Ye(!1)),E){ce=w,se=w?Hc(w):void 0,re=w?nd(w):void 0,j=w?_c(w):void 0,Te=!!w,z=se?.tables??{},B=Object.keys(z),ae=new Map((w?.model.concepts??[]).map(J=>[Me(J.id),J.id]));const F=w?ys(w.model):void 0;ye=F?.roots[0],Se=F?Gd(F):new Map;const X=se?.groups.map(J=>J.id)??[],G=new Set([...$n,"subsystems",Dt,...ae.keys()]);if(ge=new Map(X.map(J=>[J,G.has(J)||B.includes(J)?"group:"+J:J])),fe=new Map(B.map(J=>[J,G.has(J)||X.includes(J)?"concept:"+J:J])),ee=new Map([...ge].map(([J,me])=>[me,J])),he=new Map([...fe].map(([J,me])=>[me,J])),ue=[...$n,Dt,...ae.keys(),...ee.keys(),...he.keys()],Array.isArray(xe?.expanded)&&xe.expandedVersion!==4){Ze.add("subsystems"),Ze.add("concept-relations");for(const J of w?.model.subsystems??[])Ze.add("subsystem-"+J.id)}}if(Tn=b.key,it=it.filter(F=>b.states?.some(X=>X.id===F)),ie==="business"&&wt&&b.views?.find(F=>F.key===b.viewKey)?.activity===void 0&&b.views?.find(F=>F.key===b.viewKey)?.object===void 0&&qn(),jo&&b.key){if(Ba(),eo===b.key){Array.isArray(xe?.specs)&&(vt=[...new Set(xe.specs.filter(F=>typeof F=="string").map(F=>Ii(F)))]);for(const[F,X]of Object.entries(xe?.specExamples??{})){const G=Ot(F);typeof X=="string"&&G?.capability.samples.some(J=>J.id===X)&&kt.set(F,X)}}jo=!1,Zs()}St(),Lt(),Rt(),S&&Ge()}}}class _i{tabs=new WeakMap;router;constructor(t=$i){this.router=t}invalidate(t){this.tabs.delete(t)}update(t,n,o,i,s){const r=JSON.stringify([o.map(d=>[d.id,d.width,d.height]),i.map(d=>[d.kind,d.from,d.to,d.label]),s]),l=this.tabs.get(t),u=!l||l.design!==n||l.structure!==r,c=new Set(o.filter(d=>{const p=l?.nodes.get(d.id);return!p||p.x!==d.x||p.y!==d.y}).map(d=>d.id)),a=new Set(o.map(d=>d.id)),f=u?new Array(i.length):l.routes.slice();if(i.forEach((d,p)=>{!u&&!c.has(d.from)&&!c.has(d.to)||(f[p]=a.has(d.from)&&a.has(d.to)?this.router({from:d.from,to:d.to,index:p,nodes:o,kind:d.kind,matrix:s?.[p],labels:s?.[p]?[]:[...f.flatMap((g,m)=>g&&m<p?[{id:String(m),x:g.label[0]-Math.max(30,i[m].label.length*12)/2,y:g.label[1]-9,width:Math.max(30,i[m].label.length*12),height:18}]:[])],wires:s?.[p]?[]:f.flatMap((g,m)=>g&&m<p?[g.points]:[]),labelWidth:Math.max(30,d.label.length*12),labelHeight:18}):void 0)}),s){const d=[],p=new Map,g=f.map((m,h)=>h).sort((m,h)=>Number(s[m].returning)-Number(s[h].returning));for(const m of g){const h=f[m];if(!h)continue;const x=o.find(y=>y.id===i[m].from),C=Math.max(30,i[m].label.length*12),v=s[m].returning?[Math.max(...h.points.map(y=>y[0]))+8+C/2,h.points[0][1]]:[x.x+x.width*.125+8+C/2,mc(x.y+x.height,s[m].captionLane*Kr)+9],M=Jr(i[m],m,s[m]),I=p.get(M)??Ui(v,C,18,o,d);(I[0]!==h.label[0]||I[1]!==h.label[1])&&(f[m]={...h,label:I}),p.has(M)||(p.set(M,I),d.push({id:String(m),x:I[0]-C/2,y:I[1]-9,width:C,height:18}))}}return this.tabs.set(t,{design:n,structure:r,nodes:new Map(o.map(d=>[d.id,{...d}])),routes:f}),f}}function _d(e,t,n,o){const i=(f,d,p)=>(d[0]-f[0])*(p[1]-f[1])-(d[1]-f[1])*(p[0]-f[0]),s=i(e,t,n),r=i(e,t,o),l=i(n,o,e),u=i(n,o,t),c=1e-6;if(s*r<-c&&l*u<-c)return!0;if(Math.max(Math.abs(s),Math.abs(r),Math.abs(l),Math.abs(u))>c)return!1;const a=Math.abs(t[0]-e[0])>=Math.abs(t[1]-e[1])?0:1;return Math.min(Math.max(e[a],t[a]),Math.max(n[a],o[a]))-Math.max(Math.min(e[a],t[a]),Math.min(n[a],o[a]))>.1}function Xd(e,t,n,o,i=[]){const s=e.x+e.width,r=24,l=e.y+e.height,u=s-8-(2*(n.count-n.index)-1)*r,c=t.filter(C=>C.id!==e.id);let a;for(const C of[0,-24,24,-48,48,-72,72])for(const v of[0,16,32,64,128,256]){const M=[u+C,l],I=[M[0]+r,l];if(M[0]<e.x+8||I[0]>s-8)continue;const y=l+n.depth+v,D=Math.min(12,(I[0]-M[0])/2,(y-l)/2),T=[M];let A=`M${M}`;const q=$=>{A+=` L${$}`,T.push($)},P=($,L)=>{const O=T.at(-1);A+=` Q${$} ${L}`;for(let U=1;U<=4;U++){const Q=U/4,pe=1-Q;T.push([pe*pe*O[0]+2*pe*Q*$[0]+Q*Q*L[0],pe*pe*O[1]+2*pe*Q*$[1]+Q*Q*L[1]])}};q([M[0],y-D]),P([M[0],y],[M[0]+D,y]),q([I[0]-D,y]),P([I[0],y],[I[0],y-D]),q(I);const W=hc(T,c,.3),R=i.filter($=>T.slice(1).some((L,O)=>$.slice(1).some((U,Q)=>_d(T[O],L,$[Q],U)))).length;if((!a||W<a.collisions||W===a.collisions&&R<a.wireCollisions)&&(a={path:A,points:T,collisions:W,wireCollisions:R,low:y,extra:v,shift:C}),W===0&&R===0)break}const{path:f,points:d,collisions:p,wireCollisions:g,low:m,extra:h,shift:x}=a;return{path:f,points:d,label:[Math.max(s+8,n.labelLeft)+o/2,m],bounds:{right:Math.max(...d.map(C=>C[0])),bottom:Math.max(...d.map(C=>C[1]))},collisions:p+g,rerouted:h>0||x!==0,fallback:p+g>0}}function Zd(e,t=us()){const n="http://www.w3.org/2000/svg",o=(j,z={})=>{const B=document.createElementNS(n,j);for(const[ue,ee]of Object.entries(z))B.setAttribute(ue,ee);return B},i={"@new":"作成前","@none":"作成なし","@unknown":"未決"},s=e.transitions.map(j=>[j]),r=[...new Set(["@new",...e.states,...s.map(j=>j[0].to)])],l={nodes:r.map(j=>({id:j,type:"business",name:i[j]??j,scope:!0})),relations:s.map(([j])=>({kind:j.path==="exception"?"business-exception":"input",from:j.from,to:j.to,label:j.id+"："+j.activity+"："+j.condition}))},u=ms(l,r),c=j=>{const z=Array.from(j);return Array.from({length:Math.ceil(z.length/28)},(B,ue)=>z.slice(ue*28,(ue+1)*28).join(""))},a=s.map(([j])=>({from:j.from,activity:j.activity,rows:[j],lines:[],lineRows:[],offset:0,width:0,height:0})),f=new Map;for(const[j,z]of a.entries()){const B=z.rows[0],ue=e.transitions.filter(ae=>ae.from===B.from&&(ae.activityId??ae.activity)===(B.activityId??B.activity)&&ae.path===B.path&&(B.path!=="exception"||(ae.exception??"例外名未定義")===(B.exception??"例外名未定義"))),ee=ue.map(ae=>(ae.conditionLabel??ae.condition).trim().replace(/\s+/g," ")),he=new Set(ee).size===ue.length?B.conditionLabel??B.condition:B.condition,fe=[B.path==="exception"?"例外："+(B.exception??"例外名未定義"):"",...ue.length>1||B.path==="normal"&&B.conditionLabel?[he]:[]].filter(Boolean).join("：");z.lines=c(z.activity+(fe?"（"+fe+"）":"")),z.lineRows=z.lines.map(()=>z.rows),z.width=Math.max(...z.lines.map(ae=>Array.from(ae).length*14)),z.height=z.lines.length*18,u.wires[j].returning||(z.offset=f.has(z.from)?f.get(z.from)+8:0,f.set(z.from,z.offset+z.height))}const d=new Map;s.forEach(([j],z)=>{if(j.from===j.to){const B=d.get(j.from)??[];B.push(z),d.set(j.from,B)}});const p=new Map,g=new Map;for(const[j,z]of d){let B=0;for(const ee of[...z].reverse())p.set(ee,{leader:z[0],index:0,count:1,depth:0,offset:B}),B+=a[ee].height+8;const ue=24+Math.max(0,B-8)+8;g.set(j,ue);for(const ee of z)p.get(ee).depth=ue}const m=j=>44,h=r.slice().sort((j,z)=>u.positions[j][1]-u.positions[z][1]);let x=Math.max(40,...a.map((j,z)=>u.wires[z].returning&&j.from===h[0]?16+j.height/2-44*(u.wires[z].fromPort??.5):40));const C=new Map;for(const j of h){const z=m(),B=(f.get(j)??0)+(g.get(j)??0);C.set(j,x),x+=bc(z,B)}const v=r.map(j=>({id:j,x:t.positions.get(j)?.[0]??u.positions[j][0],y:t.positions.get(j)?.[1]??C.get(j),width:Math.max(104,Array.from(i[j]??j).length*14+32),height:m()})),M=o("svg",{role:"group","aria-label":e.object+"の状態遷移図",class:"state-diagram"}),I=o("title");I.textContent=e.object+"：Activity名による階段状の状態遷移図。実線は通常遷移、破線は例外または状態が変わらない操作。"+(r.includes("@none")?"作成なしはこの操作の処理結果。":"")+(r.includes("@unknown")?"未決は設計課題。":""),M.append(I),M.append(fs("state-transition-"));const y=new Map,D=[],T=[];let A=t.selected;const q=j=>{A=j,t.selected=j;const z=Go(e.transitions,A);for(const[ee,he]of y)he.setAttribute("class","node graph-shape state-shape"+z.nodeClasses(ee)),he.setAttribute("aria-pressed",String(ee===A));D.forEach(({element:ee,rows:he})=>{const ge=he[0].from===he[0].to;ee.setAttribute("class","edge"+(ge?" state-self-loop":he[0].path==="exception"?" exception":"")+z.labelClasses(he)),ee.setAttribute("marker-end","url(#state-transition-"+(he.some(z.related)?"related-arrow":"arrow")+")")});for(const ee of T)ee.element.setAttribute("class","state-caption-line"+z.labelClasses(ee.rows));M.querySelectorAll("[data-exception-paint]").forEach(ee=>ee.remove());const B=Array.from(M.children).find(ee=>ee.matches(".state-diagram-edge-label,[data-state]"))??null,ue=[...D].sort((ee,he)=>Number(ee.rows.some(z.related))-Number(he.rows.some(z.related)));for(const{element:ee}of ue)if(M.insertBefore(ee,B),ee.classList.contains("exception")||ee.classList.contains("state-self-loop")){const he=M.children.length;ps(M,ee,{path:ee.getAttribute("d")},{"data-transitions":ee.getAttribute("data-transitions")});for(const ge of Array.from(M.children).slice(he))M.insertBefore(ge,B)}M.querySelectorAll(".state-diagram-edge-label").forEach(ee=>M.append(ee))};M.addEventListener("click",j=>{j.target===M&&q()}),M.addEventListener("keydown",j=>{j.key==="Escape"&&(j.preventDefault(),q())});const P=u.wires.map((j,z)=>({...j,captionLane:(a[z].offset+(g.get(a[z].from)??0))/Kr})),W=l.relations.map((j,z)=>({...j,label:String(z).padEnd(Math.ceil(a[z].width/12),"x")})),R=[...p].map(([j,z])=>{const B=v.find(ee=>ee.id===s[j][0].from),ue=a[j];return{x:B.x+B.width+8,y:B.y+B.height+24+z.offset,width:ue.width,height:ue.height}});let $=new _i().update({},e,v,W,P);for(let j=0;j<=R.length;j++){let z=!1,B=0;if($.forEach((ue,ee)=>{if(!ue||p.has(ee)||!P[ee].returning)return;let he=0;for(const ge of R)for(let fe=1;fe<ue.points.length;fe++){const ae=ue.points[fe-1],Se=ue.points[fe];if(Math.abs(ae[0]-Se[0])>1e-7||Math.abs(ae[1]-Se[1])<2)continue;const ye=ae[0];if(ye<ge.x-4||ye>ge.x+ge.width+4||Math.max(ae[1],Se[1])<ge.y-4||Math.min(ae[1],Se[1])>ge.y+ge.height+4)continue;const Me=ge.x+ge.width+12-ye;Me>0&&(he=Math.max(he,Me))}he&&(P[ee]={...P[ee],returnLane:(P[ee].returnLane??0)+Math.ceil(he/16)+B++},z=!0)}),!z)break;$=new _i().update({},e,v,W,P)}const L=$.flatMap((j,z)=>j&&!p.has(z)?[j.points]:[]),O=new Map,U=$.map((j,z)=>{const B=p.get(z);if(!B)return j;const ue=s[z][0].from,ee=v.find(Me=>Me.id===ue),he=$.flatMap((Me,ke)=>Me&&!p.has(ke)?[Me.points]:[]),ge=Math.max(30,W[z].label.length*12),fe=a[z];let ae=O.get(B.leader);ae||(ae=Xd(ee,v,{...B,labelLeft:ee.x+ee.width+8},ge,L),O.set(B.leader,ae),L.push(ae.points));const Se=he.flatMap((Me,ke)=>Me.slice(1).map((Ue,ft)=>({id:`${ke}:${ft}`,x:Math.min(Me[ft][0],Ue[0])-2,y:Math.min(Me[ft][1],Ue[1])-2,width:Math.abs(Me[ft][0]-Ue[0])+4,height:Math.abs(Me[ft][1]-Ue[1])+4}))),ye=Ui([ee.x+ee.width+8+fe.width/2,ee.y+ee.height+24+B.offset+fe.height/2],fe.width,fe.height,[...v,...Se]);return{...ae,label:[ye[0]-fe.width/2+ge/2,ye[1]]}}),Q=new Array(s.length),pe=[],ce=s.map((j,z)=>z).sort((j,z)=>Number(P[j].returning)-Number(P[z].returning));for(const j of ce){const z=U[j],B=a[j],ue=Math.max(30,W[j].label.length*12);let ee=[z.label[0]-ue/2+B.width/2,z.label[1]+(P[j].returning?0:B.height/2-9)];const he=v.find(ae=>ae.id===s[j][0].from),ge=v.find(ae=>ae.id===s[j][0].to);if(!p.has(j)&&P[j].returning&&ge&&ge.y>he.y){const ae=z.points.slice(1).map((Se,ye)=>[z.points[ye],Se]).filter(([Se,ye])=>Math.abs(Se[0]-ye[0])<.01&&ye[1]-Se[1]>24).sort(([Se,ye],[Me,ke])=>ke[1]-Me[1]-(ye[1]-Se[1]))[0];if(ae){const[Se,ye]=ae;ee=[Se[0]+8+B.width/2,Se[1]+Math.min(24+B.height/2,(ye[1]-Se[1])/2)]}}const fe=Ui(ee,B.width,B.height,v,pe);Q[j]=fe,pe.push({id:String(j),x:fe[0]-B.width/2,y:fe[1]-B.height/2,width:B.width,height:B.height})}let se=Math.max(...v.map(j=>j.x+j.width))+40,re=Math.max(...v.map(j=>j.y+j.height))+40;s.forEach((j,z)=>{const B=p.get(z);if(B&&B.leader!==z)return;const ue=B?s.flatMap((ae,Se)=>p.get(Se)?.leader===z?ae:[]):j,ee=ue[0],he=U[z],ge=o("path",{d:he.path,fill:"none",stroke:"currentColor","marker-end":"url(#state-transition-arrow)","data-transitions":ue.map(ae=>ae.id).join(" ")});(B||ee.path==="exception")&&ge.setAttribute("stroke-dasharray","6 5");const fe=o("title");fe.textContent=ue.map(ae=>`${ae.id} ${ae.activity} / ${ae.path==="normal"?"通常":"例外："+(ae.exception??"例外名未定義")}：${ae.condition}`).join(" / "),ge.append(fe),M.append(ge),D.push({element:ge,rows:ue}),se=Math.max(se,he.bounds.right+40),re=Math.max(re,he.bounds.bottom+40)});for(const[j,z]of a.entries()){const B=Q[j],ue=B[0]-z.width/2,ee=B[1]-z.height/2+14;M.append(o("rect",{x:String(ue),y:String(ee-14),width:String(z.width),height:String(z.height),fill:"none","pointer-events":"none","data-canvas-boundary":""}));const he=o("text",{x:String(ue),y:String(ee),class:"state-diagram-edge-label","data-activity":z.activity,"data-transition-id":z.rows[0].id,"aria-label":z.lines.join("")});z.lines.forEach((ge,fe)=>{const ae=o("tspan",{x:String(ue),dy:fe?"18":"0","font-size":"14","font-weight":"600"});ae.textContent=ge,ae.setAttribute("data-transitions",z.lineRows[fe].map(Se=>Se.id).join(" ")),T.push({element:ae,rows:z.lineRows[fe]}),he.append(ae)}),M.append(he),se=Math.max(se,ue+z.width+24),re=Math.max(re,ee+z.height+24)}for(const j of v){const z=j.id.startsWith("@"),B=o("g",{role:"button",tabindex:"0","aria-label":i[j.id]??j.id,"aria-pressed":"false",class:"node graph-shape state-shape","data-state":j.id,"data-node":j.id});B.append(Hr(document,j,z)),B.append(o("rect",{x:String(j.x),y:String(j.y),width:String(j.width),height:String(j.height),rx:z?"20":"8",class:z?"state-diagram-node state-note":"state-diagram-node"}));const ue=o("text",{x:String(j.x+j.width/2),y:String(j.y+j.height/2+5),"text-anchor":"middle",class:"state-diagram-node-label"});if(ue.textContent=i[j.id]??j.id,B.append(ue),z&&j.id!=="@new"){const ee=o("text",{x:String(j.x+j.width/2),y:String(j.y-8),"text-anchor":"middle",class:"state-diagram-event-id"});ee.textContent=j.id==="@unknown"?"課題：保存状態が未定義":"処理結果：記録を作らない",B.append(ee)}B.addEventListener("click",()=>q(j.id)),B.addEventListener("keydown",ee=>{(ee.key==="Enter"||ee.key===" ")&&(ee.preventDefault(),q(j.id))}),y.set(j.id,B),M.append(B)}return q(t.selected),M.setAttribute("viewBox",`0 0 ${se} ${re}`),M.style.minWidth=`${se}px`,M}const br=new WeakMap;function Yd(e,t,n){const o=e.objectStateTransitions?.[t];if(!o||!e.graph.nodes.some(m=>m.id===t&&m.type==="object"))return;const i=document.createElement("section");i.className="state-transition-panel",i.setAttribute("aria-label","状態遷移");const s=(m,h,x=i)=>{const C=document.createElement(m);return C.textContent=h,x.append(C),C};if(o.error)return s("p","状態遷移を表示できません："+o.error).setAttribute("role","status"),i;const r=o.model;for(const m of r.transitions){if(!e.graph.nodes.some(h=>h.id===m.activity&&h.type==="business"))return s("p","状態遷移を表示できません：根拠Activityが見つかりません").setAttribute("role","status"),i;if(m.exceptionId){const h=e.model?.business.exceptions?.find(x=>x.id===m.exceptionId);if(!h||h.activityId!==m.activity)return s("p","状態遷移を表示できません：例外ID参照が不正です").setAttribute("role","status"),i}}const l=br.get(e)??new Map;br.set(e,l);const u=l.get(t)??us();l.set(t,u);const c={...r,transitions:r.transitions.map(m=>({...m,activityId:m.activity,activity:e.graph.nodes.find(h=>h.id===m.activity)?.name??m.activity}))};i.append(Br(document,m=>Zd(c,m),u));const a=m=>({"@new":"記録作成前","@none":"この操作では作成しない（処理結果）","@unknown":"未決（設計課題）"})[m]??m,f={change:"状態変更",unchanged:"状態不変","no-create":"作成しない",constraint:"結果の制約・遷移先未決"},d=document.createElement("details");s("summary",`操作の詳細（${r.transitions.length}）`,d);const p=document.createElement("ol");d.append(p),i.append(d);for(const m of r.transitions){const h=document.createElement("li");h.dataset.transition=m.id,s("h3",`${m.id} · ${a(m.from)} → ${a(m.to)}`,h),m.path==="exception"&&s("p","例外名："+(m.exception??"未定義"),h),s("p",`${f[m.effect]} · ${m.path==="normal"?"正常":"例外"}`,h);const x=e.graph.nodes.find(C=>C.id===m.activity&&C.type==="business");if(x){const C=document.createElement("button");C.type="button",C.textContent=x.name,C.onclick=()=>n(x.id),h.append(C)}else s("p","要確認：根拠Activityが見つかりません — "+m.activity,h);s("p","条件："+m.condition,h),s("p",m.note,h),s("p","根拠："+m.evidence,h),p.append(h)}r.transitions.length||s("p","明示された操作はありません。");const g=document.createElement("details");return s("summary","宣言の出典",g),s("p",r.source,g),i.append(g),i}const gr=64,Qd=96,el=260,yr=40,tl=4;function nl(e,t,n=!0){const{nodes:o,previous:i,children:s,parents:r,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}=gc(e,t),a=r.map(I=>I.length),f=o.map(()=>0),d=o.flatMap((I,y)=>a[y]===0?[y]:[]);for(let I=0;I<d.length;I++)for(const y of s[d[I]])f[y]=Math.max(f[y],f[d[I]]+1),--a[y]===0&&d.push(y);const p=Array.from({length:f.reduce((I,y)=>Math.max(I,y),0)+1},()=>[]);o.forEach((I,y)=>p[f[y]].push(y));const g=o.map(()=>0),m=I=>I.forEach((y,D)=>g[y]=D);p.forEach(m);for(let I=0;I<tl;I++){const y=I%2?[...p].reverse():p;for(const D of y){const T=new Map(D.map(A=>{const q=I%2?s[A]:r[A];return[A,q.length?q.reduce((P,W)=>P+g[W],0)/q.length:g[A]]}));D.sort((A,q)=>T.get(A)-T.get(q)||A-q),m(D)}}const h=p[0].filter(I=>o[I].type==="object"&&i[I].length===0&&s[I].length>0);if(n&&h.length>1){const I=new Set(h),y=p[0].filter(D=>!I.has(D));p.splice(0,1,...h.map((D,T)=>T===0?[...y,D]:[D]))}const x=Object.create(null),C=o.map(()=>0),v=[],M=Math.ceil(el/gr)-1;for(let I=0;I<p.length;I++){const y=new Map;for(const A of v)for(const q of A)y.set(q,q+1);const D=A=>{let q=A;for(;y.has(q);)q=y.get(q);let P=A;for(;y.has(P);){const W=y.get(P);y.set(P,q),P=W}return q},T=[];for(const A of p[I]){let q=I;for(const W of r[A])q=Math.max(q,C[W]+1);const P=D(q);C[A]=P,y.set(P,P+1),T.push(P),x[o[A].id]=[yr+I*gr,yr+P*Qd]}v.push(T),v.length>M&&v.shift()}return{positions:x,forwardRelations:l,feedbackRelations:u,exceptionRelations:c}}function ol(e,t){return _r(e)?ms(e,t).positions:nl(e,t).positions}const vr=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function ca(e){const t=new Map(e.nodes.map(n=>[n.id,n.name]));return{...e,nodes:[...e.nodes].sort((n,o)=>vr(n.name,o.name)),relations:[...e.relations].sort((n,o)=>{for(const i of["kind","from","to","label"]){const s=vr(i==="from"||i==="to"?t.get(n[i]):n[i],i==="from"||i==="to"?t.get(o[i]):o[i]);if(s)return s}return 0})}}function da(e){const t=ca(e.graph),n=new Map(t.nodes.map(i=>[i.id,i.name])),o=new Map(t.nodes.map(i=>[i.name,i.id]));return{graph:{...t,nodes:t.nodes.map(i=>({...i,id:i.name})),relations:t.relations.map(i=>({...i,from:n.get(i.from),to:n.get(i.to)}))},order:e.activityOrder?.map(i=>n.get(i)),restore:i=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(i).map(([s,r])=>[o.get(s),r])))}}function la(e){const t=da(e);return t.restore(ol(t.graph,t.order))}function il(e){const t=da(e),n=ms(t.graph,t.order);return{...n,positions:t.restore(n.positions),cells:t.restore(n.cells)}}function ua(e){const t=e.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);if(!t)return{database:"alder-web-viewer"};const[,n,o]=t;return{database:`alder-web-viewer:preview:pr-${n}:${o}`,pr:n,version:o}}function sl(e,t){if(!e)return!1;const n=s=>"format"in s?!!s.document?.handle||s.recovery.some(r=>r.handle!==void 0):s.tabs.some(r=>r.handle!==void 0);if(n(e)||n(t))return!1;const o=new Set;function i(s,r){if(Object.is(s,r))return!0;if(!s||!r||typeof s!="object"||typeof r!="object"||o.has(s)||o.has(r))return!1;const l=p=>Array.isArray(p)||Object.getPrototypeOf(p)===null||Object.getPrototypeOf(p)?.constructor?.name==="Object";if(!l(s)||!l(r)||Array.isArray(s)!==Array.isArray(r)||Array.isArray(s)&&s.length!==r.length)return!1;o.add(s),o.add(r);const u=s,c=r,a=Object.keys(u),f=Object.keys(c),d=a.length===f.length&&a.every(p=>Object.hasOwn(c,p)&&i(u[p],c[p]));return o.delete(s),o.delete(r),d}return i(e,t)}function Xn(e,t){const n=new Set(t.graph.nodes.map(s=>s.id)),o=Object.create(null);for(const[s,r]of Object.entries(e.positions))n.has(s)&&(o[s]=[...r]);const i=t.graph.nodes.filter(s=>!o[s.id]);if(i.length){const s=la(t),r=Object.values(o);for(const l of i){const u=[...s[l.id]];for(;r.some(c=>Math.abs(c[0]-u[0])<280&&Math.abs(c[1]-u[1])<88);)u[1]+=180;o[l.id]=u,r.push(u)}}return{...e,design:t,positions:o,hiddenNodes:e.hiddenNodes?.filter(s=>n.has(s)),selected:e.selected&&n.has(e.selected)?e.selected:void 0}}function fa(){return new Promise((e,t)=>{const n=indexedDB.open(ua(globalThis.location?.pathname??"/").database,1);n.onupgradeneeded=()=>n.result.createObjectStore("session"),n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}class vs extends Error{constructor(){super("Session was saved by another window"),this.name="SessionConflictError"}}let _o;function pa(e){if(e===void 0)return 0;if(typeof e!="number"||!Number.isSafeInteger(e)||e<0)throw Error("Invalid session generation");return e}async function rl(e){const t=_o;if(t===void 0)throw Error("Session has not been loaded");const n=await fa();try{await new Promise((o,i)=>{const s=n.transaction("session","readwrite"),r=s.objectStore("session"),l=r.get("generation"),u=r.get("current"),c=r.get("readonly-legacy");let a,f;c.onsuccess=()=>{try{const d=pa(l.result);if(sl(u.result,e)){f=d;return}if(d!==t)throw new vs;if(f=t+1,!Number.isSafeInteger(f))throw Error("Session generation exhausted");c.result===void 0&&cl(u.result)&&r.put(u.result,"readonly-legacy"),r.put(e,"current"),r.put(f,"generation")}catch(d){a=d,s.abort()}},s.oncomplete=()=>{_o=f,o()},s.onerror=()=>i(a??s.error??Error("Session save failed")),s.onabort=()=>i(a??s.error??Error("Session save aborted"))})}finally{n.close()}}async function al(){_o=void 0;const e=await fa();try{return await new Promise((t,n)=>{const o=e.transaction("session"),i=o.objectStore("session"),s=i.get("current"),r=i.get("generation");o.oncomplete=()=>{try{_o=pa(r.result),t(s.result)}catch(l){n(l)}},o.onerror=()=>n(o.error),o.onabort=()=>n(o.error??Error("Session load aborted"))})}finally{e.close()}}function cl(e){return e?"format"in e?!!e.recovery?.length||!!e.legacyViews||!!e.document?.edited||e.document?.draft!==void 0:e.tabs.length>1||e.tabs.some(t=>t.edited||t.draft!==void 0):!1}const wr=new WeakMap;function dl(e,t){if(t===void 0)return e;if(!e.graph.nodes.find(a=>a.id===t&&a.type==="business"))throw Error("Unknown Activity: "+t);let o=wr.get(e);o||(o=new Map,wr.set(e,o));const i=o.get(t);if(i)return i;const s=new Set(e.graph.nodes.filter(a=>a.type==="object").map(a=>a.id)),r=new Set(e.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)),l=e.graph.relations.filter(a=>a.kind==="input"&&a.to===t&&s.has(a.from)||a.kind==="output"&&a.from===t&&s.has(a.to)||a.kind==="business-exception"&&(a.from===t&&r.has(a.to)||a.to===t&&r.has(a.from))),u=new Set([t,...l.flatMap(a=>[a.from,a.to])]),c={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(a=>u.has(a.id)),relations:l},activityOrder:(e.activityOrder??e.graph.nodes.filter(a=>a.type==="business").map(a=>a.id)).filter(a=>u.has(a))};return o.set(t,c),c}const kr=new WeakMap;function ll(e,t){if(!e.graph.nodes.find(f=>f.id===t&&f.type==="object"))throw Error("Unknown Object: "+t);let o=kr.get(e);o||(o=new Map,kr.set(e,o));const i=t,s=o.get(i);if(s)return s;const r=new Set(e.graph.nodes.filter(f=>f.type==="object").map(f=>f.id)),l=new Set(e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)),u=e.graph.relations.filter(f=>f.kind==="input"&&f.from===t&&l.has(f.to)||f.kind==="output"&&f.to===t&&l.has(f.from)||f.kind==="object-exception"&&(f.from===t&&r.has(f.to)||f.to===t&&r.has(f.from))),c=new Set([t,...u.flatMap(f=>[f.from,f.to])]),a={...e,graph:{...e.graph,nodes:e.graph.nodes.filter(f=>c.has(f.id)),relations:u},activityOrder:(e.activityOrder??e.graph.nodes.filter(f=>f.type==="business").map(f=>f.id)).filter(f=>c.has(f))};return o.set(i,a),a}const ma=new WeakMap;function nn(e){return ma.get(e)}const ha=["design","checks","source","draft","edited","handle"];function ul(e){return{key:e.key,name:e.name,...Object.fromEntries(ha.map(t=>[t,e[t]]))}}function Vt(e){const{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:r,viewInset:l,canvasOrigin:u,scroll:c,zoom:a}=e;return{key:t,positions:n,selected:o,hiddenNodes:i,showExceptions:s,selectedEdgesOnly:r,viewInset:l,canvasOrigin:u,scroll:c,zoom:a,..."activity"in e?{activity:e.activity}:{},..."object"in e?{object:e.object}:{}}}function ii(e,t){const n=t;ma.set(n,e),Object.defineProperty(n,"name",{configurable:!0,get:()=>{const o=t.activity??t.object;return o===void 0?"全体図":e.design.graph.nodes.find(i=>i.id===o)?.name??o}});for(const o of ha)Object.defineProperty(n,o,{configurable:!0,get:()=>e[o],set:i=>{e[o]=i}});return n}function Xo(e){return e.activity}function Zo(e){return e.object}function fo(e){return e.activity??e.object}function si(e){return e.object===void 0?dl(e.design,e.activity):ll(e.design,e.object)}function ri(e){const t=si(e),n=Xn({...e},t);if(e.hiddenNodes!==void 0){const o=new Set([...e.design.graph.nodes,...t.graph.nodes].map(i=>i.id));n.hiddenNodes=e.hiddenNodes.filter(i=>o.has(i))}return n}function Bt(e,t=[],n,o){const i=n??(e.tabs[0]?ul(e.tabs[0]):void 0),s=i?(o??[e.tabs[0]?Vt(e.tabs[0]):{key:i.key,positions:{},scroll:[0,0],zoom:1}]).map(d=>{const p=ii(i,d);return Object.assign(d,Vt(ri(p))),p}):[],{dark:r,drawer:l,width:u,preferWrite:c,nodeDrawer:a,sampleLayout:f}=e;return{dark:r,drawer:l,width:u,preferWrite:c,nodeDrawer:a,sampleLayout:f,document:i,tabs:s,recovery:t,urlHistory:e.urlHistory??[...i?.source?.kind==="url"?[{url:i.source.url,name:i.name}]:[],...t.filter(d=>d.source?.kind==="url").map(d=>({url:d.source.url,name:d.name}))].filter((d,p,g)=>g.findIndex(m=>m.url===d.url)===p),legacyViews:e.legacyViews,active:s.some(d=>d.key===e.active)?e.active:s[0]?.key}}function ws(e){const{document:t,recovery:n,tabs:o,...i}=e;return{...i,format:3,document:t,views:o.map(Vt),recovery:n}}function Do(e){const t=(n,o=!1)=>Array.isArray(n)&&n.length===2&&n.every(i=>typeof i=="number"&&Number.isFinite(i)&&(!o||i>=0));if(!e||typeof e.key!="string"||!e.key||!e.positions||typeof e.positions!="object"||Array.isArray(e.positions)||!Object.values(e.positions).every(n=>t(n))||!t(e.scroll)||!Number.isFinite(e.zoom)||e.zoom<.25||e.zoom>2.5||e.selected!==void 0&&typeof e.selected!="string"||e.activity!==void 0&&typeof e.activity!="string"||e.object!==void 0&&typeof e.object!="string"||e.activity!==void 0&&e.object!==void 0||e.hiddenNodes!==void 0&&(!Array.isArray(e.hiddenNodes)||!e.hiddenNodes.every(n=>typeof n=="string"))||e.showExceptions!==void 0&&typeof e.showExceptions!="boolean"||e.selectedEdgesOnly!==void 0&&typeof e.selectedEdgesOnly!="boolean"||e.viewInset!==void 0&&!t(e.viewInset,!0)||e.canvasOrigin!==void 0&&!t(e.canvasOrigin,!0))throw Error("Invalid saved view")}function fl(e){const t=e.urlHistory;if(t!==void 0&&(!Array.isArray(t)||t.some(o=>!o||typeof o.name!="string"||typeof o.url!="string"||!yl(o.url))||new Set(t.map(o=>o.url)).size!==t.length))throw Error("Invalid URL history");if("format"in e){const o=e;if(![2,3].includes(o.format)||!Array.isArray(o.views)||!Array.isArray(o.recovery))throw Error("Invalid workspace");const i=e.legacyViews;if(i){if(!Array.isArray(i.views)||i.active!==void 0&&typeof i.active!="string"||i.documentKey!==void 0&&typeof i.documentKey!="string")throw Error("Invalid legacy backup");for(const a of i.views)Do(a)}const{format:s,views:r,document:l,recovery:u,...c}=e;for(const a of r)Do(a);for(const a of u)Do(a);if(!!l!=!!r.length||new Set(r.map(a=>a.key)).size!==r.length)throw Error("Invalid workspace views");if(o.format===2){if(o.views.some(d=>d.group!==void 0&&typeof d.group!="string"))throw Error("Invalid legacy Group");if(o.views.length&&(o.views[0].group!==void 0||o.views.filter(d=>d.group===void 0).length!==1))throw Error("Invalid legacy views");const a=o.views[0],f=a?{...a}:void 0;return f&&delete f.group,Bt({...c,tabs:[],active:f?.key,legacyViews:{documentKey:l?.key,views:structuredClone(o.views),active:o.active}},u,l,f?[f]:[])}if(r.length&&(r[0].activity!==void 0||r[0].object!==void 0||r.filter(a=>a.activity===void 0&&a.object===void 0).length!==1)||new Set(r.filter(a=>a.activity!==void 0).map(a=>a.activity)).size!==r.filter(a=>a.activity!==void 0).length||new Set(r.filter(a=>a.object!==void 0).map(a=>a.object)).size!==r.filter(a=>a.object!==void 0).length)throw Error("Invalid workspace views");if(l&&r.some(a=>a.activity!==void 0&&!l.design.graph.nodes.some(f=>f.type==="business"&&f.id===a.activity)))throw Error("Unknown saved Activity");if(l&&r.some(a=>a.object!==void 0&&!l.design.graph.nodes.some(f=>f.type==="object"&&f.id===a.object)))throw Error("Unknown saved Object");return Bt({...c,tabs:[]},u,l,r)}if(!Array.isArray(e.tabs)||new Set(e.tabs.map(o=>o.key)).size!==e.tabs.length)throw Error("Invalid legacy session");for(const o of e.tabs)Do(o);const n=e.tabs.find(o=>o.key===e.active)??e.tabs[0];return Bt({...e,tabs:n?[n]:[]},e.tabs.length>1?[...e.tabs]:[])}function pl(e,t){const n=t.source?.kind==="url"?t.source.url:void 0,o=n?[{url:n,name:t.name},...(e.urlHistory??[]).filter(i=>i.url!==n)]:e.urlHistory;return Bt({...e,urlHistory:o,tabs:[t],active:t.key},e.recovery)}function ml(e,t,n=e.document?.handle,o=!1){if(!e.document)return e;const i={...e.document,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},s=new Set(t.graph.nodes.filter(u=>u.type==="business").map(u=>u.id)),r=new Set(t.graph.nodes.filter(u=>u.type==="object").map(u=>u.id)),l=e.tabs.filter(u=>(u.activity===void 0||s.has(u.activity))&&(u.object===void 0||r.has(u.object))).map(Vt);return Bt(e,e.recovery,i,l)}function hl(e,t){const n=e.tabs.find(i=>Xo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="business"&&i.id===t))throw Error("Unknown Activity");const o=ii(e.document,{key:crypto.randomUUID(),activity:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,Vt(ri(o))),e.tabs.push(o),e.active=o.key,o}function bl(e,t){const n=e.tabs.find(i=>Zo(i)===t);if(n)return e.active=n.key,n;if(!e.document||!e.document.design.graph.nodes.some(i=>i.type==="object"&&i.id===t))throw Error("Unknown Object");const o=ii(e.document,{key:crypto.randomUUID(),object:t,selected:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]});return Object.assign(o,Vt(ri(o))),e.tabs.push(o),e.active=o.key,o}function gl(e,t){const n=e.tabs.map(o=>{const i=t.tabs.find(s=>s.key===o.key);return Vt(i?ri(ii(e.document,{...Vt(o),...Vt(i)})):o)});return Bt({...e,dark:t.dark,drawer:t.drawer,nodeDrawer:t.nodeDrawer,width:t.width,preferWrite:t.preferWrite,active:e.tabs.some(o=>o.key===t.active)?t.active:e.active},e.recovery,e.document,n)}function yl(e){try{const t=new URL(e);return t.protocol==="https:"&&!t.username&&!t.password}catch{return!1}}function ai(e,t,n=()=>{}){t.classList.add("toolbar-menu"),t.setAttribute("role","menu"),t.hidden=!0,e.setAttribute("aria-haspopup","menu"),e.setAttribute("aria-controls",t.id),e.setAttribute("aria-expanded","false");const o=l=>l instanceof HTMLButtonElement&&l.disabled,i=()=>Array.from(t.querySelectorAll("button,a[href]")).filter(l=>!l.hidden&&!o(l));for(const l of Array.from(t.querySelectorAll("button,a[href]")))l.setAttribute("role","menuitem");const s=(l=!1)=>{t.hidden=!0,e.setAttribute("aria-expanded","false"),l&&(e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"))?.focus({preventScroll:!0})},r=(l=!1)=>{if(e.disabled)return;n(),t.hidden=!1,e.setAttribute("aria-expanded","true");const u=e.getBoundingClientRect().width?e:document.getElementById("document-actions-toggle"),c=u.getBoundingClientRect();t.style.left=Math.max(8,Math.min(c.right-t.offsetWidth,innerWidth-t.offsetWidth-8))+"px",t.style.top=Math.max(8,Math.min(c.bottom+4,innerHeight-t.offsetHeight-8))+"px",(l?i().at(-1):i()[0])?.focus({preventScroll:!0})};return e.onclick=()=>t.hidden?r():s(!0),e.onkeydown=l=>{(l.key==="ArrowDown"||l.key==="ArrowUp")&&(l.preventDefault(),r(l.key==="ArrowUp"))},t.addEventListener("keydown",l=>{const u=l,c=i(),a=c.indexOf(document.activeElement);let f;u.key==="ArrowDown"&&(f=(a+1)%c.length),u.key==="ArrowUp"&&(f=(a+c.length-1)%c.length),u.key==="Home"&&(f=0),u.key==="End"&&(f=c.length-1),f!==void 0&&(u.preventDefault(),c[f]?.focus())}),t.addEventListener("click",l=>{const u=l.target.closest("button,a[href]");!t.hidden&&u&&!o(u)&&s(!0)},!0),document.addEventListener("keydown",l=>{!t.hidden&&l.key==="Escape"&&(l.preventDefault(),l.stopImmediatePropagation(),s(!0))},!0),document.addEventListener("pointerdown",l=>{!t.hidden&&!t.contains(l.target)&&!e.contains(l.target)&&s()}),document.addEventListener("focusin",l=>{!t.hidden&&!t.contains(l.target)&&l.target!==e&&s()}),window.addEventListener("resize",()=>s()),{close:s}}const vl=e=>e.toLowerCase().replace(/[^\p{L}\p{N}_\-\s]/gu,"").replace(/ /g,"-"),wl={種別:"classification",分類:"classification",条件:"condition",期待結果:"expectedResult","条件・期待結果":"guarantee",根拠:"evidence",導出分類:"derivation",関連業務:"related",テスト証拠:"testEvidence",確認事項:"question",選択肢と影響:"alternatives",AI確度:"confidence"};function kl(e,t,n,o){const i=e.replace(/\r\n?/g,`
`).split(`
`),s=v=>i.slice(v.line+1,o.find(M=>M.line>v.line&&M.level<=v.level)?.line??i.length).join(`
`).trim(),r=new Map(o.filter(v=>v.level===3&&t.some(M=>M.title===v.title)).map(v=>[v.title,v])),l=v=>{const M=t.find(I=>I.title===v.title);return M?"legacy-check:"+M.id:v.level===1?"legacy-check-document":"legacy-heading:"+v.line},u=new Map,c=(v,M)=>{u.has(v)?u.get(v)!==M&&u.set(v,void 0):u.set(v,M)};for(const v of o){const M=l(v);c(vl(v.title),M);const I=t.find(y=>y.title===v.title);I&&c(I.id.toLowerCase(),M)}for(const[v,M]of i.entries()){const I=/<a\s+id=["']?([^\s"'>]+)["']?\s*><\/a>/.exec(M);if(I){const y=o.find(D=>D.line>v);y&&c(I[1].toLowerCase(),l(y))}}const a=v=>{v=v.replace(/<a\s+id=[^>]+><\/a>/g,"");const M=[];let I=0;for(const y of v.matchAll(/\[([^\]\n]+)\]\(([^\s)]+)\)/g)){y.index>I&&M.push({kind:"markdown",value:v.slice(I,y.index)});let D=y[2].slice(1);try{D=decodeURIComponent(D)}catch{}const T=y[2].startsWith("#")?u.get(D.toLowerCase()):void 0;M.push(T?{kind:"reference",targetId:T,label:y[1]}:{kind:"link",uri:y[2],label:y[1]}),I=y.index+y[0].length}return I<v.length&&M.push({kind:"markdown",value:v.slice(I)}),M},f=[],d=[],p=[],g=new Map;for(const v of o.filter(M=>M.level===2)){if(v.title==="業務一覧")continue;const M=l(v),I=o.find(y=>y.line>v.line)?.line??i.length;f.push({id:M,activityId:Object.hasOwn(n,v.title)?v.title:null,title:v.title,preamble:a(i.slice(v.line+1,I).join(`
`).trim())}),g.set(v.title,M)}const m="legacy-unassigned",h=v=>{const M=o.filter(I=>I.line<v.line&&I.level===2).at(-1);return M?g.get(M.title):void 0},x=t.map(v=>{const M=r.get(v.title),I=h(M)??m,y=Object.create(null),D=[];let T={name:"補足",value:""},A="";for(const P of v.body.replace(/<\/?details>/g,"").replace(/<summary>[^<]*<\/summary>/g,"").split(`
`)){const W=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(P);W&&(A?W[1][0]===A[0]&&W[1].length>=A.length&&!W[2].trim()&&(A=""):A=W[1]);const R=A?null:/^[-*] ([^：:]+)[：:]\s*(.*)$/.exec(P);R?(T.value.trim()&&D.push(T),T={name:R[1],value:R[2]}):T.value+=`
`+P}T.value.trim()&&D.push(T);let q="";for(const P of D)if(P.name==="人間レビュー状態"){q=P.value.split(`
`)[0].trim();const W=P.value.split(`
`).slice(1).join(`
`).trim();W&&(y.補足=[...y.補足??[],...a(W)])}else{const W=wl[P.name]??P.name;y[W]=[...y[W]??[],...a(P.value.trim())]}return{id:"legacy-check:"+v.id,checkId:v.id,title:v.title.replace(/^[^\s]+\s+[—–-]\s+/,""),reviewState:q,sectionId:I,detailSummary:[...v.body.matchAll(/<summary>([^<]*)<\/summary>/g)].map(P=>P[1]).join(`
`),fields:y}});x.some(v=>v.sectionId===m)&&f.push({id:m,activityId:null,title:"未割当",preamble:[]});for(const v of o.filter(M=>M.level===3&&!r.has(M.title))){const M=h(v);M?d.push({id:l(v),sectionId:M,title:v.title,blocks:[{kind:"prose",content:a(s(v))}]}):p.push({id:l(v),title:v.title,content:a(s(v))})}const C=o.find(v=>v.level===2)?.line??i.length;return{id:"legacy-check-document",kind:"checkItems",revision:"unversioned",title:o.find(v=>v.level===1)?.title??"Check Item",basedOn:{documentId:"legacy-business-design",revision:"unversioned",verification:"unverified"},intro:a(i.slice(/^# /.test(i[0])?1:0,C).join(`
`)),sections:f,items:x,index:Object.entries(n).map(([v,M])=>{const I=i.find(y=>y.startsWith("|")&&y.includes("["+v+"]"))?.split("|").slice(1,-1)??[];return{activityId:v,purpose:I[1]?.trim()??"",connections:I[2]?.trim()??"",checkIds:M.map(y=>"legacy-check:"+y)}}),guarantees:d,examples:[],notes:p}}function Di(e){try{const t=new URL(e);if(t.protocol!=="https:"||t.username||t.password)return;let n=t.pathname.split("/").filter(Boolean).map(decodeURIComponent);if(t.hostname==="github.com"){if(n[2]!=="blob")return;n.splice(2,1)}else if(t.hostname!=="raw.githubusercontent.com")return;const[o,i,...s]=n;if(!o||!i)return;s[0]==="refs"&&["heads","tags"].includes(s[1])&&s.splice(0,2);const[r,...l]=s;return!r||!l.length||!["main","master"].includes(r)&&!/^[a-f0-9]{40}$/i.test(r)?void 0:{document:`${o.toLowerCase()}/${i.toLowerCase()}/${l.join("/")}`,ref:r}}catch{return}}function Xi(e){return[...e.matchAll(/\[[^\]\n]*\]\(([^\s)]+)\)/g)].map(t=>({label:t[0].slice(1,t[0].indexOf("]")),url:t[1]}))}function Il(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("Check本文は2MiB以内にしてください。");const t=new Set,n=e.replace(/\r\n?/g,`
`).split(`
`),o=[];let i="";if(n.forEach((f,d)=>{const p=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(f);if(p){i?p[1][0]===i[0]&&p[1].length>=i.length&&!p[2].trim()&&(i=""):i=p[1];return}if(!i){t.add(d);const g=/^(#{1,6}) (.+)$/.exec(f);g&&o.push({line:d,level:g[1].length,title:g[2]})}}),i)throw Error("Check Markdownのコードブロックが閉じていません。");const s=o.filter(f=>f.level===3&&/^[A-Za-z][A-Za-z0-9_-]*\s+[—–-]\s+\S/.test(f.title));if(!s.length)throw Error("Check ID・条件・期待結果・人間レビュー状態を持つCheck Markdownを指定してください。");const r=new Set,l=s.map(f=>{const d=o.find(m=>m.line>f.line&&m.level<=3)?.line??n.length,p=f.title.split(/\s/)[0];if(r.has(p))throw Error("Check IDが重複しています: "+p);r.add(p);const g=n.slice(f.line+1,d).join(`
`).replace(/\n*<a\s+id=[^>]+><\/a>\s*$/i,"").trim();for(const m of["条件","期待結果","人間レビュー状態"])if(!new RegExp("^[-*] "+m+"[：:]\\s*\\S","m").test(g))throw Error(p+" の"+m+"が見つかりません。");return{id:p,title:f.title,body:g,activities:[]}}),u=Object.create(null);let c=!1;for(const[f,d]of n.entries()){if(!t.has(f)||(/^## /.test(d)&&(c=/^## 業務一覧\s*$/.test(d)),!c||!/^\|/.test(d)))continue;const p=d.split("|").slice(1,-1);if(p.length!==4)continue;const g=Xi(p[0])[0]?.label;if(!g)continue;if(Object.hasOwn(u,g))throw Error("業務一覧のActivityが重複しています: "+g);const m=Xi(p[3]);if(m.some(x=>x.url.toLowerCase()!=="#"+x.label.toLowerCase()))throw Error("Check IDのリンク先が一致しません: "+g);const h=m.map(x=>x.label);if(!h.length||h.some(x=>!r.has(x)))throw Error("業務一覧のCheck ID参照を確認できません: "+g);u[g]=[...new Set(h)];for(const x of l)h.includes(x.id)&&x.activities.push(g)}if(!Object.keys(u).length)throw Error("業務一覧のActivityとCheck IDの対応を確認できません。");const a=o.find(f=>f.level===2)?.line??s[0].line;return{markdown:e,intro:n.slice(0,a).join(`
`),items:l,index:u,model:kl(e,l,u,o)}}function po(e){return JSON.stringify([e.design.markdown,e.source?.kind==="url"?e.source.url:null,e.edited===!0])}function mo(e,t){const n=new Set(t.design.graph.nodes.filter(c=>c.type==="business").map(c=>c.name)),o=Object.keys(e.index).filter(c=>!n.has(c)),i=Object.keys(e.index).filter(c=>n.has(c)),s=(c,a)=>({state:c,reason:a,unknown:o});if(!i.length)return s("mismatch","業務一覧に、この業務設計書のActivityがありません。");const r=e.intro.split(`
`).filter(c=>/原典|^[-*] Source[：:]|Business Design/i.test(c)).join(`
`),l=Xi(r).map(c=>Di(c.url)).filter(c=>c!==void 0),u=t.source?.kind==="url"?Di(t.source.url):t.source?.kind==="sample"?Di("https://github.com/mk3008/alder/blob/main/business-design/alder/README.md"):void 0;return u&&l.length&&l.some(c=>c.document!==u.document)?s("mismatch","Checkの原典参照が、開いている業務設計書と異なります。"):o.length?s("unverified","業務一覧に対応先不明のActivityがあります: "+o.join("、")):!u||!l.length?s("unverified","文書の識別情報が不足しています。Activity名の一致だけでは同じ業務設計書と確認できません。"):t.edited||l.some(c=>c.ref!==u.ref)||!/^[a-f0-9]{40}$/i.test(u.ref)?s("unverified","原典の文書パスは一致しますが、版の一致は未確認です。参照版・本文・業務名を確認してください。"):s("matched","原典の文書パス・commit・Activity名が一致しています。業務意味やCheckの承認を表すものではありません。")}const Ir=new WeakMap;function Kn(e){let t=Ir.get(e);return t||(t=Il(e.markdown),Ir.set(e,t)),t}const Ti=(e,t)=>{const n=document.createElement("button");return n.type="button",n.textContent=e,n.onclick=t,n};function To(e,t){const n=document.createElement("p");n.textContent=t,e.append(n)}function Sl(e){const t=document.createElement("pre");return t.className="check-source",t.textContent=e,t}function xl(e){if(!e.checks)return[];const t=Kn(e.checks),n=mo(t,e);return n.state==="matched"||n.state==="unverified"&&e.checks.confirmedFor===po(e)?[t.model]:[]}function Al(e,t,n){const o=document.createElement("section");o.className="check-controls",o.setAttribute("aria-label","関連Check");const i=document.createElement("section");if(i.className="check-notices",t.busy&&To(i,"関連Checkを読み込み・保存しています…"),t.error){const l=document.createElement("p");l.className="check-warning",l.setAttribute("role","alert"),l.textContent=t.error,i.append(l)}let s,r=!1;if(e.checks){s=Kn(e.checks);const l=mo(s,e);if(r=l.state==="matched"||l.state==="unverified"&&e.checks.confirmedFor===po(e),!r&&(To(i,"現在のBDとの対応を再確認してください。"+l.reason),l.state==="unverified")){const u=Ti("現在のBDとの対応を確認して表示する",()=>n.confirm(e.checks));u.disabled=n.disabled||t.busy===!0,i.append(u)}}if(t.candidate){const l=t.candidate,u=Kn(l),c=mo(u,e),a=document.createElement("section");a.className="check-candidate",a.id="check-candidate",To(a,"一致未確認: "+l.name+" — "+c.reason),To(a,"関連付けの確認は、Checkの人間レビュー状態や業務意味の承認を変更しません。");const f=document.createElement("details"),d=document.createElement("summary");d.textContent="原典参照・業務別インデックス・Check本文を確認",f.append(d,Sl(u.markdown)),a.append(f);const p=Ti("対応を確認して表示する",()=>n.confirm(l));p.id="check-confirm",p.disabled=c.state==="mismatch"||n.disabled||t.busy===!0;const g=Ti("この読込を取り消す",()=>{t.candidate=void 0,n.redraw()});g.disabled=n.disabled||t.busy===!0,a.append(p,g),i.append(a)}return i.childNodes.length&&o.append(i),o}function El(e){const t=e.querySelector("#tabs"),n=e.querySelector("#document-actions"),o=e.querySelector("#document-actions-toggle"),i=Array.from(n.querySelectorAll("button"));for(const a of i){const f=document.createElement("span");f.className="document-action-label",f.textContent=a.getAttribute("aria-label"),a.append(f)}let s=!1;const r=(a=!1)=>{s=!1,e.dataset.actionsOpen="false",o.setAttribute("aria-expanded","false"),a&&!o.hidden&&o.focus({preventScroll:!0})},l=()=>i.filter(a=>!a.hidden&&!a.disabled),u=()=>{const a=e.dataset.actionsMode,f=document.activeElement;e.dataset.actionsMode="inline";const p=(t.querySelector(".tab.active")||t.firstElementChild)?.getBoundingClientRect().width||0,g=n.getBoundingClientRect().width+p,m=i.some(h=>!h.hidden)&&e.clientWidth>0&&g>e.getBoundingClientRect().width;e.dataset.actionsMode=m?"menu":"inline",o.hidden=!m,(!m||a!==e.dataset.actionsMode)&&(r(),m&&n.contains(f)?o.focus({preventScroll:!0}):!m&&f===o&&l()[0]?.focus({preventScroll:!0}))},c=(a=!1)=>{if(o.hidden)return;s=!0,e.dataset.actionsOpen="true",o.setAttribute("aria-expanded","true");const f=l();(a?f.at(-1):f[0])?.focus({preventScroll:!0})};return o.onclick=()=>s?r(!0):c(),o.onkeydown=a=>{(a.key==="ArrowDown"||a.key==="ArrowUp")&&(a.preventDefault(),c(a.key==="ArrowUp"))},n.addEventListener("keydown",a=>{if(!s)return;const f=l(),d=f.indexOf(document.activeElement);let p;a.key==="ArrowDown"&&(p=(d+1)%f.length),a.key==="ArrowUp"&&(p=(d+f.length-1)%f.length),a.key==="Home"&&(p=0),a.key==="End"&&(p=f.length-1),p!==void 0&&(a.preventDefault(),f[p]?.focus())}),document.addEventListener("keydown",a=>{s&&a.key==="Escape"&&(a.preventDefault(),a.stopImmediatePropagation(),r(!0))},!0),document.addEventListener("pointerdown",a=>{s&&!n.contains(a.target)&&!o.contains(a.target)&&r()}),document.addEventListener("focusin",a=>{s&&!n.contains(a.target)&&a.target!==o&&r()}),n.addEventListener("click",a=>{const f=a.target.closest("button");s&&f&&!f.disabled&&r(!0)},!0),r(),u(),window.addEventListener("resize",u),typeof ResizeObserver<"u"&&new ResizeObserver(u).observe(e),new MutationObserver(u).observe(n,{subtree:!0,attributes:!0,attributeFilter:["hidden"]}),document.fonts?.ready.then(u),document.fonts?.addEventListener("loadingdone",u),{update:u,close:r}}function Cl(e){const t=e.querySelector("strong"),n=Array.from(e.querySelectorAll(":scope > button, :scope > a")),o=()=>{e.classList.remove("header-icons-only");const i=getComputedStyle(e),s=parseFloat(i.columnGap)||0,r=parseFloat(i.paddingLeft)+parseFloat(i.paddingRight),l=n.reduce((c,a)=>c+a.getBoundingClientRect().width,0)+s*n.length+r,u=l+t.getBoundingClientRect().width+s;t.classList.toggle("header-title-hidden",!t.querySelector("select")&&u>e.clientWidth),e.classList.toggle("header-icons-only",l>e.clientWidth)};if(o(),window.addEventListener("resize",o),typeof ResizeObserver<"u"){const i=new ResizeObserver(o);[e,t,...n].forEach(s=>i.observe(s))}document.fonts?.ready.then(o),document.fonts?.addEventListener("loadingdone",o)}const io="http://www.w3.org/2000/svg",Ol="http://www.w3.org/1999/xhtml",Po=24,Sr=8192,jl=16e6,Nl=8e6,Ml=4e3,Ll=1e6,Zi="グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。";function Rl(e){if(!e.length)throw Error("画像にする項目がありません。");if(e.some(a=>![a.x,a.y,a.width,a.height].every(Number.isFinite)||a.width<0||a.height<0))throw Error("図の範囲を読み取れませんでした。");let t=1/0,n=1/0,o=-1/0,i=-1/0;for(const a of e)t=Math.min(t,a.x),n=Math.min(n,a.y),o=Math.max(o,a.x+a.width),i=Math.max(i,a.y+a.height);const s=Math.floor(t)-Po,r=Math.floor(n)-Po,l=Math.ceil(o)-s+Po,u=Math.ceil(i)-r+Po,c=Math.min(2,Sr/l,Sr/u,Math.sqrt(jl/(l*u)));if(c<1)throw Error(Zi);return{bounds:{x:s,y:r,width:l,height:u},width:Math.floor(l*c),height:Math.floor(u*c),scale:c}}const Dl="display position top right bottom left width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility".split(" ");function xr(e){const t=e.cloneNode(!0),n=[e,...Array.from(e.querySelectorAll("*"))],o=[t,...Array.from(t.querySelectorAll("*"))];return n.forEach((i,s)=>{const r=o[s],l=getComputedStyle(i);r.removeAttribute("style");for(const u of Dl){const c=l.getPropertyValue(u);c&&!/url\s*\(/i.test(c)&&r.style.setProperty(u,c)}for(const u of Array.from(r.attributes))(u.name.startsWith("data-")||u.name.startsWith("on")||["tabindex","role","aria-label","aria-hidden"].includes(u.name))&&r.removeAttribute(u.name)}),t}function Tl(e,t,n){if(e.querySelectorAll("*").length+t.querySelectorAll("*").length>Ml||(e.textContent?.length??0)+(t.textContent?.length??0)>Ll)throw Error(Zi);const o=Array.from(e.querySelectorAll(":scope > .node")),i=o.map(m=>({x:parseFloat(m.style.left),y:parseFloat(m.style.top),width:m.offsetWidth,height:m.offsetHeight}));for(const m of o)for(const h of Array.from(m.querySelectorAll(".finding-badges")))i.push({x:parseFloat(m.style.left)+m.clientLeft+h.offsetLeft,y:parseFloat(m.style.top)+m.clientTop+h.offsetTop,width:h.offsetWidth,height:h.offsetHeight});if(!o.length)throw Error("画像にする項目がありません。");const s=e.ownerDocument,r=Array.from(t.children).map(xr),l=r.filter(m=>m.matches(".edge,.edge-label"));if(l.length){const m=s.createElementNS(io,"svg");m.setAttribute("viewBox","0 0 1 1"),m.setAttribute("width","1"),m.setAttribute("height","1"),m.setAttribute("aria-hidden","true"),m.style.cssText="position:fixed;inset:0;width:1px;height:1px;opacity:0;overflow:hidden;pointer-events:none;contain:strict",m.append(...l),s.body.append(m);try{for(const h of l){const x=h.getBBox();i.push({x:x.x-12,y:x.y-12,width:x.width+24,height:x.height+24})}}finally{m.remove()}}const u=Rl(i),c=s.createElementNS(io,"svg");c.setAttribute("width",String(u.width)),c.setAttribute("height",String(u.height)),c.setAttribute("viewBox",`0 0 ${u.bounds.width} ${u.bounds.height}`);const a=s.createElementNS(io,"rect");a.setAttribute("width","100%"),a.setAttribute("height","100%"),a.setAttribute("fill",n),c.append(a);const f=s.createElementNS(io,"g");f.setAttribute("transform",`translate(${-u.bounds.x} ${-u.bounds.y})`);for(const m of r)f.append(m);c.append(f);const d=s.createElementNS(io,"foreignObject");d.setAttribute("width",String(u.bounds.width)),d.setAttribute("height",String(u.bounds.height));const p=s.createElementNS(Ol,"div");p.style.cssText=`position:relative;width:${u.bounds.width}px;height:${u.bounds.height}px;`;for(const m of o){const h=xr(m);h.querySelector(".activity-open,.object-open")?.remove(),h.style.left=parseFloat(m.style.left)-u.bounds.x+"px",h.style.top=parseFloat(m.style.top)-u.bounds.y+"px",p.append(h)}d.append(p),c.append(d);const g=new XMLSerializer().serializeToString(c);if(new TextEncoder().encode(g).length>Nl)throw Error(Zi);return{svg:g,...u}}function Pl(e){return"alder-"+(Array.from(e.normalize("NFKC").replace(/\.(?:md|markdown)$/i,"").replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,"_").replace(/^\.+|[.\s]+$/g,"")).slice(0,80).join("")||"graph")+".png"}async function ba(e){const t=document.createElement("canvas"),n=new Image;try{await new Promise((i,s)=>{const r=window.setTimeout(()=>{n.onload=n.onerror=null,n.src="",s(Error("画像の生成が時間内に終わりませんでした。"))},15e3);n.onload=()=>{clearTimeout(r),i()},n.onerror=()=>{clearTimeout(r),s(Error("このブラウザーでは画像を生成できませんでした。"))},n.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(e.svg)}),t.width=e.width,t.height=e.height;const o=t.getContext("2d");if(!o)throw Error("画像用のメモリを確保できませんでした。");return o.drawImage(n,0,0,e.width,e.height),await new Promise((i,s)=>{const r=window.setTimeout(()=>s(Error("PNG画像の生成が時間内に終わりませんでした。")),15e3);try{t.toBlob(l=>{clearTimeout(r),l?i(l):s(Error("PNG画像を生成できませんでした。"))},"image/png")}catch(l){clearTimeout(r),s(l)}})}finally{n.onload=n.onerror=null,n.src="",t.width=t.height=0}}async function ql(e,t){const n=await ba(e),o=URL.createObjectURL(n),i=document.createElement("a");try{i.href=o,i.download=Pl(t),i.hidden=!0,document.body.append(i),i.click()}finally{i.remove(),window.setTimeout(()=>URL.revokeObjectURL(o),1500)}}async function Wl(e){if(!window.isSecureContext||!navigator.clipboard?.write||typeof ClipboardItem>"u"||ClipboardItem.supports?.("image/png")===!1)throw Error("このブラウザーではPNGをコピーできません。「PNG保存」で画像ファイルを保存してください。");const t=ba(e),n=t.catch(()=>{});try{await navigator.clipboard.write([new ClipboardItem({"image/png":t})]),await t}catch{throw Error("PNGをコピーできませんでした。ブラウザーの許可を確認するか、「PNG保存」で画像ファイルを保存してください。")}finally{await n}}function ga(e){return e.activities.flatMap(t=>[...(t.exception??"").matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((n,o)=>({id:zl(e.id,t.id,n[1]),activityId:t.id,name:n[1],description:n[2]})))}function zl(e,t,n){const o=JSON.stringify([e,t,n]);let i=2166136261,s=2246822507;for(const r of o)i=Math.imul(i^r.codePointAt(0),16777619)>>>0,s=Math.imul(s^r.codePointAt(0),3266489909)>>>0;return"exception-"+i.toString(16).padStart(8,"0")+s.toString(16).padStart(8,"0")}function ya(e,t,n){if(n==null||n==="-")return null;const o=e.exceptions.filter(i=>i.activityId===t&&i.name===n);return H(o.length===1,"Unknown or ambiguous State exception name: "+n),o[0].id}function va(e){H(["0.1","0.2","0.3"].includes(e.formatVersion),"Legacy JSON version required"),En(e),Jo(e);const t=structuredClone(e);t.formatVersion="0.4",t.diagnostics.push("旧JSON "+e.formatVersion+" の互換入力由来。業務意味・承認は未評価");for(const n of t.documents.filter(o=>o.kind==="businessDesign")){n.exceptions=ga(n),n.roles??=[],n.schemaVersion="0.3";for(const o of n.activities)Object.hasOwn(o,"roleId")||(o.roleId=null,t.diagnostics.push("Role未確定: "+o.id+" — "+o.who))}for(const n of t.documents.filter(o=>o.kind==="stateTransition")){const o=t.documents.find(i=>i.id===n.basedOn.documentId);n.schemaVersion="0.2";for(const i of n.transitions)i.exceptionId=ya(o,i.activityId,i.exception),delete i.exception,i.path==="exception"&&i.exceptionId===null&&t.diagnostics.push("例外参照未決: "+i.id)}return Jo(t),t}const Ar=(e,t=Object.keys(e))=>({type:"object",properties:e,required:t,additionalProperties:!1}),$l={anyOf:Ko.anyOf},Ul={type:"string",pattern:"^[A-Za-z0-9_-]+$"},Fl={type:"string",minLength:1,pattern:"\\S"},Vl={...Ar({format:{enum:["alder-named-plans"]},formatVersion:{enum:["1.0"]},plans:{type:"array",minItems:1,items:Ar({id:Ul,name:Fl,package:$l})}}),$defs:Ko.$defs};function Bl(e){En(e,Vl),H(e.plans.length>0,"At least one named plan is required");const t=new Set;for(const n of e.plans){H(!t.has(n.id),"Duplicate plan ID: "+n.id),t.add(n.id),H(n.name===n.name.trim()&&!/[\r\n]/.test(n.name),"Invalid plan name: "+n.id);try{Jo(n.package),n.package.formatVersion!=="0.4"&&va(n.package)}catch(o){throw Error("Plan "+n.id+": "+o.message,{cause:o})}}return{valid:!0,plans:e.plans.map(({id:n,name:o})=>({id:n,name:o}))}}const be=(e,t)=>{if(!e)throw new Error(t)},so=e=>typeof e=="string"&&!!e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),Pi=e=>!!e&&typeof e=="object"&&!Array.isArray(e),qo=(e,t)=>Object.keys(e).sort().join("|")===[...t].sort().join("|"),wa=e=>so(e)&&e===e.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&![`
`,"\r"," — "," → ","<!--"].some(t=>e.includes(t));function Hl(e){be(Pi(e),"Graph must be an object");const t=e;be(qo(t,["version","nodes","relations"])||qo(t,["version","nodes","relations","scope"]),"Invalid graph fields"),be(t.version===1,"Unsupported graph version"),"scope"in t&&be(so(t.scope),"Invalid scope"),be(Array.isArray(t.nodes)&&t.nodes.length,"Nodes required"),be(Array.isArray(t.relations),"Relations required");const n=new Map;for(const s of t.nodes){be(Pi(s),"Node must be an object");const r=s;be(r.type==="business"||r.type==="object","Invalid node type");const l=r.type==="business"?["id","type","name","why","when","who","where","result","scope"]:["id","type","name","scope","icon","information"];r.type==="business"&&("problem"in r||"pain_level"in r)&&(l.push("problem","pain_level"),be(["Low","Medium","High"].includes(String(r.pain_level)),"Invalid Pain level")),be(qo(r,l),"Invalid node fields"),be(Object.entries(r).every(([c,a])=>c==="scope"||c==="information"||so(a)),"Empty node text"),be(typeof r.scope=="boolean","Invalid node scope"),be(wa(r.name)&&r.id===r.name,"Node ID must equal visible name"),be(!n.has(r.id),"Duplicate node ID"),r.type==="object"&&(be(typeof r.icon=="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.icon),"Invalid Lucide icon"),be(Array.isArray(r.information)&&r.information.every(so),"Invalid information")),n.set(r.id,r.type)}be([...n.values()].includes("business"),"Activity required");const o={input:["object","business"],output:["business","object"],"business-exception":["business","business"],"object-exception":["object","object"]},i=new Set;for(const s of t.relations){be(Pi(s),"Relation must be an object");const r=s;be(qo(r,["kind","from","to","label"])&&Object.values(r).every(so),"Invalid relation fields");const l=o[r.kind];be(Array.isArray(l)&&n.has(r.from)&&n.has(r.to)&&n.get(r.from)===l[0]&&n.get(r.to)===l[1],"Invalid relation endpoints");const u=JSON.stringify([r.kind,r.from,r.to,r.label]);be(!i.has(u),"Duplicate relation"),i.add(u)}}function bn(e){return e.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)}function ao(e){const t=[];let n="";return bn(e).forEach((o,i)=>{const s=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(o);if(s){n?s[1][0]===n[0]&&s[1].length>=n.length&&!s[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")&&(n=""):n=s[1];return}!n&&/^#{1,6} /.test(o)&&t.push([i,o])}),be(!n,"Unclosed code fence"),t}function Yi(e,t,n,o=[]){const i=bn(e),s=ao(e),r=Object.create(null);return be(s.length&&!i.slice(0,s[0][0]).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),n+": fields required"),s.forEach(([l,u],c)=>{be(t.includes(u)&&!(u in r),n+": unsupported/duplicate "+u),r[u]=i.slice(l+1,s[c+1]?.[0]??i.length).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,""),be(r[u]||o.includes(u),n+": empty "+u)}),be(s.map(l=>l[1]).join("|")===t.join("|"),n+": invalid field order"),r}const Er=(e,t)=>{const n=Array.from(e),o=Array.from(t);for(let i=0;i<Math.min(n.length,o.length);i++){const s=n[i].codePointAt(0)-o[i].codePointAt(0);if(s)return s}return n.length-o.length};function Gl(e){const t=bn(e),n=ao(e).filter(([,i])=>i.startsWith("## ")),o=new Set;return be(n.length&&!t.slice(0,n[0][0]).join(`
`).trim(),"Findings require Finding sections"),n.map(([i,s],r)=>{const l=/^## Finding ([A-Za-z][A-Za-z0-9_-]{0,63})$/.exec(s);be(l,"Invalid Finding ID");const u=l[1];be(!o.has(u),"Duplicate Finding ID"),o.add(u);const c=Yi(t.slice(i+1,n[r+1]?.[0]??t.length).join(`
`),["### Kind","### Status","### Scope","### Targets","### Summary","### Content"],"Finding "+u);be(["question","correction"].includes(c["### Kind"]),"Invalid Finding Kind"),be(["open","resolved"].includes(c["### Status"]),"Invalid Finding Status"),be(["items","document","unassigned"].includes(c["### Scope"]),"Invalid Finding Scope");const a=c["### Targets"]==="(none)"?[]:bn(c["### Targets"]).filter(f=>f.trim()).map(f=>(be(f.startsWith("- ")&&wa(f.slice(2)),"Invalid Finding target"),f.slice(2)));return be(new Set(a).size===a.length,"Duplicate Finding target"),be(c["### Scope"]==="items"?a.length>0:c["### Targets"]==="(none)","Finding Scope and Targets disagree"),{id:u,kind:c["### Kind"],status:c["### Status"],scope:c["### Scope"],targets:a,summary:c["### Summary"],content:c["### Content"],unresolvedTargets:[]}})}function Kl(e,t){be(!e.includes("<!--"),"HTML comments are unsupported");const n=bn(e),o=ao(e).filter(d=>d[1].startsWith("# ")),i=/^# (Activity|Object) (\S.*)$/;be(o.length&&!i.test(o[0][1])&&!["# Scope","# Graph exceptions","# Findings"].includes(o[0][1]),"Document title required"),t?.document?.(o[0][1].slice(2),n.slice(o[0][0]+1,o[1]?.[0]??n.length).join(`
`).trim());let s=[];const r={version:1,nodes:[],relations:[]},l=Object.create(null),u=new Set;o.slice(1).forEach(([d,p],g)=>{const m=o[g+2]?.[0]??n.length,h=n.slice(d+1,m).join(`
`).replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");if(be(h,"Empty section "+p),p==="# Findings"){be(!u.has(p),"Duplicate Findings"),u.add(p),s=Gl(h);return}if(["# Scope","# Graph exceptions"].includes(p)){be(!u.has(p),"Duplicate "+p),u.add(p),p==="# Scope"?(be(!ao(h).length,"Scope must be prose"),r.scope=h):bn(h).filter(T=>T.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(T=>{const A=/^- (business-exception|object-exception) (.+?) → (.+?) — (\S.*)$/.exec(T);be(A,"Invalid exception"),r.relations.push({kind:A[1],from:A[2],to:A[3],label:A[4].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})});return}const x=i.exec(p);be(x,"Unsupported heading "+p);const C=x[1],v=x[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"");l[v]=n.slice(d,m).join(`
`);const M=T=>ao(h).some(A=>A[1]===T);if(C==="Object"){const T=["## Scope","## Icon"];M("## Information")&&T.push("## Information");const A=Yi(h,T,v);be(["true","false"].includes(A["## Scope"]),"Invalid Scope");const q=bn(A["## Information"]??"").filter(P=>P.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).map(P=>(be(/^- \S.*$/.test(P),"Invalid Information"),P.slice(2)));r.nodes.push({id:v,type:"object",name:v,scope:A["## Scope"]==="true",icon:A["## Icon"]==="(generic icon)"?"box":A["## Icon"],information:q});return}const I=["## Scope","## Why","## When"];M("## Exception When")&&I.push("## Exception When"),I.push("## Who","## Where","## How","### Input","### Procedure"),M("### Exception")&&I.push("### Exception"),I.push("### Output","## Result"),(M("## Problem")||M("## Pain level"))&&I.push("## Problem","## Pain level");const y=Yi(h,I,v,["## How"]);be(!y["## How"],"How must only contain fields"),be(["true","false"].includes(y["## Scope"]),"Invalid Scope"),t?.activity?.(v,y);const D={id:v,type:"business",name:v,scope:y["## Scope"]==="true",why:y["## Why"],when:y["## When"],who:y["## Who"],where:y["## Where"],result:y["## Result"]};"## Problem"in y&&(D.problem=y["## Problem"],D.pain_level=y["## Pain level"]),r.nodes.push(D);for(const[T,A]of[["## Exception When","business-exception"],["### Input","input"],["### Output","output"]])!(T in y)||A!=="business-exception"&&y[T]==="(none)"||bn(y[T]).filter(q=>q.replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")).forEach(q=>{const P=/^- (.+?) — (\S.*)$/.exec(q);be(P,"Invalid relation in "+v),r.relations.push({kind:A,from:A==="output"?v:P[1],to:A==="output"?P[1]:v,label:P[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,"")})})});const c=r.nodes.filter(d=>d.type==="business").map(d=>d.id);Hl(r),r.nodes.sort((d,p)=>Er(d.id,p.id)),r.relations.sort((d,p)=>{for(const g of["kind","from","to","label"]){const m=Er(d[g],p[g]);if(m)return m}return 0});const a=new Set(r.nodes.map(d=>d.id));for(const d of s)d.unresolvedTargets=d.targets.filter(p=>!a.has(p));return{graph:r,sections:l,markdown:e,activityOrder:c,findings:s}}const Jl=["id","from","activity","condition","to","effect","path","evidence","note"],Xe=(e,t)=>{if(!e)throw Error(t)},Wo=e=>typeof e=="string"&&!!e.trim();function _l(e,t){try{const n=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(e.trim());Xe(n,"state-meta と遷移表が必要です");const o=ta(n[1]);Xe(o&&typeof o=="object"&&!Array.isArray(o),"メタ情報が不正です"),Xe(Object.keys(o).sort().join("|")===["object","states","start","terminal","completeness","source"].sort().join("|"),"メタ情報の項目が不正です"),Xe(o.object===t,"対象Objectが一致しません"),Xe(Array.isArray(o.states)&&o.states.length>0&&o.states.every(c=>Wo(c)&&!c.startsWith("@"))&&new Set(o.states).size===o.states.length,"状態一覧が不正です"),Xe(o.start==="@new"&&o.terminal==="@unknown"&&o.completeness==="partial"&&Wo(o.source),"開始・終端・部分定義の宣言が不正です");const i=n[2].trim().split(/\r?\n/),s=c=>(Xe(c.startsWith("|")&&c.endsWith("|"),"表の行が不正です"),c.slice(1,-1).split("|").map(a=>a.trim())),r=s(i[0]);Xe([Jl,["id","from","activity","event","condition","to","effect","path","evidence","note"],["id","from","activity","exception","condition","to","effect","path","evidence","note"]].some(c=>r.join("|")===c.join("|")),"表の列名が不正です"),Xe(s(i[1]).length===r.length&&s(i[1]).every(c=>/^-+$/.test(c)),"表の区切りが不正です"),Xe(i.length<=1002,"遷移は1000行以内にしてください");const l=new Set,u=i.slice(2).map(c=>{const a=s(c);Xe(a.length===r.length&&a.every(Wo),"表の列数・空欄が不正です");const f=Object.fromEntries(r.map((d,p)=>[d,a[p]]));return Xe(/^T[0-9]+$/.test(f.id)&&!l.has(f.id),"遷移IDが不正または重複しています"),l.add(f.id),Xe([...o.states,"@new"].includes(f.from)&&[...o.states,"@unknown","@none"].includes(f.to),"未登録の状態が参照されています"),Xe(["change","unchanged","no-create","constraint"].includes(f.effect)&&["normal","exception"].includes(f.path),"効果・経路の指定が不正です"),r.includes("exception")&&Xe(f.path==="normal"?f.exception==="-":Wo(f.exception)&&f.exception!=="-","通常は例外名なし、例外は名前が必要です"),Xe(f.effect!=="unchanged"||f.from===f.to,"状態不変の元と先が一致しません"),Xe(f.effect!=="change"||!f.to.startsWith("@")&&f.from!==f.to,"状態変更の遷移先が不正です"),Xe(f.effect!=="no-create"||f.from==="@new"&&f.to==="@none","不成立の元と先が不正です"),Xe(f.effect!=="constraint"||f.to==="@unknown","未決の制約は遷移先未決としてください"),f});return{model:{...o,transitions:u}}}catch(n){return{error:n instanceof Error?n.message:"状態遷移の宣言が不正です"}}}const Cr=(e,t)=>{const n=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(e);return n?t?n[1][0]===t[0]&&n[1].length>=t.length&&!n[2].trim()?"":t:n[1]:t};function Xl(e){const t=[];let n=null;const o=e.split(/\r?\n/),i=[];let s="";for(let r=0;r<o.length;r++){const l=o[r];if(!s&&/^# Object /.test(l)?n=l.slice(9):!s&&/^# /.test(l)&&(n=null),!s&&l==="## State Transitions"){if(!n)throw Error("State Transitions must belong to an Object");const u=[];let c="";for(r++;r<o.length;r++){const f=o[r];if(!c&&/^#{1,2} /.test(f)){r--;break}u.push(f),c=Cr(f,c)}const a=_l(u.join(`
`),n);if(a.error)throw Error(a.error);t.push(a.model);continue}i.push(l),s=Cr(l,s)}if(new Set(t.map(r=>r.object)).size!==t.length)throw Error("Duplicate Object state declaration");return{markdown:i.join(`
`),declarations:t}}function Zl(e){const t=/^## State Transitions$/m.test(e)?Xl(e):{markdown:e,declarations:[]};let n="",o="";const i=new Map,s=Kl(t.markdown,{activity:(u,c)=>i.set(u,c),document:(u,c)=>{n=u,o=c}}),r={id:"legacy-business-design",kind:"businessDesign",revision:"unversioned",title:n,preface:o,scope:s.graph.scope??"",objects:s.graph.nodes.filter(u=>u.type==="object").map(u=>({id:u.id,name:u.name,scope:u.scope,icon:String(u.icon),information:u.information})),activities:(s.activityOrder??[]).map(u=>{const c=s.graph.nodes.find(f=>f.id===u),a=i.get(u);return{id:u,name:c.name,scope:c.scope,why:String(c.why),when:String(c.when),who:String(c.who),where:String(c.where),procedure:a["### Procedure"],exception:a["### Exception"]??null,result:String(c.result),problem:c.problem===void 0?null:String(c.problem),painLevel:c.pain_level===void 0?null:String(c.pain_level)}}),relations:s.graph.relations.map((u,c)=>({id:"legacy-relation-"+c,kind:u.kind,fromId:u.from,toId:u.to,label:u.label})),findings:(s.findings??[]).map(u=>({...u,sourceId:u.id,targetIds:u.targets.filter(c=>s.graph.nodes.some(a=>a.id===c))}))};r.exceptions=ga(r);const l=t.declarations.map((u,c)=>({id:"legacy-state-"+c,kind:"stateTransition",revision:"unversioned",basedOn:{documentId:r.id,revision:r.revision,verification:"unverified"},objectId:u.object,states:u.states.map(a=>({id:a,name:a})),start:u.start,terminal:u.terminal,completeness:u.completeness,source:u.source,transitions:u.transitions.map(a=>({id:a.id,sourceId:a.id,fromId:a.from,toId:a.to,activityId:a.activity,exceptionId:ya(r,a.activity,a.exception),event:a.event??null,condition:a.condition,effect:a.effect,path:a.path,evidence:a.evidence,note:a.note}))}));return{original:{format:"markdown",text:e},data:{version:1,formatVersion:"legacy-input",revision:"unversioned",business:r,checks:[],states:l,diagnostics:[]}}}function Yl({data:e,original:t,namedPlans:n}){if(e.version!==1)throw Error("Unsupported Viewer document version");const o=na({formatVersion:"0.4",documents:[e.business,...e.checks,...e.states,...e.concepts??[]],sources:e.sources??[],externalDocuments:e.externalDocuments??[],diagnostics:e.diagnostics},{allowUnresolvedFindings:!0});e={...e,diagnostics:[...new Set(o.diagnostics)]};const i=e.business,s=[...i.objects,...i.activities],r=c=>i.roles?.find(a=>a.id===c.roleId)?.name??c.who,l=[...i.objects.map(c=>({...c,type:"object"})),...i.activities.map(c=>({id:c.id,type:"business",name:c.name,scope:c.scope,why:c.why,when:c.when,who:r(c),where:c.where,result:c.result,...c.problem===null?{}:{problem:c.problem,pain_level:c.painLevel}}))],u=Object.assign(Object.create(null),Object.fromEntries(e.states.filter(c=>c.basedOn.documentId===i.id).map(c=>{const a=new Map(c.states.map(d=>[d.id,d.name])),f={object:s.find(d=>d.id===c.objectId).name,states:c.states.map(d=>d.name),start:c.start,terminal:c.terminal,completeness:c.completeness,source:c.source,transitions:c.transitions.map(d=>({id:d.sourceId,from:a.get(d.fromId)??d.fromId,to:a.get(d.toId)??d.toId,activity:d.activityId,...d.event?{event:d.event}:{},...d.exceptionId?{exceptionId:d.exceptionId,exception:i.exceptions?.find(p=>p.id===d.exceptionId)?.name}:{},condition:d.condition,...d.conditionLabel?{conditionLabel:d.conditionLabel}:{},effect:d.effect,path:d.path,evidence:d.evidence,note:d.note}))};return[c.objectId,{model:f}]})));return{graph:ca({version:1,...i.scope?{scope:i.scope}:{},nodes:l,relations:i.relations.map(c=>({kind:c.kind,from:c.fromId,to:c.toId,label:c.label}))}),sections:Object.fromEntries(l.map(c=>[c.id,""])),markdown:t.text,...t.format==="json"?{sourceFormat:"json"}:{},...n?{namedPlans:n}:{},model:e,activityOrder:i.activities.map(c=>c.id),objectStateTransitions:u,findings:i.findings.map(c=>({...c,displayId:c.sourceId,targets:[...c.targetIds,...c.unresolvedTargets],targetNames:[...c.targetIds,...c.unresolvedTargets].map(a=>s.find(f=>f.id===a)?.name??a)}))}}const ka=8*1024*1024;function Ia(e){return/^\s*[\[{]/.test(e)}function Qi(e){const t=[e];let n=0;for(;t.length;){const o=t.pop();if(o&&typeof o=="object"){if(++n>1e5)throw Error("JSONの構造が表示上限を超えています。");for(const i of Object.values(o))i&&typeof i=="object"&&t.push(i)}}for(const o of Array.isArray(e?.documents)?e.documents:[])if(o&&typeof o=="object"&&o.kind==="businessDesign"&&((o.objects?.length??0)+(o.activities?.length??0)>2e3||(o.relations?.length??0)>5e3))throw Error("図の表示上限は2000要素・5000関係です。")}function Or(e,t){if(!e||e.formatVersion!=="0.4")throw Error("JSON専用経路はformatVersion 0.4が必要です（旧形式は互換入力adapter）。");Qi(e);const n=Jo(e),o=e.documents.filter(s=>s.kind==="businessDesign");if(o.length!==1)throw Error("このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。");const i=o[0];return{original:{format:"json",text:t},data:{version:1,formatVersion:e.formatVersion,revision:e.revision,business:i,checks:e.documents.filter(s=>s.kind==="checkItems"),states:e.documents.filter(s=>s.kind==="stateTransition"),concepts:e.documents.filter(s=>s.kind==="conceptModel"),sources:e.sources,externalDocuments:e.externalDocuments,diagnostics:n.diagnostics}}}function Ql(e,t){if(!Ia(e)){if(t!==void 0)throw Error("案を含まない文書です。");return Zl(e)}if(new TextEncoder().encode(e).byteLength>ka)throw Error("ローカルJSONは8MiB以内にしてください。");let n=ta(e.replace(/^\uFEFF/,""));Qi(n);let o;if(n?.format==="alder-named-plans"){Bl(n);for(const r of n.plans)if(Qi(r.package),r.package.documents.filter(l=>l.kind==="businessDesign").length!==1)throw Error("業務案 "+r.id+" にはBusiness Designが1件必要です。");const i=t??n.plans[0].id,s=n.plans.find(r=>r.id===i);if(!s)throw Error("指定した業務案がありません: "+i);o={selected:i,choices:n.plans.map(({id:r,name:l})=>({id:r,name:l}))},n=s.package}else if(t!==void 0)throw Error("指定した業務案がありません: "+t);if(["0.1","0.2","0.3"].includes(n?.formatVersion)){const i=Or(va(n),e);if(["0.1","0.2"].includes(n.formatVersion)){const s=i.data.business;s.schemaVersion="0.1",delete s.roles;for(const r of s.activities)delete r.roleId;i.data.diagnostics=i.data.diagnostics.filter(r=>!r.startsWith("Role未確定:"))}return{...i,...o?{namedPlans:o}:{}}}return{...Or(n,e),...o?{namedPlans:o}:{}}}function rn(e,t){return Yl(Ql(e,t))}async function eu(e){const t=/\.json$/i.test(e.name)||/json/i.test(e.type);if(t&&e.size>ka)throw Error("ローカルJSONは8MiB以内にしてください。");const n=await e.text();if(t&&!Ia(n))throw Error("JSONファイルの本文を確認してください。");return rn(n)}const tu=(e,t)=>ks(e,t,!1);async function ks(e,t,n=!0){let o;try{o=new URL(e)}catch{throw Error("有効なHTTPS URLを入力してください。")}if(o.protocol!=="https:"||o.username||o.password)throw Error("認証情報を含まないHTTPS URLだけ使えます。");const i=new AbortController,s=()=>i.abort();t?.addEventListener("abort",s,{once:!0}),t?.aborted&&s();const r=setTimeout(s,3e4);try{const l=await fetch(o.href,{method:"GET",cache:"no-store",mode:"cors",credentials:"omit",referrerPolicy:"no-referrer",redirect:"error",signal:i.signal,headers:{Accept:n?"application/json, text/markdown;q=0.9, text/plain;q=0.8":"text/markdown, text/plain;q=0.9"}});if(!l.ok)throw Error("URL取得に失敗しました（HTTP "+l.status+"）。");const u=l.headers.get("content-type")?.toLowerCase()??"";if(u.includes("html")||!n&&u.includes("json")||u.includes("xml"))throw Error("HTML等の表示ページではなくMarkdown本文URLを指定してください。");const c=2*1024*1024;if(Number(l.headers.get("content-length"))>c)throw Error("本文は2MiB以内にしてください。");const a=l.body?.getReader();if(!a)throw Error("本文を読み取れません。");let f=0,d="";const p=new TextDecoder;try{for(;;){const{done:g,value:m}=await a.read();if(g)break;if(f+=m.length,f>c){try{a.cancel().catch(()=>{})}catch{}throw Error("本文は2MiB以内にしてください。")}d+=p.decode(m,{stream:!0})}d+=p.decode()}finally{a.releaseLock()}if(n&&u.includes("json")&&!/^\s*[\[{]/.test(d))throw Error("JSONのMIMEと本文が一致しません。");if(/^\s*(?:<!doctype\s+html|<html|<head|<body)\b/i.test(d))throw Error("HTMLページは読み込めません。");return d}catch(l){const u=i.signal.aborted;throw s(),u?Error("取得を中止しました。時間を置いて明示的に再試行してください。"):l instanceof TypeError?Error("URLへ接続できません。匿名取得とCORS許可を確認してください。"):l}finally{clearTimeout(r),t?.removeEventListener("abort",s)}}const Yo=eu;async function ci(e,t){return rn(await ks(e,t))}function nu(e){if(new TextEncoder().encode(e).byteLength>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return rn(e)}const di=e=>e==="question"?"要確認":"要修正";function ou(e,t){const n=[];typeof t.problem=="string"&&n.push("困りごと");for(const o of["question","correction"]){const i=(e.findings??[]).filter(s=>s.status==="open"&&s.kind===o&&s.targets.includes(t.id)).length;i&&n.push(`${di(o)} ${i}`)}return n}function iu(e){const t=document.createElement("section");t.className="finding-card",t.dataset.findingId=e.id;const n=document.createElement("h3");n.textContent=`${di(e.kind)} · ${e.displayId??e.id}${e.status==="resolved"?" · 解消済み":""}`;const o=document.createElement("p");o.className="finding-summary",o.textContent=e.summary;const i=document.createElement("p");if(i.className="finding-target",i.textContent=e.scope==="document"?"対象：文書全体":e.scope==="unassigned"?"関連先：未設定":`対象：${(e.targetNames??e.targets).join("、")}`,t.append(n,o,i),e.unresolvedTargets.length){const s=document.createElement("p");s.className="finding-reference-warning",s.textContent=`参照先が見つかりません：${e.unresolvedTargets.join("、")}`,t.append(s)}return t.append(jn(e.content)),t}function su(e){return(e.findings??[]).filter(t=>t.status==="open").length+e.graph.nodes.filter(t=>typeof t.problem=="string").length}function ru(e,t,n){const o=document.createElement("nav");o.className="drawer-findings",o.setAttribute("aria-label","関連する指摘");for(const i of(e.findings??[]).filter(s=>s.status==="open"&&s.targets.includes(t))){const s=document.createElement("button");s.type="button",s.className="node-navigate",s.dataset.findingLink=i.id,s.textContent=`${di(i.kind)} · ${i.displayId??i.id}　${i.summary}`,s.onclick=()=>n({type:"finding",id:i.id}),o.append(s)}return o}function au(e,t,n,o,i){const s=document.createElement("section");s.className="findings-index";const r=document.createElement("label");r.className="finding-filter";const l=document.createElement("input");l.type="checkbox",l.checked=t,l.onchange=()=>n(l.checked),r.append(l,document.createTextNode("解消済みも表示")),s.append(r);const u=(a,f,d)=>{const p=document.createElement("button");p.className="node-navigate finding-index-row",p.dataset.findingKey=a.type+":"+a.id;const g=document.createElement("strong");g.textContent=f;const m=document.createElement("span");return m.textContent=d,p.append(g,m),p.onclick=()=>o(a),p},c=e.graph.nodes.filter(a=>(!i||a.id===i)&&typeof a.problem=="string");if(c.length){const a=document.createElement("h3");a.textContent="困りごと",s.append(a);for(const f of c)s.append(u({type:"problem",id:f.id},`${f.name}（${String(f.pain_level)}）`,String(f.problem)))}for(const[a,f]of[["items","項目に関連"],["document","文書全体"],["unassigned","関連先未設定"],["broken","参照先不一致"]]){const d=(e.findings??[]).filter(g=>(!i||g.targets.includes(i))&&(t||g.status==="open")&&(a==="broken"?g.unresolvedTargets.length>0:g.scope===a&&!g.unresolvedTargets.length));if(!d.length)continue;const p=document.createElement("h3");p.textContent=`${f}（${d.length}件）`,s.append(p);for(const g of d)s.append(u({type:"finding",id:g.id},`${di(g.kind)} · ${g.displayId??g.id}${g.status==="resolved"?" · 解消済み":""}`,g.summary))}if(s.childElementCount===1){const a=document.createElement("p");a.textContent="表示する指摘はありません。",s.append(a)}return s}function cu(e){const t=la(e.design);return Object.keys(e.positions).length===Object.keys(t).length&&Object.entries(t).every(([o,i])=>e.positions[o]?.every((s,r)=>s===i[r]))&&e.zoom===1&&e.scroll.every(o=>o===0)&&e.viewInset?.[0]===40&&e.viewInset[1]===0&&(!e.canvasOrigin||e.canvasOrigin.every(o=>o===0))?e:{...e,positions:t,...yc(),viewInset:[40,0],canvasOrigin:void 0}}function du(e,t){const n=new Set;if(!t)return n;const o=new Set(e.filter(i=>i.kind==="output").map(i=>JSON.stringify([i.to,i.from])));return e.forEach((i,s)=>{i.kind==="input"&&o.has(JSON.stringify([i.from,i.to]))&&n.add(s)}),n}function Is(e){let t;try{t=new URL(e)}catch{throw Error("共有元には有効なHTTPS URLが必要です。")}if(e!==e.trim()||/[\u0000-\u0020\u007f\\]/.test(e)||t.protocol!=="https:"||t.username||t.password||e.includes("?")||e.includes("#")||!/^https:\/\//i.test(e))throw Error("共有できるのは、認証情報・クエリ・フラグメントを含まないHTTPS URLだけです。");if(e.slice(e.indexOf("//")+2).split("/")[0].includes("@"))throw Error("認証情報を含むURLは共有できません。");return e}function lu(e){if(!e||e.source?.kind!=="url")return"「URLを開く」で取得した文書だけ共有できます。";try{Is(e.source.url)}catch(t){return t.message}if(e.edited===!0)return"編集を反映した文書は共有できません。「更新」で取得元から読み直してください。";if(e.draft!==void 0)return"未反映の編集があるため共有できません。編集を元に戻すか、取得元を「更新」してください。"}function uu(e,t){const n=new URL(e);return n.username="",n.password="",n.search="",n.hash="source="+encodeURIComponent(Is(t)),n.href}function fu(e){if(!/^#source(?:=|$)/.test(e))return;if(!e.startsWith("#source=")||e.slice(8).includes("&"))throw Error("共有リンクの形式が正しくありません。");let t;try{t=decodeURIComponent(e.slice(8))}catch{throw Error("共有リンクのURLを読み取れません。")}return Is(t)}const Ss=`# Alderを使った設計業務 — Business Design

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
`,pu=`{
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
`;function mu(e,t){const n=new Set(t.graph.nodes.map(d=>d.id)),o=new Map;for(const d of t.graph.nodes)o.set(d.name,o.has(d.name)?void 0:d.id);const i=d=>n.has(d)?d:o.get(d),s=Object.create(null);for(const[d,p]of Object.entries(e.positions)){const g=i(d);g&&(s[g]=p)}const{scroll:r,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:a,selectedEdgesOnly:f}=e;return{positions:s,scroll:r,zoom:l,viewInset:u,canvasOrigin:c,showExceptions:a,selectedEdgesOnly:f,selected:e.selected?i(e.selected):void 0,...e.hiddenNodes===void 0?{}:{hiddenNodes:[...new Set(e.hiddenNodes.flatMap(d=>{const p=i(d);return p?[p]:[]}))]}}}const hu=`# Alderのチェックリストサンプル

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
`;function bu(e,t,n,o,i=()=>!0,s=()=>{}){const r=e.ownerDocument,l=r.defaultView;let u,c=0,a=0,f=!1,d=null,p="";const g=new Map,m=()=>{u!==void 0&&(l.clearTimeout(u),c=Math.max(0,c-(Date.now()-a)),u=void 0)},h=(v=!1)=>{if(v&&!i())return;m(),g.delete(p);const M=[...g].at(-1);if(M){C(M[1],"error",M[0]);return}const I=e.contains(r.activeElement);e.hidden=!0,t.textContent="",s(),I&&(d?.isConnected?d:o).focus({preventScroll:!0})},x=()=>{e.hidden||e.dataset.kind==="error"||f||r.hidden||e.contains(r.activeElement)||(m(),a=Date.now(),u=l.setTimeout(h,c))};e.addEventListener("pointerenter",()=>{f=!0,m()}),e.addEventListener("pointerleave",()=>{f=!1,x()}),e.addEventListener("focusin",v=>{const M=v.relatedTarget;M&&!e.contains(M)&&(d=M),m()}),e.addEventListener("focusout",()=>l.setTimeout(x,0)),e.addEventListener("keydown",v=>{v.key==="Escape"&&(v.preventDefault(),v.stopPropagation(),h(!0))}),r.addEventListener("visibilitychange",()=>r.hidden?m():x()),n.onclick=()=>h(!0);const C=(v,M,I)=>{m(),e.contains(r.activeElement)||(d=r.activeElement),p=I,e.dataset.kind=M,e.dataset.key=I,t.setAttribute("role",M==="error"?"alert":"status"),t.setAttribute("aria-live",M==="error"?"assertive":"polite"),t.setAttribute("aria-atomic","true"),e.hidden=!1,t.textContent=v,s(),c=M==="warning"?8e3:5e3,x()};return(v,M="success",I="operation")=>{M==="error"&&v?(g.delete(I),g.set(I,v)):g.delete(I);const y=[...g].at(-1);if(y){if(!e.hidden&&t.textContent===y[1]&&p===y[0])return;C(y[1],"error",y[0]);return}if(!v){p===I&&h();return}!e.hidden&&t.textContent===v&&e.dataset.kind===M||C(v,M,I)}}const jr=pu,At=document.querySelector("#app");At.innerHTML='<header><button id="node-list-toggle" aria-label="一覧を開閉" aria-controls="node-list-drawer" aria-expanded="false"></button><strong id="header-title">Alder Viewer</strong><span id="preview-badge" hidden></span><span class="spacer"></span><button id="open-menu-toggle" type="button" aria-label="業務設計書を開く" title="業務設計書を開く"><span class="source-caption">開く</span></button><button id="theme" aria-label="テーマ切替"></button><button id="help-menu-toggle" type="button" aria-label="ヘルプ" title="ヘルプ（リンクは新しいタブで開きます）"></button><a id="github-link" href="https://github.com/mk3008/alder" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く" title="GitHubを開く"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a><button id="drawer" aria-label="Markdown開閉"></button></header><div class="tab-strip"><nav id="tabs" aria-label="図の表示タブ"></nav><button id="document-actions-toggle" type="button" aria-label="文書の操作" title="文書の操作" aria-expanded="false" aria-controls="document-actions" hidden>…</button><div id="document-actions" role="group" aria-label="選択中の文書の操作"><button id="refresh" type="button" aria-label="現在の文書を取得元から読み直す" title="現在の文書を取得元から読み直す" hidden></button><button id="save-image" class="png-action" type="button" aria-label="グラフ全体をPNGで保存" title="グラフ全体をPNGで保存" hidden></button><button id="copy-image" class="png-action" type="button" aria-label="グラフ全体をPNGでコピー" title="グラフ全体をPNGでコピー" hidden></button><button id="share-source" aria-label="取得元の共有リンクをコピー" title="取得元の共有リンクをコピー"></button><button id="open-checks" class="check-action" type="button" aria-label="チェックリストを開く" title="チェックリストを開く" hidden></button><button id="view-markdown" aria-label="原文を見る" title="原文を見る"></button></div></div><section id="status" class="info-bar" hidden><div class="info-content"><span id="status-text" role="status" aria-live="polite"></span></div><button id="status-close" aria-label="通知を閉じる">×</button></section><div class="workspace"><aside id="node-list-drawer" aria-label="項目一覧" hidden><div class="node-list-heading"><strong>一覧</strong><button id="node-list-close" aria-label="一覧を閉じる"></button></div><div id="drawer-modes" role="tablist" aria-label="一覧の表示"></div><div id="node-categories" role="tablist" aria-label="項目の種類"></div><label class="node-search-label" for="node-list-search">名前で検索</label><input id="node-list-search" type="search" placeholder="名前で検索" autocomplete="off"><div class="scope-bulk"><button id="scope-outside" aria-label="スコープ外を非表示" aria-pressed="true"></button><span>スコープ外</span><small id="scope-count"></small></div><div id="node-list" role="tabpanel" aria-label="Activity一覧"></div></aside><main><div class="toolbar" aria-label="図の表示設定" data-settings-open="false"><button id="display-settings-toggle" type="button" aria-label="表示設定を開く" aria-controls="display-options" aria-expanded="false" title="表示設定を開く"></button><div id="display-options" class="display-options" hidden><label class="edge-option"><input id="show-outside" type="checkbox" checked>スコープ外を表示</label><label class="edge-option" title="同じActivityとObjectの間にReadとWriteがあるとき、Readだけを非表示にします。Read単独は残します。"><input id="prefer-write" type="checkbox">Writeを優先表示する</label><label class="edge-option" title="Activity間とObject間の例外線とラベルを表示します。"><input id="show-exceptions" type="checkbox" checked>例外線を表示</label><label class="edge-option" title="項目を選択すると、その項目に直接つながる線とラベルだけを表示します。未選択時はすべて表示します。"><input id="selected-edges-only" type="checkbox">選択した項目の結線だけ表示</label><div class="graph-actions"><button id="reset-layout" class="graph-action" type="button"><span>レイアウトを初期値に戻す</span></button></div></div><button id="layout-lock" aria-label="配置ロック" aria-pressed="true" title="配置をロック中。項目の上から図をスクロールできます。"></button><button id="out" aria-label="縮小"></button><span id="zoom"></span><button id="in" aria-label="拡大"></button></div><div id="viewport" tabindex="0" aria-label="業務図"><div id="canvas"><svg id="edges"></svg><div id="nodes"></div></div><div id="empty"><section id="opening-guide" class="empty-guide" aria-labelledby="opening-title"><h2 id="opening-title">業務設計書を開くには</h2><p>業務設計書（Business Design、JSON形式）を開くと、業務のつながりを図で確認できます。既存のMarkdownも開けます。ファイル、URL、テキスト入力から開き方を選べます。</p><div class="empty-actions"><button id="guide-open" type="button">ファイルを開く</button><button id="guide-open-url" type="button">URLを開く</button><button id="guide-open-text" type="button">テキストで入力する</button></div><p>業務設計書が手元にない場合は、まず表示を試してみてください。<br><a id="open-sample" href="#alder-sample">サンプルを開く</a></p></section><section id="authoring-guide" class="empty-guide" aria-labelledby="authoring-title"><h2 id="authoring-title">業務設計書を作るには</h2><p>Alderプラグインにヒアリングメモ・議事録・発言内容を渡し、「このヒアリング結果をAlder業務設計書にして」と依頼すると、JSONの草案を作れます。</p><p>草案は依頼者と合意する前にレビューしてください。作成した業務設計書をこのViewerで開くと、図で確認できます。</p><a href="https://github.com/mk3008/alder/blob/main/README.ja.md" target="_blank" rel="noopener noreferrer">導入・作成手順を読む（日本語・新しいタブ）</a></section></div></div></main><aside id="formattedMarkdownDrawer" aria-label="選択項目のMarkdown"><div id="resize" role="separator" aria-label="Markdown幅" aria-orientation="vertical" tabindex="0"></div><div id="detail"></div></aside></div><section id="source-dialog" role="dialog" aria-modal="false" aria-labelledby="source-title" hidden><h2 id="source-title"></h2><label id="url-label" for="source-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="source-url" type="url" autocomplete="off" spellcheck="false"><label id="text-label" for="source-text">Business Design（Markdown / JSON）</label><textarea id="source-text" rows="12" spellcheck="false"></textarea><p id="source-help"></p><div class="source-actions"><button id="source-submit">表示</button><button id="source-cancel">キャンセル</button></div></section><input id="fallback" type="file" accept=".md,.markdown,.json,application/json,text/markdown,text/plain" hidden>';let He;const k=e=>document.getElementById(e),Vn=ua(location.pathname);Vn.version&&(k("preview-badge").hidden=!1,k("preview-badge").textContent=`確認用 · ${Vn.version}`,k("preview-badge").title=`PR #${Vn.pr} の確認版。本番とは別に、このブラウザーへ表示状態を保存します。`);const ho=e=>Dn(e,{"stroke-width":1.8,"aria-hidden":"true"}),ko=document.createElement("div");ko.id="source-menu";ko.innerHTML='<button id="open" aria-label="ファイルを開く" title="ファイルを開く"><span class="source-caption">ファイルを開く</span></button><button id="open-url" aria-label="URLを開く" title="URLを開く"><span class="source-caption">URLを開く</span></button><button id="open-text" aria-label="テキストを入力" title="テキストを入力"><span class="source-caption">テキストを入力</span></button><button id="open-sample-menu" type="button">サンプルを開く</button>';At.append(ko);const li=document.createElement("div");li.id="checks-menu";li.innerHTML='<button id="check-open" type="button">ファイルを開く</button><button id="check-open-url" type="button">URLを開く</button><button id="check-open-sample" type="button">サンプルを開く</button><button id="check-close" type="button">チェックリストを閉じる</button>';At.append(li);const Mn=document.createElement("section");Mn.id="check-followup";Mn.hidden=!0;Mn.setAttribute("aria-labelledby","check-followup-title");Mn.innerHTML='<div><h2 id="check-followup-title">チェックリストも開きますか？</h2><p>この業務設計書に対応するチェック項目を、図と一緒に確認できます。</p></div><div class="check-followup-actions"><button id="check-followup-open" type="button">チェックリストを開く ▾</button><button id="check-followup-later" type="button">あとで</button></div>';document.querySelector(".workspace").before(Mn);const ui=document.createElement("div");ui.id="check-followup-menu";ui.innerHTML='<button id="check-followup-file" type="button">ファイルを開く</button><button id="check-followup-url" type="button">URLを開く</button><button id="check-followup-sample" type="button">サンプルを開く</button>';At.append(ui);const Ht=document.createElement("input");Ht.type="file";Ht.id="check-file";Ht.accept=".md,.markdown,text/markdown,text/plain";Ht.hidden=!0;At.append(Ht);const an=document.createElement("section");an.id="check-url-dialog";an.hidden=!0;an.setAttribute("role","dialog");an.setAttribute("aria-labelledby","check-url-title");an.innerHTML='<h2 id="check-url-title">チェックリストをURLから開く</h2><form id="check-url-form"><label for="check-url">匿名取得できるHTTPSの業務設計書本文URL（Markdown / JSON）</label><input id="check-url" type="url" required placeholder="https://…/checks.md"><div class="source-actions"><button id="check-url-submit" type="submit">開く</button><button id="check-url-cancel" type="button">キャンセル</button></div></form>';At.append(an);const fi=document.createElement("div");fi.id="help-menu";fi.innerHTML=`<a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/web-viewer/usage.ja.md" target="_blank" rel="noopener noreferrer">Viewerの使い方</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/README.ja.md" target="_blank" rel="noopener noreferrer">業務設計書・チェック項目を作る</a><a href="https://github.com/mk3008/alder/blob/${Vn.version??"main"}/docs/business-design-structure.ja.md" target="_blank" rel="noopener noreferrer">Markdownの書き方</a>`;At.append(fi);ai(k("help-menu-toggle"),fi);const co=document.createElement("div");co.id="url-history";ko.append(co);function gu(){if(co.replaceChildren(),!N.urlHistory?.length)return;const e=document.createElement("strong");e.textContent="URL閲覧履歴",co.append(e);for(const t of N.urlHistory){const n=document.createElement("button");n.type="button",n.setAttribute("role","menuitem"),n.textContent=t.name;const o=document.createElement("small");o.textContent=t.url,n.append(o),n.title=t.url,n.disabled=de||Re||le,n.onclick=()=>{yu(t.url)},co.append(n)}}async function yu(e){if(!(de||Re||le)){if(N.document?.source?.kind==="url"&&N.document.source.url===e){we(),He?.reopenBusinessOverview(),N.active=N.tabs[0].key,Oe(),Ao();return}Re=!0,Oe();try{const t=await ci(e),n=Xn({key:crypto.randomUUID(),name:new URL(e).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:e},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},t);await Io(n)}catch(t){t instanceof Rn||$e("履歴のURLを開けません。現在の表示は保持しています: "+t.message,"error")}finally{Re=!1,Oe()}}}const vu=ai(k("open-menu-toggle"),ko),wu=ai(k("open-checks"),li,()=>{const e=te();k("check-open-sample").hidden=!e||!Os(e),k("check-close").disabled=!e?.checks}),Sa=ai(k("check-followup-open"),ui,()=>{k("check-followup-sample").hidden=!te()||!Os(te())});for(const[e,t]of[["open-menu-toggle",Ys],["open",Ys],["open-url",vc],["open-text",wc],["view-markdown",kc],["open-checks",qr],["share-source",Ic],["refresh",Sc],["help-menu-toggle",xc],["drawer",Ac],["node-list-toggle",Ec],["node-list-close",Wr],["display-settings-toggle",zr],["reset-layout",Cc],["save-image",Oc],["copy-image",jc],["out",Fr],["in",Vr]])k(e).prepend(ho(t));Cl(document.querySelector("header"));const es=El(document.querySelector(".tab-strip"));let N={tabs:[],recovery:[],dark:!1,drawer:!0,width:380,preferWrite:!1,nodeDrawer:!1},Tt=!0,Qt=!1,de=!0,Jn=!1,Cn=!1,Re=!1,Nr=Promise.resolve(),gn,ve,Pt=0,le=!1,lo=!1,Bn=0,Qo=0,Hn=!1,xs=!1,ts=!1,Mr=!1;const ns=new Set,en=new Set,ei=new Set;function xa(e){const t="format"in e?[...e.document?[e.document]:[],...e.recovery]:e.tabs;for(const n of ei){const o=[...N.document?[N.document]:[],...N.recovery].find(s=>s.key===n),i=t.find(s=>s.key===n&&s.draft===o?.draft);o&&i&&ei.delete(n)}}const te=()=>N.tabs.find(e=>e.key===N.active),Ln=e=>nn(e)?.key??e.key,on=e=>N.document?.key===Ln(e);let os="";const ku=bu(k("status"),k("status-text"),k("status-close"),k("viewport"));function $e(e,t="success",n="operation"){if(n==="storage"){if(os===e)return;os=e}ku(e,t,n)}function As(){$e("前回の表示を復元できません。再読み込みして、もう一度お試しください。","error","storage")}function Es(){$e("別の画面で表示が変更されました。この画面では引き続き閲覧できます。最新の表示に切り替えるには再読み込みしてください。","error","storage")}function Jt(){de||(Pt++,tt())}function Iu(e){e.preventDefault(),e.returnValue=!0}function tt(){const e=Pt>Bn||Qo>0||!1||le||ei.size>0||ts||Hn||Cn,t=!de&&e;t!==Mr&&(Mr=t,window[t?"addEventListener":"removeEventListener"]("beforeunload",Iu));const n=de?"restoring":Jn?"protected":Cn?"conflict":Hn?"error":ts||ei.size>0?"draft":Qo>0||le?"saving":Pt>Bn?"dirty":xs?"saved":"unchanged";At.dataset.saveState!==n&&(At.dataset.saveState=n),Jn?As():Cn?Es():Hn?$e("表示を次回に引き継げません。この画面では引き続き閲覧できます。","error","storage"):$e("","success","storage"),mi()}function Cs(e){Hn=!0,os=""}function pi(){if(Jn)throw Error("前回の表示を復元できません。再読み込みして、もう一度お試しください。");if(Cn)throw new vs}async function Su(e){pi();try{await rl(e)}catch(t){throw t instanceof vs&&(Cn=!0,clearTimeout(gn),gn=void 0,Es()),t}}function Aa(e,t){Qo++,ns.add(t),tt();const n=Nr.catch(()=>{}).then(()=>Su(e)).then(()=>{Bn=Math.max(Bn,t),xs=!0,xa(e),Bn===Pt&&(Hn=!1)},o=>{throw Cs(),o}).finally(()=>{Qo--,ns.delete(t),tt()});return Nr=n.catch(()=>{}),n}function Ie(e=180,t=!0){if(de)return;if(t&&Pt++,clearTimeout(gn),gn=void 0,Jn){As(),tt();return}if(Cn){Es(),tt();return}if(le||ns.has(Pt)||!t&&Pt<=Bn&&!Hn){tt();return}const n=()=>{gn=void 0;let o;try{o=structuredClone(ws(N))}catch{Cs(),tt();return}Aa(o,Pt).catch(()=>tt())};e===0?n():gn=window.setTimeout(n,e),tt()}async function xu(e){if(de||ve||le||!N.tabs.includes(e))return;if(fo(e)===void 0){He?.closeBusinessOverview();return}bt.cancel(),we();const t=N.active===e.key,n={...N,tabs:N.tabs.filter(o=>o!==e),active:t?N.tabs[0]?.key:N.active};try{await So(()=>n,()=>{N=n}),t&&At.dataset.workspaceArea==="business"&&He?.businessActivated()}catch{tt()}}function lt(){k("drawer").setAttribute("aria-label","業務内容開閉"),k("formattedMarkdownDrawer").setAttribute("aria-label","選択項目の業務内容");const e=!!te(),t=e&&N.drawer,n=e&&!!N.nodeDrawer;document.querySelector(".toolbar").hidden=!e,e||(Qt=!1),mi(),k("layout-lock").replaceChildren(ho(Tt?$r:Ur)),k("layout-lock").setAttribute("aria-pressed",String(Tt)),k("layout-lock").title=Tt?"配置をロック中。項目の上から図をスクロールできます。":"配置を調整中。項目をドラッグして移動できます。",k("layout-lock").toggleAttribute("disabled",de),k("viewport").dataset.layoutLocked=String(Tt),k("prefer-write").checked=N.preferWrite===!0,k("prefer-write").disabled=de,k("show-exceptions").checked=te()?.showExceptions!==!1,k("show-exceptions").disabled=de||le||!te()||ve===te(),k("selected-edges-only").checked=te()?.selectedEdgesOnly===!0,k("selected-edges-only").disabled=de||le||!te()||ve===te(),document.documentElement.dataset.theme=N.dark?"dark":"light",k("theme").replaceChildren(ho(N.dark?Tc:Pc)),k("formattedMarkdownDrawer").hidden=!t,k("formattedMarkdownDrawer").style.width=Math.max(260,Math.min(N.width,innerWidth*.65))+"px",k("drawer").setAttribute("aria-expanded",String(t)),k("drawer").toggleAttribute("disabled",de||!e),k("node-list-drawer").hidden=!n||ut().mode!=="findings",k("node-list-toggle").setAttribute("aria-expanded",String(n)),k("node-list-toggle").toggleAttribute("disabled",de||!e),He?.syncChrome()}function is(){for(const e of["save-image","copy-image"]){const t=k(e);t.hidden=!te(),t.disabled=lo||de||!te()||ve===te(),t.setAttribute("aria-busy",String(lo))}}function mi(){is(),document.querySelector(".toolbar").dataset.settingsOpen=String(Qt),k("display-options").hidden=!Qt,k("reset-layout").disabled=de||Re||le||!1||!te()||en.has(N.document?.key??"")||Jn||Cn;const e=k("display-settings-toggle"),t=Qt?"表示設定を閉じる":"表示設定を開く",n=t;e.setAttribute("aria-expanded",String(Qt)),e.setAttribute("aria-label",n),e.title=n,e.disabled=de||le||!te()||ve===te()}function Ea(e,t=!1){const n=te();de||le||!n||ve===n||e===Qt||(e&&(_n.delete(nn(n)?.key??n.key),hi()),bt.cancel(),We=void 0,we(),Qt=e,mi(),Kt(n),!e&&(t||k("display-options").contains(document.activeElement))&&k("display-settings-toggle").focus({preventScroll:!0}))}async function Ca(e){const t=te();if(!(lo||de||!t||ve===t)){lo=!0,is();try{const n=Tl(k("nodes"),k("edges"),getComputedStyle(document.documentElement).getPropertyValue("--bg").trim());e?(await Wl(n),$e("グラフ全体のPNGをコピーしました。")):await ql(n,(nn(t)?.name??t.name)+(fo(t)?" - "+fo(t):""))}catch(n){$e((e?"画像をコピーできません: ":"画像を保存できません: ")+n.message,"error")}finally{lo=!1,is()}}}k("save-image").onclick=()=>Ca(!1);k("copy-image").onclick=()=>Ca(!0);k("display-settings-toggle").onclick=()=>Ea(!Qt);k("reset-layout").onclick=()=>{const e=te();if(de||Re||le||ve||!e||en.has(Ln(e)))return;try{pi()}catch{tt();return}bt.cancel(),hn.cancel(),We=void 0,we();const t={...e,design:si(e)},n=cu(t);n!==t&&(e.positions=n.positions,e.scroll=n.scroll,e.zoom=n.zoom,e.viewInset=n.viewInset,e.canvasOrigin=n.canvasOrigin),Ra.invalidate(e),Oe(),n!==t&&Ie()};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&Qt&&k("source-dialog").hidden&&(e.preventDefault(),Ea(!1,!0))});function we(e=!0){const t=te();if(!t)return!1;const n=[k("viewport").scrollLeft,k("viewport").scrollTop],o=t.scroll[0]!==n[0]||t.scroll[1]!==n[1];return t.scroll=n,o&&e&&(Jt(),Ie(180,!1)),o}function Oa(e){const t=document.activeElement,n=t?.closest(".tab")?.dataset.key,o=t?.classList.contains("close");e(),n&&Array.from(document.querySelectorAll(".tab")).find(i=>i.dataset.key===n)?.querySelector(o?".close":"button")?.focus({preventScroll:!0})}function ss(){vu.close(),wu.close(),Sa.close(),es.close(),Oa(Au),es.update()}function Au(){const e=k("tabs");e.replaceChildren(),N.tabs.forEach(t=>{const n=document.createElement("div");n.className="tab"+(t.key===N.active?" active":""),n.draggable=fo(t)!==void 0,n.dataset.key=t.key,n.dataset.viewKind="business",Xo(t)!==void 0&&(n.dataset.activity=Xo(t)),Zo(t)!==void 0&&(n.dataset.object=Zo(t));const o=document.createElement("button");Fi(o,"business",t.name),o.setAttribute("aria-current",String(t.key===N.active)),o.disabled=le,o.onclick=async()=>{if(le||qt&&qt!==t.key&&!await xo())return;const s=we()||N.active!==t.key;He?.activateBusiness(),N.active=t.key,Oe(),He?.businessActivated(),Ie(180,s)};const i=Vi("業務設計："+t.name+"を閉じる");i.disabled=le,i.onclick=()=>xu(t),n.append(o,i),n.ondragstart=s=>s.dataTransfer?.setData("text/plain",t.key),n.ondragover=s=>s.preventDefault(),n.ondrop=s=>{if(s.preventDefault(),le)return;const r=N.tabs.findIndex(u=>u.key===s.dataTransfer?.getData("text/plain")),l=N.tabs.indexOf(t);if(r>0&&l>0&&r!==l){const[u]=N.tabs.splice(r,1);N.tabs.splice(l,0,u),ss(),Ie()}},n.onkeydown=s=>{if(!le&&s.altKey&&(s.key==="ArrowLeft"||s.key==="ArrowRight")){s.preventDefault();const r=N.tabs.indexOf(t),l=r+(s.key==="ArrowLeft"?-1:1);r>0&&l>0&&l<N.tabs.length&&([N.tabs[r],N.tabs[l]]=[N.tabs[l],N.tabs[r]],ss(),Ie())}},e.append(n)})}const Lr=new Map,_n=new Set;function hi(){const e=te(),t=!!e&&e.design.sourceFormat!=="json"&&_n.has(nn(e)?.key??e.key)&&!e.checks;t||(Sa.close(),Mn.contains(document.activeElement)&&k("viewport").focus({preventScroll:!0})),Mn.hidden=!t;for(const n of["check-followup-open","check-followup-later"])k(n).disabled=de||Re||le||!1||!e||wn(e).busy===!0}k("check-followup-later").onclick=()=>{const e=te();e&&_n.delete(nn(e)?.key??e.key),hi()};let rs;for(const[e,t]of[["file","check-open"],["url","check-open-url"],["sample","check-open-sample"]])k("check-followup-"+e).onclick=()=>{rs=k("check-followup-open"),k(t).click(),rs=void 0};function Os(e){return e.source?.kind==="sample"&&!e.edited&&e.design.markdown===Ss}function wn(e){const t=nn(e)?.key??e.key;let n=Lr.get(t);return n||(n={},Lr.set(t,n)),n}async function js(e,t){if(!on(e))throw Error("原本文書が切り替わりました。");const n=Bt(N,N.recovery,{...N.document,checks:t},ws(N).views);await So(()=>n,()=>{N=n,t&&_n.delete(nn(e)?.key??e.key)})}async function ja(e,t){const n=wn(e);if(e.design.sourceFormat==="json"||n.busy||le||de||ve===e)return;const o=po(e);n.busy=!0,n.error=void 0,n.candidate=void 0,sn();try{const i=await t();if(!on(e))return;if(o!==po(N.tabs[0]))throw Error("読込中にBDが更新されました。関連Checkを再指定してください。");const s=Kn(i),r=mo(s,N.tabs[0]);if(r.state==="mismatch")throw Error("この業務設計書に対応するCheck Itemとは確認できません。"+r.reason);r.state==="unverified"?n.candidate=i:(await js(e,i),n.candidate=void 0,He?.openRelatedChecks(te()?.selected))}catch(i){n.error="関連Checkを読み込めません。現在の関連付けとBDは保持しています: "+i.message,$e(n.error,"error")}finally{n.busy=!1,sn()}}async function Na(e,t){const n=wn(e);if(n.busy||le||!on(e))return;const o=mo(Kn(t),N.tabs[0]);if(o.state==="mismatch"){n.error=o.reason,sn();return}n.busy=!0,n.error=void 0;try{await js(e,{...t,confirmedFor:po(N.tabs[0])}),n.candidate=void 0,He?.openRelatedChecks(te()?.selected)}catch(i){n.error="関連Checkを開けません: "+i.message}finally{n.busy=!1,sn()}}function sn(){hi();const e=te(),t=k("detail"),n=e?wn(e):void 0,o=e?e.key+":"+(e.selected??""):"";k("open-checks").disabled=de||le||ve===e||!e||n?.busy===!0;const i=t.contains(document.activeElement)?document.activeElement?.id:void 0,s=t.dataset.contentKey===o?t.scrollTop:0;if(t.replaceChildren(),t.dataset.contentKey=o,!e)return;const r=e.design.graph.nodes.find(f=>f.id===e.selected),l=Al(e,n,{disabled:de||le||ve===e,redraw:sn,confirm:f=>{Na(e,f)}}),u=document.createElement("div");u.className="right-drawer-heading";const c=id(r?.name??"業務設計");if(r){const f=r.type==="business"?Ma(String(r.who),r.id):Xr(r);f.classList.add("drawer-node-icon"),c.prepend(f)}u.append(c);const a=document.createElement("button");if(a.type="button",a.id="business-drawer-close",a.setAttribute("aria-label","右ドロワーを閉じる"),a.textContent="×",a.onclick=()=>{k("drawer").click(),k("drawer").focus({preventScroll:!0})},u.append(a),t.append(u),l.hasChildNodes()&&t.append(l),r){const f=ru(e.design,r.id,Ns);f.hasChildNodes()&&t.append(f)}t.append(Dd(e.design,r?.id)),r?.type==="business"&&He?.appendActivityTestLinks(t,r.id),t.scrollTop=s,i&&document.getElementById(i)?.focus({preventScroll:!0})}const Rr=new Map,ut=()=>{const e=N.active??"";let t=Rr.get(e);return t||(t={category:"activity",search:"",collapsed:new Set,mode:"items",resolved:!1},Rr.set(e,t)),t};function Ns(e){if(!te())return;const t=ut();t.mode="findings",t.finding=e,N.nodeDrawer=!0,innerWidth<=800&&(N.drawer=!1),lt(),xt(),k("node-list").querySelector(".finding-back")?.focus({preventScroll:!0}),Ie()}function Eu(e){const t=te();if(!t)return;const n=ut();n.mode="findings",n.filterNode=e,n.finding=void 0;const o=(t.design.findings??[]).filter(i=>i.status==="open"&&i.targets.includes(e)).map(i=>({type:"finding",id:i.id}));if(t.design.graph.nodes.some(i=>i.id===e&&typeof i.problem=="string")&&o.unshift({type:"problem",id:e}),o.length===1){Ns(o[0]);return}N.nodeDrawer=!0,innerWidth<=800&&(N.drawer=!1),lt(),xt(),k("drawer-mode-findings").focus({preventScroll:!0}),Ie()}function Cu(e,t){const n=ut().finding;if(!n)return!1;const o=n.type==="finding"?e.design.findings?.find(l=>l.id===n.id):void 0,i=n.type==="problem"?e.design.graph.nodes.find(l=>l.id===n.id&&typeof l.problem=="string"):void 0;if(!o&&!i)return ut().finding=void 0,!1;const s=document.createElement("button");if(s.className="node-navigate finding-back",s.textContent="← 指摘一覧に戻る",s.onclick=()=>{ut().finding=void 0,xt(),k("drawer-mode-findings").focus({preventScroll:!0})},t.append(s),o)t.append(iu(o));else{const l=document.createElement("h2");l.textContent=`困りごと · ${i.name}（${String(i.pain_level)}）`,t.append(l,jn(String(i.problem)))}const r=o?.targets??[i.id];if(r.length){const l=document.createElement("section"),u=document.createElement("h3");u.textContent="関連項目へ移動",l.append(u);for(const c of r){const a=document.createElement("button");a.className="node-navigate finding-target-link",a.dataset.findingTarget=c;const f=e.design.graph.nodes.some(p=>p.id===c),d=e.hiddenNodes?.includes(c);a.disabled=!f||!!d,a.textContent=(e.design.graph.nodes.find(p=>p.id===c)?.name??c)+(f?d?"（非表示）":"":"（参照先なし）"),a.onclick=()=>Vo(c,!0),l.append(a)}t.append(l)}return!0}function Ma(e,t){let n=0;for(const i of e)n=n*31+i.codePointAt(0)>>>0;const o=document.createElement("span");return o.className="who-badge",o.style.setProperty("--role-color",(t&&te()?.design.model?.business.roles?hs(te().design,t)?.color??"var(--line)":void 0)??["#8b5cf6","#2563eb","#c2410c","#008576","#be185d"][n%5]),o.setAttribute("aria-hidden","true"),o.append(ho(Gr)),o}function bi(e,t=!0){de||!te()||(bt.cancel(),we(),N.nodeDrawer=e,e&&ut().mode==="findings"&&innerWidth<=800&&(N.drawer=!1),lt(),e&&te()?.selected&&Zn(te().selected),xt(),t&&k(e?"node-list-close":"node-list-toggle").focus({preventScroll:!0}),Ie())}function Zn(e){const t=te(),n=t?.design.graph.nodes.find(i=>i.id===e);if(!n)return;const o=ut();(o.category!=="role"||n.type!=="business")&&(o.category=n.type==="business"?"activity":"object"),o.collapsed.delete(od(t.design,n.id,String(n.who))),n.name.toLocaleLowerCase().includes(o.search.toLocaleLowerCase())||(o.search=""),requestAnimationFrame(()=>{Array.from(k("node-list").querySelectorAll("[data-list-node]")).find(s=>s.dataset.listNode===e)?.scrollIntoView?.({block:"nearest",inline:"nearest"})})}function Ou(e,t){const n=te();if(!n||de||le||ve===n)return;bt.cancel(),We=void 0,we();const o=new Set(n.hiddenNodes??[]);for(const i of e)t?o.delete(i):o.add(i);n.hiddenNodes=[...o],kn(),Ie()}function Vo(e,t=!1){let n=te();if(n&&!si(n).graph.nodes.some(f=>f.id===e)&&(we(),He?.reopenBusinessOverview(),N.active=N.tabs[0].key,n=te(),Oe()),!n||n.hiddenNodes?.includes(e)||ve===n)return;t||(ut().finding=void 0);const o=k("node-list").contains(document.activeElement);bt.cancel(),We=void 0,we(),n.selected=e,Zn(e),lt(),kn();const i=k("viewport"),s=i.getBoundingClientRect(),r=k("formattedMarkdownDrawer").getBoundingClientRect(),l=N.drawer&&r.left>s.left&&r.left<s.right?r.left:s.right,u=Math.max(1,Math.min(i.clientWidth,l-s.left-i.clientLeft)),c=i.clientHeight;n.viewInset=[i.clientWidth/(2*n.zoom),i.clientHeight/(2*n.zoom)];const a=n.positions[e];if(n.scroll=[(a[0]+130+n.viewInset[0]+(n.canvasOrigin?.[0]??0))*n.zoom-u/2,(a[1]+34+n.viewInset[1]+(n.canvasOrigin?.[1]??0))*n.zoom-c/2],Kt(n),i.scrollLeft=n.scroll[0],i.scrollTop=n.scroll[1],we(),o){const f=t?"[data-finding-target]":"[data-list-node]",d=Array.from(k("node-list").querySelectorAll(f)).find(p=>(t?p.dataset.findingTarget:p.dataset.listNode)===e);(t?d:d?.querySelector(".node-navigate"))?.focus({preventScroll:!0})}Ie()}function xt(){const e=te(),t=ut(),n=k("node-list"),o=n.scrollTop,i=document.activeElement;i?.closest("[data-list-node]")?.dataset.listNode,i?.hasAttribute("data-node-visibility"),i?.dataset.role;const s=k("drawer-modes");s.replaceChildren();for(const g of["findings"]){const m=document.createElement("button");m.id="drawer-mode-"+g,m.setAttribute("role","tab"),m.setAttribute("aria-selected",String(t.mode===g)),m.setAttribute("aria-controls","node-list"),m.tabIndex=t.mode===g?0:-1,m.textContent=`指摘（${e?su(e.design):0}）`;const h=()=>{t.mode=g,xt(),k("drawer-mode-"+g).focus({preventScroll:!0})};m.onclick=h,m.onkeydown=x=>{["ArrowLeft","ArrowRight","Home","End"].includes(x.key)&&(x.preventDefault(),m.focus({preventScroll:!0}))},s.append(m)}for(const g of[k("node-categories"),k("node-list-search"),document.querySelector(".scope-bulk")])g.hidden=t.mode==="findings";n.setAttribute("aria-label",t.category==="activity"?"Activity一覧":t.category==="object"?"Object一覧":"ロール一覧");const r=k("node-list-search");r.value=t.search,r.disabled=!e||de;const l=k("node-categories");l.replaceChildren();for(const[g,m]of[["activity","Activity"],["object","Object"],["role","ロール"]]){const h=document.createElement("button");h.dataset.category=g,h.id="node-category-"+g,h.setAttribute("role","tab"),h.setAttribute("aria-selected",String(t.category===g)),h.setAttribute("aria-controls","node-list"),h.tabIndex=t.category===g?0:-1,h.textContent=m,h.onclick=()=>{t.category=g,xt(),k("node-category-"+g).focus({preventScroll:!0})},h.onkeydown=x=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(x.key))return;x.preventDefault();const C=["activity","object","role"],v=C.indexOf(g);t.category=x.key==="Home"?"activity":x.key==="End"?"role":C[(v+(x.key==="ArrowRight"?1:2))%3],xt(),k("node-category-"+t.category).focus({preventScroll:!0})},l.append(h)}n.setAttribute("aria-labelledby","node-category-"+t.category),n.replaceChildren();const u=new Set(e?.hiddenNodes??[]),c=e?.design.graph.nodes.filter(g=>!g.scope)??[],a=c.filter(g=>!u.has(g.id)).length,f=k("scope-outside"),d=a===c.length?"true":a===0?"false":"mixed";f.setAttribute("aria-pressed",d),f.setAttribute("aria-label",d==="true"?"スコープ外を非表示":"スコープ外を表示"),f.replaceChildren(ho(d==="false"?qc:Wc)),f.disabled=!c.length||de||ve===e;const p=k("show-outside");if(p.checked=d==="true",p.indeterminate=d==="mixed",p.setAttribute("aria-checked",d),p.disabled=f.disabled,k("scope-count").textContent=d==="mixed"?`${a}/${c.length} 表示`:"",t.mode==="findings"){if(n.setAttribute("aria-labelledby","drawer-mode-findings"),n.setAttribute("aria-label","指摘一覧"),n.replaceChildren(),e){if(Cu(e,n)){n.setAttribute("aria-label","指摘詳細"),n.scrollTop=o;return}if(t.filterNode){const g=document.createElement("p");g.textContent=(e.design.graph.nodes.find(h=>h.id===t.filterNode)?.name??t.filterNode)+"の指摘";const m=document.createElement("button");m.className="node-navigate finding-all",m.textContent="すべての指摘",m.onclick=()=>{t.filterNode=void 0,xt(),k("drawer-mode-findings").focus({preventScroll:!0})},n.append(g,m)}n.append(au(e.design,t.resolved,g=>{t.resolved=g,xt(),n.querySelector("input")?.focus({preventScroll:!0})},Ns,t.filterNode))}n.scrollTop=o;return}if(!e){n.textContent="文書を開くと項目が表示されます。";return}n.textContent="グラフの指摘から対象を選択してください。"}k("node-list-toggle").onclick=()=>bi(!N.nodeDrawer);k("node-list-close").onclick=()=>bi(!1);k("node-list-drawer").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),bi(!1))};document.addEventListener("keydown",e=>{e.key==="Escape"&&!e.defaultPrevented&&!k("node-list-drawer").hidden&&k("source-dialog").hidden&&(e.preventDefault(),bi(!1))});k("node-list-search").oninput=()=>{ut().search=k("node-list-search").value,xt()};function La(){const e=te();if(e){const t=e.design.graph.nodes.filter(n=>!n.scope);Ou(t.map(n=>n.id),t.some(n=>e.hiddenNodes?.includes(n.id)))}}k("scope-outside").onclick=La;k("show-outside").onchange=La;const ju="http://www.w3.org/2000/svg",qi=e=>document.createElementNS(ju,e),Ra=new _i,Dr=new WeakMap;function Nu(e){if(!_r(e.graph))return;let t=Dr.get(e);return t||(t=il(e),Dr.set(e,t)),t.wires}function Mu(e,t,n){ps(k("edges"),e,t,{"data-relation":String(n)})}let bo=()=>{},Yt=[0,0],mn=[0,0];function Lu(){const e=k("node-list-drawer");return k("viewport").clientWidth+(!e.hidden&&getComputedStyle(e).position!=="absolute"&&getComputedStyle(e).position!=="fixed"?e.offsetWidth:0)}function Ru(){const e=k("viewport"),t=e.getBoundingClientRect(),n=document.querySelector(".toolbar").getBoundingClientRect();return(n.height?Math.max(0,t.top+e.clientTop+e.clientHeight-n.top):0)+12}function Kt(e){const t=e.viewInset??[0,0],n=e.canvasOrigin??[0,0],o=Object.values(e.positions),i=[Math.min(0,...o.map(f=>f[0])),Math.min(0,...o.map(f=>f[1]))],s=[i[0]<0||n[0]>0?Math.min(i[0],mn[0]):0,i[1]<0||n[1]>0?Math.min(i[1],mn[1]):0],{growth:r,origin:l}=Dc(n,s,e.zoom),u=r.some(Boolean);u&&(e.canvasOrigin=l,e.scroll=[e.scroll[0]+r[0],e.scroll[1]+r[1]],Jt(),Ie(180,!1));const c=Math.ceil(Math.max(1400,Yt[0],(Lu()+e.scroll[0])/e.zoom-t[0]*2-l[0],...o.map(f=>f[0]+340))),a=Math.max(850,Yt[1],Math.max(Yt[1],...o.map(f=>f[1]+68))+Ru()/e.zoom-t[1],(k("viewport").clientHeight+e.scroll[1])/e.zoom-t[1]*2-l[1],...o.map(f=>f[1]+220));k("canvas").style.width=(c+l[0]+t[0]*2)*e.zoom+"px",k("canvas").style.height=(a+l[1]+t[1]*2)*e.zoom+"px",k("nodes").style.left=(l[0]+t[0])*e.zoom+"px",k("nodes").style.top=(l[1]+t[1])*e.zoom+"px",k("edges").style.left=t[0]*e.zoom+"px",k("edges").style.top=t[1]*e.zoom+"px",k("nodes").style.width=c+"px",k("nodes").style.height=a+"px",k("nodes").style.transform=`scale(${e.zoom})`,k("edges").setAttribute("viewBox",`${-l[0]} ${-l[1]} ${c+l[0]} ${a+l[1]}`),k("edges").style.width=(c+l[0])*e.zoom+"px",k("edges").style.height=(a+l[1])*e.zoom+"px",u&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("zoom").textContent=Math.round(e.zoom*100)+"%"}function kn(){Oa(Du)}function Du(){mi(),hn.cancel(),bo=()=>{},Yt=[0,0],mn=[0,0];const e=te();if(k("nodes").replaceChildren(),k("edges").replaceChildren(),k("empty").hidden=!!e,k("canvas").hidden=!e,!e){k("viewport").scrollLeft=0,k("viewport").scrollTop=0,sn(),xt();return}const t=si(e),n=t.graph.nodes,o=n.filter(a=>!e.hiddenNodes?.includes(a.id)),i=new Set(o.map(a=>a.id));e.selected&&!i.has(e.selected)&&(e.selected=void 0);const s=e.selected,r=e.positions,l=Go(t.graph.relations,s);Kt(e),k("edges").append(fs());const u=du(t.graph.relations,N.preferWrite===!0),c=()=>{const a=n.flatMap(h=>{const x=r[h.id];return x?[{id:h.id,x:x[0],y:x[1],width:260,height:68}]:[]}),f=Nu(t),d=Ra.update(e,t,a,t.graph.relations,f),p=new Map;for(Yt=[0,0],mn=[0,0];k("edges").childNodes.length>1;)k("edges").lastChild.remove();const g=new Map(e.design.graph.nodes.map(h=>[h.id,h.name]));t.graph.relations.forEach((h,x)=>{if(u.has(x))return;const C=d[x];if(!C||(Yt[0]=Math.max(Yt[0],C.bounds.right+20,C.label[0]+Math.max(30,h.label.length*12)/2+12),Yt[1]=Math.max(Yt[1],C.bounds.bottom+20,C.label[1]+22),mn[0]=Math.min(mn[0],...C.points.map(T=>T[0]-20),C.label[0]-Math.max(30,h.label.length*12)/2-12),mn[1]=Math.min(mn[1],...C.points.map(T=>T[1]-20),C.label[1]-22),e.selectedEdgesOnly===!0&&l.muted(h)||!i.has(h.from)||!i.has(h.to)||e.showExceptions===!1&&(h.kind==="business-exception"||h.kind==="object-exception")))return;const v=qi("path");v.setAttribute("d",C.path),v.dataset.relation=String(x),v.dataset.collisions=String(C.collisions),v.dataset.rerouted=String(C.rerouted),v.dataset.fallback=String(C.fallback),v.setAttribute("marker-end","url(#arrow)"),v.classList.add("edge"),h.kind.endsWith("exception")&&v.classList.add("exception"),l.related(h)&&(v.classList.add("review-related"),v.setAttribute("marker-end","url(#related-arrow)")),l.muted(h)&&v.classList.add("muted");const M=qi("title");M.textContent=(g.get(h.from)??h.from)+" → "+(g.get(h.to)??h.to)+": "+h.label,v.append(M),k("edges").append(v),h.kind.endsWith("exception")&&Mu(v,C,x);const I=Jr(h,x,f?.[x]),y=p.get(I);if(y){y.dataset.relations+=" "+x,l.related(h)&&(y.classList.add("review-related"),y.classList.remove("muted"));return}const D=qi("text");p.set(I,D),D.dataset.relations=String(x),D.setAttribute("x",String(C.label[0]-Math.max(30,h.label.length*12)/2)),D.setAttribute("y",String(C.label[1])),D.setAttribute("text-anchor","start"),D.classList.add("edge-label"),D.setAttribute("dominant-baseline","middle"),D.dataset.relation=String(x),l.related(h)&&D.classList.add("review-related"),l.muted(h)&&D.classList.add("muted"),D.textContent=h.label,k("edges").append(D)});const m=k("edges");for(const h of[...Array.from(m.querySelectorAll(".edge:not(.review-related),.edge-paint:not(.review-related)")),...Array.from(m.querySelectorAll(".edge-label:not(.review-related)")),...Array.from(m.querySelectorAll(".edge.review-related,.edge-paint.review-related")),...Array.from(m.querySelectorAll(".edge-label.review-related"))])m.append(h);Kt(e)};bo=c,c(),o.forEach(a=>{const f=document.createElement("div");f.setAttribute("role","group"),f.className="node "+a.type+(a.scope?"":" outside")+l.nodeClasses(a.id),f.dataset.node=a.id,a.type==="business"&&(f.dataset.activity=a.id),f.style.left=r[a.id][0]+"px",f.style.top=r[a.id][1]+"px",a.type==="business"?f.append(Ma(String(a.who),a.id)):f.append(Xr(a));const d=document.createElement("span");d.className="node-text";const p=document.createElement("span");p.className="review-kind",p.textContent=(a.type==="business"?"Activity":"Object")+(a.scope?" · 範囲内":" · 範囲外"),d.append(p);const g=document.createElement("span");if(g.className="node-name",g.textContent=a.name,d.append(g),a.type==="business"){const v=document.createElement("small");v.textContent=String(a.who),d.append(v)}if(f.append(d),zc(a.id,fo(e))){const v=document.createElement("button");v.type="button",v.className=a.type==="business"?"activity-open":"object-open",v.setAttribute("aria-label",a.name+"の詳細タブを開く"),v.title="詳細タブを開く",v.textContent="開く",v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),a.type==="business"?as(a.id):Da(a.id),He?.businessActivated()},f.append(v)}f.title=a.name+(a.type==="business"?" — "+String(a.who):""),f.setAttribute("aria-label",f.title+(a.id===s?"（選択中）":""));const m=ou(e.design,a);if(m.length){const v=document.createElement("button");v.type="button",v.className="finding-badges",v.textContent=m.join(" · "),v.setAttribute("aria-label",a.name+"の指摘を開く"),v.onpointerdown=M=>M.stopPropagation(),v.onpointerup=M=>M.stopPropagation(),v.onclick=M=>{M.stopPropagation(),Eu(a.id)},f.append(v),f.setAttribute("aria-label",f.getAttribute("aria-label")+" · "+m.join("、"))}let h;const x=f;x.onpointerdown=v=>{v.button!==0||ve===e||Tt||(v.stopPropagation(),x.setPointerCapture(v.pointerId),h=v.pointerId,hn.begin(a.id,[v.clientX,v.clientY]))},x.onpointermove=v=>{h===void 0||v.pointerId!==void 0&&v.pointerId!==h||!f.isConnected||ve===e||hn.move([v.clientX,v.clientY])},x.onpointerup=v=>{if(h===void 0||h!==v.pointerId||(h=void 0,!f.isConnected||ve===e))return;const M=hn.end();x.hasPointerCapture?.(v.pointerId)&&x.releasePointerCapture(v.pointerId),M&&(M.moved||(ut().finding=void 0,e.selected!==a.id&&(e.selected=a.id,Jt()),Zn(a.id)),we(),kn(),Ie(180,!1))};const C=v=>{h===void 0||h!==v.pointerId||(h=void 0,f.isConnected&&(hn.cancel(),we(),Ie(180,!1)))};x.onpointercancel=C,x.onlostpointercapture=C,k("nodes").append(f)}),k("zoom").textContent=Math.round(e.zoom*100)+"%",sn(),xt()}function as(e){de||le||ve||(we(),hl(N,e),Oe(),Ie(),k("viewport").focus({preventScroll:!0}))}function Da(e){de||le||ve||(we(),bl(N,e),Oe(),Ie(),k("viewport").focus({preventScroll:!0}))}function Oe(){Ta(),document.title=N.document?N.document.name+" · Alder Viewer":"Alder Viewer",bt.cancel(),We=void 0,lt(),ss(),kn();const e=te();e&&(k("viewport").scrollLeft=e.scroll[0],k("viewport").scrollTop=e.scroll[1]),k("refresh").toggleAttribute("disabled",de||le||!1||!e||e.source?.kind==="text"||e.source?.kind==="sample"||en.has(Ln(e))),k("refresh").hidden=!e,k("view-markdown").toggleAttribute("disabled",de||Re||le||!1||!e||en.has(Ln(e))),k("view-markdown").hidden=!e,k("open-checks").hidden=!e||e.design.sourceFormat==="json",k("open-checks").toggleAttribute("disabled",de||Re||le||!1||!e||!!(e&&wn(e).busy));for(const t of["open-menu-toggle","open-sample-menu","open","open-url","open-text","guide-open","guide-open-url","guide-open-text"])k(t).toggleAttribute("disabled",de||Re||le);k("open-sample").setAttribute("aria-disabled",String(de||Re||le)),k("open-sample").tabIndex=de||Re||le?-1:0,k("theme").toggleAttribute("disabled",de),vo(),hi(),gu(),vi(),He?.syncDocument()}function Ta(){const e=k("header-title"),t=N.document?.design.namedPlans;if(!t){(e.textContent!=="Alder Viewer"||e.querySelector("select"))&&(e.textContent="Alder Viewer");return}e.classList.remove("header-title-hidden");let n=e.querySelector("select");n||(e.replaceChildren(),n=document.createElement("select"),n.id="plan-select",n.setAttribute("aria-label","業務案を切り替える"),n.onchange=()=>{Tu(n.value)},e.append(n));const o=Array.from(n.options).map(i=>[i.value,i.textContent]);JSON.stringify(o)!==JSON.stringify(t.choices.map(({id:i,name:s})=>[i,s]))&&n.replaceChildren(...t.choices.map(({id:i,name:s})=>{const r=document.createElement("option");return r.value=i,r.textContent=s,r})),n.value=t.selected,n.title=t.choices.find(i=>i.id===t.selected)?.name??"",n.disabled=de||Re||le||!1}async function Tu(e){const t=N.document;if(!t?.design.namedPlans||de||Re||le||ve||e===t.design.namedPlans.selected)return;const n=document.querySelector("#plan-select"),o=document.activeElement===n;try{if(!k("source-dialog").hidden&&!await xo()){Ta();return}const i=rn(t.design.markdown,e),s=crypto.randomUUID(),r=Bt({...N,tabs:[],active:s},N.recovery,{...t,design:i},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]);await So(()=>r,()=>{N=r}),He?.reopenBusinessOverview(),He?.activateBusiness(),He?.businessActivated(),$e("")}catch(i){Oe(),i instanceof Rn||$e("案を切り替えられません: "+i.message,"error")}finally{o&&(document.activeElement===document.body||document.activeElement===document.documentElement||document.activeElement===n)&&document.querySelector("#plan-select")?.focus({preventScroll:!0})}}async function Io(e){const t=N.document,n=pl(N,e);return t?(await So(()=>n,()=>{N=n,_n.add(nn(N.tabs[0])?.key??N.tabs[0].key)}),!0):(we(),N=n,_n.add(nn(N.tabs[0])?.key??N.tabs[0].key),Oe(),Ie(),!0)}async function Pa(e,t){if(qt&&!await xo())return;const n=await Yo(e),o=te();if(t&&o?.handle&&await o.handle.isSameEntry(t)){if(o.design.markdown!==n.markdown&&!await go(o,n,t))return;He?.reopenBusinessOverview(),N.active=N.tabs[0].key,Oe(),Ie();return}const i=Xn({key:crypto.randomUUID(),name:e.name,design:n,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],handle:t},n);await Io(i)}k("empty").onpointerdown=e=>e.stopPropagation();for(const e of["open","open-url","open-text"])k("guide-"+e).onclick=()=>k(e).click();k("open-sample").onpointerdown=e=>e.stopPropagation();k("open-sample").onclick=async e=>{if(e.preventDefault(),!(de||Re||le))try{if(N.document?.source?.kind==="sample"&&N.document.design.markdown===jr){we(),He?.reopenBusinessOverview(),N.active=N.tabs[0].key,Oe(),k("viewport").focus({preventScroll:!0});return}const t=rn(jr),n=N.document?.source?.kind==="sample"&&N.document.design.markdown===Ss?N.tabs[0]:void 0;n&&we();const o=n??N.sampleLayout,i=o?mu(o,t):{},s=Xn({key:crypto.randomUUID(),name:"Alderを使った設計業務",source:{kind:"sample"},design:t,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0],...i},t);await Io(s)&&k("viewport").focus({preventScroll:!0})}catch(t){$e("サンプルを開けません: "+t.message,"error")}};k("open").onclick=async()=>{if(!(de||Re||le)){Re=!0,Oe();try{const e=window.showOpenFilePicker;if(e){const t=await e({multiple:!1,types:[{description:"Alder Business Design",accept:{"text/markdown":[".md",".markdown"],"application/json":[".json"]}}]});for(const n of t)await Pa(await n.getFile(),n)}else k("fallback").click()}catch(e){e.name!=="AbortError"&&$e("開けません: "+e.message,"error")}finally{Re=!1,Oe()}}};k("fallback").onchange=async()=>{const e=k("fallback");if(!(de||Re||le)){Re=!0,Oe();try{for(const t of Array.from(e.files??[]))await Pa(t)}catch(t){$e("開けません: "+t.message,"error")}e.value="",Re=!1,Oe()}};class Rn extends Error{constructor(t){super(t instanceof Error?t.message:"表示を切り替えられません。"),this.name="DocumentSaveError"}}async function So(e,t){if(le||ve)throw Error("表示を切り替えています。完了後に再試行してください。");try{pi()}catch(i){throw new Rn(i)}we(),clearTimeout(gn),gn=void 0,le=!0,Pt++;const n=Pt;Oe(),tt();let o=!1;try{const i=structuredClone(ws(e()));await Aa(i,n);const s=N;t(),N!==s&&(N=gl(N,s)),dt==="view"&&qt&&!N.tabs.some(r=>r.key===qt)&&(qt=N.tabs[0]?.key),xa(i),o=!0}catch(i){throw Cs(),new Rn(i)}finally{le=!1,Oe(),tt(),o&&Pt!==n&&Ie(0,!1)}}async function go(e,t,n=e.handle,o=!1){if(!on(e)||e.design!==N.document?.design)return!1;e.design.namedPlans&&t.namedPlans&&(t=rn(t.markdown,e.design.namedPlans.selected));const i=!!e.design.namedPlans!=!!t.namedPlans,s=crypto.randomUUID(),r=N.document,l=i&&r?Bt({...N,tabs:[],active:s},N.recovery,{...r,design:t,handle:n,edited:o,draft:void 0,...t.sourceFormat==="json"?{checks:void 0}:{}},[{key:s,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]}]):ml(N,t,n,o);return await So(()=>l,()=>{N=l}),On=void 0,vi(),$e(""),!0}async function Tr(e){if(!on(e))return;const t=window.showOpenFilePicker;if(t){const[n]=await t({multiple:!1});n&&await go(e,await Yo(await n.getFile()),n)}else await new Promise((n,o)=>{const i=document.createElement("input");i.type="file",i.accept=".md,.markdown,.json",i.hidden=!0,document.body.append(i);const s=()=>{i.remove(),n()};i.oncancel=s,i.onchange=async()=>{try{const r=i.files?.[0];r&&await go(e,await Yo(r)),s()}catch(r){i.remove(),o(r)}},i.click()})}k("refresh").onclick=async()=>{const e=te();if(de||le||ve||!e||e.source?.kind==="text"||e.source?.kind==="sample"||en.has(Ln(e)))return;qt===e.key&&ni();const t=Ln(e);en.add(t),Oe();try{if(e.source?.kind==="url"){const o=await ci(e.source.url);await go(e,o);return}if(!e.handle){await Tr(e);return}const n=await e.handle.queryPermission({mode:"read"});if(!on(e))return;if(n!=="granted"){$e("読取権限がありません。同じMarkdownを再選択してください。","warning"),await Tr(e);return}await go(e,await Yo(await e.handle.getFile()))}catch(n){on(e)&&n.name!=="AbortError"&&!(n instanceof Rn)&&$e("更新失敗。旧表示を保持しています: "+n.message,"error")}finally{en.delete(t),Oe()}};let dt="text",qt,tn=!1,yn=0,ti,cs=null;const Gt=()=>k("source-text"),yo=()=>k("source-url");function Ms(){ts=!k("source-dialog").hidden&&dt!=="view"&&(dt==="text"?Gt().value:yo().value)!=="",tt()}yo().addEventListener("input",Ms);function vo(){ds();const e=dt==="view",t=tn||le;Gt().disabled=t,Gt().readOnly=e,k("source-dialog").dataset.mode=dt,k("source-submit").hidden=e,k("source-submit").textContent="表示",k("source-submit").disabled=t||e,k("source-cancel").disabled=le||t&&dt!=="url",k("source-cancel").textContent=e?"閉じる":"キャンセル",Ms(),queueMicrotask(za)}function Ls(e,t){if(!(de||Re||le||t&&en.has(Ln(t)))){ti?.abort(),yn++,dt=e,qt=t?.key,tn=!1,cs=document.activeElement,k("source-dialog").hidden=!1,k("source-title").textContent=t?`${t.design.sourceFormat==="json"?"JSON":"Markdown"}原文 · ${N.document?.name??t.name}`:e==="url"?"URLを開く":"テキストを入力";for(const n of["url-label","source-url"])k(n).hidden=e!=="url";for(const n of["text-label","source-text"])k(n).hidden=e==="url";k("source-help").textContent=e==="url"?"匿名・CORS許可のHTTPS本文だけ取得します。認証やHTML表示URLは使えません。":e==="view"?"元ファイルやURLは書き換えません。":"閲覧する本文を入力してください。開いた後は読み取り専用です。外部送信しません。",t?Gt().value=t.design.markdown:e==="text"&&(Gt().value=gi),vo(),(e==="url"?yo():Gt()).focus()}}let gi="",zo;function Pu(){if(cs?.isConnected&&cs.focus({preventScroll:!0}),zo!==void 0&&cancelAnimationFrame(zo),dt!=="view")return;const e=yn;zo=requestAnimationFrame(()=>{if(zo=void 0,e!==yn||!k("source-dialog").hidden)return;const t=window.visualViewport,n=At.querySelector("header"),o=n.getBoundingClientRect();t&&t.height>0&&o.height>0&&o.bottom<=t.offsetTop&&n.scrollIntoView({block:"start",inline:"nearest",behavior:"instant"})})}function ni(){yn++,ti?.abort(),tn=!1,qt=void 0,k("source-dialog").hidden=!0,vo(),Pu()}async function xo(){return le?!1:(dt==="text"&&(gi=Gt().value),ni(),!0)}function qa(){return xo()}Gt().oninput=()=>{dt==="text"&&(gi=Gt().value,Ms())};let Bo=!1;function Wa(){return de||Re||tn||le||ve?"読込が終わってから共有してください。":lu(te())}function ds(){const e=Wa(),t=k("share-source");t.hidden=!te(),t.setAttribute("aria-disabled",String(Bo||!!e)),t.title=e??"取得元URLは相手に見えます。共有先では取得元URLのタブを開きます。"}k("share-source").onclick=async()=>{if(Bo)return;const e=Wa();if(e){$e(e,"warning");return}const t=te();if(t.source?.kind!=="url")return;const n=t.source.url,o=uu(location.href,n);Bo=!0,ds();try{if(!navigator.clipboard?.writeText)throw Error("Clipboard unavailable");await navigator.clipboard.writeText(o),$e("共有リンクをコピーしました。取得元URLは相手に見えます。元URLの更新で内容も変わります: "+n)}catch{$e("共有リンクをコピーできませんでした。ブラウザーのクリップボード許可を確認して、もう一度操作してください。","error")}finally{Bo=!1,ds()}};let Zt,Un=0,Pr=0,uo;function za(){if(de||Re||tn||ve||le||Zt||uo===void 0)return;const e=uo;uo=void 0,Rs(e)}async function Rs(e=location.hash){const t=e;if(de)return;const n=++Pr;if(!/^#source(?:=|$)/.test(t)){uo=void 0,Zt&&!le&&(Zt.abort(),Zt=void 0,Un++,Re=!1,Oe());return}if(location.hash===t&&history.replaceState(history.state,"",location.pathname+location.search),le){uo=t;return}if(tn||Re&&!Zt){$e("読込が終わってから共有リンクを開き直してください。","warning");return}const o=++Un;Zt?.abort();try{const i=fu(t);pi();const s=N.tabs.find(c=>c.source?.kind==="url"&&c.source.url===i),r=s;if(r){if(qt&&qt!==r.key&&!await xo()||o!==Un||n!==Pr)return;const c=we()||N.active!==r.key;N.active=r.key,Oe(),Ie(180,c),$e("開いている共有元のタブを選択しました。表示内容は保持しています。"),Ao();return}Zt=new AbortController,Re=!0,Oe();const l=await ci(i,Zt.signal);if(o!==Un)return;const u=Xn({key:crypto.randomUUID(),name:new URL(i).pathname.split("/").pop()||"URLのMarkdown",source:{kind:"url",url:i},design:l,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},l);if(!await Io(u))return;$e("共有元を読み込みました。取得元URLは相手に見え、元の更新で内容が変わります: "+i)}catch(i){o===Un&&!(i instanceof Rn)&&$e("共有リンクを開けません。既存の表示は保持しています: "+i.message,"error")}finally{o===Un&&(Zt=void 0,Re=!1,Oe(),za())}}window.addEventListener("hashchange",()=>{Rs().then(()=>{N.document?.key===ls&&Ao()})});function Ds(e){N.drawer=!0,lt(),sn()}async function qu(e){const t=wn(e);if(!(e.design.sourceFormat==="json"||t.busy||le||de||ve===e)){t.busy=!0;try{await js(e,void 0),t.candidate=void 0,t.error=void 0,t.url=void 0}catch(n){t.error=n.message}finally{t.busy=!1,sn()}}}let oi;Ht.onchange=()=>{const e=Ht.files?.[0],t=oi??te();oi=void 0,Ht.value="",!(!e||!t||!on(t))&&(Ds(),ja(t,async()=>{if(e.size>2*1024*1024)throw Error("本文は2MiB以内にしてください。");return{name:e.name,markdown:await e.text()}}))};Ht.oncancel=()=>{oi=void 0};k("check-open").onclick=()=>{oi=te(),Ht.click()};let Ts,Ho=null;function Ps(){an.hidden=!0,Ts=void 0,(Ho&&!Ho.closest("[hidden]")?Ho:k("open-checks").getBoundingClientRect().width?k("open-checks"):k("document-actions-toggle")).focus({preventScroll:!0})}k("check-open-url").onclick=()=>{const e=te();e&&(Ho=rs??document.activeElement,Ts=e,k("check-url").value=wn(e).url??"",an.hidden=!1,k("check-url").focus())};k("check-url-cancel").onclick=Ps;an.onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),e.stopPropagation(),Ps())};k("check-url-form").onsubmit=e=>{e.preventDefault();const t=Ts;if(!t||!on(t))return;const n=k("check-url").value.trim();wn(t).url=n,Ps(),Ds(),ja(t,async()=>({name:n,url:n,markdown:await tu(n)}))};k("check-open-sample").onclick=()=>{const e=te();!e||!Os(e)||(Ds(),Na(e,{name:"チェックリストのサンプル",markdown:hu}))};k("check-close").onclick=()=>{const e=te();e&&qu(e)};k("open-sample-menu").onclick=()=>{k("open-sample").click()};k("view-markdown").onclick=()=>{const e=te();e&&Ls("view",e)};k("open-url").onclick=()=>Ls("url");k("open-text").onclick=()=>Ls("text");k("source-cancel").onclick=()=>qa();k("source-dialog").onkeydown=e=>{e.key==="Escape"&&(e.preventDefault(),qa())};k("source-submit").onclick=async()=>{if(tn||le||dt==="view"&&ve||k("source-dialog").hidden||dt==="view")return;tn=!0,vo();const e=++yn,t=dt;ti=new AbortController;try{const n=dt==="url"?new URL(yo().value.trim()).href:yo().value.trim();if(t==="url"&&N.document?.source?.kind==="url"&&N.document.source.url===n){He?.reopenBusinessOverview(),N.active=N.tabs[0].key,ni(),Oe(),Ao();return}const o=t==="url"?await ci(n,ti.signal):nu(Gt().value),i=o.markdown;if(e!==yn)return;const s=Xn({key:crypto.randomUUID(),name:t==="text"?o.sourceFormat==="json"?"入力したJSON":"入力したMarkdown":new URL(n).pathname.split("/").pop()||"URLのMarkdown",source:t==="text"?{kind:"text"}:{kind:"url",url:n},design:o,positions:Object.create(null),scroll:[0,0],zoom:1,viewInset:[40,0]},o);if(!await Io(s))return;$e(""),t==="text"&&(gi=i),ni()}catch(n){e===yn&&!(n instanceof Rn)&&$e("表示できません。入力と旧表示を保持しています: "+n.message,"error")}finally{e===yn&&(tn=!1,vo())}};k("layout-lock").onclick=()=>{de||(bt.cancel(),We=void 0,we(),Tt=!Tt,lt(),kn())};k("selected-edges-only").onchange=()=>{const e=te();!e||de||le||ve===e||(bt.cancel(),We=void 0,we(),e.selectedEdgesOnly=k("selected-edges-only").checked,bo(),Ie())};k("show-exceptions").onchange=()=>{const e=te();!e||de||le||ve===e||(bt.cancel(),We=void 0,we(),e.showExceptions=k("show-exceptions").checked,bo(),Ie())};k("prefer-write").onchange=()=>{de||(we(),N.preferWrite=k("prefer-write").checked,kn(),Ie())};k("theme").onclick=()=>{de||(N.dark=!N.dark,lt(),Ie())};k("drawer").onclick=()=>{de||!te()||(we(),N.drawer=!N.drawer,Oe(),Ie())};for(const[e,t]of[["in",Qs],["out",1/Qs]])k(e).onclick=()=>{const n=te();if(n&&ve!==n){const o=we(),i=Nc({zoom:n.zoom,scroll:n.scroll},t).zoom,s=o||i!==n.zoom;n.zoom=i,Oe(),Ie(180,s)}};const Ae=k("viewport");function $a(e,t){const n=te();if(!n||le||ve===n)return;we();const o=n.positions[e];n.positions[e]=t,(o?.[0]!==t[0]||o?.[1]!==t[1])&&Jt();const i=Array.from(k("nodes").children).find(s=>s.dataset.node===e);i&&(i.style.left=t[0]+"px",i.style.top=t[1]+"px"),bo()}const hn=Rc({read:()=>{const e=te();return e&&!le&&e!==ve&&!Tt&&!document.hidden?{key:e.key,zoom:e.zoom,scroll:[Ae.scrollLeft,Ae.scrollTop],offset:[(e.canvasOrigin?.[0]??0)+(e.viewInset?.[0]??0),(e.canvasOrigin?.[1]??0)+(e.viewInset?.[1]??0)]}:void 0},position:e=>te()?.positions[e],connected:e=>Array.from(k("nodes").children).some(t=>t.dataset.node===e),bounds:()=>{const e=Ae.getBoundingClientRect(),t=e.left+Ae.clientLeft,n=e.top+Ae.clientTop,o={left:t,top:n,right:t+Ae.clientWidth,bottom:n+Ae.clientHeight};for(const[s,r]of[["formattedMarkdownDrawer","right"],["node-list-drawer","left"]]){const l=k(s),u=l.getBoundingClientRect();l.hidden||u.bottom<=n||u.top>=o.bottom||(r==="right"&&u.left>o.left&&u.left<o.right&&(o.right=u.left),r==="left"&&u.right>o.left&&u.right<o.right&&(o.left=u.right))}const i=document.querySelector(".toolbar").getBoundingClientRect();return i.height&&i.top<o.bottom&&i.bottom>o.top&&(o.bottom=Math.max(o.top,i.top-12)),o},change:$a,pan:e=>{const t=te();if(!t||t===ve||Tt)return;we();const n=[t.scroll[0]+e[0],t.scroll[1]+e[1]],o=t.canvasOrigin??[0,0],i=[Math.ceil(Math.max(0,-n[0])),Math.ceil(Math.max(0,-n[1]))];i.some(Boolean)&&(t.canvasOrigin=[o[0]+i[0]/t.zoom,o[1]+i[1]/t.zoom]),t.scroll=[Math.max(0,n[0]+i[0]),Math.max(0,n[1]+i[1])],Kt(t),Ae.scrollLeft=t.scroll[0],Ae.scrollTop=t.scroll[1],we(),Jt()},requestFrame:e=>requestAnimationFrame(e),cancelFrame:e=>cancelAnimationFrame(e)}),bt=Mc(Ae,{nodeDrag:hn,read:()=>{const e=te();return e&&!le&&ve!==e?{key:e.key,zoom:e.zoom,locked:Tt,scroll:[Ae.scrollLeft,Ae.scrollTop]}:void 0},position:e=>te()?.positions[e],change:e=>{const t=te();if(!t||le||ve===t)return;const n=t.scroll;let o=!1;e.node&&$a(e.node.id,e.node.position),e.selected&&(ut().finding=void 0,o=o||t.selected!==e.selected,t.selected=e.selected,Zn(e.selected)),e.zoom!==void 0&&(o=o||t.zoom!==e.zoom,t.zoom=e.zoom),e.scroll&&(t.scroll=e.scroll),e.selected?kn():e.zoom!==void 0&&Kt(t),e.scroll&&(Ae.scrollLeft=e.scroll[0],Ae.scrollTop=e.scroll[1]),we(!1),(o||n[0]!==t.scroll[0]||n[1]!==t.scroll[1])&&Jt()},finish:()=>{const e=te();e&&Kt(e),we(),Ie(180,!1)}}),qs=()=>{bt.cancel(),We=void 0,we(),Ie(0,!1)};window.addEventListener("blur",qs);window.addEventListener("pagehide",qs);document.addEventListener("visibilitychange",()=>{document.hidden&&qs()});Ae.onscroll=()=>{we()};let We;Lc(Ae,{read:()=>{const e=te();return e&&!de&&!le&&e!==ve?{zoom:e.zoom,scroll:[Ae.scrollLeft,Ae.scrollTop]}:void 0},change:e=>{const t=te();!t||le||t===ve||(bt.cancel(),hn.cancel(),We=void 0,t.zoom=e.zoom,t.scroll=e.scroll,Kt(t),Ae.scrollLeft=t.scroll[0],Ae.scrollTop=t.scroll[1],we(!1),Jt(),Ie(180,!1))}});Ae.onpointerdown=e=>{const t=te(),n=e.target.closest(".node")?.dataset.node;e.button!==0||!t||le||t===ve||n&&!Tt||(We={key:t.key,pointer:e.pointerId,x:e.clientX,y:e.clientY,scroll:[Ae.scrollLeft,Ae.scrollTop],node:n,moved:!1},Ae.setPointerCapture(e.pointerId))};Ae.onpointermove=e=>{if(We&&We.pointer===e.pointerId&&We.key===te()?.key&&te()!==ve){const t=e.clientX-We.x,n=e.clientY-We.y;Math.hypot(t,n)>3&&(We.moved=!0),Ae.scrollLeft=We.scroll[0]-t,Ae.scrollTop=We.scroll[1]-n,we()}};Ae.onpointerup=e=>{if(!We||We.pointer!==e.pointerId)return;const t=te(),n=We;We=void 0,Ae.hasPointerCapture?.(e.pointerId)&&Ae.releasePointerCapture(e.pointerId),t&&t!==ve&&n.key===t.key&&!n.moved&&n.node&&(ut().finding=void 0,t.selected!==n.node&&(t.selected=n.node,Jt()),Zn(n.node),kn()),we(),Ie(180,!1)};Ae.onpointercancel=()=>{We=void 0};Ae.addEventListener("lostpointercapture",e=>{e.target===Ae&&We?.pointer===e.pointerId&&(We=void 0)});let yi=!1;k("resize").onpointerdown=e=>{de||(yi=!0,k("resize").setPointerCapture(e.pointerId))};k("resize").onpointermove=e=>{if(yi){const t=Math.max(260,Math.min(innerWidth*.65,innerWidth-e.clientX));t!==N.width&&(N.width=t,Jt()),lt()}};k("resize").onpointerup=()=>{yi=!1,Ie(180,!1)};k("resize").onpointercancel=()=>{yi=!1,Ie(180,!1)};k("resize").onkeydown=e=>{if(!de&&(e.key==="ArrowLeft"||e.key==="ArrowRight")){e.preventDefault();const t=Math.max(260,Math.min(innerWidth*.65,N.width+(e.key==="ArrowLeft"?20:-20)));t!==N.width&&(N.width=t,Jt()),lt(),Ie(180,!1)}};window.addEventListener("resize",()=>{lt();const e=te();e&&Kt(e)});if(typeof ResizeObserver<"u"){const e=new ResizeObserver(()=>{const t=te();t&&Kt(t)});e.observe(k("viewport")),e.observe(document.querySelector(".toolbar"))}function $o(e){if(!e||typeof e.key!="string"||!e.key||typeof e.name!="string"||typeof e.design?.markdown!="string"||e.selected!==void 0&&typeof e.selected!="string")throw Error("Invalid saved document");if(e.design.sourceFormat!==void 0&&e.design.sourceFormat!=="json")throw Error("Unknown saved source format");const t=e.design.namedPlans?.selected;if(e.design.namedPlans!==void 0&&typeof t!="string")throw Error("Invalid saved plan selection");if(e.design=rn(e.design.markdown,t),e.design.namedPlans&&t===void 0)throw Error("Missing saved plan selection");if(e.design.sourceFormat==="json"&&(e.checks=void 0),e.checks!==void 0){if(!e.checks||typeof e.checks.markdown!="string"||typeof e.checks.name!="string"||e.checks.url!==void 0&&typeof e.checks.url!="string"||e.checks.confirmedFor!==void 0&&typeof e.checks.confirmedFor!="string")throw Error("Invalid related Check");Kn(e.checks)}if(e.draft!==void 0&&typeof e.draft!="string"||e.edited!==void 0&&typeof e.edited!="boolean")throw Error("Invalid editor state");if(e.source!==void 0&&(!e.source||!["text","sample","url"].includes(e.source.kind)||e.source.kind==="url"&&typeof e.source.url!="string"))throw Error("Invalid saved source")}const Yn=document.createElement("section");Yn.id="source-update-notice";Yn.className="info-bar";Yn.hidden=!0;Yn.innerHTML='<span role="status">開いている文書は古いバージョンです。取得元に新しい内容があります。</span><button id="source-update-refresh" type="button">更新する</button><button id="source-update-close" type="button">このまま読む</button>';document.querySelector(".workspace").before(Yn);let On;const Ua=new Set;let Wi=0,ls,zi;function vi(){const e=N.document;Yn.hidden=!On||On.key!==e?.key||On.baseline!==e.design.markdown||Ua.has(e.key),k("source-update-refresh").disabled=de||Re||le||!!(e&&en.has(e.key))}k("source-update-close").onclick=()=>{On&&Ua.add(On.key),vi()};k("source-update-refresh").onclick=()=>{k("refresh").click()};async function Ao(){const e=N.document;if(e?.source?.kind!=="url")return;const t=e.key+"\0"+e.design.markdown;if(zi===t)return;zi=t;const n=++Wi,o=e.key,i=e.source.url,s=e.design.markdown;try{const r=await ks(i);if(n!==Wi||N.document?.key!==o||N.document.design.markdown!==s||N.document.source?.kind!=="url"||N.document.source.url!==i)return;rn(r),On=r.replace(/\r\n?/g,`
`)!==s.replace(/\r\n?/g,`
`)?{key:o,url:i,baseline:s}:void 0,vi()}catch{}finally{n===Wi&&(zi=void 0)}}He=Jd(At,{rightDrawer:{isOpen:()=>N.drawer,isReady:()=>!de,setOpen:e=>{de||(N.drawer=e,lt(),Ie())}},capture:()=>{we(),bt.cancel(),We=void 0},business:()=>({key:N.document?.design.namedPlans?JSON.stringify([N.document.key,N.document.design.namedPlans.selected]):N.document?.key,design:N.document?.design,relatedChecks:N.tabs[0]?xl(N.tabs[0]):[],viewKey:te()?.key,views:N.tabs.map(e=>({key:e.key,name:e.name,activity:Xo(e),object:Zo(e)})),activities:N.document?.design.graph.nodes.filter(e=>e.type==="business").map(e=>({id:e.id,name:e.name}))??[],objects:N.document?.design.graph.nodes.filter(e=>e.type==="object").map(e=>({id:e.id,name:e.name}))??[],states:N.document?.design.graph.nodes.filter(e=>e.type==="object"&&!!N.document?.design.objectStateTransitions?.[e.id]).map(e=>({id:e.id,name:e.name}))??[],concept:(()=>{const e=N.document?.design.model,t=e?.concepts?.find(n=>n.basedOn.documentId===e.business.id);return e&&t?{business:e.business,model:t}:void 0})()}),openActivity:e=>{as(e),Vo(e)},openObject:e=>{Da(e),Vo(e)},openOverview:()=>{N.tabs[0]&&(we(),He?.reopenBusinessOverview(),N.active=N.tabs[0].key,Oe(),Ie())},activateView:e=>{N.tabs.some(t=>t.key===e)&&(we(),N.active=e,Oe(),Ie())},statePanel:e=>N.document?Yd(N.document.design,e,t=>{He?.activateBusiness(),as(t),Vo(t),He?.businessActivated()}):void 0,closeLegacyList:()=>{N.nodeDrawer=!1,lt()},refresh:()=>{lt(),es.update()}});const Wu=N;Oe();tt();al().then(e=>{if(e===void 0)return;const t=e;if("format"in t){for(const c of t.recovery??[])$o(c);if(t.document){const c={...t.document};$o(c),t.document.design=c.design,t.document.checks=c.checks}}else{if(!Array.isArray(t.tabs))throw Error("Invalid session");for(const c of t.tabs)$o(c)}const n=fl(t),o={...e,legacyViews:n.legacyViews,tabs:n.tabs.map(c=>({...c,name:n.document.name,design:c.design,checks:c.checks,source:c.source,draft:c.draft,edited:c.edited,handle:c.handle}))};if(!Array.isArray(o.tabs)||typeof o.dark!="boolean"||typeof o.drawer!="boolean"||o.preferWrite!==void 0&&typeof o.preferWrite!="boolean"||o.scopeOutside!==void 0&&!["show","dim","hide"].includes(o.scopeOutside)||o.dimOutside!==void 0&&typeof o.dimOutside!="boolean"||o.hideOutside!==void 0&&typeof o.hideOutside!="boolean"||!Number.isFinite(o.width))throw Error("Invalid session");for(const c of o.tabs)$o(c);if(new Set(o.tabs.map(c=>c.key)).size!==o.tabs.length||o.active!==void 0&&typeof o.active!="string")throw Error("Invalid saved tab keys");if(o.nodeDrawer!==void 0&&typeof o.nodeDrawer!="boolean")throw Error("Invalid drawer");for(const c of[...o.tabs,...o.sampleLayout===void 0?[]:[o.sampleLayout]])if(!c||!c.positions||typeof c.positions!="object"||Array.isArray(c.positions)||c.selectedEdgesOnly!==void 0&&typeof c.selectedEdgesOnly!="boolean"||c.showExceptions!==void 0&&typeof c.showExceptions!="boolean"||c.hiddenNodes!==void 0&&(!Array.isArray(c.hiddenNodes)||!c.hiddenNodes.every(a=>typeof a=="string"))||c.viewInset!==void 0&&(!Array.isArray(c.viewInset)||c.viewInset.length!==2||!c.viewInset.every(a=>Number.isFinite(a)&&a>=0))||c.canvasOrigin!==void 0&&(!Array.isArray(c.canvasOrigin)||c.canvasOrigin.length!==2||!c.canvasOrigin.every(a=>Number.isFinite(a)&&a>=0))||!Array.isArray(c.scroll)||c.scroll.length!==2||!c.scroll.every(Number.isFinite)||!Number.isFinite(c.zoom)||c.zoom<.25||c.zoom>2.5||!Object.values(c.positions).every(a=>Array.isArray(a)&&a.length===2&&a.every(Number.isFinite)))throw Error("Invalid layout");const{dimOutside:i,hideOutside:s,scopeOutside:r,...l}=o,u=c=>({...c,hiddenNodes:c.hiddenNodes??(o.scopeOutside==="hide"?c.design.graph.nodes.filter(a=>!a.scope).map(a=>a.id):[])});N=Bt({...l,tabs:o.tabs.map(u)},n.recovery,n.document,o.tabs.map(c=>{const{design:a,checks:f,source:d,draft:p,edited:g,handle:m,name:h,...x}=u(c);return x})),o.sampleLayout&&o.sampleLayout.hiddenNodes===void 0&&o.scopeOutside==="hide"&&(N.sampleLayout={...o.sampleLayout,hiddenNodes:rn(Ss).graph.nodes.filter(c=>!c.scope).map(c=>c.id)}),N.tabs.some(c=>c.key===N.active)||(N.active=N.tabs[0]?.key),te()?.selected&&Zn(te().selected),ls=N.document?.key,Oe(),xs=!0}).catch(()=>{N=Wu,Jn=!0,As()}).finally(()=>{de=!1,Oe(),tt(),Rs().then(()=>{N.document?.key===ls&&Ao()})});
