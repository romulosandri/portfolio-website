import { useRef, type ReactNode } from 'react'
import { CopyEmail } from '../design-system'
import { site } from '../content/site'
import { gsap, useGSAP } from '../motion-system/gsap'
import { MOTION, prefersReducedMotion } from '../motion-system/tokens'
import { WorkImageSequence } from './WorkImageSequence'

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

const COPY: Record<
  Exclude<ContactStatus, 'idle'>,
  { title: string; body: ReactNode; announcement: string }
> = {
  sending: {
    title: 'Sending',
    body: 'Your message is on its way.',
    announcement: 'Sending your message.',
  },
  sent: {
    title: 'Sent',
    body: 'I will get back to you shortly.',
    announcement: 'Message sent. I will get back to you shortly.',
  },
  error: {
    title: "Didn't send",
    body: (
      <>
        Something went wrong.{' '}
        <CopyEmail className="text-background-primary underline">
          Email me at {site.email}
        </CopyEmail>
      </>
    ),
    announcement: `Something went wrong. Email me directly at ${site.email}.`,
  },
}

type ContactStatusVisualProps = {
  status: ContactStatus
}

export function ContactStatusVisual({ status }: ContactStatusVisualProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const shown = status === 'idle' ? null : status
  const copy = shown ? COPY[shown] : null

  useGSAP(
    () => {
      const media = mediaRef.current
      const overlay = overlayRef.current
      const copyNode = copyRef.current
      if (!media || !overlay) return

      const reduced = prefersReducedMotion()
      const duration = reduced ? 0 : MOTION.duration.interactive
      const show = status !== 'idle'

      gsap.to(overlay, {
        autoAlpha: show ? 1 : 0,
        duration,
        ease: MOTION.ease.inOut,
        overwrite: 'auto',
      })
      gsap.to(media, {
        scale: show ? 1.06 : 1,
        duration: reduced ? 0 : MOTION.duration.scene,
        ease: MOTION.ease.inOut,
        overwrite: 'auto',
      })

      if (!show || !copyNode) return

      if (reduced) {
        gsap.set(copyNode, { autoAlpha: 1, y: 0 })
        return
      }

      gsap.fromTo(
        copyNode,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: MOTION.duration.entrance,
          ease: MOTION.ease.out,
          overwrite: 'auto',
        },
      )

      if (status !== 'sending') return

      const title = copyNode.querySelector('[data-status-title]')
      if (!title) return

      const pulse = gsap.to(title, {
        autoAlpha: 0.55,
        duration: 0.7,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        delay: MOTION.duration.entrance,
      })

      return () => pulse.kill()
    },
    { scope: rootRef, dependencies: [status] },
  )

  return (
    <div className="relative shrink-0 overflow-clip" ref={rootRef}>
      <div className="origin-center will-change-transform" ref={mediaRef}>
        <WorkImageSequence />
      </div>
      <div
        aria-hidden={status !== 'error'}
        className={[
          'invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-2xl bg-foreground-primary/80 px-4xl text-center opacity-0',
          status === 'error' ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        ref={overlayRef}
        role={status === 'error' ? 'alert' : undefined}
      >
        {copy ? (
          <div className="flex max-w-[520px] flex-col items-center gap-2xl" key={status} ref={copyRef}>
            <p className="text-h1 text-background-primary" data-status-title="">
              {copy.title}
            </p>
            <p className="text-body-large text-background-primary/80">{copy.body}</p>
          </div>
        ) : null}
      </div>
      <p className="sr-only" role="status">
        {status === 'sending' || status === 'sent' ? copy?.announcement : null}
      </p>
    </div>
  )
}
