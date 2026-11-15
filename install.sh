#!/usr/bin/env bash
# Symlink every skill in ./skills into ~/.claude/skills. Safe to re-run.
set -euo pipefail
src="$(cd "$(dirname "$0")" && pwd)/skills"
dest="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
mkdir -p "$dest"
for d in "$src"/*/; do
  name="$(basename "$d")"
  target="$dest/$name"
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "skip $name: $target exists and is not a symlink" >&2
    continue
  fi
  ln -sfn "${d%/}" "$target"
  echo "linked $name"
done
