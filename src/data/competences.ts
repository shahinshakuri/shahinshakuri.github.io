// Compétences — seule source : section 4 de PORTFOLIO_BRIEF.md.
// Chaque compétence renvoie aux projets ou expériences où elle a servi (`utilisee`).
// Pas de lien = pas de projet affiché qui la montre : elle est listée sans lien.
// Pas de barre de progression ni de pourcentage.

/** Identifiants : `slug` d'un projet (src/data/projets.ts) ou `id` d'une expérience (src/data/experiences.ts). */
export type Reference =
  | 'fransi'
  | 'fractals-generator'
  | 'marathon-web'
  | 'sokoban'
  | 'labyrinthe'
  | 'site-iut'
  | 'universite-lille'
  | 'worldline';

export interface Competence {
  nom: string;
  utilisee?: Reference[];
}

export interface GroupeCompetences {
  groupe: string;
  competences: Competence[];
}

export const competences: GroupeCompetences[] = [
  {
    groupe: 'Données',
    competences: [
      { nom: 'Elasticsearch', utilisee: ['worldline'] },
      { nom: 'MySQL', utilisee: ['marathon-web'] },
      { nom: 'PostgreSQL' },
      { nom: 'Traitement et vérification de données', utilisee: ['universite-lille'] },
    ],
  },
  {
    groupe: 'Langages',
    competences: [
      { nom: 'Java', utilisee: ['fractals-generator', 'labyrinthe'] },
      { nom: 'Python', utilisee: ['worldline', 'sokoban'] },
      { nom: 'JavaScript' },
      { nom: 'TypeScript', utilisee: ['fransi'] },
      { nom: 'PHP', utilisee: ['marathon-web'] },
      { nom: 'SQL / PL/pgSQL', utilisee: ['marathon-web'] },
      { nom: 'HTML/CSS', utilisee: ['site-iut'] },
    ],
  },
  {
    groupe: 'Frameworks',
    competences: [
      { nom: 'SvelteKit', utilisee: ['fransi'] },
      { nom: 'React / Next.js' },
      { nom: 'Laravel', utilisee: ['marathon-web'] },
      { nom: 'Angular' },
      { nom: 'Flask' },
      { nom: 'PyQt5', utilisee: ['sokoban'] },
      { nom: 'Tailwind CSS' },
    ],
  },
  {
    groupe: 'Outils & méthodes',
    competences: [
      { nom: 'Git', utilisee: ['fransi'] },
      { nom: 'GitHub', utilisee: ['fransi'] },
      { nom: 'GitLab' },
      { nom: 'GitHub Actions (CI)', utilisee: ['fransi'] },
      { nom: 'Tests (Vitest, Playwright)', utilisee: ['fransi'] },
      { nom: 'Gradle', utilisee: ['fractals-generator'] },
      { nom: 'Linux' },
      { nom: 'Bases réseau' },
      { nom: 'Accessibilité web', utilisee: ['fransi'] },
      { nom: 'Travail avec un assistant IA', utilisee: ['fransi'] },
    ],
  },
  {
    groupe: 'Bureautique',
    competences: [{ nom: 'Word' }, { nom: 'Excel' }],
  },
  {
    groupe: 'Langues',
    competences: [
      { nom: 'Persan (langue maternelle)' },
      { nom: 'Français (courant)' },
      { nom: 'Anglais (intermédiaire)' },
    ],
  },
];
