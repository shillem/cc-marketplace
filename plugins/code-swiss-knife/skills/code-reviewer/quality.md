# Code Quality Standards

## Review Prompts

- Check separation of concerns, cohesion, and whether responsibilities are mixed.
- Look for real duplication that should be extracted into shared helpers or utilities.
- Prefer small, readable functions and shallow nesting.
- Check naming for clarity and intent.
- Review control flow for unnecessary complexity or hidden coupling.
- Check error handling, invariants, and API contracts.
- Prefer constants or config over scattered hardcoded values.
- Check whether the file or module is growing beyond a reasonable single purpose.
- Confirm tests and docs support long-term maintainability when the change is non-trivial.

## Local Style Reminders

- Favor small files over large files.
- Organize by feature or domain, not by type.
- Extract repeated logic when repetition is real.
- Keep functions around 50 lines or less when practical.
- Avoid nesting deeper than 4 levels.
- Use readable names and avoid hardcoded values.

## Review Guidance

Focus on issues that affect comprehension, correctness, reuse, or future change cost. Skip style-only nits unless the inconsistency is distracting or likely to cause mistakes.
