---
name: no-excuses
description: Stop agents from using code comments as an excuse to skip real work. Governs writing code comments (a comment never stands in for solving the problem) and audits a diff for excuse comments like TODO, "for now", "simplified", "assume", lint/type suppressions, and commented-out code. Use whenever writing or editing code, before finishing a change, or when asked to review comments.
---

# No excuses (a comment is never a substitute for the work)

Core rule: **if the code is incomplete, wrong, or unsafe, a comment does not
fix it.** Do the work, or tell the user about the gap in your reply and ask.
Never park the gap in a comment and move on.

Two modes: **Write** (applies to every code edit you make) and **Review**
(audit a diff or file). Load the language file in `references/` matching the
code (TypeScript/JavaScript: `references/typescript.md`). No file for the
language: use the core rules and say so.

## Write: rules while coding
1. Before adding any comment, ask: "am I writing this because the code
   cannot or does not do the right thing?" If yes, stop. Fix the code. If it
   truly cannot be fixed in this change, put it in your reply to the user,
   not in the code.
2. A comment explains **why** something non-obvious is the way it is, never
   **what** the code does, and never **what it should do but doesn't**.
3. Allowed: a real constraint with evidence (an external API quirk, a
   measured performance reason, a spec or ticket link, an invariant the
   types cannot express), and doc comments on public APIs.
4. Not allowed as stand-ins for work: deferred-work markers, hedges,
   descriptions of missing behavior, suppressions, and dead code (below).
5. A deferral is allowed only if the **user explicitly approved it in this
   conversation** and it is tracked outside the code (issue/ticket). Cite the
   ticket in the comment, and list it in your final reply. Never decide this
   yourself.
6. Comments must match the code. When you change code, update or delete the
   comment above it.

## Excuse comments (never write these; flag them in review)
- **Deferral**: `TODO`, `FIXME`, `HACK`, `XXX`, "for now", "temporary",
  "later", "quick fix", "good enough", "placeholder", "stub".
- **Hedging away the gap**: "in production you would...", "in a real app",
  "simplified", "assumes", "should be", "not handled", "not implemented",
  "out of scope".
- **Excusing a skipped safeguard**: a comment next to missing validation,
  error handling, auth, a test, or an empty `catch` explaining why it is fine.
- **Suppressions with a reason attached**: lint disables, type-check
  ignores, coverage ignores, skipped tests (see language file). The reason
  does not make the problem go away; fix the cause.
- **Commented-out code.** Delete it; version control keeps it.
- **Narrating the change**: "added X", "changed to Y", "fixed bug". That
  belongs in the commit message.
- **Restating the code**: `// increment i`. Delete.
- **Lying or stale comments** that contradict the code.

## Review: audit a change
1. Get the added lines: `git diff -U0` (or the files named). Candidate finder,
   not a verdict:
   `git diff -U0 | grep -nE '^\+.*(TODO|FIXME|HACK|XXX|for now|temporar|placeholder|stub|simplif|real app|production|good enough|quick fix|assum|not (yet )?(implemented|handled|supported))'`
   Then scan every added comment line, not just the matches; the worst
   excuses are phrased in ways a grep misses.
2. Classify each comment:
   - **Excuse**: covers for incomplete or unsafe work. Fix the code, then
     remove the comment.
   - **Suppression**: fix the underlying error, or justify per the language
     file.
   - **Dead/narrating/restating**: delete.
   - **Stale or wrong**: fix or delete.
   - **Legitimate why / API doc**: keep.
3. Report by class with `file:line`. For each Excuse,
   state what real work it is hiding. Do not just delete the comment and leave the gap: either fix
   the gap (if asked to) or surface it.
4. Self-check before you finish any coding task: run the grep on your own
   diff and justify or remove every hit.

## The delete test (the tiebreaker)
Imagine deleting the comment.
- Code would be *wrong or surprising for a reason the code cannot fix*
  (an API that returns 200 on failure, a spec quirk): **keep it.**
- Code would just be *incomplete or hard to defend* (`// TODO: validate`):
  **it was an excuse.** Do the work.
