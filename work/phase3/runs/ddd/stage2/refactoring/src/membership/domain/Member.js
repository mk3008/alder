export class Member {
  constructor({ id, active }) {
    this.id = id;
    this.active = active;
  }

  ensureActive() {
    if (!this.active) throw new Error("Member is inactive");
  }
}
