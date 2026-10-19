import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import TechLamp from '../../components/tech/TechLamp.jsx'

export default function PhysicsField({ items }) {
  const field = useRef(null)
  const bodies = useRef([])
  const engineRef = useRef(null)
  const mouseConstraint = useRef(null)
  const gesture = useRef(null)
  const gravityEnabled = useRef(true)
  useEffect(() => {
    const node = field.current
    if (!node) return
    const compact = window.matchMedia('(max-width: 720px)').matches
    const engine = Matter.Engine.create({ gravity: { x: 0, y: compact ? 0.8 : 1.05, scale: 0.001 } })
    engineRef.current = engine
    const els = [...node.querySelectorAll('[data-physics-item]')]
    const mouse = Matter.Mouse.create(node)
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
    const drag = Matter.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } } })
    mouseConstraint.current = drag
    Matter.Composite.add(engine.world, drag)
    let walls = []
    const build = () => {
      const { width, height } = node.getBoundingClientRect()
      const compactLayout = width <= 720
      engine.gravity.y = gravityEnabled.current ? (compactLayout ? 0.8 : 1.05) : 0
      const itemWidth = els[0]?.offsetWidth || 84
      const itemHeight = els[0]?.offsetHeight || 96
      const columns = Math.max(1, Math.floor(width / (itemWidth + (compactLayout ? 5 : 10))))
      const rows = Math.ceil(els.length / columns)
      const neededHeight = compactLayout
        ? Math.max(500, rows * (itemHeight + 6) + 64)
        : Math.max(420, rows * 73 + 50)
      if (Math.abs(height - neededHeight) > 1) node.style.setProperty('--physics-field-height', `${neededHeight}px`)
      walls.forEach((wall) => Matter.Composite.remove(engine.world, wall))
      walls = [
        Matter.Bodies.rectangle(width / 2, height + 45, width + 100, 90, { isStatic: true }),
        Matter.Bodies.rectangle(-45, height / 2, 90, height * 2, { isStatic: true }),
        Matter.Bodies.rectangle(width + 45, height / 2, 90, height * 2, { isStatic: true }),
      ]
      Matter.Composite.add(engine.world, walls)
      if (bodies.current.length) {
        bodies.current.forEach((body, index) => {
          Matter.Body.setPosition(body, {
            x: Math.min(width - 40, Math.max(40, body.position.x)),
            y: Math.min(height - 48, Math.max(48, body.position.y)),
          })
          if (els[index]) { body.plugin.el = els[index] }
        })
      }
    }
    const width = node.clientWidth
    const compactLayout = width <= 720
    const itemWidth = els[0]?.offsetWidth || 84
    const itemHeight = els[0]?.offsetHeight || 96
    const columns = Math.max(1, Math.floor(width / (itemWidth + (compactLayout ? 5 : 10))))
    const rows = Math.ceil(els.length / columns)
    const neededHeight = compactLayout ? Math.max(500, rows * (itemHeight + 6) + 64) : 0
    const compactRowStep = compactLayout ? (neededHeight - 64) / Math.max(rows, 1) : 73
    bodies.current = els.map((el, index) => {
      const w = compactLayout ? el.offsetWidth : Math.max(66, el.offsetWidth)
      const h = compactLayout ? el.offsetHeight : Math.max(66, el.offsetHeight)
      const x = compactLayout ? ((index % columns) + 0.5) * (width / columns) : 44 + (index % columns) * (width / columns)
      const y = compactLayout
        ? 32 + Math.floor(index / columns) * compactRowStep + itemHeight / 2
        : 30 + Math.floor(index / columns) * 73
      const body = Matter.Bodies.rectangle(x, y, w * (compactLayout ? 0.86 : 0.77), h * (compactLayout ? 0.86 : 0.76), { restitution: 0.7, friction: 0.035, frictionAir: 0.008, chamfer: { radius: 14 } })
      body.plugin.el = el
      return body
    })
    Matter.Composite.add(engine.world, bodies.current)
    build()
    let frame
    const tick = () => {
      Matter.Engine.update(engine, 1000 / 60)
      bodies.current.forEach((body) => {
        const el = body.plugin.el
        if (el) el.style.transform = `translate3d(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px, 0) rotate(${body.angle}rad)`
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const resize = new ResizeObserver(build)
    resize.observe(node)
    const shake = () => bodies.current.forEach((body) => {
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 24, y: -(8 + Math.random() * 15) })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3)
    })
    const setGravity = (event) => {
      gravityEnabled.current = Boolean(event.detail?.enabled)
      engine.gravity.y = gravityEnabled.current ? (node.clientWidth <= 720 ? 0.8 : 1.05) : 0
    }
    window.addEventListener('reference-physics-shake', shake)
    window.addEventListener('reference-physics-gravity', setGravity)
    return () => { cancelAnimationFrame(frame); resize.disconnect(); window.removeEventListener('reference-physics-shake', shake); window.removeEventListener('reference-physics-gravity', setGravity); Matter.Engine.clear(engine); Matter.Composite.clear(engine.world); bodies.current = []; mouseConstraint.current = null }
  }, [items])
  const nudge = (event) => {
    if (mouseConstraint.current?.constraint?.bodyB) return
    const bounds = field.current.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    bodies.current.forEach((body) => {
      const d = Matter.Vector.sub(body.position, { x, y })
      const distance = Matter.Vector.magnitude(d)
      if (distance < 180) {
        const force = Matter.Vector.mult(Matter.Vector.normalise(d), (180 - distance) * 0.00015)
        Matter.Body.applyForce(body, body.position, force)
      }
    })
  }
  const startGesture = (event, tech) => {
    gesture.current = { id: tech.id, x: event.clientX, y: event.clientY, moved: false }
  }
  const trackGesture = (event, tech) => {
    const current = gesture.current
    if (!current || current.id !== tech.id) return
    if (Math.hypot(event.clientX - current.x, event.clientY - current.y) > 8) current.moved = true
  }
  const suppressDragClick = (event, tech) => {
    if (gesture.current?.id === tech.id && gesture.current.moved) {
      event.preventDefault()
      event.stopPropagation()
    }
    gesture.current = null
  }
  return <div className="physics-field-viewport">
    <div className="physics-field grain-card" ref={field} style={{ '--physics-field-height': '650px' }} onPointerMove={nudge} aria-label="Interactive physics field of technology icons">
      <span className="physics-corner">A TOOLBOX, IN MOTION</span>
      {items.map((tech, index) => <span className="physics-item" key={tech.id} data-physics-item style={{ '--item-index': index }} onPointerDown={(event) => startGesture(event, tech)} onPointerMove={(event) => trackGesture(event, tech)} onClickCapture={(event) => suppressDragClick(event, tech)} onPointerCancel={() => { gesture.current = null }}><TechLamp tech={tech} compact className="!rounded-none border-0 bg-transparent shadow-none" /></span>)}
      <span className="physics-floor">DRAG TO DROP · CLICK TO OPEN</span>
    </div>
  </div>
}
