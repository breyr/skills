---
name: catchup
description: Catch the user up after time away. Summarize what changed since their last message and list every decision only they can make, with a recommended pick for each. Read-only. Use when the user types /catchup or asks "catch me up", "what did I miss", or "what needs me".
disable-model-invocation: true
---

# Catchup (catch me up, tell me what needs me)

For rebuilding context across many past sessions, this is not the tool; this is for the current session.

Read-only. Change no code, start no jobs, post nothing.

## Steps
1. **Gather.** Everything since the user's last message: work you did,
   subagent reports, background command output, and anything else in the
   conversation. Check live state of each PR, CI run, branch, and task with
   `git`, `gh`, and task status. Verify every number you will quote.
2. **Find action items.** Calls only the user can make: product choices,
   approvals, irreversible actions, access you lack. Include items raised
   before their last message if still open. Do not invent decisions, and do
   not list work you can do yourself.
3. **Detail each item.** Link, user impact, evidence for your recommendation,
   risk, and your pick. Mark unknown facts "unknown".
4. **Reply in this order:**
   - One sentence: what waits on them, or that nothing does.
   - A short plain-language recap of what happened.
   - At most three lines on what changes their understanding or what they must do.
   - The action items with your picks, grouped when several hinge on one call.

## Style
- Recap stays brief; each action item about 30 words. Never drop an item to
  save space.
- Visuals only when they add something: a small Mermaid diagram or chart from
  real facts, never repeating the text.
- Plain English; no filler, no labels like "Important".

## Credit

Adapted from [pstack `ketchup`](https://github.com/cursor/plugins/tree/main/pstack/skills/ketchup) (renamed `catchup`) by Lauren Tan, reworked for Claude Code.
