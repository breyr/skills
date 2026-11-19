# skills

Personal Claude Code skills.

## Install

### Skills with `npx skills` (no clone)

```
npx skills add breyr/skills                 # pick interactively
npx skills add breyr/skills --skill teach   # one skill
npx skills add breyr/skills -g              # global (~/.claude/skills) instead of the current project
```

Update with `npx skills update`.

`npx skills` installs skills only. Rules are copied by hand into
`~/.claude/rules` (create the folder if needed). All rules are optional, but
`tdd.md` expects the `unit-testing` skill to be installed.

```
mkdir -p ~/.claude/rules
curl -fsSL https://raw.githubusercontent.com/breyr/skills/main/rules/no-excuses.md -o ~/.claude/rules/no-excuses.md
mkdir -p ~/.claude/rules/no-excuses
curl -fsSL https://raw.githubusercontent.com/breyr/skills/main/rules/no-excuses/typescript.md -o ~/.claude/rules/no-excuses/typescript.md
curl -fsSL https://raw.githubusercontent.com/breyr/skills/main/rules/tdd.md -o ~/.claude/rules/tdd.md
curl -fsSL https://raw.githubusercontent.com/breyr/skills/main/rules/scope.md -o ~/.claude/rules/scope.md
```

Or copy the files from [`rules/`](rules) yourself. Re-run the `curl` commands to
update a rule.

### Clone and link

