import { commandContext, positiveInteger, target } from '../validation.mjs';

export function purchase(records, id, actualYen, actor, now) {
  commandContext(actor, now, 'buyer');
  const record = {
    ...target(records, id, 'approved'), actualYen: positiveInteger(actualYen),
    purchasedAt: now, purchasedBy: actor.id, status: 'purchased',
  };
  records.set(id, record);
  return { ...record };
}
