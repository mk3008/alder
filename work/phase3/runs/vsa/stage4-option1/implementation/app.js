import { checkout as checkoutBook } from "./checkout/checkout.js";
import { returnLoan as returnOpenLoan } from "./return-loan/return-loan.js";
import { getLoan as findLoan } from "./get-loan/get-loan.js";
import { listOverdue as findOverdueLoans } from "./list-overdue/list-overdue.js";
import { suspendMember as suspendRegisteredMember } from "./suspend-member/suspend-member.js";

const books = new Map();
const members = new Map();
const loans = new Map();
let nextLoanId = 1;

export function reset() {
  books.clear();
  members.clear();
  loans.clear();
  nextLoanId = 1;
}
export function addBook({ id, copies }) { books.set(id, { id, copies }); }
export function addMember({ id, active = true }) { members.set(id, { id, active }); }
export function suspendMember(request) {
  return suspendRegisteredMember(request, { members });
}
export function checkout(request) {
  return checkoutBook(request, {
    books,
    members,
    loans,
    createLoanId: () => `loan-${nextLoanId++}`,
  });
}
export function returnLoan(request) { return returnOpenLoan(request, { books, loans }); }
export function getLoan(id) { return findLoan(id, { loans }); }
export function listOverdue(request) { return findOverdueLoans(request, { loans }); }
