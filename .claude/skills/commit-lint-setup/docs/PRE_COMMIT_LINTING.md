# Pre-Commit Linting Setup Guide

## Overview

This project uses **Husky** (Git hooks framework) and **Lint-Staged** (run linters on staged files) to automatically lint and format code **before commits**. This prevents broken, unformatted code from entering the repository.

### What Gets Checked Before Commit?

- **ESLint** — TypeScript/JavaScript syntax, style, and architecture violations
- **Prettier** — Code formatting (quotes, spacing, line length, etc.)
- **Architecture Rules** — Unidirectional import restrictions
- **Naming Conventions** — kebab-case files/folders, no Flow types

If any violations are found, the commit is **BLOCKED** and the developer must fix them before retrying.

---

## How It Works

### Step 1: Developer Stages Files

```bash
git add .
```

### Step 2: Developer Commits

```bash
git commit -m "message"
```

### Step 3: Git Hooks Trigger

The `.husky/pre-commit` hook automatically runs:

```sh
npx lint-staged
```

### Step 4: Lint-Staged Checks Staged Files

Based on `.lintstagedrc.json`, it runs:

- **TypeScript/JavaScript files** (`.ts`, `.tsx`, `.js`, `.jsx`):
  - `eslint --fix` — Fix auto-fixable issues
  - `prettier --write` — Format code
- **Config/Doc files** (`.json`, `.md`, `.yml`, `.yaml`):
  - `prettier --write` — Format code

### Step 5: Outcome

**If no errors:**

- ✅ Files are auto-formatted and re-staged
- ✅ Commit succeeds

**If ESLint errors found:**

- ❌ Commit is **BLOCKED**
- ❌ Error details shown to developer
- ❌ Files are NOT committed

### Step 6: Developer Fixes & Retries

```bash
# Review auto-fixed files
git diff

# Stage fixed files
git add .

# Retry commit
git commit -m "message"
```

---

## Installation & Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- Git repository initialized

### Installation

Everything is already installed in this project. To set up in a **new project**:

```bash
# Install packages
npm install --save-dev husky lint-staged eslint prettier

# Add prepare script to package.json
# "prepare": "husky install"

# Run npm install to initialize hooks
npm install
```

### Current Configuration

**✅ Already installed in this project:**

| Package       | Version | Purpose                      |
| ------------- | ------- | ---------------------------- |
| `husky`       | ^9.1.7  | Git hooks framework          |
| `lint-staged` | ^16.4.0 | Run linters on staged files  |
| `eslint`      | ^9.39.4 | JavaScript/TypeScript linter |
| `prettier`    | ^3.3.0  | Code formatter               |

**✅ Already configured:**

| File                   | Contents                                    |
| ---------------------- | ------------------------------------------- |
| `.husky/pre-commit`    | Runs `npx lint-staged` on every commit      |
| `.lintstagedrc.json`   | Specifies which linters run on which files  |
| `package.json` scripts | `prepare`: Initializes husky on npm install |

---

## Configuration Files

### `.lintstagedrc.json`

Defines which linters run on which files:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

**To modify:** Update which files trigger which linters, or add new ones (e.g., `stylelint` for CSS).

### `.husky/pre-commit`

The git hook that runs before each commit:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**To add more hooks:** Create new files in `.husky/`:

- `.husky/commit-msg` — Validate commit messages
- `.husky/pre-push` — Run tests before pushing

---

## Common Workflows

### Normal Commit Flow

```bash
# 1. Make changes
echo "const x = 1;" > src/new-file.ts

# 2. Stage changes
git add src/new-file.ts

# 3. Commit (hook runs automatically)
git commit -m "feat: add new file"

# Output: ✅ PASSED — file was linted and formatted
```

### Commit with Errors (Blocked)

```bash
# 1. Create file with unused variable
echo "const unused = 1;" > src/bad-file.ts
git add src/bad-file.ts

# 2. Try to commit
git commit -m "feat: add file"

# Output:
# ❌ ESLint error: 'unused' is defined but never used
# ❌ COMMIT BLOCKED
```

### Fix and Retry

```bash
# 1. The file was auto-fixed by ESLint/Prettier, but still has semantic error
#    Fix the semantic issue manually
sed -i 's/const unused = 1;/const used = 1;\nconsole.log(used);/' src/bad-file.ts

# 2. Stage the fixed file
git add src/bad-file.ts

# 3. Retry commit
git commit -m "feat: add file"

# Output: ✅ PASSED
```

### Skip the Hook (Not Recommended)

If you absolutely must skip the hook:

```bash
git commit --no-verify -m "message"
```

⚠️ **Warning:** This bypasses all pre-commit checks and is **not recommended** except in emergency situations. Document why you're using it.

---

## Troubleshooting

### Problem: "pre-commit hook is not executable"

**Symptom:** You see `pre-commit is not executable` error.

**Solution:**

```bash
chmod +x .husky/pre-commit
```

### Problem: "Lint-Staged modifies files but doesn't commit them"

**Symptom:** ESLint/Prettier auto-fixes files, but the commit still fails.

**Cause:** Files were modified but not re-staged.

**Solution:**

