from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
COMMENTS_PATH = DATA_DIR / "jNQXAC9IVRw.jsonl"
EMOJIS_PATH = ROOT / "emojis.ts"
FASTTEXT_MODEL_PATH = ROOT / "lid.176.bin"
VIDEO_ID = "jNQXAC9IVRw"


def iter_comments(path=None):
    path = Path(path) if path else COMMENTS_PATH
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError:
                continue
