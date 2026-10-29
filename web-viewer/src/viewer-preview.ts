import type {Design} from './graph';
export type PreviewActions={open:(design:Design,name:string)=>Promise<void>;update:(design:Design)=>Promise<void>;navigate:(activityId:string,stepId:string)=>void;redraw:()=>void};
export type ViewerPreview={start:(actions:PreviewActions)=>Promise<void>;controls:(design:Design,disabled:boolean)=>HTMLElement|undefined;detail:(design:Design,id:string|undefined,navigate:PreviewActions['navigate'])=>HTMLElement|undefined};
