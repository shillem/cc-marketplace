---
name: code-reviewer
description: Review pull requests, diffs, and code changes across behavior, contracts, tests, maintainability, and documentation. Use when the user asks for review of a PR, patch, diff, commit, or code change.
compatibility: Requires GitHub CLI for PR reviews
---

Perform high-signal code reviews. Default to all scopes unless the user asks for a narrower review.

Review as focused specialists. Require evidence from the diff and nearby code before reporting a concern. A finding needs a concrete failure mode, missing control, regression gap, release risk, or maintenance trap.

## Scopes

Classify findings by primary failure mode. Canonical scope names select their matching scope.

| Scope           | Primary failure mode                                      | User request aliases                                                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `behavior`      | Wrong observable runtime result                           | correctness, failure/error handling, error paths, state/lifecycle, side effects, async/background work, cleanup, retries, fallbacks, edge cases, performance/resource use, accessibility, localization, browser/platform compatibility |
| `contract`      | Boundary allows invalid, insecure, or incompatible state  | APIs/public interfaces, types, schemas, validation, permissions, auth/authz, compatibility, storage, config, integrations, boundary security, security controls                                                                        |
| `test`          | Meaningful regression can ship without reliable detection | testing, tests, coverage, regression protection, test quality                                                                                                                                                                          |
| `simplicity`    | Current structure creates a maintenance trap              | quality, maintainability, complexity, duplication, stale/dead code, wrong-layer logic                                                                                                                                                  |
| `documentation` | Written guidance misleads or omits release-critical truth | docs, comments, changelogs, release notes, migrations, examples, operator notes                                                                                                                                                        |

If a problem spans scopes, report it once and mention secondary impacts only when they affect severity or the fix.

For a broad `security` request, select both `contract` and `behavior`: use `contract` for boundary controls such as authz, validation, injection, unsafe construction, insecure defaults, storage/transport/third-party handling; use `behavior` for runtime disclosure such as secrets or sensitive data in logs, errors, telemetry, or user-visible output. If the user names a narrower security area, select only the matching scope.

## Review Setup

1. Identify the target: PR, branch vs target ref, staged changes, unstaged tracked changes, untracked/current working tree, commit, range, or pasted diff.
2. Determine the base explicitly. For branches, ask if the target ref is unclear. For staged/unstaged/current-tree/commit/range/pasted-diff reviews, do not infer a base ref.
3. Inspect changed files, file types, stats, and PR title/body when applicable.
4. Include untracked files explicitly; ordinary `git diff` misses them.

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
git diff <TARGET-REF>...HEAD
git show --stat --patch <COMMIT>
git diff --stat <BASE>..<HEAD>
git diff <BASE>..<HEAD>
```

## Review Safety

- Prefer read-only diff and metadata commands when they are enough
- Only switch branches, materialize PRs, or create worktrees when needed to provide an inspectable delegated target, verify a concrete high-impact concern, or satisfy a user request
- In delegated reviews, only the aggregator may switch branches, create worktrees, or run verification commands; delegates remain read-only
- Restore the previous branch and clean up temporary worktrees before finishing unless the user asks to keep them
- If cleanup would disturb local work, stop and ask
- Report any local state left behind and why

## Review Coverage

Prioritize security boundaries, public contracts, state changes, failure paths, data integrity, and other high-impact surfaces. If the target is too large to inspect fully, identify the unreviewed files or risk surfaces and mark the affected scopes **Partial**. Do not present a partial review as complete.

## Review Flow

These files define the scope instructions:

- [Behavior](references/behavior.md)
- [Contract](references/contract.md)
- [Test](references/test.md)
- [Simplicity](references/simplicity.md)
- [Documentation](references/documentation.md)

### Delegated Review

Use delegation when subagent tool is available, you are not already delegated, and more than one scope is selected. Do not load all scope files in the aggregator just to delegate. For trivial diffs (a single file, a few lines, or one obvious scope), prefer linear review even when multiple scopes nominally apply, rather than fanning out a delegate per scope.

1. Ensure delegates can inspect the target and relevant nearby code. If the current checkout or remote inspection is insufficient, the aggregator materializes a dedicated review worktree and passes its path to every delegate.
2. Run one delegate per selected scope in parallel.
3. Give each delegate only its assigned scope, target/base, review root, changed files, change intent, user constraints, and pasted diff if applicable.

   ```text
   You are a delegate reviewer for the code-reviewer skill.
   Run only the `[scope]` scope.

   Review target: [target]
   Base/ref: [base, range, or none]
   Review root: [path containing the target tree, or none when remote inspection is sufficient]
   Changed files: [known list]
   Change intent: [PR title/body or other known intent]
   User constraints: [constraints]

   [pasted diff, only when applicable]

   Use read-only inspection. Do not switch branches, create worktrees, or run tests, builds, linters, type checks, or reproduction commands. Recommend a focused verification command when it would materially confirm or reject a concern.

   Output findings, unresolved review questions, material surfaces you could not inspect, and recommended verification commands. For findings, include severity, confidence, location, why it matters, and recommendation. For questions, include the likely severity if the risk is confirmed and the evidence needed to resolve it. If there are no findings or questions, say none and name the risk surface checked.
   ```

4. Aggregate findings, unresolved review questions, uninspected surfaces, and recommended verification commands. Deduplicate findings by root cause and verify each retained finding against the diff and nearby code. Mark affected scopes partial and include their uninspected surfaces in the final coverage summary. Keep questions only when the uncertainty is evidenced by the diff/context and could change the assessment; carry them into the final `## Questions`, not `## Findings`. Delegates only see their own scope and cannot dedup across scopes, so the "report a cross-scope issue once" rule is enforced here: collapse the same root cause raised by multiple delegates into one finding under its primary scope. Reclassify valid findings into the right selected scope instead of dropping them. Preserve distinct Critical/Important findings and distinct Minor root causes; group related Minor instances when needed.

