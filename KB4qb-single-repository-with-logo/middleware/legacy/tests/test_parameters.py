import copy, json, sys, unittest
from pathlib import Path
from jsonschema import ValidationError
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'tools'))
from parameters import validate_parameter_space, evaluate, index, query, audit
from kb import validate, cell
class ParameterTests(unittest.TestCase):
    def setUp(self):
        self.k=json.loads((ROOT/'data/kb.json').read_text())
        self.p=json.loads((ROOT/'data/parameter-space.json').read_text())
    def check(self):validate(self.k);return validate_parameter_space(self.p,self.k)
    def test_current(self):self.check()
    def test_hierarchy(self):self.assertEqual(query(self.p,'qb:redox'),['EX-PT-RDE','EX-SAM-LSV'])
    def test_unknown_tag(self):
        self.p['quantities'][0]['term_id']='qb:fiction'
        with self.assertRaises(ValueError):self.check()
    def test_cycle(self):
        self.p['vocabulary'][0]['parent_ids']=['qb:orr']
        with self.assertRaises(ValueError):self.check()
    def test_missing_value(self):
        self.p['quantities'][0].update(value=0,status='not_yet_checked')
        with self.assertRaises(ValidationError):self.check()
    def test_zero_is_value(self):
        self.p['quantities'][0]['value']=0;self.check()
    def test_wrong_unit(self):
        self.p['quantities'][0]['unit']='V'
        with self.assertRaises(ValueError):self.check()
    def test_incompatible_formula_dimensions(self):
        self.p['mathematical_spaces'][0]['variables'][1]['unit']='V'
        with self.assertRaises(ValueError):self.check()
    def test_unknown_expression(self):
        self.p['mathematical_spaces'][0]['expression']['op']='eval'
        with self.assertRaises(ValidationError):self.check()
    def test_cross_context(self):
        self.p['comparisons'][0]['quantity_id']='SAM-DELTA'
        with self.assertRaises(ValueError):self.check()
    def test_clinical_leap(self):
        self.p['translation'][0]['clinical_evidence']='established_here'
        with self.assertRaises(ValueError):self.check()
    def test_unlinked_contrast(self):
        self.p['comparisons'].pop()
        with self.assertRaises(ValueError):self.check()
    def test_current_zero(self):
        with self.assertRaises(ValueError):evaluate(self.p['mathematical_spaces'][1],{'I_parallel':0,'I_antiparallel':0},index(self.p['units']))
    def test_polarization(self):
        self.assertAlmostEqual(evaluate(self.p['mathematical_spaces'][1],{'I_parallel':3,'I_antiparallel':1},index(self.p['units'])),.5)
    def test_review_trigger(self):
        checks=audit(self.p)['model_arithmetic'];self.assertEqual([c['review_trigger'] for c in checks],[False,True,False]);self.assertAlmostEqual(checks[1]['computed'],7.9419,places=3)
    def test_numeric_export(self):self.assertEqual(cell(-.1),-.1);self.assertTrue(cell('=1+1').startswith("'"))
if __name__=='__main__':unittest.main()
