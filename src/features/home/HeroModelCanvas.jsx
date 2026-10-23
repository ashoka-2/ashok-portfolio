import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { portfolioAssets } from '../../lib/assets.js'
import SymbioteOverlay from './SymbioteOverlay.jsx'
import { symbioteStore } from './symbioteStore.js'
import { patchSymbioteMaterial, updateSymbioteMaterials, setSymbioteMode } from './symbioteInfection.js'

function projectToScreen(point, camera, target) {
  target.copy(point).project(camera)
  return target
}

function Model({ drag, motion }) {
  const { scene } = useGLTF(portfolioAssets.models.hero)
  const size = useThree((state) => state.size)
  const camera = useThree((state) => state.camera)
  const gl = useThree((state) => state.gl)
  const root = useRef(null)
  const materials = useRef([])
  const screen = useRef({ width: 1, height: 1 })
  const chestLocal = useRef(new THREE.Vector3())
  const chestWorld = useRef(new THREE.Vector3())
  const projected = useRef(new THREE.Vector3())

  /* Inertia, look, and lean state */
  const motionState = useRef({
    yawUser: 0,
    pitchUser: 0,
    yawVel: 0,
    yawF: 0,
    pitchF: 0,
    lean: 0,
    idleT: 0,
  })

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const materialList = []
    const meshNodes = []
    const localBounds = new THREE.Box3()

    clone.traverse((node) => {
      if (!node.isMesh) return
      node.geometry.computeBoundingBox()
      localBounds.union(node.geometry.boundingBox)
      meshNodes.push(node)
    })

    const localSize = localBounds.getSize(new THREE.Vector3())
    const center = localBounds.getCenter(new THREE.Vector3())
    const headThreshold = localBounds.max.y - localSize.y * 0.13
    let headX = 0, headZ = 0, headCount = 0

    for (const node of meshNodes) {
      const positions = node.geometry.attributes.position
      for (let i = 0; i < positions.count; i++) {
        if (positions.getY(i) < headThreshold) continue
        headX += positions.getX(i)
        headZ += positions.getZ(i)
        headCount++
      }
    }

    const faceFrame = {
      center: new THREE.Vector3(
        headCount ? headX / headCount : center.x,
        0,
        headCount ? headZ / headCount : center.z
      ),
      forward: new THREE.Vector2(1, 0),
      headHalf: localSize.y * 0.056,
      eyeY: localBounds.max.y - localSize.y * 0.072,
    }

    /* Chest point in model coordinates (27% down from top) */
    chestLocal.current.set(center.x, localBounds.max.y - 0.27 * localSize.y, center.z)

    for (const node of meshNodes) {
      node.castShadow = false
      node.receiveShadow = false
      const makeMetallic = (sourceMaterial) => {
        const next = patchSymbioteMaterial(sourceMaterial, faceFrame)
        if ('metalness' in next) next.metalness = 0.3
        if ('roughness' in next) next.roughness = Math.min(next.roughness ?? 0.7, 0.48)
        if ('envMapIntensity' in next) next.envMapIntensity = 1.15
        materialList.push(next)
        return next
      }
      node.material = Array.isArray(node.material)
        ? node.material.map(makeMetallic)
        : makeMetallic(node.material)
    }

    materials.current = materialList
    clone.updateMatrixWorld(true)
    return { object: clone, bounds: localBounds }
  }, [scene])

  useEffect(() => {
    const canvas = gl.domElement
    const update = () => {
      const rect = canvas.getBoundingClientRect()
      screen.current = { width: rect.width, height: rect.height }
    }
    const observer = new ResizeObserver(update)
    observer.observe(canvas)
    window.addEventListener('resize', update)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [gl])

  useEffect(() => () => {
    materials.current.forEach((m) => m.dispose())
  }, [])

  useFrame((state, delta) => {
    if (!root.current) return
    const dt = Math.min(0.032, Math.max(0.001, delta))
    const storeState = symbioteStore.state
    const m = motionState.current
    const W = screen.current.width || 1
    const H = screen.current.height || 1

    /* Update drag physics with inertia and gentle snap return */
    const ddx = drag.current.dx || 0
    const ddy = drag.current.dy || 0
    drag.current.dx = 0
    drag.current.dy = 0

    if (drag.current.active) {
      m.yawUser += ddx * 0.011
      m.pitchUser = Math.max(-0.55, Math.min(0.55, m.pitchUser + ddy * 0.006))
      m.yawVel += (Math.max(-14, Math.min(14, (ddx * 0.011) / dt)) - m.yawVel) * Math.min(1, dt * 16)
      m.idleT = 0
    } else {
      m.yawUser += m.yawVel * dt
      m.yawVel *= Math.pow(0.06, dt)
      m.idleT += dt
      if (m.idleT > 6 && Math.abs(m.yawVel) < 0.15) {
        const tg0 = Math.round(m.yawUser / (Math.PI * 2)) * (Math.PI * 2)
        const k2 = Math.min(1, dt * 1.6)
        m.yawUser += (tg0 - m.yawUser) * k2
        m.pitchUser += (0 - m.pitchUser) * k2
      }
    }

    /* Soft cursor look when pointer is inside hero */
    const fol = storeState.pointerInside && !drag.current.active
    const targetYawF = fol ? Math.max(-0.55, Math.min(0.55, (storeState.smoothX / W - 0.5) * 0.9)) : 0
    const targetPitchF = fol ? Math.max(-0.3, Math.min(0.3, (storeState.smoothY / H - 0.38) * 0.5)) : 0
    m.yawF += (targetYawF - m.yawF) * Math.min(1, dt * 4)
    m.pitchF += (targetPitchF - m.pitchF) * Math.min(1, dt * 4)

    /* Lean toward cursor during venom mode */
    const venom = (storeState.phase === 'hold') || (storeState.phase === 'cover' && storeState.infection > 0.88)
    const leanT = (venom && storeState.pointerInside)
      ? Math.max(-1, Math.min(1, (storeState.smoothX - W / 2) / (W * 0.5))) * (0.12 + 0.2 * storeState.proximity)
      : 0
    m.lean += (leanT * 0.8 - m.lean) * (1 - Math.exp(-4 * dt))

    /* Apply transformations to character group */
    root.current.rotation.set(m.pitchUser + m.pitchF, -Math.PI / 2 + m.yawUser + m.yawF, 0)

    const baseY = size.width < 760 ? 0.16 : size.width < 1024 ? 0.02 : -0.08
    const breath = motion ? Math.sin(state.clock.elapsedTime * 1.7) * 0.025 * storeState.infection : 0
    root.current.position.set(m.lean, baseY + breath, 0)

    const baseScale = size.width < 760 ? 2 : size.width < 1024 ? 2.4 : 2.8
    const swell = 1 + (motion ? 0.012 * storeState.infection * Math.sin(state.clock.elapsedTime * 2.3) : 0) + 0.05 * storeState.roar
    root.current.scale.setScalar(baseScale * swell)

    model.object.updateMatrixWorld(true)

    /* Project chest point to hero-local CSS coordinates */
    chestWorld.current.copy(chestLocal.current)
    model.object.localToWorld(chestWorld.current)
    projectToScreen(chestWorld.current, camera, projected.current)
    storeState.chestX = (projected.current.x * 0.5 + 0.5) * W
    storeState.chestY = (-projected.current.y * 0.5 + 0.5) * H

    /* Update material uniforms */
    updateSymbioteMaterials(
      materials.current,
      state.clock.elapsedTime,
      storeState.face || 0,
      storeState.open || 0.5
    )

    /* Mask Pass: if infection or face is active, render uMode=1 synchronously into maskCanvas */
    if (storeState.infection > 0.002 || storeState.face > 0.01) {
      if (!storeState.maskCanvas) {
        storeState.maskCanvas = document.createElement('canvas')
      }
      const mc = storeState.maskCanvas
      const ts = Math.min(1, 1400 / Math.max(W, H))
      const mw = Math.ceil(W * ts)
      const mh = Math.ceil(H * ts)
      if (mc.width !== mw || mc.height !== mh) {
        mc.width = mw
        mc.height = mh
      }
      const ctx = mc.getContext('2d')
      if (ctx) {
        setSymbioteMode(materials.current, 1)
        gl.render(state.scene, camera)
        ctx.clearRect(0, 0, mw, mh)
        ctx.drawImage(gl.domElement, 0, 0, mw, mh)
        storeState.maskDirty = true
        setSymbioteMode(materials.current, 0)
      }
    }
  })

  return (
    <group ref={root} rotation={[0, -Math.PI / 2, 0]}>
      <primitive
        object={model.object}
        position={[0, 0, 0]}
      />
    </group>
  )
}

