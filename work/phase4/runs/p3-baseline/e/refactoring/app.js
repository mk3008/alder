import { resetExpenseClaims } from "./expense-claims.js";
import { resetPurchaseRequests } from "./purchase-requests.js";

export {
  approveExpenseClaim,
  expenseApprovalMessage,
  getExpenseClaim,
  submitExpenseClaim,
} from "./expense-claims.js";
export {
  approvePurchaseRequest,
  getPurchaseRequest,
  purchaseApprovalMessage,
  rejectPurchaseRequest,
  submitPurchaseRequest,
} from "./purchase-requests.js";

export function reset() {
  resetPurchaseRequests();
  resetExpenseClaims();
}
