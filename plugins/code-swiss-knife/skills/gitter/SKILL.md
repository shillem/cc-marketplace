---
name: gitter
description: Create commits and pull requests for current git work. Use when the user wants to commit changes, open or refresh a pull request.
argument-hint: "[commit|pr] [...]"
compatibility: Requires GitHub CLI
---

1. Treat the first word passed by the user as `$ACTION`, remainder as `$REST`.
2. If `$ACTION` matches one of the actions, follow its instructions.
3. If `$ACTION` is empty or does not match an action, choose the action from user intent when clear. Otherwise list the available actions.

## Actions

- [commit](references/commit.md): stage and commit changes
- [pr](references/pr.md): open or refresh a pull request
