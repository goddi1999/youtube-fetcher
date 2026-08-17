# YouTube Comment API

Scrapes comments off a YouTube video into JSONL (one comment per line), then serves analysis over a small Flask API so a frontend can fetch it. No API key, no quota — it hits the same endpoints the web player uses.

Python is pinned to **3.11.9**. Everything lives in `api/`.

## Install

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Flask API

```bash
cd api
source .venv/bin/activate
python app.py
```

Runs at `http://127.0.0.1:5000` with CORS enabled. Analysis results (except paginated comments and longest-comments) are cached in memory after the first request.

| Method | Path | Notes |
|---|---|---|
| `GET` | `/` | Lists endpoints |
| `GET` | `/api/health` | Liveness check |
| `GET` | `/api/comments?limit=100&offset=0` | Paginated comments (does not dump the full file) |
| `GET` | `/api/comments/summary` | File totals and a sample row |
| `GET` | `/api/comments/by-year` | Counts by year |
| `GET` | `/api/comments/by-day` | Counts by day, ranked by comment volume |
| `GET` | `/api/comments/longest?limit=10` | Longest comments |
| `GET` | `/api/comments/repeaters` | People who commented more than once |
| `GET` | `/api/comments/languages` | Language breakdown. Slow on first hit: loads FastText, then caches |

Comment data is `api/data/jNQXAC9IVRw.jsonl`. Language detection also needs `api/lid.176.bin` (Facebook FastText) and `api/emojis.ts`.

## Scripts

Each module returns JSON-serializable data and can also be run from the command line:

| Script | What it does |
|---|---|
| `get_all_comments.py` | Download comments to JSONL, or read a page of comments |
| `get_comment_summary.py` | File totals / sample row |
| `get_comments_by_year.py` | Counts by year |
| `get_comments_by_day.py` | Counts by day |
| `get_longest_comments.py` | Longest comments |
| `get_repeat_commenters.py` | Repeat commenters |
| `get_comment_languages.py` | Language ID via FastText |

```bash
cd api
python get_comment_summary.py
python get_comments_by_year.py
python get_comments_by_day.py
python get_longest_comments.py
python get_repeat_commenters.py
python get_comment_languages.py
```

## Download comments

Smoke test — 10.000 comments off the default video (`jNQXAC9IVRw`, "Me at the zoo"):

```bash
cd api
python get_all_comments.py --limit 10.000
```

Full run:

```bash
python get_all_comments.py --limit 1.000.000
```

No cap — runs until YouTube stops serving pages:

```bash
python get_all_comments.py --limit all
```

### Options

| Flag | Default | Notes |
|---|---|---|
| `--limit` | `10.000` | How many comments to fetch. `1.000.000`, `1,000,000`, `1_000_000`, and `1000000` all mean the same thing. `0` or `all` = no cap. |
| `--video` | `jNQXAC9IVRw` | Video ID or a full URL (`https://www.youtube.com/watch?v=...`, `youtu.be/...`, `/shorts/...`) — the ID is pulled out for you. |
| `--sort` | `recent` | `recent` or `popular`. |
| `--language` | `en` | YouTube UI locale. **Leave this alone** — see below. |
| `--out` | `data/<VIDEO>.jsonl` | Output path. |

## Locale is the silent failure mode

YouTube serves comment metadata as **localized display strings**, and the library takes whatever your IP's default locale gives it. A German run produces:

```json
{"time": "vor 6 Jahren", "votes": "4,6 Mio.", "replies": "1000"}
```

Two things break, neither loudly:

1. **Counts become unparseable.** `"4,6 Mio."` is 4.6 million. `"10.090"` is ten thousand and ninety — `int()` reads it as `10`.
2. **Dates vanish entirely.** The library computes `time_parsed` inside `except AttributeError: pass`, so when dateparser can't read the locale it **drops the key** rather than setting it to null. Slovenian `"preden 6 leti"` → no `time_parsed` at all, and nothing tells you.

So `--language en` is the default here and you should keep it. English gives `"6 years ago"` and `"43"`, which parse reliably.

