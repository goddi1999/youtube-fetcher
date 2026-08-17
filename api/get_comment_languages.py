import re
from collections import Counter

import emoji
import fasttext
import numpy as np

from paths import EMOJIS_PATH, FASTTEXT_MODEL_PATH, iter_comments

_model = None
FLAG_BY_COUNTRY = {}
EMOJI_RE = None


def _predict_compat(model, text, k=1, threshold=0.0, on_unicode_error="strict"):
    if "\n" in text:
        text = text.replace("\n", " ")
    predictions = model.f.predict(text + "\n", k, threshold, on_unicode_error)
    if predictions:
        probs, labels = zip(*predictions)
    else:
        probs, labels = ([], ())
    return labels, np.asarray(probs)


def load_emojis(path=None):
    path = path or EMOJIS_PATH
    source = path.read_text(encoding="utf-8")
    found = re.findall(r"emoji:\s*'([^']+)'", source)
    found.sort(key=len, reverse=True)

    flags = {}
    for block in re.findall(r"\{[^{}]+\}", source):
        if "Flags" not in block or "flag:" not in block:
            continue
        em = re.search(r"emoji:\s*'([^']+)'", block)
        desc = re.search(r"description:\s*'flag: ([^']+)'", block)
        if not em or not desc:
            continue
        char, country = em.group(1), desc.group(1)
        keys = [
            country.lower(),
            re.sub(r"[^a-z0-9]+", "_", country.lower()).strip("_"),
        ]
        alias_m = re.search(r"aliases:\s*\[([^\]]*)\]", block)
        if alias_m:
            keys.extend(
                a.strip().strip("'\"")
                for a in alias_m.group(1).split(",")
                if a.strip()
            )
        for key in keys:
            if key:
                flags[key] = char
    return found, flags


def get_model():
    global _model, FLAG_BY_COUNTRY, EMOJI_RE
    if _model is None:
        loaded = fasttext.load_model(str(FASTTEXT_MODEL_PATH))
        loaded.predict = lambda text, k=1: _predict_compat(loaded, text, k)
        emojis, FLAG_BY_COUNTRY = load_emojis()
        EMOJI_RE = (
            re.compile("|".join(re.escape(e) for e in emojis)) if emojis else None
        )
        _model = loaded
    return _model

