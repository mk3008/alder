# Scope・Procedureの新構造候補

この文書は新しいBusiness Design構造の候補を説明する。候補package `formatVersion: "0.6"` とBusiness Design `schemaVersion: "0.5"` は、未公開の旧package 0.5／Business Design 0.4と異なる。採番は候補であり、製品版Pluginや公開リリースの版を示さない。候補Viewerは旧0.5と新0.6を読取り専用で表示する。現行の直接編集対象は従来どおりpackage 0.4で、新構造の通常編集とSkillは後続の対応が必要である。

## 新しい聞き取り・Checkの方針

[聞き取りで手順とチェックを記録する](business-design-hearing-and-checks.ja.md)方針では、条件と結果を聞いた時点で構造化したCheck草案に残し、手順から参照する。表のFrom・Toは情報の受渡し方向として検討する。この方針は現行候補0.6の保存器・Viewer・Skillにはまだ実装されていない。以下の0.6のpartiesは操作主体・対象であり、新しい意味に暗黙変換しない。

## Scopeと手順

ActivityとObjectのScopeは、対象システムを作る際に考慮する必要があるかを示す。`true`は対象、`false`は実装対象外、`null`は判断に必要な情報が未決である。Scope外Objectも入力の元資料として残せる。Scopeはヒアリングを通じて判断し、情報不足の時点では一度で当てる必要はない。

例えば紙を読む場合、対象システムがOCRで紙を取り込むなら紙は対象であり、人が紙を目視し、システムにその紙の生成責任やアクセスがないなら対象外である。「読む」だけでは判定できない。確認できた読み方はStepの方法として記し、未確認の方法を補わない。Scopeを方法から自動推定しない。

1つのActivityは単一のWhoを持つ。WhoはRole参照、システム、スケジューラー、未決を表せる。手順は順序付きStepと、必要な局所順序制約を持つ。標準の表は **From・To・Data・Action** を中心にし、必要な方法・条件等を併せて確認できる候補である。各StepはActionと方法、操作対象Data、必須・任意、適用条件、業務操作の効果、やり取りまたは内部判断を保持する。方法未決は`null`で表し、自然文の文法解析に依存しない。例外と複数Resultの意味・IDは別に保持する。

例えば「作業者が紙の記載内容を読み取る」のDataは、読む対象を意味する。表の対象DataがそのままFromからToへ送信されると推測しない。Stepの任意の`parties`は操作する主体と対象を表し、受渡しの`direction`とは独立する。未記載の主体・対象は推測しない。目視の場合は「作業者が紙を読む」の1行で、情報は紙からActivityへ入力されると表せる。紙が応答したことにはしない。[目視の例](../tools/document_storage/examples/paper-manual-v06.json)では同じ記載内容をメモへ書く。

以下は旧来の合成例であり、確認が必要になる条件と、記録が確認メモか登録かは未整理である。業務の区切りを決める根拠にはしない。

| From | To | Data | Action |
| --- | --- | --- | --- |
| 設計者 | ノート | 検索条件 | 検索する |
| ノート | 設計者 | 検索結果 | 返す |
| 設計者 | 顧客 | 確認事項 | 確認する |
| 顧客 | 設計者 | 顧客回答 | 返す |
| 設計者 | — | 顧客回答 | 判断する |
| 設計者 | ノート | 顧客回答 | 記録する |
| 設計者 | 承認者 | 承認依頼 | 承認を依頼する |
| 承認者 | 設計者 | 承認結果 | 返す |
| 設計者 | 顧客 | 結果通知 | 通知する |

回答が得られない場合は、条件付きStep「確認待ちとして記録する」と別のResult・例外を残す。通知には応答を作らない。この例では顧客と承認者に人が直接対応し、対象システムはアクセスしない前提で、それぞれをScope外Objectとして参照する。別のActivityでは定刻バッチをWhoとし、対象データの照合を記録できる。[構造化された合成例](../tools/document_storage/examples/procedure-cases-v06.json)を使い、手順の理解を共有し、違いや不足を指摘できるかを確認する。

