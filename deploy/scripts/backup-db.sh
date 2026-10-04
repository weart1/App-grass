#!/usr/bin/env bash
# Save a compressed copy of the database and keep the last 14 days.
# Run daily from cron (see deploy/README.md, step 9).
set -euo pipefail
cd "$(dirname "$0")/.."             # deploy/
mkdir -p backups
file="backups/leafy-$(date +%Y-%m-%d_%H-%M).sql.gz"
docker compose exec -T postgres pg_dump -U leafy leafy | gzip > "$file"
find backups -name 'leafy-*.sql.gz' -mtime +14 -delete
echo "✓ Backup saved: $file"
