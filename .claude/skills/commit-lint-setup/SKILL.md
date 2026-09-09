---
name: commit-lint-setup
description: |
  Setup and replicate pre-commit linting and commit message validation using Husky, Lint-Staged, and Commitlint. Use this skill whenever a developer needs to:
  - Configure automated git hooks for ESLint and Prettier on commit
  - Set up Husky (git hooks framework) and Lint-Staged (run linters on staged files)
  - Enforce conventional commit message format (type(scope): subject)
  - Replicate complete pre-commit linting setup in a new project
  - Configure .lintstagedrc.json, .prettierrc.json, .husky/pre-commit, and .husky/commit-msg hooks
  - Enforce code quality standards AND proper commit messages before commits
  
  This skill provides automated scripts to get a complete commit quality system running in minutes, automatically formatting code, blocking ESLint violations, and enforcing proper commit message format. Includes optional commitlint setup for commit message validation.
disable-model-invocation: true
compatibility:
  - Requires: npm, Node.js, Git
  - Depends on: ESLint and Prettier (should be installed first)
  - Note: ES Module projects (.mjs, "type": "module" in package.json) should use commitlint.config.cjs (not .js)
---

# Pre-Commit Linting Setup Skill

This skill automates setup of a complete pre-commit linting system that:

1. **Blocks commits with errors** — ESLint violations prevent code from being committed
2. **Auto-fixes formatting** — Prettier automatically formats code before commit
3. **Works transparently** — Developers see hook output and error messages
4. **Integrates with existing setup** — Works alongside ESLint and Prettier configuration

---

## Quick Start

Choose your approach:

### Option A: Automated Setup (Recommended)

Run the setup script from your project root:

**On PowerShell (Windows):**

```powershell
# Navigate to your project root
cd C:\path\to\your\project

# Basic setup (code linting only)
.\setup-commit-lint.ps1

# Or with commit message validation
.\setup-commit-lint.ps1 -WithCommitLint
```

**On bash (macOS/Linux):**

```bash
cd /path/to/your/project

# Basic setup (code linting only)
bash setup-commit-lint.sh

# Or with commit message validation
bash setup-commit-lint.sh --with-commit-lint
```

The script will:

- ✅ Install husky, lint-staged, and prettier packages
- ✅ (Optional with flag) Install commitlint packages for commit message validation
- ✅ Initialize husky in your project
- ✅ Create `.husky/pre-commit` hook (ESLint + Prettier)
- ✅ (Optional with flag) Create `.husky/commit-msg` hook (commit message validation)
- ✅ Create `.lintstagedrc.json` configuration
- ✅ Create `.prettierrc.json` formatting rules
- ✅ (Optional with flag) Create `commitlint.config.cjs` message rules
- ✅ Add `prepare` script to `package.json`
- ✅ Run a test to verify everything works

**Recommendation:** Use `--with-commit-lint` flag to enforce proper commit message format across your team.

### Option B: Manual Setup

Follow the detailed steps below.

---

## Commit Message Format

This skill includes optional **commit message linting** to enforce consistent commit messages using the **Conventional Commits** standard.

### Commit Message Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

Use one of these types:

| Type       | Purpose                      | Example                                           |
| ---------- | ---------------------------- | ------------------------------------------------- |
| `feat`     | New feature                  | `feat(auth): add JWT token validation`            |
| `fix`      | Bug fix                      | `fix(inventory): resolve stock count calculation` |
| `docs`     | Documentation                | `docs(api): update endpoint guide`                |
| `style`    | Formatting (no logic change) | `style(ui): add missing semicolons`               |
| `refactor` | Code restructuring           | `refactor(modal): simplify component logic`       |
| `perf`     | Performance improvement      | `perf(query): optimize database lookups`          |
| `test`     | Test-related changes         | `test(auth): add login flow tests`                |
| `chore`    | Maintenance, dependencies    | `chore: update eslint to v9.40.0`                 |
| `ci`       | CI/CD configuration          | `ci: add GitHub Actions workflow`                 |
| `revert`   | Revert previous commit       | `revert: undo refactor(modal)`                    |

