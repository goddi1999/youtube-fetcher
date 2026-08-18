---
version: alpha
name: Telescope-Studio-design-analysis
description: "A near-white engineering instrument: a monospace chrome of labelled metric cells and hairline-divided lists wrapped around a single large isometric map of a codebase. The organizing tension is documentation warmth versus instrument coldness -- prose in a humanist sans states what things do, while everything structural (labels, counts, file paths, keyboard hints) is uppercase monospace. Colour is rationed to exactly one blue that means selected or live; all remaining depth comes from thin grey strokes, hatched block faces and axonometric geometry rather than shadow. The signature move is the isometric neighbourhood map, where selection tints a whole ground plate blue and the inspector panel switches between a What it does and How it's built reading of the same node."

colors:
  primary: "#1b6ef3"
  on-primary: "#ffffff"
  accent-soft: "#e8f1fe"
  highlight: "#d8e8fd"
  ink: "#15171a"
  ink-muted: "#5f6672"
  ink-subtle: "#9ba1ac"
  ink-disabled: "#c2c7cf"
  canvas: "#ffffff"
  surface-soft: "#f4f5f7"
  surface-chip: "#eef0f2"
  hairline: "#e4e6ea"
  hairline-strong: "#cfd3d9"
  grid-line: "#eceef1"
  block-face: "#fafbfc"
  block-edge: "#c8ccd2"
  success: "#1f9d5b"
  warning: "#c07d13"
  danger: "#d43c33"
  scrim: "rgba(21, 23, 26, 0.45)"

typography:
  display-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: 600
    lineHeight: 1.00
    letterSpacing: -0.90px
    fontFeature: kern
  headline:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.64px
    fontFeature: kern
  card-title:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.30
    letterSpacing: -0.17px
    fontFeature: kern
  body-lg:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.10px
    fontFeature: kern
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0px
    fontFeature: kern
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0px
    fontFeature: kern
  mono-eyebrow:
    fontFamily: IBM Plex Mono
    fontSize: 10px
    fontWeight: 500
    lineHeight: 1.20
    letterSpacing: 0.60px
    fontFeature: tnum
  mono-label:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: 0.18px
    fontFeature: tnum
  mono-value:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: 0.10px
    fontFeature: tnum
  mono-chip:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: 0.36px
    fontFeature: tnum
  mono-path:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.60
    letterSpacing: 0px
    fontFeature: tnum
  mono-hint:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.20
    letterSpacing: 0.36px
    fontFeature: tnum
  button:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.00
    letterSpacing: 0.48px
    fontFeature: tnum
  count:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.00
    letterSpacing: 0.09px
    fontFeature: tnum

rounded:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 10px
  xl: 14px
  pill: 50px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

components:
  topbar:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    borderWidth: 0 0 1px 0
    height: 72px
    padding: 0 {spacing.lg}
  topbar-metric-cell:
    labelTypography: "{typography.mono-eyebrow}"
    labelColor: "{colors.ink-subtle}"
    valueTypography: "{typography.mono-value}"
    valueColor: "{colors.ink}"
    dividerColor: "{colors.hairline}"
    padding: "{spacing.md} {spacing.lg}"
  button-primary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline-strong}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  button-disabled:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-disabled}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  button-icon:
    backgroundColor: "{colors.canvas}"
    iconColor: "{colors.ink-muted}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.md}"
    size: 40px
  segmented-control:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline-strong}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.mono-chip}"
    rounded: "{rounded.md}"
    padding: "{spacing.xxs} {spacing.xs}"
  segmented-control-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.mono-chip}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xxs} {spacing.xs}"
  tab-inspector:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-muted}"
    borderColor: "{colors.hairline}"
    typography: "{typography.card-title}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm} {spacing.lg}"
  tab-inspector-selected:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    borderColor: "{colors.primary}"
    typography: "{typography.card-title}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm} {spacing.lg}"
  sidebar:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    groupLabelTypography: "{typography.mono-eyebrow}"
    groupLabelColor: "{colors.ink-subtle}"
    width: 300px
    padding: "{spacing.lg} {spacing.md}"
  module-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.mono-label}"
    countTypography: "{typography.count}"
    countColor: "{colors.ink-subtle}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  module-row-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.primary}"
    badgeBackgroundColor: "{colors.accent-soft}"
    badgeTextColor: "{colors.primary}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  flow-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    metaColor: "{colors.ink-subtle}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.xs}"
    padding: "{spacing.sm} {spacing.xs}"
  flow-row-active:
    railColor: "{colors.primary}"
    railWidth: 2px
    textColor: "{colors.ink}"
    typography: "{typography.mono-label}"
    padding: "{spacing.sm} {spacing.xs}"
  chip-outline:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    borderColor: "{colors.primary}"
    typography: "{typography.mono-chip}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.sm}"
  chip-stack:
    backgroundColor: "{colors.surface-chip}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.mono-chip}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  chip-payload:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.primary}"
    typography: "{typography.mono-chip}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.sm}"
  inspector-panel:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    titleTypography: "{typography.headline}"
    eyebrowTypography: "{typography.mono-eyebrow}"
    metaTypography: "{typography.body-sm}"
    bodyTypography: "{typography.body-lg}"
    width: 470px
    padding: "{spacing.xl}"
  inspector-source-list:
    typography: "{typography.mono-path}"
    textColor: "{colors.ink-muted}"
    dividerColor: "{colors.hairline}"
    padding: "{spacing.md} 0"
  text-highlight:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.xs}"
    padding: 0 {spacing.xxs}
  map-canvas:
    backgroundColor: "{colors.canvas}"
    gridColor: "{colors.grid-line}"
    gridSize: 32px
    padding: "{spacing.section}"
  map-neighborhood-plate:
    borderColor: "{colors.hairline}"
    borderWidth: 1px
    labelTypography: "{typography.mono-eyebrow}"
    labelColor: "{colors.ink-muted}"
    labelBackgroundColor: "{colors.canvas}"
  map-neighborhood-plate-selected:
    backgroundColor: "{colors.accent-soft}"
    borderColor: "{colors.primary}"
    borderWidth: 2px
    labelTypography: "{typography.mono-eyebrow}"
    labelColor: "{colors.primary}"
  map-module-block:
    faceColor: "{colors.block-face}"
    edgeColor: "{colors.block-edge}"
    shadeColor: "{colors.grid-line}"
    tagTypography: "{typography.mono-eyebrow}"
    tagTextColor: "{colors.ink-muted}"
    tagBorderColor: "{colors.hairline-strong}"
    rounded: "{rounded.xs}"
  legend-bar:
    flowColor: "{colors.primary}"
    supportColor: "{colors.hairline-strong}"
    payloadColor: "{colors.primary}"
    typography: "{typography.mono-hint}"
    textColor: "{colors.ink-muted}"
    gap: "{spacing.lg}"
  status-bar:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    typography: "{typography.mono-hint}"
    textColor: "{colors.ink-subtle}"
    height: 44px
    padding: 0 {spacing.lg}
