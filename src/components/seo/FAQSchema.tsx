import JsonLd from './JsonLd';

type Props = {
  items: { question: string; answer: string }[];
};

export default function FAQSchema({ items }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
  return <JsonLd schema={schema} />;
}
