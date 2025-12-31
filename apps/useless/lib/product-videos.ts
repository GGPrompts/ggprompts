/**
 * Product Video Configuration
 *
 * Maps product slugs to their SORA-generated video files.
 * Videos are stored in /public/videos/
 *
 * To add a new product video:
 * 1. Generate video with SORA 2
 * 2. Save to public/videos/{product-slug}-sora.mp4
 * 3. Add entry below with slug as key
 */

export interface ProductVideo {
  /** Path to video file (relative to /public) */
  src: string;
  /** Optional poster/thumbnail image */
  poster?: string;
  /** Video aspect ratio */
  aspectRatio?: "video" | "square" | "portrait";
  /** Brief description for alt/aria */
  description?: string;
}

/**
 * Map of product slugs to their video configurations.
 * Only products with SORA videos should be listed here.
 */
export const productVideos: Record<string, ProductVideo> = {
  "quantum-uncertainty-dice": {
    src: "/videos/quantum-dice-sora.mp4",
    description:
      "Quantum dice rolling on a cosmic surface, numbers shifting through superposition before collapsing to reveal impossible probability outcomes",
    aspectRatio: "video",
  },
  "agi-promise-box": {
    src: "/videos/agi-promise-box-reveal.mp4",
    description:
      "Sleek black monolith displaying AGI countdown timer that perpetually shows 6 months away",
    aspectRatio: "video",
  },
  "vibe-coder-energy": {
    src: "/videos/vibe-coder-hallucination.mp4",
    description:
      "Neon energy drink can radiating pure vibe energy for shipping code without debugging",
    aspectRatio: "video",
  },
  // Future videos - uncomment when generated:
  // "git-blame-redirector": {
  //   src: "/videos/git-blame-redirector-sora.mp4",
  //   description: "Animation of git blame arrows redirecting to coworkers",
  //   aspectRatio: "video",
  // },
  // "meeting-escape-band": {
  //   src: "/videos/meeting-escape-band-sora.mp4",
  //   description: "Rubber band propelling office worker through conference room window",
  //   aspectRatio: "video",
  // },
  // "self-aware-toaster": {
  //   src: "/videos/self-aware-toaster-sora.mp4",
  //   description: "A sentient toaster questioning its existence while perfectly browning bread",
  //   aspectRatio: "video",
  // },
};

/**
 * Get video config for a product by slug
 */
export function getProductVideo(slug: string): ProductVideo | null {
  return productVideos[slug] || null;
}

/**
 * Check if a product has a video
 */
export function hasProductVideo(slug: string): boolean {
  return slug in productVideos;
}
