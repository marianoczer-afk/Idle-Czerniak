"""Isolated fixtures: never rewrite the project's artwork/manifest."""
import hashlib,json,shutil,subprocess,tempfile,unittest
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
class OptimizerTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
        (self.root/'scripts').mkdir();(self.root/'assets/runtime').mkdir(parents=True)
        shutil.copy(ROOT/'scripts/optimize-assets.py',self.root/'scripts/optimize-assets.py')
        self.source=self.root/'assets/source.png'
        Image.new('RGBA',(128,128),(30,80,100,255)).save(self.source,compress_level=0)
        self.manifest=self.root/'assets/manifest.json'
        self.manifest.write_text(json.dumps({'resources':{'fixture':{'id':'fixture','mime':'image/png','source':'assets/source.png','runtime':'assets/source.png','sha256':hashlib.sha256(self.source.read_bytes()).hexdigest()}}}))
        self.run_optimizer()
    def tearDown(self):self.tmp.cleanup()
    def run_optimizer(self):
        import sys
        return subprocess.run([sys.executable,str(self.root/'scripts/optimize-assets.py')],capture_output=True,text=True,check=True).stdout
    def test_verified_variant_skips_encoding_and_manifest_write(self):
        before=self.manifest.read_bytes();stamp=self.manifest.stat().st_mtime_ns
        self.assertIn('skipped: 1',self.run_optimizer())
        self.assertEqual(before,self.manifest.read_bytes());self.assertEqual(stamp,self.manifest.stat().st_mtime_ns)
    def test_corrupt_runtime_is_rebuilt(self):
        a=json.loads(self.manifest.read_text())['resources']['fixture'];runtime=self.root/a['runtime'];runtime.write_bytes(b'corrupt')
        self.assertIn('skipped: 0',self.run_optimizer())
        a=json.loads(self.manifest.read_text())['resources']['fixture'];self.assertEqual(hashlib.sha256(runtime.read_bytes()).hexdigest(),a['runtimeSha256'])
    def test_missing_runtime_is_rebuilt(self):
        a=json.loads(self.manifest.read_text())['resources']['fixture'];runtime=self.root/a['runtime'];runtime.unlink()
        self.assertIn('skipped: 0',self.run_optimizer());self.assertTrue(runtime.exists())
    def test_changed_source_is_not_a_cache_hit(self):
        Image.new('RGBA',(128,128),(150,50,30,255)).save(self.source,compress_level=0)
        self.assertIn('skipped: 0',self.run_optimizer())
if __name__=='__main__':unittest.main()
