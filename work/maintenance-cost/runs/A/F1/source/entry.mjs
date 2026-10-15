function requireNonemptyString(value, name) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} must be a nonempty string`);
  }
}

function trimmedText(value, name) {
  requireNonemptyString(value, name);
  const result = value.trim();
  if (!result) throw new Error(`${name} must contain text`);
  return result;
}

function positiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive safe integer`);
  }
}

function validateCommand(actor, role, now) {
  if (actor === null || typeof actor !== 'object') throw new Error('Invalid actor');
  requireNonemptyString(actor.id, 'Actor ID');
  if (actor.role !== role) throw new Error('Wrong role');
  if (!Number.isSafeInteger(now) || now < 0) throw new Error('Invalid timestamp');
}

export function createApp() {
  const records = new Map();
  const copy = record => ({ ...record, note: record.note ?? '' });

  function get(id) {
    if (!records.has(id)) throw new Error('Unknown ID');
    return records.get(id);
  }

  function transition(id, actor, role, now, fromStatus, fields) {
    validateCommand(actor, role, now);
    const current = get(id);
    if (current.status !== fromStatus) throw new Error('Invalid transition');
    const result = { ...current, ...fields };
    records.set(id, result);
    return copy(result);
  }

  return {
    submit(input, actor, now) {
      validateCommand(actor, 'requester', now);
      if (input === null || typeof input !== 'object') throw new Error('Invalid input');
      const { id, item, quantity, requestedYen, reason } = input;
      requireNonemptyString(id, 'ID');
      if (records.has(id)) throw new Error('Duplicate ID');
      const cleanItem = trimmedText(item, 'Item');
      const cleanReason = trimmedText(reason, 'Reason');
      positiveInteger(quantity, 'Quantity');
      positiveInteger(requestedYen, 'Requested yen');
      const note = 'note' in input ? input.note : '';
      if (typeof note !== 'string' || note.length > 280) throw new Error('Invalid note');
      const record = {
        id, requesterId: actor.id, item: cleanItem, quantity, requestedYen,
        reason: cleanReason, submittedAt: now, status: 'submitted', note,
      };
      records.set(id, record);
      return copy(record);
    },
    approve(id, actor, now) {
      const role = get(id).requestedYen >= 100000 ? 'seniorApprover' : 'approver';
      validateCommand(actor, role, now);
      return transition(id, actor, role, now, 'submitted', {
        approvedAt: now, approvedBy: actor.id, status: 'approved',
      });
    },
    reject(id, reason, actor, now) {
      validateCommand(actor, 'approver', now);
      const rejectionReason = trimmedText(reason, 'Rejection reason');
      return transition(id, actor, 'approver', now, 'submitted', {
        rejectedAt: now, rejectedBy: actor.id, rejectionReason, status: 'rejected',
      });
    },
    purchase(id, actualYen, actor, now) {
      validateCommand(actor, 'buyer', now);
      positiveInteger(actualYen, 'Actual yen');
      return transition(id, actor, 'buyer', now, 'approved', {
        purchasedAt: now, purchasedBy: actor.id, actualYen, status: 'purchased',
      });
    },
    detail(id) {
      return copy(get(id));
    },
    list(filter = {}) {
      const itemContains = 'itemContains' in filter ? filter.itemContains : '';
      if (typeof itemContains !== 'string') throw new Error('Invalid item filter');
      return [...records.keys()].sort()
        .filter(id => records.get(id).item.includes(itemContains)).map(id => {
        const { note, ...summary } = records.get(id);
        return summary;
      });
    },
  };
}
