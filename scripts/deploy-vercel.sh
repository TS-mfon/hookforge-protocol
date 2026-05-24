#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT/scripts/env.sh"

if [[ -z "${HOOKFORGE_VERCEL_TOKEN:-}" ]]; then
  echo "Missing Vercel token in /home/sudodave/buildenv/.env"
  exit 1
fi

cd "$ROOT/apps/web"
npx vercel --yes --prod --token "$HOOKFORGE_VERCEL_TOKEN"
