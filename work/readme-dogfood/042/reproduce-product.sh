#!/usr/bin/env bash
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -R "$here/implementation-revised" "$tmp/workspace"
cp -R "$here/evidence" "$tmp/evidence"
cd "$tmp/workspace"
export PYTHONDONTWRITEBYTECODE=1
python run_tests.py
python ../evidence/14-mutation-probe.py original
set +e
python ../evidence/14-mutation-probe.py strengthened
status=$?
set -e
if [ "$status" -ne 1 ]; then
  printf 'Expected strengthened mutant detection exit 1, got %s\n' "$status" >&2
  exit 1
fi
printf '\nNormal suite passed; original suite missed the mutant; strengthened suite rejected it (expected exit 1).\n'
