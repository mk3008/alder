export function createInMemoryMemberRepository(members) {
  return {
    findById(id) { return members.get(id); },
    save(member) { members.set(member.id, member); },
  };
}
