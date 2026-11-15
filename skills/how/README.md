# how

For humans. Claude Code only loads `SKILL.md` and the `references/` files it
points to; this file is documentation.

## What it does
Explains how a subsystem, feature, or flow works, written for an early-career
engineer new to the area. Optionally critiques the design. Read-only: it
never edits code.

## Layout
```
SKILL.md                         routing: simple vs complex, explain vs critique
references/explorer-prompt.md    brief handed to each Explore subagent
references/explainer-prompt.md   structure and style of the final answer
references/critique-rubric.md    six lenses the critics review against
```

## Implementation details
- **Simple questions** are answered in the main thread. **Complex** ones
  (several files, services, or layers) fan out to 2-4 `Explore` subagents,
  one per non-overlapping angle, launched in a single message so they run in
  parallel.
- **Models**: explorers use `sonnet` (reading and tracing). Critics use one
  `opus` and the rest `sonnet`. `effort` is left unset on purpose; set it only
  if critiques come back shallow. These settings are untested.
- **Synthesis** happens in the main thread, not a separate agent, because the
  main thread already holds the explorers' findings. Subagent output is not
  shown to the user, so the main thread carries it forward.
- **Critique** runs Explain first, then 2-3 independent critics who do not
  see each other's findings. The main thread triages into Act on / Consider /
  Noted / Dismissed and must verify each Act on item against the cited code.
- **Audience** is set in `SKILL.md` and `explainer-prompt.md` (early-career,
  about a year or two in). Change it in both places.
- Replaced the former `code-map` skill. `how` does not save a note; ask
  Claude to write the explanation to a file if you want one. Diagrams are
  Mermaid, only where they clarify a flow.

## Where the ideas come from
- **Structure and workflow** (explain/critique modes, parallel explorers,
  synthesis, `references/` prompt files, the critique rubric's six lenses):
  adapted from [poteto/how](https://github.com/poteto/how), a Cursor plugin.
  Written from summaries of its files, not copied; wording is original.
- **Changed for Claude Code**: Cursor-plugin packaging dropped; subagents
  expressed as the Agent tool with `Explore` and a `model` setting; critics
  limited to Claude models (the original used Claude, Composer, and GPT);
  synthesis moved into the main thread; the Act on / Consider / Noted /
  Dismissed triage and the verify-before-acting rule were added here (the
  source describes categories but I could not confirm its exact scheme).
- **Audience level**: changed from senior to early-career on the user's
  request.

## Not done
No reading of the upstream critic prompt, no support for non-Claude critics,
no persistent output file.
