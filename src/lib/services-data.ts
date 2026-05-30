/**
 * Service page data layer. Every service page renders through
 * ServicePageTemplate using one of these entries.
 *
 * Bathrooms / Kitchens / Basements ship without project photography — their
 * `hero.image` and `gallery` fields are intentionally undefined so the
 * template falls back to a gradient hero and omits the gallery section.
 * Swap those in once real bathroom / kitchen / basement projects are shot.
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
    hero: {
      eyebrow: 'Premium Interior',
      heading: 'Bathroom Remodeling',
      sub: 'Walk-in showers, tile work, vanities, and full master-bath transformations across the WV–MD–VA region. The clean, communication-first remodel premium homeowners actually recommend.',
      image: {
        src: '/images/projects/bathrooms/hero.jpg',
        alt: 'Custom marble walk-in shower with frameless glass enclosure and herringbone tile floor',
      },
    },
    overview: {
      paragraphs: [
        "Your bathroom is the room you start every day in and end every day in — so the build has to be right. Real Elite Contracting handles full bathroom remodels, walk-in shower conversions, and tile work for homeowners across Eastern Panhandle WV, Frederick MD, Winchester VA, and Loudoun County. Premium materials. Real waterproofing systems. The veteran-led communication standards that make remodels feel less like construction and more like a managed project.",
        "We build with the long-term in mind: Schluter-Kerdi waterproofing systems, real tile setting (no cheap shortcuts), curbless and accessibility-aware shower designs, and the fit-and-finish you'd expect from a higher-end design-build firm. Most full bathroom remodels run 3–5 weeks with a clean job site, daily updates, and a named project lead from start to finish.",
      ],
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
      'Clean job site protocol: daily cleanup, dust containment, walked surfaces protected.',
      'Named project lead, 24-hour response standard, daily progress photos.',
    ],
    faqs: [
      {
        question: 'How long does a bathroom remodel take?',
        answer:
          'Most full bathroom remodels run 3–5 weeks from demo to final walk-through. Walk-in shower conversions in an otherwise intact bathroom can run 2–3 weeks. We give you a written timeline before we break ground and update you daily if anything shifts.',
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
    relatedGuideSlugs: [],
    icon: 'Bath',
    gallery: [
      { src: '/images/projects/bathrooms/shower-stone-accent.jpg', alt: 'Modern bathroom with stone accent wall and walk-in glass shower' },
      { src: '/images/projects/bathrooms/shower-black-frame.jpg', alt: 'Contemporary walk-in shower with black-frame glass enclosure and wood-look tile' },
      { src: '/images/projects/bathrooms/tub-shower-tile.jpg', alt: 'Tile tub-and-shower combination with frameless glass and travertine accents' },
    ],
  },

  kitchens: {
    slug: 'kitchens',
    title: 'Kitchen Remodeling',
    serviceType: 'Kitchen Remodeling',
    metaTitle: 'Kitchen Remodeling in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Custom kitchen remodels across the WV–MD–VA region — cabinetry, countertops, islands, and layout changes, built with veteran-led precision.',
    keywords: [
      'kitchen remodel',
      'kitchen renovation',
      'custom kitchen',
      'cabinet installation',
      'kitchen remodeling Frederick MD',
      'kitchen remodeling Winchester VA',
      'kitchen remodel Loudoun County',
    ],
    hero: {
      eyebrow: 'Premium Interior',
      heading: 'Kitchen Remodeling',
      sub: 'Custom cabinetry, islands, layout changes, and full kitchen transformations across the WV–MD–VA region. Premium kitchens built for the family that actually cooks in them.',
      image: {
        src: '/images/projects/kitchens/hero.jpg',
        alt: 'Editorial white kitchen with double islands, lantern pendant lighting, and dark hardwood floors',
      },
    },
    overview: {
      paragraphs: [
        "Real Elite Contracting builds custom kitchens for homeowners across Eastern Panhandle WV, Frederick MD, Winchester VA, Loudoun County, and the surrounding region. We handle every part of a kitchen remodel — design coordination, cabinetry, countertops, layout changes, plumbing and electrical, tile, lighting — under one accountable project lead.",
        "Most full kitchen remodels run 6–10 weeks depending on cabinetry lead time, layout complexity, and structural work. Daily updates, clean job site, named project lead, and a written workmanship warranty are standard. We don't take on more kitchens than we can deliver well — when we say yes to your project, you get our full attention.",
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
      'One project lead from design through final walk-through.',
      'We coordinate cabinetry lead times so demo lines up with delivery — no half-built kitchens sitting for weeks.',
      'Daily cleanup, dust containment, and protected walking paths through the rest of your home.',
    ],
    faqs: [
      {
        question: 'How long does a kitchen remodel take?',
        answer:
          'Most full kitchen remodels run 6–10 weeks from demo to final. Cabinetry lead time is usually the longest item — we plan around it so you only lose your kitchen during the demo-and-install window, not the full ordering period.',
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
    relatedGuideSlugs: [],
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
    hero: {
      eyebrow: 'New Living Space',
      heading: 'Basement Finishing',
      sub: 'Family rooms, in-law suites, home gyms, and basement bars across the WV–MD–VA region. The kind of basement build that adds usable square footage and resale value — done to code, done right.',
      image: {
        src: '/images/projects/basements/hero-framing.jpg',
        alt: 'Basement build in framing phase showing open floor joists, stud walls, and subfloor before finishes',
      },
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
    ],
    relatedGuideSlugs: [],
    icon: 'Home',
  },

  /* ---------------------------- EXISTING ---------------------------- */

  roofing: {
    slug: 'roofing',
    title: 'Roofing',
    serviceType: 'Roofing',
    metaTitle: 'Roofing in Eastern Panhandle, WV | Real Elite Contracting',
    metaDescription:
      'Expert roof replacement and repair with premium architectural shingles. Veteran-owned roofing contractor serving WV, MD, VA.',
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
      'Licensed and insured roofing specialists.',
      'Workmanship guarantees in writing on every install.',
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
          'We primarily install premium architectural shingles from GAF and Owens Corning, backed by manufacturer warranties — and our own workmanship warranty in writing.',
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
      image: { src: '/images/siding-windows.jpg', alt: 'Siding and window replacement in progress' },
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
      { src: '/images/siding-replacement.jpg', alt: 'Siding replacement in progress' },
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

  decks: {
    slug: 'decks',
    title: 'Decks & Outdoor Living',
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
    hero: {
      eyebrow: 'Outdoor',
      heading: 'Decks & Outdoor Living',
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
        'Custom railings, stairs, and built-in benches',
        'Pergolas and shade structures',
        'Outdoor lighting and electrical',
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
      { src: '/images/deck-multilevel-step-lights.jpg', alt: 'Multi-level wood deck with built-in bench, recessed step lights, and landscaped garden' },
      { src: '/images/deck-ipe-modern.jpg', alt: 'IPE hardwood deck wrapping a modern glass-walled home with white dining chairs' },
      { src: '/images/deck-lounge.jpg', alt: 'Deck with outdoor lounge furniture' },
      { src: '/images/deck-finished-railings.jpg', alt: 'Composite deck with white railings' },
      { src: '/images/deck-night-lights.jpg', alt: 'Finished deck with solar post lights at night' },
      { src: '/images/deck-pebble-detail.jpg', alt: 'Weathered wood deck corner with white pebble accent inlay and grass edge' },
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
          "Usually yes — decks above a certain height or square footage typically require a building permit in WV, MD, and VA. We handle the permitting and inspection coordination as part of the project.",
      },
      {
        question: 'How long does it take to build a deck?',
        answer:
          'Most standard deck builds complete in 1–2 weeks. Multi-level decks and outdoor living buildouts run 2–4 weeks. Weather and material lead times can shift the schedule — we update you daily.',
      },
    ],
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
    hero: {
      eyebrow: 'Premium Interior',
      heading: 'Whole-Home Remodeling',
      sub: 'Interior and exterior remodels — kitchens, bathrooms, basements, additions. Project-managed end-to-end with one accountable lead.',
      image: { src: '/images/flooring-dark-living.jpg', alt: 'Dark laminate flooring installed in remodeled living room' },
    },
    overview: {
      paragraphs: [
        "Your home should evolve with your family. Real Elite Contracting specializes in kitchen remodels, bathroom renovations, basement finishing, and complete interior updates that transform your living spaces while preserving the character of your home.",
        "We manage every aspect — from design consultation through final inspection — keeping projects on schedule, on budget, and on standard. One project lead, daily updates, clean job site.",
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
      'Home additions that seamlessly extend your existing home — engineered to last. Built across the WV–MD–VA region with veteran-led precision.',
    keywords: [
      'home additions',
      'house addition',
      'second story addition',
      'sunroom addition',
      'garage addition',
      'Eastern Panhandle',
    ],
    hero: {
      eyebrow: 'New Space',
      heading: 'Home Additions',
      sub: 'Additions that seamlessly extend your existing home — engineered to last, matched to your existing architecture, project-managed end-to-end.',
      image: { src: '/images/new-build-sunset.jpg', alt: 'New construction with house wrap at sunset' },
    },
    overview: {
      paragraphs: [
        "Sometimes the right answer isn't moving — it's adding. Real Elite Contracting designs and builds home additions that look like they were always part of the original structure. Roofline, siding, foundation, interior finish — matched so you can't tell where the original house ends and the new build begins.",
        "We handle structural engineering, permitting, foundation work, framing, roofing tie-in, exterior matching, and interior finish coordination. One project lead, transparent line-itemed pricing.",
      ],
      image: { src: '/images/framing-crew.jpg', alt: 'Interior framing crew working on a home addition' },
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
      { src: '/images/new-build-sunset.jpg', alt: 'Finished addition at sunset' },
    ],
    whyChooseUs: [
      'Matched architecture — additions that look original.',
      'Structural engineering and permitting handled in-house.',
      'Foundation, framing, roof tie-in, and finish coordinated under one project lead.',
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
      'Door and window repairs, drywall, trim work, deck fixes, and the smaller jobs that keep your home in great shape. Veteran-owned, across the WV–MD–VA region.',
    keywords: [
      'general repairs',
      'home repair',
      'drywall repair',
      'door repair',
      'window repair',
      'trim work',
      'Eastern Panhandle',
    ],
    hero: {
      eyebrow: 'Smaller Projects',
      heading: 'General Repairs & Maintenance',
      sub: 'Doors, drywall, trim, deck fixes, and the smaller jobs that keep your home in great shape — done to the same standard as our larger projects.',
    },
    overview: {
      paragraphs: [
        "Most of what keeps a home in great shape is the small stuff — a door that doesn't latch quite right, drywall damage in the hallway, a deck board that's started to lift. Real Elite Contracting handles general repairs and home maintenance with the same discipline we bring to remodels.",
        "Same project lead, same warranty, same clean job site. Just smaller scope.",
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
      "Veteran-led discipline on every project — even the small ones.",
      'Same workmanship warranty as our larger work.',
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
          'Yes — every repair gets our standard workmanship warranty in writing.',
      },
    ],
  },

  handyman: {
    slug: 'handyman',
    title: 'Handyman Services',
    serviceType: 'Handyman Services',
    metaTitle: 'Handyman Services in WV, MD & VA | Real Elite Contracting',
    metaDescription:
      'Drywall repair, door installation, pressure washing, gutter cleaning, fence repair, TV mounting, and dozens of other reliable home repairs. Veteran-owned.',
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
      'Clean job site. Workmanship guaranteed.',
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
