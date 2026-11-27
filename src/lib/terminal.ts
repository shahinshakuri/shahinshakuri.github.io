// Logique du mode terminal : chaque commande renvoie des lignes de texte (sans HTML).
// L'affichage est dans src/scripts/terminal.ts ; les tests dans src/lib/terminal.test.ts.

export interface DonneesTerminal {
  profil: {
    nom: string;
    titre: string;
    accroche: string;
    localisation: string;
    email: string;
    linkedin: string;
    github: string;
  };
  projets: { slug: string; titre: string; annee: number; contexte: string; enCours?: boolean }[];
  competences: { groupe: string; noms: string[] }[];
}

/** Un morceau de ligne : du texte, éventuellement un lien, éventuellement un style. */
export interface Segment {
  texte: string;
  lien?: string;
  style?: 'accent' | 'doux' | 'erreur';
}
export type Ligne = Segment[];

export interface Reponse {
  lignes: Ligne[];
  /** Vider l'écran (commande `clear`). */
  effacer?: boolean;
  /** Fermer le terminal (commande `exit`). */
  fermer?: boolean;
  /** Aller sur une page du site. */
  aller?: string;
}

export const COMMANDES = {
  help: 'afficher cette aide',
  about: 'qui je suis',
  projets: 'la liste de mes projets',
  competences: 'mes compétences, par thème',
  contact: 'comment me joindre',
  sokoban: 'jouer au Sokoban',
  clear: 'effacer l’écran',
  exit: 'fermer le terminal',
} as const;

export type Commande = keyof typeof COMMANDES;

const texte = (t: string, style?: Segment['style']): Segment => (style ? { texte: t, style } : { texte: t });
const ligne = (...segments: (Segment | string)[]): Ligne =>
  segments.map((s) => (typeof s === 'string' ? texte(s) : s));

/** Minuscules et sans accents : « Compétences » et « competences » sont la même commande. */
export function normaliser(saisie: string): string {
  return saisie.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function executer(saisie: string, d: DonneesTerminal): Reponse {
  const [mot = '', ...reste] = normaliser(saisie).split(/\s+/);
  if (mot === '') return { lignes: [] };
  if (reste.length > 0 && mot in COMMANDES) {
    return { lignes: [ligne(texte(`« ${mot} » ne prend pas d’argument.`, 'erreur'))] };
  }

  switch (mot as Commande) {
    case 'help':
      return {
        lignes: [
          ligne('Commandes disponibles :'),
          ...Object.entries(COMMANDES).map(([nom, aide]) => ligne(texte(nom.padEnd(12), 'accent'), aide)),
          ligne(texte('Astuce : Tab complète une commande, ↑ et ↓ rappellent les précédentes.', 'doux')),
        ],
      };

    case 'about':
      return {
        lignes: [
          ligne(texte(d.profil.nom, 'accent'), ` — ${d.profil.titre}`),
          ligne(d.profil.accroche),
          ligne(texte(d.profil.localisation, 'doux')),
        ],
      };

    case 'projets':
      return {
        lignes: [
          ...d.projets.map((p, i) =>
            ligne(
              texte(`Niveau ${i + 1}`.padEnd(10), 'accent'),
              { texte: p.titre, lien: `/#projet-${p.slug}` },
              texte(` (${p.annee}, ${p.contexte.toLowerCase()}${p.enCours ? ', en cours' : ''})`, 'doux'),
            ),
          ),
          ligne(texte('Cliquez sur un projet pour aller à sa carte.', 'doux')),
        ],
      };

    case 'competences':
      return {
        lignes: d.competences.map((g) => ligne(texte(`${g.groupe} : `, 'accent'), g.noms.join(', '))),
      };

    case 'contact':
      return {
        lignes: [
          ligne(texte('E-mail    ', 'accent'), { texte: d.profil.email, lien: `mailto:${d.profil.email}` }),
          ligne(texte('LinkedIn  ', 'accent'), { texte: d.profil.linkedin, lien: d.profil.linkedin }),
          ligne(texte('GitHub    ', 'accent'), { texte: d.profil.github, lien: d.profil.github }),
        ],
      };

    case 'sokoban':
      return { lignes: [ligne('Chargement du Sokoban…')], aller: '/jeux/sokoban/' };

    case 'clear':
      return { lignes: [], effacer: true };

    case 'exit':
      return { lignes: [], fermer: true };

    default:
      return {
        lignes: [ligne(texte(`Commande inconnue : « ${saisie.trim()} ». Tapez help pour la liste.`, 'erreur'))],
      };
  }
}

/** Complétion avec Tab : la seule commande qui commence par la saisie, sinon la saisie telle quelle. */
export function completer(saisie: string): string {
  const debut = normaliser(saisie);
  if (debut === '') return saisie;
  const possibles = Object.keys(COMMANDES).filter((c) => c.startsWith(debut));
  return possibles.length === 1 ? possibles[0]! : saisie;
}
