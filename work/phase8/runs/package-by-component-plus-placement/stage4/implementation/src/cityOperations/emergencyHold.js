let isHeld = false;

export function setCityEmergencyHold(held) {
  isHeld = Boolean(held);
}

export function resetCityEmergencyHold() {
  isHeld = false;
}

export function assertCityEmergencyHoldAllows(action) {
  if (isHeld) throw new Error(`emergency hold prevents ${action}`);
}
