# 図書の貸出

架空の図書室の記述例です。未確認事項と記述の矛盾を含み、指摘の種類と関連先を確認できます。

# Scope

図書室の担当者が図書を貸し出す仕事を対象とする。返却と延長の運用は未確認。

# Object 図書台帳

## Scope

true

## Icon

book-open

## Information

- 図書の名前
- 貸出中かどうか

# Object 貸出記録

## Scope

true

## Icon

notebook-pen

## Information

- 借りる人の名前
- 貸出日
- 返却期限は貸出日から14日後

# Activity 図書を貸し出す

## Scope

true

## Why

利用者が図書を持ち帰って読めるようにするため

## When

利用者が借りたい図書を担当者へ持参したとき

## Who

図書室の担当者

## Where

図書室の受付

## How

### Input

- 図書台帳 — 図書の名前と貸出状況

### Procedure

貸出状況を確認する。貸出記録に借りる人の名前と貸出日を記入し、返却期限を貸出日から7日後とする。図書台帳を貸出中に更新し、図書を利用者へ渡す。

### Output

- 貸出記録 — 借りる人の名前と貸出日と返却期限
- 図書台帳 — 貸出中の状態

## Result

利用者が図書を受け取り、貸出記録と図書台帳に貸出が反映されている。

## Problem

貸出記録への手書きに時間がかかり、受付に待ち列ができる。

## Pain level

Medium

# Findings

## Finding F01

### Kind

question

### Status

open

### Scope

items

### Targets

- 図書を貸し出す
- 貸出記録

### Summary

同時に借りられる冊数

### Content

貸出冊数の上限があるかは未確認。上限がある場合、担当者は既存の貸出記録をどう確認しますか。

## Finding F02

### Kind

correction

### Status

open

### Scope

items

### Targets

- 図書を貸し出す
- 貸出記録

### Summary

返却期限の記述が一致していない

### Content

Procedureは貸出日から7日後、貸出記録のInformationは14日後と記載されている。正しい期限を担当者へ確認し、両方の記述をそろえる。片方を推測で採用しない。

## Finding F03

### Kind

question

### Status

open

### Scope

document

### Targets

(none)

### Summary

返却と延長の対象範囲

### Content

Scopeで未確認とした返却と延長を、今回の設計に含めるか確認する。

## Finding F04

### Kind

question

### Status

open

### Scope

unassigned

### Targets

(none)

### Summary

破損した図書の連絡先

### Content

図書の破損を見つけた場合の連絡先と、どの仕事で扱うかが未確認。既存の項目へ推測で割り当てない。

## Finding F05

### Kind

question

### Status

resolved

### Scope

items

### Targets

- 図書を貸し出す

### Summary

貸出を担当する人

### Content

図書室の担当者が行うことを確認し、Whoへ反映済み。
