# 備品購入 Check Item 候補の Consistency review-only

## 実行条件・入力

- 操作：読取専用レビュー。候補・packetの編集、修復、承認、再委譲は行っていない。
- 依頼全文：

> Alder SkillのConsistency review-onlyを実行。入力は /workspace/scratch/0261bb5be107/meaning-packets/purchase と /workspace/scratch/0261bb5be107/meaning-runs/purchase/candidate-01.md のみ。AGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須guidance、business-design/purchase-request/README.md全体、docs/examples/purchase-check-review.ja.md（旧版）を読みcandidateを読取専用レビュー。公開入力/Skill版75fb043568ade8b442853421a0bc78ef999b23e1、authority b3113b7c0b6915562f0ebd6892e01199510cf319。実際のフィードバックは一般保証を共通説明で一度だけ置き各Checkは参照中心で簡潔にし、例で意味の違いが確認できること。既存限定スコープの意味/ID/状態/未決/共有参照/補足/Testを保持。未合意BDの参考草案という性質と旧歴史アンカーを保持。具体source/artifact対応を示しNG/原典未決/任意提案/未実施を分離。/workspace/scratch/0261bb5be107/meaning-runs/purchase/reader-report-01.mdに依頼全文・入力hash・要求gpt-6-sol medium fork none（実効設定attestationなし）・実行診断と未検証を記録。候補/packet編集・修復・人間承認・再委譲禁止。完成見本・作者点検・過去評価・他出力/packet・実装/テスト・会話履歴・ネットワーク禁止。

- 要求ランタイム：`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。実効モデル・effort・fork設定を独立に証明するattestationは取得できない。
- 公開入力/Skill版：`75fb043568ade8b442853421a0bc78ef999b23e1`（依頼の指定）。authority revision：`b3113b7c0b6915562f0ebd6892e01199510cf319`（指定およびpacket内provenance）。packet内plugin versionは`0.4.8`。
- SHA-256（読んだ入力の各ファイル、相対パスはworkspace起点）：

| 入力 | SHA-256 |
| --- | --- |
| `meaning-runs/purchase/candidate-01.md` | `fb908756f7fdae505a071ca3b3376e6eb73082b3f0613c09bbf0d2af6d19d407` |
| `meaning-packets/purchase/business-design/purchase-request/README.md` | `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7` |
| `meaning-packets/purchase/docs/examples/purchase-check-review.ja.md` | `d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55` |
| `meaning-packets/purchase/AGENTS.md` | `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/SKILL.md` | `aab470d8e289a1dd65ae6ab75a231ee171f519cd12a49316ed0660074d12d8d4` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` | `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/references/adoption.md` | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py` | `8bf2213bae05c0a4a4059b294229a67399460f36cfbb5ae23b4fd9a81b432cdf` |
| `meaning-packets/purchase/plugins/alder/plugin.json` | `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/references/provenance.json` | `5aba19238e1eb020a3bbb31219096a09132912c90ac1a915db5f24b24ae9dc83` |

## 原典からの照合（第一パス）

原典の宣言は字面どおり `# Activity 備品購入を申請する`、`# Activity 購入申請を承認する`、`# Activity 購入申請を却下する`、`# Activity 承認済み備品を購入する`（原典123、170、218、267行）。候補の一覧ラベル（9–12行）とH2（14、36、71、103行）は順序・字面とも一致する。Skill同梱の`check_activity_names.py --design ... --checks ...`はexit 0、`status: match`、`mismatches: []`、`target_issues: []`を返した。これは名前と一覧先の狭い診断に限られる。

