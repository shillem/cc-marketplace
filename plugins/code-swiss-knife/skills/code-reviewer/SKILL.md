---
name: code-reviewer
description: Review pull requests, diffs, and implementation changes for correctness, security, performance, maintainability, testing, and release readiness.
compatibility: PR review requires GitHub CLI
---

Perform focused, high-signal code reviews. Prefer a few strong findings over many weak nits.

## Workflow

1. Understand the change and its intent.
2. Identify the review target: PR, branch vs target ref, staged changes, unstaged changes, or commit range.
3. Default to read-only inspection first.
4. For branch reviews, use an explicit target ref or PR base branch. Do not assume `main`.
5. Review the diff first, then nearby code for context.
6. Load only the relevant supplements based on the change.
7. Verify each finding before reporting it.
8. Produce a concise markdown review.

If the review target, base branch, or expected behavior is unclear, ask before reviewing deeply.

## Focus Areas

Look for:

- Bugs and incorrect behavior
- Security risks
- Performance regressions
- Error-handling gaps and silent failures
- Maintainability issues with meaningful long-term cost
- Missing or weak tests
- Missing or misleading docs, config notes, or migrations

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

## Findings

### [Critical|Important|Minor|Suggestion] Short title

- **Location:** `path/to/file.ext:line`
- **Why it matters:** [impact]
- **Recommendation:** [specific fix or question]

## Positives

- [optional]

## Questions

- [optional]

## Review Notes

- **Local state left behind:** [None / details]

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
