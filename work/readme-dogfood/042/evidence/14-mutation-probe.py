"""Remove one assignment only in memory; never write the product module."""
from pathlib import Path
import sys
import types
import unittest

root = Path(__file__).resolve().parent.parent / 'workspace'
source = (root / 'tool_return.py').read_text()
assignment = '    record.available_for_loan = False\n'
assert source.count(assignment) == 1, 'Mutation target must be unique.'
mutated = source.replace(assignment, '', 1)
product = types.ModuleType('tool_return')
product.__file__ = str(root / 'tool_return.py')
sys.modules['tool_return'] = product
exec(compile(mutated, '<in-memory missing availability assignment>', 'exec'), product.__dict__)
mode = sys.argv[1]
assert mode in ('original', 'strengthened')
test_path = (Path(__file__).resolve().parent / '14-tests.before.py'
             if mode == 'original' else root / 'tests/test_tool_return.py')
tests = types.ModuleType('test_tool_return')
tests.__file__ = str(test_path)
sys.modules['test_tool_return'] = tests
exec(compile(test_path.read_text(), str(test_path), 'exec'), tests.__dict__)
suite = unittest.defaultTestLoader.loadTestsFromModule(tests)
print(f'Mutation: remove exact success-path assignment in memory; suite={mode}.')
result = unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
raise SystemExit(not result.wasSuccessful())
