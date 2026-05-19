import { Award, DollarSign, Clock, MapPin } from 'lucide-react';

export const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: 'Quality Craftsmanship',
      description:
        'Premium materials and expert techniques ensure every project exceeds expectations and stands the test of time.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description:
        'No hidden fees or surprise charges. Detailed estimates upfront so you know exactly what to expect.',
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description:
        'We respect your time and consistently finish projects on schedule without compromising quality.',
    },
    {
      icon: MapPin,
      title: 'Local Reputation',
      description:
        'Trusted by Eastern Panhandle families for years. Our reputation is built on consistent excellence.',
    },
  ];

  return (
    <section className="w-full bg-white py-16 sm:py-24 border-t border-charcoal-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-navy-800 mb-12">
          Why Choose Real Elite
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-red/10 mb-4">
                  <Icon className="w-5 h-5 text-brand-red" />
                </div>
                <h3 className="text-base font-bold text-navy-800 mb-2">{reason.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{reason.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
