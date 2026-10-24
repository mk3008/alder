"""Wrap the unchanged Vite output for offline review; no product deployment."""
import base64,gzip,hashlib,json
from pathlib import Path

root=Path(__file__).resolve().parent
dist=root.parents[2]/'web-viewer'/'dist'
js=next((dist/'assets').glob('*.js')).read_text()
css=next((dist/'assets').glob('*.css')).read_text()
payload=base64.b64encode(gzip.compress(json.dumps({'script':js,'style':css},ensure_ascii=False).encode(),mtime=0)).decode()
out=root/'rough';out.mkdir(exist_ok=True)
html='''<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Alder Gate C rough Preview</title><div id="app"></div><script type="module">const data=Uint8Array.from(atob("'''+payload+'''"),c=>c.charCodeAt(0));const content=JSON.parse(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))).text());const style=document.createElement('style');style.textContent=content.style;document.head.append(style);await import(URL.createObjectURL(new Blob([content.script],{type:'text/javascript'})));</script></html>'''
(out/'preview.html').write_text(html)
(out/'build.json').write_text(json.dumps({'base':'b498ddb6a02de44aca6fc27d535febe4cafd0315','stage':'rough; build only; not accepted or regression verified','scriptSha256':hashlib.sha256(js.encode()).hexdigest(),'styleSha256':hashlib.sha256(css.encode()).hexdigest(),'wrapper':'gzip envelope of unchanged built JS/CSS; no data upload or production deployment'},indent=2)+'\n')
