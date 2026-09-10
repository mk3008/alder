export class Book {
  constructor({ id, copies }) {
    this.id = id;
    this.copies = copies;
  }

  loanOneCopy() {
    if (this.copies <= 0) throw new Error("Book is unavailable");
    this.copies -= 1;
  }
}
