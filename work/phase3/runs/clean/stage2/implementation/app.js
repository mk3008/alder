import { checkoutBook } from "./application/checkoutBook.js";
import { returnLoan as returnLoanUseCase } from "./application/returnLoan.js";
import { createInMemoryBookRepository } from "./infrastructure/createInMemoryBookRepository.js";
import { createInMemoryLoanRepository } from "./infrastructure/createInMemoryLoanRepository.js";
import { createInMemoryMemberRepository } from "./infrastructure/createInMemoryMemberRepository.js";

// This composition root intentionally preserves the fixture's public API.
const books = new Map();
const members = new Map();
const loans = new Map();
const bookRepository = createInMemoryBookRepository(books);
const memberRepository = createInMemoryMemberRepository(members);
const loanRepository = createInMemoryLoanRepository(loans);

export function reset() { books.clear(); members.clear(); loans.clear(); }
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }

export function checkout(command) {
  return checkoutBook(command, { bookRepository, memberRepository, loanRepository });
}

export function returnLoan(command) {
  return returnLoanUseCase(command, { bookRepository, loanRepository });
}

export function getLoan(id) {
  return loanRepository.findById(id);
}
