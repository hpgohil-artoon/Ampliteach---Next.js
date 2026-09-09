# ESLint Setup Skill

Automated setup for comprehensive ESLint configuration in React + TypeScript ERP projects.

## What This Skill Does

This skill provides **automated scripts and step-by-step guidance** to set up a complete ESLint configuration that enforces:

1. **Kebab-case naming** for all files and folders
2. **TypeScript-only** type annotations (no Flow)
3. **Unidirectional architecture** with strict import rules across layers

## Quick Use

### Automated Setup (Recommended)

**On Windows (PowerShell):**

```powershell
.\scripts\setup-eslint.ps1
```

**On macOS/Linux (bash):**

```bash
bash scripts/setup-eslint.sh
```

### Verify Setup

```bash
bash scripts/verify-setup.sh
```

## Contents

- **SKILL.md** — Comprehensive guide with all setup options
- **scripts/setup-eslint.ps1** — Automated setup for Windows
- **scripts/setup-eslint.sh** — Automated setup for macOS/Linux
- **scripts/verify-setup.sh** — Verification script
- **references/eslint.config.js** — Complete ESLint configuration (copy to your project root)

## Setup Steps

The automated script handles:

- ✅ Installing all 9 ESLint packages
- ✅ Creating folder structure (src/app, src/modules, src/shared, src/lib, src/core)
- ✅ Adding lint scripts to package.json
- ✅ Configuring tsconfig.json @/ alias

Then:

- Copy `references/eslint.config.js` to your project root
- Run `npm run lint` to test
- Run `npm run lint:fix` to auto-fix issues

## Architecture Enforced

```
app/           ← Can import from: modules, shared, lib, core
  ↓
modules/       ← Can import from: shared, lib, core (isolated from each other)
shared/        ← Can import from: lib, core
  ↓
lib/           ← Can import from: core
  ↓
core/          ← Foundation layer
```

## Common Use Cases

**Setting up a new project:**

```bash
npm init -y
bash scripts/setup-eslint.sh
# Copy references/eslint.config.js to project root
npm run lint:fix
```

**Adding a new module:**

1. Create `src/modules/new-module/`
2. Add zone to eslint.config.js:

```javascript
{
  target: './src/modules/new-module',
  from: './src/modules',
  except: ['./new-module'],
  message: 'new-module should not import from other modules.',
}
```

## Reference

For detailed documentation on:

- Module isolation patterns
- Adding workflow modals
- Fixing common errors
- Troubleshooting import resolution

See `docs/ESLINT_SETUP.md` in your project repository.

## Support

- Run `verify-setup.sh` to diagnose issues
- Check error messages against the common errors table in SKILL.md
- Run `npm run lint:fix` to auto-fix ~80% of issues automatically
