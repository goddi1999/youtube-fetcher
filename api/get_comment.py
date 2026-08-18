from paths import VIDEO_ID, find_comment, parse_youtube_url


def get_comment(url=None, video=None, lc=None):
    parsed = parse_youtube_url(url) if url else {"video": None, "lc": None, "url": None}
    video = video or parsed["video"]
    lc = lc or parsed["lc"]

    if not lc:
        return {
            "ok": False,
            "error": "need a comment id (lc) or a YouTube comment URL",
            "hint": "https://www.youtube.com/watch?v=VIDEO_ID&lc=COMMENT_ID",
        }

    if video and video != VIDEO_ID:
        return {
            "ok": False,
            "error": f"this comments database is for {VIDEO_ID}, not {video}",
            "video": video,
            "lc": lc,
        }

    row = find_comment(lc)
    if row is None:
        return {
            "ok": False,
            "error": "comment not found in jsonl database",
            "video": video or VIDEO_ID,
            "lc": lc,
        }

    return {
        "ok": True,
        "video": video or VIDEO_ID,
        "lc": row.get("cid"),
        "url": f"https://www.youtube.com/watch?v={video or VIDEO_ID}&lc={row.get('cid', '')}",
        "comment": row,
    }