### Scopes (Optional)

The scope specifies what part of the codebase changed. Common scopes:

| Scope       | Module                           |
| ----------- | -------------------------------- |
| `auth`      | Authentication module            |
| `inventory` | Inventory management             |
| `crm`       | Customer relationship management |
| `sales`     | Sales module                     |
| `purchase`  | Purchase management              |
| `hrms`      | Human resources                  |
| `finance`   | Finance & accounting             |
| `reports`   | Reporting & analytics            |
| `ui`        | Shared UI components             |
| `api`       | API/service layer                |
| `types`     | Type definitions                 |
| `config`    | Configuration files              |

### Examples of Good Commit Messages

```
✅ GOOD
feat(auth): implement JWT token refresh mechanism
fix(inventory): resolve concurrent stock update race condition
docs(api): add authentication endpoint documentation
style: align indentation across codebase
test(crm): add contact creation workflow tests
chore: upgrade typescript to 5.2.0
perf(query): add database index for user lookups
refactor(modal): extract confirmation logic to hook
ci: configure pre-push hook for tests
```

```
❌ BAD
fixed bug
updated code
random changes
new feature added
bug fix in inventory
WIP
working on stuff
please merge this
```

### Subject Line Rules

- ✅ Use imperative mood: "add feature" (not "added feature" or "adds feature")
- ✅ Don't capitalize first letter: `feat` (not `Feat`)
- ✅ No period at the end: `fix(auth): validate token` (not `fix(auth): validate token.`)
- ✅ Keep it short: Aim for 50 characters or less
- ✅ Be specific: What changed and why it matters

### Body (Optional)

For complex changes, add more detail:

```
feat(inventory): implement stock reorder automation

This feature automatically triggers purchase orders when stock
falls below configured thresholds. It includes:
- Dynamic threshold configuration per SKU
- Notification alerts to procurement team
- Integration with purchase module APIs
- Support for multiple warehouse locations

Fixes #123
```

### Footer (Optional)

Reference related issues or breaking changes:

```
fix(api): update user endpoint response format

BREAKING CHANGE: user.id is now returned as string instead of number

Fixes #456
```

---

## Setting Up Commit Message Linting

To enforce the commit message format with **commitlint**, run:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npx husky add .husky/commit-msg 'npx --no-- commitlint --edit "$1"'
chmod +x .husky/commit-msg
```

### Creating commitlint Configuration

**For ES Module projects** (package.json has `"type": "module"`):
Create `commitlint.config.cjs` (use `.cjs` extension):

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert'],
    ],
    'type-case': [2, 'always', 'lowercase'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
```

**For CommonJS projects**:
Create `commitlint.config.js` with the same content above.

### Why .cjs for ES Modules?

When `package.json` has `"type": "module"`, all `.js` files are treated as ES modules. Commitlint expects CommonJS, so use `.cjs` extension to avoid import errors.

### Testing Commit Message Validation

Now commits that don't follow the format will be rejected:

```bash
# ✅ These will be accepted
git commit -m "feat(auth): add login feature"
git commit -m "fix(inventory): resolve stock bug"
git commit -m "docs(api): update endpoint guide"

# ❌ These will be rejected
git commit -m "fixed bug"
# Error: type may not be empty

git commit -m "Feat(auth): add feature"
# Error: type must be lowercase

git commit -m "feat(auth): add feature."
# Error: subject must not end with period
```

---

## Manual Setup Steps

### Step 1: Install Packages

```bash
npm install --save-dev husky lint-staged prettier
```

**What each package does:**

- `husky` — Git hooks framework (triggers scripts on git events)
- `lint-staged` — Runs linters only on staged files (fast)
- `prettier` — Code formatter (enforces consistent style)

### Step 2: Initialize Husky

```bash
npx husky install
```

