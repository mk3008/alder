# Alder Check Item Consistency review-only — detection E

## 依頼全文

> Use existing alder-draft-check-items Skill Consistency review-only at /workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md. Public packet source be8d23aa331d61ffe10934f86190172726a5db78, plugin0.4.8, authority0986ae5c67efeed0797f3f78083f81ac12dbe047. Read packetAGENTS/allrequiredguidance/full business-design/purchase-request/README.md and product/defective-checks.md. Execute publishedSkill actualoperations incl bundled read-only diagnostic; record command/output/exit and source/artifact correspondence. No edits/statechanges. Report supportedNG separately from undecidedbusinesspolicy/optionalwording. Save only /workspace/scratch/0261bb5be107/quality-loop-runs/detection-e.md incl fulltaskverbatim, actualreadpaths/agentID/requestedsettings/runtimeattestationlimit/checks/limits. Noexpectedfindingssupplied. Do not read otherproductfiles/outputs/reports/specimens/answers/rootissue/tests/implementation/network/otheragents. Review-only mustnotrecurse.

## 実行範囲と根拠

- Agent ID: `/root/quality_detector_e`。著者とは別の読者エージェントとして依頼された。ただし実効モデル・reasoning effort・履歴 fork の設定を独立に検証する手段はなく、実行環境の保証とはしない。パケット `AGENTS.md` の新規 Fresh レビュー指定は `gpt-6-sol`、`medium`、`fork_turns: none`。親からの依頼文はこの設定を明示していないため、これらを実際の起動設定として断言しない。
- 指定された公開パケットのソース改訂は `be8d23aa331d61ffe10934f86190172726a5db78`、プラグイン版 `0.4.8`、authority 改訂 `0986ae5c67efeed0797f3f78083f81ac12dbe047`。後二者は下記の実ファイルでも確認した。公開改訂と作業ツリーの同一性は別途 git で検証していない。
- 読み取ったパス（すべて `/workspace/scratch/0261bb5be107/` の下）：`quality-loop-packet-v2/AGENTS.md`、`quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md`、同 skill の `references/check-item-traceability.md`（全340行）、`references/adoption.md`（必須 Check 節から任意 Interface 節まで、および該当する言語指針）、`references/provenance.json`、`quality-loop-packet-v2/plugins/alder/plugin.json`、`quality-loop-packet-v2/business-design/purchase-request/README.md`（全314行）、`quality-loop-packet-v2/product/defective-checks.md`（全359行）。診断スクリプト `scripts/check_activity_names.py` は指定された read-only 実行対象。初期導出ではないため歴史的 c3 は読まなかった。
- 業務設計の SHA-256 は `afa5fbfe4160b9c962b6a3ce9df4f83a42f5138d626c1ed3b7f3bfbea08794f7`、Check の SHA-256 は `9f00257cc6ef705e49ff21976b8d9a0162649136f5079767b348c541b89332f6`。製品ファイル、状態、レビュー状態は変更していない。この報告のみ作成した。

## 公開 Skill の診断実行

作業ディレクトリ：`/workspace/scratch/0261bb5be107`。

```sh
python3 quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design quality-loop-packet-v2/business-design/purchase-request/README.md --checks quality-loop-packet-v2/product/defective-checks.md
```

終了コード `1`。標準出力全文：

```json
{
  "status": "mismatch",
  "declared": [
    "備品購入を申請する",
    "購入申請を承認する",
    "購入申請を却下する",
    "承認済み備品を購入する"
  ],
  "headings": [
    "Activity 備品購入を申請する",
    "Activity 購入申請を承認する",
    "Activity 購入申請を却下する",
    "Activity 承認済み備品を購入する"
  ],
  "index": [
    "備品購入を申請する",
    "購入申請を承認する",
    "購入申請を却下する",
    "承認済み備品を購入する"
  ],
  "mismatches": [
    "headings"
  ]
}
```

これは名前の字面だけを検査し、保証・参照・人間状態は検査しない。見出しから `Activity ` を除去して一致扱いにはしていない。

## 二つのソース起点の照合

宣言名は業務設計 L123、170、218、267 の `# Activity` の後の値。Check 索引 L7–10 は四つともこの値と字面で一致する。一方、Check の見出し L14、100、190、274 はすべて `## Activity ` を名前の前に含み、診断の raw heading 値とは一致しない。索引の4列と各 ID への直接リンク、ID の単一本文・状態を見た。PR-01〜PR-12、PR-U01〜PR-U04 の本文は各一つで、通常項目は未レビュー、未決候補は種別・起源を示して要確認である。`rejected` の購買対象外という共有される保証については、購買 Activity の索引・節から PR-09 への参照がない。

