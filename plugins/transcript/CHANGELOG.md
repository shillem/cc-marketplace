# Changelog

## 1.0.0 (2026-10-10)

### Added

- Standalone `transcript` plugin with `/transcript <url|path>`
- URL subtitle extraction, moved from the yt-dlp plugin, with uploaded subtitles
  preferred over original automatic captions
- Local transcript extraction from sidecars and embedded text subtitles
- MLX Whisper fallback when no suitable subtitles exist, with an explicit,
  overridable `mlx-community/whisper-large-v3-turbo` model default
- Separate URL acquisition and local extraction/recognition reference guides
- VTT/SRT cleanup script moved from the yt-dlp plugin, with opt-in `--dedup`,
  cue parsing that preserves numeric dialogue and space-only caption lines, and
  removal of subtitle alignment codes
- Fresh output directories under `.ai/transcript`, output verification, and
  subtitle-first rules that distinguish absent tracks from failures
