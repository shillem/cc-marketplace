# code-swiss-knife

Claude Code plugin that bundles practical development skills. It currently ships
with three skills:

- `code-reviewer` for reviewing diffs, pull requests, and local changes
- `gitter` for commits and pull request workflows
- `context7-docs` for current, version-specific documentation and code examples via Context7

## Included Skills

| Skill           | Purpose                                                                                    | Typical commands                                                                        |
| --------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `code-reviewer` | Focused review across correctness, security, performance, maintainability, tests, and docs | `/code-reviewer review staged changes`                                                  |
| `gitter`        | Commit current work and open or refresh pull requests                                      | `/gitter commit`, `/gitter pr`                                                          |
| `context7-docs` | Fetch current, version-specific docs and code examples for external libraries and tools    | `/context7-docs react useEffect cleanup`, `/context7-docs nextjs app router middleware` |

## Usage

Use the skill directly with its slash command, or ask Claude Code naturally to
review code, create a commit, or open a pull request.

### `code-reviewer`

Use for PRs, branches, commits, staged changes, or unstaged changes.

```text
/code-reviewer review the current branch against <target-branch>
/code-reviewer review staged changes
/code-reviewer review PR #123
/code-reviewer review this diff for security and performance issues
```

For branch reviews, prefer an explicit target branch or ref instead of assuming
`main`.

### `gitter`

Use for commit and PR workflows.

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

## Skill Layout

### `skills/code-reviewer/`

- `SKILL.md` — main review workflow and output format
- `security.md` — security review prompts
- `performance.md` — performance review prompts
- `quality.md` — maintainability and code quality prompts
- `testing.md` — testing and regression review prompts

### `skills/gitter/`

- `SKILL.md` — action router for git workflows
- `commit.md` — commit workflow
- `pr.md` — pull request workflow

### `skills/context7-docs/`

- `SKILL.md` — Context7 workflow for resolving library IDs and querying current docs
