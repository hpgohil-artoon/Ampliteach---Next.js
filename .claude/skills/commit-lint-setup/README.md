# Pre-Commit Linting Setup Skill

Automated setup for comprehensive pre-commit linting using Husky and Lint-Staged.

## What This Skill Does

This skill provides **automated scripts and step-by-step guidance** to set up pre-commit linting that:

1. **Blocks commits with ESLint errors** — No broken code enters repository
2. **Auto-formats with Prettier** — Consistent formatting on every commit
3. **Works transparently** — Git hooks run automatically
4. **Integrates with ESLint setup** — Works alongside your linter configuration
5. **(Optional) Enforces proper commit messages** — Validates commit format with commitlint

## Quick Use

### Automated Setup (Recommended)

**On Windows (PowerShell):**

```powershell
# Basic setup
.\scripts\setup-commit-lint.ps1

# Or with commit message linting
.\scripts\setup-commit-lint.ps1 -WithCommitLint
```

**On macOS/Linux (bash):**

```bash
# Basic setup
bash scripts/setup-commit-lint.sh

# Or with commit message linting
bash scripts/setup-commit-lint.sh --with-commit-lint
```

### Verify Setup

```bash
bash scripts/verify-setup.sh
```

## Contents

- **SKILL.md** — Comprehensive guide with all setup options
- **scripts/setup-commit-lint.ps1** — Automated setup for Windows
- **scripts/setup-commit-lint.sh** — Automated setup for macOS/Linux
- **scripts/verify-setup.sh** — Verification script
- **references/** — Template configuration files:
  - `.lintstagedrc.json` — Linter configuration
  - `.prettierrc.json` — Formatter configuration
  - `pre-commit` — Git hook script
  - `commitlint.config.js` — Commit message linting rules (optional)

## Setup Steps

The automated script handles:

- ✅ Installing husky, lint-staged, prettier
- ✅ Initializing Husky
- ✅ Creating `.husky/pre-commit` hook
- ✅ Creating `.lintstagedrc.json`
- ✅ Creating `.prettierrc.json`
- ✅ Configuring `package.json` with prepare script

Then:

- Run `npm install` (or just the script) to test
- Make a commit with linting issues to see hook in action
- Fix errors and retry commit

## How It Works

```
Developer: git commit -m "feat(auth): add feature"
    ↓
Git Hook 1: .husky/commit-msg (if commitlint enabled)
    ├─ Validates message format: type(scope): subject
    └─ Checks against allowed types: feat, fix, docs, etc.
    ↓
Git Hook 2: .husky/pre-commit triggered
    ↓
Runs: npx lint-staged
    ↓
For staged files:
  ├─ ESLint: eslint --fix (blocks if error)
  └─ Prettier: prettier --write
    ↓
Result: ✅ Commit succeeds OR ❌ Blocked with error
```

## Commit Message Format (with commitlint)

```
<type>(<scope>): <subject>

<optional body>
<optional footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`

**Examples:**

```
✅ feat(auth): add JWT token validation
✅ fix(inventory): resolve stock count bug
✅ docs(api): update endpoint guide
✅ refactor(modal): extract confirmation logic
❌ fixed bug (too vague)
❌ WIP (not a proper commit type)
```

## Common Use Cases

**Setting up in a new project:**

```bash
npm install
bash scripts/setup-commit-lint.sh
npm install  # Re-initialize with prepare script
```

**Testing pre-commit hook:**

```bash
# Create file with linting error
echo "const unused = 1;" > test.ts
git add test.ts

# Try to commit (should fail)
git commit -m "test"

# Fix and retry
rm test.ts
git add .
git commit -m "fix: cleanup test file"  # Should succeed
```

**Test commit message format (with commitlint):**

```bash
# ❌ This will be rejected
git commit -m "fixed bug"
# Error: subject must be lowercase

# ✅ This will be accepted
git commit -m "fix(auth): correct token validation"
```

**Customize Prettier rules:**

```bash
# Edit .prettierrc.json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 4
}
```

## Files Checked

| File Type                       | ESLint | Prettier |
| ------------------------------- | ------ | -------- |
| `.ts`, `.tsx`                   | ✅     | ✅       |
| `.js`, `.jsx`                   | ✅     | ✅       |
| `.json`, `.md`, `.yml`, `.yaml` | ❌     | ✅       |

## What Gets Blocked

Commits are **blocked** if:

- ❌ ESLint finds syntax/style errors
- ❌ ESLint finds architecture violations
- ❌ ESLint finds naming convention violations
- ❌ Any non-auto-fixable errors found

**Auto-fixed** before re-staging:

- ✅ Formatting (Prettier)
- ✅ Auto-fixable ESLint issues (unused vars, etc.)

## Troubleshooting

| Issue                           | Solution                                |
| ------------------------------- | --------------------------------------- |
| Hook not running                | `chmod +x .husky/pre-commit`            |
| Slow commits                    | Only stage files you're ready to commit |
| Files auto-fixed but not staged | Run `git add .` and retry commit        |
| Want different formatting       | Edit `.prettierrc.json`                 |

## Reference

For detailed documentation on:

- Pre-commit linting workflow
- Troubleshooting git hook issues
- Adding more hooks (commit message linting, pre-push)
- Customizing linter configuration
- CI/CD integration

See `docs/PRE_COMMIT_LINTING.md` in your project repository.

## Support

- Run `verify-setup.sh` to diagnose issues
- Check error messages for what to fix
- Consult `docs/PRE_COMMIT_LINTING.md` for detailed help
