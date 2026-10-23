"""Lossless runtime variants only. Originals are immutable; no resizing/cropping.
Optional tooling: python3 -m pip install Pillow. The JS build needs only Node.
"""
import io,json,hashlib
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent.parent
file=root/'assets/manifest.json'
m=json.loads(file.read_text());saved=0
for a in m['resources'].values():
    source=root/a['source']
    if a['mime']!='image/png' or a.get('compression'):continue
    raw=source.read_bytes()
    with Image.open(io.BytesIO(raw)) as image:
        original=image.convert('RGBA');out=io.BytesIO()
        original.save(out,format='WEBP',lossless=True,exact=True,method=6)
        data=out.getvalue()
        with Image.open(io.BytesIO(data)) as check:
            if check.size!=original.size or check.convert('RGBA').tobytes()!=original.tobytes():
                print('Keep original (pixel comparison):',a['id']);continue
        if len(data)>=len(raw):continue
        target='assets/runtime/'+a['id']+'.webp'
        (root/target).write_bytes(data)
        a.update(runtime=target,runtimeMime='image/webp',runtimeBytes=len(data),runtimeSha256=hashlib.sha256(data).hexdigest(),pixelEquality=True,width=original.width,height=original.height)
        saved+=len(raw)-len(data)
file.write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')
print('Lossless bytes saved:',saved)
