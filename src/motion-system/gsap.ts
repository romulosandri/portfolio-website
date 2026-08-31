import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger, SplitText)

export { gsap, useGSAP, ScrollToPlugin, ScrollTrigger, SplitText }
