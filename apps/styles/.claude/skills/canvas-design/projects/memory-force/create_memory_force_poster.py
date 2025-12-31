#!/usr/bin/env python3
"""
Memory as Physical Force - Visual Philosophy Expression
A museum-quality poster treating memory as an invisible gravitational field
"""

from PIL import Image, ImageDraw, ImageFont
import math
import random

# Canvas dimensions (high-resolution poster)
WIDTH = 1920
HEIGHT = 2400
DPI = 300  # museum-quality

# Create image with deep navy background
img = Image.new('RGB', (WIDTH, HEIGHT), color=(8, 15, 35))  # Deep navy
draw = ImageDraw.Draw(img, 'RGBA')

# ============================================================================
# DISTORTED GRID - The Visual Language of Invisible Force
# ============================================================================
def draw_distorted_grid():
    """Draw a warped grid revealing invisible pressure points"""
    grid_spacing = 120
    center_x, center_y = WIDTH // 2, HEIGHT // 2 - 200
    max_distance = 900

    # Vertical lines with distortion
    for x in range(-200, WIDTH + 200, grid_spacing):
        points = []
        for y in range(0, HEIGHT + 200, 40):
            # Distance from center determines distortion
            dx = x - center_x
            dy = y - center_y
            distance = math.sqrt(dx*dx + dy*dy)

            # Warping effect - stronger near center
            if distance < max_distance:
                warp_factor = 1 - (distance / max_distance) ** 2
                bend = math.sin(distance * 0.01) * warp_factor * 180
                distorted_x = x + bend
            else:
                distorted_x = x

            points.append((distorted_x, y))

        # Draw with opacity gradient
        for i in range(len(points) - 1):
            p1, p2 = points[i], points[i + 1]
            dist_factor = min(1.0, math.sqrt((p1[0]-center_x)**2 + (p1[1]-center_y)**2) / 600)
            opacity = int(20 * (1 - dist_factor * 0.7))
            draw.line([p1, p2], fill=(100, 140, 180, opacity), width=1)

    # Horizontal lines with distortion
    for y in range(-200, HEIGHT + 200, grid_spacing):
        points = []
        for x in range(0, WIDTH + 200, 40):
            dx = x - center_x
            dy = y - center_y
            distance = math.sqrt(dx*dx + dy*dy)

            if distance < max_distance:
                warp_factor = 1 - (distance / max_distance) ** 2
                bend = math.sin(distance * 0.01) * warp_factor * 180
                distorted_y = y + bend
            else:
                distorted_y = y

            points.append((x, distorted_y))

        for i in range(len(points) - 1):
            p1, p2 = points[i], points[i + 1]
            dist_factor = min(1.0, math.sqrt((p1[0]-center_x)**2 + (p1[1]-center_y)**2) / 600)
            opacity = int(20 * (1 - dist_factor * 0.7))
            draw.line([p1, p2], fill=(100, 140, 180, opacity), width=1)

# ============================================================================
# NEURAL PATHWAYS - Precious Metal Traces
# ============================================================================
def draw_neural_pathways(center_x, center_y):
    """Draw luminous neural pathways as evidence of memory's presence"""
    num_pathways = 8

    for i in range(num_pathways):
        angle = (2 * math.pi * i) / num_pathways
        points = []

        # Create organic, curved pathways
        for distance in range(0, 400, 15):
            # Spiral outward with slight oscillation
            x = center_x + distance * math.cos(angle + distance * 0.01) * 0.9
            y = center_y + distance * math.sin(angle + distance * 0.01) * 0.9
            points.append((x, y))

        # Draw pathway with gradient effect
        for j in range(len(points) - 1):
            p1, p2 = points[j], points[j + 1]
            fade = j / len(points)

            # Gold to platinum gradient
            gold_r, gold_g, gold_b = 255, 200, 80
            platinum_r, platinum_g, platinum_b = 220, 230, 240

            r = int(gold_r + (platinum_r - gold_r) * fade)
            g = int(gold_g + (platinum_g - gold_g) * fade)
            b = int(gold_b + (platinum_b - gold_b) * fade)

            opacity = int(200 * (1 - fade * 0.5))
            draw.line([p1, p2], fill=(r, g, b, opacity), width=3)

