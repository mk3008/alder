import test from "node:test";
import assert from "node:assert/strict";
import { reset, addBook, addMember, checkout } from "../app.js";
test("checkout creates a fourteen-day loan", () => { reset(); addBook({id:"b1",copies:1}); addMember({id:"m1"}); const loan=checkout({bookId:"b1",memberId:"m1",now:1000}); assert.equal(loan.bookId,"b1"); assert.equal(loan.memberId,"m1"); assert.equal(loan.dueAt,1000+14*24*60*60*1000); });
test("checkout rejects unavailable book and inactive member", () => { reset(); addBook({id:"b1",copies:0}); addMember({id:"m1"}); assert.throws(()=>checkout({bookId:"b1",memberId:"m1",now:0})); reset(); addBook({id:"b1",copies:1}); addMember({id:"m1",active:false}); assert.throws(()=>checkout({bookId:"b1",memberId:"m1",now:0})); });
