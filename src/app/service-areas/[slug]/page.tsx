import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BUSINESS,
  PRIMARY_SERVICE_AREAS,
  SECONDARY_SERVICE_AREAS,
  SERVICES,
} from '@/lib/constants';
import Button from '@/components/shared/Button';
import EstimateForm from '@/components/shared/EstimateForm';
import { MapPin, Check, Phone, ArrowRight } from 'lucide-react';

// City-specific data lookup
const CITY_DATA: Record<
  string,
  {
    description: string;
    neighborhoods: string[];
  }
> = {
  'martinsburg-wv': {
    description:
      'Martinsburg is the county seat of Berkeley County and the largest city in the Eastern Panhandle. Located along the I-81 corridor, it serves as the regional hub for commerce, services, and community life. As the heart of the Eastern Panhandle, Martinsburg is home to many families and businesses that trust Real Elite Contracting for their home improvement needs. We have deep roots here and understand the local architectural styles and building challenges unique to this area.',
    neighborhoods: ['South Martinsburg', 'North End', 'Pikeside'],
  },
  'inwood-wv': {
    description:
      'Inwood is an unincorporated community in Berkeley County that has been experiencing steady residential growth. Located near I-81 and just minutes from Martinsburg, Inwood offers a blend of rural charm and convenient access to regional amenities. Many homeowners in this growing area choose Real Elite Contracting for our reliable service and quality craftsmanship that matches the community\'s family-oriented values.',
    neighborhoods: ['Route 51 Corridor', 'Ridge Road Area', 'Highway 9 Community'],
  },
  'charles-town-wv': {
    description:
      'Charles Town is the county seat of Jefferson County and boasts a rich historical downtown character. Home to the famous Charlestown Races and surrounded by beautiful orchards and rolling landscapes, Charles Town attracts residents who value both history and progress. Real Elite Contracting is proud to serve this community, helping preserve the character of historic homes while modernizing living spaces with quality improvements and repairs.',
    neighborhoods: ['Historic Downtown', 'Ranson Border', 'Jefferson Orchards Area'],
  },
  'ranson-wv': {
    description:
      'Ranson is rapidly transforming from a small community into a dynamic residential destination with new developments and growing infrastructure. Adjacent to Charles Town, Ranson appeals to families and young professionals seeking newer homes and neighborhoods. Real Elite Contracting serves the many construction and remodeling needs of Ranson\'s expanding population, from finishing new construction to updating established homes.',
    neighborhoods: ['Old Town Ranson', 'Flowing Springs Development', 'Harpers Ferry Road Area'],
  },
  'hedgesville-wv': {
    description:
      'Hedgesville is a rural community in Berkeley County known for its family-oriented atmosphere and peaceful surroundings. Located in the scenic Hedgesville Pike area, residents here often own larger properties with unique exterior maintenance challenges. Real Elite Contracting understands the specific needs of rural homeowners and delivers quality service to this tight-knit community.',
    neighborhoods: ['Hedgesville Pike Area', 'Route 9 Community', 'Mill Creek District'],
  },
  'spring-mills-wv': {
    description:
      'Spring Mills is a census-designated place in Berkeley County and one of the fastest-growing suburbs of Martinsburg. As families and professionals relocate to this area seeking newer housing developments and suburban convenience, Spring Mills has become a vibrant community. Real Elite Contracting is actively serving the many homeowners here who are building and improving their dream properties.',
    neighborhoods: ['Sunridge Development', 'Spring Ridge Area', 'Route 11 Corridor'],
  },
  'falling-waters-wv': {
    description:
      'Falling Waters is a scenic rural community nestled along the Potomac River in Berkeley County. The scenic river location and natural beauty make this an attractive area for homeowners seeking a quieter lifestyle with outdoor access. Real Elite Contracting serves the unique exterior maintenance and improvement needs of riverside properties in this picturesque community.',
    neighborhoods: ['Potomac Riverside', 'Route 9 Corridor', 'Woods Edge Area'],
  },
  'berkeley-springs-wv': {
    description:
      'Berkeley Springs is the county seat of Morgan County and famous for its warm mineral springs and vibrant tourism industry. The charming historic downtown and resort atmosphere attract both permanent residents and visitors from across the region. Real Elite Contracting serves homeowners and business owners in Berkeley Springs who want to maintain and improve their properties while preserving the historic character of this unique community.',
    neighborhoods: ['Historic Downtown', 'Warm Springs Area', 'Market Street District'],
  },
  'shepherdstown-wv': {
    description:
      'Shepherdstown is the oldest town in West Virginia and home to Shepherd University, giving it a unique blend of historic charm and youthful vitality. The picturesque downtown and well-maintained neighborhoods attract professionals, academics, and families who value quality living. Real Elite Contracting is proud to serve this distinguished community, working on historic homes and modern residences alike with the same commitment to excellence.',
    neighborhoods: ['Historic Downtown', 'University Area', 'Potomac Riverfront'],
  },
};

