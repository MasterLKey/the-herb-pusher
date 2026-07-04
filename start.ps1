# The Herb Pusher — local dev start
# Secrets are loaded from .env (gitignored)
# Usage: .\start.ps1

if (-not (Test-Path .env)) {
    Write-Error ".env file not found. Copy .env.example to .env and fill in your secrets."
    exit 1
}

Write-Host "Starting The Herb Pusher..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host ""
Write-Host "App:   http://localhost:3000" -ForegroundColor Green
Write-Host "Admin: http://localhost:3000/admin" -ForegroundColor Green
