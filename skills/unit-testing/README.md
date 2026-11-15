# unit-testing

For humans. Claude Code only loads `SKILL.md` and the `references/` files it
points to; this file is documentation.

## What it does
Three modes, picked from the request:
- **Write**: add unit tests, with a plan stated before writing and a
  break-the-code check afterward.
- **Review**: rank problems in existing tests.
- **Impact**: given a planned or finished change, find affected tests,
  classify them, and recommend updates without breaking existing behavior.

## Layout
```
SKILL.md                      agnostic rules + mode picker + language dispatch
references/typescript-react.md   TS / React / Vitest-style specifics
references/review-rubric.md      ranked review criteria
references/impact-analysis.md    baseline -> find -> classify -> report -> verify
```
`SKILL.md` stays short and language-neutral. Detail is split into
`references/` so Claude reads only what the task needs (a Python task never
loads the React rules).

## Implementation details
- **Language dispatch** is a plain list in `SKILL.md` ("Load language
  rules"). Language files override the generic defaults. With no matching
  file, the core rules apply and Claude offers to draft one.
- **Add a language**: create `references/<language>.md` and add one line to
  that list.
- **Impact mode safety rules**: run a baseline of existing tests first; edit
  nothing until the user approves; behavior that should not change keeps its
  tests untouched, so a failure there is a code regression; never weaken an
  assertion or skip a test to get green.
- **Large repos**: impact analysis delegates the search for affected tests to
  an Explore subagent.
- **Teaching mode**: when the user is learning, write one test, explain, then
  have the user write the next.

## Where the ideas come from
Written from the author's (Claude's) general knowledge, not from a fetched
source, so treat the attributions below as approximate and verify before
quoting.
- **Test behavior, not implementation; query like a user**: the Testing
  Library guiding principles and Kent C. Dodds' writing.
- **Prefer real or fake over mocks; mock at the boundary**: Martin Fowler's
  "Mocks Aren't Stubs" and the classicist vs. mockist debate; MSW's
  documentation for stubbing the network instead of your own client.
- **Little logic in tests, readable over DRY, one behavior per test**: Google's
  "Software Engineering at Google" testing chapters and Testing on the Toilet.
- **Failing test first for a bug; break the code to prove a test can fail**:
  common TDD and mutation-testing practice.
- **Stricter stance on module mocking** (prefer dependency seams over
  `vi.mock`): influenced by the `no-module-mocking` rule in
  [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop), softened to
  allow exceptions for things you cannot inject.
- **Impact mode** (baseline, classify, recommend, verify): original to this
  repo; shaped by the request to analyze effects on existing tests.

## Opinions, not consensus
Snapshots, module mocking, test-id use, and coverage as a goal are debated.
The skill takes a position on each. Override them in your own rules if you
disagree.

## Not done
No runner-specific config, no integration or e2e guidance, no mutation-testing
tool setup.
