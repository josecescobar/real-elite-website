import { Star } from 'lucide-react';

export const TrustBar = () => {
  const stats = [
    { number: '40+', label: 'Years of Combined Experience' },
    { number: '5.0', label: 'Google Rating', isRating: true },
    { number: 'Veteran', label: 'Owned & Operated' },
    { number: 'Licensed', label: '& Fully Insured' },
  ];

  return (
    <section className="bg-[#1a2744] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-3xl font-black text-white">{stat.number}</span>
              {stat.isRating && (
                <Star
                  className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  strokeWidth={0}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="text-gray-400 text-xs sm:text-sm mt-1.5 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
