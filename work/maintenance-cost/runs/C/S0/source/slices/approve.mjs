import { commandContext, target } from '../validation.mjs';

export function approve(records, id, actor, now) {
  commandContext(actor, now, 'approver');
  const record = { ...target(records, id, 'submitted'), approvedAt: now, approvedBy: actor.id, status: 'approved' };
  records.set(id, record);
  return { ...record };
}
