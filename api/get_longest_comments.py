import heapq

from paths import VIDEO_ID, iter_comments


def get_longest_comments(limit=10):
    ranked = []
    for row in iter_comments():
        text = row.get("text") or ""
        item = {
            "length": len(text),
            "words": len(text.split()),
            "url": f"https://www.youtube.com/watch?v={VIDEO_ID}&lc={row.get('cid', '')}",
            "time": row.get("time"),
            "author": row.get("author"),
            "photo": row.get("photo"),
            "votes": row.get("votes"),
            "text": text,
            "published_approx": row.get("published_approx"),
        }
        if len(ranked) < limit:
            heapq.heappush(ranked, (item["length"], id(item), item))
        elif item["length"] > ranked[0][0]:
            heapq.heapreplace(ranked, (item["length"], id(item), item))

    comments = [entry[2] for entry in sorted(ranked, key=lambda x: x[0], reverse=True)]
    return {"limit": limit, "comments": comments}


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
