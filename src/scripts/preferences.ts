// Thème clair/sombre et « Mode sobre ».
// L'état initial est posé dans <head> (Base.astro) avant l'affichage ; ce fichier gère les boutons.

type Theme = 'dark' | 'light';

const CLE_THEME = 'labo:theme';
const CLE_SOBRE = 'labo:sobre';
const racine = document.documentElement;
const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');

function lire(cle: string): string | null {
  try {
    return localStorage.getItem(cle);
  } catch {
    return null;
  }
}

function ecrire(cle: string, valeur: string): void {
  try {
    localStorage.setItem(cle, valeur);
  } catch {
    /* navigation privée : le choix ne sera simplement pas mémorisé */
  }
}

/** Vrai si le mode sobre est actif. Les modules ludiques (fractale…) s'en servent. */
export function estSobre(): boolean {
  return racine.dataset.sobre === 'true';
}

// ---------- Thème ----------

const boutonTheme = document.querySelector<HTMLButtonElement>('[data-action="theme"]');

function appliquerTheme(theme: Theme): void {
  racine.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#0d1117' : '#f7f8f5');
  if (boutonTheme) {
    const libelle = theme === 'dark' ? boutonTheme.dataset.labelClair : boutonTheme.dataset.labelSombre;
    if (libelle) boutonTheme.setAttribute('aria-label', libelle);
  }
}

boutonTheme?.addEventListener('click', () => {
  const suivant: Theme = racine.dataset.theme === 'light' ? 'dark' : 'light';
  appliquerTheme(suivant);
  ecrire(CLE_THEME, suivant);
});

appliquerTheme(racine.dataset.theme === 'light' ? 'light' : 'dark');

// ---------- Mode sobre ----------

const boutonSobre = document.querySelector<HTMLButtonElement>('[data-action="sobre"]');

function appliquerSobre(actif: boolean): void {
  racine.dataset.sobre = actif ? 'true' : 'false';
  boutonSobre?.setAttribute('aria-checked', String(actif));
  // Les modules ludiques (phase 3) écoutent cet événement pour se mettre en pause.
  document.dispatchEvent(new CustomEvent('labo:sobre', { detail: { actif } }));
}

boutonSobre?.addEventListener('click', () => {
  const actif = !estSobre();
  appliquerSobre(actif);
  ecrire(CLE_SOBRE, actif ? '1' : '0');
});

// Si la personne n'a jamais choisi, on suit le réglage « moins d'animations » du système.
mouvementReduit.addEventListener('change', (e) => {
  if (lire(CLE_SOBRE) === null) appliquerSobre(e.matches);
});

appliquerSobre(estSobre());
