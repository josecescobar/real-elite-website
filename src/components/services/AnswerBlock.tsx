type Props = {
  /** The concise, citable answer. Keep it to 1–2 sentences. */
  text: string;
  /** Small label rendered above the answer. */
  eyebrow?: string;
};

/**
 * Answer Block — a concise, scannable summary placed at the top of a service
 * page (Website v2 Blueprint §4). Two jobs:
 *   1. GEO/AEO: it is the self-contained, lift-able answer that AI Overviews
 *      and assistants (ChatGPT, Perplexity) cite when asked "what does Real
 *      Elite do for X / is it for me."
 *   2. Scanning visitors get the gist in one read before committing to the
 *      longer narrative below.
 * Renders nothing when there's no answer, so a blanked content field is a
 * safe, code-free way to pull the block (see Sprint #002 rollback plan).
 */
export default function AnswerBlock({ text, eyebrow = 'In short' }: Props) {
  if (!text.trim()) return null;

  return (
    <section
      aria-label="Quick answer"
      className="bg-steel-50 rounded-lg border-l-4 border-brand-red px-6 py-5 md:px-7 md:py-6"
    >
      <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.18em] mb-2">
        {eyebrow}
      </p>
      <p className="text-charcoal-800 text-lg md:text-xl leading-relaxed font-medium">
        {text}
      </p>
    </section>
  );
}
