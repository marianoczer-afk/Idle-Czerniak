"""Create a deterministic, offline single-file ZIP from the verified build."""
import hashlib,json,re,subprocess,zipfile
from pathlib import Path
root=Path(__file__).resolve().parent.parent
subprocess.run(['node','scripts/build.cjs','--check'],cwd=root,check=True)
data=(root/'index.html').read_bytes();version=re.search(rb'name="argentum-build" content="(estable-\d+)"',data)[1].decode();folder=root/'descargas';folder.mkdir(exist_ok=True);target=folder/('argentum-idle-'+version.replace('estable-','estable')+'.zip')
entry=zipfile.ZipInfo('index.html',(1980,1,1,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED;entry.external_attr=0o644<<16
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:archive.writestr(entry,data,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
with zipfile.ZipFile(target) as archive:
 assert archive.namelist()==['index.html'];assert archive.testzip() is None;assert archive.read('index.html')==data
info={'build':version,'htmlBytes':len(data),'htmlSha256':hashlib.sha256(data).hexdigest(),'zipFile':target.name,'zipBytes':target.stat().st_size,'zipSha256':hashlib.sha256(target.read_bytes()).hexdigest(),'contents':['index.html'],'selfContained':True}
(folder/(version.replace('estable-','estable')+'.json')).write_text(json.dumps(info,indent=2)+'\n');print(json.dumps(info,indent=2))