## Output

`api/data/jNQXAC9IVRw.jsonl`, one JSON object per line. The scraper's own fields, plus four added on top:

```json
{"cid":"Ugx...","text":"...","time":"6 years ago","author":"@someone","channel":"UC...",
 "votes":"1.2K","replies":"43","photo":"https://...","heart":false,"reply":false,
 "time_parsed":1597594280.18,
 "stream_index":0,"like_count":1200,"reply_count":43,
 "published_approx":"2020-08-16","published_unit":"year"}
```

| Added field | Meaning |
|---|---|
| `stream_index` | Position in the stream, `0` = newest. See below. |
| `like_count` | `votes` as an int. `null` if the string wasn't English-shaped — a run that fills this column with nulls means the locale slipped. |
| `reply_count` | Same, for `replies`. |
| `published_approx` | `yyyy-mm-dd`, or `null`. Always present as a key. |
| `published_unit` | `year`, `month`, `day`… — the granularity of the source string. |

### What these numbers are not

Worth being blunt, because the field names invite the wrong assumption:

- **`like_count` is the rounded display value.** YouTube shows `"1.2K"`, so you get `1200`, not the true 1,247. Exact below 1,000, rounded above it.
- **`published_approx` is derived, not reported.** The only date the scraper ever sees is a relative string like `"6 years ago"`, converted at scrape time to *now minus six years*. For a `published_unit` of `year` the real date is anywhere in a ±6-month band. It is a date, not a timestamp, and the day is meaningless.

There is no exact-to-the-second `publishedAt` or true-integer `likeCount` on this endpoint — those are **YouTube Data API v3** fields (`commentThreads.list`), which need an API key and burn quota. If you need real timestamps, that's the route; this scraper cannot get there.

### Ordering without dates

`--sort recent` streams strictly newest-first, so `stream_index` gives you a **total ordering that's exact even where the dates are far too coarse to sort by**. Ten thousand comments all stamped `"6 years ago"` collapse to one date but keep perfect relative order. Sort by `stream_index`, not `published_approx`.

Opened in **append mode**, so a second run adds to the same file rather than replacing it. Dedup by `cid` only runs within a single process — if you rerun and want a clean file, delete it first, or dedup after the fact:

```bash
sort -u -t'"' -k4,4 api/data/jNQXAC9IVRw.jsonl > api/data/deduped.jsonl
```

## Progress and stopping

A single line that repaints in place — percent done, count, rate, elapsed `hh:mm:ss`, and ETA:

```
[■■■■■■■■■■□□□□□□□□□□□□□□]  45.2% | 4,520/10,000 | 84.3/s | 00:00:53 | ETA 00:01:04
```

With `--limit all` there is no percentage to show, so the bar bounces a marker to prove it is still alive:

```
[□□□□□□□□□□□□□□□□□□□□□■□□] 45,300 | 83.9/s | 00:09:00
```

When output is redirected to a file (the `nohup` case below), it switches to appending one line per 1.000 comments instead of repainting, so the log stays readable.

Four ways it ends:

- `LIMIT REACHED` — hit your `--limit`.
- `FEED ENDED` — YouTube ran out of comments to serve, cleanly.
- `WALL HIT` — the fetch broke (rate limit, network). The comments already written are safe; the file is flushed every 100.
- `INTERRUPTED` — you pressed Ctrl-C.

## Checking a file

```bash
cd api
python get_comment_summary.py
```

Entry count, size on disk, average row size, how many rows lost their timestamp, and the first entry pretty-printed. `time fmt starts with:` is the locale canary — `vor` means that file was scraped in German.

## Long runs

A million comments is a multi-hour job. Run it detached so a closed terminal doesn't kill it:

```bash
cd api
nohup python get_all_comments.py --limit 1.000.000 > fetch.log 2>&1 &
tail -f fetch.log
```

Expect the rate to sag and expect to hit a wall well short of a million on most videos — YouTube's own paging is the ceiling, not this script. That's what the smoke test is for: run 10.000 first, check the rate, then decide.
