# ESLint Configuration Setup Guide

## Overview

This guide covers the complete ESLint setup for a scalable React + TypeScript ERP application. The configuration enforces **three pillars**:

1. **File & Folder Naming Conventions** — All files and folders use `kebab-case`
2. **Flow Syntax Restriction** — Only TypeScript allowed (no Flow type annotations)
3. **Unidirectional Architecture** — Enforces a strict layered import pattern to prevent circular dependencies and maintain module isolation

This setup ensures the codebase remains maintainable and architecturally sound as it grows.

---

## Required Packages

Install all 9 ESLint packages. **Do NOT use `--legacy-peer-deps`** — install each one individually to get the latest compatible versions:

```bash
npm install --save-dev eslint
npm install --save-dev @eslint/js
npm install --save-dev globals
npm install --save-dev typescript-eslint
npm install --save-dev eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-react-refresh
npm install --save-dev eslint-plugin-import
npm install --save-dev eslint-import-resolver-typescript
npm install --save-dev eslint-plugin-check-file
```

**Why each package:**

- `eslint` — Core ESLint engine
- `@eslint/js` — Base recommended rules
- `globals` — Browser/Node global variables
- `typescript-eslint` — TypeScript parser and rules
- `eslint-plugin-react-hooks` — React hooks linting
- `eslint-plugin-react-refresh` — Vite Fast Refresh safety
- `eslint-plugin-import` — Import path and restriction rules
- `eslint-import-resolver-typescript` — Resolves `@/` alias paths
- `eslint-plugin-check-file` — File and folder naming conventions

---

## package.json Scripts

Add two scripts to `package.json` under `"scripts"`:

```json
"lint": "eslint src",
"lint:fix": "eslint src --fix"
```

**Usage:**

- `npm run lint` — Check for ESLint violations
- `npm run lint:fix` — Auto-fix violations where possible

---

## eslint.config.js (Complete Final Config)

Replace your `eslint.config.js` with this complete configuration:

```javascript
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
```

---

## Architecture Layer Rules

The ESLint config enforces a **unidirectional, layered architecture**:

```
┌─────────────────────────────────────────┐
│ app/                                     │  Composition root: wires everything together
│ (router, providers, layouts)             │  ✅ Can import from: modules, shared, lib, core
└─────────────────────────────────────────┘
            ↑
    ┌───────┴────────┐
    │                │
┌───┴────────┐  ┌────┴──────────┐
│ modules/   │  │ shared/       │
│ (domain    │  │ (reusable     │
│ business   │  │ systems)      │
│ logic)     │  │               │
└────────────┘  └───────┬───────┘
    ✅ Can import from:  │ ✅ Can import from:
    shared, lib, core    └─→ lib, core
    ❌ NO modules        ❌ NO modules
    ❌ NO app
└─────────────────────────────────────────┘
            ↑
┌─────────────────────────────────────────┐
│ lib/                                     │  Utility wrappers for external libraries
│ (react-query, axios, zod configs)       │  ✅ Can import from: core
└─────────────────────────────────────────┘
            ↑
┌─────────────────────────────────────────┐
│ core/                                    │  Business infrastructure
│ (auth, config, permissions, errors)     │  No external imports (foundation layer)
└─────────────────────────────────────────┘
```

**The Rules in English:**

| From Layer  | Can Import To              | Cannot Import To            |
| ----------- | -------------------------- | --------------------------- |
| `app/`      | modules, shared, lib, core | (can import from any layer) |
| `modules/*` | shared, lib, core          | app, other modules          |
| `shared/`   | lib, core                  | app, modules                |
| `lib/`      | core                       | app, modules, shared        |
| `core/`     | (none)                     | everything else             |

---

## Naming Conventions Reference

### File Names (kebab-case)

```
✅ CORRECT
- login-form.tsx
- use-login.ts
- auth-service.ts
- get-products.ts
- product-types.ts
- permission-guard.tsx

❌ WRONG
- LoginForm.tsx (PascalCase)
- useLogin.ts (camelCase)
- AuthService.ts (PascalCase)
- getProducts.ts (camelCase)
```

### Folder Names (kebab-case)

```
✅ CORRECT
- src/modules/inventory/
- src/modules/auth/
- src/shared/ui/
- src/modules/inventory/pages/inventory-list/
- src/modules/inventory/components/

❌ WRONG
- src/modules/Inventory/
- src/modules/Auth/
- src/shared/UI/
```

### Exported Component & Type Names (PascalCase)

Inside a file named `login-form.tsx`:

```typescript
✅ CORRECT
export const LoginForm = ({ ... }) => { ... }
export interface LoginFormProps { ... }
export type LoginState = { ... }

❌ WRONG
export const login_form = ({ ... }) => { ... }
export interface login-form-props { ... }
```

---

## Adding a New Module

When creating a new business domain (e.g., `logistics`):

### 1. Create the module folder structure

```
src/modules/logistics/
├── api/
├── hooks/
├── pages/
├── queries/
├── services/
├── stores/
├── types/
└── utils/
```

### 2. Update `eslint.config.js`

Add one zone block to the `zones` array in `import/no-restricted-paths`:

