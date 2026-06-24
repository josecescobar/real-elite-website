import { ImageResponse } from 'next/og';

/**
 * Generated app icon — a navy tile with a brand-red corner accent and
 * the "RE" monogram. Used as the maskable PWA icon and a crisp
 * high-res favicon. The legacy favicon.ico + apple-icon.png remain
 * for browsers/platforms that prefer those.
 */
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a2744',
          position: 'relative',
        }}
      >
        {/* Brand-red corner accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '160px',
            height: '160px',
            backgroundColor: '#c0392b',
            display: 'flex',
            // diagonal cut
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          }}
        />
        <div
          style={{
            fontSize: 248,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-12px',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
            display: 'flex',
          }}
        >
          RE
        </div>
      </div>
    ),
    size
  );
}
