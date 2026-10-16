# Consistency review-only — 修正版の再レビュー

対象は保存済み `regression-repair-1.md`、業務設計全文 `quality-loop-packet/product/consultation/README.md`、変更前 `quality-loop-packet/product/consultation/checks.md`。提示された業務設計公開版 `8853a63101bb5968751986b0260bb8bc036505e2`、更新バンドル `be8d23aa331d61ffe10934f86190172726a5db78`、Alder Plugin `0.4.8`、authority `0986ae5c67efeed0797f3f78083f81ac12dbe047`。更新 Skill と必須参照を読み、候補を編集せずに全体を再照合した。これは人間の確認ではない。

## 同梱 literal-name diagnostic

コマンド：

```sh
python3 quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/scripts/check_activity_names.py --design quality-loop-packet/product/consultation/README.md --checks quality-loop-runs/regression-repair-1.md
```

終了コード **0**。生出力：

```json
{
  "status": "match",
  "declared": [
    "相談を受付する",
    "次の連絡方法を説明する"
  ],
  "headings": [
    "相談を受付する",
    "次の連絡方法を説明する"
  ],
  "index": [
    "相談を受付する",
    "次の連絡方法を説明する"
  ],
  "mismatches": []
}
```

この診断は共有参照、業務保証、状態や根拠を検査しないため、以下を別途確認した。

## 第1パス：宣言名と Check の所属

業務設計 `README.md:12,34` の宣言はそれぞれ `# Activity 相談を受付する`、`# Activity 次の連絡方法を説明する`。`# Activity ` は構文であり、宣言された ActivityName は順に `相談を受付する`、`次の連絡方法を説明する`。候補の生の索引ラベル `:7–8` と H2 本文 `:10,80` がそれぞれ宣言名と文字列一致する。日本語4列索引の順は Activity／目的／接続／Check、H2 も同順。各索引の Activity リンクと C-01～C-04 の直接 fragment は対応する H2/H3 に向く。H3 は各 ID 1件、主条件・結果・状態は各本文に1回だけある。

| ID | 保証自体の所属、必要な参照、実際の配置 |
| --- | --- |
| C-01 | `相談を受付する`。条件成立時の受付済み結果。第1索引行 `:7` と第1 H2 配下 `:12–52` に単一本体。後段 Activity は受付の結果を利用するが、C-01 自体の保証は後段に共有しない。 |
| C-02 | `相談を受付する`。不成立時の原典未決。第1行 `:7`、第1 H2 配下 `:54–78`、同 ID に可視の種別と状態。 |
| C-03 | `次の連絡方法を説明する`。受付後、その相談の依頼者への二つの案内。第2行 `:8`、第2 H2 配下 `:82–102`。 |
| C-04 | `次の連絡方法を説明する`。その相談と依頼者の同一性。第2行 `:8`、第2 H2 配下 `:104–127`。 |

`README.md:28,32,42,50` には受付結果と後段開始の接続がある。候補索引 `:7–8` と C-01 参照 `:51` はこれを示す。前段の C-01/C-02 を後段の共有 Check とみなす根拠はなく、後段の C-03/C-04 を前段にも置く根拠もない。必要な Check-to-Activity 参照の欠落や重複本文は確認されなかった。

## 第2パス：原典の一般保証とサンプルの区別

`README.md:7–8,20,28,32` は、登録済み利用者について本人または委任済み代理人（両立可）、利用停止中でないこと、同じ暦の日付で希望日が申請日から0～30日（両端含む）という受付条件を置き、受付担当者が利用者・資格・両日付・相談内容を受け取って確認し、**その相談**を受付済みにする。C-01 の主条件 `:18–25` は AND 内に資格の inclusive OR を入れ、操作 `:27` と主結果・保証表現 `:29–31` は対象の同一性と条件成立時の一般結果を維持する。0日・30日・両資格併存の表 `:39–41` は例であって A/B/C や2026年10月に主保証を限定しない。31日目の応答や記録を逆含意で決めてもいない。

`README.md:9` の条件不成立時応答・記録・再申請方法と希望日変更は未決。C-02 `:56–65,69,73` は31日目の D を例示しつつ結果を確定せず、原典未決の種別・要確認と保留／再質問しない旨を見える位置に残す。C-01 `:45` も希望日変更を正常受付結果から導かない。未決例は成功・拒否の新たな保証を作っていない。

