# Changelog

## 2.0.0 (2026-10-10)

### Breaking changes

- Move transcript extraction and its cleanup script into the standalone
  `transcript` plugin; `yt-dlp` now supports only URL video/audio downloads
- Replace `/yt-dlp transcript <input>` with `/transcript <input>` after installing
  the new plugin; transcript outputs now use `.ai/transcript`

### Changed

- Infer video/audio actions from natural-language requests
- Clarified ffmpeg requirements, quoted command paths and URLs, and simplified
  access-problem guidance

## 1.0.1 (2026-05-12)

### Changed

- Tightened skill formatting by removing redundant sentence-ending punctuation from usage bullet lists

## 1.0.0 (2026-04-23)

### Added

- Initial release of the yt-dlp plugin
- `/yt-dlp` skill with `video`, `audio`, and `transcript` actions
- Natural language trigger on mentions of `yt-dlp`, downloading a video,
  ripping audio, or extracting a transcript
- `scripts/strip-transcript.mjs` to convert `.vtt`/`.srt` subtitle files into a
  clean plain-text transcript (timestamp-, cue-index-, and tag-stripped, with
  dedup for YouTube auto-caption rolling repetition)
