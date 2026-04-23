# Changelog

## 1.0.0 (2026-04-23)

### Added

- Initial release of the yt-dlp plugin
- `/yt-dlp` skill with `video`, `audio`, and `transcript` actions
- Natural language trigger on mentions of `yt-dlp`, downloading a video,
  ripping audio, or extracting a transcript
- `scripts/strip-transcript.mjs` to convert `.vtt`/`.srt` subtitle files into a
  clean plain-text transcript (timestamp-, cue-index-, and tag-stripped, with
  dedup for YouTube auto-caption rolling repetition)