This creates the `.husky/` directory and initializes git hooks.

### Step 3: Add Prepare Script to package.json

Add this to your `package.json` `scripts` section:

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

This ensures husky is initialized when someone runs `npm install`.

### Step 4: Create `.husky/pre-commit` Hook

Create a file at `.husky/pre-commit` with:

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Make it executable:

```bash
chmod +x .husky/pre-commit
```

### Step 5: Create `.lintstagedrc.json`

Create this file in your project root:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

This defines which linters run on which files.

### Step 6: Create `.prettierrc.json`

Create this file in your project root:

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

Customize these rules to match your team's preferences.

### Step 7: (Optional) Set Up Commit Message Linting

For optional commit message validation:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional

npx husky add .husky/commit-msg 'npx --no-- commitlint --edit "$1"'
chmod +x .husky/commit-msg
```

Create `commitlint.config.cjs` (use .cjs not .js for ES module projects):

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert'],
    ],
    'type-case': [2, 'always', 'lowercase'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
```

**Important:** If your `package.json` has `"type": "module"`, use `commitlint.config.cjs` (not `.js`). This avoids ES module import errors.

### Step 8: Test It

```bash
# Test 1: Create file with linting error
echo "const unused = 1;" > test.ts
git add test.ts

# Try to commit with proper message format
git commit -m "feat(test): add test file"

# Output: ❌ ESLint error: 'unused' is defined but never used

# Test 2: Fix the file and try with proper message
rm test.ts
echo "const x = 1;" > test.ts
git add test.ts

git commit -m "feat(test): add test file"
# Output: ✅ PASSED (message validated, code linted)

# Test 3: Try with invalid message format (if commitlint enabled)
git commit -m "added test file"
# Output: ❌ BLOCKED: type may not be empty, subject may not be empty
```

---

## How Pre-Commit Linting Works

### The Flow

```
Developer runs:  git commit -m "message"
       ↓
Git hook triggers (.husky/pre-commit)
       ↓
Runs: npx lint-staged
       ↓
Checks staged files against .lintstagedrc.json
       ↓
For TypeScript files:
  ├─ Runs: eslint --fix
  └─ Runs: prettier --write
       ↓
For config/doc files:
  └─ Runs: prettier --write
       ↓
─────────────────────────────
│ All linting passed?       │
├─────────────────────────────┤
│ YES → Commit succeeds ✅   │
│ NO  → Commit blocked ❌    │
─────────────────────────────
       ↓
Developer sees error message
       ↓
Developer fixes issue manually
       ↓
Developer retries: git add . && git commit -m "message"
```

### What Gets Checked?

| File Type              | ESLint | Prettier | Purpose                     |
| ---------------------- | ------ | -------- | --------------------------- |
| `.ts`, `.tsx`          | ✅     | ✅       | Syntax, style, architecture |
| `.js`, `.jsx`          | ✅     | ✅       | Syntax, style, architecture |
| `.json`                | ❌     | ✅       | Formatting only             |
| `.md`, `.yml`, `.yaml` | ❌     | ✅       | Formatting only             |

---

## Common Workflows

### Normal Commit

```bash
# 1. Make changes
echo "const x = 1;" > src/file.ts

# 2. Stage changes
git add src/file.ts

# 3. Commit (hook runs automatically)
git commit -m "feat: add file"

# Output:
# ✓ lint-staged
# ✓ eslint --fix (no errors)
# ✓ prettier --write
# ✅ [master abc123] feat: add file
```

### Commit with Linting Error

```bash
# 1. Create file with unused variable
echo "const unused = 1;" > src/bad.ts
git add src/bad.ts

# 2. Try to commit
git commit -m "feat: add file"

# Output:
# ✗ lint-staged
# ✗ ESLint error: 'unused' is defined but never used
# ❌ COMMIT BLOCKED
#
# Fix the error and try again.
```

### Fix and Retry

