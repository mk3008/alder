// Synthetic parser/renderer regression checks in JSDOM; not a real-browser test.
import assert from 'node:assert/strict';
import {after, test} from 'node:test';
import {JSDOM} from 'jsdom';
import {parseDesign} from '../src/graph.ts';
import {formattedMarkdown} from '../src/markdown.ts';

const dom = new JSDOM('', {url: 'https://viewer.test/', runScripts: 'outside-only'});
const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
Object.defineProperty(globalThis, 'document', {configurable: true, value: dom.window.document});
after(() => {
  dom.window.close();
  if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument);
  else delete globalThis.document;
});

const unsafe = '<script>window.pwned = true</script><img src="https://invalid.test/" onerror="window.pwned = true"><a href="javascript:alert(1)">link</a>';
const makeDesign = why => [
  '# Fence regression', '# Activity Review example', '## Scope', 'true',
  '## Why', ...why, '## When', 'After the example', '## Who', 'Reviewer',
  '## Where', 'Local fixture', '## How', '### Input', '(none)',
  '### Procedure', '1. Read the example', '### Output', '(none)',
  '## Result', unsafe
];
const expectedHeadings = [
  'Activity Review example', 'Scope', 'Why', 'When', 'Who', 'Where',
  'How', 'Input', 'Procedure', 'Output', 'Result'
];

function checkRender(source, expectedCode, fullDocument = false) {
  const article = formattedMarkdown(source);
  assert.deepEqual(
    Array.from(article.querySelectorAll('h1,h2,h3'), el => el.textContent),
    fullDocument ? ['Fence regression', ...expectedHeadings] : expectedHeadings,
    'later fields must stay outside the code block'
  );
  assert.deepEqual(
    Array.from(article.querySelectorAll('pre > code'), el => el.textContent),
    expectedCode,
    'only matching, sufficiently long, whitespace-only closing fences end a block'
  );
  assert.equal(article.querySelector('script,img,a,iframe,object,embed'), null,
    'HTML, links and images must stay inert');
  assert.equal(dom.window.pwned, undefined);
  assert.equal(article.querySelector('h2:last-of-type').textContent, 'Result');
  assert.equal(article.lastElementChild.textContent, unsafe);
  return article;
}

const fenceCases = [
  {name: 'ordinary backtick fence', open: '```text', body: ['literal', unsafe], close: '```'},
  {name: 'ordinary tilde fence', open: '~~~text', body: ['literal', unsafe], close: '~~~'},
  {name: 'shorter backticks inside a long fence', open: '````text', body: ['literal', '```', '## literal heading', unsafe], close: '````'},
  {name: 'shorter tildes inside a long fence', open: '~~~~~text', body: ['literal', '~~~~', '## literal heading', unsafe], close: '~~~~~'},
  {name: 'tildes inside a backtick fence', open: '```text', body: ['literal', '~~~~~', '## literal heading', unsafe], close: '```'},
  {name: 'backticks inside a tilde fence', open: '~~~text', body: ['literal', '`````', '## literal heading', unsafe], close: '~~~'},
  {name: 'closing-looking fence with non-whitespace suffix', open: '```text', body: ['literal', '````still literal', '## literal heading', unsafe], close: '```'},
  {name: 'four-space and tab-indented fence-like code', open: '```', body: ['    ```', '\t```', '## literal heading', unsafe], close: '```'},
  {name: 'indented opener and longer closer with accepted whitespace', open: '   ~~~~text', body: ['literal', unsafe], close: '  ~~~~~ \t\u001f'}
];

for (const {name, open, body, close} of fenceCases) {
  test(name, () => {
    const source = makeDesign([open, ...body, close]).join('\n');
    const design = parseDesign(source);
    assert.equal(design.graph.nodes[0].when, 'After the example');
    const expectedCode = [body.join('\n') + '\n'];
    checkRender(source, expectedCode, true);
    checkRender(design.sections['Review example'], expectedCode);
  });
}

test('four-space and tab indentation do not open fences', () => {
  const source = makeDesign(['    ~~~literal', '\t~~~literal', 'Normal prose']).join('\n');
  const design = parseDesign(source);
  const article = checkRender(design.sections['Review example'], []);
  assert.ok(article.textContent.includes('    ~~~literal'));
  assert.ok(article.textContent.includes('\t~~~literal'));
});

test('consecutive blocks retain independent fence state', () => {
  const source = makeDesign(['```', 'first', '```', '', '~~~~', 'second', '~~~', '~~~~']).join('\n');
  const design = parseDesign(source);
  checkRender(design.sections['Review example'], ['first\n', 'second\n~~~\n']);
});

for (const [name, newline] of [
  ['LF', '\n'], ['CRLF', '\r\n'], ['CR', '\r'], ['VT', '\v'], ['FF', '\f'],
  ['FS', '\u001c'], ['GS', '\u001d'], ['RS', '\u001e'], ['NEL', '\u0085'],
  ['LS', '\u2028'], ['PS', '\u2029']
]) {
  test(`renderer accepts parser ${name} line boundaries`, () => {
    const source = makeDesign(['````text', 'literal', unsafe, '````']).join(newline);
    const design = parseDesign(source);
    const expectedCode = ['literal\n' + unsafe + '\n'];
    checkRender(source, expectedCode, true);
    checkRender(design.sections['Review example'], expectedCode);
  });
}
