# Documentation Scope

Own written guidance: comments, READMEs, examples, changelogs, migration notes, generated docs, operator guidance, and release notes. Documentation findings matter when text lies, omits release-critical guidance, or leads a maintainer, user, operator, or integrator to make the wrong decision.

## High-Yield Targets

Start with documentation surfaces touched or made stale by the diff:

- Added/changed comments, docstrings, examples, screenshots, command snippets, README sections, changelog entries, and generated docs
- Comments that describe signatures, parameters, return values, side effects, errors, performance, ordering, caching, or security behavior
- User-visible behavior changes, breaking changes, deprecations, config/env changes, permissions, migrations, and operational procedures
- New alerts, metrics, troubleshooting flows, background jobs, retries, fallbacks, or failure modes that operators must understand to act correctly
- TODOs/FIXMEs, transitional notes, workaround explanations, and references to removed names, old flags, or previous implementations
- Docs that mention defaults, payload shapes, CLI flags, schemas, versions, platforms, dependencies, or generated output

## Review Questions

Ask these before accepting the docs:

- Does every factual claim match the current code, schema, CLI help, migration, or generated-doc source of truth?
- Would a maintainer following this comment make a wrong change?
- Would a user/operator following this README, example, migration, or release note get the expected result?
- Did the diff change behavior that requires upgrade, migration, compatibility, config, permission, or troubleshooting guidance?
- Are examples and command snippets still executable and using current names/defaults/payloads?
- Does a comment restate obvious code while omitting the non-obvious constraint?
- Does a temporary explanation now look permanent, or will it rot quickly?
- Did removed behavior leave stale docs, screenshots, TODOs, changelog text, comments, or generated output?
- Is the intended audience clear: maintainer, user, operator, or integrator?

## Inspect

1. Cross-check changed comments/docs against signatures, behavior, side effects, error paths, defaults, schemas, CLI help, and examples.
2. Search nearby docs/comments when the diff changes public behavior, config, permissions, migrations, or operator procedures.
3. Check whether release-visible changes need docs even if no docs were touched.
4. Distinguish missing documentation that creates real risk from internal-only changes that do not need docs.
5. Prefer removing low-value comments over rewriting them.
6. Prefer precise, durable guidance over broad explanatory prose that will rot.

## Report

Report documentation findings only when you can name the audience and the concrete action or decision they would get wrong.

For each finding, state:

- the inaccurate or missing guidance,
- who would be misled,
- the consequence,
- the source of truth in the code/diff, and
- the smallest doc/comment/release-note change that would fix it.

Do not request documentation for purely internal changes unless the absence creates concrete user, operator, integrator, or maintainer risk.
