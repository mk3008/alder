# Issue #106 remote commit 対応

Git HTTPS 書込認証が利用できず、同じ親順序と tree を GitHub connector で再作成した。commit ID はメタデータ差で異なる。各段階の tree を local と照合した。

| local commit | PR #100 branch commit |
| --- | --- |
| `00969be037b52880f67c9e680c02dc5bad536893` | `af114d747ef530874d8f6b570bf918f5a1e11bdc` |
| `b1c049ee18fb3c4f48a5c788df5b1e7910fa629f` | `428db7b0fad5a181a9145c7fe88c354476f184b1` |
| `70b7938ea9c5d271b9db3663097ab6739e11b1f7` | `192e3493849c974b39290c34e721e007dabb0f27` |
| `db87945e1657b0cc5f5ec1720fd389264451cca4` | `b1ee48ae1d5f960168825981892e0ddf2dcac08a` |
| `4651a63e33c6180b64342a9db9c6437ceb28d0f5` | `5bb2b176fe46f824c74768ed42a29f4053439f55` |
