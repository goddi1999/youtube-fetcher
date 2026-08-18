import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone

from youtube_comment_downloader import (
    SORT_BY_POPULAR,
    SORT_BY_RECENT,
    YoutubeCommentDownloader,
)

from paths import (
    VIDEO_ID,
    guarded_write_path,
    iter_comments,
    new_export_path,
    video_id_from,
)

BAR_W = 24
SUFFIX = {"k": 1_000, "m": 1_000_000, "b": 1_000_000_000}
UNITS = ("second", "minute", "hour", "day", "week", "month", "year")


def parse_count(value):
    text = value.strip().lower()
    if text in ("all", "none", "inf"):
        return 0
    cleaned = re.sub(r"[._,\s]", "", text)
    if not cleaned.isdigit():
        raise argparse.ArgumentTypeError(
            f"not a count: {value!r} (try 1.000.000 or 1000000)"
        )
    return int(cleaned)


def hms(seconds):
    total = int(seconds)
    return f"{total // 3600:02d}:{total % 3600 // 60:02d}:{total % 60:02d}"


def to_int(display):
    text = (display or "").strip()
    if not text:
        return 0
    match = re.fullmatch(r"(\d+(?:\.\d+)?)\s*([KMB])", text, re.I)
    if match:
        return int(float(match.group(1)) * SUFFIX[match.group(2).lower()])
    if re.fullmatch(r"\d{1,3}(?:,\d{3})+|\d+", text):
        return int(text.replace(",", ""))
    return None


def relative_unit(display):
    text = (display or "").lower()
    for unit in UNITS:
        if unit in text:
            return unit
    return None


def get_all_comments(limit=100, offset=0):
    comments = []
    skipped = 0
    for row in iter_comments():
        if skipped < offset:
            skipped += 1
            continue
        comments.append(row)
        if limit and len(comments) >= limit:
            break
    return {"offset": offset, "limit": limit, "count": len(comments), "comments": comments}


def download_all_comments(video=VIDEO_ID, limit=10_000, sort="recent", language="en", out=None):
    video = video_id_from(video)
    out_path = guarded_write_path(out if out else new_export_path(video))
    sort_by = SORT_BY_RECENT if sort == "recent" else SORT_BY_POPULAR
    downloader = YoutubeCommentDownloader()
    seen = set()
    written = 0
    started = time.time()
    tty = sys.stdout.isatty()
    no_date = 0
    no_count = 0
    status = "DONE"
    last_draw = 0.0

    def render(done=False):
        elapsed = time.time() - started
        rate = written / elapsed if elapsed > 0 else 0.0
        if limit:
            frac = min(written / limit, 1.0)
            filled = int(frac * BAR_W)
            bar = "■" * filled + "□" * (BAR_W - filled)
            line = (
                f"[{bar}] {frac * 100:5.1f}% | {written:,}/{limit:,} | "
                f"{rate:.1f}/s | {hms(elapsed)}"
            )
            if not done and rate > 0:
                line += f" | ETA {hms((limit - written) / rate)}"
            return line
        pos = (written // 100) % BAR_W
        bar = "".join("■" if i == pos else "□" for i in range(BAR_W))
        return f"[{bar}] {written:,} | {rate:.1f}/s | {hms(elapsed)}"

    def draw(force=False):
        nonlocal last_draw
        now = time.time()
        if tty:
            if force or now - last_draw >= 0.1:
                sys.stdout.write("\r" + render(done=force).ljust(96))
                sys.stdout.flush()
                last_draw = now
        elif force or written % 1000 == 0:
            print(render(done=force), flush=True)

    print(
        f"video={video} sort={sort} lang={language} limit={limit or 'none'} -> {out_path}",
        flush=True,
    )
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "x", encoding="utf-8") as handle:
        try:
            for index, comment in enumerate(
                downloader.get_comments(video, sort_by=sort_by, language=language)
            ):
                if comment["cid"] in seen:
                    continue
                seen.add(comment["cid"])
                comment["stream_index"] = index
                comment["like_count"] = to_int(comment.get("votes"))
                comment["reply_count"] = to_int(comment.get("replies"))
                if comment["like_count"] is None or comment["reply_count"] is None:
                    no_count += 1
                timestamp = comment.get("time_parsed")
                if timestamp is None:
                    comment["time_parsed"] = None
                    comment["published_approx"] = None
                    no_date += 1
                else:
                    comment["published_approx"] = datetime.fromtimestamp(
                        timestamp, timezone.utc
                    ).strftime("%Y-%m-%d")
                comment["published_unit"] = relative_unit(comment.get("time"))
                handle.write(json.dumps(comment, ensure_ascii=False) + "\n")
                written += 1
                if written % 100 == 0:
                    handle.flush()
                    draw()
                if limit and written >= limit:
                    status = f"LIMIT REACHED: {written:,}"
                    break
            else:
                status = f"FEED ENDED: {written:,}"
        except KeyboardInterrupt:
            status = f"INTERRUPTED at {written:,}"
        except Exception as exc:
            status = f"WALL HIT at {written:,}: {type(exc).__name__}: {exc}"

    draw(force=True)
    if tty:
        print()
    print(status, flush=True)
    return {"status": status, "written": written, "out": str(out_path)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download YouTube comments to JSONL.")
    parser.add_argument("--video", default=VIDEO_ID)
    parser.add_argument("--limit", type=parse_count, default=10_000)
    parser.add_argument("--sort", choices=["recent", "popular"], default="recent")
    parser.add_argument("--language", default="en")
    parser.add_argument("--out", default=None)
    args = parser.parse_args()
    try:
        download_all_comments(
            video=args.video,
            limit=args.limit,
            sort=args.sort,
            language=args.language,
            out=args.out,
        )
    except (ValueError, FileExistsError) as exc:
        parser.error(str(exc))
