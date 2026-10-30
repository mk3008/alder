import type {ConceptContext} from './concept-model';
import type {ReviewGroup} from './concept-views';
export type SampleBlock={card:string;columns:string[];rows:(string|number)[][];keyIds:(string|undefined)[][];empty?:string};
export type DataExample={id:string;group:string;name:string;when:string;meaning:string;blocks:SampleBlock[];note?:string};
export type Evidence={activityId:string;scene:string;basis:string};
export type Capability={id:string;title:string;description:string;meta:unknown;samples:Omit<DataExample,'group'>[]};
export type ReviewContent={id:string;title:string;description:string;reviewer:{role:string};relatedActivities:{id:string;name:string}[];structureStatements:{id:string;title:string;description:string;sampleIds:string[]}[];capabilities:Capability[];limitations:{id:string;title:string;description:string;reason:string;meta:unknown}[];meta:{questions:string[]}};
type RawBlock={card:string;columns:{id:string;name:string}[];rows:{cells:{columnId:string;value:string|number;linkId?:string}[]}[];empty?:string};
type RawSample={id:string;name:string;when:string;meaning:string;blocks:RawBlock[];note?:string};
type RawCapability={id:string;title:string;description:string;meta:unknown;samples:RawSample[]};
function projectSample(sample:RawSample):Omit<DataExample,'group'>{
 return {...sample,blocks:sample.blocks.map(block=>{
  const cells=block.rows.map(row=>block.columns.map(column=>{
   const cell=row.cells.find(item=>item.columnId===column.id);
   if(!cell)throw Error('Missing sample cell: '+column.id);
   return cell;
  }));
  return {card:block.card,columns:block.columns.map(column=>column.name),rows:cells.map(row=>row.map(cell=>cell.value)),
   keyIds:cells.map(row=>row.map(cell=>cell.linkId)),empty:block.empty};
 })};
}
export function createDataExamples({model,business}:ConceptContext){
 const activityFor=(id:string)=>{const found=business.activities.find(activity=>activity.id===id);if(!found)throw Error('Unknown activity: '+id);return found;};
 const roleName=(id:string)=>{const found=business.roles?.find(role=>role.id===id);if(!found)throw Error('Unknown role: '+id);return found.name;};
const reviewContents:ReviewContent[]=model.reviewGroups.map(group=>({
 id:group.id,title:group.title,description:group.description,reviewer:{role:roleName(group.reviewer.roleId)},
 relatedActivities:group.relatedActivityIds.map(id=>{const a=activityFor(id);return{id:a.id,name:a.name};}),
 structureStatements:group.structureStatements,
 capabilities:(group.capabilities as RawCapability[]).map(capability=>({...capability,samples:capability.samples.map(projectSample)})),
 limitations:group.limitations,meta:{questions:group.meta.questions}
}));
const contentFor=(group:string)=>reviewContents.find(content=>content.id===group);
const capabilityFor=(group:string,sample:string)=>contentFor(group)?.capabilities.find(capability=>capability.samples.some(example=>example.id===sample));
// A flat adapter preserves scene IDs/URLs; nested capability JSON is the sole content source.
const dataExamples:DataExample[]=reviewContents.flatMap(group=>group.capabilities.flatMap(capability=>capability.samples.map(sample=>({...sample,group:group.id}))));
const keyPalette=['yellow','cyan','green','blue','purple','orange'];
function colorKeyCell(cell:HTMLElement,key:string,colors:Map<string,string>){
 let tone=colors.get(key);
 if(!tone){tone=keyPalette[colors.size]??`extra-${colors.size}`;colors.set(key,tone);}
 cell.dataset.sampleKey=key;cell.dataset.keyTone=tone;cell.className='data-example-key';
 if(tone.startsWith('extra-')){
  const hue=(Number(tone.slice(6))*137.508%360).toFixed(2);
  cell.style.setProperty('--sample-key-extra-light',`hsl(${hue} 26% 78%)`);
  cell.style.setProperty('--sample-key-extra-dark',`hsl(${hue} 24% 25%)`);
 }
}
const examplesFor=(group:string)=>dataExamples.filter(example=>example.group===group);
const findDataExample=(group:string,id:string|undefined|null)=>examplesFor(group).find(example=>example.id===id);
function add(root:HTMLElement,tag:string,value:string){const el=root.ownerDocument.createElement(tag);el.textContent=value;root.append(el);return el;}
function renderDataExample(root:HTMLElement,group:ReviewGroup,id:string,change:(id:string)=>void){
 const document=root.ownerDocument,example=findDataExample(group.id,id);if(!example)throw Error('Unknown data example: '+id);root.replaceChildren();root.dataset.dataExample=id;
 const keyColors=new Map<string,string>();
 if(model.presentation.sampleCaption)add(root,'p',model.presentation.sampleCaption).className='data-example-caption';
 const label=document.createElement('label');label.className='data-example-picker';add(label,'span','場面');const select=document.createElement('select');select.setAttribute('aria-label','データ例の場面');for(const capability of contentFor(group.id)?.capabilities??[]){const options=document.createElement('optgroup');options.label=capability.title;for(const candidate of capability.samples){const option=document.createElement('option');option.value=candidate.id;option.textContent=candidate.name;options.append(option);}select.append(options);}select.value=id;select.onchange=()=>change(select.value);label.append(select);root.append(label);
 const capability=capabilityFor(group.id,id)!;root.dataset.capability=capability.id;add(root,'h2',capability.title);add(root,'p',capability.description).className='data-example-capability';add(root,'h3',example.name).className='data-example-scene';add(root,'p',example.when).className='data-example-when';add(root,'p',example.meaning).className='data-example-meaning';
 for(const block of example.blocks){const section=document.createElement('section');section.className='data-example-block';section.dataset.exampleCard=block.card;add(section,'h3',group.concepts[block.card].name);const wrap=document.createElement('div');wrap.className='data-example-table';wrap.tabIndex=0;wrap.setAttribute('role','region');wrap.setAttribute('aria-label',group.concepts[block.card].name+'のデータ表');const table=document.createElement('table');table.setAttribute('aria-label',group.concepts[block.card].name+'のデータ例');const caption=document.createElement('caption');caption.textContent=group.concepts[block.card].name+'に入る情報';table.append(caption);const head=document.createElement('thead'),tr=document.createElement('tr');for(const column of block.columns){const th=add(tr,'th',column);th.setAttribute('scope','col');}head.append(tr);table.append(head);const body=document.createElement('tbody');for(const [rowIndex,row] of block.rows.entries()){const tr=document.createElement('tr');for(const [index,cell] of row.entries()){const td=add(tr,'td',String(cell));const key=block.keyIds[rowIndex][index];if(key){colorKeyCell(td,key,keyColors);td.title=block.columns[index]+'：'+cell;}}body.append(tr);}table.append(body);wrap.append(table);section.append(wrap);if(!block.rows.length)add(section,'p',block.empty??'データはありません。');root.append(section);}
 if(example.note)add(root,'p',example.note).className='data-example-note';
}
return {reviewContents,dataExamples,contentFor,capabilityFor,examplesFor,findDataExample,renderDataExample};
}
export type DataExampleIndex=ReturnType<typeof createDataExamples>;
