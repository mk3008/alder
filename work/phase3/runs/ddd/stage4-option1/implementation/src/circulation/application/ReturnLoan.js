export class ReturnLoan {
  constructor({ books, loans }) {
    this.books = books;
    this.loans = loans;
  }

  execute({ loanId, now }) {
    const loan = this.loans.findById(loanId);
    if (!loan) throw new Error("Loan not found");

    const book = this.books.findById(loan.bookId);
    if (!book) throw new Error("Book not found");

    loan.returnAt(now);
    book.returnOneCopy();
    this.books.save(book);
    this.loans.save(loan);
    return loan;
  }
}
