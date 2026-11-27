// Interface du mini-Sokoban : affichage du plateau, clavier, boutons tactiles.
// La logique (règles, victoire) est dans src/lib/sokoban.ts.

import { niveauxSokoban } from '../data/niveaux-sokoban';
import {
  caissesPlacees,
  cases,
  chargerNiveau,
  deplacer,
  directionDeTouche,
  estGagne,
  type Direction,
  type Etat,
} from '../lib/sokoban';

const pluriel = (n: number, mot: string) => `${n} ${mot}${n > 1 ? 's' : ''}`;

export function brancherSokoban(racine: HTMLElement): void {
  const plateau = racine.querySelector<HTMLElement>('[data-plateau]');
  const choix = racine.querySelector<HTMLSelectElement>('[data-choix-niveau]');
  const compteur = racine.querySelector<HTMLElement>('[data-compteur]');
  const annonce = racine.querySelector<HTMLElement>('[data-annonce]');
  const victoire = racine.querySelector<HTMLElement>('[data-victoire]');
  const texteVictoire = racine.querySelector<HTMLElement>('[data-texte-victoire]');
  const boutonSuivant = racine.querySelector<HTMLButtonElement>('[data-suivant]');
  if (!plateau || !choix || !compteur || !annonce || !victoire || !texteVictoire || !boutonSuivant) return;

  let numero = 0;
  let etat: Etat = chargerNiveau(niveauxSokoban[0]!.plan);
  let historique: Etat[] = [];
  let pieces: HTMLElement | null = null;

  function annoncer(texte: string): void {
    annonce!.textContent = texte;
  }

  function resumeCaisses(): string {
    return `Caisses placées : ${caissesPlacees(etat)} sur ${etat.caisses.size}`;
  }

  /** Dessine le décor fixe (murs, sol, cibles) d'un niveau. */
  function dessinerDecor(): void {
    const grille = cases(etat);
    plateau!.style.setProperty('--colonnes', String(etat.plateau.largeur));
    plateau!.style.setProperty('--lignes', String(etat.plateau.hauteur));
    plateau!.replaceChildren();
    grille.forEach((ligne, y) =>
      ligne.forEach((type, x) => {
        if (type === 'vide') return;
        const c = document.createElement('div');
        c.className = `sokoban__case sokoban__case--${type}`;
        c.style.gridArea = `${y + 1} / ${x + 1}`;
        plateau!.append(c);
      }),
    );
    pieces = document.createElement('div');
    pieces.className = 'sokoban__pieces';
    plateau!.append(pieces);
  }

  /** Dessine ce qui bouge : caisses et joueur. */
  function dessinerPieces(): void {
    if (!pieces) return;
    const elements: HTMLElement[] = [];
    for (const k of etat.caisses) {
      const [x, y] = k.split(',').map(Number) as [number, number];
      const caisse = document.createElement('div');
      caisse.className = 'sokoban__caisse';
      if (etat.plateau.cibles.has(k)) caisse.classList.add('sokoban__caisse--placee');
      caisse.style.gridArea = `${y + 1} / ${x + 1}`;
      elements.push(caisse);
    }
    const joueur = document.createElement('div');
    joueur.className = 'sokoban__joueur';
    joueur.style.gridArea = `${etat.joueur.y + 1} / ${etat.joueur.x + 1}`;
    elements.push(joueur);
    pieces.replaceChildren(...elements);

    // Deux morceaux insécables : sur petit écran, la ligne se coupe au « · » et pas au milieu.
    const morceau = (texte: string) => Object.assign(document.createElement('span'), { textContent: texte });
    compteur!.replaceChildren(morceau(pluriel(etat.deplacements, 'déplacement')), ' · ', morceau(resumeCaisses()));
  }

  function chargerNumero(n: number, annonceNiveau = true): void {
    numero = n;
    etat = chargerNiveau(niveauxSokoban[n]!.plan);
    historique = [];
    choix!.value = String(n);
    victoire!.hidden = true;
    dessinerDecor();
    dessinerPieces();
    if (annonceNiveau) {
      annoncer(`Niveau ${n + 1} : ${niveauxSokoban[n]!.nom}. ${resumeCaisses()}.`);
    }
  }

  function jouer(direction: Direction): void {
    if (estGagne(etat)) return;
    const avant = caissesPlacees(etat);
    const suivant = deplacer(etat, direction);
    if (suivant === etat) return; // mur ou caisse bloquée
    historique.push(etat);
    etat = suivant;
    dessinerPieces();

    if (estGagne(etat)) {
      const dernier = numero === niveauxSokoban.length - 1;
      texteVictoire!.textContent = dernier
        ? `Bravo, les ${niveauxSokoban.length} niveaux sont terminés ! (dernier niveau en ${pluriel(etat.deplacements, 'déplacement')})`
        : `Niveau réussi en ${pluriel(etat.deplacements, 'déplacement')} !`;
      boutonSuivant!.textContent = dernier ? 'Rejouer depuis le niveau 1' : 'Niveau suivant';
      victoire!.hidden = false;
      annoncer(texteVictoire!.textContent);
      boutonSuivant!.focus();
    } else if (caissesPlacees(etat) !== avant) {
      annoncer(`${resumeCaisses()}.`);
    }
  }

  function annuler(): void {
    const precedent = historique.pop();
    if (!precedent) return;
    etat = precedent;
    victoire!.hidden = true;
    dessinerPieces();
    annoncer(`Coup annulé. ${resumeCaisses()}.`);
  }

  function recommencer(): void {
    chargerNumero(numero, false);
    annoncer(`Niveau ${numero + 1} recommencé.`);
  }

  // ---- Clavier (quand le plateau a le focus) ----
  plateau.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const direction = directionDeTouche(e.key);
    if (direction) {
      e.preventDefault();
      jouer(direction);
    } else if (e.key === 'u' || e.key === 'U' || e.key === 'Backspace') {
      e.preventDefault();
      annuler();
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      recommencer();
    }
  });
  plateau.addEventListener('pointerdown', () => plateau.focus());

  // ---- Boutons ----
  racine.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach((b) =>
    b.addEventListener('click', () => jouer(b.dataset.direction as Direction)),
  );
  racine.querySelector('[data-annuler]')?.addEventListener('click', annuler);
  racine.querySelector('[data-recommencer]')?.addEventListener('click', recommencer);
  choix.addEventListener('change', () => chargerNumero(Number(choix.value)));
  boutonSuivant.addEventListener('click', () => {
    chargerNumero((numero + 1) % niveauxSokoban.length);
    plateau.focus();
  });

  // Repère pour les tests automatiques : le jeu est prêt.
  racine.dataset.pret = 'true';
  chargerNumero(0, false);
}

