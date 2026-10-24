"""Measure opaque pixels at each cutout edge without modifying artwork."""
import json
from pathlib import Path
from PIL import Image
import numpy as np
root=Path(__file__).resolve().parent.parent
p=json.loads((root/'arte/produccion-estable31.json').read_text());m=json.loads((root/'assets/manifest.json').read_text());rows=[]
for e in p['entries']:
 if not e['kind'].startswith('hud-'):continue
 r=m['resources'][e['assetId']];a=np.array(Image.open(root/r['source']).convert('RGBA'))[:,:,3];x,y,w,h=e['bounds'];v=a[y:y+h,x:x+w];edges=[int((v[0]>180).sum()),int((v[-1]>180).sum()),int((v[:,0]>180).sum()),int((v[:,-1]>180).sum())];rows.append({'id':e['id'],'kind':e['kind'],'sourceSha256':r['sha256'],'bounds':e['bounds'],'opaqueEdgePixels':edges})
(root/'arte/verificacion/estable31/encuadres-alfa.json').write_text(json.dumps(rows,indent=2)+'\n')
bad=[r for r in rows if sum(r['opaqueEdgePixels'])];print(json.dumps({'checked':len(rows),'touchingEdges':bad},indent=2));assert not bad
