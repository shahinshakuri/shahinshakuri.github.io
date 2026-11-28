// Bouton « Copier l'adresse » : copie le texte de `data-copier` et l'annonce aux lecteurs d'écran.

async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    // Navigateur ancien ou permission refusée : on ne peut pas copier automatiquement.
    return false;
  }
}

export function brancherCopie(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-copier]').forEach((bouton) => {
    const retour = bouton.closest('.contact')?.querySelector<HTMLElement>('[data-retour-copie]');
    let minuteur: number | undefined;
    bouton.addEventListener('click', async () => {
      const texte = bouton.dataset.copier ?? '';
      const ok = await copier(texte);
      if (!retour) return;
      retour.textContent = ok ? 'Adresse copiée.' : `Copie impossible : l’adresse est ${texte}`;
      window.clearTimeout(minuteur);
      minuteur = window.setTimeout(() => (retour.textContent = ''), 4000);
    });
  });
}
