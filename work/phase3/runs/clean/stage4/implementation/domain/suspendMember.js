export function suspendMember(member) {
  if (!member) {
    throw new Error("Member not found");
  }

  return { ...member, active: false };
}
