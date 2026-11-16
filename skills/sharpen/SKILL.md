---
name: sharpen
description: Rewrite a prompt so the task is deeper, not bigger, before it is sent. Does not perform the task. Use when the user types /sharpen with a draft prompt or asks to improve a request.
disable-model-invocation: true
---

# Sharpen (deeper, not bigger)

Goal: a better version of the user's prompt. Do not do the task itself.

## Steps
Answer these four briefly, for the draft prompt:
1. What would a top professional in this field do that the user did not ask
   for?
2. What is the rawest source material they would start from, rather than a
   digested summary?
3. Which specific methods and tools would they use?
4. What besides you and the user would show the result is correct (a test,
   a measurement, a reference, a running app)?

## Output
1. The rewritten prompt, ready to paste. Keep the user's intent and voice;
   add depth, not scope.
2. If a choice can be settled by an experiment, the rewrite asks for a quick
   prototype and a recommendation from the results. Product or preference
   choices stay with the user.
3. Two or three lines on what you changed and why.

## Credit

Adapted from [pstack `sharpen`](https://github.com/cursor/plugins/tree/main/pstack/skills/sharpen) by Lauren Tan, reworked for Claude Code.
