# Optimized image derivatives

These files are build-time derivatives of the originals in the parent
`images/` folder, generated for web delivery: resized so the longest edge is
at most 1920px and re-encoded as progressive JPEG at quality 78. The
supplied original files are never modified, renamed, or deleted — the
originals average 5-22MB each, which would violate the 3-second load
requirement (NFR-1) if served directly. The site's data modules import from
this `optimized/` folder; the parent folder's originals remain the
source-of-record for reprinting, cropping, or higher-resolution use.

Regenerate with:

```bash
cd frontend/src/assets/images
python3 -c "
from PIL import Image
import os

MAX_DIM = 1920
for f in sorted(os.listdir('.')):
    if not f.lower().endswith(('.jpg', '.jpeg')):
        continue
    with Image.open(f) as im:
        im = im.convert('RGB')
        w, h = im.size
        scale = min(1.0, MAX_DIM / max(w, h))
        resized = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
        resized.save(os.path.join('optimized', f), 'JPEG', quality=78, optimize=True, progressive=True)
"
```
