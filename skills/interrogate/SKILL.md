---
name: interrogate
description: Adversarial review that keeps only findings a run proves. Several independent reviewers try to break a diff or design with real repros; each finding is re-run before it is reported. Use for "try to break this", "stress this change", or before merging risky work.
---

# Interrogate (break it, prove it)

Adapted from pstack `interrogate` (https://github.com/cursor/plugins/tree/main/pstack/skills/interrogate), reworked for Claude Code. Different from `code-review`: nothing is reported unless a command shows the failure.

## Steps
1. **Frame.** Scope is what the user names, else the branch diff against its
   merge base. State the intent in one sentence; ask if it is unclear.
2. **Fan out.** Launch 2 or 3 adversaries in one message, each an `Agent`
   with `isolation: "worktree"` so repros cannot disturb the tree, using
   different `model` values for variety. Brief each with the scope and
   intent, and tell them: break the change with a real repro (failing test,
   script, or command output); no style notes; no speculative risks; report
   the exact command and its output.
3. **Verify.** Re-run every finding's command yourself. Keep it only if the
   output shows the failure and the failure breaks the stated intent. Merge
   findings sharing a root cause.
4. **Report.**
   - The restated intent.
   - Verified findings: command, output, impact, which adversaries found it.
   - A count of dropped findings per adversary, with the reason.

## Rules
- Report only. Apply no fixes unless the user asks afterward.
- Adversaries disagree by design; do not vote or average, just verify.
- For "what else does this touch" questions without a break attempt, use
  `blast-radius` instead.
