/** Native SVG dashes start at path distance zero. Different-length paths can
 * therefore fill one another's gaps after merging. Anchor straight runs to
 * world coordinates instead: x for horizontal, y for vertical, independent of
 * traversal direction. Keep the short rounded corners continuous, as arrows
 * are, while the shared straight stretches retain their gaps.
 * Input is the router's absolute M/L/Q grammar, not arbitrary imported SVG.
 */
export function exceptionSegments(path:string):{path:string;offset?:number}[]{
 const tokens=path.match(/[MLQ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)??[];
 const segments:{path:string;offset?:number}[]=[];
 let x=0,y=0;
 for(let i=0;i<tokens.length;){
  const op=tokens[i++];
  if(op==='M'){x=Number(tokens[i++]);y=Number(tokens[i++]);}
  else if(op==='L'){
   const nx=Number(tokens[i++]),ny=Number(tokens[i++]);
   if(nx!==x&&ny!==y)throw new Error('Exception straight run must be orthogonal');
   const a=ny===y?x:y,b=ny===y?nx:ny;
   // Negative traversal maps t back to the same painted interval [11k,11k+6].
   const offset=((b>=a?a:6-a)%11+11)%11;
   segments.push({path:`M${x},${y} L${nx},${ny}`,offset});x=nx;y=ny;
  }else if(op==='Q'){
   const cx=Number(tokens[i++]),cy=Number(tokens[i++]),nx=Number(tokens[i++]),ny=Number(tokens[i++]);
   segments.push({path:`M${x},${y} Q${cx},${cy} ${nx},${ny}`});x=nx;y=ny;
  }else throw new Error('Unsupported exception route command');
 }
 return segments;
}
