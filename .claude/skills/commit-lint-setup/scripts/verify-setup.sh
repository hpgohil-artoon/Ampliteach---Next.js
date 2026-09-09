#!/bin/bash

# Pre-Commit Linting Setup Verification Script
# This script checks that all components are properly configured

echo "🔍 Pre-Commit Linting Setup Verification"
echo "========================================="
echo ""

ERRORS=0
WARNINGS=0

# 1. Check package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    ERRORS=$((ERRORS + 1))
else
    echo "✓ package.json found"
fi

# 2. Check packages installed
echo ""
echo "📦 Checking installed packages..."

packages=("husky" "lint-staged" "prettier")

for package in "${packages[@]}"; do
    if npm list "$package" > /dev/null 2>&1; then
        echo "  ✓ $package installed"
    else
        echo "  ❌ $package NOT installed"
        ERRORS=$((ERRORS + 1))
    fi
done

# 3. Check prepare script
echo ""
echo "📝 Checking package.json scripts..."

if grep -q '"prepare"' package.json; then
    if grep -q 'husky install' package.json; then
        echo "  ✓ 'prepare' script with husky install exists"
    else
        echo "  ⚠ 'prepare' script exists but may not have husky install"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "  ⚠ 'prepare' script not found"
    WARNINGS=$((WARNINGS + 1))
fi

# 4. Check .husky directory
echo ""
echo "🎣 Checking Husky setup..."

if [ -d ".husky" ]; then
    echo "  ✓ .husky directory exists"

    if [ -f ".husky/pre-commit" ]; then
        echo "  ✓ .husky/pre-commit hook exists"

        if [ -x ".husky/pre-commit" ]; then
            echo "  ✓ .husky/pre-commit is executable"
        else
            echo "  ⚠ .husky/pre-commit is not executable"
            echo "     Run: chmod +x .husky/pre-commit"
            WARNINGS=$((WARNINGS + 1))
        fi

        if grep -q "lint-staged" ".husky/pre-commit"; then
            echo "  ✓ .husky/pre-commit configured to run lint-staged"
        else
            echo "  ⚠ .husky/pre-commit doesn't call lint-staged"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo "  ❌ .husky/pre-commit hook not found"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "  ❌ .husky directory not found"
    ERRORS=$((ERRORS + 1))
fi

# 5. Check configuration files
echo ""
echo "⚙️  Checking configuration files..."

if [ -f ".lintstagedrc.json" ]; then
    echo "  ✓ .lintstagedrc.json exists"

    if grep -q "eslint" ".lintstagedrc.json" && grep -q "prettier" ".lintstagedrc.json"; then
        echo "  ✓ .lintstagedrc.json has eslint and prettier configured"
    else
        echo "  ⚠ .lintstagedrc.json may be missing linter configuration"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "  ⚠ .lintstagedrc.json not found"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -f ".prettierrc.json" ]; then
    echo "  ✓ .prettierrc.json exists"
else
    echo "  ⚠ .prettierrc.json not found"
    WARNINGS=$((WARNINGS + 1))
fi

# 6. Try running pre-commit hook
echo ""
echo "🏃 Testing pre-commit hook..."

if command -v npm &> /dev/null; then
    # Create a test file
    testFile="test-lint-$(date +%s).ts"
    echo "const x = 1;" > "$testFile"
    git add "$testFile" 2>/dev/null || true

    if npx lint-staged > /dev/null 2>&1; then
        echo "  ✓ lint-staged runs successfully"
    else
        echo "  ⚠ lint-staged encountered issues (may be normal if files have errors)"
    fi

    # Clean up test file
    rm -f "$testFile" 2>/dev/null || true
else
    echo "  ⚠ npm not found - cannot test lint-staged"
fi

# 7. Summary
echo ""
echo "========================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Setup is complete."
    echo ""
    echo "Now test with:"
    echo "  echo 'const x;' > test.ts"
    echo "  git add test.ts"
    echo "  git commit -m 'test'  (should fail)"
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Setup complete with $WARNINGS warnings"
    echo ""
    echo "Review warnings above and fix issues."
    echo "Run: chmod +x .husky/pre-commit (if needed)"
else
    echo "❌ Setup incomplete - $ERRORS errors, $WARNINGS warnings"
    echo ""
    echo "Please review errors above and:"
    echo "1. Run the setup script: bash setup-commit-lint.sh"
    echo "2. Or follow manual setup steps in SKILL.md"
fi
