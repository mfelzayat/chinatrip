#!/usr/bin/env python3
"""Resize all JPG/PNG in assets/images to max 1200px wide, JPEG q=82.
Saves ~70-80% file size with no visible quality loss for web display."""

import os
from pathlib import Path
from PIL import Image

DIR = Path("/opt/mfz-pa/projects/chinatrip/assets/images")
MAX_WIDTH = 1200
QUALITY = 82

before_total = 0
after_total = 0
count = 0

for path in sorted(DIR.iterdir()):
    if not path.suffix.lower() in (".jpg", ".jpeg", ".png"):
        continue
    before = path.stat().st_size
    before_total += before
    try:
        img = Image.open(path)
        # Convert palette/RGBA to RGB for JPEG
        if img.mode in ("RGBA", "P", "LA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "RGBA":
                bg.paste(img, mask=img.split()[3])
            else:
                bg.paste(img.convert("RGBA"), mask=img.convert("RGBA").split()[3])
            img = bg
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Resize if wider than MAX_WIDTH
        if img.width > MAX_WIDTH:
            new_h = int(img.height * MAX_WIDTH / img.width)
            img = img.resize((MAX_WIDTH, new_h), Image.LANCZOS)

        # Always save as .jpg (rename .png if needed for consistency)
        out_path = path.with_suffix(".jpg")
        img.save(out_path, "JPEG", quality=QUALITY, optimize=True, progressive=True)

        # If we converted .png → .jpg, remove the original .png
        if path.suffix.lower() == ".png" and out_path != path:
            path.unlink()

        after = out_path.stat().st_size
        after_total += after
        count += 1
        print(f"  {out_path.name}: {before//1024} KB → {after//1024} KB ({100*after/before:.0f}%)")
    except Exception as e:
        print(f"  ✗ {path.name}: {e}")

print(f"\n{count} images: {before_total/1024/1024:.1f} MB → {after_total/1024/1024:.1f} MB ({100*after_total/before_total:.0f}%)")
