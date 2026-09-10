import test from "node:test";
import assert from "node:assert/strict";
import { reset, addBook, addMember, checkout, returnLoan, suspendMember } from "../app.js";
test("suspension prevents a subsequent checkout", () => { reset(); addBook({id:"b1",copies:1}); addMember({id:"m1"}); const loan=checkout({bookId:"b1",memberId:"m1",now:0}); returnLoan({loanId:loan.id,now:1}); suspendMember({memberId:"m1"}); assert.throws(()=>checkout({bookId:"b1",memberId:"m1",now:2})); });
