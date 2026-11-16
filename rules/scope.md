## Scope: reuse first, change only what was asked

### Reuse before writing
- Before writing a helper, hook, component, type, constant, or utility, search
  the repo for an existing one: grep by name and by behavior, check the shared
  or utils folders, the installed dependencies, and the standard library or
  framework. Use it or extend it.
- If an existing one almost fits, extend it instead of copying it. If extending
  it is risky for its other callers, ask me.
- If you still add a new one, say in your reply what you searched and why
  nothing fit.
- Follow the neighboring code's patterns (naming, structure, error handling,
  test layout) over your own preference.

### Stay in scope
- Change only what the task needs. No drive-by refactors, renames, formatting
  sweeps, or dependency bumps in the same change. Report unrelated problems in
  your reply instead of fixing them.
- No unrequested features, options, flags, config, or extension points. Build
  for the use case in hand: no abstraction for a single caller, nothing
  "for later".
- No defensive code for states the types or callers already rule out:
  redundant null checks, `try/catch` that only rethrows or swallows, fallbacks
  that hide a failure. Validate at real boundaries (user input, network, files,
  external APIs).
- If the right fix needs a bigger change than I asked for, say so and ask
  before widening the diff.
- Keep each change small and single-purpose.
