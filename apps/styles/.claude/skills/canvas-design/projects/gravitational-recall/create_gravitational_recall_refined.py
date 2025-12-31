#!/usr/bin/env python3
"""
Gravitational Recall - REFINED VERSION
A visual study of memory as physical force
Enhanced with master-level craftsmanship
"""

import math
import random

WIDTH = 2400
HEIGHT = 3200

# Refined color palette - more sophisticated
BG_COLOR = "rgb(8, 12, 22)"
PRIMARY_FIELD = "rgb(225, 228, 235)"
SECONDARY_FIELD = "rgb(155, 162, 175)"
TERTIARY_FIELD = "rgb(85, 92, 105)"
WARM_ACCENT = "rgb(215, 152, 105)"
COOL_ACCENT = "rgb(95, 142, 185)"
GRID_COLOR = "rgb(42, 48, 62)"
FAINT_GRID = "rgb(28, 32, 42)"

# Memory centers - more refined positioning
memory_centers = [
    {"x": 750, "y": 1150, "mass": 185, "type": "warm", "label": "M₁"},
    {"x": 1650, "y": 950, "mass": 145, "type": "cool", "label": "M₂"},
    {"x": 1150, "y": 2150, "mass": 125, "type": "neutral", "label": "M₃"},
    {"x": 1850, "y": 2450, "mass": 95, "type": "warm", "label": "M₄"},
    {"x": 550, "y": 2650, "mass": 105, "type": "cool", "label": "M₅"},
]

def field_strength(x, y, center):
    dx = x - center["x"]
    dy = y - center["y"]
    dist = math.sqrt(dx*dx + dy*dy)
    return center["mass"] / (dist * 0.5 + 1)

def get_color(center_type):
    return {"warm": WARM_ACCENT, "cool": COOL_ACCENT, "neutral": SECONDARY_FIELD}[center_type]

# Start SVG with refined styling
svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="{WIDTH}" height="{HEIGHT}" xmlns="http://www.w3.org/2000/svg">
<defs>
    <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
    </filter>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:rgb(225,228,235);stop-opacity:0.8"/>
        <stop offset="100%" style="stop-color:rgb(225,228,235);stop-opacity:0"/>
    </radialGradient>
