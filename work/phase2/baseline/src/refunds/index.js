import { formatMoney } from "../shared/money.js";

export function existingRefundLabel(refund) {
  return `Refund ${formatMoney(refund.cents, refund.currency)}`;
}
