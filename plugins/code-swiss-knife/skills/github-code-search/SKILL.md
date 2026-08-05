---
name: github-code-search
description: Finds real-world code usage and implementation examples across public GitHub repositories and private repositories accessible to the authenticated user. Use when practical repository patterns are needed rather than official documentation or local code search.
compatibility: Requires GitHub CLI
---

## Flow

Search for concrete identifiers, API names, imports, or other terms likely to appear in code:

```bash
gh search code '<terms>' \
  --language <language> \
  --limit 10 \
  --json repository,path,textMatches,url \
  --jq '.[] | {repo: .repository.nameWithOwner, path, url, fragments: [.textMatches[].fragment]}'
```

Use `--repo owner/repo`, `--owner org`, `--filename`, or `--extension` to narrow results. Add a raw `path:<directory>` qualifier to the query when filtering by directory.

## Query Guidance

Use code terms, not natural-language questions. Prefer a distinctive identifier such as `createContext`, `AbortSignal.any`, or `from "openai"`, then refine with filters if results are noisy.

`gh search code` uses GitHub's legacy code search engine. It does not support regex, punctuation may not be significant, results can differ from GitHub's web search, and only indexed code on default branches is searchable. State the limitation if it materially affects the answer.

## Budget

Do not run more than 3 searches per question. GitHub's code search API is limited to 10 requests per minute.

## Using Results

Treat snippets as leads, not sufficient context for non-trivial conclusions. Open the returned URL or inspect the repository file before relying on surrounding behavior.
