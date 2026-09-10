const books = new Map();
const members = new Map();

export function reset() { books.clear(); members.clear(); }
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }
