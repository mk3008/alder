# Issue #107 再現・監査

以下の local commit と PR branch の commit ID の対応は [REMOTE-COMMITS.md](REMOTE-COMMITS.md) に記す。

基点：Alder main merge commit `d9dba20f5c986f18542031cf9f24a12cfdd4ce57`、tree `2a2b06c1583e4648b0b88b4afa024a2bf8500015`。実験中、現行 Skill 0.2.6 と既存文書・研究 raw は変更しなかった。

1. local `fe8a8e3acab13ae2bcbccf69d3a8b0a2403c7326` で [PROTOCOL.md](PROTOCOL.md)、[fixtures](fixtures/)、[guidance.md](guidance.md)、各 run の `notes.md` / `prompt.txt` / `AGENTS.md` と [INPUT-SHA256](INPUT-SHA256) を固定。baseline には Quality guidance を与えず、treatment のみ追加した。
2. requested `gpt-6-sol`、effort `medium`、`fork_turns: none` の別 Fresh agent 8件（`/root/{baseline,treatment}_{a,b,c,d}_107`）が各 run の `prompt.txt` を読み、最初の `docs/business-design/draft.md`、実際のユーザー向け `response.md`、`read-log.md` を保存。launch 文面は各 run で「Fresh baseline/treatment A/B/C/D. Read and execute the exact task at <run の絶対パス>/prompt.txt. Write only the specified run outputs; do not read other experiment files. Report completion.」。baseline 初回 raw は local `00dc874e8e2b2336bfe94a99358b108a0707840c`、treatment と [OUTPUT-SHA256](OUTPUT-SHA256) は local `fecd4d630353b5903bab2b29430b08fe59a7fdb0` で固定。
3. 独立評価指示は local `f8b730eca835e7190284b38352dffefae968ee26` の `evaluation/prompt.txt`。`/root/evaluator_107` に requested `gpt-6-sol` / `medium` / `none` で「Independent Fresh assessment for Alder #107. Read and execute the exact prompt at <evaluation の絶対パス>/prompt.txt. Write only evaluator-raw.md and read-log.md in the evaluation directory. Preserve all run outputs. Report completion.」と依頼。初回 [評価原文](evaluation/evaluator-raw.md)・[読取記録](evaluation/read-log.md) は local `90f335fabb393713bec518d833c4cf362d022418` で固定し、raw への後付け修正をしていない。

repo root で `sha256sum -c work/business-quality/issue-107/INPUT-SHA256` と `sha256sum -c work/business-quality/issue-107/OUTPUT-SHA256` を実行する。基点からの変更は `work/business-quality/issue-107/` だけを意図する。hash と読取記録はファイル同一性・要求された実行設定の記録であり、共有 filesystem の非接触や実効モデル設定の証明ではない。
