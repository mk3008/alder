const invoices = new Map();

export function issueInvoice({ id, customer, cents, currency }) {
  const invoice = { id, customer, cents, currency };
  invoices.set(id, invoice);
  return invoice;
}

export function invoiceDetail(id) { return invoices.get(id); }

export function invoiceList() {
  return [...invoices.values()].map(({ id, customer, cents, currency }) => ({ id, customer, cents, currency }));
}

export function resetInvoices() { invoices.clear(); }
