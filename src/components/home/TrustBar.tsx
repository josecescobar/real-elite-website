export const TrustBar = () => {
  const stats = [
    { number: '40+', label: 'Years of Experience' },
    { number: '200+', label: 'Projects Completed' },
    { number: '5.0★', label: 'Google Rating' },
    { number: 'Veteran', label: 'Owned & Operated' },
    { number: 'Licensed', label: '& Fully Insured' },
  ];

  return (
    <section className="bg-navy-800">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-3xl md:text-4xl font-extrabold text-brand-red tracking-tight">
              {stat.number}
            </div>
            <div className="text-charcoal-300 text-xs sm:text-sm mt-1 tracking-wide">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
