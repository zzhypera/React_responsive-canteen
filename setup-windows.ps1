$ErrorActionPreference = "Stop"

Write-Host "Campus Canteen setup"
Write-Host "Choose one terminal for frontend and a second for backend."

$frontend = Join-Path $PSScriptRoot "frontend"
$backend = Join-Path $PSScriptRoot "backend"

if (-not (Test-Path (Join-Path $frontend "package.json"))) {
    throw "Frontend folder is missing."
}

Write-Host ""
Write-Host "Frontend:"
Write-Host "  cd `"$frontend`""
Write-Host "  npm install"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Backend:"
Write-Host "  cd `"$backend`""
Write-Host "  composer install"
Write-Host "  Copy-Item .env.example .env"
Write-Host "  php artisan key:generate"
Write-Host "  composer require laravel/sanctum"
Write-Host "  php artisan install:api"
Write-Host "  php artisan migrate --seed"
Write-Host "  php artisan serve"
Write-Host ""
Write-Host "Before migrating, configure backend/.env for your MySQL database if required."
Write-Host "The local React preview uses browser storage until API requests are wired to the Laravel endpoints."
