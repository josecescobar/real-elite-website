import type { Project } from '../types';

/**
 * Built on Real Elite's own job-site exterior photography (WV home market).
 * Copy is general (no named customer, no price, no invented specifics).
 *
 * TODO(owner): confirm the city/date match the job these photos came from,
 * and add the customer's consented review — see docs/PROJECT-INTAKE.md.
 */
// REA-55: held until Jose confirms the real job facts and publication permission.
const project: Project = {
  slug: 'stone-facade-exterior-upgrade',
  title: 'Stone Facade Exterior Upgrade',
  status: 'draft',
  // Photo hold (2026-09-27 stock audit): see docs/STOCK-IMAGE-AUDIT-2026-09-27.md.
  needsRealPhotos: true,
  photoNotes: [
    'Removed exterior-brick-victorian.jpg: it is a Pexels stock photo, not this job.',
    'The remaining photos match originals on the T7 drive (Exterior & Sheathing), but those files carry no EXIF, so the city and date cannot be confirmed from the photos. Jose to confirm they are all one job.',
    'stone-facade-finished.jpg and stone-veneer-finish.jpg are only 1024 x 576. Needed: the full-resolution original, plus a daylight wide shot of the finished facade and a matching before photo.',
  ],

  service: 'siding',
  secondaryServices: ['exterior-repairs'],
  citySlug: 'martinsburg-wv',

  // TODO(owner): set to the real completion date.
  completedOn: '2026-04-18',
  style: 'Stone Veneer / Curb Appeal',
  materials: [
    { name: 'Manufactured Stone Veneer' },
    { name: 'Moisture Barrier + Lath System' },
    { name: 'Porch Railing & Trim Package' },
  ],

  metaTitle: 'Stone Facade Exterior Upgrade | Real Elite Project',
  metaDescription:
    'A stone veneer facade upgrade — moisture barrier, lath and hand-set stone that rebuilt the front of the home, plus new railings and trim.',
  keywords: [
    'stone veneer installation WV',
    'exterior facade upgrade',
    'curb appeal remodel',
    'stone siding Eastern Panhandle',
    'exterior contractor Martinsburg',
  ],
  summary:
    'A Real Elite exterior transformation: manufactured stone veneer hand-set over a proper moisture barrier and lath system, paired with new railings and trim — the front of the home rebuilt into its best feature.',

  hero: {
    eyebrow: 'Siding & Exteriors',
    heading: 'Stone Facade Exterior Upgrade',
    sub: 'Moisture barrier, lath, and hand-set stone veneer — plus railings and trim — turning a plain entry into the best feature of the house.',
    image: {
      src: '/images/stone-facade-finished.jpg',
      alt: 'Finished stone veneer porch facade with railings and trim',
    },
  },

  brief: [
    'Curb appeal projects usually start the same way: the house is solid, but the front elevation is flat — builder-grade siding, a plain porch, nothing that makes the home read as cared-for from the street.',
    'Stone veneer at the entry and foundation line is one of the highest-impact exterior moves available: real texture, real shadow lines, and a finish that reads permanent.',
  ],
  challenge: [
    'Stone veneer done wrong fails wet: without a correct moisture barrier and lath assembly behind it, water tracks into the wall and the stone eventually delaminates.',
    'The visible craft is in the joints — consistent coursing, tight cuts around openings, and corners that wrap convincingly.',
  ],
  solution: [
    'We build the wall in layers: weather-resistive barrier, metal lath, scratch coat, then stone hand-set piece by piece with an eye on coursing and joint rhythm.',
    'Corners and terminations get full wrap details, and the porch package — railings and trim — is rebuilt to match the new weight of the facade.',
    'The result is an elevation that reads as masonry, backed by an assembly that manages water the way the wall behind it needs.',
  ],
  outcome: [
    'A front elevation that changed the way the whole house reads from the street.',
  ],

  beforeAfter: [
    {
      label: 'Veneer install to finished facade',
      before: { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer installation in progress on the home exterior' },
      after: { src: '/images/stone-facade-finished.jpg', alt: 'Completed stone facade with railings and trim' },
    },
  ],
  gallery: [
    { src: '/images/stone-veneer-finish.jpg', alt: 'Finished stone veneer detail on home exterior' },
    { src: '/images/siding-window-work.webp', alt: 'Siding and window replacement in progress' },
  ],

  // TODO(owner): add the real customer's consented review here (author first
  // name + city + quote) once collected — see docs/PROJECT-INTAKE.md.

  faqs: [
    {
      question: 'Is manufactured stone veneer durable?',
      answer:
        'Yes — when installed over a correct moisture barrier and lath assembly, manufactured stone veneer lasts decades. The failures you see are almost always water-management failures behind the stone, not the stone itself.',
    },
    {
      question: 'Can stone veneer be added to an existing home?',
      answer:
        'In most cases, yes. Entry surrounds, foundation lines, and porch columns are the most common retrofit locations, and the load is light enough that structural changes are rarely needed.',
    },
    {
      question: 'What exterior upgrades add the most curb appeal?',
      answer:
        'Stone accents, new siding, and a rebuilt entry package consistently deliver the biggest visual change per dollar. Our exterior curb-appeal guide ranks the options for this region.',
    },
  ],
  relatedGuideSlugs: [
    'siding-stone-exterior-curb-appeal-wv-md-va-2026',
  ],
};

export default project;
