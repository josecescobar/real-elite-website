/**
 * Service page data layer. Every service page renders through
 * ServicePageTemplate using one of these entries.
 *
 * Honesty rule: a hero, overview or "Recent projects" image must be Real
 * Elite's own photograph. Kitchens and Basements have none yet, so their
 * `hero.image` is undefined and the template renders the gradient hero.
 * Stock images left in a `gallery` are moved by RelatedProjects under a
 * "Design inspiration" heading (see src/lib/stock-images.ts); a test fails if
 * a hero or overview image is stock. Swap in real photos once jobs are shot.
 */

export type ServiceImage = { src: string; alt: string };

export type InvestmentTier = {
  tier: string;
  range: string;
  notes?: string;
};

export type ServiceFAQ = { question: string; answer: string };

export type ServiceData = {
  slug: string;
  /** Used in the hero H1 */
  title: string;
  /** Service category for breadcrumbs and JSON-LD */
  serviceType: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  /**
   * Optional concise "answer block" shown at the top of the service page —
   * the lift-able summary for AI Overviews / assistants (GEO/AEO) and the
   * scannable gist for visitors. When absent, the template falls back to
   * `metaDescription`, so every service ships an answer block without new copy.
   */
  answer?: string;

  hero: {
    eyebrow?: string;
    heading: string;
    sub: string;
    /** If present, used as full-bleed hero photography; else gradient. */
    image?: ServiceImage;
  };

  overview: {
    /** 1-3 paragraphs */
    paragraphs: string[];
    image?: ServiceImage;
  };

  scope: {
    title?: string;
    items: string[];
  };

  investment?: {
    startingAt: string;
    note?: string;
    tiers: InvestmentTier[];
  };

  /** Up to 6 thumbnails — section is omitted if empty */
  gallery?: ServiceImage[];

  whyChooseUs: string[];

  faqs: ServiceFAQ[];

  /** Optional: blog post slugs to surface in the Related Guides module */
  relatedGuideSlugs?: string[];

  /** Optional: Lucide icon name for the service category */
  icon?: string;

  /**
   * Optional: a tighter service area than the site-wide WV–MD–VA default.
   * Used for services delivered in a narrower footprint (e.g. paving), so
   * the page's copy, areas grid, and JSON-LD reflect only where it's offered.
   */
  areaScope?: {
    label: string;
    cities: { city: string; state: string; slug: string }[];
  };
};

/* -------------------------------------------------------------------------- */
/*  Service entries                                                           */
/* -------------------------------------------------------------------------- */

