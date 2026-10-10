---
name: yt-dlp
description: Download videos and audio from YouTube and 1000+ sites with yt-dlp. Use when the user mentions "yt-dlp", "youtube-dl", wants to download a video, or rip audio from a URL.
argument-hint: "[video|audio] <url> [...]"
compatibility: Requires yt-dlp; yt-dlp also needs ffmpeg for audio extraction and combining separate video/audio streams.
---

1. Treat the first word passed by the user as `$ACTION`, remainder as the URL.
2. If `$ACTION` matches one of the actions, follow its instructions.
3. For natural-language requests, infer the action from the user's intent. Otherwise, if `$ACTION` is empty or does not match an action, list the available actions.

**Important**: downloads are saved to `<cwd>/.ai/yt-dlp` (current working directory) unless the user specifies another path. Both actions require URLs.

## Actions

### Video

Download a video at the best available quality.

```bash
yt-dlp --restrict-filenames -P "<yt-dlp-download-folder>" -o "%(title)s.%(ext)s" "<url>"
```

**Common variants:**

- Specific resolution cap (best ≤ 1080p, merged into mp4):
  ```bash
  yt-dlp --restrict-filenames -P "<yt-dlp-download-folder>" -o "%(title)s.%(ext)s" \
    -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 "<url>"
  ```
- A specific format from the format list — first inspect with `yt-dlp -F "<url>"`,
  then pick by id: `yt-dlp -f 137+140 "<url>"`
- Whole playlist: pass the playlist URL as-is. To limit, add `--playlist-items 1-5`
- Resume / skip already-downloaded: `--continue --no-overwrites` (default behavior is fine for most cases)

### Audio

Extract audio only — strips the video stream.

```bash
yt-dlp -x --audio-format mp3 --audio-quality 0 --restrict-filenames -P "<yt-dlp-download-folder>" -o "%(title)s.%(ext)s" "<url>"
```

- `--audio-format` accepts `mp3`, `m4a`, `opus`, `flac`, `wav`, `aac`, `vorbis`
- `--audio-quality 0` means best VBR; use `192K` for a fixed bitrate
- Embed cover art and metadata: add `--embed-thumbnail --add-metadata`
- For a playlist as an album, add `-o "%(playlist_title)s/%(playlist_index)02d - %(title)s.%(ext)s"`

## Access problems

- **Non-YouTube sites**: yt-dlp supports 1000+ sites (Vimeo, Twitch, SoundCloud,
  Twitter/X, TikTok, etc.). The commands above generally work as-is — pass the
  URL. Site-specific quirks (DRM, private URLs) are documented at
  <https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md>.
- **Age-gated / region-locked videos**: pass `--cookies-from-browser <browser>`
  (e.g. `safari`, `chrome`, `firefox`) to use the user's logged-in session
- **Rate limits / 429s**: add `--sleep-requests 1 --sleep-interval 5 --max-sleep-interval 15`