# FastText code -> (English name, emojis.ts "flag: …" country). Country is None if no flag.
LANG_META = {
    "af": ("Afrikaans", "South Africa"),
    "als": ("Albanian (Tosk)", "Albania"),
    "am": ("Amharic", "Ethiopia"),
    "an": ("Aragonese", "Spain"),
    "ar": ("Arabic", "Saudi Arabia"),
    "arz": ("Egyptian Arabic", "Egypt"),
    "as": ("Assamese", "India"),
    "ast": ("Asturian", "Spain"),
    "az": ("Azerbaijani", "Azerbaijan"),
    "azb": ("South Azerbaijani", "Iran"),
    "ba": ("Bashkir", "Russia"),
    "bar": ("Bavarian", "Germany"),
    "be": ("Belarusian", "Belarus"),
    "bg": ("Bulgarian", "Bulgaria"),
    "bh": ("Bihari", "India"),
    "bn": ("Bengali", "Bangladesh"),
    "bo": ("Tibetan", "China"),
    "bpy": ("Bishnupriya", "India"),
    "br": ("Breton", "France"),
    "bs": ("Bosnian", "Bosnia & Herzegovina"),
    "ca": ("Catalan", "Spain"),
    "cbk": ("Chavacano", "Philippines"),
    "ce": ("Chechen", "Russia"),
    "ceb": ("Cebuano", "Philippines"),
    "ckb": ("Central Kurdish", "Iraq"),
    "cs": ("Czech", "Czechia"),
    "cv": ("Chuvash", "Russia"),
    "cy": ("Welsh", "Wales"),
    "da": ("Danish", "Denmark"),
    "de": ("German", "Germany"),
    "dv": ("Dhivehi", "Maldives"),
    "el": ("Greek", "Greece"),
    "eml": ("Emilian", "Italy"),
    "en": ("English", "United States"),
    "eo": ("Esperanto", None),
    "es": ("Spanish", "Spain"),
    "et": ("Estonian", "Estonia"),
    "eu": ("Basque", "Spain"),
    "fa": ("Persian", "Iran"),
    "fi": ("Finnish", "Finland"),
    "fr": ("French", "France"),
    "frr": ("North Frisian", "Germany"),
    "fy": ("Western Frisian", "Netherlands"),
    "ga": ("Irish", "Ireland"),
    "gd": ("Scottish Gaelic", "Scotland"),
    "gl": ("Galician", "Spain"),
    "gn": ("Guarani", "Paraguay"),
    "gom": ("Goan Konkani", "India"),
    "gu": ("Gujarati", "India"),
    "gv": ("Manx", "Isle of Man"),
    "he": ("Hebrew", "Israel"),
    "hi": ("Hindi", "India"),
    "hr": ("Croatian", "Croatia"),
    "hsb": ("Upper Sorbian", "Germany"),
    "ht": ("Haitian Creole", "Haiti"),
    "hu": ("Hungarian", "Hungary"),
    "hy": ("Armenian", "Armenia"),
    "ia": ("Interlingua", None),
    "id": ("Indonesian", "Indonesia"),
    "ie": ("Interlingue", None),
    "ilo": ("Ilocano", "Philippines"),
    "io": ("Ido", None),
    "is": ("Icelandic", "Iceland"),
    "it": ("Italian", "Italy"),
    "ja": ("Japanese", "Japan"),
    "jbo": ("Lojban", None),
    "jv": ("Javanese", "Indonesia"),
    "ka": ("Georgian", "Georgia"),
    "kk": ("Kazakh", "Kazakhstan"),
    "km": ("Khmer", "Cambodia"),
    "kn": ("Kannada", "India"),
    "ko": ("Korean", "South Korea"),
    "krc": ("Karachay-Balkar", "Russia"),
    "ku": ("Kurdish", "Iraq"),
    "kw": ("Cornish", "United Kingdom"),
    "ky": ("Kyrgyz", "Kyrgyzstan"),
    "la": ("Latin", "Vatican City"),
    "lb": ("Luxembourgish", "Luxembourg"),
    "lez": ("Lezgian", "Russia"),
    "li": ("Limburgish", "Netherlands"),
    "lmo": ("Lombard", "Italy"),
    "lo": ("Lao", "Laos"),
    "lt": ("Lithuanian", "Lithuania"),
    "lv": ("Latvian", "Latvia"),
    "mai": ("Maithili", "India"),
    "mg": ("Malagasy", "Madagascar"),
    "mhr": ("Eastern Mari", "Russia"),
    "min": ("Minangkabau", "Indonesia"),
    "mk": ("Macedonian", "North Macedonia"),
    "ml": ("Malayalam", "India"),
    "mn": ("Mongolian", "Mongolia"),
    "mr": ("Marathi", "India"),
    "ms": ("Malay", "Malaysia"),
    "mt": ("Maltese", "Malta"),
    "mwl": ("Mirandese", "Portugal"),
    "my": ("Burmese", "Myanmar (Burma)"),
    "mzn": ("Mazanderani", "Iran"),
    "nap": ("Neapolitan", "Italy"),
    "nds": ("Low German", "Germany"),
    "ne": ("Nepali", "Nepal"),
    "nl": ("Dutch", "Netherlands"),
    "nn": ("Norwegian Nynorsk", "Norway"),
    "no": ("Norwegian", "Norway"),
    "oc": ("Occitan", "France"),
    "or": ("Odia", "India"),
    "os": ("Ossetian", "Georgia"),
    "pa": ("Punjabi", "India"),
    "pam": ("Kapampangan", "Philippines"),
    "pl": ("Polish", "Poland"),
    "pms": ("Piedmontese", "Italy"),
    "pnb": ("Western Punjabi", "Pakistan"),
    "ps": ("Pashto", "Afghanistan"),
    "pt": ("Portuguese", "Brazil"),
    "qu": ("Quechua", "Peru"),
    "rm": ("Romansh", "Switzerland"),
    "ro": ("Romanian", "Romania"),
    "ru": ("Russian", "Russia"),
    "sa": ("Sanskrit", "India"),
    "sah": ("Yakut", "Russia"),
    "sc": ("Sardinian", "Italy"),
    "scn": ("Sicilian", "Italy"),
    "sco": ("Scots", "Scotland"),
    "sd": ("Sindhi", "Pakistan"),
    "sh": ("Serbo-Croatian", "Serbia"),
    "si": ("Sinhala", "Sri Lanka"),
    "sk": ("Slovak", "Slovakia"),
    "sl": ("Slovenian", "Slovenia"),
    "so": ("Somali", "Somalia"),
    "sq": ("Albanian", "Albania"),
    "sr": ("Serbian", "Serbia"),
    "su": ("Sundanese", "Indonesia"),
    "sv": ("Swedish", "Sweden"),
    "sw": ("Swahili", "Tanzania"),
    "ta": ("Tamil", "India"),
    "te": ("Telugu", "India"),
    "tg": ("Tajik", "Tajikistan"),
    "th": ("Thai", "Thailand"),
    "tk": ("Turkmen", "Turkmenistan"),
    "tl": ("Tagalog", "Philippines"),
    "tr": ("Turkish", "Turkey"),
    "tt": ("Tatar", "Russia"),
    "ug": ("Uyghur", "China"),
    "uk": ("Ukrainian", "Ukraine"),
    "ur": ("Urdu", "Pakistan"),
    "uz": ("Uzbek", "Uzbekistan"),
    "vep": ("Veps", "Russia"),
    "vi": ("Vietnamese", "Vietnam"),
    "vo": ("Volapük", None),
    "wa": ("Walloon", "Belgium"),
    "war": ("Waray", "Philippines"),
    "wuu": ("Wu Chinese", "China"),
    "yi": ("Yiddish", "Israel"),
    "yo": ("Yoruba", "Nigeria"),
    "yue": ("Cantonese", "Hong Kong SAR China"),
    "zh": ("Chinese", "China"),
}

