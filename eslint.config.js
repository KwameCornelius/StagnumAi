import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

/**
 * Flat-config ESLint setup. Intentionally conservative for a first pass — we
 * want CI to go green today, then tighten rules in follow-up PRs as we adopt
 * `tsconfig` strict mode and the codebase is cleaner.
 *
 * What it catches now:
 *   - Real syntactic and obviously-broken-runtime patterns (the eslint:recommended set)
 *   - TypeScript-aware issues (typescript-eslint recommended)
 *   - React Hooks rules (rules of hooks, exhaustive-deps as warn)
 *
 * What it deliberately doesn't enforce yet (warn instead of error, or off):
 *   - `no-explicit-any` — the generated Supabase types and Dashboard's `as unknown as` casts will need cleanup
 *   - `no-unused-vars` for vars prefixed `_` — common React event/setter pattern
 */
export default tseslint.config(
  {
    ignores: [
      'dist',
      'build',
      'node_modules',
      'coverage',
      '.claude',
      '.vscode',
      'supabase',
      'src/types/supabase.ts', // generated
    ],
  },

  // App + library source — typed lint
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
          // Hooks are idiomatically co-exported with their Provider in
          // React context files. Listing them here keeps fast refresh
          // honest without yelling at the canonical pattern.
          allowExportNames: ['useAuth', 'useSidebar'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Config files run in Node, not the browser
  {
    files: ['*.config.{js,ts}', 'vite.config.ts', 'eslint.config.js', 'vitest.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Test files — looser rules, jest/vitest globals
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
);
