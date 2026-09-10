package study;

import java.util.HashMap;
import java.util.Map;

/** Fixed public application API for a small municipal operations application. */
public final class MunicipalApplication {
    private final Map<String, Permit> permits = new HashMap<>();
    private final Map<String, VendorPayment> vendorPayments = new HashMap<>();

    public void submitPermit(String id, int amount, String applicant) {
        if (amount <= 0) throw new IllegalArgumentException("permit amount must be positive");
        permits.put(id, new Permit(id, amount, applicant, "submitted"));
    }

    public void approvePermit(String id) {
        Permit permit = requireSubmittedPermit(id);
        permits.put(id, permit.withStatus("approved"));
    }

    public String permitStatus(String id) {
        return requirePermit(id).status();
    }

    public String permitApprovalMessage(String id) {
        Permit permit = requirePermit(id);
        if (!permit.status().equals("approved")) throw new IllegalStateException("permit is not approved");
        return "Permit " + permit.id() + " for " + permit.applicant() + " approved";
    }

    public void enterVendorPayment(String id, int amount, String vendor) {
        if (amount <= 0) throw new IllegalArgumentException("payment amount must be positive");
        vendorPayments.put(id, new VendorPayment(id, amount, vendor, "entered"));
    }

    public void releaseVendorPayment(String id) {
        VendorPayment payment = requireEnteredVendorPayment(id);
        vendorPayments.put(id, payment.withStatus("released"));
    }

    public String vendorPaymentStatus(String id) {
        return requireVendorPayment(id).status();
    }

    public String vendorPaymentReleaseMessage(String id) {
        VendorPayment payment = requireVendorPayment(id);
        if (!payment.status().equals("released")) throw new IllegalStateException("payment is not released");
        return "Payment " + payment.id() + " to " + payment.vendor() + " released";
    }

    private Permit requirePermit(String id) {
        Permit permit = permits.get(id);
        if (permit == null) throw new IllegalArgumentException("unknown permit");
        return permit;
    }

    private Permit requireSubmittedPermit(String id) {
        Permit permit = requirePermit(id);
        if (!permit.status().equals("submitted")) throw new IllegalStateException("permit is not submitted");
        return permit;
    }

    private VendorPayment requireVendorPayment(String id) {
        VendorPayment payment = vendorPayments.get(id);
        if (payment == null) throw new IllegalArgumentException("unknown payment");
        return payment;
    }

    private VendorPayment requireEnteredVendorPayment(String id) {
        VendorPayment payment = requireVendorPayment(id);
        if (!payment.status().equals("entered")) throw new IllegalStateException("payment is not entered");
        return payment;
    }

    private record Permit(String id, int amount, String applicant, String status) {
        private Permit withStatus(String newStatus) { return new Permit(id, amount, applicant, newStatus); }
    }

    private record VendorPayment(String id, int amount, String vendor, String status) {
        private VendorPayment withStatus(String newStatus) { return new VendorPayment(id, amount, vendor, newStatus); }
    }
}
