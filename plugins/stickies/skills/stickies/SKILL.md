---
name: stickies
description: Manage stickies as markdown files — create new, read, list, or delete. Use when the user mentions "sticky", "stickies", or wants to take a quick note or save a reminder.
argument-hint: "[new|read|delete|list] [...]"
---

1. Treat the first word passed by the user as `$ACTION`.
2. If `$ACTION` matches one of the actions, follow the action's instructions.
3. If `$ACTION` is empty or does not match an action, list the available actions.

**Important**: stickies live in `<cwd>/.ai/stickies` (current working directory).

## Actions

### New

Create a new sticky from information the user provides or from your current context.

1. Derive the title from what the user says (keep it short and descriptive)
2. Convert the title to snake-case for the filename, prepend today's date
3. Write the `.md` file in the stickies folder

### Read

Read a sticky so the user can review or work with its content.

1. If the user gives a title (or partial match), find the matching file
2. If multiple stickies match, list the matches and ask which one
3. If there are no matching stickies, say so and stop.
4. Read the file and display its content

### Delete

Remove a sticky the user no longer needs.

1. Match the sticky by title (same as Read)
2. If multiple stickies match, list the matches and ask which one
3. If there are no matching stickies, say so and stop.
4. Delete the file, and do not ask for confirmation

### List

Show all stickies as a table sorted by date (newest first).

1. List the `.md` files in the stickies folder
2. If there are no stickies, say so and stop.
3. Parse each filename to extract the date and title (convert snake-case back to sentence case, e.g., `fix-login-redirect` → `Fix login redirect`)
4. Present as a markdown table:

```markdown
| Date       | Title              |
| ---------- | ------------------ |
| 2026-03-22 | Fix login redirect |
| 2026-03-20 | API rate limits    |
```

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
