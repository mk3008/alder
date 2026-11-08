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

## 旧JSONを明示的に0.4へ変換する（Phase 2）

本人から変換の明示依頼がある場合だけ実行する。0.1／0.2／0.3を検出して構造移行し、未知版・混在した文書契約・解決できない例外名は対象と理由を返して停止する。0.4は通常編集する。読取り互換モデルを保存候補として流用せず、移行専用処理がrevision更新と差分検証を行う。

```sh
node tools/document_storage/author-cli.mjs inspect old.json
node tools/document_storage/author-cli.mjs prepare-version-upgrade old.json candidate.json revisions.json > conversion-report.json
node tools/document_storage/cli.mjs validate candidate.json
node tools/document_storage/author-cli.mjs inspect candidate.json
```

`revisions.json` は次の形。`expectedSha256` は入力ファイル全体のSHA-256（inspectのsha256）、revisionは文書内容から推測せず新しい値を明示する。`documentRevisions` には実際に変わる文書だけを指定する。BDの構造変更に従ってState／CheckのbasedOnも更新する。未変更文書のrevision指定は拒否する。

```json
{
  "expectedSha256": "<inspectが返した64桁のhash>",
  "expectedRevision": "package-old",
  "revision": "package-converted",
  "documentRevisions": {
    "bd": {"expected": "bd-old", "next": "bd-converted"},
    "state": {"expected": "state-old", "next": "state-converted"}
  }
}
```

標準出力の例（抜粋）:

```json
{"candidate":"candidate.json","sourceUnchanged":true,"fromVersion":"0.2","toVersion":"0.4","migration":"exceptions-0.4","editable":true,"approval":"not-evaluated"}
```

実際の報告は変換前後の入力hash、文書ごとの変更フィールド・revision・basedOn、既存／追加ID、原典・外部参照目録の保全、Check reviewState、未確定Role／Who・例外参照と診断を含む。候補はvalidate済みで新規出力のみ。出力が既存ファイルや入力の別名なら失敗する。報告の保存先にも入力ファイルを指定しない。

候補を正本へ採用する依頼を受けたら、差分を確認し通常のcommitを使う。

```sh
node tools/document_storage/author-cli.mjs commit old.json candidate.json operation.json
```

`operation.json` には入力の `expectedSha256`／`expectedRevision` と `migration: "exceptions-0.4"` を指定する。CheckのbasedOnが変わる場合、移行後BDの正確なrevisionに対する実際の人間確認を `bdConfirmations` に渡す（形式は既存authoring手順）。移行候補の作成は確認を要求・生成しない。候補作成時点の確認を人間合意として保存しない。commitは候補を構造移行の再計算結果と照合し、Role／Who・業務内容・Check状態の変更を混ぜた候補を拒否する。採用後に改めて通常編集する。旧版の直接編集とroles-0.3の保存は引き続き拒否する。

複数案は案IDを一つ明示する。候補は対象案だけを変えた別bundle。対象外の案・名前・順序を保持し、入力bundleのhashを照合する。

```sh
node tools/document_storage/named-plans-cli.mjs prepare-version-upgrade plans.json selected new-plans.json revisions.json > conversion-report.json
node tools/document_storage/named-plans-cli.mjs inspect new-plans.json
node tools/document_storage/named-plans-cli.mjs extract new-plans.json selected selected-candidate.json
node tools/document_storage/named-plans-cli.mjs commit plans.json selected selected-candidate.json operation.json
```

named-plansのcommitには従来どおり単一package候補を渡す。要求のexpectedRevisionは対象案のpackage、expectedSha256は元bundle全体の値。案の選択省略・不存在・重複は拒否する。

0.1／0.2では `roleId: null` とWho原文・未確定診断を残し、0.3に既存RoleがあればID／名称／色と参照を保持する。`upgradeRoles` の0.3化は単純WhoからRoleを生成するため、0.4への汎用変換には合成しない。Conceptは現行Schemaでは0.4専用で、旧版との混在を変換可能と推測しない。

Skillは既存 `alder-manage-json-documents` の明示移行ルートを使う。配布用同梱コピーとprovenanceの再生成には [同梱同期手順](https://github.com/mk3008/alder/blob/96ccd8d9/docs/plugin-bundling.md) の公開済みソースコミットが必要。この未コミット実装では再生成・配布を行わず、リポジトリのCLIを使う。同梱版への反映はソース公開後にexporterとpackage検査で行う。

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
