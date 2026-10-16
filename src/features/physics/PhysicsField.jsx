import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import TechLamp from '../../components/tech/TechLamp.jsx'

export default function PhysicsField({ items }) {
  const field = useRef(null)
  const bodies = useRef([])
  const engineRef = useRef(null)
  const mouseConstraint = useRef(null)
  const gesture = useRef(null)
  useEffect(() => {
    const node = field.current
    if (!node) return
    const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.05, scale: 0.001 } })
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
      const columns = Math.max(3, Math.floor(width / 94))
      const neededHeight = Math.max(450, Math.ceil(els.length / columns) * 73 + 150)
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
          Matter.Body.setPosition(body, { x: Math.min(width - 42, Math.max(42, body.position.x)), y: body.position.y })
          if (els[index]) { body.plugin.el = els[index] }
        })
      }
    }
    const width = node.clientWidth
    const columns = Math.max(3, Math.floor(width / 94))
    bodies.current = els.map((el, index) => {
      const w = Math.max(66, el.offsetWidth)
      const h = Math.max(66, el.offsetHeight)
      const body = Matter.Bodies.rectangle(44 + (index % columns) * (width / columns), 30 + Math.floor(index / columns) * 73, w * 0.77, h * 0.76, { restitution: 0.7, friction: 0.035, frictionAir: 0.008, chamfer: { radius: 14 } })
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
    return () => { cancelAnimationFrame(frame); resize.disconnect(); Matter.Engine.clear(engine); Matter.Composite.clear(engine.world); bodies.current = []; mouseConstraint.current = null }
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
  return <div className="physics-field" ref={field} style={{ '--physics-field-height': '650px' }} onPointerMove={nudge} aria-label="Interactive physics field of technology icons">
    <span className="physics-corner">A TOOLBOX, IN MOTION</span>
    {items.map((tech, index) => <span className="physics-item" key={tech.id} data-physics-item style={{ '--item-index': index }} onPointerDown={(event) => startGesture(event, tech)} onPointerMove={(event) => trackGesture(event, tech)} onClickCapture={(event) => suppressDragClick(event, tech)} onPointerCancel={() => { gesture.current = null }}><TechLamp tech={tech} compact /></span>)}
    <span className="physics-floor">DRAG TO DROP · CLICK TO OPEN</span>
  </div>
}
