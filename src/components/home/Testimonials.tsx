import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';

export const Testimonials = () => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 text-gold-500 fill-gold-500"
            strokeWidth={0}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-charcoal-50 py-16 sm:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-navy-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Real feedback from real customers in the Eastern Panhandle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col"
            >
              <div className="mb-4">{renderStars(testimonial.rating)}</div>

              <p className="text-charcoal-700 italic leading-relaxed mb-6 flex-grow">
                &quot;{testimonial.text}&quot;
              </p>

              <div>
                <p className="font-bold text-navy-900">{testimonial.name}</p>
                <p className="text-charcoal-500 text-sm">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
