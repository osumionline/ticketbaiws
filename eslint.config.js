import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['lib/**', 'coverage/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts', 'vitest.config.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
);
