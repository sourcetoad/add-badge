#!/usr/bin/env bash

set -Eeo pipefail

npm run generate-samples

CURRENT_STATUS="$(git status --porcelain)"

if [[ -z "$CURRENT_STATUS" ]]; then
  exit 0
fi

echo "Git changes detected after generating samples."
echo "$CURRENT_STATUS"
exit 1
