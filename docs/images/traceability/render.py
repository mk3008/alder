#!/usr/bin/env python3
"""Render the three bilingual README traceability diagrams deterministically.

Run from any directory:
    python docs/images/traceability/render.py

Requires Pillow and Noto Sans CJK JP (regular and bold TTC files). The default
font directory is the Debian/Ubuntu fonts-noto-cjk location; --font-dir can
select another installation. Rendering performs no network access. Each source
canvas is 640 logical pixels wide. Japanese images use the creation-workflow
scale (1160px source width); English images retain their existing 1280px width.
Japanese typography is derived from the 1160px creation-workflow original:
49px title / 35px card heading / 27px body, all displayed at README width=640.
All text is checked against its allotted width.
"""
from __future__ import annotations

import argparse
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH = 640
SUPERSAMPLE = 4
OUTPUT_SCALE = 2
P = {
    "bg": "#F7F8FA", "white": "#FFFFFF", "ink": "#253449",
    "muted": "#526983", "line": "#CCD8E7", "arrow": "#8194AC",
    "gray": "#EDF1F6", "blue": "#E9F3FA", "blue_line": "#AED1EE",
    "blue_ink": "#25638E", "green": "#E3F0EA",
    "green_line": "#84BAA4", "green_ink": "#21634D",
    "yellow": "#FFF3D9", "yellow_line": "#EDB852",
    "yellow_ink": "#825D14",
}
FONT_DIR: Path


@lru_cache(maxsize=None)
def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    weight = "Bold" if bold else "Regular"
    return ImageFont.truetype(str(FONT_DIR / f"NotoSansCJK-{weight}.ttc"),
                              round(size * SUPERSAMPLE), index=0)


class Canvas:
    def __init__(self, height: int):
        self.height = height
        self.palette = P
        self.im = Image.new("RGB", (WIDTH * SUPERSAMPLE, height * SUPERSAMPLE), self.palette["bg"])
        self.draw = ImageDraw.Draw(self.im)

    def rect(self, x, y, w, h, fill="white", outline="line", radius=12, width=1):
        box = tuple(round(v * SUPERSAMPLE) for v in (x, y, x + w, y + h))
        self.draw.rounded_rectangle(box, radius=radius * SUPERSAMPLE,
                                    fill=self.palette.get(fill, fill), outline=self.palette.get(outline, outline),
                                    width=round(width * SUPERSAMPLE))

    def line(self, xy, color="arrow", width=1.6):
        self.draw.line([(round(x * SUPERSAMPLE), round(y * SUPERSAMPLE)) for x, y in xy],
                       fill=self.palette.get(color, color), width=round(width * SUPERSAMPLE), joint="curve")

    def dashed(self, x1, x2, y, color="line"):
        for x in range(int(x1), int(x2), 12):
            self.line([(x, y), (min(x + 6, x2), y)], color, 1.5)

    def text(self, x, y, value, size=20, bold=False, color="ink", max_width=None, center=False):
        face = font(size, bold)
        measured = self.draw.textlength(value, font=face) / SUPERSAMPLE
        if max_width is not None and measured > max_width:
            raise ValueError(f"Text exceeds width {max_width}: {value!r} ({measured:.1f})")
        if center:
            x -= measured / 2
        self.draw.text((round(x * SUPERSAMPLE), round(y * SUPERSAMPLE)), value,
                       fill=self.palette[color], font=face, anchor="lt")

    def arrow(self, x, y1, y2, bidirectional=False, color="arrow", width=2):
        self.line([(x, y1), (x, y2)], color, width)
        for yy, direction in [(y2, -1)] + ([(y1, 1)] if bidirectional else []):
            self.line([(x - 5, yy + direction * 7), (x, yy),
                       (x + 5, yy + direction * 7)], color, width)

    def icon(self, kind, x, y, color="muted"):
        # Small line icons, deliberately using the same stroke as connectors.
        if kind == "document":
            self.line([(x, y + 26), (x, y), (x + 17, y), (x + 24, y + 7),
                       (x + 24, y + 26), (x, y + 26)], color, 1.8)
            self.line([(x + 17, y), (x + 17, y + 7), (x + 24, y + 7)], color, 1.8)
            self.line([(x + 5, y + 13), (x + 18, y + 13)], color, 1.8)
            self.line([(x + 5, y + 19), (x + 18, y + 19)], color, 1.8)
        elif kind == "check":
            self.rect(x, y, 26, 26, "white", color, radius=5, width=1.8)
            self.line([(x + 5, y + 13), (x + 11, y + 19), (x + 21, y + 7)], color, 2)
        elif kind == "play":
            self.rect(x, y, 26, 26, "white", color, radius=13, width=1.8)
            self.line([(x + 10, y + 7), (x + 19, y + 13), (x + 10, y + 19),
                       (x + 10, y + 7)], color, 1.8)
        elif kind == "code":
            self.line([(x + 8, y + 5), (x, y + 13), (x + 8, y + 21)], color, 2)
            self.line([(x + 20, y + 5), (x + 28, y + 13), (x + 20, y + 21)], color, 2)
            self.line([(x + 16, y + 2), (x + 12, y + 24)], color, 1.8)

    def title(self, title, subtitle):
        self.text(40, 27, title, 29, True, max_width=560)
        self.text(40, 69, subtitle, 19, color="muted", max_width=560)

    def save(self, path: Path):
        self.im.resize((WIDTH * OUTPUT_SCALE, self.height * OUTPUT_SCALE),
                       Image.Resampling.LANCZOS).save(path, optimize=True)


