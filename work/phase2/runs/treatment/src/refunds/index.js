import { formatMoney } from "../shared/money.js";

export function existingRefundLabel(refund) {
  return `Refund ${formatMoney(refund.cents, refund.currency)}`;
}

export function refundSummary(refunds) {
  const [firstRefund] = refunds;
  if (!firstRefund) throw new Error("at least one refund is required");

  const { currency } = firstRefund;
  const cents = refunds.reduce((total, refund) => {
    if (refund.currency !== currency) throw new Error("refunds must use a single currency");
    return total + refund.cents;
  }, 0);

  return formatMoney(cents, currency);
}
