---
name: why
description: Explain why something was built the way it was, answering from commits, PRs, and issues rather than from the code. Use for "why does X work this way", "why did we choose Y", regressions, postmortems, and where a threshold or constant came from. For how it works at runtime, use how.
---

# Why (answer from the record, not the code)

Adapted from pstack `why` (https://github.com/cursor/plugins/tree/main/pstack/skills/why), reworked for Claude Code.

The code shows what exists. The record shows what the authors intended.
Answer from the record.

## Steps
1. **Pin the target.** The file, function, constant, or behavior the question
   is about. Ask one question if it is ambiguous.
2. **Find the introducing change.** `git log -S '<symbol>' --follow -- <path>`
   and `git blame -L` on the lines. Read that commit message and diff.
3. **Walk later changes.** Every commit that touched the target since, in
   order. Note what each one changed and what it said about why.
4. **Read the discussion.** For each commit with a PR number, read the PR
   description and review comments (`gh pr view <n> --comments`). Follow
   linked issues. If `gh` is unavailable, say so and stay with commit text.
5. **Widen only if the trail is thin.** Design docs, ADRs, README history,
   CHANGELOG. Do not guess to fill gaps.

## Answer
- Quote or closely paraphrase what the authors wrote, with the commit SHA or
  PR number next to each claim.
- Label anything you infer as an inference.
- End with what the record does not answer, and who or where could.
- Never present a plausible-sounding rationale the record does not support.

## Rules
- Read-only. Change nothing.
- If the code and the record disagree, report both and say which is newer.
- Questions about how it behaves at runtime belong to `how`; use that.
