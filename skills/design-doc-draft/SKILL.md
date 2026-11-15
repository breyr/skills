---
name: design-doc-draft
description: Help the user turn a rough idea into a short, defensible implementation-level design doc. Interviews the user first, user supplies the decisions, agent fills in detail and cites code. Use when the user wants to draft, write, or plan a design doc before implementation.
---

# Design doc draft (user decides, agent details)

The user must be able to defend this design. So the user makes the
decisions; you ask questions, read code, and write up detail. Never choose
a design decision on the user's behalf.

## Step 1: Intent note
Ask for (or help the user write) 5-10 lines: the problem, what done looks
like, what's out of scope. Restate it in <=5 lines and wait for confirmation.

## Step 2: Interview, no design yet
Read only the code the idea touches. Then ask the questions a senior
engineer would need answered: data flow, failure cases, existing code to
reuse, edge cases, what must be preserved (for ports). Do NOT propose a
design. Ask in small batches (max 5 questions) and wait for answers.

## Step 3: Decisions (written by the user)
Ask the user to state 3-7 decisions in ADR (architecture decision record)
style, each as:
- **Context**: the situation or constraint forcing a choice.
- **Decision**: what we chose.
- **Alternatives considered**: what we rejected, and why.
- **Consequences**: what gets easier, what gets harder or riskier.

Keep each to a few lines. Tidy wording only. If the user is stuck on one,
explain the tradeoffs neutrally and let them choose.

## Step 4: Write the design doc
Hard cap: 2 pages (more only if the user says the risk justifies it).
Use exactly these sections, in this order:

0. **Status block** at the very top (update it whenever work stops):
   Where I am / Decided / Open questions / Next step / Last verified
   against code (date or commit).
1. **Summary**: problem, approach in 3 sentences, key risks.
2. **Decisions**: the user's ADR-style entries, verbatim-ish.
3. **Current behavior**: <=15 lines, a flow. Every claim cites `file:line`
   (and function name). No citation = cut it or move to "Not verified".
   Do not infer from names or comments alone. End with `Not verified:`
   listing anything unconfirmed. For ports, add a "Must preserve" checklist
   including quirks.
4. **Change**: components, files touched, data/schema changes, interfaces
   and signatures. Reference Current behavior instead of restating it.
5. **Flow**: happy path and failure paths.
6. **Out of scope**.
7. **Test approach**: what would hurt if it broke and how we'd know. Max N
   tests, each justified in one line. Prefer behavior-level tests over
   mock-heavy unit tests. No tests for trivial code.

## Step 5: Defense prep
Offer to ask 5 hard questions a reviewer would ask. Ask them one at a time,
let the user answer without looking, then note the weak spots.
