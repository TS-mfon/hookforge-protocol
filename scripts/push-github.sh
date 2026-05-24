#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT/scripts/env.sh"

if [[ -z "${HOOKFORGE_GITHUB_TOKEN:-}" ]]; then
  echo "Missing GitHub token in /home/sudodave/buildenv/.env"
  exit 1
fi

cd "$ROOT"
if [[ ! -d .git ]]; then
  git init
fi

git add .
if ! git diff --cached --quiet; then
  git commit -m "feat: build hookforge adaptive market protocol"
fi

export GH_TOKEN="$HOOKFORGE_GITHUB_TOKEN"
owner="$(gh api user --jq .login)"
repo="hookforge-protocol"
git_auth="$(printf 'x-access-token:%s' "$HOOKFORGE_GITHUB_TOKEN" | base64 -w0)"
visibility="--public"
if [[ "$HOOKFORGE_GITHUB_PRIVATE" == "true" ]]; then
  visibility="--private"
fi

if ! gh repo view "$owner/$repo" >/dev/null 2>&1; then
  gh repo create "$owner/$repo" "$visibility" --source=. --remote=origin --push
else
  git remote remove origin >/dev/null 2>&1 || true
  git remote add origin "https://github.com/$owner/$repo.git"
  git -c http.extraheader="AUTHORIZATION: basic $git_auth" push -u origin HEAD
fi

echo "https://github.com/$owner/$repo"