---

## Overview

Telescope Studio presents a codebase as a place. The product surface is a single full-bleed axonometric map on a near-white {colors.canvas}, framed on three sides by instrument chrome: a metric strip across the top, a scrolling module index down the left, and a documentation panel on the right. Nothing floats and nothing overlaps; every region is separated by a one-pixel {colors.hairline} rather than by elevation, so the whole screen reads as one continuous sheet that has been ruled into fields. The visual argument is that the map is not decoration but data -- so the frame around it behaves like the frame around a chart, not like the frame around a marketing page.

The system splits its voice between two typefaces with strictly separated jobs. Everything that is structural, addressable, or machine-derived is uppercase monospace: repository name and version, flow names, module names and their file counts, source paths, chip labels, keyboard hints. Everything that explains is set in a humanist sans at generous line height -- the panel headline and its two or three sentences of prose. This means hierarchy is carried by *voice* before it is carried by size: a 12px monospace label and a 32px sans headline are legible as different kinds of information even before you read them. The mixed-case sans appears only in the inspector and in the tab labels, which is why the inspector feels like a document while the rest feels like an instrument.

Colour is rationed almost to the point of austerity. There is exactly one hue -- {colors.primary} -- and it carries a single meaning: this is selected, live, or in the path of a flow. It appears as the tinted ground plate under the selected neighbourhood, the 2px border on the selected module row, the fill behind a selected zoom multiplier or inspector tab, the solid legend line for FLOW, the payload dot, the outlined TRAVELLED BY chips, and the inline {colors.highlight} band behind a phrase in prose. Everything not selected is greyscale: {colors.block-face} block tops, {colors.block-edge} strokes, hatched fills for high-volume modules, and a faint {colors.grid-line} ground grid that establishes the isometric plane. Because the palette holds nothing in reserve, saturation itself becomes the interaction feedback. The reading rhythm of the screen is: metric strip -> flow list -> module index -> isometric map -> legend -> status bar, with the inspector opening as a parallel column on the right.

**Key Characteristics:**

- One accent only: {colors.primary} means selected/live and is never used decoratively.
- Two-voice typography: uppercase monospace for structure, humanist sans for explanation.
- Depth is geometric, not atmospheric -- axonometric extrusion and hatching instead of shadow.
- Hairline separation everywhere; regions are ruled, not stacked.
- Metric cells state counts as label-over-value pairs, never as sentences.
- Radii stay small and functional ({rounded.md} for controls) with {rounded.pill} reserved for chips.
- Numbers are tabular and right-aligned so module counts form a readable column.
- Page rhythm: metric strip -> flow list -> module index -> isometric map -> legend -> status bar.

## Colors

> Source: sampled from the four attached screenshots -- the SYSTEM overview with the inspector open (screenshot 1), the API ROUTES selected-view state (screenshot 2), the cropped How-it's-built inspector for API routes (screenshot 3), and the ASSET EDITORS selected-view state (screenshot 4). All four are light mode.

### Brand & Accent

- **Primary** ({colors.primary}): the single accent. Sampled from the FLOW legend line, the payload dot, the 2px border of the selected module row and the TRAVELLED BY chip outlines. Used only for selection, liveness and flow membership.
- **On primary** ({colors.on-primary}): text and glyph colour for any element that ever fills solid with {colors.primary}; observed only in the payload dot's inner clearance, so it is used sparingly.
- **Accent soft** ({colors.accent-soft}): the tint fill behind the selected neighbourhood plate, the selected inspector tab, the selected zoom multiplier, and the PAYLOAD chips. It is the low-energy form of {colors.primary}.
- **Highlight** ({colors.highlight}): the inline band behind the phrase "H.264-encoded entirely in the browser" in the inspector prose. Slightly denser than {colors.accent-soft} so it survives being read over.

