from flask import Flask, jsonify, request
from flask_cors import CORS

from get_all_comments import get_all_comments
from get_comment_languages import get_comment_languages
from get_comment_summary import get_comment_summary
from get_comments_by_day import get_comments_by_day
from get_comments_by_year import get_comments_by_year
from get_longest_comments import get_longest_comments
from get_repeat_commenters import get_repeat_commenters

app = Flask(__name__)
CORS(app)

_cache = {}


@app.get("/")
def index():
    return jsonify(
        {
            "ok": True,
            "endpoints": [
                "GET /api/health",
                "GET /api/comments?limit=100&offset=0",
                "GET /api/comments/summary",
                "GET /api/comments/by-year",
                "GET /api/comments/by-day",
                "GET /api/comments/longest?limit=10",
                "GET /api/comments/repeaters",
                "GET /api/comments/languages",
            ],
        }
    )


def cached(key, fn):
    if key not in _cache:
        _cache[key] = fn()
    return _cache[key]


@app.get("/api/health")
def health():
    return jsonify({"ok": True})


@app.get("/api/comments")
def comments():
    limit = request.args.get("limit", default=100, type=int)
    offset = request.args.get("offset", default=0, type=int)
    return jsonify(get_all_comments(limit=limit, offset=offset))


@app.get("/api/comments/summary")
def comments_summary():
    return jsonify(cached("summary", get_comment_summary))


@app.get("/api/comments/by-year")
def comments_by_year():
    return jsonify(cached("by_year", get_comments_by_year))


@app.get("/api/comments/by-day")
def comments_by_day():
    return jsonify(cached("by_day", get_comments_by_day))


@app.get("/api/comments/longest")
def longest_comments():
    limit = request.args.get("limit", default=10, type=int)
    return jsonify(get_longest_comments(limit=limit))


@app.get("/api/comments/repeaters")
def repeat_commenters():
    return jsonify(cached("repeaters", get_repeat_commenters))


@app.get("/api/comments/languages")
def comment_languages():
    return jsonify(cached("languages", get_comment_languages))


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
