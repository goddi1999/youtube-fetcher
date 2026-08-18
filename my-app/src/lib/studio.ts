export type NeighborhoodId =
  | "studio"
  | "quiet"
  | "flood"
  | "voices"
  | "server"
  | "entry"

export type Selection =
  | { kind: "overview" }
  | { kind: "neighborhood"; id: NeighborhoodId }
  | { kind: "module"; id: string }

export type Neighborhood = {
  id: NeighborhoodId
  name: string
  gx: number
  gy: number
  gw: number
  gd: number
}

export type StudioModule = {
  id: string
  code: string
  name: string
  neighborhood: NeighborhoodId
  count: number
  gx: number
  gy: number
  gw: number
  gd: number
  hatch?: boolean
  slabs?: number
}

export type FlowDef = {
  id: string
  name: string
  payload: string
  moduleIds: string[]
}

export type InspectorDoc = {
  eyebrow: string
  title: string
  meta: string
  does: string
  highlight?: string
  built: string
  builtHighlight?: string
  source: string[]
  stack: string[]
  payload: string[]
  travelledBy: string[]
}

export type YearCount = {
  year: number
  comments: number
}

export type StudioStats = {
  totalRows: number
  uniqueChannels: number
  allDated: number
  unmapped: number
  byYear: YearCount[]
  repeaters: number
  commentedOnce: number
  commentsFromRepeaters: number
}

export const INITIAL_STATS: StudioStats = {
  totalRows: 620922,
  uniqueChannels: 502410,
  allDated: 620922,
  unmapped: 0,
  byYear: [
    { year: 2020, comments: 375 },
    { year: 2021, comments: 71 },
    { year: 2022, comments: 19 },
    { year: 2023, comments: 13 },
    { year: 2024, comments: 85744 },
    { year: 2025, comments: 309952 },
    { year: 2026, comments: 224748 },
  ],
  repeaters: 56997,
  commentedOnce: 445413,
  commentsFromRepeaters: 175509,
}

export const NEIGHBORHOODS: Neighborhood[] = [
  { id: "studio", name: "THE STUDIO", gx: 0, gy: 0, gw: 14, gd: 9 },
  { id: "quiet", name: "QUIET YEARS", gx: 16, gy: 0, gw: 18, gd: 9 },
  { id: "flood", name: "THE FLOOD", gx: 2, gy: 11, gw: 22, gd: 12 },
  { id: "voices", name: "VOICES", gx: 26, gy: 11, gw: 12, gd: 12 },
  { id: "server", name: "SERVER & DATA", gx: 36, gy: 0, gw: 14, gd: 10 },
  { id: "entry", name: "ENTRY & CONTROL", gx: 40, gy: 12, gw: 13, gd: 11 },
]

export const FLOWS: FlowDef[] = [
  {
    id: "all-dated",
    name: "ALL DATED",
    payload: "COMMENT ROW",
    moduleIds: ["cr", "y20", "y21", "y22", "y23", "y24", "y25", "y26"],
  },
  {
    id: "peak-year",
    name: "PEAK YEAR",
    payload: "YEAR COUNT",
    moduleIds: ["cr", "y24", "y25"],
  },
  {
    id: "repeat-voices",
    name: "REPEAT VOICES",
    payload: "CHANNEL",
    moduleIds: ["cr", "up", "rp"],
  },
  {
    id: "the-flood",
    name: "THE FLOOD",
    payload: "COMMENT ROW",
    moduleIds: ["y24", "y25", "y26"],
  },
  {
    id: "archive-read",
    name: "ARCHIVE READ",
    payload: "JSONL ROW",
    moduleIds: ["ap", "js", "ay", "y25"],
  },
]

export const SUPPORT_EDGES: [string, string][] = [
  ["vv", "cr"],
  ["js", "ay"],
  ["ay", "sm"],
  ["ap", "hc"],
  ["ap", "js"],
  ["up", "lc"],
]

export const RETRY_EDGES: [string, string][] = [["js", "lg"]]