### Surface

- **Canvas** ({colors.canvas}): the map ground, the chrome, the sidebar and the inspector all share it. There is no second page background.
- **Surface soft** ({colors.surface-soft}): the faintly recessed field behind grouped chrome, used where a region needs to sit back without a border.
- **Surface chip** ({colors.surface-chip}): fill for the STACK chips (NEXT 16 ROUTE HANDLERS, ZOD V4, REACT 19), the only neutral filled component in the system.
- **Hairline** ({colors.hairline}): the default 1px rule -- topbar underline, metric-cell dividers, sidebar edge, inspector edge, source-list separators.
- **Hairline strong** ({colors.hairline-strong}): the slightly darker border used on interactive chrome (control buttons, segmented control, block tags) so controls read as pressable against plain rules.
- **Grid line** ({colors.grid-line}): the isometric ground grid and the shaded side faces of extruded blocks.
- **Block face** ({colors.block-face}): the top face of every module block on the map -- marginally off {colors.canvas} so blocks separate from the ground.
- **Block edge** ({colors.block-edge}): the vector outline of every block and plate on the map.

### Text

- **Ink** ({colors.ink}): the wordmark, inspector headlines, metric values, and module row labels.
- **Ink muted** ({colors.ink-muted}): inspector prose secondary lines, source paths, STACK chip text, neighbourhood labels on the map.
- **Ink subtle** ({colors.ink-subtle}): metric-cell eyebrows, sidebar group labels, module counts, status-bar hints.
- **Ink disabled** ({colors.ink-disabled}): RESUME FLOW and TRACE ONE STEP when no flow is playing -- the only disabled treatment visible.

### Semantic

- **Success** ({colors.success}): not observed in any screenshot; reserved for a passing test or completed flow state.
- **Warning** ({colors.warning}): not observed; reserved for the UNMAPPED metric when its value is non-zero, which is the one place the UI implies a fault state.
- **Danger** ({colors.danger}): not observed; reserved for the RETRY edge type, currently drawn as a dashed {colors.hairline-strong} line.
- **Scrim** ({colors.scrim}): not observed; inferred for any future modal over {components.map-canvas}. All four semantic entries are inferences and are listed in Known Gaps.

## Typography

### Font Family

- **Inter** (fallback: `Inter, "Helvetica Neue", Arial, sans-serif`) -- the explanatory voice. Carries {typography.display-lg} for the Telescope wordmark, {typography.headline} for inspector titles, {typography.card-title} for tab labels, and {typography.body-lg} / {typography.body} / {typography.body-sm} for prose and meta lines. Optical character of the wordmark is tighter and more geometric than default Inter, so a display cut or a -3% tracking adjustment is required to match.
- **IBM Plex Mono** (fallback: `"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace`) -- the structural voice, and the confirmed face for this system rather than an approximation. Designed by Mike Abbink and Bold Monday for IBM, licensed under the SIL Open Font License 1.1, and available from Google Fonts at `https://fonts.google.com/specimen/IBM+Plex+Mono`. Carries {typography.mono-eyebrow}, {typography.mono-label}, {typography.mono-value}, {typography.mono-chip}, {typography.mono-path}, {typography.mono-hint}, {typography.button} and {typography.count}. Always uppercase except in file paths and the repository slug. Use weight 400 for reading roles and 500 for labelling roles; the family also ships 100-700 plus matching italics, none of which this system uses.

**Loading (required for generated HTML):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Request only the 400 and 500 weights unless a new role needs another cut; the full 100-700 italic axis is roughly seven times the payload for glyphs this system never sets.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| {typography.display-lg} | 30px | 600 | 1.00 | -0.90px | Telescope wordmark in the top-left cell |
| {typography.headline} | 32px | 500 | 1.15 | -0.64px | Inspector titles: "The Studio, mapped", "API routes", "Asset editors x9" |
| {typography.card-title} | 17px | 600 | 1.30 | -0.17px | Inspector tab labels "What it does" / "How it's built" |
| {typography.body-lg} | 17px | 400 | 1.55 | -0.10px | Primary inspector prose paragraph |
| {typography.body} | 16px | 400 | 1.55 | 0px | Secondary prose and the map's descriptive sentence |
| {typography.body-sm} | 14px | 400 | 1.45 | 0px | Meta line "10 files / ~822 lines" |
| {typography.mono-eyebrow} | 10px | 500 | 1.20 | 0.60px | Metric labels (REPOSITORY, FLOWS, MODULES), section labels (SOURCE, STACK, PAYLOAD), sidebar group labels, map block tags |
| {typography.mono-label} | 12px | 400 | 1.30 | 0.18px | Module and flow row names in the sidebar |
| {typography.mono-value} | 13px | 500 | 1.25 | 0.10px | Metric values (telescope-studio / v0.1.0, 5 LIVE, API ROUTES) |
| {typography.mono-chip} | 11px | 500 | 1.10 | 0.36px | All chips and the zoom multipliers |
| {typography.mono-path} | 12px | 400 | 1.60 | 0px | Source file path lists in the inspector |
| {typography.mono-hint} | 11px | 400 | 1.20 | 0.36px | Bottom status-bar keyboard hints and legend labels |
| {typography.button} | 12px | 500 | 1.00 | 0.48px | FLOW: NONE, RESUME FLOW, TRACE ONE STEP |
| {typography.count} | 12px | 400 | 1.00 | 0.09px | Right-aligned module file counts |

