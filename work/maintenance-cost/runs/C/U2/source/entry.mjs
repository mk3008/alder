import { submit } from './slices/submit.mjs';
import { approve } from './slices/approve.mjs';
import { reject } from './slices/reject.mjs';
import { purchase } from './slices/purchase.mjs';
import { detail } from './slices/detail.mjs';
import { list } from './slices/list.mjs';

export function createApp() {
  const records = new Map();
  return {
    submit: (input, actor, now) => submit(records, input, actor, now),
    approve: (id, actor, now) => approve(records, id, actor, now),
    reject: (id, reason, actor, now) => reject(records, id, reason, actor, now),
    purchase: (id, actualYen, actor, now) => purchase(records, id, actualYen, actor, now),
    detail: id => detail(records, id),
    list: (filter = {}) => list(records, filter),
  };
}
