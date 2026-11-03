# Scope・Procedureの新構造候補

この文書は新しいBusiness Design構造の候補を説明する。候補package `formatVersion: "0.6"` とBusiness Design `schemaVersion: "0.5"` は、未公開の旧package 0.5／Business Design 0.4と異なる。採番は候補であり、製品版Pluginや公開リリースの版を示さない。現行の直接編集対象は従来どおりpackage 0.4で、新構造の直接編集・Skill・Viewerは後続の対応が必要である。

## Scopeと手順

ActivityとObjectのScopeは、対象システムを作る際に考慮する必要があるかを示す。`true`は対象、`false`は実装対象外、`null`は判断に必要な情報が未決である。Scope外Objectも入力の元資料として残せる。Scopeはヒアリングを通じて判断し、情報不足の時点では一度で当てる必要はない。

例えば紙を読む場合、対象システムがOCRで紙を取り込むなら紙は対象であり、人が紙を目視し、システムにその紙の生成責任やアクセスがないなら対象外である。「読む」だけでは判定できない。確認できた読み方はStep本文に記し、未確認の方法を補わない。Scopeを本文から自動推定しない。

1つのActivityは単一のWhoを持つ。WhoはRole参照、システム、スケジューラー、未決を表せる。手順は順序付きStepと、必要な局所順序制約を持つ。Stepは本文、必須・任意、適用条件、業務操作の効果、やり取りまたは内部判断を持つ。例外と複数Resultの意味・IDは別に保持する。

やり取りのStepは、既存Object、Request／Response、Input／Output方向、既存DataのID、任意の既存Relation ID、任意の対応Stepを持つ。方向とRequest／Responseは別の属性であり、入力Requestも出力Responseも存在できる。対応する応答がない場合に架空のResponseを作らない。`dataIds: []`はDataなし、`dataIds: null`は未決を表す。未決のやり取りも内部判断と区別する。

共通DataはInformationを参照する。同じ記載内容を紙から受け取り、メモへ送るStepで同一Dataを使える。Informationの所有先と受渡し先のObjectが違うだけでは拒否しない。InformationのID・所有先・名前・説明は勝手に移動・上書きしない。旧0.5を読む場合は旧版の所有先制約で検証する。

図の通常の線とDataラベルは、StepをActivity・Object・方向ごとに集約して生成する。逆方向は別の線。Step ID・Data ID・明示済みRelation IDは集約しても失わない。表と図に別々のData本文を保存しない。業務的に必要なStepの欠落自体は、図表の一致だけでは検出できず、業務要件やCheckとの照合が必要である。

## 版の読取りと候補準備

- 旧0.4のScope、文字列Who、手順とRelationは旧版の意味として読み取る。
- 未公開の旧0.5は、そのperformers・Step担当・Information・Data・順序・Resultを旧版として読む。新しい単一Whoに自動認定しない。
- 新構造候補0.6では、Stepのやり取りと未決を検証する。未対応版と不正な参照は拒否する。
- 新構造の通常編集を有効にする前に、Skill・Viewer・版ゲートと同梱runtimeを整合させる。

別途作成した新構造のBD候補と、本人が明示した判断を用意した場合、候補を別ファイルに準備できる。

```sh
node tools/document_storage/author-cli.mjs prepare-procedure-upgrade source.json authored-candidate.json new-candidate.json request.json
```

`request.json`の`expectedRevision`と`expectedSha256`は旧原本の版とバイト列の照合用である。`scopeDecisions`と`whoDecisions`には、判定済み対象のID、値、根拠を明示する。未決は`null`とし、根拠を推測しない。候補には元BDと同じActivity・Object・Relation等の既存IDを維持する。旧0.5のStep・Result・Data・InformationのIDと内容、既存Informationの所有先も保持し、旧RelationのDataとStepの対応を明示する。

出力は新しいBD候補であり、旧Check・State・概念モデルは元ファイルに残る。確認済み状態を新版への合意に読み替えず、付替えは別途確認する。旧文章を自動分割せず、旧WhoやScopeを推測しない。変換できない箇所・業務的な意味の確認は人間による作業として残る。元ファイルや既存出力は上書きしない。
