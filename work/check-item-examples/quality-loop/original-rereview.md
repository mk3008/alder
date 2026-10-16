# Alder Check Item 修復稿の read-only Consistency 再レビュー

## 依頼全文

> Continue actual read-only rereview, same fullBD and finalpublishedSkill. Author (originalauthorcontext, noanswerspecimen) saved /workspace/scratch/0261bb5be107/quality-loop-runs/original-repaired.md; input originaldefective retained. Compare all16IDs/states/generalguarantees/uncertainty/supportingdetail/sourcepins/sharedidentity, execute diagnostic on savedrepair and review whole scope, notjust changedlines. No edits; save separate /workspace/scratch/0261bb5be107/quality-loop-runs/original-rereview.md incl fullprompt/readpaths/settings/limits. Do not read authorreport/othergeneration/otherreports/oracle. For your earlier PR-02 restrictionfinding, explicitly adjudicate candidateintro notation declaration (R1/A are identity variables) vs literal inputrestriction: cite source+maintext, do not count bound variable naming alone as fixedbusinesspolicy. Reject unsupportedfinding explicitly or upholdwithevidence. Review actualrepair independently; no expected pass supplied.

## 対象・設定・限界

- Reader agent: `/root/quality_detector_e`。著者とは別エージェントだが、実効モデル、reasoning effort、履歴 fork の設定をこの実行環境から独立に検証できない。パケット `AGENTS.md` が新規 Fresh に要求する値は `gpt-6-sol`、`medium`、`fork_turns: none`。今回の親依頼は値を指定せず、実効値の attestation はない。同一読者エージェントによる二回目のレビューであり、初回評価からの完全な盲検・fresh context ではない。
- 指定パケット改訂 `be8d23aa331d61ffe10934f86190172726a5db78`、installed plugin `0.4.8`、authority `0986ae5c67efeed0797f3f78083f81ac12dbe047`。版・authority は先の同一パケットの `plugin.json` と `references/provenance.json` で確認したが、git commit と現物の一致は独立に検証していない。
- 今回読んだ実パス（すべて `/workspace/scratch/0261bb5be107/` の下）：`quality-loop-runs/original-repaired.md`（全364行）、`quality-loop-packet-v2/product/defective-checks.md`（全359行）、`quality-loop-packet-v2/business-design/purchase-request/README.md`（全314行）、`quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md`、同 skill の `references/check-item-traceability.md`、`references/adoption.md` の適用箇所、`quality-loop-packet-v2/AGENTS.md`、`plugin.json`、`references/provenance.json`。後四つは前回の同一コンテキストで読んだ内容も適用した。診断スクリプトは read-only に実行した。禁止された他生成稿・著者報告・他報告・正解・テスト・実装・ネットワークは読んでいない。
- 修復稿と原稿の全体を比較し、業務設計の全 Activity と Object/業務相関・対象外範囲を照合した。製品入力も修復稿も変更していない。この報告だけを作成した。

## 公開診断と文字列照合

作業ディレクトリ `/workspace/scratch/0261bb5be107` で実行：

```sh
python3 quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design quality-loop-packet-v2/business-design/purchase-request/README.md --checks quality-loop-runs/original-repaired.md
```

終了コード `0`、標準出力全文：

```json
{
  "status": "match",
  "declared": [
    "備品購入を申請する",
    "購入申請を承認する",
    "購入申請を却下する",
    "承認済み備品を購入する"
  ],
  "headings": [
    "備品購入を申請する",
    "購入申請を承認する",
    "購入申請を却下する",
    "承認済み備品を購入する"
  ],
  "index": [
    "備品購入を申請する",
    "購入申請を承認する",
    "購入申請を却下する",
    "承認済み備品を購入する"
  ],
  "mismatches": []
}
```

業務設計の raw 宣言 L123/170/218/267、修復稿の索引 L7–10、見出し L14/100/190/274 は文字列一致。原稿の `Activity ` 接頭語は修復され、索引の Activity fragment も新見出しに更新された。診断は保証、共有参照、レビュー状態を検証しない。

## 全16 ID の意味・状態・参照の照合

原稿と修復稿は同じ16の見出し ID（PR-01〜PR-12、PR-U01〜PR-U04）を一つずつ持つ。各々の本文の状態は12件が未レビュー、4件の未決候補が要確認で、確認済みへの昇格も複製もない。索引は4列で各 Activity から Check 本文に直接リンクする。PR-09 は修復稿 L10 と L276 で購入 Activity から同一の L233–250 の本文へ参照され、却下 Activity L9 の参照と共有する単一状態を保つ。PR-06 等の上流依存を根拠なく全部共有にはしていない。

