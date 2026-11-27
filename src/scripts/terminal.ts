// Affichage du mode terminal : ouvre la boîte de dialogue, lit les commandes, écrit les réponses.
// La logique des commandes est dans src/lib/terminal.ts (testée sans navigateur).

import { completer, executer, type DonneesTerminal, type Ligne } from '../lib/terminal';
import { estSobre } from './preferences';

/** Touches qui ouvrent le terminal : ² (clavier français), ` et ~ (clavier anglais). */
const TOUCHES = new Set(['²', '`', '~']);

function estChampDeSaisie(cible: EventTarget | null): boolean {
  if (!(cible instanceof HTMLElement)) return false;
  return cible.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(cible.tagName);
}

export function brancherTerminal(): void {
  const dialogue = document.querySelector<HTMLDialogElement>('[data-terminal]');
  const sortie = dialogue?.querySelector<HTMLElement>('[data-terminal-sortie]');
  const formulaire = dialogue?.querySelector<HTMLFormElement>('[data-terminal-formulaire]');
  const champ = dialogue?.querySelector<HTMLInputElement>('[data-terminal-champ]');
  const json = document.getElementById('donnees-terminal');
  if (!dialogue || !sortie || !formulaire || !champ || !json) return;

  const donnees = JSON.parse(json.textContent ?? '{}') as DonneesTerminal;
  const historique: string[] = [];
  let position = 0; // position dans l'historique pendant qu'on navigue avec ↑ et ↓
  let dejaOuvert = false;

  function ecrire(lignes: Ligne[], classe?: string): void {
    for (const segments of lignes) {
      const p = document.createElement('p');
      p.className = classe ? `terminal__ligne ${classe}` : 'terminal__ligne';
      for (const s of segments) {
        const el = s.lien ? document.createElement('a') : document.createElement('span');
        el.textContent = s.texte; // textContent : jamais de HTML injecté
        if (el instanceof HTMLAnchorElement && s.lien) el.href = s.lien;
        if (s.style) el.className = `terminal__${s.style}`;
        p.append(el);
      }
      sortie!.append(p);
    }
    sortie!.scrollTop = sortie!.scrollHeight;
  }

  function accueil(): void {
    ecrire([
      [{ texte: `Bienvenue dans le labo de ${donnees.profil.nom}.` }],
      [{ texte: 'Tapez ' }, { texte: 'help', style: 'accent' }, { texte: ' puis Entrée pour voir les commandes.' }],
    ]);
  }

  function ouvrir(): void {
    if (dialogue!.open || estSobre()) return;
    dialogue!.showModal();
    if (!dejaOuvert) {
      accueil();
      dejaOuvert = true;
    }
    champ!.focus();
  }

  // Le bouton >_ de l'en-tête et tout autre bouton [data-ouvrir-terminal]
  document.querySelectorAll<HTMLButtonElement>('[data-ouvrir-terminal]').forEach((bouton) => {
    bouton.addEventListener('click', ouvrir);
  });

  document.addEventListener('keydown', (e) => {
    if (!TOUCHES.has(e.key) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (dialogue.open) {
      // Même touche dans le terminal = fermer (seulement si le champ est vide, pour pouvoir taper ~)
      if (champ.value === '') {
        e.preventDefault();
        dialogue.close();
      }
      return;
    }
    if (estChampDeSaisie(e.target) || estSobre()) return;
    e.preventDefault();
    ouvrir();
  });

  // Le mode sobre ferme le terminal s'il est ouvert.
  document.addEventListener('labo:sobre', () => {
    if (estSobre() && dialogue.open) dialogue.close();
  });

  dialogue.querySelector('[data-terminal-fermer]')?.addEventListener('click', () => dialogue.close());

  // Clic sur le fond assombri (hors de la fenêtre) = fermer
  dialogue.addEventListener('click', (e) => {
    if (e.target === dialogue) dialogue.close();
  });

  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    const saisie = champ.value;
    champ.value = '';
    if (saisie.trim() !== '') {
      historique.push(saisie);
    }
    position = historique.length;

    ecrire([[{ texte: '> ', style: 'doux' }, { texte: saisie }]], 'terminal__commande');
    const reponse = executer(saisie, donnees);
    if (reponse.effacer) sortie.replaceChildren();
    ecrire(reponse.lignes);
    if (reponse.fermer) dialogue.close();
    if (reponse.aller) window.location.href = reponse.aller;
  });

  champ.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && position > 0) {
      e.preventDefault();
      position -= 1;
      champ.value = historique[position] ?? '';
    } else if (e.key === 'ArrowDown' && position < historique.length) {
      e.preventDefault();
      position += 1;
      champ.value = historique[position] ?? '';
    } else if (e.key === 'Tab' && champ.value.trim() !== '') {
      // Tab complète ; avec un champ vide, Tab garde son rôle normal (aller au bouton suivant).
      const complete = completer(champ.value);
      if (complete !== champ.value) {
        e.preventDefault();
        champ.value = complete;
      }
    }
  });

  // Un lien de la sortie vers une ancre de la page d'accueil : fermer le terminal pour voir la carte.
  sortie.addEventListener('click', (e) => {
    if (e.target instanceof HTMLAnchorElement) dialogue.close();
  });
}