def entity(c, y, h, title, icon, fill="gray", ink="ink", badge=None,
           center_header=False, green_badge=False):
    c.rect(48, y, 544, h)
    c.rect(49, y + 1, 542, 53, fill, fill, radius=11)
    # Flat lower edge on the tinted header, with a single separating rule.
    c.draw.rectangle((49 * SUPERSAMPLE, (y + 38) * SUPERSAMPLE,
                      591 * SUPERSAMPLE, (y + 54) * SUPERSAMPLE), fill=P[fill])
    c.line([(49, y + 54), (591, y + 54)], "line", 1)
    c.icon(icon, 66, y + 14, ink if ink != "ink" else "muted")
    # Center actual glyph ink with the 26px icon, not the font's em box.
    title_top = 13
    if center_header:
        bbox = c.draw.textbbox((0, 0), title, font=font(24, True), anchor="lt")
        title_top = 27 - (bbox[3] - bbox[1]) / SUPERSAMPLE / 2
    c.text(105, y + title_top, title, 24, True, ink, max_width=374 if badge else 467)
    if badge:
        badge_width = 84 if badge == "SSOT" else 166
        c.rect(574 - badge_width, y + 12, badge_width, 31,
               "green" if green_badge else "white",
               "green_line" if green_badge else "line", radius=7)
        badge_top = 17
        if center_header:
            bbox = c.draw.textbbox((0, 0), badge, font=font(17, True), anchor="lt")
            badge_top = 27.5 - (bbox[3] - bbox[1]) / SUPERSAMPLE / 2
        c.text(574 - badge_width / 2, y + badge_top, badge, 17, True,
               color="green_ink" if green_badge else ink,
               center=True, max_width=badge_width - 12)


def relation(c, top, bottom, label):
    c.arrow(320, top, bottom, True)
    c.text(302, top + 1, "N", 18, True, "muted", center=True)
    c.text(302, bottom - 20, "M", 18, True, "muted", center=True)
    c.text(346, (top + bottom) / 2 - 11, label, 20, color="muted", max_width=230)


