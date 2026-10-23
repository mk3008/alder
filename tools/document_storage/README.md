# 型付きJSONへ変換する

業務設計とCheck ItemのMarkdownを、一つの整形JSONへ変換できます。元Markdownを残し、変換後のJSONには業務内容・安定ID・参照・版を保存します。旧Markdown全文を埋め込みません。

JSONの作成・検証・編集はNode 24を使います。MD変換だけPython 3.12以降が必要です。追加パッケージ、APIキー、通信は不要です。新規出力は候補契約`0.4`で、例外をIDで参照します。[構造・旧版互換・明示移行](../../docs/json-native-contract.ja.md)を参照してください。正式v1採用・releaseは未実施です。

## まず試す

購買BDと共通保証・比較表付きCheck見本を同じファイルに変換します。Repositoryルートで、見本の[変換要求](examples/request.json)を使います。

```sh
node tools/document_storage/cli.mjs convert tools/document_storage/examples/request.json /tmp/alder-purchase.json
node tools/document_storage/cli.mjs validate /tmp/alder-purchase.json
```

出力先には存在しないファイル名を指定してください。成功時はBDとCheckの2文書を持つJSONが作られ、`valid: true`で構造と参照を確認できます。業務上の合意は判定しないため、Checkの原典対応は`unverified`のままです。

自分の文書を変換する場合は、要求ファイルの`path`・`documentId`・`revision`とCheckの`basedOn`を変更します。`path`は要求ファイルからの相対パスです。`documentId`は同じ文書で使い続ける識別子にし、変更時には内容revisionも更新します。Pythonのコマンドが`python3`でない環境は、環境変数`ALDER_PYTHON`へ実行ファイルを指定できます。

## 更新する

JSONを草案・編集する処理から、同じSchemaと検証器を呼び出せます。

```js
import {parseStrict, validate, stringify} from './core.mjs';
import {applyEdits} from './edit.mjs';

const pkg = parseStrict(jsonText);
validate(pkg);
const next = applyEdits(pkg, {
  expectedRevision: pkg.revision,
  revision: 'package-2',
  documentRevisions: {
    'my-bd': {expected: 'bd-1', next: 'bd-2'}
  },
  changes: [{id: activityId, values: {why: '変更後の目的'}}]
});
const nextJSON = stringify(next);
```

この例は依存Checkがない場合です。BD版に依存するCheckが同梱されている場合は、原典対応を確認した上で、Checkの`basedOn`とCheck文書版も同じ操作に明示してください。検証器は版を自動追従させず、不整合なら元の値を変更せず拒否します。人間レビュー状態の変更や再承認は自動では行いません。

## 詳しく調べる

- [保存契約・対応Markdown・API](../../docs/document-storage.ja.md)
- [JSON Schema](schema.json) / [再現可能な変換見本](examples/purchase.json)
- 検証：`node --test tools/document_storage/test-storage.mjs`

CLIは既存ファイルを上書きしません。失敗時はJSONを確定せず、stderrへ診断を出しexit 2で終了します。Markdownの全方言や曖昧な名前対応は対象外です。JSON→Markdown逆変換は提供しません。
