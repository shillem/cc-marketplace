# Test Scope

Own proof that meaningful regressions would fail tests. Do not chase coverage percentages or one-test-per-branch completeness. A test gap matters when realistic behavior, contract, permission, data, or release risk can ship unnoticed.

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
- Is existing integration coverage direct enough to catch this regression, or only assumed?

## Inspect

1. List meaningful changed behaviors and contracts from the diff.
2. For each important risk, identify the test that would fail if it regressed.
3. Check at least one negative or boundary path for important validation, parsing, permission, async, migration, and error-handling changes.
4. Recommend the right test level: integration for cross-boundary behavior, unit for isolated logic, and mocks only at clear system boundaries.
5. Review new/changed tests for behavior assertions instead of implementation coupling.
6. Check fixtures and determinism against production-like failure modes.

## Report

Promote a test gap only when it protects against a plausible regression with real user, business, operational, security, data, or release risk.

For each finding, state:

- the changed behavior or contract at risk,
- the realistic regression that could ship,
- why current tests would not catch it,
- the test scenario that should be added or strengthened, and
- the appropriate severity using the top-level severity labels.

Do not request tests for trivial getters, mechanical wiring, or behavior already covered by a meaningful test that would actually fail on the regression.
