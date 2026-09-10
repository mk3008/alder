import test from "node:test";
import assert from "node:assert/strict";
import {reset,submitPurchaseRequest} from "../app.js";
test("A submits a draft purchase request",()=>{reset();assert.deepEqual(submitPurchaseRequest({id:"p1",requesterId:"u1",amount:30}),{id:"p1",requesterId:"u1",amount:30,status:"draft"});assert.throws(()=>submitPurchaseRequest({id:"bad",requesterId:"u1",amount:0}));});
