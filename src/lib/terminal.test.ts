import { describe, expect, it } from 'vitest';
import { COMMANDES, completer, executer, normaliser, type DonneesTerminal, type Ligne } from './terminal';

// Données fictives : les tests ne dépendent pas du vrai contenu du site.
const donnees: DonneesTerminal = {
  profil: {
    nom: 'Camille Test',
    titre: 'Titre de test',
    accroche: 'Accroche de test.',
    localisation: 'Quelque part',
    email: 'camille@example.com',
    linkedin: 'https://example.com/linkedin',
    github: 'https://example.com/github',
  },
  projets: [
    { slug: 'alpha', titre: 'Alpha', annee: 2026, contexte: 'Projet personnel', enCours: true },
    { slug: 'beta', titre: 'Bêta', annee: 2021, contexte: 'École' },
  ],
  competences: [
    { groupe: 'Données', noms: ['SQL', 'Elasticsearch'] },
    { groupe: 'Langues', noms: ['Français'] },
  ],
};

const enTexte = (lignes: Ligne[]) => lignes.map((l) => l.map((s) => s.texte).join(''));

describe('normaliser', () => {
  it('ignore les majuscules, les accents et les espaces autour', () => {
    expect(normaliser('  Compétences ')).toBe('competences');
  });
});

describe('executer', () => {
  it('help liste toutes les commandes demandées par le brief', () => {
    const texte = enTexte(executer('help', donnees).lignes).join('\n');
    for (const c of ['help', 'about', 'projets', 'competences', 'contact', 'sokoban', 'clear']) {
      expect(texte).toContain(c);
    }
    expect(Object.keys(COMMANDES)).toContain('exit');
  });

  it('about affiche le profil', () => {
    const texte = enTexte(executer('about', donnees).lignes);
    expect(texte[0]).toBe('Camille Test — Titre de test');
    expect(texte).toContain('Accroche de test.');
  });

  it('projets numérote les niveaux et donne un lien vers chaque carte', () => {
    const { lignes } = executer('projets', donnees);
    expect(enTexte(lignes)[0]).toContain('Niveau 1');
    expect(enTexte(lignes)[0]).toContain('en cours');
    expect(lignes[1]?.find((s) => s.lien)?.lien).toBe('/#projet-beta');
  });

  it('competences affiche un groupe par ligne', () => {
    expect(enTexte(executer('competences', donnees).lignes)).toEqual([
      'Données : SQL, Elasticsearch',
      'Langues : Français',
    ]);
  });

  it('contact donne un lien mailto et les liens des réseaux', () => {
    const liens = executer('contact', donnees).lignes.flatMap((l) => l.filter((s) => s.lien).map((s) => s.lien));
    expect(liens).toEqual(['mailto:camille@example.com', 'https://example.com/linkedin', 'https://example.com/github']);
  });

  it('sokoban, clear et exit déclenchent une action', () => {
    expect(executer('sokoban', donnees).aller).toBe('/jeux/sokoban/');
    expect(executer('clear', donnees).effacer).toBe(true);
    expect(executer('EXIT', donnees).fermer).toBe(true);
  });

  it('accepte « compétences » avec accent et majuscule', () => {
    expect(executer('Compétences', donnees).lignes).toHaveLength(2);
  });

  it('signale une commande inconnue ou un argument en trop', () => {
    const inconnue = executer('sudo rm', donnees).lignes[0]!;
    expect(inconnue[0]?.style).toBe('erreur');
    expect(inconnue[0]?.texte).toContain('sudo rm');
    expect(executer('help moi', donnees).lignes[0]?.[0]?.texte).toContain('ne prend pas d’argument');
  });

  it('ne répond rien à une ligne vide', () => {
    expect(executer('   ', donnees)).toEqual({ lignes: [] });
  });
});

describe('completer', () => {
  it('complète quand une seule commande correspond', () => {
    expect(completer('pro')).toBe('projets');
    expect(completer('Comp')).toBe('competences');
    expect(completer('s')).toBe('sokoban');
  });

  it('ne change rien quand plusieurs commandes ou aucune ne correspondent', () => {
    expect(completer('c')).toBe('c'); // competences, contact, clear
    expect(completer('xyz')).toBe('xyz');
    expect(completer('')).toBe('');
  });
});
