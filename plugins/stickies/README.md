# Stickies

Manage stickies as markdown files. Create, list, read, and delete stickies stored in `.ai/stickies/`.

## Usage

Invoke via slash command:

```
/stickies new <description>
/stickies list
/stickies read <title>
/stickies delete <title>
```

Or mention "sticky" / "stickies" in conversation to trigger the skill automatically.

## Sticky format

Each sticky is saved as a `.md` file in `.ai/stickies/` with the naming convention:

```
YYYY-MM-DD-title-in-snake-case.md
```
