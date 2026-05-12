# Error Handling Review Points

## Review Prompts

- Check whether failures are surfaced, logged, retried, or propagated intentionally rather than silently ignored
- Watch for broad `catch` or `except` blocks that can hide unrelated failures
- Check fallback behavior for masked failures, stale data, or surprising partial success
- Review retry logic, timeouts, cancellation, and abort paths for duplicate side effects or unbounded retries
- Check cleanup, rollback, and transaction boundaries on partial failure
- Verify user-facing failures are actionable when the operation is user initiated
- Check logs and error returns for enough debugging context without leaking secrets or sensitive data
- Watch default values, optional chaining, null coalescing, and empty handlers that can hide important failures

## Review Guidance

Raise an error-handling finding only when there is a plausible hidden failure, risky fallback, loss of observability, or cleanup gap. Prefer concrete examples over generic advice. If expected behavior is unclear, ask whether the failure should surface, retry, or propagate.
