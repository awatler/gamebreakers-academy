/*
 * Thin wrapper around the gtag snippet in index.html.
 *
 * Never pass names, emails, phone numbers, or child ages here — sending
 * personally identifiable information to Google Analytics violates their terms.
 * Stick to counts and categories.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', name, params)
}
