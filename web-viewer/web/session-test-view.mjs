/** Assertions for existing single-document features use a joined read model.
 * This never writes to IndexedDB. Canonical storage is asserted separately in
 * test-group-workspace-dom.mjs; document data is not duplicated in production. */
export function joinedSession(value){
 if(!value||!('document' in value)&&value.format!==2)return value;
 const {format:_format,views,recovery:_recovery,document,tabs:live,...settings}=value;
 return {...settings,tabs:(views??live??[]).map(view=>({...document,...view,key:view.key}))};
}
