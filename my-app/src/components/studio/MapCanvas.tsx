import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { Crosshair, Minus, Plus } from "lucide-react"
import { gsap, useGSAP } from "@/lib/gsap"
import {
  blockTopCenter,
  heightFromCount,
  pathThrough,
  plateLabelAnchor,
  platePoly,
  poly,
  prismFaces,
  project,
} from "@/lib/iso"
import type { FlowDef, Neighborhood, Selection, StudioModule } from "@/lib/studio"
import { LegendBar } from "@/components/studio/StatusBar"
import { cn } from "@/lib/utils"

const INITIAL_PAN = { x: 520, y: 28 }
const INITIAL_ZOOM = 0.92
const MIN_ZOOM = 0.45
const MAX_ZOOM = 2

type MapCanvasProps = {
  neighborhoods: Neighborhood[]
  modules: StudioModule[]
  flows: FlowDef[]
  supportEdges: [string, string][]
  retryEdges: [string, string][]
  selection: Selection
  activeFlowId: string | null
  playing: boolean
  speed: 0.5 | 1 | 2
  traceTick: number
  onSelect: (selection: Selection) => void
}

export function MapCanvas({
  neighborhoods,
  modules,
  flows,
  supportEdges,
  retryEdges,
  selection,
  activeFlowId,
  playing,
  speed,
  traceTick,
  onSelect,
}: MapCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{
    x: number
    y: number
    panX: number
    panY: number
    moved: boolean
  } | null>(null)
  const [pan, setPan] = useState(INITIAL_PAN)
  const [zoom, setZoom] = useState(INITIAL_ZOOM)
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)

  useEffect(() => {
    panRef.current = pan
    zoomRef.current = zoom
  }, [pan, zoom])

  const byId = new Map(modules.map((mod) => [mod.id, mod]))
  const maxCount = Math.max(...modules.map((mod) => mod.count), 1)
  const activeFlow = flows.find((flow) => flow.id === activeFlowId) ?? null
  const selectedNeighborhood =
    selection.kind === "overview"
      ? "studio"
      : selection.kind === "neighborhood"
        ? selection.id
        : byId.get(selection.id)?.neighborhood
  const selectedModuleId = selection.kind === "module" ? selection.id : null

  const flowPoints = (activeFlow?.moduleIds ?? [])
    .map((id) => {
      const mod = byId.get(id)
      if (!mod) return null
      const h = heightFromCount(mod.count, maxCount)
      return blockTopCenter(mod.gx, mod.gy, mod.gw, mod.gd, h)
    })
    .filter((point): point is { x: number; y: number } => point != null)

  const flowPath = pathThrough(flowPoints)

  useGSAP(
    () => {
      const dots = gsap.utils.toArray<SVGCircleElement>(".payload-dot")
      if (!playing || !flowPath || dots.length === 0) {
        gsap.set(dots, { autoAlpha: 0 })
        return
      }
      gsap.set(dots, { autoAlpha: 1 })
      const timeline = gsap.timeline({ repeat: -1 })
      dots.forEach((dot, index) => {
        timeline.fromTo(
          dot,
          { autoAlpha: 1 },
          {
            motionPath: {
              path: "#flow-path",
              align: "#flow-path",
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            duration: 7,
            ease: "none",
          },
          index * 1.4,
        )
      })
      timeline.timeScale(speed)
    },
    {
      dependencies: [playing, flowPath, speed, activeFlowId],
      scope: svgRef,
      revertOnUpdate: true,
    },
  )

  useGSAP(
    () => {
      if (traceTick === 0 || !flowPath) return
      const dot = svgRef.current?.querySelector(".trace-dot")
      if (!dot) return
      gsap.fromTo(
        dot,
        { autoAlpha: 1 },
        {
          motionPath: {
            path: "#flow-path",
            align: "#flow-path",
            alignOrigin: [0.5, 0.5],
          },
          duration: 1.15 / speed,
          ease: "power1.inOut",
          onComplete: () => {
            gsap.set(dot, { autoAlpha: 0 })
          },
        },
      )
    },
    { dependencies: [traceTick], scope: svgRef },
  )

  function zoomAt(nextZoom: number, cx: number, cy: number) {
    const current = zoomRef.current
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom))
    const sx = (cx - panRef.current.x) / current
    const sy = (cy - panRef.current.y) / current
    setZoom(clamped)
    setPan({ x: cx - sx * clamped, y: cy - sy * clamped })
  }

  function recenter() {
    setPan(INITIAL_PAN)
    setZoom(INITIAL_ZOOM)
  }

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = svg.getBoundingClientRect()
      const next = zoomRef.current * (event.deltaY > 0 ? 0.92 : 1.08)
      zoomAt(next, event.clientX - rect.left, event.clientY - rect.top)
    }
    svg.addEventListener("wheel", onWheel, { passive: false })
    return () => svg.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-canvas">
      <svg
        ref={svgRef}
        className="size-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(event) => {
          if (event.button !== 0) return
          dragRef.current = {
            x: event.clientX,
            y: event.clientY,
            panX: panRef.current.x,
            panY: panRef.current.y,
            moved: false,
          }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (!drag) return
          const dx = event.clientX - drag.x
          const dy = event.clientY - drag.y
          if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true
          if (drag.moved) {
            setPan({ x: drag.panX + dx, y: drag.panY + dy })
          }
        }}
        onPointerUp={(event) => {
          const drag = dragRef.current
          dragRef.current = null
          if (drag?.moved) return
          const node = (event.target as Element).closest("[data-node]")
          if (!node) {
            onSelect({ kind: "overview" })
            return
          }
          const kind = node.getAttribute("data-kind")
          const id = node.getAttribute("data-node")
          if (kind === "neighborhood" && id) {
            onSelect({ kind: "neighborhood", id: id as Neighborhood["id"] })
          } else if (kind === "module" && id) {
            onSelect({ kind: "module", id })
          }
        }}
      >
        <defs>
          <pattern
            id="block-hatch"
            width="6"
            height="6"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="6" height="6" fill="#fafbfc" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="#eceef1"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {ISO_GRID}

          {neighborhoods.map((place) => {
            const selected = selectedNeighborhood === place.id
            const anchor = plateLabelAnchor(place.gx, place.gy)
            return (
              <g
                key={place.id}
                data-node={place.id}
                data-kind="neighborhood"
                className="cursor-pointer"
              >
                <polygon
                  points={platePoly(place.gx, place.gy, place.gw, place.gd)}
                  fill={selected ? "#e8f1fe" : "none"}
                  stroke={selected ? "#1b6ef3" : "#e4e6ea"}
                  strokeWidth={selected ? 2 : 1}
                  vectorEffect="non-scaling-stroke"
                />
                <g
                  transform={`translate(${anchor.x - 18}, ${anchor.y - 36}) scale(${1 / zoom})`}
                >
                  <line
                    x1="18"
                    y1="18"
                    x2="36"
                    y2="34"
                    stroke={selected ? "#1b6ef3" : "#9ba1ac"}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <rect
                    x="0"
                    y="0"
                    width={place.name.length * 7.2 + 16}
                    height="18"
                    fill="#ffffff"
                    stroke={selected ? "#1b6ef3" : "#e4e6ea"}
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <text
                    x="8"
                    y="13"
                    fill={selected ? "#1b6ef3" : "#5f6672"}
                    style={{
                      fontFamily: "IBM Plex Mono, ui-monospace, monospace",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: "0.6px",
                    }}
                  >
                    {place.name}
                  </text>
                </g>
              </g>
            )
          })}

          {supportEdges.map(([from, to]) => (
            <Edge
              key={`${from}-${to}-s`}
              from={byId.get(from)}
              to={byId.get(to)}
              maxCount={maxCount}
              kind="support"
            />
          ))}
          {retryEdges.map(([from, to]) => (
            <Edge
              key={`${from}-${to}-r`}
              from={byId.get(from)}
              to={byId.get(to)}
              maxCount={maxCount}
              kind="retry"
            />
          ))}
          {activeFlow
            ? activeFlow.moduleIds.slice(0, -1).map((from, index) => (
                <Edge
                  key={`${from}-flow`}
                  from={byId.get(from)}
                  to={byId.get(activeFlow.moduleIds[index + 1])}
                  maxCount={maxCount}
                  kind="flow"
                />
              ))
            : null}

          <path
            id="flow-path"
            d={flowPath}
            fill="none"
            stroke="none"
            pointerEvents="none"
          />

          {modules
            .slice()
            .sort((a, b) => a.gx + a.gy - (b.gx + b.gy))
            .map((mod) => (
              <ModuleBlock
                key={mod.id}
                mod={mod}
                height={heightFromCount(mod.count, maxCount)}
                selected={selectedModuleId === mod.id}
                zoom={zoom}
              />
            ))}

          <circle
            className="payload-dot pointer-events-none"
            r="4"
            fill="#1b6ef3"
            opacity="0"
          />
          <circle
            className="payload-dot pointer-events-none"
            r="4"
            fill="#1b6ef3"
            opacity="0"
          />
          <circle
            className="payload-dot pointer-events-none"
            r="4"
            fill="#1b6ef3"
            opacity="0"
          />
          <circle
            className="trace-dot pointer-events-none"
            r="4"
            fill="#1b6ef3"
            opacity="0"
          />
        </g>
      </svg>

      <LegendBar className="pointer-events-none absolute bottom-4 left-6" />

      <div className="absolute right-6 bottom-4 flex flex-col gap-2">
        <IconButton label="Recentre" onClick={recenter}>
          <Crosshair strokeWidth={1.5} className="size-4" />
        </IconButton>
        <IconButton
          label="Zoom in"
          onClick={() => {
            const svg = svgRef.current
            if (!svg) return
            zoomAt(zoomRef.current * 1.18, svg.clientWidth / 2, svg.clientHeight / 2)
          }}
        >
          <Plus strokeWidth={1.5} className="size-4" />
        </IconButton>
        <IconButton
          label="Zoom out"
          onClick={() => {
            const svg = svgRef.current
            if (!svg) return
            zoomAt(zoomRef.current / 1.18, svg.clientWidth / 2, svg.clientHeight / 2)
          }}
        >
          <Minus strokeWidth={1.5} className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}

