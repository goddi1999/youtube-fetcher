from collections import Counter

from paths import iter_comments


def get_comments_by_year():
    total = 0
    top_level = 0
    channels = set()
    dates = []
    units = Counter()
    by_year = Counter()

    for row in iter_comments():
        total += 1
        if not row.get("reply"):
            top_level += 1
            units[row.get("published_unit") or "unknown"] += 1
        channel = row.get("channel")
        if channel:
            channels.add(channel)
        published = row.get("published_approx")
        if published:
            dates.append(published)
            by_year[published[:4]] += 1

    dates.sort()
    years = []
    if by_year:
        start = int(min(by_year))
        end = int(max(by_year))
        years = [
            {"year": year, "comments": by_year[str(year)]}
            for year in range(start, end + 1)
        ]

    return {
        "total_rows": total,
        "top_level": top_level,
        "replies": total - top_level,
        "unique_channels": len(channels),
        "date_range": {
            "start": dates[0] if dates else None,
            "end": dates[-1] if dates else None,
        },
        "published_units": dict(units),
        "by_year": years,
        "all_dated_comments": sum(by_year.values()),
    }


if __name__ == "__main__":
    data = get_comments_by_year()
    print(f"total rows:      {data['total_rows']:,}")
    print(f"top-level:       {data['top_level']:,}   replies: {data['replies']:,}")
    print(f"unique channels: {data['unique_channels']:,}")
    rng = data["date_range"]
    if rng["start"]:
        print(f"date range:      {rng['start']} → {rng['end']}")
    print(data["published_units"])
    print("\nyear  comments")
    for row in data["by_year"]:
        print(f"{row['year']}  {row['comments']:,}")
    print(f"all   {data['all_dated_comments']:,}")