class JapaneseCanvas(Canvas):
    """Match creation-workflow typography at the same 640px README width."""
    def __init__(self, height):
        super().__init__(height)
        self.palette = dict(P, ink="#253347", muted="#526477", line="#D5DEE8",
                            arrow="#8A98AA", blue_line="#B6D3E8", blue_ink="#285B7E",
                            green_line="#8DB9A4", green_ink="#245C47",
                            yellow_line="#E2BF71", yellow_ink="#795A1D")

    def title(self, title, subtitle):
        self.text(58, 31, title, 49 * 640 / 1160, True, max_width=535)
        self.text(58, 65, subtitle, 31 * 640 / 1160, color="muted", max_width=535)

    def save(self, path):
        self.im.resize((1160, round(self.height * 1160 / 640)),
                       Image.Resampling.LANCZOS).save(path, optimize=True)


def ja_icon(c, kind, x, y, color="muted"):
    scale = 20 / 26
    def line(points, width=1.4):
        c.line([(x + xx * scale, y + yy * scale) for xx, yy in points], color, width)
    if kind == "document":
        line([(0, 26), (0, 0), (17, 0), (24, 7), (24, 26), (0, 26)])
        line([(17, 0), (17, 7), (24, 7)])
        line([(5, 13), (18, 13)])
        line([(5, 19), (18, 19)])
    elif kind == "check":
        c.rect(x, y, 20, 20, "white", color, radius=4, width=1.4)
        line([(5, 13), (11, 19), (21, 7)], 1.6)
    elif kind == "play":
        c.rect(x, y, 20, 20, "white", color, radius=10, width=1.4)
        line([(10, 7), (19, 13), (10, 19), (10, 7)], 1.4)
    elif kind == "code":
        line([(8, 5), (0, 13), (8, 21)], 1.6)
        line([(20, 5), (28, 13), (20, 21)], 1.6)
        line([(16, 2), (12, 24)], 1.6)


def ja_entity(c, y, h, title, icon, fill="gray", ink="ink", badge=False):
    c.rect(58, y, 535, h, radius=10, width=1.1)
    c.rect(59, y + 1, 533, 41, fill, fill, radius=9, width=1.1)
    c.draw.rectangle((59 * SUPERSAMPLE, (y + 30) * SUPERSAMPLE,
                      592 * SUPERSAMPLE, (y + 42) * SUPERSAMPLE), fill=c.palette[fill])
    c.line([(59, y + 42), (592, y + 42)], "line", 1.1)
    ja_icon(c, icon, 74, y + 11, ink if ink != "ink" else "muted")
    size = 35 * 640 / 1160
    bbox = c.draw.textbbox((0, 0), title, font=font(size, True), anchor="lt")
    c.text(108, y + 21 - (bbox[3] - bbox[1]) / SUPERSAMPLE / 2,
           title, size, True, ink, max_width=390)
    if badge:
        c.rect(515, y + 9, 62, 25, "green", "green_line", radius=6, width=1.1)
        c.text(546, y + 15, "SSOT", 13.8, True, "green_ink", center=True, max_width=50)


def ja_relation(c, top, bottom, label):
    c.arrow(326, top, bottom, True, width=1.65)
    c.text(310, top, "N", 14.9, True, "muted", center=True)
    c.text(310, bottom - 16, "M", 14.9, True, "muted", center=True)
    c.text(347, (top + bottom) / 2 - 8, label, 15.45, color="muted", max_width=230)


