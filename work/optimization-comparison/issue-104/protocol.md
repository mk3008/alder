# Issue #104 事前プロトコル

基点は `be856b9a292e0405dfe2e68cb91999b001763741`。#99/#101/#102/#103 の記録は変更しない。合成事例であり、実在組織の事実ではない。

1. Keeper が新規シナリオと oracle を作り、oracle 平文の SHA-256 を Authoring より前に固定する。平文は比較出力の固定まで許可入力から外す。
2. 顧客役と設計者役を別 Fresh context とし、設計者は Plugin 0.2.6 の Authoring Skill を読み、ヒアリング、重要質問、顧客回答、同じ設計書の改訂を行う。source fidelity と品質を確認し、設計書を固定する。
3. Keeper は生成結果を見る前に Known Problem 文、negative control、評価条件を固定する。K は既知 Problem から直接現行 Optimization Review、U1 は Problem なしの全体 Discovery、U2 は顧客役の各 Observation 判定、U3 は確認された Problem と必要事実のみで別 context の Optimization Review を行う。
4. no-Problem control に同じ Discovery 指示を適用し、ゼロまたは保留を有効とする。raw と hash の固定後、別 Fresh Evaluator に oracle を開示する。

Fresh review の requested model は `gpt-6-sol` / `medium` / `fork_turns: none`。入力パス、指示全文、read log、agent ID、ハッシュを記録する。共有ファイルシステムでは許可外資料を物理的に隔離できず、モデル実効設定も検証できない。結論は単一合成事例に限る。
