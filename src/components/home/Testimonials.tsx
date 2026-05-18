import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';

export const Testimonials = () => {
  return (
    <section className="w-full bg-white py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
            Reviews
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2744]">
            What Our Clients Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="bg-gray-50 rounded-2xl p-6 flex flex-col"
            >
              <div
                className="flex gap-0.5 mb-4"
                aria-label={`Rated ${testimonial.rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 leading-relaxed flex-grow text-sm">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              <figcaption className="mt-6 pt-4 border-t border-gray-200">
                <p className="font-bold text-[#1a2744] text-sm">{testimonial.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{testimonial.location}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
