package study.budget;

import java.util.function.LongSupplier;

/** Owns the cross-workflow limit for committed municipal funds. */
public final class OperatingCap {
    private final LongSupplier committedAmount;
    private int amount = Integer.MAX_VALUE;

    public OperatingCap(LongSupplier committedAmount) {
        this.committedAmount = committedAmount;
    }

    public void set(int amount) {
        if (amount < 0) throw new IllegalArgumentException("operating cap must not be negative");
        if (committedAmount.getAsLong() > amount) {
            throw new IllegalStateException("operating cap is below committed total");
        }
        this.amount = amount;
    }

    public void requireCapacityFor(int additionalAmount) {
        if (committedAmount.getAsLong() + additionalAmount > amount) {
            throw new IllegalStateException("operating cap exceeded");
        }
    }
}
