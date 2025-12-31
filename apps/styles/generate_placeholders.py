#!/usr/bin/env python3
"""Generate colorful placeholder images with product names"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import random

# Color palettes for different product categories
PALETTES = {
    "silly": [
        ("#FF6B6B", "#4ECDC4"),  # Coral & Turquoise
        ("#A8E6CF", "#FFD3B6"),  # Mint & Peach
        ("#FFAAA5", "#FF8B94"),  # Pink shades
        ("#95E1D3", "#F38181"),  # Mint & Coral
        ("#AA96DA", "#FCBAD3"),  # Purple & Pink
    ],
    "tech": [
        ("#667eea", "#764ba2"),  # Purple gradient
        ("#f093fb", "#f5576c"),  # Pink gradient
        ("#4facfe", "#00f2fe"),  # Blue gradient
        ("#43e97b", "#38f9d7"),  # Green gradient
        ("#fa709a", "#fee140"),  # Pink-Yellow gradient
    ]
}

def create_gradient_image(width, height, color1, color2):
    """Create a gradient image"""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            mask_data.append(int(255 * (x / width)))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def wrap_text(text, font, max_width):
    """Wrap text to fit within max_width"""
    words = text.split()
    lines = []
    current_line = []

    for word in words:
        test_line = ' '.join(current_line + [word])
        bbox = font.getbbox(test_line)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(' '.join(current_line))
            current_line = [word]

    if current_line:
        lines.append(' '.join(current_line))

    return lines

def generate_placeholder(name, size, output_path, palette_type="tech"):
    """Generate a placeholder image with gradient and text"""
    width, height = map(int, size.split('x'))

    # Select random colors from palette
    colors = random.choice(PALETTES[palette_type])

    # Create gradient background
    img = create_gradient_image(width, height, colors[0], colors[1])
    draw = ImageDraw.Draw(img)

    # Try to load a font, fallback to default
    try:
        # Calculate font size based on image size
        font_size = min(width, height) // 8
        font = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", font_size)
        small_font = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", font_size // 2)
    except:
        font = ImageFont.load_default()
        small_font = font

    # Format the product name
    display_name = name.replace('-', ' ').title()

    # Wrap text to fit
    max_text_width = width * 0.8
    lines = wrap_text(display_name, font, max_text_width)

    # Calculate total text height
    line_height = font_size + 10
    total_text_height = len(lines) * line_height

    # Draw text centered
    y = (height - total_text_height) // 2
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2

        # Draw shadow
        draw.text((x + 2, y + 2), line, font=font, fill=(0, 0, 0, 128))
        # Draw text
        draw.text((x, y), line, font=font, fill='white')
        y += line_height

    # Draw size label in corner
    size_label = size
    bbox = draw.textbbox((0, 0), size_label, font=small_font)
    size_width = bbox[2] - bbox[0]
    size_height = bbox[3] - bbox[1]
    draw.text((width - size_width - 10, height - size_height - 10),
              size_label, font=small_font, fill=(255, 255, 255, 180))

    # Save image
    img.save(output_path, 'PNG', quality=95)
    print(f"✓ Created: {output_path}")

def main():
    output_dir = Path("public/images/products")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Silly products
    silly_products = [
        ("self-aware-toaster", ["300x300", "600x600"]),
        ("invisible-socks", ["300x300", "600x600"]),
        ("telepathic-remote", ["300x300", "600x600"]),
        ("self-folding-basket", ["300x300", "600x600"]),
        ("procrastination-timer", ["300x300", "600x600"]),
    ]

    # Regular products
    regular_products = [
        ("wireless-headphones", ["150x150", "200x200", "400x400"]),
        ("mechanical-keyboard", ["150x150", "200x200", "400x400"]),
        ("ergonomic-mouse", ["150x150", "200x200", "400x400"]),
        ("usb-c-hub", ["200x200"]),
        ("monitor-stand", ["200x200"]),
        ("desk-mat", ["200x200"]),
        ("cable-kit", ["200x200"]),
    ]

    print("=" * 60)
    print("GENERATING SILLY PRODUCT PLACEHOLDERS")
    print("=" * 60)

    for name, sizes in silly_products:
        print(f"\n📦 {name.replace('-', ' ').title()}")
        for size in sizes:
            output_path = output_dir / f"{name}-{size}.png"
            generate_placeholder(name, size, str(output_path), palette_type="silly")

    print("\n" + "=" * 60)
    print("GENERATING REGULAR PRODUCT PLACEHOLDERS")
    print("=" * 60)

    for name, sizes in regular_products:
        print(f"\n📦 {name.replace('-', ' ').title()}")
        for size in sizes:
            output_path = output_dir / f"{name}-{size}.png"
            generate_placeholder(name, size, str(output_path), palette_type="tech")

    print("\n" + "=" * 60)
    print("GENERATION COMPLETE!")
    print("=" * 60)
    print(f"\nImages saved to: {output_dir.absolute()}")
    print(f"Total images generated: {len(list(output_dir.glob('*.png')))}")

if __name__ == "__main__":
    main()
