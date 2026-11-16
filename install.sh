#!/usr/bin/env bash
# Symlink every skill in ./skills into ~/.claude/skills and every rule file
# (./rules/*.md) and rule docs directory (./rules/<name>/) into ~/.claude/rules
# (Claude loads those every session).
# Also removes links into this repo whose target no longer exists (a skill or
# rule that was renamed or deleted). Links to anywhere else are left alone.
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

prune() { # prune <dest dir>: remove dead links that point into this repo
  for l in "$1"/*; do
    [ -L "$l" ] && [ ! -e "$l" ] || continue
    case "$(readlink "$l")" in
      "$root"/*) rm "$l"; echo "removed dead link $(basename "$l")" ;;
    esac
  done
}

mkdir -p "$skills_dest" "$rules_dest"
prune "$skills_dest"
prune "$rules_dest"
for d in "$root"/skills/*/; do
  link "${d%/}" "$skills_dest/$(basename "$d")" "skill $(basename "$d")"
done
for f in "$root"/rules/*; do
  [ -d "$f" ] || [ "${f##*.}" = md ] || continue
  link "${f%/}" "$rules_dest/$(basename "$f")" "rule $(basename "$f")"
done
