---
name: architect
description: Settle the shape of non-trivial work before writing it. Sketch callers, types, signatures, and module boundaries with unimplemented bodies, compare structurally different designs, then fill in code against the sketch. Use before adding a feature, module, or API that crosses function boundaries.
---

# Architect (shape first, bodies second)

Adapted from pstack `architect` (https://github.com/cursor/plugins/tree/main/pstack/skills/architect), reworked for Claude Code. Lighter than `design-doc-draft`: code-level sketch, no document.

## Steps
1. **Ground.** List every existing system, caller, and type the new code
   touches and read each. Skip only for true greenfield. Folder and file names
   are context; read them first. Use `how` for unfamiliar areas.
2. **Usage first.** Write the call site as the caller would want it, before
   any implementation.
3. **Sketch.** Types, function signatures, class shapes, and module layout,
   bodies left unimplemented (throw or return a stub). One file for small
   changes; a module map plus types file for larger ones.
4. **Compare two designs.** Produce at least two structurally different
   sketches (parallel subagents for large work). Prefer the one with a
   smaller public surface hiding more complexity. Check it for: callers
   needing internal knowledge, escape-hatch types (`any`, untyped maps),
   flag arguments, pass-through layers.
5. **Agree.** Proceed by default. Stop for the user only on a public API,
   data, or security choice, or if they asked for a checkpoint. Pushback on
   the shape sends you back to step 1.
6. **Implement.** Replace stubs with real code. Surface any deviation from
   the sketch instead of absorbing it silently.
7. **Scrap if it fights you.** Repeated workarounds or callers reaching into
   internals mean the shape is wrong. Redesign from first principles, make it
   smaller, and redo step 4.

## Output
The usage example, the sketch, and a short note on why this design beat the
alternative. Stubs must not remain in the final code; per the no-excuses rule,
finish them or tell the user what is unfinished.
