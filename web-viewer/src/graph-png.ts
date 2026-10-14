// Serialize only the rendered graph. No camera changes, re-layout or network reads.
const SVG='http://www.w3.org/2000/svg',HTML='http://www.w3.org/1999/xhtml';
const PADDING=24,MAX_SIDE=8192,MAX_PIXELS=16_000_000,MAX_SVG_BYTES=8_000_000;
const MAX_ELEMENTS=4000,MAX_TEXT=1_000_000;
type Box={x:number;y:number;width:number;height:number};
export type GraphImage={svg:string;width:number;height:number;scale:number;bounds:Box};
const sizeError='グラフが大きすぎるため画像を作れません。不要な項目を非表示にするか、配置の間隔を狭めてください。';

export function imageSize(boxes:Box[]){
  if(!boxes.length)throw Error('画像にする項目がありません。');
  if(boxes.some(b=>![b.x,b.y,b.width,b.height].every(Number.isFinite)||b.width<0||b.height<0))throw Error('図の範囲を読み取れませんでした。');
  let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
  for(const box of boxes){left=Math.min(left,box.x);top=Math.min(top,box.y);right=Math.max(right,box.x+box.width);bottom=Math.max(bottom,box.y+box.height);}
  const x=Math.floor(left)-PADDING,y=Math.floor(top)-PADDING;
  const width=Math.ceil(right)-x+PADDING,height=Math.ceil(bottom)-y+PADDING;
  // Keep at least one pixel per graph unit. Prefer 2x, independent of zoom/DPR.
  const scale=Math.min(2,MAX_SIDE/width,MAX_SIDE/height,Math.sqrt(MAX_PIXELS/(width*height)));
  if(scale<1)throw Error(sizeError);
  return {bounds:{x,y,width,height},width:Math.floor(width*scale),height:Math.floor(height*scale),scale};
}

