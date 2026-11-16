---
name: in-your-own-words
description: Restate the user's goal and the problem in the agent's own words before doing anything, so misunderstandings surface early. Use when the user types /in-your-own-words or asks you to play back what you understood.
disable-model-invocation: true
---

# In your own words (play it back first)

Before any work, reply with:
1. **Goal:** what the user wants to be true when this is done, in one or two
   sentences, in your words, not theirs.
2. **Problem:** what is wrong or missing today that makes the goal worth it.
3. **Assumptions:** anything you filled in that they did not say.
4. **Unclear:** at most one question, with the default you will use if they
   do not answer.

This skill produces a playback, not work. Do not read code, plan, edit
files, run commands, or start the task. Do not flatter or pad. After the
reply, stop and wait. Begin the work only after the user confirms or
corrects the restatement; pushback sends you back to a new playback.

## Credit

Adapted from [pstack `in-your-own-words`](https://github.com/cursor/plugins/tree/main/pstack/skills/in-your-own-words) by Lauren Tan, reworked for Claude Code.
