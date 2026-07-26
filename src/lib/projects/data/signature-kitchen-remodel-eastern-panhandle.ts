import type { Project } from '../types';

/**
 * Capability showcase — built on the site's existing kitchen photography.
 * Copy is intentionally general (no named customer, no price, no invented
 * specifics); it describes how Real Elite executes this class of project.
 *
 * TODO(owner): replace the placeholder city/date with a real completed job's
 * details, and add the customer's consented review — see docs/PROJECT-INTAKE.md.
 */
const project: Project = {
  slug: 'signature-kitchen-remodel-eastern-panhandle',
  title: 'Signature Kitchen Remodel',
  status: 'published',
  featured: true,

  service: 'kitchens',
  // TODO(owner): set to the real job's city slug.
  citySlug: 'martinsburg-wv',

  // TODO(owner): set to the real completion date.
  completedOn: '2026-06-20',
  style: 'Transitional / Custom Island',
  materials: [
    { name: 'Custom Cabinetry' },
    { name: 'Natural Stone Countertops' },
    { name: 'Designer Pendant Lighting' },
    { name: 'Tile Backsplash' },
  ],

  metaTitle: 'Signature Kitchen Remodel | Real Elite Project',
  metaDescription:
    'Custom cabinetry, a stone-topped island and layered lighting — how Real Elite runs a full kitchen remodel from demo day to final walkthrough.',
  keywords: [
    'kitchen remodel WV',
    'kitchen renovation Eastern Panhandle',
    'custom kitchen island',
    'kitchen contractor Martinsburg',
    'kitchen remodeling MD VA',
  ],
  summary:
    'A signature Real Elite kitchen build: the dated, closed-in kitchen gives way to an open plan anchored by a stone-topped island, custom cabinetry to the ceiling, and layered designer lighting — the full scope of what our kitchen remodeling service delivers.',

  hero: {
    eyebrow: 'Kitchens',
    heading: 'Signature Kitchen Remodel',
    sub: 'Custom cabinetry, a stone-topped island, and layered lighting — a complete kitchen transformation, managed by one project lead from demo day to final walkthrough.',
    image: {
      src: '/images/projects/kitchens/hero.jpg',
      alt: 'Remodeled white kitchen with double islands and lantern pendant lighting',
    },
  },

  brief: [
    'The most requested project on our books: a kitchen that still works like the house was built — closed off from the living space, short on counter run, lit by a single ceiling fixture — in a home whose owners cook every day and host every holiday.',
    'The goal in a build like this is never just new finishes. It is a working layout: an island the family can gather around, storage engineered to the ceiling, and task lighting where the actual work happens.',
  ],
  challenge: [
    'Kitchens carry every trade in the house — demolition, framing, electrical, plumbing, drywall, cabinetry, tile, and finish carpentry — usually in a home the family is still living in.',
    'Sequencing is the hard part. Cabinet lead times, counter templating (which cannot happen until cabinets are set), and inspection windows all have to land in order, or the schedule falls apart.',
  ],
  solution: [
    'We run every kitchen on a written scope and schedule before demo starts, with allowances locked for cabinetry, counters, and fixtures so there are no mid-project surprises.',
    'One project lead owns the job: the same person who walks the space on day one coordinates the trades, schedules inspections, and sends the daily update.',
    'Finish work is where a kitchen reads as custom — cabinetry scribed to the wall, backsplash laid out from the sightline in, and lighting layered in three levels: cans for the room, pendants for the island, under-cabinet for the counters.',
  ],
  outcome: [
    'A kitchen that works the way the family lives — and reads as the signature room of the house.',
  ],

  gallery: [
    { src: '/images/projects/kitchens/island-lantern-pendants.jpg', alt: 'White kitchen with marble-topped island and lantern pendants' },
    { src: '/images/projects/kitchens/gray-marble-waterfall.jpg', alt: 'Modern gray kitchen with marble waterfall island and chrome chandelier' },
    { src: '/images/projects/kitchens/white-herringbone.jpg', alt: 'White kitchen with herringbone backsplash and shiplap ceiling' },
    { src: '/images/projects/kitchens/white-island-chairs.jpg', alt: 'Open white kitchen with center island and navy chairs' },
    { src: '/images/projects/kitchens/two-tone-black-hood.jpg', alt: 'Two-tone kitchen with dark cabinetry, warm wood uppers, and black hood' },
  ],

  // TODO(owner): add the real customer's consented review here (author first
  // name + city + quote) once collected — see docs/PROJECT-INTAKE.md.

  faqs: [
    {
      question: 'How long does a full kitchen remodel take?',
      answer:
        'Most full kitchen remodels run 6–10 weeks of on-site work once cabinetry arrives. We give you a written timeline before demo begins and update you daily as the job runs.',
    },
    {
      question: 'Can we live in the house during a kitchen remodel?',
      answer:
        'Yes — most of our clients do. We contain the work zone, keep water and power live outside working hours, and help you set up a temporary kitchen station so the household keeps running.',
    },
    {
      question: 'What drives the cost of a kitchen remodel?',
      answer:
        'Cabinetry is usually the largest single line, followed by countertops and any layout changes that move plumbing or walls. Our kitchen cost guide breaks down the real ranges for the WV–MD–VA region.',
    },
  ],
  relatedGuideSlugs: [
    'kitchen-remodel-cost-wv-md-va-2026',
    'financing-a-kitchen-remodel-options-2026',
  ],
};

export default project;
