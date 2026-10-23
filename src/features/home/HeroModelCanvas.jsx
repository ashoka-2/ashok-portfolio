import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { portfolioAssets } from '../../lib/assets.js'
import SymbioteWebGL from './SymbioteWebGL.jsx'

function Model({ drag, motion, infectionRef, characterRef }) {
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
        next.userData.symbioteBaseRoughness = next.roughness
        next.userData.symbioteUniform = { value: 0 }
        next.onBeforeCompile = (shader) => {
          shader.uniforms.uSymbioteInfection = next.userData.symbioteUniform
          shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vSymbioteWorldPosition;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSymbioteWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;')
          shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vSymbioteWorldPosition;\nuniform float uSymbioteInfection;')
            .replace('#include <color_fragment>', `#include <color_fragment>
              float symNoise = sin(vSymbioteWorldPosition.x * 9.3 + sin(vSymbioteWorldPosition.y * 7.1)) * sin(vSymbioteWorldPosition.z * 8.7 + vSymbioteWorldPosition.y * 3.7);
              float symEdge = smoothstep(-0.34, 0.18, uSymbioteInfection * 1.75 - symNoise * 0.24 - 0.9);
              diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.008, 0.011, 0.018), symEdge * 0.98);
              `)
            .replace('#include <output_fragment>', `
              float symRim = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 3.2) * symEdge;
              outgoingLight += vec3(0.19, 0.25, 0.33) * symRim * 0.75;
              outgoingLight += vec3(0.34, 0.38, 0.46) * pow(max(0.0, symNoise), 14.0) * symEdge * 0.22;
              #include <output_fragment>
            `)
        }
        return next
      }
      node.material = Array.isArray(node.material) ? node.material.map(makeMetallic) : makeMetallic(node.material)
    })
    return clone
  }, [scene])

  useFrame((state, delta) => {
    if (!root.current) return
    const frameDelta = Math.min(delta, 0.05)
    const ease = 1 - Math.exp(-12 * frameDelta)
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

  useEffect(() => {
    if (characterRef) characterRef.current = root.current
    return () => { if (characterRef?.current === root.current) characterRef.current = null }
  }, [characterRef])

  useFrame((state, delta) => {
    const amount = infectionRef?.current ?? 0
    if (amount < 0.001) return
    root.current?.traverse((node) => {
      if (!node.isMesh) return
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      for (const material of materials) {
        if (!material?.userData?.symbioteUniform) continue
        material.userData.symbioteUniform.value = amount
        material.roughness = THREE.MathUtils.lerp(material.userData.symbioteBaseRoughness ?? 0.48, 0.09, amount)
      }
    })
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
  const invalidateRef = useRef(null)
  const buttonRef = useRef(null)
  const hostAreaRef = useRef(null)
  const modelRef = useRef(null)
  const infectionRef = useRef(0)
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
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
    buttonRef.current = document.querySelector('.symbiote-trigger')
    const aimFromPointer = (event) => {
      if (drag.current.active || event.pointerType === 'touch') return
      const bounds = wrapper.current?.getBoundingClientRect()
      if (!bounds || !bounds.width || !bounds.height) return
      const x = clamp((event.clientX - bounds.left) / bounds.width, 0, 1) * 2 - 1
      const y = clamp((event.clientY - bounds.top) / bounds.height, 0, 1) * 2 - 1
      drag.current.yaw = x * 0.9
      drag.current.pitch = -y * 0.5
      invalidateRef.current?.()
    }
    const leave = () => {
      if (drag.current.active) return
      drag.current.yaw = 0
      drag.current.pitch = 0
      invalidateRef.current?.()
    }
    const begin = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      drag.current.active = true
      drag.current.pointerId = event.pointerId ?? null
      drag.current.lastX = event.clientX
      drag.current.lastY = event.clientY
      invalidateRef.current?.()
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
      current.yaw = clamp(current.yaw + (dx / bounds.width) * 5.4, -Math.PI, Math.PI)
      current.pitch = clamp(current.pitch + (dy / bounds.height) * 4.2, -1.15, 1.15)
      invalidateRef.current?.()
    }
    const end = (event) => {
      const current = drag.current
      if (!current.active || (current.pointerId !== null && event.pointerId !== current.pointerId)) return
      current.active = false
      current.pointerId = null
    }
    const nudge = (yaw, pitch) => {
      drag.current.yaw = clamp(drag.current.yaw + yaw, -Math.PI, Math.PI)
      drag.current.pitch = clamp(drag.current.pitch + pitch, -1.15, 1.15)
      invalidateRef.current?.()
    }

    if (interactionRef) interactionRef.current = { begin, nudge, hover: aimFromPointer, leave }
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
      ArrowLeft: [-0.18, 0], ArrowRight: [0.18, 0], ArrowUp: [0, -0.14], ArrowDown: [0, 0.14],
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    interactionRef?.current?.nudge(...direction)
  }

  return (
    <>
      <div className="hero-model-canvas absolute inset-0 z-[3] pointer-events-none" ref={wrapper}>
        <SymbioteWebGL buttonRef={buttonRef} hostRef={hostAreaRef} infectionRef={infectionRef} />
        <ModelErrorBoundary>
          <Canvas onCreated={onCanvasCreated} dpr={[1, 1.35]} frameloop={!rendering ? 'never' : reduceMotion ? 'demand' : 'always'} camera={{ position: [0, 0, 5.6], fov: 35 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[3, 4, 5]} intensity={2.4} color={lights.ivory} />
            <directionalLight position={[-3, 1, 3]} intensity={1.65} color={lights.rose} />
            <pointLight position={[0, -1.5, 2]} intensity={0.8} distance={5} color={lights.deepRose} />
            <pointLight position={[2, 1, -2]} intensity={1.3} distance={6} color={lights.warm} />
            <Suspense fallback={<Html center><span className="hero-model-loading">LOADING 3D PORTRAIT</span></Html>}>
              <Model drag={drag} motion={!reduceMotion} infectionRef={infectionRef} characterRef={modelRef} />
            </Suspense>
          </Canvas>
        </ModelErrorBoundary>
      </div>
      <div
        className="hero-model-hit-area absolute z-[4] top-[9%] left-1/2 h-[67%] w-[min(58vw,560px)] -translate-x-1/2 outline-none cursor-grab active:cursor-grabbing touch-none pointer-events-auto max-[520px]:top-[17%] max-[520px]:h-[55%] max-[520px]:w-[min(90vw,440px)] min-[521px]:max-[820px]:top-[12%] min-[521px]:max-[820px]:h-[62%] min-[521px]:max-[820px]:w-[min(76vw,620px)] min-[821px]:max-[999px]:top-[12%] min-[821px]:max-[999px]:h-[58%] min-[821px]:max-[999px]:w-[min(58vw,520px)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--hero-light-rose)_78%,transparent)] focus-visible:-outline-offset-8 focus-visible:rounded-[45%]"
        ref={hostAreaRef}
        role="button"
        tabIndex={0}
        aria-label="Drag to rotate Ashok’s 3D portrait, or use arrow keys"
        onPointerDown={(event) => interactionRef?.current?.begin?.(event.nativeEvent || event)}
        onPointerLeave={() => interactionRef?.current?.leave?.()}
        onKeyDown={rotateByKeyboard}
      />
    </>
  )
}

useGLTF.preload(portfolioAssets.models.hero)
