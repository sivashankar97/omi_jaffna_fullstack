#!/usr/bin/env python3
"""Convert GenerateImage JPGs in Cursor assets → transparent PNG portraits."""
from pathlib import Path
import io
from rembg import remove
from PIL import Image

assets = Path("/Users/anu/.cursor/projects/Users-anu-Projects-omi-jaffna-cms/assets")
out = Path("/Users/anu/Projects/omi-jaffna-cms/site/public/priests/portraits")
src = Path("/Users/anu/Downloads/background_removed")
out.mkdir(parents=True, exist_ok=True)

sources = {}
for p in sorted(src.glob("*.png")):
    num = p.name.split(" ", 1)[0]
    if num.isdigit():
        sources[int(num)] = p.name

converted = 0
for jpg in sorted(assets.glob("*.jpg")):
    stem = jpg.stem
    num_s = stem.split("-", 1)[0]
    if not num_s.isdigit():
        continue
    num = int(num_s)
    if num not in sources:
        print("no source for", num, jpg.name)
        continue
    dest = out / sources[num]
    if dest.exists() and dest.stat().st_mtime >= jpg.stat().st_mtime:
        continue
    print("rembg", jpg.name, "→", dest.name, flush=True)
    cut = remove(jpg.read_bytes())
    Image.open(io.BytesIO(cut)).save(dest, "PNG")
    converted += 1

print(f"converted={converted} portraits={len(list(out.glob('*.png')))}")
