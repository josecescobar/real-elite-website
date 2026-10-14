import Link from 'next/link';
import Container from '@/components/shared/Container';
import {
  fairfaxBasementSheetNote,
  townDeckHoa,
  type BasementSheetNote,
} from '@/lib/luxury-town-round16';

export function TownDeckHoaBlock({ citySlug }: { citySlug: string }) {
  const block = townDeckHoa(citySlug);
  if (!block) return null;

  return (
    <section className="mt-10" aria-labelledby={`deck-hoa-${block.citySlug}`}>
      <h2
        id={`deck-hoa-${block.citySlug}`}
        className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800"
      >
        Deck permit and HOA
      </h2>
      <ol className="mt-4 space-y-3 text-charcoal-700 leading-relaxed list-decimal pl-5">
        <li>{block.permitStep}</li>
        <li>{block.hoaStep}</li>
      </ol>
      <p className="mt-4">
        <Link
          href={block.guideHref}
          className="font-semibold text-navy-800 underline decoration-charcoal-300 hover:text-brand-red"
        >
          {block.guideLabel}
        </Link>
      </p>
    </section>
  );
}

function SheetNote({ note }: { note: BasementSheetNote }) {
  return (
    <aside className="mt-8 bg-steel-50 rounded-lg border-l-4 border-brand-red p-6">
      <h2 className="font-heading text-xl font-bold text-navy-800 mb-2">{note.heading}</h2>
      <p className="text-charcoal-700 leading-relaxed">{note.body}</p>
      <a
        href={note.href}
        className="inline-flex mt-4 text-sm font-semibold text-brand-red hover:text-brand-red-dark"
        target="_blank"
        rel="noopener noreferrer"
      >
        {note.linkLabel}
      </a>
    </aside>
  );
}

export function FairfaxBasementDetailsNote({
  citySlug,
  surface,
  framed = false,
}: {
  citySlug: string;
  surface: 'town' | 'service';
  framed?: boolean;
}) {
  const note = fairfaxBasementSheetNote(citySlug, surface);
  if (!note) return null;
  const sheet = <SheetNote note={note} />;
  if (!framed) return sheet;
  return (
    <section className="bg-white py-16 md:py-24">
      <Container size="wide">{sheet}</Container>
    </section>
  );
}
