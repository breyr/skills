#!/usr/bin/env bash
# Symlink every skill in ./skills into ~/.claude/skills and every rule file
# (./rules/*.md) and rule docs directory (./rules/<name>/) into ~/.claude/rules
# (Claude loads those every session).
# Safe to re-run.
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd)"
skills_dest="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
rules_dest="${CLAUDE_RULES_DIR:-$HOME/.claude/rules}"

link() { # link <source> <target> <label>
  if [ -e "$2" ] && [ ! -L "$2" ]; then
    echo "skip $3: $2 exists and is not a symlink" >&2
    return
  fi
  ln -sfn "$1" "$2"
  echo "linked $3"
}

mkdir -p "$skills_dest" "$rules_dest"
for d in "$root"/skills/*/; do
  link "${d%/}" "$skills_dest/$(basename "$d")" "skill $(basename "$d")"
done
for f in "$root"/rules/*; do
  [ -d "$f" ] || [ "${f##*.}" = md ] || continue
  link "${f%/}" "$rules_dest/$(basename "$f")" "rule $(basename "$f")"
done
