"""Import generated production sheets and non-destructive individual SVG viewports.
No animal/rod is redrawn, stretched or raster-cropped by this tool. One shared
runtime image per sheet; cell boundaries are manually reviewed in the manifest.
Run only when producing art: python3 scripts/import-production-art.py JOBS.json
"""
import json,hashlib,shutil,sys,io
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
jobs=json.loads(Path(sys.argv[1]).read_text());manifest=json.loads((root/'assets/manifest.json').read_text());resources=manifest['resources']
fish={
'art-first':['gobio_runico','nautilo_bronce','congrio_archivo','tetra_prismatico','ajolote_cuarzo','esturion_geoda','isopodo_fosil','quimera_ambar','titan_ammonita','bagre'],
'fish-river':['mojarra','trucha','salmon','pez_espada','carpa_dorada','trucha_arcoiris','pez_fantasma','lucio','anguila','lubina'],
'fish-coast':['atun','mantarraya','perca_esmeralda','cangrejo_azul','koi_imperial','esturion','pez_luna','caballito_mar','morena','tiburon_arrecife'],
'fish-depth':['pez_linternilla','calamar_abismo','pez_cristal','leviatan','sabalo_manglar','pez_arquero','anguila_manglar','tarpon','trucha_alpina','salvelino'],
'fish-legend':['bacalao_hielo','esturion_blanco','pez_lava','mero_obsidiana','pez_escorpion','dragon_mar','carpa_celeste','pez_cometa','raya_aurora','guardian_mareas']}
rows={'art-first': [0, 273, 538, 816, 1096, 1536], 'fish-river': [0, 288, 568, 846, 1155, 1536], 'fish-coast': [0, 271, 544, 801, 1190, 1536], 'fish-depth': [0, 293, 591, 880, 1175, 1536], 'fish-legend': [0, 257, 517, 795, 1043, 1536], 'rods-0': [0, 141, 265, 397, 538, 683, 824, 985, 1132, 1292, 1536], 'rods-1': [0, 154, 285, 414, 550, 699, 849, 991, 1143, 1317, 1536], 'rods-2': [0, 151, 285, 428, 558, 705, 858, 1016, 1170, 1327, 1536], 'rods-3': [0, 137, 277, 414, 550, 695, 837, 989, 1143, 1301, 1536], 'rods-4': [0, 139, 280, 412, 556, 698, 842, 1003, 1162, 1327, 1536]}
inv=json.loads((root/'arte/inventario-estable26.json').read_text());rods=[r['id'] for r in inv['rods'] if r['offered']]
zone_ids=['muelle','rio','costa','laguna','arrecife','abismo','manglar','glaciar','volcan','santuario','ruinas_sumergidas','cavernas_cristal','abismo_primordial']
sheets=[];entries=[]
for job in jobs:
 key=job['key'];data=Path(job['path']).read_bytes();sha=hashlib.sha256(data).hexdigest();asset='image-'+sha[:16];source='assets/originals/'+asset+'.png';runtime='assets/runtime/'+asset+'.webp';(root/source).write_bytes(data)
 with Image.open(io.BytesIO(data)) as im:
  out=io.BytesIO();im.convert('RGB').save(out,format='WEBP',quality=90,method=6);optimized=out.getvalue();(root/runtime).write_bytes(optimized);w,h=im.size
  with Image.open(io.BytesIO(optimized)) as check:assert check.size==im.size
 resources[asset]=dict(id=asset,mime='image/png',source=source,runtime=runtime,bytes=len(data),sha256=sha,originalPrefix='data:image/png;base64,',encoding='base64',runtimeMime='image/webp',runtimeBytes=len(optimized),runtimeSha256=hashlib.sha256(optimized).hexdigest(),width=w,height=h,compression=dict(type='WebP lossy',quality=90),references=1)
 sheet_id='art27-sheet-'+key;sheets.append(dict(id=sheet_id,assetId=asset,width=w,height=h))
 if key.startswith('rods-'):
  ids=rods[int(key[-1])*10:(int(key[-1])+1)*10];kinds=['rod']*10;columns=1;boundaries=rows[key]
 elif key.startswith('zones-'):
  ids=zone_ids[:8] if key=='zones-a' else zone_ids[8:]+['sidebar','cast','water'];kinds=['zone']*8 if key=='zones-a' else ['zone']*5+['ui']*3;columns=2;boundaries=[0,384,768,1152,1536]
 else:ids=fish[key];kinds=['fish']*10;columns=2;boundaries=rows[key]
 for i,(entity,kind) in enumerate(zip(ids,kinds)):
  row=i//columns;bounds=[i%columns*(w//columns),boundaries[row],w//columns,boundaries[row+1]-boundaries[row]]
  entries.append(dict(id=entity,kind=kind,symbol='art27-'+kind+'-'+entity,sheetId=sheet_id,assetId=asset,bounds=bounds,status='generated-integrated',review='Silueta y límites de celda revisados; revisión artística del usuario pendiente'))
(root/'assets/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(root/'arte/produccion-estable27.json').write_text(json.dumps(dict(build='estable-27',method='Individual reviewed non-destructive SVG viewports; shared optimized atlases',sheets=sheets,entries=entries),ensure_ascii=False,indent=2)+'\n')
print('Imported',len(entries),'individual illustrations in',len(sheets),'shared atlases')
