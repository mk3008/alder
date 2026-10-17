"""Discover unittest cases and write actual runner output to stdout."""

import sys
import unittest
from pathlib import Path


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    suite = unittest.defaultTestLoader.discover(str(root / "tests"))
    result = unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
    raise SystemExit(not result.wasSuccessful())
