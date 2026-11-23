# TypeScript / React rules

Runner-agnostic: examples use Vitest and Testing Library names, but the same
ideas map to Jest and others. Check which the repo uses and match it.

## TypeScript
- Do not test types. Use the compiler (and `expectTypeOf`-style checks only
  for a published library's public types).
- Avoid `as any`, `as never`, and `as unknown as T` in tests to force a shape.
  Build valid data with a small typed factory (`makeUser(overrides)`, or
  `Object.assign(new ItemTransaction(), {...})` for a class), so a type change
  breaks the factory once, not every test. Do not cast to reach a protected or
  private method (`vi.spyOn(worker as unknown as {...}, 'callFLxApi')`): test
  through the public method, or inject the dependency that the method calls.
- Prefer injecting dependencies (function args, constructor params) over
  module mocking (`vi.mock` / `jest.mock`). Module mocks hide coupling and
  break on harmless file moves. Allowed for things you do not own and cannot
  inject: a third-party SDK, `Date`, env/globals. A mock needed in two or more
  test files lives in one shared helper (for example `tests/testUtils/`), one
  helper per module, named after what it fakes. Import it; do not copy the
  block.
- Network: stand in at the HTTP layer (e.g. MSW) so the real fetch/client
  code runs, instead of mocking your own API wrapper.
- Time: fake timers for debounce/timeouts/dates (`vi.useFakeTimers()` +
  `vi.setSystemTime(...)` or the Jest equivalent); restore after each test.
  Never `await sleep(...)`.
- No `Date.now()`, `new Date()`, or `Math.random()` in test data or factories
  that an assertion depends on (e.g. `id: 'user-' + Date.now()`). Use fixed
  literals (`id: 'user-1'`) or a counter in the factory, and freeze the
  clock when the code under test reads it.
- `crypto.randomUUID()` is fine for temporary IDs the test never asserts on
  (a throwaway key, a React list key). Never persist one to a database: DB
  rows use fixed IDs (`'user-1'`) that the test can assert on and delete.
- Async: `await` the thing under test; assert on `rejects`/`resolves`. Do
  not leave floating promises or rely on test timeouts.
- `it.each` / `test.each` for the same behavior over many inputs.
- Location: `tests/` mirrors `src/`, so `src/ui/Button.tsx` is tested by
  `tests/ui/Button.test.tsx`. Never beside the module (see Where tests live in
  `SKILL.md`).

## React
- Test like a user: render, then query by role, label, or visible text.
  `getByRole('button', { name: /save/i })`. Test ids are the last resort.
  Querying by role also checks accessibility.
- Interact with a user-event library, not raw DOM events or by calling
  handlers or props directly.
- Async UI: `await` the interaction, then `findBy*` or `waitFor` for the
  result. Do not wrap synchronous assertions in `waitFor`.
- No shallow rendering. Do not reach into state, instances, or hook
  internals. Do not assert render counts.
- Hooks: test through a component that uses them. Use a hook-render helper
  only for reusable hooks with no natural UI.
- Context/providers: one shared `renderWithProviders` helper using real
  providers, not per-test mocks of context.
- A component's contract is props in, UI and callbacks out. Do not assert on
  children's markup or CSS classes.
- Skip tests for components that only lay out static markup or forward
  props. Test the logic and the interactions.
- Server components, routing, and data-fetching frameworks: test the logic
  as plain functions where possible; keep framework-integration tests few.

## TS/React smells to flag
- `vi.mock('../something-of-ours')` to test a component.
- `container.querySelector('.some-class')`, `data-testid` everywhere.
- `act(...)` sprinkled manually (usually a missing `await`).
- `expect(fn).toHaveBeenCalledTimes(n)` as the only assertion.
- Snapshot of a whole rendered tree.
- `as any`, `as never`, or `as unknown as T` to build test data.
- `as unknown as {...}` to spy on or call a protected or private method.
- The same `vi.mock(...)` block copied into two or more test files.
