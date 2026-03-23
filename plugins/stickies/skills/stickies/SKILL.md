---
name: stickies
description: Manage local project stickies as markdown files — new, read, list, or delete. Trigger on any mention of "sticky" or "stickies".
argument-hint: "[new|list|read|delete] [text]"
allowed-tools: Bash(mkdir .ai/stickies), Bash(ls *.ai/stickies/**), Bash(rm .ai/stickies/**), Glob, Read(.ai/stickies/**), Write(.ai/stickies/**)
model: haiku
---

# Stickies

Manage markdown stickies stored locally in the project under `.ai/stickies/`.

## Stickie format

Each stickie is a standalone `.md` file. The filename encodes the date and title:

```
YYYY-MM-DD-title-in-snake-case.md
```

**Example:** a stickie titled "Fix login redirect" taken on 2026-03-22 becomes `2026-03-22-fix-login-redirect.md`.

The content of the stickie starts with a single `#` heading matching the title in its original casing, followed by a horizontal rule (`---`), then the body. No other `#` heading is allowed in the stickie — use `##` or lower for subsections.

**Example:**

```markdown
# Fix Login Redirect

---

The redirect after login was pointing to `/home` instead of `/dashboard`...
```

## Operations

### New

Create a new stickie from information the user provides or from your current context.

1. Derive the title from what the user says (keep it short and descriptive)
2. Convert the title to snake-case for the filename, prepend today's date
3. Write the `.md` file to `.ai/stickies/` using the Write tool, and do not ask for confirmation

### Read

Open a stickie so the user can review or work with its content.

1. If the user gives a title (or partial match), find the matching file via Glob
2. If multiple stickies match, list the matches and ask which one
3. Read the file and display its content

### List

Show all stickies as a table sorted by date (newest first).

1. List the `.ai/stickies/` directory using Bash (`ls .ai/stickies/*.md`)
2. Parse each filename to extract the date and title (convert snake-case back to sentence case, e.g., `fix-login-redirect` → `Fix login redirect`)
3. Present as a markdown table:

```markdown
| Date       | Title              |
| ---------- | ------------------ |
| 2026-03-22 | Fix login redirect |
| 2026-03-20 | API rate limits    |
```

If there are no stickies, say so.

### Delete

Remove a stickie the user no longer needs.

1. Match the stickie by title (same as Read)
2. If multiple stickies match, list the matches and ask which one
3. Delete the file, and do not ask for confirmation
