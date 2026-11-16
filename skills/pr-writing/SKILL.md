---
name: pr-writing
description: Write a commit message, PR title, or PR description from the real diff, following the repo's own conventions when it has them. Use when asked to commit, write or fix a commit message, open or describe a pull request, or write a PR summary. Checks every claim against the diff before finalizing.
---

# Write commit messages and PR descriptions

Write the text from the diff, not from memory of the conversation. Follow the
repo's conventions first. Use the defaults below only where the repo is silent.

## Steps

1. **Find the repo's conventions.** Check, in this order, and stop reading a
   source once it answers the question:
   - `.github/pull_request_template*` or `PULL_REQUEST_TEMPLATE/`: fill the
     template in. Do not replace it with the default body below.
   - `CONTRIBUTING*`, `AGENTS.md`, `CLAUDE.md`: any commit or PR rules.
   - `commitlint.config.*`, `.commitlintrc*`, `git config commit.template`.
   - `git log -n 20 --format=%s`: the prefix style, casing, and ticket-ID habit.
   If a convention conflicts with this skill, the convention wins. Say which
   source you followed in one line.
2. **Read the change.** For a commit: `git status`, then `git diff --staged`.
   If nothing is staged, say so and stop. For a PR: the diff and `git log` against
   the base branch. If the change mixes unrelated concerns, say so before
   writing. Default to one PR per concern: a PR that covers two concerns gets a
   title and a Scope section that hedge. Use separate commits only for steps
   of one concern, such as the test and then the fix.
3. **Write the commit message.** Subject: imperative mood, about 50
   characters (72 at most), no trailing period, names the real symbol or file
   when one carries the change. With no clear repo style, use Conventional
   Commits: `type(scope): subject` (feat, fix, docs, refactor, test, chore,
   perf). Add a body only when the subject cannot carry the reason. The body
   says why: the problem, why this approach, any known shortcoming. It does
   not restate the subject. Wrap at 72.
4. **Write the PR title and description.** The title follows the commit
   subject rules. The description is a briefing a reviewer reads in under a
   minute, with the diff open next to it. Summarize the whole diff. Do not
   paste the commit messages together. Aim for under about 40 lines. Use these
   `##` headings in order. Leave out a heading that has nothing to say, except
   Scope:
   - **Why:** the problem and approach, 1 to 3 sentences.
   - **What changed:** 1 to 3 short bullets.
   - **Scope:** what the PR covers and what it leaves out.
   - **Tradeoffs:** only rejected alternatives a reviewer would question.
   - **Blast radius:** what it touches and whether that is safe.
   - **Verification:** each bullet is a real run and its result. For
     performance, one number as before and after.
   For a change of a few lines, Why and Verification are enough: skip What
   changed when the title already says it. With several commits, the title
   names the whole change, not the first commit.
   Add a screenshot or video only when it proves a claim.
5. **Check every claim against the diff.** Agent descriptions most often
   claim changes that were never made. Re-read the diff and, for each claim
   in the title and body, find the lines that make it true. Delete any claim
   you cannot find. List only runs you actually did in this session. If tests
   were not run, write "not run". If a suite already fails for reasons the
   change does not touch, give the passing count before and after in one line,
   name the one cause you checked, and say what you did not check. Run this
   check again after review changes the code.
6. **Clean the prose.** One instruction or fact per short sentence, active
   voice, one name per thing, real symbol and file names. Cut chatbot
   openers, "not just X, but Y", decorative em dashes, forced groups of
   three, and words like "robust", "seamless", and "comprehensive".
7. **Act only as asked.** Show the text. Run `git commit` or `gh pr create`
   only when the user asked for it. Pass the message from a file (`git commit
   -F`, `gh pr create --body-file`), not inline, so shell quoting cannot change
   it. Never push unasked. Do not add or remove
   attribution trailers or footers on your own: follow the attribution rules
   from the repo, the user, or the session, and add none if none exist.

## Examples

Commit, no body needed:

```
fix(auth): reject expired refresh tokens in refreshSession
```

Commit with a body:

```
perf(search): cache tokenized queries in SearchIndex

Tokenizing ran on every keystroke and dominated p95 latency. Cache the
result per query string. The cache is unbounded, so a long session can
grow it. A size cap is a follow-up.
```

PR description:

```
## Why
Expired refresh tokens passed validation, so users stayed signed in
after revocation. `refreshSession` now checks `expiresAt`.

## What changed
- Reject tokens past `expiresAt` in `refreshSession`.
- Return 401 with `token_expired` instead of 200.

## Scope
Covers the refresh endpoint only. Access-token checks are unchanged.

## Verification
- `npm test auth`: 42 passed, including the new expired-token case.
```

## Credit

Adapted from [pstack `opening a pr`](https://github.com/cursor/plugins/tree/main/pstack/skills/poteto-mode/playbooks/opening-a-pr.md) and [pstack `technical-writing`](https://github.com/cursor/plugins/tree/main/pstack/skills/technical-writing) by Lauren Tan (MIT), reworked for Claude Code. See `NOTICE` in the repo root.
