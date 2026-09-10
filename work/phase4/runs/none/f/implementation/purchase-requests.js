import { approveWithinAnnualBudget } from "./annual-budget.js";

const purchaseRequests = new Map();

export function resetPurchaseRequests() {
  purchaseRequests.clear();
}

export function submitPurchaseRequest({ id, requesterId, amount }) {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("amount must be a positive integer");
  }

  const purchaseRequest = { id, requesterId, amount, status: "draft" };
  purchaseRequests.set(id, purchaseRequest);
  return purchaseRequest;
}

export function approvePurchaseRequest({ id }) {
  const purchaseRequest = getDraftPurchaseRequest(id, "approved");

  approveWithinAnnualBudget(purchaseRequest.amount);
  purchaseRequest.status = "approved";
  return purchaseRequest;
}

export function rejectPurchaseRequest({ id, reason }) {
  const purchaseRequest = getDraftPurchaseRequest(id, "rejected");

  purchaseRequest.status = "rejected";
  purchaseRequest.reason = reason;
  return purchaseRequest;
}

export function getPurchaseRequest(id) {
  return purchaseRequests.get(id);
}

export function purchaseApprovalMessage(id) {
  const purchaseRequest = getApprovedPurchaseRequest(id);

  return `Purchase ${purchaseRequest.id} for requester ${purchaseRequest.requesterId} approved`;
}

function getDraftPurchaseRequest(id, action) {
  const purchaseRequest = getPurchaseRequest(id);

  if (!purchaseRequest) {
    throw new Error("purchase request not found");
  }

  if (purchaseRequest.status !== "draft") {
    throw new Error(`only draft purchase requests can be ${action}`);
  }

  return purchaseRequest;
}

function getApprovedPurchaseRequest(id) {
  const purchaseRequest = getPurchaseRequest(id);

  if (!purchaseRequest) {
    throw new Error("purchase request not found");
  }

  if (purchaseRequest.status !== "approved") {
    throw new Error("only approved purchase requests can have approval messages");
  }

  return purchaseRequest;
}
