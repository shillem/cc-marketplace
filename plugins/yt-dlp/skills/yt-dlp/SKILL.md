---
name: yt-dlp
description: Download videos, audio, and transcripts from YouTube and 1000+ sites with yt-dlp. Use when the user mentions "yt-dlp", "youtube-dl", wants to download a video, rip audio from a video, or extract a transcript from a URL.
argument-hint: "[video|audio|transcript] <url> [...]"
---

1. Treat the first word passed by the user as `$ACTION`, remainder as `$URL`.
2. If `$ACTION` matches one of the actions, follow the action's instructions.
3. If `$ACTION` is empty or does not match an action, list the available actions.

**Important**: downloads are saved to `<cwd>/.ai/yt-dlp` (current working directory) unless the user specifies another path.

## Available Scripts

- **`scripts/strip-transcript.mjs`** — Transcript utility

## Actions

### Video

Download a video at the best available quality.

```bash
yt-dlp --restrict-filenames -P <yt-dlp-download-folder> -o "%(title)s.%(ext)s" <url>
```

**Common variants:**

- Specific resolution cap (best ≤ 1080p, merged into mp4):
  ```bash
  yt-dlp --restrict-filenames -P <yt-dlp-download-folder> -o "%(title)s.%(ext)s" \
    -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 <url>
  ```
- A specific format from the format list — first inspect with `yt-dlp -F <url>`,
  then pick by id: `yt-dlp -f 137+140 <url>`.
- Whole playlist: pass the playlist URL as-is. To limit, add `--playlist-items 1-5`.
- Resume / skip already-downloaded: `--continue --no-overwrites` (default behavior is fine for most cases).

### Audio

Extract audio only — strips the video stream.

```bash
yt-dlp -x --audio-format mp3 --audio-quality 0 --restrict-filenames -P <yt-dlp-download-folder> -o "%(title)s.%(ext)s" <url>
```

- `--audio-format` accepts `mp3`, `m4a`, `opus`, `flac`, `wav`, `aac`, `vorbis`.
- `--audio-quality 0` means best VBR; use `192K` for a fixed bitrate.
- Embed cover art and metadata: add `--embed-thumbnail --add-metadata`.
- For a playlist as an album, add `-o "%(playlist_title)s/%(playlist_index)02d - %(title)s.%(ext)s"`.

### Transcript

Download subtitles for a video and produce a clean plain-text transcript.
Default to English unless the user specifies a language.

1. Download subs directly into `<yt-dlp-download-folder>` with `--restrict-filenames` so the
   sub file has a safe basename we can reuse for the transcript:

   ```bash
   yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs "en" --sub-format "vtt/srt/best" --restrict-filenames -P <yt-dlp-download-folder> -o "%(title)s.%(ext)s" <url>
   ```

   - Prefer a single language code (`en`) over wildcards (`en.*`) — YouTube
     exposes `en`, `en-en`, and `en-orig` auto-caption tracks and a wildcard
     downloads all three.
   - To inspect what's available first: `yt-dlp --list-subs <url>`.
   - For multiple languages: `--sub-langs "en,it,fr"`.
   - To convert VTT → SRT for editing tools: add `--convert-subs srt`.

2. Find the sub and run the stripper with `--in-place`. The script writes the
   transcript alongside the source (stripping a trailing BCP-47 language tag
   like `.en`, `.pt-BR`, `.zh-Hant` from the filename), deletes the subtitle,
   and prints the new path. Use `find` rather than a glob — zsh errors on
   unmatched patterns (e.g. no `.srt` present):

   ```bash
   SUB=$(find <yt-dlp-download-folder> -maxdepth 1 \( -name '*.vtt' -o -name '*.srt' \) | head -n1)
   OUT=$(node scripts/strip-transcript.mjs --in-place "$SUB")
   ```

   The script auto-detects VTT vs SRT, removes cue numbers, timestamp lines,
   inline timing tags (`<00:00:01.000>`), and dedupes the rolling lines that
   YouTube auto-captions emit. When reading from stdin it defaults to VTT; for
   SRT from stdin pass `--format srt`.

   If the user explicitly asked for the raw subtitle file (e.g. for a video
   editor), drop `--in-place` and redirect stdout to a `.txt` yourself so the
   `.vtt`/`.srt` is preserved.

3. Show the user the path in `$OUT` and offer to summarize the transcript.

## Tips & Gotchas

- **Non-YouTube sites**: yt-dlp supports 1000+ sites (Vimeo, Twitch, SoundCloud,
  Twitter/X, TikTok, etc.). The commands above generally work as-is — pass the
  URL. Site-specific quirks (DRM, private URLs) are documented at
  <https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md>.
- **Age-gated / region-locked videos**: pass `--cookies-from-browser <browser>`
  (e.g. `safari`, `chrome`, `firefox`) to use the user's logged-in session.
- **Rate limits / 429s**: add `--sleep-requests 1 --sleep-interval 5 --max-sleep-interval 15`.
- **Don't shell-interpolate untrusted URLs** — always quote `"<url>"` to avoid
  `&` query-string surprises.
