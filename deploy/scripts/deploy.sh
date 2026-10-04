#!/usr/bin/env bash
# Update the server to the latest code and restart what changed.
# Usage (on the server): /opt/leafy/deploy/scripts/deploy.sh
set -euo pipefail
cd "$(dirname "$0")/../.."          # repo root

echo "→ Downloading the latest code"
git pull --ff-only

echo "→ Building and starting containers"
export GIT_COMMIT_SHA="$(git rev-parse --short HEAD)"
cd deploy
docker compose up -d --build

echo "→ Removing old images to free disk space"
docker image prune -f >/dev/null

echo "→ Status"
docker compose ps
echo "✓ Deployed ${GIT_COMMIT_SHA}"
