// Inline src/* into a single, offline-capable index.html.
import { readFileSync, writeFileSync } from 'node:fs';
const r = (f) => readFileSync(new URL(f, import.meta.url));
const font = r('./src/atkinson-next.woff2').toString('base64');
let html = r('./src/template.html').toString();
const parts = { '/*FONT*/': font, '/*CSS*/': r('./src/style.css').toString(), '/*DATA*/': r('./src/data.js').toString(), '/*APP*/': r('./src/app.js').toString() };
for (const [k, v] of Object.entries(parts)) {
  if (!html.includes(k)) throw new Error('missing placeholder ' + k);
  html = html.replace(k, () => v.replace(/<\/script/gi, '<\\/script'));
}
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log(`index.html: ${(html.length / 1024).toFixed(1)} KB`);
