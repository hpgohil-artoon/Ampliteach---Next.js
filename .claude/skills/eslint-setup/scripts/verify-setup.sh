#!/bin/bash

# ESLint Setup Verification Script
# This script checks that all ESLint components are properly configured

echo "🔍 ESLint Setup Verification"
echo "============================="
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

# 2. Check ESLint packages installed
echo ""
echo "📦 Checking ESLint packages..."

packages=(
    "eslint"
    "@eslint/js"
    "globals"
    "typescript-eslint"
    "eslint-plugin-react-hooks"
    "eslint-plugin-react-refresh"
    "eslint-plugin-import"
    "eslint-import-resolver-typescript"
    "eslint-plugin-check-file"
)

for package in "${packages[@]}"; do
    if npm list "$package" > /dev/null 2>&1; then
        echo "  ✓ $package installed"
    else
        echo "  ❌ $package NOT installed"
        ERRORS=$((ERRORS + 1))
    fi
done

# 3. Check scripts in package.json
echo ""
echo "🔧 Checking package.json scripts..."

if grep -q '"lint"' package.json; then
    echo "  ✓ 'lint' script exists"
else
    echo "  ⚠ 'lint' script not found"
    WARNINGS=$((WARNINGS + 1))
fi

if grep -q '"lint:fix"' package.json; then
    echo "  ✓ 'lint:fix' script exists"
else
    echo "  ⚠ 'lint:fix' script not found"
    WARNINGS=$((WARNINGS + 1))
fi

# 4. Check eslint.config.js
echo ""
echo "⚙️  Checking eslint.config.js..."

if [ -f "eslint.config.js" ]; then
    echo "  ✓ eslint.config.js exists"

    if grep -q "check-file" eslint.config.js; then
        echo "  ✓ Naming convention rules configured"
    else
        echo "  ⚠ Naming convention rules may not be configured"
        WARNINGS=$((WARNINGS + 1))
    fi

    if grep -q "import/no-restricted-paths" eslint.config.js; then
        echo "  ✓ Architecture rules configured"
    else
        echo "  ⚠ Architecture rules may not be configured"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "  ❌ eslint.config.js not found"
    ERRORS=$((ERRORS + 1))
fi

# 5. Check folder structure
echo ""
echo "📁 Checking layer folder structure..."

folders=("src/app" "src/modules" "src/shared" "src/lib" "src/core")

for folder in "${folders[@]}"; do
    if [ -d "$folder" ]; then
        echo "  ✓ $folder exists"
    else
        echo "  ⚠ $folder not found"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# 6. Check tsconfig.json
echo ""
echo "🔐 Checking tsconfig.json..."

if [ -f "tsconfig.json" ]; then
    echo "  ✓ tsconfig.json exists"

    if grep -q '"@/\*"' tsconfig.json; then
        echo "  ✓ @/ alias configured"
    else
        echo "  ⚠ @/ alias not found in tsconfig.json"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "  ⚠ tsconfig.json not found"
    WARNINGS=$((WARNINGS + 1))
fi

# 7. Try to run lint
echo ""
echo "🏃 Running ESLint test..."

if command -v npm &> /dev/null; then
    if npm run lint > /dev/null 2>&1; then
        echo "  ✓ ESLint runs successfully (0 violations)"
    else
        echo "  ⚠ ESLint found violations"
        echo "     Run 'npm run lint:fix' to auto-fix violations"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo "  ⚠ npm not found - cannot test ESLint"
fi

# Summary
echo ""
echo "============================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ All checks passed! Setup is complete."
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  Setup complete with $WARNINGS warnings"
    echo "Run 'npm run lint:fix' to auto-fix issues"
else
    echo "❌ Setup incomplete - $ERRORS errors, $WARNINGS warnings"
    echo "Please review the eslint-setup skill for help"
fi
