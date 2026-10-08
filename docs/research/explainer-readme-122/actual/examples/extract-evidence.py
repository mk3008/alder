from pathlib import Path
import json

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
for item in json.loads((HERE / 'source-evidence.json').read_text()):
    text = (REPO / item['path']).read_text()
    if item['text'] not in text:
        raise SystemExit(f"引用不一致: {item['id']} ({item['path']})")
    print(f"{item['id']}: {item['text']}")
