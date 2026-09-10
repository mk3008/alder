export {
  buildingPermitStatus,
  issueBuildingPermit,
  inspectionStatus,
  recordLicensingClearance,
  resetLicensing,
  scheduleBuildingInspection,
} from "./licensing/building-permits.js";

export {
  approveVendorInvoice,
  resetFinance,
  submitVendorInvoice,
  vendorInvoiceStatus,
} from "./finance/vendor-invoices.js";

import { resetLicensing } from "./licensing/building-permits.js";
import { resetFinance } from "./finance/vendor-invoices.js";

export function reset() {
  resetLicensing();
  resetFinance();
}
