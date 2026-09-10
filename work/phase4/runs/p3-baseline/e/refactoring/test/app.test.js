import test from "node:test";
import assert from "node:assert/strict";
import {reset,submitPurchaseRequest,approvePurchaseRequest,submitExpenseClaim,approveExpenseClaim,purchaseApprovalMessage,expenseApprovalMessage} from "../app.js";
test("E preserves different approval-message meanings",()=>{reset();submitPurchaseRequest({id:"p1",requesterId:"u1",amount:30});approvePurchaseRequest({id:"p1"});submitExpenseClaim({id:"e1",employeeId:"u2",amount:12,receiptCount:2});approveExpenseClaim({id:"e1"});assert.equal(purchaseApprovalMessage("p1"),"Purchase p1 for requester u1 approved");assert.equal(expenseApprovalMessage("e1"),"Expense e1 for employee u2 approved with 2 receipts");});
