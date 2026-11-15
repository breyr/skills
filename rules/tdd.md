## TDD: the failing test comes first

- For every bug fix and every new behavior, write the test first and run it.
  It must fail, and fail for the reason you are about to fix. Show me that
  output before changing production code.
- Then write the smallest change that makes it pass, run the test again, and
  run the rest of the suite.
- A bug fix starts with a test that reproduces the bug. If you cannot
  reproduce it in a test, you do not yet understand it; say so.
- The test asserts observable behavior, not implementation details. Follow the
  `unit-testing` skill for how.
- Refactors that keep behavior need existing tests green before and after; if
  coverage is missing, add characterization tests first.
- If there is no cheap local way to test the change (UI-only, infra, config,
  third-party service), do not skip silently. Say so in your reply, name the
  cheapest check you used instead, and ask me if that is acceptable.
- Never weaken, delete, or skip a test to make it pass. Fix the cause.
- Report the red run and the green run in your final reply.
