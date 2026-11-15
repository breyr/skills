# no-excuses

For humans. Claude Code only loads `SKILL.md` and the `references/` files it
points to; this file is documentation.

## What it does
Keeps agents from using comments to excuse unfinished or unsafe work. Instead
of writing `// TODO: handle errors` or `// simplified for now`, the agent must
do the work, or report the gap to you in its reply. It also audits a diff for
those comments after the fact.

This is a policy skill, not a comment generator. It does not add comments to
code.

## Layout
```
SKILL.md                    core rules, excuse patterns, write/review modes
references/typescript.md    TS/JS suppressions and doc-comment rules
```
Add a language the same way as `unit-testing`: create
`references/<language>.md` and point to it from `SKILL.md`.

## Implementation details
- **Write mode** applies to every code edit: before adding a comment, the
  agent asks whether it is covering for incomplete or unsafe code. If so it
  fixes the code or tells the user in its reply.
- **Review mode** takes the added lines from `git diff -U0`, runs a grep as a
  candidate finder (not a verdict), then reads every added comment and
  classifies it: Excuse / Suppression / Dead / Stale / Legitimate.
- **Suppressions count as excuse comments** (`@ts-ignore`, `eslint-disable`,
  `it.skip`, coverage ignores). The reason attached does not fix the problem.
- **Deferral exception**: allowed only when you explicitly approved it in the
  conversation and it is tracked in a ticket; the comment cites the ticket
  and the agent lists it in its final reply.
- **Delete test**: delete the comment mentally. If the code is then wrong or
  surprising for a reason code cannot fix, keep it. If it is merely
  incomplete or hard to defend, it was an excuse.

## Interaction with other tooling
Some setups, such as the ponytail plugin, encourage `shortcut:` comments to
mark known limits. That conflicts with this skill's deferral rule. Pick one
policy per repo: with this skill active, such a comment needs your explicit
approval and a tracked ticket.

## Where the ideas come from
Original to this repo, from your stated goal. The underlying views (comments
explain why not what; commented-out code belongs in version control; broad
lint or type suppressions are debt) are widely held, general engineering
guidance; I did not fetch a specific source for them.

## Limits
- Not enforcement. It relies on the agent following instructions. For hard
  guarantees, add lint rules (e.g. a no-warning-comments rule, and
  `@typescript-eslint/ban-ts-comment`) or a pre-commit grep, and have the
  agent run them.
- The grep misses creative phrasings; the review step reads every comment
  for that reason.
- Not run or tested on real diffs yet.
