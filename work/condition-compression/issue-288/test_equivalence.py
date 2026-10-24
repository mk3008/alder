"""Bounded synthetic review evidence, not a product branch generator."""
import copy
import itertools
import unittest

# Fixture BD: one request, submission action. Stopped dominates urgent and amount.
# Otherwise urgent needs manual review; ordinary amount <=100 passes, >100 holds.
# At exactly 100 the notification outcome remains undecided.
# A stopped request stays stopped; urgent review retains draft; pass submits;
# hold retains draft. These effects must survive the same display label.
POINTS = list(itertools.product([False, True], [False, True], [99, 100, 101]))
BEFORE = [
    ('通常可', '提出済み', '通知する'),
    ('通常可', '提出済み', '通知未決'),
    ('保留', '下書き保持', '通知なし'),
    ('保留', '下書き保持・手動確認', '通知なし'),
    ('保留', '下書き保持・手動確認', '通知なし'),
    ('保留', '下書き保持・手動確認', '通知なし'),
    ('禁止', '停止保持', '通知なし'),
    ('禁止', '停止保持', '通知なし'),
    ('禁止', '停止保持', '通知なし'),
    ('禁止', '停止保持', '通知なし'),
    ('禁止', '停止保持', '通知なし'),
    ('禁止', '停止保持', '通知なし'),
]
# Rows are disjoint: precedence is explicit by excluding stopped/urgent below.
ROWS = [
    ((True, None, None), BEFORE[6]),
    ((False, True, None), BEFORE[3]),
    ((False, False, 99), BEFORE[0]),
    ((False, False, 100), BEFORE[1]),
    ((False, False, 101), BEFORE[2]),
]

def compare(rows):
    differences = []
    for point, expected in zip(POINTS, BEFORE):
        matches = [result for pattern, result in rows
                   if all(a is None or a == b for a, b in zip(pattern, point))]
        if matches != [expected]:
            differences.append((point, expected, matches))
    return differences

class CompressionTest(unittest.TestCase):
    def test_scope_priority_and_all_effects_equal(self):
        self.assertEqual(len(POINTS), 12)
        self.assertEqual(compare(ROWS), [])

    def test_wrong_dont_care_detected(self):
        rows = copy.deepcopy(ROWS)
        rows[1] = ((None, True, None), BEFORE[3])
        self.assertTrue(compare(rows))  # stopped+urgent must remain forbidden

    def test_missing_branch_detected(self):
        self.assertTrue(compare(ROWS[:-1]))

    def test_boundary_unknown_cannot_become_dont_care(self):
        rows = copy.deepcopy(ROWS)
        rows[3] = (rows[3][0], BEFORE[0])
        self.assertEqual(compare(rows)[0][0], (False, False, 100))

    def test_same_label_cannot_swallow_exception_effect(self):
        rows = copy.deepcopy(ROWS)
        rows[1] = (rows[1][0], BEFORE[2])
        self.assertTrue(compare(rows))

if __name__ == '__main__':
    unittest.main(verbosity=2)
