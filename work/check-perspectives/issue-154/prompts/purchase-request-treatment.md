既存Business DesignからCheck Item初稿を作る独立した生成試行です。日本語で回答してください。研究の比較条件や他の試行を推測しないでください。
入力とguidanceはsource revision a58c970f3a78ac9a0ba91be3c6bfb05e4e2b1168から凍結しています。
読むことを許可するファイルは、このprompt自身と下記だけです。すべて全文を読んでください。
- inputs/purchase-request.md
- guidance/skill.md
- guidance/traceability.md
- guidance/adoption-excerpt.md
- guidance/c3.md
パスはこの研究ディレクトリからの相対です。skill内の参照は上記凍結コピーで満たします。参照リンク、別ファイル、過去のCheck、実装、Test、レビュー、研究結果、他runは読まないでください。外部ツールによる情報取得、サブエージェントへの再委譲も行いません。
現行skill / traceability / adoptionが歴史的c3より優先し、恒久mappingはBusiness Design ↔ Check ↔ Testまでです。
この2業務の既存公開設計を研究用に意味固定します。研究への使用は個々の業務意味の人間承認を意味しません。入力の合意・相関レビュー完了を独立に確認できないため「人間レビュー前・入力合意未確認の研究用初稿」と表示し、その制約のもとで独立した初稿作業を進めてください。Business Designを書き換えず、未決・非対象の意味を確定しません。
依頼: 指定Business Designの全文から通常の現行guidanceに従ってCheck Itemを導出してください。Optional Functional Interfaceは作成しません。c3の二層表示、同一IDへの根拠行番号・短い根拠・導出分類・AI確度・優先度・接続を保持してください。件数目標はありません。未決の意味は質問として分離し、既に明示的に保留された範囲は再質問しません。
補助探索: 各確定済み期待について「同じ成立条件を壊し得る、独立した別視点があるか」を確認してください。同時実行/interleaving、状態遷移/lifecycle、複数経路を横断する不変条件、時系列/順序、途中失敗後に残る事実、同じ操作の再実行による結果差は候補例にすぎません。入力に根拠があり、既存の成立条件の確認方法を変える視点だけ選びます。全観点を固定チェックリストとして全件走査せず、全組合せを列挙しません。新しい業務判断が必要ならCheckへ確定せずBusiness Design質問へ分離します。既存c3と同じ期待の言い換えを増やさず、独立した結果差がなければ止めます。採用した別視点は、そのCheck詳細に既存期待との関係を一言で残してください。具体的なTest/DB制約/SMT等の実装手段は導入しません。
出力はCheck初稿本文だけです。raw/purchase-request-treatment.mdへ本文を保存し、最終応答にその同じ本文を返してください。元入力・guidance・promptは編集しません。読み込んだpathと入力revisionを冒頭に示してください。実効model / effortは独立に確認できない場合、確認済みとは書かないでください。
