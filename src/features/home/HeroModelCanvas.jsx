import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, useGLTF } from '@react-three/drei'
import { portfolioAssets } from '../../lib/assets.js'

function Model({ drag, motion }) {
  const { scene } = useGLTF(portfolioAssets.models.hero)
  const size = useThree((state) => state.size)
  const invalidate = useThree((state) => state.invalidate)
  const root = useRef(null)
  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((node) => {
      if (!node.isMesh) return
      node.castShadow = false
      node.receiveShadow = false
      const makeMetallic = (material) => {
        const next = material.clone()
        if ('metalness' in next) next.metalness = 0.3
        if ('roughness' in next) next.roughness = Math.min(next.roughness ?? 0.7, 0.48)
        if ('envMapIntensity' in next) next.envMapIntensity = 1.15
        return next
      }
      node.material = Array.isArray(node.material) ? node.material.map(makeMetallic) : makeMetallic(node.material)
    })
    return clone
  }, [scene])

  useFrame((state, delta) => {
    if (!root.current) return
    const frameDelta = Math.min(delta, 0.05)
    const ease = 1 - Math.exp(-9 * frameDelta)
    const targetX = drag.current.pitch
    const targetY = -Math.PI / 2 + drag.current.yaw
    root.current.rotation.x += (targetX - root.current.rotation.x) * ease
    root.current.rotation.y += (targetY - root.current.rotation.y) * ease
    if (motion) root.current.position.y = -0.06 + Math.sin(state.clock.elapsedTime * 0.7) * 0.045
    else root.current.position.y = -0.06

    const stillMoving = Math.abs(targetX - root.current.rotation.x) > 0.001
      || Math.abs(targetY - root.current.rotation.y) > 0.001
    if (stillMoving) invalidate()
  })

  return (
    <group ref={root} rotation={[0, -Math.PI / 2, 0]}>
      <Float speed={motion ? 0.75 : 0} rotationIntensity={0} floatIntensity={motion ? 0.14 : 0}>
        <primitive
          object={model}
          scale={size.width < 760 ? 2 : size.width < 1024 ? 2.4 : 2.8}
          position={[0, size.width < 760 ? 0.16 : size.width < 1024 ? 0.02 : -0.08, 0]}
        />
      </Float>
    </group>
  )
}

class ModelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <div className="hero-model-error" role="status">3D portrait could not load</div>
    return this.props.children
  }
}

export default function HeroModelCanvas({ interactionRef }) {
  const wrapper = useRef(null)
  const drag = useRef({ active: false, pointerId: null, lastX: 0, lastY: 0, yaw: 0, pitch: 0 })
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible')
  const [lights, setLights] = useState({ ivory: '#ffffff', rose: '#ffffff', deepRose: '#ffffff', warm: '#ffffff', ring: '#ffffff' })
  const reduceMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    const node = wrapper.current
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' })
    observer.observe(node)
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    const readTheme = () => {
      const styles = getComputedStyle(document.documentElement)
      setLights({
        ivory: styles.getPropertyValue('--hero-light-ivory').trim() || '#ffffff',
        rose: styles.getPropertyValue('--hero-light-rose').trim() || '#ffffff',
        deepRose: styles.getPropertyValue('--hero-light-deep-rose').trim() || '#ffffff',
        warm: styles.getPropertyValue('--hero-light-warm').trim() || '#ffffff',
        ring: styles.getPropertyValue('--hero-light-ring').trim() || '#ffffff',
      })
    }
    document.addEventListener('visibilitychange', onVisibility)
    readTheme()
    const themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('portfolio-theme-change', readTheme)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      themeObserver.disconnect()
      window.removeEventListener('portfolio-theme-change', readTheme)
    }
  }, [])

  useEffect(() => {
    const begin = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      drag.current.active = true
      drag.current.pointerId = event.pointerId ?? null
      drag.current.lastX = event.clientX
      drag.current.lastY = event.clientY
      interactionRef.current?.invalidate?.()
    }
    const move = (event) => {
      const current = drag.current
      if (!current.active || (current.pointerId !== null && event.pointerId !== current.pointerId)) return
      const bounds = wrapper.current?.getBoundingClientRect()
      if (!bounds) return
      const dx = event.clientX - current.lastX
      const dy = event.clientY - current.lastY
      current.lastX = event.clientX
      current.lastY = event.clientY
      current.yaw = Math.max(-1.25, Math.min(1.25, current.yaw + (dx / bounds.width) * 3.8))
      current.pitch = Math.max(-0.72, Math.min(0.72, current.pitch + (dy / bounds.height) * 3.1))
      interactionRef.current?.invalidate?.()
    }
    const end = (event) => {
      const current = drag.current
      if (!current.active || (current.pointerId !== null && event.pointerId !== current.pointerId)) return
      current.active = false
      current.pointerId = null
    }
    const nudge = (yaw, pitch) => {
      drag.current.yaw = Math.max(-1.25, Math.min(1.25, drag.current.yaw + yaw))
      drag.current.pitch = Math.max(-0.72, Math.min(0.72, drag.current.pitch + pitch))
      interactionRef.current?.invalidate?.()
    }

    if (interactionRef) interactionRef.current = { begin, nudge, invalidate: interactionRef.current?.invalidate }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      if (interactionRef?.current?.begin === begin) interactionRef.current = null
    }
  }, [interactionRef])

  const rendering = visible && pageVisible
  const beginDrag = (event) => {
    if (event.button !== undefined && event.button !== 0) return
    event.preventDefault()
    interactionRef?.current?.begin(event.nativeEvent || event)
  }
  const rotateByKeyboard = (event) => {
    const directions = {
      ArrowLeft: [-0.18, 0], ArrowRight: [0.18, 0], ArrowUp: [0, -0.14], ArrowDown: [0, 0.14],
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    interactionRef?.current?.nudge(...direction)
  }

  return (
    <>
      <div className="hero-model-canvas" ref={wrapper}>
        <ModelErrorBoundary>
          <Canvas dpr={[1, 1.35]} frameloop={!rendering ? 'never' : reduceMotion ? 'demand' : 'always'} camera={{ position: [0, 0, 5.6], fov: 35 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
            <CanvasVisibility active={rendering} interactionRef={interactionRef} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 4, 5]} intensity={2.4} color={lights.ivory} />
            <directionalLight position={[-3, 1, 3]} intensity={1.65} color={lights.rose} />
            <pointLight position={[0, -1.5, 2]} intensity={0.8} distance={5} color={lights.deepRose} />
            <pointLight position={[2, 1, -2]} intensity={1.3} distance={6} color={lights.warm} />
            <Suspense fallback={<Html center><span className="hero-model-loading">LOADING 3D PORTRAIT</span></Html>}>
              <Model drag={drag} motion={!reduceMotion} />
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      </div>
      <div
        className="hero-model-hit-area"
        role="button"
        tabIndex={0}
        aria-label="Drag to rotate Ashok’s 3D portrait, or use arrow keys"
        onPointerDown={beginDrag}
        onKeyDown={rotateByKeyboard}
      />
    </>
  )
}

useGLTF.preload(portfolioAssets.models.hero)

function CanvasVisibility({ active, interactionRef }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    if (interactionRef?.current) interactionRef.current.invalidate = invalidate
    if (active) invalidate()
  }, [active, invalidate, interactionRef])
  return null
}