# ============================================================================
# ORBITAL ELEMENTS - Memories Held by Invisible Force
# ============================================================================
def draw_orbital_elements(center_x, center_y):
    """Draw spherical fragments in orbital patterns around the memory core"""

    # Primary orbital ring - large spheres
    for i in range(6):
        angle = (2 * math.pi * i) / 6
        radius = 500
        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)

        # Draw sphere with radial gradient effect
        size = 45
        for ring in range(size, 0, -3):
            opacity = int(100 * (1 - ring / size))
            color_val = int(200 + 55 * (ring / size))
            draw.ellipse(
                [x - ring, y - ring, x + ring, y + ring],
                fill=(color_val, color_val - 30, color_val - 80, opacity),
                outline=(255, 200, 80, opacity)
            )

    # Secondary orbital ring - smaller spheres
    for i in range(12):
        angle = (2 * math.pi * i) / 12 + math.pi / 12
        radius = 700
        x = center_x + radius * math.cos(angle)
        y = center_y + radius * math.sin(angle)

        size = 25
        for ring in range(size, 0, -2):
            opacity = int(80 * (1 - ring / size))
            color_val = int(200 + 50 * (ring / size))
            draw.ellipse(
                [x - ring, y - ring, x + ring, y + ring],
                fill=(color_val, color_val - 50, color_val - 100, opacity),
                outline=(220, 230, 240, opacity)
            )

# ============================================================================
# FORCE FIELD LINES - Invisible Pressure Made Visible
# ============================================================================
def draw_force_field_lines(center_x, center_y):
    """Draw subtle field lines suggesting gravitational pull"""
    num_rays = 24

    for i in range(num_rays):
        angle = (2 * math.pi * i) / num_rays

        # Curved field lines radiating outward
        points = []
        for distance in range(100, 1000, 30):
            # Slight curvature to field lines
            curve_angle = angle + math.sin(distance * 0.01) * 0.3
            x = center_x + distance * math.cos(curve_angle)
            y = center_y + distance * math.sin(curve_angle)
            points.append((x, y))

        # Draw with fading opacity
        for j in range(len(points) - 1):
            p1, p2 = points[j], points[j + 1]
            fade = j / len(points)
            opacity = int(40 * (1 - fade))
            draw.line([p1, p2], fill=(180, 200, 220, opacity), width=1)

# ============================================================================
# CORE PRESENCE - Central Focus
# ============================================================================
def draw_core_presence(center_x, center_y):
    """Draw the core from which memory's force emanates"""
    # Concentric luminous rings
    for radius in [180, 140, 100, 60]:
        opacity = int(150 * (1 - radius / 180))
        draw.ellipse(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            outline=(255, 200, 80, opacity),
            width=2
        )

    # Central glowing point
    inner_size = 25
    for ring in range(inner_size, 0, -2):
        opacity = int(180 * (ring / inner_size))
        draw.ellipse(
            [center_x - ring, center_y - ring, center_x + ring, center_y + ring],
            fill=(255, 220, 150, opacity)
        )

# ============================================================================
# TYPOGRAPHY - Minimal Annotations
# ============================================================================
def add_typography():
    """Add sparse, technical labels"""
    # Use a clean sans-serif font if available
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
        label_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 48)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 36)
    except:
        title_font = ImageFont.load_default()
        label_font = ImageFont.load_default()
        small_font = ImageFont.load_default()

    # Main title - subtle positioning
    title_text = "MEMORY"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    draw.text(
        ((WIDTH - title_width) // 2, 200),
        title_text,
        fill=(220, 200, 160, 200),
        font=title_font
    )

    # Subtitle - technical annotation
    subtitle = "A FIELD OF FORCE"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=label_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    draw.text(
        ((WIDTH - subtitle_width) // 2, 350),
        subtitle,
        fill=(150, 170, 200, 150),
        font=label_font
    )

    # Side annotations - like scientific labels
    annotations = [
        ("gravitational", 100, 800, small_font),
        ("distortion", WIDTH - 500, 1200, small_font),
        ("presence", 150, 2000, small_font),
    ]

    for text, x, y, font in annotations:
        draw.text((x, y), text, fill=(180, 200, 220, 120), font=font)

# ============================================================================
# EXECUTE RENDERING
# ============================================================================
print("Rendering distorted grid...")
draw_distorted_grid()

center_x, center_y = WIDTH // 2, HEIGHT // 2 - 200

print("Rendering force field lines...")
draw_force_field_lines(center_x, center_y)

print("Rendering neural pathways...")
draw_neural_pathways(center_x, center_y)

print("Rendering orbital elements...")
draw_orbital_elements(center_x, center_y)

print("Rendering core presence...")
draw_core_presence(center_x, center_y)

print("Adding typography...")
add_typography()

# Save as high-quality PNG
output_path = "/home/matt/projects/claudekit-skills/.claude/skills/canvas-design/memory_force_poster.png"
img.save(output_path, quality=95)
print(f"Poster saved to: {output_path}")

# Also create PDF version
try:
    from PIL import Image
    pdf_path = "/home/matt/projects/claudekit-skills/.claude/skills/canvas-design/memory_force_poster.pdf"
    img.save(pdf_path, "PDF")
    print(f"PDF version saved to: {pdf_path}")
except Exception as e:
    print(f"Could not create PDF: {e}")
