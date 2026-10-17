import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`
const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec2 uResolution;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y); }
void main(){
  vec2 uv=vUv; vec2 p=(uv-.5)*vec2(uResolution.x/uResolution.y,1.0);
  vec2 mouse=(uMouse-.5)*vec2(uResolution.x/uResolution.y,1.0);
  float n=noise(p*2.2+uTime*.09)+noise(p*4.0-uTime*.055)*.45;
  float wave=sin((p.x*2.0+p.y*1.2+n*.9+uTime*.16+uScroll*.0015)*3.0);
  float halo=exp(-length(p-mouse*.35)*2.25)*.26;
  float field=smoothstep(.36,.9,n*.47+wave*.12+halo+uScroll*.000035);
  vec3 deep=vec3(.018,.045,.092); vec3 blue=vec3(.06,.24,.46); vec3 ice=vec3(.35,.68,.98);
  vec3 color=mix(deep,blue,field*.72); color=mix(color,ice,smoothstep(.72,1.02,field)*.42);
  float vignette=1.0-smoothstep(.12,1.15,length((uv-.5)*vec2(.88,1.0)));
  gl_FragColor=vec4(color*vignette,field*.35);
}
`

function FluidPlane({ pointer, scroll, size }) {
  const material = useRef(null)
  useFrame((state) => {
    if (!material.current) return
    material.current.uniforms.uTime.value = state.clock.elapsedTime
    material.current.uniforms.uMouse.value.lerp(pointer.current, .035)
    material.current.uniforms.uScroll.value = scroll.current
    material.current.uniforms.uResolution.value.set(size.width, size.height)
  })
  return <mesh>
    <planeGeometry args={[2, 2]} />
    <shaderMaterial ref={material} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} uniforms={{
      uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(.5, .5) }, uScroll: { value: 0 }, uResolution: { value: new THREE.Vector2(1, 1) },
    }} />
  </mesh>
}

export default function HeroFluidCanvas() {
  const wrapper = useRef(null)
  const pointer = useRef(new THREE.Vector2(.68, .48))
  const scroll = useRef(0)
  const intersecting = useRef(false)
  const [visible, setVisible] = useState(false)
  const [size, setSize] = useState({ width: 1, height: 1 })
  const [lightweight, setLightweight] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(max-width: 720px)').matches
    setLightweight(reduce || small)
    const element = wrapper.current
    if (!element || reduce || small) return undefined
    const observer = new IntersectionObserver(([entry]) => { intersecting.current = entry.isIntersecting; setVisible(entry.isIntersecting && document.visibilityState === 'visible') }, { rootMargin: '100px' })
    observer.observe(element)
    const updateSize = () => setSize({ width: element.clientWidth, height: element.clientHeight })
    const updateScroll = () => { scroll.current = window.scrollY }
    const visibility = () => setVisible(intersecting.current && document.visibilityState === 'visible')
    updateSize(); updateScroll()
    const resize = new ResizeObserver(updateSize)
    resize.observe(element)
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', trackPointer, { passive: true })
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); resize.disconnect(); window.removeEventListener('scroll', updateScroll); window.removeEventListener('pointermove', trackPointer); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  const trackPointer = (event) => {
    const rect = wrapper.current?.getBoundingClientRect()
    if (!rect) return
    pointer.current.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height)
  }
  return <div className={`hero-fluid ${lightweight ? 'hero-fluid-static' : ''}`} ref={wrapper} onPointerMove={trackPointer} aria-hidden="true">
    {!lightweight && visible && <Canvas dpr={[1, 1.5]} orthographic camera={{ position: [0, 0, 1], zoom: 1 }} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}>
      <FluidPlane pointer={pointer} scroll={scroll} size={size} />
    </Canvas>}
  </div>
}
