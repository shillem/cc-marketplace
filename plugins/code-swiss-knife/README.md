# code-swiss-knife

Claude Code plugin that bundles practical development skills. It currently ships
with four skills:

- `code-reviewer` for reviewing diffs, pull requests, and local changes across behavior, contracts, tests, maintainability, and documentation
- `gitter` for commits and pull request workflows
- `context7-docs` for current, version-specific documentation and code examples via Context7
- `github-code-search` for real-world usage and implementation examples across GitHub code

## Included Skills

| Skill                | Purpose                                                                                 | Example request                                                                         |
| -------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `code-reviewer`      | Focused reviews for behavior, contracts, tests, maintainability, and docs               | `/code-reviewer review staged changes`                                                  |
| `gitter`             | Commit current work and open or refresh pull requests                                   | `/gitter commit`, `/gitter pr`                                                          |
| `context7-docs`      | Fetch current, version-specific docs and code examples for external libraries and tools | `/context7-docs react useEffect cleanup`, `/context7-docs nextjs app router middleware` |
| `github-code-search` | Find practical usage and implementation examples across GitHub code                     | `/github-code-search AbortSignal.any TypeScript`                                        |

## Usage

Use the skill directly with its slash command, or ask Claude Code naturally to
review code, create a commit, open a pull request, or find real-world code examples.

### `code-reviewer`

Use for PRs, branches, commits, staged changes, unstaged changes, or pasted diffs. By default it looks for real review findings across behavior, contracts, tests, maintainability, and documentation. You can also ask for only the areas you care about. Targeted requests use these focuses:

- `behavior`: correctness, failure handling, state and resource lifecycles, side effects, async work, performance, accessibility, localization, and platform behavior
- `contract`: APIs, types, schemas, validation, auth/authz, compatibility, storage, configuration, integrations, and boundary security
- `test`: reliable detection of meaningful regressions and test quality
- `simplicity`: concrete maintenance traps caused by complexity, duplication, weak ownership, or stale code
- `documentation`: misleading or missing release-critical docs, comments, examples, migrations, and operator guidance

A broad `security` request reviews both boundary controls and runtime disclosures such as secrets in logs, errors, telemetry, or user-visible output. Review focuses filter what the reviewer investigates; they do not split the review into isolated passes. The reviewer first maps the complete change, hunts for concrete failure scenarios, and then tries to disprove each candidate before reporting it. Standard reviews prefer a fresh investigator when available and use coherent file or subsystem clusters for larger changes; single-context fallback is disclosed. Adversarial reviews require an explicitly identified independent reviewer capability, run blind investigations in separate contexts, and synthesize verified candidates into one report.

```text
/code-reviewer review the current branch against <target-branch>
/code-reviewer review staged changes
/code-reviewer review PR #123
/code-reviewer review this diff for behavior and test issues
/code-reviewer review this diff with only behavior and contract focuses
/code-reviewer run an adversarial review of the current branch against <target-branch> using <independent-review-capability>
```

For branch reviews, prefer an explicit target branch or ref instead of assuming
`main`. PR reviews require `gh`.

### `gitter`

Use for commit and PR workflows. PR creation inspects the branch against its base,
refreshes an existing open PR for the branch when present, and drafts
reviewer-facing titles and concise Summary/Changes bodies from the full branch
diff.

```text
/gitter commit
/gitter pr
```

### `context7-docs`

Use for authoritative, up-to-date API, setup, configuration, integration, and migration docs.

```text
/context7-docs react useEffect cleanup with async operations
/context7-docs nextjs app router middleware setup
```

### `github-code-search`

Use for practical API usage, library integration, and implementation examples in public or accessible private GitHub repositories.

```text
/github-code-search AbortSignal.any TypeScript
/github-code-search createContext in facebook/react
```

## Prerequisites

### `code-reviewer`

- `git` for local diff and branch review workflows
- `gh` on `PATH` for GitHub pull request reviews

### `gitter`

- `git`
- `gh` on `PATH` for pull request workflows

### `context7-docs`

- `ctx7` on `PATH`

### `github-code-search`

- Authenticated `gh` on `PATH`