// Capture resolved values, including theme/role colors, rather than importing the
// app stylesheet or font URLs into the image. This list covers graph-only styles.
const properties=('display position width height min-width min-height max-width max-height box-sizing margin padding border-top border-right border-bottom border-left border-radius outline outline-offset box-shadow background-color color opacity filter font-family font-size font-weight font-style font-stretch font-kerning font-feature-settings line-height letter-spacing text-align text-overflow white-space overflow overflow-x overflow-y vertical-align grid-template-columns grid-template-rows gap align-items align-self justify-items justify-self flex-direction flex-shrink z-index fill fill-opacity stroke stroke-width stroke-opacity stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin paint-order text-anchor dominant-baseline visibility').split(' ');
function styledClone<T extends Element>(source:T):T{
  const copy=source.cloneNode(true) as T,original=[source,...Array.from(source.querySelectorAll('*'))],clones=[copy,...Array.from(copy.querySelectorAll('*'))];
  original.forEach((node,index)=>{
    const target=clones[index] as HTMLElement|SVGElement,style=getComputedStyle(node);
    target.removeAttribute('style');
    for(const property of properties){const value=style.getPropertyValue(property);if(value&&!/url\s*\(/i.test(value))target.style.setProperty(property,value);}
    // The graph is text and inline SVG only. Keep local marker references and
    // remove data/interaction attributes from the standalone image.
    for(const attr of Array.from(target.attributes))if(attr.name.startsWith('data-')||attr.name.startsWith('on')||['tabindex','role','aria-label','aria-hidden'].includes(attr.name))target.removeAttribute(attr.name);
  });
  return copy;
}

export function snapshotGraph(nodes:HTMLElement,edges:SVGSVGElement,background:string):GraphImage{
  // Bound the expensive computed-style/clone work before building a second DOM.
  if(nodes.querySelectorAll('*').length+edges.querySelectorAll('*').length>MAX_ELEMENTS||(nodes.textContent?.length??0)+(edges.textContent?.length??0)>MAX_TEXT)throw Error(sizeError);
  const cards=Array.from(nodes.querySelectorAll<HTMLElement>(':scope > .node'));
  const boxes:Box[]=cards.map(n=>({x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:n.offsetWidth,height:n.offsetHeight}));
  for(const element of Array.from(edges.querySelectorAll<SVGGraphicsElement>(':scope > .edge,:scope > .edge-label'))){
    const b=element.getBBox();
    // getBBox excludes strokes and arrow markers; their maximum graph radius is
    // below 12px, including the selected 3.2px stroke and 7-unit arrow marker.
    boxes.push({x:b.x-12,y:b.y-12,width:b.width+24,height:b.height+24});
  }
  if(!cards.length)throw Error('画像にする項目がありません。');
  const size=imageSize(boxes),doc=nodes.ownerDocument,root=doc.createElementNS(SVG,'svg');
  root.setAttribute('width',String(size.width));root.setAttribute('height',String(size.height));root.setAttribute('viewBox',`0 0 ${size.bounds.width} ${size.bounds.height}`);
  const backdrop=doc.createElementNS(SVG,'rect');backdrop.setAttribute('width','100%');backdrop.setAttribute('height','100%');backdrop.setAttribute('fill',background);root.append(backdrop);
  const lines=doc.createElementNS(SVG,'g');lines.setAttribute('transform',`translate(${-size.bounds.x} ${-size.bounds.y})`);
  for(const child of Array.from(edges.children))lines.append(styledClone(child));root.append(lines);
  const foreign=doc.createElementNS(SVG,'foreignObject');foreign.setAttribute('width',String(size.bounds.width));foreign.setAttribute('height',String(size.bounds.height));
  const content=doc.createElementNS(HTML,'div');content.style.cssText=`position:relative;width:${size.bounds.width}px;height:${size.bounds.height}px;`;
  for(const card of cards){const clone=styledClone(card);clone.style.left=(parseFloat(card.style.left)-size.bounds.x)+'px';clone.style.top=(parseFloat(card.style.top)-size.bounds.y)+'px';content.append(clone);}
  foreign.append(content);root.append(foreign);
  const svg=new XMLSerializer().serializeToString(root);
  if(new TextEncoder().encode(svg).length>MAX_SVG_BYTES)throw Error(sizeError);
  return {svg,...size};
}

export function pngName(name:string){
  const clean=Array.from(name.normalize('NFKC').replace(/\.(?:md|markdown)$/i,'').replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,'_').replace(/^\.+|[.\s]+$/g,'')).slice(0,80).join('');
  return 'alder-'+(clean||'graph')+'.png';
}

export async function saveGraphPng(image:GraphImage,name:string){
  const canvas=document.createElement('canvas'),bitmap=new Image();
  try{
    await new Promise<void>((resolve,reject)=>{
      const timer=window.setTimeout(()=>{bitmap.onload=bitmap.onerror=null;bitmap.src='';reject(Error('画像の生成が時間内に終わりませんでした。'));},15000);
      bitmap.onload=()=>{clearTimeout(timer);resolve();};bitmap.onerror=()=>{clearTimeout(timer);reject(Error('このブラウザーでは画像を生成できませんでした。'));};
      // A self-contained data SVG avoids external image/font retrieval and the
      // opaque origin assigned to SVG blob URLs by some browsers.
      bitmap.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(image.svg);
    });
    canvas.width=image.width;canvas.height=image.height;
    const context=canvas.getContext('2d');if(!context)throw Error('画像用のメモリを確保できませんでした。');
    context.drawImage(bitmap,0,0,image.width,image.height);
    const blob=await new Promise<Blob>((resolve,reject)=>{
      const timer=window.setTimeout(()=>reject(Error('PNG画像の生成が時間内に終わりませんでした。')),15000);
      try{canvas.toBlob(value=>{clearTimeout(timer);value?resolve(value):reject(Error('PNG画像を生成できませんでした。'));},'image/png');}
      catch(error){clearTimeout(timer);reject(error);}
    });
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    try{link.href=url;link.download=pngName(name);link.hidden=true;document.body.append(link);link.click();}
    finally{link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1500);}
  }finally{bitmap.onload=bitmap.onerror=null;bitmap.src='';canvas.width=canvas.height=0;}
}
