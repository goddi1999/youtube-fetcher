import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type StatusBarProps = {
  hints: string[]
}

export function StatusBar({ hints }: StatusBarProps) {
  return (
    <footer className="flex h-11 shrink-0 items-center border-t border-hairline bg-canvas px-6 max-md:hidden">
      <p className="typo-mono-hint truncate text-ink-subtle">
        {hints.join("  ·  ")}
      </p>
    </footer>
  )
}

export function LegendBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <LegendItem label="Flow">
        <span className="block h-[2px] w-7 bg-primary" />
      </LegendItem>
      <LegendItem label="Support">
        <span className="block h-px w-7 bg-hairline-strong" />
      </LegendItem>
      <LegendItem label="Retry">
        <span className="block h-px w-7 border-t border-dashed border-hairline-strong" />
      </LegendItem>
      <LegendItem label="Payload">
        <span className="size-2 rounded-full bg-primary" />
      </LegendItem>
    </div>
  )
}

function LegendItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <span className="typo-mono-hint text-ink-muted">{label}</span>
    </div>
  )
}
