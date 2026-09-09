#!/usr/bin/env bash
# Finds the branch point for the current branch and prints everything needed
# to write an MR description from it: the merge-base, the commit log since
# that point (context only — commit messages are often terse/stale, don't
# quote them as the source of truth), the full list of changed files
# (committed AND still-uncommitted), and a diffstat.
#
# Usage: get-branch-diff.sh [explicit-base-branch]
#   With no argument, tries development/develop/main/master in that order —
#   whichever exists first (preferring the remote-tracking ref if present).

set -euo pipefail

CANDIDATES=("development" "develop" "main" "master")
BASE="${1:-}"

branch_exists() {
  git show-ref --verify --quiet "refs/heads/$1" || git show-ref --verify --quiet "refs/remotes/origin/$1"
}

if [ -z "$BASE" ]; then
  for c in "${CANDIDATES[@]}"; do
    if branch_exists "$c"; then
      BASE="$c"
      break
    fi
  done
fi

if [ -z "$BASE" ]; then
  echo "ERROR: could not find a base branch (tried: ${CANDIDATES[*]})." >&2
  echo "Pass one explicitly: get-branch-diff.sh <base-branch>" >&2
  exit 1
fi

if git show-ref --verify --quiet "refs/remotes/origin/$BASE"; then
  BASE_REF="origin/$BASE"
else
  BASE_REF="$BASE"
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$CURRENT_BRANCH" = "$BASE" ]; then
  echo "ERROR: you're on '$BASE' itself — there's no branch diff to describe." >&2
  echo "Check out the feature branch first, or pass a different base branch." >&2
  exit 1
fi

MERGE_BASE=$(git merge-base "$BASE_REF" HEAD)

echo "CURRENT_BRANCH=$CURRENT_BRANCH"
echo "BASE_BRANCH=$BASE"
echo "BASE_REF=$BASE_REF"
echo "MERGE_BASE=$MERGE_BASE"
echo
echo "--- COMMIT LOG since branch point (context only — see note above) ---"
git log --oneline "$MERGE_BASE"..HEAD || echo "(no commits yet — everything is uncommitted)"
echo
echo "--- CHANGED FILES since branch point, committed + uncommitted (name-status) ---"
git diff --name-status "$MERGE_BASE"
echo
echo "--- DIFFSTAT ---"
git diff --stat "$MERGE_BASE"
