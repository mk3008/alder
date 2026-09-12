export function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}
export function nonemptyString(value) {
  return typeof value === 'string' && value.length > 0;
}
export function commandContext(actor, now, role) {
  requireCondition(actor !== null && typeof actor === 'object' && nonemptyString(actor.id) && actor.role === role, 'Invalid actor or role');
  requireCondition(Number.isSafeInteger(now) && now >= 0, 'Invalid timestamp');
}
export function positiveInteger(value) {
  requireCondition(Number.isSafeInteger(value) && value > 0, 'Expected positive safe integer');
  return value;
}
export function trimmedText(value) {
  requireCondition(typeof value === 'string' && value.trim().length > 0, 'Expected nonempty text');
  return value.trim();
}
export function target(records, id, status) {
  requireCondition(records.has(id), 'Unknown ID');
  const record = records.get(id);
  if (status !== undefined) requireCondition(record.status === status, 'Invalid transition');
  return { note: '', ...record };
}
