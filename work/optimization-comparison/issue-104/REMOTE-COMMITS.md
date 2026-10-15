# Issue #104 GitHub 反映時のコミット対応

ローカル Git の HTTPS push は認証情報がなく失敗したため、承認済みの同じファイル差分と親順序を GitHub 連携で11コミットとして作成した。最終 tree SHA はローカル `4f29bcdc48402e94affb77f6f0a22a96bf019932^{tree}` と GitHub 側の `4750d233ce4ee66876e49b78ef1c2b532186004d` で一致する。commit ID は作成者・日時の違いで一致しない。Oracle commitment、raw 固定、開示の順序は両系列で保たれる。

| ローカル commit | GitHub commit |
| --- | --- |
| `d9d6cd9daeacd60a5e5de0560a4a9eb28c3d1fd4` | `091b649cc27974eb600b2a5d12e41bfcbda0da09` |
| `f4b47547f5e9a993818153ee1675f4419f9a7ce8` | `f37b38d7598d4517e1f1df31b051877a4079257c` |
| `3375747cfcb7902f13d1c8480e535de015915db2` | `cc3a4a24c39f45f48a43f81235437059eac88bf8` |
| `da114ebab74fff7a34d492efd8ab34e7c0f0a394` | `facab9ad54b8bf15e6d74fffdd3b54da914510ed` |
| `5ab468fbed4c2e56de28f93f9745e9a18dc2367c` | `2cf47987f8374e3378592cdc6d37fb6b795853ed` |
| `c5ab3746ce663464bbad421bcf5247822846f1da` | `55bbc533dc1267b7cd29f066b3b223e5e79d5f83` |
| `b27bd1ed1c288d0b9c2b4662e58b77ca191bdac8` | `461cc82447e9972e3fca46e5f2b180a51e4815d0` |
| `78a7895f090e4872b89d3c3cc4664d7fb486e280` | `da0ad0e9c8423d9eb69b38d021bac40845c4c4b0` |
| `ba1d915f020c4cc281e2a8537aec457a344108e1` | `8b30ea39e83a2559df76cb4133a5543c6f06babe` |
| `de1da805abd137aaedef3639b826dc2647dab27f` | `a92f0e1feddcd93f1e6915ad74e7cab95a04ba72` |
| `4f29bcdc48402e94affb77f6f0a22a96bf019932` | `b216e6b54fcc4356c0ca4a9eb2e86e8ad566d97d` |

本表自体は比較・評価後に追加した監査記録で、固定済み raw や Oracle を変更しない。
