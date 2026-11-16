---
name: plan-chunks
description: Break non-trivial work into small ordered units that each end in a verifiable state, with the check for each unit, its dependencies, and what can run in parallel. Plans only and stops for approval before implementing. Use when a change is too big for one reviewable diff, for migrations and sweeps, or before stacking commits or PRs.
---

# Plan chunks (small units, each provable)

`architect` settles the shape of the code; this skill settles the order of the work.

This skill produces a plan, not code. Do not create or edit files, branches, or commits. The plan lives in the reply. Implementation is a separate step the user starts after approving it.

If the change is one or two files with an obvious approach, say so and stop. A plan would be overhead.

## Steps
1. **Ground.** Read the code the work touches and find the test, lint, and
   typecheck commands. If the design is not settled, run `architect` first.
2. **Find the seams.** Split along behavior boundaries (a caller, a module, a
   data shape, a flag), not file types. "All the types, then all the logic,
   then all the tests" is not a plan.
3. **Cut units.** Size each one by the Sizing rules below. Order them so the
   sequence proves itself:
   - the failing test first, then the fix;
   - a refactor that makes the change easy before the behavior change;
   - a subtraction before the reshape;
   - a baseline capture before the treatment;
   - the scaffold before the feature.
4. **Name each unit's check.** An exact command or observable result. For a
   behavior change, the test that goes red first. If there is no cheap check,
   say so and name the cheapest substitute. A unit that cannot be verified
   alone gets merged with its neighbor or cut differently.
5. **Order and parallelize.** Mark what each unit depends on. Units with
   disjoint files and no shared state can run in parallel; shared writes run
   in sequence. Put the riskiest unit as early as its dependencies allow, so
   a bad assumption fails cheap.
6. **Stop.** Surface every choice that is the user's as a question with your
   default, then wait. Pushback on the cut sends you back to step 2.

## Sizing
A unit is as big as one reason, one check, and one review allow. In order of
weight:
1. **One reason.** You can describe it in one sentence without "and". If you
   need "and", it is two units.
2. **One check.** A single command or observable result proves it. If you
   cannot name one, the unit is too big or cut in the wrong place.
3. **One sitting.** A reviewer can hold the whole change in their head and
   judge it. Changed lines are a rough proxy (about 200 to 300); do not count
   generated code, lockfiles, or pure renames and moves.
4. **Landable.** It leaves the repo building with tests green. This can force
   a unit bigger, such as a rename that must touch every caller at once. That
   is fine when the change is mechanical and its check is cheap.
5. **Coupling.** Pieces that cannot be separately correct stay together.
   Pieces with disjoint files and state split apart so they can run in
   parallel.

Size labels in the table mean what it takes to verify and review:
- **S:** one behavior, one or two files, one targeted test or command,
  reviewed in minutes.
- **M:** one behavior across a few files or layers, a small group of tests,
  reviewed in one sitting.
- **L:** a smell. Split it, or add a one-line reason it cannot be split
  (mechanical sweep, indivisible rename).

## Output
1. **Goal:** the behavior when all units land, and what is out of scope.
2. **Units:** an ordered table with id, change, files, check, depends on, and
   size (S, M, L; see Sizing). Each row is a unit someone could start without asking you.
3. **Parallel groups:** which units can run at the same time, and why they do
   not collide.
4. **Riskiest unit:** which one and why it sits where it does.
5. **Delivery:** commits on one branch by default; one PR per unit only when
   units must ship separately (a migration, a flag flip).
6. **Decisions for you:** open questions, each with a default.

## Rules
- Plan only. Leave the repo untouched.
- Vague units like "cleanup" or "wire it up" are not units. Name the change
  and its check.
- More than about 8 units means the work is a program: suggest
  `design-doc-draft` or splitting it, instead of a longer list.
- When execution starts, finish and verify one unit before starting the next.

## Credit

Adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack/skills) `principle-sequence-verifiable-units` and the `multi-phase-plan` and `feature` playbooks by Lauren Tan (MIT), reworked for Claude Code. See `NOTICE` in the repo root.
