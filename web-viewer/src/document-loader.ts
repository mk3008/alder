import {parseDocument,readDesignFile} from './document-input.ts';
import {fetchDocumentSource} from './source.ts';

/** Acquisition varies; normalization and model loading never do.
 * No history-only MIME policy or parser. File and URL budgets stay distinct. */
export const loadDocumentFile=readDesignFile;
export async function loadDocumentURL(url:string,signal?:AbortSignal){
 return parseDocument(await fetchDocumentSource(url,signal));
}
export function loadDocumentText(source:string){
 if(new TextEncoder().encode(source).byteLength>2*1024*1024)throw Error('本文は2MiB以内にしてください。');
 return parseDocument(source);
}
