from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote
import json
import re

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
EXPORTS_DIR = DATA_DIR / "exports"
COMMENTS_PATH = DATA_DIR / "jNQXAC9IVRw.jsonl"
EMOJIS_PATH = ROOT / "emojis.ts"
FASTTEXT_MODEL_PATH = ROOT / "lid.176.bin"
VIDEO_ID = "jNQXAC9IVRw"

YOUTUBE_ID_RE = re.compile(
    r"(?:v=|/embed/|/shorts/|youtu\.be/)([A-Za-z0-9_-]{11})"
)
YOUTUBE_LC_RE = re.compile(r"(?:[?&]lc=|/comment/)([^&/?#]+)")


def comments_db_path():
    return COMMENTS_PATH.resolve()


def is_comments_db(path):
    try:
        return Path(path).resolve() == comments_db_path()
    except OSError:
        return Path(path) == COMMENTS_PATH


def parse_youtube_url(value):
    text = unquote(str(value or "").strip())
    video_match = YOUTUBE_ID_RE.search(text)
    lc_match = YOUTUBE_LC_RE.search(text)
    video = video_match.group(1) if video_match else None
    lc = unquote(lc_match.group(1)) if lc_match else None
    if not video and re.fullmatch(r"[A-Za-z0-9_-]{11}", text):
        video = text
    elif not lc and text and "://" not in text and not video:
        lc = text
    return {"video": video, "lc": lc, "url": text}


def video_id_from(value):
    parsed = parse_youtube_url(value)
    return parsed["video"] or str(value).strip()


def iter_comments(path=None):
    path = Path(path) if path else COMMENTS_PATH
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue


def find_comment(cid, path=None):
    if not cid:
        return None
    wanted = unquote(str(cid).strip())
    for row in iter_comments(path):
        row_cid = row.get("cid") or ""
        if row_cid == wanted or row_cid.split(".", 1)[0] == wanted:
            return row
    return None


def new_export_path(video):
    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    return EXPORTS_DIR / f"{video}.{stamp}.jsonl"


def guarded_write_path(path):
    path = Path(path)
    if is_comments_db(path):
        raise ValueError(
            f"refusing to write to protected comments database {COMMENTS_PATH}"
        )
    return path
