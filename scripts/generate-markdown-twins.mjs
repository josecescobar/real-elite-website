import { register } from 'node:module';

await register(new URL('./ts-alias-hook.mjs', import.meta.url).href);

const { writeMarkdownTwins } = await import('../src/lib/markdown-twins.ts');
const written = writeMarkdownTwins();
console.log(`wrote ${written.length} AI text files`);
for (const file of written) console.log(`  ${file}`);
