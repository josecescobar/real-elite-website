import type { Project } from '../types';

/**
 * Built on Real Elite's own job-site construction photography (WV home market).
 * Copy is general (no named customer, no price, no invented specifics).
 *
 * TODO(owner): confirm the city/date match the job these photos came from,
 * and add the customer's consented review — see docs/PROJECT-INTAKE.md.
 */
const project: Project = {
  slug: 'new-construction-framing-to-finish',
  title: 'Custom Addition, Foundation to Finish',
  status: 'published',
  featured: true,

  service: 'additions',
  citySlug: 'inwood-wv',

  // TODO(owner): set to the real completion date.
  completedOn: '2026-03-30',
  style: 'Custom Addition / New Construction',
  materials: [
    { name: 'Block Foundation Piers' },
    { name: 'Dimensional Lumber Framing' },
    { name: 'House Wrap Weather Barrier' },
    { name: 'Architectural Shingle Roof System' },
  ],

  metaTitle: 'Custom Addition, Foundation to Finish | Real Elite Project',
  metaDescription:
    'Foundation piers, framing, weather barrier, and roof — a custom addition built from the ground up. See how Real Elite runs structural work from footers to dried-in shell.',
  keywords: [
    'home addition contractor WV',
    'custom addition Eastern Panhandle',
    'new construction framing',
    'room addition builder',
    'addition contractor Inwood WV',
  ],
  summary:
    'A Real Elite custom addition built from the ground up in the Eastern Panhandle: engineered block foundation, squared and braced framing, house-wrap weather barrier, and a full roof system — the structural scope our additions service delivers, inspected at every phase.',

  hero: {
    eyebrow: 'Additions · Inwood, WV',
    heading: 'Custom Addition, Foundation to Finish',
    sub: 'Block foundation, squared-and-braced framing, weather barrier, and roof — a new structure raised from bare ground and inspected at every phase.',
    image: {
      src: '/images/new-build-sunset.jpg',
      alt: 'New construction addition wrapped in weather barrier at sunset',
    },
  },

  brief: [
    'An addition is the biggest move a homeowner can make without moving: new square footage that has to marry the existing structure so cleanly that, when finished, nobody can tell where the old house ends.',
    'The families who call us for this work want one thing above all — a builder who treats the structure as seriously as the finishes.',
  ],
  challenge: [
    'Additions live or die at the connection: foundations that settle differently, floors that do not plane through, and rooflines that never quite resolve are what bad additions look like five years in.',
    'The work is also inspection-dense — footer, framing, and weather-in milestones each gate the next phase.',
  ],
  solution: [
    'We start in the ground: footers and block piers set below frost line and inspected before a single joist goes down.',
    'Framing is squared, braced, and tied into the existing structure so floor planes carry through; the shell gets wrapped and dried in — house wrap, windows, and the roof system — before interior trades begin.',
    'The same project lead runs the job from layout to final walkthrough, keeping the inspection schedule and the daily updates moving together.',
  ],
  outcome: [
    'New square footage that reads as original to the house — on a structure inspected and documented at every phase.',
  ],

  beforeAfter: [
    {
      label: 'Wrap and framing to dried-in shell',
      before: { src: '/images/house-wrap-worker.jpg', alt: 'House wrap and framing in progress before siding install' },
      after: { src: '/images/new-build-sunset.jpg', alt: 'Finished new construction exterior at sunset' },
    },
  ],
  gallery: [
    { src: '/images/framing-crew.jpg', alt: 'Interior framing crew working on scaffolding' },
    { src: '/images/foundation-block.jpg', alt: 'Block foundation piers for new construction' },
    { src: '/images/crew-dusk.jpg', alt: 'Real Elite crew member framing a custom addition by work light at dusk' },
  ],

  // TODO(owner): add the real customer's consented review here (author first
  // name + city + quote) once collected — see docs/PROJECT-INTAKE.md.

  faqs: [
    {
      question: 'How long does a home addition take to build?',
      answer:
        'Most single-room additions run 2–4 months from groundbreaking to finished interior, driven by inspection milestones: footer, framing, weather-in, and final. We publish the schedule in writing before we break ground.',
    },
    {
      question: 'Do additions require permits and inspections?',
      answer:
        'Always. An addition is new structure — footer, framing, electrical, and final inspections are all part of the sequence, and we manage the full permit process on every job.',
    },
    {
      question: 'Will the addition match the existing house?',
      answer:
        'That is the craft of it: foundations tied correctly, floor planes carried through, and rooflines resolved so the addition reads as original. It is the first thing we design for, not the last.',
    },
  ],
  relatedGuideSlugs: [
    'home-additions-in-law-suites-loudoun-northern-virginia-2026',
  ],
};

export default project;
