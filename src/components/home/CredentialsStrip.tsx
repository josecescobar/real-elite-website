import Container from '@/components/shared/Container';

/**
 * The credentials row under the hero. Verifiable facts only: licence
 * classes and numbers, ownership, language, federal registration. No ratings,
 * no counts, no promises about how a job runs.
 */
const CREDENTIALS = [
  { label: 'Who runs it', value: 'Jose & Miguel' },
  { label: 'Virginia', value: 'Class A Home Improvement Contractor' },
  { label: 'West Virginia', value: 'Licensed · WV062432' },
  { label: 'Languages', value: 'English · Español' },
  { label: 'Federal', value: 'Registered in SAM.gov' },
] as const;

export default function CredentialsStrip() {
  return (
    <section className="bg-steel-50 border-b border-steel-200" aria-label="Credentials">
      <Container size="wide" className="py-7 md:py-8">
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-6">
          {CREDENTIALS.map((c) => (
            <div key={c.label} className="min-w-0">
              <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                {c.label}
              </dt>
              <dd className="font-heading text-lg text-navy-900 mt-1 leading-snug">
                {c.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
