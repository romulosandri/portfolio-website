import type { FormEvent } from 'react'
import { ArrowButton, SocialIcon, type SocialIconType } from '../design-system'
import { site } from '../content/site'
import { PageLayout } from './PageLayout'
import { WorkImageSequence } from './WorkImageSequence'

type ContactPageProps = {
  pathname: string
}

const socials: SocialIconType[] = ['email', 'github', 'x', 'linkedin', 'instagram']

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

export function ContactPage({ pathname }: ContactPageProps) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = [...form.elements].filter(
      (element): element is HTMLInputElement | HTMLTextAreaElement =>
        element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement,
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
    const message = String(data.get('message') ?? '').trim()
    const subject = encodeURIComponent(name ? `Message from ${name}` : 'Portfolio contact')
    const body = encodeURIComponent(
      [name && `Name: ${name}`, email && `Email: ${email}`, message].filter(Boolean).join('\n\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
  }

  return (
    <PageLayout pathname={pathname}>
      <section className="flex w-full items-center justify-center gap-[120px] bg-background-primary px-4xl py-[164px]">
        <form className="flex min-w-px flex-1 flex-col items-start gap-4xl" onSubmit={onSubmit}>
          <h1 className="whitespace-nowrap text-h1 text-foreground-primary">Contact Me</h1>
          <div className="flex w-full flex-col items-start gap-4xl">
            <div className="flex w-full items-start gap-lg">
              <Field id="name" label="Your Name" placeholder="John Doe Jr" />
              <Field id="email" label="Email Address" placeholder="john@doe.com" />
            </div>
            <div className="flex h-[241px] w-full flex-col items-start gap-md">
              <Field id="message" label="Your Message" multiline placeholder="I want to hire you to..." />
            </div>
          </div>
          <button
            className="group flex w-full cursor-pointer items-center justify-between border-y border-solid border-stroke-secondary bg-background-primary p-xl text-left hover:border-foreground-quaternary hover:bg-foreground-primary"
            type="submit"
          >
            <span className="text-h3 text-foreground-primary group-hover:text-background-primary">Send</span>
            <span className="flex items-center justify-end">
              <span className="group-hover:hidden">
                <ArrowButton variant="default" />
              </span>
              <span className="hidden group-hover:inline-flex">
                <ArrowButton variant="dark" />
              </span>
            </span>
          </button>
          <div className="flex w-full flex-col items-start gap-xl">
            <div className="h-px w-full border-t border-dashed border-stroke-secondary" />
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
          </div>
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
