import { BUSINESS } from '@/lib/constants';

/**
 * Message copy for the missed-call text-back flow, kept separate from
 * the route so it's unit-testable and easy to tweak without touching
 * webhook plumbing.
 */

/** Auto-text sent to a caller whose call we couldn't pick up. */
export function callerTextBack(): string {
  return (
    `Hi, this is ${BUSINESS.name} — sorry we missed your call! We're likely ` +
    `out on a job site. Reply here with your name and what you need and we'll ` +
    `get right back to you, or call us at ${BUSINESS.phone}. Thanks for ` +
    `reaching out!`
  );
}

/**
 * Alert sent to the owner so they know to call the missed caller back.
 * This is an owner alert, not a customer text. `customerTexted` must be
 * true only when the caller text-back was actually accepted.
 */
export function ownerMissedAlert(callerNumber: string, customerTexted = false): string {
  const followUp = customerTexted
    ? "They got an auto-text back. Call them when you're free."
    : 'No auto-text was sent. Call them when you are free.';
  return `📞 Missed call — ${BUSINESS.name}\nFrom: ${callerNumber}\n${followUp}`;
}

/**
 * A Dial result counts as "answered" only for these statuses; anything
 * else (no-answer, busy, failed, canceled) triggers the text-back.
 */
export function wasAnswered(dialCallStatus: string | undefined): boolean {
  return dialCallStatus === 'completed' || dialCallStatus === 'answered';
}
