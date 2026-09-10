let annualBudget;
let approvedAmount = 0;

export function setAnnualBudget(amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("annual budget must be a non-negative number");
  }

  annualBudget = amount;
}

export function reserveAnnualBudget(amount) {
  if (annualBudget !== undefined && approvedAmount + amount > annualBudget) {
    throw new Error("annual budget exceeded");
  }

  approvedAmount += amount;
}

export function resetAnnualBudget() {
  annualBudget = undefined;
  approvedAmount = 0;
}
