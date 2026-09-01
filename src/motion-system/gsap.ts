import gsap from 'gsap'
import { useGSAP as useGsapUntyped } from '@gsap/react'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGsapUntyped, ScrollToPlugin, ScrollTrigger, SplitText)

/**
 * `@gsap/react` ships `contextSafe` as an optional callback parameter, but GSAP's
 * Context always supplies it: `Context.add` invokes the callback as
 * `f(self, func => self.add(null, func))` (gsap-core.js). The optional type makes
 * every `(_, contextSafe) => ...` call site a type error, so it is narrowed here
 * once instead of at each use.
 */
type AnyFn = (...args: never[]) => unknown
type ContextSafeFunc = <T extends AnyFn>(func: T) => T

type ContextFunc = (
  context: gsap.Context,
  contextSafe: ContextSafeFunc,
) => (() => void) | void

type UseGsapConfig = {
  scope?: { current: unknown } | Element | string
  dependencies?: unknown[]
  revertOnUpdate?: boolean
}

type UseGsap = (
  callback: ContextFunc,
  config?: UseGsapConfig | unknown[],
) => { context: gsap.Context; contextSafe: ContextSafeFunc }

const useGSAP = useGsapUntyped as unknown as UseGsap

export { gsap, useGSAP, ScrollToPlugin, ScrollTrigger, SplitText }