```javascript
{
  target: './src/modules/logistics',
  from: './src/modules',
  except: ['./logistics'],
  message: 'logistics module should not import from other modules.',
},
```

### 3. Done!

All other rules (naming, Flow restriction) apply automatically.

---

## Adding a Workflow Modal

For complex multi-step workflows (e.g., RETURN_REQUEST, SHIPMENT_TRACKING):

### Pattern

1. **Create the modal component** in `src/shared/modal/components/`

   ```
   src/shared/modal/components/return-request-modal.tsx
   ```

2. **Add the enum value** to `src/shared/modal/modal-types.ts`

   ```typescript
   export enum ModalType {
     FORM = 'FORM',
     CONFIRM = 'CONFIRM',
     DRAWER = 'DRAWER',
     STOCK_TRANSFER = 'STOCK_TRANSFER',
     RETURN_REQUEST = 'RETURN_REQUEST', // ← NEW
   }
   ```

3. **Register in the registry** at `src/shared/modal/modal-registry.ts`

   ```typescript
   import { ReturnRequestModal } from './components/return-request-modal';

   export const modalRegistry: Record<ModalType, React.ComponentType<any>> = {
     [ModalType.FORM]: FormModal,
     [ModalType.CONFIRM]: ConfirmModal,
     [ModalType.DRAWER]: DrawerModal,
     [ModalType.STOCK_TRANSFER]: StockTransferModal,
     [ModalType.RETURN_REQUEST]: ReturnRequestModal, // ← NEW
   };
   ```

4. **Use from any module**

   ```typescript
   import { modalService, ModalType } from '@/shared/modal';

   modalService.open(ModalType.RETURN_REQUEST, {
     returnId: '123',
     customerId: 'CUST-456',
   });
   ```

### Key Rule

Components in `src/shared/modal/components/` must be **props-only**:

- ✅ Accept all data via props from `modalService.open(...props)`
- ✅ Call async functions passed as callbacks
- ❌ Do NOT import from `src/modules/*`
- ❌ Do NOT import module hooks or APIs

If a modal needs to fetch data, the calling module fetches it first and passes the result as props.

---

## Common Errors & Fixes

| Error                        | Message                                                                 | Fix                                                                                                          |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Naming**                   | `error  Unexpected file name. Filename should be in KEBAB_CASE`         | Rename file to kebab-case: `LoginForm.tsx` → `login-form.tsx`                                                |
| **Naming**                   | `error  Unexpected folder name. Folder should be in KEBAB_CASE`         | Rename folder: `MyComponent/` → `my-component/`                                                              |
| **Flow**                     | `error  Flow type annotations are not allowed. Use TypeScript instead.` | Remove Flow syntax: Change `type User = {` to `type User = {` (TypeScript)                                   |
| **Import (app→modules)**     | `Lower layers must not import from app`                                 | Move import to a module that's higher than app, or pass data as props down                                   |
| **Import (modules→modules)** | `module should not import from other modules`                           | Create the shared type in `src/shared/` and import from there                                                |
| **Import (shared→modules)**  | `shared/core/lib must not import from modules`                          | Move the import to a bridge layer in `src/lib/` with an exception comment, or move the type to `src/shared/` |
| **Relative path**            | `Enforce absolute imports from @ paths`                                 | Change relative import to absolute: `../../utils` → `@/shared/utils`                                         |

---

## Checklist for New Projects

Use this checklist to set up ESLint in a fresh ERP project:

- [ ] Install 9 ESLint packages (without `--legacy-peer-deps`)
- [ ] Add `lint` and `lint:fix` scripts to `package.json`
- [ ] Copy the complete `eslint.config.js` from above
- [ ] Update `tsconfig.json` to include `@/` alias mapping: `"@/*": ["./src/*"]`
- [ ] Create folder structure: `src/app/`, `src/modules/`, `src/shared/`, `src/lib/`, `src/core/`
- [ ] Run `npm run lint` and fix any violations
- [ ] (Optional) Set up `.lintstagedrc.json` to run lint on commit via `husky`
- [ ] Add lint pre-commit hook: `husky add .husky/pre-commit "npm run lint:fix && npm run build"`
- [ ] Verify `npm run lint` passes with **zero errors**
- [ ] Document all modules in `eslint.config.js` zones (one zone per module)

---

## Troubleshooting

### "Module not found: Can't resolve @/..."

**Cause:** The `@/` alias is not configured in `tsconfig.json`.

**Fix:** Ensure `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### "Settings for import/resolver were not found..."

**Cause:** The `settings` block is missing from `eslint.config.js`.

**Fix:** Add the `settings` block (see Complete Config above):

```javascript
settings: {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: './tsconfig.json',
    },
  },
},
```

### Too many errors, where do I start?

Run `npm run lint:fix` first — it auto-fixes ~80% of issues (naming, unused vars, etc.). Then manually fix the remaining architecture violations.

---

## Next Steps

- **Run the linter:** `npm run lint`
- **Auto-fix issues:** `npm run lint:fix`
- **Set up pre-commit hooks:** Use `husky` + `lint-staged` to lint before commits
- **Read the full modal guide:** See `docs/REUSABLE_MODAL_SYSTEM.md`
- **Review architecture:** See `docs/PROJET_STRUCTURE.md` for the complete layer breakdown