def model_ja():
    c = JapaneseCanvas(890)
    c.title("成果物の相関", "概念モデル：多対多の追跡関係")
    c.rect(39, 97, 574, 770, radius=13, width=1.1)
    ja_entity(c, 113, 140, "業務設計書", "document", badge=True)
    c.text(74, 166, "識別キー：文書内のActivity名", 15.45, True, max_width=503)
    c.text(74, 193, "例：予約を受け付ける", 14.9, color="muted", max_width=503)
    c.text(74, 223, "業務の手順・入出力・結果を記した文書", 14.9, max_width=503)
    ja_relation(c, 261, 299, "期待結果を導く")
    ja_entity(c, 308, 318, "チェック項目リスト", "check", "blue", "blue_ink")
    c.text(74, 361, "各項目の識別キー：Check ID（安定キー）", 15.45, True, "blue_ink", max_width=503)
    c.text(74, 386, "例：CK-01", 14.9, color="muted", max_width=503)
    c.text(74, 411, "独立して確認できる、条件と期待結果の一覧", 14.9, max_width=503)
    c.line([(74, 435), (577, 435)], "line", 1.1)
    c.text(74, 450, "・業務設計書との結合", 15.45, True, "blue_ink", max_width=503)
    c.text(88, 474, "作成・更新スキル利用時に、", 14.9, max_width=489)
    c.text(88, 495, "文書とActivity名を紐づけて管理", 14.9, max_width=489)
    c.text(74, 524, "・テストとの結合", 15.45, True, "blue_ink", max_width=503)
    c.text(88, 548, "実装レビュー後の記録更新スキル利用時に、", 14.9, max_width=489)
    c.text(88, 569, "AIが条件・期待結果とテストの検証内容を照合し、", 14.9, max_width=489)
    c.text(88, 590, "対応するテスト名・検証内容を記録", 14.9, max_width=489)
    ja_relation(c, 634, 672, "期待結果を検証")
    ja_entity(c, 680, 140, "テスト", "play", "green", "green_ink")
    c.text(74, 733, "識別キー：テスト名", 15.45, True, "green_ink", max_width=503)
    c.text(74, 758, "例：test_accept_booking", 14.9, color="muted", max_width=503)
    c.text(74, 783, "条件・期待結果をコードの実行で確かめる", 14.9, max_width=503)
    c.text(326, 842, "テストもチェック項目を経由してSSOTまで遡れる", 16.55, True,
           "green_ink", max_width=535, center=True)
    return c


def execution_ja():
    c = JapaneseCanvas(576)
    c.title("コードとAlder成果物の相関", "記録する対応はテストまで")
    c.rect(39, 97, 574, 271, radius=13, width=1.1)
    c.text(58, 113, "記録しておく対応関係", 17.65, True, "muted", max_width=535)
    for y, title, kind, fill, ink in [(148, "業務設計書", "document", "gray", "ink"),
                                     (221, "チェック項目リスト", "check", "blue", "blue_ink"),
                                     (294, "テスト", "play", "green", "green_ink")]:
        c.rect(58, y, 535, 44, fill, "line", radius=10, width=1.1)
        ja_icon(c, kind, 74, y + 12, ink if ink != "ink" else "muted")
        size = 35 * 640 / 1160
        bbox = c.draw.textbbox((0, 0), title, font=font(size, True), anchor="lt")
        c.text(108, y + 22 - (bbox[3] - bbox[1]) / SUPERSAMPLE / 2, title, size, True, ink)
    c.rect(515, 157, 62, 25, "green", "green_line", radius=6, width=1.1)
    c.text(546, 163, "SSOT", 13.8, True, "green_ink", center=True, max_width=50)
    c.arrow(326, 198, 215, True, width=1.65)
    c.arrow(326, 271, 288, True, width=1.65)
    # Blue dashed one-way input flow is not a maintained Code mapping.
    def input_line(x1, y1, x2, y2):
        distance = abs(x2 - x1) + abs(y2 - y1)
        for start in range(0, int(distance), 11):
            end = min(start + 6, distance)
            c.line([(x1 + (x2-x1)*start/distance, y1 + (y2-y1)*start/distance),
                    (x1 + (x2-x1)*end/distance, y1 + (y2-y1)*end/distance)], "blue_ink", 1.65)
    for segment in [(58, 170, 21, 170), (58, 243, 21, 243),
                    (21, 170, 21, 480), (21, 480, 58, 480)]:
        input_line(*segment)
    c.line([(51, 475), (58, 480), (51, 485)], "blue_ink", 1.65)
    c.text(58, 385, "実装の入力（青点線）", 15.45, True, "blue_ink", max_width=245)
    c.text(58, 408, "業務設計書・チェック項目", 14.9, color="blue_ink", max_width=245)
    c.text(58, 431, "＋システム要件", 14.9, color="blue_ink", max_width=245)
    c.arrow(326, 346, 438, color="green_ink", width=1.9)
    c.text(346, 397, "実行して検証", 19.3, True, "green_ink", max_width=230)
    c.rect(58, 448, 535, 64, "gray", "line", radius=10, width=1.1)
    ja_icon(c, "code", 74, 462)
    c.text(108, 463, "コード", 19.3, True)
    c.text(108, 490, "業務の処理を実装", 14.9, color="muted", max_width=465)
    c.text(326, 537, "コードはテストで検証し、間接的に業務設計書まで遡れる", 14.9,
           color="green_ink", center=True, max_width=535)
    return c


