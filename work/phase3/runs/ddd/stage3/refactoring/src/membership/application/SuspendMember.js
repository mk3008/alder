export class SuspendMember {
  constructor({ members }) {
    this.members = members;
  }

  execute({ memberId }) {
    const member = this.members.findById(memberId);
    if (!member) throw new Error("Member not found");

    member.suspend();
    this.members.save(member);
    return member;
  }
}
