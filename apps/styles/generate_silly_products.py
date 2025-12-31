#!/usr/bin/env python3
"""Generate silly product images using Gemini API"""
import os
from google import genai
from google.genai import types
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Gemini client
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment")

client = genai.Client(api_key=api_key)

# Define silly products with creative prompts
silly_products = [
    {
        "name": "self-aware-toaster",
        "sizes": ["300x300", "600x600"],
        "prompt": "A retro chrome toaster with an LCD screen displaying judgemental facial expressions and emojis, glowing RGB LED buttons on the side, sitting on a modern kitchen counter, product photography, 4K, professional lighting, slightly humorous but high-quality commercial product photo"
    },
    {
        "name": "invisible-socks",
        "sizes": ["300x300", "600x600"],
        "prompt": "An empty open sock package with a label reading 'Invisible Socks', with slight shimmer effects in the air where socks would be, professional product photography on white background, humorous commercial product photo, 4K quality"
    },
    {
        "name": "telepathic-remote",
        "sizes": ["300x300", "600x600"],
        "prompt": "A futuristic TV remote with glowing brain wave sensors, holographic display showing thought patterns, metallic silver and blue color scheme, floating slightly above surface, professional product photography, 4K, sci-fi aesthetic but commercial quality"
    },
    {
        "name": "self-folding-basket",
        "sizes": ["300x300", "600x600"],
        "prompt": "A high-tech laundry basket with robotic arms inside, LED indicators, sleek modern design with chrome and white plastic, clothes being automatically folded by mechanical arms, professional product photography, 4K, futuristic home appliance"
    },
    {
        "name": "procrastination-timer",
        "sizes": ["300x300", "600x600"],
        "prompt": "A quirky digital timer device with a snooze button that takes up 80% of the surface, tiny start button, display showing 'Maybe Later', retro-futuristic design, sitting on a desk, professional product photography, humorous but commercial quality, 4K"
    },
]

# Additional regular products for e-commerce templates
regular_products = [
    {
        "name": "wireless-headphones",
        "sizes": ["150x150", "200x200", "400x400"],
        "prompt": "Premium over-ear wireless headphones in matte black with rose gold accents, soft leather cushions, modern minimalist design, professional product photography on white background, 4K quality"
    },
    {
        "name": "mechanical-keyboard",
        "sizes": ["150x150", "200x200", "400x400"],
        "prompt": "RGB mechanical gaming keyboard with colorful backlighting, floating keycaps design, black aluminum frame, professional product photography on white background, 4K quality"
    },
    {
        "name": "ergonomic-mouse",
        "sizes": ["150x150", "200x200", "400x400"],
        "prompt": "Wireless ergonomic vertical mouse in matte black, modern design with blue LED accents, professional product photography on white background, 4K quality"
    },
    {
        "name": "usb-c-hub",
        "sizes": ["200x200"],
        "prompt": "Sleek 7-in-1 USB-C hub with multiple ports visible, aluminum body in space gray, professional product photography on white background, 4K quality"
    },
    {
        "name": "monitor-stand",
        "sizes": ["200x200"],
        "prompt": "Adjustable monitor stand in black aluminum with sleek modern design, showing multiple height adjustment levels, professional product photography on white background, 4K quality"
    },
    {
        "name": "desk-mat",
        "sizes": ["200x200"],
        "prompt": "XXL desk mat with geometric dark pattern, extended mouse pad surface, rolled at one corner to show thickness, professional product photography, 4K quality"
    },
    {
        "name": "cable-kit",
        "sizes": ["200x200"],
        "prompt": "Cable management kit with various clips, ties, and organizers arranged neatly, black and gray colors, professional product photography on white background, 4K quality"
    },
]

def generate_image(prompt: str, size: str, output_path: str):
    """Generate a single image using Gemini API"""
    # Determine aspect ratio from size
    width, height = map(int, size.split('x'))
    if width == height:
        aspect_ratio = '1:1'
    elif width > height:
        aspect_ratio = '16:9'
    else:
        aspect_ratio = '9:16'

    print(f"Generating {size} image: {output_path}")

    try:
        response = client.models.generate_content(
            model='imagen-4.0-fast-generate-001',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=['image']
            )
        )

        # Save the generated image
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                with open(output_path, 'wb') as f:
                    f.write(part.inline_data.data)
                print(f"✓ Saved: {output_path}")
                return True

    except Exception as e:
        print(f"✗ Error generating {output_path}: {e}")
        return False

    return False

def main():
    # Create output directory
    output_dir = Path("public/images/products")
    output_dir.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("GENERATING SILLY PRODUCT IMAGES")
    print("=" * 60)

    # Generate silly products
    for product in silly_products:
        print(f"\n📦 {product['name'].replace('-', ' ').title()}")
        for size in product['sizes']:
            output_path = output_dir / f"{product['name']}-{size}.png"
            generate_image(product['prompt'], size, str(output_path))

    print("\n" + "=" * 60)
    print("GENERATING REGULAR PRODUCT IMAGES")
    print("=" * 60)

    # Generate regular products
    for product in regular_products:
        print(f"\n📦 {product['name'].replace('-', ' ').title()}")
        for size in product['sizes']:
            output_path = output_dir / f"{product['name']}-{size}.png"
            generate_image(product['prompt'], size, str(output_path))

    print("\n" + "=" * 60)
    print("GENERATION COMPLETE!")
    print("=" * 60)
    print(f"\nImages saved to: {output_dir.absolute()}")

if __name__ == "__main__":
    main()