```bash
git add .
git commit -m "message"
```

### Problem: "Hook runs but seems slow"

**Cause:** Linting takes time on first run or with many staged files.

**Solution:** This is normal. You can:

- Only stage files you're ready to commit
- Run `npm run lint:fix` locally before committing to pre-fix issues

### Problem: "I don't want Prettier to change my formatting"

**Cause:** Prettier rules conflict with your preference.

**Solution:** Update `.prettierrc.json` to match your preferences:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Then commit the changes.

### Problem: "Husky hook not running at all"

**Cause:** Husky wasn't initialized properly.

**Solution:**

```bash
npx husky install
```

---

## Common Errors & Solutions

| Error                                                    | Cause                                  | Fix                          |
| -------------------------------------------------------- | -------------------------------------- | ---------------------------- |
| `'variable' is defined but never used`                   | Unused variable                        | Remove it or use it          |
| `Unexpected any. Specify a different type`               | Using TypeScript `any`                 | Replace with proper type     |
| `Unexpected path imported in restricted zone`            | Architecture violation                 | Move import to allowed layer |
| `Unexpected file name. Filename should be in KEBAB_CASE` | File name not kebab-case               | Rename file to kebab-case    |
| `Flow type annotations are not allowed`                  | Using Flow types instead of TypeScript | Change to TypeScript syntax  |

---

## Advanced Usage

### Adding More Hooks

#### Commit Message Linting

Enforce conventional commit messages:

```bash
# 1. Install commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# 2. Create commitlint.config.js
cat > commitlint.config.js << 'EOF'
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
EOF

# 3. Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Now commits must follow: `type(scope): subject` format.

#### Pre-Push Hook (Run Tests)

Run tests before pushing to remote:

```bash
# 1. Create pre-push hook
npx husky add .husky/pre-push 'npm test'

# 2. Make it executable
chmod +x .husky/pre-push
```

Now tests must pass before push.

### Modifying Linting Rules

#### Update ESLint Rules

Edit `eslint.config.js` to add/remove rules. See `docs/ESLINT_SETUP.md`.

#### Update Prettier Rules

Edit `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 4,
  "trailingComma": "none",
  "printWidth": 80
}
```

#### Add More Linters

Edit `.lintstagedrc.json`:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write", "tsc --noEmit"],
  "*.{scss,css}": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

---

## Integration with CI/CD

The pre-commit hook only runs **locally**. For CI/CD pipelines:

### GitHub Actions Example

```yaml
name: Lint & Format
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
```

This ensures **remote** code also passes linting, even if local hook is bypassed.

---

## For New Team Members

### First Time Setup

1. **Clone repository:**

   ```bash
   git clone <repo>
   cd project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This automatically runs `npm run prepare` which initializes Husky.

3. **Verify hook is working:**

   ```bash
   ls -la .husky/pre-commit
   ```

   Should show `-rwxr-xr-x` (executable).

4. **Test it:**
   ```bash
   # Make a change with linting issue
   echo "const x;" > test.ts
   git add test.ts
   git commit -m "test"
   # Should fail with ESLint error
   ```

### Best Practices

- ✅ **Stage changes regularly** — Don't stage too much at once
- ✅ **Review auto-fixes** — Check what ESLint/Prettier changed
- ✅ **Run locally first** — `npm run lint:fix` before committing
- ✅ **Read error messages** — They tell you exactly what to fix
- ❌ **Don't use `--no-verify`** — Except in true emergencies
- ❌ **Don't modify `.husky/` files** — Use `.lintstagedrc.json` instead

---

## File Structure

```
.
├── .husky/
│   ├── pre-commit          ✅ Runs lint-staged before commit
│   └── _/
│       ├── husky.sh        (Husky helper script)
│       └── .gitignore
├── .lintstagedrc.json      ✅ Specifies which linters to run
├── .prettierrc.json        ✅ Prettier formatting rules
├── eslint.config.js        ✅ ESLint rules (see ESLINT_SETUP.md)
├── package.json            ✅ Has "prepare": "husky install"
└── docs/
    ├── PRE_COMMIT_LINTING.md    (this file)
    └── ESLINT_SETUP.md          (ESLint configuration guide)
```

---

## Related Documentation

- **ESLint Setup** — See `docs/ESLINT_SETUP.md` for linting rules and architecture
- **Git Hooks Docs** — https://git-scm.com/docs/githooks
- **Husky Docs** — https://typicode.github.io/husky/
- **Lint-Staged Docs** — https://github.com/okonet/lint-staged

---

## Summary

The pre-commit linting system ensures:

| Goal                       | Mechanism                                  |
| -------------------------- | ------------------------------------------ |
| **No broken code**         | ESLint blocks commits with errors          |
| **Consistent formatting**  | Prettier auto-fixes on every commit        |
| **Architecture integrity** | Import rules prevent violations            |
| **Code quality**           | All code goes through linting before merge |

**Next time you commit:**

```bash
git commit -m "message"
# Pre-commit hook runs automatically
# ✅ Code passes linting → commit succeeds
# ❌ Code fails linting → commit blocked, fix required
```

That's it! The system works transparently in the background. 🎉
