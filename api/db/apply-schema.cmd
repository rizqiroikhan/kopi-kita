@echo off
setlocal

docker compose cp "%~dp0schema.sql" db:/tmp/kopikita-schema.sql
if errorlevel 1 exit /b 1

docker compose cp "%~dp0seed.sql" db:/tmp/kopikita-seed.sql
if errorlevel 1 exit /b 1

docker compose exec -T db psql -U kopikita -d kopikita -v ON_ERROR_STOP=1 -f /tmp/kopikita-schema.sql
if errorlevel 1 exit /b 1

docker compose exec -T db psql -U kopikita -d kopikita -v ON_ERROR_STOP=1 -f /tmp/kopikita-seed.sql
if errorlevel 1 exit /b 1

echo Schema and seed applied successfully.
