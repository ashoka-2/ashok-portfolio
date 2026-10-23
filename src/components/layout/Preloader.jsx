import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/* =========================================================================
   GENUINE WEBGL 2 SYMBIOTE METABALL FLUID RAYMARCHING SHADERS
   - 14+ independent streams with trailing droplets crawling from all edges
   - True physical surface tension coalescence via Smooth-Minimum (smin)
   - Fuses into one boiling central symbiote pool
   - Carves mathematical Venom eyes and razor fangs directly out of the merged liquid
   - Exact audio sync at the moment of coalescence
   - High-contrast white background with jet-black wet symbiote liquid
   ========================================================================= */

const VS = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const FS = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform vec2 uC;
uniform float uDpr;
uniform float uT;
uniform float uCenterR;
uniform float uFace;
uniform float uOpen;
uniform float uHS;
uniform float uEyeY;
uniform int uBlobCount;
uniform vec3 uBlobs[64]; // (x, y, radius)

out vec4 o;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float map(vec2 p) {
  float d = 1e5;

  // 1. Central coalesced liquid symbiote pool
  if (uCenterR > 1.0) {
    vec2 q = p - uC;
    float wobble = (sin(p.x * 0.045 + uT * 2.8) * cos(p.y * 0.045 - uT * 2.2)) * 10.0;
    d = length(q) - (uCenterR + wobble);
  }

  // 2. Incoming fluid droplets & trailing globules with viscous surface tension
  for (int i = 0; i < 64; i++) {
    if (i >= uBlobCount) break;
    vec3 b = uBlobs[i];
    if (b.z > 0.5) {
      float bd = length(p - b.xy) - b.z;
      // 28.0 blending radius creates thick liquid meniscus bridges between nearby drops!
      d = smin(d, bd, 28.0);
    }
  }

  return d;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  float d = map(p);

  // Edge antialiasing factor
  float aa = clamp(0.5 - d * uDpr, 0.0, 1.0);
  if (aa <= 0.001) {
    o = vec4(0.0);
    return;
  }

  // Finite-difference normals for realistic raymarched liquid surface
  vec2 gr = vec2(dFdx(d), -dFdy(d));
  float gl2 = length(gr);
  vec2 gn = gl2 > 1e-4 ? gr / gl2 : vec2(0.0);
  float t = clamp(-d / 40.0, 0.0, 1.0);
  vec3 n = normalize(vec3(gn * (1.0 - t) * 1.35, 0.35 + t * 1.25));

  // Two-light specular shading model (Matching HeroModelCanvas symbiote lighting)
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(-0.55, -0.65, 0.65));
  vec3 L2 = normalize(vec3(0.55, 0.6, 0.5));
  float h1 = max(dot(n, normalize(L1 + V)), 0.0);
  float s1 = pow(h1, 75.0);
  float s1b = pow(h1, 16.0) * 0.16;
  float s2 = pow(max(dot(n, normalize(L2 + V)), 0.0), 38.0) * 0.35;
  float fr = pow(1.0 - n.z, 3.0);
  float wet = 0.5 + 0.5 * sin(p.x * 0.08 - p.y * 0.06 + uT * 1.6 + d * 0.35);

  // Pitch-black wet obsidian symbiote body + razor-sharp specular reflection
  vec3 liquidBody = vec3(0.012, 0.014, 0.018);
  vec3 specHighlight = vec3(0.96, 0.98, 1.0) * (s1 * 0.95 + s1b + s2);
  vec3 rimLight = vec3(0.35, 0.52, 0.82) * fr * 0.45;
  vec3 wetSheen = vec3(0.07, 0.1, 0.18) * wet * fr;
  vec3 col = liquidBody + specHighlight + rimLight + wetSheen;
  col += vec3(0.18, 0.28, 0.52) * clamp(1.0 + d / 8.0, 0.0, 1.0) * 0.35;

  // =========================================================================
  // VENOM FACE: CARVED DIRECTLY OUT OF THE MERGED CENTRAL LIQUID MASS
  // Eyes cleanly at TOP, mouth cleanly at BOTTOM
  // =========================================================================
  if (uFace > 0.01 && d < 2.0 && uCenterR > 18.0) {
    float fl = (p.x - uC.x) / uHS;
    float vy = (p.y - uC.y) / uHS;
    float gf = uFace * uFace * (3.0 - 2.0 * uFace);

    // EYES AT TOP (vy around -0.35, above center):
    vec2 eq = vec2(abs(fl) - 0.52, vy - (-0.35));
    float eca = 0.88, esa = 0.47;
    vec2 er = vec2(eq.x * eca + eq.y * esa, -eq.x * esa + eq.y * eca) / 0.46;
    er.x /= (0.6 + 0.4 * gf);
    float exx = clamp(er.x, -1.0, 1.0);
    float ehh = 0.42 * pow(max(1.0 - pow(abs(exx), 1.7), 0.0), 0.8) * (1.0 + 0.28 * exx);
    float ede = max(abs(er.y) - ehh * gf, abs(er.x) - 1.02);
    float eye = (1.0 - smoothstep(-0.06, 0.08, ede)) * smoothstep(0.0, 0.15, gf);

    // MOUTH AT BOTTOM (vy around +0.35, below eyes & below center):
    float myy = vy - 0.35;
    float cyL = -0.28 * fl * fl + 0.02;
    float mop = 0.06 + 0.32 * gf * (0.3 + 0.7 * uOpen);
    float mo2 = mop * pow(max(1.0 - fl * fl / 1.35, 0.0), 0.55);
    float yU = cyL - mo2, yL = cyL + mo2;

    // TEETH: Two interlocking rows of sharp fangs
    float fU = fl * 4.6, fL2 = fl * 4.6 + 0.5;
    float cU = floor(fU), cL = floor(fL2);
    float tU = 1.0 - 2.0 * abs(fract(fU) - 0.5);
    float tL = 1.0 - 2.0 * abs(fract(fL2) - 0.5);
    float hU = fract(sin(cU * 12.9898) * 43758.5453);
    float hL = fract(sin((cL + 7.3) * 12.9898) * 43758.5453);
    float tb = 0.22 * gf * smoothstep(0.0, 0.28, mo2);
    float fng = exp(-pow((abs(fl) - 0.36) / 0.1, 2.0));
    float lnU = tb * (0.7 + 0.7 * hU) * (1.0 + 1.15 * fng);
    float lnL = tb * (0.6 + 0.6 * hL) * (1.0 + 0.55 * fng);
    float dU = max((myy - yU) - lnU * tU, yU - myy);
    float dL = max((yL - myy) - lnL * tL, myy - yL);
    float teeth = max(1.0 - smoothstep(-0.02, 0.025, dU),
                      1.0 - smoothstep(-0.02, 0.025, dL))
                * step(abs(fl), 1.15) * smoothstep(0.12, 0.5, gf);

    // Composite Glowing Eyes (pure white core with electric cyan pulse)
    col = mix(col, vec3(0.99, 1.0, 1.0), eye);
    col += vec3(0.35, 0.65, 1.0) * eye * 0.95;

    // Composite Razor Sharp Ivory Teeth
    col = mix(col, vec3(0.96, 0.97, 0.98), teeth);
  }

  o = vec4(col * aa, aa);
}
`

function compileShader(gl, type, source) {
  const s = gl.createShader(type)
  gl.shaderSource(s, source)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('Symbiote shader error:', gl.getShaderInfoLog(s))
  }
  return s
}

export default function Preloader() {
  // Always show on initial load and every browser reload
  const [visible, setVisible] = useState(true)
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!visible || !rootRef.current) return

    const finish = () => {
      setVisible(false)
      window.dispatchEvent(new Event('portfolio:ready'))
    }

    // Audio: Venom roar sound effect
    const roarAudio = new Audio('/sounds/venom-sound.mpeg')
    roarAudio.volume = 0.75
    roarAudio.preload = 'auto'

    const playRoar = () => {
      try {
        roarAudio.currentTime = 0
        const p = roarAudio.play()
        if (p !== undefined) {
          p.catch(() => {})
        }
      } catch {}
    }

    // WebGL 2 Initialization
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    })

    if (!gl) {
      console.warn('WebGL2 not supported for Venom preloader.')
      finish()
      return
    }

    const prog = gl.createProgram()
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // Full screen quad geometry VBO
    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const U = {}
    ;[
      'uRes',
      'uC',
      'uDpr',
      'uT',
      'uCenterR',
      'uFace',
      'uOpen',
      'uHS',
      'uEyeY',
      'uBlobCount',
      'uBlobs',
    ].forEach((n) => {
      U[n] = gl.getUniformLocation(prog, n)
    })

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75)

    const layout = () => {
      W = window.innerWidth
      H = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    layout()
    window.addEventListener('resize', layout)

    // -------------------------------------------------------------------------
    // 14+ Fluid Symbiote Streams with Satellite Droplets (total 56 metaballs)
    // -------------------------------------------------------------------------
    const STREAM_COUNT = 14
    const BLOBS_PER_STREAM = 4
    const TOTAL_BLOBS = STREAM_COUNT * BLOBS_PER_STREAM
    const blobUniformData = new Float32Array(64 * 3)

    const streams = []
    for (let i = 0; i < STREAM_COUNT; i++) {
      const angle = (i / STREAM_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.25
      const spawnDist = Math.max(W, H) * 0.62 + Math.random() * 80
      const startX = W / 2 + Math.cos(angle) * spawnDist
      const startY = H / 2 + Math.sin(angle) * spawnDist

      const baseR = 18 + Math.random() * 16
      const speed = 0.85 + Math.random() * 0.35
      const waveFreq = 2.2 + Math.random() * 2.0
      const waveAmp = 45 + Math.random() * 45
      const phase = Math.random() * Math.PI * 2

      const blobChain = []
      for (let j = 0; j < BLOBS_PER_STREAM; j++) {
        blobChain.push({
          lag: j * 0.05,
          radius: baseR * (1 - j * 0.14),
          wobbleOffset: j * 0.5,
        })
      }

      streams.push({
        id: i,
        startX,
        startY,
        angle,
        speed,
        waveFreq,
        waveAmp,
        phase,
        blobChain,
      })
    }

    // Choreography Controller
    const sim = {
      creepProgress: 0, // 0 to 1 (takes 0.0s to 2.8s)
      centerR: 0,       // radius of central coalesced symbiote pool
      face: 0,          // visibility of venom eyes & fangs
      open: 0,          // jaw open parameter
    }

    let animId = 0
    let startTime = performance.now()

    const render = (now) => {
      animId = requestAnimationFrame(render)
      const t = (now - startTime) * 0.001

      const cx = W / 2
      const cy = H / 2
      const hs = Math.min(W, H) * 0.18

      // Update positions of all 56 metaball droplets
      let blobIdx = 0
      streams.forEach((st) => {
        const streamProg = Math.min(1, Math.max(0, sim.creepProgress * st.speed))
        const nx = -Math.sin(st.angle)
        const ny = Math.cos(st.angle)

        st.blobChain.forEach((b, j) => {
          if (blobIdx >= 64) return

          const relProg = Math.min(1, Math.max(0, streamProg - b.lag))

          if (relProg <= 0.001) {
            blobUniformData[blobIdx * 3] = -9999
            blobUniformData[blobIdx * 3 + 1] = -9999
            blobUniformData[blobIdx * 3 + 2] = 0
          } else {
            // Viscous fluid non-linear trickle ease
            const ease = relProg < 0.5 ? 2 * relProg * relProg : -1 + (4 - 2 * relProg) * relProg

            const straightX = st.startX + (cx - st.startX) * ease
            const straightY = st.startY + (cy - st.startY) * ease

            // Fluid snaking undulation
            const wave = Math.sin(t * st.waveFreq + st.phase + b.wobbleOffset) * st.waveAmp * (1 - ease * 0.65)
            const curX = straightX + nx * wave
            const curY = straightY + ny * wave

            // Fluid squash & stretch
            const squash = 1 + 0.15 * Math.sin(t * 3.5 + blobIdx)
            const curR = b.radius * squash * Math.min(1, relProg * 2.8)

            blobUniformData[blobIdx * 3] = curX
            blobUniformData[blobIdx * 3 + 1] = curY
            blobUniformData[blobIdx * 3 + 2] = Math.max(1.0, curR)
          }

          blobIdx++
        })
      })

      // Upload Uniforms to WebGL 2 Shader
      gl.uniform2f(U.uRes, canvas.width, canvas.height)
      gl.uniform2f(U.uC, cx, cy)
      gl.uniform1f(U.uDpr, dpr)
      gl.uniform1f(U.uT, t)
      gl.uniform1f(U.uCenterR, sim.centerR)
      gl.uniform1f(U.uFace, sim.face)
      gl.uniform1f(U.uOpen, sim.open)
      gl.uniform1f(U.uHS, hs)
      gl.uniform1f(U.uEyeY, -hs * 0.1)
      gl.uniform1i(U.uBlobCount, TOTAL_BLOBS)
      gl.uniform3fv(U.uBlobs, blobUniformData)

      // Draw full screen raymarched quad
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    animId = requestAnimationFrame(render)

    // -------------------------------------------------------------------------
    // MASTER 4-STAGE CHOREOGRAPHY TIMELINE (TOTAL ~5.0s)
    // -------------------------------------------------------------------------
    const tl = gsap.timeline({
      onComplete: finish,
    })

    // Stage 1: The Creep (0.0s – 2.2s)
    // Viscous fluid streams slowly crawl inward from all edges
    tl.to(
      sim,
      {
        creepProgress: 1.0,
        duration: 2.3,
        ease: 'power1.inOut',
      },
      0.1
    )

    // Stage 2: The Collision & Coalescence (2.0s – 3.0s)
    // All separate streams collide in the center and fuse into one boiling pool
    tl.to(
      sim,
      {
        centerR: Math.min(W, H) * 0.22,
        duration: 1.0,
        ease: 'power2.out',
      },
      2.0
    )

    // Stage 3: The Venom Face Reveal & Audio Drop (3.0s – 4.2s)
    // EXACT AUDIO TRIGGER: Right at 3.0s when coalescence completes and jaws open!
    tl.call(
      () => {
        playRoar()
      },
      null,
      3.0
    )

    // Directly inside the newly merged liquid, eyes and fangs emerge and snap open!
    tl.to(
      sim,
      {
        face: 1.0,
        open: 0.95,
        duration: 0.8,
        ease: 'back.out(1.7)',
      },
      3.0
    )

    // Eyes narrow and jaws snap closed!
    tl.to(
      sim,
      {
        open: 0.0,
        face: 0.0,
        duration: 0.45,
        ease: 'power3.in',
      },
      3.85
    )

    // Stage 4: The Exit / Page Reveal (4.2s – 5.0s)
    // Central liquid mass dissolves / implodes into void
    tl.to(
      sim,
      {
        centerR: 0,
        creepProgress: 0,
        duration: 0.5,
        ease: 'power2.in',
      },
      4.2
    )

    // Smooth curtain blur dissolve revealing the portfolio
    tl.to(
      rootRef.current,
      {
        opacity: 0,
        filter: 'blur(16px)',
        duration: 0.65,
        ease: 'power2.inOut',
      },
      4.35
    )

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', layout)
      tl.kill()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="venom-preloader-root fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center overflow-hidden select-none"
      style={{
        background: '#ffffff', // High-contrast clean white background as requested
      }}
      aria-label="Venom Symbiote Preloader"
      role="status"
    >
      {/* Full-Screen WebGL 2 Liquid Raymarching Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0 size-full"
        aria-hidden="true"
      />
    </div>
  )
}
