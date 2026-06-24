/**
 * Shared bits of the review-request flow — used by the /review-request
 * tool page (message preview) and the /api/review-request route (the
 * actual Twilio send), so the preview matches the sent text. (Only the
 * link can differ: the server honors the GOOGLE_REVIEW_LINK override,
 * the preview always shows the public profile link.)
 */

export function buildReviewMessage(firstName: string, link: string): string {
  return (
    `Hi ${firstName}, it's Jose with Real Elite Contracting. Thank you for ` +
    `trusting us with your project! If you were happy with our work, would ` +
    `you take 60 seconds to leave us a quick Google review? It means the ` +
    `world to our veteran-owned team: ${link}`
  );
}

/** Normalize US phone input to E.164 (+1XXXXXXXXXX) or return null. */
export function toE164(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}
