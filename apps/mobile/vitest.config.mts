import { defineConfig } from 'vitest/config';

// Vitest covers pure TypeScript helpers in src/lib. Component tests
// (jest-expo + Testing Library) arrive in Phase 8.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
