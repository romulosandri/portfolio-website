import { useState, type FormEvent } from 'react'
import { SendButton, SocialIcon, type SocialIconType } from '../design-system'
import { RevealGroup, RevealLine, RevealText } from '../motion-system'
import { site } from '../content/site'
import { PageLayout } from './PageLayout'
import { WorkImageSequence } from './WorkImageSequence'

const socials: SocialIconType[] = ['email', 'github', 'x', 'linkedin', 'instagram']

type Status = 'idle' | 'sending' | 'sent' | 'error'

function requireTrimmed(field: HTMLInputElement | HTMLTextAreaElement) {
  field.setCustomValidity(field.value.trim() ? '' : 'This field is required.')
}

function Field({
  id,
  label,
  placeholder,
  multiline,
}: {
  id: string
  label: string
  placeholder: string
  multiline?: boolean
}) {
  const fieldClass =
    'w-full border border-solid border-stroke-secondary bg-transparent p-xl text-body-default text-foreground-primary outline-none placeholder:text-foreground-quaternary'

  const requiredProps = {
    'aria-required': true as const,
    onInput: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      requireTrimmed(event.currentTarget)
    },
    onInvalid: (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      requireTrimmed(event.currentTarget)
    },
    required: true,
  }

  return (
    <label className="flex w-full min-w-px flex-1 flex-col items-start gap-md" htmlFor={id}>
      <span className="w-full text-body-default text-foreground-secondary">
        {label}
        <span aria-hidden className="text-foreground-quaternary">
          {' '}
          *
        </span>
      </span>
      {multiline ? (
        <textarea
          className={`${fieldClass} min-h-px flex-1 resize-none`}
          id={id}
          name={id}
          placeholder={placeholder}
          {...requiredProps}
        />
      ) : (
        <input
          className={fieldClass}
          id={id}
          name={id}
          placeholder={placeholder}
          type={id === 'email' ? 'email' : 'text'}
          {...requiredProps}
        />
      )}
    </label>
  )
}

export function ContactPage() {
  const [status, setStatus] = useState<Status>('idle')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'sending') return

    const form = event.currentTarget
    const fields = [...form.elements].filter(
      (element): element is HTMLInputElement | HTMLTextAreaElement =>
        (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) &&
        element.required,
    )
    for (const field of fields) {
      requireTrimmed(field)
      if (!field.checkValidity()) {
        field.reportValidity()
        return
      }
    }

    const data = new FormData(form)
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          message: String(data.get('message') ?? ''),
          company: String(data.get('company') ?? ''),
        }),
      })
      if (!response.ok) throw new Error(`Contact request failed with ${response.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <PageLayout>
      <section className="flex w-full items-center justify-center gap-[120px] bg-background-primary px-4xl py-[164px]">
        <form className="flex min-w-px flex-1 flex-col items-start gap-4xl" onSubmit={onSubmit}>
          <RevealGroup>
            <RevealText as="h1" className="whitespace-nowrap text-h1 text-foreground-primary">
              Contact Me
            </RevealText>
          </RevealGroup>
          <div className="flex w-full flex-col items-start gap-4xl">
            <div className="flex w-full items-start gap-lg">
              <Field id="name" label="Your Name" placeholder="John Doe Jr" />
              <Field id="email" label="Email Address" placeholder="john@doe.com" />
            </div>
            <div className="flex h-[241px] w-full flex-col items-start gap-md">
              <Field id="message" label="Your Message" multiline placeholder="I want to hire you to..." />
            </div>
          </div>
          <input aria-hidden autoComplete="off" className="sr-only" name="company" tabIndex={-1} />
          <div className="flex w-full flex-col items-start gap-md">
            <SendButton
              disabled={status === 'sending'}
              label={status === 'sending' ? 'Sending' : 'Send'}
            />
            <p className="text-body-default text-foreground-secondary" role="status">
              {status === 'sent' && 'Message sent. I will get back to you shortly.'}
              {status === 'error' && `Something went wrong. Email me directly at ${site.email}.`}
            </p>
          </div>
          <RevealGroup className="flex w-full flex-col items-start gap-xl">
            <RevealLine dashed />
            <div className="flex items-center gap-2xl whitespace-pre text-body-default text-foreground-secondary">
              <p>
                WhatsApp
                {'\n\n'}
                <a className="no-underline" href={site.whatsappHref}>
                  {site.whatsapp}
                </a>
              </p>
              <p>
                Email
                {'\n\n'}
                <a className="no-underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            </div>
          </RevealGroup>
          <div className="flex items-center gap-xl">
            {socials.map((type) => (
              <SocialIcon key={type} type={type} />
            ))}
          </div>
        </form>
        <WorkImageSequence />
      </section>
    </PageLayout>
  )
}
