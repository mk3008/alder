const roles = new Set(['requester', 'approver', 'seniorApprover', 'buyer']);

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function nonemptyString(value) {
  return typeof value === 'string' && value.length > 0;
}

function validateCommand(actor, now) {
  requireCondition(actor && nonemptyString(actor.id) && roles.has(actor.role), 'Invalid actor');
  requireCondition(Number.isSafeInteger(now) && now >= 0, 'Invalid timestamp');
}

function requireRole(actor, role) {
  requireCondition(actor.role === role, 'Wrong role');
}

function positiveInteger(value) {
  requireCondition(Number.isSafeInteger(value) && value > 0, 'Expected positive safe integer');
  return value;
}

function trimmedText(value) {
  requireCondition(typeof value === 'string' && value.trim().length > 0, 'Expected nonempty text');
  return value.trim();
}

function submissionNote(input) {
  if (!Object.hasOwn(input, 'note')) return '';
  requireCondition(typeof input.note === 'string' && input.note.length <= 280, 'Invalid note');
  return input.note;
}

function detailRecord(record) {
  return { ...record, note: record.note ?? '' };
}

// Approval roles are exclusive and depend on the requested total, not unit price.
function requireApprovalAuthority(record, actor) {
  requireRole(actor, record.requestedYen >= 50000 ? 'seniorApprover' : 'approver');
}

export function createApp() {
  const records = new Map();

  function lookup(id, status) {
    requireCondition(records.has(id), 'Unknown request');
    const record = records.get(id);
    if (status !== undefined) requireCondition(record.status === status, 'Invalid transition');
    return record;
  }

  function save(record) {
    records.set(record.id, record);
    return detailRecord(record);
  }

  return {
    submit(input, actor, now) {
      validateCommand(actor, now);
      requireRole(actor, 'requester');
      requireCondition(input && nonemptyString(input.id), 'Invalid ID');
      requireCondition(!records.has(input.id), 'Duplicate ID');
      return save({
        id: input.id,
        requesterId: actor.id,
        item: trimmedText(input.item),
        quantity: positiveInteger(input.quantity),
        requestedYen: positiveInteger(input.requestedYen),
        reason: trimmedText(input.reason),
        note: submissionNote(input),
        submittedAt: now,
        status: 'submitted',
      });
    },

    approve(id, actor, now) {
      validateCommand(actor, now);
      const record = lookup(id, 'submitted');
      requireApprovalAuthority(record, actor);
      return save({ ...record, approvedAt: now, approvedBy: actor.id, status: 'approved' });
    },

    reject(id, reason, actor, now) {
      validateCommand(actor, now);
      requireRole(actor, 'approver');
      const record = lookup(id, 'submitted');
      const rejectionReason = trimmedText(reason);
      return save({ ...record, rejectedAt: now, rejectedBy: actor.id, rejectionReason, status: 'rejected' });
    },

    purchase(id, actualYen, actor, now) {
      validateCommand(actor, now);
      requireRole(actor, 'buyer');
      const record = lookup(id, 'approved');
      positiveInteger(actualYen);
      return save({ ...record, purchasedAt: now, purchasedBy: actor.id, actualYen, status: 'purchased' });
    },

    detail(id) {
      return detailRecord(lookup(id));
    },

    list(filter = {}) {
      const hasItemContains = Object.hasOwn(filter, 'itemContains');
      const itemContains = hasItemContains ? filter.itemContains : '';
      requireCondition(typeof itemContains === 'string', 'Invalid item filter');
      return [...records.keys()].sort().filter(id => records.get(id).item.includes(itemContains)).map(id => {
        const { note, ...summary } = records.get(id);
        return summary;
      });
    },
  };
}
