# Packetと匿名化の実行規約

初回Stage3 probeとscore評価の前に固定する配置の詳細。PROTOCOL v1の生成入力・手法・採点分母は変更しない。

- Stage1/2 direct評価はworkflowが生成した全business artifactsを参照する。RDRAは `0_RDRAZeroOne` と `1_RDRA`、Alderはbusiness-designとユーザーへのresponse。入力source、method、operator metadataは成果物扱いしない。
- Stage3のhandoff packetは最終成果物。RDRAは `1_RDRA` 配下の全TSV/JSON/txt、AlderはBusiness Designとユーザーへのresponse。RDRAの中間Phase1–4をdownstreamへ追加提供しない。中間outputの消失と下流伝達を区別する。
- 各artifactの相対pathを匿名番号へ置換し、その本文を連結する。手法名・plugin版・provenanceの行だけ除外または `[method metadata removed]` に置換し、変更箇所を記録する。業務内容・未決を削除しない。構造からのarm推定は防げないsingle-blind限界。
- mapping seed `13320261002`、60個の匿名packet IDを事前割当。mappingはoperatorの評価後unblindingに使用し、evaluatorには渡さない。
- 下流probeはStage2最終packetだけを受け取る。抽出者は各Stage1/2/probe packetだけからfacts/unknowns/questionsをcanonical化し、raw根拠行を付ける。oracleは見ない。score evaluatorは匿名canonical抽出とcaseのsource/回答/oracle/rubricを見る。
- 要件事実が原文にない場合に抽出者が補完することを禁止する。canonical抽出がrawから誤っている可能性も第三者が再評価できるよう、raw packet・匿名化log・対応表を保存する。
- 実効runtime設定と共有filesystemへのアクセス制御には独立証明がない。read-logとallowlist遵守の記録はsecurity isolationの証明ではない。