class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return <div className="hero-model-error" role="status">3D portrait could not load</div>
    }
    return this.props.children
  }
}

export default function HeroModelCanvas({ interactionRef }) {
  const wrapper = useRef(null)
  const invalidateRef = useRef(null)
  const buttonRef = useRef(null)
  const hostAreaRef = useRef(null)
  const drag = useRef({ active: false, pointerId: null, lastX: 0, lastY: 0, dx: 0, dy: 0 })
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible')
  const [lights, setLights] = useState({
    ivory: '#ffffff',
    rose: '#ffffff',
    deepRose: '#ffffff',
    warm: '#ffffff',
    ring: '#ffffff',
  })
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
    buttonRef.current = document.querySelector('.symbiote-trigger')

    const begin = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      drag.current.active = true
      drag.current.pointerId = event.pointerId ?? null
      drag.current.lastX = event.clientX
      drag.current.lastY = event.clientY
      drag.current.dx = 0
      drag.current.dy = 0
      invalidateRef.current?.()
    }

    const move = (event) => {
      const current = drag.current
      if (!current.active || (current.pointerId !== null && event.pointerId !== current.pointerId)) return
      const ddx = event.clientX - current.lastX
      const ddy = event.clientY - current.lastY
      current.lastX = event.clientX
      current.lastY = event.clientY
      current.dx += ddx
      current.dy += ddy
      invalidateRef.current?.()
    }

    const end = (event) => {
      const current = drag.current
      if (!current.active || (current.pointerId !== null && event.pointerId !== current.pointerId)) return
      current.active = false
      current.pointerId = null
    }

    const nudge = (yaw, pitch) => {
      drag.current.dx += yaw * 80
      drag.current.dy += pitch * 80
      invalidateRef.current?.()
    }

    if (interactionRef) interactionRef.current = { begin, nudge, leave: () => {} }
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
  const onCanvasCreated = ({ invalidate }) => {
    invalidateRef.current = invalidate
    if (rendering) invalidate()
  }

  useEffect(() => {
    if (rendering) invalidateRef.current?.()
  }, [rendering])

  const rotateByKeyboard = (event) => {
    const directions = {
      ArrowLeft: [-0.18, 0],
      ArrowRight: [0.18, 0],
      ArrowUp: [0, -0.14],
      ArrowDown: [0, 0.14],
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    interactionRef?.current?.nudge(...direction)
  }

  return (
    <>
      <div className="hero-model-canvas absolute inset-0 z-[3] pointer-events-none" ref={wrapper}>
        <ModelErrorBoundary>
          <Canvas
            onCreated={onCanvasCreated}
            dpr={[1, 1.35]}
            frameloop={!rendering ? 'never' : reduceMotion ? 'demand' : 'always'}
            camera={{ position: [0, 0, 5.6], fov: 35 }}
            gl={{
              alpha: true,
              antialias: false,
              preserveDrawingBuffer: true,
              powerPreference: 'low-power',
            }}
          >
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

      <SymbioteOverlay
        buttonRef={buttonRef}
        heroRef={wrapper}
        active={rendering}
        invalidateRef={invalidateRef}
      />

      <div
        className="hero-model-hit-area absolute z-[4] top-[9%] left-1/2 h-[67%] w-[min(58vw,560px)] -translate-x-1/2 outline-none cursor-grab active:cursor-grabbing touch-none pointer-events-auto max-[520px]:top-[17%] max-[520px]:h-[55%] max-[520px]:w-[min(90vw,440px)] min-[521px]:max-[820px]:top-[12%] min-[521px]:max-[820px]:h-[62%] min-[521px]:max-[820px]:w-[min(76vw,620px)] min-[821px]:max-[999px]:top-[12%] min-[821px]:max-[999px]:h-[58%] min-[821px]:max-[999px]:w-[min(58vw,520px)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--hero-light-rose)_78%,transparent)] focus-visible:-outline-offset-8 focus-visible:rounded-[45%]"
        ref={hostAreaRef}
        role="button"
        tabIndex={0}
        aria-label="Drag to rotate Ashok’s 3D portrait, or use arrow keys"
        onPointerDown={(event) => interactionRef?.current?.begin?.(event.nativeEvent || event)}
        onKeyDown={rotateByKeyboard}
      />
    </>
  )
}

useGLTF.preload(portfolioAssets.models.hero)
