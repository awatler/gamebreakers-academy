/** Minimalist bold "G" silhouette for Gamebreakers Leagues. */
export default function Logo({ className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Bold uppercase G: arc left/down + base + stem + crossbar */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6zm.5 4v5c-1.4-.1-2.6.5-3.4 1.4-.9 1-1.3 2.3-1 3.6.3 1.3 1 2.4 2 3 .9.6 2 .8 3.1.5l.4 2.3c-1.5.3-3 .1-4.3-.7-1.4-.8-2.3-2.1-2.6-3.6-.2-1.5.2-3 1.2-4.2 1-1.1 2.5-1.7 4-1.5V10h2z"
      />
    </svg>
  )
}
