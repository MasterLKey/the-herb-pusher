# The Herb Pusher — local dev start
# Fetches secrets from Infisical, then starts Docker Compose
# Usage: .\start.ps1

$projectId = $env:INFISICAL_PROJECT_ID
if (-not $projectId) {
    Write-Error "INFISICAL_PROJECT_ID not set. Add it to your shell profile."
    exit 1
}

Write-Host "Fetching secrets from Infisical..." -ForegroundColor Cyan

$env:POSTGRES_PASSWORD   = (infisical secrets get POSTGRES_PASSWORD   --projectId=$projectId --plain --silent 2>$null).Trim()
$env:PAYLOAD_SECRET      = (infisical secrets get PAYLOAD_SECRET      --projectId=$projectId --plain --silent 2>$null).Trim()
$env:MEILISEARCH_MASTER_KEY = (infisical secrets get MEILISEARCH_MASTER_KEY --projectId=$projectId --plain --silent 2>$null).Trim()
$env:MEILISEARCH_API_KEY = (infisical secrets get MEILISEARCH_API_KEY --projectId=$projectId --plain --silent 2>$null).Trim()
$env:R2_ACCESS_KEY_ID    = (infisical secrets get R2_ACCESS_KEY_ID    --projectId=$projectId --plain --silent 2>$null).Trim()
$env:R2_SECRET_ACCESS_KEY = (infisical secrets get R2_SECRET_ACCESS_KEY --projectId=$projectId --plain --silent 2>$null).Trim()
$env:MAILERLITE_API_KEY  = (infisical secrets get MAILERLITE_API_KEY  --projectId=$projectId --plain --silent 2>$null).Trim()

Write-Host "Starting services..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host "The Herb Pusher is starting at http://localhost:3000" -ForegroundColor Green
Write-Host "Admin panel: http://localhost:3000/admin" -ForegroundColor Green
