// Research-only validator. This is not an Alder package reader or a migration tool.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

export function validate(doc) {
  const errors = [], pending = [], rows = [], graphEdges = [], ids = new Map(), infoOwners = new Map(), linkedRelations = new Set();
  const error = (code, where) => errors.push({code, where});
  const todo = (code, where) => pending.push({code, where});
  const array = (value, where) => {
    if (!Array.isArray(value)) { error('ARRAY_REQUIRED', where); return []; }
    return value;
  };
  const add = (item, type, where) => {
    if (!item || typeof item.id !== 'string' || !item.id.trim()) { error('ID_REQUIRED', where); return; }
    if (ids.has(item.id)) error('DUPLICATE_ID', item.id);
    else ids.set(item.id, {type, item});
  };
  if (doc?.candidateVersion !== 'scope-procedure-poc/1') error('CANDIDATE_VERSION', 'candidateVersion');
  const roles = array(doc?.roles, 'roles'), objects = array(doc?.objects, 'objects');
  const data = array(doc?.data, 'data'), relations = array(doc?.relations, 'relations');
  const activities = array(doc?.activities, 'activities'), exceptions = array(doc?.exceptions, 'exceptions');
  for (const r of roles) add(r, 'role', 'role');
  for (const o of objects) {
    add(o, 'object', 'object');
    if (typeof o.scope !== 'boolean') error('SCOPE_BOOLEAN', o.id);
    for (const i of array(o.information, `${o.id}.information`)) { add(i, 'information', o.id); infoOwners.set(i.id, o.id); }
  }
  for (const d of data) add(d, 'data', 'data');
  for (const r of relations) add(r, 'relation', 'relation');
  for (const a of activities) {
    add(a, 'activity', 'activity');
    for (const s of array(a.procedure?.steps, `${a.id}.steps`)) add(s, 'step', a.id);
    for (const r of array(a.results, `${a.id}.results`)) add(r, 'result', a.id);
  }
  for (const e of exceptions) add(e, 'exception', 'exception');
  const ref = (id, type, where) => {
    const target = ids.get(id);
    if (!target || target.type !== type) { error('INVALID_REFERENCE', `${where}:${type}:${id}`); return null; }
    return target.item;
  };
  for (const d of data) {
    const items = array(d.items, `${d.id}.items`);
    if (!items.length) error('DATA_EMPTY', d.id);
    const seen = new Set();
    for (const item of items) {
      ref(item.informationId, 'information', d.id);
      if (seen.has(item.informationId)) error('DUPLICATE_INFORMATION', d.id);
      seen.add(item.informationId);
    }
  }
  for (const r of relations) {
    if (r.kind === 'input') { ref(r.fromId, 'object', r.id); ref(r.toId, 'activity', r.id); }
    else if (r.kind === 'output') { ref(r.fromId, 'activity', r.id); ref(r.toId, 'object', r.id); }
    else { error('RELATION_DIRECTION', r.id); continue; }
    const d = ref(r.dataId, 'data', r.id);
    const objectId = r.kind === 'input' ? r.fromId : r.toId;
    for (const item of d?.items ?? []) if (infoOwners.get(item.informationId) !== objectId) error('DATA_OWNER', `${r.id}:${item.informationId}`);
    graphEdges.push({relationId:r.id, from:`${r.kind === 'input' ? 'object' : 'activity'}:${r.fromId}`, to:`${r.kind === 'input' ? 'activity' : 'object'}:${r.toId}`, dataId:r.dataId, direction:r.kind});
  }
  for (const e of exceptions) ref(e.activityId, 'activity', e.id);
  for (const a of activities) {
    if (typeof a.scope !== 'boolean') error('SCOPE_BOOLEAN', a.id);
    if (a.roleId === null) todo('WHO_UNRESOLVED', a.id);
    else if (typeof a.roleId !== 'string') error('SINGLE_WHO_REQUIRED', a.id);
    else ref(a.roleId, 'role', a.id);
    const steps = array(a.procedure?.steps, `${a.id}.steps`), orderRules = array(a.procedure?.orderRules, `${a.id}.orderRules`);
    const results = array(a.results, `${a.id}.results`);
    if (!steps.length) error('STEP_REQUIRED', a.id);
    if (!results.length) error('RESULT_REQUIRED', a.id);
    for (const r of results) if (typeof r.text !== 'string' || !r.text.trim()) error('RESULT_TEXT', r.id);
    const stepMap = new Map(steps.map((s, i) => [s.id, {step:s, index:i}])), projected = new Map();
    // The graph's Activity endpoint is always this Activity's Who in the table.
    // Its Role name may be unresolved; no additional Who/Activity mapping is needed.
    const who = `who:${a.id}`;
    const endpoint = (x, where) => {
      if (x?.kind === 'who' && Object.keys(x).length === 1) return who;
      if (x?.kind === 'object' && typeof x.id === 'string') { ref(x.id, 'object', where); return `object:${x.id}`; }
      error('INVALID_ENDPOINT', where); return null;
    };
    for (const s of steps) {
      if (typeof s.text !== 'string' || !s.text.trim()) error('STEP_TEXT', s.id);
      if (!['required','optional'].includes(s.obligation)) error('OBLIGATION', s.id);
      if (s.appliesWhen !== null && (typeof s.appliesWhen !== 'string' || !s.appliesWhen.trim())) error('APPLIES_WHEN', s.id);
      if (!('exchange' in s)) { rows.push({stepId:s.id, kind:'local', text:s.text}); continue; }
      if (s.exchange === null) { todo('EXCHANGE_UNRESOLVED',s.id); rows.push({stepId:s.id,kind:'unresolved',text:s.text}); continue; }
      if (typeof s.exchange !== 'object' || Array.isArray(s.exchange)) { error('EXCHANGE_SHAPE',s.id); continue; }
      const x = s.exchange;
      if (!['request','response','notification'].includes(x.phase)) error('PHASE', s.id);
      if (typeof x.operation !== 'string' || !x.operation.trim()) error('OPERATION', s.id);
      if (x.phase === 'request') {
        if (!['create','read','update','delete','not-applicable','undecided'].includes(x.effect)) error('REQUEST_EFFECT', s.id);
        if (x.effect === 'undecided') todo('EFFECT_UNRESOLVED', s.id);
        if ('replyToStepId' in x) error('REQUEST_REPLY', s.id);
      } else {
        if ('effect' in x) error('NON_REQUEST_EFFECT', s.id);
        if (x.phase === 'response' && !(typeof x.replyToStepId === 'string' || x.replyToStepId === null)) error('REPLY_REFERENCE_REQUIRED', s.id);
        if (x.phase === 'response' && x.replyToStepId === null) todo('REPLY_UNRESOLVED', s.id);
        if (x.phase === 'notification' && 'replyToStepId' in x) error('NOTIFICATION_REPLY', s.id);
      }
      let from = null, to = null, dataId = null, direction = null;
      if (typeof x.relationId === 'string' && !('unlinked' in x)) {
        const r = ref(x.relationId, 'relation', s.id);
        if (r) {
          if (r.kind === 'input' && r.toId === a.id) { from = `object:${r.fromId}`; to = who; direction = 'input'; }
          else if (r.kind === 'output' && r.fromId === a.id) { from = who; to = `object:${r.toId}`; direction = 'output'; }
          else error('RELATION_ACTIVITY_DIRECTION', s.id);
          if (from && to) linkedRelations.add(r.id);
          dataId = r.dataId;
        }
      } else if (!('relationId' in x) && x.unlinked && typeof x.unlinked === 'object') {
        const u = x.unlinked;
        from = endpoint(u.from, s.id); to = endpoint(u.to, s.id);
        if (u.data?.status === 'ref') { ref(u.data.dataId, 'data', s.id); dataId = u.data.dataId; }
        else if (u.data?.status === 'unknown') todo('DATA_UNRESOLVED', s.id);
        else if (u.data?.status !== 'none') error('UNLINKED_DATA', s.id);
        if (typeof u.reason !== 'string' || !u.reason.trim()) error('UNLINKED_REASON', s.id);
        todo('UNLINKED_RELATION', s.id);
      } else error('EXCHANGE_BINDING', s.id);
      projected.set(s.id, {from,to,phase:x.phase});
      rows.push({stepId:s.id, kind:'exchange', relationId:x.relationId ?? null, from, to, dataId, direction, phase:x.phase, operation:x.operation, effect:x.effect ?? null, replyToStepId:x.replyToStepId ?? null});
    }
    for (const s of steps) {
      const x = s.exchange;
      if (x?.phase !== 'response' || typeof x.replyToStepId !== 'string') continue;
      const request = stepMap.get(x.replyToStepId), rq = projected.get(x.replyToStepId), rs = projected.get(s.id);
      if (!request || request.step.exchange?.phase !== 'request') { error('REPLY_NOT_REQUEST', s.id); continue; }
      if (request.index >= stepMap.get(s.id).index) error('REPLY_STANDARD_ORDER', s.id);
      if (rq?.from && rq?.to && rs?.from && rs?.to && (rq.from !== rs.to || rq.to !== rs.from)) error('REPLY_DIRECTION', s.id);
    }
    const edges = new Map(steps.map(s => [s.id, []])), swaps = [], beforeSeen = new Set(), swapSeen = new Set();
    for (const rule of orderRules) {
      if (rule.kind === 'before') {
        if (!stepMap.has(rule.beforeId) || !stepMap.has(rule.afterId) || rule.beforeId === rule.afterId) { error('ORDER_REFERENCE', a.id); continue; }
        const key=JSON.stringify([rule.beforeId,rule.afterId]);
        if (beforeSeen.has(key)) error('DUPLICATE_ORDER', a.id);
        beforeSeen.add(key);
        edges.get(rule.beforeId).push(rule.afterId);
        if (stepMap.get(rule.beforeId).index >= stepMap.get(rule.afterId).index) error('STANDARD_ORDER', a.id);
      } else if (rule.kind === 'interchangeable' && Array.isArray(rule.stepIds) && rule.stepIds.length >= 2 && new Set(rule.stepIds).size === rule.stepIds.length && rule.stepIds.every(id => stepMap.has(id))) {
        const key=JSON.stringify([...rule.stepIds].sort());
        if (swapSeen.has(key)) error('DUPLICATE_ORDER', a.id);
        swapSeen.add(key); swaps.push(rule.stepIds);
      }
      else error('ORDER_RULE', a.id);
    }
    const reaches = (from,to) => { const queue=[from], seen=new Set(); while(queue.length) { const id=queue.pop(); if(seen.has(id)) continue; seen.add(id); for(const n of edges.get(id) ?? []) { if(n===to) return true; queue.push(n); } } return false; };
    for (const s of steps) if (reaches(s.id,s.id)) error('ORDER_CYCLE', a.id);
    for (const group of swaps) for (const left of group) for (const right of group) if (left!==right && reaches(left,right)) error('INTERCHANGEABLE_CONFLICT', a.id);
  }
  // Coverage is a review diagnostic, not proof of a business defect. An old or
  // partially structured document must not acquire a fabricated Procedure row.
  for (const r of relations) if (['input','output'].includes(r.kind) && !linkedRelations.has(r.id)) todo('RELATION_WITHOUT_STEP',r.id);
  return {errors,pending,graphEdges,rows};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const path = process.argv[2];
  if (!path) { console.error('Usage: node validate.mjs fixture.json'); process.exitCode = 2; }
  else {
    try { const result = validate(JSON.parse(await readFile(path,'utf8'))); console.log(JSON.stringify(result,null,2)); if(result.errors.length) process.exitCode=1; }
    catch (e) { console.error(e.message); process.exitCode=2; }
  }
}
