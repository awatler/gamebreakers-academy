type BrandLogoProps = {
  size?: number
  className?: string
}

/**
 * BrandLogo
 * GB monogram in a dark stone square with subtle rounded corners.
 * Accepts a `size` prop (in px) so it can scale for navbar/footer/hero use.
 */
export default function BrandLogo({ size = 32, className = '' }: BrandLogoProps) {
  const px = `${size}px`
  const fontSize = size * 0.45

  return (
    <div
      style={{ width: px, height: px, fontSize }}
      className={`flex items-center justify-center rounded-md bg-[#111827] text-[#FDFCF8] font-serif font-extrabold tracking-wide ${className}`}
      aria-label="Gamebreakers Academy"
    >
      <span>GB</span>
    </div>
  )
}

