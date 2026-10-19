import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, useGLTF } from '@react-three/drei'
import { portfolioAssets } from '../../lib/assets.js'

function Model({ pointer, motion }) {
  const { scene } = useGLTF(portfolioAssets.models.hero)
  const size = useThree((state) => state.size)
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
    if (!motion) return
    const t = state.clock.elapsedTime
    // Pointer values are only updated by ray hits on the model's own meshes.
    // The base yaw keeps the portrait facing forward while hover adds a subtle look.
    const active = pointer.current.active
    const ease = Math.min(delta * 2.4, 1)
    root.current.rotation.x += ((active ? -pointer.current.y * 0.085 : 0) - root.current.rotation.x) * ease
    root.current.rotation.y += ((-Math.PI / 2 + (active ? pointer.current.x * 0.13 : 0)) - root.current.rotation.y) * ease
    root.current.position.y = -0.06 + Math.sin(t * 0.7) * 0.045
  })

  const updatePointer = (event) => {
    event.stopPropagation()
    const mobile = size.width < 760
    const modelCenterX = mobile ? 0 : 0.36
    const modelCenterY = mobile ? 0.28 : -0.02
    pointer.current = {
      active: true,
      x: Math.max(-1, Math.min(1, (event.pointer.x - modelCenterX) * 1.7)),
      y: Math.max(-1, Math.min(1, (event.pointer.y - modelCenterY) * 1.7)),
    }
  }
  const releasePointer = (event) => {
    event.stopPropagation()
    pointer.current.active = false
  }

  return (
    <group ref={root} rotation={[0, -Math.PI / 2, 0]}>
      <Float speed={motion ? 0.75 : 0} rotationIntensity={0} floatIntensity={motion ? 0.14 : 0}>
        <primitive
          object={model}
          scale={size.width < 760 ? 2.3 : 2.8}
          position={[0, size.width < 760 ? 0.16 : -0.08, 0]}
          onPointerOver={updatePointer}
          onPointerMove={updatePointer}
          onPointerOut={releasePointer}
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

export default function HeroModelCanvas() {
  const wrapper = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
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

  const rendering = visible && pageVisible
  return (
    <div className="hero-model-canvas" ref={wrapper} role="img" aria-label="Interactive 3D portrait of Ashok Kumar. Drag to rotate.">
      <ModelErrorBoundary>
        <Canvas dpr={[1, 1.35]} frameloop={!rendering ? 'never' : reduceMotion ? 'demand' : 'always'} camera={{ position: [0, 0, 5.6], fov: 35 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
          <CanvasVisibility active={rendering} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 4, 5]} intensity={2.4} color={lights.ivory} />
            <directionalLight position={[-3, 1, 3]} intensity={1.65} color={lights.rose} />
            <pointLight position={[0, -1.5, 2]} intensity={0.8} distance={5} color={lights.deepRose} />
            <pointLight position={[2, 1, -2]} intensity={1.3} distance={6} color={lights.warm} />
            <Suspense fallback={<Html center><span className="hero-model-loading">LOADING 3D PORTRAIT</span></Html>}>
              <Model pointer={pointer} motion={!reduceMotion} />
            </Suspense>
          </Canvas>
      </ModelErrorBoundary>
    </div>
  )
}

useGLTF.preload(portfolioAssets.models.hero)

function CanvasVisibility({ active }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => { if (active) invalidate() }, [active, invalidate])
  return null
}
