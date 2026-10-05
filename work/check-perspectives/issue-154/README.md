# Check探索視点pilot (#154)

[結論と限界](result.md)から読む。標準promptは不採用。正式Skill・仕様は変更しない。

## 追試

1. Repositoryの公開commit `25ec5216cbc2561d5c60e93ade22118c7f621272` を取得する。この時点には生成前のprotocol、入力、guidance、prompt、hashがあり、rawはまだない。
2. `manifest.json` のSHA-256と読み取った入力を照合する。各caseの2armは同一BDを用いる。
3. 各 `prompts/<case>-<arm>.md` を独立した履歴なしのagentへ渡す。model `gpt-6-sol` / effort `medium`を要求し、実効値の取得可否を記録する。`records/*-launch.txt` は実際の完全launch指示。自環境では作業dirだけ置き換え、差を記録する。
4. generatorへ他arm、他case、過去出力、実装、Test、評価資料を見せない。出力と取得できたruntime metadataを保存する。確率的生成なのでbyte-identicalな再出力を期待しない。
5. 事前のprotocol分類で、期待の根拠・意味保存・他armとの対応・ノイズ・質問/出力量を評価する。この試行のmasked評価と訂正overlayは `evaluation/`。元rawと元スコアは書き換えていない。
6. 保存済み証跡の整合は、このdirectoryで `python3 verify.py` を実行する。

入力の人間合意と相関レビュー完了、実効model/effortは独立未確認。完全盲検ではない評価過程の制約、局所的な意味逸脱、元記事の未取得は `result.md` に明記している。本資料は実装・業務承認ではない。