業務設計 L123–168 の申請成立・識別、全入力と申請日時の保持、判断可能性は PR-01〜03、L170–216 の承認状態・日時・購買適格は PR-04〜06、L218–265 と L31 の却下状態・理由と日時・購買除外は PR-07〜09、L267–314 の購入状態・実購入金額と日時・購入済み扱いは PR-10〜12 に主条件・期待結果として残る。PR-09 の `rejected ⇒ 購買対象外` は他状態への逆を導かない。必要入力の式も十分な成功条件とはしていない。PR-08 L217–219 は原稿の固定理由「不要」を主条件から外し、サンプル L223 のみに残した。PR-11 L307–309 も `11000` を主条件・結果から外し、入力された実購入金額という一般形にした。各 Check の根拠行範囲、導出、AI確度、接続、未収集 Test 証拠は原稿から維持され、今回の業務設計の該当行と整合する。L3 の旧生成候補パス・改訂も保持された。

PR-U01/03/04 の欠落・空白・値域・差額の未承認候補は種別と起源を伴い、実装済み方針に格上げされていない。PR-U02 は修復稿 L184 で「今回の対象外」という業務設計 L33–48 の既定範囲に合わせ、将来対象とする場合の決定を保留した。要確認という人間状態と、L174–176 の未承認・未決表示は維持された。本文のそのほかのサンプル、未決事項、参照情報は差分で維持されている。

## PR-02 の前回指摘の再裁定

**前回の「申請者A／R1で主保証が特定人物・申請に限定された」という NG は撤回する。** 修復稿冒頭 L12 は例の識別子を照合用の仮値と宣言する。PR-02 L48–50 は申請者Aの入力から新しいR1を登録し、同じAと入力値をそのR1に保持するという束縛関係を述べ、品名や額を特定値に固定しない。業務設計 L149–168 の一般的な入力→同一購入申請への保持との対応はこの任意のA/R1に成立する。A/R1 という変数名だけで業務対象を制約する証拠はない。原稿 L48–50 の「対象R1を成立させる」という行為の成功先取りも、修復稿では登録行為に直してある。サンプル L54 の具体値と主条件を別に評価した。

## 残る根拠付き NG

**PR-11 の差額サンプルの期待結果が一般保証と食い違う。** 修復稿 L316 は、`approved` のR1を選び購入し実購入金額11000を入力して購入結果を登録しようとする条件で、希望額12000との差があることから「購入結果登録の成立可否とR1の結果は未決」とする。他方、業務設計 L291–314 の入力・手順・Result は希望額と実購入額の一致を条件とせず、対象備品を購入して実購入金額を記録し `purchased` とする一般的な結果を定める。修復稿自身の主条件・結果 L307–309 も金額を一般化している。差額だけを理由に結果を未決にした例は、一般保証を例で狭める。`check-item-traceability.md`「Conditions, expressions and examples」「Distinct Consistency review and repair」の、例の入力・結果を主保証と別に照合し、未決の成功十分条件を勝手な制約に変えない規則に対する NG。数値11000や12000の**有効範囲**は業務設計にないため、両数値が常に有効だという断定ではない。原稿 L311 は差額の入力を記録する例を示していた。そこから修復稿で結果そのものを差額により未決扱いした意味の後退である。例示値の妥当性を留保しつつ、対象購入が成立して結果を登録する場合の入力額保持という一般保証を弱めない修正が必要。これは人間に差額承認を決めさせる指摘ではない。

## 未決事項・任意提案・検証限界

申請入力・却下理由・実購入金額の値域、欠落・空白時の成立可否と失敗応答、金額別承認経路の将来範囲、購入中断時の回復などは業務設計で未決であり、NG と混同しない。差額に応じた追加承認や精算はソースが決めないが、PR-11 の結果登録の一般保証を差額だけで否定する根拠にもならない。任意の表現として、PR-11 L316 の例に有効値の留保と一般的な登録時の期待結果を分けて書くと明確になる。

L3 の旧 `generation-candidate-v3` 参照改訂 `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9` の現物は、禁止範囲のため照合していない。今回の業務設計と根拠行の内容は確認したが、旧版との一致、GitHub 上の fragment 表示、外部ソース、Test assertion は検証していない。診断 exit 0 はこの限界と PR-11 の意味上の NG を消さない。人間による確定・承認は確認していない。read-only レビューとして修復・状態変更・再帰的レビューは実施していない。