別の保証照合では、申請時の `submitted`・識別、入力情報と日時、承認者の判断可能性（業務設計 L15–31、L123–168）を PR-01〜03 に、承認の `approved`・日時・購買対象（L170–216）を PR-04〜06 に、却下の `rejected`・理由/日時・購買除外（L218–265）を PR-07〜09 に、購入の `purchased`・実購入金額/日時・購入済み扱い（L267–314）を PR-10〜12 に追った。PR-02、PR-08、PR-11 ではソースの一般的な入力値保持の保証が主条件の例示値に縮んでいる。サンプルに一般化しない旨があっても、主条件の範囲を回復しない。必要入力の式は十分な成功条件として書かれておらず、PR-09 の `rejected ⇒ 購買対象外` はソースにある片方向の不変条件として扱われている。根拠欄の行範囲は今回読んだ業務設計の該当箇所に対応している。

## 根拠のある NG（説明規則への不適合）

1. **四つの Activity 見出しの字面**：業務設計 L123、170、218、267 の宣言名に対し、Check L14、100、190、274 の raw 見出しは `Activity ` を含む。索引 L7–10 は一致するが、見出しは診断で exit 1。Skill と `check-item-traceability.md` の「宣言名を表示名として使用し、raw heading を字面で照合する」規則への不適合。これは業務方針の判断ではない。
2. **PR-02 の主条件の過度な限定**：業務設計 L149–168 は申請者と入力された品名・数量・希望購入金額・購入理由および申請日時の保持を一般に要求する。Check L48–50 は「申請者A」「対象R1」を主条件・結果に固定している。L54 のサンプルではこれらの仮値を使えるが、主条件に置くと他の申請者・申請について保持する一般保証を表せない。`check-item-traceability.md` の一般条件→結果を主項目と例で別々に照合する規則に反する。
3. **PR-08 の主条件の過度な限定**：業務設計 L242–265 は入力された却下理由と却下日時を対象申請に記録する一般保証。Check L217–219 は理由を「不要」に固定する。L223 のサンプルの例示値としてはよいが、主項目は任意の入力された理由を対象にできていない。同じ条件・期待結果の規則への不適合。
4. **PR-11 の主条件・期待結果の過度な限定**：業務設計 L291–314 は入力した実購入金額を対象申請に日時とともに記録する一般保証。Check L305–307 は `11000` に固定し、L311 も同値をサンプルに使う。主項目では別の入力金額に対する保持を表せない。同じ規則への不適合であり、金額の有効範囲をここで新たに決める趣旨ではない。
5. **PR-09 の購買 Activity 参照不足**：業務設計 L31、L261–265 は `rejected` を購買対象から除外し、購入 Activity L277–294 は `approved` を対象とする。Check PR-09 L233–250 自体も購買担当者が購入対象を扱う保証として記述している。それなのに購買 Activity の索引 L10 は PR-09 を直接リンクせず、購買節 L274–359 にもその ID への参照がない。`check-item-traceability.md` の共有 Check を関連 Activity の索引行および他 Activity 節から同一 ID に参照する規則に対する欠落。PR-09 の本文と状態を複製する必要はない。単なる上流依存だけで他の Check 全部を共有扱いにはしていない。

## 未決の業務意味・任意の表現

- **業務設計に戻す事項／要確認**：L33–48 の金額別承認経路は今回の対象外で、PR-U02 はそれを未決・未承認と表示している。申請値の有効範囲・欠落時結果（PR-U01）、却下理由の空白・欠落時結果（PR-U03）、実購入金額の値域・希望額との差と失敗時結果（PR-U04）は業務設計から一意に定まらない。いずれもここで拒否・成功・閾値・追加承認を決めない。購入中断、対象未発見時などの応答も指定されていない。これらは上記 NG と別であり、AI の修正や人間確認の代用にはしない。
- **任意の表現提案**：PR-02/08/11 の例示値を主条件からサンプルに移し、主条件では「当該申請者／対象申請／入力された理由・実購入金額」と書くと一般性が読み取りやすい。これは NG の修正方向であって、この read-only レビューでは書き換えない。PR-09 の同一 ID への参照を購買行・節に設けることも修正方向である。

## 限界と状態

Check L3 は別の生成候補パスとソース改訂 `b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9` を掲げる。指定されたこのパケット内の業務設計との内容・行範囲は照合したが、その旧改訂やパスそのものの実在・同一性は依頼で読むことを禁じられた範囲に当たるため検証していない。したがって L3 を誤参照と断定しない。外部 URL、実装、テスト、先行レビュー、人間からの確認・フィードバックは見ていない。リンクのフラグメントは見出しとの対応を本文で確認したが、GitHub レンダラでの表示試験は行っていない。診断 exit 1 と上記 NG のため適合パスとは報告しない。レビューのみで再帰的レビュー・修復・人間状態の変更は行っていない。
