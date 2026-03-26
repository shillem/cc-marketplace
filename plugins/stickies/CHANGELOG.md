# Changelog

## 1.0.2 (2026-03-26)

### Improved

- Reworded skill description for better auto-triggering
- Standardized "stickie" spelling to "sticky" throughout
- Broadened `Read` and `Write` allowed-tools scope
- Streamlined skill content structure

## 1.0.1 (2026-03-23)

### Improved

- Explicit instruction to create `.ai/stickies/` folder with `mkdir -p` before writing stickies
- Updated allowed-tools to use `mkdir -p` and `ls -1` flags

## 1.0.0 (2026-03-23)

### Added

- Initial release of the stickies plugin
- Create, list, read, and delete stickies via `/stickies` slash command
- Stickies stored as markdown files in `.ai/stickies/` with date-prefixed filenames
- Natural language trigger on mentions of "sticky" or "stickies"
- Lightweight Haiku model for fast responses
