import { Loan } from "../domain/Loan.js";

export class CheckoutBook {
  constructor({ books, members, loans }) {
    this.books = books;
    this.members = members;
    this.loans = loans;
  }

  execute({ bookId, memberId, now }) {
    const book = this.books.findById(bookId);
    const member = this.members.findById(memberId);

    if (!book) throw new Error("Book not found");
    if (!member) throw new Error("Member not found");

    member.ensureActive();
    book.loanOneCopy();
    this.books.save(book);

    const loan = new Loan({ id: this.loans.nextId(), bookId, memberId, now });
    this.loans.save(loan);
    return loan;
  }
}
