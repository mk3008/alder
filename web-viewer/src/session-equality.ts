import type {Session} from './session';

// Compare only the plain data stored by the Viewer. File handles are opaque:
// looking at their enumerable properties would mistake different files for
// equal values, so those sessions keep the conservative generation check.
export function sameSession(a:Session|undefined,b:Session):boolean{
  if(!a||!Array.isArray(a.tabs)||!Array.isArray(b.tabs)||[...a.tabs,...b.tabs].some(tab=>tab.handle!==undefined))return false;
  const seen=new Set<object>();
  function same(left:unknown,right:unknown):boolean{
    if(Object.is(left,right))return true;
    if(!left||!right||typeof left!=='object'||typeof right!=='object')return false;
    if(seen.has(left)||seen.has(right))return false;
    const plain=(value:object)=>Array.isArray(value)||Object.getPrototypeOf(value)===null||Object.getPrototypeOf(value)?.constructor?.name==='Object';
    if(!plain(left)||!plain(right)||Array.isArray(left)!==Array.isArray(right))return false;
    if(Array.isArray(left)&&left.length!==(right as unknown[]).length)return false;
    seen.add(left);seen.add(right);
    const l=left as Record<string,unknown>,r=right as Record<string,unknown>;
    const keys=Object.keys(l),other=Object.keys(r);
    const equal=keys.length===other.length&&keys.every(key=>Object.hasOwn(r,key)&&same(l[key],r[key]));
    seen.delete(left);seen.delete(right);return equal;
  }
  return same(a,b);
}