def drift_ja():
    c = JapaneseCanvas(735)
    c.title("変更後も意味の対応を確かめる", "標準レビューと任意のdrift pilot")
    c.rect(39, 97, 574, 270, radius=13, width=1.1)
    c.text(58, 113, "標準：AIが意味の対応を確認", 19.3, True, "blue_ink", max_width=535)
    c.rect(58, 151, 535, 70, "blue", "blue_line", radius=10, width=1.1)
    c.text(74, 164, "Business Design → Check Item", 17.65, True, "blue_ink", max_width=503)
    c.text(74, 196, "期待結果を現在の業務の意味から導けるか", 14.9, color="blue_ink", max_width=503)
    c.rect(58, 235, 535, 70, "green", "green_line", radius=10, width=1.1)
    c.text(74, 248, "Check Item → Test assertion", 17.65, True, "green_ink", max_width=503)
    c.text(74, 280, "条件・期待結果を十分に検証しているか", 14.9, color="green_ink", max_width=503)
    c.text(326, 330, "検証根拠の不足 ≠ 業務の意味の未決", 16.55, True, "muted", center=True, max_width=535)
    c.rect(39, 388, 574, 324, radius=13, width=1.1)
    c.text(58, 405, "任意：限定的なdrift pilot", 19.3, True, "yellow_ink", max_width=535)
    c.text(58, 442, "Business Design source / Check body", 15.45, color="muted", max_width=535)
    c.text(58, 469, "fingerprintを比較", 14.9, color="muted", max_width=535)
    for x, title in [(58, "前回の整合確認時"), (354, "現在")]:
        c.rect(x, 505, 239, 52, "gray", "line", radius=8, width=1.1)
        c.text(x + 119.5, 517, title, 16.55, True, center=True, max_width=215)
        c.text(x + 119.5, 539, "fingerprint", 13.8, color="muted", center=True, max_width=215)
    c.text(326, 520, "≠", 21, True, "yellow_ink", center=True)
    c.arrow(326, 565, 588, color="yellow_ink", width=1.65)
    c.rect(58, 595, 535, 63, "yellow", "yellow_line", radius=8, width=1.1)
    c.text(326, 607, "不一致 → 再確認候補", 19.3, True, "yellow_ink", center=True, max_width=503)
    c.text(326, 635, "誤りが確定したわけではない", 15.45, color="yellow_ink", center=True, max_width=503)
    c.text(326, 680, "対応形式を限定した任意PoC", 14.9, color="muted", center=True, max_width=535)
    return c


