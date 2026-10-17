# 発言録中の要求保持の観測

Execution: https://github.com/mk3008/alder/issues/174 · Draft PR: https://github.com/mk3008/alder/pull/175

## 結論

公開済みAlder 0.4.4の初回草案は、この一件では性能・可用性・保護・保持・利用条件の主要な具体値を残した。要求を落とすことより、**保持するために発言にない担当や情報の渡し先をBDへ追加する**問題が目立った。たとえば受付を横断的な記録保全・道具評価の担当にし、道具の受入条件を予約表等へ出力する構造は、発言から確定できない。

82発言・66要求の台帳は、文言保持63、部分保持2、全ロスト0、未採用候補の引用省略として非適用1。これは業務意味が全て正しいという点数ではない。重複統合した確定不備は5件で、対象顧客の部分欠落、日次紙控えの開始条件、未根拠な担当・Outputの3群。サインイン方式未決の対応は曖昧として留保した。技術候補の合意要件への誤昇格は見つからなかった。

単一の合成発言録・単一初回出力の観測であり、一般的保持率、Skill改修の必要性や改善効果は確定しない。草案は人間未承認。新規System Requirements文書を生成することは合格条件にしていない。

## 読み方

- [最終評価](evaluation/report.md)と[全要求台帳](evaluation/mapping.json)
- [評価の訂正理由](evaluation/coordinator-challenge-response.md)と[初回評価原本](evaluation/original/report.md)
- [未加工の初回草案](raw/draft.md)、[最終返答](raw/author-final-reply.txt)、[途中返答](raw/author-progress-messages.txt)
- [入力発言録](inputs/transcript.txt)、[期待Business Design](preparation/expected-business-design.md)、[要求oracle](preparation/requirement-oracle.json)
- [事前protocol](protocol.md)、[材料の変更由来](preparation/change-provenance.md)、[振り返り](retrospective.md)
- [package版・digest](provenance/package-manifest.json)、[Author全dispatch](provenance/author-dispatch.txt)、[評価全dispatch](provenance/evaluator-dispatch.txt)

## 固定と再確認

- 事前入力公開commit: `68836f6899ac263dcd68d038daaa72f3e54d08ce`
- 評価前raw公開commit: `abdfb9a95cf3b0b6a069ee98e6baf0495e257bbc`
- 入力・raw・初回評価原本のdigestは各freeze JSONに保存。評価訂正で原本を上書きしていない。
- `python work/requirement-retention/verify_final.py` は全要求ID・引用・行範囲・package・freezeを確認する。製品実装のテストではない。

Authorへの資料限定は指示とread helperによる。OS強制隔離、全読込経路の排除、実効model/reasoningの独立証明はない。指定はFresh author/評価者ともgpt-6-sol・medium・fork none。共通ランタイム指示とSkillカタログは残る。

Skill、正式ガイド、記事、releaseは変更せず、mergeしない。今回の評価から自動的に次の実験や改修へ進まない。
