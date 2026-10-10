---
name: transcript
description: Extract transcripts from URLs or local video/audio files. Use when the user asks for a transcript, subtitles, or to transcribe media.
argument-hint: "<url|path> [...]"
compatibility: URL inputs require yt-dlp; subtitle cleanup requires Node.js; embedded subtitles and recognition require ffmpeg/ffprobe; recognition requires mlx_whisper on Apple Silicon macOS.
---

Treat the input as a URL or local media path; no action keyword is needed. Infer
the input from natural-language requests, or ask if it is missing.

## Transcript rules

Prefer full-length text subtitles. For URLs, prefer uploaded subtitles over
original auto-captions. Use speech recognition only when no suitable subtitles
exist; failed inspection, download, extraction, or cleanup means stop and report
the error, not fall back. Ask when track choice, language, or coverage is unclear,
including when only translated or wrong-language subtitles exist. Do not install
tools without permission.

Default subtitle selection to English unless the user specifies a language.
For recognition, pass the spoken language only when known; otherwise let Whisper
detect it. Transcription does not translate into the requested subtitle language.

## Setup and routing

Save outputs under `<cwd>/.ai/transcript` unless the user specifies another folder.
Create a new directory for each media item; never reuse an existing one. Use its
absolute path as `<run-dir>` in the commands below. Process playlist items and
local files separately.

- **URL:** follow [URL transcripts](references/url.md). If this returns subtitles,
  clean them below. If it returns downloaded media, go directly to
  [Speech recognition](references/local.md#speech-recognition), skipping local
  subtitle inspection.
- **Local path:** follow [Local transcripts](references/local.md) to find subtitles
  or recognize speech.

## Cleanup and output

Run this skill's cleanup script on the selected subtitle:

```bash
node "<skill-dir>/scripts/strip-transcript.mjs" "<subtitle-file>" > "<run-dir>/transcript.txt"
```

Do not use `--in-place`: it deletes the source and derives a different output name.
Add `--dedup` only for rolling auto-captions that repeat text across cues.
Use Whisper's TXT directly without cleanup.

Check command errors and confirm this run produced a transcript containing text.
Report empty results rather than claiming success. After successful subtitle
cleanup, delete only downloaded or extracted subtitles inside `<run-dir>`, unless
the user wants to retain them. Never modify or delete the user's media or sidecars;
retain downloaded media used for recognition.

Show `<run-dir>/transcript.txt`, identify subtitles or speech recognition as its
source, and offer to summarize it. For explicitly requested raw subtitles or
structured output, return that format instead.
