// Contrôles de qualité dans un vrai navigateur : accessibilité (axe), mobile, clavier, sans JavaScript.
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  { nom: 'accueil', url: '/' },
  { nom: 'fransi', url: '/projets/fransi/' },
  { nom: 'sokoban', url: '/jeux/sokoban/' },
  { nom: '404', url: '/page-qui-n-existe-pas/' },
];

/** Choisit le thème et le mode sobre avant le chargement de la page. */
async function preparer(page: Page, theme: 'dark' | 'light', sobre: boolean) {
  await page.addInitScript(
    ([t, s]) => {
      localStorage.setItem('labo:theme', t);
      localStorage.setItem('labo:sobre', s);
    },
    [theme, sobre ? '1' : '0'] as const,
  );
}

async function analyser(page: Page) {
  const resultat = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  // Message lisible en cas d'échec : règle, gravité, éléments concernés.
  const resume = resultat.violations.map(
    (v) => `${v.id} (${v.impact}) : ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
  );
  expect(resume, resume.join('\n')).toEqual([]);
}

test.describe('accessibilité (axe)', () => {
  for (const { nom, url } of PAGES) {
    for (const theme of ['dark', 'light'] as const) {
      for (const sobre of [true, false]) {
        test(`${nom} · ${theme === 'dark' ? 'sombre' : 'clair'} · ${sobre ? 'sobre' : 'ludique'}`, async ({ page }) => {
          await preparer(page, theme, sobre);
          await page.goto(url);
          await analyser(page);
        });
      }
    }
  }

  test('terminal ouvert', async ({ page }) => {
    await preparer(page, 'dark', false);
    await page.goto('/');
    await page.getByRole('button', { name: 'Ouvrir le terminal' }).click();
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await analyser(page);
  });

  test('filtre actif', async ({ page }) => {
    await preparer(page, 'light', false);
    await page.goto('/');
    await page.getByRole('button', { name: 'Python', exact: true }).click();
    await analyser(page);
  });
});

test.describe('mobile 360 px', () => {
  test.use({ viewport: { width: 360, height: 780 } });
  for (const { nom, url } of PAGES) {
    test(`${nom} : pas de défilement horizontal`, async ({ page }) => {
      await preparer(page, 'dark', false);
      await page.goto(url);
      const deborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(deborde).toBe(false);
    });
  }
});

test.describe('clavier', () => {
  test('le lien d’évitement apparaît en premier et mène au contenu', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const lien = page.getByRole('link', { name: /aller au contenu/i });
    await expect(lien).toBeFocused();
    await expect(lien).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contenu')).toBeFocused();
  });

  test('chaque élément de l’en-tête a un contour de focus visible', async ({ page }) => {
    await preparer(page, 'dark', false);
    await page.goto('/');
    const elements = page.locator('header a, header button');
    const nombre = await elements.count();
    for (let i = 0; i < nombre; i++) {
      const el = elements.nth(i);
      if (!(await el.isVisible())) continue;
      await el.focus();
      const visible = await el.evaluate((e) => {
        const s = getComputedStyle(e);
        return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
      });
      expect(visible, await el.evaluate((e) => e.outerHTML.slice(0, 80))).toBe(true);
    }
  });

  test('le Sokoban se joue entièrement au clavier', async ({ page }) => {
    await page.goto('/jeux/sokoban/');
    await page.getByRole('application').focus();
    for (const k of ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowRight']) {
      await page.keyboard.press(k);
    }
    await expect(page.getByText('Niveau réussi en 7 déplacements !').first()).toBeVisible();
  });
});

test.describe('sans JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('tout le contenu essentiel est présent', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    for (const titre of ['Expérience', 'Projets', 'Compétences', 'Formation', 'Contact']) {
      await expect(page.getByRole('heading', { level: 2, name: titre })).toBeVisible();
    }
    await expect(page.locator('[data-niveaux] > li')).toHaveCount(6);
    await expect(page.getByRole('link', { name: /shahinshakuri0@gmail\.com/ }).first()).toBeVisible();
    // Les boutons qui ont besoin de JavaScript sont cachés
    await expect(page.getByRole('button', { name: 'Ouvrir le terminal' })).toBeHidden();
  });
});
