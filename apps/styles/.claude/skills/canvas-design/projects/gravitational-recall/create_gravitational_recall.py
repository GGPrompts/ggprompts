#!/usr/bin/env python3
"""
Gravitational Recall - A visual study of memory as physical force
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random

# Canvas dimensions - poster size
WIDTH = 2400
HEIGHT = 3200
DPI = 300

# Color palette - clinical and restrained
BG_COLOR = (12, 15, 25)  # Deep void
PRIMARY_FIELD = (220, 225, 235)  # Cool white
SECONDARY_FIELD = (140, 150, 165)  # Medium gray
TERTIARY_FIELD = (70, 80, 95)  # Dark gray
WARM_ACCENT = (205, 145, 95)  # Warm zone
COOL_ACCENT = (85, 135, 175)  # Cool zone

# Create canvas
img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Load fonts
font_path_mono = "/home/matt/projects/claudekit-skills/.claude/skills/canvas-design/canvas-fonts/GeistMono-Regular.ttf"
font_path_sans = "/home/matt/projects/claudekit-skills/.claude/skills/canvas-design/canvas-fonts/InstrumentSans-Regular.ttf"

try:
    font_small = ImageFont.truetype(font_path_mono, 24)
    font_tiny = ImageFont.truetype(font_path_mono, 18)
    font_label = ImageFont.truetype(font_path_sans, 28)
except:
    font_small = ImageFont.load_default()
    font_tiny = ImageFont.load_default()
    font_label = ImageFont.load_default()

# Define memory centers (gravitational wells)
memory_centers = [
    {"x": 800, "y": 1200, "mass": 180, "type": "warm"},  # Dense childhood memory
    {"x": 1600, "y": 1000, "mass": 140, "type": "cool"},  # Fading memory
    {"x": 1200, "y": 2100, "mass": 120, "type": "neutral"},  # Recent memory
    {"x": 1800, "y": 2500, "mass": 90, "type": "warm"},  # Small dense memory
    {"x": 600, "y": 2600, "mass": 100, "type": "cool"},  # Distant memory
]

# Function to calculate field strength at a point
def field_strength(x, y, center):
    dx = x - center["x"]
    dy = y - center["y"]
    dist = math.sqrt(dx*dx + dy*dy)
    if dist < 1:
        dist = 1
    return center["mass"] / (dist * 0.5)

# Draw field lines emanating from each center
def draw_field_lines(draw, center, num_lines=36):
    for i in range(num_lines):
        angle = (i / num_lines) * 2 * math.pi
        points = []

        # Start from center
        x = center["x"] + math.cos(angle) * 20
        y = center["y"] + math.sin(angle) * 20

        # Trace field line outward
        for step in range(150):
            points.append((int(x), int(y)))

            # Calculate gradient direction (away from center)
            dx = x - center["x"]
            dy = y - center["y"]
            dist = math.sqrt(dx*dx + dy*dy)

            if dist > 600:  # Field line fades out
                break

            # Move along field line
            step_size = 3 + (dist / 100)
            x += (dx / dist) * step_size
            y += (dy / dist) * step_size

            # Add slight curve based on other centers
            for other in memory_centers:
                if other != center:
                    odx = other["x"] - x
                    ody = other["y"] - y
                    odist = math.sqrt(odx*odx + ody*ody)
                    if odist > 1:
                        influence = other["mass"] / (odist * 2)
                        x += (odx / odist) * influence * 0.3
                        y += (ody / odist) * influence * 0.3

        # Draw line with fading opacity
        if len(points) > 2:
            for i in range(len(points) - 1):
                alpha = int(255 * (1 - i / len(points)) * 0.3)
                color = center["type"]
                if color == "warm":
                    c = WARM_ACCENT
                elif color == "cool":
                    c = COOL_ACCENT
                else:
                    c = SECONDARY_FIELD

                line_color = (c[0], c[1], c[2], alpha) if alpha > 20 else None
                if line_color and alpha > 20:
                    draw.line([points[i], points[i+1]], fill=(c[0], c[1], c[2]), width=1)

# Draw field lines for each memory center
for center in memory_centers:
    draw_field_lines(draw, center)

# Draw density map - accumulated marks showing field intensity
random.seed(42)  # Reproducible
for _ in range(15000):
    x = random.randint(100, WIDTH-100)
    y = random.randint(100, HEIGHT-100)

    # Calculate total field strength at this point
    total_strength = sum(field_strength(x, y, c) for c in memory_centers)

    # Probability of placing a mark based on field strength
    if random.random() < (total_strength / 150):
        # Determine color based on nearest center type
        nearest = min(memory_centers, key=lambda c: math.sqrt((x-c["x"])**2 + (y-c["y"])**2))

        if nearest["type"] == "warm":
            color = WARM_ACCENT
        elif nearest["type"] == "cool":
            color = COOL_ACCENT
        else:
            color = TERTIARY_FIELD

        # Tiny mark
        size = random.randint(1, 3)
        opacity = int(random.randint(40, 120))
        draw.ellipse([x, y, x+size, y+size], fill=(color[0], color[1], color[2]))

# Draw memory centers themselves - dense circular regions
for center in memory_centers:
    # Core
    radius = center["mass"] / 3

    # Draw concentric circles suggesting density
    for r in range(int(radius), 0, -8):
        alpha = int(255 * (r / radius) * 0.4)
        if center["type"] == "warm":
            c = WARM_ACCENT
        elif center["type"] == "cool":
            c = COOL_ACCENT
        else:
            c = PRIMARY_FIELD

        draw.ellipse(
            [center["x"]-r, center["y"]-r, center["x"]+r, center["y"]+r],
            outline=(c[0], c[1], c[2]),
            width=2
        )

    # Dense core
    core_r = 12
    if center["type"] == "warm":
        c = WARM_ACCENT
    elif center["type"] == "cool":
        c = COOL_ACCENT
    else:
        c = PRIMARY_FIELD
    draw.ellipse(
        [center["x"]-core_r, center["y"]-core_r, center["x"]+core_r, center["y"]+core_r],
        fill=(c[0], c[1], c[2])
    )

# Draw coordinate grid - subtle reference system
grid_color = (50, 55, 65)
for x in range(200, WIDTH, 400):
    draw.line([(x, 150), (x, HEIGHT-150)], fill=grid_color, width=1)
for y in range(400, HEIGHT, 400):
    draw.line([(150, y), (WIDTH-150, y)], fill=grid_color, width=1)

# Add axis markers and labels - clinical notation
label_color = SECONDARY_FIELD

# Vertical axis labels
for i, y in enumerate(range(400, HEIGHT, 400)):
    label = f"{i*400}"
    draw.text((100, y-10), label, fill=label_color, font=font_tiny)

# Horizontal axis labels
for i, x in enumerate(range(200, WIDTH, 400)):
    label = f"{i*400}"
    draw.text((x-20, HEIGHT-120), label, fill=label_color, font=font_tiny)

# Add measurement annotations near memory centers
annotations = [
    {"center": 0, "label": "M₁", "offset": (80, -80)},
    {"center": 1, "label": "M₂", "offset": (90, -70)},
    {"center": 2, "label": "M₃", "offset": (-100, 70)},
    {"center": 3, "label": "M₄", "offset": (80, 60)},
    {"center": 4, "label": "M₅", "offset": (-90, -60)},
]

for ann in annotations:
    center = memory_centers[ann["center"]]
    x = center["x"] + ann["offset"][0]
    y = center["y"] + ann["offset"][1]

    # Draw subtle line to center
    draw.line([(center["x"], center["y"]), (x, y)], fill=TERTIARY_FIELD, width=1)

    # Label
    draw.text((x, y-15), ann["label"], fill=label_color, font=font_small)

    # Mass value
    mass_label = f"m={center['mass']}"
    draw.text((x, y+10), mass_label, fill=TERTIARY_FIELD, font=font_tiny)

# Title - minimal, positioned precisely
title_text = "GRAVITATIONAL RECALL"
title_bbox = draw.textbbox((0, 0), title_text, font=font_label)
title_width = title_bbox[2] - title_bbox[0]
title_x = (WIDTH - title_width) // 2
draw.text((title_x, 120), title_text, fill=PRIMARY_FIELD, font=font_label)

# Subtitle - whispered
subtitle_text = "A Study in Memorial Dynamics"
subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=font_tiny)
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
subtitle_x = (WIDTH - subtitle_width) // 2
draw.text((subtitle_x, 175), subtitle_text, fill=TERTIARY_FIELD, font=font_tiny)

# Save high-quality output
img.save("/home/matt/projects/claudekit-skills/gravitational-recall.png", dpi=(DPI, DPI))
print("✓ Artwork created: gravitational-recall.png")
