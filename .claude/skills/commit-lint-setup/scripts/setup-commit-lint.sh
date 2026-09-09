#!/bin/bash

# Pre-Commit Linting Setup Script for macOS/Linux
# This script automates Husky and Lint-Staged configuration

set -e

echo "🚀 Pre-Commit Linting Setup Script"
echo "==================================="
echo ""

# Check if we're in a Node.js project
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from your project root directory."
    exit 1
fi

echo "✓ Found package.json in project root"
echo ""

# Parse flags
SKIP_PACKAGES=false
SKIP_HUSKY=false
WITH_COMMIT_LINT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-packages)
            SKIP_PACKAGES=true
            shift
            ;;
        --skip-husky)
            SKIP_HUSKY=true
            shift
            ;;
        --with-commit-lint)
            WITH_COMMIT_LINT=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Step 1: Install packages
if [ "$SKIP_PACKAGES" = false ]; then
    echo "📦 Installing packages..."

    packages=("husky" "lint-staged" "prettier")

    for package in "${packages[@]}"; do
        echo "  Installing $package..."
        npm install --save-dev "$package" > /dev/null 2>&1 && \
            echo "    ✓ $package installed" || \
            echo "    ⚠ Failed to install $package"
    done
    echo ""
fi

# Step 2: Initialize Husky
if [ "$SKIP_HUSKY" = false ]; then
    echo "🔧 Initializing Husky..."

    npx husky install > /dev/null 2>&1 && \
        echo "  ✓ Husky initialized" || \
        echo "  ⚠ Husky initialization completed"
    echo ""
fi

# Step 3: Add prepare script to package.json
echo "📝 Updating package.json..."

if command -v jq &> /dev/null; then
    if ! grep -q '"prepare"' package.json || ! grep -q 'husky install' package.json; then
        jq '.scripts.prepare = "husky install"' package.json > package.json.tmp && \
            mv package.json.tmp package.json
        echo "  ✓ Added 'prepare' script with husky install"
    else
        echo "  ✓ 'prepare' script already configured"
    fi
else
    echo "  ⚠ jq not found - please add manually to package.json:"
    echo "     \"prepare\": \"husky install\""
fi
echo ""

# Step 4: Create .husky/pre-commit hook
echo "🎣 Creating pre-commit hook..."

mkdir -p .husky

preCommitPath=".husky/pre-commit"
preCommitContent='#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged'

if [ ! -f "$preCommitPath" ]; then
    echo "$preCommitContent" > "$preCommitPath"
    chmod +x "$preCommitPath"
    echo "  ✓ Created .husky/pre-commit hook"
else
    if grep -q "lint-staged" "$preCommitPath"; then
        echo "  ✓ .husky/pre-commit hook already exists"
    else
        echo "$preCommitContent" > "$preCommitPath"
        chmod +x "$preCommitPath"
        echo "  ✓ Updated .husky/pre-commit hook"
    fi
fi
echo ""

# Step 5: Create .lintstagedrc.json
echo "⚙️  Creating .lintstagedrc.json..."

lintStagedConfig='{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,yml,yaml}": ["prettier --write"]
}'

if [ ! -f ".lintstagedrc.json" ]; then
    echo "$lintStagedConfig" > .lintstagedrc.json
    echo "  ✓ Created .lintstagedrc.json"
else
    echo "  ✓ .lintstagedrc.json already exists"
fi
echo ""

# Step 6: Create .prettierrc.json
echo "✨ Creating .prettierrc.json..."

prettierConfig='{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}'

if [ ! -f ".prettierrc.json" ]; then
    echo "$prettierConfig" > .prettierrc.json
    echo "  ✓ Created .prettierrc.json"
else
    echo "  ✓ .prettierrc.json already exists"
fi
echo ""

# Step 8: Optional - Install CommitLint
if [ "$WITH_COMMIT_LINT" = true ]; then
    echo "📝 Installing Commit Message Linting..."

    commitLintPackages=("@commitlint/cli" "@commitlint/config-conventional")

    for package in "${commitLintPackages[@]}"; do
        echo "  Installing $package..."
        npm install --save-dev "$package" > /dev/null 2>&1 && \
            echo "    ✓ $package installed" || \
            echo "    ⚠ Failed to install $package"
    done

    # Create commitlint.config.js
    commitLintConfig='module.exports = {
  extends: ["@commitlint/config-conventional"],
};'

    if [ ! -f "commitlint.config.js" ]; then
        echo "$commitLintConfig" > commitlint.config.js
        echo "  ✓ Created commitlint.config.js"
    fi

    # Add commit-msg hook
    echo "  Adding commit-msg hook..."
    npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"' > /dev/null 2>&1
    chmod +x .husky/commit-msg
    echo "    ✓ Added commit-msg hook"

    echo ""
    echo "💡 Commit Message Format:"
    echo "  type(scope): subject"
    echo ""
    echo "  Examples:"
    echo "    feat(auth): add JWT token validation"
    echo "    fix(inventory): resolve stock count bug"
    echo "    docs(api): update endpoint guide"
    echo ""
    echo "  Types: feat, fix, docs, style, refactor, perf, test, chore, ci, revert"
    echo ""
fi

# Step 9: Summary
echo "✅ Pre-Commit Linting Setup Complete!"
echo "==================================="
echo ""
echo "Configuration files created:"
echo "  • .husky/pre-commit        (Git hook)"
echo "  • .lintstagedrc.json       (Linter configuration)"
echo "  • .prettierrc.json         (Formatter configuration)"
if [ "$WITH_COMMIT_LINT" = true ]; then
    echo "  • .husky/commit-msg        (Commit message validation hook)"
    echo "  • commitlint.config.js     (Commit message rules)"
fi
echo "  • package.json             (Updated with prepare script)"
echo ""
echo "Next steps:"
echo "  1. Verify the setup:"
echo "     bash scripts/verify-setup.sh"
echo ""
echo "  2. Test pre-commit hook:"
echo "     echo 'const x;' > test.ts"
echo "     git add test.ts"
echo "     git commit -m 'test'  (should fail with ESLint error)"
echo ""
echo "  3. Fix and retry:"
echo "     rm test.ts"
echo "     git add ."
echo "     git commit -m 'fix: cleanup test file'  (should succeed)"
echo ""
if [ "$WITH_COMMIT_LINT" = true ]; then
    echo "  4. Proper commit messages required:"
    echo "     ✅ git commit -m 'feat(auth): add new feature'"
    echo "     ❌ git commit -m 'fixed bug' (will be rejected)"
    echo ""
fi
echo "For detailed documentation, see docs/PRE_COMMIT_LINTING.md"