```bash
# 1. Fix the file
nano src/bad.ts
# Remove the unused variable or use it

# 2. Re-stage
git add src/bad.ts

# 3. Retry commit
git commit -m "feat: add file"

# Output: ✅ [master def456] feat: add file
```

### Skip Hook (Not Recommended)

```bash
git commit --no-verify -m "message"
```

⚠️ **Warning:** This bypasses all pre-commit checks. Only use in true emergencies, and document why.

---

## Customizing the Setup

### Add More Linters

Edit `.lintstagedrc.json`:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write", "tsc --noEmit"],
  "*.{scss,css}": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}
```

Then install the new linters:

```bash
npm install --save-dev stylelint
```

### Modify Prettier Rules

Edit `.prettierrc.json`:

```json
{
  "semi": false,
  "singleQuote": false,
  "tabWidth": 4,
  "trailingComma": "none",
  "printWidth": 80,
  "arrowParens": "avoid",
  "endOfLine": "crlf"
}
```

### Add More Hooks

#### Commit Message Linting

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional

npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Create `commitlint.config.js`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

#### Pre-Push Hook (Run Tests)

```bash
npx husky add .husky/pre-push 'npm test'
chmod +x .husky/pre-push
```

---

## Troubleshooting

### Hook Not Running

**Symptom:** Pre-commit hook doesn't execute.

**Solution:**

```bash
# Reinitialize husky
npx husky install

# Verify hooks are executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### "pre-commit is not executable" or "commit-msg is not executable"

**Solution:**

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### "Cannot require() ES Module" Error

**Symptom:** When running commitlint, you see:

```
Error [ERR_REQUIRE_CYCLE_MODULE]: Cannot require() ES Module
```

**Cause:** Your project has `"type": "module"` in package.json, but commitlint expects CommonJS.

**Solution:** Use `commitlint.config.cjs` instead of `.js`:

```bash
# Rename if using .js
mv commitlint.config.js commitlint.config.cjs
```

The `.cjs` extension tells Node.js to treat the file as CommonJS, avoiding ES module errors.

### Lint Errors But Files Not Staged

**Symptom:** ESLint/Prettier fix files, but commit still fails.

**Cause:** Auto-fixed files need to be re-staged.

**Solution:**

```bash
git add .
git commit -m "message"
```

### Hook Runs Slow

**Normal** — Linting takes time. To improve:

- Only stage files you're ready to commit
- Run `npm run lint:fix` locally before committing

### "Husky not running at all"

**Check:**

```bash
ls -la .husky/pre-commit
# Should show: -rwxr-xr-x (executable)
```

**Fix:**

```bash
npx husky install
chmod +x .husky/pre-commit
```

### Prettier Changes I Didn't Make

**Solution:** Adjust `.prettierrc.json` rules to match your preferences.

---

## Common Errors & Fixes

| Error                                                    | Cause                                     | Fix                                                         |
| -------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| `'variable' is defined but never used`                   | Unused variable                           | Remove or use the variable                                  |
| `Unexpected any. Specify a different type`               | Using `any` type                          | Replace with specific type                                  |
| `Unexpected path imported in restricted zone`            | Architecture violation                    | Move import to allowed layer                                |
| `Unexpected file name. Filename should be in KEBAB_CASE` | File naming                               | Rename to kebab-case                                        |
| `Flow type annotations are not allowed`                  | Using Flow types                          | Use TypeScript syntax                                       |
| `type may not be empty`                                  | Invalid commit message format             | Use: `type(scope): subject`                                 |
| `subject may not be empty`                               | Missing commit subject                    | Add subject after colon: `feat(scope): subject`             |
| `subject must be lowercase`                              | Subject not lowercase                     | Use lowercase letters: `feat: add feature`                  |
| `subject may not end with period`                        | Period at end of subject                  | Remove period: `fix: resolve bug` (not `fix: resolve bug.`) |
| `type must be lowercase`                                 | Type not lowercase                        | Use: `feat` (not `Feat` or `FEAT`)                          |
| `Cannot require() ES Module`                             | commitlint.config.js in ES module project | Rename to `commitlint.config.cjs`                           |
| `pre-commit is not executable`                           | Hook missing execute permission           | Run: `chmod +x .husky/pre-commit`                           |
| `commit-msg is not executable`                           | Hook missing execute permission           | Run: `chmod +x .husky/commit-msg`                           |

