import { commandContext, target, trimmedText } from '../validation.mjs';

export function reject(records, id, reason, actor, now) {
  commandContext(actor, now, 'approver');
  const record = {
    ...target(records, id, 'submitted'), rejectionReason: trimmedText(reason),
    rejectedAt: now, rejectedBy: actor.id, status: 'rejected',
  };
  records.set(id, record);
  return { ...record };
}
