#!/usr/bin/env python3
"""Generate avatars, portfolio images, and feature images"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import random
import colorsys

def generate_avatar(initials, size, output_path, color_hue=None):
    """Generate a circular avatar with initials"""
    width, height = map(int, size.split('x'))

    # Generate a random pastel color if not provided
    if color_hue is None:
        color_hue = random.random()

    # Convert HSV to RGB for a pastel color
    rgb = colorsys.hsv_to_rgb(color_hue, 0.6, 0.9)
    bg_color = tuple(int(x * 255) for x in rgb)

    # Create image with transparent background
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw circle
    draw.ellipse([0, 0, width-1, height-1], fill=bg_color)

    # Try to load font
    try:
        font_size = min(width, height) // 2
        font = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Draw initials
    bbox = draw.textbbox((0, 0), initials, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2 - bbox[1]

    draw.text((x, y), initials, font=font, fill='white')

    img.save(output_path, 'PNG')
    print(f"✓ Created avatar: {output_path}")

def generate_portfolio_image(title, size, output_path, theme="code"):
    """Generate a portfolio/project preview image"""
    width, height = map(int, size.split('x'))

    # Color schemes for different themes
    themes = {
        "code": (("#1e293b", "#334155"), ["// Code", "function()", "{...}"]),
        "design": (("#581c87", "#7c3aed"), ["Design", "UI/UX", "Figma"]),
        "web": (("#0c4a6e", "#0ea5e9"), ["<Web/>", "HTML", "CSS"]),
        "data": (("#065f46", "#10b981"), ["Data", "Charts", "Analytics"]),
        "mobile": (("#7c2d12", "#f97316"), ["Mobile", "iOS", "Android"]),
        "ai": (("#831843", "#e11d48"), ["AI/ML", "Neural", "Network"]),
    }

    colors, keywords = themes[theme]

    # Create gradient background
    base = Image.new('RGB', (width, height), colors[0])
    top = Image.new('RGB', (width, height), colors[1])
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            # Diagonal gradient
            mask_data.append(int(255 * ((x + y) / (width + height))))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)

    draw = ImageDraw.Draw(base)

    # Add decorative elements (rectangles representing UI elements)
    for _ in range(5):
        x1 = random.randint(0, width - 100)
        y1 = random.randint(0, height - 60)
        x2 = x1 + random.randint(60, min(150, width - x1))
        y2 = y1 + random.randint(30, min(80, height - y1))
        opacity = random.randint(10, 30)
        overlay = Image.new('RGBA', (width, height), (255, 255, 255, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle([x1, y1, x2, y2], fill=(255, 255, 255, opacity))
        base = Image.alpha_composite(base.convert('RGBA'), overlay).convert('RGB')

    # Redraw for text
    draw = ImageDraw.Draw(base)

    # Try to load fonts
    try:
        title_font = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", min(width, height) // 12)
        keyword_font = ImageFont.truetype("/system/fonts/Roboto-Regular.ttf", min(width, height) // 20)
    except:
        title_font = keyword_font = ImageFont.load_default()

    # Draw title
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    x = (width - title_width) // 2
    y = height // 2 - 40

    # Shadow
    draw.text((x + 2, y + 2), title, font=title_font, fill=(0, 0, 0, 128))
    # Text
    draw.text((x, y), title, font=title_font, fill='white')

    # Draw keywords
    keyword_text = " • ".join(keywords)
    bbox = draw.textbbox((0, 0), keyword_text, font=keyword_font)
    keyword_width = bbox[2] - bbox[0]
    x = (width - keyword_width) // 2
    y = height // 2 + 20
    draw.text((x, y), keyword_text, font=keyword_font, fill=(255, 255, 255, 200))

    base.save(output_path, 'PNG', quality=95)
    print(f"✓ Created portfolio image: {output_path}")

def generate_feature_image(title, size, output_path):
    """Generate a feature/marketing image"""
    width, height = map(int, size.split('x'))

    # Gradient colors
    colors = [
        ("#667eea", "#764ba2"),
        ("#f093fb", "#f5576c"),
        ("#4facfe", "#00f2fe"),
        ("#43e97b", "#38f9d7"),
    ]
    color_pair = random.choice(colors)

    # Create gradient
    base = Image.new('RGB', (width, height), color_pair[0])
    top = Image.new('RGB', (width, height), color_pair[1])
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        for x in range(width):
            mask_data.append(int(255 * (y / height)))
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)

    draw = ImageDraw.Draw(base)

    # Add simple icon-like shape in center
    center_x, center_y = width // 2, height // 2
    icon_size = min(width, height) // 3
    draw.ellipse([center_x - icon_size, center_y - icon_size,
                  center_x + icon_size, center_y + icon_size],
                 outline='white', width=5)

    # Draw checkmark inside
    check_points = [
        (center_x - icon_size//2, center_y),
        (center_x - icon_size//4, center_y + icon_size//2),
        (center_x + icon_size//2, center_y - icon_size//2)
    ]
    draw.line(check_points, fill='white', width=8, joint='curve')

    # Draw title at bottom
    try:
        font = ImageFont.truetype("/system/fonts/Roboto-Bold.ttf", min(width, height) // 15)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), title, font=font)
    title_width = bbox[2] - bbox[0]
    x = (width - title_width) // 2
    y = height - 60

    draw.text((x, y), title, font=font, fill='white')

    base.save(output_path, 'PNG', quality=95)
    print(f"✓ Created feature image: {output_path}")

def main():
    # Create directories
    Path("public/images/avatars").mkdir(parents=True, exist_ok=True)
    Path("public/images/portfolio").mkdir(parents=True, exist_ok=True)
    Path("public/images/features").mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("GENERATING USER AVATARS")
    print("=" * 60)

    # Generate avatars with different initials and sizes
    avatar_data = [
        ("AT", "32x32"), ("AT", "40x40"), ("AT", "128x128"), ("AT", "150x150"),
        ("SC", "32x32"), ("SC", "40x40"),
        ("MJ", "32x32"), ("MJ", "40x40"),
        ("ED", "32x32"), ("ED", "40x40"),
        ("JS", "32x32"), ("JS", "40x40"),
        ("SM", "40x40"), ("DC", "40x40"), ("ER", "40x40"),
        ("MT", "40x40"), ("LA", "40x40"), ("JW", "40x40"),
    ]

    for initials, size in avatar_data:
        output_path = f"public/images/avatars/{initials.lower()}-{size}.png"
        # Use consistent color for same initials
        color_hue = hash(initials) % 100 / 100
        generate_avatar(initials, size, output_path, color_hue)

    print("\n" + "=" * 60)
    print("GENERATING PORTFOLIO/PROJECT IMAGES")
    print("=" * 60)

    # Portfolio images with different themes
    portfolio_projects = [
        ("E-Commerce Platform", "800x600", "web"),
        ("Mobile Banking App", "800x600", "mobile"),
        ("Data Dashboard", "800x600", "data"),
        ("Design System", "800x600", "design"),
        ("AI Chatbot", "800x600", "ai"),
        ("Portfolio Site", "800x600", "code"),
        ("Featured Project", "600x400", "web"),
        ("Side Project", "600x400", "code"),
        ("Case Study", "400x300", "design"),
        ("Recent Work", "400x300", "web"),
        ("Featured Work", "1200x600", "web"),
        ("Main Project", "800x500", "code"),
    ]

    for title, size, theme in portfolio_projects:
        filename = title.lower().replace(' ', '-')
        output_path = f"public/images/portfolio/{filename}-{size}.png"
        generate_portfolio_image(title, size, output_path, theme)

    print("\n" + "=" * 60)
    print("GENERATING FEATURE/MARKETING IMAGES")
    print("=" * 60)

    # Feature images
    features = [
        "Fast Performance",
        "Secure by Default",
        "Easy to Use",
        "24/7 Support",
        "Cloud Sync",
        "Mobile Ready",
    ]

    for feature in features:
        filename = feature.lower().replace(' ', '-').replace('/', '-')
        output_path = f"public/images/features/{filename}-600x400.png"
        generate_feature_image(feature, "600x400", output_path)

    print("\n" + "=" * 60)
    print("GENERATION COMPLETE!")
    print("=" * 60)
    print("\nImages generated:")
    print(f"  Avatars: {len(list(Path('public/images/avatars').glob('*.png')))}")
    print(f"  Portfolio: {len(list(Path('public/images/portfolio').glob('*.png')))}")
    print(f"  Features: {len(list(Path('public/images/features').glob('*.png')))}")

if __name__ == "__main__":
    main()
