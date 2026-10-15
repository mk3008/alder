"""Validate research artifact integrity; does not score semantic correctness."""
from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "work/behavior-derivation"
digest = lambda data: hashlib.sha256(data).hexdigest()
manifest = json.loads((BASE / "records/inputs.json").read_text())
runs = json.loads((BASE / "records/runs.json").read_text())
assert digest((ROOT / "docs/behavior-derivation/candidate.md").read_bytes()) == runs["candidate_sha256"]
fields = ["対象業務", "条件・契機・入力", "期待する結果（観測対象）", "起きてはいけないこと", "根拠", "導出分類", "確度", "人間レビュー"]
summary = {}
for case, source in manifest.items():
    data = (BASE / f"inputs/{case}.md").read_bytes()
    original = subprocess.check_output(["git", "show", f"{source['revision']}:{source['source_path']}"], cwd=ROOT)
    assert data == original
    assert digest(data) == source["sha256"]
    line_count = len(data.decode().splitlines())
    output = (BASE / f"outputs/{case}.md").read_text()
    assert "未解決入力の試行" in output
    blocks = re.findall(r"^### ((?:FM|PR|MR)-\d+) — ([\s\S]*?)(?=^#{1,3} |\Z)", output, re.M)
    assert blocks and len({key for key, _ in blocks}) == len(blocks)
    counts = {"items": len(blocks), "明示": 0, "強い導出": 0, "要確認": 0, "優先": 0}
    for key, block in blocks:
        values = {}
        for field in fields:
            match = re.search(r"^- " + re.escape(field) + r": (.+)$", block, re.M)
            assert match, (case, key, field)
            values[field] = match.group(1)
        kind = values["導出分類"]
        assert kind in ("明示", "強い導出", "要確認")
        counts[kind] += 1
        assert values["確度"] in ("高", "要精査")
        assert values["人間レビュー"] in ("優先", "通常")
        counts["優先"] += values["人間レビュー"] == "優先"
        if kind == "要確認":
            assert "未確定" in values["期待する結果（観測対象）"]
            assert values["確度"] == "要精査" and values["人間レビュー"] == "優先"
        # Numeric reference existence only; manual evaluation checks entailment.
        refs = [n for group in re.findall(r"([0-9・–〜～,、 -]+)行", values["根拠"]) for n in re.findall(r"\d+", group)]
        assert refs and all(1 <= int(n) <= line_count for n in refs), (case, key, refs)
    summary[case] = counts
for run in runs["runs"]:
    assert digest((BASE / f"records/{run['case']}-launch.txt").read_bytes()) == run["prompt_sha256"]
assert digest((BASE / "records/downstream-probe-launch.txt").read_bytes()) == runs["probe"]["prompt_sha256"]
for path, sha in runs.get("output_sha256", {}).items():
    assert digest((ROOT / path).read_bytes()) == sha, path
for doc in (ROOT / "docs/behavior-derivation").glob("*.md"):
    for target in re.findall(r"\]\(([^)]+)\)", doc.read_text()):
        if "://" not in target and not target.startswith("#"):
            assert (doc.parent / target.split("#")[0]).exists(), (doc, target)
print(json.dumps({"integrity": "PASS", "semantic_scoring": "manual; see results.md", "counts": summary}, ensure_ascii=False, indent=2))
