import { defineConfig } from 'vitest/config';

// Vitest ne lance que les tests unitaires de src/.
// Les tests dans un vrai navigateur (tests/*.spec.ts) sont lancés par Playwright : `npm run test:e2e`.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
