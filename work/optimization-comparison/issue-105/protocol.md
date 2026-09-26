# #105 事前登録プロトコル

基点は remote branch `94ff07f3b88e55b4575b0a9d57ddf40e42430817`。本件は `work/optimization-comparison/issue-105/` のみ追加し、#99〜#104 の raw/hash/oracle/評価を変更しない。合成事例であり実在業務の合意ではない。

Keeper は `scenario/customer-role.md` と `scenario/initial-brief.md`、Oracle 平文と Known Problem 平文を Agent 実行前に固定した。平文は比較 raw 固定まで `/tmp/alder-105-{oracle,known}.txt` に置き、Authoring、Discovery、Optimization の許可入力外にする。`sealed-commitments.sha256` はそれぞれの plaintext の事前 SHA-256。Known Problem は Authoring completion gate 後に比較用へ公開する。

1. 合成顧客役と別の Fresh Designer が、初回 brief → 重要質問 → 顧客回答 → 同じ Business Design 改訂を行う。Designer は Plugin 0.2.6 の Authoring Skill と同梱参照を使い、role card、Oracle、Known Problem、先行研究を読まない。顧客役は role card の確定事実で答える。
2. 別 Fresh Authoring Evaluator が source fidelity、意味と相関、material open question、Oracle の根拠が事実として present か、評価語が先出しされていないか、negative control、顧客確認を検査する。Oracle の正解は見せず、Keeper が sealed Oracle の対応関係を別途照合する。**material open question、意味欠落、改善結論の先出しがあれば主比較を実行しない**。有利な形へ seed を追加しない。
3. 比較へ進めた場合、同一 design と、事前固定した Known Problem plaintext と、同じ `docs/optimization-review.md` を K と U3 に与える。U1 には design だけを与える。各 arm は一度だけ別 Fresh context。K/U3 の実行指示は入力パス以外同じとし、U3 は Discovery の解法を受け取らない。
4. U1 raw 固定後、合成顧客役は Observation ごとに採用対象・維持・保留を判定する。Oracle に対応する Observation が確認された場合だけ、事前固定 Known Problem artifact を byte-identical に U3 へ渡す。U1 が発見しなければ U3 は実行せず、その不成立自体を結果にする。
5. 必要な negative / benign control を評価し、全 raw/hash を固定してから Oracle を開示。別 Fresh Evaluator が A〜F と H1〜H5 を根拠付きで判定する。最終結果は一般化しない。

Fresh review は `gpt-6-sol` / reasoning effort `medium` / `fork_turns: none` を request。role ごとに指示全文、revision、read log と SHA-256 を記録する。共有 filesystem の許可外アクセスを物理的に阻止できず、実効モデル設定や真の独立性は証明できない。
