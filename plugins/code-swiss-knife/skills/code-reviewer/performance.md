# Performance Review Points

## Review Prompts

- Check algorithmic complexity and how the code scales with realistic input sizes.
- Look for repeated work that can be eliminated, batched, memoized, or cached.
- Review database access for N+1 queries, over-fetching, missing indexes, and poor pagination.
- Check network or disk I/O for unnecessary calls, chatty behavior, or blocking operations.
- Review memory use, object lifetimes, buffering, and full-load versus streaming tradeoffs.
- Check lock contention, queue growth, retry storms, and duplicate work under concurrency.
- Consider startup, cold-path, and background job impact where relevant.

## Review Guidance

Prefer findings with expected user or system impact. If the risk is uncertain, call it out as a question or suggest profiling, benchmarking, or load testing.
