import json
import os

from paths import COMMENTS_PATH, iter_comments


def get_comment_summary(path=None):
    path = path or COMMENTS_PATH
    size = os.path.getsize(path)
    total = 0
    bad = 0
    no_date = 0
    first = None
    time_starts = set()

    for row in iter_comments(path):
        total += 1
        if first is None:
            first = row
        if row.get("time_parsed") is None:
            no_date += 1
        token = (row.get("time") or "").split()
        if token:
            time_starts.add(token[0].lower())

    return {
        "file": str(path),
        "entries": total,
        "size_bytes": size,
        "avg_row_bytes": round(size / total) if total else 0,
        "bad_json_lines": bad,
        "rows_without_date": no_date,
        "time_token_starts": sorted(time_starts)[:8],
        "first_entry": first,
    }


if __name__ == "__main__":
    data = get_comment_summary()
    print(f"file     {data['file']}")
    print(f"entries  {data['entries']:,}")
    print(f"size     {data['size_bytes'] / 1024 / 1024:.2f} MB")
    if data["first_entry"]:
        print("\nfirst entry")
        print(json.dumps(data["first_entry"], ensure_ascii=False, indent=2))
