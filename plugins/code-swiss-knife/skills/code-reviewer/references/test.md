# Test Scope

Own reliable detection of meaningful regressions. Prefer deterministic pre-release checks, and do not chase coverage percentages or one-test-per-branch completeness. A protection gap matters when realistic behavior, contract, permission, data, or release risk can ship unnoticed.

## High-Yield Targets

Start with changes most likely to need regression protection:

- Bug fixes without a test that would fail on the original bug
- New or changed validators, parsers, permission checks, migrations, side effects, error handling, fallback paths, and async/background work
- Critical business rules, user-visible flows, data writes, external integrations, retries, cleanup, cache invalidation, and generated output
- Negative cases: invalid input, missing fields, unauthorized access, stale data, duplicate requests, failed dependencies, and malformed external payloads
- Edge cases: empty, nullish, max/min, unknown enum/status values, reordered input, repeated input, time boundaries, and concurrency/order sensitivity
- Deleted, skipped, loosened, or assertion-weakened tests
- Snapshot/golden/generated-output changes that may bless accidental behavior
- Tests that assert implementation details, mock interactions, internal calls, or fragile ordering instead of observable behavior

## Review Questions

Ask these before accepting the tests:

- What specific regression would this test fail on?
- Would a test fail if the main changed behavior were removed, reversed, or silently skipped?
- For bug fixes or changed existing behavior, would a test have failed before the fix?
- Is the risky branch tested, or only the happy path around it?
- Are validation, authorization, failure, fallback, cleanup, retry, and migration paths covered where they matter?
- Does the test assert the user/caller-visible result, persisted state, emitted event, error, or side effect that matters?
- Could a mock or fixture mirror the implementation mistake and let the test pass?
- Is the test deterministic with respect to time, ordering, network, environment, caches, globals, and shared state?
- Is a unit or integration test reliable for this property, or does it require another deterministic pre-release check such as a benchmark, load test, or deployment check?
- Is existing integration coverage direct enough to catch this regression, or only assumed?

## Inspect

1. List meaningful changed behaviors and contracts from the diff.
2. For each important risk, identify the control that would detect a regression.
3. Check at least one negative or boundary path for important validation, parsing, permission, async, migration, and error-handling changes.
4. Recommend the earliest reliable control: integration tests for cross-boundary behavior, unit tests for isolated logic, and mocks only at clear system boundaries.
5. Review new/changed tests for behavior assertions instead of implementation coupling.
6. Check fixtures and determinism against production-like failure modes.

## Report

Promote a protection gap only when it covers a plausible regression with real user, business, operational, security, data, or release risk.

Before prescribing a test, confirm the asserted behavior is stable, representative, and deterministic enough for the check to survive benign dependency and runtime changes. Prefer the earliest reliable control: use a benchmark, load test, or deployment check when a unit or integration test is unsuitable. Name a canary or production monitoring only as a last resort when no reliable pre-release check is practical, and state why. If operational coverage cannot be verified from the repository or available context, ask about it instead of reporting it as missing. Keep severity based on the unprotected risk, and never waive protection without naming the substitute.

For each finding, state:

- the changed behavior or contract at risk,
- the realistic regression that could ship,
- why current tests or other controls would not catch it,
- the test or other control that should be added or strengthened, and
- the appropriate severity using the top-level severity labels.

Do not request protection for trivial getters, mechanical wiring, or behavior already covered by a meaningful control that would catch the regression.
