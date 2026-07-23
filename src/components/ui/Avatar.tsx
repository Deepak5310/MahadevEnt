import { cn } from '../../utils/cn'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  name?:      string
  src?:       string
  size?:      AvatarSize
  className?: string
}

/**
 * Avatar — User avatar with image or initials fallback.
 *
 * Generates initials from the first 2 words of `name`.
 * Falls back to '?' when neither src nor name is provided.
 */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('') ?? '?'

  return (
    <div
      className={cn('avatar', `avatar--${size}`, className)}
      role="img"
      aria-label={name ?? 'User avatar'}
    >
      {src
        ? <img src={src} alt={name ?? 'Avatar'} loading="lazy" />
        : <span aria-hidden="true">{initials}</span>
      }
    </div>
  )
}
