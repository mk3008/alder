const books = new Map();
const members = new Map();

export function reset() { books.clear(); members.clear(); }
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }

export function checkout({ bookId, memberId, now }) {
  const book = books.get(bookId);
  const member = members.get(memberId);

  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  book.copies -= 1;
  return { bookId, memberId, dueAt: now + 14 * 24 * 60 * 60 * 1000 };
}
