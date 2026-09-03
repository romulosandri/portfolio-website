// Netlify Function fronting the Mastra agent. It exists so the agent's URL and
// access token never reach the browser, and so the chat is same-origin: anything
// imported by src/ ends up in the public bundle, including VITE_ prefixed vars.

import type { Config, Context } from '@netlify/functions'

const MAX_MESSAGE_LENGTH = 4000
const MAX_MESSAGES = 60

const RATE_LIMIT = {
  maxPerWindow: 30,
  windowMs: 10 * 60 * 1000,
}

// Best effort only: this map is instance-local and resets on every cold start, so
// it slows a single abusive client down but does not stop a distributed flood.
const requestTimes = new Map<string, number[]>()

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return Response.json(body, { status, headers })
}

function isRateLimited(id: string) {
  const now = Date.now()

  if (requestTimes.size > 1000) {
    for (const [key, times] of requestTimes) {
      if (times.every((time) => now - time >= RATE_LIMIT.windowMs)) requestTimes.delete(key)
    }
  }

  const recent = (requestTimes.get(id) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs)
  recent.push(now)
  requestTimes.set(id, recent)

  return recent.length > RATE_LIMIT.maxPerWindow
}

/** Total length of every text part, so a long paste is rejected before it costs tokens. */
function textLength(messages: unknown[]) {
  let total = 0

  for (const message of messages) {
    const parts = (message as { parts?: unknown }).parts
    if (!Array.isArray(parts)) continue

    for (const part of parts) {
      const text = (part as { text?: unknown }).text
      if (typeof text === 'string') total += text.length
    }
  }

  return total
}

export default async (request: Request, context: Context) => {
  // The method is checked here rather than through `config.method` so that a GET
  // returns JSON instead of falling through to the SPA catch-all redirect.
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' })
  }

  const serverUrl = Netlify.env.get('MASTRA_SERVER_URL')
  const token = Netlify.env.get('MASTRA_CHAT_TOKEN')

  if (!serverUrl || !token) {
    console.error('Chat is missing MASTRA_SERVER_URL or MASTRA_CHAT_TOKEN.')
    return json({ error: 'The chat is not configured yet.' }, 500)
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Expected a JSON body.' }, 400)
  }

  if (typeof payload !== 'object' || payload === null) {
    return json({ error: 'Expected a JSON body.' }, 400)
  }

  const body = payload as Record<string, unknown>
  const messages = body.messages

  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: 'Expected at least one message.' }, 400)
  }
  if (messages.length > MAX_MESSAGES) {
    return json({ error: 'This conversation is too long. Start a new one.' }, 400)
  }
  if (textLength(messages) > MAX_MESSAGE_LENGTH) {
    return json({ error: 'That message is too long.' }, 400)
  }

  if (isRateLimited(context.ip || 'unknown')) {
    return json({ error: 'Too many messages. Try again in a few minutes.' }, 429)
  }

  // The thread and resource IDs come from the widget so a visitor keeps one
  // conversation. Only these fields are forwarded, so a crafted request cannot
  // override the agent's instructions, model, or tools.
  const memory = body.memory as { thread?: unknown; resource?: unknown } | undefined
  const thread = typeof memory?.thread === 'string' ? memory.thread : undefined
  const resource = typeof memory?.resource === 'string' ? memory.resource : undefined

  if (!thread || !resource) {
    return json({ error: 'Expected a conversation id.' }, 400)
  }

  let upstream: Response
  try {
    upstream = await fetch(`${serverUrl.replace(/\/$/, '')}/chat/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages, memory: { thread, resource } }),
      signal: request.signal,
    })
  } catch (error) {
    console.error('Could not reach the agent:', error)
    return json({ error: 'The chat is unavailable right now.' }, 502)
  }

  if (!upstream.ok || !upstream.body) {
    console.error('Agent rejected the request:', upstream.status, await upstream.text())
    return json({ error: 'The chat is unavailable right now.' }, 502)
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}

export const config: Config = {
  path: '/api/chat',
}
