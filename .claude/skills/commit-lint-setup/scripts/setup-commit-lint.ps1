# Pre-Commit Linting Setup Script for Windows PowerShell
# This script automates Husky and Lint-Staged configuration

param(
    [switch]$SkipPackages = $false,
    [switch]$SkipHusky = $false,
    [switch]$WithCommitLint = $false
)

Write-Host "🚀 Pre-Commit Linting Setup Script" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a Node.js project
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from your project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found package.json in project root" -ForegroundColor Green
Write-Host ""

# Step 1: Install packages
if (-not $SkipPackages) {
    Write-Host "📦 Installing packages..." -ForegroundColor Cyan

    $packages = @(
        "husky",
        "lint-staged",
        "prettier"
    )

    foreach ($package in $packages) {
        Write-Host "  Installing $package..." -ForegroundColor Gray
        npm install --save-dev $package 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ $package installed" -ForegroundColor Green
        } else {
            Write-Host "    ⚠ Failed to install $package" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Step 2: Initialize Husky
if (-not $SkipHusky) {
    Write-Host "🔧 Initializing Husky..." -ForegroundColor Cyan

    npx husky install 2>&1 | Out-Null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Husky initialized" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Husky initialization completed" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Step 3: Add prepare script to package.json
Write-Host "📝 Updating package.json..." -ForegroundColor Cyan

$packageJson = Get-Content "package.json" | ConvertFrom-Json

if (-not $packageJson.scripts) {
    $packageJson | Add-Member -NotePropertyName "scripts" -NotePropertyValue @{}
}

if (-not $packageJson.scripts.prepare) {
    $packageJson.scripts | Add-Member -NotePropertyName "prepare" -NotePropertyValue "husky install"
    Write-Host "  ✓ Added 'prepare' script" -ForegroundColor Green
} else {
    if ($packageJson.scripts.prepare -like "*husky install*") {
        Write-Host "  ✓ 'prepare' script already has husky install" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠ 'prepare' script exists but may need husky install" -ForegroundColor Yellow
    }
}

$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
Write-Host ""

# Step 4: Create .husky/pre-commit hook
Write-Host "🎣 Creating pre-commit hook..." -ForegroundColor Cyan

$huskyDir = ".husky"

if (-not (Test-Path $huskyDir)) {
    New-Item -ItemType Directory -Path $huskyDir -Force | Out-Null
    Write-Host "  ✓ Created .husky directory" -ForegroundColor Green
}

$preCommitPath = Join-Path $huskyDir "pre-commit"
$preCommitContent = @"
#!/usr/bin/env sh
. "`$(dirname -- `"`$0`")`/_/husky.sh"

npx lint-staged
"@

if (-not (Test-Path $preCommitPath) -or -not (Select-String -Path $preCommitPath -Pattern "lint-staged" -ErrorAction SilentlyContinue)) {
    Set-Content -Path $preCommitPath -Value $preCommitContent -Encoding UTF8 -NoNewline
    Write-Host "  ✓ Created .husky/pre-commit hook" -ForegroundColor Green
} else {
    Write-Host "  ✓ .husky/pre-commit hook already exists" -ForegroundColor Gray
}
Write-Host ""

# Step 5: Create .lintstagedrc.json
Write-Host "⚙️  Creating .lintstagedrc.json..." -ForegroundColor Cyan

$lintStagedConfig = @{
    "*.{ts,tsx,js,jsx}" = @("eslint --fix", "prettier --write")
    "*.{json,md,yml,yaml}" = @("prettier --write")
}

if (-not (Test-Path ".lintstagedrc.json")) {
    $lintStagedConfig | ConvertTo-Json -Depth 10 | Set-Content ".lintstagedrc.json"
    Write-Host "  ✓ Created .lintstagedrc.json" -ForegroundColor Green
} else {
    Write-Host "  ✓ .lintstagedrc.json already exists" -ForegroundColor Gray
}
Write-Host ""

# Step 6: Create .prettierrc.json
Write-Host "✨ Creating .prettierrc.json..." -ForegroundColor Cyan

$prettierConfig = @{
    "semi" = $true
    "singleQuote" = $true
    "tabWidth" = 2
    "trailingComma" = "es5"
    "printWidth" = 100
    "arrowParens" = "always"
    "endOfLine" = "lf"
}

if (-not (Test-Path ".prettierrc.json")) {
    $prettierConfig | ConvertTo-Json -Depth 10 | Set-Content ".prettierrc.json"
    Write-Host "  ✓ Created .prettierrc.json" -ForegroundColor Green
} else {
    Write-Host "  ✓ .prettierrc.json already exists" -ForegroundColor Gray
}
Write-Host ""

# Step 8: Optional - Install CommitLint
if ($WithCommitLint) {
    Write-Host "📝 Installing Commit Message Linting..." -ForegroundColor Cyan

    $commitLintPackages = @(
        "@commitlint/cli",
        "@commitlint/config-conventional"
    )

    foreach ($package in $commitLintPackages) {
        Write-Host "  Installing $package..." -ForegroundColor Gray
        npm install --save-dev $package 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✓ $package installed" -ForegroundColor Green
        } else {
            Write-Host "    ⚠ Failed to install $package" -ForegroundColor Yellow
        }
    }

    # Create commitlint.config.js
    $commitLintConfig = @"
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
"@

    if (-not (Test-Path "commitlint.config.js")) {
        Set-Content -Path "commitlint.config.js" -Value $commitLintConfig -Encoding UTF8
        Write-Host "  ✓ Created commitlint.config.js" -ForegroundColor Green
    }

    # Add commit-msg hook
    Write-Host "  Adding commit-msg hook..." -ForegroundColor Gray
    npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"' 2>&1 | Out-Null
    Write-Host "    ✓ Added commit-msg hook" -ForegroundColor Green

    Write-Host ""
    Write-Host "💡 Commit Message Format:" -ForegroundColor Cyan
    Write-Host "  type(scope): subject" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Examples:" -ForegroundColor Gray
    Write-Host "    feat(auth): add JWT token validation" -ForegroundColor Gray
    Write-Host "    fix(inventory): resolve stock count bug" -ForegroundColor Gray
    Write-Host "    docs(api): update endpoint guide" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  Types: feat, fix, docs, style, refactor, perf, test, chore, ci, revert" -ForegroundColor Gray
    Write-Host ""
}

# Step 9: Summary
Write-Host "✅ Pre-Commit Linting Setup Complete!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration files created:" -ForegroundColor Cyan
Write-Host "  • .husky/pre-commit        (Git hook)" -ForegroundColor Gray
Write-Host "  • .lintstagedrc.json       (Linter configuration)" -ForegroundColor Gray
Write-Host "  • .prettierrc.json         (Formatter configuration)" -ForegroundColor Gray
if ($WithCommitLint) {
    Write-Host "  • .husky/commit-msg        (Commit message validation hook)" -ForegroundColor Gray
    Write-Host "  • commitlint.config.js     (Commit message rules)" -ForegroundColor Gray
}
Write-Host "  • package.json             (Updated with prepare script)" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify the setup:"
Write-Host "     bash scripts/verify-setup.sh"
Write-Host ""
Write-Host "  2. Test pre-commit hook:"
Write-Host "     echo 'const x;' > test.ts"
Write-Host "     git add test.ts"
Write-Host "     git commit -m 'test'  (should fail with ESLint error)"
Write-Host ""
Write-Host "  3. Fix and retry:"
Write-Host "     del test.ts"
Write-Host "     git add ."
Write-Host "     git commit -m 'fix: cleanup test file'  (should succeed)"
Write-Host ""
if ($WithCommitLint) {
    Write-Host "  4. Proper commit messages required:"
    Write-Host "     ✅ git commit -m 'feat(auth): add new feature'"
    Write-Host "     ❌ git commit -m 'fixed bug' (will be rejected)"
    Write-Host ""
}
Write-Host "For detailed documentation, see docs/PRE_COMMIT_LINTING.md" -ForegroundColor Gray
