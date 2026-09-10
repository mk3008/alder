let cityEmergencyHold = false;

export function setCityEmergencyHold(isHeld) {
  cityEmergencyHold = Boolean(isHeld);
}

export function isCityEmergencyHoldActive() {
  return cityEmergencyHold;
}

export function resetCityOperations() {
  cityEmergencyHold = false;
}