Requires [git](https://git-scm.com). Links skills and rules, so `git pull` updates them.

#### macOS / Linux

```
git clone https://github.com/breyr/skills.git ~/skills
~/skills/install.sh
```

#### Windows (PowerShell)

```
git clone https://github.com/breyr/skills.git $HOME\skills
powershell -ExecutionPolicy Bypass -File $HOME\skills\install.ps1
```

This links each skill into `%USERPROFILE%\.claude\skills` with directory
junctions (no admin rights needed) and each rule into
`%USERPROFILE%\.claude\rules` with file symlinks (needs Windows Developer
Mode or admin; otherwise the rule is skipped with a warning). If you run Claude Code inside WSL, use
the macOS / Linux steps from the WSL shell instead.

## Update

```
git -C ~/skills pull && ~/skills/install.sh   # Windows: git -C $HOME\skills pull; then re-run install.ps1
```

Existing skills update immediately because they are links; re-running the
install script links any **new** skill. Restart Claude Code afterward so it
picks up new skills. If you installed with `npx skills`, use
`npx skills update` instead. Rules copied with `curl` are updated by re-running
the `curl` commands.

## Add a skill

1. Create `skills/<name>/SKILL.md` with `name` (kebab-case, same as the
   directory) and `description` frontmatter. Add `disable-model-invocation: true`
   if it should only run when you type `/<name>`.
2. Add a bullet for it under `## Skills` below, formatted as `- `<name>`: description`.
3. Run `npm run lint:skills`, then re-run the install script.

For an always-on rule, add `rules/<name>.md` (no frontmatter needed) and
re-run the script.

## Which skill do I use?

| I want to... | Use | How it runs |
| --- | --- | --- |
| Sharpen a rough prompt before sending it | `sharpen` | `/sharpen` only |
| Check the agent understood me before it starts | `in-your-own-words` | `/in-your-own-words` only |
| Know how an area works | `how` | auto or `/how` |
| Know why it was built that way | `why` | auto or `/why` |
| Really understand a change (how + why) | `teach` | auto or `/teach` |
| Design a feature at the code level | `architect` | auto or `/architect` |
| Break big work into verifiable steps | `plan-chunks` | auto or `/plan-chunks` |
| Write a design doc | `design-doc-draft` | auto or `/design-doc-draft` |
| Check a design doc against the code | `design-doc-review` | auto or `/design-doc-review` |
| Get ready to defend an old design doc | `design-doc-refresh` | auto or `/design-doc-refresh` |
| Know what a change could break | `blast-radius` | auto or `/blast-radius` |
| Write, review, or trim tests | `unit-testing` | auto or `/unit-testing` |
| Apply TypeScript design rules while writing or reviewing code | `code-taste` | auto or `/code-taste` |
| Try to break a finished change | `interrogate` | auto or `/interrogate` |
| Write a commit message or PR description | `pr-writing` | auto or `/pr-writing`; follows repo conventions |
| Catch up after time away | `catchup` | `/catchup` only |
| Stop mid-task so a fresh agent can resume | `pause-safely` | `/pause-safely` only; commits and writes a note |
| Log where I am for tomorrow | `wrap-up` | auto or `/wrap-up`; writes a note after you approve |
| Plan or review a multi-session learning goal | `create-learning-path`, `run-learning-retrospective` | auto or by name |

"Auto" means Claude can load the skill when your request matches its
description. "Only" skills are never loaded on their own.

## Skills

### Understand
- `how`: early-career-friendly explanation of how a subsystem works, with optional multi-critic design critique, using parallel Explore subagents.
- `why`: why something was built this way, answered from commits and PRs, not the code.
- `teach`: layered, plain-English explanation of a change or subsystem; runs `how` and `why` together.

### Design and plan
- `architect`: settle the shape before writing it: sketch callers, types, signatures, and module boundaries with unimplemented bodies, compare structurally different designs, and stop before implementing. Writes no files.
- `plan-chunks`: break work too big for one diff into small ordered units, each with its own check, dependencies, and parallel groups. Plans only; stops before implementing.
- `design-doc-draft`: idea -> interview -> user's decisions -> short design doc with cited current behavior.
- `design-doc-review`: check a design doc against the codebase without redesigning it.
- `design-doc-refresh`: rebuild context on an old design doc (timeline, code drift, citation check, defense quiz, status block).

### Verify
- `blast-radius`: what a change could break outside the diff, with the safety claim proven by running code.
- `interrogate`: independent adversaries try to break a diff; only findings a re-run proves are reported.
- `unit-testing`: language-agnostic unit-testing core (behavior over implementation, minimal mocking, no trivial tests) with per-language rules in `references/` (TS/React today), plus impact analysis of a change on existing tests.

### Ship
- `pr-writing`: write a commit message, PR title, or PR description from the real diff. Follows the repo's own conventions (PR template, CONTRIBUTING, commitlint, recent `git log`) and falls back to Conventional Commits and a short briefing-style body. Checks every claim against the diff; commits or opens a PR only when asked.

### Write and review code
- `code-taste`: TypeScript design rules: when to add a cache, Set, shared module, resubscription, result type, options object, or builder; where state lives; where tests live; how to name things.

### Prompting (user-invoked)
- `sharpen`: rewrite a prompt to be deeper, not bigger, without doing the task.
- `in-your-own-words`: restate the goal and problem before any work.

### Sessions
- `wrap-up`: end-of-session note appended to a daily note. Asks where to save, defaulting to `$WRAP_UP_DIR` or `~/Documents/Projects/Work Log`.
- `pause-safely`: stop cleanly on request (one `wip:` commit plus a resume note in `~/.claude/resume/`) so a fresh agent can continue (user-invoked).
- `catchup`: catch up after time away: what changed, plus every decision only you can make, with a recommended pick (user-invoked, read-only).

### Learning
- `create-learning-path`: milestone-based learning roadmap with practice checkpoints.
- `run-learning-retrospective`: review progress after a milestone and adjust the plan.

## Credits
`why`, `teach`, `blast-radius`, `architect`, `plan-chunks`, `interrogate`, `in-your-own-words`, `sharpen`, `pause-safely`, `catchup`, and `pr-writing`
are adapted from Lauren Tan's [pstack](https://github.com/cursor/plugins/tree/main/pstack).
`how` is adapted from [poteto/how](https://github.com/poteto/how), and the two
learning skills from the [cursor/plugins `teaching`](https://github.com/cursor/plugins/tree/main/teaching)
plugin (MIT). Each skill's own `## Credit` section links its source, and [`NOTICE`](NOTICE)
holds the upstream copyright notices and license text.

## Example workflow

One feature, start to finish. Each step names the skill and when to reach for it.

1. **Frame the ask.** Rough idea in hand: `/sharpen` rewrites the prompt to be
   deeper. Send it, then `/in-your-own-words` to confirm the agent understood
   the goal and problem before it touches anything.
2. **Understand the area.** `how` for the mechanics of the code you will
   change. `why` for the history behind a strange constant or design. If you
   need it to really stick, `teach` combines both into a layered explanation.
3. **Decide the shape.** Small or code-level change: `architect` (sketch
   callers, types, signatures; compare two designs; design only, you start
   the implementation after approving it). Bigger or shared change:
   `design-doc-draft`, then `design-doc-review` against the codebase. Work
   too big for one reviewable diff: `plan-chunks` orders it into small units,
   each with a check.
4. **Check the risk.** Before editing, `blast-radius` on the planned change to
   find what else it touches and the one fact its safety depends on.
5. **Build with tests first.** The `tdd` rule forces a failing test before
   any fix or feature. `unit-testing` guides what and how to test, and what a
   change does to existing tests. The `no-excuses` rule keeps TODOs and
   suppressions out.
6. **Try to break it.** `interrogate` on the finished diff: adversaries must
   prove each finding with a run.
7. **Close out.** `wrap-up` saves where you are and the next step to your daily
   note. Returning to an old design doc weeks later: `design-doc-refresh`.

Around the edges of that flow:
- Stepping away mid-task: `pause-safely` commits the work as `wip:` and writes
  a resume note so a fresh session can continue, then offers to run `wrap-up` for your own note.
- Coming back while agents ran in the background: `catchup` lists what changed
  and the decisions waiting on you.

## Rules
Always-on agent rules (not skills). The install script symlinks each
`rules/*.md` and each docs directory `rules/<name>/` into `~/.claude/rules/`,
which Claude Code loads every session.
- `rules/no-excuses` (plus `rules/no-excuses/typescript.md` for TS/JS; human docs in [`docs/no-excuses.md`](docs/no-excuses.md)): agents may not use comments (TODO, "for now", suppressions, dead code) as an excuse to skip real work; a paragraph-long explanatory comment means fix the code instead.
- `rules/scope`: search for an existing helper before writing one, and change only what was asked (no drive-by refactors, speculative features, or defensive code the types already rule out).
- `rules/tdd`: every fix and feature starts with a failing test, shown red then green; no cheap test path means say so and ask.

## Checks
`npm run lint:skills` checks every skill, rule, README entry and installer against these conventions (exit 1 on violations); `npm test` runs its tests. Needs Node 22.18 or newer.

## License
MIT, see [`LICENSE`](LICENSE). Adapted third-party material is covered by [`NOTICE`](NOTICE).
