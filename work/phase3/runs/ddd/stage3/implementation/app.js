import { Book } from "./src/catalog/domain/Book.js";
import { Member } from "./src/membership/domain/Member.js";
import { SuspendMember } from "./src/membership/application/SuspendMember.js";
import { CheckoutBook } from "./src/circulation/application/CheckoutBook.js";
import { ReturnLoan } from "./src/circulation/application/ReturnLoan.js";
import { InMemoryBookRepository } from "./src/catalog/infrastructure/InMemoryBookRepository.js";
import { InMemoryMemberRepository } from "./src/membership/infrastructure/InMemoryMemberRepository.js";
import { InMemoryLoanRepository } from "./src/circulation/infrastructure/InMemoryLoanRepository.js";

// The public API remains a small composition root for the library application.
const books = new InMemoryBookRepository();
const members = new InMemoryMemberRepository();
const loans = new InMemoryLoanRepository();
const checkoutBook = new CheckoutBook({ books, members, loans });
const returnLoanService = new ReturnLoan({ books, loans });
const suspendMemberService = new SuspendMember({ members });

export function reset() { books.clear(); members.clear(); loans.clear(); }
export function addBook({ id, copies }) { books.save(new Book({ id, copies })); }
export function addMember({ id, active = true }) { members.save(new Member({ id, active })); }
export function checkout(command) { return checkoutBook.execute(command); }
export function returnLoan(command) { return returnLoanService.execute(command); }
export function suspendMember(command) { return suspendMemberService.execute(command); }
export function getLoan(id) { return loans.findById(id); }
