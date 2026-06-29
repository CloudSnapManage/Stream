import { ChevronDown, ChevronLeft, SendHorizonal, Wifi } from 'lucide-react'
import { useEffect, useState } from 'react'

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp)
}

export function ChatPanel({ streamId, collapsed, onToggleCollapse, chat, compact = false }) {
  const [draftMessage, setDraftMessage] = useState('')
  const [editableUsername, setEditableUsername] = useState(chat.username)

  useEffect(() => {
    setEditableUsername(chat.username)
  }, [chat.username, streamId])

  const handleSubmit = (event) => {
    event.preventDefault()
    chat.sendMessage(draftMessage)
    setDraftMessage('')
  }

  if (!compact && collapsed) {
    return (
      <aside className="hidden rounded-3xl border border-white/10 bg-slate-900/70 p-3 shadow-2xl shadow-slate-950/40 lg:flex lg:min-h-0 lg:flex-col">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Open chat
        </button>
      </aside>
    )
  }

  return (
    <aside className={`flex min-h-0 flex-col rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl shadow-slate-950/40 ${compact ? '' : 'lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]'} ${compact ? 'max-h-[42vh]' : ''}`}>
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3 sm:px-4 sm:py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/70 sm:text-xs">Live chat</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-300 sm:text-sm">
            <Wifi className="h-4 w-4 text-emerald-300" />
            <span>{chat.connectionLabel}</span>
          </div>
        </div>

        {!compact ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
          >
            <ChevronDown className="h-4 w-4" />
            Collapse
          </button>
        ) : null}
      </div>

      <div className="border-b border-white/10 px-3 py-3 sm:px-4 sm:py-4">
        <label className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-slate-400 sm:text-xs">
          Username
        </label>
        <input
          value={editableUsername}
          onChange={(event) => setEditableUsername(event.target.value)}
          onBlur={() => chat.setUsername(editableUsername)}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40"
          placeholder="Enter a nickname"
        />
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        {chat.messages.length > 0 ? (
          chat.messages.map((message) => (
            <article
              key={message.id}
              className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                <strong className="text-cyan-200">{message.username}</strong>
                <span>{formatTime(message.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-200">{message.text}</p>
            </article>
          ))
        ) : (
          <div className="flex h-full min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 px-6 text-center text-sm text-slate-400">
            No messages yet. Start the match thread.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2">
          <textarea
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            rows={2}
            placeholder={streamId ? 'Send a message to the room' : 'Select a stream first'}
            disabled={!streamId}
            className="min-h-[52px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!streamId || !draftMessage.trim()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-200 transition hover:bg-cyan-400/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  )
}