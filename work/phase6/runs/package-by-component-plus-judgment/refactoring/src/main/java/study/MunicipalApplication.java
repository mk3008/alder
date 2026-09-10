package study;

import study.budget.OperatingCap;
import study.payment.VendorPaymentWorkflow;
import study.permit.PermitWorkflow;

/** Fixed public application API for a small municipal operations application. */
public final class MunicipalApplication {
    private final PermitWorkflow permits = new PermitWorkflow();
    private final VendorPaymentWorkflow vendorPayments = new VendorPaymentWorkflow();
    private final OperatingCap operatingCap = new OperatingCap(
            () -> permits.committedAmount() + vendorPayments.committedAmount());

    public void setOperatingCap(int amount) {
        operatingCap.set(amount);
    }

    public void submitPermit(String id, int amount, String applicant) {
        permits.submit(id, amount, applicant);
    }

    public void approvePermit(String id) {
        permits.approve(id, operatingCap);
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
        vendorPayments.release(id, operatingCap);
    }

    public String vendorPaymentStatus(String id) {
        return vendorPayments.status(id);
    }

    public String vendorPaymentReleaseMessage(String id) {
        return vendorPayments.releaseMessage(id);
    }
}
