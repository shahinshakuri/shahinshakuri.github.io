// Profil de Shahin — seule source : section 4 de PORTFOLIO_BRIEF.md.
// Pour modifier un texte du site qui me décrit, c'est ici (pas dans la mise en page).

export interface Profil {
  nom: string;
  initiales: string;
  titre: string;
  localisation: string;
  accroche: string;
  email: string;
  liens: {
    linkedin: string;
    github: string;
  };
  /**
   * Lien vers le CV. `null` = aucun CV affiché nulle part sur le site.
   * Pour l'ajouter plus tard : déposer le fichier dans `public/` et mettre son chemin ici.
   */
  cvUrl: string | null;
}

export const profil: Profil = {
  nom: 'Shahin Shakuri',
  initiales: 'SS',
  titre: 'Profil informatique & données',
  localisation: 'Île-de-France',
  accroche:
    'Bac +3 en informatique. Je rends les données fiables et je construis des outils web utiles, ' +
    'de l’import de données à l’Université de Lille jusqu’à Fransi, mon site d’apprentissage du français.',
  email: 'shahinshakuri0@gmail.com',
  liens: {
    linkedin: 'https://www.linkedin.com/in/shahin-shakuri-423366226/',
    github: 'https://github.com/shahinshakuri',
  },
  cvUrl: null,
};
