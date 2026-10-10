# transcript

Claude Code plugin that produces transcripts from URLs or local video/audio
files. It prefers existing subtitles and uses local MLX Whisper only when no
suitable text subtitles exist.

This plugin is installed separately from the [yt-dlp plugin](../yt-dlp/).
URL inputs use the yt-dlp CLI directly; the yt-dlp plugin is not required.

## Usage

```text
/transcript <url|local-path>
```

For the namespaced plugin command, use `/transcript:transcript`. Natural requests
such as "transcript of this URL" or "transcribe this local file" also trigger it.

## Prerequisites

Install only what your workflow needs:

- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) on `PATH` for URL inputs
  (`brew install yt-dlp` on macOS, `pipx install yt-dlp` elsewhere)
- [`ffmpeg`](https://ffmpeg.org/) and `ffprobe` for embedded subtitles, audio
  selection, or Whisper's media decoding (`brew install ffmpeg`)
- `node` for the subtitle-to-transcript cleanup script
- [`mlx_whisper`](https://github.com/ml-explore/mlx-examples/tree/main/whisper)
  on `PATH` on Apple Silicon macOS for speech recognition fallback
  (`pipx install mlx-whisper`)

The fallback defaults to `mlx-community/whisper-large-v3-turbo`; specify another
MLX-compatible repository or local model directory in your request to override
it. The first use may download model weights; recognition runs locally. The
skill does not install tools automatically.

## Transcript behavior

- URLs: inspect subtitles, prefer uploaded subtitles over original automatic
  captions, and download only the selected track
- Local media: check matching sidecars, then inspect and extract full-length
  embedded text subtitles with ffprobe/FFmpeg
- No suitable text subtitles: use MLX Whisper, downloading media first for URLs
- Errors: stop and report failures rather than treating them as absent subtitles
- Ambiguous, translated, or wrong-language tracks: ask before selecting a track
  or recognizing the original speech

Subtitle selection defaults to English. Recognition uses the known spoken
language, or detects it when unknown; it does not silently translate. Bitmap
subtitles require OCR, and closed captions inside a video stream need special
handling outside this workflow.

## Output folder

Each item uses a fresh directory under `<cwd>/.ai/transcript` unless you specify
another folder. Plain-text results use `transcript.txt`. Original local media
and sidecars are preserved. Downloaded or extracted subtitles are removed after
cleanup unless you ask to retain them; downloaded media used for recognition is
retained.

## What's included

- **`skills/transcript/SKILL.md`** — subtitle-first rules, routing, and cleanup
- **References** — URL acquisition and local extraction/recognition guides
- **`skills/transcript/scripts/strip-transcript.mjs`** — converts VTT/SRT into
  plain text, removing timestamps and tags, with optional rolling-caption deduplication
