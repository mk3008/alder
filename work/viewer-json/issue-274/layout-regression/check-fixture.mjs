import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {convertMarkdown} from '../../../../tools/document_storage/convert.mjs';
const text=readFileSync(new URL('same-business.md',import.meta.url),'utf8');
const expected=JSON.parse(readFileSync(new URL('same-business.json',import.meta.url),'utf8'));
const actual=convertMarkdown({sources:[{text,documentId:'layout-oracle',kind:'businessDesign',revision:'1'}],revision:'1'});
assert.deepEqual(actual.package,expected);
console.log('Fixed JSON is the unchanged Gate A conversion of the paired Markdown; no semantic edits');
