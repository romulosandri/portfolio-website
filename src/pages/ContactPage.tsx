import { useState, type FormEvent } from 'react'
import { identifyVisitor, track, trackException } from '../lib/analytics'
import { BookingButton, CopyEmail, SendButton, SocialLinks } from '../design-system'
import { RevealGroup, RevealLine, RevealText } from '../motion-system'
import { site } from '../content/site'
import { ContactStatusVisual, type ContactStatus } from './ContactStatusVisual'
import { PageLayout } from './PageLayout'

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
  const [status, setStatus] = useState<ContactStatus>('idle')

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
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    setStatus('sending')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: String(data.get('message') ?? ''),
          company: String(data.get('company') ?? ''),
        }),
      })
      if (!response.ok) throw new Error(`Contact request failed with ${response.status}`)
      form.reset()
      setStatus('sent')
      if (email) identifyVisitor(email, { email, name })
      track('contact_form_submitted', { has_name: Boolean(name) })
    } catch (error) {
      setStatus('error')
      track('contact_form_failed')
      trackException(error, { source: 'contact_form' })
    }
  }

  return (
    <PageLayout>
      <section className="flex w-full flex-col items-center justify-center gap-4xl bg-background-primary px-gutter py-[clamp(72px,12vw,164px)] xl:flex-row xl:items-center xl:gap-30">
        <form
          aria-busy={status === 'sending'}
          className="flex w-full min-w-0 flex-col items-start gap-4xl xl:min-w-80 xl:flex-1"
          onSubmit={onSubmit}
        >
          <RevealGroup>
            <RevealText as="h1" className="text-h1 text-foreground-primary">
              Contact Me
            </RevealText>
          </RevealGroup>
          <div className="flex w-full flex-col items-start gap-4xl">
            <div className="flex w-full flex-col items-start gap-lg xs:flex-row">
              <Field id="name" label="Your Name" placeholder="John Doe Jr" />
              <Field id="email" label="Email Address" placeholder="john@doe.com" />
            </div>
            <div className="flex w-full flex-col items-start gap-md">
              <div className="flex h-60.25 w-full flex-col items-start gap-md">
                <Field id="message" label="Your Message" multiline placeholder="I want to hire you to..." />
              </div>
              <a
                className="inline-flex items-center gap-sm text-body-small text-foreground-tertiary no-underline hover:text-foreground-secondary"
                href="https://resend.com"
                rel="noreferrer"
                target="_blank"
              >
                Powered by Resend
                <svg
                  aria-hidden
                  className="block shrink-0"
                  fill="currentColor"
                  height="14"
                  viewBox="0 0 1800 1800"
                  width="14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1000.46 450C1174.77 450 1278.43 553.669 1278.43 691.282C1278.43 828.896 1174.77 932.563 1000.46 932.563H912.382L1350 1350H1040.82L707.794 1033.48C683.944 1011.47 672.936 985.781 672.935 963.765C672.935 932.572 694.959 905.049 737.161 893.122L908.712 847.244C973.85 829.812 1018.81 779.353 1018.81 713.298C1018.8 632.567 952.745 585.78 871.095 585.78H450V450H1000.46Z" />
                </svg>
              </a>
            </div>
          </div>
          <input aria-hidden autoComplete="off" className="sr-only" name="company" tabIndex={-1} />
          <SendButton
            disabled={status === 'sending'}
            label={status === 'sending' ? 'Sending' : 'Send'}
          />
          <RevealGroup className="flex w-full flex-col items-start gap-xl">
            <RevealLine dashed />
            <div className="flex items-center gap-2xl whitespace-pre text-body-default text-foreground-secondary">
              <p>
                WhatsApp
                {'\n\n'}
                <a
                  className="no-underline"
                  href={site.whatsappHref}
                  onClick={() =>
                    track('social_link_clicked', {
                      network: 'whatsapp',
                      href: site.whatsappHref,
                      pathname: window.location.pathname,
                    })
                  }
                >
                  {site.whatsapp}
                </a>
              </p>
              <p>
                Email
                {'\n\n'}
                <CopyEmail className="no-underline">{site.email}</CopyEmail>
              </p>
            </div>
          </RevealGroup>
          <div className="flex flex-col items-start gap-xl">
            <SocialLinks />
            <BookingButton />
          </div>
        </form>
        <ContactStatusVisual status={status} />
      </section>
    </PageLayout>
  )
}
