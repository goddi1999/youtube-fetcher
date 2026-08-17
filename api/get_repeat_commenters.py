from collections import Counter

from paths import iter_comments


def get_repeat_commenters():
    counts = Counter()
    for row in iter_comments():
        channel = row.get("channel")
        if channel:
            counts[channel] += 1

    once = sum(1 for n in counts.values() if n == 1)
    repeat = sum(1 for n in counts.values() if n >= 2)
    by_times = Counter(counts.values())
    histogram = [
        {"times_commented": times, "people": people}
        for times, people in sorted(by_times.items())
        if times >= 2
    ]

    return {
        "unique_people": len(counts),
        "commented_once": once,
        "commented_multiple_times": repeat,
        "comments_from_repeaters": sum(n for n in counts.values() if n >= 2),
        "histogram": histogram,
    }


if __name__ == "__main__":
    data = get_repeat_commenters()
    print(f"unique people:              {data['unique_people']:,}")
    print(f"commented once:             {data['commented_once']:,}")
    print(f"commented multiple times:   {data['commented_multiple_times']:,}")
    print(f"comments from repeaters:    {data['comments_from_repeaters']:,}")
    print("\ntimes commented   people")
    for row in data["histogram"]:
        print(f"{row['times_commented']:>15}   {row['people']:,}")
