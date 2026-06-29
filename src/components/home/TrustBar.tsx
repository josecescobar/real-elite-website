import Container from '@/components/shared/Container';
import { ratingLabel } from '@/lib/social-proof';

export const TrustBar = () => {
  // The Google tile shows real rating + review count once they're verified in
  // SOCIAL_PROOF; until then it falls back to the existing copy, so the bar
  // renders identically to production.
  const rating = ratingLabel() ?? { number: 'Top-Rated', label: 'on Google' };

  const stats = [
    { number: '40+', label: 'Years of Experience' },
    { number: 'Written', label: 'Workmanship Warranty' },
    { number: rating.number, label: rating.label },
    { number: 'Veteran', label: 'Owned & Operated' },
    { number: '60-Sec', label: 'AI Roof Quote' },
  ];

  return (
    <section className="bg-white border-b border-charcoal-100">
      <Container size="wide" className="py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 divide-x divide-charcoal-100">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`text-center ${idx === 0 ? 'pl-0' : 'pl-6'}`}
            >
              <div className="font-heading text-3xl sm:text-4xl font-extrabold text-navy-800 tracking-tight leading-none">
                {stat.number}
              </div>
              <div className="text-charcoal-500 text-[0.65rem] sm:text-xs mt-2 tracking-[0.15em] uppercase font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TrustBar;