やり取りのStepは、既存Object、Request／Response、Input／Output方向、既存DataのID、任意の既存Relation ID、任意の対応Stepを持つ。方向とRequest／Responseは別の属性であり、入力Requestも出力Responseも存在できる。Request／Responseが未決なら`null`、その区別を適用しない場合は`not-applicable`を使う。対応Stepの指定は双方がRequestとResponseの場合に限る。対応する応答がない場合に架空のResponseを作らない。`dataIds: []`はDataなし、`dataIds: null`は未決を表す。未決のやり取りも内部判断と区別する。

## 例外と再開

例外はActivityに属する`exceptions`へ記録する。候補0.6では任意の`continuity`に発生条件、中断時の扱い、再開／継続／終了、再開条件と再開方法を記述できる。中断・再開に対応するStep IDと保持するData IDも参照できる。Stepは同じActivity、Dataは同じ文書に存在するものを使う。未決は`null`とし、実際にない中断や応答は作らない。[下書きを探して再開する合成例](../tools/document_storage/examples/continuity-draft-v06.json)では、再開条件は確認用の仮定である。

例外の説明だけを持つ従来データはそのまま読める。フロー図への例外の表示方針は未決で、現行の例外関係を維持する。例外の説明と受け側のException Whenの関係、Stateとの役割分担は引き続き確認する。

共通DataはInformationを参照する。同じ記載内容を紙から受け取り、メモへ送るStepで同一Dataを使える。Informationの所有先と受渡し先のObjectが違うだけでは拒否しない。InformationのID・所有先・名前・説明は勝手に移動・上書きしない。旧0.5を読む場合は旧版の所有先制約で検証する。

図の線とDataラベルの候補は、StepをActivity・Object・方向ごとに集約して生成する。逆方向は別の線。Step ID・Data ID・明示済みRelation IDは集約しても失わない。未決の受渡しを確定済みのDataラベルにしない。Dataのない要求や内部判断を実際のDFDにどう表示するかは、採用前に確認する。例えば同じノートへの顧客名検索と受付日検索を一つの線へ集約しても、各Stepをたどって確認し、元の説明との違いや不足を指摘できることをレビューする。

## 版の読取りと候補準備

- 旧0.4のScope、文字列Who、手順とRelationは旧版の意味として読み取る。
- 未公開の旧0.5は、そのperformers・Step担当・Information・Data・順序・Resultを旧版として読む。新しい単一Whoに自動認定しない。
- 新構造候補0.6では、Stepのやり取りと未決を検証する。未対応版と不正な参照は拒否する。
- 新構造の通常編集を有効にする前に、Skill・Viewer・版ゲートと同梱runtimeを整合させる。

別途作成した新構造のBD候補と、本人が明示した判断を用意した場合、候補を別ファイルに準備できる。

```sh
node tools/document_storage/author-cli.mjs prepare-procedure-upgrade source.json authored-candidate.json new-candidate.json request.json
```

`request.json`の`expectedRevision`と`expectedSha256`は旧原本の版とバイト列の照合用である。`scopeDecisions`と`whoDecisions`には、判定済み対象のID、値、根拠を明示する。未決は`null`とし、根拠を推測しない。候補には元BDと同じActivity・Object・Relation等の既存IDを維持する。旧0.5のStep原文は各Stepの`legacyText`へ保持する。Step・Result・Data・InformationのIDと内容、既存Informationの所有先も保持し、旧RelationのDataとStepの対応を明示する。

出力は新しいBD候補であり、旧Check・State・概念モデルは元ファイルに残る。確認済み状態を新版への合意に読み替えず、付替えは別途確認する。旧文章を自動分割せず、旧WhoやScopeを推測しない。変換できない箇所・業務的な意味の確認は人間による作業として残る。元ファイルや既存出力は上書きしない。
