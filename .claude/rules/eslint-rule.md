# ESLint Rules & Best Practices

This document outlines the ESLint rules and best practices that MUST be followed when working on this project. These rules ensure code quality, consistency, and architectural integrity.

---

## Rule 0 — Zero ESLint Errors, Always. No Exceptions.

**CRITICAL:** `npm run lint` MUST report **0 errors** before any change is reported as done. This is not a cleanup step to do later, and not something to leave for the pre-commit hook to catch — a change that adds an ESLint error is an unfinished change.

**Mandatory verification, every time:**

```bash
npm run lint      # must end in "0 errors"
npx tsc --noEmit  # must be silent
```

Run **both** after finishing any code change. Never report work complete on the strength of a passing `tsc` alone — `tsc` and ESLint catch different classes of defect (the React Compiler rules below are ESLint-only and invisible to `tsc`).

**Non-negotiables:**

- **Never silence a rule to make it pass.** No `// eslint-disable`, no `// eslint-disable-next-line`, no rule downgraded in `eslint.config.js`. Fix the underlying code. If a rule genuinely needs adjusting, raise it with the team first — do not disable it inline as part of unrelated work.
- **`--fix` is a starting point, not the fix.** `npm run lint:fix` handles formatting-class problems; logic-class errors (hook dependencies, React Compiler bailouts, architecture violations) must be fixed by hand.
- **Leave the file cleaner than you found it.** If you touch a file that already has an error, fix that error too — "it was already broken" is not a reason to hand back a file that fails lint.
- **Formatting counts.** Run `npx prettier --write <files>` on files you changed; a Prettier-dirty file fails the pre-commit hook even when ESLint is clean.

**Warnings:** drive these to zero as well unless the warning is inherent to a third-party API. There is exactly one such accepted warning today — `react-hooks/incompatible-library` on `useReactTable()`, which TanStack Table causes and no code change can resolve. It appears once per table engine: `src/shared/table/data-table.tsx` and `src/shared/expandable-table/expandable-data-table.tsx`. Any other warning is yours to fix.

---

## React Compiler Rules (`react-hooks/*`) — Error-Level, and `tsc` Cannot See Them

This project runs the **React Compiler** ESLint rules at error level. They fail the lint run, never the type-check, so they are only caught by actually running `npm run lint`.

### `react-hooks/preserve-manual-memoization` — "Compilation Skipped"

The most common way to hit this: reading an **optional-chained property** inside a `useCallback` / `useMemo` while listing that property path in the dependency array.

```tsx
// ❌ WRONG — the compiler infers `editLoan` (the whole object) as the dependency,
// because the optional chain must load the object to null-check it. That does not
// match the manual `editLoan?.id` dep, so the compiler cannot prove the memoization
// is safe and BAILS OUT OF OPTIMIZING THE ENTIRE COMPONENT.
//
//   "Inferred dependency was `editLoan`, but the source dependencies were
//    [..., editLoan?.id, ...]. Inferred less specific property than source."
const handleSubmit = useCallback(
  async (values) => {
    await saveLoan(payload, editLoan?.id);
  },
  [editLoan?.id, saveLoan]
);

// ✅ RIGHT — hoist the narrow value to a scalar OUTSIDE the callback. The callback
// now closes over a plain binding, so the inferred dep matches the declared one,
// and the intended "recreate only when the id changes" behavior is preserved.
const editLoanId = editLoan?.id;

const handleSubmit = useCallback(
  async (values) => {
    await saveLoan(payload, editLoanId);
  },
  [editLoanId, saveLoan]
);
```

Rules of thumb:

- **A dependency array should list plain bindings**, not property paths (`editLoanId`, not `editLoan?.id`). Derive the narrow value above the hook and depend on that.
- Widening the dep to the whole object (`[editLoan]`) also silences it, but it recreates the callback more often than needed — prefer the hoisted scalar.
- The error text names both sides ("inferred dependency was X, source dependencies were [...]"). Make the declared array match the inferred one; do not guess.

### `no-console`

`console.log` is an error-level violation (`warn` / `error` are permitted). Never leave a `console.log` in a stub or TODO handler — write the TODO as a comment and leave the body empty, or route real user-facing output through `notificationService` (`@/core/notifications`).

---

## ESLint Configuration Overview

This project uses ESLint with the following plugins:

