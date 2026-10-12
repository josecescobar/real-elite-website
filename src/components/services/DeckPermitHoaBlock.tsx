import Link from 'next/link';
import Container from '@/components/shared/Container';
import {
  deckPermitHoaBlocks,
  deckPermitHoaForCity,
  type DeckPermitHoaBlock as DeckPermitHoaCopy,
} from '@/lib/deck-permit-hoa';

function Steps({ block }: { block: DeckPermitHoaCopy }) {
  return (
    <ul className="mt-3 space-y-2 text-charcoal-700 leading-relaxed">
      <li>{block.hoaText}</li>
      <li>
        <Link
          href={block.guideHref}
          className="font-semibold text-navy-800 underline decoration-charcoal-300 hover:text-brand-red"
        >
          {block.county} permit guide
        </Link>
      </li>
      {block.platText ? <li>{block.platText}</li> : null}
      {block.footingText ? <li>{block.footingText}</li> : null}
    </ul>
  );
}

/**
 * Deck service pages only. Pass a city slug on a service × town page.
 * Omit it on the decks service page, which lists every county that has a guide.
 */
export default function DeckPermitHoaBlock({ citySlug }: { citySlug?: string }) {
  const blocks = citySlug ? [deckPermitHoaForCity(citySlug)].filter((block) => block !== null) : deckPermitHoaBlocks();
  if (blocks.length === 0) return null;

  return (
    <section className="bg-white py-16 md:py-24" aria-labelledby="deck-permit-hoa">
      <Container size="wide">
        <h2
          id="deck-permit-hoa"
          className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800"
        >
          Deck permit + HOA steps
        </h2>
        <div className="mt-8 space-y-8 max-w-3xl">
          {blocks.map((block) => (
            <div key={block.guideSlug}>
              {blocks.length > 1 ? (
                <h3 className="font-heading text-xl font-bold text-navy-800">{block.county}</h3>
              ) : null}
              <Steps block={block} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
