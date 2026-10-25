import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import JsonLd from './JsonLd';

describe('JsonLd', () => {
  it('escapes less-than characters so schema values cannot close the script element', () => {
    const { container } = render(
      <JsonLd schema={{ name: '</script><script>alert("xss")</script>' }} />
    );
    const script = container.querySelector('script[type="application/ld+json"]');

    expect(script?.innerHTML).toContain('\\u003c/script>');
    expect(script?.innerHTML).not.toContain('</script>');
  });
});
