import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { track } from '../lib/analytics'
import { navigate } from '../lib/router'
import { gsap, useGSAP } from '../motion-system/gsap'
import { MOTION, prefersReducedMotion } from '../motion-system/tokens'
import { site } from '../content/site'
import { RobotImage } from './RobotImage'

const PANEL_ID = 'site-chat-panel'
const THREAD_KEY = 'chat:thread'
const VISITOR_KEY = 'chat:visitor'
const MESSAGES_KEY = 'chat:messages'
const MAX_INPUT_LENGTH = 2000
const MAX_STORED_MESSAGES = 40

const SUGGESTIONS = [
  'Who is Rômulo Sandri?',
  'Tell me about Pacelane.ai and Fotospin.',
  'Is he available for work?',
  'I want to send Rômulo a message.',
  'Schedule a meeting with Rômulo.',
]

/**
 * `thread` is the conversation and `resource` is the visitor. The agent's
 * observational memory requires both, so a request without them is rejected.
 *
 * The thread lives in sessionStorage alongside the transcript below, so the
 * visible history and the agent's server-side memory of that thread always
 * agree: reloading a tab keeps both, and a new tab starts both over. The
 * visitor id outlives the thread, so return visits are still recognisable.
 *
 * Only the newest user message is posted. Mastra Memory already reloads the
 * thread from storage; sending the full transcript duplicates it and the
 * model starts answering every earlier question again.
 */
function readId(storage: Storage, key: string) {
  try {
    const existing = storage.getItem(key)
    if (existing) return existing
    const created = crypto.randomUUID()
    storage.setItem(key, created)
    return created
  } catch {
    // Private mode or blocked storage: fall back to an in-memory id.
    return crypto.randomUUID()
  }
}

function readIds() {
  if (typeof window === 'undefined') return null
  return {
    thread: readId(window.sessionStorage, THREAD_KEY),
    resource: readId(window.localStorage, VISITOR_KEY),
  }
}

function readStoredMessages(): UIMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.sessionStorage.getItem(MESSAGES_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : []
  } catch {
    return []
  }
}

/** Tool calls are surfaced as a status line rather than raw JSON. */
function toolLabel(type: string) {
  if (type.includes('knowledge')) return 'Looking through his work...'
  if (type.includes('available_slots')) return 'Checking his calendar...'
  if (type.includes('create_booking')) return 'Booking the call...'
  if (type.includes('contact')) return 'Sending your message...'
  if (type.includes('navigate')) return 'Opening the page...'
  return 'Working on it...'
}

function CalendarIcon() {
  return (
    <svg aria-hidden className="block" fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect height="10.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" width="12" x="2" y="3.5" />
      <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.25 2v3M10.75 2v3" stroke="currentColor" strokeLinecap="square" strokeWidth="1.5" />
    </svg>
  )
}

type NavigatePayload = {
  ok?: unknown
  path?: unknown
}

function pathFromUnknown(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const { ok, path } = value as NavigatePayload
  if (ok === false) return null
  return typeof path === 'string' && path.startsWith('/') ? path : null
}

/** The agent writes a `data-navigate` part and also returns the same payload as the tool result. */
function navigatePath(part: UIMessage['parts'][number]): string | null {
  if (part.type === 'data-navigate' && 'data' in part) {
    return pathFromUnknown(part.data)
  }

  if (part.type === 'tool-navigate_to_page' || part.type === 'dynamic-tool') {
    if (part.type === 'dynamic-tool' && part.toolName !== 'navigate_to_page') return null
    if (part.state === 'output-available') return pathFromUnknown(part.output)
  }

  return null
}

function handledKeysFor(messages: UIMessage[]) {
  const keys = new Set<string>()
  for (const message of messages) {
    message.parts.forEach((part, index) => {
      const path = navigatePath(part)
      if (path) keys.add(`${message.id}:${index}:${path}`)
    })
  }
  return keys
}

const CHAT_LINK =
  /https:\/\/(?:www\.)?romulosandri\.com(\/[^\s<)\]"'.,!?]*)|https:\/\/(?:app\.)?cal\.com\/[^\s<)\]"'.,!?]+|https:\/\/meet\.google\.com\/[^\s<)\]"'.,!?]+|(\/(?:work|projects|how-i-use-ai|contact|game)(?:\/[a-z0-9-]+)?)/gi

function chatLinkHref(raw: string) {
  if (raw.startsWith('/')) return raw
  if (raw.includes('romulosandri.com')) {
    try {
      return new URL(raw).pathname || '/'
    } catch {
      return raw
    }
  }
  return raw
}

