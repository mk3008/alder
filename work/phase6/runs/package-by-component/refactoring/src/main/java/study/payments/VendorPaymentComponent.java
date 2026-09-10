package study.payments;

import java.util.HashMap;
import java.util.Map;
import study.budget.OperatingBudget;

/** Vendor-payment workflow component. */
public final class VendorPaymentComponent {
    private final OperatingBudget budget;
    private final Map<String, VendorPayment> payments = new HashMap<>();

    public VendorPaymentComponent(OperatingBudget budget) {
        this.budget = budget;
    }

    public void enter(String id, int amount, String vendor) {
        if (amount <= 0) throw new IllegalArgumentException("payment amount must be positive");
        payments.put(id, new VendorPayment(id, amount, vendor, "entered"));
    }

    public void release(String id) {
        VendorPayment payment = requirePayment(id);
        if (!payment.status.equals("entered")) throw new IllegalStateException("payment is not entered");
        budget.commit(payment.amount);
        payments.put(id, payment.withStatus("released"));
    }

    public String status(String id) {
        return requirePayment(id).status;
    }

    public String releaseMessage(String id) {
        VendorPayment payment = requirePayment(id);
        if (!payment.status.equals("released")) throw new IllegalStateException("payment is not released");
        return "Payment " + payment.id + " to " + payment.vendor + " released";
    }

    private VendorPayment requirePayment(String id) {
        VendorPayment payment = payments.get(id);
        if (payment == null) throw new IllegalArgumentException("unknown payment");
        return payment;
    }

    private record VendorPayment(String id, int amount, String vendor, String status) {
        private VendorPayment withStatus(String newStatus) {
            return new VendorPayment(id, amount, vendor, newStatus);
        }
    }
}
