const invoices = new Map();

export function issueInvoice({ id, customer, cents, currency, note }) {
  if (note?.length > 280) throw new Error("note must be at most 280 characters");

  const invoice = { id, customer, cents, currency };
  if (note !== undefined) invoice.note = note;
  invoices.set(id, invoice);
  return invoice;
}

export function invoiceDetail(id) { return invoices.get(id); }

export function invoiceList() {
  return [...invoices.values()].map(({ id, customer, cents, currency }) => ({ id, customer, cents, currency }));
}

export function resetInvoices() { invoices.clear(); }
