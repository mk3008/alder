// This slice owns member suspension, keeping membership state changes out of
// checkout while checkout remains responsible for enforcing active status.
export function suspendMember({ memberId }, { members }) {
  const member = members.get(memberId);
  if (!member) {
    throw new Error("Member is not found");
  }

  member.active = false;
  return member;
}
