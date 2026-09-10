import test from "node:test";
import assert from "node:assert/strict";
import {reset,submitPurchaseRequest,approvePurchaseRequest,rejectPurchaseRequest,getPurchaseRequest} from "../app.js";
test("C uses one procurement lifecycle",()=>{reset();submitPurchaseRequest({id:"p1",requesterId:"u1",amount:30});assert.equal(rejectPurchaseRequest({id:"p1",reason:"duplicate"}).status,"rejected");assert.equal(getPurchaseRequest("p1").reason,"duplicate");assert.throws(()=>approvePurchaseRequest({id:"p1"}));});
