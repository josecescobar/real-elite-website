import type { Project } from '../types';

/**
 * Capability showcase — built on the site's existing bathroom photography.
 * Copy is intentionally general (no named customer, no price, no invented
 * specifics); it describes how Real Elite executes this class of project.
 *
 * TODO(owner): replace the placeholder city/date with a real completed job's
 * details, and add the customer's consented review — see docs/PROJECT-INTAKE.md.
 */
const project: Project = {
  slug: 'walk-in-shower-bathroom-remodel',
  title: 'Walk-In Shower Bathroom Remodel',
  status: 'published',

  service: 'bathrooms',
  // TODO(owner): set to the real job's city slug.
  citySlug: 'martinsburg-wv',

  // TODO(owner): set to the real completion date.
  completedOn: '2026-06-05',
  style: 'Modern / Spa',
  materials: [
    { name: 'Large-Format Tile' },
    { name: 'Frameless Glass Enclosure' },
    { name: 'Waterproofing Membrane System' },
    { name: 'Linear Drain' },
  ],

  metaTitle: 'Walk-In Shower Bathroom Remodel | Real Elite Project',
  metaDescription:
    'A tub-to-walk-in-shower conversion — full waterproofing, floor-to-ceiling tile and frameless glass, built from tear-out to final seal.',
  keywords: [
    'bathroom remodel WV',
    'walk-in shower conversion',
    'tub to shower remodel',
    'bathroom contractor Eastern Panhandle',
    'frameless glass shower',
  ],
  summary:
    'A signature Real Elite bathroom build: the rarely-used tub comes out and a full-height tiled walk-in shower goes in — waterproofed as a system, finished in floor-to-ceiling tile, and closed with frameless glass. This is the scope our bathroom remodeling service delivers.',

  hero: {
    eyebrow: 'Bathrooms',
    heading: 'Walk-In Shower Bathroom Remodel',
    sub: 'Tub out, full-height tiled walk-in shower in — waterproofed as a system, tiled floor to ceiling, and finished with frameless glass.',
    image: {
      src: '/images/projects/bathrooms/hero.jpg',
      alt: 'Custom marble walk-in shower with frameless glass enclosure',
    },
  },

  brief: [
    'The most common bathroom request we hear: the tub gets used a handful of times a year, the shower gets used twice a day, and the room should reflect that.',
    'A tub-to-walk-in-shower conversion is the anchor move — paired with new tile, a modern vanity, and lighting that finally flatters the room.',
  ],
  challenge: [
    'Everything that matters in a shower build is invisible on day one and unforgiving in year five. Waterproofing is not a product — it is a system: pan, membrane, seams, and penetrations that all have to work together.',
    'Bathrooms are also the tightest rooms in the house to sequence: plumbing rough-in, inspection, board, waterproofing, tile, glass templating, and fixtures all stack in a space where only one trade fits at a time.',
  ],
  solution: [
    'We open the wet walls to the studs — never tile over a problem — correct any framing or subfloor issues found, and rough in the new valve and drain locations before inspection.',
    'The waterproofing system goes in as a continuous assembly, flood-tested where applicable, before a single tile is set. Tile is laid out from the sightline in, so cuts land where the eye never goes.',
    'Frameless glass is templated after tile and set as the final trade, followed by the silicone seal and a full punch-list walkthrough.',
  ],
  outcome: [
    'A bathroom that works like a daily-driver and reads like a spa — built on waterproofing that will outlast the finishes.',
  ],

  gallery: [
    { src: '/images/projects/bathrooms/shower-stone-accent.jpg', alt: 'Modern bathroom with stone accent wall and walk-in glass shower' },
    { src: '/images/projects/bathrooms/shower-black-frame.jpg', alt: 'Contemporary walk-in shower with black-frame glass and wood-look tile' },
    { src: '/images/projects/bathrooms/tub-shower-tile.jpg', alt: 'Tile tub-and-shower combination with frameless glass' },
  ],

  // TODO(owner): add the real customer's consented review here (author first
  // name + city + quote) once collected — see docs/PROJECT-INTAKE.md.

  faqs: [
    {
      question: 'How long does a bathroom remodel take?',
      answer:
        'A full bathroom remodel typically runs 3–5 weeks on site. Tub-to-shower conversions land in the same window because the critical path — rough-in, inspection, waterproofing, tile, glass — is the same.',
    },
    {
      question: 'Is a walk-in shower conversion a good idea for resale?',
      answer:
        'In most homes, yes — as long as at least one bathtub remains in the house. Buyers with young children look for one tub; beyond that, a well-built walk-in shower is the stronger draw.',
    },
    {
      question: 'What does a walk-in shower cost in this region?',
      answer:
        'It depends on size, tile selection, and glass. Our walk-in shower cost guide publishes the real ranges we see across WV, MD, and VA.',
    },
  ],
  relatedGuideSlugs: [
    'walk-in-shower-cost-wv-md-va-2026',
    'how-to-plan-luxury-bathroom-renovation-choose-contractor-2026',
  ],
};

export default project;
