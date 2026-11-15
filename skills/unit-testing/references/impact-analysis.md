# Impact analysis: what does this change do to existing tests?

Input: a planned or finished code change (a description, a design doc
section, or a diff). Output: a recommendation, not edits. Do not modify code
or tests until the user approves.

Invariant: behavior that is *not* meant to change must keep passing with its
tests untouched. A failure there is a regression in the code, not a reason to
edit the test.

## 1. Pin the change
State, in a few lines, what behavior changes and what must stay the same.
If unclear, ask. Everything below is judged against this split.

## 2. Baseline first
Run the relevant existing tests *before* any change and record pass/fail and
duration. Pre-existing failures are reported as such and never blamed on the
change. If tests cannot run, say so and continue without a baseline.

## 3. Find affected tests
For each changed or removed symbol, file, or contract, search for:
- Tests that import or reference it (colocated and elsewhere).
- Tests of its callers and of anything it calls whose behavior shifts.
- Module mocks and stubs of it (`vi.mock`, `jest.mock`, hand-rolled fakes):
  they keep passing while the real contract changes. High risk.
- Shared fixtures, factories, snapshots, and MSW-style handlers that encode
  the old shape.
- Higher-level tests (integration, e2e, component) that exercise it
  indirectly.
Large repo: delegate the search to an Explore subagent (read-only) and have it
return `file:line` hits grouped by symbol.

## 4. Classify each affected test
| Class | Meaning | Action |
|---|---|---|
| Unaffected | Covers behavior that stays the same | Leave alone |
| Intentional change | Asserts behavior the change is meant to alter | Update to new behavior; say which behavior changed |
| Coupled | Fails or will fail only because it tests implementation details | Rewrite to test behavior; flag as a smell |
| Stale mock | Mocks the old contract, would pass wrongly | Update the mock or replace with a fake/real code |
| Obsolete | Tests removed behavior | Delete, with the reason |
| Gap | New or changed behavior has no test | Add one (Write mode) |

## 5. Report
Give a table: test (`file:line`), class, recommended action, one-line reason.
Then:
- Tests expected to fail from the change, versus tests that must not.
- Risky areas: stale mocks and thin coverage around the changed code.
- Suggested order: add safety-net tests for current behavior *first* if
  coverage of code about to change is thin, then change, then update.

## 6. After approval and the change
Rerun the same tests and compare to the baseline. Report: newly failing
(and whether each was predicted), newly passing, unchanged. Any unpredicted
failure in "must not change" behavior is a regression: fix the code, not the
test. Never weaken an assertion, widen a matcher, or skip a test just to get
green; if one is truly obsolete, delete it and say why.
