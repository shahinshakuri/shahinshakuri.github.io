// Audit Lighthouse du site construit (dist/), page par page.
// Lancement : `npm run build` puis `npm run lighthouse` (ajouter `-- --ludique` pour le mode ludique).
//
// Mode sobre (par défaut) : Chrome reçoit `--force-prefers-reduced-motion`, ce qui active
// le mode sobre du site, comme pour un visiteur qui demande moins d'animations.
// Objectif du brief : au moins 90 dans chaque catégorie en mode sobre. Sinon le script échoue.
//
// Le navigateur est le Chromium de Playwright (`npx playwright install chromium`), lancé sans fenêtre.
// Rapports HTML détaillés : dossier rapports-lighthouse/ (non versionné).
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import configOrdi from 'lighthouse/core/config/desktop-config.js';

const PORT = 4323;
const BASE = `http://localhost:${PORT}`;
const PAGES = ['/', '/projets/fransi/', '/jeux/sokoban/', '/404.html'];
// La 404 est analysée par son fichier : Lighthouse refuse une page qui répond « 404 »,
// alors que le contenu est identique.
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const NOMS = { performance: 'Performance', accessibility: 'Accessibilité', 'best-practices': 'Bonnes pratiques', seo: 'SEO' };
const SEUIL = 90;

const ludique = process.argv.includes('--ludique');
const mobile = process.argv.includes('--mobile');

/** Démarre `astro preview` et attend qu'il réponde. */
async function demarrerServeur() {
  spawn(`npx astro preview --port ${PORT}`, { shell: true, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(BASE);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  arreter();
  throw new Error(`Le serveur d'aperçu ne répond pas sur ${BASE}. As-tu lancé « npm run build » ?`);
}

function arreter() {
  // Astro ne permet qu'un seul serveur d'aperçu par projet : il faut bien l'arrêter,
  // sinon `npm run test:e2e` ne peut plus démarrer le sien.
  spawnSync('npx astro preview stop', { shell: true, stdio: 'ignore' });
}

await demarrerServeur();
const PORT_DEBUG = 9333;
const navigateur = await chromium.launch({
  args: [`--remote-debugging-port=${PORT_DEBUG}`, ...(ludique ? [] : ['--force-prefers-reduced-motion'])],
});

let echec = false;
try {
  await mkdir('rapports-lighthouse', { recursive: true });
  console.log(`Lighthouse · mode ${ludique ? 'ludique' : 'sobre'} · ${mobile ? 'mobile' : 'ordinateur'}\n`);
  for (const chemin of PAGES) {
    const resultat = await lighthouse(
      BASE + chemin,
      { port: PORT_DEBUG, output: 'html', onlyCategories: CATEGORIES, logLevel: 'error' },
      mobile ? undefined : configOrdi,
    );
    const notes = CATEGORIES.map((c) => {
      const note = Math.round((resultat.lhr.categories[c].score ?? 0) * 100);
      if (!ludique && note < SEUIL) echec = true;
      return `${NOMS[c]} ${note}`;
    });
    console.log(`${chemin.padEnd(26)} ${notes.join(' · ')}`);
    const fichier = `rapports-lighthouse/${ludique ? 'ludique' : 'sobre'}-${mobile ? 'mobile' : 'ordi'}${chemin.replaceAll('/', '_') || '_'}.html`;
    await writeFile(fichier, resultat.report);
  }
} finally {
  await navigateur.close();
  arreter();
}

if (echec) {
  console.error(`\nAu moins une note est sous ${SEUIL} en mode sobre.`);
  process.exit(1);
}
