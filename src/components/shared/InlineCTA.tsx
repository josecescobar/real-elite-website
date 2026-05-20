import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type InlineCTAProps = {
  href: string;
  children: React.ReactNode;
  tone?: 'dark' | 'light';
};

export default function InlineCTA({ href, children, tone = 'dark' }: InlineCTAProps) {
  const text = tone === 'light' ? 'text-white hover:text-brand-red' : 'text-navy-800 hover:text-brand-red';
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 font-semibold text-sm uppercase tracking-[0.12em] ${text} transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy-400 rounded-sm`}
    >
      <span>{children}</span>
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
