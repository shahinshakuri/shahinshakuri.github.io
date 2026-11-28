// Mes projets — seule source : section 4 de PORTFOLIO_BRIEF.md, complétée par l'ancien site
// et par le contenu de mes dépôts publics (noms de fichiers, README). Rien d'inventé.
// Pour ajouter un projet : ajouter un objet dans la liste `projets` (ordre = ordre d'affichage).

import type { ImageMetadata } from 'astro';
import imgFransi from '../assets/projets/fransi/accueil-persan.png';
import imgFractale from '../assets/projets/fractale.png';
import imgMarathon from '../assets/projets/marathon.png';
import imgSokoban from '../assets/projets/sokoban.png';
import imgSiteIut from '../assets/projets/site-iut.png';

export type Contexte = 'Projet personnel' | 'École';

export interface Projet {
  /** Identifiant court, utilisé pour l'ancre `#projet-…` et les liens des compétences. */
  slug: string;
  titre: string;
  annee: number;
  /** Badge « En cours ». */
  enCours?: boolean;
  contexte: Contexte;
  /** Taille de l'équipe, dite simplement. */
  equipe: string;
  technologies: string[];
  resume: string;
  /** Ce qui a été fait (en équipe quand c'est un projet d'équipe). */
  points: string[];
  /** Dépôt GitHub public. `null` = dépôt privé ou inexistant : aucun bouton. */
  depot: string | null;
  /** Remarque affichée sous les points (ex. lien disparu). */
  note?: string;
  /** Page détaillée sur ce site. */
  page?: string;
  /** Version jouable ou démo sur ce site. */
  essai?: string;
  image?: { src: ImageMetadata; alt: string };
  /** Dessin à la place d'une capture quand il n'y en a pas d'utilisable. */
  illustration?: 'labyrinthe';
}

export const projets: Projet[] = [
  {
    slug: 'fransi',
    titre: 'Fransi',
    annee: 2026,
    enCours: true,
    contexte: 'Projet personnel',
    equipe: 'Avec un assistant IA',
    technologies: ['SvelteKit', 'TypeScript', 'Vite', 'Vitest', 'Playwright', 'axe-core', 'GitHub Actions'],
    resume:
      'Site gratuit pour apprendre le français de A1 à B2 et préparer le DELF, pensé pour les personnes ' +
      'qui parlent persan (Iran, Afghanistan, diaspora).',
    points: [
      'Interface en persan/dari (écriture de droite à gauche) et en anglais.',
      'Fonctionne hors ligne (PWA, Service Worker) : parcours en unités, exercices, conjugaison, lexique, glossaire, test de placement, examens blancs.',
      'Niveau A1 rédigé (13 unités), spécifications A2, B1 et B2 écrites, plus de 150 pull requests.',
      'Développé avec un assistant IA (Claude Code), dans un cadre strict : branches, pull requests, journal des décisions et relecture humaine obligatoire du contenu pédagogique.',
    ],
    depot: null,
    page: '/projets/fransi/',
    image: {
      src: imgFransi,
      alt: 'Page d’accueil de Fransi en persan, thème sombre : titre « Apprenez le français, de A1 à B2 », boutons pour commencer au niveau A1 ou trouver son niveau, et premières unités des niveaux A1 et A2.',
    },
  },
  {
    slug: 'fractals-generator',
    titre: 'Fractals Generator',
    annee: 2022,
    contexte: 'École',
    equipe: 'Groupe de 3',
    technologies: ['Java', 'Gradle', 'Bash'],
    resume: 'Programme Java 17 qui génère des images de fractales (ensembles de Julia et de Mandelbrot) au format PNG.',
    points: [
      'Palettes de couleurs Rouge, Vert, Bleu et Gris, choisies au lancement.',
      'Utilisable par des scripts bash ou par un JAR exécutable avec options : taille, zoom, nombre d’itérations, point central.',
      'Code organisé avec des patrons de conception (stratégie, décorateur, adaptateur, composite), documenté par une Javadoc et un diagramme UML.',
    ],
    depot: 'https://github.com/shahinshakuri/Fractals-Generator',
    image: {
      src: imgFractale,
      alt: 'Ensemble de Julia rouge sur fond noir, généré par le programme.',
    },
  },
  {
    slug: 'marathon-web',
    titre: 'Marathon Web',
    annee: 2022,
    contexte: 'École',
    equipe: 'Équipe de 3, en 48 heures',
    technologies: ['Laravel', 'PHP', 'MySQL'],
    resume: 'Site web de type Netflix réalisé en 48 heures : « Squid Series », un catalogue de séries.',
    points: [
      'Fiches de séries avec affiche, genre, langue et note.',
      'Tri du catalogue par nom ou par date.',
      'Application Laravel avec une base de données MySQL.',
    ],
    depot: null,
    image: {
      src: imgMarathon,
      alt: 'Catalogue « Squid Series » : fiches des séries Fargo, Brooklyn Nine-Nine, Game of Thrones et The Good Wife, avec boutons de tri par nom et par date.',
    },
  },
  {
    slug: 'sokoban',
    titre: 'Sokoban',
    annee: 2021,
    contexte: 'École',
    equipe: 'Groupe de 4',
    technologies: ['Python', 'PyQt5'],
    resume: 'Jeu de réflexion en Python : pousser toutes les caisses sur les cibles.',
    points: [
      'Interface graphique avec PyQt5.',
      'Code découpé en Modèle / Vue / Contrôleur (architecture MVC).',
      '5 niveaux, des sprites et des sons, avec des pièges à pics et des téléporteurs.',
    ],
    essai: '/jeux/sokoban/',
    depot: 'https://github.com/shahinshakuri/Sokoban-Project',
    image: {
      src: imgSokoban,
      alt: 'Niveau du Sokoban en pixel art : le personnage violet, des caisses en bois et des cibles rouges sur un sol de pierre.',
    },
  },
  {
    slug: 'labyrinthe',
    titre: 'Labyrinthe',
    annee: 2021,
    contexte: 'École',
    equipe: 'Groupe de 4',
    technologies: ['Java'],
    resume: 'Adaptation en Java du jeu de société Labyrinthe, pour le projet du semestre 2.',
    points: ['Projet mené en groupe de 4, avec tests et diagrammes.'],
    depot: 'https://github.com/shahinshakuri/Labyrinthe',
    illustration: 'labyrinthe',
  },
  {
    slug: 'site-iut',
    titre: 'Refonte du site de l’IUT',
    annee: 2020,
    contexte: 'École',
    equipe: 'Binôme',
    technologies: ['HTML/CSS'],
    resume: 'Nouvelle version du site de l’IUT, écrite en HTML et CSS.',
    points: ['Projet en binôme : le site était hébergé sur le compte GitHub de mon binôme.'],
    // Le site du binôme (https://habiberfani.github.io/premier/) répond 404 (vérifié le 2026-11-28) : mention gardée, sans lien.
    note: 'Ce site n’est plus en ligne aujourd’hui.',
    depot: null,
    image: {
      src: imgSiteIut,
      alt: 'Extrait du site réalisé : menu horizontal, titre « Bienvenue sur le portail national des départements informatiques des IUT » et quatre pictogrammes hexagonaux.',
    },
  },
];

/** Toutes les technologies citées dans les projets, sans doublon (pour les filtres de la phase 3). */
export const technologies = [...new Set(projets.flatMap((p) => p.technologies))];