export const SERVICE_DATA: Record<string, ServiceData> = {
  /* ---------------------------- PREMIUM (NEW) ---------------------------- */

  bathrooms: {
    slug: 'bathrooms',
    title: 'Bathroom Remodeling',
    serviceType: 'Bathroom Remodeling',
    metaTitle: 'Bathroom Remodeling in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Premium bathroom remodels in the WV–MD–VA region. Walk-in showers, tile work, vanities, and whole-bath transformations — built with military precision.',
    keywords: [
      'bathroom remodel',
      'walk-in shower',
      'master bath renovation',
      'tile work',
      'bathroom remodeling Frederick MD',
      'bathroom remodeling Winchester VA',
      'bathroom remodel Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting offers bathroom remodeling, walk-in showers, tile work, and vanity installation. Discuss waterproofing, access, and finish selections when scoping the project.',
    hero: {
      eyebrow: 'Premium Interior',
      heading: 'Bathroom Remodeling',
      sub: 'Walk-in showers, tile work, vanities, and full master-bath transformations across the WV–MD–VA region. The clean, communication-first remodel premium homeowners actually recommend.',
    },
    overview: {
      paragraphs: [
        "Your bathroom is the room you start every day in and end every day in — so the build has to be right. Real Elite Contracting handles full bathroom remodels, walk-in shower conversions, and tile work for homeowners across Eastern Panhandle WV, Frederick MD, Winchester VA, and Loudoun County. Premium materials. Real waterproofing systems. The clear communication standards that make remodels feel less like construction and more like a managed project.",
        "We build with the long-term in mind: Schluter-Kerdi waterproofing systems, real tile setting (no cheap shortcuts), curbless and accessibility-aware shower designs, and the fit-and-finish you'd expect from a higher-end design-build firm. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
      ],
      image: {
        src: '/images/work/bath-primary-frameless-shower.webp',
        alt: 'Walk-in shower with frameless glass, blue subway tile, marble-look hex floor, and matte black fixtures',
      },
    },
    scope: {
      title: "What's in scope",
      items: [
        'Walk-in shower conversions (curbless options available)',
        'Schluter-Kerdi waterproofing systems',
        'Custom tile work — floor, walls, niches, accents',
        'Vanity, countertop, and fixture replacement',
        'Plumbing relocation and fixture upgrades',
        'Lighting, ventilation, and electrical upgrades to code',
        'Tub-to-shower conversions',
        'Permitting and final inspection coordination',
      ],
    },
    investment: {
      startingAt: '$15,000',
      note: 'Ranges reflect typical labor + materials in our region for 2026. Final estimate is always free, written, and line-itemed.',
      tiers: [
        { tier: 'Refresh', range: '$15k – $25k', notes: 'Tub-to-shower, new vanity, tile + fixtures' },
        { tier: 'Full Remodel', range: '$25k – $45k', notes: 'Layout changes, premium tile, custom shower' },
        { tier: 'Primary Suite', range: '$45k – $75k+', notes: 'Curbless, double-vanity, large-format tile, premium finishes' },
      ],
    },
    whyChooseUs: [
      'Real waterproofing systems (Schluter-Kerdi) — not cheap green board shortcuts.',
      "Discuss site supervision, communication, and cleanup arrangements during the estimate.",
    ],
    faqs: [
      {
        question: 'How long does a bathroom remodel take?',
        answer:
          "The construction schedule depends on the approved scope, selections, permits, and material availability. A shower conversion has a different scope from a full bathroom rebuild. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
      },
      {
        question: 'How much does a bathroom remodel cost in this region?',
        answer:
          'Most full bathroom remodels start around $15k for a clean refresh, $25k–$45k for a full layout-changing remodel with premium tile, and $45k+ for primary suite remodels with custom showers and high-end finishes. Your free estimate is always line-itemed and written.',
      },
      {
        question: 'Will my bathroom be unusable during the project?',
        answer:
          "Yes — for the bathroom under renovation. If it's your only bathroom, we work with you on scheduling to compress the downtime. Most homes have a second bathroom, so we plan demo and rough-in around your daily routine.",
      },
      {
        question: 'Do you handle permits and inspections?',
        answer:
          "Yes. We pull every permit required by your county or municipality, document each inspection, and submit the final paperwork on your behalf. You shouldn't have to chase paperwork on your own remodel.",
      },
      {
        question: 'Can you match an existing aesthetic in an older home?',
        answer:
          "Yes — we work in both modern and traditional/historic homes. We can pull tile, fixtures, and finishes that respect the original character of a Frederick rowhouse or a Winchester historic property, or carry a modern aesthetic across an existing home with confidence.",
      },
    ],
    relatedGuideSlugs: [
      'walk-in-shower-cost-wv-md-va-2026',
      'primary-bathroom-remodel-cost-loudoun-county-2026',
      'bathroom-remodel-cost-frederick-md-2026',
    ],
    icon: 'Bath',
    gallery: [
      { src: '/images/work/bath-primary-shower-and-vanity.webp', alt: 'Primary bath with walk-in tile shower beside a quartz-topped navy vanity' },
      { src: '/images/work/bath-primary-navy-vanity.webp', alt: 'Navy shaker vanity with matte black pulls and a quartz top' },
      { src: '/images/work/bath-primary-tile-leveling.webp', alt: 'Large-format marble-look floor tile set with a tile leveling system' },
    ],
  },

  kitchens: {
    slug: 'kitchens',
    title: 'Kitchen Remodeling',
    serviceType: 'Kitchen Remodeling',
    metaTitle: 'Kitchen Remodeling in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Custom kitchen remodels across the WV–MD–VA region — cabinetry, countertops, islands, and layout changes, built with military precision.',
    keywords: [
      'kitchen remodel',
      'kitchen renovation',
      'custom kitchen',
      'cabinet installation',
      'kitchen remodeling Frederick MD',
      'kitchen remodeling Winchester VA',
      'kitchen remodel Loudoun County',
    ],
    answer:
      'Real Elite Contracting offers kitchen remodeling, cabinetry, countertops, islands, and layout updates. Discuss the drawings, materials, and trade responsibilities at the estimate.',
    hero: {
      eyebrow: 'Premium Interior',
      heading: 'Kitchen Remodeling',
      sub: 'Custom cabinetry, islands, layout changes, and full kitchen transformations across the WV–MD–VA region. Premium kitchens built for the family that actually cooks in them.',
    },
    overview: {
      paragraphs: [
        "Real Elite Contracting builds custom kitchens for homeowners across Eastern Panhandle WV, Frederick MD, Winchester VA, Loudoun County, and the surrounding region. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
        "The construction schedule depends on the approved scope, selections, permits, and material availability. Review the proposed scope and warranty terms before signing. We don't take on more kitchens than we can deliver well — when we say yes to your project, you get our full attention.",
      ],
    },
    scope: {
      title: "What's in scope",
      items: [
        'Custom cabinetry (semi-custom and full custom options)',
        'Quartz, granite, and butcher block countertops',
        'Island additions and layout changes',
        'Plumbing relocation (sink, dishwasher, gas)',
        'Electrical and lighting upgrades, can lights, under-cabinet LED',
        'Backsplash tile and accent work',
        'Flooring and trim coordination',
        'Appliance package coordination and install',
        'Permitting and inspection coordination',
      ],
    },
    investment: {
      startingAt: '$28,000',
      note: 'Final estimate is always free, written, and line-itemed.',
      tiers: [
        { tier: 'Update', range: '$28k – $50k', notes: 'Same footprint, new cabinetry/counters/appliances' },
        { tier: 'Full Remodel', range: '$50k – $90k', notes: 'Layout changes, premium cabinetry, island add' },
        { tier: 'Open-Concept', range: '$90k – $150k+', notes: 'Wall removal, structural work, premium finishes' },
      ],
    },
    whyChooseUs: [
      "Discuss site supervision, communication, and cleanup arrangements during the estimate.",
      'We coordinate cabinetry lead times so demo lines up with delivery — no half-built kitchens sitting for weeks.',
      'Daily cleanup, dust containment, and protected walking paths through the rest of your home.',
    ],
    faqs: [
      {
        question: 'How long does a kitchen remodel take?',
        answer:
          'The construction schedule depends on the approved scope, selections, permits, and material availability. Cabinetry lead time is usually the longest item — we plan around it so you only lose your kitchen during the demo-and-install window, not the full ordering period.',
      },
      {
        question: 'How much does a kitchen remodel cost in this region?',
        answer:
          'A like-for-like update (same layout, new cabinets/counters/appliances) typically starts around $28k. A full remodel with layout changes runs $50k–$90k. Open-concept work involving wall removal and structural changes can push past $150k for primary kitchens with high-end finishes.',
      },
      {
        question: 'Can I live in my house during the kitchen remodel?',
        answer:
          "Most homeowners do. We set up a temporary kitchen station (microwave, fridge, sink access) and contain dust to the work zone. Daily cleanup is standard. We'll talk through any planned utility shutoffs in advance.",
      },
      {
        question: 'Do you handle the appliance install?',
        answer:
          "Yes. We coordinate appliance delivery, install, and inspection. If you've already purchased appliances we work around your timing; otherwise we'll recommend a mix that matches your budget and finishes.",
      },
      {
        question: 'What cabinetry brands do you work with?',
        answer:
          "We work across the semi-custom and full-custom range — we don't lock you into one brand. We'll discuss your budget, style, and lead-time tolerance on the estimate and recommend the right tier.",
      },
    ],
    relatedGuideSlugs: [
      'kitchen-remodel-cost-loudoun-county-2026',
      'kitchen-remodel-cost-wv-md-va-2026',
      'financing-a-kitchen-remodel-options-2026',
    ],
    icon: 'ChefHat',
    gallery: [
      { src: '/images/projects/kitchens/island-lantern-pendants.jpg', alt: 'White kitchen with marble-topped island, lantern pendants, and dark hardwood floors' },
      { src: '/images/projects/kitchens/gray-marble-waterfall.jpg', alt: 'Modern gray kitchen with marble waterfall island and chrome chandelier' },
      { src: '/images/projects/kitchens/white-herringbone.jpg', alt: 'White kitchen with herringbone tile backsplash and shiplap ceiling' },
      { src: '/images/projects/kitchens/white-island-chairs.jpg', alt: 'Open white kitchen with center island, navy chairs, and abstract artwork' },
      { src: '/images/projects/kitchens/two-tone-black-hood.jpg', alt: 'Two-tone kitchen with dark cabinetry, warm wood uppers, and black range hood' },
    ],
  },

  basements: {
    slug: 'basements',
    title: 'Basement Finishing',
    serviceType: 'Basement Finishing',
    metaTitle: 'Basement Finishing in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Finished basements, family rooms, in-law suites, and bars across the WV–MD–VA region — proper moisture control and code-compliant egress.',
    keywords: [
      'basement finishing',
      'finished basement',
      'basement remodel',
      'in-law suite',
      'basement bar',
      'basement build-out Frederick MD',
      'basement Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting finishes basements across the WV–MD–VA region — family rooms, in-law suites, and bars built on proper moisture control, code-compliant egress, and HVAC/electrical work, typically running 6–12 weeks.',
    hero: {
      eyebrow: 'New Living Space',
      heading: 'Basement Finishing',
      sub: 'Family rooms, in-law suites, home gyms, and basement bars across the WV–MD–VA region. The kind of basement build that adds usable square footage and resale value — done to code, done right.',
    },
    overview: {
      paragraphs: [
        "Real Elite Contracting finishes basements for homeowners across the WV–MD–VA region — and we treat the moisture-management and egress work as seriously as the finished space. A great basement isn't just framing and drywall; it's proper waterproofing, vapor barriers, egress windows where required, and the HVAC and electrical work that makes the space genuinely comfortable year-round.",
        "We handle everything: dig-out and egress windows, framing, electrical and lighting, HVAC extension, plumbing rough-ins for basement bathrooms and wet bars, drywall, flooring, trim, doors, and finish work. Most full basement build-outs run 6–12 weeks depending on scope. Permitting and inspection coordination is included.",
      ],
    },
    scope: {
      title: "What's in scope",
      items: [
        'Moisture assessment + vapor barrier + perimeter waterproofing as needed',
        'Egress window installation where code requires',
        'Framing, insulation (rim joist + walls), and drywall',
        'Electrical, lighting, and panel upgrades',
        'HVAC extension or independent zone',
        'Basement bathrooms and wet bar rough-ins',
        'Flooring (LVP, tile, or carpet) and trim work',
        'Permitting + code inspection coordination',
      ],
    },
    investment: {
      startingAt: '$35,000',
      note: 'Egress, bathroom, and bar add-ons priced separately. Free written estimate always.',
      tiers: [
        { tier: 'Open Family Room', range: '$35k – $55k', notes: 'Single open space, lighting, flooring, trim' },
        { tier: 'Full Build-out', range: '$55k – $90k', notes: 'Multiple rooms, bathroom, egress, premium finishes' },
        { tier: 'In-Law Suite', range: '$90k – $140k+', notes: 'Bedroom, full bath, kitchenette, separate entry' },
      ],
    },
    whyChooseUs: [
      'Moisture and vapor control done right — not papered over with drywall.',
      'Egress, electrical, HVAC, and plumbing coordinated with code from day one.',
      "We pull and pass permits — your county's inspector signs off, not just us.",
    ],
    faqs: [
      {
        question: "Is my basement a candidate for finishing?",
        answer:
          "Most basements are, but moisture history matters. We'll do a no-cost assessment before quoting — looking at the perimeter, sump pump performance, any prior water intrusion, and ceiling height. If something needs to be addressed first (drainage, waterproofing, structural), we'll tell you up front.",
      },
      {
        question: 'How long does a finished basement take?',
        answer:
          'Most full basement build-outs run 6–12 weeks. Open family rooms on the lower end, full build-outs with bathrooms and bars closer to 10–12. Egress installation and structural work can add time.',
      },
      {
        question: 'Do I need egress windows?',
        answer:
          "If you're adding a bedroom, code in WV/MD/VA requires an egress window. Even if you're not, egress windows transform a basement by adding natural light. We coordinate the install — including window-well drainage — as part of the project.",
      },
      {
        question: 'Can I add a bathroom or wet bar?',
        answer:
          "Yes. Both are common adds. Bathrooms require either an existing rough-in or a macerating/up-flush install. Wet bars are simpler. We'll cost them out separately so you can see what each addition contributes to the total.",
      },
      {
        question: 'Will the basement be warm enough?',
        answer:
          "Yes — proper rim joist insulation, perimeter wall insulation, and an HVAC extension (or independent zone, depending on your system) keep finished basements comfortable year-round. We don't cut corners on insulation.",
      },
      {
        question: 'Do I need a permit to finish a basement in Loudoun County?',
        answer:
          'Yes. Loudoun requires a building and zoning application for architectural and structural work, plus trade permits for electrical, plumbing, mechanical, and gas when those systems are in the job. Typical Finished Basement Details can stand in for custom drawings unless you alter a load-bearing wall, an exterior wall, a beam, or a column. Published Typical fees are 1% of construction cost excluding those trades, with a $65 minimum; a kitchen in the basement adds a published $165 zoning fee; full plans add a published $130 plan review fee. Leesburg, Purcellville, and Middleburg issue town zoning first. A bedroom needs an emergency egress window. We put the current fees in the written estimate.',
      },
    ],
    relatedGuideSlugs: [
      'basement-remodeling-cost-ashburn-leesburg-2026',
      'basement-egress-window-cost-eastern-panhandle-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
    icon: 'Home',
  },

  /* ---------------------------- EXISTING ---------------------------- */

  roofing: {
    slug: 'roofing',
    title: 'Roofing',
    serviceType: 'Roofing',
    metaTitle: 'Roofing in Eastern Panhandle, WV | Real Elite Contracting',
    metaDescription:
      'Expert roof replacement and repair with premium architectural shingles. Family-run roofing contractor serving WV, MD, VA.',
    keywords: [
      'roofing',
      'roof replacement',
      'roof repair',
      'architectural shingles',
      'roofing contractor',
      'Martinsburg',
      'Frederick MD roofing',
      'Winchester VA roofing',
    ],
    answer:
      'Real Elite Contracting is a family-run roofing contractor serving WV, MD, and VA — full tear-off replacement, storm-damage repair, and premium architectural shingle installs (GAF, Owens Corning), most jobs completed in 1–3 days.',
    hero: {
      eyebrow: 'Exterior',
      heading: 'Roofing Services',
      sub: 'Architectural shingle replacement, valley flashing, storm-damage repair, and complete tear-offs across the WV–MD–VA region.',
      image: { src: '/images/roofing-hero.jpg', alt: 'Completed dark architectural shingle roof with clean ridge cap' },
    },
    overview: {
      paragraphs: [
        "Your roof is one of the most important investments in your home's protection and curb appeal. Real Elite Contracting delivers expert roofing services using premium architectural shingles that combine durability, aesthetics, and superior weather protection.",
        "Whether you need a complete roof replacement, storm damage repair, or gutter work, our experienced team handles every project with precision and care. Detailed inspections, honest recommendations, transparent pricing.",
      ],
      image: { src: '/images/roofing-slope.jpg', alt: 'New charcoal architectural shingle roof with clean valley lines' },
    },
    scope: {
      items: [
        'Architectural shingles installation (GAF, Owens Corning)',
        'Flat roofing solutions',
        'Roof repairs and leak fixes',
        'Storm damage assessment and repair',
        'Gutter installation and maintenance',
        'Roof inspections',
      ],
    },
    investment: {
      startingAt: '$8,000',
      note: 'Full residential replacements. Repairs and partial work priced separately.',
      tiers: [
        { tier: 'Repair', range: '$500 – $3,500', notes: 'Targeted leak fixes, flashing, valley repair' },
        { tier: 'Replacement', range: '$8k – $20k', notes: 'Full residential tear-off + architectural shingles' },
        { tier: 'Premium', range: '$20k – $40k+', notes: 'Large or complex roofs, premium shingle tiers, ridge venting' },
      ],
    },
    gallery: [
      { src: '/images/roofing-valley.jpg', alt: 'Roof valley and flashing detail' },
      { src: '/images/roofing-slope.jpg', alt: 'New charcoal shingle roof slope' },
      { src: '/images/roofing-crew.jpg', alt: 'Roofing crew working on a residential roof' },
    ],
    whyChooseUs: [
      'Premium materials from industry-leading manufacturers (GAF, Owens Corning).',
      'WV and VA contractor licenses; request insurance documentation.',
      'Review warranty terms before signing.',
    ],
    faqs: [
      {
        question: 'How much does a new roof cost in this region?',
        answer:
          'Most residential roof replacements range from $8,000 to $20,000 depending on size, slope complexity, and materials. Premium tiers and larger or more complex roofs can run higher. Free written estimate always.',
      },
      {
        question: 'How long does a roof replacement take?',
        answer:
          'Most residential roof replacements complete in 1–3 days. Larger or more complex roofs take longer; we give you the timeline before we tear off the first shingle.',
      },
      {
        question: 'What roofing materials do you use?',
        answer:
          'Architectural shingles and standing-seam metal are options to discuss during your estimate. Warranty coverage depends on the selected product and installation requirements.',
      },
      {
        question: 'Do you handle insurance claims for storm damage?',
        answer:
          'Yes. We work directly with your insurance company to document damage and simplify the claims process for storm-damaged roofs.',
      },
    ],
  },

  siding: {
    slug: 'siding',
    title: 'Siding & Stone Exteriors',
    serviceType: 'Siding Installation',
    metaTitle: 'Siding & Stone Exteriors | Real Elite Contracting',
    metaDescription:
      'Vinyl, fiber cement, and stone veneer siding installation. Premium exterior craftsmanship for homes across the WV–MD–VA region.',
    keywords: [
      'siding installation',
      'siding repair',
      'vinyl siding',
      'fiber cement siding',
      'James Hardie',
      'stone veneer',
      'Eastern Panhandle contractor',
    ],
    answer:
      'Real Elite Contracting installs vinyl, fiber cement, and stone veneer siding for homes across the WV–MD–VA region — premium exterior materials that protect the home and deliver one of the highest-ROI upgrades available.',
    hero: {
      eyebrow: 'Curb Appeal',
      heading: 'Siding & Stone Exteriors',
      sub: 'Vinyl, fiber cement, and stone veneer that elevate every facade. The exterior upgrade with the highest ROI of any home improvement.',
      image: { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone veneer porch facade with custom railings' },
    },
    overview: {
      paragraphs: [
        "Your home's siding is more than aesthetics — it's your first line of defense against the elements. Real Elite Contracting installs vinyl, fiber cement, and stone veneer siding using premium materials that protect your home while transforming its curb appeal.",
        "Whether you're upgrading dated siding, repairing storm damage, or doing a complete exterior makeover, our team delivers flawless installations with attention to every detail.",
      ],
      image: { src: '/images/siding-window-work.webp', alt: 'Siding and window replacement in progress' },
    },
    scope: {
      items: [
        'Vinyl siding installation',
        'Fiber cement siding (James Hardie)',
        'Stone veneer facades and accents',
        'Wood siding installation and repair',
        'Window wrapping and trim work',
        'Complete exterior makeovers',
      ],
    },
    investment: {
      startingAt: '$8,000',
      tiers: [
        { tier: 'Vinyl', range: '$8k – $18k', notes: 'Full home vinyl replacement' },
        { tier: 'Fiber Cement', range: '$15k – $30k', notes: 'James Hardie or comparable' },
        { tier: 'Stone Veneer Accent', range: '$5k – $20k+', notes: 'Front facade, porch, foundation accents' },
      ],
    },
    gallery: [
      { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone veneer porch facade' },
      { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer foundation detail' },
      { src: '/images/siding-window-work.webp', alt: 'Siding replacement in progress' },
    ],
    whyChooseUs: [
      'Extensive experience with all major siding materials and stone veneer systems.',
      'Expert installation that maximizes durability and weather protection.',
      'Transparent pricing — no hidden costs or surprises.',
    ],
    faqs: [
      {
        question: 'How much does new siding cost?',
        answer:
          'Vinyl typically runs $8k–$18k for a full home, fiber cement (James Hardie) $15k–$30k, and stone veneer accents start around $5k for a porch or partial facade. Larger homes and complex elevations push higher.',
      },
      {
        question: 'What siding materials do you offer?',
        answer:
          'Vinyl, fiber cement (James Hardie and comparable), stone veneer, and wood. Each material has unique benefits — we help you choose based on budget, style, and maintenance preferences.',
      },
      {
        question: 'How long does siding installation take?',
        answer:
          'Most full siding installs take 1–2 weeks depending on home size and material. Stone veneer accent work is faster — often a few days.',
      },
      {
        question: 'Does new siding increase home value?',
        answer:
          'Yes. Fiber cement siding is one of the highest-ROI exterior improvements, with industry data showing 70%+ recoup at resale plus dramatic curb appeal gains.',
      },
    ],
  },

  paving: {
    slug: 'paving',
    title: 'Paving & Seal Coating',
    serviceType: 'Paving Contractor',
    metaTitle: 'Paving & Seal Coating | Real Elite Contracting',
    metaDescription:
      'Asphalt, concrete & tar-and-chip driveways, parking lots, repairs, and seal coating across the Eastern Panhandle of WV. Residential and commercial — free written estimates.',
    keywords: [
      'paving',
      'asphalt driveway',
      'driveway paving',
      'seal coating',
      'sealcoating',
      'driveway repair',
      'parking lot paving',
      'commercial paving',
      'tar and chip',
      'concrete driveway',
      'Eastern Panhandle paving',
      'Martinsburg paving',
    ],
    answer:
      'Real Elite Contracting paves and seal-coats driveways and parking lots across the Eastern Panhandle of WV — asphalt, concrete, and tar-and-chip installs, repairs, and protective seal coating for residential and commercial properties, with free written estimates.',
    hero: {
      eyebrow: 'Driveways & Lots',
      heading: 'Paving & Seal Coating',
      sub: 'New driveways and parking lots, repairs, and seal coating — asphalt, concrete, and tar-and-chip, done right and built to last across the Eastern Panhandle.',
    },
    overview: {
      paragraphs: [
        "A driveway or parking lot is the first thing visitors see and the surface you use every day — and asphalt that's cracked, faded, or crumbling drags down the whole property. Real Elite Contracting offers paving and seal coating for homes and businesses across the Eastern Panhandle: new driveways and lots, repairs, and protective seal coating that keeps your asphalt looking sharp and lasting longer.",
        "We work in asphalt, concrete, and tar-and-chip, and we handle the full project — from proper base prep to the final seal — with the same disciplined process and accountability we bring to every job. Whether it's a new residential driveway, a commercial lot with fresh striping, or just a reseal to protect what you have, we'll get it done right.",
      ],
      image: { src: '/images/inspiration/paving-aplus-driveway.jpg', alt: 'A freshly finished residential driveway in the Eastern Panhandle' },
    },
    scope: {
      title: 'What we handle',
      items: [
        'New asphalt, concrete & tar-and-chip driveways',
        'Commercial parking lots & line striping',
        'Driveway repair, patching & resurfacing',
        'Seal coating for protection and curb appeal',
        'Crack filling and pothole repair',
        'Proper grading and base prep for results that last',
      ],
    },
    gallery: [
      { src: '/images/inspiration/paving-aplus-driveway-2.jpg', alt: 'A newly paved residential driveway' },
      { src: '/images/inspiration/paving-aplus-commercial.jpg', alt: 'A freshly paved and striped commercial parking lot' },
      { src: '/images/inspiration/paving-aplus-roller.jpg', alt: 'A roller compacting fresh asphalt on a driveway' },
    ],
    whyChooseUs: [
      'One accountable point of contact — Real Elite manages your paving project from first call to final pass.',
      'Residential and commercial — driveways, parking lots, and seal coating across the Eastern Panhandle.',
      'Free, no-pressure written estimates, and honest advice on whether you need a repair, a reseal, or a full replacement.',
    ],
    faqs: [
      {
        question: 'What does a new driveway, parking lot, or seal coating cost?',
        answer:
          'It depends on the size and condition of the surface and whether you need a new install, a repair, or just seal coating. We give you a free, written estimate after a quick on-site look — no guesswork and no obligation.',
      },
      {
        question: 'Do you do commercial parking lots, or just residential driveways?',
        answer:
          'Both. We handle residential driveways and commercial parking lots — including fresh line striping — across the Eastern Panhandle.',
      },
      {
        question: "What's the difference between paving and seal coating?",
        answer:
          'Paving is installing or resurfacing the asphalt itself. Seal coating is a protective top layer applied over existing asphalt that shields it from water, UV, and oxidation — it keeps the surface black and extends its life. Most asphalt benefits from a reseal every few years.',
      },
      {
        question: 'What materials do you work in?',
        answer:
          'Asphalt, concrete, and tar-and-chip. We help you choose based on your budget, the look you want, and how the surface will be used — then prep and install it to last.',
      },
    ],
    areaScope: {
      label: 'the Eastern Panhandle',
      cities: [
        { city: 'Martinsburg', state: 'WV', slug: 'martinsburg-wv' },
        { city: 'Inwood', state: 'WV', slug: 'inwood-wv' },
        { city: 'Charles Town', state: 'WV', slug: 'charles-town-wv' },
        { city: 'Ranson', state: 'WV', slug: 'ranson-wv' },
        { city: 'Hedgesville', state: 'WV', slug: 'hedgesville-wv' },
        { city: 'Spring Mills', state: 'WV', slug: 'spring-mills-wv' },
        { city: 'Falling Waters', state: 'WV', slug: 'falling-waters-wv' },
        { city: 'Shepherdstown', state: 'WV', slug: 'shepherdstown-wv' },
        { city: 'Berkeley Springs', state: 'WV', slug: 'berkeley-springs-wv' },
      ],
    },
    relatedGuideSlugs: ['asphalt-vs-concrete-vs-tar-and-chip-driveways-eastern-panhandle-2026'],
    icon: 'Construction',
  },

  decks: {
    slug: 'decks',
    title: 'Decks',
    serviceType: 'Deck Construction',
    metaTitle: 'Decks & Outdoor Living | Real Elite Contracting',
    metaDescription:
      'Custom deck construction with composite and pressure-treated materials. Outdoor living spaces across the WV–MD–VA region — built to last decades.',
    keywords: [
      'deck construction',
      'deck building',
      'composite decking',
      'Trex',
      'TimberTech',
      'outdoor living',
      'Eastern Panhandle',
      'Loudoun County deck',
    ],
    answer:
      'Real Elite Contracting designs and builds custom decks across the WV–MD–VA region — pressure-treated and premium composite (Trex, TimberTech, Azek), railings, and full outdoor living spaces engineered for the four-season climate.',
    hero: {
      eyebrow: 'Outdoor',
      heading: 'Custom Decks',
      sub: 'Composite decks, railings, lighting, and full backyard transformations. The outdoor living spaces premium homeowners actually use.',
      image: { src: '/images/deck-night-lights.jpg', alt: 'Finished composite deck with solar post lights at night' },
    },
    overview: {
      paragraphs: [
        "A well-built deck extends your living space and becomes the heart of outdoor entertainment. Real Elite Contracting specializes in custom deck design and construction that integrates seamlessly with your home while delivering decades of use.",
        "From traditional pressure-treated lumber to premium composite (Trex, TimberTech, Azek), we build decks for the four-season WV–MD–VA climate. Proper structural support, superior craftsmanship, and railings that prioritize both safety and aesthetics.",
      ],
      image: { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white horizontal railings' },
    },
    scope: {
      items: [
        'Composite decking (Trex, TimberTech, Azek)',
        'Pressure-treated lumber decks',
        'Multi-level deck designs',
        'Custom railings and built-in benches',
        'Pergolas and shade structures',
        'Solar post-cap and step lights',
        'Deck repairs, refinishing, and expansions',
      ],
    },
    investment: {
      startingAt: '$8,000',
      tiers: [
        { tier: 'Pressure-Treated', range: '$8k – $18k', notes: 'Standard wood deck, single level' },
        { tier: 'Composite', range: '$15k – $35k', notes: 'Premium composite materials with railings' },
        { tier: 'Outdoor Living', range: '$35k – $80k+', notes: 'Multi-level, pergola, lighting, built-ins' },
      ],
    },
    gallery: [
      { src: '/images/work/deck-composite-stairs-front.webp', alt: 'Composite deck with white vinyl railings and a wide stair down to the patio' },
      { src: '/images/work/deck-composite-surface.webp', alt: 'Brown composite decking with a curved run of white vinyl railing' },
      { src: '/images/deck-lounge.jpg', alt: 'Deck with outdoor lounge furniture' },
      { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white railings' },
      { src: '/images/deck-night-lights.jpg', alt: 'Finished deck with solar post lights at night' },
      { src: '/images/work/deck-composite-night-stairs.webp', alt: 'Deck stair and railings lit by post-cap lights at night' },
    ],
    whyChooseUs: [
      'Custom designs tailored to your home and how you actually use the space.',
      'Premium materials that hold up to the four-season WV–MD–VA climate.',
      'Expert craftsmanship — structural integrity, clean detail work, no shortcuts.',
    ],
    faqs: [
      {
        question: 'How much does a new deck cost?',
        answer:
          'A pressure-treated deck typically runs $8k–$18k, composite $15k–$35k, and full outdoor living buildouts with pergolas and lighting $35k–$80k+. Free written estimate after a site walk.',
      },
      {
        question: 'What deck materials do you recommend?',
        answer:
          'For most homeowners in this region we recommend composite — it holds up better to humidity, UV, and freeze-thaw cycles than pressure-treated and requires almost no maintenance. PT remains the right call for budget-tight builds.',
      },
      {
        question: 'Do I need a permit for a deck?',
        answer:
          "Yes in the markets we publish. Loudoun County requires a building permit and a zoning permit on every deck. Typical Deck Detail is the published fast path at $265 with 2-day building and 2-day zoning review when the design qualifies; a roof or screen needs full plans at $395. Leesburg, Purcellville, and Middleburg issue town zoning first. Frederick County MD requires a permit for a new or replacement deck (City of Frederick and Mt. Airy permit separately). We tell you which office files the job and put the published fee in the written estimate.",
      },
      {
        question: 'How long does it take to build a deck?',
        answer:
          "Deck schedules depend on the design, permit review, weather, and material availability. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
      },
    ],
    relatedGuideSlugs: [
      'deck-cost-per-square-foot-eastern-panhandle-2026',
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'composite-vs-pressure-treated-decks-loudoun-county-va',
    ],
  },

  'outdoor-living': {
    slug: 'outdoor-living',
    title: 'Outdoor Living',
    serviceType: 'Outdoor Living Construction',
    metaTitle: 'Outdoor Living Spaces | Real Elite Contracting',
    metaDescription:
      'Screened porches, covered patios, pergolas, and outdoor living spaces built across the WV–MD–VA region. Free written estimate after a site walk.',
    keywords: [
      'outdoor living',
      'screened porch',
      'covered patio',
      'pergola',
      'porch roof',
      'outdoor kitchen',
      'Loudoun County outdoor living',
      'Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting builds outdoor living spaces across the WV–MD–VA region: screened porches, covered patios and porch roofs, pergolas, and the decks and patios that tie them to the house.',
    hero: {
      eyebrow: 'Outdoor',
      heading: 'Outdoor Living',
      sub: 'Screened porches, covered patios, and pergolas built as part of the house, not an afterthought.',
      image: { src: '/images/work/deck-night-full-house.jpg', alt: 'Finished deck lit at night across the back of the house' },
    },
    overview: {
      paragraphs: [
        'Outdoor living is the room you use from April to November. A screened porch for mornings without bugs, a covered patio that keeps dinner going through a summer storm, a pergola that gives a deck some shade. Real Elite Contracting plans these spaces around how your family actually uses the backyard.',
        'A roof over a porch or patio is a structural addition to the house. It ties into the existing roof or wall, carries snow load, and needs footings sized for it. We draw it, file the permit, and build it so the new roofline looks like it was always there.',
      ],
      image: { src: '/images/work/deck-night-rail-moon.jpg', alt: 'Deck railing at night with the moon above' },
    },
    scope: {
      items: [
        'Screened porches and three-season rooms',
        'Covered patios and porch roofs tied into the house',
        'Pergolas and shade structures',
        'Composite and pressure-treated decks',
        'Concrete patios and walkways',
        'Outdoor kitchen and fire-feature surrounds (gas and electrical by licensed trades)',
        'Solar post-cap and step lights',
      ],
    },
    gallery: [
      { src: '/images/work/deck-night-full-house.jpg', alt: 'Finished deck lit at night across the back of the house' },
      { src: '/images/work/deck-night-rail-moon.jpg', alt: 'Deck railing at night with the moon above' },
      { src: '/images/work/deck-composite-stairs-front.webp', alt: 'Composite deck with white vinyl railings and a wide stair down to the patio' },
      { src: '/images/work/deck-composite-surface.webp', alt: 'Brown composite decking with a curved run of white vinyl railing' },
      { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white railings' },
      { src: '/images/deck-night-lights.jpg', alt: 'Finished deck with solar post lights at night' },
    ],
    whyChooseUs: [
      'Planned around how you use the yard, not a catalog layout.',
      'Roofs and footings built for snow load and the four-season WV–MD–VA climate.',
      'One crew from permit to final inspection.',
    ],
    faqs: [
      {
        question: 'Do I need a permit for a screened porch or covered patio?',
        answer:
          'Yes. A roof over a porch or patio is a structural addition. Loudoun County needs full plans for a deck with a roof or screen. We tell you which office files the job and put the published fee in the written estimate.',
      },
      {
        question: 'Can you add a roof to my existing deck?',
        answer:
          'Often, yes, but the existing deck has to carry the new load. We check the footings, beams, and ledger first. If they are undersized, the estimate says what has to change before a roof goes on.',
      },
      {
        question: 'What does an outdoor living space cost?',
        answer:
          'Full outdoor living builds with multiple levels, a pergola, lighting, and built-ins typically run $35k–$80k+. Smaller projects are priced on a free written estimate after a site walk.',
      },
    ],
    relatedGuideSlugs: [
      'covered-patio-outdoor-living-cost-loudoun-county-2026',
      'deck-cost-per-square-foot-eastern-panhandle-2026',
    ],
    icon: 'Fence',
  },

  stairs: {
    slug: 'stairs',
    title: 'Stairs & Railings',
    serviceType: 'Stair Construction and Remodeling',
    metaTitle: 'Stairs & Railings | Real Elite Contracting',
    metaDescription:
      'Staircase remodels, new treads and balusters, handrails, and exterior deck and porch stairs built to code across the WV–MD–VA region.',
    keywords: [
      'staircase remodel',
      'stair treads',
      'balusters',
      'iron balusters',
      'handrail replacement',
      'deck stairs',
      'porch stairs',
      'stair railing',
    ],
    answer:
      'Real Elite Contracting remodels interior staircases and builds exterior stairs across the WV–MD–VA region: carpet-to-hardwood treads, new risers, wood or iron balusters, handrails and newel posts, and deck and porch stairs built to code.',
    hero: {
      eyebrow: 'Interior & Exterior',
      heading: 'Stairs & Railings',
      sub: 'From carpet-to-hardwood staircase makeovers to new deck stairs, built to code and finished clean.',
      image: { src: '/images/work/deck-composite-stairs-front.webp', alt: 'Composite deck with white vinyl railings and a wide stair down to the patio' },
    },
    overview: {
      paragraphs: [
        'The staircase is often the first thing people see when they walk in. Swapping carpet for hardwood treads, painting the risers, and replacing spindles with wood or iron balusters changes the whole entry without touching a wall.',
        "Outside, stairs take the most wear of anything on a deck or porch. We build them with consistent rise and run, solid stringers, graspable handrails, and guards where the drop calls for them. Changing a stair's structure or layout needs a building permit; replacing treads and balusters on a sound stair usually does not, and we confirm which applies before work starts.",
      ],
      image: { src: '/images/work/deck-composite-night-stairs.webp', alt: 'Deck stair and railings lit by post-cap lights at night' },
    },
    scope: {
      items: [
        'Carpet-to-hardwood tread conversions',
        'New risers, skirt boards, and trim',
        'Wood and iron baluster replacement',
        'Handrails, newel posts, and wall rails',
        'Deck and porch stairs and landings',
        'Exterior stair railings and guards',
        'Stair repairs: loose treads, squeaks, and wobbly rails',
      ],
    },
    gallery: [
      { src: '/images/work/deck-composite-stairs-front.webp', alt: 'Composite deck with white vinyl railings and a wide stair down to the patio' },
      { src: '/images/work/deck-composite-night-stairs.webp', alt: 'Deck stair and railings lit by post-cap lights at night' },
      { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white railings' },
      { src: '/images/work/deck-night-rail-moon.jpg', alt: 'Deck railing at night with the moon above' },
    ],
    whyChooseUs: [
      'Consistent rise and run, so nobody trips on an odd step.',
      'Clean finish carpentry where the stair meets the floor and the wall.',
      'Interior and exterior stairs from the same crew.',
    ],
    faqs: [
      {
        question: 'Can you replace carpet on my stairs with hardwood?',
        answer:
          'Yes. We remove the carpet, replace or cap the treads with hardwood, and paint or stain the risers. Most homes keep the existing stringers, so the stair layout does not change.',
      },
      {
        question: 'Do I need a permit to redo my stairs?',
        answer:
          "Replacing treads, risers, or balusters on a sound stair usually does not need one. Changing the stair's structure or layout, or building new exterior stairs, does. We confirm with your county before work starts.",
      },
      {
        question: 'What does a staircase remodel cost?',
        answer:
          'It depends on the number of steps, the tread material, and whether the balusters and handrail are replaced too. We price every staircase on a free written estimate after a site walk.',
      },
    ],
    icon: 'Hammer',
  },

  remodeling: {
    slug: 'remodeling',
    title: 'Whole-Home Remodeling',
    serviceType: 'Home Remodeling',
    metaTitle: 'Whole-Home Remodeling | Real Elite Contracting',
    metaDescription:
      'Interior and exterior remodeling — kitchens, bathrooms, basements, and full home renovations across the WV–MD–VA region.',
    keywords: [
      'home remodeling',
      'kitchen remodel',
      'bathroom remodel',
      'basement finishing',
      'home renovation',
      'interior remodeling',
      'Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting offers whole-home remodeling, kitchens, bathrooms, and basement finishing. Start by defining which rooms and finishes belong in the scope.',
    hero: {
      eyebrow: 'Premium Interior',
      heading: 'Whole-Home Remodeling',
      sub: 'Interior and exterior remodels — kitchens, bathrooms, basements, additions. Project-managed end-to-end with one accountable lead.',
      image: { src: '/images/flooring-dark-living.jpg', alt: 'Dark laminate flooring installed in remodeled living room' },
    },
    overview: {
      paragraphs: [
        "Your home should evolve with your family. Real Elite Contracting specializes in kitchen remodels, bathroom renovations, basement finishing, and complete interior updates that transform your living spaces while preserving the character of your home.",
        "We manage every aspect — from design consultation through final inspection — keeping projects on schedule, on budget, and on standard. Discuss site supervision, communication, and cleanup arrangements during the estimate.",
      ],
      image: { src: '/images/flooring-light-living.jpg', alt: 'Light vinyl plank flooring in remodeled living space' },
    },
    scope: {
      items: [
        'Kitchen remodeling — see dedicated kitchen page',
        'Bathroom remodeling — see dedicated bathroom page',
        'Basement finishing — see dedicated basement page',
        'Whole-home interior updates',
        'Flooring installation (LVP, hardwood, tile)',
        'Custom built-ins and storage',
      ],
    },
    investment: {
      startingAt: '$15,000',
      tiers: [
        { tier: 'Single Room', range: '$15k – $45k', notes: 'One-room remodel or interior update' },
        { tier: 'Multi-Room', range: '$45k – $120k', notes: 'Kitchen + bathroom, or kitchen + flooring + paint' },
        { tier: 'Whole-Home', range: '$120k – $400k+', notes: 'Full interior renovation, structural changes' },
      ],
    },
    gallery: [
      { src: '/images/flooring-dark-living.jpg', alt: 'Dark laminate flooring in living room' },
      { src: '/images/flooring-light-hallway.jpg', alt: 'Light wood laminate flooring in hallway' },
      { src: '/images/flooring-light-living.jpg', alt: 'Light vinyl plank flooring' },
    ],
    whyChooseUs: [
      'Full project management from design through completion.',
      'Quality materials and skilled trades for lasting results.',
      'Transparent communication and realistic timelines — held.',
    ],
    faqs: [
      {
        question: 'How much does a remodel cost?',
        answer:
          'Highly variable. Single-room work starts around $15k. Multi-room projects run $45k–$120k. Whole-home renovations can run $120k–$400k+ depending on structural changes and finishes. Every estimate is line-itemed in writing.',
      },
      {
        question: 'How long does a remodel take?',
        answer:
          'Bathroom remodels run 3–5 weeks, kitchens 6–10 weeks, full home renovations several months. We give you a written timeline before breaking ground.',
      },
      {
        question: 'Do you handle permits?',
        answer:
          'Yes — we handle every permit required by your county or municipality, and coordinate inspections from rough-in through final.',
      },
      {
        question: 'Can I live in my home during a remodel?',
        answer:
          'Most homeowners do. We contain dust, maintain access to essential rooms, and clean up daily. For kitchen and primary-bath work, we plan around your routine.',
      },
    ],
  },

  additions: {
    slug: 'additions',
    title: 'Home Additions',
    serviceType: 'Home Additions',
    metaTitle: 'Home Additions in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Home additions that seamlessly extend your existing home — engineered to last. Built across the WV–MD–VA region with military precision.',
    keywords: [
      'home additions',
      'house addition',
      'second story addition',
      'sunroom addition',
      'garage addition',
      'Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting designs and builds home additions across the WV–MD–VA region that match the existing architecture — bump-outs, single-room, second-story, and in-law suite additions with design and permit responsibilities established before construction.',
    hero: {
      eyebrow: 'New Space',
      heading: 'Home Additions',
      sub: 'Additions that seamlessly extend your existing home — engineered to last, matched to your existing architecture, project-managed end-to-end.',
      image: { src: '/images/new-build-weather-barrier.webp', alt: 'New home under construction with weather barrier and exposed roof trusses' },
    },
    overview: {
      paragraphs: [
        "Sometimes the right answer isn't moving — it's adding. Real Elite Contracting designs and builds home additions that look like they were always part of the original structure. Roofline, siding, foundation, interior finish — matched so you can't tell where the original house ends and the new build begins.",
        "Additions require a defined design, engineering, permit, and construction scope. Confirm each professional and contractor responsibility before signing.",
      ],
      image: { src: '/images/framing-walls-work.webp', alt: 'Timber wall framing and window openings during construction' },
    },
    scope: {
      items: [
        'Single and multi-room additions',
        'Second-story additions',
        'Sunroom and four-season room additions',
        'Garage additions and conversions',
        'In-law suite additions',
        'Bump-out additions',
        'Foundation, framing, and roofing tie-in',
      ],
    },
    investment: {
      startingAt: '$60,000',
      tiers: [
        { tier: 'Bump-out', range: '$60k – $120k', notes: 'Small footprint expansion (under 200 sq ft)' },
        { tier: 'Single Room', range: '$120k – $250k', notes: 'Full-room addition with finishes' },
        { tier: 'Second Story', range: '$250k – $500k+', notes: 'Full second story or major multi-room addition' },
      ],
    },
    gallery: [
      { src: '/images/framing-windows.jpg', alt: 'Window framing on a home addition' },
      { src: '/images/house-wrap-worker.jpg', alt: 'House wrap install on new addition' },
      { src: '/images/new-build-weather-barrier.webp', alt: 'New home under construction with weather barrier and exposed roof trusses' },
    ],
    whyChooseUs: [
      'Matched architecture — additions that look original.',
      'Discuss any engineering, permits, and additional contractor qualifications the project requires.',
      'Foundation, framing, roof tie-in, and finish coordinated with a coordinated scope.',
    ],
    faqs: [
      {
        question: 'How much does a home addition cost?',
        answer:
          'Bump-outs typically start around $60k. Full single-room additions run $120k–$250k. Second-story additions and large multi-room expansions can run $250k–$500k+. Every project gets a written line-item estimate.',
      },
      {
        question: 'How long does an addition take?',
        answer:
          'Bump-outs: 6–10 weeks. Single-room additions: 3–5 months. Second-story additions: 4–8 months. Permitting and structural engineering add up-front time before the first nail.',
      },
      {
        question: 'Do you handle structural engineering?',
        answer:
          'Yes. We coordinate stamped structural drawings, engineering review, and permitting as part of every addition project. You only sign one contract.',
      },
      {
        question: 'Will my addition look like part of the original house?',
        answer:
          'That\'s the goal on every project. We match rooflines, siding, trim profiles, and interior finishes carefully. Matching can never be 100% on older homes (material weathering, discontinued products), but we get it as close as the materials allow.',
      },
      {
        question: 'Do I need a permit for a home addition in Loudoun County?',
        answer:
          'Yes. Loudoun requires a building and zoning application, a plat with setbacks, and a comprehensive structural plan. Screened porches are published as residential additions, not Typical Deck jobs. Published county fees are $395 at or under 1,000 square feet (building, plan review, and county zoning bundled). Over 1,000 square feet the building fee is 1% of construction cost plus a $335 plan review fee plus county zoning. Leesburg, Purcellville, and Middleburg issue town zoning first. A bedroom added on well and septic needs Health Department approval before the county application. We put the current fees in the written estimate.',
      },
    ],
    relatedGuideSlugs: [
      'home-addition-cost-loudoun-county-2026',
      'home-additions-in-law-suites-loudoun-northern-virginia-2026',
      'loudoun-county-permits-hoa-guide-2026',
    ],
  },

  'exterior-repairs': {
    slug: 'exterior-repairs',
    title: 'Exterior Repairs',
    serviceType: 'Exterior Repairs',
    metaTitle: 'Exterior Repairs in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Stone veneer, foundation repair, trim work, and exterior maintenance. Skilled exterior repair work across the WV–MD–VA region.',
    keywords: [
      'exterior repairs',
      'stone veneer',
      'foundation repair',
      'trim work',
      'exterior maintenance',
      'Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting handles stone veneer, foundation repair, trim, and exterior maintenance across the WV–MD–VA region — the smaller exterior projects that protect the rest of the home, done to the same standard as the larger jobs.',
    hero: {
      eyebrow: 'Detail Craft',
      heading: 'Exterior Repairs',
      sub: 'Stone veneer detail work, foundation repair, trim, and exterior maintenance. The smaller exterior projects that need the same level of craft.',
      image: { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer foundation detail on a home exterior' },
    },
    overview: {
      paragraphs: [
        "Not every project is a full re-roof or full remodel — but the smaller exterior work still deserves real craft. Real Elite Contracting handles stone veneer detail work, foundation repair, trim restoration, and exterior maintenance with the same standards we bring to larger projects.",
        "This is the work that protects the rest of your home — if water finds a way in through bad trim, failing veneer, or a foundation crack, the damage spreads fast. We do these projects right the first time.",
      ],
    },
    scope: {
      items: [
        'Stone veneer installation and repair',
        'Foundation crack repair',
        'Exterior trim repair and replacement',
        'Soffit, fascia, and gutter work',
        'Caulking and exterior sealant',
        'Window trim and flashing repair',
      ],
    },
    gallery: [
      { src: '/images/stone-veneer-detail.jpg', alt: 'Stone veneer foundation detail' },
      { src: '/images/stone-veneer-finish.jpg', alt: 'Completed stone veneer work' },
      { src: '/images/stone-facade-finished.jpg', alt: 'Finished stone facade and trim' },
    ],
    whyChooseUs: [
      'Detail work done to a higher standard than typical handyman quality.',
      'Materials matched to your existing home as closely as available.',
      'Same warranty and process discipline as our larger projects.',
    ],
    faqs: [
      {
        question: 'Do you take on smaller exterior repair jobs?',
        answer:
          "Yes — we have a dedicated team for smaller exterior repairs. We don't treat them as filler work; the same project lead and warranty apply.",
      },
      {
        question: 'How quickly can you get to a foundation or water issue?',
        answer:
          "Water-intrusion repairs get priority scheduling. We can usually be on-site for an assessment within a few business days, with the actual repair scoped from there.",
      },
      {
        question: 'Do you offer ongoing exterior maintenance?',
        answer:
          'Yes. For premium clients we offer seasonal exterior maintenance — caulking, gutter, trim checks — to head off bigger problems before they start.',
      },
    ],
  },

  'general-repairs': {
    slug: 'general-repairs',
    title: 'General Repairs & Maintenance',
    serviceType: 'General Repairs',
    metaTitle: 'General Repairs & Maintenance | Real Elite Contracting',
    metaDescription:
      'Door and window repairs, drywall, trim work, deck fixes, and the smaller jobs that keep your home in great shape. Family-run, across the WV–MD–VA region.',
    keywords: [
      'general repairs',
      'home repair',
      'drywall repair',
      'door repair',
      'window repair',
      'trim work',
      'Eastern Panhandle',
    ],
    answer:
      'Real Elite Contracting offers general repairs and home maintenance, including doors, drywall, trim, and deck repairs. Discuss the repair scope at the estimate.',
    hero: {
      eyebrow: 'Smaller Projects',
      heading: 'General Repairs & Maintenance',
      sub: 'Doors, drywall, trim, deck fixes, and the smaller jobs that keep your home in great shape — done to the same standard as our larger projects.',
    },
    overview: {
      paragraphs: [
        "Most of what keeps a home in great shape is the small stuff — a door that doesn't latch quite right, drywall damage in the hallway, a deck board that's started to lift. Real Elite Contracting handles general repairs and home maintenance with the same discipline we bring to remodels.",
        "Discuss site supervision, communication, and cleanup arrangements during the estimate. Just smaller scope.",
      ],
    },
    scope: {
      items: [
        'Door installation and repair',
        'Window repair and weatherstripping',
        'Drywall patching and repair',
        'Trim repair and replacement',
        'Deck board replacement and repair',
        'Interior paint touch-ups',
        'Caulking and sealing',
      ],
    },
    whyChooseUs: [
      "Clear standards on every project — even the small ones.",
      'Ask about coverage for the proposed repair.',
      'One scheduled visit, in and out clean.',
    ],
    faqs: [
      {
        question: 'Is there a minimum project size?',
        answer:
          "Yes — we typically batch smaller repairs into single half-day or full-day visits. We'll quote a minimum on the call.",
      },
      {
        question: 'How fast can you schedule a repair visit?',
        answer:
          "Most general repair visits get scheduled within 1–2 weeks. Urgent water-intrusion or security issues (doors that won't lock) get faster scheduling.",
      },
      {
        question: 'Do you guarantee repair work?',
        answer:
          "Review the proposed scope and warranty terms before signing.",
      },
    ],
  },

  handyman: {
    slug: 'handyman',
    title: 'Handyman Services',
    serviceType: 'Handyman Services',
    metaTitle: 'Handyman Services in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Drywall repair, door installation, pressure washing, gutter cleaning, fence repair, TV mounting, and dozens of other reliable home repairs. Family-run.',
    keywords: [
      'handyman services',
      'home repair',
      'drywall repair',
      'pressure washing',
      'gutter cleaning',
      'fence repair',
      'TV mounting',
      'Eastern Panhandle handyman',
    ],
    answer:
      "Real Elite Contracting's handyman team covers the small-job catalog for homeowners across the WV–MD–VA region — drywall, doors, pressure washing, gutter cleaning, fence repair, TV mounting, and more, often in a single scheduled visit.",
    hero: {
      eyebrow: 'Small-Job Specialists',
      heading: 'Handyman Services',
      sub: 'Drywall, doors, pressure washing, gutter cleaning, fence repair, TV mounting, and dozens of other small-job specialties — done right.',
    },
    overview: {
      paragraphs: [
        "Real Elite's handyman team handles the small-job catalog that homeowners across the WV–MD–VA region need on a regular basis. Same scheduling system, same discipline, same warranty — just shorter visits.",
        "If you've got a list, we'll knock it out in a single visit when possible.",
      ],
    },
    scope: {
      items: [
        'Drywall repair and patching',
        'Door installation and adjustment',
        'Pressure washing',
        'Gutter cleaning and minor repair',
        'Fence repair',
        'TV mounting',
        'Light fixture replacement',
        'Caulking and weatherstripping',
        'Picture and shelf hanging',
      ],
    },
    whyChooseUs: [
      'Real scheduling — your visit happens when we say it will.',
      'Discuss cleanup and coverage before work begins.',
      'Same trustworthy crew, even on the small jobs.',
    ],
    faqs: [
      {
        question: 'Is there a minimum charge?',
        answer:
          "Yes — we have a minimum visit fee that covers travel and setup. We'll be upfront about it on the call.",
      },
      {
        question: 'Can you tackle a list of small jobs in one visit?',
        answer:
          "Often yes — that's our preferred way to schedule handyman work. Send us the list and we'll quote a single visit if it fits.",
      },
      {
        question: 'How quickly can I book a handyman visit?',
        answer:
          "Typical scheduling is 1–2 weeks out. Urgent water-intrusion or security issues are prioritized.",
      },
    ],
  },
};
