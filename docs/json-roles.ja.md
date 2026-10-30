# ロールのID・名称・色を保持する

新規package 0.5 / BD schema 0.4ではrolesのid/name/colorを一元化し、Activity.performersのobjectIdとroleIdsから参照する。人・システム・スケジューラー等のObjectを主体にでき、Role兼任を許す。who/roleIdを重複正本にしない。未決主体とStep担当の扱いは[0.5契約](business-design-json-0.5.ja.md)に従う。

## 旧0.3・0.4の互換契約

候補形式 `alder-document-package/0.3` のBusiness Design（schemaVersion 0.2）は `roles: [{id, name, color}]` を一箇所に持ち、各Activityの `roleId` から参照する。Checkと部分定義のstateTransitionはpayload 0.1を維持する。外側の構造版・文書payload版・内容revision・Plugin版・Graph v1は独立である。正式JSON v1ではない。

基本パレットは `#8b5cf6`、`#2563eb`、`#c2410c`、`#008576`、`#be185d`。5を超えるロールも異なるIDで保持し、色の再利用を許す。色に業務意味や権限を割り当てない。未知色、ID/名称の重複、別BDや存在しないRoleへの参照は拒否する。

## 草案と変更

PluginはJSONを直接草案化し、IDを一度割り当て、Role参照と版を検査してcreate/commitする。Activity/Object/Roleの追加には新ID、改名・更新・再順序には保存済みIDを使う。ロールを改名する際はrolesのnameだけを変え、ID・color・Activityの参照を保持する。色を変更する依頼では保存色を明示的に変更する。Viewerが改名後の文字列から色を再計算することはない。

Activityの `who` は元の表現として保持し、`roleId` がある場合の表示名はRole catalogから取得する。自由記述のWhoと構造化参照を混同しない。Pluginは複合表現を分割・統合せず、曖昧ならroleIdをnullとし、`diagnostics` に `Role未確定: ACTIVITY_ID — 原文` を残す。Viewerは原文を表示し、保存色を持たない未確定Roleに中立色を使う。業務上の同一性を色や類義語から判断しない。同名だが別役割という入力は、人間の識別判断なしに保存可能な別名へ書き換えない。

## 旧JSONを明示的に移行する

0.1/0.2は従来のまま開ける。読込・復元で書き換えず、従来のWhoハッシュ色を再現する。新しいrolesを旧版に混ぜたり、未知版を読み飛ばしたりしない。

`upgradeRoles(package, {expectedRevision, revision, documentRevisions})` は0.1/0.2から0.3の候補を作る。BDと依存Check/Stateの旧版・新版を全て指定する。既存ID・Who原文・原典digest/URI・Check本文/人間状態・部分定義を保持する。単純なWhoの同一文字列に再現可能なIDを付け、従来MDの5色ハッシュ値を**初期保存色**とする。区切り/接続詞/括弧等を含むWhoは未確定に留める。この文字パターン判定は意味解析ではなく保守的な変換条件である。

同梱CLIでは、次のように候補だけを新規保存する。旧JSONは変更しない。

```sh
node "$SCRIPT_DIR/author-cli.mjs" prepare-role-upgrade old.json new-candidate.json revisions.json
```

候補の確認後、通常のcommitへ `migration: "roles-0.3"`、期待byte hash/版を渡す。移行専用のschemaVersion変更だけを許可する。依存Checkを更新する場合は新しい正確なBD版への人間確認が必要であり、移行APIはその確認を生成しない。Check期待が変わらなければ既存人間状態を保持する。旧JSONは移行前の原本として別途残す。

## MDから一方向に変換する

`convertMarkdown` / `cli.mjs convert` の要求に `roleCatalog: true` を明示する。初期色を保存し、元MDを保持する。既存の未対応見出し・原典版不一致は引き続き停止する。0.3のpreviousPackageから再変換するときもroleCatalogを明示し、ActivityのID/明示改名bindingを照合して既存のRole ID/名称/色を保持する。曖昧な再対応やID消失は拒否し、似た名前からの補完をしない。

Viewerは新JSONの保存色を業務図のバッジと既存ロール一覧へ渡す。名称を改めてもグループの同一性はRole IDで保持する。業務配置・配線の計算、カードの寸法、MD reader、Graph v1の契約は変更しない。Graph v1にはRole catalogを追加せず、既存Who原文を出力する。JSON→MD同期とJSONの人間直接編集UIは作らない。
