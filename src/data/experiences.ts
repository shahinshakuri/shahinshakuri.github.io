// Expérience — seule source : section 4 de PORTFOLIO_BRIEF.md.
// Le brief demande de n'afficher que ces deux expériences, données d'abord, sans frise chronologique.

export interface Experience {
  /** Identifiant court, utilisé pour l'ancre `#experience-…` et les liens des compétences. */
  id: string;
  type: 'Alternance' | 'Stage';
  structure: string;
  periode: string;
  resume: string;
  /** Réalisations détaillées (titre + description). */
  realisations?: { titre: string; texte: string }[];
  technologies?: string[];
}

export const experiences: Experience[] = [
  {
    id: 'universite-lille',
    type: 'Alternance',
    structure: 'DSI de l’Université de Lille',
    periode: '2023-2024',
    resume: 'Importation, traitement et vérification de données.',
  },
  {
    id: 'worldline',
    type: 'Stage',
    structure: 'Worldline',
    periode: '2023',
    resume: 'Deux outils de supervision en Python autour d’Elasticsearch.',
    realisations: [
      {
        titre: 'Elastalert',
        texte: 'Fonctionnalités en Python d’alertes sur des index Elasticsearch, avec notifications par e-mail.',
      },
      {
        titre: 'Metricbeat allégé',
        texte: 'Outil Python qui collecte l’utilisation du processeur, de la mémoire vive et du disque, et l’envoie à Elasticsearch.',
      },
    ],
    technologies: ['Python', 'Elasticsearch'],
  },
];
