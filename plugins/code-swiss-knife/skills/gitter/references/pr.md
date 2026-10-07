# PR

Use `gh`.

**Important:** do not pass filesystem paths to `gh` repo selectors.

## Flow

1. Determine the base branch:
   - Use an explicit user target or existing PR base when available
   - Otherwise run `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'`
   - Use `origin/<base-branch>` for git comparisons

2. Inspect the branch before drafting anything:
   - Run `git status --short --branch` to see branch state and untracked files
   - Run `git diff` and `git diff --cached` to review uncommitted changes
   - Run `git log --oneline $(git merge-base HEAD origin/<base-branch>)..HEAD` to review commits that will land
   - Run `git diff origin/<base-branch>...HEAD --stat` and `git diff origin/<base-branch>...HEAD` to review the full PR diff
   - Stop if on the default branch or if there are no commits ahead of the base
   - Ask before proceeding if there are uncommitted or unrelated changes

3. Check for an existing open PR for the current branch:
   - Run `gh pr list --head "$(git branch --show-current)" --state open --json number,title,url,baseRefName`
   - If one exists, inspect it and refresh it unless the user explicitly wants a new PR
   - When refreshing, rewrite the title and body from the current branch diff; do not append a changelog

4. Draft reviewer-facing title and body:
   - Summarize the overall branch, not a single commit
   - **Title:** under 70 characters. Use plain imperative style.
   - **Body:** write so a reviewer understands why the change exists, what it changes, and how the main pieces fit together before opening the diff. Explain ideas, not individual edits, and group them by behavior or responsibility rather than by file. Let the complexity of the change set the length, and make each point once.

     When an idea is hard to follow in prose, show it in the smallest form that works, such as a before/after snippet, call flow, or diagram. Place it next to the explanation it supports.

     Follow `.github/pull_request_template.md` when present, filling its sections with this kind of explanation. Otherwise use:

     ```markdown
     ## Summary

     <explain the problem and what this PR does about it>

     ## How it works

     <explain the approach, why the main changes take this shape, and how they interact. For a large diff, identify where to start reading and which parts are mechanical. Use short paragraphs for connected explanations and bullets for independent points. Omit this section when the summary already explains the change>
     ```

     Do not add testing or verification sections unless the repository template requires them or the user explicitly asks for them

5. Create or refresh the PR:
   - Push with `-u` if the branch has no upstream
   - Do not force push without explicit user authorization; ask first if it has not been given. Creating or refreshing a PR does not authorize a force push. When authorized, use `--force-with-lease`, not `--force`.
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
