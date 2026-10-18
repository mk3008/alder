# Alder Check Item Consistency review-only

## 依頼全文

> 既存Alder SkillのConsistency review-onlyを実行してください。入力は /workspace/scratch/0261bb5be107/meaning-packets/update 内のみ。AGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須guidanceを読み、work/check-item-examples/fixtures/README.md全体に対して同ディレクトリchecks.mdを読取専用でレビュー。公開guidance/input版75fb043568ade8b442853421a0bc78ef999b23e1、candidateは提示作業コピーの正確なbyte/hashで固定。対象は規約適合・業務意味・サンプル・根拠・参照・未決・状態の整合。source/artifact具体対応・根拠付きNG・業務未決・任意提案・実施不能を分け、/workspace/scratch/0261bb5be107/meaning-runs/baseline-review/report.mdへ記録。編集・修復・再委譲・人間承認はしない。報告内に依頼全文、読んだ入力とhash、要求モデルgpt-6-sol/medium/fork none（実効設定attestationなし）、判定根拠、実行した診断、未検証範囲を含める。指定packetと自身のreport以外、完成見本・過去評価・別生成物・実装・テスト・ネットワークは禁止。

## 固定入力と方法

公開guidance/input版は `75fb043568ade8b442853421a0bc78ef999b23e1`。レビュー対象の作業コピーは次のSHA-256のバイト列で固定した。公開URLの内容を取得してこのコピーと同一であると認証したものではない。要求モデルは `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。実効設定のattestationはない。

| 読んだ入力（すべて `meaning-packets/update/` 以下） | SHA-256 |
| --- | --- |
| `AGENTS.md` | `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f` |
| `plugins/alder/skills/alder-draft-check-items/SKILL.md` | `aab470d8e289a1dd65ae6ab75a231ee171f519cd12a49316ed0660074d12d8d4` |
| `plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` | `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6` |
| `plugins/alder/skills/alder-draft-check-items/references/adoption.md`（冒頭からOptional Functional Interfaceまで） | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `plugins/alder/skills/alder-draft-check-items/references/candidate-c3.md` | `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446` |
| `plugins/alder/skills/alder-draft-check-items/references/provenance.json` | `5aba19238e1eb020a3bbb31219096a09132912c90ac1a915db5f24b24ae9dc83` |
| `plugins/alder/plugin.json` | `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6` |
| `work/check-item-examples/fixtures/README.md`（全文、原典） | `e00c06ef469c015120add5dc92249b53eabd496750ff9aeb1b7f9a84ab469cd0` |
| `work/check-item-examples/fixtures/checks.md`（全文、候補） | `5381e599a4a3e184aaf669670017e9976e46683a6597307baf894ea103c788df` |
| `plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py`（診断として実行） | `8bf2213bae05c0a4a4059b294229a67399460f36cfbb5ae23b4fd9a81b432cdf` |

Plugin版は `0.4.8`、同梱provenanceのAlder source revisionは `b3113b7c0b6915562f0ebd6892e01199510cf319`。レビューは原典を先に読み、Activity宣言・条件→結果・未決を抽出してから候補の各ID、索引・節・例・根拠・状態を照合した。`checks.md:3` の原典URLは `d7f84fcca636e88015b15b9da993b200abd62999` を指すが、そのリモート版は参照していない。

## 原典から候補への対応

| 原典の意味 | 候補の対応と判定 |
| --- | --- |
| `README.md:12` 宣言名「相談を受付する」、`:16,20,28,32` 目的・条件・受付後の状態 | 索引 `checks.md:7` と節 `:10` は宣言名と一致。C-01（`:33-63`）は受付条件と受付済みを扱う。C-02（`:65-91`）は不成立時の未決。受付後に**担当者がその相談を相談対応の対象として扱える**という `README.md:32` の独立した後続利用保証は、C-01の期待結果 `checks.md:52`、C-02、または他のIDに定義されていない。索引の接続文とC-01の関連業務欄だけでは保証にならない。 |
| `README.md:34` 宣言名「次の連絡方法を説明する」、`:42,50,54` 受付後、その相談の依頼者に担当窓口と次の連絡方法を説明 | 索引 `checks.md:8` と節 `:93` は宣言名と一致。C-03（`:95-115`）は説明先と二つの説明内容を定義。C-04（`:117-137`）は同一依頼者への説明を再定義するが、C-03の条件・期待結果 `:101-105` に含まれる保証との境界が不明瞭。C-01が前段であるだけでC-03/C-04を前段Activity共有Checkとは扱わない索引は妥当。 |
| `README.md:7-8,20` 暦日0～30日両端含む、本人または委任済み代理人の包含OR、登録済み、非停止 | C-01 `checks.md:39-52` はANDと包含OR・日付境界を保持。比較表 `:20-29` は0日、30日、両資格、範囲外、停止、未登録、資格なしを具体的に区別し、対象相談ごとの判定を示す。 |
| `README.md:9` 条件不成立の応答・記録・再申請、希望日変更は未決 | C-02の種別・状態・未承認の期待欄 `checks.md:67-86` と表の不成立行 `:25-29` は受付拒否を決めず保留を維持。変更も `:31,86` に見える。ただし変更時の扱いはC-02の「受付条件不成立」と異なる契機であり、このIDの保証範囲に取り込まれていない。独立した未決事項としての追跡単位は明瞭でない（下記「業務未決」）。 |

## 根拠付きNG（規約適合・意味の欠落・例）

1. **後段利用保証の欠落。** 原典 `README.md:32` は受付済みに加え、担当者が**その相談**を対応対象として扱える結果を明示する。候補C-01の一般保証・期待結果 `checks.md:48,52` は「受付済みになる」に止まり、索引 `:7` の接続と関連業務 `:62` は期待結果を定義しない。現行guidance `check-item-traceability.md` の「2. Functional Interface and Check Item」「Before returning a draft or update」「Distinct Consistency review and repair」は独立してレビューできる結果を原典から追跡し、失われた一般保証を報告する。担当者の後続利用が成立することを、既存の受付済み状態だけで自動証明したとみなせない。どのIDで保持するかは著者の修復事項であり、このレビューは追加・編集しない。
2. **C-01の操作・含意が結果を先取りする。** 原典の契機は相談を「依頼する」こと `README.md:20`、手順は入力受領→条件確認→受付済みとして扱う `:28`。候補の式 `checks.md:48` は条件に「その相談を受付する」を加えて受付済みへ含意し、操作 `:50` も「確認してその相談を受付する」と書く。「受付する」が成功済みの意味なら期待結果を前提に含むため、原典の申請・確認から受付済みへの保証を表せない。現行guidance `check-item-traceability.md`「Conditions, expressions and examples」は操作を成功と区別し、成功を前件にした保証式を避けるよう求める。曖昧な「受付する」に依存せず、原典の契機・行為と結果の向きを明確にする必要がある。C-01の数値・資格条件自体は正しい。
3. **C-03の短い例に観測差がない。** `checks.md:109` は「相談A」の名を入れた後、一般期待 `:105` と同じ「担当窓口と次の連絡方法が説明される」を繰り返す。どの窓口・連絡方法をどう伝えたか、または説明がない／別内容だった場合と何が違うかが観測できない。原典 `README.md:50,54` は対象依頼者と両情報の説明を保証する。現行guidance同節および「Distinct Consistency review and repair」は短い例にも具体的な観測と実質的な差を求め、期待結果の言い換えを十分な例としない。固定文言・自動理解判定は原典が規定しないため、これらを合格基準にはしない。
4. **C-04の一般保証と例がC-03の一部を重複し、固有の差を示さない。** C-03 `checks.md:101-105` は既に「その相談の依頼者へ」説明する保証である。C-04 `:123-127` は同じ相手への説明を繰り返し、`:131` の「相談Aの依頼者」「別の相談の依頼者」も別の具体的な相談・依頼者や観測結果を示さない。原典 `README.md:50,54` は同じ相談の依頼者を指す。現行guidance「2. Functional Interface and Check Item」「Conditions, expressions and examples」「Distinct Consistency review and repair」は各IDの独立保証、重複のない一般定義と、例の実質的な区別を求める。C-04が要修正という人間状態 `:119,136` は保持すべきで、このNGを理由にAIが確認済み・要確認へ変更するものではない。

## 業務未決・状態と証拠

- 原典 `README.md:9` の条件不成立時の応答・記録・再申請と希望日変更は未決のまま。C-02 `checks.md:67-91` は「原典で未決」、要確認、候補・未承認と明示しており拒否を導いていない。保留済みで再質問しない記載 `:85` を尊重する。希望日変更は条件不成立と異なる事象なので、将来その結果を決めるならBusiness Designで決めた後に該当Checkを導出する必要がある。今回のレビューは新たな期待結果を選ばない。
- C-01「確認済み」`:35`、C-03「未レビュー」`:97`、C-04「要修正」`:119`、C-02「要確認」`:69` は、それぞれ候補内では一つの主項目にあり、テスト証拠の有無と混同していない。C-01の人間による確認履歴、C-04の元フィードバック本文、既存一覧の版は入力されていない。したがってそれらの真正性・更新による意味保持は検証不能であり、状態を上書きしない。
- C-01の `test_acceptance::test_inclusive_window` `checks.md:63` は0日・30日を検査すると記すが、テスト本体と実行結果は禁止入力で未読。資格、停止、登録、同一相談、後段利用まで当該テストで証明されたとは言えない。C-03の `:115` の「説明内容を判定する自動方式は未決」は、原典 `README.md:50` の「固定の説明文や自動理解判定は規定しない」を、別の自動方式の決定待ちと読み替える根拠にはならない。ここは証拠未収集の表示を超えた業務決定として使わない。

## 任意提案（NGや業務決定と区別）

- C-04を独立した「対象の同一性」のCheckとして残す場合は、C-03の一般保証からその部分を重複定義しない形で、二つの相談と依頼者の対応、説明された相手を具体的に比較すると、元フィードバック `checks.md:136` に答えやすい。どの分割が最善かはこの読取専用レビューでは確定しない。
- 希望日変更の未決は、C-02の条件不成立の結果と混ざらない見出しや独立の未決項目として見えるようにすると後の追跡が容易になる。変更後の扱い自体を提案していない。

## 実行した診断、参照と未検証範囲

`python3 plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design work/check-item-examples/fixtures/README.md --checks work/check-item-examples/fixtures/checks.md` を指定packet内で実行し、exit 0、`status: match`、宣言・索引・節はいずれも生文字列 `相談を受付する`、`次の連絡方法を説明する`、mismatches/target_issues は空だった。索引は指定の4列、両行のCheckリンクは各単一H3主項目へ向かい、共有Checkの誤複製はない。比較表の行→C-01/C-02と両Check→比較表のフラグメントもテキスト上の見出しに対応する。C-03/C-04は短い例で表の往復リンクは不要。原典の宣言名を番号除去や意訳で合わせてはいない。

原典・候補を `nl -ba` で全文照合し、SHA-256を `sha256sum` で再計算した。診断は名称・狭いターゲットの一致だけを示し、上記の意味・例・状態を自動判定しない。Markdownの実際のGitHubレンダリング、公開原典URLの到達性とその版の内容、テストのassertion/実行結果、人間による理解・確認、過去一覧との変換回帰は検証していない。指定packet外の完成見本・過去評価・実装・テスト・ネットワークは読んでいない。候補に対する編集、修復、再委譲、人間承認は行っていない。これらの未実施部分について合格を主張しない。
