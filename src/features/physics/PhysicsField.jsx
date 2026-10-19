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

    const handleTouchMove = (e) => {
      // Only prevent native page scroll if the user is actively dragging a physics body
      if (drag.constraint.bodyB && e.cancelable) {
        e.preventDefault()
      }
    }
    node.addEventListener('touchmove', handleTouchMove, { passive: false })

    let walls = []
    const build = () => {
      const { width, height } = node.getBoundingClientRect()
      const compactLayout = width <= 720
      engine.gravity.y = gravityEnabled.current ? (compactLayout ? 0.95 : 1.05) : 0
      const itemWidth = els[0]?.offsetWidth || (compactLayout ? 46 : 82)
      const itemHeight = els[0]?.offsetHeight || (compactLayout ? 55 : 98)
      const compactGutter = 4
      const columns = compactLayout
        ? Math.min(6, Math.max(4, Math.floor((width - 16) / (itemWidth + compactGutter))))
        : Math.max(1, Math.floor(width / (itemWidth + 10)))
      const rows = Math.ceil(els.length / columns)
      const neededHeight = compactLayout
        ? Math.min(320, Math.max(270, rows * 40 + 46))
        : Math.max(420, rows * 73 + 50)
      if (Math.abs(height - neededHeight) > 1) node.style.setProperty('--physics-field-height', `${neededHeight}px`)
      walls.forEach((wall) => Matter.Composite.remove(engine.world, wall))
      walls = [
        Matter.Bodies.rectangle(width / 2, height + 300, width + 1200, 600, { isStatic: true, friction: 0.1 }),
        Matter.Bodies.rectangle(-200, height / 2, 400, height * 6, { isStatic: true }),
        Matter.Bodies.rectangle(width + 200, height / 2, 400, height * 6, { isStatic: true }),
      ]
      Matter.Composite.add(engine.world, walls)
      if (bodies.current.length) {
        bodies.current.forEach((body, index) => {
          const el = body.plugin.el || els[index]
          const halfH = (el?.offsetHeight || (compactLayout ? 55 : 98)) / 2
          const maxY = height - halfH - 2
          Matter.Body.setPosition(body, {
            x: Math.min(width - 24, Math.max(24, body.position.x)),
            y: Math.min(maxY, Math.max(28, body.position.y)),
          })
          if (els[index]) { body.plugin.el = els[index] }
        })
      }
    }
    const width = node.clientWidth
    const compactLayout = width <= 720
    const itemWidth = els[0]?.offsetWidth || (compactLayout ? 46 : 82)
    const itemHeight = els[0]?.offsetHeight || (compactLayout ? 55 : 98)
    const compactGutter = 4
    const columns = compactLayout
      ? Math.min(6, Math.max(4, Math.floor((width - 16) / (itemWidth + compactGutter))))
      : Math.max(1, Math.floor(width / (itemWidth + 10)))
    const rows = Math.ceil(els.length / columns)
    const neededHeight = compactLayout
      ? Math.min(320, Math.max(270, rows * 40 + 46))
      : Math.max(420, rows * 73 + 50)
    const totalWidth = columns * (itemWidth + compactGutter)
    const startX = compactLayout
      ? Math.max(itemWidth / 2 + 8, (width - totalWidth) / 2 + itemWidth / 2)
      : 44
    const compactRowStep = compactLayout ? Math.min(38, (neededHeight - 44) / Math.max(rows, 1)) : 73
    bodies.current = els.map((el, index) => {
      const w = compactLayout ? (el.offsetWidth || 46) : Math.max(66, el.offsetWidth || 82)
      const h = compactLayout ? (el.offsetHeight || 55) : Math.max(66, el.offsetHeight || 98)
      const col = index % columns
      const row = Math.floor(index / columns)
      const x = compactLayout
        ? startX + col * (itemWidth + compactGutter)
        : 44 + col * (width / columns)
      const y = compactLayout
        ? 12 + row * (compactRowStep || 36) + h / 2
        : 30 + row * 73
      const body = Matter.Bodies.rectangle(
        x,
        y,
        w * (compactLayout ? 0.72 : 0.84),
        h * (compactLayout ? 0.72 : 0.84),
        {
          restitution: compactLayout ? 0.35 : 0.65,
          friction: compactLayout ? 0.05 : 0.04,
          frictionAir: compactLayout ? 0.012 : 0.009,
          chamfer: { radius: compactLayout ? 6 : 14 }
        }
      )
      body.plugin.el = el
      return body
    })
    Matter.Composite.add(engine.world, bodies.current)
    build()

    const constrainDragAndFloor = () => {
      const { width, height } = node.getBoundingClientRect()
      const compactLayout = width <= 720
      if (drag.constraint.bodyB) {
        const body = drag.constraint.bodyB
        const el = body.plugin.el
        const halfH = (el?.offsetHeight || (compactLayout ? 55 : 98)) / 2
        const maxY = height - halfH - 2
        if (mouse.position.y > maxY) {
          mouse.position.y = maxY
        }
        if (drag.constraint.pointA && drag.constraint.pointA.y > maxY) {
          drag.constraint.pointA.y = maxY
        }
        if (body.position.y > maxY) {
          Matter.Body.setPosition(body, { x: body.position.x, y: maxY })
          if (body.velocity.y > 0) Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 })
        }
        if (mouse.position.y > height + 50) {
          drag.constraint.bodyB = null
        }
      }
    }
    Matter.Events.on(engine, 'beforeUpdate', constrainDragAndFloor)

    let frame
    const tick = () => {
      Matter.Engine.update(engine, 1000 / 60)
      const { width, height } = node.getBoundingClientRect()
      const compactLayout = width <= 720
      bodies.current.forEach((body) => {
        const el = body.plugin.el
        const halfH = (el?.offsetHeight || (compactLayout ? 55 : 98)) / 2
        const halfW = (el?.offsetWidth || (compactLayout ? 46 : 82)) / 2
        const maxY = height - halfH - 2
        if (body.position.y > maxY) {
          Matter.Body.setPosition(body, { x: body.position.x, y: maxY })
          if (body.velocity.y > 0) {
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 })
          }
        }
        if (body.position.x < halfW) {
          Matter.Body.setPosition(body, { x: halfW, y: body.position.y })
          if (body.velocity.x < 0) {
            Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y })
          }
        } else if (body.position.x > width - halfW) {
          Matter.Body.setPosition(body, { x: width - halfW, y: body.position.y })
          if (body.velocity.x > 0) {
            Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y })
          }
        }
        if (el) {
          el.style.transform = `translate3d(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px, 0) rotate(${body.angle}rad)`
        }
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
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      Matter.Events.off(engine, 'beforeUpdate', constrainDragAndFloor)
      node.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('reference-physics-shake', shake)
      window.removeEventListener('reference-physics-gravity', setGravity)
      Matter.Engine.clear(engine)
      Matter.Composite.clear(engine.world)
      bodies.current = []
      mouseConstraint.current = null
    }
  }, [items])
  const nudge = (event) => {
    if (event.pointerType === 'touch') return
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
    <div className="physics-field" ref={field} style={{ '--physics-field-height': '460px' }} onPointerMove={nudge} aria-label="Interactive physics field of technology icons">
      <span className="physics-corner">A TOOLBOX, IN MOTION</span>
      {items.map((tech, index) => <span className="physics-item" key={tech.id} data-physics-item style={{ '--item-index': index }} onPointerDown={(event) => startGesture(event, tech)} onPointerMove={(event) => trackGesture(event, tech)} onClickCapture={(event) => suppressDragClick(event, tech)} onPointerCancel={() => { gesture.current = null }}><TechLamp tech={tech} compact className="!rounded-none border-0 bg-transparent shadow-none" /></span>)}
      <span className="physics-floor">DRAG TO DROP · CLICK TO OPEN</span>
    </div>
  </div>
}
