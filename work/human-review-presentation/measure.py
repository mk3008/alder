"""Recalculate presentation and reported read-volume metrics; no human-time estimate."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent
observation = json.loads((root / "observations.json").read_text())
counts = {}
for name in observation["presentation"]:
    content = (root / name).read_text()
    counts[name] = {"characters": len(content),
                    "nonempty_lines": sum(bool(line.strip()) for line in content.splitlines())}
for name, value in counts.items():
    assert value == observation["presentation"][name], name
reads = {}
for arm, value in observation["reads"].items():
    count = sum(len((root / name).read_text()) for name in value["files"])
    assert count == value["characters"], arm
    reads[arm] = count
print(json.dumps({"presentation": counts, "reported_read_characters": reads,
                 "initial_reduction": 1 - counts["staged.md"]["characters"] /
                 counts["baseline.md"]["characters"]}, ensure_ascii=False, indent=2))
