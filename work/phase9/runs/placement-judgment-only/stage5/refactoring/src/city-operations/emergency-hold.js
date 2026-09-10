let cityEmergencyHold = false;

export function setCityEmergencyHold(isHeld) {
  cityEmergencyHold = Boolean(isHeld);
}

export function resetCityEmergencyHold() {
  cityEmergencyHold = false;
}

export function assertCityEmergencyHoldAllows(action) {
  if (cityEmergencyHold) {
    throw new Error(`city emergency hold prevents ${action}`);
  }
}
