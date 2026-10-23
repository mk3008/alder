/** Shared vertical rhythm for business cards and state boxes, in world units.
 * Captions own their measured line box; neither diagram adds a second row gap. */
export const CAPTION_CLEARANCE=24;
export const CAPTION_LINE_HEIGHT=20;
export const CAPTION_LINE_STEP=22;
export function captionTop(nodeBottom:number,offset=0):number{
 return nodeBottom+CAPTION_CLEARANCE+offset;
}
export function captionRowStep(nodeHeight:number,captionHeight:number):number{
 return nodeHeight+Math.max(44,captionHeight>0?CAPTION_CLEARANCE+captionHeight+CAPTION_CLEARANCE:0);
}
