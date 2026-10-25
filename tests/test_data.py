import json
import unittest
from pathlib import Path

class DataIntegrity(unittest.TestCase):
    def setUp(self):
        self.data = json.loads((Path(__file__).resolve().parents[1] / 'data/quetta.json').read_text())
        self.rows = self.data['rows']

    def test_source_totals(self):
        self.assertEqual(sum(r['n'] for r in self.rows), 9652)
        for key, expected in [('employed_n', 2121), ('unemployed_n', 98), ('not_in_labor_force_n', 4290), ('labor_force_n', 2219), ('student_status_n', 1848)]:
            self.assertEqual(sum(r[key] for r in self.rows), expected)

    def test_partition_and_weights(self):
        for r in self.rows:
            self.assertGreater(r['weight'], 0)
            self.assertAlmostEqual(r['labor_force'], r['employed'] + r['unemployed'])
            self.assertLessEqual(r['labor_force'] + r['not_in_labor_force'], r['weight'] + 1e-6)
            self.assertEqual(r['labor_force_n'], r['employed_n'] + r['unemployed_n'])
        unclassified = sum(r['n'] - r['labor_force_n'] - r['not_in_labor_force_n'] for r in self.rows)
        self.assertEqual(unclassified, 3143)

    def test_district_totals(self):
        for district, expected in [(1,4691), (2,2255), (3,2706)]:
            self.assertEqual(sum(r['n'] for r in self.rows if r['district']==district), expected)

    def test_no_identifiers(self):
        allowed = {'district','age','region','gender','education','marital','n','weight'}
        for k in ['employed','unemployed','not_in_labor_force','labor_force','student_status']:
            allowed.update([k, k + '_n'])
        for r in self.rows:
            self.assertEqual(set(r), allowed)

if __name__ == '__main__':
    unittest.main()
