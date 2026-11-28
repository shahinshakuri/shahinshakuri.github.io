// Textes de l'interface (boutons, menu, libellés).
// Une version anglaise (`en.ts`, pages sous `/en/`) pourra être ajoutée en phase 6
// avec exactement les mêmes clés.

export const ui = {
  lienEvitement: 'Aller au contenu',
  menuPrincipal: 'Menu principal',
  sections: {
    accueil: 'Accueil',
    experience: 'Expérience',
    projets: 'Projets',
    competences: 'Compétences',
    formation: 'Formation',
    contact: 'Contact',
  },
  theme: {
    versClair: 'Passer au thème clair',
    versSombre: 'Passer au thème sombre',
  },
  sobre: {
    libelle: 'Mode sobre',
    aide: 'Coupe les animations et affiche une version épurée',
  },
  piedDePage: {
    fait: 'Site fait main avec Astro.',
  },
} as const;

export type Section = keyof typeof ui.sections;

/** Sections de la page d'accueil, dans l'ordre du menu. Chaque id existe dans index.astro. */
export const sectionsMenu: Section[] = ['experience', 'projets', 'competences', 'formation', 'contact'];
