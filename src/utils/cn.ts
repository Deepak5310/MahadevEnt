/**
 * cn.ts — Class name merge utility.
 *
 * Filters falsy values and joins class strings.
 * Covers the most common conditional className patterns.
 *
 * Usage:
 *   cn('base', isActive && 'active', disabled && 'disabled')
 *   cn('btn', `btn--${variant}`, className)
 */
export function cn(
  ...inputs: (string | undefined | null | false | 0)[]
): string {
  return inputs.filter(Boolean).join(' ')
}
