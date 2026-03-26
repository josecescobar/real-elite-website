import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BUSINESS, SERVICES, EXPANSION_SERVICE_AREAS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import { MapPin, Check, Phone, ArrowRight } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURED_SERVICE_SLUGS = ['roofing', 'decks', 'remodeling', 'siding'] as const;
type FeaturedServiceSlug = (typeof FEATURED_SERVICE_SLUGS)[number];
type ExpansionCitySlug = 'winchester-va' | 'frederick-md' | 'leesburg-va' | 'ashburn-va';

// Unique body content for each service × city combination
const CONTENT: Record<`${FeaturedServiceSlug}-${ExpansionCitySlug}`, { paragraphs: string[] }> = {
  // ── ROOFING ──────────────────────────────────────────────────────────────

  'roofing-winchester-va': {
    paragraphs: [
      "Winchester's location at the northern gateway to Virginia's Shenandoah Valley means your roof faces some of the most demanding weather in the region. Hot, humid summers bring afternoon thunderstorms, while winters deliver freezing rain, ice dams, and heavy snowfall that stress aging roofing systems. For homeowners in Winchester, VA, a quality roof isn't just curb appeal — it's essential protection for one of your biggest investments.",
      "Real Elite Contracting provides professional roofing services across Winchester and the surrounding Frederick County communities. Whether you're dealing with wind damage from a Shenandoah Valley storm, worn shingles in the Shawnee District, or you need a proactive replacement along Senseny Road, our experienced crews deliver clean, durable results every time. We work with premium architectural shingles from GAF and Owens Corning, backed by manufacturer warranties that protect your home for decades.",
      "Winchester's mix of historic and newer homes creates unique roofing challenges. The Victorian and Federal-style homes in Old Town Winchester often feature steep pitches, dormers, and intricate valleys that demand precision craftsmanship. We're experienced working on complex historic rooflines while maintaining the character that defines these neighborhoods. For newer suburban developments along Route 7, Route 522, and the Millwood corridor, we offer efficient full replacements with fast turnaround times.",
      "We handle the entire process — from initial inspection and detailed estimate to final cleanup and permit coordination. When storm damage is involved, we work directly with your insurance company to simplify the claims process. Our goal is a stress-free experience that leaves you with a beautiful, long-lasting roof.",
    ],
  },

  'roofing-frederick-md': {
    paragraphs: [
      "Frederick, Maryland sits along the I-70 corridor in a region known for unpredictable Mid-Atlantic weather — nor'easters, summer thunderstorms, and ice storms that push roofing systems to their limits. As Frederick County's largest city and one of the fastest-growing markets in Maryland, homeowners here need a roofing contractor who understands both historic preservation and modern construction standards.",
      "Real Elite Contracting serves Frederick homeowners from the historic downtown district along Market Street all the way out to the newer developments in Urbana and Jefferson. Our roofing teams are skilled at replacing and repairing roofs on the 19th and early 20th century homes that line Carroll Creek's revitalized corridor, where preserving architectural character matters as much as performance.",
      "For Frederick's rapidly growing suburban neighborhoods — including Ballenger Creek, New Market, and communities along Buckeystown Pike — we specialize in high-efficiency full replacements using premium architectural shingles. We're familiar with Frederick County permitting and work to keep your project on schedule. Storm damage repairs, emergency tarping, and complete insurance-supported replacements are all within our scope.",
      "Frederick's growth means more competition among contractors, but Real Elite stands out by combining veteran-owned reliability with transparent pricing and workmanship guarantees. Every roof we install is backed by both manufacturer warranties and our own labor guarantee.",
    ],
  },

  'roofing-leesburg-va': {
    paragraphs: [
      "Leesburg is one of Northern Virginia's most sought-after communities, where historic charm meets upscale modern living. Homes here range from Colonial-era properties in the historic district to newly built estate homes in Lansdowne and Cascades. Loudoun County's climate — with humid summers, nor'easter season, and periodic ice storms — makes professional roofing a recurring priority for every homeowner.",
      "Real Elite Contracting brings premium roofing services to Leesburg and across Loudoun County. Our crews are experienced with the complex rooflines common in Leesburg's upscale neighborhoods — from standing seam metal roofing on historic properties along King Street to architectural shingle replacements in Lansdowne on the Potomac and Countryside. We use only top-tier materials and maintain strict quality standards that match the elevated expectations of Leesburg homeowners.",
      "Proximity to the Potomac watershed creates added moisture challenges for homes in Leesburg's lower-lying areas. We assess drainage patterns, ventilation, and flashing conditions as part of every roof inspection, ensuring your new roof performs for 25–50 years. For homes in HOA-governed communities, we're familiar with design standards and approval processes, taking the compliance burden off your plate.",
      "When it comes to storm damage, ice dam formation, or simply an aging roof that has reached the end of its service life, Real Elite provides fast response and honest assessments. We don't upsell unnecessary work — if a repair will solve the problem, we'll tell you.",
    ],
  },

  'roofing-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia has grown into one of the most dynamic residential markets in the country, driven by the tech corridor along Loudoun County Parkway and the Silver Line Metro expansion. With thousands of newer homes in communities like Broadlands, Brambleton, and One Loudoun, many Ashburn homeowners are now reaching the 15–20 year mark on their original roofing systems — the typical replacement window for architectural shingles.",
      "Real Elite Contracting specializes in roof replacements and repairs throughout Ashburn and surrounding Loudoun County communities. We understand the construction standards used in Ashburn's major developments and can quickly assess whether your roof is ready for replacement or still has years of service life remaining. Our free inspections are detailed and honest — we bring photos from the roof and walk you through our findings before any commitment is required.",
      "Many Ashburn neighborhoods are governed by HOAs with specific requirements for roofing materials, colors, and installation standards. Real Elite is well-versed in navigating HOA approval processes and working within community guidelines. We'll help you select shingle colors and styles that satisfy your HOA while giving your home a fresh, updated appearance.",
      "Ashburn's young families and working professionals value speed and reliability. We schedule roofing projects efficiently, minimize disruption to your household, and complete most full replacements in a single day. All debris is removed and we do a thorough magnetic sweep of your yard to ensure no leftover nails remain.",
    ],
  },

  // ── DECKS ──────────────────────────────────────────────────────────────

  'decks-winchester-va': {
    paragraphs: [
      "Winchester, Virginia's rolling hills and Shenandoah Valley views make outdoor living spaces one of the best investments you can make in your home. From spring evenings watching apple orchard blossoms to summer cookouts with views of the Blue Ridge, a well-built deck transforms your backyard into an extension of your living space. Real Elite Contracting builds custom decks for Winchester homeowners who expect quality craftsmanship that lasts for decades.",
      "Our deck-building expertise spans all of Winchester's diverse neighborhoods — from homes with wooded lots in the Shawnee District and Senseny Road area to newer constructions along Route 7 and the Millwood Avenue corridor. We build decks in pressure-treated lumber, composite materials (Trex, TimberTech, Azek), and hardwoods, matching your vision, budget, and the demands of the Shenandoah Valley climate.",
      "Winchester's four distinct seasons mean your deck materials need to handle everything from summer UV exposure and humidity to winter freeze-thaw cycles. We recommend composite decking for most Winchester homeowners — it resists warping, fading, and moisture damage that traditional wood struggles with over time. Composite decks look better longer and require significantly less maintenance, giving you more time to actually enjoy your outdoor space.",
      "Every deck we build starts with a design consultation to understand how you want to use the space. We handle all Frederick County and City of Winchester permits, ensuring your deck meets local building codes. From simple platforms to multi-level structures with built-in benches, stairs, and pergolas, Real Elite delivers decks that become the centerpiece of your outdoor living.",
    ],
  },

  'decks-frederick-md': {
    paragraphs: [
      "Frederick, Maryland's revitalized neighborhoods and growing suburban communities have created explosive demand for outdoor living spaces. With long summers, beautiful spring weather, and the Carroll Creek corridor driving outdoor culture, more Frederick homeowners are investing in custom decks that extend their entertaining season from April through October. Real Elite Contracting brings premium deck-building expertise to Frederick County.",
      "We build decks for homes across Frederick — from older craftsman and colonial homes near the historic district to newer construction in Ballenger Creek, Urbana, and communities along the I-70 growth corridor. Our team handles all Frederick County permitting, material sourcing, and construction with the precision that Frederick's discerning homeowners expect. Whether you want a simple pressure-treated platform or a multi-level composite deck with lighting and built-in seating, we deliver.",
      "Frederick's moderate-to-humid Mid-Atlantic climate is ideal for composite decking. Materials from Trex, TimberTech, and Azek hold up beautifully against Maryland's summer humidity and spring rainfall, requiring minimal annual maintenance compared to traditional pressure-treated wood. We'll help you choose decking colors and railing styles that complement your home's architecture and add lasting curb appeal.",
      "Real Elite's deck projects include built-in planters, pergolas, benches, privacy screens, and outdoor lighting packages that make your deck usable morning to evening. We're also experienced with ADA-accessible deck designs and ramps for Frederick homeowners with specific accessibility needs.",
    ],
  },

  'decks-leesburg-va': {
    paragraphs: [
      "Leesburg's upscale neighborhoods and estate homes create the perfect backdrop for premium outdoor living spaces. Whether you're overlooking the Potomac watershed from Lansdowne, entertaining in Cascades, or enhancing a historic property on King Street, a custom deck from Real Elite Contracting becomes the cornerstone of your outdoor lifestyle. We build decks that match the quality and character Leesburg homeowners expect.",
      "Leesburg's affluent residential market demands materials and craftsmanship at a higher standard. We specialize in premium composite decking systems — TimberTech PRO, Azek Harvest Collection, and Trex Transcend — that deliver the beauty of hardwood with none of the maintenance headaches. For homes in communities like Lansdowne on the Potomac and Countryside, we design decks that complement existing landscaping and architecture, creating seamless transitions between indoor and outdoor living.",
      "Many Leesburg decks are designed for entertaining — built to accommodate outdoor kitchens, fire pit areas, and multi-zone seating layouts. We plan traffic flow, structural load capacity, and lighting placement from day one so your finished deck functions as beautifully as it looks. Our crews are experienced with Loudoun County building codes and HOA design review processes, handling all approvals and inspections so you don't have to.",
      "For historic homes in the King Street area and surrounding Old Town Leesburg neighborhoods, we work with care to ensure deck additions don't compromise the historic character of the property. Real Elite is the contractor Leesburg homeowners trust for premium deck builds that hold up for 25+ years.",
    ],
  },

  'decks-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia's young, active families are reshaping what outdoor living means. From summer cookouts in Brambleton to evening gatherings in Broadlands and One Loudoun, the demand for custom decks in Ashburn has never been higher. Real Elite Contracting builds decks that become the social hub of your property — functional, beautiful, and built to Loudoun County code from the ground up.",
      "Ashburn's planned communities offer beautiful settings for outdoor living, but HOA guidelines can make deck additions complicated. Real Elite is experienced with the specific requirements of Ashburn's major communities — Broadlands, Brambleton, Ashburn Farm, Belmont Country Club, and more. We handle all HOA submissions, material approvals, and Loudoun County permits, making the process seamless for you.",
      "We specialize in composite decking systems that look sharp and stay looking sharp in Ashburn's suburban environment. Trex, TimberTech, and Azek products resist the fading, staining, and warping that pressure-treated wood develops within a few years. With kids and pets in the picture, low-maintenance composite is the obvious choice — no annual staining, no splinters, no worries.",
      "Ashburn decks often include multiple functional zones: a dining area near the sliding door, a fire pit corner, a built-in grill station, and a lounge section for unwinding. Real Elite designs each deck with your lifestyle in mind. We take measurements, create a layout, walk you through material options, and provide a fixed-price estimate before work begins.",
    ],
  },

  // ── REMODELING ────────────────────────────────────────────────────────────

  'remodeling-winchester-va': {
    paragraphs: [
      "Winchester, Virginia's real estate market has been growing steadily, driven by its historic charm, Shenandoah Valley setting, and proximity to Northern Virginia. Whether you own a 19th-century Victorian in Old Town or a 1980s colonial on the outskirts, home remodeling is one of the smartest investments you can make. Real Elite Contracting delivers full-service interior and exterior remodeling across Winchester and Frederick County.",
      "From kitchen and bathroom renovations to full home makeovers, Real Elite handles every phase of your Winchester remodeling project with care and expertise. Our crews are experienced with the unique construction methods found in older Winchester homes — plaster walls, older electrical systems, and load-bearing configurations that require careful planning. We update homes to modern standards while preserving the historic character that makes Winchester properties so desirable.",
      "Winchester's growing real estate market means thoughtful remodeling pays dividends. Kitchen remodels, primary bathroom upgrades, and main floor conversions are consistently among the highest-ROI projects in the Winchester metro area. Real Elite helps homeowners prioritize updates that improve daily living and maximize resale value — with design guidance, material selection help, and transparent pricing from the first conversation.",
      "We serve all of Winchester's neighborhoods — from the historic Shawnee District and Old Town to the growing communities along Route 7 and Senseny Road. Whether you're preparing your home for sale, updating after a purchase, or simply improving your quality of life, Real Elite is Winchester's trusted remodeling contractor.",
    ],
  },

  'remodeling-frederick-md': {
    paragraphs: [
      "Frederick, Maryland's blend of historic character and rapid suburban growth makes it one of the most exciting remodeling markets in the Mid-Atlantic. Downtown Frederick's revitalization along Market Street and Carroll Creek has inspired homeowners throughout the county to invest in their properties — from gut-renovating century-old rowhouses near the historic district to modernizing 1990s colonials in Ballenger Creek and Urbana.",
      "Real Elite Contracting brings full-service remodeling to Frederick homeowners, handling everything from kitchen and bathroom renovations to basement finishing, main-floor open concepts, and exterior facelifts. Our team is experienced with the construction challenges unique to Frederick County — older home foundations, plaster walls, and older plumbing systems — and we have the expertise to modernize your home while respecting its structure.",
      "Frederick's growing community of young professionals and families has driven demand for modern open-concept layouts, chef's kitchens, and spa-style bathrooms. Real Elite designs and builds spaces that match today's lifestyle expectations while staying within realistic budgets. We offer transparent pricing with detailed scopes of work so you always know exactly what you're getting.",
      "From the historic district out to the newest subdivisions along I-70, Real Elite serves Frederick County homeowners with the same commitment to quality and communication. We handle all Frederick County permits and inspections, keep your project on schedule, and leave your home cleaner than we found it.",
    ],
  },

  'remodeling-leesburg-va': {
    paragraphs: [
      "Leesburg, Virginia's high-value real estate market rewards thoughtful home improvements. With average home prices well above state and national medians, Leesburg homeowners who invest in quality remodeling see outstanding returns. From historic renovation projects near King Street to luxury kitchen and bathroom upgrades in Lansdowne and Cascades, Real Elite Contracting delivers premium remodeling results that Leesburg's market demands.",
      "Real Elite specializes in high-end remodeling for Leesburg's discerning homeowners. Our kitchen renovations incorporate custom cabinetry, quartz and granite countertops, high-end appliances, and thoughtful layouts that make cooking and entertaining genuinely enjoyable. Primary bathroom transformations — with spa showers, freestanding soaking tubs, and custom tile work — create the retreat-like atmosphere that Leesburg buyers and owners expect.",
      "For Leesburg's historic homes, we approach remodeling with particular care. Many properties in the Old Town Leesburg area are subject to historic preservation guidelines, and our team is experienced navigating Loudoun County's review process. We update homes for modern comfort — insulation, HVAC support, electrical, plumbing — while preserving the architectural details that give these homes their irreplaceable character.",
      "From smaller projects like powder room refreshes and mudroom builds to full home renovations, Real Elite brings the same level of professionalism to every Leesburg remodeling project. We offer detailed written scopes, fixed-price contracts where possible, and dedicated project management throughout construction.",
    ],
  },

  'remodeling-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia is home to a growing population of tech professionals, federal workers, and young families who want modern, functional homes that match their active lifestyles. As Ashburn's neighborhoods mature and original construction ages, homeowners are increasingly investing in remodeling projects that bring their homes up to contemporary standards. Real Elite Contracting is the contractor Ashburn homeowners trust for smart, well-executed renovations.",
      "The most popular remodeling projects in Ashburn's communities — Broadlands, Brambleton, Ashburn Farm, and One Loudoun — reflect the lifestyle of the community: open-concept main floors, updated kitchens with islands and quartz countertops, spa bathrooms with frameless glass showers, and finished basements for home offices, gyms, and family entertainment. Real Elite has built a strong reputation delivering exactly these types of projects across Ashburn.",
      "Many of Ashburn's homes from the late 1990s and early 2000s feature dated layouts, popcorn ceilings, and finishes that no longer match current expectations. Our team can assess your home's potential and help you prioritize upgrades that deliver the most impact for your investment. From permit application to final punch list, Real Elite manages your project professionally from start to finish.",
      "Ashburn homeowners value efficiency and communication — two things Real Elite prioritizes above all else. We provide detailed project timelines, keep you updated throughout construction, and respect the boundaries of your home and daily schedule. Whether you're planning a quick bathroom refresh before listing or a comprehensive whole-home renovation, get started with a free estimate today.",
    ],
  },

  // ── SIDING ────────────────────────────────────────────────────────────────

  'siding-winchester-va': {
    paragraphs: [
      "Winchester, Virginia's homes face a demanding exterior environment — hot, humid summers, winter ice storms, and the occasional Shenandoah Valley windstorm that tests every material on your home's exterior. Quality siding isn't just cosmetic; it's the primary moisture and weather barrier protecting your home's structure. Real Elite Contracting provides expert siding installation and replacement for Winchester homeowners who want protection and curb appeal that lasts.",
      "We install vinyl siding, fiber cement siding (James Hardie), and engineered wood products across Winchester and Frederick County. Vinyl siding is the most popular choice for Winchester's suburban and rural homes — it's low-maintenance, highly durable, and available in dozens of profiles and colors. Fiber cement is the premium option for homes near historic districts and upscale neighborhoods, offering the authentic texture of wood without the rot and maintenance headaches.",
      "Old Town Winchester's older homes often feature wood lap siding, cedar shingles, or stucco that has reached the end of its service life. We help homeowners in the Shawnee District, the historic corridor along Amherst and Cork Streets, and the Route 7 growth areas transition to modern siding systems that dramatically improve energy efficiency, moisture protection, and curb appeal.",
      "Beyond aesthetics, new siding significantly improves your home's insulation performance. We install foam-backed siding and house wrap systems that reduce heating and cooling costs — a meaningful benefit given the Shenandoah Valley's temperature extremes. New siding transforms your home's look and performance in a single project.",
    ],
  },

  'siding-frederick-md': {
    paragraphs: [
      "Frederick, Maryland's blend of historic rowhouses, established suburban neighborhoods, and new construction creates a wide range of siding needs across the county. From fiber cement replacements on 100-year-old downtown homes to vinyl upgrades on 1990s colonials in Ballenger Creek, Real Elite Contracting serves the full spectrum of Frederick's siding market with professional installation and honest assessments.",
      "Maryland's humid continental climate — with wet springs, hot summers, and cold winters — puts serious demands on your home's exterior siding. Moisture infiltration behind failing siding is one of the leading causes of structural damage in older Frederick homes. Real Elite performs thorough moisture assessments before installation, replacing any damaged sheathing and installing proper house wrap to ensure your new siding performs as intended.",
      "For Frederick's historic district homes near Carroll Creek and Market Street, we offer James Hardie fiber cement siding in profiles that honor the architectural history of the neighborhood while providing modern performance and longevity. For the newer suburban developments along I-70 in Jefferson, Urbana, and New Market, we offer a full range of vinyl siding systems with insulation backing that improve your home's comfort and energy efficiency.",
      "Real Elite handles all Frederick County permits, and our installation crews are experienced working in occupied homes with minimal disruption to your daily routine. We offer multi-day scheduling for larger jobs and keep the work area clean throughout the project.",
    ],
  },

  'siding-leesburg-va': {
    paragraphs: [
      "Leesburg's upscale residential character demands exterior siding that makes a statement. From stately colonials in Cascades to craftsman-style homes in Lansdowne on the Potomac, the right siding choice elevates your home's curb appeal and market value in one of Northern Virginia's most competitive real estate markets. Real Elite Contracting installs premium siding systems for Leesburg homeowners who refuse to settle for average.",
      "Fiber cement siding — James Hardie and equivalent products — is the material of choice for most Leesburg homeowners who want the look of painted wood without the maintenance. Hardie's ColorPlus Technology provides a factory-applied finish that holds color for 15+ years and comes with a 30-year limited warranty. For homes in HOA communities like Lansdowne and Countryside, we help you navigate design review requirements and select approved colors and profiles.",
      "Leesburg's proximity to the Potomac watershed creates elevated moisture conditions that make quality house wrap and flashing critical to siding performance. Our installations include premium moisture barriers and properly detailed window and door flashing to prevent water infiltration that can lead to mold, rot, and structural damage. We don't cut corners on the details that protect your home's long-term value.",
      "Real Elite also handles partial siding replacements, accent installations, and gable end updates that refresh your home's appearance without a full exterior overhaul. If you're preparing to sell, new siding consistently ranks among the highest-ROI improvements in the Leesburg market.",
    ],
  },

  'siding-ashburn-va': {
    paragraphs: [
      "Ashburn, Virginia's master-planned communities have established high standards for home exteriors — and with good reason. In a market where neighbors, HOAs, and potential buyers have high expectations, quality siding that looks sharp and holds up year after year is non-negotiable. Real Elite Contracting helps Ashburn homeowners refresh, repair, or completely replace their home's siding with materials and craftsmanship that meet Loudoun County's exacting community standards.",
      "Many Ashburn homes from the late 1990s and early 2000s feature original vinyl siding that is fading, chalking, or showing impact damage after 20+ years of service. A fresh siding replacement transforms the look of your home immediately — and modern vinyl siding products perform significantly better than what was installed a generation ago, with better UV resistance, insulated backing options, and warranties that cover the life of the home.",
      "We work within all major Ashburn HOA communities — Broadlands, Brambleton, Ashburn Farm, Belmont Country Club, and others — navigating the approval process and ensuring your siding selection meets community guidelines. Our team helps you choose replacement colors that comply with HOA standards while giving your home a fresh, updated appearance that stands out on the street.",
      "Ashburn homeowners can also choose James Hardie fiber cement for a premium upgrade that adds significant curb appeal and resale value. Hardie siding is particularly popular for accent areas — gable ends, dormers, and entryways — where a texture upgrade makes a dramatic visual impact.",
    ],
  },
};

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return FEATURED_SERVICE_SLUGS.flatMap((service) =>
    EXPANSION_SERVICE_AREAS.map((area) => ({
      service,
      city: area.slug,
    }))
  );
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { service: string; city: string };
}): Promise<Metadata> {
  const serviceData = SERVICES.find((s) => s.slug === params.service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === params.city);

  if (!serviceData || !cityData) return { title: 'Not Found' };

  const title = `${serviceData.title} in ${cityData.city}, ${cityData.state} | ${BUSINESS.name}`;
  const description = `Expert ${serviceData.title.toLowerCase()} services in ${cityData.city}, ${cityData.state}. Real Elite Contracting — veteran-owned, quality guaranteed. Get a free estimate today.`;

  return {
    title,
    description,
    keywords: [
      `${serviceData.title.toLowerCase()} ${cityData.city}`,
      `${cityData.city} ${serviceData.title.toLowerCase()}`,
      `${serviceData.title.toLowerCase()} contractor ${cityData.city} ${cityData.state}`,
      `${cityData.city} home improvement`,
      `${cityData.state} contractor`,
    ],
    alternates: {
      canonical: `${BUSINESS.url}/services/${params.service}/${params.city}`,
    },
    openGraph: {
      title,
      description,
      url: `${BUSINESS.url}/services/${params.service}/${params.city}`,
      type: 'website',
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ServiceCityPage({
  params,
}: {
  params: { service: string; city: string };
}) {
  const serviceData = SERVICES.find((s) => s.slug === params.service);
  const cityData = EXPANSION_SERVICE_AREAS.find((a) => a.slug === params.city);
  const contentKey = `${params.service}-${params.city}` as keyof typeof CONTENT;
  const content = CONTENT[contentKey];

  if (!serviceData || !cityData || !content) {
    notFound();
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    url: BUSINESS.url,
    telephone: BUSINESS.phoneRaw,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS.address.city,
      addressRegion: BUSINESS.address.state,
      postalCode: BUSINESS.address.zip,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'City',
      name: cityData.city,
      containedInPlace: { '@type': 'State', name: cityData.state },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceData.title,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: `${serviceData.title} in ${cityData.city}, ${cityData.state}`,
          },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* Hero */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-gold-300 text-sm font-semibold mb-4">
            <Link href={`/services/${serviceData.slug}`} className="hover:text-gold-200 transition-colors">
              {serviceData.title}
            </Link>
            <span>/</span>
            <Link href={`/service-areas/${cityData.slug}`} className="hover:text-gold-200 transition-colors">
              {cityData.city}, {cityData.state}
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {serviceData.title} in {cityData.city}, {cityData.state}
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Real Elite Contracting — veteran-owned, quality-focused. Serving {cityData.city} and the surrounding area.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              href="https://calendly.com/realelitecontracting-info/free-estimate-call"
              variant="primary"
              size="lg"
            >
              Book Free Estimate
            </Button>
            <Button href={`tel:${BUSINESS.phoneRaw}`} variant="outline" size="lg">
              Call {BUSINESS.phone}
            </Button>
          </div>
        </div>
      </section>

      {/* Body Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-6">
            {content.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Real Elite */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-12 text-center">
            Why {cityData.city} Homeowners Choose Real Elite
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Veteran-Owned & Operated',
                body: 'Founded on military values — discipline, accountability, and a commitment to doing the job right the first time. When we say we stand behind our work, we mean it.',
              },
              {
                title: 'Transparent Pricing',
                body: 'No hidden fees, no surprise line items. We provide detailed written estimates before any work begins so you know exactly what you\'re getting for your investment.',
              },
              {
                title: 'Local Expertise',
                body: `We know ${cityData.city}'s neighborhoods, building codes, and climate challenges. That local knowledge means smarter material choices and better results for your home.`,
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started in {cityData.city}?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Schedule your free, no-obligation {serviceData.title.toLowerCase()} estimate today. We'll assess your project,
            answer your questions, and provide a detailed quote — no pressure, no gimmicks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button
              href="https://calendly.com/realelitecontracting-info/free-estimate-call"
              variant="primary"
              size="lg"
            >
              Book Free Estimate Online
            </Button>
          </div>

          <div className="flex items-center justify-center gap-3 text-gray-300">
            <Phone className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <span>Or call us directly:</span>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="text-xl font-bold text-gold-400 hover:text-gold-300 transition-colors"
            >
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-6">Explore more from Real Elite Contracting</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href={`/services/${serviceData.slug}`}>
              <Button variant="outline" size="sm">
                <ArrowRight className="w-4 h-4 mr-2" />
                All {serviceData.title} Services
              </Button>
            </Link>
            <Link href={`/service-areas/${cityData.slug}`}>
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                {cityData.city}, {cityData.state} Service Area
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="sm">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
