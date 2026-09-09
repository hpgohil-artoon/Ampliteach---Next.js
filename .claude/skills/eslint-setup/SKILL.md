---
name: eslint-setup
description: |
  Setup and replicate ESLint configuration for ERP projects. Use this skill whenever a developer needs to:
  - Configure ESLint in a new React + TypeScript project with architecture layer enforcement
  - Replicate the three-pillar ESLint setup (naming conventions, TypeScript-only, unidirectional architecture)
  - Install all required ESLint packages and create configuration files
  - Verify the ESLint setup is working correctly

  This skill provides automated scripts and step-by-step guidance to get a project ESLint-ready in minutes, enforcing kebab-case naming, preventing Flow syntax, and maintaining clean architecture boundaries across modules.
disable-model-invocation: true
compatibility:
  - Requires: npm, Node.js
  - Optional: PowerShell or bash for running setup scripts
---

# ESLint Setup Skill

This skill automates the setup and replication of a comprehensive ESLint configuration for enterprise ERP projects. It enforces three critical standards:

1. **File & Folder Naming Conventions** — All files and folders use `kebab-case`
2. **Flow Syntax Restriction** — Only TypeScript allowed (no Flow type annotations)
3. **Unidirectional Architecture** — Strict layered import pattern preventing circular dependencies

---

## Quick Start

Choose your approach:

### Option A: Automated Setup (Recommended)

Run the setup script from your project root:

**On PowerShell (Windows):**

```powershell
# Navigate to your project root
cd C:\path\to\your\project

# Copy and run the setup script
# (Get the setup-eslint.ps1 from the skill's scripts/ folder)
.\setup-eslint.ps1
```

**On bash (macOS/Linux):**

```bash
cd /path/to/your/project
bash setup-eslint.sh
```

The script will:

- ✅ Install all 9 required ESLint packages
- ✅ Create/update `eslint.config.js`
- ✅ Add lint scripts to `package.json`
- ✅ Create the layer folder structure (`src/app/`, `src/modules/`, etc.)
- ✅ Verify the setup with a test lint run

### Option B: Manual Setup

Follow the detailed steps below.

---

## Manual Setup Steps

### Step 1: Install ESLint Packages

Install each package individually (do NOT use `--legacy-peer-deps`):

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

### Step 2: Update `package.json` Scripts

Add these two scripts to the `scripts` section:

```json
{
  "scripts": {
    "lint": "eslint src",
    "lint:fix": "eslint src --fix"
  }
}
```

### Step 3: Create `eslint.config.js`

Copy the complete ESLint configuration from `references/eslint.config.js` (provided with this skill) to your project root as `eslint.config.js`.

This file includes:

- Naming convention rules (kebab-case for files/folders)
- Flow syntax restrictions
- Unidirectional architecture enforcement for all modules
- Import path restrictions and alias resolution

### Step 4: Update `tsconfig.json`

Ensure your `tsconfig.json` includes the `@/` alias:

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

### Step 5: Create Folder Structure

Create the layered architecture folders under `src/`:

```
src/
├── app/              (composition root)
├── modules/          (business logic)
├── shared/           (reusable systems)
├── lib/              (utility wrappers)
└── core/             (infrastructure)
```

### Step 6: Run and Fix

Test the linter:

```bash
npm run lint
```

Auto-fix violations:

```bash
npm run lint:fix
```

### Step 7: (Optional) Set Up Pre-commit Hooks

For automated linting on commits, use `husky` and `lint-staged`:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npm run lint:fix"
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix"]
  }
}
```

---

## Architecture Layer Rules

The ESLint config enforces this **unidirectional dependency pattern**:

```
app/           ← Composition root (can import from all layers)
  ↑
modules/ + shared/  ← Domain logic + reusable systems
  ↑                 (modules isolated from each other)
lib/           ← Utility wrappers (can import from core)
  ↑
core/          ← Infrastructure (imports nothing)
```

### Import Rules Summary

| Layer       | ✅ Can Import From         | ❌ Cannot Import From      |
| ----------- | -------------------------- | -------------------------- |
| `app/`      | modules, shared, lib, core | (imports from all allowed) |
| `modules/*` | shared, lib, core          | app, other modules         |
| `shared/`   | lib, core                  | app, modules               |
| `lib/`      | core                       | app, modules, shared       |
| `core/`     | (none)                     | everything                 |

---

## Adding a New Module

When you create a new business domain (e.g., `logistics`):

### 1. Create the folder

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

### 2. Add to `eslint.config.js`

Add this zone to the `zones` array in the `import/no-restricted-paths` rule:

```javascript
{
  target: './src/modules/logistics',
  from: './src/modules',
  except: ['./logistics'],
  message: 'logistics module should not import from other modules.',
}
```

That's it! Naming and Flow restrictions apply automatically.

---

## Common Issues & Fixes

| Error                                         | Fix                                                   |
| --------------------------------------------- | ----------------------------------------------------- |
| `Filename should be in KEBAB_CASE`            | Rename: `LoginForm.tsx` → `login-form.tsx`            |
| `Folder should be in KEBAB_CASE`              | Rename: `MyComponent/` → `my-component/`              |
| `Flow type annotations are not allowed`       | Use TypeScript: `type User = {...}` (not Flow syntax) |
| `Lower layers must not import from app`       | Move import to a lower layer or pass data as props    |
| `module should not import from other modules` | Move shared code to `src/shared/` or `src/core/`      |
| `Enforce absolute imports from @ paths`       | Use: `@/shared/utils` (not `../../utils`)             |

---

## Verification Checklist

After setup, verify everything works:

- [ ] All 9 ESLint packages installed (`npm list | grep eslint`)
- [ ] `package.json` has `lint` and `lint:fix` scripts
- [ ] `eslint.config.js` exists in project root
- [ ] `tsconfig.json` has `@/` alias configured
- [ ] Folder structure exists: `src/{app,modules,shared,lib,core}/`
- [ ] `npm run lint` runs without errors (0 violations)
- [ ] `npm run lint:fix` auto-fixes naming/formatting issues
- [ ] At least one file exists in `src/` to test linting

---

## Reference Files

This skill includes:

- **`references/eslint.config.js`** — Complete ESLint configuration (copy to your project root)
- **`scripts/setup-eslint.ps1`** — Automated setup for Windows PowerShell
- **`scripts/setup-eslint.sh`** — Automated setup for bash (macOS/Linux)
- **`scripts/verify-setup.sh`** — Verification script to test the setup

---

## Detailed Documentation

For comprehensive documentation on:

- Architecture layer rules and reasoning
- Naming conventions for files, folders, components, and types
- Adding workflow modals to the shared system
- Module isolation patterns
- Troubleshooting import resolution issues

See the full guide at `docs/ESLINT_SETUP.md` in your project repository.

---

## Need Help?

**Run the setup script first** — it handles ~95% of the configuration automatically.

**If you hit an error:**

1. Check the error message against the "Common Issues & Fixes" table above
2. Run `npm run lint:fix` to auto-fix naming violations
3. Manually fix architecture violations by moving files to appropriate layers
4. Review `docs/ESLINT_SETUP.md` for detailed architectural guidance

**To modify the setup later:**

- Edit `eslint.config.js` to adjust rules
- Add new modules by updating the zones in `import/no-restricted-paths`
- Run `npm run lint` to test any changes