### Principles

- **Voice before size.** Structure is monospace and uppercase; explanation is sans and mixed case. A reader can classify any string by face alone, which lets the type sizes stay in a very narrow 10-32px range.
- **Tracking is inversely scaled.** {typography.headline} and {typography.display-lg} carry negative tracking; every monospace role carries positive tracking. Small uppercase gains air, large sans gains density.
- **Mono tracking is set for Plex's advance width.** IBM Plex Mono has a wider fixed pitch than a narrow coding mono, so every mono role's letter spacing is held about 25% below what a narrow face would need -- {typography.mono-eyebrow} at 0.60px rather than 0.80px. Adding tracking on top of Plex's own spacing is the fastest way to make the chrome look loose.
- **One prose size step per panel.** The inspector moves {typography.mono-eyebrow} -> {typography.headline} -> {typography.body-sm} -> {typography.body-lg} and then stops. There is no third prose weight and no italic anywhere.
- **Numerals are always tabular.** {typography.count} and {typography.mono-value} declare `tnum`. IBM Plex Mono is already fixed-pitch so the feature is a no-op there; it is kept as a safeguard for the moment a numeral falls back to the sans face.
- **Uppercase never exceeds 13px.** Anything uppercase is a label; if a string needs to be larger than {typography.mono-value}, it becomes sans and mixed case instead.

### Note on Font Substitutes

- If Inter is unavailable, use **Public Sans** or **Figtree** for prose; both need tracking pulled a further -0.5% at {typography.headline} to match the observed density.
- If the wordmark face cannot be reproduced, set **Inter Tight** at weight 600 with -3% tracking; the observed wordmark is noticeably narrower than Inter's default proportions.
- The mono face needs no substitute: **IBM Plex Mono** is itself open source (OFL 1.1) and self-hostable, so pin it and do not fall back to a system mono in production.
- If Plex Mono must be replaced anyway, **JetBrains Mono** is the closest skeleton but is narrower -- restore {typography.mono-eyebrow} to 0.80px and scale the other mono roles up proportionally. **Space Mono** is acceptable only at {typography.mono-hint} sizes; it is too idiosyncratic for {typography.mono-value}.
- Do not substitute a slab or typewriter mono. Plex Mono has a neutral grotesque skeleton, and a typewriter face reads as retro rather than instrumental.
- Never let a mono role render in the sans fallback. Losing the fixed pitch collapses the count column in {components.module-row} and the metric strip alignment in {components.topbar-metric-cell}.

## Layout

### Spacing System

The base unit is **4px**, with an 8px working rhythm. Observed scale: {spacing.xxs} / {spacing.xs} / {spacing.sm} / {spacing.md} / {spacing.lg} / {spacing.xl} / {spacing.xxl} / {spacing.section}.

- Chrome cells: {components.topbar-metric-cell} pads {spacing.md} vertically and {spacing.lg} horizontally, which sets the 72px {components.topbar} height.
- Sidebar rows: {components.module-row} pads a uniform {spacing.md}, with {spacing.xs} between rows and {spacing.lg} above each group label.
- Inspector: {components.inspector-panel} pads {spacing.xl} on all sides; blocks inside it are separated by {spacing.lg}, and labelled sections (SOURCE, STACK, PAYLOAD) by {spacing.xxl}.
- Chips: {components.chip-stack} and {components.chip-payload} pad {spacing.xs} / {spacing.sm} with {spacing.xs} gaps, wrapping rather than truncating.
- Map: {components.map-canvas} keeps at least {spacing.section} of clear ground between the outermost plate and any chrome edge.
- Controls: {components.button-primary} pads {spacing.sm} / {spacing.md}; {components.button-icon} is a fixed 40px square with {spacing.xs} between stacked zoom buttons.

### Grid & Container

The layout is a three-column application shell, not a centred content container. Left {components.sidebar} is a fixed 300px; right {components.inspector-panel} is a fixed 470px; the map takes all remaining width and is never max-width constrained -- it is a viewport onto a larger scene, so it grows with the window. The top {components.topbar} spans full width and is subdivided into seven hairline-separated metric cells plus a right-aligned control cluster. The bottom {components.status-bar} spans full width beneath both the sidebar and the map but not the inspector. Inside the inspector, content is a single 406px text column (470px minus {spacing.xl} on each side); nothing inside it is multi-column.

### Whitespace Philosophy

