# Critique rubric

Review the design independently against these lenses. Not every lens applies
to every subsystem: skip those that do not, and say so. Only report issues
you can tie to `file:line`. Prefer plausible near-term changes over
hypothetical ones. Under-abstraction and over-abstraction are equal faults.

1. **Abstraction fit**: do abstractions model real concepts or add
   speculative indirection? Are boundaries drawn around things that change
   independently? Accidental coupling through shared internals? Business logic
   separated from framework wiring?
2. **Data model**: do structures match actual access patterns? Is data
   constantly reshaped because of a mismatch? Do types claim more structure
   than exists at runtime?
3. **Boundary discipline**: validation concentrated at entry points? Errors
   handled at boundaries instead of caught and rethrown at every layer? Data
   crossing boundaries in well-typed shapes, not bags of optional fields?
   Testable in isolation?
4. **Evolution readiness**: if the most probable next requirement arrived,
   how much would change? Hardcoded assumptions? Integrated or bolted on?
   Compatibility paths kept that nothing depends on?
5. **Complexity vs value**: is complexity concentrated where the problem is
   hard (core logic, invariants) or in boilerplate and indirection? A simpler
   way to get the same behavior? Vestigial pieces from older designs?
6. **Consistency**: are similar problems solved as elsewhere in the repo?
   Unexplained inconsistency is a maintenance burden; explained is fine.

## Critic output format
Per finding: lens, severity guess (high/medium/low), `file:line`, what is
wrong, evidence, and the smallest change that would fix it. End with what the
design does well, so the lead can weigh the verdict.
