# Avatars

GGPrompts uses a moderation-free avatar system that combines OAuth profile pictures with DiceBear-generated avatars.

## Priority System

Avatars are resolved in this order:

1. **OAuth Avatar** - If user signed in via GitHub/Google, use their profile picture
2. **Database Avatar** - If user has a saved `avatar_url` in the database
3. **DiceBear Generated** - Auto-generate a unique avatar from username

This approach requires no content moderation since:
- OAuth avatars are moderated by the provider (GitHub, Google)
- DiceBear avatars are algorithmically generated

## Avatar Utility

Located at `lib/avatar.ts`:

### `getAvatarUrl(user, profile)`

Get the best available avatar URL for a user:

```typescript
import { getAvatarUrl } from '@/lib/avatar'

const avatarUrl = getAvatarUrl(user, {
  avatar_url: profile?.avatar_url,
  username: profile?.username
})
```

### `generateDiceBearAvatar(seed, style?, size?)`

Generate a DiceBear avatar URL:

```typescript
import { generateDiceBearAvatar } from '@/lib/avatar'

// Auto-select style based on seed
const url = generateDiceBearAvatar('username')

// Specific style
const url = generateDiceBearAvatar('username', 'avataaars', 128)
```

### `getInitials(name)`

Get initials for avatar fallback:

```typescript
import { getInitials } from '@/lib/avatar'

getInitials('John Doe')      // 'JD'
getInitials('john.doe')      // 'JD'
getInitials('john@email.com') // 'JO'
```

### `getDiceBearStyles()`

Get all available DiceBear styles:

```typescript
import { getDiceBearStyles } from '@/lib/avatar'

const styles = getDiceBearStyles()
// ['adventurer', 'avataaars', 'bottts', ...]
```

## DiceBear Styles

20 avatar styles available:

- `adventurer` / `adventurer-neutral`
- `avataaars`
- `big-ears` / `big-ears-neutral`
- `big-smile`
- `bottts`
- `croodles` / `croodles-neutral`
- `fun-emoji`
- `identicon`
- `lorelei` / `lorelei-neutral`
- `micah`
- `miniavs`
- `open-peeps`
- `personas`
- `pixel-art` / `pixel-art-neutral`
- `thumbs`

## Consistent Style Selection

When no style is specified, the system picks one consistently based on the seed:

```typescript
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

// Same username always gets same style
const styleIndex = hashString(username) % styles.length
const style = styles[styleIndex]
```

## Settings Page Integration

The Settings page lets users randomize their avatar style:

```tsx
// Show style picker
const [avatarStyle, setAvatarStyle] = useState<string | null>(null)

const randomizeAvatarStyle = () => {
  const styles = getDiceBearStyles()
  const randomStyle = styles[Math.floor(Math.random() * styles.length)]
  setAvatarStyle(randomStyle)
}

// Preview multiple styles
{getDiceBearStyles().slice(0, 10).map((style) => (
  <button onClick={() => setAvatarStyle(style)}>
    <img src={generateDiceBearAvatar(username, style, 48)} />
  </button>
))}
```

## Usage in Components

### With shadcn Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getAvatarUrl, getInitials } from '@/lib/avatar'

function UserAvatar({ user, profile }) {
  const avatarUrl = getAvatarUrl(user, profile)

  return (
    <Avatar>
      <AvatarImage src={avatarUrl} />
      <AvatarFallback>
        {getInitials(profile?.display_name || profile?.username)}
      </AvatarFallback>
    </Avatar>
  )
}
```

### In Forum Posts/Comments

```tsx
const avatarUrl = post.users?.avatar_url
  || generateDiceBearAvatar(post.users?.username || 'anonymous')
```

## DiceBear API

Avatars are generated via the DiceBear API:

```
https://api.dicebear.com/7.x/{style}/svg?seed={seed}&size={size}
```

- **style**: One of the 20 available styles
- **seed**: String to generate consistent avatar (username, email, etc.)
- **size**: Image size in pixels (default: 128)

No API key required. Free for any use.
