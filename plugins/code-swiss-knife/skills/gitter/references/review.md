# Review

Use `gh` and the GitHub GraphQL API for pending pull request review comments and explicit review submissions.

**Important:** do not pass filesystem paths to `gh` repo selectors.

## Core invariant

Adding review comments and submitting a review are separate operations. Adding comments must leave the review pending; it must not submit, approve, request changes, dismiss, or delete a review.

Only submit when the user explicitly asks to submit, approve, request changes, or publish the review in the current request. If the user says the review should remain in progress, such as "keep pending" or "still reviewing," do not submit.

Do not use these commands or fields while only adding comments:

- GraphQL `submitPullRequestReview`
- REST review creation with an `event` field
- `gh pr review` in any form
- Review dismissal or deletion endpoints

## Flow

1. Identify the PR and repository. Use an explicit PR number or URL when provided; otherwise use the current branch's PR:

   ```bash
   repo_full=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
   owner=${repo_full%/*}
   repo=${repo_full#*/}
   pr=$(gh pr view --json number --jq .number)
   ```

   Stop if no PR can be identified.

2. Confirm the target lines are reviewable:
   - Inspect the consolidated PR diff with `gh pr diff "$pr"`
   - Comment only on lines present in the PR diff
   - Use `side: RIGHT` for added/current lines, `side: LEFT` only for removed/base lines
   - For multi-line comments, use `startLine`, `line`, `startSide`, and `side`

3. Find an existing pending review by the current viewer. REST listing is simpler here; `.node_id` is the GraphQL ID used by later mutations:

   ```bash
   viewer=$(gh api user --jq .login)
   review_id=$(gh api repos/"$owner"/"$repo"/pulls/"$pr"/reviews --paginate \
     --jq '.[] | select(.state == "PENDING" and .user.login == "'"$viewer"'") | .node_id' | head -n1)
   ```

4. If no pending review exists, create one without an `event`:

   ```bash
   pr_node_id=$(gh api graphql \
     -f query='query($owner:String!,$repo:String!,$pr:Int!){ repository(owner:$owner,name:$repo){ pullRequest(number:$pr){ id } } }' \
     -f owner="$owner" \
     -f repo="$repo" \
     -F pr="$pr" \
     --jq '.data.repository.pullRequest.id')

   review_id=$(gh api graphql \
     -f query='mutation($prId:ID!){ addPullRequestReview(input:{pullRequestId:$prId}){ pullRequestReview { id } } }' \
     -f prId="$pr_node_id" \
     --jq '.data.addPullRequestReview.pullRequestReview.id')
   ```

   GitHub allows only one pending review per user per PR. If creation fails because one already exists, retrieve it with step 3 and continue.

5. Add inline comments with `addPullRequestReviewThread`:

   ```bash
   comment_id=$(gh api graphql \
     -f query='mutation($reviewId:ID!,$path:String!,$line:Int!,$side:DiffSide!,$body:String!){ addPullRequestReviewThread(input:{pullRequestReviewId:$reviewId,path:$path,line:$line,side:$side,body:$body}){ thread { id comments(first:1){ nodes { id } } } } }' \
     -f reviewId="$review_id" \
     -f path='path/to/file.ts' \
     -F line=123 \
     -f side=RIGHT \
     -F body=@- \
     --jq '.data.addPullRequestReviewThread.thread.comments.nodes[0].id' <<'REVIEW_BODY_EOF'
   Arbitrary markdown with `backticks`, "quotes", backslashes like \n, and multiple lines.
   REVIEW_BODY_EOF
   )
   ```

   Write free-text Markdown bodies with a quoted heredoc. Use `-F` when values need interpretation, including integers and `@-` stdin reads; use `-f` for literal strings.

6. Stop after comments are added unless the core invariant allows submission. Report the comment count and file:line locations. Mention that pending review comments are not visible to others until submitted.

## Edit or remove a pending comment

Only edit or delete review comments when the user explicitly asks. First identify the PR and pending review as in Flow steps 1 and 3. Prefer changing only comments in the current viewer's pending review.

If the comment ID is not already known, list comments on the pending review:

```bash
gh api graphql \
  -f query='query($reviewId:ID!){ node(id:$reviewId){ ... on PullRequestReview { comments(first:100){ nodes { id path line body } } } } }' \
  -f reviewId="$review_id" \
  --jq '.data.node.comments.nodes[] | {id,path,line,body}'
```

Edit a pending comment:

```bash
gh api graphql \
  -f query='mutation($commentId:ID!,$body:String!){ updatePullRequestReviewComment(input:{pullRequestReviewCommentId:$commentId,body:$body}){ pullRequestReviewComment { id } } }' \
  -f commentId="$comment_id" \
  -F body=@- <<'REVIEW_BODY_EOF'
Updated review comment body.
REVIEW_BODY_EOF
```

Delete a pending comment:

```bash
gh api graphql \
  -f query='mutation($commentId:ID!){ deletePullRequestReviewComment(input:{id:$commentId}){ pullRequestReviewComment { id } } }' \
  -f commentId="$comment_id"
```

## Submit a review

Submit only when the core invariant allows it. First identify the PR and pending review as in Flow steps 1 and 3. If no pending review exists, create one as in Flow step 4 before submitting. If the requested event is not explicit, ask for one of `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`. Never infer the event from a prior code-review verdict.

```bash
event='<APPROVE|REQUEST_CHANGES|COMMENT>'

gh api graphql \
  -f query='mutation($reviewId:ID!,$event:PullRequestReviewEvent!,$body:String){ submitPullRequestReview(input:{pullRequestReviewId:$reviewId,event:$event,body:$body}){ pullRequestReview { id state } } }' \
  -f reviewId="$review_id" \
  -f event="$event" \
  -F body=@- <<'REVIEW_SUMMARY_EOF'
Review summary.
REVIEW_SUMMARY_EOF
```

Submission is not safely reversible. If a review was submitted accidentally, do not dismiss it automatically; explain the state and ask the user how to proceed.
