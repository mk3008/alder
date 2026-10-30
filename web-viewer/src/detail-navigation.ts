/** Shared navigation rule; current detail identity is independent of selection.
 * Verification authority: verification/check-items.json, VIEW-NAV-001..003.
 */
export function canOpenDetail(target:string,currentDetail?:string|null):boolean{
 return target!==currentDetail;
}
