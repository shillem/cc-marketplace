---
name: code-reviewer
description: Review pull requests, diffs, and code changes for concrete behavior, contract, security, test, maintainability, and documentation defects. Use when the user asks for review of a PR, patch, diff, commit, or code change.
compatibility: Requires GitHub CLI for PR reviews
---

Review changes for concrete failures, not style preferences. Default to a broad review unless the user narrows the focus.

## Roles and Modes

The **coordinator** is the main agent: it establishes the target, dispatches investigators when available, verifies candidates, and reports one assessment. An **investigator** is a separately dispatched reviewer; its task assignment takes precedence over coordinator instructions in this skill, even if it loads this file independently. An investigator returns evidence to the coordinator and must not dispatch, synthesize, or issue a final verdict. A **primary investigator** follows [Investigation](references/investigation.md) and its review cues; an **independent investigator** uses its own method and does not read or apply those cues. These are prompt-level role and method boundaries, not filesystem access controls.

Use [Standard Review](references/standard-review.md) for ordinary reviews, including requests for a focused review. Use [Adversarial Review](references/adversarial-review.md) only when the user explicitly asks for adversarial, independent, competing, external, or additional independent review. Read the applicable mode reference before dispatch. Explicit adversarial review requires two separate investigations; never label a single-context review adversarial.

| Focus           | Includes                                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `behavior`      | Correctness, failure handling, state and resource lifecycles, side effects, async work, performance, accessibility, localization, and platform behavior |
| `contract`      | APIs, types, schemas, validation, auth/authz, compatibility, storage, configuration, integrations, and boundary security                                |
| `test`          | Reliable detection of meaningful regressions and test quality                                                                                           |
| `simplicity`    | Concrete maintenance traps caused by complexity, duplication, weak ownership, or stale code                                                             |
| `documentation` | Misleading or missing release-critical docs, comments, examples, migrations, and operator guidance                                                      |

Focuses filter investigation, not delegation units. A broad `security` request includes boundary controls and runtime disclosure.

## Establish the Target

1. Identify the exact target: PR, branch against a target ref, staged changes, unstaged tracked changes, the complete current working tree, commit, range, or pasted diff.
2. Determine the base explicitly. Ask when a branch target is ambiguous; commits, ranges, staged changes, and pasted diffs already define their comparison.
3. Inspect the change intent, changed files, file types, and diff statistics. For PRs, read the title and body without treating them as proof of correctness.
4. Include untracked files when reviewing the working tree; ordinary `git diff` omits them.
5. Ensure nearby code can be read from the target revision. For staged-only reviews, the target is the index, not the checkout: read changed files and relevant callers from the index (`git show :path`, when present) rather than trusting checkout contents that may include unstaged edits. Use `HEAD:path` to inspect staged deletions. If a committed checkout does not represent the target and remote inspection is insufficient, materialize a temporary review worktree pinned to the target before analysis. If checks for a committed target would run in a dirty checkout, use a clean target worktree instead.

Keep the review read-only: do not edit the code being reviewed. Fetching the target ref, creating temporary worktrees to inspect it, and non-destructive verification are the only permitted write-capable operations. The coordinator owns worktree creation, assignment, and cleanup, including after failed investigations. Distinct worktrees can represent a pinned committed PR head; they do not reproduce unstaged or untracked working-tree changes. Check that commands will not interfere through shared caches, services, databases, or the checkout before running them concurrently. Working-tree investigators inspect only; the coordinator runs non-destructive checks serially after they finish. If cleanup would disturb local work, stop and ask. Report any local state intentionally left behind.

```bash
# Pull request
gh pr view <PR> --json title,body,files,commits,baseRefName,headRefName
gh pr diff <PR> --patch

# Working tree
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard

# Branch, commit, or range
git diff <TARGET-REF>...HEAD
git show --stat --patch <COMMIT>
git diff --stat <BASE>..<HEAD>
git diff <BASE>..<HEAD>
```

## Coordinator Responsibilities

Before dispatch, prepare neutral target facts: target and base, pinned revision when available, review root or retrievable patch, changed files, observable change scope, user focus, and constraints. Do not pass suspected defects, severity, or another investigator's findings. Build a top-level change map when splitting the target into coherent clusters; avoid preemptively hunting defects. If the independent capability lacks repository access, provide sufficient patch and surrounding context for meaningful investigation or stop and explain the limitation.

After investigations, audit coverage against the target, especially when the only investigator reports no candidates; redispatch for material gaps. Verify each candidate against complete code paths and relevant callers, tests, schemas, config, docs, migrations, and state owners. Run a focused non-destructive test, type check, build, linter, or reproduction when it can materially confirm or reject a candidate. For staged-only reviews, do not treat a check on a checkout containing unstaged edits as verification of the index; run it against the exact target or disclose the limitation. Deduplicate by root cause, check cross-cluster interactions, and resolve conflicting severities and recommendations. Do not run a third systematic candidate hunt; investigate and report concrete defects found incidentally during verification. The coordinator owns final severity and assessment. In a disclosed single-context review, it instead follows [Investigation](references/investigation.md) itself before verification and reporting.

## Severity and Assessment

- **Critical:** exploitable security issue, data loss, crash, or broken production-critical behavior
- **Important:** likely functional defect, missing boundary control, serious performance issue, or critical regression that can ship undetected
- **Minor:** concrete lower-impact edge case, regression gap, documentation defect, or maintenance trap

Use **Request Changes** for Critical findings and normally for Important findings. Use **Comment** when findings are non-blocking. An unresolved likely-Critical risk requires **Request Changes**; other material unresolved risks require at least **Comment**. Use **Approve** only when the requested review is complete and no findings or material unresolved risks remain.

Report only findings with a concrete failure mode, missing control, regression gap, release risk, or maintenance trap. Each finding must identify the condition, concrete outcome or risk, affected party, supporting evidence, and focused fix. Ask a question only after repository inspection cannot resolve a material uncertainty. Omit optional style preferences and speculative improvements unless requested; put them in a separate `Suggestions` section without affecting the assessment.

## Output

Lead with actionable information. Omit empty optional sections.

```markdown
# Review: [title]

- **Assessment:** [Approve / Request Changes / Comment]
- **Review mode:** [Single-context standard / Delegated standard / Adversarial; name the independent capabilities for adversarial]

[Target, base, scope or focus, and dominant risk or absence of defects.]

## Findings

### 1. [Critical|Important|Minor] · Short title

`path/to/file.ext:line`

- **Scenario:** [condition] creates [wrong result or concrete risk] for [affected party].
- **Evidence:** [code path, caller, test, or verification result].
- **Fix:** [specific correction].

## Unresolved Risks

- **[Likely severity]** [assumption, impact, and what would resolve it]

## Coverage

- **Inspected:** [important files and risk surfaces]
- **Not inspected:** [material surface and reason]

## Checks Run

- `[command]` — [result]
```

When there are no findings, omit `## Findings`. Use **Comment**, not **Approve**, for a partial review with no findings. State a requested focus in the summary. Include `Coverage` for every partial review and when boundaries are otherwise unclear; disclose single-context fallback even with no findings. Include `Checks Run` only when commands ran or an omitted expected check limits the conclusion.
