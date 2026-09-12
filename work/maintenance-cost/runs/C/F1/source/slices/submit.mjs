import { commandContext, nonemptyString, positiveInteger, requireCondition, trimmedText } from '../validation.mjs';

export function submit(records, input, actor, now) {
  commandContext(actor, now, 'requester');
  requireCondition(input !== null && typeof input === 'object', 'Invalid input');
  const { id, item, quantity, requestedYen, reason } = input;
  requireCondition(nonemptyString(id) && !records.has(id), 'Invalid or duplicate ID');
  const note = 'note' in input ? input.note : '';
  requireCondition(typeof note === 'string' && note.length <= 280, 'Invalid note');
  const record = {
    id, requesterId: actor.id, item: trimmedText(item),
    quantity: positiveInteger(quantity), requestedYen: positiveInteger(requestedYen),
    reason: trimmedText(reason), submittedAt: now, status: 'submitted', note,
  };
  records.set(id, record);
  return { ...record };
}
