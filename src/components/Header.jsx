import { MessageSquare, MonitorPlay, Tv, Users } from 'lucide-react'

export function Header({
  activeStream,
  theatreMode,
  onToggleTheatreMode,
  onCollapseChat,
  chatCollapsed,
  peerCount,
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/20 sm:h-11 sm:w-11">
            <Tv className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70 sm:text-xs">Stream.Shrijan.me</p>
            <h2 className="text-base font-semibold text-white sm:text-lg">
              {activeStream ? activeStream.title : 'Select a match'}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 sm:px-4 sm:text-sm">
            <Users className="h-4 w-4 text-emerald-300" />
            <span>{peerCount} peers</span>
          </div>

          <button
            type="button"
            onClick={onCollapseChat}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 sm:px-4 sm:text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            {chatCollapsed ? 'Open chat' : 'Collapse chat'}
          </button>

          <button
            type="button"
            onClick={onToggleTheatreMode}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-medium text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/15 sm:px-4 sm:text-sm"
          >
            <MonitorPlay className="h-4 w-4" />
            {theatreMode ? 'Exit theatre' : 'Theatre mode'}
          </button>
        </div>
      </div>
    </header>
  )
}