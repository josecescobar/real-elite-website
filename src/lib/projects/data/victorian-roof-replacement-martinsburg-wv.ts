import type { Project } from '../types';

/**
 * Exemplary project — the first record authored on the new Project System.
 *
 * Uses only images already present in /public/images (no new binaries). It
 * demonstrates every facet a real project will carry: relationships (service +
 * city), a before/after reveal, a spec panel, an embedded review, FAQs, and
 * guide cross-links — all public-lens safe.
 */
const project: Project = {
  slug: 'victorian-roof-replacement-martinsburg-wv',
  title: 'Historic Victorian Re-Roof in Martinsburg',
  status: 'published',
  featured: true,

  service: 'roofing',
  citySlug: 'martinsburg-wv',

  completedOn: '2026-05-12',
  durationLabel: '3 days',
  budgetBand: '$18k–$28k',
  style: 'Historic / Victorian',
  materials: [
    { name: 'Architectural Shingles', manufacturer: 'GAF Timberline HDZ' },
    { name: 'Synthetic Underlayment', manufacturer: 'GAF FeltBuster' },
    { name: 'Ridge Vent', manufacturer: 'GAF Cobra' },
    { name: 'Ice & Water Shield' },
  ],

  metaTitle: 'Victorian Roof Replacement in Martinsburg, WV | Real Elite Project',
  metaDescription:
    'A full architectural-shingle re-roof on a historic Victorian home in the Burke Street district of Martinsburg, WV — tear-off, deck repair, and GAF system install in three days.',
  keywords: [
    'roof replacement Martinsburg WV',
    'Victorian roof',
    'architectural shingles',
    'GAF Timberline',
    'historic home roofing',
    'Eastern Panhandle roofing',
  ],
  summary:
    'Real Elite replaced the failing roof on a historic Victorian in Martinsburg, WV — a full tear-off down to the deck, repair of storm-softened sheathing around the dormers, and a complete GAF architectural-shingle system installed in three days, preserving the home’s steep period rooflines.',

  hero: {
    eyebrow: 'Roofing · Martinsburg, WV',
    heading: 'Historic Victorian Re-Roof in Martinsburg',
    sub: 'A failing roof on a steep, dormered Victorian — torn off, re-decked where needed, and rebuilt with a full GAF architectural-shingle system in three days.',
    image: { src: '/images/roofing-victorian-reroof.jpg', alt: 'Finished architectural-shingle roof on a historic Victorian home in Martinsburg, WV' },
  },

  brief: [
    'The owners of a century-old Victorian in Martinsburg’s Burke Street historic district had patched the same roof for years. After a spring storm, granule loss and a slow leak over the upstairs hall told them it was time to stop patching.',
    'They wanted a roof that would last decades without changing the character of the home — the steep pitch, the dormers, and the intricate valleys that define a Victorian roofline had to stay exactly as they were.',
  ],
  challenge: [
    'Historic Victorians are unforgiving: steep slopes, multiple dormers, and narrow valleys mean more flashing, more cut shingles, and far more time than a simple ranch.',
    'Once the old shingles came off, two sections of decking near the rear dormer had softened from years of slow moisture intrusion and had to be replaced before anything new went down.',
  ],
  solution: [
    'We started with a full tear-off to the deck so nothing was hidden. With the sheathing exposed, our crew replaced the compromised decking around the rear dormer and re-secured the loose sections.',
    'A complete GAF system went down next — ice-and-water shield in the valleys and eaves, synthetic underlayment across the field, then GAF Timberline HDZ architectural shingles cut to follow the home’s original lines. A Cobra ridge vent finished the attic ventilation the old roof never had.',
    'The whole job ran three days, start to clean-up, with the same project lead on site from the first measurement to the final magnetic sweep of the yard.',
  ],
  outcome: [
    'A 50-year architectural-shingle roof that looks like it has always belonged on the house — and an attic that finally breathes.',
  ],

  beforeAfter: [
    {
      label: 'Tear-off to finished system',
      before: { src: '/images/roofing-tearoff.jpg', alt: 'Victorian roof torn off to the bare deck before the new system' },
      after: { src: '/images/roofing-complete.jpg', alt: 'Completed GAF architectural-shingle roof on the Victorian home' },
    },
  ],
  gallery: [
    { src: '/images/roofing-shingle-install.jpg', alt: 'Crew installing GAF architectural shingles on the steep Victorian slope' },
    { src: '/images/roofing-valley.jpg', alt: 'Ice-and-water shield and shingles worked into a roof valley' },
    { src: '/images/roofing-ridge-vent.jpg', alt: 'Cobra ridge vent installed along the roof ridge' },
    { src: '/images/roofing-crew.jpg', alt: 'Real Elite roofing crew on the Martinsburg job site' },
  ],

  review: {
    author: 'Mike & Sarah T.',
    location: 'Martinsburg, WV',
    rating: 5,
    quote:
      'Real Elite replaced our entire roof in just two days of real work and left the yard cleaner than they found it. They respected the age of our home and the result looks incredible.',
  },
  faqs: [
    {
      question: 'How long does a roof replacement take on a historic Victorian?',
      answer:
        'For a steep, dormered Victorian like this one, a full tear-off and architectural-shingle install typically runs two to three working days, plus any deck repair discovered once the old roof is off.',
    },
    {
      question: 'Do you repair the decking under the old roof?',
      answer:
        'Yes. We tear off to the bare deck so nothing is hidden, then replace any softened or rotted sheathing before the new system goes down — it is the only way to warranty the result.',
    },
    {
      question: 'What roofing system did this project use?',
      answer:
        'A complete GAF system: ice-and-water shield in the valleys and eaves, synthetic underlayment, GAF Timberline HDZ architectural shingles, and a Cobra ridge vent for proper attic ventilation.',
    },
  ],
  relatedGuideSlugs: [
    '5-signs-you-need-a-new-roof-eastern-panhandle',
    'storm-damage-roof-repair-insurance-eastern-panhandle-2026',
  ],
};

export default project;
