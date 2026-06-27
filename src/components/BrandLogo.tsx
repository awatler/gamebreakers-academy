type BrandLogoProps = {
  size?: number
  className?: string
  variant?: 'light' | 'dark'
}

/**
 * BG mark — overlapping B + G per brand kit.
 * light: black B + green G (navbar, light backgrounds)
 * dark:  white B + green G (footer, dark backgrounds)
 */
export default function BrandLogo({ size = 32, className = '', variant = 'light' }: BrandLogoProps) {
  const letterSize = size * 0.58
  const bColor = variant === 'dark' ? 'text-white' : 'text-ink'
  const gColor = 'text-forest'

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-label="Brooklyn Gamebreakers"
    >
      <span
        className={`absolute left-0 top-0 z-10 font-display font-bold leading-none ${bColor}`}
        style={{ fontSize: letterSize }}
        aria-hidden
      >
        B
      </span>
      <span
        className={`absolute z-20 font-display font-bold leading-none ${gColor}`}
        style={{ fontSize: letterSize, left: size * 0.32, top: size * 0.2 }}
        aria-hidden
      >
        G
      </span>
    </div>
  )
}