function ChatText({ text }: { text: string }) {
  const nodes: ReactNode[] = []
  let cursor = 0
  const matches = text.matchAll(CHAT_LINK)

  for (const match of matches) {
    const index = match.index ?? 0
    if (index > cursor) nodes.push(text.slice(cursor, index))

    const href = chatLinkHref(match[0])
    const external = href.startsWith('https://')
    nodes.push(
      <a
        className="underline decoration-stroke-secondary underline-offset-2"
        href={href}
        key={`${href}:${index}`}
        {...(external ? { rel: 'noreferrer', target: '_blank' } : {})}
      >
        {match[0]}
      </a>,
    )
    cursor = index + match[0].length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <p className="whitespace-pre-wrap text-body-default text-foreground-primary">{nodes}</p>
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')

  // Read synchronously: useChat only reads `messages` on its first render, so
  // deferring to an effect would drop the restored transcript.
  const [ids] = useState(readIds)
  const [restored] = useState(readStoredMessages)

  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const handledNavigations = useRef(handledKeysFor(restored))

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest({ messages }) {
          const latest = messages.at(-1)
          return {
            body: {
              messages: latest ? [latest] : [],
              memory: { thread: ids?.thread, resource: ids?.resource },
            },
          }
        },
      }),
    [ids],
  )

  const { messages, sendMessage, status, error, stop } = useChat({
    transport,
    messages: restored,
    onData: (part) => {
      if (part.type !== 'data-navigate') return
      const path = pathFromUnknown(part.data)
      if (!path) return
      navigate(path)
      track('chat_navigated', { path })
    },
  })

  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    if (busy) return

    for (const message of messages) {
      message.parts.forEach((part, index) => {
        const path = navigatePath(part)
        if (!path) return
        const key = `${message.id}:${index}:${path}`
        if (handledNavigations.current.has(key)) return
        handledNavigations.current.add(key)
        navigate(path)
        track('chat_navigated', { path })
      })
    }
  }, [messages, busy])

  useEffect(() => {
    if (busy) return
    try {
      window.sessionStorage.setItem(
        MESSAGES_KEY,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
      )
    } catch {
      // Storage full or blocked: the conversation just will not survive a reload.
    }
  }, [messages, busy])

  const submit = () => {
    const text = input.trim()
    if (!text || busy || !ids) return

    sendMessage({ text })
    setInput('')
    track('chat_message_sent', { length: text.length })
  }

  // Keep the newest message in view as tokens stream in.
  useEffect(() => {
    const log = logRef.current
    if (!log) return
    log.scrollTop = log.scrollHeight
  }, [messages, busy])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    inputRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Lenis is skipped on touch, so the panel still has to absorb wheel and
  // overscroll itself or the page behind it moves with the transcript.
  useEffect(() => {
    const panel = panelRef.current
    if (!open || !panel) return

    const absorb = (event: WheelEvent | TouchEvent) => {
      event.stopPropagation()
      const log = logRef.current
      if (!log) {
        event.preventDefault()
        return
      }

      if (event instanceof WheelEvent) {
        const atTop = log.scrollTop <= 0
        const atBottom = log.scrollTop + log.clientHeight >= log.scrollHeight - 1
        if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
          event.preventDefault()
        }
      }
    }

    panel.addEventListener('wheel', absorb, { passive: false })
    panel.addEventListener('touchmove', absorb, { passive: false })
    return () => {
      panel.removeEventListener('wheel', absorb)
      panel.removeEventListener('touchmove', absorb)
    }
  }, [open])

  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel || !open) return
      if (prefersReducedMotion()) return

      gsap.from(panel, {
        y: 16,
        opacity: 0,
        duration: MOTION.duration.interactive,
        ease: MOTION.ease.out,
      })
    },
    { scope: rootRef, dependencies: [open] },
  )

  return (
    <div
      className="pointer-events-none fixed bottom-gutter left-gutter z-50 flex flex-col items-start gap-lg md:bottom-4xl md:left-4xl"
      ref={rootRef}
    >
      {open ? (
        <div
          aria-label={`Chat about ${site.name}`}
          aria-modal="false"
          className="pointer-events-auto flex h-[min(560px,calc(100svh-8rem))] w-[min(384px,calc(100vw-2rem))] flex-col overflow-hidden overscroll-contain border border-solid border-stroke-secondary bg-background-primary shadow-[0_18px_40px_rgba(14,9,7,0.18)]"
          id={PANEL_ID}
          ref={panelRef}
          role="dialog"
        >
          <header className="flex shrink-0 items-center justify-between border-b border-solid border-stroke-secondary px-xl py-lg">
            <div className="flex flex-col gap-2xs">
              <p className="text-h5 text-foreground-primary">Ask about {site.name}</p>
              <p className="text-body-small text-foreground-quaternary">
                Answers come from his site
              </p>
            </div>
            <div className="-mr-md flex shrink-0 items-center">
              <a
                aria-label={site.booking.label}
                className="inline-flex size-11 items-center justify-center text-foreground-primary hover:bg-background-secondary"
                href={site.booking.href}
                onClick={() => track('chat_booking_opened', { href: site.booking.href })}
                rel="noreferrer"
                target="_blank"
              >
                <CalendarIcon />
              </a>
              <button
                aria-label="Close chat"
                className="inline-flex size-11 cursor-pointer items-center justify-center"
                onClick={() => setOpen(false)}
                type="button"
              >
                <span className="relative block size-3.5">
                  <span className="absolute top-1/2 left-0 block h-[1.5px] w-full rotate-45 bg-foreground-primary" />
                  <span className="absolute top-1/2 left-0 block h-[1.5px] w-full -rotate-45 bg-foreground-primary" />
                </span>
              </button>
            </div>
          </header>

          <div
            aria-live="polite"
            className="scrollbar-none flex min-h-0 flex-1 flex-col gap-xl overflow-y-auto overscroll-contain px-xl py-xl"
            ref={logRef}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col gap-lg">
                <p className="text-body-default text-foreground-tertiary">
                  Ask about his work, his projects, or whether he is available. You can also
                  leave him a message or book a call.
                </p>
                <div className="flex flex-col items-start gap-md">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      className="cursor-pointer border border-solid border-stroke-secondary px-lg py-md text-left text-body-small text-foreground-secondary hover:bg-background-secondary"
                      key={suggestion}
                      onClick={() => {
                        if (busy || !ids) return
                        sendMessage({ text: suggestion })
                        track('chat_message_sent', {
                          suggestion: true,
                          booking: suggestion.startsWith('Schedule'),
                        })
                      }}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((message) => {
              const text = message.parts
                .filter((part) => part.type === 'text')
                .map((part) => ('text' in part ? part.text : ''))
                .join('')

              const tool = message.parts.find((part) => part.type.startsWith('tool-'))

              if (!text && !tool) return null

              return (
                <div className="flex flex-col gap-xsm" key={message.id}>
                  <p className="text-body-small text-foreground-quaternary">
                    {message.role === 'user' ? 'You' : site.name}
                  </p>
                  {text ? (
                    <ChatText text={text} />
                  ) : (
                    <p className="text-body-default text-foreground-quaternary">
                      {toolLabel(tool!.type)}
                    </p>
                  )}
                </div>
              )
            })}

            {status === 'submitted' ? (
              <p className="text-body-default text-foreground-quaternary">Thinking...</p>
            ) : null}

            {error ? (
              <p className="text-body-default text-foreground-tertiary">
                Something went wrong. Try again, or email{' '}
                <a className="underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            ) : null}
          </div>

          <form
            className="flex shrink-0 items-end gap-md border-t border-solid border-stroke-secondary px-xl py-lg"
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              Message
            </label>
            <textarea
              autoComplete="off"
              className="scrollbar-none max-h-24 min-h-11 flex-1 resize-none bg-transparent py-md text-body-default text-foreground-primary outline-none placeholder:text-foreground-quaternary"
              id="chat-input"
              maxLength={MAX_INPUT_LENGTH}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return
                event.preventDefault()
                submit()
              }}
              placeholder="Ask a question..."
              ref={inputRef}
              rows={1}
              value={input}
            />
            {busy ? (
              <button
                className="shrink-0 cursor-pointer border border-solid border-stroke-secondary px-lg py-md text-body-small text-foreground-secondary"
                onClick={stop}
                type="button"
              >
                Stop
              </button>
            ) : (
              <button
                className="shrink-0 cursor-pointer bg-foreground-primary px-lg py-md text-body-small text-background-primary disabled:opacity-40"
                disabled={!input.trim() || !ids}
                type="submit"
              >
                Send
              </button>
            )}
          </form>
        </div>
      ) : null}

      <button
        aria-controls={open ? PANEL_ID : undefined}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : `Ask AI about ${site.name}`}
        className="pointer-events-auto inline-flex cursor-pointer items-center gap-md border border-solid border-stroke-secondary bg-background-primary px-xl py-lg text-body-default text-foreground-primary hover:bg-background-secondary"
        onClick={() => {
          setOpen((current) => {
            if (!current) track('chat_opened')
            return !current
          })
        }}
        type="button"
      >
        {open ? (
          'Close'
        ) : (
          <>
            <RobotImage />
            Ask AI about me
          </>
        )}
      </button>
    </div>
  )
}
