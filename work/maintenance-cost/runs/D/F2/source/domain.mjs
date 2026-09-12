// Pure domain rules: no dependency on application orchestration or storage.
export function nonempty(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`Invalid ${name}`);
  return value;
}
function trimmed(value, name) {
  nonempty(value, name);
  return nonempty(value.trim(), name);
}
function positive(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`Invalid ${name}`);
  return value;
}
export function authorize(actor, now, role) {
  if (!actor || typeof actor !== 'object') throw new Error('Invalid actor');
  nonempty(actor.id, 'actor ID');
  if (actor.role !== role) throw new Error('Wrong role');
  if (!Number.isSafeInteger(now) || now < 0) throw new Error('Invalid timestamp');
}
function note(value) {
  if (typeof value !== 'string' || value.length > 280) throw new Error('Invalid note');
  return value;
}
export function submission(input, requesterId, now) {
  if (!input || typeof input !== 'object') throw new Error('Invalid input');
  return {
    id: nonempty(input.id, 'ID'), requesterId,
    item: trimmed(input.item, 'item'), quantity: positive(input.quantity, 'quantity'),
    requestedYen: positive(input.requestedYen, 'requested yen'),
    reason: trimmed(input.reason, 'reason'), submittedAt: now, status: 'submitted',
    note: 'note' in input ? note(input.note) : '',
  };
}
function requireStatus(record, status) {
  if (record.status !== status) throw new Error('Invalid transition');
}
export function approval(record, actor, now) {
  authorize(actor, now, record.requestedYen >= 50000 ? 'seniorApprover' : 'approver');
  requireStatus(record, 'submitted');
  return { ...record, approvedAt: now, approvedBy: actor.id, status: 'approved' };
}
export function rejection(record, reason, actorId, now) {
  requireStatus(record, 'submitted');
  return { ...record, rejectionReason: trimmed(reason, 'rejection reason'), rejectedAt: now, rejectedBy: actorId, status: 'rejected' };
}
export function purchase(record, actualYen, actorId, now) {
  requireStatus(record, 'approved');
  return { ...record, actualYen: positive(actualYen, 'actual yen'), purchasedAt: now, purchasedBy: actorId, status: 'purchased' };
}
