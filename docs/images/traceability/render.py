#!/usr/bin/env python3
"""Render the three bilingual README traceability diagrams deterministically.

Run from any directory:
    python docs/images/traceability/render.py

Requires Pillow and Noto Sans CJK JP (regular and bold TTC files). The default
font directory is the Debian/Ubuntu fonts-noto-cjk location; --font-dir can
select another installation. Rendering performs no network access. Each source
canvas is 640 logical pixels wide; checked-in PNGs are rendered at 2x for sharp
README display at width=640. All text is checked against its allotted width.
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
                              size * SUPERSAMPLE, index=0)


class Canvas:
    def __init__(self, height: int):
        self.height = height
        self.im = Image.new("RGB", (WIDTH * SUPERSAMPLE, height * SUPERSAMPLE), P["bg"])
        self.draw = ImageDraw.Draw(self.im)

    def rect(self, x, y, w, h, fill="white", outline="line", radius=12, width=1):
        box = tuple(round(v * SUPERSAMPLE) for v in (x, y, x + w, y + h))
        self.draw.rounded_rectangle(box, radius=radius * SUPERSAMPLE,
                                    fill=P.get(fill, fill), outline=P.get(outline, outline),
                                    width=round(width * SUPERSAMPLE))

    def line(self, xy, color="arrow", width=1.6):
        self.draw.line([(round(x * SUPERSAMPLE), round(y * SUPERSAMPLE)) for x, y in xy],
                       fill=P.get(color, color), width=round(width * SUPERSAMPLE), joint="curve")

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
                       fill=P[color], font=face, anchor="lt")

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


def recorded_relation(c, top, bottom, label, heading, lines):
    """Solid N:M relation beside a dashed explanatory note, not another edge."""
    c.arrow(96, top, bottom, True)
    c.text(78, top + 1, "N", 18, True, "muted", center=True)
    c.text(78, bottom - 20, "M", 18, True, "muted", center=True)
    c.text(134, top + 3, label, 20, color="muted", max_width=442)
    x, y, w, h = 134, top + 35, 458, 142
    c.rect(x, y, w, h, "gray", "gray", radius=8)
    for xx in range(x + 8, x + w - 8, 12):
        for yy in [y, y + h]:
            c.line([(xx, yy), (min(xx + 6, x + w - 8), yy)], "arrow", 1)
    for yy in range(y + 8, y + h - 8, 12):
        for xx in [x, x + w]:
            c.line([(xx, yy), (xx, min(yy + 6, y + h - 8))], "arrow", 1)
    c.text(x + 16, y + 13, heading, 19, True, "blue_ink", max_width=w - 32)
    for i, line in enumerate(lines):
        c.text(x + 16, y + 46 + i * 28, line, 18, max_width=w - 32)


def model_ja():
    c = Canvas(1198)
    c.title("成果物の相関", "多対多の相関（実線）と、対応の記録（点線枠）")
    c.rect(24, 107, 592, 1067, radius=14)
    entity(c, 127, 176, "Business Design", "document", badge="SSOT",
           center_header=True, green_badge=True)
    c.text(66, 194, "識別キー：文書内のActivity名", 20, True, max_width=507)
    c.text(66, 230, "例：予約を受け付ける", 19, color="muted", max_width=507)
    c.text(66, 268, "業務の手順・入出力・結果を記した文書", 19, max_width=507)
    recorded_relation(c, 311, 503, "期待結果を導く", "記録①  Check作成時", [
        "AIが文書・Activityへの参照を",
        "同じCheck IDの詳細に保存",
        "新規Testへの参照はまだない",
    ])
    entity(c, 512, 176, "Check Item", "check", fill="blue", ink="blue_ink",
           center_header=True)
    c.text(66, 579, "識別キー：Check ID（安定キー）", 20, True,
           color="blue_ink", max_width=507)
    c.text(66, 615, "例：CK-01", 19, color="muted", max_width=507)
    c.text(66, 653, "独立して確認できる、条件と期待結果", 19, max_width=507)
    recorded_relation(c, 696, 888, "期待結果を検証", "記録②  Test実行・レビュー後", [
        "更新依頼を受けたAIが",
        "Test／assertionへの参照を",
        "同じCheck IDの詳細に保存",
    ])
    entity(c, 897, 176, "Automated Test", "play", fill="green", ink="green_ink",
           center_header=True)
    c.text(66, 964, "識別キー：既存のTest名／ID", 20, True,
           color="green_ink", max_width=507)
    c.text(66, 1000, "例：test_accept_booking", 19, color="muted", max_width=507)
    c.text(66, 1038, "条件・期待結果をコードの実行で確かめる", 19, max_width=507)
    c.text(320, 1099, "TestからCheck Itemを経由して、", 20, True,
           "green_ink", max_width=540, center=True)
    c.text(320, 1131, "業務設計書（SSOT）まで遡れる", 20, True,
           "green_ink", max_width=540, center=True)
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
