---
name: code-taste
description: Code-design rules for writing or reviewing TypeScript, covering when to add a cache, a Set, a shared module, a resubscription, a result type, an options object, or a builder, plus where state lives and how to name things. Load it whenever you write, change, or review TypeScript.
---

# Code taste

**Core rule:** add structure (a cache, a Set, a shared module, a builder, a result type, a resubscription) only when size, cost, sharing, or a caller's need justifies it. Keep it as small as that need.

If the repo's neighboring code does it differently, follow the repo and say so.

## State and ownership
- Module-level constants are fine.
- Module-level mutable state must not drive behavior. Keep state in an owner you can name: a closure, a class, or an object the caller holds.
- Start with a closure. Use a class when callers need to read the state (for example, how many items a batcher has sent).
- A setting of a stateful owner (a limit, a size) is a parameter with a default, not a module constant, so each instance can differ:

```ts
export function createBatcher<T>(limit = 50) {
  let sent = 0;
  return (items: T[]): T[] => {
    const batch = items.slice(0, limit - sent);
    sent += batch.length;
    return batch;
  };
}
```

## Subscriptions and callbacks
- Keep one subscription. To change behavior, swap the reference the handler reads (`holder.handler = next`).
- Resubscribe only when the new handler needs context that only a new subscription provides.
- Read the current value through a reference when the handler runs. Don't copy it when you subscribe.

## Caching
- Don't cache a single arithmetic step.
- Cache when the same costly work repeats for a few recurring inputs, such as a currency format that keeps switching.
- The key includes every input the result depends on. A key that misses one returns wrong results, so reject it even when the cache itself is justified.
- Build a composite key with `JSON.stringify` of an object literal, so each input is named and adding one is one more field. Never use the object itself as a `Map` key: a fresh object never matches.
- Use only inputs JSON represents faithfully: strings, finite numbers, booleans. `JSON.stringify` drops `undefined` and turns `NaN` into `null`, so different inputs can share a key.

```ts
const key = JSON.stringify({ width, height }); // not `${width}x${height}`
// Never pass the object itself ({ width, height }) as the Map key.
```

## Duplicates and late results
- If you own the source of a duplicate, fix it there. Don't add bookkeeping to cancel it.
- If you don't own the source, make the operation idempotent with a key.
- When async results can arrive late, tag each request with its key. Drop any result whose key isn't the latest.

## Modules and shared code
- Give each responsibility its own module: I/O, business rules, and presentation.
- A small feature whose types belong only to it may stay in one file.
- Split a small feature when a type it uses is shared outside it. Format and validate for a shared `DateRange` go in `range/format.ts` and `range/validate.ts`.
- A type used outside the feature stays with its owner. Don't copy it into a feature `types.ts`.
- Extract shared code at the third use for simple logic, and at the second use for shared business rules. It goes in a shared module. Single-use code stays with its responsibility.

## Where tests live
- Tests never live in the module file they test, and never in the same folder as it.
- Tests never live inside the source folder. Put them in a `tests/` folder that is a sibling of the source folder.
- The test's path under `tests/` mirrors the module's path under the source folder, with `.test` before the extension: `src/range/format.ts` is tested by `tests/range/format.test.ts`.
- If the repo already colocates tests, follow the repo and say so. Don't move existing tests unasked.

## Lookups
- Fewer than 10 values: an array with `includes`.
- 10 or more values: a `Set`.

## Failures
- For invalid input, throw an `Error` whose message names the bad value.
- Document what an exported function throws with `@throws`, so callers know to catch it.
- Return a result type (`{ ok: true; value } | { ok: false; error }`) only when the repo already has a helper for building and checking it. Don't introduce result types for one function.

## API shape
- Up to four parameters: positional, with defaults for the optional ones.
- A fifth parameter: switch to one options object with defaults in the destructuring.
- A builder only for custom clients that need composed behavior. More settings alone never justify one.

## Naming
- Name length follows scope. Exported or cross-module names are explicit (`userCanEditDocument`). Local helpers can be short (`canEdit`).

## Applying this
- When writing, check the core rule first, then the section for the structure you're adding.
- When reviewing, name the section a change breaks and say why.
- This file only says where tests live. For what and how to test, use the unit-testing skill.