- **typescript-eslint** - TypeScript-specific linting
- **eslint-plugin-react-hooks** - React Hooks rules
- **eslint-plugin-react-refresh** - Fast Refresh validation
- **eslint-plugin-import** - Import/export validation
- **eslint-plugin-check-file** - File and folder naming conventions

---

## Core Rules

### 1. File Naming Convention

**CRITICAL:** All TypeScript and JavaScript files MUST use kebab-case naming.

```bash
# ✅ CORRECT
user-profile.tsx
use-auth.ts
format-date.ts
api-types.ts

# ❌ WRONG
UserProfile.tsx
useAuth.ts
formatDate.ts
API_TYPES.ts
```

**Extensions Supported:** `.ts`, `.tsx`, `.js`, `.jsx`

**Rule ID:** `check-file/filename-naming-convention`

---

### 2. Folder Naming Convention

**CRITICAL:** All folders in `src/` MUST use kebab-case naming.

```bash
# ✅ CORRECT
src/modules/auth/
src/shared/ui/
src/core/utils/
src/lib/api/

# ❌ WRONG
src/modules/Auth/
src/shared/UI/
src/core/Utils/
src/lib/API/
```

**Exception:** `__tests__` folders are allowed with underscore naming.

**Rule ID:** `check-file/folder-naming-convention`

---

### 3. Unidirectional Architecture

**CRITICAL:** Imports must follow the dependency hierarchy. Lower layers cannot import from higher layers.

**Architecture Layers (bottom to top):**

```
lib/ → core/ → shared/ → modules/ → app/
```

**Import Rules:**

| From Layer | Can Import To     |
| ---------- | ----------------- |
| `app/`     | All layers below  |
| `modules/` | shared, core, lib |
| `shared/`  | core, lib         |
| `core/`    | lib               |
| `lib/`     | Nothing below     |

**Examples:**

```typescript
// ✅ CORRECT - app can import from modules
// In src/app/some-file.tsx
import { Button } from '@/modules/auth';

// ❌ WRONG - modules cannot import from app
// In src/modules/auth/component.tsx
import { Header } from '@/app/layout/header';

// ❌ WRONG - shared cannot import from modules
// In src/shared/ui/button.tsx
import { useAuth } from '@/modules/auth/hooks/use-auth';

// ✅ CORRECT - Move shared types to src/shared/
// In src/shared/ui/button.tsx
import type { ButtonProps } from '@/shared/types/ui-types';
```

**Rule ID:** `import/no-restricted-paths`

---

### 4. Cross-Feature Import Restrictions

**CRITICAL:** Modules must NOT import from other modules. Each feature module should be self-contained.

**Restricted Modules:**

- `modules/auth` - Cannot import from other modules
- `modules/inventory` - Cannot import from other modules
- `modules/crm` - Cannot import from other modules
- `modules/sales` - Cannot import from other modules
- `modules/purchase` - Cannot import from other modules
- `modules/hrms` - Cannot import from other modules
- `modules/finance` - Cannot import from other modules
- `modules/reports` - Cannot import from other modules
- `modules/payroll` - Cannot import from other modules

**Examples:**

```typescript
// ❌ WRONG - inventory importing from sales
// In src/modules/inventory/components/stock-item.tsx
import { SalesOrder } from '@/modules/sales/types/sales-types';

// ✅ CORRECT - Move shared types to src/shared/
// In src/shared/types/business-types.ts
export interface SalesOrder { ... }
export interface StockItem { ... }

// Then both can import from shared
// In src/modules/inventory/components/stock-item.tsx
import type { SalesOrder } from '@/shared/types/business-types';
```

**Solution Pattern:**
If you need types or utilities shared between modules, move them to:

- `src/shared/types/` - for shared type definitions
- `src/shared/utils/` - for shared utilities
- `src/core/` - for core business logic

---

### 5. Barrel-Only Import Enforcement

**CRITICAL:** `app/` must import modules through their barrel exports (`index.ts`), not deep paths.

**Purpose:** Maintain clean public APIs for each module and prevent tight coupling.

```typescript
// ❌ WRONG - Deep import from module
// In src/app/layout/sidebar.tsx
import { LoginButton } from '@/modules/auth/components/login-button';

// ✅ CORRECT - Import from module barrel
// In src/app/layout/sidebar.tsx
import { LoginButton } from '@/modules/auth';

// Then in src/modules/auth/index.ts, export it:
// export { LoginButton } from './components/login-button';
```

**Exception:** Page lazy imports for code splitting:

```typescript
// ✅ ALLOWED - Lazy loading from pages/
// In src/app/routes.tsx
const Dashboard = lazy(() => import('@/modules/auth/pages/dashboard'));
```

**Rule ID:** `import/no-restricted-paths` (barrel-only enforcement)

---

### 5a. Import From the Barrel Folder, Not the Deep File (all layers)

**CRITICAL:** Rule 5 covers `app/ → modules/`. This rule generalizes it to **every** import in the codebase: **when a folder has a barrel (`index.ts` / `index.tsx`), import from the folder path — never from a specific file inside it.** The specifier ends at the barrel-owning folder.

```typescript
// ❌ WRONG - deep file import even though the folder has a barrel
import { ErpButton } from '@/shared/ui/erp-ui/erp-button';
import { DataTable } from '@/shared/table/data-table';
import { useAdminRoles } from '@/modules/foundation/admin/hooks/users-access/use-admin-roles';
import type { AdminRole } from '@/modules/foundation/admin/types/users-access/admin-roles';

// ✅ CORRECT - barrel folder import
import { ErpButton } from '@/shared/ui/erp-ui';
import { DataTable } from '@/shared/table';
import { useAdminRoles } from '@/modules/foundation/admin/hooks';
import type { AdminRole } from '@/modules/foundation/admin/types';
```

**Depth:** shared/core/lib collapse to the barrel (`@/shared/ui/erp-ui`, `@/core/errors`, …); feature modules collapse to the **per-layer** barrel (`@/modules/<group>/<module>/{hooks,api,queries,types}`) — not the deep `.../hooks/<subfolder>/use-x`, and not the module root.

**Exceptions (keep the deep/relative path):**

1. **No barrel exists** — sibling files in a screen's own `pages/<screen>/components/` folder (`./role-list`, `./role-data`). Adding an `index.ts` there would trip `react-refresh/only-export-components`.
2. **Never import your own layer's barrel** — it is a circular import (the barrel re-exports the importing file). An `api/` file keeps `@/modules/<group>/<module>/api/endpoints`; a `queries/` file keeps the direct path to a sibling query. Only import a _different_ layer's barrel.
3. **shadcn primitives under `src/shared/ui/`** are flat files with no per-primitive barrel — import the file (`@/shared/ui/button`).

**Rule ID:** `import/no-restricted-paths` (extend the existing zones when adding CI enforcement).

---

### 6. Absolute Imports Enforcement

**CRITICAL:** Always use absolute imports with `@/` alias. No relative parent imports.

```typescript
// ❌ WRONG - Relative parent import
import { Button } from '../../../shared/ui/button';

// ❌ WRONG - Relative sibling import
import { UserCard } from './components/user-card';

// ✅ CORRECT - Absolute import with alias
import { Button } from '@/shared/ui/button';
import { UserCard } from '@/modules/auth/components/user-card';
```

**Rule IDs:** `import/no-relative-packages`, `import/no-useless-path-segments`

---

## React Hooks Rules

### React Hooks Dependencies

**CRITICAL:** Follow React Hooks exhaustive dependencies rule.

```typescript
// ❌ WRONG - Missing dependency
useEffect(() => {
  fetchUser(userId);
}, []); // eslint will warn about missing 'userId'

// ✅ CORRECT - Include all dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId, fetchUser]);
```

**Rule ID:** `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`

---

## Flow Syntax Restriction

**CRITICAL:** Flow type syntax is not allowed. Use TypeScript instead.

```typescript
// ❌ WRONG - Flow syntax
// @flow
type User = {
  name: string;
};

// ✅ CORRECT - TypeScript syntax
interface User {
  name: string;
}
```

**Rule ID:** `no-restricted-syntax`

---

## ESLint Commands

### Run ESLint

```bash
# Lint all files
npm run lint

# Lint specific file
npm run lint src/modules/auth/components/user-profile.tsx

# Lint with auto-fix
npm run lint -- --fix

# Lint and check for TypeScript errors
npm run type-check
```

---

## Common ESLint Errors & Solutions

### Error: `check-file/filename-naming-convention`

**Cause:** File name doesn't follow kebab-case

**Solution:**

```bash
# Rename file to kebab-case
mv UserProfile.tsx user-profile.tsx
mv useAuthHook.ts use-auth-hook.ts
```

---

### Error: `import/no-restricted-paths`

**Cause:** Import violates architectural boundaries

**Solution:**

1. Identify if the import is from a higher layer
2. Move shared code to appropriate lower layer (`shared/`, `core/`, or `lib/`)
3. Update imports to use the new location

