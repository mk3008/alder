# Consistency review-only — initial candidate 01

## 依頼と実行範囲

依頼全文（受領時の文面）：

> Alder SkillのConsistency review-onlyを実行。入力は /workspace/scratch/0261bb5be107/meaning-packets/initial と /workspace/scratch/0261bb5be107/meaning-runs/initial/candidate-01.md のみ。AGENTS.md、plugins/alder/skills/alder-draft-check-items/SKILL.mdと必須guidance、work/check-item-examples/fixtures/README.md全体を読みcandidateを読取専用レビュー。公開入力/Skill版75fb043568ade8b442853421a0bc78ef999b23e1、authority b3113b7c0b6915562f0ebd6892e01199510cf319。規約適合、一般保証と例、参照、未決と状態を検査し具体source/artifact対応を示しNG/原典未決/任意提案/未実施を分離。/workspace/scratch/0261bb5be107/meaning-runs/initial/reader-report-01.mdに依頼全文・入力hash・要求gpt-6-sol medium fork none（実効設定attestationなし）・実行診断と未検証を記録。候補・packet編集/修復、人間承認、再委譲禁止。完成見本・作者点検・過去評価・他出力/packet・実装/テスト・会話履歴・ネットワーク禁止。

要求実行設定は `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。このレポートはその要求を記録するが、実効モデル・effort・fork状態のランタイム attestation は取得できない。公開固定版は `75fb043568ade8b442853421a0bc78ef999b23e1`、guidance の provenance に記された authority は `b3113b7c0b6915562f0ebd6892e01199510cf319`、plugin manifest の版は `0.4.8`。候補およびpacketを編集せず、この報告だけを作成した。

## 入力固定

SHA-256（packet root からの相対パス）：

| 入力 | SHA-256 |
| --- | --- |
| `meaning-runs/initial/candidate-01.md` | `17e254af2a146f64cadb44abf4885fffd545bb6ddbe471111a78389f6a67c2fd` |
| `AGENTS.md` | `29b2c0fe7b5da19414f3a274eb8f4780fd2b4b2e89627a8a1bd8e66a3611bf7f` |
| `work/check-item-examples/fixtures/README.md` | `e00c06ef469c015120add5dc92249b53eabd496750ff9aeb1b7f9a84ab469cd0` |
| `plugins/alder/skills/alder-draft-check-items/SKILL.md` | `aab470d8e289a1dd65ae6ab75a231ee171f519cd12a49316ed0660074d12d8d4` |
| `references/adoption.md` | `2992bd2dc95f215d0869c8eac7c2fac13d8696d97264f5a483ce34645ccba0d3` |
| `references/check-item-traceability.md` | `7470dc6123fd4fa0e19e864d67eb1e8f5a8c53ab1653d056dfdaeecb9cdb2ce6` |
| `references/candidate-c3.md` | `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446` |
| `references/prompt.md` | `1eeec4ee73aacdde1e43f4b43e08875de85647a53fc3cf07c6a669173195364e` |
| `references/provenance.json` | `5aba19238e1eb020a3bbb31219096a09132912c90ac1a915db5f24b24ae9dc83` |

`references/*` は上記Skillのディレクトリ内。`input-hashes.json` の上記packetファイル値とも一致した。fixtureの全文、Skill、current traceability guidance全文、adoptionの必須範囲、initial derivationのc3を読んだ。f1は任意Interfaceを作らない本件の必須入力ではないが、同梱promptも確認した。

## Source-led照合

原典の宣言は `# Activity 相談を受付する`、`# Activity 次の連絡方法を説明する`。候補のindex表示とH2はそれぞれ文字列 `相談を受付する`、`次の連絡方法を説明する` で一致する。indexは指定された四列で同順、CI-01～05・07・08を前者、CI-06を後者へ直接リンクする。各IDのH3本文と人間レビュー状態は一つずつ。CI-05の保証は受付後に**その相談**を担当者が対応対象として扱えることであり、後段がその相談を使う依存関係だけではCI-05全体を後段共有Checkとはしない。CI-06の保証は後段でその相談の依頼者へ両情報を説明すること。したがってindexのActivity所属に欠落共有参照は認めなかった。

| 原典の一般条件・結果 | 候補の一般保証／ID | 具体例が示す差異と限界 |
| --- | --- | --- |
| 業務上の規則と受付Activity When/How/Result：登録済み、本人または委任済み代理人（両立可）、停止していない、同じ暦で申請日から0～30日両端を含む希望日という条件の依頼を受付済みにする。 | 「受付の条件と結果」→CI-01。資格の包括OR、全条件のAND、同一相談の受付結果を保持。 | 10/1申請に対する10/1・10/31希望と、両資格10/15の行は0・30境界と両資格の包含を観測する。有限例に一般範囲を置き換えていない。 |
| 業務上の規則：停止中、日付範囲外、資格なしは受付条件を満たさない。失敗応答まで決めない。 | 同じ共有節の制約→CI-02、CI-03、CI-04。 | 停止中の14日、−1日・31日、資格なし14日の各行は、他条件が適合しても当該条件が不成立となる差異を示す。CI-04本文の「本人Aの0日行」との比較は日付値も変わるが双方範囲内であり、結果の根拠を範囲外日にすり替えてはいない。 |
| 受付Activity Why/Result：受付済みの**その相談**を担当者が対応対象として扱える。 | 「受付の条件と結果」→CI-05。受付済み相談の同一性と後段接続を示す。 | Aの受付済み相談と別の利用者Eの同日相談を区別し、担当者がどちらを対象とするかを観測点とする。受付のみから案内完了を導いていない。 |
| 次の連絡方法を説明するActivity When/How/Result：受付後、その相談の依頼者へ担当窓口と次の連絡方法を説明する。 | 「説明の条件と結果」→CI-06。依頼者と相談の対応、両方の説明を維持。 | 代理人Bが依頼したAの相談についてBへ「相談窓口」と「窓口への電話」を説明する具体値があり、別相談のFへの説明や窓口だけの説明と区別する。固定文面や理解の自動判定は要求していない。 |
| 業務上の規則：不成立時の応答・記録・再申請方法、希望日変更は未決。 | CI-07とCI-08を受付Activity内の「未決事項（業務設計に明示、候補）」、状態「要確認」とし、未承認の結果・問い・選択肢を可視化。 | CI-07は停止・境界外・資格なしの判定とその後の応答を分離。CI-08は10/31から11/1への変更例で初回の境界と変更後の未決を分離。 |

## NG（説明規約への不適合）

1. **一般保証の二重定義**：current guidance `check-item-traceability.md` の「Conditions, expressions and examples」は、共通の一般条件と独立した期待結果をActivity本文に一度定義し、各IDから明示リンクすること、重複するなら短い保証を個別項目へ移して一度だけ定義することを求める。候補では「受付の条件と結果」にCI-01の全条件→その相談の受付済み、CI-05の同じ相談を対応対象にできる結果がある一方、CI-01/CI-05の各「条件・期待結果」箇条書きが同じ一般結果を再定義する。「説明の条件と結果」の説明相手・担当窓口と連絡方法の両方というCI-06保証もCI-06本文で再定義する。原典は各ActivityのWhen/How/Resultにあり、意味上の矛盾や欠落ではなく、同一一般保証の変更箇所を二つにしている表示上のNG。どちらか一箇所を唯一の定義として他方は参照に留める余地があるが、本レビューでは修復しない。CI-02～04の共有制約と各項目の精密化には条件の限定があり、同じ強さの二重定義とは断定しない。

## 原典で未決の業務意味

- **CI-07**：条件不成立後の依頼者への応答、記録の有無、再申請方法は原典「業務上の規則」で未決。候補が挙げる理由案内・記録・再入力は選択肢例で、採用されていない。条件不成立という既知の判定（CI-02～04）から拒絶処理を確定しない。
- **CI-08**：希望日変更の可否、変更時の初回受付状態・期間条件の適用は同じ原典で未決。候補の変更例は結論を確定していない。人間が業務設計で意味を決めてから対象Checkを再導出する事項である。

## 任意提案

- CI-04の資格による差を一目で比較したい場合、資格以外を同じ14日にした成立行を比較表へ加えることはできる。現状も資格なし行と範囲内の本人行により境界は説明できるため、これは追加例の提案でありNGではない。
- 混合AND/ORを視覚的に強調するなら、CI-01共有条件の「本人または委任済み代理人」を入れ子の「いずれか」群にできる。現状は「いずれか」「両方の資格が成立してもよい」を明記し、論理意味を変えていないため必須修正とは判定しない。

## 実行診断と未検証

- 同梱 `check_activity_names.py --design .../fixtures/README.md --checks .../candidate-01.md` は終了コード0、`status: match`。宣言名、index、H2の文字列・順序の診断であり意味の検証ではない。
- ローカルMarkdown H1～H6からGitHub型slugを計算し、候補内fragmentリンク46件について未解決0件。CI-01～08のH3は各1件。これはリンク先の存在検査であり、ブラウザによる描画・可読性検査ではない。
- 候補の外部URLは指定公開固定版とfixture内の見出し名を照合した。ネットワーク禁止によりGitHub上の実体や当該版でのアンカー解決は訪問検証していない。packet内fixtureと `input-hashes.json` の一致を根拠とするが、公開版との同一性そのものは独立検証していない。
- 実装・テスト・過去リスト・人間の実レビュー・完成見本・作者点検・他packet/出力は読んでいない。候補の「Test証拠：未作成・未確認」はこのレビューで実在性を検証した主張ではない。初稿のため旧保証との変換差分検査は適用されない。人間の理解と承認、実運用の結果も未検証。

この読取専用レビューは上記NGと原典未決を分離して返すもので、候補の人間レビュー状態を更新せず、業務判断を承認しない。
