# グラフ描画の同一性を検証する実験

基準は `610a00f76dd33cfaa3430524ca52a0a4e247a191` の業務グラフ。変更は `experiment/133-graph-identity` に隔離し、親ブランチ `feat/133-viewer-shell` は変更しない。未採用の場合はこの実験ブランチの差分を採用しなければ基準へ戻れる。後で取り込んだ場合は、この実験のコミット範囲をrevertする。保存文書の形式・正式JSON・Business Design・Check・Pluginを変更しない。

通常は下→左の実線、例外は右→右の座標位相を揃えた破線。通常の循環は描画上の戻りであり業務例外へ変更しない。図ごとの入力アダプターは意味を保ったままmatrixPlan／routeEdge／graphFocusへ渡す。概念の件数と独立接続口は残す。

HTMLの枠とshadow、基本線／関連線、矢印と例外の描画を共用する。SVG図もHTML面で枠を描き、HTML borderとSVG strokeの丸めの差を避ける。カードの文言・寸法・状態の特殊記号は固有のまま。業務の倍率25–250%・1.2倍・スクロール原点維持と、100%・原点・配置初期化を共通のカメラ方針にする。状態図は自動fitを廃し、明示倍率のキャンバスとツールバーを持つ。

概念のpublic配下の手書きJSコピーは廃止し、concept.htmlをViteでビルドして業務と同じTSのドラッグ・タッチ処理を直接importする。保存アダプターは既存のまま維持し、保存形式の統合は含めない。

`review-business.html`、`review-states.html`、`review-concept.html` は同じ固定の公開購買JSONを読み込む入口。概念はJSONから推論した図ではなく、既存の未採用6概念fixtureを表示する。

既存の業務配置・配線・reset・保存の保証を保持し、共通接続口・前進例外・独立コネクタ／件数・倍率／原点・直接隣接の回帰をtest-graph-identityへ追加する。状態の13操作とMD/JSON同値、概念の6隣接図と右情報／別タブ分離は既存回帰で検査する。廃止したpublic実行入口のテストはcompiled concept entryへ移管する。
