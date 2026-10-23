"""Rebuild Estable 28 non-destructive viewports from preserved original sheets. No image generation."""
import json,hashlib,io
from pathlib import Path
from PIL import Image
r=Path(__file__).resolve().parent.parent;p=json.loads((r/'arte/produccion-estable27.json').read_text());m=json.loads((r/'assets/manifest.json').read_text());jobs=json.loads((r/'arte/generacion28.json').read_text())
fish=[e['id'] for e in p['entries'] if e['kind']=='fish'];zones=['muelle','rio','costa','laguna','arrecife','abismo','manglar','glaciar','volcan','santuario','ruinas_sumergidas','cavernas_cristal','abismo_primordial']
p['entries']=[e for e in p['entries'] if e['kind']!='fish'];used={e['sheetId'] for e in p['entries']};p['sheets']=[s for s in p['sheets'] if s['id'] in used]
rows=[[0,274,550,824,1118,1536],[0,278,542,815,1122,1536],[0,269,531,792,1132,1536],[0,292,583,840,1156,1536],[0,258,520,822,1126,1536]]
for j in jobs:
 b=(r/j['original']).read_bytes();im=Image.open(io.BytesIO(b)).convert('RGB');w,h=im.size;k=j['name'];aid='image-'+hashlib.sha256(b).hexdigest()[:16];src='assets/originals/'+aid+'.png';runtime='assets/runtime/'+aid+'.webp';(r/src).write_bytes(b);o=io.BytesIO();im.save(o,format='WEBP',quality=90,method=6);opt=o.getvalue();(r/runtime).write_bytes(opt)
 m['resources'][aid]=dict(id=aid,mime='image/png',source=src,runtime=runtime,bytes=len(b),sha256=hashlib.sha256(b).hexdigest(),originalPrefix='data:image/png;base64,',encoding='base64',runtimeMime='image/webp',runtimeBytes=len(opt),runtimeSha256=hashlib.sha256(opt).hexdigest(),width=w,height=h,compression=dict(type='WebP lossy',quality=90),references=1)
 sid='art28-sheet-'+k;p['sheets'].append(dict(id=sid,assetId=aid,width=w,height=h))
 if k.startswith('fish'):
  ids=fish[int(k[-1])*10:(int(k[-1])+1)*10];kinds=['fish']*10
  bounds=rows[int(k[-1])]
 elif k=='medals28-a':ids=zones[:8];kinds=['medal']*8;bounds=[0,373,730,1097,h]
 elif k=='medals28-b':ids=zones[8:]+['quest-delivery','quest-weight','quest-exploration'];kinds=['medal']*5+['ui']*3;bounds=[0,360,731,1105,h]
 else:ids=['collection-award','trophy-header','shop-header','record-award'];kinds=['ui']*4;bounds=[0,632,h]
 for i,(entity,kind) in enumerate(zip(ids,kinds)):
  row=i//2;box=[i%2*(w//2),bounds[row],w//2,bounds[row+1]-bounds[row]]
  p['entries'].append(dict(id=entity,kind=kind,symbol='art28-'+kind+'-'+entity,sheetId=sid,assetId=aid,bounds=box,status='generated-integrated',review='Encuadres revisados; valoración artística final pendiente del usuario'))
 print(k,im.size,bounds,len(opt))
p.update(build='estable-28');(r/'arte/produccion-estable28.json').write_text(json.dumps(p,ensure_ascii=False,indent=2)+'\n');(r/'assets/manifest.json').write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
