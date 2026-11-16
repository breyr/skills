# Review rubric (existing tests)

Rank findings by cost to the user:
1. **Passes when the code is broken**: no real assertion, asserts a mock it
   configured, swallows errors, assertion inside an uncalled callback.
2. **Breaks on harmless refactors**: implementation details, over-mocking
   (including one mock block copied across files), casts into private
   members, casts that force a data shape, brittle selectors, large snapshots.
3. **Trivial**: tests of getters, constants, pass-throughs, the framework.
   Recommend deleting.
4. **Missing coverage** of branching logic or error paths.
5. **Flaky or slow**: real timers, shared state, order dependence, real
   network, datetime- or random-based IDs/values that an assertion depends on,
   random IDs (e.g. `crypto.randomUUID()`) persisted to a database.

For each finding give: `file:line`, the principle in one line, and the
smallest fix. Verify a suspected category-1 finding by breaking the code
and confirming the test stays green before reporting it as one.

Do not rewrite tests the user did not ask you to touch. Report, then offer.
