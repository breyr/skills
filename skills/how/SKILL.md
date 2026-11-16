---
name: how
description: Explain how a subsystem, feature, or flow works in plain, mental-model-first terms for an early-career engineer, and optionally critique its design. Fans out to read-only Explore subagents for complex questions. Use for "how does X work", "walk me through Y", "explain this area", or "how is X structured, and critique it".
---

# How (architectural explanation, optional critique)

Audience: an early-career engineer (about a year or two in) new to this
area. Goal: a mental model they can build on, not annotated source. Explain
the why behind design choices, and define patterns or jargon the first time
they matter. Two modes, chosen from the question: **Explain** (default)
and **Critique** (the user asks for critique, review of the design, problems,
or tradeoffs). Critique always explains first.

## Explain
1. **Size the question.** One file or one tight flow: do it in this thread
   with Read/Grep/Glob, then write the explanation yourself. Spans several
   files, services, or layers: fan out.
2. **Fan out (complex only).** Split into 2 to 4 non-overlapping angles (for
   example: entry and routing, data model, side effects, config and wiring).
   Launch one `Explore` subagent per angle with `model: sonnet` (reading and
   tracing does not need the strongest model; leave `effort` unset), all in
   a single message so they
   run in parallel. Brief each with `references/explorer-prompt.md`, filled
   with the question, its angle, and any paths already known. Explorers are
   read-only and return findings; their output is not shown to the user, so
   you must carry what matters forward.
3. **Synthesize.** Merge the findings yourself using
   `references/explainer-prompt.md` as the style guide. Where explorers
   disagree or a gap remains, open the code and settle it. Do not
   re-explore from scratch. Do not spawn a separate synthesis agent; you
   already hold the findings.
4. **Present.** Sections (drop any that do not fit): Overview, Key Concepts,
   How It Works, Where Things Live, Gotchas. Cite `file:line` as clickable
   references. Say what you did not verify.

## Critique
1. Run Explain first.
2. Launch 2 or 3 `general-purpose` or `Explore` subagents in one message,
   each reviewing independently against `references/critique-rubric.md`.
   Give each the explanation, the key file paths, and the rubric; do not
   share one critic's findings with another. Use `model: opus` for one critic
   (judgment work) and `model: sonnet` for the others, for varied
   perspectives at lower cost. Leave `effort` unset unless the user asks for
   a deeper critique.
3. Triage the findings yourself:
   - **Act on**: real, evidenced, worth changing.
   - **Consider**: plausible, depends on goals.
   - **Noted**: true but low value.
   - **Dismissed**: wrong, speculative, or contradicted by the code. Say why.
   Verify any finding you would Act on by reading the cited code. Drop
   findings that cannot be tied to `file:line`.
4. Present the explanation first, then the verdict. Do not edit any code.

## Rules
- Read-only. This skill explains and critiques; it changes nothing.
- Every non-obvious claim is traceable to code you or a subagent read. No
  citation, no claim, or list it as unverified.
- Prefer the repo's own docs (README, CLAUDE.md, design docs) as context,
  but trust the code when they disagree, and say so.
- Do not fan out for simple questions: it costs more and adds nothing.
- Stuck twice on the same approach: stop and say what you know and don't.

## Credit

Adapted from [poteto/how](https://github.com/poteto/how) by Lauren Tan (MIT), reworked for Claude Code subagents. See `NOTICE` in the repo root.
