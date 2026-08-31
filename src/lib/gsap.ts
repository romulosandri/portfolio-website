import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollToPlugin, ScrollTrigger)

export { gsap, useGSAP, ScrollToPlugin, ScrollTrigger }
