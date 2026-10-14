/*
 * Thin wrappers around the gtag / Meta Pixel snippets in index.html.
 *
 * Never pass names, emails, phone numbers, or child ages to Google Analytics —
 * sending personally identifiable information violates their terms. Stick to
 * counts and categories for GA4.
 *
 * Meta Lead may use an event_id only (no PII in the browser call). Hashed PII
 * for matching is sent server-side via the Conversions API.
 */

function readCookie(name) {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', name, params)
}

/** Meta browser Pixel cookies used to improve CAPI match quality. */
export function getMetaClickIds() {
  return {
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
  }
}

/**
 * Browser Lead for Meta Pixel, deduped with CAPI via the same event_id.
 * Call only after a successful signup response.
 */
export function trackMetaLead(eventId) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return
  if (!eventId) return

  window.fbq('track', 'Lead', {}, { eventID: eventId })
}
