# ESLint Setup Script for Windows PowerShell
# This script automates the complete ESLint configuration setup

param(
    [switch]$SkipPackages = $false,
    [switch]$SkipFolders = $false
)

Write-Host "🚀 ESLint Setup Script for ERP Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a Node.js project
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from your project root directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found package.json in project root" -ForegroundColor Green
Write-Host ""

# Step 1: Install ESLint packages
if (-not $SkipPackages) {
    Write-Host "📦 Installing ESLint packages..." -ForegroundColor Cyan
    Write-Host "This may take a minute..." -ForegroundColor Yellow

    $packages = @(
        "eslint",
        "@eslint/js",
        "globals",
        "typescript-eslint",
        "eslint-plugin-react-hooks",
        "eslint-plugin-react-refresh",
        "eslint-plugin-import",
        "eslint-import-resolver-typescript",
        "eslint-plugin-check-file"
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

# Step 2: Create folder structure
if (-not $SkipFolders) {
    Write-Host "📁 Creating layer folder structure..." -ForegroundColor Cyan

    $folders = @("src/app", "src/modules", "src/shared", "src/lib", "src/core")

    foreach ($folder in $folders) {
        if (-not (Test-Path $folder)) {
            New-Item -ItemType Directory -Path $folder -Force | Out-Null
            Write-Host "  ✓ Created $folder" -ForegroundColor Green
        } else {
            Write-Host "  ✓ $folder already exists" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Step 3: Add lint scripts to package.json
Write-Host "🔧 Updating package.json scripts..." -ForegroundColor Cyan

$packageJson = Get-Content "package.json" | ConvertFrom-Json

if (-not $packageJson.scripts) {
    $packageJson | Add-Member -NotePropertyName "scripts" -NotePropertyValue @{}
}

if (-not $packageJson.scripts.lint) {
    $packageJson.scripts | Add-Member -NotePropertyName "lint" -NotePropertyValue "eslint src"
    Write-Host "  ✓ Added 'lint' script" -ForegroundColor Green
} else {
    Write-Host "  ✓ 'lint' script already exists" -ForegroundColor Gray
}

if (-not $packageJson.scripts.'lint:fix') {
    $packageJson.scripts | Add-Member -NotePropertyName "lint:fix" -NotePropertyValue "eslint src --fix"
    Write-Host "  ✓ Added 'lint:fix' script" -ForegroundColor Green
} else {
    Write-Host "  ✓ 'lint:fix' script already exists" -ForegroundColor Gray
}

$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
Write-Host ""

# Step 4: Check/create tsconfig.json with @ alias
Write-Host "⚙️  Verifying tsconfig.json configuration..." -ForegroundColor Cyan

if (Test-Path "tsconfig.json") {
    $tsconfig = Get-Content "tsconfig.json" | ConvertFrom-Json

    if (-not $tsconfig.compilerOptions.paths) {
        $tsconfig.compilerOptions.paths = @{
            "@/*" = @("./src/*")
        }
        $tsconfig | ConvertTo-Json -Depth 10 | Set-Content "tsconfig.json"
        Write-Host "  ✓ Added @/ alias path to tsconfig.json" -ForegroundColor Green
    } else {
        Write-Host "  ✓ @/ alias already configured" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⚠ tsconfig.json not found - please configure @/ alias manually" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Summary
Write-Host "✅ ESLint Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Copy eslint.config.js to your project root"
Write-Host "     (Get it from the skill's references/ folder)"
Write-Host ""
Write-Host "  2. Run linter to check for violations:"
Write-Host "     npm run lint"
Write-Host ""
Write-Host "  3. Auto-fix naming and formatting violations:"
Write-Host "     npm run lint:fix"
Write-Host ""
Write-Host "  4. Fix architecture violations manually by reviewing"
Write-Host "     import rules in the output"
Write-Host ""
Write-Host "For detailed documentation, see docs/ESLINT_SETUP.md" -ForegroundColor Gray
