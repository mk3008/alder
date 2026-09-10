import { checkoutBook } from "./application/checkoutBook.js";
import { createInMemoryBookRepository } from "./infrastructure/createInMemoryBookRepository.js";
import { createInMemoryMemberRepository } from "./infrastructure/createInMemoryMemberRepository.js";

// This composition root intentionally preserves the fixture's public API.
const books = new Map();
const members = new Map();
const bookRepository = createInMemoryBookRepository(books);
const memberRepository = createInMemoryMemberRepository(members);

export function reset() { books.clear(); members.clear(); }
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }

export function checkout(command) {
  return checkoutBook(command, { bookRepository, memberRepository });
}
