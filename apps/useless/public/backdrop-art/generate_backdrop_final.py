#!/usr/bin/env python3
"""
Corrupted Commerce - Final Masterpiece
Museum-quality digital artifact of retail entropy
Meticulously crafted with painstaking attention to every detail
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops, ImageEnhance
import random
import math

# Canvas dimensions
WIDTH = 1920
HEIGHT = 1080

# Refined color palette
VOID_BLACK = (5, 5, 8)
ELECTRIC_GREEN = (0, 255, 65)
MAGENTA = (255, 0, 128)
CYAN = (0, 200, 255)
DIM_GREEN = (0, 45, 18)
DIM_MAGENTA = (45, 0, 30)
GHOST_GREEN = (0, 20, 8)
FAINT_GREEN = (0, 12, 5)

# Fonts
FONT_DIR = "/home/matt/.claude/skills/canvas-design/canvas-fonts"
MONO_FONT = f"{FONT_DIR}/JetBrainsMono-Regular.ttf"
PIXEL_FONT = f"{FONT_DIR}/Silkscreen-Regular.ttf"
TECH_FONT = f"{FONT_DIR}/Tektur-Regular.ttf"
GEIST_MONO = f"{FONT_DIR}/GeistMono-Regular.ttf"

PRODUCTS = [
    "USELESS", "NOTHING", "VOID", "NULL", "ERROR", "TOASTER",
    "WIFI", "ROCK", "CLOUD", "INVISIBLE", "SILENCE", "EMPTY",
    "ZERO", "STATIC", "GLITCH", "CORRUPT", "DECAY", "ENTROPY"
]

MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ"

def create_base():
    """Deep void with radial gradient and noise"""
    img = Image.new('RGB', (WIDTH, HEIGHT), VOID_BLACK)
    pixels = img.load()

    cx, cy = WIDTH // 2, HEIGHT // 2
    max_dist = math.sqrt(cx**2 + cy**2)

    for y in range(HEIGHT):
        for x in range(WIDTH):
            dist = math.sqrt((x - cx)**2 + (y - cy)**2)
            factor = 1 - (dist / max_dist) * 0.25
            pixels[x, y] = (
                int(5 + 6 * factor),
                int(5 + 8 * factor),
                int(8 + 12 * factor)
            )

    # Dense noise
    for _ in range(100000):
        x, y = random.randint(0, WIDTH-1), random.randint(0, HEIGHT-1)
        r, g, b = pixels[x, y]
        n = random.randint(-6, 6)
        pixels[x, y] = (max(0, r + n), max(0, g + n + random.randint(0, 2)), max(0, b + n))

    return img

def add_scanlines(img):
    """Multi-layer CRT scanlines"""
    draw = ImageDraw.Draw(img)
    pixels = img.load()

    # Fine scanlines
    for y in range(0, HEIGHT, 2):
        for x in range(WIDTH):
            r, g, b = pixels[x, y]
            pixels[x, y] = (int(r * 0.88), int(g * 0.88), int(b * 0.88))

    # Medium lines
    for y in range(0, HEIGHT, 4):
        draw.line([(0, y), (WIDTH, y)], fill=(3, 3, 5))

    # Thick accent lines
    for y in range(0, HEIGHT, 28):
        if random.random() > 0.35:
            draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0))
            if random.random() > 0.5:
                draw.line([(0, y+1), (WIDTH, y+1)], fill=(0, 0, 0))

    return img

def draw_barcode(draw, x, y, w, h, color, glitch=0.2):
    """Precision barcode with controlled glitch"""
    cx = x
    while cx < x + w:
        bar_w = random.choice([2, 2, 3, 4, 2])
        gap = random.choice([1, 2, 1, 2])

        if random.random() > 0.25:
            ox = random.randint(-6, 6) if random.random() < glitch else 0
            bh = h if random.random() > glitch * 0.5 else int(h * random.uniform(0.75, 1.1))

            if random.random() < 0.12:
                draw.rectangle([cx + ox + 2, y, cx + bar_w + ox + 2, y + bh], fill=(color[0], 0, 0))
                draw.rectangle([cx + ox - 2, y, cx + bar_w + ox - 2, y + bh], fill=(0, 0, min(200, color[1] + 40)))

            draw.rectangle([cx + ox, y, cx + bar_w + ox, y + bh], fill=color)

        cx += bar_w + gap

def draw_cart(draw, cx, cy, size, color, corrupt=0):
    """Shopping cart icon with corruption"""
    body = [
        (cx - size * 0.35, cy - size * 0.15),
        (cx + size * 0.45, cy - size * 0.15),
        (cx + size * 0.35, cy + size * 0.25),
        (cx - size * 0.25, cy + size * 0.25),
    ]

    if corrupt > 0:
        body = [(p[0] + random.uniform(-corrupt, corrupt) * 3,
                 p[1] + random.uniform(-corrupt, corrupt) * 2) for p in body]

    if corrupt > 0.4:
        off = int(corrupt * 3)
        draw.polygon([(p[0] + off, p[1]) for p in body], outline=(color[0], 0, 0), width=1)
        draw.polygon([(p[0] - off, p[1]) for p in body], outline=(0, color[1] // 2, min(255, color[1])), width=1)

    draw.polygon(body, outline=color, width=2)
    draw.line([(cx - size * 0.45, cy - size * 0.35), (cx - size * 0.35, cy - size * 0.15)], fill=color, width=2)

    wy = cy + size * 0.35
    r = max(3, int(size * 0.08))
    draw.ellipse([cx - size * 0.2 - r, wy - r, cx - size * 0.2 + r, wy + r], outline=color, width=2)
    draw.ellipse([cx + size * 0.2 - r, wy - r, cx + size * 0.2 + r, wy + r], outline=color, width=2)

def create_dense_matrix(w, h, font_path):
    """Dense matrix rain layer"""
    layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    try:
        f_s = ImageFont.truetype(font_path, 10)
        f_m = ImageFont.truetype(font_path, 13)
        f_l = ImageFont.truetype(font_path, 16)
    except:
        f_s = f_m = f_l = ImageFont.load_default()

    for col_x in range(0, w, 22):
        x = col_x + random.randint(-4, 4)

        if random.random() > 0.55:
            word = random.choice(PRODUCTS)
            chars = list(word)
        else:
            chars = [random.choice(MATRIX_CHARS) for _ in range(random.randint(10, 30))]

        start_y = random.randint(-180, h - 80)
        spacing = random.randint(13, 18)

        for i, char in enumerate(chars):
            y = start_y + i * spacing
            if y < -15 or y > h + 15:
                continue

            progress = i / len(chars)
            brightness = 0.12 + progress * 0.65

            if i == len(chars) - 1:
                font = f_l
                color = (255, 255, 255, 255)
            else:
                font = f_s if progress < 0.4 else f_m
                if random.random() > 0.93:
                    color = (int(255 * brightness), int(40 * brightness),
                             int(120 * brightness), int(190 * brightness))
                else:
                    color = (int(25 * brightness), int(255 * brightness),
                             int(70 * brightness), int(170 * brightness))

            if random.random() > 0.92:
                draw.text((x - 1, y), char, font=font, fill=(255, 0, 0, 50))
                draw.text((x + 1, y), char, font=font, fill=(0, 0, 255, 50))

            draw.text((x, y), char, font=font, fill=color)

    return layer

def add_glitch_bands(img, intensity=0.9):
    """Horizontal glitch displacement"""
    pixels = img.load()
    result = img.copy()
    rp = result.load()

    for _ in range(int(14 * intensity)):
        y_start = random.randint(0, HEIGHT - 1)
        band_h = random.randint(2, int(12 * intensity))
        x_off = random.randint(int(-35 * intensity), int(35 * intensity))

        for y in range(y_start, min(y_start + band_h, HEIGHT)):
            row = [pixels[x, y] for x in range(WIDTH)]
            for x in range(WIDTH):
                rp[x, y] = row[(x - x_off) % WIDTH]

            if random.random() > 0.55:
                tint = random.choice(['r', 'c', 'm'])
                for x in range(WIDTH):
                    r, g, b = rp[x, y]
                    if tint == 'r':
                        rp[x, y] = (min(255, r + 22), g, b)
                    elif tint == 'c':
                        rp[x, y] = (r, min(255, g + 12), min(255, b + 18))
                    else:
                        rp[x, y] = (min(255, r + 18), g, min(255, b + 12))

    return result

def chromatic_aberration(img, offset=2):
    """RGB channel split"""
    r, g, b = img.split()
    r = ImageChops.offset(r, offset, 0)
    b = ImageChops.offset(b, -offset, 0)
    return Image.merge('RGB', (r, g, b))

def add_watermark(img, font_path):
    """Large USELESS watermark as foundation"""
    overlay = Image.new('RGBA', (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    try:
        font_huge = ImageFont.truetype(font_path, 320)
        font_med = ImageFont.truetype(font_path, 160)
    except:
        font_huge = ImageFont.load_default()
        font_med = font_huge

    text = "USELESS"
    bbox = draw.textbbox((0, 0), text, font=font_huge)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (WIDTH - tw) // 2
    y = (HEIGHT - th) // 2 - 60

    # Deep layers
    draw.text((x, y), text, font=font_huge, fill=(0, 25, 12, 6))
    draw.text((x - 8, y), text, font=font_huge, fill=(60, 0, 30, 5))
    draw.text((x + 8, y), text, font=font_huge, fill=(0, 15, 50, 5))
    draw.text((x, y), text, font=font_huge, fill=(0, 55, 22, 10))

    # ".io" subtitle
    io = ".io"
    io_bbox = draw.textbbox((0, 0), io, font=font_med)
    io_x = (WIDTH - (io_bbox[2] - io_bbox[0])) // 2
    draw.text((io_x, y + th + 15), io, font=font_med, fill=(0, 35, 15, 8))

    img = img.convert('RGBA')
    return Image.alpha_composite(img, overlay).convert('RGB')

def add_elements(img, pixel_font, mono_font):
    """Commerce elements with intentional composition"""
    draw = ImageDraw.Draw(img)

    try:
        f_sm = ImageFont.truetype(pixel_font, 10)
        f_pr = ImageFont.truetype(pixel_font, 14)
        f_ref = ImageFont.truetype(mono_font, 8)
    except:
        f_sm = f_pr = f_ref = ImageFont.load_default()

    # Zone-based cart placement
    zones = [
        ((50, WIDTH // 3), (30, HEIGHT // 4), (18, 32), 0.25, [GHOST_GREEN, FAINT_GREEN]),
        ((WIDTH // 3, WIDTH * 2 // 3), (HEIGHT // 4, HEIGHT * 3 // 4), (28, 55), 0.6, [DIM_GREEN, DIM_MAGENTA, ELECTRIC_GREEN, MAGENTA]),
        ((WIDTH * 2 // 3, WIDTH - 50), (30, HEIGHT // 3), (20, 38), 0.35, [DIM_GREEN, GHOST_GREEN]),
        ((40, WIDTH // 2), (HEIGHT * 3 // 4, HEIGHT - 40), (22, 42), 0.45, [DIM_GREEN, DIM_MAGENTA]),
        ((WIDTH // 2, WIDTH - 60), (HEIGHT * 2 // 3, HEIGHT - 50), (25, 45), 0.5, [DIM_MAGENTA, DIM_GREEN]),
    ]

    for (x_range, y_range, size_range, corrupt_max, colors) in zones:
        count = random.randint(4, 8)
        for _ in range(count):
            x = random.randint(x_range[0], x_range[1])
            y = random.randint(y_range[0], y_range[1])
            size = random.randint(size_range[0], size_range[1])
            color = random.choice(colors)
            draw_cart(draw, x, y, size, color, corrupt=random.uniform(0, corrupt_max))

    # Barcode clusters
    bc_zones = [
        (0, WIDTH // 3, 0, HEIGHT // 3, 5),
        (WIDTH * 2 // 3, WIDTH - 80, HEIGHT // 4, HEIGHT * 2 // 3, 6),
        (WIDTH // 4, WIDTH * 3 // 4, HEIGHT * 2 // 3, HEIGHT - 30, 7),
        (50, WIDTH // 2, HEIGHT // 3, HEIGHT // 2, 4),
    ]

    for (x1, x2, y1, y2, count) in bc_zones:
        for _ in range(count):
            x = random.randint(x1, x2 - 100)
            y = random.randint(y1, y2 - 45)
            w, h = random.randint(65, 130), random.randint(22, 45)

            if random.random() > 0.45:
                color = ELECTRIC_GREEN if random.random() > 0.35 else MAGENTA
            else:
                color = tuple(c // 2 for c in (ELECTRIC_GREEN if random.random() > 0.5 else MAGENTA))

            draw_barcode(draw, x, y, w, h, color, glitch=random.uniform(0.12, 0.38))

            if random.random() > 0.45:
                label = random.choice(["$0.00", "NULL", "ERR", "N/A", "∅", "void", "#NaN", "---"])
                draw.text((x, y + h + 2), label, font=f_sm, fill=color)

    # Price tags
    prices = ["$∞", "$0.00", "$NaN", "FREE*", "$???", "¤0", "$.NULL", "$-1", "$(void)", "$ERR"]
    for _ in range(random.randint(14, 20)):
        x, y = random.randint(45, WIDTH - 90), random.randint(45, HEIGHT - 45)
        price = random.choice(prices)
        color = ELECTRIC_GREEN if random.random() > 0.32 else MAGENTA

        if random.random() > 0.55:
            draw.text((x - 2, y), price, font=f_pr, fill=(color[0], 0, 0))
            draw.text((x + 2, y), price, font=f_pr, fill=(0, 0, min(200, color[1] + 40)))

        draw.text((x, y), price, font=f_pr, fill=color)

    # Reference markers
    markers = [
        (12, 12, "SYS://RETAIL.ERR"),
        (WIDTH - 105, 12, "NODE_0x00FF"),
        (12, HEIGHT - 22, "SECTOR.NULL"),
        (WIDTH - 80, HEIGHT - 22, "v0.0.0"),
    ]
    for mx, my, txt in markers:
        draw.text((mx, my), txt, font=f_ref, fill=DIM_GREEN)

    # Grid ticks
    for i in range(0, WIDTH, WIDTH // 12):
        draw.line([(i, 0), (i, 6)], fill=DIM_GREEN)
        draw.line([(i, HEIGHT - 6), (i, HEIGHT)], fill=DIM_GREEN)
    for i in range(0, HEIGHT, HEIGHT // 8):
        draw.line([(0, i), (6, i)], fill=DIM_GREEN)
        draw.line([(WIDTH - 6, i), (WIDTH, i)], fill=DIM_GREEN)

    return img

def vignette(img, strength=0.38):
    """Radial vignette"""
    pixels = img.load()
    cx, cy = WIDTH // 2, HEIGHT // 2
    max_d = math.sqrt(cx**2 + cy**2)

    for y in range(HEIGHT):
        for x in range(0, WIDTH, 2):
            d = math.sqrt((x - cx)**2 + (y - cy)**2)
            if d > max_d * 0.45:
                f = (d - max_d * 0.45) / (max_d * 0.55)
                f = min(1, f * strength)
                r, g, b = pixels[x, y]
                v = (int(r * (1 - f)), int(g * (1 - f)), int(b * (1 - f)))
                pixels[x, y] = v
                if x + 1 < WIDTH:
                    pixels[x + 1, y] = v

    return img

def polish(img):
    """Final enhancement"""
    img = ImageEnhance.Contrast(img).enhance(1.06)
    img = ImageEnhance.Sharpness(img).enhance(1.04)
    return img

def main():
    random.seed(42)  # Reproducibility
    print("=" * 55)
    print("  CORRUPTED COMMERCE - Final Museum-Quality Masterpiece")
    print("=" * 55)

    print("  [1/10] Crafting void gradient base...")
    img = create_base()

    print("  [2/10] Embedding ghostly USELESS watermark...")
    img = add_watermark(img, TECH_FONT)

    print("  [3/10] Layering CRT scanlines...")
    img = add_scanlines(img)

    print("  [4/10] Generating dense matrix rain...")
    rain = create_dense_matrix(WIDTH, HEIGHT, GEIST_MONO)
    img = Image.alpha_composite(img.convert('RGBA'), rain).convert('RGB')

    print("  [5/10] Second matrix layer for depth...")
    rain2 = create_dense_matrix(WIDTH, HEIGHT, MONO_FONT)
    rain2 = rain2.point(lambda p: int(p * 0.5))  # Dimmer
    img = Image.alpha_composite(img.convert('RGBA'), rain2).convert('RGB')

    print("  [6/10] Placing commerce elements...")
    img = add_elements(img, PIXEL_FONT, MONO_FONT)

    print("  [7/10] Applying glitch displacement...")
    img = add_glitch_bands(img, intensity=0.85)

    print("  [8/10] Chromatic aberration...")
    img = chromatic_aberration(img, offset=2)

    print("  [9/10] Vignette focus...")
    img = vignette(img, strength=0.32)

    print("  [10/10] Final polish...")
    img = polish(img)

    # Top scanline overlay
    draw = ImageDraw.Draw(img)
    for y in range(0, HEIGHT, 3):
        if random.random() > 0.72:
            draw.line([(0, y), (WIDTH, y)], fill=(0, 0, 0))

    out = "/home/matt/projects/useless-io/public/backdrop-art/useless-glitch-backdrop.png"
    img.save(out, "PNG", optimize=True)

    print("=" * 55)
    print(f"  Masterpiece saved: {out}")
    print(f"  Dimensions: {WIDTH}x{HEIGHT}")
    print("=" * 55)

if __name__ == "__main__":
    main()
