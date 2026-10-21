"""Fixed MD trial parser; uses the same pinned importer, not a general migration."""
from pathlib import Path
import json,sys
import import_fixture as imp
parts=Path(sys.argv[1]).read_text().split('\n\n# --- PoC文書境界 ---\n\n')
assert len(parts)==3
one,names=imp.bd(parts[0],'bd-current','6e55d98710a1d8757937ea268176929abcf49b2e')
two,oldnames=imp.bd(parts[1],'bd-check-source','9b4a3cbffe835cfa9c6a8ec7d602d9611a1a0285')
check=imp.checkdoc(parts[2],two,oldnames)
print(json.dumps(dict(format='alder-typed-storage-poc',formatVersion='0.2-poc',revision='package-import-1',documents=[one,two,check],archives=[],diagnostics=[]),ensure_ascii=False))
