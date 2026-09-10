import test from "node:test";
import assert from "node:assert/strict";
import { reset, addBook, addMember, checkout, returnLoan, getLoan } from "../app.js";
test("return restores availability and records state", () => { reset(); addBook({id:"b1",copies:1}); addMember({id:"m1"}); const loan=checkout({bookId:"b1",memberId:"m1",now:0}); assert.equal(returnLoan({loanId:loan.id,now:10}).returnedAt,10); assert.equal(getLoan(loan.id).status,"returned"); const again=checkout({bookId:"b1",memberId:"m1",now:20}); assert.ok(again.id); });
test("return rejects repeated return", () => { reset(); addBook({id:"b1",copies:1}); addMember({id:"m1"}); const loan=checkout({bookId:"b1",memberId:"m1",now:0}); returnLoan({loanId:loan.id,now:1}); assert.throws(()=>returnLoan({loanId:loan.id,now:2})); });
