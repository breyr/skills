---
name: design-doc-refresh
description: Rebuild the user's context on a design doc (LLD) they wrote or inherited weeks ago, so they can defend it. Reconstructs the timeline, checks code drift, re-verifies citations, and quizzes the user. Use when the user is returning to an old design doc, was off a project, or must defend a doc or decision they don't remember.
---

# Design doc refresh (get ready to defend an old doc)

Goal: the user can explain what was decided, why, and the tradeoffs, and
knows what has changed since. You help them rebuild it; you do not rewrite
the design. Never invent reasoning the doc does not contain: if the "why" is
missing, say so and list it as an open question.

Ask for (skip if given): the doc, roughly when it was last touched, and
whether someone else wrote it.

## Step 1: Summary and decisions first
Read the doc. Give the user a <=10-line recap: problem, approach, each
decision with its stated reason. Mark any decision with no stated reason
as `Reason missing`. Stop and let the user react before going further.

## Step 2: Timeline
Reconstruct what happened since the doc's last edit from what you can read:
git log/branches/PRs touching the doc's files, doc edit history, linked
tickets or notes. Output a dated list: done, in progress, unfinished, and
anything that looks like a decision made outside the doc. Cite commits or
links. If a source is not readable (wiki, chat), say so and ask the user to
paste what matters.

## Step 3: Drift check
List commits since the doc's last verified date (or last edit) that touch
files the doc cites. For each, say whether it could break a Current
behavior claim, with `file:line`. Do not guess: "could affect" needs a
cited reason.

## Step 4: Re-verify citations
Open every `file:line` in Current behavior. Report each as OK, MOVED
(new line), or CHANGED (behavior differs, with what it does now). Propose
the doc edits as a list; apply them only if the user agrees.

## Step 5: Conformance
Run the design-doc-review procedure against the current code (restate,
findings as FACTUAL ERROR / BLOCKER / SUGGESTION, drift check). Do not
redesign.

## Step 6: Defense prep
- Ask 5 hard questions a reviewer would ask, one at a time. Let the user
  answer without looking. After each, say what the doc supports and where
  the answer was weak or wrong.
- Finish with a "if asked, say this" card, <=10 lines: each decision in one
  sentence (what, why, tradeoff), the 2-3 riskiest points, and an honest
  line for what's unknown ("I'd need to check X").

## Step 7: Status block
Write or update a Status block at the top of the doc (apply if the user
agrees):

```
Status (updated <date>)
- Where I am:
- Decided:
- Open questions:
- Next step:
- Last verified against code: <date / commit>
```

If the user did not write the doc, add `Author / who to ask:`.
