import { formatMoney } from "../shared/money.js";

export function existingRefundLabel(refund) {
  return `Refund ${formatMoney(refund.cents, refund.currency)}`;
}

export function refundSummary(refunds) {
  if (refunds.length === 0) throw new Error("refunds must not be empty");
  const { currency } = refunds[0];
  if (refunds.some((refund) => refund.currency !== currency)) {
    throw new Error("refunds must use a single currency");
  }
  return formatMoney(refunds.reduce((total, refund) => total + refund.cents, 0), currency);
}
