$ErrorActionPreference = "Stop"

$schemaPath = Join-Path $PSScriptRoot "schema.sql"
$seedPath = Join-Path $PSScriptRoot "seed.sql"

docker compose cp $schemaPath db:/tmp/kopikita-schema.sql
docker compose cp $seedPath db:/tmp/kopikita-seed.sql
docker compose exec -T db psql -U kopikita -d kopikita -v ON_ERROR_STOP=1 -f /tmp/kopikita-schema.sql
docker compose exec -T db psql -U kopikita -d kopikita -v ON_ERROR_STOP=1 -f /tmp/kopikita-seed.sql

Write-Host "Schema and seed applied successfully."
