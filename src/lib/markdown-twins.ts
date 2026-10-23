/**
 * Builds public/llms.txt and the root markdown twins from page copy that
 * already lives in constants and service data. Run via
 * `npm run generate:markdown-twins` (also hooked from prebuild).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import {
  ALL_SERVICE_AREAS,
  BUSINESS,
  CITY_DATA,
  FAMILY_RUN,
  SERVICES,
  areaHeroLane,
  servicePillarHref,
} from '@/lib/constants';
import { INVESTMENT_GUIDE } from '@/lib/investment-guide';
import { FREE_FIRST_VISIT_SENTENCE } from '@/lib/project-trust';
import { SERVICE_DATA } from '@/lib/services-data';

const SITE = BUSINESS.url;

const EXCLUDED_SERVICE_SLUGS = new Set(['handyman', 'general-repairs', 'exterior-repairs']);

const SERVICE_TWIN_SLUGS = ['kitchens', 'bathrooms', 'basements', 'additions', 'decks', 'outdoor-living'] as const;

const AREA_TWIN_SLUGS = ['loudoun-county-va', 'fairfax-county-va', 'frederick-md'] as const;

const SIGNATURE_SLUGS = ['lower-levels', 'kitchens', 'primary-suites', 'outdoor-living', 'additions'] as const;

const LICENSE_NUMBER = /\b(?:WV\d{5,}|PA\d{5,}|2705198604)\b/;
const INSPIRATION_LABEL = /\binspiration\b/i;
const MARYLAND_CAVEAT =
  /not a Maryland licen|no Maryland (?:contractor )?licen|Maryland licensing claim|service-area mention|not licensed in Maryland|licensed in Maryland|without a Maryland licen/i;
const BLOCKED = [
  LICENSE_NUMBER,
  INSPIRATION_LABEL,
  MARYLAND_CAVEAT,
  /Morgan County/i,
  /\bhandyman\b/i,
  /general repairs/i,
  /exterior repairs/i,
  /veteran-owned/i,
];

export type TwinFile = {
  publicPath: string;
  urlPath: string;
  body: string;
};

function blocked(text: string): boolean {
  return BLOCKED.some((pattern) => pattern.test(text));
}

function keep(text: string): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.trim() && !blocked(sentence))
    .join(' ')
    .trim();
}

function section(parts: Array<string | false | undefined>): string {
  return parts
    .flatMap((part) => {
      if (!part) return [];
      const trimmed = part.trim();
      if (!trimmed || blocked(trimmed)) {
        const salvaged = keep(trimmed);
        return salvaged ? [salvaged] : [];
      }
      return [trimmed];
    })
    .join('\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

function assertClean(text: string, label: string): string {
  const body = `${text.trim()}\n`;
  if (body.trim().length < 80) throw new Error(`${label} is empty`);
  for (const pattern of BLOCKED) {
    if (pattern.test(body)) throw new Error(`${label} still matches ${pattern}`);
  }
  return body;
}

function pageUrl(route: string): string {
  return `${SITE}${route}`;
}

function places(state: string): string[] {
  return ALL_SERVICE_AREAS.filter(
    (area) => area.state === state && !/morgan/i.test(area.slug) && !/morgan/i.test(area.city),
  ).map((area) => area.city);
}

function listedServices() {
  return SERVICES.filter((service) => !EXCLUDED_SERVICE_SLUGS.has(service.slug));
}

function homeTwin(): TwinFile {
  const signature = SIGNATURE_SLUGS.map((slug) => {
    const card = INVESTMENT_GUIDE.find((item) => item.slug === slug);
    if (!card) return '';
    return `- ${card.title}. ${card.tagline} ${pageUrl(card.href)}`;
  }).filter(Boolean);

  const body = section([
    'Source: /',
    '# Real Elite Contracting',
    'Loudoun County, Virginia · Family-Run Design-Build',
    'Design-build remodeling for Loudoun homes.',
    'Kitchens, primary suites, lower levels, additions and outdoor living for Leesburg, Ashburn, Middleburg and Hunt Country. One design, one contract, one project lead from the first call to the final walkthrough.',
    'Signature projects. The rooms that change how a house lives.',
    'Five project types we design and build as one scope: the drawings, the selections, the approvals and the work itself. Typical investment ranges are published on every page, so the first conversation starts with real numbers.',
    signature.join('\n'),
    'Martinsburg and Charles Town, WV. Get an estimate: ' + pageUrl('/estimate'),
    'Schedule a design consultation: ' + pageUrl('/design-consultation'),
    'Licensed WV · VA · PA. Family-Run.',
    FAMILY_RUN.sentence,
    FREE_FIRST_VISIT_SENTENCE,
    `Phone: ${BUSINESS.phone}. Email: ${BUSINESS.email}.`,
    `Page: ${pageUrl('/')}`,
  ]);
  return { publicPath: 'public/index.md', urlPath: '/index.md', body: assertClean(body, 'home') };
}

function servicesTwin(): TwinFile {
  const catalog = listedServices()
    .map((service) => `- ${service.title}. ${service.description} ${pageUrl(servicePillarHref(service.slug))}`)
    .join('\n');
  const body = section([
    'Source: /services',
    '# What we build.',
    'Premium remodeling and high-end exterior contracting across the WV–MD–VA region. Explore kitchens, bathrooms, lower levels, outdoor living, and exterior work. Discuss scope, selections, and site requirements at your estimate.',
    "Every service, ordered by what homeowners hire us for most.",
    catalog,
    "Don't see your project type? We specialize in custom solutions. Tell us what you're picturing and we'll tell you upfront whether we're the right fit.",
    `Page: ${pageUrl('/services')}`,
  ]);
  return { publicPath: 'public/services.md', urlPath: '/services.md', body: assertClean(body, 'services') };
}

function aboutTwin(): TwinFile {
  const body = section([
    'Source: /about',
    '# Family-run. Built with precision.',
    'Premium remodeling and high-end exterior craftsmanship across the WV–MD–VA region — run with the same discipline, communication, and accountability you would expect from a unit, not a crew.',
    'Service first. Standards always.',
    `${FAMILY_RUN.sentence} The work is kitchens, bathrooms, lower levels, and outdoor living.`,
    'Review the proposed scope and warranty terms before signing.',
    'Today we build premium bathrooms, kitchens, basements, decks, roofs, and full home additions across the Eastern Panhandle WV, Frederick MD, Winchester VA, Loudoun County, and the surrounding region.',
    'Integrity. We tell you the same thing we tell our own families. No high-pressure sales, no upsells, no fine print.',
    'Craftsmanship. Premium materials, real techniques, no shortcuts behind the drywall. Workmanship in writing.',
    "Communication. Discuss site supervision, communication, and cleanup arrangements during the estimate. You always know what is happening on your project.",
    'Local Accountability. We live and work in this region. Our reputation here is the business — we behave accordingly.',
    'Discuss the team before work begins. Use the estimate to discuss who will supervise the work, which trades the project requires, and how updates, site access, and cleanup will be handled. Confirm those responsibilities in the project agreement.',
    `Page: ${pageUrl('/about')}`,
  ]);
  return { publicPath: 'public/about.md', urlPath: '/about.md', body: assertClean(body, 'about') };
}

function contactTwin(): TwinFile {
  const body = section([
    'Source: /contact',
    '# Talk to a real project lead.',
    "Call, text, email, or fill out the form — whichever is easiest. A real project lead reaches out after reviewing your request, no high-pressure sales calls.",
    `Call or text: ${BUSINESS.phone}. Real person, no call center. If I don't pick up, leave a voicemail and include your contact details. Same number — texts often get the fastest reply.`,
    `Email: ${BUSINESS.email}. Send your project details by email.`,
    `Location: ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip}. Serving ${BUSINESS.address.region} + WV/MD/VA.`,
    `Hours: ${BUSINESS.hours}. Estimates by appointment.`,
    'Call, email, or request a free written estimate.',
    FREE_FIRST_VISIT_SENTENCE,
    `Page: ${pageUrl('/contact')}`,
  ]);
  return { publicPath: 'public/contact.md', urlPath: '/contact.md', body: assertClean(body, 'contact') };
}

function serviceAreasTwin(): TwinFile {
  const linesFor = (state: string) => places(state).map((city) => `- ${city}`).join('\n');
  const body = section([
    'Source: /service-areas',
    '# Premium contracting across WV, MD & VA.',
    'Headquartered in Martinsburg. Trusted across the Eastern Panhandle, the Cumberland Valley, the Shenandoah Valley, Frederick, Hagerstown, Loudoun County, Fairfax County, Prince William County, Montgomery County, and Howard County.',
    'West Virginia. Our Eastern Panhandle home market. Headquartered in Martinsburg.',
    linesFor('WV'),
    'Maryland. Frederick, Hagerstown, Montgomery County, and Howard County are in the service area, along with Frederick County, Washington County, and the I-70 corridor.',
    linesFor('MD'),
    'Virginia. Loudoun, Fairfax, and Prince William counties, plus Winchester — premium kitchens, lower levels, and outdoor living.',
    linesFor('VA'),
    'Pennsylvania is in the service area. Published town pages:',
    linesFor('PA'),
    `Service area: West Virginia, Virginia, Maryland, and Pennsylvania.`,
    `Page: ${pageUrl('/service-areas')}`,
  ]);
  return { publicPath: 'public/service-areas.md', urlPath: '/service-areas.md', body: assertClean(body, 'service-areas') };
}

function serviceTwin(slug: (typeof SERVICE_TWIN_SLUGS)[number]): TwinFile {
  const data = SERVICE_DATA[slug];
  const route = `/services/${slug}`;
  const scope = data.scope.items.filter((item) => !blocked(item)).map((item) => `- ${item}`);
  const overview = data.overview.paragraphs.map((paragraph) => keep(paragraph)).filter(Boolean);
  const body = section([
    `Source: ${route}`,
    `# ${data.hero.heading}`,
    keep(data.hero.sub),
    data.answer ? keep(data.answer) : '',
    ...overview,
    data.scope.title ?? 'Scope',
    scope.join('\n'),
    data.investment?.note ? keep(data.investment.note) : '',
    `Page: ${pageUrl(route)}`,
  ]);
  return {
    publicPath: `public/services/${slug}.md`,
    urlPath: `${route}.md`,
    body: assertClean(body, slug),
  };
}

function areaTwin(slug: (typeof AREA_TWIN_SLUGS)[number]): TwinFile {
  const area = ALL_SERVICE_AREAS.find((row) => row.slug === slug);
  const data = CITY_DATA[slug];
  if (!area || !data) throw new Error(`missing area ${slug}`);
  const route = `/service-areas/${slug}`;
  const hero =
    areaHeroLane(area) === 'consultation'
      ? `Design-build remodeling for ${area.city} homes. Kitchens, primary suites, lower levels, additions and outdoor living, with one project lead from the first call to the final walkthrough.`
      : `Premium remodeling and exterior craftsmanship for ${area.city} homeowners. Family-run, with project scope discussed at the estimate.`;
  const emphasis: string[] = [];
  for (const serviceSlug of data.marketEmphasis) {
    const title = SERVICES.find((service) => service.slug === serviceSlug)?.title;
    if (title && !blocked(title)) emphasis.push(title);
  }
  const body = section([
    `Source: ${route}`,
    `# ${area.city}, ${area.state}`,
    hero,
    keep(data.description),
    data.neighborhoods.length ? `Neighborhoods and places named on the page: ${data.neighborhoods.join(', ')}.` : '',
    emphasis.length ? `Lead services: ${emphasis.join(', ')}.` : '',
    FREE_FIRST_VISIT_SENTENCE,
    `Page: ${pageUrl(route)}`,
  ]);
  return {
    publicPath: `public/service-areas/${slug}.md`,
    urlPath: `${route}.md`,
    body: assertClean(body, slug),
  };
}

export function buildTwins(): TwinFile[] {
  return [
    homeTwin(),
    servicesTwin(),
    aboutTwin(),
    serviceAreasTwin(),
    contactTwin(),
    ...SERVICE_TWIN_SLUGS.map((slug) => serviceTwin(slug)),
    ...AREA_TWIN_SLUGS.map((slug) => areaTwin(slug)),
  ];
}

export function buildLlmsTxt(twins = buildTwins()): string {
  const twinByRoute = new Map(twins.map((twin) => [twin.urlPath.replace(/\.md$/, ''), twin]));
  const serviceLines = listedServices().map((service) => {
    const href = servicePillarHref(service.slug);
    const twin = twinByRoute.get(href);
    const markdown = twin ? ` Markdown: ${pageUrl(twin.urlPath)}` : '';
    return `- ${service.title}. ${service.description} ${pageUrl(href)}${markdown}`;
  });
  const areaLines = [
    `- West Virginia: ${places('WV').join(', ')}.`,
    `- Maryland, fully in the service area: ${places('MD').join(', ')}.`,
    `- Virginia: ${places('VA').join(', ')}.`,
    `- Pennsylvania: ${places('PA').join(', ')}.`,
  ];
  const hubLines = AREA_TWIN_SLUGS.map((slug) => {
    const area = ALL_SERVICE_AREAS.find((row) => row.slug === slug)!;
    return `- ${area.city}, ${area.state}: ${pageUrl(`/service-areas/${slug}`)} Markdown: ${pageUrl(`/service-areas/${slug}.md`)}`;
  });
  const twinLines = twins.map((twin) => `- ${pageUrl(twin.urlPath)} (source ${twin.body.split('\n')[0].replace('Source: ', '')})`);

  const body = section([
    '# Real Elite Contracting',
    'Premium design-build remodeler for kitchens, primary suites, basements and lower levels, additions, decks, and outdoor living. Serving West Virginia, Virginia, Maryland, and Pennsylvania.',
    `${FAMILY_RUN.sentence} No federal veteran certification is held. There is no publicly published founding date, and the company does not display fabricated review ratings: star/aggregate ratings appear only when mirrored from the verified Google Business Profile.`,
    'The homepage describes design-build remodeling for Loudoun homes: kitchens, primary suites, lower levels, additions and outdoor living for Leesburg, Ashburn, Middleburg and Hunt Country.',
    '## Contact',
    [
      `- Phone: ${BUSINESS.phone}`,
      `- Email: ${BUSINESS.email}`,
      `- Base: ${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.zip} (Eastern Panhandle)`,
      `- Hours: ${BUSINESS.hours}`,
      `- ${FREE_FIRST_VISIT_SENTENCE}`,
      '- Free written estimates.',
      `- Contact: ${pageUrl('/contact')}`,
      `- Contact markdown: ${pageUrl('/contact.md')}`,
    ].join('\n'),
    '## Services',
    serviceLines.join('\n'),
    '## Service areas',
    'West Virginia, Virginia, Maryland, and Pennsylvania. Maryland is in the service area. Headquarters are in Martinsburg, WV.',
    areaLines.join('\n'),
    hubLines.join('\n'),
    `Full list: ${pageUrl('/service-areas')}`,
    `Service areas markdown: ${pageUrl('/service-areas.md')}`,
    '## Pages',
    [
      `- Home: ${pageUrl('/')} Markdown: ${pageUrl('/index.md')}`,
      `- Services: ${pageUrl('/services')} Markdown: ${pageUrl('/services.md')}`,
      `- About: ${pageUrl('/about')} Markdown: ${pageUrl('/about.md')}`,
      `- Projects: ${pageUrl('/projects')}`,
      `- Reviews: ${pageUrl('/reviews')}`,
      `- Process: ${pageUrl('/process')}`,
      `- Resources: ${pageUrl('/resources')}`,
      `- Estimate: ${pageUrl('/estimate')}`,
      `- Design consultation: ${pageUrl('/design-consultation')}`,
      `- Roof quote: ${pageUrl('/instant-roof-quote')}`,
    ].join('\n'),
    '## Markdown twins',
    twinLines.join('\n'),
  ]);
  return assertClean(body, 'llms.txt');
}

export function writeMarkdownTwins(root = process.cwd()): string[] {
  const twins = buildTwins();
  const files = [...twins, { publicPath: 'public/llms.txt', urlPath: '/llms.txt', body: buildLlmsTxt(twins) }];
  for (const file of files) {
    const dest = join(root, file.publicPath);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, file.body.endsWith('\n') ? file.body : `${file.body}\n`);
  }
  return files.map((file) => file.publicPath);
}