const ISO_GRID = (() => {
  const lines = []
  for (let i = -10; i <= 64; i += 1) {
    const a = project(i, -10)
    const b = project(i, 40)
    const c = project(-10, i)
    const d = project(58, i)
    lines.push(
      <line
        key={`vx-${i}`}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke="#eceef1"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />,
      <line
        key={`vy-${i}`}
        x1={c.x}
        y1={c.y}
        x2={d.x}
        y2={d.y}
        stroke="#eceef1"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />,
    )
  }
  return (
    <g aria-hidden="true" pointerEvents="none">
      {lines}
    </g>
  )
})()

function Edge({
  from,
  to,
  maxCount,
  kind,
}: {
  from?: StudioModule
  to?: StudioModule
  maxCount: number
  kind: "flow" | "support" | "retry"
}) {
  if (!from || !to) return null
  const a = blockTopCenter(
    from.gx,
    from.gy,
    from.gw,
    from.gd,
    heightFromCount(from.count, maxCount),
  )
  const b = blockTopCenter(
    to.gx,
    to.gy,
    to.gw,
    to.gd,
    heightFromCount(to.count, maxCount),
  )
  const flow = kind === "flow"
  return (
    <line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke={flow ? "#1b6ef3" : "#cfd3d9"}
      strokeWidth={flow ? 2 : 1}
      strokeDasharray={kind === "retry" ? "4 4" : undefined}
      vectorEffect="non-scaling-stroke"
      pointerEvents="none"
    />
  )
}

