---
name: unit-testing
description: Write, review, or plan unit tests with language-agnostic best practices (behavior over implementation, minimal mocking, no trivial tests), plus per-language rule files. Also analyzes how a planned change affects existing tests and recommends updates without breaking existing behavior. Use when writing tests, reviewing or trimming tests, deciding what to test, learning to test well, or before changing code that has tests. Also use for TDD, a failing or regression test for a bug fix, red/green runs, characterization tests, and test fixtures.
---

# Unit testing (agnostic core, language rules on demand)

Goal: tests that fail when behavior breaks and stay green when code is
refactored. The user is learning, so for each test or finding, state the
principle behind it in one line.

## Pick a mode
- **Write**: new tests for code. Follow the workflow below.
- **Review**: judge existing tests. Read `references/review-rubric.md`.
- **Impact**: the user is about to change code (or has) and wants to know
  what it does to existing tests. Read `references/impact-analysis.md`.
  Use this mode on its own, or before Write when tests already exist.

## Load language rules
Detect the language from the files in play, then read the matching file in
`references/`. Rules there override the generic defaults below.
- TypeScript / JavaScript / React: `references/typescript-react.md`
- No file for the language: use only the core rules here, say so, and offer
  to draft `references/<language>.md` from what you learn in the repo.

To add a language, create `references/<language>.md` and add a line above.
Cover: runner and idioms, how to mock at the boundary, async and time,
parametrized tests, naming and file layout, language-specific smells.

## Workflow (Write)
1. Read the code under test and the existing tests, runner config, setup
   files, and helpers. Match their conventions.
2. Tell the user what you will test and what you are deliberately skipping,
   and why, *before* writing.
3. Write the tests. Run them.
4. Prove they can fail: break the code on purpose (flip a condition) and
   confirm a test goes red, then restore it. A test that cannot fail is noise.
   Skip this when the code does not exist yet or the bug is not fixed yet
   (TDD, or the `tdd` rule): the red run you already showed is the proof.
5. Report: covered, skipped, what was mocked and why.

## What to test
- Logic with branches: conditionals, parsing, calculations, state
  transitions, validation.
- Edge cases and error paths: empty, null, boundaries, failures.
- Observable behavior of the unit: return values, rendered output, and
  effects that leave the system (calls to the outside world).
- A bug that happened: write the failing test first, then fix.

## What NOT to test
- Trivial code: getters, pass-through wrappers, constants, static markup.
- The language, framework, or libraries.
- What the type system or compiler already guarantees.
- Implementation details: private state, internal call order, call counts,
  structure. If a refactor with the same behavior breaks it, it was one.
- Large snapshots. They get approved without reading.
- Coverage as a goal. It shows what is untested, not what is well tested.

## Mocking: default is don't
Prefer, in order:
1. **Real code.** Pure functions and collaborators run for real.
2. **Fakes** at the boundary: in-memory implementations, or a stand-in for
   the network that lets the real client code run.
3. **Stubs/spies** only for what you cannot run or must observe: network,
   clock, randomness, filesystem, callbacks you pass in.

- Mock at the system boundary, not your own modules. Needing to mock a
  sibling module to test a unit usually means the unit is too coupled: say so.
- Prefer injecting a dependency (argument, constructor, prop) over patching
  a module.
- Never mock the thing under test. Never assert on a mock you set up to
  return the answer.
- Assert outcomes first, calls second. Assert call arguments only when the
  call *is* the behavior.
- Reset mocks, clocks, and globals between tests. Never real-sleep.

## Structure and style
- One behavior per test, named as behavior (`rejects an expired token`).
- Arrange / Act / Assert, visibly separated. Setup lives in the test or a
  small named factory, not a distant shared fixture.
- No logic in tests: no loops, ifs, or expected values computed with the
  same logic as the code. Hard-code expectations.
- Independent, order-agnostic, deterministic (control time, randomness, IDs).
- No datetime-based (or random) values in test data that an assertion depends
  on: no `Date.now()`/`new Date()` IDs, timestamps, or "now"-derived
  expectations. Use fixed literals or a frozen/injected clock and a
  deterministic ID generator, so the expected value is hard-coded and the
  test gives the same result on any day.
- Temporary IDs the assertions never read (e.g. `crypto.randomUUID()`) are
  fine, but they must never be persisted to a database. Anything written to a
  DB uses fixed, known IDs so it can be asserted on and cleaned up.
- Parametrize the same behavior over many inputs; don't copy-paste.
- Fast. A test needing a real browser, server, or database is another kind
  of test: say so and keep it separate.
- Readable beats DRY. Some duplication in tests is fine.

## Teaching mode
If the user wants to learn, write one test, explain the choice, then have
them draft the next from the same pattern and review theirs. Do not dump a
whole suite.
