# 備品購入 Check Item 候補02の Consistency review-only

## 依頼と固定入力

依頼全文：

> 作者がcandidate-02.md（SHA-256 fd4f0893d7ece46229b90476cf3f7d049689057357defa83e60569a4b6bbf9e2）を保存しました。初めにhashを固定し、同じwhole BD/旧限定list/guidanceで全依頼範囲の読取専用再レビューをreader-report-02.mdへ記録。自身の前報告以外の作者点検/disposition/他評価は読まない。各IDの一般保証への一意到達と範囲、例の具体観察差、重複/消失、共有参照の全適用Activityと双方向導線、ID/人間状態/未決/Test補足/根拠を確認。新しい期待所見は渡しません。編集なし、未実施範囲と今回依頼全文を記録。Skill/inputは前回の公開固定版のままです。

開始時に候補のSHA-256が指定どおり`fd4f0893d7ece46229b90476cf3f7d049689057357defa83e60569a4b6bbf9e2`であると確認した。読んだものは同じpacket内の`AGENTS.md`、Alder draft-check-items Skill・必須guidance・名前診断・version/provenance、業務設計全体、旧限定リスト、およびcandidate-02だけ。作者点検/disposition、他評価、実装・Test、ネットワークは参照していない。候補とpacketは編集していない。

要求設定は`gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。実効設定の独立attestationはない。依頼指定の公開入力/Skill版は`75fb043568ade8b442853421a0bc78ef999b23e1`、packet内provenanceのauthority revisionは`b3113b7c0b6915562f0ebd6892e01199510cf319`、plugin versionは`0.4.8`。

SHA-256（相対パスはworkspace起点）：

| 入力 | SHA-256 |
| --- | --- |
| `meaning-runs/purchase/candidate-02.md` | `fd4f0893d7ece46229b90476cf3f7d049689057357defa83e60569a4b6bbf9e2` |
| `meaning-packets/purchase/business-design/purchase-request/README.md` | `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7` |
| `meaning-packets/purchase/docs/examples/purchase-check-review.ja.md` | `d2ad07f06cdef93537f6b8b5cca32a5f0f9ebad49ea4ba3f3ffcb1b407cfff55` |
| `meaning-packets/purchase/AGENTS.md` | `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/SKILL.md` | `aab470d8e289a1dd65ae6ab75a231ee171f519cd12a49316ed0660074d12d8d4` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` | `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/references/adoption.md` | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py` | `8bf2213bae05c0a4a4059b294229a67399460f36cfbb5ae23b4fd9a81b432cdf` |
| `meaning-packets/purchase/plugins/alder/plugin.json` | `8831bdea6a9fb06aef307f4859f71c1f3699eda32bde3d55a15c936743b1a1e6` |
| `meaning-packets/purchase/plugins/alder/skills/alder-draft-check-items/references/provenance.json` | `5aba19238e1eb020a3bbb31219096a09132912c90ac1a915db5f24b24ae9dc83` |

## 第一パス：宣言名と必要な共有参照

原典のraw宣言は`# Activity 備品購入を申請する`（123行）、`# Activity 購入申請を承認する`（170行）、`# Activity 購入申請を却下する`（218行）、`# Activity 承認済み備品を購入する`（267行）。候補一覧のraw表示名（9–12行）とH2（14、36、71、103行）はそれぞれ宣言名と字面・順序が一致。`check_activity_names.py --design ... --checks ...`はexit 0、`status: match`、`mismatches: []`、`target_issues: []`を返した。説明用H3はActivity名と混同していない。

原典の業務相関1–5（23–31行）を各保証の適用範囲として追う。JA-EX-01の申請成立は申請Activity本体27行（後続の承認/却下は依存先であって同Checkの共有先ではない）。JA-EX-02の承認は49行、JA-EX-03の却下状態は85行、JA-EX-05の購入状態は119行。JA-EX-04の`rejected`が購買対象にならない保証は原典業務相関5と却下Result（265行）から、却下と購入の両Activityに及ぶ。候補の一覧11・12行は同じJA-EX-04本体94行に直接リンクし、購入節105行も同本体および一般定義75行へ参照する。本体97行は却下側の例73–83行と購入側の例107–117行の双方へ戻る。独立した二つ目のIDやレビュー状態を作っていない。JA-EX-Q01は原典33–44行の金額別承認者/段階の未決であり、候補一覧10行・承認節58行に対応する。

## 第二パス：一般条件・保証と具体例

各一般保証はActivity節内の共通説明一箇所にある。各Checkの条件・期待結果欄（30、52、88、97、122行）は当該共通説明へのリンクと自分のIDを示し、状態変化・除外の規則を再定義していない。H3タイトルだけに保証を任せず、共通文中の固有IDからその定義を特定できる。比較表の行から各IDへ、各IDから該当表へ戻るリンクがある。原典と候補の個別対応は次のとおり。

