---
name: wrap-up
description: End-of-session note. Drafts a short "where I am / next step" entry from the current session and appends it, once approved, to today's daily note in the user's Obsidian vault. Use when the user says wrap up, end of session, save my place, log today's work, or /wrap-up.
---

# Wrap-up (save your place, 30 seconds)

Goal: future-you can resume in two minutes. Keep it tiny and accurate.

## Where notes go
Daily file: `$WRAP_UP_DIR/YYYY-MM-DD.md` if the env var `WRAP_UP_DIR` is set,
otherwise `~/Documents/Projects/Work Log/YYYY-MM-DD.md`. Create the
folder or file if missing. Use today's local date. Append a new section;
never overwrite or reorder existing content.

## Steps
1. Gather facts from the session and the repo: repo name, `git branch
   --show-current`, latest commit/PR links, and the design doc or file being
   worked on. Do not guess; leave a field blank rather than invent it.
2. Draft the entry in exactly this format:

```
## <HH:MM> <repo> / <branch>
- Where I am:
- Decided: (only real decisions, with the reason in a few words)
- Open questions: (and who to ask)
- Next step: (the single next action)
- Links: (PRs, docs, commits, file paths)
```

3. Show the draft and ask the user to approve or edit. Write nothing until
   they approve.
4. Append the approved entry to the daily file and tell the user the path.

## Rules
- References, not content: file paths, PR links, commit hashes. No pasted
  code, no secrets, tokens, credentials, or customer data.
- Max ~10 lines per entry. If it is longer, cut it.
- Mark anything the user said they were unsure about as unsure; do not
  restate a guess as a fact.
- If a decision is important, remind the user to promote it to the design
  doc or the project decision log; this note is a log, not the record.
