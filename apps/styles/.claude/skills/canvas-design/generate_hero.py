#!/usr/bin/env python3
"""
Terminal Velocity - Hero Image Generation
A visual expression of acceleration through systematic precision
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import random
import math

# Register fonts
pdfmetrics.registerFont(TTFont('JetBrainsMono', 'canvas-fonts/JetBrainsMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('JetBrainsMonoBold', 'canvas-fonts/JetBrainsMono-Bold.ttf'))
pdfmetrics.registerFont(TTFont('IBMPlexMono', 'canvas-fonts/IBMPlexMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('GeistMono', 'canvas-fonts/GeistMono-Regular.ttf'))
pdfmetrics.registerFont(TTFont('GeistMonoBold', 'canvas-fonts/GeistMono-Bold.ttf'))

# Terminal color palette - phosphorescent greens and cyans
BLACK = HexColor('#000000')
CHARCOAL = HexColor('#0c0f0a')
DARK_GRAY = HexColor('#1a1d1a')
EMERALD = HexColor('#10b981')  # Primary terminal green
TEAL = HexColor('#06b6d4')     # Secondary cyan
CYAN_BRIGHT = HexColor('#22d3ee')  # Bright cyan
AMBER = HexColor('#f59e0b')    # Warning state
WHITE = HexColor('#f0fdf4')    # Pure command prompt
EMERALD_DIM = HexColor('#065f46')  # Background process
TEAL_DIM = HexColor('#164e63')     # Muted system

# Canvas dimensions
WIDTH, HEIGHT = letter  # 612 x 792 points (8.5 x 11 inches)

def create_terminal_grid(c, x, y, width, height, rows, cols, glow_color, intensity=1.0):
    """Create a grid of terminal-like rectangles with phosphor glow"""
    cell_width = width / cols
    cell_height = height / rows

    for i in range(rows):
        for j in range(cols):
            # Randomize which cells are "active"
            if random.random() < 0.3:  # 30% of cells active
                cx = x + j * cell_width
                cy = y + i * cell_height

                # Glow effect - multiple overlapping rectangles
                for layer in range(3):
                    alpha = (0.1 - layer * 0.03) * intensity
                    offset = layer * 1.5

                    c.setFillColor(Color(glow_color.red, glow_color.green, glow_color.blue, alpha=alpha))
                    c.rect(cx - offset, cy - offset,
                           cell_width + offset * 2, cell_height + offset * 2,
                           fill=1, stroke=0)

                # Core rectangle
                c.setFillColor(glow_color)
                c.setFillAlpha(0.6 * intensity)
                c.rect(cx, cy, cell_width - 2, cell_height - 2, fill=1, stroke=0)

def draw_terminal_line(c, x1, y1, x2, y2, color, width=1, glow=True):
    """Draw a line with terminal phosphor glow effect"""
    if glow:
        # Glow layers
        for layer in range(4):
            alpha = 0.15 - layer * 0.03
            line_width = width + layer * 2
            c.setStrokeColor(Color(color.red, color.green, color.blue, alpha=alpha))
            c.setLineWidth(line_width)
            c.line(x1, y1, x2, y2)

    # Core line
    c.setStrokeColor(color)
    c.setStrokeAlpha(0.9)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)

def draw_cursor_block(c, x, y, size, blink=True):
    """Draw a blinking terminal cursor block"""
    if blink:
        # Glow effect
        for layer in range(3):
            alpha = 0.2 - layer * 0.05
            offset = layer * 2
            c.setFillColor(Color(EMERALD.red, EMERALD.green, EMERALD.blue, alpha=alpha))
            c.rect(x - offset, y - offset, size + offset * 2, size + offset * 2, fill=1, stroke=0)

    # Core cursor
    c.setFillColor(EMERALD)
    c.setFillAlpha(1.0 if blink else 0.7)
    c.rect(x, y, size, size, fill=1, stroke=0)

def create_terminal_velocity_hero():
    """Generate the Terminal Velocity hero image"""
    c = canvas.Canvas("terminal_velocity_hero.pdf", pagesize=letter)

    # Deep black background
    c.setFillColor(BLACK)
    c.rect(0, 0, WIDTH, HEIGHT, fill=1, stroke=0)

    # ===== LAYER 1: Background Grid System =====
    # Create subtle grid showing terminal structure
    grid_spacing = 18
    c.setStrokeColor(DARK_GRAY)
    c.setStrokeAlpha(0.15)
    c.setLineWidth(0.5)

    # Vertical lines
    for i in range(0, int(WIDTH), grid_spacing):
        c.line(i, 0, i, HEIGHT)

    # Horizontal lines
    for i in range(0, int(HEIGHT), grid_spacing):
        c.line(0, i, WIDTH, i)

    # ===== LAYER 2: Velocity Trajectories =====
    # Diagonal lines suggesting forward momentum
    c.saveState()
    c.setStrokeAlpha(1.0)

    # Primary diagonal thrust
    num_lines = 32
    for i in range(num_lines):
        y_start = HEIGHT - (i * 25)
        x_start = 0
        x_end = WIDTH
        y_end = y_start - 200

        # Alternate between emerald and teal
        color = EMERALD if i % 2 == 0 else TEAL
        intensity = 1.0 - (i / num_lines) * 0.8

        c.setStrokeColor(Color(color.red, color.green, color.blue, alpha=0.08 * intensity))
        c.setLineWidth(2 if i % 3 == 0 else 1)
        c.line(x_start, y_start, x_end, y_end)

    c.restoreState()

    # ===== LAYER 3: Terminal Windows/Panes =====
    # Overlapping rectangular frames like tmux panes

    # Large background pane (top right)
    pane1_x, pane1_y = WIDTH * 0.35, HEIGHT * 0.50
    pane1_w, pane1_h = WIDTH * 0.6, HEIGHT * 0.42

    c.setStrokeColor(EMERALD)
    c.setStrokeAlpha(0.3)
    c.setLineWidth(1.5)
    c.rect(pane1_x, pane1_y, pane1_w, pane1_h, fill=0, stroke=1)

    # Inner glow
    c.setStrokeAlpha(0.15)
    c.setLineWidth(3)
    c.rect(pane1_x - 1, pane1_y - 1, pane1_w + 2, pane1_h + 2, fill=0, stroke=1)

    # Medium pane (center left)
    pane2_x, pane2_y = WIDTH * 0.05, HEIGHT * 0.30
    pane2_w, pane2_h = WIDTH * 0.45, HEIGHT * 0.35

    c.setStrokeColor(TEAL)
    c.setStrokeAlpha(0.35)
    c.setLineWidth(1.5)
    c.rect(pane2_x, pane2_y, pane2_w, pane2_h, fill=0, stroke=1)

    c.setStrokeAlpha(0.15)
    c.setLineWidth(3)
    c.rect(pane2_x - 1, pane2_y - 1, pane2_w + 2, pane2_h + 2, fill=0, stroke=1)

    # Small pane (bottom right)
    pane3_x, pane3_y = WIDTH * 0.55, HEIGHT * 0.08
    pane3_w, pane3_h = WIDTH * 0.38, HEIGHT * 0.25

    c.setStrokeColor(CYAN_BRIGHT)
    c.setStrokeAlpha(0.25)
    c.setLineWidth(1.5)
    c.rect(pane3_x, pane3_y, pane3_w, pane3_h, fill=0, stroke=1)

    # ===== LAYER 4: Data Streams (Active Processes) =====
    # Small grid blocks suggesting running processes
    create_terminal_grid(c, pane1_x + 10, pane1_y + 10, pane1_w - 20, pane1_h - 20,
                        12, 18, EMERALD, intensity=0.4)
    create_terminal_grid(c, pane2_x + 10, pane2_y + 10, pane2_w - 20, pane2_h - 20,
                        10, 15, TEAL, intensity=0.3)

    # ===== LAYER 5: Typography - Minimal, Integrated =====
    c.setFillAlpha(1.0)
    c.setStrokeAlpha(1.0)

    # Main title - "TERMINAL VELOCITY" split across composition
    # "TERMINAL" - top left, small
    c.setFont('GeistMonoBold', 14)
    c.setFillColor(EMERALD_DIM)
    c.drawString(50, HEIGHT - 60, "TERMINAL")

    # "VELOCITY" - large, center, primary visual element
    c.setFont('JetBrainsMonoBold', 72)
    c.setFillColor(EMERALD)

    # Glow effect for main text
    for layer in range(4):
        alpha = 0.15 - layer * 0.03
        c.setFillColor(Color(EMERALD.red, EMERALD.green, EMERALD.blue, alpha=alpha))
        c.drawString(78 - layer, HEIGHT/2 - 30 - layer, "VELOCITY")

    c.setFillColor(EMERALD)
    c.drawString(80, HEIGHT/2 - 30, "VELOCITY")

    # Subtitle - cryptic command-like phrase
    c.setFont('IBMPlexMono', 11)
    c.setFillColor(TEAL)
    c.drawString(82, HEIGHT/2 - 55, "$ zero → deploy --speed=∞")

    # Bottom right - system info
    c.setFont('GeistMono', 9)
    c.setFillColor(TEAL_DIM)
    c.drawRightString(WIDTH - 50, 60, "PROCESS: 45+ CONCURRENT")
    c.drawRightString(WIDTH - 50, 45, "UPTIME: 6 MONTHS")
    c.drawRightString(WIDTH - 50, 30, "STATUS: ACCELERATING")

    # Top right corner - timestamp-like detail
    c.setFont('GeistMono', 8)
    c.setFillColor(EMERALD_DIM)
    c.drawRightString(WIDTH - 50, HEIGHT - 30, "SYSTEM.MATT_M")
    c.drawRightString(WIDTH - 50, HEIGHT - 43, "PROMPT.ENGINEER")

    # ===== LAYER 6: Cursor Elements =====
    # Blinking cursor blocks at strategic points
    draw_cursor_block(c, 68, HEIGHT/2 - 35, 8, blink=True)  # Before VELOCITY
    draw_cursor_block(c, WIDTH - 55, 58, 6, blink=False)    # Near status
    draw_cursor_block(c, pane2_x + 5, pane2_y + pane2_h - 15, 5, blink=False)

    # ===== LAYER 7: Precision Lines (Systematic Markers) =====
    # Hairline crosshairs suggesting measurement/precision
    c.setStrokeColor(CYAN_BRIGHT)
    c.setStrokeAlpha(0.2)
    c.setLineWidth(0.5)

    # Vertical markers
    for x in [WIDTH * 0.25, WIDTH * 0.5, WIDTH * 0.75]:
        c.line(x, 0, x, 30)
        c.line(x, HEIGHT - 30, x, HEIGHT)

    # Horizontal markers
    for y in [HEIGHT * 0.25, HEIGHT * 0.5, HEIGHT * 0.75]:
        c.line(0, y, 30, y)
        c.line(WIDTH - 30, y, WIDTH, y)

    # ===== LAYER 8: Accent Glows =====
    # Strategic glow points suggesting active processes
    glow_points = [
        (pane1_x + pane1_w - 40, pane1_y + pane1_h - 40, EMERALD),
        (pane2_x + 40, pane2_y + 40, TEAL),
        (WIDTH/2, HEIGHT * 0.75, CYAN_BRIGHT),
    ]

    for gx, gy, gcolor in glow_points:
        # Radial glow
        for r in range(10, 1, -1):
            alpha = 0.03 * (10 - r)
            c.setFillColor(Color(gcolor.red, gcolor.green, gcolor.blue, alpha=alpha))
            c.circle(gx, gy, r, fill=1, stroke=0)

        # Core point
        c.setFillColor(gcolor)
        c.setFillAlpha(0.8)
        c.circle(gx, gy, 1.5, fill=1, stroke=0)

    # ===== FINAL REFINEMENTS =====
    # Add subtle scanline effect for CRT authenticity
    c.setStrokeAlpha(0.03)
    c.setStrokeColor(WHITE)
    c.setLineWidth(0.5)
    for y in range(0, int(HEIGHT), 4):
        c.line(0, y, WIDTH, y)

    # Border frame - hairline
    c.setStrokeColor(EMERALD_DIM)
    c.setStrokeAlpha(0.2)
    c.setLineWidth(0.5)
    margin = 20
    c.rect(margin, margin, WIDTH - margin * 2, HEIGHT - margin * 2, fill=0, stroke=1)

    c.save()
    print("✓ Hero image generated: terminal_velocity_hero.pdf")

if __name__ == "__main__":
    create_terminal_velocity_hero()
