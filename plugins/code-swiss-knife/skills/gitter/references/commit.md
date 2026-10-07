# Commit

Generate and execute a commit for the current git changes using the Conventional Commits format.

## Format

```text
type(scope): description

body

footer
```

- `type`: prefer common types like `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- `scope`: optional
- `description`: short, imperative summary; prefer 70 characters or fewer and no trailing period
- `body`: optional; explain what changed and why
- `footer`: optional; use for breaking changes or issue refs like `Fixes #123` or `Refs #123`

Use `!` before `:` or a `BREAKING CHANGE:` footer for breaking changes. Breaking changes can use any type.

## Examples

```text
feat(parser): add array parsing support
fix(ui): correct button alignment
docs: update README usage examples
chore: update dependencies
feat!: require email service for registration
```

Reference: https://www.conventionalcommits.org/en/v1.0.0/#specification

## Behavior

- Check `git branch --show-current` before committing
- If the current branch is `main` or `master`, ask before committing unless the user explicitly asked for that branch
- If the user specifies files, directories, or a logical change, treat that scope as authoritative: inspect and include relevant tracked and untracked files, and exclude unrelated changes
- Inspect untracked files before staging; do not include secrets, generated artifacts, or scratch files merely because they are within the requested scope
- If an explicitly requested file is excluded for these reasons, explain the exclusion and clarify how to proceed
- If existing staged changes fall outside the requested scope, ask before proceeding; do not silently include unrelated staged changes or unstage them
- Without an explicit scope, commit existing staged changes; if nothing is staged, default to tracked modified or deleted files
- If relevant untracked files are needed to make that default commit complete, ask whether to include them rather than silently omitting them
- Apart from the confirmations required above, ask only when the intended commit is non-obvious, such as unclear staged vs unstaged intent or uncertain scope or breaking-change semantics
- Each commit should represent one stable logical change; if the proposed changes contain unrelated logical changes, ask whether to split them into multiple commits
- Execute the commit when the appropriate message is clear
- Never use `\n` or `\n\n` inside `git commit -m`:
  - Invalid: `git commit -m "subject" -m "body\n\nsecond body"`
  - Valid: `git commit -m "subject" -m "body" -m "second body" -m "footer"`
