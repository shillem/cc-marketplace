# PR

Use `gh`.

**Important:** do not pass filesystem paths to `gh` repo selectors.

## Flow

1. Determine the base branch:
   - Use an explicit user target or existing PR base when available
   - Otherwise run `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'`
   - Use `origin/<base-branch>` for git comparisons

2. Inspect the branch before drafting anything:
   - Check status, uncommitted changes, commits since base, and the full diff
   - Stop if on the default branch or if there are no commits ahead of the base
   - Ask before proceeding if there are uncommitted or unrelated changes

3. Check for an existing open PR for the current branch:
   - Use `gh pr list --head "$(git branch --show-current)" --state open --json number,title,url,baseRefName`
   - If one exists, inspect it and refresh it unless the user explicitly wants a new PR
   - When refreshing, rewrite the title and body from the current branch diff; do not append a changelog

4. Draft reviewer-facing title and body:
   - Summarize the overall branch, not a single commit
   - Keep the title under 70 characters. Use plain imperative style unless the repo clearly uses conventional-commit-style PR titles.
   - For the body, follow `.github/pull_request_template.md` convention, otherwise:

     ```markdown
     #### Summary

     - <1-5 bullet points summarizing what changed and why>

     #### Testing

     - <what you ran, or did not run>
     ```

5. Create or refresh the PR:
   - Push with `-u` if the branch has no upstream
   - Use `--draft` when work is incomplete, not review-ready, or the user asks for a draft

   **Create/open with:**

   ```bash
   gh pr create --base "<base-branch>" --title "<title>" --body-file - <<'EOF'
   <body>
   EOF
   ```

   **Refresh with:**

   ```bash
   gh pr edit <number> --title "<title>" --body-file - <<'EOF'
   <body>
   EOF
   ```
