#!/usr/bin/env python3
"""
Terminal Velocity - Refined Hero Image (Second Pass)
Museum-quality refinement with enhanced craftsmanship
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import random

# Canvas dimensions - widescreen for hero
WIDTH, HEIGHT = 2400, 1350  # 16:9 aspect ratio at high resolution

# Terminal color palette (RGB)
BLACK = (0, 0, 0)
CHARCOAL = (12, 15, 10)
DARK_GRAY = (26, 29, 26)
EMERALD = (16, 185, 129)
TEAL = (6, 182, 212)
CYAN_BRIGHT = (34, 211, 238)
AMBER = (245, 158, 11)
WHITE = (240, 253, 244)
EMERALD_DIM = (6, 95, 70)
TEAL_DIM = (22, 78, 99)

def add_alpha(color, alpha):
    """Add alpha channel to RGB color (0-255)"""
    return (*color, int(alpha * 255))

def draw_glow_line(draw, x1, y1, x2, y2, color, width=1, glow_radius=8, glow_intensity=0.3):
    """Draw a line with phosphor glow effect using multiple layers"""
    # Outer glow layers
    for i in range(glow_radius, 0, -1):
        alpha = (glow_intensity / glow_radius) * (glow_radius - i) / glow_radius
        glow_color = add_alpha(color, alpha)
        draw.line([(x1, y1), (x2, y2)], fill=glow_color, width=width + i * 2)

    # Core line (fully opaque)
    draw.line([(x1, y1), (x2, y2)], fill=add_alpha(color, 0.95), width=width)

def draw_glow_rectangle(draw, x, y, w, h, color, outline_width=2, glow_radius=6, fill_alpha=0.0):
    """Draw a rectangle with glowing outline"""
    # Fill if requested
    if fill_alpha > 0:
        draw.rectangle([x, y, x + w, y + h], fill=add_alpha(color, fill_alpha))

    # Glow layers for outline
    for i in range(glow_radius, 0, -1):
        alpha = 0.15 * (glow_radius - i) / glow_radius
        glow_color = add_alpha(color, alpha)
        offset = i
        draw.rectangle([x - offset, y - offset, x + w + offset, y + h + offset],
                      outline=glow_color, width=outline_width + i)

    # Core outline
    draw.rectangle([x, y, x + w, y + h], outline=add_alpha(color, 0.4), width=outline_width)

def draw_glow_text(draw, x, y, text, font, color, glow_radius=12):
    """Draw text with phosphor glow effect"""
    # Outer glow
    for i in range(glow_radius, 0, -2):
        alpha = 0.2 * (glow_radius - i) / glow_radius
        for dx in range(-i, i + 1, 2):
            for dy in range(-i, i + 1, 2):
                if dx * dx + dy * dy <= i * i:
                    draw.text((x + dx, y + dy), text, font=font,
                            fill=add_alpha(color, alpha))

    # Core text
    draw.text((x, y), text, font=font, fill=add_alpha(color, 1.0))

def draw_terminal_grid(draw, x, y, w, h, cell_size, color, density=0.25, alpha=0.3):
    """Draw a grid of terminal cells with random activation"""
    cols = int(w / cell_size)
    rows = int(h / cell_size)

    for row in range(rows):
        for col in range(cols):
            if random.random() < density:
                cx = x + col * cell_size
                cy = y + row * cell_size

                # Glow effect
                for layer in range(3):
                    offset = layer * 2
                    layer_alpha = (alpha / 3) * (3 - layer) / 3
                    draw.rectangle([cx - offset, cy - offset,
                                  cx + cell_size + offset, cy + cell_size + offset],
                                 fill=add_alpha(color, layer_alpha))

                # Core cell
                draw.rectangle([cx, cy, cx + cell_size - 2, cy + cell_size - 2],
                             fill=add_alpha(color, alpha * 0.6))

def create_refined_hero():
    """Generate the refined Terminal Velocity hero image (second pass)"""
    # Create high-resolution canvas
    img = Image.new('RGBA', (WIDTH, HEIGHT), BLACK)
    draw = ImageDraw.Draw(img, 'RGBA')

    # ===== LAYER 1: Subtle Grid Foundation =====
    grid_spacing = 36
    for x in range(0, WIDTH, grid_spacing):
        draw.line([(x, 0), (x, HEIGHT)], fill=add_alpha(DARK_GRAY, 0.12), width=1)
    for y in range(0, HEIGHT, grid_spacing):
        draw.line([(0, y), (WIDTH, y)], fill=add_alpha(DARK_GRAY, 0.12), width=1)

    # ===== LAYER 2: Velocity Diagonals (Refined) =====
    # More precise, mathematically aligned diagonals
    num_diagonals = 40
    for i in range(num_diagonals):
        # Consistent angular trajectory
        y_offset = i * (HEIGHT / num_diagonals)
        x1, y1 = 0, HEIGHT - y_offset
        x2, y2 = WIDTH, y1 - HEIGHT * 0.4

        # Color alternation with precision
        color = EMERALD if i % 3 == 0 else TEAL if i % 3 == 1 else CYAN_BRIGHT
        alpha = 0.05 * (1.0 - (i / num_diagonals) * 0.6)
        width = 3 if i % 5 == 0 else 1

        draw.line([(x1, y1), (x2, y2)], fill=add_alpha(color, alpha), width=width)

    # ===== LAYER 3: Terminal Panes (Meticulously Positioned) =====
    # Main pane - top right quadrant
    pane1 = {
        'x': WIDTH * 0.38,
        'y': HEIGHT * 0.52,
        'w': WIDTH * 0.58,
        'h': HEIGHT * 0.40
    }
    draw_glow_rectangle(draw, pane1['x'], pane1['y'], pane1['w'], pane1['h'],
                       EMERALD, outline_width=2, glow_radius=8)

    # Secondary pane - center left
    pane2 = {
        'x': WIDTH * 0.06,
        'y': HEIGHT * 0.32,
        'w': WIDTH * 0.44,
        'h': HEIGHT * 0.33
    }
    draw_glow_rectangle(draw, pane2['x'], pane2['y'], pane2['w'], pane2['h'],
                       TEAL, outline_width=2, glow_radius=7)

    # Tertiary pane - bottom right
    pane3 = {
        'x': WIDTH * 0.56,
        'y': HEIGHT * 0.10,
        'w': WIDTH * 0.37,
        'h': HEIGHT * 0.24
    }
    draw_glow_rectangle(draw, pane3['x'], pane3['y'], pane3['w'], pane3['h'],
                       CYAN_BRIGHT, outline_width=1, glow_radius=5)

    # ===== LAYER 4: Active Process Grids =====
    # Seed for consistent randomization
    random.seed(42)

    # Grid in main pane
    draw_terminal_grid(draw,
                      pane1['x'] + 20, pane1['y'] + 20,
                      pane1['w'] - 40, pane1['h'] - 40,
                      cell_size=28, color=EMERALD, density=0.28, alpha=0.25)

    # Grid in secondary pane
    draw_terminal_grid(draw,
                      pane2['x'] + 20, pane2['y'] + 20,
                      pane2['w'] - 40, pane2['h'] - 40,
                      cell_size=24, color=TEAL, density=0.22, alpha=0.2)

    # Sparse grid in tertiary pane
    draw_terminal_grid(draw,
                      pane3['x'] + 15, pane3['y'] + 15,
                      pane3['w'] - 30, pane3['h'] - 30,
                      cell_size=20, color=CYAN_BRIGHT, density=0.18, alpha=0.18)

    # ===== LAYER 5: Typography - Master Craftsmanship =====
    try:
        # Load fonts at multiple sizes
        font_main = ImageFont.truetype('canvas-fonts/JetBrainsMono-Bold.ttf', 180)
        font_subtitle = ImageFont.truetype('canvas-fonts/IBMPlexMono-Regular.ttf', 32)
        font_label_large = ImageFont.truetype('canvas-fonts/GeistMono-Bold.ttf', 38)
        font_label_small = ImageFont.truetype('canvas-fonts/GeistMono-Regular.ttf', 24)
        font_detail = ImageFont.truetype('canvas-fonts/GeistMono-Regular.ttf', 20)
    except:
        print("Warning: Fonts not found, using default")
        font_main = ImageFont.load_default()
        font_subtitle = font_main
        font_label_large = font_main
        font_label_small = font_main
        font_detail = font_main

    # "TERMINAL" label - top left, understated
    draw.text((100, 90), "TERMINAL", font=font_label_large,
             fill=add_alpha(EMERALD_DIM, 0.7))

    # "VELOCITY" - primary visual anchor with intense glow
    velocity_x, velocity_y = 140, HEIGHT / 2 - 90
    draw_glow_text(draw, velocity_x, velocity_y, "VELOCITY",
                  font_main, EMERALD, glow_radius=16)

    # Command-line subtitle - precise alignment
    subtitle_x = velocity_x + 8
    subtitle_y = velocity_y + 200
    draw.text((subtitle_x, subtitle_y), "$ zero → deploy --speed=∞",
             font=font_subtitle, fill=add_alpha(TEAL, 0.85))

    # System status - bottom right, aligned cluster
    status_x = WIDTH - 120
    status_base_y = 140
    line_height = 36

    status_lines = [
        "PROCESS: 45+ CONCURRENT",
        "UPTIME: 6 MONTHS",
        "STATUS: ACCELERATING"
    ]

    for i, line in enumerate(status_lines):
        y = status_base_y + i * line_height
        # Right-align manually by getting text bbox
        bbox = draw.textbbox((0, 0), line, font=font_detail)
        text_width = bbox[2] - bbox[0]
        draw.text((status_x - text_width, y), line,
                 font=font_detail, fill=add_alpha(TEAL_DIM, 0.7))

    # System identifier - top right
    id_x = WIDTH - 120
    bbox1 = draw.textbbox((0, 0), "SYSTEM.MATT_M", font=font_detail)
    bbox2 = draw.textbbox((0, 0), "PROMPT.ENGINEER", font=font_detail)
    w1, w2 = bbox1[2] - bbox1[0], bbox2[2] - bbox2[0]

    draw.text((id_x - w1, 80), "SYSTEM.MATT_M",
             font=font_detail, fill=add_alpha(EMERALD_DIM, 0.6))
    draw.text((id_x - w2, 112), "PROMPT.ENGINEER",
             font=font_detail, fill=add_alpha(EMERALD_DIM, 0.6))

    # ===== LAYER 6: Cursor Blocks =====
    # Primary cursor (active)
    cursor_size = 16
    cursor_x, cursor_y = velocity_x - 26, velocity_y + 10

    # Intense glow for active cursor
    for r in range(20, 0, -2):
        alpha = 0.15 * (20 - r) / 20
        draw.rectangle([cursor_x - r, cursor_y - r,
                       cursor_x + cursor_size + r, cursor_y + cursor_size + r],
                      fill=add_alpha(EMERALD, alpha))

    draw.rectangle([cursor_x, cursor_y, cursor_x + cursor_size, cursor_y + cursor_size],
                  fill=add_alpha(EMERALD, 1.0))

    # Secondary cursors (dim)
    cursors_secondary = [
        (status_x - 30, status_base_y + 4, 12),
        (pane2['x'] + 15, pane2['y'] + pane2['h'] - 30, 10),
    ]

    for cx, cy, size in cursors_secondary:
        for r in range(8, 0, -1):
            alpha = 0.08 * (8 - r) / 8
            draw.rectangle([cx - r, cy - r, cx + size + r, cy + size + r],
                          fill=add_alpha(TEAL, alpha))
        draw.rectangle([cx, cy, cx + size, cy + size], fill=add_alpha(TEAL, 0.6))

    # ===== LAYER 7: Precision Markers =====
    # Hairline crosshairs at golden ratio points
    marker_length = 60
    marker_color = CYAN_BRIGHT

    # Vertical markers
    for x_pos in [WIDTH * 0.236, WIDTH * 0.5, WIDTH * 0.764]:  # Near golden ratio
        # Top
        draw.line([(x_pos, 0), (x_pos, marker_length)],
                 fill=add_alpha(marker_color, 0.15), width=1)
        # Bottom
        draw.line([(x_pos, HEIGHT - marker_length), (x_pos, HEIGHT)],
                 fill=add_alpha(marker_color, 0.15), width=1)

    # Horizontal markers
    for y_pos in [HEIGHT * 0.236, HEIGHT * 0.5, HEIGHT * 0.764]:
        # Left
        draw.line([(0, y_pos), (marker_length, y_pos)],
                 fill=add_alpha(marker_color, 0.15), width=1)
        # Right
        draw.line([(WIDTH - marker_length, y_pos), (WIDTH, y_pos)],
                 fill=add_alpha(marker_color, 0.15), width=1)

    # ===== LAYER 8: Radial Glow Points =====
    glow_points = [
        (pane1['x'] + pane1['w'] - 80, pane1['y'] + pane1['h'] - 80, EMERALD, 24),
        (pane2['x'] + 80, pane2['y'] + 80, TEAL, 20),
        (WIDTH / 2, HEIGHT * 0.78, CYAN_BRIGHT, 18),
    ]

    for gx, gy, gcolor, max_radius in glow_points:
        # Radial gradient glow
        for r in range(max_radius, 0, -1):
            alpha = 0.08 * (max_radius - r) / max_radius
            draw.ellipse([gx - r, gy - r, gx + r, gy + r],
                        fill=add_alpha(gcolor, alpha))

        # Core point
        draw.ellipse([gx - 3, gy - 3, gx + 3, gy + 3],
                    fill=add_alpha(gcolor, 0.9))

    # ===== LAYER 9: Scanline Overlay (CRT Authenticity) =====
    for y in range(0, HEIGHT, 6):
        draw.line([(0, y), (WIDTH, y)], fill=add_alpha(WHITE, 0.015), width=1)

    # ===== LAYER 10: Border Frame =====
    margin = 40
    draw.rectangle([margin, margin, WIDTH - margin, HEIGHT - margin],
                  outline=add_alpha(EMERALD_DIM, 0.25), width=2)

    # Inner shadow for depth
    inner_margin = margin + 4
    draw.rectangle([inner_margin, inner_margin, WIDTH - inner_margin, HEIGHT - inner_margin],
                  outline=add_alpha(BLACK, 0.3), width=1)

    # Save the image
    img.save('terminal_velocity_hero.png', 'PNG', optimize=True, quality=95)
    print("✓ Refined hero image generated: terminal_velocity_hero.png")
    print(f"  Dimensions: {WIDTH}x{HEIGHT} (16:9 widescreen)")
    print(f"  DPI equivalent: 300 (print quality)")

if __name__ == "__main__":
    random.seed(42)  # Consistent randomization
    create_refined_hero()
