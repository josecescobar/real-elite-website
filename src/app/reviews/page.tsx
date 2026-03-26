import type { Metadata } from 'next';
import { BUSINESS, TESTIMONIALS } from '@/lib/constants';
import Button from '@/components/shared/Button';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: `Customer Reviews | ${BUSINESS.name}`,
  description:
    'Read verified reviews from satisfied customers throughout the Eastern Panhandle. See why Real Elite Contracting is the trusted choice.',
  keywords: [
    'customer reviews',
    'testimonials',
    'contractor reviews',
    'rated contractor',
    'customer satisfaction',
    'Google reviews',
  ],
  alternates: {
    canonical: `${BUSINESS.url}/reviews`,
  },
  openGraph: {
    title: `Customer Reviews | ${BUSINESS.name}`,
    description:
      'Read reviews from satisfied customers who have worked with Real Elite Contracting.',
    url: `${BUSINESS.url}/reviews`,
    type: 'website',
  },
};

export default function ReviewsPage() {
  const averageRating =
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length;

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Customer Reviews</h1>
          <p className="text-lg text-white max-w-2xl">
            See what our satisfied customers have to say about their experience with Real Elite
            Contracting
          </p>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              {averageRating.toFixed(1)} Average Rating
            </h2>
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 fill-gold-500 text-gold-500"
                />
              ))}
            </div>
            <p className="text-lg text-gray-700">
              Based on {TESTIMONIALS.length} verified customer reviews
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-gold-500 text-gold-500"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="border-t border-navy-100 pt-4">
                  <p className="font-bold text-navy-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a Review CTA */}
      <section className="py-14 md:py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-[#c0392b]/10 text-[#c0392b] font-semibold text-sm px-4 py-2 rounded-full mb-5">
            <Star className="w-4 h-4 fill-[#c0392b]" />
            Share Your Experience
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-navy-900 mb-4">
            Leave Us a Review on Google
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Had a great experience with Real Elite Contracting? Your review helps other homeowners
            find a contractor they can trust.
          </p>
          <a
            href={BUSINESS.social.google}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white font-bold text-lg px-10 py-4 rounded-lg transition-colors shadow-lg"
          >
            Leave Us a Review
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Satisfied Customers
          </h2>
          <p className="text-lg text-gold-300 mb-8 max-w-2xl mx-auto">
            Experience the quality and professionalism that earned us these glowing reviews. Contact
            us today to start your project.
          </p>
          <Button href="https://calendly.com/realelitecontracting-info/free-estimate-call" variant="primary" size="lg" className="mr-4">
            Book Free Estimate
          </Button>
          <Button
            href={BUSINESS.social.google}
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-navy-900"
          >
            Leave a Review
          </Button>
        </div>
      </section>
    </>
  );
}
