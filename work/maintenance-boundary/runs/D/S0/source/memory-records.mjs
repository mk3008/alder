export function createMemoryRecords() {
  const records = new Map();
  return {
    get(id) {
      const record = records.get(id);
      return record ? {...record} : undefined;
    },
    put(record) {
      records.set(record.id, {...record});
    },
  };
}
