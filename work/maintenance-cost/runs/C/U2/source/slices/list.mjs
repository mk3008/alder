import { requireCondition } from '../validation.mjs';

export function list(records, filter = {}) {
  const itemContains = 'itemContains' in filter ? filter.itemContains : '';
  requireCondition(typeof itemContains === 'string', 'Invalid item filter');
  return [...records.values()]
    .filter(record => record.item.includes(itemContains))
    .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    .map(({ note, ...record }) => record);
}
