export class InMemoryBookRepository {
  #items = new Map();

  findById(id) { return this.#items.get(id); }
  save(book) { this.#items.set(book.id, book); }
  clear() { this.#items.clear(); }
}
