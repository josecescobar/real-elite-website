export const TrustBar = () => {
  const stats = [
    { number: '40+', label: 'Years of Combined Experience' },
    { number: '5.0★', label: 'Google Rating' },
    { number: 'Veteran', label: 'Owned & Operated' },
    { number: 'Licensed', label: '& Fully Insured' },
  ];

  return (
    <section className="bg-[#1a2744]">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-black text-[#c0392b]">{stat.number}</div>
            <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBar;
