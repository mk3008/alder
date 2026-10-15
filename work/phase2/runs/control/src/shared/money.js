export function formatMoney(cents, currency) {
  if (!Number.isInteger(cents)) throw new Error("cents must be an integer");
  if (currency === "JPY") return `¥${cents.toLocaleString("en-US")}`;
  if (currency === "USD") return `$${(cents / 100).toFixed(2)}`;
  throw new Error("unsupported currency");
}
