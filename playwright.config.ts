import { defineConfig, devices } from '@playwright/test';

// Tests dans un vrai navigateur, sur le site déjà construit (dist/).
// Lancement : `npm run build` puis `npm run test:e2e`.
const PORT = 4322; // différent de 4321 pour ne pas gêner un `npm run preview` déjà ouvert

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
