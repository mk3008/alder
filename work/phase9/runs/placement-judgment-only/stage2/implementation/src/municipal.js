import {
  recordLicensingClearance,
  resetLicensingClearances,
} from "./licensing-board.js";
import { issueBuildingPermit as issuePermit } from "./building-permit-issuance.js";
import { scheduleBuildingInspection as scheduleInspection } from "./building-inspection-scheduling.js";

const permits = new Map();
const invoices = new Map();

export function reset() {
  permits.clear();
  invoices.clear();
  resetLicensingClearances();
}

export function issueBuildingPermit({ id, contractorId, riskLevel }) {
  issuePermit({ id, contractorId, riskLevel }, savePermitRecord);
}

export { recordLicensingClearance };

export function scheduleBuildingInspection({ permitId, inspectorId }) {
  scheduleInspection(
    { permitId, inspectorId },
    loadPermitRecord,
    savePermitRecord,
    sendInspectionBooking,
  );
}

export function buildingPermitStatus(id) {
  return loadPermitRecord(id).status;
}

export function inspectionStatus(permitId) {
  return loadPermitRecord(permitId).inspection?.status ?? "not-scheduled";
}

export function submitVendorInvoice({ id, vendorId, amount }) {
  if (!id || !vendorId || amount <= 0) throw new Error("valid invoice is required");
  saveInvoiceRecord({ id, vendorId, amount, status: "submitted" });
}

export function approveVendorInvoice({ id }) {
  const invoice = loadInvoiceRecord(id);
  if (invoice.status !== "submitted") throw new Error("invoice is not submitted");
  saveInvoiceRecord({ ...invoice, status: "approved" });
  deliverPaymentNotice(invoice.id);
}

export function vendorInvoiceStatus(id) {
  return loadInvoiceRecord(id).status;
}

function loadPermitRecord(id) {
  const permit = permits.get(id);
  if (!permit) throw new Error("unknown permit");
  return permit;
}

function savePermitRecord(permit) { permits.set(permit.id, permit); }
function sendInspectionBooking() {}

function loadInvoiceRecord(id) {
  const invoice = invoices.get(id);
  if (!invoice) throw new Error("unknown invoice");
  return invoice;
}

function saveInvoiceRecord(invoice) { invoices.set(invoice.id, invoice); }
function deliverPaymentNotice() {}