---

## Verification Checklist

After setup, verify everything works:

- [ ] Husky and lint-staged installed (`npm list husky lint-staged`)
- [ ] `.husky/pre-commit` exists and is executable
- [ ] `.lintstagedrc.json` exists
- [ ] `.prettierrc.json` exists
- [ ] `package.json` has `"prepare": "husky install"` script
- [ ] Test commit works (create dummy file, commit, delete)
- [ ] Hook blocks commits with ESLint errors
- [ ] Hook allows clean commits to succeed

---

## Reference Files

This skill includes:

- **`references/.lintstagedrc.json`** — Configuration for which linters run on which files
- **`references/.prettierrc.json`** — Prettier formatting rules
- **`references/pre-commit`** — The git hook script for code linting
- **`references/commitlint.config.js`** — Commitlint configuration (copy as .cjs for ES modules)
- **`scripts/setup-commit-lint.ps1`** — Automated setup for Windows PowerShell
- **`scripts/setup-commit-lint.sh`** — Automated setup for bash (macOS/Linux)
- **`scripts/verify-setup.sh`** — Verification script to test the setup

### File Extensions Note

For projects with `"type": "module"` in package.json:

- Use `commitlint.config.cjs` (not `.js`) to avoid ES module import errors
- The setup scripts automatically handle this

---

## Integration Notes

### With ESLint Setup

This skill works alongside the **eslint-setup** skill. Install ESLint first, then pre-commit linting.

**Order:** ESLint → Pre-Commit Linting → Commit Message Linting (optional)

### With CI/CD

Pre-commit hooks run **locally only**. For CI/CD pipelines, add similar commands:

```yaml
# GitHub Actions example
- run: npm run lint
- run: npm run lint:fix
- run: npm test
```

This ensures remote code also passes checks, even if local hook is bypassed.

---

## Testing Commitlint (Optional)

After setting up commit message linting, you can test it manually:

```bash
# Test valid message (should pass)
echo "feat(auth): add login feature" | npx commitlint

# Test invalid message (should fail with errors)
echo "fixed bug" | npx commitlint

# Output:
# ⧗   --- input ---
# fixed bug
# ✖   subject may not be empty
# ✖   type may not be empty
# found 2 problems, 0 warnings
```

---

## For New Team Members

### First Time Setup

1. Clone repository:

   ```bash
   git clone <repo>
   cd project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   This automatically runs `npm run prepare` which initializes Husky.

3. Verify hook is working:

   ```bash
   ls -la .husky/pre-commit
   # Should show: -rwxr-xr-x
   ```

4. Test it:
   ```bash
   echo "const x;" > test.ts
   git add test.ts
   git commit -m "test"
   # Should fail with ESLint error
   ```

### Best Practices

- ✅ **Stage regularly** — Don't stage too much at once
- ✅ **Review auto-fixes** — Check what ESLint/Prettier changed
- ✅ **Run locally first** — `npm run lint:fix` before committing
- ✅ **Read error messages** — They tell you exactly what to fix
- ✅ **Keep hooks fast** — Only lint necessary files
- ❌ **Don't use `--no-verify`** — Except in true emergencies
- ❌ **Don't modify `.husky/` directly** — Use `.lintstagedrc.json` instead

---

## Detailed Documentation

For comprehensive documentation on:

- Pre-commit linting workflow and architecture
- Troubleshooting git hook issues
- Customizing linter rules
- Setting up commit message linting
- CI/CD integration patterns

See the full guide at `docs/PRE_COMMIT_LINTING.md` in your project repository.

---

---

## When to Use Commit Message Linting

### Should I Enable Commit Message Linting?

**Yes, enable it if you want:**

- ✅ Consistent commit message format across the team
- ✅ Readable git history with clear commit types
- ✅ Better changelog generation (feat/fix/docs auto-categorized)
- ✅ Enforce developer discipline on commit clarity
- ✅ Integration with release automation tools

**No, skip it if:**

- ❌ Team is very small and informal
- ❌ Already using a different commit standard
- ❌ Want maximum flexibility (just use the pre-commit linting without commit messages)

### Enable Commit Message Linting

**During setup:**

```bash
# PowerShell
.\scripts\setup-commit-lint.ps1 -WithCommitLint

