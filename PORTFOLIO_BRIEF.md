# BRIEF : nouveau portfolio de Shahin Shakuri

> À placer à la racine du dépôt `shahinshakuri.github.io` sous le nom `PORTFOLIO_BRIEF.md`, puis écrire à Claude Code, en mode plan :
> « Lis PORTFOLIO_BRIEF.md et fais uniquement la phase 0. »
> Le contenu de la section 4 est rempli : c'est la seule source à utiliser.

---

## 0. Ta mission et ta façon de travailler

Tu reconstruis **de zéro** mon portfolio personnel, hébergé sur GitHub Pages à l'adresse `https://shahinshakuri.github.io`. L'ancien site (HTML + Bootstrap, 2022) est dépassé et plein d'erreurs : on ne le corrige pas, on le remplace.

**Objectif final : à la fin, le nouveau site remplace complètement l'ancien, à la même adresse, dans le même dépôt.** Il ne reste dans `main` que le nouveau projet : plus aucun fichier de l'ancien site (`index.html` d'origine, `assets/`, `vendor/`, `node_modules/`, `composer.json`, `composer.lock`, ancien `package.json`). L'ancien site reste récupérable seulement grâce au tag `v1-ancien-site`.

Tant que je n'ai pas fusionné la pull request finale, l'ancien site doit continuer à fonctionner en ligne. Tu travailles donc sur la branche `refonte` sans toucher à `main`.

Je suis développeur débutant en « vibe coding ». Tu fais l'essentiel du travail, tu me réponds en français, simplement, sans jargon inutile, et tu me demandes mon avis sur les décisions importantes.

### Trois niveaux d'autonomie

1. **Tu fais sans demander** : code conforme à ce brief, corrections de bogues, tests, accessibilité, documentation.
2. **Tu fais et tu le signales** : petits choix techniques réversibles. Tu les consignes dans `DECISIONS.md` (date, choix, raison, alternative écartée).
3. **Tu t'arrêtes et tu me demandes** (options A, B, C + ta recommandation) : toute dépendance hors de la liste approuvée, tout service tiers (formulaire, analytics, polices externes), tout texte qui me décrit d'une façon que je n'ai pas fournie, toute suppression de fichiers de l'ancien site, tout changement de concept ou de pile technique.

### Règles absolues

- Jamais de travail direct sur `main`. Branche `refonte`, pull request vers `main` : **c'est moi qui fusionne**.
- Avant la phase 1, crée un tag `v1-ancien-site` sur l'état actuel de `main` pour pouvoir revenir en arrière (demande-moi avant de pousser le tag).
- Pas de commit ni de push sans mon accord (un accord par phase suffit).
- Installations : au début de chaque phase, liste les paquets (nom, version, licence, raison) et attends mon accord.
- **N'invente rien sur moi** : ni diplôme, ni date, ni niveau, ni chiffre, ni témoignage. Utilise seulement la section 4. S'il manque une info, mets un `TODO` visible dans le code et signale-le dans ton rapport.
- Aucun secret dans le dépôt.

---

## 1. Concept : « Le labo de Shahin » (original et amusant, mais pro)

Le site doit faire sourire un recruteur **sans jamais le ralentir**. Il doit trouver en moins de 10 secondes : qui je suis, ce que je sais faire, mes projets et comment me contacter.

Idées à réaliser (ce sont mes projets qui inspirent le design) :

1. **Accueil avec une fractale vivante** : un fond en `<canvas>` qui dessine un ensemble de Julia en temps réel ; le paramètre `c` suit doucement la souris (ou l'inclinaison sur mobile). Clin d'œil à mon projet *Fractals Generator*. Bouton « figer / changer de palette » (Rouge, Vert, Bleu, Gris, comme dans le projet Java).
2. **Les projets présentés comme des « niveaux »** de jeu : « Niveau 1 — Sokoban », « Niveau 2 — Labyrinthe »… Chaque carte affiche : titre, année, contexte (école, stage, perso), équipe, technologies, ce que **j'ai** fait, lien GitHub, captures. Filtres par technologie.
3. **Mini-jeu Sokoban jouable** (clavier + boutons tactiles), 2 ou 3 petits niveaux, sur la page 404 et accessible depuis la carte du projet Sokoban (« Essayer une version web »).
4. **Mode terminal** (easter egg) : la touche `²`/`~` ou un bouton `>_` ouvre une console avec les commandes `help`, `about`, `projets`, `competences`, `contact`, `sokoban`, `clear`.
5. **Interrupteur « Mode sobre »** dans l'en-tête : coupe toutes les animations, affiche une version épurée pour les recruteurs pressés. Activé automatiquement si `prefers-reduced-motion`.

Direction visuelle : sombre par défaut, une couleur d'accent vive, typographie lisible, pas de « template Bootstrap ». Thème clair disponible. Lis le skill de design frontend si tu l'as.

---

## 2. Pile technique

- **Astro** (site statique) + TypeScript, CSS maison (pas de Bootstrap, pas de Tailwind sauf si tu justifies). Les parties interactives (fractale, Sokoban, terminal) en TypeScript simple, sans framework lourd.
- Contenu dans des fichiers de données (`src/data/projets.ts`, `competences.ts`, `profil.ts`) pour que je puisse ajouter un projet sans toucher à la mise en page.
- Déploiement par **GitHub Actions** (action officielle Astro → GitHub Pages), déclenché seulement par un push sur `main`. Tant que la refonte n'est pas fusionnée, l'ancien site continue d'être servi normalement. Pour tester avant la mise en ligne, utilise `npm run build` + `npm run preview` en local et montre-moi des captures.
- **Nettoyage** : l'ancien dépôt contient `node_modules/` (9 Mo) et `vendor/` (19 Mo) versionnés. Le nouveau site ne versionne ni `node_modules`, ni `dist`, ni `vendor` (`.gitignore`).
- Le site doit fonctionner sans JavaScript pour le contenu essentiel (texte, projets, contact).

---

## 3. Erreurs de l'ancien site à ne pas reproduire

- Liens vides (`#`) sur Calculatrice, Marathon, Elastalert, Metricbeat et le pied de page.
- Ancres cassées (`#skils`, `#home`, `#work`…) : chaque lien du menu doit mener à une section existante.
- Balise viewport mal écrite, pas de `<h1>`, toutes les images avec `alt` vide.
- « Étudiant en 2e année de BUT, à la recherche d'une alternance » : **faux aujourd'hui**.
- « © 2022 » figé : l'année doit être calculée au build.
- Compétences sans aucun contexte : chaque compétence doit renvoyer aux projets où je l'ai utilisée.
- Lien vers le site d'un autre compte (`habiberfani`) sans explication : préciser que c'est un projet d'équipe.
- Mélange « je / nous / notre environnement » : écrire à la 1re personne, en disant clairement ce qui a été fait en équipe.
- Numéro de téléphone affiché en clair : **ne pas le mettre** (e-mail + LinkedIn suffisent, voir section 4).

---

## 4. Contenu (seule source autorisée)

### Profil

- Nom : **Shahin Shakuri**. Basé en Île-de-France.
- Titre affiché : **Profil informatique & données**.
- Phrase d'accroche : « Bac +3 en informatique. Je rends les données fiables et je construis des outils web utiles, de l'import de données à l'Université de Lille jusqu'à Fransi, mon site d'apprentissage du français. »
- Disponibilité et type de contrat : **ne rien afficher** (pas de « disponible », pas de « recherche CDI/alternance »).
- Photo : **pas de photo**. À la place, un avatar graphique avec mes initiales « SS » (par exemple dessinées dans la fractale).
- CV : **pas de CV sur le site pour l'instant.** Aucun bouton, lien, aperçu ni commande « CV ». Ne reprends pas `cv.pdf` ni `cv.png` de l'ancien site. Prévois seulement un réglage dans `src/data/profil.ts` (par exemple `cvUrl: null`) pour pouvoir l'ajouter plus tard sans refaire la mise en page.
- Contact : e-mail `shahinshakuri0@gmail.com`, LinkedIn `https://www.linkedin.com/in/shahin-shakuri-423366226/`, GitHub `https://github.com/shahinshakuri`. Pas de numéro de téléphone. Pas de formulaire de contact (pas de service tiers) : un bouton « m'écrire » (`mailto:`) et un bouton « copier l'adresse ».

### Formation

- Licence professionnelle en informatique (Bac +3), obtenue en 2024, en alternance.
- BUT Informatique — IUT de Lens (ne pas afficher d'années).
- Baccalauréat scientifique (bac S).

### Expérience (mettre en avant le côté données, en premier)

- **Alternance — DSI de l'Université de Lille (2023-2024)** : importation, traitement et vérification de données.
- **Stage — Worldline (2023)** :
  - *Elastalert* : fonctionnalités en Python d'alertes sur des index Elasticsearch, avec notifications par e-mail.
  - *Metricbeat allégé* : outil Python qui collecte CPU, RAM et disque et les envoie à Elasticsearch.
- **N'affiche aucune autre expérience** (rien hors informatique). Pas de frise chronologique avec des années, pour ne pas faire apparaître de « trou ».

### Projets (ordre d'affichage : le plus récent d'abord)

1. **Fransi — site d'apprentissage du français pour persanophones (2026, en cours, projet personnel)** — dépôt privé `shahinshakuri/FLE`.
   - Site gratuit pour apprendre le français de A1 à B2 et préparer le DELF, pour les personnes qui parlent persan (Iran, Afghanistan, diaspora). Interface en persan/dari (écriture de droite à gauche) et en anglais.
   - Fonctionne **hors ligne** (PWA, Service Worker) : parcours en unités, exercices, conjugaison, lexique, glossaire, test de placement, examens blancs.
   - Niveau A1 rédigé (13 unités, u00 à u12), spécifications A2, B1 et B2 écrites. Plus de 150 pull requests.
   - Technique : SvelteKit, TypeScript, Vite, tests Vitest et Playwright, contrôle d'accessibilité axe-core, intégration continue GitHub Actions, scripts de validation du contenu (schémas JSON, signature de relecture, vérification des licences).
   - Méthode : développé avec un assistant IA (Claude Code), avec un processus strict : branches, pull requests, journal des décisions, relecture humaine obligatoire du contenu pédagogique. **Le dire honnêtement sur le site.**
   - Le dépôt reste **privé** : pas de bouton GitHub ni de lien vers le site (domaine `fransi.fr` pas encore branché). Badge « En cours ».
   - Captures d'écran : demande-moi le chemin du dossier FLE sur mon ordinateur. Dans ce dossier, tu peux lancer `npm run build` puis `npm run interface:captures` (lecture seule : **ne modifie rien dans FLE**, ne commite rien dedans), puis copier 3 ou 4 captures (accueil, parcours, exercice, version mobile) dans le portfolio. Si ça ne marche pas, utilise une illustration à la place et dis-le-moi.
   - Cette carte a sa propre page détaillée (`/projets/fransi/`).
2. **Fractals Generator (2022, école, groupe de 3)** — `shahinshakuri/Fractals-Generator` : programme Java 17 / Gradle qui génère des ensembles de Julia et de Mandelbrot en PNG, avec palettes de couleurs, scripts bash, JAR exécutable, Javadoc et diagramme UML. Images disponibles dans `readme-img/` du dépôt.
3. **Marathon Web (2022, école, 48 h)** — site de type Netflix réalisé en 48 heures avec Laravel, PHP et MySQL. Pas de dépôt public : pas de bouton GitHub.
4. **Sokoban (2021, école, groupe de 4)** — `shahinshakuri/Sokoban-Project` : jeu en Python avec PyQt5, architecture MVC (Model / View / Controller). Bouton « Essayer la version web » vers le mini-jeu.
5. **Labyrinthe (2021, école, groupe de 4)** — `shahinshakuri/Labyrinthe` : adaptation du jeu de société en Java (projet du semestre 2), avec tests et diagrammes.
6. **Refonte du site de l'IUT (2020, école, binôme)** — HTML/CSS. Lien vers le site du binôme (`https://habiberfani.github.io/premier/index.html`), avec la mention « projet en binôme, hébergé sur le compte de mon binôme ».

Ne pas afficher : `french-learning-app` (projet Flutter seulement initialisé, remplacé par Fransi), `nextjs-portfolio`, `First-Portfolio` et la calculatrice.

### Compétences (groupées ; « Données » en premier ; chaque compétence reliée aux projets affichés quand il y en a un, sinon listée sans lien)

- **Données** : Elasticsearch, MySQL, PostgreSQL, traitement et vérification de données.
- **Langages** : Java, Python, JavaScript, TypeScript, PHP, SQL / PL/pgSQL, HTML/CSS.
- **Frameworks** : SvelteKit, React / Next.js, Laravel, Angular, Flask, PyQt5, Tailwind CSS.
- **Outils & méthodes** : Git, GitHub, GitLab, GitHub Actions (CI), tests (Vitest, Playwright), Gradle, Linux, bases réseau, accessibilité web, travail avec un assistant IA.
- **Bureautique** : Word, Excel.
- **Langues** : persan (langue maternelle), français (courant), anglais (intermédiaire).

Pas de barres de progression ni de pourcentages inventés.

---

## 5. Qualité attendue

- Responsive (de 360 px à 1440 px), testé en mobile.
- Accessibilité : contraste AA, navigation complète au clavier, `alt` réels, focus visible, `prefers-reduced-motion` respecté.
- Performance : Lighthouse ≥ 90 sur les 4 catégories en mode sobre ; la fractale se met en pause quand l'onglet est caché ou hors écran.
- SEO : `<title>`, description, balises Open Graph (image d'aperçu générée), `sitemap.xml`, favicon.
- Aucun lien cassé (vérification automatique dans la CI).
- Français d'abord. Version anglaise : prévoir la structure (`/en/`), la remplir seulement en phase 6 si je le demande.

---

## 6. Phases (arrête-toi et fais ton rapport à la fin de chacune)

- **Phase 0 — Plan** : lis ce brief et le dépôt actuel. Propose l'arborescence, la liste des paquets, 2 ou 3 pistes de couleurs/typo, et la liste des informations qui te manquent encore. Rien n'est installé ni écrit.
- **Phase 1 — Socle** : tag `v1-ancien-site` sur `main`, branche `refonte`, projet Astro, mise en page, en-tête, mode sobre, thème clair/sombre, fichier de workflow GitHub Actions prêt (il ne s'exécutera qu'après la fusion dans `main`). Build et aperçu local qui fonctionnent.
- **Phase 2 — Contenu** : toutes les sections avec les données de la section 4, contact, page projet détaillée pour Fransi.
- **Phase 3 — Le côté fun** : fractale interactive, cartes « niveaux », Sokoban jouable, mode terminal.
- **Phase 4 — Vérifications** : Lighthouse, accessibilité (axe), liens, mobile, relecture de l'orthographe. Captures d'écran avant/après dans le rapport.
- **Phase 5 — Remplacement de l'ancien site (obligatoire)** :
  1. Sur la branche `refonte`, liste-moi tous les fichiers de l'ancien site que tu vas supprimer, puis supprime-les après mon accord (`git rm`). Le nouveau projet est à la racine du dépôt.
  2. Vérifie que plus rien ne reste de l'ancien site (aucun fichier CV, aucun numéro de téléphone, aucun `node_modules/` ni `vendor/` versionné) et que `npm run build` réussit sur un clone propre.
  3. Ouvre (ou prépare si tu ne peux pas l'ouvrir) la pull request `refonte` → `main` avec un résumé et des captures. **C'est moi qui fusionne.**
  4. Donne-moi les étapes exactes à faire juste après la fusion : *Settings → Pages → Build and deployment → Source : GitHub Actions*, puis suivre le déploiement dans l'onglet *Actions*.
  5. Après la mise en ligne, vérifie le site réel à l'adresse `https://shahinshakuri.github.io` (toutes les pages, liens, mobile, page 404 avec Sokoban) et fais-moi un rapport final.
  6. Ne réécris jamais l'historique Git et ne fais jamais de `--force` sans ma demande explicite.
- **Phase 6 (optionnelle)** : version anglaise.

## 7. Rapport obligatoire à la fin de chaque phase

Ce qui a été fait ; les décisions prises ; les commandes lancées et leur résultat réel (ne prétends jamais qu'un test ou un build a réussi sans l'avoir exécuté) ; les `TODO` restants ; ce que je dois faire moi-même.
