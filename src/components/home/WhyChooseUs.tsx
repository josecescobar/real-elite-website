import { Award, DollarSign, Clock, MapPin } from 'lucide-react';

export const WhyChooseUs = () => {
  const reasons = [
    {
      icon: Award,
      title: 'Quality Craftsmanship',
      description:
        'Premium materials and expert techniques on every project — built to last.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description:
        'Detailed estimates upfront. No hidden fees, no surprise charges.',
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description:
        'We respect your time and consistently finish on schedule.',
    },
    {
      icon: MapPin,
      title: 'Local Reputation',
      description:
        'Trusted by Eastern Panhandle families and built on consistent excellence.',
    },
  ];

  return (
    <section className="w-full bg-[#1a2744] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[#c0392b] font-semibold text-sm uppercase tracking-widest mb-3">
            Why Real Elite
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Built on standards you can count on.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div key={reason.title} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#c0392b]/15 mb-4">
                  <Icon className="w-5 h-5 text-[#c0392b]" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
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