原典の業務相関1–5（23–31行）とActivityのResultを起点に必要参照を追った。JA-EX-01は申請の成立に一つの本体（候補27行）、JA-EX-02は承認（49行）、JA-EX-03は却下状態（85行）、JA-EX-04は却下済み申請の購買対象からの除外（94行）、JA-EX-05は購入結果（119行）。JA-EX-04は却下と購入の両業務に及ぶため、候補一覧の両行（11–12行）と購入節の参照（105行）が同じ本体・状態へ向く。申請から承認・却下への前提接続だけを理由にJA-EX-01を両節の共有項目とは扱わない。JA-EX-Q01は原典33–44行の金額別承認経路の未決に対応し、承認節に置かれている。4列一覧と直接Checkリンクは維持されている。

## 一般保証と例の照合（第二パス）

| ID | 原典の限定された条件・結果 | 候補の一般定義と例で確認した対応 |
| --- | --- | --- |
| JA-EX-01 | 申請者の品名・数量・希望購入金額・購入理由が必須（原典145–151行）、新規登録でその購入要求が`submitted`の申請となる（155–168行）。 | 候補18行が必要入力と新規対象の`submitted`を定義。24行の申請Aは机・2・20,000・執務席用がある新規申請の状態を観測し、25行の申請Bは理由欠落と未決の結果を対比。入力の存在だけを十分条件にせず、逆向きの失敗保証を作っていない。 |
| JA-EX-02 | 承認者が`submitted`の対象を購入可と判断・選択し、その申請が`approved`になる（原典174–216行）。 | 候補40行で対象を明示。46行は申請Aの`submitted`→`approved`、47行は同じ申請Aが`rejected`なら適用条件外で結果未決と区別。金額20,000を閾値にしていない。 |
| JA-EX-03 | `submitted`の対象選択と却下理由が必須、その対象が`rejected`になる（原典222–265行）。 | 候補75行で条件と対象の状態変化を定義。81行の申請C・理由「購入を見送る」は状態変化、82行の理由なしは未決の成否を対比。 |
| JA-EX-04 | `rejected`の申請は購買対象にならない（原典31、265行）。 | 候補75行でJA-EX-03と別の状態中の除外保証を定義。81行は却下操作後の申請Cが除外される観測、83行は既に`rejected`の申請Cが購入対象にならない観測、117行は購入節でも同一IDを参照。81行の状態変化だけで除外保証まで満たしたとは判定していない。 |
| JA-EX-05 | `approved`の対象備品を購買担当者が購入し、対象選択・実購入金額を必須として結果登録し、その対象が`purchased`となる（原典271–314行）。 | 候補109行で対象と結果を定義。115行は申請Dの`approved`→`purchased`、116行は実購入金額の欠落時の成否を未決として対比。ただし115行の希望購入金額の帰属には下記NGがある。 |

原典には申請情報・日時の保持、承認・却下・購入日時等も記載されているが、旧版は状態遷移と除外に限った5つの期待である（旧版の各JA-EX-01–05）。本レビューは限定された既存リストの更新として、他の独立保証を新しいCheckに加えることを要求しない。候補は同じ5 ID、各`未レビュー`、JA-EX-Q01の`要確認`、明示/考慮候補・AI確度、関連業務、Test証拠未収集の補足を保持している。Test証拠未収集は意味の未合意と別である。原典未合意・参考草案で合意済み引継ぎではないという冒頭の性質（候補3行）と旧版の`c2852531...` source URL/行範囲も保持した。元の明示HTMLフラグメントIDは候補では見出しslugに移り、候補内のリンクは下記診断では解決した。外部から旧フラグメントへの参照の有無は未検証。

## NG：適用ルールとの不一致

