/**
 * Copy for /warranty ("Warranty and how we protect your home").
 *
 * Every sentence here is either already published elsewhere on the site or is
 * advice to the homeowner about what to read before signing. Nothing here
 * states a warranty length, a covered term, a response time or a guarantee.
 *
 * ## Why there is no workmanship-warranty promise on this page
 *
 * `written-workmanship-warranty` in src/lib/claims.ts is registered with
 * status 'unconfirmed'. It was withdrawn from shared marketing copy on
 * 2026-09-27 and needs an owner decision before it is published again. The
 * site's approved wording is "Review the proposed scope and warranty terms
 * before signing", and that is what this page builds on. When Jose confirms
 * the written terms (length, what is covered, exclusions, how to file), flip
 * the claim to 'verified' in claims.ts and add them here.
 */

/** The process-page handover list, shared so the two pages never disagree. */
export const HANDOVER_PACKAGE: readonly string[] = [
  'Approved drawings and the as-built set',
  'Selections schedule with product names and finishes',
  'Closed permit and inspection record',
  'Manufacturer warranties, registered where the manufacturer allows',
  'The warranty terms as written in your agreement',
  'Care instructions for stone, cabinetry and decking',
];

/** Published wording (FAQ, about, storm-damage and service pages). */
export const WARRANTY_TERMS_SENTENCE = 'Review the proposed scope and warranty terms before signing.';

/** Published FAQ wording. */
export const MANUFACTURER_COVERAGE_SENTENCE =
  'Manufacturer coverage depends on the selected product and installation requirements.';

/** Process-page close-out step, verbatim. */
export const CLOSE_OUT_SENTENCE =
  'Punch list cleared, permit closed, warranties and as-builts handed over, and a visit after you have lived in the space.';

/**
 * Questions a homeowner should have answered in writing before signing. This
 * is a reading checklist, not a list of terms Real Elite offers.
 */
export const QUESTIONS_TO_ASK: readonly string[] = [
  'Which parts of the work the written warranty covers, and for how long.',
  'What is excluded, such as normal wear, owner changes or products you supplied.',
  'Which manufacturer warranties apply to the products selected, and who registers them.',
  'How to report an issue after the job is finished, and what to have ready when you do.',
  'Who is responsible for each part of the work, including the licensed trades.',
];

/** How the house is protected while the work is under way. Published lines only. */
export const PROTECTION_POINTS: readonly { title: string; body: string }[] = [
  {
    title: 'Protection comes first',
    body: 'The house is protected first, then demolition, structure and rough-ins, inspections, drywall, and the finish work.',
  },
  {
    title: 'Changes in writing',
    body: 'Changes are priced in writing before they are built.',
  },
  {
    title: 'Permits and inspections',
    body: 'Permit applications, town zoning where it applies, and the HOA architectural package are part of the work. A county permit is not HOA approval.',
  },
  {
    title: 'Agree the site rules up front',
    body: 'Discuss site supervision, communication, and cleanup arrangements during the estimate.',
  },
];
