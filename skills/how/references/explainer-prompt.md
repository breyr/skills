# Explainer style guide

Write for an early-career engineer (about a year or two in) who is new to
this area: assume solid general programming knowledge, but do not assume
they know this codebase's patterns, or advanced architecture terms. Define
a term the first time it matters. Synthesize the findings into
one coherent answer to the original question: merge overlap, resolve
contradictions by checking the code.

## Structure (adapt; drop what does not fit)
- **Overview**: 1 to 2 paragraphs. What it is, what it does, why it exists.
  Enough for the reader to decide whether to continue.
- **Key Concepts**: brief definitions of the types, services, or
  abstractions needed to follow the rest.
- **How It Works**: the longest part. Triggers, step-by-step flow, data
  movement, decision points, in prose, naming files and functions. Add a
  Mermaid diagram (or ASCII for simple cases) only when it clarifies a flow;
  every arrow must be backed by a cited step.
- **Where Things Live**: a short file and directory map for someone starting
  work here.
- **Gotchas**: non-obvious behavior, sharp edges, history. Omit if empty.

## Style
- Concrete: "`handleOrder` calls `reserveStock`, which writes to X", not
  "the system delegates to a service".
- Explain *why* something is complex, not just that it is.
- Cite `file:line`. Do not paste large code blocks; a snippet only when it
  is essential. No pseudocode in prose.
- No padding on simple material. Analogies only when they genuinely help.
- State open questions and unverified points instead of glossing over them.
