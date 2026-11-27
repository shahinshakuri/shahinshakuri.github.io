# Journal des décisions

Chaque choix technique réversible pris pendant la refonte : date, choix, raison, alternative écartée.
Les décisions importantes (niveau 3 du brief) sont validées par Shahin avant d'être appliquées.

## Phase 0 — Plan (2026-11-27)

| # | Choix | Raison | Alternative écartée |
|---|---|---|---|
| 0.1 | Piste visuelle **A « Labo nocturne »** : fond `#0d1117`, accent vert `#3df5a0` (clair : `#0a7a4b`) ; Space Grotesk / Inter / JetBrains Mono. *Validé par Shahin.* | Colle au concept « labo » et au mode terminal ; contrastes AA vérifiés. | B « Fractale chaude » (orange), C « Ardoise électrique » (violet, polices système). |
| 0.2 | Fractale en **WebGL** (dans un `<canvas>`), repli sur une image fixe. *Prévu phase 3.* | Bien plus fluide, surtout sur mobile. | Canvas 2D calculé par le processeur : lent en plein écran. |
| 0.3 | Sokoban aussi sur une page **`/jeux/sokoban/`**, en plus de la 404. *Prévu phase 3.* | La carte du projet ne doit pas renvoyer vers une page d'erreur. | Lien direct vers la 404. |
| 0.4 | **Pas de page `/en/` publiée avant la phase 6**. Les textes d'interface sont dans `src/i18n/fr.ts` pour faciliter la traduction. | Éviter une page vide dans le sitemap. | Page `/en/` vide ou « bientôt ». |

## Phase 1 — Socle (2026-11-27)

| # | Choix | Raison | Alternative écartée |
|---|---|---|---|
| 1.1 | Tag `v1-ancien-site` sur `main` (commit `122a4e0`), poussé sur GitHub. *Validé par Shahin.* | Pouvoir récupérer l'ancien site à tout moment. | — |
| 1.2 | Retrait anticipé de `node_modules/`, `package.json` et `package-lock.json` de l'ancien site, **sur `refonte` uniquement**. *Validé par Shahin.* | Ils entraient en conflit avec le nouveau projet à la racine. L'ancien `index.html` ne les utilisait pas. Le reste de l'ancien site attend la phase 5. | Construire le site dans un sous-dossier `site/` puis le déplacer en phase 5. |
| 1.3 | **TypeScript 6.0.3** plutôt que 7. | `@astrojs/check` 0.9.12 n'accepte que TypeScript 5 ou 6. | TypeScript 7.0.2 : incompatible. |
| 1.4 | Polices **auto-hébergées** via Fontsource (fichiers servis par le site lui-même). | Aucun service tiers (pas de Google Fonts), pas de suivi. | Google Fonts ; polices système seules. |
| 1.5 | Thème **sombre par défaut**, choix mémorisé dans le navigateur (`localStorage`, clé `labo:theme`). | Demandé par le brief. | Suivre automatiquement le thème du système. |
| 1.6 | **Mode sobre** : activé automatiquement si le système demande moins d'animations, sauf si la personne a choisi elle-même (clé `labo:sobre`). Il masque les éléments `.deco` et `.ludique` et coupe animations et transitions. Il émet l'événement `labo:sobre` pour les modules de la phase 3. | Demandé par le brief ; un seul interrupteur à brancher pour la fractale, le terminal, etc. | — |
| 1.7 | Script très court dans `<head>` qui applique thème et mode sobre **avant l'affichage**. | Évite un « flash » de mauvais thème au chargement. | Tout appliquer après chargement. |
| 1.8 | Sur mobile/tablette, le menu passe sur une **2e ligne défilable horizontalement**, sans menu « burger ». | Fonctionne sans JavaScript, tous les liens restent visibles et accessibles au clavier. | Menu burger (demande du JavaScript). |
| 1.9 | Les boutons « Mode sobre » et « Thème » sont **cachés sans JavaScript** (classe `no-js`). | Sans JavaScript ils ne feraient rien ; le contenu reste entièrement lisible. | Les laisser visibles mais inactifs. |
| 1.10 | Déploiement : workflow officiel `withastro/action@v6` + `actions/deploy-pages@v5`, **seulement sur push vers `main`** (pas de lancement manuel). | Respect strict du brief. | Ajouter `workflow_dispatch`. |
| 1.11 | Workflow **`verifs.yml`** sur chaque pull request : `astro check` + build. Il ne publie rien. | Détecter une erreur avant la fusion. | Aucune vérification avant fusion. |
| 1.12 | Télémétrie Astro **désactivée dans la CI** (`ASTRO_TELEMETRY_DISABLED`). | Pas d'envoi de données d'usage. En local, c'est un réglage de ta machine : à toi de choisir (`npx astro telemetry disable`). | — |
| 1.13 | Node **24** en CI (`.nvmrc`), comme l'action officielle. | Version stable longue durée. | Node 26 (utilisé en local, fonctionne aussi). |

## Phase 2 — Contenu (2026-11-27)

| # | Choix | Raison | Alternative écartée |
|---|---|---|---|
| 2.1 | Paquet **sharp 0.35.5** (licence Apache-2.0), en dépendance de développement. *Validé par Shahin.* | Il optimise les images au moment du build et fabrique l'image d'aperçu `og.png`. | Images non optimisées. |
| 2.2 | Images servies en **AVIF, avec du WebP en repli** (`<Picture>` d'Astro), en deux tailles. | Le dossier `dist/` passe de 3,7 Mo à 1,5 Mo. | Garder les PNG d'origine, beaucoup plus lourds. |
| 2.3 | Captures de **Fransi** prises avec le script du projet, sur une **copie à part** du dépôt (dans un dossier temporaire). | Ne rien modifier ni commiter dans le dépôt Fransi. | Faire les captures directement dans le dépôt Fransi. |
| 2.4 | L'image de Labyrinthe de l'ancien site (`lab1.png`) **n'est pas reprise**. Elle est remplacée par un **dessin SVG**, indiqué comme une illustration. | L'image semble venir du jeu de société officiel, pas du projet. | La reprendre telle quelle. |
| 2.5 | Le lien vers l'ancien site de l'IUT **n'est pas affiché**. On écrit « Ce site n'est plus en ligne aujourd'hui. ». | L'adresse renvoie une erreur 404 et le dépôt d'origine n'existe plus (vérifié le 2026-11-27). | Laisser un lien cassé. |
| 2.6 | Image d'aperçu des réseaux sociaux (`public/og.png`, 1200 × 630) **générée par un script** (`npm run og`) à partir de `profil.ts`. | Une seule source pour le nom et le titre, et pas de logiciel de dessin. | Image dessinée à la main. |
| 2.7 | Marathon Web : **équipe de 3**. Licence pro : **IUT de Lens**. *Réponses de Shahin.* | Informations absentes du brief. | — |
| 2.8 | Projets d'école présentés comme du **travail d'équipe**, **sans rôle individuel inventé**. Les noms des coéquipiers ne sont pas publiés, seulement la taille de l'équipe. | Règle du brief : « N'invente rien sur moi ». Les noms des autres personnes leur appartiennent. | Attribuer une partie précise du travail à Shahin. |
| 2.9 | Compétences reliées aux projets et expériences par **des liens internes vérifiés au build** : une référence inconnue fait échouer la construction. | Pas de lien mort, et chaque compétence montre où elle a servi. | Liste de compétences sans lien. |
