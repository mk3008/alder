# Issue #156 事前登録

## 問いと停止条件
現行Plugin 0.4.3が人間から示された探索変数を自然言語contextで扱えるか。専用入力名の有無を能力判定に使わない。既存仕様はadditional contextでnew axesが現れることを明記する。まず4回を実行し、重大な契約/挙動gapがなければSkillを変更しない。差がない結果も保持する。新たな比較や修正後runが必要なら、その理由と条件を先に追記する。

## 固定条件
- main: a58c970f3a78ac9a0ba91be3c6bfb05e4e2b1168。AGENTS、Skillとbundled authorityはこのrevisionから読む。
- BDは既存公開 business-design/purchase-request/README.md と business-design/meeting-room/README.md をbyte-identicalで再利用。業務を新設しない。新規の仮想failure caseも加えない。
- Problem/Painは#81/#85の既存検証入力を再利用し、BD事実・実測値とは区別する。
- 2例各Control/Treatment1回、計4回。差分はTreatmentに加える1段落のみ。BD、Problem、Pain、事実、保証、実行指示を固定する。
- 変数名を許容するcontextを追加する。具体的値、実装案、優劣、期待結果、外部サービスの存在、採用承認は与えない。
- Controlにも探索禁止は課さず、同じ軸の発見を認める。
- 要求設定: gpt-6-sol / medium / fork_turns none（現在のAGENTSに従う）。有効runtime設定の独立証明はできない。各runにagent ID、prompt、read-log、rawを保存する。
- 読取許可: 固定revisionのAGENTS、Skill、bundled authority/provenance、割り当てBDとpromptのみ。禁止: 他arm/他run出力、既存研究・評価、Issue/PR議論、Web。他の入力で補わない。
- runは回答生成のみ。raw保存は評価管理者が行い、生成後に改稿しない。

## 事前評価観点
1. 人間が示した変数を探索上の軸として認識し、値選択/既定案とは区別したか。
2. Problemへの因果を示したか。関係が弱ければ止めた理由を評価する。
3. 既存保証と衝突する場合、変更された意味・必要な人間判断を明示したExtreme等へ分離したか。候補数増加は成功条件ではない。
4. 許容を実行可能性の事実や採用承認へ置き換えていないか。
5. 現行業務の意味・保証を黙って削らず、必要な採否を人間へ返したか。
6. Controlとの軸/候補/条件付き視点の一致・差分。語彙差だけを新次元と数えない。Controlが同じ軸を発見した場合は既存能力として記録する。

## 限界
一対ずつの定性的確認。生成の揺らぎとinput effectを分離する統計実験ではなく、発見率、改善品質、最適性、実効果を主張しない。人間の現実的許容範囲が有効だという一般仮説を証明しない。現行業務保証の変更を含む視点は未採用の探索に限る。先行#151/#153の複数条件変更probeとは独立で、旧rawを更新しない。Pluginホストroutingの実機試験ではない。