SPECIAL_LABELS = {
    "EMOJI_OR_EMPTY": "Emoji / empty",
    "SYMBOLS_ONLY": "Symbols only",
    "UNCERTAIN_SHORT": "Uncertain (short)",
}


def lookup_flag(country):
    get_model()
    if not country:
        return ""
    keys = [
        country.lower(),
        re.sub(r"[^a-z0-9]+", "_", country.lower()).strip("_"),
    ]
    for key in keys:
        flag = FLAG_BY_COUNTRY.get(key)
        if flag:
            return flag
    return ""


def lang_payload(code, count, total):
    if code in SPECIAL_LABELS:
        return {
            "code": code,
            "name": SPECIAL_LABELS[code],
            "flag": None,
            "country": None,
            "count": count,
            "percent": round((count / total) * 100, 2) if total else 0,
        }
    name, country = LANG_META.get(code, (code, None))
    flag = lookup_flag(country)
    return {
        "code": code,
        "name": name,
        "flag": flag or None,
        "country": country,
        "count": count,
        "percent": round((count / total) * 100, 2) if total else 0,
    }


def format_lang(code):
    row = lang_payload(code, 0, 1)
    if row["flag"]:
        return f"{row['flag']} {row['name']} ({code})"
    if row["country"]:
        return f"   {row['name']} ({code}) — {row['country']}"
    return f"   {row['name']} ({code})"


def clean_comment(text):
    get_model()
    cleaned = re.sub(r"^\s*@[\w.\-]+\s*", "", text)
    cleaned = emoji.replace_emoji(cleaned, replace="")
    if EMOJI_RE:
        cleaned = EMOJI_RE.sub("", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def detect_lang(text):
    cleaned = clean_comment(text)

    if not cleaned:
        return "EMOJI_OR_EMPTY", 1.0

    if not re.search(r"[a-zA-Z\u0080-\uffff]", cleaned):
        return "SYMBOLS_ONLY", 1.0

    labels, probs = get_model().predict(cleaned, k=1)
    if len(labels) == 0:
        return "UNCERTAIN_SHORT", 0.0
    lang = labels[0].replace("__label__", "")
    prob = float(probs[0])

    if prob < 0.60 and len(cleaned.split()) <= 2:
        return "UNCERTAIN_SHORT", prob

    return lang, prob


def get_comment_languages():
    get_model()
    lang_counts = Counter()
    total = 0
    for row in iter_comments():
        lang, _conf = detect_lang(row.get("text", ""))
        lang_counts[lang] += 1
        total += 1

    return {
        "total": total,
        "languages_found": len(lang_counts),
        "languages": [
            lang_payload(code, count, total)
            for code, count in lang_counts.most_common()
        ],
    }


if __name__ == "__main__":
    data = get_comment_languages()
    print(f"TOTAL ANALYZED: {data['total']:,}")
    print(f"LANGUAGES FOUND: {data['languages_found']:,}")
    for row in data["languages"]:
        print(f"{format_lang(row['code']):<42s} : {row['count']:7,} ({row['percent']:5.2f}%)")
