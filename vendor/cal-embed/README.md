# Cal.diy embed (MIT)

Built from private fork pin `54343aa685ae8f33159d2f485ec4a57bad5c574a`.

Source: `packages/embeds/embed-react` 1.5.3 and `packages/embeds/embed-snippet` 1.3.3 in https://github.com/calcom/cal.diy (MIT). The published npm package `@calcom/embed-react` is the Cal.com commercial build, so this site vendors the MIT bundle instead.

`Cal.es.mjs` is generated from that pin, then adapted so `EmbedSnippet` and `getCalApi` require an explicit `embedJsUrl`. There is no default script URL. The MIT `LICENSE` file is unchanged. Do not replace this file with an unadapted regenerate.
