import type { FormEvent } from 'react'
import { SocialIcon, type SocialIconType } from '../design-system'
import { site } from '../content/site'
import { PageLayout } from './PageLayout'

type ContactPageProps = {
  pathname: string
}

const socials: SocialIconType[] = ['email', 'github', 'x', 'linkedin', 'instagram']

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

  return (
    <label className="flex w-full min-w-px flex-1 flex-col items-start gap-md" htmlFor={id}>
      <span className="w-full text-body-default text-foreground-secondary">{label}</span>
      {multiline ? (
        <textarea className={`${fieldClass} min-h-px flex-1 resize-none`} id={id} name={id} placeholder={placeholder} />
      ) : (
        <input className={fieldClass} id={id} name={id} placeholder={placeholder} type={id === 'email' ? 'email' : 'text'} />
      )}
    </label>
  )
}

export function ContactPage({ pathname }: ContactPageProps) {
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
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
        <div className="relative h-[678px] w-[904px] shrink-0 overflow-clip bg-[#e6e6e6]">
          <img
            alt=""
            className="absolute top-[54px] left-1/2 h-[1393px] w-[711px] -translate-x-1/2 object-cover"
            src="/images/contact/gemhaus.png"
          />
        </div>
      </section>
    </PageLayout>
  )
}