### Linear Review

When delegation is unavailable, only one scope is selected, or a trivial diff does not justify fan-out, load only the selected scope instruction files and apply them yourself. For each scope, identify the changed risk surface and suspicious locations before deciding whether findings exist.

### Verification

The aggregator in a delegated review, or the reviewer in a linear review, owns verification. Before reporting, verify retained findings against nearby unchanged context such as key callers, tests, schemas, docs, config, migrations, generated sources, or state owners. Run targeted, non-destructive tests, builds, type checks, linters, or reproduction commands when they can materially confirm or reject a concern. Prefer focused commands over broad or expensive suites, and report what ran and any relevant failures.

## Findings Bar

Report findings only with concrete evidence.

For each finding, be able to answer: what could go wrong, under what condition, who is affected, why it matters, what should change, and how confident the evidence is.

Confidence:

- **High** — directly evidenced by the diff and verified nearby context
- **Medium** — plausible and important, but expected behavior or runtime context is partly uncertain

Low-confidence concerns belong in `## Questions`, not `## Findings`. Do not drop potentially severe low-confidence concerns; ask the blocking question and state the likely severity if confirmed.

Prioritize findings by impact, omit low-value observations, and group related Minor findings so they do not obscure higher-severity issues.

## Severity and Assessment

- **Critical**: security issue, data loss, crash, broken production behavior → normally **Request Changes**
- **Important**: likely bug, missing validation/control, serious performance issue, or critical path lacking feasible, reliable regression protection → normally **Request Changes**
- **Minor**: concrete maintainability, test, docs, or edge-case issue with lower immediate risk → normally **Comment**, or **Request Changes** if central, repeated, or compounding
- **Suggestion**: optional improvement with clear upside → normally **Approve** or **Comment**

No findings after all selected scopes have run means **Approve** only when the review is complete. For a partial review, state that no findings were identified in the inspected surface without implying approval.

## Output Template

```markdown
# Code Review: [title]

## Summary

- **Assessment:** [Approve / Request Changes / Comment]
- **Scope:** [target and files reviewed]
- **Main risks:** [short list or "None identified"]
- **Coverage:** [Complete / Partial + material surfaces not inspected]
- **Verification:** [commands run and results, or "Not run" + reason]

## Pass Results

- **Behavior:** [findings / no findings / partial / N.A. + one-line note]
- **Contract:** [findings / no findings / partial / N.A. + one-line note]
- **Test:** [findings / no findings / partial / N.A. + one-line note]
- **Simplicity:** [findings / no findings / partial / N.A. + one-line note]
- **Documentation:** [findings / no findings / partial / N.A. + one-line note]

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
```

List one Pass Results line per selected scope; omit scopes the user excluded. Every selected scope must be represented as findings, no findings, partial, or not applicable. A scope is partial when material surface could not be inspected. A scope is not applicable only when the diff contains no meaningful surface for it.
