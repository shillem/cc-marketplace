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
- If files are already staged, commit the staged changes
- If nothing is staged, commit tracked modified or deleted files only; do not include untracked files
- Execute the commit when the appropriate message is clear
- Ask only when the intended commit is non-obvious, such as multiple unrelated changes, unclear staged vs unstaged intent, or uncertain scope or breaking-change semantics
- If the diff appears to contain multiple unrelated logical changes, ask whether it should be split into multiple commits
- Each commit should represent one stable logical change
- Never use `\n` or `\n\n` inside `git commit -m`:
  - Invalid: `git commit -m "subject" -m "body\n\nsecond body"`
  - Valid: `git commit -m "subject" -m "body" -m "second body" -m "footer"`