Whitespace is doing measurement, not breathing. Around the map it functions as scale headroom: the empty ground plane tells you the scene is larger than the frame and that panning is expected, so the composition is deliberately off-centre with unequal margins. Inside the chrome, whitespace is uniform and tight -- every cell has the same padding so that differences in content length, not spacing, are what your eye compares. The inspector inverts this: it is the only region with generous vertical rhythm, using {spacing.xxl} gaps to separate labelled sections and 1.55 line height on prose, which is what makes it read as documentation embedded in an instrument.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 | Flat {colors.canvas}, no border | Map ground, base chrome fields |
| 1 | 1px {colors.hairline} rule or full border | Region separation: {components.topbar}, {components.sidebar}, {components.inspector-panel}, {components.status-bar} |
| 2 | 1px {colors.hairline-strong} border, {rounded.md} | Interactive chrome: {components.button-primary}, {components.button-icon}, {components.segmented-control}, {components.module-row} |
| 3 | 2px {colors.primary} border plus {colors.accent-soft} fill | Selected state only: {components.module-row-selected}, {components.tab-inspector-selected}, {components.map-neighborhood-plate-selected} |

This brand does not use shadow. No screenshot contains a blur, a soft edge, or an offset dark region -- even the extruded blocks on the map cast no shadow onto the ground grid, which is unusual for an axonometric illustration and is clearly a deliberate constraint. Elevation is therefore encoded entirely as border weight and colour saturation: the more selected something is, the darker and thicker its outline, ending at level 3 where the accent takes over. Because there is no shadow vocabulary, adding one would immediately read as a foreign element rather than as an intensity increase.

### Decorative Depth

Depth comes from four non-shadow devices. First, **axonometric extrusion**: every module is a block with a {colors.block-face} top and {colors.grid-line} side faces, so height itself encodes file volume. Second, **hatching**: high-count modules (UI KIT at 49, DESIGN REFERENCE at 54, TEST SUITE at 46) are drawn with diagonal line fills rather than flat faces, so density reads as mass. Third, **repetition as stacking**: {components.map-module-block} is drawn as nine parallel thin slabs for ASSET EDITORS x9, turning cardinality into a visible ridge. Fourth, **the ground grid**: {colors.grid-line} at a 32px isometric pitch is the only thing establishing the plane, so it must remain visible or the blocks lose their footing.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| {rounded.xs} | 2px | Map block corners, {components.flow-row}, inline {components.text-highlight} |
| {rounded.sm} | 4px | {components.segmented-control-selected}, {components.chip-stack}, {components.chip-payload} |
| {rounded.md} | 8px | Default control radius: {components.button-primary}, {components.button-disabled}, {components.button-icon}, {components.module-row} |
| {rounded.lg} | 10px | {components.tab-inspector} and its selected state |
| {rounded.xl} | 14px | Outer application frame corners |
| {rounded.pill} | 50px | {components.chip-outline} only -- the TRAVELLED BY flow chips |
| {rounded.full} | 9999px | The payload dot in {components.legend-bar} |

The scale is deliberately compressed: five of the seven values sit between 2px and 10px. Roundness is not an expressive axis here, it is just enough to keep 1px borders from looking like table cells. The one exception is {rounded.pill}, which is used to mark chips that are *navigational* (flows you can jump to) as opposed to chips that are *informational* ({components.chip-stack}, {components.chip-payload}), giving shape a semantic job.

### Photography & Illustration Geometry

There is no photography anywhere in the system. All imagery is a single vector isometric scene projected at roughly a 30-degree axonometric angle with no perspective convergence, drawn at 1px stroke weight in {colors.block-edge}. Buildings are rectangular prisms only -- no cylinders, no bevels, no rounded volumes beyond {rounded.xs} corner softening. Neighbourhoods are flat quadrilateral plates outlined in {colors.hairline} with a small label tag anchored at the upper-left corner by a short leader line. Edges between modules are drawn as three distinct line types (solid {colors.primary} for FLOW, solid {colors.hairline-strong} for SUPPORT, dashed for RETRY) and carry a {rounded.full} payload dot when animated. Any new illustration must join this projection and this stroke weight; a second illustration style would break the claim that the map is generated from the code.

## Components

### Buttons

**`button-primary`** -- The default chrome control, seen as FLOW: NONE in the top-right cluster; outlined rather than filled, because a solid fill would introduce a second use of {colors.primary}.

- Background {colors.canvas}, text {colors.ink}, border 1px {colors.hairline-strong}
- Typography {typography.button}, uppercase, radius {rounded.md}
- Padding {spacing.sm} / {spacing.md}, sibling gap {spacing.xs}

**`button-disabled`** -- RESUME FLOW and TRACE ONE STEP in their no-flow-selected state, distinguished only by text and border lightening.

- Background {colors.canvas}, text {colors.ink-disabled}, border 1px {colors.hairline}
- Typography {typography.button}, radius {rounded.md}, padding {spacing.sm} / {spacing.md}
- No opacity change and no strike-through; the contrast drop is the whole signal

**`button-icon`** -- The square utility controls at the map's lower-right: recentre, zoom in, zoom out, and the panel close X.

- Fixed 40px square, background {colors.canvas}, border 1px {colors.hairline}
- Glyph {colors.ink-muted} at 1.5px stroke, radius {rounded.md}
- Stacked vertically with {spacing.xs} gaps, offset {spacing.lg} from the canvas edge

**`segmented-control`** / **`segmented-control-selected`** -- The 0.5x / 1x / 2x speed control and the light/dark/target icon cluster in the top bar.

