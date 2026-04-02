---
name: stickies
description: Manage local project stickies as markdown files — create new, read, list, or delete. Use when the user mentions "sticky", "stickies", or wants to take a quick note or save a reminder.
argument-hint: "[new|list|read|delete] [text]"
allowed-tools: Bash(mkdir), Bash(ls), Bash(rm), Glob, Read, Write
model: haiku
---

Parse `$ARGUMENTS`:

1. Split arguments: first word is `$ACTION`, remainder is `$REST`
2. If `$ACTION` matches one of the actions, follow the action's instructions
3. If `$ACTION` is empty or does not match an action — list the available actions and suggest running `/stickies list` to see current state

## Actions

**Important**: if the folder doesn't exist, create it by executing `mkdir -p .ai/stickies`.

### New

Create a new sticky from information the user provides or from your current context.

1. Derive the title from what the user says (keep it short and descriptive)
2. Convert the title to snake-case for the filename, prepend today's date
3. Write the `.md` file to `.ai/stickies/` using the Write tool, and do not ask for confirmation

### Read

Open a sticky so the user can review or work with its content.

1. If the user gives a title (or partial match), find the matching file via Glob
2. If multiple stickies match, list the matches and ask which one
3. Read the file and display its content

**Important**: if there are no matched stickies, say so.

### List

Show all stickies as a table sorted by date (newest first).

1. List the `.ai/stickies/` directory by executing `ls -1 .ai/stickies/*.md`
2. Parse each filename to extract the date and title (convert snake-case back to sentence case, e.g., `fix-login-redirect` → `Fix login redirect`)
3. Present as a markdown table:

```markdown
| Date       | Title              |
| ---------- | ------------------ |
| 2026-03-22 | Fix login redirect |
| 2026-03-20 | API rate limits    |
```

**Important**: if there are no stickies, say so.

### Delete

Remove a sticky the user no longer needs.

1. Match the sticky by title (same as Read)
2. If multiple stickies match, list the matches and ask which one
3. Delete the file, and do not ask for confirmation

**Important**: if there are no matched stickies, say so.

## Stickie format

Each sticky is a standalone `.md` file. The filename encodes the date and title with syntax `YYYY-MM-DD-title-in-snake-case.md`.

**Example:** a sticky titled "Fix login redirect" taken on 2026-03-22 becomes `2026-03-22-fix-login-redirect.md`.

Prefix the sticky with this frontmatter:

```markdown
---
title: <title>
description: <100-character-max-description>
---
```

**Example:**

```markdown
---
title: Fix Login Redirect
description: Thoughts on how to fix the login redirect
---

The redirect after login was pointing to `/home` instead of `/dashboard`...
```
