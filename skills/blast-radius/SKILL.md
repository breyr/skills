---
name: blast-radius
description: Find what a code change could break outside the diff, and prove or disprove the safety claim by running real code. Use for "what could this break", "is this safe to merge", or reviewing a small change you do not trust.
---

# Blast radius (what else does this touch?)

A convincing writeup is not evidence. Find the fact the change's safety
depends on, then test it.

## Steps
1. **Scope.** The diff the user names, else the branch against its merge base.
2. **State the claim.** In one sentence: what the change does, and the one or
   two facts that must be true for it to be safe ("no caller passes null",
   "this column is never read elsewhere").
3. **Look past grep.** For each fact, check:
   - all callers, including dynamic, reflective, and test code;
   - library source and pinned versions, not remembered behavior;
   - timing: async ordering, teardown, init order;
   - indirect surfaces: API JSON shapes, DB columns and migrations, wire
     formats, config and feature flags, downstream consumers, docs.
4. **Verify by running.** Write and run a small script or test against the
   real code that would fail if the fact were false. Reading is not proof.
5. **Large or risky change:** run 2 or 3 independent subagents on the same
   scope (use `model` overrides for variety); different models miss different
   things. Merge and verify their findings yourself.

## Confidence ladder (weakest to strongest)
someone said so, a specific line cited, failure path walked and not reached,
script run against real code, reproduced in the running app. Report each
fact's rung.

## Output
- What the change does.
- The load-bearing fact, marked **proven** or **unproven**.
- Confirmed risks with `file:line`.
- Risks checked and cleared, and how.
- The cheapest test to run before merging.

## Rules
- Read-only apart from throwaway scripts in the scratchpad.
- Remove private names, hosts, and secrets before anything is shared.
- Pairs with `unit-testing` when the answer is "add this test first".

## Credit

Adapted from [pstack `blast-radius`](https://github.com/cursor/plugins/tree/main/pstack/skills/blast-radius) by Lauren Tan, reworked for Claude Code.
