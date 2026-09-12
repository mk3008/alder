import { commandContext, target } from '../validation.mjs';

export function approve(records, id, actor, now) {
  const submitted = target(records, id, 'submitted');
  const requiredRole = submitted.requestedYen >= 100000 ? 'seniorApprover' : 'approver';
  commandContext(actor, now, requiredRole);
  const record = { ...submitted, approvedAt: now, approvedBy: actor.id, status: 'approved' };
  records.set(id, record);
  return { ...record };
}