- Track: background {colors.canvas}, border 1px {colors.hairline-strong}, radius {rounded.md}, padding {spacing.xxs} / {spacing.xs}
- Inactive segment: text {colors.ink-muted}, typography {typography.mono-chip}
- Selected segment: fill {colors.accent-soft}, text {colors.primary}, radius {rounded.sm}

### Inputs & Forms

No text inputs, selects, checkboxes or form fields appear in any screenshot. The interface is entirely selection-driven: the sidebar rows, the inspector tabs and the segmented controls together replace what would otherwise be form controls. The nearest analogue to an input is {components.segmented-control}, which should be the template for any future radio-style control, and {components.module-row} for any future list-select. Anything requiring free text entry has no precedent here -- see Known Gaps.

### Cards & Containers

**`inspector-panel`** -- The right-hand documentation column, present in three of four screenshots; it holds an eyebrow, a headline, an optional meta line, prose, and labelled metadata sections.

- Fixed 470px width, background {colors.canvas}, left border 1px {colors.hairline}, padding {spacing.xl}
- Eyebrow {typography.mono-eyebrow} in {colors.ink-subtle}; title {typography.headline} in {colors.ink}
- Meta line {typography.body-sm} and prose {typography.body-lg}, both in {colors.ink-muted} to {colors.ink}
- Sections separated by {spacing.xxl}; internal blocks by {spacing.lg}

**`inspector-source-list`** -- The SOURCE block listing real repository paths, which is what grounds the map in the codebase.

- Typography {typography.mono-path}, colour {colors.ink-muted}, no truncation and no links
- Preceded by a {typography.mono-eyebrow} label and a full-width 1px {colors.hairline} rule
- Vertical padding {spacing.md} on {components.inspector-source-list}, one path per line, never wrapped mid-path

**`chip-outline`** -- The TRAVELLED BY chips (EXPORT, CREATE, EDIT & AUTOSAVE, MEDIA IN) that name which flows pass through the selected module.

- Background {colors.canvas}, text and 1px border {colors.primary}, radius {rounded.pill}
- Typography {typography.mono-chip} uppercase, padding {spacing.xs} / {spacing.sm}, gap {spacing.xs}

**`chip-stack`** -- The STACK chips (NEXT 16 ROUTE HANDLERS, ZOD V4, @VERCEL/BLOB, REACT 19, @DND-KIT/REACT) naming implementation dependencies.

- Fill {colors.surface-chip}, text {colors.ink-muted}, no border, radius {rounded.sm}
- Typography {typography.mono-chip}, padding {spacing.xs} / {spacing.sm}

**`chip-payload`** -- The PAYLOAD chips (ASSET ROW, CONFIG PATCH, ASSET CONFIG) naming the data that travels through the module.

- Fill {colors.accent-soft}, text {colors.primary}, radius {rounded.sm}
- Typography {typography.mono-chip}, padding {spacing.xs} / {spacing.sm}

**`text-highlight`** -- The inline band behind a key technical phrase inside inspector prose, used at most once per paragraph.

- Fill {colors.highlight}, text stays {colors.ink}, radius {rounded.xs}
- Typography inherits {typography.body-lg}, horizontal padding {spacing.xxs}

### Navigation

**`topbar`** -- The full-width instrument strip that identifies the repository and reports scene state.

- Height 72px, background {colors.canvas}, bottom border 1px {colors.hairline}, horizontal padding {spacing.lg}
- Left: wordmark in {typography.display-lg} plus a STUDIO tag in {typography.mono-eyebrow}
- Centre: metric cells; right: {components.button-primary}, {components.button-disabled}, {components.segmented-control}

**`topbar-metric-cell`** -- The repeating label-over-value unit (REPOSITORY, FLOWS, MODULES, PAYLOAD LANES, UNMAPPED, SELECTED VIEW).

- Label {typography.mono-eyebrow} in {colors.ink-subtle} above value {typography.mono-value} in {colors.ink}
- Padding {spacing.md} / {spacing.lg}, separated by full-height 1px {colors.hairline} dividers
- Values are literal counts or slugs, never sentences; SELECTED VIEW truncates with an ellipsis

**`sidebar`** -- The left index of flows and modules, grouped by neighbourhood.

- Fixed 300px, background {colors.canvas}, right border 1px {colors.hairline}, padding {spacing.lg} / {spacing.md}
- Group labels in {typography.mono-eyebrow} / {colors.ink-subtle} with {spacing.lg} of space above
- Scrolls independently of the map; group order mirrors the map's neighbourhood layout

**`module-row`** / **`module-row-selected`** -- The addressable module entries (AC ASSET-TYPE CORE 10, PL RENDERING PIPELINE 21) with a two-letter code, a name and a file count.

- Row: background {colors.canvas}, border 1px {colors.hairline}, radius {rounded.md}, padding {spacing.md}
- Name {typography.mono-label} in {colors.ink}; count {typography.count} in {colors.ink-subtle}, right-aligned
- Selected: border 2px {colors.primary}, code badge fills {colors.accent-soft} with {colors.primary} text

**`flow-row`** / **`flow-row-active`** -- The five named flows at the top of the sidebar, each showing a play triangle, a name and its payload type.

