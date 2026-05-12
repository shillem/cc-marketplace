# Changelog

## 1.1.0 (2026-05-12)

### Changed

- `code-reviewer` now defaults to read-only pull request inspection before any local checkout or worktree use
- `code-reviewer` now reports review mode and any intentionally preserved local state in the review output
- `code-reviewer` guidance was tightened to reduce redundancy and keep the main workflow focused
- `gitter` and `context7-docs` skill docs were tidied for consistency

### Added

- `skills/code-reviewer/error-handling.md` for silent failure, fallback, retry, and cleanup review prompts

## 1.0.0 (2026-04-28)

### Added

- Initial release of the code-swiss-knife plugin
- `code-reviewer` skill for focused code and pull request reviews
- Supporting quality, security, performance, and testing review reference files
- `gitter` skill for conventional commits and pull request workflows
- `context7-docs` skill for current, version-specific documentation and code examples via Context7
- Pull request action with branch inspection, PR title and body drafting, and `gh`-based create or refresh guidance
- Natural language trigger for requests to review code, pull requests, or diffs
