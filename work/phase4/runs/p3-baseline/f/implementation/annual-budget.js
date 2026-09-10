let annualBudget = Infinity;
let approvedTotal = 0;

export function resetAnnualBudget() {
  annualBudget = Infinity;
  approvedTotal = 0;
}

export function setAnnualBudget(amount) {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error("annual budget must be a non-negative number");
  }
  if (approvedTotal > amount) {
    throw new Error("annual budget cannot be less than approved spending");
  }

  annualBudget = amount;
}

export function reserveApprovedAmount(amount) {
  if (approvedTotal + amount > annualBudget) {
    throw new Error("annual budget exceeded");
  }

  approvedTotal += amount;
}

export function releaseApprovedAmount(amount) {
  approvedTotal -= amount;
}