- Row: radius {rounded.xs}, padding {spacing.sm} / {spacing.xs}, name {typography.mono-label} in {colors.ink}
- Payload meta right-aligned in {colors.ink-subtle}, truncated with an ellipsis
- Active: {components.flow-row-active} adds a 2px {colors.primary} rail on the left edge with no fill change -- flows are marked, not selected

**`tab-inspector`** / **`tab-inspector-selected`** -- The two-way toggle between the What it does and How it's built readings of the same node.

- Both tabs: radius {rounded.lg}, typography {typography.card-title}, padding {spacing.sm} / {spacing.lg}, equal width
- Inactive: background {colors.canvas}, text {colors.ink-muted}, border 1px {colors.hairline}
- Selected: fill {colors.accent-soft}, border 1px {colors.primary}, text {colors.ink}
- Sits above a full-width 1px {colors.hairline} that separates the toggle from panel content

### Footer

**`status-bar`** -- The bottom instruction rail, functioning as this product's footer; it lists keyboard affordances instead of links.

- Height 44px, background {colors.canvas}, top border 1px {colors.hairline}, padding {spacing.lg}
- Typography {typography.mono-hint} in {colors.ink-subtle}, uppercase, items separated by a middle dot
- Content is instructional only (CHOOSE A FLOW, SPACE PLAYS, DRAG TO PAN, ESC CLEARS) -- no branding, legal or navigation

**`legend-bar`** -- The edge-type key sitting immediately above {components.status-bar} at the map's lower-left.

- FLOW: 2px solid {colors.primary}; SUPPORT: 1px solid {colors.hairline-strong}; RETRY: 1px dashed {colors.hairline-strong}
- PAYLOAD: {rounded.full} dot in {colors.primary} at 8px
- Labels {typography.mono-hint} in {colors.ink-muted}, items spaced {spacing.lg} apart

### Signature Component: The Isometric Repository Map

**`map-canvas`** -- The full-bleed axonometric scene that is the product; it is the thing you would recognise with the logo removed.

- Background {colors.canvas} with a {colors.grid-line} isometric grid at a 32px pitch
- Minimum {spacing.section} clear ground between the outermost plate and any chrome
- Never centred perfectly and never scaled to fit -- the scene extends past the frame to imply panning
- Contains only {components.map-neighborhood-plate} and {components.map-module-block} elements plus edge lines from {components.legend-bar}

**`map-neighborhood-plate`** / **`map-neighborhood-plate-selected`** -- The flat ground quads that group modules into named districts (THE STUDIO, SERVER & DATA, THE PIXEL PIPELINE, FOUNDATION, OUTSIDE WORLD, ENTRY & CONTROL).

- Default: 1px {colors.hairline} outline, no fill, label in {typography.mono-eyebrow} / {colors.ink-muted} on a {colors.canvas} tag anchored by a leader line
- Selected: {colors.accent-soft} fill, 2px {colors.primary} outline, label switches to {colors.primary}
- Only one plate is tinted at a time, and the tint is what synchronises the map with {components.topbar-metric-cell} SELECTED VIEW

**`map-module-block`** -- The extruded prism representing a single module, sized by file count and labelled with a two-letter code.

- Top face {colors.block-face}, side faces {colors.grid-line}, 1px {colors.block-edge} outline, corners {rounded.xs}
- Code tag in {typography.mono-eyebrow} / {colors.ink-muted} on a {colors.canvas} chip with a 1px {colors.hairline-strong} border
- Height and footprint scale with the module's line count; high-count modules use diagonal hatching instead of a flat face
- Cardinality is drawn literally -- nine parallel slabs for ASSET EDITORS x9 -- rather than shown as a number badge

## Do's and Don'ts

### Do

- Keep {colors.primary} exclusive to selection, liveness and flow membership; if two things are blue, they must be part of the same selection.
- Set every label, count, path and keyboard hint in a monospace role and every explanatory sentence in a sans role.
- Express quantity geometrically first -- block height, hatch density, repeated slabs -- and only then as a numeral in {typography.count}.
- Separate regions with a single 1px {colors.hairline} and let the shared {colors.canvas} run underneath.
- Right-align all counts so the sidebar produces one readable numeric column.
- Use {rounded.pill} only for navigational chips and {rounded.sm} for informational ones, keeping shape meaningful.
- Leave the ground grid visible at every zoom level; it is what makes the projection legible.
- Pair every selected plate on the map with a matching SELECTED VIEW value in the metric strip.

### Don't

- Don't fill {components.button-primary} solid blue -- outlined chrome plus one accent meaning is the whole colour logic.
- Don't add drop shadows to {components.map-module-block} or the panels; this system has no shadow vocabulary and one shadow makes the map look like a stock illustration.
- Don't set module names, counts or file paths in the sans face; losing the monospace column destroys the instrument reading.
- Don't introduce a second accent hue for RETRY or UNMAPPED -- use the dashed line and {colors.ink-disabled} treatments already in the system.
- Don't round {components.module-row} beyond {rounded.md}; larger radii turn the index into cards and imply they are draggable objects.
- Don't centre or fit-to-frame the map; a perfectly framed scene removes the signal that there is more to pan to.
- Don't upper-case anything above 13px, and don't set the inspector headline in uppercase mono.
- Don't use {colors.highlight} more than once per paragraph; it marks the single load-bearing phrase, not general emphasis.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Compact | < 768px | Both side panels leave the layout; the map is full-bleed with {components.button-icon} controls only; metric strip reduces to REPOSITORY plus SELECTED VIEW |
| Medium | 768-1279px | {components.sidebar} collapses to a toggled overlay at 300px; {components.inspector-panel} becomes a bottom sheet at ~55% viewport height; metric cells wrap to two rows |
| Wide | 1280-1919px | Full three-column shell; {components.sidebar} 300px, {components.inspector-panel} 470px; metric strip may drop the PAYLOAD LANES cell |
| Ultra | >= 1920px | Observed state -- all seven metric cells, both panels pinned, map takes all remaining width with no max-width cap |

