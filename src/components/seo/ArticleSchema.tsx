import JsonLd from './JsonLd';
import { BUSINESS } from '@/lib/constants';

type Props = {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  author?: string;
};

export default function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  url,
  author = 'Real Elite Contracting',
}: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image.startsWith('http') ? image : `${BUSINESS.url}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: `${BUSINESS.url}/`,
    },
    publisher: {
      '@type': 'GeneralContractor',
      name: BUSINESS.name,
      url: `${BUSINESS.url}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${BUSINESS.url}/images/logo.png`,
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return <JsonLd schema={schema} />;
}