</defs>
<rect width="{WIDTH}" height="{HEIGHT}" fill="{BG_COLOR}"/>
'''

# Fine grid system - multiple layers
# Outermost grid
for x in range(0, WIDTH+1, 800):
    svg += f'<line x1="{x}" y1="0" x2="{x}" y2="{HEIGHT}" stroke="{FAINT_GRID}" stroke-width="0.5" opacity="0.3"/>\n'
for y in range(0, HEIGHT+1, 800):
    svg += f'<line x1="0" y1="{y}" x2="{WIDTH}" y2="{y}" stroke="{FAINT_GRID}" stroke-width="0.5" opacity="0.3"/>\n'

# Medium grid
for x in range(200, WIDTH, 400):
    svg += f'<line x1="{x}" y1="120" x2="{x}" y2="{HEIGHT-120}" stroke="{GRID_COLOR}" stroke-width="1" opacity="0.4"/>\n'
for y in range(350, HEIGHT, 400):
    svg += f'<line x1="120" y1="{y}" x2="{WIDTH-120}" y2="{y}" stroke="{GRID_COLOR}" stroke-width="1" opacity="0.4"/>\n'

# Fine grid near memory centers
for center in memory_centers:
    cx, cy = center["x"], center["y"]
    for r in range(50, 300, 50):
        svg += f'<circle cx="{cx}" cy="{cy}" r="{r}" stroke="{FAINT_GRID}" stroke-width="0.5" fill="none" opacity="0.15"/>\n'

# Field lines - more refined and varied
for center in memory_centers:
    color = get_color(center["type"])
    num_lines = 48  # More lines for smoother field

    for i in range(num_lines):
        angle = (i / num_lines) * 2 * math.pi
        # Vary starting distance for visual interest
        start_dist = 25 + (i % 3) * 5
        x = center["x"] + math.cos(angle) * start_dist
        y = center["y"] + math.sin(angle) * start_dist

        path_points = [(x, y)]

        for step in range(180):
            dx = x - center["x"]
            dy = y - center["y"]
            dist = math.sqrt(dx*dx + dy*dy)

            if dist > 650:
                break

            step_size = 2.5 + (dist / 120)
            x += (dx / dist) * step_size
            y += (dy / dist) * step_size

            # More sophisticated multi-body influence
            for other in memory_centers:
                if other != center:
                    odx = other["x"] - x
                    ody = other["y"] - y
                    odist = math.sqrt(odx*odx + ody*ody)
                    if odist > 1:
                        influence = other["mass"] / (odist * 1.8)
                        x += (odx / odist) * influence * 0.25
                        y += (ody / odist) * influence * 0.25

            path_points.append((x, y))

        if len(path_points) > 10:
            # Create smooth path
            path = "M " + " L ".join([f"{p[0]:.1f},{p[1]:.1f}" for p in path_points])
            # Vary opacity based on angle for depth
            opacity = 0.15 + (math.sin(angle * 4) * 0.08)
            svg += f'<path d="{path}" stroke="{color}" stroke-width="1.2" fill="none" opacity="{opacity:.2f}"/>\n'

# Enhanced density field - more sophisticated distribution
random.seed(42)
density_groups = {"warm": [], "cool": [], "neutral": []}

for _ in range(18000):  # More particles
    x = random.randint(80, WIDTH-80)
    y = random.randint(80, HEIGHT-80)

    total_strength = sum(field_strength(x, y, c) for c in memory_centers)

    # Non-linear probability for more interesting distribution
    probability = min(1.0, (total_strength / 140) ** 1.3)

    if random.random() < probability:
        nearest = min(memory_centers, key=lambda c: math.sqrt((x-c["x"])**2 + (y-c["y"])**2))
        color = get_color(nearest["type"])

        # Vary particle size based on field strength
        local_strength = field_strength(x, y, nearest)
        size = 1 + min(2, local_strength / 60)
        opacity = min(0.6, 0.2 + local_strength / 200)

        density_groups[nearest["type"]].append(
            f'<circle cx="{x}" cy="{y}" r="{size:.1f}" fill="{color}" opacity="{opacity:.2f}"/>'
        )

# Render density by type for better layering
for group_type in ["cool", "neutral", "warm"]:
    svg += f'<g id="density-{group_type}">\n'
    svg += "\n".join(density_groups[group_type])
    svg += '</g>\n'

# Memory centers - refined concentric structure
for center in memory_centers:
    radius = center["mass"] / 2.8
    color = get_color(center["type"])

    # Outer glow
    svg += f'<circle cx="{center["x"]}" cy="{center["y"]}" r="{radius*1.2}" fill="url(#centerGlow)" opacity="0.1"/>\n'

    # Concentric rings with varying weight
    ring_spacings = [radius, radius*0.85, radius*0.68, radius*0.5, radius*0.35, radius*0.22]
    for i, r in enumerate(ring_spacings):
        if r > 5:
            opacity = 0.3 + (i * 0.08)
            width = 2 if i < 3 else 1.5
            svg += f'<circle cx="{center["x"]}" cy="{center["y"]}" r="{r}" stroke="{color}" stroke-width="{width}" fill="none" opacity="{opacity:.2f}"/>\n'

    # Dense core with gradient
    svg += f'<circle cx="{center["x"]}" cy="{center["y"]}" r="14" fill="{color}" opacity="0.9"/>\n'
    svg += f'<circle cx="{center["x"]}" cy="{center["y"]}" r="8" fill="{PRIMARY_FIELD}" opacity="0.4"/>\n'

# Sophisticated annotations with connection lines
annotations = [
    {"center": 0, "offset": (95, -85), "anchor": "start"},
    {"center": 1, "offset": (100, -75), "anchor": "start"},
    {"center": 2, "offset": (-110, 75), "anchor": "end"},
    {"center": 3, "offset": (95, 65), "anchor": "start"},
    {"center": 4, "offset": (-100, -65), "anchor": "end"},
]

for i, ann in enumerate(annotations):
    center = memory_centers[ann["center"]]
    x = center["x"] + ann["offset"][0]
    y = center["y"] + ann["offset"][1]

    # Connection line with refined styling
    svg += f'<line x1="{center["x"]}" y1="{center["y"]}" x2="{x}" y2="{y}" stroke="{TERTIARY_FIELD}" stroke-width="0.8" opacity="0.6" stroke-dasharray="3,2"/>\n'

    # Label box background for readability
    svg += f'<rect x="{x-5 if ann["anchor"]=="start" else x-70}" y="{y-30}" width="75" height="55" fill="{BG_COLOR}" opacity="0.7" rx="2"/>\n'

    # Label and mass
    svg += f'<text x="{x}" y="{y-10}" fill="{SECONDARY_FIELD}" font-family="monospace" font-size="22" text-anchor="{ann["anchor"]}" font-weight="300">{center["label"]}</text>\n'
    svg += f'<text x="{x}" y="{y+12}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="16" text-anchor="{ann["anchor"]}">m={center["mass"]}</text>\n'

    # Coordinate reference
    svg += f'<text x="{x}" y="{y+30}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="13" text-anchor="{ann["anchor"]}" opacity="0.5">({center["x"]},{center["y"]})</text>\n'

# Axis labels - refined typography
for i, y in enumerate(range(350, HEIGHT, 400)):
    label = f"{(i+1)*400:04d}"
    svg += f'<text x="75" y="{y+5}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="16" text-anchor="end" opacity="0.5">{label}</text>\n'

for i, x in enumerate(range(200, WIDTH, 400)):
    label = f"{i*400:04d}"
    svg += f'<text x="{x}" y="{HEIGHT-75}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="16" text-anchor="middle" opacity="0.5">{label}</text>\n'

# Border frame for refinement
margin = 50
svg += f'<rect x="{margin}" y="{margin}" width="{WIDTH-2*margin}" height="{HEIGHT-2*margin}" stroke="{GRID_COLOR}" stroke-width="1" fill="none" opacity="0.3"/>\n'

# Title - more sophisticated typography
title_y = 90
svg += f'<text x="{WIDTH/2}" y="{title_y}" fill="{PRIMARY_FIELD}" font-family="sans-serif" font-size="32" text-anchor="middle" letter-spacing="4" font-weight="300">GRAVITATIONAL RECALL</text>\n'

# Subtitle with refined positioning
svg += f'<text x="{WIDTH/2}" y="{title_y+45}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="17" text-anchor="middle" letter-spacing="1" opacity="0.7">A Study in Memorial Dynamics</text>\n'

# Footer notation - scientific reference
footer_y = HEIGHT - 60
svg += f'<text x="{WIDTH/2}" y="{footer_y}" fill="{TERTIARY_FIELD}" font-family="monospace" font-size="14" text-anchor="middle" opacity="0.4">Field Study № 01  ·  2025</text>\n'

svg += '</svg>'

# Save refined version
with open("/home/matt/projects/claudekit-skills/gravitational-recall-refined.svg", "w") as f:
    f.write(svg)

print("✓ Refined artwork created: gravitational-recall-refined.svg")