const YEAR_LAYOUT: Record<number, Pick<StudioModule, "gx" | "gy" | "gw" | "gd">> = {
  2020: { gx: 17.5, gy: 2.2, gw: 3.2, gd: 4.4 },
  2021: { gx: 21.4, gy: 2.4, gw: 3.0, gd: 4.0 },
  2022: { gx: 25.2, gy: 2.6, gw: 2.8, gd: 3.6 },
  2023: { gx: 28.8, gy: 2.8, gw: 2.6, gd: 3.2 },
  2024: { gx: 3.4, gy: 13.4, gw: 5.4, gd: 7.0 },
  2025: { gx: 9.8, gy: 12.8, gw: 6.6, gd: 8.0 },
  2026: { gx: 17.2, gy: 13.2, gw: 5.8, gd: 7.4 },
}

export function buildModules(stats: StudioStats): StudioModule[] {
  const yearModules: StudioModule[] = stats.byYear.map((row) => {
    const layout = YEAR_LAYOUT[row.year] ?? {
      gx: 18,
      gy: 3,
      gw: 3,
      gd: 3,
    }
    const quiet = row.year <= 2023
    return {
      id: `y${String(row.year).slice(2)}`,
      code: String(row.year).slice(2),
      name: `YEAR ${row.year}`,
      neighborhood: quiet ? "quiet" : "flood",
      count: row.comments,
      hatch: row.comments >= 10_000,
      slabs: row.year === 2025 ? 3 : undefined,
      ...layout,
    }
  })

  return [
    {
      id: "vv",
      code: "VV",
      name: "VIDEO VESSEL",
      neighborhood: "studio",
      count: 1,
      gx: 1.8,
      gy: 2.2,
      gw: 4.2,
      gd: 4.6,
    },
    {
      id: "cr",
      code: "CR",
      name: "CORPUS ROOT",
      neighborhood: "studio",
      count: stats.totalRows,
      hatch: true,
      gx: 6.8,
      gy: 2.0,
      gw: 5.4,
      gd: 5.2,
    },
    ...yearModules,
    {
      id: "up",
      code: "UP",
      name: "UNIQUE PEOPLE",
      neighborhood: "voices",
      count: stats.uniqueChannels,
      hatch: true,
      gx: 27.2,
      gy: 13.0,
      gw: 5.2,
      gd: 5.2,
    },
    {
      id: "rp",
      code: "RP",
      name: "REPEAT VOICES",
      neighborhood: "voices",
      count: stats.repeaters,
      gx: 32.8,
      gy: 13.2,
      gw: 4.2,
      gd: 4.8,
    },
    {
      id: "lc",
      code: "LC",
      name: "LONGEST COMMENTS",
      neighborhood: "voices",
      count: 10,
      gx: 27.4,
      gy: 19.2,
      gw: 9.4,
      gd: 2.6,
    },
    {
      id: "js",
      code: "JS",
      name: "JSONL STORE",
      neighborhood: "server",
      count: 328,
      hatch: true,
      gx: 37.4,
      gy: 1.8,
      gw: 5.4,
      gd: 4.2,
    },
    {
      id: "ay",
      code: "AY",
      name: "YEAR INDEX",
      neighborhood: "server",
      count: stats.byYear.length,
      gx: 43.4,
      gy: 2.2,
      gw: 5.0,
      gd: 3.6,
    },
    {
      id: "lg",
      code: "LG",
      name: "LANGUAGE MODEL",
      neighborhood: "server",
      count: 176,
      gx: 38.0,
      gy: 6.6,
      gw: 10.0,
      gd: 2.4,
    },
    {
      id: "ap",
      code: "AP",
      name: "FLASK API",
      neighborhood: "entry",
      count: 10,
      gx: 41.0,
      gy: 13.6,
      gw: 5.4,
      gd: 4.2,
    },
    {
      id: "sm",
      code: "SM",
      name: "SUMMARY",
      neighborhood: "entry",
      count: 1,
      gx: 47.0,
      gy: 13.8,
      gw: 4.6,
      gd: 3.6,
    },
    {
      id: "hc",
      code: "HC",
      name: "HEALTH CHECK",
      neighborhood: "entry",
      count: 1,
      gx: 41.2,
      gy: 18.6,
      gw: 5.2,
      gd: 2.8,
    },
    {
      id: "ad",
      code: "AD",
      name: "DAY INDEX",
      neighborhood: "entry",
      count: 1,
      gx: 47.0,
      gy: 18.2,
      gw: 4.6,
      gd: 3.2,
    },
  ]
}

