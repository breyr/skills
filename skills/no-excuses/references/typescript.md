# TypeScript / JavaScript rules

## Suppressions are excuse comments
Each of these hides a problem instead of solving it. Fix the cause first.
| Suppression | Usually hides | Do instead |
|---|---|---|
| `// @ts-ignore`, `// @ts-nocheck` | a real type error | fix the types; never `@ts-nocheck` a file |
| `// @ts-expect-error` | a real type error | fix it. Exception: a test that deliberately passes invalid input, with the reason stated |
| `as any`, `as unknown as T` + a comment | a wrong model of the data | fix the type or validate at the boundary |
| `// eslint-disable...` | a real rule violation | fix it. If the rule is wrong for the repo, change config with the user's approval, not per line |
| `// eslint-disable no-floating-promises` | an unhandled async failure | `await` it or handle the rejection |
| `/* istanbul ignore */`, `/* c8 ignore */` | untested code | write the test |
| `it.skip` / `xit` / `describe.skip` + a comment | a failing or flaky test | fix the test or the code; never skip to get green |
| `catch (e) { /* ignore */ }` | a swallowed error | handle it, rethrow, or log with context |
| `// non-null assertion is safe because...` on `!` | an unchecked null | narrow with a real check |

A suppression is acceptable only with all of: the cause cannot be fixed in
this repo (third-party typing bug, documented library quirk), the comment
links the evidence (issue URL or library version), and it is as narrow as
possible (one line, specific rule or error code, never a blanket disable).
Report every such suppression to the user in your reply.

## Doc comments (the good kind)
- TSDoc/JSDoc on **exported** functions, types, and hooks: what it is for,
  non-obvious parameter meaning, what it returns, what it throws, an
  `@example` when usage is not obvious.
- Do not repeat the type in prose (`@param id - the id (string)`); the
  signature already says it.
- Skip doc comments on internal, self-explanatory code.

## Common TS excuse phrasings to flag
- `// TODO: add error handling` above a bare `await fetch(...)`
- `// assume input is valid` above unvalidated external data
- `// simplified for now` above hard-coded values or skipped branches
- `// handle this in the caller` with no caller that does
- `// types are hard here` above `any`
- `// works in practice` above a race condition or unchecked cast
