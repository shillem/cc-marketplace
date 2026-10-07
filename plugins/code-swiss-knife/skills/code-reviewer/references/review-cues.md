# Review Cues

Use these cues after building the change map. They are prompts for investigating relevant paths, not a checklist to mention in the final report. Reporting thresholds apply to the coordinator's final report; delegates return borderline candidates they cannot refute and identify the missing evidence.

## Runtime Behavior

- Trace changed branches, defaults, early returns, fallbacks, error handling, retries, cancellation, and cleanup; scrutinize broad catches, swallowed exceptions, and empty handlers.
- Check empty, missing, duplicate, repeated, minimum, maximum, stale, reordered, and unknown values where the changed path accepts them.
- Follow partial failure in multi-step work: what remains if an earlier write or side effect succeeds and a later step fails?
- Check repeated or concurrent execution for races, duplicate effects, stale state, and non-idempotent retries.
- Follow async work past disposal, timeout, cancellation, shutdown, or ownership changes.
- Check resource lifetime for transactions, locks, files, timers, listeners, subscriptions, buffers, and temporary data, and keep caches, derived state, indexes, and generated output consistent after changes.
- Look for observable performance regressions such as repeated I/O, N+1 work, unbounded collection, missing limits, blocking work, or retry storms.
- For user-facing changes, inspect relevant keyboard, assistive-technology, locale, layout, browser, and platform behavior.
- Check logs, errors, telemetry, diagnostics, and output for secrets or sensitive data.

## Contracts and Security Boundaries

- Identify changed public APIs, serialized data, schemas, storage formats, CLI flags, events, plugin interfaces, environment requirements, and integration payloads.
- Find existing callers, old persisted data, stale configuration, and external consumers that rely on the previous shape or semantics.
- Check whether required values, ranges, ownership, and invariants are enforced at the boundary rather than merely documented or cast.
- Follow untrusted values into SQL, commands, paths, rendering, deserialization, redirects, webhooks, outbound requests, archives, and uploads.
- Check cookies, sessions, tokens, CORS, redirect policy, and transport settings when network or authentication boundaries change.
- Check authorization at the resource and tenant boundary that owns the operation; do not assume an outer caller always enforces it.
- Check safe defaults, unknown enum or status values, version skew, migration ordering, rollback behavior, and generated artifacts.
- Inspect dependency and configuration changes for vulnerable or incompatible versions, exposed debug surfaces, and insecure defaults.
- Look for secrets or sensitive data crossing persistence, transport, third-party, or user-visible boundaries.

## Regression Protection

- For a bug fix, identify a test that would fail on the original defect.
- For important changed behavior, determine whether a test fails when the behavior is removed, reversed, or silently skipped.
- Inspect deleted, skipped, loosened, or re-snapshotted tests and confirm intended behavior—not a silenced failure—justifies the change.
- Check negative and boundary paths for validation, permissions, parsing, migrations, side effects, retries, cleanup, and dependency failures.
- Prefer observable outcomes over internal calls, mock interactions, snapshots, or implementation-specific ordering.
- Check fixtures and tests for dependence on clocks, random values, global state, network access, environment, caches, or execution order.
- Report a protection gap only when a meaningful regression can realistically ship unnoticed. Recommend the earliest reliable control: usually an integration test across boundaries or a unit test for isolated logic. When deterministic tests are unsuitable, name a benchmark, load check, deployment check, or other concrete substitute rather than waiving protection.

## Structure and Ownership

- Look for a new second source of truth, copied validation, parallel normalization, repeated conditions, or feature logic in the wrong owner.
- Challenge new flags, nullable states, modes, wrappers, registries, factories, adapters, and compatibility branches that serve only one current case.
- Check whether removed or replaced behavior left dead branches, old names, stale flags, or transitional code.
- Report complexity only when it creates a concrete risk: future changes will likely happen in the wrong place, duplicated behavior can diverge, or control flow and side effects become materially difficult to trace.
- Prefer the smallest behavior-preserving fix: remove a branch, reuse an existing owner, strengthen a boundary, or extract actual repeated logic.

## Documentation and Release Surfaces

- Cross-check changed comments, examples, commands, screenshots, defaults, payloads, and error descriptions against the implementation.
- Search for stale guidance when behavior, configuration, permissions, migrations, dependencies, or public contracts change.
- Check whether users, operators, or integrators need upgrade, rollback, troubleshooting, or compatibility instructions.
- Report missing documentation only when a named audience could take the wrong action or make the wrong decision without it.
- Prefer removing obvious or stale comments; preserve explanations of non-obvious constraints and workarounds.
