---
name: teach
description: Build a plain, layered explanation of a change or subsystem so the user actually understands it, combining how it works and why it was built that way. Use for "teach me this", "help me understand this change", or "explain this so I get it".
---

# Teach (understanding, not a summary)

Adapted from pstack `teach` (https://github.com/cursor/plugins/tree/main/pstack/skills/teach), reworked for Claude Code.

Goal: the user can explain it back. This is different from `how`, which
documents mechanics. Here you choose what matters for this person.

## Steps
1. **Pick 2 to 4 takeaways.** From why they are asking and what they already
   know. If you cannot tell, ask one question first.
2. **Gather in parallel.** Run the `how` skill (mechanics) and the `why` skill
   (rationale from commits and PRs) at the same time, via subagents when the
   area is large. Combine their findings; do not redo the analysis.
3. **Build up in layers.**
   - Open with a plain definition, then tie it to the case at hand.
   - Add one layer at a time, each small enough to hold in your head.
   - Define jargon the first time it matters.
4. **Diagram multi-part systems gradually.** Mermaid for flows and state;
   start with two boxes and add a part per step.
5. **Close with the takeaways**, then offer a single follow-up direction.

## Style
- Conversational, short sentences, plain English, no em dashes.
- No quizzes, no filler openers, no labels like "Important:".
- Cite `file:line` for anything claimed about the code.
- Say what is a guess and what you did not check.

## Rules
- Read-only. Change nothing.
- If the user's mental model is wrong, correct it directly and kindly.
