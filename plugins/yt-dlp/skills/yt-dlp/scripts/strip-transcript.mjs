#!/usr/bin/env node

import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const VALID_FORMATS = new Set(["vtt", "srt"]);
const LANG_TAG = /^[A-Za-z]{2,3}(-[A-Za-z0-9]+)*$/;

const ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "st",
  "e.g",
  "i.e",
  "etc",
  "vs",
  "cf",
  "al",
  "inc",
  "ltd",
  "co",
  "corp",
  "no",
  "u.s",
  "u.k",
  "u.n"
]);

const TIMESTAMP_LINE = /\d{1,2}:\d{2}:\d{2}[.,]\d{3}\s*-->/;
const INLINE_TIMING = /<\d{1,2}:\d{2}:\d{2}[.,]\d{3}>/g;
const HTML_TAG = /<\/?[^>]+>/g;
const VTT_HEADER = /^(WEBVTT|Kind:|Language:)/;
const VTT_BLOCK_START = /^(NOTE\b|STYLE\b|REGION\b)/;
const CUE_INDEX = /^\d+$/;

// YouTube auto-captions produce overlapping cues where each cue repeats the
// tail of the previous one. Drop a line if it's a prefix/suffix overlap of
// what we already emitted.
function appendDedup(out, text) {
  if (!text) return;
  const last = out[out.length - 1];
  if (!last) {
    out.push(text);
    return;
  }
  if (text === last) return;
  if (last.endsWith(text)) return;
  if (text.startsWith(last)) {
    out[out.length - 1] = text;
    return;
  }
  // Trim leading words that already appear at the tail of `last`.
  const words = text.split(" ");
  for (let take = Math.min(words.length, 12); take > 0; take--) {
    const head = words.slice(0, take).join(" ");
    if (last.endsWith(" " + head) || last === head) {
      const rest = words.slice(take).join(" ").trim();
      if (rest) out.push(rest);
      return;
    }
  }
  out.push(text);
}

function clean(line) {
  return line
    .replace(INLINE_TIMING, "")
    .replace(HTML_TAG, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Title.en.vtt -> Title.txt; Talk.pt-BR.srt -> Talk.txt; my.notes.vtt -> my.notes.txt
function derivePath(file) {
  const dir = dirname(file);
  const name = basename(file, extname(file));
  const tag = extname(name).slice(1);
  const stem = tag && LANG_TAG.test(tag) ? name.slice(0, -(tag.length + 1)) : name;
  return join(dir, `${stem}.txt`);
}

function isMetadataLine(line, ext) {
  const t = line.trim();
  if (!t) return true;
  if (TIMESTAMP_LINE.test(t)) return true;
  if (ext === "vtt" && VTT_HEADER.test(t)) return true;
  if (ext === "srt" && CUE_INDEX.test(t)) return true;
  return false;
}

async function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(2);
  }

  if (args.help) {
    usage();
    process.exit(0);
  }

  let content;
  let ext;
  if (args.file) {
    ext = extname(args.file).slice(1).toLowerCase();
    try {
      content = readFileSync(args.file, "utf8");
    } catch (error) {
      process.stderr.write(`Failed to read ${args.file}: ${error.message}\n`);
      process.exit(1);
    }
  } else if (!process.stdin.isTTY) {
    if (args.inPlace) {
      process.stderr.write("--in-place requires a file path, not stdin.\n");
      process.exit(2);
    }
    ext = args.format || "vtt";
    content = await readStdin();
  } else {
    usage();
    process.exit(1);
  }

  if (!VALID_FORMATS.has(ext)) {
    process.stderr.write(`Unsupported subtitle format: .${ext}\n`);
    process.exit(2);
  }

  const transcript = strip(content, ext);

  if (args.inPlace) {
    const out = derivePath(args.file);
    try {
      writeFileSync(out, transcript);
    } catch (error) {
      process.stderr.write(`Failed to write ${out}: ${error.message}\n`);
      process.exit(1);
    }
    if (out !== args.file) {
      try {
        unlinkSync(args.file);
      } catch (error) {
        process.stderr.write(`Wrote ${out} but failed to delete ${args.file}: ${error.message}\n`);
        process.exit(1);
      }
    }
    process.stdout.write(out + "\n");
    return;
  }

  process.stdout.write(transcript);
}

function parseArgs(argv) {
  const args = { file: null, format: null, inPlace: false, help: false };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "-h" || a === "--help") args.help = true;
    else if (a === "--format" || a === "-f") {
      const format = rest[++i]?.toLowerCase();
      if (!format || !VALID_FORMATS.has(format)) {
        throw new Error("--format must be followed by vtt or srt.");
      }
      args.format = format;
    } else if (a === "--in-place" || a === "-i") args.inPlace = true;
    else if (a.startsWith("-")) throw new Error(`Unknown option: ${a}`);
    else if (!args.file) args.file = a;
    else throw new Error(`Unexpected argument: ${a}`);
  }
  return args;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function strip(content, ext) {
  const lines = content.split(/\r?\n/);
  const out = [];
  let inVttBlock = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (ext === "vtt") {
      if (inVttBlock) {
        if (!line) inVttBlock = false;
        continue;
      }
      if (VTT_BLOCK_START.test(line)) {
        inVttBlock = true;
        continue;
      }
    }
    if (isMetadataLine(raw, ext)) continue;
    const text = clean(raw);
    if (!text) continue;
    appendDedup(out, text);
  }

  const joined = out.join(" ").replace(/  +/g, " ");
  return splitSentences(joined).trim() + "\n";
}

function splitSentences(text) {
  return text.replace(/([.!?])\s+(?=["'(\[]?[A-Z])/g, (match, punct, offset, full) => {
    const lastWord =
      full
        .slice(0, offset)
        .match(/([\w.]+)$/)?.[1]
        ?.toLowerCase() ?? "";
    const stem = lastWord.replace(/\.+$/, "");
    if (ABBREVIATIONS.has(stem)) return match;
    return punct + "\n\n";
  });
}

function usage() {
  process.stderr.write(
    "Usage: strip-transcript.mjs <file.vtt|file.srt> [--in-place]\n" +
      "       cat file.vtt | strip-transcript.mjs [--format vtt|srt]\n" +
      "\n" +
      "Writes plain text to stdout. Defaults to vtt when reading stdin.\n" +
      "--in-place / -i : write transcript alongside source (stripping a\n" +
      "                  trailing BCP-47 language tag if present), delete\n" +
      "                  the source, and print the new path to stdout.\n"
  );
}

main();