### Touch Targets

{components.button-icon} is already 40px square and satisfies a 44px target with {spacing.xxs} of surrounding clearance. {components.module-row} at {spacing.md} padding yields roughly a 48px row and needs no change. The two elements that fail on touch are the {components.segmented-control} segments (~24px tall) and the {components.flow-row} play triangle, both of which must grow to at least 44px on Compact and Medium by increasing padding to {spacing.sm}, never by increasing {typography.mono-chip}.

### Collapsing Strategy

Collapse in priority order: metric cells first (right to left, keeping REPOSITORY and SELECTED VIEW), then {components.inspector-panel} to a sheet, then {components.sidebar} to an overlay, then {components.status-bar} hints to a single line. The map is never collapsed -- it is the content. {components.legend-bar} moves inside the map's lower-left with a {colors.canvas} backing when the status bar shortens, and {components.chip-outline} groups wrap to multiple lines rather than horizontally scrolling.

### Image Behavior

The isometric scene is vector and scales without raster artefacts, but its 1px {colors.block-edge} strokes and the {colors.grid-line} grid must remain 1px in device pixels rather than scaling with zoom, or the drawing thickens into mush at 2x. Below Medium, reduce scene complexity instead of scale: hide {components.map-module-block} code tags and neighbourhood labels for plates that are not selected, keeping the selected plate's labels visible. The grid pitch stays at 32px across all breakpoints so the projection angle never appears to change.

## Iteration Guide

1. Add new colours only as role tokens under {colors.canvas}-adjacent surfaces or {colors.ink} text steps; do not add a second chromatic hue beside {colors.primary} without also defining what state it means.
2. When a new control appears, clone {components.button-primary} and change only border colour and text colour -- radius stays {rounded.md} and typography stays {typography.button}.
3. When adding a selected state for any component, always express it as the level-3 pattern: 2px {colors.primary} border plus {colors.accent-soft} fill, registered as its own `-selected` entry rather than described in prose.
4. If a new type size is required, add it as a role in the existing 10-32px range and assign it to one face only; do not introduce a third font family.
5. Replace the inferred {colors.success}, {colors.warning}, {colors.danger} and {colors.scrim} values with sampled hexes as soon as a screenshot showing a fault, pass or modal state exists, and move the corresponding Known Gaps bullet out.
6. Any new map element must declare `faceColor`, `edgeColor` and a {typography.mono-eyebrow} tag so it inherits the projection contract of {components.map-module-block}.
7. Keep {spacing.section} as the map's breathing room even if chrome padding is retuned; shrinking it is what would make the scene feel cropped rather than pannable.

## Known Gaps

- **Semantic colours are invented, not sampled.** No screenshot shows an error, warning, success or empty-fault state -- UNMAPPED reads NONE in all four images -- so {colors.success}, {colors.warning} and {colors.danger} are inferences chosen to sit at similar lightness to {colors.primary}. {colors.scrim} is likewise inferred, since no modal or overlay appears.
- **Dark mode is undocumented despite being visible in the UI.** The top bar contains a sun and moon toggle, so a dark theme exists, but all four screenshots are light. No dark surface, ink or grid values are recorded and none should be guessed.
- **All pixel values are ratio-derived, not measured.** Sizes were anchored on inspector prose assumed to be 17px and a 72px top bar, then scaled; the screenshots appear to be at 2x device pixel ratio at differing crop scales, so type sizes may be off by roughly one step and the 300px / 470px panel widths by up to 10%.
- **Only half the type stack is confirmed.** The mono face is specified rather than inferred: IBM Plex Mono, weights 400 and 500. The prose face is still Inter-like but unverified, and the wordmark is narrower than default Inter, which suggests a display cut or a different family entirely. Mono letter-spacing values were also retuned for Plex's advance width by ratio, not by measurement against a rendered specimen.
- **Interaction and form vocabulary is missing.** No hover, focus, pressed, animation or transition state can be observed from stills, and the {components.legend-bar} payload dot implies motion that is not documented. There are also no text inputs, dropdowns, tooltips, empty states or error panels anywhere in the four images, so {components.segmented-control} and {components.module-row} are the only available templates for future form work.
- **Contrast risk at the smallest labels.** {colors.ink-subtle} on {colors.canvas} is borderline for WCAG AA at {typography.mono-eyebrow} and {typography.mono-hint} sizes, and {colors.ink-disabled} on {colors.canvas} clearly fails. The sampled hexes are reported as observed rather than corrected; darkening {colors.ink-subtle} would be the minimal fix.
