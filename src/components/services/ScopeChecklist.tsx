import { Check } from 'lucide-react';

export default function ScopeChecklist({
  title = "What's in scope",
  items,
}: {
  title?: string;
  items: readonly string[] | string[];
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy-800 mb-6">
        {title}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-charcoal-700">
            <Check
              className="w-5 h-5 text-brand-red mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
