---
name: code-map
description: Map how a part of any codebase works, with code citations and diagrams of the flow. Use when the user wants to understand, onboard to, document, or port an area of code, or asks "how does X work", "map this", or "show me the flow".
---

# Code map (how it works, with receipts and pictures)

Ask the user which area, feature, or entry point to map (skip if given).
Produce a one-page note: a short written flow plus diagrams.

## Rules
- Every claim cites `file:line` and the function name. No citation means it
  is an assumption: cut it or list it under "Not verified".
- Read the code. Do not infer behavior from names or comments alone.
- Describe flow, not code: entry points, main steps, side effects (DB writes,
  external calls, events, files), error paths, quirks.
- Diagrams must match the cited steps exactly. Never draw an arrow you
  cannot cite.
- If you try the same approach twice without progress, stop and say what you
  know and don't know.

## Diagrams (Mermaid, in fenced ```mermaid blocks)
Use the smallest set that explains the area. Max ~12 nodes each; split
instead of cramming.
- **Sequence diagram**: who calls whom, in order, including external
  systems and the DB. Best default for a request/flow.
- **Flowchart**: branching logic, validation, and error paths.
- **Component/dependency graph**: which modules depend on which, when the
  question is structure, not order.
- **State diagram**: only if the code has a real state machine.
Label nodes or edges with the function or file so each can be checked.

## Format
```
# <Area>: how it works
Entry points: ...
Diagram(s)
Flow:
1. ... (file:line, function)
Side effects: ...
Error paths: ...
Quirks / gotchas: ... (file:line)
Not verified: ...
```

## After writing
- Tell the user to open each cited line and confirm it matches; spot-check
  the first few, sample the rest.
- Mermaid renders in GitHub, Notion, and most markdown viewers. If the user
  wants to see it now, offer to render it as an HTML page.
- Suggest saving the note where the team can reuse it.
