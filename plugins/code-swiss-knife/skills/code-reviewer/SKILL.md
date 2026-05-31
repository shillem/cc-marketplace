---
name: code-reviewer
description: Review pull requests, diffs, and code changes across behavior, contracts, tests, maintainability, and documentation. Use when the user asks for review of a PR, patch, diff, commit, or code change.
compatibility: Requires GitHub CLI for PR reviews
---

Perform high-signal code reviews. Default to all scopes unless the user asks for a narrower review.

Review as focused specialists. Require evidence from the diff and nearby code before reporting a concern. A finding needs a concrete failure mode, missing control, regression gap, release risk, or maintenance trap.

## Scopes

Classify findings by primary failure mode. Canonical scope names select their matching scope.

| Scope           | Primary failure mode                                      | User request aliases                                                                                                                                                      |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `behavior`      | Wrong observable runtime result                           | correctness, failure/error handling, error paths, state/lifecycle, side effects, async/background work, cleanup, retries, fallbacks, edge cases, performance/resource use |
| `contract`      | Boundary allows invalid, insecure, or incompatible state  | APIs/public interfaces, types, schemas, validation, permissions, auth/authz, compatibility, storage, config, integrations, boundary security, security controls           |
| `test`          | Missing proof a meaningful regression would fail          | testing, tests, coverage, regression protection, test quality                                                                                                             |
| `simplicity`    | Current structure creates a maintenance trap              | quality, maintainability, complexity, duplication, stale/dead code, wrong-layer logic                                                                                     |
| `documentation` | Written guidance misleads or omits release-critical truth | docs, comments, changelogs, release notes, migrations, examples, operator notes                                                                                           |

If a problem spans scopes, report it once and mention secondary impacts only when they affect severity or the fix.

For a broad `security` request, select both `contract` and `behavior`: use `contract` for boundary controls such as authz, validation, injection, unsafe construction, insecure defaults, storage/transport/third-party handling; use `behavior` for runtime disclosure such as secrets or sensitive data in logs, errors, telemetry, or user-visible output. If the user names a narrower security area, select only the matching scope.

## Review Setup

1. Identify the target: PR, branch vs target ref, staged changes, unstaged tracked changes, untracked/current working tree, commit, range, or pasted diff.
2. Determine the base explicitly. For branches, ask if the target ref is unclear. For staged/unstaged/current-tree/commit/range/pasted-diff reviews, do not infer a base ref.
3. Inspect changed files, file types, stats, and PR title/body when applicable.
4. Verify findings against nearby unchanged context: key callers, tests, schemas, docs, config, migrations, generated sources, or state owners.
5. Include untracked files explicitly; ordinary `git diff` misses them.

## Review Safety

- Prefer read-only diff and metadata commands when they are enough
- Only switch branches, materialize PRs, or create worktrees when needed to verify a concrete high-impact concern or when the user asks
- Restore the previous branch and clean up temporary worktrees before finishing unless the user asks to keep them
- If cleanup would disturb local work, stop and ask
- Report any local state left behind and why

Command cues, used only as needed to establish the target and inspect the patch:

```bash
# PR metadata and patch
gh pr view <PR> --json title,body,files,commits,baseRefName,headRefName
gh pr diff <PR> --patch

# Working tree: staged, unstaged, and untracked files
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard

# Explicit branch, commit, and range targets
git diff $(git merge-base HEAD <TARGET-REF>)..HEAD
git show --stat --patch <COMMIT>
git diff --stat <BASE>..<HEAD>
git diff <BASE>..<HEAD>
```

## Review Flow

These files define the scope instructions:

- [Behavior](behavior.md)
- [Contract](contract.md)
- [Test](test.md)
- [Simplicity](simplicity.md)
- [Documentation](documentation.md)

### Delegated Review

