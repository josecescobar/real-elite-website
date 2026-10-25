/**
 * Owner speed-to-lead SMS. Attacker-controlled fields are stripped of URLs
 * and the finished body is length-capped so a crafted lead cannot turn
 * Jose's phone into a phishing channel or a giant message.
 */

const URL_RE =
  /(?:https?:\/\/|www\.)[^\s<>"']+|\b(?:[a-z0-9-]+\.)+[a-z]{2,24}\b(?:\/[^\s<>"']*)?/gi;

export const OWNER_SMS_MAX_CHARS = 480;

export function sanitizeSmsText(value: string): string {
  return value
    .replace(URL_RE, ' ')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function capSmsBody(body: string, max = OWNER_SMS_MAX_CHARS): string {
  const clean = body.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export type OwnerLeadSmsInput = {
  fullName: string;
  service: string;
  town?: string;
  budgetRange?: string;
  timeline?: string;
  zip?: string;
  phone: string;
};

export function buildOwnerLeadSms(input: OwnerLeadSmsInput): string {
  const name = sanitizeSmsText(input.fullName) || 'New lead';
  const service = sanitizeSmsText(input.service) || 'Estimate';
  const isLuxury = input.service.startsWith('[Luxury Consultation]');
  const town = input.town ? sanitizeSmsText(input.town) : '';
  const budget = input.budgetRange ? sanitizeSmsText(input.budgetRange) : '';
  const timeline = input.timeline ? sanitizeSmsText(input.timeline) : '';
  const zip = input.zip ? sanitizeSmsText(input.zip) : '';
  const phone = sanitizeSmsText(input.phone);

  const lines = [
    isLuxury ? '🔔 LUXURY LEAD' : '🔔 New Lead',
    `${name} · ${service}`,
    town ? `Town: ${town}` : null,
    budget ? `Budget: ${budget}` : null,
    timeline ? `Timeline: ${timeline}` : null,
    zip ? `ZIP: ${zip}` : null,
    `📞 ${phone}`,
    '— Real Elite',
  ].filter((line): line is string => Boolean(line));

  return capSmsBody(lines.join('\n'));
}
