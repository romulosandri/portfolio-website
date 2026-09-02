// Netlify Function backing the contact form. It exists because the Resend API key
// must never reach the browser -- anything imported by src/ ends up in the public
// bundle, including VITE_ prefixed env vars.

import type { Config, Context } from '@netlify/functions'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

const MAX_LENGTH = {
  name: 100,
  email: 200,
  message: 5000,
}

const RATE_LIMIT = {
  maxPerWindow: 5,
  windowMs: 60 * 60 * 1000,
}

// Best effort only: this map is instance-local and resets on every cold start, so
// it slows a single abusive client down but does not stop a distributed flood.
// The honeypot below is what catches most drive-by bots.
const submissionTimes = new Map<string, number[]>()

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)
}

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return Response.json(body, { status, headers })
}

function isRateLimited(id: string) {
  const now = Date.now()

  if (submissionTimes.size > 1000) {
    for (const [key, times] of submissionTimes) {
      if (times.every((time) => now - time >= RATE_LIMIT.windowMs)) submissionTimes.delete(key)
    }
  }

  const recent = (submissionTimes.get(id) ?? []).filter((time) => now - time < RATE_LIMIT.windowMs)
  recent.push(now)
  submissionTimes.set(id, recent)

  return recent.length > RATE_LIMIT.maxPerWindow
}

function readField(source: Record<string, unknown>, key: string) {
  const value = source[key]
  return typeof value === 'string' ? value.trim() : ''
}

function validate(payload: Record<string, unknown>) {
  const name = readField(payload, 'name')
  const email = readField(payload, 'email')
  const message = readField(payload, 'message')

  if (!name || !email || !message) return { error: 'Name, email, and message are all required.' }
  if (name.length > MAX_LENGTH.name) return { error: 'That name is too long.' }
  if (email.length > MAX_LENGTH.email) return { error: 'That email address is too long.' }
  if (message.length > MAX_LENGTH.message) return { error: 'That message is too long.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'That email address looks wrong.' }

  return { contact: { name, email, message } }
}

export default async (request: Request, context: Context) => {
  // The method is checked here rather than through `config.method` so that a GET
  // returns JSON instead of falling through to the SPA catch-all redirect.
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL || 'romulosandrirodrigues@gmail.com'

  if (!apiKey || !from) {
    console.error('Contact form is missing RESEND_API_KEY or CONTACT_FROM_EMAIL.')
    return json({ error: 'The contact form is not configured yet.' }, 500)
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

  // The honeypot is hidden from people but visible to form-filling bots. Report
  // success so they do not retry with the field left blank.
  if (readField(body, 'company')) return json({ ok: true }, 200)

  if (isRateLimited(context.ip || 'unknown')) {
    return json({ error: 'Too many messages. Try again later.' }, 429)
  }

  const { error, contact } = validate(body)
  if (!contact) return json({ error }, 400)

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: contact.email,
      subject: `Portfolio contact from ${contact.name}`,
      text: `From: ${contact.name} <${contact.email}>\n\n${contact.message}`,
      html: [
        `<p><strong>${escapeHtml(contact.name)}</strong> &lt;${escapeHtml(contact.email)}&gt;</p>`,
        `<p style="white-space:pre-wrap">${escapeHtml(contact.message)}</p>`,
      ].join(''),
    }),
  })

  if (!response.ok) {
    console.error('Resend rejected the message:', response.status, await response.text())
    return json({ error: 'Could not send the message.' }, 502)
  }

  return json({ ok: true }, 200)
}

export const config: Config = {
  path: '/api/contact',
}
