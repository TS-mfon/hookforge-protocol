#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="/home/sudodave/buildenv/.env"

read_env_value() {
  local wanted="$1"
  local value=""
  if [[ -f "$ENV_FILE" ]]; then
    while IFS='=' read -r key raw || [[ -n "${key:-}" ]]; do
      key="$(printf '%s' "$key" | tr '[:upper:]' '[:lower:]' | xargs)"
      raw="${raw:-}"
      raw="${raw%$'\r'}"
      raw="${raw%\"}"
      raw="${raw#\"}"
      raw="$(printf '%s' "$raw" | xargs)"
      if [[ "$key" == "$wanted" ]]; then
        value="$raw"
      fi
    done < "$ENV_FILE"
  fi
  printf '%s' "$value"
}

export HOOKFORGE_GITHUB_TOKEN="${GITHUB_TOKEN:-$(read_env_value github)}"
export HOOKFORGE_VERCEL_TOKEN="${VERCEL_TOKEN:-$(read_env_value vercel)}"
export HOOKFORGE_GITHUB_PRIVATE="${GITHUB_PRIVATE:-false}"
