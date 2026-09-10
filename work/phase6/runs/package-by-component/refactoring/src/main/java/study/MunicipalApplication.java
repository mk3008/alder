package study;

import study.budget.OperatingBudget;
import study.permits.PermitComponent;
import study.payments.VendorPaymentComponent;

/** Fixed public application API for a small municipal operations application. */
public final class MunicipalApplication {
    private final OperatingBudget budget = new OperatingBudget();
    private final PermitComponent permits = new PermitComponent(budget);
    private final VendorPaymentComponent vendorPayments = new VendorPaymentComponent(budget);

    public void setOperatingCap(int amount) {
        budget.setCap(amount);
    }

    public void submitPermit(String id, int amount, String applicant) {
        permits.submit(id, amount, applicant);
    }

    public void approvePermit(String id) {
        permits.approve(id);
    }

    public String permitStatus(String id) {
        return permits.status(id);
    }

    public String permitApprovalMessage(String id) {
        return permits.approvalMessage(id);
    }

    public void enterVendorPayment(String id, int amount, String vendor) {
        vendorPayments.enter(id, amount, vendor);
    }

    public void releaseVendorPayment(String id) {
        vendorPayments.release(id);
    }

    public String vendorPaymentStatus(String id) {
        return vendorPayments.status(id);
    }

    public String vendorPaymentReleaseMessage(String id) {
        return vendorPayments.releaseMessage(id);
    }
}
