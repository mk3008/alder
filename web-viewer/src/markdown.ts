// Source HTML, scripts, links and images are always inert text.
export function detailHeading(name:string):HTMLHeadingElement{const h=document.createElement('h1');h.className='detail-title';h.textContent=name;return h;}
export function formattedMarkdown(source: string,withoutTitle=false): HTMLElement {
  const root=document.createElement('article');root.className='markdown';let fence='',code:HTMLElement|undefined,list:HTMLElement|undefined;
  const inline=(parent:HTMLElement,s:string)=>{for(const p of s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)){if(p.startsWith('**')&&p.endsWith('**')){const e=document.createElement('strong');e.textContent=p.slice(2,-2);parent.append(e);}else if(p.startsWith('`')&&p.endsWith('`')){const e=document.createElement('code');e.textContent=p.slice(1,-1);parent.append(e);}else parent.append(document.createTextNode(p));}};
  // Keep line boundaries and fence delimiters aligned with graph.ts.
  for(const line of source.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/)){
    const m=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if(m&&!fence){fence=m[1];list=undefined;const pre=document.createElement('pre');code=document.createElement('code');pre.append(code);root.append(pre);continue;}
    if(m&&m[1][0]===fence[0]&&m[1].length>=fence.length&&!m[2].replace(/^[\s\u001c-\u001f]+|[\s\u001c-\u001f]+$/g,'')){fence='';list=undefined;continue;}
    if(fence){code!.append(document.createTextNode(line+'\n'));continue;}if(!line.trim()){list=undefined;continue;}const h=/^(#{1,6}) (.*)$/.exec(line),li=/^\s*(?:[-*]|\d+\.) (.*)$/.exec(line);if(li){if(!list){list=document.createElement(/^\s*\d/.test(line)?'ol':'ul');root.append(list);}const item=document.createElement('li');inline(item,li[1]);list.append(item);continue;}list=undefined;const e=document.createElement(h?'h'+h[1].length:'p');inline(e,h?h[2]:line);root.append(e);
  }if(withoutTitle)root.querySelector('h1')?.remove();return root;
}

/** Read explicit section boundaries only; fenced examples never create fields. */
export function markdownFields(source:string,level=2):Record<string,string>{
 const ls=source.split(/\r?\n/),marks:{name:string;index:number}[]=[];let fence='';
 ls.forEach((line,index)=>{
  const m=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
  if(m){if(!fence)fence=m[1];else if(m[1][0]===fence[0]&&m[1].length>=fence.length&&!m[2].trim())fence='';return;}
  const h=/^(#{1,6}) (.*)$/.exec(line);if(!fence&&h&&h[1].length===level)marks.push({name:h[2],index});
 });
 return Object.fromEntries(marks.map((m,i)=>[m.name,ls.slice(m.index+1,marks[i+1]?.index??ls.length).join('\n').trim()]));
}
