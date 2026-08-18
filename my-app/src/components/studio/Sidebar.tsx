import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  compactCount,
  type FlowDef,
  type NeighborhoodId,
  type Selection,
  type StudioModule,
} from "@/lib/studio"

type SidebarProps = {
  flows: FlowDef[]
  modules: StudioModule[]
  groups: { label: string; neighborhood?: NeighborhoodId }[]
  activeFlowId: string | null
  selection: Selection
  onSelectFlow: (id: string) => void
  onSelectModule: (id: string) => void
}

export function Sidebar({
  flows,
  modules,
  groups,
  activeFlowId,
  selection,
  onSelectFlow,
  onSelectModule,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col overflow-y-auto border-r border-hairline bg-canvas px-4 py-6 max-md:hidden">
      {groups.map((group) => {
        if (!group.neighborhood) {
          return (
            <section key={group.label} className="mb-6">
              <h2 className="typo-mono-eyebrow mb-3 px-1 text-ink-subtle">
                {group.label}
              </h2>
              <ul>
                {flows.map((flow) => {
                  const active = flow.id === activeFlowId
                  return (
                    <li key={flow.id}>
                      <button
                        type="button"
                        onClick={() => onSelectFlow(flow.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xs px-2 py-3 text-left",
                          active && "border-l-2 border-l-primary pl-[6px]",
                        )}
                      >
                        <Play
                          aria-hidden="true"
                          className={cn(
                            "size-3 shrink-0",
                            active ? "text-primary" : "text-ink-subtle",
                          )}
                          fill="currentColor"
                          strokeWidth={1.5}
                        />
                        <span className="typo-mono-label min-w-0 flex-1 truncate text-ink">
                          {flow.name}
                        </span>
                        <span className="typo-mono-eyebrow max-w-[42%] truncate text-ink-subtle">
                          {flow.payload}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        }

        const rows = modules.filter(
          (mod) => mod.neighborhood === group.neighborhood,
        )
        return (
          <section key={group.label} className="mb-6">
            <h2 className="typo-mono-eyebrow mb-3 px-1 text-ink-subtle">
              {group.label}
            </h2>
            <ul className="flex flex-col gap-2">
              {rows.map((mod) => {
                const selected =
                  selection.kind === "module" && selection.id === mod.id
                return (
                  <li key={mod.id}>
                    <button
                      type="button"
                      onClick={() => onSelectModule(mod.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md border bg-canvas p-4 text-left",
                        selected
                          ? "border-2 border-primary p-[15px]"
                          : "border-hairline",
                      )}
                    >
                      <span
                        className={cn(
                          "typo-mono-eyebrow flex size-7 shrink-0 items-center justify-center rounded-xs border",
                          selected
                            ? "border-primary bg-accent-soft text-primary"
                            : "border-hairline-strong text-ink-muted",
                        )}
                      >
                        {mod.code}
                      </span>
                      <span className="typo-mono-label min-w-0 flex-1 truncate text-ink">
                        {mod.name}
                      </span>
                      <span className="typo-count shrink-0 text-ink-subtle">
                        {compactCount(mod.count)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </aside>
  )
}
