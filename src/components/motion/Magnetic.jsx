import { createElement, useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap.js'

export default function Magnetic({ as = 'a', className = '', children, ...props }) {
  const root = useRef(null)
  const motionTo = useRef(null)
  useGSAP(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) return
    motionTo.current = {
      x: gsap.quickTo(root.current, 'x', { duration: .28, ease: 'power3.out' }),
      y: gsap.quickTo(root.current, 'y', { duration: .28, ease: 'power3.out' }),
    }
  }, { scope: root })
  const move = (event) => {
    if (!motionTo.current) return
    const rect = root.current.getBoundingClientRect()
    motionTo.current.x((event.clientX - rect.left - rect.width / 2) * .17)
    motionTo.current.y((event.clientY - rect.top - rect.height / 2) * .17)
  }
  const leave = () => { if (root.current && motionTo.current) gsap.to(root.current, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1, .42)', overwrite: true }) }
  return createElement(as, { ...props, ref: root, className, onPointerMove: move, onPointerLeave: leave, 'data-magnetic': '' }, children)
}
