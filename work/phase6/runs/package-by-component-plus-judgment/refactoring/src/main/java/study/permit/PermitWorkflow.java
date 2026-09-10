package study.permit;

import java.util.HashMap;
import java.util.Map;
import study.budget.OperatingCap;

/** Owns permit lifecycle rules and permit data. */
public final class PermitWorkflow {
    private final Map<String, Permit> permits = new HashMap<>();

    public void submit(String id, int amount, String applicant) {
        if (amount <= 0) throw new IllegalArgumentException("permit amount must be positive");
        permits.put(id, new Permit(id, amount, applicant, Status.SUBMITTED));
    }

    public void approve(String id, OperatingCap operatingCap) {
        Permit permit = requireSubmitted(id);
        operatingCap.requireCapacityFor(permit.amount());
        permits.put(id, permit.withStatus(Status.APPROVED));
    }

    public String status(String id) {
        return requirePermit(id).status().wireValue;
    }

    public String approvalMessage(String id) {
        Permit permit = requirePermit(id);
        if (permit.status() != Status.APPROVED) throw new IllegalStateException("permit is not approved");
        return "Permit " + permit.id() + " for " + permit.applicant() + " approved";
    }

    public long committedAmount() {
        return permits.values().stream()
                .filter(permit -> permit.status() == Status.APPROVED)
                .mapToLong(Permit::amount)
                .sum();
    }

    private Permit requirePermit(String id) {
        Permit permit = permits.get(id);
        if (permit == null) throw new IllegalArgumentException("unknown permit");
        return permit;
    }

    private Permit requireSubmitted(String id) {
        Permit permit = requirePermit(id);
        if (permit.status() != Status.SUBMITTED) throw new IllegalStateException("permit is not submitted");
        return permit;
    }

    private record Permit(String id, int amount, String applicant, Status status) {
        private Permit withStatus(Status newStatus) { return new Permit(id, amount, applicant, newStatus); }
    }

    private enum Status {
        SUBMITTED("submitted"), APPROVED("approved");

        private final String wireValue;

        Status(String wireValue) { this.wireValue = wireValue; }
    }
}
