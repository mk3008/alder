# 作者点検 — candidate-01

対象：`candidate-01.md`（SHA-256 `712a2d705f3909736c15091c2848d861cc7a8a98b2e3c97c311035314f4cad0f`）。保存後の点検であり、この段階で候補は修正していない。

## 適用した規則と照合

- Alder 0.4.8の `alder-draft-check-items`、`check-item-traceability.md` の human-facing view、GitHub Markdown document layout、conditions/expressions/examples、before-returning update、および `adoption.md` の言語・Check更新規則。原典はpacket内の `work/check-item-examples/fixtures/README.md`、変換前は同じ場所の `checks.md`。
- 原典の宣言値は `相談を受付する`、`次の連絡方法を説明する`。候補のindexとH2の生文字列も同じ。付属 `check_activity_names.py` は `status: match`、`mismatches: []`、`target_issues: []`、終了コード0。四列indexから全4 IDの主項目に直接リンクし、H2とH3の階層も維持した。
- C-01～C-04のIDとタイトル、人間状態（順に確認済み・要確認・未レビュー・要修正）、C-02の種別と保留、C-04の人間フィードバック、既存Test証拠・欠落、導出分類とAI確度、関係業務を照合した。旧原典URLと固定revision `d7f84fcca636e88015b15b9da993b200abd62999` を維持。公開先の実体は訪問していないためURL到達性と公開版内容の独立照合は未検証。
- 受付のAND/OR、両端0日・30日、本人と委任済み代理人の包摂的OR、停止中の除外を保持。C-02の不成立を拒否とせず、応答・記録・再申請および希望日変更を未決に保った。比較表は日付、停止、登録、資格の差を明示し、条件成立と不成立を並べた。案内例では相談A/甲と相談B/乙、説明内容の二要素を分けて観察する。

## NG — 候補に残存

- `candidate-01.md` の「受付条件と結果」と受付比較例のA・B・Cは「担当者が相談対応の対象として扱える／対応対象になる」をC-01の保証・例の結果に加えている。原典Resultにはこの結果があるが、変換前C-01の期待結果と式は「その相談が受付済みになる」に限定されていた。`check-item-traceability.md` の「For presentation-only updates, preserve the exact existing guarantees」「do not silently expand ... a limited Check list」に抵触する。旧リストにない独立結果を表示更新でC-01へ拡張したため、修復段階ではC-01の保証と表の結果を旧範囲へ戻し、原典Resultの残余は追加提案として別に報告すべきである。人間状態を動かして解決しない。

## 意味の未決・提案・未検証

- 人間の未決：C-02の不成立時の応答・記録・再申請と希望日変更は保留済み。再質問しない。C-04は要修正のままで、人間の意味採否は未確認。C-03は未レビュー。
- 追加の独立保証候補：原典Resultの「担当者が相談対応の対象として扱える」は旧C-01の限定期待の外にある。今回黙って拡張できず、別途レビューが必要。
- テスト実行、原典固定URLの到達性、GitHubの実レンダリング、人的可読性・人間レビューは未実施。Markdownのテキストとリンク先文字列を点検したが、表示幅や折返しの視覚点検を代替しない。独立Consistency reviewはホスト実施待ちであり、本点検はその合格を主張しない。
