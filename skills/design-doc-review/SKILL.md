---
name: design-doc-review
description: Review an implementation-level design doc against the actual codebase as a conformance check, not a redesign. Use when the user asks to review, sanity-check, or validate a design doc against code.
---

# Design doc review (conformance check, not redesign)

You are reviewing an implementation-level design doc against the actual codebase.
The design is fixed. Your job is to find where it conflicts with the code.

## Before starting

Ask the user for (skip if already given):
1. The design doc (path or pasted).
2. **Locked decisions**: choices already made that must not be relitigated.

## Rules

- Do not propose alternative designs, rewrite sections, or edit the document.
- If a finding conflicts with a locked decision, flag it as
  "conflicts with locked decision X" and stop there. The user decides.
- Only read the parts of the code the design doc refers to. If you think you need
  to read elsewhere, say why first.
- If you've tried the same approach twice without progress, stop and say
  what you know and don't know.

## Step 1: Restate

Before reading any code, restate in <=8 lines what the design doc proposes.
Wait for the user to confirm or correct it.

## Step 2: Review

For every finding use exactly this format:

```
[FACTUAL ERROR | BLOCKER | SUGGESTION]
Doc says: <quote or section>
Code does: <file:line and what it actually does>
Impact: <one line>
```

- FACTUAL ERROR: Doc misdescribes existing code.
- BLOCKER: design can't work as written due to a code constraint.
- SUGGESTION: optional improvement. Max 3, listed last.

## Step 3: Drift check

End with a list of anything in your output that is not a conflict between
the design doc and the code, so the user can cut it.
