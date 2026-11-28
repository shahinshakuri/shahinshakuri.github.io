// Niveaux du mini-Sokoban (créés pour ce site). Notation : voir src/lib/sokoban.ts.
// Les tests (src/lib/sokoban.test.ts) vérifient que chaque niveau a une solution.

export interface NiveauSokoban {
  nom: string;
  plan: string;
}

export const niveauxSokoban: NiveauSokoban[] = [
  {
    nom: 'Échauffement',
    plan: `
########
#      #
# @$ . #
#  $ . #
#      #
########`,
  },
  {
    nom: 'Les trois couloirs',
    plan: `
#########
#   #   #
# $   $ #
#  #.#  #
# .   . #
#  #$#  #
#   @   #
#########`,
  },
  {
    nom: 'Coincé au milieu',
    plan: `
#######
#. $  #
#  #  #
# $@$ #
#  #  #
#.   .#
#######`,
  },
];
