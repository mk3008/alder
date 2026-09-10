package study.budget;

/** Shared operating-cap policy used by municipal workflow components. */
public final class OperatingBudget {
    private long committedAmount;
    private int cap = Integer.MAX_VALUE;

    public void setCap(int amount) {
        if (amount < 0) throw new IllegalArgumentException("operating cap must not be negative");
        if (committedAmount > amount) {
            throw new IllegalStateException("operating cap cannot be below committed amount");
        }
        cap = amount;
    }

    public void commit(int amount) {
        if (committedAmount + amount > cap) {
            throw new IllegalStateException("operating cap exceeded");
        }
        committedAmount += amount;
    }
}
