# Preview候補の表示と整合性 — 実装前レビュー案

状態: **設計レビュー待ち。製品コード・配信用データは未変更。**

開始版は `08b90c2a7e8594558e041a686d89046c29415332`。今回の本人の訂正と追加指示を新しい要求として扱う。旧凍結正本は書き換えない。この案への独立した読み取り専用レビューを受けてから、新しい受入条件を確定・固定し、実装する。

## 目的と根拠

仮説を埋め、表・図を使って人間が誤りを見つけ訂正できるようにする。各項目に「仮説ではない」「決定済み」と入力する運用は追加しない。Viewerは業務意味の正本や承認機構にはしない。

根拠は本人の今回の訂正、`docs/philosophy.md`（JSON正本・Viewerによる意味レビュー）、`docs/adoption.md` の human and AI co-maintenance、`docs/business-design-structure.ja.md`（安定ID・参照・版の管理）、`docs/json-native-contract.ja.md`（構造妥当性と意味の承認の分離）、`docs/document-storage.ja.md`（版・参照の明示更新）である。古いMarkdownの非表示ID非管理という規則を、現在のJSONの安定ID管理へ逆適用しない。

今回の範囲は構造レビューPreviewの `meta.previewStructureReview` と、その作成・読込・表示・検証。正式Schema、正式formatVersion/schemaVersion、Plugin、保存器・移行は変更しない。人間には内部管理情報を表示しない。

## 現状の確認

- 現行catalogは339立場・338目的・207具体例。全339のsource pointerを元JSONへ解決し、対応する `informationId` の一致を確認した。現在の重複mapping ID・重複information IDは0件。
- 現行配信builderはpackage hashと全field ID集合を確認するが、pointerとIDの対応は確認していない。Viewerは元モデルとの結び付きを検証せず文字列とstatusで受理する。
- `hypothesis()` は理由をtitleへ、`candidateSource()` は根拠と出典をdetailsへ出す。全文コピーはDOMから読むため、CSSだけで隠しても解決しない。
- 共通reasonは339件で同文。perspectiveReasonは3種類の立場の説明を重複する。大半のsampleReasonは補完の作成方針であり、項目ごとの管理対象にする意味がない。
- 例外は2件。`cf-423df2519d7898` のPain例はProblemがある場合を仮定する。`cf-3907e6aa0081d2` のdocuments例は完成文書ではなく部分例。この適用意味は保持が必要。

## 正本を一つにする

元のJSONは元の業務・構造候補の正本としてbyte不変。今回追加した表示内容の編集正本は新しい静的Preview catalog一つとし、配信用JSON内のmetaと単独配信catalogはその生成物とする。二つを別々に編集しない。旧catalogは凍結した履歴として残し、現行配信用の二重正本にしない。

具体例・使用目的・立場の自然文/列挙はそのまま保持する。339件をIDごとに照合し、sampleはJSON型・null/空/false/0の区別も比較する。本文に元からある「仮説」「未確認」等の業務上の語を機械的に削らない。

## 内部構造の案と各要素の用途

Preview meta独自の識別子を `alder-preview-structure-review/2` とする案。これは正式JSON版の変更ではない。

| 要素 | 意味・コードで行う処理 |
| --- | --- |
| `basedOn.kind/documentId/revision` | 対象conceptModelの型・安定ID・版を照合する。別文書への流用を拒否する。 |
| `basedOn.modelSha256` | 自身の `meta.previewStructureReview` だけを除いた対象モデル全体を正規化したSHA256。版の更新漏れを含む内容変更を検出する。 |
| `origin.repository/commit/path/sha256` | 元資料の固定版とbyte照合。外部URLを推測した証拠にはしない。配信builderで取得済みの元byteと照合する。Viewerはネットワーク取得しない。 |
| `fields[]` の `target.conceptId/informationId` | 文書→concept→informationの型のある参照。配列位置や表示名では結び付けない。対象の一意性と所属を解決する。mappingはinformationIdで一意に解決する。 |
| `purpose` / `sample.value` / `perspectives` | 人間が表と詳細で確認する内容。元値を置換せず補足する。許容立場は依頼者・設計者・開発者、複数可。既存の組合せを保持する。 |
| `sample.coverage` | `field-value` または `document-fragment`。後者を完成文書Schemaに通る例と誤判定しない。部分例もJSON値としての安全性と参照先は検証する。 |
| `sample.when[]`（必要な1件だけ） | 例の仮定を `{target:{conceptId,informationId}, predicate:"nonempty"}` で表す。Pain例の対象は同じActivityのProblem (`cf-79e1f59247290a`)。実モデルにProblemがあるとのassertや自動承認には使わない。参照存在・所属・許容predicateを検証し、例が無条件の実績と混同されない適用区分として保持する。 |

