export function list(records) {
  return [...records.values()]
    .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
    .map(record => ({ ...record }));
}
