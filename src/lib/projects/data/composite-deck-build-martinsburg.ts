import type { Project } from '../types';

/**
 * Built on Real Elite's own job-site deck photography (WV home market).
 * Copy is general (no named customer, no price, no invented specifics).
 *
 * TODO(owner): confirm the city/date match the job these photos came from,
 * and add the customer's consented review — see docs/PROJECT-INTAKE.md.
 */
const project: Project = {
  slug: 'composite-deck-build-martinsburg',
  title: 'Composite Deck Build',
  status: 'published',
  featured: true,

  service: 'decks',
  citySlug: 'martinsburg-wv',

  // TODO(owner): set to the real completion date.
  completedOn: '2026-05-28',
  style: 'Composite / Outdoor Living',
  materials: [
    { name: 'Composite Decking' },
    { name: 'Pressure-Treated Framing' },
    { name: 'White Horizontal Railing System' },
    { name: 'Solar Post Cap Lighting' },
  ],

  metaTitle: 'Composite Deck Build in Martinsburg, WV | Real Elite Project',
  metaDescription:
    'From framing to finished outdoor room: a composite deck build with white railings and post lighting. See how Real Elite engineers, permits, and builds a deck that lasts.',
  keywords: [
    'composite deck builder Martinsburg WV',
    'deck construction Eastern Panhandle',
    'composite decking',
    'deck contractor WV',
    'outdoor living',
  ],
  summary:
    'A Real Elite composite deck build in the Eastern Panhandle: engineered framing on proper footers, low-maintenance composite decking, white horizontal railings, and solar post lighting — a backyard turned into a true outdoor room.',

  hero: {
    eyebrow: 'Decks · Martinsburg, WV',
    heading: 'Composite Deck Build',
    sub: 'Engineered framing, low-maintenance composite decking, white railings, and post lighting — from bare backyard to finished outdoor room.',
    image: {
      src: '/images/deck-finished-railings.jpg',
      alt: 'Composite deck with white horizontal railings and stairs',
    },
  },

  brief: [
    'The homeowners wanted what most of our deck clients want: an outdoor space they can actually use — dinner outside, room to entertain, and no weekend sanding-and-staining ritual to keep it looking good.',
    'Composite decking with a clean white railing package was the answer: the look of a painted rail with none of the maintenance.',
  ],
  challenge: [
    'A deck is a structure first and a surface second. Footer depth, ledger attachment, joist spacing, and hardware are what decide whether a deck is still solid in year fifteen — and they are all invisible in the finished photos.',
    'Berkeley and Jefferson County both permit and inspect deck construction, so the framing has to be right before it is ever skinned.',
  ],
  solution: [
    'We handle the permit and drawings, then build the frame the inspection wants to see: proper footers below frost line, a flashed and bolted ledger, and joists sized and spaced for composite spans.',
    'Composite boards go down with hidden fasteners for a clean face, the railing system is set plumb and true, and solar post caps finish the build — light for evening use with zero wiring to maintain.',
    'The site gets a full cleanup and magnetic sweep, and the homeowners get a written workmanship warranty on the structure.',
  ],
  outcome: [
    'An outdoor room that gets used from spring through late fall — and a frame built to outlast the boards on top of it.',
  ],

  beforeAfter: [
    {
      label: 'Framing to finished deck',
      before: { src: '/images/deck-construction.jpg', alt: 'Deck framing during construction phase' },
      after: { src: '/images/deck-finished-railings.jpg', alt: 'Finished composite deck with white horizontal railings' },
    },
  ],
  gallery: [
    { src: '/images/deck-night-lights.jpg', alt: 'Finished deck with solar post lights at night' },
    { src: '/images/deck-lounge.jpg', alt: 'Deck with outdoor lounge furniture set' },
    { src: '/images/deck-railing-install.jpg', alt: 'Installing white railing on composite deck' },
    { src: '/images/deck-screened-porch.jpg', alt: 'Screened porch with stained wood ceiling and black railings' },
  ],

  // TODO(owner): add the real customer's consented review here (author first
  // name + city + quote) once collected — see docs/PROJECT-INTAKE.md.

  faqs: [
    {
      question: 'Do I need a permit to build a deck in the Eastern Panhandle?',
      answer:
        'In most cases, yes — Berkeley and Jefferson County both permit and inspect deck construction. We handle the drawings, the permit, and the inspection scheduling as part of every deck build.',
    },
    {
      question: 'Is composite decking worth the cost over pressure-treated wood?',
      answer:
        'If you plan to keep the home, usually yes: composite costs more up front but eliminates the yearly staining cycle and holds its look for decades. Our deck material guide walks through the honest trade-offs.',
    },
    {
      question: 'How long does a deck build take?',
      answer:
        'Most decks run 1–3 weeks on site once the permit is issued — footers and framing first, then decking, railings, and finish details.',
    },
  ],
  relatedGuideSlugs: [
    'deck-cost-per-square-foot-eastern-panhandle-2026',
    'deck-permits-berkeley-jefferson-county-wv-2026',
    'how-to-choose-deck-material-west-virginia-weather',
  ],
};

export default project;