def model(lang):
    if lang == "ja":
        return model_ja()
    ja = lang == "ja"
    c = Canvas(808)
    c.title("業務の意味と検証をつなぐ" if ja else "Trace meaning in both directions",
            "概念モデル：多対多の追跡関係" if ja else "Conceptual model · many-to-many relationships")
    c.rect(24, 107, 592, 677, radius=14)
    entity(c, 127, 143, "Business Design", "document", badge="SSOT")
    c.text(66, 194, "Activity名（例：予約を受け付ける）" if ja
           else "Activity name: e.g. “Accept a booking”", 20, max_width=507)
    c.text(66, 231, "人が読める記述で参照。固定IDは不要" if ja
           else "Readable references; no fixed ID required", 19, color="muted", max_width=507)
    relation(c, 278, 329, "根拠" if ja else "Source")
    entity(c, 338, 185, "Check Item", "check", fill="blue", ink="blue_ink",
           badge="安定ID  CK-01" if ja else "Stable ID  CK-01")
    c.text(66, 406, "条件 ＋ 独立してレビューできる期待結果" if ja
           else "Condition + one reviewable expected result", 20, max_width=507)
    c.text(66, 447, "根拠：Activity / Procedure / Result" if ja
           else "Source: Activity / Procedure / Result", 19, color="muted", max_width=507)
    c.text(66, 481, "検証根拠：代表Test / assertion" if ja
           else "Evidence: representative Test / assertion", 19, color="muted", max_width=507)
    relation(c, 531, 582, "検証根拠" if ja else "Test evidence")
    entity(c, 591, 118, "Automated Test", "play", fill="green", ink="green_ink")
    c.text(66, 662, "Checkの条件・期待結果をassertionで検証" if ja
           else "Assertions verify the Check’s condition + result", 19, max_width=507)
    c.text(320, 738, "Check Itemが双方向の追跡を中継する" if ja
           else "Check Items connect the references both ways", 20, True,
           "green_ink", max_width=540, center=True)
    return c


def execution(lang):
    if lang == "ja":
        return execution_ja()
    ja = lang == "ja"
    c = Canvas(823)
    c.title("Testが実行でCodeを検証する" if ja else "Tests verify Code by execution",
            "恒久トレーサビリティはTestまで" if ja else "Permanent traceability ends at Test")
    c.rect(24, 107, 592, 331, radius=14)
    c.text(48, 125, "保守する追跡関係" if ja else "Maintained traceability", 21, True, "muted")
    for y, title, kind, fill, ink in [(166, "Business Design", "document", "gray", "ink"),
                                      (260, "Check Item", "check", "blue", "blue_ink"),
                                      (354, "Automated Test", "play", "green", "green_ink")]:
        c.rect(48, y, 544, 58, fill, "line")
        c.icon(kind, 68, y + 16, ink if ink != "ink" else "muted")
        c.text(108, y + 15, title, 24, True, ink)
    c.arrow(320, 230, 253, True)
    c.arrow(320, 324, 347, True)
    c.dashed(40, 294, 460)
    c.dashed(346, 600, 460)
    c.arrow(320, 421, 514, color="green_ink", width=2.5)
    c.text(344, 468, "実行して検証" if ja else "Execute + verify", 22, True, "green_ink", max_width=250)
    c.rect(48, 523, 544, 118, "gray", "line")
    c.icon("code", 68, 541)
    c.text(108, 539, "Code", 25, True)
    c.text(68, 585, "file / symbol / SQL / line", 20, color="muted", max_width=504)
    c.text(68, 614, "物理位置の対応表は保守しない" if ja
           else "No permanent physical-location map", 18, color="muted", max_width=504)
    c.text(48, 665, "レビュー時は実行経路やリポジトリを探索" if ja
           else "Review explores current runtime paths / repository", 19, color="muted", max_width=544)
    c.text(48, 695, "必要なときだけ調べる。一時的な診断として扱う" if ja
           else "Temporary diagnosis, only when needed", 19, color="muted", max_width=544)
    c.rect(48, 738, 544, 63, "yellow", "yellow_line", radius=10)
    c.text(64, 749, "passだけでは、Checkを証明できない" if ja
           else "Passing alone does not prove a Check", 21, True, "yellow_ink", max_width=513)
    c.text(64, 778, "assertionが条件・期待結果まで確認していること" if ja
           else "Assertions must cover its condition + expected result", 18, color="yellow_ink", max_width=513)
    return c


