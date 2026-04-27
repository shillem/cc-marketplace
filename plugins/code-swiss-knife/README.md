# code-swiss-knife

Claude Code plugin with practical development skills for code review and analysis.
It currently ships the `code-reviewer` skill for focused reviews of diffs, pull
requests, and local changes across correctness, security, performance,
maintainability, testing, and documentation. The skill uses a shared review
workflow plus targeted reference files for security, performance, code
quality, and testing.

## Usage

Invoke via slash command:

```
/code-reviewer review the current branch against <target-branch>
/code-reviewer review staged changes
/code-reviewer review PR #123
/code-reviewer review this diff for security and performance issues
```

For local branch reviews, prefer an explicit target branch or ref rather than
assuming `main`.

Or ask Claude Code to review a pull request, diff, or recent changes to trigger
the skill automatically.

## Prerequisites

- `git` for local diff review
- `gh` on `PATH` when reviewing GitHub pull requests

## What's included

- **`skills/code-reviewer/SKILL.md`** — primary review workflow, severity model,
  and concise output template
- **`skills/code-reviewer/security.md`** — targeted prompts for auth, input,
  secrets, files, networking, and data boundaries
- **`skills/code-reviewer/performance.md`** — targeted prompts for scale, I/O,
  memory, and concurrency
- **`skills/code-reviewer/quality.md`** — targeted prompts for maintainability
  and local code quality standards
- **`skills/code-reviewer/testing.md`** — targeted prompts for coverage,
  regressions, failure paths, and test quality