| ID | 原典の限定された意味 | 候補の一般定義、観察差と範囲 |
| --- | --- | --- |
| JA-EX-01 | 原典145–168行。申請者が品名・数量・希望購入金額・購入理由をすべて必須入力として新しい購入要求を登録し、`submitted`の購入申請とする。 | 共通説明18行。例24行の新しい申請Aは「机」、2、20,000、「執務席用」が揃い、登録されたその申請Aの`submitted`を観測。25行の新しい申請Bは購入理由を欠き、必要条件不充足と成否未決を分離。数量・金額の許容域や必須入力だけによる成功十分条件を作らない。 |
| JA-EX-02 | 原典174–216行。承認者が`submitted`の申請を購入可と判断し選択すると、その対象が`approved`になる。 | 共通説明40行。申請Aの事前状態`submitted`と購入可判断・選択から、46行で申請Aの`approved`を観測。47行は同じ対象が`rejected`なら適用条件外で承認結果は未決。20,000は承認閾値でないと42行に明示。 |
| JA-EX-03 | 原典222–265行。`submitted`の対象選択と却下理由が必須で、却下後その対象が`rejected`になる。 | 共通説明75行。81行で申請Cと理由「購入を見送る」を明示して却下後のCの`rejected`を観測。82行のCは理由欠落で成否・状態未決。これを逆向きの不成立保証へ変えていない。 |
| JA-EX-04 | 原典31、265行。`rejected`の申請は購買担当者の購入対象にならない。JA-EX-03の状態変化と別に判断できる。 | 共通説明75行。81行でCが`rejected`になった後、購買対象から除外される別の観測を併記。83行では既に`rejected`のCを購入対象として扱おうとする場面で除外を観測し、再却下の結果は未決。購入側117行でもCの除外を観測し、実購入金額の有無はこの除外保証の条件ではないと区別。状態が変わった事実だけから除外の満足を推定しない。 |
| JA-EX-05 | 原典271–314行。`approved`の申請に基づき対象備品を購入し、購入した対象の選択と実購入金額を必須として結果を登録すると、その対象が`purchased`になる。 | 共通説明109行。115行は申請Dの事前`approved`、品名「机」、希望額20,000、購入した対象D、実購入金額19,500を同じ行に束縛し、登録後のDの`purchased`を観測。希望額と実額は別の情報で、差額処理は決めない。116行はDの実購入金額欠落と成否・状態未決を対比。 |

旧限定リストの5つの状態・除外保証とJA-EX-Q01は消えていない。候補は原典の日時記録や入力情報の保持などを新しい独立Checkとして増やしておらず、この限定草案を完全な原典カバレッジと取り違えない。候補24行の「申請Aの内容」は例の対象識別の説明であり、別の人間レビュー済み保証とは扱わない。各IDの関連業務、明示/考慮候補・AI確度、根拠、Test証拠未収集の補足は旧版から保持している。JA-EX-01–05はすべて`未レビュー`、Q01は`要確認`。Test証拠の未収集を人間の確認状態と混同していない。

## NG・原典未決・任意提案

- **NG（適用される記述ルール違反）：今回の読取範囲では、根拠を示せる残存NGを認めない。** 名前、4列一覧、単一IDと共有参照、一般定義の一意到達、比較例の具体入力・条件外の扱い、旧限定保証・状態・補足の保持について上記のsource/artifact対応を確認した。これは完全性や人間理解の保証ではない。
- **原典未決：** 原典33–44行の金額別承認者/承認段階はQ01（候補58–69行）で未承認・要確認のまま。条件となる金額や承認経路を新設していない。必須入力欠落または状態条件外の成否・失敗応答は原典にないため、例25、47、82、116行が未決とするのは妥当であり、必要ならBusiness Designへ返す。購入後の周辺業務も原典で今回の対象外である。
- **任意提案：** 承認例46行の「別の申請ではなく」は、別申請の識別と状態を併記すれば誤対象との差がさらに読みやすい。ただし選択対象Aとその事前/事後状態は既に具体的であり、この改善はNGではない。

候補3行は原典未合意の参考草案で、実装への合意済み引継ぎではないと明示する。旧版の歴史的source URLのrevision `c2852531ad62691c375e87818d8c3a49fd19803f`、各根拠の行範囲も候補31、53、66、89、98、123行で維持する。原典packet内の対応する冒頭・末尾行（23–31、33–44、123–168、170–216、218–265、261–265、267–314）は照合した。旧版の明示HTML `#ja-ex-01`等フラグメントは候補で見出しslugに移っており、既知の外部入リンクがあるかは確認できない。候補内のリンクは解決したため、この情報だけではNGを断定しない。

## 実行診断と未検証

- 名前診断は上記のとおりexit 0。候補内`#...`リンク42件（15種類）をGitHub風の見出しslugと照合し、未解決0。これらはテキスト上の狭い検査である。
- 実際のGitHub Markdownレンダリング、表の横幅・折返し、人間が例を理解できるか、外部から旧フラグメントへの入リンクは未検証。原典の遠隔`c2852531...`コミットにはネットワーク禁止によりアクセスしておらず、packet内容との同一性までは検証できない。
- Test/assertionの実在と実行、実装動作、公開入力コミットのGit同一性、実効ランタイム設定は未検証。候補・packetを編集せず、人間承認も行っていない。このレビューは限定候補について証拠付きの整合性判断であり、原典全保証の網羅や合意済み引継ぎを宣言しない。
