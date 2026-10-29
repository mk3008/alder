import type {Design} from './graph';
export type PreviewActions={open:(design:Design,name:string)=>Promise<void>;update:(design:Design)=>Promise<void>;navigate:(activityId:string,stepId:string)=>void;redraw:()=>void};
export type ViewerPreview={start:(actions:PreviewActions)=>Promise<void>;controls:(design:Design,disabled:boolean)=>HTMLElement|undefined;detail:(design:Design,id:string|undefined,navigate:PreviewActions['navigate'])=>HTMLElement|undefined};
// Only d2-entry installs this before loading the same main module as index.html.
let preview:ViewerPreview|undefined;
export function installViewerPreview(value:ViewerPreview){preview=value;}
export function currentViewerPreview(){return preview;}