`reason` / `perspectiveReason` / `sampleReason` の文章、source pointer文字列、scenario、重複definitions、項目ごとのstatus・confidence・approved flagは新catalogへ移さない。一般reason codeへの置換もしない。立場は既存の選択内容自体を保持し、その立場を選んだ文章を別のcode表へ移して二重管理しない。レビュー責務は全体で人間にあり、項目ごとにレビュー済みを記録する機構は作らない。

この内部構造は「なぜその使用目的が業務上正しいか」の証明ではない。既存の理由文にはその証明がなく、hashや参照を意味の根拠へ格上げしない。別の意味依存を今後使う場合は、参照の型・解決・失効条件が具体化できて初めて追加する。

## 検証と不整合の扱い

正規化はオブジェクトkeyを辞書順にし、JSON値と配列順を保持する。モデルから除外するのは当該Preview metaだけ。全体hashは保守的にモデルの変更を検出し、無関係そうな変更を意味解析で勝手に無視しない。fieldMappingsの並べ替えもstaleとなるが、参照の同一性は安定IDで解決し、別項目へ付け替えない。JSONの空白とobject key順だけの変更はstaleにしない。

配信builderとViewerは**同じ整合性規則**を使う。テストの期待値は別の受入正本と手書き小モデルから与える。相互一致だけで合格にしない。

1. catalogの形、未知の管理key、許容立場、例の型/適用区分を検査する。
2. model ID・版・内容fingerprintを照合する。concept/information/mapping/relation IDの重複を曖昧なまま採用しない。
3. 全targetの所属、一意mapping、mappingが使うrelation IDと端点、sample.whenの参照を解決する。対象の欠落・余分・二重登録、参照先削除を検出する。このPreviewでは全informationを対象にするため、モデル側への追加もcatalog更新を要求する。
4. 配信ではorigin byteも照合し、不一致なら非ゼロ終了、配布物確定・公開へ進まない。
5. Viewerは不一致catalogを**全体として補足表示に使わない**。部分採用して欠落を隠さない。元のモデル・値・既存操作は描画する。結果は型付きの検証結果（例: model-content-mismatch / missing-target / duplicate-target / missing-dependency）として呼出し側と検証で扱い、各項目に警告・理由文・承認操作を足さない。表示内容の欠落を検証で成功扱いしない。運用上は配信gateでこの状態を公開させない。

Viewerはoriginの真正性や業務意味を保証しない。モデルとcatalogを一緒に改変してhashを更新する行為はこの照合だけでは防げないため、builderが固定原典・新受入正本・IDごとの補完値を別に照合する。

### Viewerへの組込み境界（レビュー対象）

現行のparse/projectionと詳細renderは同期APIである。SHA256のために全JSON parserを非同期へ変えない。候補metaがある構造ページの入口でWeb Cryptoによる検証を行い、検証済みの読み取り専用projectionだけを一覧・属性詳細へ渡す案とする。検証完了前は補足をコピー・描画しない。候補なしの通常経路は従来どおり。読込/再編集/文書切替で新たに検証し、旧処理の完了が新しいモデルへ反映されないよう対象identityとgenerationを確認する。モデルをまたぐglobal cacheは置かない。Web Crypto不能・検証例外は無効の結果として処理し、元表示を保持する。

この非同期境界の必要性・侵入範囲は独立レビューで確認する。描画時に毎回全モデルhashを計算する方式、検証した後に変更された可変参照を無条件に再利用する方式は採らない。検証済みprojectionの寿命はその読込スナップショットに限定する。

## 維持する担当と更新契機

| 変更 | 実施担当・処理 |
| --- | --- |
| 元モデルの名前/意味/型/値域/関連/版/ID/項目集合を変更 | その変更を実装するAI/開発担当がcatalogの全体失効を検出。ID対応と意味への影響をレビューし、必要な補完だけ改稿して新しいbound版を作る。人間にhashやIDの手直しを要求しない。 |
| source reorderのみ | 担当が安定IDの全単射と内容不変を確認して再bindできる。古いindexから項目を選び直さない。 |
| 改名、削除、ID変更 | 改名はIDを保持し意味の変化を確認。削除は対応補完の除去を明示。ID変更は自動追随せず、旧→新の明示的対応と値保持/変更の検証が必要。正式保存器のID変更制約は変えない。 |
| 具体例/使用目的/立場の訂正 | 同じcatalogを担当が更新。元データ・未決状態を変更せず、配信JSONを再生成。人間の指摘を採用した範囲をレビュー記録へ残す。 |
| originの版/ファイル変更 | 固定commitとbyteを確認し、モデルへの表示用変換を再検証する。fingerprintの書換えだけで意味を再認定しない。 |
| 検証規則の変更 | Viewer/Preview実装担当が型と受入条件の影響をレビューし、配信・読込双方の負例を更新。旧凍結正本は修正しない。 |

