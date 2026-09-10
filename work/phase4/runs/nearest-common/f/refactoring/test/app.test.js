import test from "node:test";
import assert from "node:assert/strict";
import {reset,setAnnualBudget,submitPurchaseRequest,approvePurchaseRequest,submitExpenseClaim,approveExpenseClaim} from "../app.js";
test("F enforces one annual budget across procurement and expense",()=>{reset();setAnnualBudget(40);submitPurchaseRequest({id:"p1",requesterId:"u1",amount:30});approvePurchaseRequest({id:"p1"});submitExpenseClaim({id:"e1",employeeId:"u2",amount:12,receiptCount:1});assert.throws(()=>approveExpenseClaim({id:"e1"}),/budget/i);});
