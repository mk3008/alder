export function createInMemoryMemberRepository(members) {
  return {
    findById(id) { return members.get(id); },
  };
}
