import heapq

from paths import VIDEO_ID, iter_comments

SORT_KEYS = ("length", "words")


def _rank_key(entry):
    """Total order over comments: biggest metric first, cid breaking ties."""
    return (entry[0], entry[1])


def get_longest_comments(limit=10, sort_by="length"):
    if sort_by not in SORT_KEYS:
        raise ValueError(f"sort_by must be one of {SORT_KEYS}, got {sort_by!r}")
    if limit <= 0:
        return {"limit": limit, "sort_by": sort_by, "comments": []}

    ranked = []
    for row in iter_comments():
        text = row.get("text") or ""
        cid = row.get("cid") or ""
        item = {
            "length": len(text),
            "words": len(text.split()),
            "url": f"https://www.youtube.com/watch?v={VIDEO_ID}&lc={cid}",
            "time": row.get("time"),
            "author": row.get("author"),
            "photo": row.get("photo"),
            "votes": row.get("votes"),
            "text": text,
            "published_approx": row.get("published_approx"),
        }
        # Min-heap keyed by (metric, cid): the root is the worst-ranked entry
        # held so far, so it is the one to drop once the heap is full. cid is
        # unique per comment, which makes the ordering total -- equal-metric
        # comments can no longer swap places between requests.
        entry = (item[sort_by], cid, item)
        if len(ranked) < limit:
            heapq.heappush(ranked, entry)
        elif _rank_key(entry) > _rank_key(ranked[0]):
            heapq.heapreplace(ranked, entry)

    comments = [entry[2] for entry in sorted(ranked, key=_rank_key, reverse=True)]
    return {"limit": limit, "sort_by": sort_by, "comments": comments}


if __name__ == "__main__":
    data = get_longest_comments()
    for i, comment in enumerate(data["comments"], 1):
        print(
            f"\n#{i}  {comment['length']:,} chars  {comment['words']:,} words  "
            f"{comment['author']}  {comment['votes']} votes"
        )
        print(comment["url"])
        print(comment["photo"])
        print(comment["time"], " / ", comment["published_approx"])
