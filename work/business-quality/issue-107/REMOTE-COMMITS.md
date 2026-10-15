# Issue #107 remote commit 対応

Git HTTPS 書込認証が利用できなかったため、同じ親順序と各段階で同一 tree を GitHub connector で再作成した。author・時刻等のメタデータ差により commit ID は異なる。

| local commit | PR branch commit |
| --- | --- |
| `fe8a8e3acab13ae2bcbccf69d3a8b0a2403c7326` | `dad85434a6086e332b8efe5a89f6e92af39d3769` |
| `00dc874e8e2b2336bfe94a99358b108a0707840c` | `a937836e4974248a923dc5d4279a78f81ddaf18c` |
| `fecd4d630353b5903bab2b29430b08fe59a7fdb0` | `67f07115720b7eb740cd327baeb5c38d0bbbe682` |
| `f8b730eca835e7190284b38352dffefae968ee26` | `54429b42781df66950e438933eefc0f9b39f85ce` |
| `90f335fabb393713bec518d833c4cf362d022418` | `3352edddde7b6d44bff280144d74d0a2ad315586` |
| `579ef8fee00a7c001797e0e2b971b467ab2de260` | `4ba8841499e88161aaec8520df616635ca3dd394` |
