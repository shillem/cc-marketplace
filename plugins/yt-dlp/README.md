# yt-dlp

Claude Code plugin for downloading videos and audio from YouTube and the 1000+
other sites supported by the [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) CLI.

## Usage

```text
/yt-dlp video <url>
/yt-dlp audio <url>
```

For namespaced plugin commands, use `/yt-dlp:yt-dlp`. Natural requests such as
"download this video" or "rip audio from this URL" also trigger the skill.

Downloads are saved under `<cwd>/.ai/yt-dlp` unless you specify another folder.

**Migration:** `/yt-dlp transcript` is no longer supported. Install the separate
[transcript plugin](../transcript/) and use `/transcript <url|path>` instead.

## Prerequisites

- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) on `PATH`
  (`brew install yt-dlp` on macOS, `pipx install yt-dlp` elsewhere)
- [`ffmpeg`](https://ffmpeg.org/) for audio extraction or video merging
  (`brew install ffmpeg`)

## What's included

- **`skills/yt-dlp/SKILL.md`** — URL video/audio download actions, format selection,
  playlist options, and site access tips
