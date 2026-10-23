import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader() {
  // Always show on initial visit and on every page reload
  const [visible, setVisible] = useState(true)
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const venomHeadRef = useRef(null)

  useEffect(() => {
    if (!visible || !rootRef.current) return

    const finish = () => {
      setVisible(false)
      window.dispatchEvent(new Event('portfolio:ready'))
    }

    // Audio: Venom roar sound effect
    const roarAudio = new Audio('/sounds/venom-sound.mpeg')
    roarAudio.volume = 0.7
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

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Check theme
    const isLight = document.documentElement.dataset.theme === 'light'
    const fluidColor = isLight ? '#06080d' : '#020306'

    // -------------------------------------------------------------------------
    // Viscous Fluid Symbiote Streams crawling slowly from all 4 borders
    // Each stream has a crawling head and trailing undulating liquid globules
    // -------------------------------------------------------------------------
    const STREAM_COUNT = 18
    const streams = []

    for (let i = 0; i < STREAM_COUNT; i++) {
      const angle = (i / STREAM_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.22
      const spawnDist = Math.max(W, H) * 0.62 + Math.random() * 80
      const startX = W / 2 + Math.cos(angle) * spawnDist
      const startY = H / 2 + Math.sin(angle) * spawnDist

      const blobCount = 5 + Math.floor(Math.random() * 4)
      const baseR = 16 + Math.random() * 18
      const speed = 0.75 + Math.random() * 0.4
      const waveFreq = 2.0 + Math.random() * 2.5
      const waveAmp = 40 + Math.random() * 50
      const phase = Math.random() * Math.PI * 2

      streams.push({
        id: i,
        startX,
        startY,
        angle,
        blobCount,
        baseR,
        speed,
        waveFreq,
        waveAmp,
        phase,
        progress: 0,
        // Trailing chain of fluid blobs forming the stream
        blobs: Array.from({ length: blobCount }, (_, bIdx) => ({
          lag: bIdx * 0.045,
          scale: 1 - bIdx * 0.12,
          x: startX,
          y: startY,
          r: baseR * (1 - bIdx * 0.1),
        })),
      })
    }

    // Detached dripping droplets
    const droplets = []
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.max(W, H) * 0.5 + Math.random() * 120
      droplets.push({
        startX: W / 2 + Math.cos(angle) * dist,
        startY: H / 2 + Math.sin(angle) * dist,
        r: 10 + Math.random() * 16,
        progress: 0,
        delay: Math.random() * 0.4,
        speed: 0.6 + Math.random() * 0.5,
        curv: (Math.random() - 0.5) * 80,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // Global timeline state
    const sim = {
      streamProgress: 0, // 0 to 1 (slow, takes ~3.2s)
      centerPoolProgress: 0, // radius multiplier for central coalesced liquid
      venomHeadScale: 0.05,
      venomHeadOpacity: 0,
      jawOpen: 0,
    }

    let animId = 0
    let startTime = performance.now()

    const render = (now) => {
      animId = requestAnimationFrame(render)
      const t = (now - startTime) * 0.001
      ctx.clearRect(0, 0, W, H)

      const cx = W / 2
      const cy = H / 2

      // 1. Draw each crawling liquid stream
      streams.forEach((st) => {
        const streamProg = Math.min(1, Math.max(0, sim.streamProgress * st.speed))
        st.progress = streamProg

        if (streamProg <= 0.001) return

        const nx = -Math.sin(st.angle)
        const ny = Math.cos(st.angle)

        // Update trailing globules along the stream
        st.blobs.forEach((b, bIdx) => {
          const blobProg = Math.min(1, Math.max(0, streamProg - b.lag))
          if (blobProg <= 0) return

          // Viscous non-linear trickle curve
          const ease = blobProg < 0.5 ? 2 * blobProg * blobProg : -1 + (4 - 2 * blobProg) * blobProg

          const straightX = st.startX + (cx - st.startX) * ease
          const straightY = st.startY + (cy - st.startY) * ease

          const wave = Math.sin(t * st.waveFreq + st.phase + bIdx * 0.4) * st.waveAmp * (1 - ease * 0.6)
          b.x = straightX + nx * wave
          b.y = straightY + ny * wave

          // Fluid squash & stretch: when moving fast, stretch radius
          const squash = 1 + 0.15 * Math.sin(t * 4 + bIdx)
          const currentR = b.r * squash * Math.min(1, blobProg * 3)

          ctx.beginPath()
          ctx.arc(b.x, b.y, Math.max(2, currentR), 0, Math.PI * 2)
          ctx.fillStyle = fluidColor
          ctx.fill()
        })
      });

      // 2. Draw detached trickling droplets
      droplets.forEach((d) => {
        const relProg = Math.min(1, Math.max(0, (sim.streamProgress - d.delay) * d.speed))
        if (relProg <= 0.001) return

        const ease = relProg < 0.5 ? 2 * relProg * relProg : -1 + (4 - 2 * relProg) * relProg
        const straightX = d.startX + (cx - d.startX) * ease
        const straightY = d.startY + (cy - d.startY) * ease

        const curve = Math.sin(ease * Math.PI) * d.curv
        const curX = straightX - Math.sin(d.phase) * curve
        const curY = straightY + Math.cos(d.phase) * curve

        ctx.beginPath()
        ctx.arc(curX, curY, d.r * Math.min(1, relProg * 2.5), 0, Math.PI * 2)
        ctx.fillStyle = fluidColor
        ctx.fill()
      })

      // 3. Central pooled fluid mass that directly swells as streams arrive
      if (sim.centerPoolProgress > 0.01) {
        // Living surface tension wobble
        const wobble = Math.sin(t * 3.6) * 10 + Math.cos(t * 2.8) * 8
        const r = sim.centerPoolProgress * (Math.min(W, H) * 0.22) + wobble

        ctx.beginPath()
        ctx.arc(cx, cy, Math.max(2, r), 0, Math.PI * 2)
        ctx.fillStyle = fluidColor
        ctx.fill()
      }
    }

    animId = requestAnimationFrame(render)

    // -------------------------------------------------------------------------
    // MASTER TIMELINE: PACE CALIBRATED FOR DRAMATIC LIQUID FLUID EFFECT (4.8s total)
    // -------------------------------------------------------------------------
    const tl = gsap.timeline({
      onComplete: finish,
    })

    // Phase 1 (0.1s to 2.8s): Fluid streams slowly slither & ooze from all directions
    tl.to(
      sim,
      {
        streamProgress: 1.0,
        duration: 2.8,
        ease: 'power1.inOut',
      },
      0.1
    )

    // Phase 2 (1.8s to 3.2s): Fluid arrives at center and swells into the coalesced mass
    tl.to(
      sim,
      {
        centerPoolProgress: 1.0,
        duration: 1.4,
        ease: 'power2.out',
      },
      1.8
    )

    // Phase 3 (3.1s to 3.8s): The coalesced fluid mass forms the FULL VENOM HEAD!
    tl.to(
      sim,
      {
        venomHeadScale: 1.0,
        venomHeadOpacity: 1.0,
        jawOpen: 1.0,
        duration: 0.75,
        ease: 'back.out(1.6)',
        onUpdate: () => {
          if (!venomHeadRef.current) return
          venomHeadRef.current.style.opacity = sim.venomHeadOpacity
          venomHeadRef.current.style.transform = `translate(-50%, -50%) scale(${sim.venomHeadScale})`

          const lowerJaw = venomHeadRef.current.querySelector('.venom-jaw-lower')
          if (lowerJaw) {
            lowerJaw.style.transform = `translateY(${sim.jawOpen * 24}px)`
          }
        },
      },
      3.1
    )

    // EXACT TIMING: Roar sound plays right as the fluid forms the complete Venom head!
    tl.call(
      () => {
        playRoar()
      },
      null,
      3.15
    )

    // Phase 4 (3.9s to 4.4s): Venom eyes narrow and jaws snap closed!
    tl.to(
      sim,
      {
        jawOpen: 0.0,
        venomHeadScale: 0.88,
        duration: 0.42,
        ease: 'power3.in',
        onUpdate: () => {
          if (!venomHeadRef.current) return
          venomHeadRef.current.style.transform = `translate(-50%, -50%) scale(${sim.venomHeadScale})`
          const lowerJaw = venomHeadRef.current.querySelector('.venom-jaw-lower')
          if (lowerJaw) {
            lowerJaw.style.transform = `translateY(${sim.jawOpen * 24}px)`
          }
        },
      },
      3.95
    )

    // Head snaps shut & dissolves
    tl.to(
      sim,
      {
        venomHeadOpacity: 0.0,
        venomHeadScale: 0.1,
        centerPoolProgress: 0.0,
        duration: 0.45,
        ease: 'power2.in',
        onUpdate: () => {
          if (!venomHeadRef.current) return
          venomHeadRef.current.style.opacity = sim.venomHeadOpacity
          venomHeadRef.current.style.transform = `translate(-50%, -50%) scale(${sim.venomHeadScale})`
        },
      },
      4.35
    )

    // Phase 5 (4.5s to 5.0s): Smooth veil blur dissolve to reveal portfolio
    tl.to(
      rootRef.current,
      {
        opacity: 0,
        filter: 'blur(18px)',
        duration: 0.55,
        ease: 'power2.inOut',
      },
      4.55
    )

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      tl.kill()
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className="venom-preloader-root fixed inset-0 z-[99999] pointer-events-auto flex items-center justify-center overflow-hidden select-none transition-colors duration-300"
      style={{
        background: 'var(--base-bg, #000000)',
      }}
      aria-label="Venom Preloader"
      role="status"
    >
      {/* 
        ADVANCED 3D LIQUID METABALL FILTER:
        Uses Gaussian Blur + High-Contrast Color Matrix + 3D Specular Point Lighting
        Transforms 2D fluid canvas into viscous, shiny, organic black symbiote liquid!
      */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="venom-3d-fluid" x="-30%" y="-30%" width="160%" height="160%">
            {/* 1. Viscous Surface Tension Blur */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />

            {/* 2. Alpha Threshold (Liquid Meniscus Snapping) */}
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 48 -18"
              result="goo"
            />

            {/* 3. 3D Wet Specular Lighting on Fluid Curvature */}
            <feSpecularLighting
              in="blur"
              surfaceScale="7"
              specularConstant="1.4"
              specularExponent="28"
              lightingColor="#ffffff"
              result="specular"
            >
              <fePointLight x="800" y="400" z="450" />
            </feSpecularLighting>

            <feComposite in="specular" in2="goo" operator="in" result="specularCut" />

            <feMerge>
              <feMergeNode in="goo" />
              <feMergeNode in="specularCut" />
            </feMerge>
          </filter>

          <filter id="venomEyeGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="glow1" />
            <feGaussianBlur stdDeviation="16" result="glow2" />
            <feMerge>
              <feMergeNode in="glow2" />
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Viscous Fluid Canvas with 3D Specular Surface Tension Filter */}
      <div
        className="pointer-events-none absolute inset-0 z-0 size-full"
        style={{ filter: 'url(#venom-3d-fluid)' }}
      >
        <canvas ref={canvasRef} className="size-full" />
      </div>

      {/* 
        FULL VENOM HEAD ENTITY:
        Forms directly inside the gathered liquid pool as all streams collide!
      */}
      <div
        ref={venomHeadRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-64 sm:size-80 will-change-transform"
        style={{
          transform: 'translate(-50%, -50%) scale(0.05)',
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 200"
          className="size-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Full Venom Head & Jaw Silhouette (Glistening Viscous Body) */}
          <path
            d="M 100 20 C 155 20, 175 58, 170 102 C 165 138, 138 165, 100 176 C 62 165, 35 138, 30 102 C 25 58, 45 20, 100 20 Z"
            fill="var(--base-bg, #030508)"
            stroke="rgba(255, 255, 255, 0.28)"
            strokeWidth="3.5"
            filter="drop-shadow(0 0 26px rgba(0,0,0,0.95))"
          />

          {/* Temples & Cheek Contour lines */}
          <path
            d="M 45 75 Q 60 110, 85 135"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="2.2"
            fill="none"
          />
          <path
            d="M 155 75 Q 140 110, 115 135"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="2.2"
            fill="none"
          />

          {/* Left Slanted Sharp Almond Eye */}
          <path
            d="M 44 64 C 56 48, 80 54, 90 68 C 82 80, 60 78, 44 64 Z"
            fill="#ffffff"
            filter="url(#venomEyeGlowFilter)"
            stroke="rgba(98, 168, 232, 0.95)"
            strokeWidth="2.8"
          />

          {/* Right Slanted Sharp Almond Eye */}
          <path
            d="M 156 64 C 144 48, 120 54, 110 68 C 118 80, 140 78, 156 64 Z"
            fill="#ffffff"
            filter="url(#venomEyeGlowFilter)"
            stroke="rgba(98, 168, 232, 0.95)"
            strokeWidth="2.8"
          />

          {/* Upper Jaw Fangs (Wide curved grin) */}
          <path
            d="M 60 102 L 66 116 L 72 102 L 79 118 L 86 102 L 93 120 L 100 102 L 107 120 L 114 102 L 121 118 L 128 102 L 134 116 L 140 102"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="drop-shadow(0 0 6px rgba(255,255,255,0.85))"
          />

          {/* Lower Jaw Fangs (Snaps open on roar, then snaps shut!) */}
          <g className="venom-jaw-lower transition-transform duration-75">
            <path
              d="M 62 125 L 68 112 L 74 128 L 81 110 L 88 130 L 100 108 L 112 130 L 119 110 L 126 128 L 132 112 L 138 125"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0 0 6px rgba(255,255,255,0.85))"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
