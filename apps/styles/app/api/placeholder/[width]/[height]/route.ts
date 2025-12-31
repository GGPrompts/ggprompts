import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

// Map common placeholder sizes to actual generated images
const IMAGE_MAP: Record<string, string> = {
  // User Avatars - Small (table rows, lists)
  '32x32': 'avatars/at-32x32.png',
  '32/32': 'avatars/at-32x32.png',

  // User Avatars - Medium (sidebar, profile lists)
  '40x40': 'avatars/at-40x40.png',
  '40/40': 'avatars/at-40x40.png',

  // Product Thumbnails - Checkout/Cart
  '100x100': 'products/wireless-headphones-150x150.png',
  '100/100': 'products/wireless-headphones-150x150.png',

  // Company Logo
  '120x40': 'products/wireless-headphones-150x150.png',
  '120/40': 'products/wireless-headphones-150x150.png',

  // Search thumbnails
  '120x80': 'portfolio/case-study-400x300.png',
  '120/80': 'portfolio/case-study-400x300.png',

  // User Avatars - Large (resume, profile page)
  '128x128': 'avatars/at-128x128.png',
  '128/128': 'avatars/at-128x128.png',

  // User Avatars - Settings page / Product Images - Cart items
  '150x150': 'avatars/at-150x150.png',
  '150/150': 'avatars/at-150x150.png',

  // Product Images - Recommendations
  '200x200': 'products/wireless-headphones-200x200.png',
  '200/200': 'products/wireless-headphones-200x200.png',

  // Cover/Banner images
  '1200x300': 'portfolio/featured-work-1200x600.png',
  '1200/300': 'portfolio/featured-work-1200x600.png',

  // Product Images - Comparison, silly products
  '300x300': 'products/self-aware-toaster-300x300.png',
  '300/300': 'products/self-aware-toaster-300x300.png',

  // Portfolio thumbnails (bento grid small)
  '400x300': 'portfolio/case-study-400x300.png',
  '400/300': 'portfolio/case-study-400x300.png',

  // Link previews, post thumbnails
  '400x200': 'portfolio/recent-work-400x300.png',
  '400/200': 'portfolio/recent-work-400x300.png',

  // Product Images - Product listing cards
  '400x400': 'products/wireless-headphones-400x400.png',
  '400/400': 'products/wireless-headphones-400x400.png',

  // Social media posts, portfolio cards
  '600x400': 'portfolio/featured-project-600x400.png',
  '600/400': 'portfolio/featured-project-600x400.png',

  // Product Images - Detail gallery, silly products
  '600x600': 'products/self-aware-toaster-600x600.png',
  '600/600': 'products/self-aware-toaster-600x600.png',

  // Portfolio projects main
  '800x600': 'portfolio/e-commerce-platform-800x600.png',
  '800/600': 'portfolio/e-commerce-platform-800x600.png',

  // Portfolio secondary featured
  '800x500': 'portfolio/main-project-800x500.png',
  '800/500': 'portfolio/main-project-800x500.png',

  // Hero images, banners
  '1200x600': 'portfolio/featured-work-1200x600.png',
  '1200/600': 'portfolio/featured-work-1200x600.png',

  // Landscape format images
  '1344x768': 'portfolio/featured-work-1200x600.png',
  '1344/768': 'portfolio/featured-work-1200x600.png',
};

// Fallback image for unmapped sizes
const DEFAULT_IMAGE = 'products/wireless-headphones-400x400.png';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ width: string; height: string }> }
) {
  const { width, height } = await params;

  // Create size key (support both x and / separators)
  const sizeKey = `${width}x${height}`;
  const slashKey = `${width}/${height}`;

  // Find the appropriate image
  const imagePath = IMAGE_MAP[sizeKey] || IMAGE_MAP[slashKey] || DEFAULT_IMAGE;
  const fullPath = path.join(process.cwd(), 'public', 'images', imagePath);

  try {
    const imageBuffer = await readFile(fullPath);

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error(`Error loading image: ${fullPath}`, error);

    // Return a simple colored rectangle as ultimate fallback
    return new Response(
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      ),
      {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  }
}

export const dynamic = 'force-static';
export const revalidate = false;
