const books = new Map();
const members = new Map();

export function reset() { books.clear(); members.clear(); }
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }

const LOAN_PERIOD_MS = 14 * 24 * 60 * 60 * 1000;

function createLoan({ bookId, memberId, now }) {
  return { bookId, memberId, dueAt: now + LOAN_PERIOD_MS };
}

function checkoutBook({ bookId, memberId, now }, bookRepository, memberRepository) {
  const book = bookRepository.findById(bookId);
  if (!book || book.copies <= 0) {
    throw new Error("Book is unavailable");
  }

  const member = memberRepository.findById(memberId);
  if (!member || !member.active) {
    throw new Error("Member is inactive");
  }

  bookRepository.save({ ...book, copies: book.copies - 1 });
  return createLoan({ bookId, memberId, now });
}

const bookRepository = {
  findById(id) { return books.get(id); },
  save(book) { books.set(book.id, book); },
};

const memberRepository = {
  findById(id) { return members.get(id); },
};

export function checkout(command) {
  return checkoutBook(command, bookRepository, memberRepository);
}
