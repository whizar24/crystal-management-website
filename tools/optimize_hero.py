from PIL import Image
import os

src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets", "images"))

# center_x, width/height ratio for mobile portrait crop
focus = {
    "cms-hero-1.jpg": (0.58, 3 / 4),
    "cms-hero-2.jpg": (0.50, 3 / 4),
    "cms-hero-3.jpg": (0.50, 1.0),  # square — keep both handshake subjects
    "cms-hero-4.jpg": (0.54, 4 / 5),
}

for name, (fx, target_ratio) in focus.items():
    path = os.path.join(src_dir, name)
    im = Image.open(path).convert("RGB")
    w, h = im.size

    desk = im.copy()
    desk.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
    desk_path = os.path.join(src_dir, name.replace(".jpg", ".webp"))
    desk.save(desk_path, "WEBP", quality=76, method=6)

    crop_w = min(w, int(h * target_ratio))
    cx = int(w * fx)
    left = max(0, min(w - crop_w, cx - crop_w // 2))
    box = (left, 0, left + crop_w, h)

    mob = im.crop(box)
    mob.thumbnail((900, 1200), Image.Resampling.LANCZOS)
    mob_path = os.path.join(src_dir, name.replace(".jpg", "-mobile.webp"))
    mob.save(mob_path, "WEBP", quality=74, method=6)

    print(
        name,
        "desk",
        desk.size,
        os.path.getsize(desk_path) // 1024,
        "KB",
        "| mob",
        mob.size,
        os.path.getsize(mob_path) // 1024,
        "KB",
    )
