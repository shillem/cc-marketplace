---
name: code-reviewer
description: Review pull requests, diffs, and implementation changes for correctness, security, performance, maintainability, testing, and release readiness. Use when the user asks for review of a PR, patch, diff, commit, or code change.
compatibility: Requires GitHub CLI
---

Perform focused, high-signal code reviews. Prefer a few strong findings over many weak nits.

## Workflow

1. Understand the change and its intent.
2. Identify the review target: PR, branch vs target ref, staged changes, unstaged changes, or commit range.
3. Default to read-only inspection first.
4. For branch reviews, use an explicit target ref or PR base branch. Do not assume `main`.
5. Review the diff first, then nearby code for context.
6. Build an internal behavior map before reporting findings:
   - What behavior was added, removed, or changed?
   - What new branches, states, modes, status values, flags, boundaries, or error paths exist?
   - What side effects were introduced or changed: writes, external calls, async/background work, persisted state, logs, notifications, cache/config changes, or user/operator-visible outcomes?
7. Perform focused review passes against the behavior map:
   - **State/lifecycle pass:** check changed states, transitions, persisted state, cleanup, and unknown/future states
   - **Testing pass:** map important changed behavior, branches, failure paths, and side effects to meaningful tests
   - **Error/edge pass:** check boundary cases, hidden failures, fallback behavior, partial failure, and cleanup
   - **Dead-code/consistency pass:** check whether removed or replaced behavior left misleading stale code, tests, docs, names, or branches behind
   - **Docs/release pass:** check whether user-facing, operational, migration, config, or troubleshooting changes are documented
8. Promote important coverage gaps to findings. If the review coverage section says a meaningful changed branch, state, side effect, or failure path is untested or only partially checked, include a finding unless the gap is low-risk or explicitly justified.
9. Load only the relevant supplements based on the change.
10. Verify each finding before reporting it.
11. Produce a concise markdown review.

If the review target, base branch, or expected behavior is unclear, ask before reviewing deeply.

## Focus Areas

Look for:

- Bugs and incorrect behavior
- Security risks
- Performance regressions
- Error-handling gaps and silent failures
- State/lifecycle inconsistencies, hidden coupling, stale persisted state, and unreliable cleanup
- Maintainability issues with meaningful long-term cost, especially misleading dead code left by changed behavior
- Missing or weak tests for important changed behavior, branches, edge cases, or side effects
- Brittle or non-isolated tests that can hide failures, leak state, or become misleading after future changes
- Missing or misleading docs, changelog entries, release notes, config notes, or migrations

## Review Mode

- Prefer read-only diff and metadata commands when sufficient
- Only materialize a PR locally when needed to verify a high-impact concern
- Clean up any temp worktree before finishing unless asked to keep it
- If you switch branches, restore the previous branch before finishing unless asked to stay there
- If cleanup would disturb local work, stop and ask
- If any local state is left behind, report exactly what and why

## Useful Commands

```bash
# Pull request review
gh pr view <PR-NUMBER> --json title,body,files,commits,baseRefName,headRefName
gh pr diff <PR-NUMBER> --name-only
gh pr diff <PR-NUMBER> --patch

# Current branch against explicit target ref
git merge-base HEAD <TARGET-REF>
git diff $(git merge-base HEAD <TARGET-REF>)..HEAD
git diff --name-only $(git merge-base HEAD <TARGET-REF>)..HEAD

# Staged changes
git diff --cached

# Unstaged changes
git diff

# Last commit
git show --stat --patch HEAD

# Specific commit
git show --stat --patch <COMMIT>
```

## Findings Bar

Only include a finding when there is a plausible failure mode, missing control, or concrete maintenance risk.

For each finding, be able to answer:

- What could go wrong?
- Under what condition?
- Why does it matter?
- What should change?

If confidence is incomplete, state what you observed and phrase the rest as a question.

Treat review-pass gaps as findings only when they create realistic regression, maintainability, operational, or user risk.

Do not bury meaningful gaps only in `Review Coverage`; promote them to findings with concrete recommendations.

Only return “No findings” after completing the behavior, testing, error/edge, state/lifecycle, dead-code/consistency, and docs/release passes. If a pass is not applicable, say so in the review coverage section.

## Severity

- **Critical**: security issue, data loss, crash, broken production behavior
- **Important**: likely bug, missing validation, serious performance issue, missing critical-path tests
- **Minor**: maintainability issue with low immediate risk
- **Suggestion**: optional improvement

## Output Template

```markdown
# Code Review: [title]

## Summary

- **Assessment:** [Approve / Request Changes / Comment]
- **Scope:** [files reviewed or diff summary]
- **Review mode:** [Read-only diff / local branch / temp worktree]
- **Main risks:** [short list or "None identified"]

## Review Coverage

- **Behavior branches checked:** [yes/no + brief note]
- **Tests mapped to changed behavior:** [yes/no/not applicable + brief note]
- **Error/failure paths checked:** [yes/no + brief note]
- **State/lifecycle impacts checked:** [yes/no/not applicable + brief note]
- **Dead-code/consistency checked:** [yes/no/not applicable + brief note]
- **Docs/release impact checked:** [yes/no/not applicable + brief note]

## Findings

### [Critical|Important|Minor|Suggestion] Short title

- **Location:** `path/to/file.ext:line`
- **Why it matters:** [impact]
- **Recommendation:** [specific fix or question]

## Positives

- [optional]

## Questions

- [optional]

## Verdict

- [concise closing recommendation]
```

## Reference Files

Load only when relevant:

- [Security Checklist](security.md)
- [Performance Review Points](performance.md)
- [Code Quality Standards](quality.md)
- [Testing Review Points](testing.md)
- [Error Handling Review Points](error-handling.md)
