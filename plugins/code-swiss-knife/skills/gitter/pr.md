# PR

Use the `gh` command. If the user gives a GitHub URL, inspect it with `gh` rather than guessing from the URL alone.

## Workflow

1.  Determine the PR base ref.
    - Prefer an explicit user-supplied target branch or the base from an existing PR.
    - Otherwise detect the repository default branch with `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'`.
    - Use `origin/<default-branch>` for git comparisons.

2.  Inspect the branch before drafting anything.
    - `git status --short --branch` to see branch state and untracked files
    - `git diff` and `git diff --cached` to review uncommitted changes
    - `git log --oneline $(git merge-base HEAD <base-ref>)..HEAD` to review commits that will land
    - `git diff <base-ref>...HEAD --stat` and `git diff <base-ref>...HEAD` to review the full PR diff

3.  Decide whether to proceed or ask.
    - If the current branch is the default branch, ask the user to create or switch to a feature branch first.
    - If there are no commits ahead of the base ref, stop and say there is nothing to open.
    - If there are uncommitted changes, ask whether they should be committed before creating the PR.
    - If the branch contains multiple unrelated changes, ask whether it should be split or cleaned up first.

4.  Check for an existing PR before creating a new one.
    - Use `gh pr list --head "$(git branch --show-current)" --state open --json number,title,url,baseRefName`.
    - If an open PR already exists, inspect it with `gh pr view <number> --json number,title,body,url,baseRefName,headRefName` and treat the request as a refresh unless the user explicitly wants a different PR.
    - When refreshing, rewrite the title and body from the current diff instead of appending a changelog.

5.  Draft the title and body from the full branch.
    - Base the title on the dominant change across all commits that will land.
    - Keep the title under 70 characters.
    - Prefer a plain imperative title. If the repo clearly uses conventional-commit-style PR titles, match that style.
    - Do not include tool or agent attribution.
    - Write reviewer-facing prose that explains what changed and why.
    - If `<cwd>.github/pull_request_template.md` exists, follow its structure.
    - Otherwise use:

          ```markdown
          #### Summary

          - <1-3 bullet points summarizing what changed and why>

          #### Testing

          - <what you ran, or did not run>
          ```

    - Do not invent testing or issue references.

6.  Create or refresh the PR.
    - Push with `-u` if the branch has no upstream.
    - Use `--draft` when the work is incomplete, the branch is not review-ready, or the user asks for a draft.

### Create example

```bash
gh pr create --base "<base-branch>" --title "<title>" --body-file - <<'EOF'
<body>
EOF
```

### Refresh example

```bash
gh api -X PATCH repos/{owner}/{repo}/pulls/<number> \
  -f title='<title>' \
  --raw-field body="$(cat <<'EOF'
<body>
EOF
)"
```
