import { useMemo, useState } from 'react'
import { Sidebar } from './components/Sidebar.jsx'
import { Header } from './components/Header.jsx'
import { VideoPlayer } from './components/VideoPlayer.jsx'
import { ChatPanel } from './components/ChatPanel.jsx'
import { streams } from './config/streams.js'
import { useWebRTC } from './hooks/useWebRTC.js'

function App() {
  const [activeStreamId, setActiveStreamId] = useState(streams[0]?.id ?? '')
  const [theatreMode, setTheatreMode] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(false)

  const activeStream = useMemo(
    () => streams.find((stream) => stream.id === activeStreamId) ?? streams[0],
    [activeStreamId],
  )

  const chat = useWebRTC(activeStream?.id ?? '')

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        activeStream={activeStream}
        theatreMode={theatreMode}
        onToggleTheatreMode={() => setTheatreMode((value) => !value)}
        onCollapseChat={() => setChatCollapsed((value) => !value)}
        chatCollapsed={chatCollapsed}
        peerCount={chat.peerCount}
      />

      <main
        className={`mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-[1440px] gap-3 px-3 pb-3 sm:min-h-[calc(100vh-5rem)] sm:gap-4 sm:px-4 sm:pb-4 ${
          theatreMode
            ? 'lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]'
            : 'lg:grid-cols-[220px_minmax(0,1fr)_320px] xl:grid-cols-[240px_minmax(0,1fr)_340px]'
        }`}
      >
        <Sidebar
          streams={streams}
          activeStreamId={activeStream?.id ?? ''}
          onSelectStream={setActiveStreamId}
        />

        <section className="flex min-h-0 flex-col gap-4">
          <VideoPlayer
            stream={activeStream}
            theatreMode={theatreMode}
            onToggleTheatreMode={() => setTheatreMode((value) => !value)}
          />
          {theatreMode ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl shadow-cyan-950/20 sm:p-4">
              <ChatPanel
                streamId={activeStream?.id ?? ''}
                collapsed={false}
                onToggleCollapse={() => setChatCollapsed((value) => !value)}
                chat={chat}
                compact
              />
            </div>
          ) : null}
        </section>

        {!theatreMode ? (
          <ChatPanel
            streamId={activeStream?.id ?? ''}
            collapsed={chatCollapsed}
            onToggleCollapse={() => setChatCollapsed((value) => !value)}
            chat={chat}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
