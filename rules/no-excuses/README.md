# no-excuses

An agent rule (not a skill): keeps agents from using comments to excuse
unfinished or unsafe work. A skill only loads when its description matches the
task; this should apply to every edit, so it is a short instructions file.

## Layout
```
rules/no-excuses.md          the always-on rule (this is what gets installed)
rules/no-excuses/README.md   this file
rules/no-excuses/typescript.md   TS/JS suppression table and ESLint rules (reference)
```
Only top-level `rules/*.md` files are installed, so the README and
`typescript.md` are never loaded as rules.

## Install
Run the repo's install script. It symlinks `rules/no-excuses.md` into
`~/.claude/rules/`, which Claude Code loads in every session, in every repo,
with no pasting. It stays private to you (not committed to any project).

To share it with a team instead, copy the text into the repo's `AGENTS.md`.
Claude Code reads `AGENTS.md` (v2.1.277+) only when no `CLAUDE.md` exists in the
working directory or above.

Caveat from the docs: in Cowork desktop sessions, symlinked rule files that
point outside the working directory are skipped. Normal Claude Code sessions
load them.

## Delete test
Imagine deleting the comment. If the code would be wrong or surprising for a
reason it cannot fix (an API that returns 200 on failure), keep it. If it would
just be incomplete or hard to defend (`// TODO: validate`), it was an excuse.

## Length test
A comment that needs a paragraph to explain what the code does is a smell in
the code, not a missing comment. The fix is to change the code (rename, extract,
simplify, restructure), not to document the confusion. Only constraints the code
cannot express, with linked evidence, earn a long comment.

## If the rule is not enough
A rule is guidance, and a model can ignore it. Start with it and watch. If
excuses keep appearing, escalate in this order:
1. Lint in CI (`typescript.md` has the ESLint rules). Deterministic, covers
   everyone, and the agent hits it through its normal lint step.
2. A commit-time check (git pre-commit, or a Claude Code `PreToolUse` hook on
   `git commit`). Exit code 2 from a `PreToolUse` hook blocks the call.
3. A `PreToolUse` hook on `Edit|Write` that inspects the text before it is
   written. Strictest, and the most likely to cause retries.
Not built here; add when the data says you need it.

## Adapting the ESLint rules to your project
The snippet in `typescript.md` is a starting fragment, not a drop-in config.
Adjust it to the project before using it, and ask the owners before changing a
shared lint config (at work, that is usually the team's). When an agent does
this, it should follow these steps:

1. **Read the existing setup first.** Find the config (`eslint.config.js`,
   `.mjs`, `.ts`; or a legacy `.eslintrc*`), the ESLint version, and which
   plugins are installed. Match its style and structure. Do not create a second
   config.
2. **Translate the fragment.** The snippet's `rules` and `linterOptions` belong
   inside a config object of the project's flat config array. For a legacy
   `.eslintrc`, translate to its format (`reportUnusedDisableDirectives` moves
   to a top-level option there).
3. **Install only what is missing, and only what applies.**
   `@typescript-eslint/*` rules need `typescript-eslint`. Swap
   `vitest/no-disabled-tests` for the project's runner (`jest/no-disabled-tests`,
   or drop it if there is no plugin).
4. **Enable type-aware linting only if the project already uses it.**
   `no-floating-promises` needs it. If not set up, leave that rule out instead of
   adding the setup as a side effect.
5. **Scope `ts-expect-error` to test files** with a `files` override, so it is
   only allowed with a description there, not in app code.
6. **Roll out on existing code without a flood of errors.** Run lint first and
   count the violations. `no-warning-comments` will flag every existing `TODO`.
   If there are many, start the new rules as `warn`, or use ESLint's bulk
   suppressions for existing violations (newer ESLint versions only; check the
   project's version), so only new violations fail. Do not fix or suppress old
   findings as part of this change unless asked, and do not run `--fix`.
7. **Verify.** Run the project's lint command, report the counts, and confirm a
   deliberate `// TODO` and `@ts-ignore` in a scratch file are flagged. Remove
   the scratch file.
8. **Keep the change separate.** Make the lint change its own commit or PR, so
   it can be reviewed and reverted independently of feature work.

If the project does not use ESLint (Biome, oxlint, or none), map the same four
ideas to what it has: ban warning comments, ban type-check suppressions, ban
`any`, and ban skipped tests. Do not add ESLint just for this.
