# yt-dlp

Claude Code plugin that wraps the [`yt-dlp`](https://github.com/yt-dlp/yt-dlp)
CLI for downloading videos, audio, and transcripts from YouTube and the
1000+ other sites yt-dlp supports.

## Usage

Invoke via slash command:

```
/yt-dlp video <url>
/yt-dlp audio <url>
/yt-dlp transcript <url>
```

Or mention `yt-dlp`, "download a video", "rip audio", or "transcript of <url>"
in conversation to trigger the skill automatically.

## Prerequisites

- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) on `PATH`
  (`brew install yt-dlp` on macOS, `pipx install yt-dlp` elsewhere)
- [`ffmpeg`](https://ffmpeg.org/) for audio extraction or remuxing
  (`brew install ffmpeg`)
- `node` for the transcript-cleanup script

## What's included

- **Skill** — guidance for picking format flags, language codes, and
  fall-back rules between manual and auto-generated subtitles
- **`scripts/strip-transcript.mjs`** — converts a `.vtt` or `.srt` subtitle file
  into a clean plain-text transcript; removes cue indices, timestamps,
  inline timing tags, and dedupes the rolling repetition pattern in
  YouTube auto-captions
