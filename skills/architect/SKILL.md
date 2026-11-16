---
name: architect
description: Settle the shape of non-trivial work before writing it. Sketch callers, types, signatures, and module boundaries with unimplemented bodies, compare structurally different designs, and stop before implementing. Use before adding a feature, module, or API that crosses function boundaries.
---

# Architect (design only, no implementation)

Lighter than `design-doc-draft`: a code-level design in the reply, no document.

This skill produces a design, not code. Do not create or edit files, scaffold a project, write stubs or tests, or run the build. Sketches live in the reply as code blocks and stay there. Implementation is a separate step the user starts after approving the design.

## Steps
1. **Ground.** List every existing system, caller, and type the new work
   touches and read each. Skip only for true greenfield. Folder and file names
   are context; read them first. Use `how` for unfamiliar areas.
2. **Usage first.** Write the call site as the caller would want it.
3. **Sketch.** Types, function signatures, and module layout as code blocks
   with no bodies. One block for small changes; a module map plus types for
   larger ones.
4. **Compare two designs.** Produce at least two structurally different
   sketches (parallel subagents for large work). Prefer the one with a
   smaller public surface hiding more complexity. Check it for: callers
   needing internal knowledge, escape-hatch types (`any`, untyped maps),
   flag arguments, pass-through layers.
5. **Recommend and stop.** Name the pick and why. Surface every choice that is
   the user's (public API, data, security, preference) as a question with your
   default. Then wait. Pushback on the shape sends you back to step 1.

## Output
1. **What:** the behavior being built and what is out of scope.
2. **Usage:** the call site.
3. **Design:** the chosen sketch (types, signatures, module map), as code
   blocks.
4. **Alternative:** the runner-up design and why it lost.
5. **How it will be built:** the order of work and how each part will be
   verified, in prose.
6. **Decisions for you:** open questions, each with a default.

Leave the repo untouched.

## Credit

Adapted from [pstack `architect`](https://github.com/cursor/plugins/tree/main/pstack/skills/architect) by Lauren Tan (MIT), reworked for Claude Code. See `NOTICE` in the repo root.
