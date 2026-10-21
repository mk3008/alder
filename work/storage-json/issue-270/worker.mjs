// Bundled into the standalone HTML; production parsers are read-only snapshots at build time.
self.onmessage=event=>{
 const {token,text,maxNodes=5000}=event.data;
 try{
  const start=performance.now();const pkg=parseStrict(text),parsed=performance.now();
  const result=validate(pkg),checked=performance.now();
  const nodes=pkg.documents.filter(d=>d.kind==='businessDesign').reduce((s,d)=>s+d.objects.length+d.activities.length,0);
  demand(nodes<=maxNodes,'PoC element budget exceeded: '+nodes);
  const graphs=pkg.documents.filter(d=>d.kind==='businessDesign').map(d=>{const graph=graphV1(pkg,d.id);baseline.validateGraph(graph);return {documentId:d.id,graph};});
  self.postMessage({token,pkg,graphs,result,metrics:{parseMs:parsed-start,validationMs:checked-parsed,projectionMs:performance.now()-checked,nodes}});
 }catch(error){self.postMessage({token,error:error.message});}
};
