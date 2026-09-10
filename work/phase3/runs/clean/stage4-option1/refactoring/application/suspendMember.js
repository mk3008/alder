import { suspendMember as suspendMemberEntity } from "../domain/suspendMember.js";

export function suspendMember({ memberId }, { memberRepository }) {
  const member = memberRepository.findById(memberId);
  const suspendedMember = suspendMemberEntity(member);
  memberRepository.save(suspendedMember);
  return suspendedMember;
}
