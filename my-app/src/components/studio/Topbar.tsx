import { cn } from "@/lib/utils"

type Metric = {
  label: string
  value: string
  hidden?: "payload" | "compact"
}

type TopbarProps = {
  metrics: Metric[]
  flowLabel: string
  playing: boolean
  canPlay: boolean
  speed: 0.5 | 1 | 2
  onToggleFlowList: () => void
  onResume: () => void
  onTrace: () => void
  onSpeed: (speed: 0.5 | 1 | 2) => void
}

export function Topbar({
  metrics,
  flowLabel,
  playing,
  canPlay,
  speed,
  onToggleFlowList,
  onResume,
  onTrace,
  onSpeed,
}: TopbarProps) {
  return (
    <header className="flex h-[72px] min-w-0 items-stretch border-b border-hairline bg-canvas">
      <div className="flex shrink-0 items-center gap-2 px-6">
        <span className="typo-display-lg text-ink">Telescope</span>
        <span className="typo-mono-eyebrow text-ink-subtle">Studio</span>
      </div>

      <div className="flex min-w-0 flex-1 items-stretch overflow-hidden">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={cn(
              "flex min-w-0 flex-col justify-center border-l border-hairline px-6 py-4",
              metric.hidden === "payload" && "max-[1919px]:hidden",
              metric.hidden === "compact" && "max-md:hidden",
            )}
          >
            <span className="typo-mono-eyebrow text-ink-subtle">
              {metric.label}
            </span>
            <span className="typo-mono-value truncate text-ink">
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 px-6">
        <button
          type="button"
          onClick={onToggleFlowList}
          className="typo-button rounded-md border border-hairline-strong bg-canvas px-4 py-3 text-ink"
        >
          Flow: {flowLabel}
        </button>
        <button
          type="button"
          onClick={onResume}
          disabled={!canPlay}
          className={cn(
            "typo-button rounded-md border bg-canvas px-4 py-3",
            canPlay
              ? "border-hairline-strong text-ink"
              : "border-hairline text-ink-disabled",
          )}
        >
          {playing ? "Pause flow" : "Resume flow"}
        </button>
        <button
          type="button"
          onClick={onTrace}
          disabled={!canPlay}
          className={cn(
            "typo-button rounded-md border bg-canvas px-4 py-3 max-xl:hidden",
            canPlay
              ? "border-hairline-strong text-ink"
              : "border-hairline text-ink-disabled",
          )}
        >
          Trace one step
        </button>
        <div className="flex items-center gap-1 rounded-md border border-hairline-strong bg-canvas p-1">
          {([0.5, 1, 2] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onSpeed(value)}
              className={cn(
                "typo-mono-chip rounded-sm px-2 py-1",
                speed === value
                  ? "bg-accent-soft text-primary"
                  : "text-ink-muted",
              )}
            >
              {value}x
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
