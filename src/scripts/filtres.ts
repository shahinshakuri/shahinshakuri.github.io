// Filtres des projets par technologie (un seul filtre actif à la fois).
// Les numéros de niveau ne changent pas : ils suivent l'ordre complet des projets.

export function projetsVisibles(technosParProjet: string[][], filtre: string): boolean[] {
  return technosParProjet.map((technos) => filtre === '' || technos.includes(filtre));
}

export function phraseResultat(nombre: number, filtre: string): string {
  if (filtre === '') return '';
  const projets = nombre > 1 ? `${nombre} projets utilisent` : `${nombre} projet utilise`;
  return `${projets} ${filtre}.`;
}

export function brancherFiltres(): void {
  const zone = document.querySelector<HTMLElement>('[data-filtres]');
  const liste = document.querySelector<HTMLElement>('[data-niveaux]');
  if (!zone || !liste) return;
  const boutons = [...zone.querySelectorAll<HTMLButtonElement>('[data-filtre]')];
  const resultat = zone.querySelector<HTMLElement>('[data-filtres-resultat]');
  const elements = [...liste.querySelectorAll<HTMLElement>(':scope > li')];
  const technos = elements.map((li) => JSON.parse(li.dataset.technos ?? '[]') as string[]);

  let actif = '';

  function appliquer(filtre: string): void {
    actif = filtre;
    const visibles = projetsVisibles(technos, filtre);
    elements.forEach((li, i) => (li.hidden = !visibles[i]));
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filtre === filtre)));
    if (resultat) resultat.textContent = phraseResultat(visibles.filter(Boolean).length, filtre);
  }

  // Un 2e clic sur le filtre actif revient à « Tous ».
  boutons.forEach((b) =>
    b.addEventListener('click', () => {
      const filtre = b.dataset.filtre ?? '';
      appliquer(filtre === actif ? '' : filtre);
    }),
  );
}
