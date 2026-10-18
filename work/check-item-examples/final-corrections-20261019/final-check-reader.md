# 保存版 Check Item — 独立読取 Consistency review

## 依頼と境界

> Alder Check Itemの保存版を読取専用Consistency reviewしてください。repo /workspace/scratch/0261bb5be107/final-fix-delivery。公開Skill/bundle ee99fd399a520abf7ba52f113f17d3c7dc090846 / BD e8d808902641d4571bbc5656b4b23d9e959f7636。入力は bundled alder-draft-check-items/SKILL.md・references/check-item-traceability.md・必要なadoption、work/check-item-examples/fixtures/README.md、旧Check meaning-validation-20261018/initial/final.md と update/final.md、新Check final-corrections-20261019/initial-candidate-02.md と update-candidate-01.md（すべて work/check-item-examples 下）のみ。read-onlyで、許可する出力は final-corrections-20261019/final-check-reader.md のみ。他review・author所見/実行・specimen・過去研究/他生成・実装/Test本体・browser/ネットワークを読まない。scopeは相談Checkの限定意味保持更新とBD書式移行後の整合確認。Skillに従い、宣言名と共有参照、一般保証と例/未決/具体差/前提・結果の区別を2パスで確認し、旧ID/人間状態/根拠/Test記述/保留/内部参照を保存実物で照合。新しい独立保証を追加要求したり書式を一律強制しない。根拠付きNG、業務未決、任意改善、未実施を分離し、日本語で所見を保存。依頼全文、要求gpt-6-sol/medium/fork none（実効attestation可否を別に）、公開版と入力/output hashを記録。期待所見は指定しない。人間承認は行わない。

要求された実行設定は `gpt-6-sol` / `medium` / `fork none`。この読取文脈では実効モデル・推論設定・fork 指定を機械的に証明するランタイム attestation は取得できない。公開版は Skill bundle `ee99fd399a520abf7ba52f113f17d3c7dc090846`、Business Design `e8d808902641d4571bbc5656b4b23d9e959f7636`。読み取った checkout は `f7c8c2913387c62e95cf683e26bad46e05348c09`。公開版の Skill・traceability と BD fixture の内容ハッシュが読み取ったファイルに一致することを確認した。

## 判定

指定範囲の二つの保存候補に、根拠付きの説明規則違反・意味の脱落・新たな無承認保証は確認しなかった。これは Check の人間承認、Test 実行、表示上の理解しやすさの証明ではない。以下の二パスは、旧 Check を変換前の比較対象、BD を意味の原典として行った。

### 第1パス：宣言名、所属、参照

BD の宣言は文字列どおり `# Activity 相談を受付する`、`# Activity 次の連絡方法を説明する`。両候補とも四列 index の表示名は `相談を受付する`／`次の連絡方法を説明する`、H2 も同じ生文字列で、順序も一致する。Skill 同梱の `check_activity_names.py` を BD fixture と各候補に対して実行し、両方 `status: match`、`mismatches: []`、`target_issues: []` だった。古い見出しから番号・接頭語を削る操作や旧名対応表は要らない。目的は各 Why、接続は第一 Activity の Result と第二 Activity の When・Input に対応する。

初稿の CI-01～05、CI-07、CI-08 は受付条件・結果・受付時の未決に属し、受付 Activity の index と本文に一つずつ載る。CI-06 は受付後に**その相談の依頼者**へ説明する保証なので、説明 Activity の index と本文に載る。初稿 CI-05 の後続への関連表記は上流保証の重複所属を要求しない。更新版 C-01／C-02 は受付、C-03／C-04 は説明に属する。後者の対象相談の同一性には前段の対応関係が必要だが、これだけで前段 Activity と共有 Check になるわけではない。各 ID の主本文と人間状態は一つ。検査した相対見出しリンクは初稿 50 件、更新版 33 件で、候補内の見出し先がないものはなかった。

### 第2パス：一般保証、具体例、前提と結果

| 原典の意味 | 初稿への対応 | 更新版への対応・具体差 |
| --- | --- | --- |
| 登録済み、本人または委任済み代理人（両立可）、非停止、同じ暦の日付で0～30日を両端込みで満たす相談を受付すると、その**相談**が受付済みになる。 | 「受付の条件と結果」の CI-01 が条件と結果を一度定義し、CI-01 本文が明示参照する。表の0日・30日・両資格の各行は、相談の識別、資格、停止、希望日、受付済みの観測を結び付ける。 | 「受付条件と結果」の C-01 が AND／包含 OR／暦日／両端／対象相談の結果を一度定義。A・B・C は0日・30日・両資格という異なる成立条件を示す。C-01 が確認済みでも Test 最終実行を証明したことにはしていない。 |
| 停止中、範囲外希望日、資格なし（更新版では未登録も）は受付条件を満たさない。条件不成立時の応答・記録・再申請は決めていない。 | CI-02、03、04 がそれぞれ一般の不成立判定を共有節で区別する。停止中14日行は CI-02 の観測、−1／31日を0／30日と比較する行は CI-03 の境界、資格なし14日を資格ありの日と比較する行は CI-04 の資格差。CI-02 の非停止14日の対照は**表にはない一般則からの導出**と明記され、実在する表の行だとは主張しない。全不成立行は未決の事後応答を確定しない。 | C-02 は条件不成立判定と未決の事後応答を分ける。D／E は日付境界、F は停止、G は未登録、H は資格なしを具体化。B／E は資格も異なることを候補自身が注記しており、日付だけの一変数比較だとは主張しない。候補表の「受付操作後：未決」は拒否・記録結果を創作しない。 |
| 受付済みの**同じ相談**を担当者が対応対象にでき、依頼者と相談の対応を保つ。後続の説明は受付後。 | CI-05 の一般定義と、別の利用者 E の同日相談と取り違えない短い例が対象同一性を示す。受付だけで案内完了とはしていない。 | C-01 はその相談の受付済みを保持。受付から説明への接続を index と説明節に保持する。旧更新版に C-05 相当の別 ID は存在せず、新設をこの限定表示更新に要求しない。 |
| 受付後、対象相談の**その依頼者**へ担当窓口と次の連絡方法の双方を担当者が説明する。 | CI-06 の一般定義は「その相談について次の案内をするとき」を場面とし、正しい相手・双方の説明を結果に置く。代理人 B と別相談の F、窓口のみの対照が相手と内容を区別する。固定文面・理解の自動判定は保証しない。 | C-03 は相手と双方の内容を含む全保証、C-04 は旧版からある**限定された相手対応**だけを別に保持する。A（甲）への双方／窓口のみ／B（乙）への双方の三行は内容と相手を別軸で示し、二行目は C-04 の相手のみ対応で C-03 全体を満たさず、三行目は内容のみ合っても両 ID に不対応と明記する。C-04 を案内内容や他の配布範囲まで拡張していない。 |

