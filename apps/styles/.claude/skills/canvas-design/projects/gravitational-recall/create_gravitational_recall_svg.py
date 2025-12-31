#!/usr/bin/env python3
"""
Gravitational Recall - A visual study of memory as physical force (SVG version)
"""

import math
import random

# Canvas dimensions
WIDTH = 2400
HEIGHT = 3200

# Color palette
BG_COLOR = "rgb(12, 15, 25)"
PRIMARY_FIELD = "rgb(220, 225, 235)"
SECONDARY_FIELD = "rgb(140, 150, 165)"
TERTIARY_FIELD = "rgb(70, 80, 95)"
WARM_ACCENT = "rgb(205, 145, 95)"
COOL_ACCENT = "rgb(85, 135, 175)"
GRID_COLOR = "rgb(50, 55, 65)"

# Memory centers
memory_centers = [
    {"x": 800, "y": 1200, "mass": 180, "type": "warm"},
    {"x": 1600, "y": 1000, "mass": 140, "type": "cool"},
    {"x": 1200, "y": 2100, "mass": 120, "type": "neutral"},
    {"x": 1800, "y": 2500, "mass": 90, "type": "warm"},
    {"x": 600, "y": 2600, "mass": 100, "type": "cool"},
]

def field_strength(x, y, center):
    dx = x - center["x"]
    dy = y - center["y"]
    dist = math.sqrt(dx*dx + dy*dy)
    if dist < 1:
        dist = 1
    return center["mass"] / (dist * 0.5)

def get_color(center_type):
    if center_type == "warm":
        return WARM_ACCENT
    elif center_type == "cool":
        return COOL_ACCENT
    else:
        return SECONDARY_FIELD

# Start SVG
svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{WIDTH}" height="{HEIGHT}" xmlns="http://www.w3.org/2000/svg">
<rect width="{WIDTH}" height="{HEIGHT}" fill="{BG_COLOR}"/>
'''

# Draw coordinate grid
for x in range(200, WIDTH, 400):
    svg += f'<line x1="{x}" y1="150" x2="{x}" y2="{HEIGHT-150}" stroke="{GRID_COLOR}" stroke-width="1"/>\n'
for y in range(400, HEIGHT, 400):
    svg += f'<line x1="150" y1="{y}" x2="{WIDTH-150}" y2="{y}" stroke="{GRID_COLOR}" stroke-width="1"/>\n'

# Draw field lines
for center in memory_centers:
    color = get_color(center["type"])
    num_lines = 36

    for i in range(num_lines):
        angle = (i / num_lines) * 2 * math.pi
        x = center["x"] + math.cos(angle) * 20
        y = center["y"] + math.sin(angle) * 20

        path_points = []
        for step in range(150):
            path_points.append(f"{x:.1f},{y:.1f}")

            dx = x - center["x"]
            dy = y - center["y"]
            dist = math.sqrt(dx*dx + dy*dy)

            if dist > 600:
                break

            step_size = 3 + (dist / 100)
            x += (dx / dist) * step_size
            y += (dy / dist) * step_size

            # Influence from other centers
            for other in memory_centers:
                if other != center:
                    odx = other["x"] - x
                    ody = other["y"] - y
                    odist = math.sqrt(odx*odx + ody*ody)
                    if odist > 1:
                        influence = other["mass"] / (odist * 2)
                        x += (odx / odist) * influence * 0.3
                        y += (ody / odist) * influence * 0.3

        if len(path_points) > 2:
            path = "M " + " L ".join(path_points)
            svg += f'<path d="{path}" stroke="{color}" stroke-width="1" fill="none" opacity="0.25"/>\n'

# Draw density map
random.seed(42)
density_marks = []
for _ in range(15000):
    x = random.randint(100, WIDTH-100)
    y = random.randint(100, HEIGHT-100)

    total_strength = sum(field_strength(x, y, c) for c in memory_centers)

    if random.random() < (total_strength / 150):
        nearest = min(memory_centers, key=lambda c: math.sqrt((x-c["x"])**2 + (y-c["y"])**2))
        color = get_color(nearest["type"])
        size = random.randint(1, 3)
        opacity = random.randint(40, 120) / 255.0
        density_marks.append(f'<circle cx="{x}" cy="{y}" r="{size}" fill="{color}" opacity="{opacity:.2f}"/>')

svg += "".join(density_marks)

# Draw memory centers - concentric circles
for center in memory_centers:
    radius = center["mass"] / 3
    color = get_color(center["type"])

    for r in range(int(radius), 0, -8):
        opacity = (r / radius) * 0.4
        svg += f'<circle cx="{center["x"]}" cy="{center["y"]}" r="{r}" stroke="{color}" stroke-width="2" fill="none" opacity="{opacity:.2f}"/>\n'

    # Dense core
    svg += f'<circle cx="{center["x"]}" cy="{center["y"]}" r="12" fill="{color}"/>\n'

# Add axis labels
for i, y in enumerate(range(400, HEIGHT, 400)):
    svg += f'<text x="100" y="{y}" fill="{SECONDARY_FIELD}" font-family="monospace" font-size="18" text-anchor="end">{i*400}</text>\n'

for i, x in enumerate(range(200, WIDTH, 400)):
    svg += f'<text x="{x}" y="{HEIGHT-100}" fill="{SECONDARY_FIELD}" font-family="monospace" font-size="18" text-anchor="middle">{i*400}</text>\n'

# Add annotations
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

    svg += f'<line x1="{center["x"]}" y1="{center["y"]}" x2="{x}" y2="{y}" stroke="{TERTIARY_FIELD}" stroke-width="1"/>\n'
    svg += f'<text x="{x}" y="{y}" fill="{SECONDARY_FIELD}" font-family="monospace" font-size="24">{ann["label"]}</text>\n'
    svg += f'<text x="{x}" y="{y+25}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="18">m={center["mass"]}</text>\n'

# Title
svg += f'<text x="{WIDTH/2}" y="140" fill="{PRIMARY_FIELD}" font-family="sans-serif" font-size="28" text-anchor="middle" letter-spacing="2">GRAVITATIONAL RECALL</text>\n'
svg += f'<text x="{WIDTH/2}" y="180" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="18" text-anchor="middle">A Study in Memorial Dynamics</text>\n'

# Close SVG
svg += '</svg>'

# Save
with open("/home/matt/projects/claudekit-skills/gravitational-recall.svg", "w") as f:
    f.write(svg)

print("✓ Artwork created: gravitational-recall.svg")
