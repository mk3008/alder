# Issue #105 再現・監査

作業ブランチ `research/issue-99-authoring-discovery` の既存 remote 基点 `94ff07f3b88e55b4575b0a9d57ddf40e42430817`。新規ファイルは `work/optimization-comparison/issue-105/` に限定。#99〜#104 の既存記録は変更しない。

## 固定順序

1. `6ca2887`：シナリオ、顧客初回 brief、Oracle と Known Problem の平文 SHA-256 commitment、protocol。平文は Agent 入力外の `/tmp/alder-105-{oracle,known}.txt` に置いた。commitment が先に Git commit された事実は記録上の順序を示すが、共有 filesystem の物理的隔離は証明しない。
2. `67963f1`：顧客初回発言。`e0cecc5`：Authoring Skill の初稿・質問。`c64810e`：顧客回答。`5cf4a89`：改訂版と顧客による source fidelity 確認依頼。`5e62ce3`：未確認の断定2箇所への指摘。`b6cdf87`：同じ Skill による修正済み Business Design。`0c59962`：合成顧客の current-state 確認。
3. `73f13c2`：独立 Fresh Authoring gate **Pass**、Known Problem の平文を commitment と照合して公開、K/U3 共通の `runs/optimization-input.md` と U1 prompt を固定。K と U3 は同一の入力ファイルを参照する設計だった。
4. `b14d29a`：K と U1 の raw を固定。`00e64b3`：人間の拒否・保留と U3 未実行を固定。`d158df8`：Oracle 平文を開示し独立評価を指示。
5. `d8fb8a1`：初回評価指示に欠けた H1〜H5 の定義を、実験前からある Issue #105 本文から転記。`8ee39e3`：初回独立評価 raw を固定し、元定義に基づくラベル補正を依頼。`evaluation-addendum-raw.md` はその後の補正結果。初回 raw は書き換えない。

## Agent と入力

全 Fresh role は requested `gpt-6-sol`、reasoning effort `medium`、`fork_turns: none`。顧客 `/root/customer_105`、設計者 `/root/designer_105`、Authoring gate `/root/authoring_gate_105`、Known `/root/known_105`、Unknown `/root/unknown_105`、独立評価 `/root/evaluator_105`。指示全文は `authoring/{customer-launch,designer-launch,customer-followup,designer-followup,customer-confirmation-prompt,designer-correction,customer-final-prompt,gate-evaluator-prompt}.txt/.md`、`runs/{optimization-input,u1-prompt}.md`、`phase2/human-confirmation-prompt.md`、`evaluator-prompt.md` と `evaluator-addendum-prompt.md`。実際の読取先は顧客/設計者の応答、各 run raw、gate raw、評価 raw に記録した。Agent 起動時には固定された指示ファイルの実行を依頼した。実効モデル設定と許可外ファイルへの非接触は独立に証明できない。

Authoring Skill は Plugin 0.2.6、同梱 authoring provenance `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`。草案と修正前後は `authoring/design-v1.md`、`design-v2.md`、`design.md` に保存。顧客発言と確認は各 raw、独立 gate は `authoring/gate-evaluation-raw.md`。

## 確認方法

repo root から `sha256sum -c` で `authoring/*.sha256`、`phase2/*.sha256`、`evaluation-*.sha256` を照合する。`sealed-commitments.sha256` の `/tmp/` 参照は、公開後の `oracle-revealed.md` と `phase2/known-problem.md` の hash をそれぞれ比較する。ハッシュは同一性だけを示し、業務意味や Agent 隔離を証明しない。

`python3 tools/business_graph/export.py work/optimization-comparison/issue-105/authoring/design.md --output /tmp/alder-issue-105-graph.json` で対応構造の export を確認する。意味の正しさは合成顧客と独立 gate の評価原文を読む。`git diff --name-only 94ff07f..HEAD -- work/structural-discovery/issue-99 work/structural-discovery/issue-101 work/authoring-loop/issue-102 work/optimization-comparison/issue-103 work/optimization-comparison/issue-104` は空であること。
