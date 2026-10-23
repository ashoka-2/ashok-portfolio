import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { portfolioAssets } from '../../lib/assets.js'

/* ================= CONFIG ================= */
const CFG = {
  out: 2.1,
  cover: 2.3,
  hold: 5.0,
  back: 3.2,
  attract: 270,
  dwell: 0.25,
  eyeUp: 0.072,
  headHalf: 0.056,
  wideGrin: true,
}

/* ================= SHADERS ================= */
const VS = `#version 300 es
void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);gl_Position=vec4(p*2.-1.,0.,1.);}
`

const FS = `#version 300 es
precision highp float;
uniform vec2 uRes,uC,uHR,uCss,uCh;uniform float uDpr,uT,uPress,uFr,uDrip,uCov,uFaceOn;uniform vec4 uBox,uCB;uniform sampler2D uTex;
uniform vec3 uP[60];uniform vec3 uA[24];uniform vec3 uQ[8];out vec4 o;
float smin(float a,float b,float k){float h=max(k-abs(a-b),0.)/k;return min(a,b)-h*h*k*.25;}
float h2(float x){return fract(sin(x*127.1)*43758.5453);}
float vn2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=h2(i.x+i.y*57.),b=h2(i.x+1.+i.y*57.),c=h2(i.x+(i.y+1.)*57.),d=h2(i.x+1.+(i.y+1.)*57.);return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float sA(vec2 p){return texture(uTex,p/uCss).a;}
float cap(vec2 p,vec3 a,vec3 b){vec2 pa=p-a.xy,ba=b.xy-a.xy;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-4),0.,1.);return length(pa-ba*h)-mix(a.z,b.z,h);}
float coat(vec2 p){
  float s=sA(p)*2.;
  for(int i=0;i<8;i++){float a=float(i)*.7854;s+=sA(p+vec2(cos(a),sin(a))*14.);}
  for(int i=0;i<4;i++){float a=float(i)*1.5708+.39;s+=sA(p+vec2(cos(a),sin(a))*7.);}
  s/=14.;float sL=sA(p);for(int i=0;i<8;i++){float a=float(i)*.7854;sL+=sA(p+vec2(cos(a),sin(a))*36.);}sL/=9.;
  float b=(.5-s)*30.-5.-16.*smoothstep(.55,1.,sL);
  float f=length(p-uCh)-uFr+(vn2(p*.025+uT*.25)-.5)*70.;
  return -smin(-b,-f,14.);
}
float map(vec2 p){
  vec2 q=p-uC;float x=clamp(q.x,-uHR.x,uHR.x);float d=uHR.y<.4?1e5:length(q-vec2(x,0.))-uHR.y;
  d+=(.9*sin(p.x*.055+uT*1.6)*sin(p.y*.07-uT*1.2)+uPress*2.5)*clamp(uHR.y/30.,0.,1.);
  float a=1e5;for(int s=0;s<23;s++){vec3 u=uA[s],v=uA[s+1];if(u.z>.05&&v.z>.05)a=min(a,cap(p,u,v));}
  if(a<1e4)d=smin(d,a,18.);
  for(int t=0;t<10;t++){float m=1e5;for(int s=0;s<5;s++){vec3 u=uP[t*6+s],v=uP[t*6+s+1];if(u.z>.05&&v.z>.05)m=min(m,cap(p,u,v));}if(m<1e4)d=smin(d,m,14.);}
  for(int i=0;i<8;i++){vec3 u=uQ[i];if(u.z>.05)d=smin(d,length(p-u.xy)-u.z,14.);}
  if(uCov>.5&&p.x>uCB.x&&p.x<uCB.z&&p.y>uCB.y&&p.y<uCB.w){
    float c0=coat(p);float col=pow(max(0.,sin(p.x*.11+1.7*sin(p.x*.031))),6.);
    float L=uDrip*(20.+80.*h2(floor(p.x/9.)))*col*(.85+.15*sin(uT*2.+p.x*.2));
    float c1=coat(p-vec2(0.,L));d=smin(d,min(c0,c1),10.);
  }
  return d;
}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uDpr;
  if(p.x<uBox.x||p.x>uBox.z||p.y<uBox.y||p.y>uBox.w){o=vec4(0.);return;}
  float d=map(p);vec2 gr=vec2(dFdx(d),-dFdy(d));float gl2=length(gr);vec2 gn=gl2>1e-4?gr/gl2:vec2(0.);
  float t=clamp(-d/(uCov>.5?55.:14.),0.,1.);vec3 n=normalize(vec3(gn*(1.-t)*1.15,.3+t*1.1));
  if(uCov>.5){n.xy+=(vec2(vn2(p*.045+uT*.35),vn2(p*.045+9.-uT*.3))-.5)*.28;n=normalize(n);}
  vec3 V=vec3(0.,0.,1.);vec3 L1=normalize(vec3(-.5,-.65,.6)),L2=normalize(vec3(.55,.6,.5));
  float h1=max(dot(n,normalize(L1+V)),0.);float s1=pow(h1,70.),s1b=pow(h1,16.)*.12;float s2=pow(max(dot(n,normalize(L2+V)),0.),38.)*.3;
  float fr=pow(1.-n.z,3.);float wet=.5+.5*sin(p.x*.09-p.y*.07+uT*1.4+d*.35);
  vec3 col=vec3(.012,.013,.018)+vec3(.9,.94,1.)*(s1*.85+s1b+s2)+vec3(.3,.36,.55)*fr*.3+vec3(.05,.07,.14)*wet*fr;
  col+=vec3(.2,.26,.42)*clamp(1.+d/6.,0.,1.)*.3;
  if(uFaceOn>.01&&d<-2.){
    vec4 fm=texture(uTex,p/uCss);float e0=fm.r;float gw=0.;
    for(int i=0;i<6;i++){float a=float(i)*1.047;gw+=texture(uTex,(p+vec2(cos(a),sin(a))*7.)/uCss).r;}gw/=6.;
    col=mix(col,vec3(.97,.99,1.),e0*uFaceOn);col+=vec3(.3,.45,.95)*gw*.35*uFaceOn;
  }
  float aa=clamp(.5-d*uDpr,0.,1.);
  o=vec4(col*aa,aa);
}
`

