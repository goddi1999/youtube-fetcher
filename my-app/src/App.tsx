import { useEffect, useState } from 'react'
import { InfoIcon } from 'lucide-react'
import OptionWheel from '@/components/OptionWheel'
import YearInDots from '@/components/YearInDots'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { CarouselSlider } from '@/components/carousel-slider'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type YearCount = {
  year: number
  comments: number
}

type ByYearResponse = {
  all_dated_comments: number
  by_year: YearCount[]
}

function App() {
  const [years, setYears] = useState<YearCount[] | null>(null)
  const [allDatedComments, setAllDatedComments] = useState(0)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadYears() {
      try {
        const response = await fetch('/api/comments/by-year', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Failed to load years (${response.status})`)
        }
        const data: ByYearResponse = await response.json()
        setYears(data.by_year)
        setAllDatedComments(data.all_dated_comments)
        setSelectedYear(data.by_year.at(-1)?.year ?? null)
      } catch (cause) {
        if (controller.signal.aborted) return
        setError(cause instanceof Error ? cause.message : 'Failed to load years')
      }
    }

    void loadYears()
    return () => controller.abort()
  }, [])

  const yearLabels = years?.map((row) => String(row.year)) ?? []
  const maxComments = years
    ? Math.max(...years.map((row) => row.comments), 1)
    : 1
  const selectedIndex =
    years?.findIndex((row) => row.year === selectedYear) ?? -1

  return (
    <main className="min-h-svh bg-background px-4 text-foreground">
      <div className="mx-auto max-w-5xl pt-12">
        <YoutubeEmbed videoId="jNQXAC9IVRw" autoPlay mute loop />

        <section className="mt-12">
          {years == null && error == null ? (
            <div className="flex flex-col justify-center gap-4 py-20">
              <Progress aria-label="Loading years" />
              <p className="text-center text-sm text-muted-foreground">
                Loading years
              </p>
            </div>
          ) : error != null ? (
            <p className="py-20 text-center text-sm text-primary">{error}</p>
          ) : (
            <div className="flex flex-col gap-10 pb-16">
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div className="h-72">
                  <OptionWheel
                    items={yearLabels}
                    defaultSelected={Math.max(yearLabels.length - 1, 0)}
                    selectedIndex={Math.max(selectedIndex, 0)}
                    onChange={(_index, item) => setSelectedYear(Number(item))}
                    textColor="#FAFAFA"
                    activeColor="#FF0000"
                    aria-label="Comment years"
                  />
                </div>

                <CarouselSlider
                  index={Math.max(selectedIndex, 0)}
                  onIndexChange={(index) =>
                    setSelectedYear(years[index]?.year ?? null)
                  }
                  slides={years.map((row) => (
                    <YearInDots
                      key={row.year}
                      year={row.year}
                      comments={row.comments}
                      maxComments={maxComments}
                      totalComments={allDatedComments}
                      className="pointer-events-none h-full rounded-[32px] shadow-none hover:translate-y-0"
                    />
                  ))}
                />
              </div>

              <Card>
                <CardHeader>
                  <div className="flex gap-3">
                    <InfoIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="space-y-1">
                      <CardTitle>Relative scale</CardTitle>
                      <CardDescription>
                        Each year is 365 dots. A full card is the busiest year;
                        every other year is filled in proportion to that — not
                        one dot per comment.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
