# Alder Plugin 0.4.2 — One-request review and record follow-up

A single request can now coordinate an independent implementation review and authorized Check-to-Test record maintenance:

> Alderで実装をレビューして、チェックとテストの対応も更新して。

The reviewer runs in a separate Fresh read-only context. The caller then updates only the requested records after checking the reviewed revisions. A bare review request or explicit “レビューだけ” does not write. Existing-review record maintenance remains available without another review. Unresolved business meaning and human review states are preserved; this does not add a coding loop or automatic acceptance.

The package retains the same ten Skills and plugin identity. The existing implementation-review entry reuses the existing follow-up Skill internally; users do not need to invoke both by name.

## Install

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.4.2
codex plugin marketplace list
```

Install or refresh Alder from the configured marketplace and start a new chat. See [the Plugin guide](plugin-adoption.md) for client setup and scope.

## Requirements and validation limits

The combined route needs a host capable of running a separate agent or Fresh context. If that facility is unavailable, it reports the missing independent stage and does not start combined-workflow writes. The Skill does not add that runtime capability.

A synthetic native-agent exercise completed separate review and bounded record changes in one invocation. Explicit/bare review remained read-only; record-only avoided a new review. Package, script, release and local CLI installation checks passed. Real-client automatic routing, effective model-setting attestation and measured real-user effort reduction remain unverified. The simulated unavailable-host case is not actual client-runtime evidence.

[Verification and reproducible inputs](../work/review-entry/issue-147/RESULT.md). Method releases and review knowledge v0.3 have separate versions. Existing release tags are not moved by this publication.
