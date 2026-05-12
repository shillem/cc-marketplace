# Changelog

## Unreleased

### Changed

- `code-reviewer` now prefers read-only pull request inspection before any local checkout or worktree use
- `code-reviewer` now documents cleanup expectations for temporary worktrees and branch switches
- `code-reviewer` now includes lightweight review lenses for error handling, comments and docs, and type or API design

### Added

- `skills/code-reviewer/error-handling.md` for silent failure, fallback, retry, and cleanup review prompts
- `code-reviewer` review metadata for reporting review mode and any local state left behind

## 1.0.0 (2026-04-28)

### Added

- Initial release of the code-swiss-knife plugin
- `code-reviewer` skill for focused code and pull request reviews
- Supporting quality, security, performance, and testing review reference files
- `gitter` skill for conventional commits and pull request workflows
- `context7-docs` skill for current, version-specific documentation and code examples via Context7
- Pull request action with branch inspection, PR title and body drafting, and `gh`-based create or refresh guidance
- Natural language trigger for requests to review code, pull requests, or diffs
