import { useEffect, useRef } from 'react'
import { symbioteStore } from './symbioteStore.js'

/* ================= 2D LIQUID OVERLAY SHADERS ================= */
const VS = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes, uC, uHR, uCss, uCh;
uniform float uDpr, uT, uPress, uFr, uDrip, uCov, uFaceOn;
uniform vec4 uBox, uCB;
uniform sampler2D uTex;
uniform vec3 uP[60];
uniform vec3 uA[24];
uniform vec3 uQ[8];
out vec4 o;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float h2(float x) {
  return fract(sin(x * 127.1) * 43758.5453);
}

float vn2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = h2(i.x + i.y * 57.0), b = h2(i.x + 1.0 + i.y * 57.0),
        c = h2(i.x + (i.y + 1.0) * 57.0), d = h2(i.x + 1.0 + (i.y + 1.0) * 57.0);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float sA(vec2 p) {
  return texture(uTex, p / uCss).a;
}

float cap(vec2 p, vec3 a, vec3 b) {
  vec2 pa = p - a.xy, ba = b.xy - a.xy;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-4), 0.0, 1.0);
  return length(pa - ba * h) - mix(a.z, b.z, h);
}

/* the character silhouette, blurred into a soft liquid height field, bulged outward and limited by advancing front */
float coat(vec2 p) {
  float s = sA(p) * 2.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854;
    s += sA(p + vec2(cos(a), sin(a)) * 14.0);
  }
  for (int i = 0; i < 4; i++) {
    float a = float(i) * 1.5708 + 0.39;
    s += sA(p + vec2(cos(a), sin(a)) * 7.0);
  }
  s /= 14.0;
  float sL = sA(p);
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854;
    sL += sA(p + vec2(cos(a), sin(a)) * 36.0);
  }
  sL /= 9.0;
  float b = (0.5 - s) * 30.0 - 5.0 - 16.0 * smoothstep(0.55, 1.0, sL);
  float f = length(p - uCh) - uFr + (vn2(p * 0.025 + uT * 0.25) - 0.5) * 70.0;
  return -smin(-b, -f, 14.0);
}

float map(vec2 p) {
  vec2 q = p - uC;
  float x = clamp(q.x, -uHR.x, uHR.x);
  float d = uHR.y < 0.4 ? 1e5 : length(q - vec2(x, 0.0)) - uHR.y;
  d += (0.9 * sin(p.x * 0.055 + uT * 1.6) * sin(p.y * 0.07 - uT * 1.2) + uPress * 2.5) * clamp(uHR.y / 30.0, 0.0, 1.0);

  float a = 1e5;
  for (int s = 0; s < 23; s++) {
    vec3 u = uA[s], v = uA[s + 1];
    if (u.z > 0.05 && v.z > 0.05) a = min(a, cap(p, u, v));
  }
  if (a < 1e4) d = smin(d, a, 18.0);

  for (int t = 0; t < 10; t++) {
    float m = 1e5;
    for (int s = 0; s < 5; s++) {
      vec3 u = uP[t * 6 + s], v = uP[t * 6 + s + 1];
      if (u.z > 0.05 && v.z > 0.05) m = min(m, cap(p, u, v));
    }
    if (m < 1e4) d = smin(d, m, 14.0);
  }

  for (int i = 0; i < 8; i++) {
    vec3 u = uQ[i];
    if (u.z > 0.05) d = smin(d, length(p - u.xy) - u.z, 14.0);
  }

  if (uCov > 0.5 && p.x > uCB.x && p.x < uCB.z && p.y > uCB.y && p.y < uCB.w) {
    float c0 = coat(p);
    float col = pow(max(0.0, sin(p.x * 0.11 + 1.7 * sin(p.x * 0.031))), 6.0);
    float L = uDrip * (20.0 + 80.0 * h2(floor(p.x / 9.0))) * col * (0.85 + 0.15 * sin(uT * 2.0 + p.x * 0.2));
    float c1 = coat(p - vec2(0.0, L));
    d = smin(d, min(c0, c1), 10.0);
  }

  return d;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  if (p.x < uBox.x || p.x > uBox.z || p.y < uBox.y || p.y > uBox.w) {
    o = vec4(0.0);
    return;
  }
  float d = map(p);
  vec2 gr = vec2(dFdx(d), -dFdy(d));
  float gl2 = length(gr);
  vec2 gn = gl2 > 1e-4 ? gr / gl2 : vec2(0.0);
  float t = clamp(-d / (uCov > 0.5 ? 55.0 : 14.0), 0.0, 1.0);
  vec3 n = normalize(vec3(gn * (1.0 - t) * 1.15, 0.3 + t * 1.1));
  if (uCov > 0.5) {
    n.xy += (vec2(vn2(p * 0.045 + uT * 0.35), vn2(p * 0.045 + 9.0 - uT * 0.3)) - 0.5) * 0.28;
    n = normalize(n);
  }
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(-0.5, -0.65, 0.6)), L2 = normalize(vec3(0.55, 0.6, 0.5));
  float h1 = max(dot(n, normalize(L1 + V)), 0.0);
  float s1 = pow(h1, 70.0), s1b = pow(h1, 16.0) * 0.12;
  float s2 = pow(max(dot(n, normalize(L2 + V)), 0.0), 38.0) * 0.3;
  float fr = pow(1.0 - n.z, 3.0);
  float wet = 0.5 + 0.5 * sin(p.x * 0.09 - p.y * 0.07 + uT * 1.4 + d * 0.35);
  vec3 col = vec3(0.012, 0.013, 0.018) + vec3(0.9, 0.94, 1.0) * (s1 * 0.85 + s1b + s2) + vec3(0.3, 0.36, 0.55) * fr * 0.3 + vec3(0.05, 0.07, 0.14) * wet * fr;
  col += vec3(0.2, 0.26, 0.42) * clamp(1.0 + d / 6.0, 0.0, 1.0) * 0.3;

  /* Venom glowing eyes + teeth from mask texture */
  if (uFaceOn > 0.01 && d < -2.0) {
    vec4 fm = texture(uTex, p / uCss);
    float e0 = fm.r;
    float gw = 0.0;
    for (int i = 0; i < 6; i++) {
      float a = float(i) * 1.047;
      gw += texture(uTex, (p + vec2(cos(a), sin(a)) * 7.0) / uCss).r;
    }
    gw /= 6.0;
    col = mix(col, vec3(0.97, 0.99, 1.0), e0 * uFaceOn);
    col += vec3(0.3, 0.45, 0.95) * gw * 0.35 * uFaceOn;
  }

  float aa = clamp(0.5 - d * uDpr, 0.0, 1.0);
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

