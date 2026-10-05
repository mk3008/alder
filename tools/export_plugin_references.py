"""Reproduce selected flattened skill references from a published source commit.

Publication is a maintainer prerequisite, not something a local Git object proves.
Read docs/plugin-bundling.md before refreshing a package.
"""

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def git_bytes(root, *args):
    result = subprocess.run(["git", "-C", str(root), *args], capture_output=True)
    if result.returncode:
        raise ValueError(result.stderr.decode().strip())
    return result.stdout


def export_plan(root, skill_names, source_revision=None):
    """Build the whole plan before writing; never read source working-tree bytes."""
    planned = {}
    for name in skill_names:
        if not re.fullmatch(r"alder-[a-z0-9-]+", name):
            raise ValueError(f"Invalid skill name: {name}")
        skill = Path("plugins/alder/skills") / name
        provenance_path = skill / "references/provenance.json"
        provenance = json.loads((root / provenance_path).read_text())
        if "sources" not in provenance:
            raise ValueError(f"{name}: this exporter requires a sources map")
        revision = source_revision or provenance["alder_source_revision"]
        if not re.fullmatch(r"[0-9a-f]{40}", revision):
            raise ValueError("Use a full 40-character source commit SHA")
        resolved = git_bytes(root, "rev-parse", "--verify", f"{revision}^{{commit}}").decode().strip()
        if resolved != revision:
            raise ValueError("Source revision must identify a commit directly")
        provenance["alder_source_revision"] = revision
        for group, directory in (("sources", "references"), ("scripts", "scripts")):
            for source in provenance.get(group, {}):
                path = PurePosixPath(source)
                if path.is_absolute() or ".." in path.parts or str(path) != source:
                    raise ValueError(f"Unsafe source path: {source}")
                destination = skill / directory / path.name
                if destination in planned or destination == provenance_path:
                    raise ValueError(f"Flattened destination collision: {destination}")
                content = git_bytes(root, "show", f"{revision}:{source}")
                planned[destination] = content
                provenance[group][source] = hashlib.sha256(content).hexdigest()
        planned[provenance_path] = (json.dumps(provenance, ensure_ascii=False, indent=2) + "\n").encode()
    return planned


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--skill", action="append", required=True, help="Skill directory name; repeat to select more")
    parser.add_argument("--source-revision", help="Full SHA of an already published canonical source commit")
    parser.add_argument("--check", action="store_true", help="Compare with committed provenance without writing")
    args = parser.parse_args(argv)
    if not args.check and not args.source_revision:
        parser.error("writing requires --source-revision; publish canonical sources first")
    try:
        planned = export_plan(ROOT, args.skill, args.source_revision)
        if args.check:
            mismatches = [str(path) for path, data in planned.items()
                          if not (ROOT / path).is_file() or (ROOT / path).read_bytes() != data]
            if mismatches:
                print("Bundle differs from its source commit:\n" + "\n".join(mismatches))
                return 1
        else:
            for path, data in planned.items():
                (ROOT / path).parent.mkdir(parents=True, exist_ok=True)
                (ROOT / path).write_bytes(data)
        print(f"{'Verified' if args.check else 'Exported'} {len(planned)} files for {len(args.skill)} skill(s).")
        return 0
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as exc:
        parser.error(str(exc))


if __name__ == "__main__":
    raise SystemExit(main())
