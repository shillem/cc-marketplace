# Code Quality Standards

## Review Prompts

- Check separation of concerns, cohesion, and whether responsibilities are mixed
- Look for real duplication that should be extracted into shared helpers or utilities
- Check naming for clarity and intent
- Review control flow for unnecessary complexity or hidden coupling
- Check invariants, API contracts, and whether invalid states are too easy to represent
- Prefer constants or config over scattered hardcoded values
- Check whether the file or module is taking on multiple responsibilities
- Confirm tests and docs support long-term maintainability when the change is non-trivial

## Review Guidance

Focus on issues that affect comprehension, correctness, reuse, or future change cost. Skip style-only nits unless the inconsistency is distracting or likely to cause mistakes.
