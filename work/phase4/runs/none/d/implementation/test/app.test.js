import test from "node:test";
import assert from "node:assert/strict";
import {reset,submitPurchaseRequest,approvePurchaseRequest,submitExpenseClaim,approveExpenseClaim,getExpenseClaim} from "../app.js";
test("D keeps an expense workflow alongside procurement",()=>{reset();submitPurchaseRequest({id:"p1",requesterId:"u1",amount:30});approvePurchaseRequest({id:"p1"});submitExpenseClaim({id:"e1",employeeId:"u2",amount:12,receiptCount:2});assert.equal(approveExpenseClaim({id:"e1"}).status,"approved");assert.equal(getExpenseClaim("e1").employeeId,"u2");});