再bindは公開のための自動修復にしない。変更一覧・対応ID・変更前後の内容を技術レビューで確認してから明示的に生成する。新たな項目別の承認状態・決定済みチェックは要求しない。未確定の業務意味が実際に出たときだけ、具体的な問いを人間へ返す。

## 可視表示とコピー見出し

一覧と属性詳細から管理用ラベル、details、title、ARIA内の根拠を除去し、rendererへ渡すprojectionには表示用の値と立場だけを含める。全文コピーにも管理情報を渡さない。DOMを隠すだけではなく、当該ノード・属性を作成しない。識別情報コピーのpayloadは維持する。

コピー2操作は論理名の同じ見出し行に置き、文言を保持する。枠線のない下線主体、通常captionと調和する文字サイズ/行高/基準線とする。操作のhit areaは見出しの通常フローを押し広げず確保し、focus-visible・キーボード・touch・393pxでの折返しを検証する。ヒット領域の重なりは不可。localName captionとの差を実画面で確認する。タブcloseは変更しない。

## 新しい受入条件の案（確認後に別ファイルで固定）

| ID | 条件と保証 / 検証予定 |
| --- | --- |
| CLEAN-001 | 一覧/属性詳細の追加例・目的・立場はIDごとに元catalogと同値（339/338/207、sample JSON型も一致）。手書き診断例、Pain条件、部分例の意味を別照合。 |
| CLEAN-002 | label/details/title/ARIA/通常・Shift・全文clipboardに管理マーカーとsentinel理由/出典が出ない。本文の実際の業務語は保持。 |
| CLEAN-003 | 型付き参照・モデル結合・source byte・全対象を配信/Viewer双方で検証。下記負例を独立期待で実施。 |
| CLEAN-004 | 元JSON、旧凍結正本、Schema/Plugin/保存器のbyte不変。元値・記述、47未決と理由、reviewState、コピーpayload、B経路とclose改善を保持。 |
| CLEAN-005 | コピーcaptionの行高/文字/整列/枠/下線、focus、ヒット領域、狭幅折返しと1280/393px・light/dark・keyboard/touchを実表示で確認。 |
| CLEAN-006 | lint/型/build/contract/関連Node・browser→最終head全体CI、別工程の正本byte/全ID/ケース/結果の照合とID削除・ケース削除・結果欠落の負例。独立事後レビュー後に固定Previewを新しい専用pathへ公開し、manifest全file/hash・公開画面/操作を検証。 |

負例: 同じrevisionのまま意味・型・関連・説明・候補依存を変更、source reorder、改名、target削除、information/concept/mapping/relation ID重複、ID変更、旧pointerとID不一致、未知/欠落の依存、対象の追加/欠落/二重登録、誤ったmodel ID/revision/hash、origin byte変更、candidate値/JSON型の不一致、未知key、古い非同期検証の後着、Web Crypto失敗。旧v1入力でも根拠を表示・コピーしないことを検査し、v1の無検証採用経路は残さない。legacyの扱いは本文のモデル結合を満たせないなら補足不採用とする。

旧REVIEW-HYP-003/005の仮説表示・根拠開閉・コピー内管理ラベル期待を今回のCLEAN-002/005で置き換える。001のデータ内容、002の保護、004の実行時推測なしは保持する。旧正本の各ID/ケースは残し、適用変更を新契約から明示する。

## 現時点の結果と残り

remote sourceは開始版と一致、PRはDraft・未merge。作業ツリーの他者編集なし、登録worktreeに新しいwriterなし。実行中の実装agentなし。開始版の出典全339対応・重複0件は読み取りのみで確認した。

添付画像はこのexecutorで未取得。既存のCONNECT403を迂回せず、本人の文章と親担当の正規経路での観測を根拠にする。画像既読とは記録しない。

残りはこの設計の独立確認、新受入条件の確定・固定、実装、事後独立レビュー、実テスト/全体CI、commit/push、PR本文更新、新beta公開と公開照合。現在の公開08b90c2aには今回の訂正は未反映。main merge・release・Plugin公開はしない。
