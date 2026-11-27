// Fabrique l'image d'aperçu des réseaux sociaux (Open Graph) : public/og.png, 1200 × 630.
// À relancer seulement si le nom ou le titre change : `npm run og`.
// Les textes viennent de src/data/profil.ts (relus ici sans TypeScript, par simple recherche).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const racine = new URL('..', import.meta.url);
const sourceProfil = readFileSync(new URL('src/data/profil.ts', racine), 'utf8');
const lire = (cle) => {
  const trouve = sourceProfil.match(new RegExp(`\\n  ${cle}: '([^']+)'`));
  if (!trouve) throw new Error(`« ${cle} » introuvable dans src/data/profil.ts`);
  return trouve[1];
};
const echapper = (texte) => texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const nom = echapper(lire('nom'));
const titre = echapper(lire('titre'));
const initiales = echapper(lire('initiales'));

const L = 1200;
const H = 630;
const lignes = [];
for (let x = 0; x <= L; x += 40) lignes.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" />`);
for (let y = 0; y <= H; y += 40) lignes.push(`<line x1="0" y1="${y}" x2="${L}" y2="${y}" />`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">
  <defs>
    <radialGradient id="halo" cx="78%" cy="35%" r="60%">
      <stop offset="0" stop-color="#3df5a0" stop-opacity="0.22" />
      <stop offset="1" stop-color="#3df5a0" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="${L}" height="${H}" fill="#0d1117" />
  <g stroke="#1c242e" stroke-width="1">${lignes.join('')}</g>
  <rect width="${L}" height="${H}" fill="url(#halo)" />
  <rect x="80" y="80" width="120" height="120" rx="20" fill="#151b23" stroke="#3df5a0" stroke-width="3" />
  <text x="140" y="160" text-anchor="middle" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="56" font-weight="700" fill="#3df5a0">${initiales}</text>
  <text x="80" y="300" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="30" fill="#9aa7b4"><tspan fill="#3df5a0" font-weight="700">&gt;_</tspan> le labo de Shahin</text>
  <text x="80" y="400" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif" font-size="88" font-weight="700" fill="#e6edf3">${nom}</text>
  <text x="80" y="470" font-family="'Segoe UI', 'DejaVu Sans', Arial, sans-serif" font-size="44" font-weight="600" fill="#3df5a0">${titre}</text>
  <text x="80" y="560" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="26" fill="#9aa7b4">shahinshakuri.github.io</text>
</svg>`;

const sortie = fileURLToPath(new URL('public/og.png', racine));
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(sortie);
console.log(`Image d'aperçu écrite : ${sortie}`);
