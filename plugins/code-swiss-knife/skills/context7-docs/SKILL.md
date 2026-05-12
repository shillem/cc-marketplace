---
name: context7-docs
description: Fetches current, version-specific documentation and code examples via Context7 for a named external library, framework, SDK, CLI, or cloud product. Use when the answer requires authoritative, up-to-date API, setup, configuration, integration, or migration details rather than general knowledge.
compatibility: Requires ctx7 CLI
---

## Workflow

Two-step process: resolve the library name to an ID, then query docs with that ID.

```bash
# Step 1: Resolve library ID
ctx7 library <name> <query>

# Step 2: Query documentation
ctx7 docs <libraryId> <query>
```

You MUST call `ctx7 library` first to obtain a valid library ID UNLESS the user explicitly provides a library ID in the format `/org/project` or `/org/project/version`. Library IDs require a `/` prefix.

## Budget

Do not run these commands more than 3 times per question. If you cannot find what you need after 3 attempts, use the best result you have.

## Safety

Never include sensitive information (API keys, passwords, credentials, personal data, proprietary code) in queries.

## Step 1: Resolve a Library

Resolves a package/product name to a Context7-compatible library ID and returns matching libraries.

```bash
ctx7 library react "How to clean up useEffect with async operations"
ctx7 library nextjs "How to set up app router with middleware"
ctx7 library prisma "How to define one-to-many relations with cascade delete"
```

Always pass a `query` argument — it is required and directly affects result ranking. Use the user's intent to form the query, which helps disambiguate when multiple libraries share a similar name.

### Result Fields

Each result includes:

- **Library ID** — Context7-compatible identifier (format: `/org/project`)
- **Name** — Library or package name
- **Description** — Short summary
- **Code Snippets** — Number of available code examples
- **Source Reputation** — Authority indicator (High, Medium, Low, or Unknown)
- **Benchmark Score** — Quality indicator (100 is the highest score)
- **Versions** — List of versions if available, in `/org/project/version` format

### Selecting a Match

Prefer exact name matches, then higher Code Snippet counts and Source Reputation. If no good match exists, state that and suggest query refinements. For ambiguous queries, ask for clarification before guessing.

### Version-specific IDs

If the user mentions a specific version, use the closest matching version-specific library ID from the `ctx7 library` output:

```bash
# General (latest indexed)
ctx7 docs /vercel/next.js "How to set up app router"

# Version-specific
ctx7 docs /vercel/next.js/v14.3.0-canary.87 "How to set up app router"
```

## Step 2: Query Documentation

Retrieves up-to-date documentation and code examples for the resolved library.

```bash
ctx7 docs /facebook/react "How to clean up useEffect with async operations"
ctx7 docs /vercel/next.js "How to add authentication middleware to app router"
ctx7 docs /prisma/prisma "How to define one-to-many relations with cascade delete"
```

### Writing Good Queries

The query directly affects the quality of results. Be specific and include relevant details. Use the user's full question as the query when possible; vague one-word queries return generic results.

| Quality | Example                                                    |
| ------- | ---------------------------------------------------------- |
| Good    | `"How to set up authentication with JWT in Express.js"`    |
| Bad     | `"auth"`                                                   |
| Good    | `"React useEffect cleanup function with async operations"` |
| Bad     | `"hooks"`                                                  |

### Using the Output

Results contain **code snippets** (titled, with language-tagged blocks) and **info snippets** (prose explanations with breadcrumb context). Prefer adapting code snippets directly into your answer over paraphrasing from memory, and cite the library and version you pulled from so the user can verify.

## Error Handling

If a command fails with a quota error ("Monthly quota reached" or "quota exceeded"):

1. Inform the user their Context7 quota is exhausted
2. Suggest they authenticate for higher limits: `ctx7 login`
3. If they cannot or choose not to authenticate, answer from training knowledge and clearly note it may be outdated
