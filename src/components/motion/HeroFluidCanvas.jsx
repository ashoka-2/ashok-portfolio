import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() { 
  vUv = uv; 
  gl_Position = vec4(position, 1.0); 
}
`

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec2 uResolution;
varying vec2 vUv;

float hash(vec2 p){ 
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); 
}

float noise(vec2 p){ 
  vec2 i = floor(p);
  vec2 f = fract(p); 
  f = f * f * (3.0 - 2.0 * f); 
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); 
}

void main(){
  vec2 uv = vUv; 
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  vec2 mouse = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  
  // Multi-layered organic fluid motion
  float n1 = noise(p * 2.0 + uTime * 0.08);
  float n2 = noise(p * 3.8 - uTime * 0.06) * 0.5;
  float wave = sin((p.x * 2.2 + p.y * 1.4 + (n1 + n2) * 1.1 + uTime * 0.14 + uScroll * 0.0012) * 2.8);
  
  // Interactive mouse ripples and caustic halo
  float distToMouse = length(p - mouse * 0.45);
  float halo = exp(-distToMouse * 2.1) * 0.38;
  
  float field = smoothstep(0.32, 0.95, n1 * 0.45 + n2 * 0.35 + wave * 0.15 + halo + uScroll * 0.00004);
  
  // 60 / 30 / 10 COLOR SYSTEM
  vec3 ink = vec3(0.043, 0.043, 0.071);       // #0B0B12 (60% base)
  vec3 violet = vec3(0.169, 0.106, 0.420);    // #2B1B6B (30% secondary mesh)
  vec3 indigo = vec3(0.357, 0.239, 0.961);    // var(--secondary-mesh-2)
  vec3 hotPink = vec3(1.0, 0.282, 0.643);     // var(--accent-pink) (10% accent)
  vec3 amber = vec3(1.0, 0.541, 0.239);       // var(--accent-amber)

  vec3 color = mix(ink, violet, smoothstep(0.12, 0.62, field));
  color = mix(color, indigo, smoothstep(0.48, 0.88, field));
  color = mix(color, hotPink, smoothstep(0.80, 1.08, field) * 0.68);
  color = mix(color, amber, smoothstep(0.92, 1.20, field + wave * 0.12) * 0.42);

  // Vignette
  float vignette = 1.0 - smoothstep(0.18, 1.22, length((uv - 0.5) * vec2(0.92, 1.0)));
  gl_FragColor = vec4(color * vignette, field * 0.48);
}
`

function FluidPlane({ pointer, scroll, size }) {
  const material = useRef(null)
  useFrame((state) => {
    if (!material.current) return
    material.current.uniforms.uTime.value = state.clock.elapsedTime
    material.current.uniforms.uMouse.value.lerp(pointer.current, 0.04)
    material.current.uniforms.uScroll.value = scroll.current
    material.current.uniforms.uResolution.value.set(size.width, size.height)
  })
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uScroll: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
      />
    </mesh>
  )
}

export default function HeroFluidCanvas() {
  const wrapper = useRef(null)
  const pointer = useRef(new THREE.Vector2(0.5, 0.5))
  const scroll = useRef(0)
  const intersecting = useRef(false)
  const [visible, setVisible] = useState(false)
  const [size, setSize] = useState({ width: 1, height: 1 })
  const [lightweight, setLightweight] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 640px)').matches
    setLightweight(reduce || small)
    const element = wrapper.current
    if (!element || reduce || small) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      intersecting.current = entry.isIntersecting
      setVisible(entry.isIntersecting && document.visibilityState === 'visible')
    }, { rootMargin: '100px' })
    observer.observe(element)

    const updateSize = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    const updateScroll = () => { scroll.current = window.scrollY }
    const visibility = () => setVisible(intersecting.current && document.visibilityState === 'visible')

    updateSize()
    updateScroll()

    const resize = new ResizeObserver(updateSize)
    resize.observe(element)

    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', trackPointer, { passive: true })
    document.addEventListener('visibilitychange', visibility)

    return () => {
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', trackPointer)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [])

  const trackPointer = (event) => {
    const rect = wrapper.current?.getBoundingClientRect()
    if (!rect) return
    pointer.current.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height)
  }

  return (
    <div
      className={`hero-canvas-wrap ${lightweight ? 'hero-fluid-static' : ''}`}
      ref={wrapper}
      onPointerMove={trackPointer}
      aria-hidden="true"
    >
      {!lightweight && visible && (
        <Canvas
          dpr={[1, 1.5]}
          orthographic
          camera={{ position: [0, 0, 1], zoom: 1 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        >
          <FluidPlane pointer={pointer} scroll={scroll} size={size} />
        </Canvas>
      )}
    </div>
  )
}