const cl = (v, a, b) => Math.max(a, Math.min(b, v))
const sm = (a, b, v) => { const t = cl((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
const e5 = (t) => { t = cl(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10) }
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

export default function SymbioteOverlay({ buttonRef, heroRef, active = true, invalidateRef }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  useEffect(() => { activeRef.current = active }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const heroEl = heroRef.current || document.querySelector('.ref-hero')
    const buttonEl = buttonRef.current || document.querySelector('.symbiote-trigger')
    if (!canvas || !heroEl || !buttonEl) return undefined

    const backplate = buttonEl.querySelector('.symbiote-backplate')
    const label = buttonEl.querySelector('.symbiote-label') || buttonEl.firstElementChild

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' })
    if (!gl) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Compile program */
    const prog = gl.createProgram()
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const U = {}
    ;['uRes', 'uC', 'uHR', 'uDpr', 'uT', 'uPress', 'uBox', 'uP', 'uA', 'uQ', 'uTex', 'uCss', 'uCh', 'uFr', 'uDrip', 'uCov', 'uFaceOn', 'uCB'].forEach((n) => {
      U[n] = gl.getUniformLocation(prog, n)
    })

    /* Mask texture */
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))
    gl.uniform1i(U.uTex, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    /* Audio */
    let roarAudio = null
    try {
      roarAudio = new Audio('/sounds/venom-sound.mpeg')
      roarAudio.volume = 0.65
    } catch {
      // Audio not supported or blocked
    }
    const playRoarSound = () => {
      if (!roarAudio) return
      try {
        roarAudio.currentTime = 0
        roarAudio.play().catch(() => {})
      } catch {}
    }

    /* Configuration */
    const CFG = {
      out: 2.1,
      cover: 2.3,
      hold: 5.0,
      back: 3.2,
      attract: 270,
      dwell: 0.25,
    }
    const DUR = { out: CFG.out, cover: CFG.cover, hold: CFG.hold, back: CFG.back }

    /* Layout state in hero-local coords */
    let W = 1, H = 1, dpr = 1, S = 1, cx = 0, cy = 0, hl = 0, rad = 0

    /* Called EVERY frame, so scroll / sticky / parallax / smooth-scroll can never desync the liquid */
    const measure = () => {
      const rect = heroEl.getBoundingClientRect()
      const k = rect.width > 0 ? W / rect.width : 1 // undo any CSS scale
      const bRect = buttonEl.getBoundingClientRect()
      cx = (bRect.left - rect.left + bRect.width / 2) * k
      cy = (bRect.top - rect.top + bRect.height / 2) * k
      hl = Math.max(0, (bRect.width - bRect.height) / 2) * k
      rad = (bRect.height / 2) * k
      S = Math.min(1, (bRect.width * k) / 180)
    }

    const layout = () => {
      W = heroEl.clientWidth || 1
      H = heroEl.clientHeight || 1
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      measure()
    }

    const resizeObserver = new ResizeObserver(layout)
    resizeObserver.observe(heroEl)
    resizeObserver.observe(buttonEl)
    window.addEventListener('resize', layout)
    layout()

    /* Pointer & state in hero-local coordinates */
    const P = { x: -999, y: -999, sx: -999, sy: -999, vx: 0, vy: 0, inW: false, down: false, drag: false, lx: 0, ly: 0 }
    let dragMoved = 0, downT = 0, roar = 0, pressV = 0, press = 0
    let ph = 'idle', pt = 0, armed = 0, dwell = 0, inf = 0, infT = 0, face = 0, faceT = 0
    let ps = 1, psV = 0, massT = 1, bl = 0, bs = 0, bsV = 0, proxV = 0, lean = 0
    let G_fr = 0, G_drip = 0

    const BTN = { x: 0, y: 0, hl: 0, r: 0 }
    const BODY = { x: 0, y: 0, hl: 0, r: 0 }
    const info = { sd: 0, nx: 0, ny: -1, ex: 0, ey: 0 }

    function pill(x, y, c) {
      const qx = x - c.x, qy = y - c.y, sx = cl(qx, -c.hl, c.hl), dx = qx - sx
      const l = Math.hypot(dx, qy)
      let nx, ny
      if (l > 1e-4) { nx = dx / l; ny = qy / l } else { nx = 0; ny = -1 }
      info.sd = l - c.r; info.nx = nx; info.ny = ny
      info.ex = c.x + sx + nx * c.r; info.ey = c.y + ny * c.r
      return info
    }

    function overChar(x, y) {
      const rx = Math.min(0.25 * H, 0.35 * W), ry = 0.32 * H
      const a = (x - W / 2) / rx, b = (y - 0.42 * H) / ry
      return a * a + b * b < 1
    }

    /* Tendrils setup */
    const TN = 10, TP = 6
    const tend = []
    const PA = new Float32Array(TN * TP * 3)
    const AA = new Float32Array(24 * 3)
    const QA = new Float32Array(8 * 3)

    for (let k = 0; k < TN; k++) {
      const o = {
        k, off: (k - (TN - 1) / 2) * 15,
        thr: 0.05 + k * 0.08,
        maxLen: 230 + rnd(k * 3.1) * 170,
        jx: (rnd(k * 7.3) - 0.5) * 70,
        jy: (rnd(k * 5.9) - 0.5) * 70,
        base: k < 3 ? 5.4 : k < 7 ? 3.3 : 1.9,
        curv: (rnd(k * 2.2) - 0.5) * 54,
        wf: 2 + rnd(k) * 3,
        ph: rnd(k * 4.4) * 6.28,
        st: 0, ext: 0, cd: 0, tens: 0,
        rx: cx, ry: cy,
        x: new Float32Array(TP), y: new Float32Array(TP),
        vx: new Float32Array(TP), vy: new Float32Array(TP),
      }
      for (let j = 0; j < TP; j++) {
        o.x[j] = cx; o.y[j] = cy
      }
      tend.push(o)
    }

    /* Droplets */
    const drops = []
    for (let i = 0; i < 6; i++) {
      drops.push({ a: 0, x: 0, y: 0, vx: 0, vy: 0, r: 0, age: 0, max: 0.5, tx: 0, ty: 0, free: false })
    }

    function spawn(x, y, vx, vy, tx, ty, r, free) {
      if (reduceMotion) return
      for (let i = 0; i < 6; i++) {
        const d = drops[i]
        if (!d.a) {
          d.a = 1; d.x = x; d.y = y; d.vx = vx; d.vy = vy; d.tx = tx; d.ty = ty; d.r = r
          d.age = 0; d.free = !!free; d.max = free ? 0.7 + Math.random() * 0.5 : 0.4 + Math.random() * 0.3
          return
        }
      }
    }

    function triggerRoar() {
      roar = 1
      symbioteStore.state.roar = 1
      playRoarSound()
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * 6.2832 + Math.random() * 0.6
        spawn(
          BODY.x + Math.cos(a) * BODY.r,
          BODY.y + Math.sin(a) * BODY.r,
          Math.cos(a) * 460,
          Math.sin(a) * 460 - 220,
          0, 0,
          5 + Math.random() * 4,
          true
        )
      }
    }

    const unsubRoar = symbioteStore.subscribe((event) => {
      if (event === 'roar') triggerRoar()
    })

    /* Artery chain */
    const M = 24
    const ax = new Float32Array(M), ay = new Float32Array(M), avx = new Float32Array(M), avy = new Float32Array(M)
    for (let i = 0; i < M; i++) { ax[i] = cx; ay[i] = cy }

    function startSeq() {
      ph = 'out'
      pt = 0
    }

    /* Pointer input listeners */
    const updatePointer = (e) => {
      const rect = heroEl.getBoundingClientRect()
      const k = rect.width > 0 ? W / rect.width : 1
      P.x = (e.clientX - rect.left) * k
      P.y = (e.clientY - rect.top) * k
      const inside = P.x >= 0 && P.x <= W && P.y >= 0 && P.y <= H
      if (!P.inW && inside) { P.sx = P.x; P.sy = P.y }
      P.inW = inside
      symbioteStore.state.pointerInside = inside
      symbioteStore.state.pointerX = P.x
      symbioteStore.state.pointerY = P.y
    }

    const onPointerMove = (e) => {
      updatePointer(e)
      if (P.drag) {
        const dx = e.clientX - P.lx, dy = e.clientY - P.ly
        dragMoved += Math.abs(dx) + Math.abs(dy)
        P.lx = e.clientX; P.ly = e.clientY
      }
    }

    const onPointerDown = (e) => {
      updatePointer(e)
      P.down = true
      symbioteStore.state.pointerDown = true
      if (overChar(P.x, P.y)) {
        P.drag = true
        P.lx = e.clientX; P.ly = e.clientY
        dragMoved = 0
        downT = performance.now()
      }
      const i = pill(P.x, P.y, BTN)
      if (ph === 'idle' && i.sd < 90 * S) pressV += 7
    }

    const onPointerUp = (e) => {
      if (P.drag && ph === 'hold' && dragMoved < 8 && performance.now() - downT < 400) {
        triggerRoar()
      }
      P.down = false
      P.drag = false
      symbioteStore.state.pointerDown = false
      if (e.pointerType === 'touch') {
        P.inW = false
        symbioteStore.state.pointerInside = false
      }
    }

    const onPointerLeave = () => {
      P.inW = false
      symbioteStore.state.pointerInside = false
    }

    const onButtonClick = (e) => {
      pressV += 7
      if (ph === 'idle') {
        e.preventDefault()
        startSeq()
      } else if (ph === 'hold' && pt > 0.12) {
        e.preventDefault()
        ph = 'back'
        pt = 0
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    document.addEventListener('mouseleave', onPointerLeave)
    buttonEl.addEventListener('click', onButtonClick)

    /* Physics & Sequence Step */
    function step(dt, time) {
      /* Pointer smoothing */
      const lf = Math.min(1, dt * 30), ox = P.sx, oy = P.sy
      P.sx += (P.x - P.sx) * lf
      P.sy += (P.y - P.sy) * lf
      P.vx += ((P.sx - ox) / dt - P.vx) * Math.min(1, dt * 14)
      P.vy += ((P.sy - oy) / dt - P.vy) * Math.min(1, dt * 14)

      symbioteStore.state.smoothX = P.sx
      symbioteStore.state.smoothY = P.sy
      symbioteStore.state.velocityX = P.vx
      symbioteStore.state.velocityY = P.vy

      const venom = (ph === 'hold') || (ph === 'cover' && pt > 0.88)
      if (roar > 0) roar = Math.max(0, roar - dt / 1.2)
      symbioteStore.state.roar = roar

      /* Target chest and body center */
      const chestS = {
        x: symbioteStore.state.chestX || W / 2,
        y: symbioteStore.state.chestY || H * 0.42,
      }
      BODY.x = chestS.x
      BODY.y = chestS.y + 0.035 * H
      BODY.hl = 0
      BODY.r = Math.min(0.075 * H, 0.12 * W)

      BTN.x = cx
      BTN.y = cy
      BTN.hl = hl * ps
      BTN.r = rad * ps

      /* Proximity detection */
      const src = venom ? BODY : BTN
      const pi0 = pill(P.sx, P.sy, src)
      const sd = pi0.sd
      const att = venom ? Math.min(0.45 * H, 0.9 * W) : CFG.attract * Math.max(0.85, S)
      let raw = P.inW ? Math.max(0, 1 - Math.max(sd, 0) / att) : 0
      raw = raw * raw * (3 - 2 * raw)
      const prox = raw
      proxV = prox
      symbioteStore.state.proximity = prox

      if (prox > 0.12) armed = 3
      else armed = Math.max(0, armed - dt)

      /* Auto commit: moving from button to character */
      if (ph === 'idle') {
        if (armed > 0 && P.inW && overChar(P.sx, P.sy) && prox < 0.35) {
          dwell += dt
          if (dwell > CFG.dwell) startSeq()
        } else {
          dwell = Math.max(0, dwell - dt)
        }
      }

      /* Sequence Timeline */
      let lo = 0, hi = 0, blob = 0, blT = 0
      if (ph !== 'idle') {
        pt += dt / DUR[ph]
        if (pt >= 1) {
          pt = 0
          ph = ph === 'out' ? 'cover' : ph === 'cover' ? 'hold' : ph === 'hold' ? 'back' : 'idle'
        }
      }
      symbioteStore.state.phase = ph

      if (ph === 'out') {
        massT = 1 - e5(pt)
        infT = 0
        faceT = 0
        hi = e5(pt)
        blob = 16 * S * sm(0.78, 1, pt)
        blT = pt > 0.72 ? 1 : 0
      } else if (ph === 'cover') {
        massT = 0
        infT = e5(pt)
        faceT = pt > 0.62 ? 1 : 0
        lo = sm(0, 0.8, pt)
        hi = 1
        blob = 16 * S * (1 - sm(0.05, 0.5, pt))
        blT = 1
      } else if (ph === 'hold') {
        massT = 0
        infT = 1
        faceT = 1
        blT = 1
      } else if (ph === 'back') {
        faceT = pt < 0.12 ? 1 : 0
        infT = 1 - e5((pt - 0.1) / 0.55)
        if (pt < 0.8) {
          if (pt > 0.5) {
            lo = 1 - e5((pt - 0.5) / 0.3)
            hi = 1
          }
        } else {
          lo = 0
          hi = 1 - e5((pt - 0.8) / 0.2)
        }
        massT = pt > 0.8 ? 1 : 0
        blob = pt > 0.5 && pt < 0.8 ? 10 * S : 0
        blT = pt < 0.72 ? 1 : 0
      } else {
        massT = 1
        infT = 0
        faceT = 0
        blT = 0
      }

      inf += (infT - inf) * (1 - Math.exp(-(reduceMotion ? 30 : 5) * dt))
      face += (faceT - face) * (1 - Math.exp(-4 * dt))
      psV += ((massT - ps) * 60 - psV * 7) * dt
      ps += psV * dt
      if (ps < 0) { ps = 0; psV = 0 }

      bl += (blT - bl) * (1 - Math.exp(-9 * dt))
      bsV += ((bl - bs) * 190 - bsV * 15) * dt
      bs += bsV * dt

      pressV += (((P.down && pi0.sd < 20 && !venom) ? 1 : 0) - press) * 220 * dt - pressV * 18 * dt
      press += pressV * dt

      symbioteStore.state.infection = inf
      symbioteStore.state.face = face
      symbioteStore.state.pillScale = ps
      symbioteStore.state.blueButton = bl

      /* Face open parameter */
      const openT = venom ? cl(0.5 + 0.4 * prox + 0.55 * roar + 0.08 * Math.sin(time * 5.3), 0, 1) : 0.5
      symbioteStore.state.open += (openT - symbioteStore.state.open) * Math.min(1, dt * 7)

      G_fr = 10 + inf * H * 0.55
      G_drip = sm(0.45, 1, inf)

      /* Artery stream */
      const active = (ph === 'out' || ph === 'cover' || (ph === 'back' && pt > 0.3))
      const Ax = cx, Ay = cy - rad * ps * 0.3, Bx = chestS.x, By = chestS.y + 8, dyy = By - Ay
      const sw = Math.sin(time * 1.3) * 32, sw2 = Math.cos(time * 1.1) * 36
      const p1x = Ax + sw, p1y = Ay + dyy * 0.55, p2x = Bx + sw2 + (Ax - Bx) * 0.25, p2y = By - dyy * 0.3

      for (let j = 0; j < M; j++) {
        const t = j / (M - 1), u = 1 - t
        const gx = u * u * u * Ax + 3 * u * u * t * p1x + 3 * u * t * t * p2x + t * t * t * Bx
        const gy = u * u * u * Ay + 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t * By

        if (!active) {
          ax[j] = gx; ay[j] = gy; avx[j] = 0; avy[j] = 0
        } else if (j === 0) {
          ax[0] = gx; ay[0] = gy
        } else {
          const stf = 70 + 40 * t
          avx[j] += ((gx - ax[j]) * stf - avx[j] * 2 * Math.sqrt(stf) * 0.55) * dt
          avy[j] += ((gy - ay[j]) * stf - avy[j] * 2 * Math.sqrt(stf) * 0.55) * dt
          ax[j] += avx[j] * dt
          ay[j] += avy[j] * dt
        }

        let r = 0
        if (active && t >= lo - 0.001 && t <= hi + 0.001) {
          const fl = (lo > 0.001 ? sm(lo, lo + 0.07, t) : 1) * (hi < 0.999 ? sm(hi, hi - 0.07, t) : 1)
          r = 13 * S * (0.65 + 0.75 * Math.pow(1 - t, 2.5)) * (1 - 0.3 * Math.sin(Math.PI * t)) * fl
          if (r < 0.5) r = 0
        }
        AA[j * 3] = ax[j]
        AA[j * 3 + 1] = ay[j]
        AA[j * 3 + 2] = r
      }

      /* Tendrils */
      let mode
      if (ph === 'idle') mode = P.inW ? 'idle' : 'none'
      else if (venom) mode = roar > 0 ? 'roar' : (P.inW && prox > 0.04) ? 'idle' : 'wave'
      else if (ph === 'out' || ph === 'cover') mode = 'seq'
      else mode = 'none'

      const S0 = (venom || ph === 'back') ? BODY : BTN
      const ofs = (S0 === BTN) ? ps : 1

      for (let k = 0; k < TN; k++) {
        const td = tend[k]
        td.cd -= dt
        let tx, ty

        if (mode === 'seq') {
          tx = chestS.x + td.jx; ty = chestS.y + td.jy
        } else if (mode === 'roar') {
          const ra = (td.k / TN) * 6.2832 + 0.4 + Math.sin(time * 3 + td.k) * 0.15
          const rd = (BODY.r + (150 + rnd(td.k * 1.7) * 200) * Math.sqrt(Math.sin(Math.PI * cl(1 - roar, 0, 1))))
          tx = BODY.x + Math.cos(ra) * rd; ty = BODY.y + Math.sin(ra) * rd
        } else if (mode === 'wave') {
          const wa = time * 0.6 + td.k * 2.1
          const wd = BODY.r + 110 + 40 * Math.sin(time * 1.3 + td.k)
          tx = BODY.x + Math.cos(wa) * wd * 1.2; ty = BODY.y + Math.sin(wa) * wd * 0.8 - 30
        } else {
          tx = P.sx + td.jx * 0.15; ty = P.sy + td.jy * 0.15
        }

        const q = pill(tx, ty, S0)
        const qn = q.nx, qm = q.ny, qs = q.sd
        const e2 = pill(q.ex - qm * td.off * ofs, q.ey + qn * td.off * ofs, S0)
        let rx = e2.ex - e2.nx * 2.5, ry = e2.ey - e2.ny * 2.5

        if (mode === 'seq' && ph === 'cover') {
          const det = sm(0.1, 0.85, pt)
          rx += (tx - rx) * det; ry += (ty - ry) * det
        }

        const rl = Math.min(1, dt * 9)
        td.rx += (rx - td.rx) * rl
        td.ry += (ry - td.ry) * rl

        const dx = tx - td.rx, dy = ty - td.ry
        const len = Math.hypot(dx, dy)
        td.tens = Math.min(1.3, len / td.maxLen)

        const want = mode === 'seq' ? ((ph === 'cover' || pt > td.thr * 0.55) ? 1 : 0)
          : mode === 'roar' ? (roar > 0.12 ? 1 : 0)
          : mode === 'wave' ? (td.k % 3 === 0 ? 1 : 0)
          : mode === 'idle' ? (prox > td.thr ? 1 : 0) : 0

        if (td.st === 0) {
          for (let j = 0; j < TP; j++) {
            td.x[j] = td.rx; td.y[j] = td.ry; td.vx[j] = 0; td.vy[j] = 0
          }
          td.ext = 0
          if (want && td.cd <= 0) td.st = 1
        } else if (td.st === 1) {
          td.ext += (1 - td.ext) * Math.min(1, dt * (5 + td.k * 0.4))
          if (!want) {
            td.st = 2
          } else if (mode === 'idle' && td.tens >= 1 && qs > 0) {
            td.st = 2
            td.cd = 0.45
            if (len > 60) {
              spawn((td.rx + tx) * 0.5, (td.ry + ty) * 0.5, -dx * 1.6 + (Math.random() - 0.5) * 90, -dy * 1.6 + (Math.random() - 0.5) * 90, td.rx, td.ry, 2 + Math.random() * 2, false)
            }
            for (let j = 1; j < TP; j++) {
              td.vx[j] -= dx * (j / TP) * 2.5
              td.vy[j] -= dy * (j / TP) * 2.5
            }
          }
        } else {
          td.ext -= dt * 5
          if (td.ext <= 0.02) { td.st = 0; td.ext = 0 }
        }

        const ee = Math.max(0, td.ext)
        const tipx = td.rx + dx * ee, tipy = td.ry + dy * ee
        const ll = Math.max(len * ee, 1), px = -dy / (len || 1), py = dx / (len || 1)
        const str = 1 - 0.6 * Math.min(1, td.tens), wob = reduceMotion ? 0 : Math.sin(time * td.wf + td.ph) * 9

        for (let j = 0; j < TP; j++) {
          const tt = j / (TP - 1)
          if (j === 0) {
            td.x[0] = td.rx; td.y[0] = td.ry; continue
          }
          const sag = Math.sin(Math.PI * tt) * (td.curv + wob) * str * Math.min(1, ll / 100)
          const gx2 = td.rx + (tipx - td.rx) * tt + px * sag
          const gy2 = td.ry + (tipy - td.ry) * tt + py * sag
          const st = (170 + td.k * 12) * (0.55 + 0.45 * tt), dm = Math.sqrt(st)
          td.vx[j] += ((gx2 - td.x[j]) * st - td.vx[j] * dm) * dt
          td.vy[j] += ((gy2 - td.y[j]) * st - td.vy[j] * dm) * dt
          td.x[j] += td.vx[j] * dt
          td.y[j] += td.vy[j] * dt
        }

        let g = cl(td.ext / 0.12, 0, 1)
        g = g * g * (3 - 2 * g)

        for (let j = 0; j < TP; j++) {
          const tt = j / (TP - 1), idx = (k * 6 + j) * 3
          let rr = 0
          if (td.st !== 0 && g > 0) {
            const fa = 1 + 1.6 * Math.pow(1 - tt, 3)
            const tp = td.st === 1 ? 0.6 + 0.8 * Math.pow(tt, 4) : Math.max(0.25, 1 - tt * 0.7)
            const nk = 1 - Math.sin(Math.PI * tt) * Math.min(0.8, td.tens * 0.75)
            rr = Math.max(0.6, td.base * g * fa * tp * nk * S)
          }
          PA[idx] = td.x[j]
          PA[idx + 1] = td.y[j]
          PA[idx + 2] = rr
        }
      }

      /* Blobs + Droplets */
      const b = pill(P.sx, P.sy, src)
      QA[0] = b.ex + b.nx * 2
      QA[1] = b.ey + b.ny * 2
      QA[2] = ((venom || ph === 'idle') && b.sd > 0 && P.inW && (venom || ps > 0.5))
        ? (3 + 13 * prox) * S * (venom ? 1 : ps) * (0.9 + 0.1 * Math.sin(time * 5))
        : 0
      QA[3] = chestS.x
      QA[4] = chestS.y + 8
      QA[5] = blob

      for (let i = 0; i < 6; i++) {
        const d = drops[i], qq = (2 + i) * 3
        if (!d.a) { QA[qq + 2] = 0; continue }
        d.age += dt
        if (d.age >= d.max) { d.a = 0; QA[qq + 2] = 0; continue }
        if (d.free) {
          d.vy += 1100 * dt
          d.vx *= Math.pow(0.5, dt)
        } else {
          d.vx += ((d.tx - d.x) * 40 - d.vx * 6) * dt
          d.vy += ((d.ty - d.y) * 40 - d.vy * 6) * dt
        }
        d.x += d.vx * dt
        d.y += d.vy * dt
        QA[qq] = d.x
        QA[qq + 1] = d.y
        QA[qq + 2] = d.r * (1 - d.age / d.max)
      }

      /* Label styling */
      if (label) {
        const lop = Math.max(cl((ps - 0.58) / 0.3, 0, 1), cl(bl * 1.4, 0, 1))
        const lsc = (0.6 + 0.4 * ps) * (1 - bl) + bl
        label.style.transform = `scale(${lsc.toFixed(3)}) translateY(${(press * 2).toFixed(2)}px)`
        label.style.opacity = lop.toFixed(2)
      }

      /* Real blue button reveal under liquid */
      if (backplate) {
        const bsc = (0.86 + 0.14 * bs) * (1 - 0.035 * (P.down && !venom && ph !== 'idle' ? 1 : 0) * bl)
        backplate.style.opacity = cl(bl * 1.5, 0, 1).toFixed(3)
        backplate.style.transform = `scale(${bsc.toFixed(3)})`
      }
    }

    /* Render loop */
    let last = performance.now(), el = 0, rafId = 0

    function frame(now) {
      rafId = requestAnimationFrame(frame)
      if (document.hidden || !activeRef.current) { last = now; return }
      measure()
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000))
      last = now
      el += dt

      step(dt, el)

      /* Upload mask texture if ready */
      const storeState = symbioteStore.state
      if (storeState.maskDirty && storeState.maskCanvas) {
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, storeState.maskCanvas)
        storeState.maskDirty = false
      }

      /* Bounding box calculation for shader */
      let x0 = cx - hl - rad - 90, x1 = cx + hl + rad + 90
      let y0 = cy - rad - 90, y1 = cy + rad + 90

      function ext(arr, n) {
        for (let i = 0; i < n; i++) {
          const z = arr[i * 3 + 2]
          if (z > 0) {
            const a = arr[i * 3], b = arr[i * 3 + 1], p = z + 70
            x0 = Math.min(x0, a - p)
            x1 = Math.max(x1, a + p)
            y0 = Math.min(y0, b - p)
            y1 = Math.max(y1, b + p)
          }
        }
      }
      ext(PA, TN * TP)
      ext(AA, 24)
      ext(QA, 8)

      const bw = Math.min(0.36 * H, 0.5 * W)
      const cbx0 = W / 2 - bw, cbx1 = W / 2 + bw
      const cby0 = 0.06 * H, cby1 = 0.78 * H + 130
      const covOn = inf > 0.002

      if (covOn) {
        x0 = Math.min(x0, cbx0)
        x1 = Math.max(x1, cbx1)
        y0 = Math.min(y0, cby0)
        y1 = Math.max(y1, cby1)
      }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.uniform2f(U.uRes, canvas.width, canvas.height)
      gl.uniform1f(U.uDpr, dpr)
      gl.uniform1f(U.uT, reduceMotion ? 0 : el)
      gl.uniform1f(U.uPress, press)
      gl.uniform2f(U.uC, cx, cy)
      gl.uniform2f(U.uHR, hl * ps, rad * ps)
      gl.uniform4f(U.uBox, x0, y0, x1, y1)
      gl.uniform3fv(U.uP, PA)
      gl.uniform3fv(U.uA, AA)
      gl.uniform3fv(U.uQ, QA)
      gl.uniform2f(U.uCss, W, H)
      gl.uniform2f(U.uCh, storeState.chestX || W / 2, storeState.chestY || H * 0.42)
      gl.uniform1f(U.uFr, G_fr)
      gl.uniform1f(U.uDrip, G_drip)
      gl.uniform1f(U.uCov, covOn ? 1 : 0)
      gl.uniform1f(U.uFaceOn, face)
      gl.uniform4f(U.uCB, cbx0, cby0, cbx1, cby1)

      gl.drawArrays(gl.TRIANGLES, 0, 3)

      invalidateRef?.current?.()
    }

    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      unsubRoar()
      resizeObserver.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.removeEventListener('mouseleave', onPointerLeave)
      buttonEl.removeEventListener('click', onButtonClick)

      gl.deleteTexture(tex)
      gl.deleteProgram(prog)
      symbioteStore.reset()
    }
  }, [buttonRef, heroRef, invalidateRef])

  return <canvas ref={canvasRef} className="symbiote-overlay" aria-hidden="true" />
}