# Bash
bash scripts/setup-commit-lint.sh --with-commit-lint
```

**Or manually add it later:**

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
npx husky add .husky/commit-msg 'npx --no-- commitlint --edit "$1"'
chmod +x .husky/commit-msg

# Copy commitlint.config.js from references/
cp references/commitlint.config.js ./
```

---

## Quick Reference: Commit Types

| Type       | When to Use                             | Example                                     |
| ---------- | --------------------------------------- | ------------------------------------------- |
| `feat`     | New feature/functionality               | `feat(auth): add two-factor authentication` |
| `fix`      | Bug fix                                 | `fix(inventory): correct stock calculation` |
| `docs`     | Documentation                           | `docs(api): add endpoint examples`          |
| `style`    | Formatting/whitespace (no logic)        | `style: add missing semicolons`             |
| `refactor` | Code restructuring (no behavior change) | `refactor(modal): simplify component`       |
| `perf`     | Performance improvement                 | `perf(query): add database index`           |
| `test`     | Adding/updating tests                   | `test(auth): add login tests`               |
| `chore`    | Dependencies, build, tooling            | `chore: update eslint to v9.40`             |
| `ci`       | CI/CD pipeline changes                  | `ci: add GitHub Actions workflow`           |
| `revert`   | Revert previous commit                  | `revert: undo previous commit abc123`       |

---

## Commit Message Checklist

Before committing, verify your message:

- [ ] Starts with a **commit type** (feat, fix, docs, etc.)
- [ ] Uses **lowercase** (feat, not Feat)
- [ ] Includes **scope in parentheses** (auth, inventory, etc.)
- [ ] **Colon and space** after scope: `type(scope): `
- [ ] **Imperative mood**: "add feature" (not "added" or "adds")
- [ ] **No period** at the end
- [ ] **Specific and clear**: Says what changed and why

```
✅ GOOD          feat(auth): add JWT token refresh mechanism
❌ BAD           Auth feature added
❌ BAD           fix: some random bug
❌ BAD           updated code.
```

---

## Need Help?

**Run the setup script first** — it handles ~95% of the configuration automatically.

```bash
# Basic setup (code linting only)
bash setup-commit-lint.sh

# Or with commit message linting (recommended)
bash setup-commit-lint.sh --with-commit-lint
```

**If you hit an error:**

1. **Check the error message** against the "Common Errors & Fixes" table above
2. **Verify hooks are executable:**
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/commit-msg
   ```
3. **For ES Module projects** — Use `commitlint.config.cjs` not `.js`:
   ```bash
   # If you see "Cannot require() ES Module" error
   mv commitlint.config.js commitlint.config.cjs
   ```
4. **For commit message format errors** — Use proper format:
   ```bash
   ✅ git commit -m "feat(scope): subject"
   ❌ git commit -m "fixed bug"
   ```
5. **Reinitialize husky if hooks aren't running:**
   ```bash
   npx husky install
   chmod +x .husky/pre-commit .husky/commit-msg
   ```
6. **Review documentation** for detailed guidance:
   - `docs/PRE_COMMIT_LINTING.md` — Complete pre-commit guide
   - `docs/ESLINT_SETUP.md` — ESLint configuration
   - `COMMIT_LINT_IMPLEMENTATION.md` — Real-world implementation guide