/* Venom face painted on 3D model surface (head-local coords) */
const FACE_GLSL = /* glsl */ `
{
  vec3 d3=vLP-uHC;float lat=dot(d3,vec3(-uFw.y,0.,uFw.x));float fo=dot(vON,vec3(uFw.x,0.,uFw.y));
  float gf=uFace*uFace*(3.-2.*uFace);float fmk=smoothstep(.12,.45,fo)*step(.001,uFace);
  float l=lat/uHS;float vy=(vLP.y-uEyeY)/uHS;

  /* eyes: big slanted almonds, sharp at both tips */
  vec2 eq=vec2(abs(l)-.5,vy-.04);float ca=.87,sa=.5;
  vec2 r=vec2(eq.x*ca+eq.y*sa,-eq.x*sa+eq.y*ca)/.47;r.x/=(.6+.4*gf);
  float xx=clamp(r.x,-1.,1.);
  float hh=.43*pow(max(1.-pow(abs(xx),1.7),0.),.8)*(1.+.28*xx);
  float de=max(abs(r.y)-hh*gf,abs(r.x)-1.02);float eye=(1.-smoothstep(-.05,.07,de))*smoothstep(.0,.15,gf);

  /* mouth: huge curved grin */
  float yy=vy+1.0;float cyL=.36*l*l-.06;float op=.07+.27*gf*(.3+.7*uOpen);
  float o2=op*pow(max(1.-l*l/1.3,0.),.55);float yU=cyL+o2,yL=cyL-o2;

  /* two interlocking rows of jagged teeth, with fangs */
  float fU=l*4.4,fL=l*4.4+.5;float cU=floor(fU),cL=floor(fL);
  float tU=1.-2.*abs(fract(fU)-.5),tL=1.-2.*abs(fract(fL)-.5);
  float hU=fract(sin(cU*12.9898)*43758.5453),hL=fract(sin((cL+7.3)*12.9898)*43758.5453);
  float tb=.2*gf*smoothstep(.0,.3,o2);float fang=exp(-pow((abs(l)-.36)/.1,2.));
  float lenU=tb*(.7+.7*hU)*(1.+1.1*fang),lenL=tb*(.6+.6*hL)*(1.+.5*fang);
  float dU=max((yU-yy)-lenU*tU,yy-yU),dL=max((yy-yL)-lenL*tL,yL-yy);
  float teeth=max(1.-smoothstep(-.02,.025,dU),1.-smoothstep(-.02,.025,dL))*step(abs(l),1.15)*smoothstep(.1,.5,gf)*1.;

  float feat=clamp(eye+teeth,0.,1.)*fmk*(1.+.04*sin(uT*2.5));
  if(uMode>.5)outgoingLight=vec3(feat,0.,0.);
}
`

