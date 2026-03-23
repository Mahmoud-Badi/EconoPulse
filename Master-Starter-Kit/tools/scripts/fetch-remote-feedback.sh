#!/usr/bin/env bash
# Fetch Kit Feedback from Remote Repositories
#
# Reads feedback-inbox/project-registry.json and fetches .kit-feedback.json
# from all registered remote repos. Deposits them into feedback-inbox/
# for /kit-harvest to process.
#
# Methods (tried in order):
# 1. GitHub API (if gh CLI is available and repo is on GitHub)
# 2. git archive (lightweight, no full clone)
# 3. git clone --depth 1 (fallback)
#
# Usage: bash tools/scripts/fetch-remote-feedback.sh

set -euo pipefail

REGISTRY="feedback-inbox/project-registry.json"
INBOX="feedback-inbox"
TEMP_DIR=$(mktemp -d)

trap 'rm -rf "$TEMP_DIR"' EXIT

if [ ! -f "$REGISTRY" ]; then
  echo "No project registry found at $REGISTRY"
  exit 0
fi

# Parse remote repos (skip _example entries)
REPOS=$(python3 -c "
import json, sys
try:
    with open('$REGISTRY') as f:
        data = json.load(f)
    for repo in data.get('remote_repos', []):
        if repo.get('_example'):
            continue
        url = repo.get('url', '')
        branch = repo.get('branch', 'main')
        name = repo.get('name', 'unknown')
        if url:
            print(f'{url}|{branch}|{name}')
except Exception as e:
    print(f'ERROR: {e}', file=sys.stderr)
" 2>/dev/null || echo "")

if [ -z "$REPOS" ]; then
  echo "No remote repos registered (or all are examples). Add repos to $REGISTRY"
  exit 0
fi

FETCHED=0
FAILED=0

while IFS='|' read -r URL BRANCH NAME; do
  [ -z "$URL" ] && continue
  echo "Fetching feedback from: $NAME ($URL)..."

  SAFE_NAME=$(echo "$NAME" | tr ' /' '-' | tr '[:upper:]' '[:lower:]')
  TARGET="$INBOX/${SAFE_NAME}.kit-feedback.json"

  SUCCESS=false

  # Method 1: GitHub API via gh CLI
  if command -v gh &> /dev/null && [[ "$URL" == *"github.com"* ]]; then
    # Extract owner/repo from URL
    OWNER_REPO=$(echo "$URL" | sed 's|.*github.com[/:]||' | sed 's|\.git$||')

    # Try to fetch .kit-feedback.json via GitHub API
    if gh api "repos/$OWNER_REPO/contents/.kit-feedback.json?ref=$BRANCH" --jq '.content' 2>/dev/null | base64 -d > "$TEMP_DIR/feedback.json" 2>/dev/null; then
      if [ -s "$TEMP_DIR/feedback.json" ] && python3 -c "import json; json.load(open('$TEMP_DIR/feedback.json'))" 2>/dev/null; then
        cp "$TEMP_DIR/feedback.json" "$TARGET"
        echo "  Fetched via GitHub API"
        SUCCESS=true
      fi
    fi

    # If file not found, check if it's an auth issue vs missing file
    if ! $SUCCESS; then
      HTTP_STATUS=$(gh api "repos/$OWNER_REPO" --jq '.id' 2>&1)
      if echo "$HTTP_STATUS" | grep -qi "not found\|403\|404"; then
        echo "  No access — ask the repo owner to add you as a collaborator (read-only)"
        echo "  They run: gh repo collaborators add $OWNER_REPO YOUR_GITHUB_USERNAME --permission read"
      else
        echo "  No .kit-feedback.json in repo (project may not have generated feedback yet)"
      fi
    fi
  fi

  # Method 2: git archive (no full clone)
  if ! $SUCCESS; then
    if git archive --remote="$URL" "$BRANCH" .kit-feedback.json 2>/dev/null | tar -xf - -C "$TEMP_DIR" 2>/dev/null; then
      if [ -f "$TEMP_DIR/.kit-feedback.json" ] && [ -s "$TEMP_DIR/.kit-feedback.json" ]; then
        cp "$TEMP_DIR/.kit-feedback.json" "$TARGET"
        echo "  Fetched via git archive"
        SUCCESS=true
      fi
    fi
  fi

  # Method 3: Shallow clone (fallback)
  if ! $SUCCESS; then
    CLONE_DIR="$TEMP_DIR/clone-$SAFE_NAME"
    if git clone --depth 1 --branch "$BRANCH" --filter=blob:none --sparse "$URL" "$CLONE_DIR" 2>/dev/null; then
      cd "$CLONE_DIR"
      git sparse-checkout set .kit-feedback.json 2>/dev/null || true
      cd - > /dev/null
      if [ -f "$CLONE_DIR/.kit-feedback.json" ] && [ -s "$CLONE_DIR/.kit-feedback.json" ]; then
        cp "$CLONE_DIR/.kit-feedback.json" "$TARGET"
        echo "  Fetched via shallow clone"
        SUCCESS=true
      fi
    fi
  fi

  if $SUCCESS; then
    FETCHED=$((FETCHED + 1))
  else
    echo "  No feedback found (or repo not accessible)"
    FAILED=$((FAILED + 1))
  fi

done <<< "$REPOS"

echo ""
echo "Remote fetch complete: $FETCHED repos with feedback, $FAILED without"
