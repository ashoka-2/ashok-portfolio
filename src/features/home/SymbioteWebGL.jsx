import { useEffect, useRef } from 'react'

const vertexSource = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const fragmentSource = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uDpr;
uniform float uTime;
uniform vec4 uPill;
uniform vec2 uPointer;
uniform vec4 uBounds;
uniform vec3 uStrands[70];
uniform float uMass;
uniform float uProximity;
out vec4 outColor;
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}
float capsule(vec2 p, vec3 a, vec3 b) {
  vec2 pa = p - a.xy, ba = b.xy - a.xy;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
  return length(pa - ba * h) - mix(a.z, b.z, h);
}
float field(vec2 p) {
  vec2 q = p - uPill.xy;
  float x = clamp(q.x, -uPill.z, uPill.z);
  float ripple = sin(p.x * 0.055 + uTime * 1.6) * sin(p.y * 0.07 - uTime * 1.2);
  float d = length(q - vec2(x, 0.0)) - uPill.w + ripple * uProximity * 1.35;
  for (int i = 0; i < 10; i++) {
    for (int j = 0; j < 6; j++) {
      int n = i * 7 + j;
      vec3 a = uStrands[n], b = uStrands[n + 1];
      if (a.z > 0.01 && b.z > 0.01) d = smin(d, capsule(p, a, b), 13.0);
    }
  }
  return d;
}
void main() {
  vec2 p = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;
  if (p.x < uBounds.x || p.x > uBounds.z || p.y < uBounds.y || p.y > uBounds.w) { outColor = vec4(0.0); return; }
  float d = field(p);
  vec2 grad = vec2(dFdx(d), -dFdy(d));
  float glen = length(grad);
  vec2 gn = glen > 0.0001 ? grad / glen : vec2(0.0, 1.0);
  float body = 1.0 - smoothstep(-2.5, 1.5, d);
  vec3 normal = normalize(vec3(gn * 1.08, 0.72));
  vec3 view = vec3(0.0, 0.0, 1.0);
  vec3 lightA = normalize(vec3(-0.5, -0.65, 0.6));
  vec3 lightB = normalize(vec3(0.55, 0.6, 0.5));
  float specA = pow(max(dot(normal, normalize(lightA + view)), 0.0), 64.0);
  float specB = pow(max(dot(normal, normalize(lightB + view)), 0.0), 28.0) * 0.25;
  float rim = pow(1.0 - normal.z, 3.0);
  float wet = 0.5 + 0.5 * sin(p.x * 0.09 - p.y * 0.07 + uTime * 1.4 + d * 0.35);
  vec3 ink = vec3(0.008, 0.01, 0.016);
  vec3 color = ink + vec3(0.9, 0.94, 1.0) * (specA * 0.9 + specB);
  color += vec3(0.28, 0.35, 0.52) * rim * (0.28 + wet * 0.18);
  float alpha = body * uMass;
  float shadow = d > 0.0 ? 0.16 * exp(-d / 22.0) * uMass : 0.0;
  outColor = vec4(color * alpha + vec3(0.025, 0.028, 0.04) * shadow, alpha + shadow);
}`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(message || 'WebGL shader compilation failed')
  }
  return shader
}

export default function SymbioteWebGL({ buttonRef, hostRef, infectionRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const button = buttonRef.current || document.querySelector('.symbiote-trigger')
    if (!canvas || !button) return undefined
    buttonRef.current = button
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' })
    if (!gl) {
      button.style.background = 'var(--accent)'
      return undefined
    }

    let program
    let frame = 0
    let lastTime = performance.now()
    let elapsed = 0
    let dpr = 1
    const pointer = { x: -1000, y: -1000, sx: -1000, sy: -1000, inside: false, infected: 0, transfer: 0 }
    let visualInfection = 0
    const strands = Array.from({ length: 10 }, (_, i) => ({
      phase: i * 2.399,
      seed: Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5,
      x: new Float32Array(7), y: new Float32Array(7), vx: new Float32Array(7), vy: new Float32Array(7),
    }))
    const strandData = new Float32Array(70 * 3)
    const zero = () => strandData.fill(0)
    let locations
    try {
      program = gl.createProgram()
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexSource))
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentSource))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'WebGL program link failed')
      gl.useProgram(program)
      locations = Object.fromEntries(['uResolution', 'uDpr', 'uTime', 'uPill', 'uPointer', 'uBounds', 'uStrands[0]', 'uMass', 'uProximity'].map((name) => [name, gl.getUniformLocation(program, name)]))
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(0, 0, 0, 0)
    } catch (error) {
      console.error('Venom WebGL2 effect could not initialize:', error)
      button.style.background = 'var(--accent)'
      return undefined
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      if (pointer.sx < -900) { pointer.sx = pointer.x; pointer.sy = pointer.y }
      pointer.inside = pointer.x >= 0 && pointer.x <= rect.width && pointer.y >= 0 && pointer.y <= rect.height
    }
    const onLeave = () => { pointer.inside = false }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    resize()

    const render = (now) => {
      frame = requestAnimationFrame(render)
      if (document.hidden) { lastTime = now; return }
      const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000))
      lastTime = now
      elapsed += dt
      const rect = canvas.getBoundingClientRect()
      const br = button.getBoundingClientRect()
      const host = hostRef.current?.getBoundingClientRect()
      const cx = br.left - rect.left + br.width * 0.5
      const cy = br.top - rect.top + br.height * 0.5
      const radius = Math.max(12, br.height * 0.5)
      const halfLength = Math.max(0, (br.width - br.height) * 0.5)
      const mouseDistance = Math.hypot(pointer.x - cx, pointer.y - cy)
      const proximity = pointer.inside ? Math.max(0, 1 - Math.max(mouseDistance - radius, 0) / 270) : 0
      const smoothProximity = proximity * proximity * (3 - 2 * proximity)
      const nearHost = host && pointer.inside && pointer.x > host.left - rect.left && pointer.x < host.right - rect.left && pointer.y > host.top - rect.top && pointer.y < host.bottom - rect.top
      if (smoothProximity > 0.72) pointer.infected = Math.max(pointer.infected, (smoothProximity - 0.72) / 0.28)
      if (pointer.infected > 0.48 && nearHost) pointer.transfer = 1
      if (pointer.inside && mouseDistance < radius * 0.62) pointer.transfer = 0
      if (!pointer.inside) {
        pointer.infected = Math.max(0, pointer.infected - dt * 0.18)
        pointer.transfer = Math.max(0, pointer.transfer - dt * 0.32)
      }
      const targetInfection = pointer.transfer
      visualInfection += (targetInfection - visualInfection) * (1 - Math.exp(-2.2 * dt))
      const infection = visualInfection
      infectionRef.current = infection
      button.style.color = infection > 0.78 ? '#151515' : '#ffffff'
      button.style.background = infection > 0.82 ? '#f4f3ef' : pointer.transfer > 0.01 ? `rgba(244, 243, 239, ${pointer.transfer})` : ''
      const hostX = host ? host.left - rect.left + host.width * 0.5 : cx
      const hostY = host ? host.top - rect.top + host.height * 0.46 : cy
      const targetX = pointer.transfer ? hostX : pointer.sx < -900 ? cx : pointer.sx
      const targetY = pointer.transfer ? hostY : pointer.sy < -900 ? cy : pointer.sy
      pointer.sx += (pointer.x - pointer.sx) * (1 - Math.exp(-16 * dt))
      pointer.sy += (pointer.y - pointer.sy) * (1 - Math.exp(-16 * dt))
      zero()
      for (let i = 0; i < strands.length; i++) {
        const strand = strands[i]
        const angle = (i / strands.length) * Math.PI * 2 + strand.phase * 0.14
        const rootX = cx + Math.cos(angle) * halfLength * 0.72
        const rootY = cy + Math.sin(angle) * radius * 0.78
        const socketX = pointer.transfer ? hostX + Math.cos(angle) * Math.min(host?.width * 0.25 || 24, 100) : targetX + Math.cos(strand.phase) * 5
        const socketY = pointer.transfer ? hostY + Math.sin(angle) * Math.min(host?.height * 0.32 || 36, 130) : targetY + Math.sin(strand.phase) * 5
        const strength = Math.max(smoothProximity * 0.92, pointer.infected * 0.72, pointer.transfer)
        const tx = rootX + (socketX - rootX) * strength
        const ty = rootY + (socketY - rootY) * strength
        for (let j = 0; j < 7; j++) {
          const t = j / 6
          const sag = Math.sin(Math.PI * t) * (9 + 22 * (1 - strength)) * Math.sin(elapsed * (1.7 + strand.seed) + strand.phase)
          const desiredX = rootX + (tx - rootX) * t + sag * Math.cos(angle + 1.4)
          const desiredY = rootY + (ty - rootY) * t + sag * Math.sin(angle + 1.4) + 18 * Math.sin(Math.PI * t) * (1 - strength)
          if (j === 0) { strand.x[j] = rootX; strand.y[j] = rootY; continue }
          const spring = 190 + i * 8
          const damping = 19
          strand.vx[j] += ((desiredX - strand.x[j]) * spring - strand.vx[j] * damping) * dt
          strand.vy[j] += ((desiredY - strand.y[j]) * spring - strand.vy[j] * damping) * dt
          strand.x[j] += strand.vx[j] * dt
          strand.y[j] += strand.vy[j] * dt
        }
        for (let j = 0; j < 7; j++) {
          const index = (i * 7 + j) * 3
          const t = j / 6
          const neck = Math.sin(Math.PI * t)
          strandData[index] = strand.x[j]
          strandData[index + 1] = strand.y[j]
          strandData[index + 2] = strength > 0.025 ? (1.6 + 2.2 * neck) * strength * (0.82 + strand.seed * 0.35) : 0
        }
      }
      const active = pointer.inside || infection > 0.01
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(locations.uResolution, canvas.width, canvas.height)
      gl.uniform1f(locations.uDpr, dpr)
      gl.uniform1f(locations.uTime, elapsed)
      gl.uniform4f(locations.uPill, cx, cy, halfLength, radius)
      gl.uniform2f(locations.uPointer, pointer.sx, pointer.sy)
      gl.uniform3fv(locations['uStrands[0]'], strandData)
      gl.uniform1f(locations.uMass, 1 - infection)
      gl.uniform1f(locations.uProximity, active ? smoothProximity : 0)
      const margin = 300
      gl.uniform4f(locations.uBounds, Math.min(cx, hostX) - margin, Math.min(cy, hostY) - margin, Math.max(cx, hostX) + margin, Math.max(cy, hostY) + margin)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      gl.deleteProgram(program)
      button.style.color = ''
      button.style.background = ''
    }
  }, [buttonRef, hostRef, infectionRef])

  return <canvas ref={canvasRef} className="symbiote-webgl-canvas" aria-hidden="true" />
}