def drift(lang):
    if lang == "ja":
        return drift_ja()
    ja = lang == "ja"
    c = Canvas(878)
    c.title("変更後も意味の対応を確かめる" if ja else "Check alignment after changes",
            "標準レビューと任意のdrift pilot" if ja else "Standard review and an optional drift pilot")
    c.rect(24, 107, 592, 340, radius=14)
    c.text(48, 126, "標準：AIが意味の対応を確認" if ja
           else "Standard: AI reviews meaning", 24, True, "blue_ink", max_width=544)
    c.rect(48, 175, 544, 89, "blue", "blue_line", radius=10)
    c.text(66, 189, "Business Design → Check Item", 23, True, "blue_ink", max_width=507)
    c.text(66, 229, "期待結果を現在の業務の意味から導けるか" if ja
           else "Does this expectation follow from current meaning?", 19, color="blue_ink", max_width=507)
    c.rect(48, 281, 544, 89, "green", "green_line", radius=10)
    c.text(66, 295, "Check Item → Test assertion", 23, True, "green_ink", max_width=507)
    c.text(66, 335, "条件・期待結果を十分に検証しているか" if ja
           else "Does the assertion cover the condition and result?", 19, color="green_ink", max_width=507)
    c.text(320, 393, "検証根拠の不足 ≠ 業務の意味の未決" if ja
           else "Evidence gaps ≠ undecided business meaning", 20, True,
           "muted", center=True, max_width=546)
    c.rect(24, 471, 592, 383, radius=14)
    c.text(48, 490, "任意：限定的なdrift pilot" if ja
           else "Optional: bounded drift pilot", 24, True, "yellow_ink", max_width=544)
    c.text(48, 536, "Business Design source / Check body", 20, color="muted", max_width=544)
    c.text(48, 568, "fingerprintを比較" if ja else "Compare fingerprints", 19, color="muted", max_width=544)
    c.rect(48, 609, 242, 66, "gray", "line", radius=10)
    c.rect(350, 609, 242, 66, "gray", "line", radius=10)
    c.text(169, 622, "前回の整合確認時" if ja else "Last reconciled", 20, True,
           center=True, max_width=218)
    c.text(169, 651, "fingerprint", 17, color="muted", center=True, max_width=218)
    c.text(471, 622, "現在" if ja else "Current", 20, True, center=True, max_width=218)
    c.text(471, 651, "fingerprint", 17, color="muted", center=True, max_width=218)
    c.text(320, 629, "≠", 26, True, "yellow_ink", center=True)
    c.arrow(320, 684, 707, color="yellow_ink")
    c.rect(48, 716, 544, 85, "yellow", "yellow_line", radius=10)
    c.text(320, 730, "不一致 → 再確認候補" if ja else "Changed → recheck candidate", 24, True,
           "yellow_ink", center=True, max_width=512)
    c.text(320, 768, "誤りが確定したわけではない" if ja else "A mismatch is not a proven defect", 20,
           color="yellow_ink", center=True, max_width=512)
    c.text(320, 820, "対応形式を限定した任意PoC" if ja else "Opt-in PoC with a restricted input format", 19,
           color="muted", center=True, max_width=548)
    return c


def main():
    global FONT_DIR
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--font-dir", type=Path, default=Path("/usr/share/fonts/opentype/noto"))
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).resolve().parent.parent)
    args = parser.parse_args()
    FONT_DIR = args.font_dir
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for name, render in [("model", model), ("execution", execution), ("drift", drift)]:
        for lang in ["ja", "en"]:
            path = args.output_dir / f"traceability-{name}.{lang}.png"
            render(lang).save(path)
            print(path)


if __name__ == "__main__":
    main()
