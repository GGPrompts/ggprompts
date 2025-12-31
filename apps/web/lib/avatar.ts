// Avatar utility functions for consistent avatar generation
// Uses OAuth avatars when available, DiceBear as fallback

const DICEBEAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'identicon',
  'lorelei',
  'lorelei-neutral',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'thumbs'
] as const

export type DiceBearStyle = typeof DICEBEAR_STYLES[number]

/**
 * Generate a consistent hash from a string
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate a DiceBear avatar URL
 * Consistently generates the same avatar for the same seed
 */
export function generateDiceBearAvatar(
  seed: string,
  style?: DiceBearStyle,
  size: number = 128
): string {
  // If no style specified, pick one consistently based on the seed
  const selectedStyle = style || DICEBEAR_STYLES[hashString(seed) % DICEBEAR_STYLES.length]
  const encodedSeed = encodeURIComponent(seed)
  return `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodedSeed}&size=${size}`
}

/**
 * Get the best available avatar URL for a user
 * Priority: Database avatar (user's choice) > OAuth avatar > DiceBear generated
 */
export function getAvatarUrl(
  user: {
    id?: string
    email?: string
    user_metadata?: {
      avatar_url?: string
      picture?: string // Google uses 'picture'
    }
  },
  profile?: {
    avatar_url?: string | null
    username?: string | null
  }
): string {
  // 1. Check database avatar_url first (user's explicit choice takes priority)
  if (profile?.avatar_url) {
    return profile.avatar_url
  }

  // 2. Fall back to OAuth avatar from user metadata (GitHub, Google, etc.)
  const oauthAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
  if (oauthAvatar) {
    return oauthAvatar
  }

  // 3. Generate DiceBear avatar from username, email, or user ID
  const seed = profile?.username || user.email || user.id || 'anonymous'
  return generateDiceBearAvatar(seed)
}

/**
 * Get initials from a name or email
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return 'A'

  // If it's an email, get the part before @
  const cleanName = name.includes('@') ? name.split('@')[0] : name

  // Split by common separators and get first letter of each part
  const parts = cleanName.split(/[\s._-]+/).filter(part => part.length > 0)

  if (parts.length === 0) return 'A'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()

  // Return first letter of first two parts
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

/**
 * Get all available DiceBear styles for a style picker
 */
export function getDiceBearStyles(): readonly DiceBearStyle[] {
  return DICEBEAR_STYLES
}

/**
 * Preview multiple DiceBear styles for a given seed
 */
export function previewAvatarStyles(seed: string, size: number = 64): Array<{ style: DiceBearStyle; url: string }> {
  return DICEBEAR_STYLES.map(style => ({
    style,
    url: generateDiceBearAvatar(seed, style, size)
  }))
}
