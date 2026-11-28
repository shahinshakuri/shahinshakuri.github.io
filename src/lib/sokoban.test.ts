import { describe, expect, it } from 'vitest';
import { niveauxSokoban } from '../data/niveaux-sokoban';
import {
  caissesPlacees,
  cases,
  chargerNiveau,
  cle,
  deplacer,
  directionDeTouche,
  estGagne,
  type Direction,
  type Etat,
} from './sokoban';

const DIRECTIONS: Direction[] = ['haut', 'bas', 'gauche', 'droite'];

/** Recherche en largeur : renvoie une suite de coups gagnante, ou null s'il n'y en a pas. */
function resoudre(depart: Etat, limite = 200_000): Direction[] | null {
  const empreinte = (e: Etat) => `${cle(e.joueur)}|${[...e.caisses].sort().join(';')}`;
  const vus = new Set([empreinte(depart)]);
  let file: { etat: Etat; coups: Direction[] }[] = [{ etat: depart, coups: [] }];
  while (file.length && vus.size < limite) {
    const suivante: typeof file = [];
    for (const { etat, coups } of file) {
      if (estGagne(etat)) return coups;
      for (const d of DIRECTIONS) {
        const e = deplacer(etat, d);
        const k = empreinte(e);
        if (e === etat || vus.has(k)) continue;
        vus.add(k);
        suivante.push({ etat: e, coups: [...coups, d] });
      }
    }
    file = suivante;
  }
  return null;
}

describe('chargerNiveau', () => {
  it('lit le joueur, les caisses, les cibles et les murs', () => {
    const e = chargerNiveau('#####\n#@$.#\n#####');
    expect(e.joueur).toEqual({ x: 1, y: 1 });
    expect([...e.caisses]).toEqual(['2,1']);
    expect([...e.plateau.cibles]).toEqual(['3,1']);
    expect(e.plateau.murs.size).toBe(12);
    expect(e.plateau.largeur).toBe(5);
    expect(e.plateau.hauteur).toBe(3);
  });

  it('comprend les caisses et le joueur posés sur une cible', () => {
    const e = chargerNiveau('#####\n#+*$#\n#   #\n#####');
    expect(e.plateau.cibles).toEqual(new Set(['1,1', '2,1']));
    expect(e.caisses).toEqual(new Set(['2,1', '3,1']));
    expect(e.joueur).toEqual({ x: 1, y: 1 });
  });

  it('refuse un niveau sans joueur ou mal équilibré', () => {
    expect(() => chargerNiveau('#$.#')).toThrow(/pas de joueur/);
    expect(() => chargerNiveau('#@$#')).toThrow(/autant de caisses/);
    expect(() => chargerNiveau('#@@$.#')).toThrow(/plusieurs joueurs/);
  });
});

describe('deplacer', () => {
  const depart = chargerNiveau(`
#######
#     #
# @$ .#
#  $ .#
#######`);

  it('avance sur le sol et compte le déplacement', () => {
    const e = deplacer(depart, 'haut');
    expect(e.joueur).toEqual({ x: 2, y: 1 });
    expect(e.deplacements).toBe(1);
    expect(e.poussees).toBe(0);
  });

  it('ne traverse pas les murs', () => {
    const e = deplacer(deplacer(depart, 'haut'), 'haut');
    expect(e.joueur).toEqual({ x: 2, y: 1 });
    expect(e.deplacements).toBe(1);
  });

  it('pousse une caisse si la case derrière est libre', () => {
    const e = deplacer(depart, 'droite');
    expect(e.joueur).toEqual({ x: 3, y: 2 });
    expect(e.caisses.has('4,2')).toBe(true);
    expect(e.caisses.has('3,2')).toBe(false);
    expect(e.poussees).toBe(1);
  });

  it('ne pousse pas une caisse contre un mur ni contre une autre caisse', () => {
    const contreMur = deplacer(deplacer(deplacer(depart, 'droite'), 'droite'), 'droite');
    expect(contreMur.caisses.has('5,2')).toBe(true);
    expect(deplacer(contreMur, 'droite')).toBe(contreMur);

    const auDessus = deplacer(deplacer(depart, 'haut'), 'droite');
    expect(auDessus.joueur).toEqual({ x: 3, y: 1 });
    expect(deplacer(auDessus, 'bas')).toBe(auDessus); // deux caisses l'une derrière l'autre
  });

  it('ne modifie jamais l’état précédent', () => {
    const avant = [...depart.caisses];
    deplacer(depart, 'droite');
    expect([...depart.caisses]).toEqual(avant);
    expect(depart.joueur).toEqual({ x: 2, y: 2 });
  });
});

describe('victoire', () => {
  it('est atteinte quand toutes les caisses sont sur des cibles', () => {
    let e = chargerNiveau('######\n#@$ .#\n######');
    expect(estGagne(e)).toBe(false);
    e = deplacer(e, 'droite');
    expect(caissesPlacees(e)).toBe(0);
    e = deplacer(e, 'droite');
    expect(caissesPlacees(e)).toBe(1);
    expect(estGagne(e)).toBe(true);
  });
});

describe('cases', () => {
  it('ne dessine pas ce qui est hors des murs', () => {
    const grille = cases(chargerNiveau('#####\n#@$.#\n#####'));
    expect(grille[1]).toEqual(['mur', 'sol', 'sol', 'cible', 'mur']);
    const exterieur = cases(chargerNiveau('  ###\n###.#\n#@$ #\n#####'));
    expect(exterieur[0]?.[0]).toBe('vide');
  });
});

describe('directionDeTouche', () => {
  it('accepte les flèches, ZQSD et WASD', () => {
    expect(directionDeTouche('ArrowUp')).toBe('haut');
    expect(directionDeTouche('z')).toBe('haut');
    expect(directionDeTouche('w')).toBe('haut');
    expect(directionDeTouche('q')).toBe('gauche');
    expect(directionDeTouche('a')).toBe('gauche');
    expect(directionDeTouche('S')).toBe('bas');
    expect(directionDeTouche('d')).toBe('droite');
    expect(directionDeTouche('Enter')).toBeNull();
  });
});

describe('niveaux du site', () => {
  it.each(niveauxSokoban.map((n, i) => [i + 1, n.nom, n.plan] as const))(
    'le niveau %i (%s) se charge et a une solution',
    (_, __, plan) => {
      const solution = resoudre(chargerNiveau(plan));
      expect(solution).not.toBeNull();
    },
  );
});
