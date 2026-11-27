// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shahinshakuri.github.io',
  integrations: [
    sitemap({
      // La page 404 n'a rien à faire dans le plan du site.
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
