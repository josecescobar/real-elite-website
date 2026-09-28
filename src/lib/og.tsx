import { ImageResponse } from 'next/og';

/**
 * Shared Open Graph image renderer used by every opengraph-image.tsx
 * convention file across the app. Renders a branded 1200×630 PNG with
 * the ink/bronze Real Elite identity, generated at request time via
 * Satori (next/og).
 *
 * System fonts only — Satori does not have next/font access, and
 * shipping the Saira / Inter binaries through every OG request would
 * add cold-start latency. The visual identity comes from the ink
 * gradient + bronze accent + composition, which carries the brand
 * without needing custom fonts.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = 'image/png' as const;

type Args = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

const FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export function renderOgCard({ eyebrow, title, subtitle }: Args) {
  const titleSize = title.length > 60 ? 56 : title.length > 40 ? 68 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(135deg, #151a22 0%, #1f2530 100%)',
          padding: '72px 80px',
          fontFamily: FONT_STACK,
          color: 'white',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Bronze accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '10px',
            height: '100%',
            backgroundColor: '#8a6236',
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 22,
            color: '#d6b285',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            fontWeight: 700,
            display: 'flex',
          }}
        >
          {eyebrow ?? 'Real Elite Contracting'}
        </div>

        {/* Title + subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 28,
                color: '#d6d3cd',
                marginTop: 28,
                lineHeight: 1.4,
                maxWidth: 920,
                display: 'flex',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
            color: '#b3afa7',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex' }}>Real Elite Contracting</div>
          <div style={{ display: 'flex', color: '#d6b285' }}>
            Family-Run Design-Build · Loudoun County, VA
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