export const SIDEBAR_GROUPS: { label: string; neighborhood?: NeighborhoodId }[] = [
  { label: "FLOWS" },
  { label: "THE STUDIO", neighborhood: "studio" },
  { label: "QUIET YEARS", neighborhood: "quiet" },
  { label: "THE FLOOD", neighborhood: "flood" },
  { label: "VOICES", neighborhood: "voices" },
  { label: "SERVER & DATA", neighborhood: "server" },
  { label: "ENTRY & CONTROL", neighborhood: "entry" },
]

export function formatCount(value: number): string {
  return value.toLocaleString("en-US")
}

export function compactCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 10_000) return `${Math.round(value / 1000)}k`
  return formatCount(value)
}

export function yearOfModule(id: string): number | null {
  const match = /^y(\d{2})$/.exec(id)
  if (!match) return null
  return 2000 + Number(match[1])
}

export function selectionLabel(
  selection: Selection,
  modules: StudioModule[],
): string {
  if (selection.kind === "overview") return "THE STUDIO"
  if (selection.kind === "neighborhood") {
    return NEIGHBORHOODS.find((row) => row.id === selection.id)?.name ?? "THE STUDIO"
  }
  return modules.find((row) => row.id === selection.id)?.name ?? "THE STUDIO"
}

function flowsForModule(id: string): string[] {
  return FLOWS.filter((flow) => flow.moduleIds.includes(id)).map((flow) => flow.name)
}