更新版の旧保存版との差分は原典の固定 revision を `d7f84...` から `e8d808...` に替えた箇所のみ。C-01～04 の ID、確認済み／要確認／未レビュー／要修正、未決保留、C-04 の人間フィードバック、C-01 の `test_acceptance::test_inclusive_window` と「最終実行結果は未収集」、C-04 の既存証拠なしを保持した。初稿は旧 CI-01～08 の ID と各状態、根拠分類、Test 証拠「未作成・未確認」を保持し、原典 revision の差し替えに加え、CI-02 の表外対照の明示と CI-06 の前提／結果の分離だけが意味に関わる説明変更である。初稿の旧保存版の原典は `75fb...`。両候補とも新 BD の業務規則と二つの `# Activity` に根拠を向け、初稿の `#業務上の規則`、`#activity-相談を受付する`、`#activity-次の連絡方法を説明する` は現行見出しに対応する。更新版は旧版と同じ原典ルートへの参照構造を保つ。

## 分離した所見

- **根拠付き NG：なし。** 上記範囲で修正必須の意味・名前・参照欠落を確認しない。新しい独立 Check を作ることや一律の書式に直すことは今回の判定条件にしない。
- **業務未決：** BD「業務上の規則」の条件不成立時の応答、記録の有無、再申請方法、希望日の変更。初稿 CI-07／CI-08 は要確認・未承認の候補として区別し、更新版 C-02 は既に保留済みとして今回は再質問しない。受付条件不成立から受付拒否を結論しない。これは候補の NG ではなく BD で人間が決める事項である。
- **任意改善：** 更新版の B／E は日付差だけでなく資格も異なるため、将来の例示改善時には同資格の30／31日対照を置くと境界を読みやすい。ただし現保存版はその交絡を明記し、一般則・他の境界例もあるため NG としない。
- **未実施・限界：** GitHub の実レンダリング、外部 URL の HTTP 到達、実装・Test 本体や実行結果、人間による理解・承認は検査していない。内部見出しリンクと新 BD の Git 内容はローカルで確認した。旧原典リビジョンの BD 内容と別途の人間フィードバック原本は指定入力ではないため照合せず、旧 Check 本文に残る状態・記述を保存比較に用いた。実効モデル設定の attestation も上記のとおり取得できない。

## 入力・出力の SHA-256

| 対象 | SHA-256 |
| --- | --- |
| `plugins/alder/skills/alder-draft-check-items/SKILL.md`（公開 bundle と一致） | `c8db0ae221668855cec1ef2e113511708d6ca1fbc15cb59c7ea7817679de0775` |
| `plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md`（公開 bundle と一致） | `dac05f461a36b11c73edc595873aeb51bae66b038ef0cc003f24db63e293fcb6` |
| `plugins/alder/skills/alder-draft-check-items/references/adoption.md` | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `work/check-item-examples/fixtures/README.md`（公開 BD と一致） | `cfb4a60b2f1f2dade893237cbdc38b9cda1bc4c8d89e9491d77affe13dd39c91` |
| `work/check-item-examples/meaning-validation-20261018/initial/final.md` | `5f0ed04d946d9df17aa7fad2fbdf22dc7d87b43d5d9892bc3a131cff9ff1f68d` |
| `work/check-item-examples/meaning-validation-20261018/update/final.md` | `9796b282318df8191d0804187bd9965105bf0d4662228b7e1e08644ecbfebce9` |
| `work/check-item-examples/final-corrections-20261019/initial-candidate-02.md` | `6f23acee887e35724fb589e17b76f4372efc08906137dea9887ffafdebcfe6f4` |
| `work/check-item-examples/final-corrections-20261019/update-candidate-01.md` | `14217b081248021af68b4d7f6a00d40bfab002ed0ae7bf6341926c6ad3daa403` |

出力ファイル自身の SHA-256 はこの記録を確定した後に別途算出し、親作業へ伝える。自己参照の値を本文に固定すると値が変わるため、ここには記入しない。
