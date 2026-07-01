# Simplicity Scope

Own structural maintenance risk. Working code can still be a bad change when it scatters special cases, weakens ownership, duplicates decisions, or makes the next change harder to reason about.

Do not report architecture preferences. Report only when the diff shows current duplication, ownership confusion, weak boundaries, dead code, or unclear flow that creates a concrete maintenance trap.

## High-Yield Targets

Start with structural changes that often hide future risk:

- New mode flags, nullable states, one-off options, compatibility branches, and scattered conditionals
- Feature-specific logic leaking into shared/lower-level modules instead of the owning abstraction
- Duplicate helpers, parser round-trips, repeated shape normalization, copied validation, and parallel implementations
- Generic abstractions, wrappers, registries, adapters, factories, or configuration added for only one real use case
- Files or functions that now mix unrelated responsibilities, obscure data flow, or make changed behavior hard to locate
- Wrong-layer orchestration, multi-step partial updates, and data flow that forces defensive checks across call sites
- Stale code paths, dead branches, old names, unused flags, and transitional code left after replacement
- Dense or clever code that hides control flow, mutation, side effects, or failure handling

## Review Questions

Ask these before accepting the structure:

- What complexity did this change add, and what concrete problem does it solve?
- Could the same behavior be expressed by deleting a branch, using the existing abstraction, or moving logic to the owner?
- Is this abstraction justified by real duplication, or is it speculation?
- Did the change create a second source of truth for a decision, shape, validation rule, or lifecycle?
- Will future maintainers know where to add the next related behavior?
- Does a new flag, mode, optional field, or weak boundary force defensive checks elsewhere?
- Are wrappers/fallbacks making callers simpler, or only hiding complexity in a new place?
- If this pattern were copied into the next three features, would the codebase get easier or harder to change?

## Inspect

1. Identify the owning module/layer for the changed behavior.
2. Check whether the logic lives there and reuses existing helpers/patterns.
3. Look for scattered conditions, duplicate transformations, weak boundaries, and unnecessary indirection.
4. Check whether related updates are atomic enough to avoid partial-state confusion.
5. Check whether removed/replaced behavior was fully retired.
6. Prefer recommendations that delete code, collapse branches, move logic to the owner, strengthen boundaries, or extract real shared logic.

## Report

Report simplicity findings only when the risk is concrete:

- future changes are likely to be made in the wrong place,
- duplicated logic can realistically diverge,
- a weak boundary forces repeated defensive code,
- an abstraction obscures behavior without reducing caller complexity,
- stale code will mislead maintainers, or
- file/function growth materially reduces cohesion or traceability.

For each finding, explain the future failure or maintenance trap, not just that the code is "messy." Recommend the smallest behavior-preserving simplification. Do not edit code during review unless the user explicitly asks for implementation.
