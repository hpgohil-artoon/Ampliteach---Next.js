#!/bin/bash

# ESLint Setup Script for macOS/Linux
# This script automates the complete ESLint configuration setup

set -e

echo "🚀 ESLint Setup Script for ERP Project"
echo "========================================"
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
SKIP_FOLDERS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-packages)
            SKIP_PACKAGES=true
            shift
            ;;
        --skip-folders)
            SKIP_FOLDERS=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Step 1: Install ESLint packages
if [ "$SKIP_PACKAGES" = false ]; then
    echo "📦 Installing ESLint packages..."
    echo "This may take a minute..."
    echo ""

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
        echo "  Installing $package..."
        npm install --save-dev "$package" > /dev/null 2>&1 && \
            echo "    ✓ $package installed" || \
            echo "    ⚠ Failed to install $package"
    done
    echo ""
fi

# Step 2: Create folder structure
if [ "$SKIP_FOLDERS" = false ]; then
    echo "📁 Creating layer folder structure..."

    folders=("src/app" "src/modules" "src/shared" "src/lib" "src/core")

    for folder in "${folders[@]}"; do
        if [ ! -d "$folder" ]; then
            mkdir -p "$folder"
            echo "  ✓ Created $folder"
        else
            echo "  ✓ $folder already exists"
        fi
    done
    echo ""
fi

# Step 3: Add lint scripts to package.json
echo "🔧 Updating package.json scripts..."

# Use jq if available, otherwise use sed
if command -v jq &> /dev/null; then
    # Using jq for safe JSON manipulation
    if ! grep -q '"lint"' package.json; then
        jq '.scripts.lint = "eslint src"' package.json > package.json.tmp && \
            mv package.json.tmp package.json
        echo "  ✓ Added 'lint' script"
    else
        echo "  ✓ 'lint' script already exists"
    fi

    if ! grep -q '"lint:fix"' package.json; then
        jq '.scripts."lint:fix" = "eslint src --fix"' package.json > package.json.tmp && \
            mv package.json.tmp package.json
        echo "  ✓ Added 'lint:fix' script"
    else
        echo "  ✓ 'lint:fix' script already exists"
    fi
else
    echo "  ⚠ jq not found - please add scripts manually to package.json:"
    echo "      \"lint\": \"eslint src\","
    echo "      \"lint:fix\": \"eslint src --fix\""
fi
echo ""

# Step 4: Check/create tsconfig.json with @ alias
echo "⚙️  Verifying tsconfig.json configuration..."

if [ -f "tsconfig.json" ]; then
    if grep -q '"@/\*"' tsconfig.json; then
        echo "  ✓ @/ alias already configured"
    else
        echo "  ⚠ @/ alias not found in tsconfig.json"
        echo "     Please add to compilerOptions.paths:"
        echo "     \"@/*\": [\"./src/*\"]"
    fi
else
    echo "  ⚠ tsconfig.json not found - please configure @/ alias manually"
fi
echo ""

# Step 5: Summary
echo "✅ ESLint Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Copy eslint.config.js to your project root"
echo "     (Get it from the skill's references/ folder)"
echo ""
echo "  2. Run linter to check for violations:"
echo "     npm run lint"
echo ""
echo "  3. Auto-fix naming and formatting violations:"
echo "     npm run lint:fix"
echo ""
echo "  4. Fix architecture violations manually by reviewing"
echo "     import rules in the output"
echo ""
echo "For detailed documentation, see docs/ESLINT_SETUP.md"
