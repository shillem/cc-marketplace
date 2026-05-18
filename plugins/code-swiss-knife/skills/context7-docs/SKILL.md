---
name: context7-docs
description: Fetches authoritative, current, version-specific documentation and official code examples via Context7 for a named external library, framework, SDK, CLI, or cloud product. Use when the user needs exact API behavior, setup, configuration, integration, migration, or version-specific guidance rather than general web research or real-world repository patterns.
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

```bash
# Example flow
ctx7 library react "How to clean up useEffect with async operations"
ctx7 docs /facebook/react "How to clean up useEffect with async operations"
```

You MUST call `ctx7 library` first to obtain a valid library ID UNLESS the user explicitly provides one. Valid library IDs use a leading `/`, typically `/org/project` or `/org/project/version`.

## Budget

Do not run these commands more than 3 times per question. If you cannot find what you need after 3 attempts, use the best result you have.

## Safety

Never include sensitive information (API keys, passwords, credentials, personal data, proprietary code) in queries.

## Step 1: Resolve a Library

Resolves a package/product name to a Context7-compatible library ID and returns matching libraries.

Always pass a `query` argument — it is required and directly affects result ranking. Use the user's intent to form the query, which helps disambiguate when multiple libraries share a similar name.

### Selecting a Match

Use **Name** and **Description** to disambiguate similar matches; if multiple plausible results remain, ask for clarification rather than guessing.

### Version-specific IDs

If the user mentions a specific version, use the closest matching version-specific library ID from the `ctx7 library` output.

```bash
# General (latest indexed)
ctx7 docs /vercel/next.js "How to set up app router"

# Version-specific
ctx7 docs /vercel/next.js/v14.3.0-canary.87 "How to set up app router"
```

## Step 2: Query Documentation

Retrieves up-to-date documentation and code examples for the resolved library.

### Writing Good Queries

Use a specific, intent-rich query; prefer the user's full question over vague keywords.

| Quality | Example                                                    |
| ------- | ---------------------------------------------------------- |
| Good    | `"How to set up authentication with JWT in Express.js"`    |
| Bad     | `"auth"`                                                   |
| Good    | `"React useEffect cleanup function with async operations"` |
| Bad     | `"hooks"`                                                  |

### Using the Output

Cite the library ID and version you used so the user can verify.

Treat this skill as the primary source for official behavior, but not as proof of real-world adoption or common practice. If the user asks for both correctness and practical usage, combine documentation evidence with a code search source when available.

## Error Handling

If the exact documentation you need is unavailable or ambiguous, state the limitation clearly and use the closest authoritative result rather than guessing.

If a command fails with a quota error ("Monthly quota reached" or "quota exceeded"):

1. Inform the user their Context7 quota is exhausted
2. Suggest they authenticate for higher limits: `ctx7 login`
3. If they cannot or choose not to authenticate, answer from training knowledge and clearly note it may be outdated
