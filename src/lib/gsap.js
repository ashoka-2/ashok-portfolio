import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { Draggable } from 'gsap/Draggable'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, Flip, Draggable, useGSAP)

export { gsap, ScrollTrigger, Flip, Draggable, useGSAP }

export function splitCharacters(text) {
  return Array.from(text).map((character, index) => ({
    character,
    key: `${index}-${character.codePointAt(0)}`,
  }))
}
