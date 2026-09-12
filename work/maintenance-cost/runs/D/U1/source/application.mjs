import { authorize, submission, approval, rejection, purchase } from './domain.mjs';

// Repository port: has(id), get(id), save(record), all().
// Storage is injected; use cases depend only on this port and domain rules.
export function createWorkflow(repository) {
  function detail(id) {
    const record = repository.get(id);
    if (!record) throw new Error('Unknown ID');
    return { note: '', ...record };
  }
  function save(record) {
    repository.save(record);
    return { ...record };
  }
  return {
    submit(input, actor, now) {
      authorize(actor, now, 'requester');
      const record = submission(input, actor.id, now);
      if (repository.has(record.id)) throw new Error('Duplicate ID');
      return save(record);
    },
    approve(id, actor, now) {
      authorize(actor, now, 'approver');
      return save(approval(detail(id), actor.id, now));
    },
    reject(id, reason, actor, now) {
      authorize(actor, now, 'approver');
      return save(rejection(detail(id), reason, actor.id, now));
    },
    purchase(id, actualYen, actor, now) {
      authorize(actor, now, 'buyer');
      return save(purchase(detail(id), actualYen, actor.id, now));
    },
    detail,
    list() {
      return repository.all().map(({ note, ...record }) => record)
        .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    },
  };
}
