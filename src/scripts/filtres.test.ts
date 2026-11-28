import { describe, expect, it } from 'vitest';
import { phraseResultat, projetsVisibles } from './filtres';
import { projets, technologies } from '../data/projets';

describe('projetsVisibles', () => {
  const technos = [['Java', 'Gradle'], ['Python'], ['Java']];

  it('affiche tout sans filtre', () => {
    expect(projetsVisibles(technos, '')).toEqual([true, true, true]);
  });

  it('garde seulement les projets qui utilisent la technologie', () => {
    expect(projetsVisibles(technos, 'Java')).toEqual([true, false, true]);
  });
});

describe('phraseResultat', () => {
  it('accorde au singulier et au pluriel', () => {
    expect(phraseResultat(1, 'Python')).toBe('1 projet utilise Python.');
    expect(phraseResultat(2, 'Java')).toBe('2 projets utilisent Java.');
  });

  it('ne dit rien sans filtre', () => {
    expect(phraseResultat(6, '')).toBe('');
  });
});

describe('données des projets', () => {
  it('chaque technologie proposée en filtre montre au moins un projet', () => {
    for (const t of technologies) {
      const visibles = projetsVisibles(
        projets.map((p) => p.technologies),
        t,
      ).filter(Boolean);
      expect(visibles.length, t).toBeGreaterThan(0);
    }
  });

  it('les slugs des projets sont uniques (ils servent d’ancres)', () => {
    const slugs = projets.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