---

### Error: `check-file/folder-naming-convention`

**Cause:** Folder name doesn't follow kebab-case

**Solution:**

```bash
# Rename folder to kebab-case
mv src/modules/UserProfile src/modules/user-profile
mv src/shared/UI src/shared/ui
```

---

### Error: Missing barrel export

**Cause:** Importing from module deep path instead of barrel

**Solution:**

1. Add export to module's `index.ts`:

```typescript
// In src/modules/auth/index.ts
export { LoginButton } from './components/login-button';
export { useAuth } from './hooks/use-auth';
```

2. Update import in `app/`:

```typescript
import { LoginButton, useAuth } from '@/modules/auth';
```

---

## Best Practices

### 1. Keep Files Focused

**Each file should have a single responsibility:**

```typescript
// ✅ CORRECT - Focused component
// src/modules/auth/components/login-button.tsx
export function LoginButton() { ... }

// ✅ CORRECT - Focused hook
// src/modules/auth/hooks/use-auth.ts
export function useAuth() { ... }

// ❌ AVOID - Mixed concerns in one file
// src/modules/auth/auth-stuff.tsx
export function LoginButton() { ... }
export function useAuth() { ... }
export const AUTH_CONSTANTS = { ... };
```

### 2. Organize Imports

**Follow the import order specified in TypeScript rules:**

```typescript
// 1. React and core libraries
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Third-party libraries
import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';

// 3. Internal shared imports
import { Button } from '@/shared/ui/button';

// 4. Feature/module imports
import { useAuth } from '@/modules/auth/hooks/use-auth';

// 5. Relative imports (same folder)
import { LocalComponent } from './local-component';
```

### 3. Use Type-Only Imports

```typescript
// ✅ CORRECT - Type-only import
import type { User, UserRole } from '@/types/user-types';

// ❌ AVOID - Value import for types only
import { User, UserRole } from '@/types/user-types';
```

### 4. No Unused Imports

```typescript
// ❌ WRONG - Unused import
import { Button, Card } from '@/shared/ui';

// ✅ CORRECT - Only import what you use
import { Button } from '@/shared/ui';
```

---

## ESLint Configuration for IDE

Ensure your IDE ESLint settings align with project rules:

**VS Code settings (.vscode/settings.json):**

```json
{
  "eslint.enable": true,
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "eslint.run": "onType",
  "eslint.format.enable": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## Pre-commit Integration

The project uses Husky for pre-commit hooks. ESLint runs automatically before commits.

**To bypass (not recommended):**

```bash
git commit --no-verify -m "message"
```

**To fix issues before committing:**

```bash
# Run ESLint with auto-fix
npm run lint -- --fix

# Stage the fixes
git add .

# Commit again
git commit -m "message"
```

---

## Rule Checklist

Before marking any task as complete, verify:

- [ ] **`npm run lint` reports 0 errors** — actually run it; do not infer it from a passing `tsc`
- [ ] **`npx tsc --noEmit` is silent**
- [ ] **`npx prettier --write` run on every file you changed**
- [ ] No rule was silenced to get there (no `eslint-disable` added, no rule downgraded in `eslint.config.js`)
- [ ] No `console.log` left behind in a stub, TODO, or debug path
- [ ] No `react-hooks/preserve-manual-memoization` bailout — dependency arrays list plain bindings, not optional-chained property paths
- [ ] All files use kebab-case naming
- [ ] All folders use kebab-case naming
- [ ] Imports follow unidirectional architecture
- [ ] No cross-feature module imports
- [ ] Module imports use barrel exports (from `app/`)
- [ ] All imports use absolute paths with `@/` alias
- [ ] React Hooks dependencies are complete
- [ ] No Flow type syntax (use TypeScript)
- [ ] **No hand-rolled copy of a `@/core/utils` helper** — nothing named `toNum`/`toStr`/`toId`/`toDate`/`parseDate`/`firstDefined` or re-declaring `firstText`/`toNumber`/`toDateOnly`/`toIsoDate`/`parseApiDay`/`orNull` locally; a missing helper is added to `src/core/utils` and exported from its barrel (CLAUDE.md → Reuse shared utilities)
- [ ] No unused imports
- [ ] ESLint passes without errors (`npm run lint`)

---

**Remember:** ESLint is your automated code quality gate. Rules that exist in this configuration are intentional and should not be disabled. If you believe a rule needs adjustment, discuss it with the team first.
