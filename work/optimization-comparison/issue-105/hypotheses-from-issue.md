# Issue #105 の事前判定候補

この定義は実験前の [Issue #105](https://github.com/mk3008/alder/issues/105) 本文「F. Two-entry-route necessity」から転記したもので、Oracle 開示後に新設した判定基準ではない。`evaluator-prompt.md` がラベルだけを参照して定義を欠いたため、独立評価者へ元の定義を渡す。

- **H1 — Two-entry-route supported**：Authoring では露出しなかった Oracle を U1 が発見し、人間確認後は K と同じ Problem で通常 Optimization に収束する。Known 時は K で十分。
- **H2 — Discovery-always supported**：Known Problem でも Discovery 前置がないと重要な横断構造を Optimization が安定して見落とす。
- **H3 — Discovery unnecessary**：Authoring または通常 Optimization だけで Oracle が十分表面化し、独立 Structural Discovery の追加価値が薄い。
- **H4 — Discovery too noisy**：Unknown 探索が false positive / scope explosion / meaning damage を増やす。
- **H5 — Inconclusive**：Authoring leakage、Problem scope 差、情報不足、非決定性等で識別不能。

Issue の重要な反証条件には「U1 が Oracle を発見しない」「U1 が negative control を Problem 化する」「K が Known Problem から主要 Candidate に到達できない」等が含まれる。今回の人間役による Oracle 対応 Observation の拒否は H1 の成立に必要な Human Confirmation → U3 の連鎖を遮断する。H5 に自動分類する規則を追加するものではなく、評価者が上記定義に照らして判定する。
