package study.permits;

import java.util.HashMap;
import java.util.Map;
import study.budget.OperatingBudget;

/** Permit workflow component. */
public final class PermitComponent {
    private final OperatingBudget budget;
    private final Map<String, Permit> permits = new HashMap<>();

    public PermitComponent(OperatingBudget budget) {
        this.budget = budget;
    }

    public void submit(String id, int amount, String applicant) {
        if (amount <= 0) throw new IllegalArgumentException("permit amount must be positive");
        permits.put(id, new Permit(id, amount, applicant, "submitted"));
    }

    public void approve(String id) {
        Permit permit = requirePermit(id);
        if (!permit.status.equals("submitted")) throw new IllegalStateException("permit is not submitted");
        budget.commit(permit.amount);
        permits.put(id, permit.withStatus("approved"));
    }

    public String status(String id) {
        return requirePermit(id).status;
    }

    public String approvalMessage(String id) {
        Permit permit = requirePermit(id);
        if (!permit.status.equals("approved")) throw new IllegalStateException("permit is not approved");
        return "Permit " + permit.id + " for " + permit.applicant + " approved";
    }

    private Permit requirePermit(String id) {
        Permit permit = permits.get(id);
        if (permit == null) throw new IllegalArgumentException("unknown permit");
        return permit;
    }

    private record Permit(String id, int amount, String applicant, String status) {
        private Permit withStatus(String newStatus) {
            return new Permit(id, amount, applicant, newStatus);
        }
    }
}
