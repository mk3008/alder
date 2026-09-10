export function createInMemoryBookRepository(books) {
  return {
    findById(id) { return books.get(id); },
    save(book) { books.set(book.id, book); },
  };
}
