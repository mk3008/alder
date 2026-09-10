import test from "node:test";
import assert from "node:assert/strict";
import {reset,submitPurchaseRequest,approvePurchaseRequest} from "../app.js";
test("B approves a draft purchase request",()=>{reset();submitPurchaseRequest({id:"p1",requesterId:"u1",amount:30});assert.equal(approvePurchaseRequest({id:"p1"}).status,"approved");});
