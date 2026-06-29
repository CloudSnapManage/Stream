import { Expand, Minimize2, Maximize2 } from 'lucide-react'
import { useRef } from 'react'

export function VideoPlayer({ stream, theatreMode, onToggleTheatreMode }) {
  const frameRef = useRef(null)

  const requestFullscreen = async () => {
    const container = frameRef.current?.parentElement

    if (!container?.requestFullscreen) {
      return
    }

    try {
      await container.requestFullscreen()
    } catch {
      return
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-3 py-3 sm:px-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70 sm:text-xs">
            {stream?.category ?? 'Stream'}
          </p>
          <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">{stream?.title ?? 'No stream selected'}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheatreMode}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 sm:text-sm"
          >
            {theatreMode ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
            {theatreMode ? 'Compact' : 'Theatre'}
          </button>
          <button
            type="button"
            onClick={requestFullscreen}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/15 sm:text-sm"
          >
            <Maximize2 className="h-4 w-4" />
            Fullscreen
          </button>
        </div>
      </div>

      <div className={`relative bg-black ${theatreMode ? 'min-h-[60vh] sm:min-h-[72vh]' : 'h-[320px] sm:h-[450px]'}`}>
        {stream ? (
          <iframe
            ref={frameRef}
            key={stream.id}
            title={stream.title}
            src={stream.embedUrl}
            width="100%"
            height="450"
            frameBorder="0"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center text-slate-300 sm:min-h-[450px]">
            Select a stream from the sidebar to start watching.
          </div>
        )}
      </div>
    </section>
  )
}