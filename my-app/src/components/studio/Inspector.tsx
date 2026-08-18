import type { ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InspectorDoc } from "@/lib/studio"

type InspectorProps = {
  doc: InspectorDoc
  tab: "does" | "built"
  onTab: (tab: "does" | "built") => void
  onClose: () => void
}

export function Inspector({ doc, tab, onTab, onClose }: InspectorProps) {
  const prose = tab === "does" ? doc.does : doc.built
  const highlight = tab === "does" ? doc.highlight : doc.builtHighlight

  return (
    <aside className="flex h-full w-[470px] shrink-0 flex-col overflow-y-auto border-l border-hairline bg-canvas max-md:hidden max-xl:absolute max-xl:inset-x-0 max-xl:bottom-0 max-xl:top-auto max-xl:h-[55%] max-xl:w-full max-xl:border-t">
      <div className="flex items-center justify-between px-8 pt-8">
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={() => onTab("does")}
            className={cn(
              "typo-card-title flex-1 rounded-lg border px-6 py-3",
              tab === "does"
                ? "border-primary bg-accent-soft text-ink"
                : "border-hairline bg-canvas text-ink-muted",
            )}
          >
            What it does
          </button>
          <button
            type="button"
            onClick={() => onTab("built")}
            className={cn(
              "typo-card-title flex-1 rounded-lg border px-6 py-3",
              tab === "built"
                ? "border-primary bg-accent-soft text-ink"
                : "border-hairline bg-canvas text-ink-muted",
            )}
          >
            How it's built
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector"
          className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-md border border-hairline text-ink-muted"
        >
          <X strokeWidth={1.5} className="size-4" />
        </button>
      </div>
      <div className="mt-3 border-b border-hairline" />

      <div className="flex flex-col gap-6 px-8 py-8">
        <div>
          <p className="typo-mono-eyebrow text-ink-subtle">{doc.eyebrow}</p>
          <h1 className="typo-headline mt-2 text-ink">{doc.title}</h1>
          <p className="typo-body-sm mt-2 text-ink-muted">{doc.meta}</p>
        </div>

        <p className="typo-body-lg text-ink">
          <Highlighted text={prose} highlight={highlight} />
        </p>

        {tab === "built" ? (
          <>
            <Section label="Source">
              <ul>
                {doc.source.map((path) => (
                  <li
                    key={path}
                    className="typo-mono-path border-b border-hairline py-4 text-ink-muted last:border-b-0"
                  >
                    {path}
                  </li>
                ))}
              </ul>
            </Section>

            <Section label="Stack">
              <div className="flex flex-wrap gap-2">
                {doc.stack.map((chip) => (
                  <span
                    key={chip}
                    className="typo-mono-chip rounded-sm bg-surface-chip px-3 py-2 text-ink-muted"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Section>

            <Section label="Payload">
              <div className="flex flex-wrap gap-2">
                {doc.payload.map((chip) => (
                  <span
                    key={chip}
                    className="typo-mono-chip rounded-sm bg-accent-soft px-3 py-2 text-primary"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </Section>
          </>
        ) : doc.travelledBy.length > 0 ? (
          <Section label="Travelled by">
            <div className="flex flex-wrap gap-2">
              {doc.travelledBy.map((chip) => (
                <span
                  key={chip}
                  className="typo-mono-chip rounded-[50px] border border-primary px-3 py-2 text-primary"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </aside>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <section className="mt-6">
      <h2 className="typo-mono-eyebrow mb-3 text-ink-subtle">{label}</h2>
      <div className="border-t border-hairline pt-2">{children}</div>
    </section>
  )
}

function Highlighted({
  text,
  highlight,
}: {
  text: string
  highlight?: string
}) {
  if (!highlight) return text
  const index = text.indexOf(highlight)
  if (index < 0) return text
  return (
    <>
      {text.slice(0, index)}
      <mark>{highlight}</mark>
      {text.slice(index + highlight.length)}
    </>
  )
}
