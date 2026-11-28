# shahinshakuri.github.io — « Le labo de Shahin »

Portfolio de Shahin Shakuri, en ligne sur <https://shahinshakuri.github.io>.
Site statique construit avec [Astro](https://astro.build) et TypeScript, CSS fait main.

> Refonte en cours sur la branche `refonte` (voir `PORTFOLIO_BRIEF.md` et `DECISIONS.md`).
> L'ancien site (2022) reste récupérable grâce au tag `v1-ancien-site`.

## Lancer le site sur son ordinateur

Il faut Node.js 22.23 ou plus récent (24 conseillé).

```sh
npm install        # une seule fois
npm run dev        # site de travail sur http://localhost:4321, mis à jour à chaque modification
npm run build      # fabrique le site final dans dist/
npm run preview    # affiche le site final (dist/) sur http://localhost:4321
npm run check      # vérifie le code TypeScript et Astro
npm test           # lance les tests automatiques (Vitest)
```

Contrôles de qualité (après `npm run build`) :

```sh
npx playwright install chromium   # une seule fois : le navigateur des tests
npm run test:e2e                  # accessibilité (axe), mobile 360 px, clavier, sans JavaScript
npm run liens                     # liens cassés dans dist/ (liens internes)
npm run liens:externes            # idem, avec les liens vers les autres sites (plus lent)
npm run orthographe               # fautes dans les textes (cspell) ; mots acceptés : cspell.config.yaml
npm run lighthouse                # notes Lighthouse en mode sobre (échoue sous 90)
npm run lighthouse -- --ludique   # idem en mode ludique (ajouter --mobile pour un téléphone)
```

## Où modifier quoi

| Je veux… | Fichier |
|---|---|
| Changer un texte qui me décrit, mes liens, ajouter un CV plus tard (`cvUrl`) | `src/data/profil.ts` |
| Changer un libellé de l'interface (menu, boutons) | `src/i18n/fr.ts` |
| Changer les couleurs ou les polices | `src/styles/variables.css` |
| Ajouter ou modifier un projet | `src/data/projets.ts` (images dans `src/assets/projets/`) |
| Modifier une expérience, la formation, les compétences | `src/data/experiences.ts`, `src/data/formation.ts`, `src/data/competences.ts` |
| Refaire l’image d’aperçu des réseaux sociaux (après un changement de nom ou de titre) | `npm run og` → `public/og.png` |
| Modifier ou ajouter un niveau du Sokoban (puis lancer `npm test` : il vérifie que le niveau a une solution) | `src/data/niveaux-sokoban.ts` |
| Changer les commandes du mode terminal | `src/lib/terminal.ts` |
| Régler la fractale (couleurs des palettes, forme, vitesse) | `src/scripts/fractale.ts` |

## Raccourcis du site

- `²` (ou `` ` `` / `~` sur un clavier anglais) ou le bouton `>_` : ouvre le mode terminal. `Échap` le ferme.
- Le mode terminal, la fractale et le Sokoban de la page 404 sont masqués en **mode sobre**.
  La page `/jeux/sokoban/` reste jouable dans tous les cas.

## Mise en ligne

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages.
Réglage nécessaire une seule fois : *Settings → Pages → Build and deployment → Source : GitHub Actions*.

Chaque pull request lance `.github/workflows/verifs.yml` (vérification des types, tests et build), sans rien publier.
