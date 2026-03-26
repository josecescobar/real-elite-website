// Run: node scripts/generate-og.mjs
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a2744"/>
      <stop offset="100%" stop-color="#0f1a30"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Border accents -->
  <rect width="1200" height="7" fill="#c0392b"/>
  <rect y="623" width="1200" height="7" fill="#c0392b"/>
  <rect width="7" height="630" fill="#c0392b"/>
  <rect x="1193" width="7" height="630" fill="#c0392b"/>

  <!-- Inner glow / subtle pattern -->
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.06" rx="4"/>

  <!-- Stars row -->
  <text x="600" y="175" font-family="Arial, sans-serif" font-size="36" fill="#c0392b" text-anchor="middle" opacity="0.7">&#9733; &#9733; &#9733; &#9733; &#9733;</text>

  <!-- Company name -->
  <text x="600" y="295" font-family="Arial Black, Impact, sans-serif" font-size="82" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-1">Real Elite Contracting</text>

  <!-- Red divider -->
  <rect x="260" y="318" width="680" height="4" fill="#c0392b" rx="2"/>

  <!-- Tagline -->
  <text x="600" y="378" font-family="Arial, Helvetica, sans-serif" font-size="33" fill="#e2e8f0" text-anchor="middle">Eastern Panhandle&apos;s Most Trusted Contractor</text>

  <!-- Services list -->
  <text x="600" y="438" font-family="Arial, Helvetica, sans-serif" font-size="21" fill="#94a3b8" text-anchor="middle">Roofing  ·  Decks  ·  Siding  ·  Remodeling  ·  Additions</text>

  <!-- Badge line -->
  <text x="600" y="508" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#64748b" text-anchor="middle">Veteran-Owned  ·  Licensed &amp; Insured  ·  Martinsburg, WV</text>

  <!-- URL -->
  <text x="600" y="567" font-family="Arial, Helvetica, sans-serif" font-size="19" fill="#c0392b" text-anchor="middle">realelitecontracting.com</text>
</svg>`;

const outputPath = path.join(__dirname, '../public/images/og-image.jpg');

await sharp(Buffer.from(svg))
  .jpeg({ quality: 92 })
  .toFile(outputPath);

console.log('✓ OG image generated:', outputPath);