export function inspectorFor(
  selection: Selection,
  stats: StudioStats,
  modules: StudioModule[],
): InspectorDoc {
  const peak = stats.byYear.reduce(
    (best, row) => (row.comments > best.comments ? row : best),
    stats.byYear[0] ?? { year: 2025, comments: 0 },
  )

  if (selection.kind === "overview") {
    return {
      eyebrow: "REPOSITORY MAP",
      title: "The Studio, mapped",
      meta: `${formatCount(stats.totalRows)} comments / ${formatCount(stats.uniqueChannels)} people`,
      does: "Telescope reads the comment corpus of YouTube's first video as a place. Neighbourhoods are eras and subsystems; block height is comment volume. The map is the archive, not a picture of it.",
      highlight: "the comment corpus of YouTube's first video",
      built: "Every dated row lives in a JSONL store and is indexed by year before it is extruded onto the isometric plane. Selection tints a ground plate and opens this panel on the same node.",
      builtHighlight: "indexed by year",
      source: [
        "api/data/jNQXAC9IVRw.jsonl",
        "api/get_comments_by_year.py",
        "api/app.py",
      ],
      stack: ["PYTHON 3.11", "FLASK", "JSONL", "VITE"],
      payload: ["COMMENT ROW", "YEAR COUNT"],
      travelledBy: ["ALL DATED", "ARCHIVE READ"],
    }
  }

  if (selection.kind === "neighborhood") {
    const neighborhood = NEIGHBORHOODS.find((row) => row.id === selection.id)
    const members = modules.filter((row) => row.neighborhood === selection.id)
    const total = members.reduce((sum, row) => sum + row.count, 0)
    const copy: Record<NeighborhoodId, Omit<InspectorDoc, "eyebrow" | "title" | "meta">> = {
      studio: {
        does: "The Studio is the identity of this archive: one video, one corpus, one ground plate. From here every flow starts, and every other neighbourhood is a reading of the same 620,922 rows.",
        highlight: "one video, one corpus, one ground plate",
        built: "The vessel is the watch id jNQXAC9IVRw. The corpus root is the JSONL file served by Flask and counted by the year index before it is drawn.",
        source: ["api/data/jNQXAC9IVRw.jsonl", "api/app.py"],
        stack: ["FLASK", "JSONL"],
        payload: ["COMMENT ROW"],
        travelledBy: ["ALL DATED", "ARCHIVE READ"],
      },
      quiet: {
        does: "Quiet years are the sparse early band of dated comments — hundreds, then dozens — before the archive tips into flood. They are still addressable modules; they are just short.",
        highlight: "before the archive tips into flood",
        built: "Relative YouTube timestamps resolve to calendar years. 2020–2023 contain 478 dated rows between them, so their prisms stay low against the 2025 ridge.",
        source: ["api/get_comments_by_year.py"],
        stack: ["PYTHON 3.11", "COUNTER"],
        payload: ["YEAR COUNT"],
        travelledBy: ["ALL DATED"],
      },
      flood: {
        does: "The Flood is where the corpus actually lives. 2024–2026 hold almost every dated comment, with 2025 as the peak ridge. Hatching marks volume the numerals cannot.",
        highlight: "2025 as the peak ridge",
        built: "Height is a compressed function of count so 13-comment years remain visible beside 309,952. Diagonal hatching is applied above 10,000 rows.",
        source: ["api/get_comments_by_year.py", "src/lib/iso.ts"],
        stack: ["SVG", "GSAP"],
        payload: ["COMMENT ROW", "YEAR COUNT"],
        travelledBy: ["THE FLOOD", "PEAK YEAR", "ALL DATED"],
      },
      voices: {
        does: "Voices counts people, not years. Most of the 502,410 channels commented once. Repeat voices and the longest comments are the two other instruments in this district.",
        highlight: "people, not years",
        built: "Repeaters are a channel histogram over the JSONL. Longest comments are a bounded heap of ten rows ranked by character length.",
        source: [
          "api/get_repeat_commenters.py",
          "api/get_longest_comments.py",
        ],
        stack: ["PYTHON 3.11", "HEAPQ"],
        payload: ["CHANNEL", "COMMENT TEXT"],
        travelledBy: ["REPEAT VOICES"],
      },
      server: {
        does: "Server & data is the store and the indexes: a 328 MB JSONL, a year rollup, and a FastText language model that is loaded only when asked.",
        highlight: "a 328 MB JSONL",
        built: "Flask caches year, summary and repeater payloads in process memory after the first hit. Language detection stays off the critical path because it loads lid.176.bin.",
        source: ["api/app.py", "api/paths.py", "api/data/jNQXAC9IVRw.jsonl"],
        stack: ["FLASK", "FASTTEXT", "JSONL"],
        payload: ["JSONL ROW"],
        travelledBy: ["ARCHIVE READ"],
      },
      entry: {
        does: "Entry & control is the HTTP surface. Ten named routes, a liveness check, and the summary and day indexes that other neighbourhoods read through.",
        highlight: "Ten named routes",
        built: "Vite proxies /api to Flask on 127.0.0.1:5000. CORS is open for local studio work. Nothing in the API writes back to the JSONL.",
        source: ["api/app.py", "my-app/vite.config.ts"],
        stack: ["FLASK", "VITE", "CORS"],
        payload: ["JSONL ROW"],
        travelledBy: ["ARCHIVE READ"],
      },
    }

    const doc = copy[selection.id]
    return {
      eyebrow: "NEIGHBOURHOOD",
      title: titleCase(neighborhood?.name ?? "District"),
      meta: `${members.length} modules / ${compactCount(total)} counted`,
      ...doc,
    }
  }

  const mod = modules.find((row) => row.id === selection.id)
  if (!mod) return inspectorFor({ kind: "overview" }, stats, modules)

  const year = yearOfModule(mod.id)
  if (year != null) {
    const comments = stats.byYear.find((row) => row.year === year)?.comments ?? mod.count
    const share = stats.allDated > 0 ? (comments / stats.allDated) * 100 : 0
    const shareLabel =
      share > 0 && share < 0.01 ? "<0.01%" : `${share.toFixed(2)}%`
    const isPeak = year === peak.year
    return {
      eyebrow: mod.neighborhood === "flood" ? "THE FLOOD" : "QUIET YEARS",
      title: `Year ${year}`,
      meta: `${formatCount(comments)} comments / ${shareLabel} of dated rows`,
      does: isPeak
        ? `Year ${year} is the peak of the archive: ${formatCount(comments)} dated comments, drawn as the tallest hatched ridge on the flood plate.`
        : `Year ${year} holds ${formatCount(comments)} dated comments — ${shareLabel} of the corpus. On the map, height is volume compressed so quiet years still read as buildings.`,
      highlight: isPeak ? "the tallest hatched ridge" : undefined,
      built: "published_approx is sliced to a four-digit year inside get_comments_by_year, then bound onto this module's count before extrusion.",
      builtHighlight: "sliced to a four-digit year",
      source: ["api/get_comments_by_year.py", "api/data/jNQXAC9IVRw.jsonl"],
      stack: ["PYTHON 3.11", "COUNTER", "FLASK"],
      payload: ["YEAR COUNT", "COMMENT ROW"],
      travelledBy: flowsForModule(mod.id),
    }
  }

  const docs: Record<string, InspectorDoc> = {
    vv: {
      eyebrow: "THE STUDIO",
      title: "Video vessel",
      meta: "jNQXAC9IVRw / Me at the zoo",
      does: "The vessel is YouTube's first video. The studio does not embed it; it addresses it. Every comment row in the JSONL points back to this watch id.",
      highlight: "The studio does not embed it",
      built: "VIDEO_ID is pinned in api/paths.py. The frontend never scrapes; it only reads analysis endpoints that iterate the local JSONL.",
      source: ["api/paths.py", "api/data/jNQXAC9IVRw.jsonl"],
      stack: ["PYTHON 3.11", "JSONL"],
      payload: ["VIDEO ID"],
      travelledBy: flowsForModule("vv"),
    },
    cr: {
      eyebrow: "THE STUDIO",
      title: "Corpus root",
      meta: `${formatCount(stats.totalRows)} comments / ~328 MB`,
      does: "Corpus root is the whole archive as one mass. 620,922 comments, 502,410 people, zero undated rows. This is the block every flow has to cross.",
      highlight: "zero undated rows",
      built: "iter_comments() streams the JSONL one object per line. Summary, year, repeater and longest endpoints all walk the same file and never write it.",
      builtHighlight: "never write it",
      source: ["api/paths.py", "api/get_comment_summary.py", "api/data/jNQXAC9IVRw.jsonl"],
      stack: ["JSONL", "FLASK"],
      payload: ["COMMENT ROW"],
      travelledBy: flowsForModule("cr"),
    },
    up: {
      eyebrow: "VOICES",
      title: "Unique people",
      meta: `${formatCount(stats.uniqueChannels)} channels`,
      does: "Unique people is a set of YouTube channel ids observed in the corpus. Most of them appear once. The block is hatched because the set is the second-largest number on the map.",
      highlight: "Most of them appear once",
      built: "get_repeat_commenters builds a Counter of channel keys while scanning the JSONL, then splits once versus two-or-more.",
      source: ["api/get_repeat_commenters.py"],
      stack: ["PYTHON 3.11", "COUNTER"],
      payload: ["CHANNEL"],
      travelledBy: flowsForModule("up"),
    },
    rp: {
      eyebrow: "VOICES",
      title: "Repeat voices",
      meta: `${formatCount(stats.repeaters)} people / ${formatCount(stats.commentsFromRepeaters)} comments`,
      does: "Repeat voices are the 56,997 people who came back. They wrote 175,509 comments. The histogram in the API goes from twice to one channel with 6,367 rows.",
      highlight: "who came back",
      built: "A channel histogram is filtered at times >= 2. The studio maps the people-count onto this prism; the long tail stays in the JSON.",
      source: ["api/get_repeat_commenters.py"],
      stack: ["PYTHON 3.11", "COUNTER"],
      payload: ["CHANNEL"],
      travelledBy: flowsForModule("rp"),
    },
    lc: {
      eyebrow: "VOICES",
      title: "Longest comments",
      meta: "Top 10 by character length",
      does: "Longest comments ranks the archive by raw character length, not votes. It is a bounded reading of the same JSONL: ten rows, heap-ordered, returned on demand.",
      highlight: "ten rows, heap-ordered",
      built: "get_longest_comments keeps a 10-item heapq of (length, row). The route accepts ?limit= and does not cache, so each request rescans.",
      source: ["api/get_longest_comments.py", "api/app.py"],
      stack: ["PYTHON 3.11", "HEAPQ"],
      payload: ["COMMENT TEXT"],
      travelledBy: flowsForModule("lc"),
    },
    js: {
      eyebrow: "SERVER & DATA",
      title: "JSONL store",
      meta: "327,970,051 bytes / 528 avg row",
      does: "The JSONL store is the database. One comment per line, read-only, gitignored. Every analysis endpoint iterates it. Nothing in the API appends, overwrites, or creates files.",
      highlight: "read-only, gitignored",
      built: "COMMENTS_PATH in api/paths.py points at api/data/jNQXAC9IVRw.jsonl. Vite never sees the file; Flask does.",
      source: ["api/paths.py", "api/data/jNQXAC9IVRw.jsonl"],
      stack: ["JSONL", "FLASK"],
      payload: ["JSONL ROW"],
      travelledBy: flowsForModule("js"),
    },
    ay: {
      eyebrow: "SERVER & DATA",
      title: "Year index",
      meta: `${stats.byYear.length} years / ${formatCount(stats.allDated)} dated`,
      does: "The year index rolls the corpus into seven calendar buckets from 2020 to 2026. Those buckets become modules, then prisms.",
      highlight: "seven calendar buckets",
      built: "A Counter keyed by published_approx[:4] fills missing years in the min–max range so the map never has holes.",
      source: ["api/get_comments_by_year.py"],
      stack: ["PYTHON 3.11", "COUNTER"],
      payload: ["YEAR COUNT"],
      travelledBy: flowsForModule("ay"),
    },
    lg: {
      eyebrow: "SERVER & DATA",
      title: "Language model",
      meta: "FastText lid.176.bin",
      does: "Language detection is the slow instrument. It loads Facebook FastText and scores every comment. The studio keeps it off the first paint; the dashed retry edge is the reminder that this path is optional.",
      highlight: "off the first paint",
      built: "GET /api/comments/languages is cached after the first hit. The model file is gitignored. Failure to load is a retry, not a second colour.",
      source: ["api/get_comment_languages.py", "api/lid.176.bin"],
      stack: ["FASTTEXT", "NUMPY", "EMOJI"],
      payload: ["LANG CODE"],
      travelledBy: [],
    },
    ap: {
      eyebrow: "ENTRY & CONTROL",
      title: "Flask API",
      meta: "10 routes / 127.0.0.1:5000",
      does: "Flask is the only door into the archive. The studio talks to it through a Vite proxy at /api. CORS is enabled so the instrument can run locally beside the map.",
      highlight: "the only door into the archive",
      built: "api/app.py registers health, comments, summary, by-year, by-day, longest, repeaters and languages. Cached keys live in a process dict.",
      source: ["api/app.py", "my-app/vite.config.ts"],
      stack: ["FLASK", "VITE", "CORS"],
      payload: ["JSONL ROW"],
      travelledBy: flowsForModule("ap"),
    },
    sm: {
      eyebrow: "ENTRY & CONTROL",
      title: "Summary",
      meta: `${formatCount(stats.totalRows)} entries / 0 bad lines`,
      does: "Summary is the first census: file size, row count, undated rows, and the first comment — San Diego Zoo, 4.6M votes, hearted.",
      highlight: "San Diego Zoo, 4.6M votes",
      built: "get_comment_summary walks the file once, records the first row, and reports rows_without_date. That value is the UNMAPPED metric.",
      source: ["api/get_comment_summary.py"],
      stack: ["PYTHON 3.11", "JSON"],
      payload: ["SUMMARY ROW"],
      travelledBy: flowsForModule("sm"),
    },
    hc: {
      eyebrow: "ENTRY & CONTROL",
      title: "Health check",
      meta: "GET /api/health",
      does: "Health check is a liveness pulse. It does not open the JSONL. If it fails, the map still draws from the last known census baked into the studio.",
      built: "A JSON { ok: true } on GET /api/health. The frontend uses it only as a status-bar signal.",
      source: ["api/app.py"],
      stack: ["FLASK"],
      payload: ["OK"],
      travelledBy: flowsForModule("hc"),
    },
    ad: {
      eyebrow: "ENTRY & CONTROL",
      title: "Day index",
      meta: "GET /api/comments/by-day",
      does: "Day index ranks calendar days by comment volume. It is on the map as a support building: available, not the default reading.",
      built: "get_comments_by_day aggregates published_approx dates and returns them sorted by count.",
      source: ["api/get_comments_by_day.py"],
      stack: ["PYTHON 3.11", "COUNTER"],
      payload: ["DAY COUNT"],
      travelledBy: [],
    },
  }

  return docs[mod.id] ?? inspectorFor({ kind: "overview" }, stats, modules)
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace("&", "&")
}
