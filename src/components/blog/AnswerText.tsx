import type { ReactNode } from 'react';

/**
 * The answer block is a single frontmatter string. GuideTemplate used to
 * render it as plain text, so a markdown citation never became a link.
 * This turns `[label](url)` into an anchor and leaves every other answer
 * unchanged. Only http(s) and site-relative hrefs are linked.
 */
const MARKDOWN_LINK = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g;

export default function AnswerText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(MARKDOWN_LINK)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const href = match[2];
    const external = href.startsWith('http');
    nodes.push(
      <a
        key={key}
        href={href}
        className="text-brand-red underline decoration-brand-red/40 underline-offset-2 hover:decoration-brand-red"
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {match[1]}
      </a>
    );
    key += 1;
    last = index + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
