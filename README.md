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
```

## Où modifier quoi

| Je veux… | Fichier |
|---|---|
| Changer un texte qui me décrit, mes liens, ajouter un CV plus tard (`cvUrl`) | `src/data/profil.ts` |
| Changer un libellé de l'interface (menu, boutons) | `src/i18n/fr.ts` |
| Changer les couleurs ou les polices | `src/styles/variables.css` |
| Ajouter un projet, une compétence *(phase 2)* | `src/data/projets.ts`, `src/data/competences.ts` |

## Mise en ligne

Chaque push sur `main` lance `.github/workflows/deploy.yml`, qui construit le site et le publie sur GitHub Pages.
Réglage nécessaire une seule fois : *Settings → Pages → Build and deployment → Source : GitHub Actions*.

Chaque pull request lance `.github/workflows/verifs.yml` (vérification des types et build), sans rien publier.
