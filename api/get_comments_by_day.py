from collections import defaultdict

from paths import iter_comments


def get_comments_by_day():
    comments_by_day = defaultdict(int)
    people_by_day = defaultdict(set)

    for row in iter_comments():
        day = row.get("published_approx")
        if not day:
            continue
        comments_by_day[day] += 1
        channel = row.get("channel")
        if channel:
            people_by_day[day].add(channel)

    days = sorted(comments_by_day)
    total = sum(comments_by_day.values())
    ranked = sorted(comments_by_day, key=lambda day: comments_by_day[day], reverse=True)

    return {
        "days_with_comments": len(days),
        "date_range": {
            "start": days[0] if days else None,
            "end": days[-1] if days else None,
        },
        "total_comments": total,
        "avg_comments_per_day": round(total / len(days), 1) if days else 0,
        "avg_people_per_day": (
            round(sum(len(people_by_day[day]) for day in days) / len(days), 1)
            if days
            else 0
        ),
        "days": [
            {
                "rank": rank,
                "date": day,
                "comments": comments_by_day[day],
                "people": len(people_by_day[day]),
            }
            for rank, day in enumerate(ranked, 1)
        ],
    }


if __name__ == "__main__":
    data = get_comments_by_day()
    print(f"days with comments:  {data['days_with_comments']:,}")
    rng = data["date_range"]
    print(f"date range:          {rng['start']} → {rng['end']}")
    print(f"total comments:      {data['total_comments']:,}")
    print(f"avg comments/day:    {data['avg_comments_per_day']}")
    print(f"avg people/day:      {data['avg_people_per_day']}")
    print("\nrank  date        comments  people")
    for row in data["days"]:
        print(
            f"{row['rank']:>4}  {row['date']}  {row['comments']:8,}  {row['people']:6,}"
        )
