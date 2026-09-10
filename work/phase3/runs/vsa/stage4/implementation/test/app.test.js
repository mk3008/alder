import test from "node:test";
import assert from "node:assert/strict";
import { reset, addBook, addMember, checkout, returnLoan, listOverdue } from "../app.js";
test("overdue list contains only open overdue loans", () => { reset(); addBook({id:"b1",copies:2}); addMember({id:"m1"}); addMember({id:"m2"}); const old=checkout({bookId:"b1",memberId:"m1",now:0}); const recent=checkout({bookId:"b1",memberId:"m2",now:100}); assert.deepEqual(listOverdue({now:old.dueAt+1}),[{loanId:old.id,bookId:"b1",memberId:"m1"}]); returnLoan({loanId:old.id,now:old.dueAt+2}); assert.deepEqual(listOverdue({now:recent.dueAt+1}),[]); });