1. **一般保証を共通説明と各Checkで重複定義している。** Skillの`references/check-item-traceability.md`「Conditions, expressions and examples」は、一般条件・行為・各独立結果を共通Activity説明で一度定義し、各IDはその唯一の保証へ明示参照する形式を要求し、同じ規則の二重定義を点検する。候補18行と30行でJA-EX-01の必須入力→`submitted`、40行と52行でJA-EX-02の`submitted`→`approved`、75行と88/97行でJA-EX-03の`rejected`およびJA-EX-04の除外、109行と122行でJA-EX-05の`approved`→`purchased`を共通文と項目文で再記述している。各Checkに共通保証へのリンクはあるが、条件・期待結果欄が再びその条件と結果を定義しており、今回指定の「共通説明で一度だけ、各Checkは参照中心で簡潔」とも食い違う。原典の対応は上表の各Activity Input/Procedure/Result。修復は作者側で、限定保証の意味を保持しつつ各IDから唯一の定義へ到達できるようにする。
2. **JA-EX-05の比較例で希望額の対象が結び付いていない。** 同ガイダンスは各例の結果に関わる入力をその行の対象に明示的に束縛し、具体的な違いを観測できることを求める。候補115行は「申請D」の実購入金額19,500と「希望購入金額20,000」を対比するが、申請Dの希望額は115行にも共通説明111行にもない。20,000が与えられた申請は別の申請A（候補24、42行）である。原典の購入Activityは希望購入金額を含む対象申請の内容（289–300行）と実購入金額（292、300、312行）を別に扱う。現状のDについて差額を読む根拠がない。具体例の入力帰属を明示する提示上の修復事項で、差額の業務ルールの新設は不要。
3. **購入節の共有Checkから同節の比較例に戻れない。** 同ガイダンスは例の各行→該当ID、および影響する各Check→その共通例への戻り参照を要求する。候補117行は購入の比較表から共有JA-EX-04へリンクする一方、JA-EX-04本体94–101行の比較例リンク97行は却下節73行へだけ向き、購入節107行には向かない。原典31、265行に基づく同一の除外保証が購入Activityにも及ぶため、これは単一ID/単一状態を保ったままリンクを補う提示上の不整合である。候補12、105行の購入側から本体への参照自体は存在する。

## 原典未決・人間判断

- JA-EX-Q01：原典33–44行で申請金額ごとの承認者・段階を定めていない。候補58–69行は種別、未承認の期待、条件、確認事項、保留/決定の影響を見える形で保持し、`要確認`のまま。金額境界や承認経路はAIが決められない。今の限定スコープで保留する選択も原典に整合する。
- 必須入力欠落時や対象状態が条件外のときの成否・応答は、候補25、47、82、116行に「未決定」として表れ、原典は具体結果を与えない。これらを`rejected`等の状態遷移・失敗応答として断定しない。必要となるときはBusiness Designで人間が決める事項である。

## 任意提案（NGではない）

- 候補46行の「別の申請ではなく」は選択対象の意味を補うが、比較する別申請の状態・識別を具体化すると誤対象の差がさらに読み取りやすい。旧版の限定Checkを拡張せずに可能な例示上の改善であり、必須の欠陥とは判定しない。
- 旧版の明示`#ja-ex-01`等のHTMLアンカーを見出しslugに変えている。内部リンクは成立するが、外部から旧アンカーへの入リンクが既知なら互換性を確認し、必要なら維持する。既知の外部入リンクはこの入力からは確認できないためNGとは断定しない。

## 診断・未実施

- 同梱名前診断：exit 0、上記のraw宣言/見出し/一覧が一致。名前以外の保証・共有参照・人間状態を検査するものではない。
- 候補内の`#...`リンクを見出しslugと機械的に照合：41リンク、15種類、未解決0。見出しslugの通常のGitHub Markdown規則を仮定したテキスト検査であり、GitHubの実レンダリングを観察した証拠ではない。
- 原典の候補URLにある行範囲（23–31、33–44、123–168、170–216、218–265、261–265、267–314）はpacket内原典で冒頭/末尾を照合した。遠隔の`c2852531...`版そのものはネットワーク禁止のため訪問せず、同一内容であることは検証していない。
- ターゲットMarkdownの実レンダリング・横幅/折返し・人間の理解、Test/assertion実在と実行結果、外部フラグメント入リンク、公開入力コミットのGit同一性、実効ランタイム設定は未検証。候補・packetを編集せず、修復後の再レビューもしていない。したがって本候補に対する無条件の合格・人間の合意は表明しない。
