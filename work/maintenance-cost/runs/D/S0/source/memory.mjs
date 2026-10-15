// Outward storage adapter. All persisted fields are primitives.
export function createMemoryRepository() {
  const records = new Map();
  return {
    has: id => records.has(id),
    get: id => records.has(id) ? { ...records.get(id) } : undefined,
    save: record => { records.set(record.id, { ...record }); },
    all: () => Array.from(records.values(), record => ({ ...record })),
  };
}
