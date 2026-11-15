# skills

Personal Claude Code skills. Requires [git](https://git-scm.com).

## Install

### macOS / Linux

```
git clone https://github.com/breyr/skills.git ~/skills
~/skills/install.sh
```

### Windows (PowerShell)

```
git clone https://github.com/breyr/skills.git $HOME\skills
powershell -ExecutionPolicy Bypass -File $HOME\skills\install.ps1
```

This links each skill into `%USERPROFILE%\.claude\skills` with directory
junctions (no admin rights needed). If you run Claude Code inside WSL, use
the macOS / Linux steps from the WSL shell instead.

## Update

```
git -C ~/skills pull        # Windows: git -C $HOME\skills pull
```

Existing skills update immediately because they are links. After pulling a
**new** skill, re-run the install script to link it. Then restart Claude Code
so it picks up new skills.

## Add a skill

Create `skills/<name>/SKILL.md` (with `name` and `description` frontmatter),
then re-run the install script.

## Skills
- `design-doc-review`: check a design doc against the codebase without redesigning it.
- `design-doc-draft`: idea -> interview -> user's decisions -> short design doc with cited current behavior.
- `design-doc-refresh`: rebuild context on an old design doc (timeline, code drift, citation check, defense quiz, status block).
- `wrap-up`: end-of-session note appended to a daily Obsidian note (set `WRAP_UP_DIR` to change the folder).
- `code-map`: one-page, code-cited map of how any area of code works, with Mermaid flow diagrams.
