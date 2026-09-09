import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import checkFile from 'eslint-plugin-check-file';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'build',
    'node_modules',
    '.git',
    '.vscode',
    '.idea',
    '*.log',
    '.DS_Store',
    'coverage',
    '.husky',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
      'check-file': checkFile,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      // File and folder naming conventions
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx,js,jsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/!(__tests__)': 'KEBAB_CASE',
        },
      ],

      // Restrict Flow syntax (use TypeScript instead)
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Identifier[name=/^\\$[A-Z]/], TypeAnnotation[typeAnnotation.type='GenericTypeAnnotation']",
          message: 'Flow type annotations are not allowed. Use TypeScript instead.',
        },
      ],

      // Import restrictions - Unidirectional architecture
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            // Lower layers cannot import from app
            {
              target: ['./src/modules', './src/shared', './src/core', './src/lib'],
              from: ['./src/app'],
              message:
                'Lower layers (modules/shared/core/lib) must not import from app. Only app imports from them.',
            },
            // Shared, core, lib cannot import from modules
            {
              target: ['./src/shared', './src/core', './src/lib'],
              from: ['./src/modules'],
              message:
                'shared/core/lib must not import from modules. Move shared types to src/shared/ or src/core/.',
            },

            // Cross-module imports: each module is isolated
            {
              target: './src/modules/auth',
              from: './src/modules',
              except: ['./auth'],
              message: 'auth module should not import from other modules.',
            },
            {
              target: './src/modules/inventory',
              from: './src/modules',
              except: ['./inventory'],
              message: 'inventory module should not import from other modules.',
            },
            {
              target: './src/modules/crm',
              from: './src/modules',
              except: ['./crm'],
              message: 'crm module should not import from other modules.',
            },
            {
              target: './src/modules/sales',
              from: './src/modules',
              except: ['./sales'],
              message: 'sales module should not import from other modules.',
            },
            {
              target: './src/modules/purchase',
              from: './src/modules',
              except: ['./purchase'],
              message: 'purchase module should not import from other modules.',
            },
            {
              target: './src/modules/hrms',
              from: './src/modules',
              except: ['./hrms'],
              message: 'hrms module should not import from other modules.',
            },
            {
              target: './src/modules/finance',
              from: './src/modules',
              except: ['./finance'],
              message: 'finance module should not import from other modules.',
            },
            {
              target: './src/modules/reports',
              from: './src/modules',
              except: ['./reports'],
              message: 'reports module should not import from other modules.',
            },
            {
              target: './src/modules/payroll',
              from: './src/modules',
              except: ['./payroll'],
              message: 'payroll module should not import from other modules.',
            },
          ],
        },
      ],

      // Enforce absolute imports from @ paths
      'import/no-relative-packages': 'error',
      'import/no-useless-path-segments': 'error',
    },
  },
]);
