# URL transcripts

## Inspect subtitles

```bash
yt-dlp --no-playlist --list-subs "<url>"
```

For structured inspection, use `--dump-single-json` and inspect `subtitles` and
`automatic_captions`; read only the relevant fields rather than loading the full
metadata into context.

Select one exact language key. On YouTube, the original auto-caption track may
be `en-orig`, not `en`; distinguish it from automatically translated tracks.
Avoid wildcards such as `en.*`, which download several variants.

## Download a selected track

For uploaded subtitles:

```bash
yt-dlp --no-playlist --skip-download --write-subs --no-write-auto-subs \
  --sub-langs "<selected-language-key>" --sub-format "vtt/srt/best" \
  --restrict-filenames -P "<run-dir>" -o "source.%(ext)s" "<url>"
```

For automatic captions, replace `--write-subs --no-write-auto-subs` with
`--no-write-subs --write-auto-subs`. `--sub-langs` accepts regex patterns; anchor
and escape the selected key if it contains regex metacharacters.

Locate the result:

```bash
find "<run-dir>" -maxdepth 1 -type f \( -name '*.vtt' -o -name '*.srt' \)
```

Expect exactly one subtitle file. yt-dlp may exit successfully without writing
a requested track: a missing file does not override the earlier availability
check. Resolve missing or multiple files rather than invoking Whisper.

If the site supplied a different text format, add `--convert-subs srt` to the
download command. Return the resolved SRT/VTT path for the shared subtitle cleanup
in `SKILL.md`.

## Download media when no suitable subtitles exist

```bash
yt-dlp --no-playlist -f "bestaudio/best" --restrict-filenames \
  -P "<run-dir>" -o "source.%(ext)s" "<url>"
```

`best` covers sites without separate audio formats. Return the exact downloaded
media path for the speech-recognition route in `SKILL.md`.

## Access problems

- For age-gated or region-locked content, use `--cookies-from-browser <browser>`
  (such as `safari`, `chrome`, or `firefox`) with the user's logged-in session.
- For rate limits or HTTP 429s, retry with `--sleep-requests 1 --sleep-interval 5 --max-sleep-interval 15`.