type CitySlug = keyof typeof CITY_DATA;

export function generateStaticParams() {
  const allCities = [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS];
  return allCities.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const allCities = [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS];
  const city = allCities.find((c) => c.slug === params.slug);

  if (!city) {
    return {
      title: 'Not Found',
    };
  }

  const title = `${city.city}, ${city.state} Roofing, Siding & Deck Contractor | ${BUSINESS.name}`;
  const description = `Professional roofing, siding, decks, remodeling, and exterior repairs in ${city.city}, ${city.state}. Free estimates from Real Elite Contracting.`;

  return {
    title,
    description,
    keywords: [
      `${city.city} contractor`,
      `${city.city} roofing`,
      `${city.city} siding`,
      `${city.city} decks`,
      `${city.city} remodeling`,
      `${city.city} exterior repair`,
      `${city.state} contractor`,
      'home improvement',
      'contractor near me',
    ],
    openGraph: {
      title,
      description,
      url: `${BUSINESS.url}/service-areas/${params.slug}`,
      type: 'website',
    },
  };
}

export default function CityServicePage({ params }: { params: { slug: string } }) {
  const allCities = [...PRIMARY_SERVICE_AREAS, ...SECONDARY_SERVICE_AREAS];
  const city = allCities.find((c) => c.slug === params.slug);
  const cityData = CITY_DATA[params.slug as CitySlug];

  if (!city || !cityData) {
    notFound();
  }

  const isPrimary = PRIMARY_SERVICE_AREAS.some((a) => a.slug === params.slug);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4 mb-4">
            <MapPin className="w-8 h-8 text-gold-400 flex-shrink-0" />
            <div>
              <p className="text-gold-300 text-lg font-semibold mb-2">Service Area</p>
              <h1 className="text-4xl md:text-5xl font-bold">
                {city.city}, {city.state}
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-300 mt-4">
            Your Trusted Local Contractor
          </p>
          {isPrimary && (
            <div className="mt-4 inline-block bg-gold-500 text-navy-900 px-3 py-1 rounded-full text-sm font-bold">
              Primary Service Area
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-8 text-center">
            About {city.city}
          </h2>

          <div className="space-y-6 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              {cityData.description}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Real Elite Contracting has served the {city.city} area for years, building relationships
              with homeowners and understanding their unique needs. Whether you need a complete roof
              replacement, new siding, a custom deck, a full remodel, a home addition, or exterior
              repairs, we bring the same professional standards and attention to detail to every project.
              Our team knows {city.city} and is committed to delivering exceptional results that enhance
              your home and increase its value.
            </p>
          </div>

          <div className="bg-navy-50 p-8 rounded-lg border border-navy-200">
            <h3 className="text-xl font-bold text-navy-900 mb-4">
              Local Communities &amp; Areas We Serve
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {cityData.neighborhoods.map((neighborhood, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <span className="text-gray-700">{neighborhood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Available Section */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            Services Available in {city.city}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-b-4 border-gold-500 h-full cursor-pointer group">
                  <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-gold-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center text-gold-600 font-semibold group-hover:text-gold-700 transition-colors text-sm">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-12 text-center">
            Why {city.city} Residents Choose Real Elite Contracting
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Local Expertise
              </h3>
              <p className="text-gray-700">
                We know {city.city} and its unique architectural styles, climate challenges, and local
                building codes. Our experience in this area means better solutions for your home.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Quality Craftsmanship
              </h3>
              <p className="text-gray-700">
                Every project receives our full attention and commitment to excellence. We use premium
                materials and proven techniques to ensure your improvements last for years.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gold-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Trusted by Your Neighbors
              </h3>
              <p className="text-gray-700">
                Real Elite Contracting has built a reputation for reliability, professionalism, and
                customer satisfaction in {city.city}. Ask your neighbors—they trust us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estimate CTA Section */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready for Your Home Improvement?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Get a free, no-obligation estimate for your roofing, siding, deck, remodeling, addition,
                or exterior repair project in {city.city}. Our team will assess your needs and provide a
                detailed quote.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-gold-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Call us today</p>
                    <a
                      href={`tel:${BUSINESS.phoneRaw}`}
                      className="text-xl font-bold text-gold-400 hover:text-gold-300"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-navy-700">
                  <p className="text-sm text-gray-400 mb-2">Or fill out the form and we'll contact you</p>
                </div>
              </div>
            </div>

            <div>
              <EstimateForm />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-6">
            Not sure where to start? Browse all our services or visit our main service areas page.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button variant="outline">View All Services</Button>
            </Link>
            <Link href="/service-areas">
              <Button variant="outline">View All Service Areas</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
