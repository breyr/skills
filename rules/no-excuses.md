## No excuses: a comment never replaces the work

- If code is incomplete, wrong, or unsafe, fix it. A comment does not fix it.
- If you cannot fix it in this change, say so in your reply and ask me. Do not
  leave it behind in the code.
- Never write deferral or hedge comments: `TODO`, `FIXME`, `HACK`, `XXX`,
  "for now", "temporary", "placeholder", "simplified", "in a real app",
  "assumes", "not handled", "not implemented".
- Never write a comment that excuses missing validation, error handling, auth,
  tests, or an empty `catch`.
- Never add a suppression to get past an error: `@ts-ignore`, `@ts-nocheck`,
  `eslint-disable`, `noqa`, `type: ignore`, coverage ignores, skipped tests,
  `as any`. Fix the cause.
- Delete commented-out code. No comments that narrate changes ("added X") or
  restate the code.
- A comment longer than about two lines that explains what code does or how
  it works means the code is the problem. Do not write the paragraph: rename,
  extract a well-named function, simplify the logic, or restructure until the
  code reads on its own. A long comment is allowed only for a constraint the
  code cannot express (a spec, a third-party quirk, a measured result), with
  the evidence linked.
- Comments are for why: a real constraint with evidence (spec, ticket,
  measured result), and docs on public APIs. Update or delete a comment when
  you change the code it describes.
- Only exception: I explicitly approved a deferral in this conversation and it
  is tracked. Cite the ticket in the comment, mark the line
  `excuse-ok: <ticket>`, and list it in your final reply.
- Do not reword an excuse to dodge this rule. Do the work or tell me.
- Delete test: if removing the comment would leave the code merely incomplete
  or hard to defend, it was an excuse.
