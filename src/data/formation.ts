// Formation — seule source : section 4 de PORTFOLIO_BRIEF.md
// (+ établissement de la licence professionnelle précisé par Shahin : IUT de Lens).

export interface Diplome {
  titre: string;
  etablissement?: string;
  detail?: string;
}

export const formation: Diplome[] = [
  {
    titre: 'Licence professionnelle en informatique (Bac +3)',
    etablissement: 'IUT de Lens',
    detail: 'Obtenue en 2024, en alternance.',
  },
  {
    titre: 'BUT Informatique',
    etablissement: 'IUT de Lens',
  },
  {
    titre: 'Baccalauréat scientifique (bac S)',
  },
];