function ModuleBlock({
  mod,
  height,
  selected,
  zoom,
}: {
  mod: StudioModule
  height: number
  selected: boolean
  zoom: number
}) {
  const copies = mod.slabs ?? 1
  const tag = blockTopCenter(
    mod.gx,
    mod.gy,
    mod.gw,
    mod.gd,
    height + (copies - 1) * 0.32,
  )
  return (
    <g data-node={mod.id} data-kind="module" className="cursor-pointer">
      {Array.from({ length: copies }, (_, index) => {
        const inset = index * 0.16
        const faces = prismFaces(
          mod.gx + inset,
          mod.gy + inset,
          Math.max(mod.gw - inset * 2, 1.2),
          Math.max(mod.gd - inset, 1.2),
          height + index * 0.32,
        )
        return (
          <g key={index}>
            <polygon points={poly(faces.left)} fill="#eceef1" stroke="#c8ccd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <polygon points={poly(faces.right)} fill="#eceef1" stroke="#c8ccd2" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <polygon
              points={poly(faces.top)}
              fill={mod.hatch ? "url(#block-hatch)" : "#fafbfc"}
              stroke={selected ? "#1b6ef3" : "#c8ccd2"}
              strokeWidth={selected ? 2 : 1}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )
      })}
      <g transform={`translate(${tag.x}, ${tag.y - 14}) scale(${1 / zoom})`}>
        <rect
          x={-16}
          y={-9}
          width="32"
          height="16"
          rx="2"
          fill="#ffffff"
          stroke="#cfd3d9"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <text
          textAnchor="middle"
          y="3"
          fill="#5f6672"
          style={{
            fontFamily: "IBM Plex Mono, ui-monospace, monospace",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.6px",
          }}
        >
          {mod.code}
        </text>
      </g>
    </g>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center rounded-md border border-hairline bg-canvas text-ink-muted",
      )}
    >
      {children}
    </button>
  )
}
