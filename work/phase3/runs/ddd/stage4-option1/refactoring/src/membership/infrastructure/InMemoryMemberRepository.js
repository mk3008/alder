export class InMemoryMemberRepository {
  #items = new Map();

  findById(id) { return this.#items.get(id); }
  save(member) { this.#items.set(member.id, member); }
  clear() { this.#items.clear(); }
}
