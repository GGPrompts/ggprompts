#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

# Canvas dimensions
WIDTH = 2400
HEIGHT = 3200

# Create image
img = Image.new('RGB', (WIDTH, HEIGHT), (2, 3, 12))
draw = ImageDraw.Draw(img, 'RGBA')

# Background gradient
for y in range(HEIGHT):
    ratio = y / HEIGHT
    r = int(2 + (1 - 2) * ratio)
    g = int(3 + (2 - 3) * ratio)
    b = int(12 + (8 - 12) * ratio)
    draw.rectangle([(0, y), (WIDTH, y + 1)], fill=(r, g, b))

# Memory data: x, y, radius, intensity, label
memories = [
    (1800, 800, 180, 1.0, 'M₁'),
    (600, 1200, 140, 0.85, 'M₂'),
    (1900, 2200, 100, 0.7, 'M₃'),
    (400, 2600, 85, 0.6, 'M₄'),
    (2100, 1600, 120, 0.75, 'M₅'),
    (300, 600, 70, 0.5, 'M₆'),
    (1600, 2800, 95, 0.65, 'M₇'),
]

center_x, center_y = WIDTH // 2, HEIGHT // 2

# Draw memory spheres with multiple glow layers
for mx, my, mr, intensity, label in memories:
    # Outer glow - multiple layers for smooth gradient
    for i in range(40, 0, -1):
        alpha_val = max(0, int((40 - i) * 4.5 * intensity))
        r_glow = mr * (1 + i * 0.12)

        # Warm glow colors - gold/amber
        r_val = min(255, int((220 + 35 * (1 - i/40)) * intensity))
        g_val = min(255, int((140 + 40 * (1 - i/40)) * intensity))
        b_val = min(255, int((50 + 30 * (1 - i/40)) * intensity))

        draw.ellipse(
            [mx - r_glow, my - r_glow, mx + r_glow, my + r_glow],
            fill=(r_val, g_val, b_val, alpha_val)
        )

# Apply blur to glow layers
img = img.filter(ImageFilter.GaussianBlur(radius=8))
draw = ImageDraw.Draw(img, 'RGBA')

# Draw solid memory cores
for mx, my, mr, intensity, label in memories:
    # Multi-layer core for gradient effect
    for i in range(15, 0, -1):
        r_core = mr * (i / 15)
        brightness = 1.0 - (i / 20)

        r_val = int((200 + 55 * brightness) * intensity)
        g_val = int((120 + 120 * brightness) * intensity)
        b_val = int((40 + 150 * brightness) * intensity)

        draw.ellipse(
            [mx - r_core, my - r_core, mx + r_core, my + r_core],
            fill=(r_val, g_val, b_val)
        )

# Draw field lines from memories to center
for mx, my, mr, intensity, label in memories:
    dx = center_x - mx
    dy = center_y - my
    dist = math.sqrt(dx**2 + dy**2)
    angle = math.atan2(dy, dx)

    # Draw three field lines per memory
    for offset in [-30, 0, 30]:
        perp_x = -math.sin(angle) * offset
        perp_y = math.cos(angle) * offset

        start_x = int(mx + mr * math.cos(angle) + perp_x)
        start_y = int(my + mr * math.sin(angle) + perp_y)
        end_x = int(center_x - 150 * math.cos(angle) + perp_x)
        end_y = int(center_y - 150 * math.sin(angle) + perp_y)

        # Draw curved line
        segments = 60
        for i in range(segments):
            t = i / segments
            ctrl_x = (start_x + end_x) / 2 + perp_x * 0.3
            ctrl_y = (start_y + end_y) / 2 + perp_y * 0.3

            x1 = (1-t)**2 * start_x + 2*(1-t)*t * ctrl_x + t**2 * end_x
            y1 = (1-t)**2 * start_y + 2*(1-t)*t * ctrl_y + t**2 * end_y

            t2 = (i+1) / segments
            x2 = (1-t2)**2 * start_x + 2*(1-t2)*t2 * ctrl_x + t2**2 * end_x
            y2 = (1-t2)**2 * start_y + 2*(1-t2)*t2 * ctrl_y + t2**2 * end_y

            alpha = int(70 + 60 * (1 - t))
            opacity_factor = 0.9 if offset == 0 else 0.75
            draw.line(
                [(x1, y1), (x2, y2)],
                fill=(200, 225, 255, int(alpha * opacity_factor)),
                width=2
            )

# Draw directional arrows
for mx, my, mr, intensity, label in memories:
    dx = center_x - mx
    dy = center_y - my
    angle = math.atan2(dy, dx)

    arrow_x = (mx + center_x) / 2
    arrow_y = (my + center_y) / 2
    arrow_len = 35
    wing_angle = math.pi / 6

    tip = (arrow_x, arrow_y)
    left = (
        arrow_x - arrow_len * math.cos(angle - wing_angle),
        arrow_y - arrow_len * math.sin(angle - wing_angle)
    )
    right = (
        arrow_x - arrow_len * math.cos(angle + wing_angle),
        arrow_y - arrow_len * math.sin(angle + wing_angle)
    )

    draw.line([left, tip], fill=(210, 235, 255, 200), width=3)
    draw.line([right, tip], fill=(210, 235, 255, 200), width=3)

