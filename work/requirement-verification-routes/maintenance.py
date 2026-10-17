"""Fixed-clock synthetic advisory scan and local notification events."""

from copy import deepcopy
from pathlib import Path
from tempfile import TemporaryDirectory

from app import ReservationApp


def regression(version):
    """Probe the actual app using a disposable database and candidate dependency."""
    with TemporaryDirectory(prefix="reservation-regression-") as directory:
        app = ReservationApp(Path(directory) / "probe.sqlite", dependency_version=version)
        valid_status, _ = app.request("POST", "/reservations", "alice-token", {
            "request_id": "valid-probe", "room": "A", "start": "09:00", "end": "10:00",
        })
        invalid_status, _ = app.request("POST", "/reservations", "alice-token", {
            "request_id": "invalid-probe", "room": "A", "start": "10:00", "end": "09:00",
        })
    return {
        "passed": valid_status == 201 and invalid_status == 400,
        "valid_status": valid_status,
        "invalid_status": invalid_status,
    }


def _scan(current, advisories, fail):
    if fail:
        raise RuntimeError("Synthetic scan failure")
    return [deepcopy(advisory) for advisory in advisories
            if advisory["package"] == current["name"]
            and advisory["affected"] == current["version"]]


def run_scan(current, advisories, now, history, fail=False):
    result = {
        "status": "clean", "events": [], "history": deepcopy(history),
        "candidate": None, "current": deepcopy(current),
    }
    try:
        relevant = _scan(current, advisories, fail)
    except RuntimeError:
        result["status"] = "scan_failed"
        result["history"].append({"status": "failed", "at": now})
        # Mutation anchor: failed-scan notification.
        result["events"].append({"type": "scan_failed", "at": now})
        return result

    result["history"].append({"status": "success", "at": now})
    if not relevant:
        return result

    # The frozen scenarios each have one relevant advisory. Multiple entries
    # need a candidate-composition policy and must not be silently treated clean.
    if len(relevant) != 1:
        result["status"] = "manual_action"
        result["events"].append({
            "type": "manual_action", "at": now,
            "reason": "multiple_advisories", "advisory_ids": [a["id"] for a in relevant],
        })
        return result
    advisory = relevant[0]
    version = advisory["fixed"]
    if version is None:
        result["status"] = "manual_action"
        result["events"].append({
            "type": "manual_action", "at": now, "advisory_id": advisory["id"],
        })
        return result

    probe = regression(version)
    result["candidate"] = {
        "version": version, "advisory_id": advisory["id"], "regression": probe,
    }
    # Mutation anchor: candidate regression gate.
    if probe["passed"]:
        result["status"] = "candidate_ready"
    else:
        result["status"] = "candidate_blocked"
    result["events"].append({
        "type": result["status"], "at": now,
        "version": version, "advisory_id": advisory["id"], "regression": deepcopy(probe),
    })
    return result


def watchdog(history, now, started_at, interval=86400, grace=3600):
    successes = [entry["at"] for entry in history if entry["status"] == "success"]
    reference = max(successes) if successes else started_at
    events = []
    if now - reference > interval + grace:
        # Mutation anchor: overdue notification.
        events.append({"type": "overdue", "at": now, "last_success": max(successes) if successes else None,
                       "due_at": reference + interval + grace})
    return events
