"""Verify saved evidence integrity, not candidate correctness or model identity."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
manifest = json.loads((root / "manifest.json").read_text())
assert manifest["completed_run_count"] == 6
for run in manifest["runs"]:
    for path, expected in run["actual_files"].items():
        snapshot = root / "snapshots" / path
        if snapshot.exists():
            actual = snapshot.read_bytes()
        else:
            # Local preparation added one terminal LF to preregistered text.
            actual = (root / path).read_bytes() + b"\n"
        blob = hashlib.sha1(b"blob " + str(len(actual)).encode() + b"\0" + actual).hexdigest()
        assert len(actual) == expected["bytes"], (run["agent_id"], path)
        assert hashlib.sha256(actual).hexdigest() == expected["sha256"], path
        assert blob == expected["git_blob_sha"], path
    actual = (root / run["raw_path"]).read_bytes()
    assert hashlib.sha256(actual).hexdigest() == run["raw"]["sha256"]
    assert len(actual) == run["raw"]["bytes"]
    assert len(actual.decode("utf-8")) == run["raw"]["unicode_code_points"]
assert {r["case"] for r in manifest["runs"]} == {
    "facilities-maintenance", "meeting-room", "purchase-request"
}
assert {r["arm"] for r in manifest["runs"]} == {"a", "b"}
assert len({(r["case"], r["arm"]) for r in manifest["runs"]}) == 6
print("PASS: 6 raw outputs and all actual input hashes match manifest")
