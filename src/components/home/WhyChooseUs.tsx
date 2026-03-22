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
    <section className="w-full bg-white py-16 sm:py-24 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <h2 className="text-3xl md:text-4xl font-black text-[#1a2744] mb-12">
          Why Choose Real Elite
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div key={index}>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#c0392b]/10 mb-4">
                  <Icon className="w-5 h-5 text-[#c0392b]" />
                </div>
                <h3 className="text-base font-bold text-[#1a2744] mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
