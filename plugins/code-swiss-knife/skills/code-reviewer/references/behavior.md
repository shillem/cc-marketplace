# Behavior Scope

Own runtime outcomes: what users, callers, jobs, operators, or persisted state observe after changed code runs. Compare old vs new observable behavior and require evidence before accepting changed execution paths.

Focus this scope on observable runtime outcomes. Boundary-only issues such as authorization controls, type/schema enforcement, compatibility, storage/transport, or third-party handling are outside this scope unless the changed runtime path produces a wrong observable result. Runtime disclosure of secrets or sensitive data through logs, errors, telemetry, diagnostics, or user-visible output is in scope.

## High-Yield Targets

Start where real regressions usually hide:

- New or changed branches, state transitions, side effects, ordering, and removed behavior
- Broad `catch` blocks, empty handlers, `finally` cleanup, retries, timeouts, cancellation, and abort paths
- Runtime exposure of secrets or sensitive data through logs, errors, telemetry, diagnostics, or user-visible output
- Fallbacks, default values, optional chaining, nullish coalescing, feature flags, and compatibility branches that change what callers observe
- Async work, background jobs, event handlers, subscriptions, queues, debouncing, batching, and cache invalidation
- Partial writes, multi-step updates, generated files, indexes, migrations, and persisted or derived state
- Performance/resource regressions with observable impact: unbounded loops, N+1 queries/calls, over-fetching, missing indexes or pagination, repeated work, chatty or blocking I/O, unbounded buffering, leaked memory/listeners/timers, lock contention, retry storms, and missing limits
- Accepted inputs and state combinations that can produce wrong behavior: empty, duplicated, repeated, maximum/minimum, out-of-order, stale, or future status values
- Resource lifecycles: transactions, locks, file handles, temp files, listeners, timers, subscriptions, and rollback paths

## Review Questions

Ask these before accepting the behavior:

- What exact user action, API call, job, or event reaches this changed path?
- What changed in the observable result compared with the previous implementation?
- Could this path look successful while the intended side effect did not happen?
- What state remains if step 1 succeeds and step 2 fails?
- What happens when the operation runs twice, retries, races, or is cancelled midway?
- Can an async effect resolve after the surrounding state, component, job, or resource has been disposed?
- Could a handler swallow an unexpected bug that should fail loudly?
- Are errors surfaced with enough context for users or operators to act without leaking secrets?
- Does the changed path scale with realistic input size and dependency latency, or does it add repeated database/network/disk work?

## Inspect

1. Identify changed entry points and side effects.
2. Compare old and new observable behavior for each meaningful path.
3. Trace the success path and at least one failure or edge path.
4. Check ordering, idempotency, cleanup, rollback, retries, cancellation, resource release, and resource use under realistic input sizes.
5. Check consistency of caches, derived state, generated output, indexes, migrations, and persisted state.
6. Verify suspected issues against nearby callers, jobs, tests, docs, config, or state owners.

## Report

Report only when you can name:

- the trigger condition,
- the wrong observable result,
- who is affected,
- why the code allows it, and
- what should change.

If intended behavior is unclear, ask a focused question instead of asserting a bug. Do not report style-only issues in this scope.