/* Math utilities matching reference */
const rnd = (s) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const cl = (v, a, b) => Math.max(a, Math.min(b, v))
const sm = (a, b, v) => { const t = cl((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
const e5 = (t) => { t = cl(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10) }

export default function HeroModelCanvas({ interactionRef }) {
  const containerRef = useRef(null)
  const g3Ref = useRef(null)
  const ovRef = useRef(null)
  const hitAreaRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const g3 = g3Ref.current
    const ov = ovRef.current
    const hitArea = hitAreaRef.current
    const buttonEl = document.querySelector('.symbiote-trigger')
    if (!container || !g3 || !ov || !buttonEl) return undefined

    const backplate = buttonEl.querySelector('.symbiote-backplate')
    const label = buttonEl.querySelector('.symbiote-label') || buttonEl.firstElementChild

    const gl = ov.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
    if (!gl) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* Compile overlay shader */
    function sh(t, s) {
      const x = gl.createShader(t)
      gl.shaderSource(x, s)
      gl.compileShader(x)
      if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(x))
      return x
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const U = {}
    ;['uRes', 'uC', 'uHR', 'uDpr', 'uT', 'uPress', 'uBox', 'uP', 'uA', 'uQ', 'uTex', 'uCss', 'uCh', 'uFr', 'uDrip', 'uCov', 'uFaceOn', 'uCB'].forEach((n) => {
      U[n] = gl.getUniformLocation(prog, n)
    })

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    ;[[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach((a) => {
      gl.texParameteri(gl.TEXTURE_2D, a[0], a[1])
    })
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4))
    gl.uniform1i(U.uTex, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    /* Three.js 3D Scene */
    const renderer = new THREE.WebGLRenderer({ canvas: g3, alpha: true, antialias: true })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    cam.position.set(0, 0, 5.6)

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.4)
    dirLight1.position.set(3, 4, 5)
    scene.add(dirLight1)

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.65)
    dirLight2.position.set(-3, 1, 3)
    scene.add(dirLight2)

    const pointLight1 = new THREE.PointLight(0xffffff, 0.8, 5)
    pointLight1.position.set(0, -1.5, 2)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 1.3, 6)
    pointLight2.position.set(2, 1, -2)
    scene.add(pointLight2)

    const readThemeLights = () => {
      const styles = getComputedStyle(document.documentElement)
      return {
        ivory: styles.getPropertyValue('--hero-light-ivory').trim() || '#ffffff',
        rose: styles.getPropertyValue('--hero-light-rose').trim() || '#ffffff',
        deepRose: styles.getPropertyValue('--hero-light-deep-rose').trim() || '#ffffff',
        warm: styles.getPropertyValue('--hero-light-warm').trim() || '#ffffff',
      }
    }

    const applyThemeLights = () => {
      const c = readThemeLights()
      dirLight1.color.set(c.ivory)
      dirLight2.color.set(c.rose)
      pointLight1.color.set(c.deepRose)
      pointLight2.color.set(c.warm)
    }
    applyThemeLights()
    window.addEventListener('portfolio-theme-change', applyThemeLights)
    const themeObserver = new MutationObserver(applyThemeLights)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const pivot = new THREE.Group()
    scene.add(pivot)

    let W = 1, H = 1, dpr = 1, S = 1, cx = 0, cy = 0, hl = 0, rad = 0, btnY = 0, baseY = -0.08, modelScale = 2.8
    const cB = document.createElement('canvas')
    const cx2 = cB.getContext('2d')
    let mw = 1, mh = 1
    const G = { fr: 0, drip: 0 }

    const SI = {
      uFace: { value: 0 },
      uT: { value: 0 },
      uHC: { value: new THREE.Vector3() },
      uFw: { value: new THREE.Vector2(1, 0) },
      uHS: { value: 0.05 },
      uEyeY: { value: 0 },
      uMode: { value: 0 },
      uOpen: { value: 0.5 },
    }
    const HEADC = SI.uHC.value

    function patch(m) {
      const next = m.clone()
      if ('metalness' in next) next.metalness = 0.3
      if ('roughness' in next) next.roughness = Math.min(next.roughness ?? 0.7, 0.48)
      if ('envMapIntensity' in next) next.envMapIntensity = 1.15
      next.userData.symbioteBaseRoughness = next.roughness

      next.onBeforeCompile = function (s) {
        for (const k in SI) s.uniforms[k] = SI[k]
        s.vertexShader = s.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vLP;varying vec3 vON;varying vec3 vSymbioteWorldPosition;')
          .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvON=objectNormal;')
          .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLP=transformed;\nvSymbioteWorldPosition=(modelMatrix*vec4(transformed,1.0)).xyz;')
        s.fragmentShader = s.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vLP;varying vec3 vON;varying vec3 vSymbioteWorldPosition;uniform float uFace,uT,uHS,uEyeY,uMode,uOpen;uniform vec3 uHC;uniform vec2 uFw;')
          .replace('#include <color_fragment>', `#include <color_fragment>
            if (uMode < 0.5 && uFace > 0.001) {
              float symNoise = sin(vSymbioteWorldPosition.x * 9.3 + sin(vSymbioteWorldPosition.y * 7.1)) * sin(vSymbioteWorldPosition.z * 8.7 + vSymbioteWorldPosition.y * 3.7);
              float symEdge = smoothstep(-0.34, 0.18, uFace * 1.75 - symNoise * 0.24 - 0.9);
              diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.008, 0.011, 0.018), symEdge * 0.98);
            }
          `)
          .replace('#include <output_fragment>', `
            if (uMode < 0.5 && uFace > 0.001) {
              float symNoise = sin(vSymbioteWorldPosition.x * 9.3 + sin(vSymbioteWorldPosition.y * 7.1)) * sin(vSymbioteWorldPosition.z * 8.7 + vSymbioteWorldPosition.y * 3.7);
              float symEdge = smoothstep(-0.34, 0.18, uFace * 1.75 - symNoise * 0.24 - 0.9);
              float symRim = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 3.2) * symEdge;
              outgoingLight += vec3(0.19, 0.25, 0.33) * symRim * 0.75;
              outgoingLight += vec3(0.34, 0.38, 0.46) * pow(max(0.0, symNoise), 14.0) * symEdge * 0.22;
            }
            ${FACE_GLSL}
            #include <output_fragment>
          `)
      }
      next.customProgramCacheKey = function () { return 'venomface-metallic-v8' }
      next.needsUpdate = true
      return next
    }

    let model = null
    const chestL = new THREE.Vector3()
    const FW = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    let fwdI = 0, yaw0 = -Math.PI / 2, MH = 1, MTOP = 0
    const tmp = new THREE.Vector3()
    const chestW = new THREE.Vector3()

    function applyDims() {
      SI.uEyeY.value = MTOP - CFG.eyeUp * MH
      SI.uHS.value = CFG.headHalf * MH
    }
    function applyFace() {
      const f = FW[fwdI]
      SI.uFw.value.set(f[0], f[1])
      yaw0 = Math.atan2(-f[0], f[1])
    }

    function setupModel(root) {
      if (model) pivot.remove(model)
      const box = new THREE.Box3()
      const meshes = []
      root.traverse((n) => {
        if (n.isMesh) {
          meshes.push(n)
          n.castShadow = false
          n.receiveShadow = false
          n.geometry.computeBoundingBox()
          box.union(n.geometry.boundingBox)
          n.material = Array.isArray(n.material) ? n.material.map(patch) : patch(n.material)
        }
      })
      const c = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const Hh = size.y
      const thr = box.max.y - 0.13 * Hh
      let sx = 0, sz = 0, cnt = 0
      meshes.forEach((m) => {
        const p = m.geometry.attributes.position
        for (let i = 0; i < p.count; i++) {
          if (p.getY(i) > thr) { sx += p.getX(i); sz += p.getZ(i); cnt++ }
        }
      })
      HEADC.set(cnt ? sx / cnt : c.x, 0, cnt ? sz / cnt : c.z)
      MH = Hh
      MTOP = box.max.y
      applyDims()
      chestL.set(c.x, box.max.y - 0.27 * Hh, c.z)

      pivot.add(root)
      model = root
      applyFace()
      layout()
    }

    function layout() {
      const rect = container.getBoundingClientRect()
      W = rect.width
      H = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.75)

      ov.width = Math.round(W * dpr)
      ov.height = Math.round(H * dpr)
      gl.viewport(0, 0, ov.width, ov.height)

      renderer.setPixelRatio(dpr)
      renderer.setSize(W, H, false)

      cam.aspect = W / H
      cam.fov = 35
      cam.position.set(0, 0, 5.6)
      cam.updateProjectionMatrix()

      modelScale = W < 760 ? 2 : W < 1024 ? 2.4 : 2.8
      baseY = W < 760 ? 0.16 : W < 1024 ? 0.02 : -0.08
      pivot.position.y = baseY

      /* Measure real button */
      const bRect = buttonEl.getBoundingClientRect()
      cx = bRect.left - rect.left + bRect.width / 2
      btnY = bRect.top - rect.top + bRect.height / 2
      cy = btnY
      hl = Math.max(0, (bRect.width - bRect.height) / 2)
      rad = bRect.height / 2
      S = Math.min(1, bRect.width / 240)

      const ts = Math.min(1, 1400 / Math.max(W, H))
      mw = Math.ceil(W * ts)
      mh = Math.ceil(H * ts)
      cB.width = mw
      cB.height = mh
    }

    /* Load GLB */
    const loader = new GLTFLoader()
    if (MeshoptDecoder && loader.setMeshoptDecoder) loader.setMeshoptDecoder(MeshoptDecoder)
    loader.load(portfolioAssets.models.hero, (gltf) => {
      setupModel(gltf.scene)
    }, undefined, (err) => console.error('Failed to load character GLB:', err))

    /* Pointer / Rotation input in hero-local coords */
    const P = { x: -999, y: -999, sx: -999, sy: -999, vx: 0, vy: 0, inW: false, down: false, drag: false, lx: 0, ly: 0 }
    let dragX = 0, dragY = 0, dragMoved = 0, downT = 0, roar = 0, pressV = 0
    let yawU = 0, yawF = 0, pitchU = 0, pitchF = 0, yawVel = 0, idleT = 0

    function setP(e) {
      const rect = container.getBoundingClientRect()
      P.x = e.clientX - rect.left
      P.y = e.clientY - rect.top
      if (!P.inW) { P.sx = P.x; P.sy = P.y }
      P.inW = true
      if (P.drag) {
        const dx = e.clientX - P.lx, dy = e.clientY - P.ly
        dragX += dx; dragY += dy
        dragMoved += Math.abs(dx) + Math.abs(dy)
        P.lx = e.clientX; P.ly = e.clientY
      }
    }

    function overChar(x, y) {
      const rx = Math.min(0.2 * H, 0.3 * W), ry = 0.3 * H
      const a = (x - W / 2) / rx, b = (y - 0.42 * H) / ry
      return a * a + b * b < 1
    }

    /* Roar audio */
    let roarAudio = null
    try {
      roarAudio = new Audio('/sounds/venom-sound.mpeg')
      roarAudio.volume = 0.65
    } catch {}

    function triggerRoar() {
      roar = 1
      try {
        if (roarAudio) { roarAudio.currentTime = 0; roarAudio.play().catch(() => {}) }
      } catch {}
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

    /* State machine */
    let ph = 'idle', pt = 0, armed = 0, dwell = 0, inf = 0, infT = 0, face = 0, faceT = 0
    let ps = 1, psV = 0, massT = 1, press = 0, bl = 0, bs = 0, bsV = 0, proxV = 0, lean = 0
    const DUR = { out: CFG.out, cover: CFG.cover, hold: CFG.hold, back: CFG.back }

    function startSeq() {
      ph = 'out'
      pt = 0
    }

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

    /* Tendrils */
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
      for (let j = 0; j < TP; j++) { o.x[j] = cx; o.y[j] = cy }
      tend.push(o)
    }

    /* Droplets */
    const drops = []
    for (let i = 0; i < 6; i++) {
      drops.push({ a: 0, x: 0, y: 0, vx: 0, vy: 0, r: 0, age: 0, max: 0.5, tx: 0, ty: 0, free: false })
    }

    function spawn(x, y, vx, vy, tx, ty, r, free) {
      if (reduce) return
      for (let i = 0; i < 6; i++) {
        const d = drops[i]
        if (!d.a) {
          d.a = 1; d.x = x; d.y = y; d.vx = vx; d.vy = vy; d.tx = tx; d.ty = ty; d.r = r
          d.age = 0; d.free = !!free; d.max = free ? 0.7 + Math.random() * 0.5 : 0.4 + Math.random() * 0.3
          return
        }
      }
    }

    /* Artery */
    const M = 24
    const ax = new Float32Array(M), ay = new Float32Array(M), avx = new Float32Array(M), avy = new Float32Array(M)
    for (let i = 0; i < M; i++) { ax[i] = cx; ay[i] = cy }
    const chestS = { x: W / 2, y: H * 0.4 }

    /* Step function */
    function step(dt, time) {
      const lf = Math.min(1, dt * 30), ox = P.sx, oy = P.sy
      P.sx += (P.x - P.sx) * lf
      P.sy += (P.y - P.sy) * lf
      P.vx += ((P.sx - ox) / dt - P.vx) * Math.min(1, dt * 14)
      P.vy += ((P.sy - oy) / dt - P.vy) * Math.min(1, dt * 14)

      const venom = (ph === 'hold') || (ph === 'cover' && pt > 0.88)
      if (roar > 0) roar = Math.max(0, roar - dt / 1.2)

      if (model) {
        const ddx = dragX, ddy = dragY
        dragX = 0; dragY = 0
        if (P.drag) {
          yawU += ddx * 0.011
          pitchU = cl(pitchU + ddy * 0.006, -0.55, 0.55)
          yawVel += (cl((ddx * 0.011) / dt, -14, 14) - yawVel) * Math.min(1, dt * 16)
          idleT = 0
        } else {
          yawU += yawVel * dt
          yawVel *= Math.pow(0.06, dt)
          idleT += dt
          if (idleT > 6 && Math.abs(yawVel) < 0.15) {
            const tg0 = Math.round(yawU / 6.2832) * 6.2832, k2 = Math.min(1, dt * 1.6)
            yawU += (tg0 - yawU) * k2
            pitchU += (0 - pitchU) * k2
          }
        }
        const fol = P.inW && !P.drag
        yawF += ((fol ? cl((P.sx / W - 0.5) * 0.9, -0.55, 0.55) : 0) - yawF) * Math.min(1, dt * 4)
        pitchF += ((fol ? cl((P.sy / H - 0.38) * 0.5, -0.3, 0.3) : 0) - pitchF) * Math.min(1, dt * 4)
        const leanT = (venom && P.inW) ? cl((P.sx - W / 2) / (W * 0.5), -1, 1) * (0.12 + 0.2 * proxV) : 0
        lean += (leanT * 0.8 - lean) * (1 - Math.exp(-4 * dt))

        pivot.rotation.set(pitchU + pitchF, yaw0 + yawU + yawF, 0)
        const floatY = reduce ? 0 : Math.sin(time * 0.7) * 0.045
        pivot.position.set(lean, baseY + floatY + Math.sin(time * 1.7) * 0.025 * inf, 0)
        pivot.scale.setScalar(modelScale * (1 + 0.012 * inf * Math.sin(time * 2.3) + 0.05 * roar))
        pivot.updateMatrixWorld(true)

        if (inf > 0.001) {
          model.traverse((n) => {
            if (!n.isMesh) return
            const mats = Array.isArray(n.material) ? n.material : [n.material]
            for (const m of mats) {
              if (m?.userData?.symbioteBaseRoughness !== undefined) {
                m.roughness = THREE.MathUtils.lerp(m.userData.symbioteBaseRoughness, 0.09, inf)
              }
            }
          })
        }

        chestW.copy(chestL)
        model.localToWorld(chestW)
        tmp.copy(chestW).project(cam)
        chestS.x = (tmp.x * 0.5 + 0.5) * W
        chestS.y = (-tmp.y * 0.5 + 0.5) * H
      }

      BODY.x = chestS.x
      BODY.y = chestS.y + 0.035 * H
      BODY.hl = 0
      BODY.r = Math.min(0.12 * H, 0.16 * W)
      BTN.x = cx
      BTN.y = cy
      BTN.hl = hl * ps
      BTN.r = rad * ps

      const src = venom ? BODY : BTN
      const pi0 = pill(P.sx, P.sy, src), sd = pi0.sd
      const att = venom ? Math.min(0.45 * H, 0.9 * W) : CFG.attract * Math.max(0.85, S)
      let raw = P.inW ? Math.max(0, 1 - Math.max(sd, 0) / att) : 0
      raw = raw * raw * (3 - 2 * raw)
      proxV = raw

      if (proxV > 0.12) armed = 3
      else armed = Math.max(0, armed - dt)

      if (ph === 'idle') {
        if (armed > 0 && P.inW && overChar(P.sx, P.sy) && proxV < 0.35) {
          dwell += dt
          if (dwell > CFG.dwell) startSeq()
        } else {
          dwell = Math.max(0, dwell - dt)
        }
      }

      let lo = 0, hi = 0, blob = 0, blT = 0
      if (ph !== 'idle') {
        pt += dt / DUR[ph]
        if (pt >= 1) {
          pt = 0
          ph = ph === 'out' ? 'cover' : ph === 'cover' ? 'hold' : ph === 'hold' ? 'back' : 'idle'
        }
      }
      if (ph === 'out') {
        massT = 1 - e5(pt); infT = 0; faceT = 0; hi = e5(pt); blob = 16 * S * sm(0.78, 1, pt); blT = pt > 0.72 ? 1 : 0
      } else if (ph === 'cover') {
        massT = 0; infT = e5(pt); faceT = pt > 0.62 ? 1 : 0; lo = sm(0, 0.8, pt); hi = 1; blob = 16 * S * (1 - sm(0.05, 0.5, pt)); blT = 1
      } else if (ph === 'hold') {
        massT = 0; infT = 1; faceT = 1; blT = 1
      } else if (ph === 'back') {
        faceT = pt < 0.12 ? 1 : 0; infT = 1 - e5((pt - 0.1) / 0.55)
        if (pt < 0.8) {
          if (pt > 0.5) { lo = 1 - e5((pt - 0.5) / 0.3); hi = 1 }
        } else {
          lo = 0; hi = 1 - e5((pt - 0.8) / 0.2)
        }
        massT = pt > 0.8 ? 1 : 0; blob = pt > 0.5 && pt < 0.8 ? 10 * S : 0; blT = pt < 0.72 ? 1 : 0
      } else {
        massT = 1; infT = 0; faceT = 0; blT = 0
      }

      inf += (infT - inf) * (1 - Math.exp(-(reduce ? 30 : 5) * dt))
      face += (faceT - face) * (1 - Math.exp(-4 * dt))
      psV += ((massT - ps) * 60 - psV * 7) * dt
      ps += psV * dt
      if (ps < 0) { ps = 0; psV = 0 }
      bl += (blT - bl) * (1 - Math.exp(-9 * dt))
      bsV += ((bl - bs) * 190 - bsV * 15) * dt
      bs += bsV * dt
      pressV += (((P.down && pi0.sd < 20 && !venom) ? 1 : 0) - press) * 220 * dt - pressV * 18 * dt
      press += pressV * dt

      SI.uFace.value = face
      SI.uT.value = time
      G.fr = 10 + inf * H * 0.55
      G.drip = sm(0.45, 1, inf)

      const openT = venom ? cl(0.5 + 0.4 * proxV + 0.55 * roar + 0.08 * Math.sin(time * 5.3), 0, 1) : 0.5
      SI.uOpen.value += (openT - SI.uOpen.value) * Math.min(1, dt * 7)

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

      /* Tendril modes */
      let mode
      if (ph === 'idle') mode = P.inW ? 'idle' : 'none'
      else if (venom) mode = roar > 0 ? 'roar' : (P.inW && proxV > 0.04) ? 'idle' : 'wave'
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
          : mode === 'idle' ? (proxV > td.thr ? 1 : 0) : 0

        if (td.st === 0) {
          for (let j = 0; j < TP; j++) { td.x[j] = td.rx; td.y[j] = td.ry; td.vx[j] = 0; td.vy[j] = 0 }
          td.ext = 0
          if (want && td.cd <= 0) td.st = 1
        } else if (td.st === 1) {
          td.ext += (1 - td.ext) * Math.min(1, dt * (5 + td.k * 0.4))
          if (!want) {
            td.st = 2
          } else if (mode === 'idle' && td.tens >= 1 && qs > 0) {
            td.st = 2; td.cd = 0.45
            if (len > 60) spawn((td.rx + tx) * 0.5, (td.ry + ty) * 0.5, -dx * 1.6 + (Math.random() - 0.5) * 90, -dy * 1.6 + (Math.random() - 0.5) * 90, td.rx, td.ry, 2 + Math.random() * 2, false)
            for (let j = 1; j < TP; j++) { td.vx[j] -= dx * (j / TP) * 2.5; td.vy[j] -= dy * (j / TP) * 2.5 }
          }
        } else {
          td.ext -= dt * 5
          if (td.ext <= 0.02) { td.st = 0; td.ext = 0 }
        }

        const ee = Math.max(0, td.ext)
        const tipx = td.rx + dx * ee, tipy = td.ry + dy * ee
        const ll = Math.max(len * ee, 1), px = -dy / (len || 1), py = dx / (len || 1)
        const str = 1 - 0.6 * Math.min(1, td.tens), wob = reduce ? 0 : Math.sin(time * td.wf + td.ph) * 9

        for (let j = 0; j < TP; j++) {
          const tt = j / (TP - 1)
          if (j === 0) { td.x[0] = td.rx; td.y[0] = td.ry; continue }
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
            const fa = 1 + 1.6 * Math.pow(1 - tt, 3), tp = td.st === 1 ? 0.6 + 0.8 * Math.pow(tt, 4) : Math.max(0.25, 1 - tt * 0.7), nk = 1 - Math.sin(Math.PI * tt) * Math.min(0.8, td.tens * 0.75)
            rr = Math.max(0.6, td.base * g * fa * tp * nk * S)
          }
          PA[idx] = td.x[j]
          PA[idx + 1] = td.y[j]
          PA[idx + 2] = rr
        }
      }

      /* Blobs */
      const b = pill(P.sx, P.sy, src)
      QA[0] = b.ex + b.nx * 2
      QA[1] = b.ey + b.ny * 2
      QA[2] = ((venom || ph === 'idle') && b.sd > 0 && P.inW && (venom || ps > 0.5)) ? (3 + 13 * proxV) * S * (venom ? 1 : ps) * (0.9 + 0.1 * Math.sin(time * 5)) : 0
      QA[3] = chestS.x
      QA[4] = chestS.y + 8
      QA[5] = blob

      for (let i = 0; i < 6; i++) {
        const d = drops[i], qq = (2 + i) * 3
        if (!d.a) { QA[qq + 2] = 0; continue }
        d.age += dt
        if (d.age >= d.max) { d.a = 0; QA[qq + 2] = 0; continue }
        if (d.free) { d.vy += 1100 * dt; d.vx *= Math.pow(0.5, dt) }
        else { d.vx += ((d.tx - d.x) * 40 - d.vx * 6) * dt; d.vy += ((d.ty - d.y) * 40 - d.vy * 6) * dt }
        d.x += d.vx * dt; d.y += d.vy * dt
        QA[qq] = d.x; QA[qq + 1] = d.y; QA[qq + 2] = d.r * (1 - d.age / d.max)
      }

      /* Label & backplate update */
      if (label) {
        const lop = Math.max(cl((ps - 0.58) / 0.3, 0, 1), cl(bl * 1.4, 0, 1))
        const lsc = (0.6 + 0.4 * ps) * (1 - bl) + bl
        label.style.transform = 'scale(' + lsc.toFixed(3) + ') translateY(' + (press * 2).toFixed(2) + 'px)'
        label.style.opacity = lop.toFixed(2)
      }
      if (backplate) {
        const bsc = (0.86 + 0.14 * bs) * (1 - 0.035 * cl(P.down && !venom && ph !== 'idle' ? 1 : 0, 0, 1) * bl)
        backplate.style.opacity = cl(bl * 1.5, 0, 1).toFixed(3)
        backplate.style.transform = 'scale(' + bsc.toFixed(3) + ')'
      }
    }

    /* Event listeners */
    const onPointerMove = (e) => setP(e)
    const onPointerDown = (e) => {
      setP(e)
      P.down = true
      if (overChar(P.x, P.y)) {
        P.drag = true; P.lx = e.clientX; P.ly = e.clientY
        dragMoved = 0; downT = performance.now()
      }
      const i = pill(P.x, P.y, BTN)
      if (ph === 'idle' && i.sd < 90 * S) pressV += 7
    }
    const onPointerUp = (e) => {
      if (P.drag && ph === 'hold' && dragMoved < 8 && performance.now() - downT < 400) {
        triggerRoar()
      }
      P.down = false; P.drag = false
      if (e.pointerType === 'touch') P.inW = false
    }
    const onPointerLeave = () => { P.inW = false }

    const onBtnClick = (e) => {
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

    const onDblClick = (e) => {
      if (overChar(P.x, P.y)) { yawU = 0; pitchU = 0; yawVel = 0 }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    container.addEventListener('pointerleave', onPointerLeave)
    buttonEl.addEventListener('click', onBtnClick)
    container.addEventListener('dblclick', onDblClick)

    /* Keyboard controls matching reference */
    const onKeyDown = (e) => {
      const k = e.key
      if (k === 'f' || k === 'F') { fwdI = (fwdI + 1) % 4; applyFace() }
      else if (k === 'ArrowUp') { CFG.eyeUp = Math.max(0, CFG.eyeUp - 0.004); applyDims(); e.preventDefault() }
      else if (k === 'ArrowDown') { CFG.eyeUp += 0.004; applyDims(); e.preventDefault() }
      else if (k === '[') { CFG.headHalf = Math.max(0.02, CFG.headHalf - 0.003); applyDims() }
      else if (k === ']') { CFG.headHalf += 0.003; applyDims() }
      else if (k === 'r' || k === 'R') { yawU = 0; pitchU = 0; yawVel = 0 }
    }
    window.addEventListener('keydown', onKeyDown)

    /* Resize observer */
    const ro = new ResizeObserver(() => layout())
    ro.observe(container)
    window.addEventListener('resize', layout)
    layout()

    /* Render loop — exactly matching reference lines 401-423 */
    let last = performance.now(), el = 0, rafId = 0

    function frame(now) {
      rafId = requestAnimationFrame(frame)
      if (document.hidden) { last = now; return }
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000))
      last = now; el += dt

      step(dt, el)

      /* Pass 1: Render face mask if infection active */
      if (model && (inf > 0.002 || face > 0.01)) {
        SI.uMode.value = 1
        renderer.render(scene, cam)
        cx2.clearRect(0, 0, mw, mh)
        cx2.drawImage(g3, 0, 0, mw, mh)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cB)
        SI.uMode.value = 0
      }

      /* Pass 2: Beauty render of 3D scene */
      renderer.render(scene, cam)

      /* Pass 3: Liquid overlay */
      let x0 = cx - hl - rad - 90, x1 = cx + hl + rad + 90, y0 = cy - rad - 90, y1 = cy + rad + 90
      function ext(arr, n) {
        for (let i = 0; i < n; i++) {
          const z = arr[i * 3 + 2]
          if (z > 0) {
            const a = arr[i * 3], b = arr[i * 3 + 1], p = z + 70
            x0 = Math.min(x0, a - p); x1 = Math.max(x1, a + p)
            y0 = Math.min(y0, b - p); y1 = Math.max(y1, b + p)
          }
        }
      }
      ext(PA, TN * TP); ext(AA, 24); ext(QA, 8)

      const bw = Math.min(0.40 * H, 0.48 * W)
      const cbx0 = chestS.x - bw, cbx1 = chestS.x + bw, cby0 = chestS.y - 0.44 * H, cby1 = chestS.y + 0.44 * H
      const covOn = inf > 0.002

      if (covOn) {
        x0 = Math.min(x0, cbx0); x1 = Math.max(x1, cbx1)
        y0 = Math.min(y0, cby0); y1 = Math.max(y1, cby1)
      }

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(U.uRes, ov.width, ov.height)
      gl.uniform1f(U.uDpr, dpr)
      gl.uniform1f(U.uT, reduce ? 0 : el)
      gl.uniform1f(U.uPress, press)
      gl.uniform2f(U.uC, cx, cy)
      gl.uniform2f(U.uHR, hl * ps, rad * ps)
      gl.uniform4f(U.uBox, x0, y0, x1, y1)
      gl.uniform3fv(U.uP, PA)
      gl.uniform3fv(U.uA, AA)
      gl.uniform3fv(U.uQ, QA)
      gl.uniform2f(U.uCss, W, H)
      gl.uniform2f(U.uCh, chestS.x, chestS.y)
      gl.uniform1f(U.uFr, G.fr)
      gl.uniform1f(U.uDrip, G.drip)
      gl.uniform1f(U.uCov, covOn ? 1 : 0)
      gl.uniform1f(U.uFaceOn, face)
      gl.uniform4f(U.uCB, cbx0, cby0, cbx1, cby1)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    rafId = requestAnimationFrame(frame)

    /* Expose interactions to parent if requested */
    if (interactionRef) {
      interactionRef.current = {
        begin: (e) => {
          P.drag = true; P.lx = e.clientX; P.ly = e.clientY
          dragMoved = 0; downT = performance.now()
        },
        hover: (e) => setP(e),
        leave: () => { P.inW = false },
        nudge: (yaw, pitch) => {
          yawU += yaw; pitchU = cl(pitchU + pitch, -0.55, 0.55)
        },
      }
    }

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', layout)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointerleave', onPointerLeave)
      buttonEl.removeEventListener('click', onBtnClick)
      container.removeEventListener('dblclick', onDblClick)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('portfolio-theme-change', applyThemeLights)
      themeObserver.disconnect()

      gl.deleteTexture(tex)
      gl.deleteProgram(prog)
      renderer.dispose()
    }
  }, [interactionRef])

  return (
    <div className="hero-model-canvas absolute inset-0 z-[3]" ref={containerRef}>
      <canvas ref={g3Ref} className="absolute inset-0 w-full h-full pointer-events-none" />
      <canvas ref={ovRef} className="symbiote-overlay" aria-hidden="true" />
      <div
        ref={hitAreaRef}
        className="hero-model-hit-area absolute z-[4] top-[9%] left-1/2 h-[67%] w-[min(58vw,560px)] -translate-x-1/2 outline-none cursor-grab active:cursor-grabbing touch-none pointer-events-auto max-[520px]:top-[17%] max-[520px]:h-[55%] max-[520px]:w-[min(90vw,440px)] min-[521px]:max-[820px]:top-[12%] min-[521px]:max-[820px]:h-[62%] min-[521px]:max-[820px]:w-[min(76vw,620px)] min-[821px]:max-[999px]:top-[12%] min-[821px]:max-[999px]:h-[58%] min-[821px]:max-[999px]:w-[min(58vw,520px)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--hero-light-rose)_78%,transparent)] focus-visible:-outline-offset-8 focus-visible:rounded-[45%]"
        role="button"
        tabIndex={0}
        aria-label="Drag to rotate Ashok’s 3D portrait, or use arrow keys"
      />
    </div>
  )
}
