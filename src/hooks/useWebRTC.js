import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const SIGNALING_SERVERS = [
  'wss://signaling.yjs.dev',
  'wss://y-webrtc-signaling-eu.herokuapp.com',
]

const STORAGE_KEY = 'stream.shrijan.username'

function readStoredUsername() {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.localStorage.getItem(STORAGE_KEY) ?? ''
}

function createFallbackUsername() {
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `Fan ${suffix}`
}

function readInitialUsername() {
  return readStoredUsername() || createFallbackUsername()
}

function readInitialMessages() {
  return []
}

function buildMessageEntry(username, text) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    username,
    text,
    createdAt: Date.now(),
  }
}

export function useWebRTC(streamId) {
  const [username, setUsernameState] = useState(readInitialUsername)
  const [messages, setMessages] = useState(readInitialMessages)
  const [peerCount, setPeerCount] = useState(0)
  const [synced, setSynced] = useState(false)

  const providerRef = useRef(null)
  const docRef = useRef(null)
  const roomMessagesRef = useRef(null)
  const usernameRef = useRef(username)

  const connectionLabel = useMemo(() => {
    if (!streamId) {
      return 'Select a stream to join chat'
    }

    if (!synced) {
      return 'Syncing room'
    }

    if (peerCount > 0) {
      return `Connected to ${peerCount} peers`
    }

    return 'Waiting for peers'
  }, [peerCount, streamId, synced])

  useEffect(() => {
    if (!streamId) {
      setMessages([])
      setPeerCount(0)
      setSynced(false)
      return undefined
    }

    const doc = new Y.Doc()
    const roomMessages = doc.getArray('messages')
    const provider = new WebrtcProvider(`stream-${streamId}`, doc, {
      signaling: SIGNALING_SERVERS,
      password: `stream-room-${streamId}`,
      maxConns: 8,
    })

    docRef.current = doc
    providerRef.current = provider
    roomMessagesRef.current = roomMessages

    const syncMessages = () => {
      const nextMessages = roomMessages
        .toArray()
        .slice()
        .sort((left, right) => left.createdAt - right.createdAt)

      setMessages(nextMessages)
    }

    const syncPeers = () => {
      const localState = provider.awareness.getLocalState()
      const peerStates = provider.awareness.getStates()
      let count = peerStates.size

      if (localState) {
        count -= 1
      }

      setPeerCount(Math.max(count, 0))
    }

    provider.awareness.setLocalStateField('user', {
      username: usernameRef.current,
      streamId,
    })

    provider.awareness.on('change', syncPeers)
    roomMessages.observe(syncMessages)
    provider.on('synced', (value) => {
      setSynced(Boolean(value))
      syncPeers()
    })

    syncMessages()
    syncPeers()

    return () => {
      roomMessages.unobserve(syncMessages)
      provider.awareness.off('change', syncPeers)
      provider.destroy()
      doc.destroy()
      providerRef.current = null
      docRef.current = null
      roomMessagesRef.current = null
      setMessages([])
      setPeerCount(0)
      setSynced(false)
    }
  }, [streamId])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    usernameRef.current = username
    window.localStorage.setItem(STORAGE_KEY, username)
    if (providerRef.current) {
      providerRef.current.awareness.setLocalStateField('user', {
        username: usernameRef.current,
        streamId,
      })
    }
  }, [streamId, username])

  const updateUsername = useCallback((nextUsername) => {
    const sanitizedUsername = nextUsername.trim() || createFallbackUsername()
    setUsernameState(sanitizedUsername)
  }, [])

  const sendMessage = useCallback(
    (text) => {
      if (!roomMessagesRef.current) {
        return
      }

      const trimmedText = text.trim()
      if (!trimmedText) {
        return
      }

      roomMessagesRef.current.push([buildMessageEntry(username, trimmedText)])
    },
    [username],
  )

  return {
    username,
    setUsername: updateUsername,
    messages,
    sendMessage,
    peerCount,
    synced,
    connectionLabel,
  }
}