# Draw central figure
fig_color = (238, 243, 250)

# Head
draw.ellipse([center_x - 42, center_y - 100, center_x + 42, center_y - 16], fill=fig_color)

# Neck
draw.rectangle([center_x - 12, center_y - 16, center_x + 12, center_y], fill=fig_color)

# Body
draw.rectangle([center_x - 35, center_y, center_x + 35, center_y + 120], fill=fig_color)

# Arms
draw.rectangle([center_x - 92, center_y + 5, center_x - 35, center_y + 27], fill=fig_color)
draw.rectangle([center_x + 35, center_y + 5, center_x + 92, center_y + 27], fill=fig_color)

# Legs
draw.rectangle([center_x - 30, center_y + 120, center_x - 4, center_y + 202], fill=fig_color)
draw.rectangle([center_x + 4, center_y + 120, center_x + 30, center_y + 202], fill=fig_color)

# Try to load fonts, fall back to default if unavailable
try:
    font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 64)
    font_subtitle = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 22)
    font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
    font_formula = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
    font_coord = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", 15)
except:
    font_title = ImageFont.load_default()
    font_subtitle = font_label = font_formula = font_small = font_coord = font_title

# Add text annotations
text_color = (220, 230, 245, 205)

# Title
draw.text((180, 2950), "MNEMONIC FIELDS", fill=(230, 240, 255, 230), font=font_title)
draw.text((180, 3015), "A quantitative study of memory as gravitational force",
          fill=(200, 215, 235, 165), font=font_subtitle)

# Formula
draw.text((180, 260), "F = m · g(r,t)", fill=(220, 235, 250, 190), font=font_formula)
draw.text((180, 305), "temporal gravitational constant", fill=(195, 215, 235, 155), font=font_small)
draw.text((180, 380), "where r ∝ 1/t²", fill=(205, 225, 245, 165), font=font_subtitle)

# Memory labels and measurements
for mx, my, mr, intensity, label in memories:
    offset_x = 55 if mx < center_x else 55
    offset_y = -35
    draw.text((mx + offset_x, my + offset_y), label, fill=text_color, font=font_label)

# Distance measurements
measurements = [
    (1470, 1160, "r = 1.82u"),
    (870, 1350, "r = 2.31u"),
    (1570, 1910, "r = 1.54u"),
    (690, 2290, "r = 3.07u"),
]
for x, y, text in measurements:
    draw.text((x, y), text, fill=(205, 218, 238, 165), font=font_small)

# Force vectors
vectors = [
    (1510, 1375, "F⃗₁"),
    (960, 1285, "F⃗₂"),
    (1615, 1970, "F⃗₃"),
    (710, 2320, "F⃗₄"),
]
for x, y, text in vectors:
    draw.text((x, y), text, fill=(210, 225, 245, 180), font=font_subtitle)

# Measurement frame
frame_color = (195, 210, 230, 36)
draw.rectangle([140, 140, 2260, 3060], outline=frame_color, width=1)

# Tick marks
draw.line([(140, 800), (165, 800)], fill=frame_color, width=1)
draw.line([(140, 1600), (165, 1600)], fill=frame_color, width=1)
draw.line([(140, 2400), (165, 2400)], fill=frame_color, width=1)
draw.line([(600, 3060), (600, 3035)], fill=frame_color, width=1)
draw.line([(1200, 3060), (1200, 3035)], fill=frame_color, width=1)
draw.line([(1800, 3060), (1800, 3035)], fill=frame_color, width=1)

# Coordinate labels
coord_color = (175, 195, 215, 122)
draw.text((95, 808), "0.25", fill=coord_color, font=font_coord)
draw.text((95, 1608), "0.50", fill=coord_color, font=font_coord)
draw.text((95, 2408), "0.75", fill=coord_color, font=font_coord)
draw.text((575, 3095), "0.25", fill=coord_color, font=font_coord)
draw.text((1175, 3095), "0.50", fill=coord_color, font=font_coord)
draw.text((1775, 3095), "0.75", fill=coord_color, font=font_coord)
draw.text((95, 3095), "0.00", fill=coord_color, font=font_coord)
draw.text((2200, 3095), "τ units", fill=coord_color, font=font_coord)

# Observatory code
draw.text((2100, 230), "OBS-2451", fill=(165, 185, 205, 107), font=font_coord)

# Save final image
img.save('/home/matt/projects/claudekit-skills/.claude/skills/canvas-design/mnemonic-fields.png', quality=95, optimize=True)
print("Masterpiece created successfully!")
print(f"Dimensions: {WIDTH}x{HEIGHT}")
print(f"File: mnemonic-fields.png")