`README.md:42,50,54` は受付**後**、担当者が**その相談の依頼者**に担当窓口と次の連絡方法を説明する一般保証。C-03 主条件・操作・結果 `:88–92` は時点・相手・両説明事項を保つ。相談 A の例 `:96` は一般保証を A に限らず、固定説明文や自動理解判定を足さない。C-04 主条件 `:110` と A/甲対 B/乙の短い例 `:118` も受付後と対象同一性を明示し、表にしなくても判断に必要な二つの相談・依頼者が分かる。C-04 は C-03 の説明項目を重複保証せず、対象の取り違えという独立判断を保つ。

## 判定と継続事項

**NG：今回の修正版には、照合した範囲の記述ルール違反を見いださなかった。** 日本語の条件・操作・結果、C-01 の有用な保証表現と比較表、C-02～C-04 の短い場面例、H4 の見出し、可視の未決、索引リンクは更新 Skill の表示要件に沿う。C-04 の受付後という時点は主条件 `:110` と例 `:118` の双方にあり、原典 `README.md:42` と合う。

**原典カバレッジの別論点**：`README.md:32` の Result は「その相談が受付済み」だけでなく「担当者が相談対応の対象として扱える」を含む。C-01 の主結果 `:29,31` は前者に限り、後者は索引の目的・接続 `:7` には出るが独立した期待結果としてはない。変更前 `checks.md:11,16` も同じ限定範囲だった。今回の依頼は既存リストの表示更新であり、未依頼の Check 保証を黙って増やす理由にはならない。原典で意味が未決という指摘でもない。別途、担当者が扱える状態の独立したレビュー単位が必要かを検討できる。

**未決のまま**：C-02 の不成立時の応答・記録・再申請方法、希望日変更は原典 `README.md:9` に明記された未決。保留済みの質問をここで再提起せず、意思決定後の再導出を待つ。C-04 の人間フィードバックに基づく `要修正` は表示・時点の修正だけで確認済みに変わらない。

**任意の文言提案**：C-03 のテスト証拠欄 `:102` は変更前 `checks.md:38` と同じ「説明内容を判定する自動方式は未決」。原典 `README.md:50` は「固定の説明文や自動理解判定は規定しない」。将来の決定待ちと誤読されるのを避けるなら「規定しない」に合わせられる。これは新たな業務決定でも今回の NG でもない。

意味保持：C-01～C-04 の ID と状態は旧 `checks.md:7–47` と同じ `確認済み／要確認／未レビュー／要修正`。C-01 の AI確度・明示・関連業務、`test_acceptance::test_inclusive_window` の0日・30日対応と最終実行結果未収集が `:49–52` に残る。C-02 の未決テストは合否に使わない `:78`、C-03 は未収集 `:102`、C-04 は既存証拠なし `:127`。旧 C-04 の対象区別へのフィードバックも `:122` に残る。Test 証拠の欠落を確認済み C-01 の意味の否定にしていない。

未実施：公開コミット上の原典と提示ローカル内容のバイト一致、GitHub 上での実レンダリング・外部からの fragment 参照、Test の実体・assertion・最終実行、担当者による意味確認。原典相対リンクは保存配置上解決するが公開到達性は確認していない。ここから別の再レビューを再帰的には行っていない。

## レビュー依頼・設定記録

プロジェクト AGENTS.md の Fresh default は `gpt-6-sol`、effort `medium`、`fork_turns: none`。このレビューの親の spawn 設定は子には表示されないため、要求・実効モデル設定の独立確認はしていない。受領した follow-up 全文：

> Run a distinct final read-only Consistency re-review of saved revision /workspace/scratch/0261bb5be107/quality-loop-runs/regression-repair-1.md, against whole /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/README.md and prior /workspace/scratch/0261bb5be107/quality-loop-packet/product/consultation/checks.md, with same actual feedback as first assignment. Switch to updated Skill /workspace/scratch/0261bb5be107/quality-loop-packet-v2/plugins/alder/skills/alder-draft-check-items/SKILL.md, public bundle be8d23aa331d61ffe10934f86190172726a5db78, authority 0986ae5c67efeed0797f3f78083f81ac12dbe047, plugin 0.4.8. Read updated Skill and required references, run its bundled read-only literal-name diagnostic on full BD and saved repaired candidate, record raw output/exit. Then repeat BOTH source-led passes and whole scope; do not take first report as findings to reproduce. Read project AGENTS at original packet path. Do not edit files. Same prohibitions on unrelated packet material, previous reports/specimens/answers/root issue/tests/implementation/network/outside except candidate and your own output. Save /workspace/scratch/0261bb5be107/quality-loop-runs/regression-reader-2.md with actual evidence, findings/limits/full followup prompt. No recursive review.
