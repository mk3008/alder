package study.payment;

import java.util.HashMap;
import java.util.Map;
import study.budget.OperatingCap;

/** Owns vendor-payment lifecycle rules and payment data. */
public final class VendorPaymentWorkflow {
    private final Map<String, VendorPayment> payments = new HashMap<>();

    public void enter(String id, int amount, String vendor) {
        if (amount <= 0) throw new IllegalArgumentException("payment amount must be positive");
        payments.put(id, new VendorPayment(id, amount, vendor, Status.ENTERED));
    }

    public void release(String id, OperatingCap operatingCap) {
        VendorPayment payment = requireEntered(id);
        operatingCap.requireCapacityFor(payment.amount());
        payments.put(id, payment.withStatus(Status.RELEASED));
    }

    public String status(String id) {
        return requirePayment(id).status().wireValue;
    }

    public String releaseMessage(String id) {
        VendorPayment payment = requirePayment(id);
        if (payment.status() != Status.RELEASED) throw new IllegalStateException("payment is not released");
        return "Payment " + payment.id() + " to " + payment.vendor() + " released";
    }

    public long committedAmount() {
        return payments.values().stream()
                .filter(payment -> payment.status() == Status.RELEASED)
                .mapToLong(VendorPayment::amount)
                .sum();
    }

    private VendorPayment requirePayment(String id) {
        VendorPayment payment = payments.get(id);
        if (payment == null) throw new IllegalArgumentException("unknown payment");
        return payment;
    }

    private VendorPayment requireEntered(String id) {
        VendorPayment payment = requirePayment(id);
        if (payment.status() != Status.ENTERED) throw new IllegalStateException("payment is not entered");
        return payment;
    }

    private record VendorPayment(String id, int amount, String vendor, Status status) {
        private VendorPayment withStatus(Status newStatus) { return new VendorPayment(id, amount, vendor, newStatus); }
    }

    private enum Status {
        ENTERED("entered"), RELEASED("released");

        private final String wireValue;

        Status(String wireValue) { this.wireValue = wireValue; }
    }
}
