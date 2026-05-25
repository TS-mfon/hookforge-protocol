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
export HOOKFORGE_VERCEL_SCOPE="${VERCEL_SCOPE:-gen-daves-projects}"
export HOOKFORGE_DEPLOYER_PRIVATE_KEY="${DEPLOYER_PRIVATE_KEY:-${PRIVATE_KEY:-$(read_env_value "private key")}}"
export HOOKFORGE_XLAYER_RPC_URL="${XLAYER_RPC_URL:-${NEXT_PUBLIC_XLAYER_RPC_URL:-https://rpc.xlayer.tech}}"
export HOOKFORGE_ADMIN_ADDRESS="${ADMIN_ADDRESS:-$(read_env_value "admin address")}"
export HOOKFORGE_TREASURY_ADDRESS="${TREASURY_ADDRESS:-$(read_env_value treasury)}"
export NEXT_PUBLIC_XLAYER_RPC_URL="${NEXT_PUBLIC_XLAYER_RPC_URL:-$HOOKFORGE_XLAYER_RPC_URL}"
