import { ChevronRight, Flame } from 'lucide-react'

export function Sidebar({ streams, activeStreamId, onSelectStream }) {
  return (
    <aside className="flex h-full flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur sm:p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3 sm:pb-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70 sm:text-xs">Stream hub</p>
          <h1 className="text-base font-semibold text-white sm:text-lg">World Cup</h1>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {streams.map((stream) => {
          const isActive = stream.id === activeStreamId

          return (
            <button
              key={stream.id}
              type="button"
              onClick={() => onSelectStream(stream.id)}
              className={`group w-full rounded-2xl border px-3 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-slate-800/90 sm:px-4 ${
                isActive
                  ? 'border-cyan-400/40 bg-cyan-400/10 shadow-lg shadow-cyan-950/20'
                  : 'border-white/10 bg-slate-950/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-400">
                    <span>{stream.category}</span>
                    {isActive ? (
                      <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-cyan-300">
                        live
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white sm:text-base">{stream.title}</p>
                </div>
                <ChevronRight
                  className={`mt-1 h-4 w-4 transition ${isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-300'}`}
                />
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-xs text-emerald-100/80 sm:text-sm">
        Edit <span className="font-semibold text-emerald-200">src/config/streams.js</span> for the embed.
      </div>
    </aside>
  )
}