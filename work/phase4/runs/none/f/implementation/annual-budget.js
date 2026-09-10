let annualBudget = Infinity;
let approvedAmount = 0;

export function setAnnualBudget(amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("annual budget must be a non-negative number");
  }

  annualBudget = amount;
}

export function resetAnnualBudget() {
  annualBudget = Infinity;
  approvedAmount = 0;
}

export function approveWithinAnnualBudget(amount) {
  if (approvedAmount + amount > annualBudget) {
    throw new Error("annual budget exceeded");
  }

  approvedAmount += amount;
}
