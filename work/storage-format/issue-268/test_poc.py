import copy
import unittest
from pathlib import Path
import poc


class StorageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = poc.write_fixtures()

    def test_lossless_three_formats(self):
        for fmt in ('md','json','jsonl'):
            b = poc.load(poc.encode(self.bundle,fmt),fmt)
            self.assertEqual(b,self.bundle)
            for doc in ('purchase','checks'):
                self.assertEqual(poc.render_document(b,doc).encode(),(poc.HERE/f'inputs/{doc}.md').read_bytes())

    def test_graph_projection_and_disagreement_are_explicit(self):
        with self.assertRaisesRegex(ValueError,'Medium'):
            poc.graph_parser.parse_document((poc.HERE/'inputs/purchase.md').read_text())
        projection, diagnostics = poc.validate(self.bundle)
        self.assertEqual(projection['graph']['version'],1)
        self.assertEqual(len(projection['graph']['nodes']),12)
        self.assertEqual(len(diagnostics),2)
        self.assertEqual(len(projection['findings']),4)

    def reject(self, mutate, pattern):
        b = copy.deepcopy(self.bundle)
        mutate(b)
        with self.assertRaisesRegex(ValueError,pattern):
            poc.validate(b)

    def test_unknown_version(self):
        self.reject(lambda b:b.update(formatVersion='2'),'unknown format/version')

    def test_unknown_kind(self):
        self.reject(lambda b:b['records'][0].update(kind='state-transition'),'unknown kind')

    def test_unknown_fields(self):
        self.reject(lambda b:b.update(extension={}), 'invalid envelope')

    def test_duplicate_id(self):
        self.reject(lambda b:b['records'][1].update(id=b['records'][0]['id']), 'duplicate/invalid ID')

    def test_missing_record(self):
        self.reject(lambda b:b['records'].pop(), 'count mismatch')

    def test_invalid_kind_heading(self):
        self.reject(lambda b:b['records'][0].update(kind='activity'),'kind/heading mismatch')

    def test_duplicate_json_key(self):
        for fmt in ('json','jsonl'):
            text=poc.encode(self.bundle,fmt).replace('"format":','"format":"duplicate","format":',1)
            with self.assertRaisesRegex(ValueError,'duplicate JSON key'):
                poc.decode(text,fmt)

    def test_truncated_and_broken_jsonl(self):
        text=poc.encode(self.bundle,'jsonl')
        for broken in (text[:-1], '\n'.join(text.splitlines()[:-1])+'\n',text.replace('\n','\n{broken}\n',1),text+'\n'):
            with self.assertRaises(ValueError):
                poc.load(broken,'jsonl')

    def test_truncated_json(self):
        with self.assertRaises(ValueError):
            poc.load(poc.encode(self.bundle,'json')[:-4],'json')

    def test_reference_missing_and_wrong_type(self):
        for target, message in [('not-found','dangling reference'),('purchase-0009','reference kind mismatch')]:
            def change(b):
                r=next(r for r in b['records'] if r['kind']=='activity')
                next(x for x in r['body'] if isinstance(x,dict))['ref']=target
            self.reject(change,message)

    def test_check_fragment_missing(self):
        def change(b):
            r=next(r for r in b['records'] if r['kind']=='check')
            r['body']=[line.replace('#申請の条件保証と例','#missing') for line in r['body']]
        self.reject(change,'missing Check fragment')

    def test_check_review_state_missing(self):
        def change(b):
            r=next(r for r in b['records'] if r['kind']=='check')
            r['body']=[line.replace('人間レビュー状態','状態') for line in r['body']]
        self.reject(change,'missing review state')

    def test_reorder_entities_preserves_graph_and_ids(self):
        b=copy.deepcopy(self.bundle)
        positions=[i for i,r in enumerate(b['records']) if r['kind']=='activity']
        a,z=positions[0],positions[-1]
        b['records'][a],b['records'][z]=b['records'][z],b['records'][a]
        self.assertEqual(poc.validate(b)[0],poc.validate(self.bundle)[0])
        # IDs are stored in structured formats; MD IDs are newly assigned by position.
        md=poc.decode(poc.encode(b,'md'),'md')
        first=next(r for r in b['records'] if r['kind']=='activity')
        new=next(r for r in md['records'] if r['heading']==first['heading'])
        self.assertNotEqual(first['id'],new['id'])

    def test_rename_object_stable_refs(self):
        b=copy.deepcopy(self.bundle)
        r=next(r for r in b['records'] if r['heading']=='# Object 購入用CSV')
        r['heading']='# Object 購買CSV'
        poc.validate(b)
        self.assertIn('- 購買CSV —',poc.render_document(b,'purchase'))
        self.assertEqual(r['id'],next(r['id'] for r in self.bundle['records'] if r['heading']=='# Object 購入用CSV'))

    def test_cycle_is_not_automatically_invalid(self):
        b=copy.deepcopy(self.bundle)
        r=next(r for r in b['records'] if r['kind']=='activity')
        at=r['body'].index('## Who\n')
        r['body'][at:at]=['## Exception When\n','\n',dict(ref=r['id'],label='PoCでのみ用いる自己再開例'),'\n']
        # Graph v1 allows explicit exception cycles; this is not business approval.
        poc.validate(b)

    def test_check_selection_includes_shared_guarantees(self):
        selected=poc.select(self.bundle,'JA-EX-04')
        headings={r['heading'] for r in selected}
        self.assertIn('### 却下の条件・保証と例',headings)
        self.assertIn('### 購入の条件・保証と例',headings)
        self.assertGreater(len(selected),1)

    def test_markdown_ambiguity_and_fences_rejected(self):
        text=poc.encode(self.bundle,'md')
        for bad in (text+poc.SEPARATOR+'# other\n',text+'\n```\n'):
            with self.assertRaises(ValueError):
                poc.load(bad,'md')


if __name__=='__main__':
    unittest.main(verbosity=2)
