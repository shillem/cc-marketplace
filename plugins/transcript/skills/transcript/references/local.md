# Local transcripts

## Sidecar subtitles

Look beside the input for matching `.srt` or `.vtt` files, such as `Talk.srt` or
`Talk.en.vtt` for `Talk.mp4`. Check their language and coverage. If a suitable
sidecar exists, return its path for the shared subtitle cleanup in `SKILL.md`.
Otherwise inspect embedded subtitles.

## Embedded subtitles

```bash
ffprobe -v error -select_streams s \
  -show_entries stream=index,codec_name:stream_tags=language,title:stream_disposition=default,forced \
  -of json "<local-file>"
```

An empty `streams` array from a successful probe means no ordinary subtitle
streams were found. Select a full-length text track in the requested language:

- Common text codecs: `subrip`, `webvtt`, `ass`, `ssa`, `mov_text`, and `text`.
- Language tags may use `eng` for `en` or `ita` for `it`. Missing or `und` tags
  need sample text or clarification; a default disposition alone is not enough.
- Exclude forced-only tracks, which usually cover only occasional dialogue.
- Bitmap codecs such as `hdmv_pgs_subtitle`, `dvd_subtitle`, `dvb_subtitle`, and
  `xsub` need OCR, outside this workflow. Explain this before offering recognition.
- Investigate unfamiliar codecs rather than assuming they contain no text.

EIA-608/708 captions inside a video stream may not appear as subtitle streams.
If the user or metadata indicates such captions, explain that decoding them is
outside this workflow and ask how to proceed.

Extract a selected text track using ffprobe's absolute stream `index`, not its
position in the subtitle list:

```bash
ffmpeg -nostdin -v error -n -i "<local-file>" \
  -map "0:<stream-index>" -c:s srt "<run-dir>/subtitles.srt"
```

Return this SRT path for shared cleanup. If no suitable text subtitles exist,
continue to speech recognition.

## Speech recognition

This section accepts either local media without suitable subtitles or media
already downloaded by the URL route.

### Audio selection

Whisper uses FFmpeg to decode media directly; no MP3 or WAV conversion is needed
for an ordinary single-audio-track file. Inspect audio tracks:

```bash
ffprobe -v error -select_streams a \
  -show_entries stream=index:stream_tags=language,title:stream_disposition=default \
  -of json "<media-file>"
```

For multiple tracks, select the intended language rather than commentary or an
unrelated dub. Extract the chosen track by its absolute stream index:

```bash
ffmpeg -nostdin -v error -n -i "<media-file>" \
  -map "0:<stream-index>" -vn -ac 1 -ar 16000 -c:a pcm_s16le \
  "<run-dir>/audio.wav"
```

Use that WAV as the recognition input; otherwise use the media directly.

### Model and command

Use `mlx-community/whisper-large-v3-turbo` unless the user specifies another
MLX-compatible model repository or local model directory. Always pass the model
explicitly; the CLI defaults to a much smaller model. Do not silently substitute
another model after an error.

The first use of a repository may download weights from Hugging Face. Mention
this before the first run; without network permission, use an available local
model or stop. Inference runs locally. Allow enough time for the recording and
any model download.

```bash
mlx_whisper "<media-or-selected-audio-file>" \
  --model "<selected-model>" \
  --task transcribe \
  --output-dir "<run-dir>" \
  --output-name "transcript" \
  --output-format txt \
  --verbose False
```

Resolve `<selected-model>` using the default above or the user's override. Apply
the spoken-language rule from `SKILL.md` with `--language <code>`, or omit it for
detection. Turbo is intended for transcription, not the `translate` task.

The installed CLI can catch exceptions, print `Skipping ...`, and still exit
with status zero. Inspect its logs as well as applying the shared output check.
An exit code alone cannot establish success.

### Useful options

Boolean arguments take literal `True` or `False`. Keep decoding defaults unless
a specific feature or problem calls for a change:

- `--output-format srt`, `vtt`, or `json`: timed subtitles or structured results.
- `--initial-prompt "Names and technical terms..."`: spelling hints, not guaranteed
  corrections or instructions.
- `--clip-timestamps "60,180"`: recognize a section specified in seconds.
- `--word-timestamps True`: word-level timing; unnecessary for plain text.
- `--condition-on-previous-text False`: retry repeated-text loops, at the cost of
  consistency between windows.
- `--word-timestamps True --hallucination-silence-threshold 2`: optional retry for
  suspected hallucinations around silence; not a guaranteed fix.

Recognition may mishear names, music, silence, or poor audio. It does not provide
speaker diarization.
