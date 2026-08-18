import YoutubeEmbed from "@/components/YoutubeEmbed"

function App() {
  return (
    <main className="min-h-svh bg-canvas px-4 text-ink">
      <div className="mx-auto max-w-5xl pt-12 pb-16">
        <YoutubeEmbed videoId="jNQXAC9IVRw" autoPlay mute loop />

        <h1 className="typo-headline mt-8 text-ink">Me at the zoo</h1>
        <p className="typo-body mt-2 text-ink-muted">
          405m views • 21 years ago comment Analysis break down
        </p>
      </div>
    </main>
  )
}

export default App
