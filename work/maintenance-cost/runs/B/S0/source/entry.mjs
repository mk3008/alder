const roles = new Set(['requester', 'approver', 'buyer']);

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

// Keep the approval authority decision in one place for future amount-based rules.
// The record supplies requestedYen; today's rule deliberately has no amount limit.
function requireApprovalAuthority(record, actor) {
  requireRole(actor, 'approver');
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
    return { ...record };
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
      return { ...lookup(id) };
    },

    list() {
      return [...records.keys()].sort().map(id => ({ ...records.get(id) }));
    },
  };
}
