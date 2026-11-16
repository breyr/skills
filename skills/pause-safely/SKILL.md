---
name: pause-safely
description: Stop in-flight work cleanly so a fresh agent with no context can resume later. Commits changes as one wip commit and writes a resume note. Use only when the user explicitly asks to pause or stop for now.
disable-model-invocation: true
---

# Pause safely (stop so someone else can resume)

Different from `wrap-up`: that writes a human note to a daily log; this preserves the work and a note an agent can resume from. This skill offers to run `wrap-up` at the end.

Only when the user explicitly asks to pause. "Keep going", "going to bed, keep
going", or "don't stop" mean do not pause.

## Steps
1. **Reach a safe stop.** Finish the current atomic step or back it out.
   Start nothing new. Stop any running subagents or background commands.
2. **No irreversible actions.** Do not open a PR or push unless one was
   already open or the branch was already pushed.
3. **Preserve the work.** If there are uncommitted edits, commit them as one
   `wip:` commit on the current branch. Never `git add -A` blindly: run
   `git status` first, stage tracked changes plus only the untracked files
   that are part of the work, and leave out anything secret-like (`.env*`,
   keys, credentials, tokens) or generated (build output, logs). Say what you
   left unstaged. If the code does not build or tests
   fail, say so in one line in the commit body. Never add a wip commit on
   `main` or the default branch: create a branch first and say so.
4. **Write the resume note** to `~/.claude/resume/<repo>-<branch>.md`
   (create the folder), outside the repo so the tree stays clean. Include:
   - intent (the goal in one or two sentences);
   - done and verified, with how it was verified;
   - in progress, and the exact state it was left in;
   - next steps in order;
   - key files with `path:line`;
   - gotchas and decisions already made.
   If a plan or work log already exists, point to it instead of copying.
5. **Offer `wrap-up`.** Ask once whether to also log this to the daily
   note. If yes, run the `wrap-up` skill and give it the note's
   intent, done, and next steps so nothing is written twice. If no, stop.

## Reply
Present it as a pause, not a final report:
- where you stopped in the workflow;
- what is saved on disk (paths) versus only in your head (say it, then write
  it into the note);
- commits made and whether the tree is clean;
- the first action to take on resume.

## Rules
- Do not claim work is finished that is not.
- Do not discard or reset anything to make the tree clean.

## Credit

Adapted from [pstack `pause-safely`](https://github.com/cursor/plugins/tree/main/pstack/skills/poteto-mode/playbooks/pause-safely.md) by Lauren Tan, reworked for Claude Code.