Use delegation when subagent tool is available, you are not already delegated, and more than one scope is selected. Do not load all scope files in the aggregator just to delegate. For trivial diffs (a single file, a few lines, or one obvious scope), prefer linear review even when multiple scopes nominally apply, rather than fanning out a delegate per scope.

1. Run one delegate per selected scope in parallel.
2. Give each delegate only its assigned scope, target/base, changed files, user constraints, and pasted diff if applicable.

   ```text
   You are a delegate reviewer for the code-reviewer skill.
   Run only the `[scope]` scope.

   Review target: [target]
   Base/ref: [base, range, or none]
   Changed files: [known list]
   User constraints: [constraints]

   [pasted diff, only when applicable]

   Output findings and unresolved review questions only. For findings, include severity, confidence, location, why it matters, and recommendation. For questions, include the likely severity if the risk is confirmed and the evidence needed to resolve it. If there are no findings or questions, say none and name the risk surface checked.
   ```

3. Aggregate findings and unresolved review questions, deduplicate by root cause, and verify each retained finding against the diff and nearby code. Keep questions only when the uncertainty is evidenced by the diff/context and could change the assessment; carry them into the final `## Questions`, not `## Findings`. Delegates only see their own scope and cannot dedup across scopes, so the "report a cross-scope issue once" rule is enforced here: collapse the same root cause raised by multiple delegates into one finding under its primary scope. Reclassify valid findings into the right selected scope instead of dropping them. Preserve distinct Critical/Important findings and distinct Minor root causes; group related Minor instances when needed.

### Linear Review

When delegation is unavailable or only one scope is selected, load only the selected scope instruction files and apply them yourself. For each scope, identify the changed risk surface and suspicious locations before deciding whether findings exist.

## Findings Bar

Report findings only with concrete evidence.

For each finding, be able to answer: what could go wrong, under what condition, who is affected, why it matters, what should change, and how confident the evidence is.

Confidence:

- **High** — directly evidenced by the diff and verified nearby context
- **Medium** — plausible and important, but expected behavior or runtime context is partly uncertain

Low-confidence concerns belong in `## Questions`, not `## Findings`. Do not drop potentially severe low-confidence concerns; ask the blocking question and state the likely severity if confirmed.

Suggestions are optional improvements with clear upside.

## Severity and Assessment

- **Critical**: security issue, data loss, crash, broken production behavior → normally **Request Changes**
- **Important**: likely bug, missing validation/control, serious performance issue, missing critical-path test → normally **Request Changes**
- **Minor**: concrete maintainability, test, docs, or edge-case issue with lower immediate risk → normally **Comment**, or **Request Changes** if central, repeated, or compounding
- **Suggestion**: optional improvement with clear upside → **Approve** or **Comment** depending on release risk

No findings after all selected scopes have run means **Approve** or explicitly say no findings if approval is not appropriate for the context.

## Output Template

```markdown
# Code Review: [title]

## Summary

- **Assessment:** [Approve / Request Changes / Comment]
- **Scope:** [target and files reviewed]
- **Main risks:** [short list or "None identified"]

## Pass Results

- **Behavior:** [findings / no findings / N.A. + one-line note]
- **Contract:** [findings / no findings / N.A. + one-line note]
- **Test:** [findings / no findings / N.A. + one-line note]
- **Simplicity:** [findings / no findings / N.A. + one-line note]
- **Documentation:** [findings / no findings / N.A. + one-line note]

## Findings

### [Critical|Important|Minor|Suggestion] Short title

- **Confidence:** [High|Medium]
- **Location:** `path/to/file.ext:line`
- **Why it matters:** [impact and condition]
- **Recommendation:** [specific fix]

## Positives

- [optional]

## Questions

- [optional]

## Verdict

- [concise closing recommendation]
```

List one Pass Results line per selected scope; omit scopes the user excluded. Every selected scope must be represented as findings, no findings, or not applicable. A scope is not applicable only when the diff contains no meaningful surface for it.
