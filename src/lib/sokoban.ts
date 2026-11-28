// Logique du Sokoban, sans rien d'affiché : elle est testée par src/lib/sokoban.test.ts.
// Les niveaux sont écrits avec la notation habituelle du Sokoban :
//   #  mur          @  joueur        $  caisse        .  cible
//   *  caisse sur une cible          +  joueur sur une cible          (espace) sol

export type Direction = 'haut' | 'bas' | 'gauche' | 'droite';

export interface Position {
  x: number;
  y: number;
}

/** Plateau fixe d'un niveau (ne change pas pendant la partie). */
export interface Plateau {
  largeur: number;
  hauteur: number;
  murs: Set<string>;
  cibles: Set<string>;
}

/** État d'une partie. Il n'est jamais modifié : chaque coup crée un nouvel état. */
export interface Etat {
  plateau: Plateau;
  joueur: Position;
  /** Positions des caisses, sous la forme "x,y". */
  caisses: Set<string>;
  deplacements: number;
  poussees: number;
}

export const VECTEURS: Record<Direction, Position> = {
  haut: { x: 0, y: -1 },
  bas: { x: 0, y: 1 },
  gauche: { x: -1, y: 0 },
  droite: { x: 1, y: 0 },
};

export const cle = (p: Position): string => `${p.x},${p.y}`;

export function chargerNiveau(texte: string): Etat {
  const lignes = texte.replace(/^\n+|\n+$/g, '').split('\n');
  const murs = new Set<string>();
  const cibles = new Set<string>();
  const caisses = new Set<string>();
  let joueur: Position | null = null;

  lignes.forEach((ligne, y) => {
    [...ligne].forEach((car, x) => {
      const k = cle({ x, y });
      if (car === '#') murs.add(k);
      if (car === '.' || car === '*' || car === '+') cibles.add(k);
      if (car === '$' || car === '*') caisses.add(k);
      if (car === '@' || car === '+') {
        if (joueur) throw new Error('Niveau invalide : plusieurs joueurs');
        joueur = { x, y };
      }
    });
  });

  if (!joueur) throw new Error('Niveau invalide : pas de joueur');
  if (caisses.size === 0) throw new Error('Niveau invalide : aucune caisse');
  if (caisses.size !== cibles.size) throw new Error('Niveau invalide : autant de caisses que de cibles attendues');

  return {
    plateau: { largeur: Math.max(...lignes.map((l) => l.length)), hauteur: lignes.length, murs, cibles },
    joueur,
    caisses,
    deplacements: 0,
    poussees: 0,
  };
}

/** Joue un coup. Renvoie le même objet si le coup est impossible (mur, ou caisse bloquée). */
export function deplacer(etat: Etat, direction: Direction): Etat {
  const v = VECTEURS[direction];
  const suivante = { x: etat.joueur.x + v.x, y: etat.joueur.y + v.y };
  const kSuivante = cle(suivante);
  if (etat.plateau.murs.has(kSuivante)) return etat;

  if (!etat.caisses.has(kSuivante)) {
    return { ...etat, joueur: suivante, deplacements: etat.deplacements + 1 };
  }

  // Il y a une caisse : on la pousse si la case derrière est libre.
  const derriere = cle({ x: suivante.x + v.x, y: suivante.y + v.y });
  if (etat.plateau.murs.has(derriere) || etat.caisses.has(derriere)) return etat;
  const caisses = new Set(etat.caisses);
  caisses.delete(kSuivante);
  caisses.add(derriere);
  return {
    ...etat,
    joueur: suivante,
    caisses,
    deplacements: etat.deplacements + 1,
    poussees: etat.poussees + 1,
  };
}

export function caissesPlacees(etat: Etat): number {
  let n = 0;
  for (const k of etat.caisses) if (etat.plateau.cibles.has(k)) n++;
  return n;
}

export const estGagne = (etat: Etat): boolean => caissesPlacees(etat) === etat.caisses.size;

/** Contenu d'une case, pour l'affichage. */
export type Case = 'vide' | 'mur' | 'sol' | 'cible';

/**
 * Cases du plateau, ligne par ligne. Le sol accessible est trouvé depuis la position du joueur :
 * ce qui est hors des murs reste « vide » (rien n'est dessiné).
 */
export function cases(etat: Etat): Case[][] {
  const { largeur, hauteur, murs, cibles } = etat.plateau;
  const interieur = new Set<string>();
  const aVisiter: Position[] = [etat.joueur];
  while (aVisiter.length) {
    const p = aVisiter.pop()!;
    const k = cle(p);
    if (interieur.has(k) || murs.has(k) || p.x < 0 || p.y < 0 || p.x >= largeur || p.y >= hauteur) continue;
    interieur.add(k);
    for (const v of Object.values(VECTEURS)) aVisiter.push({ x: p.x + v.x, y: p.y + v.y });
  }
  return Array.from({ length: hauteur }, (_, y) =>
    Array.from({ length: largeur }, (_, x): Case => {
      const k = cle({ x, y });
      if (murs.has(k)) return 'mur';
      if (cibles.has(k)) return 'cible';
      return interieur.has(k) ? 'sol' : 'vide';
    }),
  );
}

/** Direction correspondant à une touche du clavier (flèches, ZQSD en AZERTY, WASD en QWERTY). */
export function directionDeTouche(touche: string): Direction | null {
  switch (touche) {
    case 'ArrowUp':
    case 'z':
    case 'Z':
    case 'w':
    case 'W':
      return 'haut';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'bas';
    case 'ArrowLeft':
    case 'q':
    case 'Q':
    case 'a':
    case 'A':
      return 'gauche';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'droite';
    default:
      return null;
  }
}
