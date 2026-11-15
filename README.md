# skills

Personal Claude Code skills. Install on any machine:

```
git clone https://github.com/breyr/skills.git ~/skills && ~/skills/install.sh
```

Skills are symlinked into `~/.claude/skills`, so `git pull` updates them.

Add a skill: create `skills/<name>/SKILL.md` (with `name` and `description`
frontmatter), re-run `install.sh`.

## Skills
- `design-doc-review`: check a design doc against the codebase without redesigning it.
- `design-doc-draft`: idea -> interview -> user's decisions -> short design doc with cited current behavior.
- `design-doc-refresh`: rebuild context on an old design doc (timeline, code drift, citation check, defense quiz, status block).
- `wrap-up`: end-of-session note appended to a daily Obsidian note (set `WRAP_UP_DIR` to change the folder).
- `code-map`: one-page, code-cited map of how any area of code works, with Mermaid flow diagrams.
