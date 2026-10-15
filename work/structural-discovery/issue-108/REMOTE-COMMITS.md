# Issue #108 remote commit 対応

Git HTTPS 書込認証が利用できず、GitHub connector で同一親順序・同一 tree の commit を再作成した。author・時刻等のメタデータが異なり commit ID は一致しない。各段階の tree を local と照合した。

| local commit | PR #100 branch commit |
| --- | --- |
| `40cfaca6ef9520994a9e52e9bd289d3ba0646789` | `444fa3224ba4abda9f9f9a99180c15e0ef7f3f06` |
| `34a00d7600314bb866b79b1f75599fa94e4218b1` | `dc4b8611058060f6351d980cf0f716bcd3825552` |
| `a5bc9d503f1b08574a16fb7b97eddfd1419e1e63` | `960631b1abb561f8fae2aabc18327f5017c1a283` |
| `b7117acd2abefa2d007d73016578e804284b083c` | `d5c6b0900c7b2c91c4f4a12c69ac9b4da6250fc7` |
| `d4782f5bfc23c6260ab81043d5ec309ab9d5b814` | `d6faf5a3daa22a18d022bb55492b143ec1a9d6a0` |
