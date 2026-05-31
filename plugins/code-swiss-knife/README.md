# code-swiss-knife

Claude Code plugin that bundles practical development skills. It currently ships
with three skills:

- `code-reviewer` for reviewing diffs, pull requests, and local changes across behavior, contracts, tests, maintainability, and documentation
- `gitter` for commits and pull request workflows
- `context7-docs` for current, version-specific documentation and code examples via Context7

## Included Skills

| Skill           | Purpose                                                                                 | Example request                                                                         |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `code-reviewer` | Focused reviews for behavior, contracts, tests, maintainability, and docs               | `/code-reviewer review staged changes`                                                  |
| `gitter`        | Commit current work and open or refresh pull requests                                   | `/gitter commit`, `/gitter pr`                                                          |
| `context7-docs` | Fetch current, version-specific docs and code examples for external libraries and tools | `/context7-docs react useEffect cleanup`, `/context7-docs nextjs app router middleware` |

## Usage

Use the skill directly with its slash command, or ask Claude Code naturally to
review code, create a commit, or open a pull request.

### `code-reviewer`

Use for PRs, branches, commits, staged changes, unstaged changes, or pasted diffs. By default it looks for real review findings across behavior, contracts, tests, maintainability, and documentation. You can also ask for only the areas you care about. Targeted requests use these aliases:

- `behavior`: correctness, failure/error handling, error paths, state/lifecycle, side effects, performance, and resource use
- `contract`: APIs/public interfaces, types, schemas, validation, permissions, auth/authz, compatibility, storage, config, integrations, boundary security, and security controls
- `test`: testing, tests, coverage, regression protection, and test quality
- `simplicity`: quality, maintainability, complexity, duplication, stale/dead code, and wrong-layer logic
- `documentation`: docs, comments, changelogs, release notes, migrations, examples, and operator notes

A broad `security` request reviews both `contract` and `behavior`: boundary controls stay in `contract`, while runtime disclosures such as secrets in logs, errors, telemetry, or user-visible output stay in `behavior`.

```text
/code-reviewer review the current branch against <target-branch>
/code-reviewer review staged changes
/code-reviewer review PR #123
/code-reviewer review this diff for behavior and test issues
/code-reviewer review this diff with only behavior and contract scopes
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

## Prerequisites

### `code-reviewer`

- `git` for local diff and branch review workflows
- `gh` on `PATH` for GitHub pull request reviews

### `gitter`

- `git`
- `gh` on `PATH` for pull request workflows

### `context7-docs`

- `ctx7` on `PATH`
